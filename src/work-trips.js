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
import { seriesCards, grouped, handleSeries, tripKit } from './series.js';
import { publicWhat, isWorkTrip, WORK_TRIPS } from './stamps.js';

const VISIBILITY_OFF = '1423c8d17c2060776541377f76ea0b31';
const ROAD_WARRIOR = '7203ed9cbb4a974d00937c5b801ec7e4';
const ROAD_WARRIOR_CAT = '0e80aa98b5e2e590c59223e3c8dc9886';
const WALL_MAX = 120;
export { tripKit };

const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
const send = (b, s = 200, cache = 600) => new Response(JSON.stringify(b), { status: s, headers: { ...headers, 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store' } });

export function stampsWall(stamps, ps, people) {
  const shown = new Map(people.filter((p) => !p.isDraft && p.fieldData?.visibility !== VISIBILITY_OFF).map((p) => [p.id, p]));
  const rows = stamps.filter((s) => !s.isArchived && s.fieldData?.['show-on-profile'] === true && s.fieldData?.private !== true && isWorkTrip(s.fieldData, ps) && shown.has(s.fieldData.owner))
    .map((s) => { const f = s.fieldData, p = shown.get(f.owner).fieldData; return { country: f.name || '', city: f.city || '', year: f.year || null, what: publicWhat(f, ps), member: String(p.name || '').split(' ')[0], memberSlug: p.slug }; })
    .sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, WALL_MAX);
  return { stamps: rows, countries: new Set(rows.map((r) => r.country.toLowerCase())).size, members: new Set(rows.map((r) => r.memberSlug)).size };
}

export function roadWarriors(pros, people) {
  return pros.filter((p) => p.fieldData?.track === ROAD_WARRIOR || p.fieldData?.category === ROAD_WARRIOR_CAT).map((p) => {
    const f = p.fieldData, person = people.find((c) => c.id === f.contributor && c.fieldData?.visibility !== VISIBILITY_OFF);
    if (!person) return null;
    return { slug: person.fieldData.slug, name: person.fieldData.name, avatar: person.fieldData.avatar?.url || '', line: String(f['pro-line'] || '').slice(0, 40),
      employer: f['permission-to-name-employer'] === true ? String(f.employer || '').slice(0, 60) : '' };
  }).filter(Boolean);
}

export async function handleWorkTrips(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET' } });
  if (!env.WEBFLOW_TOKEN || !env.PURSUITS_COLLECTION_ID) return send({ ok: false }, 503, 0);
  const url = new URL(request.url);
  if (url.pathname === '/work-trips/story') return handleSeries(new Request(url.origin + '/series/story' + url.search), env, { fetchImpl, now });
  const [{ cards }, ps, people, stamps, pros] = await Promise.all([
    seriesCards(env, fetchImpl), listAll(env, fetchImpl, env.PURSUITS_COLLECTION_ID), listLive(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID),
    env.STAMPS_COLLECTION_ID ? listAll(env, fetchImpl, env.STAMPS_COLLECTION_ID) : [], env.PROS_COLLECTION_ID ? listLive(env, fetchImpl, env.PROS_COLLECTION_ID) : [],
  ]);
  const hub = ps.find((p) => p.fieldData?.slug === WORK_TRIPS);
  return send({
    ok: true,
    hub: hub ? { name: hub.fieldData['display-name'] || hub.fieldData.name, live: hub.isDraft !== true, intro: String(hub.fieldData.intro || '') } : null,
    series: grouped(cards, 'work'),
    wall: stampsWall(stamps, ps, people),
    roadWarriors: roadWarriors(pros, people),
  });
}
