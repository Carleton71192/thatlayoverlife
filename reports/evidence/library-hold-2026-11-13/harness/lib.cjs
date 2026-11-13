/* Library hold harness, 13 Nov 2026. Same measurement as nov12/fonts/review/m.cjs and nov13/fontrel/check/h/lib.cjs (buffered
   PerformanceObserver, isMobile+hasTouch, DPR 3 on phones, Memberstack held 40 s, every non-GET aborted), under the bandwidth rule:
   the home document is the live www HTML fetched once by plain GET after the 07:35 publish (fontrel/www/raw/home.html); every Webflow
   host request is served from the shared local cache (fontrel/check/cache) and anything not in it is aborted, so this harness downloads
   0 Webflow bytes. The core and chunks at the live pin (1f2e549a) are served from a variant build dir, with the core SRI rewritten.
   Google fonts stay live (not Webflow). On slow 4G, CDP throttles live requests and cache-served responses get latency + size/throughput. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const D = path.join(__dirname, '..');
const NOV13 = path.join(D, '../..');
const CACHE = path.join(NOV13, 'fontrel/check/cache');
const DOC = path.join(NOV13, 'fontrel/www/raw/home.html');
const SLOW = { offline: false, downloadThroughput: 1.6 * 1024 * 1024 / 8 * .9, uploadThroughput: 750 * 1024 / 8 * .9, latency: 150 * 3.75 };
const MS_URL = 'https://static.memberstack.com/scripts/v2/memberstack.js';
const MS_FIND = "i.A.appFetchFailed&&n.push(\"[data-ms-content]:not([data-ms-content^='!'])\")";
const MSJS = (() => { const b = fs.readFileSync(path.join(NOV13, '../nov12/fonts/review/ms.js'), 'utf8'); if (b.split(MS_FIND).length !== 2) throw new Error('ms'); return b.replace(MS_FIND, 'void 0'); })();
const WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const PIN = 'https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@1f2e549aee8627b2f67211463f764380f751c17b/src/site-layers/';
const key = u => crypto.createHash('sha1').update(u).digest('hex');
const sri = b => 'sha384-' + crypto.createHash('sha384').update(b).digest('base64');
const URL0 = 'https://www.thatlayover.life/';
const docs = {};
function doc(v) {
  if (docs[v]) return docs[v];
  let h = fs.readFileSync(DOC, 'utf8');
  const core = fs.readFileSync(path.join(D, 'builds', v, 'src/site-layers/tll-site-layers-v16.js'));
  const rx = /(<script src="https:\/\/cdn\.jsdelivr\.net\/gh\/Carleton71192\/thatlayoverlife@1f2e549aee8627b2f67211463f764380f751c17b\/src\/site-layers\/tll-site-layers-v16\.js"[^>]*integrity=")([^"]+)(")/;
  if (!rx.test(h)) throw new Error('core tag');
  h = h.replace(rx, (m, a, b, c) => a + sri(core) + c);
  const ex = path.join(D, 'builds', v, 'doc-edit.cjs');
  if (fs.existsSync(ex)) h = require(ex)(h);
  return docs[v] = Buffer.from(h);
}
const INIT = () => {
  const T = { sh: [], fc: {}, paint: {}, tl: [] }; window.__T = T;
  T.ro = []; const SEL = ['[data-h3-hero]', '#tll-val', '.h3-intro', '.h3-shelf-head', '[data-h3-track]', '.h3-shelf-foot', 'section.h3g', 'figure.h3-il', '#tll-shelf', '.h3-shelf-note'];
  const seen = new Set(); let ro = null;
  try { ro = new ResizeObserver(es => { const t = Math.round(performance.now()); for (const e of es) T.ro.push([t, e.target.__k, Math.round(e.contentRect.height), Math.round(scrollY)]); }); } catch (e) { }
  const attach = () => { if (!ro) return; for (const k of SEL) { const n = document.querySelector(k); if (n && !seen.has(n)) { seen.add(n); n.__k = k; ro.observe(n); } } };
  try { const mo = new MutationObserver(attach); mo.observe(document, { childList: true, subtree: true }); setTimeout(() => mo.disconnect(), 8000); } catch (e) { }
  window.addEventListener('scroll', () => T.ro.push([Math.round(performance.now()), 'scroll', null, Math.round(scrollY)]), { passive: true });
  window.__TLLSNAP = () => { const g = s => { const n = document.querySelector(s); if (!n) return null; const r = n.getBoundingClientRect(); return [Math.round(r.top + scrollY), Math.round(r.height)]; };
    return { y: Math.round(scrollY), hero: g('[data-h3-hero]'), val: g('#tll-val'), intro: g('.h3-intro'), shelf: g('[data-h3-shelf]'), head: g('.h3-shelf-head'), track: g('[data-h3-track]'), foot: g('.h3-shelf-foot'), h3g: g('section.h3g'), il: g('figure.h3-il'), cap: g('figure.h3-il figcaption'), srch: g('#tll-shelf') }; };
  const desc = n => { if (!n || n.nodeType !== 1) return n ? n.nodeName : 'null'; let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; if (c.length) s += '.' + c.join('.'); return s; };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.sh.push({ v: e.value, t: Math.round(e.startTime), inp: e.hadRecentInput,
    src: (e.sources || []).slice(0, 5).map(x => [desc(x.node), Math.round(x.previousRect.y), Math.round(x.currentRect.y), Math.round(x.previousRect.height), Math.round(x.currentRect.height)]), snap: window.__TLLSNAP ? window.__TLLSNAP() : null }); }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.paint[e.name] = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true }); } catch (e) { }
  const iv = setInterval(() => { const now = Math.round(performance.now()); try { document.fonts.forEach(f => { const k = f.family.replace(/["']/g, '') + ' ' + f.weight + (f.style === 'italic' ? 'i' : '');
    if (f.status === 'loading' && T.fc['>' + k] === undefined) T.fc['>' + k] = now; if (f.status === 'loaded' && T.fc[k] === undefined) T.fc[k] = now; }); } catch (e) { }
    if (window.__TLLTRACE) { const tr = document.querySelector('[data-h3-track]'), g = document.querySelector('section.h3g'), il = document.querySelector('figure.h3-il'), v = document.getElementById('tll-val');
      const row = [now, tr ? Math.round(tr.getBoundingClientRect().height) : null, g ? Math.round(g.getBoundingClientRect().top + scrollY) : null, il ? Math.round(il.getBoundingClientRect().top + scrollY) : null, il ? Math.round(il.getBoundingClientRect().height) : null, v ? Math.round(v.getBoundingClientRect().top + scrollY) : null, Math.round(scrollY), (n => n ? Math.round(n.getBoundingClientRect().height) : null)(document.querySelector('.h3-shelf-note')), (n => n ? Math.round(n.getBoundingClientRect().top + scrollY) : null)(document.querySelector('[data-h3-shelf]')), (n => n ? Math.round(n.getBoundingClientRect().height) : null)(document.querySelector('[data-h3-shelf]'))];
      const last = T.tl[T.tl.length - 1]; if (!last || row.slice(1).join() !== last.slice(1).join()) T.tl.push(row); }
    if (now > 40000) clearInterval(iv); }, 15);
};
const UA_M = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
async function one(browser, { v, w, h, mode, Y = 0, trace = false, shot = null }) {
  const mobile = w < 800;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1, userAgent: UA_M });
  const st = { slow: false, aborted: 0, miss: [], hit: 0, errs: [], wfnet: 0 };
  let link = 0;
  const delay = async n => { if (!st.slow) return; const now = Date.now(); const start = Math.max(now + SLOW.latency, link); link = start + n / SLOW.downloadThroughput * 1000; await new Promise(f => setTimeout(f, link - now)); };
  const pgRef = {};
  await ctx.route('**/*', async rt => {
    const q = rt.request(), u = q.url();
    if (q.method() !== 'GET') { st.aborted++; return rt.abort(); }
    if (q.isNavigationRequest() && q.frame() === pgRef.p?.mainFrame() && u.split('#')[0].split('?')[0] === URL0) {
      const b = doc(v); await delay(b.length / 4); return rt.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: b }); }
    if (u.startsWith(PIN)) { const f = path.join(D, 'builds', v, 'src/site-layers', u.slice(PIN.length).split('?')[0]); if (!fs.existsSync(f)) return rt.fulfill({ status: 404, body: '' });
      const b = fs.readFileSync(f); await delay(b.length / 3); return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body: b }); }
    if (u.startsWith('https://stall.invalid/')) { await new Promise(f => setTimeout(f, 1500)); return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript' }, body: '' }); }
    if (u === MS_URL) { await new Promise(f => setTimeout(f, 40000)); return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: MSJS }); }
    if (WF.test(u)) {
      const k = key(u), fb = path.join(CACHE, k + '.b'), fm = path.join(CACHE, k + '.json');
      if (fs.existsSync(fm)) { const m = JSON.parse(fs.readFileSync(fm)); const b = fs.readFileSync(fb); st.hit++; await delay(b.length); return rt.fulfill({ status: m.status, headers: m.headers, body: b }); }
      st.miss.push(u.slice(0, 140)); return rt.abort();
    }
    return rt.continue();
  });
  const pg = await ctx.newPage(); pgRef.p = pg; await pg.addInitScript(INIT);
  if (trace) await pg.addInitScript(() => { window.__TLLTRACE = 1; });
  pg.on('pageerror', e => st.errs.push('pageerror: ' + e.message.slice(0, 200)));
  const cdp = await ctx.newCDPSession(pg); await cdp.send('Network.enable');
  const throttle = async () => { await cdp.send('Network.emulateNetworkConditions', SLOW); st.slow = true; };
  if (mode === 'slow') await throttle();
  if (mode === 'restore' || mode === 'rslow') {
    await pg.goto(URL0, { waitUntil: 'load', timeout: 180000 }); await pg.waitForTimeout(2500);
    await pg.evaluate(y => scrollTo(0, y), +Y); await pg.waitForTimeout(800);
    st.errs.length = 0; st.miss.length = 0;
    if (mode === 'rslow') await throttle();
    await pg.reload({ waitUntil: 'load', timeout: 180000 });
  } else await pg.goto(URL0, { waitUntil: 'load', timeout: 180000 });
  await pg.waitForTimeout(st.slow ? 12000 : 6000);
  const r = await pg.evaluate(() => { const T = window.__T; const tr = document.querySelector('[data-h3-track]');
    return { sh: T.sh, paint: T.paint, tl: T.tl, ro: T.ro, y: Math.round(scrollY), trackH: tr ? Math.round(tr.getBoundingClientRect().height) : null,
      shown: tr ? [].filter.call(tr.querySelectorAll('.h3-card'), c => !c.hidden).map(c => [c.getAttribute('data-slug'), Math.round(c.getBoundingClientRect().height)]) : null,
      total: (document.querySelector('[data-h3-total]') || {}).textContent, val: !!document.getElementById('tll-val'),
      valLow: !!document.querySelector('#tll-val.tll-val-low') }; });
  if (shot) await pg.screenshot({ path: shot, fullPage: false });
  await ctx.close();
  const cls = r.sh.reduce((a, e) => a + e.v, 0);
  return { cls: +cls.toFixed(5), ...r, aborted: st.aborted, hit: st.hit, miss: st.miss.length, missU: [...new Set(st.miss)].slice(0, 30), errs: st.errs };
}
module.exports = { one, doc, D };
