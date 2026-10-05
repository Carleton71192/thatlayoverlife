// TLL shareables · card copy and alt text (REQUIREMENTS G12, G13; SHAREABLES-SPEC §9).
// Strings come from the board (shareables/02 and 09). No em dashes, no invented numbers.

import { countFor } from './count.js';

/**
 * Picks the card state for the percent card: new (0), early (1 to 2), quiet year, or full.
 * `newThisYear` is null when the map has no date history, so "quiet" is only
 * chosen when the caller knows the year count.
 */
export function percentState(stats, newThisYear) {
  if (stats.n === 0 && stats.bonus.length === 0) return 'new';
  if (stats.n <= 2) return 'early';
  if (newThisYear === 0) return 'quiet';
  return 'full';
}

/** Percent card copy for every state and the three layouts (master, feed, link). */
export function percentCopy(stats, { newThisYear = null, handle = null, dark = false } = {}) {
  const state = percentState(stats, newThisYear);
  const shared = { denLabel: stats.denLabel, handle: handle ? `@${String(handle).replace(/^@/, '').toUpperCase()}` : null, tier: stats.tierName, chips: stats.chips, state };
  if (state === 'new') {
    return { ...shared, hero: '0', heroSuffix: '%', head1: 'Your map is empty.', head2: "Airports don't count. Yet.", sub: 'Log one country outside an airport to unlock this card.' };
  }
  if (state === 'early') {
    return { ...shared, denLabel: `${stats.denLabel} · FALLBACK HERO`, hero: stats.countStr, heroSuffix: '', head1: stats.n === 1 ? 'One country in.' : 'Two countries in.', head2: 'Everybody starts somewhere.', sub: 'Usually an airport. 1% felt rude, so the card leads with the count.' };
  }
  if (state === 'quiet') {
    return { ...shared, denLabel: 'THIS YEAR', hero: '0', heroSuffix: '', head1: '0 new countries.', head2: '100% couch.', sub: 'Still counts as self-care. Lifetime total stays on the back of the card.' };
  }
  const head2 = stats.ranges ? 'The rest has been warned.' : `The other ${100 - stats.pct}% has been warned.`;
  return {
    ...shared, hero: stats.pctNum, heroSuffix: stats.pctSuffix,
    head1: dark ? "You didn't ask." : `${stats.pctStr} of the world.`,
    head2: dark ? 'Here are my travel stats anyway.' : head2,
    feedHead1: 'One more country,', feedHead2: 'then you.',
    sub: null,
  };
}

/** G13: alt text generated from the data, repeated as live text on /p/. */
export function percentAlt(stats, { handle = null } = {}) {
  const who = handle ? `@${String(handle).replace(/^@/, '')}` : 'A traveler';
  if (stats.n === 0 && stats.bonus.length === 0) return `${who} has not logged a country outside an airport yet. Percent card, 0 percent of ${stats.den} ${stats.baseWord}.`;
  const parts = [`${who} has been to ${stats.countStr} of ${stats.den} ${stats.baseWord}, ${stats.pctStr}.`];
  if (stats.bonus.length) parts.push(`Plus ${stats.bonus.length} bonus place${stats.bonus.length === 1 ? '' : 's'} outside the base.`);
  if (stats.continents.length) parts.push(`${stats.continents.length} of 7 continents.`);
  if (stats.airside.length) parts.push(`${stats.airside.length} more seen through airport glass, not counted.`);
  parts.push(`Tier: ${stats.tierName}. Made at thatlayover.life.`);
  return parts.join(' ');
}

/** Convenience: stats + copy + alt in one call. */
export function percentCard(tllStates, opts = {}) {
  const stats = countFor(tllStates, opts);
  return { stats, copy: percentCopy(stats, opts), alt: percentAlt(stats, opts) };
}
