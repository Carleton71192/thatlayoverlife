// Download everything (31 Oct 2026, Value Playbook Phase 4: "Download everything: stories, photos and map as a zip, from the
// account page. It backs up the Instagram promise."). Member only, and only the member's own records: the profile, every story
// they wrote (drafts included, so nothing is lost), their collections and stamps (private ones too: it is their own copy), the
// pets they own or share, the companions they travel with (names and profile links only) and the photos.
//
//   POST /export            the manifest as JSON (kept for tools and tests). Ten exports an hour per member.
//   POST /export/prepare    {states?} -> {ok, url, expiresAt, stories, photos}. Checks the member, gathers the records once so
//                           any problem shows in the card, stores a small job under export:<token> in WIRE_KV for 15 minutes
//                           and returns the download link. `states` is the member's full map (tllStates v2) from the browser,
//                           200 KB at most, so the zip can hold map/my-map.json and map/countries.csv.
//   GET  /export/zip?t=     the zip itself, streamed as it is built (src/zip.js), photos fetched here four at a time. 404 when
//                           the token is missing, wrong or expired. The token is deleted when the zip finishes, so a link
//                           downloads once; a download that broke off can be retried until the 15 minutes run out.
//
// Phase 1B (1 Nov 2026): the Worker makes the zip. The browser version (JSZip, photos fetched cross-origin into memory) failed
// on iPhone with "Load failed" and could run out of memory on a 100-photo zip. Now the browser only follows a link.
import { findContributor } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';
import { listAll } from './collections.js';
import { NUMERIC_TO_ALPHA2 } from './iso-numeric.js';
import { zipStream } from './zip.js';

const SITE = 'https://www.thatlayover.life';
const PRIVATE_FIELDS = ['memberstack-id', 'outreach-status', 'outreach-notes', 'source-list', 'press-verified', 'badge-label', 'currently-in'];
const ROOT = 'that-layover-life';
export const JOB_TTL_SECONDS = 15 * 60;
export const MAX_PREPARE_BYTES = 200 * 1024;
const PHOTO_WORKERS = 4;
const PHOTO_TIMEOUT_MS = 30000;
// Only the hosts the CMS stores photos on. Anything else is listed as a link, never fetched from inside the Worker.
const PHOTO_HOST = /(^|\.)website-files\.com$|^uploads(-ssl)?\.webflow\.com$|^res\.cloudinary\.com$/;
const TOKEN = /^[0-9a-f]{32}$/;
const DEPTHS = new Set(['lived', 'visited', 'layover']);
const CODE = /^\d{3}$/;
const TRAVELER_ID = /^[A-Za-z0-9_-]{1,24}$/;
const KOSOVO_ALIASES = new Set(['undefined', 'XK', 'xk']);
const MAX_TRAVELERS = 20;
const MAX_STATES = 300;

const img = (x, folder, name) => (x?.url ? { url: x.url, folder, name, alt: x.alt || '' } : null);
const safe = (s) => String(s || 'item').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'item';
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Pure: the export manifest from the member's own records. */
export function buildExport({ me, stories = [], items = [], stamps = [], pets = [], people = [], cats = [], pursuits = [], now = Date.now() }) {
  const f = { ...(me.fieldData || {}) };
  PRIVATE_FIELDS.forEach((k) => delete f[k]);
  const name = (list, id) => list.find((x) => x.id === id)?.fieldData?.name || '';
  const photos = [];
  const add = (p) => { if (p) photos.push(p); };
  add(img(f.avatar, 'profile', 'avatar'));
  const myStories = stories.filter((s) => s.fieldData?.contributor === me.id).map((s) => {
    const d = s.fieldData || {};
    const slug = d.slug || s.id;
    add(img(d['hero-image'], `stories/${slug}`, 'cover'));
    (d['photo-gallery'] || []).forEach((g, i) => add(img(g, `stories/${slug}`, `photo-${String(i + 1).padStart(2, '0')}`)));
    return { title: d.name || '', slug, link: s.isDraft ? null : `${SITE}/stories/${slug}`, status: s.isDraft ? 'draft' : 'published', place: d['byline-location'] || '',
      published: d['published-date'] || null, trip: d['trip-when'] || '', excerpt: d.excerpt || '', body: d.body || '', signOff: d['sign-off'] || '',
      externalUrl: d['external-url'] || null };
  });
  const mine = (list) => list.filter((x) => x.fieldData?.owner === me.id && !x.isArchived);
  const collections = mine(items).map((i, n) => {
    const d = i.fieldData || {};
    const col = d['own-category-name'] || name(cats, d.category);
    const shots = [d.photo, ...(d['more-photos'] || [])].filter((x) => x?.url);
    shots.forEach((p, k) => add(img(p, `collections/${safe(col)}`, `${safe(d.name)}-${n + 1}${shots.length > 1 ? `-${k + 1}` : ''}`)));
    return { collection: col, country: d.name || '', city: d.city || '', year: d.year || null, caption: d.caption || '', shownOnProfile: d['show-on-profile'] === true, photos: shots.map((p) => p.url) };
  });
  const myStamps = mine(stamps).map((s, n) => {
    const d = s.fieldData || {};
    const pursuit = name(pursuits, d.pursuit);
    if (d.photo?.url) add(img(d.photo, `stamps/${safe(pursuit)}`, `${safe(d.what)}-${n + 1}`));
    return { pursuit, what: d.what || '', country: d.name || '', city: d.city || '', month: d.month || null, year: d.year || null, shownOnProfile: d['show-on-profile'] === true, workTrip: d['work-trip'] === true, photo: d.photo?.url || null };
  });
  const myPets = pets.filter((p) => p.fieldData?.owner === me.id || (p.fieldData?.['shared-with'] || []).includes(me.id)).map((p) => {
    const d = p.fieldData || {};
    add(img(d.avatar, `pets/${safe(d.name)}`, 'avatar'));
    (d['pet-gallery'] || []).forEach((g, i) => add(img(g, `pets/${safe(d.name)}`, `photo-${i + 1}`)));
    return { name: d.name || '', breed: d.breed || '', countries: d['countries-list'] || '', link: `${SITE}/pets/${d.slug}`, role: d.owner === me.id ? 'owner' : 'co-owner' };
  });
  const companions = (f.crew || []).map((id) => people.find((p) => p.id === id)).filter(Boolean).map((p) => ({ name: p.fieldData?.name || '', link: `${SITE}/contributors/${p.fieldData?.slug}` }));
  delete f.crew;
  let map = null;
  try { map = f['map-snapshot'] ? JSON.parse(f['map-snapshot']) : null; } catch { map = null; }
  delete f['map-snapshot'];
  return {
    exportedAt: new Date(now).toISOString(), site: SITE, profileLink: `${SITE}/contributors/${f.slug}`,
    profile: f, placesLived: (() => { try { const d = JSON.parse(f.desks || '[]'); return Array.isArray(d) ? d : []; } catch { return []; } })(), mapSummary: map, stories: myStories, collections, stamps: myStamps, pets: myPets, companions, photos,
  };
}

/* The files inside the zip. These used to live in the browser layer (tll-export-v1.js); the zip holds exactly what it made. */

export const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** A spreadsheet-friendly CSV: header row, quoted when a value holds a comma, quote or line break. */
export function csv(rows, cols) {
  const q = (v) => { v = v == null ? '' : Array.isArray(v) ? v.join(' ') : String(v); return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; };
  return `${cols.join(',')}\n${rows.map((r) => cols.map((c) => q(r[c])).join(',')).join('\n')}\n`;
}

/** One story as a page that opens in any browser. */
export function storyPage(s) {
  return `<!doctype html><meta charset="utf-8"><title>${esc(s.title)}</title><style>body{max-width:680px;margin:40px auto;padding:0 16px;font:17px/1.6 Georgia,serif;color:#0A0B14}small{color:#5F5A54}</style>`
    + `<h1>${esc(s.title)}</h1><p><small>${esc([s.place, s.trip, s.status === 'draft' ? 'Draft' : ''].filter(Boolean).join(' · '))}</small></p>${s.excerpt ? `<p><em>${esc(s.excerpt)}</em></p>` : ''}${s.body || ''}${s.signOff ? `<p>${esc(s.signOff)}</p>` : ''}`
    + `${s.link ? `<p><small>Online: <a href="${esc(s.link)}">${esc(s.link)}</a></small></p>` : ''}${s.externalUrl ? `<p><small>Published at: <a href="${esc(s.externalUrl)}">${esc(s.externalUrl)}</a></small></p>` : ''}`;
}

export function readme(d) {
  return `That Layover Life: your copy\nExported ${d.exportedAt}\nProfile: ${d.profileLink}\n\nInside:\n- profile.json: your profile as it is saved\n- stories/: each story as a page you can open in any browser, plus stories.json\n- collections.csv and stamps.csv: open in Excel, Numbers or Google Sheets (JSON copies too)\n- pets.json, companions.json\n- map/: my-map.json (your full map, every country and how you know it), countries.csv (Lived, Stayed, Layover) and map-summary.json\n- places-lived.csv and .json: the places you have lived, with years\n- photos/: every photo, in folders by story, collection, stamp and pet\n\nPrivate collections and stamps are included: this copy is only for you.\n`;
}

/** The English country name for an alpha-2 code, or the code when the runtime has no names. */
let regionNames = null;
export function countryName(code) {
  const c = String(code || '').toUpperCase();
  try { regionNames = regionNames || new Intl.DisplayNames(['en'], { type: 'region' }); return regionNames.of(c) || c; } catch { return c; }
}

/** GET /export/zip is a browser navigation, so a problem is shown as a small page with a way back, not raw JSON. */
function problemPage(status, message) {
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>That Layover Life</title>`
    + `<style>body{max-width:560px;margin:60px auto;padding:0 16px;font:17px/1.6 Georgia,serif;color:#0A0B14}a{color:#067A79}</style>`
    + `<p>${esc(message)}</p><p><a href="${SITE}/account">Back to your account</a></p>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
}

/** File extension for a photo from its content type, then its URL; jpg when neither says. */
export function photoExt(type, url) {
  const t = String(type || '');
  if (/png/.test(t)) return 'png';
  if (/webp/.test(t)) return 'webp';
  if (/gif/.test(t)) return 'gif';
  const m = /\.(jpe?g|png|webp|gif)(\?|$)/i.exec(url || '');
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

/**
 * Checks the member's map from the browser: {v:2, travelers:[{id,name?,color?,pet?}], states:{"<3 digits>":{"<traveler id>":depth}}}.
 * Returns { map } with only those fields, or { error }. Names are kept: this copy is the member's own.
 */
export function checkStates(raw) {
  if (!isObject(raw) || raw.v !== 2 || !isObject(raw.states) || (raw.travelers !== undefined && !Array.isArray(raw.travelers))) {
    return { error: 'states must be a tllStates v2 record: {v:2, states, travelers}' };
  }
  const travelers = [];
  const seen = new Set();
  for (const t of raw.travelers || []) {
    if (travelers.length >= MAX_TRAVELERS) break;
    if (!isObject(t) || typeof t.id !== 'string' || !TRAVELER_ID.test(t.id) || seen.has(t.id)) continue;
    seen.add(t.id);
    const out = { id: t.id };
    if (typeof t.name === 'string') out.name = t.name.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 60);
    if (typeof t.color === 'string' && /^#[0-9A-Fa-f]{3,8}$/.test(t.color)) out.color = t.color;
    out.pet = t.pet === true;
    travelers.push(out);
  }
  const states = {};
  for (const [rawKey, entry] of Object.entries(raw.states)) {
    const key = KOSOVO_ALIASES.has(rawKey) ? '900' : rawKey;
    if (!CODE.test(key) || !isObject(entry)) continue;
    const kept = states[key] || {};
    for (const [tid, depth] of Object.entries(entry)) if (seen.has(tid) && DEPTHS.has(depth) && !kept[tid]) kept[tid] = depth;
    if (!Object.keys(kept).length) continue;
    if (!states[key] && Object.keys(states).length >= MAX_STATES) continue;
    states[key] = kept;
  }
  return { map: { v: 2, travelers, states } };
}

/** Rows for map/countries.csv: one per country and traveler, with the mark as the map words it. */
export function countryRows(map) {
  const rows = [];
  const mark = { lived: 'Lived', visited: 'Stayed', layover: 'Layover' };
  for (const [num, entry] of Object.entries(map?.states || {})) {
    for (const [tid, depth] of Object.entries(entry || {})) {
      const tr = (map.travelers || []).find((x) => x.id === tid);
      const a2 = NUMERIC_TO_ALPHA2[num] || '';
      rows.push({ country: a2 ? countryName(a2) : num, code: a2 || num, traveler: tr?.name || tid, mark: mark[depth] || depth });
    }
  }
  return rows;
}

export function zipFileName(d) {
  return `that-layover-life-${safe(d.profile?.slug || 'me')}-${d.exportedAt.slice(0, 10)}.zip`;
}

/** Every record the zip needs, in one pass over the member's collections. Null when the member has no profile page. */
export async function gather(env, fetchImpl, memberId, now) {
  const me = await findContributor(env, fetchImpl, memberId);
  if (!me) return null;
  const get = (id) => (id ? listAll(env, fetchImpl, id) : Promise.resolve([]));
  const [stories, items, stamps, pets, people, cats, pursuits] = await Promise.all([
    get(env.STORIES_COLLECTION_ID), get(env.COLLECTION_ITEMS_ID), get(env.STAMPS_COLLECTION_ID), get(env.PETS_COLLECTION_ID),
    (me.fieldData?.crew || []).length ? get(env.CONTRIBUTORS_COLLECTION_ID) : Promise.resolve([]), get(env.COLLECTION_CATEGORIES_ID), get(env.PURSUITS_COLLECTION_ID),
  ]);
  return { me, data: buildExport({ me, stories, items, stamps, pets, people, cats, pursuits, now }) };
}

/** Bytes of a fetched photo, stopping quietly when the connection breaks so the zip stays readable. */
async function* bodyChunks(body, onBreak) {
  const reader = body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return;
      if (value?.length) yield value;
    }
  } catch (error) {
    onBreak(error);
  } finally {
    try { reader.releaseLock(); } catch { /* already released */ }
  }
}

async function fetchPhoto(p, fetchImpl) {
  let host = '';
  try { const u = new URL(p.url); host = u.protocol === 'https:' ? u.hostname : ''; } catch { host = ''; }
  if (!host || !PHOTO_HOST.test(host)) return { p, response: null };
  try {
    const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(PHOTO_TIMEOUT_MS) : undefined;
    const response = await fetchImpl(p.url, { headers: { Accept: 'image/*' }, signal });
    return { p, response: response.ok && response.body ? response : null };
  } catch {
    return { p, response: null };
  }
}

/**
 * Writes every file of the member's copy into `zip` (a ZipWriter). Photos are fetched four at a time, in order, and each one
 * streams through as it arrives. A photo that will not download is listed in photos/not-downloaded.txt, never silently lost.
 */
export async function writeExportZip(zip, d, map, { fetchImpl = fetch } = {}) {
  const used = new Set();
  const unique = (name) => { let n = name, i = 2; while (used.has(n)) { n = name.replace(/(\.[^./]+)?$/, `-${i}$1`); i += 1; } used.add(n); return n; };
  const file = (name, data) => zip.file(unique(`${ROOT}/${name}`), data);
  const json = (v) => JSON.stringify(v, null, 2);
  await file('README.txt', readme(d));
  await file('profile.json', json(d.profile));
  await file('stories/stories.json', json(d.stories));
  for (const s of d.stories) await file(`stories/${safe(s.slug)}.html`, storyPage(s));
  await file('collections.json', json(d.collections));
  await file('collections.csv', csv(d.collections, ['collection', 'country', 'city', 'year', 'caption', 'shownOnProfile', 'photos']));
  await file('stamps.json', json(d.stamps));
  await file('stamps.csv', csv(d.stamps, ['pursuit', 'what', 'country', 'city', 'month', 'year', 'workTrip', 'shownOnProfile', 'photo']));
  await file('pets.json', json(d.pets));
  await file('companions.json', json(d.companions));
  await file('map/map-summary.json', json(d.mapSummary));
  if (map) {
    await file('map/my-map.json', json(map));
    await file('map/countries.csv', csv(countryRows(map), ['country', 'code', 'traveler', 'mark']));
  }
  // Expat build: places lived (from the profile) as a spreadsheet and JSON.
  const pl = (d.placesLived || []).map((x) => ({ country: countryName(x.c), code: String(x.c || '').toUpperCase(), years: x.years || '', placesIKnowWell: x.knows || '', homeNow: x.now === true ? 'yes' : '' }));
  await file('places-lived.json', json(pl));
  await file('places-lived.csv', csv(pl, ['country', 'code', 'years', 'placesIKnowWell', 'homeNow']));

  const photos = d.photos || [];
  const missing = [];
  const inflight = [];
  let next = 0;
  const fill = () => { while (inflight.length < PHOTO_WORKERS && next < photos.length) inflight.push(fetchPhoto(photos[next++], fetchImpl)); };
  fill();
  while (inflight.length) {
    const { p, response } = await inflight.shift();
    fill();
    const label = `${p.folder}/${p.name}: ${p.url}`;
    if (!response) { missing.push(label); continue; }
    let broke = false;
    await file(`photos/${p.folder}/${p.name}.${photoExt(response.headers.get('content-type'), p.url)}`, bodyChunks(response.body, () => { broke = true; }));
    if (broke) missing.push(`${label} (incomplete)`);
  }
  if (missing.length) await file('photos/not-downloaded.txt', `These photos could not be downloaded, so here are their links:\n${missing.join('\n')}\n`);
  return { photos: photos.length - missing.length, missing: missing.length };
}

function newToken() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

const ready = (env) => env.WEBFLOW_TOKEN && env.MEMBERSTACK_KEY && env.CONTRIBUTORS_COLLECTION_ID && env.WIRE_KV;

export async function handleExport(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!ready(env)) return reply({ error: 'Downloads are not switched on yet.' }, 503);
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  if (!(await rateLimit(env, 'export', auth.memberId, 10, now))) return reply({ error: 'That is ten downloads in an hour. Try again a little later.' }, 429);
  const got = await gather(env, fetchImpl, auth.memberId, now);
  if (!got) return reply({ error: 'Your profile page has not been created yet.' }, 404);
  return reply({ ok: true, ...got.data });
}

/** POST /export/prepare: checks everything that can go wrong before the browser follows the link. */
export async function handleExportPrepare(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!ready(env)) return reply({ error: 'Downloads are not switched on yet.' }, 503);
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > MAX_PREPARE_BYTES) return reply({ error: 'Your map is too large to include. Try again without it.' }, 413);
  let text = '';
  try { text = await request.text(); } catch { text = ''; }
  if (text.length > MAX_PREPARE_BYTES) return reply({ error: 'Your map is too large to include. Try again without it.' }, 413);
  let body = {};
  try { body = text.trim() ? JSON.parse(text) : {}; } catch { return reply({ error: 'bad body' }, 400); }
  if (!isObject(body)) return reply({ error: 'bad body' }, 400);
  let map = null;
  if (body.states != null) {
    const checked = checkStates(body.states);
    if (checked.error) return reply({ error: checked.error }, 400);
    map = checked.map;
  }
  if (!(await rateLimit(env, 'export', auth.memberId, 10, now))) return reply({ error: 'That is ten downloads in an hour. Try again a little later.' }, 429);
  const got = await gather(env, fetchImpl, auth.memberId, now);
  if (!got) return reply({ error: 'Your profile page has not been created yet.' }, 404);
  const token = newToken();
  const job = { memberId: auth.memberId, contributorId: got.me.id, createdAt: now, states: map };
  await env.WIRE_KV.put(`export:${token}`, JSON.stringify(job), { expirationTtl: JOB_TTL_SECONDS });
  const url = `${new URL(request.url).origin}/export/zip?t=${token}`;
  return reply({ ok: true, url, expiresAt: new Date(now + JOB_TTL_SECONDS * 1000).toISOString(), stories: got.data.stories.length, photos: got.data.photos.length });
}

/** GET /export/zip?t=<token>: the zip, streamed. A browser navigation, so no CORS and no Bearer token: the token is the key. */
export async function handleExportZip(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (request.method !== 'GET') return reply({ error: 'method not allowed' }, 405);
  if (!ready(env)) return reply({ error: 'Downloads are not switched on yet.' }, 503);
  const gone = () => problemPage(404, 'That download link has expired. Go back to your account page and press the button again.');
  const token = new URL(request.url).searchParams.get('t') || '';
  if (!TOKEN.test(token)) return gone();
  const key = `export:${token}`;
  let job = null;
  try { job = JSON.parse((await env.WIRE_KV.get(key)) || 'null'); } catch { job = null; }
  if (!isObject(job) || typeof job.memberId !== 'string' || !(job.createdAt + JOB_TTL_SECONDS * 1000 > now)) {
    if (job) await env.WIRE_KV.delete(key).catch(() => {});
    return gone();
  }
  // Gather before the first byte goes out, so a Webflow problem is a clean error and not a broken download.
  let got = null;
  try { got = await gather(env, fetchImpl, job.memberId, now); } catch { got = null; }
  if (!got || got.me.id !== job.contributorId) return problemPage(502, 'The download could not start. Go back to your account page and try again.');
  const map = job.states ? (checkStates(job.states).map || null) : null;
  const body = zipStream((zip) => writeExportZip(zip, got.data, map, { fetchImpl }), {
    now,
    // Single use: the token goes once the last byte is written. A download that breaks off keeps it until the 15 minutes end.
    after: () => env.WIRE_KV.delete(key).catch(() => {}),
  });
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipFileName(got.data)}"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
