// POST /hooks/member-updated?token=...
//
// Memberstack calls this (webhook events member.created and member.updated)
// after a Traveler saves /edit-profile. The member's custom fields are copied
// onto their Contributors item in the Webflow CMS, which is what the public
// profile at /contributors/{slug} renders, and the item is republished.
//
// Only fields the member actually sent are written; everything else on the
// CMS item (avatar, badge, editor-only fields) stays as the editor left it.
//
// Needs these secrets (npx wrangler secret put NAME):
//   PROFILE_HOOK_TOKEN  shared token in the webhook URL; without it the route is a 404
//   WEBFLOW_TOKEN       Webflow site API token with CMS read + write access
// and CONTRIBUTORS_COLLECTION_ID in wrangler.toml [vars].

const WEBFLOW_API = 'https://api.webflow.com/v2';

/** Memberstack custom-field key → Contributors field slug. */
export const FIELD_MAP = Object.freeze({
  'name': 'name',
  'fun-title': 'fun-title',
  'home-base': 'home-base',
  'bio-short': 'bio-short',
  'bio-long': 'bio-long',
  'country-count': 'country-count',
  'cities-count': 'cities-count',
  'states-count': 'states-count',
  'national-parks-count': 'national-parks-count',
  'continents-marathoned': 'continents-marathoned',
  'personal-website-url': 'website-url',
  'linkedin-url': 'linkedin-url-2',
  'instagram-url': 'instagram-url',
  'youtube-url': 'youtube-url',
  'tiktok-url': 'tiktok-url',
  'vimeo-url': 'vimeo-url',
  'substack-url': 'substack-url-2',
  'twitter-x-url': 'x-url',
  'available-for-press': 'available-for-press',
  'available-for-partnerships': 'available-for-partnerships',
  'available-for-sponsored-stories': 'available-for-sponsored-stories',
  'available-for-collabs': 'available-for-collabs',
  'accepts-newsletter': 'accepts-newsletter',
});

const NUMBER_FIELDS = new Set(['country-count', 'cities-count', 'states-count', 'national-parks-count', 'continents-marathoned']);
const SWITCH_FIELDS = new Set(['available-for-press', 'available-for-partnerships', 'available-for-sponsored-stories', 'available-for-collabs', 'accepts-newsletter']);
const URL_FIELDS = new Set(['website-url', 'linkedin-url-2', 'instagram-url', 'youtube-url', 'tiktok-url', 'vimeo-url', 'substack-url-2', 'x-url']);

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function escapeHtml(text) {
  return String(text).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

/** Turn one Memberstack value into the CMS field's type. Returns undefined to leave the field alone. */
export function coerce(slug, raw) {
  if (raw === undefined || raw === null) return undefined;
  const text = typeof raw === 'string' ? raw.trim() : raw;
  if (SWITCH_FIELDS.has(slug)) {
    if (typeof text === 'boolean') return text;
    return ['true', 'on', '1', 'yes'].includes(String(text).toLowerCase());
  }
  if (NUMBER_FIELDS.has(slug)) {
    if (text === '') return null;
    const n = Number(text);
    return Number.isFinite(n) ? Math.max(0, Math.round(n)) : undefined;
  }
  if (URL_FIELDS.has(slug)) {
    if (text === '') return null;
    return /^https?:\/\//i.test(text) ? text : `https://${text}`;
  }
  if (slug === 'bio-long') {
    if (text === '') return null;
    return String(text).split(/\n{2,}/).map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
  }
  return text === '' ? null : String(text);
}

/** CMS fieldData patch from a Memberstack member payload. Empty object when nothing maps. */
export function fieldDataFor(member) {
  const custom = member?.customFields || {};
  const out = {};
  for (const [key, slug] of Object.entries(FIELD_MAP)) {
    if (!(key in custom)) continue;
    const value = coerce(slug, custom[key]);
    if (value !== undefined) out[slug] = value;
  }
  return out;
}

async function webflow(env, fetchImpl, path, init = {}) {
  const response = await fetchImpl(`${WEBFLOW_API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${env.WEBFLOW_TOKEN}`, accept: 'application/json', 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`Webflow ${path}: HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}

/** The Contributors item whose memberstack-id matches, paging through the collection. */
export async function findContributor(env, fetchImpl, memberId) {
  const collection = env.CONTRIBUTORS_COLLECTION_ID;
  for (let offset = 0; offset < 1000; offset += 100) {
    const page = await webflow(env, fetchImpl, `/collections/${collection}/items?limit=100&offset=${offset}`);
    const items = page?.items || [];
    const hit = items.find((item) => item?.fieldData?.['memberstack-id'] === memberId);
    if (hit) return hit;
    if (items.length < 100) return null;
  }
  return null;
}

export async function applyMember(env, member, { fetchImpl = fetch } = {}) {
  const memberId = member?.id;
  if (!memberId) return { skipped: 'no member id' };
  const patch = fieldDataFor(member);
  if (!Object.keys(patch).length) return { member: memberId, skipped: 'nothing to sync' };

  const item = await findContributor(env, fetchImpl, memberId);
  if (!item) return { member: memberId, skipped: 'no Contributors item carries this Memberstack ID' };

  const collection = env.CONTRIBUTORS_COLLECTION_ID;
  await webflow(env, fetchImpl, `/collections/${collection}/items/${item.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fieldData: patch }),
  });
  // A profile the editor has already published stays published; a draft stays a draft.
  let published = false;
  if (!item.isDraft) {
    await webflow(env, fetchImpl, `/collections/${collection}/items/publish`, {
      method: 'POST',
      body: JSON.stringify({ itemIds: [item.id] }),
    });
    published = true;
  }
  return { member: memberId, item: item.id, fields: Object.keys(patch), published };
}

/** Memberstack webhooks wrap the member in `payload`; a bare member object is accepted too. */
export function memberFrom(body) {
  const payload = body?.payload ?? body;
  return payload && (payload.id || payload.customFields) ? payload : null;
}

export async function handleProfileHook(request, env, { fetchImpl = fetch } = {}) {
  const token = env.PROFILE_HOOK_TOKEN;
  if (!token) return reply({ error: 'not found' }, 404);
  if (new URL(request.url).searchParams.get('token') !== token) return reply({ error: 'unauthorized' }, 401);
  if (!env.WEBFLOW_TOKEN || !env.CONTRIBUTORS_COLLECTION_ID) return reply({ error: 'hook not configured' }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ error: 'bad json' }, 400);
  }
  const member = memberFrom(body);
  if (!member) return reply({ error: 'no member in payload' }, 400);

  let result;
  try {
    result = await applyMember(env, member, { fetchImpl });
  } catch (error) {
    result = { member: member.id, error: String(error?.message || error) };
  }
  console.log(`profile-sync ${JSON.stringify(result)}`);
  // Always 200 once authenticated, so Memberstack does not retry into duplicates.
  return reply({ result });
}
