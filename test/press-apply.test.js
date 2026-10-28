import { describe, expect, it } from 'vitest';
import { applicationFrom, handlePressApply, PRESS_COLLECTION_DEFAULT } from '../src/press-apply.js';
import worker from '../src/index.js';

function memoryKv() {
  const store = new Map();
  return { store, get: async (k) => (store.has(k) ? store.get(k) : null), put: async (k, v) => void store.set(k, v) };
}
function env(overrides = {}) {
  return { WEBFLOW_TOKEN: 'wf', MEMBERSTACK_KEY: 'ms', CONTRIBUTORS_COLLECTION_ID: 'contributors', WIRE_KV: memoryKv(), ...overrides };
}
function fakes({ verified = 'mem_1', failCreate = false } = {}) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : null });
    if (url.endsWith('/members/verify-token')) {
      if (!verified) return new Response('{}', { status: 401 });
      return new Response(JSON.stringify({ data: { id: verified } }), { status: 200 });
    }
    if (url.includes('/items?')) return new Response(JSON.stringify({ items: [{ id: 'c1', fieldData: { 'memberstack-id': 'mem_1', slug: 'jay-lee', name: 'Jay Lee' } }] }), { status: 200 });
    if (failCreate) return new Response('{}', { status: 500 });
    return new Response(JSON.stringify({ id: 'p1' }), { status: 202 });
  };
  return { calls, fetchImpl };
}
function request(body, token = 'tok') {
  const headers = { 'Content-Type': 'application/json', Origin: 'https://thatlayover.life' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return new Request('https://w.example/press/apply', { method: 'POST', headers, body: JSON.stringify(body) });
}

describe('applicationFrom', () => {
  it('needs an outlet and a link', () => {
    expect(applicationFrom({ proof: 'x.com/a' }).error).toContain('outlet');
    expect(applicationFrom({ outlet: 'Afar' }).error).toContain('press card');
    expect(applicationFrom({ outlet: 'Afar', proof: 'two words' }).error).toContain('press card');
  });
  it('cleans the text and adds https', () => {
    expect(applicationFrom({ outlet: '  Afar\n', role: ' Staff  writer ', proof: 'afar.com/jay' }))
      .toEqual({ outlet: 'Afar', role: 'Staff writer', proof: 'https://afar.com/jay' });
  });
});

describe('handlePressApply', () => {
  it('saves a draft item in the Press applications collection', async () => {
    const { calls, fetchImpl } = fakes();
    const now = Date.parse('2026-10-28T14:00:00Z');
    const res = await handlePressApply(request({ outlet: 'Afar', role: 'Contributor', proof: 'https://afar.com/jay' }), env(), { fetchImpl, now });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, sentAt: '2026-10-28T14:00:00.000Z' });
    const create = calls.find((c) => c.method === 'POST' && c.url.includes(`/collections/${PRESS_COLLECTION_DEFAULT}/items`));
    expect(create.body.isDraft).toBe(true);
    expect(create.body.fieldData).toMatchObject({
      name: 'Jay Lee · Afar', 'member-id': 'mem_1', 'profile-slug': 'jay-lee', outlet: 'Afar', role: 'Contributor',
      'press-card-or-published-pieces': 'https://afar.com/jay', sent: '2026-10-28T14:00:00.000Z',
    });
    expect(create.body.fieldData.slug).toBe(`jay-lee-${now}`);
  });
  it('uses PRESS_COLLECTION_ID when set', async () => {
    const { calls, fetchImpl } = fakes();
    await handlePressApply(request({ outlet: 'Afar', proof: 'afar.com' }), env({ PRESS_COLLECTION_ID: 'other' }), { fetchImpl });
    expect(calls.some((c) => c.method === 'POST' && c.url.includes('/collections/other/items'))).toBe(true);
  });
  it('answers 401, 400, 429 and 502', async () => {
    expect((await handlePressApply(request({ outlet: 'A', proof: 'a.com' }, null), env(), fakes())).status).toBe(401);
    expect((await handlePressApply(request({ outlet: 'A', proof: 'a.com' }), env(), fakes({ verified: null }))).status).toBe(401);
    expect((await handlePressApply(request({ proof: 'a.com' }), env(), fakes())).status).toBe(400);
    const e = env();
    for (let i = 0; i < 3; i += 1) expect((await handlePressApply(request({ outlet: 'A', proof: 'a.com' }), e, fakes())).status).toBe(200);
    expect((await handlePressApply(request({ outlet: 'A', proof: 'a.com' }), e, fakes())).status).toBe(429);
    expect((await handlePressApply(request({ outlet: 'A', proof: 'a.com' }), env(), fakes({ failCreate: true }))).status).toBe(502);
  });
  it('is off without the secrets', async () => {
    expect((await handlePressApply(request({ outlet: 'A', proof: 'a.com' }), env({ WEBFLOW_TOKEN: '' }), fakes())).status).toBe(503);
  });
  it('is routed with CORS for the site', async () => {
    const pre = await worker.fetch(new Request('https://w.example/press/apply', { method: 'OPTIONS', headers: { Origin: 'https://thatlayover.life' } }), env(), {});
    expect(pre.headers.get('Access-Control-Allow-Origin')).toBe('https://thatlayover.life');
  });
});
