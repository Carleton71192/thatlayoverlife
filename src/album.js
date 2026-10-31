// GET /album?slug=<contributor slug> (31 Oct 2026, Value Playbook Phase 3: "seven cover slots, styled as slide mounts, and make
// each one open a slide show"). Public data only: the member's live stories (hero and gallery photos), plus the collection items
// and pursuit stamps they switched on. Nothing private is ever read into the answer.
// Each photo is placed on one of seven continents by its country (story byline, or the item's country).
// Answer: {continents: [{key, name, photos: [{img, alt, line, sub, href}], countries, cover}]} in a fixed order.
import { bylineCountries, listLive } from './site-stats.js';
import { listAll } from './collections.js';

export const CONTINENTS = [
  ['africa', 'Africa', 'dz ao bj bw bf bi cv cm cf td km cg cd ci dj eg gq er sz et ga gm gh gn gw ke ls lr ly mg mw ml mr mu yt ma mz na ne ng re rw sh st sn sc sl so za ss sd tz tg tn ug eh zm zw'],
  ['antarctica', 'Antarctica', 'aq tf bv hm gs'],
  ['asia', 'Asia', 'af am az bh bd bt bn kh cn cy ge hk in id ir iq il jp jo kz kw kg la lb mo my mv mn mm np kp om pk ps ph qa sa sg kr lk sy tw tj th tl tr tm ae uz vn ye io cc cx'],
  ['europe', 'Europe', 'ax al ad at by be ba bg hr cz dk ee fo fi fr de gi gr gg va hu is ie im it je xk lv li lt lu mt md mc me nl mk no pl pt ro ru sm rs sk si es sj se ch ua gb'],
  ['north-america', 'North America', 'ai ag aw bs bb bz bm bq vg ca ky cr cu cw dm do sv gl gd gp gt ht hn jm mq mx ms ni pa pr bl kn lc mf pm vc sx tt tc us vi um'],
  ['oceania', 'Oceania', 'as au ck fj pf gu ki mh fm nr nc nz nu nf mp pw pg pn ws sb tk to tv vu wf'],
  ['south-america', 'South America', 'ar bo br cl co ec fk gf gy py pe sr uy ve'],
];
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
  return send({ ok: true, name: person.fieldData?.name || '', continents: buildAlbum({ stories: own, items: shownItems, stamps: shownStamps }) }, 600);
}
