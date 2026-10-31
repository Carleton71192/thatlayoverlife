import { describe, it, expect } from 'vitest';
import { buildExport } from '../src/export.js';

const ME = 'a'.repeat(24), OTHER = 'b'.repeat(24);
describe('download everything', () => {
  it("holds only the member's own records, drafts and private items included, and never internal fields", () => {
    const me = { id: ME, fieldData: { name: 'Nancy Carleton', slug: 'nancy-carleton', 'memberstack-id': 'mem_x', 'outreach-notes': 'internal', avatar: { url: 'https://x/a.jpg' },
      crew: [OTHER], 'map-snapshot': '{"countries":89,"antarctica":true}' } };
    const stories = [
      { id: 's1', isDraft: false, fieldData: { contributor: ME, slug: 'bulgaria', name: 'Bulgaria', body: '<p>x</p>', 'hero-image': { url: 'https://x/h.jpg' }, 'photo-gallery': [{ url: 'https://x/g1.jpg' }] } },
      { id: 's2', isDraft: true, fieldData: { contributor: ME, slug: 'draft-one', name: 'Draft' } },
      { id: 's3', isDraft: false, fieldData: { contributor: OTHER, slug: 'not-mine', name: 'Not mine' } },
    ];
    const items = [{ id: 'i1', fieldData: { owner: ME, name: 'Japan', category: 'c1', 'show-on-profile': false, photo: { url: 'https://x/m.jpg' }, 'more-photos': [{ url: 'https://x/m2.jpg' }] } }, { id: 'i2', fieldData: { owner: OTHER, name: 'Italy', category: 'c1' } }];
    const out = buildExport({ me, stories, items, cats: [{ id: 'c1', fieldData: { name: 'Magnets' } }], people: [{ id: OTHER, fieldData: { name: 'Jay Carleton', slug: 'jay-carleton' } }], now: Date.parse('2026-10-31T12:00:00Z') });
    expect(out.stories.map((s) => [s.slug, s.status, s.link])).toEqual([['bulgaria', 'published', 'https://www.thatlayover.life/stories/bulgaria'], ['draft-one', 'draft', null]]);
    expect(out.collections).toEqual([{ collection: 'Magnets', country: 'Japan', city: '', year: null, caption: '', shownOnProfile: false, photos: ['https://x/m.jpg', 'https://x/m2.jpg'] }]);
    expect(out.companions).toEqual([{ name: 'Jay Carleton', link: 'https://www.thatlayover.life/contributors/jay-carleton' }]);
    expect(out.mapSummary).toEqual({ countries: 89, antarctica: true });
    expect(out.profile['memberstack-id']).toBeUndefined();
    expect(out.profile['outreach-notes']).toBeUndefined();
    expect(out.photos.map((p) => `${p.folder}/${p.name}`)).toEqual(['profile/avatar', 'stories/bulgaria/cover', 'stories/bulgaria/photo-01', 'collections/magnets/japan-1-1', 'collections/magnets/japan-1-2']);
  });
});
