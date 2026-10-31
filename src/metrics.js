// Investor metrics (31 Oct 2026, Value Playbook Phase 9: "Private investor metrics page for fundraising"). Site owner only.
//   POST /metrics (verified Memberstack id = OWNER_MEMBER_ID) -> {today, history}
// Every number is counted from the live data, never typed: travelers (public profiles), stories (live), countries covered by
// stories, pets, stories published in the last 30 days, members using collections and stamps, companion links, the Paw
// Passport waitlist size. The 30-minute job keeps one snapshot per day in WIRE_KV (metrics:day:YYYY-MM-DD, 400 days) so growth
// shows as a line. Totals only: no names, emails or places. Traffic needs GA4 and is not here.
import { travelStyleReport } from './travel-style.js';
import { isOwner } from './owner-map.js';
import { reply, verifyMemberToken } from './member-auth.js';
import { computeStats, listLive } from './site-stats.js';
import { listAll } from './collections.js';

const DAY = 86400000;
const VISIBILITY_OFF = '1423c8d17c2060776541377f76ea0b31';

export function computeMetrics({ stories = [], contributors = [], pets = [], items = [], stamps = [], waitlist = 0, now = Date.now() }) {
  const base = computeStats({ stories, contributors, pets });
  const live = stories.filter((s) => !s.isDraft && !s.isArchived);
  const recent = live.filter((s) => now - Date.parse(s.fieldData?.['published-date'] || 0) <= 30 * DAY).length;
  const writers = new Set(live.map((s) => s.fieldData?.contributor).filter(Boolean)).size;
  const visible = contributors.filter((c) => !c.isDraft && c.fieldData?.visibility !== VISIBILITY_OFF);
  const links = visible.reduce((n, c) => n + (Array.isArray(c.fieldData?.crew) ? c.fieldData.crew.length : 0), 0) / 2;
  const owners = (list) => new Set(list.filter((x) => !x.isArchived).map((x) => x.fieldData?.owner).filter(Boolean)).size;
  return {
    date: new Date(now).toISOString().slice(0, 10), travelers: base.travelers, stories: base.stories, countries: base.countries, pets: base.pets,
    writers, storiesLast30Days: recent, companionLinks: Math.floor(links),
    collectors: owners(items), collectionItems: items.filter((x) => !x.isArchived).length, stampers: owners(stamps), stamps: stamps.filter((x) => !x.isArchived).length,
    pawWaitlist: waitlist,
  };
}

async function gather(env, fetchImpl, now) {
  const get = (id, live) => (id ? (live ? listLive(env, fetchImpl, id) : listAll(env, fetchImpl, id)) : Promise.resolve([]));
  const [stories, contributors, pets, items, stamps] = await Promise.all([
    get(env.STORIES_COLLECTION_ID, true), get(env.CONTRIBUTORS_COLLECTION_ID, true), get(env.PETS_COLLECTION_ID, true),
    get(env.COLLECTION_ITEMS_ID), get(env.STAMPS_COLLECTION_ID),
  ]);
  let waitlist = 0;
  try { waitlist = JSON.parse((await env.WIRE_KV.get('paw:waitlist:v1')) || '[]').length; } catch { waitlist = 0; }
  return computeMetrics({ stories, contributors, pets, items, stamps, waitlist, now });
}

export async function runMetricsSnapshot(env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.WIRE_KV || !env.STORIES_COLLECTION_ID) return 'metrics skipped (not configured)';
  const key = `metrics:day:${new Date(now).toISOString().slice(0, 10)}`;
  if (await env.WIRE_KV.get(key)) return 'metrics: today already kept';
  const m = await gather(env, fetchImpl, now);
  await env.WIRE_KV.put(key, JSON.stringify(m), { expirationTtl: 400 * 86400 });
  return `metrics kept ${m.date}`;
}

export async function handleMetrics(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.WIRE_KV) return reply({ error: 'Not switched on yet.' }, 503);
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  if (!isOwner(env, auth.verifiedId)) return reply({ error: 'Owner only.' }, 403);
  const today = await gather(env, fetchImpl, now);
  const history = [];
  for (let i = 89; i >= 1; i -= 1) {
    const d = new Date(now - i * DAY).toISOString().slice(0, 10);
    const v = await env.WIRE_KV.get(`metrics:day:${d}`);
    if (v) { try { history.push(JSON.parse(v)); } catch { /* skip */ } }
  }
  return reply({ ok: true, today, history: [...history, today], travelStyle: await travelStyleReport(env) });
}
