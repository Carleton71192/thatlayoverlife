import { describe, it, expect } from 'vitest';
import { handleStamps, handleStampsPublic, pursuitCounts } from '../src/stamps.js';

const A = 'a'.repeat(24);
function world() {
  const people = [{ id: A, isDraft: false, fieldData: { name: 'Nancy Carleton', slug: 'nancy-carleton', 'memberstack-id': 'mem_a', pursuits: ['p-mar'] } }];
  const ps = [{ id: 'p-mar', isDraft: false, fieldData: { name: 'Marathons', slug: 'marathons', indexable: false } }, { id: 'p-dog', isDraft: false, fieldData: { name: 'Dog Travel', slug: 'dog-travel' } }];
  const dest = [{ id: 'd-jp', fieldData: { name: 'Japan' } }];
  let stamps = []; let n = 0;
  const env = { WEBFLOW_TOKEN: 't', MEMBERSTACK_KEY: 'k', CONTRIBUTORS_COLLECTION_ID: 'contrib', DESTINATIONS_COLLECTION_ID: 'dest', PURSUITS_COLLECTION_ID: 'purs', STAMPS_COLLECTION_ID: 'stamps',
    WIRE_KV: { get: async () => null, put: async () => {} } };
  const fetchImpl = async (url, init = {}) => {
    const ok = (b) => new Response(JSON.stringify(b), { status: 200 });
    if (url.endsWith('/members/verify-token')) return ok({ data: { id: JSON.parse(init.body).token } });
    const m = /\/collections\/(\w+)\/items(?:\/live)?(?:\/(\w+))?/.exec(url);
    if (init.method === 'POST') { const it = { id: `s${++n}`, isDraft: true, fieldData: JSON.parse(init.body).fieldData }; stamps.push(it); return ok(it); }
    if (init.method === 'PATCH') { JSON.parse(init.body).items.forEach((u) => Object.assign(stamps.find((s) => s.id === u.id).fieldData, u.fieldData)); return ok({}); }
    const list = { contrib: people, purs: ps, dest, stamps }[m[1]];
    if (/name=/.test(url)) { const q = decodeURIComponent(/name=([^&]+)/.exec(url)[1]); return ok({ items: list.filter((x) => x.fieldData.name === q) }); }
    return ok({ items: list });
  };
  const call = (p, b) => handleStamps(new Request(`https://w.example${p}`, { method: 'POST', headers: { Authorization: 'Bearer mem_a' }, body: JSON.stringify(b || {}) }), env, { fetchImpl, now: Date.parse('2026-10-31T12:00:00Z') }).then(async (r) => ({ status: r.status, ...(await r.json()) }));
  const pub = (q) => handleStampsPublic(new Request(`https://w.example${q}`), env, { fetchImpl }).then((r) => r.json());
  return { call, pub, stamps: () => stamps };
}

describe('pursuit stamps', () => {
  it('a stamp is what, where, when and one photo; private until the pursuit is switched on; public shows the year only', async () => {
    const w = world();
    expect((await w.call('/stamps/add', { pursuit: 'marathons', what: '', country: 'Japan', year: 2025 })).status).toBe(400);
    expect((await w.call('/stamps/add', { pursuit: 'marathons', what: 'Tokyo Marathon', country: 'Japan' })).status).toBe(400);
    const r = await w.call('/stamps/add', { pursuit: 'marathons', what: 'Tokyo Marathon', country: 'Japan', city: 'Tokyo', month: 3, year: 2025 });
    expect(r.stamp).toMatchObject({ what: 'Tokyo Marathon', month: 3, year: 2025, shown: false });
    expect(w.stamps()[0].isDraft).toBe(true);
    expect((await w.pub('/stamps/public?slug=nancy-carleton')).shelves).toEqual([]);
    await w.call('/stamps/show', { pursuit: 'marathons', show: true });
    const s = (await w.pub('/stamps/public?slug=nancy-carleton')).shelves[0];
    expect(s).toMatchObject({ pursuit: 'marathons', count: 1, countries: 1 });
    expect(s.stamps[0]).toEqual({ pursuit: 'marathons', pursuitName: 'Marathons', what: 'Tokyo Marathon', country: 'Japan', city: 'Tokyo', year: 2025, photo: '' });
    const mine = await w.call('/stamps/mine');
    expect(mine.pursuits.find((p) => p.slug === 'marathons').picked).toBe(true);
  });
});

describe('hub index rule', () => {
  it('a hub is indexable only with 6 live stories from 3 writers and a written intro', () => {
    const story = (id, c) => ({ id, fieldData: { contributor: c } });
    const live = [story('1', 'x'), story('2', 'x'), story('3', 'y'), story('4', 'y'), story('5', 'z'), story('6', 'x')];
    const intro = '<p>' + 'A hub intro written by a person who runs these races. '.repeat(3) + '</p>';
    const p = (f) => [{ id: 'p', fieldData: { stories: ['1', '2', '3', '4', '5', '6'], intro, ...f } }];
    expect(pursuitCounts(p(), { liveStories: live }).p).toMatchObject({ 'live-stories': 6, writers: 3, indexable: true });
    expect(pursuitCounts(p({ intro: '' }), { liveStories: live }).p.indexable).toBe(false);
    expect(pursuitCounts(p(), { liveStories: live.slice(0, 5) }).p.indexable).toBe(false);
    expect(pursuitCounts(p(), { liveStories: live.map((s) => ({ ...s, fieldData: { contributor: 'x' } })) }).p).toMatchObject({ writers: 1, indexable: false });
  });
});
