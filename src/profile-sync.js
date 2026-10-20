// POST /hooks/member-updated?token=...
//
// Memberstack calls this on member.created and member.updated. The member's
// custom fields (Profile v2, keys equal the Contributors slugs) are copied onto
// their Contributors item in the Webflow CMS, which is what the public profile
// at /contributors/{slug} renders, and the item is republished.
//
// member.created with no Contributors item yet: one is created (name, slug from
// the name with -2, -3 on collision, avatar if Memberstack gave one, visibility
// Public, contact-mode Relay, credit-mode Full, memberstack-id, member-since
// now) and published, so a profile is live within a minute of sign-up.
//
// Only fields the member actually sent are written; everything else on the
// CMS item stays as the editor left it. badge-label, press-verified,
// map-snapshot and slug are never written from a member payload. The typed
// counts (country-count and friends) are not mapped any more; the map snapshot
// carries the live numbers.
//
// Needs these secrets (npx wrangler secret put NAME):
//   PROFILE_HOOK_TOKEN  shared token in the webhook URL; without it the route is a 404
//   WEBFLOW_TOKEN       Webflow site API token with CMS read + write access
// and CONTRIBUTORS_COLLECTION_ID in wrangler.toml [vars].

const WEBFLOW_API = 'https://api.webflow.com/v2';

/** Option fields: name to Webflow option id (handoff/packet-c/CONTRACTS.md). */
export const OPTION_IDS = Object.freeze({
  'credit-mode': Object.freeze({
    Full: '3489ae81c67477dbdf19a921804b343e',
    First: 'd01799503381d459b0ae4b27b0535111',
    Pen: '38820387bc6c4892f486394a6c28776c',
  }),
  'contact-mode': Object.freeze({
    Relay: 'e059bc90db214b44e068b9c6a89fad5e',
    Instagram: 'd1db81e50c5db2f87fd57f60cc1ee423',
    Email: '5728f608dc64c601dd0c6c8aaca5e036',
    Off: '3e614a6cd3aa38f1ce19263324b32179',
  }),
  'visibility': Object.freeze({
    Public: 'a6fcbaf1151c3a0c53d2f575bd540c73',
    Unlisted: 'c32afc794ebfffa4275c7710b9b45c9b',
    Off: '1423c8d17c2060776541377f76ea0b31',
  }),
});

/** Memberstack custom-field key to Contributors field slug (Profile v2). */
export const FIELD_MAP = Object.freeze({
  'name': 'name',
  'one-line': 'one-line',
  'home-base': 'home-base',
  'from-and-lived-in': 'from-and-lived-in',
  'languages': 'languages',
  'credit-mode': 'credit-mode',
  'pen-name': 'pen-name',
  'contact-mode': 'contact-mode',
  'email': 'email',
  'visibility': 'visibility',
  'share-ranges': 'share-ranges',
  'links-shown': 'links-shown',
  'bio-long': 'bio-long',
  'instagram-url': 'instagram-url',
  'youtube-url': 'youtube-url',
  'personal-website-url': 'website-url',
  'tiktok-url': 'tiktok-url',
  'substack-url': 'substack-url-2',
  'strava-url': 'strava-url-2',
  'alltrails-url': 'alltrails-url',
  'komoot-url': 'komoot-url',
  'garmin-url': 'garmin-url',
  'beli-url': 'beli-url',
  'list-expats': 'list-expats',
  'list-creators': 'list-creators',
  'list-press': 'list-press',
});

/** The ten platform keys links-shown may hold, in display order. */
export const LINK_KEYS = Object.freeze(['instagram', 'youtube', 'website', 'tiktok', 'substack', 'strava', 'alltrails', 'komoot', 'garmin', 'beli']);

export const SWITCH_FIELDS = new Set(['share-ranges', 'list-expats', 'list-creators', 'list-press']);
export const URL_FIELDS = new Set(['instagram-url', 'youtube-url', 'website-url', 'tiktok-url', 'substack-url-2', 'strava-url-2', 'alltrails-url', 'komoot-url', 'garmin-url', 'beli-url']);
export const OPTION_FIELDS = new Set(Object.keys(OPTION_IDS));

/** Slugs a member may write through the webhook or POST /profile/save. Nothing else is ever accepted from a member. */
export const MEMBER_WRITABLE = Object.freeze([
  'name', 'avatar', 'one-line', 'home-base', 'from-and-lived-in', 'languages',
  'credit-mode', 'pen-name', 'contact-mode', 'email', 'visibility', 'share-ranges',
  'crew', 'bio-long', ...URL_FIELDS, 'links-shown', 'list-expats', 'list-creators', 'list-press',
]);

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function escapeHtml(text) {
  return String(text).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

/** Option name (any case) or option id to the option id; undefined when it is neither. */
export function optionId(slug, raw) {
  const table = OPTION_IDS[slug];
  if (!table) return undefined;
  const text = String(raw).trim();
  if (Object.values(table).includes(text)) return text;
  const hit = Object.keys(table).find((name) => name.toLowerCase() === text.toLowerCase());
  return hit ? table[hit] : undefined;
}

/** true, false, "true", "false", "on", "off" (plus 1/0, yes/no) to a boolean; undefined otherwise. */
export function switchValue(raw) {
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'number') return raw !== 0;
  const text = String(raw).trim().toLowerCase();
  if (['true', 'on', '1', 'yes'].includes(text)) return true;
  if (['false', 'off', '0', 'no', ''].includes(text)) return false;
  return undefined;
}

function listOf(raw) {
  if (Array.isArray(raw)) return raw.map((v) => String(v).trim()).filter(Boolean);
  return String(raw).split(/[,\s]+/).map((v) => v.trim()).filter(Boolean);
}

/**
 * Turn one member value into the CMS field's type.
 * Returns undefined to leave the field alone (invalid or unknown) and null to clear it.
 */
export function coerce(slug, raw) {
  if (raw === undefined || raw === null) return undefined;
  const text = typeof raw === 'string' ? raw.trim() : raw;
  if (SWITCH_FIELDS.has(slug)) return switchValue(text);
  if (OPTION_FIELDS.has(slug)) return text === '' ? null : optionId(slug, text);
  if (URL_FIELDS.has(slug) || slug === 'avatar') {
    if (text === '') return null;
    if (typeof text !== 'string' || /\s/.test(text)) return undefined;
    const url = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    return slug === 'avatar' ? { url } : url;
  }
  if (slug === 'name') return typeof text === 'string' && text !== '' ? text : undefined;
  if (slug === 'email') {
    if (text === '') return null;
    const email = String(text).toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;
  }
  if (slug === 'from-and-lived-in') {
    const codes = listOf(text).map((c) => c.toLowerCase()).filter((c) => /^[a-z]{2}$/.test(c));
    const unique = [...new Set(codes)];
    return unique.length ? unique.join(',') : null;
  }
  if (slug === 'links-shown') {
    const keys = listOf(text).map((k) => k.toLowerCase()).filter((k) => LINK_KEYS.includes(k));
    const unique = LINK_KEYS.filter((k) => keys.includes(k));
    return unique.length ? unique.join(',') : null;
  }
  if (slug === 'crew') {
    const ids = listOf(text).filter((id) => /^[a-f0-9]{24}$/i.test(id));
    return ids.length ? ids : [];
  }
  if (slug === 'bio-long') {
    if (text === '') return null;
    return String(text).split(/\n{2,}/).map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
  }
  if (typeof text === 'object') return undefined;
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

/** Lowercase ascii slug with hyphens, 60 characters at most. */
export function slugify(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
}

/** `base`, or `base-2`, `base-3` and so on until it is not in `taken`. */
export function uniqueSlug(base, taken) {
  const root = slugify(base) || 'traveler';
  const have = new Set([...taken].map((s) => String(s).toLowerCase()));
  if (!have.has(root)) return root;
  for (let n = 2; n < 1000; n += 1) {
    const candidate = `${root}-${n}`;
    if (!have.has(candidate)) return candidate;
  }
  return `${root}-${Date.now()}`;
}

/** The display name Memberstack gave us: the name field, else first and last, else the email's local part. */
export function memberName(member) {
  const custom = member?.customFields || {};
  const name = String(custom.name || '').trim();
  if (name) return name;
  const parts = [custom['first-name'], custom['last-name']].map((p) => String(p || '').trim()).filter(Boolean);
  if (parts.length) return parts.join(' ');
  const email = member?.auth?.email || member?.email || '';
  return String(email).split('@')[0].trim();
}

export async function webflow(env, fetchImpl, path, init = {}) {
  const response = await fetchImpl(`${WEBFLOW_API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${env.WEBFLOW_TOKEN}`, accept: 'application/json', 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`Webflow ${path}: HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}

/** Every item in the Contributors collection, paged 100 at a time. */
export async function listContributors(env, fetchImpl) {
  const collection = env.CONTRIBUTORS_COLLECTION_ID;
  const all = [];
  for (let offset = 0; offset < 1000; offset += 100) {
    const page = await webflow(env, fetchImpl, `/collections/${collection}/items?limit=100&offset=${offset}`);
    const items = page?.items || [];
    all.push(...items);
    if (items.length < 100) break;
  }
  return all;
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

/** PATCH the item's fieldData, then publish it unless the editor keeps it as a draft. */
export async function writeContributor(env, fetchImpl, item, patch) {
  const collection = env.CONTRIBUTORS_COLLECTION_ID;
  await webflow(env, fetchImpl, `/collections/${collection}/items/${item.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fieldData: patch }),
  });
  // A profile the editor has already published stays published; a draft stays a draft.
  if (item.isDraft) return false;
  await webflow(env, fetchImpl, `/collections/${collection}/items/publish`, {
    method: 'POST',
    body: JSON.stringify({ itemIds: [item.id] }),
  });
  return true;
}

/** Creates and publishes a Contributors item for a member who has none. */
export async function createContributor(env, member, existing, { fetchImpl = fetch, now = Date.now() } = {}) {
  const collection = env.CONTRIBUTORS_COLLECTION_ID;
  const name = memberName(member) || 'Traveler';
  const slug = uniqueSlug(name, existing.map((item) => item?.fieldData?.slug).filter(Boolean));
  const fieldData = {
    name,
    slug,
    'memberstack-id': member.id,
    'member-since': new Date(now).toISOString(),
    'visibility': OPTION_IDS.visibility.Public,
    'contact-mode': OPTION_IDS['contact-mode'].Relay,
    'credit-mode': OPTION_IDS['credit-mode'].Full,
    ...fieldDataFor(member),
  };
  // The sign-up form may set visibility, contact-mode or credit-mode; the defaults fill what it did not send.
  // The slug and name are computed here, never copied from the payload.
  fieldData.slug = slug;
  fieldData.name = name;
  const avatar = coerce('avatar', member.profileImage || member.customFields?.avatar);
  if (avatar) fieldData.avatar = avatar;

  const created = await webflow(env, fetchImpl, `/collections/${collection}/items`, {
    method: 'POST',
    body: JSON.stringify({ isDraft: false, isArchived: false, fieldData }),
  });
  const itemId = created?.id;
  if (!itemId) throw new Error('Webflow create returned no item id');
  await webflow(env, fetchImpl, `/collections/${collection}/items/publish`, {
    method: 'POST',
    body: JSON.stringify({ itemIds: [itemId] }),
  });
  return { member: member.id, item: itemId, slug, created: true, fields: Object.keys(fieldData), published: true };
}

export async function applyMember(env, member, { fetchImpl = fetch, now = Date.now(), event = 'member.updated' } = {}) {
  const memberId = member?.id;
  if (!memberId) return { skipped: 'no member id' };

  if (event === 'member.created') {
    const existing = await listContributors(env, fetchImpl);
    const item = existing.find((candidate) => candidate?.fieldData?.['memberstack-id'] === memberId);
    if (!item) return createContributor(env, member, existing, { fetchImpl, now });
    // A retried created event lands on the item it already made; fall through to a plain update.
  }

  const patch = fieldDataFor(member);
  if (!Object.keys(patch).length) return { member: memberId, skipped: 'nothing to sync' };

  const item = await findContributor(env, fetchImpl, memberId);
  if (!item) return { member: memberId, skipped: 'no Contributors item carries this Memberstack ID' };

  const published = await writeContributor(env, fetchImpl, item, patch);
  return { member: memberId, item: item.id, fields: Object.keys(patch), published };
}

/** Memberstack webhooks wrap the member in `payload`; a bare member object is accepted too. */
export function memberFrom(body) {
  const payload = body?.payload ?? body;
  return payload && (payload.id || payload.customFields) ? payload : null;
}

/** "member.created", "member.updated" or whatever Memberstack named the event. */
export function eventFrom(body) {
  const event = body?.event ?? body?.type ?? '';
  return typeof event === 'string' ? event : '';
}

export async function handleProfileHook(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
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
    result = await applyMember(env, member, { fetchImpl, now, event: eventFrom(body) });
  } catch (error) {
    result = { member: member.id, error: String(error?.message || error) };
  }
  console.log(`profile-sync ${JSON.stringify(result)}`);
  // Always 200 once authenticated, so Memberstack does not retry into duplicates.
  return reply({ result });
}
