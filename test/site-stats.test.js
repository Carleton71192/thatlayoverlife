import { describe, it, expect } from 'vitest';
import { bylineCountries, computeStats, runSiteStats } from '../src/site-stats.js';

const story = (loc, extra = {}) => ({ isDraft: false, isArchived: false, fieldData: { 'byline-location': loc }, ...extra });

describe('site stats', () => {
  it('reads bylines like the browser script', () => {
    expect(bylineCountries('TORREVIEJA, SPAIN')).toEqual(['es']);
    expect(bylineCountries('POMPEI, ITALY')).toEqual(['it']);
    expect(bylineCountries('DENMARK, SWEDEN AND NORWAY')).toEqual(['dk', 'se', 'no']);
    expect(bylineCountries('BALKANS')).toHaveLength(12);
    expect(bylineCountries('SÃO PAULO')).toEqual(['br']);
  });
  it('counts live items and distinct countries', () => {
    const s = computeStats({
      stories: [story('TORREVIEJA, SPAIN'), story('MADRID, SPAIN'), story('POMPEI, ITALY'), story('X, JAPAN', { isDraft: true })],
      contributors: [{}, {}, { isArchived: true }, { fieldData: { visibility: '1423c8d17c2060776541377f76ea0b31' } }],
      pets: [{}],
    });
    expect(s).toEqual({ stories: 3, travelers: 2, pets: 1, countries: 2 });
  });
  it('writes once, then skips when nothing changed', async () => {
    const kv = new Map();
    const env = { WEBFLOW_TOKEN: 't', STORIES_COLLECTION_ID: 's', CONTRIBUTORS_COLLECTION_ID: 'c', PETS_COLLECTION_ID: 'p',
      SITE_STATS_COLLECTION_ID: 'ss', SITE_STATS_ITEM_ID: 'i', WIRE_KV: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); } } };
    const calls = [];
    const fetchImpl = async (url, init = {}) => {
      calls.push(`${init.method || 'GET'} ${url}`);
      const body = url.includes('/collections/s/') ? { items: [story('LIMA, PERU')] } : { items: [{}] };
      return { ok: true, status: 200, headers: { get: () => null }, json: async () => body };
    };
    expect(await runSiteStats(env, { fetchImpl })).toMatch(/written .*"countries":1/);
    expect(calls.filter((c) => c.startsWith('PATCH'))).toHaveLength(1);
    expect(await runSiteStats(env, { fetchImpl })).toMatch(/unchanged/);
    expect(calls.filter((c) => c.startsWith('PATCH'))).toHaveLength(1);
  });
  it('is skipped until configured', async () => {
    expect(await runSiteStats({})).toMatch(/skipped/);
  });
});
