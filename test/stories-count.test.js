// The /stories headline count layer (src/site-layers/tll-stories-count-v1.js) is an IIFE for the browser; its number-to-words rule
// (words up to twenty, digits above) is read out of the source and checked here, so the house rule stays true across edits.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'site-layers', 'tll-stories-count-v1.js'), 'utf8');
const W = /var W=(\[[^\]]+\]);/.exec(src)[1];
const F = /function word\(n\)\{[^\n]*?\}(?=\n)/.exec(src)[0];
const word = new Function('var W=' + W + ';' + F + ';return word;')();

describe('/stories headline count words', () => {
  it('spells zero to twenty', () => {
    expect(word(0)).toBe('Zero');
    expect(word(1)).toBe('One');
    expect(word(6)).toBe('Six');
    expect(word(13)).toBe('Thirteen');
    expect(word(20)).toBe('Twenty');
  });
  it('uses digits above twenty', () => {
    expect(word(21)).toBe('21');
    expect(word(57)).toBe('57');
    expect(word(120)).toBe('120');
  });
  it('never returns a fraction or a negative', () => {
    expect(word(57.9)).toBe('57');
    expect(word(-3)).toBe('Zero');
    expect(word('abc')).toBe('Zero');
  });
  it('the layer only runs on /stories and reads tllCounts.s first', () => {
    expect(src).toContain("/^\\/stories\\/?$/.test(location.pathname)");
    expect(src).toContain('window.tllCounts');
    expect(src).toContain("addEventListener('tll:counts'");
    // 11 Nov 2026: the Designer H1 holds no typed number; the layer puts the count in front of "Stories, all worth the detour."
    expect(src).toContain('/^(\\s*)Stories\\b/');
    expect(src).not.toMatch(/Six stories/);
  });
});
