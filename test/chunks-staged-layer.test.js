// Sweep of 21 Nov 2026, items A18 and A19: staged code leaves the public chunks. tll-series-v1 (ROUTES_LIVE=false) and tll-pros-v1
// (ROUTE_LIVE=false) exit at once without ?preview=wire, so they ride only in the -preview variants now; the countries chunk keeps no
// public layer, and the core loader skips a chunk with no public file unless a preview flag is set. The chunk loader is run here
// from the built core against a stand-in document, to see which chunk files a page asks for.
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const chunk = (n) => read('src', 'site-layers', 'chunks', `${n}.js`);
const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
const loader = /\/\* Chunk loader:[\s\S]*?\*\/\n(\(function\(\)\{[\s\S]*?\n\}\)\(\);)\n/.exec(core)[1];

function load(pathname, { search = '', keys = [] } = {}) {
  const added = [];
  const document = {
    currentScript: { src: 'https://cdn.jsdelivr.net/gh/x/y@abc/src/site-layers/tll-site-layers-v16.js' },
    createElement: () => ({ setAttribute() {} }),
    head: { appendChild: (s) => added.push(s.src.replace(/^.*\/chunks\//, '')) },
  };
  const localStorage = { length: keys.length, key: (i) => keys[i] };
  new Function('document', 'location', 'localStorage', 'console', loader)(document, { pathname, search }, localStorage, console);
  return added;
}

describe('A18 tll-series-v1 and tll-pros-v1 ride only in preview chunks', () => {
  it('no public chunk carries them; their preview variants do', () => {
    for (const n of ['stories', 'story', 'for-expats', 'pursuits', 'pets', 'profile']) {
      expect(chunk(n), n).not.toContain('/* src/site-layers/tll-series-v1.js */');
      expect(chunk(n), n).not.toContain('/* src/site-layers/tll-pros-v1.js */');
    }
    for (const n of ['stories', 'story', 'for-expats', 'pursuits', 'pets', 'countries']) expect(chunk(`${n}-preview`), n).toContain('/* src/site-layers/tll-series-v1.js */');
    for (const n of ['story', 'profile', 'pursuits']) expect(chunk(`${n}-preview`), n).toContain('/* src/site-layers/tll-pros-v1.js */');
  });
  it('the countries chunk has no public file; the loader skips it unless a preview flag is set', () => {
    expect(existsSync(join(here, '..', 'src', 'site-layers', 'chunks', 'countries.js'))).toBe(false);
    expect(load('/countries/denmark')).toEqual(['site.js']);
    expect(load('/countries/denmark', { search: '?preview=wire' })).toEqual(['site-preview.js', 'countries-preview.js']);
    expect(load('/countries/denmark', { keys: ['tll-preview-album'] })).toEqual(['site-preview.js', 'countries-preview.js']);
  });
  it('pages with a public chunk still get it, and the preview variant under a flag', () => {
    expect(load('/stories/some-trip')).toEqual(['site.js', 'story.js']);
    expect(load('/stories/some-trip', { search: '?preview=wire' })).toEqual(['site-preview.js', 'story-preview.js']);
    expect(load('/stories')).toEqual(['site.js', 'stories.js']);
  });
});

describe('A19 tll-open-slots-v1 (draft /spotlight only) is staged; tll-home-value-v1 no longer says STAGED', () => {
  it('the public misc chunk drops open-slots, the preview keeps it', () => {
    expect(chunk('misc')).not.toContain('/* src/site-layers/tll-open-slots-v1.js */');
    expect(chunk('misc')).toContain('/* src/site-layers/tll-lounge-members-v1.js */');
    expect(chunk('misc-preview')).toContain('/* src/site-layers/tll-open-slots-v1.js */');
  });
  it('the home value header matches its PUBLIC=true', () => {
    const s = read('src', 'site-layers', 'tll-home-value-v1.js');
    expect(s).toContain('var PUBLIC=true;');
    expect(s.split('*/')[0]).not.toMatch(/STAGED: renders only/);
  });
});

// Check of the sweep, note 2: the A08 card's words ("Back to your story / pets / photos") wait for Nancy (class-c C14), so
// tll-gate-return-v1 rides only in the site-preview chunk until she answers. The code and its tests stay as they are.
describe('A08 tll-gate-return-v1 is staged until C14 is answered', () => {
  it('the public site chunk does not carry it; site-preview does, with every public site layer', () => {
    expect(chunk('site')).not.toContain('/* src/site-layers/tll-gate-return-v1.js */');
    expect(chunk('site')).not.toContain('tll-gate-return');
    expect(chunk('site-preview')).toContain('/* src/site-layers/tll-gate-return-v1.js */');
    const layers = (c) => c.match(/^\/\* src\/site-layers\/[\w-]+\.js \*\/$/gm);
    expect(layers(chunk('site-preview')).filter((l) => !l.includes('tll-gate-return-v1'))).toEqual(layers(chunk('site')));
  });
  it('a page without a flag gets site.js; a preview flag or a tll-preview-* key gets site-preview.js', () => {
    for (const p of ['/', '/account', '/submit', '/my-pets', '/share-photos', '/about']) {
      expect(load(p)[0], p).toBe('site.js');
      expect(load(p, { search: '?preview=gate' })[0], p).toBe('site-preview.js');
      expect(load(p, { keys: ['tll-preview-gate'] })[0], p).toBe('site-preview.js');
    }
  });
  it('the build lists it as staged and says why', () => {
    const b = read('src', 'site-layers', 'build-site-layers-v16.py');
    expect(b).toContain("'tll-note-footer-v1', 'tll-p0-closeout-v1'], ['tll-gate-return-v1']),");
    expect(b).toMatch(/tll-gate-return-v1\.js', '[^']*staged \(site-preview\) until Nancy OKs the words, class-c C14'/);
  });
});
