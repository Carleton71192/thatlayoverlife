import { describe, expect, it } from 'vitest';
import { handleMapSnapshot } from '../src/map-snapshot.js';
import { OWNER_MAP_KEY, handleOwnerMap, isOwner, sanitizeOwnerStates } from '../src/owner-map.js';
import worker from '../src/index.js';

const OWNER = 'mem_cmqcj6qqo35ab0sn20bafhzh3';

function memoryKv() {
  const store = new Map();
  return {
    store,
    get: async (key) => (store.has(key) ? store.get(key) : null),
    put: async (key, value) => void store.set(key, value),
  };
}

function env(overrides = {}) {
  return {
    WEBFLOW_TOKEN: 'wf',
    MEMBERSTACK_KEY: 'ms',
    CONTRIBUTORS_COLLECTION_ID: 'contributors',
    OWNER_MEMBER_ID: OWNER,
    WIRE_KV: memoryKv(),
    ...overrides,
  };
}

function fakes(verified, { jwtOnly = false } = {}) {
  const calls = [];
  const items = [{ id: `c-${verified}`, isDraft: false, fieldData: { 'memberstack-id': verified, slug: 'someone' } }];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method || 'GET' });
    if (url === 'https://admin.memberstack.com/members/verify-token') {
      return new Response(JSON.stringify(jwtOnly ? {} : { data: { id: verified } }), { status: 200 });
    }
    if (url.includes('/items?')) return new Response(JSON.stringify({ items }), { status: 200 });
    return new Response(JSON.stringify({}), { status: 200 });
  };
  return { calls, fetchImpl };
}

const snapshot = { countries: 84, antarctica: false, places: 84, layovers: 3, savedAt: '2026-10-20T12:00:00Z' };

const ownerStates = {
  v: 2,
  travelers: [
    { id: 't1', name: 'Nancy Example', color: '#C2185B', pet: false, email: 'someone@example.com' },
    { id: 't2', name: 'Magnus Waffles', color: '#1E88E5', pet: true, breed: 'dachshund' },
  ],
  states: {
    208: { t1: 'lived', t2: 'visited' },
    840: { t1: 'visited' },
    276: { t1: 'layover', t9: 'lived' },
    undefined: { t1: 'visited' },
    USA: { t1: 'visited' },
    '04': { t1: 'visited' },
    250: { t1: 'wishlist' },
    124: 'visited',
  },
  note: 'private text',
  tllLog: [{ city: 'Copenhagen' }],
};

function request(body, token = 'tok', path = '/map-snapshot') {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return new Request(`https://w.example${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
}

describe('sanitizeOwnerStates', () => {
  it('keeps only v, traveler id, color, pet and pet names, and 3-digit codes with known depths', () => {
    expect(sanitizeOwnerStates(ownerStates)).toEqual({
      map: {
        v: 2,
        travelers: [
          { id: 't1', color: '#C2185B', pet: false },
          { id: 't2', color: '#1E88E5', pet: true, name: 'Magnus Waffles' },
        ],
        states: {
          208: { t1: 'lived', t2: 'visited' },
          840: { t1: 'visited' },
          276: { t1: 'layover' },
          900: { t1: 'visited' },
        },
      },
    });
  });
  it('refuses anything that is not a v2 record', () => {
    expect(sanitizeOwnerStates(null).error).toBeDefined();
    expect(sanitizeOwnerStates({ v: 1, states: {} }).error).toBeDefined();
    expect(sanitizeOwnerStates({ v: 2 }).error).toBeDefined();
    expect(sanitizeOwnerStates([]).error).toBeDefined();
  });
  it('caps travelers, states and pet names', () => {
    const travelers = Array.from({ length: 30 }, (_, i) => ({ id: `t${i}`, pet: i > 0, name: 'x'.repeat(200), color: 'red' }));
    const states = {};
    for (let i = 0; i < 999; i += 1) states[String(i).padStart(3, '0')] = { t0: 'visited' };
    const { map } = sanitizeOwnerStates({ v: 2, travelers, states });
    expect(map.travelers).toHaveLength(10);
    expect(map.travelers[0]).toEqual({ id: 't0', pet: false });
    expect(map.travelers[1].name).toHaveLength(40);
    expect(Object.keys(map.states)).toHaveLength(300);
    expect(JSON.stringify(map).length).toBeLessThan(64 * 1024);
  });
  it('isOwner needs the configured id and an exact match', () => {
    expect(isOwner({ OWNER_MEMBER_ID: OWNER }, OWNER)).toBe(true);
    expect(isOwner({ OWNER_MEMBER_ID: OWNER }, 'mem_other')).toBe(false);
    expect(isOwner({ OWNER_MEMBER_ID: '' }, '')).toBe(false);
    expect(isOwner({}, OWNER)).toBe(false);
  });
});

describe('POST /map-snapshot with states', () => {
  it('stores the sanitized states for the owner and says so', async () => {
    const e = env();
    const res = await handleMapSnapshot(request({ snapshot, states: ownerStates }), e, { fetchImpl: fakes(OWNER).fetchImpl });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, ownerMap: true });
    const stored = JSON.parse(e.WIRE_KV.store.get(OWNER_MAP_KEY));
    expect(stored).toEqual(sanitizeOwnerStates(ownerStates).map);
    expect(e.WIRE_KV.store.get(OWNER_MAP_KEY)).not.toContain('Nancy Example');
    expect(e.WIRE_KV.store.get(OWNER_MAP_KEY)).not.toContain('example.com');
    expect(e.WIRE_KV.store.get(OWNER_MAP_KEY)).not.toContain('Copenhagen');
  });
  it('never stores states for any other member, and their reply has no ownerMap key', async () => {
    const e = env();
    const res = await handleMapSnapshot(request({ snapshot, states: ownerStates }), e, { fetchImpl: fakes('mem_someone_else').fetchImpl });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, savedAt: snapshot.savedAt, slug: 'someone', published: true });
    expect(e.WIRE_KV.store.has(OWNER_MAP_KEY)).toBe(false);
    expect([...e.WIRE_KV.store.keys()].every((k) => k.startsWith('map-snapshot:'))).toBe(true);
  });
  it('never stores states when OWNER_MEMBER_ID is not set', async () => {
    const e = env({ OWNER_MEMBER_ID: undefined });
    await handleMapSnapshot(request({ snapshot, states: ownerStates }), e, { fetchImpl: fakes(OWNER).fetchImpl });
    expect(e.WIRE_KV.store.has(OWNER_MAP_KEY)).toBe(false);
  });
  it('does not trust an id that only the token payload carries', async () => {
    const e = env();
    const payload = Buffer.from(JSON.stringify({ id: OWNER })).toString('base64url');
    const res = await handleMapSnapshot(request({ snapshot, states: ownerStates }, `h.${payload}.s`), e, { fetchImpl: fakes(OWNER, { jwtOnly: true }).fetchImpl });
    expect(res.status).toBe(200);
    expect(e.WIRE_KV.store.has(OWNER_MAP_KEY)).toBe(false);
  });
  it('still accepts the old flat snapshot body, for the owner too, and keeps the stored map', async () => {
    const e = env();
    e.WIRE_KV.store.set(OWNER_MAP_KEY, '{"v":2,"travelers":[],"states":{}}');
    const res = await handleMapSnapshot(request(snapshot), e, { fetchImpl: fakes(OWNER).fetchImpl });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, ownerMap: false });
    expect(e.WIRE_KV.store.get(OWNER_MAP_KEY)).toBe('{"v":2,"travelers":[],"states":{}}');
  });
  it('validates the nested snapshot and refuses unknown top-level keys', async () => {
    const e = env();
    const { fetchImpl } = fakes(OWNER);
    expect((await handleMapSnapshot(request({ snapshot: { ...snapshot, countries: 999 }, states: ownerStates }), e, { fetchImpl })).status).toBe(400);
    expect((await handleMapSnapshot(request({ snapshot, states: ownerStates, extra: 1 }), e, { fetchImpl })).status).toBe(400);
    expect(e.WIRE_KV.store.has(OWNER_MAP_KEY)).toBe(false);
  });
  it('a bad states record leaves the snapshot write alone and stores nothing', async () => {
    const e = env();
    const res = await handleMapSnapshot(request({ snapshot, states: { v: 1 } }), e, { fetchImpl: fakes(OWNER).fetchImpl });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, ownerMap: false });
    expect(e.WIRE_KV.store.has(OWNER_MAP_KEY)).toBe(false);
  });
});

describe('GET /owner-map', () => {
  const get = (origin, method = 'GET') =>
    new Request('https://w.example/owner-map', { method, headers: origin ? { Origin: origin } : {} });

  it('answers 404 JSON when nothing is stored', async () => {
    const res = await worker.fetch(get('https://thatlayover.life'), env(), {});
    expect(res.status).toBe(404);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(await res.json()).toEqual({ error: 'No owner map saved yet.' });
  });
  it('returns the stored JSON with CORS for each site origin and a five minute cache', async () => {
    const e = env();
    const value = JSON.stringify(sanitizeOwnerStates(ownerStates).map);
    e.WIRE_KV.store.set(OWNER_MAP_KEY, value);
    for (const origin of ['https://thatlayover.life', 'https://www.thatlayover.life', 'https://that-layover-life.webflow.io']) {
      const res = await worker.fetch(get(origin), e, {});
      expect(res.status).toBe(200);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(origin);
      expect(res.headers.get('Cache-Control')).toBe('public, max-age=300');
      expect(res.headers.get('Vary')).toBe('Origin');
      expect(await res.text()).toBe(value);
    }
  });
  it('gives no Allow-Origin to other origins', async () => {
    const e = env();
    e.WIRE_KV.store.set(OWNER_MAP_KEY, '{"v":2,"travelers":[],"states":{}}');
    const res = await worker.fetch(get('https://evil.example'), e, {});
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    const pre = await worker.fetch(get('https://evil.example', 'OPTIONS'), e, {});
    expect(pre.status).toBe(204);
    expect(pre.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
  it('answers the preflight for a site origin and 405 for a POST', async () => {
    const e = env();
    const pre = await worker.fetch(get('https://www.thatlayover.life', 'OPTIONS'), e, {});
    expect(pre.status).toBe(204);
    expect(pre.headers.get('Access-Control-Allow-Origin')).toBe('https://www.thatlayover.life');
    expect(pre.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
    const post = await worker.fetch(new Request('https://w.example/owner-map', { method: 'POST', body: '{}' }), e, {});
    expect(post.status).toBe(405);
    expect(post.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
  it('handleOwnerMap answers 404 when KV is missing', async () => {
    const res = await handleOwnerMap(get('https://thatlayover.life'), {});
    expect(res.status).toBe(404);
  });
});
