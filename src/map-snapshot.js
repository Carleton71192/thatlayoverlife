// POST /map-snapshot
//
// /the-map calls this after every successful map save, and only then. The body
// is the snapshot the profile, the Travelers card and /account read:
//   {"countries":n,"antarctica":true|false,"places":n,"layovers":n,"savedAt":"2026-10-20T12:00:00Z"}
// (an optional "storiesBy":n from the change log is accepted and kept).
// Since B3.7 the page may also send the member's tllStates:
//   {"snapshot":{...the object above...},"states":{"v":2,"travelers":[...],"states":{...}}}
// Both shapes are accepted. The states are kept only when the verified member is the site
// owner (env.OWNER_MEMBER_ID), sanitized into WIRE_KV "owner-map:v2" for GET /owner-map
// (owner-map.js); for every other member they are ignored. The owner's reply carries
// "ownerMap": true|false.
// The token is verified with Memberstack (src/member-auth.js); the verified
// member's own Contributors item gets the JSON string on map-snapshot and is
// published. No page computes a count from anything else.
//
// 400 on a body that fails validation (integers 0..300, boolean, ISO date),
// 401 on a bad token, 404 with no Contributors item, 429 past 30 writes in an hour.
//
// Needs secrets WEBFLOW_TOKEN and MEMBERSTACK_KEY, CONTRIBUTORS_COLLECTION_ID in
// wrangler.toml [vars], and the WIRE_KV binding for the hourly counter. OWNER_MEMBER_ID
// in [vars] switches on the owner map; without it no states are ever stored.

import { findContributor, writeContributor } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';
import { isOwner, storeOwnerMap } from './owner-map.js';

export const SNAPSHOT_LIMIT_PER_HOUR = 30;
export const COUNT_MAX = 300;
const RATE_PREFIX = 'map-snapshot';
const COUNT_KEYS = ['countries', 'places', 'layovers'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

function isCount(value, max) {
  return Number.isInteger(value) && value >= 0 && value <= max;
}

/**
 * Splits a request body into the snapshot and the optional states.
 * {"snapshot":{...},"states":{...}} or the flat snapshot on its own.
 */
export function splitBody(body) {
  if (body && typeof body === 'object' && !Array.isArray(body) && 'snapshot' in body) {
    const unknown = Object.keys(body).filter((key) => key !== 'snapshot' && key !== 'states');
    if (unknown.length) return { error: `Unknown keys: ${unknown.join(', ')}.` };
    return { snapshotBody: body.snapshot, states: body.states };
  }
  return { snapshotBody: body, states: undefined };
}

/**
 * Validates a snapshot body. Returns { snapshot } with the keys in a fixed
 * order, or { error } naming what failed.
 */
export function validateSnapshot(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Send the snapshot object.' };
  const allowed = new Set([...COUNT_KEYS, 'antarctica', 'savedAt', 'storiesBy']);
  const unknown = Object.keys(body).filter((key) => !allowed.has(key));
  if (unknown.length) return { error: `Unknown keys: ${unknown.join(', ')}.` };

  const problems = [];
  for (const key of COUNT_KEYS) {
    if (!isCount(body[key], COUNT_MAX)) problems.push(`${key} must be a whole number from 0 to ${COUNT_MAX}`);
  }
  if (typeof body.antarctica !== 'boolean') problems.push('antarctica must be true or false');
  if (typeof body.savedAt !== 'string' || !ISO_DATE.test(body.savedAt) || Number.isNaN(Date.parse(body.savedAt))) {
    problems.push('savedAt must be an ISO date like 2026-10-20T12:00:00Z');
  }
  if ('storiesBy' in body && !isCount(body.storiesBy, 10000)) problems.push('storiesBy must be a whole number');
  if (problems.length) return { error: problems.join('; ') + '.' };

  const snapshot = {
    countries: body.countries,
    antarctica: body.antarctica,
    places: body.places,
    layovers: body.layovers,
  };
  if ('storiesBy' in body) snapshot.storiesBy = body.storiesBy;
  snapshot.savedAt = body.savedAt;
  return { snapshot };
}

export async function handleMapSnapshot(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.CONTRIBUTORS_COLLECTION_ID || !env.WIRE_KV) {
    return reply({ error: 'Snapshots are not switched on yet.' }, 503);
  }

  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  const { memberId, verifiedId } = auth;

  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ error: 'bad json' }, 400);
  }
  const parts = splitBody(body);
  if (parts.error) return reply({ error: parts.error }, 400);
  const checked = validateSnapshot(parts.snapshotBody);
  if (checked.error) return reply({ error: checked.error }, 400);

  if (!(await rateLimit(env, RATE_PREFIX, memberId, SNAPSHOT_LIMIT_PER_HOUR, now))) {
    return reply({ error: 'That is a lot of map saves in one hour. The map itself is saved; the public numbers catch up later.' }, 429);
  }

  // Owner only, and only on the id Memberstack itself returned. Stored before the Webflow
  // write so the visitors' map stays current even when Webflow is slow.
  const owner = isOwner(env, verifiedId);
  let ownerMap = false;
  if (owner) {
    try {
      ownerMap = await storeOwnerMap(env, verifiedId, parts.states);
    } catch {
      ownerMap = false;
    }
  }

  try {
    const item = await findContributor(env, fetchImpl, memberId);
    if (!item) return reply({ error: 'Your profile page has not been created yet. Give it a minute and reload.' }, 404);
    const published = await writeContributor(env, fetchImpl, item, { 'map-snapshot': JSON.stringify(checked.snapshot) });
    console.log(`map-snapshot ${JSON.stringify({ member: memberId, item: item.id, snapshot: checked.snapshot, published })}`);
    const out = { ok: true, savedAt: checked.snapshot.savedAt, slug: item.fieldData?.slug || null, published };
    if (owner) out.ownerMap = ownerMap;
    return reply(out);
  } catch (error) {
    console.log(`map-snapshot ${JSON.stringify({ member: memberId, error: String(error?.message || error) })}`);
    return reply({ error: 'The snapshot did not reach the site. Try again in a moment.' }, 502);
  }
}
