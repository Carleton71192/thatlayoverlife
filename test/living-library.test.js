import { describe, it, expect } from 'vitest';
import { libraryCards, displayName } from '../src/living-library.js';

const now = Date.parse('2026-10-31T12:00:00Z');
const person = (id, f, since = '2026-01-01T00:00:00Z') => ({ id, fieldData: { slug: id, name: 'Ana Maria Silva', 'list-expats': true, 'member-since': since, email: 'x@y.z', 'instagram-url': 'https://instagram.com/x',
  desks: JSON.stringify([{ c: 'dk', years: '2019–now', knows: 'Nørrebro bakeries', now: true }]), 'home-base': 'Copenhagen, Denmark', languages: 'English, Portuguese', ...f } });

describe('living library', () => {
  it('lists only opted-in, listed, public, non-new members, with no contact details', () => {
    const people = [person('a', {}), person('b', {}), person('c', { 'list-expats': false }), person('d', {}, '2026-10-25T00:00:00Z'), person('e', { visibility: '1423c8d17c2060776541377f76ea0b31' })];
    const s = { a: { coffee: true }, b: { coffee: false }, c: { coffee: true }, d: { coffee: true }, e: { coffee: true } };
    const cards = libraryCards(people, s, { now });
    expect(cards.map((c) => c.slug)).toEqual(['a']);
    expect(cards[0]).toMatchObject({ homeCity: '', years: '2019–now', knowsWell: ['Nørrebro bakeries'], languages: ['English', 'Portuguese'] });
    expect(JSON.stringify(cards)).not.toMatch(/x@y|instagram|Denmark/);
  });
  it('home base city only when switched on; names follow credit mode', () => {
    expect(libraryCards([person('a', {})], { a: { coffee: true, showHomeBase: true } }, { now })[0].homeCity).toBe('Copenhagen');
    expect(displayName({ name: 'Ana Maria Silva', 'credit-mode': 'd01799503381d459b0ae4b27b0535111' })).toBe('Ana');
    expect(displayName({ name: 'Ana', 'credit-mode': '38820387bc6c4892f486394a6c28776c', 'pen-name': 'The Fika Fan' })).toBe('The Fika Fan');
  });
});
