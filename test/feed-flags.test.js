import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { applyFlags, setEnabled } from '../scripts/lib/feed-flags.mjs';

const SOURCE = readFileSync(new URL('../src/feeds.js', import.meta.url), 'utf8');

describe('setEnabled', () => {
  it('turns a feed on without touching its neighbours', () => {
    const out = setEnabled(SOURCE, 'lonely-planet', true);
    expect(out).toMatch(/id: 'lonely-planet',[\s\S]{0,200}?enabled: true/);
    expect(out).toMatch(/id: 'reuters',[\s\S]{0,200}?enabled: false/);
    expect(out).toMatch(/id: 'skift',[\s\S]{0,200}?enabled: true/);
  });

  it('turns a feed off', () => {
    const out = setEnabled(SOURCE, 'skift', false);
    expect(out).toMatch(/id: 'skift',[\s\S]{0,200}?enabled: false/);
    expect(out).toMatch(/id: 'points-guy',[\s\S]{0,200}?enabled: true/);
  });

  it('is a no-op when the flag already matches', () => {
    expect(setEnabled(SOURCE, 'skift', true)).toBe(SOURCE);
  });

  it('leaves the file otherwise byte-identical', () => {
    const out = setEnabled(SOURCE, 'reuters', true);
    expect(out.length).toBe(SOURCE.length + 'true'.length - 'false'.length);
    expect(setEnabled(out, 'reuters', false)).toBe(SOURCE);
  });

  it('refuses an unknown feed', () => {
    expect(() => setEnabled(SOURCE, 'nope', true)).toThrow(/no feed with id/);
  });

  it('applies several flips at once', () => {
    const out = applyFlags(SOURCE, [
      { id: 'reuters', enabled: true },
      { id: 'ap', enabled: true },
      { id: 'bbc-world', enabled: false },
    ]);
    expect(out).toMatch(/id: 'reuters',[\s\S]{0,200}?enabled: true/);
    expect(out).toMatch(/id: 'ap',[\s\S]{0,200}?enabled: true/);
    expect(out).toMatch(/id: 'bbc-world',[\s\S]{0,300}?enabled: false/);
  });
});
