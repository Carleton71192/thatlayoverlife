// Add-only merge of a published story's countries into a member's map data.
//
// The map engine on /the-map stores a member's countries in Memberstack member
// JSON under `tllStates`, shape v2:
//   { v: 2, travelers: [{ id, name, color, pet }], states: { '208': { t1: 'visited' } } }
// keyed by zero-padded ISO 3166-1 numeric code, with `tllStatesAt` as the
// last-write timestamp the map uses to pick the newest copy.
//
// A story only ever adds. A country the member already logged keeps whatever
// trip type they gave it (lived, visited, layover), and nothing is removed.

const FIRST_TRAVELER = { id: 't1', name: 'Me', color: '#F0507A', pet: false };

export function padNumeric(code) {
  return String(code).padStart(3, '0');
}

/**
 * Returns a fresh v2 object; never mutates `current`. Pre-v2 data
 * ({ '208': ['visited', 'magnus'] }) is migrated the same way the map engine's
 * own migrate() does it on /the-map, so no country is lost.
 */
export function normalizeStates(current) {
  if (current && current.v === 2 && Array.isArray(current.travelers) && current.states) {
    return {
      v: 2,
      travelers: current.travelers.map((traveler) => ({ ...traveler })),
      states: Object.fromEntries(
        Object.entries(current.states).map(([code, entry]) => [code, { ...entry }]),
      ),
    };
  }

  const migrated = { v: 2, travelers: [{ ...FIRST_TRAVELER }], states: {} };
  if (!current || typeof current !== 'object') return migrated;

  let hasMagnus = false;
  for (const [code, raw] of Object.entries(current)) {
    const marks = typeof raw === 'string' ? [raw] : raw;
    if (!Array.isArray(marks)) continue;
    const own = ['lived', 'visited', 'layover'].find((kind) => marks.includes(kind));
    const entry = {};
    if (own) entry.t1 = own;
    if (marks.includes('magnus')) {
      hasMagnus = true;
      entry.t2 = 'visited';
    }
    if (Object.keys(entry).length) migrated.states[padNumeric(code)] = entry;
  }
  if (hasMagnus) migrated.travelers.push({ id: 't2', name: 'Magnus', color: '#7C5CBF', pet: true });
  return migrated;
}

/**
 * @param {object|null} current  the member's tllStates, any version or missing
 * @param {string[]} numericCodes ISO numeric codes from the story
 * @returns {{ states: object, added: string[] }}
 */
export function addStoryCountries(current, numericCodes) {
  const states = normalizeStates(current);
  // The member's own traveler is the first non-pet one; pets never write stories.
  let self = states.travelers.find((traveler) => !traveler.pet);
  if (!self) {
    self = { ...FIRST_TRAVELER };
    if (states.travelers.some((traveler) => traveler.id === self.id)) {
      self.id = `t${Date.now().toString(36)}`;
    }
    states.travelers.unshift(self);
  }

  const added = [];
  for (const raw of numericCodes) {
    if (raw == null || raw === '') continue;
    const code = padNumeric(raw);
    const entry = states.states[code] || {};
    if (entry[self.id]) continue;
    entry[self.id] = 'visited';
    states.states[code] = entry;
    added.push(code);
  }
  return { states, added };
}
