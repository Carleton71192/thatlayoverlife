// GET /expats-map (31 Oct 2026, Roberta's beta idea, Nancy: "build the expats map of where people live on the expats page,
// maybe with flags"). Only members who opted in to the expat directory appear, and only with the place they already show on
// their public profile (home base, as they wrote it) at country and city level. Never a live location, never coordinates,
// never anyone with visibility Off or Unlisted. Sources: live Contributors items with list-expats on (or a live Directory item
// with is-expat on for the same profile), visibility Public. Cached for an hour.
//
// Reply: {"v":1,"expats":[{"name","slug","country":"it","place":"Florence, Italy","from":"it"}], "countries":{"it":1}}
import { webflow } from './profile-sync.js';
import { bylineCountries, listLive } from './site-stats.js';
import { ALLOWED_ORIGINS } from './member-auth.js';

const VISIBILITY_PUBLIC = 'a6fcbaf1151c3a0c53d2f575bd540c73';
const CACHE_SECONDS = 3600;

export function expatsMapCors(request) {
  const origin = request.headers.get('Origin') || '';
  const headers = { 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', Vary: 'Origin' };
  if (ALLOWED_ORIGINS.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

/** The public list from live Contributors and Directory items. Pure, for tests. */
export function buildExpats(contributors = [], directory = []) {
  const dirExpat = new Set(directory.filter((d) => !d.isDraft && !d.isArchived && d.fieldData?.['is-expat'] === true)
    .map((d) => String(d.fieldData?.['profile-slug'] || '').toLowerCase()).filter(Boolean));
  const out = [];
  for (const c of contributors) {
    const f = c.fieldData || {};
    if (c.isDraft || c.isArchived || f.visibility !== VISIBILITY_PUBLIC) continue;
    const slug = String(f.slug || '').toLowerCase();
    if (!(f['list-expats'] === true || dirExpat.has(slug))) continue;
    const place = String(f['home-base'] || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    const country = bylineCountries(place)[0];
    if (!place || !country) continue;
    const from = String(f['from-and-lived-in'] || '').split(',')[0].trim().toLowerCase();
    out.push({ name: String(f.name || '').trim(), slug, country, place, from: /^[a-z]{2}$/.test(from) ? from : null });
  }
  out.sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));
  const countries = {};
  for (const e of out) countries[e.country] = (countries[e.country] || 0) + 1;
  return { v: 1, expats: out, countries };
}

export async function handleExpatsMap(request, env, { fetchImpl = fetch, cache = globalThis.caches?.default } = {}) {
  const cors = expatsMapCors(request);
  const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors, ...extra } });
  if (!env.WEBFLOW_TOKEN || !env.CONTRIBUTORS_COLLECTION_ID) return json({ error: 'not configured' }, 503, { 'Cache-Control': 'no-store' });
  const key = new Request('https://cache.local/expats-map/v1');
  if (cache) {
    const hit = await cache.match(key);
    if (hit) return json(await hit.json(), 200, { 'Cache-Control': `public, max-age=${CACHE_SECONDS}` });
  }
  try {
    const [contributors, directory] = await Promise.all([
      listLive(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID),
      env.DIRECTORY_COLLECTION_ID ? listLive(env, fetchImpl, env.DIRECTORY_COLLECTION_ID) : Promise.resolve([]),
    ]);
    const body = buildExpats(contributors, directory);
    if (cache) await cache.put(key, new Response(JSON.stringify(body), { headers: { 'Cache-Control': `max-age=${CACHE_SECONDS}` } }));
    return json(body, 200, { 'Cache-Control': `public, max-age=${CACHE_SECONDS}` });
  } catch (error) {
    console.log(`expats-map ${String(error?.message || error)}`);
    return json({ error: 'The map is not available right now.' }, 502, { 'Cache-Control': 'no-store' });
  }
}
