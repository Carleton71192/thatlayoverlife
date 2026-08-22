// KV persistence and the read-side filters. The whole wire is one JSON blob:
// it is under 100 items, so a single read beats per-item keys.

import { normalizeRegion } from './regions.js';

export const WIRE_KEY = 'wire:latest';
export const MAX_ITEMS = 100;
export const DEFAULT_LIMIT = 30;

export function emptyWire() {
  return { updatedAt: null, items: [] };
}

export async function readWire(env) {
  if (!env?.WIRE_KV) return emptyWire();
  const stored = await env.WIRE_KV.get(WIRE_KEY, 'json');
  if (!stored || !Array.isArray(stored.items)) return emptyWire();
  return { updatedAt: stored.updatedAt || null, items: stored.items };
}

export async function writeWire(env, wire) {
  await env.WIRE_KV.put(WIRE_KEY, JSON.stringify(wire));
}

/**
 * Fold a fresh run into what is already stored: dedupe by id, newest first,
 * capped at `max`.
 */
export function mergeItems(existing = [], incoming = [], max = MAX_ITEMS) {
  const byId = new Map();
  for (const item of existing) {
    if (item?.id) byId.set(item.id, item);
  }
  for (const item of incoming) {
    if (!item?.id) continue;
    const previous = byId.get(item.id);
    // Take the fresh copy (headlines get corrected) but keep the earliest
    // publish time we ever saw, so nothing jumps back to the top of the wire.
    byId.set(item.id, previous && previous.publishedAt < item.publishedAt
      ? { ...item, publishedAt: previous.publishedAt }
      : item);
  }
  return [...byId.values()]
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
    .slice(0, max);
}

export function clampLimit(value, fallback = DEFAULT_LIMIT, max = MAX_ITEMS) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

/**
 * @param {object[]} items
 * @param {{region?: string, country?: string, limit?: string|number}} query
 */
export function filterItems(items = [], query = {}) {
  const region = normalizeRegion(query.region);
  const country = query.country ? String(query.country).trim().toUpperCase() : null;
  const limit = clampLimit(query.limit);

  let out = items;
  // An unrecognized region filters nothing away rather than emptying the page.
  if (region) out = out.filter((item) => item.region === region);
  if (country && /^[A-Z]{2}$/.test(country)) out = out.filter((item) => item.country === country);
  return out.slice(0, limit);
}
