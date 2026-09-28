// POST /hooks/story-published?token=...
//
// Webflow calls this when a Stories item is published, which on TLL means a
// human approved it. The story's countries are added to its author's map
// (Memberstack member JSON `tllStates`), add-only, and `tllStatesAt` is bumped
// so the map treats the server copy as newest. Each story is applied once:
// republishing a story never re-adds a country the author later removed.
//
// Needs these secrets (npx wrangler secret put NAME):
//   STORY_HOOK_TOKEN   shared token in the webhook URL; without it the route is a 404
//   WEBFLOW_TOKEN      Webflow site API token with CMS read access
//   MEMBERSTACK_KEY    Memberstack secret key (admin API)
// and these vars in wrangler.toml: STORIES_COLLECTION_ID, CONTRIBUTORS_COLLECTION_ID,
// COUNTRIES_COLLECTION_ID.

import { addStoryCountries } from './map-merge.js';
import { countriesInByline } from './story-countries.js';
import { numericForAlpha2 } from './iso-numeric.js';

const WEBFLOW_API = 'https://api.webflow.com/v2';
const MEMBERSTACK_API = 'https://admin.memberstack.com';
const DONE_PREFIX = 'storymap:';

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

/** Webflow sends one item per event; older payloads wrap it in `items`. */
export function publishedItems(body) {
  const payload = body?.payload ?? body;
  if (Array.isArray(payload?.items)) return payload.items;
  return payload?.fieldData ? [payload] : [];
}

async function webflowItem(env, fetchImpl, collectionId, itemId) {
  const response = await fetchImpl(`${WEBFLOW_API}/collections/${collectionId}/items/${itemId}`, {
    headers: { Authorization: `Bearer ${env.WEBFLOW_TOKEN}`, accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Webflow ${collectionId}/${itemId}: HTTP ${response.status}`);
  return response.json();
}

/** Alpha-2 codes for a story: the Countries reference when set, plus the byline line. */
export async function storyAlpha2(env, fetchImpl, fieldData) {
  const codes = [];
  const ref = fieldData?.['country-2'];
  if (ref && env.COUNTRIES_COLLECTION_ID) {
    try {
      const country = await webflowItem(env, fetchImpl, env.COUNTRIES_COLLECTION_ID, ref);
      const iso2 = country?.fieldData?.iso2;
      if (iso2) codes.push(String(iso2).toUpperCase());
    } catch (error) {
      // The reference may point somewhere without an iso2; the byline still counts.
      console.log(`story-hook country ref ${ref}: ${error?.message || error}`);
    }
  }
  for (const code of countriesInByline(fieldData?.['byline-location'])) {
    if (!codes.includes(code)) codes.push(code);
  }
  return codes;
}

async function memberstack(env, fetchImpl, path, init = {}) {
  const response = await fetchImpl(`${MEMBERSTACK_API}${path}`, {
    ...init,
    headers: { 'X-API-KEY': env.MEMBERSTACK_KEY, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`Memberstack ${path}: HTTP ${response.status}`);
  return response.json();
}

export async function applyStory(env, item, { fetchImpl = fetch, now = Date.now() } = {}) {
  const fieldData = item.fieldData || {};
  if (item.isDraft || item.isArchived) return { item: item.id, skipped: 'not live' };

  const doneKey = `${DONE_PREFIX}${item.id}`;
  if (await env.WIRE_KV.get(doneKey)) return { item: item.id, skipped: 'already applied' };

  if (!fieldData.contributor) return { item: item.id, skipped: 'no contributor' };
  const contributor = await webflowItem(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID, fieldData.contributor);
  const memberId = contributor?.fieldData?.['memberstack-id'];
  if (!memberId) return { item: item.id, skipped: 'contributor has no Memberstack ID' };

  const alpha2 = await storyAlpha2(env, fetchImpl, fieldData);
  const numeric = alpha2.map(numericForAlpha2).filter(Boolean);
  if (!numeric.length) {
    await env.WIRE_KV.put(doneKey, JSON.stringify({ at: now, added: [] }));
    return { item: item.id, skipped: 'no mappable country', alpha2 };
  }

  const member = await memberstack(env, fetchImpl, `/members/${encodeURIComponent(memberId)}`);
  const json = member?.data?.json && typeof member.data.json === 'object' ? member.data.json : {};
  const { states, added } = addStoryCountries(json.tllStates, numeric);

  if (added.length) {
    // Every other key in the member's JSON is carried over untouched.
    await memberstack(env, fetchImpl, `/members/${encodeURIComponent(memberId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ json: { ...json, tllStates: states, tllStatesAt: now } }),
    });
  }
  await env.WIRE_KV.put(doneKey, JSON.stringify({ at: now, added }));
  return { item: item.id, member: memberId, alpha2, added };
}

export async function handleStoryHook(request, env, { fetchImpl = fetch } = {}) {
  const token = env.STORY_HOOK_TOKEN;
  if (!token) return reply({ error: 'not found' }, 404);
  if (new URL(request.url).searchParams.get('token') !== token) return reply({ error: 'unauthorized' }, 401);
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY) return reply({ error: 'hook not configured' }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ error: 'bad json' }, 400);
  }

  const results = [];
  for (const item of publishedItems(body)) {
    if (env.STORIES_COLLECTION_ID && item.collectionId && item.collectionId !== env.STORIES_COLLECTION_ID) {
      results.push({ item: item.id, skipped: 'not a story' });
      continue;
    }
    try {
      results.push(await applyStory(env, item, { fetchImpl }));
    } catch (error) {
      results.push({ item: item.id, error: String(error?.message || error) });
    }
  }
  console.log(`story-hook ${JSON.stringify(results)}`);
  // Always 200 once authenticated, so Webflow does not retry into duplicates.
  return reply({ results });
}
