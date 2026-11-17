/* Release 16.67.0 regression check (17 Nov 2026): try to break the REAL test site (that-layover-life.webflow.io, core 16.67.0, pin a254306f)
   against REAL www (www.thatlayover.life, core 16.66.0, pin 3df16988). Independent, read only.
   Derived from the 16.67.0 behavior check harness (check1667-behavior/bin/b.cjs), the adversarial scenarios (recheck1/harness/scen.cjs, lib.cjs)
   and the 16.66.0 regression harness (nov15/check1666-regression/bin/h2.cjs: slow 4G pipe, consent stub).
   - The first top-frame navigation of a load is one real GET of the real host (route.continue, or route.fetch when the document is changed
     for a fault or held back for slow 4G). Later navigations of the flow (reload, back, forward, the other page) get this checker's
     plain-GET copy of the same host (behavior check copies of 10:31 UTC). Anything else is aborted.
   - Every non-GET is aborted. Ads and analytics are answered with an empty body (consent sets: the CMP stub; every ad or analytics request is listed).
   - jsDelivr files of our repo: `git show <pin>:<path>` (byte equal to jsDelivr, carry check). Webflow images, video, fonts: local caches only; a miss is aborted.
   - Memberstack served patched (signed out) or as a signed-in stand-in (no name, a made-up address).
   - Slow 4G: every answer waits 150 ms and then shares one 1.6 Mbit/s pipe; CPU 4x.
   - Math.random seeded the same on both hosts. One browser at a time; results appended per load; finished loads are skipped.
   Usage: NODE_PATH=/opt/node22/lib/node_modules node r.cjs <set> */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), zlib = require('zlib'), cp = require('child_process');
const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const D = path.join(SP, 'nov17/check1667-regression'), BEH = path.join(SP, 'nov17/check1667-behavior'), REPO = '/home/user/thatlayoverlife';
const SET = process.argv[2] || 'smoke';
const HOST = { www: 'https://www.thatlayover.life', test: 'https://that-layover-life.webflow.io' };
const PROFILE = fs.readFileSync(path.join(SP, 'nov16/survey/profile-path.txt'), 'utf8').trim();
const PAGES = { travelers: '/travelers', map: '/the-map', expats: '/for-expats', about: '/about', account: '/account', submit: '/submit', profile: PROFILE, stories: '/stories',
  balkans: '/stories/balkans-ev-road-trip-twelve-countries', safrica: '/stories/southern-africa-safari' };
const EIGHT = ['travelers', 'map', 'expats', 'about', 'account', 'submit', 'profile', 'stories'];
const COPY = {};
for (const h of ['www', 'test']) for (const f of fs.readdirSync(path.join(BEH, 'html', h))) { if (!f.endsWith('.html')) continue; const k = f.slice(0, -5);
  const p = k === 'home' ? '/' : k === 'profile' ? PROFILE : '/' + k.replace(/__/g, '/'); COPY[h + ' ' + p] = path.join(BEH, 'html', h, f); }
const sha = (b, n) => crypto.createHash('sha1').update(b).digest('hex').slice(0, n || 12);
const mask = s => String(s).replace(/contributors\/[^/?#\s"']+/g, 'contributors/<profile>').replace(/gh\/[^/]+\/thatlayoverlife/g, 'gh/OWNER/thatlayoverlife');
const LAUNCH = { proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } }; /* route.fetch (the changed or held-back document) goes through the session proxy like the browser */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------------- scenarios ---------------- */
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/* an inline <script id=...> of the page: its code replaced by a throw */
const inl = id => h => { const re = new RegExp('(<script[^>]*\\bid="' + esc(id) + '"[^>]*>)([\\s\\S]*?)(</script>)'); if (!re.test(h)) throw new Error('inline script not found: ' + id);
  return h.replace(re, '$1throw new Error("regr: forced throw in ' + id + '");$3'); };
const inlAll = ids => h => ids.reduce((x, id) => inl(id)(x), h);
/* the Map 2.0 embed's inline boot script (the anonymous script that loads dist/tll-map-layers.js) */
const mapBootThrow = h => { const re = /(<script>)([^<]*?dist\/tll-map-layers\.js[\s\S]*?)(<\/script>)/; if (!re.test(h)) throw new Error('map boot not found');
  return h.replace(re, '$1throw new Error("regr: forced throw in the map embed boot");$3'); };
const SZ = { 320: [320, 780], 330: [330, 780], 340: [340, 780], 344: [344, 780], 350: [350, 780], 360: [360, 780], 368: [368, 780], 375: [375, 780], 390: [390, 844], 1440: [1440, 900] };
const cell = (id, page, w, extra) => Object.assign({ id, page, w, h: SZ[w] ? SZ[w][1] : 900, rounds: 2 }, extra || {});

const settle = async (page, ms) => { const a = await page.evaluate(() => [performance.now(), window.__J && window.__J.loadT]).catch(() => [0, 0]); await sleep(Math.max(0, (a[1] || a[0]) + ms - a[0]) + 50); };
const goto = (page, L, s, extra) => page.goto(L.O + L.PAGES[s.page] + (extra || s.query || ''), { waitUntil: 'load', timeout: 150000 });
const plainFlow = async (page, s, rec, L) => { const r = await goto(page, L, s); rec.status = r ? r.status() : null; await settle(page, s.wait || 4000); rec.stages.push(await L.probe(page, 'end')); };
const reloadFlow = where => async (page, s, rec, L) => {
  const r = await goto(page, L, s); rec.status = r ? r.status() : null; await settle(page, 2500);
  const y = await page.evaluate(w => { const max = document.documentElement.scrollHeight - innerHeight; const y = w === 'end' ? max : Math.min(max, Math.round(innerHeight * 1.6)); window.scrollTo(0, y); return y; }, where);
  await sleep(700); const a = await L.probe(page, 'scrolled'); a.wantY = y; rec.stages.push(a);
  await page.reload({ waitUntil: 'load', timeout: 150000 }); await settle(page, 3500);
  const e = await L.probe(page, 'reloaded'); e.wantY = y; e.wantMax = a.docH - s.h; rec.stages.push(e); };
const backFlow = (other, scrollF) => async (page, s, rec, L) => {
  const r = await goto(page, L, s); rec.status = r ? r.status() : null; await settle(page, 2500);
  const y = await page.evaluate(f => { const y = Math.min(document.documentElement.scrollHeight - innerHeight, Math.round(innerHeight * f)); window.scrollTo(0, y); return y; }, scrollF || 1.2); await sleep(600);
  const a = await L.probe(page, 'scrolled'); a.wantY = y; rec.stages.push(a);
  await Promise.all([page.waitForNavigation({ waitUntil: 'load', timeout: 150000 }), page.evaluate(o => { location.href = o; }, L.O + other)]); await sleep(1500);
  await page.goBack({ waitUntil: 'load', timeout: 150000 }); await sleep(4000);
  const e = await L.probe(page, 'back'); e.wantY = y; rec.stages.push(e);
  await page.goForward({ waitUntil: 'load', timeout: 150000 }); await sleep(2000);
  await page.goBack({ waitUntil: 'load', timeout: 150000 }); await sleep(4000);
  const e2 = await L.probe(page, 'back2'); e2.wantY = y; rec.stages.push(e2); };
const sizeFlow = steps => async (page, s, rec, L) => {
  const r = await goto(page, L, s); rec.status = r ? r.status() : null; await settle(page, 3000);
  rec.stages.push(await L.probe(page, 'a'));
  for (const [w2, h2, nm] of steps) { await page.setViewportSize({ width: w2, height: h2 }); await sleep(1500); rec.stages.push(await L.probe(page, nm)); } };
const earlyTap = async (page, s, rec, L) => {
  const nav = goto(page, L, s); rec.tap = {};
  try { const b = page.locator('.tll-nav-v1 .tllmm-btn'); await b.first().waitFor({ state: 'visible', timeout: 30000 });
    rec.tap.at = await page.evaluate(() => { const b = document.querySelector('.tll-nav-v1 .tllmm-btn'); return { t: Math.round(performance.now()), rs: document.readyState, standIn: b.getAttribute('aria-hidden') === 'true' ? 1 : 0, n: document.querySelectorAll('.tllmm-btn').length }; });
    await b.first().tap({ timeout: 5000 }); rec.tap.tapped = 1; rec.tap.after = await page.evaluate(() => ({ t: Math.round(performance.now()), rs: document.readyState })); } catch (e) { rec.tap.err = String(e).slice(0, 140); }
  const r = await nav; rec.status = r ? r.status() : null; await settle(page, 4000);
  rec.tap.end = await page.evaluate(() => { const nav = document.querySelector('.tll-nav-v1'), b = document.querySelector('.tll-nav-v1 .tllmm-btn'), ae = document.activeElement;
    return { open: nav ? (nav.classList.contains('tllmm-open') ? 1 : 0) : null, ex: b ? b.getAttribute('aria-expanded') : null, n: document.querySelectorAll('.tllmm-btn').length, standIn: document.querySelectorAll('.tllmm-btn[aria-hidden]').length,
      focus: ae === b ? 'menu-button' : ae ? (ae.tagName.toLowerCase() + (ae.className && typeof ae.className === 'string' ? '.' + ae.className.trim().split(/\s+/)[0] : '')) : 'none' }; });
  rec.stages.push(await L.probe(page, 'end'));
  /* Escape closes, a second tap opens again */
  try { await page.keyboard.press('Escape'); await sleep(400); rec.tap.esc = await page.evaluate(() => { const n = document.querySelector('.tll-nav-v1'); return n ? (n.classList.contains('tllmm-open') ? 1 : 0) : null; });
    await page.locator('.tll-nav-v1 .tllmm-btn').first().tap({ timeout: 3000 }); await sleep(500); rec.tap.again = await page.evaluate(() => { const n = document.querySelector('.tll-nav-v1'); return n ? (n.classList.contains('tllmm-open') ? 1 : 0) : null; }); } catch (e) { rec.tap.err2 = String(e).slice(0, 100); } };

function plan(set) {
  const C = [];
  if (set === 'smoke') { C.push(cell('travelers-slow-390', 'travelers', 390, { opts: { slow: 1 }, rounds: 1, wait: 4000 }), cell('stories-fail-search-1440', 'stories', 1440, { opts: { html: inl('tll-lib-search-v4') }, rounds: 1 }),
    cell('account-in-fast-1440', 'account', 1440, { opts: { ms: 'in', msDelay: 20 }, rounds: 1 }), cell('stories-cmp-deny-390', 'stories', 390, { opts: { cmp: 'deny' }, rounds: 1, wait: 6000 })); return C; }
  /* slow 4G on four pages */
  if (set === 'slow') { for (const p of ['travelers', 'map', 'account', 'stories']) for (const w of [390, 1440]) C.push(cell(p + '-slow-' + w, p, w, { opts: { slow: 1 }, rounds: 3, wait: 4000 })); return C; }
  /* repeats (11:50 UTC): /stories under slow 4G read higher on test in 2 of 3 first loads (the title hold lets go at the font swap) */
  if (set === 'slow2') { for (const w of [390, 1440]) C.push(cell('stories-slow-' + w, 'stories', w, { opts: { slow: 1 }, rounds: 8, wait: 4000 })); C.push(cell('stories-slow-360', 'stories', 360, { opts: { slow: 1 }, rounds: 3, wait: 4000 })); return C; }
  /* scripts failing */
  if (set === 'fail') {
    for (const p of EIGHT) C.push(cell(p + '-parity-throw-390', p, 390, { opts: { html: inl('tll-proto-parity-js-v1') }, rounds: 1 }));
    for (const p of ['account', 'submit', 'stories']) C.push(cell(p + '-parity-throw-1440', p, 1440, { opts: { html: inl('tll-proto-parity-js-v1') } }));
    for (const p of EIGHT) C.push(cell(p + '-mnav-throw-390', p, 390, { opts: { html: inl('tll-mobile-nav-js-v1') }, rounds: 1 }));
    for (const w of [390, 1440]) { for (const id of ['tll-lib-search-v4', 'tll-lib-chips-v1', 'tll-lib-lead-v1', 'tll-s3-stories-js-v1']) C.push(cell('stories-' + id + '-throw-' + w, 'stories', w, { opts: { html: inl(id) } }));
      C.push(cell('stories-footer4-throw-' + w, 'stories', w, { opts: { html: inlAll(['tll-lib-search-v4', 'tll-lib-chips-v1', 'tll-lib-lead-v1', 'tll-s3-stories-js-v1']) } }));
      C.push(cell('stories-shareyours404-' + w, 'stories', w, { opts: { fail: [{ re: /tll_library_share_yours/, mode: '404' }] } }));
      C.push(cell('profile-pf5-profile-throw-' + w, 'profile', w, { opts: { html: inl('tll-pf5-profile-js-v1') } }));
      C.push(cell('profile-pf5-n-throw-' + w, 'profile', w, { opts: { html: inl('tll-pf5-n-v1') } }));
      C.push(cell('profile-pf3guard404-' + w, 'profile', w, { opts: { fail: [{ re: /tllpf3guardv1/, mode: '404' }] } }));
      C.push(cell('map-mapcode404-' + w, 'map', w, { opts: { fail: [{ re: /map-2\.0\/dist\/tll-map-layers\.js/, mode: '404' }] }, wait: 6000 }));
      C.push(cell('map-mapcode-throw-' + w, 'map', w, { opts: { fail: [{ re: /map-2\.0\/dist\/tll-map-layers\.js/, mode: 'throw' }] }, wait: 12000 }));
      C.push(cell('map-mapembed404-' + w, 'map', w, { opts: { fail: [{ re: /tllmapembedv1/, mode: '404' }] }, wait: 6000 }));
      C.push(cell('map-mapembed-throw-' + w, 'map', w, { opts: { fail: [{ re: /tllmapembedv1/, mode: 'throw' }] }, wait: 6000 }));
      C.push(cell('map-mapboot-throw-' + w, 'map', w, { opts: { html: mapBootThrow }, wait: 6000 })); }
    return C; }
  /* /stories with a search term; back to /stories?q=italy after scrolling */
  if (set === 'stq') { for (const w of [390, 1440]) C.push(cell('stories-q-lisbon-' + w, 'stories', w, { query: '?q=lisbon', rounds: 3 }));
    C.push(cell('stories-q-italy-back-1440', 'stories', 1440, { query: '?q=italy', flow: backFlow('/about'), rounds: 3 }));
    C.push(cell('stories-q-italy-back-390', 'stories', 390, { query: '?q=italy', flow: backFlow('/about'), rounds: 2 })); return C; }
  if (set === 'reload') { for (const p of ['about', 'expats']) for (const w of [390, 1440]) for (const wh of ['end', 'mid']) C.push(cell(p + '-reload-' + wh + '-' + w, p, w, { flow: reloadFlow(wh) })); return C; }
  if (set === 'tap') { for (const p of ['stories', 'account', 'travelers', 'map', 'about']) C.push(cell(p + '-earlytap-390', p, 390, { opts: { slow: 1 }, flow: earlyTap }));
    C.push(cell('stories-earlytap-fast-390', 'stories', 390, { flow: earlyTap })); return C; }
  if (set === 'rm') { for (const p of EIGHT) C.push(cell(p + '-rm-390', p, 390, { opts: { ctx: { reducedMotion: 'reduce' } }, rounds: 1 })); for (const p of ['travelers', 'map', 'account', 'stories']) C.push(cell(p + '-rm-1440', p, 1440, { opts: { ctx: { reducedMotion: 'reduce' } }, rounds: 1 })); return C; }
  if (set === 'jsoff') { for (const p of EIGHT) C.push(cell(p + '-jsoff-390', p, 390, { opts: { ctx: { javaScriptEnabled: false } }, rounds: 1, wait: 2000 })); for (const p of ['account', 'stories']) C.push(cell(p + '-jsoff-1440', p, 1440, { opts: { ctx: { javaScriptEnabled: false } }, rounds: 1, wait: 2000 })); return C; }
  if (set === 'back') { for (const p of EIGHT) C.push(cell(p + '-back-390', p, 390, { flow: backFlow(p === 'about' ? '/stories' : '/about'), rounds: 1 })); for (const p of ['travelers', 'map', 'account', 'stories']) C.push(cell(p + '-back-1440', p, 1440, { flow: backFlow(p === 'about' ? '/stories' : '/about'), rounds: 1 })); return C; }
  if (set === 'resize') { for (const p of EIGHT) { C.push(cell(p + '-rotate-390', p, 390, { flow: sizeFlow([[844, 390, 'land'], [390, 844, 'port']]), rounds: 1 })); C.push(cell(p + '-resize-1440', p, 1440, { flow: sizeFlow([[768, 1024, 'w768'], [1440, 900, 'w1440']]), rounds: 1 })); }
    C.push(cell('travelers-resize-1440-390', 'travelers', 1440, { flow: sizeFlow([[390, 844, 'w390'], [1440, 900, 'w1440']]), rounds: 1 }));
    C.push(cell('map-resize-1440-390', 'map', 1440, { flow: sizeFlow([[390, 844, 'w390'], [1440, 900, 'w1440']]), rounds: 1 })); return C; }
  if (set === 'w320') { for (const p of EIGHT) C.push(cell(p + '-320', p, 320, { wait: p === 'travelers' ? 11000 : 4000 })); return C; }
  if (set === 'signedin') { for (const p of ['account', 'submit']) for (const w of [390, 1440]) for (const [n, d] of [['fast', 20], ['late', 1500]]) C.push(cell(p + '-in-' + n + '-' + w, p, w, { opts: { ms: 'in', msDelay: d }, wait: 5000 }));
    for (const p of ['account', 'submit']) C.push(cell(p + '-in-slow-390', p, 390, { opts: { ms: 'in', msDelay: 20, slow: 1 }, rounds: 1, wait: 5000 })); return C; }
  /* repeats (11:58 UTC): signed in /account 390 with a late member answer read 0.244 on test in 2 of 2 (www 0.230 and 0.071); signed-in /submit slow 390 one load each */
  if (set === 'signedin2') { C.push(cell('account-in-late-390', 'account', 390, { opts: { ms: 'in', msDelay: 1500 }, wait: 5000, rounds: 8 }));
    C.push(cell('account-in-late-1440', 'account', 1440, { opts: { ms: 'in', msDelay: 1500 }, wait: 5000, rounds: 4 }));
    C.push(cell('submit-in-slow-390', 'submit', 390, { opts: { ms: 'in', msDelay: 20, slow: 1 }, wait: 5000, rounds: 3 })); return C; }
  /* follow-ups (12:10 UTC): all four /stories footer scripts throwing read 0.369 on test (www 0.017); which pair does it. The map embed boot throwing keeps the map hold: watch past 20 s */
  if (set === 'fail2') { const F = { search: 'tll-lib-search-v4', chips: 'tll-lib-chips-v1', lead: 'tll-lib-lead-v1', s3: 'tll-s3-stories-js-v1' };
    for (const combo of [['search', 'chips', 's3'], ['lead', 'search'], ['lead', 'chips'], ['lead', 's3'], ['search', 'chips'], ['chips', 's3'], ['search', 's3'], ['search', 'chips', 'lead'], ['search', 'lead', 's3'], ['chips', 'lead', 's3']])
      C.push(cell('stories-throw-' + combo.join('+') + '-390', 'stories', 390, { opts: { html: inlAll(combo.map(k => F[k])) }, rounds: 1 }));
    C.push(cell('stories-footer4-throw-390', 'stories', 390, { opts: { html: inlAll(Object.values(F)) }, rounds: 2 }));
    C.push(cell('stories-footer4-throw-360', 'stories', 360, { opts: { html: inlAll(Object.values(F)) }, rounds: 1 }));
    for (const w of [390, 1440]) C.push(cell('map-mapboot-throw-25s-' + w, 'map', w, { opts: { html: mapBootThrow }, wait: 25000, rounds: 1 })); return C; }
  if (set === 'consent') { for (const p of EIGHT) C.push(cell(p + '-cmp-deny-390', p, 390, { opts: { cmp: 'deny' }, rounds: 1, wait: 6000 }));
    for (const p of ['stories', 'account']) C.push(cell(p + '-cmp-deny-1440', p, 1440, { opts: { cmp: 'deny' }, rounds: 1, wait: 6000 }));
    for (const p of ['travelers', 'stories']) C.push(cell(p + '-cmp-grant-390', p, 390, { opts: { cmp: 'grant' }, rounds: 1, wait: 6000 })); return C; }
  if (set === 'story') { for (const w of [320, 330, 340, 344, 350, 360, 368, 375, 390]) C.push(cell('balkans-' + w, 'balkans', w, { rounds: 3 }));
    for (const w of [360, 390]) C.push(cell('safrica-' + w, 'safrica', w, { rounds: 3 })); return C; }
  /* repeats (16:40 UTC): one-load leads from sets jsoff and back. JS off the two hosts serve the same HTML apart from the core pin; back on /account 1440 test landed 77 px above the wanted scroll */
  if (set === 'rep') { C.push(cell('stories-jsoff-1440', 'stories', 1440, { opts: { ctx: { javaScriptEnabled: false } }, rounds: 4, wait: 2000 }));
    C.push(cell('account-back-1440', 'account', 1440, { flow: backFlow('/about'), rounds: 3 }));
    C.push(cell('travelers-back-390', 'travelers', 390, { flow: backFlow('/about'), rounds: 2 })); return C; }
  throw new Error('unknown set ' + set);
}

/* ---------------- caches and routing (from b.cjs) ---------------- */
const OWN = path.join(D, 'cache'); fs.mkdirSync(OWN, { recursive: true });
const CACHE = new Map();
(function scan() {
  const dirs = [];
  const walk = (d, depth) => { let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (e) { return; }
    for (const e of ents) if (e.isDirectory()) { const p = path.join(d, e.name);
      if (/cache/i.test(e.name)) dirs.push(p); else if (depth < 4 && e.name !== 'node_modules' && e.name !== 'wt' && e.name !== 'build') walk(p, depth + 1); } };
  dirs.push(OWN);
  for (const day of ['nov17', 'nov16', 'nov15', 'nov14', 'nov13', 'nov12']) walk(path.join(SP, day), 0);
  for (const d of dirs) { let fl = []; try { fl = fs.readdirSync(d); } catch (e) { } for (const f of fl) if (f.endsWith('.json')) {
    try { const m = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')); const b = path.join(d, f.slice(0, -5) + '.b');
      if (m && m.u && fs.existsSync(b) && !CACHE.has(m.u)) CACHE.set(m.u, { meta: m, file: b, body: null }); } catch (e) { } } }
})();
const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive', 'alt-svc', 'set-cookie', 'report-to', 'nel']);
function cached(u, O) { const c = CACHE.get(u); if (!c) return null; if (!c.body) c.body = fs.readFileSync(c.file);
  const h = {}; for (const k in (c.meta.headers || {})) if (!DROP.has(k.toLowerCase())) h[k.toLowerCase()] = String(c.meta.headers[k]);
  if (!h['access-control-allow-origin']) h['access-control-allow-origin'] = '*';
  else if (O && h['access-control-allow-origin'] !== '*') h['access-control-allow-origin'] = O;
  return { status: c.meta.status || 200, headers: h, body: c.body }; }
function keep(u, status, headers, body) { const k = path.join(OWN, sha(u, 40)); const hd = {}; for (const x in headers) if (!DROP.has(x.toLowerCase())) hd[x] = headers[x];
  fs.writeFileSync(k + '.b', body); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers: hd })); CACHE.set(u, { meta: { u, status, headers: hd }, file: k + '.b', body }); }

const MS_URL = 'https://static.memberstack.com/scripts/v2/memberstack.js';
const MS_BODY = (() => { const find = "i.A.appFetchFailed&&n.push(\"[data-ms-content]:not([data-ms-content^='!'])\")";
  const b = fs.readFileSync(path.join(SP, 'nov12/fonts/review/ms.js'), 'utf8'); if (b.split(find).length !== 2) throw new Error('memberstack patch point not found'); return b.replace(find, 'void 0'); })();
/* signed-in stand-in (from the adversarial lab): a member is answered after `delay` ms. No name, a made-up address. */
function msStub(delay) { return '(function(){var M={id:"mem_regr_test",verified:true,auth:{email:"reader@example.com",hasPassword:true,providers:[]},customFields:{},metaData:{},permissions:[],planConnections:[],createdAt:"2026-01-01T00:00:00.000Z"};' +
  'var DELAY=' + (+delay || 0) + ';function later(v){return new Promise(function(r){setTimeout(function(){r(v);},DELAY);});}' +
  'var api={getCurrentMember:function(){return later({data:M});},getMemberJSON:function(){return later({data:{}});},getApp:function(){return later({data:{id:"app_regr",plans:[],contentGroups:[]}});},' +
  'onAuthChange:function(cb){setTimeout(function(){try{cb(M);}catch(e){}},DELAY);return {unsubscribe:function(){}};},getMemberCookie:function(){return "regr";}};' +
  'window.$memberstackDom=new Proxy(api,{get:function(t,k){if(k in t)return t[k];if(typeof k!=="string"||k==="then")return undefined;return function(){return later({data:null});};}});window.$memberstackReady=true;})();'; }
/* consent stub (from the 16.66.0 regression check): GDPR applies, message shown, no answer ('deny') or full consent after 3 s ('grant') */
const CMP = mode => `(function(){var L=[];window.__tcfapi=function(c,v,cb){if(c==='addEventListener'){L.push(cb);cb({gdprApplies:true,cmpStatus:'loaded',eventStatus:'cmpuishown',purpose:{consents:{},legitimateInterests:{}}},true);}};
window.__cmpShown=performance.now();${mode === 'grant' ? "setTimeout(function(){window.__granted=performance.now();var p={1:true,2:true,3:true,4:true,7:true,8:true};L.forEach(function(cb){cb({gdprApplies:true,cmpStatus:'loaded',eventStatus:'useractioncomplete',purpose:{consents:p,legitimateInterests:{}}},true);});},3000);" : ''}})();`;
const RE_WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const RE_SITE = /^https:\/\/(www\.thatlayover\.life|thatlayover\.life|that-layover-life\.webflow\.io)(\/|$)/i;
const RE_ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com|adtrafficquality\.google|google\.com\/pagead|google\.com\/recaptcha/;
const RE_OURGIT = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@([0-9a-f]{40})\/([^?#]+)$/i;
const RE_GF = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
const MEDIA = /\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|mov|m4v|woff2?|ttf|otf|eot|ico)(\?|$)/i;
const GIT = new Map();
function git(shaFull, p) { const k = shaFull + ':' + p; if (GIT.has(k)) return GIT.get(k); let b = null;
  try { b = cp.execFileSync('git', ['-C', REPO, 'show', k], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { }
  GIT.set(k, b); return b; }
const ctype = p => /\.css$/.test(p) ? 'text/css; charset=utf-8' : /\.json$/.test(p) ? 'application/json' : /\.svg$/.test(p) ? 'image/svg+xml' : 'application/javascript; charset=utf-8';
const NETLOG = path.join(D, 'results', 'net.json');
const net = fs.existsSync(NETLOG) ? JSON.parse(fs.readFileSync(NETLOG, 'utf8')) : { docBytes: 0, docN: 0, copyN: 0, wfBytes: 0, wfFetched: [], thirdBytes: {}, thirdFetched: [], wfMediaAborted: {} };
const saveNet = () => fs.writeFileSync(NETLOG, JSON.stringify(net, null, 1));
const BUDGET = 110e6; /* this check's own limit for Webflow hosts, counted high: documents taken with route.fetch count their unpacked size */

/* ---------------- in-page code ---------------- */
function INIT() {
  if (window.top !== window) return;
  const T = window.__J = { sh: [], lcp: [], fcp: null, fp: null, dcl: null, loadT: null, holds: [], wait: {}, ph: { seen: null, gone: null }, t0: performance.timeOrigin };
  const one = n => { if (!n) return 'null'; if (n.nodeType !== 1) return '#' + n.nodeName; let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id;
    const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  const trail = n => { const a = []; for (let k = 0; n && n.nodeType === 1 && k < 4 && n !== document.body; k++, n = n.parentElement) a.unshift(one(n)); return a.join('>'); };
  const rr = r => [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.sh.push({ v: e.value, t: Math.round(e.startTime), inp: e.hadRecentInput ? 1 : 0, rs: document.readyState,
    src: (e.sources || []).slice(0, 4).map(s => [trail(s.node), rr(s.previousRect), rr(s.currentRect)]) }); }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { T.err = String(e); }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.lcp.push([Math.round(e.startTime), e.size, trail(e.element)]); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) { if (e.name === 'first-contentful-paint') T.fcp = Math.round(e.startTime); if (e.name === 'first-paint') T.fp = Math.round(e.startTime); } }).observe({ type: 'paint', buffered: true }); } catch (e) { }
  document.addEventListener('DOMContentLoaded', () => { T.dcl = Math.round(performance.now()); }, true);
  window.addEventListener('load', () => { T.loadT = Math.round(performance.now()); });
  window.addEventListener('pageshow', e => { T.persisted = e.persisted ? 1 : 0; });
  const isHold = n => n.nodeType === 1 && n.tagName === 'STYLE' && /^tll-(fp|es)-|^tll-story-st3-early-v1$/.test(n.id || '') ? n.id : null;
  const chk = () => { const now = Math.round(performance.now());
    for (const a of ['data-tll-mg-wait-r', 'data-tll-mg-wait-d', 'data-tll-es-ghost', 'data-tll-es-nav']) { const on = !!document.querySelector('[' + a + ']'); const w = T.wait[a] || (T.wait[a] = [null, null]); if (on && w[0] == null) w[0] = now; if (!on && w[0] != null && w[1] == null) w[1] = now; }
    const n = document.querySelectorAll('[data-tll-mg-flags]').length; if (n && T.ph.seen == null) T.ph.seen = now; if (!n && T.ph.seen != null && T.ph.gone == null) T.ph.gone = now;
    const sb = document.querySelectorAll('.tllmm-btn[aria-hidden]').length; const w = T.wait.standIn || (T.wait.standIn = [null, null]); if (sb && w[0] == null) w[0] = now; if (!sb && w[0] != null && w[1] == null) w[1] = now; };
  try { const hm = new MutationObserver(recs => { for (const r of recs) { for (const n of r.addedNodes) { const id = isHold(n); if (id) T.holds.push([id, '+', Math.round(performance.now())]); }
      for (const n of r.removedNodes) { const id = isHold(n); if (id) T.holds.push([id, '-', Math.round(performance.now())]); } } chk(); });
    hm.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-tll-mg-wait-r', 'data-tll-mg-wait-d', 'data-tll-mg-flags', 'data-tll-es-ghost', 'data-tll-es-nav', 'aria-hidden'] }); } catch (e) { T.holdErr = String(e); }
  document.addEventListener('DOMContentLoaded', chk, true);
  let seed = 12345; Math.random = function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
}
function PROBE() {
  const T = window.__J || { sh: [], lcp: [], holds: [], wait: {}, ph: {}, none: 1 }, sy = window.scrollY;
  const one = n => { let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).sort() : []; return c.length ? s + '.' + c.join('.') : s; };
  const boxes = [], tboxes = [];
  for (const n of document.querySelectorAll('body *')) { if (!n.getClientRects().length) continue; const b = n.getBoundingClientRect();
    const s = [Math.round(b.left), Math.round(b.top + sy), Math.round(b.width), Math.round(b.height)].join(','); boxes.push(s); tboxes.push(one(n) + ' ' + s); }
  const left = [];
  for (const s of document.querySelectorAll('style')) if (/^tll-(fp|es)-|^tll-story-st3-early-v1$/.test(s.id || '')) left.push('style#' + s.id);
  for (const n of document.querySelectorAll('html,body,body *')) for (const a of n.attributes) if (/^data-tll-(es|fp|mg-wait|mg-flags|hold)/.test(a.name)) left.push(a.name);
  if (document.querySelectorAll('.tllmm-btn[aria-hidden]').length) left.push('menu-stand-in');
  const hidHero = [].filter.call(document.querySelectorAll('.tll-story-hero *'), n => getComputedStyle(n).visibility === 'hidden' && n.getClientRects().length).length;
  const vis = s => [].filter.call(document.querySelectorAll(s), n => n.getClientRects().length && getComputedStyle(n).visibility !== 'hidden').length;
  const sel = { nav: vis('nav.tll-nav-v1'), menuBtn: vis('.tll-nav-v1 .tllmm-btn'), rail: vis('.a3-rail'), tabs: vis('.a3-tab'), ph: vis('.a3-ph'), mbar: vis('.tll-mbar'), members: vis('[data-ms-content="members"]'), anon: vis('[data-ms-content="anonymous"]'),
    forms: vis('form'), mapBar: vis('#tll-map-layers .tllm-bar'), mapBoot: (document.getElementById('tllm-boot') || {}).textContent || '', cards: vis('.tll-lib-grid .w-dyn-item'), menuOpen: (document.querySelector('.tll-nav-v1') || { classList: { contains() { return false; } } }).classList.contains('tllmm-open') ? 1 : 0 };
  const ae = document.activeElement; const nav = performance.getEntriesByType('navigation')[0];
  const vimg = [].filter.call(document.images, i => i.getClientRects().length);
  return { T, boxes: boxes.join('\n'), tboxes: tboxes.join('\n'), left, hidHero, sel,
    text: (document.body.innerText || '').replace(/\s+/g, ' ').trim(),
    htmlClass: (document.documentElement.className || '').trim().split(/\s+/).filter(Boolean).sort().join(' '),
    docH: document.documentElement.scrollHeight, sy, vw: innerWidth, vh: innerHeight, now: Math.round(performance.now()), timeOrigin: performance.timeOrigin,
    navType: nav ? nav.type : null, focus: ae ? one(ae) : 'none', consent: window.__tllConsent ? JSON.stringify(window.__tllConsent) : null, cmpT: [window.__cmpShown || null, window.__granted || null],
    imgVis: vimg.length, imgBad: vimg.filter(i => !(i.complete && i.naturalWidth > 0)).length, url: location.pathname + location.search,
    selfDoc: typeof window.tllSelfDoc, coreTag: [].map.call(document.querySelectorAll('script[src*="tll-site-layers-v16.js"]'), s => ((s.src.match(/@([0-9a-f]{40})/) || [])[1] || '?').slice(0, 8) + ' ' + (s.integrity || 'nosri').slice(0, 15)).join('|') };
}
const UA_PHONE = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
const UA_DESK = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

function othersRunning(own) {
  let out = ''; try { out = cp.execSync('ps -eo pid,ppid,comm,args --no-headers', { encoding: 'utf8', maxBuffer: 1 << 24 }); } catch (e) { return []; }
  const rows = out.split('\n').map(l => l.trim().split(/\s+/)).filter(a => a.length > 3).map(a => ({ pid: +a[0], ppid: +a[1], comm: a[2], args: a.slice(3).join(' ') }));
  const par = new Map(rows.map(r => [r.pid, r.ppid])); const mine = p => { for (let k = 0; p && k < 30; k++) { if (p === own) return true; p = par.get(p); } return false; };
  return rows.filter(r => /chrom|headless_shell/i.test(r.comm) && !mine(r.pid)).map(r => r.pid + ' ' + r.comm);
}

async function oneLoad(browser, set, s, host, i) {
  const o = s.opts || {}, phone = s.w < 800, pathn = PAGES[s.page], O = HOST[host], BW = 1600 * 1000 / 8;
  const st = { nonGet: 0, ads: [], hit: 0, git: [], docN: 0, copyN: 0, docBytes: 0, navAborted: [], aborted: [], wfMedia: [], net: [], kept: [], errs: [], cons: [], failed: [], core: [], scriptBad: [], hooked: [], realReq: null };
  const ctx = await browser.newContext(Object.assign({ viewport: { width: s.w, height: s.h }, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 3 : 1, userAgent: phone ? UA_PHONE : UA_DESK }, o.ctx || {}));
  await ctx.addInitScript(INIT);
  if (o.ms === 'in') await ctx.addInitScript(() => { try { localStorage.setItem('_ms-mid', 'regr-test'); } catch (e) { } });
  let pgObj = null, pipe = 0; const T0 = Date.now();
  const wire = async n => { if (!o.slow) return; const now = Date.now(); const start = Math.max(now + 150, pipe); pipe = start + (n || 0) / BW * 1000; await sleep(pipe - now); };
  const ful = async (route, r) => { await wire(r.body ? r.body.length : 0); return route.fulfill(r); };
  await ctx.route('**/*', async route => {
    const q = route.request(), u = q.url(), ty = q.resourceType();
    try {
      if (q.method() !== 'GET') { st.nonGet++; return route.abort(); }
      if (/^(data|blob|about):/.test(u)) return route.continue();
      for (const f of (o.fail || [])) if (f.re.test(u)) { st.hooked.push(f.mode + ':' + mask(u).replace(/^https?:\/\/[^/]+\//, '').slice(-60));
        if (f.mode === '404') return ful(route, { status: 404, headers: { 'content-type': 'text/plain', 'access-control-allow-origin': '*' }, body: 'not found' });
        if (f.mode === 'throw') return ful(route, { status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: 'throw new Error("regr: forced throw");' }); }
      if (RE_ADS.test(u)) {
        if (o.cmp && /fundingchoicesmessages/.test(u)) { st.ads.push([Date.now() - T0, 'cmp-stub']); return ful(route, { status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: CMP(o.cmp) }); }
        st.ads.push([Date.now() - T0, new URL(u).host + new URL(u).pathname.slice(0, 30)]);
        return ful(route, { status: 200, headers: { 'content-type': /\.js(\?|$)|gtag\/js|\/js\?/.test(u) ? 'application/javascript' : 'text/plain', 'access-control-allow-origin': '*' }, body: '' }); }
      if (RE_SITE.test(u)) { const pu = new URL(u), pth = pu.pathname.replace(/\/+$/, '') || '/';
        if (q.isNavigationRequest()) {
          if (q.frame() !== pgObj.mainFrame()) { st.navAborted.push('frame:' + mask(pu.host + pu.pathname).slice(0, 60)); return route.abort(); }
          if (pu.origin === O && pth === pathn && !st.docN) { st.docN++; /* the one real navigation */
            if (!o.html && !o.slow) { st.realReq = q; return route.continue(); }
            const r = await route.fetch(); let body = await r.text(); const hd = r.headers();
            st.docRaw = body.length; st.docBytes += (+hd['content-length'] || zlib.gzipSync(body).length) + 800; st.docStatus = r.status(); /* from 12:15 UTC: wire size estimated as the gzip size (before: unpacked size) */
            if (o.html) { const b2 = o.html(body); st.htmlMod = b2.length - body.length; body = b2; }
            await wire(Math.round(body.length / 4)); /* the document's share of the pipe: compressed size, about a quarter */
            return route.fulfill({ status: r.status(), headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body }); }
          const cp_ = COPY[host + ' ' + pth];
          if (pu.origin === O && cp_) { st.copyN++; const body = fs.readFileSync(cp_); await wire(Math.round(body.length / 4)); return route.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body }); }
          st.navAborted.push(mask(pu.host + pu.pathname).slice(0, 60)); return route.abort(); }
        const cp_ = COPY[host + ' ' + pth];
        if (pu.origin === O && cp_ && !pu.search) return ful(route, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: fs.readFileSync(cp_) });
        const c = cached(u, O); if (c) { st.hit++; return ful(route, c); }
        st.aborted.push(mask('site:' + ty + ':' + pu.host + pu.pathname + (pu.search ? '?' : '')).slice(0, 90)); return route.abort(); }
      if (u === MS_URL) return ful(route, { status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: o.ms === 'in' ? msStub(o.msDelay) : MS_BODY });
      const g = RE_OURGIT.exec(u); if (g) { const b = git(g[1], g[2]); if (b) { st.git.push(g[1].slice(0, 8) + ':' + g[2].replace(/^.*\//, '')); return ful(route, { status: 200, headers: { 'content-type': ctype(g[2]), 'access-control-allow-origin': '*' }, body: b }); }
        st.git.push('miss ' + g[1].slice(0, 8) + ':' + g[2].replace(/^.*\//, '')); }
      const c = cached(u, O);
      if (c) { st.hit++; return ful(route, c); }
      if (RE_WF.test(u) || RE_GF.test(u)) {
        if (ty === 'image' || ty === 'media' || ty === 'font' || MEDIA.test(u.split('?')[0])) { st.wfMedia.push(u.replace(/^.*\//, '').slice(-70)); net.wfMediaAborted[u] = (net.wfMediaAborted[u] || 0) + 1; return route.abort(); }
        if (net.docBytes + net.wfBytes > BUDGET) { st.aborted.push('budget:' + u.slice(0, 80)); return route.abort(); }
        const r = await route.fetch(); const body = await r.body(); keep(u, r.status(), r.headers(), body); net.wfBytes += body.length; net.wfFetched.push([u.slice(0, 140), body.length]); saveNet(); st.kept.push('wf:' + u.slice(-60));
        return ful(route, cached(u, O)); }
      if (/memberstack|challenges\.cloudflare\.com/.test(u)) { if (o.ms === 'in' && /memberstack/.test(u)) { st.aborted.push('ms-in:' + new URL(u).host); return route.abort(); } st.net.push(new URL(u).host); await wire(2000); return route.continue(); }
      if (o.ms === 'in') { st.aborted.push('in-uncached:' + new URL(u).host); return route.abort(); } /* signed in: nothing uncached is fetched */
      const r = await route.fetch(); const body = await r.body(); keep(u, r.status(), r.headers(), body);
      const h = new URL(u).host; net.thirdBytes[h] = (net.thirdBytes[h] || 0) + body.length; net.thirdFetched.push(h + ' ' + body.length); saveNet(); st.kept.push(h);
      return ful(route, cached(u, O));
    } catch (e) { st.failed.push(String(e).slice(0, 80)); try { await route.abort(); } catch (e2) { } }
  });
  pgObj = await ctx.newPage();
  if (o.slow) { const cdp = await ctx.newCDPSession(pgObj); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
  let tl = null; if (o.ctx && o.ctx.javaScriptEnabled === false) { tl = []; const cdp = await ctx.newCDPSession(pgObj); cdp.on('PerformanceTimeline.timelineEventAdded', e => { const x = e.event; if (x && x.layoutShiftDetails) tl.push([+x.layoutShiftDetails.value.toFixed(6), x.layoutShiftDetails.hadRecentInput ? 1 : 0]); }); await cdp.send('PerformanceTimeline.enable', { eventTypes: ['layout-shift'] }); }
  pgObj.on('pageerror', e => st.errs.push(mask(String(e && e.message || e)).slice(0, 160)));
  pgObj.on('console', m => { if (m.type() === 'error') st.cons.push(mask(m.text()).replace(/https?:\/\/(www\.thatlayover\.life|that-layover-life\.webflow\.io)/g, 'ORIGIN').slice(0, 120)); });
  pgObj.on('requestfinished', async r => { try { if (r === st.realReq) { const z = await r.sizes(); st.docBytes += z.responseBodySize + z.responseHeadersSize; } } catch (e) { } });
  pgObj.on('response', r => { const u = r.url(); const m = /thatlayoverlife@([0-9a-f]{40})\/src\/site-layers\/tll-site-layers-v16\.js/.exec(u); if (m) st.core.push(m[1].slice(0, 8) + ':' + r.status());
    if (r.request().resourceType() === 'script' && r.status() >= 400) st.scriptBad.push(r.status() + ' ' + mask(u).slice(0, 120)); });
  pgObj.on('requestfailed', r => { if (r.resourceType() === 'script') st.scriptBad.push('failed ' + mask(r.url()).slice(0, 120) + ' ' + ((r.failure() || {}).errorText || '')); });
  const rec = { set, cell: s.id, page: s.page, w: s.w, h: s.h, host, i, at: new Date().toISOString(), stages: [] };
  const L = { O, PAGES, probe: async (page, stage) => {
    const x = await page.evaluate(PROBE);
    const sh = (x.T.sh || []).map(e => ({ v: +e.v.toFixed(6), t: e.t, inp: e.inp, rs: (e.rs || '?')[0], src: e.src }));
    const id = [set, s.id, host, i, stage].join('-');
    fs.writeFileSync(path.join(D, 'boxes', id + '.tbox.gz'), zlib.gzipSync(x.tboxes));
    return { stage, cls: +sh.reduce((a, e) => a + e.v, 0).toFixed(5), clsNI: +sh.filter(e => !e.inp).reduce((a, e) => a + e.v, 0).toFixed(5), nSh: sh.length, sh,
      fcp: x.T.fcp, lcp: x.T.lcp && x.T.lcp.length ? x.T.lcp[x.T.lcp.length - 1][0] : null, dcl: x.T.dcl, loadT: x.T.loadT, now: x.now, timeOrigin: x.timeOrigin, navType: x.navType, persisted: x.T.persisted,
      holds: x.T.holds, wait: x.T.wait, left: x.left, hidHero: x.hidHero, sel: x.sel, focus: x.focus, consent: x.consent, cmpT: x.cmpT,
      boxHash: sha(x.boxes), tboxHash: sha(x.tboxes), textHash: sha(x.text), nBox: x.boxes.split('\n').length, docH: x.docH, sy: x.sy, vw: x.vw, vh: x.vh, htmlClass: x.htmlClass,
      imgVis: x.imgVis, imgBad: x.imgBad, url: mask(x.url), selfDoc: x.selfDoc, coreTag: x.coreTag, noInit: x.T.none ? 1 : 0 }; } };
  try {
    await (s.flow || plainFlow)(pgObj, s, rec, L);
    rec.ok = 1;
    if (tl) rec.tl = tl;
  } catch (e) { rec.ok = 0; rec.fail = mask(String(e)).slice(0, 200); }
  Object.assign(rec, { core: st.core, git: [...new Set(st.git)].sort(), docN: st.docN, copyN: st.copyN, docBytes: st.docBytes, docStatus: st.docStatus, docRaw: st.docRaw, htmlMod: st.htmlMod, nonGet: st.nonGet, ads: st.ads, hit: st.hit, hooked: [...new Set(st.hooked)],
    navAborted: st.navAborted, aborted: st.aborted.slice(0, 30), abortedN: st.aborted.length, wfMedia: st.wfMedia.slice(0, 20), wfMediaN: st.wfMedia.length, net: [...new Set(st.net)], kept: st.kept,
    errs: st.errs.slice(0, 8), errN: st.errs.length, cons: [...new Set(st.cons)].slice(0, 10), consN: st.cons.length, scriptBad: st.scriptBad.slice(0, 8), routeFail: st.failed.slice(0, 4) });
  net.docBytes += st.docBytes; net.docN += st.docN; net.copyN = (net.copyN || 0) + st.copyN; saveNet();
  await ctx.close();
  return rec;
}

(async () => {
  const P = plan(SET), OUT = path.join(D, 'results', SET + '.jsonl');
  const done = new Set(); if (fs.existsSync(OUT)) for (const l of fs.readFileSync(OUT, 'utf8').split('\n')) if (l.trim()) { try { const r = JSON.parse(l); if (r.ok) done.add([r.cell, r.host, r.i].join('|')); } catch (e) { } }
  let browser = null, waits = 0, n = 0, ci = 0;
  const free = () => { try { return +cp.execSync('df -k --output=avail /tmp | tail -1', { encoding: 'utf8' }).trim() / 1048576; } catch (e) { return 99; } };
  const R = Math.max(...P.map(c => c.rounds));
  for (let i = 0; i < R; i++) for (const s of P) {
    if (i >= s.rounds) continue;
    const order = (i + ci++) % 2 ? ['test', 'www'] : ['www', 'test'];
    for (const host of order) {
      if (done.has([s.id, host, i].join('|'))) continue;
      if (free() < 2) { console.log('STOP: disk under 2 GB'); if (browser) await browser.close(); return; }
      if (net.docBytes + net.wfBytes > BUDGET) { console.log('STOP: Webflow budget'); if (browser) await browser.close(); return; }
      if (!browser || n % 30 === 29) { if (browser) await browser.close(); browser = await chromium.launch(LAUNCH); }
      let rec = null;
      for (let t = 0; t < 3; t++) {
        for (let k = 0; k < 240; k++) { const o = othersRunning(process.pid); if (!o.length) break; waits++; if (k === 0) console.log('waiting for another browser: ' + o.slice(0, 2).join('; ')); await sleep(5000); }
        rec = await oneLoad(browser, SET, s, host, i);
        rec.othersAfter = othersRunning(process.pid).length; rec.tries = t + 1;
        if (rec.ok && !rec.othersAfter) break;
        console.log('again ' + s.id + ' ' + host + ' ' + i + ': ' + (rec.ok ? 'another browser appeared' : rec.fail));
        if (!rec.ok) { try { await browser.close(); } catch (e) { } browser = await chromium.launch(LAUNCH); }
      }
      fs.appendFileSync(OUT, JSON.stringify(rec) + '\n'); n++;
      const e = rec.stages[rec.stages.length - 1] || {};
      console.log([new Date().toISOString().slice(11, 19), SET, s.id, host, i, rec.ok ? rec.stages.map(x => x.stage + ' ' + x.cls + '/' + x.clsNI).join(' ; ') + ' fcp ' + e.fcp + ' box ' + (e.boxHash || '').slice(0, 6) + ' core ' + rec.core.join(',') + ' left ' + (e.left || []).join(',') + ' ab ' + rec.abortedN + '/' + rec.wfMediaN + ' err ' + rec.errN + ' ads ' + rec.ads.length + ' doc ' + rec.docBytes + '+' + rec.copyN : 'FAILED ' + rec.fail].join(' '));
    }
  }
  if (browser) await browser.close();
  saveNet(); console.log('DONE set ' + SET + ': ' + n + ' loads, waits ' + waits + ', Webflow doc bytes ' + net.docBytes + ' (' + net.docN + ' navs, ' + net.copyN + ' copies), wf other ' + net.wfBytes);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
