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

// Check of the sweep, note 2 (class-c C13): the fallback above is public but its words wait for Nancy; it must only show when the page
// note is missing. Run with the saved live /stories page code (search v4 writes the note, the Stories 3.0 companion rewrites it with
// data-s3): the page note wins whether the page code runs before the layer or after the fallback was already written.
describe('tll-story-is-v1 search note: the live page note wins (C13)', () => {
  const foot = readFileSync(join(here, '..', 'src', 'pages', 'live-2026-11-21', 'stories', 'page-footer.html'), 'utf8');
  const v4 = /<script id="tll-lib-search-v4">\n([\s\S]*?)<\/script>/.exec(foot)[1];
  const s3 = /<script id="tll-s3-stories-js-v1">\n([\s\S]*?)<\/script>/.exec(foot)[1];
  const PAGE_NOTE = 'No stories match “zzqx” yet. Share your story →Clear the search';
  function stories() { const dom = createDom({ pathname: '/stories', html: cards(57) }); dom.window.location.search = '?q=zzqx'; return dom; }
  it('page code first (as on the live page): the layer stands aside', async () => {
    const dom = stories();
    dom.run(v4); dom.run(s3); dom.run(src); await dom.tick(5000);
    const n = dom.document.getElementById('tll-q-note');
    expect(n.textContent).toBe(PAGE_NOTE);
    expect([n.getAttribute('data-s3'), n.getAttribute('data-tll-si')]).toEqual(['1', null]);
  });
  it('the companion late, after the fallback was written: the page note still replaces it and the layer does not come back', async () => {
    const dom = stories();
    dom.run(v4); dom.run(src); await dom.tick(1000);
    expect(dom.document.getElementById('tll-q-note').textContent.startsWith('No story matches “zzqx” yet, so here are all 57.')).toBe(true);
    dom.run(s3); await dom.tick(5000);
    expect(dom.document.getElementById('tll-q-note').textContent).toBe(PAGE_NOTE);
  });
});
