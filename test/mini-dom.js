// A small stand-in DOM for running the site's browser scripts under vitest. The repo has no jsdom, and the only browser on
// the machine is often busy, so this covers what the /submit scripts use: elements parsed from an HTML string, simple CSS
// selectors (tag, #id, .class, [attr], [attr="v"], [attr*="v" i], descendant and child combinators, comma lists), events with
// capture and bubble phases, form.requestSubmit with the HTML rule that matters here ("if the form is already firing its
// submission events, return"), a manual clock for setTimeout and setInterval, and MutationObserver callbacks fired by hand.
// It is a test helper, not a browser: layout is whatever a test sets in el._rect, and getComputedStyle only knows display.
// Not a test file itself (no .test. in the name), so vitest does not collect it.

const VOID = new Set(['input', 'br', 'img', 'meta', 'link', 'hr', 'source', 'wbr', 'area', 'base', 'col', 'embed', 'track']);
const RAW = new Set(['script', 'style']);
const BOOL = ['hidden', 'disabled', 'required', 'multiple', 'checked:defaultChecked', 'readonly:readOnly'];
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ' };
const decode = (s) => s.replace(/&(amp|lt|gt|quot|nbsp|#x[0-9a-f]+|#\d+);/gi, (m, e) => (e[0] === '#'
  ? String.fromCodePoint(/^#x/i.test(e) ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENT[e.toLowerCase()]));

export function createDom({ pathname = '/submit', html = '' } = {}) {
  let now = 0; let seq = 0; const timers = []; const observers = []; const store = new Map();
  const dom = { pathname };

  class Text {
    constructor(v) { this.nodeType = 3; this.nodeValue = String(v); this.parentNode = null; }
    get textContent() { return this.nodeValue; }
    set textContent(v) { this.nodeValue = String(v); }
    get nextSibling() { return sib(this, 1); }
    remove() { detach(this); }
  }

  function sib(n, d) { const p = n.parentNode; if (!p) return null; const i = p.childNodes.indexOf(n); return p.childNodes[i + d] || null; }
  function detach(n) { const p = n.parentNode; if (p) { p.childNodes.splice(p.childNodes.indexOf(n), 1); n.parentNode = null; } }

  class Element {
    constructor(tag) {
      this.nodeType = 1; this.tagName = tag.toUpperCase(); this.localName = tag.toLowerCase(); this.attrs = new Map(); this.childNodes = [];
      this.parentNode = null; this.listeners = []; this._value = null; this.files = null; this._checked = null; this._rect = null;
      const el = this;
      this.style = new Proxy({}, { set(o, k, v) { if (k === 'cssText') { String(v).split(';').forEach((d) => { const [p, ...r] = d.split(':'); if (p && r.length) o[p.trim().replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = r.join(':').replace(/!important/, '').trim(); }); } else o[k] = v; return true; } });
      this.dataset = new Proxy({}, {
        get(o, k) { const v = el.getAttribute('data-' + String(k).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())); return v === null ? undefined : v; },
        set(o, k, v) { el.setAttribute('data-' + String(k).replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()), String(v)); return true; },
      });
      this.classList = {
        contains: (c) => el.className.split(/\s+/).includes(c),
        add: (...cs) => { cs.forEach((c) => { if (!el.classList.contains(c)) el.className = (el.className + ' ' + c).trim(); }); },
        remove: (...cs) => { el.className = el.className.split(/\s+/).filter((x) => x && !cs.includes(x)).join(' '); },
        toggle: (c, force) => { const on = force === undefined ? !el.classList.contains(c) : !!force; if (on) el.classList.add(c); else el.classList.remove(c); return on; },
      };
      if (this.localName === 'canvas') {
        this.width = 0; this.height = 0;
        this.getContext = () => ({ drawImage() {}, fillRect() {} });
        this.toBlob = (cb, type) => setTimeoutF(() => cb(new Blob(['clean-jpeg'], { type: type || 'image/png' })), 0);
      }
    }
    getAttribute(k) { return this.attrs.has(k) ? this.attrs.get(k) : null; }
    setAttribute(k, v) { this.attrs.set(k, String(v)); }
    hasAttribute(k) { return this.attrs.has(k); }
    removeAttribute(k) { this.attrs.delete(k); }
    get attributes() { return [...this.attrs].map(([name, value]) => ({ name, value })); }
    get id() { return this.getAttribute('id') || ''; } set id(v) { this.setAttribute('id', v); }
    get className() { return this.getAttribute('class') || ''; } set className(v) { this.setAttribute('class', v); }
    get name() { return this.getAttribute('name') || ''; } set name(v) { this.setAttribute('name', v); }
    get type() {
      const t = (this.getAttribute('type') || '').toLowerCase();
      if (this.localName === 'input') return t || 'text';
      if (this.localName === 'button') return t || 'submit';
      if (this.localName === 'textarea') return 'textarea';
      if (this.localName === 'select') return 'select-one';
      return t;
    }
    set type(v) { this.setAttribute('type', v); }
    get href() { return this.getAttribute('href') || ''; } set href(v) { this.setAttribute('href', v); }
    get placeholder() { return this.getAttribute('placeholder') || ''; } set placeholder(v) { this.setAttribute('placeholder', v); }
    get value() {
      if (this._value !== null) return this._value;
      if (this.localName === 'textarea') return this.textContent;
      if (this.localName === 'select') { const o = this.options.find((x) => x.hasAttribute('selected')) || this.options[0]; return o ? o.value : ''; }
      if (this.localName === 'option') return this.hasAttribute('value') ? this.getAttribute('value') : this.textContent;
      return this.getAttribute('value') || (this.type === 'checkbox' || this.type === 'radio' ? 'on' : '');
    }
    set value(v) { this._value = String(v); }
    get checked() { return this._checked === null ? this.hasAttribute('checked') : this._checked; } set checked(v) { this._checked = !!v; }
    get options() { return this.querySelectorAll('option'); }
    add(o) { this.appendChild(o); }
    get form() { return this.closest('form'); }
    get elements() { return this.querySelectorAll('input,select,textarea,button'); }
    get children() { return this.childNodes.filter((n) => n.nodeType === 1); }
    get firstChild() { return this.childNodes[0] || null; }
    get lastChild() { return this.childNodes[this.childNodes.length - 1] || null; }
    get nextSibling() { return sib(this, 1); }
    get previousSibling() { return sib(this, -1); }
    get nextElementSibling() { let n = this.nextSibling; while (n && n.nodeType !== 1) n = n.nextSibling; return n; }
    get parentElement() { return this.parentNode && this.parentNode.nodeType === 1 ? this.parentNode : null; }
    get textContent() { return this.childNodes.map((c) => c.textContent).join(''); }
    set textContent(v) { this.childNodes.forEach((c) => { c.parentNode = null; }); this.childNodes = []; if (String(v)) this.appendChild(new Text(v)); }
    get nodeValue() { return null; }
    get innerHTML() { return this.textContent; }
    set innerHTML(v) { this.textContent = ''; parseInto(this, String(v)); }
    appendChild(c) { if (c.parentNode) detach(c); c.parentNode = this; this.childNodes.push(c); return c; }
    insertBefore(c, ref) { if (!ref) return this.appendChild(c); if (c.parentNode) detach(c); c.parentNode = this; this.childNodes.splice(this.childNodes.indexOf(ref), 0, c); return c; }
    replaceChild(c, old) { this.insertBefore(c, old); detach(old); return old; }
    removeChild(c) { detach(c); return c; }
    remove() { detach(this); }
    insertAdjacentElement(pos, el) {
      if (pos === 'afterend') return this.parentNode.insertBefore(el, this.nextSibling);
      if (pos === 'beforebegin') return this.parentNode.insertBefore(el, this);
      if (pos === 'afterbegin') return this.insertBefore(el, this.firstChild);
      return this.appendChild(el);
    }
    contains(n) { while (n) { if (n === this) return true; n = n.parentNode; } return false; }
    matches(sel) { return parseSelector(sel).some((chain) => matchChain(this, chain)); }
    closest(sel) { let n = this; while (n && n.nodeType === 1) { if (n.matches(sel)) return n; n = n.parentNode; } return null; }
    querySelectorAll(sel) { const chains = parseSelector(sel); const out = []; walk(this, (n) => { if (n !== this && n.nodeType === 1 && chains.some((c) => matchChain(n, c))) out.push(n); }); return out; }
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
    getElementsByTagName(t) { return this.querySelectorAll(t); }
    addEventListener(type, fn, opt) { const capture = opt === true || !!(opt && opt.capture); if (!this.listeners.some((l) => l.type === type && l.fn === fn && l.capture === capture)) this.listeners.push({ type, fn, capture }); }
    removeEventListener(type, fn, opt) { const capture = opt === true || !!(opt && opt.capture); this.listeners = this.listeners.filter((l) => !(l.type === type && l.fn === fn && l.capture === capture)); }
    dispatchEvent(ev) { return dispatch(this, ev); }
    focus() { doc.activeElement = this; }
    blur() {}
    select() {}
    setSelectionRange() {}
    scrollIntoView(opt) { (dom.scrolls || (dom.scrolls = [])).push({ el: this, opt }); }
    getBoundingClientRect() { return this._rect || { top: 0, bottom: 0, height: 0, left: 0, right: 0, width: 0 }; }
    click() {
      if (this.disabled) return;
      const ev = new Event('click', { bubbles: true, cancelable: true }); dispatch(this, ev);
      if (ev.defaultPrevented) return;
      const f = this.form;
      if (f && (this.localName === 'button' || this.localName === 'input') && this.type === 'submit') f.requestSubmit(this);
      if (this.localName === 'input' && this.type === 'checkbox') this.checked = !this.checked;
    }
    // Form submission, as far as it matters here. HTML: "If form's firing submission events is true, then return."
    requestSubmit(submitter) {
      if (submitter && submitter.form !== this) throw new Error('NotFoundError');
      if (this._firing) { (this._swallowed = (this._swallowed || 0) + 1); return; }
      if (!this.hasAttribute('novalidate')) {
        const bad = this.elements.find((e) => e.required && !e.disabled && (e.type === 'checkbox' ? !e.checked : e.type === 'file' ? !(e.files && e.files.length) : !String(e.value).trim()));
        if (bad) { dispatch(bad, new Event('invalid', { cancelable: true })); this._invalid = (this._invalid || 0) + 1; return; }
      }
      this._firing = true; const ev = new Event('submit', { bubbles: true, cancelable: true }); ev.submitter = submitter || null;
      try { dispatch(this, ev); } finally { this._firing = false; }
      if (!ev.defaultPrevented) this._navigated = (this._navigated || 0) + 1;
    }
    submit() { this._navigated = (this._navigated || 0) + 1; }
  }
  for (const b of BOOL) {
    const [attr, prop = attr] = b.split(':');
    if (prop === 'defaultChecked') continue;
    Object.defineProperty(Element.prototype, prop, { get() { return this.hasAttribute(attr); }, set(v) { if (v) this.setAttribute(attr, ''); else this.removeAttribute(attr); }, configurable: true });
  }
  Object.defineProperty(Element.prototype, 'maxLength', { get() { return Number(this.getAttribute('maxlength') || -1); }, set(v) { this.setAttribute('maxlength', v); } });

  class Event {
    constructor(type, init = {}) { this.type = type; this.bubbles = !!init.bubbles; this.cancelable = !!init.cancelable; this.defaultPrevented = false; this._stop = false; this._stopNow = false; this.target = null; this.currentTarget = null; this.detail = init.detail; }
    preventDefault() { if (this.cancelable) this.defaultPrevented = true; }
    stopPropagation() { this._stop = true; }
    stopImmediatePropagation() { this._stop = true; this._stopNow = true; }
  }
  function invoke(node, ev, phase) {
    const list = node.listeners.filter((l) => l.type === ev.type && (phase === 'target' || (phase === 'capture') === l.capture));
    const ordered = phase === 'target' ? [...list.filter((l) => l.capture), ...list.filter((l) => !l.capture)] : list;
    for (const l of ordered) { if (ev._stopNow) return; ev.currentTarget = node; l.fn.call(node, ev); }
  }
  function dispatch(target, ev) {
    ev.target = target; const path = []; let n = target.parentNode; while (n) { path.push(n); n = n.parentNode; }
    if (target === doc || path.includes(doc)) path.push(win);
    for (let i = path.length - 1; i >= 0; i -= 1) { invoke(path[i], ev, 'capture'); if (ev._stop) return !ev.defaultPrevented; }
    invoke(target, ev, 'target'); if (ev._stop) return !ev.defaultPrevented;
    if (ev.bubbles) for (const p of path) { invoke(p, ev, 'bubble'); if (ev._stop) break; }
    return !ev.defaultPrevented;
  }

  function walk(root, fn) { for (const c of root.childNodes) { fn(c); if (c.nodeType === 1) walk(c, fn); } }

  // Selectors: comma lists of chains; a chain is compound parts joined by ' ' (descendant) or '>' (child).
  const cache = new Map();
  function parseSelector(sel) {
    if (cache.has(sel)) return cache.get(sel);
    const chains = splitTop(sel, ',').map((s) => {
      const parts = []; let comb = ' '; let i = 0; s = s.trim();
      while (i < s.length) {
        if (s[i] === '>') { comb = '>'; i += 1; continue; }
        if (/\s/.test(s[i])) { i += 1; continue; }
        let j = i; let depth = 0;
        while (j < s.length && (depth > 0 || !/[\s>]/.test(s[j]))) { if (s[j] === '[') depth += 1; if (s[j] === ']') depth -= 1; if (s[j] === '"' || s[j] === "'") { const q = s[j]; j = s.indexOf(q, j + 1); } j += 1; }
        parts.push({ comb, test: compound(s.slice(i, j)) }); comb = ' '; i = j;
      }
      return parts;
    });
    cache.set(sel, chains); return chains;
  }
  function splitTop(s, ch) { const out = []; let depth = 0; let cur = ''; let q = ''; for (const c of s) { if (q) { cur += c; if (c === q) q = ''; continue; } if (c === '"' || c === "'") { q = c; cur += c; continue; } if (c === '[' || c === '(') depth += 1; if (c === ']' || c === ')') depth -= 1; if (c === ch && !depth) { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out; }
  function compound(s) {
    const tests = []; const re = /^([a-zA-Z*][a-zA-Z0-9-]*)|#([\w-]+)|\.([\w-]+)|\[\s*([\w-]+)\s*(?:([*^$~|]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+))\s*(i)?)?\s*\]|:not\(([^)]*)\)/y;
    let m; let i = 0;
    while (i < s.length) {
      re.lastIndex = i; m = re.exec(s); if (!m) throw new Error('mini-dom selector not supported: ' + s);
      i = re.lastIndex;
      if (m[1]) { const t = m[1].toLowerCase(); if (t !== '*') tests.push((e) => e.localName === t); }
      else if (m[2]) tests.push((e) => e.id === m[2]);
      else if (m[3]) tests.push((e) => e.classList.contains(m[3]));
      else if (m[4]) {
        const k = m[4]; const op = m[5]; const ci = !!m[9]; let v = m[6] ?? m[7] ?? m[8];
        if (ci && v) v = v.toLowerCase();
        tests.push((e) => {
          if (!e.hasAttribute(k)) return false; if (!op) return true; let a = e.getAttribute(k); if (ci) a = a.toLowerCase();
          return op === '=' ? a === v : op === '*=' ? a.includes(v) : op === '^=' ? a.startsWith(v) : op === '$=' ? a.endsWith(v) : op === '~=' ? a.split(/\s+/).includes(v) : a === v || a.startsWith(v + '-');
        });
      } else if (m[10] !== undefined) { const inner = m[10]; tests.push((e) => !e.matches(inner)); }
    }
    return (e) => tests.every((t) => t(e));
  }
  function matchChain(el, chain, k = chain.length - 1) {
    if (!chain[k].test(el)) return false; if (k === 0) return true;
    const comb = chain[k].comb; let p = el.parentNode;
    if (comb === '>') return !!(p && p.nodeType === 1 && matchChain(p, chain, k - 1));
    while (p && p.nodeType === 1) { if (matchChain(p, chain, k - 1)) return true; p = p.parentNode; }
    return false;
  }

  function parseInto(root, src) {
    const stack = [root]; let i = 0; const top = () => stack[stack.length - 1];
    while (i < src.length) {
      if (src.startsWith('<!--', i)) { const e = src.indexOf('-->', i); i = e < 0 ? src.length : e + 3; continue; }
      if (src[i] === '<' && src[i + 1] === '/') { const e = src.indexOf('>', i); const t = src.slice(i + 2, e).trim().toLowerCase(); for (let k = stack.length - 1; k > 0; k -= 1) if (stack[k].localName === t) { stack.length = k; break; } i = e + 1; continue; }
      if (src[i] === '<' && /[a-zA-Z]/.test(src[i + 1] || '')) {
        const m = /^<([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/.exec(src.slice(i));
        if (!m) { top().appendChild(new Text(src[i])); i += 1; continue; }
        const el = new Element(m[1]); const ar = /([^\s=>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g; let a;
        while ((a = ar.exec(m[2]))) el.setAttribute(a[1].toLowerCase(), decode(a[2] ?? a[3] ?? a[4] ?? ''));
        if (el.hasAttribute('style')) el.style.cssText = el.getAttribute('style');
        top().appendChild(el); i += m[0].length;
        if (RAW.has(el.localName)) { const e = src.toLowerCase().indexOf('</' + el.localName, i); el.appendChild(new Text(src.slice(i, e))); i = src.indexOf('>', e) + 1; continue; }
        if (!VOID.has(el.localName) && !m[3]) stack.push(el);
        continue;
      }
      const e = src.indexOf('<', i + 1); const t = src.slice(i, e < 0 ? src.length : e); top().appendChild(new Text(decode(t))); i = e < 0 ? src.length : e;
    }
  }

  const doc = new Element('#document'); doc.nodeType = 9;
  const htmlEl = doc.appendChild(new Element('html')); const head = htmlEl.appendChild(new Element('head')); const body = htmlEl.appendChild(new Element('body'));
  Object.assign(doc, {
    documentElement: htmlEl, head, body, readyState: 'complete', activeElement: body,
    createElement: (t) => new Element(t), createTextNode: (t) => new Text(t),
    getElementById: (id) => doc.querySelector('#' + id),
    createTreeWalker: (root) => { const list = []; walk(root, (n) => { if (n.nodeType === 3) list.push(n); }); let k = -1; return { nextNode: () => list[++k] || null }; },
    execCommand: () => false,
  });
  htmlEl.clientHeight = 800;
  if (html) parseInto(body, html);

  const win = { document: doc, location: { pathname, search: '', href: 'https://www.thatlayover.life' + pathname, origin: 'https://www.thatlayover.life' }, innerHeight: 800, listeners: [] };
  win.addEventListener = Element.prototype.addEventListener; win.removeEventListener = Element.prototype.removeEventListener;
  win.dispatchEvent = (ev) => dispatch(doc, ev);

  function setTimeoutF(fn, ms = 0) { const id = ++seq; timers.push({ id, at: now + Math.max(0, ms | 0), fn, every: 0 }); return id; }
  function setIntervalF(fn, ms = 0) { const id = ++seq; timers.push({ id, at: now + Math.max(1, ms | 0), fn, every: Math.max(1, ms | 0) }); return id; }
  function clearTimer(id) { const k = timers.findIndex((t) => t.id === id); if (k >= 0) timers.splice(k, 1); }
  function MutationObserverF(cb) { this.observe = (target, opts) => observers.push({ cb, target, opts, mo: this }); this.disconnect = () => { for (let k = observers.length - 1; k >= 0; k -= 1) if (observers[k].mo === this) observers.splice(k, 1); }; }
  function OptionF(text = '', value) { const o = new Element('option'); o.textContent = text; if (value !== undefined) o.setAttribute('value', value); return o; }
  const localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k), clear: () => store.clear() };
  const getComputedStyle = (el) => {
    let n = el; let display = el.style.display || (el.localName === 'span' ? 'inline' : 'block');
    while (n && n.nodeType === 1) { if (n.style.display === 'none' || n.hidden || n.classList.contains('tllst-hide')) { display = 'none'; break; } n = n.parentNode; }
    return { display, visibility: 'visible' };
  };
  Object.assign(win, { setTimeout: setTimeoutF, clearTimeout: clearTimer, setInterval: setIntervalF, clearInterval: clearTimer, MutationObserver: MutationObserverF,
    getComputedStyle, localStorage, Option: OptionF, Event, CustomEvent: Event, NodeFilter: { SHOW_TEXT: 4 } });

  // Run a browser script with the stand-in as its globals. Extra globals (fetch, createImageBitmap, ...) come from `globals`.
  dom.run = (src, globals = {}) => {
    const g = { window: win, document: doc, location: win.location, navigator: { clipboard: null }, URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
      URLSearchParams, FormData, Blob, Image: function Image() {}, ...win, ...globals };
    Object.assign(win, globals);
    const names = Object.keys(g).filter((k) => /^[A-Za-z_$][\w$]*$/.test(k));
    return new Function(...names, src)(...names.map((k) => g[k]));
  };
  // Advance the clock, running due timers in order (timers they add run too if due).
  dom.tick = async (ms = 0) => {
    const end = now + ms;
    for (;;) {
      await flush();
      timers.sort((a, b) => a.at - b.at || a.id - b.id); const t = timers[0];
      if (!t || t.at > end) break;
      now = t.at; if (t.every) t.at += t.every; else timers.shift();
      t.fn();
    }
    now = end; await flush();
  };
  // Run only the next due timer (then let promises settle): to look at the page between two timers.
  dom.step = async () => {
    await flush(); timers.sort((x, y) => x.at - y.at || x.id - y.id); const t = timers[0]; if (!t) return false;
    now = Math.max(now, t.at); if (t.every) t.at += t.every; else timers.shift(); t.fn(); await flush(); return true;
  };
  async function flush() { for (let k = 0; k < 20; k += 1) await Promise.resolve(); await new Promise((r) => setImmediate(r)); for (let k = 0; k < 20; k += 1) await Promise.resolve(); }
  dom.flush = flush;
  dom.now = () => now;
  dom.timers = timers;
  // Fire the MutationObserver callbacks watching this node (the way the browser would after a style or class change).
  dom.mutate = (node) => { observers.filter((o) => o.target === node || (o.opts && o.opts.subtree && o.target.contains(node))).forEach((o) => o.cb([], o.mo)); };
  dom.observers = observers;
  Object.assign(dom, { window: win, document: doc, Event, Element, Text, store, getComputedStyle });
  return dom;
}
