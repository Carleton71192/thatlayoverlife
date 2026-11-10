// tll-travelers-fix-v1 (the /travelers chunk) is a browser script, so this test reads its source and lifts the one pure function,
// tally(), that feeds the N CARDS line and the search note (10 Nov 2026, fix sequence Prompt 2 item 9: results must match the
// pressed chip and the search box). The numbers it is given come from the cards in the DOM; this checks the text it makes of them.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'site-layers', 'tll-travelers-fix-v1.js'), 'utf8');

function lift(name) {
  const m = new RegExp(`function ${name}\\([^)]*\\)\\{[\\s\\S]*?\\n(?=(?:var|function|/\\*) )`).exec(src);
  if (!m) throw new Error(`${name}() not found in the layer`);
  return new Function(`${m[0]}; return ${name};`)();
}

describe('tll-travelers-fix-v1 tally (the count line and the search note)', () => {
  const tally = lift('tally');

  it('outside a search the line counts the pressed chip and the note stays empty', () => {
    expect(tally(8, 8, 1, false)).toEqual({ line: '8 CARDS', matches: 0, searching: false });
    expect(tally(1, 1, 1, false)).toEqual({ line: '1 CARD', matches: 0, searching: false });
    expect(tally(0, 0, 0, false)).toEqual({ line: '0 CARDS', matches: 0, searching: false });
  });

  it('a search that finds only a pet says so on the line and counts it in the note', () => {
    // before: the line read "0 OF 8" beside the page note "1 match."
    expect(tally(0, 8, 1, true)).toEqual({ line: '0 OF 8 · 1 PET', matches: 1, searching: true });
  });

  it('a search under a people chip still counts a visible pet (the note no longer says Nobody)', () => {
    expect(tally(0, 2, 1, true)).toEqual({ line: '0 OF 2 · 1 PET', matches: 1, searching: true });
    expect(tally(0, 2, 2, true).line).toBe('0 OF 2 · 2 PETS');
  });

  it('a search with no pet match keeps the plain line', () => {
    expect(tally(2, 8, 0, true)).toEqual({ line: '2 OF 8', matches: 2, searching: true });
    expect(tally(0, 8, 0, true)).toEqual({ line: '0 OF 8', matches: 0, searching: true });
  });
});

describe('tll-travelers-fix-v1 source (house rules)', () => {
  const copy = src.replace(/\/\*[\s\S]*?\*\//g, '');
  it('never types a count: every count string is built from a number read off the cards', () => {
    // The only literal digits allowed are CSS values and timings, never a card count next to CARD, CARDS, OF, PET or match.
    expect(copy).not.toMatch(/['"]\s*\d+\s+(?:CARDS?|OF|PETS?|match(?:es)?\.)/);
  });
  it('no em dashes, no exclamation marks in copy, no banned words', () => {
    expect(copy).not.toMatch(/—/);
    expect(copy).not.toMatch(/[A-Za-z]!['"]/);
    expect(copy).not.toMatch(/\b(ships?|ledger|no filler|truth over polish)\b/i);
  });
  it('reads the chip markers through the Webflow hidden class, not by presence alone', () => {
    expect(src).toMatch(/data-tv-on=.+w-condition-invisible/);
  });
});
