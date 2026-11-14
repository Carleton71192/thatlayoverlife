/* Independent behavior check of the 14 Nov 2026 07:34 test-site publish (16.64.0) against www (16.63.0).
   Documents: one plain GET per page per host (raw/www, raw/test). Variant W = www HTML at the www address; T = test HTML at the www
   address (test host names swapped, as a www publish writes them); Tt = test HTML at the test address.
   Same-origin GETs for a path we hold (stories, pet page, sitemap, ...) are served from the same variant's snapshot.
   Webflow hosts: local cache (own cache, then the 13 Nov shared cache read only); a miss is fetched once and stored. jsDelivr likewise.
   Every non-GET aborted. Memberstack served patched (no content hiding on failed app fetch), not held. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const D = path.join(__dirname, '..');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const CACHE = path.join(D, 'cache'), OLD = path.join(SP, 'nov13/fontrel/check/cache'), JSD = path.join(D, 'jsd'), BYTES = path.join(D, 'out', 'net-bytes.json');
const MS_URL = 'https://static.memberstack.com/scripts/v2/memberstack.js';
const MS_FIND = "i.A.appFetchFailed&&n.push(\"[data-ms-content]:not([data-ms-content^='!'])\")";
const MSJS = (() => { const b = fs.readFileSync(path.join(SP, 'nov12/fonts/review/ms.js'), 'utf8'); if (b.split(MS_FIND).length !== 2) throw new Error('ms'); return b.replace(MS_FIND, 'void 0'); })();
const WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const JS = /^https:\/\/cdn\.jsdelivr\.net\//;
let bytes = fs.existsSync(BYTES) ? JSON.parse(fs.readFileSync(BYTES)) : { wf: 0, wfn: 0, wfu: [], jsd: 0, jsdn: 0 };
const LIMIT = 60e6;
const key = u => crypto.createHash('sha1').update(u).digest('hex');
const PAGES = { '/': 'home', '/the-paw-passport': 'paw', '/about': 'about', '/stories': 'stories', '/pets/magnus-waffles': 'pet', '/sitemap.xml': 'sitemap' };
function addPage(p, k) { PAGES[p] = k; }
function raw(side, k, swap) { let h = fs.readFileSync(path.join(D, 'raw', side, k + '.html'), 'utf8');
  if (swap) h = h.split('https://that-layover-life.webflow.io').join('https://www.thatlayover.life').split('that-layover-life.webflow.io').join('www.thatlayover.life');
  return Buffer.from(h); }
const side = v => v === 'W' ? 'www' : 'test';
const origin = v => v === 'Tt' ? 'https://that-layover-life.webflow.io' : 'https://www.thatlayover.life';
const INIT = () => {
  const T = { sh: [], tl: [], mut: [], dcl: null, hero0: null }; window.__T = T;
  const desc = n => { if (!n || n.nodeType !== 1) return n ? n.nodeName : 'null'; let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; if (c.length) s += '.' + c.join('.'); return s; };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) T.sh.push({ v: +e.value.toFixed(5), t: Math.round(e.startTime), inp: e.hadRecentInput,
    src: (e.sources || []).slice(0, 5).map(x => [desc(x.node), Math.round(x.previousRect.y), Math.round(x.currentRect.y), Math.round(x.previousRect.height), Math.round(x.currentRect.height)]) }); }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { }
  const g = s => { const n = document.querySelector(s); if (!n) return null; const r = n.getBoundingClientRect(); return [Math.round(r.top + scrollY), Math.round(r.height)]; };
  let mo = null, seen = null;
  const iv = setInterval(() => { const now = Math.round(performance.now());
    const tr = document.querySelector('[data-h3-track]');
    if (tr && tr !== seen) { seen = tr; try { mo = new MutationObserver(ms => { T.mut.push([Math.round(performance.now()), ms.length]); }); mo.observe(tr, { childList: true }); } catch (e) { } }
    const row = [now, tr ? Math.round(tr.getBoundingClientRect().height) : null, (g('#tll-val') || [null])[0], (g('[data-h3-shelf]') || [null])[0], Math.round(scrollY)];
    const last = T.tl[T.tl.length - 1]; if (!last || row.slice(1).join() !== last.slice(1).join()) T.tl.push(row);
    if (now > 20000) clearInterval(iv); }, 15);
  document.addEventListener('DOMContentLoaded', () => { T.dcl = Math.round(performance.now());
    const i = document.querySelector('.tll-story-hero-img'); if (i) { const r = i.getBoundingClientRect(); T.hero0 = { h: Math.round(r.height), w: Math.round(r.width), complete: i.complete, nw: i.naturalWidth }; } });
};
const UA_M = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
const UA_D = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
function fromCache(u) { const k = key(u);
  for (const dir of [CACHE, OLD]) { const fm = path.join(dir, k + '.json'); if (fs.existsSync(fm)) { const m = JSON.parse(fs.readFileSync(fm)); return { status: m.status, headers: m.headers, body: fs.readFileSync(path.join(dir, k + '.b')) }; } }
  return null; }
async function open(browser, { v, p, w, h, mode = 'fresh', Y = 2500, wait = 6000, holdImgMs = 0, js = true, traceInit = null }) {
  const mobile = w < 800;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1, userAgent: mobile ? UA_M : UA_D, javaScriptEnabled: js });
  const st = { aborted: 0, errs: [], failed: [], selfFetch: {}, reqs: [], netWF: 0, netJSD: 0, hit: 0, scriptBad: [] };
  const O = origin(v), url = O + p;
  await ctx.route('**/*', async rt => {
    const q = rt.request(), u = q.url();
    if (q.method() !== 'GET') { st.aborted++; return rt.abort(); }
    let pu = null; try { pu = new URL(u); } catch (e) { }
    if (pu && pu.origin === O) { const k = PAGES[pu.pathname.replace(/\/$/, '') || '/']; if (k) {
      if (!(q.isNavigationRequest() && q.frame() === pg.mainFrame())) st.selfFetch[pu.pathname] = (st.selfFetch[pu.pathname] || 0) + 1;
      return rt.fulfill({ status: 200, headers: { 'content-type': k === 'sitemap' ? 'application/xml' : 'text/html; charset=utf-8', 'cache-control': 'no-cache' }, body: raw(side(v), k, v === 'T') }); } }
    if (u === MS_URL) return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: MSJS });
    const isWF = WF.test(u), isJ = JS.test(u);
    if (isWF || isJ) {
      let c = fromCache(u);
      if (!c) {
        if (isWF && pu && (pu.origin === O)) { st.failed.push('uncached same-origin ' + pu.pathname); return rt.fulfill({ status: 404, body: '' }); }
        if (bytes.wf + bytes.jsd > LIMIT) { st.failed.push('budget ' + u); return rt.abort(); }
        try { const r = await rt.fetch({ timeout: 120000 }); const b = await r.body(); const hd = r.headers(); delete hd['content-encoding']; delete hd['content-length']; delete hd['transfer-encoding'];
          const k = key(u); fs.writeFileSync(path.join(CACHE, k + '.b'), b); fs.writeFileSync(path.join(CACHE, k + '.json'), JSON.stringify({ u, status: r.status(), headers: hd }));
          if (isWF) { bytes.wf += b.length; bytes.wfn++; bytes.wfu.push([u.slice(0, 160), b.length, q.resourceType()]); st.netWF += b.length; } else { bytes.jsd += b.length; bytes.jsdn++; st.netJSD += b.length; }
          fs.writeFileSync(BYTES, JSON.stringify(bytes)); c = { status: r.status(), headers: hd, body: b }; }
        catch (e) { st.failed.push('fetch ' + u.slice(0, 120) + ' ' + e.message.slice(0, 80)); return rt.abort(); }
      } else st.hit++;
      if (holdImgMs && q.resourceType() === 'image' && isWF) await new Promise(f => setTimeout(f, holdImgMs));
      return rt.fulfill({ status: c.status, headers: c.headers, body: c.body });
    }
    return rt.continue();
  });
  const pg = await ctx.newPage(); await pg.addInitScript(INIT); if (traceInit) await pg.addInitScript(traceInit);
  pg.on('request', r => st.reqs.push([r.resourceType(), r.url().slice(0, 200)]));
  pg.on('pageerror', e => st.errs.push('pageerror: ' + e.message.slice(0, 200)));
  pg.on('console', m => { if (m.type() === 'error') st.errs.push('console: ' + m.text().slice(0, 200)); });
  pg.on('requestfailed', r => { const f = r.failure(); if (r.method() === 'GET') { const s = r.url().slice(0, 140) + ' ' + (f && f.errorText); st.failed.push(s); if (r.resourceType() === 'script') st.scriptBad.push(s); } });
  pg.on('response', r => { if (r.request().resourceType() === 'script' && r.status() >= 400) st.scriptBad.push(r.status() + ' ' + r.url().slice(0, 140)); });
  if (mode === 'restore') {
    await pg.goto(url, { waitUntil: 'load', timeout: 120000 }); await pg.waitForTimeout(2500);
    await pg.evaluate(y => scrollTo(0, y), Y); await pg.waitForTimeout(800);
    st.errs.length = 0; st.failed.length = 0; st.reqs.length = 0; st.selfFetch = {};
    await pg.reload({ waitUntil: 'load', timeout: 120000 });
  } else await pg.goto(url, { waitUntil: 'load', timeout: 120000 });
  await pg.waitForTimeout(wait);
  return { ctx, pg, st };
}
const PROBE = () => {
  const T = window.__T || { sh: [], tl: [], mut: [] }; const g = s => { const n = document.querySelector(s); if (!n) return null; const r = n.getBoundingClientRect(); return [Math.round(r.top + scrollY), Math.round(r.height)]; };
  const core = [...document.querySelectorAll('script[src*="tll-site-layers-v16.js"]')].map(s => (s.src.match(/@([0-9a-f]{8})/) || [])[1]);
  const val = document.getElementById('tll-val'); const lib = document.querySelector('[data-h3-shelf]'); const libE = lib && lib.closest('.w-embed');
  const txt = s => [...document.querySelectorAll(s)].map(n => n.textContent.trim().replace(/\s+/g, ' ').slice(0, 160));
  const foot = (() => { const f = document.querySelector('footer'); if (!f) return null; const w = document.createTreeWalker(f, NodeFilter.SHOW_TEXT); let t; while (t = w.nextNode()) { if (/countries in our stories/.test(t.nodeValue)) { let e = t.parentNode; for (let i = 0; i < 4 && e.parentNode && !/stor(y|ies)[\s\S]*travel/i.test(e.textContent); i++) e = e.parentNode; return e.innerText.replace(/\s+/g, ' ').trim().slice(0, 200); } } return null; })();
  const body = document.body.innerText;
  const tr = document.querySelector('[data-h3-track]');
  const hi = document.querySelector('.tll-story-hero-img');
  return { core, selfDoc: typeof window.tllSelfDoc, petC: typeof window.tllPetCountries, y: Math.round(scrollY), docH: document.documentElement.scrollHeight,
    hero: g('[data-h3-hero]'), val: g('#tll-val'), valLow: !!document.querySelector('#tll-val.tll-val-low'), valTxt: val ? /The trip deck\./.test(val.textContent) && /Sacramento/.test(val.textContent) : null,
    valAfterLib: (val && libE) ? !!(libE.compareDocumentPosition(val) & Node.DOCUMENT_POSITION_FOLLOWING) : null, valPrevIsHero: val ? !!(val.previousElementSibling && val.previousElementSibling.matches('[data-h3-hero]')) : null,
    shelf: g('[data-h3-shelf]'), trackH: tr ? Math.round(tr.getBoundingClientRect().height) : null, cards: tr ? [].filter.call(tr.querySelectorAll('.h3-card'), c => !c.hidden).length : null,
    foot, mag: txt('[data-h3-mag-wrap]'), magN: txt('[data-tll-mag-n]'), about: txt('[data-tll-about-count]').concat(txt('[data-tll-about-fact]')),
    writers: (body.match(/\b\w+ writers? so far\./) || [null])[0], c22: (body.match(/\b\d+\s+(countries|COUNTRIES|Countries)\b/g) || []).slice(0, 12),
    bad: (body.match(/NaN|undefined|\{n\}|\{countries\}/g) || []).slice(0, 5),
    heroImg: hi ? { h: Math.round(hi.getBoundingClientRect().height), w: Math.round(hi.getBoundingClientRect().width), ar: getComputedStyle(hi).aspectRatio, r: hi.style.getPropertyValue('--tll-hero-r'), complete: hi.complete } : null,
    hero0: T.hero0, dcl: T.dcl, sh: T.sh, tl: T.tl, mut: T.mut,
    pf: (() => { const s = document.querySelectorAll('[data-pf5="story-card"]'), pt = document.querySelectorAll('[data-pf5="pet-card"]'); const vis = n => n.getClientRects().length > 0; return { stories: s.length, storiesVis: [].filter.call(s, vis).length, pets: pt.length, petsVis: [].filter.call(pt, vis).length, pre: !!document.getElementById('tll-pf5-pre-v1') }; })() };
};
module.exports = { open, PROBE, addPage, bytes: () => bytes, D };
