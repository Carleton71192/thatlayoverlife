// Class B page code drafts of 27 Nov 2026 (reports/evidence/classb-2026-11-25). Each item folder holds the live Webflow page code
// block (before.html, read with the Webflow MCP) and the proposed block (after.html). Nothing here writes to Webflow. The repo has no
// jsdom, so the scripts run in the mini DOM (test/mini-dom.js) the other /submit tests use. Memberstack is a stand-in; no member data.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from './mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const EV = 'reports/evidence/classb-2026-11-25/';
const block = (item, which) => read(EV + item + '/' + which + '.html');
const script = (html, id) => new RegExp('<script id="' + id + '">([\\s\\S]*?)</script>').exec(html)[1];
const FORM = read('src/pages/submit/live-2026-10-29/form-story-export-2026-10-13.html');
const KEY = 'tllStoryDraft';
const LIMIT = 50000; // house limit for one page custom code block

// The changed span between two texts: what the before had there and what the after has.
function delta(a, b) {
  let i = 0; while (i < a.length && a[i] === b[i]) i += 1;
  let j = 0; while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j += 1;
  return { was: a.slice(i, a.length - j), now: b.slice(i, b.length - j) };
}

describe('class B drafts: the blocks', () => {
  const ITEMS = ['B02-submit-autosave', 'B15-submit-step-bar', 'B18-submit-picker-roles', 'B17-edit-profile-script-id', 'B08-my-pets-heading', 'submit-footer-B02-B15'];
  it('every after block is under the 50,000 character limit and differs from its before', () => {
    for (const it of ITEMS) {
      const b = block(it, 'before'); const a = block(it, 'after');
      expect(a.length, it).toBeLessThan(LIMIT); expect(a, it).not.toBe(b);
    }
  });
  it('the three /submit footer drafts start from the same live block', () => {
    const b = block('B02-submit-autosave', 'before');
    expect(block('B15-submit-step-bar', 'before')).toBe(b);
    expect(block('submit-footer-B02-B15', 'before')).toBe(b);
  });
  it('each single draft changes one span only, and the combined /submit footer is B02 plus B15', () => {
    const d02 = delta(block('B02-submit-autosave', 'before'), block('B02-submit-autosave', 'after'));
    expect(d02.was).toBe(''); expect(d02.now).toContain('function local(){');
    const d15 = delta(block('B15-submit-step-bar', 'before'), block('B15-submit-step-bar', 'after'));
    expect(d15.was).toMatch(/height:5px/); expect(d15.now).toMatch(/height:44px;min-height:44px/);
    const d18 = delta(block('B18-submit-picker-roles', 'before'), block('B18-submit-picker-roles', 'after'));
    expect(d18.was).toBe(''); expect(d18.now).toContain("setAttribute('role','button')");
    const d17 = delta(block('B17-edit-profile-script-id', 'before'), block('B17-edit-profile-script-id', 'after'));
    expect(d17).toEqual({ was: '', now: '-js' });
    const d08 = delta(block('B08-my-pets-heading', 'before'), block('B08-my-pets-heading', 'after'));
    expect(d08.was).not.toBe(''); expect(d08.now).toContain('Register your pet');
    const both = block('submit-footer-B02-B15', 'after');
    const b02 = block('B02-submit-autosave', 'after'); const b15 = block('B15-submit-step-bar', 'after');
    expect(both).toBe(b02.replace(delta(block('B15-submit-step-bar', 'before'), b15).was, () => delta(block('B15-submit-step-bar', 'before'), b15).now));
  });
  it('the words added follow the house rules (no em dash, no exclamation mark, no banned words)', () => {
    for (const it of ITEMS) {
      const { now } = delta(block(it, 'before'), block(it, 'after'));
      expect(now, it).not.toMatch(/—|ship|ledger|filed/i);
      // "!" is a code operator here; the prose is the comments and the quoted strings
      const prose = [...now.matchAll(/\/\*[\s\S]*?\*\/|'[^'\n]*'/g)].map((m) => m[0]).join(' ');
      expect(prose, it).not.toContain('!');
    }
  });
});

// One /submit page load: the story form as exported, Webflow's done box, the steps script from a footer block.
function submitPage(footer, { browser = new Map(), ms = null } = {}) {
  const page = FORM.replace(/<\/form><\/div>\s*$/, '</form><div class="w-form-done" style="display:none"><div>Sent.</div></div>'
    + '<div class="w-form-fail" style="display:none"><div>That did not send.</div></div></div>');
  const dom = createDom({ pathname: '/submit', html: page });
  for (const [k, v] of browser) dom.store.set(k, v);
  if (ms) dom.window.$memberstackDom = ms;
  dom.run(script(footer, 'tll-form-steps-js-v2'));
  const d = dom.document; const form = d.querySelector('form[data-tll-form="submit-story"]');
  const body = form.querySelector('textarea[name="body"]');
  const type = (el, v) => { el.value = v; el.dispatchEvent(new dom.Event('input', { bubbles: true })); };
  const hide = () => { d.visibilityState = 'hidden'; d.dispatchEvent(new dom.Event('visibilitychange', { bubbles: true })); };
  const leave = () => dom.window.dispatchEvent(new dom.Event('pagehide', { bubbles: true }));
  const saved = () => JSON.parse(dom.store.get(KEY) || 'null');
  return { dom, d, form, body, type, hide, leave, saved };
}
const STORY = 'We missed the ferry and took the night bus instead.';

describe('B02 /submit: text typed in the last 20 s', () => {
  const BEFORE = block('B02-submit-autosave', 'before');
  const AFTER = block('B02-submit-autosave', 'after');

  it('before (live): 5 s after typing, a reload finds nothing in this browser', async () => {
    const t = submitPage(BEFORE);
    t.type(t.body, STORY); await t.dom.tick(5000); t.leave();
    expect(t.saved()).toBeNull();
  });
  it('after: this browser holds the text 1 s after typing stops, and the next visit fills the form', async () => {
    const t = submitPage(AFTER);
    t.type(t.body, 'We missed'); await t.dom.tick(500);
    t.type(t.body, STORY); await t.dom.tick(900);
    expect(t.saved()).toBeNull(); // still typing: the 1 s wait starts again with each input
    await t.dom.tick(200);
    expect(t.saved().body).toBe(STORY);
    const v = submitPage(AFTER, { browser: t.dom.store });
    expect(v.body.value).toBe(STORY);
  });
  it('after: hiding the tab or leaving the page saves at once', async () => {
    const a = submitPage(AFTER); a.body.value = STORY; a.hide(); expect(a.saved().body).toBe(STORY);
    const b = submitPage(AFTER); b.body.value = STORY; b.leave(); expect(b.saved().body).toBe(STORY);
  });
  it('after: fields filled by other scripts alone make no copy (the 21 Nov rule)', async () => {
    const t = submitPage(AFTER);
    const ts = t.form.querySelector('input[name]:not([name="name"]):not([name="excerpt"]):not([name="country"])');
    t.type(ts, 'token-from-another-script'); await t.dom.tick(1500); t.leave();
    expect(t.saved()).toBeNull();
  });
  it('after: once Send is pressed, leaving the page does not write the copy back; typing again does', async () => {
    const t = submitPage(AFTER);
    t.type(t.body, STORY); await t.dom.tick(1500); expect(t.saved()).not.toBeNull();
    t.form.dispatchEvent(new t.dom.Event('submit', { bubbles: true, cancelable: true }));
    expect(t.saved()).toBeNull(); t.leave(); t.hide(); expect(t.saved()).toBeNull();
    t.type(t.body, STORY + ' Again.'); await t.dom.tick(1500); // a failed send: the writer edits, the copy comes back
    expect(t.saved().body).toBe(STORY + ' Again.');
  });
  it('after: nothing is written once the done box shows', async () => {
    const t = submitPage(AFTER);
    t.type(t.body, STORY); await t.dom.tick(1500);
    const done = t.d.querySelector('.w-form-done'); done.style.display = 'block'; t.dom.mutate(done);
    expect(t.saved()).toBeNull();
    t.type(t.body, STORY + ' More.'); await t.dom.tick(1500); t.leave();
    expect(t.saved()).toBeNull();
  });
  it('after: the account copy stays on the 20 s autosave and still gets the change this browser saved first', async () => {
    const writes = [];
    const ms = { getMemberJSON: () => Promise.resolve({ data: {} }), updateMemberJSON: ({ json }) => { writes.push(json); return Promise.resolve({ data: json }); },
      getCurrentMember: () => Promise.resolve({ data: { customFields: {} } }) };
    const t = submitPage(AFTER, { ms });
    t.type(t.body, STORY); await t.dom.tick(1500);
    expect(t.saved().body).toBe(STORY); expect(writes).toHaveLength(0);
    await t.dom.tick(19000);
    expect(writes).toHaveLength(1); expect(writes[0].tllStoryDraft.fields.body).toBe(STORY);
  });
});

describe('B15 /submit step bar', () => {
  const css = (html) => /<style id="tll-form-steps-v2">([\s\S]*?)<\/style>/.exec(html)[1];
  it('each segment is a 44 px target with a 6 px bar, in all three states', () => {
    const c = css(block('B15-submit-step-bar', 'after'));
    expect(c).toMatch(/\.tllst-seg\{flex:1;height:44px;min-height:44px;background:linear-gradient\(#EDE6DA,#EDE6DA\) center\/100% 6px no-repeat;/);
    expect(c).toContain('.tllst-seg.on{background:linear-gradient(#067A79,#067A79) center/100% 6px no-repeat}');
    expect(c).toContain('.tllst-seg.done{background:linear-gradient(#0A0B14,#0A0B14) center/100% 6px no-repeat}');
    expect(c).not.toMatch(/\.tllst-seg\{[^}]*height:5px/);
  });
  it('the colors are the ones the live bar uses', () => {
    const b = css(block('B15-submit-step-bar', 'before'));
    for (const col of ['#EDE6DA', '#067A79', '#0A0B14']) expect(b).toContain(col);
  });
});

describe('B18 /submit: the two picks are buttons', () => {
  const FORK = '<div data-tll-fork><a href="#" aria-pressed="true" data-tll-fork-pick="write"><span data-tll-fork-k>Write it here</span></a>'
    + '<a href="#" aria-pressed="false" data-tll-fork-pick="link"><span data-tll-fork-k>Link to it</span></a></div>'
    + '<div class="tll-pen-form">form</div><div data-tll-linkout hidden><form></form></div>';
  function load(head) {
    const dom = createDom({ pathname: '/submit', html: FORK });
    const ss = new Map(); const sessionStorage = { getItem: (k) => (ss.has(k) ? ss.get(k) : null), setItem: (k, v) => ss.set(k, String(v)) };
    dom.run(script(head, 'tll-share-fork-js-v1'), { sessionStorage });
    const d = dom.document;
    const key = (el, k) => { const ev = new dom.Event('keydown', { bubbles: true, cancelable: true }); ev.key = k; el.dispatchEvent(ev); return ev; };
    return { dom, d, write: d.querySelector('[data-tll-fork-pick="write"]'), link: d.querySelector('[data-tll-fork-pick="link"]'),
      out: d.querySelector('[data-tll-linkout]'), pen: d.querySelector('.tll-pen-form'), key };
  }
  it('before (live): no role, and Space does nothing', () => {
    const t = load(block('B18-submit-picker-roles', 'before'));
    expect(t.link.getAttribute('role')).toBeNull();
    const ev = t.key(t.link, ' ');
    expect(ev.defaultPrevented).toBe(false); expect(t.link.getAttribute('aria-pressed')).toBe('false');
  });
  it('after: both picks carry role=button and keep aria-pressed', () => {
    const t = load(block('B18-submit-picker-roles', 'after'));
    expect([t.write.getAttribute('role'), t.link.getAttribute('role')]).toEqual(['button', 'button']);
    expect([t.write.getAttribute('aria-pressed'), t.link.getAttribute('aria-pressed')]).toEqual(['true', 'false']);
    expect(t.write.getAttribute('href')).toBe('#');
  });
  it('after: Space picks, like a click (no page scroll), and Enter is left to the link', () => {
    const t = load(block('B18-submit-picker-roles', 'after'));
    const ev = t.key(t.link, ' ');
    expect(ev.defaultPrevented).toBe(true);
    expect(t.link.getAttribute('aria-pressed')).toBe('true'); expect(t.write.getAttribute('aria-pressed')).toBe('false');
    expect(t.out.hasAttribute('hidden')).toBe(false); expect(t.pen.style.display).toBe('none');
    const en = t.key(t.write, 'Enter');
    expect(en.defaultPrevented).toBe(false); expect(t.write.getAttribute('aria-pressed')).toBe('false');
    t.write.click(); expect(t.write.getAttribute('aria-pressed')).toBe('true'); expect(t.out.hasAttribute('hidden')).toBe(true);
  });
  it('after: Space elsewhere on the fork is left alone', () => {
    const t = load(block('B18-submit-picker-roles', 'after'));
    const ev = t.key(t.d.querySelector('[data-tll-fork]'), ' ');
    expect(ev.defaultPrevented).toBe(false); expect(t.write.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('B17 /edit-profile: one id, one element', () => {
  const HEAD = block('B17-edit-profile-script-id', 'head-unchanged');
  const ids = (html) => [...html.matchAll(/<(?:style|script)[^>]*\sid="([^"]+)"/g)].map((m) => m[1]);
  it('before (live): the head style and the footer script share tll-edit-dir-v1', () => {
    const all = ids(HEAD + block('B17-edit-profile-script-id', 'before'));
    expect(all.filter((x) => x === 'tll-edit-dir-v1')).toHaveLength(2);
  });
  it('after: every style and script id on the page code is used once, and the script body is unchanged', () => {
    const all = ids(HEAD + block('B17-edit-profile-script-id', 'after'));
    expect(new Set(all).size).toBe(all.length);
    expect(all).toContain('tll-edit-dir-v1-js');
    expect(script(block('B17-edit-profile-script-id', 'after'), 'tll-edit-dir-v1-js')).toBe(script(block('B17-edit-profile-script-id', 'before'), 'tll-edit-dir-v1'));
  });
});

describe('B08 /my-pets: the heading and the add card at 0, 1 and 2 pets', () => {
  const PAGE = '<h2 class="tll-mypets-grid-title">Traveling with <em class="tll-text-rose">your besties</em>.</h2><div class="tll-mypets-grid">'
    + '<div class="tll-mypets-card tll-mypets-card-add"><div class="tll-mypets-card-add-icon">+</div><h3 class="tll-h3 tll-mypets-card-add-title">Register another pet</h3></div></div>';
  async function load(footer, pets) {
    const dom = createDom({ pathname: '/my-pets', html: PAGE });
    dom.window.$memberstackDom = {
      getCurrentMember: () => Promise.resolve({ data: { id: 'mem_test', customFields: { 'custom-slug': 'test-member' } } }),
      getMemberJSON: () => Promise.resolve({ data: { pets: pets.map((n, i) => ({ id: 'p' + i, name: n, species: 'Dog', countries: [] })) } }),
      updateMemberJSON: ({ json }) => Promise.resolve({ data: json }),
    };
    dom.run(script(footer, 'tll-pet-editor'), { fetch: () => Promise.reject(new Error('no fetch in this test')) });
    await dom.tick(100);
    const d = dom.document;
    return { em: d.querySelector('.tll-mypets-grid-title em').textContent, add: d.querySelector('.tll-mypets-card-add-title').textContent, rows: d.querySelectorAll('.tpe-row').length };
  }
  it('before (live): 0 pets reads "0 besties" under "Register another pet"', async () => {
    expect(await load(block('B08-my-pets-heading', 'before'), [])).toEqual({ em: '0 besties', add: 'Register another pet', rows: 0 });
  });
  it('after: 0 pets keeps "your besties" and asks "Register your pet"', async () => {
    expect(await load(block('B08-my-pets-heading', 'after'), [])).toEqual({ em: 'your besties', add: 'Register your pet', rows: 0 });
  });
  it('after: 1 and 2 pets read as before, with "Register another pet"', async () => {
    const f = block('B08-my-pets-heading', 'after');
    expect(await load(f, ['Test Pet'])).toEqual({ em: '1 bestie', add: 'Register another pet', rows: 1 });
    expect(await load(f, ['Test Pet', 'Second Pet'])).toEqual({ em: '2 besties', add: 'Register another pet', rows: 2 });
  });
});
