import { describe, it, expect } from 'vitest';
import { handleSeries, pastMonthYear, petBox, storyFields } from '../src/series.js';
import { prosList } from '../src/pros.js';

function world() {
  const themes = [['th-ff', 'the-first-friend'], ['th-pm', 'the-partner-who-moved-too'], ['th-mb', 'moving-back'], ['th-sit', 'the-sitter-was-the-hero']].map(([id, slug]) => ({ id, fieldData: { slug } }));
  const stories = [
    { id: 's1', fieldData: { slug: 'cph-friend', name: 'A', city: 'Copenhagen', 'country-2': 'd-dk', theme: ['th-ff'], 'published-date': '2026-10-02' } },
    { id: 's2', fieldData: { slug: 'partner', name: 'B', city: 'Aarhus', 'country-2': 'd-dk', theme: ['th-pm'], 'published-date': '2026-10-01' } },
    { id: 's3', fieldData: { slug: 'back', name: 'C', 'country-2': 'd-us', theme: ['th-mb'] } },
    { id: 's4', fieldData: { slug: 'sitter', name: 'D', city: 'Malmö', theme: ['th-sit'] } },
  ];
  const dest = [{ id: 'd-dk', fieldData: { name: 'Denmark' } }, { id: 'd-us', fieldData: { name: 'United States' } }];
  const extras = [
    { fieldData: { story: 's1', 'first-friend-months-it-took': 14, 'first-friend-where-it-happened': 'a running club', 'series-month-and-year': 'October 2026' } },
    { fieldData: { story: 's4', 'sitter-name': 'Ana', 'permission-to-name': false, 'series-month-and-year': 'December 2026' } },
  ];
  const notes = [{ fieldData: { 'story-slug': 'sitter', 'stayed-at': 'Hotel Example', 'stayed-at-city': 'Malmö', 'stayed-at-url': 'https://hotel.example', 'what-made-it-welcoming': 'A water bowl at check-in.', 'date-of-stay': 'September 2026' } }];
  const env = { WEBFLOW_TOKEN: 't', THEMES_COLLECTION_ID: 'themes', STORIES_COLLECTION_ID: 'stories', DESTINATIONS_COLLECTION_ID: 'dest', STORY_EXTRAS_COLLECTION_ID: 'extras', PET_NOTES_COLLECTION_ID: 'notes' };
  const fetchImpl = async (url) => new Response(JSON.stringify({ items: { themes, stories, dest, extras, notes }[/\/collections\/(\w+)\/items/.exec(url)[1]] }));
  return (q) => handleSeries(new Request(`https://w.example${q}`), env, { fetchImpl, now: Date.parse('2026-10-31T12:00:00Z') }).then((r) => r.json());
}

describe('story series', () => {
  it('labels expat series with city or country and groups them', async () => {
    const d = await world()('/series?group=expat');
    expect(d.series.map((s) => s.slug)).toEqual(['the-first-friend', 'the-partner-who-moved-too', 'moving-back']);
    expect(d.series.flatMap((s) => s.stories.map((c) => c.label))).toEqual(['The First Friend · Copenhagen', 'The Partner Who Moved Too · Denmark', 'Moving Back · United States']);
  });
  it('a story carries its fields; a sitter is never named without permission; future dates are dropped', async () => {
    const ff = await world()('/series/story?slug=cph-friend');
    expect(ff.fields).toMatchObject({ monthsItTook: 14, where: 'a running club', when: 'October 2026' });
    const sit = await world()('/series/story?slug=sitter');
    expect(sit.fields).toEqual({ sitter: '', when: '' });
    expect(sit.petBox).toMatchObject({ stayedAt: 'Hotel Example', when: 'September 2026', rel: 'nofollow ugc noopener' });
    expect(storyFields('the-sitter-was-the-hero', { 'sitter-name': 'Ana', 'permission-to-name': true }).sitter).toBe('Ana');
  });
  it('month and year must be real and past; empty pet notes show nothing', () => {
    const now = Date.parse('2026-10-31T12:00:00Z');
    expect(pastMonthYear('October 2026', now)).toBe('October 2026');
    expect(pastMonthYear('November 2026', now)).toBe('');
    expect(pastMonthYear('Octember 2026', now)).toBe('');
    expect(petBox({ fieldData: { 'date-of-stay': 'May 2026' } }, now)).toBe(null);
  });
  it('pros carry their category', () => {
    const people = [{ id: 'c', fieldData: { name: 'A', slug: 'a' } }];
    expect(prosList([{ fieldData: { contributor: 'c', category: '3aad9087dfe90d557e80f112ba530bb2' } }], people, [])[0].category).toBe('move-pros');
  });
});
