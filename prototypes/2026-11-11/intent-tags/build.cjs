/* Intent Tags prototype: builds index.html from stories.json.
   The rows are written into the HTML so the panel works with JavaScript off.
   Every count is computed here from the data, and recomputed in the page on load.
   Run: node build.cjs */
const fs = require('fs');
const path = require('path');
const HERE = __dirname;
const STORIES = JSON.parse(fs.readFileSync(path.join(HERE, 'stories.json'), 'utf8'));
const SITE = 'https://www.thatlayover.life';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const bySlug = Object.fromEntries(STORIES.map(s => [s.s, s]));
const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);

/* ---------- Geography: derived from the story data ---------- */
function titleCase(s) {
  return s.toLowerCase().replace(/(^|[\s,])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()).replace(/ And /g, ' and ');
}
/* The place label is the story's country field. Five stories have no single country, so the label is the
   last part of their place line (RUDBØL, DENMARK gives Denmark; BALKANS gives Balkans). */
function placeLabel(st) {
  if (st.c) return st.c;
  const parts = st.p.split(',').map(x => x.trim());
  return titleCase(parts[parts.length - 1]);
}
/* Display names and country-page slugs. Türkiye is how the site spells it (place line and /countries/turkiye). */
const DISPLAY = { 'Turkey': 'Türkiye' };
/* ISO 3166 alpha-3 codes, the closest thing a country has to an airport code. */
const ISO3 = { Italy: 'ITA', Spain: 'ESP', 'United States': 'USA', Luxembourg: 'LUX', Brazil: 'BRA', Turkey: 'TUR', France: 'FRA', Thailand: 'THA', Mexico: 'MEX', Malaysia: 'MYS', Laos: 'LAO', India: 'IND', Vietnam: 'VNM', Cambodia: 'KHM', Egypt: 'EGY', Uruguay: 'URY', Portugal: 'PRT', Croatia: 'HRV', 'Costa Rica': 'CRI', Netherlands: 'NLD', Colombia: 'COL', Chile: 'CHL', Indonesia: 'IDN', Qatar: 'QAT', 'El Salvador': 'SLV', Morocco: 'MAR', Paraguay: 'PRY', Eswatini: 'SWZ', Tanzania: 'TZA', Denmark: 'DNK', Montenegro: 'MNE', Ghana: 'GHA', 'South Africa': 'ZAF', Nepal: 'NPL', 'New Zealand': 'NZL', Antarctica: 'ATA' };
/* Country pages checked live (HTTP 200) on 12 Nov 2026. Labels without one (two-country trips, the Balkans) get none. */
const COUNTRY_PAGE = { Turkey: 'turkiye' };
const NO_PAGE = new Set(['Aruba and Curaçao', 'Chile and Argentina', 'Balkans']);
const REGION = {
  Europe: ['Italy', 'Spain', 'Luxembourg', 'Turkey', 'France', 'Portugal', 'Croatia', 'Netherlands', 'Denmark', 'Montenegro', 'Balkans'],
  Asia: ['Thailand', 'Malaysia', 'Laos', 'India', 'Vietnam', 'Cambodia', 'Indonesia', 'Nepal', 'Qatar'],
  Africa: ['Egypt', 'Morocco', 'Eswatini', 'Tanzania', 'Ghana', 'South Africa'],
  'North America and the Caribbean': ['United States', 'Mexico', 'Costa Rica', 'El Salvador', 'Aruba and Curaçao'],
  'South America': ['Brazil', 'Uruguay', 'Colombia', 'Chile', 'Paraguay', 'Chile and Argentina'],
  Oceania: ['New Zealand'],
  Antarctica: ['Antarctica']
};
const regionOf = {};
for (const [r, list] of Object.entries(REGION)) for (const l of list) regionOf[l] = r;

const places = {};
for (const st of STORIES) {
  const l = placeLabel(st);
  if (!regionOf[l]) throw new Error('No region for ' + l + ' (' + st.s + ')');
  (places[l] = places[l] || []).push(st.s);
}

/* ---------- Duration: the two live layover guides ---------- */
const GUIDES = {
  sof: { code: 'SOF', hours: 3, title: 'Three Hours in Sofia, If You Must (from SOF)', url: SITE + '/layovers/sof-sofia-3h', sections: ['Getting in and out', 'The walk-through', 'Practical'] },
  cph: { code: 'CPH', hours: 6, title: 'The 6-Hour Copenhagen Reset (from CPH)', url: SITE + '/layovers/cph-copenhagen-6h', sections: ['Getting in and out', 'The walk-through', 'Practical'] }
};
const DURATION = [
  { tag: 'Under 4 hours', min: 0, max: 4 },
  { tag: '4 to 8 hours', min: 4, max: 8 },
  { tag: '8 to 12 hours', min: 8, max: 12 },
  { tag: 'Overnight layover', min: 12, max: 99, line: 'No guide for a night in the terminal yet.' }
];

/* ---------- Objective: real stories and pages that clearly fit, or Later ---------- */
const P = (title, url, meta) => ({ kind: 'page', title, url, meta });
const OBJECTIVES = [
  { tag: 'Border crossings', stories: ['luxembourg-schengen-road-trip', 'paraguay-poor-monday', 'eswatini-lesotho-how-many-goats-small-car', 'balkans-ev-road-trip-twelve-countries', 'portuguese-coastal-camino-260-km'] },
  { tag: 'Pet relocation', pages: [
      P('The Paw Passport', SITE + '/the-paw-passport', 'PAGE · PET TRAVEL'),
      P('Magnus Waffles', SITE + '/pets/magnus-waffles', "PAGE · THE EDITOR'S SAMOYED, 35 KG"),
      { kind: 'hold', title: 'The EU pet travel guide (€9)', meta: 'HOLD · LINK: KOFI URL FROM NANCY' }
    ], stories: ['luxembourg-schengen-road-trip', 'balkans-ev-road-trip-twelve-countries', 'sort-sol-black-sun-denmark', 'even-brave-boys-get-scared'] },
  { tag: 'Local grocery hacks', later: 'You translate spices in the grocery aisle.', from: 'For Expats' },
  { tag: 'Running a marathon', stories: ['marathon-on-all-7-continents', 'antarctica-marathon', 'new-zealand-is-oceania-too', 'luxembourg-schengen-road-trip', 'eswatini-lesotho-how-many-goats-small-car', 'southern-africa-safari'] },
  { tag: 'Turning a layover into a trip', stories: ['istanbul-me-and-my-champagne-vacay', 'costa-rica-the-layover-was-the-vacation', 'bali-extended-layover-edition', 'doha-layover-dunes-camels-falcons'] },
  { tag: 'Multi-day treks', stories: ['kilimanjaro-someone-was-already-awake', 'nepal-everest-base-camp-dal-bhat-power', 'patagonia-w-trek-christmas-new-year', 'morocco-toubkal-peaks-mules-uno-vengeance', 'portuguese-coastal-camino-260-km'] },
  { tag: 'Going to a wedding', stories: ['chile-santiago-chilean-kazakh-wedding', 'spain-madrid-wedding-ibiza', 'new-orleans-short-girl-wedding-krewe-of-boo', 'oregon-pacific-northwest-epic-trip'] },
  { tag: 'Working remotely', stories: ['laos-slowest-race-in-vientiane', 'eswatini-lesotho-how-many-goats-small-car'] },
  { tag: 'Living abroad', pages: [P('For Expats', SITE + '/for-expats', 'PAGE · OPENING CITY BY CITY')], stories: ['vietnam-ninja-duckies', 'vietnam-weekends-monkeys-in-sweaters', 'vietnam-year-of-the-dragon'] },
  { tag: 'Moving paperwork', later: 'The paperwork, in the order it happens.', from: 'Moving guides, opening city by city' },
  { tag: 'Visa dates', later: 'The dates, remembered for you.', from: 'Visa trackers, opening city by city' },
  { tag: 'City life after the move', later: 'Where to eat, run and get a haircut.', from: 'Lifestyle hubs, opening city by city' }
];
for (const o of OBJECTIVES) for (const s of (o.stories || [])) if (!bySlug[s]) throw new Error('Unknown story ' + s);

/* ---------- HTML pieces ---------- */
let rowIndex = 0;
function flap(code) {
  return '<span class="code" aria-hidden="true">' + [...code].map((ch, i) => '<span class="tile" style="--t:' + i + '">' + esc(ch) + '</span>').join('') + '</span>';
}
function firstPlace(p) { return p.split(',')[0].trim(); }
function storyItem(st) {
  return '<li class="dep" data-search="' + esc(norm([st.t, st.p, st.by].join(' '))) + '"><a href="' + SITE + '/stories/' + st.s + '">' + esc(st.t) + ' <span aria-hidden="true">→</span></a>' +
    '<span class="dep-meta">' + esc(st.p) + ' · ' + esc(st.by.toUpperCase()) + ' · ' + st.m + ' MIN</span></li>';
}
function pageItem(pg) {
  if (pg.kind === 'hold') return '<li class="dep is-hold" data-search="' + esc(norm(pg.title)) + '"><span class="hold-title">' + esc(pg.title) + '</span><span class="dep-meta">' + esc(pg.meta) + '</span></li>';
  return '<li class="dep" data-search="' + esc(norm(pg.title)) + '"><a href="' + pg.url + '">' + esc(pg.title) + ' <span aria-hidden="true">→</span></a><span class="dep-meta">' + esc(pg.meta) + '</span></li>';
}
function liveRow({ id, code, tag, sub, via, gateHead, items, extra, search, hours }) {
  const i = rowIndex++;
  return '<li class="row" data-status="boarding" data-tag="' + esc(norm(tag + ' ' + code)) + '" data-search="' + esc(norm(search)) + '" style="--i:' + Math.min(i % 8, 4) + '">' +
    '<details id="' + id + '"><summary class="line">' + flap(code) +
    '<span class="tag"><span class="tag-name">' + esc(tag) + '</span>' + (sub ? '<span class="tag-sub">' + esc(sub) + '</span>' : '') + '</span>' +
    '<span class="via" data-via' + (hours ? ' data-hours="' + hours + '"' : '') + '>' + esc(via) + '</span>' +
    '<span class="status"><span class="st st-board">Boarding</span><span class="toggle" aria-hidden="true"></span></span></summary>' +
    '<div class="gate"><p class="gate-head">' + esc(gateHead) + '</p><ul class="deps">' + items.join('') + '</ul>' + (extra || '') + '</div></details></li>';
}
function laterRow({ code, tag, sub, from }) {
  const i = rowIndex++;
  return '<li class="row is-later" data-status="later" data-tag="' + esc(norm(tag)) + '" data-search="' + esc(norm(tag + ' ' + sub + ' ' + (from || ''))) + '" style="--i:' + Math.min(i % 8, 4) + '">' +
    '<div class="line">' + flap(code) +
    '<span class="tag"><span class="tag-name">' + esc(tag) + '</span><span class="tag-sub">' + esc(sub) + (from ? ' <span class="from">(' + esc(from) + ')</span>' : '') + '</span></span>' +
    '<span class="via">Coming soon</span>' +
    '<span class="status"><span class="st st-later">Later</span></span></div></li>';
}
const slugify = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Duration board */
const durationRows = DURATION.map(d => {
  const gs = Object.values(GUIDES).filter(g => g.hours >= d.min && g.hours < d.max);
  if (!gs.length) return laterRow({ code: '···', tag: d.tag, sub: d.line || 'No guide this length yet.' });
  const g = gs[0];
  return liveRow({
    id: 'd-' + slugify(d.tag), hours: g.hours, code: g.code, tag: d.tag, sub: g.title, via: plural(gs.length, 'guide', 'guides') + ' · ' + g.hours + ' h',
    gateHead: 'Gate · ' + plural(gs.length, 'guide', 'guides'),
    items: gs.map(g => '<li class="dep" data-search="' + esc(norm(g.title + ' ' + g.code)) + '"><a href="' + g.url + '">' + esc(g.title) + ' <span aria-hidden="true">→</span></a><span class="dep-meta">LAYOVER GUIDE · ' + g.hours + ' HOURS · INSIDE: ' + esc(g.sections.join(' / ').toUpperCase()) + '</span></li>'),
    search: d.tag + ' ' + g.title + ' ' + g.code + ' ' + g.hours + ' hours ' + g.hours + 'h layover guide'
  });
});
const liveGuides = Object.keys(GUIDES).length;

/* Objective board */
let objN = 0;
const objectiveRows = OBJECTIVES.map(o => {
  objN++;
  const code = String(objN).padStart(2, '0');
  if (o.later) return laterRow({ code, tag: o.tag, sub: o.later, from: o.from });
  const sts = (o.stories || []).map(s => bySlug[s]);
  const pages = o.pages || [];
  const linkedPages = pages.filter(p => p.kind === 'page').length;
  const viaParts = [];
  if (linkedPages) viaParts.push(plural(linkedPages, 'page', 'pages'));
  if (sts.length) viaParts.push(plural(sts.length, 'story', 'stories'));
  const sub = pages.filter(p => p.kind === 'page').map(p => p.title).concat([...new Set(sts.map(s => firstPlace(s.p)))]).join(' · ');
  return liveRow({
    id: 'o-' + slugify(o.tag), code, tag: o.tag, sub: sub || pages.map(p => p.title).join(' · '), via: viaParts.join(' · '),
    gateHead: 'Gate · ' + plural(linkedPages + sts.length, 'departure', 'departures'),
    items: pages.map(pageItem).concat(sts.map(storyItem)),
    search: o.tag + ' ' + pages.map(p => p.title).join(' ') + ' ' + sts.map(s => s.t + ' ' + s.p + ' ' + s.by).join(' ')
  });
});

/* Geography board, grouped by region, busiest first */
const regionBlocks = Object.keys(REGION).map(r => {
  const labels = Object.keys(places).filter(l => regionOf[l] === r)
    .sort((a, b) => places[b].length - places[a].length || a.localeCompare(b));
  const n = labels.reduce((t, l) => t + places[l].length, 0);
  return { r, labels, n };
}).filter(b => b.n).sort((a, b) => b.n - a.n || a.r.localeCompare(b.r));

const geoHtml = regionBlocks.map(b => {
  const rows = b.labels.map(l => {
    const sts = places[l].map(s => bySlug[s]);
    const name = DISPLAY[l] || l;
    const pageSlug = NO_PAGE.has(l) ? null : (COUNTRY_PAGE[l] || slugify(l));
    const extra = pageSlug ? '<p class="gate-foot"><a class="tl" href="' + SITE + '/countries/' + pageSlug + '">Country page: ' + esc(name) + ' <span aria-hidden="true">→</span></a></p>' : '';
    return liveRow({
      id: 'g-' + slugify(l), code: ISO3[l] || 'MULTI', tag: name, sub: [...new Set(sts.map(s => firstPlace(s.p)))].join(' · '),
      via: plural(sts.length, 'story', 'stories'), gateHead: 'Gate · ' + plural(sts.length, 'departure', 'departures'),
      items: sts.map(storyItem), extra, search: name + ' ' + l + ' ' + b.r + ' ' + sts.map(s => s.t + ' ' + s.p + ' ' + s.by).join(' ')
    }).replace('<li class="row"', '<li class="row" data-place="' + esc(l) + '"');
  }).join('\n');
  return '<section class="region" aria-labelledby="r-' + slugify(b.r) + '"><h3 class="region-head" id="r-' + slugify(b.r) + '">' + esc(b.r) + ' <span class="region-n" data-region-n>' + plural(b.n, 'story', 'stories') + '</span></h3>' + colHead() + '<ol class="rows" role="list">' + rows + '</ol></section>';
}).join('\n');

function colHead() {
  return '<div class="cols" aria-hidden="true"><span>Code</span><span>Tag</span><span>Going to</span><span>Status</span></div>';
}

const totalTags = (durationRows.join('') + objectiveRows.join('') + geoHtml).split('<li class="row').length - 1;
const placeCount = Object.keys(places).length;

/* ---------- Page ---------- */
const tpl = fs.readFileSync(path.join(HERE, 'template.html'), 'utf8');
const lean = STORIES.map(({ s, t, p, c, by, m }) => ({ s, t, p, c, by, m }));
const out = tpl
  .replace('{{DURATION_ROWS}}', durationRows.join('\n'))
  .replace('{{OBJECTIVE_ROWS}}', objectiveRows.join('\n'))
  .replace('{{GEO}}', geoHtml)
  .replace(/\{\{COLS\}\}/g, colHead())
  .replace(/\{\{N_STORIES\}\}/g, STORIES.length)
  .replace(/\{\{N_GUIDES\}\}/g, liveGuides)
  .replace(/\{\{N_TAGS\}\}/g, totalTags)
  .replace(/\{\{N_PLACES\}\}/g, placeCount)
  .replace(/\{\{N_BOARDS\}\}/g, (tpl.match(/class="board"/g) || []).length)
  .replace('{{STORIES_JSON}}', JSON.stringify(lean).replace(/</g, '\\u003c'));
fs.writeFileSync(path.join(HERE, 'index.html'), out);
console.log('index.html written:', out.length, 'bytes;', totalTags, 'tags;', placeCount, 'places;', STORIES.length, 'stories');
