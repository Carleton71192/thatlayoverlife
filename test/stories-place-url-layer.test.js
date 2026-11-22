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
