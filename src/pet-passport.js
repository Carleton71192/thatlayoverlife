// The Paw Passport page (31 Oct 2026, pet build Phase A). The pet's own page is the Pets template, /pets/<slug>
// (/paw-passport/<slug> already belongs to the Magnus Diary collection, so it is left alone).
//   GET  /pets/public?slug=x   stamps by country, firsts, the pet's own counter, its album (photos from stories the pet is
//                              tagged in), the owner it travels with, Forever traveler. Private answers {ok:true, private:true}.
//   POST /pets/mine            (member) the pets they own or share, with these fields, for the editor on /my-pets
//   POST /pets/update          (member, owner or shared-with only) home city, birthday month, status, visibility, firsts, counter
// Rules: never where a pet is now; city or country only, after the trip; month and year, never a future one; no vet, medical
// or legal advice; birthday month only, never a date. If the owner's profile is Off, the pet page is private too.
import { listLive } from './site-stats.js';
import { listAll } from './collections.js';
import { findContributor, webflow } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';
import { buildAlbum } from './album.js';
import { petBox } from './series.js';

const VISIBILITY_OFF = '1423c8d17c2060776541377f76ea0b31';
export const STATUS = { traveling: '17d3da6001d8ab02e6e4ab8370d34def', forever: '5062a753f95a258be7b9bd9deba0e3ad' };
export const VIS = { public: 'ed940cca9d79b7b6bbd27b1e72537ffc', members: '953d63e252d5259ce2d419811a4b8886', private: '012b3c5864fc21f2169f6dc6df9cbd43' };
export const FIRSTS = { train: 'First train', ferry: 'First ferry', flight: 'First flight', snow: 'First snow', beach: 'First beach', border: 'First border' };
const MONTH_YEAR = /^(January|February|March|April|May|June|July|August|September|October|November|December) (19|20)\d\d$/;
const clean = (v, n) => String(v ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
const key = (vMap, id) => Object.keys(vMap).find((k) => vMap[k] === id) || '';

/** Pure: checks the editor's input. Returns {fieldData} or {error}. */
export function petUpdate(b, now = Date.now()) {
  const fd = {};
  if (b.homeCity !== undefined) fd['home-city'] = clean(b.homeCity, 60) || null;
  if (b.birthdayMonth !== undefined) { const m = Number(b.birthdayMonth); if (b.birthdayMonth !== null && b.birthdayMonth !== '' && !(m >= 1 && m <= 12)) return { error: 'Pick a month.' }; fd['birthday-month'] = m >= 1 && m <= 12 ? Math.round(m) : null; }
  if (b.status !== undefined) { if (!STATUS[b.status]) return { error: 'Unknown status.' }; fd.status = STATUS[b.status]; }
  if (b.visibility !== undefined) { if (!VIS[b.visibility]) return { error: 'Unknown visibility.' }; fd['passport-visibility'] = VIS[b.visibility]; fd['is-public'] = b.visibility === 'public'; }
  if (b.pursuitLabel !== undefined) fd['pursuit-label'] = clean(b.pursuitLabel, 40) || null;
  if (b.pursuitCount !== undefined) { const n = Number(b.pursuitCount); if (!(Number.isInteger(n) && n >= 0 && n <= 100000)) return { error: 'The counter takes a whole number.' }; fd['pursuit-count'] = n; }
  if (b.pursuitCountries !== undefined) fd['pursuit-countries'] = [...new Set(String(b.pursuitCountries || '').toLowerCase().split(/[\s,]+/).filter((c) => /^[a-z]{2}$/.test(c)))].slice(0, 80).join(',') || null;
  if (b.firsts !== undefined) {
    if (!Array.isArray(b.firsts)) return { error: 'Firsts must be a list.' };
    const out = [];
    for (const f of b.firsts.slice(0, 24)) {
      const k = FIRSTS[f?.k] ? f.k : 'own';
      const label = k === 'own' ? clean(f?.label, 40) : FIRSTS[k];
      const when = clean(f?.when, 20);
      if (!label) continue;
      if (when && (!MONTH_YEAR.test(when) || new Date(`1 ${when} UTC`).getTime() > now)) return { error: `${label}: use a past month and year, like May 2025.` };
      out.push({ k, label, where: clean(f?.where, 60), when });
    }
    fd.firsts = out.length ? JSON.stringify(out) : null;
  }
  if (!Object.keys(fd).length) return { error: 'Nothing to save.' };
  return { fieldData: fd };
}

/** Pure: the public passport, or {private:true}. `signedIn` lets Members-only pages through. */
export function passportView(pet, { owner, dest = [], stories = [], signedIn = false } = {}) {
  const f = pet.fieldData || {};
  const vis = key(VIS, f['passport-visibility']) || (f['is-public'] === true ? 'public' : 'private');
  if (!owner || owner.fieldData?.visibility === VISIBILITY_OFF || vis === 'private' || (vis === 'members' && !signedIn)) return { private: true, membersOnly: vis === 'members' && !!owner && owner.fieldData?.visibility !== VISIBILITY_OFF };
  const names = (Array.isArray(f['visited-countries']) ? f['visited-countries'] : []).map((id) => dest.find((d) => d.id === id)?.fieldData?.name).filter(Boolean);
  const listed = String(f['countries-list'] || '').split(',').map((x) => x.trim()).filter(Boolean);
  const countries = [...new Set([...names, ...listed])].sort();
  let firsts = [];
  try { firsts = JSON.parse(f.firsts || '[]'); } catch { firsts = []; }
  const tagged = stories.filter((s) => Array.isArray(s.fieldData?.['pet-co-travelers']) && s.fieldData['pet-co-travelers'].includes(pet.id) && !s.fieldData?.['external-url']);
  return {
    name: f.name, slug: f.slug, avatar: f.avatar?.url || '', homeCity: clean(f['home-city'], 60), forever: f.status === STATUS.forever,
    birthdayMonth: f.status === STATUS.forever ? null : (Number(f['birthday-month']) || null),
    countries, count: countries.length, firsts: Array.isArray(firsts) ? firsts : [],
    pursuit: f['pursuit-label'] ? { label: clean(f['pursuit-label'], 40), count: Number(f['pursuit-count']) || 0, countries: String(f['pursuit-countries'] || '').split(',').filter(Boolean) } : null,
    owner: { name: owner.fieldData.name, slug: owner.fieldData.slug },
    stories: tagged.slice(0, 12).map((s) => ({ slug: s.fieldData.slug, title: s.fieldData.name, image: s.fieldData['hero-image']?.url || '' })),
    album: buildAlbum({ stories: tagged }).filter((c) => c.photos.length),
  };
}

const pubHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
const pub = (b, cache = 300) => new Response(JSON.stringify(b), { headers: { ...pubHeaders, 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store' } });

export async function handlePetPublic(request, env, { fetchImpl = fetch } = {}) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...pubHeaders, 'Access-Control-Allow-Methods': 'GET' } });
  if (!env.WEBFLOW_TOKEN || !env.PETS_COLLECTION_ID) return pub({ ok: false }, 0);
  const url = new URL(request.url);
  if (url.pathname === '/pets/notes') {
    // The landing's "Pet-friendly or pet-tolerant?" row: the five newest notes that use the new fields, writer's experience only.
    const notes = env.PET_NOTES_COLLECTION_ID ? await listLive(env, fetchImpl, env.PET_NOTES_COLLECTION_ID) : [];
    const out = notes.map((n) => ({ story: n.fieldData?.['story-slug'] || '', pet: n.fieldData?.['pet-name'] || '', box: petBox(n), at: n.lastPublished || n.createdOn || '' }))
      .filter((x) => x.box && x.story).sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 5).map(({ at, ...x }) => x);
    return pub({ ok: true, notes: out });
  }
  if (url.pathname === '/pets/featured') {
    const [pets, people] = await Promise.all([listLive(env, fetchImpl, env.PETS_COLLECTION_ID), listLive(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID)]);
    const list = pets.map((p) => ({ p, v: passportView(p, { owner: people.find((c) => c.id === p.fieldData?.owner) }) })).filter((x) => !x.v.private && x.v.avatar)
      .sort((a, b) => (b.p.fieldData?.featured === true) - (a.p.fieldData?.featured === true)).slice(0, 8)
      .map(({ v }) => ({ name: v.name, slug: v.slug, avatar: v.avatar, count: v.count, forever: v.forever }));
    return pub({ ok: true, pets: list });
  }
  const slug = url.searchParams.get('slug') || '';
  const signedIn = url.searchParams.get('member') === '1';
  const pets = await listLive(env, fetchImpl, env.PETS_COLLECTION_ID);
  const pet = pets.find((p) => p.fieldData?.slug === slug);
  if (!pet) return pub({ ok: true, private: true });
  const [people, dest, stories] = await Promise.all([listLive(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID), listAll(env, fetchImpl, env.DESTINATIONS_COLLECTION_ID), listLive(env, fetchImpl, env.STORIES_COLLECTION_ID)]);
  const view = passportView(pet, { owner: people.find((c) => c.id === pet.fieldData?.owner), dest, stories, signedIn });
  // Members-only pages are not cached, so a signed-out visitor never gets a signed-in answer from a cache.
  return pub({ ok: true, ...view }, view.private || signedIn ? 0 : 300);
}

export async function handlePetMember(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.PETS_COLLECTION_ID || !env.WIRE_KV) return reply({ error: 'Not switched on yet.' }, 503);
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  const me = await findContributor(env, fetchImpl, auth.memberId);
  if (!me) return reply({ error: 'Your profile page has not been created yet.' }, 404);
  let b = {};
  try { b = await request.json(); } catch { b = {}; }
  const mine = (await listAll(env, fetchImpl, env.PETS_COLLECTION_ID)).filter((p) => !p.isArchived && (p.fieldData?.owner === me.id || (Array.isArray(p.fieldData?.['shared-with']) && p.fieldData['shared-with'].includes(me.id))));
  const path = new URL(request.url).pathname;
  const view = (p) => { const f = p.fieldData || {}; let firsts = []; try { firsts = JSON.parse(f.firsts || '[]'); } catch { firsts = []; }
    return { id: p.id, slug: f.slug, name: f.name, homeCity: f['home-city'] || '', birthdayMonth: f['birthday-month'] || null, status: key(STATUS, f.status) || 'traveling',
      visibility: key(VIS, f['passport-visibility']) || (f['is-public'] === true ? 'public' : 'private'), firsts, pursuitLabel: f['pursuit-label'] || '', pursuitCount: f['pursuit-count'] || 0, pursuitCountries: f['pursuit-countries'] || '' }; };
  if (path === '/pets/mine') return reply({ ok: true, pets: mine.map(view) });
  if (path === '/pets/update') {
    if (!(await rateLimit(env, 'pets-update', auth.memberId, 120, now))) return reply({ error: 'Try again a little later.' }, 429);
    const pet = mine.find((p) => p.id === b.id);
    if (!pet) return reply({ error: 'Not found.' }, 404);
    const checked = petUpdate(b, now);
    if (checked.error) return reply({ error: checked.error }, 400);
    const r = await webflow(env, fetchImpl, `/collections/${env.PETS_COLLECTION_ID}/items/${pet.id}`, { method: 'PATCH', body: JSON.stringify({ fieldData: checked.fieldData }) });
    // A private passport leaves the live site; choosing Public or Members puts it back. Other edits publish only a live pet.
    const v = checked.fieldData['passport-visibility'];
    if (v === VIS.private) { if (!pet.isDraft) await webflow(env, fetchImpl, `/collections/${env.PETS_COLLECTION_ID}/items/live`, { method: 'DELETE', body: JSON.stringify({ items: [{ id: pet.id }] }) }); }
    else if (v || !pet.isDraft) await webflow(env, fetchImpl, `/collections/${env.PETS_COLLECTION_ID}/items/publish`, { method: 'POST', body: JSON.stringify({ itemIds: [pet.id] }) });
    return reply({ ok: true, pet: view(r?.id ? r : { ...pet, fieldData: { ...pet.fieldData, ...checked.fieldData } }) });
  }
  return reply({ error: 'not found' }, 404);
}
