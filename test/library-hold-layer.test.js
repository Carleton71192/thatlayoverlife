// tll-library-hold-v1 and the early band swap in tll-home-bands-v1 (13 Nov 2026, the home library jump that blocks Nancy's choice 9).
// The hold layer is a browser script, so it runs here against a small stand-in for window and document: the hold is the tallest card
// the library holds (shown or not), it never shrinks while the page is open, it is kept for the tab at the same window width, the pinned
// desktop rail is left alone, and the copies lose their photo addresses before they are put into the page (no photo download).
// The sources and the built core are read too, so a rebuild that drops the layer, or turns N9 on, fails here.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const src = read('src', 'site-layers', 'tll-library-hold-v1.js');
const core = read('src', 'site-layers', 'tll-site-layers-v16.js');

function card(h, { hidden = false, ariaHidden = false, display = '', width = 304 } = {}) {
  return { h, hidden, style: { display }, offsetWidth: hidden ? 0 : width, outerHTML: `<a class="h3-card" data-h="${h}"><img src="x.jpg"></a>`,
    getAttribute: (k) => (k === 'aria-hidden' && ariaHidden ? 'true' : null), getBoundingClientRect: () => ({ width, height: h }) };
}

function page({ path = '/', width = 390, cards = [], pinned = false, stored = null, readyState = 'loading' } = {}) {
  const docListeners = {}; const winListeners = {}; const fontListeners = {};
  const store = {}; if (stored) store['tll-lib-hold-v1'] = JSON.stringify(stored);
  const sessionStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
  const rootStyle = {}; const log = { imported: [], appended: 0, removed: 0, styles: [] };
  const row = { appendChild: (b) => { b.parentNode = row; log.appended++; }, removeChild: () => { log.removed++; } };
  const track = { parentNode: row, querySelectorAll: () => state.cards };
  const sec = { classList: { contains: (c) => c === 'is-pinned' && state.pinned }, querySelector: () => track };
  const state = { cards, pinned };
  const head = { appendChild: (s) => log.styles.push(s) };
  const document = {
    readyState, head, documentElement: { style: { setProperty: (k, v) => { rootStyle[k] = v; }, removeProperty: (k) => { delete rootStyle[k]; } } },
    addEventListener: (t, fn) => { (docListeners[t] = docListeners[t] || []).push(fn); },
    querySelector: (s) => (s === '[data-h3-shelf]' ? sec : null),
    fonts: { addEventListener: (t, fn) => { (fontListeners[t] = fontListeners[t] || []).push(fn); } },
    createElement: (tag) => {
      if (tag === 'template') {
        const t = { content: null };
        Object.defineProperty(t, 'innerHTML', { set(html) {
          const hs = [...html.matchAll(/data-h="(\d+)"/g)].map((m) => +m[1]);
          const imgs = hs.map(() => { const a = { src: 'x.jpg', srcset: 'x-500.jpg 500w', 'data-tll-v': 'x.jpg' }; return { a, removeAttribute: (k) => { delete a[k]; } }; });
          t.content = { hs, imgs, querySelectorAll: (sel) => (sel === 'img,source' ? imgs : []) };
        } });
        return t;
      }
      const el = { style: {}, children: [], setAttribute: () => {}, appendChild(frag) { this.children = frag.nodes; }, textContent: '' };
      return el;
    },
    importNode: (content) => { log.imported.push(content.imgs.map((i) => ({ ...i.a }))); return { nodes: content.hs.map((h) => ({ hidden: true, style: {}, getBoundingClientRect: () => ({ height: h }) })) }; },
  };
  const window = { innerWidth: width, addEventListener: (t, fn) => { (winListeners[t] = winListeners[t] || []).push(fn); } };
  const location = { pathname: path };
  new Function('window', 'document', 'location', 'sessionStorage', 'setTimeout', 'clearTimeout', src)(window, document, location, sessionStorage, (f) => f(), () => {});
  const fire = (t) => (docListeners[t] || []).forEach((f) => f());
  return { fire, rootStyle, store, log, state, fonts: () => (fontListeners.loadingdone || []).forEach((f) => f()), winListeners, window };
}

describe('tll-library-hold-v1 in a stand-in page', () => {
  it('does nothing off the home page', () => {
    const p = page({ path: '/stories', cards: [card(549)] });
    p.fire('h3:stories');
    expect(p.log.styles.length).toBe(0);
    expect(p.rootStyle['--tll-lib-hold']).toBeUndefined();
  });
  it('holds every swipe-row card at the tallest card the library holds, shown or not, from the first draw', () => {
    const p = page({ cards: [card(549), card(569, { hidden: true }), card(504)] });
    expect(p.log.styles.length).toBe(1);
    expect(p.log.styles[0].textContent).toBe('.h3-shelf:not(.is-pinned) [data-h3-track]>.h3-card:not([hidden]):not([aria-hidden="true"]){min-height:var(--tll-lib-hold,0px)}'
      + '@media (max-width:365px){[data-h3-guides] .h3g-title{min-height:calc(2 * 1.04em)}}');
    p.fire('h3:stories');
    expect(p.rootStyle['--tll-lib-hold']).toBe('569px');
    expect(JSON.parse(p.store['tll-lib-hold-v1'])).toEqual({ w: 390, h: 569 });
    expect(p.log.appended).toBe(1); expect(p.log.removed).toBe(1);
  });
  it('leaves out cards a script took out of the rail', () => {
    const p = page({ cards: [card(549), card(700, { hidden: true, ariaHidden: true }), card(650, { hidden: true, display: 'none' })] });
    p.fire('h3:stories');
    expect(p.rootStyle['--tll-lib-hold']).toBe('549px');
  });
  it('never shrinks while the page is open: the feed draw with shorter cards keeps the height, a taller card raises it', () => {
    const p = page({ cards: [card(569), card(549)] });
    p.fire('h3:stories'); expect(p.rootStyle['--tll-lib-hold']).toBe('569px');
    p.state.cards = [card(549), card(504), card(527, { hidden: true })]; p.fire('h3:stories');
    expect(p.rootStyle['--tll-lib-hold']).toBe('569px');
    p.state.cards = [card(549), card(595, { hidden: true })]; p.fonts();
    expect(p.rootStyle['--tll-lib-hold']).toBe('595px');
  });
  it('a reload at the same width starts from the kept height before the first draw; another width ignores it', () => {
    const same = page({ stored: { w: 390, h: 610 }, cards: [card(549)] });
    expect(same.rootStyle['--tll-lib-hold']).toBe('610px');
    same.fire('h3:stories'); expect(same.rootStyle['--tll-lib-hold']).toBe('610px');
    const other = page({ width: 360, stored: { w: 390, h: 610 }, cards: [card(520)] });
    expect(other.rootStyle['--tll-lib-hold']).toBeUndefined();
    other.fire('h3:stories'); expect(other.rootStyle['--tll-lib-hold']).toBe('520px');
  });
  it('leaves the pinned desktop rail alone', () => {
    const p = page({ pinned: true, cards: [card(549), card(700, { hidden: true })] });
    p.fire('h3:stories'); p.fire('DOMContentLoaded');
    expect(p.rootStyle['--tll-lib-hold']).toBeUndefined();
    expect(p.log.appended).toBe(0);
  });
  it('the copies lose their photo addresses before they go into the page, so measuring downloads nothing', () => {
    const p = page({ cards: [card(549), card(569, { hidden: true })] });
    p.fire('h3:stories');
    expect(p.log.imported.length).toBe(1);
    for (const a of p.log.imported[0]) { expect(a.src).toBeUndefined(); expect(a.srcset).toBeUndefined(); expect(a['data-tll-v']).toBeUndefined(); }
  });
  it('starts over after a change of window width', () => {
    const p = page({ cards: [card(569)] });
    p.fire('h3:stories'); expect(p.rootStyle['--tll-lib-hold']).toBe('569px');
    p.window.innerWidth = 360; p.state.cards = [card(540)];
    p.winListeners.resize.forEach((f) => f());
    expect(p.rootStyle['--tll-lib-hold']).toBe('540px');
    expect(JSON.parse(p.store['tll-lib-hold-v1'])).toEqual({ w: 360, h: 540 });
  });
});

describe('tll-library-hold-v1 source and build', () => {
  it('is a core layer, after the image variants layer, and the core carries it once', () => {
    const build = read('src', 'site-layers', 'build-site-layers-v16.py');
    expect(build).toMatch(/'tll-home-bands-v1', ('tll-rail-hold-v1', )?'tll-library-hold-v1',/);
    const at = (n) => core.indexOf(`/* src/site-layers/${n}.js */`);
    expect(at('tll-library-hold-v1')).toBeGreaterThan(at('tll-img-variants-v1'));
    expect(core.split('/* src/site-layers/tll-library-hold-v1.js */').length - 1).toBe(1);
    expect(core.split("var KEY='tll-lib-hold-v1'").length - 1).toBe(1);
  });
  it('listens for every library draw and touches no member, nav, footer or form element', () => {
    expect(src).toMatch(/addEventListener\('h3:stories',safe\)/);
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/data-ms-/);
    expect(code).not.toMatch(/querySelector[^;]*(nav|footer|form)/i);
  });
  it('no em dashes or exclamation marks in its text', () => {
    expect(src).not.toMatch(/—/);
    const comments = (src.match(/\/\*[\s\S]*?\*\//g) || []).join('\n');
    expect(comments).not.toMatch(/!/);
  });
});

describe('N9 stays off in the committed code', () => {
  it('tll-home-value-v1 and the built core keep N9_PHONES_AFTER_LIBRARY false', () => {
    expect(read('src', 'site-layers', 'tll-home-value-v1.js')).toMatch(/^var N9_PHONES_AFTER_LIBRARY=false;$/m);
    expect(core).toMatch(/^var N9_PHONES_AFTER_LIBRARY=false;$/m);
    expect(core).not.toMatch(/N9_PHONES_AFTER_LIBRARY=true/);
  });
});

describe('tll-home-bands-v1 swaps each band before it is painted', () => {
  const bands = read('src', 'site-layers', 'tll-home-bands-v1.js');
  it('waits for the parser to close the figure, swaps from a parse-time observer, keeps the page-parsed fallback', () => {
    expect(bands).toMatch(/function closed\(f\)\{for\(var e=f;e&&e!==document\.body;e=e\.parentNode\)if\(e\.nextSibling\)return true;return false;\}/);
    expect(bands).toMatch(/\(parsing&&!closed\(f\)\)\)return;/);
    expect(bands).toMatch(/new MutationObserver\(/);
    expect(bands).toMatch(/document\.addEventListener\('DOMContentLoaded',swap\);/);
  });
  it('the built core carries the early swap', () => {
    expect(core).toMatch(/function closed\(f\)\{/);
  });
  function run(figs, readyState) {
    // figs: [{ key, closed }]
    const made = figs.map((f) => {
      const attrs = { 'data-h3-il': f.key }; const cap = { textContent: 'old', kids: [], appendChild(a) { this.kids.push(a); } };
      const img = { attrs: {}, removeAttribute() {}, style: {}, set src(v) { this.attrs.src = v; } };
      return { attrs, cap, img, nextSibling: f.closed ? {} : null, parentNode: null, getAttribute: (k) => attrs[k] || null, setAttribute: (k, v) => { attrs[k] = v; },
        querySelector: (s) => (s === 'img' ? img : s === 'figcaption' ? cap : null) };
    });
    const body = {}; made.forEach((m) => { m.parentNode = body; });
    const document = { readyState, body, head: {}, getElementById: () => ({}), addEventListener: () => {},
      querySelector: (s) => { if (s === 'figure.h3-il') return made[0] || null; const m = /data-h3-il="([a-z]+)"/.exec(s); return m ? made.find((x) => x.attrs['data-h3-il'] === m[1]) || null : null; },
      createElement: () => ({ appendChild() {}, set href(v) {} }), createTextNode: (t) => t };
    const location = { pathname: '/' }; const obs = { cb: null, off: false };
    function MO(cb) { obs.cb = cb; this.observe = () => {}; this.disconnect = () => { obs.off = true; }; }
    new Function('window', 'document', 'location', 'MutationObserver', bands)({ MutationObserver: MO }, document, location, MO);
    return { made, obs };
  }
  it('while parsing, a band the parser has not closed yet is left for later; a closed one is swapped at once', () => {
    const { made: [rio, mont], obs } = run([{ key: 'rio', closed: true }, { key: 'montenegro', closed: false }], 'loading');
    expect(rio.attrs['data-tll-band']).toBeUndefined();
    obs.cb();
    expect(rio.attrs['data-tll-band']).toBe('1'); expect(rio.cap.textContent).toBe(''); expect(rio.cap.kids.length).toBe(1);
    expect(mont.attrs['data-tll-band']).toBeUndefined(); expect(mont.cap.textContent).toBe('old'); expect(obs.off).toBe(false);
    mont.nextSibling = {}; obs.cb();
    expect(mont.attrs['data-tll-band']).toBe('1'); expect(obs.off).toBe(true);
  });
  it('once the page is parsed every band is swapped', () => {
    const { made: [rio, mont] } = run([{ key: 'rio', closed: true }, { key: 'montenegro', closed: false }], 'complete');
    expect(rio.attrs['data-tll-band']).toBe('1'); expect(mont.attrs['data-tll-band']).toBe('1');
  });
});
