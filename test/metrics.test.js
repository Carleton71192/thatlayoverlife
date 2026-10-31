import { describe, it, expect } from 'vitest';
import { computeMetrics } from '../src/metrics.js';
describe('investor metrics', () => {
  it('counts from live data only, totals and never names', () => {
    const now = Date.parse('2026-10-31T12:00:00Z');
    const s = (c, d, by) => ({ isDraft: false, fieldData: { contributor: c, 'published-date': d, 'byline-location': by } });
    const m = computeMetrics({
      stories: [s('a', '2026-10-20T00:00:00Z', 'COPENHAGEN, DENMARK'), s('b', '2025-01-01T00:00:00Z', 'ACCRA, GHANA'), { isDraft: true, fieldData: { contributor: 'c' } }],
      contributors: [{ id: 'a', fieldData: { crew: ['b'] } }, { id: 'b', fieldData: { crew: ['a'] } }, { id: 'h', fieldData: { visibility: '1423c8d17c2060776541377f76ea0b31' } }],
      pets: [{ fieldData: {} }], items: [{ fieldData: { owner: 'a' } }, { fieldData: { owner: 'a' } }], stamps: [{ fieldData: { owner: 'b' } }], waitlist: 4, now,
    });
    expect(m).toEqual({ date: '2026-10-31', travelers: 2, stories: 2, countries: 2, pets: 1, writers: 2, storiesLast30Days: 1, companionLinks: 1, collectors: 1, collectionItems: 2, stampers: 1, stamps: 1, pawWaitlist: 4 });
    expect(JSON.stringify(m)).not.toMatch(/Copenhagen|Ghana/i);
  });
});
