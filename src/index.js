// The Travel Wire worker.
//   GET /wire?region=&country=&limit=   public JSON for thatlayover.life
//   GET /health                         liveness plus wire freshness
//   POST /refresh                       manual ingest, only when REFRESH_TOKEN is set
//   POST /hooks/member-updated          Memberstack webhook: copies a member's profile
//                                       fields onto their Contributors CMS item, creates
//                                       the item on member.created (profile-sync.js)
//   POST /hooks/story-published         Webflow publish webhook: adds a story's
//                                       countries to its author's map (story-hook.js)
//   POST /profile/save                  /edit-profile autosave, Memberstack Bearer token (profile-save.js)
//   POST /press/apply                   /edit-profile 07 press application, same token; saved as a
//                                       draft item in the Press applications collection (press-apply.js)
//   POST /map-snapshot                  /the-map writes the count snapshot, same token (map-snapshot.js);
//                                       for the site owner only, also the sanitized tllStates
//   POST /intake                        a member's story, link-out or photos, set up and published at once (intake.js)
//   GET /link-summary?url=              AI summary of a linked article for link-out cards (link-summary.js)
//   GET /lounge                         published member photos for the /gallery Lounge (intake.js)
//   GET /expats-map                     opted-in expats by country and home base, for /for-expats (expats-map.js)
//   GET /owner-map                      the site owner's sanitized map for the visitors' view (owner-map.js)
//   POST /translate                     { itemId, target }: a labeled machine translation of a PUBLISHED story for one
//                                       reader; the original is never changed (translate.js, multilingual Phase 1)
//   GET /link-preview?url=              a submitted article's own share photo, title and description for the
//                                       /submit link-out form; photos only, never ads (link-preview.js)
// The member routes and the member webhook answer CORS preflights for the site's
// three origins only (member-auth.js). Cron (every 30 min) runs the same ingest as /refresh.

import { runIngest, summarizeRun } from './ingest.js';
import { handleStoryHook } from './story-hook.js';
import { FEEDS } from './feeds.js';
import { filterItems, readWire } from './store.js';
import { REGIONS } from './regions.js';
import { handleProfileHook } from './profile-sync.js';
import { handleProfileSave } from './profile-save.js';
import { handlePressApply } from './press-apply.js';
import { handleMapSnapshot } from './map-snapshot.js';
import { memberCors, withHeaders } from './member-auth.js';
import { handleOwnerMap, ownerMapCors } from './owner-map.js';
import { handleLinkPreview, linkPreviewCors } from './link-preview.js';
import { handleTranslate, translateCors } from './translate.js';
import { runSiteStats } from './site-stats.js';
import { handleExpatsMap, expatsMapCors } from './expats-map.js';
import { handleIntake, handleLounge } from './intake.js';
import { handleLinkSummary } from './link-summary.js';
import { handleCrew, handleCrewPublic } from './crew.js';
import { runEnrich } from './story-enrich.js';
import { handleWhatsNew } from './whats-new.js';
import { handleAlbum, handleAlbumSettings } from './album.js';
import { handleExport } from './export.js';
import { handlePros } from './pros.js';
import { handleWorkTrips } from './work-trips.js';
import { handleSeries } from './series.js';
import { handleLivingLibrary } from './living-library.js';
import { handleTravelStyle } from './travel-style.js';
import { handlePetPublic, handlePetMember } from './pet-passport.js';
import { handleSettings } from './settings.js';
import { handlePaw } from './paw.js';
import { handleMetrics, runMetricsSnapshot } from './metrics.js';
import { handleStamps, handleStampsPublic, runPursuitCounts } from './stamps.js';
import { handleCollections, handleCollectionsPublic, runCollectionCounts } from './collections.js';

/** Routes a signed-in member calls from the site, plus the member webhook. */
const MEMBER_ROUTES = {
  '/profile/save': handleProfileSave,
  '/press/apply': handlePressApply,
  '/map-snapshot': handleMapSnapshot,
  '/intake': handleIntake,
  '/hooks/member-updated': handleProfileHook,
  '/crew/inbox': handleCrew,
  '/crew/invite': handleCrew,
  '/crew/answer': handleCrew,
  '/crew/cancel': handleCrew,
  '/crew/leave': handleCrew,
  '/collections/mine': handleCollections,
  '/collections/add': handleCollections,
  '/collections/delete': handleCollections,
  '/collections/show': handleCollections,
  '/stamps/mine': handleStamps,
  '/pets/mine': handlePetMember,
  '/travel-style': handleTravelStyle,
  '/pets/update': handlePetMember,
  '/stamps/add': handleStamps,
  '/stamps/delete': handleStamps,
  '/stamps/show': handleStamps,
  '/stamps/private': handleStamps,
  '/album/settings': handleAlbumSettings,
  '/export': handleExport,
  '/metrics': handleMetrics,
};

const EDGE_CACHE_SECONDS = 300;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function json(body, { status = 200, cacheSeconds = 0 } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cacheSeconds ? `public, max-age=${cacheSeconds}` : 'no-store',
      ...CORS_HEADERS,
    },
  });
}

async function handleWire(request, env, ctx) {
  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  const { searchParams } = new URL(request.url);
  const wire = await readWire(env);
  const items = filterItems(wire.items, {
    region: searchParams.get('region'),
    country: searchParams.get('country'),
    limit: searchParams.get('limit'),
  });

  const response = json({ updatedAt: wire.updatedAt, items }, { cacheSeconds: EDGE_CACHE_SECONDS });
  ctx.waitUntil(cache.put(request, response.clone()));
  return response;
}

async function handleRefresh(request, env) {
  const token = env.REFRESH_TOKEN;
  // Without a configured token the endpoint does not exist.
  if (!token) return json({ error: 'not found' }, { status: 404 });
  const supplied = request.headers.get('Authorization') || '';
  if (supplied !== `Bearer ${token}`) return json({ error: 'unauthorized' }, { status: 401 });

  const summary = await runIngest(env);
  console.log(summarizeRun(summary));
  return json(summary);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname in MEMBER_ROUTES) {
      const cors = memberCors(request);
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
      if (request.method !== 'POST') return withHeaders(json({ error: 'method not allowed' }, { status: 405 }), cors);
      return withHeaders(await MEMBER_ROUTES[url.pathname](request, env), cors);
    }

    if (url.pathname === '/link-summary') return handleLinkSummary(request, env);
    if (url.pathname === '/crew/people' || url.pathname === '/crew/public') return handleCrewPublic(request, env);
    if (url.pathname === '/collections/public') return handleCollectionsPublic(request, env);
    if (url.pathname === '/whats-new') return handleWhatsNew(request, env);
    if (url.pathname === '/album') return handleAlbum(request, env);
    if (url.pathname === '/pros') return handlePros(request, env);
    if (url.pathname === '/work-trips' || url.pathname === '/work-trips/story') return handleWorkTrips(request, env);
    if (url.pathname === '/series' || url.pathname === '/series/story') return handleSeries(request, env);
    if (url.pathname === '/living-library') return handleLivingLibrary(request, env);
    if (url.pathname === '/pets/public' || url.pathname === '/pets/notes' || url.pathname === '/pets/featured') return handlePetPublic(request, env);
    if (url.pathname === '/settings') return handleSettings(request, env);
    if (url.pathname === '/paw/waitlist' || url.pathname === '/paw/waitlist/export') return handlePaw(request, env);
    if (url.pathname === '/stamps/public' || url.pathname === '/pursuits/status') return handleStampsPublic(request, env);

    if (url.pathname === '/lounge') {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: expatsMapCors(request) });
      return handleLounge(request, env);
    }

    if (url.pathname === '/expats-map') {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: expatsMapCors(request) });
      return handleExpatsMap(request, env);
    }

    if (url.pathname === '/owner-map') {
      const cors = ownerMapCors(request);
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(JSON.stringify({ error: 'method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors },
        });
      }
      return handleOwnerMap(request, env);
    }

    if (url.pathname === '/translate') {
      const cors = translateCors(request);
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, code: 'method-not-allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors },
        });
      }
      return handleTranslate(request, env);
    }

    if (url.pathname === '/link-preview') {
      const cors = linkPreviewCors(request);
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors },
        });
      }
      return handleLinkPreview(request, env, ctx);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname === '/refresh') {
      if (request.method !== 'POST') return json({ error: 'method not allowed' }, { status: 405 });
      return handleRefresh(request, env);
    }

    if (url.pathname === '/hooks/story-published') {
      if (request.method !== 'POST') return json({ error: 'method not allowed' }, { status: 405 });
      return handleStoryHook(request, env);
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return json({ error: 'method not allowed' }, { status: 405 });
    }

    switch (url.pathname) {
      case '/wire':
        return handleWire(request, env, ctx);
      case '/health': {
        const wire = await readWire(env);
        return json({
          ok: true,
          updatedAt: wire.updatedAt,
          items: wire.items.length,
          feeds: FEEDS.filter((feed) => feed.enabled).map((feed) => feed.source),
        });
      }
      case '/':
        return json({
          service: 'The Travel Wire',
          site: 'https://thatlayover.life',
          endpoint: '/wire',
          params: { region: REGIONS, country: 'ISO 3166-1 alpha-2', limit: '1-100, default 30' },
          note: 'Headlines, links and feed-provided snippets only. Every click goes to the source.',
        }, { cacheSeconds: EDGE_CACHE_SECONDS });
      default:
        return json({ error: 'not found' }, { status: 404 });
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      runIngest(env)
        .then((summary) => console.log(summarizeRun(summary)))
        .catch((error) => console.error(`wire run failed: ${error?.stack || error}`)),
    );
    ctx.waitUntil(
      runSiteStats(env)
        .then((line) => console.log(line))
        .catch((error) => console.error(`site-stats failed: ${error?.message || error}`)),
    );
    ctx.waitUntil(
      runMetricsSnapshot(env)
        .then((line) => console.log(line))
        .catch((error) => console.error(`metrics failed: ${error?.message || error}`)),
    );
    ctx.waitUntil(
      runPursuitCounts(env)
        .then((line) => console.log(line))
        .catch((error) => console.error(`pursuits count failed: ${error?.message || error}`)),
    );
    ctx.waitUntil(
      runCollectionCounts(env)
        .then((line) => console.log(line))
        .catch((error) => console.error(`collections count failed: ${error?.message || error}`)),
    );
    ctx.waitUntil(
      runEnrich(env)
        .then((line) => console.log(line))
        .catch((error) => console.error(`enrich failed: ${error?.message || error}`)),
    );
  },
};
