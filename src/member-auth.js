// Shared pieces for the member-facing routes (POST /profile/save, POST /map-snapshot).
//
// - verifyMemberToken: the Memberstack token check. The page sends
//   Authorization: Bearer <token>; the worker asks admin.memberstack.com to
//   verify it with the app's secret key (env.MEMBERSTACK_KEY). The member id
//   that comes back is the only member whose Contributors item may be written.
// - rateLimit: a soft per-member-per-hour counter in WIRE_KV.
// - memberCors: the allow list for browser calls from the site.
//
// No Webflow token ever reaches the browser; every write goes through here.

const MEMBERSTACK_API = 'https://admin.memberstack.com';

/** Origins allowed to call the member routes from a browser. */
export const ALLOWED_ORIGINS = Object.freeze([
  'https://thatlayover.life',
  'https://www.thatlayover.life',
  'https://that-layover-life.webflow.io',
]);

/** CORS headers for one request. An origin outside the list gets no Allow-Origin, so the browser blocks it. */
export function memberCors(request) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (ALLOWED_ORIGINS.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

/** The same Response with extra headers added. */
export function withHeaders(response, extra) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(extra)) headers.set(key, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export function reply(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function pickId(data) {
  const candidates = [data?.id, data?.data?.id, data?.member?.id, data?.memberId];
  return candidates.find((c) => typeof c === 'string' && c) || null;
}

/** The member id inside a Memberstack JWT, used only as a fallback when the verify response omits it. */
export function jwtId(token) {
  try {
    const part = token.split('.')[1];
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4)));
    return typeof payload.id === 'string' && payload.id ? payload.id : null;
  } catch {
    return null;
  }
}

/**
 * Checks the Bearer token with Memberstack.
 * Returns { memberId } on success, or a Response (401 or 503) to send back.
 */
export async function verifyMemberToken(request, env, { fetchImpl = fetch } = {}) {
  const match = /^Bearer\s+(\S+)$/i.exec(request.headers.get('Authorization') || '');
  if (!match) return reply({ error: 'Please sign in to continue.' }, 401);
  const token = match[1];

  let response;
  try {
    response = await fetchImpl(`${MEMBERSTACK_API}/members/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': env.MEMBERSTACK_KEY },
      body: JSON.stringify({ token }),
    });
  } catch {
    return reply({ error: 'We could not check your sign-in right now. Try again in a moment.' }, 503);
  }
  if (response.status !== 200) return reply({ error: 'Please sign in again.' }, 401);

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  const memberId = pickId(data) || jwtId(token);
  if (!memberId) return reply({ error: 'Please sign in again.' }, 401);
  return { memberId };
}

/** The UTC hour a timestamp falls in, as "2026-10-20T12". */
export function hourKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 13);
}

/**
 * Counts one call against `<prefix>:<memberId>:<hour>` in WIRE_KV.
 * Returns true when the call is allowed. KV has no atomic increment, so the limit is soft.
 */
export async function rateLimit(env, prefix, memberId, limit, now = Date.now()) {
  const key = `${prefix}:${String(memberId).replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 80)}:${hourKey(now)}`;
  let current = 0;
  try {
    current = parseInt((await env.WIRE_KV.get(key)) || '0', 10) || 0;
  } catch {
    current = 0;
  }
  if (current >= limit) return false;
  await env.WIRE_KV.put(key, String(current + 1), { expirationTtl: 2 * 3600 });
  return true;
}
