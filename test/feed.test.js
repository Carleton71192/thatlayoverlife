import { describe, expect, it } from 'vitest';
import { parseFeed } from '../src/xml.js';
import { isTravelRelevant } from '../src/feeds.js';
import { clampLimit, filterItems, mergeItems } from '../src/store.js';
import { normalizeFeedItems, runIngest, summarizeRun } from '../src/ingest.js';

const RSS = `<?xml version="1.0"?>
<rss version="2.0"><channel>
  <title>Skift</title>
  <item>
    <title><![CDATA[Doha extends free transit visas]]></title>
    <link>https://skift.com/doha</link>
    <pubDate>Fri, 22 Aug 2026 09:12:00 GMT</pubDate>
    <description>&lt;p&gt;Qatar doubles the stopover window.&lt;/p&gt;</description>
  </item>
  <item>
    <title>Airline results beat forecasts</title>
    <link>https://skift.com/results</link>
    <pubDate>Fri, 22 Aug 2026 08:00:00 GMT</pubDate>
    <description>Carriers report a strong quarter.</description>
  </item>
</channel></rss>`;

const ATOM = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Rail strike halts Milan trains</title>
    <link rel="related" href="https://example.com/related"/>
    <link rel="alternate" href="https://bbc.co.uk/rail"/>
    <updated>2026-08-22T10:00:00Z</updated>
    <summary>Services stopped for 24 hours.</summary>
  </entry>
</feed>`;

describe('parseFeed', () => {
  it('reads RSS items', () => {
    const items = parseFeed(RSS);
    expect(items).toHaveLength(2);
    expect(items[0].title).toBe('Doha extends free transit visas');
    expect(items[0].link).toBe('https://skift.com/doha');
    expect(items[0].published).toBe('Fri, 22 Aug 2026 09:12:00 GMT');
  });

  it('reads Atom entries and takes the alternate link', () => {
    const items = parseFeed(ATOM);
    expect(items).toHaveLength(1);
    expect(items[0].link).toBe('https://bbc.co.uk/rail');
    expect(items[0].published).toBe('2026-08-22T10:00:00Z');
  });

  it('returns nothing for junk input', () => {
    expect(parseFeed('<html><body>not a feed</body></html>')).toEqual([]);
    expect(parseFeed('')).toEqual([]);
    expect(parseFeed(null)).toEqual([]);
  });
});

describe('isTravelRelevant', () => {
  it('keeps travel news and drops the rest', () => {
    expect(isTravelRelevant({ title: 'Airport strike hits Rome' })).toBe(true);
    expect(isTravelRelevant({ title: 'Bank raises rates', summary: 'Borrowing costs climb again.' })).toBe(false);
  });
});

describe('normalizeFeedItems', () => {
  // A general news feed: one travel story, one that is not.
  const MIXED = parseFeed(`<rss><channel>
    <item><title>Rome airport strike grounds flights</title><link>https://bbc.co.uk/a</link>
      <pubDate>Fri, 22 Aug 2026 09:00:00 GMT</pubDate><description>Walkout hits departures.</description></item>
    <item><title>Central bank raises rates again</title><link>https://bbc.co.uk/b</link>
      <pubDate>Fri, 22 Aug 2026 08:00:00 GMT</pubDate><description>Borrowing costs climb.</description></item>
  </channel></rss>`);

  it('applies the travel filter only on feeds that ask for it', async () => {
    const unfiltered = await normalizeFeedItems({ source: 'BBC' }, MIXED);
    const filtered = await normalizeFeedItems({ source: 'BBC', travelOnly: true }, MIXED);
    expect(unfiltered).toHaveLength(2);
    expect(filtered.map((item) => item.title)).toEqual(['Rome airport strike grounds flights']);
  });
});

describe('mergeItems', () => {
  const older = { id: 'a', title: 'A', publishedAt: '2026-08-20T00:00:00.000Z' };
  const newer = { id: 'b', title: 'B', publishedAt: '2026-08-22T00:00:00.000Z' };

  it('dedupes by id and sorts newest first', () => {
    const merged = mergeItems([older], [newer, { ...older, title: 'A revised' }]);
    expect(merged.map((item) => item.id)).toEqual(['b', 'a']);
    expect(merged[1].title).toBe('A revised');
  });

  it('keeps the earliest publish time for an item it has seen', () => {
    const merged = mergeItems([older], [{ ...older, publishedAt: '2026-08-21T00:00:00.000Z' }]);
    expect(merged[0].publishedAt).toBe('2026-08-20T00:00:00.000Z');
  });

  it('caps the wire at the maximum', () => {
    const many = Array.from({ length: 150 }, (_, i) => ({
      id: `id-${i}`,
      publishedAt: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(),
    }));
    expect(mergeItems([], many, 100)).toHaveLength(100);
  });
});

describe('filterItems', () => {
  const items = [
    { id: '1', region: 'EUROPE', country: 'BG' },
    { id: '2', region: 'MIDDLE EAST', country: 'QA' },
    { id: '3', region: 'EUROPE', country: 'FR' },
    { id: '4', region: 'GLOBAL', country: null },
  ];

  it('returns everything, including GLOBAL, with no filters', () => {
    expect(filterItems(items)).toHaveLength(4);
  });

  it('filters by region and by country', () => {
    expect(filterItems(items, { region: 'EUROPE' }).map((i) => i.id)).toEqual(['1', '3']);
    expect(filterItems(items, { region: 'middle-east' }).map((i) => i.id)).toEqual(['2']);
    expect(filterItems(items, { country: 'fr' }).map((i) => i.id)).toEqual(['3']);
  });

  it('ignores an unknown region rather than emptying the page', () => {
    expect(filterItems(items, { region: 'atlantis' })).toHaveLength(4);
  });

  it('clamps the limit', () => {
    expect(clampLimit(undefined)).toBe(30);
    expect(clampLimit('5')).toBe(5);
    expect(clampLimit('500')).toBe(100);
    expect(clampLimit('-2')).toBe(30);
    expect(filterItems(items, { limit: '2' })).toHaveLength(2);
  });
});

describe('runIngest', () => {
  const feeds = [
    { id: 'skift', source: 'SKIFT', url: 'https://skift.com/feed/', enabled: true },
    { id: 'broken', source: 'BROKEN', url: 'https://broken.example/feed', enabled: true },
    { id: 'off', source: 'OFF', url: 'https://off.example/feed', enabled: false },
  ];

  function fakeKV() {
    const store = new Map();
    return {
      get: async (key) => (store.has(key) ? JSON.parse(store.get(key)) : null),
      put: async (key, value) => store.set(key, value),
    };
  }

  const fetchImpl = async (url) => {
    if (url.includes('broken.example')) throw new Error('connection refused');
    return new Response(RSS, { status: 200 });
  };

  it('survives a failing feed and stores what worked', async () => {
    const env = { WIRE_KV: fakeKV() };
    const summary = await runIngest(env, { feeds, fetchImpl, now: new Date('2026-08-22T14:30:00Z') });

    expect(summary.total).toBe(2);
    expect(summary.added).toBe(2);
    expect(summary.failures.map((f) => f.id)).toEqual(['broken']);

    const stored = await env.WIRE_KV.get('wire:latest');
    expect(stored.items).toHaveLength(2);
    expect(stored.items[0].source).toBe('SKIFT');
    expect(stored.updatedAt).toBe('2026-08-22T14:30:00.000Z');
  });

  it('skips disabled feeds', async () => {
    const seen = [];
    await runIngest({ WIRE_KV: fakeKV() }, {
      feeds,
      fetchImpl: async (url) => {
        seen.push(url);
        return new Response(RSS, { status: 200 });
      },
    });
    expect(seen).not.toContain('https://off.example/feed');
  });

  it('adds nothing new on a second identical run', async () => {
    const env = { WIRE_KV: fakeKV() };
    await runIngest(env, { feeds, fetchImpl });
    const second = await runIngest(env, { feeds, fetchImpl });
    expect(second.added).toBe(0);
    expect(second.total).toBe(2);
  });

  it('writes one readable log line', async () => {
    const summary = await runIngest({ WIRE_KV: fakeKV() }, { feeds, fetchImpl });
    const line = summarizeRun(summary);
    expect(line).toContain('total=2');
    expect(line).toContain('skift=2');
    expect(line).toContain('broken=ERR');
  });
});
