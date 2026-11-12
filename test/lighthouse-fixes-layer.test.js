// 10 Nov 2026 Lighthouse baseline fixes in the site layers (accessibility, SEO, best practices on home, a story and /the-map).
// The layers are browser scripts, so these tests read their sources and run them against small stand-ins for window and document:
//   tll-pwa-hold-v1         the footer PWA client's HEAD /sw.js is answered locally (404, no network) until the PWA Worker is live
//   tll-pros-v1, -series-v1 no request to the Worker routes that do not exist yet (/pros, /series, /series/story)
//   tll-redesign-p0-v1      the Coming soon tiles on the home Expats block are <div>s, not links without an href
//   tll-mag-story-v1        the story container takes role="main" when the template has no main
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const LAYERS = join('src', 'site-layers');
const flush = () => new Promise((r) => setTimeout(r, 0));

function runLayer(src, { href = 'https://www.thatlayover.life/', storage = {}, fetchImpl, document } = {}) {
  const u = new URL(href);
  const calls = [];
  const fetch = vi.fn((input) => { calls.push(typeof input === 'string' ? input : input.url); return fetchImpl ? fetchImpl(input) : Promise.resolve({ ok: false, json: () => Promise.resolve(null) }); });
  const win = {
    location: { href, origin: u.origin, pathname: u.pathname, search: u.search, hostname: u.hostname },
    localStorage: { getItem: (k) => (k in storage ? storage[k] : null), setItem() {}, key: () => null, length: 0 },
    fetch, Response, URL, Promise, String, Object, Array, RegExp, JSON, encodeURIComponent,
    setTimeout: (fn) => { fn(); return 0; },
    document: document || { readyState: 'complete', addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, head: { appendChild() {} } },
  };
  win.window = win;
  vm.runInNewContext(src, win);
  return { win, fetch, calls };
}

describe('tll-pwa-hold-v1: no /sw.js request until the PWA exists', () => {
  const src = read(LAYERS, 'tll-pwa-hold-v1.js');

  it('answers HEAD /sw.js with a 404 of its own and never calls the network', async () => {
    const { win, fetch } = runLayer(src);
    const r = await win.fetch('/sw.js', { method: 'HEAD', cache: 'no-store' });
    expect(r.status).toBe(404);
    expect(r.ok).toBe(false);
    const r2 = await win.fetch('https://www.thatlayover.life/sw.js');
    expect(r2.status).toBe(404);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('passes every other request through untouched, other hosts included', async () => {
    const { win, calls } = runLayer(src);
    await win.fetch('/sw.json');
    await win.fetch('https://tll-travel-wire.thatlayoverlife.workers.dev/sw.js');
    await win.fetch({ url: 'https://www.thatlayover.life/manifest.webmanifest' });
    expect(calls).toEqual(['/sw.json', 'https://tll-travel-wire.thatlayoverlife.workers.dev/sw.js', 'https://www.thatlayover.life/manifest.webmanifest']);
  });

  it('steps aside under ?preview=pwa, the tll-preview-pwa key, or once PWA_LIVE is true', () => {
    const orig = (o) => runLayer(src, o);
    for (const o of [{ href: 'https://www.thatlayover.life/?preview=pwa' }, { storage: { 'tll-preview-pwa': '1' } }]) {
      const { win, fetch } = orig(o);
      expect(win.fetch).toBe(fetch);
    }
    const live = runLayer(src.replace('var PWA_LIVE=false', 'var PWA_LIVE=true'));
    expect(live.win.fetch).toBe(live.fetch);
  });

  it('registers no service worker of its own', () => {
    expect(src.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/serviceWorker|register\(/);
  });
});

describe('tll-pros-v1 and tll-series-v1: no request to Worker routes that are not deployed', () => {
  const pros = read(LAYERS, 'tll-pros-v1.js');
  // 12 Nov 2026: the series layer takes el, style and its GET helper from window.__tllUI, which the core defines before any chunk runs,
  // so the stand-in runs the core helper layer first, as the site does.
  const series = read(LAYERS, 'tll-components-v1.js') + read(LAYERS, 'tll-series-v1.js');
  const story ='https://www.thatlayover.life/stories/luxembourg-schengen-road-trip';

  it('a story page sends nothing to /pros or /series/story while the routes are off', async () => {
    for (const src of [pros, series]) {
      const { fetch } = runLayer(src, { href: story });
      await flush();
      expect(fetch).not.toHaveBeenCalled();
    }
    for (const href of ['https://www.thatlayover.life/stories', 'https://www.thatlayover.life/countries/denmark', 'https://www.thatlayover.life/contributors/jane']) {
      const a = runLayer(series, { href }), b = runLayer(pros, { href });
      await flush();
      expect(a.fetch).not.toHaveBeenCalled();
      expect(b.fetch).not.toHaveBeenCalled();
    }
  });

  it('?preview=wire or the tll-preview-wire key still calls the routes for testing', async () => {
    const a = runLayer(pros, { href: story + '?preview=wire' });
    const b = runLayer(series, { href: story, storage: { 'tll-preview-wire': '1' } });
    await flush();
    expect(a.calls).toEqual(['https://tll-travel-wire.thatlayoverlife.workers.dev/pros']);
    expect(b.calls).toEqual(['https://tll-travel-wire.thatlayoverlife.workers.dev/series/story?slug=luxembourg-schengen-road-trip']);
  });

  it('flipping the switch turns the calls back on', async () => {
    const a = runLayer(pros.replace('var ROUTE_LIVE=false', 'var ROUTE_LIVE=true'), { href: story });
    const b = runLayer(series.replace('var ROUTES_LIVE=false', 'var ROUTES_LIVE=true'), { href: 'https://www.thatlayover.life/stories' });
    await flush();
    expect(a.calls).toHaveLength(1);
    expect(b.calls).toEqual(['https://tll-travel-wire.thatlayoverlife.workers.dev/series']);
  });
});

// A few DOM nodes, enough for unlink() and the main landmark.
function node(tag, attrs = {}, kids = []) {
  const n = {
    tagName: tag.toUpperCase(), parentNode: null, childNodes: [], _a: { ...attrs },
    get className() { return this._a.class || ''; }, set className(v) { this._a.class = v; },
    get attributes() { return Object.keys(this._a).map((name) => ({ name, value: this._a[name] })); },
    get firstChild() { return this.childNodes[0] || null; },
    getAttribute(k) { return k in this._a ? this._a[k] : null; }, setAttribute(k, v) { this._a[k] = String(v); }, removeAttribute(k) { delete this._a[k]; },
    appendChild(c) { if (c.parentNode) c.parentNode.childNodes.splice(c.parentNode.childNodes.indexOf(c), 1); c.parentNode = this; this.childNodes.push(c); return c; },
    replaceChild(nw, old) { const i = this.childNodes.indexOf(old); this.childNodes[i] = nw; nw.parentNode = this; old.parentNode = null; return old; },
  };
  kids.forEach((k) => n.appendChild(k));
  return n;
}

describe('tll-redesign-p0-v1: Coming soon is shown, not linked', () => {
  const src = read(LAYERS, 'tll-redesign-p0-v1.js');
  const m = /function unlink\(a\)\{[\s\S]*?return d;\}/.exec(src);
  it('unlink() is in the layer', () => expect(m).not.toBeNull());
  const unlink = new Function('document', `${m[0]}; return unlink;`)({ createElement: (t) => node(t) });

  it('turns the tile into a div with the same class, attributes and children, and no link attributes', () => {
    const b = node('b'), strong = node('strong'), span = node('span');
    const a = node('a', { class: 'h3-ex-card tll-rv', href: '/for-expats', 'aria-disabled': 'true', tabindex: '0', target: '_blank', 'data-x': '1', style: 'order:2' }, [b, strong, span]);
    const grid = node('div', { class: 'h3-ex-grid' }, [a]);
    const d = unlink(a);
    expect(d.tagName).toBe('DIV');
    expect(d.className).toBe('h3-ex-card');
    expect(d.getAttribute('href')).toBeNull();
    expect(d.getAttribute('aria-disabled')).toBeNull();
    expect(d.getAttribute('tabindex')).toBeNull();
    expect(d.getAttribute('target')).toBeNull();
    expect(d.getAttribute('data-x')).toBe('1');
    expect(d.getAttribute('style')).toBe('order:2');
    expect(d.childNodes).toEqual([b, strong, span]);
    expect(grid.childNodes).toEqual([d]);
  });

  it('leaves a tile that carries a data-ms-* attribute alone', () => {
    expect(src).toMatch(/!\[\]\.some\.call\(a\.attributes,function\(x\)\{return \/\^data-ms-\/i\.test\(x\.name\);\}\)/);
  });
});

describe('tll-mag-story-v1: one main landmark on story pages', () => {
  const mag = read('src', 'design', 'magazine-2026-10', 'story-build', 'tll-mag-story-v1.html');
  const m = /function main\(\)\{[^\n]*\}\n/.exec(mag);
  it('main() is in the story layer', () => expect(m).not.toBeNull());
  const make = (doc) => new Function('document', `${m[0]}; return main;`)(doc);

  it('gives the story article role="main" when the template has none, without wrapping or moving it', () => {
    const art = node('article', { class: 'tll-story-article' }), body = node('body', {}, [art]);
    make({ querySelector: (s) => (s === 'article.tll-story-article' ? art : null) })();
    expect(art.getAttribute('role')).toBe('main');
    expect(body.childNodes).toEqual([art]);
  });

  it('does nothing when the page already has a main', () => {
    const art = node('article', { class: 'tll-story-article' });
    make({ querySelector: (s) => (s === 'article.tll-story-article' ? art : { tagName: 'MAIN' }) })();
    expect(art.getAttribute('role')).toBeNull();
  });
});

describe('pwa-hold in the built core', () => {
  const core = read(LAYERS, 'tll-site-layers-v16.js');
  it('is in the core', () => {
    expect(core).toContain('/* src/site-layers/tll-pwa-hold-v1.js */');
  });
});

describe('house rules in the new and changed copy', () => {
  const files = [join(LAYERS, 'tll-pwa-hold-v1.js'), join(LAYERS, 'tll-redesign-p0-v1.js'), join(LAYERS, 'tll-pros-v1.js'), join(LAYERS, 'tll-series-v1.js')];
  it('no em dashes, no exclamation marks in copy', () => {
    for (const f of files) {
      const copy = read(f).replace(/\/\*[\s\S]*?\*\//g, '');
      expect(copy, f).not.toMatch(/—/);
      expect(copy, f).not.toMatch(/[A-Za-z]!['"]/);
    }
  });
});
