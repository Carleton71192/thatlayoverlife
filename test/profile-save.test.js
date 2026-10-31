import { describe, expect, it } from 'vitest';
import { handleProfileSave, patchFrom } from '../src/profile-save.js';
import { OPTION_IDS } from '../src/profile-sync.js';
import worker from '../src/index.js';

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

/** Fake Memberstack verify plus fake Webflow; `verified` is the member id Memberstack confirms, or null for a 401. */
function fakes(verified = 'mem_1', items = [{ id: 'c-nancy', isDraft: false, fieldData: { 'memberstack-id': 'mem_1', slug: 'nancy' } }]) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : null, headers: init.headers || {} });
    if (url === 'https://admin.memberstack.com/members/verify-token') {
      if (!verified) return new Response(JSON.stringify({ error: 'bad token' }), { status: 401 });
      return new Response(JSON.stringify({ data: { id: verified } }), { status: 200 });
    }
    if (url.includes('/items?')) return new Response(JSON.stringify({ items }), { status: 200 });
    return new Response(JSON.stringify({}), { status: 200 });
  };
  return { calls, fetchImpl };
}

function request(fields, token = 'tok', origin = 'https://thatlayover.life') {
  const headers = { 'Content-Type': 'application/json', Origin: origin };
  if (token) headers.Authorization = `Bearer ${token}`;
  return new Request('https://w.example/profile/save', { method: 'POST', headers, body: JSON.stringify({ fields }) });
}

describe('patchFrom', () => {
  it('rejects forbidden and unknown slugs', () => {
    for (const slug of ['badge-label', 'press-verified', 'map-snapshot', 'memberstack-id', 'slug', 'member-since', 'country-count', 'fun-title']) {
      const out = patchFrom({ fields: { 'one-line': 'ok', [slug]: 'x' } });
      expect(out.status, slug).toBe(400);
      expect(out.error).toContain(slug);
    }
  });
  it('rejects a body without fields and a value that will not coerce', () => {
    expect(patchFrom({}).status).toBe(400);
    expect(patchFrom({ fields: [] }).status).toBe(400);
    expect(patchFrom({ fields: { visibility: 'Hidden' } }).error).toContain('visibility');
    expect(patchFrom({ fields: { name: '' } }).error).toContain('name');
  });
  it('coerces the member-writable fields', () => {
    const { patch } = patchFrom({ fields: {
      'one-line': ' Seven marathons. ', 'contact-mode': 'email', email: 'JAY@example.com', 'share-ranges': 'on',
      'links-shown': 'strava,instagram', 'website-url': 'jay.run', 'list-expats': false,
    } });
    expect(patch).toEqual({
      'one-line': 'Seven marathons.',
      'contact-mode': OPTION_IDS['contact-mode'].Email,
      email: 'jay@example.com',
      'share-ranges': true,
      'links-shown': 'instagram,strava',
      'website-url': 'https://jay.run',
      'list-expats': false,
    });
    expect(patchFrom({ fields: { crew: ['aaaaaaaaaaaaaaaaaaaaaaaa'] } }).status).toBe(400); // crew links only through an accepted invite
  });
});

describe('handleProfileSave', () => {
  it('writes the member\'s own item and publishes it', async () => {
    const { calls, fetchImpl } = fakes();
    const now = Date.parse('2026-10-20T12:34:56Z');
    const res = await handleProfileSave(request({ 'one-line': 'Lifer', 'credit-mode': 'Pen', 'pen-name': 'The Lifer' }), env(), { fetchImpl, now });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, savedAt: '2026-10-20T12:34:56.000Z', slug: 'nancy', fields: ['one-line', 'credit-mode', 'pen-name'], published: true });
    const verify = calls.find((c) => c.url.includes('verify-token'));
    expect(verify.headers['X-API-KEY']).toBe('ms');
    expect(verify.body).toEqual({ token: 'tok' });
    const patch = calls.find((c) => c.method === 'PATCH');
    expect(patch.url).toContain('/collections/contributors/items/c-nancy');
    expect(patch.body).toEqual({ fieldData: { 'one-line': 'Lifer', 'credit-mode': OPTION_IDS['credit-mode'].Pen, 'pen-name': 'The Lifer' } });
    expect(calls.find((c) => c.url.endsWith('/items/publish')).body).toEqual({ itemIds: ['c-nancy'] });
  });
  it('answers 401 without a token or when Memberstack rejects it', async () => {
    expect((await handleProfileSave(request({ 'one-line': 'x' }, ''), env(), { fetchImpl: fakes().fetchImpl })).status).toBe(401);
    const { calls, fetchImpl } = fakes(null);
    const res = await handleProfileSave(request({ 'one-line': 'x' }, 'bad'), env(), { fetchImpl });
    expect(res.status).toBe(401);
    expect(calls.some((c) => c.url.includes('webflow'))).toBe(false);
  });
  it('answers 400 on a forbidden slug before touching Webflow', async () => {
    const { calls, fetchImpl } = fakes();
    const res = await handleProfileSave(request({ 'badge-label': 'FOUNDER' }), env(), { fetchImpl });
    expect(res.status).toBe(400);
    expect(calls.some((c) => c.url.includes('webflow'))).toBe(false);
  });
  it('only ever writes the item that carries the verified member id', async () => {
    const { calls, fetchImpl } = fakes('mem_2', [
      { id: 'c-nancy', isDraft: false, fieldData: { 'memberstack-id': 'mem_1', slug: 'nancy' } },
      { id: 'c-jay', isDraft: false, fieldData: { 'memberstack-id': 'mem_2', slug: 'jay' } },
    ]);
    const res = await handleProfileSave(request({ 'one-line': 'x' }), env(), { fetchImpl });
    expect((await res.json()).slug).toBe('jay');
    expect(calls.find((c) => c.method === 'PATCH').url).toContain('/items/c-jay');
  });
  it('answers 404 when the member has no item yet', async () => {
    const { fetchImpl } = fakes('mem_1', []);
    expect((await handleProfileSave(request({ 'one-line': 'x' }), env(), { fetchImpl })).status).toBe(404);
  });
  it('answers 429 past 60 writes in one hour, keyed per member and hour', async () => {
    const e = env();
    const { fetchImpl } = fakes();
    const now = Date.parse('2026-10-20T12:00:00Z');
    for (let i = 0; i < 60; i += 1) {
      expect((await handleProfileSave(request({ 'one-line': `v${i}` }), e, { fetchImpl, now })).status).toBe(200);
    }
    expect((await handleProfileSave(request({ 'one-line': 'v61' }), e, { fetchImpl, now })).status).toBe(429);
    expect(e.WIRE_KV.store.get('profile-save:mem_1:2026-10-20T12')).toBe('60');
    const nextHour = Date.parse('2026-10-20T13:00:00Z');
    expect((await handleProfileSave(request({ 'one-line': 'v62' }), e, { fetchImpl, now: nextHour })).status).toBe(200);
  });
  it('answers 503 until the secrets are set', async () => {
    expect((await handleProfileSave(request({ 'one-line': 'x' }), env({ MEMBERSTACK_KEY: '' }), { fetchImpl: fakes().fetchImpl })).status).toBe(503);
  });
});

describe('worker routing and CORS', () => {
  it('answers a preflight for the site origins only, with Authorization allowed', async () => {
    const ok = await worker.fetch(new Request('https://w.example/profile/save', { method: 'OPTIONS', headers: { Origin: 'https://www.thatlayover.life' } }), env(), {});
    expect(ok.status).toBe(204);
    expect(ok.headers.get('Access-Control-Allow-Origin')).toBe('https://www.thatlayover.life');
    expect(ok.headers.get('Access-Control-Allow-Headers')).toContain('Authorization');
    expect(ok.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    const staging = await worker.fetch(new Request('https://w.example/map-snapshot', { method: 'OPTIONS', headers: { Origin: 'https://that-layover-life.webflow.io' } }), env(), {});
    expect(staging.headers.get('Access-Control-Allow-Origin')).toBe('https://that-layover-life.webflow.io');
    const other = await worker.fetch(new Request('https://w.example/hooks/member-updated', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } }), env(), {});
    expect(other.status).toBe(204);
    expect(other.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
  it('rejects GET on the member routes and keeps the old routes', async () => {
    expect((await worker.fetch(new Request('https://w.example/profile/save'), env(), {})).status).toBe(405);
    expect((await worker.fetch(new Request('https://w.example/map-snapshot'), env(), {})).status).toBe(405);
    expect((await worker.fetch(new Request('https://w.example/hooks/member-updated'), env(), {})).status).toBe(405);
    const root = await worker.fetch(new Request('https://w.example/'), env(), {});
    expect(root.status).toBe(200);
    expect(root.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect((await worker.fetch(new Request('https://w.example/nope'), env(), {})).status).toBe(404);
  });
  it('puts the CORS origin on the member route reply itself', async () => {
    const res = await worker.fetch(new Request('https://w.example/profile/save', { method: 'POST', headers: { Origin: 'https://thatlayover.life' }, body: '{}' }), env(), {});
    expect(res.status).toBe(401);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://thatlayover.life');
  });
});
