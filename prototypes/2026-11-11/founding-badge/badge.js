/* That Layover Life: founding badge image maker (prototype, 11 Nov 2026).
   Draws one PNG on a canvas from a data object. No dependencies, no network, no geolocation.
   Works as window.TLLBadge in a page and as module.exports in node (pure parts only).

   data = {
     design: 'traveler' | 'paw',
     format: 'story' | 'square' | 'landscape',
     theme:  'dark' | 'light',
     name:   display name or pen name (already resolved, see displayName),
     number: founding number from the member record (integer),
     cap:    100 when the program cap is confirmed, otherwise null (then "of 100" is not drawn),
     city:   { code, name, lat, lon } chosen by the member, or null for no location,
     word:   the word after the arrow ("anywhere"),
     joined: 'YYYY-MM-DD',
     pet:    { name, species, breed, places: [names] }   (paw design only)
   } */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TLLBadge = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FORMATS = {
    story:     { w: 1080, h: 1920, label: 'Story 1080 x 1920',     file: 'story' },
    square:    { w: 1080, h: 1080, label: 'Square 1080 x 1080',    file: 'square' },
    landscape: { w: 1200, h: 675,  label: 'Landscape 1200 x 675',  file: 'landscape' }
  };

  /* TLL Brand Kit v2.4. One accent per theme: Maldives Teal on dark only, Deep Teal on light. */
  var THEMES = {
    dark:  { bg: '#0A0B14', fg: '#F7F1E8', muted: '#BDB8AE', hair: '#2E2F3D', accent: '#00C9C8', ink: '#F7F1E8', inkAlpha: 0.92 },
    light: { bg: '#FDF9F3', fg: '#1A1A1A', muted: '#6B6660', hair: '#E8E2D6', accent: '#067A79', ink: '#0A0B14', inkAlpha: 0.88 }
  };

  var FONT = {
    head: '"Playfair Display", Georgia, "Times New Roman", serif',
    text: '"IBM Plex Sans Condensed", "Arial Narrow", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
  };

  /* City-level only, rounded to one decimal (about 10 km). Copenhagen, the home cities shown on the
     public /travelers page, and cities from published stories. Codes are the usual airport code for the city. */
  var CITIES = [
    { id: 'cph', code: 'CPH', name: 'Copenhagen',  lat: 55.7,  lon: 12.6 },
    { id: 'mad', code: 'MAD', name: 'Madrid',      lat: 40.4,  lon: -3.7 },
    { id: 'alc', code: 'ALC', name: 'Torrevieja',  lat: 38.0,  lon: -0.7 },
    { id: 'cai', code: 'CAI', name: 'Cairo',       lat: 30.0,  lon: 31.2 },
    { id: 'bkk', code: 'BKK', name: 'Bangkok',     lat: 13.8,  lon: 100.5 },
    { id: 'phx', code: 'PHX', name: 'Phoenix',     lat: 33.4,  lon: -112.1 },
    { id: 'lis', code: 'LIS', name: 'Lisbon',      lat: 38.7,  lon: -9.1 },
    { id: 'ist', code: 'IST', name: 'Istanbul',    lat: 41.0,  lon: 29.0 },
    { id: 'msy', code: 'MSY', name: 'New Orleans', lat: 30.0,  lon: -90.1 },
    { id: 'gru', code: 'GRU', name: 'São Paulo',   lat: -23.5, lon: -46.6 },
    { id: 'akl', code: 'AKL', name: 'Auckland',    lat: -36.8, lon: 174.8 }
  ];

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /* ---------- pure helpers ---------- */

  /* 42 -> "042". Width follows the cap when there is one (100 -> three digits), three digits otherwise.
     Returns '' for anything that is not a whole number from 1 up (the caller then draws no number at all). */
  function formatNumber(n, cap) {
    var v = typeof n === 'string' && /^\s*\d+\s*$/.test(n) ? parseInt(n, 10) : n;
    if (typeof v !== 'number' || !isFinite(v) || v < 1 || Math.floor(v) !== v) return '';
    if (cap && v > cap) return '';
    var width = Math.max(3, cap ? String(cap).length : 3);
    var s = String(v);
    while (s.length < width) s = '0' + s;
    return s;
  }

  /* One decimal place: about 11 km of latitude. Never more precise than this, whatever comes in. */
  function roundCoord(v) {
    var x = Number(v);
    /* half away from zero, so south and west round the same way as north and east */
    var r = (x < 0 ? -1 : 1) * Math.round(Math.abs(x) * 10 + 1e-9) / 10;
    return r === 0 ? 0 : r; /* no negative zero */
  }

  function normalizeLon(lon) {
    var x = ((Number(lon) + 180) % 360 + 360) % 360 - 180; /* [-180, 180) */
    return x;
  }

  /* "55.7° N 12.6° E". South and west by letter, never by sign. The equator, the prime meridian and the
     antimeridian carry no letter (0.0° and 180.0° belong to neither side). Returns '' when there is no usable pair. */
  function formatCoords(lat, lon) {
    if (lat === null || lon === null || lat === undefined || lon === undefined || lat === '' || lon === '') return '';
    var la = Number(lat), lo = Number(lon);
    if (!isFinite(la) || !isFinite(lo) || la < -90 || la > 90) return '';
    la = roundCoord(la);
    lo = roundCoord(normalizeLon(lo));
    if (lo === -180) lo = 180;
    var a = Math.abs(la).toFixed(1) + '°' + (la === 0 ? '' : la > 0 ? ' N' : ' S');
    var o = Math.abs(lo).toFixed(1) + '°' + (lo === 0 || lo === 180 ? '' : lo > 0 ? ' E' : ' W');
    return a + ' ' + o;
  }

  function parseDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    return { y: y, m: mo, d: d };
  }
  /* Copenhagen order, no time zone math: "11 November 2026". */
  function formatDate(iso) {
    var p = parseDate(iso);
    return p ? p.d + ' ' + MONTHS[p.m - 1] + ' ' + p.y : '';
  }
  /* For the postmark: "11 NOV 2026". */
  function formatStampDate(iso) {
    var p = parseDate(iso);
    return p ? (p.d < 10 ? '0' : '') + p.d + ' ' + MONTHS[p.m - 1].slice(0, 3).toUpperCase() + ' ' + p.y : '';
  }

  /* Distinct places in a pet (or member) record. Counted, never typed. */
  function countPlaces(list) {
    var seen = {}, n = 0;
    (list || []).forEach(function (p) {
      var k = String(p && p.name !== undefined ? p.name : p || '').trim().toLowerCase();
      if (k && !seen[k]) { seen[k] = 1; n++; }
    });
    return n;
  }
  function placesPhrase(n) { return n + (n === 1 ? ' country' : ' countries'); }

  /* Same rule as E.dispName on /edit-profile: credit-mode full | first | pen, with pen-name.
     A member who chose a pen name never has their full name drawn. */
  function displayName(member) {
    var m = member || {};
    var n = String(m.name || '').trim();
    var mode = m['credit-mode'] || 'full';
    var pen = String(m['pen-name'] || '').trim();
    if (mode === 'pen') return pen; /* no pen name saved yet: draw nothing rather than the full name */
    if (mode === 'first') return n.split(/\s+/)[0] || n;
    return n;
  }

  function clean(s, max) {
    return String(s === undefined || s === null ? '' : s).replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max || 60);
  }

  /* Validated model the drawing code works from. */
  function normalize(data) {
    var d = data || {};
    var design = d.design === 'paw' ? 'paw' : 'traveler';
    var format = FORMATS[d.format] ? d.format : 'square';
    var theme = THEMES[d.theme] ? d.theme : 'dark';
    var cap = d.cap ? Math.floor(Number(d.cap)) : null;
    if (!(cap > 0)) cap = null;
    var city = null;
    if (d.city && formatCoords(d.city.lat, d.city.lon)) {
      city = { code: clean(d.city.code, 4).toUpperCase(), name: clean(d.city.name, 28), coords: formatCoords(d.city.lat, d.city.lon) };
    }
    var pet = d.pet || {};
    var m = {
      design: design, format: format, theme: theme,
      name: clean(design === 'paw' ? pet.name : d.name, 60),
      number: formatNumber(d.number, cap),
      cap: cap,
      city: city,
      word: clean(d.word || 'anywhere', 14),
      joined: formatDate(d.joined),
      stampDate: formatStampDate(d.joined),
      species: '',
      places: 0
    };
    if (design === 'paw') {
      var sp = [clean(pet.species, 16), clean(pet.breed, 24)].filter(Boolean); /* the pet page's order: Species, then Breed */
      m.species = sp.join(' · ');
      m.places = countPlaces(pet.places);
    }
    return m;
  }

  /* ---------- layout: one system for the three formats ---------- */
  /* Wordmark top left, a stack of rows anchored above the footer, the postmark in the free corner.
     Tall formats keep clear of the top and bottom bands the Story interface covers. */
  var MIN_TYPE = 24;      /* nothing smaller than this on the image */
  var STAMP_MIN = 400;    /* the stamp's smallest lettering is 12/200 of its diameter: 400 px keeps it at 24 px */

  function layout(formatKey, design) {
    var F = FORMATS[formatKey] || FORMATS.square, W = F.w, H = F.h, ar = H / W;
    var tall = ar > 1.5, wide = ar < 0.7, lead = design === 'paw';
    var m = wide ? 56 : Math.round(Math.min(W, H) * 0.075);
    var s = tall ? 1.12 : wide ? 0.8 : 1;
    function z(base) { return Math.max(MIN_TYPE, Math.round(base * s)); }
    var safeTop = tall ? 250 : m, safeBottom = tall ? 270 : m;
    var sizes = {
      wordmark: z(40), label: z(26), number: z(84), numberSmall: z(36), name: z(104), nameMin: z(54),
      species: z(38), code: z(46), word: z(56), coords: z(26), footer: z(26), url: z(32)
    };
    var gaps = { label: Math.round(22 * s), number: Math.round(20 * s), name: Math.round(26 * s), species: Math.round(26 * s), place: Math.round(20 * s) };
    var footerBase = H - safeBottom;
    var ruleY = footerBase - sizes.url - Math.round(26 * s);
    var bodyBottom = ruleY - Math.round(38 * s);
    var d = wide ? (lead ? 430 : 400) : tall ? (lead ? 620 : 520) : (lead ? 450 : 400);
    var gap = Math.round(48 * s);
    return {
      format: formatKey, design: design, W: W, H: H, tall: tall, wide: wide, lead: lead,
      m: m, s: s, safeTop: safeTop, safeBottom: safeBottom, sizes: sizes, gaps: gaps,
      footerBase: footerBase, ruleY: ruleY, bodyBottom: bodyBottom,
      bodyX: m, bodyMaxW: wide ? W - 2 * m - d - gap : W - 2 * m,
      wordmarkBase: safeTop + Math.round(sizes.wordmark * 0.78),
      stamp: { d: d, min: STAMP_MIN, cx: W - m - d / 2, cy: wide ? Math.round((m + ruleY) / 2) : safeTop + d / 2, rot: -7 * Math.PI / 180 },
      gap: gap
    };
  }

  function fontSpec(kind, weight, size, italic) {
    return (italic ? 'italic ' : '') + weight + ' ' + size + 'px ' + FONT[kind];
  }

  /* Break a name into two lines at the space or hyphen nearest the middle. */
  function splitName(name) {
    var best = -1, mid = name.length / 2, i;
    for (i = 1; i < name.length - 1; i++) {
      var ch = name.charAt(i);
      if (ch === ' ' || ch === '-') { if (best < 0 || Math.abs(i - mid) < Math.abs(best - mid)) best = i; }
    }
    if (best < 0) return null;
    return name.charAt(best) === ' ' ? [name.slice(0, best), name.slice(best + 1)] : [name.slice(0, best + 1), name.slice(best + 1)];
  }

  function ellipsize(text, font, maxW, measure) {
    if (measure(text, font, 0) <= maxW) return text;
    var t = text;
    while (t.length > 1 && measure(t + '…', font, 0) > maxW) t = t.slice(0, -1);
    return t.replace(/[\s\-]+$/, '') + '…';
  }

  /* One line if it fits at a size worth reading, else two lines, else smaller, and only past that an ellipsis.
     Names up to 28 characters, with or without a space, always fit whole. */
  function fitName(name, maxW, maxSize, minSize, measure) {
    var oneFloor = Math.max(minSize, Math.round(maxSize * 0.7));
    var hardMin = Math.max(MIN_TYPE + 12, Math.round(minSize * 0.65));
    var parts = splitName(name);
    function one(from, to) {
      for (var size = from; size >= to; size -= 2) if (measure(name, fontSpec('head', 800, size), 0) <= maxW) return { lines: [name], size: size };
      return null;
    }
    function two(from, to) {
      if (!parts) return null;
      for (var size = from; size >= to; size -= 2) {
        var f = fontSpec('head', 800, size);
        if (measure(parts[0], f, 0) <= maxW && measure(parts[1], f, 0) <= maxW) return { lines: parts, size: size };
      }
      return null;
    }
    var fit = one(maxSize, oneFloor) || two(maxSize, minSize) || one(oneFloor, minSize) || two(minSize, hardMin) || one(minSize, hardMin);
    if (fit) return fit;
    var f = fontSpec('head', 800, hardMin);
    if (parts) return { lines: [ellipsize(parts[0], f, maxW, measure), ellipsize(parts[1], f, maxW, measure)], size: hardMin };
    return { lines: [ellipsize(name, f, maxW, measure)], size: hardMin };
  }

  /* Rows of the body stack, top to bottom, each a list of runs on one baseline. measure(text, font, tracking) -> px. */
  function buildRows(model, L, measure, nameScale) {
    var S = L.sizes, rows = [], k = nameScale || 1;
    var maxW = L.bodyMaxW;
    function tr(size, em) { return Math.round(size * em * 10) / 10; }

    rows.push({ id: 'label', h: S.label, gap: L.gaps.label, runs: [
      { text: model.design === 'paw' ? 'FOUNDING MEMBER · PET' : 'FOUNDING MEMBER', font: fontSpec('mono', 600, S.label), size: S.label, tracking: tr(S.label, 0.2), color: 'accent' }
    ] });

    /* The name is fitted first: it is the largest thing on the badge, and the number is sized below it. */
    var fit = model.name ? fitName(model.name, maxW, Math.max(S.nameMin, Math.round(S.name * k)), Math.min(S.nameMin, Math.max(MIN_TYPE, Math.round(S.nameMin * k))), measure) : null;

    if (model.design !== 'paw' && model.number) {
      var nz = fit ? Math.min(S.number, Math.max(Math.round(fit.size * 0.8), Math.min(48, fit.size - 8))) : S.number; /* below the name, never a whisper */
      var ns = Math.max(MIN_TYPE, Math.min(S.numberSmall, Math.round(nz * 0.43)));
      var nr = [
        { text: 'No.', font: fontSpec('mono', 500, ns), size: ns, tracking: 0, color: 'muted', after: Math.round(nz * 0.18) },
        { text: model.number, font: fontSpec('mono', 600, nz), size: nz, tracking: tr(nz, 0.02), color: 'fg' }
      ];
      if (model.cap) {
        nr[1].after = Math.round(nz * 0.22);
        nr.push({ text: 'of ' + model.cap, font: fontSpec('mono', 500, ns), size: ns, tracking: 0, color: 'muted' });
      }
      rows.push({ id: 'number', h: Math.round(nz * 0.74), gap: L.gaps.number + Math.round(nz * 0.12), runs: nr });
    }

    if (fit) {
      fit.lines.forEach(function (line, i) {
        rows.push({ id: 'name' + (i + 1), h: Math.round(fit.size * 0.86), gap: i < fit.lines.length - 1 ? Math.round(fit.size * 0.2) : (model.species ? L.gaps.species : L.gaps.name) + Math.round(fit.size * 0.12),
          runs: [{ text: line, font: fontSpec('head', 800, fit.size), size: fit.size, tracking: 0, color: 'fg' }] });
      });
    }

    if (model.species) {
      rows.push({ id: 'species', h: Math.round(S.species * 0.74), gap: L.gaps.name, runs: [
        { text: model.species, font: fontSpec('text', 500, S.species), size: S.species, tracking: 0, color: 'fg' }
      ] });
    }

    var word = model.design === 'paw' ? (model.places ? placesPhrase(model.places) : '') : model.word;
    if (model.city || (model.design === 'paw' && word)) {
      var pr = [];
      if (model.city) {
        pr.push({ text: model.city.code, font: fontSpec('mono', 600, S.code), size: S.code, tracking: tr(S.code, 0.08), color: 'fg', after: Math.round(S.code * 0.36) });
        if (word) pr.push({ arrow: true, w: Math.round(S.code * 1.15), size: S.code, color: 'accent', after: Math.round(S.code * 0.4) });
      }
      if (word && model.design === 'paw') {
        /* the count is a number, so it is set in Mono like every other number; the word stays in the italic */
        pr.push({ text: String(model.places), font: fontSpec('mono', 600, S.code), size: S.code, tracking: tr(S.code, 0.04), color: 'fg', after: Math.round(S.code * 0.3) });
        pr.push({ text: model.places === 1 ? 'country' : 'countries', font: fontSpec('head', 800, S.word, true), size: S.word, tracking: 0, color: 'fg' });
      } else if (word) pr.push({ text: word, font: fontSpec('head', 800, S.word, true), size: S.word, tracking: 0, color: 'fg' });
      rows.push({ id: 'place', h: Math.round(S.word * 0.74), gap: L.gaps.place + Math.round(S.word * 0.14), runs: pr });
    }

    if (model.city) {
      var ct = tr(S.coords, 0.12), cf = fontSpec('mono', 500, S.coords);
      var full = model.city.coords + ' · ' + model.city.name.toUpperCase();
      var text = measure(full, cf, ct) <= maxW ? full : model.city.coords;
      rows.push({ id: 'coords', h: Math.round(S.coords * 0.74), gap: 0, runs: [{ text: text, font: cf, size: S.coords, tracking: ct, color: 'muted' }] });
    }

    /* widths, then positions from the bottom up */
    rows.forEach(function (r) {
      var x = L.bodyX;
      r.runs.forEach(function (run) {
        run.w = run.arrow ? run.w : Math.ceil(measure(run.text, run.font, run.tracking));
        run.x = x; x += run.w + (run.after || 0);
      });
      r.x = L.bodyX; r.w = x - L.bodyX - (r.runs[r.runs.length - 1].after || 0);
    });
    if (rows.length) rows[rows.length - 1].gap = 0;
    var y = L.bodyBottom, i;
    for (i = rows.length - 1; i >= 0; i--) {
      rows[i].base = y; rows[i].top = y - rows[i].h;
      y = rows[i].top - (i > 0 ? rows[i - 1].gap : 0);
    }
    return rows;
  }

  function rowsTop(rows, L) { return rows.length ? rows[0].top : L.bodyBottom; }

  /* Does a row's box touch the stamp's circle (with breathing room)? */
  function hitsStamp(row, st, pad) {
    var r = st.d / 2 + pad;
    var nx = Math.max(row.x, Math.min(st.cx, row.x + row.w));
    var ny = Math.max(row.top, Math.min(st.cy, row.base));
    var dx = st.cx - nx, dy = st.cy - ny;
    return dx * dx + dy * dy < r * r;
  }

  /* Full composition: rows placed, stamp placed, nothing overlapping. Pure given measure(). */
  function compose(model, measure) {
    var L = layout(model.format, model.design), rows, k = 1, guard = 0, pad = Math.round(20 * L.s);
    var st = L.stamp;
    for (;;) {
      rows = buildRows(model, L, measure, k);
      var top = rowsTop(rows, L);
      if (L.tall) {
        /* the stamp takes the open field between the wordmark and the stack */
        var fieldTop = L.wordmarkBase + Math.round(70 * L.s), fieldBottom = top - Math.round(70 * L.s);
        st.d = Math.max(st.min, Math.min(st.d, fieldBottom - fieldTop));
        st.cx = L.W - L.m - st.d / 2;
        st.cy = Math.round(fieldTop + (fieldBottom - fieldTop) * 0.46);
        if (st.cy - st.d / 2 < fieldTop) st.cy = fieldTop + st.d / 2;
      } else if (!L.wide) {
        st.cx = L.W - L.m - st.d / 2; st.cy = L.safeTop + st.d / 2;
      }
      var clash = rows.some(function (r) { return hitsStamp(r, st, pad); }) || top < L.wordmarkBase + pad;
      if (!clash || guard++ > 14) break;
      if (!L.tall && !L.wide && st.d > st.min) st.d = Math.max(st.min, st.d - 25);
      else k *= 0.92;
    }
    var S = L.sizes;
    var footer = {
      left: model.joined ? 'JOINED ' + model.joined.toUpperCase() : '',
      leftFont: fontSpec('mono', 500, S.footer), leftSize: S.footer, leftTracking: Math.round(S.footer * 0.12 * 10) / 10,
      right: 'thatlayover.life', rightFont: fontSpec('text', 600, S.url), rightSize: S.url
    };
    if (footer.left) {
      var need = measure(footer.left, footer.leftFont, footer.leftTracking) + measure(footer.right, footer.rightFont, 0) + L.gap;
      if (need > L.W - 2 * L.m) footer.left = footer.left.replace(/^JOINED /, '');
    }
    return { L: L, rows: rows, stamp: st, footer: footer, nameScale: k };
  }

  /* What the postmark says, by design. Arc lettering is fixed; the center comes from the record. */
  function stampContent(model) {
    if (model.design === 'paw') {
      return { top: 'PAW PASSPORT', bottom: 'THAT LAYOVER LIFE', small: 'FOUNDING', big: model.number ? 'No. ' + model.number : 'PET', date: model.stampDate };
    }
    /* Center: the home base code; with no location, the number; with neither, the initials alone (never FOUNDING a third time). */
    if (model.city) return { top: 'THAT LAYOVER LIFE', bottom: 'FOUNDING MEMBER', small: 'TLL', big: model.city.code, date: model.stampDate };
    if (model.number) return { top: 'THAT LAYOVER LIFE', bottom: 'FOUNDING MEMBER', small: 'TLL', big: 'No. ' + model.number, date: model.stampDate };
    return { top: 'THAT LAYOVER LIFE', bottom: 'FOUNDING MEMBER', small: '', big: 'TLL', date: model.stampDate };
  }

  function fileName(data) {
    var m = normalize(data);
    return 'tll-founding-' + (m.design === 'paw' ? 'paw-' : '') + (m.number || 'badge') + '-' + FORMATS[m.format].file + '.png';
  }

  /* Alt text for the finished image: everything that is drawn on it, in reading order. */
  function describe(data) {
    var m = normalize(data), out = [];
    var paw = m.design === 'paw';
    out.push((paw ? 'Paw Passport stamp' : 'Founding member badge') + ' from That Layover Life' + (m.theme === 'light' ? ', dark type on paper' : ', light type on midnight') + '.');
    var who = m.name || (paw ? 'A pet' : 'No name shown');
    if (paw) out.push(who + ', founding member, pet' + (m.species ? ', ' + m.species.replace(' · ', ', ') : '') + '.');
    else out.push(who + (m.number ? ', founding member No. ' + m.number + (m.cap ? ' of ' + m.cap : '') : ', founding member') + '.');
    var word = paw ? (m.places ? placesPhrase(m.places) : '') : m.word;
    if (m.city) out.push(m.city.code + (word ? ' to ' + word : '') + ', ' + m.city.name + ', ' + m.city.coords + '.');
    else if (paw && word) out.push(word.charAt(0).toUpperCase() + word.slice(1) + '.');
    var st = stampContent(m);
    out.push('Ink postmark reading ' + [st.top, st.small, st.big, st.date, st.bottom].filter(Boolean).join(', ') + '.');
    if (m.joined) out.push('Joined ' + m.joined + '.');
    out.push('thatlayover.life');
    return out.join(' ');
  }

  /* ---------- canvas (browser only) ---------- */

  function measurer(ctx) {
    return function (text, font, tracking) {
      ctx.font = font;
      var w = ctx.measureText(text).width;
      return tracking ? w + tracking * text.length : w;
    };
  }

  /* Tracked text drawn glyph by glyph, so it does not depend on ctx.letterSpacing support. */
  function drawRun(ctx, text, x, y, font, color, tracking) {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    if (!tracking) { ctx.fillText(text, x, y); return; }
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      ctx.fillText(ch, x, y);
      x += ctx.measureText(ch).width + tracking;
    }
  }

  /* The arrow is drawn, not typed: the web font subsets do not all carry U+2192. */
  function drawArrow(ctx, x, base, w, size, color) {
    var y = base - size * 0.34, t = Math.max(3, size * 0.075), h = size * 0.2;
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = t; ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w - t * 0.6, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w - h - t * 0.5, y - h); ctx.lineTo(x + w - t * 0.5, y); ctx.lineTo(x + w - h - t * 0.5, y + h); ctx.stroke();
    ctx.restore();
  }

  function rng(seed) { /* mulberry32: the same badge always gets the same ink */
    var a = seed >>> 0;
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  function arcText(c, text, radius, size, tracking, top) {
    c.font = fontSpec('mono', 600, size); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    var widths = [], total = 0, i;
    for (i = 0; i < text.length; i++) { var w = c.measureText(text.charAt(i)).width + tracking; widths.push(w); total += w; }
    total -= tracking;
    var a = top ? -Math.PI / 2 - total / radius / 2 : Math.PI / 2 + total / radius / 2;
    for (i = 0; i < text.length; i++) {
      var cw = widths[i] - tracking, mid = (cw / 2) / radius;
      a += top ? mid : -mid;
      c.save();
      c.translate(Math.cos(a) * radius, Math.sin(a) * radius);
      c.rotate(top ? a + Math.PI / 2 : a - Math.PI / 2);
      c.fillText(text.charAt(i), 0, 0);
      c.restore();
      a += top ? (cw / 2 + tracking) / radius : -(cw / 2 + tracking) / radius;
    }
  }

  function centerTracked(c, text, y, size, weight, tracking) {
    c.font = fontSpec('mono', weight, size); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    var w = 0, i;
    for (i = 0; i < text.length; i++) w += c.measureText(text.charAt(i)).width + tracking;
    w -= tracking;
    var x = -w / 2;
    for (i = 0; i < text.length; i++) { c.fillText(text.charAt(i), x, y); x += c.measureText(text.charAt(i)).width + tracking; }
    return w;
  }

  /* The TLL ink postmark, after the stamp on the magazine cover: three rings (r 94, 86, 58 of 100),
     lettering on two arcs, a small line, a large line and a date in the center, pressed slightly off square.
     Lettering is a little larger than on the site so nothing falls under 24 px at 400 px across. */
  function drawStamp(ctx, st, content, T, seed, doc) {
    var d = st.d, u = d / 200, padPx = Math.ceil(6 * u);
    var off = doc.createElement('canvas');
    off.width = off.height = Math.ceil(d) + padPx * 2;
    var c = off.getContext('2d');
    c.translate(off.width / 2, off.height / 2);
    c.strokeStyle = T.ink; c.fillStyle = T.ink;
    [[94, 3], [86, 1.2], [58, 1.2]].forEach(function (r) { c.lineWidth = r[1] * u; c.beginPath(); c.arc(0, 0, r[0] * u, 0, Math.PI * 2); c.stroke(); });
    arcText(c, content.top, 67.5 * u, 13 * u, 3 * u, true);
    arcText(c, content.bottom, 77 * u, 12 * u, 1.8 * u, false);
    var big = content.big || '', bigSize = big.length <= 3 ? 30 : big.length <= 5 ? 22 : big.length <= 7 ? 17.5 : 15;
    if (content.small) centerTracked(c, content.small, -17 * u, 12 * u, 600, 3 * u);
    centerTracked(c, big, (bigSize > 24 ? 10 : 7) * u, bigSize * u, 600, (big.length <= 3 ? 2 : 0.6) * u);
    if (content.date) centerTracked(c, content.date, 28 * u, 12 * u, 500, 1.2 * u);
    /* dry ink: small gaps knocked out of the print */
    var rnd = rng(seed || 7), n = Math.round(d * d / 420), i;
    c.globalCompositeOperation = 'destination-out';
    for (i = 0; i < n; i++) {
      var ang = rnd() * Math.PI * 2, rad = Math.sqrt(rnd()) * 100 * u;
      c.globalAlpha = 0.35 + rnd() * 0.65;
      c.beginPath(); c.arc(Math.cos(ang) * rad, Math.sin(ang) * rad, (0.25 + rnd() * rnd() * 1.1) * u, 0, Math.PI * 2); c.fill();
    }
    ctx.save();
    ctx.translate(st.cx, st.cy); ctx.rotate(st.rot); ctx.globalAlpha = T.inkAlpha;
    ctx.drawImage(off, -off.width / 2, -off.height / 2);
    ctx.restore();
  }

  /* Draw onto a canvas at the format's own pixel size. Synchronous; call loadFonts() first for the brand type. */
  function draw(canvas, data) {
    var model = normalize(data), F = FORMATS[model.format], T = THEMES[model.theme];
    canvas.width = F.w; canvas.height = F.h;
    var ctx = canvas.getContext('2d');
    var doc = canvas.ownerDocument || document;
    var C = compose(model, measurer(ctx)), L = C.L, S = L.sizes;
    ctx.fillStyle = T.bg; ctx.fillRect(0, 0, F.w, F.h);

    /* wordmark: light lowercase "that", heavy uppercase the rest */
    var thatFont = fontSpec('text', 300, S.wordmark), restFont = fontSpec('head', 800, S.wordmark);
    drawRun(ctx, 'that', L.m, L.wordmarkBase, thatFont, T.fg, 0);
    ctx.font = thatFont;
    var tw = ctx.measureText('that').width;
    drawRun(ctx, 'LAYOVER LIFE.', L.m + tw + S.wordmark * 0.26, L.wordmarkBase, restFont, T.fg, S.wordmark * 0.01);

    C.rows.forEach(function (row) {
      row.runs.forEach(function (run) {
        if (run.arrow) drawArrow(ctx, run.x, row.base, run.w, run.size, T[run.color]);
        else drawRun(ctx, run.text, run.x, row.base, run.font, T[run.color], run.tracking);
      });
    });

    var seed = (parseInt(model.number, 10) || 1) * 7919 + (model.design === 'paw' ? 13 : 0);
    drawStamp(ctx, C.stamp, stampContent(model), T, seed, doc);

    /* footer: one hairline, the date on the left, the address on the right */
    ctx.fillStyle = T.hair; ctx.fillRect(L.m, L.ruleY, F.w - 2 * L.m, 2);
    if (C.footer.left) drawRun(ctx, C.footer.left, L.m, L.footerBase, C.footer.leftFont, T.muted, C.footer.leftTracking);
    ctx.font = C.footer.rightFont;
    var uw = ctx.measureText(C.footer.right).width;
    drawRun(ctx, C.footer.right, F.w - L.m - uw, L.footerBase, C.footer.rightFont, T.fg, 0);
    return { width: F.w, height: F.h, model: model, composition: C };
  }

  /* Ask the browser for the brand fonts with the actual words, so the right subsets arrive.
     Resolves either way: a missing font falls back to the next family in the stack. */
  function loadFonts(data, timeoutMs, doc) {
    doc = doc || (typeof document !== 'undefined' ? document : null);
    if (!doc || !doc.fonts || !doc.fonts.load) return Promise.resolve({ ok: false, missing: ['FontFaceSet not available'] });
    var m = normalize(data);
    var sample = [m.name, m.species, m.word, m.city ? m.city.name + m.city.code + m.city.coords : '', 'that LAYOVER LIFE. FOUNDING MEMBER PET PAW PASSPORT No. of 0123456789 countries JOINED thatlayover.life ·°'].join(' ');
    var wants = [
      ['Playfair Display', '800 64px "Playfair Display"'],
      ['Playfair Display italic', 'italic 800 64px "Playfair Display"'],
      ['IBM Plex Sans Condensed 300', '300 40px "IBM Plex Sans Condensed"'],
      ['IBM Plex Sans Condensed 500', '500 40px "IBM Plex Sans Condensed"'],
      ['IBM Plex Sans Condensed 600', '600 40px "IBM Plex Sans Condensed"'],
      ['JetBrains Mono 500', '500 40px "JetBrains Mono"'],
      ['JetBrains Mono 600', '600 40px "JetBrains Mono"']
    ];
    var timer = new Promise(function (res) { setTimeout(function () { res('timeout'); }, timeoutMs || 4000); });
    var all = Promise.all(wants.map(function (w) {
      return doc.fonts.load(w[1], sample).then(function (faces) { return faces && faces.length ? null : w[0]; }, function () { return w[0]; });
    }));
    return Promise.race([all, timer]).then(function (r) {
      if (r === 'timeout') return { ok: false, missing: ['timed out'] };
      var missing = r.filter(Boolean);
      return { ok: missing.length === 0, missing: missing };
    });
  }

  function toBlob(canvas) {
    return new Promise(function (resolve, reject) {
      if (canvas.toBlob) canvas.toBlob(function (b) { b ? resolve(b) : reject(new Error('The image could not be made.')); }, 'image/png');
      else reject(new Error('This browser cannot export a canvas.'));
    });
  }

  /* data -> PNG Blob at full size. */
  function render(data, opts) {
    opts = opts || {};
    var doc = opts.document || document;
    return loadFonts(data, opts.fontTimeout, doc).then(function (fonts) {
      var canvas = opts.canvas || doc.createElement('canvas');
      var info = draw(canvas, data);
      return toBlob(canvas).then(function (blob) {
        return { blob: blob, width: info.width, height: info.height, fonts: fonts, fileName: fileName(data), alt: describe(data) };
      });
    });
  }

  return {
    FORMATS: FORMATS, THEMES: THEMES, CITIES: CITIES, FONT: FONT, MIN_TYPE: MIN_TYPE, STAMP_MIN: STAMP_MIN,
    formatNumber: formatNumber, roundCoord: roundCoord, normalizeLon: normalizeLon, formatCoords: formatCoords,
    formatDate: formatDate, formatStampDate: formatStampDate, countPlaces: countPlaces, placesPhrase: placesPhrase,
    displayName: displayName, normalize: normalize, layout: layout, splitName: splitName, fitName: fitName,
    buildRows: buildRows, compose: compose, hitsStamp: hitsStamp, stampContent: stampContent, fileName: fileName, describe: describe,
    loadFonts: loadFonts, draw: draw, render: render
  };
});
