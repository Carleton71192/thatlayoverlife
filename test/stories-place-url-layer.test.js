// tll-stories-places-v1 (the /stories chunk; sweep of 21 Nov, item A12). A chosen place chip did not change the address, so a
// reload, the back button or a shared link lost it. The layer now writes ?place= on a chip click (All places takes it out, ?q= stays)
// and on load presses the chip a ?place= names, through the page's own chip script (run here from its saved live copy).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from './mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const src = read('src', 'site-layers', 'tll-stories-places-v1.js');
const chipsPage = /<script id="tll-lib-chips-v1">\n([\s\S]*)<\/script>/.exec(read('src', 'pages', 'stories', 'live-2026-11-16', 'tll-lib-chips-v1.live.html'))[1];
const card = (region, date) => `<div data-tll-card><a href="/stories/x">x</a><div data-tll-region>${region}</div><div data-tll-date>${date}</div></div>`;
const PAGE = '<div data-tll-chips="place-sort"><div class="tll-chip-row"><a href="#" class="tll-filter-chip-on" data-tll-place="all">All places</a>'
  + '<a href="#" class="tll-shelf-chip" data-tll-place="Africa">Africa</a><a href="#" class="tll-shelf-chip" data-tll-place="Europe">Europe</a></div></div>'
  + '<div class="tll-lib-grid">' + card('Europe', 'May 1, 2025') + card('Asia', 'June 1, 2025') + card('Africa', 'July 1, 2025') + '</div>';

async function page(search = '') {
  const dom = createDom({ pathname: '/stories', html: PAGE });
  dom.window.location.search = search;
  const history = { state: null, calls: [], replaceState(st, t, u) { this.calls.push(u); const i = u.indexOf('?'); dom.window.location.search = i < 0 ? '' : u.slice(i).replace(/#.*$/, ''); } };
  dom.window.location.hash = '';
  dom.run(src, { history }); dom.run(chipsPage, { history }); await dom.tick(500);
  return { dom, history, shown: () => [...dom.document.querySelectorAll('.tll-lib-grid > div')].filter((d) => d.style.display !== 'none').map((d) => d.querySelector('[data-tll-region]').textContent) };
}
const chip = (dom, v) => dom.document.querySelector(`[data-tll-place="${v}"]`);

describe('tll-stories-places-v1 ?place= (A12)', () => {
  it('a chip click writes ?place=, All places takes it out, ?q= stays', async () => {
    const { dom, history } = await page('?q=train');
    chip(dom, 'Asia').click();
    expect(history.calls.at(-1)).toBe('/stories?q=train&place=Asia');
    chip(dom, 'all').click();
    expect(history.calls.at(-1)).toBe('/stories?q=train');
  });
  it('a ?place= on load presses that chip and the page filters by it (the added Asia chip included)', async () => {
    const { dom, shown } = await page('?place=asia');
    expect(chip(dom, 'Asia').getAttribute('aria-pressed')).toBe('true');
    expect(shown()).toEqual(['Asia']);
  });
  it('a ?place= that names no chip changes nothing', async () => {
    const { shown, history } = await page('?place=Mars');
    expect(shown().length).toBe(3);
    expect(history.calls).toEqual([]);
  });
});

describe('tll-stories-places-v1 byline dots (A16)', () => {
  function byline(nameRect, placeRect) {
    const dom = createDom({ pathname: '/stories', html: '<a class="tll-lib-card" href="/s"><div class="tll-lib-byline"><div class="tll-lib-byline-name">N</div><div data-s3-place="1">P</div></div></a>' });
    dom.document.querySelector('.tll-lib-byline-name')._rect = nameRect; dom.document.querySelector('[data-s3-place]')._rect = placeRect;
    dom.run(src, { history: { replaceState() {} } }); return dom.document.querySelector('[data-s3-place]');
  }
  it('marks a place that wrapped below the name', () => {
    expect(byline({ top: 100, bottom: 118, height: 18, left: 40, right: 200, width: 160 }, { top: 120, bottom: 135, height: 15, left: 0, right: 120, width: 120 }).hasAttribute('data-tll-own-line')).toBe(true);
  });
  it('leaves a place beside the name, and a hidden card, unmarked', () => {
    expect(byline({ top: 100, bottom: 118, height: 18, left: 40, right: 160, width: 120 }, { top: 102, bottom: 117, height: 15, left: 168, right: 300, width: 132 }).hasAttribute('data-tll-own-line')).toBe(false);
    expect(byline({ top: 0, bottom: 0, height: 0, left: 0, right: 0, width: 0 }, { top: 0, bottom: 0, height: 0, left: 0, right: 0, width: 0 }).hasAttribute('data-tll-own-line')).toBe(false);
  });
  it('the core style drops the dot and keeps the marked place on its own line', () => {
    const css = read('src', 'site-layers', 'tll-sweep-1121-v1.html');
    expect(css).toContain('html.tllp-stories body .tll-lib-card [data-s3-place][data-tll-own-line]{flex-basis:100%}html.tllp-stories body .tll-lib-card [data-s3-place][data-tll-own-line]::before{content:none}');
  });
});

// Check of the sweep, note 3: with late scripts a shared ?place= link painted all cards, then dropped to the place's (CLS 0.52). The core
// layer tll-place-wait-v1 marks html while a valid ?place= is pending and the core style keeps the grid visibility:hidden (no reflow);
// the replay above takes the mark off once it has pressed the chip; the core takes it off if the chunk fails, 3.5 s after the later of
// the chunk's load and DOMContentLoaded (the replay waits for DOMContentLoaded; review 2, finding 3.1), and after 10 s in any case.
describe('tll-place-wait-v1 holds the grid while a ?place= is pending (check note 3)', () => {
  const wait = read('src', 'site-layers', 'tll-place-wait-v1.js');
  const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
  const CHUNK = 'https://cdn.jsdelivr.net/gh/x/y@abc/src/site-layers/chunks/stories.js';
  const mark = (dom) => dom.document.documentElement.hasAttribute('data-tll-place-wait');
  function open(pathname, search, { chunk = CHUNK } = {}) {
    const dom = createDom({ pathname, html: PAGE }); dom.window.location.search = search;
    let el = null; if (chunk) { el = dom.document.createElement('script'); el.setAttribute('src', chunk); dom.document.head.appendChild(el); }
    dom.run(wait); return { dom, chunkEl: el, fire: (type) => el.dispatchEvent(new dom.window.Event(type)) };
  }
  it('a valid ?place= with the stories chunk on its way marks the page at once', () => {
    for (const q of ['?place=Europe', '?place=asia', '?place=Middle%20East', '?q=train&place=Oceania']) expect(mark(open('/stories', q).dom), q).toBe(true);
    expect(mark(open('/stories', '?place=Asia', { chunk: CHUNK.replace('stories.js', 'stories-preview.js') }).dom)).toBe(true);
  });
  it('no mark without a valid ?place=, on another page, or when no stories chunk was asked for', () => {
    for (const q of ['', '?q=train', '?place=all', '?place=Mars', '?place=']) expect(mark(open('/stories', q).dom), q).toBe(false);
    expect(mark(open('/stories/some-trip', '?place=Europe').dom)).toBe(false);
    expect(mark(open('/stories', '?place=Europe', { chunk: null }).dom)).toBe(false);
    expect(mark(open('/stories', '?place=Europe', { chunk: CHUNK.replace('stories.js', 'story.js') }).dom)).toBe(false);
  });
  it('the replay takes the mark off right after it pressed the chip, with the grid filtered', async () => {
    const { dom } = open('/stories', '?place=Africa');
    const history = { state: null, replaceState() {} };
    dom.run(src, { history }); dom.run(chipsPage, { history });
    await dom.tick(200);
    expect(chip(dom, 'Africa').getAttribute('aria-pressed')).toBe('true');
    expect(mark(dom)).toBe(false);
  });
  it('a chunk that comes late keeps the grid hidden until it has run, then the replay\'s wait (no fixed 3 s race from the core)', async () => {
    const { dom, fire } = open('/stories', '?place=Europe');
    await dom.tick(2990); expect(mark(dom)).toBe(true);
    await dom.tick(100); expect(mark(dom)).toBe(true);
    dom.run(src, { history: { replaceState() {} } }); fire('load');
    await dom.tick(2800); expect(mark(dom)).toBe(true);
    await dom.tick(200); expect(mark(dom)).toBe(false);
  });
  it('the core alone lets go 3.5 s after the chunk has run, at once if it fails, and after 10 s in any case', async () => {
    const a = open('/stories', '?place=Europe'); a.fire('load');
    await a.dom.tick(3499); expect(mark(a.dom)).toBe(true);
    await a.dom.tick(1); expect(mark(a.dom)).toBe(false);
    const b = open('/stories', '?place=Europe'); b.fire('error'); expect(mark(b.dom)).toBe(false);
    const c = open('/stories', '?place=Europe');
    await c.dom.tick(9999); expect(mark(c.dom)).toBe(true);
    await c.dom.tick(1); expect(mark(c.dom)).toBe(false);
  });
  // Review 2, finding 3.1: the chunk can run while the page is still loading and the page's footer scripts hold DOMContentLoaded
  // back; the replay and the page's chip script both wait for it, so the core's wait starts there.
  const parsed = (dom) => { dom.document.readyState = 'interactive'; dom.document.dispatchEvent(new dom.window.Event('DOMContentLoaded')); };
  it('page still loading, DOMContentLoaded 4 s after the chunk load: the grid stays hidden until the replay has pressed the chip', async () => {
    const { dom, fire } = open('/stories', '?place=Africa'); dom.document.readyState = 'loading';
    const history = { state: null, replaceState() {} };
    dom.run(src, { history }); dom.run(chipsPage, { history }); fire('load');
    await dom.tick(4000); expect(mark(dom)).toBe(true);
    expect(chip(dom, 'Africa').getAttribute('aria-pressed')).not.toBe('true');
    parsed(dom); await dom.tick(200);
    expect(chip(dom, 'Africa').getAttribute('aria-pressed')).toBe('true');
    expect(mark(dom)).toBe(false);
  });
  it('page still loading, DOMContentLoaded 4 s after the chunk load: the core alone lets go 3.5 s after DOMContentLoaded', async () => {
    const { dom, fire } = open('/stories', '?place=Europe'); dom.document.readyState = 'loading'; fire('load');
    await dom.tick(4000); expect(mark(dom)).toBe(true);
    parsed(dom);
    await dom.tick(3499); expect(mark(dom)).toBe(true);
    await dom.tick(1); expect(mark(dom)).toBe(false);
  });
  it('page still loading, DOMContentLoaded 1 s after the chunk load: 3.5 s from DOMContentLoaded', async () => {
    const { dom, fire } = open('/stories', '?place=Europe'); dom.document.readyState = 'loading'; fire('load');
    await dom.tick(1000); parsed(dom);
    await dom.tick(3499); expect(mark(dom)).toBe(true);
    await dom.tick(1); expect(mark(dom)).toBe(false);
  });
  it('DOMContentLoaded before the chunk load: 3.5 s from the chunk load, and the replay still lets go first', async () => {
    const { dom, fire } = open('/stories', '?place=Europe'); dom.document.readyState = 'loading';
    await dom.tick(500); parsed(dom);
    await dom.tick(1500); fire('load');
    await dom.tick(3499); expect(mark(dom)).toBe(true);
    await dom.tick(1); expect(mark(dom)).toBe(false);
    const b = open('/stories', '?place=Europe'); b.dom.document.readyState = 'loading'; parsed(b.dom);
    b.dom.run(src, { history: { replaceState() {} } }); b.fire('load');
    await b.dom.tick(2950); expect(mark(b.dom)).toBe(false);
  });
  it('a chunk error while the page is still loading lets go at once', () => {
    const { dom, fire } = open('/stories', '?place=Europe'); dom.document.readyState = 'loading'; fire('error');
    expect(mark(dom)).toBe(false);
  });
  it('the core style hides with visibility, not display, only while marked; the layer is in the core and its list matches the chips', () => {
    const css = read('src', 'site-layers', 'tll-sweep-1121-v1.html');
    expect(css).toContain('html[data-tll-place-wait] body :is(.tll-lib-grid,.tll-library-grid){visibility:hidden !important}');
    expect(css).not.toMatch(/data-tll-place-wait[^{]*\{[^}]*display/);
    expect(core).toContain('/* src/site-layers/tll-place-wait-v1.js */');
    expect(core.indexOf('/* src/site-layers/tll-place-wait-v1.js */')).toBeGreaterThan(core.indexOf('/* Chunk loader:'));
    const order = JSON.parse(/var ORDER=(\[[^\]]*\])/.exec(src)[1].replace(/'/g, '"')).filter((p) => p !== 'all').map((p) => p.toLowerCase());
    expect(JSON.parse(/var PLACES=(\[[^\]]*\])/.exec(wait)[1].replace(/'/g, '"'))).toEqual(order);
  });
});
