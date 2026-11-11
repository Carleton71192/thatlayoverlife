// 11 Nov 2026 layout findings, two CSS rules that live in the site layers. Both are read from the sources and from the built files,
// so a rebuild that drops either one fails here.
//   tll-story-is-v1   the "What a story looks like here" list on /submit: list items wrap with text-wrap:pretty, so the last line
//                     of an item is not a single word at 768 to 1440.
//   tll-mag-cover-v1  home hero, before the cover script has filled it: the deck is two lines from 371px up, so the room held in
//                     advance is two lines there and three only below that (it was three everywhere, a 28px jump on a first paint).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const count = (s, part) => s.split(part).length - 1;

describe('tll-story-is-v1 list items', () => {
  const RULE = '.tll-si li{text-wrap:pretty}';
  it('the style string carries the rule once', () => {
    expect(count(read('src', 'site-layers', 'tll-story-is-v1.js'), RULE)).toBe(1);
  });
  it('every built chunk that carries the layer carries the rule', () => {
    for (const c of ['submit', 'submit-preview', 'stories', 'story', 'story-preview']) {
      expect(count(read('src', 'site-layers', 'chunks', `${c}.js`), RULE), c).toBe(1);
    }
  });
});

describe('tll-mag-cover-v1 room held for the hero deck before the cover fills it', () => {
  const SEL = 'html body:not(.tll-none) [data-h3-hero]:not([data-tll-cover]) h1:not(.tll-story-title) + p';
  const THREE = `${SEL}{min-height:calc(3 * 1.45em)}`;
  const TWO = `@media(min-width:371px){${SEL}{min-height:calc(2 * 1.45em)}}`;
  const DIR = ['src', 'design', 'magazine-2026-10', 'cover-build'];
  for (const f of ['cover.template.html', 'tll-mag-cover-v1.html']) {
    it(`${f}: three lines by default, two from 371px up, in that order`, () => {
      const s = read(...DIR, f);
      expect([count(s, THREE), count(s, TWO)]).toEqual([1, 1]);
      expect(s.indexOf(TWO)).toBeGreaterThan(s.indexOf(THREE));
    });
  }
  const PROMISE = 'html body:not(.tll-none) [data-h3-hero]:not([data-tll-cover]) p[data-tll-hero-promise]{margin-top:8px !important}';
  for (const f of ['cover.template.html', 'tll-mag-cover-v1.html']) {
    it(`${f}: the promise line keeps the same 8px top margin before the fill as after it`, () => {
      expect(count(read(...DIR, f), PROMISE)).toBe(1);
    });
  }
  it('the generated cover is the template with only its data filled in around the rules', () => {
    const tpl = read(...DIR, 'cover.template.html'); const out = read(...DIR, 'tll-mag-cover-v1.html');
    const css = (s) => /<style id="tll-mag-cover-v1">\n([\s\S]*?)<\/style>/.exec(s)[1];
    expect(css(out)).toBe(css(tpl));
  });
  it('the built core carries both rules inside the cover style', () => {
    const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
    expect([count(core, THREE), count(core, TWO)]).toEqual([1, 1]);
    expect(core.indexOf(TWO)).toBeGreaterThan(core.indexOf(THREE));
  });
});
