// tll-label-for-v1 (the /for-expats chunk; sweep of 21 Nov, item A07). The /for-expats labels carry an empty for="", so the
// consent sentences do not tick their boxes and the boxes have no accessible name. The layer points each such label at the first
// field inside it, when that field's id is its own, and leaves Memberstack forms, named labels and other pages alone.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from './mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'site-layers', 'tll-label-for-v1.js'), 'utf8');

// The markup as /for-expats serves it (plain GET of 21 Nov), trimmed to the two forms' labels.
const PAGE = '<form data-name="location-expert"><label for="le-pitch" class="tllpr-lbl">The local truth</label><textarea id="le-pitch"></textarea>'
  + '<label for="" class="tllpr-check"><label class="w-checkbox"><input type="checkbox" id="checkbox" name="age-and-terms" required class="w-checkbox-input"></label>I am 16 or older.</label></form>'
  + '<form data-name="Expat group listing"><label for="" data-tll-x="field">YOUR EMAIL<input type="email" id="xg-email" name="email"></label>'
  + '<label for="" data-tll-x="check"><label class="w-checkbox"><input type="checkbox" id="xg-check" name="runs-group-and-open" required></label>I run or co-run this group.</label></form>';

function page(pathname, html = PAGE) { const dom = createDom({ pathname, html }); dom.run(src); return dom; }
const fors = (dom) => [...dom.document.querySelectorAll('label')].map((l) => l.getAttribute('for'));

describe('tll-label-for-v1 (A07)', () => {
  it('points each empty-for label at the field inside it', () => {
    const dom = page('/for-expats');
    expect(fors(dom)).toEqual(['le-pitch', 'checkbox', null, 'xg-email', 'xg-check', null]);
  });
  it('a tap on the consent sentence then reaches the box (the label names it)', () => {
    const dom = page('/for-expats/');
    const outer = dom.document.querySelector('label.tllpr-check');
    expect(dom.document.getElementById(outer.getAttribute('for')).getAttribute('name')).toBe('age-and-terms');
  });
  it('changes no id, name or other attribute of the fields', () => {
    const dom = page('/for-expats');
    const box = dom.document.getElementById('xg-check');
    expect([box.id, box.getAttribute('name'), box.hasAttribute('required')]).toEqual(['xg-check', 'runs-group-and-open', true]);
  });
  it('skips a field whose id is not its own (a duplicate id earlier on the page)', () => {
    const dom = page('/for-expats', '<input id="dup"><form><label for="">Name<input id="dup" name="n"></label></form>');
    expect(dom.document.querySelector('form label').getAttribute('for')).toBe('');
  });
  it('skips Memberstack forms', () => {
    const dom = page('/for-expats', '<form data-ms-form="signup"><label for="">Name<input id="nm" name="n"></label></form>');
    expect(dom.document.querySelector('label').getAttribute('for')).toBe('');
  });
  it('does nothing on other pages', () => {
    const dom = page('/share-photos');
    expect(fors(dom)).toEqual(['le-pitch', '', null, '', '', null]);
  });
});
