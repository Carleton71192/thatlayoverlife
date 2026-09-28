// The Travel Wire worker.
//   GET /wire?region=&country=&limit=   public JSON for thatlayover.life
//   GET /health                         liveness plus wire freshness
//   POST /refresh                       manual ingest, only when REFRESH_TOKEN is set
//   POST /hooks/story-published         Webflow publish webhook: adds a story's
//                                       countries to its author's map (story-hook.js)
// Cron (every 30 min) runs the same ingest as /refresh.

import { runIngest, summarizeRun } from './ingest.js';
import { handleStoryHook } from './story-hook.js';
import { FEEDS } from './feeds.js';
import { filterItems, readWire } from './store.js';
import { REGIONS } from './regions.js';

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
  },
};
