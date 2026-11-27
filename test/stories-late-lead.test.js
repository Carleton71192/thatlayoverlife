// asia-cls check of 25 Nov, note 2 (reports/evidence/asia-cls-2026-11-25/check.md): with the core and chunks about 3 s late, the
// page's chip script (tll-lib-chips-v1) has wired its chips before tll-stories-places-v1 runs, so the added Asia, Middle East and
// Oceania chips filter through the layer's own fallback. That fallback set display on the grid's items and did not move them, and
// the page's lead layer (tll-lib-lead-v1) watches only the grid's child list and the tll:lib-filtered event, so the lead mark stayed
// on a card the filter hid. These tests run the page's chip and lead scripts from the saved live /stories footer, then the layer late.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from './mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const src = read('src', 'site-layers', 'tll-stories-places-v1.js');
const wait = read('src', 'site-layers', 'tll-place-wait-v1.js');
const footer = read('src', 'pages', 'live-2026-11-21', 'stories', 'page-footer.html');
const chipsPage = /<script id="tll-lib-chips-v1">\n([\s\S]*?)<\/script>/.exec(footer)[1];
const lead = /<script id="tll-lib-lead-v1">\n([\s\S]*?)<\/script>/.exec(footer)[1];
const card = (region, date) => `<div data-tll-card><a href="/stories/x">x</a><div data-tll-region>${region}</div><div data-tll-date>${date}</div></div>`;
// newest first after the page's sort: Africa (the lead on load), Asia, Europe, Asia
const PAGE = '<div data-tll-chips="place-sort"><div class="tll-chip-row"><a href="#" class="tll-filter-chip-on" data-tll-place="all">All places</a>'
  + '<a href="#" class="tll-shelf-chip" data-tll-place="Africa">Africa</a><a href="#" class="tll-shelf-chip" data-tll-place="Europe">Europe</a></div>'
  + '<a href="#" data-tll-sort="time">Shortest</a></div>'
  + '<div class="tll-lib-grid">' + card('Europe', 'May 1, 2025') + card('Asia', 'June 1, 2025') + card('Africa', 'July 1, 2025') + card('Asia', 'March 1, 2025') + '</div>';
const CHUNK = 'https://cdn.jsdelivr.net/gh/x/y@abc/src/site-layers/chunks/stories.js';

// MutationObserver records the way a browser delivers them (after the running task, to each matching observer on the grid): the grid's
// child list, and an attribute of an item only for an observer with subtree and the name in its filter. A style.display write on an
// item is not seen by the lead layer's observer (subtree: false), in a browser or here.
function deliver(dom, grid) {
  let recs = [];
  const flushRecs = () => { const r = recs; recs = []; dom.observers.filter((o) => o.target === grid).forEach((o) => {
    const mine = r.filter((x) => (x.type === 'childList' ? o.opts.childList : o.opts.attributes && o.opts.subtree && (!o.opts.attributeFilter || o.opts.attributeFilter.includes(x.name))));
    if (mine.length) o.cb(mine, o.mo); }); };
  const send = (rec = { type: 'childList' }) => { if (!recs.length) Promise.resolve().then(flushRecs); recs.push(rec); };
  ['appendChild', 'insertBefore'].forEach((n) => { const f = grid[n]; grid[n] = function (...a) { const r = f.apply(this, a); send(); return r; }; });
  [...grid.children].forEach((k) => {
    const set = k.setAttribute, rm = k.removeAttribute;
    k.setAttribute = function (n, v) { set.call(this, n, v); send({ type: 'attributes', name: n }); };
    k.removeAttribute = function (n) { const had = this.hasAttribute(n); rm.call(this, n); if (had) send({ type: 'attributes', name: n }); };
  });
}

// late: the page's scripts run first (DOMContentLoaded), the stories chunk 3 s later. normal: the chunk first, as at normal speed.
async function open(search, { late = true } = {}) {
  const dom = createDom({ pathname: '/stories', html: PAGE }); dom.window.location.search = search;
  const el = dom.document.createElement('script'); el.setAttribute('src', CHUNK); dom.document.head.appendChild(el);
  dom.run(wait); const grid = dom.document.querySelector('.tll-lib-grid'); deliver(dom, grid);
  const history = { state: null, replaceState() {} };
  const leadOf = () => { const k = [...grid.children].find((c) => c.getAttribute('data-tll-lead') === '1'); return k ? k.querySelector('[data-tll-region]').textContent : null; };
  let before = null;
  if (late) { dom.run(chipsPage, { history }); dom.run(lead); await dom.tick(3000); before = { lead: leadOf(), mark: dom.document.documentElement.hasAttribute('data-tll-place-wait') }; dom.run(src, { history }); }
  else { dom.run(src, { history }); dom.run(chipsPage, { history }); dom.run(lead); }
  el.dispatchEvent(new dom.window.Event('load'));
  const hidden = (k) => dom.getComputedStyle(k).display === 'none';
  const state = () => {
    const kids = [...grid.children], marked = kids.filter((k) => k.getAttribute('data-tll-lead') === '1');
    const first = kids.find((k) => !hidden(k)) || null;
    return { marked: marked.length, leadHidden: marked.some(hidden), onFirst: marked.length === 1 && marked[0] === first, noneVisible: !first,
      leadRegion: marked[0] ? marked[0].querySelector('[data-tll-region]').textContent : null, shown: kids.filter((k) => !hidden(k)).length };
  };
  return { dom, grid, state, before, chip: (v) => dom.document.querySelector(`[data-tll-place="${v}"]`) };
}
const mark = (dom) => dom.document.documentElement.hasAttribute('data-tll-place-wait');

describe('late core: the lead mark follows the place filter (asia-cls check, note 2)', () => {
  it('?place=Asia with the chunk 3 s late: the lead is on the first Asia card before the grid is shown', async () => {
    const { dom, state, chip, before } = await open('?place=Asia');
    expect(before).toEqual({ lead: 'Africa', mark: true });
    let shownWith = null;
    while (await dom.step()) { if (!mark(dom)) { shownWith = state(); break; } if (dom.now() > 15000) break; }
    expect(chip('Asia').getAttribute('aria-pressed')).toBe('true');
    expect(shownWith).toMatchObject({ shown: 2, marked: 1, onFirst: true, leadHidden: false, leadRegion: 'Asia' });
  });
  it('no ?place=, chunk late, a reader clicks Asia: the lead moves to the first Asia card', async () => {
    const { dom, state, chip } = await open('');
    await dom.tick(1000); expect(state()).toMatchObject({ shown: 4, onFirst: true, leadRegion: 'Africa' });
    chip('Asia').click(); await dom.tick(100);
    expect(state()).toMatchObject({ shown: 2, marked: 1, onFirst: true, leadHidden: false, leadRegion: 'Asia' });
  });
  it('chunk late, any chip in turn (fallback and page chips): the lead is always the first visible card, never a hidden one', async () => {
    const { dom, state, chip } = await open('');
    for (const v of ['Asia', 'Europe', 'Oceania', 'Asia', 'Africa', 'Middle East', 'all', 'Asia']) {
      chip(v).click(); await dom.tick(100); const s = state();
      expect(s.leadHidden, v).toBe(false);
      if (s.noneVisible) expect(s.marked, v).toBe(0); else expect(s.onFirst, v).toBe(true);
    }
  });
  it('a place with no story yet: no card keeps the lead mark', async () => {
    const { dom, state, chip } = await open('');
    chip('Oceania').click(); await dom.tick(100);
    expect(state()).toMatchObject({ shown: 0, marked: 0 });
    expect(dom.document.getElementById('tll-chip-note')).not.toBe(null);
  });
  it('the fallback sends tll:lib-filtered once per click, after the cards are filtered', async () => {
    const { dom, chip } = await open('');
    const seen = []; dom.document.addEventListener('tll:lib-filtered', () => seen.push([...dom.document.querySelectorAll('.tll-lib-grid > div')].filter((d) => d.style.display !== 'none').length));
    chip('Asia').click(); chip('Middle East').click();
    expect(seen).toEqual([2, 0]);
  });
  it('normal speed (chunk before the page scripts): unchanged, the page wires every chip and the lead follows', async () => {
    const { dom, state, chip } = await open('?place=Asia', { late: false });
    await dom.tick(1000); expect(mark(dom)).toBe(false);
    expect(state()).toMatchObject({ shown: 2, onFirst: true, leadRegion: 'Asia' });
    chip('Europe').click(); await dom.tick(100);
    expect(state()).toMatchObject({ shown: 1, onFirst: true, leadRegion: 'Europe' });
  });
});
