// 13 Nov 2026, the story hero photo jump. The story layer (tll-mag-story-v1) reserves the hero photo's box before the photo arrives:
// the style says aspect-ratio: auto var(--tll-hero-r, 16/9), and the script sets --tll-hero-r on the img from a table of each hero's own
// size (written by src/site-layers/build-hero-ratios-v1.py into the layer and src/site-layers/story-hero-sizes-v1.json). "auto" first
// means the photo's own ratio wins once the browser knows it, so the finished page is unchanged. The layout itself is checked in a real
// browser (scratchpad nov13/next/story-hero); here: the rule, the table, the lookup, and the built core.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const mag = read('src', 'design', 'magazine-2026-10', 'story-build', 'tll-mag-story-v1.html');
const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
const sizes = JSON.parse(read('src', 'site-layers', 'story-hero-sizes-v1.json'));
const css = /<style id="tll-mag-story-v1">\n([\s\S]*?)<\/style>/.exec(mag)[1];
const js = /<script id="tll-mag-story-js-v1">\n([\s\S]*?)<\/script>/.exec(mag)[1];
const table = /\/\*HERO\*\/var HR=(\{[^}]*\});/.exec(js)[1];
const HR = JSON.parse(table);
// the two functions the reserve needs, run on their own
const heroR = new Function('HR', /function heroR\(img\)\{[\s\S]*?\n  if\(r&&[^\n]*\}/.exec(js)[0] + '\nreturn heroR;')(HR);
const CMS = 'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/';
function img(src) {
  const props = {};
  return { props, getAttribute: (k) => (k === 'src' ? src : null), style: { setProperty: (k, v) => { props[k] = v; } } };
}

describe('story hero box: the style', () => {
  it('reserves the box from --tll-hero-r with 16/9 as the default, and keeps the photo\'s own ratio first', () => {
    const rule = /\.tll-story-hero-img\{[^}]*\}/.exec(css)[0];
    expect(rule).toContain('aspect-ratio:auto var(--tll-hero-r,16/9)');
    expect(rule).not.toMatch(/aspect-ratio:auto;/);
    // the finished look is unchanged: same width, height, max-height and fit as before
    for (const d of ['width:100% !important', 'height:auto !important', 'max-height:85vh', 'object-fit:cover !important']) expect(rule).toContain(d);
  });
  it('16/9 is the most common hero shape in the table', () => {
    const n = Object.values(sizes).filter(([w, h]) => Math.abs(w / h - 16 / 9) < 0.01).length;
    expect(n / Object.keys(sizes).length).toBeGreaterThan(0.6);
  });
});

describe('story hero box: the table', () => {
  it('has one entry per hero in the sizes file, keyed by the last 8 hex digits of the first CMS file id', () => {
    expect(Object.keys(HR).length).toBe(Object.keys(sizes).length);
    for (const [id, [w, h]] of Object.entries(sizes)) expect(HR[id.slice(-8)]).toBe(`${w}/${h}`);
  });
  it('holds the measured sizes of the three checked stories, portrait included', () => {
    expect(sizes['6ad72dc3c7e76f61648a3c30']).toEqual([1440, 1920]); // Spain, portrait
    expect(sizes['6ac86ab8eaf54b2878f9344b']).toEqual([2400, 1350]); // Pantanal, 16:9
    expect(sizes['6aba3d42f18f65b8d06aea74']).toEqual([2400, 1350]); // Sort sol, 16:9
  });
});

describe('story hero box: the lookup', () => {
  it('sets --tll-hero-r on a known hero', () => {
    const i = img(CMS + '6ad72dc3c7e76f61648a3c30_6ad72d77eeadeeb5b887095e_spain-hero.jpeg');
    heroR(i);
    expect(i.props).toEqual({ '--tll-hero-r': '1440/1920' });
  });
  it('reads the first id when a CMS file carries several', () => {
    const i = img(CMS + '6ac86ab8eaf54b2878f9344b_6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river.jpeg');
    heroR(i);
    expect(i.props['--tll-hero-r']).toBe('2400/1350');
  });
  it('leaves an unknown hero, a site-bucket photo and a missing src to the 16/9 default', () => {
    for (const u of [CMS + '6aaaaaaaaaaaaaaaaaaaaaaa_new-story-hero.jpeg',
      'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6ac86a1e460d26e52c3f8d09_pantanal-hero-p-1080.jpg', null]) {
      const i = img(u); heroR(i); expect(i.props).toEqual({});
    }
  });
});

describe('story hero box: the built core', () => {
  it('carries the rule, the table and the call, and runs the lookup before the figure is built', () => {
    expect(core).toContain('aspect-ratio:auto var(--tll-hero-r,16/9)');
    expect(core).toContain('/*HERO*/var HR=' + table + ';');
    const at = core.indexOf('if(img)heroR(img);');
    expect(at).toBeGreaterThan(0);
    expect(core.indexOf("fig.className='tll-mg-fig'", at)).toBeGreaterThan(at);
  });
  it('touches no data-ms-* element and no other attribute of the photo', () => {
    expect(js).not.toMatch(/heroR[\s\S]{0,400}(setAttribute|removeAttribute|data-ms)/);
  });
});
