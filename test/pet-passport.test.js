import { describe, it, expect } from 'vitest';
import { petUpdate, passportView, STATUS, VIS } from '../src/pet-passport.js';

const now = Date.parse('2026-10-31T12:00:00Z');
const owner = { id: 'o', fieldData: { name: 'Nancy Carleton', slug: 'nancy-carleton' } };
const pet = (f) => ({ id: 'p1', fieldData: { name: 'Magnus Waffles', slug: 'magnus-waffles', 'visited-countries': ['d-dk'], 'countries-list': 'Sweden, Denmark', 'passport-visibility': VIS.public, ...f } });

describe('paw passport', () => {
  it('shows stamps by country, firsts, the counter and photos from tagged stories', () => {
    const stories = [{ fieldData: { slug: 'ferry', name: 'The ferry', 'byline-location': 'DENMARK', 'pet-co-travelers': ['p1'], 'hero-image': { url: 'https://x/f.jpg' } } }];
    const v = passportView(pet({ firsts: JSON.stringify([{ k: 'ferry', label: 'First ferry', where: 'Helsingør', when: 'May 2025' }]), 'pursuit-label': 'Beaches sniffed', 'pursuit-count': 9, 'birthday-month': 4 }), { owner, dest: [{ id: 'd-dk', fieldData: { name: 'Denmark' } }], stories });
    expect(v).toMatchObject({ countries: ['Denmark', 'Sweden'], count: 2, pursuit: { label: 'Beaches sniffed', count: 9 }, birthdayMonth: 4, forever: false });
    expect(v.firsts[0].label).toBe('First ferry');
    expect(v.album[0].photos.length).toBe(1);
  });
  it('is private when set private, when members-only and signed out, or when the owner profile is Off', () => {
    expect(passportView(pet({ 'passport-visibility': VIS.private }), { owner }).private).toBe(true);
    expect(passportView(pet({ 'passport-visibility': VIS.members }), { owner }).private).toBe(true);
    expect(passportView(pet({ 'passport-visibility': VIS.members }), { owner, signedIn: true }).private).toBeUndefined();
    expect(passportView(pet({}), { owner: { fieldData: { visibility: '1423c8d17c2060776541377f76ea0b31' } } }).private).toBe(true);
  });
  it('forever traveler hides the birthday; firsts must be past months', () => {
    expect(passportView(pet({ status: STATUS.forever, 'birthday-month': 4 }), { owner })).toMatchObject({ forever: true, birthdayMonth: null });
    expect(petUpdate({ firsts: [{ k: 'snow', when: 'December 2026' }] }, now).error).toMatch(/past month/);
    expect(JSON.parse(petUpdate({ firsts: [{ k: 'own', label: 'First <b>gondola</b>', where: 'Zermatt', when: 'March 2024' }] }, now).fieldData.firsts)[0].label).toBe('First bgondola/b');
    expect(petUpdate({ visibility: 'private' }).fieldData).toMatchObject({ 'passport-visibility': VIS.private, 'is-public': false });
    expect(petUpdate({ birthdayMonth: 13 }).error).toBeTruthy();
  });
});
