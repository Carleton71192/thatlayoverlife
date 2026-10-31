// That Work Trip Life (31 Oct 2026, business travel build, Phases A, B, D and F). Public, read-only, cached.
//   GET /work-trips                 the hub: Nancy's intro, the two series rails, the stamps wall, road warrior picks.
//   GET /work-trips/story?slug=x    one story's series label, its template fields and its Trip Kit.
// Rules carried in code, not in copy:
//   1. No employer, client, colleague or job title unless the member said they may be named: work-trip stamps read
//      "A work trip" (see stamps.js); a road warrior's employer shows only with Permission to name employer on.
//   2. Post after, not during: the wall shows the year only, never a month, never "currently".
//   4. No points, miles or credit cards: a Trip Kit line pointing at a card, points or miles link is dropped.
// AI writes nothing here. Series fields are the writer's own words from Story extras.
import { listLive } from './site-stats.js';
import { listAll } from './collections.js';
import { publicWhat, isWorkTrip, WORK_TRIPS } from './stamps.js';

const VISIBILITY_OFF = '1423c8d17c2060776541377f76ea0b31';
const ROAD_WARRIOR = '7203ed9cbb4a974d00937c5b801ec7e4';
export const SERIES = { 'the-free-evening': 'The Free Evening', 'plus-one-day': 'Plus One Day' };
const OPTION = {
  '91c0cc52af6d7a81185e7d085c2d3958': 'Two hours', '3da5259917fa446fe7b319f8685e7d3b': 'Four hours', '50ad2806be64cebbe7d5d5dc0903e6e2': 'One evening',
  d16a888cb473a3d1f0bf3f73d8ccc576: 'Convention center', cf34e7325ee4b33368c38a0cd3606ab0: 'Business district', e2d8c831ce610d28aeb0043f61aea45e: 'Airport hotel',
};
const WALL_MAX = 120;
// Trip Kit: eSIM, airport lounges, travel insurance only. Anything that smells of cards, points or miles is dropped.
const KIT_BLOCK = /credit|card|amex|american ?express|visa\b|mastercard|chase|capital ?one|citi|points|miles|reward|cashback|loyalty/i;

const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
const send = (b, s = 200, cache = 600) => new Response(JSON.stringify(b), { status: s, headers: { ...headers, 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store' } });

export function tripKit(text) {
  return String(text || '').split(/\n+/).map((l) => l.split('|').map((x) => x.trim())).filter((p) => p.length >= 2)
    .map(([label, url]) => ({ label: label.slice(0, 60), url }))
    .filter((k) => k.label && /^https:\/\/[^\s"'<>]+$/.test(k.url) && !KIT_BLOCK.test(k.label + ' ' + k.url))
    .slice(0, 3).map((k) => ({ ...k, rel: 'sponsored noopener noreferrer', tag: 'reklamelink' }));
}

export function seriesOf(story, themes) {
  const ids = Array.isArray(story.fieldData?.theme) ? story.fieldData.theme : [];
  const t = themes.find((x) => ids.includes(x.id) && SERIES[x.fieldData?.slug]);
  return t ? t.fieldData.slug : null;
}

export function cardOf(story, series, dest) {
  const f = story.fieldData || {};
  const country = dest.find((d) => d.id === f['country-2'])?.fieldData?.name || '';
  const city = String(f.city || '').trim();
  const place = city || country || String(f['byline-location'] || '').trim();
  return { slug: f.slug, title: f.name, excerpt: f.excerpt || '', image: f['hero-image']?.url || '', city, country, series, label: `${SERIES[series]}${place ? ` · ${place}` : ''}` };
}

export function stampsWall(stamps, ps, people) {
  const shown = new Map(people.filter((p) => !p.isDraft && p.fieldData?.visibility !== VISIBILITY_OFF).map((p) => [p.id, p]));
  const rows = stamps.filter((s) => !s.isArchived && s.fieldData?.['show-on-profile'] === true && isWorkTrip(s.fieldData, ps) && shown.has(s.fieldData.owner))
    .map((s) => { const f = s.fieldData, p = shown.get(f.owner).fieldData; return { country: f.name || '', city: f.city || '', year: f.year || null, what: publicWhat(f, ps), member: String(p.name || '').split(' ')[0], memberSlug: p.slug }; })
    .sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, WALL_MAX);
  return { stamps: rows, countries: new Set(rows.map((r) => r.country.toLowerCase())).size, members: new Set(rows.map((r) => r.memberSlug)).size };
}

export function roadWarriors(pros, people) {
  return pros.filter((p) => p.fieldData?.track === ROAD_WARRIOR).map((p) => {
    const f = p.fieldData, person = people.find((c) => c.id === f.contributor && c.fieldData?.visibility !== VISIBILITY_OFF);
    if (!person) return null;
    return { slug: person.fieldData.slug, name: person.fieldData.name, avatar: person.fieldData.avatar?.url || '', line: String(f['pro-line'] || '').slice(0, 40),
      employer: f['permission-to-name-employer'] === true ? String(f.employer || '').slice(0, 60) : '' };
  }).filter(Boolean);
}

export async function handleWorkTrips(request, env, { fetchImpl = fetch } = {}) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET' } });
  if (!env.WEBFLOW_TOKEN || !env.PURSUITS_COLLECTION_ID) return send({ ok: false }, 503, 0);
  const url = new URL(request.url);
  const themes = await listAll(env, fetchImpl, env.THEMES_COLLECTION_ID);
  const [stories, dest] = await Promise.all([listLive(env, fetchImpl, env.STORIES_COLLECTION_ID), listAll(env, fetchImpl, env.DESTINATIONS_COLLECTION_ID)]);

  if (url.pathname === '/work-trips/story') {
    const slug = url.searchParams.get('slug') || '';
    const story = stories.find((s) => s.fieldData?.slug === slug);
    if (!story) return send({ ok: true, series: null });
    const series = seriesOf(story, themes);
    const extras = env.STORY_EXTRAS_COLLECTION_ID ? (await listAll(env, fetchImpl, env.STORY_EXTRAS_COLLECTION_ID)).find((x) => x.fieldData?.story === story.id || x.fieldData?.slug === slug) : null;
    const e = extras?.fieldData || {};
    const fields = series === 'the-free-evening'
      ? { time: OPTION[e['free-evening-time']] || '', start: OPTION[e['free-evening-starting-point']] || '', stops: String(e['free-evening-stops'] || '').split(/\n+/).map((l) => l.split('|').map((x) => x.trim())).filter((p) => p[0]).slice(0, 5).map(([stop, move]) => ({ stop: stop.slice(0, 80), move: (move || '').slice(0, 60) })) }
      : series === 'plus-one-day'
        ? { extraDays: Number(e['plus-one-day-extra-days']) || null, whoPaid: String(e['plus-one-day-who-paid-for-what'] || '').slice(0, 160), best: String(e['plus-one-day-best-decision'] || '').slice(0, 200), worst: String(e['plus-one-day-worst-decision'] || '').slice(0, 200) }
        : {};
    return send({ ok: true, series, label: series ? cardOf(story, series, dest).label : '', fields, safetyNote: series ? String(e['safety-note'] || '').slice(0, 600) : '', tripKit: tripKit(e['trip-kit']) });
  }

  const [ps, people, stamps, pros] = await Promise.all([
    listAll(env, fetchImpl, env.PURSUITS_COLLECTION_ID), listLive(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID),
    env.STAMPS_COLLECTION_ID ? listAll(env, fetchImpl, env.STAMPS_COLLECTION_ID) : [], env.PROS_COLLECTION_ID ? listLive(env, fetchImpl, env.PROS_COLLECTION_ID) : [],
  ]);
  const hub = ps.find((p) => p.fieldData?.slug === WORK_TRIPS);
  const cards = stories.filter((s) => !s.fieldData?.['external-url']).map((s) => ({ s, series: seriesOf(s, themes) })).filter((x) => x.series)
    .sort((a, b) => String(b.s.fieldData?.['published-date'] || '').localeCompare(String(a.s.fieldData?.['published-date'] || '')))
    .map((x) => cardOf(x.s, x.series, dest));
  return send({
    ok: true,
    hub: hub ? { name: hub.fieldData['display-name'] || hub.fieldData.name, live: hub.isDraft !== true, intro: String(hub.fieldData.intro || '') } : null,
    series: Object.keys(SERIES).map((k) => ({ slug: k, name: SERIES[k], stories: cards.filter((c) => c.series === k) })),
    wall: stampsWall(stamps, ps, people),
    roadWarriors: roadWarriors(pros, people),
  });
}
