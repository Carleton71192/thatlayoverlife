// B3 (20 October 2026): the live counting functions in map-2.0/dist/tll-map-layers.js.
// The bundle is plain browser JavaScript with no build step; its TLLMapCounts block is pure and is read here in a
// sandbox (no document, so the map part returns at once).
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const BUNDLE = new URL('../map-2.0/dist/tll-map-layers.js', import.meta.url);
const sandbox = { window: {}, module: { exports: {} } };
runInNewContext(readFileSync(BUNDLE, 'utf8'), sandbox);
const K = sandbox.window.TLLMapCounts;

// Nancy's saved map as read on 7 October 2026 (map-2.0/source/member-states.json), rebuilt as tllStates v2.
const saved = JSON.parse(readFileSync(new URL('../map-2.0/source/member-states.json', import.meta.url), 'utf8'));
function nancyRecord() {
  const states = {};
  for (const [k, v] of Object.entries(saved.me)) states[k] = { t1: v };
  for (const [k, v] of Object.entries(saved.magnus)) (states[k] = states[k] || {}).t2 = v;
  return { v: 2, travelers: [{ id: 't1', name: 'Me', pet: false }, { id: 't2', name: 'Magnus Waffles', pet: true }], states };
}

describe('geography tables', () => {
  it('holds 249 ISO codes plus Kosovo, 193 UN members, 195 with the two observers', () => {
    expect(K.isoCount).toBe(250);
    expect(K.unCount).toBe(193);
    expect(K.unObserverCount).toBe(195);
    expect(K.isUNorObserver('336')).toBe(true);
    expect(K.isUNorObserver('275')).toBe(true);
    expect(K.isUN('275')).toBe(false);
  });
  it('places every entry on one of seven continents', () => {
    expect(K.continentOf('010')).toBe('Antarctica');
    expect(K.continentOf('840')).toBe('North America');
    expect(K.continentOf('076')).toBe('South America');
    expect(K.continentOf('554')).toBe('Oceania');
    expect(K.continentOf('undefined')).toBe('Europe');
    expect(K.continentOf('XK')).toBe('Europe');
    expect(K.continentOf('900')).toBe('Europe');
  });
});

describe("Nancy's saved map (7 October 2026)", () => {
  const r = K.countRecord(nancyRecord());
  it('counts places, countries, layovers and continents', () => {
    expect(r.places).toBe(85);
    expect(r.countries).toBe(84);
    expect(r.antarctica).toBe(true);
    expect(r.layovers).toBe(2); // Taiwan and the Dominican Republic
    expect(r.lived).toBe(5);
    expect(r.stayed).toBe(80);
    expect(r.continents).toHaveLength(7);
  });
  it('counts the rulebooks', () => {
    expect(r.codes).toBe(85); // of 249
    expect(r.un).toBe(82); // of 193; Antarctica, New Caledonia and Kosovo are places but not UN members
    expect(r.unObservers).toBe(82); // of 195
    expect(r.placeIsos.filter((i) => !K.isUN(i))).toEqual(['010', '540', '900']);
  });
  it('keeps Magnus apart', () => {
    expect(r.pets).toEqual([{ id: 't2', name: 'Magnus Waffles', places: 14 }]);
  });
});

describe('counting rules', () => {
  const travelers = [{ id: 't1', name: 'Me' }, { id: 't2', name: 'Pet', pet: true }];
  it('never counts a pet-only state', () => {
    const r = K.countRecord({ v: 2, travelers, states: { 208: { t2: 'lived' }, 752: { t2: 'visited' } } });
    expect(r.places).toBe(0);
    expect(r.countries).toBe(0);
    expect(r.pets[0].places).toBe(2);
  });
  it('counts Antarctica in places, not countries', () => {
    const r = K.countRecord({ v: 2, travelers, states: { '010': { t1: 'visited' }, 208: { t1: 'lived' } } });
    expect(r.places).toBe(2);
    expect(r.countries).toBe(1);
    expect(r.antarctica).toBe(true);
    expect(r.continents).toEqual(['Antarctica', 'Europe']);
    expect(r.un).toBe(1);
  });
  it('counts layovers apart and takes the best depth of anyone on the account', () => {
    const two = [{ id: 't1', name: 'Me' }, { id: 't3', name: 'Partner' }];
    const r = K.countRecord({ v: 2, travelers: two, states: { 158: { t1: 'layover' }, 840: { t1: 'layover', t3: 'visited' } } });
    expect(r.layovers).toBe(1);
    expect(r.places).toBe(1);
    expect(r.best['840']).toBe('visited');
  });
  it('reads Kosovo once whatever key an older record used', () => {
    const r = K.countRecord({ v: 2, travelers, states: { undefined: { t1: 'visited' }, XK: { t1: 'lived' } } });
    expect(r.places).toBe(1);
    expect(r.best['900']).toBe('lived');
    expect(r.un).toBe(0);
    expect(r.codes).toBe(1);
  });
  it('gives nothing for a record that is not tllStates v2', () => {
    expect(K.countRecord(null).ok).toBe(false);
    expect(K.countRecord({ v: 1, states: {} }).places).toBe(0);
  });
});

describe('the logbook', () => {
  it('counts cities, airports, US parks and parks everywhere', () => {
    const log = { v: 1, parks: [{ n: 'Torres del Paine', at: 1 }], cities: [{ n: 'Lisbon', at: 1 }, { n: 'lisbon ', at: 2 }, { n: 'Accra', at: 3 }], airports: [{ n: 'CPH', at: 1 }] };
    const parks = { v: 1, parks: { ACAD: 1, ARCH: 2 } };
    expect(K.countLogbook(log, parks)).toEqual({ ok: true, cities: 2, airports: 1, usParks: 2, parksEverywhere: 3 });
  });
  it('reports no logbook as not ok', () => {
    expect(K.countLogbook(null, null).ok).toBe(false);
  });
});

describe('lines and extremes, by country', () => {
  const C = { 208: [10, 56], 76: [-52, -10], 554: [172, -41], 840: [-98, 39], 242: [181.5, -17.8] };
  const at = (iso) => C[+iso] || null;
  it('finds four hemispheres and both lines when countries sit on both sides', () => {
    const x = K.lines(['208', '076', '554', '840'], at);
    expect(x.hemispheres).toEqual(['N', 'S', 'E', 'W']);
    expect(x.hemisphereCount).toBe(4);
    expect(x.equator).toBe(true);
    expect(x.meridian).toBe(true);
    expect(x.north.iso).toBe('208');
    expect(x.south.iso).toBe('554');
    expect(x.east.iso).toBe('554');
    expect(x.west.iso).toBe('840');
  });
  it('does not cross the equator with northern countries only', () => {
    const x = K.lines(['208', '840'], at);
    expect(x.equator).toBe(false);
    expect(x.meridian).toBe(true);
    expect(x.hemispheres).toEqual(['N', 'E', 'W']);
  });
  it('wraps a shape drawn past 180 back into range', () => {
    const x = K.lines(['242'], at);
    expect(x.west.lon).toBeCloseTo(-178.5);
  });
});

describe('dates', () => {
  it('writes day month year with no comma', () => {
    expect(K.dateLabel(new Date(2026, 9, 19, 12).getTime())).toBe('19 October 2026');
    expect(K.dateLabel(String(new Date(2026, 9, 19, 12).getTime()))).toBe('19 October 2026');
    expect(K.dateLabel(null)).toBe('');
  });
});
