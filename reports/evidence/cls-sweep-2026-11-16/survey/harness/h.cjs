/* Layout shift survey of live www (core 16.66.0, pin 3df16988), non-story pages. 16 Nov 2026.
   From the 16.66.0 behavior/regression harnesses (nov15/check1666-behavior/bin/h.cjs, check1666-regression/bin/h2.cjs).
   - Documents: one plain GET per page (html/<k>.html), served from disk at the www address for every load.
   - Core and chunks at pin 3df16988 (and other jsDelivr files of this repo): from git objects of that pin (byte for byte what jsDelivr
     serves; SRI intact). Other jsDelivr, Webflow css/js, Google fonts: local caches; a css/js/json miss is fetched once and stored.
   - Webflow images, video and fonts: cache or abort (never fetched). Every non-GET aborted. Ads/analytics answered empty.
   - Memberstack patched as in the earlier checks. Math.random seeded the same on every load.
   - Variants (flags joined by +): base, nocore, nochunk, nows (all Webflow-hosted custom scripts), noscript=<substr>, nofonts, noimg,
     noms (memberstack), nowfjs (webflow.js and IX), ph=<w>x<h> (uncached images answered with a local PNG of that size),
     core=<file> (core body from a local file, integrity removed in the routed HTML only), css=<file> (extra css text appended in head).
   node h.cjs out.jsonl jobs.json   jobs = [{page, w, h, v, n}] */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const D = path.join(SP, 'nov16/survey'), OWN = path.join(D, 'cache'), REPO = '/home/user/thatlayoverlife';
const BYTES = path.join(D, 'out', 'net-bytes.json');
const IDX = new Map(Object.entries(JSON.parse(fs.readFileSync(path.join(D, 'cache-index.json')))));
for (const f of fs.readdirSync(OWN)) if (f.endsWith('.json')) { const m = JSON.parse(fs.readFileSync(path.join(OWN, f))); if (m.u && !IDX.has(m.u)) IDX.set(m.u, path.join(OWN, f.slice(0, -5))); }
const MS_URL = 'https://static.memberstack.com/scripts/v2/memberstack.js';
const MS_FIND = "i.A.appFetchFailed&&n.push(\"[data-ms-content]:not([data-ms-content^='!'])\")";
const MSJS = (() => { const b = fs.readFileSync(path.join(SP, 'nov12/fonts/review/ms.js'), 'utf8'); if (b.split(MS_FIND).length !== 2) throw new Error('ms'); return b.replace(MS_FIND, 'void 0'); })();
const WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const JSD = /^https:\/\/cdn\.jsdelivr\.net\//, GF = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
const ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com/;
const O = 'https://www.thatlayover.life';
const PROF = fs.readFileSync(path.join(D, 'profile-path.txt'), 'utf8').trim();
const PATH = { home: '/', stories: '/stories', travelers: '/travelers', layovers: '/layovers', map: '/the-map', expats: '/for-expats', paw: '/the-paw-passport', about: '/about', cookies: '/cookies', account: '/account', submit: '/submit', login: '/login', signup: '/signup', profile: PROF };
const SNAP = {}; for (const k in PATH) SNAP[PATH[k]] = k;
let bytes = fs.existsSync(BYTES) ? JSON.parse(fs.readFileSync(BYTES)) : { wf: 0, wfn: 0, wfu: [], jsd: 0, jsdn: 0, jsdu: [], gf: 0, gfn: 0, other3p: {}, blocked: {} };
const save = () => fs.writeFileSync(BYTES, JSON.stringify(bytes));
const key = u => crypto.createHash('sha1').update(u).digest('hex');
const MEDIA = /\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|mov|m4v|woff2?|ttf|otf|eot)(\?|$)/i;
function store(u, status, hd, b) { const k = path.join(OWN, key(u)); fs.writeFileSync(k + '.b', b); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers: hd })); IDX.set(u, k); }
function load(u) { const k = IDX.get(u); if (!k) return null; const m = JSON.parse(fs.readFileSync(k + '.json')); return { status: m.status, headers: m.headers, body: fs.readFileSync(k + '.b') }; }
const GITC = new Map();
function fromGit(u) { /* https://cdn.jsdelivr.net/gh/<user>/thatlayoverlife@<sha>/<path> */
  const m = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@([0-9a-f]{40})\/([^?#]+)$/i.exec(u); if (!m) return null;
  const k = m[1] + ':' + m[2]; if (GITC.has(k)) return GITC.get(k);
  let b = null; try { b = cp.execFileSync('git', ['-C', REPO, 'show', k], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { b = null; }
  const r = b ? { status: 200, headers: { 'content-type': /\.css$/.test(m[2]) ? 'text/css; charset=utf-8' : /\.json$/.test(m[2]) ? 'application/json' : 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body: b } : null;
  GITC.set(k, r); return r; }
const CORE_RE = /tll-site-layers-v16\.js(\?|$)/;
const PNG = (w, h) => { /* plain grey PNG of w x h, made locally */
  const zlib = require('zlib'); const raw = Buffer.alloc((w * 3 + 1) * h, 0x99); for (let y = 0; y < h; y++) raw[y * (w * 3 + 1)] = 0;
  const crc = (buf) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } c = 0xffffffff; for (const x of buf) c = t[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const ch = (ty, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(ty), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2; ih[10] = 0; ih[11] = 0; ih[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', ih), ch('IDAT', zlib.deflateSync(raw)), ch('IEND', Buffer.alloc(0))]); };
const INIT = () => {
  const T = { sh: [], lcp: [], fcp: null, dcl: null, loadT: null }; window.__T = T;
  const d1 = n => { if (!n || n.nodeType !== 1) return n ? n.nodeName : 'null'; let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; if (c.length) s += '.' + c.join('.'); return s; };
  const dp = n => { const a = []; for (let k = 0; n && n.nodeType === 1 && k < 4 && n !== document.body; k++, n = n.parentElement) a.unshift(d1(n)); return a.join(' > '); };
  const R = r => [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.sh.push({ v: +e.value.toFixed(5), t: Math.round(e.startTime), inp: e.hadRecentInput ? 1 : 0, rs: document.readyState[0], src: (e.sources || []).slice(0, 5).map(x => [dp(x.node), R(x.previousRect), R(x.currentRect)]) }); }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.lcp.push([Math.round(e.startTime), e.size, dp(e.element), (e.url || '').replace(/^.*\//, '').slice(0, 30)]); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') T.fcp = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true }); } catch (e) { }
  document.addEventListener('DOMContentLoaded', () => { T.dcl = Math.round(performance.now()); }, { capture: true });
  addEventListener('load', () => { T.loadT = Math.round(performance.now()); });
  let x = 12345; Math.random = () => { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; };
};
const PROBE = () => {
  const T = window.__T, vh = innerHeight;
  const d1 = n => { let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; if (c.length) s += '.' + c.join('.'); return s; };
  const dp = n => { const a = []; for (let k = 0; n && n.nodeType === 1 && k < 4 && n !== document.body; k++, n = n.parentElement) a.unshift(d1(n)); return a.join(' > '); };
  const imgs = [].slice.call(document.images).map(im => { const b = im.getBoundingClientRect(); const cs = getComputedStyle(im);
    return { p: dp(im), u: (im.currentSrc || im.src || '').replace(/^.*\/([0-9a-f]{24})?[^/]*$/, (a, h) => h || a.replace(/^.*\//, '').slice(0, 24)), top: Math.round(b.top + scrollY), h: Math.round(b.height), w: Math.round(b.width), vis: !!im.getClientRects().length && cs.display !== 'none' && cs.visibility !== 'hidden',
      aw: im.getAttribute('width'), ah: im.getAttribute('height'), ar: cs.aspectRatio, ch: im.style.height || '', pos: cs.position, lazy: im.loading, ok: im.complete && im.naturalWidth > 0, nat: [im.naturalWidth, im.naturalHeight] }; });
  const all = [].slice.call(document.querySelectorAll('body *')).filter(n => n.getClientRects().length).map(n => { const b = n.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top + scrollY), Math.round(b.width), Math.round(b.height)].join(','); }).join(';');
  const rt = performance.getEntriesByType('resource').filter(e => /script|css|link|img|font|fetch|xmlhttprequest/.test(e.initiatorType) || /\.(woff2?|css|js)(\?|$)/.test(e.name)).map(e => [e.initiatorType, e.name.replace(/^https?:\/\//, '').replace(/^cdn\.prod\.website-files\.com\/[^/]+(%2F[^%]+%2F[^%]+%2F)?/, 'WF/').slice(0, 90), Math.round(e.startTime), Math.round(e.responseEnd)]);
  return { core: [...document.querySelectorAll('script[src*="tll-site-layers-v16.js"]')].map(s => ((s.src.match(/@([0-9a-f]{40})/) || [])[1] || '?').slice(0, 8) + ' ' + (s.integrity || '').slice(0, 15)), selfDoc: typeof window.tllSelfDoc,
    boxes: all, docH: document.documentElement.scrollHeight, vh, imgs, rt, T: { sh: T.sh, lcp: T.lcp, fcp: T.fcp, dcl: T.dcl, loadT: T.loadT }, fontsDone: document.fonts.status };
};
const UA_M = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
const UA_D = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const FLAG = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#888"/></svg>';
function parseV(v) { const o = {}; for (const p of (v || 'base').split('+')) { const i = p.indexOf('='); if (i < 0) o[p] = true; else (o[p.slice(0, i)] = o[p.slice(0, i)] || []).push(p.slice(i + 1)); } return o; }
async function open(browser, { page, w, h, v }) {
  const V = parseV(v), mobile = w < 800, url = O + PATH[page];
  let html = fs.readFileSync(path.join(D, 'html', page + '.html'), 'utf8');
  let coreBody = null;
  if (V.core) { coreBody = fs.readFileSync(V.core[0]); const n0 = html.length; html = html.replace(/(<script[^>]*tll-site-layers-v16\.js"[^>]*?) integrity="[^"]*"/, '$1'); if (html.length === n0) throw new Error('core tag not found'); }
  if (V.css) { const css = V.css.map(f => fs.readFileSync(f, 'utf8')).join('\n'); html = html.replace('</head>', '<style id="zz-survey-css">' + css + '</style></head>'); }
  if (V.html) for (const f of V.html) { const [a, b] = JSON.parse(fs.readFileSync(f, 'utf8')); if (html.indexOf(a) < 0) throw new Error('html patch miss ' + f); html = html.split(a).join(b); }
  if (V.hoist) { /* diagnostic: every <style> block inside <body> moved to the end of <head>, same order */
    const bi = html.indexOf('<body'); const head = html.slice(0, bi), body = html.slice(bi); const got = [];
    const body2 = body.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, m => { got.push(m); return ''; });
    html = head.replace('</head>', got.join('\n') + '</head>') + body2; }
  const ph = V.ph ? (([a, b]) => PNG(+a, +b))(V.ph[0].split('x')) : null;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile && !V.nomobile, hasTouch: mobile && !V.notouch, deviceScaleFactor: mobile ? 3 : 1, userAgent: mobile ? UA_M : UA_D });
  const st = { aborted: 0, errs: [], cons: 0, failed: [], blocked: [], vblocked: [], flagPh: 0, ads: 0, hit: 0, git: 0, net3p: [], stored: [], pend: new Set(), phN: 0 };
  await ctx.route('**/*', async rt => {
    const q = rt.request(), u = q.url(), ty = q.resourceType();
    if (q.method() !== 'GET') { st.aborted++; return rt.abort(); }
    let pu = null; try { pu = new URL(u); } catch (e) { }
    if (ADS.test(u)) { st.ads++; return rt.fulfill({ status: 200, headers: { 'content-type': /\.js|gtag\/js/.test(u) ? 'application/javascript' : 'text/plain' }, body: '' }); }
    /* variant blocks */
    if (V.nocore && CORE_RE.test(u)) { st.vblocked.push('core'); return rt.abort(); }
    if (V.nochunk && /\/src\/site-layers\/chunks\//.test(u)) { st.vblocked.push(u.replace(/^.*\//, '')); return rt.abort(); }
    if (V.nows && /website-files\.com\/[^/]*%2F/.test(u) && ty === 'script') { st.vblocked.push(decodeURIComponent(u).replace(/^.*\//, '').slice(0, 40)); return rt.abort(); }
    if (V.noscript && ty === 'script' && V.noscript.some(s => decodeURIComponent(u).includes(s))) { st.vblocked.push(decodeURIComponent(u).replace(/^.*\//, '').slice(0, 40)); return rt.abort(); }
    if (V.nofonts && (GF.test(u) || ty === 'font')) { st.vblocked.push('font'); return rt.abort(); }
    if (V.noimg && ty === 'image') { st.vblocked.push('img'); return rt.abort(); }
    if (V.noms && /memberstack/.test(u)) { st.vblocked.push('ms'); return rt.abort(); }
    if (V.nowfjs && ty === 'script' && /\/js\/webflow\.|gsap|SplitText|ScrollTrigger|jquery/.test(u)) { st.vblocked.push(u.replace(/^.*\//, '').slice(0, 40)); return rt.abort(); }
    if (pu && pu.origin === O) {
      if (q.isNavigationRequest() && pu.pathname === PATH[page]) return rt.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: html });
      const k = SNAP[pu.pathname.replace(/\/$/, '') || '/'];
      if (k && !pu.search) return rt.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: fs.readFileSync(path.join(D, 'html', k + '.html')) });
      if (q.isNavigationRequest()) { st.failed.push('nav away ' + pu.pathname.slice(0, 40)); return rt.abort(); }
    }
    if (u === MS_URL) return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: MSJS });
    if (V.file) for (const fs1 of V.file) { const [sub, fp] = fs1.split('@'); if (decodeURIComponent(u).includes(sub)) { st.vblocked.push('file:' + sub); return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body: fs.readFileSync(fp) }); } }
    if (coreBody && CORE_RE.test(u)) return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body: coreBody });
    if (JSD.test(u)) { const g = fromGit(u); if (g) { st.git++; return rt.fulfill(g); } }
    const isWF = WF.test(u), isJ = JSD.test(u), isG = GF.test(u);
    if (isWF || isJ || isG) {
      const c = load(u);
      if (c) { st.hit++; return rt.fulfill({ status: c.status, headers: c.headers, body: c.body }); }
      if (isWF && /_flag-[a-z]{2,3}\.svg(\?|$)/i.test(u)) { st.flagPh++; return rt.fulfill({ status: 200, headers: { 'content-type': 'image/svg+xml', 'access-control-allow-origin': '*' }, body: FLAG }); }
      if (isWF && (ty === 'image' || ty === 'media' || ty === 'font' || MEDIA.test(pu ? pu.pathname : u))) {
        if (ph && ty === 'image') { st.phN++; return rt.fulfill({ status: 200, headers: { 'content-type': 'image/png', 'access-control-allow-origin': '*' }, body: ph }); }
        st.blocked.push(u.replace(/^.*\//, '').slice(0, 24)); bytes.blocked[u.slice(0, 200)] = (bytes.blocked[u.slice(0, 200)] || 0) + 1; return rt.abort(); }
      if (bytes.wf > 20e6) { st.failed.push('budget ' + u.slice(0, 80)); return rt.abort(); }
      st.pend.add(u); return rt.continue();
    }
    { const c = load(u); if (c) { st.hit++; return rt.fulfill({ status: c.status, headers: c.headers, body: c.body }); } }
    if (/^(script|fetch|xhr|stylesheet)$/.test(ty) && pu && !/memberstack|challenges\.cloudflare/.test(pu.host)) st.pend.add(u); /* third-party GET: first answer stored and reused, so every load sees the same data */
    st.net3p.push((pu ? pu.host : u.slice(0, 40)) + ' ' + ty); bytes.other3p[pu ? pu.host : '?'] = (bytes.other3p[pu ? pu.host : '?'] || 0) + 1;
    return rt.continue();
  });
  const pg = await ctx.newPage(); await pg.addInitScript(INIT);
  if (V.trace) await pg.addInitScript((LIM) => { /* per-frame boxes of the nav, main's children and their children, until 3 s */
    const TR = window.__TR = []; let last = '';
    const d1 = n => { let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; if (c.length) s += '.' + c.join('.'); return s; };
    const f = () => { const t = Math.round(performance.now()); const m = document.querySelector('main') || document.body; const L = [];
      const nav = document.querySelector('nav.tll-nav-v1'); if (nav) { const r = nav.getBoundingClientRect(); L.push('nav:' + Math.round(r.top) + '/' + Math.round(r.height)); }
      if (m) for (const c of m.children) { const r = c.getBoundingClientRect(); if (!r.height) continue; L.push(d1(c) + ':' + Math.round(r.top) + '/' + Math.round(r.height));
        for (const g of c.children) { const q = g.getBoundingClientRect(); if (q.height) L.push('  ' + d1(g) + ':' + Math.round(q.top) + '/' + Math.round(q.height)); for (const h of g.children) { const z = h.getBoundingClientRect(); if (z.height && z.top < innerHeight) L.push('    ' + d1(h) + ':' + Math.round(z.top) + '/' + Math.round(z.height) + 'w' + Math.round(z.width)); } } }
      const k = L.join('|'); if (k !== last) { TR.push([t, document.readyState[0], L]); last = k; } if (t < LIM) requestAnimationFrame(f); };
    requestAnimationFrame(f); }, V.trace === true ? 3000 : +V.trace[0]);
  if (V.cpu) { const cdp = await ctx.newCDPSession(pg); await cdp.send('Emulation.setCPUThrottlingRate', { rate: +V.cpu[0] }); }
  pg.on('pageerror', e => st.errs.push(e.message.slice(0, 160)));
  pg.on('console', m => { if (m.type() === 'error') st.cons++; });
  pg.on('requestfailed', r => { const f = r.failure(); if (r.method() === 'GET' && !/ERR_ABORTED|ERR_FAILED/.test(f && f.errorText || '')) st.failed.push(r.url().slice(0, 100) + ' ' + (f && f.errorText)); });
  pg.on('response', async r => { const u = r.url(); if (st.pend.has(u) && !IDX.has(u) && r.status() === 200) { try { const b = await r.body(); const hd = await r.allHeaders(); for (const x of ['content-encoding', 'content-length', 'transfer-encoding']) delete hd[x];
      if (!IDX.has(u)) { store(u, 200, hd, b); st.stored.push(u.slice(0, 120)); if (WF.test(u)) { bytes.wf += b.length; bytes.wfn++; bytes.wfu.push([u.slice(0, 160), b.length, r.request().resourceType()]); } else if (JSD.test(u)) { bytes.jsd += b.length; bytes.jsdn++; bytes.jsdu.push([u.slice(0, 160), b.length]); } else if (GF.test(u)) { bytes.gf += b.length; bytes.gfn++; } else { bytes.o3 = (bytes.o3 || 0) + b.length; } save(); } } catch (e) { } } });
  await pg.goto(url, { waitUntil: 'load', timeout: 90000 });
  await pg.waitForTimeout(4000);
  await pg.waitForFunction(() => performance.now() >= 5000, null, { timeout: 30000, polling: 100 }).catch(() => { });
  const r = await pg.evaluate(PROBE); if (V.trace) r.trace = await pg.evaluate(() => window.__TR);
  await ctx.close();
  return { st, r };
}
function others() {
  try { const P = {}; for (const d of fs.readdirSync('/proc')) { if (!/^\d+$/.test(d)) continue; try { const s = fs.readFileSync('/proc/' + d + '/stat', 'utf8'); const r = s.slice(s.lastIndexOf(')') + 2).split(' '); const cmd = fs.readFileSync('/proc/' + d + '/cmdline', 'utf8'); P[d] = { pp: r[1], t: +r[11] + +r[12], br: /headless_shell|chrome-linux\/chrome|chromium/.test(cmd) }; } catch (e) { } }
    const mine = p => { for (let k = 0; p && P[p] && k < 20; k++, p = P[p].pp) if (+p === process.pid) return true; return false; };
    let t = 0; for (const d in P) if (P[d].br && !mine(d)) t += P[d].t; return t; } catch (e) { return 0; } }
const sleep = ms => new Promise(f => setTimeout(f, ms));
async function waitAlone() { const q0 = others(); await sleep(300); if (others() - q0 <= 2) return 0; const t0 = Date.now(); let calm = 0, last = others(); while (calm < 2) { await sleep(5000); const t = others(); if (t - last > 10) calm = 0; else calm++; last = t; if (Date.now() - t0 > 20 * 60e3) return -1; } return Math.round((Date.now() - t0) / 1000); }
if (require.main === module) (async () => {
  const [out, jobsF] = process.argv.slice(2); const jobs = JSON.parse(fs.readFileSync(jobsF));
  const BOX = path.join(D, 'boxes'); fs.mkdirSync(BOX, { recursive: true });
  let browser = await chromium.launch(), nl = 0;
  /* rounds: load i of every job, then load i+1, so a cell's loads are spread over the run */
  const maxN = Math.max(...jobs.map(j => j.n));
  for (let run = 0; run < maxN; run++) for (const j of jobs) { if (run >= j.n) continue;
    if (++nl % 40 === 0) { await browser.close(); browser = await chromium.launch(); }
    let res = null, tries = 0, waited = 0, ovl = 0, t0;
    for (;;) { tries++; waited += Math.max(0, await waitAlone()); const c0 = others(); t0 = Date.now();
      try { res = await open(browser, j); } catch (e) { res = { err: e.message.slice(0, 200) }; try { await browser.close(); } catch (x) { } browser = await chromium.launch(); }
      ovl = others() - c0 > 30 ? 1 : 0; if ((!ovl && !res.err) || tries >= 3) break; }
    const row = { page: j.page, w: j.w, h: j.h, v: j.v || 'base', run, at: new Date().toISOString(), ms: Date.now() - t0, tries, ovl, waited, err: res.err || null };
    if (res.r) { const x = res.r, T = x.T, sh = T.sh.filter(e => !e.inp), st = res.st; const lcp = T.lcp.length ? T.lcp[T.lcp.length - 1] : null;
      const bh = crypto.createHash('sha1').update(x.boxes).digest('hex').slice(0, 16); const bf = path.join(BOX, bh + '.txt'); if (!fs.existsSync(bf)) fs.writeFileSync(bf, x.boxes.split(';').join('\n'));
      Object.assign(row, { cls: +sh.reduce((a, e) => a + e.v, 0).toFixed(5), shN: sh.length, sh: T.sh, fcp: T.fcp, lcpT: lcp && lcp[0], lcpEl: lcp && lcp[2], lcpU: lcp && lcp[3], dcl: T.dcl, loadT: T.loadT, bh, docH: x.docH, core: x.core, selfDoc: x.selfDoc, fonts: x.fontsDone,
        imgs: x.imgs, rt: x.rt, trace: x.trace || null, errs: st.errs, consN: st.cons, failed: st.failed.slice(0, 8), blocked: st.blocked, vblocked: [...new Set(st.vblocked)], flagPh: st.flagPh, phN: st.phN, ads: st.ads, hit: st.hit, git: st.git, net3p: [...new Set(st.net3p)], stored: st.stored, aborted: st.aborted }); }
    fs.appendFileSync(out, JSON.stringify(row) + '\n');
    console.log(row.at.slice(11, 19), j.page, j.w, row.v, run, row.err || '', 'cls', row.cls, 'n', row.shN, 'fcp', row.fcp, 'lcp', row.lcpT, 'dcl', row.dcl, 'blk', (row.blocked || []).length, 'st', (row.stored || []).length, 'core', (row.core || []).join(','), 'errs', (row.errs || []).length);
  }
  await browser.close();
})();
module.exports = { open };
