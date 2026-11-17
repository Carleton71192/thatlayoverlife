/* Re-check 1 copy of the judge-measure harness (17 Nov 2026): new = the repaired core (branch head 634b842), results under nov17/recheck1/jm.
   Judge-measure harness (independent; written for the 16.67.0 layout shift check, 17 Nov 2026).
   Usage: NODE_PATH=/home/user/thatlayoverlife/node_modules node jm.cjs <set> [cellFilter]
     set = std (5 rounds, all cells) | cpu (3 rounds, CPU 4x, the 16 cells the builders changed) | lay (15 rounds, /layovers 1440 only) | trav8 (one late look at /travelers 390) | smoke (1 round, a few cells)
   Two arms per cell, alternating first place by round: ctl = live 16.66.0 core from a local file, new = the rebuilt branch core.
   In both arms the www HTML (one plain GET per page, served from disk) has only the integrity attribute of the core tag removed.
   Rules kept: every non-GET aborted; Webflow-host files from the local caches or aborted (never fetched); ads and analytics get an
   empty answer; Memberstack served patched; Math.random seeded; one browser, one load at a time; results appended per load. */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), zlib = require('zlib'), cp = require('child_process');
const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const JM = path.join(SP, 'nov16/judge-measure'), J = path.join(SP, 'nov17/recheck1/jm'), REPO = '/home/user/thatlayoverlife';
const SET = process.argv[2] || 'smoke', FILTER = process.argv[3] ? new RegExp(process.argv[3]) : null;
const ORIGIN = 'https://www.thatlayover.life';
const PROFILE = fs.readFileSync(path.join(SP, 'nov16/survey/profile-path.txt'), 'utf8').trim();
const PAGES = {
  home: '/', stories: '/stories', travelers: '/travelers', layovers: '/layovers', map: '/the-map', expats: '/for-expats',
  paw: '/the-paw-passport', about: '/about', cookies: '/cookies', account: '/account', submit: '/submit', login: '/login',
  signup: '/signup', profile: PROFILE, balkans: '/stories/balkans-ev-road-trip-twelve-countries',
  lisbon: '/stories/lisbon-sun-sails-city-built-to-stand-back-up', safrica: '/stories/southern-africa-safari' };
const BYPATH = {}; for (const k in PAGES) BYPATH[PAGES[k]] = k;
const SIZES = { 360: [360, 780], 390: [390, 844], 1440: [1440, 900] };
const SURVEY14 = ['home', 'stories', 'travelers', 'layovers', 'map', 'expats', 'paw', 'about', 'cookies', 'account', 'profile', 'submit', 'login', 'signup'];
const CHANGED = ['travelers', 'map', 'expats', 'about', 'account', 'submit', 'profile', 'stories'];
function plan(set) {
  const cells = [];
  if (set === 'std') {
    for (const p of CHANGED.concat(['home', 'layovers', 'login', 'balkans', 'lisbon', 'safrica'])) for (const w of [390, 1440]) cells.push([p, w]);
    return { cells, rounds: 5, cpu: 1 };
  }
  if (set === 'trav8') return { cells: [['travelers', 390]], rounds: 1, cpu: 1, wait: 8300 }; /* one late look: the verb has rotated twice by then */
  if (set === 'lay') return { cells: [['layovers', 1440]], rounds: 15, cpu: 1 }; /* follow-up: the one cell whose median was more than 0.01 over the control in set std */
  /* follow-ups of re-check 1: first paint on /stories 1440 with all three cores (standard speed and CPU 4x, with the profile at 390) */
  if (set === 'fu') return { cells: [['stories', 1440]], rounds: 12, cpu: 1, arms: ['ctl', 'old', 'new'] };
  if (set === 'fucpu') return { cells: [['stories', 1440], ['profile', 390]], rounds: 6, cpu: 4, arms: ['ctl', 'old', 'new'] };
  if (set === 'cpu') { for (const p of CHANGED) for (const w of [390, 1440]) cells.push([p, w]); return { cells, rounds: 3, cpu: 4 }; }
  return { cells: [['travelers', 390], ['account', 1440], ['stories', 1440], ['balkans', 360]], rounds: 1, cpu: 1 };
}
const ARMS = { ctl: fs.readFileSync(path.join(JM, 'core-1666.js')), new: fs.readFileSync(path.join(SP, 'nov17/recheck1/core-new.js')), old: fs.readFileSync(path.join(JM, 'core-new.js')) }; /* old = the afe01e7 build, used by the follow-up sets only */
const sha = (b, n) => crypto.createHash('sha1').update(b).digest('hex').slice(0, n || 12);

/* ---- local cache: every <hash>.json + <hash>.b pair left by the earlier checks, plus this harness's own folder ---- */
const OWN = path.join(J, 'cache'); fs.mkdirSync(OWN, { recursive: true });
const CACHE = new Map();
(function scan() {
  const dirs = [];
  const walk = (d, depth) => { let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (e) { return; }
    for (const e of ents) if (e.isDirectory()) { const p = path.join(d, e.name);
      if (/cache/i.test(e.name)) dirs.push(p); else if (depth < 4 && e.name !== 'node_modules' && e.name !== 'wt' && e.name !== 'build') walk(p, depth + 1); } };
  for (const day of ['nov12', 'nov13', 'nov14', 'nov15', 'nov16']) walk(path.join(SP, day), 0);
  if (!dirs.includes(OWN)) dirs.push(OWN);
  for (const d of dirs) for (const f of fs.readdirSync(d)) if (f.endsWith('.json')) {
    try { const m = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')); const b = path.join(d, f.slice(0, -5) + '.b');
      if (m && m.u && fs.existsSync(b) && !CACHE.has(m.u)) CACHE.set(m.u, { meta: m, file: b, body: null }); } catch (e) { }
  }
})();
const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive', 'alt-svc', 'set-cookie', 'report-to', 'nel']);
function cached(u) { const c = CACHE.get(u); if (!c) return null; if (!c.body) c.body = fs.readFileSync(c.file);
  const h = {}; for (const k in (c.meta.headers || {})) if (!DROP.has(k.toLowerCase())) h[k.toLowerCase()] = String(c.meta.headers[k]);
  if (!h['access-control-allow-origin']) h['access-control-allow-origin'] = '*';
  return { status: c.meta.status || 200, headers: h, body: c.body }; }
function keep(u, status, headers, body) { const k = path.join(OWN, sha(u, 40)); fs.writeFileSync(k + '.b', body); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers }));
  CACHE.set(u, { meta: { u, status, headers }, file: k + '.b', body }); }

const MS_URL = 'https://static.memberstack.com/scripts/v2/memberstack.js';
const MS_BODY = (() => { const find = "i.A.appFetchFailed&&n.push(\"[data-ms-content]:not([data-ms-content^='!'])\")";
  const b = fs.readFileSync(path.join(SP, 'nov12/fonts/review/ms.js'), 'utf8'); if (b.split(find).length !== 2) throw new Error('memberstack patch point not found'); return b.replace(find, 'void 0'); })();
const RE_WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const RE_SITE = /^https?:\/\/(www\.)?thatlayover\.life(\/|$)/i;
const RE_ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com|adtrafficquality\.google|google\.com\/pagead|google\.com\/recaptcha/;
const RE_CORE = /\/tll-site-layers-v16\.js(\?|$)/;
const RE_OURGIT = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@([0-9a-f]{40})\/([^?#]+)$/i;
const RE_GF = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
const GIT = new Map();
function git(shaFull, p) { const k = shaFull + ':' + p; if (GIT.has(k)) return GIT.get(k); let b = null;
  try { b = cp.execFileSync('git', ['-C', REPO, 'show', k], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { }
  GIT.set(k, b); return b; }
const ctype = p => /\.css$/.test(p) ? 'text/css; charset=utf-8' : /\.json$/.test(p) ? 'application/json' : /\.svg$/.test(p) ? 'image/svg+xml' : 'application/javascript; charset=utf-8';
const NETLOG = path.join(J, 'results', 'net.json');
const net = fs.existsSync(NETLOG) ? JSON.parse(fs.readFileSync(NETLOG, 'utf8')) : { wfBytes: 0, wfFetched: [], thirdBytes: {}, thirdFetched: [] };
const saveNet = () => fs.writeFileSync(NETLOG, JSON.stringify(net, null, 1));

/* ---- in-page code ---- */
function INIT() {
  if (window.top !== window) return;
  const T = window.__J = { sh: [], lcp: [], fcp: null, fp: null, dcl: null, loadT: null };
  const one = n => { if (!n) return 'null'; if (n.nodeType !== 1) return '#' + n.nodeName; let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id;
    const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  const trail = n => { const a = []; for (let k = 0; n && n.nodeType === 1 && k < 4 && n !== document.body; k++, n = n.parentElement) a.unshift(one(n)); return a.join('>'); };
  const rr = r => [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.sh.push({ v: e.value, t: Math.round(e.startTime), inp: e.hadRecentInput ? 1 : 0, rs: document.readyState,
    src: (e.sources || []).slice(0, 4).map(s => [trail(s.node), rr(s.previousRect), rr(s.currentRect)]) }); }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { T.err = String(e); }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.lcp.push([Math.round(e.startTime), e.size, trail(e.element), ((e.url || '').match(/\/([0-9a-f]{24})_/) || [])[1] || (e.url ? 'url' : '')]); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) { if (e.name === 'first-contentful-paint') T.fcp = Math.round(e.startTime); if (e.name === 'first-paint') T.fp = Math.round(e.startTime); } }).observe({ type: 'paint', buffered: true }); } catch (e) { }
  document.addEventListener('DOMContentLoaded', () => { T.dcl = Math.round(performance.now()); }, true);
  window.addEventListener('load', () => { T.loadT = Math.round(performance.now()); });
  let seed = 12345; Math.random = function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
}
function PROBE() {
  const T = window.__J, sy = window.scrollY;
  const one = n => { let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).sort() : []; return c.length ? s + '.' + c.join('.') : s; };
  const boxes = [], tboxes = [];
  for (const n of document.querySelectorAll('body *')) { if (!n.getClientRects().length) continue; const b = n.getBoundingClientRect();
    const s = [Math.round(b.left), Math.round(b.top + sy), Math.round(b.width), Math.round(b.height)].join(','); boxes.push(s); tboxes.push(one(n) + ' ' + s); }
  const tree = []; (function walk(n, d) { const an = [].map.call(n.attributes, a => a.name).filter(a => a !== 'class' && a !== 'id' && a !== 'style').sort().join(',');
    tree.push(' '.repeat(Math.min(d, 40)) + one(n) + (an ? ' [' + an + ']' : '')); for (const c of n.children) walk(c, d + 1); })(document.documentElement, 0);
  const styles = [].map.call(document.querySelectorAll('style'), s => (s.closest('head') ? 'H:' : 'B:') + (s.id || '-') + ':' + (s.textContent || '').length);
  const imgs = [].slice.call(document.images); const vis = imgs.filter(i => i.getClientRects().length);
  return { T, boxes: boxes.join('\n'), tboxes: tboxes.join('\n'), tree: tree.join('\n'), styles,
    text: (document.body.innerText || '').replace(/\s+/g, ' ').trim(),
    htmlClass: (document.documentElement.className || '').trim().split(/\s+/).filter(Boolean).sort().join(' '), bodyClass: (document.body.className || '').trim().split(/\s+/).filter(Boolean).sort().join(' '),
    marks: { esGhost: document.querySelectorAll('[data-tll-es-ghost]').length, esNav: document.querySelectorAll('[data-tll-es-nav]').length,
      holdAttrs: [].filter.call(document.querySelectorAll('html,body,body *'), n => [].some.call(n.attributes, a => /^data-tll-(es|fp|mg-wait|hold)/.test(a.name))).length },
    docH: document.documentElement.scrollHeight, sy, now: Math.round(performance.now()), fonts: document.fonts.status, fontsN: [...document.fonts].filter(f => f.status === 'loaded').length,
    imgN: imgs.length, imgVis: vis.length, imgBad: vis.filter(i => !(i.complete && i.naturalWidth > 0)).length,
    selfDoc: typeof window.tllSelfDoc, coreTag: [].map.call(document.querySelectorAll('script[src*="tll-site-layers-v16.js"]'), s => ((s.src.match(/@([0-9a-f]{40})/) || [])[1] || '?').slice(0, 8) + (s.integrity ? ' sri' : ' nosri')).join('|') };
}
const UA_PHONE = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
const UA_DESK = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const HTML = {}; const rawHtml = k => HTML[k] || (HTML[k] = fs.readFileSync(path.join(JM, 'html', k + '.html'), 'utf8'));
function armHtml(k) { const h = rawHtml(k); const out = h.replace(/(<script[^>]*tll-site-layers-v16\.js"[^>]*?) integrity="[^"]*"/, '$1'); if (out.length === h.length) throw new Error('core tag not found in ' + k); return out; }

function othersRunning(own) { /* any chrome-like process that is not a child of this harness */
  let out = ''; try { out = cp.execSync('ps -eo pid,ppid,comm,args --no-headers', { encoding: 'utf8', maxBuffer: 1 << 24 }); } catch (e) { return []; }
  const rows = out.split('\n').map(l => l.trim().split(/\s+/)).filter(a => a.length > 3).map(a => ({ pid: +a[0], ppid: +a[1], comm: a[2], args: a.slice(3).join(' ') }));
  const par = new Map(rows.map(r => [r.pid, r.ppid])); const mine = p => { for (let k = 0; p && k < 30; k++) { if (p === own) return true; p = par.get(p); } return false; };
  return rows.filter(r => /chrom|headless_shell/i.test(r.comm) && !mine(r.pid)).map(r => r.pid + ' ' + r.comm);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function oneLoad(browser, set, pg, w, arm, i, cpu, minWait) {
  const [vw, vh] = SIZES[w], phone = w < 800, pathn = PAGES[pg], html = armHtml(pg), core = ARMS[arm];
  const st = { nonGet: 0, ads: 0, hit: 0, git: 0, coreN: 0, aborted: [], net: [], errs: [], consErr: 0, failed: [], imgs: [] };
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 3 : 1, userAgent: phone ? UA_PHONE : UA_DESK });
  await ctx.addInitScript(INIT);
  await ctx.route('**/*', async route => {
    const q = route.request(), u = q.url(), ty = q.resourceType();
    try {
      if (q.method() !== 'GET') { st.nonGet++; return route.abort(); }
      if (/^(data|blob|about):/.test(u)) return route.continue();
      if (RE_ADS.test(u)) { st.ads++; return route.fulfill({ status: 200, headers: { 'content-type': /\.js(\?|$)|gtag\/js|\/js\?/.test(u) ? 'application/javascript' : 'text/plain', 'access-control-allow-origin': '*' }, body: '' }); }
      if (RE_SITE.test(u)) { const pu = new URL(u);
        if (q.isNavigationRequest() && q.frame() === pgObj.mainFrame() && pu.pathname === pathn) return route.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: html });
        if (!q.isNavigationRequest() && BYPATH[pu.pathname] && !pu.search) return route.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: rawHtml(BYPATH[pu.pathname]) });
        if (q.isNavigationRequest()) { st.aborted.push('nav:' + pu.pathname.slice(0, 30)); return route.abort(); }
        const c = cached(u); if (c) { st.hit++; return route.fulfill(c); } st.aborted.push('site:' + ty + ':' + pu.pathname.slice(0, 60)); return route.abort(); }
      if (u === MS_URL) return route.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: MS_BODY });
      if (RE_CORE.test(u)) { st.coreN++; return route.fulfill({ status: 200, headers: { 'content-type': 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body: core }); }
      const g = RE_OURGIT.exec(u); if (g) { const b = git(g[1], g[2]); if (b) { st.git++; return route.fulfill({ status: 200, headers: { 'content-type': ctype(g[2]), 'access-control-allow-origin': '*' }, body: b }); } }
      const c = cached(u); if (ty === 'image') st.imgs.push((c ? 'hit ' : 'miss ') + u);
      if (c) { st.hit++; return route.fulfill(c); }
      if (RE_WF.test(u) || RE_GF.test(u)) { st.aborted.push(ty + ':' + u.replace(/^https?:\/\/[^/]+\//, '').slice(0, 120)); return route.abort(); }
      if (/memberstack|challenges\.cloudflare\.com/.test(u)) { st.net.push(new URL(u).host); return route.continue(); }
      /* any other third-party GET: first answer kept and replayed, so every load sees the same data */
      const r = await route.fetch(); const body = await r.body(); keep(u, r.status(), r.headers(), body);
      const host = new URL(u).host; net.thirdBytes[host] = (net.thirdBytes[host] || 0) + body.length; net.thirdFetched.push(host + ' ' + body.length); saveNet(); st.net.push('kept:' + host);
      return route.fulfill(cached(u));
    } catch (e) { st.failed.push(String(e).slice(0, 80)); try { await route.abort(); } catch (e2) { } }
  });
  const pgObj = await ctx.newPage();
  pgObj.on('pageerror', e => st.errs.push(String(e && e.message || e).slice(0, 160)));
  pgObj.on('console', m => { if (m.type() === 'error') st.consErr++; });
  if (cpu > 1) { const cdp = await ctx.newCDPSession(pgObj); await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu }); }
  const rec = { set, page: pg, w, h: vh, arm, i, cpu, at: new Date().toISOString() };
  try {
    await pgObj.goto(ORIGIN + pathn, { waitUntil: 'load', timeout: 90000 });
    const a = await pgObj.evaluate(() => [performance.now(), window.__J && window.__J.loadT]);
    const until = Math.max(minWait || 5000, (a[1] || a[0]) + 4000); await sleep(Math.max(0, until - a[0]) + 50);
    const x = await pgObj.evaluate(PROBE);
    const sh = x.T.sh.map(s => ({ v: +s.v.toFixed(6), t: s.t, inp: s.inp, rs: s.rs[0], src: s.src }));
    const id = [set, pg, w, arm, i].join('-');
    fs.writeFileSync(path.join(J, 'boxes', id + '.tbox.gz'), zlib.gzipSync(x.tboxes)); fs.writeFileSync(path.join(J, 'boxes', id + '.tree.gz'), zlib.gzipSync(x.tree + '\n--styles--\n' + x.styles.join('\n') + '\n--text--\n' + x.text));
    fs.writeFileSync(path.join(J, 'boxes', id + '.img.gz'), zlib.gzipSync(st.imgs.slice().sort().join('\n')));
    Object.assign(rec, { ok: 1, cls: +sh.reduce((s, e) => s + e.v, 0).toFixed(5), clsNI: +sh.filter(e => !e.inp).reduce((s, e) => s + e.v, 0).toFixed(5), nSh: sh.length,
      fcp: x.T.fcp, fp: x.T.fp, lcp: x.T.lcp.length ? x.T.lcp[x.T.lcp.length - 1][0] : null, lcpEl: x.T.lcp.length ? x.T.lcp[x.T.lcp.length - 1].slice(1) : null, lcpN: x.T.lcp.length,
      dcl: x.T.dcl, loadT: x.T.loadT, probeT: x.now, sh, boxHash: sha(x.boxes), tboxHash: sha(x.tboxes), treeHash: sha(x.tree), textHash: sha(x.text), stylesHash: sha(x.styles.join('|')),
      nBox: x.boxes.split('\n').length, docH: x.docH, sy: x.sy, htmlClass: x.htmlClass, bodyClass: x.bodyClass, marks: x.marks, fonts: x.fonts, fontsN: x.fontsN, imgN: x.imgN, imgVis: x.imgVis, imgBad: x.imgBad,
      selfDoc: x.selfDoc, coreTag: x.coreTag, coreSha: sha(core, 8), coreN: st.coreN });
  } catch (e) { rec.ok = 0; rec.fail = String(e).slice(0, 200); }
  Object.assign(rec, { nonGet: st.nonGet, ads: st.ads, hit: st.hit, git: st.git, imgReqN: st.imgs.length, imgReqHash: sha(st.imgs.slice().sort().join('|'), 8), abortedN: st.aborted.length, abortedHash: sha(st.aborted.slice().sort().join('|'), 8), aborted: st.aborted.slice(0, 40), net: [...new Set(st.net)], errs: st.errs.slice(0, 6), errN: st.errs.length, consErr: st.consErr, routeFail: st.failed.slice(0, 4) });
  await ctx.close();
  return rec;
}

(async () => {
  const P = plan(SET), OUT = path.join(J, 'results', SET + '.jsonl');
  const done = new Set(); if (fs.existsSync(OUT)) for (const l of fs.readFileSync(OUT, 'utf8').split('\n')) if (l.trim()) { try { const r = JSON.parse(l); if (r.ok) done.add([r.page, r.w, r.arm, r.i].join('|')); } catch (e) { } }
  let browser = null, waits = 0, n = 0;
  const free = () => { try { return +cp.execSync("df -k --output=avail /tmp | tail -1", { encoding: 'utf8' }).trim() / 1048576; } catch (e) { return 99; } };
  for (const [pg, w] of P.cells) {
    if (FILTER && !FILTER.test(pg + '-' + w)) continue;
    const todo = []; for (let i = 0; i < P.rounds; i++) for (const arm of (P.arms ? P.arms.slice(i % P.arms.length).concat(P.arms.slice(0, i % P.arms.length)) : (i % 2 ? ['new', 'ctl'] : ['ctl', 'new']))) if (!done.has([pg, w, arm, i].join('|'))) todo.push([arm, i]);
    if (!todo.length) continue;
    if (free() < 2) { console.log('STOP: disk under 2 GB'); break; }
    if (!browser) browser = await chromium.launch();
    for (const [arm, i] of todo) {
      for (let k = 0; k < 120; k++) { const o = othersRunning(process.pid); if (!o.length) break; waits++; if (k === 0) console.log('waiting for another browser: ' + o.slice(0, 2).join('; ')); await sleep(5000); }
      let rec = await oneLoad(browser, SET, pg, w, arm, i, P.cpu, P.wait);
      if (!rec.ok) { console.log('retry ' + pg + ' ' + w + ' ' + arm + ' ' + i + ': ' + rec.fail); try { await browser.close(); } catch (e) { } browser = await chromium.launch(); rec = await oneLoad(browser, SET, pg, w, arm, i, P.cpu, P.wait); }
      rec.othersSeen = othersRunning(process.pid).length;
      fs.appendFileSync(OUT, JSON.stringify(rec) + '\n'); n++;
      console.log([new Date().toISOString().slice(11, 19), SET, pg, w, arm, i, rec.ok ? 'cls ' + rec.cls + ' ni ' + rec.clsNI + ' fcp ' + rec.fcp + ' lcp ' + rec.lcp + ' box ' + rec.boxHash.slice(0, 6) + ' ab ' + rec.abortedN + ' err ' + rec.errN : 'FAILED ' + rec.fail].join(' '));
    }
    fs.appendFileSync(path.join(J, 'results', 'cells-done.log'), new Date().toISOString() + ' ' + SET + ' ' + pg + ' ' + w + '\n');
  }
  if (browser) await browser.close();
  saveNet(); console.log('DONE set ' + SET + ': ' + n + ' loads, waits for other browsers ' + waits);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
