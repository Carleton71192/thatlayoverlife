import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildStory, buildLinkout, bodyHtml, storyChecks, fullBody, handleIntake, handleLounge, buildPhoto, photoUrls, photoCredit,
  PHOTO_SOURCE, PHOTO_STAGE_RECEIVED, PHOTO_STAGE_PUBLISHED, PHOTO_REVIEW_PENDING } from '../src/intake.js';
import { OPTION_IDS } from '../src/profile-sync.js';

const roberta = {
  name: 'Unmatchable Pompeii', country: 'Italy', city: 'Pompei', region: 'europe', 'Field 5': 'November 2022',
  excerpt: 'After forty years.', body: 'I waited forty years for Pompeii.\nThe Art of Arriving First\nOk, so there I was.\nTwo Things You Must Never Skip\nFirst: the Villa. Its frescoes are among the most p',
  'hashtag-set': '#Pompeii #Italy', 'reader-question': 'What does it feel like', 'sign-off': 'Elated, Roberta', 'theme-desert-glow': 'true',
  'hero-image': 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/hero-image/abc.jpg',
  'photo-gallery': 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photo-gallery/g1.jpg\nhttps://res.cloudinary.com/idonvlow/image/upload/v1/tll/photo-gallery/g2.jpg',
  'photo-plan': JSON.stringify([{ n: 2, caption: 'The Forum | at 9am', after: 'The Art of Arriving First' }]), 'cover-caption': 'Vesuvius behind', 'syndication-social': 'true', 'agree-charter': 'true',
};

describe('intake: stories', () => {
  it('keeps the writer words, makes headings, maps photos, captions and placement', () => {
    const b = buildStory(roberta, { contributorId: 'c1', slug: 'unmatchable-pompeii', now: Date.UTC(2026, 9, 31) });
    const fd = b.fieldData;
    expect(fd.body).toContain('<h2>The Art of Arriving First</h2>');
    expect(fd.body).toContain('<p>I waited forty years for Pompeii.</p>');
    expect(fd['byline-location']).toBe('POMPEI, ITALY');
    expect(fd['hero-image']).toEqual({ url: roberta['hero-image'], alt: 'Vesuvius behind' });
    expect(fd['photo-gallery'][1].alt).toBe('The Forum | at 9am');
    expect(b.placement).toBe('The Art of Arriving First | g2\nCaption: g2 | The Forum / at 9am');
    expect(fd.status).toBe('c63cc532cbf4f9e4752ec46d3316348a'); // In Review: a human reads it before it goes live (11 Nov 2026)
    expect('commissioned' in fd).toBe(false);
    expect(fd['notes-to-editor']).toMatch(/waits for the editor/);
    expect(fd.syndication).toBe('social');
    expect(b.countryCodes).toEqual(['it']);
  });
  it('flags the cut-off ending, few hashtags and a reader question without ?', () => {
    const c = storyChecks(roberta, fullBody(roberta));
    expect(c.join(' ')).toMatch(/Ends mid-sentence/);
    expect(c.join(' ')).toMatch(/2 hashtags/);
    expect(c.join(' ')).toMatch(/question mark/);
  });
  it('joins body parts and escapes HTML', () => {
    expect(fullBody({ body: 'x', 'body-part-1': 'Hello ', 'body-part-2': 'world.' })).toBe('Hello world.');
    expect(bodyHtml('A <b> & "c".')).toBe('<p>A &lt;b&gt; &amp; &quot;c&quot;.</p>');
  });
  it('sets a link-out up as In Review too, without the retired commissioned field', () => {
    const fd = buildLinkout({ 'Field 5': 'A piece elsewhere', 'external-url': 'https://example.com/a', summary: 'One line.', country: 'Denmark' }, { contributorId: 'c1', slug: 'a-piece-elsewhere', now: Date.UTC(2026, 10, 11), memberName: 'Zain' }).fieldData;
    expect(fd.status).toBe('c63cc532cbf4f9e4752ec46d3316348a');
    expect('commissioned' in fd).toBe(false);
  });
  it('refuses without a signed-in member', async () => {
    const r = await handleIntake(new Request('https://w/intake', { method: 'POST', body: '{}' }), { WEBFLOW_TOKEN: 't', MEMBERSTACK_KEY: 'k', STORIES_COLLECTION_ID: 's' });
    expect(r.status).toBe(401);
  });
});

// 11 Nov 2026 (Nancy: photo submissions land as Draft and only approved photos ever show). Until this change the Worker created
// each member photo as a published item with the member's name in the item name, the slug and the alt text, and GET /lounge
// handed it to the /gallery page within minutes. Everything below is made up: no member's name is in this file.
const MEMBER = 'Ada Example Person';
const PEN = 'Night Heron';
const CREDIT = OPTION_IDS['credit-mode'];
const good = (id) => `https://res.cloudinary.com/idonvlow/image/upload/v1793272640/tll/photos/${id}.jpg`;
const photoFields = (over = {}) => ({
  photos: [good('aaa'), good('bbb')].join('\n'), country: 'Bulgaria', city: 'Sofia', year: '2025', caption: '', 'pets-along': '',
  'credit-mode': 'named', 'syndication-social': 'true', 'syndication-rotation': 'true', 'syndication-press': 'false',
  'agree-rights': 'true', 'agree-licence': 'true', 'agree-people': 'true', ...over,
});
const NOW = Date.UTC(2026, 10, 11, 18, 0, 0);
const BATCH = `b${NOW.toString(36)}`;

// A stand-in for Memberstack and Webflow. Records every call so a test can prove what was and was not asked for.
function world({ profile = { name: MEMBER, 'credit-mode': CREDIT.Full } } = {}) {
  const calls = []; const kv = new Map();
  const env = { WEBFLOW_TOKEN: 't', MEMBERSTACK_KEY: 'k', STORIES_COLLECTION_ID: 'stories', CONTRIBUTORS_COLLECTION_ID: 'people', PHOTO_SUBMISSIONS_COLLECTION_ID: 'photos',
    WIRE_KV: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); } } };
  const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  const fetchImpl = async (url, init = {}) => {
    const method = init.method || 'GET'; const body = init.body ? JSON.parse(init.body) : null;
    calls.push({ url: String(url), method, body });
    if (/\/members\/verify-token$/.test(url)) return json({ data: { id: 'mem_1' } });
    if (/\/collections\/people\/items\?/.test(url)) return json({ items: [{ id: 'c1', fieldData: { 'memberstack-id': 'mem_1', ...profile } }] });
    if (/\/collections\/photos\/items$/.test(url) && method === 'POST') return json({ id: `p${calls.filter((c) => c.method === 'POST' && /\/collections\/photos\/items$/.test(c.url)).length}` });
    return json({ error: 'not expected in this test' }, 500);
  };
  const send = (fields, kind = 'photos') => handleIntake(new Request('https://w/intake', { method: 'POST', headers: { Authorization: 'Bearer tok' }, body: JSON.stringify({ kind, fields }) }), env, { fetchImpl, now: NOW });
  const created = () => calls.filter((c) => c.method === 'POST' && /\/collections\/photos\/items$/.test(c.url)).map((c) => c.body);
  return { env, calls, kv, send, created };
}

describe('intake: photos wait for the editor (the hold)', () => {
  it('creates each photo as a draft and never publishes it', async () => {
    const w = world();
    const r = await w.send(photoFields());
    expect(r.status).toBe(200);
    const made = w.created();
    expect(made).toHaveLength(2);
    made.forEach((b) => { expect(b.isDraft).toBe(true); expect(b.isArchived).toBe(false); });
    expect(w.calls.filter((c) => /publish/.test(c.url))).toEqual([]);
    expect(w.calls.filter((c) => /\/live/.test(c.url))).toEqual([]);
  });

  it('answers held:true without ok, so the page that is live prints its plain saved line and not the old one', async () => {
    const w = world();
    const j = await (await w.send(photoFields())).json();
    expect(j).toEqual({ saved: true, held: true, kind: 'photos', ids: ['p1', 'p2'] });
    expect('ok' in j).toBe(false);
    expect('url' in j).toBe(false);
  });

  it('marks the photo as waiting for review and sets no gallery date', async () => {
    const w = world(); await w.send(photoFields());
    const fd = w.created()[0].fieldData;
    expect(fd['moderation-stage']).toBe(PHOTO_STAGE_RECEIVED);
    expect(fd['moderation-stage']).toBe('40172504257c7cf7b75f51cc09adf798'); // "Received" in the collection schema
    expect(fd['moderation-stage']).not.toBe(PHOTO_STAGE_PUBLISHED);
    expect(fd['review-status']).toBe('pending');
    expect(PHOTO_REVIEW_PENDING).toBe('pending');
    expect('gallery-published-at' in fd).toBe(false);
  });

  it('keeps every other field name the collection already gets', async () => {
    const w = world(); await w.send(photoFields({ caption: 'The tram at dusk.', 'pets-along': 'Waffles' }));
    const fd = w.created()[1].fieldData;
    expect(Object.keys(fd).sort()).toEqual(['batch-id', 'caption', 'city', 'consent-recorded-at', 'contributor-credit', 'contributor-profile', 'country', 'credit-preference',
      'gallery-opt-in', 'license-accepted', 'moderation-stage', 'name', 'people-consent-confirmed', 'pet-names', 'photo', 'press-interest-opt-in', 'review-status',
      'rights-confirmed', 'slug', 'social-opt-in', 'submitted-at', 'uploader-member-id', 'year']);
    expect(fd).toMatchObject({ country: 'Bulgaria', city: 'Sofia', year: 2025, caption: 'The tram at dusk.', 'pet-names': 'Waffles', 'batch-id': BATCH, 'gallery-opt-in': true,
      'rights-confirmed': true, 'license-accepted': true, 'people-consent-confirmed': true, 'uploader-member-id': 'mem_1', 'contributor-profile': 'c1',
      'submitted-at': new Date(NOW).toISOString(), 'consent-recorded-at': new Date(NOW).toISOString() });
    expect(fd.photo).toEqual({ url: good('bbb'), alt: 'The tram at dusk.' });
  });

  it('never puts the member name in the item name, the slug or the alt text', async () => {
    const w = world(); await w.send(photoFields());
    const made = w.created().map((b) => b.fieldData);
    expect(made.map((f) => [f.name, f.slug, f.photo.alt])).toEqual([
      [`Sofia, Bulgaria · ${BATCH} · 1`, `sofia-bulgaria-${BATCH}-1`, 'Sofia, Bulgaria'],
      [`Sofia, Bulgaria · ${BATCH} · 2`, `sofia-bulgaria-${BATCH}-2`, 'Sofia, Bulgaria'],
    ]);
    for (const f of made) for (const word of MEMBER.toLowerCase().split(' ')) expect(`${f.name} ${f.slug} ${f.photo.alt}`.toLowerCase()).not.toContain(word);
  });

  it('a long place cannot push the batch and the number out of the slug, and no place still gives a slug', () => {
    const at = { batch: BATCH, now: NOW, memberId: 'mem_1', contributor: { id: 'c1', fieldData: { name: MEMBER } } };
    const long = { city: 'San Pedro de Atacama and the long road beyond the salt flats', country: 'The Plurinational State of Bolivia and Chile' };
    const a = buildPhoto(long, { ...at, url: good('a'), index: 0 }); const b = buildPhoto(long, { ...at, url: good('b'), index: 29 });
    expect(a.slug.endsWith(`-${BATCH}-1`)).toBe(true); expect(b.slug.endsWith(`-${BATCH}-30`)).toBe(true);
    expect(a.slug).not.toBe(b.slug); expect(a.slug.length).toBeLessThanOrEqual(60); expect(a.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    const none = buildPhoto({}, { ...at, url: good('c'), index: 0 });
    expect([none.name, none.slug, none.photo.alt]).toEqual([`Photo · ${BATCH} · 1`, `photo-${BATCH}-1`, 'Photo']);
  });

  it('records social-opt-in false even when the box arrives ticked (it is served ticked, so a tick proves nothing)', async () => {
    const w = world(); await w.send(photoFields({ 'syndication-social': 'true', 'syndication-press': 'true' }));
    const fd = w.created()[0].fieldData;
    expect(fd['social-opt-in']).toBe(false);
    expect(fd['press-interest-opt-in']).toBe(true); // served unticked, so this tick is the member's own
  });

  it('refuses when a promise is not ticked, before anything is created', async () => {
    for (const k of ['agree-rights', 'agree-licence', 'agree-people']) {
      const w = world(); const r = await w.send(photoFields({ [k]: 'false' }));
      expect(r.status).toBe(400); expect(w.created()).toEqual([]);
    }
  });

  it('writes held:true to the day log', async () => {
    const w = world(); await w.send(photoFields());
    const log = JSON.parse(w.kv.get('intake:2026-11-11'));
    expect(log).toHaveLength(1);
    expect(log[0]).toMatchObject({ kind: 'photos', held: true, ids: ['p1', 'p2'], place: 'Sofia, Bulgaria' });
  });

  it('the Worker source has no create-and-publish path left', () => {
    const source = readFileSync(fileURLToPath(new URL('../src/intake.js', import.meta.url)), 'utf8');
    expect(source).not.toMatch(/isDraft:\s*false/);
    expect(source).not.toMatch(/items\/publish/);
    expect(source).not.toMatch(/createPublished\(/);
  });
});

describe('intake: photo links only from the site upload folder', () => {
  it('names the cloud and folder the /share-photos send script uploads to, in one constant', () => {
    expect(PHOTO_SOURCE).toEqual({ cloud: 'idonvlow', folder: 'tll/photos' });
    const script = readFileSync(fileURLToPath(new URL('../src/pages/share-photos/v3/tll-photo-send-v1.js', import.meta.url)), 'utf8');
    expect(script).toContain(`https://api.cloudinary.com/v1_1/${PHOTO_SOURCE.cloud}/image/upload`);
    expect(script).toContain(`FOLDER='${PHOTO_SOURCE.folder}'`);
  });

  it('accepts the link Cloudinary returns for an upload', () => {
    expect(photoUrls(`${good('ywf3bmqjzsjnwe0jaonw')}\n${good('a_b-C9').replace('.jpg', '.webp')}, ${good('x').replace('.jpg', '.png')}`)).toHaveLength(3);
    expect(photoUrls('https://res.cloudinary.com/idonvlow/image/upload/tll/photos/abc.jpeg')).toHaveLength(1);
    expect(photoUrls(`${good('same')}\n${good('same')}`)).toEqual([good('same')]);
  });

  it('refuses every other cloud, folder, host, transformation and trick', () => {
    const bad = [
      'https://res.cloudinary.com/someone-else/image/upload/v1/tll/photos/a.jpg', // another cloud
      'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/hero-image/a.jpg', // another folder
      'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/sub/a.jpg', // a folder inside it
      'https://res.cloudinary.com/idonvlow/image/upload/v1/other/tll/photos/a.jpg',
      'https://res.cloudinary.com/idonvlow/image/upload/l_text:Arial_80:hello/v1/tll/photos/a.jpg', // a transformation
      'https://res.cloudinary.com/idonvlow/image/fetch/https://example.com/tll/photos/a.jpg', // a fetched image
      'https://res.cloudinary.com/idonvlow/video/upload/v1/tll/photos/a.jpg',
      'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/a.jpg?x=1', 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/a.jpg#x',
      'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/a.svg', 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/a.gif',
      'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/../../x/a.jpg', 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/a%2Fb.jpg',
      'http://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/a.jpg', 'https://res.cloudinary.com.example.com/idonvlow/image/upload/v1/tll/photos/a.jpg',
      'https://example.com/?u=https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/a.jpg', 'https://RES.CLOUDINARY.COM/IDONVLOW/image/upload/v1/tll/photos/a.jpg',
      'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/a.jpg https://example.com/b.jpg', '',
    ];
    for (const u of bad) expect([u, photoUrls(u)]).toEqual([u, []]);
  });

  it('answers 400 and creates nothing when no link is from the folder; a mixed list keeps only the good ones', async () => {
    const w = world();
    const r = await w.send(photoFields({ photos: 'https://res.cloudinary.com/someone-else/image/upload/v1/tll/photos/a.jpg' }));
    expect(r.status).toBe(400); expect(w.created()).toEqual([]);
    const m = world();
    await m.send(photoFields({ photos: `https://res.cloudinary.com/someone-else/image/upload/v1/tll/photos/a.jpg\n${good('kept')}\nhttps://example.com/x.jpg` }));
    expect(m.created().map((b) => b.fieldData.photo.url)).toEqual([good('kept')]);
  });

  it('takes 30 photos at most', async () => {
    const w = world(); await w.send(photoFields({ photos: Array.from({ length: 34 }, (_, i) => good(`n${i}`)).join('\n') }));
    expect(w.created()).toHaveLength(30);
  });
});

describe('intake: the photo credit follows the member byline rule', () => {
  const full = { name: MEMBER, 'credit-mode': CREDIT.Full }; const first = { name: MEMBER, 'credit-mode': CREDIT.First };
  const pen = { name: MEMBER, 'credit-mode': CREDIT.Pen, 'pen-name': PEN }; const penEmpty = { name: MEMBER, 'credit-mode': CREDIT.Pen };
  it('Full gives the full name, First the first name, Pen the pen name', () => {
    expect(photoCredit(full, 'named')).toBe(MEMBER);
    expect(photoCredit(first, 'named')).toBe('Ada');
    expect(photoCredit(pen, 'named')).toBe(PEN);
    expect(photoCredit({ name: MEMBER }, 'named')).toBe(MEMBER); // an older profile without the option: its byline is the name
  });
  it('never the record name when the member chose otherwise', () => {
    expect(photoCredit(penEmpty, 'named')).toBe(null); // Pen on the profile, no pen name yet: no credit
    expect(photoCredit(full, 'pen-name')).toBe(null); // "Pen name only" on the form, none on the profile: no credit
    expect(photoCredit({ ...full, 'pen-name': PEN }, 'pen-name')).toBe(PEN);
    expect(photoCredit(first, 'pen-name')).toBe(null);
    for (const p of [full, first, pen, penEmpty]) expect(photoCredit(p, 'anonymous')).toBe(null);
    expect(photoCredit(pen, '')).toBe(PEN); expect(photoCredit(first, '')).toBe('Ada');
    expect(photoCredit(undefined, 'named')).toBe(null);
  });
  it('is what the draft item carries, with the choice recorded as it arrived', async () => {
    const cases = [[pen, 'named', PEN, 'named'], [first, 'named', 'Ada', 'named'], [full, 'anonymous', null, 'anonymous'], [full, 'pen-name', null, 'pen-name'], [first, undefined, 'Ada', 'not chosen']];
    for (const [profile, choice, credit, pref] of cases) {
      const w = world({ profile }); const f = photoFields(); if (choice === undefined) delete f['credit-mode']; else f['credit-mode'] = choice;
      await w.send(f);
      const fd = w.created()[0].fieldData;
      expect([fd['contributor-credit'], fd['credit-preference']]).toEqual([credit, pref]);
      if (credit !== MEMBER) expect(JSON.stringify(fd)).not.toContain('Example');
    }
  });
});

describe('GET /lounge answers an empty list', () => {
  it('returns no photo, reads nothing, and still answers the site origins', async () => {
    const realFetch = globalThis.fetch; let asked = 0; globalThis.fetch = async () => { asked += 1; return new Response('{}'); };
    try {
      const env = { WEBFLOW_TOKEN: 't', PHOTO_SUBMISSIONS_COLLECTION_ID: 'photos' };
      const r = await handleLounge(new Request('https://w/lounge', { headers: { Origin: 'https://www.thatlayover.life' } }), env);
      expect(r.status).toBe(200);
      expect(await r.text()).toBe('{"photos":[],"held":true}'); // held marks the Worker with the hold: the one before it also answered an empty list
      expect(r.headers.get('Access-Control-Allow-Origin')).toBe('https://www.thatlayover.life');
      expect(r.headers.get('Cache-Control')).toBe('no-store');
      expect(await (await handleLounge(new Request('https://w/lounge'), {})).json()).toEqual({ photos: [], held: true });
      expect(asked).toBe(0);
    } finally { globalThis.fetch = realFetch; }
  });
});
