import { describe, it, expect } from 'vitest';
import { handleWorkTrips, tripKit, roadWarriors } from '../src/work-trips.js';
import { prosList } from '../src/pros.js';

const RW = '7203ed9cbb4a974d00937c5b801ec7e4';
function world() {
  const themes = [{ id: 'th-fe', fieldData: { slug: 'the-free-evening' } }, { id: 'th-p1', fieldData: { slug: 'plus-one-day' } }, { id: 'th-s', fieldData: { slug: 'salty-air' } }];
  const stories = [
    { id: 'st1', fieldData: { slug: 'cph-evening', name: 'Four hours in Vesterbro', city: 'Copenhagen', 'country-2': 'd-dk', theme: ['th-fe'], 'published-date': '2026-10-01' } },
    { id: 'st2', fieldData: { slug: 'lisbon-extra', name: 'One more day', 'country-2': 'd-pt', theme: ['th-p1'], 'published-date': '2026-09-01' } },
    { id: 'st3', fieldData: { slug: 'beach', name: 'Beach', theme: ['th-s'] } },
  ];
  const dest = [{ id: 'd-dk', fieldData: { name: 'Denmark' } }, { id: 'd-pt', fieldData: { name: 'Portugal' } }];
  const ps = [{ id: 'p-wt', isDraft: true, fieldData: { slug: 'work-trips', name: 'Work trips', 'display-name': 'That Work Trip Life', intro: '' } }, { id: 'p-m', fieldData: { slug: 'marathons', name: 'Marathons' } }];
  const people = [{ id: 'c1', fieldData: { name: 'Nancy Carleton', slug: 'nancy-carleton' } }, { id: 'c2', fieldData: { name: 'Hidden Person', slug: 'hidden', visibility: '1423c8d17c2060776541377f76ea0b31' } }];
  const stamps = [
    { id: 's1', fieldData: { owner: 'c1', pursuit: 'p-wt', name: 'Denmark', what: 'Acme offsite', month: 5, year: 2026, 'show-on-profile': true, 'work-trip': true } },
    { id: 's2', fieldData: { owner: 'c1', pursuit: 'p-m', name: 'Japan', what: 'Tokyo Marathon', year: 2025, 'show-on-profile': true, 'work-trip': true, 'permission-to-name': true } },
    { id: 's3', fieldData: { owner: 'c1', pursuit: 'p-wt', name: 'Spain', what: 'x', year: 2024, 'show-on-profile': false, 'work-trip': true } },
    { id: 's4', fieldData: { owner: 'c2', pursuit: 'p-wt', name: 'Peru', what: 'x', year: 2024, 'show-on-profile': true, 'work-trip': true } },
  ];
  const pros = [{ id: 'pr1', fieldData: { contributor: 'c1', track: RW, 'pro-line': 'Many nights away', employer: 'Acme', 'permission-to-name-employer': false } }];
  const extras = [{ id: 'e1', fieldData: { story: 'st1', 'free-evening-time': '3da5259917fa446fe7b319f8685e7d3b', 'free-evening-starting-point': 'd16a888cb473a3d1f0bf3f73d8ccc576', 'free-evening-stops': 'Kødbyen | 10 min walk\nIstedgade | 2 stops by metro', 'safety-note': 'Written by the author.', 'trip-kit': 'Travel eSIM | https://esim.example/x\nBest travel card | https://bank.example/card\nLounge pass | http://insecure.example' } }];
  const env = { WEBFLOW_TOKEN: 't', PURSUITS_COLLECTION_ID: 'purs', THEMES_COLLECTION_ID: 'themes', STORIES_COLLECTION_ID: 'stories', DESTINATIONS_COLLECTION_ID: 'dest', CONTRIBUTORS_COLLECTION_ID: 'contrib', STAMPS_COLLECTION_ID: 'stamps', PROS_COLLECTION_ID: 'pros', STORY_EXTRAS_COLLECTION_ID: 'extras' };
  const fetchImpl = async (url) => {
    const m = /\/collections\/(\w+)\/items/.exec(url);
    const list = { themes, stories, dest, purs: ps, contrib: people, stamps, pros, extras }[m[1]];
    return new Response(JSON.stringify({ items: list }), { status: 200 });
  };
  return (q) => handleWorkTrips(new Request(`https://w.example${q}`), env, { fetchImpl }).then((r) => r.json());
}

describe('work trips hub', () => {
  it('series rails, a wall with year only and no employer, road warriors without employer unless permitted', async () => {
    const d = await world()('/work-trips');
    expect(d.hub).toMatchObject({ name: 'That Work Trip Life', live: false });
    expect(d.series[0].stories.map((s) => s.label)).toEqual(['The Free Evening · Copenhagen']);
    expect(d.series[1].stories.map((s) => s.label)).toEqual(['Plus One Day · Portugal']);
    expect(d.wall.stamps.map((s) => [s.country, s.year, s.what])).toEqual([['Denmark', 2026, 'A work trip'], ['Japan', 2025, 'Tokyo Marathon']]);
    expect(JSON.stringify(d)).not.toMatch(/Acme|month|Hidden|Peru|Spain/);
    expect(d.roadWarriors).toEqual([{ slug: 'nancy-carleton', name: 'Nancy Carleton', avatar: '', line: 'Many nights away', employer: '' }]);
  });
  it('a story gets its series label, the writer fields and a Trip Kit without cards', async () => {
    const d = await world()('/work-trips/story?slug=cph-evening');
    expect(d.label).toBe('The Free Evening · Copenhagen');
    expect(d.fields).toMatchObject({ time: 'Four hours', start: 'Convention center' });
    expect(d.fields.stops[1]).toEqual({ stop: 'Istedgade', move: '2 stops by metro' });
    expect(d.tripKit).toEqual([{ label: 'Travel eSIM', url: 'https://esim.example/x', rel: 'sponsored noopener noreferrer', tag: 'reklamelink' }]);
    expect((await world()('/work-trips/story?slug=beach')).series).toBe(null);
  });
  it('employer is named only with permission', () => {
    const people = [{ id: 'c1', fieldData: { name: 'A B', slug: 'a' } }];
    const pro = (ok) => [{ fieldData: { contributor: 'c1', track: RW, employer: 'Acme', 'permission-to-name-employer': ok } }];
    expect(roadWarriors(pro(false), people)[0].employer).toBe('');
    expect(roadWarriors(pro(true), people)[0].employer).toBe('Acme');
    expect(prosList(pro(false), people, [])[0]).toMatchObject({ track: 'road-warrior', employer: '' });
    expect(tripKit('Miles card | https://x.example')).toEqual([]);
  });
});
