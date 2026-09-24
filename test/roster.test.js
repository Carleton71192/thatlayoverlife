import { describe, expect, it } from 'vitest';
import { activeFeeds, FEEDS, MAX_ACTIVE_FEEDS } from '../src/feeds.js';

describe('feed roster', () => {
  it('stays inside the per-run fetch budget', () => {
    expect(activeFeeds().length).toBeLessThanOrEqual(MAX_ACTIVE_FEEDS);
  });

  it('has unique ids and urls', () => {
    expect(new Set(FEEDS.map((feed) => feed.id)).size).toBe(FEEDS.length);
    expect(new Set(FEEDS.map((feed) => feed.url)).size).toBe(FEEDS.length);
  });

  it('gives every feed a source name and an http url', () => {
    for (const feed of FEEDS) {
      expect(feed.source, feed.id).toMatch(/\S/);
      expect(feed.url, feed.id).toMatch(/^https?:\/\//);
      expect(typeof feed.enabled, feed.id).toBe('boolean');
    }
  });
});
