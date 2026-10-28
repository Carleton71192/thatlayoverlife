// POST /press/apply
//
// N8 (28 Oct 2026, handoff/CHANGE-LOG-EDIT-PROFILE-NOTES-2026-10-28.md). A member with Press switched
// on in /edit-profile 07 sends their press card for review. The page sends
//   Authorization: Bearer <Memberstack token>
//   {"outlet": "...", "role": "...", "proof": "https://..."}
// The token is verified with Memberstack; the application is saved as a draft item in the
// Press applications collection, which the editor reviews in the Webflow CMS. Nothing is
// published and nothing is emailed yet (STATUS S130 is the email item). The badge only shows
// once the editor sets press-verified, as before.
//
// Replies {"ok":true,"sentAt":ISO}. 400 on a missing outlet or link, 401 on a bad token,
// 429 past three applications in an hour, 502 when the CMS write fails.
//
// Needs secrets WEBFLOW_TOKEN and MEMBERSTACK_KEY, the WIRE_KV binding for the hourly counter,
// and CONTRIBUTORS_COLLECTION_ID (to name the application after the member's profile).

import { findContributor, webflow } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';

/** The Press applications collection (created 28 Oct 2026). PRESS_COLLECTION_ID in [vars] overrides it. */
export const PRESS_COLLECTION_DEFAULT = '6ae1e636cd32722d8a175cb3';
export const APPLY_LIMIT_PER_HOUR = 3;
const RATE_PREFIX = 'press-apply';

function line(raw, max) {
  return String(raw ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

/** Validates the body. Returns { outlet, role, proof } or { error }. */
export function applicationFrom(body) {
  const outlet = line(body?.outlet, 80);
  const role = line(body?.role, 80);
  let proof = line(body?.proof, 300);
  if (!outlet) return { error: 'Add the outlet you work for.' };
  if (!proof || /\s/.test(proof)) return { error: 'Add a link to your press card or to two published pieces.' };
  if (!/^https?:\/\//i.test(proof)) proof = `https://${proof}`;
  return { outlet, role, proof };
}

export async function handlePressApply(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.WIRE_KV) {
    return reply({ error: 'Sending is not switched on yet.' }, 503);
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
  const app = applicationFrom(body);
  if (app.error) return reply({ error: app.error }, 400);

  if (!(await rateLimit(env, RATE_PREFIX, memberId, APPLY_LIMIT_PER_HOUR, now))) {
    return reply({ error: 'Your application is already with us. Try again in an hour if something changed.' }, 429);
  }

  const sentAt = new Date(now).toISOString();
  try {
    let profile = null;
    if (env.CONTRIBUTORS_COLLECTION_ID) {
      try { profile = await findContributor(env, fetchImpl, memberId); } catch { profile = null; }
    }
    const name = line(profile?.fieldData?.name, 120) || memberId;
    const slugBase = (profile?.fieldData?.slug || memberId).toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    const collection = env.PRESS_COLLECTION_ID || PRESS_COLLECTION_DEFAULT;
    await webflow(env, fetchImpl, `/collections/${collection}/items`, {
      method: 'POST',
      body: JSON.stringify({
        isDraft: true,
        fieldData: {
          name: `${name} · ${app.outlet}`.slice(0, 256),
          slug: `${slugBase}-${now}`.slice(0, 256),
          'member-id': memberId,
          'profile-slug': profile?.fieldData?.slug || '',
          outlet: app.outlet,
          role: app.role,
          'press-card-or-published-pieces': app.proof,
          sent: sentAt,
        },
      }),
    });
    console.log(`press-apply ${JSON.stringify({ member: memberId, outlet: app.outlet })}`);
    return reply({ ok: true, sentAt });
  } catch (error) {
    console.log(`press-apply ${JSON.stringify({ member: memberId, error: String(error?.message || error) })}`);
    return reply({ error: 'Your application did not reach us. Try again in a moment.' }, 502);
  }
}
