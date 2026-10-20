// M1 to M4 (Nancy, 20 Oct 2026: adding and removing places was not intuitive). The map popup and the Stamp it picker use one
// set of words, report what really happened to the save, and offer Undo. These checks read the shipped files as text.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const bundle = readFileSync(new URL('../map-2.0/dist/tll-map-layers.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../map-2.0/dist/tll-map-layers.css', import.meta.url), 'utf8');
const picker = readFileSync(new URL('../src/pages/the-map/after-2026-10-20/embed-0afcf1f8-tll-mp3-depth-pick-v1.html', import.meta.url), 'utf8');

describe('one set of words (M1)', () => {
  it('the map popup says Remove, never Clear or Not yet', () => {
    expect(bundle).toContain('class="tllm-pop-clear">Remove</button>');
    expect(bundle).toContain("cl.textContent = 'Remove';");
    expect(bundle).not.toMatch(/>Clear<|'Clear'|'CLEARED'/);
  });
  it('the Stamp it picker offers Lived, Stayed, Layover only and Remove', () => {
    expect(picker).toContain("[['lived','Lived'],['visited','Stayed'],['layover','Layover only'],['','Remove']]");
    expect(picker).not.toMatch(/'Not yet'|\['layover','Layover'\]/);
  });
  it('Remove shows only on a place that is logged', () => {
    expect(picker).toContain("if(k===''){ x.hidden=!state.cur; }");
  });
});

describe('save status, help and undo (M2 to M4)', () => {
  it('the help line sits in the bar above the map', () => {
    expect(bundle).toContain('Tap a country and pick how deep you went. Tap it again to change it or remove it. Saves on its own.');
  });
  it('the save reports each outcome', () => {
    for (const phase of ["saveEvent('saving')", "saveEvent('signedout')", "saveEvent('error')", "saveEvent('saved', t)", "saveEvent('unchanged')"]) {
      expect(bundle).toContain(phase);
    }
    expect(bundle).toContain('Not saved. Log in to save your map.');
    expect(bundle).toContain('Not saved. Check your connection.');
  });
  it('edits go through the reporting save, and the picker uses the shared editor', () => {
    expect(bundle).toMatch(/pushMemberstack\(raw\); \/\/ 20 Oct 2026 \(M2\)/);
    expect(bundle).toContain('window.TLLMapEdit = {');
    expect(picker).toContain('if(window.TLLMapEdit){ window.TLLMapEdit.set(id,key,name); return; }');
  });
  it('undo lasts ten seconds and Try again exists', () => {
    expect(bundle).toContain('undoTimer = setTimeout(function () { undoBtn.hidden = true; }, 10000);');
    expect(picker).toContain("undoT=setTimeout(function(){ undo.hidden=true; },10000);");
    expect(bundle).toContain("'Try again'");
  });
  it('new text stays at 12px or larger', () => {
    const sizes = [...css.matchAll(/\.tllm-saved-(?:help|e)\{[^}]*?(\d+)px/g)].map((m) => Number(m[1]));
    expect(sizes.length).toBe(2);
    sizes.forEach((n) => expect(n).toBeGreaterThanOrEqual(12));
  });
});
