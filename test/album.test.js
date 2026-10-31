import { describe, it, expect } from 'vitest';
import { buildAlbum, continentOf, CONTINENTS } from '../src/album.js';

describe('continent album', () => {
  it('has seven continents and every common country on one of them', () => {
    expect(CONTINENTS.map((c) => c[1])).toEqual(['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']);
    const all = CONTINENTS.flatMap((c) => c[2].split(' '));
    expect(new Set(all).size).toBe(all.length);
    expect(['dk', 'br', 'vn', 'us', 'aq', 'nz', 'gh'].map(continentOf)).toEqual(['europe', 'south-america', 'asia', 'north-america', 'antarctica', 'oceania', 'africa']);
  });
  it('places story photos by byline and shown items by country, counts countries, keeps empty continents', () => {
    const story = (slug, by, n) => ({ fieldData: { slug, name: slug, 'byline-location': by, 'hero-image': { url: `https://x/${slug}.jpg` }, 'photo-gallery': Array.from({ length: n }, (_, i) => ({ url: `https://x/${slug}-${i}.jpg` })) } });
    const a = buildAlbum({
      stories: [story('ghana', 'ACCRA, GHANA', 2), story('spain', 'MADRID, SPAIN', 0), story('balkans', 'BALKANS', 1)],
      items: [{ country: 'Japan', city: 'Tokyo', year: 2019, line: 'Magnets', photos: ['https://x/m1.jpg', 'https://x/m2.jpg'] }],
      stamps: [{ country: 'Italy', year: 2022, line: 'Marathons: Rome', photos: [] }],
    });
    const by = Object.fromEntries(a.map((c) => [c.key, c]));
    expect(by.africa).toMatchObject({ countries: 1 });
    expect(by.africa.photos).toHaveLength(3);
    expect(by.africa.cover.href).toBe('/stories/ghana');
    expect(by.europe.countries).toBe(2);
    expect(by.asia.photos.map((p) => p.sub)).toEqual(['Tokyo · Japan · 2019', 'Tokyo · Japan · 2019']);
    expect(by.antarctica).toMatchObject({ photos: [], countries: 0, cover: null });
  });
});

import { continentOfM49, settingsFrom, M49 } from '../src/album.js';
describe('album settings', () => {
  it('maps every map code to one continent, Kosovo included', () => {
    const all = Object.values(M49).flatMap((v) => v.split(' '));
    expect(new Set(all).size).toBe(all.length);
    expect(['208', '076', '704', '840', '010', '554', '288', '900'].map(continentOfM49)).toEqual(['europe', 'south-america', 'asia', 'north-america', 'antarctica', 'oceania', 'africa', 'europe']);
  });
  it('accepts only whole-number counts for the seven continents and a known model', () => {
    const counts = { africa: 9, antarctica: 1, asia: 20, europe: 40, 'north-america': 8, oceania: 3, 'south-america': 6 };
    expect(settingsFrom({ counts, model: 'americas' }).settings).toEqual({ counts, model: 'americas' });
    expect(settingsFrom({ counts: { ...counts, mars: 1 } }).error).toBeTruthy();
    expect(settingsFrom({ counts: { ...counts, asia: 2.5 } }).error).toBeTruthy();
    expect(settingsFrom({ model: 'flat-earth' }).error).toBeTruthy();
    expect(settingsFrom({}).error).toBeTruthy();
  });
});

import { homesView, movesShow, settingsFrom as sf } from '../src/album.js';
describe('lived in and my moves', () => {
  const desks = [{ c: 'dk', years: '2019–now', knows: 'Nørrebro bakeries', now: true }, { c: 'br', years: '2012–2015', now: false }, { c: 'us', years: '1990–2012', now: false }];
  const homes = { africa: 0, antarctica: 0, asia: 0, europe: 1, 'north-america': 1, oceania: 0, 'south-america': 1 };
  it('counts homes, hides today\'s home unless switched on, and gives milestone badges', () => {
    const v = homesView(desks, { homes });
    expect(v.total).toBe(3);
    expect(v.places.map((p) => p.c)).toEqual(['br', 'us']);
    expect(v.badges).toEqual(['first-move-abroad', 'lived-on-two-continents']);
    expect(homesView(desks, { homes, showHomeBase: true, movedBack: true }).places.length).toBe(3);
    expect(homesView(desks, { homes, movedBack: true }, 'olympic').badges).toContain('moved-back');
    expect(homesView([], { homes: { ...homes, europe: 0, 'south-america': 0 } }, 'americas').badges).toEqual([]);
  });
  it('my moves is opt-in, in order, one slide per home', () => {
    expect(movesShow(desks, { moves: false }, [])).toBe(null);
    const st = [{ fieldData: { slug: 'rio', 'byline-location': 'BRAZIL', 'hero-image': { url: 'https://x/rio.jpg' } } }];
    const m = movesShow(desks, { moves: true, moveLines: { br: 'Learned to say no to caipirinhas.' } }, st);
    expect(m.map((x) => x.c)).toEqual(['us', 'br']);
    expect(m[1]).toMatchObject({ img: 'https://x/rio.jpg', line: 'Learned to say no to caipirinhas.', href: '/stories/rio' });
  });
  it('settings validate homes and switches', () => {
    expect(sf({ homes: homes }).settings.homes.europe).toBe(1);
    expect(sf({ moves: 'yes' }).error).toBeTruthy();
    expect(sf({ moveLines: { br: '<b>hi</b>' } }).settings.moveLines.br).toBe('bhi/b');
  });
});
