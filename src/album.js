// GET /album?slug=<contributor slug> (31 Oct 2026, Value Playbook Phase 3: "seven cover slots, styled as slide mounts, and make
// each one open a slide show"). Public data only: the member's live stories (hero and gallery photos), plus the collection items
// and pursuit stamps they switched on. Nothing private is ever read into the answer.
// Each photo is placed on one of seven continents by its country (story byline, or the item's country).
// Answer: {continents: [{key, name, photos: [{img, alt, line, sub, href}], countries, cover}]} in a fixed order.
import { bylineCountries, listLive } from './site-stats.js';
import { listAll } from './collections.js';
import { findContributor } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';

// How members count continents (Nancy, 31 Oct: "some people see 6 continents and other 7. It's cultural.").
// seven: North and South America apart (English-speaking world, China, India). americas: one America (Latin America, Spain,
// Portugal, France, Italy, Greece). eurasia: Europe and Asia as one (Russia, parts of Eastern Europe). olympic: the five
// inhabited continents of the Olympic rings, America as one, no Antarctica. The album groups slides by the owner's choice.
export const MODELS = ['seven', 'americas', 'eurasia', 'olympic'];
export const KEYS = ['africa', 'antarctica', 'asia', 'europe', 'north-america', 'oceania', 'south-america'];

export const CONTINENTS = [
  ['africa', 'Africa', 'dz ao bj bw bf bi cv cm cf td km cg cd ci dj eg gq er sz et ga gm gh gn gw ke ls lr ly mg mw ml mr mu yt ma mz na ne ng re rw sh st sn sc sl so za ss sd tz tg tn ug eh zm zw'],
  ['antarctica', 'Antarctica', 'aq tf bv hm gs'],
  ['asia', 'Asia', 'af am az bh bd bt bn kh cn cy ge hk in id ir iq il jp jo kz kw kg la lb mo my mv mn mm np kp om pk ps ph qa sa sg kr lk sy tw tj th tl tr tm ae uz vn ye io cc cx'],
  ['europe', 'Europe', 'ax al ad at by be ba bg hr cz dk ee fo fi fr de gi gr gg va hu is ie im it je xk lv li lt lu mt md mc me nl mk no pl pt ro ru sm rs sk si es sj se ch ua gb'],
  ['north-america', 'North America', 'ai ag aw bs bb bz bm bq vg ca ky cr cu cw dm do sv gl gd gp gt ht hn jm mq mx ms ni pa pr bl kn lc mf pm vc sx tt tc us vi um'],
  ['oceania', 'Oceania', 'as au ck fj pf gu ki mh fm nr nc nz nu nf mp pw pg pn ws sb tk to tv vu wf'],
  ['south-america', 'South America', 'ar bo br cl co ec fk gf gy py pe sr uy ve'],
];
// UN M49 numeric codes (the map's keys) by continent; 900 Kosovo, 901 Northern Cyprus, 902 Somaliland are the map's own.
export const M49 = {"as": "004 031 048 050 051 064 086 096 104 116 144 156 158 162 166 196 268 275 344 356 360 364 368 376 392 398 400 408 410 414 417 418 422 446 458 462 496 512 524 586 608 626 634 682 702 704 760 762 764 784 792 795 860 887 901", "eu": "008 020 040 056 070 100 112 191 203 208 233 234 246 248 250 276 292 300 336 348 352 372 380 428 438 440 442 470 492 498 499 528 578 616 620 642 643 674 688 703 705 724 744 752 756 804 807 826 831 832 833 900", "an": "010 074 239 260 334", "af": "012 024 072 108 120 132 140 148 174 175 178 180 204 226 231 232 262 266 270 288 324 384 404 426 430 434 450 454 466 478 480 504 508 516 562 566 624 638 646 654 678 686 690 694 706 710 716 728 729 732 748 768 788 800 818 834 854 894 902", "oc": "016 036 090 184 242 258 296 316 520 540 548 554 570 574 580 583 584 585 598 612 772 776 798 876 882", "na": "028 044 052 060 084 092 124 136 188 192 212 214 222 304 308 312 320 332 340 388 474 484 500 531 533 534 535 558 581 591 630 652 659 660 662 663 666 670 780 796 840 850", "sa": "032 068 076 152 170 218 238 254 328 600 604 740 858 862"};
const SHORT = { af: 'africa', an: 'antarctica', as: 'asia', eu: 'europe', na: 'north-america', oc: 'oceania', sa: 'south-america' };
export const continentOfM49 = (code) => { for (const [k, v] of Object.entries(M49)) if (v.split(' ').includes(String(code))) return SHORT[k]; return null; };
const BY_CODE = {};
for (const [key, , codes] of CONTINENTS) codes.split(' ').forEach((c) => { BY_CODE[c] = key; });
export const continentOf = (iso2) => BY_CODE[String(iso2 || '').toLowerCase()] || null;

const VISIBILITY_OFF = '1423c8d17c2060776541377f76ea0b31';
const MAX_PER_CONTINENT = 60;

/** Pure: builds the album from already-filtered public pieces. */
export function buildAlbum({ stories = [], items = [], stamps = [] }) {
  const out = Object.fromEntries(CONTINENTS.map(([key, name]) => [key, { key, name, photos: [], codes: new Set() }]));
  const put = (code, photo) => {
    const k = continentOf(code);
    if (!k || !photo.img || out[k].photos.length >= MAX_PER_CONTINENT) return;
    out[k].photos.push(photo); out[k].codes.add(code);
  };
  for (const s of stories) {
    const f = s.fieldData || {};
    const code = bylineCountries(f['byline-location'])[0];
    const href = `/stories/${f.slug}`;
    const sub = String(f['byline-location'] || '').toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());
    if (f['hero-image']?.url) put(code, { img: f['hero-image'].url, alt: f['hero-image'].alt || f.name || '', line: f.name || '', sub, href });
    for (const g of (Array.isArray(f['photo-gallery']) ? f['photo-gallery'] : [])) put(code, { img: g.url, alt: g.alt || '', line: f.name || '', sub, href });
  }
  for (const it of [...items, ...stamps]) {
    const code = bylineCountries(it.country)[0];
    for (const img of it.photos || [it.photo]) put(code, { img, alt: it.alt || '', line: it.line || '', sub: [it.city, it.country, it.year].filter(Boolean).join(' · '), href: '' });
  }
  return CONTINENTS.map(([key]) => {
    const c = out[key];
    return { key, name: c.name, photos: c.photos, countries: c.codes.size, cover: c.photos[0] || null };
  });
}

export async function handleAlbum(request, env, { fetchImpl = fetch } = {}) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET' } });
  const send = (b, cache) => new Response(JSON.stringify(b), { headers: { ...headers, 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store' } });
  if (!env.WEBFLOW_TOKEN || !env.CONTRIBUTORS_COLLECTION_ID || !env.STORIES_COLLECTION_ID) return send({ ok: false }, 0);
  const slug = new URL(request.url).searchParams.get('slug') || '';
  const people = await listLive(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID);
  const person = people.find((p) => p.fieldData?.slug === slug && p.fieldData?.visibility !== VISIBILITY_OFF);
  if (!person) return send({ ok: true, continents: [] }, 600);
  const [stories, items, stamps, cats, ps] = await Promise.all([
    listLive(env, fetchImpl, env.STORIES_COLLECTION_ID),
    env.COLLECTION_ITEMS_ID ? listAll(env, fetchImpl, env.COLLECTION_ITEMS_ID) : [],
    env.STAMPS_COLLECTION_ID ? listAll(env, fetchImpl, env.STAMPS_COLLECTION_ID) : [],
    env.COLLECTION_CATEGORIES_ID ? listAll(env, fetchImpl, env.COLLECTION_CATEGORIES_ID) : [],
    env.PURSUITS_COLLECTION_ID ? listAll(env, fetchImpl, env.PURSUITS_COLLECTION_ID) : [],
  ]);
  const mine = (list) => list.filter((x) => x.fieldData?.owner === person.id && !x.isArchived && x.fieldData?.['show-on-profile'] === true);
  const name = (list, id) => list.find((x) => x.id === id)?.fieldData?.name || '';
  const shownItems = mine(items).map((i) => { const f = i.fieldData; return { country: f.name, city: f.city, year: f.year, line: f['own-category-name'] || name(cats, f.category), alt: f.photo?.alt || '', photos: [f.photo?.url, ...((f['more-photos'] || []).map((x) => x?.url))].filter(Boolean) }; });
  const shownStamps = mine(stamps).map((s) => { const f = s.fieldData; return { country: f.name, city: f.city, year: f.year, line: [name(ps, f.pursuit), f.what].filter(Boolean).join(': '), alt: f.photo?.alt || '', photos: [f.photo?.url].filter(Boolean) }; });
  const own = stories.filter((s) => s.fieldData?.contributor === person.id && !s.fieldData?.['external-url'])
    .sort((a, b) => String(b.fieldData?.['published-date'] || '').localeCompare(String(a.fieldData?.['published-date'] || '')));
  let settings = {};
  try { settings = JSON.parse((env.WIRE_KV && (await env.WIRE_KV.get(`album:${person.id}`))) || '{}'); } catch { settings = {}; }
  return send({ ok: true, name: person.fieldData?.name || '', model: MODELS.includes(settings.model) ? settings.model : 'seven', mapCounts: settings.counts || null, continents: buildAlbum({ stories: own, items: shownItems, stamps: shownStamps }) }, 600);
}

/** Pure: validates {counts?, model?}; counts are whole numbers 0..80 for the seven keys. */
export function settingsFrom(body) {
  const out = {};
  if (body && body.counts !== undefined) {
    const c = body.counts;
    if (!c || typeof c !== 'object' || Array.isArray(c)) return { error: 'counts must be an object' };
    const unknown = Object.keys(c).filter((k) => !KEYS.includes(k));
    if (unknown.length || KEYS.some((k) => !(Number.isInteger(c[k]) && c[k] >= 0 && c[k] <= 80))) return { error: 'counts must be whole numbers for the seven continents' };
    out.counts = Object.fromEntries(KEYS.map((k) => [k, c[k]]));
  }
  if (body && body.model !== undefined) {
    if (!MODELS.includes(body.model)) return { error: 'unknown model' };
    out.model = body.model;
  }
  if (!Object.keys(out).length) return { error: 'nothing to save' };
  return { settings: out };
}

/** POST /album/settings (member): the map's per-continent counts (numbers only, never the countries) and the continent model. */
export async function handleAlbumSettings(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.CONTRIBUTORS_COLLECTION_ID || !env.WIRE_KV) return reply({ error: 'Not switched on yet.' }, 503);
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  let body = null;
  try { body = await request.json(); } catch { body = null; }
  const checked = settingsFrom(body);
  if (checked.error) return reply({ error: checked.error }, 400);
  if (!(await rateLimit(env, 'album-settings', auth.memberId, 60, now))) return reply({ error: 'Try again a little later.' }, 429);
  const me = await findContributor(env, fetchImpl, auth.memberId);
  if (!me) return reply({ error: 'Your profile page has not been created yet.' }, 404);
  const key = `album:${me.id}`;
  let cur = {};
  try { cur = JSON.parse((await env.WIRE_KV.get(key)) || '{}'); } catch { cur = {}; }
  const next = { ...cur, ...checked.settings, at: new Date(now).toISOString() };
  await env.WIRE_KV.put(key, JSON.stringify(next));
  return reply({ ok: true, model: next.model || 'seven', counts: next.counts || null });
}
