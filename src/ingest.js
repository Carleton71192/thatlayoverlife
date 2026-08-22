// The scheduled job: fetch every active feed, normalize, tag, merge, store.
// One bad feed must never take the run down, so each fetch is isolated.

import { activeFeeds, FEEDS, isTravelRelevant } from './feeds.js';
import { normalizeItem } from './normalize.js';
import { mergeItems, MAX_ITEMS, readWire, writeWire } from './store.js';
import { parseFeed } from './xml.js';

const FETCH_TIMEOUT_MS = 10000;
const USER_AGENT = 'TLLTravelWire/1.0 (+https://thatlayover.life; headline aggregator)';

/**
 * Fetch and parse one feed. Resolves to a result record either way; it never
 * throws.
 */
export async function fetchFeed(feed, { fetchImpl = fetch, timeoutMs = FETCH_TIMEOUT_MS } = {}) {
  try {
    const response = await fetchImpl(feed.url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      signal: AbortSignal.timeout(timeoutMs),
      cf: { cacheTtl: 300, cacheEverything: false },
    });
    if (!response.ok) {
      return { feed, ok: false, error: `HTTP ${response.status}`, raw: [] };
    }
    const body = await response.text();
    const raw = parseFeed(body);
    if (!raw.length) return { feed, ok: false, error: 'no items parsed', raw: [] };
    return { feed, ok: true, error: null, raw };
  } catch (error) {
    return { feed, ok: false, error: error?.name === 'TimeoutError' ? 'timeout' : String(error?.message || error), raw: [] };
  }
}

/** Normalize one feed's raw records, applying its travel filter if it has one. */
export async function normalizeFeedItems(feed, raw, now = new Date()) {
  const items = [];
  for (const record of raw) {
    const item = await normalizeItem(record, feed, now);
    if (!item) continue;
    if (feed.travelOnly && !isTravelRelevant(item)) continue;
    items.push(item);
  }
  return items;
}

/**
 * Run one ingest pass.
 *
 * @param {{WIRE_KV: KVNamespace}} env
 * @returns {Promise<{updatedAt: string, total: number, added: number, perFeed: object[], failures: object[]}>}
 */
export async function runIngest(env, { feeds = FEEDS, fetchImpl = fetch, now = new Date() } = {}) {
  const targets = activeFeeds(feeds);
  const results = await Promise.all(targets.map((feed) => fetchFeed(feed, { fetchImpl })));

  const fresh = [];
  const perFeed = [];
  const failures = [];
  for (const result of results) {
    if (!result.ok) {
      failures.push({ id: result.feed.id, error: result.error });
      perFeed.push({ id: result.feed.id, kept: 0, error: result.error });
      continue;
    }
    const items = await normalizeFeedItems(result.feed, result.raw, now);
    fresh.push(...items);
    perFeed.push({ id: result.feed.id, kept: items.length, error: null });
  }

  const previous = await readWire(env);
  const items = mergeItems(previous.items, fresh, MAX_ITEMS);
  const knownIds = new Set(previous.items.map((item) => item.id));
  const added = items.filter((item) => !knownIds.has(item.id)).length;

  const wire = { updatedAt: now.toISOString(), items };
  await writeWire(env, wire);

  return { updatedAt: wire.updatedAt, total: items.length, added, perFeed, failures };
}

/** The one line that goes to the log per cron run. */
export function summarizeRun(summary) {
  const feeds = summary.perFeed
    .map((entry) => `${entry.id}=${entry.error ? `ERR(${entry.error})` : entry.kept}`)
    .join(' ');
  return `wire ${summary.updatedAt} total=${summary.total} new=${summary.added} feeds[${feeds}]`;
}
