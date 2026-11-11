// tll-intake-v1 (the submit and share-photos chunks) is a browser script, so this test runs its source against a small stand-in
// for window and document (11 Nov 2026, Nancy: photo submissions land as Draft and only approved photos ever show).
// The photo hold: while HOLD_PHOTOS is true a photo send on /share-photos is not posted to the Worker, because the Worker that
// is live would publish each photo at once. The member reads the page's own done box, which already says a person looks at
// every photo first; the layer adds "Saved. It is with the editor." only when that sentence is missing. Stories and link-outs
// are posted as before. With the hold off the page posts photos again and still says nothing more, whatever the Worker answers.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const layers = join(here, '..', 'src', 'site-layers');
const src = readFileSync(join(layers, 'tll-intake-v1.js'), 'utf8');
const HOLD_ON = 'var HOLD_PHOTOS=true;';
const holdOff = src.replace(HOLD_ON, 'var HOLD_PHOTOS=false;');

const API = 'https://tll-travel-wire.thatlayoverlife.workers.dev/intake';
const SAVED = 'Saved. It is with the editor.';
// The two done boxes as served on www on 11 Nov 2026.
const PHOTOS_DONE = 'Got them. A human looks at every photo before it goes up, so give us a little time. Changed your mind? Write to hello@thatlayover.life and we take it down, before or after it is published.';
const STORY_DONE = 'Got it. Your story is with the editor.';

function node(tag) {
  const n = { tag, className: '', own: '', children: [], attrs: {}, parent: null,
    get textContent() { return n.own + n.children.map((c) => c.textContent).join(''); },
    set textContent(v) { n.own = String(v); n.children = []; },
    get innerHTML() { return n.textContent; },
    set innerHTML(v) { n.own = String(v); n.children = []; },
    appendChild(c) { c.parent = n; n.children.push(c); return c; },
    remove() { if (n.parent) n.parent.children = n.parent.children.filter((c) => c !== n); n.parent = null; },
    setAttribute(k, v) { n.attrs[k] = v; }, addEventListener() {}, insertAdjacentElement() {} };
  return n;
}
const input = (name, value, extra = {}) => ({ name, value, type: 'text', ...extra });

// One form inside its .w-form wrapper, with Webflow's done box hidden until the form is accepted.
function page(kind, doneText) {
  const done = node('div'); done.own = doneText; done.display = 'none';
  const elements = kind === 'photos'
    ? [input('photos', 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/abc.jpg', { type: 'hidden' }), input('country', 'Bulgaria'), input('city', 'Sofia'),
      input('credit-mode', 'named', { type: 'radio', checked: true }), input('agree-rights', 'on', { type: 'checkbox', checked: true })]
    : kind === 'linkout' ? [input('Field 5', 'A piece elsewhere'), input('external-url', 'https://example.com/a')]
      : [input('name', 'A title'), input('body', 'One line that ends.')];
  const has = { photos: [], linkout: ['[name="external-url"]'], story: ['textarea[name="body"]'] }[kind];
  const form = { elements, matches: (sel) => kind === 'photos' && sel === '[data-tll-form="share-photos"]',
    querySelector: (sel) => (has.includes(sel) ? node('x') : null),
    closest: (sel) => (sel === '.w-form' ? { querySelector: (s) => (s === '.w-form-done' ? done : null) } : null) };
  return { form, done };
}

function run(pathname, { kind, doneText, source = src, token = 'tok_1', answer = { status: 200, body: { saved: true, held: true } }, fail = false } = {}) {
  const { form, done } = page(kind, doneText);
  const calls = []; const observers = []; const pending = [];
  const document = { readyState: 'complete', head: node('head'), getElementById: () => null, createElement: (t) => node(t),
    createTextNode: (t) => { const n = node('#text'); n.own = String(t); return n; }, addEventListener() {}, querySelectorAll: (sel) => (sel === 'form' ? [form] : []) };
  const window = { $memberstackDom: { getMemberCookie: () => token } };
  const fetch = (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    const p = fail ? Promise.reject(new Error('offline')) : Promise.resolve({ ok: answer.status >= 200 && answer.status < 300, json: () => Promise.resolve(answer.body) });
    pending.push(p.catch(() => {})); return p;
  };
  function MutationObserver(cb) { this.observe = () => observers.push(cb); }
  new Function('window', 'document', 'location', 'setTimeout', 'MutationObserver', 'getComputedStyle', 'fetch', source)(
    window, document, { pathname }, () => {}, MutationObserver, (el) => ({ display: el.display }), fetch);
  // Webflow accepted the form: its done box shows. Then let every promise settle.
  const accept = async () => { done.display = 'block'; observers.forEach((cb) => cb()); observers.forEach((cb) => cb()); await Promise.all(pending); for (let i = 0; i < 6; i += 1) await Promise.resolve(); };
  const added = () => done.children.map((c) => c.textContent);
  return { calls, done, accept, added, observers };
}

describe('tll-intake-v1: the photo hold (HOLD_PHOTOS)', () => {
  it('is on in the source, and the old line about the Lounge is gone from it', () => {
    expect(src).toContain(HOLD_ON);
    expect(holdOff).not.toBe(src);
    expect(src).not.toMatch(/photos are in the Lounge|See them|Setting it up on the site/);
  });

  it('photos are not posted to the Worker while the hold is on, and the page adds nothing to its own promise', async () => {
    const r = run('/share-photos', { kind: 'photos', doneText: PHOTOS_DONE });
    expect(r.observers).toHaveLength(1);
    await r.accept();
    expect(r.calls).toEqual([]);
    expect(r.added()).toEqual([]);
    expect(r.done.textContent).toBe(PHOTOS_DONE);
  });

  it('adds the one saved line when the done box does not already say a person looks first', async () => {
    const r = run('/share-photos/', { kind: 'photos', doneText: 'Got them.' });
    await r.accept();
    expect(r.calls).toEqual([]);
    expect(r.added()).toEqual([SAVED]);
  });

  it('the hold does not depend on the sign-in: with or without a token nothing is posted', async () => {
    for (const token of ['tok_1', '']) {
      const r = run('/share-photos', { kind: 'photos', doneText: 'Got them.', token });
      await r.accept();
      expect([r.calls.length, r.added()]).toEqual([0, [SAVED]]);
    }
  });

  it('nothing happens before Webflow has accepted the form', () => {
    const r = run('/share-photos', { kind: 'photos', doneText: 'Got them.' });
    r.observers.forEach((cb) => cb());
    expect([r.calls.length, r.added()]).toEqual([0, []]);
  });
});

describe('tll-intake-v1: stories and link-outs are untouched by the hold', () => {
  it('a story is still posted once, with the member token and the form fields', async () => {
    const r = run('/submit', { kind: 'story', doneText: STORY_DONE });
    await r.accept();
    expect(r.calls).toHaveLength(1);
    expect(r.calls[0].url).toBe(API);
    expect(r.calls[0].init.method).toBe('POST');
    expect(r.calls[0].init.headers.authorization).toBe('Bearer tok_1');
    expect(r.calls[0].body).toEqual({ kind: 'story', fields: { name: 'A title', body: 'One line that ends.' } });
    expect(r.added()).toEqual([SAVED]); // the Worker answers {saved, held} without ok for a story (src/intake.js)
  });

  it('a story answer with ok and held steps aside, and an older answer with a url keeps its link', async () => {
    const held = run('/submit', { kind: 'story', doneText: STORY_DONE, answer: { status: 200, body: { ok: true, held: true } } });
    await held.accept();
    expect(held.added()).toEqual([]);
    const old = run('/submit', { kind: 'story', doneText: STORY_DONE, answer: { status: 200, body: { ok: true, url: '/stories/a-title' } } });
    await old.accept();
    expect(old.added()).toEqual(['It is live. Read it on the site →']);
  });

  it('a link-out is still posted', async () => {
    const r = run('/submit', { kind: 'linkout', doneText: STORY_DONE });
    await r.accept();
    expect(r.calls.map((c) => c.body.kind)).toEqual(['linkout']);
  });

  it('a story the Worker could not set up, or a lost connection, reads the saved line', async () => {
    const a = run('/submit', { kind: 'story', doneText: STORY_DONE, answer: { status: 502, body: { error: 'x' } } });
    await a.accept();
    expect(a.added()).toEqual([SAVED]);
    const b = run('/submit', { kind: 'story', doneText: STORY_DONE, fail: true });
    await b.accept();
    expect(b.added()).toEqual([SAVED]);
  });

  it('a story is not posted without a sign-in, as before', async () => {
    const r = run('/submit', { kind: 'story', doneText: STORY_DONE, token: '' });
    await r.accept();
    expect([r.calls.length, r.added()]).toEqual([0, []]);
  });

  it('does nothing on other pages', () => {
    const r = run('/gallery', { kind: 'photos', doneText: PHOTOS_DONE });
    expect(r.observers).toHaveLength(0);
  });
});

describe('tll-intake-v1: when the hold is later switched off', () => {
  // Every answer a Worker can give: the one live on 11 Nov (ok, published), the one with the hold (held, no ok), an error, no network.
  const answers = [
    ['old Worker, ok', { answer: { status: 200, body: { ok: true, kind: 'photos', ids: ['p1'] } } }],
    ['held', { answer: { status: 200, body: { saved: true, held: true, kind: 'photos', ids: ['p1'] } } }],
    ['held with a url', { answer: { status: 200, body: { ok: true, held: true, url: '/gallery' } } }],
    ['error', { answer: { status: 502, body: { error: 'Saved, and we will set it up by hand.' } } }],
    ['no network', { fail: true }],
  ];

  it('posts the photos again, once, with the token and the fields', async () => {
    const r = run('/share-photos', { kind: 'photos', doneText: PHOTOS_DONE, source: holdOff });
    await r.accept();
    expect(r.calls).toHaveLength(1);
    expect(r.calls[0].url).toBe(API);
    expect(r.calls[0].init.headers.authorization).toBe('Bearer tok_1');
    expect(r.calls[0].body.kind).toBe('photos');
    expect(r.calls[0].body.fields).toEqual({ photos: 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/abc.jpg', country: 'Bulgaria', city: 'Sofia', 'credit-mode': 'named', 'agree-rights': 'true' });
  });

  it('shows nothing more than the page promise, whatever the Worker answers', async () => {
    for (const [label, opts] of answers) {
      const r = run('/share-photos', { kind: 'photos', doneText: PHOTOS_DONE, source: holdOff, ...opts });
      await r.accept();
      expect([label, r.added(), r.done.textContent]).toEqual([label, [], PHOTOS_DONE]);
    }
  });

  it('shows nothing more than the saved line when the page promise is missing, and never says the photos are on the site', async () => {
    for (const [label, opts] of answers) {
      const r = run('/share-photos', { kind: 'photos', doneText: 'Got them.', source: holdOff, ...opts });
      await r.accept();
      expect([label, r.added()]).toEqual([label, [SAVED]]);
      expect(r.done.textContent).not.toMatch(/Lounge|live|gallery|See them/i);
    }
  });

  it('without a sign-in nothing is posted and the saved line still stands', async () => {
    const r = run('/share-photos', { kind: 'photos', doneText: 'Got them.', source: holdOff, token: '' });
    await r.accept();
    expect([r.calls.length, r.added()]).toEqual([0, [SAVED]]);
  });
});

describe('tll-intake-v1: the built chunks carry the hold', () => {
  // The chunks are what a release serves. Rebuild with python3 src/site-layers/build-site-layers-v16.py after any change.
  for (const name of ['share-photos.js', 'submit.js', 'submit-preview.js']) {
    it(`${name} has the hold on and no line about the Lounge`, () => {
      const chunk = readFileSync(join(layers, 'chunks', name), 'utf8');
      expect(chunk).toContain(HOLD_ON);
      expect(chunk).not.toMatch(/photos are in the Lounge|Setting it up on the site/);
    });
  }
});
