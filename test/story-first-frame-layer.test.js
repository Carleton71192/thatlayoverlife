// 14 Nov 2026, the story page first-frame jump at 390 (reports/evidence/story-first-frame-2026-11-14/diagnosis.md, idea A: the F1
// pattern of the cover, on the story layer). The writer's avatar had no size until the Stories Template's own style (tll-st3-story-v1)
// was parsed at the end of the body, and the magazine layout came only at DOMContentLoaded, so a fast photo could paint the head in
// three different layouts (0.32 layout shift on about a third of fresh loads at 390). Now the core puts style#tll-mag-story-v1 into
// the head at once, keeps it after every style that arrives while the page is parsed, moves it to the end of the body once the page is
// parsed, and runs the magazine moves (heroR, the figure, the byline in the head) as soon as the byline row has arrived.
// A2 (same day, the judge's two breakages in judge.md):
// 1. The few template rules the first paint needs (keyed on the template's page id, as heavy as the template's own) are no longer
//    inside the magazine style, which ends up after the template's style and so won every tie: they are in style#tll-story-st3-early-v1,
//    which stays in the head and is taken out once the template's style has been parsed. The cascade test below edits two template
//    values in a fixture and checks that the edited values win on the finished page.
// 2. Two holds on the hero keep the photo from being pushed by the Receipts line and by the template script's rewrite of the
//    place-and-date line (both measured in a trace: scratchpad nov14/a2).
// The layout itself was measured in a real browser (scratchpad nov14/a2); here: the built core, the copied rules against the template,
// the cascade on the finished page, and the early pieces run against a small stand-in for document and MutationObserver.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
const tpl = read('src', 'pages', 'stories-template', 'live-2026-11-13', 'fonts', 'page-footer.after.html');
const st3 = /<style id="tll-st3-story-v1">\n([\s\S]*?)<\/style>/.exec(tpl)[1];
const PAGE = ':where(html[data-wf-page="6a0b29eedc14f1444e935766"])';

const storyAt = core.indexOf("(function(){if(!/^\\/stories\\/[^/]+\\/?$/.test(location.pathname))return;if(document.getElementById('tll-mag-story-v1'))return;");
const story = core.slice(storyAt, core.indexOf('\n(function(){if(!/^\\/(index\\.html)?$/', storyAt));
const earlyText = JSON.parse(/ES\.textContent=("(?:[^"\\]|\\.)*");/.exec(story)[1]);
const styleText = JSON.parse(/MS\.textContent=("(?:[^"\\]|\\.)*");/.exec(story)[1]);
const placeSrc = /var hd=document\.head[\s\S]*?\}else place\(\);\n/.exec(story)[0];
const runSrc = /\/\* F1: run\(\) as soon as[\s\S]*?document\.addEventListener\('DOMContentLoaded',function\(\)\{stop\(\);run\(\);late\(\);if\(!hd\)after\(\);\}\);\}\)\(\);/.exec(story)[0];

// A stand-in for the parts of the DOM the placement touches. Document order is one flat list; head nodes sit before body nodes.
function fakeDom() {
  const order = []; const listeners = {}; const observers = [];
  const idx = (n) => order.indexOf(n);
  const remove = (n) => { const i = idx(n); if (i > -1) order.splice(i, 1); };
  const document = { readyState: 'loading', documentElement: {}, addEventListener: (t, fn) => { (listeners[t] = listeners[t] || []).push(fn); } };
  function node(nodeName, parent) {
    return { nodeName, id: '', textContent: '', parentNode: parent || null,
      compareDocumentPosition(o) { return idx(o) < idx(this) ? 2 : 4; },
      get nextSibling() { return order[idx(this) + 1] || null; },
      // the parser has gone past a node once anything follows it (all body nodes are siblings here)
      get nextElementSibling() { const i = idx(this); return i > -1 && this.parentNode === body ? order.slice(i + 1).find((x) => x.parentNode === body) || null : null; } };
  }
  const removeChild = function (n) { if (n.parentNode === this) { remove(n); n.parentNode = null; } return n; };
  const head = { nodeName: 'HEAD', removeChild, appendChild(n) { remove(n); n.parentNode = head; const b = order.findIndex((x) => x.parentNode === body); b < 0 ? order.push(n) : order.splice(b, 0, n); } };
  const body = { nodeName: 'BODY', removeChild, appendChild(n) { remove(n); n.parentNode = body; order.push(n); },
    insertBefore(n, ref) { remove(n); n.parentNode = body; ref ? order.splice(idx(ref), 0, n) : order.push(n); } };
  head.insertBefore = (n, ref) => { remove(n); n.parentNode = head; ref ? order.splice(idx(ref), 0, n) : head.appendChild(n); };
  Object.assign(document, { head, body, createElement: (t) => node(t.toUpperCase()) });
  class MutationObserver { constructor(cb) { this.cb = cb; this.on = false; observers.push(this); } observe() { this.on = true; } disconnect() { this.on = false; } }
  const window = { MutationObserver };
  // the parser adds a node; every live observer sees it in one batch
  const add = (parent, nodeName, props = {}) => { const n = Object.assign(node(nodeName), props); parent.appendChild(n); observers.filter((o) => o.on).forEach((o) => o.cb([{ addedNodes: [n] }])); return n; };
  const fire = (t) => { document.readyState = 'interactive'; (listeners[t] || []).forEach((f) => f()); };
  const styles = () => order.filter((n) => n.nodeName === 'STYLE');
  return { document, window, head, body, order, observers, add, fire, styles, MutationObserver };
}
function load(readyState = 'loading') {
  const d = fakeDom(); d.document.readyState = readyState;
  const r = new Function('document', 'window', 'MutationObserver', placeSrc + '\nreturn {MS:MS,ES:ES};')(d.document, d.window, d.MutationObserver);
  return { ...d, MS: r.MS, ES: r.ES };
}

// A small cascade, enough for the byline rules: rules from style text (inside @media too), selector lists, compound selectors with
// tag, class, id, attribute and :where()/:is(), descendant and child combinators, specificity, !important, then source order.
function cssRules(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = []; let i = 0;
  const block = (from) => { let depth = 0; for (let k = from; k < css.length; k++) { if (css[k] === '{') depth++; else if (css[k] === '}' && --depth === 0) return k; } return css.length; };
  while (i < css.length) {
    const open = css.indexOf('{', i); if (open < 0) break;
    const pre = css.slice(i, open).trim(); const close = block(open);
    if (/^@(media|supports)/.test(pre)) out.push(...cssRules(css.slice(open + 1, close)));
    else if (!pre.startsWith('@')) {
      const decls = []; for (const d of css.slice(open + 1, close).split(';')) { const c = d.indexOf(':'); if (c < 0) continue;
        let v = d.slice(c + 1).trim(); const imp = /!important$/.test(v); v = v.replace(/\s*!important$/, '');
        decls.push([d.slice(0, c).trim(), v, imp]); }
      out.push({ sels: splitTop(pre), decls });
    }
    i = close + 1;
  }
  return out;
}
function splitTop(s) { const r = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { r.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) r.push(cur.trim()); return r; }
// one selector -> list of [combinator, compound]; a compound -> { tag, ids, cls, attrs, inner (for :where/:is), weightless, bad }
function parseSel(sel) {
  const parts = []; let cur = '', d = 0, comb = ' ';
  const flush = () => { if (cur.trim()) { parts.push([comb, parseCompound(cur.trim())]); comb = ' '; } cur = ''; };
  for (let k = 0; k < sel.length; k++) { const ch = sel[k];
    if (ch === '(' || ch === '[') d++; if (ch === ')' || ch === ']') d--;
    if (!d && (ch === ' ' || ch === '>')) { flush(); if (ch === '>') comb = '>'; continue; }
    cur += ch; }
  flush(); return parts;
}
function parseCompound(c) {
  const o = { tag: null, ids: [], cls: [], attrs: [], wh: [], is: [], bad: false };
  const re = /^([a-z][a-z0-9-]*|\*)|\.([\w-]+)|#([\w-]+)|\[([\w-]+)(?:="([^"]*)")?\]|:(where|is)\(([^()]*(?:\([^()]*\)[^()]*)*)\)|::?[\w-]+(\([^)]*\))?/gi;
  let m, seen = 0;
  while ((m = re.exec(c))) { seen += m[0].length;
    if (m[1]) o.tag = m[1] === '*' ? null : m[1].toLowerCase(); else if (m[2]) o.cls.push(m[2]); else if (m[3]) o.ids.push(m[3]);
    else if (m[4]) o.attrs.push([m[4], m[5]]); else if (m[6]) (m[6] === 'where' ? o.wh : o.is).push(splitTop(m[7]).map(parseSel));
    else o.bad = true; } // any other pseudo-class or pseudo-element: never the element itself on a finished, idle page
  if (seen !== c.length) o.bad = true;
  return o;
}
function compoundMatches(o, el) {
  if (o.bad) return false; if (o.tag && o.tag !== el.tag) return false;
  if (o.ids.some((x) => el.id !== x) || o.cls.some((x) => !el.cls.includes(x))) return false;
  if (o.attrs.some(([a, v]) => !(a in el.attrs) || (v !== undefined && el.attrs[a] !== v))) return false;
  // :where()/:is() with one compound per alternative is all the byline rules use
  for (const list of o.wh.concat(o.is)) if (!list.some((p) => p.length === 1 && compoundMatches(p[0][1], el))) return false;
  return true;
}
function matches(parts, chain) { // chain: root .. target
  const go = (pi, ci) => { if (!compoundMatches(parts[pi][1], chain[ci])) return false; if (pi === 0) return true;
    if (parts[pi][0] === '>') return ci > 0 && go(pi - 1, ci - 1);
    for (let k = ci - 1; k >= 0; k--) if (go(pi - 1, k)) return true; return false; };
  return go(parts.length - 1, chain.length - 1);
}
function weight(parts) { let a = 0, b = 0, c = 0; for (const [, o] of parts) { a += o.ids.length; b += o.cls.length + o.attrs.length; c += o.tag ? 1 : 0;
  for (const list of o.is) { const w = list.map(weight).sort((x, y) => (y[0] - x[0]) || (y[1] - x[1]) || (y[2] - x[2]))[0]; a += w[0]; b += w[1]; c += w[2]; } } return [a, b, c]; }
// the value of one property on the element at the end of chain, from the style texts in document order
function computed(sheets, chain, props) {
  let best = null, pos = 0;
  for (const css of sheets) for (const r of cssRules(css)) for (const sel of r.sels) { const parts = parseSel(sel); pos++;
    if (!matches(parts, chain)) continue; const w = weight(parts);
    for (const [p, v, imp] of r.decls) { if (!props.includes(p)) continue;
      const k = [imp ? 1 : 0, ...w, pos];
      if (!best || later(k, best.k)) best = { k, v }; } }
  return best && best.v;
}
// importance, then weight, then source order: the first place where two keys differ decides
function later(k, b) { for (let i = 0; i < k.length; i++) if (k[i] !== b[i]) return k[i] > b[i]; return false;
}
const el = (tag, cls = [], attrs = {}, id = '') => ({ tag, cls, attrs, id });
const HTML = el('html', [], { 'data-wf-page': '6a0b29eedc14f1444e935766', 'data-wf-site': '6a0b29c6d081332e921900d8' });
const LINK = [HTML, el('body'), el('div'), el('article', ['tll-story-article']), el('section', ['tll-story-hero']), el('div', ['tll-story-hero-content']),
  el('div', ['st3-author'], { 'data-st3-author': '1' }), el('a', ['st3-author-link', 'w-inline-block'], { href: '/contributors/x' })];
const AVATAR = LINK.concat([el('div', ['st3-author-avatar'])]);
const RADIUS = ['border-radius', 'border-top-left-radius'], GAP = ['gap', 'column-gap'];

describe('story first frame: the built core', () => {
  it('puts the copied template rules and the story style into the head at once, in that order, and moves only the story style to the end of the body', () => {
    expect(story).toContain("ES=document.createElement('style');ES.id='tll-story-st3-early-v1';");
    expect(story).toContain("var MS=document.createElement('style');MS.id='tll-mag-story-v1';");
    expect(story).toContain('hd.appendChild(ES);');
    expect(story).toContain('hd.appendChild(MS);');
    expect(story.indexOf('hd.appendChild(ES);')).toBeLessThan(story.indexOf('hd.appendChild(MS);'));
    expect(story).toContain("document.addEventListener('DOMContentLoaded',place);}else place();");
    expect(story).toContain('function place(){if(so){so.disconnect();so=null;}drop();document.body.appendChild(MS);}');
    // the old late insertion is gone: no style is created inside place()
    expect(story).not.toContain("function place(){var s=document.createElement('style')");
    // the style is in place before the magazine script runs
    expect(story.indexOf('appendChild(MS)')).toBeLessThan(story.indexOf('function run(){'));
  });
  it('runs the magazine moves early with the page-parsed event as the fallback, once, at the end of the story layer', () => {
    expect(story.split(runSrc).length).toBe(2);
    expect(story).not.toContain("document.addEventListener('DOMContentLoaded',run);else run();");
    expect(story.indexOf(runSrc)).toBeGreaterThan(story.indexOf('function run(){'));
    expect(story).toContain('if(img)heroR(img);');
  });
  it('carries the whole magazine style, then the two hold rules, and no copy of a template rule', () => {
    const mag = read('src', 'design', 'magazine-2026-10', 'story-build', 'tll-mag-story-v1.html');
    const first = /<style id="tll-mag-story-v1">\n([^\n]*)/.exec(mag)[1];
    expect(styleText.startsWith(first)).toBe(true);
    expect(styleText).toContain('aspect-ratio:auto var(--tll-hero-r,16/9)');
    expect(styleText).not.toContain(PAGE);
    const holds = styleText.slice(styleText.indexOf('/* F1 holds (A2'));
    expect(holds).toContain('.tll-story-hero[data-tll-mg-wait-r] .tll-mg-fig,.tll-story-hero[data-tll-mg-wait-r] .tll-story-hero-content>.tll-mg-stamp{visibility:hidden}');
    expect(holds).toContain('.tll-story-hero[data-tll-mg-wait-d] .tll-story-hero-content .st3-author-filed{display:-webkit-box !important;-webkit-box-orient:vertical;-webkit-line-clamp:1;overflow:hidden;visibility:hidden}');
    // every hold rule needs its attribute on the hero, so nothing matches once the holds are cleared
    for (const r of cssRules(holds)) for (const s of r.sels) expect(s).toMatch(/^\.tll-story-hero\[data-tll-mg-wait-[rd]\] /);
  });
});

describe('story first frame: the template rules in the early style', () => {
  const early = earlyText.split('\n').filter((l) => l.startsWith(PAGE));
  it('covers the avatar, the byline row and the meta row, each keyed on the Stories Template page id with no added weight', () => {
    expect(early.length).toBe(15);
    const sel = early.map((l) => l.slice(0, l.indexOf('{'))).join('\n');
    for (const s of ['.st3-author-avatar', '.st3-author-img', '.st3-author-link', '.st3-author{', '.tll-story-meta-row>:nth-child(5)', '.tll-story-meta-row>:nth-child(6)'])
      expect(sel + '{').toContain(s.replace('{', ''));
    // :where() adds nothing to the weight: no early rule may sit outside it
    for (const l of early) expect(l.replace(/:where\([^)]*\]\)/g, '')).not.toMatch(/html\[/);
    // the early style holds nothing else
    expect(earlyText.split('\n').filter((l) => l && !l.startsWith(PAGE) && !/^\/\*|^ {3}/.test(l))).toEqual([]);
  });
  it('copies each rule exactly as the template writes it, so the first frames match the template', () => {
    for (const l of early.slice(1)) {
      const rule = l.split(PAGE + ' ').join('');
      expect(st3).toContain(rule);
    }
  });
  it('gives the tokens those rules use the template values', () => {
    const tokens = /\{([^}]*)\}/.exec(early[0])[1].split(';');
    expect(tokens.length).toBe(5);
    for (const t of tokens) expect(st3).toContain(t);
  });
  it('sizes the avatar from the first paint, as the template does: 40 px, the photo filling it', () => {
    expect(earlyText).toContain(PAGE + ' .st3-author-avatar{flex:none;width:40px;height:40px;');
    expect(earlyText).toContain(PAGE + ' .st3-author-img{display:block;width:100%;height:100%;object-fit:cover}');
    // the head byline keeps its 44 px avatar: the magazine rule is heavier than the keyed copy
    expect(styleText).toContain('.tll-story-hero-content .st3-author-avatar{width:44px;height:44px;border:0}');
  });
});

describe('story first frame: the style placement in a stand-in page', () => {
  it('goes into the head at once, then the story style follows every style the parser adds, the template style included', () => {
    const p = load();
    expect(p.MS.parentNode).toBe(p.head);
    expect(p.ES.parentNode).toBe(p.head);
    const inline = p.add(p.body, 'STYLE');
    expect(p.order.indexOf(p.MS)).toBe(p.order.indexOf(inline) + 1);
    p.add(p.body, 'DIV');
    expect(p.order.indexOf(p.MS)).toBe(p.order.indexOf(inline) + 1);
    const tplStyle = p.add(p.body, 'STYLE', { id: 'tll-st3-story-v1' });
    expect(p.order.indexOf(p.MS)).toBe(p.order.indexOf(tplStyle) + 1);
  });
  it('keeps the early style in the head, before the template style, until that style has been parsed whole, then takes it out', () => {
    const p = load();
    p.add(p.body, 'STYLE'); p.add(p.body, 'DIV');
    expect(p.ES.parentNode).toBe(p.head);
    const tplStyle = p.add(p.body, 'STYLE', { id: 'tll-st3-story-v1' });
    // still being parsed: nothing follows it yet
    expect(p.ES.parentNode).toBe(p.head);
    expect(p.order.indexOf(p.ES)).toBeLessThan(p.order.indexOf(tplStyle));
    p.add(p.body, 'SCRIPT');
    expect(p.ES.parentNode).toBe(null);
    expect(p.order).not.toContain(p.ES);
  });
  it('takes the early style out when the page is parsed even if the template style never came', () => {
    const p = load();
    p.add(p.body, 'STYLE'); p.add(p.body, 'DIV');
    p.fire('DOMContentLoaded');
    expect(p.order).not.toContain(p.ES);
  });
  it('stays put for a style a script adds to the head, which already comes before it', () => {
    const p = load();
    const inline = p.add(p.body, 'STYLE');
    p.add(p.head, 'STYLE');
    expect(p.order.indexOf(p.MS)).toBe(p.order.indexOf(inline) + 1);
  });
  it('moves the story style to the end of the body when the page is parsed and stops watching', () => {
    const p = load();
    p.add(p.body, 'STYLE'); p.add(p.body, 'DIV');
    p.fire('DOMContentLoaded');
    expect(p.order[p.order.length - 1]).toBe(p.MS);
    expect(p.MS.parentNode).toBe(p.body);
    expect(p.observers.every((o) => !o.on)).toBe(true);
  });
  it('goes straight to the end of the body, with no early style, when the core runs after the page was parsed', () => {
    const p = load('complete');
    expect(p.MS.parentNode).toBe(p.body);
    expect(p.ES).toBe(null);
    expect(p.observers.length).toBe(0);
  });
});

describe('story first frame: a later template edit wins on the finished page', () => {
  // the judge's test (judge.md, breakage 1): the template's avatar corner 50% becomes 6px and the byline link gap 12px becomes 20px
  const A = '.st3-author-avatar{flex:none;width:40px;height:40px;border-radius:50%;', B = '.st3-author-link{display:inline-flex;align-items:center;gap:12px;';
  const edited = st3.replace(A, A.replace('50%', '6px')).replace(B, B.replace('12px', '20px'));
  // the story page as it ends: the core's two styles placed by the built code, the template's own style at the end of the body
  function finished(tplText) {
    const p = load();
    p.add(p.body, 'DIV');
    const t = p.add(p.body, 'STYLE', { id: 'tll-st3-story-v1', textContent: tplText });
    p.add(p.body, 'SCRIPT');
    p.fire('DOMContentLoaded');
    return p.styles().map((n) => (n === p.MS ? styleText : n === p.ES ? earlyText : n === t ? t.textContent : ''));
  }
  it('uses a fixture that really changes the two values', () => {
    expect(st3.split(A).length).toBe(2);
    expect(st3.split(B).length).toBe(2);
    expect(edited).not.toBe(st3);
  });
  it('shows the edited avatar corner and byline gap, in the head byline', () => {
    const sheets = finished(edited);
    expect(computed(sheets, AVATAR, RADIUS)).toBe('6px');
    expect(computed(sheets, LINK, GAP)).toBe('20px');
  });
  it('shows the template values unchanged when nothing is edited', () => {
    const sheets = finished(st3);
    expect(computed(sheets, AVATAR, RADIUS)).toBe('50%');
    expect(computed(sheets, LINK, GAP)).toBe('12px');
  });
  it('would catch the old placement: copies after the template style override the edit', () => {
    // fix A as judged: the copies inside the magazine style at the end of the body
    const sheets = [edited, earlyText + styleText];
    expect(computed(sheets, AVATAR, RADIUS)).toBe('50%');
    expect(computed(sheets, LINK, GAP)).toBe('12px');
  });
  it('lets the edited values win over the copies even while the early style is still in the head', () => {
    const sheets = [earlyText, edited, styleText];
    expect(computed(sheets, AVATAR, RADIUS)).toBe('6px');
    expect(computed(sheets, LINK, GAP)).toBe('20px');
  });
});

describe('story first frame: the early run in a stand-in page', () => {
  function page(readyState = 'loading') {
    const listeners = {}; const obs = []; const log = [];
    const attrs = {};
    const hero = { setAttribute: (k) => { attrs[k] = 1; log.push('+' + k); }, removeAttribute: (k) => { delete attrs[k]; log.push('-' + k); } };
    const state = { author: null, ledger: null, helper: null, moved: false };
    const c = { querySelector: (s) => (s === '.st3-author' && state.moved ? state.author : null) };
    const body = {};
    const document = { readyState, body, documentElement: {},
      querySelector: (s) => (s === '.st3-author' ? state.author : s === '[data-tll-ledger="story"]' ? state.ledger : s === '.tll-story-hero .tll-story-hero-content' ? c : s === '.tll-story-hero' ? hero : null),
      getElementById: (id) => (id === 'tll-st3-story-js-v1' ? state.helper : null),
      addEventListener: (t, fn) => { (listeners[t] = listeners[t] || []).push(fn); } };
    class MutationObserver { constructor(cb) { this.cb = cb; this.on = false; obs.push(this); } observe() { this.on = true; } disconnect() { this.on = false; } }
    const calls = { run: 0, rcpt: [] };
    new Function('document', 'window', 'MutationObserver', 'run', 'rcpt', runSrc)(document, { MutationObserver }, MutationObserver,
      () => { calls.run++; if (state.author) state.moved = true; log.push('run'); }, (cc, a) => { calls.rcpt.push([cc, a]); log.push('rcpt'); });
    const tick = () => obs.filter((o) => o.on).forEach((o) => o.cb([]));
    const fire = (t) => (listeners[t] || []).forEach((f) => f());
    const whole = () => ({ parentNode: body, nextElementSibling: {} });
    return { state, c, body, calls, obs, tick, fire, attrs, log, listeners, whole };
  }
  it('waits until the byline row has arrived whole, then runs before the page is parsed', () => {
    const p = page();
    p.tick(); expect(p.calls.run).toBe(0);
    p.state.author = { parentNode: { parentNode: p.body, nextElementSibling: null }, nextElementSibling: null };
    p.tick(); expect(p.calls.run).toBe(0);
    p.state.author.nextElementSibling = {};
    p.tick(); expect(p.calls.run).toBe(1);
    expect(p.calls.rcpt.length).toBe(0);
  });
  it('holds the photo and the place-and-date line as soon as the byline is in the head', () => {
    const p = page();
    p.state.author = p.whole();
    p.tick();
    expect(Object.keys(p.attrs).sort()).toEqual(['data-tll-mg-wait-d', 'data-tll-mg-wait-r']);
  });
  it('writes the Receipts line only once the Receipts block has arrived whole, and shows the photo in the same step', () => {
    const p = page();
    p.state.author = p.whole();
    p.tick();
    const sec = { parentNode: p.body, nextElementSibling: null };
    p.state.ledger = { parentNode: sec, nextElementSibling: null };
    const runs = p.calls.run;
    p.tick(); expect(p.calls.run).toBe(runs); expect(p.calls.rcpt.length).toBe(0);
    expect(p.attrs['data-tll-mg-wait-r']).toBe(1);
    sec.nextElementSibling = {};
    p.tick(); expect(p.calls.rcpt).toEqual([[p.c, p.state.author]]);
    expect(p.attrs['data-tll-mg-wait-r']).toBe(undefined);
    expect(p.log.slice(-2)).toEqual(['rcpt', '-data-tll-mg-wait-r']);
    // the place-and-date line is still held: the template script has not run
    expect(p.attrs['data-tll-mg-wait-d']).toBe(1);
  });
  it('lets the place-and-date line go only after the template script\'s own page-parsed handler, then stops watching', () => {
    const p = page();
    p.state.author = p.whole();
    p.tick();
    p.state.ledger = p.whole(); p.tick();
    // the template script is parsed: it adds its page-parsed handler, after the core's
    p.state.helper = { parentNode: p.body, nextElementSibling: null };
    let seen = null;
    p.listeners.DOMContentLoaded.push(() => { seen = p.attrs['data-tll-mg-wait-d']; p.log.push('template'); });
    p.tick(); expect(p.obs.every((o) => o.on)).toBe(true);
    p.state.helper.nextElementSibling = {};
    p.tick();
    expect(p.obs.every((o) => !o.on)).toBe(true);
    p.fire('DOMContentLoaded');
    expect(seen).toBe(1);
    expect(p.attrs).toEqual({});
    expect(p.log.indexOf('template')).toBeLessThan(p.log.lastIndexOf('-data-tll-mg-wait-d'));
  });
  it('lets both holds go when the page is parsed if the Receipts block or the template script never came', () => {
    const p = page();
    p.state.author = p.whole();
    p.tick();
    p.fire('DOMContentLoaded');
    expect(p.attrs).toEqual({});
    expect(p.obs.every((o) => !o.on)).toBe(true);
  });
  it('keeps the page-parsed event as the fallback, with no hold', () => {
    const p = page();
    p.fire('DOMContentLoaded');
    expect(p.calls.run).toBe(1);
    expect(p.attrs).toEqual({});
    expect(p.obs.every((o) => !o.on)).toBe(true);
  });
  it('runs at once, with no hold and no observer, when the page was already parsed', () => {
    const p = page('complete');
    expect(p.calls.run).toBe(1);
    expect(p.obs.length).toBe(0);
    expect(p.log).toEqual(['run']);
  });
});
