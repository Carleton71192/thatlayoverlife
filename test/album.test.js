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
