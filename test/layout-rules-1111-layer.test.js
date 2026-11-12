// 11 Nov 2026 layout findings, two CSS rules that live in the site layers. Both are read from the sources and from the built files,
// so a rebuild that drops either one fails here.
//   tll-story-is-v1   the "What a story looks like here" list on /submit: list items wrap with text-wrap:pretty, so the last line
//                     of an item is not a single word at 768 to 1440.
//   tll-mag-cover-v1  home hero (rewritten 12 Nov 2026 for option A): one paragraph under the headline, room held for it in
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

describe('tll-mag-cover-v1 one paragraph under the headline, room held before the cover fills it', () => {
  // 12 Nov 2026 (Nancy, option A): the promise line is the one paragraph and ends "Free to join."; the subhead is hidden from the first
  // paint; the room held before the fill belongs to the promise line (three lines, four below 390px). Replaces the 11 Nov deck rules.
  const W = 'html body:not(.tll-none) [data-h3-hero]';
  const HIDE = `${W} > div:has(> h1):has(> p[data-tll-hero-promise]) > p:not([data-tll-hero-promise]){display:none !important}`;
  const THREE = `${W}:not([data-tll-cover]) p[data-tll-hero-promise]{min-height:calc(3 * 1.45em)}`;
  const FOUR = `@media(max-width:389px){${W}:not([data-tll-cover]) p[data-tll-hero-promise]{min-height:calc(4 * 1.45em)}}`;
  const RING = `${W} > div:has(> h1)[tabindex="-1"]:is(:focus,:focus-visible){outline:none !important;box-shadow:none !important}`;
  const OLD_DECK = `${W}:not([data-tll-cover]) h1:not(.tll-story-title) + p{min-height`;
  const DIR = ['src', 'design', 'magazine-2026-10', 'cover-build'];
  for (const f of ['cover.template.html', 'tll-mag-cover-v1.html']) {
    it(`${f}: the subhead is hidden, the promise line holds three lines (four below 390px), no deck room is left`, () => {
      const s = read(...DIR, f);
      expect([count(s, HIDE), count(s, THREE), count(s, FOUR)]).toEqual([1, 1, 1]);
      expect(s.indexOf(FOUR)).toBeGreaterThan(s.indexOf(THREE));
      expect(count(s, OLD_DECK)).toBe(0);
    });
    it(`${f}: the skip target shows no focus frame`, () => {
      expect(count(read(...DIR, f), RING)).toBe(1);
    });
    it(`${f}: the script ends the promise line with "Free to join." and no longer writes the deck`, () => {
      const s = read(...DIR, f);
      expect(count(s, "var FREE='Free to join.'")).toBe(1);
      expect(count(s, 'dek.textContent=COVER.dek')).toBe(0);
    });
  }
  it('the generated cover is the template with only its data filled in around the rules', () => {
    const tpl = read(...DIR, 'cover.template.html'); const out = read(...DIR, 'tll-mag-cover-v1.html');
    const css = (s) => /<style id="tll-mag-cover-v1">\n([\s\S]*?)<\/style>/.exec(s)[1];
    expect(css(out)).toBe(css(tpl));
  });
  it('the built core carries the rules inside the cover style', () => {
    const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
    // the core holds the cover CSS inside a JS string, where double quotes are escaped
    expect([count(core, HIDE), count(core, THREE), count(core, FOUR), count(core, RING.replace(/"/g, '\\"'))]).toEqual([1, 1, 1, 1]);
  });
});
