/* Behavior check of 16.66.0 (core pin 3df16988, fix A4R) on the REAL test site against REAL www (16.64.0, pin 6ec769bb). 15 Nov 2026.
   Derived from the 16.65.0 behavior check (check1665-behavior/bin/lib.cjs) plus the A4R measure judge's box hash, ad stubs and one-browser rule (a4rjm/bin/m.cjs).
   - Main documents (navigations and reloads) go to the real host over the network. Every non-GET is aborted.
   - Same-origin non-navigation requests for the nine checked paths: served from this checker's plain-GET copy of the same host.
   - Webflow hosts: local caches (read only, then our own). A miss for an image, video or font is never fetched: a country flag SVG gets a grey
     placeholder (as in the A4R judge), anything else is aborted and listed. A css/js/json miss is fetched once and stored.
   - jsDelivr and Google fonts: caches, else fetched once and stored (the 16.66.0 core is one such miss on the first test load).
   - Memberstack served patched (no hiding when its aborted app POST fails), as in the earlier checks. Ad and analytics endpoints answered
     locally with an empty body on both hosts (recorded), as in the A4R judge, so ad fills do not differ between hosts.
   - One browser at a time: before every load, wait until no browser outside this process has used CPU; rerun a load if one did.
   node h.cjs out.jsonl runs "case;case"   case = page:WxH[:restore] */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const D = path.join(SP, 'nov15/check1666-behavior');
const OWN = path.join(D, 'cache'), BYTES = path.join(D, 'out', 'net-bytes.json');
const RO = ['nov14/check1665-behavior/cache', 'nov14/check1665-regression/cache', 'nov14/chk1664/cache', 'nov13/fontrel/check/cache', 'nov13/next/bwimg/cache', 'nov13/next/story-hero/fcache', 'nov14/regr/cache', 'nov14/cls390'].map(d => path.join(SP, d));
const IDX = new Map();
for (const dir of [OWN].concat(RO)) { if (!fs.existsSync(dir)) continue; for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) { try { const m = JSON.parse(fs.readFileSync(path.join(dir, f))); if (m.u && !IDX.has(m.u) && fs.existsSync(path.join(dir, f.slice(0, -5) + '.b'))) IDX.set(m.u, path.join(dir, f.slice(0, -5))); } catch (e) { } } }
const MS_URL = 'https://static.memberstack.com/scripts/v2/memberstack.js';
const MS_FIND = "i.A.appFetchFailed&&n.push(\"[data-ms-content]:not([data-ms-content^='!'])\")";
const MSJS = (() => { const b = fs.readFileSync(path.join(SP, 'nov12/fonts/review/ms.js'), 'utf8'); if (b.split(MS_FIND).length !== 2) throw new Error('ms'); return b.replace(MS_FIND, 'void 0'); })();
const WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const JS = /^https:\/\/cdn\.jsdelivr\.net\//, GF = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
const ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com/;
const HOST = { www: 'https://www.thatlayover.life', test: 'https://that-layover-life.webflow.io' };
const PATH = { home: '/', stories: '/stories', balkans: '/stories/balkans-ev-road-trip-twelve-countries', croatia: '/stories/croatia-te-amo-velho-birthday-week', safrica: '/stories/southern-africa-safari', madrid: '/stories/spain-madrid-wedding-ibiza', vietnam: '/stories/vietnam-ninja-duckies', phuket: '/stories/phuket-singapore-eat-drank-relax-be-happy', lisbon: '/stories/lisbon-sun-sails-city-built-to-stand-back-up' };
const SNAP = {}; for (const k in PATH) SNAP[PATH[k]] = k;
let bytes = fs.existsSync(BYTES) ? JSON.parse(fs.readFileSync(BYTES)) : { doc: 0, docn: 0, wfSub: 0, wfSubn: 0, wfu: [], jsd: 0, jsdn: 0, jsdu: [], gf: 0, other: 0, blocked: {}, flagPh: {} };
const save = () => fs.writeFileSync(BYTES, JSON.stringify(bytes));
const key = u => crypto.createHash('sha1').update(u).digest('hex');
const MEDIA = /\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|mov|m4v|woff2?|ttf|otf|eot)(\?|$)/i;
function store(u, status, hd, b) { const k = path.join(OWN, key(u)); fs.writeFileSync(k + '.b', b); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers: hd })); IDX.set(u, k); }
function load(u) { const k = IDX.get(u); if (!k) return null; const m = JSON.parse(fs.readFileSync(k + '.json')); return { status: m.status, headers: m.headers, body: fs.readFileSync(k + '.b') }; }
const INIT = () => {
  const T = { sh: [], lcp: [], fcp: null, dcl: null, loadT: null, es: { atFirstRaf: null, added: null, removed: null, seen: false }, waitSeen: {}, waitGone: {}, ph: { seen: null, gone: null, max: 0 } }; window.__T = T;
  const desc = n => { if (!n || n.nodeType !== 1) return n ? n.nodeName : 'null'; let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; if (c.length) s += '.' + c.join('.'); return s; };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.sh.push({ v: +e.value.toFixed(5), t: Math.round(e.startTime), src: (e.sources || []).slice(0, 4).map(x => [desc(x.node), Math.round(x.previousRect.y), Math.round(x.currentRect.y), Math.round(x.previousRect.height), Math.round(x.currentRect.height)]) }); }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.lcp.push([Math.round(e.startTime), e.size, desc(e.element)]); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') T.fcp = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true }); } catch (e) { }
  const es = () => !!document.getElementById('tll-story-st3-early-v1');
  requestAnimationFrame(() => { T.es.atFirstRaf = es(); });
  const chk = () => { const now = Math.round(performance.now());
    const has = es(); if (has && T.es.added == null) { T.es.added = now; T.es.seen = true; } if (!has && T.es.seen && T.es.removed == null) T.es.removed = now;
    for (const a of ['data-tll-mg-wait-r', 'data-tll-mg-wait-d']) { const on = !!document.querySelector('[' + a + ']'); if (on && T.waitSeen[a] == null) T.waitSeen[a] = now; if (!on && T.waitSeen[a] != null && T.waitGone[a] == null) T.waitGone[a] = now; }
    const n = document.querySelectorAll('[data-tll-mg-flags]').length; if (n) { if (T.ph.seen == null) T.ph.seen = now; if (n > T.ph.max) T.ph.max = n; } else if (T.ph.seen != null && T.ph.gone == null) T.ph.gone = now; };
  try { new MutationObserver(chk).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-tll-mg-wait-r', 'data-tll-mg-wait-d', 'data-tll-mg-flags'] }); } catch (e) { }
  document.addEventListener('DOMContentLoaded', () => { T.dcl = Math.round(performance.now()); chk(); }, { capture: true });
  addEventListener('load', () => { T.loadT = Math.round(performance.now()); });
};
const PROBE = () => {
  const T = window.__T;
  const core = [...document.querySelectorAll('script[src*="tll-site-layers-v16.js"]')].map(s => ((s.src.match(/@([0-9a-f]{40})/) || [])[1] || '?') + ' ' + (s.integrity || '').slice(0, 15));
  const all = [].slice.call(document.querySelectorAll('body *')).filter(n => n.getClientRects().length).map(n => { const b = n.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top + scrollY), Math.round(b.width), Math.round(b.height)].join(','); }).join(';');
  const q = s => document.querySelectorAll(s).length;
  const hi = document.querySelector('.tll-story-hero-img'); let heroVis = null;
  if (hi) { let vis = true, n = hi; const b = hi.getBoundingClientRect(); while (n && n.nodeType === 1) { const c = getComputedStyle(n); if (c.visibility === 'hidden' || c.display === 'none' || +c.opacity === 0) { vis = false; break; } n = n.parentElement; }
    heroVis = { vis, h: Math.round(b.height), complete: hi.complete, nw: hi.naturalWidth }; }
  const hidHero = [].slice.call(document.querySelectorAll('.tll-story-hero *')).filter(n => getComputedStyle(n).visibility === 'hidden' && n.getClientRects().length).map(n => String(n.className).slice(0, 40)).slice(0, 5);
  const tx = s => { const n = document.querySelector(s); return n ? n.textContent.replace(/\s+/g, ' ').trim().length : null; };
  return { core, selfDoc: typeof window.tllSelfDoc, boxes: all, nBoxes: all ? all.split(';').length : 0, docH: document.documentElement.scrollHeight, y: Math.round(scrollY),
    esEnd: q('#tll-story-st3-early-v1'), waitEnd: q('[data-tll-mg-wait-r]') + q('[data-tll-mg-wait-d]'), phEnd: q('[data-tll-mg-flags]'), hidHero, heroVis,
    magStyle: q('#tll-mag-story-v1'), rcpt: q('.tll-mg-rcpt'), crumbH: (b => b ? Math.round(b.getBoundingClientRect().height) : null)(document.querySelector('[data-tll-breadcrumb]')), flagsImg: q('[data-tll-breadcrumb] img'),
    bodyTextLen: document.body.innerText.length, bad: (document.body.innerText.match(/NaN|undefined|\{[a-z]+\}/g) || []).slice(0, 5),
    T: { sh: T.sh, lcp: T.lcp, fcp: T.fcp, dcl: T.dcl, loadT: T.loadT, es: T.es, waitSeen: T.waitSeen, waitGone: T.waitGone, ph: T.ph } };
};
const UA_M = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
const UA_D = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const FLAG = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#888"/></svg>';
async function open(browser, { host, p, w, h, mode = 'fresh', Y = 2500 }) {
  const mobile = w < 800, O = HOST[host], url = O + p;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1, userAgent: mobile ? UA_M : UA_D });
  const st = { aborted: 0, errs: [], cons: [], failed: [], scriptBad: [], blocked: [], flagPh: 0, ads: 0, docBytes: 0, navs: 0, net: 0, hit: 0, core: [], pend: new Set(), stored: [] };
  await ctx.route('**/*', async rt => {
    const q = rt.request(), u = q.url();
    if (q.method() !== 'GET') { st.aborted++; return rt.abort(); }
    let pu = null; try { pu = new URL(u); } catch (e) { }
    if (ADS.test(u)) { st.ads++; return rt.fulfill({ status: 200, headers: { 'content-type': /\.js|gtag\/js/.test(u) ? 'application/javascript' : 'text/plain' }, body: '' }); }
    if (pu && pu.origin === O) {
      if (q.isNavigationRequest()) return rt.continue();
      const k = SNAP[pu.pathname.replace(/\/$/, '') || '/'];
      if (k && !pu.search) return rt.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: fs.readFileSync(path.join(D, 'html', host, k + '.html')) });
    }
    if (u === MS_URL) return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: MSJS });
    const isWF = WF.test(u), isJ = JS.test(u), isG = GF.test(u);
    if (isWF || isJ || isG) {
      const c = load(u);
      if (!c) {
        const rtp = q.resourceType();
        if (isWF && /_flag-[a-z]{2,3}\.svg(\?|$)/i.test(u)) { st.flagPh++; bytes.flagPh[u.replace(/^.*\//, '')] = (bytes.flagPh[u.replace(/^.*\//, '')] || 0) + 1; return rt.fulfill({ status: 200, headers: { 'content-type': 'image/svg+xml', 'access-control-allow-origin': '*' }, body: FLAG }); }
        if (isWF && (rtp === 'image' || rtp === 'media' || rtp === 'font' || MEDIA.test(pu ? pu.pathname : u))) { st.blocked.push(u.replace(/^.*\//, '').slice(-80)); bytes.blocked[u] = (bytes.blocked[u] || 0) + 1; return rt.abort(); }
        if (bytes.doc + bytes.wfSub > 85e6) { st.failed.push('budget ' + u); return rt.abort(); }
        st.pend.add(u); return rt.continue();
      } else st.hit++;
      return rt.fulfill({ status: c.status, headers: c.headers, body: c.body });
    }
    return rt.continue();
  });
  const pg = await ctx.newPage(); await pg.addInitScript(INIT); if (mode === 'seeded') await pg.addInitScript(() => { let x = 12345; Math.random = () => { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; }; }); /* seeded: same Math.random sequence on every load, so content picked at random is the same on both hosts */
  pg.on('pageerror', e => st.errs.push(e.message.slice(0, 200)));
  pg.on('console', m => { if (m.type() === 'error') st.cons.push(m.text().slice(0, 200)); });
  pg.on('requestfailed', r => { const f = r.failure(); if (r.method() === 'GET') { const s = r.url().slice(0, 140) + ' ' + (f && f.errorText); st.failed.push(s); if (r.resourceType() === 'script') st.scriptBad.push(s); } });
  pg.on('requestfinished', async r => { try { const pu = new URL(r.url()); if (pu.origin === O && r.isNavigationRequest()) { const z = await r.sizes(); st.docBytes += z.responseBodySize + z.responseHeadersSize; st.navs++; } } catch (e) { } });
  pg.on('response', async r => { const u = r.url(); if (st.pend.has(u) && !IDX.has(u) && r.request().method() === 'GET' && r.status() === 200) { try { const b = await r.body(); const hd = await r.allHeaders(); for (const x of ['content-encoding', 'content-length', 'transfer-encoding']) delete hd[x];
      if (!IDX.has(u)) { store(u, r.status(), hd, b); st.stored.push(u.slice(0, 160)); if (WF.test(u)) { bytes.wfSub += b.length; bytes.wfSubn++; bytes.wfu.push([u.slice(0, 160), b.length, r.request().resourceType()]); } else if (JS.test(u)) { bytes.jsd += b.length; bytes.jsdn++; bytes.jsdu.push([u.slice(0, 160), b.length]); } else if (GF.test(u)) bytes.gf += b.length; save(); } } catch (e) { st.failed.push('store ' + u.slice(0, 100) + ' ' + e.message.slice(0, 60)); } } });
  pg.on('response', r => { const u = r.url(); if (r.request().resourceType() === 'script' && r.status() >= 400) st.scriptBad.push(r.status() + ' ' + u.slice(0, 140)); const m = /thatlayoverlife@([0-9a-f]{8})[0-9a-f]*\/src\/site-layers\/tll-site-layers-v16\.js/.exec(u); if (m) st.core.push(m[1] + ':' + r.status()); });
  const res = {};
  await pg.goto(url, { waitUntil: 'load', timeout: 120000 });
  if (mode === 'restore') {
    await pg.waitForTimeout(2500); await pg.evaluate(y => scrollTo(0, y), Y); await pg.waitForTimeout(800); res.y0 = await pg.evaluate(() => Math.round(scrollY));
    st.errs.length = 0; st.cons.length = 0; st.failed.length = 0; st.scriptBad.length = 0; st.blocked.length = 0; st.core.length = 0;
    await pg.reload({ waitUntil: 'load', timeout: 120000 });
  }
  await pg.waitForTimeout(3500);
  await pg.waitForFunction(() => performance.now() >= 4000, null, { timeout: 30000, polling: 100 }).catch(() => { });
  res.r = await pg.evaluate(PROBE);
  await ctx.close();
  return { st, res };
}
/* one browser at a time (from the A4R measure judge): CPU ticks used by browser processes outside this process tree */
function others() {
  try { const P = {}; for (const d of fs.readdirSync('/proc')) { if (!/^\d+$/.test(d)) continue; try { const s = fs.readFileSync('/proc/' + d + '/stat', 'utf8'); const r = s.slice(s.lastIndexOf(')') + 2).split(' '); const cmd = fs.readFileSync('/proc/' + d + '/cmdline', 'utf8'); P[d] = { pp: r[1], t: +r[11] + +r[12], br: /headless_shell|chrome-linux\/chrome|chromium/.test(cmd) }; } catch (e) { } }
    const mine = p => { for (let k = 0; p && P[p] && k < 20; k++, p = P[p].pp) if (+p === process.pid) return true; return false; };
    let t = 0; for (const d in P) if (P[d].br && !mine(d)) t += P[d].t; return t; } catch (e) { return 0; } }
const sleep = ms => new Promise(f => setTimeout(f, ms));
async function waitAlone(log) { const q0 = others(); await sleep(700); if (others() - q0 <= 2) return 0;
  const t0 = Date.now(); let calm = 0, last = others(); while (calm < 2) { await sleep(5000); const t = others(); if (t - last > 10) calm = 0; else calm++; last = t; if (Date.now() - t0 > 25 * 60e3) { log('waited 25 min, going on'); return -1; } }
  const s = Math.round((Date.now() - t0) / 1000); if (s > 12) log('waited ' + s + ' s for another browser to go quiet'); return s; }
if (require.main === module) (async () => {
  const [out, runs, cases] = process.argv.slice(2); const HS = ['www', 'test'];
  let browser = await chromium.launch(); let n = 0, nl = 0;
  for (let run = 0; run < +runs; run++) for (const cs of cases.split(';')) {
    const [k, wh, mode] = cs.split(':'); const [w, h] = wh.split('x').map(Number);
    const order = (run + n) % 2 ? HS.slice().reverse() : HS; n++;
    for (const host of order) {
      if (++nl % 50 === 0) { await browser.close(); browser = await chromium.launch(); }
      let r = null, tries = 0, ovl = 0, waited = 0, t0;
      for (;;) { tries++; waited += Math.max(0, await waitAlone(console.log)); const c0 = others(); t0 = Date.now();
        try { r = await open(browser, { host, p: PATH[k], w, h, mode: mode || 'fresh' }); } catch (e) { r = { err: e.message.slice(0, 300) }; try { await browser.close(); } catch (x) { } browser = await chromium.launch(); }
        ovl = others() - c0 > 30 ? 1 : 0; if ((!ovl && !r.err) || tries >= 4) break; console.log(r.err ? 'error, again: ' + r.err : 'another browser ran during this load; again'); }
      const row = { case: cs, page: k, w, host, run, mode: mode || 'fresh', at: new Date().toISOString(), ms: Date.now() - t0, tries, ovl, waited, err: r.err || null };
      if (r.st) { const st = r.st; bytes.doc += st.docBytes; bytes.docn += st.navs; save();
        Object.assign(row, { errs: st.errs, consN: st.cons.length, cons: [...new Set(st.cons)].slice(0, 6), failedN: st.failed.length, failed: st.failed.filter(x => !/ERR_ABORTED|ERR_FAILED/.test(x)).slice(0, 6), scriptBad: st.scriptBad, coreResp: st.core, blocked: st.blocked, flagPh: st.flagPh, ads: st.ads, stored: st.stored, docBytes: st.docBytes, navs: st.navs, hit: st.hit, aborted: st.aborted }); }
      if (r.res) { const x = r.res.r, T = x.T; const sh = T.sh || [];
        const lcp = T.lcp && T.lcp.length ? T.lcp[T.lcp.length - 1] : null;
        const bh = crypto.createHash('sha1').update(x.boxes).digest('hex').slice(0, 16); const bf = path.join(D, 'boxes', bh + '.txt'); if (!fs.existsSync(bf)) fs.writeFileSync(bf, x.boxes.split(';').join('\n'));
        delete x.boxes; delete x.T;
        Object.assign(row, { cls: +sh.reduce((a, e) => a + e.v, 0).toFixed(5), cls4: +sh.filter(e => e.t <= 4000).reduce((a, e) => a + e.v, 0).toFixed(5), shN: sh.length, sh: sh.slice(0, 12), fcp: T.fcp, lcpT: lcp && lcp[0], lcpEl: lcp && lcp[2], dcl: T.dcl, loadT: T.loadT, es: T.es, waitSeen: T.waitSeen, waitGone: T.waitGone, ph: T.ph, bh, y0: r.res.y0, ...x }); }
      fs.appendFileSync(out, JSON.stringify(row) + '\n');
      console.log(row.at.slice(11, 19), cs, host, run, row.err || '', 'cls', row.cls, 'fcp', row.fcp, 'lcp', row.lcpT, 'core', (row.coreResp || []).join(','), 'errs', (row.errs || []).length, 'blk', (row.blocked || []).length, 'ph', row.flagPh, 'bh', row.bh, 'y', row.y, 'doc', row.docBytes);
    }
  }
  await browser.close();
})();
module.exports = { open, PROBE };
