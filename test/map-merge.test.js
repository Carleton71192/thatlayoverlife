import { describe, expect, it } from 'vitest';
import { addStoryCountries, normalizeStates } from '../src/map-merge.js';

describe('addStoryCountries', () => {
  it('starts a v2 map for a member who has never opened the map', () => {
    const { states, added } = addStoryCountries(null, ['288']);
    expect(states.v).toBe(2);
    expect(states.travelers).toHaveLength(1);
    expect(states.states['288']).toEqual({ t1: 'visited' });
    expect(added).toEqual(['288']);
  });

  it('never overwrites a country the member already logged', () => {
    const current = {
      v: 2,
      travelers: [{ id: 't1', name: 'Nancy', color: '#F0507A', pet: false }],
      states: { '208': { t1: 'lived' } },
    };
    const { states, added } = addStoryCountries(current, ['208', '499']);
    expect(states.states['208']).toEqual({ t1: 'lived' });
    expect(states.states['499']).toEqual({ t1: 'visited' });
    expect(added).toEqual(['499']);
  });

  it('writes for the member, not the pet', () => {
    const current = {
      v: 2,
      travelers: [
        { id: 't2', name: 'Magnus', color: '#7C5CBF', pet: true },
        { id: 't1', name: 'Nancy', color: '#F0507A', pet: false },
      ],
      states: { '100': { t2: 'visited' } },
    };
    const { states } = addStoryCountries(current, ['100']);
    expect(states.states['100']).toEqual({ t2: 'visited', t1: 'visited' });
  });

  it('pads numeric codes and skips blanks', () => {
    const { added } = addStoryCountries(null, [8, '', null, '8']);
    expect(added).toEqual(['008']);
  });

  it('does not mutate the input', () => {
    const current = { v: 2, travelers: [{ id: 't1', name: 'Me', pet: false }], states: {} };
    addStoryCountries(current, ['288']);
    expect(current.states).toEqual({});
  });

  it('migrates pre-v2 data the way the map does, losing nothing', () => {
    const migrated = normalizeStates({ '208': ['lived'], '100': ['visited', 'magnus'], '4': 'layover' });
    expect(migrated.states).toEqual({
      '208': { t1: 'lived' },
      '100': { t1: 'visited', t2: 'visited' },
      '004': { t1: 'layover' },
    });
    expect(migrated.travelers.map((traveler) => traveler.name)).toEqual(['Me', 'Magnus']);
  });
});
