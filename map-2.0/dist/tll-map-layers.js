/* The Map 2.0 for thatlayover.life. Plain JavaScript, no build step.
   Built to the Claude Design file "TLL Map Layers" (7 Oct 2026): dark canvas, depth fills, one shape per shelf,
   a drawer switcher with every list, the receipts (one card per list), sets of seven, the lines strip, framed embeds.
   Mounts into #tll-map-layers. Reads collections.json, counts.json and one data file per list from data-tll-data.
   Every number on the page is counted from those files. Nothing here touches tllStates, Memberstack, the logbook
   or the share bundle. */
(function () {
  'use strict';
  if (window.__tllMapLayers) return; window.__tllMapLayers = 1;
  var root = document.getElementById('tll-map-layers'); if (!root) return;

  var VER = root.getAttribute('data-tll-version') || 'main';
  var CDN = 'https://cdn.jsdelivr.net/gh/carleton71192/thatlayoverlife@' + VER + '/map-2.0/';
  var DATA = (root.getAttribute('data-tll-data') || (CDN + 'data/')).replace(/\/?$/, '/');
  var CONFIG = root.getAttribute('data-tll-config') || (DATA.replace(/data\/$/, '') + 'collections.json');
  var ATLAS = root.getAttribute('data-tll-atlas') || 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';
  var STYLE = root.hasAttribute('data-tll-style') ? root.getAttribute('data-tll-style') : 'https://tiles.openfreemap.org/styles/dark';
  var LIB = root.getAttribute('data-tll-lib') || 'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl';
  var TOPO = root.getAttribute('data-tll-topojson') || 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js';
  var NOT_YET = root.getAttribute('data-tll-not-yet') === 'full' ? '#E9E1D3' : '#2E2D33'; // design prop "notYet": Cream dimmed (default) or Cream full
  var STREET_ZOOM = 5;

  // Tokens (design 1g)
  var C = { ink: '#0A0B14', card: '#12141F', hair: '#232744', cream: '#F7F1E8', rose: '#F0507A', roseDeep: '#9C3A5C', roseText: '#FF7093', teal: '#00C9C8',
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
  var map, topojson, countryRows = {}, loggedIso = {}, loaded = {}, active = {}, popup, tip, status, heatKey, extremesData;
  var bar, onChips, drawer, drawerBtn, listBox, listUl, listFilter, secCards, secRules, secSets, secStrip, secFrames;

  root.classList.add('tllm'); root.setAttribute('data-tll-map-layers', '2.0');

  Promise.all([getJSON(CONFIG), getJSON(DATA + 'counts.json').catch(function () { return {}; })])
    .then(function (r) {
      cfg = r[0]; counts = r[1].counts || {}; vars = r[1].vars || {};
      (cfg.shelves || []).forEach(function (s) { shelves[s.id] = s; });
      colls = cfg.collections || []; colls.forEach(function (c) { byId[c.id] = c; });
      srcs = cfg.sources || {}; empty = cfg.empty_copy || {};
      buildUI();
      css(LIB + '.css');
      return Promise.all([script(LIB + '.js'), script(TOPO)]);
    })
    .then(function () { topojson = window.topojson; return initMap(); })
    .then(function () { colls.forEach(function (c) { if (c.default_on) toggle(c.id, true); }); })
    .catch(function (e) { fail('The map could not start: ' + e.message); });

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
    if (c.computed === 'crossed') return (extremesData ? extremesData.lines_crossed_count : '·') + '/' + (c.denominator || 7);
    if (c.computed === 'extremes') return '4';
    if (c.type === 'heat') return counts[c.id] ? fmt(counts[c.id]) + ' hex' : 'hex';
    var n = counts[c.id]; if (n == null) return '';
    return c.denominator ? fmt(n) + '/' + fmt(c.denominator) : fmt(n);
  }
  function isEmpty(c) { if (c.computed === 'placeholder') return true; if (c.computed === 'extremes' || c.computed === 'crossed') return false; return !counts[c.id]; }

  // ---------- UI ----------
  function buildUI() {
    // Switcher bar: LAYERS · N ON · M LISTS, the on-chips, the drawer toggle
    bar = el('div', 'tllm-bar');
    var k = el('div', 'tllm-bar-k'); k.id = 'tllm-bar-k'; bar.appendChild(k);
    onChips = el('div', 'tllm-onchips'); onChips.setAttribute('aria-label', 'Lists switched on'); bar.appendChild(onChips);
    drawerBtn = el('button', 'tllm-bar-btn'); drawerBtn.type = 'button'; drawerBtn.setAttribute('aria-expanded', 'false'); drawerBtn.setAttribute('aria-controls', 'tllm-drawer');
    drawerBtn.innerHTML = 'Layers <i aria-hidden="true"></i>'; drawerBtn.addEventListener('click', function () { openDrawer(drawerBtn.getAttribute('aria-expanded') !== 'true'); });
    bar.appendChild(drawerBtn);
    bar.appendChild(el('p', 'tllm-bar-hint', 'Stack as many as you like.'));
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

    // Canvas
    var stage = el('div', 'tllm-stage'); stage.id = 'tllm-stage';
    tip = el('div', 'tllm-tip'); tip.setAttribute('aria-hidden', 'true'); stage.appendChild(tip);
    status = el('div', 'tllm-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); stage.appendChild(status);
    heatKey = el('div', 'tllm-heatkey'); heatKey.hidden = true; heatKey.innerHTML = '<span>fewer</span><i aria-hidden="true"></i><span>more</span>'; heatKey.setAttribute('aria-label', 'Heat key: fewer to more. Rounded on purpose. Home is not on here.'); stage.appendChild(heatKey);
    root.appendChild(stage);

    // Sections under the map
    secCards = section('THE RECEIPTS · ONE ROW PER LIST', 'Counted by hand, <em>list by list.</em>', null);
    secRules = section('MANY WAYS TO COUNT', 'Same trips. Four rulebooks. <em>Four answers.</em>', 'The trips did not change. The math did.');
    secSets = section('SETS OF SEVEN', 'Seven slots, <em>one row each.</em>', 'Tap a stamp for the receipt.');
    secStrip = section('LINES AND EXTREMES', 'How far, <em>and across what.</em>', 'Computed from pin coordinates, so it updates itself.');
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
    b.setAttribute('aria-label', c.name + (n ? ', ' + n.replace('/', ' of ') : '') + (isEmpty(c) ? ', nothing logged yet' : '') + ', ' + c.verb);
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
    if (!on.length) say(empty.map_all_off || 'Every layer is off.');
  }
  function say(t) { status.textContent = t || ''; status.dataset.on = t ? '1' : '0'; }

  // ---------- map ----------
  function baseStyle() { return { version: 8, sources: {}, layers: [] }; }
  function fitWorld(animate) { map.fitBounds([[-168, -56], [179, 72]], { padding: { top: 16, right: 16, bottom: 36, left: 16 }, animate: !!animate && !reduce, duration: 400 }); }
  function initMap() {
    return new Promise(function (ok, no) {
      var maplibregl = window.maplibregl; if (!maplibregl) return no(new Error('MapLibre did not load'));
      map = new maplibregl.Map({ container: 'tllm-stage', style: STYLE || baseStyle(), center: [10, 20], zoom: 1.2, minZoom: 0.8, maxZoom: 15, attributionControl: false, renderWorldCopies: true, fadeDuration: reduce ? 0 : 180 });
      root.tllmMap = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'Shapes: Natural Earth via world-atlas' }), 'bottom-right');
      map.getCanvas().setAttribute('aria-label', 'World map. Use the layer buttons above, or the pin list below, to browse.');
      map.on('error', function (e) { window.__tllLastErr = e && e.error && e.error.message; });
      map.on('styleimagemissing', function (e) { var m = /^tllm-(\w+)-([0-9a-fA-F]{6})(-nd)?$/.exec(e.id); if (m) addIcon(e.id, m[1], '#' + m[2], !!m[3]); });
      map.once('style.load', function () {
        try { demoteBasemap(); } catch (e) {}
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
    fc.features = fc.features.filter(function (f) { return !(f.properties && f.properties.name === 'Antarctica'); });
    fc.features.forEach(function (f) {
      unwrap(f.geometry);
      var id = f.id != null ? String(f.id).padStart(3, '0') : ''; var nm = f.properties && f.properties.name || '';
      if (!id && nm === 'Kosovo') id = 'XK';
      var a2 = loggedIso[id] || (id === 'XK' ? 'XK' : ''); var row = countryRows[a2];
      f.properties = f.properties || {}; f.properties.iso = id; f.properties.a2 = a2; f.properties.logged = !!row;
      f.properties.depth = row ? depthOf(row) : ''; f.properties.proposed = !!(row && !row.depth && row.depth_proposed);
    });
    hatchImage();
    var before = firstBasemapLayer();
    map.addLayer({ id: 'tllm-sphere', type: 'background', paint: { 'background-color': C.sphere } }, before);
    map.addSource('tllm-grat', { type: 'geojson', data: graticule() });
    map.addLayer({ id: 'tllm-grat', type: 'line', source: 'tllm-grat', paint: { 'line-color': C.grat, 'line-width': 0.6 } }, before);
    map.addSource('tllm-countries', { type: 'geojson', data: fc, promoteId: 'iso' });
    // Rule 1, order: heat, then fills, then Magnus outlines, then pins. Heat layers insert before 'tllm-land'.
    map.addLayer({ id: 'tllm-land', type: 'fill', source: 'tllm-countries', paint: { 'fill-color': landFill(true), 'fill-opacity': ['interpolate', ['linear'], ['zoom'], STREET_ZOOM - 1, 1, STREET_ZOOM + 1, 0.45] } }, before);
    map.addLayer({ id: 'tllm-land-hatch', type: 'fill', source: 'tllm-countries', filter: ['==', ['get', 'depth'], 'Layover only'], paint: { 'fill-pattern': 'tllm-hatch', 'fill-opacity': ['interpolate', ['linear'], ['zoom'], STREET_ZOOM - 1, 1, STREET_ZOOM + 1, 0.45] } }, before);
    map.addLayer({ id: 'tllm-land-line', type: 'line', source: 'tllm-countries', paint: {
      'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], C.cream, ['==', ['get', 'depth'], 'Lived'], C.cream, C.ink],
      'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 1.4, ['==', ['get', 'depth'], 'Lived'], 1.1, 0.5] } }, before);
    map.addLayer({ id: 'tllm-magnus-outline', type: 'line', source: 'tllm-countries', filter: ['in', ['get', 'a2'], ['literal', []]], layout: { visibility: 'none' }, paint: { 'line-color': C.teal, 'line-width': 1.4, 'line-dasharray': [3, 2] } }, before);

    var hovered = null;
    map.on('mousemove', 'tllm-land', function (e) {
      var f = e.features && e.features[0]; if (!f || !active.countries) return;
      if (hovered !== null && hovered !== f.id) map.setFeatureState({ source: 'tllm-countries', id: hovered }, { hover: false });
      hovered = f.id; map.setFeatureState({ source: 'tllm-countries', id: hovered }, { hover: true });
      map.getCanvas().style.cursor = 'pointer';
      var row = countryRows[f.properties.a2];
      tip.innerHTML = '<b>' + esc(row ? row.name : f.properties.name) + '</b><span>' + esc(f.properties.logged ? f.properties.depth + (f.properties.proposed ? ', proposed' : '') : 'Not yet') + '</span>';
      tip.style.transform = 'translate(' + (e.point.x + 14) + 'px,' + (e.point.y - 8) + 'px)'; tip.style.opacity = '1';
    });
    map.on('mouseleave', 'tllm-land', function () { if (hovered !== null) map.setFeatureState({ source: 'tllm-countries', id: hovered }, { hover: false }); hovered = null; tip.style.opacity = '0'; map.getCanvas().style.cursor = ''; });
    map.on('click', 'tllm-land', function (e) {
      if (!active.countries) return; if (e.originalEvent && e.originalEvent._tllmPin) return;
      var f = e.features && e.features[0]; if (!f) return; var row = countryRows[f.properties.a2];
      var d = f.properties.logged ? f.properties.depth : 'Not yet';
      var note = !f.properties.logged ? 'Not yet. The cream.' : d === 'Lived' ? 'Lived here. The deepest of the three depths.' : d === 'Layover only' ? (f.properties.proposed ? 'Airport pins only in Places Been. Proposed as layover only, Nancy to confirm.' : 'Never left the terminal. Counted, on a separate shelf.') : (f.properties.proposed ? 'City pins in Places Been. Proposed as stayed, Nancy to confirm.' : 'Left the airport and slept at least one night.');
      openCard({ _c: 'countries', name: row ? row.name : f.properties.name, country: f.properties.a2, verb: d, year: row && row.year, note: note, link: row && row.link, story: row && row.story, _country: true }, e.lngLat.toArray());
    });
    antarcticaLabel(rows); bindCounters(rows.length); buildCards(rows); buildRules();
    getJSON(DATA + 'extremes.json').then(function (x) { extremesData = x; buildStrip(x); renderBar(); refreshDrawerCounts(); }).catch(function () { secStrip.remove(); });
  }
  function landFill(on) {
    if (!on) return C.landOff;
    return ['case', ['!', ['boolean', ['get', 'logged'], false]], C.notYet, ['==', ['get', 'depth'], 'Lived'], C.rose, ['==', ['get', 'depth'], 'Layover only'], C.hatchBg, C.roseDeep];
  }
  function antarcticaLabel(rows) {
    var aq = rows.filter(function (r) { return r.country === 'AQ'; })[0]; if (!aq) return;
    var d = el('div', 'tllm-aq'); d.setAttribute('role', 'note'); d.innerHTML = '<b>Antarctica</b><span>' + esc(depthOf(aq) || 'logged') + '</span>';
    new window.maplibregl.Marker({ element: d, anchor: 'top' }).setLngLat([0, -66]).addTo(map);
  }
  function bindCounters(n) {
    var c = byId.countries, den = c && c.denominator;
    var c1 = document.getElementById('tll-map-counter'); if (c1) { c1.textContent = den ? n + ' / ' + den : String(n); c1.removeAttribute('aria-busy'); }
    var c2 = document.getElementById('tll-map-pct'); if (c2 && den) { c2.textContent = Math.round(n / den * 100) + '%'; c2.removeAttribute('aria-busy'); }
  }
  function refreshDrawerCounts() {
    [].forEach.call(root.querySelectorAll('.tllm-chip'), function (b) { var c = byId[b.dataset.id]; var n = b.querySelector('.tllm-chip-n'); if (c && n) n.textContent = countText(c); });
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
    var btns = [].slice.call(root.querySelectorAll('.tllm-chip[data-id="' + id + '"]'));
    if (id === 'countries') {
      active[id] = on; map.setPaintProperty('tllm-land', 'fill-color', landFill(on)); map.setLayoutProperty('tllm-land-hatch', 'visibility', on ? 'visible' : 'none'); map.setLayoutProperty('tllm-land-line', 'visibility', on ? 'visible' : 'none');
      finish(); return;
    }
    if (c.computed === 'placeholder') { active[id] = on; say(on ? c.name + ': ' + (empty.list_zero || 'nothing logged yet.') : ''); finish(); return; }
    if (c.computed === 'crossed') { active[id] = on; drawCrossed(on); finish(); return; }
    if (on && !loaded[id]) {
      btns.forEach(function (b) { b.setAttribute('aria-busy', 'true'); });
      var file = c.computed === 'extremes' ? 'extremes.json' : id + '.json';
      return getJSON(DATA + file).then(function (j) {
        loaded[id] = c.computed === 'extremes' ? extremesRows(j) : (j.rows || []);
        if (c.type === 'heat') loaded[id].cellKm = j.cell_km || 400;
        if (counts[id] != null && !c.set_of && !c.items && counts[id] !== loaded[id].length && c.computed !== 'extremes') { counts[id] = loaded[id].length; refreshDrawerCounts(); }
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
  function emptyMsg(c) {
    if (c.id === 'moments') return empty.human || 'Nothing here yet.';
    if (c.type === 'heat') return empty.heat || 'Nothing synced.';
    var s = srcs[c.source]; if (s && s.connected === false) return (s.label || upper(c.source)) + ' · ' + (empty.source_never || 'not connected.');
    return c.name + ': ' + (empty.list_zero || 'nothing logged yet.');
  }
  function extremesRows(x) {
    return [['Furthest north', x.north], ['Furthest south', x.south], ['Furthest east', x.east], ['Furthest west', x.west]].filter(function (r) { return r[1]; }).map(function (r) {
      return { name: r[1].name, collection: 'extremes', latitude: r[1].latitude, longitude: r[1].longitude, country: r[1].country, verb: 'reached', year: '', note: r[0] + '. From the pins.', link: '', depth: '', done: true };
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
  // Lines crossed: the seven lines drawn on the map when that chip is on.
  function drawCrossed(on) {
    var x = extremesData; if (!x) return;
    if (!map.getSource('tllm-lines')) {
      var f = [];
      [['equator_crossed', 0, 'Equator'], ['tropic_of_cancer_crossed', 23.4367, 'Tropic of Cancer'], ['tropic_of_capricorn_crossed', -23.4367, 'Tropic of Capricorn'], ['arctic_circle_crossed', 66.5633, 'Arctic Circle'], ['antarctic_circle_crossed', -66.5633, 'Antarctic Circle']].forEach(function (r) {
        f.push({ type: 'Feature', properties: { name: r[2], crossed: !!x[r[0]] }, geometry: { type: 'LineString', coordinates: [[-180, r[1]], [-90, r[1]], [0, r[1]], [90, r[1]], [180, r[1]]] } }); });
      [['prime_meridian_crossed', 0, 'Prime meridian'], ['antimeridian_crossed', 180, 'Antimeridian']].forEach(function (r) {
        f.push({ type: 'Feature', properties: { name: r[2], crossed: !!x[r[0]] }, geometry: { type: 'LineString', coordinates: [[r[1], -80], [r[1], 0], [r[1], 80]] } }); });
      map.addSource('tllm-lines', { type: 'geojson', data: { type: 'FeatureCollection', features: f } });
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
    var verb = p._country ? p.verb : (notDone ? 'Not yet' : (p.verb || c.verb));
    var meta = upper(verb) + ' · ' + (p.year ? upper(String(p.year)) : notDone ? 'OPEN SLOT' : 'YEAR NOT LOGGED');
    var note = p.note || (p.type ? p.type + (p.country ? ' · ' + p.country : '') : '');
    var link = p.link ? '<a class="tllm-pop-a" href="' + esc(p.link) + '" ' + (/^https?:/.test(p.link) ? 'target="_blank" rel="noopener"' : '') + '>' + (/unesco\.org/.test(p.link) ? 'Official UNESCO page →' : 'Read the ' + esc(p.story || p.name) + ' story →') + '</a>'
      : (p._country ? '<p class="tllm-pop-c">' + esc(empty.popover_no_story || 'No story filed from here yet.') + '</p>' : '');
    var html = '<div class="tllm-pop-k">' + esc(c.name || p.collection) + '</div><h3 class="tllm-pop-h">' + esc(p.name) + '</h3><p class="tllm-pop-m">' + esc(meta) + '</p>' +
      (note ? '<p class="tllm-pop-n">' + esc(note) + '</p>' : '') + link + (p.confirm === true || p.confirm === 'true' ? '<p class="tllm-pop-c">Listing to confirm.</p>' : '');
    popup = new maplibregl.Popup({ className: 'tllm-pop tllm-pop-enter', offset: 14, maxWidth: '320px', focusAfterOpen: true }).setLngLat(coords).setHTML(html).addTo(map);
    popup._tllm = p._c;
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
    if (s.connected === false) { b.textContent = s.label + ' · NOT CONNECTED'; b.dataset.off = '1'; }
    else b.textContent = s.label + (s.synced ? ' · SYNCED ' + upper(dateLabel(s.synced)) : '');
    return b;
  }
  function buildCards(countryRowsArr) {
    var grid = el('div', 'tllm-card-grid'); secCards.appendChild(grid);
    colls.forEach(function (c) {
      if (c.computed && c.computed !== 'pins_named' && c.computed !== 'unesco_country') return;
      var n = counts[c.id]; if (n == null) return;
      if (n === 0 && !c.denominator) return;
      var v = Object.assign({}, vars[c.id] || {}, { n: n, of: c.denominator });
      var card = el('article', 'tllm-card'); card.dataset.id = c.id;
      var top = el('div', 'tllm-card-top'); top.appendChild(el('span', 'tllm-card-label', c.name)); var sb = sourceBadge(c); if (sb) top.appendChild(sb); card.appendChild(top);
      var num = el('div', 'tllm-card-num'); num.innerHTML = '<b data-count="' + n + '">' + (c.type === 'heat' ? 'Rounded' : fmt(n)) + '</b>' + (c.denominator ? '<span class="tllm-card-den">of ' + fmt(c.denominator) + '</span>' : ''); card.appendChild(num);
      card.appendChild(el('div', 'tllm-card-verb', c.verb));
      if (c.denominator) { var pct = Math.min(100, n / c.denominator * 100); var bar = el('div', 'tllm-card-bar'); bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', Math.round(pct) + ' percent'); var fi = el('i'); fi.style.width = pct.toFixed(2) + '%'; bar.appendChild(fi); card.appendChild(bar); }
      if (c.id === 'countries') card.appendChild(depthBlock(v));
      if (v.split && c.id !== 'countries') card.appendChild(el('div', 'tllm-card-split', v.split));
      var cap = n === 0 ? fill(empty.card_zero || '0 of {of}.', v) : fill(c.caption, v);
      if (cap) card.appendChild(el('p', 'tllm-card-cap', cap));
      if (c.what_counts) card.appendChild(el('p', 'tllm-card-rule', 'What counts: ' + c.what_counts));
      var asof = c.as_of_label || (c.denominator ? 'World total as of ' + dateLabel(c.as_of) : (c.as_of ? 'As of ' + dateLabel(c.as_of) : ''));
      if (asof) card.appendChild(el('p', 'tllm-card-asof', asof));
      grid.appendChild(card);
    });
    countUp(grid);
  }
  function depthBlock(v) {
    var wrap = el('div', 'tllm-depth'); wrap.setAttribute('role', 'list'); wrap.setAttribute('aria-label', 'Depth of visit');
    [['Lived', v.lived], ['Stayed', v.stayed], ['Layover only', v.layover], ['Not yet', v.notyet]].forEach(function (d) {
      var li = el('div', 'tllm-depth-row'); li.setAttribute('role', 'listitem');
      var sw = el('i', 'tllm-depth-sw'); sw.dataset.d = d[0]; li.appendChild(sw); li.appendChild(el('span', 'tllm-depth-l', d[0])); li.appendChild(el('b', 'tllm-depth-n', fmt(d[1] || 0))); wrap.appendChild(li);
    });
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
  function buildRules() {
    var rb = cfg.rulebooks || []; if (!rb.length) { secRules.remove(); return; }
    var grid = el('div', 'tllm-rules'); secRules.appendChild(grid);
    getJSON(DATA + 'extremes.json').then(function (x) {
      rb.forEach(function (r) {
        var n = r.count && x.rulebooks ? x.rulebooks[r.count] : null;
        var d = el('div', 'tllm-rule'); var nn = el('div', 'tllm-rule-n'); nn.innerHTML = (n == null ? '<span style="font-size:16px;color:#8890A6;margin:0">OPEN</span>' : fmt(n)) + '<span>of ' + fmt(r.of) + '</span>'; d.appendChild(nn);
        d.appendChild(el('p', 'tllm-rule-w', r.who)); grid.appendChild(d);
      });
    }).catch(function () { secRules.remove(); });
  }

  // ---------- sets of seven: stamps with three-letter codes ----------
  function buildStamps() {
    var sets = cfg.sets_of_seven || []; if (!sets.length) { secSets.remove(); return; }
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

  // ---------- lines strip: number first, label second, source third ----------
  function buildStrip(x) {
    var strip = el('div', 'tllm-strip'); secStrip.appendChild(strip);
    function cell(v, l, s, muted) { var d = el('div', 'tllm-cell' + (muted ? ' tllm-cell-muted' : '')); d.appendChild(el('div', 'tllm-cell-v', v)); d.appendChild(el('div', 'tllm-cell-l', l)); if (s) d.appendChild(el('div', 'tllm-cell-s', s)); return d; }
    function deg(n, pos, neg) { return Math.abs(n).toFixed(1) + '°' + (n >= 0 ? pos : neg); }
    [['Furthest north', x.north, 'lat'], ['Furthest south', x.south, 'lat'], ['Furthest east', x.east, 'lng'], ['Furthest west', x.west, 'lng']].forEach(function (r) {
      var p = r[1]; if (!p) return;
      var c = cell(r[2] === 'lat' ? deg(p.latitude, 'N', 'S') : deg(p.longitude, 'E', 'W'), r[0], p.name + ', ' + countryName(p.country));
      c.tabIndex = 0; c.setAttribute('role', 'button'); c.setAttribute('aria-label', r[0] + ': ' + p.name + ', ' + countryName(p.country) + '. Show on the map');
      function go() { move([p.longitude, p.latitude], 5); } c.addEventListener('click', go); c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      strip.appendChild(c);
    });
    strip.appendChild(cell(x.equator_crossed ? 'Crossed' : 'Not yet', 'Equator', 'From the pins'));
    strip.appendChild(cell((x.arctic_circle_crossed ? 'N' : '·') + ' ' + (x.antarctic_circle_crossed ? 'S' : '·'), 'Polar circles', x.arctic_circle_crossed && x.antarctic_circle_crossed ? 'Both crossed' : 'Arctic or Antarctic'));
    strip.appendChild(cell((x.lines_crossed_count || 0) + '/' + (x.lines_total || 7), 'Lines crossed', 'Equator, tropics, polar circles, meridians'));
    strip.appendChild(cell(x.hemispheres_count + '/4', 'Hemispheres', 'N, S, E and W'));
    strip.appendChild(cell('?/38', 'Time zones', 'Open slot', true));
    var ran = counts.marathons === 7;
    strip.appendChild(cell(x.continents_count + '/7', 'Continents', ran ? 'Run on all seven' : (x.continents || []).join(', ')));
    secStrip.appendChild(el('p', 'tllm-card-asof', 'From ' + x.from));
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
    colls.forEach(function (c) { if (!active[c.id] || !loaded[c.id] || c.type === 'heat') return; loaded[c.id].forEach(function (r) { if (r.name && r.latitude != null) items.push({ c: c, r: r }); }); });
    if (active.countries) Object.keys(countryRows).forEach(function (k) { items.push({ c: byId.countries, r: countryRows[k] }); });
    items.sort(function (a, b) { return a.r.name.localeCompare(b.r.name); });
    var shown = 0;
    items.forEach(function (it) {
      var hay = (it.r.name + ' ' + countryName(it.r.country) + ' ' + it.c.name).toLowerCase(); if (q && hay.indexOf(q) < 0) return; if (++shown > 400) return;
      var li = el('li'), b = el('button'); b.type = 'button';
      b.innerHTML = esc(it.r.name) + '<span>' + esc(it.c.id === 'countries' ? (depthOf(it.r) || 'logged') : countryName(it.r.country)) + '</span>';
      b.addEventListener('click', function () {
        var co = [it.r.longitude, it.r.latitude]; move(co, it.c.id === 'countries' ? 4 : 9);
        if (it.c.id !== 'countries') map.once('moveend', function () { openCard(Object.assign({}, it.r, { _c: it.c.id }), co); }); else say(it.r.name + ', ' + (depthOf(it.r) || 'logged'));
      });
      li.appendChild(b); listUl.appendChild(li);
    });
    if (!shown) listUl.appendChild(el('p', 'tllm-list-empty', q ? 'No pin matches that.' : 'Switch a list on to see its pins here.'));
  }
})();
