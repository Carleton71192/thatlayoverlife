// TLL shareables · counting engine (REQUIREMENTS G01, G02; SHAREABLES-SPEC §3).
//
// One shared module for every card and for /p/. It reads a member's tllStates
// (v2: { v: 2, travelers: [...], states: { '208': { t1: 'lived' } } }, see
// src/map-merge.js), cleans it, and turns it into the numbers a card prints.
//
// Honesty rules baked in:
//  - Airside never counts. It rides along as a flex chip.
//  - Bonus places (non-UN) never enter the UN numerator; they are a chip.
//  - Non-ISO keys (the "undefined" entry) are dropped before any count.
//  - Nothing here invents a number: no key, no count.
//
// Decisions still with Nancy (STATUS I05, I06, I07) are options with the
// recommended default, so the default can change in one place.

import { NUMERIC_TO_ALPHA2 } from '../iso-numeric.js';
import { regionForCountry } from '../regions.js';

/** Tier ladder, lowest to highest. `airside` never counts. */
export const TIERS = Object.freeze(['airside', 'escaped', 'fed', 'slept', 'lived']);
export const TIER_RANK = Object.freeze(Object.fromEntries(TIERS.map((t, i) => [t, i])));

/** Legacy tllStates values and where they land on the ladder. `layover` is I07 (default escaped). */
const LEGACY = Object.freeze({ visited: 'escaped', lived: 'lived' });

/** Headline bases. Nancy picks one (I05); `un` is the recommended default. */
export const BASES = Object.freeze({
  un: { key: 'un', den: 193, label: 'OF 193 UN STATES', word: 'UN states', chipSuffix: ' UN' },
  tll: { key: 'tll', den: 195, label: 'OF 195 · TLL CLASSIC BASE', word: 'countries (TLL classic)', chipSuffix: '' },
  been: { key: 'been', den: 250, label: 'OF 250 COUNTRIES + TERRITORIES', word: 'countries and territories', chipSuffix: '' },
});
export const DEFAULT_BASE = 'un';

/** Tier names by count (I06, sample names from the spec). Below 10 is "Boarding". */
export const TIER_LADDER = Object.freeze([
  [193, 'UN-Done'], [100, 'Centurion'], [50, 'Half the Stamps'], [25, 'Checked Bag'], [10, 'Carry-On'], [0, 'Boarding'],
]);

// Codes in the map's table that are not UN member states. Everything else in the table is.
const NON_UN = new Set(['248', '016', '660', '010', '533', '060', '184', '238', '234', '254', '258', '292', '304', '344', '446', '540', '570', '630', '638', '275', '772', '732', '531', '158']);
// TLL classic 195 = UN 193 + Vatican City + Palestine. The map has no Vatican shape, so only Palestine can ever be logged.
const TLL_EXTRA = new Set(['336', '275']);

export const UN_CODES = Object.freeze(Object.keys(NUMERIC_TO_ALPHA2).filter((c) => !NON_UN.has(c)));

const SOUTH_AMERICA = new Set('AR BO BR CL CO EC FK GF GY PE PY SR UY VE'.split(' '));
export const CONTINENTS = Object.freeze(['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']);

/** 7-continent model from the site's six travel regions. Antarctica is its own continent. */
export function continentFor(numeric) {
  const a2 = NUMERIC_TO_ALPHA2[numeric];
  if (!a2) return null;
  if (a2 === 'AQ') return 'Antarctica';
  const region = regionForCountry(a2);
  if (region === 'EUROPE') return 'Europe';
  if (region === 'ASIA' || region === 'MIDDLE EAST') return 'Asia';
  if (region === 'AFRICA') return 'Africa';
  if (region === 'OCEANIA') return 'Oceania';
  if (region === 'AMERICAS') return SOUTH_AMERICA.has(a2) ? 'South America' : 'North America';
  return null;
}

export function isIsoKey(key) {
  return typeof key === 'string' && /^\d{3}$/.test(key) && Object.prototype.hasOwnProperty.call(NUMERIC_TO_ALPHA2, key);
}

/**
 * Normalizes one stored tier value to the ladder. Unknown values return null
 * (and are ignored), never guessed.
 * @param {string} value stored value: airside|escaped|fed|slept|lived or legacy visited|lived|layover
 * @param {{layoverAs?: string}} [opts] I07: what a legacy "layover" means. Default escaped.
 */
export function normalizeTier(value, opts = {}) {
  if (typeof value !== 'string') return null;
  const v = value.toLowerCase().trim();
  if (TIER_RANK[v] !== undefined) return v;
  if (v === 'layover') return opts.layoverAs === 'airside' ? 'airside' : 'escaped';
  return LEGACY[v] || null;
}

/**
 * G02 data hygiene. Returns a fresh states map with only ISO numeric keys and
 * only normalized tier values. Drops the "undefined" entry and any junk.
 * @returns {{states: Record<string, Record<string,string>>, dropped: string[]}}
 */
export function cleanStates(tllStates, opts = {}) {
  const src = tllStates && tllStates.v === 2 && tllStates.states ? tllStates.states : (tllStates && typeof tllStates === 'object' && !tllStates.v ? tllStates : {});
  const states = {};
  const dropped = [];
  for (const [key, entry] of Object.entries(src || {})) {
    if (!isIsoKey(key)) { dropped.push(String(key)); continue; }
    const out = {};
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
      for (const [traveler, value] of Object.entries(entry)) {
        const tier = normalizeTier(value, opts);
        if (tier) out[traveler] = tier;
      }
    } else if (typeof entry === 'string' || Array.isArray(entry)) {
      // pre-v2 shape: 'visited' or ['visited','magnus']
      const marks = typeof entry === 'string' ? [entry] : entry;
      const own = marks.map((m) => normalizeTier(m, opts)).find(Boolean);
      if (own) out.t1 = own;
      if (marks.includes('magnus')) out.t2 = 'escaped';
    }
    if (Object.keys(out).length) states[key] = out;
    else dropped.push(key);
  }
  return { states, dropped };
}

function floor10(n) { return Math.floor(n / 10) * 10; }

/** Ranges option: 62 → "60+", 7 → "Under 10", 32% → "30%+". */
export function rangeText(n, ranges) {
  if (!ranges) return String(n);
  return n < 10 ? 'Under 10' : `${floor10(n)}+`;
}

export function tierNameFor(count) {
  for (const [min, name] of TIER_LADDER) if (count >= min) return name;
  return TIER_LADDER[TIER_LADDER.length - 1][1];
}

/**
 * The numbers one card prints for one traveler.
 * @param {object} tllStates the member's tllStates (any version), or a cleaned states map
 * @param {object} [opts]
 * @param {'un'|'tll'|'been'} [opts.base] headline base (I05). Default un.
 * @param {string} [opts.travelerId] which traveler to count. Default: the first non-pet traveler, else 't1'.
 * @param {boolean} [opts.ranges] print 60+ / 30%+ instead of exact numbers.
 * @param {'escaped'|'airside'} [opts.layoverAs] I07 migration of legacy "layover". Default escaped.
 */
export function countFor(tllStates, opts = {}) {
  const base = BASES[opts.base] || BASES[DEFAULT_BASE];
  const ranges = !!opts.ranges;
  const travelers = tllStates && tllStates.v === 2 && Array.isArray(tllStates.travelers) ? tllStates.travelers : [];
  const travelerId = opts.travelerId || (travelers.find((t) => !t.pet) || travelers[0] || { id: 't1' }).id;
  const { states, dropped } = cleanStates(tllStates, opts);

  const counted = [];   // codes in the numerator
  const bonus = [];     // non-base places that would count under a wider base
  const airside = [];   // seen through glass
  const tiers = {};     // code → tier for counted + bonus
  for (const [code, entry] of Object.entries(states)) {
    const tier = entry[travelerId];
    if (!tier) continue;
    if (tier === 'airside') { airside.push(code); continue; }
    tiers[code] = tier;
    const inBase = base.key === 'un' ? UN_CODES.includes(code)
      : base.key === 'tll' ? (UN_CODES.includes(code) || TLL_EXTRA.has(code))
      : true;
    if (inBase) counted.push(code); else bonus.push(code);
  }
  counted.sort(); bonus.sort(); airside.sort();

  const n = counted.length;
  const pct = Math.round((n / base.den) * 100);
  const continents = new Set();
  for (const code of counted.concat(bonus)) { const c = continentFor(code); if (c) continents.add(c); }
  const highest = Object.values(tiers).reduce((best, t) => (TIER_RANK[t] > TIER_RANK[best] ? t : best), 'escaped');
  const lived = Object.entries(tiers).filter(([, t]) => t === 'lived').map(([c]) => c);

  const countStr = rangeText(n, ranges);
  const pctNum = ranges ? String(floor10(pct)) : String(pct);
  const pctSuffix = ranges ? '%+' : '%';

  return {
    base: base.key, den: base.den, denLabel: base.label, baseWord: base.word,
    travelerId, counted, bonus, airside, lived, tiers, dropped,
    n, pct, continents: CONTINENTS.filter((c) => continents.has(c)),
    highestTier: n || bonus.length ? highest : null,
    tierName: tierNameFor(n), ranges,
    countStr, pctNum, pctSuffix, pctStr: pctNum + pctSuffix,
    chips: {
      count: `${countStr}/${base.den}${base.chipSuffix}`,
      bonus: base.key === 'un' ? (bonus.length ? `+${bonus.length} BONUS PLACE${bonus.length === 1 ? '' : 'S'}` : null) : (bonus.length ? 'BONUS PLACES COUNTED IN' : null),
      continents: `${continents.size}/7 CONTINENTS`,
      airside: airside.length ? (ranges ? '+ A FEW COUNTRIES SEEN THROUGH GLASS' : `+${airside.length} COUNTR${airside.length === 1 ? 'Y' : 'IES'} SEEN THROUGH GLASS`) : null,
      tickLeft: `${countStr} STAMPED`,
      tickRight: ranges ? 'THE REST TO GO' : `${base.den - n} TO GO`,
    },
  };
}

/**
 * Countries added in a given year for a traveler, from tllStatesAt-style
 * history if the map ever stores it. The map today stores no dates, so this
 * returns null (unknown) rather than 0, and cards fall back to lifetime.
 */
export function newThisYear(/* tllStates, travelerId, year */) {
  return null;
}
