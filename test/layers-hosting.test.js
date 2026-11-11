// 11 Nov 2026 site layers hosting. jsDelivr refuses files at pins on the working branch (over its 50 MB package limit), so
// the layers ship from the slim layers-release branch. These tests keep every layer file independent of where it is hosted:
//   - the core's chunk loader loads chunks beside the core and exposes that folder as window.__tllLayersBase
//   - tll-phase0-v1 loads the story search index from the same release, not from a pin written in its source
//   - no built file carries a pin of this repository, so a release is always one commit
//   - tools/layers-release-carry.txt is well formed and every entry exists at its commit
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => readFileSync(join(root, ...p), 'utf8');
const LAYERS = join('src', 'site-layers');
const core = read(LAYERS, 'tll-site-layers-v16.js');
const loader = core.slice(core.indexOf('/* Chunk loader:'), core.indexOf('})();', core.indexOf('/* Chunk loader:')) + 5);

function runLoader({ src, pathname = '/stories', search = '', storage = {} }) {
  const added = [];
  const keys = Object.keys(storage);
  const win = {
    location: { pathname, search },
    localStorage: { get length() { return keys.length; }, key: (i) => keys[i] },
    console: { warn() {} },
    document: {
      currentScript: src ? { src } : null,
      querySelectorAll: () => [],
      head: { appendChild: (s) => added.push(s) },
      createElement: () => { const a = {}; return { setAttribute: (k, v) => { a[k] = v; }, attrs: a }; },
    },
  };
  win.window = win;
  vm.runInNewContext(loader, win);
  return { win, added };
}

describe('core chunk loader: hosting comes from the core URL', () => {
  it('found the loader in the built core', () => {
    expect(loader).toMatch(/^\/\* Chunk loader:/);
    expect(loader).toContain('window.__tllLayersBase=m[1]');
  });

  const PIN = 'a'.repeat(40);
  for (const base of [
    `https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@${PIN}/src/site-layers/`,
    'https://layers.example.net/16.53.2/src/site-layers/',
  ]) {
    it(`loads chunks beside the core and sets the base (${new URL(base).host})`, () => {
      const { win, added } = runLoader({ src: base + 'tll-site-layers-v16.js' });
      expect(win.__tllLayersBase).toBe(base);
      expect(added.length).toBeGreaterThan(0);
      for (const s of added) {
        expect(s.src.startsWith(base + 'chunks/')).toBe(true);
        expect(s.attrs.integrity).toMatch(/^sha384-/);
        expect(s.attrs.crossorigin).toBe('anonymous');
        expect(s.async).toBe(false);
      }
    });
  }

  it('sets no base and loads no chunk when the core is not on its URL', () => {
    const { win, added } = runLoader({ src: 'https://example.net/other.js' });
    expect(win.__tllLayersBase).toBeUndefined();
    expect(added).toEqual([]);
  });
});

describe('tll-phase0-v1: story search index from the same release', () => {
  const src = read(LAYERS, 'tll-phase0-v1.js');

  function run(base) {
    const fetch = vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve(null) }));
    const el = { style: {}, setAttribute() {}, appendChild() {} };
    const win = {
      location: { href: 'https://www.thatlayover.life/stories?q=lisbon', pathname: '/stories', search: '?q=lisbon', hostname: 'www.thatlayover.life', replace() {} },
      URL, URLSearchParams, fetch, setTimeout: () => 0, setInterval: () => 0, clearInterval() {},
      localStorage: { getItem: () => null, setItem() {} }, sessionStorage: { getItem: () => null, setItem() {} },
      document: { readyState: 'loading', addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null,
        createElement: () => ({ ...el }), head: el, body: el, documentElement: el },
      __tllLayersBase: base,
    };
    win.window = win;
    vm.runInNewContext(src, win);
    return fetch.mock.calls.map((c) => String(c[0]));
  }

  it('fetches src/data/story-search-index.json from the commit the core came from', () => {
    const pin = 'b'.repeat(40);
    const calls = run(`https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@${pin}/src/site-layers/`);
    expect(calls).toContain(`https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@${pin}/src/data/story-search-index.json`);
  });

  it('fetches no index when the core did not set a base', () => {
    expect(run(undefined).some((u) => u.includes('story-search-index'))).toBe(false);
  });
});

describe('built layers carry no pin of this repository', () => {
  const chunks = execFileSync('git', ['ls-files', join(LAYERS, 'chunks')], { cwd: root }).toString().trim().split('\n').filter(Boolean);
  for (const f of [join(LAYERS, 'tll-site-layers-v16.js'), ...chunks]) {
    it(f, () => {
      expect(read(f)).not.toMatch(/jsdelivr\.net\/gh\/carleton71192\/thatlayoverlife@/i);
    });
  }
});

describe('tools/layers-release-carry.txt', () => {
  const lines = read('tools', 'layers-release-carry.txt').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const entries = lines.map((l) => l.split(/\s+/));

  it('has one path and one full commit per line, no duplicates, no path the release builds itself', () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const e of entries) {
      expect(e.length).toBe(2);
      expect(e[1]).toMatch(/^[0-9a-f]{40}$/);
      expect(e[0]).not.toMatch(/^\/|\.\./);
      expect(e[0].startsWith('src/site-layers/')).toBe(false);
    }
    expect(new Set(entries.map((e) => e[0])).size).toBe(entries.length);
  });

  it('every entry exists at its commit and the release stays far under 50 MB', () => {
    let bytes = 0;
    try { execFileSync('git', ['cat-file', '-e', `${entries[0][1]}^{commit}`], { cwd: root }); } catch { return; } // shallow clone: skip
    for (const [path, rev] of entries) {
      const out = execFileSync('git', ['ls-tree', '-l', rev, path], { cwd: root }).toString().trim();
      expect(out, `${path} at ${rev}`).not.toBe('');
      bytes += out.split('\n').reduce((s, l) => s + (Number(l.split(/\s+/)[3]) || 0), 0);
    }
    expect(bytes).toBeLessThan(10 * 1048576);
  });
});
