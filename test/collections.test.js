import { describe, it, expect } from 'vitest';
import { handleCollections, handleCollectionsPublic, runCollectionCounts, countUsage } from '../src/collections.js';

const A = 'a'.repeat(24), B = 'b'.repeat(24);
const PHOTO = 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/collections/x.jpg';

function world() {
  const people = [
    { id: A, isDraft: false, fieldData: { name: 'Nancy Carleton', slug: 'nancy-carleton', 'memberstack-id': 'mem_a', 'home-base': 'Copenhagen, Denmark' } },
    { id: B, isDraft: false, fieldData: { name: 'Jay Carleton', slug: 'jay-carleton', 'memberstack-id': 'mem_b' } },
  ];
  const cats = ['magnets', 'starbucks-mugs', 'postcards', 'shot-glasses', 'other'].map((s, n) => ({ id: `cat${n}`, isDraft: false, fieldData: { name: s, slug: s, order: n } }));
  const dest = [{ id: 'd-it', fieldData: { name: 'Italy' } }, { id: 'd-jp', fieldData: { name: 'Japan' } }];
  let items = [];
  let n = 0;
  const kv = new Map();
  const env = {
    WEBFLOW_TOKEN: 't', MEMBERSTACK_KEY: 'k', CONTRIBUTORS_COLLECTION_ID: 'contrib', DESTINATIONS_COLLECTION_ID: 'dest',
    COLLECTION_ITEMS_ID: 'citems', COLLECTION_CATEGORIES_ID: 'ccats',
    WIRE_KV: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); } },
  };
  const writes = [];
  const fetchImpl = async (url, init = {}) => {
    const ok = (b) => new Response(JSON.stringify(b), { status: 200 });
    if (url.endsWith('/members/verify-token')) return ok({ data: { id: JSON.parse(init.body).token } });
    const m = /\/collections\/(\w+)\/items(?:\/(live))?(?:\/(\w+))?/.exec(url);
    const col = m[1];
    if (init.method === 'POST' && col === 'citems') { const it = { id: `it${++n}`, isDraft: JSON.parse(init.body).isDraft, fieldData: JSON.parse(init.body).fieldData }; items.push(it); return ok(it); }
    if (init.method === 'DELETE') { items = items.filter((i) => i.id !== m[3]); return ok({}); }
    if (init.method === 'PATCH') { writes.push({ col, body: JSON.parse(init.body) }); if (col === 'citems') JSON.parse(init.body).items.forEach((u) => Object.assign(items.find((i) => i.id === u.id).fieldData, u.fieldData)); return ok({}); }
    const list = { contrib: people, ccats: cats, dest, citems: items }[col];
    if (/name=/.test(url)) { const q = decodeURIComponent(/name=([^&]+)/.exec(url)[1]); return ok({ items: list.filter((x) => x.fieldData.name === q) }); }
    return ok({ items: list });
  };
  const call = (path, token, body) => handleCollections(new Request(`https://w.example${path}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(body || {}) }), env, { fetchImpl, now: Date.parse('2026-10-31T12:00:00Z') }).then(async (r) => ({ status: r.status, ...(await r.json()) }));
  const pub = (slug) => handleCollectionsPublic(new Request(`https://w.example/collections/public?slug=${slug}`), env, { fetchImpl }).then((r) => r.json());
  return { env, fetchImpl, call, pub, items: () => items, writes, cats };
}

describe('collections', () => {
  it('stores every item as a private draft and shows nothing until the member opts in', async () => {
    const w = world();
    const r = await w.call('/collections/add', 'mem_a', { category: 'magnets', country: 'Italy', city: 'Rome', year: 2019, caption: 'From the Trevi stall', photo: PHOTO });
    expect(r.ok).toBe(true);
    expect(w.items()[0].isDraft).toBe(true);
    expect(w.items()[0].fieldData['show-on-profile']).toBe(false);
    expect((await w.pub('nancy-carleton')).shelves).toEqual([]);
    await w.call('/collections/show', 'mem_a', { category: 'magnets', show: true });
    const s = (await w.pub('nancy-carleton')).shelves;
    expect(s).toHaveLength(1);
    expect(s[0]).toMatchObject({ category: 'magnets', countries: 1 });
    expect(s[0].items[0]).toEqual({ category: 'magnets', categoryName: 'magnets', country: 'Italy', city: 'Rome', year: 2019, caption: 'From the Trevi stall', photo: PHOTO });
    expect(JSON.stringify(s)).not.toContain('Copenhagen');
    const next = await w.call('/collections/add', 'mem_a', { category: 'magnets', country: 'Japan' });
    expect(next.item.shown).toBe(true); // follows the collection's choice
    const mug = await w.call('/collections/add', 'mem_a', { category: 'starbucks-mugs', country: 'Japan' });
    expect(mug.item.shown).toBe(false);
  });
  it('checks input: known category and country, own name for Something else, only cleaned photos, year only', async () => {
    const w = world();
    expect((await w.call('/collections/add', 'mem_a', { category: 'spoons', country: 'Italy' })).status).toBe(400);
    expect((await w.call('/collections/add', 'mem_a', { category: 'magnets', country: 'Atlantis' })).status).toBe(400);
    expect((await w.call('/collections/add', 'mem_a', { category: 'other', country: 'Italy' })).status).toBe(400);
    expect((await w.call('/collections/add', 'mem_a', { category: 'magnets', country: 'Italy', photo: 'https://evil.example/x.jpg' })).status).toBe(400);
    const r = await w.call('/collections/add', 'mem_a', { category: 'other', own: 'Sand — from beaches', country: 'Italy', year: 2099 });
    expect(r.item).toMatchObject({ categoryName: 'Sand, from beaches', year: null });
  });
  it('a member deletes only their own items', async () => {
    const w = world();
    const r = await w.call('/collections/add', 'mem_a', { category: 'postcards', country: 'Italy' });
    expect((await w.call('/collections/delete', 'mem_b', { id: r.item.id })).status).toBe(404);
    expect((await w.call('/collections/delete', 'mem_a', { id: r.item.id })).ok).toBe(true);
    expect(w.items()).toEqual([]);
  });
  it('counts how many members use each category, private included, and how many show it', async () => {
    const w = world();
    await w.call('/collections/add', 'mem_a', { category: 'magnets', country: 'Italy' });
    await w.call('/collections/add', 'mem_a', { category: 'magnets', country: 'Japan' });
    await w.call('/collections/add', 'mem_b', { category: 'magnets', country: 'Italy' });
    await w.call('/collections/add', 'mem_b', { category: 'shot-glasses', country: 'Japan' });
    await w.call('/collections/show', 'mem_b', { category: 'magnets', show: true });
    const c = countUsage(w.items(), w.cats);
    expect(c.cat0).toEqual({ members: 2, 'public-members': 1, items: 3, countries: 2 });
    expect(c.cat3).toEqual({ members: 1, 'public-members': 0, items: 1, countries: 1 });
    expect(await runCollectionCounts(w.env, { fetchImpl: w.fetchImpl })).toMatch(/magnets 2/);
  });
});
