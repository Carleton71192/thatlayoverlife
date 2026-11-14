// tll-story-avatar-v1 (14 Nov 2026, the story page first-frame jump at 390, reports/evidence/story-first-frame-2026-11-14/diagnosis.md).
// The writer's photo in the author row had no size until the template's end-of-body style was parsed; a photo served from the cache
// before that painted at its natural size and the author text came back up about 540px (a 0.32 layout shift). The layer puts the
// template's own size and fit declarations into the head on story pages only. Here: it runs only on the Stories Template, adds one style
// once, its declarations are the template's to the letter with the same selectors (so the finished cascade is unchanged), and the
// built core carries it once, in the head part of the core.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const src = read('src', 'site-layers', 'tll-story-avatar-v1.js');
const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
const footer = read('src', 'pages', 'stories-template', 'live-2026-11-13', 'fonts', 'page-footer.after.html');
const mag = read('src', 'design', 'magazine-2026-10', 'story-build', 'tll-mag-story-v1.html');
const STORY = '6a0b29eedc14f1444e935766';

function page({ wfPage = STORY, existing = false } = {}) {
  const styles = [];
  const document = {
    documentElement: { getAttribute: (k) => (k === 'data-wf-page' ? wfPage : null) },
    head: { appendChild: (s) => styles.push(s) },
    getElementById: (id) => (existing && id === 'tll-story-avatar-v1' ? {} : null),
    createElement: (tag) => ({ tag, id: '', textContent: '' }),
  };
  new Function('document', src)(document);
  return styles;
}
// "sel{a:b;c:d}" -> [[sel, {a:b, c:d}], ...]
function rules(css) {
  return [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map(([, sel, body]) => [sel.trim(),
    Object.fromEntries(body.split(';').filter(Boolean).map((d) => { const i = d.indexOf(':'); return [d.slice(0, i).trim(), d.slice(i + 1).trim()]; }))]);
}

describe('tll-story-avatar-v1 in a stand-in page', () => {
  it('adds one style to the head on the Stories Template', () => {
    const s = page();
    expect(s.length).toBe(1);
    expect(s[0].tag).toBe('style');
    expect(s[0].id).toBe('tll-story-avatar-v1');
    expect(s[0].textContent).toBe('.st3-author-avatar{flex:none;width:40px;height:40px;overflow:hidden;box-sizing:border-box}'
      + '.st3-author-img{display:block;width:100%;height:100%;object-fit:cover}');
  });
  it('does nothing on any other page, or when the style is already there', () => {
    expect(page({ wfPage: '6a0b29eedc14f1444e935700' }).length).toBe(0);
    expect(page({ wfPage: null }).length).toBe(0);
    expect(page({ existing: true }).length).toBe(0);
  });
});

describe('tll-story-avatar-v1 matches the template exactly', () => {
  const ours = rules(page()[0].textContent);
  const tpl = Object.fromEntries(rules(footer).filter(([sel]) => /^\.st3-author-(avatar|img)$/.test(sel)));
  it('uses the template selectors, so its specificity equals the template rules and the later template style wins every tie', () => {
    expect(ours.map(([sel]) => sel)).toEqual(['.st3-author-avatar', '.st3-author-img']);
    expect(Object.keys(tpl).sort()).toEqual(['.st3-author-avatar', '.st3-author-img']);
  });
  it('every declaration is the template one, value for value: the finished cascade is unchanged', () => {
    for (const [sel, decl] of ours) for (const [k, v] of Object.entries(decl)) expect([sel, k, tpl[sel][k]]).toEqual([sel, k, v]);
    expect(tpl['.st3-author-avatar']).toMatchObject({ width: '40px', height: '40px' });
    expect(tpl['.st3-author-img']).toMatchObject({ 'object-fit': 'cover', width: '100%', height: '100%' });
  });
  it('the story layer 44px avatar in the hero stays more specific, so the magazine byline is untouched', () => {
    expect(mag).toContain('.tll-story-hero-content .st3-author-avatar{width:44px;height:44px;border:0}');
  });
});

describe('tll-story-avatar-v1 source and build', () => {
  it('is a core layer after the library hold, and the core carries it once, before the story layer', () => {
    const build = read('src', 'site-layers', 'build-site-layers-v16.py');
    expect(build).toMatch(/'tll-library-hold-v1',\s+'tll-story-avatar-v1',/);
    const at = (n) => core.indexOf(`/* src/site-layers/${n}.js */`);
    expect(at('tll-story-avatar-v1')).toBeGreaterThan(at('tll-library-hold-v1'));
    expect(core.split('/* src/site-layers/tll-story-avatar-v1.js */').length - 1).toBe(1);
    expect(core.split("st.id='tll-story-avatar-v1'").length - 1).toBe(1);
    expect(at('tll-story-avatar-v1')).toBeLessThan(core.indexOf("s.id='tll-mag-story-v1'"));
  });
  it('runs at once from the head: no page-parsed wait, no observer, no member, nav, footer or form element', () => {
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/DOMContentLoaded|MutationObserver|addEventListener|setTimeout/);
    expect(code).not.toMatch(/data-ms-/);
    expect(code).not.toMatch(/querySelector/);
  });
  it('no em dashes or exclamation marks in its text', () => {
    expect(src).not.toMatch(/—/);
    const comments = (src.match(/\/\*[\s\S]*?\*\//g) || []).join('\n');
    expect(comments).not.toMatch(/!/);
  });
});
