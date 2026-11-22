// tll-byline-links-v1 (the site chunk; sweep of 21 Nov, item A11). The site script tllauthorlinkv1 makes each card's byline row a
// role=link with tabindex 0, inside the card link, beside the name this layer makes a keyboard link: three Tab stops a card. The
// layer now takes role, tabindex and aria-label off the row once the name is wired, and again when that script sets them later.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from './mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'site-layers', 'tll-byline-links-v1.js'), 'utf8');
const CARD = '<a class="tll-lib-card" href="/stories/a"><div class="tll-lib-byline" role="link" tabindex="0" aria-label="Open the profile of Ana Lima"><img class="tll-lib-byline-img"><div class="tll-lib-byline-name">Ana Lima<div data-s3-place>Lisbon, Portugal</div></div></div></a>';
const stops = (dom) => dom.document.querySelectorAll('[tabindex="0"]').length;

describe('tll-byline-links-v1 byline row (A11)', () => {
  it('the name stays a keyboard link to the writer page and the row loses role, tabindex and aria-label', async () => {
    const dom = createDom({ pathname: '/stories', html: CARD + CARD.replace('Ana Lima', 'Bo Chen') });
    dom.run(src); await dom.tick(0);
    const row = dom.document.querySelector('.tll-lib-byline'); const name = row.querySelector('.tll-lib-byline-name');
    expect([row.getAttribute('role'), row.getAttribute('tabindex'), row.getAttribute('aria-label')]).toEqual([null, null, null]);
    expect([name.getAttribute('role'), name.getAttribute('tabindex'), name.getAttribute('data-tll-bl')]).toEqual(['link', '0', '/contributors/ana-lima']);
    expect(stops(dom)).toBe(2);
  });
  it('strips the row again when the site script sets it later (its 1.5 s pass)', async () => {
    const dom = createDom({ pathname: '/stories', html: CARD });
    dom.run(src); await dom.tick(0);
    const row = dom.document.querySelector('.tll-lib-byline');
    row.setAttribute('role', 'link'); row.setAttribute('tabindex', '0'); dom.mutate(row);
    expect(row.getAttribute('role')).toBe(null);
    row.setAttribute('tabindex', '0'); await dom.tick(2000);
    expect(row.getAttribute('tabindex')).toBe(null);
  });
  it('leaves a row with no wired name as it is', async () => {
    const dom = createDom({ pathname: '/stories', html: '<a href="/s"><div class="tll-lib-byline" role="link" tabindex="0"><span>x</span></div></a>' });
    dom.run(src); await dom.tick(2500);
    expect(dom.document.querySelector('.tll-lib-byline').getAttribute('role')).toBe('link');
  });
});
