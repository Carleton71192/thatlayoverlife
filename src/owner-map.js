// The site owner's live map, for the visitors' example map on /the-map (change log B3.7).
//
// POST /map-snapshot (map-snapshot.js) may carry the member's tllStates next to the
// snapshot. When the verified member id equals env.OWNER_MEMBER_ID, a sanitized copy is
// stored in WIRE_KV under "owner-map:v2". Every other member's states are dropped
// without being read further, so no member data other than the site owner's ever goes
// into that key.
//
// GET /owner-map returns that JSON to the three site origins, cached for five minutes,
// or a 404 JSON when nothing is stored yet.
//
// Sanitized shape: {"v":2,"travelers":[{"id","color","pet"} plus "name" for pets only],
// "states":{"<3-digit code>":{"<traveler id>":"lived"|"visited"|"layover"}}}.
// Kosovo arrives as "undefined" or "XK" from older map versions; it is folded into "900",
// the same fix the map page applies (src/pages/the-map/map-ids-v1.js).

import { ALLOWED_ORIGINS } from './member-auth.js';

export const OWNER_MAP_KEY = 'owner-map:v2';
export const OWNER_MAP_MAX_BYTES = 64 * 1024;
export const OWNER_MAP_MAX_TRAVELERS = 10;
export const OWNER_MAP_MAX_STATES = 300;
const PET_NAME_MAX = 40;
const DEPTHS = new Set(['lived', 'visited', 'layover']);
const CODE = /^\d{3}$/;
const TRAVELER_ID = /^[A-Za-z0-9_-]{1,24}$/;
const COLOR = /^#[0-9A-Fa-f]{3,8}$/;
const KOSOVO_ALIASES = new Set(['undefined', 'XK', 'xk']);

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** True only when the verified member id is the configured site owner. */
export function isOwner(env, memberId) {
  const owner = typeof env?.OWNER_MEMBER_ID === 'string' ? env.OWNER_MEMBER_ID.trim() : '';
  return Boolean(owner) && typeof memberId === 'string' && memberId === owner;
}

/**
 * Sanitizes a tllStates v2 record. Returns { map } or { error }.
 * Keeps only v, travelers (id, color, pet, and name for pets) and states whose keys
 * are 3-digit codes and whose values are lived, visited or layover for a kept traveler.
 */
export function sanitizeOwnerStates(raw) {
  if (!isObject(raw) || raw.v !== 2 || !isObject(raw.states)) return { error: 'states must be a tllStates v2 record' };

  const travelers = [];
  const seen = new Set();
  for (const t of Array.isArray(raw.travelers) ? raw.travelers : []) {
    if (travelers.length >= OWNER_MAP_MAX_TRAVELERS) break;
    if (!isObject(t) || typeof t.id !== 'string' || !TRAVELER_ID.test(t.id) || seen.has(t.id)) continue;
    seen.add(t.id);
    const pet = t.pet === true;
    const out = { id: t.id };
    if (typeof t.color === 'string' && COLOR.test(t.color)) out.color = t.color;
    out.pet = pet;
    if (pet) {
      const name = typeof t.name === 'string' ? t.name.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, PET_NAME_MAX) : '';
      out.name = name || 'Pet';
    }
    travelers.push(out);
  }

  const states = {};
  let count = 0;
  for (const [rawKey, entry] of Object.entries(raw.states)) {
    const key = KOSOVO_ALIASES.has(rawKey) ? '900' : rawKey;
    if (!CODE.test(key) || !isObject(entry)) continue;
    const kept = states[key] || {};
    for (const [tid, depth] of Object.entries(entry)) {
      if (seen.has(tid) && DEPTHS.has(depth) && !kept[tid]) kept[tid] = depth;
    }
    if (!Object.keys(kept).length) continue;
    if (!states[key]) {
      if (count >= OWNER_MAP_MAX_STATES) continue;
      count += 1;
    }
    states[key] = kept;
  }

  const map = { v: 2, travelers, states };
  if (JSON.stringify(map).length > OWNER_MAP_MAX_BYTES) return { error: 'states record is too large' };
  return { map };
}

/**
 * Stores the owner's sanitized map. Returns true when stored, false when skipped
 * (not the owner, no states sent, or a record that fails the check).
 */
export async function storeOwnerMap(env, memberId, states) {
  if (states === undefined || !isOwner(env, memberId)) return false;
  const checked = sanitizeOwnerStates(states);
  if (checked.error) return false;
  await env.WIRE_KV.put(OWNER_MAP_KEY, JSON.stringify(checked.map));
  return true;
}

/** CORS for the public read: the three site origins, GET only. */
export function ownerMapCors(request) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (ALLOWED_ORIGINS.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

/** GET /owner-map. */
export async function handleOwnerMap(request, env) {
  const cors = ownerMapCors(request);
  let stored = null;
  try {
    stored = env.WIRE_KV ? await env.WIRE_KV.get(OWNER_MAP_KEY) : null;
  } catch {
    stored = null;
  }
  if (!stored) {
    return new Response(JSON.stringify({ error: 'No owner map saved yet.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors },
    });
  }
  return new Response(request.method === 'HEAD' ? null : stored, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300', ...cors },
  });
}
