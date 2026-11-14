/* Behavior check of 16.65.0 on the real test site against real www (14 Nov 2026).
   Main documents (navigations, reloads) go to the real host over the network. Every non-GET is aborted.
   Same-origin fetches from scripts: served from this checker's plain-GET snapshot of the same host when held, else fetched once per host and cached.
   Webflow hosts: local caches (read only, then our own); a miss for an image, video or font is aborted (listed); a miss for css/js/json is fetched once.
   jsDelivr and Google fonts: caches, else fetched once and stored. Memberstack served patched (no content hiding when its aborted app POST fails), as in the 16.64.0 check.
   Other third parties: passed through (bytes counted). */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const D = path.join(SP, 'nov14/check1665-behavior');
const OWN = path.join(D, 'cache'), BYTES = path.join(D, 'out', 'net-bytes.json');
const RO = ['nov14/chk1664/cache', 'nov13/fontrel/check/cache', 'nov13/next/bwimg/cache', 'nov13/next/story-hero/fcache', 'nov14/regr/cache'].map(d => path.join(SP, d));
const IDX = new Map();
for (const dir of RO.concat([OWN])) { if (!fs.existsSync(dir)) continue; for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) { try { const m = JSON.parse(fs.readFileSync(path.join(dir, f))); if (m.u && !IDX.has(m.u) && fs.existsSync(path.join(dir, f.slice(0, -5) + '.b'))) IDX.set(m.u, path.join(dir, f.slice(0, -5))); } catch (e) { } } }
const MS_URL = 'https://static.memberstack.com/scripts/v2/memberstack.js';
const MS_FIND = "i.A.appFetchFailed&&n.push(\"[data-ms-content]:not([data-ms-content^='!'])\")";
const MSJS = (() => { const b = fs.readFileSync(path.join(SP, 'nov12/fonts/review/ms.js'), 'utf8'); if (b.split(MS_FIND).length !== 2) throw new Error('ms'); return b.replace(MS_FIND, 'void 0'); })();
const WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const JS = /^https:\/\/cdn\.jsdelivr\.net\//, GF = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
const HOST = { www: 'https://www.thatlayover.life', test: 'https://that-layover-life.webflow.io' };
const SNAP = { '/': 'home', '/stories': 'stories', '/stories/spain-madrid-wedding-ibiza': 'story', '/stories/balkans-ev-road-trip-twelve-countries': 'balkans', '/stories/croatia-te-amo-velho-birthday-week': 'croatia' };
let bytes = fs.existsSync(BYTES) ? JSON.parse(fs.readFileSync(BYTES)) : { doc: 0, docn: 0, wfSub: 0, wfSubn: 0, wfu: [], jsd: 0, jsdn: 0, gf: 0, other: 0, blocked: {} };
const save = () => fs.writeFileSync(BYTES, JSON.stringify(bytes));
const key = u => crypto.createHash('sha1').update(u).digest('hex');
const MEDIA = /\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|mov|m4v|woff2?|ttf|otf|eot)(\?|$)/i;
function store(u, status, hd, b) { const k = path.join(OWN, key(u)); fs.writeFileSync(k + '.b', b); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers: hd })); IDX.set(u, k); }
function load(u) { const k = IDX.get(u); if (!k) return null; const m = JSON.parse(fs.readFileSync(k + '.json')); return { status: m.status, headers: m.headers, body: fs.readFileSync(k + '.b') }; }
const INIT = () => {
  const T = { sh: [], lcp: [], fcp: null, es: { atFirstRaf: null, atDcl: null, added: null, removed: null, seenEver: false }, waitSeen: {}, dcl: null }; window.__T = T;
  const desc = n => { if (!n || n.nodeType !== 1) return n ? n.nodeName : 'null'; let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; if (c.length) s += '.' + c.join('.'); return s; };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.sh.push({ v: +e.value.toFixed(5), t: Math.round(e.startTime), inp: e.hadRecentInput, src: (e.sources || []).slice(0, 4).map(x => [desc(x.node), Math.round(x.previousRect.y), Math.round(x.currentRect.y), Math.round(x.previousRect.height), Math.round(x.currentRect.height)]) }); }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.lcp.push([Math.round(e.startTime), e.size, desc(e.element)]); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') T.fcp = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true }); } catch (e) { }
  const es = () => !!document.getElementById('tll-story-st3-early-v1');
  requestAnimationFrame(() => { T.es.atFirstRaf = es(); });
  try { new MutationObserver(ms => { const now = Math.round(performance.now()); const has = es(); if (has && T.es.added == null) { T.es.added = now; T.es.seenEver = true; } if (!has && T.es.seenEver && T.es.removed == null) T.es.removed = now;
    const h = document.querySelector('.tll-story-hero'); if (h) for (const a of h.getAttributeNames()) if (a.indexOf('data-tll-mg-wait-') === 0 && !T.waitSeen[a]) T.waitSeen[a] = now; }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-tll-mg-wait-r', 'data-tll-mg-wait-d'] }); } catch (e) { }
  document.addEventListener('DOMContentLoaded', () => { T.dcl = Math.round(performance.now()); T.es.atDcl = es(); }, { capture: true });
};
const PROBE = () => {
  const T = window.__T; const r = n => { if (!n) return null; const b = n.getBoundingClientRect(); return [Math.round(b.top + scrollY), Math.round(b.left), Math.round(b.width), Math.round(b.height)]; };
  const core = [...document.querySelectorAll('script[src*="tll-site-layers-v16.js"]')].map(s => (s.src.match(/@([0-9a-f]{8})/) || [])[1]);
  const av = document.querySelector('.st3-author-avatar'), avi = document.querySelector('.st3-author-img');
  const cs = n => n ? getComputedStyle(n) : null;
  const hi = document.querySelector('.tll-story-hero-img'); let heroVis = null;
  if (hi) { let vis = true, n = hi; const b = hi.getBoundingClientRect(); while (n && n.nodeType === 1) { const c = getComputedStyle(n); if (c.visibility === 'hidden' || c.display === 'none' || +c.opacity === 0) { vis = false; break; } n = n.parentElement; }
    heroVis = { vis, w: Math.round(b.width), h: Math.round(b.height), complete: hi.complete, nw: hi.naturalWidth, src: (hi.currentSrc || '').replace(/^.*\//, '').slice(-60) }; }
  const wait = []; for (const e of document.querySelectorAll('*')) for (const a of e.getAttributeNames()) if (a.indexOf('data-tll-mg-wait-') === 0) wait.push(a);
  const sel = ['.tll-story-hero', '.tll-story-hero-img', 'h1', '.st3-author', '.tll-mg-rcpt', '.st3-author-fil' + 'ed', '.tll-story-body-section', 'footer'];
  const lay = {}; for (const s of sel) lay[s] = r(document.querySelector(s));
  return { core, selfDoc: typeof window.tllSelfDoc, magStyle: !!document.getElementById('tll-mag-story-v1'), magInBody: !!(document.getElementById('tll-mag-story-v1') && document.getElementById('tll-mag-story-v1').parentNode === document.body),
    esEnd: !!document.getElementById('tll-story-st3-early-v1'), es: T.es, waitSeen: T.waitSeen, waitEnd: wait, dcl: T.dcl,
    avatar: av ? { w: Math.round(av.getBoundingClientRect().width), h: Math.round(av.getBoundingClientRect().height), radius: cs(av).borderRadius, img: avi ? [Math.round(avi.getBoundingClientRect().width), Math.round(avi.getBoundingClientRect().height)] : null } : null,
    heroVis, rcptLine: !!document.querySelector('.tll-mg-rcpt'), lay, docH: document.documentElement.scrollHeight, y: Math.round(scrollY),
    sh: T.sh, lcp: T.lcp, fcp: T.fcp };
};
const UA_M = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
const UA_D = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
async function open(browser, { host, p, w, h, mode = 'fresh', Y = 2500, wait = 4000, traceInit = null }) {
  const mobile = w < 800, O = HOST[host], url = O + p;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1, userAgent: mobile ? UA_M : UA_D });
  const st = { aborted: 0, errs: [], cons: [], failed: [], scriptBad: [], blocked: [], docBytes: 0, net: 0, hit: 0, coreOk: null, pend: new Set(), ful: new Set(), stored: [] };
  let pg;
  await ctx.route('**/*', async rt => {
    const q = rt.request(), u = q.url();
    if (q.method() !== 'GET') { st.aborted++; return rt.abort(); }
    let pu = null; try { pu = new URL(u); } catch (e) { }
    if (pu && pu.origin === O) {
      if (q.isNavigationRequest()) return rt.continue();
      const k = SNAP[pu.pathname.replace(/\/$/, '') || '/'];
      if (k && !pu.search) return rt.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: fs.readFileSync(path.join(D, 'html', host, k + '.html')) });
    }
    if (u === MS_URL) return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: MSJS });
    const isWF = WF.test(u), isJ = JS.test(u), isG = GF.test(u);
    if (isWF || isJ || isG) {
      let c = load(u);
      if (!c) {
        const rtp = q.resourceType();
        if (isWF && (rtp === 'image' || rtp === 'media' || rtp === 'font' || MEDIA.test(pu ? pu.pathname : u))) { st.blocked.push(u.replace(/^.*\//, '').slice(-80)); bytes.blocked[u] = (bytes.blocked[u] || 0) + 1; return rt.abort(); }
        if (bytes.doc + bytes.wfSub + bytes.jsd + bytes.gf + bytes.other > 90e6) { st.failed.push('budget ' + u); return rt.abort(); }
        st.pend.add(u); return rt.continue();
      } else st.hit++;
      return rt.fulfill({ status: c.status, headers: c.headers, body: c.body });
    }
    if (['script', 'stylesheet'].includes(q.resourceType())) { const c = load(u); if (c) { st.hit++; st.ful.add(u); return rt.fulfill({ status: c.status, headers: c.headers, body: c.body }); } st.pend.add(u); }
    return rt.continue();
  });
  pg = await ctx.newPage(); await pg.addInitScript(INIT); if (traceInit) await pg.addInitScript(traceInit);
  pg.on('pageerror', e => st.errs.push(e.message.slice(0, 200)));
  pg.on('console', m => { if (m.type() === 'error') st.cons.push(m.text().slice(0, 200)); });
  pg.on('requestfailed', r => { const f = r.failure(); if (r.method() === 'GET') { const s = r.url().slice(0, 140) + ' ' + (f && f.errorText); st.failed.push(s); if (r.resourceType() === 'script') st.scriptBad.push(s); } });
  pg.on('requestfinished', async r => { try { const pu = new URL(r.url()); if (pu.origin === O && r.isNavigationRequest()) { const z = await r.sizes(); st.docBytes += z.responseBodySize + z.responseHeadersSize; }
    else if (!st.ful.has(r.url()) && !WF.test(r.url()) && !JS.test(r.url()) && !GF.test(r.url()) && r.url() !== MS_URL && /^https?:/.test(r.url())) { const z = await r.sizes(); st.net += z.responseBodySize; bytes.other += z.responseBodySize; } } catch (e) { } });
  pg.on('response', async r => { const u = r.url(); if (st.pend.has(u) && !IDX.has(u) && r.request().method() === 'GET' && r.status() === 200) { try { const b = await r.body(); const hd = await r.allHeaders(); for (const x of ['content-encoding', 'content-length', 'transfer-encoding']) delete hd[x];
      if (!IDX.has(u)) { store(u, r.status(), hd, b); st.net += b.length; st.stored.push(u.slice(0, 140)); if (WF.test(u)) { bytes.wfSub += b.length; bytes.wfSubn++; bytes.wfu.push([u.slice(0, 160), b.length, r.request().resourceType()]); } else if (JS.test(u)) { bytes.jsd += b.length; bytes.jsdn++; } else if (GF.test(u)) bytes.gf += b.length; else st.net -= b.length; save(); } } catch (e) { st.failed.push('store ' + u.slice(0, 100) + ' ' + e.message.slice(0, 60)); } } });
  pg.on('response', r => { const u = r.url(); if (r.request().resourceType() === 'script' && r.status() >= 400) st.scriptBad.push(r.status() + ' ' + u.slice(0, 140)); if (/tll-site-layers-v16\.js/.test(u)) st.coreOk = r.status(); });
  if (mode === 'restore') {
    await pg.goto(url, { waitUntil: 'load', timeout: 120000 }); await pg.waitForTimeout(2500);
    await pg.evaluate(y => scrollTo(0, y), Y); await pg.waitForTimeout(800);
    st.errs.length = 0; st.cons.length = 0; st.failed.length = 0; st.scriptBad.length = 0; st.blocked.length = 0;
    await pg.reload({ waitUntil: 'load', timeout: 120000 });
  } else await pg.goto(url, { waitUntil: 'load', timeout: 120000 });
  await pg.waitForFunction(ms => performance.now() >= ms, wait, { timeout: 60000, polling: 100 }).catch(() => { });
  await pg.waitForTimeout(300);
  return { ctx, pg, st };
}
function addDoc(n) { bytes.doc += n; bytes.docn++; save(); }
module.exports = { open, PROBE, D, addDoc, bytes: () => bytes };
