// tll-expert-from-v1 (the for-expats chunk) is a browser script, so this test runs its source against a small stand-in for window
// and document (11 Nov 2026, Nancy: "OK to rename the two form fields so names arrive? Yes"). The published Location Expert form
// serves #le-name and #le-links both as name="field" data-name="Field"; Webflow keeps one value per data-name when the form is sent,
// so the links answer replaced the name. The layer gives the two inputs the names the Designer already shows, writes nothing when
// they are already right, renames again when the form is drawn again, and runs ahead of Webflow's submit handler.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'site-layers', 'tll-expert-from-v1.js'), 'utf8');

function field(tag, attrs, value = '') {
  const a = { ...attrs }; const writes = [];
  return { tag, value, writes, attrs: a, get id() { return a.id; },
    getAttribute: (k) => (k in a ? a[k] : null), setAttribute: (k, v) => { writes.push([k, v]); a[k] = v; } };
}
// The form as published on 11 Nov 2026, in page order (the runtime from-country field is left out here; it has its own test below).
function published({ name = 'field', nameData = 'Field', links = 'field', linksData = 'Field' } = {}) {
  return [
    field('input', { class: 'tllpr-in w-input', maxlength: '256', name, 'data-name': nameData, placeholder: 'Example text', type: 'text', id: 'le-name', required: '' }, 'A Name'),
    field('input', { name: 'email', 'data-name': 'email', type: 'email', id: 'le-email', required: '' }, 'someone@example.com'),
    field('input', { name: 'city-country', 'data-name': 'city-country', type: 'text', id: 'le-city', required: '' }, 'Lisbon, Portugal'),
    field('input', { name: 'years-there', 'data-name': 'years-there', type: 'text', id: 'le-years', required: '' }, '8 years'),
    field('textarea', { name: 'local-truth', 'data-name': 'local-truth', id: 'le-pitch', required: '' }, 'Two sentences.'),
    field('input', { class: 'tllpr-in tllpr-last w-input', maxlength: '256', name: links, 'data-name': linksData, placeholder: 'Substack, blog, Instagram', type: 'text', id: 'le-links' }, 'a blog'),
    field('input', { type: 'checkbox', id: 'checkbox', name: 'age-and-terms', 'data-name': 'age-and-terms', required: '' }, true),
  ];
}
// What Webflow's runtime does with the fields when the form is sent (webflow.schunk.370eb798fd9b1ff6.js, 11 Nov 2026):
// h=d.attr("data-name")||d.attr("name")||"Field "+(o+1); h=encodeURIComponent(h); ... n[h]=p
function collect(fields) {
  const out = {};
  fields.forEach((f, i) => { out[encodeURIComponent(f.getAttribute('data-name') || f.getAttribute('name') || `Field ${i + 1}`)] = f.value; });
  return out;
}

function run(pathname, { fields = published(), readyState = 'complete', observer = true, extra = {} } = {}) {
  const page = { fields }; const asked = []; const listeners = []; const timers = []; const observers = [];
  const document = {
    readyState, documentElement: { tag: 'html' },
    addEventListener: (type, fn, capture) => listeners.push({ type, fn, capture }),
    getElementById: (id) => extra[id] || null,
    querySelector: (sel) => {
      asked.push(sel);
      const m = /^#tll-expert-apply form input#([a-z-]+)$/.exec(sel);
      return (m && page.fields && page.fields.find((f) => f.tag === 'input' && f.id === m[1])) || null;
    },
  };
  const window = {};
  if (observer) window.MutationObserver = function (cb) { this.observe = (node, opts) => observers.push({ cb, node, opts }); };
  new Function('window', 'document', 'location', 'setTimeout', 'MutationObserver', src)(window, document, { pathname }, (fn, ms) => timers.push({ fn, ms }), window.MutationObserver);
  const fire = (type) => listeners.filter((l) => l.type === type).forEach((l) => l.fn({ type }));
  return { page, asked, listeners, timers, observers, fire, mutate: () => observers.forEach((o) => o.cb([], o)) };
}
const writes = (fields) => fields.reduce((n, f) => n + f.writes.length, 0);
const names = (fields) => fields.map((f) => [f.id, f.getAttribute('name'), f.getAttribute('data-name')]);

describe('tll-expert-from-v1 field names on the Location Expert form', () => {
  it('before: the published form sends one "Field" key and the links answer replaces the name', () => {
    const c = collect(published());
    expect(Object.keys(c)).toEqual(['Field', 'email', 'city-country', 'years-there', 'local-truth', 'age-and-terms']);
    expect(c.Field).toBe('a blog');
  });

  it('gives #le-name and #le-links their own names, as name and as data-name', () => {
    const r = run('/for-expats'); const f = r.page.fields;
    expect(names(f).filter((x) => x[0] === 'le-name' || x[0] === 'le-links')).toEqual([
      ['le-name', 'name-or-pen-name', 'name-or-pen-name'], ['le-links', 'published-links', 'published-links']]);
    const c = collect(f);
    expect(Object.keys(c)).toEqual(['name-or-pen-name', 'email', 'city-country', 'years-there', 'local-truth', 'published-links', 'age-and-terms']);
    expect([c['name-or-pen-name'], c['published-links']]).toEqual(['A Name', 'a blog']);
    expect(c).not.toHaveProperty('Field');
  });

  it('writes name and data-name only, on those two inputs only', () => {
    const before = published(); const r = run('/for-expats'); const f = r.page.fields;
    f.forEach((x, i) => {
      const touched = x.id === 'le-name' || x.id === 'le-links';
      expect(x.writes.map((w) => w[0]).sort()).toEqual(touched ? ['data-name', 'name'] : []);
      const rest = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => !touched || (k !== 'name' && k !== 'data-name')));
      expect(rest(x.attrs)).toEqual(rest(before[i].attrs));
    });
    expect(new Set(r.asked)).toEqual(new Set(['#tll-expert-apply form input#le-name', '#tll-expert-apply form input#le-links']));
  });

  it('writes nothing when the page already serves the right names', () => {
    const fields = published({ name: 'name-or-pen-name', nameData: 'name-or-pen-name', links: 'published-links', linksData: 'published-links' });
    const r = run('/for-expats', { fields });
    r.timers.forEach((t) => t.fn()); r.mutate(); r.fire('submit');
    expect(writes(fields)).toBe(0);
  });

  it('fixes one attribute when only one is wrong', () => {
    const fields = published({ name: 'name-or-pen-name', nameData: 'Field', links: 'field', linksData: 'published-links' });
    run('/for-expats', { fields });
    expect(fields[0].writes).toEqual([['data-name', 'name-or-pen-name']]);
    expect(fields[5].writes).toEqual([['name', 'published-links']]);
  });

  it('runs again without writing again (the timer, a page change, a submit)', () => {
    const r = run('/for-expats'); const f = r.page.fields;
    expect(writes(f)).toBe(4);
    r.timers.forEach((t) => t.fn()); r.mutate(); r.mutate(); r.fire('submit');
    expect(writes(f)).toBe(4);
  });

  it('waits for the page when the chunk lands first, and renames as soon as the form is there', () => {
    const r = run('/for-expats', { fields: null, readyState: 'loading' });
    expect(r.observers).toHaveLength(1);
    expect(r.observers[0].node).toEqual({ tag: 'html' });
    expect(r.observers[0].opts).toEqual({ childList: true, subtree: true, attributes: true, attributeFilter: ['name', 'data-name'] });
    r.mutate();
    r.page.fields = published(); r.mutate();
    expect(Object.keys(collect(r.page.fields))).toContain('name-or-pen-name');
    expect(r.listeners.some((l) => l.type === 'DOMContentLoaded')).toBe(true);
  });

  it('without MutationObserver the page-parsed event and the timer still rename', () => {
    const r = run('/for-expats', { fields: null, readyState: 'loading', observer: false });
    r.page.fields = published(); r.fire('DOMContentLoaded');
    expect(Object.keys(collect(r.page.fields))).toContain('published-links');
    r.page.fields = published(); r.timers.forEach((t) => t.fn());
    expect(Object.keys(collect(r.page.fields))).not.toContain('Field');
  });

  it('a form that is drawn again, or has its names put back, is renamed again', () => {
    const r = run('/for-expats');
    r.page.fields = published(); r.mutate();
    expect(Object.keys(collect(r.page.fields))).not.toContain('Field');
    r.page.fields[0].attrs['data-name'] = 'Field'; r.page.fields[0].attrs.name = 'field'; r.mutate();
    expect(names(r.page.fields)[0]).toEqual(['le-name', 'name-or-pen-name', 'name-or-pen-name']);
  });

  it('listens for submit on the document in the capture phase, so a form drawn a moment before it is sent still goes out right', () => {
    const r = run('/for-expats', { observer: false });
    const submit = r.listeners.filter((l) => l.type === 'submit');
    expect(submit).toHaveLength(1);
    expect(submit[0].capture).toBe(true);
    r.page.fields = published(); r.fire('submit');
    const c = collect(r.page.fields);
    expect([c['name-or-pen-name'], c['published-links'], 'Field' in c]).toEqual(['A Name', 'a blog', false]);
  });

  it('does nothing on other pages', () => {
    for (const p of ['/', '/for-press', '/for-expats/denmark', '/submit']) {
      const r = run(p);
      expect([writes(r.page.fields), r.listeners.length, r.observers.length, r.timers.length, r.asked.length]).toEqual([0, 0, 0, 0, 0]);
    }
    expect(writes(run('/for-expats/').page.fields)).toBe(4);
  });
});

describe('tll-expert-from-v1 "Where you are from" (unchanged by the rename)', () => {
  it('still adds the from-country field once, built from the years field', () => {
    const made = (extraAttrs = {}) => { const a = { ...extraAttrs }; return { attrs: a, removed: [], setAttribute(k, v) { a[k] = v; }, removeAttribute(k) { delete a[k]; this.removed.push(k); } }; };
    const lab = made({ for: 'le-years' }); const inp = made({ required: '' }); inp.id = 'le-years'; inp.name = 'years-there'; inp.value = 'x';
    const wrap = { querySelector: (s) => (s === 'label' ? lab : s === 'input' ? inp : null) };
    const grid = { added: [], appendChild(n) { this.added.push(n); } };
    const model = { cloneNode: () => wrap };
    const extra = { 'le-city': { closest: (s) => (s === '.tllpr-grid' ? grid : null), parentElement: model }, 'le-years': { parentElement: model } };
    const r = run('/for-expats', { extra });
    expect(grid.added).toEqual([wrap]);
    expect([inp.id, inp.name, inp.attrs['data-name'], inp.value, inp.removed, lab.attrs.for, lab.textContent]).toEqual(
      ['le-from', 'from-country', 'from-country', '', ['required'], 'le-from', 'Where you are from (optional)']);
    extra['le-from'] = inp; r.timers.forEach((t) => t.fn());
    expect(grid.added).toHaveLength(1);
    expect(writes(r.page.fields)).toBe(4);
  });
});
