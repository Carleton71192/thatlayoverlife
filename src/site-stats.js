// Site stats (31 Oct 2026, redesign brief P0.1): the footer and the sign-up strip showed typed fallback numbers
// ("87 countries · 6 stories · 1 traveler") until a browser script rewrote them, so crawlers, visitors without
// JavaScript and the first paint all saw wrong figures. The Worker's 30-minute job now counts the live CMS and
// writes the numbers to the one item in the Site stats collection, which the footer binds to. The counting rules
// match the browser script tll-live-counts-v3.2 exactly, so the two never disagree:
//   stories, travelers, pets: published (live) items in Stories, Contributors and Pets (travelers leave out
//   profiles set to visibility Off, such as the house Anonymous profile);
//   countries: distinct countries named in the live stories' byline-location ("BALKANS" = 12, "SEVEN CONTINENTS" = 8).
// Writes only when a number changed. Needs SITE_STATS_COLLECTION_ID and SITE_STATS_ITEM_ID in [vars] and the
// WEBFLOW_TOKEN secret; without them the step is skipped.

import { webflow } from './profile-sync.js';

const VISIBILITY_OFF = '1423c8d17c2060776541377f76ea0b31';

const ALIASES = {
  usa: 'us', oregon: 'us', uk: 'gb', maine: 'us', 'texas hill country': 'us', dubai: 'ae', 'sao paulo': 'br',
  'ho chi minh city': 'vn', copenhagen: 'dk', balkans: 'dk pl cz sk at hu si rs xk al mk bg',
  'seven continents': 'us br aq ie dk vn nz za', 'hanoi to bangkok': 'vn th',
};

function norm(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

let NAMES = null;
function names() {
  if (NAMES) return NAMES;
  NAMES = {};
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
    for (let a = 65; a < 91; a += 1) {
      for (let b = 65; b < 91; b += 1) {
        const code = String.fromCharCode(a, b);
        const name = dn.of(code);
        if (name !== code && !/^(FX|YU|UK|SU|ZR|TP)$/.test(code)) NAMES[norm(name)] = code.toLowerCase();
      }
    }
  } catch { /* no region names in this runtime: aliases only */ }
  Object.assign(NAMES, ALIASES);
  return NAMES;
}

function code(part) {
  const key = norm(part);
  return key ? names()[key] || '' : '';
}

/** ISO2 codes named in one byline, as the browser script reads it. */
export function bylineCountries(text) {
  const parts = String(text || '').split(/,| and | & |\//i);
  const out = [];
  let all = true;
  for (const part of parts) {
    if (!norm(part)) continue;
    const c = code(part);
    if (c) c.split(' ').forEach((k) => { if (!out.includes(k)) out.push(k); });
    else all = false;
  }
  if (all && out.length) return out;
  return (code(parts[parts.length - 1]) || '').split(' ').filter(Boolean);
}

/** {stories, travelers, pets, countries} from lists of live items. */
export function computeStats({ stories = [], contributors = [], pets = [] }) {
  const live = (list) => list.filter((i) => !i.isDraft && !i.isArchived);
  const set = new Set();
  for (const s of live(stories)) bylineCountries(s.fieldData?.['byline-location']).forEach((c) => set.add(c));
  // Profiles set to visibility Off (the house Anonymous profile) are not travelers.
  const shown = live(contributors).filter((c) => c.fieldData?.visibility !== VISIBILITY_OFF);
  return { stories: live(stories).length, travelers: shown.length, pets: live(pets).length, countries: set.size };
}

export async function listLive(env, fetchImpl, collection) {
  const all = [];
  for (let offset = 0; offset < 2000; offset += 100) {
    const page = await webflow(env, fetchImpl, `/collections/${collection}/items/live?limit=100&offset=${offset}`);
    const items = page?.items || [];
    all.push(...items);
    if (items.length < 100) break;
  }
  return all;
}

/** Counts and, when a number changed, writes and publishes the Site stats item. Returns a one-line summary. */
export async function runSiteStats(env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.SITE_STATS_COLLECTION_ID || !env.SITE_STATS_ITEM_ID || !env.WEBFLOW_TOKEN) return 'site-stats skipped (not configured)';
  const [stories, contributors, pets] = await Promise.all([
    listLive(env, fetchImpl, env.STORIES_COLLECTION_ID),
    listLive(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID),
    env.PETS_COLLECTION_ID ? listLive(env, fetchImpl, env.PETS_COLLECTION_ID) : Promise.resolve([]),
  ]);
  const stats = computeStats({ stories, contributors, pets });
  if (!stories.length) return 'site-stats skipped (no live stories read)';
  const key = 'site-stats:last';
  const last = env.WIRE_KV ? await env.WIRE_KV.get(key) : null;
  const fingerprint = JSON.stringify(stats);
  if (last === fingerprint) return `site-stats unchanged ${fingerprint}`;
  const collection = env.SITE_STATS_COLLECTION_ID;
  await webflow(env, fetchImpl, `/collections/${collection}/items/${env.SITE_STATS_ITEM_ID}`, {
    method: 'PATCH',
    body: JSON.stringify({ fieldData: { ...stats, 'counted-at': new Date(now).toISOString() } }),
  });
  await webflow(env, fetchImpl, `/collections/${collection}/items/publish`, {
    method: 'POST',
    body: JSON.stringify({ itemIds: [env.SITE_STATS_ITEM_ID] }),
  });
  if (env.WIRE_KV) await env.WIRE_KV.put(key, fingerprint);
  return `site-stats written ${fingerprint}`;
}
