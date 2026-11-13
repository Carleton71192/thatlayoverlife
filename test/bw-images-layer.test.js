// Bandwidth fixes 2, 3 and 7 (13 Nov 2026, reports/bandwidth-2026-11-13.md). The browser side (which file a 3x phone picks, that the hidden
// rail photos never load, the no-script fallback of the home hero) was measured from cached files in a real browser
// (reports/evidence/bw-images-2026-11-13); here: the sizes lists cap() writes, the rail hold and the Paw Passport style as built.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = (...p) => readFileSync(join(root, ...p), 'utf8');
const src = read('src', 'site-layers', 'tll-img-variants-v1.js');
const V = (() => { const window = {}; const document = { readyState: 'complete', images: [], addEventListener() {}, documentElement: {} };
  new Function('window', 'document', src)(window, document); return window.__tllImgV; })();
const PH3 = '(max-width:767px) and (min-resolution:2.5dppx)';

// which source size a list gives for a viewport width and density (media conditions of the forms the layers write)
function pick(list, vw, dppx) {
  const ok = c => c.split(/\s+and\s+/).every(t => { const m = /\((min|max)-(width|resolution):\s*([\d.]+)(px|dppx)\)/.exec(t.trim()); if (!m) throw new Error('cond ' + t);
    const v = m[2] === 'width' ? vw : dppx; return m[1] === 'min' ? v >= +m[3] : v <= +m[3]; });
  const len = l => { const e = l.replace(/calc/g, '').replace(/(\d+(?:\.\d+)?)vw/g, (_, n) => `(${n}*${vw / 100})`).replace(/px/g, ''); return Function(`return ${e}`)(); };
  for (const part of list.split(/,(?![^(]*\))/)) { const m = /^(.*?)\s*((?:calc)\(.*\)|[\d.]+(?:px|vw))$/.exec(part.trim()); if (!m[1] || ok(m[1])) return len(m[2]); }
  throw new Error('no default');
}
// the file a browser takes from the five variants for a box (smallest whose density covers the screen's)
const file = (cssPx, dppx) => [500, 800, 1080, 1600, 2000].find(w => w / cssPx >= dppx) || 2000;

describe('bandwidth fix 2: card and cover photos at 2x on phones (cap)', () => {
  it('puts phone-at-3x entries in front and keeps the original list after them', () => {
    expect(V.cap('(min-width:991px) 300px, calc(100vw - 32px)')).toBe(`${PH3} calc((100vw - 32px) * 2 / 3), (min-width:991px) 300px, calc(100vw - 32px)`);
    expect(V.cap('100vw')).toBe(`${PH3} calc(100vw * 2 / 3), 100vw`);
    expect(V.cap('(min-width:991px) 26vw, 80vw')).toBe(`${PH3} calc(80vw * 2 / 3), (min-width:991px) 26vw, 80vw`);
  });
  it('a 343px card on a 3x phone takes the 800px file (was 1080); 1x and 2x phones, tablets and desktops pick as before', () => {
    const before = '(min-width:991px) 300px, calc(100vw - 32px)', after = V.cap(before);
    expect(file(pick(before, 375, 3), 3)).toBe(1080);
    expect(file(pick(after, 375, 3), 3)).toBe(800);
    for (const [vw, d] of [[390, 1], [390, 2], [414, 2], [768, 3], [1440, 1], [1440, 2]]) expect(pick(after, vw, d)).toBe(pick(before, vw, d));
  });
  it('the home cover on a 3x phone takes the 800px file (was 1600) and stays as it was elsewhere', () => {
    expect(file(pick('100vw', 390, 3), 3)).toBe(1600);
    expect(file(pick(V.cap('100vw'), 390, 3), 3)).toBe(800);
    expect(pick(V.cap('100vw'), 390, 2)).toBe(390);
    expect(pick(V.cap('100vw'), 1440, 1)).toBe(1440);
  });
  it('leaves fixed sizes readable, skips desktop-only entries and does not cap twice', () => {
    expect(V.cap('(min-width:1440px) 220px, (min-width:991px) 15vw, 44vw')).toBe(`${PH3} calc(44vw * 2 / 3), (min-width:1440px) 220px, (min-width:991px) 15vw, 44vw`);
    expect(V.cap('(min-width:600px) 33vw, 300px')).toBe(`${PH3} and (min-width:600px) calc(33vw * 2 / 3), ${PH3} 200px, (min-width:600px) 33vw, 300px`);
    const once = V.cap('100vw'); expect(V.cap(once)).toBe(once);
    for (const s of ['', null, 'auto', '(min-width:1px) or (max-width:2px) 10vw, 100vw']) expect(V.cap(s)).toBe(s);
  });
  it('only card photos and the cover go through cap; story heroes, inline and gallery photos and bands do not', () => {
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).toMatch(/var CARD=\{'tll-lib-img':1,'tll-related-img':1,'h3-card-ph':1,'h3-pc':1\};/);
    expect(code).toMatch(/return cap\(LEAD\)/);
    expect(code).toMatch(/return cap\('\(min-width:991px\) 300px, calc\(100vw - 32px\)'\)/);
    expect(code).not.toMatch(/cap\(INLINE\)/);
    expect(read('src', 'site-layers', 'tll-home-bands-v1.js')).toMatch(/V\.apply\(i,'100vw',p\.src\)/);
    expect(V.cap).toBeTypeOf('function');
  });
});

describe('bandwidth fix 3: home rail photos wait on phones (tll-rail-hold-v1)', () => {
  const hold = read('src', 'site-layers', 'tll-rail-hold-v1.js');
  const code = hold.replace(/\/\*[\s\S]*?\*\//g, '');
  it('runs on the home page under 900px only, and hides only the rail card photos', () => {
    expect(code).toMatch(/\^\\\/\(index\\\.html\)\?\$/);
    expect(code).toMatch(/matchMedia\('\(max-width:899px\)'\)/);
    expect(code).toMatch(/'\[data-h3-shelf\] \[data-h3-track\] \.h3-card-ph img\{display:none!important\}'/);
  });
  it('lets go on the second draw of the rail or when the rail is within 1250px of the screen', () => {
    expect(code).toMatch(/addEventListener\('h3:stories',drawn\)/);
    expect(code).toMatch(/\+\+draws>=2/);
    expect(code).toMatch(/rootMargin:'1250px 0px 1250px 0px'/);
  });
  it('never touches src, srcset, alt or data-ms-* elements', () => {
    expect(code).not.toMatch(/\.src\s*=|setAttribute\('src'|srcset|\.alt\s*=|data-ms-/);
  });
  it('is in the core, after img-variants, and in the built core', () => {
    const build = read('src', 'site-layers', 'build-site-layers-v16.py');
    expect(build).toMatch(/'tll-home-bands-v1', 'tll-rail-hold-v1',/);
    const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
    expect(core.indexOf('/* src/site-layers/tll-rail-hold-v1.js */')).toBeGreaterThan(core.indexOf('/* src/site-layers/tll-img-variants-v1.js */'));
  });
});

describe('bandwidth fix 7: Paw Passport hero copies (tll-paw-hero-img-v1)', () => {
  const css = read('src', 'site-layers', 'tll-paw-hero-img-v1.html');
  const base = 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6a0e02265e2392e5fc632431_Montenegro%20coast';
  it('phones take the 1080px copy and 768px and up the 1600px copy, never the original', () => {
    expect(css).toContain(`body .tll-paw-hero{background-image:url("${base}-p-1080.jpg")}`);
    expect(css).toContain(`@media (min-width:768px){body .tll-paw-hero{background-image:url("${base}-p-1600.jpg")}}`);
    expect(css.replace(/\/\*[\s\S]*?\*\//g, '')).not.toContain(`${base}.jpg`);
  });
  it('goes into the core styles, so it is in place before the page is parsed', () => {
    const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
    expect(core).toContain('tll-paw-hero-img-v1');
    expect(core).toContain('Montenegro%20coast-p-1600.jpg');
  });
});

describe('house rules for the new files', () => {
  it('no em dashes and no exclamation marks in prose', () => {
    for (const f of [['src', 'site-layers', 'tll-rail-hold-v1.js'], ['src', 'site-layers', 'tll-paw-hero-img-v1.html']]) {
      const s = read(...f); expect(s).not.toMatch(/\u2014/);
      const prose = (s.match(/\/\*[\s\S]*?\*\//g) || []).join('\n'); expect(prose).not.toMatch(/!(?!important)/);
    }
  });
});
