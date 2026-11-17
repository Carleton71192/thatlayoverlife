// Layout shift sweep, part B (16 Nov 2026, reports/evidence/cls-sweep-2026-11-16/fix.md), for core release 16.67.0.
// One layer in the core, tll-early-state-v1: while the page is parsed it lays out what the site's own code settles at the page-parsed
// event (the nav on /account and /submit, the Menu button, the /stories filter row and lead card, the profile head)
// and hands the page back right before that code runs.
// The layout was measured in a real browser (the fix report). Here the layer runs against a small stand-in for the DOM, with a parser
// that adds nodes one at a time and lets the observers run after each, together with the page's own code as it is saved in the repo
// (the site head, the /stories footer scripts, the profile scripts, our two stories chunk layers that touch the first screen). Each test asks two things: is the end
// state there before the page-parsed event, and is the finished page exactly the one the page's code makes without the layer.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const layerSrc = read('src', 'site-layers', 'tll-early-state-v1.js');
const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
const build = read('src', 'site-layers', 'build-site-layers-v16.py');
const siteHead = read('src', 'site', 'live-2026-11-13', 'fonts', 'site-head.after.html');
const script = (html, id) => { const m = new RegExp('<script id="' + id + '"[^>]*>([\\s\\S]*?)</script>').exec(html); if (!m) throw new Error('no script ' + id); return m[1]; };
const MENU_JS = script(siteHead, 'tll-mobile-nav-js-v1');
const PARITY_JS = script(siteHead, 'tll-proto-parity-js-v1');
const LEAD_JS = script(read('src', 'pages', 'stories', 'live-2026-11-16', 'tll-lib-lead-v1.live.html'), 'tll-lib-lead-v1');
const CHIPS_JS = script(read('src', 'pages', 'stories', 'live-2026-11-16', 'tll-lib-chips-v1.live.html'), 'tll-lib-chips-v1');
const PLACES_JS = read('src', 'site-layers', 'tll-stories-places-v1.js');
const COUNT_JS = read('src', 'site-layers', 'tll-stories-count-v1.js');
const PF5_JS = read('src', 'pages', 'contributors-template', 'live-2026-11-16', 'tll-pf5-profile-js-v1.live.js');
const PF5N_JS = script(read('src', 'pages', 'contributors-template', 'live-2026-11-10', 'after', 'tll-pf5-n-v1.html'), 'tll-pf5-n-v1');

// ---- a small DOM: elements, text, a selector engine, observers, events with a capture phase, timers ----
function makeDom({ path = '/', search = '', readyState = 'loading', hidden = () => false, families = {}, fontsLoaded = [], cssHas = true } = {}) {
  const observers = []; const timers = []; let seq = 0; let now = 0; let doc; let win;
  const notify = (target) => { observers.forEach((o) => { if (o.on && o.sees(target)) o.pending = true; }); };
  const flush = () => { for (let k = 0; k < 50; k++) { const p = observers.filter((o) => o.on && o.pending); if (!p.length) return; p.forEach((o) => { o.pending = false; o.cb([]); }); } };
  class Node {
    constructor() { this.parentNode = null; this.childNodes = []; }
    get firstChild() { return this.childNodes[0] || null; }
    get lastChild() { return this.childNodes[this.childNodes.length - 1] || null; }
    get nextSibling() { const p = this.parentNode; if (!p) return null; return p.childNodes[p.childNodes.indexOf(this) + 1] || null; }
    get previousSibling() { const p = this.parentNode; if (!p) return null; return p.childNodes[p.childNodes.indexOf(this) - 1] || null; }
    get nextElementSibling() { let n = this.nextSibling; while (n && n.nodeType !== 1) n = n.nextSibling; return n; }
    get previousElementSibling() { let n = this.previousSibling; while (n && n.nodeType !== 1) n = n.previousSibling; return n; }
    get parentElement() { return this.parentNode && this.parentNode.nodeType === 1 ? this.parentNode : null; }
    remove() { if (this.parentNode) this.parentNode.removeChild(this); }
  }
  class Text extends Node {
    constructor(t) { super(); this.nodeType = 3; this._v = String(t); }
    get nodeValue() { return this._v; } set nodeValue(v) { this._v = String(v); if (this.parentNode) notify(this.parentNode); }
    get textContent() { return this._v; } set textContent(v) { this.nodeValue = v; }
    cloneNode() { return new Text(this._v); }
  }
  const camel = (k) => 'data-' + k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
  const PROPS = ['href', 'target', 'rel', 'title', 'src', 'alt', 'width', 'height', 'loading', 'type', 'download', 'name', 'content', 'value', 'decoding'];
  class El extends Node {
    constructor(tag) { super(); this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.listeners = {}; const el = this;
      this.classList = { add: (...c) => { const s = new Set(el.cls()); c.forEach((x) => s.add(x)); el.setAttribute('class', [...s].join(' ')); }, remove: (...c) => { el.setAttribute('class', el.cls().filter((x) => !c.includes(x)).join(' ')); },
        contains: (c) => el.cls().includes(c), toggle: (c, on) => { const has = el.cls().includes(c); const want = on === undefined ? !has : !!on; if (want && !has) el.classList.add(c); if (!want && has) el.classList.remove(c); return want; } };
      this.dataset = new Proxy({}, { get: (_, k) => (typeof k === 'string' && camel(k) in el.attrs ? el.attrs[camel(k)] : undefined), set: (_, k, v) => { el.setAttribute(camel(k), v); return true; }, has: (_, k) => camel(k) in el.attrs });
      const decl = () => { const o = {}; (el.attrs.style || '').split(';').forEach((p) => { const i = p.indexOf(':'); if (i > 0) o[p.slice(0, i).trim()] = p.slice(i + 1).trim(); }); return o; };
      const put = (o) => { const s = Object.keys(o).filter((k) => o[k] !== '').map((k) => k + ':' + o[k]).join(';'); if (s || 'style' in el.attrs) el.attrs.style = s; notify(el); };
      this.style = new Proxy({}, { get: (_, k) => { if (k === 'cssText') return el.attrs.style || ''; if (k === 'setProperty') return (n, v) => { const o = decl(); o[n] = v; put(o); }; return decl()[String(k).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())] || ''; },
        set: (_, k, v) => { if (k === 'cssText') { el.attrs.style = String(v); notify(el); return true; } const o = decl(); o[String(k).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())] = String(v); put(o); return true; } });
      PROPS.forEach((p) => Object.defineProperty(this, p, { get: () => (p in el.attrs ? el.attrs[p] : ''), set: (v) => { el.setAttribute(p, v); }, configurable: true })); }
    cls() { return (this.attrs.class || '').split(/\s+/).filter(Boolean); }
    get className() { return this.attrs.class || ''; } set className(v) { this.setAttribute('class', v); }
    get id() { return this.attrs.id || ''; } set id(v) { this.setAttribute('id', v); }
    get hidden() { return 'hidden' in this.attrs; } set hidden(v) { if (v) this.setAttribute('hidden', ''); else this.removeAttribute('hidden'); }
    get tabIndex() { return +(this.attrs.tabindex || 0); } set tabIndex(v) { this.setAttribute('tabindex', v); }
    get children() { return this.childNodes.filter((n) => n.nodeType === 1); }
    get firstElementChild() { return this.children[0] || null; }
    get offsetParent() { for (let n = this; n && n.nodeType === 1; n = n.parentNode) if (hidden(n)) return null; return this.parentNode; }
    setAttribute(k, v) { this.attrs[k] = String(v); notify(this); } getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
    removeAttribute(k) { delete this.attrs[k]; notify(this); } hasAttribute(k) { return k in this.attrs; }
    get attributes() { return Object.keys(this.attrs).map((k) => ({ name: k, value: this.attrs[k] })); }
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); }
    dispatch(t) { const ev = { type: t, target: this, preventDefault() {}, stopPropagation() {} }; (this.listeners[t] || []).slice().forEach((f) => f(ev)); (docL[t] || []).slice().forEach((l) => l.f(ev)); flush(); }
    click() { this.dispatch('click'); } focus() { doc.activeElement = this; }
    _detach(n) { if (n.parentNode) { const p = n.parentNode; p.childNodes.splice(p.childNodes.indexOf(n), 1); n.parentNode = null; notify(p); } }
    appendChild(n) { this._detach(n); n.parentNode = this; this.childNodes.push(n); notify(this); return n; }
    insertBefore(n, ref) { if (!ref) return this.appendChild(n); if (ref.parentNode !== this) throw new Error('insertBefore: not a child'); if (n === ref) return n; this._detach(n); n.parentNode = this; this.childNodes.splice(this.childNodes.indexOf(ref), 0, n); notify(this); return n; }
    removeChild(n) { if (n.parentNode !== this) throw new Error('removeChild: not a child'); this._detach(n); return n; }
    insertAdjacentElement(pos, n) { if (pos === 'afterend') this.parentNode.insertBefore(n, this.nextSibling); else throw new Error(pos); return n; }
    get textContent() { return this.childNodes.map((n) => n.textContent).join(''); }
    set textContent(v) { this.childNodes.forEach((n) => { n.parentNode = null; }); this.childNodes = []; if (v !== '' && v != null) { const t = new Text(String(v)); t.parentNode = this; this.childNodes.push(t); } notify(this); }
    cloneNode(deep) { const c = new El(this.tagName); c.attrs = { ...this.attrs }; if (deep) this.childNodes.forEach((n) => { const k = n.cloneNode(true); k.parentNode = c; c.childNodes.push(k); }); return c; }
    contains(n) { for (; n; n = n.parentNode) if (n === this) return true; return false; }
    matches(sel) { return matches(this, sel); }
    closest(sel) { for (let n = this; n && n.nodeType === 1; n = n.parentNode) if (matches(n, sel)) return n; return null; }
    querySelectorAll(sel) { const out = []; const walk = (n) => n.childNodes.forEach((c) => { if (c.nodeType === 1) { if (matches(c, sel)) out.push(c); walk(c); } }); walk(this); return out; }
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; }
    html() { const a = Object.keys(this.attrs).sort().map((k) => ` ${k}="${this.attrs[k]}"`).join('');
      return `<${this.tagName.toLowerCase()}${a}>${this.childNodes.map((n) => (n.nodeType === 3 ? n.nodeValue : n.html())).join('')}</${this.tagName.toLowerCase()}>`; }
  }
  // selectors: a list of compounds joined by a space or >; a compound is tag, #id, .class, [a], [a=v], [a^=v], [a$=v], [a*=v] and :not(compound)
  const split = (s, ch) => { const out = []; let d = 0; let cur = ''; let qt = ''; for (const c of s) { if (qt) { if (c === qt) qt = ''; cur += c; continue; } if (c === '"' || c === "'") { qt = c; cur += c; continue; }
    if (c === '(' || c === '[') d++; if (c === ')' || c === ']') d--; if (c === ch && d === 0) { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out; };
  const compound = (n, s) => { let rest = s; const tag = /^[a-zA-Z][\w-]*|^\*/.exec(rest); if (tag) { if (tag[0] !== '*' && n.tagName !== tag[0].toUpperCase()) return false; rest = rest.slice(tag[0].length); }
    while (rest) { let m;
      if ((m = /^\.([\w-]+)/.exec(rest))) { if (!n.cls().includes(m[1])) return false; }
      else if ((m = /^#([\w-]+)/.exec(rest))) { if (n.id !== m[1]) return false; }
      else if ((m = /^\[([\w-]+)(?:([\^$*]?=)(?:"([^"]*)"|'([^']*)'|([^\]]*)))?\]/.exec(rest))) { if (!(m[1] in n.attrs)) return false; const v = m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : m[5]; const a = n.attrs[m[1]];
        if (m[2] === '=' && a !== v) return false; if (m[2] === '^=' && !a.startsWith(v)) return false; if (m[2] === '$=' && !a.endsWith(v)) return false; if (m[2] === '*=' && !a.includes(v)) return false; }
      else if ((m = /^:not\(([^()]*)\)/.exec(rest))) { if (compound(n, m[1])) return false; }
      else throw new Error('selector ' + s);
      rest = rest.slice(m[0].length); }
    return true; };
  const one = (n, sel) => { const toks = []; split(sel.trim().replace(/\s*>\s*/g, ' > '), ' ').filter(Boolean).forEach((t) => toks.push(t));
    const go = (node, i) => { if (!compound(node, toks[i])) return false; if (i === 0) return true;
      if (toks[i - 1] === '>') { const p = node.parentNode; return !!(p && p.nodeType === 1 && go(p, i - 2)); }
      for (let a = node.parentNode; a && a.nodeType === 1; a = a.parentNode) if (go(a, i - 1)) return true; return false; };
    return go(n, toks.length - 1); };
  const matches = (n, sel) => split(sel, ',').some((s) => one(n, s));
  const root = new El('html'); const head = new El('head'); root.appendChild(head);
  const docL = {}; const winL = {};
  const add = (L) => (t, f, cap) => { (L[t] = L[t] || []).push({ f, cap: cap === true || !!(cap && cap.capture) }); };
  const fontJobs = []; const fontsIn = new Set(fontsLoaded); const fontL = {};
  doc = { nodeType: 9, readyState, documentElement: root, head, body: null, activeElement: null, title: '',
    fonts: { check: (f) => fontsIn.has(f), load: (f, text) => new Promise((res, rej) => { fontJobs.push({ f, text, res: () => { fontsIn.add(f); res([]); }, rej }); }), addEventListener: (t, f) => { (fontL[t] = fontL[t] || []).push(f); } },
    createElement: (t) => new El(t), createTextNode: (t) => new Text(t),
    createTreeWalker: (rt) => { const list = []; const walk = (n) => n.childNodes.forEach((c) => { if (c.nodeType === 3) list.push(c); else walk(c); }); walk(rt); let i = -1; return { nextNode: () => list[++i] || null }; },
    getElementById: (id) => root.querySelectorAll('*').find((n) => n.id === id) || null, querySelector: (s) => root.querySelector(s), querySelectorAll: (s) => root.querySelectorAll(s),
    addEventListener: add(docL), dispatchEvent: (ev) => { (docL[ev.type] || []).slice().forEach((l) => l.f(ev)); } };
  class MutationObserver { constructor(cb) { this.cb = cb; this.on = false; this.pending = false; this.target = null; observers.push(this); }
    observe(t, o) { this.on = true; this.target = t; this.sub = !!(o && o.subtree); } disconnect() { this.on = false; this.pending = false; } takeRecords() { this.pending = false; return []; }
    sees(n) { if (n === this.target) return true; if (!this.sub) return false; for (let x = n; x; x = x.parentNode) if (x === this.target) return true; return false; } }
  const setTimeout = (f, ms) => { timers.push({ f, at: now + (ms || 0), seq: ++seq }); return seq; };
  const clearTimeout = (id) => { const t = timers.find((x) => x.seq === id); if (t) t.f = null; };
  const setInterval = () => 0; const clearInterval = () => {};
  win = { MutationObserver, Promise, innerHeight: 900, document: doc, setTimeout, clearTimeout, setInterval, clearInterval, addEventListener: add(winL),
    CSS: cssHas === null ? undefined : { supports: (q) => { if (cssHas === 'throw') throw new Error('lab'); return q === 'selector(:has(*))' && !!cssHas; } },
    matchMedia: () => ({ matches: false }), requestIdleCallback: () => {}, sessionStorage: { getItem: () => null, setItem: () => {} },
    getComputedStyle: (n) => ({ display: hidden(n) ? 'none' : 'block', fontFamily: families[n.tagName.toLowerCase()] || '', fontWeight: '800', fontStyle: n.tagName === 'EM' ? 'italic' : 'normal' }) };
  // the parser: add an element (or text) to a parent, then let the observers run, as at the end of a parser task
  const el = (parent, tag, attrs = {}, text) => { const n = new El(tag); Object.assign(n.attrs, attrs); if (text !== undefined && text !== null) { const t = new Text(text); t.parentNode = n; n.childNodes.push(t); }
    if (n.tagName === 'BODY') doc.body = n; parent.appendChild(n); flush(); return n; };
  const text = (parent, t) => { const n = new Text(t); parent.appendChild(n); flush(); return n; };
  const body = () => el(root, 'body');
  // a parser-inserted inline script: the element goes in, the observers run (the microtask checkpoint), then the script runs
  const inline = (parent, id, src) => { const s = el(parent, 'script', id ? { id } : {}); if (src) { exec(src); flush(); } return s; };
  const env = () => ({ window: win, document: doc, location: { pathname: path, search, hostname: 'www.thatlayover.life', origin: 'https://www.thatlayover.life' }, setTimeout, clearTimeout, setInterval, clearInterval, MutationObserver, NodeFilter: { SHOW_TEXT: 4 },
    getComputedStyle: win.getComputedStyle, URLSearchParams, sessionStorage: win.sessionStorage, addEventListener: win.addEventListener, CustomEvent: function (t) { this.type = t; }, Event: function (t) { this.type = t; }, fetch: () => new Promise(() => {}), encodeURIComponent, console: { warn() {} } });
  const exec = (src) => { const e = env(); const keys = Object.keys(e); try { return new Function(...keys, src)(...keys.map((k) => e[k])); } catch (x) { thrown.push(x.message); return undefined; } };
  const thrown = [];
  const run = (ms) => { now += ms; for (;;) { const due = timers.filter((t) => t.f && t.at <= now).sort((a, b) => a.at - b.at || a.seq - b.seq)[0]; if (!due) break; const f = due.f; due.f = null; try { f(); } catch (x) { thrown.push(x.message); } flush(); } };
  const call = (l, ev) => { try { l.f(ev); } catch (x) { thrown.push(x.message); } flush(); };
  // DOMContentLoaded: window capture, then the document's listeners, then window bubble
  const parsed = () => { doc.readyState = 'interactive'; const ev = { type: 'DOMContentLoaded', target: doc }; const order = [];
    (winL.DOMContentLoaded || []).filter((l) => l.cap).forEach((l) => { order.push('window capture'); call(l, ev); });
    (docL.DOMContentLoaded || []).slice().forEach((l) => { order.push('document'); call(l, ev); });
    (winL.DOMContentLoaded || []).filter((l) => !l.cap).forEach((l) => { order.push('window'); call(l, ev); }); return order; };
  const load = () => { doc.readyState = 'complete'; (winL.load || []).slice().forEach((l) => call(l, { type: 'load' })); };
  const styles = () => head.children.filter((n) => n.tagName === 'STYLE').map((n) => n.id);
  return { document: doc, window: win, root, head, el, text, body, inline, exec, run, parsed, load, flush, styles, observers, timers, thrown, fontJobs, El, Text };
}
const layer = (d) => d.exec(layerSrc);

// ---- page stand-ins ----
const NAV = (d, parent) => { const nav = d.el(parent, 'nav', { class: 'tll-nav-v1' }); const main = d.el(nav, 'div', { class: 'tll-nav-main' }); const inner = d.el(main, 'div', { class: 'tll-nav-inner' });
  const logo = d.el(inner, 'a', { href: '/', class: 'tll-nav-logo' }); d.el(logo, 'span', { class: 'tll-nav-logo-block' }, 'LAYOVER LIFE');
  const row = d.el(inner, 'div', { class: 'tll-nav-links-row' }); d.el(row, 'a', { href: '/stories', class: 'tll-nav-link' }, 'Stories');
  const cta = d.el(inner, 'div', { class: 'tll-nav-cta-row' }); d.el(cta, 'a', { href: '/submit', class: 'tll-btn tll-nav-pen-cta' }, 'Share your story');
  const anon = d.el(cta, 'div', { 'data-ms-content': 'anonymous', class: 'tll-nav-anon' }); d.el(anon, 'a', { href: '/login', class: 'tll-nav-link tll-nav-signin' }, 'Log in');
  d.el(cta, 'div', { 'data-ms-content': 'members', class: 'tll-nav-member' }); return { nav, cta, row }; };
// the head as on the site: the two site head scripts first (they run and wait for the page-parsed event), then the core layer
const HEAD = (d, { menu = MENU_JS, parity = PARITY_JS, withLayer = true, chunk = null } = {}) => {
  if (menu !== null) d.inline(d.head, 'tll-mobile-nav-js-v1', menu);
  if (parity !== null) d.inline(d.head, 'tll-proto-parity-js-v1', parity);
  let ch = null; if (chunk) ch = d.el(d.head, 'script', { src: 'https://cdn.jsdelivr.net/gh/x/thatlayoverlife@abc/src/site-layers/chunks/' + chunk + '.js' });
  if (withLayer) layer(d); return ch; };

describe('tll-early-state-v1: the Menu button (C9)', () => {
  const page = (opt = {}, pathName = '/about') => { const d = makeDom({ path: pathName }); HEAD(d, opt); const b = d.body(); const n = NAV(d, b); return { d, b, ...n }; };
  it('puts a stand-in at the end of the button row once the row has arrived whole, not before', () => {
    const { d, b, cta } = page();
    expect(cta.querySelector('.tllmm-btn')).toBe(null); // nothing follows the nav yet: the row may still be growing
    d.el(b, 'main');
    const mb = cta.querySelector('.tllmm-btn');
    expect(mb).not.toBe(null); expect(cta.lastChild).toBe(mb); expect(mb.textContent).toBe('Menu');
    expect(mb.getAttribute('aria-hidden')).toBe('true'); expect(mb.getAttribute('tabindex')).toBe('-1'); expect(mb.getAttribute('type')).toBe('button');
  });
  it('stays the last child if the parser still adds to the row', () => {
    const { d, b, cta } = page(); d.el(b, 'main'); const mb = cta.querySelector('.tllmm-btn');
    const late = d.el(cta, 'a', { class: 'late' }, 'x');
    expect(cta.lastChild).toBe(mb); expect(mb.previousSibling).toBe(late);
  });
  it('is taken out before the site head script adds the real button; the finished nav is the one the page makes without the layer', () => {
    const a = page(); a.d.el(a.b, 'main'); const stand = a.cta.querySelector('.tllmm-btn');
    const order = a.d.parsed();
    expect(order[0]).toBe('window capture'); expect(order[order.length - 1]).toBe('window');
    const btns = a.cta.querySelectorAll('.tllmm-btn');
    expect(btns.length).toBe(1); expect(btns[0]).not.toBe(stand); expect(btns[0].getAttribute('aria-expanded')).toBe('false'); expect(stand.parentNode).toBe(null);
    const c = page({ withLayer: false }); c.d.el(c.b, 'main'); c.d.parsed();
    expect(a.b.html()).toBe(c.b.html());
    expect(a.d.thrown).toEqual([]);
  });
  it('passes a tap on the stand-in on to the real button', () => {
    const { d, b, nav, cta } = page(); d.el(b, 'main'); cta.querySelector('.tllmm-btn').click(); d.parsed();
    expect(nav.classList.contains('tllmm-open')).toBe(true); expect(cta.querySelector('.tllmm-btn').textContent).toBe('Close');
  });
  it('does nothing without the site head script, and leaves no button when that script throws', () => {
    const none = page({ menu: null }); none.d.el(none.b, 'main'); expect(none.cta.querySelector('.tllmm-btn')).toBe(null);
    const bad = page({ menu: "throw new Error('lab');" + MENU_JS }); bad.d.el(bad.b, 'main');
    expect(bad.cta.querySelector('.tllmm-btn')).not.toBe(null);
    bad.d.parsed(); expect(bad.cta.querySelector('.tllmm-btn')).toBe(null);
    const ctl = page({ menu: "throw new Error('lab');" + MENU_JS, withLayer: false }); ctl.d.el(ctl.b, 'main'); ctl.d.parsed();
    expect(bad.b.html()).toBe(ctl.b.html());
  });
  it('is the only piece that runs on other paths (home, a story page)', () => {
    for (const p of ['/', '/stories/some-story', '/layovers']) { const { d, b, cta } = page({}, p); d.el(b, 'main');
      expect(cta.querySelector('.tllmm-btn')).not.toBe(null); expect(d.styles()).toEqual([]);
      d.parsed(); d.run(0); expect(d.observers.filter((o) => o.on).length).toBe(0); expect(cta.querySelectorAll('.tllmm-btn').length).toBe(1); }
  });
  it('hands the stand-in back after 20 s without a page-parsed event', () => {
    const { d, b, cta } = page(); d.el(b, 'main'); d.run(19999); expect(cta.querySelector('.tllmm-btn')).not.toBe(null);
    d.run(1); expect(cta.querySelector('.tllmm-btn')).toBe(null); expect(d.observers.filter((o) => o.on).length).toBe(0);
    d.parsed(); expect(cta.querySelectorAll('.tllmm-btn').length).toBe(1);
  });
  it('does nothing when the core runs after the page is parsed', () => {
    const d = makeDom({ path: '/about', readyState: 'interactive' }); const b = d.body(); const { cta } = NAV(d, b); d.el(b, 'main'); d.el(d.head, 'script', { id: 'tll-mobile-nav-js-v1' }); layer(d);
    expect(cta.querySelector('.tllmm-btn')).toBe(null); expect(d.observers.length).toBe(0);
  });
});

describe('tll-early-state-v1: the nav on /account and /submit (C1)', () => {
  const NAV_CSS = 'html:not(.ms-loaded) [data-ms-content]:has(>nav[data-tll-es-nav]){display:contents!important}html:not(.ms-loaded) [data-ms-content]:has(>nav[data-tll-es-nav])>:not(nav[data-tll-es-nav]){display:none!important}';
  const page = (pathName, opt = {}, dom = {}) => { const d = makeDom({ path: pathName, ...dom }); HEAD(d, opt); const b = d.body(); const wrap = d.el(b, 'div', { class: 'tll-account-wrap' }); const mem = d.el(wrap, 'div', { 'data-ms-content': 'members' });
    const n = NAV(d, mem); return { d, b, wrap, mem, ...n }; };
  const sheetOf = (d) => d.head.children.filter((n) => n.tagName === 'STYLE' && n.id === 'tll-es-nav-v1')[0] || null;
  it('shows the nav inside its hidden wrapper (no box for the wrapper, its other children hidden), by a style and a mark on the nav; nothing is moved', () => {
    const { d, wrap, mem, nav } = page('/account');
    const st = sheetOf(d); expect(st).not.toBe(null); expect(st.textContent).toBe(NAV_CSS); expect(d.styles()).toEqual(['tll-es-nav-v1']);
    expect(nav.getAttribute('data-tll-es-nav')).toBe(''); expect(nav.parentNode).toBe(mem); expect(mem.firstChild).toBe(nav); expect(mem.parentNode).toBe(wrap);
    expect(Object.keys(mem.attrs)).toEqual(['data-ms-content']); expect(mem.getAttribute('data-ms-content')).toBe('members');
    d.el(mem, 'section', { class: 'after' }); expect(nav.parentNode).toBe(mem); expect(d.styles()).toEqual(['tll-es-nav-v1']);
  });
  it('a page script that runs while the page is parsed finds the outer members wrapper first, as served (tll-a3-account-js-v1 takes the first one)', () => {
    const { d, mem, nav } = page('/account'); const hero = d.el(mem, 'section', { class: 'tll-account-hero' });
    const M = d.document.querySelector('[data-ms-content="members"]');
    expect(M).toBe(mem); expect(M.querySelector('.tll-account-hero')).toBe(hero); expect(nav.closest('[data-ms-content]')).toBe(mem);
  });
  it('lets go before navOut() runs, which then moves the nav out: same finished page as without the layer', () => {
    for (const p of ['/account', '/submit']) {
      const a = page(p); a.d.el(a.mem, 'section', { class: 'after' }); a.d.el(a.wrap, 'div', { 'data-ms-content': 'anonymous' }); a.d.parsed();
      const c = page(p, { withLayer: false }); c.d.el(c.mem, 'section', { class: 'after' }); c.d.el(c.wrap, 'div', { 'data-ms-content': 'anonymous' }); c.d.parsed();
      expect(a.nav.parentNode).toBe(a.wrap); expect(a.nav.hasAttribute('data-tll-es-nav')).toBe(false); expect(a.d.styles()).toEqual([]);
      expect(a.b.html()).toBe(c.b.html()); expect(a.d.thrown).toEqual([]);
    }
  });
  it('the page script missing: nothing is set', () => {
    const { d, mem, nav } = page('/account', { parity: null }); d.el(mem, 'section'); expect(d.styles()).toEqual([]); expect(nav.hasAttribute('data-tll-es-nav')).toBe(false);
    d.parsed(); expect(nav.parentNode).toBe(mem); expect(d.styles()).toEqual([]);
  });
  it('the page script throwing: style and mark are gone when the page is parsed and the nav ends inside the wrapper, as it does without the layer', () => {
    const bad = "throw new Error('lab');" + PARITY_JS;
    const a = page('/submit', { parity: bad }); a.d.el(a.mem, 'section'); expect(a.d.styles()).toEqual(['tll-es-nav-v1']);
    a.d.parsed(); expect(a.nav.parentNode).toBe(a.mem); expect(a.mem.firstChild).toBe(a.nav); expect(a.d.styles()).toEqual([]); expect(a.nav.hasAttribute('data-tll-es-nav')).toBe(false);
    const c = page('/submit', { parity: bad, withLayer: false }); c.d.el(c.mem, 'section'); c.d.parsed();
    expect(a.b.html()).toBe(c.b.html());
  });
  it('a second nav outside any wrapper: navOut() leaves the first one in, and the finished page is the one without the layer', () => {
    const mk = (opt) => { const a = page('/account', opt); a.d.el(a.mem, 'section'); const extra = a.d.el(a.b, 'nav', { class: 'tll-nav-v1' }); a.d.el(a.b, 'footer'); a.d.parsed(); return { ...a, extra }; };
    const a = mk({}); const c = mk({ withLayer: false });
    expect(a.nav.parentNode).toBe(a.mem); expect(a.extra.parentNode).toBe(a.b); expect(a.d.styles()).toEqual([]); expect(a.b.html()).toBe(c.b.html());
  });
  it('other paths with the same markup are left alone', () => {
    const { d, mem, nav } = page('/edit-profile'); d.el(mem, 'section'); expect(nav.parentNode).toBe(mem); expect(d.styles()).toEqual([]); expect(nav.hasAttribute('data-tll-es-nav')).toBe(false);
  });
  it('a nav that is not the child of a [data-ms-content] wrapper is left alone', () => {
    const d = makeDom({ path: '/account' }); HEAD(d); const b = d.body(); const { nav } = NAV(d, b); d.el(b, 'main');
    expect(d.styles()).toEqual([]); expect(nav.hasAttribute('data-tll-es-nav')).toBe(false);
    const e = makeDom({ path: '/account' }); HEAD(e); const eb = e.body(); const mem = e.el(eb, 'div', { 'data-ms-content': 'members' }); const mid = e.el(mem, 'div', { class: 'mid' }); const n2 = NAV(e, mid).nav; e.el(mem, 'section');
    expect(e.styles()).toEqual([]); expect(n2.hasAttribute('data-tll-es-nav')).toBe(false);
  });
  it('where :has() is unknown, or cannot be asked, nothing is set', () => {
    for (const cssHas of [false, null, 'throw']) { const { d, mem, nav } = page('/account', {}, { cssHas }); d.el(mem, 'section');
      expect(d.styles()).toEqual([]); expect(nav.hasAttribute('data-tll-es-nav')).toBe(false); d.parsed(); expect(nav.parentNode.getAttribute('class')).toBe('tll-account-wrap'); expect(d.thrown).toEqual([]); }
  });
  it('a wrapper that has left the page before the page-parsed event: the style goes and nothing throws', () => {
    const { d, mem, nav } = page('/account'); d.el(mem, 'section'); mem.remove(); d.parsed();
    expect(d.styles()).toEqual([]); expect(nav.parentNode).toBe(mem); expect(nav.hasAttribute('data-tll-es-nav')).toBe(false); expect(d.thrown).toEqual([]);
  });
  it('20 s without a page-parsed event: style and mark are let go', () => {
    const { d, mem, nav } = page('/account'); d.el(mem, 'section'); d.run(19999); expect(d.styles()).toEqual(['tll-es-nav-v1']);
    d.run(1); expect(d.styles()).toEqual([]); expect(nav.hasAttribute('data-tll-es-nav')).toBe(false); expect(nav.parentNode).toBe(mem); expect(mem.firstChild).toBe(nav);
  });
});

// ---- /stories ----
const CARDS = [ // [slug, date, pick marker class or null for no marker, hidden]
  ['pompeii', 'October 29, 2026', ''], ['torrevieja', 'October 29, 2026', null], ['krewe', 'October 26, 2026', null], ['old-one', 'April 16, 2022', null], ['newer', 'October 19, 2026', null]];
const STORIES = (d, { cards = CARDS, upTo = 'end', lead = LEAD_JS, chips = CHIPS_JS, typed = false } = {}) => {
  const b = d.body(); NAV(d, b); const main = d.el(b, 'main', { class: 'tll-stories-index' });
  const hero = d.el(main, 'section', { class: 'tll-library-hero' }); const hi = d.el(hero, 'div', { class: 'tll-library-hero-inner' });
  const h1 = d.el(hi, 'h1', { class: 'tll-display-xl tll-library-title' }); d.text(h1, typed ? 'Six stories, all worth the ' : 'Stories, all worth the '); d.el(h1, 'em', { class: 'inline-em' }, 'detour'); d.text(h1, '.');
  d.el(hi, 'div', { id: 'tll-lib-share' });
  const fil = d.el(main, 'section', { class: 'tll-library-filters' }); const inner = d.el(fil, 'div', { class: 'tll-container tll-filters-inner' });
  const rows = d.el(inner, 'div', { 'data-tll-chips': 'place-sort', class: 'tll-chip-rows' }); const row = d.el(rows, 'div', { class: 'tll-chip-row' }); d.el(row, 'div', { class: 'tll-filter-label' }, 'Place');
  d.el(row, 'a', { 'aria-pressed': 'true', 'data-tll-place': 'all', role: 'button', href: '#', class: 'tll-filter-chip-on' }, 'All places');
  for (const p of ['Europe', 'Africa', 'Americas', 'Antarctica']) d.el(row, 'a', { 'aria-pressed': 'false', 'data-tll-place': p, role: 'button', href: '#', class: 'tll-shelf-chip' }, p);
  const row2 = d.el(rows, 'div', { class: 'tll-chip-row' }); d.el(row2, 'a', { 'data-tll-guides': '1', href: '/layovers', class: 'tll-shelf-chip' }, 'Layover guides');
  const out = { b, main, h1, inner, row };
  if (upTo === 'filters') return out;
  const bar = d.el(main, 'section', { class: 'tllsb-bar' }); const bi = d.el(bar, 'div', { class: 'tllsb-inner' }); d.el(bi, 'div', { class: 'tllsb-label' }, 'Search the stories');
  const form = d.el(bi, 'div', { class: 'tllsb-form w-form' }); const f = d.el(form, 'form'); d.el(f, 'input', { id: 'tll-lib-q', name: 'q', class: 'tllsb-input' });
  const clr = d.el(bi, 'a', { id: 'tll-lib-clear', href: '/stories', class: 'tllsb-clear' }, 'Clear search');
  Object.assign(out, { bar, bi, form, clr });
  if (upTo === 'bar') return out;
  d.el(main, 'section', { class: 'tllvb-bar' });
  const gs = d.el(main, 'section', { class: 'tll-library-grid-section' }); const list = d.el(gs, 'div', { class: 'w-dyn-list' }); const grid = d.el(list, 'div', { role: 'list', class: 'tll-lib-grid w-dyn-items' });
  const items = {};
  for (const [slug, date, pick] of cards) { const it = d.el(grid, 'div', { role: 'listitem', class: 'w-dyn-item', 'data-k': slug }); const a = d.el(it, 'a', { id: slug, 'data-tll-card': 'cms', href: '/stories/' + slug, class: 'tll-lib-card' });
    d.el(a, 'h2', { class: 'tll-lib-title' }, slug); d.el(a, 'div', { 'data-tll-date': '1', hidden: '' }, date); d.el(a, 'div', { 'data-tll-region': '1', hidden: '' }, 'Europe');
    if (pick !== null) d.el(a, 'div', { 'data-tll-pick': '1', hidden: '', ...(pick ? { class: pick } : {}) }); items[slug] = it; }
  Object.assign(out, { grid, items });
  if (upTo === 'grid') return out;
  d.el(main, 'section', { class: 'tll-library-news' }); // the grid has arrived whole: a section follows its own inside main
  if (upTo === 'footer') return out;
  if (chips !== null) d.inline(b, 'tll-lib-chips-v1', chips);
  if (lead !== null) d.inline(b, 'tll-lib-lead-v1', lead);
  return out; };
const order = (grid) => grid.children.map((k) => k.getAttribute('data-k'));
const chipNames = (row) => row.querySelectorAll('[data-tll-place]').map((c) => c.getAttribute('data-tll-place'));
// the stories chunk: our two layers in it that shape the first screen, run when the chunk file arrives
const chunkRuns = (d) => { d.exec(PLACES_JS); d.exec(COUNT_JS); };
const fireOn = (n, t) => (n.listeners[t] || []).forEach((f) => f({ type: t }));

describe('tll-early-state-v1: /stories (C6)', () => {
  const start = (opt = {}) => { const d = makeDom({ path: '/stories', search: opt.search || '', hidden: opt.hidden, families: opt.families, fontsLoaded: opt.fontsLoaded }); const ch = HEAD(d, { chunk: opt.noChunk ? null : 'stories', withLayer: opt.withLayer !== false }); return { d, ch }; };
  it('moves the search form into the filter row once the search bar has been parsed, made as the page makes it', () => {
    const { d } = start(); const p = STORIES(d, { upTo: 'bar' });
    expect(p.inner.querySelector('.tllsb-form')).toBe(null); // the bar has no element after it yet
    d.el(p.main, 'section', { class: 'tllvb-bar' });
    const slot = p.inner.lastChild;
    expect(slot.className).toBe('tll-lib-searchslot'); expect(slot.children).toEqual([p.form, p.clr]);
    expect(p.inner.getAttribute('data-tll-merged')).toBe('1'); expect(p.bar.style.display).toBe('none');
  });
  it('hands the form back the moment the page script element is parsed; that script then merges for itself', () => {
    const { d } = start(); const p = STORIES(d, { upTo: 'footer' }); const mine = p.inner.querySelector('.tll-lib-searchslot');
    expect(mine).not.toBe(null);
    let seen = null; const probe = "window.__seen=[!!document.querySelector('.tll-filters-inner .tllsb-form'),document.querySelector('.tllsb-form').parentNode.className,document.querySelector('.tllsb-bar').hasAttribute('style')];";
    d.inline(p.b, 'tll-lib-lead-v1', probe + LEAD_JS); seen = d.window.__seen;
    expect(seen).toEqual([false, 'tllsb-inner', false]); // what the page script found: the page as it was served
    const slot = p.inner.querySelector('.tll-lib-searchslot');
    expect(slot).not.toBe(null); expect(slot).not.toBe(mine); expect(mine.parentNode).toBe(null); expect(slot.children).toEqual([p.form, p.clr]);
  });
  it('the finished page is the one the page code makes without the layer', () => {
    const a = start(); const pa = STORIES(a.d); chunkRuns(a.d); fireOn(a.ch, 'load'); a.d.parsed(); a.d.run(700); a.d.load(); a.d.run(2000);
    const c = start({ withLayer: false }); const pc = STORIES(c.d); chunkRuns(c.d); c.d.parsed(); c.d.run(700); c.d.load(); c.d.run(2000);
    expect(pa.b.html()).toBe(pc.b.html()); expect(a.d.thrown).toEqual([]); expect(a.d.styles()).toEqual(c.d.styles());
    expect(order(pa.grid)).toEqual(['pompeii', 'torrevieja', 'krewe', 'newer', 'old-one']); expect(pa.items.pompeii.getAttribute('data-tll-lead')).toBe('1');
    expect(pa.h1.textContent).toBe('Five stories, all worth the detour.');
    expect(chipNames(pa.row)).toEqual(['all', 'Africa', 'Americas', 'Antarctica', 'Asia', 'Europe', 'Middle East', 'Oceania']);
  });
  it('the page script missing: the search bar ends where it was served', () => {
    const a = start(); const pa = STORIES(a.d, { lead: null }); expect(pa.inner.querySelector('.tllsb-form')).not.toBe(null);
    a.d.parsed(); a.d.run(0);
    expect(pa.inner.querySelector('.tllsb-form')).toBe(null); expect(pa.form.parentNode).toBe(pa.bi); expect(pa.form.nextSibling).toBe(pa.clr); expect(pa.inner.hasAttribute('data-tll-merged')).toBe(false); expect(pa.bar.hasAttribute('style')).toBe(false);
    expect(pa.grid.querySelector('[data-tll-lead]')).toBe(null);
    const c = start({ withLayer: false }); const pc = STORIES(c.d, { lead: null }); chunkRuns(c.d); c.d.parsed(); c.d.run(0);
    chunkRuns(a.d); a.d.run(0); expect(pa.b.html()).toBe(pc.b.html());
  });
  it('the page script throwing at its start: nothing of the early merge or lead mark is left', () => {
    const bad = "throw new Error('lab');" + LEAD_JS;
    const a = start(); const pa = STORIES(a.d, { lead: bad }); chunkRuns(a.d); a.d.parsed(); a.d.run(700);
    const c = start({ withLayer: false }); const pc = STORIES(c.d, { lead: bad }); chunkRuns(c.d); c.d.parsed(); c.d.run(700);
    expect(pa.inner.querySelector('.tllsb-form')).toBe(null); expect(pa.grid.querySelector('[data-tll-lead]')).toBe(null); expect(pa.b.html()).toBe(pc.b.html());
  });
  it('the first card leads from the moment the parser adds it, before its own content and the rest of the grid arrive', () => {
    const { d } = start(); const p = STORIES(d, { upTo: 'bar' }); d.el(p.main, 'section', { class: 'tllvb-bar' });
    const gs = d.el(p.main, 'section', { class: 'tll-library-grid-section' }); const grid = d.el(d.el(gs, 'div', { class: 'w-dyn-list' }), 'div', { class: 'tll-lib-grid w-dyn-items' });
    const card = (slug) => { const it = d.el(grid, 'div', { class: 'w-dyn-item', 'data-k': slug }); const a = d.el(it, 'a', { 'data-tll-card': 'cms', class: 'tll-lib-card', href: '/stories/' + slug }); d.el(a, 'div', { 'data-tll-date': '1' }, 'October 29, 2026'); return it; };
    // a frame can be painted with the first card half parsed: it has to be the lead in that frame already
    const first = d.el(grid, 'div', { class: 'w-dyn-item', 'data-k': 'first' }); expect(first.getAttribute('data-tll-lead')).toBe('1'); expect(first.childNodes.length).toBe(0);
    const a1 = d.el(first, 'a', { 'data-tll-card': 'cms', class: 'tll-lib-card', href: '/stories/first' }); d.el(a1, 'div', { 'data-tll-date': '1' }, 'October 29, 2026');
    card('second'); expect(first.getAttribute('data-tll-lead')).toBe('1'); expect(grid.querySelectorAll('[data-tll-lead]').length).toBe(1);
  });
  it('the whole grid, when the page\'s rules name the first card: the mark stays and no card is moved', () => {
    const { d } = start(); const p = STORIES(d, { upTo: 'footer' });
    expect(order(p.grid)).toEqual(CARDS.map((c) => c[0])); expect(p.items.pompeii.getAttribute('data-tll-lead')).toBe('1'); expect(p.grid.querySelectorAll('[data-tll-lead]').length).toBe(1);
    const c = start({ withLayer: false }); const pc = STORIES(c.d); c.d.parsed(); expect(pc.grid.querySelector('[data-tll-lead]').getAttribute('data-k')).toBe('pompeii'); // the card the page marks
  });
  it('the whole grid, when the page\'s rules name another card: the order the page gives it (newest first), the pick in front, that card marked', () => {
    const cards = [['a', 'October 1, 2026', null], ['b', 'October 29, 2026', null], ['c', 'October 5, 2026', ''], ['d', 'October 2, 2026', 'w-condition-invisible']];
    const { d } = start(); const p = STORIES(d, { cards, upTo: 'grid' });
    expect(p.items.a.getAttribute('data-tll-lead')).toBe('1');
    d.el(p.main, 'section', { class: 'tll-library-news' });
    expect(order(p.grid)).toEqual(['c', 'b', 'd', 'a']); expect(p.items.c.getAttribute('data-tll-lead')).toBe('1'); expect(p.grid.querySelectorAll('[data-tll-lead]').length).toBe(1);
    // the same grid as the page's two scripts leave it without the layer
    const c = start({ withLayer: false }); const pc = STORIES(c.d, { cards }); c.d.parsed(); expect(order(pc.grid)).toEqual(order(p.grid)); expect(pc.grid.querySelector('[data-tll-lead]').getAttribute('data-k')).toBe('c');
  });
  it('without a pick the newest by date leads (the first of two on the same day); a card the site hides cannot lead', () => {
    const cards = [['a', 'October 1, 2026', null], ['b', 'October 29, 2026', null], ['c', 'October 29, 2026', null]];
    const one = start(); const p1 = STORIES(one.d, { cards, upTo: 'footer' });
    expect(order(p1.grid)).toEqual(['b', 'c', 'a']); expect(p1.items.b.getAttribute('data-tll-lead')).toBe('1');
    const hide = (n) => n.getAttribute && n.getAttribute('data-k') === 'b';
    const two = start({ hidden: hide }); const p2 = STORIES(two.d, { cards, upTo: 'footer' });
    expect(order(p2.grid)).toEqual(['b', 'c', 'a']); expect(p2.items.c.getAttribute('data-tll-lead')).toBe('1'); expect(p2.grid.querySelectorAll('[data-tll-lead]').length).toBe(1);
    const ctl = start({ hidden: hide, withLayer: false }); const pc = STORIES(ctl.d, { cards }); ctl.d.parsed(); expect(pc.grid.querySelector('[data-tll-lead]').getAttribute('data-k')).toBe('c');
  });
  it('the early mark on the first card moves when the whole grid has a newer pick', () => {
    const cards = [['a', 'October 1, 2026', ''], ['b', 'October 29, 2026', '']];
    const { d } = start(); const p = STORIES(d, { cards, upTo: 'grid' }); expect(p.items.a.getAttribute('data-tll-lead')).toBe('1');
    d.el(p.main, 'section', { class: 'tll-library-news' });
    expect(order(p.grid)).toEqual(['b', 'a']); expect(p.items.b.getAttribute('data-tll-lead')).toBe('1'); expect(p.items.a.hasAttribute('data-tll-lead')).toBe(false);
  });
  it('puts a changed order back and takes the mark off before the page scripts run', () => {
    const cards = [['a', 'October 1, 2026', null], ['b', 'October 29, 2026', null], ['c', 'October 3, 2026', null]];
    const { d } = start(); const probe = "document.addEventListener('DOMContentLoaded',function(){window.__seen=[[].map.call(document.querySelector('.tll-lib-grid').children,function(k){return k.getAttribute('data-k');}).join(),!!document.querySelector('[data-tll-lead]')];});";
    const p = STORIES(d, { cards, chips: probe + CHIPS_JS }); expect(order(p.grid)).toEqual(['b', 'c', 'a']);
    d.parsed(); expect(d.window.__seen).toEqual(['a,b,c', false]);
    expect(order(p.grid)).toEqual(['b', 'c', 'a']); expect(p.items.b.getAttribute('data-tll-lead')).toBe('1');
  });
  it('the chip script missing: the cards end in the order they were served in, as without the layer', () => {
    const cards = [['a', 'October 1, 2026', null], ['b', 'October 29, 2026', null]];
    const a = start(); const pa = STORIES(a.d, { cards, chips: null }); chunkRuns(a.d); expect(order(pa.grid)).toEqual(['b', 'a']); a.d.parsed(); a.d.run(700);
    const c = start({ withLayer: false }); const pc = STORIES(c.d, { cards, chips: null }); chunkRuns(c.d); c.d.parsed(); c.d.run(700);
    expect(order(pa.grid)).toEqual(['a', 'b']); expect(pa.b.html()).toBe(pc.b.html());
  });
  it('with a search (?q=) the lead is left to the page', () => {
    const { d } = start({ search: '?q=lisbon' }); const p = STORIES(d, { upTo: 'footer' });
    expect(p.grid.querySelector('[data-tll-lead]')).toBe(null); expect(p.inner.querySelector('.tllsb-form')).not.toBe(null);
  });
  it('leaves the place chips to our chunk (put in early, the longer row changed its wrap on tablets when the web font came in)', () => {
    const { d, ch } = start(); const p = STORIES(d, { upTo: 'footer' });
    expect(chipNames(p.row)).toEqual(['all', 'Europe', 'Africa', 'Americas', 'Antarctica']);
    d.exec(PLACES_JS); fireOn(ch, 'load'); d.parsed(); expect(chipNames(p.row)).toEqual(['all', 'Africa', 'Americas', 'Antarctica', 'Asia', 'Europe', 'Middle East', 'Oceania']);
  });
  it('leaves the story count in the title to our chunk', () => {
    const { d, ch } = start(); const p = STORIES(d, { upTo: 'footer' });
    expect(p.h1.html()).toBe('<h1 class="tll-display-xl tll-library-title">Stories, all worth the <em class="inline-em">detour</em>.</h1>');
    d.exec(COUNT_JS); fireOn(ch, 'load'); d.parsed(); expect(p.h1.textContent).toBe('Five stories, all worth the detour.');
  });
  const FAM = { h1: '"Playfair Display", Georgia, serif', em: '"Playfair Display", TLLSerifG, TLLSerifN, TLLSerifT, Georgia, serif' };
  it('keeps the title in its own fallback faces until both font files are in, then lets go', async () => {
    const { d } = start({ families: FAM }); STORIES(d, { upTo: 'filters' });
    const st = d.document.getElementById('tll-es-libtitle-v1'); expect(st).not.toBe(null);
    const sel = 'h1.tll-library-title.tll-library-title.tll-library-title.tll-library-title';
    expect(st.textContent).toBe(sel + '{font-family:Georgia, serif!important}' + sel + ' em{font-family:TLLSerifG, TLLSerifN, TLLSerifT, Georgia, serif!important}');
    expect(d.fontJobs.map((j) => j.f)).toEqual(['800 1em "Playfair Display"', 'italic 800 1em "Playfair Display"']);
    d.fontJobs[0].res(); await null; await null; expect(d.document.getElementById('tll-es-libtitle-v1')).not.toBe(null); // one file in: still held
    d.fontJobs[1].res(); await new Promise((r) => setImmediate(r)); expect(d.document.getElementById('tll-es-libtitle-v1')).toBe(null);
  });
  it('lets the title go when a font file fails or after 20 s, and holds nothing when both files are already in', async () => {
    const a = start({ families: FAM }); STORIES(a.d, { upTo: 'filters' }); a.d.fontJobs[1].rej(new Error('x')); await new Promise((r) => setImmediate(r)); expect(a.d.document.getElementById('tll-es-libtitle-v1')).toBe(null);
    const b = start({ families: FAM }); STORIES(b.d, { upTo: 'filters' }); b.d.run(20000); expect(b.d.document.getElementById('tll-es-libtitle-v1')).toBe(null);
    const c = start({ families: FAM, fontsLoaded: ['800 1em "Playfair Display"', 'italic 800 1em "Playfair Display"'] }); STORIES(c.d, { upTo: 'filters' }); expect(c.d.document.getElementById('tll-es-libtitle-v1')).toBe(null); expect(c.d.fontJobs.length).toBe(0);
    const n = start({ families: { h1: 'Georgia, serif' } }); STORIES(n.d, { upTo: 'filters' }); expect(n.d.document.getElementById('tll-es-libtitle-v1')).toBe(null);
  });
  it('20 s without a page-parsed event: merge and lead are handed back', () => {
    const { d } = start(); const p = STORIES(d, { upTo: 'footer' }); d.run(20000);
    expect(p.inner.querySelector('.tllsb-form')).toBe(null); expect(p.form.parentNode).toBe(p.bi); expect(p.grid.querySelector('[data-tll-lead]')).toBe(null); expect(order(p.grid)).toEqual(CARDS.map((c) => c[0]));
  });
});

// ---- the profile ----
const ROOT = { 'data-pf5': 'root', hidden: '', 'data-name': 'Ada Example', 'data-slug': 'ada-example', 'data-one-line': 'One line about travel.', 'data-home': 'Lisbon, Portugal', 'data-flags': 'pt,br,dk',
  'data-credit': 'Full', 'data-pen': '', 'data-contact': 'Email', 'data-email': '', 'data-visibility': 'Public', 'data-snapshot': '{"countries":12,"antarctica":true,"places":14,"layovers":3}', 'data-badge': 'EDITOR',
  'data-links-shown': 'instagram,website', 'data-since': 'May 19, 2026', 'data-member': 'mem_x', 'data-link-instagram': 'https://www.instagram.com/example/', 'data-link-youtube': 'https://www.youtube.com/@example',
  'data-link-website': 'https://example.org', 'data-link-tiktok': '', 'data-from-place': '', 'data-makes': '', 'data-partners': '' };
const PROFILE = (d, { rootAttrs = {}, flags = ['expats'], photo = true, by = ['ada-example', 'someone-else', 'ada-example'], upTo = 'end', pf5 = PF5_JS, notes = PF5N_JS } = {}) => {
  const b = d.body(); const art = d.el(b, 'article', { class: 'tll-traveler-profile' }); NAV(d, art);
  const sec = d.el(art, 'section', { 'data-tll-prof': 'hero', class: 'tll-section-dark' }); const con = d.el(sec, 'div', { class: 'tll-container' });
  const root = d.el(con, 'div', { ...ROOT, ...rootAttrs }); const fl = d.el(root, 'div', { 'data-pf5': 'flags' }); flags.forEach((k) => d.el(fl, 'span', { 'data-pf5-flag': k }));
  const emb = d.el(con, 'div', { class: 'w-embed w-script' }); if (notes !== null) d.inline(emb, 'tll-pf5-n-v1', notes);
  const hero = d.el(con, 'div', { 'data-pf5': 'hero' }); const ph = d.el(hero, 'div', { 'data-pf5': 'photo' }); d.el(ph, 'img', photo ? { src: 'https://cdn.example/avatar.jpeg', loading: 'lazy', alt: 'x' } : { class: 'w-dyn-bind-empty', loading: 'lazy' });
  const id = d.el(hero, 'div', { 'data-pf5': 'id' }); d.el(id, 'p', { 'data-pf5': 'eyebrow' }); const slot = d.el(id, 'div', { 'data-pf5': 'name-slot' }); d.el(slot, 'h1', { 'data-tll-prof': 'name', class: 'tll-display-xl' }, (rootAttrs['data-name'] || ROOT['data-name']));
  d.el(id, 'p', { 'data-pf5': 'one-line' }); d.el(id, 'p', { 'data-pf5': 'meta' }); d.el(id, 'div', { 'data-pf5': 'stats' }); d.el(id, 'div', { 'data-pf5': 'buttons' }); d.el(id, 'p', { 'data-pf5': 'contact-note' });
  const out = { b, art, sec, root, hero, ph, id };
  if (upTo === 'hero') return out;
  const about = d.el(art, 'section', { 'data-pf5': 'about' }); d.el(about, 'div', { 'data-pf5': 'bio', class: 'w-richtext' }, 'About text.');
  if (upTo === 'about') return out;
  const st = d.el(art, 'section', { 'data-pf5': 'stories' }); d.el(st, 'h2', { 'data-pf5': 'stories-head' }, 'Stories'); d.el(st, 'p', { 'data-pf5': 'stories-meta' });
  const list = d.el(st, 'div', { 'data-pf5': 'stories-list' });
  by.forEach((who, i) => { const it = d.el(list, 'div', { class: 'w-dyn-item' }); d.el(it, 'a', { 'data-pf5': 'story-card', 'data-by': who, 'data-st3-slug': 's' + i, 'data-place': 'Lisbon' }); });
  d.el(st, 'p', { 'data-pf5': 'stories-empty', hidden: '' });
  if (upTo === 'list') return out;
  d.el(art, 'section', { 'data-pf5': 'foot' });
  if (pf5 !== null) d.inline(b, 'tll-pf5-profile-js-v1', pf5);
  return out; };
// the core's own home base rule (tll-phase0-v1, hb(false)): the home span and the dot after it come out of the meta line
const homeOut = (id, home) => { const meta = id.querySelector('[data-pf5="meta"]'); const sp = meta.children; sp.forEach((e, i) => { if (e.tagName === 'SPAN' && e.textContent.trim() === home) { const nx = sp[i + 1]; e.remove(); if (nx && nx.textContent.trim() === '·') nx.remove(); } }); };
const ghostOf = (p) => p.hero.querySelector('[data-pf5="id"][data-tll-es-ghost]');
const realOf = (p) => p.hero.children.find((n) => n.getAttribute('data-pf5') === 'id' && !n.hasAttribute('data-tll-es-ghost'));
const asReal = (g) => g.html().replace(' data-tll-es-ghost="1"', '');
// the stand-in's flags are places only: the page's own flags carry the file address and ask for it lazily
const noFlagFiles = (h) => h.replace(/(<img alt="" class="pf5-flag" height="28") loading="lazy" src="[^"]*"/g, '$1');

describe('tll-early-state-v1: the profile head (C3)', () => {
  const start = (withLayer = true, pathName = '/contributors/ada-example') => { const d = makeDom({ path: pathName }); HEAD(d, { withLayer }); return d; };
  // what the page code makes of the real column without the layer, with the home base taken out as the core does once the Worker has answered
  const pageMade = (opt) => { const c = start(false); const pc = PROFILE(c, opt); c.parsed(); c.run(0); homeOut(pc.id, (opt.rootAttrs && opt.rootAttrs['data-home']) !== undefined ? opt.rootAttrs['data-home'] : ROOT['data-home']); expect(c.thrown).toEqual([]); return pc.id.html(); };
  const CASES = {
    'full name, flags, snapshot, links': {},
    'first name only, no flags, relay contact': { rootAttrs: { 'data-credit': 'First', 'data-flags': '', 'data-contact': 'Relay' } },
    'pen name, one flag, instagram contact, ranges on': { rootAttrs: { 'data-credit': 'Pen', 'data-pen': 'Quill', 'data-flags': 'pt', 'data-contact': 'Instagram' }, flags: ['ranges'] },
    'email shown, no snapshot, no stories, no since': { rootAttrs: { 'data-contact': 'Email', 'data-email': 'ada@example.org', 'data-snapshot': '', 'data-since': '', 'data-links-shown': '' }, by: ['someone-else'] },
    'contact off, one story, no home': { rootAttrs: { 'data-contact': 'Off', 'data-home': '' }, by: ['ada-example'] },
    'from place, makes, portfolio, partners, open': { rootAttrs: { 'data-from-place': 'Austin, Texas', 'data-makes': 'photos, words', 'data-partners': '{"store":"https://shop.example.org","links":[{"name":"Gear Co","url":"https://gear.example.org"}],"open":true,"portfolio":"https://work.example.org"}' }, flags: ['creators'] },
    'from place without flags, makes switched off': { rootAttrs: { 'data-flags': '', 'data-from-place': 'Austin, Texas', 'data-makes': 'photos' }, flags: [] },
    'only a home base and a from place': { rootAttrs: { 'data-flags': '', 'data-since': '', 'data-from-place': 'Porto' } },
  };
  for (const [name, opt] of Object.entries(CASES)) {
    it('the stand-in is what the page code makes, without the home base: ' + name, () => {
      const d = start(); const p = PROFILE(d, { ...opt, upTo: 'list' }); d.el(p.art, 'section', { 'data-pf5': 'foot' });
      const g = ghostOf(p); expect(g).not.toBe(null);
      expect(asReal(g)).toBe(noFlagFiles(pageMade(opt))); expect(g.querySelectorAll('img').every((i) => !i.hasAttribute('src'))).toBe(true);
      expect(g.textContent.includes((opt.rootAttrs && opt.rootAttrs['data-home'] !== undefined ? opt.rootAttrs['data-home'] : ROOT['data-home']) || '\u0000')).toBe(false);
    });
  }
  it('goes in when the hero has arrived whole; the real column is not touched and not shown', () => {
    const d = start(); const p = PROFILE(d, { upTo: 'hero' }); const raw = p.id.html();
    expect(ghostOf(p)).toBe(null); expect(d.styles()).toEqual([]);
    d.el(p.art, 'section', { 'data-pf5': 'about' });
    const g = ghostOf(p); expect(g.previousSibling).toBe(p.id); expect(p.id.html()).toBe(raw);
    expect(d.styles()).toEqual(['tll-es-pf5-v1']); expect(d.document.getElementById('tll-es-pf5-v1').textContent).toBe('[data-pf5="hero"]>[data-pf5="id"]:not([data-tll-es-ghost]){display:none!important}');
    expect(d.document.querySelector('[data-pf5="buttons"]')).toBe(p.id.querySelector('[data-pf5="buttons"]')); // the page's own lookups still find the real column first
  });
  it('keeps room for the STORIES cell until the story list has arrived, then writes the count', () => {
    const d = start(); const p = PROFILE(d, { upTo: 'about' }); const g = ghostOf(p); const cells = () => g.querySelector('[data-pf5="stats"]').children.filter((n) => n.tagName === 'DIV');
    expect(cells().map((c) => c.lastChild.textContent)).toEqual(['COUNTRIES', 'PLACES', 'STORIES', 'LAYOVERS']); expect(cells()[2].style.visibility).toBe('hidden');
    const d2 = start(); const p2 = PROFILE(d2, { upTo: 'list' }); d2.el(p2.art, 'section', { 'data-pf5': 'foot' }); const g2 = ghostOf(p2);
    const c2 = g2.querySelector('[data-pf5="stats"]').children.filter((n) => n.tagName === 'DIV'); expect(c2[2].firstChild.textContent).toBe('2'); expect(c2[2].hasAttribute('style')).toBe(false);
  });
  it('puts the badge (and the initials when there is no photo) on the photo early and takes them off before the page adds its own', () => {
    const d = start(); const p = PROFILE(d, { photo: false, upTo: 'list' }); d.el(p.art, 'section', { 'data-pf5': 'foot' });
    expect(p.ph.children.map((n) => n.className + ':' + n.textContent).slice(1)).toEqual(['pf5-initials:AE', 'pf5-badge:EDITOR']);
    d.inline(p.b, 'tll-pf5-profile-js-v1', "document.addEventListener('DOMContentLoaded',function(){window.__seen=document.querySelector('[data-pf5=\"photo\"]').children.length;});" + PF5_JS);
    d.parsed(); expect(d.window.__seen).toBe(1); expect(p.ph.children.map((n) => n.className).slice(1)).toEqual(['pf5-initials', 'pf5-badge']);
  });
  it('lets the stand-in go one timer after the page-parsed listeners, after the notes embed has finished the real column', () => {
    const opt = CASES['from place, makes, portfolio, partners, open'];
    const d = start(); const p = PROFILE(d, opt); const g = ghostOf(p); const want = asReal(g);
    d.parsed();
    expect(ghostOf(p)).toBe(g); expect(d.styles()).toEqual(['tll-es-pf5-v1']); expect(p.id.querySelector('.pf5-partners')).toBe(null); // the real column is built, the notes not yet in
    d.run(0);
    expect(ghostOf(p)).toBe(null); expect(d.styles()).toEqual([]); expect(realOf(p)).toBe(p.id);
    homeOut(p.id, ROOT['data-home']); expect(noFlagFiles(p.id.html())).toBe(want); expect(d.thrown).toEqual([]);
  });
  it('the finished page is the one the page code makes without the layer', () => {
    for (const opt of Object.values(CASES)) { const a = start(); const pa = PROFILE(a, opt); a.parsed(); a.run(0); a.load(); a.run(100);
      const c = start(false); const pc = PROFILE(c, opt); c.parsed(); c.run(0); c.load(); c.run(100);
      expect(pa.b.html()).toBe(pc.b.html()); expect(a.styles()).toEqual(c.styles()); expect(a.head.html()).toBe(c.head.html()); }
  });
  it('the page script missing or throwing: the stand-in goes and the column is as it was served', () => {
    for (const pf5 of [null, "throw new Error('lab');" + PF5_JS]) {
      const a = start(); const pa = PROFILE(a, { pf5 }); expect(ghostOf(pa)).not.toBe(null); a.parsed(); a.run(0);
      const c = start(false); const pc = PROFILE(c, { pf5 }); c.parsed(); c.run(0);
      expect(ghostOf(pa)).toBe(null); expect(a.styles()).toEqual([]); expect(pa.b.html()).toBe(pc.b.html());
    }
  });
  it('without the notes embed the stand-in leaves its parts out', () => {
    const opt = { ...CASES['from place, makes, portfolio, partners, open'], notes: null };
    const d = start(); const p = PROFILE(d, { ...opt, upTo: 'list' }); d.el(p.art, 'section', { 'data-pf5': 'foot' });
    expect(asReal(ghostOf(p))).toBe(noFlagFiles(pageMade(opt))); expect(ghostOf(p).querySelector('.pf5-partners')).toBe(null);
  });
  it('20 s without a page-parsed event: the stand-in and the early photo parts go', () => {
    const d = start(); const p = PROFILE(d, { upTo: 'list' }); d.el(p.art, 'section', { 'data-pf5': 'foot' }); d.run(20000);
    expect(ghostOf(p)).toBe(null); expect(d.styles()).toEqual([]); expect(p.ph.children.length).toBe(1);
  });
  it('a profile set to Off gets no stand-in and no early badge (the page hides it from visitors once its code has run)', () => {
    const d = start(); const p = PROFILE(d, { rootAttrs: { 'data-visibility': 'Off' }, upTo: 'list' }); d.el(p.art, 'section', { 'data-pf5': 'foot' });
    expect(ghostOf(p)).toBe(null); expect(d.styles()).toEqual([]); expect(p.ph.children.length).toBe(1);
    const u = start(); const pu = PROFILE(u, { rootAttrs: { 'data-visibility': 'Unlisted' }, upTo: 'list' }); u.el(pu.art, 'section', { 'data-pf5': 'foot' }); expect(ghostOf(pu)).not.toBe(null);
  });
  it('no root, or another path: nothing', () => {
    const d = start(true, '/contributors'); const p = PROFILE(d, { upTo: 'list' }); d.el(p.art, 'section'); expect(ghostOf(p)).toBe(null);
    const e = start(true, '/pets/some-pet'); const q = PROFILE(e, { upTo: 'list' }); e.el(q.art, 'section'); expect(ghostOf(q)).toBe(null);
  });
});

describe('tll-early-state-v1 in the build', () => {
  it('is in the core, after tll-first-paint-v1 and without its comments', () => {
    const a = core.indexOf('/* src/site-layers/tll-first-paint-v1.js */'); const b = core.indexOf('/* src/site-layers/tll-early-state-v1.js */'); const c = core.indexOf('/* src/site-layers/tll-stories-noimg-v1.js */');
    expect(a).toBeGreaterThan(0); expect(b).toBeGreaterThan(a); expect(c).toBeGreaterThan(b);
    const body = core.slice(b, c); expect(body.includes('layout shift sweep part B')).toBe(false); expect(body.includes("W.addEventListener('DOMContentLoaded',function(){parsed=1;handBack();},true);")).toBe(true);
    expect(layerSrc.includes('layout shift sweep part B')).toBe(true);
  });
  it('the build checks the page code the layer follows', () => {
    expect(build.includes("EARLY_STATE = 'src/site-layers/tll-early-state-v1.js'")).toBe(true); expect(build.includes('early_state_checks()')).toBe(true);
    for (const f of ['src/site/live-2026-11-13/fonts/site-head.after.html', 'src/pages/stories/live-2026-11-16/tll-lib-lead-v1.live.html', 'src/pages/stories/live-2026-11-16/tll-lib-chips-v1.live.html',
      'src/pages/contributors-template/live-2026-11-10/after/tll-pf5-n-v1.html', 'src/site-layers/tll-phase0-v1.js']) expect(build.includes(f)).toBe(true);
  });
  it('leaves our stories chunk alone: the layer does not look for it and no chunk source changed', () => {
    const code = layerSrc.slice(layerSrc.indexOf('(function(){'));
    expect(code.includes('chunk')).toBe(false); expect(code.includes('data-tll-place')).toBe(false); expect(code.includes('data-tll-count')).toBe(false);
    const chunk = read('src', 'site-layers', 'chunks', 'stories.js');
    expect(chunk.includes("var ORDER=['all','Africa','Americas','Antarctica','Asia','Europe','Middle East','Oceania'];")).toBe(true);
  });
  it('touches no data-ms-* attribute and no form or field name', () => {
    const code = layerSrc.slice(layerSrc.indexOf('(function(){'));
    // the only data-ms-* name in the code is data-ms-content, and it is only read: to see that the nav's parent is such a wrapper, and in the selector of the nav's early style
    const bare = code.replace(/\/\*[\s\S]*?\*\//g, '');
    expect([...new Set(bare.match(/data-ms-[a-z]+/g))]).toEqual(['data-ms-content']); expect(bare.match(/data-ms-[a-z]+/g).length).toBe(2);
    expect(bare.includes("w.hasAttribute('data-ms-content')")).toBe(true); expect(bare.includes("[data-ms-content]:has(>nav['+MARK+'])")).toBe(true);
    expect(/setAttribute\('data-ms|removeAttribute\('data-ms|\.name\s*=/.test(code)).toBe(false); expect(/setAttribute\(MARK|removeAttribute\(MARK/.test(bare)).toBe(true); expect(bare.includes("MARK='data-tll-es-nav'")).toBe(true);
  });
});
