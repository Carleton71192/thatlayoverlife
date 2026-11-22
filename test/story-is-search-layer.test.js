// tll-story-is-v1 search() (the /stories chunk; sweep of 21 Nov, item A01). It used to overwrite the /stories page note with a
// banned verb and "Yours could be the first" above every story, and its "See all stories" link took the href of the page note's
// first link (/submit). Now it stands aside when the page code has written its note (data-s3); otherwise it writes a note with
// the count taken from the cards, a Share your story link to /submit and See all stories to /stories.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from './mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'site-layers', 'tll-story-is-v1.js'), 'utf8');
const cards = (k) => '<div class="tll-lib-grid">' + Array.from({ length: k }, () => '<div><a data-tll-card href="/stories/x">x</a></div>').join('') + '</div>';

async function page(note, k = 3) {
  const dom = createDom({ pathname: '/stories', html: note + cards(k) });
  dom.run(src); await dom.tick(5000); return dom;
}

describe('tll-story-is-v1 search note (A01)', () => {
  it('leaves the page code note alone (data-s3)', async () => {
    const s3 = '<p id="tll-q-note" data-s3="1">No stories match “<span class="s3-q-term">zzqx</span>” yet. <span class="s3-q-actions"><a class="s3-q-share" href="/submit">Share your story →</a><a class="s3-q-clear" href="/stories">Clear the search</a></span></p>';
    const dom = await page(s3);
    const n = dom.document.getElementById('tll-q-note');
    expect(n.textContent).toBe('No stories match “zzqx” yet. Share your story →Clear the search');
    expect(n.getAttribute('data-tll-si')).toBe(null);
  });
  it('otherwise writes the note with the count from the cards and both links', async () => {
    const dom = await page('<p id="tll-q-note">Old note “<span>zzqx</span>” yet. <a href="/submit">Share your story →</a></p>', 57);
    const n = dom.document.getElementById('tll-q-note');
    expect(n.textContent).toBe('No story matches “zzqx” yet, so here are all 57. Every story here is one trip, told by someone who went. Share your story · See all stories');
    expect([...n.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(['/submit', '/stories']);
  });
  it('carries no banned verb and no "first" claim', async () => {
    const dom = await page('<p id="tll-q-note">“<span>q</span>”</p>');
    const t = dom.document.getElementById('tll-q-note').textContent;
    expect(/f[i]led|could be the first/i.test(t)).toBe(false);
    expect(/f[i]led/i.test(src)).toBe(false);
  });
  it('without cards it leaves the count out', async () => {
    const dom = await page('<p id="tll-q-note">“<span>q</span>”</p>', 0);
    expect(dom.document.getElementById('tll-q-note').textContent.startsWith('No story matches “q” yet. Every')).toBe(true);
  });
});
