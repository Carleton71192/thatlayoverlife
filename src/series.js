// Story series (31 Oct 2026): one registry for every series with a black washi-tape label.
//   Work trips: The Free Evening, Plus One Day.  Expats: The First Friend, The Partner Who Moved Too, Moving Back.
//   Pets: First Trip Together, The Sitter Was the Hero, Cats Who Travel.
// A story joins a series through its Theme (Stories "theme" multi-reference; Stories is at Webflow's 60-field limit, so the
// series' template fields live on its Story extras item). AI writes nothing here; every field is the writer's own words.
//   GET /series                    every series with its live stories (cards with the label), for rails, chips and card labels
//   GET /series/story?slug=x       one story: its label, template fields, safety note, Trip Kit and pet-friendly note
// Privacy: city or country only. A sitter is named only with Permission to name. Dates are month and year, never future.
import { listLive } from './site-stats.js';
import { listAll } from './collections.js';

export const SERIES = {
  'the-free-evening': { name: 'The Free Evening', group: 'work', place: 'city' },
  'plus-one-day': { name: 'Plus One Day', group: 'work', place: 'city' },
  'the-first-friend': { name: 'The First Friend', group: 'expat', place: 'city' },
  'the-partner-who-moved-too': { name: 'The Partner Who Moved Too', group: 'expat', place: 'country' },
  'moving-back': { name: 'Moving Back', group: 'expat', place: 'country' },
  'first-trip-together': { name: 'First Trip Together', group: 'pets', place: 'city' },
  'the-sitter-was-the-hero': { name: 'The Sitter Was the Hero', group: 'pets', place: 'city' },
  'cats-who-travel': { name: 'Cats Who Travel', group: 'pets', place: 'city' },
};
const OPTION = {
  '91c0cc52af6d7a81185e7d085c2d3958': 'Two hours', '3da5259917fa446fe7b319f8685e7d3b': 'Four hours', '50ad2806be64cebbe7d5d5dc0903e6e2': 'One evening',
  d16a888cb473a3d1f0bf3f73d8ccc576: 'Convention center', cf34e7325ee4b33368c38a0cd3606ab0: 'Business district', e2d8c831ce610d28aeb0043f61aea45e: 'Airport hotel',
};
// Trip Kit: eSIM, airport lounges, travel insurance only. Anything that smells of cards, points or miles is dropped.
const KIT_BLOCK = /credit|card|amex|american ?express|visa\b|mastercard|chase|capital ?one|citi|points|miles|reward|cashback|loyalty/i;
const MONTH_YEAR = /^(January|February|March|April|May|June|July|August|September|October|November|December) (19|20)\d\d$/;

const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
export const send = (b, s = 200, cache = 600) => new Response(JSON.stringify(b), { status: s, headers: { ...headers, 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store' } });
const txt = (v, n = 200) => String(v || '').trim().slice(0, n);

export function tripKit(text) {
  return String(text || '').split(/\n+/).map((l) => l.split('|').map((x) => x.trim())).filter((p) => p.length >= 2)
    .map(([label, url]) => ({ label: label.slice(0, 60), url }))
    .filter((k) => k.label && /^https:\/\/[^\s"'<>]+$/.test(k.url) && !KIT_BLOCK.test(k.label + ' ' + k.url))
    .slice(0, 3).map((k) => ({ ...k, rel: 'sponsored noopener noreferrer', tag: 'reklamelink' }));
}

/** "October 2026" only if it is a real month and not after `now`. */
export function pastMonthYear(v, now = Date.now()) {
  const s = txt(v, 20);
  if (!MONTH_YEAR.test(s)) return '';
  const d = new Date(`1 ${s} UTC`);
  return d.getTime() <= now ? s : '';
}

export function seriesOf(story, themes) {
  const ids = Array.isArray(story.fieldData?.theme) ? story.fieldData.theme : [];
  const t = themes.find((x) => ids.includes(x.id) && SERIES[x.fieldData?.slug]);
  return t ? t.fieldData.slug : null;
}

export function cardOf(story, series, dest) {
  const f = story.fieldData || {};
  const country = dest.find((d) => d.id === f['country-2'])?.fieldData?.name || '';
  const city = txt(f.city, 60);
  const s = SERIES[series];
  const place = (s.place === 'country' ? country : city || country) || txt(f['byline-location'], 60);
  return { slug: f.slug, title: f.name, excerpt: f.excerpt || '', image: f['hero-image']?.url || '', city, country, series, group: s.group, label: `${s.name}${place ? ` · ${place}` : ''}` };
}

export function storyFields(series, e, now = Date.now()) {
  const when = pastMonthYear(e['series-month-and-year'], now);
  const named = e['permission-to-name'] === true;
  if (series === 'the-free-evening') return { time: OPTION[e['free-evening-time']] || '', start: OPTION[e['free-evening-starting-point']] || '',
    stops: String(e['free-evening-stops'] || '').split(/\n+/).map((l) => l.split('|').map((x) => x.trim())).filter((p) => p[0]).slice(0, 5).map(([stop, move]) => ({ stop: stop.slice(0, 80), move: (move || '').slice(0, 60) })), when };
  if (series === 'plus-one-day') return { extraDays: Number(e['plus-one-day-extra-days']) || null, whoPaid: txt(e['plus-one-day-who-paid-for-what'], 160), best: txt(e['plus-one-day-best-decision']), worst: txt(e['plus-one-day-worst-decision']), when };
  if (series === 'the-first-friend') return { yearsThere: Number(e['first-friend-years-there']) || null, monthsItTook: Number(e['first-friend-months-it-took']) || null,
    where: txt(e['first-friend-where-it-happened'], 80), worked: txt(e['first-friend-what-worked']), didNot: txt(e['first-friend-what-did-not']), when };
  if (series === 'the-partner-who-moved-too') return { from: txt(e['moved-from-country'], 60), to: txt(e['moved-to-country'], 60), years: txt(e['years-abroad'], 40),
    work: txt(e['partner-what-happened-to-my-work']), wish: txt(e['partner-what-i-wish-someone-had-told-me']), when };
  if (series === 'moving-back') return { from: txt(e['moved-from-country'], 60), to: txt(e['moved-to-country'], 60), yearsAway: txt(e['years-abroad'], 40),
    strangest: txt(e['moving-back-strangest-thing-about-home-now']), kept: txt(e['moving-back-what-i-kept-from-abroad']), when };
  if (series === 'the-sitter-was-the-hero') return { sitter: named ? txt(e['sitter-name'], 60) : '', when };
  if (series === 'cats-who-travel') return { carrier: txt(e['cats-carrier-or-harness'], 120), hid: txt(e['cats-where-they-hid'], 120), when };
  if (series === 'first-trip-together') return { when };
  return {};
}

/** The "Pet-friendly or pet-tolerant?" note: the writer's experience, dated, no stars or scores. */
export function petBox(n, now = Date.now()) {
  if (!n) return null;
  const f = n.fieldData || {};
  const box = {
    stayedAt: txt(f['stayed-at'], 100), city: txt(f['stayed-at-city'], 60), url: /^https:\/\/[^\s"'<>]+$/.test(String(f['stayed-at-url'] || '')) ? f['stayed-at-url'] : '',
    paid: txt(f['what-we-paid-for-the-pet'], 160), sizeRule: txt(f['size-or-weight-rule'], 160), welcoming: txt(f['what-made-it-welcoming'], 300), tell: txt(f['what-we-would-tell-the-next-owner'], 300),
    when: pastMonthYear(f['date-of-stay'], now), rel: 'nofollow ugc noopener',
  };
  return box.stayedAt || box.welcoming || box.tell ? box : null;
}

export async function seriesCards(env, fetchImpl) {
  const [themes, stories, dest] = await Promise.all([listAll(env, fetchImpl, env.THEMES_COLLECTION_ID), listLive(env, fetchImpl, env.STORIES_COLLECTION_ID), listAll(env, fetchImpl, env.DESTINATIONS_COLLECTION_ID)]);
  const cards = stories.filter((s) => !s.fieldData?.['external-url']).map((s) => ({ s, series: seriesOf(s, themes) })).filter((x) => x.series)
    .sort((a, b) => String(b.s.fieldData?.['published-date'] || '').localeCompare(String(a.s.fieldData?.['published-date'] || '')))
    .map((x) => cardOf(x.s, x.series, dest));
  return { themes, stories, dest, cards };
}

export function grouped(cards, group) {
  return Object.keys(SERIES).filter((k) => !group || SERIES[k].group === group).map((k) => ({ slug: k, name: SERIES[k].name, group: SERIES[k].group, stories: cards.filter((c) => c.series === k) }));
}

export async function handleSeries(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET' } });
  if (!env.WEBFLOW_TOKEN || !env.THEMES_COLLECTION_ID) return send({ ok: false }, 503, 0);
  const url = new URL(request.url);
  const { themes, stories, dest, cards } = await seriesCards(env, fetchImpl);
  if (url.pathname === '/series') return send({ ok: true, series: grouped(cards, url.searchParams.get('group') || '') });

  const slug = url.searchParams.get('slug') || '';
  const story = stories.find((s) => s.fieldData?.slug === slug);
  if (!story) return send({ ok: true, series: null });
  const series = seriesOf(story, themes);
  // Linked sponsor rule: "Reklame for [Sponsor name]" first, the name linked in a new tab, only when both fields are filled.
  const sf = story.fieldData || {};
  const sponsor = txt(sf['sponsor-name-2'], 80) && /^https:\/\/[^\s"'<>]+$/.test(String(sf['sponsor-url'] || '')) ? { name: txt(sf['sponsor-name-2'], 80), url: sf['sponsor-url'], rel: 'sponsored noopener noreferrer' } : null;
  const [extrasAll, notes] = await Promise.all([
    env.STORY_EXTRAS_COLLECTION_ID ? listAll(env, fetchImpl, env.STORY_EXTRAS_COLLECTION_ID) : [],
    env.PET_NOTES_COLLECTION_ID ? listLive(env, fetchImpl, env.PET_NOTES_COLLECTION_ID) : [],
  ]);
  const e = extrasAll.find((x) => x.fieldData?.story === story.id || x.fieldData?.slug === slug)?.fieldData || {};
  return send({
    ok: true, series, group: series ? SERIES[series].group : null, label: series ? cardOf(story, series, dest).label : '',
    fields: series ? storyFields(series, e, now) : {}, safetyNote: series ? txt(e['safety-note'], 600) : '',
    tripKit: tripKit(e['trip-kit']), sponsor, petBox: petBox(notes.find((n) => n.fieldData?.['story-slug'] === slug), now),
  });
}
