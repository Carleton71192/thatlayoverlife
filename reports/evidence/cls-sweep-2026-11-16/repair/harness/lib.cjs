/* Judge-adversarial harness, shared parts (17 Nov 2026). Route rules follow the measurement judge's harness (jm.cjs):
   every non-GET aborted; Webflow-host files from the local caches or aborted (never fetched); ads and analytics get an empty answer;
   Memberstack served patched (signed-out) or as a stub (signed-in); Math.random seeded; one browser, one load at a time.
   Nothing that is not in a local cache is fetched, except challenges.cloudflare.com (as in jm.cjs). */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), zlib = require('zlib'), cp = require('child_process'), https = require('https');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const J = path.join(SP, 'nov17/repair'), JM = path.join(SP, 'nov16/judge-measure'), REPO = '/home/user/thatlayoverlife';
const ORIGIN = 'https://www.thatlayover.life';
const PROFILE = fs.readFileSync(path.join(SP, 'nov16/survey/profile-path.txt'), 'utf8').trim();
const PAGES = { home: '/', stories: '/stories', travelers: '/travelers', map: '/the-map', expats: '/for-expats', about: '/about',
  account: '/account', submit: '/submit', login: '/login', signup: '/signup', profile: PROFILE, lisbon: '/stories/lisbon-sun-sails-city-built-to-stand-back-up' };
const BYPATH = {}; for (const k in PAGES) BYPATH[PAGES[k]] = k;
/* three arms: ctl = live 16.66.0, old = the afe01e7 build, new = the repaired build (cores/new.js is copied from the worktree after each build) */
const ARMS = { ctl: fs.readFileSync(path.join(J, 'cores/ctl.js')), old: fs.readFileSync(path.join(J, 'cores/old.js')), new: fs.readFileSync(path.join(J, 'cores/new.js')) };
const sha = (b, n) => crypto.createHash('sha1').update(b).digest('hex').slice(0, n || 12);
for (const d of ['results', 'boxes', 'shots', 'tls']) fs.mkdirSync(path.join(J, d), { recursive: true });

const CACHE = new Map();
(function scan() {
  const dirs = [];
  const walk = (d, depth) => { let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (e) { return; }
    for (const e of ents) if (e.isDirectory()) { const p = path.join(d, e.name);
      if (/cache/i.test(e.name)) dirs.push(p); else if (depth < 4 && e.name !== 'node_modules' && e.name !== 'wt' && e.name !== 'build') walk(p, depth + 1); } };
  for (const day of ['nov12', 'nov13', 'nov14', 'nov15', 'nov16']) walk(path.join(SP, day), 0);
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

const MS_URL = 'https://static.memberstack.com/scripts/v2/memberstack.js';
const MS_BODY = (() => { const find = "i.A.appFetchFailed&&n.push(\"[data-ms-content]:not([data-ms-content^='!'])\")";
  const b = fs.readFileSync(path.join(SP, 'nov12/fonts/review/ms.js'), 'utf8'); if (b.split(find).length !== 2) throw new Error('memberstack patch point not found'); return b.replace(find, 'void 0'); })();
/* signed-in stand-in for memberstack.js: a member is answered after `delay` ms. No name, no real address. */
function msStub(delay) { return '(function(){var M={id:"mem_adv_test",verified:true,auth:{email:"reader@example.com",hasPassword:true,providers:[]},customFields:{},metaData:{},permissions:[],planConnections:[],createdAt:"2026-01-01T00:00:00.000Z"};' +
  'var DELAY=' + (+delay || 0) + ';function later(v){return new Promise(function(r){setTimeout(function(){r(v);},DELAY);});}' +
  'var api={getCurrentMember:function(){return later({data:M});},getMemberJSON:function(){return later({data:{}});},getApp:function(){return later({data:{id:"app_adv",plans:[],contentGroups:[]}});},' +
  'onAuthChange:function(cb){setTimeout(function(){try{cb(M);}catch(e){}},DELAY);return {unsubscribe:function(){}};},getMemberCookie:function(){return "adv";}};' +
  'window.$memberstackDom=new Proxy(api,{get:function(t,k){if(k in t)return t[k];if(typeof k!=="string"||k==="then")return undefined;return function(){return later({data:null});};}});window.$memberstackReady=true;})();'; }
const RE_WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const RE_SITE = /^https?:\/\/(www\.)?thatlayover\.life(\/|$)/i;
const RE_ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com|adtrafficquality\.google|google\.com\/pagead|google\.com\/recaptcha/;
const RE_CORE = /\/tll-site-layers-v16\.js(\?|$)/;
const RE_OURGIT = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@([0-9a-f]{40})\/([^?#]+)$/i;
const GIT = new Map();
function git(shaFull, p) { const k = shaFull + ':' + p; if (GIT.has(k)) return GIT.get(k); let b = null;
  try { b = cp.execFileSync('git', ['-C', REPO, 'show', k], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { }
  GIT.set(k, b); return b; }
const ctype = p => /\.css$/.test(p) ? 'text/css; charset=utf-8' : /\.json$/.test(p) ? 'application/json' : /\.svg$/.test(p) ? 'image/svg+xml' : 'application/javascript; charset=utf-8';
const HTML = {}; const rawHtml = k => HTML[k] || (HTML[k] = fs.readFileSync(path.join(JM, 'html', k + '.html'), 'utf8'));
function armHtml(k) { const h = rawHtml(k); const out = h.replace(/(<script[^>]*tll-site-layers-v16\.js"[^>]*?) integrity="[^"]*"/, '$1'); if (out.length === h.length) throw new Error('core tag not found in ' + k); return out; }
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---- in-page code ---- */
function INIT() {
  if (window.top !== window) return;
  if (window.__J) return;
  const T = window.__J = { sh: [], lcp: [], fcp: null, fp: null, dcl: null, loadT: null, holds: [], errs: [] };
  const one = n => { if (!n) return 'null'; if (n.nodeType !== 1) return '#' + n.nodeName; let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id;
    const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  const trail = n => { const a = []; for (let k = 0; n && n.nodeType === 1 && k < 3 && n !== document.body; k++, n = n.parentElement) a.unshift(one(n)); return a.join('>'); };
  const rr = r => [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.sh.push({ v: e.value, t: Math.round(e.startTime), inp: e.hadRecentInput ? 1 : 0, rs: document.readyState,
    src: (e.sources || []).slice(0, 3).map(s => [trail(s.node), rr(s.previousRect), rr(s.currentRect)]) }); }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { T.err = String(e); }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.lcp.push([Math.round(e.startTime), e.size, trail(e.element)]); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) { if (e.name === 'first-contentful-paint') T.fcp = Math.round(e.startTime); if (e.name === 'first-paint') T.fp = Math.round(e.startTime); } }).observe({ type: 'paint', buffered: true }); } catch (e) { }
  document.addEventListener('DOMContentLoaded', () => { T.dcl = Math.round(performance.now()); }, true);
  window.addEventListener('load', () => { T.loadT = Math.round(performance.now()); });
  /* the page as the early layers left it, read right before they hand it back (this listener is added before the core's) */
  const h8 = t => { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0; return h.toString(16) + ':' + t.length; };
  const idState = n => { if (!n) return null; const r = n.getBoundingClientRect();
    return { text: h8((n.innerText || '').replace(/\s+/g, ' ').trim()), links: h8([].map.call(n.querySelectorAll('a'), a => a.getAttribute('href') + '>' + (a.textContent || '').trim()).join('|')), nLinks: n.querySelectorAll('a').length,
      rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], shown: n.getClientRects().length ? 1 : 0, kids: [].map.call(n.children, c => (c.getAttribute('data-pf5') || c.tagName) + ':' + Math.round(c.getBoundingClientRect().height)).join(' ') }; };
  const snap = () => { const lead = document.querySelector('[data-tll-lead]'), la = lead && (lead.id ? lead : lead.querySelector('[id]')), nav = document.querySelector('nav.tll-nav-v1'), nr = nav && nav.getBoundingClientRect();
    const g = document.querySelector('.tll-lib-grid'), f = g && g.firstElementChild, fa = f && (f.id ? f : f.querySelector('[id]')), tt = document.querySelector('.tll-travelers-title'), mp = document.getElementById('tll-map-layers');
    return { t: Math.round(performance.now()), ghost: idState(document.querySelector('[data-tll-es-ghost]')), real: idState(document.querySelector('[data-pf5="hero"]>[data-pf5="id"]:not([data-tll-es-ghost])')),
      lead: la ? h8(la.id) : null, first: fa ? h8(fa.id) : null, slot: document.querySelectorAll('.tll-lib-searchslot').length, standIn: document.querySelectorAll('.tllmm-btn[aria-hidden]').length, menuBtn: document.querySelectorAll('.tllmm-btn').length,
      navMark: document.querySelectorAll('[data-tll-es-nav]').length, navRect: nr ? [Math.round(nr.y), Math.round(nr.height)] : null, navShown: nav ? nav.getClientRects().length : 0, invite: document.querySelectorAll('[data-tll-map-invite]').length,
      titleH: tt ? Math.round(tt.getBoundingClientRect().height) : null, mapH: mp ? Math.round(mp.getBoundingClientRect().height) : null, docH: document.documentElement.scrollHeight, sy: Math.round(window.scrollY),
      htmlClass: document.documentElement.className, fpes: [].map.call(document.querySelectorAll('style'), x => x.id).filter(x => /^tll-(fp|es)-/.test(x)).join(',') }; };
  window.__Jsnap = snap;
  window.addEventListener('DOMContentLoaded', () => { try { T.atDcl = snap(); } catch (e) { T.atDclErr = String(e); } }, true);
  window.addEventListener('DOMContentLoaded', () => { setTimeout(() => { try { T.afterDcl = snap(); } catch (e) { } }, 60); });
  window.addEventListener('error', e => { T.errs.push(String(e.message || '').slice(0, 120)); }, true);
  /* when the sweep's head styles come and go */
  try { const seen = n => { if (n.nodeType === 1 && n.tagName === 'STYLE' && /^tll-(fp|es)-/.test(n.id || '')) return n.id; return null; };
    const cb = recs => { for (const r of recs) { for (const n of r.addedNodes) { const id = seen(n); if (id) T.holds.push([id, '+', Math.round(performance.now())]); }
      for (const n of r.removedNodes) { const id = seen(n); if (id) T.holds.push([id, '-', Math.round(performance.now())]); } } };
    let oh = 0, oe = 0; const arm = () => { if (!oe && document.documentElement) { oe = 1; hm.observe(document.documentElement, { childList: true }); } if (!oh && document.head) { oh = 1; hm.observe(document.head, { childList: true });
        for (const n of document.head.children) { const id = seen(n); if (id) T.holds.push([id, '+', Math.round(performance.now())]); } } };
    const hm = new MutationObserver(recs => { arm(); cb(recs); });
    hm.observe(document, { childList: true }); arm(); } catch (e) { T.holdErr = String(e); }
  let seed = 12345; Math.random = function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
}
function PROBE() {
  const T = window.__J || {}, sy = window.scrollY;
  const one = n => { let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).sort() : []; return c.length ? s + '.' + c.join('.') : s; };
  const boxes = [], tboxes = [];
  for (const n of document.querySelectorAll('body *')) { if (!n.getClientRects().length) continue; const b = n.getBoundingClientRect();
    const s = [Math.round(b.left), Math.round(b.top + sy), Math.round(b.width), Math.round(b.height)].join(','); boxes.push(s); tboxes.push(one(n) + ' ' + s); }
  let ifr = 0; const tree = []; (function walk(n, d) { const an = [].map.call(n.attributes, a => a.name).filter(a => a !== 'class' && a !== 'id' && a !== 'style').sort().join(',');
    if (d === 1 && n.tagName === 'IFRAME') { ifr++; return; }
    tree.push(' '.repeat(Math.min(d, 40)) + one(n) + (an ? ' [' + an + ']' : '')); for (const c of n.children) walk(c, d + 1); })(document.body, 0); tree.push('body-iframes ' + ifr);
  /* the head and the html element's own children as a sorted list: scripts add to them in an order that follows the network */
  const headL = []; for (const n of [...(document.head ? document.head.children : []), ...document.documentElement.children]) { if (n === document.head || n === document.body) continue; if (n.tagName === 'STYLE' && /^tll-(fp|es)-/.test(n.id || '')) continue;
    headL.push(one(n) + (n.tagName === 'STYLE' ? ':' + (n.textContent || '').length : n.tagName === 'SCRIPT' || n.tagName === 'LINK' ? ':' + (n.getAttribute('src') || n.getAttribute('href') || '').slice(-40) : '')); } headL.sort();
  const styles = [].map.call(document.querySelectorAll('style'), s => (s.closest('head') ? 'H:' : 'B:') + (s.id || '-') + ':' + (s.textContent || '').length);
  /* what a keyboard reaches, in order */
  const foc = []; for (const n of document.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex]')) { if (!n.getClientRects().length) continue; if (n.disabled) continue;
    const ti = n.getAttribute('tabindex'); if (ti !== null && +ti < 0) continue; const cs = getComputedStyle(n); if (cs.visibility === 'hidden') continue;
    foc.push(one(n) + (ti ? ' ti=' + ti : '') + (n.getAttribute('aria-hidden') ? ' ah' : '') + (n.getAttribute('aria-expanded') ? ' ex=' + n.getAttribute('aria-expanded') : '')); }
  const left = [];
  for (const s of document.querySelectorAll('style')) if (/^tll-(fp|es)-/.test(s.id || '')) left.push('style#' + s.id);
  for (const n of document.querySelectorAll('html,body,body *')) for (const a of n.attributes) if (/^data-tll-(es|fp)/.test(a.name)) left.push(a.name + '@' + one(n).slice(0, 40));
  const cnt = s => document.querySelectorAll(s).length;
  const marks = { lead: cnt('[data-tll-lead]'), menuBtn: cnt('.tllmm-btn'), menuBtnHidden: cnt('.tllmm-btn[aria-hidden]'), invite: cnt('[data-tll-map-invite]'), slot: cnt('.tll-lib-searchslot'), merged: cnt('[data-tll-merged]'),
    pf5id: cnt('[data-pf5="id"]'), h1: cnt('h1'), navs: cnt('nav.tll-nav-v1'), a3: document.documentElement.classList.contains('a3-on') ? 1 : 0 };
  const ae = document.activeElement; let endSnap = null; try { endSnap = window.__Jsnap ? window.__Jsnap() : null; } catch (e) { }
  return { T, endSnap, boxes: boxes.join('\n'), tboxes: tboxes.join('\n'), tree: tree.join('\n'), styles, headL: headL.join('\n'), foc: foc.join('\n'), left, marks,
    text: (document.body.innerText || '').replace(/\s+/g, ' ').trim(),
    htmlClass: (document.documentElement.className || '').trim().split(/\s+/).filter(Boolean).sort().join(' '),
    docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth, sy, now: Math.round(performance.now()),
    active: ae ? one(ae) : '', fontsN: [...document.fonts].filter(f => f.status === 'loaded').length,
    navType: (performance.getEntriesByType('navigation')[0] || {}).type || '',
    vis: (function () { var h = getComputedStyle(document.documentElement), b = getComputedStyle(document.body); return [h.visibility, h.opacity, h.display, b.visibility, b.opacity, b.display, document.visibilityState].join(' '); })(),
    imgBad: [].filter.call(document.images, i => i.getClientRects().length && !(i.complete && i.naturalWidth > 0)).length };
}
const UA_PHONE = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
const UA_DESK = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

/* ---- local TLS server that sends one document in pieces (the page still sees its www address) ---- */
let SRV = null; const JOB = { html: null, plan: null, served: 0 };
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
async function streamServer() { if (SRV) return SRV;
  const key = path.join(J, 'tls/k.pem'), crt = path.join(J, 'tls/c.pem');
  if (!fs.existsSync(key)) cp.execSync(`openssl req -x509 -newkey rsa:2048 -nodes -keyout ${key} -out ${crt} -days 3 -subj /CN=adv.local 2>/dev/null`);
  const srv = https.createServer({ key: fs.readFileSync(key), cert: fs.readFileSync(crt) }, async (req, res) => {
    const job = JOB; if (!job.html) { res.writeHead(503); return res.end(); }
    job.served++;
    const buf = Buffer.from(job.html, 'utf8'), pl = job.plan;
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-adv': '1' });
    const headEnd = buf.indexOf('</head>') + 7; const cuts = [headEnd];
    const rnd = mulberry(pl.seed || 1);
    if (pl.mode === 'even') { for (let p = headEnd + pl.size; p < buf.length; p += pl.size) cuts.push(p); }
    else { const set = new Set(); while (set.size < pl.n) set.add(headEnd + 1 + Math.floor(rnd() * (buf.length - headEnd - 2))); cuts.push(...[...set].sort((a, b) => a - b)); }
    cuts.push(buf.length); let at = 0;
    await sleep(pl.ttfb || 0);
    for (let i = 0; i < cuts.length; i++) { if (cuts[i] <= at) continue; res.write(buf.subarray(at, cuts[i])); at = cuts[i]; if (i < cuts.length - 1) await sleep(pl.gap); }
    res.end();
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); SRV = { srv, port: srv.address().port }; return SRV; }

/* ---- one context with the route rules. o: { w, h, arm, html(k) -> string, fail: [{re, mode}], delay(u, len) -> ms, ms: 'out'|'in', msDelay, stream: plan, ctx: {...}, cpu } ---- */
async function openPage(browser, o) {
  const phone = o.phone != null ? o.phone : o.w < 800, core = ARMS[o.arm];
  const st = { nonGet: 0, ads: 0, hit: 0, git: 0, coreN: 0, aborted: [], net: [], errs: [], cons: [], failed: [], hooked: [] };
  const ctx = await browser.newContext(Object.assign({ viewport: { width: o.w, height: o.h }, isMobile: phone, hasTouch: phone, deviceScaleFactor: 1, userAgent: phone ? UA_PHONE : UA_DESK, ignoreHTTPSErrors: !!o.stream }, o.ctx || {}));
  await ctx.addInitScript(INIT);
  if (o.ms === 'in') await ctx.addInitScript(() => { try { localStorage.setItem('_ms-mid', 'adv-test'); } catch (e) { } });
  if (o.init) await ctx.addInitScript(o.init);
  const htmlFor = k => (o.html ? o.html(k, armHtml(k)) : armHtml(k));
  let page = null;
  const fulfil = async (route, r, u) => { const d = o.delay ? o.delay(u, r.body ? r.body.length : 0) : 0; if (d > 0) await sleep(d); return route.fulfill(r); };
  await ctx.route('**/*', async route => {
    const q = route.request(), u = q.url(), ty = q.resourceType();
    try {
      if (q.method() !== 'GET') { st.nonGet++; return route.abort(); }
      if (/^(data|blob|about):/.test(u)) return route.continue();
      for (const f of (o.fail || [])) if (f.re.test(u)) { st.hooked.push(f.mode + ':' + u.replace(/^https?:\/\/[^/]+\//, '').slice(-50));
        if (f.mode === '404') return route.fulfill({ status: 404, headers: { 'content-type': 'text/plain', 'access-control-allow-origin': '*' }, body: 'not found' });
        if (f.mode === 'throw') return route.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: 'throw new Error("adv: forced throw");' });
        if (f.mode === 'empty') return route.fulfill({ status: 200, headers: { 'content-type': /\.css/.test(u) ? 'text/css' : 'application/javascript', 'access-control-allow-origin': '*' }, body: '' });
        if (f.mode === 'abort') return route.abort();
        if (f.mode === 'slow') { await sleep(f.ms || 3000); break; } }
      if (RE_ADS.test(u)) { st.ads++; return route.fulfill({ status: 200, headers: { 'content-type': /\.js(\?|$)|gtag\/js|\/js\?/.test(u) ? 'application/javascript' : 'text/plain', 'access-control-allow-origin': '*' }, body: '' }); }
      if (RE_SITE.test(u)) { const pu = new URL(u), k = BYPATH[pu.pathname.replace(/\/+$/, '') || '/'];
        if (q.isNavigationRequest() && q.frame() === page.mainFrame() && k) {
          if (o.stream && !st.docN) { st.docN = 1; const s = await streamServer(); JOB.html = htmlFor(k); JOB.plan = o.stream; return route.continue({ url: 'https://127.0.0.1:' + s.port + pu.pathname }); }
          st.docN = (st.docN || 0) + 1; const body = htmlFor(k); const d = o.delay ? o.delay(u, body.length, 'doc') : 0; if (d > 0) await sleep(d);
          return route.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body }); }
        if (!q.isNavigationRequest() && k && !pu.search) return route.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: rawHtml(k) });
        if (q.isNavigationRequest()) { st.aborted.push('nav:' + pu.pathname.replace(/^\/contributors\/.*/, '/contributors/<profile>').slice(0, 30)); return route.abort(); }
        const c = cached(u); if (c) { st.hit++; return fulfil(route, c, u); } st.aborted.push('site:' + ty + ':' + pu.pathname.replace(/^\/contributors\/.*/, '/contributors/<profile>').slice(0, 60)); return route.abort(); }
      if (u === MS_URL) return fulfil(route, { status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: o.ms === 'in' ? msStub(o.msDelay) : MS_BODY }, u);
      if (RE_CORE.test(u)) { st.coreN++; return fulfil(route, { status: 200, headers: { 'content-type': 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body: core }, u); }
      const g = RE_OURGIT.exec(u); if (g) { const b = git(g[1], g[2]); if (b) { st.git++; return fulfil(route, { status: 200, headers: { 'content-type': ctype(g[2]), 'access-control-allow-origin': '*' }, body: b }, u); } }
      const c = cached(u);
      if (c) { st.hit++; return fulfil(route, c, u); }
      if (!o.ms || o.ms === 'out') { if (/challenges\.cloudflare\.com/.test(u)) { st.net.push(new URL(u).host); return route.continue(); } }
      st.aborted.push(ty + ':' + u.replace(/^https?:\/\/[^/]+\//, '').replace(/contributors\/[^/?#]+/, 'contributors/<profile>').slice(0, 100)); return route.abort();
    } catch (e) { st.failed.push(String(e).slice(0, 80)); try { await route.abort(); } catch (e2) { } }
  });
  page = await ctx.newPage();
  page.on('pageerror', e => st.errs.push(String(e && e.message || e).slice(0, 140)));
  page.on('console', m => { if (m.type() === 'error') st.cons.push(m.text().replace(/contributors\/[^/?# ]+/g, 'contributors/<profile>').slice(0, 110)); });
  if (o.cpu > 1) { const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: o.cpu }); }
  return { ctx, page, st };
}
/* one probe: hashes into the record, the lists to disk (never committed: page text) */
async function probe(page, id, stage) {
  const x = await page.evaluate(PROBE);
  const tag = id + (stage ? '.' + stage : '');
  fs.writeFileSync(path.join(J, 'boxes', tag + '.tbox.gz'), zlib.gzipSync(x.tboxes));
  fs.writeFileSync(path.join(J, 'boxes', tag + '.tree.gz'), zlib.gzipSync(x.tree + '\n--head--\n' + x.headL + '\n--styles--\n' + x.styles.join('\n') + '\n--focus--\n' + x.foc + '\n--text--\n' + x.text));
  let aria = ''; try { aria = await page.locator('body').ariaSnapshot({ timeout: 5000 }); } catch (e) { aria = 'ERR ' + String(e).slice(0, 60); }
  fs.writeFileSync(path.join(J, 'boxes', tag + '.aria.gz'), zlib.gzipSync(aria));
  const sh = (x.T.sh || []).map(s => ({ v: +s.v.toFixed(5), t: s.t, inp: s.inp, rs: s.rs[0], src: s.src }));
  return { stage: stage || 'end', cls: +sh.reduce((s, e) => s + e.v, 0).toFixed(5), clsNI: +sh.filter(e => !e.inp).reduce((s, e) => s + e.v, 0).toFixed(5), nSh: sh.length, sh,
    fcp: x.T.fcp, lcp: x.T.lcp && x.T.lcp.length ? x.T.lcp[x.T.lcp.length - 1][0] : null, lcpEl: x.T.lcp && x.T.lcp.length ? x.T.lcp[x.T.lcp.length - 1][2] : null, dcl: x.T.dcl, loadT: x.T.loadT, now: x.now,
    holds: x.T.holds, atDcl: x.T.atDcl || null, afterDcl: x.T.afterDcl || null, endSnap: x.endSnap, navType: x.navType, winErrs: x.T.errs, box: sha(x.boxes), nBox: x.boxes.split('\n').length, tree: sha(x.tree), head: sha(x.headL), text: sha(x.text), styles: sha(x.styles.join('|')), foc: sha(x.foc), nFoc: x.foc.split('\n').length, aria: sha(aria),
    htmlClass: x.htmlClass, vis: x.vis, left: x.left, marks: x.marks, docH: x.docH, docW: x.docW, sy: x.sy, active: x.active, fontsN: x.fontsN, imgBad: x.imgBad };
}
module.exports = { fs, path, zlib, cp, SP, J, JM, ORIGIN, PAGES, BYPATH, ARMS, sha, sleep, armHtml, rawHtml, openPage, probe, streamServer, JOB, INIT, PROBE };
