// Countries named in a story's byline line ("CHILE AND ARGENTINA",
// "KING GEORGE ISLAND, ANTARCTICA"), for adding a published story to its
// author's map. Country names and aliases only, never demonyms or cities: a
// byline names places, and a city match would put a pin on the wrong guess.

import { COUNTRY_TERMS } from './gazetteer.js';
import { normalizeForMatch } from './tagger.js';

// Places a travel byline can name that the news gazetteer has no reason to carry.
const EXTRA_TERMS = { AQ: 'Antarctica' };

// Demonyms end in these; they describe people, not a place someone went.
const DEMONYM = /(ian|ean|ese|ish|ic|i|an|er)$/;

function buildNameIndex() {
  const entries = [];
  for (const [code, terms] of Object.entries({ ...COUNTRY_TERMS, ...EXTRA_TERMS })) {
    terms.split('|').forEach((term, position) => {
      const normalized = normalizeForMatch(term);
      if (!normalized) return;
      // The first term is always the country name. Later single-word terms that
      // look like demonyms ("Chilean", "Danish") are dropped.
      if (position > 0 && !normalized.includes(' ') && DEMONYM.test(normalized)) return;
      entries.push({ code, term: normalized });
    });
  }
  // Longest first, so "papua new guinea" is consumed before "guinea".
  return entries.sort((a, b) => b.term.length - a.term.length);
}

const NAME_INDEX = buildNameIndex();

/** @returns {string[]} ISO alpha-2 codes in the order they appear, de-duplicated. */
export function countriesInByline(text) {
  let haystack = ` ${normalizeForMatch(text)} `;
  if (!haystack.trim()) return [];
  const found = [];
  for (const { code, term } of NAME_INDEX) {
    const needle = ` ${term} `;
    const at = haystack.indexOf(needle);
    if (at === -1) continue;
    if (!found.some((hit) => hit.code === code)) found.push({ code, at });
    haystack = haystack.replace(needle, ' '.repeat(needle.length));
  }
  return found.sort((a, b) => a.at - b.at).map((hit) => hit.code);
}
