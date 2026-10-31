// Souvenir collections (31 Oct 2026, Nancy: "Add postcards and shot glasses, private by default, build it (I want categories linked
// to somehow understand how many people use what category)"; "Private by default with opt in").
// A member keeps collections (magnets, Starbucks mugs, coins, keychains, stamps, postcards, shot glasses, patches, pins, snow globes,
// something else). Each item: category, country, optional city, year and caption, and a photo already cleaned in the browser.
//   POST /collections/mine    -> {categories, items, shown}          (member)
//   POST /collections/add     {category, own?, country, city?, year?, caption?, photo?}
//   POST /collections/delete  {id}                                    (own items only)
//   POST /collections/show    {category, show: true|false}            (per-collection opt-in)
//   GET  /collections/public?slug=<contributor slug>                  shown collections only
// Privacy: every item is stored as a CMS draft and is never published, so no CMS page exists for it; only items the member
// switched on are served, by this Worker. Year only, city only, never a date or a place someone is now.
// Counting: the 30-minute job writes, per category, how many members use it (private included), how many show it, how many
// items and how many countries, to the Collection categories collection, so Nancy sees what people collect.
import { findContributor, webflow } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';

const PHOTO = /^https:\/\/res\.cloudinary\.com\/idonvlow\/image\/upload\/[^\s"'<>]+$/;
const MAX_ITEMS = 500;
export const MAX_PHOTOS = 6;
const VISIBILITY_OFF = '1423c8d17c2060776541377f76ea0b31';
export const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s*[—–]\s*/g, ', ').replace(/\s+/g, ' ').trim().slice(0, n);

export async function listAll(env, fetchImpl, collection, live = false) {
  const out = [];
  for (let offset = 0; offset < 5000; offset += 100) {
    const page = await webflow(env, fetchImpl, `/collections/${collection}/items${live ? '/live' : ''}?limit=100&offset=${offset}`);
    const items = page?.items || [];
    out.push(...items);
    if (items.length < 100) break;
  }
  return out;
}

export async function categories(env, fetchImpl) {
  const list = await listAll(env, fetchImpl, env.COLLECTION_CATEGORIES_ID);
  return list.filter((c) => !c.isArchived).sort((a, b) => (a.fieldData?.order || 99) - (b.fieldData?.order || 99));
}

export async function findCountry(env, fetchImpl, name) {
  const n = clean(name, 80);
  if (!n || !env.DESTINATIONS_COLLECTION_ID) return null;
  const page = await webflow(env, fetchImpl, `/collections/${env.DESTINATIONS_COLLECTION_ID}/items?limit=100&name=${encodeURIComponent(n)}`);
  return (page?.items || []).find((i) => String(i.fieldData?.name || '').toLowerCase() === n.toLowerCase()) || null;
}

export function view(item, cats) {
  const f = item.fieldData || {};
  const cat = cats.find((c) => c.id === f.category);
  return {
    id: item.id, category: cat?.fieldData?.slug || '', categoryName: f['own-category-name'] || cat?.fieldData?.name || '',
    country: f.name || '', city: f.city || '', year: f.year || null, caption: f.caption || '', photo: f.photo?.url || '', photos: [f.photo?.url, ...((Array.isArray(f['more-photos']) ? f['more-photos'] : []).map((x) => x?.url))].filter(Boolean),
    shown: f['show-on-profile'] === true,
  };
}

/** Public shelves: shown items only, grouped by collection, countries counted. */
export function shelves(items, cats) {
  const groups = new Map();
  for (const it of items) {
    const v = view(it, cats);
    if (!v.shown) continue;
    const key = v.category === 'other' ? `other:${v.categoryName.toLowerCase()}` : v.category;
    if (!groups.has(key)) groups.set(key, { category: v.category, name: v.categoryName, items: [] });
    const { id, shown, ...pub } = v;
    groups.get(key).items.push(pub);
  }
  return [...groups.values()].map((g) => ({ ...g, countries: new Set(g.items.map((i) => i.country.toLowerCase())).size,
    items: g.items.sort((a, b) => a.country.localeCompare(b.country)) }));
}

export async function handleCollections(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.COLLECTION_ITEMS_ID || !env.COLLECTION_CATEGORIES_ID || !env.WIRE_KV) {
    return reply({ error: 'Collections are not switched on yet.' }, 503);
  }
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  const me = await findContributor(env, fetchImpl, auth.memberId);
  if (!me) return reply({ error: 'Your profile page has not been created yet. Give it a minute and reload.' }, 404);
  let b = {};
  try { b = await request.json(); } catch { b = {}; }
  const path = new URL(request.url).pathname;
  const cats = await categories(env, fetchImpl);
  const C = env.COLLECTION_ITEMS_ID;
  const mine = async () => (await listAll(env, fetchImpl, C)).filter((i) => i.fieldData?.owner === me.id && !i.isArchived);

  if (path === '/collections/mine') {
    const items = (await mine()).map((i) => view(i, cats));
    const shown = {};
    items.forEach((i) => { if (i.shown) shown[i.category] = true; });
    return reply({ ok: true, categories: cats.map((c) => ({ slug: c.fieldData.slug, name: c.fieldData.name })), items, shown });
  }

  if (path === '/collections/add') {
    if (!(await rateLimit(env, 'collections', auth.memberId, 60, now))) return reply({ error: 'That is a lot for one hour. Try again a little later.' }, 429);
    const cat = cats.find((c) => c.fieldData?.slug === b.category);
    if (!cat) return reply({ error: 'Pick a collection.' }, 400);
    const own = cat.fieldData.slug === 'other' ? clean(b.own, 40) : '';
    if (cat.fieldData.slug === 'other' && !own) return reply({ error: 'Name your collection.' }, 400);
    const country = await findCountry(env, fetchImpl, b.country);
    if (!country) return reply({ error: 'Pick a country from the list.' }, 400);
    const year = Number(b.year);
    const list = (Array.isArray(b.photos) ? b.photos : [b.photo]).map((x) => String(x || '')).filter(Boolean);
    if (list.length > MAX_PHOTOS || list.some((x) => !PHOTO.test(x))) return reply({ error: `Up to ${MAX_PHOTOS} photos, uploaded from this page.` }, 400);
    const photo = list[0] || '';
    const existing = await mine();
    if (existing.length >= MAX_ITEMS) return reply({ error: 'That is the most items one profile can hold for now.' }, 400);
    // A new item follows the collection's current choice: shown only if the member already switched this collection on.
    const shown = existing.some((i) => i.fieldData?.category === cat.id && i.fieldData?.['show-on-profile'] === true
      && (cat.fieldData.slug !== 'other' || String(i.fieldData?.['own-category-name'] || '').toLowerCase() === own.toLowerCase()));
    const fieldData = {
      name: country.fieldData.name, slug: `${me.fieldData?.slug || 'm'}-${cat.fieldData.slug}-${now.toString(36)}`.slice(0, 120),
      owner: me.id, category: cat.id, country: country.id, 'own-category-name': own || null,
      city: clean(b.city, 60) || null, year: year >= 1900 && year <= new Date(now).getUTCFullYear() ? Math.round(year) : null,
      caption: clean(b.caption, 140) || null, 'show-on-profile': shown, ...(photo ? { photo: { url: photo, alt: `${cat.fieldData.name}, ${country.fieldData.name}` } } : {}),
      ...(list.length > 1 ? { 'more-photos': list.slice(1).map((url, i) => ({ url, alt: `${cat.fieldData.name}, ${country.fieldData.name}, photo ${i + 2}` })) } : {}),
    };
    const made = await webflow(env, fetchImpl, `/collections/${C}/items`, { method: 'POST', body: JSON.stringify({ isDraft: true, isArchived: false, fieldData }) });
    const item = made?.id ? made : made?.items?.[0];
    return reply({ ok: true, item: view(item || { id: '', fieldData }, cats) });
  }

  if (path === '/collections/delete') {
    const item = (await mine()).find((i) => i.id === b.id);
    if (!item) return reply({ error: 'Not found.' }, 404);
    await webflow(env, fetchImpl, `/collections/${C}/items/${item.id}`, { method: 'DELETE' });
    return reply({ ok: true });
  }

  if (path === '/collections/show') {
    const cat = cats.find((c) => c.fieldData?.slug === b.category);
    if (!cat) return reply({ error: 'Pick a collection.' }, 400);
    const own = clean(b.own, 40).toLowerCase();
    const show = b.show === true;
    const targets = (await mine()).filter((i) => i.fieldData?.category === cat.id && (cat.fieldData.slug !== 'other' || !own || String(i.fieldData?.['own-category-name'] || '').toLowerCase() === own));
    const changed = targets.filter((i) => (i.fieldData?.['show-on-profile'] === true) !== show);
    for (let i = 0; i < changed.length; i += 100) {
      await webflow(env, fetchImpl, `/collections/${C}/items`, { method: 'PATCH', body: JSON.stringify({ items: changed.slice(i, i + 100).map((x) => ({ id: x.id, fieldData: { 'show-on-profile': show } })) }) });
    }
    return reply({ ok: true, show, items: targets.length });
  }
  return reply({ error: 'not found' }, 404);
}

const pubCors = { 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
export async function handleCollectionsPublic(request, env, { fetchImpl = fetch } = {}) {
  const json = (b, s = 200, cache = 0) => new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store', ...pubCors } });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...pubCors, 'Access-Control-Allow-Methods': 'GET' } });
  if (!env.WEBFLOW_TOKEN || !env.COLLECTION_ITEMS_ID || !env.COLLECTION_CATEGORIES_ID) return json({ ok: false }, 503);
  const slug = new URL(request.url).searchParams.get('slug') || '';
  const people = await listAll(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID, true);
  const person = people.find((p) => p.fieldData?.slug === slug && p.fieldData?.visibility !== VISIBILITY_OFF);
  if (!person) return json({ ok: true, shelves: [] }, 200, 600);
  const [cats, items] = await Promise.all([categories(env, fetchImpl), listAll(env, fetchImpl, env.COLLECTION_ITEMS_ID)]);
  return json({ ok: true, shelves: shelves(items.filter((i) => i.fieldData?.owner === person.id && !i.isArchived), cats) }, 200, 600);
}

/** {slug: {members, publicMembers, items, countries}} across all members. */
export function countUsage(items, cats) {
  const out = {};
  for (const c of cats) out[c.id] = { members: new Set(), pub: new Set(), items: 0, countries: new Set() };
  for (const i of items) {
    const f = i.fieldData || {};
    const o = out[f.category];
    if (!o || i.isArchived || !f.owner) continue;
    o.members.add(f.owner); o.items += 1; if (f.country) o.countries.add(f.country);
    if (f['show-on-profile'] === true) o.pub.add(f.owner);
  }
  return Object.fromEntries(Object.entries(out).map(([id, o]) => [id, { members: o.members.size, 'public-members': o.pub.size, items: o.items, countries: o.countries.size }]));
}

export async function runCollectionCounts(env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.COLLECTION_ITEMS_ID || !env.COLLECTION_CATEGORIES_ID) return 'collections count skipped (not configured)';
  const [cats, items] = await Promise.all([categories(env, fetchImpl), listAll(env, fetchImpl, env.COLLECTION_ITEMS_ID)]);
  const counts = countUsage(items, cats);
  const changed = cats.filter((c) => ['members', 'public-members', 'items', 'countries'].some((k) => (c.fieldData?.[k] ?? 0) !== counts[c.id][k]));
  if (!changed.length) return 'collections count unchanged';
  await webflow(env, fetchImpl, `/collections/${env.COLLECTION_CATEGORIES_ID}/items`, { method: 'PATCH', body: JSON.stringify({ items: changed.map((c) => ({ id: c.id, fieldData: { ...counts[c.id], 'counted-at': new Date(now).toISOString() } })) }) });
  return `collections counted: ${changed.map((c) => `${c.fieldData.slug} ${counts[c.id].members}`).join(', ')}`;
}
