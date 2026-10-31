// Travel companions and shared pets (31 Oct 2026, Nancy approved docs/companions-mockup-2026-10-31.html: "Yes your mock up looks good").
// Invite, then accept: nothing is shared before a yes, and either side can leave at any time; leaving removes only the link.
//   POST /crew/invite  {kind:'person', to:<contributor id>, type:'partner'|'family'|'buddy'}
//                      {kind:'pet', pet:<pet id>, to:<contributor id>}        (only an owner or co-owner of the pet)
//   POST /crew/inbox   -> {me, incoming:[...], outgoing:[...], companions:[...], pets:[...]}
//   POST /crew/answer  {id, accept:true|false}   (only the person invited)
//   POST /crew/cancel  {id}                       (only the sender)
//   POST /crew/leave   {kind:'person', other:<contributor id>} | {kind:'pet', pet:<pet id>, who?:<contributor id>}
//   GET  /crew/people?q=   public travelers to invite (name, slug, avatar, id; never a place)
//   GET  /crew/public?slug=<contributor slug> | ?pet=<pet slug>   accepted links only, for "Travels with"
// Accepted person links are written to both Contributors items' `crew` field; accepted pet co-owners to the pet's `shared-with`.
// Invites and companion types live in WIRE_KV. Members can no longer write `crew` directly (removed from MEMBER_WRITABLE).
// Privacy: no home base, no city, no current place is ever returned; only names, avatars, slugs and the companion type.
// A shared pet's countries stay on the pet's own record and never count toward a person's total.
import { findContributor, listContributors, webflow } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';

export const TYPES = Object.freeze({ partner: 'Partner', family: 'Family', buddy: 'Travel buddy' });
const VISIBILITY_OFF = '1423c8d17c2060776541377f76ea0b31';
const INVITES_PER_HOUR = 20;
const ID = /^[a-f0-9]{24}$/i;

const inKey = (to) => `crew:in:${to}`;
const outKey = (from) => `crew:out:${from}`;
export const pairKey = (a, b) => `crew:type:${[a, b].sort().join('|')}`;

async function getList(env, key) {
  try { return JSON.parse((await env.WIRE_KV.get(key)) || '[]'); } catch { return []; }
}
async function putList(env, key, list) {
  if (list.length) await env.WIRE_KV.put(key, JSON.stringify(list.slice(-50)));
  else await env.WIRE_KV.delete(key);
}

function person(item) {
  const f = item?.fieldData || {};
  return { id: item.id, name: f.name || '', slug: f.slug || '', avatar: f.avatar?.url || '' };
}
const refs = (v) => (Array.isArray(v) ? v.filter((x) => ID.test(x)) : []);

async function getItem(env, fetchImpl, collection, id) {
  try { return await webflow(env, fetchImpl, `/collections/${collection}/items/${id}`); } catch { return null; }
}
async function patchItem(env, fetchImpl, collection, item, fieldData) {
  await webflow(env, fetchImpl, `/collections/${collection}/items/${item.id}`, { method: 'PATCH', body: JSON.stringify({ fieldData }) });
  if (!item.isDraft) {
    await webflow(env, fetchImpl, `/collections/${collection}/items/publish`, { method: 'POST', body: JSON.stringify({ itemIds: [item.id] }) });
  }
}
function petOwners(pet) {
  const f = pet?.fieldData || {};
  return [f.owner, ...refs(f['shared-with'])].filter((x) => ID.test(String(x || '')));
}

/** Link two contributors both ways (accept) or unlink both ways (leave). */
async function setLink(env, fetchImpl, a, b, on) {
  const C = env.CONTRIBUTORS_COLLECTION_ID;
  for (const [x, y] of [[a, b], [b, a]]) {
    const item = await getItem(env, fetchImpl, C, x);
    if (!item) continue;
    const now = refs(item.fieldData?.crew);
    const next = on ? [...new Set([...now, y])] : now.filter((id) => id !== y);
    if (next.length !== now.length) await patchItem(env, fetchImpl, C, item, { crew: next });
  }
}

async function setCoOwner(env, fetchImpl, petId, who, on) {
  const P = env.PETS_COLLECTION_ID;
  const pet = await getItem(env, fetchImpl, P, petId);
  if (!pet) return false;
  const now = refs(pet.fieldData?.['shared-with']);
  const next = on ? [...new Set([...now, who])] : now.filter((id) => id !== who);
  if (next.length !== now.length) await patchItem(env, fetchImpl, P, pet, { 'shared-with': next });
  return true;
}

async function body(request) {
  try { return await request.json(); } catch { return null; }
}

async function me(request, env, fetchImpl) {
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return { res: auth };
  const item = await findContributor(env, fetchImpl, auth.memberId);
  if (!item) return { res: reply({ error: 'Your profile page has not been created yet. Give it a minute and reload.' }, 404) };
  return { item, memberId: auth.memberId };
}

export async function handleCrew(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.CONTRIBUTORS_COLLECTION_ID || !env.WIRE_KV) {
    return reply({ error: 'Travel companions are not switched on yet.' }, 503);
  }
  const path = new URL(request.url).pathname;
  const who = await me(request, env, fetchImpl);
  if (who.res) return who.res;
  const mine = who.item;
  const myId = mine.id;

  if (path === '/crew/inbox') {
    const incoming = await getList(env, inKey(myId));
    const outgoing = await getList(env, outKey(myId));
    const ids = refs(mine.fieldData?.crew);
    const all = ids.length ? await listContributors(env, fetchImpl) : [];
    const companions = [];
    for (const id of ids) {
      const it = all.find((x) => x.id === id);
      if (!it || !refs(it.fieldData?.crew).includes(myId)) continue; // both sides must hold the link
      companions.push({ ...person(it), type: (await env.WIRE_KV.get(pairKey(myId, id))) || 'buddy' });
    }
    let pets = [];
    if (env.PETS_COLLECTION_ID) {
      const page = await webflow(env, fetchImpl, `/collections/${env.PETS_COLLECTION_ID}/items?limit=100`).catch(() => null);
      pets = (page?.items || []).filter((p) => petOwners(p).includes(myId))
        .map((p) => ({ id: p.id, name: p.fieldData?.name || '', slug: p.fieldData?.slug || '', owner: p.fieldData?.owner === myId,
          coOwners: refs(p.fieldData?.['shared-with']).map((id) => person(all.find((x) => x.id === id) || { id, fieldData: {} })) }));
    }
    return reply({ ok: true, me: person(mine), incoming, outgoing, companions, pets, types: TYPES });
  }

  if (request.method !== 'POST') return reply({ error: 'method' }, 405);
  const b = await body(request);
  if (!b || typeof b !== 'object') return reply({ error: 'bad json' }, 400);

  if (path === '/crew/invite') {
    const to = String(b.to || '');
    if (!ID.test(to) || to === myId) return reply({ error: 'Pick another traveler.' }, 400);
    if (!(await rateLimit(env, 'crew-invite', who.memberId, INVITES_PER_HOUR, now))) return reply({ error: 'That is a lot of invites for now. Try again later.' }, 429);
    const target = await getItem(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID, to);
    if (!target || target.isDraft || target.fieldData?.visibility === VISIBILITY_OFF) return reply({ error: 'That traveler cannot be invited.' }, 404);
    let invite;
    if (b.kind === 'pet') {
      const pet = env.PETS_COLLECTION_ID && ID.test(String(b.pet || '')) ? await getItem(env, fetchImpl, env.PETS_COLLECTION_ID, b.pet) : null;
      if (!pet || !petOwners(pet).includes(myId)) return reply({ error: 'Only an owner can share this pet.' }, 403);
      if (petOwners(pet).includes(to)) return reply({ error: 'They already share this pet.' }, 409);
      invite = { kind: 'pet', pet: pet.id, petName: pet.fieldData?.name || '' };
    } else {
      const type = Object.keys(TYPES).includes(b.type) ? b.type : 'buddy';
      if (refs(mine.fieldData?.crew).includes(to) && refs(target.fieldData?.crew).includes(myId)) return reply({ error: 'You already travel together here.' }, 409);
      invite = { kind: 'person', type };
    }
    const incoming = await getList(env, inKey(to));
    if (incoming.some((i) => i.from === myId && i.kind === invite.kind && (i.pet || '') === (invite.pet || ''))) return reply({ error: 'Your invite is already waiting.' }, 409);
    const id = `${now.toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const p = person(mine);
    const t = person(target);
    const full = { id, ...invite, from: myId, fromName: p.name, fromSlug: p.slug, fromAvatar: p.avatar, to, toName: t.name, toSlug: t.slug, at: new Date(now).toISOString() };
    await putList(env, inKey(to), [...incoming, full]);
    await putList(env, outKey(myId), [...(await getList(env, outKey(myId))), full]);
    return reply({ ok: true, invite: full });
  }

  if (path === '/crew/answer' || path === '/crew/cancel') {
    const id = String(b.id || '');
    const answering = path === '/crew/answer';
    const owner = answering ? myId : null;
    let inv;
    if (answering) inv = (await getList(env, inKey(myId))).find((i) => i.id === id);
    else inv = (await getList(env, outKey(myId))).find((i) => i.id === id);
    if (!inv) return reply({ error: 'That invite is no longer waiting.' }, 404);
    if (answering && b.accept === true) {
      if (inv.kind === 'pet') {
        const pet = await getItem(env, fetchImpl, env.PETS_COLLECTION_ID, inv.pet);
        if (!pet || !petOwners(pet).includes(inv.from)) return reply({ error: 'That pet is no longer shared by the sender.' }, 410);
        await setCoOwner(env, fetchImpl, inv.pet, owner, true);
      } else {
        await setLink(env, fetchImpl, inv.from, myId, true);
        await env.WIRE_KV.put(pairKey(inv.from, myId), inv.type || 'buddy');
      }
    }
    await putList(env, inKey(inv.to), (await getList(env, inKey(inv.to))).filter((i) => i.id !== id));
    await putList(env, outKey(inv.from), (await getList(env, outKey(inv.from))).filter((i) => i.id !== id));
    return reply({ ok: true, accepted: answering && b.accept === true });
  }

  if (path === '/crew/leave') {
    if (b.kind === 'pet') {
      const pet = env.PETS_COLLECTION_ID && ID.test(String(b.pet || '')) ? await getItem(env, fetchImpl, env.PETS_COLLECTION_ID, b.pet) : null;
      if (!pet) return reply({ error: 'Pet not found.' }, 404);
      const target = ID.test(String(b.who || '')) ? String(b.who) : myId;
      // A co-owner may leave; the main owner may remove a co-owner. Nobody removes the main owner.
      const allowed = target === myId ? refs(pet.fieldData?.['shared-with']).includes(myId) : pet.fieldData?.owner === myId;
      if (!allowed) return reply({ error: 'Not allowed.' }, 403);
      await setCoOwner(env, fetchImpl, pet.id, target, false);
      return reply({ ok: true });
    }
    const other = String(b.other || '');
    if (!ID.test(other)) return reply({ error: 'Pick a companion.' }, 400);
    await setLink(env, fetchImpl, myId, other, false);
    await env.WIRE_KV.delete(pairKey(myId, other));
    return reply({ ok: true });
  }
  return reply({ error: 'not found' }, 404);
}

const pubCors = { 'Access-Control-Allow-Origin': '*', 'Vary': 'Origin' };
function pub(b, status = 200, cache = 0) {
  return new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store', ...pubCors } });
}

/** Public reads: people to invite, and accepted links for "Travels with". */
export async function handleCrewPublic(request, env, { fetchImpl = fetch } = {}) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...pubCors, 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Max-Age': '86400' } });
  if (!env.WEBFLOW_TOKEN || !env.CONTRIBUTORS_COLLECTION_ID) return pub({ ok: false }, 503);
  const url = new URL(request.url);
  const live = async (collection) => {
    const out = [];
    for (let offset = 0; offset < 1000; offset += 100) {
      const page = await webflow(env, fetchImpl, `/collections/${collection}/items/live?limit=100&offset=${offset}`);
      out.push(...(page?.items || []));
      if ((page?.items || []).length < 100) break;
    }
    return out;
  };
  const people = (await live(env.CONTRIBUTORS_COLLECTION_ID)).filter((c) => c.fieldData?.visibility !== VISIBILITY_OFF);
  if (url.pathname === '/crew/people') {
    const q = (url.searchParams.get('q') || '').trim().toLowerCase().replace(/^@/, '');
    if (q.length < 2) return pub({ ok: true, people: [] });
    const hits = people.filter((c) => (c.fieldData?.name || '').toLowerCase().includes(q) || (c.fieldData?.slug || '').includes(q)).slice(0, 8).map(person);
    return pub({ ok: true, people: hits }, 200, 300);
  }
  const slug = url.searchParams.get('slug');
  const petSlug = url.searchParams.get('pet');
  if (petSlug && env.PETS_COLLECTION_ID) {
    const pet = (await live(env.PETS_COLLECTION_ID)).find((p) => p.fieldData?.slug === petSlug);
    if (!pet) return pub({ ok: true, owners: [] }, 200, 600);
    const owners = petOwners(pet).map((id) => people.find((c) => c.id === id)).filter(Boolean).map(person);
    return pub({ ok: true, owners }, 200, 600);
  }
  const it = people.find((c) => c.fieldData?.slug === slug);
  if (!it) return pub({ ok: true, companions: [], pets: [] }, 200, 600);
  const companions = [];
  for (const id of refs(it.fieldData?.crew)) {
    const o = people.find((c) => c.id === id);
    if (!o || !refs(o.fieldData?.crew).includes(it.id)) continue;
    const type = (env.WIRE_KV && (await env.WIRE_KV.get(pairKey(it.id, id)))) || 'buddy';
    companions.push({ ...person(o), type: TYPES[type] || TYPES.buddy });
  }
  let pets = [];
  if (env.PETS_COLLECTION_ID) {
    pets = (await live(env.PETS_COLLECTION_ID)).filter((p) => p.fieldData?.['is-public'] && refs(p.fieldData?.['shared-with']).includes(it.id))
      .map((p) => ({ name: p.fieldData?.name || '', slug: p.fieldData?.slug || '', avatar: p.fieldData?.avatar?.url || '' }));
  }
  return pub({ ok: true, companions, pets }, 200, 600);
}
