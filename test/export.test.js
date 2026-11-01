import { describe, it, expect } from 'vitest';
import { buildExport, checkStates, countryRows, csv, handleExport, handleExportPrepare, handleExportZip, storyPage } from '../src/export.js';
import { collectBytes } from '../src/zip.js';
import { readZip, textOf } from './zip-read.js';

const ME = 'a'.repeat(24), OTHER = 'b'.repeat(24);
const NOW = Date.parse('2026-10-31T12:00:00Z');
const AVATAR = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xff, 0xd9]);
const CDN = 'https://cdn.prod.website-files.com';

describe('download everything', () => {
  it("holds only the member's own records, drafts and private items included, and never internal fields", () => {
    const me = { id: ME, fieldData: { name: 'Nancy Carleton', slug: 'nancy-carleton', 'memberstack-id': 'mem_x', 'outreach-notes': 'internal', avatar: { url: 'https://x/a.jpg' },
      crew: [OTHER], 'map-snapshot': '{"countries":89,"antarctica":true}' } };
    const stories = [
      { id: 's1', isDraft: false, fieldData: { contributor: ME, slug: 'bulgaria', name: 'Bulgaria', body: '<p>x</p>', 'hero-image': { url: 'https://x/h.jpg' }, 'photo-gallery': [{ url: 'https://x/g1.jpg' }] } },
      { id: 's2', isDraft: true, fieldData: { contributor: ME, slug: 'draft-one', name: 'Draft' } },
      { id: 's3', isDraft: false, fieldData: { contributor: OTHER, slug: 'not-mine', name: 'Not mine' } },
    ];
    const items = [{ id: 'i1', fieldData: { owner: ME, name: 'Japan', category: 'c1', 'show-on-profile': false, photo: { url: 'https://x/m.jpg' }, 'more-photos': [{ url: 'https://x/m2.jpg' }] } }, { id: 'i2', fieldData: { owner: OTHER, name: 'Italy', category: 'c1' } }];
    const out = buildExport({ me, stories, items, cats: [{ id: 'c1', fieldData: { name: 'Magnets' } }], people: [{ id: OTHER, fieldData: { name: 'Jay Carleton', slug: 'jay-carleton' } }], now: NOW });
    expect(out.stories.map((s) => [s.slug, s.status, s.link])).toEqual([['bulgaria', 'published', 'https://www.thatlayover.life/stories/bulgaria'], ['draft-one', 'draft', null]]);
    expect(out.collections).toEqual([{ collection: 'Magnets', country: 'Japan', city: '', year: null, caption: '', shownOnProfile: false, photos: ['https://x/m.jpg', 'https://x/m2.jpg'] }]);
    expect(out.companions).toEqual([{ name: 'Jay Carleton', link: 'https://www.thatlayover.life/contributors/jay-carleton' }]);
    expect(out.mapSummary).toEqual({ countries: 89, antarctica: true });
    expect(out.profile['memberstack-id']).toBeUndefined();
    expect(out.profile['outreach-notes']).toBeUndefined();
    expect(out.photos.map((p) => `${p.folder}/${p.name}`)).toEqual(['profile/avatar', 'stories/bulgaria/cover', 'stories/bulgaria/photo-01', 'collections/magnets/japan-1-1', 'collections/magnets/japan-1-2']);
  });

  it('story pages and CSV keep the markup the browser version made', () => {
    const page = storyPage({ title: 'A <story>', place: 'Sofia', trip: 'May 2026', status: 'draft', excerpt: 'Short', body: '<p>Body</p>', signOff: 'Nancy', link: null, externalUrl: 'https://else.example/a' });
    expect(page).toContain('<title>A &lt;story&gt;</title>');
    expect(page).toContain('<small>Sofia · May 2026 · Draft</small>');
    expect(page).toContain('<p><em>Short</em></p><p>Body</p><p>Nancy</p>');
    expect(page).toContain('Published at: <a href="https://else.example/a">');
    expect(page).not.toContain('Online:');
    expect(csv([{ a: 'x,y', b: ['p', 'q'], c: null }], ['a', 'b', 'c'])).toBe('a,b,c\n"x,y",p q,\n');
  });

  it('checks the map from the browser and turns it into rows', () => {
    expect(checkStates({ v: 1, states: {} }).error).toMatch(/tllStates v2/);
    expect(checkStates({ v: 2, states: {}, travelers: 'me' }).error).toMatch(/tllStates v2/);
    expect(checkStates({ v: 2, states: [] }).error).toMatch(/tllStates v2/);
    const { map } = checkStates({ v: 2, travelers: [{ id: 'me', name: 'Nancy', color: '#C8325B', extra: 1 }, { id: 'bad id!' }, { id: 'rex', name: 'Rex<', pet: true }],
      states: { 392: { me: 'lived', rex: 'visited', ghost: 'lived' }, XK: { me: 'layover' }, nope: { me: 'lived' }, 100: { me: 'maybe' } } });
    expect(map).toEqual({ v: 2, travelers: [{ id: 'me', name: 'Nancy', color: '#C8325B', pet: false }, { id: 'rex', name: 'Rex', pet: true }], states: { 392: { me: 'lived', rex: 'visited' }, 900: { me: 'layover' } } });
    expect(countryRows(map)).toEqual([{ country: 'Japan', code: 'JP', traveler: 'Nancy', mark: 'Lived' }, { country: 'Japan', code: 'JP', traveler: 'Rex', mark: 'Stayed' }, { country: '900', code: '900', traveler: 'Nancy', mark: 'Layover' }]);
  });
});

/** A member with two stories, one collection, a pet and four photos: one downloads, one is 404, one breaks, one is on a strange host. */
function world() {
  const kv = new Map();
  const log = [];
  const env = { WEBFLOW_TOKEN: 't', MEMBERSTACK_KEY: 'k', CONTRIBUTORS_COLLECTION_ID: 'contrib', STORIES_COLLECTION_ID: 'stories', COLLECTION_ITEMS_ID: 'items', COLLECTION_CATEGORIES_ID: 'cats',
    STAMPS_COLLECTION_ID: 'stamps', PURSUITS_COLLECTION_ID: 'purs', PETS_COLLECTION_ID: 'pets',
    WIRE_KV: {
      get: async (k) => (kv.has(k) ? kv.get(k).value : null),
      put: async (k, v, o) => { kv.set(k, { value: v, ttl: o?.expirationTtl }); log.push(['put', k]); },
      delete: async (k) => { kv.delete(k); log.push(['delete', k]); },
    } };
  const lists = {
    contrib: [{ id: ME, fieldData: { name: 'Nancy Carleton', slug: 'nancy-carleton', 'memberstack-id': 'mem_a', avatar: { url: `${CDN}/avatar.jpg` }, desks: '[{"c":"dk","years":"2019-","now":true}]' } },
      { id: OTHER, fieldData: { name: 'Jay Carleton', slug: 'jay-carleton', 'memberstack-id': 'mem_b' } }],
    stories: [
      { id: 's1', isDraft: false, fieldData: { contributor: ME, slug: 'bulgaria', name: 'Bulgaria', body: '<p>Sofia in May.</p>', 'hero-image': { url: `${CDN}/missing.png` }, 'photo-gallery': [{ url: 'https://res.cloudinary.com/idonvlow/image/upload/g1.jpg' }] } },
      { id: 's2', isDraft: true, fieldData: { contributor: ME, slug: 'draft-one', name: 'Draft one' } },
      { id: 's3', isDraft: false, fieldData: { contributor: OTHER, slug: 'not-mine', name: 'Not mine' } },
    ],
    items: [{ id: 'i1', fieldData: { owner: ME, name: 'Japan', category: 'c1', photo: { url: 'https://evil.example/x.jpg' } } }],
    cats: [{ id: 'c1', fieldData: { name: 'Magnets' } }],
    stamps: [], purs: [],
    pets: [{ id: 'p1', fieldData: { owner: ME, name: 'Rex', slug: 'rex', breed: 'Beagle' } }],
  };
  const fetched = [];
  const fetchImpl = async (url, init = {}) => {
    const ok = (b) => new Response(JSON.stringify(b), { status: 200 });
    if (url.endsWith('/members/verify-token')) return ok({ data: { id: JSON.parse(init.body).token } });
    const m = /\/collections\/(\w+)\/items/.exec(url);
    if (m) return ok({ items: lists[m[1]] || [] });
    fetched.push(url);
    if (url === `${CDN}/avatar.jpg`) return new Response(AVATAR, { status: 200, headers: { 'content-type': 'image/jpeg' } });
    if (url === `${CDN}/missing.png`) return new Response('gone', { status: 404 });
    if (url.startsWith('https://res.cloudinary.com/')) throw new TypeError('connection reset');
    throw new Error(`unexpected fetch ${url}`);
  };
  const opts = (now = NOW) => ({ fetchImpl, now });
  const prepare = (body, { token = 'mem_a', now, raw } = {}) => handleExportPrepare(new Request('https://w.example/export/prepare', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: raw ?? JSON.stringify(body || {}) }), env, opts(now))
    .then(async (r) => ({ status: r.status, ...(await r.json()) }));
  const zip = (url, now) => handleExportZip(new Request(url, { method: 'GET' }), env, opts(now));
  return { env, kv, log, fetched, prepare, zip, opts };
}

describe('POST /export/prepare and GET /export/zip', () => {
  it('prepare checks the member, stores a 15-minute job and returns the link', async () => {
    const w = world();
    const r = await w.prepare({});
    expect(r.status).toBe(200);
    expect(r.ok).toBe(true);
    expect(r.url).toMatch(/^https:\/\/w\.example\/export\/zip\?t=[0-9a-f]{32}$/);
    expect(r).toMatchObject({ stories: 2, photos: 4, expiresAt: '2026-10-31T12:15:00.000Z' });
    const token = r.url.split('t=')[1];
    const job = w.kv.get(`export:${token}`);
    expect(job.ttl).toBe(900);
    expect(JSON.parse(job.value)).toEqual({ memberId: 'mem_a', contributorId: ME, createdAt: NOW, states: null });
    // The old JSON route still answers, and both share the ten-an-hour limit.
    const plain = await handleExport(new Request('https://w.example/export', { method: 'POST', headers: { Authorization: 'Bearer mem_a' }, body: '{}' }), w.env, w.opts());
    expect((await plain.json()).stories).toHaveLength(2);
    await w.env.WIRE_KV.put('export:mem_a:2026-10-31T12', '10');
    expect((await w.prepare({})).status).toBe(429);
    expect((await w.prepare({}, { token: 'mem_zzz' })).status).toBe(404);
  });

  it('the zip streams every file of the copy, and a photo that fails lands in photos/not-downloaded.txt', async () => {
    const w = world();
    const { url } = await w.prepare({ states: { v: 2, travelers: [{ id: 'me', name: 'Nancy' }], states: { 392: { me: 'lived' }, 208: { me: 'visited' } } } });
    const res = await w.zip(url);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/zip');
    expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="that-layover-life-nancy-carleton-2026-10-31.zip"');
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    const entries = readZip(await collectBytes(res.body));
    expect(entries.every((e) => e.crcOk && e.method === 0)).toBe(true);
    const by = Object.fromEntries(entries.map((e) => [e.name.replace('that-layover-life/', ''), e]));
    expect(Object.keys(by)).toEqual(['README.txt', 'profile.json', 'stories/stories.json', 'stories/bulgaria.html', 'stories/draft-one.html', 'collections.json', 'collections.csv', 'stamps.json', 'stamps.csv',
      'pets.json', 'companions.json', 'map/map-summary.json', 'map/my-map.json', 'map/countries.csv', 'places-lived.json', 'places-lived.csv', 'photos/profile/avatar.jpg', 'photos/not-downloaded.txt']);
    expect(textOf(by['README.txt'])).toMatch(/^That Layover Life: your copy\nExported 2026-10-31T12:00:00.000Z\nProfile: https:\/\/www.thatlayover.life\/contributors\/nancy-carleton\n/);
    expect(JSON.parse(textOf(by['profile.json']))).toMatchObject({ name: 'Nancy Carleton', slug: 'nancy-carleton' });
    expect(JSON.parse(textOf(by['profile.json']))['memberstack-id']).toBeUndefined();
    expect(textOf(by['stories/bulgaria.html'])).toContain('<h1>Bulgaria</h1>');
    expect(textOf(by['stories/draft-one.html'])).toContain('<small>Draft</small>');
    expect(JSON.parse(textOf(by['stories/stories.json'])).map((s) => s.slug)).toEqual(['bulgaria', 'draft-one']);
    expect(textOf(by['collections.csv'])).toBe('collection,country,city,year,caption,shownOnProfile,photos\nMagnets,Japan,,,,false,https://evil.example/x.jpg\n');
    expect(JSON.parse(textOf(by['pets.json']))).toEqual([{ name: 'Rex', breed: 'Beagle', countries: '', link: 'https://www.thatlayover.life/pets/rex', role: 'owner' }]);
    expect(JSON.parse(textOf(by['map/my-map.json']))).toEqual({ v: 2, travelers: [{ id: 'me', name: 'Nancy', pet: false }], states: { 208: { me: 'visited' }, 392: { me: 'lived' } } });
    expect(textOf(by['map/countries.csv'])).toBe('country,code,traveler,mark\nDenmark,DK,Nancy,Stayed\nJapan,JP,Nancy,Lived\n');
    expect(textOf(by['places-lived.csv'])).toBe('country,code,years,placesIKnowWell,homeNow\nDenmark,DK,2019-,,yes\n');
    expect(Array.from(by['photos/profile/avatar.jpg'].data)).toEqual(Array.from(AVATAR));
    expect(textOf(by['photos/not-downloaded.txt'])).toBe(`These photos could not be downloaded, so here are their links:\nstories/bulgaria/cover: ${CDN}/missing.png\nstories/bulgaria/photo-01: https://res.cloudinary.com/idonvlow/image/upload/g1.jpg\ncollections/magnets/japan-1: https://evil.example/x.jpg\n`);
    // The strange host was never fetched from inside the Worker.
    expect(w.fetched).toEqual([`${CDN}/avatar.jpg`, `${CDN}/missing.png`, 'https://res.cloudinary.com/idonvlow/image/upload/g1.jpg']);
  });

  it('a wrong, malformed or expired token is 404', async () => {
    const w = world();
    expect((await w.zip('https://w.example/export/zip?t=abc')).status).toBe(404);
    expect((await w.zip(`https://w.example/export/zip?t=${'f'.repeat(32)}`)).status).toBe(404);
    expect((await w.zip('https://w.example/export/zip')).status).toBe(404);
    const { url } = await w.prepare({});
    const late = await w.zip(url, NOW + 16 * 60 * 1000);
    expect(late.status).toBe(404);
    // A navigation target, so the answer is a small page with a way back, not JSON.
    expect(late.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
    expect(await late.text()).toMatch(/That download link has expired.*<a href="https:\/\/www\.thatlayover\.life\/account">Back to your account<\/a>/);
    expect(w.log.filter((l) => l[0] === 'delete')).toHaveLength(1);
    expect((await handleExportZip(new Request(url, { method: 'POST' }), w.env, w.opts())).status).toBe(405);
  });

  it('a link downloads once: the token goes when the zip finishes', async () => {
    const w = world();
    const { url } = await w.prepare({});
    const token = url.split('t=')[1];
    const first = await w.zip(url);
    expect(first.status).toBe(200);
    // Headers are out, the job is still there (a download that breaks off can be retried) until the last byte is written.
    expect(w.kv.has(`export:${token}`)).toBe(true);
    const bytes = await collectBytes(first.body);
    expect(readZip(bytes).length).toBeGreaterThan(10);
    expect(w.kv.has(`export:${token}`)).toBe(false);
    expect((await w.zip(url)).status).toBe(404);
  });

  it('the map must be a tllStates v2 record, 200 KB at most; without one the zip simply has no my-map.json', async () => {
    const w = world();
    expect((await w.prepare({ states: { v: 1 } })).status).toBe(400);
    expect((await w.prepare({ states: { v: 2, states: {}, travelers: 'x' } })).status).toBe(400);
    expect((await w.prepare(null, { raw: 'not json' })).status).toBe(400);
    const big = await w.prepare({ states: { v: 2, travelers: [], states: {}, pad: 'x'.repeat(200 * 1024) } });
    expect(big.status).toBe(413);
    const { url } = await w.prepare({ states: null });
    const names = readZip(await collectBytes((await w.zip(url)).body)).map((e) => e.name);
    expect(names).toContain('that-layover-life/map/map-summary.json');
    expect(names).not.toContain('that-layover-life/map/my-map.json');
    expect(names).not.toContain('that-layover-life/map/countries.csv');
  });
});
