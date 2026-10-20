// POST /map-snapshot
//
// /the-map calls this after every successful map save, and only then. The body
// is the snapshot the profile, the Travelers card and /account read:
//   {"countries":n,"antarctica":true|false,"places":n,"layovers":n,"savedAt":"2026-10-20T12:00:00Z"}
// (an optional "storiesBy":n from the change log is accepted and kept).
// The token is verified with Memberstack (src/member-auth.js); the verified
// member's own Contributors item gets the JSON string on map-snapshot and is
// published. No page computes a count from anything else.
//
// 400 on a body that fails validation (integers 0..300, boolean, ISO date),
// 401 on a bad token, 404 with no Contributors item, 429 past 30 writes in an hour.
//
// Needs secrets WEBFLOW_TOKEN and MEMBERSTACK_KEY, CONTRIBUTORS_COLLECTION_ID in
// wrangler.toml [vars], and the WIRE_KV binding for the hourly counter.

import { findContributor, writeContributor } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';

export const SNAPSHOT_LIMIT_PER_HOUR = 30;
export const COUNT_MAX = 300;
const RATE_PREFIX = 'map-snapshot';
const COUNT_KEYS = ['countries', 'places', 'layovers'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

function isCount(value, max) {
  return Number.isInteger(value) && value >= 0 && value <= max;
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
  const { memberId } = auth;

  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ error: 'bad json' }, 400);
  }
  const checked = validateSnapshot(body);
  if (checked.error) return reply({ error: checked.error }, 400);

  if (!(await rateLimit(env, RATE_PREFIX, memberId, SNAPSHOT_LIMIT_PER_HOUR, now))) {
    return reply({ error: 'That is a lot of map saves in one hour. The map itself is saved; the public numbers catch up later.' }, 429);
  }

  try {
    const item = await findContributor(env, fetchImpl, memberId);
    if (!item) return reply({ error: 'Your profile page has not been created yet. Give it a minute and reload.' }, 404);
    const published = await writeContributor(env, fetchImpl, item, { 'map-snapshot': JSON.stringify(checked.snapshot) });
    console.log(`map-snapshot ${JSON.stringify({ member: memberId, item: item.id, snapshot: checked.snapshot, published })}`);
    return reply({ ok: true, savedAt: checked.snapshot.savedAt, slug: item.fieldData?.slug || null, published });
  } catch (error) {
    console.log(`map-snapshot ${JSON.stringify({ member: memberId, error: String(error?.message || error) })}`);
    return reply({ error: 'The snapshot did not reach the site. Try again in a moment.' }, 502);
  }
}
