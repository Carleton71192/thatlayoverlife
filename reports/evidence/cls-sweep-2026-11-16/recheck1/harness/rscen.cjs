/* Re-check 1 scenario sets (17 Nov 2026). Built on the adversarial judge's scen.cjs (copied unchanged apart from one export line).
   Arms: ctl = live 16.66.0, old = the afe01e7 build, new = the repaired core (634b842). Sets with `arms` run all three. */
const B = require('./scen.cjs'); const { SZ, EIGHT, inl, cell, settle, menuFlow, chipFlow, slowDelay, rep, rex } = B.__h;
const A3 = ['ctl', 'old', 'new'];
const S = {};
const c3 = (id, page, w, extra) => cell(id, page, w, Object.assign({ arms: A3 }, extra || {}));

/* flows with a query string; what the reader ends on after a reload is kept as numbers */
const reloadQ = where => async (page, s, id, rec, L) => {
  await page.goto(L.ORIGIN + L.PAGES[s.page] + (s.query || ''), { waitUntil: 'load', timeout: 120000 }); await settle(page, L, 2500);
  const y = await page.evaluate(w => { const max = document.documentElement.scrollHeight - innerHeight; const y = w === 'bottom' ? max : Math.min(max, Math.round(innerHeight * 1.6)); window.scrollTo(0, y); return y; }, where);
  await L.sleep(700); const before = await L.probe(page, id, 'scrolled'); rec.stages.push(before);
  /* which element is at the top of the screen before the reload, to see whether the reader ends on the same content */
  const anchor = () => page.evaluate(() => { const e = document.elementFromPoint(Math.round(innerWidth / 2), Math.round(innerHeight / 2)); if (!e) return null; const r = e.getBoundingClientRect();
    let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = typeof e.className === 'string' ? e.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return { el: c.length ? s + '.' + c.join('.') : s, top: Math.round(r.top) }; });
  rec.midBefore = await anchor(); rec.yBefore = await page.evaluate(() => [Math.round(scrollY), document.documentElement.scrollHeight, innerHeight]);
  await page.reload({ waitUntil: 'load', timeout: 120000 }); await settle(page, L, 3500);
  const e = await L.probe(page, id, 'reloaded'); e.wantY = y; rec.stages.push(e);
  rec.midAfter = await anchor(); rec.yAfter = await page.evaluate(() => [Math.round(scrollY), document.documentElement.scrollHeight, innerHeight]); };
const backQ = async (page, s, id, rec, L) => {
  await page.goto(L.ORIGIN + L.PAGES[s.page] + (s.query || ''), { waitUntil: 'load', timeout: 120000 }); await settle(page, L, 2500);
  const y = await page.evaluate(() => { const y = Math.min(document.documentElement.scrollHeight - innerHeight, Math.round(innerHeight * 1.2)); window.scrollTo(0, y); return y; }); await L.sleep(600);
  const other = s.page === 'about' ? '/stories' : '/about';
  await Promise.all([page.waitForNavigation({ waitUntil: 'load', timeout: 120000 }), page.evaluate(o => { location.href = o; }, other)]); await L.sleep(1500);
  await page.goBack({ waitUntil: 'load', timeout: 120000 }); await L.sleep(4000);
  const e = await L.probe(page, id, 'back'); e.wantY = y; rec.stages.push(e);
  await page.goForward({ waitUntil: 'load', timeout: 120000 }); await L.sleep(2500);
  await page.goBack({ waitUntil: 'load', timeout: 120000 }); await L.sleep(4000);
  const e2 = await L.probe(page, id, 'back2'); e2.wantY = y; rec.stages.push(e2); };

/* ---- N1: /stories?q=lisbon, fonts not in the browser cache (a fresh context per load), 9 loads an arm ---- */
S.n1 = [];
for (let i = 1; i <= 9; i++) for (const w of [1440, 390]) S.n1.push(c3('st-q-lisbon-' + w + '-r' + i, 'stories', w, { query: '?q=lisbon' }));

/* ---- N2: reload at the very end and from mid page, /about and /for-expats, 4 loads an arm ---- */
S.n2 = [];
for (let i = 1; i <= 4; i++) for (const p of ['about', 'expats']) for (const w of [390, 1440]) for (const where of ['bottom', 'mid'])
  S.n2.push(c3(p + '-reload-' + where + '-' + w + '-r' + i, p, w, { flow: reloadQ(where) }));
/* more loads of the one case the builder left: /for-expats, reload at the very end, 390 */
S.n2x = []; for (let i = 5; i <= 10; i++) S.n2x.push(c3('expats-reload-bottom-390-r' + i, 'expats', 390, { flow: reloadQ('bottom') }));

/* more loads after the first look (06:30 UTC): a reload at the very end of /about (new ended 81 px above at 1440 in 3 of 4, 111 px above at 390 in 1 of 4; ctl and old 0 of 4)
   and of /for-expats at 1440 (new ended 1,153 px above in 4 of 4, old 1 of 4, ctl 2 of 4) */
S.n2y = [];
for (let i = 5; i <= 12; i++) for (const w of [1440, 390]) S.n2y.push(c3('about-reload-bottom-' + w + '-r' + i, 'about', w, { flow: reloadQ('bottom') }));
for (let i = 5; i <= 10; i++) S.n2y.push(c3('expats-reload-bottom-1440-r' + i, 'expats', 1440, { flow: reloadQ('bottom') }));
for (let i = 5; i <= 8; i++) S.n2y.push(c3('expats-reload-mid-1440-r' + i, 'expats', 1440, { flow: reloadQ('mid') }));

/* ---- N3: /the-map with map code that never starts, the normal case, the file missing ---- */
const MAPJS = /map-2\.0\/dist\/tll-map-layers\.js/;
const MAPCASES = [
  ['never-empty', { fail: [{ re: MAPJS, mode: 'empty' }] }, 13000],
  ['never-throw', { fail: [{ re: MAPJS, mode: 'throw' }] }, 13000],
  ['nodata', { fail: [{ re: /map-2\.0\/(data\/|collections)/, mode: '404' }] }, 13000],
  ['code404', { fail: [{ re: MAPJS, mode: '404' }] }, 6000],
  ['normal', {}, 6000],
  ['codeslow', { fail: [{ re: MAPJS, mode: 'slow', ms: 2500 }] }, 9000],
  ['lib404', { fail: [{ re: /maplibre-gl/, mode: '404' }] }, 13000],
  ['css404', { fail: [{ re: /map-2\.0\/dist\/tll-map-layers\.css/, mode: '404' }] }, 6000],
];
S.n3 = [];
for (let i = 1; i <= 2; i++) for (const [n, opts, wait] of MAPCASES) for (const w of [1440, 390]) S.n3.push(c3('map-' + n + '-' + w + '-r' + i, 'map', w, { opts, wait, after: 3000 }));
/* the 20 s release with no data, once per width */
for (const w of [1440, 390]) S.n3.push(c3('map-nodata-23s-' + w, 'map', w, { opts: { fail: [{ re: /map-2\.0\/(data\/|collections)/, mode: '404' }] }, wait: 23500, after: 3000 }));
/* slow /the-map: document in pieces, every file held, CPU 4x (the adversarial judge's plans) */
S.n3slow = [];
for (let i = 1; i <= 2; i++) for (const w of [390, 1440]) {
  S.n3slow.push(c3('map-even-' + w + '-r' + i, 'map', w, { opts: { cpu: 4, delay: slowDelay, stream: { mode: 'even', size: 24000, gap: 110, ttfb: 300 } }, wait: 7000, after: 4000 }));
  S.n3slow.push(c3('map-cut1-' + w + '-r' + i, 'map', w, { opts: { cpu: 4, delay: slowDelay, stream: { mode: 'rand', n: 10, gap: 220, ttfb: 300, seed: 11 } }, wait: 7000, after: 4000 }));
  S.n3slow.push(c3('map-never-empty-cut1-' + w + '-r' + i, 'map', w, { opts: { cpu: 4, delay: slowDelay, fail: [{ re: MAPJS, mode: 'empty' }], stream: { mode: 'rand', n: 10, gap: 220, ttfb: 300, seed: 11 } }, wait: 14000, after: 4000 }));
}

/* ---- N7: a tap on the stand-in Menu button before the page is parsed ---- */
const navState = () => { const n = document.querySelector('.tll-nav-v1'), b = document.querySelector('.tll-nav-v1 .tll-nav-cta-row .tllmm-btn'), ae = document.activeElement;
  const one = e => { if (!e) return ''; let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = typeof e.className === 'string' ? e.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  return { open: !!(n && n.classList.contains('tllmm-open')), ex: b ? b.getAttribute('aria-expanded') : null, nBtn: document.querySelectorAll('.tllmm-btn').length, nStandIn: document.querySelectorAll('.tllmm-btn[aria-hidden]').length,
    active: one(ae), activeIsBtn: !!(b && ae === b), btnHidden: b ? b.getAttribute('aria-hidden') : null, btnTab: b ? b.tabIndex : null, sy: Math.round(scrollY) }; };
const earlyTap2 = how => async (page, s, id, rec, L) => {
  const nav = page.goto(L.ORIGIN + L.PAGES[s.page] + (s.query || ''), { waitUntil: 'load', timeout: 120000 });
  rec.tap = { how };
  try { const b = page.locator('.tll-nav-v1 .tllmm-btn'); await b.first().waitFor({ state: 'visible', timeout: 8000 });
    rec.tap.at = await page.evaluate(() => ({ t: Math.round(performance.now()), rs: document.readyState, hidden: document.querySelector('.tllmm-btn').getAttribute('aria-hidden'), ti: document.querySelector('.tllmm-btn').tabIndex }));
    if (how === 'touch') await b.first().tap({ timeout: 3000 }); else await b.first().click({ timeout: 3000 }); rec.tap.clicked = 1;
    rec.tap.afterTap = await page.evaluate(navState);
    if (how === 'moved') { /* the reader puts the focus somewhere else before the page is parsed: it must stay there */
      rec.tap.moved = await page.evaluate(() => { const a = document.querySelector('.tll-nav-v1 a[href]'); if (a) a.focus(); return document.activeElement === a ? 'link' : 'no'; }); }
  } catch (e) { rec.tap.err = String(e).slice(0, 120); }
  await nav; await settle(page, L, 2500);
  rec.tap.end = await page.evaluate(navState);
  rec.stages.push(await L.probe(page, id, 'open'));
  await page.keyboard.press('Escape'); await L.sleep(500);
  rec.tap.esc = await page.evaluate(navState);
  /* and a second, normal tap opens it again */
  try { await page.locator('.tll-nav-v1 .tll-nav-cta-row .tllmm-btn').first().click({ timeout: 3000 }); await L.sleep(400); rec.tap.again = await page.evaluate(navState); await page.keyboard.press('Escape'); await L.sleep(400); } catch (e) { rec.tap.againErr = String(e).slice(0, 100); }
  rec.stages.push(await L.probe(page, id, 'closed')); };
const PIECES = { stream: { mode: 'even', size: 16000, gap: 250, ttfb: 50 } };
S.n7 = [];
for (let i = 1; i <= 3; i++) for (const p of ['stories', 'account']) S.n7.push(c3(p + '-earlytap-390-r' + i, p, 390, { flow: earlyTap2('click'), opts: PIECES }));
for (let i = 1; i <= 2; i++) for (const p of ['about', 'map']) S.n7.push(c3(p + '-earlytap-390-r' + i, p, 390, { flow: earlyTap2('click'), opts: PIECES }));
for (let i = 1; i <= 2; i++) S.n7.push(c3('stories-earlytouch-390-r' + i, 'stories', 390, { flow: earlyTap2('touch'), opts: PIECES }));
for (let i = 1; i <= 2; i++) S.n7.push(cell('stories-earlytap-moved-390-r' + i, 'stories', 390, { flow: earlyTap2('moved'), opts: PIECES, arms: ['old', 'new'] }));
S.n7.push(c3('stories-earlytap-320', 'stories', 320, { flow: earlyTap2('click'), opts: PIECES }));
S.n7.push(c3('stories-earlytap-768', 'stories', 768, { flow: earlyTap2('click'), opts: PIECES }));
S.n7.push(c3('stories-q-earlytap-390', 'stories', 390, { flow: earlyTap2('click'), opts: PIECES, query: '?q=lisbon' }));
/* the normal menu flow on the pages the repair touched */
for (const p of ['about', 'map', 'stories', 'expats']) S.n7.push(cell(p + '-menu-390', p, 390, { flow: menuFlow }));

/* ---- attacks next to N1: other query strings and hashes on /stories ---- */
const INDEX = /story-search-index\.json/, PF = /fonts\.gstatic\.com\/s\/playfairdisplay/;
S.atkq = [];
const Q = (id, ws, extra) => { for (const w of ws) S.atkq.push(cell('st-' + id + '-' + w, 'stories', w, extra)); };
Q('q-italy', [390, 1440], { query: '?q=italy' });
Q('q-a', [390, 1440], { query: '?q=a' });
Q('q-none', [390, 1440], { query: '?q=zzzzqqq' });
Q('q-blank', [390, 1440], { query: '?q=' });
Q('q-utm', [390, 1440], { query: '?utm_source=x&q=italy' });
Q('q-two-words', [1440], { query: '?q=sun+sails' });
Q('q-hash', [390, 1440], { query: '?q=lisbon#lisbon-sun-sails-city-built-to-stand-back-up' });
Q('hash-card', [390, 1440], { query: '#kuala-lumpur-fomo-is-real' });
Q('q-rm', [390, 1440], { query: '?q=lisbon', opts: { ctx: { reducedMotion: 'reduce' } } });
Q('q-index404', [390, 1440], { query: '?q=lisbon', opts: { fail: [{ re: INDEX, mode: '404' }] } });
Q('q-indexslow', [390, 1440], { query: '?q=lisbon', opts: { fail: [{ re: INDEX, mode: 'slow', ms: 2500 }] }, wait: 7000 });
Q('q-fonts404', [390, 1440], { query: '?q=lisbon', opts: { fail: [{ re: PF, mode: '404' }] } });
Q('q-fontsabort', [1440], { query: '?q=lisbon', opts: { fail: [{ re: PF, mode: 'abort' }] } });
Q('q-fontsslow', [390, 1440], { query: '?q=lisbon', opts: { fail: [{ re: PF, mode: 'slow', ms: 2000 }] }, wait: 7000 });
Q('q-fontcss404', [1440], { query: '?q=lisbon', opts: { fail: [{ re: /fonts\.googleapis\.com\/css2/, mode: '404' }] } });
Q('q-320', [320], { query: '?q=lisbon' });
Q('q-768', [768], { query: '?q=lisbon' });
Q('q-even', [390, 1440], { query: '?q=lisbon', opts: { cpu: 4, delay: slowDelay, stream: { mode: 'even', size: 24000, gap: 110, ttfb: 300 } }, wait: 7000, after: 4000 });
Q('q-cut1', [390, 1440], { query: '?q=lisbon', opts: { cpu: 4, delay: slowDelay, stream: { mode: 'rand', n: 10, gap: 220, ttfb: 300, seed: 11 } }, wait: 7000, after: 4000 });
Q('q-cut3', [390, 1440], { query: '?q=lisbon', opts: { stream: { mode: 'rand', n: 12, gap: 180, ttfb: 50, seed: 3 } }, wait: 6500 });
Q('q-cpu4', [390, 1440], { query: '?q=lisbon', opts: { cpu: 4 }, wait: 7000 });
Q('q-search-throw', [1440], { query: '?q=lisbon', opts: { html: inl('tll-lib-search-v4', 'throw') } });
Q('q-chips-throw', [1440], { query: '?q=lisbon', opts: { html: inl('tll-lib-chips-v1', 'throw') } });
Q('q-lead-throw', [1440], { query: '?q=lisbon', opts: { html: inl('tll-lib-lead-v1', 'throw') } });
Q('q-chunk404', [390, 1440], { query: '?q=lisbon', opts: { fail: [{ re: /site-layers\/chunks\/(?!site\.js)[a-z-]+\.js/, mode: '404' }] } });
Q('q-signedin', [390, 1440], { query: '?q=lisbon', opts: { ms: 'in', msDelay: 20 }, wait: 6500, after: 4500 });
Q('q-jsoff', [390], { query: '?q=lisbon', opts: { ctx: { javaScriptEnabled: false } }, flow: async (page, s, id, rec, L) => { await page.goto(L.ORIGIN + L.PAGES[s.page] + s.query, { waitUntil: 'load', timeout: 60000 }); await L.sleep(1500); rec.stages.push(await L.probe(page, id)); } });
Q('q-chips', [390, 1440], { query: '?q=lisbon', flow: chipFlow });
Q('q-reload-mid', [390, 1440], { query: '?q=italy', flow: reloadQ('mid') });
Q('q-reload-bottom', [390, 1440], { query: '?q=italy', flow: reloadQ('bottom') });
Q('q-back', [390, 1440], { query: '?q=italy', flow: backQ });

/* ---- attacks: reload on the other changed pages, back and forward ---- */
S.atknav = [];
for (const p of ['travelers', 'map', 'account', 'submit', 'profile', 'stories']) for (const where of ['mid', 'bottom']) S.atknav.push(cell(p + '-reload-' + where + '-390', p, 390, { flow: reloadQ(where) }));
for (const p of ['map', 'stories', 'travelers']) for (const where of ['mid', 'bottom']) S.atknav.push(cell(p + '-reload-' + where + '-1440', p, 1440, { flow: reloadQ(where) }));
for (const p of ['about', 'expats', 'map', 'stories']) for (const w of [390, 1440]) S.atknav.push(cell(p + '-back-' + w, p, w, { flow: backQ }));
/* a reload at the very end with the note style gone, and at 320 and 768 */
for (const w of [320, 768]) S.atknav.push(cell('about-reload-bottom-' + w, 'about', w, { flow: reloadQ('bottom') }));

/* ---- attacks: reduced motion, JavaScript off, 320 px, signed in, on the pages the repair touched ---- */
S.atkenv = [];
for (const p of ['about', 'map', 'stories', 'expats']) for (const w of [390, 1440]) S.atkenv.push(cell(p + '-rm-' + w, p, w, { opts: { ctx: { reducedMotion: 'reduce' } } }));
S.atkenv.push(cell('map-never-empty-rm-1440', 'map', 1440, { opts: { ctx: { reducedMotion: 'reduce' }, fail: [{ re: MAPJS, mode: 'empty' }] }, wait: 13000, after: 3000 }));
for (const p of ['about', 'map', 'stories']) for (const w of [390, 1440]) S.atkenv.push(cell(p + '-jsoff-' + w, p, w, { opts: { ctx: { javaScriptEnabled: false } }, flow: async (page, s, id, rec, L) => { await page.goto(L.ORIGIN + L.PAGES[s.page], { waitUntil: 'load', timeout: 60000 }); await L.sleep(1500); rec.stages.push(await L.probe(page, id)); } }));
for (const p of EIGHT) S.atkenv.push(cell(p + '-320', p, 320, { wait: p === 'travelers' ? 11000 : 0 }));
S.atkenv.push(cell('map-never-empty-320', 'map', 320, { opts: { fail: [{ re: MAPJS, mode: 'empty' }] }, wait: 13000, after: 3000 }));
S.atkenv.push(cell('map-nodata-320', 'map', 320, { opts: { fail: [{ re: /map-2\.0\/(data\/|collections)/, mode: '404' }] }, wait: 13000, after: 3000 }));
for (const p of ['about', 'map', 'stories']) for (const w of [390, 1440]) S.atkenv.push(cell(p + '-in-fast-' + w, p, w, { opts: { ms: 'in', msDelay: 20 }, wait: p === 'map' ? 9000 : 6500, after: 4500 }));
/* the document in pieces on /about, /stories and /for-expats (the note hold is on screen between pieces) */
for (const p of ['about', 'stories', 'expats']) for (const w of [390, 1440]) {
  S.atkenv.push(cell(p + '-even-' + w, p, w, { opts: { cpu: 4, delay: slowDelay, stream: { mode: 'even', size: 24000, gap: 110, ttfb: 300 } }, wait: 7000, after: 4000 }));
  S.atkenv.push(cell(p + '-cut1-' + w, p, w, { opts: { cpu: 4, delay: slowDelay, stream: { mode: 'rand', n: 10, gap: 220, ttfb: 300, seed: 11 } }, wait: 7000, after: 4000 }));
  S.atkenv.push(cell(p + '-cut3-' + w, p, w, { opts: { stream: { mode: 'rand', n: 12, gap: 180, ttfb: 50, seed: 3 } }, wait: 6500 }));
}
/* /about in small even pieces, so a cut falls inside the note and inside its style */
for (const w of [390, 1440]) S.atkenv.push(cell('about-small-' + w, 'about', w, { opts: { stream: { mode: 'even', size: 3000, gap: 60, ttfb: 50 } }, wait: 8000 }));

/* ---- attacks: page scripts failing on the pages the repair touched ---- */
S.atkfail = B.fail.filter(s => /^(map|about|stories)-/.test(s.id));
const NOTE_CSS = /<style id="tll-note-v1-css">[\s\S]*?<\/style>/;
const AB = (id, html, extra) => { for (const w of [390, 1440]) S.atkfail.push(cell('about-' + id + '-' + w, 'about', w, Object.assign({ opts: { html } }, extra || {}))); };
AB('note-nostyle', rex(NOTE_CSS, ''));
AB('note-style-renamed', rep('<style id="tll-note-v1-css">', '<style id="tll-note-v2-css">', 1));
AB('note-gone', rep('<div id="tll-note" ', '<div id="tll-notex" ', 1));
AB('note-js-throw', inl('tll-note-v1-js', 'throw'));
AB('note-js-missing', inl('tll-note-v1-js', 'missing'));
AB('note-style-first', (k, h) => { const m = NOTE_CSS.exec(h); if (!m) throw new Error('note style not found'); const i = h.indexOf('<div id="tll-note" '); if (i < 0) throw new Error('note not found'); const css = m[0]; h = h.replace(css, ''); return h.slice(0, i) + css + h.slice(i); });
for (const where of ['bottom', 'mid']) S.atkfail.push(cell('about-note-nostyle-reload-' + where + '-390', 'about', 390, { opts: { html: rex(NOTE_CSS, '') }, flow: reloadQ(where) }));
/* the map: its own signs changed under the core */
S.atkfail.push(cell('map-noboot-never-empty-1440', 'map', 1440, { opts: { html: rep('<p id="tllm-boot"', '<p id="tllm-bootx"', 1), fail: [{ re: MAPJS, mode: 'empty' }] }, wait: 23500, after: 3000 }));
S.atkfail.push(cell('map-noboot-1440', 'map', 1440, { opts: { html: rep('<p id="tllm-boot"', '<p id="tllm-bootx"', 1) }, wait: 6000 }));
S.atkfail.push(cell('map-nomount-390', 'map', 390, { opts: { html: rep('<div id="tll-map-layers"', '<div id="tll-map-layersx"', 1) }, wait: 8000 }));

module.exports = S;
