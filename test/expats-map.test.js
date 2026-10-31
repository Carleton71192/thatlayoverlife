import { describe, it, expect } from 'vitest';
import { buildExpats } from '../src/expats-map.js';

const PUB = 'a6fcbaf1151c3a0c53d2f575bd540c73';
const c = (name, f = {}, extra = {}) => ({ isDraft: false, isArchived: false, fieldData: { name, slug: name.toLowerCase().replace(/ /g, '-'), visibility: PUB, ...f }, ...extra });

describe('expats map', () => {
  it('lists only opted-in, public, live members with a home base', () => {
    const r = buildExpats([
      c('Roberta Bianchi', { 'list-expats': true, 'home-base': 'Florence, Italy', 'from-and-lived-in': 'it,fr' }),
      c('Luke Luby', { 'list-expats': false, 'home-base': 'Torrevieja, Spain' }),
      c('Hidden One', { 'list-expats': true, 'home-base': 'Paris, France', visibility: '1423c8d17c2060776541377f76ea0b31' }),
      c('Draft One', { 'list-expats': true, 'home-base': 'Oslo, Norway' }, { isDraft: true }),
      c('No Base', { 'list-expats': true }),
      c('Nancy Carleton', { 'home-base': 'Copenhagen, Denmark', 'from-and-lived-in': 'us,br,dk' }),
    ], [{ isDraft: false, fieldData: { 'profile-slug': 'nancy-carleton', 'is-expat': true } }]);
    expect(r.expats.map((e) => e.name)).toEqual(['Nancy Carleton', 'Roberta Bianchi']);
    expect(r.expats[1]).toEqual({ name: 'Roberta Bianchi', slug: 'roberta-bianchi', country: 'it', place: 'Florence, Italy', from: 'it' });
    expect(r.countries).toEqual({ dk: 1, it: 1 });
  });
  it('never sends coordinates or anything beyond the public fields', () => {
    const r = buildExpats([c('A B', { 'list-expats': true, 'home-base': 'Bangkok, Thailand', email: 'x@y.z', 'currently-in': 'Paris' })]);
    expect(Object.keys(r.expats[0]).sort()).toEqual(['country', 'from', 'name', 'place', 'slug']);
  });
});
