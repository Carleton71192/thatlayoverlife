// Pursuit stamps and hub counts (31 Oct 2026, Value Playbook Phase 2: "a pursuit stamp is one row: what, where (city or country
// only), when (month and year), one photo"; hubs stay noindex "until it has 6 stories from at least 3 contributors plus a written
// intro"). Same privacy shape as collections: every stamp is a CMS draft, private until the member switches that pursuit on,
// served only by this Worker. Public pages show the year only (the site promises "Stamps show years only"); the month is kept
// for the member. AI writes nothing here.
//   POST /stamps/mine | /stamps/add | /stamps/delete | /stamps/show     (member)
//   GET  /stamps/public?slug=<contributor>                              shown stamps, grouped by pursuit, countries counted
//   GET  /pursuits/status?slug=<pursuit>                                {indexable, liveStories, writers, members}
// The 30-minute job counts, per pursuit: members who picked it, stamps, live stories, distinct writers, and sets Indexable.
import { findContributor, webflow } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';
import { listAll, findCountry, clean } from './collections.js';

const PHOTO = /^https:\/\/res\.cloudinary\.com\/idonvlow\/image\/upload\/[^\s"'<>]+$/;
const VISIBILITY_OFF = '1423c8d17c2060776541377f76ea0b31';
const MAX = 1000;
export const INDEX_RULE = { stories: 6, writers: 3 };

async function pursuits(env, fetchImpl) {
  return (await listAll(env, fetchImpl, env.PURSUITS_COLLECTION_ID)).filter((p) => !p.isArchived);
}

// Work trips (31 Oct 2026, That Work Trip Life): a stamp can be marked "Work trip". Its own words ("what") can name an
// employer, client or colleague, so on every public surface a work-trip stamp reads "A work trip" unless the member ticked
// "I have permission to name them". The member always sees their own words.
export const WORK_TRIPS = 'work-trips';
export const WORK_TRIP_LINE = 'A work trip';
export const isWorkTrip = (f, ps) => f?.['work-trip'] === true || ps.find((x) => x.id === f?.pursuit)?.fieldData?.slug === WORK_TRIPS;
export const publicWhat = (f, ps) => (isWorkTrip(f, ps) && f['permission-to-name'] !== true ? WORK_TRIP_LINE : f.what || '');

export function stampView(s, ps, { owner = false } = {}) {
  const f = s.fieldData || {};
  const p = ps.find((x) => x.id === f.pursuit);
  const v = { pursuit: p?.fieldData?.slug || '', pursuitName: p?.fieldData?.name || '', what: owner ? f.what || '' : publicWhat(f, ps), country: f.name || '', city: f.city || '', year: f.year || null, photo: f.photo?.url || '', workTrip: isWorkTrip(f, ps) };
  return owner ? { id: s.id, ...v, month: f.month || null, shown: f['show-on-profile'] === true && f.private !== true, private: f.private === true, namedOk: f['permission-to-name'] === true } : v;
}

export function stampShelves(stamps, ps) {
  const g = new Map();
  for (const s of stamps) {
    if (s.fieldData?.['show-on-profile'] !== true || s.fieldData?.private === true) continue;
    const v = stampView(s, ps);
    const add = (slug, name) => { if (!g.has(slug)) g.set(slug, { pursuit: slug, name, live: ps.find((x) => x.fieldData?.slug === slug)?.isDraft !== true, stamps: [] }); g.get(slug).stamps.push(v); };
    add(v.pursuit, v.pursuitName);
    // A work-trip stamp under another pursuit (a race run on a work trip) also counts on the Work trips badge.
    const wt = ps.find((x) => x.fieldData?.slug === WORK_TRIPS);
    if (v.workTrip && wt && v.pursuit !== WORK_TRIPS) add(WORK_TRIPS, wt.fieldData.name);
  }
  return [...g.values()].map((x) => ({ ...x, count: x.stamps.length, countries: new Set(x.stamps.map((s) => s.country.toLowerCase())).size,
    stamps: x.stamps.sort((a, b) => (b.year || 0) - (a.year || 0)) }));
}

export async function handleStamps(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.STAMPS_COLLECTION_ID || !env.PURSUITS_COLLECTION_ID || !env.WIRE_KV) return reply({ error: 'Stamps are not switched on yet.' }, 503);
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  const me = await findContributor(env, fetchImpl, auth.memberId);
  if (!me) return reply({ error: 'Your profile page has not been created yet. Give it a minute and reload.' }, 404);
  let b = {};
  try { b = await request.json(); } catch { b = {}; }
  const path = new URL(request.url).pathname;
  const ps = await pursuits(env, fetchImpl);
  const S = env.STAMPS_COLLECTION_ID;
  const mine = async () => (await listAll(env, fetchImpl, S)).filter((s) => s.fieldData?.owner === me.id && !s.isArchived);

  if (path === '/stamps/mine') {
    const picked = Array.isArray(me.fieldData?.pursuits) ? me.fieldData.pursuits : [];
    return reply({ ok: true, pursuits: ps.map((p) => ({ slug: p.fieldData.slug, name: p.fieldData.name, picked: picked.includes(p.id), draft: p.isDraft === true })), stamps: (await mine()).map((s) => stampView(s, ps, { owner: true })) });
  }
  if (path === '/stamps/add') {
    if (!(await rateLimit(env, 'stamps', auth.memberId, 60, now))) return reply({ error: 'That is a lot for one hour. Try again a little later.' }, 429);
    const p = ps.find((x) => x.fieldData?.slug === b.pursuit);
    if (!p) return reply({ error: 'Pick a pursuit.' }, 400);
    const wtEarly = b.workTrip === true || p.fieldData.slug === WORK_TRIPS;
    const what = clean(b.what, 80) || (wtEarly ? WORK_TRIP_LINE : '');
    if (!what) return reply({ error: 'Say what it was: the race, the trail, the library.' }, 400);
    const country = await findCountry(env, fetchImpl, b.country);
    if (!country) return reply({ error: 'Pick a country from the list.' }, 400);
    const year = Number(b.year), month = Number(b.month);
    const thisYear = new Date(now).getUTCFullYear();
    if (!(year >= 1900 && year <= thisYear)) return reply({ error: 'Add the year.' }, 400);
    // Post after, not during: no future month (Work Trip rule 2, and true for every stamp).
    if (year === thisYear && month >= 1 && month <= 12 && month > new Date(now).getUTCMonth() + 1) return reply({ error: 'Back home? Good. Now tell us. Stamps are for trips that already happened.' }, 400);
    const workTrip = wtEarly;
    const photo = String(b.photo || '');
    if (photo && !PHOTO.test(photo)) return reply({ error: 'That photo could not be used. Try again.' }, 400);
    const existing = await mine();
    if (existing.length >= MAX) return reply({ error: 'That is the most stamps one profile can hold for now.' }, 400);
    const shown = existing.some((s) => s.fieldData?.pursuit === p.id && s.fieldData?.['show-on-profile'] === true);
    const fieldData = {
      name: country.fieldData.name, slug: `${me.fieldData?.slug || 'm'}-${p.fieldData.slug}-${now.toString(36)}`.slice(0, 120),
      owner: me.id, pursuit: p.id, country: country.id, what, city: clean(b.city, 60) || null,
      month: month >= 1 && month <= 12 ? Math.round(month) : null, year: Math.round(year), 'show-on-profile': shown,
      'work-trip': workTrip, 'permission-to-name': workTrip && b.namedOk === true,
      ...(photo ? { photo: { url: photo, alt: `${workTrip && b.namedOk !== true ? WORK_TRIP_LINE : what}, ${country.fieldData.name}` } } : {}),
    };
    const made = await webflow(env, fetchImpl, `/collections/${S}/items`, { method: 'POST', body: JSON.stringify({ isDraft: true, isArchived: false, fieldData }) });
    return reply({ ok: true, stamp: stampView(made?.id ? made : { id: '', fieldData }, ps, { owner: true }) });
  }
  if (path === '/stamps/delete') {
    const s = (await mine()).find((x) => x.id === b.id);
    if (!s) return reply({ error: 'Not found.' }, 404);
    await webflow(env, fetchImpl, `/collections/${S}/items/${s.id}`, { method: 'DELETE' });
    return reply({ ok: true });
  }
  if (path === '/stamps/show') {
    const p = ps.find((x) => x.fieldData?.slug === b.pursuit);
    if (!p) return reply({ error: 'Pick a pursuit.' }, 400);
    const show = b.show === true;
    const changed = (await mine()).filter((s) => s.fieldData?.pursuit === p.id && (s.fieldData?.['show-on-profile'] === true) !== (show && s.fieldData?.private !== true));
    for (let i = 0; i < changed.length; i += 100) {
      await webflow(env, fetchImpl, `/collections/${S}/items`, { method: 'PATCH', body: JSON.stringify({ items: changed.slice(i, i + 100).map((x) => ({ id: x.id, fieldData: { 'show-on-profile': show && x.fieldData?.private !== true } })) }) });
    }
    return reply({ ok: true, show });
  }
  if (path === '/stamps/private') {
    // One stamp kept private while the rest of its pursuit shows (Nancy, 31 Oct: "Sure").
    const st = (await mine()).find((x) => x.id === b.id);
    if (!st) return reply({ error: 'Not found.' }, 404);
    const priv = b.private === true;
    const shownPursuit = (await mine()).some((x) => x.id !== st.id && x.fieldData?.pursuit === st.fieldData?.pursuit && x.fieldData?.['show-on-profile'] === true);
    await webflow(env, fetchImpl, `/collections/${S}/items`, { method: 'PATCH', body: JSON.stringify({ items: [{ id: st.id, fieldData: { private: priv, 'show-on-profile': priv ? false : shownPursuit } }] }) });
    return reply({ ok: true, private: priv });
  }
  return reply({ error: 'not found' }, 404);
}

const pubHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
const pub = (b, s = 200, cache = 0) => new Response(JSON.stringify(b), { status: s, headers: { ...pubHeaders, 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store' } });

export async function handleStampsPublic(request, env, { fetchImpl = fetch } = {}) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...pubHeaders, 'Access-Control-Allow-Methods': 'GET' } });
  if (!env.WEBFLOW_TOKEN || !env.STAMPS_COLLECTION_ID || !env.PURSUITS_COLLECTION_ID) return pub({ ok: false }, 503);
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') || '';
  const ps = await pursuits(env, fetchImpl);
  if (url.pathname === '/pursuits/status') {
    const p = ps.find((x) => x.fieldData?.slug === slug);
    if (!p) return pub({ ok: false }, 404);
    const f = p.fieldData;
    return pub({ ok: true, indexable: f.indexable === true, liveStories: f['live-stories'] || 0, writers: f.writers || 0, members: f.members || 0 }, 200, 600);
  }
  const people = await listAll(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID, true);
  const person = people.find((x) => x.fieldData?.slug === slug && x.fieldData?.visibility !== VISIBILITY_OFF);
  if (!person) return pub({ ok: true, shelves: [] }, 200, 600);
  const stamps = (await listAll(env, fetchImpl, env.STAMPS_COLLECTION_ID)).filter((s) => s.fieldData?.owner === person.id && !s.isArchived);
  return pub({ ok: true, shelves: stampShelves(stamps, ps) }, 200, 600);
}

/** Per pursuit id: members, stamps, live-stories, writers, indexable. */
export function pursuitCounts(ps, { contributors = [], stamps = [], liveStories = [] }) {
  const live = new Map(liveStories.map((s) => [s.id, s]));
  const out = {};
  for (const p of ps) {
    const f = p.fieldData || {};
    const stories = (Array.isArray(f.stories) ? f.stories : []).map((id) => live.get(id)).filter(Boolean);
    const writers = new Set(stories.map((s) => s.fieldData?.contributor).filter(Boolean)).size;
    const intro = String(f.intro || '').replace(/<[^>]+>/g, '').trim().length >= 80;
    out[p.id] = {
      members: contributors.filter((c) => !c.isDraft && Array.isArray(c.fieldData?.pursuits) && c.fieldData.pursuits.includes(p.id)).length,
      stamps: stamps.filter((s) => s.fieldData?.pursuit === p.id && !s.isArchived).length,
      'live-stories': stories.length, writers,
      indexable: stories.length >= INDEX_RULE.stories && writers >= INDEX_RULE.writers && intro,
    };
  }
  return out;
}

export async function runPursuitCounts(env, { fetchImpl = fetch } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.PURSUITS_COLLECTION_ID) return 'pursuits count skipped (not configured)';
  const [ps, contributors, stamps, liveStories] = await Promise.all([
    pursuits(env, fetchImpl), listAll(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID),
    env.STAMPS_COLLECTION_ID ? listAll(env, fetchImpl, env.STAMPS_COLLECTION_ID) : [], listAll(env, fetchImpl, env.STORIES_COLLECTION_ID, true),
  ]);
  const c = pursuitCounts(ps, { contributors, stamps, liveStories });
  const keys = ['members', 'stamps', 'live-stories', 'writers', 'indexable'];
  const changed = ps.filter((p) => keys.some((k) => (p.fieldData?.[k] ?? (k === 'indexable' ? false : 0)) !== c[p.id][k]));
  if (!changed.length) return 'pursuits count unchanged';
  await webflow(env, fetchImpl, `/collections/${env.PURSUITS_COLLECTION_ID}/items`, { method: 'PATCH', body: JSON.stringify({ items: changed.map((p) => ({ id: p.id, fieldData: c[p.id] })) }) });
  const live = changed.filter((p) => !p.isDraft).map((p) => p.id);
  if (live.length) await webflow(env, fetchImpl, `/collections/${env.PURSUITS_COLLECTION_ID}/items/publish`, { method: 'POST', body: JSON.stringify({ itemIds: live }) });
  return `pursuits counted: ${changed.map((p) => `${p.fieldData.slug} ${c[p.id].members}/${c[p.id]['live-stories']}${c[p.id].indexable ? ' indexable' : ''}`).join(', ')}`;
}
