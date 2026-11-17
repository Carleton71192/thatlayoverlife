// Layout shift sweep, part A (16 Nov 2026, reports/evidence/cls-sweep-2026-11-16/fix.md), for core release 16.67.0.
// Two things in the core:
//   tll-page-heroes-v1  on /travelers, /the-map, /about and /for-expats the hero photos go in as the parser adds the hero, before the
//                       first paint, instead of at the page-parsed event (cause C2). /stories is unchanged.
//   tll-first-paint-v1  /travelers and /the-map: copies of late page rules in an early head style, the map mount's height held until the
//                       map is drawn, the /travelers title kept at the height of its tallest verb, and stand-ins for what the page
//                       scripts write when the page is parsed (causes C4, C5, C8, C11).
// The layout was measured in a real browser (the fix report). Here both layers run against a small stand-in for the DOM with a parser
// that adds nodes one at a time and tells the observers after each: what goes in when, what is let go when, and that the finished page
// is the one the page-parsed run has always made.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const heroesSrc = read('src', 'site-layers', 'tll-page-heroes-v1.js');
const fpSrc = read('src', 'site-layers', 'tll-first-paint-v1.js');
const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
const build = read('src', 'site-layers', 'build-site-layers-v16.py');

// ---- a small DOM: elements, text, a selector engine for the selectors the two layers use, observers, timers ----
function makeDom({ path = '/', readyState = 'loading', reduced = false, rects = {}, families = {}, fontsLoaded = [] } = {}) {
  const observers = []; const docL = {}; const winL = {}; const timers = []; const fontL = {}; const resizeObs = [];
  let doc;
  const notify = (target) => { observers.filter((o) => o.on && o.sees(target)).forEach((o) => { o.pending = true; }); };
  const flush = () => { for (let k = 0; k < 20; k++) { const p = observers.filter((o) => o.on && o.pending); if (!p.length) return; p.forEach((o) => { o.pending = false; o.cb([]); }); } };
  class Node {
    constructor() { this.parentNode = null; this.childNodes = []; }
    get firstChild() { return this.childNodes[0] || null; }
    get nextSibling() { const p = this.parentNode; if (!p) return null; return p.childNodes[p.childNodes.indexOf(this) + 1] || null; }
    get nextElementSibling() { let n = this.nextSibling; while (n && n.nodeType !== 1) n = n.nextSibling; return n; }
    get previousElementSibling() { const p = this.parentNode; if (!p) return null; for (let i = p.childNodes.indexOf(this) - 1; i >= 0; i--) if (p.childNodes[i].nodeType === 1) return p.childNodes[i]; return null; }
  }
  class Text extends Node { constructor(t) { super(); this.nodeType = 3; this.nodeValue = t; } get textContent() { return this.nodeValue; } cloneNode() { return new Text(this.nodeValue); } }
  class El extends Node {
    constructor(tag) { super(); this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.listeners = {}; const el = this;
      this.style = { set cssText(v) { el.attrs.style = v; }, get cssText() { return el.attrs.style || ''; }, setProperty(k, v) { this[k] = v; } };
      this.classList = { add: (...c) => { const s = new Set(el.cls()); c.forEach((x) => s.add(x)); el.attrs.class = [...s].join(' '); notify(el); }, remove: (c) => { el.attrs.class = el.cls().filter((x) => x !== c).join(' '); },
        contains: (c) => el.cls().includes(c) }; }
    cls() { return (this.attrs.class || '').split(/\s+/).filter(Boolean); }
    get className() { return this.attrs.class || ''; } set className(v) { this.attrs.class = v; }
    get id() { return this.attrs.id || ''; } set id(v) { this.attrs.id = v; }
    get children() { return this.childNodes.filter((n) => n.nodeType === 1); }
    setAttribute(k, v) { this.attrs[k] = String(v); } getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; } removeAttribute(k) { delete this.attrs[k]; } hasAttribute(k) { return k in this.attrs; }
    set href(v) { this.attrs.href = v; } get href() { return this.attrs.href; }
    set src(v) { this.attrs.src = v; } get src() { return this.attrs.src; }
    set alt(v) { this.attrs.alt = v; } set decoding(v) { this.attrs.decoding = v; } set loading(v) { this.attrs.loading = v; }
    get complete() { return false; } get naturalWidth() { return 0; }
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); }
    _detach(n) { if (n.parentNode) { const a = n.parentNode.childNodes; a.splice(a.indexOf(n), 1); notify(n.parentNode); n.parentNode = null; } }
    appendChild(n) { this._detach(n); n.parentNode = this; this.childNodes.push(n); notify(this); return n; }
    insertBefore(n, ref) { if (!ref) return this.appendChild(n); this._detach(n); n.parentNode = this; this.childNodes.splice(this.childNodes.indexOf(ref), 0, n); notify(this); return n; }
    removeChild(n) { this._detach(n); return n; }
    insertAdjacentElement(pos, n) { if (pos === 'afterend') this.parentNode.insertBefore(n, this.nextSibling); else throw new Error(pos); return n; }
    get textContent() { return this.childNodes.map((n) => n.textContent).join(''); }
    set textContent(v) { this.childNodes.forEach((n) => { n.parentNode = null; }); this.childNodes = []; if (v !== '') { const t = new Text(String(v)); t.parentNode = this; this.childNodes.push(t); } notify(this); }
    cloneNode(deep) { const c = new El(this.tagName); c.attrs = { ...this.attrs }; if (deep) this.childNodes.forEach((n) => { const k = n.cloneNode(true); k.parentNode = c; c.childNodes.push(k); }); return c; }
    closest(sel) { for (let n = this; n && n.nodeType === 1; n = n.parentNode) if (matches(n, sel)) return n; return null; }
    querySelectorAll(sel) { const out = []; const walk = (n) => n.childNodes.forEach((c) => { if (c.nodeType === 1) { if (matches(c, sel, this)) out.push(c); walk(c); } }); walk(this); return out; }
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
    getBoundingClientRect() { const f = rects[this.tagName.toLowerCase() + (this.cls()[0] ? '.' + this.cls()[0] : '')] || rects[this.id ? '#' + this.id : '']; const r = f ? f(this) : { width: 0, height: 0 }; return { top: 0, left: 0, ...r }; }
    html() { const a = Object.keys(this.attrs).sort().filter((k) => this.attrs[k] !== '' || k !== 'style').map((k) => ` ${k}="${this.attrs[k]}"`).join('');
      return `<${this.tagName.toLowerCase()}${a}>${this.childNodes.map((n) => (n.nodeType === 3 ? n.nodeValue : n.html())).join('')}</${this.tagName.toLowerCase()}>`; }
  }
  const simple = (n, s) => { // tag, .class, #id, [attr], [attr="v"] in one compound; * for any element
    if (s === '*') return true;
    const m = /^([a-z0-9]+)?((?:[.#][\w-]+|\[[\w-]+(?:="?[^"\]]*"?)?\])*)$/i.exec(s); if (!m) throw new Error('selector ' + s);
    if (m[1] && n.tagName !== m[1].toUpperCase()) return false;
    for (const p of m[2].match(/[.#][\w-]+|\[[^\]]+\]/g) || []) {
      if (p[0] === '.') { if (!n.cls().includes(p.slice(1))) return false; } else if (p[0] === '#') { if (n.id !== p.slice(1)) return false; }
      else { const a = /^\[([\w-]+)(?:="?([^"\]]*)"?)?\]$/.exec(p); if (!(a[1] in n.attrs)) return false; if (a[2] !== undefined && n.attrs[a[1]] !== a[2]) return false; } }
    return true; };
  const matches = (n, sel) => sel.split(',').some((one) => { const parts = one.trim().split(/\s+/); if (!simple(n, parts[parts.length - 1])) return false;
    let a = n.parentNode; for (let i = parts.length - 2; i >= 0; i--) { while (a && a.nodeType === 1 && !simple(a, parts[i])) a = a.parentNode; if (!a || a.nodeType !== 1) return false; a = a.parentNode; } return true; });
  const root = new El('html'); const head = new El('head'); const body = new El('body'); root.appendChild(head);
  let fontReady; const fontsReady = new Promise((r) => { fontReady = r; });
  const fontJobs = []; const fontsIn = new Set(fontsLoaded);
  doc = { readyState, documentElement: root, head, body: null, fonts: { status: 'loading', ready: fontsReady, addEventListener: (t, f) => { (fontL[t] = fontL[t] || []).push(f); },
    check: (f) => fontsIn.has(f), load: (f, text) => new Promise((res, rej) => { fontJobs.push({ f, text, res: () => { fontsIn.add(f); res([]); }, rej }); }) },
    createElement: (t) => new El(t), createTextNode: (t) => new Text(t),
    getElementById: (id) => root.querySelector('#' + id), querySelector: (s) => root.querySelector(s), querySelectorAll: (s) => root.querySelectorAll(s),
    addEventListener: (t, f) => { (docL[t] = docL[t] || []).push(f); } };
  class MutationObserver { constructor(cb) { this.cb = cb; this.on = false; this.pending = false; this.target = null; observers.push(this); }
    observe(t, o) { this.on = true; this.target = t; this.sub = !!(o && o.subtree); } disconnect() { this.on = false; this.pending = false; } takeRecords() { this.pending = false; return []; }
    sees(n) { if (n === this.target) return true; if (!this.sub) return false; for (let x = n; x; x = x.parentNode) if (x === this.target) return true; return false; } }
  class ResizeObserver { constructor(cb) { this.cb = cb; this.on = false; resizeObs.push(this); } observe(t) { this.on = true; this.target = t; } disconnect() { this.on = false; } }
  const window = { MutationObserver, ResizeObserver, Promise, innerHeight: 900, matchMedia: (q) => ({ matches: /reduce/.test(q) && reduced }),
    getComputedStyle: (n) => ({ fontFamily: families[n.tagName.toLowerCase()] || '', fontWeight: '800', fontStyle: n.tagName === 'EM' ? 'italic' : 'normal', boxSizing: 'content-box', paddingTop: '0px', paddingBottom: '0px', borderTopWidth: '0px', borderBottomWidth: '0px', minHeight: n.id === 'tll-map-layers' && doc.getElementById('tll-fp-map-v1') ? '900px' : '0px' }),
    addEventListener: (t, f) => { (winL[t] = winL[t] || []).push(f); }, requestAnimationFrame: (f) => { timers.push({ f, ms: 16 }); } };
  const setTimeout = (f, ms) => { timers.push({ f, ms: ms || 0 }); return timers.length; };
  const clearTimeout = (id) => { if (timers[id - 1]) timers[id - 1].f = null; };
  // the parser: add an element (or text) to a parent, then let the observers run, as at the end of a parser task
  const el = (parent, tag, attrs = {}, text) => { const n = new El(tag); Object.assign(n.attrs, attrs); if (text !== undefined) { const t = new Text(text); t.parentNode = n; n.childNodes.push(t); }
    if (n.tagName === 'BODY') { doc.body = n; } parent.appendChild(n); flush(); return n; };
  const openBody = () => { root.appendChild(body); doc.body = body; flush(); return body; };
  const run = (ms) => { const due = timers.filter((t) => t.f && t.ms <= ms); due.forEach((t) => { const f = t.f; t.f = null; f(); flush(); }); };
  // DOMContentLoaded: the window's capture listeners run before the document's own (the only window listener of this event in the two layers is a capture one)
  const fire = (t) => { if (t === 'DOMContentLoaded') { doc.readyState = 'interactive'; (winL[t] || []).slice().forEach((f) => { f(); flush(); }); (docL[t] || []).slice().forEach((f) => { f(); flush(); }); } else { if (t === 'load') doc.readyState = 'complete'; (winL[t] || []).slice().forEach((f) => { f(); flush(); }); } };
  const resize = () => resizeObs.filter((o) => o.on).forEach((o) => { o.cb([]); flush(); });
  const styles = (where) => where.children.filter((n) => n.tagName === 'STYLE').map((n) => n.id);
  const fontsDone = async () => { doc.fonts.status = 'loaded'; (fontL.loadingdone || []).forEach((f) => f()); fontReady(); await fontsReady; await null; };
  return { document: doc, window, location: { pathname: path }, setTimeout, clearTimeout, root, head, body, el, openBody, flush, run, fire, resize, styles, observers, timers, docL, winL, fontL, resizeObs, El, fontsDone, fontJobs };
}
const runLayer = (src, d) => new Function('window', 'document', 'location', 'setTimeout', 'clearTimeout', 'MutationObserver', 'NodeFilter', src)(d.window, d.document, d.location, d.setTimeout, d.clearTimeout, d.window.MutationObserver, { SHOW_TEXT: 4 });

// ---- page stand-ins: the hero markup of each page, parsed top to bottom ----
const PAGES = {
  '/travelers': (d, each) => { const m = d.el(d.body, 'main'); each(); const sec = d.el(m, 'section', { class: 'tll-section-dark tll-travelers-hero' }); each(); const inner = d.el(sec, 'div', { class: 'tll-container tll-travelers-hero-inner' }); each();
    d.el(inner, 'div', { class: 'tll-eyebrow-teal' }, 'The Travelers'); each(); const h1 = d.el(inner, 'h1', { class: 'tll-display-xxl tll-travelers-title' }, 'Where the Travelers '); each(); d.el(h1, 'em', { class: 'tll-text-rose' }, 'live'); each();
    d.el(inner, 'p', { class: 'tll-lede' }, 'Everyone on TLL.'); each(); const ts = d.el(m, 'section', { class: 'tll-trav-section' }); each();
    const bar = d.el(ts, 'div', { class: 'tv-bar', 'data-tv-chips': '' }); each(); const ev = d.el(bar, 'button', { class: 'tv-chip', 'data-tv-filter': 'everyone' }, 'Everyone'); each(); d.el(ev, 'span', { 'data-tv-n': '' }); each();
    d.el(bar, 'button', { class: 'tv-chip', 'data-tv-filter': 'expats' }, 'Live there'); each(); },
  '/the-map': (d, each) => { const m = d.el(d.body, 'main'); each(); const sec = d.el(m, 'section', { class: 'tll-section-dark tll-map-hero' }); each(); d.el(sec, 'div', { class: 'w-embed' }); each();
    const inner = d.el(sec, 'div', { class: 'tll-container tll-map-hero-inner' }); each(); const copy = d.el(inner, 'div', {}); each(); const mh = d.el(copy, 'h1', { class: 'tll-display-xl tll-map-title' }, 'Every country, '); each(); d.el(mh, 'em', { class: 'tll-text-rose' }, 'on the map'); each(); d.el(copy, 'p', { class: 'tll-lede' }, 'Signed in, this is your map.'); each(); const hc = d.el(inner, 'div', { class: 'tll-map-hero-counter' }); each(); d.el(hc, 'div', { id: 'tll-map-counter' }, '0 / 250'); each();
    const ms = d.el(m, 'section', { class: 'tll-map-section' }); each(); d.el(ms, 'p', { id: 'tllm-boot' }, 'LOADING THE MAP CODE'); each(); d.el(ms, 'div', { id: 'tll-map-layers' }); each(); d.el(ms, 'div', { class: 'tll-map-legend' }); each(); },
  '/about': (d, each) => { const m = d.el(d.body, 'main'); each(); const art = d.el(m, 'article', { class: 'tll-about-final' }); each(); const hero = d.el(art, 'header', { class: 'tll-about-final-hero' }); each();
    d.el(hero, 'h1', { class: 'tll-about-final-title' }, 'About'); each(); d.el(hero, 'p', {}, 'Intro'); each(); d.el(art, 'div', { class: 'tll-about-final-body' }); each(); },
  '/for-expats': (d, each) => { const m = d.el(d.body, 'main'); each(); const sec = d.el(m, 'section', { class: 'inline-section-0-1' }); each(); d.el(sec, 'div', {}, 'FOR EXPATS'); each(); d.el(sec, 'h1', {}, 'Eight years somewhere'); each();
    d.el(sec, 'p', {}, 'You know which bus runs.'); each(); d.el(m, 'section', { 'data-tll-x': 'finder' }); each(); const dir = d.el(m, 'section', { 'data-tll-x': 'dir' }); each(); d.el(dir, 'h2', {}, 'The experts so far.'); each();
    d.el(m, 'section', { 'data-tll-x': 'steps' }); each(); },
};
// the layer run from the head while the page is parsed (the core today), then the page-parsed event
function early(path, each = () => {}, src = heroesSrc) { const d = makeDom({ path }); runLayer(src, d); d.openBody(); PAGES[path](d, () => each(d)); return d; }
// the same page parsed first, the layer run afterwards (how the heroes were dressed until now: everything at once on a parsed page)
function late(path) { const d = makeDom({ path }); d.openBody(); PAGES[path](d, () => {}); d.document.readyState = 'interactive'; runLayer(heroesSrc, d); return d; }

describe('tll-page-heroes-v1: the hero photos go in while the page is parsed (C2)', () => {
  it('puts its style into the head at once on the four hero paths and moves it to the end of the body when the page is parsed', () => {
    for (const path of Object.keys(PAGES)) {
      const d = makeDom({ path }); runLayer(heroesSrc, d);
      expect(d.styles(d.head)).toEqual(['tll-page-heroes-v1']);
      d.openBody(); PAGES[path](d, () => {}); d.el(d.body, 'style', { id: 'tll-foot-v1' });
      expect(d.styles(d.head)).toEqual(['tll-page-heroes-v1']);
      d.fire('DOMContentLoaded');
      expect(d.styles(d.head)).toEqual([]);
      expect(d.styles(d.body)).toEqual(['tll-foot-v1', 'tll-page-heroes-v1']);
    }
  });
  it('/travelers: the faces are in the hero before the title is parsed', () => {
    const seen = [];
    early('/travelers', (d) => { const inner = d.document.querySelector('.tll-travelers-hero-inner'); if (inner) seen.push([inner.children.map((c) => c.tagName).join(','), inner.classList.contains('tll-ph-grid')]); });
    expect(seen[0]).toEqual(['UL', true]);
    expect(seen[seen.length - 1][0]).toBe('UL,DIV,H1,P');
  });
  it('/the-map: the backdrop and the hero class go on as soon as the hero is there; the credit waits until the hero has arrived whole and is its last child', () => {
    const log = [];
    const d = early('/the-map', (x) => { const sec = x.document.querySelector('section.tll-map-hero'); if (sec) log.push({ kids: sec.children.map((c) => c.cls()[0]).join(','), has: sec.classList.contains('tll-ph-hasbg'), next: !!sec.nextElementSibling }); });
    expect(log[0]).toEqual({ kids: 'tll-ph-bg', has: true, next: false });
    for (const s of log.filter((x) => !x.next)) expect(s.kids).not.toMatch(/tll-ph-credit/);
    const first = log.find((x) => x.next);
    expect(first.kids).toBe('tll-ph-bg,w-embed,tll-container,tll-ph-credit');
    expect(d.document.querySelectorAll('.tll-ph-credit').length).toBe(1);
  });
  it('/about: the filmstrip goes on the end of the hero once the hero has arrived whole', () => {
    const log = [];
    early('/about', (x) => { const hero = x.document.querySelector('.tll-about-final-hero'); if (hero) log.push([hero.children.length, !!hero.nextElementSibling, !!hero.querySelector('.tll-ph-strip')]); });
    for (const [, next, strip] of log) expect(strip).toBe(next);
    expect(log[log.length - 1]).toEqual([3, true, true]);
  });
  it('/for-expats: the hero is split once it has arrived whole, the photo row follows the directory once that has', () => {
    const log = [];
    early('/for-expats', (x) => { const q = (s) => !!x.document.querySelector(s); log.push([q('.tll-ph-split'), q('.tll-ph-band'), q('[data-tll-x="finder"]'), q('[data-tll-x="steps"]')]); });
    for (const [split, band, finder, steps] of log) { expect(split).toBe(finder); expect(band).toBe(steps); }
  });
  it('the finished page is the one the page-parsed run has always made, on all four paths', () => {
    for (const path of Object.keys(PAGES)) {
      const a = early(path); a.fire('DOMContentLoaded'); const b = late(path);
      expect(a.body.html()).toBe(b.body.html());
      expect(a.body.html()).toMatch(/tll-ph-/);
    }
  });
  it('a second page-parsed run adds nothing', () => {
    for (const path of Object.keys(PAGES)) { const a = early(path); a.fire('DOMContentLoaded'); const once = a.body.html(); (a.docL.DOMContentLoaded || []).forEach((f) => f()); expect(a.body.html()).toBe(once); }
  });
  it('a throw in the early run stops only the early run: the page-parsed run still dresses the hero', () => {
    const d = makeDom({ path: '/the-map' }); runLayer(heroesSrc, d); d.openBody();
    const real = d.document.querySelector; let boom = true; d.document.querySelector = (s) => { if (boom) throw new Error('x'); return real(s); };
    PAGES['/the-map'](d, () => {});
    expect(d.root.querySelector('.tll-ph-bg')).toBe(null);
    expect(d.observers.filter((o) => o.on).length).toBe(0);
    boom = false; d.fire('DOMContentLoaded');
    expect(d.body.html()).toBe(late('/the-map').body.html());
  });
  it('without MutationObserver the page-parsed run does the whole job, as before', () => {
    const d = makeDom({ path: '/about' }); d.window.MutationObserver = undefined; runLayer(heroesSrc, d); d.openBody(); PAGES['/about'](d, () => {});
    expect(d.root.querySelector('.tll-ph-strip')).toBe(null);
    d.fire('DOMContentLoaded');
    expect(d.body.html()).toBe(late('/about').body.html());
  });
  it('/stories is left as it was: nothing before the page is parsed, the style at the end of the body then', () => {
    const d = makeDom({ path: '/stories' }); runLayer(heroesSrc, d); d.openBody(); d.el(d.body, 'main');
    expect(d.styles(d.head)).toEqual([]); expect(d.observers.length).toBe(0);
    d.document.createTreeWalker = () => ({ nextNode: () => null });
    d.fire('DOMContentLoaded');
    expect(d.styles(d.body)).toEqual(['tll-page-heroes-v1']);
  });
  it('does nothing on other paths', () => {
    const d = makeDom({ path: '/layovers' }); runLayer(heroesSrc, d);
    expect(d.styles(d.head)).toEqual([]); expect(d.observers.length).toBe(0); expect(d.docL.DOMContentLoaded).toBeUndefined();
  });
  it('a lazy photo keeps its place from the start (the frame) and gets its img when the page is parsed, as before; an eager photo is there at once', () => {
    const about = early('/about');
    expect(about.root.querySelectorAll('.tll-ph-strip .tll-ph-img').length).toBe(4); expect(about.root.querySelectorAll('.tll-ph-strip img').length).toBe(0);
    about.fire('DOMContentLoaded');
    expect(about.root.querySelectorAll('.tll-ph-strip img').map((i) => i.getAttribute('loading'))).toEqual(['lazy', 'lazy', 'lazy', 'lazy']);
    const ex = early('/for-expats');
    expect(ex.root.querySelectorAll('.tll-ph-side img').map((i) => i.getAttribute('loading'))).toEqual(['eager']);
    expect(ex.root.querySelectorAll('.tll-ph-band .tll-ph-img').length).toBe(3); expect(ex.root.querySelectorAll('.tll-ph-band img').length).toBe(0);
    ex.fire('DOMContentLoaded'); expect(ex.root.querySelectorAll('.tll-ph-band img').length).toBe(3);
    expect(early('/the-map').root.querySelectorAll('.tll-ph-bg img').length).toBe(1);
    expect(early('/travelers').root.querySelectorAll('.tll-ph-faces img').length).toBe(4);
  });
  it('a photo that arrives while the page is parsed shows without the fade, and the inline transition is gone two frames later', () => {
    const d = early('/the-map'); const img = d.root.querySelector('.tll-ph-bg img');
    img.listeners.load.forEach((f) => f());
    expect(img.classList.contains('tll-ph-in')).toBe(true); expect(img.style.transition).toBe('none');
    d.run(16); d.run(16);
    expect(img.style.transition).toBe('');
    // after the page is parsed a photo fades in as before
    const e = early('/about'); e.fire('DOMContentLoaded'); const im2 = e.root.querySelector('.tll-ph-strip img'); im2.listeners.load.forEach((f) => f());
    expect(im2.classList.contains('tll-ph-in')).toBe(true); expect(im2.style.transition).toBeUndefined();
  });
});

// ---- tll-first-paint-v1 ----
const TRAV_RECT = { 'h1.tll-display-xxl': (n) => { const w = n.querySelector('em').textContent; return { width: 342, height: w === 'photograph' || w === 'circumnavigate' ? 121.5 : 81 }; } };
function travelers(opts = {}) { const d = makeDom({ path: '/travelers', rects: TRAV_RECT, ...opts }); runLayer(fpSrc, d); d.openBody(); PAGES['/travelers'](d, () => {}); return d; }
const titleCss = (d) => { const s = d.document.getElementById('tll-fp-title-v1'); return s ? s.textContent : null; };
// what the page script does when the page is parsed: verb() writes a word into the title's em
const verb = (d, w) => { d.document.querySelector('.tll-travelers-title em').textContent = w; d.flush(); };
function themap(opts = {}, before = () => {}) { const d = makeDom({ path: '/the-map', ...opts }); before(d); runLayer(fpSrc, d); d.openBody(); PAGES['/the-map'](d, () => {}); return d; }
const publicPage = (d) => { d.root.classList.add('tll-map-public'); d.el(d.head, 'script', { id: 'tll-map-invite-js-v1' }); };

describe('tll-first-paint-v1: only on /travelers, /the-map and /about, only while the page is parsed', () => {
  it('does nothing on other paths', () => {
    for (const path of ['/', '/stories', '/stories/a-story', '/about/x', '/for-expats', '/travelers/x', '/account']) {
      const d = makeDom({ path }); runLayer(fpSrc, d);
      expect(d.styles(d.head)).toEqual([]); expect(d.observers.length).toBe(0); expect(d.timers.length).toBe(0); expect(d.docL.DOMContentLoaded).toBeUndefined();
    }
  });
  it('does nothing when the page is already parsed, or without MutationObserver', () => {
    const a = makeDom({ path: '/travelers', readyState: 'interactive' }); runLayer(fpSrc, a); expect(a.styles(a.head)).toEqual([]); expect(a.timers.length).toBe(0);
    const b = makeDom({ path: '/the-map' }); b.window.MutationObserver = undefined; runLayer(fpSrc, b); expect(b.styles(b.head)).toEqual([]);
  });
  it('a trailing slash is the same page', () => {
    const d = makeDom({ path: '/the-map/' }); runLayer(fpSrc, d); expect(d.styles(d.head)).toEqual(['tll-fp-page-v1', 'tll-fp-map-v1']);
  });
});

describe('tll-first-paint-v1 on /travelers', () => {
  it('has the page style and our chunk rules in the head from the start', () => {
    const d = makeDom({ path: '/travelers' }); runLayer(fpSrc, d);
    expect(d.styles(d.head)).toEqual(['tll-fp-page-v1', 'tll-fp-ours-v1']);
    const page = d.document.getElementById('tll-fp-page-v1').textContent;
    expect(page).toContain('input[data-tll-trav-search]{width:100%;box-sizing:border-box;height:48px;');
    expect(page).toContain('[data-tll-trav-search-note]:empty{display:none}');
    expect(page).toContain("[data-tv-chips] [data-tv-n]:empty::after{content:' \\B7  0';visibility:hidden}");
    expect(d.document.getElementById('tll-fp-ours-v1').textContent).toContain('html body [data-tv-chips] [data-tv-filter="pets"]{display:none!important}');
  });
  it('takes the page style out right after the page-parsed listeners, never before', () => {
    const d = travelers(); expect(d.styles(d.head)).toContain('tll-fp-page-v1');
    d.fire('DOMContentLoaded'); expect(d.styles(d.head)).toContain('tll-fp-page-v1');
    d.run(0); expect(d.styles(d.head)).not.toContain('tll-fp-page-v1');
  });
  it('keeps our chunk rules until the chunk has put its own style into the head', () => {
    const d = travelers(); d.fire('DOMContentLoaded'); d.run(0);
    expect(d.styles(d.head)).toContain('tll-fp-ours-v1');
    d.el(d.head, 'style', { id: 'something-else' }); expect(d.styles(d.head)).toContain('tll-fp-ours-v1');
    d.el(d.head, 'style', { id: 'tll-travelers-fix-v1' });
    expect(d.styles(d.head)).not.toContain('tll-fp-ours-v1');
  });
  it('names the first chip People as soon as the chip is parsed, as the chunk does later, and leaves the count alone', () => {
    const d = makeDom({ path: '/travelers', rects: TRAV_RECT }); runLayer(fpSrc, d); d.openBody();
    const seen = []; PAGES['/travelers'](d, () => { const ev = d.document.querySelector('[data-tv-filter="everyone"]'); if (ev) seen.push([!!ev.nextElementSibling, ev.firstChild.nodeValue]); });
    for (const [next, word] of seen) expect(word).toBe(next ? 'People' : 'Everyone');
    expect(seen[seen.length - 1]).toEqual([true, 'People']);
    // the chunk's own rename (tll-travelers-fix-v1, separate()) then finds nothing to do
    const fix = read('src', 'site-layers', 'tll-travelers-fix-v1.js');
    expect(fix).toContain("if(tn&&tn.nodeType===3&&/everyone/i.test(tn.nodeValue))tn.nodeValue='People';");
    d.el(d.head, 'style', { id: 'tll-travelers-fix-v1' }); d.fire('DOMContentLoaded'); d.run(0); d.fire('load'); d.run(0);
    expect(d.document.querySelector('[data-tv-filter="everyone"]').textContent).toBe('People');
  });
  it('puts Everyone back when the chunk never came; with the chunk already in, the word stays', () => {
    const d = travelers(); d.fire('DOMContentLoaded'); d.run(0);
    expect(d.document.querySelector('[data-tv-filter="everyone"]').firstChild.nodeValue).toBe('People');
    d.fire('load'); d.run(0);
    expect(d.document.querySelector('[data-tv-filter="everyone"]').firstChild.nodeValue).toBe('Everyone');
    const e = makeDom({ path: '/travelers', rects: TRAV_RECT }); runLayer(fpSrc, e); e.el(e.head, 'style', { id: 'tll-travelers-fix-v1' }); e.openBody(); PAGES['/travelers'](e, () => {});
    expect(e.document.querySelector('[data-tv-filter="everyone"]').firstChild.nodeValue).toBe('People');
    e.fire('DOMContentLoaded'); e.run(0); e.fire('load'); e.run(20000);
    expect(e.document.querySelector('[data-tv-filter="everyone"]').firstChild.nodeValue).toBe('People');
    const f = travelers(); f.run(20000);
    expect(f.document.querySelector('[data-tv-filter="everyone"]').firstChild.nodeValue).toBe('Everyone');
  });
  it('lets our chunk rules go after load when the chunk never came', () => {
    const d = travelers(); d.fire('DOMContentLoaded'); d.run(0); d.fire('load'); expect(d.styles(d.head)).toContain('tll-fp-ours-v1');
    d.run(0); expect(d.styles(d.head)).not.toContain('tll-fp-ours-v1');
  });
  it('holds the title at the height of its tallest verb as soon as the title has arrived whole, measured on a hidden copy', () => {
    const d = makeDom({ path: '/travelers', rects: TRAV_RECT }); runLayer(fpSrc, d); d.openBody();
    const seen = []; PAGES['/travelers'](d, () => seen.push([!!d.document.querySelector('.tll-travelers-title em'), !!d.document.querySelector('.tll-lede'), titleCss(d)]));
    for (const [, lede, css] of seen) expect(css).toBe(lede ? 'h1.tll-travelers-title{min-height:121.5px}' : null);
    // the copy is gone and the page's own title is untouched
    expect(d.document.querySelectorAll('.tll-travelers-title').length).toBe(1);
    expect(d.document.querySelector('.tll-travelers-title em').textContent).toBe('live');
    expect(d.document.querySelector('.tll-travelers-title').getAttribute('style')).toBe(null);
  });
  it('keeps the hold when the page script has written a verb by the time the page is parsed', () => {
    const d = travelers(); verb(d, 'were'); d.fire('DOMContentLoaded'); d.run(0);
    expect(titleCss(d)).toBe('h1.tll-travelers-title{min-height:121.5px}');
  });
  it('lets the title go when the page script wrote no verb (missing, or it threw): the page ends as it does without the layer', () => {
    const d = travelers(); d.fire('DOMContentLoaded'); d.run(0);
    expect(titleCss(d)).toBe(null); expect(d.styles(d.head)).toEqual(['tll-fp-ours-v1']);
    verb(d, 'photograph'); d.fire('load'); d.run(200); expect(titleCss(d)).toBe(null);
  });
  it('does not hold the title for a reader who asks for reduced motion (the page does not rotate the verb then)', () => {
    const d = travelers({ reduced: true }); verb(d, 'photograph'); d.fire('DOMContentLoaded'); d.run(0);
    expect(titleCss(d)).toBe(null);
  });
  it('measures again after load, a resize and the fonts, and learns a verb it did not know', () => {
    let wide = false;
    const rects = { 'h1.tll-display-xxl': (n) => ({ width: wide ? 812 : 342, height: wide ? 166 : (/photograph|circumnavigate/.test(n.querySelector('em').textContent) ? 121.5 : 81) }) };
    const d = makeDom({ path: '/travelers', rects }); runLayer(fpSrc, d); d.openBody(); PAGES['/travelers'](d, () => {}); verb(d, 'are'); d.fire('DOMContentLoaded'); d.run(0);
    wide = true; d.fire('resize'); expect(titleCss(d)).toBe('h1.tll-travelers-title{min-height:121.5px}'); d.run(200);
    expect(titleCss(d)).toBe('h1.tll-travelers-title{min-height:166px}');
    wide = false; d.fontL.loadingdone.forEach((f) => f()); d.run(200); expect(titleCss(d)).toBe('h1.tll-travelers-title{min-height:121.5px}');
    const r2 = { 'h1.tll-display-xxl': (n) => ({ width: 342, height: n.querySelector('em').textContent === 'circumnavigate' ? 161 : 81 }) };
    const e = makeDom({ path: '/travelers', rects: r2 }); runLayer(fpSrc, e); e.openBody(); PAGES['/travelers'](e, () => {});
    expect(titleCss(e)).toBe('h1.tll-travelers-title{min-height:81px}');
    verb(e, 'circumnavigate'); expect(titleCss(e)).toBe('h1.tll-travelers-title{min-height:161px}');
  });
  it('has a hard release for every early state when the page never finishes parsing', () => {
    const d = travelers(); expect(d.styles(d.head)).toEqual(['tll-fp-page-v1', 'tll-fp-ours-v1', 'tll-fp-title-v1']);
    d.run(19999); expect(d.styles(d.head).length).toBe(3);
    d.run(20000); expect(d.styles(d.head)).toEqual([]);
  });
});

describe('tll-first-paint-v1 on /about', () => {
  const PHONE = '@media(max-width:600px){.tll-about-final-title{font-size:38px;letter-spacing:-.5px}.tll-about-final-hero{padding-top:52px;padding-bottom:40px}.tll-about-final-intro{font-size:18px}}';
  it('carries the phone sizes of the hero until the page-parsed listeners have run, and the note hold until right before them', () => {
    const d = makeDom({ path: '/about' }); runLayer(fpSrc, d);
    expect(d.styles(d.head)).toEqual(['tll-fp-page-v1', 'tll-fp-note-v1']);
    expect(d.document.getElementById('tll-fp-page-v1').textContent).toBe(PHONE);
    expect(d.document.getElementById('tll-fp-note-v1').textContent).toBe('#tll-note{display:none}');
    d.openBody(); PAGES['/about'](d, () => {});
    expect(d.styles(d.head)).toEqual(['tll-fp-page-v1', 'tll-fp-note-v1']);
    // the note hold is gone when the first document listener of the page-parsed event runs: the site's scripts find the note as served
    let seen = null; d.document.addEventListener('DOMContentLoaded', () => { seen = d.styles(d.head); });
    d.fire('DOMContentLoaded'); expect(seen).toEqual(['tll-fp-page-v1']); expect(d.styles(d.head)).toEqual(['tll-fp-page-v1']);
    expect(d.observers.filter((o) => o.on).length).toBe(0);
    d.run(0); expect(d.styles(d.head)).toEqual([]);
    expect(d.body.html()).not.toMatch(/tll-fp-/);
  });
  it('the note takes no room until its own style has been parsed whole, then the hold goes at once (repair, note 2)', () => {
    const d = makeDom({ path: '/about' }); runLayer(fpSrc, d); d.openBody(); PAGES['/about'](d, () => {});
    const foot = d.el(d.body, 'footer'); d.el(foot, 'div', { id: 'tll-note' }); d.el(d.body, 'div', { class: 'w-embed' });
    expect(d.styles(d.head)).toContain('tll-fp-note-v1');
    // the style element is in the page but its text is still arriving: no sheet yet, the hold stays
    const st = d.el(d.body, 'style', { id: 'tll-note-v1-css' }); expect(d.styles(d.head)).toContain('tll-fp-note-v1');
    // parsed whole (the browser has made its sheet); the next node the parser adds is the note's script
    st.sheet = {}; d.el(d.body, 'script', { id: 'tll-note-v1-js' });
    expect(d.styles(d.head)).toEqual(['tll-fp-page-v1']); expect(d.observers.filter((o) => o.on).length).toBe(0);
    d.fire('DOMContentLoaded'); d.run(0); expect(d.styles(d.head)).toEqual([]);
  });
  it('the note hold is only the one rule, and the saved site footer still has the style it waits for', () => {
    expect(fpSrc).toContain('var NOTE_ABOUT="#tll-note{display:none}";');
    const foot = read('src', 'site', 'live-2026-11-13', 'fonts', 'site-footer.after.html');
    expect(foot).toContain('<style id="tll-note-v1-css">'); expect(foot).toContain('#tll-note{position:fixed;');
    // the style comes after the note in the page: the site footer code follows the footer the note sits in
    const page = read('src', 'pages', 'heroes-2026-10-29', 'fixtures', 'about.html');
    expect(page.indexOf('id="tll-note"')).toBeGreaterThan(-1); expect(page.indexOf('id="tll-note-v1-css"')).toBeGreaterThan(page.indexOf('id="tll-note"'));
    // no other path gets it
    for (const path of ['/travelers', '/the-map']) { const o = makeDom({ path }); runLayer(fpSrc, o); expect(o.styles(o.head)).not.toContain('tll-fp-note-v1'); }
  });
  it('lets go after 20 s when the page never finishes parsing', () => {
    const d = makeDom({ path: '/about' }); runLayer(fpSrc, d); d.run(19999); expect(d.styles(d.head)).toEqual(['tll-fp-page-v1', 'tll-fp-note-v1']); d.run(20000); expect(d.styles(d.head)).toEqual([]);
  });
});

describe('tll-first-paint-v1 on /the-map', () => {
  it('has the page style and the map hold in the head from the start', () => {
    const d = makeDom({ path: '/the-map' }); runLayer(fpSrc, d);
    expect(d.styles(d.head)).toEqual(['tll-fp-page-v1', 'tll-fp-map-v1']);
    expect(d.document.getElementById('tll-fp-map-v1').textContent).toBe('#tll-map-layers{min-height:min(100vh,1400px)}');
    expect(d.document.getElementById('tll-fp-page-v1').textContent).toMatch(/^\[data-tll-map=fullscreen\]\{display:inline-block;margin-top:14px;/);
    // phones: the map's closed sheet is left out of the layout until the page is parsed (an opened one is not touched)
    expect(d.document.getElementById('tll-fp-page-v1').textContent).toContain('@media (max-width:760px){#tll-map-layers .tllm-drawer:not([data-open="1"]){display:none}}');
    const mapCss = read('map-2.0', 'dist', 'tll-map-layers.css');
    expect(mapCss).toContain('@media (max-width:760px){'); expect(mapCss).toContain('.tllm-drawer{position:fixed;left:0;right:0;bottom:0;');
  });
  it('lets the map hold go once the map is drawn and taller than the hold, not before', () => {
    let h = 900; const d = themap({ rects: { '#tll-map-layers': () => ({ width: 1232, height: h }) } }); d.fire('DOMContentLoaded'); d.run(0); d.fire('load');
    expect(d.styles(d.head)).toEqual(['tll-fp-map-v1']);
    d.resize(); expect(d.styles(d.head)).toEqual(['tll-fp-map-v1']);
    const root = d.document.getElementById('tll-map-layers'); h = 1420; d.resize();
    expect(d.styles(d.head)).toEqual(['tll-fp-map-v1']); // taller, but no map bar yet
    d.el(root, 'div', { class: 'tllm-bar' }); h = 900; d.resize(); expect(d.styles(d.head)).toEqual(['tll-fp-map-v1']);
    h = 2503; d.resize(); expect(d.styles(d.head)).toEqual([]);
    expect(d.resizeObs.filter((o) => o.on).length).toBe(0);
  });
  it('lets the map hold go when the embed reports that the map did not load or start', () => {
    for (const msg of ['THE MAP CODE DID NOT LOAD FROM EITHER HOST', 'CODE LOADED FROM JSDELIVR BUT THE MAP DID NOT START', 'MAP ERROR: x is not a function']) {
      const d = themap(); const boot = d.document.getElementById('tllm-boot');
      // a map code that has run marks the mount first, then the embed says STARTING
      d.document.getElementById('tll-map-layers').classList.add('tllm');
      boot.textContent = 'CODE LOADED FROM JSDELIVR, STARTING'; d.flush(); expect(d.styles(d.head)).toContain('tll-fp-map-v1');
      boot.textContent = msg; d.flush(); expect(d.styles(d.head)).not.toContain('tll-fp-map-v1');
    }
  });
  it('lets the map hold go at once when the map file has loaded and the code never ran: the embed says STARTING and the mount is not marked (repair, note 3)', () => {
    const d = themap(); const boot = d.document.getElementById('tllm-boot'); const root = d.document.getElementById('tll-map-layers');
    expect(d.styles(d.head)).toContain('tll-fp-map-v1'); expect(root.classList.contains('tllm')).toBe(false);
    boot.textContent = 'CODE LOADED FROM JSDELIVR, STARTING'; d.flush();
    expect(d.styles(d.head)).not.toContain('tll-fp-map-v1'); expect(d.resizeObs.filter((o) => o.on).length).toBe(0);
    // a later line of the embed changes nothing, and no observer of the layer is left on the mount or the line
    boot.textContent = 'CODE LOADED FROM JSDELIVR BUT THE MAP DID NOT START'; d.flush(); expect(d.styles(d.head)).not.toContain('tll-fp-map-v1');
    d.fire('DOMContentLoaded'); d.run(0); expect(d.observers.filter((o) => o.on && (o.target === boot || o.target === root)).length).toBe(0);
    // the same from the second host
    const e = themap(); e.document.getElementById('tllm-boot').textContent = 'CODE LOADED FROM STATICALLY, STARTING'; e.flush(); expect(e.styles(e.head)).not.toContain('tll-fp-map-v1');
  });
  it('lets the map hold go when the map code writes its own failure line into the mount (no settings file, no data)', () => {
    const d = themap(); const boot = d.document.getElementById('tllm-boot'); const root = d.document.getElementById('tll-map-layers');
    root.classList.add('tllm'); boot.textContent = 'CODE LOADED FROM JSDELIVR, STARTING'; d.flush(); expect(d.styles(d.head)).toContain('tll-fp-map-v1');
    d.el(root, 'p', { class: 'tllm-err' }, 'The map could not start: 404'); expect(d.styles(d.head)).not.toContain('tll-fp-map-v1');
    expect(d.observers.filter((o) => o.on && o.target === root).length).toBe(0);
  });
  it('a map that starts keeps the hold through STARTING and through what the map adds to the mount, until it is drawn', () => {
    let h = 900; const d = themap({ rects: { '#tll-map-layers': () => ({ width: 1232, height: h }) } }); const boot = d.document.getElementById('tllm-boot'); const root = d.document.getElementById('tll-map-layers');
    root.classList.add('tllm'); boot.textContent = 'CODE LOADED FROM JSDELIVR, STARTING'; d.flush();
    d.el(root, 'div', { class: 'tllm-bar' }); d.el(root, 'div', { class: 'tllm-stage' }); boot.textContent = ''; d.flush(); d.resize();
    expect(d.styles(d.head)).toContain('tll-fp-map-v1');
    h = 2503; d.resize(); expect(d.styles(d.head)).not.toContain('tll-fp-map-v1');
  });
  it('the two early signs are the map\'s own: its code marks the mount before it asks for anything, and the embed says STARTING at the script\'s load event', () => {
    const js = read('map-2.0', 'dist', 'tll-map-layers.js');
    expect(js.indexOf("root.classList.add('tllm')")).toBeGreaterThan(-1); expect(js.indexOf("root.classList.add('tllm')")).toBeLessThan(js.indexOf('getJSON(CONFIG)'));
    expect(js).toContain("function fail(msg) { root.appendChild(el('p', 'tllm-err', msg)); }");
    const emb = read('src', 'pages', 'the-map', 'live-2026-10-25', 'embed-682054d4-after.html');
    expect(emb).toContain("s.onload=function(){say('CODE LOADED FROM '+label+', STARTING');"); expect(emb).toContain('data-tll-version="46a21a18a404b7162bf3bd61c3c26ae70c441445"');
    expect(build).toContain("'first-paint: the map code no longer marks the mount first'"); expect(build).toContain("'first-paint: the map embed status line changed'"); expect(build).toContain("'first-paint: the note style changed'");
  });
  it('lets the map hold go when the page is parsed and has no map mount, and after 20 s at the latest', () => {
    const d = makeDom({ path: '/the-map' }); runLayer(fpSrc, d); d.openBody(); d.el(d.body, 'main'); d.fire('DOMContentLoaded');
    expect(d.styles(d.head)).not.toContain('tll-fp-map-v1');
    const e = themap(); e.fire('DOMContentLoaded'); e.run(0); e.fire('load'); e.run(19999); expect(e.styles(e.head)).toEqual(['tll-fp-map-v1']);
    e.run(20000); expect(e.styles(e.head)).toEqual([]);
  });
  it('takes the page style out right after the page-parsed listeners', () => {
    const d = themap(); d.fire('DOMContentLoaded'); expect(d.styles(d.head)).toContain('tll-fp-page-v1'); d.run(0); expect(d.styles(d.head)).not.toContain('tll-fp-page-v1');
  });
  it('puts the invite in right after the counter as soon as the counter is parsed, made as the page script makes it', () => {
    const d = makeDom({ path: '/the-map' }); publicPage(d); runLayer(fpSrc, d); d.openBody();
    const seen = []; PAGES['/the-map'](d, () => seen.push([!!d.document.querySelector('.tll-map-hero-counter'), d.document.querySelectorAll('[data-tll-map-invite]').length]));
    for (const [counter, n] of seen) expect(n).toBe(counter ? 1 : 0);
    const a = d.document.querySelector('[data-tll-map-invite]');
    expect(a.html()).toBe('<a data-tll-map-invite="1" href="/signup">Start your own map →</a>');
    expect(a.previousElementSibling.classList.contains('tll-map-hero-counter')).toBe(true);
    // the page head script (tll-map-invite-js-v1) then finds it and adds nothing
    const live = read('src', 'pages', 'the-map', 'live-2026-10-20', 'page-head-2026-10-20-after.html');
    const js = /<script id="tll-map-invite-js-v1">\n([\s\S]*?)<\/script>/.exec(live)[1];
    d.document.readyState = 'interactive'; new Function('document', js)(d.document);
    expect(d.document.querySelectorAll('[data-tll-map-invite]').length).toBe(1);
    // and on a page without this layer that script makes the same element in the same place
    const w = makeDom({ path: '/the-map' }); publicPage(w); w.openBody(); PAGES['/the-map'](w, () => {}); w.document.readyState = 'interactive'; new Function('document', js)(w.document);
    expect(w.body.html()).toBe(d.body.html());
  });
  it('adds no invite for a signed-in member, or when the page script is not on the page', () => {
    const member = themap({}, (d) => { d.el(d.head, 'script', { id: 'tll-map-invite-js-v1' }); });
    expect(member.document.querySelector('[data-tll-map-invite]')).toBe(null);
    const noScript = themap({}, (d) => { d.root.classList.add('tll-map-public'); });
    expect(noScript.document.querySelector('[data-tll-map-invite]')).toBe(null);
  });
  const STACK = '"Playfair Display", TLLSerifG, TLLSerifN, TLLSerifT, Georgia, serif';
  const tick = () => new Promise((r) => setImmediate(r));
  it('keeps the title in the fallback faces until both of its font files are in, then gives it both at once', async () => {
    const d = makeDom({ path: '/the-map', families: { h1: STACK } }); runLayer(fpSrc, d); d.openBody();
    const seen = []; PAGES['/the-map'](d, () => { const s = d.document.getElementById('tll-fp-maptitle-v1'); seen.push([!!d.document.querySelector('.tll-lede'), s ? s.textContent : null]); });
    for (const [lede, css] of seen) expect(css).toBe(lede ? 'h1.tll-map-title,h1.tll-map-title *{font-family:TLLSerifG, TLLSerifN, TLLSerifT, Georgia, serif!important}' : null);
    // the two files are asked for with the title's own text, so the right parts of the font are loaded
    expect(d.fontJobs.map((j) => [j.f, j.text])).toEqual([['800 1em "Playfair Display"', 'Every country, on the map'], ['italic 800 1em "Playfair Display"', 'Every country, on the map']]);
    d.fontJobs[0].res(); await tick(); d.fire('DOMContentLoaded'); d.run(0); d.fire('load');
    expect(d.styles(d.head)).toContain('tll-fp-maptitle-v1'); // one file in: still the fallback faces
    d.fontJobs[1].res(); await tick();
    expect(d.styles(d.head)).not.toContain('tll-fp-maptitle-v1');
    expect(d.document.querySelector('.tll-map-title').getAttribute('style')).toBe(null);
  });
  it('lets the title go when a font file fails, and after 20 s when they never come', async () => {
    const d = makeDom({ path: '/the-map', families: { h1: STACK } }); runLayer(fpSrc, d); d.openBody(); PAGES['/the-map'](d, () => {});
    expect(d.styles(d.head)).toContain('tll-fp-maptitle-v1');
    d.fontJobs[1].rej(new Error('network')); await tick();
    expect(d.styles(d.head)).not.toContain('tll-fp-maptitle-v1');
    const e = makeDom({ path: '/the-map', families: { h1: STACK } }); runLayer(fpSrc, e); e.openBody(); PAGES['/the-map'](e, () => {});
    e.run(19999); expect(e.styles(e.head)).toContain('tll-fp-maptitle-v1'); e.run(20000); expect(e.styles(e.head)).not.toContain('tll-fp-maptitle-v1');
  });
  it('does nothing to the title when both files are already in, when its stack has no Playfair Display, without the font interface, or without a title', () => {
    const a = makeDom({ path: '/the-map', families: { h1: STACK }, fontsLoaded: ['800 1em "Playfair Display"', 'italic 800 1em "Playfair Display"'] }); runLayer(fpSrc, a); a.openBody(); PAGES['/the-map'](a, () => {});
    expect(a.styles(a.head)).toEqual(['tll-fp-page-v1', 'tll-fp-map-v1']); expect(a.fontJobs.length).toBe(0);
    const b = makeDom({ path: '/the-map', families: { h1: 'Georgia, serif' } }); runLayer(fpSrc, b); b.openBody(); PAGES['/the-map'](b, () => {});
    expect(b.styles(b.head)).toEqual(['tll-fp-page-v1', 'tll-fp-map-v1']); expect(b.fontJobs.length).toBe(0);
    const c = makeDom({ path: '/the-map', families: { h1: STACK } }); c.document.fonts = undefined; runLayer(fpSrc, c); c.openBody(); PAGES['/the-map'](c, () => {});
    expect(c.styles(c.head)).toEqual(['tll-fp-page-v1', 'tll-fp-map-v1']);
    const f = makeDom({ path: '/the-map', families: { h1: STACK } }); runLayer(fpSrc, f); f.openBody(); f.el(f.body, 'main'); f.fire('DOMContentLoaded');
    expect(f.styles(f.head)).not.toContain('tll-fp-maptitle-v1'); expect(f.fontJobs.length).toBe(0);
  });
  it('one file already in (the regular one, from other text): the title still waits in the fallback faces for the italic', async () => {
    const d = makeDom({ path: '/the-map', families: { h1: STACK }, fontsLoaded: ['800 1em "Playfair Display"'] }); runLayer(fpSrc, d); d.openBody(); PAGES['/the-map'](d, () => {});
    expect(d.styles(d.head)).toContain('tll-fp-maptitle-v1');
    d.fontJobs.forEach((j) => j.res()); await tick();
    expect(d.styles(d.head)).not.toContain('tll-fp-maptitle-v1');
  });
  it('stops watching the page once both jobs are done', () => {
    const d = themap({}, publicPage);
    expect(d.observers.filter((o) => o.on && o.target === d.root).length).toBe(0);
  });
});

describe('the copies in tll-first-paint-v1 match the page code, and the core carries both layers', () => {
  const blocks = [...fpSrc.matchAll(/\/\*copy:([^*]+)\*\/\n([\s\S]*?)\/\*end\*\//g)].map((m) => ({ file: m[1], rules: m[2].split('\n').map((l) => l.trim()).filter((l) => l.startsWith('"')).map((l) => JSON.parse(l.replace(/[+;]$/, ''))) }));
  it('every copied rule is still in the file it was copied from', () => {
    expect(blocks.map((b) => [b.file, b.rules.length])).toEqual([['src/pages/heroes-2026-10-29/code/travelers-footer.html', 5], ['src/site-layers/tll-travelers-fix-v1.js', 3], ['src/pages/the-map/live-2026-11-16/embed-fs.live.html', 1],
      ['src/pages/about/live-2026-11-13/next/embed-c024f6d7.after.html', 3]]);
    expect(read('src', 'pages', 'about', 'live-2026-11-13', 'next', 'embed-c024f6d7.after.html')).toContain('@media(max-width:600px){' + blocks[3].rules.join(''));
    for (const b of blocks) { const src = read(...b.file.split('/')); for (const r of b.rules) expect(src.includes(r) || src.includes(JSON.stringify(r).slice(1, -1))).toBe(true); }
  });
  it('the travelers search rules are the ones in the live page footer style, and the verbs are the page script\'s', () => {
    const foot = read('src', 'pages', 'travelers', 'live-2026-11-10', 'after', 'page-footer.html');
    const css = /<style id="tll-trav-search-css">([\s\S]*?)<\/style>/.exec(foot)[1];
    for (const r of blocks[0].rules) expect(css).toContain(r);
    const words = /\/\*words:([^*]+)\*\/\s*var WORDS=(\[[^\]]*\]);/.exec(fpSrc);
    expect(read(...words[1].split('/'))).toContain('var W=' + words[2]);
  });
  it('the build checks the copies and puts the layer into the core after page-heroes', () => {
    expect(build).toContain('first_paint_checks()');
    expect(build).toMatch(/'tll-page-heroes-v1', 'tll-first-paint-v1'/);
    const at = (s) => core.indexOf('/* src/site-layers/' + s + '.js */');
    expect(at('tll-page-heroes-v1')).toBeGreaterThan(-1);
    expect(at('tll-first-paint-v1')).toBeGreaterThan(at('tll-page-heroes-v1'));
    expect(at('tll-first-paint-v1')).toBeLessThan(core.indexOf("(function(){if(!/^\\/stories\\/[^/]+\\/?$/.test(location.pathname))return;"));
    expect(core).toContain("if(path!=='/travelers'&&path!=='/the-map'&&path!=='/about')return;");
    expect(core).toContain('function early(){var mo=null;(document.head||document.documentElement).appendChild(sheet());');
  });
  it('the core carries both layers without their comments, and the built code does the same job', () => {
    const section = (name) => { const a = core.indexOf('/* src/site-layers/' + name + '.js */'); return core.slice(a, core.indexOf('\n/* src/', a + 10)); };
    const bh = section('tll-page-heroes-v1'); const bf = section('tll-first-paint-v1');
    expect(bh.slice(bh.indexOf('\n')).includes('/*')).toBe(false); expect(bf.slice(bf.indexOf('\n')).includes('/*')).toBe(false);
    expect(build).toContain("BARE = ('tll-page-heroes-v1', 'tll-first-paint-v1')");
    // same code, comments aside (the font stacks in the built copy also carry the fallback faces)
    const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/,TLLS\w+/g, '').replace(/\s+/g, '');
    expect(strip(bf)).toBe(strip(fpSrc)); expect(strip(bh)).toBe(strip(heroesSrc));
    for (const path of Object.keys(PAGES)) { const a = early(path, () => {}, bh); a.fire('DOMContentLoaded'); expect(a.body.html()).toBe(late(path).body.html().replace(/,TLLS\w+/g, '')); }
    const d = makeDom({ path: '/travelers', rects: TRAV_RECT }); runLayer(bf, d); d.openBody(); PAGES['/travelers'](d, () => {});
    expect(d.styles(d.head)).toEqual(['tll-fp-page-v1', 'tll-fp-ours-v1', 'tll-fp-title-v1']); expect(titleCss(d)).toBe('h1.tll-travelers-title{min-height:121.5px}');
    const m = makeDom({ path: '/the-map' }); publicPage(m); runLayer(bf, m); m.openBody(); PAGES['/the-map'](m, () => {});
    expect(m.styles(m.head)).toEqual(['tll-fp-page-v1', 'tll-fp-map-v1']); expect(m.document.querySelectorAll('[data-tll-map-invite]').length).toBe(1);
  });
  it('no chunk changed: the layer is in no chunk, and the travelers chunk still carries the rules copied from it', () => {
    const chunk = read('src', 'site-layers', 'chunks', 'travelers.js');
    expect(chunk).not.toContain('tll-fp-');
    for (const r of blocks[1].rules) expect(chunk).toContain(JSON.stringify(r).slice(1, -1));
  });
});
