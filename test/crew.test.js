import { describe, it, expect } from 'vitest';
import { handleCrew, handleCrewPublic, pairKey } from '../src/crew.js';

const A = 'a'.repeat(24), B = 'b'.repeat(24), C = 'c'.repeat(24), PET = 'e'.repeat(24);
const OFF = '1423c8d17c2060776541377f76ea0b31';

function world() {
  const items = {
    [A]: { id: A, isDraft: false, fieldData: { name: 'Nancy Carleton', slug: 'nancy-carleton', 'memberstack-id': 'mem_a', 'home-base': 'Copenhagen, Denmark', crew: [] } },
    [B]: { id: B, isDraft: false, fieldData: { name: 'Jay Carleton', slug: 'jay-carleton', 'memberstack-id': 'mem_b', crew: [] } },
    [C]: { id: C, isDraft: false, fieldData: { name: 'House Anonymous', slug: 'anonymous', 'memberstack-id': 'mem_c', visibility: OFF, crew: [] } },
  };
  const pets = { [PET]: { id: PET, isDraft: false, fieldData: { name: 'Magnus Waffles', slug: 'magnus-waffles', owner: A, 'shared-with': [], 'is-public': true } } };
  const kv = new Map();
  const env = {
    WEBFLOW_TOKEN: 't', MEMBERSTACK_KEY: 'k', CONTRIBUTORS_COLLECTION_ID: 'contrib', PETS_COLLECTION_ID: 'pets',
    WIRE_KV: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); }, delete: async (k) => { kv.delete(k); } },
  };
  const fetchImpl = async (url, init = {}) => {
    const ok = (b) => new Response(JSON.stringify(b), { status: 200 });
    if (url.endsWith('/members/verify-token')) return ok({ data: { id: JSON.parse(init.body).token } });
    const m = /\/collections\/(\w+)\/items(?:\/live)?(?:\/(\w+))?/.exec(url);
    const store = m && m[1] === 'pets' ? pets : items;
    if (m && m[2] === 'publish') return ok({});
    if (m && m[2] && init.method === 'PATCH') { Object.assign(store[m[2]].fieldData, JSON.parse(init.body).fieldData); return ok(store[m[2]]); }
    if (m && m[2]) return store[m[2]] ? ok(store[m[2]]) : new Response('{}', { status: 404 });
    if (m) return ok({ items: Object.values(store) });
    return ok({});
  };
  const call = (path, token, body) => handleCrew(new Request(`https://w.example${path}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(body || {}) }), env, { fetchImpl })
    .then((r) => r.json().then((j) => ({ status: r.status, ...j })));
  const pub = (q) => handleCrewPublic(new Request(`https://w.example${q}`), env, { fetchImpl }).then((r) => r.json());
  return { items, pets, kv, env, call, pub };
}

describe('travel companions', () => {
  it('shares nothing until the other person says yes, then links both profiles', async () => {
    const w = world();
    const inv = await w.call('/crew/invite', 'mem_a', { kind: 'person', to: B, type: 'partner' });
    expect(inv.ok).toBe(true);
    expect(w.items[A].fieldData.crew).toEqual([]);
    expect((await w.pub('/crew/public?slug=nancy-carleton')).companions).toEqual([]);
    const box = await w.call('/crew/inbox', 'mem_b');
    expect(box.incoming.map((i) => i.fromName)).toEqual(['Nancy Carleton']);
    expect(JSON.stringify(box)).not.toContain('Copenhagen');
    expect((await w.call('/crew/answer', 'mem_b', { id: inv.invite.id, accept: true })).accepted).toBe(true);
    expect(w.items[A].fieldData.crew).toEqual([B]);
    expect(w.items[B].fieldData.crew).toEqual([A]);
    expect(w.kv.get(pairKey(A, B))).toBe('partner');
    const p = await w.pub('/crew/public?slug=nancy-carleton');
    expect(p.companions).toEqual([{ id: B, name: 'Jay Carleton', slug: 'jay-carleton', avatar: '', type: 'Partner' }]);
    expect((await w.call('/crew/inbox', 'mem_b')).incoming).toEqual([]);
  });
  it('only the invited person can answer; "Not now" links nothing; the sender can cancel', async () => {
    const w = world();
    const inv = await w.call('/crew/invite', 'mem_a', { kind: 'person', to: B, type: 'family' });
    expect((await w.call('/crew/answer', 'mem_a', { id: inv.invite.id, accept: true })).status).toBe(404);
    await w.call('/crew/answer', 'mem_b', { id: inv.invite.id, accept: false });
    expect(w.items[B].fieldData.crew).toEqual([]);
    const again = await w.call('/crew/invite', 'mem_a', { kind: 'person', to: B, type: 'buddy' });
    expect((await w.call('/crew/invite', 'mem_a', { kind: 'person', to: B })).status).toBe(409);
    expect((await w.call('/crew/cancel', 'mem_a', { id: again.invite.id })).ok).toBe(true);
    expect((await w.call('/crew/inbox', 'mem_b')).incoming).toEqual([]);
  });
  it('refuses yourself, hidden profiles and unknown ids', async () => {
    const w = world();
    expect((await w.call('/crew/invite', 'mem_a', { to: A })).status).toBe(400);
    expect((await w.call('/crew/invite', 'mem_a', { to: C })).status).toBe(404);
    expect((await w.call('/crew/invite', 'mem_a', { to: 'nope' })).status).toBe(400);
  });
  it('either side can leave; leaving removes only the link', async () => {
    const w = world();
    const inv = await w.call('/crew/invite', 'mem_a', { kind: 'person', to: B, type: 'partner' });
    await w.call('/crew/answer', 'mem_b', { id: inv.invite.id, accept: true });
    await w.call('/crew/leave', 'mem_b', { kind: 'person', other: A });
    expect(w.items[A].fieldData.crew).toEqual([]);
    expect(w.items[B].fieldData.crew).toEqual([]);
    expect(w.items[A].fieldData.name).toBe('Nancy Carleton');
  });
});

describe('shared pets', () => {
  it('an owner invites a co-owner; the pet record is the single list', async () => {
    const w = world();
    expect((await w.call('/crew/invite', 'mem_b', { kind: 'pet', pet: PET, to: A })).status).toBe(403);
    const inv = await w.call('/crew/invite', 'mem_a', { kind: 'pet', pet: PET, to: B });
    expect(w.pets[PET].fieldData['shared-with']).toEqual([]);
    await w.call('/crew/answer', 'mem_b', { id: inv.invite.id, accept: true });
    expect(w.pets[PET].fieldData['shared-with']).toEqual([B]);
    expect((await w.pub('/crew/public?pet=magnus-waffles')).owners.map((o) => o.name)).toEqual(['Nancy Carleton', 'Jay Carleton']);
    expect((await w.pub('/crew/public?slug=jay-carleton')).pets.map((p) => p.name)).toEqual(['Magnus Waffles']);
    expect((await w.call('/crew/inbox', 'mem_b')).pets[0]).toMatchObject({ name: 'Magnus Waffles', owner: false });
  });
  it('a co-owner can leave, the owner can remove a co-owner, nobody removes the owner', async () => {
    const w = world();
    w.pets[PET].fieldData['shared-with'] = [B];
    expect((await w.call('/crew/leave', 'mem_b', { kind: 'pet', pet: PET, who: A })).status).toBe(403);
    expect((await w.call('/crew/leave', 'mem_a', { kind: 'pet', pet: PET, who: B })).ok).toBe(true);
    expect(w.pets[PET].fieldData['shared-with']).toEqual([]);
    expect(w.pets[PET].fieldData.owner).toBe(A);
  });
});

describe('people search', () => {
  it('finds public travelers by name and never returns a place', async () => {
    const w = world();
    const r = await w.pub('/crew/people?q=jay');
    expect(r.people).toEqual([{ id: B, name: 'Jay Carleton', slug: 'jay-carleton', avatar: '' }]);
    expect((await w.pub('/crew/people?q=anon')).people).toEqual([]);
  });
});
