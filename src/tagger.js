// Region + country tagging by keyword match against the gazetteer.
//
// Strategy: normalize title + summary, walk every 1-to-4 word window, and look
// each window up in a prebuilt term index. Longest match wins, and a match in
// the title outranks a match in the summary. Ambiguous terms ("Turkey", "Nice")
// only count when the source text capitalized them.

import {
  AMBIGUOUS_TERMS,
  CITY_TERMS,
  CODE_STOPLIST,
  COUNTRY_TERMS,
  REGION_TERMS,
} from './gazetteer.js';
import { GLOBAL, regionForCountry } from './regions.js';

const MAX_PHRASE_WORDS = 4;

/** Lowercase, drop accents, and reduce anything that is not a letter or digit to a space. */
export function normalizeForMatch(input) {
  return (input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function addTerm(index, term, entry) {
  const key = normalizeForMatch(term);
  if (!key) return;
  const words = key.split(' ').length;
  if (words > MAX_PHRASE_WORDS) return;
  const existing = index.get(key);
  // A country name beats a city name beats a bare region word at equal length.
  if (existing && existing.rank >= entry.rank) return;
  index.set(key, { ...entry, words });
}

function buildIndex() {
  const index = new Map();
  for (const [region, terms] of Object.entries(REGION_TERMS)) {
    for (const term of terms.split('|')) addTerm(index, term, { country: null, region, rank: 1 });
  }
  for (const [code, terms] of Object.entries(CITY_TERMS)) {
    for (const term of terms.split('|')) {
      addTerm(index, term, { country: code, region: regionForCountry(code), rank: 2 });
    }
  }
  for (const [code, terms] of Object.entries(COUNTRY_TERMS)) {
    for (const term of terms.split('|')) {
      addTerm(index, term, { country: code, region: regionForCountry(code), rank: 3 });
    }
  }
  return index;
}

export const TERM_INDEX = buildIndex();

const VALID_CODES = new Set(Object.keys(COUNTRY_TERMS));

// Accent-stripped but case-preserved, so capitalization checks line up with the
// normalized phrases the index stores.
export function normalizeKeepCase(input) {
  return (input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['\u2019]/g, '')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim();
}

// "Turkey" the country is capitalized; "turkey" the bird is not. Each word of the
// term must appear with an uppercase initial and its exact remaining letters.
function appearsCapitalized(term, sourceText) {
  const pattern = term
    .split(' ')
    .map((word) => {
      const head = word[0].toUpperCase();
      const tail = word
        .slice(1)
        .split('')
        .map((ch) => (/[a-z]/.test(ch) ? `[${ch}${ch.toUpperCase()}]` : ch))
        .join('');
      return head + tail;
    })
    .join(' ');
  return new RegExp(`\\b${pattern}\\b`).test(normalizeKeepCase(sourceText));
}

// Terms that are also common given or family names. "Michael Jordan" is not a
// place; "Amman, Jordan" is.
const PERSON_NAME_TERMS = new Set([
  'jordan', 'georgia', 'chad', 'mali', 'darwin', 'salvador', 'phoenix',
  'santiago', 'kingston', 'sandy', 'colombo', 'male', 'grenada', 'dominica',
]);

// Headlines written in title case capitalize everything, which makes "preceded by
// a capitalized word" meaningless as a name signal. Detect that and stand down.
function isTitleCase(sourceText) {
  const words = normalizeKeepCase(sourceText).split(' ').filter((w) => w.length > 3);
  if (words.length < 4) return false;
  const capitalized = words.filter((w) => /^[A-Z]/.test(w)).length;
  return capitalized / words.length > 0.6;
}

function looksLikePersonName(phrase, sourceText, titleCased) {
  if (titleCased || !PERSON_NAME_TERMS.has(phrase)) return false;
  const words = normalizeKeepCase(sourceText).split(' ');
  const target = phrase.split(' ')[0].toLowerCase();
  for (let i = 1; i < words.length; i += 1) {
    if (words[i].toLowerCase() !== target) continue;
    const before = words[i - 1];
    // A capitalized word in front that is not itself a place reads as a name.
    if (/^[A-Z]/.test(before) && !TERM_INDEX.has(normalizeForMatch(before))) return true;
  }
  return false;
}

function scanPhrases(text, sourceText, weight, hits) {
  const words = normalizeForMatch(text).split(' ').filter(Boolean);
  const titleCased = isTitleCase(sourceText);
  let i = 0;
  while (i < words.length) {
    let matched = 0;
    for (let n = Math.min(MAX_PHRASE_WORDS, words.length - i); n >= 1; n -= 1) {
      const phrase = words.slice(i, i + n).join(' ');
      const entry = TERM_INDEX.get(phrase);
      if (!entry) continue;
      if (AMBIGUOUS_TERMS.has(phrase) && !appearsCapitalized(phrase, sourceText)) continue;
      if (looksLikePersonName(phrase, sourceText, titleCased)) continue;
      hits.push({
        ...entry,
        // Longer phrases and title hits win. Earlier position breaks ties.
        score: weight + entry.words * 10 + entry.rank - i * 0.01,
      });
      matched = n;
      break; // longest phrase at this position wins
    }
    // Skip past what matched so "Latin America" is never re-read as "America".
    i += matched > 1 ? matched : 1;
  }
}

// Bare ISO codes, but only when written uppercase and not on the stoplist.
function scanCodes(sourceText, weight, hits) {
  const tokens = sourceText.match(/\b[A-Z]{2}\b/g) || [];
  for (const token of tokens) {
    if (CODE_STOPLIST.has(token) || !VALID_CODES.has(token)) continue;
    hits.push({ country: token, region: regionForCountry(token), rank: 3, words: 1, score: weight });
  }
}

/**
 * Tag one item by place.
 *
 * @param {{title?: string, summary?: string}} item
 * @returns {{region: string, country: string|null}}
 */
export function tagItem(item) {
  const title = item?.title || '';
  const summary = item?.summary || '';
  const hits = [];

  scanPhrases(title, title, 100, hits);
  scanCodes(title, 100, hits);
  scanPhrases(summary, summary, 0, hits);
  scanCodes(summary, 0, hits);

  if (!hits.length) return { region: GLOBAL, country: null };

  hits.sort((a, b) => b.score - a.score);
  const best = hits[0];
  if (best.country) return { region: best.region, country: best.country };

  // A region word only won, so look for a country hit under the same region
  // before settling for a country-less tag.
  const supporting = hits.find((hit) => hit.country && hit.region === best.region);
  return { region: best.region, country: supporting ? supporting.country : null };
}
