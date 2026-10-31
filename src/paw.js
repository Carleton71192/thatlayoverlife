// Paw Passport waitlist (31 Oct 2026, Value Playbook Phase 8: "Paw Passport waitlist and QR landing page (stamp plus photo), no
// prices yet", staged until the trademark search clears). The CMS is at Webflow's 40-collection cap, so entries live in WIRE_KV.
//   POST /paw/waitlist {email, pet?, interests: ['guide','plush'], consent: true, source?, website: ''}   public, 5 an hour per IP
//   POST /paw/waitlist/export   (site owner only, verified Memberstack id) -> CSV of every entry, and the count
// Stored per entry: email, pet name, interests, the source (page or QR code), and when consent was given. Nothing else.
import { isOwner } from './owner-map.js';
import { reply, verifyMemberToken } from './member-auth.js';

const KEY = 'paw:waitlist:v1';
const INTERESTS = ['guide', 'plush'];
const EMAIL = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,24}$/i;

export function entryFrom(body, now = Date.now()) {
  if (!body || typeof body !== 'object') return { error: 'bad body' };
  if (body.website) return { error: 'bot' };
  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL.test(email)) return { error: 'Add a working email.' };
  if (body.consent !== true) return { error: 'Tick the box so we may email you.' };
  const interests = (Array.isArray(body.interests) ? body.interests : []).filter((x) => INTERESTS.includes(x));
  const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f<>]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
  return { entry: { email, pet: clean(body.pet, 40), interests: interests.length ? interests : INTERESTS, source: clean(body.source, 60) || 'the-paw-passport', consentAt: new Date(now).toISOString() } };
}

export function toCsv(list) {
  const q = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return ['email,pet,interests,source,consent_at', ...list.map((e) => [e.email, e.pet, e.interests.join(' '), e.source, e.consentAt].map(q).join(','))].join('\n') + '\n';
}

async function load(env) { try { return JSON.parse((await env.WIRE_KV.get(KEY)) || '[]'); } catch { return []; } }

export async function handlePaw(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  const origin = request.headers.get('Origin') || '';
  const cors = { 'Access-Control-Allow-Origin': /^https:\/\/(www\.)?thatlayover\.life$|^https:\/\/that-layover-life\.webflow\.io$/.test(origin) ? origin : 'https://www.thatlayover.life',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', Vary: 'Origin' };
  const out = (b, s = 200, h = {}) => { const r = typeof b === 'string' ? new Response(b, { status: s, headers: { ...cors, ...h } }) : reply(b, s); if (typeof b !== 'string') Object.entries(cors).forEach(([k, v]) => r.headers.set(k, v)); return r; };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return out({ error: 'method' }, 405);
  if (!env.WIRE_KV) return out({ error: 'Not switched on yet.' }, 503);
  const path = new URL(request.url).pathname;
  if (path === '/paw/waitlist/export') {
    const auth = await verifyMemberToken(request, env, { fetchImpl });
    if (auth instanceof Response) return auth;
    if (!isOwner(env, auth.verifiedId)) return out({ error: 'Owner only.' }, 403);
    const list = await load(env);
    return out(toCsv(list), 200, { 'Content-Type': 'text/csv; charset=utf-8', 'X-Count': String(list.length), 'Cache-Control': 'no-store' });
  }
  const ip = request.headers.get('CF-Connecting-IP') || 'anon';
  const rk = `paw-rate:${ip}:${new Date(now).toISOString().slice(0, 13)}`;
  const n = Number((await env.WIRE_KV.get(rk)) || 0);
  if (n >= 5) return out({ error: 'Try again a little later.' }, 429);
  await env.WIRE_KV.put(rk, String(n + 1), { expirationTtl: 3700 });
  let body = null;
  try { body = await request.json(); } catch { body = null; }
  const checked = entryFrom(body, now);
  if (checked.error === 'bot') return out({ ok: true });
  if (checked.error) return out({ error: checked.error }, 400);
  const list = await load(env);
  const i = list.findIndex((e) => e.email === checked.entry.email);
  if (i >= 0) list[i] = { ...list[i], ...checked.entry, interests: [...new Set([...list[i].interests, ...checked.entry.interests])] };
  else list.push(checked.entry);
  await env.WIRE_KV.put(KEY, JSON.stringify(list.slice(-5000)));
  return out({ ok: true });
}
