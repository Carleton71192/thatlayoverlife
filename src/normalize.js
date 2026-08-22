// Turn a raw feed record into the one shape the site consumes.

import { tagItem } from './tagger.js';
import { toPlainText, truncate } from './text.js';

const SUMMARY_MAX = 280;
const TRACKING_PARAMS = /^(utm_|fbclid|gclid|mc_cid|mc_eid|ref_?src|igshid|__twitter)/i;

export async function sha1Hex(input) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-1', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Trim, force https where the feed used http, and drop campaign tracking params. */
export function canonicalLink(link) {
  const raw = (link || '').trim();
  if (!raw) return '';
  let url;
  try {
    url = new URL(raw);
  } catch {
    return '';
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS.test(key)) url.searchParams.delete(key);
  }
  url.hash = '';
  return url.toString();
}

/**
 * A feed date, or null when it is missing, unparseable, or implausible.
 * Feeds occasionally ship dates years in the future; those would pin junk to the
 * top of the wire forever.
 */
export function parsePublishedAt(value, now = new Date()) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  const skewLimit = now.getTime() + 24 * 60 * 60 * 1000;
  const floor = Date.UTC(2000, 0, 1);
  if (parsed.getTime() > skewLimit || parsed.getTime() < floor) return null;
  return parsed.toISOString();
}

/**
 * @param {{title: string, link: string, published: string, summary: string}} raw
 * @param {{source: string}} feed
 * @returns {Promise<object|null>} null when the item is unusable
 */
export async function normalizeItem(raw, feed, now = new Date()) {
  const title = toPlainText(raw?.title);
  const link = canonicalLink(raw?.link);
  if (!title || !link) return null;

  const summary = truncate(toPlainText(raw?.summary), SUMMARY_MAX);
  const { region, country } = tagItem({ title, summary });

  return {
    id: await sha1Hex(link),
    title,
    link,
    source: feed.source,
    publishedAt: parsePublishedAt(raw?.published, now) || now.toISOString(),
    summary,
    region,
    country,
  };
}
