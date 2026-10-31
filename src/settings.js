// GET /settings (31 Oct 2026, Value Playbook Phase 7: "Never type a company name, CVR, address or registration number into
// individual pages. Create one site-wide setting."). The one Site settings item: the legal name, registration number, registered
// city and country, legal contact email and the two division names. Pages carry data-tll-entity="legal-name" (and so on) and
// tll-division-v1 fills them from here, so a change of company is one edit. Empty fields are sent as empty: pages keep their text.
import { webflow } from './profile-sync.js';

export const ENTITY_FIELDS = ['legal-name', 'registration-number', 'registered-city-and-country', 'legal-contact-email', 'tll-division-name', 'paw-passport-division-name'];

export function entityFrom(item) {
  const f = item?.fieldData || {};
  return Object.fromEntries(ENTITY_FIELDS.map((k) => [k, String(f[k] || '').trim().slice(0, 200)]));
}

export async function handleSettings(request, env, { fetchImpl = fetch } = {}) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET' } });
  if (!env.WEBFLOW_TOKEN || !env.SITE_SETTINGS_COLLECTION_ID || !env.SITE_SETTINGS_ITEM_ID) return new Response(JSON.stringify({ entity: entityFrom(null) }), { headers: { ...headers, 'Cache-Control': 'no-store' } });
  const item = await webflow(env, fetchImpl, `/collections/${env.SITE_SETTINGS_COLLECTION_ID}/items/${env.SITE_SETTINGS_ITEM_ID}`).catch(() => null);
  return new Response(JSON.stringify({ entity: entityFrom(item) }), { headers: { ...headers, 'Cache-Control': 'public, max-age=3600' } });
}
