import { describe, expect, it } from 'vitest';
import { handleMapSnapshot, validateSnapshot } from '../src/map-snapshot.js';

function memoryKv() {
  const store = new Map();
  return {
    store,
    get: async (key) => (store.has(key) ? store.get(key) : null),
    put: async (key, value) => void store.set(key, value),
  };
}

function env(overrides = {}) {
  return { WEBFLOW_TOKEN: 'wf', MEMBERSTACK_KEY: 'ms', CONTRIBUTORS_COLLECTION_ID: 'contributors', WIRE_KV: memoryKv(), ...overrides };
}

function fakes(verified = 'mem_1', items = [{ id: 'c-nancy', isDraft: false, fieldData: { 'memberstack-id': 'mem_1', slug: 'nancy' } }]) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : null });
    if (url === 'https://admin.memberstack.com/members/verify-token') {
      if (!verified) return new Response('{}', { status: 401 });
      return new Response(JSON.stringify({ data: { id: verified } }), { status: 200 });
    }
    if (url.includes('/items?')) return new Response(JSON.stringify({ items }), { status: 200 });
    return new Response(JSON.stringify({}), { status: 200 });
  };
  return { calls, fetchImpl };
}

const good = { countries: 87, antarctica: true, places: 88, layovers: 12, savedAt: '2026-10-20T12:00:00Z' };

function request(body, token = 'tok') {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return new Request('https://w.example/map-snapshot', { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) });
}

describe('validateSnapshot', () => {
  it('accepts the contract shape and orders the keys', () => {
    expect(validateSnapshot(good)).toEqual({ snapshot: { countries: 87, antarctica: true, places: 88, layovers: 12, savedAt: '2026-10-20T12:00:00Z' } });
    expect(validateSnapshot({ ...good, storiesBy: 3 }).snapshot.storiesBy).toBe(3);
    expect(validateSnapshot({ ...good, savedAt: '2026-10-20T12:00:00.123+02:00' }).error).toBeUndefined();
  });
  it('refuses counts outside 0..300, non-integers, strings, bad booleans and bad dates', () => {
    expect(validateSnapshot({ ...good, countries: 301 }).error).toContain('countries');
    expect(validateSnapshot({ ...good, places: -1 }).error).toContain('places');
    expect(validateSnapshot({ ...good, layovers: 1.5 }).error).toContain('layovers');
    expect(validateSnapshot({ ...good, countries: '87' }).error).toContain('countries');
    expect(validateSnapshot({ ...good, antarctica: 'yes' }).error).toContain('antarctica');
    expect(validateSnapshot({ ...good, savedAt: '20 October 2026' }).error).toContain('savedAt');
    expect(validateSnapshot({ ...good, savedAt: '2026-13-45T99:00:00Z' }).error).toContain('savedAt');
    expect(validateSnapshot({ ...good, storiesBy: -1 }).error).toContain('storiesBy');
  });
  it('refuses missing keys, unknown keys and non-objects', () => {
    const { savedAt, ...missing } = good;
    expect(validateSnapshot(missing).error).toContain('savedAt');
    expect(validateSnapshot({ ...good, cities: 464 }).error).toContain('cities');
    expect(validateSnapshot([]).error).toBeDefined();
    expect(validateSnapshot(null).error).toBeDefined();
  });
});

describe('handleMapSnapshot', () => {
  it('writes the JSON string to map-snapshot on the member\'s item and publishes', async () => {
    const { calls, fetchImpl } = fakes();
    const res = await handleMapSnapshot(request({ ...good, storiesBy: 2 }), env(), { fetchImpl });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, savedAt: '2026-10-20T12:00:00Z', slug: 'nancy', published: true });
    const patch = calls.find((c) => c.method === 'PATCH');
    expect(patch.url).toContain('/collections/contributors/items/c-nancy');
    expect(patch.body).toEqual({ fieldData: { 'map-snapshot': '{"countries":87,"antarctica":true,"places":88,"layovers":12,"storiesBy":2,"savedAt":"2026-10-20T12:00:00Z"}' } });
    expect(calls.find((c) => c.url.endsWith('/items/publish')).body).toEqual({ itemIds: ['c-nancy'] });
  });
  it('answers 401 on a missing or rejected token', async () => {
    expect((await handleMapSnapshot(request(good, ''), env(), { fetchImpl: fakes().fetchImpl })).status).toBe(401);
    expect((await handleMapSnapshot(request(good), env(), { fetchImpl: fakes(null).fetchImpl })).status).toBe(401);
  });
  it('answers 400 on a bad body or bad json without touching Webflow', async () => {
    const { calls, fetchImpl } = fakes();
    expect((await handleMapSnapshot(request({ ...good, countries: 999 }), env(), { fetchImpl })).status).toBe(400);
    expect((await handleMapSnapshot(request('{not json'), env(), { fetchImpl })).status).toBe(400);
    expect(calls.some((c) => c.url.includes('webflow'))).toBe(false);
  });
  it('answers 404 with no item and 429 past 30 writes in one hour', async () => {
    expect((await handleMapSnapshot(request(good), env(), { fetchImpl: fakes('mem_1', []).fetchImpl })).status).toBe(404);
    const e = env();
    const { fetchImpl } = fakes();
    const now = Date.parse('2026-10-20T15:00:00Z');
    for (let i = 0; i < 30; i += 1) {
      expect((await handleMapSnapshot(request(good), e, { fetchImpl, now })).status).toBe(200);
    }
    expect((await handleMapSnapshot(request(good), e, { fetchImpl, now })).status).toBe(429);
    expect(e.WIRE_KV.store.get('map-snapshot:mem_1:2026-10-20T15')).toBe('30');
  });
  it('answers 503 until the secrets are set', async () => {
    expect((await handleMapSnapshot(request(good), env({ WEBFLOW_TOKEN: '' }), { fetchImpl: fakes().fetchImpl })).status).toBe(503);
  });
});
