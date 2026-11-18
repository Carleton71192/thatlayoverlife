/* Release 16.68.0 behavior check, page loads (18 Nov 2026): the REAL test site (that-layover-life.webflow.io, core 16.68.0, pin 0f04fabf)
   against REAL www (www.thatlayover.life, core 16.67.0, pin a254306f). Copied from the 16.67.0 check (release-16.67.0-check/behavior/harness/b.cjs);
   only the folder, pins, page list and sets changed. Same-origin copies: the 16.68.0 carry check's plain GETs (18 Nov 09:36 UTC). Independent, read only.
   Derived from the 16.66.0 behavior check (nov15/check1666-behavior h.cjs) and the 16.67.0 measure judge (nov16/judge-measure, recheck1/harness/jm.cjs).
   - The main document of every load is one real navigation to the real host (route.continue). Any other navigation of the top frame is aborted.
   - Every non-GET is aborted. Ads and analytics are answered with an empty body on both hosts.
   - Same-origin non-navigation GETs for the checked paths: this checker's plain-GET copy of the same host (html/<host>/).
   - jsDelivr files of our repo (core and chunks, at the pin the page asks for): `git show <pin>:<path>`, byte equal to what jsDelivr serves
     (carry check: 26 of 26 files; the cores match the release SRIs, so the browser's SRI check runs for real).
   - Webflow-host and Google font files: local caches of the earlier checks. A miss for an image, video or font is aborted, never fetched.
     A css/js/json miss would be fetched once and kept (counted). Other third-party GETs: cache, else fetched once and kept (replayed after).
   - Memberstack served patched (no hiding when its aborted app POST fails), as in the earlier checks (signed out). challenges.cloudflare.com goes to the network.
   - Math.random seeded the same on both hosts. One browser at a time; results appended per load; finished loads are skipped.
   Usage: NODE_PATH=/opt/node22/lib/node_modules node b.cjs <set>   set = smoke | P */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), zlib = require('zlib'), cp = require('child_process');
const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const D = path.join(SP, 'nov18/check1668-behavior'), REPO = '/home/user/thatlayoverlife';
const SET = process.argv[2] || 'smoke';
const HOST = { www: 'https://www.thatlayover.life', test: 'https://that-layover-life.webflow.io' };
const PIN = { www: 'a254306f6c62a79f314754d24b44041d61be716d', test: '0f04fabf403d5c61d1e1f4ff8d850c493a9de62f' };
const PROFILE = fs.readFileSync(path.join(SP, 'nov16/survey/profile-path.txt'), 'utf8').trim();
const PAGES = { travelers: '/travelers', map: '/the-map', expats: '/for-expats', about: '/about', account: '/account', submit: '/submit', profile: PROFILE, stories: '/stories',
  home: '/', layovers: '/layovers', login: '/login', balkans: '/stories/balkans-ev-road-trip-twelve-countries', lisbon: '/stories/lisbon-sun-sails-city-built-to-stand-back-up', safrica: '/stories/southern-africa-safari' };
/* plain-GET copies by path (file names from the carry check) */
const COPY = {};
for (const h of ['www', 'test']) for (const f of fs.readdirSync(path.join(D, 'html', h))) { if (!f.endsWith('.html')) continue; const k = f.slice(0, -5);
  const p = k === 'home' ? '/' : k === 'profile' ? PROFILE : '/' + k.replace(/__/g, '/'); COPY[h + ' ' + p] = path.join(D, 'html', h, f); }
const SIZES = { 360: [360, 780], 390: [390, 844], 1440: [1440, 900] };
const CHANGED = ['travelers', 'map', 'expats', 'about', 'account', 'submit', 'profile', 'stories'];
function plan(set) {
  const cells = [];
  if (set === 'A') { for (const p of CHANGED) for (const w of [390, 1440]) cells.push([p, w]); return { cells, rounds: 5 }; }
  if (set === 'B') { for (const p of ['travelers', 'map', 'stories']) cells.push([p, 360]); return { cells, rounds: 5 }; }
  /* follow-up: cells where test FCP was 50 ms or more over www in set A; navigation timing now recorded, so FCP after the document is in can be compared */
  if (set === 'F') return { cells: [['map', 1440], ['expats', 390], ['account', 1440], ['stories', 1440], ['travelers', 390], ['about', 1440]], rounds: 6 };
  /* follow-up: which images are on the screen list but not drawn, where the count differed by host in set A (profile 390, /stories 1440) */
  if (set === 'G') return { cells: [['profile', 390], ['stories', 1440]], rounds: 3 };
  /* follow-up 2: /about 1440 first paint read later on test in all 6 pairs of set F (earlier in 4 of 5 in set A); more pairs, with two neighbours */
  if (set === 'H') return { cells: [['about', 1440], ['about', 390], ['submit', 1440]], rounds: 8 };
  if (set === 'P') { for (const p of ['home', 'stories', 'travelers', 'map', 'balkans', 'lisbon']) for (const w of [390, 1440]) cells.push([p, w]); return { cells, rounds: 3 }; }
  if (set === 'C') { for (const p of ['home', 'layovers', 'login', 'balkans', 'lisbon', 'safrica']) for (const w of [390, 1440]) cells.push([p, w]); return { cells, rounds: 3 }; }
  return { cells: [['home', 390]], rounds: 1 };
}
const sha = (b, n) => crypto.createHash('sha1').update(b).digest('hex').slice(0, n || 12);
const mask = s => String(s).replace(/contributors\/[^/?#\s"']+/g, 'contributors/<profile>').replace(/gh\/[^/]+\/thatlayoverlife/g, 'gh/OWNER/thatlayoverlife');

/* ---- local caches (earlier checks) plus this checker's own folder ---- */
const OWN = path.join(D, 'cache'); fs.mkdirSync(OWN, { recursive: true });
const CACHE = new Map();
(function scan() {
  const dirs = [];
  const walk = (d, depth) => { let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (e) { return; }
    for (const e of ents) if (e.isDirectory()) { const p = path.join(d, e.name);
      if (/cache/i.test(e.name)) dirs.push(p); else if (depth < 4 && e.name !== 'node_modules' && e.name !== 'wt' && e.name !== 'build') walk(p, depth + 1); } };
  dirs.push(OWN);
  for (const day of ['nov18', 'nov17', 'nov16', 'nov15', 'nov14', 'nov13', 'nov12']) walk(path.join(SP, day), 0);
  for (const d of dirs) { let fl = []; try { fl = fs.readdirSync(d); } catch (e) { } for (const f of fl) if (f.endsWith('.json')) {
    try { const m = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')); const b = path.join(d, f.slice(0, -5) + '.b');
      if (m && m.u && fs.existsSync(b) && !CACHE.has(m.u)) CACHE.set(m.u, { meta: m, file: b, body: null }); } catch (e) { } } }
})();
const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive', 'alt-svc', 'set-cookie', 'report-to', 'nel']);
function cached(u, O) { const c = CACHE.get(u); if (!c) return null; if (!c.body) c.body = fs.readFileSync(c.file);
  const h = {}; for (const k in (c.meta.headers || {})) if (!DROP.has(k.toLowerCase())) h[k.toLowerCase()] = String(c.meta.headers[k]);
  if (!h['access-control-allow-origin']) h['access-control-allow-origin'] = '*';
  else if (O && h['access-control-allow-origin'] !== '*') h['access-control-allow-origin'] = O; /* a kept answer that named one origin: the services echo the asking origin (Vary: Origin; checked for the travel-wire Worker with the test origin) */
  return { status: c.meta.status || 200, headers: h, body: c.body }; }
function keep(u, status, headers, body) { const k = path.join(OWN, sha(u, 40)); const hd = {}; for (const x in headers) if (!DROP.has(x.toLowerCase())) hd[x] = headers[x];
  fs.writeFileSync(k + '.b', body); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers: hd })); CACHE.set(u, { meta: { u, status, headers: hd }, file: k + '.b', body }); }

const MS_URL = 'https://static.memberstack.com/scripts/v2/memberstack.js';
const MS_BODY = (() => { const find = "i.A.appFetchFailed&&n.push(\"[data-ms-content]:not([data-ms-content^='!'])\")";
  const b = fs.readFileSync(path.join(SP, 'nov12/fonts/review/ms.js'), 'utf8'); if (b.split(find).length !== 2) throw new Error('memberstack patch point not found'); return b.replace(find, 'void 0'); })();
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
const net = fs.existsSync(NETLOG) ? JSON.parse(fs.readFileSync(NETLOG, 'utf8')) : { docBytes: 0, docN: 0, wfBytes: 0, wfFetched: [], thirdBytes: {}, thirdFetched: [], wfMediaAborted: {} };
const saveNet = () => fs.writeFileSync(NETLOG, JSON.stringify(net, null, 1));

/* ---- in-page code ---- */
function INIT() {
  if (window.top !== window) return;
  const T = window.__J = { sh: [], lcp: [], fcp: null, fp: null, dcl: null, loadT: null, holds: [], es: { added: null, removed: null }, wait: {}, ph: { seen: null, gone: null } };
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
  /* the sweep's head styles (tll-fp-*, tll-es-*) and the story holds: when they come and go */
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
  const T = window.__J, sy = window.scrollY;
  const one = n => { let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).sort() : []; return c.length ? s + '.' + c.join('.') : s; };
  const boxes = [], tboxes = [];
  for (const n of document.querySelectorAll('body *')) { if (!n.getClientRects().length) continue; const b = n.getBoundingClientRect();
    const s = [Math.round(b.left), Math.round(b.top + sy), Math.round(b.width), Math.round(b.height)].join(','); boxes.push(s); tboxes.push(one(n) + ' ' + s); }
  const left = [];
  for (const s of document.querySelectorAll('style')) if (/^tll-(fp|es)-|^tll-story-st3-early-v1$/.test(s.id || '')) left.push('style#' + s.id);
  for (const n of document.querySelectorAll('html,body,body *')) for (const a of n.attributes) if (/^data-tll-(es|fp|mg-wait|mg-flags|hold)/.test(a.name)) left.push(a.name);
  if (document.querySelectorAll('.tllmm-btn[aria-hidden]').length) left.push('menu-stand-in');
  const hidHero = [].filter.call(document.querySelectorAll('.tll-story-hero *'), n => getComputedStyle(n).visibility === 'hidden' && n.getClientRects().length).length;
  const tt = document.querySelector('.tll-travelers-title');
  const vis = [].filter.call(document.images, i => i.getClientRects().length);
  return { T, boxes: boxes.join('\n'), tboxes: tboxes.join('\n'), left, hidHero,
    text: (document.body.innerText || '').replace(/\s+/g, ' ').trim(),
    htmlClass: (document.documentElement.className || '').trim().split(/\s+/).filter(Boolean).sort().join(' '),
    menuBtn: document.querySelectorAll('.tllmm-btn').length, titleH: tt ? Math.round(tt.getBoundingClientRect().height) : null,
    docH: document.documentElement.scrollHeight, sy, now: Math.round(performance.now()), fontsN: [...document.fonts].filter(f => f.status === 'loaded').length,
    nav: (n => n ? [Math.round(n.responseStart), Math.round(n.responseEnd), n.transferSize] : null)(performance.getEntriesByType('navigation')[0]), undrawn: vis.filter(i => !(i.complete && i.naturalWidth > 0)).map(i => { const b = i.getBoundingClientRect(); let h = 5381; const t = i.currentSrc || i.src || ''; for (let k = 0; k < t.length; k++) h = ((h << 5) + h + t.charCodeAt(k)) >>> 0; return [h.toString(16), i.loading || '', Math.round(b.top + sy), Math.round(b.height), i.complete ? 1 : 0, (i.closest('[class]') || i).className.toString().split(' ')[0].slice(0, 30)]; }), imgVis: vis.length, imgBad: vis.filter(i => !(i.complete && i.naturalWidth > 0)).length, url: location.pathname,
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
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function oneLoad(browser, set, pg, w, host, i) {
  const [vw, vh] = SIZES[w], phone = w < 800, pathn = PAGES[pg], O = HOST[host];
  const st = { nonGet: 0, ads: 0, hit: 0, git: [], docN: 0, docBytes: 0, navAborted: [], aborted: [], wfMedia: [], net: [], kept: [], errs: [], cons: [], failed: [], core: [], scriptBad: [] };
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 3 : 1, userAgent: phone ? UA_PHONE : UA_DESK });
  await ctx.addInitScript(INIT);
  let pgObj = null;
  await ctx.route('**/*', async route => {
    const q = route.request(), u = q.url(), ty = q.resourceType();
    try {
      if (q.method() !== 'GET') { st.nonGet++; return route.abort(); }
      if (/^(data|blob|about):/.test(u)) return route.continue();
      if (RE_ADS.test(u)) { st.ads++; return route.fulfill({ status: 200, headers: { 'content-type': /\.js(\?|$)|gtag\/js|\/js\?/.test(u) ? 'application/javascript' : 'text/plain', 'access-control-allow-origin': '*' }, body: '' }); }
      if (RE_SITE.test(u)) { const pu = new URL(u);
        if (q.isNavigationRequest()) {
          if (pu.origin === O && q.frame() === pgObj.mainFrame() && pu.pathname === pathn && !st.docN) { st.docN++; return route.continue(); } /* the one real navigation */
          st.navAborted.push(mask(pu.host + pu.pathname).slice(0, 60)); return route.abort(); }
        const cp_ = COPY[host + ' ' + (pu.pathname.replace(/\/+$/, '') || '/')];
        if (pu.origin === O && cp_ && !pu.search) return route.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: fs.readFileSync(cp_) });
        const c = cached(u, O); if (c) { st.hit++; return route.fulfill(c); }
        st.aborted.push(mask('site:' + ty + ':' + pu.host + pu.pathname + (pu.search ? '?' : '')).slice(0, 90)); return route.abort(); }
      if (u === MS_URL) return route.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: MS_BODY });
      { const hh = new URL(u).host; /* release 16.68.0 rule: Memberstack APIs aborted; workers.dev and cloudinary.com only from the local caches (a kept GET answer), else aborted */
        if (/(^|\.)memberstack\.(com|io)$/.test(hh)) { st.aborted.push('ms:' + hh); return route.abort(); }
        if (/(^|\.)workers\.dev$|(^|\.)cloudinary\.com$/.test(hh)) { const c2 = cached(u, O); if (c2) { st.hit++; st.stubbed = (st.stubbed || 0) + 1; return route.fulfill(c2); } st.aborted.push('blocked:' + hh + new URL(u).pathname.slice(0, 30)); return route.abort(); } }
      const g = RE_OURGIT.exec(u); if (g) { const b = git(g[1], g[2]); if (b) { st.git.push(g[1].slice(0, 8) + ':' + g[2].replace(/^.*\//, '')); return route.fulfill({ status: 200, headers: { 'content-type': ctype(g[2]), 'access-control-allow-origin': '*' }, body: b }); }
        st.git.push('miss ' + g[1].slice(0, 8) + ':' + g[2].replace(/^.*\//, '')); } /* not in the local repo: cache, else fetched once and kept */
      const c = cached(u, O);
      if (c) { st.hit++; return route.fulfill(c); }
      if (RE_WF.test(u) || RE_GF.test(u)) {
        if (ty === 'image' || ty === 'media' || ty === 'font' || MEDIA.test(u.split('?')[0])) { st.wfMedia.push(u.replace(/^.*\//, '').slice(-70)); net.wfMediaAborted[u] = (net.wfMediaAborted[u] || 0) + 1; return route.abort(); }
        if (net.docBytes + net.wfBytes > 90e6) { st.aborted.push('budget:' + u.slice(0, 80)); return route.abort(); }
        const r = await route.fetch(); const body = await r.body(); keep(u, r.status(), r.headers(), body); net.wfBytes += body.length; net.wfFetched.push([u.slice(0, 140), body.length]); saveNet(); st.kept.push('wf:' + u.slice(-60));
        return route.fulfill(cached(u, O)); }
      if (/challenges\.cloudflare\.com/.test(u)) { st.net.push(new URL(u).host); return route.continue(); }
      const r = await route.fetch(); const body = await r.body(); keep(u, r.status(), r.headers(), body);
      const h = new URL(u).host; net.thirdBytes[h] = (net.thirdBytes[h] || 0) + body.length; net.thirdFetched.push(h + ' ' + body.length); saveNet(); st.kept.push(h);
      return route.fulfill(cached(u, O));
    } catch (e) { st.failed.push(String(e).slice(0, 80)); try { await route.abort(); } catch (e2) { } }
  });
  pgObj = await ctx.newPage();
  pgObj.on('pageerror', e => st.errs.push(mask(String(e && e.message || e)).slice(0, 160)));
  pgObj.on('console', m => { if (m.type() === 'error') st.cons.push(mask(m.text()).replace(/https?:\/\/(www\.thatlayover\.life|that-layover-life\.webflow\.io)/g, 'ORIGIN').slice(0, 120)); });
  pgObj.on('requestfinished', async r => { try { if (r.isNavigationRequest() && r.frame() === pgObj.mainFrame()) { const z = await r.sizes(); st.docBytes += z.responseBodySize + z.responseHeadersSize; } } catch (e) { } });
  pgObj.on('response', r => { const u = r.url(); const m = /thatlayoverlife@([0-9a-f]{40})\/src\/site-layers\/tll-site-layers-v16\.js/.exec(u); if (m) st.core.push(m[1].slice(0, 8) + ':' + r.status());
    if (r.request().resourceType() === 'script' && r.status() >= 400) st.scriptBad.push(r.status() + ' ' + mask(u).slice(0, 120)); });
  pgObj.on('requestfailed', r => { if (r.resourceType() === 'script') st.scriptBad.push('failed ' + mask(r.url()).slice(0, 120) + ' ' + ((r.failure() || {}).errorText || '')); });
  const rec = { set, page: pg, w, h: vh, host, i, at: new Date().toISOString() };
  try {
    const resp = await pgObj.goto(O + pathn, { waitUntil: 'load', timeout: 90000 });
    rec.status = resp ? resp.status() : null;
    const a = await pgObj.evaluate(() => [performance.now(), window.__J && window.__J.loadT]);
    const until = Math.max(5000, (a[1] || a[0]) + 4000); await sleep(Math.max(0, until - a[0]) + 50);
    const x = await pgObj.evaluate(PROBE);
    const sh = x.T.sh.map(s => ({ v: +s.v.toFixed(6), t: s.t, inp: s.inp, rs: s.rs[0], src: s.src }));
    const id = [set, pg, w, host, i].join('-');
    fs.writeFileSync(path.join(D, 'boxes', id + '.tbox.gz'), zlib.gzipSync(x.tboxes));
    Object.assign(rec, { ok: 1, cls: +sh.reduce((s, e) => s + e.v, 0).toFixed(5), clsNI: +sh.filter(e => !e.inp).reduce((s, e) => s + e.v, 0).toFixed(5), nSh: sh.length,
      fcp: x.T.fcp, fp: x.T.fp, lcp: x.T.lcp.length ? x.T.lcp[x.T.lcp.length - 1][0] : null, lcpEl: x.T.lcp.length ? x.T.lcp[x.T.lcp.length - 1].slice(1) : null,
      dcl: x.T.dcl, loadT: x.T.loadT, probeT: x.now, sh, holds: x.T.holds, wait: x.T.wait, ph: x.T.ph, left: x.left, hidHero: x.hidHero,
      boxHash: sha(x.boxes), tboxHash: sha(x.tboxes), textHash: sha(x.text), nBox: x.boxes.split('\n').length, docH: x.docH, sy: x.sy, htmlClass: x.htmlClass, menuBtn: x.menuBtn, titleH: x.titleH,
      fontsN: x.fontsN, nav: x.nav, undrawn: x.undrawn, imgVis: x.imgVis, imgBad: x.imgBad, endPath: x.url === pathn ? 'same' : mask(x.url), selfDoc: x.selfDoc, coreTag: x.coreTag });
  } catch (e) { rec.ok = 0; rec.fail = mask(String(e)).slice(0, 200); }
  Object.assign(rec, { core: st.core, git: [...new Set(st.git)].sort(), docN: st.docN, docBytes: st.docBytes, nonGet: st.nonGet, ads: st.ads, hit: st.hit, navAborted: st.navAborted, aborted: st.aborted.slice(0, 30), abortedN: st.aborted.length,
    wfMedia: st.wfMedia.slice(0, 20), wfMediaN: st.wfMedia.length, net: [...new Set(st.net)], kept: st.kept, errs: st.errs.slice(0, 8), errN: st.errs.length, cons: [...new Set(st.cons)].slice(0, 8), consN: st.cons.length, scriptBad: st.scriptBad.slice(0, 6), routeFail: st.failed.slice(0, 4) });
  net.docBytes += st.docBytes; net.docN += st.docN; saveNet();
  await ctx.close();
  return rec;
}

(async () => {
  const P = plan(SET), OUT = path.join(D, 'results', SET + '.jsonl');
  const done = new Set(); if (fs.existsSync(OUT)) for (const l of fs.readFileSync(OUT, 'utf8').split('\n')) if (l.trim()) { try { const r = JSON.parse(l); if (r.ok) done.add([r.page, r.w, r.host, r.i].join('|')); } catch (e) { } }
  let browser = null, waits = 0, n = 0, ci = 0;
  const free = () => { try { return +cp.execSync('df -k --output=avail /tmp | tail -1', { encoding: 'utf8' }).trim() / 1048576; } catch (e) { return 99; } };
  for (let i = 0; i < P.rounds; i++) for (const [pg, w] of P.cells) {
    const order = (i + ci++) % 2 ? ['test', 'www'] : ['www', 'test'];
    for (const host of order) {
      if (done.has([pg, w, host, i].join('|'))) continue;
      if (free() < 2) { console.log('STOP: disk under 2 GB'); if (browser) await browser.close(); return; }
      if (net.docBytes + net.wfBytes > 95e6) { console.log('STOP: Webflow budget'); if (browser) await browser.close(); return; }
      if (!browser || n % 40 === 39) { if (browser) await browser.close(); browser = await chromium.launch(); }
      let rec = null;
      for (let t = 0; t < 3; t++) {
        for (let k = 0; k < 240; k++) { const o = othersRunning(process.pid); if (!o.length) break; waits++; if (k === 0) console.log('waiting for another browser: ' + o.slice(0, 2).join('; ')); await sleep(5000); }
        rec = await oneLoad(browser, SET, pg, w, host, i);
        rec.othersAfter = othersRunning(process.pid).length; rec.tries = t + 1;
        if (rec.ok && !rec.othersAfter) break;
        console.log('again ' + pg + ' ' + w + ' ' + host + ' ' + i + ': ' + (rec.ok ? 'another browser appeared' : rec.fail));
        if (!rec.ok) { try { await browser.close(); } catch (e) { } browser = await chromium.launch(); }
      }
      fs.appendFileSync(OUT, JSON.stringify(rec) + '\n'); n++;
      console.log([new Date().toISOString().slice(11, 19), SET, pg, w, host, i, rec.ok ? 'cls ' + rec.cls + ' ni ' + rec.clsNI + ' fcp ' + rec.fcp + ' lcp ' + rec.lcp + ' box ' + rec.boxHash.slice(0, 6) + ' core ' + rec.core.join(',') + ' sd ' + rec.selfDoc + ' left ' + rec.left.join(',') + ' ab ' + rec.abortedN + '/' + rec.wfMediaN + ' err ' + rec.errN + ' doc ' + rec.docBytes : 'FAILED ' + rec.fail].join(' '));
    }
  }
  if (browser) await browser.close();
  saveNet(); console.log('DONE set ' + SET + ': ' + n + ' loads, waits ' + waits + ', Webflow doc bytes ' + net.docBytes + ' (' + net.docN + ' navs), wf other ' + net.wfBytes);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
