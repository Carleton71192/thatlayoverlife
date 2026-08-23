import { describe, expect, it } from 'vitest';
import { tagItem } from '../src/tagger.js';
import { COUNTRY_TO_REGION, normalizeRegion, regionForCountry } from '../src/regions.js';
import { COUNTRY_TERMS } from '../src/gazetteer.js';

const tag = (title, summary = '') => tagItem({ title, summary });

describe('tagItem', () => {
  it('tags a city to its country and region', () => {
    expect(tag('Doha extends free transit visas')).toEqual({ region: 'MIDDLE EAST', country: 'QA' });
    expect(tag('Nice airport reopens after strike')).toEqual({ region: 'EUROPE', country: 'FR' });
    expect(tag('BA adds a third daily flight to Cape Town')).toEqual({ region: 'AFRICA', country: 'ZA' });
  });

  it('tags a country name', () => {
    expect(tag('Bulgaria joins the Schengen zone in full')).toEqual({ region: 'EUROPE', country: 'BG' });
    expect(tag('Turkey lifts its visa requirement')).toEqual({ region: 'EUROPE', country: 'TR' });
  });

  it('prefers the title over the summary', () => {
    expect(tag('Japan reopens a rail line', 'Travellers from Brazil are expected.')).toEqual({
      region: 'ASIA',
      country: 'JP',
    });
  });

  it('prefers the longest matching phrase', () => {
    expect(tag('Latin America braces for a busy season')).toEqual({ region: 'AMERICAS', country: null });
    expect(tag('New Delhi tightens airport security')).toEqual({ region: 'ASIA', country: 'IN' });
    expect(tag('American Samoa restores its ferry link')).toEqual({ region: 'OCEANIA', country: 'AS' });
  });

  it('tags a region when no country is named', () => {
    expect(tag('Middle East carriers post record profits')).toEqual({ region: 'MIDDLE EAST', country: null });
    expect(tag('Southeast Asia sees record arrivals')).toEqual({ region: 'ASIA', country: null });
  });

  it('falls back to GLOBAL when nothing matches', () => {
    expect(tag('Ryanair cuts its winter schedule')).toEqual({ region: 'GLOBAL', country: null });
    expect(tag('')).toEqual({ region: 'GLOBAL', country: null });
  });

  it('ignores ambiguous words that are not capitalized', () => {
    expect(tag('Airlines add capacity for the Thanksgiving turkey rush')).not.toMatchObject({ country: 'TR' });
    expect(tag('A nice weekend for rail travel')).toEqual({ region: 'GLOBAL', country: null });
  });

  it('ignores place words inside brand names', () => {
    // Seen live on The Points Guy: these were landing in AMERICAS/US.
    expect(tag('American Express Membership Rewards: how to earn and transfer')).toEqual({
      region: 'GLOBAL',
      country: null,
    });
    expect(tag('The best time to apply for these popular American Express cards')).toEqual({
      region: 'GLOBAL',
      country: null,
    });
    expect(tag('Bank of America adds a new lounge benefit')).toEqual({ region: 'GLOBAL', country: null });
  });

  it('still reads a country inside an airline name', () => {
    // Deliberate: a Japan Airlines story is usually about Japan.
    expect(tag('Japan Airlines orders more widebodies')).toEqual({ region: 'ASIA', country: 'JP' });
    expect(tag('American Airlines adds a route to Naples')).toEqual({ region: 'AMERICAS', country: 'US' });
  });

  it('ignores place words used as personal names', () => {
    expect(tag('Michael Jordan opens a hotel')).toEqual({ region: 'GLOBAL', country: null });
    expect(tag('Amman, Jordan adds a low-cost base')).toEqual({ region: 'MIDDLE EAST', country: 'JO' });
  });

  it('still tags title-case headlines', () => {
    expect(tag('Turkey Lifts Visa Requirement For Six Countries')).toEqual({ region: 'EUROPE', country: 'TR' });
  });

  it('reads accented place names', () => {
    expect(tag('São Paulo airport adds a runway')).toEqual({ region: 'AMERICAS', country: 'BR' });
    expect(tag('Zürich hotel rates climb')).toEqual({ region: 'EUROPE', country: 'CH' });
  });

  it('reads uppercase ISO codes but not lookalike words', () => {
    expect(tag('Flights to BG resume this week')).toEqual({ region: 'EUROPE', country: 'BG' });
    expect(tag('IT teams brace for outage')).toEqual({ region: 'GLOBAL', country: null });
  });

  it('only emits known regions and alpha-2 codes', () => {
    const result = tag('Kigali adds a second terminal');
    expect(regionForCountry(result.country)).toBe(result.region);
    expect(result.country).toMatch(/^[A-Z]{2}$/);
  });
});

describe('regions', () => {
  it('maps every gazetteer country to a region', () => {
    for (const code of Object.keys(COUNTRY_TERMS)) {
      expect(COUNTRY_TO_REGION[code], `${code} has no region`).toBeTruthy();
    }
  });

  it('normalizes region query values', () => {
    expect(normalizeRegion('middle-east')).toBe('MIDDLE EAST');
    expect(normalizeRegion('  europe ')).toBe('EUROPE');
    expect(normalizeRegion('atlantis')).toBeNull();
  });

  it('falls back to GLOBAL for an unknown country', () => {
    expect(regionForCountry(null)).toBe('GLOBAL');
    expect(regionForCountry('ZZ')).toBe('GLOBAL');
  });
});
