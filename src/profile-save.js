// POST /profile/save
//
// /edit-profile saves as the member types. The page sends
//   Authorization: Bearer <Memberstack token>
//   {"fields": {"one-line": "...", "links-shown": "instagram,youtube", ...}}
// The token is verified with Memberstack (src/member-auth.js); the verified
// member id is the only member whose Contributors item is written. Fields are
// limited to the member-writable slugs (never badge-label, press-verified,
// map-snapshot, memberstack-id, slug), coerced with the same rules as the
// webhook, written to the item found by memberstack-id, then published.
//
// Replies {"ok":true,"savedAt":ISO,"slug":"...","fields":[...],"published":bool}.
// 400 on an unknown slug or a value that will not coerce, 401 on a bad token,
// 404 when the member has no Contributors item yet, 429 past 60 writes in an hour.
//
// Needs secrets WEBFLOW_TOKEN and MEMBERSTACK_KEY, CONTRIBUTORS_COLLECTION_ID in
// wrangler.toml [vars], and the WIRE_KV binding for the hourly counter.

import { MEMBER_WRITABLE, coerce, findContributor, writeContributor } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';

export const SAVE_LIMIT_PER_HOUR = 60;
const RATE_PREFIX = 'profile-save';

/**
 * Validates and coerces a {"fields": {...}} body.
 * Returns { patch } or { error, status }.
 */
export function patchFrom(body) {
  const fields = body?.fields;
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
    return { error: 'Send {"fields": {slug: value}}.', status: 400 };
  }
  const unknown = Object.keys(fields).filter((slug) => !MEMBER_WRITABLE.includes(slug));
  if (unknown.length) return { error: `These fields cannot be saved from a profile: ${unknown.join(', ')}.`, status: 400 };

  const patch = {};
  const invalid = [];
  for (const [slug, raw] of Object.entries(fields)) {
    const value = coerce(slug, raw);
    if (value === undefined) invalid.push(slug);
    else patch[slug] = value;
  }
  if (invalid.length) return { error: `These values could not be read: ${invalid.join(', ')}.`, status: 400 };
  if (!Object.keys(patch).length) return { error: 'Nothing to save.', status: 400 };
  return { patch };
}

export async function handleProfileSave(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.CONTRIBUTORS_COLLECTION_ID || !env.WIRE_KV) {
    return reply({ error: 'Saving is not switched on yet.' }, 503);
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
  const checked = patchFrom(body);
  if (checked.error) return reply({ error: checked.error }, checked.status);

  if (!(await rateLimit(env, RATE_PREFIX, memberId, SAVE_LIMIT_PER_HOUR, now))) {
    return reply({ error: 'That is a lot of saves in one hour. Your last changes are kept; try again a little later.' }, 429);
  }

  try {
    const item = await findContributor(env, fetchImpl, memberId);
    if (!item) return reply({ error: 'Your profile page has not been created yet. Give it a minute and reload.' }, 404);
    const published = await writeContributor(env, fetchImpl, item, checked.patch);
    const result = {
      ok: true,
      savedAt: new Date(now).toISOString(),
      slug: item.fieldData?.slug || null,
      fields: Object.keys(checked.patch),
      published,
    };
    console.log(`profile-save ${JSON.stringify({ member: memberId, item: item.id, fields: result.fields, published })}`);
    return reply(result);
  } catch (error) {
    console.log(`profile-save ${JSON.stringify({ member: memberId, error: String(error?.message || error) })}`);
    return reply({ error: 'The save did not reach the site. Try again in a moment.' }, 502);
  }
}
