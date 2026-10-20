/* The Map 2.0 for thatlayover.life. Plain JavaScript, no build step.
   Built to the Claude Design file "TLL Map Layers" (7 Oct 2026): dark canvas, depth fills, one shape per shelf,
   a drawer switcher with every list, the receipts (one card per list), sets of seven, the lines strip, framed embeds.
   Mounts into #tll-map-layers. Reads collections.json, and a list's data file only when that list is switched on.
   20 Oct 2026 (B3, Nancy: "Everything on this page needs to live calculate"): every number is counted live from the
   member's saved map (tllStates) and logbook (tllLog, tllParks), or for visitors from the site owner's live map
   (data-tll-owner-url, falling back to data/owner-record.json). counts.json and extremes.json are no longer read. */
/* TLL map counts (B3, 20 October 2026). Pure functions, no DOM: the map below and test/map-live-counts.test.js share them.
   Counting rules are COUNT-RULES.md (19 October 2026): places = Lived or Stayed by any person on the account, Antarctica
   included; countries = places without Antarctica; layover-only places counted apart; pets never in the member's numbers.
   The tables are geography facts, not counts: ISO 3166-1 numeric (249 codes) plus Kosovo 900 by continent (UN M49
   regions, the Americas split into North and South, Antarctica its own continent), and the 193 UN member states. */
(function (g) {
  'use strict';
  var CONTINENTS = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];
  var BY_CONTINENT = {
    'Africa': '012 024 072 086 108 120 132 140 148 174 175 178 180 204 226 231 232 260 262 266 270 288 324 384 404 426 430 434 450 454 466 478 480 504 508 516 562 566 624 638 646 654 678 686 690 694 706 710 716 728 729 732 748 768 788 800 818 834 854 894',
    'Antarctica': '010',
    'Asia': '004 031 048 050 051 064 096 104 116 144 156 158 196 268 275 344 356 360 364 368 376 392 398 400 408 410 414 417 418 422 446 458 462 496 512 524 586 608 626 634 682 702 704 760 762 764 784 792 795 860 887',
    'Europe': '008 020 040 056 070 100 112 191 203 208 233 234 246 248 250 276 292 300 336 348 352 372 380 428 438 440 442 470 492 498 499 528 578 616 620 642 643 674 688 703 705 724 744 752 756 804 807 826 831 832 833 900',
    'North America': '028 044 052 060 084 092 124 136 188 192 212 214 222 304 308 312 320 332 340 388 474 484 500 531 533 534 535 558 591 630 652 659 660 662 663 666 670 780 796 840 850',
    'Oceania': '016 036 090 162 166 184 242 258 296 316 334 520 540 548 554 570 574 580 581 583 584 585 598 612 772 776 798 876 882',
    'South America': '032 068 074 076 152 170 218 238 239 254 328 600 604 740 858 862'
  };
  var UN_MEMBERS = '004 008 012 020 024 028 031 032 036 040 044 048 050 051 052 056 064 068 070 072 076 084 090 096 100 104 108 112 116 120 124 132 140 144 148 152 156 170 174 178 180 188 191 192 196 203 204 208 212 214 218 222 226 231 232 233 242 246 250 262 266 268 270 276 288 296 300 308 320 324 328 332 340 348 352 356 360 364 368 372 376 380 384 388 392 398 400 404 408 410 414 417 418 422 426 428 430 434 438 440 442 450 454 458 462 466 470 478 480 484 492 496 498 499 504 508 512 516 520 524 528 548 554 558 562 566 578 583 584 585 586 591 598 600 604 608 616 620 624 626 634 642 643 646 659 662 670 674 678 682 686 688 690 694 702 703 704 705 706 710 716 724 728 729 740 748 752 756 760 762 764 768 776 780 784 788 792 795 798 800 804 807 818 826 834 840 854 858 860 862 882 887 894';
  var OBSERVERS = ['336', '275']; // Holy See, Palestine
  var EXTRA = { '901': 'Asia', '902': 'Africa' }; // Northern Cyprus, Somaliland, if a record ever holds them (COUNT-RULES 2)
  var ANTARCTICA = '010', KOSOVO = '900';
  var CONT = {}, ISO = {}, UN = {}, UNO = {};
  Object.keys(BY_CONTINENT).forEach(function (c) { BY_CONTINENT[c].split(' ').forEach(function (k) { CONT[k] = c; ISO[k] = 1; }); });
  Object.keys(EXTRA).forEach(function (k) { CONT[k] = EXTRA[k]; });
  UN_MEMBERS.split(' ').forEach(function (k) { UN[k] = 1; UNO[k] = 1; });
  OBSERVERS.forEach(function (k) { UNO[k] = 1; });
  var RANK = { layover: 1, visited: 2, lived: 3 };

  // One key per place: older records saved Kosovo as 'undefined' or 'XK'; anything that is not three digits is dropped.
  function canon(k) { k = String(k); if (k === 'undefined' || k === 'XK' || k === KOSOVO) return KOSOVO; return /^\d{3}$/.test(k) ? k : null; }
  function better(a, v) { return RANK[v] && (!a || RANK[v] > RANK[a]) ? v : a; }

  // Rulebook whys (Nancy, 20 October 2026: "need to identify the whys on our lists"). Every one of the 250 entries that is
  // not among the 193 UN members, with its kind and one plain line. Kinds: antarctica (a), observer (o), partial (p), territory (t).
  var WHY_KIND = { a: 'antarctica', o: 'observer', p: 'partial', t: 'territory' };
  var WHY_TAIL = { a: 'Counts as a place and a continent, not in the country count or any UN list.', o: 'Counts in the 249 and in the 195, not among the 193 UN members.',
    p: 'Counts in the 249, not among the 193 UN members.', t: 'Counts in the 249, not among the 193 UN members.' };
  var WHY = {
    '010': ['a', 'Antarctica', 'A continent, not a country.'],
    '016': ['t', 'American Samoa', 'US territory.'],
    '060': ['t', 'Bermuda', 'British territory.'],
    '074': ['t', 'Bouvet Island', 'Uninhabited Norwegian island.'],
    '086': ['t', 'British Indian Ocean Territory', 'British-administered islands with no permanent residents.'],
    '092': ['t', 'British Virgin Islands', 'British territory.'],
    '136': ['t', 'Cayman Islands', 'British territory.'],
    '158': ['p', 'Taiwan', 'Not a UN member, recognized by some governments.'],
    '162': ['t', 'Christmas Island', 'Australian territory.'],
    '166': ['t', 'Cocos (Keeling) Islands', 'Australian territory.'],
    '175': ['t', 'Mayotte', 'Overseas department of France, with its own ISO code.'],
    '184': ['t', 'Cook Islands', 'Self-governing, in free association with New Zealand.'],
    '234': ['t', 'Faroe Islands', 'Self-governing Danish islands.'],
    '238': ['t', 'Falkland Islands', 'British territory.'],
    '239': ['t', 'South Georgia and the South Sandwich Islands', 'British islands with no permanent residents.'],
    '248': ['t', 'Åland Islands', 'Autonomous region of Finland.'],
    '254': ['t', 'French Guiana', 'Overseas department of France, with its own ISO code.'],
    '258': ['t', 'French Polynesia', 'French territory.'],
    '260': ['t', 'French Southern Territories', 'French islands with no permanent residents.'],
    '275': ['o', 'Palestine', 'UN observer state.'],
    '292': ['t', 'Gibraltar', 'British territory.'],
    '304': ['t', 'Greenland', 'Autonomous Danish territory.'],
    '312': ['t', 'Guadeloupe', 'Overseas department of France, with its own ISO code.'],
    '316': ['t', 'Guam', 'US territory.'],
    '334': ['t', 'Heard Island and McDonald Islands', 'Uninhabited Australian islands.'],
    '336': ['o', 'Holy See', 'UN observer state.'],
    '344': ['t', 'Hong Kong', 'Special administrative region of China.'],
    '446': ['t', 'Macao', 'Special administrative region of China.'],
    '474': ['t', 'Martinique', 'Overseas department of France, with its own ISO code.'],
    '500': ['t', 'Montserrat', 'British territory.'],
    '531': ['t', 'Curaçao', 'Self-governing part of the Kingdom of the Netherlands.'],
    '533': ['t', 'Aruba', 'Self-governing part of the Kingdom of the Netherlands.'],
    '534': ['t', 'Sint Maarten', 'Self-governing part of the Kingdom of the Netherlands.'],
    '535': ['t', 'Caribbean Netherlands', 'Special municipalities of the Netherlands.'],
    '540': ['t', 'New Caledonia', 'French territory.'],
    '570': ['t', 'Niue', 'Self-governing, in free association with New Zealand.'],
    '574': ['t', 'Norfolk Island', 'Australian territory.'],
    '580': ['t', 'Northern Mariana Islands', 'US territory.'],
    '581': ['t', 'US Minor Outlying Islands', 'US islands with no permanent residents.'],
    '612': ['t', 'Pitcairn Islands', 'British territory.'],
    '630': ['t', 'Puerto Rico', 'US territory.'],
    '638': ['t', 'Réunion', 'Overseas department of France, with its own ISO code.'],
    '652': ['t', 'Saint Barthélemy', 'French territory.'],
    '654': ['t', 'Saint Helena, Ascension and Tristan da Cunha', 'British territory.'],
    '660': ['t', 'Anguilla', 'British territory.'],
    '663': ['t', 'Saint Martin', 'French territory, the French side of the island.'],
    '666': ['t', 'Saint Pierre and Miquelon', 'French territory.'],
    '732': ['t', 'Western Sahara', 'Disputed territory.'],
    '744': ['t', 'Svalbard and Jan Mayen', 'Norwegian islands, with their own ISO code.'],
    '772': ['t', 'Tokelau', 'New Zealand territory.'],
    '796': ['t', 'Turks and Caicos Islands', 'British territory.'],
    '831': ['t', 'Guernsey', 'British Crown Dependency.'],
    '832': ['t', 'Jersey', 'British Crown Dependency.'],
    '833': ['t', 'Isle of Man', 'British Crown Dependency.'],
    '850': ['t', 'US Virgin Islands', 'US territory.'],
    '876': ['t', 'Wallis and Futuna', 'French territory.'],
    '900': ['p', 'Kosovo', 'Not a UN member, recognized by some governments.']
  };
  // why('540') -> { kind: 'territory', name: 'New Caledonia', label: 'French territory.', text: 'French territory. Counts in the 249, ...' }; null for a UN member.
  function why(k) { var c = canon(k), w = c && WHY[c]; return w ? { kind: WHY_KIND[w[0]], name: w[1], label: w[2], text: w[2] + ' ' + WHY_TAIL[w[0]] } : null; }

  function countRecord(raw) {
    var out = { ok: false, places: 0, countries: 0, antarctica: false, layovers: 0, lived: 0, stayed: 0, continents: [], codes: 0, un: 0, unObservers: 0,
      placeIsos: [], countryIsos: [], layoverIsos: [], best: {}, pets: [] };
    if (!raw || raw.v !== 2 || !raw.states || typeof raw.states !== 'object') return out;
    out.ok = true;
    var hum = {}, pet = {}, anyHum = false, petSeen = {};
    (Array.isArray(raw.travelers) ? raw.travelers : []).forEach(function (t) {
      if (!t || t.id == null) return; var id = String(t.id);
      if (t.pet) { pet[id] = 1; petSeen[id] = {}; out.pets.push({ id: id, name: String(t.name || 'Pet'), places: 0 }); } else { hum[id] = 1; anyHum = true; }
    });
    // Listed people make the member's numbers (same as the S94 count function); with nobody listed, every id that is not a pet.
    Object.keys(raw.states).forEach(function (k) {
      var iso = canon(k); if (!iso) return;
      var row = raw.states[k] || {}, b = out.best[iso] || '';
      Object.keys(row).forEach(function (id) {
        if (pet[id]) { if (RANK[row[id]]) petSeen[id][iso] = 1; return; }
        if (anyHum && !hum[id]) return;
        b = better(b, row[id]);
      });
      if (b) out.best[iso] = b;
    });
    var cs = {};
    Object.keys(out.best).sort().forEach(function (iso) {
      var b = out.best[iso];
      if (b === 'layover') { out.layovers++; out.layoverIsos.push(iso); return; }
      out.places++; out.placeIsos.push(iso); if (b === 'lived') out.lived++; else out.stayed++;
      if (iso === ANTARCTICA) out.antarctica = true; else { out.countries++; out.countryIsos.push(iso); }
      if (CONT[iso]) cs[CONT[iso]] = 1;
      if (ISO[iso]) out.codes++;
      if (UN[iso]) out.un++;
      if (UNO[iso]) out.unObservers++;
    });
    out.continents = CONTINENTS.filter(function (c) { return cs[c]; });
    out.pets.forEach(function (p) { p.places = Object.keys(petSeen[p.id]).length; });
    return out;
  }

  // The logbook: tllLog {v:1, parks:[{n,at}], cities:[...], airports:[...]} and tllParks {v:1, parks:{CODE:time}}.
  // A name logged twice counts once. Parks everywhere = US park codes plus the other parks.
  function names(a) { var s = {}, n = 0; (Array.isArray(a) ? a : []).forEach(function (e) { var k = e && e.n != null ? String(e.n).toLowerCase().replace(/\s+/g, ' ').trim() : ''; if (k && !s[k]) { s[k] = 1; n++; } }); return n; }
  function countLogbook(log, parks) {
    var okLog = !!(log && typeof log === 'object'), p = parks && typeof parks === 'object' && parks.parks && typeof parks.parks === 'object' ? parks.parks : null;
    var us = p ? Object.keys(p).length : 0, other = okLog ? names(log.parks) : 0;
    return { ok: okLog || !!p, cities: okLog ? names(log.cities) : 0, airports: okLog ? names(log.airports) : 0, usParks: us, parksEverywhere: us + other };
  }

  // Lines and extremes by country: each country at the center of its shape, from centroid(iso) -> [lon, lat].
  function lines(isos, centroid) {
    var out = { n: 0, north: null, south: null, east: null, west: null, hemispheres: [], hemisphereCount: 0, equator: false, meridian: false }, N = false, S = false, E = false, W = false;
    (isos || []).forEach(function (iso) {
      var c = centroid(iso); if (!c || !isFinite(c[0]) || !isFinite(c[1])) return;
      var lon = +c[0], lat = +c[1]; while (lon > 180) lon -= 360; while (lon < -180) lon += 360;
      var p = { iso: iso, lat: lat, lon: lon }; out.n++;
      if (!out.north || lat > out.north.lat) out.north = p;
      if (!out.south || lat < out.south.lat) out.south = p;
      if (!out.east || lon > out.east.lon) out.east = p;
      if (!out.west || lon < out.west.lon) out.west = p;
      if (lat > 0) N = true; if (lat < 0) S = true; if (lon > 0) E = true; if (lon < 0) W = true;
    });
    out.hemispheres = [N && 'N', S && 'S', E && 'E', W && 'W'].filter(Boolean); out.hemisphereCount = out.hemispheres.length;
    out.equator = N && S; out.meridian = E && W;
    return out;
  }

  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function toMs(v) { if (v == null || v === '') return 0; var n = +v; if (isFinite(n) && n > 0) return n; var t = Date.parse(v); return isFinite(t) ? t : 0; }
  function dateLabel(v) { var t = toMs(v); if (!t) return ''; var d = new Date(t); return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); } // 19 October 2026

  var api = { CONTINENTS: CONTINENTS, canon: canon, continentOf: function (k) { var c = canon(k); return c ? CONT[c] || null : null; },
    isIso: function (k) { var c = canon(k); return !!(c && ISO[c]); }, isUN: function (k) { return !!UN[canon(k)]; }, isUNorObserver: function (k) { return !!UNO[canon(k)]; },
    isoCount: Object.keys(ISO).length, unCount: Object.keys(UN).length, unObserverCount: Object.keys(UNO).length,
    countRecord: countRecord, countLogbook: countLogbook, lines: lines, toMs: toMs, dateLabel: dateLabel, why: why, whyIds: Object.keys(WHY).sort() };
  if (typeof module === 'object' && module && module.exports) module.exports = api;
  if (g) g.TLLMapCounts = api;
})(typeof window !== 'undefined' ? window : null);

(function () {
  'use strict';
  if (typeof document === 'undefined') return; // loaded by the tests for TLLMapCounts only
  if (window.__tllMapLayers) return; window.__tllMapLayers = 1;
  var root = document.getElementById('tll-map-layers'); if (!root) return;
  var K = window.TLLMapCounts;

  var VER = root.getAttribute('data-tll-version') || 'main';
  var CDN = 'https://cdn.jsdelivr.net/gh/carleton71192/thatlayoverlife@' + VER + '/map-2.0/';
  var DATA = (root.getAttribute('data-tll-data') || (CDN + 'data/')).replace(/\/?$/, '/');
  var CONFIG = root.getAttribute('data-tll-config') || (DATA.replace(/data\/$/, '') + 'collections.json');
  var ATLAS = root.getAttribute('data-tll-atlas') || 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';
  // B3.9: the OpenFreeMap dark tiles were the biggest download and the countries draw from our own shapes either way.
  // Empty, missing or the OpenFreeMap URL means the built-in plain base style; any other style URL still works.
  var STYLE_ATTR = (root.getAttribute('data-tll-style') || '').trim();
  var STYLE = !STYLE_ATTR || /openfreemap\.org/i.test(STYLE_ATTR) ? null : STYLE_ATTR;
  var OWNER_URL = (root.getAttribute('data-tll-owner-url') || '').trim(); // B3.7: a GET that returns the owner's tllStates v2
  var LIB = root.getAttribute('data-tll-lib') || 'https://cdn.jsdelivr.net/npm/maplibre-gl@5.24.0/dist/maplibre-gl';
  var TOPO = root.getAttribute('data-tll-topojson') || 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js';
  var NOT_YET = root.getAttribute('data-tll-not-yet') === 'full' ? '#E9E1D3' : '#2E2D33'; // design prop "notYet": Cream dimmed (default) or Cream full
  var STREET_ZOOM = 5;

  // Tokens (design 1g)
  var C = { ink: '#0A0B14', card: '#12141F', hair: '#232744', cream: '#F7F1E8', rose: '#F0507A', roseDeep: '#9C3A5C', stayed: '#067A79', roseText: '#FF7093', teal: '#00C9C8',
    sphere: '#10121C', grat: '#1A1D2E', landOff: '#1B1E2E', notYet: NOT_YET, hatchBg: '#3B1A2A', muted: '#B9C0D0' };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- helpers ----------
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function script(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.async = true; s.onload = ok; s.onerror = function () { no(new Error('Could not load ' + src)); }; document.head.appendChild(s); }); }
  function css(href) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l); }
  function getJSON(u) { return fetch(u, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + u); return r.json(); }); }
  function fail(msg) { root.appendChild(el('p', 'tllm-err', msg)); }
  function upper(s) { return String(s || '').toUpperCase(); }
  function fill(tpl, v) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] != null ? fmt(v[k]) : m; }); }

  // ---------- state ----------
  var cfg, counts = {}, vars = {}, shelves = {}, colls = [], byId = {}, srcs = {}, empty = {};
  var map, topojson, countryRows = {}, loggedIso = {}, loaded = {}, active = {}, popup, tip, status, heatKey, LINES = null;
  var LOG = null, MEMBER_LOG = null, OWNER_LOG = null, SAVED_AT = 0, savedBar, savedText, savedMsg, savedBtn;
  var mapStarted = false, mapReady = false, pending = {}, ownerP = Promise.resolve();
  var bar, onChips, drawer, drawerBtn, listBox, listUl, listFilter, secCards, secRules, secSets, secStrip, secFrames;

  root.classList.add('tllm'); root.setAttribute('data-tll-map-layers', '2.0');

  getJSON(CONFIG)
    .then(function (c) {
      cfg = c;
      (cfg.shelves || []).forEach(function (s) { shelves[s.id] = s; });
      // B3.5: a list with no way for a member to log it keeps its file but leaves the page for everyone (chips, drawer,
      // cards, pins) while its collections.json entry carries "hidden_until_loggable": true.
      colls = (cfg.collections || []).filter(function (x) { return !x.hidden_until_loggable; }); colls.forEach(function (x) { byId[x.id] = x; });
      srcs = cfg.sources || {}; empty = cfg.empty_copy || {};
      ownerCheck(); REC = recordFromStorage();
      buildUI();
      applyRecord(REC);
      ownerP = loadOwner().then(function (o) { OWNER = o; applyRecord(!REC ? o : null); });
      watchRecord();
      whenNear(document.getElementById('tllm-stage'), startMap);
    })
    .catch(function (e) { fail('The map could not start: ' + e.message); });

  // B3.9: MapLibre, its stylesheet and the country shapes load only once the map is about one screen away.
  function whenNear(target, go) {
    if (!target || !('IntersectionObserver' in window)) return go();
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); go(); } }, { rootMargin: '100% 0px 100% 0px' });
    io.observe(target);
  }
  function startMap() {
    if (mapStarted) return; mapStarted = true;
    css(LIB + '.css');
    Promise.all([script(LIB + '.js'), script(TOPO), ownerP])
      .then(function () { topojson = window.topojson; return initMap(); })
      .then(function () {
        mapReady = true;
        colls.forEach(function (c) { var on = Object.prototype.hasOwnProperty.call(pending, c.id) ? pending[c.id] : !!c.default_on; if (on || c.id === 'countries') toggle(c.id, on); });
        applyRecord(null);
      })
      .catch(function (e) { fail('The map could not start: ' + e.message); });
  }
  // B3.7: visitors see the site owner's live map. Fallback: the 7 October copy in data/owner-record.json.
  function loadOwner() {
    function fallback() { OWNER_LOG = null; return getJSON(DATA + 'owner-record.json').then(function (j) { return normalizeRecord(j, 'owner'); }).catch(function () { return null; }); }
    if (!OWNER_URL) return fallback();
    return getJSON(OWNER_URL).then(function (j) {
      var raw = j && j.v === 2 && j.states ? j : (j && j.tllStates && j.tllStates.v === 2 ? j.tllStates : null);
      var rec = normalizeRecord(raw, 'owner'); if (!rec) return fallback();
      OWNER_LOG = j.tllLog || j.tllParks ? { log: j.tllLog || null, parks: j.tllParks || null } : null; // only if the route ever carries the logbook
      return rec;
    }).catch(fallback);
  }

  // ---------- the member record ----------
  // tllStates v2, written by the map editor and mirrored by the page head into localStorage and the Memberstack
  // member JSON: { v:2, travelers:[{id,name,color,pet}], states:{ '208': { t1:'lived', t2:'visited' } } }.
  // The first traveler who is not a pet is the member; pets become the paw layer. Logged-out visitors get the
  // site owner's copy from data/owner-record.json. Counting rule (Nancy, 8 Oct 2026): Lived and Stayed make the
  // total; layovers are counted on their own line and never in the total; pins from Places Been only propose.
  var REC = null, OWNER = null, fcCountries = null, DEPTH = { lived: 'Lived', visited: 'Stayed', layover: 'Layover only' };
  // Places Been pins are the site owner's. They propose countries only on the owner's map: the showcase copy, or a live
  // record that holds nearly all of the showcase countries (no member id needed to tell).
  function isOwnerRecord(r) { if (!r) return false; if (r.source === 'owner') return true; if (!OWNER) return false; var k = Object.keys(OWNER.me), hit = 0; k.forEach(function (i) { if (r.me[i]) hit++; }); return k.length > 0 && hit / k.length >= 0.8; }
  function normalizeRecord(raw, source) {
    if (!raw || raw.v !== 2 || !raw.states) return null;
    if (!raw.travelers) raw.travelers = [];
    var me = null, pets = [];
    (raw.travelers || []).forEach(function (t) { if (!t || !t.id) return; if (t.pet) pets.push({ id: String(t.id), name: String(t.name || 'Pet'), states: {} }); else if (!me) me = String(t.id); });
    if (!me) me = 't1';
    // me: the member's own depths (the log buttons). all: the best depth of anyone on the account (the fills).
    // count: the numbers, from TLLMapCounts. Kosovo is 'XK' on the map shapes, whatever key the record used.
    var count = K.countRecord(raw), out = { me: {}, all: {}, pets: pets, source: source, raw: raw, count: count };
    Object.keys(raw.states).forEach(function (k) {
      var e = raw.states[k] || {}, id = k === 'undefined' || k === '900' ? 'XK' : String(k);
      if (e[me] && DEPTH[e[me]]) out.me[id] = DEPTH[e[me]];
      pets.forEach(function (p) { if (e[p.id]) p.states[id] = DEPTH[e[p.id]] || 'Stayed'; });
    });
    Object.keys(count.best).forEach(function (iso) { out.all[iso === '900' ? 'XK' : iso] = DEPTH[count.best[iso]]; });
    return out;
  }
  var member = null; // true once Memberstack reports a logged-in member, false once it reports none or never loads
  function ownerCheck() { // B42: a browser copy belongs to the member who wrote it
    try { var mid = localStorage.getItem('_ms-mid') || '', own = localStorage.getItem('tllStatesOwner') || ''; if (mid && own && own !== mid) { localStorage.removeItem('tllStates'); localStorage.removeItem('tllStatesAt'); } if (mid) localStorage.setItem('tllStatesOwner', mid); } catch (e) {}
  }
  function canEdit() { return member === true || !!(REC && REC.source === 'local'); }
  root.tllmState = function () { return { member: member, source: REC && REC.source, canEdit: canEdit(), mapStarted: mapStarted, record: REC && REC.count, logbook: LOG ? K.countLogbook(LOG.log, LOG.parks) : null, lines: LINES, savedAt: SAVED_AT }; };
  function rawRecord() {
    var raw = null; try { raw = JSON.parse(localStorage.getItem('tllStates') || 'null'); } catch (e) {}
    if (!raw || raw.v !== 2 || !raw.states) raw = { v: 2, travelers: [], states: {} };
    if (!raw.travelers || !raw.travelers.length) raw.travelers = [{ id: 't1', name: 'Me', color: C.rose, pet: false }];
    return raw;
  }
  // Logging from the map (phase 6, 8 Oct 2026). Same tllStates v2 record the editor writes: browser copy first, then the
  // page's own sync (window.__tllPush on /the-map) or a direct Memberstack member JSON update elsewhere. The old SVG editor,
  // when present, follows through window.__tllMapApply.
  var pushTimer, pushLast = '';
  function pushMemberstack(raw) {
    var j; try { j = JSON.stringify(raw); } catch (e) { return; } if (j === pushLast) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () {
      var ms = window.$memberstackDom; if (!ms) return;
      ms.getCurrentMember().then(function (r) {
        if (!r || !r.data) return;
        return ms.getMemberJSON().then(function (mj) { var json = (mj && mj.data) || {}; var t = Date.now(); json.tllStates = JSON.parse(j); json.tllStatesAt = t; return ms.updateMemberJSON({ json: json }).then(function () { pushLast = j; SAVED_AT = t; renderSaved(); try { localStorage.setItem('tllStatesAt', String(t)); } catch (err) {} }); });
      }).catch(function () {});
    }, 1200);
  }
  function writeDepth(iso, key) {
    var raw = rawRecord(), me = null;
    raw.travelers.forEach(function (t) { if (!me && t && t.id && !t.pet) me = String(t.id); });
    if (!me) { raw.travelers.unshift({ id: 't1', name: 'Me', color: C.rose, pet: false }); me = 't1'; }
    var e = raw.states[iso] || {}; if (key) e[me] = key; else delete e[me];
    if (Object.keys(e).length) raw.states[iso] = e; else delete raw.states[iso];
    try { localStorage.setItem('tllStates', JSON.stringify(raw)); } catch (err) {} // 20 Oct 2026: tllStatesAt is stamped after a successful save, not here
    if (window.__tllMapApply) { try { window.__tllMapApply(JSON.parse(JSON.stringify(raw))); } catch (err) {} }
    if (window.__tllPush) window.__tllPush(raw); else pushMemberstack(raw);
    applyRecord(normalizeRecord(raw, 'local'));
  }
  function recordFromStorage() { try { return normalizeRecord(JSON.parse(localStorage.getItem('tllStates') || 'null'), 'local'); } catch (e) { return null; } }
  // B3.3: the logbook. Signed in: the member JSON (tllLog, tllParks). Otherwise the browser copies under the same keys.
  function readJSONKey(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function logFromStorage() { var l = readJSONKey('tllLog'), p = readJSONKey('tllParks'); return l || p ? { log: l, parks: p } : null; }
  function takeMemberJSON(j) { MEMBER_LOG = { log: j.tllLog || null, parks: j.tllParks || null }; var t = K.toMs(j.tllStatesAt); if (t) SAVED_AT = t; }
  function recordFromMemberstack() {
    var ms = window.$memberstackDom; if (!ms || !ms.getCurrentMember) return Promise.resolve(null);
    return ms.getCurrentMember().then(function (r) {
      member = !!(r && r.data); if (!member) return null;
      return ms.getMemberJSON().then(function (mj) { var j = (mj && mj.data) || {}; takeMemberJSON(j); return normalizeRecord(j.tllStates, 'member') || normalizeRecord({ v: 2, travelers: [], states: {} }, 'member'); });
    }).catch(function () { return null; });
  }
  // Same-tab saves (the logbook, the map sync) go through updateMemberJSON; once one resolves, the cards follow it.
  function hookSaves(ms) {
    if (!ms || !ms.updateMemberJSON || ms.__tllmHooked) return; ms.__tllmHooked = 1;
    var orig = ms.updateMemberJSON.bind(ms);
    ms.updateMemberJSON = function (arg) {
      var p = orig(arg), j = arg && arg.json;
      if (j && p && p.then) p.then(function () {
        if (member !== true) return;
        if (j.tllLog || j.tllParks) MEMBER_LOG = { log: j.tllLog || (MEMBER_LOG && MEMBER_LOG.log) || null, parks: j.tllParks || (MEMBER_LOG && MEMBER_LOG.parks) || null };
        if (j.tllStates) { var t = K.toMs(j.tllStatesAt); if (t) SAVED_AT = t; }
        applyRecord(null);
      }, function () {});
      return p;
    };
  }
  // B3.8: "Refresh from my account" reads the member JSON again; the account wins over the browser copy.
  function refreshFromAccount() {
    var ms = window.$memberstackDom; if (!ms || !ms.getMemberJSON) { savedMsg.textContent = 'Your account is not reachable right now. Try again in a moment.'; return; }
    savedBtn.setAttribute('aria-busy', 'true'); savedBtn.disabled = true; savedMsg.textContent = '';
    ms.getMemberJSON().then(function (mj) {
      var j = (mj && mj.data) || {}, raw = j.tllStates && j.tllStates.v === 2 && j.tllStates.states ? j.tllStates : null;
      try { if (raw) localStorage.setItem('tllStates', JSON.stringify(raw)); if (K.toMs(j.tllStatesAt)) localStorage.setItem('tllStatesAt', String(j.tllStatesAt)); } catch (e) {}
      takeMemberJSON(j);
      if (raw && window.__tllMapApply) { try { window.__tllMapApply(JSON.parse(JSON.stringify(raw))); } catch (e) {} }
      applyRecord(normalizeRecord(raw || { v: 2, travelers: [], states: {} }, 'member'));
      savedMsg.textContent = 'Refreshed from your account.';
    }).catch(function () { savedMsg.textContent = 'That did not load. Check your connection and try again.'; })
      .then(function () { savedBtn.removeAttribute('aria-busy'); savedBtn.disabled = false; });
  }
  function renderSaved() {
    if (!savedBar) return;
    savedBar.hidden = member !== true;
    var d = K.dateLabel(SAVED_AT); savedText.textContent = d ? 'Last saved ' + d : ''; savedText.hidden = !d;
  }
  function watchRecord() {
    var tries = 0, iv = setInterval(function () {
      if (window.$memberstackDom) { clearInterval(iv); hookSaves(window.$memberstackDom); recordFromMemberstack().then(function (r) { applyRecord(r); }); }
      else if (++tries > 40) { clearInterval(iv); if (member === null) { member = false; applyRecord(null); } }
    }, 300);
    window.addEventListener('tll:states', function (e) { var r = normalizeRecord(e.detail, 'local'); if (r) applyRecord(r); });
    // The logbook embed fires 'tll:log' ({log, parks}) in this tab after each save; 'storage' covers other tabs.
    window.addEventListener('tll:log', function (e) {
      var d = e && e.detail || {}, l = { log: d.log || null, parks: d.parks || null };
      if (member === true) MEMBER_LOG = l; applyRecord(null);
    });
    window.addEventListener('storage', function (e) {
      if (e.key === 'tllStates') { var r = recordFromStorage(); if (r) applyRecord(r); }
      else if (e.key === 'tllLog' || e.key === 'tllParks') { if (member === true) MEMBER_LOG = logFromStorage(); applyRecord(null); }
      else if (e.key === 'tllStatesAt' && member === true) { var t = K.toMs(e.newValue); if (t) { SAVED_AT = t; renderSaved(); } }
    });
  }
  function setDepthProps(f, id, row) {
    var d = REC ? (REC.all[id] || '') : ''; // no record, no fill: the export rows only ever propose
    f.properties.logged = !!d; f.properties.depth = d;
    f.properties.proposed = !d && !!(row && (row.depth_proposed || row.depth)) && isOwnerRecord(REC);
  }
  // B3.1: countries, places, layovers and continents from the record only (TLLMapCounts.countRecord).
  function countDepths() {
    var k = REC ? REC.count : K.countRecord(null), den = (byId.countries && byId.countries.denominator) || 249;
    var v = { lived: k.lived, stayed: k.stayed, layover: k.layovers, proposed: 0, countries: k.countries, places: k.places, antarctica: k.antarctica, continents: k.continents.length, continentNames: k.continents };
    (fcCountries ? fcCountries.features : []).forEach(function (f) { if (f.properties.proposed) v.proposed++; });
    v.n = k.places; v.of = den; v.notyet = Math.max(0, den - k.lived - k.stayed - k.layovers); v.rest = v.notyet;
    v.pct = den ? Math.round(v.n / den * 1000) / 10 : 0; v.half = Math.ceil(den / 2);
    counts.countries = REC ? k.countries : null; vars.countries = v;
    return v;
  }
  // B3.3: cities, airports, US parks and parks everywhere from the logbook (TLLMapCounts.countLogbook). No logbook, no number.
  function countLog() {
    var k = LOG ? K.countLogbook(LOG.log, LOG.parks) : null;
    colls.forEach(function (c) { if (c.count_from === 'logbook') counts[c.id] = k && k.ok && c.logbook_count ? (k[c.logbook_count] || 0) : null; });
  }
  var centroids = {};
  function centroidOf(iso) {
    if (centroids[iso] !== undefined) return centroids[iso];
    var f = fcCountries && fcCountries.features.filter(function (x) { return x.properties.iso === iso; })[0]; if (!f) return null;
    // The center of the country's largest piece by area (shoelace centroid), so a long coastline does not pull it aside.
    var polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates, best = null, bestA = 0;
    polys.forEach(function (p) {
      var r = p[0], a = 0, cx = 0, cy = 0, i, k;
      for (i = 0; i < r.length - 1; i++) { k = r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; a += k; cx += (r[i][0] + r[i + 1][0]) * k; cy += (r[i][1] + r[i + 1][1]) * k; }
      if (Math.abs(a) > bestA && a) { bestA = Math.abs(a); best = [cx / (3 * a), cy / (3 * a)]; }
    });
    return (centroids[iso] = best);
  }
  // B3.4: lines and extremes by country, from the countries in the record (Antarctica is a place, not a country).
  function computeLines() { LINES = fcCountries && REC ? K.lines(REC.count.countryIsos.map(function (i) { return i === '900' ? 'XK' : i; }), centroidOf) : null; }
  function recordRows(states, verb) {
    var rows = [];
    Object.keys(states).forEach(function (iso) {
      var a2 = loggedIso[iso] || (iso === 'XK' ? 'XK' : ''), row = countryRows[a2], c = row && row.latitude != null ? [row.longitude, row.latitude] : centroidOf(iso);
      if (!c) return;
      rows.push({ name: row ? row.name : (nameOf(iso) || iso), country: a2 || iso, latitude: c[1], longitude: c[0], verb: verb, year: '', note: '', link: '', depth: states[iso], source: 'member record (tllStates)', type: 'Country', iso: iso });
    });
    return rows;
  }
  function nameOf(iso) { var f = fcCountries && fcCountries.features.filter(function (x) { return x.properties.iso === iso; })[0]; return f ? f.properties.name : ''; }
  function applyPets() {
    var c = byId.magnus; if (!c || !REC) return;
    var pet = REC.pets[0]; var rows = pet ? recordRows(pet.states, c.verb || 'sniffed') : [];
    counts.magnus = pet ? Object.keys(pet.states).length : 0; loaded.magnus = rows;
    var src = map && map.getSource('tllm-src-magnus'); if (src) src.setData(toGeo(c, rows));
    if (map && map.getLayer('tllm-magnus-outline')) map.setFilter('tllm-magnus-outline', ['in', ['get', 'a2'], ['literal', rows.map(function (r) { return r.country; })]]);
    var card = root.querySelector('.tllm-card[data-id="magnus"] .tllm-card-num b'); if (card) { card.textContent = fmt(counts.magnus); card.dataset.count = counts.magnus; }
  }
  // One repaint for every change: a new record, a logbook save, Memberstack answering, the shapes arriving.
  function applyRecord(rec) {
    if (rec) REC = rec;
    LOG = member === true || (REC && REC.source === 'member') ? MEMBER_LOG : REC && REC.source === 'owner' ? OWNER_LOG : logFromStorage();
    var ready = mapReady && fcCountries && map && map.getSource('tllm-countries');
    if (ready) { fcCountries.features.forEach(function (f) { setDepthProps(f, f.properties.iso, countryRows[f.properties.a2]); }); map.getSource('tllm-countries').setData(fcCountries); applyPets(); }
    renderAll();
    if (ready) { refreshLineLayers(); syncLogbookPins(); }
  }
  function renderAll() {
    var v = countDepths(); countLog(); computeLines();
    if (REC) bindCounters(v.n); refreshDrawerCounts(); renderBar(); renderCards(v); renderRules(); renderStrip(); renderSaved(); refreshHint(); renderList();
  }
  function visitor() { return member !== true; } // never a zero for a signed-out visitor: hide instead
  function refreshHint() { var h = document.getElementById('tllm-hint'); if (h) h.textContent = canEdit() ? 'Tap a country to log it: Lived, Stayed, or Layover only. Stack as many lists as you like.' : 'Stack as many as you like.'; }

  // ---------- shelf glyphs and colors ----------
  function shapeFor(c) { return c.pin_shape || (shelves[c.shelf] && shelves[c.shelf].pin_shape) || 'circle'; }
  function colorFor(c) { if (c.id === 'magnus') return C.teal; return c.color || (shelves[c.shelf] && shelves[c.shelf].color) || C.cream; }
  function glyphSVG(shape, color, cls) {
    var p;
    if (shape === 'diamond') p = '<path d="M6 .6 11.4 6 6 11.4.6 6z" fill="' + color + '"/>';
    else if (shape === 'triangle') p = '<path d="M6 .8 11.4 11H.6z" fill="' + color + '"/>';
    else if (shape === 'square') p = '<rect x="1" y="1" width="10" height="10" fill="' + color + '"/>';
    else if (shape === 'ring') p = '<circle cx="6" cy="6" r="4.4" fill="' + C.ink + '" stroke="' + color + '" stroke-width="2"/>';
    else if (shape === 'hex') p = '<path d="M3.2 1h5.6L11.6 6l-2.8 5H3.2L.4 6z" fill="' + color + '" fill-opacity=".5" stroke="' + color + '"/>';
    else if (shape === 'paw') p = '<circle cx="6" cy="7.6" r="3" fill="' + color + '"/><circle cx="2.2" cy="4.6" r="1.5" fill="' + color + '"/><circle cx="4.6" cy="2.2" r="1.5" fill="' + color + '"/><circle cx="7.6" cy="2.3" r="1.5" fill="' + color + '"/><circle cx="10" cy="4.9" r="1.4" fill="' + color + '"/>';
    else p = '<circle cx="6" cy="6" r="5.2" fill="' + color + '"/>';
    return '<svg class="' + (cls || 'tllm-chip-g') + '" viewBox="0 0 12 12" aria-hidden="true" focusable="false">' + p + '</svg>';
  }
  function countText(c) {
    if (c.computed === 'placeholder') return '?/' + fmt(c.denominator || 0);
    if (c.computed === 'crossed') return LINES && LINES.n ? ((LINES.equator ? 1 : 0) + (LINES.meridian ? 1 : 0)) + '/' + (c.denominator || 2) : '';
    if (c.computed === 'extremes') return LINES && LINES.n ? '4' : '';
    if (c.type === 'heat') return counts[c.id] ? fmt(counts[c.id]) + ' hex' : 'hex';
    var n = counts[c.id]; if (n == null || (n === 0 && visitor())) return '';
    if (c.id === 'countries') return fmt(n); // "countries" never sits over 249; the places count does, on the card
    return c.denominator ? fmt(n) + '/' + fmt(c.denominator) : fmt(n);
  }
  function isEmpty(c) { if (c.computed === 'placeholder') return true; if (c.computed === 'extremes' || c.computed === 'crossed') return !(LINES && LINES.n); return counts[c.id] === 0; }
  function chipLabel(c) { var n = countText(c); return c.name + (n ? ', ' + n.replace('/', ' of ') : '') + (isEmpty(c) ? ', nothing logged yet' : '') + ', ' + c.verb; }
  // Pins in the Places Been files for the logbook lists are the site owner's: they show only on the owner's map.
  function pinsAllowed(c) { return c.count_from !== 'logbook' || isOwnerRecord(REC); }

  // ---------- UI ----------
  function buildUI() {
    // Switcher bar: LAYERS · N ON · M LISTS, the on-chips, the drawer toggle
    bar = el('div', 'tllm-bar');
    var k = el('div', 'tllm-bar-k'); k.id = 'tllm-bar-k'; bar.appendChild(k);
    onChips = el('div', 'tllm-onchips'); onChips.setAttribute('aria-label', 'Lists switched on'); bar.appendChild(onChips);
    drawerBtn = el('button', 'tllm-bar-btn'); drawerBtn.type = 'button'; drawerBtn.setAttribute('aria-expanded', 'false'); drawerBtn.setAttribute('aria-controls', 'tllm-drawer');
    drawerBtn.innerHTML = 'Layers <i aria-hidden="true"></i>'; drawerBtn.addEventListener('click', function () { openDrawer(drawerBtn.getAttribute('aria-expanded') !== 'true'); });
    bar.appendChild(drawerBtn);
    var row2 = el('div', 'tllm-bar-row2'); var hint = el('p', 'tllm-bar-hint', 'Stack as many as you like.'); hint.id = 'tllm-hint'; row2.appendChild(hint); bar.appendChild(row2);
    var edit = el('a', 'tllm-edit'); edit.href = root.getAttribute('data-tll-editor') || '/the-map#edit'; edit.innerHTML = '<span aria-hidden="true">✎</span> Edit my destinations';
    edit.addEventListener('click', function (ev) {
      var u = edit.getAttribute('href'), i = u.indexOf('#'), path = i >= 0 ? u.slice(0, i) : u;
      if (u === 'inline' || u === '#') { ev.preventDefault(); var st = document.getElementById('tllm-stage'); if (st) st.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); say(canEdit() ? 'Tap any country on the map to log it.' : 'Log in to log your own countries.'); return; }
      if (i >= 0 && path && location.pathname.replace(/\/$/, '') === path.replace(/\/$/, '')) { ev.preventDefault(); var h = u.slice(i + 1); if (location.hash === '#' + h) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = h; }
    });
    row2.appendChild(edit);
    root.appendChild(bar);

    drawer = el('div', 'tllm-drawer'); drawer.id = 'tllm-drawer'; drawer.dataset.open = '0';
    var inner = el('div'); drawer.appendChild(inner);
    var wrap = el('div', 'tllm-shelves'); wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-label', 'Every list, by shelf'); inner.appendChild(wrap);
    (cfg.shelves || []).forEach(function (s) {
      var mine = colls.filter(function (c) { return c.shelf === s.id; }); if (!mine.length) return;
      var row = el('div', 'tllm-shelf');
      var nm = el('div', 'tllm-shelf-name'); nm.innerHTML = glyphSVG(s.pin_shape, s.color || C.cream) + '<span>' + esc(s.name) + '</span><span aria-hidden="true">· ' + mine.length + '</span>'; row.appendChild(nm);
      var chips = el('div', 'tllm-chips');
      mine.forEach(function (c) { chips.appendChild(chip(c)); });
      row.appendChild(chips); wrap.appendChild(row);
    });
    var foot = el('div', 'tllm-drawer-foot');
    var fk = el('span', 'tllm-bar-k'); fk.id = 'tllm-foot-k'; foot.appendChild(fk);
    var done = el('button', 'tllm-bar-btn', 'Done'); done.type = 'button'; done.addEventListener('click', function () { openDrawer(false); drawerBtn.focus(); }); foot.appendChild(done);
    inner.appendChild(foot);
    root.appendChild(drawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.dataset.open === '1') { openDrawer(false); drawerBtn.focus(); } });

    // B3.8: members see when their map was last saved, and can pull the account copy over a stale browser copy.
    savedBar = el('div', 'tllm-saved'); savedBar.hidden = true;
    savedText = el('p', 'tllm-saved-t'); savedText.hidden = true; savedBar.appendChild(savedText);
    savedMsg = el('p', 'tllm-saved-m'); savedMsg.setAttribute('role', 'status'); savedMsg.setAttribute('aria-live', 'polite'); savedBar.appendChild(savedMsg);
    savedBtn = el('button', 'tllm-saved-btn', 'Refresh from my account'); savedBtn.type = 'button'; savedBtn.addEventListener('click', refreshFromAccount); savedBar.appendChild(savedBtn);
    root.appendChild(savedBar);

    // Canvas
    var stage = el('div', 'tllm-stage'); stage.id = 'tllm-stage';
    tip = el('div', 'tllm-tip'); tip.setAttribute('aria-hidden', 'true'); stage.appendChild(tip);
    status = el('div', 'tllm-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); stage.appendChild(status);
    heatKey = el('div', 'tllm-heatkey'); heatKey.hidden = true; heatKey.innerHTML = '<span>fewer</span><i aria-hidden="true"></i><span>more</span>'; heatKey.setAttribute('aria-label', 'Heat key: fewer to more. Rounded on purpose. Home is not on here.'); stage.appendChild(heatKey);
    root.appendChild(stage);

    // Sections under the map
    secCards = section('THE RECEIPTS · ONE ROW PER LIST', 'Every list, <em>one row each.</em>', null);
    secRules = section('MANY WAYS TO COUNT', 'Same trips. Four rulebooks. <em>Four answers.</em>', 'The trips did not change. The math did.');
    secSets = section('SETS OF SEVEN', 'Seven slots, <em>one row each.</em>', 'Tap a stamp for the receipt.');
    secStrip = section('LINES AND EXTREMES', 'How far, <em>and across what.</em>', 'From the countries on your map, so it changes when your map does.');
    secFrames = section('IN MOTION', 'From the road, <em>framed.</em>', 'Official embeds only. Past trips only.');
    buildStamps(); buildEmbeds();

    // Keyboard pin list (not in the design; kept for the brief's keyboard rule)
    listBox = el('details', 'tllm-list');
    listBox.appendChild(el('summary', null, 'Browse pins by keyboard'));
    listBox.appendChild(el('p', 'tllm-list-hint', 'Every pin on the lists that are switched on. Pick one to fly there and open its card.'));
    listFilter = el('input', 'tllm-list-filter'); listFilter.type = 'search'; listFilter.placeholder = 'Filter by name or country'; listFilter.setAttribute('aria-label', 'Filter pins'); listFilter.autocomplete = 'off';
    listFilter.addEventListener('input', renderList); listBox.appendChild(listFilter);
    listUl = el('ul'); listUl.setAttribute('aria-label', 'Pins'); listBox.appendChild(listUl);
    root.appendChild(listBox);
    renderList(); renderBar();
    [secCards, secRules, secStrip].forEach(function (x) { x.style.display = 'none'; }); // shown once there is a number

    [].forEach.call(document.querySelectorAll('[data-tll-map="fullscreen"]'), function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); var f = root.requestFullscreen || root.webkitRequestFullscreen; if (f) f.call(root); else root.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); });
    });
    document.addEventListener('fullscreenchange', function () { if (map) setTimeout(function () { map.resize(); fitWorld(false); }, 60); });
  }
  function section(eyebrow, h2html, lede) {
    var s = el('section', 'tllm-sec'); s.appendChild(el('div', 'tllm-eyebrow', eyebrow));
    var h = el('h2', 'tllm-h2'); h.innerHTML = h2html; s.appendChild(h);
    if (lede) s.appendChild(el('p', 'tllm-lede', lede));
    root.appendChild(s); return s;
  }
  function openDrawer(on) { drawer.dataset.open = on ? '1' : '0'; drawerBtn.setAttribute('aria-expanded', on ? 'true' : 'false'); }
  function chip(c) {
    var b = el('button', 'tllm-chip'); b.type = 'button'; b.dataset.id = c.id; b.setAttribute('aria-pressed', 'false');
    if (isEmpty(c)) b.classList.add('tllm-chip-empty');
    var n = countText(c);
    b.setAttribute('aria-label', chipLabel(c));
    b.innerHTML = glyphSVG(shapeFor(c), colorFor(c)) + '<span aria-hidden="true">' + esc(c.name) + '</span>' + (n ? '<span class="tllm-chip-n" aria-hidden="true">' + esc(n) + '</span>' : '') + '<span class="tllm-chip-ck" aria-hidden="true">✓</span>';
    b.addEventListener('click', function () { toggle(c.id, b.getAttribute('aria-pressed') !== 'true'); });
    return b;
  }
  function renderBar() {
    var on = colls.filter(function (c) { return active[c.id]; });
    document.getElementById('tllm-bar-k').textContent = 'Layers · ' + on.length + ' on · ' + colls.length + ' lists';
    var fk = document.getElementById('tllm-foot-k'); if (fk) fk.textContent = on.length + ' on';
    onChips.innerHTML = '';
    on.forEach(function (c) { var b = chip(c); b.setAttribute('aria-pressed', 'true'); onChips.appendChild(b); });
    [].forEach.call(drawer.querySelectorAll('.tllm-chip'), function (b) { b.setAttribute('aria-pressed', active[b.dataset.id] ? 'true' : 'false'); });
    if (!on.length && mapReady) say(empty.map_all_off || 'Every layer is off.');
  }
  function say(t) { status.textContent = t || ''; status.dataset.on = t ? '1' : '0'; }

  // ---------- map ----------
  var globe = false;
  function baseStyle() { return { version: 8, sources: {}, layers: [] }; }
  function fitWorld(animate) {
    var opt = { animate: !!animate && !reduce, duration: 400 };
    if (globe) { var h = map.getContainer().clientHeight || 600, w = map.getContainer().clientWidth || 900; var z = Math.log2(Math.min(h, w) / 290); map.jumpTo({ center: [10, 12], zoom: Math.max(0.3, Math.min(1.6, z)), bearing: 0, pitch: 0 }); return; }
    map.fitBounds([[-168, -56], [179, 72]], Object.assign({ padding: { top: 16, right: 16, bottom: 36, left: 16 } }, opt));
  }
  function initMap() {
    return new Promise(function (ok, no) {
      var maplibregl = window.maplibregl; if (!maplibregl) return no(new Error('MapLibre did not load'));
      map = new maplibregl.Map({ container: 'tllm-stage', style: STYLE || baseStyle(), center: [10, 20], zoom: 1.2, minZoom: 0.8, maxZoom: 15, attributionControl: false, renderWorldCopies: true, fadeDuration: reduce ? 0 : 180, cooperativeGestures: true }); // 20 Oct 2026 (Nancy: the map took the page scroll): zoom with Ctrl or Cmd plus scroll, two fingers on phones
      root.tllmMap = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'Shapes: Natural Earth via world-atlas' }), 'bottom-right');
      map.getCanvas().setAttribute('aria-label', 'World map. Use the layer buttons above, or the pin list below, to browse.');
      map.on('error', function (e) { window.__tllLastErr = e && e.error && e.error.message; });
      map.on('styleimagemissing', function (e) { var m = /^tllm-(\w+)-([0-9a-fA-F]{6})(-nd)?$/.exec(e.id); if (m) addIcon(e.id, m[1], '#' + m[2], !!m[3]); });
      map.once('style.load', function () {
        try { demoteBasemap(); } catch (e) {}
        // MapLibre 5: globe projection, so Antarctica and the poles draw. Below street zoom the globe hands over to Mercator by itself.
        try { if (map.setProjection) { map.setProjection({ type: 'globe' }); globe = true; } } catch (e) { globe = false; }
        getJSON(ATLAS).then(function (topo) { return Promise.all([topo, getJSON(DATA + 'countries.json')]); })
          .then(function (r) { addCountries(r[0], r[1]); fitWorld(false); ok(); })
          .catch(function (e) { fail('Country shapes did not load: ' + e.message); ok(); });
      });
    });
  }
  function demoteBasemap() {
    var st = map.getStyle(); if (!st || !st.layers) return;
    st.layers.forEach(function (l) {
      if (l.type === 'background') { map.setLayoutProperty(l.id, 'visibility', 'none'); return; }
      map.setLayerZoomRange(l.id, Math.max(STREET_ZOOM, l.minzoom || 0), l.maxzoom == null ? 24 : l.maxzoom);
    });
  }
  function firstBasemapLayer() { var st = map.getStyle(); return st.layers.length ? st.layers[0].id : undefined; }
  function graticule() {
    var f = [], i;
    for (i = -80; i <= 80; i += 10) f.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[-180, i], [-90, i], [0, i], [90, i], [180, i]] } });
    for (i = -180; i <= 180; i += 10) f.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[i, -80], [i, 0], [i, 80]] } });
    return { type: 'FeatureCollection', features: f };
  }
  function unwrap(geom) {
    var polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
    polys.forEach(function (poly) { poly.forEach(function (ring) { var e = false, w = false; ring.forEach(function (c) { if (c[0] > 150) e = true; if (c[0] < -150) w = true; }); if (e && w) ring.forEach(function (c) { if (c[0] < 0) c[0] += 360; }); }); });
  }
  // Sutherland-Hodgman clip of each outer ring against lon <= 0 and lon >= 0. The pole edge of Antarctica runs from
  // 180 to -180 along the south; split this way, each half keeps a straight edge on the date line instead of a jump.
  function halves(geom) {
    var polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates, out = [];
    function clip(ring, keepWest) {
      var res = [], n = ring.length, i, a, b, ina, inb;
      for (i = 0; i < n; i++) {
        a = ring[i]; b = ring[(i + 1) % n]; ina = keepWest ? a[0] <= 0 : a[0] >= 0; inb = keepWest ? b[0] <= 0 : b[0] >= 0;
        if (ina) res.push(a);
        if (ina !== inb) { var t = (0 - a[0]) / (b[0] - a[0]); res.push([0, a[1] + (b[1] - a[1]) * t]); }
      }
      if (res.length) res.push(res[0]);
      return res.length > 3 ? res : null;
    }
    polys.forEach(function (poly) { [true, false].forEach(function (w) { var r = clip(poly[0], w); if (r) out.push([r]); }); });
    return { type: 'MultiPolygon', coordinates: out };
  }
  // world-atlas stores Antarctica as a degenerate ring along the pole with the coast as its hole. Rebuild it as a planar
  // polygon: the coast, cut at the date line, closed through the pole; then halves() cuts it at the prime meridian.
  var aqCoast = null;
  function antarcticaGeom(geom) {
    var polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates, coast = null, islands = [];
    polys.forEach(function (poly) {
      poly.forEach(function (ring) {
        var lo = 180, hi = -180, pole = 0; ring.forEach(function (c) { if (c[0] < lo) lo = c[0]; if (c[0] > hi) hi = c[0]; if (c[1] <= -89) pole++; });
        if (pole > ring.length / 2) return;
        if (hi - lo > 300) { if (!coast || ring.length > coast.length) coast = ring; } else if (ring === poly[0]) islands.push(poly);
      });
    });
    if (!coast) return geom;
    var r = coast.slice(0, -1), cut = 0, best = 0, i;
    for (i = 0; i < r.length; i++) { var d = Math.abs(r[(i + 1) % r.length][0] - r[i][0]); if (d > best) { best = d; cut = (i + 1) % r.length; } }
    var seq = r.slice(cut).concat(r.slice(0, cut));
    var first = seq[0], last = seq[seq.length - 1];
    seq.push([last[0] > 0 ? 180 : -180, last[1]], [last[0] > 0 ? 180 : -180, -89.9], [first[0] > 0 ? 180 : -180, -89.9], [first[0] > 0 ? 180 : -180, first[1]], first);
    aqCoast = seq.slice(0, seq.length - 5);
    var main = halves({ type: 'Polygon', coordinates: [seq] });
    return { type: 'MultiPolygon', coordinates: main.coordinates.concat(islands) };
  }
  function hatchImage() {
    var S = 18, cv = document.createElement('canvas'); cv.width = S; cv.height = S; var g = cv.getContext('2d');
    g.fillStyle = C.hatchBg; g.fillRect(0, 0, S, S); g.strokeStyle = C.rose; g.lineWidth = 4;
    g.beginPath(); g.moveTo(-S / 2, S * 1.5); g.lineTo(S * 1.5, -S / 2); g.moveTo(-S / 2, S / 2); g.lineTo(S / 2, -S / 2); g.moveTo(S / 2, S * 1.5); g.lineTo(S * 1.5, S / 2); g.stroke();
    map.addImage('tllm-hatch', g.getImageData(0, 0, S, S), { pixelRatio: 2 });
  }
  function depthOf(row) { return row ? (row.depth || row.depth_proposed || (row.name ? 'Stayed' : '')) : ''; }

  function addCountries(topo, cjson) {
    var rows = cjson.rows || [];
    rows.forEach(function (r) { countryRows[r.country] = r; if (r.iso_n3) loggedIso[r.iso_n3] = r.country; });
    var fc = topojson.feature(topo, topo.objects.countries);
    if (!globe) fc.features = fc.features.filter(function (f) { return !(f.properties && f.properties.name === 'Antarctica'); });
    fc.features = splitTerritories(fc.features);
    fc.features.forEach(function (f) {
      var id = f.id != null ? String(f.id).padStart(3, '0') : '';
      if (id !== '010') unwrap(f.geometry); else f.geometry = antarcticaGeom(f.geometry);
      var nm = f.properties && f.properties.name || '';
      if (!id && nm === 'Kosovo') id = 'XK';
      var a2 = loggedIso[id] || (id === 'XK' ? 'XK' : '') || (f.properties && f.properties.a2hint) || ''; var row = countryRows[a2];
      f.properties = f.properties || {}; f.properties.iso = id; f.properties.a2 = a2; setDepthProps(f, id, row);
    });
    fcCountries = fc; centroids = {}; if (REC) applyPets();
    hatchImage();
    var before = firstBasemapLayer();
    map.addLayer({ id: 'tllm-sphere', type: 'background', paint: { 'background-color': C.sphere } }, before);
    map.addSource('tllm-grat', { type: 'geojson', data: graticule() });
    map.addLayer({ id: 'tllm-grat', type: 'line', source: 'tllm-grat', paint: { 'line-color': C.grat, 'line-width': 0.6 } }, before);
    map.addSource('tllm-countries', { type: 'geojson', data: fc, promoteId: 'iso' });
    // Rule 1, order: heat, then fills, then Magnus outlines, then pins. Heat layers insert before 'tllm-land'.
    map.addLayer({ id: 'tllm-land', type: 'fill', source: 'tllm-countries', paint: { 'fill-color': landFill(true), 'fill-opacity': ['interpolate', ['linear'], ['zoom'], STREET_ZOOM - 1, 1, STREET_ZOOM + 1, 0.45] } }, before);
    map.addLayer({ id: 'tllm-land-hatch', type: 'fill', source: 'tllm-countries', filter: ['==', ['get', 'depth'], 'Layover only'], paint: { 'fill-pattern': 'tllm-hatch', 'fill-opacity': ['interpolate', ['linear'], ['zoom'], STREET_ZOOM - 1, 1, STREET_ZOOM + 1, 0.45] } }, before);
    map.addLayer({ id: 'tllm-land-line', type: 'line', source: 'tllm-countries', filter: ['!=', ['get', 'iso'], '010'], paint: {
      'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], C.cream, ['==', ['get', 'depth'], 'Lived'], C.cream, C.ink],
      'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 1.4, ['==', ['get', 'depth'], 'Lived'], 1.1, 0.5] } }, before);
    if (aqCoast) { map.addSource('tllm-aq-coast', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: aqCoast } } }); map.addLayer({ id: 'tllm-aq-line', type: 'line', source: 'tllm-aq-coast', paint: { 'line-color': C.ink, 'line-width': 0.5 } }, before); }
    map.addLayer({ id: 'tllm-magnus-outline', type: 'line', source: 'tllm-countries', filter: ['in', ['get', 'a2'], ['literal', []]], layout: { visibility: 'none' }, paint: { 'line-color': C.teal, 'line-width': 1.4, 'line-dasharray': [3, 2] } }, before);

    var hovered = null;
    map.on('mousemove', 'tllm-land', function (e) {
      var f = e.features && e.features[0]; if (!f || !active.countries) return;
      if (hovered !== null && hovered !== f.id) map.setFeatureState({ source: 'tllm-countries', id: hovered }, { hover: false });
      hovered = f.id; map.setFeatureState({ source: 'tllm-countries', id: hovered }, { hover: true });
      map.getCanvas().style.cursor = 'pointer';
      var row = countryRows[f.properties.a2];
      tip.innerHTML = '<b>' + esc(row ? row.name : f.properties.name) + '</b><span>' + esc(f.properties.logged ? f.properties.depth : (f.properties.proposed ? 'Not yet · pins in Places Been' : 'Not yet')) + (canEdit() && !f.properties.logged ? ' · tap to log' : '') + '</span>';
      tip.style.transform = 'translate(' + (e.point.x + 14) + 'px,' + (e.point.y - 8) + 'px)'; tip.style.opacity = '1';
    });
    map.on('mouseleave', 'tllm-land', function () { if (hovered !== null) map.setFeatureState({ source: 'tllm-countries', id: hovered }, { hover: false }); hovered = null; tip.style.opacity = '0'; map.getCanvas().style.cursor = ''; });
    map.on('click', 'tllm-land', function (e) {
      if (!active.countries) return; if (e.originalEvent && e.originalEvent._tllmPin) return;
      var f = e.features && e.features[0]; if (!f) return; var row = countryRows[f.properties.a2];
      var d = f.properties.logged ? f.properties.depth : 'Not yet';
      var note = !f.properties.logged ? (f.properties.proposed ? 'Pins in Places Been, nothing logged. Log it in the editor and it counts.' : 'Not yet. The cream.') : d === 'Lived' ? 'Lived here. The deepest of the three depths.' : d === 'Layover only' ? (f.properties.proposed ? 'Airport pins only in Places Been. Proposed as layover only, Nancy to confirm.' : 'Never left the terminal. Counted, on a separate shelf.') : (f.properties.proposed ? 'City pins in Places Been. Proposed as stayed, Nancy to confirm.' : 'Left the airport and slept at least one night.');
      openCard({ _c: 'countries', name: row ? row.name : f.properties.name, country: f.properties.a2, _iso: f.properties.iso, verb: d, year: row && row.year, note: note, link: row && row.link, story: row && row.story, _country: true }, e.lngLat.toArray());
    });
    antarcticaLabel();
  }
  function landFill(on) {
    if (!on) return C.landOff;
    return ['case', ['!', ['boolean', ['get', 'logged'], false]], C.notYet, ['==', ['get', 'depth'], 'Lived'], C.rose, ['==', ['get', 'depth'], 'Layover only'], C.hatchBg, C.stayed];
  }
  // Natural Earth folds some territories into the parent shape. Each one here becomes its own feature with its own
  // ISO code, so it lights only from its own row (Nancy, 8 Oct 2026: territories count apart from the home country).
  // A polygon moves when the center of its outer ring falls inside a box: [west, south, east, north].
  var SPLITS = {
    '250': [['GF', '254', 'French Guiana', [-55, 1.5, -51, 6.5]], ['GP', '312', 'Guadeloupe', [-62, 15.7, -60.8, 16.6]], ['MQ', '474', 'Martinique', [-61.4, 14.3, -60.7, 15]], ['RE', '638', 'Réunion', [55, -21.5, 56, -20.7]], ['YT', '175', 'Mayotte', [44.9, -13.2, 45.4, -12.5]]],
    '528': [['BQ', '535', 'Caribbean Netherlands', [-69, 11.5, -62.5, 18]]],
    '578': [['SJ', '744', 'Svalbard and Jan Mayen', [-10, 70.5, -7, 71.5]], ['SJ', '744', 'Svalbard and Jan Mayen', [9, 73.5, 36, 81.5]], ['BV', '074', 'Bouvet Island', [2.5, -55, 4, -54]]],
    '036': [['CX', '162', 'Christmas Island', [105.3, -10.7, 106, -10.3]], ['CC', '166', 'Cocos (Keeling) Islands', [96.7, -12.3, 97, -11.8]]]
  };
  function splitTerritories(features) {
    // world-atlas gives two features the id 036 (Australia, and Ashmore and Cartier Is.); fold any repeat id into the first
    // feature so one logged country is counted once.
    var seen = {}, merged = [];
    features.forEach(function (f) {
      var id = f.id != null ? String(f.id).padStart(3, '0') : '';
      if (id && seen[id]) { var g = seen[id].geometry, add = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates; if (g.type === 'Polygon') { g.type = 'MultiPolygon'; g.coordinates = [g.coordinates]; } g.coordinates = g.coordinates.concat(add); return; }
      if (id) seen[id] = f; merged.push(f);
    });
    features = merged;
    var out = [];
    features.forEach(function (f) {
      var id = f.id != null ? String(f.id).padStart(3, '0') : '', rules = SPLITS[id];
      if (!rules || !f.geometry || f.geometry.type !== 'MultiPolygon') { out.push(f); return; }
      var keep = [], moved = {};
      f.geometry.coordinates.forEach(function (poly) {
        var ring = poly[0], x = 0, y = 0; ring.forEach(function (c) { x += c[0]; y += c[1]; }); x /= ring.length; y /= ring.length;
        var hit = null; rules.forEach(function (r) { var b = r[3]; if (!hit && x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3]) hit = r; });
        if (hit) { (moved[hit[1]] = moved[hit[1]] || { r: hit, polys: [] }).polys.push(poly); } else keep.push(poly);
      });
      f.geometry.coordinates = keep; out.push(f);
      Object.keys(moved).forEach(function (n3) { var m = moved[n3]; out.push({ type: 'Feature', id: n3, properties: { name: m.r[2], a2hint: m.r[0] }, geometry: { type: 'MultiPolygon', coordinates: m.polys } }); });
    });
    return out;
  }
  function antarcticaLabel() {
    if (globe) return;
    var aq = REC && REC.all['010']; if (!aq) return;
    var d = el('div', 'tllm-aq'); d.setAttribute('role', 'note'); d.innerHTML = '<b>Antarctica</b><span>' + esc(aq) + '</span>';
    new window.maplibregl.Marker({ element: d, anchor: 'top' }).setLngLat([0, -66]).addTo(map);
  }
  function bindCounters(n) {
    var c = byId.countries, den = c && c.denominator;
    var c1 = document.getElementById('tll-map-counter'); if (c1) { c1.textContent = den ? n + ' / ' + den : String(n); c1.removeAttribute('aria-busy'); }
    var c2 = document.getElementById('tll-map-pct'); if (c2 && den) { c2.textContent = Math.round(n / den * 100) + '%'; c2.removeAttribute('aria-busy'); }
  }
  function refreshDrawerCounts() {
    [].forEach.call(root.querySelectorAll('.tllm-chip'), function (b) {
      var c = byId[b.dataset.id]; if (!c) return; var t = countText(c), n = b.querySelector('.tllm-chip-n');
      if (!n && t) { n = el('span', 'tllm-chip-n'); n.setAttribute('aria-hidden', 'true'); var ck = b.querySelector('.tllm-chip-ck'); b.insertBefore(n, ck); }
      if (n) { n.textContent = t; n.hidden = !t; }
      b.classList.toggle('tllm-chip-empty', isEmpty(c)); b.setAttribute('aria-label', chipLabel(c));
    });
  }

  // ---------- pin icons: one shape per shelf, Ink edge; not-yet draws as a dashed outline ----------
  function addIcon(name, shape, color, notDone) {
    var S = 44, cv = document.createElement('canvas'); cv.width = S; cv.height = S; var g = cv.getContext('2d'), m = S / 2;
    function path() {
      g.beginPath();
      if (shape === 'diamond') { g.moveTo(m, 5); g.lineTo(S - 5, m); g.lineTo(m, S - 5); g.lineTo(5, m); g.closePath(); }
      else if (shape === 'triangle') { g.moveTo(m, 5); g.lineTo(S - 5, S - 7); g.lineTo(5, S - 7); g.closePath(); }
      else if (shape === 'square') { g.rect(7, 7, S - 14, S - 14); }
      else if (shape === 'ring') { g.arc(m, m, 12, 0, Math.PI * 2); }
      else if (shape === 'paw') { g.arc(m, m + 6, 10, 0, Math.PI * 2); g.moveTo(m - 13, m - 5); g.arc(m - 13, m - 5, 5, 0, Math.PI * 2); g.moveTo(m - 4, m - 12); g.arc(m - 4, m - 12, 5, 0, Math.PI * 2); g.moveTo(m + 6, m - 12); g.arc(m + 6, m - 12, 5, 0, Math.PI * 2); g.moveTo(m + 14, m - 4); g.arc(m + 14, m - 4, 4.5, 0, Math.PI * 2); }
      else { g.arc(m, m, 13, 0, Math.PI * 2); }
    }
    g.lineJoin = 'round';
    if (notDone) { path(); g.fillStyle = C.ink; g.fill(); g.setLineDash([5, 4]); g.lineWidth = 3; g.strokeStyle = color; g.stroke(); }
    else if (shape === 'ring') { path(); g.fillStyle = C.ink; g.fill(); g.lineWidth = 4.5; g.strokeStyle = color; g.stroke(); }
    else { path(); g.lineWidth = 2.5; g.strokeStyle = C.ink; g.stroke(); path(); g.fillStyle = color; g.fill(); }
    map.addImage(name, g.getImageData(0, 0, S, S), { pixelRatio: 2 });
  }
  function iconName(c, notDone) { return 'tllm-' + shapeFor(c) + '-' + colorFor(c).replace('#', '') + (notDone ? '-nd' : ''); }

  // ---------- toggling ----------
  function toggle(id, on) {
    var c = byId[id]; if (!c) return;
    if (!mapReady) { pending[id] = on; active[id] = on; renderBar(); startMap(); return; } // a chip before the map: start it now
    var btns = [].slice.call(root.querySelectorAll('.tllm-chip[data-id="' + id + '"]'));
    if (id === 'countries') {
      active[id] = on; map.setPaintProperty('tllm-land', 'fill-color', landFill(on)); map.setLayoutProperty('tllm-land-hatch', 'visibility', on ? 'visible' : 'none'); map.setLayoutProperty('tllm-land-line', 'visibility', on ? 'visible' : 'none'); if (map.getLayer('tllm-aq-line')) map.setLayoutProperty('tllm-aq-line', 'visibility', on ? 'visible' : 'none');
      finish(); return;
    }
    if (c.computed === 'placeholder') { active[id] = on; say(on ? c.name + ': ' + (empty.list_zero || 'nothing logged yet.') : ''); finish(); return; }
    if (c.computed === 'crossed') { active[id] = on; drawCrossed(on); finish(); return; }
    if (c.computed === 'extremes') { active[id] = on; loaded[id] = extremesRows(); if (!map.getSource('tllm-src-' + id)) addLayer(c); finish(); return; }
    if (!pinsAllowed(c)) { active[id] = on; hideLayer(c); renderBar(); density(); renderList(); say(on ? logbookMsg(c) : ''); return; }
    if (on && loaded[id] && !map.getSource('tllm-src-' + id) && c.type !== 'heat') addLayer(c); // rows arrived from the record before the layer existed
    if (on && !loaded[id]) {
      btns.forEach(function (b) { b.setAttribute('aria-busy', 'true'); });
      if (id === 'magnus' && REC && REC.pets.length) { applyPets(); addLayer(c); finish(); return; }
      return getJSON(DATA + id + '.json').then(function (j) { // B3.9: a list's file loads the first time it is switched on
        loaded[id] = j.rows || [];
        if (c.type === 'heat') loaded[id].cellKm = j.cell_km || 400;
        addLayer(c); finish();
      }).catch(function () { say('Could not load ' + c.name); btns.forEach(function (b) { b.removeAttribute('aria-busy'); }); });
    }
    finish();
    function finish() {
      active[id] = on; btns.forEach(function (b) { b.removeAttribute('aria-busy'); });
      if (loaded[id]) setVisible(c, on);
      if (on && isEmpty(c) && c.computed !== 'placeholder') say(emptyMsg(c)); else if (on) say('');
      if (id === 'heat') heatKey.hidden = !on || !counts.heat;
      if (id === 'magnus') { var list = (loaded.magnus || []).map(function (r) { return r.country; }); map.setFilter('tllm-magnus-outline', ['in', ['get', 'a2'], ['literal', list]]); map.setLayoutProperty('tllm-magnus-outline', 'visibility', on ? 'visible' : 'none'); }
      renderBar(); density(); renderList();
    }
  }
  function logbookMsg(c) {
    var n = counts[c.id];
    if (n == null || n === 0) return c.name + ': ' + (empty.list_zero || 'nothing logged yet.');
    return c.name + ': ' + fmt(n) + ' in your logbook. The logbook holds names, not map points.';
  }
  function hideLayer(c) { var l = 'tllm-pt-' + c.id; if (map && map.getLayer(l)) map.setLayoutProperty(l, 'visibility', 'none'); if (popup && popup._tllm === c.id) popup.remove(); }
  // A record change can turn the owner's pins on or off for the logbook lists that are switched on.
  function syncLogbookPins() {
    colls.forEach(function (c) {
      if (c.count_from !== 'logbook' || !active[c.id]) return;
      if (!pinsAllowed(c)) hideLayer(c); else if (!map.getLayer('tllm-pt-' + c.id)) toggle(c.id, true); else setVisible(c, true);
    });
  }
  function refreshLineLayers() {
    var s = map.getSource('tllm-src-extremes'); if (s) { loaded.extremes = extremesRows(); s.setData(toGeo(byId.extremes, loaded.extremes)); }
    var l = map.getSource('tllm-lines'); if (l) l.setData(linesGeo());
  }
  function emptyMsg(c) {
    if (c.id === 'moments') return empty.human || 'Nothing here yet.';
    if (c.type === 'heat') return empty.heat || 'Nothing synced.';
    var s = srcs[c.source]; if (s && s.connected === false) return (s.label || upper(c.source)) + ' · ' + (empty.source_never || 'not connected.');
    return c.name + ': ' + (empty.list_zero || 'nothing logged yet.');
  }
  function extremesRows() {
    var x = LINES; if (!x || !x.n) return [];
    return [['Furthest north', x.north], ['Furthest south', x.south], ['Furthest east', x.east], ['Furthest west', x.west]].filter(function (r) { return r[1]; }).map(function (r) {
      var iso = r[1].iso; return { name: nameOf(iso) || iso, collection: 'extremes', latitude: r[1].lat, longitude: r[1].lon, country: loggedIso[iso] || iso, verb: 'reached', year: '', note: r[0] + ', by country: the center of its shape.', link: '', depth: '', done: true };
    });
  }
  function toGeo(c, rows) {
    return { type: 'FeatureCollection', features: rows.filter(function (r) { return r.latitude != null && r.longitude != null; }).map(function (r, i) {
      return { type: 'Feature', id: i, properties: Object.assign({}, r, { _c: c.id, _nd: r.done === false }), geometry: { type: 'Point', coordinates: [r.longitude, r.latitude] } }; }) };
  }
  function addLayer(c) {
    var src = 'tllm-src-' + c.id; if (map.getSource(src)) return;
    if (c.type === 'heat') return addHeat(c, src);
    map.addSource(src, { type: 'geojson', data: toGeo(c, loaded[c.id]) });
    var color = colorFor(c);
    if (c.id === 'cities') {
      // Rule 2, quiet cities: dots, smaller and fainter when more than three point layers are on.
      map.addLayer({ id: 'tllm-pt-' + c.id, type: 'circle', source: src, paint: { 'circle-color': color, 'circle-radius': 2.2, 'circle-opacity': 0, 'circle-opacity-transition': { duration: reduce ? 0 : 180 }, 'circle-stroke-width': 0.6, 'circle-stroke-color': C.ink, 'circle-stroke-opacity': 0, 'circle-stroke-opacity-transition': { duration: reduce ? 0 : 180 } } });
    } else {
      map.addLayer({ id: 'tllm-pt-' + c.id, type: 'symbol', source: src, layout: {
        'icon-image': ['case', ['boolean', ['get', '_nd'], false], iconName(c, true), iconName(c, false)],
        'icon-size': ['interpolate', ['linear'], ['zoom'], 1, c.id === 'airports' ? 0.42 : 0.5, 6, 0.8], 'icon-allow-overlap': true, 'icon-ignore-placement': true },
        paint: { 'icon-opacity': 0, 'icon-opacity-transition': { duration: reduce ? 0 : 180 }, 'icon-translate': reduce ? [0, 0] : [0, -3], 'icon-translate-transition': { duration: reduce ? 0 : 180 } } });
    }
    map.on('click', 'tllm-pt-' + c.id, function (e) { e.originalEvent._tllmPin = true; openCard(e.features[0].properties, e.features[0].geometry.coordinates); });
    map.on('mouseenter', 'tllm-pt-' + c.id, function () { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'tllm-pt-' + c.id, function () { map.getCanvas().style.cursor = ''; });
  }
  function hexPolygon(lat, lng, km) {
    var R = km / 2 / 111.32, cosl = Math.max(0.2, Math.cos(lat * Math.PI / 180)), ring = [];
    for (var i = 0; i <= 6; i++) { var a = Math.PI / 3 * i; ring.push([lng + R * Math.cos(a) / cosl, lat + R * Math.sin(a)]); }
    return ring;
  }
  function addHeat(c, src) {
    var rows = loaded[c.id], km = rows.cellKm || 400;
    var fc = { type: 'FeatureCollection', features: rows.map(function (r, i) { return { type: 'Feature', id: i, properties: { bucket: r.bucket || 1 }, geometry: { type: 'Polygon', coordinates: [hexPolygon(r.latitude, r.longitude, km)] } }; }) };
    map.addSource(src, { type: 'geojson', data: fc });
    map.addLayer({ id: 'tllm-pt-' + c.id, type: 'fill', source: src, paint: { 'fill-color': C.teal, 'fill-opacity': 0, 'fill-opacity-transition': { duration: reduce ? 0 : 180 } } }, 'tllm-land');
  }
  function heatOpacity(on) { return on ? ['interpolate', ['linear'], ['get', 'bucket'], 1, 0.14, 5, 0.7] : 0; }
  function setVisible(c, on) {
    var l = 'tllm-pt-' + c.id; if (!map.getLayer(l)) return;
    var prop = c.type === 'heat' ? 'fill-opacity' : c.id === 'cities' ? 'circle-opacity' : 'icon-opacity';
    if (on) {
      map.setLayoutProperty(l, 'visibility', 'visible');
      requestAnimationFrame(function () {
        map.setPaintProperty(l, prop, c.type === 'heat' ? heatOpacity(true) : c.id === 'cities' ? 0.72 : 1);
        if (c.id === 'cities') map.setPaintProperty(l, 'circle-stroke-opacity', 1);
        if (prop === 'icon-opacity') map.setPaintProperty(l, 'icon-translate', [0, 0]);
      });
    } else {
      map.setPaintProperty(l, prop, 0); if (c.id === 'cities') map.setPaintProperty(l, 'circle-stroke-opacity', 0);
      if (prop === 'icon-opacity' && !reduce) map.setPaintProperty(l, 'icon-translate', [0, -3]);
      setTimeout(function () { if (!active[c.id]) map.setLayoutProperty(l, 'visibility', 'none'); }, reduce ? 0 : 200);
      if (popup && popup._tllm === c.id) popup.remove();
    }
  }
  // Rule 2: past three point layers, cities drop to 1.3 px at 45 percent and other pins shrink 20 percent.
  function density() {
    var pointLayers = colls.filter(function (c) { return active[c.id] && c.id !== 'countries' && c.type !== 'heat' && !c.computed; }).length;
    var many = pointLayers > 3;
    if (map.getLayer('tllm-pt-cities')) { map.setPaintProperty('tllm-pt-cities', 'circle-radius', many ? 1.5 : 2.2); if (active.cities) map.setPaintProperty('tllm-pt-cities', 'circle-opacity', many ? 0.45 : 0.72); }
    colls.forEach(function (c) {
      var l = 'tllm-pt-' + c.id; if (c.id === 'cities' || !map.getLayer(l) || map.getLayer(l).type !== 'symbol') return;
      var base = c.id === 'airports' ? 0.42 : 0.5, k = many ? 0.8 : 1;
      map.setLayoutProperty(l, 'icon-size', ['interpolate', ['linear'], ['zoom'], 1, base * k, 6, 0.8 * k]);
    });
  }
  // Lines crossed, by country: the equator and the prime meridian, drawn on the map when that chip is on. The polar
  // circles, tropics and antimeridian need place coordinates the record does not hold (B3.4).
  function linesGeo() {
    var x = LINES || {};
    return { type: 'FeatureCollection', features: [
      { type: 'Feature', properties: { name: 'Equator', crossed: !!x.equator }, geometry: { type: 'LineString', coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]] } },
      { type: 'Feature', properties: { name: 'Prime meridian', crossed: !!x.meridian }, geometry: { type: 'LineString', coordinates: [[0, -80], [0, 0], [0, 80]] } }] };
  }
  function drawCrossed(on) {
    if (!map.getSource('tllm-lines')) {
      map.addSource('tllm-lines', { type: 'geojson', data: linesGeo() });
      map.addLayer({ id: 'tllm-lines', type: 'line', source: 'tllm-lines', paint: { 'line-color': ['case', ['get', 'crossed'], C.cream, C.muted], 'line-width': 1.2, 'line-dasharray': [4, 3], 'line-opacity': 0, 'line-opacity-transition': { duration: reduce ? 0 : 180 } } });
      map.on('mousemove', 'tllm-lines', function (e) { var p = e.features[0].properties; tip.innerHTML = '<b>' + esc(p.name) + '</b><span>' + (p.crossed ? 'crossed' : 'Not yet') + '</span>'; tip.style.transform = 'translate(' + (e.point.x + 14) + 'px,' + (e.point.y - 8) + 'px)'; tip.style.opacity = '1'; });
      map.on('mouseleave', 'tllm-lines', function () { tip.style.opacity = '0'; });
    }
    map.setLayoutProperty('tllm-lines', 'visibility', 'visible');
    requestAnimationFrame(function () { map.setPaintProperty('tllm-lines', 'line-opacity', on ? 0.9 : 0); });
    if (!on) setTimeout(function () { if (!active.crossed) map.setLayoutProperty('tllm-lines', 'visibility', 'none'); }, reduce ? 0 : 200);
  }
  function move(coords, zoom) {
    var o = { center: coords, zoom: zoom };
    if (reduce) map.jumpTo(o); else map.easeTo(Object.assign(o, { duration: 480, easing: function (t) { return 1 - Math.pow(1 - t, 3); } }));
  }

  // ---------- popover (design 1f, 04): collection, name, VERB · YEAR, note, story line ----------
  function openCard(p, coords) {
    var c = byId[p._c] || {}; var maplibregl = window.maplibregl;
    if (popup) popup.remove();
    var notDone = p._nd === true || p._nd === 'true' || p.done === false || p.done === 'false';
    var verb = p._country ? p.verb : (notDone ? 'Not yet' : (c.verb || p.verb)); // the list's verb; export rows carried old ones
    var meta = upper(verb) + ' · ' + (p.year ? upper(String(p.year)) : notDone ? 'OPEN SLOT' : 'YEAR NOT LOGGED');
    var note = p.note || (p.type ? p.type + (p.country ? ' · ' + p.country : '') : '');
    var link = p.link ? '<a class="tllm-pop-a" href="' + esc(p.link) + '" ' + (/^https?:/.test(p.link) ? 'target="_blank" rel="noopener"' : '') + '>' + (/unesco\.org/.test(p.link) ? 'Official UNESCO page →' : 'Read the ' + esc(p.story || p.name) + ' story →') + '</a>'
      : (p._country ? '<p class="tllm-pop-c">' + esc(empty.popover_no_story || 'No story from here yet.') + '</p>' : '');
    var whyP = p._country && p._iso ? K.why(p._iso) : null; // rulebook why: not among the 193 UN members
    var html = '<div class="tllm-pop-k">' + esc(c.name || p.collection) + '</div><h3 class="tllm-pop-h">' + esc(p.name) + '</h3>' + (whyP ? '<p class="tllm-pop-why">' + esc(whyP.text) + '</p>' : '') + '<p class="tllm-pop-m">' + esc(meta) + '</p>' +
      (note ? '<p class="tllm-pop-n">' + esc(note) + '</p>' : '') + link + (p.confirm === true || p.confirm === 'true' ? '<p class="tllm-pop-c">Listing to confirm.</p>' : '');
    if (p._country && p.country !== undefined) {
      var iso = p._iso || '';
      if (canEdit() && iso) {
        var cur = REC && REC.me[iso] || '';
        html += '<div class="tllm-pop-edit" role="group" aria-label="Log ' + esc(p.name) + '">' + [['lived', 'Lived'], ['visited', 'Stayed'], ['layover', 'Layover only']].map(function (d) { return '<button type="button" data-d="' + d[0] + '" aria-pressed="' + (cur === DEPTH[d[0]] ? 'true' : 'false') + '">' + d[1] + '</button>'; }).join('') + (cur ? '<button type="button" data-d="" class="tllm-pop-clear">Clear</button>' : '') + '</div>';
      } else if (member === false && !(REC && REC.source === 'local')) {
        html += '<a class="tllm-pop-a" href="' + esc(root.getAttribute('data-tll-login') || '/signup') + '">' + esc(empty.login_to_log || 'Log in to map your own countries →') + '</a>';
      }
    }
    popup = new maplibregl.Popup({ className: 'tllm-pop tllm-pop-enter', offset: 14, maxWidth: '320px', focusAfterOpen: true }).setLngLat(coords).setHTML(html).addTo(map);
    popup._tllm = p._c;
    if (p._country && p._iso) {
      var ed = popup.getElement() && popup.getElement().querySelector('.tllm-pop-edit');
      if (ed) ed.addEventListener('click', function (ev) {
        var b = ev.target.closest('button'); if (!b) return;
        var key = b.getAttribute('data-d'); writeDepth(p._iso, key);
        var now = REC && REC.me[p._iso] || '';
        [].forEach.call(ed.querySelectorAll('button[data-d]'), function (x) { if (x.getAttribute('data-d')) x.setAttribute('aria-pressed', now === DEPTH[x.getAttribute('data-d')] ? 'true' : 'false'); });
        var cl = ed.querySelector('.tllm-pop-clear'); if (now && !cl) { cl = document.createElement('button'); cl.type = 'button'; cl.className = 'tllm-pop-clear'; cl.setAttribute('data-d', ''); cl.textContent = 'Clear'; ed.appendChild(cl); } else if (!now && cl) cl.remove();
        var m = popup.getElement().querySelector('.tllm-pop-m'); if (m) m.textContent = upper(now || 'Not yet') + ' · ' + (now ? 'LOGGED JUST NOW' : 'CLEARED');
        var nn = popup.getElement().querySelector('.tllm-pop-n'); if (nn) nn.textContent = now === 'Lived' ? 'Lived here. The deepest of the three depths.' : now === 'Stayed' ? 'Left the airport and slept at least one night.' : now === 'Layover only' ? 'Never left the terminal. Counted, on a separate shelf.' : 'Not yet. The cream.';
        say(p.name + ', ' + (now || 'cleared'));
      });
    }
    var box = popup.getElement(); if (box) { box.querySelector('.maplibregl-popup-close-button').setAttribute('aria-label', 'Close card'); box.addEventListener('animationend', function () { box.classList.remove('tllm-pop-enter'); }, { once: true }); }
    say(p.name + ', ' + (c.name || ''));
  }
  var EXTRA_NAMES = { CN: 'China', JO: 'Jordan', IT: 'Italy', KR: 'South Korea', ID: 'Indonesia', ZA: 'South Africa', EG: 'Egypt', GB: 'United Kingdom', DE: 'Germany', US: 'United States', PT: 'Portugal', CZ: 'Czechia', DK: 'Denmark', ES: 'Spain', AU: 'Australia', JP: 'Japan', MA: 'Morocco' };
  function countryName(a2) { var r = countryRows[a2]; return r ? r.name : (EXTRA_NAMES[a2] || a2 || ''); }

  // ---------- the receipts: one card per list ----------
  function dateLabel(iso) {
    if (!iso) return ''; var m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(iso); if (!m) return iso;
    var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return (m[3] ? parseInt(m[3], 10) + ' ' : '') + (m[2] ? MON[parseInt(m[2], 10) - 1] + ' ' : '') + m[1];
  }
  function sourceBadge(c) {
    var s = srcs[c.source]; if (!s || !s.label) return null; // hand lists carry no badge; that is the badge
    var b = el('span', 'tllm-card-src');
    if (c.source === 'member' || c.source === 'logbook' || c.id === 'countries' || c.id === 'magnus') { if (!REC) return null; b.textContent = (s.label || 'FROM THE MEMBER RECORD') + (REC.source === 'owner' ? ' · SITE OWNER' : ' · LIVE'); return b; }
    if (s.connected === false) { b.textContent = s.label + ' · NOT CONNECTED'; b.dataset.off = '1'; }
    else b.textContent = s.label + (s.synced ? ' · SYNCED ' + upper(dateLabel(s.synced)) : '');
    return b;
  }
  // The receipts, rebuilt on every repaint. Countries from the record, the logbook lists from the logbook.
  var cardGrid = null, counted = false;
  function cardShell(c) {
    var card = el('article', 'tllm-card'); card.dataset.id = c.id;
    var top = el('div', 'tllm-card-top'); top.appendChild(el('span', 'tllm-card-label', c.name)); var sb = sourceBadge(c); if (sb) top.appendChild(sb); card.appendChild(top);
    return card;
  }
  function cardBar(card, n, of, label) { var pct = Math.min(100, n / of * 100); var bar = el('div', 'tllm-card-bar'); bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', label || Math.round(pct) + ' percent'); var fi = el('i'); fi.style.width = pct.toFixed(2) + '%'; bar.appendChild(fi); card.appendChild(bar); }
  function cardFoot(card, c, cap) {
    if (cap) card.appendChild(el('p', 'tllm-card-cap', cap));
    if (c.what_counts) card.appendChild(el('p', 'tllm-card-rule', 'What counts: ' + c.what_counts));
    var asof = c.as_of_label || (c.denominator && c.as_of ? 'World total as of ' + dateLabel(c.as_of) : ''); // live counts carry no "as of"
    if (asof) card.appendChild(el('p', 'tllm-card-asof', asof));
  }
  function countriesCard(c, v) {
    var card = cardShell(c);
    var num = el('div', 'tllm-card-num'); num.innerHTML = '<b data-count="' + v.countries + '">' + fmt(v.countries) + '</b>' + (v.antarctica ? '<span class="tllm-card-den">+ Antarctica</span>' : ''); card.appendChild(num);
    card.appendChild(el('div', 'tllm-card-verb', c.verb));
    card.appendChild(el('div', 'tllm-card-sub', 'Places ' + fmt(v.places) + ' of ' + fmt(v.of) + ' · ' + v.pct + '%'));
    cardBar(card, v.places, v.of, 'Places: ' + v.places + ' of ' + v.of + ', ' + Math.round(v.places / v.of * 100) + ' percent');
    card.appendChild(depthBlock(v));
    if (v.continents || !visitor()) card.appendChild(el('div', 'tllm-card-sub', 'Continents ' + v.continents + ' of 7' + (v.continentNames.length ? ' · ' + v.continentNames.join(', ') : '')));
    cardFoot(card, c, v.places === 0 ? fill(empty.card_zero || '0 of {of}.', v) : fill(c.caption, v));
    return card;
  }
  function renderCards(dv) {
    if (!secCards) return;
    var grid = el('div', 'tllm-card-grid'), shown = 0;
    colls.forEach(function (c) {
      if (c.computed) return;
      if (c.id === 'countries') { if (!REC || (dv.places === 0 && visitor())) return; grid.appendChild(countriesCard(c, dv)); shown++; return; }
      var n = counts[c.id]; if (n == null) return;
      if (n === 0 && (visitor() || !c.denominator)) return;
      var v = Object.assign({}, vars[c.id] || {}, { n: n, of: c.denominator });
      if (c.denominator) { v.rest = Math.max(0, c.denominator - n); v.pct = Math.round(n / c.denominator * 1000) / 10; v.half = Math.ceil(c.denominator / 2); }
      var card = cardShell(c);
      var num = el('div', 'tllm-card-num'); num.innerHTML = '<b data-count="' + n + '">' + fmt(n) + '</b>' + (c.denominator ? '<span class="tllm-card-den">of ' + fmt(c.denominator) + '</span>' : ''); card.appendChild(num);
      card.appendChild(el('div', 'tllm-card-verb', c.verb));
      if (c.denominator) cardBar(card, n, c.denominator);
      cardFoot(card, c, n === 0 ? fill(empty.card_zero || '0 of {of}.', v) : fill(c.caption, v));
      grid.appendChild(card); shown++;
    });
    if (cardGrid) cardGrid.remove(); cardGrid = grid; secCards.appendChild(grid); secCards.style.display = shown ? '' : 'none';
    if (shown && !counted) { counted = true; countUp(grid); }
  }
  function depthBlock(v) {
    var wrap = el('div', 'tllm-depth'); wrap.setAttribute('role', 'list'); wrap.setAttribute('aria-label', 'Depth of visit');
    [['Lived', v.lived], ['Stayed', v.stayed], ['Layover only', v.layover, 'counted apart'], ['Not yet', v.notyet]].forEach(function (d) {
      if (!d[1] && visitor()) return;
      var li = el('div', 'tllm-depth-row'); li.setAttribute('role', 'listitem');
      var sw = el('i', 'tllm-depth-sw'); sw.dataset.d = d[0]; li.appendChild(sw); var l = el('span', 'tllm-depth-l', d[0]); if (d[2]) l.appendChild(el('em', 'tllm-depth-x', ' · ' + d[2])); li.appendChild(l); li.appendChild(el('b', 'tllm-depth-n', fmt(d[1] || 0))); wrap.appendChild(li);
    });
    if (v.proposed) wrap.appendChild(el('p', 'tllm-depth-note', fmt(v.proposed) + ' more with pins in Places Been and nothing logged. Not counted until you log them.'));
    return wrap;
  }
  function countUp(scope) {
    var nums = [].slice.call(scope.querySelectorAll('b[data-count]')).filter(function (n) { return /^\d/.test(n.textContent); });
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var end = +e.target.dataset.count, t0 = performance.now(), D = 1300;
        (function tick(t) { var k = Math.min(1, (t - t0) / D); k = 1 - Math.pow(1 - k, 3); e.target.textContent = fmt(Math.round(end * k)); if (k < 1) requestAnimationFrame(tick); })(t0);
      });
    }, { threshold: 0.3 });
    nums.forEach(function (n) { n.textContent = '0'; io.observe(n); });
  }
  // B3.2: many ways to count, from the record. Codes of 249 (ISO plus Kosovo), UN members of 193, UN plus the two observers of 195.
  var rulesGrid = null, whyBox = null;
  function renderRules() {
    var rb = cfg.rulebooks || []; if (!secRules) return;
    if (!rb.length || !REC) { secRules.style.display = 'none'; return; }
    var k = REC.count, val = { codes: k.codes, un_only: k.un, un_or_observer: k.unObservers }, grid = el('div', 'tllm-rules'), shown = 0;
    rb.forEach(function (r) {
      var n = r.count && val[r.count] != null ? val[r.count] : null;
      if (n === 0 && visitor()) return;
      if (n != null) shown++;
      var d = el('div', 'tllm-rule'); var nn = el('div', 'tllm-rule-n'); nn.innerHTML = (n == null ? '<span style="font-size:16px;color:#8890A6;margin:0">OPEN</span>' : fmt(n)) + '<span>of ' + fmt(r.of) + '</span>'; d.appendChild(nn);
      d.appendChild(el('p', 'tllm-rule-w', r.who)); grid.appendChild(d);
    });
    if (rulesGrid) rulesGrid.remove(); rulesGrid = grid; secRules.appendChild(grid);
    if (whyBox) whyBox.remove(); whyBox = whyList(k.placeIsos); if (whyBox) secRules.appendChild(whyBox);
    secRules.style.display = shown ? '' : 'none';
  }
  // Why the numbers differ (20 October 2026): the record's own places that are not UN members, each with its why.
  function whyList(isos) {
    var ws = (isos || []).map(function (i) { return K.why(i); }).filter(Boolean); if (!ws.length) return null;
    ws.sort(function (a, b) { return a.name.localeCompare(b.name); });
    var box = el('div', 'tllm-why'); box.appendChild(el('h3', 'tllm-why-h', 'Why the numbers differ'));
    box.appendChild(el('p', 'tllm-why-l', (visitor() ? 'Places on this map' : 'Your places') + ' that are not among the 193 UN members, and where each one counts.'));
    var ul = el('ul', 'tllm-why-ul');
    ws.forEach(function (w) { var li = el('li'); li.appendChild(el('b', null, w.name)); li.appendChild(document.createTextNode(' · ' + w.text)); ul.appendChild(li); });
    box.appendChild(ul); return box;
  }

  // ---------- sets of seven: stamps with three-letter codes ----------
  function buildStamps() {
    var all = cfg.collections || [], made = 0;
    var sets = (cfg.sets_of_seven || []).filter(function (st) { var owner = all.filter(function (c) { return c.set_of === st.id; })[0]; return !(owner && owner.hidden_until_loggable); }); // B3.5
    if (!sets.length) { secSets.remove(); return; }
    sets.forEach(function (st) {
      var items = st.items, done = items.filter(function (i) { return i.done; }).length, open = items.length - done;
      var coll = colls.filter(function (c) { return c.set_of === st.id; })[0];
      var sec = el('div', 'tllm-set');
      var head = el('div', 'tllm-set-head'); head.appendChild(el('h3', 'tllm-set-name', st.name));
      var n = el('div', 'tllm-set-n'); n.innerHTML = done + '<span>of ' + items.length + '</span>'; head.appendChild(n); sec.appendChild(head);
      var row = el('div', 'tllm-stamps'); row.setAttribute('role', 'group'); row.setAttribute('aria-label', st.name);
      var rc = el('div', 'tllm-receipt'); rc.setAttribute('aria-live', 'polite');
      function receipt(it) {
        if (!it) { rc.innerHTML = '<b>Tap a stamp for the receipt.</b><span>' + open + ' open slot' + (open === 1 ? '' : 's') + '</span>'; return; }
        rc.innerHTML = '<b>' + esc(it.name) + (it.country ? ', ' + esc(countryName(it.country)) : '') + '</b><span>' + esc(it.done ? upper(st.verb || coll && coll.verb || 'done') + ' · YEAR NOT LOGGED' : 'NOT YET · OPEN SLOT') + '</span>';
      }
      function stamp(it, extra) {
        var b = el('button', 'tllm-stamp' + (it.done ? ' tllm-stamp-done' : '') + (extra ? ' tllm-stamp-extra' : '')); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
        b.textContent = it.code || '·'; b.setAttribute('aria-label', it.name + (it.country ? ', ' + countryName(it.country) : '') + ', ' + (it.done ? 'done' : 'not yet') + (extra ? ', honorary, outside the row' : ''));
        b.addEventListener('click', function () {
          var was = b.getAttribute('aria-pressed') === 'true';
          [].forEach.call(row.querySelectorAll('.tllm-stamp'), function (x) { x.setAttribute('aria-pressed', 'false'); });
          if (was) { receipt(null); return; } b.setAttribute('aria-pressed', 'true'); receipt(it);
        });
        return b;
      }
      items.forEach(function (it) { row.appendChild(stamp(it, false)); });
      if (st.honorary) row.appendChild(stamp(st.honorary, true));
      sec.appendChild(row); receipt(null); sec.appendChild(rc);
      var cap = coll && coll.caption ? fill(coll.caption, { n: done, of: items.length }) : (st._note || '');
      if (cap) sec.appendChild(el('p', 'tllm-set-cap', cap));
      if (st.as_of) sec.appendChild(el('p', 'tllm-card-asof', 'List as of ' + dateLabel(st.as_of)));
      secSets.appendChild(sec);
    });
  }

  // ---------- lines strip (B3.4): by country, number first, label second, source third ----------
  var stripBox = null;
  function renderStrip() {
    if (!secStrip) return;
    var lede = secStrip.querySelector('.tllm-lede');
    if (lede) lede.textContent = REC && REC.source === 'owner' ? 'From Nancy\u2019s map, so it changes when hers does.' : 'From the countries on your map, so it changes when your map does.';
    var x = LINES; if (stripBox) { stripBox.remove(); stripBox = null; }
    if (!x || !x.n) { secStrip.style.display = 'none'; return; }
    var box = el('div'), strip = el('div', 'tllm-strip'); box.appendChild(strip);
    function cell(v, l, s, muted) { var d = el('div', 'tllm-cell' + (muted ? ' tllm-cell-muted' : '')); d.appendChild(el('div', 'tllm-cell-v', v)); d.appendChild(el('div', 'tllm-cell-l', l)); if (s) d.appendChild(el('div', 'tllm-cell-s', s)); return d; }
    function deg(n, pos, neg) { return Math.abs(n).toFixed(1) + '°' + (n >= 0 ? pos : neg); }
    [['Furthest north', x.north, 'lat'], ['Furthest south', x.south, 'lat'], ['Furthest east', x.east, 'lng'], ['Furthest west', x.west, 'lng']].forEach(function (r) {
      var p = r[1]; if (!p) return; var nm = nameOf(p.iso) || p.iso;
      var c = cell(r[2] === 'lat' ? deg(p.lat, 'N', 'S') : deg(p.lon, 'E', 'W'), r[0] + ', by country', nm);
      c.tabIndex = 0; c.setAttribute('role', 'button'); c.setAttribute('aria-label', r[0] + ', by country: ' + nm + '. Show on the map');
      function go() { if (map) move([p.lon, p.lat], 4); } c.addEventListener('click', go); c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      strip.appendChild(c);
    });
    strip.appendChild(cell(x.equator ? 'Crossed' : 'Not yet', 'Equator', 'Countries north and south'));
    strip.appendChild(cell(x.meridian ? 'Crossed' : 'Not yet', 'Prime meridian', 'Countries east and west'));
    strip.appendChild(cell(x.hemisphereCount + '/4', 'Hemispheres, by country', x.hemispheres.join(', ')));
    var k = REC.count; strip.appendChild(cell(k.continents.length + '/7', 'Continents', k.continents.join(', ')));
    box.appendChild(el('p', 'tllm-card-asof', 'By country: each country counts once, at the center of its shape. Antarctica counts as a continent.'));
    stripBox = box; secStrip.appendChild(box); secStrip.style.display = '';
  }

  // ---------- framed embeds ----------
  function buildEmbeds() {
    var items = cfg.embeds && cfg.embeds.items || []; if (!items.length) { secFrames.remove(); return; }
    var grid = el('div', 'tllm-frame-grid'); secFrames.appendChild(grid); var strava = false;
    items.forEach(function (it) {
      var f = el('figure', 'tllm-frame tllm-frame-' + it.type);
      var cap = el('figcaption', 'tllm-frame-cap'); cap.appendChild(el('span', 'tllm-frame-k', (it.type === 'strava' ? 'From Strava · official embed' : it.type === 'polarsteps' ? 'From Polarsteps · trip embed' : it.type))); cap.appendChild(el('span', 'tllm-frame-l', it.label || '')); f.appendChild(cap);
      var body = el('div', 'tllm-frame-body');
      if (it.type === 'strava' && /^\d+$/.test(it.strava_activity_id || '')) {
        var d = el('div', 'strava-embed-placeholder'); d.setAttribute('data-embed-type', 'activity'); d.setAttribute('data-embed-id', it.strava_activity_id); d.setAttribute('data-style', 'standard'); d.setAttribute('data-map-hash', ''); body.appendChild(d); strava = true;
        f.appendChild(body); f.appendChild(el('div', 'tllm-frame-open tllm-frame-badge', 'Route hidden near home'));
      } else if (it.type === 'polarsteps' && /^https:\/\/(www\.)?polarsteps\.com\//.test(it.src || '')) {
        var ifr = el('iframe'); ifr.src = it.src; ifr.title = it.label || 'Polarsteps trip'; ifr.loading = 'lazy'; ifr.setAttribute('allowfullscreen', ''); ifr.referrerPolicy = 'no-referrer-when-downgrade'; body.appendChild(ifr); f.appendChild(body);
        var a = el('a', 'tllm-frame-open', 'Open trip →'); a.href = it.src.replace(/\/embed.*$/, ''); a.target = '_blank'; a.rel = 'noopener'; f.appendChild(a);
      } else {
        var ph = el('div', 'tllm-frame-empty'); ph.appendChild(el('p', null, it.type === 'strava' ? 'No activity linked. Paste an official embed link and it sits here, framed.' : 'Trip embed: open slot.')); body.appendChild(ph); f.appendChild(body);
      }
      grid.appendChild(f);
    });
    if (strava) script('https://strava-embeds.com/embed.js').catch(function () {});
  }

  // ---------- keyboard pin list ----------
  function renderList() {
    if (!listUl) return;
    var q = (listFilter.value || '').trim().toLowerCase(); listUl.innerHTML = ''; var items = [];
    colls.forEach(function (c) { if (c.id === 'countries' || !active[c.id] || !loaded[c.id] || c.type === 'heat' || !pinsAllowed(c)) return; loaded[c.id].forEach(function (r) { if (r.name && r.latitude != null) items.push({ c: c, r: r }); }); });
    if (active.countries && mapReady && REC) recordRows(REC.all, 'logged').forEach(function (r) { items.push({ c: byId.countries, r: r }); }); // the record's places, not the export
    items.sort(function (a, b) { return a.r.name.localeCompare(b.r.name); });
    var shown = 0;
    items.forEach(function (it) {
      var hay = (it.r.name + ' ' + countryName(it.r.country) + ' ' + it.c.name).toLowerCase(); if (q && hay.indexOf(q) < 0) return; if (++shown > 400) return;
      var li = el('li'), b = el('button'); b.type = 'button';
      var w = it.c.id === 'countries' && it.r.iso ? K.why(it.r.iso) : null;
      b.innerHTML = (w ? '<b class="tllm-list-nm">' + esc(it.r.name) + '<small class="tllm-list-why">' + esc(w.text) + '</small></b>' : esc(it.r.name)) + '<span>' + esc(it.c.id === 'countries' ? (depthOf(it.r) || 'logged') : countryName(it.r.country)) + '</span>';
      b.addEventListener('click', function () {
        var co = [it.r.longitude, it.r.latitude]; move(co, it.c.id === 'countries' ? 4 : 9);
        if (it.c.id !== 'countries') map.once('moveend', function () { openCard(Object.assign({}, it.r, { _c: it.c.id }), co); }); else say(it.r.name + ', ' + (depthOf(it.r) || 'logged'));
      });
      li.appendChild(b); listUl.appendChild(li);
    });
    if (!shown) listUl.appendChild(el('p', 'tllm-list-empty', q ? 'No pin matches that.' : 'Switch a list on to see its pins here.'));
  }
})();
