// tll-img-variants-v1 (core) is a browser script, so this test reads its source and runs the pure part, the URL mapping from a CMS file
// to its site-bucket twin's Webflow variants (10 Nov 2026, week one item 4), with a stub window and document. The DOM side (MutationObserver,
// sizes, the error fallback) is checked in a real browser; here: which URLs a photo gets, which it never gets, and the house rules.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const src = readFileSync(join(root, 'src', 'site-layers', 'tll-img-variants-v1.js'), 'utf8');

function load() {
  const window = {};
  const document = { readyState: 'complete', images: [], addEventListener() {}, documentElement: {} };
  new Function('window', 'document', src)(window, document);
  return window.__tllImgV;
}
const V = load();
const CMS = 'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/';
const SITE = 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/';
const table = /\/\*TABLE\*\/var T=(\{[^}]*\});/.exec(src)[1];
const T = new Function(`return ${table}`)();
const inGroup = (n, id) => { const s = T[n]; for (let i = 0; i < s.length; i += 6) if (s.substr(i, 6) === id.slice(-6)) return true; return false; };

describe('tll-img-variants-v1 twin mapping', () => {
  it('maps a CMS file to its site-bucket twin and lists the five variants, smallest first', () => {
    // sortsol: all five built (the 1 Nov page-heroes manifest marked it as having none)
    const u = CMS + '6aba3d42f18f65b8d06aea74_6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars.jpeg';
    const ss = V.srcset(u).split(', ');
    expect(ss).toEqual([500, 800, 1080, 1600, 2000].map(w => `${SITE}6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars-p-${w}.jpg ${w}w`));
  });
  it('reads %2520 in a CMS name as %20 in the twin name, and always asks for .jpg', () => {
    const u = CMS + '6a0e027dbb2d090c01c473b4_6a0e02265e2392e5fc632431_Montenegro%2520coast.jpeg';
    expect(V.srcset(u)).toContain(SITE + '6a0e02265e2392e5fc632431_Montenegro%20coast-p-500.jpg 500w');
    expect(V.srcset(u)).not.toMatch(/%2520|-p-\d+\.jpeg/);
  });
  it('takes the last id before the name when a CMS file carries several', () => {
    const u = CMS + '6ab3e955d6c1557046f9b5bf_6ab3d8af55edd2a3b59022be_6ab3d831e2239c9ec7f89cde_antarctica-fur-seal-below-the-glacier.jpeg';
    expect(V.twin(u).base).toBe(SITE + '6ab3d831e2239c9ec7f89cde_antarctica-fur-seal-below-the-glacier');
  });
  it('stops at the widths the table lists and adds the original as the next size up', () => {
    // mexico hero: 500 and 800 only, so the original stands in at 1080w
    const u = CMS + '6accbeceb55fa97ba3b92de4_6accbe52f0ddedac9e55b651_mexico-hero-teotihuacan-pyramid-of-the-moon.jpeg';
    expect(inGroup(2, '6accbe52f0ddedac9e55b651')).toBe(true);
    expect(V.srcset(u).split(', ')).toEqual([
      `${SITE}6accbe52f0ddedac9e55b651_mexico-hero-teotihuacan-pyramid-of-the-moon-p-500.jpg 500w`,
      `${SITE}6accbe52f0ddedac9e55b651_mexico-hero-teotihuacan-pyramid-of-the-moon-p-800.jpg 800w`,
      `${u} 1080w`]);
  });
  it('leaves the files without variants and without a twin on their originals', () => {
    for (const f of ['6ad72dc3c7e76f61648a3c30_6ad72d77eeadeeb5b887095e_chesney-lish-spain-hero.jpeg',
      '6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg',
      '6ad72dc2c7c33fe2b4d53be9_6ad72d778e0db3aa7718c140_barzy-adam-avatar.jpeg',
      '6ae323584689182a2265ccbc_17932678182301.jpeg', '6ae323f4b56dc5d88cc6e62e_uwjpidtfgp3gwxuzeefz.jpeg']) {
      expect(V.srcset(CMS + f)).toBe('');
      expect(V.pick(CMS + f, 500)).toBe(CMS + f);
    }
  });
  it('handles site-bucket photos only when the table knows them, and never a variant URL', () => {
    expect(V.srcset(SITE + '6ac9f3a6135a91817959e01a_magnus-holi-side.jpg')).toContain('magnus-holi-side-p-1080.jpg 1080w');
    expect(V.srcset(SITE + '6aaaaaaaaaaaaaaaaaaaaaaa_unknown-file.jpg')).toBe('');
    expect(V.srcset(SITE + '6ac9f3a6135a91817959e01a_magnus-holi-side-p-500.jpg')).toBe('');
  });
  it('a CMS file not in the table is taken to have all five (a miss drops back to the original in the browser)', () => {
    const ss = V.srcset(CMS + 'aaaaaaaaaaaaaaaaaaaaaaaa_bbbbbbbbbbbbbbbbbbbbbbbb_new-upload.jpeg');
    expect(ss.split(', ')).toHaveLength(5);
  });
  it('passes other hosts and file types through untouched', () => {
    for (const u of ['https://res.cloudinary.com/x/image/upload/a.jpg', CMS + 'aaaaaaaaaaaaaaaaaaaaaaaa_bbbbbbbbbbbbbbbbbbbbbbbb_logo.svg',
      CMS + 'aaaaaaaaaaaaaaaaaaaaaaaa_bbbbbbbbbbbbbbbbbbbbbbbb_a.jpeg?x=1', '', null]) expect(V.srcset(u)).toBe('');
  });
  it('pick gives the smallest variant that covers the box, else the original when it is larger than every variant', () => {
    const u = CMS + '6aba20632eb7673deeca212a_6aba2059525e130282e72224_nancy-carleton-avatar.jpeg';
    expect(V.pick(u, 120)).toBe(SITE + '6aba2059525e130282e72224_nancy-carleton-avatar-p-500.jpg');
    expect(V.pick(u, 700)).toBe(u);
    const j = CMS + '6ac86ab8eaf54b2878f9344b_6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river.jpeg';
    expect(V.pick(j, 900)).toBe(SITE + '6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river-p-1080.jpg');
    expect(V.pick(j, 4000)).toBe(SITE + '6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river-p-2000.jpg');
  });
  it('the table keys are six hex digits, unique across the groups', () => {
    const all = Object.values(T).join('');
    expect(all).toMatch(/^[0-9a-f]*$/);
    expect(all.length % 6).toBe(0);
    const keys = all.match(/.{6}/g) || [];
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('tll-img-variants-v1 source and its callers (house rules)', () => {
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
  it('never writes alt, never touches data-ms-* elements, never uses Cloudinary', () => {
    expect(code).not.toMatch(/\.alt\s*=|setAttribute\('alt'/);
    expect(src).toMatch(/data-ms-/);
    expect(code).not.toMatch(/cloudinary/i);
  });
  it('adds no host besides the Webflow CDN', () => {
    const hosts = new Set((code.replace(/\\/g, '').match(/https?:\/\/[a-z0-9.-]+/gi) || []));
    expect([...hosts]).toEqual(['https://cdn.prod.website-files.com']);
  });
  it('makes the story hero eager with high fetch priority', () => {
    expect(code).toMatch(/tll-story-hero-img/);
    expect(code).toMatch(/setAttribute\('loading','eager'\)/);
    expect(code).toMatch(/setAttribute\('fetchpriority','high'\)/);
  });
  it('the cover and the home bands no longer strip the srcset without a replacement, page heroes carry no nov flags', () => {
    const cover = readFileSync(join(root, 'src', 'design', 'magazine-2026-10', 'cover-build', 'tll-mag-cover-v1.html'), 'utf8');
    const bands = readFileSync(join(root, 'src', 'site-layers', 'tll-home-bands-v1.js'), 'utf8');
    const heroes = readFileSync(join(root, 'src', 'site-layers', 'tll-page-heroes-v1.js'), 'utf8');
    expect(cover).toMatch(/V\.apply\(img,V\.cap\?V\.cap\('100vw'\):'100vw',COVER\.img\)/);
    expect(cover).toMatch(/l\.setAttribute\('imagesizes',V\.cap\?V\.cap\('100vw'\):'100vw'\)/);
    expect(cover).toMatch(/imagesrcset/);
    expect(cover).not.toMatch(/img\.removeAttribute\('srcset'\);img\.removeAttribute\('sizes'\);img\.loading/);
    expect(bands).toMatch(/V\.apply\(i,'100vw',p\.src\)/);
    expect(heroes).not.toMatch(/\bnov\s*:/);
    expect(heroes).not.toMatch(/'-p-'\+/);
  });
  it('the layer is first in the core, ahead of the layers that call it', () => {
    const build = readFileSync(join(root, 'src', 'site-layers', 'build-site-layers-v16.py'), 'utf8');
    expect(build).toMatch(/CORE = \['tll-img-variants-v1',/);
    const core = readFileSync(join(root, 'src', 'site-layers', 'tll-site-layers-v16.js'), 'utf8');
    const at = n => core.indexOf(`/* src/site-layers/${n}.js */`);
    expect(at('tll-img-variants-v1')).toBeGreaterThan(0);
    expect(at('tll-img-variants-v1')).toBeLessThan(at('tll-page-heroes-v1'));
    expect(at('tll-img-variants-v1')).toBeLessThan(at('tll-home-bands-v1'));
    expect(at('tll-img-variants-v1')).toBeLessThan(core.indexOf("id='tll-mag-cover-v1'"));
  });
  it('no em dashes in the layer', () => {
    expect(src).not.toMatch(/—/);
  });
});
