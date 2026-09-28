import { describe, expect, it } from 'vitest';
import { countriesInByline } from '../src/story-countries.js';
import { numericForAlpha2 } from '../src/iso-numeric.js';

describe('countriesInByline', () => {
  it('reads the live bylines', () => {
    expect(countriesInByline('MEXICO')).toEqual(['MX']);
    expect(countriesInByline('CHILE AND ARGENTINA')).toEqual(['CL', 'AR']);
    expect(countriesInByline('KING GEORGE ISLAND, ANTARCTICA')).toEqual(['AQ']);
    expect(countriesInByline('GHANA')).toEqual(['GH']);
  });

  it('adds nothing for a region that is not one country', () => {
    expect(countriesInByline('BALKANS')).toEqual([]);
  });

  it('prefers the longer name', () => {
    expect(countriesInByline('Papua New Guinea')).toEqual(['PG']);
  });

  it('ignores demonyms and empty input', () => {
    expect(countriesInByline('A Chilean evening')).toEqual([]);
    expect(countriesInByline('')).toEqual([]);
    expect(countriesInByline(null)).toEqual([]);
  });
});

describe('numericForAlpha2', () => {
  it('matches the map engine table', () => {
    expect(numericForAlpha2('dk')).toBe('208');
    expect(numericForAlpha2('AQ')).toBe('010');
    expect(numericForAlpha2('ME')).toBe('499');
    expect(numericForAlpha2('XK')).toBeNull();
  });
});
