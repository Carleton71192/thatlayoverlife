// November 12, 2026 codebase review: tll-components-v1, the shared sub-components of the stories and expat layers (see updates.md).
//   tll-components-v1.html  a core style: --tll-ui-* tokens, the tape, the small label (kicker), the empty state, a hidden utility.
//                           The old class names sit beside the new ones in each selector, so Webflow page code keeps working.
//   tll-components-v1.js    a core layer: window.__tllUI (el, style, json), the helpers the series, expat and story-is layers had copied.
// The tests read the sources and the built files, resolve the tokens to prove the moved rules carry the same values as the ones they
// replaced, and run the helpers against a small stand-in for document and fetch.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const L = (f) => read('src', 'site-layers', f);
const count = (s, part) => s.split(part).length - 1;

const html = L('tll-components-v1.html');
const css = /<style id="tll-components-v1">\n([\s\S]*)<\/style>/.exec(html)[1];
const helpers = L('tll-components-v1.js');
const LAYERS = ['tll-series-v1.js', 'tll-expat-v1.js', 'tll-story-is-v1.js', 'tll-stories-places-v1.js', 'tll-stories-noimg-v1.js', 'tll-expats-map-v1.js'];
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

// The tokens and a resolver: declarations of every rule whose selector list holds `sel`, in source order, var() resolved.
const root = /:root\{([^}]*)\}/.exec(stripComments(css))[1];
const TOKENS = Object.fromEntries(root.split(';').map((d) => d.trim()).filter(Boolean).map((d) => { const i = d.indexOf(':'); return [d.slice(0, i).trim(), d.slice(i + 1).trim()]; }));
const resolve = (v) => v.replace(/var\((--[\w-]+)\)/g, (_, n) => TOKENS[n]);
function decls(sel) {
  const out = {};
  for (const m of stripComments(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!m[1].split(',').map((s) => s.trim()).includes(sel)) continue;
    for (const d of m[2].split(';')) { const i = d.indexOf(':'); if (i > 0) out[d.slice(0, i).trim()] = resolve(d.slice(i + 1).trim()).replace(/\s*!important/, ' !important'); }
  }
  return out;
}
const parse = (s) => Object.fromEntries(s.split(';').filter(Boolean).map((d) => { const i = d.indexOf(':'); return [d.slice(0, i).trim(), d.slice(i + 1).trim()]; }));
const lower = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.toLowerCase()]));

describe('tll-components-v1 is built into the core', () => {
  const build = L('build-site-layers-v16.py');
  const core = L('tll-site-layers-v16.js');
  it('the style is registered in STYLES and lands in the core style list', () => {
    expect(build).toMatch(/\('src\/site-layers\/tll-components-v1\.html', 'tll-components-v1', /);
    expect(core).toContain('["tll-components-v1", ');
  });
  it('the helpers are a core layer right after img-variants, ahead of the story and cover sections', () => {
    expect(build).toMatch(/CORE = \['tll-img-variants-v1', 'tll-components-v1',/);
    const at = (n) => core.indexOf(`/* src/site-layers/${n}.js */`);
    expect(at('tll-components-v1')).toBeGreaterThan(at('tll-img-variants-v1'));
    expect(at('tll-components-v1')).toBeLessThan(at('tll-page-heroes-v1'));
    expect(at('tll-components-v1')).toBeLessThan(core.indexOf("id='tll-mag-story-v1'"));
    expect(count(core, 'window.__tllUI={el:el,style:style,json:json}')).toBe(1);
  });
  it('no chunk defines window.__tllUI; the chunks that use it are only loaded by the core', () => {
    // The core runs to the end before any chunk script it appends can run, so the helpers exist when a chunk reads them.
    for (const c of ['stories', 'story', 'story-preview', 'submit', 'submit-preview', 'for-expats', 'for-expats-preview', 'edit-profile-preview', 'profile-preview', 'countries', 'pets', 'pursuits']) {
      const s = L(join('chunks', `${c}.js`));
      expect(count(s, 'window.__tllUI={'), c).toBe(0);
      expect(count(s, 'var U=window.__tllUI'), c).toBeGreaterThan(0);
    }
  });
});

describe('tokens', () => {
  it('every --tll-ui-* token is read by a rule here or by a layer, and every one read is defined', () => {
    const uses = [css, ...LAYERS.map(L)].join('\n');
    const read = new Set([...uses.matchAll(/var\((--tll-ui-[\w-]+)\)/g)].map((m) => m[1]));
    expect(Object.keys(TOKENS).length).toBeGreaterThan(0);
    for (const t of Object.keys(TOKENS)) expect(read.has(t), t).toBe(true);
    for (const t of read) expect(t in TOKENS, t).toBe(true);
  });
  it('the tokens hold the values the layers used before', () => {
    expect(lower(TOKENS)).toMatchObject({ '--tll-ui-ink': '#0a0b14', '--tll-ui-paper': '#fdf9f3', '--tll-ui-cream': '#f7f1e8', '--tll-ui-line': '#e0dace',
      '--tll-ui-dash': '#c9b89a', '--tll-ui-text-2': '#3a3a3a', '--tll-ui-muted-2': '#5f5a54', '--tll-ui-rose-text': '#c8325b', '--tll-ui-teal-text': '#067a79' });
  });
  it('no new class name contains a word the site-wide head rules match inside class names', () => {
    const names = new Set([...css.matchAll(/\.(tll-ui-[\w-]+)/g)].map((m) => m[1]));
    expect(names.size).toBeGreaterThan(5);
    for (const n of names) expect(n, n).not.toMatch(/card|eyebrow|title|h3|group|divider/);
  });
});

describe('the moved rules keep the values they had', () => {
  it('the tape: same as .tll-wt-tape, .tll-wt-card-tape (tll-series-v1) and .tll-ex-tape (tll-expat-v1) before November 12, 2026', () => {
    const base = parse('display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 11px/1.3 \'JetBrains Mono\',ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%);max-width:100%');
    expect(lower(decls('.tll-ui-tape'))).toEqual(lower(base));
    expect(decls('.tll-wt-tape')).toEqual({ ...decls('.tll-ui-tape'), margin: '0 0 10px' });
    expect(decls('.tll-wt-card-tape')).toEqual({ 'font-size': '10px', padding: '5px 10px', position: 'absolute', top: '10px', left: '10px', 'z-index': '3', margin: '0' });
    const ex = { ...decls('.tll-ex-tape') };
    expect([ex['font-size'], ex.padding]).toEqual(['10px', '5px 10px']);
  });
  it('the small label: same as .tll-sr-k, .tll-ex-k and .tll-si-k before November 12, 2026', () => {
    const old = parse('font:600 11px/1.4 \'JetBrains Mono\',ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px');
    for (const s of ['.tll-ui-kicker', '.tll-sr-k', '.tll-ex-k', '.tll-si-k']) expect(lower(decls(s)), s).toEqual(lower(old));
  });
  it('the empty state: base plus --center is the inline style tll-stories-places-v1 wrote before November 12, 2026', () => {
    const old = parse('border:2px dashed #c9b89a;border-radius:10px;padding:28px;margin-bottom:20px;text-align:center;background:#fff;font-size:14px;color:#3a3a3a');
    expect(lower({ ...decls('.tll-ui-empty'), ...decls('.tll-ui-empty--center') })).toEqual(lower(old));
  });
});

describe('the layers use the shared pieces and no longer carry copies', () => {
  const series = L('tll-series-v1.js'), expat = L('tll-expat-v1.js'), is = L('tll-story-is-v1.js');
  it('no copy of the tape or label rules is left in a layer', () => {
    expect(count(series, '.tll-wt-tape{') + count(series, '.tll-wt-card-tape{') + count(series, '.tll-sr-k{')).toBe(0);
    expect(count(expat, '.tll-ex-tape{') + count(expat, '.tll-ex-k{')).toBe(0);
    expect(count(is, '.tll-si-k{')).toBe(0);
  });
  it('the elements carry the new class names beside the old ones', () => {
    expect(series).toContain("el('span','tll-wt-tape tll-ui-tape'");
    expect(series).toContain("'tll-wt-card-tape tll-ui-tape--sm tll-ui-tape--corner'");
    expect(count(series, "'tll-sr-k'")).toBe(0);
    expect(count(series, "'tll-sr-k tll-ui-kicker'")).toBe(5);
    expect(count(expat, "'tll-ex-k'")).toBe(0);
    expect(count(expat, "'tll-ex-k tll-ui-kicker'")).toBe(6);
    expect(is).toContain("'tll-si-k tll-ui-kicker'");
  });
  it('el, style and the GET helper come from window.__tllUI, after the path guard', () => {
    for (const [name, s, guard] of [['series', series, 'if(!ROUTES_LIVE&&!pv)return;'], ['expat', expat, 'if(!ON)return;'], ['story-is', is, "var P=location.pathname"]]) {
      expect(s, name).not.toMatch(/function el\(/);
      expect(s, name).not.toMatch(/document\.head\.appendChild\(s\)/);
      expect(s.indexOf('var U=window.__tllUI,el=U.el;'), name).toBeGreaterThan(s.indexOf(guard));
    }
    expect(series).toContain('function get(path){return U.json(API+path);}');
    expect(expat).toContain('function get(path){return U.json(API+path);}');
  });
  it('layout is no longer written as inline styles by these layers (the per-photo crop and the static-card check stay)', () => {
    expect(L('tll-stories-places-v1.js')).not.toMatch(/style\.cssText/);
    expect(L('tll-stories-places-v1.js')).toContain("note.className='tll-ui-empty tll-ui-empty--center'");
    expect(L('tll-stories-noimg-v1.js')).not.toMatch(/style\.display/);
    expect(expat).not.toMatch(/\.style\.(margin|display)=/);
    expect(series).not.toMatch(/style\.color=/);
    // a data attribute, not a class: the site head transition rule matches a:not([class]), and the inline style kept that match
    expect(series).toContain('[data-tll-reklame] a[data-tll-sponsor]{color:inherit}');
    expect(series).toContain("sa.setAttribute('data-tll-sponsor','')");
    // the /stories page code sets .tll-lib-img{display:block !important}, which the old inline display:none never beat
    expect(L('tll-stories-noimg-v1.js')).toContain('[data-tll-noimg] img.tll-ui-hidden{display:none!important}');
  });
  it('the expats map heading has its own hook, so the page script cannot write the expert count into it', () => {
    const map = L('tll-expats-map-v1.js');
    expect(stripComments(map)).not.toContain('dir-h2');
    expect(map).toContain("'data-tll-x':'expats-map-h2'");
  });
});

describe('window.__tllUI helpers', () => {
  function env(fetchImpl) {
    const head = { kids: [], appendChild(n) { this.kids.push(n); return n; } };
    const doc = {
      head,
      createElement: (t) => ({ tagName: t.toUpperCase(), className: '', textContent: '', id: '' }),
      getElementById: (id) => head.kids.find((k) => k.id === id) || null,
    };
    const win = { document: doc, fetch: fetchImpl || (() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: 1 }) })) };
    win.window = win;
    vm.runInNewContext(helpers, win);
    return win;
  }
  it('el sets the class and the text only when given', () => {
    const { el } = env().__tllUI;
    expect(el('p', 'a b', 'hi')).toMatchObject({ tagName: 'P', className: 'a b', textContent: 'hi' });
    expect(el('div')).toMatchObject({ className: '', textContent: '' });
    expect(el('span', '', 0).textContent).toBe(0);
  });
  it('style appends one style element per id', () => {
    const w = env();
    w.__tllUI.style('x', 'a{b:c}'); w.__tllUI.style('x', 'd{e:f}');
    expect(w.document.head.kids).toHaveLength(1);
    expect(w.document.head.kids[0]).toMatchObject({ id: 'x', textContent: 'a{b:c}' });
  });
  it('json gives the body on 2xx and null on an error answer or a failed request', async () => {
    expect(await env().__tllUI.json('/a')).toEqual({ ok: 1 });
    expect(await env(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) })).__tllUI.json('/a')).toBeNull();
    expect(await env(() => Promise.reject(new Error('offline'))).__tllUI.json('/a')).toBeNull();
  });
  it('keeps an existing window.__tllUI', () => {
    const keep = { el: 1 }; const win = { __tllUI: keep, document: {} }; win.window = win;
    vm.runInNewContext(helpers, win);
    expect(win.__tllUI).toBe(keep);
  });
});

describe('story layer custom properties (tll-mag-story-v1)', () => {
  const mag = read('src', 'design', 'magazine-2026-10', 'story-build', 'tll-mag-story-v1.html');
  it('every var(--mg-*) it reads is defined in it, and --mg-teal (read nowhere) is gone', () => {
    const defined = new Set([...mag.matchAll(/(--mg-[\w-]+)\s*:/g)].map((m) => m[1]));
    for (const m of mag.matchAll(/var\((--mg-[\w-]+)/g)) expect(defined.has(m[1]), m[1]).toBe(true);
    expect(mag).not.toContain('--mg-teal');
  });
  it('the gallery tile keeps today\'s look: no background while its photo loads (the undefined var(--mg-ink2) is gone)', () => {
    // var(--mg-ink2) was never defined, so the tile was transparent. Ink tiles would be a visible change: an owner choice in updates.md.
    expect(mag).toContain('.tll-gallery-link{display:block;border-radius:var(--mg-r);overflow:hidden}');
    expect(mag).not.toMatch(/\.tll-gallery-link\{[^}]*background/);
    expect(L('tll-site-layers-v16.js')).not.toContain('--mg-ink2');
  });
});

// The repo has no DOM test environment (no jsdom or happy-dom), so these two checks work the cascade out from the rules themselves.
// Both states were also checked in Chromium on November 12, 2026 by the independent reviewer (updates.md, section 5.3).
describe('the broken-photo rule and the empty note win the cascade on /stories', () => {
  // Specificity of a simple selector (no :is/:not/:where arguments in the selectors checked here): [ids, classes+attributes+pseudo-classes, types].
  const spec = (sel) => {
    const s = sel.replace(/::[\w-]+/g, ' ').replace(/\[[^\]]*\]/g, ' .a ').replace(/:[\w-]+/g, ' .p ');
    return [(s.match(/#[\w-]+/g) || []).length, (s.match(/\.[\w-]+/g) || []).length, (s.replace(/[#.][\w-]+/g, ' ').match(/(^|[\s>+~])[a-z][\w-]*/gi) || []).length];
  };
  const beats = (a, b) => { for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]; return false; };
  const rules = (src) => [...stripComments(src).matchAll(/([^{}@]+)\{([^{}]*)\}/g)].flatMap((m) => m[1].split(',').map((sel) => ({ sel: sel.trim(), body: m[2] })));
  // the CSS of the /stories page code (repo copies of the Webflow head and footer), <style> blocks only
  const page = ['stories-head.html', 'stories-footer.html'].map((f) => read('src', 'pages', 'heroes-2026-10-29', 'code', f))
    .flatMap((s) => [...s.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1])).join('\n');
  const noimg = L('tll-stories-noimg-v1.js');
  const layerCss = /var CSS=([\s\S]*?);\nfunction /.exec(noimg)[1].replace(/"\s*\+\s*"/g, '').replace(/^"|"$/g, '');

  it('the specificity helper agrees with the CSS rules for the selectors used here', () => {
    expect(spec('.tll-lib-img')).toEqual([0, 1, 0]);
    expect(spec('[data-tll-noimg] img.tll-ui-hidden')).toEqual([0, 2, 1]);
    expect(spec('html.tllp-stories .tll-lib-grid > * .tll-lib-img')).toEqual([0, 3, 1]);
    expect(spec('#tll-chip-note')).toEqual([1, 0, 0]);
  });
  it('a card whose photo fails: [data-tll-noimg] img.tll-ui-hidden beats .tll-lib-img{display:block !important}', () => {
    const hide = rules(layerCss).find((r) => r.sel === '[data-tll-noimg] img.tll-ui-hidden');
    expect(hide.body.replace(/\s/g, '')).toBe('display:none!important');
    // every page rule that sets display on the card image with !important (today just .tll-lib-img) loses on specificity,
    // so the order of the page code and the layer's style in the document does not matter
    const shows = rules(page).filter((r) => /\.tll-lib-img(?![\w-])[^\s>+~]*$/.test(r.sel) && /display\s*:[^;]*!important/.test(r.body));
    expect(shows.map((r) => r.sel)).toContain('.tll-lib-img');
    for (const r of shows) expect(beats(spec(hide.sel), spec(r.sel)), r.sel).toBe(true);
    // .tll-ui-hidden alone would only tie with .tll-lib-img and lose to the later page rule, which is why the layer adds its own rule
    expect(beats(spec('.tll-ui-hidden'), spec('.tll-lib-img'))).toBe(false);
    // the layer marks the card and hides that card's own image, so the selector matches the image it hid
    expect(noimg).toContain("img.classList.add('tll-ui-hidden')");
    expect(noimg).toContain("k.setAttribute('data-tll-noimg','1')");
    expect(noimg).toContain('function panel(k){\n  var img=cardImg(k);');
  });
  it('the empty-region note: each class it carries has a core rule, and no /stories page rule competes for the note', () => {
    const places = L('tll-stories-places-v1.js');
    const cls = /note\.className='([^']+)'/.exec(places)[1].split(' ');
    expect(cls).toEqual(['tll-ui-empty', 'tll-ui-empty--center']);
    for (const c of cls) expect(Object.keys(decls('.' + c)).length, c).toBeGreaterThan(0);
    // nothing in the /stories page code targets the note by id, by role or by these classes, so the core rules apply as written
    expect(rules(page).length).toBeGreaterThan(50);
    for (const r of rules(page)) expect(r.sel, r.sel).not.toMatch(/tll-chip-note|tll-ui-empty|role=["']?status/);
    expect(L('tll-site-layers-v16.js')).toContain('.tll-ui-empty{border:2px dashed var(--tll-ui-dash)');
  });
});

describe('house rules in the new and changed files', () => {
  it('no em dashes, no exclamation marks in copy', () => {
    for (const s of [html, helpers, ...LAYERS.map(L)]) {
      const copy = stripComments(s);
      expect(copy).not.toMatch(/—/);
      expect(copy).not.toMatch(/[A-Za-z]!['"]/);
    }
  });
});
