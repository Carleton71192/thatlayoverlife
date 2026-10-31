// "How do you travel most?" (31 Oct 2026, UX flows Phase 3 addition; confirms the ICP). One optional, one-tap question after the
// first stamp. Multi-select. Saved privately: the browser writes the member's Memberstack field travel-style itself, and this route
// keeps one small record per member in WIRE_KV so Nancy gets a monthly count on her owner-only metrics panel. Never shown publicly.
//   POST /travel-style   (member) {styles: [...]}
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';

export const STYLES = {
  'big-trips': 'A few big trips a year', 'short-trips': 'Lots of short trips and layovers', abroad: 'I live abroad (or did)',
  work: 'For work', pet: 'With my pet', pursuit: 'For a pursuit (running, hiking, food, more)',
};

export function cleanStyles(list) {
  return Array.isArray(list) ? [...new Set(list.filter((s) => typeof s === 'string' && STYLES[s]))] : null;
}

/** Pure: monthly counts from the stored answers. Each member counts once per month, by the month they last answered. */
export function monthly(records) {
  const out = {};
  for (const r of records) {
    if (!r || !Array.isArray(r.styles) || !r.at) continue;
    const m = String(r.at).slice(0, 7);
    out[m] = out[m] || { members: 0, ...Object.fromEntries(Object.keys(STYLES).map((k) => [k, 0])) };
    out[m].members += 1;
    for (const s of r.styles) if (s in out[m]) out[m][s] += 1;
  }
  return out;
}

export async function travelStyleReport(env) {
  if (!env.WIRE_KV || typeof env.WIRE_KV.list !== 'function') return {};
  const recs = [];
  let cursor;
  do {
    const page = await env.WIRE_KV.list({ prefix: 'ts:', cursor });
    for (const k of page.keys || []) { try { recs.push(JSON.parse((await env.WIRE_KV.get(k.name)) || 'null')); } catch { /* skip */ } }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return monthly(recs);
}

export async function handleTravelStyle(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.MEMBERSTACK_KEY || !env.WIRE_KV) return reply({ error: 'Not switched on yet.' }, 503);
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  let b = {};
  try { b = await request.json(); } catch { b = {}; }
  const styles = cleanStyles(b.styles);
  if (!styles) return reply({ error: 'Pick one or more, or skip.' }, 400);
  if (!(await rateLimit(env, 'travel-style', auth.memberId, 20, now))) return reply({ error: 'Try again a little later.' }, 429);
  await env.WIRE_KV.put(`ts:${auth.memberId}`, JSON.stringify({ styles, at: new Date(now).toISOString() }));
  return reply({ ok: true, styles });
}
