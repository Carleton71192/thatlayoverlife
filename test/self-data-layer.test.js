// tll-self-data-v1 (core, every page) is a browser script, so this test runs its source against a small stand-in for window and
// document (13 Nov 2026, bandwidth fixes 4 and 5). Fix 4: the footer and head count caches are seeded from the rendered Site stats
// item before any DOMContentLoaded listener, pet country lists come from the rendered Pets item, and without them one shared
// request per page view is made and kept for the visit. Fix 5: on a profile, other members' cards are hidden from the first paint
// and the style comes off after the profile script has matched them.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'site-layers', 'tll-self-data-v1.js'), 'utf8');
const core = readFileSync(join(here, '..', 'src', 'site-layers', 'tll-site-layers-v16.js'), 'utf8');

function el(attrs = {}) {
  return { attrs, getAttribute: (k) => (k in attrs ? attrs[k] : null) };
}

function page(pathname, { elements = {}, store = {}, pages = {} } = {}) {
  const listeners = {}; const fetched = []; const head = [];
  const document = {
    readyState: 'loading',
    addEventListener: (t, fn) => { (listeners[t] = listeners[t] || []).push(fn); },
    removeEventListener: (t, fn) => { listeners[t] = (listeners[t] || []).filter((f) => f !== fn); },
    querySelector: (sel) => {
      for (const [k, v] of Object.entries(elements)) if (sel.includes(k)) return v;
      return null;
    },
    createElement: () => ({ id: '', textContent: '', parentNode: null }),
    head: { appendChild: (n) => { n.parentNode = { removeChild: (x) => { head.splice(head.indexOf(x), 1); x.parentNode = null; } }; head.push(n); } },
  };
  const sessionStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
  const fetch = (path) => { fetched.push(path); const body = pages[path];
    return Promise.resolve({ ok: body != null, status: body != null ? 200 : 404, text: () => Promise.resolve(body || '') }); };
  const window = {};
  new Function('window', 'document', 'location', 'sessionStorage', 'fetch', src)(window, document, { pathname }, sessionStorage, fetch);
  const fire = (t) => (listeners[t] || []).slice().forEach((fn) => fn());
  const parsed = () => { document.readyState = 'interactive'; fire('readystatechange'); };
  return { window, document, store, fetched, head, fire, parsed, listeners };
}

const STATS = el({ 'data-stories': '57', 'data-travelers': '6', 'data-pets': '1', 'data-countries': '54' });
const PET_PAGE = '<script>window.TLL_PET={countries:"Brazil, Germany, Denmark",weight:"35"};</script>';

describe('tll-self-data-v1 site counts (fix 4)', () => {
  it('is in the core build', () => {
    expect(core).toContain('/* src/site-layers/tll-self-data-v1.js */');
    expect(core).toContain('W.tllSelfDoc=doc;');
  });
  it('seeds tllCounts5 and tllStoryN from the rendered Site stats item when the page has been read', () => {
    const p = page('/', { elements: { 'data-tll-site-stats': STATS } });
    expect(p.store.tllCounts5).toBeUndefined();
    p.parsed();
    expect(JSON.parse(p.store.tllCounts5)).toEqual({ p: 1, s: 57, t: 6, c: 54 });
    expect(p.store.tllStoryN).toBe('57');
    expect(p.fetched).toEqual([]);
  });
  it('runs before every DOMContentLoaded listener, including ones registered earlier in the head', () => {
    const p = page('/', { elements: { 'data-tll-site-stats': STATS } });
    let seen = null; p.document.addEventListener('DOMContentLoaded', () => { seen = p.store.tllCounts5; });
    p.parsed(); p.fire('DOMContentLoaded');
    expect(seen).toBe('{"p":1,"s":57,"t":6,"c":54}');
  });
  it('seeds nothing without the element or with a number missing, so the old scripts fetch as before', () => {
    const a = page('/'); a.parsed(); expect(a.store).toEqual({});
    const b = page('/', { elements: { 'data-tll-site-stats': el({ 'data-stories': '57', 'data-travelers': '', 'data-pets': '1', 'data-countries': '54' }) } });
    b.parsed(); expect(b.store).toEqual({});
  });
});

describe('tll-self-data-v1 pet countries (fix 4)', () => {
  it('reads the rendered Pets item and fetches nothing', async () => {
    const p = page('/', { elements: { 'data-tll-pet="magnus-waffles"': el({ 'data-tll-pet-countries': 'Brazil, Germany' }) } });
    const r = p.window.tllPetCountries('magnus-waffles'); p.parsed();
    expect(await r).toBe('Brazil, Germany');
    expect(p.fetched).toEqual([]);
  });
  it('waits for the end of parsing before it falls back, then fetches the pet page once for every caller and keeps the list', async () => {
    const p = page('/', { pages: { '/pets/magnus-waffles': PET_PAGE } });
    const a = p.window.tllPetCountries('magnus-waffles'); const b = p.window.tllPetCountries('magnus-waffles');
    await Promise.resolve(); expect(p.fetched).toEqual([]);
    p.parsed();
    expect(await a).toBe('Brazil, Germany, Denmark'); expect(await b).toBe('Brazil, Germany, Denmark');
    expect(p.fetched).toEqual(['/pets/magnus-waffles']);
    expect(p.store['tllPetC:magnus-waffles']).toBe('Brazil, Germany, Denmark');
  });
  it('uses the list kept earlier in the visit', async () => {
    const p = page('/about', { store: { 'tllPetC:magnus-waffles': 'Brazil' } }); p.parsed();
    expect(await p.window.tllPetCountries('magnus-waffles')).toBe('Brazil');
    expect(p.fetched).toEqual([]);
  });
  it('tllSelfDoc makes one request per path per page view', async () => {
    const p = page('/', { pages: { '/stories': '<html>s</html>' } });
    const [x, y] = await Promise.all([p.window.tllSelfDoc('/stories'), p.window.tllSelfDoc('/stories')]);
    expect(x).toBe('<html>s</html>'); expect(y).toBe(x); expect(p.fetched).toEqual(['/stories']);
    await expect(p.window.tllSelfDoc('/nope')).rejects.toThrow('HTTP 404');
  });
});

describe('tll-self-data-v1 profile cards (fix 5)', () => {
  it('hides other members\' story and pet cards from the first paint on /contributors/{slug}', () => {
    const p = page('/contributors/some-writer');
    expect(p.head).toHaveLength(1);
    expect(p.head[0].id).toBe('tll-pf5-pre-v1');
    expect(p.head[0].textContent).toContain('[data-pf5="story-card"]:not([data-by="some-writer"])');
    expect(p.head[0].textContent).toContain('[data-pf5="pet-card"]:not([data-owner="some-writer"])');
  });
  it('takes the style off after the profile script has matched (its DOMContentLoaded listener comes first)', () => {
    const p = page('/contributors/some-writer'); const order = [];
    p.document.addEventListener('DOMContentLoaded', () => order.push(p.head.length ? 'profile script, style on' : 'profile script, style off'));
    p.parsed(); expect(p.head).toHaveLength(1);
    p.fire('DOMContentLoaded');
    expect(order).toEqual(['profile script, style on']);
    expect(p.head).toHaveLength(0);
  });
  it('adds nothing on other pages or on odd profile addresses', () => {
    expect(page('/stories').head).toHaveLength(0);
    expect(page('/contributors').head).toHaveLength(0);
    expect(page('/contributors/a/b').head).toHaveLength(0);
    expect(page('/contributors/Bad"Slug').head).toHaveLength(0);
  });
});
