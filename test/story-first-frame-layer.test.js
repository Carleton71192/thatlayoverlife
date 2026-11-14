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
//    values in a fixture and checks that the edited values win on the finished page. The early style also hides the commissioned
//    link as the site footer style does (that link pulled a no-photo story up 20 px when the footer style arrived); it is taken out
//    once both the template style and the footer style have been parsed.
// 2. Two holds on the hero keep the photo from being pushed by the Receipts line and by the template script's rewrite of the
//    place-and-date line (both measured in a trace: scratchpad nov14/a2).
// A3 (same day, the 16.65.0 checks in reports/evidence/release-16.65.0-check/): what the page-parsed scripts do to the story head is
// laid out before the first paint. PF.pre() writes the template script's place-and-date words at once (no more one-line clamp), gives
// the country crumb the box of the link the template makes of it (data-tll-mg-wait-d), and puts an empty stand-in for the site flag
// script's flags in front of the crumb text, taken out in the same step as the real flags arrive. Two more template rules (the arrow
// before the hidden title crumb, the first place pill) join the early style. Below: PF against the real template and flag scripts,
// run on a small tree that stands in for the story head.
// The layout itself was measured in a real browser (scratchpad nov14/a2 and nov14/a3lab); here: the built core, the copied rules against the template,
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
const runSrc = /\/\* F1: run\(\) as soon as[\s\S]*?document\.addEventListener\('DOMContentLoaded',function\(\)\{stop\(\);run\(\);late\(\);if\(!hd\)after\(\);PF\.end\(\);\}\);\}\)\(\);/.exec(story)[0];
const pfSrc = /var PF=\(function\(\)\{[\s\S]*?return \{pre:pre,done:done,end:end\};\}\)\(\);\n/.exec(story)[0];

// A stand-in for the parts of the DOM the placement touches. Document order is one flat list; head nodes sit before body nodes.
function fakeDom() {
  const order = []; const listeners = {}; const observers = [];
  const idx = (n) => order.indexOf(n);
  const remove = (n) => { const i = idx(n); if (i > -1) order.splice(i, 1); };
  const document = { readyState: 'loading', documentElement: {}, addEventListener: (t, fn) => { (listeners[t] = listeners[t] || []).push(fn); } };
  function node(nodeName, parent) {
    return { nodeName, id: '', textContent: '', sheet: null, parentNode: parent || null,
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
  const add = (parent, nodeName, props = {}) => { order.forEach((x) => { if (x.open) { x.open = false; x.sheet = {}; } });
    const n = Object.assign(node(nodeName), { open: nodeName === 'STYLE' }, props); parent.appendChild(n); observers.filter((o) => o.on).forEach((o) => o.cb([{ addedNodes: [n] }])); return n; };
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
  it('carries the whole magazine style, then the hold rules, and no copy of a template rule', () => {
    const mag = read('src', 'design', 'magazine-2026-10', 'story-build', 'tll-mag-story-v1.html');
    const first = /<style id="tll-mag-story-v1">\n([^\n]*)/.exec(mag)[1];
    expect(styleText.startsWith(first)).toBe(true);
    expect(styleText).toContain('aspect-ratio:auto var(--tll-hero-r,16/9)');
    expect(styleText).not.toContain(PAGE);
    const holds = styleText.slice(styleText.indexOf('/* F1 holds (A2'));
    expect(holds).toContain('.tll-story-hero[data-tll-mg-wait-r] .tll-mg-fig,.tll-story-hero[data-tll-mg-wait-r] .tll-story-hero-content>.tll-mg-stamp{visibility:hidden}');
    // A3: no clamp on the place-and-date line any more; wait-d gives the country crumb the box of the template's link
    expect(holds).not.toContain('line-clamp');
    expect(holds).toContain('.tll-story-hero[data-tll-mg-wait-d] [data-tll-breadcrumb] div[data-tll-crumb="country"]{display:inline-flex;align-items:center;min-height:44px}');
    expect(styleText).toContain('.tll-story-hero [data-tll-breadcrumb] a{display:inline-flex;align-items:center;min-height:44px;');
    expect(holds).toContain('.tll-story-hero [data-tll-mg-flags]>[data-t]::after{content:attr(data-t)}');
    // every hold rule needs its attribute on the hero, or the flag stand-in (gone by the end of parsing), so nothing matches on the finished page
    for (const r of cssRules(holds)) for (const s of r.sels) expect(s).toMatch(/^\.tll-story-hero(\[data-tll-mg-wait-[rd]\] | \[data-tll-mg-flags\]>)/);
  });
});

describe('story first frame: the template rules in the early style', () => {
  const all = earlyText.split('\n').filter((l) => l.startsWith(PAGE));
  const FOOT = PAGE + ' a[data-tll-commissioned="story"]{display:none}';
  const R1 = [PAGE + ' [data-tll-breadcrumb] span:has(+ [data-tll-crumb="title"]){display:none !important}',
    PAGE + ' .tll-story-meta-row > .tll-story-byline-loc:first-child,' + PAGE + ' .tll-story-meta-row > .tll-story-byline-loc:first-child + .tll-story-meta-divider{display:none !important}'];
  const early = all.filter((l) => l !== FOOT && !R1.includes(l));
  it('covers the avatar, the byline row and the meta row, each keyed on the Stories Template page id with no added weight', () => {
    expect(early.length).toBe(15);
    expect(all.length).toBe(18);
    const sel = early.map((l) => l.slice(0, l.indexOf('{'))).join('\n');
    for (const s of ['.st3-author-avatar', '.st3-author-img', '.st3-author-link', '.st3-author{', '.tll-story-meta-row>:nth-child(5)', '.tll-story-meta-row>:nth-child(6)'])
      expect(sel + '{').toContain(s.replace('{', ''));
    // :where() adds nothing to the weight: no early rule may sit outside it
    for (const l of all) expect(l.replace(/:where\([^)]*\]\)/g, '')).not.toMatch(/html\[/);
    // the early style holds nothing else
    expect(earlyText.split('\n').filter((l) => l && !l.startsWith(PAGE) && !/^\/\*|^ {3}/.test(l))).toEqual([]);
  });
  it('copies each rule exactly as the template writes it, so the first frames match the template', () => {
    for (const l of early.slice(1)) {
      const rule = l.split(PAGE + ' ').join('');
      expect(st3).toContain(rule);
    }
  });
  it('also hides the commissioned link from the first paint, as the site footer style does, and holds nothing else', () => {
    expect(all[15]).toBe(FOOT);
    const foot = read('src', 'components', 'footer', 'tll-foot-v1.html');
    expect(foot).toContain('a[data-tll-commissioned="story"]{display:none;');
    // a commissioned story still shows it: the footer's own .tll-comm-on rule is heavier than the copy
    expect(foot).toContain('a[data-tll-commissioned="story"].tll-comm-on{display:inline-flex}');
  });
  it('A3: hides the arrow before the hidden title crumb and the first place pill from the first paint, as the template\'s r1 style does', () => {
    expect(all.slice(16)).toEqual(R1);
    const r1 = /<style id="tll-st3-r1-v1">\n([\s\S]*?)<\/style>/.exec(read('src', 'pages', 'story', 'after-2026-10-20', 'embed-3074c26c-after.html'))[1];
    for (const l of R1) expect(r1).toContain(l.split(PAGE + ' ').join(''));
    // the live story page carries the same r1 style (the 16.65.0 check snapshot of the template embed)
    expect(read('src', 'pages', 'story', 'after-2026-10-20', 'embed-3074c26c-after.html')).toContain('<script id="tll-st3-story-js-v1">');
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
  it('keeps the early style in the head, before the template style, until that style and the footer style have been parsed whole, then takes it out', () => {
    const p = load();
    p.add(p.body, 'STYLE'); p.add(p.body, 'DIV');
    p.add(p.body, 'STYLE', { id: 'tll-foot-v1' }); p.add(p.body, 'DIV');
    expect(p.ES.parentNode).toBe(p.head);
    const tplStyle = p.add(p.body, 'STYLE', { id: 'tll-st3-story-v1' });
    // still being parsed: no sheet yet
    expect(tplStyle.sheet).toBe(null);
    expect(p.ES.parentNode).toBe(p.head);
    expect(p.order.indexOf(p.ES)).toBeLessThan(p.order.indexOf(tplStyle));
    p.add(p.body, 'SCRIPT');
    expect(p.ES.parentNode).toBe(null);
    expect(p.order).not.toContain(p.ES);
  });
  it('waits for the footer style too when it comes after the template style', () => {
    const p = load();
    p.add(p.body, 'STYLE', { id: 'tll-st3-story-v1' }); p.add(p.body, 'DIV');
    expect(p.ES.parentNode).toBe(p.head);
    p.add(p.body, 'STYLE', { id: 'tll-foot-v1' });
    expect(p.ES.parentNode).toBe(p.head);
    p.add(p.body, 'SCRIPT');
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
    p.add(p.body, 'DIV'); p.add(p.body, 'STYLE', { id: 'tll-foot-v1' }); p.add(p.body, 'DIV');
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
    const calls = { run: 0, rcpt: [] }; const MS = { nodeName: 'STYLE', nextElementSibling: null };
    // PF (A3) stands in for itself here: pre() sets wait-d as it does when the template will make the country crumb a link
    const PF = { pre: () => { log.push('pre'); hero.setAttribute('data-tll-mg-wait-d'); }, done: () => log.push('done'), end: () => log.push('end') };
    // MS: the story style, which the placement moves after each style as it arrives; it never makes a node count as whole
    new Function('document', 'window', 'MutationObserver', 'run', 'rcpt', 'MS', 'PF', runSrc)(document, { MutationObserver }, MutationObserver,
      () => { calls.run++; if (state.author) state.moved = true; log.push('run'); }, (cc, a) => { calls.rcpt.push([cc, a]); log.push('rcpt'); }, MS, PF);
    const tick = () => obs.filter((o) => o.on).forEach((o) => o.cb([]));
    const fire = (t) => (listeners[t] || []).forEach((f) => f());
    const whole = () => ({ parentNode: { parentNode: body, nextElementSibling: null }, nextElementSibling: {} });
    return { state, c, body, calls, obs, tick, fire, attrs, log, listeners, whole, MS };
  }
  it('waits until the byline row has arrived whole, then runs before the page is parsed', () => {
    const p = page();
    p.tick(); expect(p.calls.run).toBe(0);
    const col = { parentNode: { parentNode: p.body, nextElementSibling: null }, nextElementSibling: null };
    p.state.author = { parentNode: col, nextElementSibling: null };
    p.tick(); expect(p.calls.run).toBe(0);
    // a node a script adds to the end of the body (a consent iframe) follows the article, which is one of the body's own children:
    // that does not make the byline row whole
    col.parentNode.nextElementSibling = { nodeName: 'IFRAME' };
    p.tick(); expect(p.calls.run).toBe(0);
    // nor does the story style moved in right after it
    p.state.author.nextElementSibling = p.MS;
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
    // A3: PF.pre() runs right after the early run, so the stamp has read the date before the template's words go in
    expect(p.log.slice(0, 3)).toEqual(['run', '+data-tll-mg-wait-r', 'pre']);
  });
  it('writes the Receipts line only once the Receipts block has arrived whole, and shows the photo in the same step', () => {
    const p = page();
    p.state.author = p.whole();
    p.tick();
    const art = { parentNode: p.body, nextElementSibling: null };
    const sec = { parentNode: art, nextElementSibling: null };
    p.state.ledger = { parentNode: sec, nextElementSibling: null };
    const runs = p.calls.run;
    p.tick(); expect(p.calls.run).toBe(runs); expect(p.calls.rcpt.length).toBe(0);
    expect(p.attrs['data-tll-mg-wait-r']).toBe(1);
    art.nextElementSibling = { nodeName: 'IFRAME' };
    p.tick(); expect(p.calls.rcpt.length).toBe(0);
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
    p.state.helper = { parentNode: { parentNode: p.body, nextElementSibling: null }, nextElementSibling: null };
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
    // PF.done() (the old words back if the template never wrote its own) also runs after the template's handler; PF.end() runs in the
    // core's own handler, before the template's, and only lets the flag stand-in go once the flag script's handler has had its turn
    expect(p.log.indexOf('template')).toBeLessThan(p.log.indexOf('done'));
    expect(p.log.indexOf('end')).toBeLessThan(p.log.indexOf('template'));
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

// A3: PF against the real template script (its author() and place(), from the live embed) and the real site flag script
// (src/site-layers/tllflagsv53.js), on a small element tree that stands in for the story head. Each case is run twice: once as the
// page does without PF (the reference finished head) and once with PF.pre() before the first paint, then the page-parsed handlers in
// the order the page adds them, with the observers' callbacks delivered after each handler, as a browser does.
describe('story first frame A3: the page-parsed rewrites laid out before the first paint', () => {
  const tplJs = read('src', 'pages', 'story', 'after-2026-10-20', 'embed-3074c26c-after.html');
  const tplSrc = tplJs.slice(tplJs.indexOf('var MON='), tplJs.indexOf('function sponsored(){'));
  const flagsSrc = read('src', 'site-layers', 'tllflagsv53.js');
  const kebab = (k) => k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
  function world() {
    const mos = []; let pending = new Set(); const listeners = []; const timers = [];
    const notify = (n) => { for (const o of mos) if (o.on && o.t.contains(n)) pending.add(o); };
    const flush = () => { while (pending.size) { const all = [...pending]; pending = new Set(); for (const o of all) if (o.on) o.cb([]); } };
    class Text { constructor(v) { this.nodeType = 3; this.nodeValue = v; this.parentNode = null; } get textContent() { return this.nodeValue; } get html() { return this.nodeValue; } }
    class El {
      constructor(tag, attrs = {}, kids = []) {
        this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = { ...attrs }; this.childNodes = []; this.parentNode = null; this.style = { cssText: '' };
        const self = this;
        this.dataset = new Proxy({}, { get: (t, k) => self.attrs['data-' + kebab(String(k))], set: (t, k, v) => { self.attrs['data-' + kebab(String(k))] = String(v); return true; } });
        this.classList = { contains: (c) => self.cls().includes(c), remove: (c) => { self.attrs.class = self.cls().filter((x) => x !== c).join(' '); }, add: (c) => { if (!self.cls().includes(c)) self.attrs.class = self.cls().concat(c).join(' '); } };
        for (const k of kids) this.appendChild(typeof k === 'string' ? new Text(k) : k);
      }
      cls() { return (this.attrs.class || '').split(/\s+/).filter(Boolean); }
      get className() { return this.attrs.class || ''; } set className(v) { this.attrs.class = v; }
      getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; } setAttribute(k, v) { this.attrs[k] = String(v); } hasAttribute(k) { return k in this.attrs; } removeAttribute(k) { delete this.attrs[k]; }
      get attributes() { return Object.keys(this.attrs).map((name) => ({ name, value: this.attrs[name] })); }
      get firstChild() { return this.childNodes[0] || null; }
      get nextSibling() { const p = this.parentNode; return p ? p.childNodes[p.childNodes.indexOf(this) + 1] || null : null; }
      get children() { return this.childNodes.filter((n) => n.nodeType === 1); }
      get textContent() { return this.childNodes.map((n) => n.textContent).join(''); }
      set textContent(v) { this.childNodes.forEach((n) => { n.parentNode = null; }); this.childNodes = []; if (v !== '') { const t = new Text(String(v)); t.parentNode = this; this.childNodes.push(t); } notify(this); }
      _rm(n) { const i = this.childNodes.indexOf(n); if (i > -1) this.childNodes.splice(i, 1); n.parentNode = null; }
      insertBefore(n, ref) { if (n.parentNode) n.parentNode._rm(n); const i = ref ? this.childNodes.indexOf(ref) : -1; if (i < 0) this.childNodes.push(n); else this.childNodes.splice(i, 0, n); n.parentNode = this; notify(this); return n; }
      appendChild(n) { return this.insertBefore(n, null); }
      append(...xs) { for (const x of xs) this.appendChild(typeof x === 'string' ? new Text(x) : x); }
      removeChild(n) { this._rm(n); notify(this); return n; }
      replaceChild(n, old) { this.insertBefore(n, old); this._rm(old); notify(this); return old; }
      remove() { if (this.parentNode) this.parentNode.removeChild(this); }
      contains(n) { for (; n; n = n.parentNode) if (n === this) return true; return false; }
      querySelectorAll(sel) { const alts = sel.split(',').map((s) => s.trim()); const out = []; const walk = (e) => { for (const c of e.children) { if (alts.some((a) => match(c, a))) out.push(c); walk(c); } }; walk(this); return out; }
      querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
      get html() { const a = Object.keys(this.attrs).sort().map((k) => ' ' + k + '="' + this.attrs[k] + '"').join('') + (this.style.cssText ? ' style="' + this.style.cssText + '"' : '');
        return '<' + this.tagName.toLowerCase() + a + '>' + this.childNodes.map((n) => n.html).join('') + '</' + this.tagName.toLowerCase() + '>'; }
    }
    // compound selectors only (tag, .class, [attr], [attr=v], [attr="v"], [attr*="v"]): all that these scripts ask for
    function match(el, s) {
      const re = /^([a-z]+)|\.([\w-]+)|\[([\w-]+)(?:(\*?=)"?([^"\]]*)"?)?\]/gy; let m, seen = 0;
      while ((m = re.exec(s))) { seen = re.lastIndex;
        if (m[1] && el.tagName !== m[1].toUpperCase()) return false;
        if (m[2] && !el.cls().includes(m[2])) return false;
        if (m[3]) { const v = el.getAttribute(m[3]); if (v === null) return false; if (m[4] === '=' && v !== m[5]) return false; if (m[4] === '*=' && v.indexOf(m[5]) < 0) return false; } }
      if (seen !== s.length) throw new Error('selector not covered by the stand-in: ' + s);
      return true;
    }
    class MutationObserver { constructor(cb) { this.cb = cb; this.on = false; mos.push(this); } observe(t) { this.t = t; this.on = true; } disconnect() { this.on = false; } }
    const root = new El('html');
    const document = { readyState: 'loading', querySelector: (s) => root.querySelector(s), querySelectorAll: (s) => root.querySelectorAll(s),
      createElement: (t) => new El(t), addEventListener: (t, fn) => { if (t === 'DOMContentLoaded') listeners.push(fn); } };
    const setTimeout = (fn, ms) => { timers.push([ms, fn]); };
    // a page-parsed handler may throw (the template's did, in one check); the others still run, and the callbacks come after each
    const fire = () => { document.readyState = 'interactive'; for (const fn of listeners) { try { fn(); } catch (e) { } flush(); } };
    const tick = () => { timers.sort((a, b) => a[0] - b[0]).splice(0).forEach(([, fn]) => { fn(); flush(); }); };
    return { El, root, document, MutationObserver, setTimeout, fire, flush, tick, mos, listeners, timers };
  }
  // the story head as Webflow writes it (Balkans: no country, so the crumb stays text; Croatia and Southern Africa: a country link)
  function story(w, { crumb, byline, country = '', countryName = '', home = 'Copenhagen, Denmark', when = 'September 19, 2026', flags = true }) {
    const E = (t, a, k) => new w.El(t, a, k);
    const loc = E('span', { 'data-st3-loc': '1', 'data-st3-byline': byline, 'data-st3-country': country, 'data-st3-country-name': countryName }, [home]);
    const cr = E('div', { 'data-tll-crumb': 'country' }, [crumb]);
    const hero = E('section', { class: 'tll-story-hero' }, [E('div', { class: 'tll-container tll-story-hero-content' }, [
      E('div', { 'data-tll-breadcrumb': 'story' }, [E('a', { href: '/' }, ['Home']), E('span', {}, ['→']), E('a', { href: '/stories' }, ['Stories']), E('span', {}, ['→']), cr, E('span', {}, ['→']), E('div', { 'data-tll-crumb': 'title' }, ['A title'])]),
      E('div', { class: 'st3-author', 'data-st3-author': '1' }, [E('a', { class: 'st3-author-link' }, [E('div', { class: 'st3-author-text' }, [E('div', { class: 'st3-author-name' }, ['A writer']),
        E('div', { class: 'st3-author-place' }, [E('span', {}, ['From ']), loc, E('span', { 'data-st3-when': '1' }, [when]), E('span', { class: 'tll-mg-mins' }, [' · 9 min read'])])])])])])]);
    const body = E('body', {}, [hero]); if (flags) body.appendChild(E('script', { src: 'https://cdn.prod.website-files.com/x/tllflagsv53-5.3.0.js' })); w.root.appendChild(body);
    return { hero, loc, cr };
  }
  const tpl = (w) => new Function('document', tplSrc + '\nreturn {author:author,place:place};')(w.document);
  const flagScript = (w, out) => new Function('document', 'setTimeout', '__out', flagsSrc.replace('function R(){', '__out.f=f;function R(){'))(w.document, w.setTimeout, out || {});
  const pfOf = (w) => new Function('document', 'window', 'MutationObserver', 'setTimeout', pfSrc + '\nreturn PF;')(w.document, { MutationObserver: w.MutationObserver }, w.MutationObserver, w.setTimeout);
  // the page as it is without A3: the template's handler, then the flag script's
  function reference(o, { template = true, flagsRun = true } = {}) {
    const w = world(); const s = story(w, o); const T = tpl(w);
    w.document.addEventListener('DOMContentLoaded', () => { if (!template) throw new Error('template helper failure'); T.author(); T.place(); });
    if (flagsRun && o.flags !== false) flagScript(w);
    w.fire(); w.tick(); return { w, s };
  }
  // the page with A3: PF.pre() before the first paint, then the core's handler (PF.end), the template's, the core's after() (wait-d
  // off, PF.done), the flag script's
  function withPF(o, { template = true, flagsRun = true } = {}) {
    const w = world(); const s = story(w, o); const T = tpl(w); const PF = pfOf(w);
    // the country table is built in the first idle moment while the head loads
    expect(w.timers.length).toBe(1); w.tick();
    PF.pre(); const first = { html: s.hero.html, waitD: s.hero.hasAttribute('data-tll-mg-wait-d'), crumbText: s.cr.textContent, stand: s.cr.querySelector('[data-tll-mg-flags]') };
    w.document.addEventListener('DOMContentLoaded', () => PF.end());
    w.document.addEventListener('DOMContentLoaded', () => { if (!template) throw new Error('template helper failure'); T.author(); T.place(); });
    w.document.addEventListener('DOMContentLoaded', () => { s.hero.removeAttribute('data-tll-mg-wait-d'); PF.done(); });
    if (flagsRun && o.flags !== false) flagScript(w);
    let atFlags = null; w.listeners.push(() => { atFlags = w.root.querySelectorAll('[data-tll-mg-flags]').length; });
    w.fire(); const afterParse = { stand: w.root.querySelectorAll('[data-tll-mg-flags]').length, timers: w.timers.length };
    w.tick(); return { w, s, first, afterParse, atFlags };
  }
  const BALKANS = { crumb: 'BALKANS', byline: 'BALKANS' };
  const CROATIA = { crumb: 'CROATIA AND BOSNIA AND HERZEGOVINA', byline: 'CROATIA AND BOSNIA AND HERZEGOVINA', country: 'croatia', countryName: 'Croatia', when: 'May 9, 2023' };
  const SAFRICA = { crumb: 'SOUTH AFRICA, ZIMBABWE, ZAMBIA AND BOTSWANA', byline: 'SOUTH AFRICA, ZIMBABWE, ZAMBIA AND BOTSWANA', country: 'south-africa', countryName: 'South Africa', when: 'June 23, 2024' };
  const MADRID = { crumb: 'MADRID, SPAIN', byline: 'MADRID, SPAIN', country: 'spain', countryName: 'Spain', when: 'September 27, 2024' };
  // the place-and-date line (its class in the template is left out here; nothing below reads it)
  const placeLine = (s) => s.loc.parentNode.textContent;

  it('writes the template\'s place and month into the place-and-date line before the first paint, and the template writes the same', () => {
    const r = withPF(CROATIA), ref = reference(CROATIA);
    expect(r.first.html).toContain('>Croatia And Bosnia And Herzegovina</span><span data-st3-when="1">May 2023</span>');
    expect(placeLine(ref.s)).toBe('From Croatia And Bosnia And Herzegovina' + 'May 2023' + ' · 9 min read');
    expect(placeLine(r.s)).toBe(placeLine(ref.s));
  });
  it('Balkans: no country link, four flag boxes and the "+8 countries" count in front of the crumb, read the way the flag script reads it', () => {
    const r = withPF(BALKANS);
    expect(r.first.waitD).toBe(false);
    const st = r.first.stand;
    expect(st).not.toBe(null);
    expect(st.getAttribute('aria-hidden')).toBe('true');
    expect(st.style.cssText).toBe('display:inline-flex;vertical-align:-6px;margin-right:6px');
    expect(st.children.length).toBe(5);
    expect(st.children.slice(0, 4).map((b) => b.style.cssText)).toEqual([0, -7, -7, -7].map((m) => 'display:block;flex:none;width:22px;height:22px;margin:0 0 0 ' + m + 'px;padding:0;border:0'));
    expect(st.children[4].getAttribute('data-t')).toBe(' +8 countries');
    // the stand-in has no text of its own: the crumb reads as before, for the template, the flag script and the US flag layer
    expect(r.first.crumbText).toBe('BALKANS');
    expect(st.textContent).toBe('');
  });
  it('takes the stand-in out in the same step as the real flags arrive, so the finished head is exactly the page\'s own', () => {
    for (const o of [BALKANS, CROATIA, SAFRICA, MADRID]) {
      const r = withPF(o), ref = reference(o);
      expect(r.s.hero.html).toBe(ref.s.hero.html);
      expect(r.w.root.querySelectorAll('[data-tll-mg-flags]').length).toBe(0);
      expect(r.w.mos.every((m) => !m.on)).toBe(true);
    }
    // Balkans: gone before any later handler or task, not only by the next task
    const b = withPF(BALKANS);
    expect(b.afterParse.stand).toBe(0);
  });
  it('gives the crumb the box of the template\'s link only when the template will make one, and the link drops the stand-in with the old crumb', () => {
    for (const [o, link] of [[BALKANS, false], [CROATIA, true], [SAFRICA, true], [MADRID, true]]) expect(withPF(o).first.waitD).toBe(link);
    const r = withPF(SAFRICA);
    expect(r.first.stand.children.length).toBe(4);
    const a = r.s.hero.querySelector('[data-tll-crumb="country"]');
    expect(a.tagName).toBe('A');
    // the flag script's own box, in the link (it marks it aria-hidden as a property, which this tree does not write out)
    expect(a.html).toContain('<span style="display:inline-flex;vertical-align:-6px;margin-right:6px"><img');
    expect(r.afterParse.stand).toBe(0);
    // no flags for Croatia: the flag script cannot read "Bosnia" or "Herzegovina" on their own, so there is nothing to stand in for
    expect(withPF(CROATIA).first.stand).toBe(null);
  });
  it('reads a place as the flag script does', () => {
    const out = {}; const w = world(); story(w, BALKANS); flagScript(w, out);
    const places = ['BALKANS', 'CROATIA AND BOSNIA AND HERZEGOVINA', 'SOUTH AFRICA, ZIMBABWE, ZAMBIA AND BOTSWANA', 'MADRID, SPAIN', 'TEXAS HILL COUNTRY', 'Seven continents',
      'São Paulo, Brazil', 'NEW ORLEANS, LOUISIANA', 'Bosnia & Herzegovina', 'Copenhagen/Malmo', 'Peru and Chile and Bolivia and Ecuador and Colombia', 'Japan'];
    for (const p of places) {
      const n = out.f(p).length; const r = withPF({ crumb: p, byline: p });
      const st = r.first.stand;
      if (!n) { expect(st).toBe(null); continue; }
      expect(st.children.filter((c) => !c.hasAttribute('data-t')).length).toBe(Math.min(n, 4));
      const t = st.children.find((c) => c.hasAttribute('data-t'));
      expect(t ? t.getAttribute('data-t') : null).toBe(n > 4 ? ' +' + (n - 4) + ' countr' + (n - 4 > 1 ? 'ies' : 'y') : null);
    }
  });
  it('puts the old words back after the template\'s handler if the template never wrote its own (it threw), and the finished head matches', () => {
    for (const o of [BALKANS, CROATIA, SAFRICA]) {
      const r = withPF(o, { template: false }), ref = reference(o, { template: false });
      expect(r.s.hero.html).toBe(ref.s.hero.html);
      expect(placeLine(r.s)).toBe('From Copenhagen, Denmark' + (o.when || 'September 19, 2026') + ' · 9 min read');
    }
  });
  it('lets the stand-in go when the page is parsed if there is no flag script, and by the next task if the flag script never drew', () => {
    const none = withPF({ ...BALKANS, flags: false });
    expect(none.afterParse).toEqual({ stand: 0, timers: 0 });
    expect(none.s.hero.html).toBe(reference({ ...BALKANS, flags: false }).s.hero.html);
    const silent = withPF(BALKANS, { flagsRun: false });
    expect(silent.afterParse.stand).toBe(1);
    expect(silent.afterParse.timers).toBe(1);
    expect(silent.w.root.querySelectorAll('[data-tll-mg-flags]').length).toBe(0);
    expect(silent.s.hero.html).toBe(reference(BALKANS, { flagsRun: false }).s.hero.html);
  });
  it('leaves the head alone when the template has already done its part, and leaves a date it cannot read to the template', () => {
    const w = world(); const s = story(w, CROATIA); const T = tpl(w); T.author(); T.place(); const before = s.hero.html;
    const PF = pfOf(w); PF.pre(); PF.done();
    // the crumb is a link already: no box, and the flags stand-in goes in front of the link text as for any crumb
    expect(s.hero.hasAttribute('data-tll-mg-wait-d')).toBe(false);
    expect(s.hero.html).toBe(before);
    const odd = withPF({ ...BALKANS, when: '2026-09-19' });
    expect(odd.first.html).toContain('<span data-st3-when="1">2026-09-19</span>');
    expect(odd.s.hero.html).toBe(reference({ ...BALKANS, when: '2026-09-19' }).s.hero.html);
  });
  it('does nothing on a page with no story hero', () => {
    const w = world(); const PF = pfOf(w); w.tick();
    expect(() => { PF.pre(); PF.end(); PF.done(); }).not.toThrow();
    expect(w.timers.length).toBe(0);
  });
  it('builds the country table as the flag script does, ahead of time, once, and reads listed names without it', () => {
    expect(pfSrc).toContain('var FA=' + /A=(\{[^{}]*\})/.exec(flagsSrc)[1] + ',FN=null;');
    expect(pfSrc).toContain("if(document.readyState==='loading')setTimeout(table,0);");
    expect(pfSrc).toContain('function table(){if(FN)return;');
    // Balkans is on the flag script's own list: read with no table at all (no Intl call before the first paint)
    let made = 0; const RealDN = Intl.DisplayNames;
    Intl.DisplayNames = function (...a) { made++; return new RealDN(...a); };
    try {
      const w = world(); story(w, BALKANS); const PF = pfOf(w); PF.pre();
      expect(made).toBe(0);
      expect(w.root.querySelectorAll('[data-tll-mg-flags]').length).toBe(1);
      w.tick(); expect(made).toBe(1);
      // the byline first: a name off the list builds it on the spot, and the idle build then does nothing more
      const w2 = world(); story(w2, CROATIA); const PF2 = pfOf(w2); PF2.pre(); expect(made).toBe(2); w2.tick(); expect(made).toBe(2);
    } finally { Intl.DisplayNames = RealDN; }
  });
});
