/* 16.64.0 regression harness (14 Nov 2026). Test site vs www, same treatment for both.
   Documents: saved plain-GET copies (carry-1664, chk1664 raw); a missing same-origin page is fetched once and cached here.
   Webflow images/fonts: served from local caches only; missing images answered with a 1x1 PNG, missing fonts and video aborted.
   Webflow scripts/CSS: local caches, else fetched once and cached. jsDelivr repo files: served from git at the pinned commit.
   Every non-GET aborted. Ad and analytics hosts: recorded and aborted. */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const R = SP + '/nov14/regr', MY = R + '/cache', REPO = '/home/user/thatlayoverlife';
const CACHES = [SP + '/nov13/fontrel/check/cache', SP + '/nov14/chk1664/cache', MY];
const HOST = { t: 'https://that-layover-life.webflow.io', w: 'https://www.thatlayover.life' };
const RAWD = { t: [SP + '/carry-1664/t', SP + '/nov14/chk1664/raw/test'], w: [SP + '/carry-1664/w', SP + '/nov14/chk1664/raw/www'] };
const DOCS = { '/': 'home', '/about': 'about', '/cookies': 'cookies', '/for-expats': 'for-expats', '/layovers': 'layovers', '/stories': 'stories',
  '/the-map': 'the-map', '/the-paw-passport': 'the-paw-passport', '/travelers': 'travelers', '/stories/vietnam-ninja-duckies': 'stories__vietnam-ninja-duckies',
  '/pets/magnus-waffles': 'pet', '/sitemap.xml': 'sitemap' };
const WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const ADS = /googlesyndication|googletagmanager|google-analytics|doubleclick|adservice\.google|googleadservices|clarity\.ms|facebook\.net|hotjar|plausible|adtrafficquality|amazon-adsystem|analytics\.ahrefs/i;
const CMP = /fundingchoicesmessages|gstatic\.com/i;
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
const key = u => crypto.createHash('sha1').update(u).digest('hex');
const stats = { wfFetched: 0, wfFetchedList: [], otherFetched: 0, otherHosts: {} };
function fromCache(u) { for (const d of CACHES) { const f = path.join(d, key(u) + '.json'); if (fs.existsSync(f)) { const m = JSON.parse(fs.readFileSync(f)); return { status: m.status, headers: m.headers, body: fs.readFileSync(path.join(d, key(u) + '.b')) }; } } return null; }
function save(u, status, headers, body) { fs.writeFileSync(path.join(MY, key(u) + '.json'), JSON.stringify({ u, status, headers })); fs.writeFileSync(path.join(MY, key(u) + '.b'), body); }
function docFile(h, p) { const n = DOCS[p]; if (!n) return null; for (const d of RAWD[h]) { const f = path.join(d, n + '.html'); if (fs.existsSync(f)) return f; } return null; }
function gitFile(sha, p) { try { return cp.execFileSync('git', ['-C', REPO, 'show', sha + ':' + p], { maxBuffer: 1 << 26 }); } catch (e) { return null; } }
const gitMemo = {};
const strip = h => { const o = Object.assign({}, h); delete o['content-encoding']; delete o['content-length']; delete o['transfer-encoding']; return o; };

/* scenario: { host, path, w, h, dpr, mobile, slow, cpu, fail: [regex strings for same-origin paths answered 500], scroll, consentClick, name } */
async function runOne(browser, sc) {
  const origin = HOST[sc.host];
  const PROF = fs.readFileSync(R + '/h/profile.path', 'utf8').trim(); const realPath = sc.path === '/contributors/X' ? PROF : sc.path; DOCS[PROF] = 'profile';
  const ctx = await browser.newContext({ viewport: { width: sc.w, height: sc.h }, deviceScaleFactor: sc.dpr || 1, isMobile: !!sc.mobile, hasTouch: !!sc.mobile,
    userAgent: sc.mobile ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36' : undefined });
  const st = { reqs: [], nonGet: 0, ads: [], errs: [], cons: [], placeholders: 0, fontsAborted: 0, same: [], failHits: [], cmp: [] };
  const t0 = Date.now();
  const delay = n => sc.slow ? new Promise(f => setTimeout(f, 150 + Math.round((n || 0) * 8 / 1.6e6 * 1000))) : null;
  const ful = async (rt, o) => { const d = delay(o.body ? o.body.length : 0); if (d) await d; return rt.fulfill(o); };
  await ctx.route('**/*', async rt => {
    const q = rt.request(), u = q.url(), ty = q.resourceType();
    if (q.method() !== 'GET') { st.nonGet++; return rt.abort(); }
    if (ADS.test(u)) { st.ads.push({ at: Date.now() - t0, u: u.slice(0, 120) }); return rt.abort(); }
    if (CMP.test(u)) st.cmp.push({ at: Date.now() - t0, u: u.slice(0, 100) });
    st.reqs.push({ at: Date.now() - t0, ty, u: u.slice(0, 200) });
    if (u.startsWith(origin + '/') || u === origin) {
      const p = (new URL(u).pathname.replace(/\/+$/, '') || '/');
      st.same.push((p === PROF ? '/contributors/X' : p) + (q.isNavigationRequest() ? ' (nav)' : ''));
      if ((sc.fail || []).some(r => new RegExp(r).test(p)) && !q.isNavigationRequest()) { st.failHits.push(p); return ful(rt, { status: 500, headers: { 'content-type': 'text/html' }, body: '<!doctype html><title>500</title>Server error' }); }
      const f = docFile(sc.host, p);
      if (f) return ful(rt, { status: 200, headers: { 'content-type': p === '/sitemap.xml' ? 'application/xml' : 'text/html; charset=utf-8' }, body: fs.readFileSync(f) });
      const c = fromCache(u.split('#')[0]);
      if (c) return ful(rt, { status: c.status, headers: strip(c.headers), body: c.body });
      if (ty === 'image' || ty === 'media' || ty === 'font') { st.placeholders++; return rt.abort(); }
      const r = await rt.fetch(); const b = await r.body(); stats.wfFetched += b.length; stats.wfFetchedList.push(u.replace(origin, sc.host + ':') + ' ' + b.length);
      save(u.split('#')[0], r.status(), r.headers(), b); return ful(rt, { status: r.status(), headers: strip(r.headers()), body: b });
    }
    if (sc.noCore && /cdn\.jsdelivr\.net\/gh\/carleton71192/i.test(u)) { st.failHits.push('core blocked'); return rt.abort(); }
    const jm = u.match(/^https:\/\/cdn\.jsdelivr\.net\/gh\/carleton71192\/thatlayoverlife@([0-9a-f]{40})\/([^?#]+)/i);
    if (jm) { const k = jm[1] + ':' + jm[2]; if (!(k in gitMemo)) gitMemo[k] = gitFile(jm[1], decodeURIComponent(jm[2]));
      const b = gitMemo[k]; if (b) return ful(rt, { status: 200, headers: { 'content-type': /\.json$/.test(jm[2]) ? 'application/json' : 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body: b }); }
    if (WF.test(u)) {
      const c = fromCache(u);
      if (c) return ful(rt, { status: c.status, headers: Object.assign(strip(c.headers), { 'access-control-allow-origin': '*' }), body: c.body });
      if (ty === 'image') { st.placeholders++; return ful(rt, { status: 200, headers: { 'content-type': 'image/png', 'access-control-allow-origin': '*' }, body: PNG }); }
      if (ty === 'font' || ty === 'media' || /\.(woff2?|ttf|otf|mp4|webm|jpe?g|png|webp|avif|gif|svg)(\?|$)/i.test(u)) { st.fontsAborted++; return rt.abort(); }
      const r = await rt.fetch(); const b = await r.body(); stats.wfFetched += b.length; stats.wfFetchedList.push(u + ' ' + b.length);
      save(u, r.status(), r.headers(), b); return ful(rt, { status: r.status(), headers: strip(r.headers()), body: b });
    }
    // third party GET: cache every 200 answer (same treatment for both hosts); images answered with a placeholder, fonts and media aborted
    if (ty === 'image' || ty === 'font' || ty === 'media') { st.placeholders++; return ty === 'image' ? ful(rt, { status: 200, headers: { 'content-type': 'image/png' }, body: PNG }) : rt.abort(); }
    if (/challenges\.cloudflare\.com/.test(u)) return rt.abort();
    { const c = fromCache(u); if (c) return ful(rt, { status: c.status, headers: Object.assign(strip(c.headers), { 'access-control-allow-origin': c.headers['access-control-allow-origin'] || '*' }), body: c.body }); }
    try { const r = await rt.fetch(); const b = await r.body(); stats.otherFetched += b.length; const hn = new URL(u).host; stats.otherHosts[hn] = (stats.otherHosts[hn] || 0) + b.length;
      if (r.status() === 200 && ty !== 'document' && !/workers\.dev|memberstack\.com\/(?!scripts)/.test(u)) save(u, r.status(), r.headers(), b); return ful(rt, { status: r.status(), headers: strip(r.headers()), body: b }); } catch (e) { return rt.abort(); }
  });
  await ctx.addInitScript(() => {
    window.__cls = 0; window.__shifts = []; window.__lcp = null; window.__ev = [];
    try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__cls += e.value; window.__shifts.push([Math.round(e.startTime), +e.value.toFixed(4), (e.sources || []).map(s => s.node && s.node.nodeType === 1 ? (s.node.className || s.node.tagName).toString().slice(0, 40) : '#').join('|')]); } }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}
    try { new PerformanceObserver(l => { const e = l.getEntries().pop(); if (e) window.__lcp = [Math.round(e.startTime), e.element ? (e.element.tagName + '.' + (e.element.className || '').toString().slice(0, 30)) : '', (e.url || '').split('/').pop().slice(0, 60)]; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) {}
    document.addEventListener('h3:stories', () => window.__ev.push(['h3:stories', Math.round(performance.now())]));
  });
  const pg = await ctx.newPage();
  if (sc.cpu) { const s = await ctx.newCDPSession(pg); await s.send('Emulation.setCPUThrottlingRate', { rate: sc.cpu }); }
  pg.on('pageerror', e => st.errs.push(String(e.message).slice(0, 200)));
  pg.on('console', m => { if (m.type() === 'error') st.cons.push(m.text().slice(0, 200)); });
  const url = origin + realPath;
  try { await pg.goto(url, { waitUntil: 'load', timeout: 120000 }); } catch (e) { st.errs.push('goto ' + e.message.slice(0, 100)); }
  await pg.waitForTimeout(sc.wait || 4000);
  const probe = await pg.evaluate(PROBE).catch(e => ({ probeErr: e.message.slice(0, 200) }));
  let probe2 = null;
  if (sc.scroll) {
    await pg.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise(f => setTimeout(f, 250)); } });
    await pg.waitForTimeout(2500);
    probe2 = await pg.evaluate(PROBE).catch(e => ({ probeErr: e.message.slice(0, 200) }));
  }
  let after = null; if (sc.after) { try { after = await sc.after(pg); } catch (e) { after = { err: e.message.slice(0, 200) }; } }
  if (sc.shot) { await pg.evaluate(() => scrollTo(0, 0)); }
  const out = { name: sc.name, host: sc.host, path: sc.path, w: sc.w, dpr: sc.dpr || 1, slow: !!sc.slow, fail: sc.fail || [],
    errs: st.errs, cons: st.cons.filter(x => !/ERR_FAILED|net::|Failed to load resource/.test(x)), consNet: st.cons.filter(x => /ERR_FAILED|net::|Failed to load resource/.test(x)).length,
    ads: st.ads, cmp: st.cmp.length, nonGet: st.nonGet, same: st.same, failHits: st.failHits, placeholders: st.placeholders,
    imgs: st.reqs.filter(r => r.ty === 'image' && /website-files/.test(r.u)).map(r => r.at + ' ' + r.u.replace(/^https:\/\/cdn\.prod\.website-files\.com\/[0-9a-f]+\//, '')),
    probe, probe2, after };
  await ctx.close();
  return out;
}
const PROBE = () => {
  const T = s => (s || '').replace(/\s+/g, ' ').trim();
  const o = { cls: +window.__cls.toFixed(4), shifts: window.__shifts.slice(0, 12), lcp: window.__lcp, ev: window.__ev, sw: document.documentElement.scrollWidth, iw: innerWidth, h: document.documentElement.scrollHeight };
  o.wide = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && r.width > 0 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 5).map(e => e.tagName + '.' + String(e.className).slice(0, 40) + ' ' + Math.round(e.getBoundingClientRect().right));
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t; o.writers = []; o.c22 = []; o.deck = null;
  while ((t = tw.nextNode())) { const v = t.nodeValue; if (/writers? so far\./.test(v)) o.writers.push(T(v)); if (/\b\d+\s*countries\b/i.test(v) && /magnus|samoyed|he has|crossed/i.test((t.parentElement && t.parentElement.closest('section,p,div') || {}).textContent || '')) o.c22.push(T(v).slice(0, 90)); if (/80-slide deck/.test(v)) o.deck = T(v).slice(0, 90); }
  o.mag = [...document.querySelectorAll('[data-h3-mag-wrap]')].map(w => (w.hidden ? 'hidden:' : '') + T(w.textContent));
  o.magN = [...document.querySelectorAll('[data-tll-mag-n]')].map(w => T(w.textContent));
  const ab = document.querySelector('[data-tll-about-count="magnus"]'); o.aboutMag = ab ? T(ab.textContent) : null;
  const hero = document.querySelector('[data-h3-hero] img, img[data-tll-parallax="hero"]'); if (hero) o.hero = { loading: hero.getAttribute('loading'), fp: hero.getAttribute('fetchpriority'), cur: (hero.currentSrc || '').split('/').pop().slice(-50), sizes: hero.getAttribute('sizes') };
  const val = document.getElementById('tll-val'); if (val) { const p = val.previousElementSibling; o.val = { low: val.classList.contains('tll-val-low'), after: p ? (p.querySelector('[data-h3-shelf]') ? 'library' : p.hasAttribute('data-h3-hero') ? 'hero' : p.tagName + '.' + String(p.className).slice(0, 30)) : null, top: Math.round(val.getBoundingClientRect().top + scrollY) }; }
  const sh = document.querySelector('[data-h3-shelf]');
  if (sh) { const cs = [...sh.querySelectorAll('[data-h3-track] .h3-card')]; const vis = cs.filter(c => !c.hidden && c.style.display !== 'none' && c.getAttribute('aria-hidden') !== 'true');
    o.rail = { all: cs.length, shown: vis.length, hold: !!document.getElementById('tll-rail-hold-v1'), libHold: getComputedStyle(document.documentElement).getPropertyValue('--tll-lib-hold'),
      imgDisp: vis.map(c => { const i = c.querySelector('.h3-card-ph img'); return i ? getComputedStyle(i).display[0] + (i.currentSrc ? '' : '!') : '-'; }).join(''),
      hs: vis.map(c => Math.round(c.getBoundingClientRect().height)).join(','), top: Math.round(sh.getBoundingClientRect().top + scrollY),
      total: T((sh.querySelector('[data-h3-total]') || {}).textContent), shownTxt: T((sh.querySelector('[data-h3-shown]') || {}).textContent) }; }
  o.bands = [...document.querySelectorAll('figure.h3-il')].map(f => (f.getAttribute('data-h3-il') || '') + ':' + (f.getAttribute('data-tll-band') ? 'swapped' : '-'));
  const ph = document.querySelector('.tll-paw-hero'); if (ph) o.pawBg = getComputedStyle(ph).backgroundImage.split('/').pop().slice(0, 60);
  const L = document.querySelector('[data-pf5="stories-list"]'); if (L) { const cards = [...L.querySelectorAll('[data-pf5="story-card"]')]; o.pf = { cards: cards.length, visible: cards.filter(c => c.getBoundingClientRect().height > 0).length, pre: !!document.getElementById('tll-pf5-pre-v1') };
    const P = document.querySelector('[data-pf5="pets-list"]'); if (P) { const pc = [...P.querySelectorAll('[data-pf5="pet-card"]')]; o.pf.pets = pc.length; o.pf.petsVis = pc.filter(c => c.getBoundingClientRect().height > 0).length; } }
  const foot = document.querySelector('footer'); o.foot = foot ? T(foot.innerText).slice(0, 160).replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, 'X') : null;
  o.cookieBanner = [...document.querySelectorAll('[id*="consent" i],[class*="consent" i],[id*="cookie" i],[class*="cookie" i]')].filter(e => e.getBoundingClientRect().height > 20 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).position === 'fixed').map(e => (e.id || String(e.className).slice(0, 30))).slice(0, 3);
  o.tc = window.__tllConsent ? JSON.stringify(window.__tllConsent) : null; o.fcVisible = !!document.querySelector('.fc-consent-root, .fc-dialog-container'); o.cookies = document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(Boolean);
  return o;
};
module.exports = { runOne, stats, HOST };
if (require.main === module) {
  (async () => {
    const list = JSON.parse(fs.readFileSync(process.argv[2]));
    const outF = process.argv[3];
    const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
    for (const sc of list) { const r = await runOne(b, sc); fs.appendFileSync(outF, JSON.stringify(r) + '\n'); console.error(sc.name, sc.host, 'errs', r.errs.length, 'ads', r.ads.length, 'wf', stats.wfFetched, 'other', stats.otherFetched); }
    await b.close();
    fs.appendFileSync(outF + '.bytes', JSON.stringify(stats) + '\n');
  })();
}
