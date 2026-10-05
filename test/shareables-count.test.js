import { describe, expect, it } from 'vitest';
import { BASES, UN_CODES, cleanStates, countFor, normalizeTier, rangeText, tierNameFor, continentFor } from '../src/shareables/count.js';
import { percentCard, percentCopy, percentState } from '../src/shareables/copy.js';

// The board's sample traveler: 62 UN states, 4 bonus places, 4 airside stops.
const HUMAN = ['076','276','203','703','040','008','688','100','752','807','348','616','208','704','840','499','288','392','484','152','032','578','246','528','056','250','724','620','380','300','191','705','070','642','826','372','756','233','428','440','504','818','710','404','764','116','360','702','458','608','410','036','554','124','604','170','188','192','470','442','196','356'];
const LIVED = ['208', '076', '704', '840'];
const BONUS = ['158', '540', '010', '344']; // Taiwan, New Caledonia, Antarctica, Hong Kong
const AIRSIDE = ['634', '352', '591', '231'];

function sample() {
  const states = {};
  for (const c of HUMAN) states[c] = { t1: LIVED.includes(c) ? 'lived' : 'visited' };
  for (const c of BONUS) states[c] = { t1: 'escaped' };
  for (const c of AIRSIDE) states[c] = { t1: 'airside' };
  states['undefined'] = { t1: 'visited' }; // the corrupt entry on the founder's record
  return { v: 2, travelers: [{ id: 't1', name: 'Me', color: '#F0507A', pet: false }, { id: 't2', name: 'Magnus', color: '#7C5CBF', pet: true }], states };
}

describe('UN base', () => {
  it('has exactly 193 member states in the map table', () => {
    expect(UN_CODES).toHaveLength(193);
    expect(UN_CODES).toContain('208');
    expect(UN_CODES).not.toContain('158');
    expect(UN_CODES).not.toContain('010');
  });
});

describe('G02 data hygiene', () => {
  it('drops the "undefined" key and anything that is not a 3-digit ISO code', () => {
    const { states, dropped } = cleanStates({ v: 2, travelers: [], states: { undefined: { t1: 'visited' }, '208': { t1: 'visited' }, abc: { t1: 'lived' }, '999': { t1: 'lived' } } });
    expect(Object.keys(states)).toEqual(['208']);
    expect([...dropped].sort()).toEqual(['999', 'abc', 'undefined']);
  });
  it('ignores unknown tier values instead of guessing', () => {
    const { states } = cleanStates({ v: 2, travelers: [], states: { '208': { t1: 'teleported' } } });
    expect(states).toEqual({});
  });
  it('reads pre-v2 data the way the map migrates it', () => {
    const { states } = cleanStates({ '208': ['visited', 'magnus'], '76': 'lived', 'undefined': 'visited' });
    expect(states).toEqual({ '208': { t1: 'escaped', t2: 'escaped' } });
  });
});

describe('tier ladder', () => {
  it('maps legacy values and keeps the new ladder', () => {
    expect(normalizeTier('visited')).toBe('escaped');
    expect(normalizeTier('lived')).toBe('lived');
    expect(normalizeTier('layover')).toBe('escaped');
    expect(normalizeTier('layover', { layoverAs: 'airside' })).toBe('airside');
    expect(normalizeTier('FED')).toBe('fed');
    expect(normalizeTier('nope')).toBeNull();
  });
  it('names tiers by count', () => {
    expect(tierNameFor(0)).toBe('Boarding');
    expect(tierNameFor(10)).toBe('Carry-On');
    expect(tierNameFor(62)).toBe('Half the Stamps');
    expect(tierNameFor(100)).toBe('Centurion');
    expect(tierNameFor(193)).toBe('UN-Done');
  });
});

describe('G01 counting engine', () => {
  it('sample member: 62/193 = 32%, +4 bonus, airside excluded', () => {
    const s = countFor(sample());
    expect(s.n).toBe(62);
    expect(s.den).toBe(193);
    expect(s.pct).toBe(32);
    expect(s.bonus).toHaveLength(4);
    expect(s.airside).toHaveLength(4);
    expect(s.counted).not.toContain('634');
    expect(s.dropped).toEqual(['undefined']);
    expect(s.chips.count).toBe('62/193 UN');
    expect(s.chips.bonus).toBe('+4 BONUS PLACES');
    expect(s.chips.airside).toBe('+4 COUNTRIES SEEN THROUGH GLASS');
    expect(s.chips.tickRight).toBe('131 TO GO');
    expect(s.tierName).toBe('Half the Stamps');
    expect(s.highestTier).toBe('lived');
    expect(s.lived.sort()).toEqual([...LIVED].sort());
    expect(s.denLabel).toBe('OF 193 UN STATES');
  });
  it('counts bonus places in under the 195 and 250 bases', () => {
    expect(countFor(sample(), { base: 'tll' }).n).toBe(62); // TW, NC, AQ, HK are not in the 195 either
    const been = countFor(sample(), { base: 'been' });
    expect(been.n).toBe(66);
    expect(been.den).toBe(250);
    expect(been.pct).toBe(26);
    expect(been.chips.bonus).toBeNull();
  });
  it('ranges print 60+ and 30%+ everywhere', () => {
    const s = countFor(sample(), { ranges: true });
    expect(s.countStr).toBe('60+');
    expect(s.pctStr).toBe('30%+');
    expect(s.chips.count).toBe('60+/193 UN');
    expect(s.chips.tickRight).toBe('THE REST TO GO');
    expect(rangeText(7, true)).toBe('Under 10');
  });
  it('counts the pet separately and never the human for the pet', () => {
    const data = sample();
    data.states['076'].t2 = 'escaped';
    data.states['276'].t2 = 'airside';
    const pet = countFor(data, { travelerId: 't2' });
    expect(pet.n).toBe(1);
    expect(pet.airside).toEqual(['276']);
  });
  it('counts continents on the 7-continent model', () => {
    expect(continentFor('076')).toBe('South America');
    expect(continentFor('840')).toBe('North America');
    expect(continentFor('010')).toBe('Antarctica');
    expect(continentFor('784')).toBe('Asia');
    expect(countFor(sample()).continents).toHaveLength(7);
    expect(countFor(sample()).chips.continents).toBe('7/7 CONTINENTS');
  });
  it('an empty or missing map counts zero, never invents', () => {
    const s = countFor(null);
    expect(s.n).toBe(0);
    expect(s.pct).toBe(0);
    expect(s.chips.bonus).toBeNull();
    expect(s.highestTier).toBeNull();
  });
  it('every base is documented with its label', () => {
    expect(Object.keys(BASES)).toEqual(['un', 'tll', 'been']);
  });
});

describe('G12 states and G13 alt text', () => {
  it('new member gets the empty card, not 0%', () => {
    const { copy, alt } = percentCard(null, { handle: 'nancy' });
    expect(copy.state).toBe('new');
    expect(copy.head1).toBe('Your map is empty.');
    expect(alt).toContain('has not logged a country outside an airport yet');
  });
  it('two countries lead with the count, not 1%', () => {
    const data = { v: 2, travelers: [{ id: 't1', pet: false }], states: { '208': { t1: 'visited' }, '752': { t1: 'visited' } } };
    const { copy } = percentCard(data);
    expect(copy.state).toBe('early');
    expect(copy.hero).toBe('2');
    expect(copy.head1).toBe('Two countries in.');
  });
  it('quiet year only when the year count is known to be zero', () => {
    const s = countFor(sample());
    expect(percentState(s, null)).toBe('full');
    expect(percentState(s, 0)).toBe('quiet');
    expect(percentCopy(s, { newThisYear: 0 }).head2).toBe('100% couch.');
  });
  it('full card copy matches the board', () => {
    const { copy, alt } = percentCard(sample(), { handle: '@nancy' });
    expect(copy.hero).toBe('32');
    expect(copy.head1).toBe('32% of the world.');
    expect(copy.head2).toBe('The other 68% has been warned.');
    expect(copy.handle).toBe('@NANCY');
    expect(percentCopy(countFor(sample()), { dark: true }).head1).toBe("You didn't ask.");
    expect(alt).toBe('@nancy has been to 62 of 193 UN states, 32%. Plus 4 bonus places outside the base. 7 of 7 continents. 4 more seen through airport glass, not counted. Tier: Half the Stamps. Made at thatlayover.life.');
    expect(alt).not.toMatch(/—/);
  });
});
