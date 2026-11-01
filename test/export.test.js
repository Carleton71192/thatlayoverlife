import { describe, it, expect, vi, afterEach } from 'vitest';
import { PHOTO_HEADER_TIMEOUT_MS, buildExport, checkStates, countryRows, csv, handleExport, handleExportPhoto, handleExportPrepare, handleExportZip, photosPage, storyPage } from '../src/export.js';
import { collectBytes } from '../src/zip.js';
import { readZip, textOf } from './zip-read.js';

const ME = 'a'.repeat(24), OTHER = 'b'.repeat(24);
const NOW = Date.parse('2026-10-31T12:00:00Z');
const AVATAR = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xff, 0xd9]);
const CDN = 'https://cdn.prod.website-files.com';
const SITE = 'https://www.thatlayover.life';

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

  it('story pages, the photo index and CSV keep the markup the browser version made', () => {
    const page = storyPage({ title: 'A <story>', place: 'Sofia', trip: 'May 2026', status: 'draft', excerpt: 'Short', body: '<p>Body</p>', signOff: 'Nancy', link: null, externalUrl: 'https://else.example/a' });
    expect(page).toContain('<title>A &lt;story&gt;</title>');
    expect(page).toContain('<small>Sofia · May 2026 · Draft</small>');
    expect(page).toContain('<p><em>Short</em></p><p>Body</p><p>Nancy</p>');
    expect(page).toContain('Published at: <a href="https://else.example/a">');
    expect(page).not.toContain('Online:');
    expect(csv([{ a: 'x,y', b: ['p', 'q'], c: null }], ['a', 'b', 'c'])).toBe('a,b,c\n"x,y",p q,\n');
    const index = photosPage([{ folder: 'profile', name: 'avatar', url: 'https://x/a.jpg', alt: '' }, { folder: 'stories/b', name: 'cover', url: 'https://x/c.jpg?x=1&y=2', alt: 'Sofia <at> dusk' }, { folder: 'stories/b', name: 'photo-01', url: 'https://x/g.jpg', alt: '' }]);
    expect(index).toContain('<h1>Your photos</h1><p>3 photos, each with its link.');
    expect(photosPage([{ folder: 'profile', name: 'avatar', url: 'https://x/a.jpg', alt: '' }])).toContain('<h1>Your photos</h1><p>1 photo, with its link. The photos themselves');
    expect(index).toContain('<h2>profile</h2><ul><li><a href="https://x/a.jpg">avatar</a></li></ul>');
    expect(index).toContain('<h2>stories/b</h2><ul><li><a href="https://x/c.jpg?x=1&amp;y=2">cover</a> <small>Sofia &lt;at&gt; dusk</small></li><li><a href="https://x/g.jpg">photo-01</a></li></ul>');
  });

  it('checks the map from the browser and turns it into rows, Kosovo included', () => {
    expect(checkStates({ v: 1, states: {} }).error).toMatch(/tllStates v2/);
    expect(checkStates({ v: 2, states: {}, travelers: 'me' }).error).toMatch(/tllStates v2/);
    expect(checkStates({ v: 2, states: [] }).error).toMatch(/tllStates v2/);
    const { map } = checkStates({ v: 2, travelers: [{ id: 'me', name: 'Nancy', color: '#C8325B', extra: 1 }, { id: 'bad id' }, { id: 'rex', name: 'Rex<', pet: true }],
      states: { 392: { me: 'lived', rex: 'visited', ghost: 'lived' }, XK: { me: 'layover' }, nope: { me: 'lived' }, 100: { me: 'maybe' } } });
    expect(map).toEqual({ v: 2, travelers: [{ id: 'me', name: 'Nancy', color: '#C8325B', pet: false }, { id: 'rex', name: 'Rex', pet: true }], states: { 392: { me: 'lived', rex: 'visited' }, 900: { me: 'layover' } } });
    expect(countryRows(map)).toEqual([{ country: 'Japan', code: 'JP', traveler: 'Nancy', mark: 'Lived' }, { country: 'Japan', code: 'JP', traveler: 'Rex', mark: 'Stayed' }, { country: 'Kosovo', code: 'XK', traveler: 'Nancy', mark: 'Layover' }]);
  });
});

/** A member with two stories, one collection, a pet and four photos on the CDN hosts and one strange host. */
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
    fetched.push({ url, init });
    if (url === `${CDN}/avatar.jpg`) return new Response(AVATAR, { status: 200, headers: { 'content-type': 'image/jpeg', 'content-length': String(AVATAR.length) } });
    if (url === `${CDN}/missing.png`) return new Response('gone', { status: 404 });
    if (url.startsWith('https://res.cloudinary.com/')) throw new TypeError('connection reset');
    throw new Error(`unexpected fetch ${url}`);
  };
  const opts = (now = NOW) => ({ fetchImpl, now });
  const prepare = (body, { token = 'mem_a', now, raw } = {}) => handleExportPrepare(new Request('https://w.example/export/prepare', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: raw ?? JSON.stringify(body || {}) }), env, opts(now))
    .then(async (r) => ({ status: r.status, ...(await r.json()) }));
  const zip = (url, now) => handleExportZip(new Request(url, { method: 'GET' }), env, opts(now));
  const photo = (token, u, { now, origin = SITE, method = 'GET', fetchImpl: f } = {}) => {
    const q = new URLSearchParams(); if (token != null) q.set('t', token); if (u != null) q.set('u', u);
    return handleExportPhoto(new Request(`https://w.example/export/photo?${q}`, { method, headers: origin ? { Origin: origin } : {} }), env, { fetchImpl: f || fetchImpl, now: now ?? NOW });
  };
  return { env, kv, log, fetched, prepare, zip, photo, opts };
}

describe('POST /export/prepare and GET /export/zip', () => {
  it('prepare checks the member, stores a job for the 60-minute photo window and returns the 15-minute link, the token and the photo list', async () => {
    const w = world();
    const r = await w.prepare({});
    expect(r.status).toBe(200);
    expect(r.ok).toBe(true);
    expect(r.url).toMatch(/^https:\/\/w\.example\/export\/zip\?t=[0-9a-f]{32}$/);
    expect(r).toMatchObject({ stories: 2, photos: 4, expiresAt: '2026-10-31T12:15:00.000Z' });
    const token = r.url.split('t=')[1];
    expect(r.token).toBe(token);
    expect(r.photoList).toEqual([
      { folder: 'profile', name: 'avatar', url: `${CDN}/avatar.jpg` },
      { folder: 'stories/bulgaria', name: 'cover', url: `${CDN}/missing.png` },
      { folder: 'stories/bulgaria', name: 'photo-01', url: 'https://res.cloudinary.com/idonvlow/image/upload/g1.jpg' },
      { folder: 'collections/magnets', name: 'japan-1', url: 'https://evil.example/x.jpg' },
    ]);
    const job = w.kv.get(`export:${token}`);
    expect(job.ttl).toBe(3600);
    expect(JSON.parse(job.value)).toEqual({ memberId: 'mem_a', contributorId: ME, createdAt: NOW, photoUntil: NOW + 60 * 60 * 1000, states: null });
    // The old JSON route still answers, and both share the ten-an-hour limit.
    const plain = await handleExport(new Request('https://w.example/export', { method: 'POST', headers: { Authorization: 'Bearer mem_a' }, body: '{}' }), w.env, w.opts());
    expect((await plain.json()).stories).toHaveLength(2);
    await w.env.WIRE_KV.put('export:mem_a:2026-10-31T12', '10');
    expect((await w.prepare({})).status).toBe(429);
    expect((await w.prepare({}, { token: 'mem_zzz' })).status).toBe(404);
  });

  it('the zip streams the records only, with the photos listed by link, and never fetches a photo', async () => {
    const w = world();
    const { url } = await w.prepare({ states: { v: 2, travelers: [{ id: 'me', name: 'Nancy' }], states: { 392: { me: 'lived' }, 208: { me: 'visited' }, 900: { me: 'layover' } } } });
    const res = await w.zip(url);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/zip');
    expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="that-layover-life-nancy-carleton-2026-10-31.zip"');
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    const entries = readZip(await collectBytes(res.body));
    expect(entries.every((e) => e.crcOk && e.method === 0)).toBe(true);
    // Every record is a string, so each local header carries the real size and CRC and no data descriptor follows.
    expect(entries.every((e) => e.flags === 0x0800 && e.descriptor === null && e.localSize === e.size && e.localCrc === e.crc)).toBe(true);
    const by = Object.fromEntries(entries.map((e) => [e.name.replace('that-layover-life/', ''), e]));
    expect(Object.keys(by)).toEqual(['README.txt', 'profile.json', 'stories/stories.json', 'stories/bulgaria.html', 'stories/draft-one.html', 'collections.json', 'collections.csv', 'stamps.json', 'stamps.csv',
      'pets.json', 'companions.json', 'map/map-summary.json', 'map/my-map.json', 'map/countries.csv', 'places-lived.json', 'places-lived.csv', 'photos/index.html', 'photos/photos.csv']);
    expect(textOf(by['README.txt'])).toMatch(/^That Layover Life: your copy\nExported 2026-10-31T12:00:00.000Z\nProfile: https:\/\/www.thatlayover.life\/contributors\/nancy-carleton\n/);
    expect(textOf(by['README.txt'])).toContain('- photos/: index.html and photos.csv, every photo with its link');
    expect(textOf(by['README.txt'])).toContain('- stories/: each story as a page you can open in any browser, plus stories.json (the list of your stories; the text of each story is in its page)\n');
    expect(JSON.parse(textOf(by['profile.json']))).toMatchObject({ name: 'Nancy Carleton', slug: 'nancy-carleton' });
    expect(JSON.parse(textOf(by['profile.json']))['memberstack-id']).toBeUndefined();
    expect(textOf(by['stories/bulgaria.html'])).toContain('<h1>Bulgaria</h1>');
    expect(textOf(by['stories/draft-one.html'])).toContain('<small>Draft</small>');
    // stories.json is compact and names each story's page instead of carrying the body again.
    const storiesJson = textOf(by['stories/stories.json']);
    expect(storiesJson).not.toContain('\n');
    expect(JSON.parse(storiesJson).map((s) => [s.slug, s.page, s.body, s.status])).toEqual([['bulgaria', 'bulgaria.html', undefined, 'published'], ['draft-one', 'draft-one.html', undefined, 'draft']]);
    expect(textOf(by['stories/bulgaria.html'])).toContain('<p>Sofia in May.</p>');
    expect(textOf(by['collections.csv'])).toBe('collection,country,city,year,caption,shownOnProfile,photos\nMagnets,Japan,,,,false,https://evil.example/x.jpg\n');
    expect(JSON.parse(textOf(by['pets.json']))).toEqual([{ name: 'Rex', breed: 'Beagle', countries: '', link: 'https://www.thatlayover.life/pets/rex', role: 'owner' }]);
    expect(JSON.parse(textOf(by['map/my-map.json']))).toEqual({ v: 2, travelers: [{ id: 'me', name: 'Nancy', pet: false }], states: { 208: { me: 'visited' }, 392: { me: 'lived' }, 900: { me: 'layover' } } });
    expect(textOf(by['map/countries.csv'])).toBe('country,code,traveler,mark\nDenmark,DK,Nancy,Stayed\nJapan,JP,Nancy,Lived\nKosovo,XK,Nancy,Layover\n');
    expect(textOf(by['places-lived.csv'])).toBe('country,code,years,placesIKnowWell,homeNow\nDenmark,DK,2019-,,yes\n');
    expect(textOf(by['photos/photos.csv'])).toBe(`folder,name,url\nprofile,avatar,${CDN}/avatar.jpg\nstories/bulgaria,cover,${CDN}/missing.png\nstories/bulgaria,photo-01,https://res.cloudinary.com/idonvlow/image/upload/g1.jpg\ncollections/magnets,japan-1,https://evil.example/x.jpg\n`);
    expect(textOf(by['photos/index.html'])).toContain(`<h2>stories/bulgaria</h2><ul><li><a href="${CDN}/missing.png">cover</a></li>`);
    // No photo bytes pass through the Worker on this route: the records zip costs a handful of subrequests and a few ms of CPU.
    expect(w.fetched).toEqual([]);
  });

  it('a wrong, malformed or expired token is 404, and the Worker never deletes a job itself', async () => {
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
    expect(w.log.filter((l) => l[0] === 'delete')).toHaveLength(0);
    expect((await handleExportZip(new Request(url, { method: 'POST' }), w.env, w.opts())).status).toBe(405);
  });

  it('the link works for the whole 15 minutes and the photo proxy for 60: the zip can be downloaded again, then the link ends while the photos go on', async () => {
    const w = world();
    const { url, token } = await w.prepare({});
    const first = await w.zip(url);
    expect(first.status).toBe(200);
    expect(readZip(await collectBytes(first.body)).length).toBeGreaterThan(10);
    expect(w.kv.has(`export:${token}`)).toBe(true);
    const second = await w.zip(url, NOW + 14 * 60 * 1000);
    expect(second.status).toBe(200);
    expect(readZip(await collectBytes(second.body)).length).toBeGreaterThan(10);
    expect((await w.photo(token, `${CDN}/avatar.jpg`, { now: NOW + 14 * 60 * 1000 })).status).toBe(200);
    expect((await w.zip(url, NOW + 15 * 60 * 1000)).status).toBe(404);
    // The same token keeps the photo proxy open until photoUntil, 60 minutes from prepare.
    expect((await w.photo(token, `${CDN}/avatar.jpg`, { now: NOW + 15 * 60 * 1000 })).status).toBe(200);
    expect((await w.photo(token, `${CDN}/avatar.jpg`, { now: NOW + 59 * 60 * 1000 })).status).toBe(200);
    expect((await w.photo(token, `${CDN}/avatar.jpg`, { now: NOW + 60 * 60 * 1000 })).status).toBe(404);
    // A job written without photoUntil falls back to the link's window.
    w.kv.set(`export:${token}`, { value: JSON.stringify({ memberId: 'mem_a', contributorId: ME, createdAt: NOW, states: null }), ttl: 3600 });
    expect((await w.photo(token, `${CDN}/avatar.jpg`, { now: NOW + 14 * 60 * 1000 })).status).toBe(200);
    expect((await w.photo(token, `${CDN}/avatar.jpg`, { now: NOW + 15 * 60 * 1000 })).status).toBe(404);
    expect(w.log.filter((l) => l[0] === 'delete')).toHaveLength(0);
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

/** An upstream answer whose body records whether it was canceled. */
function upstream({ status = 200, type = 'image/jpeg', bytes = AVATAR, url = '' } = {}) {
  const canceled = [];
  const body = new ReadableStream({ start(c) { c.enqueue(bytes); c.close(); }, cancel(reason) { canceled.push(reason ?? 'canceled'); } });
  const headers = new Headers(); if (type) headers.set('content-type', type);
  return { response: { status, ok: status >= 200 && status < 300, url, headers, body }, canceled };
}

describe('GET /export/photo', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('passes one photo through from a CMS host, with CORS for the site origin and no caching', async () => {
    const w = world();
    const { token } = await w.prepare({});
    const res = await w.photo(token, `${CDN}/avatar.jpg`);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/jpeg');
    expect(res.headers.get('Cache-Control')).toBe('private, no-store');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(SITE);
    expect(res.headers.get('Vary')).toBe('Origin');
    expect(Array.from(await collectBytes(res.body))).toEqual(Array.from(AVATAR));
    expect(w.fetched).toHaveLength(1);
    expect(w.fetched[0].init).toMatchObject({ redirect: 'follow', headers: { Accept: 'image/*' } });
    expect(w.fetched[0].init.signal).toBeInstanceOf(AbortSignal);
    expect(w.kv.has(`export:${token}`)).toBe(true);
    // The token still gates it, so another origin gets no Allow-Origin header and the bytes stay unreadable to its page.
    const other = await w.photo(token, `${CDN}/avatar.jpg`, { origin: 'https://elsewhere.example' });
    expect(other.status).toBe(200);
    expect(other.headers.get('Access-Control-Allow-Origin')).toBeNull();
    const preflight = await w.photo(token, `${CDN}/avatar.jpg`, { method: 'OPTIONS' });
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
    expect((await w.photo(token, `${CDN}/avatar.jpg`, { method: 'POST' })).status).toBe(405);
  });

  it('refuses without a live token, off the CMS hosts, and when the answer is an error, an unfollowed redirect, another host or not an image', async () => {
    const w = world();
    const { token } = await w.prepare({});
    expect((await w.photo(null, `${CDN}/avatar.jpg`)).status).toBe(404);
    expect((await w.photo('f'.repeat(32), `${CDN}/avatar.jpg`)).status).toBe(404);
    expect((await w.photo(token, `${CDN}/avatar.jpg`, { now: NOW + 60 * 60 * 1000 })).status).toBe(404);
    expect((await w.photo(token, 'https://evil.example/x.jpg')).status).toBe(400);
    expect((await w.photo(token, 'http://cdn.prod.website-files.com/avatar.jpg')).status).toBe(400);
    expect((await w.photo(token, 'https://notwebsite-files.com/avatar.jpg')).status).toBe(400);
    expect((await w.photo(token, null)).status).toBe(400);
    expect((await w.photo(token, `${CDN}/missing.png`)).status).toBe(502);
    expect(w.fetched.map((f) => f.url)).toEqual([`${CDN}/missing.png`]);
    for (const [name, up] of [
      ['unfollowed redirect', upstream({ status: 302, type: null, bytes: new Uint8Array(0) })],
      ['another host', upstream({ url: 'https://evil.example/moved.jpg' })],
      ['not an image', upstream({ type: 'text/html' })],
      ['no content type', upstream({ type: null })],
    ]) {
      const res = await w.photo(token, `${CDN}/avatar.jpg`, { fetchImpl: async () => up.response });
      expect([name, res.status]).toEqual([name, 502]);
      expect([name, res.headers.get('Access-Control-Allow-Origin')]).toEqual([name, SITE]);
      // The upstream body is canceled, never left to drain.
      expect([name, up.canceled.length]).toEqual([name, 1]);
    }
    // Redirects are followed: a legacy host that lands on the CDN is fine, the second host check is what refused evil.example above.
    const fine = upstream({ url: 'https://cdn.prod.website-files.com/avatar.jpg' });
    expect((await w.photo(token, 'https://uploads-ssl.webflow.com/avatar.jpg', { fetchImpl: async () => fine.response })).status).toBe(200);
    expect(fine.canceled).toHaveLength(0);
  });

  it('times only the wait for headers: 20 s without them is 504, and once they arrive the body may take as long as it takes', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const w = world();
    const { token } = await w.prepare({});
    // Headers never come: the signal fires at 20 s and the answer is 504.
    const slow = (url, init) => new Promise((resolve, reject) => { init.signal.addEventListener('abort', () => reject(new Error('aborted'))); });
    const pending = w.photo(token, `${CDN}/avatar.jpg`, { fetchImpl: slow });
    await vi.advanceTimersByTimeAsync(PHOTO_HEADER_TIMEOUT_MS);
    expect((await pending).status).toBe(504);
    // Headers come at once, then a body that is read slowly: the timer is cleared, so the signal never fires.
    let signal = null;
    let push = null;
    const body = new ReadableStream({ start(c) { push = () => { c.enqueue(AVATAR); c.close(); }; } });
    const quick = async (url, init) => { signal = init.signal; return { status: 200, ok: true, url: '', headers: new Headers({ 'content-type': 'image/png' }), body }; };
    const res = await w.photo(token, `${CDN}/avatar.jpg`, { fetchImpl: quick });
    expect(res.status).toBe(200);
    await vi.advanceTimersByTimeAsync(PHOTO_HEADER_TIMEOUT_MS * 3);
    expect(signal.aborted).toBe(false);
    push();
    expect(Array.from(await collectBytes(res.body))).toEqual(Array.from(AVATAR));
  });
});
