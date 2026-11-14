// 14 Nov 2026, the story page first-frame jump at 390 (reports/evidence/story-first-frame-2026-11-14/diagnosis.md, idea A: the F1
// pattern of the cover, on the story layer). The writer's avatar had no size until the Stories Template's own style (tll-st3-story-v1)
// was parsed at the end of the body, and the magazine layout came only at DOMContentLoaded, so a fast photo could paint the head in
// three different layouts (0.32 layout shift on about a third of fresh loads at 390). Now the core puts style#tll-mag-story-v1 into
// the head at once, keeps it after every style that arrives while the page is parsed, moves it to the end of the body once the page is
// parsed, carries the few template rules the first paint needs (keyed on the template's page id, as heavy as the template's own), and
// runs the magazine moves (heroR, the figure, the byline in the head) as soon as the byline row has arrived.
// The layout itself was measured in a real browser (scratchpad nov14/first-frame-a); here: the built core, the copied rules against the
// template, and the two early pieces run against a small stand-in for document and MutationObserver.
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
const styleText = JSON.parse(/MS\.textContent=("(?:[^"\\]|\\.)*");/.exec(story)[1]);
const placeSrc = /var MS=document\.createElement[\s\S]*?\}else place\(\);\n/.exec(story)[0];
const runSrc = /\/\* F1: run\(\) as soon as[\s\S]*?document\.addEventListener\('DOMContentLoaded',function\(\)\{stop\(\);run\(\);late\(\);\}\);\}\)\(\);/.exec(story)[0];

// A stand-in for the parts of the DOM the two pieces touch. Document order is one flat list; head nodes sit before body nodes.
function fakeDom() {
  const order = []; const listeners = {}; const observers = [];
  const idx = (n) => order.indexOf(n);
  const remove = (n) => { const i = idx(n); if (i > -1) order.splice(i, 1); };
  function node(nodeName, parent) {
    return { nodeName, parentNode: parent || null, compareDocumentPosition(o) { return idx(o) < idx(this) ? 2 : 4; },
      get nextSibling() { return order[idx(this) + 1] || null; } };
  }
  const head = { nodeName: 'HEAD', appendChild(n) { remove(n); n.parentNode = head; const b = order.findIndex((x) => x.parentNode === body); b < 0 ? order.push(n) : order.splice(b, 0, n); } };
  const body = { nodeName: 'BODY', appendChild(n) { remove(n); n.parentNode = body; order.push(n); },
    insertBefore(n, ref) { remove(n); n.parentNode = body; ref ? order.splice(idx(ref), 0, n) : order.push(n); } };
  head.insertBefore = (n, ref) => { remove(n); n.parentNode = head; ref ? order.splice(idx(ref), 0, n) : head.appendChild(n); };
  const document = { readyState: 'loading', head, body, documentElement: {},
    createElement: (t) => node(t.toUpperCase()),
    addEventListener: (t, fn) => { (listeners[t] = listeners[t] || []).push(fn); } };
  class MutationObserver { constructor(cb) { this.cb = cb; this.on = false; observers.push(this); } observe() { this.on = true; } disconnect() { this.on = false; } }
  const window = { MutationObserver };
  // the parser adds a node; every live observer sees it in one batch
  const add = (parent, nodeName) => { const n = node(nodeName); parent.appendChild(n); observers.filter((o) => o.on).forEach((o) => o.cb([{ addedNodes: [n] }])); return n; };
  const fire = (t) => { document.readyState = 'interactive'; (listeners[t] || []).forEach((f) => f()); };
  return { document, window, head, body, order, observers, add, fire, MutationObserver };
}

describe('story first frame: the built core', () => {
  it('puts the story style into the head at once and moves it to the end of the body when the page is parsed', () => {
    expect(story).toContain("var MS=document.createElement('style');MS.id='tll-mag-story-v1';");
    expect(story).toContain('(document.head||document.documentElement).appendChild(MS);');
    expect(story).toContain("document.addEventListener('DOMContentLoaded',place);}else place();");
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
  it('still carries the whole magazine style after the early template rules', () => {
    const mag = read('src', 'design', 'magazine-2026-10', 'story-build', 'tll-mag-story-v1.html');
    const first = /<style id="tll-mag-story-v1">\n([^\n]*)/.exec(mag)[1];
    expect(styleText.indexOf(first)).toBeGreaterThan(styleText.indexOf(PAGE));
    expect(styleText).toContain('aspect-ratio:auto var(--tll-hero-r,16/9)');
  });
});

describe('story first frame: the template rules in the early style', () => {
  const early = styleText.split('\n').filter((l) => l.startsWith(PAGE));
  it('covers the avatar, the byline row and the meta row, each keyed on the Stories Template page id with no added weight', () => {
    expect(early.length).toBe(15);
    for (const l of early) expect(l.startsWith(PAGE)).toBe(true);
    const sel = early.map((l) => l.slice(0, l.indexOf('{'))).join('\n');
    for (const s of ['.st3-author-avatar', '.st3-author-img', '.st3-author-link', '.st3-author{', '.tll-story-meta-row>:nth-child(5)', '.tll-story-meta-row>:nth-child(6)'])
      expect(sel + '{').toContain(s.replace('{', ''));
    // :where() adds nothing to the weight: no early rule may sit outside it
    for (const l of early) expect(l.replace(/:where\([^)]*\]\)/g, '')).not.toMatch(/html\[/);
  });
  it('copies each rule exactly as the template writes it, so the finished page is unchanged', () => {
    for (const l of early.slice(1)) {
      const rule = l.split(PAGE + ' ').join('');
      expect(st3).toContain(rule);
    }
  });
  it('gives the tokens those rules use the template values (the template\'s :root still wins once it arrives)', () => {
    const tokens = /\{([^}]*)\}/.exec(early[0])[1].split(';');
    expect(tokens.length).toBe(5);
    for (const t of tokens) expect(st3).toContain(t);
  });
  it('sizes the avatar from the first paint, as the template does: 40 px, the photo filling it', () => {
    expect(styleText).toContain(PAGE + ' .st3-author-avatar{flex:none;width:40px;height:40px;');
    expect(styleText).toContain(PAGE + ' .st3-author-img{display:block;width:100%;height:100%;object-fit:cover}');
    // the head byline keeps its 44 px avatar: the magazine rule is heavier than the keyed copy
    expect(styleText).toContain('.tll-story-hero-content .st3-author-avatar{width:44px;height:44px;border:0}');
  });
});

describe('story first frame: the style placement in a stand-in page', () => {
  function load() {
    const d = fakeDom();
    const r = new Function('document', 'window', 'MutationObserver', placeSrc + '\nreturn {MS:MS};')(d.document, d.window, d.MutationObserver);
    return { ...d, MS: r.MS };
  }
  it('goes into the head at once, then follows every style the parser adds, the template style included', () => {
    const p = load();
    expect(p.MS.parentNode).toBe(p.head);
    const inline = p.add(p.body, 'STYLE');
    expect(p.order.indexOf(p.MS)).toBe(p.order.indexOf(inline) + 1);
    p.add(p.body, 'DIV');
    expect(p.order.indexOf(p.MS)).toBe(p.order.indexOf(inline) + 1);
    const tplStyle = p.add(p.body, 'STYLE');
    expect(p.order.indexOf(p.MS)).toBe(p.order.indexOf(tplStyle) + 1);
  });
  it('stays put for a style a script adds to the head, which already comes before it', () => {
    const p = load();
    const inline = p.add(p.body, 'STYLE');
    p.add(p.head, 'STYLE');
    expect(p.order.indexOf(p.MS)).toBe(p.order.indexOf(inline) + 1);
  });
  it('moves to the end of the body when the page is parsed and stops watching', () => {
    const p = load();
    p.add(p.body, 'STYLE'); p.add(p.body, 'DIV');
    p.fire('DOMContentLoaded');
    expect(p.order[p.order.length - 1]).toBe(p.MS);
    expect(p.MS.parentNode).toBe(p.body);
    expect(p.observers.every((o) => !o.on)).toBe(true);
  });
  it('goes straight to the end of the body when the core runs after the page was parsed', () => {
    const d = fakeDom(); d.document.readyState = 'complete';
    const r = new Function('document', 'window', 'MutationObserver', placeSrc + '\nreturn {MS:MS};')(d.document, d.window, d.MutationObserver);
    expect(r.MS.parentNode).toBe(d.body);
    expect(d.observers.length).toBe(0);
  });
});

describe('story first frame: the early run in a stand-in page', () => {
  function page(readyState = 'loading') {
    const listeners = {}; const obs = [];
    const state = { author: null, ledger: null };
    const c = { querySelector: (s) => (s === '.st3-author' ? state.author : null) };
    const body = {};
    const document = { readyState, body, documentElement: {},
      querySelector: (s) => (s === '.st3-author' ? state.author : s === '[data-tll-ledger="story"]' ? state.ledger : s === '.tll-story-hero .tll-story-hero-content' ? c : null),
      addEventListener: (t, fn) => { (listeners[t] = listeners[t] || []).push(fn); } };
    class MutationObserver { constructor(cb) { this.cb = cb; this.on = false; obs.push(this); } observe() { this.on = true; } disconnect() { this.on = false; } }
    const calls = { run: 0, rcpt: [] };
    new Function('document', 'window', 'MutationObserver', 'run', 'rcpt', runSrc)(document, { MutationObserver }, MutationObserver, () => { calls.run++; }, (cc, a) => { calls.rcpt.push([cc, a]); });
    const tick = () => obs.filter((o) => o.on).forEach((o) => o.cb([]));
    const fire = (t) => (listeners[t] || []).forEach((f) => f());
    return { state, c, body, calls, obs, tick, fire };
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
  it('writes the Receipts line only once the Receipts block has arrived whole, and then stops watching', () => {
    const p = page();
    p.state.author = { parentNode: p.body, nextElementSibling: {} };
    p.tick();
    const sec = { parentNode: p.body, nextElementSibling: null };
    p.state.ledger = { parentNode: sec, nextElementSibling: null };
    const runs = p.calls.run;
    p.tick(); expect(p.calls.run).toBe(runs); expect(p.calls.rcpt.length).toBe(0);
    sec.nextElementSibling = {};
    p.tick(); expect(p.calls.rcpt).toEqual([[p.c, p.state.author]]);
    expect(p.obs.every((o) => !o.on)).toBe(true);
  });
  it('keeps the page-parsed event as the fallback', () => {
    const p = page();
    p.fire('DOMContentLoaded');
    expect(p.calls.run).toBe(1);
    expect(p.obs.every((o) => !o.on)).toBe(true);
  });
  it('runs at once when the page was already parsed', () => {
    const p = page('complete');
    expect(p.calls.run).toBe(1);
    expect(p.obs.length).toBe(0);
  });
});
