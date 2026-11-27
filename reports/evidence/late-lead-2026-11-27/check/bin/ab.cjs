/* 27 Nov late-lead-check (from late-lead-2026-11-27/bin/ab.cjs): old = check-old worktree (a2ad2ad, core 16.70.0, rebuilt, lQYm...), new = check worktree
   (claude/late-lead-2026-11-27 at 175788f, rebuilt, vtQY...). Changes: results under check-work/results; option ctx (extra context options, e.g.
   reducedMotion); a last guard before route.continue aborts any Webflow, site, Memberstack or Worker host that got past the rules (counted in
   st.guardHit); every top-level navigation is counted in st.navs. Nothing is ever stored in or fetched for the asset cache (cache-only). */
/* 27 Nov late-lead (from asia-cls-2026-11-25/bin/ab.cjs): old = core 16.70.0 (a2ad2ad worktree), new = claude/late-lead-2026-11-27. Change: the story Worker (workers.dev) is aborted; hosts passed through are counted in st.cont. */
/* Nov 25 asia-cls-check (copied from check-3/bin/ab.cjs): two variants, old (16.69.0, work branch a997980, core and chunks equal to pin 77b56b3f) and new
   (claude/asia-cls-2026-11-25 at 2c51cda), each served from its rebuilt worktree with the core tag's integrity set to its own hash.
/* Nov 22 check-3 (copied from check-2/bin/ab.cjs): three variants, live (0f04fabf), base (f3bc3f4) and br (ff8b7cd). New option holdWf: the Webflow-host scripts after the head (footer) are held until holdWf ms after the stories chunk was answered.
   Nov 22 check-2: three variants, live (0f04fabf), base (1ef84ab, the earlier checked head) and br (f3bc3f4). Nothing is fetched from Webflow or site hosts: what is not in the cache gets a 1x1 stand-in (images) or is aborted (fonts, the rest).
   Sweep Nov 21 independent CHECK: A/B of the live core (16.68.0, pin 0f04fabf) against branch claude/sweep-fixes-2026-11-21 (1ef84ab).
   Top-frame HTML from the plain-GET cache (sweep-cache/html). jsDelivr core and chunks answered from disk: variant "live" from git 0f04fabf,
   variant "br" from the check worktree (the core tag's integrity is set to the branch hash, as a release would). Webflow-host assets
   through the shared asset cache (fetched once, stored; budget then 1x1 stand-ins). Every non-GET aborted. Ads answered empty.
   Memberstack script replaced by a stand-in (signed out: null member; signed in: made-up member, no name). Usage:
   NODE_PATH=/opt/node22/lib/node_modules node ab.cjs <set> */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), zlib = require('zlib');
const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21';
const C2 = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov27/lead';
if (!C2 || C2.length < 20) throw new Error('bad scratch path');
const HTML = path.join(SP, 'sweep-cache/html'), AS = path.join(SP, 'sweep-cache/assets'), OUT = process.env.CHK_OUT || path.join(C2, 'check-work', 'results');
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(path.join(OUT, 'sig'), { recursive: true });
const SRC = { old: path.join(C2, 'check-old/src/site-layers'), new: path.join(C2, 'check/src/site-layers') };
const SRI = {}; for (const v of ['old', 'new']) SRI[v] = 'sha384-' + crypto.createHash('sha384').update(fs.readFileSync(path.join(SRC[v], 'tll-site-layers-v16.js'))).digest('base64');
const O = 'https://www.thatlayover.life';
const PROFILE = fs.readFileSync(path.join(HTML, 'profile-path.txt'), 'utf8').trim();
const f2p = f => { const k = f.slice(0, -5); return k === 'home' ? '/' : k === 'profile' ? PROFILE : '/' + k.replace(/__/g, '/'); };
const p2f = p => p === '/' ? 'home.html' : p === PROFILE ? 'profile.html' : p.replace(/^\//, '').replace(/\//g, '__') + '.html';
const sha = s => crypto.createHash('sha1').update(s).digest('hex');
const mask = s => String(s).replace(/contributors\/[^/?#\s"'):<]+/g, 'contributors/<profile>').replace(/gh\/[^/]+\/thatlayoverlife/g, 'gh/OWNER/thatlayoverlife');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const NETF = path.join(OUT, 'net.json');
const net = fs.existsSync(NETF) ? JSON.parse(fs.readFileSync(NETF, 'utf8')) : { wfBytes: 0, wfN: 0, siteBytes: 0, siteN: 0, stand: 0, miss: 0, missTypes: {} };
const BUDGET = 60e6;
const RE_WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const RE_WFHEAD = /tll_memberstack_init_v2|tllformcontrolsv3|tll_library_share_yours|webfont\.js/;
const RE_SITE = /^https:\/\/(www\.)?thatlayover\.life(\/|$)/i;
const RE_ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com|adtrafficquality\.google|google\.com\/pagead|clarity\.ms/;
const RE_MS = /^https:\/\/static\.memberstack\.com\/scripts\/v\d\/memberstack\.js/;
const RE_JSD = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@0f04fabf403d5c61d1e1f4ff8d850c493a9de62f\/src\/site-layers\/(tll-site-layers-v16\.js|chunks\/[a-z-]+\.js)$/;
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive', 'alt-svc', 'set-cookie', 'report-to', 'nel']);
function getA(u) { const k = path.join(AS, sha(u)); if (!fs.existsSync(k + '.json')) return null; const m = JSON.parse(fs.readFileSync(k + '.json', 'utf8'));
  const h = {}; for (const x in m.headers || {}) if (!DROP.has(x.toLowerCase())) h[x.toLowerCase()] = String(m.headers[x]); h['access-control-allow-origin'] = '*';
  return { status: m.status, headers: h, body: fs.readFileSync(k + '.b') }; }
function putA(u, status, headers, body) { const k = path.join(AS, sha(u)); const hd = {}; for (const x in headers) if (!DROP.has(x.toLowerCase())) hd[x] = headers[x];
  fs.writeFileSync(k + '.b', body); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers: hd })); }
function msStub(delay, out) { return '(function(){var M=' + (out ? 'null;var X=' : '') + '{id:"mem_check_test",verified:true,auth:{email:"reader@example.com",hasPassword:true,providers:[]},customFields:{},metaData:{},permissions:[],planConnections:[],createdAt:"2026-01-01T00:00:00.000Z"};' +
  'var DELAY=' + (+delay || 0) + ';function later(v){return new Promise(function(r){setTimeout(function(){r(v);},DELAY);});}' +
  'var api={getCurrentMember:function(){return later({data:M});},getMemberJSON:function(){return later({data:{}});},getApp:function(){return later({data:{id:"app_check",plans:[],contentGroups:[]}});},' +
  'onAuthChange:function(cb){setTimeout(function(){try{cb(M);}catch(e){}},DELAY);return {unsubscribe:function(){}};},getMemberCookie:function(){return M?"check":null;}};' +
  'window.$memberstackDom=new Proxy(api,{get:function(t,k){if(k in t)return t[k];if(typeof k!=="string"||k==="then")return undefined;return function(){return later({data:null});};}});window.$memberstackReady=true;' +
  'try{document.dispatchEvent(new Event("memberstack.ready"));}catch(e){}})();'; }

/* runs in the page before any page script: CLS and FCP */
function PERF() {
  window.__perf = { cls: 0, clsLoad: null, n: 0, shifts: [], fcp: null };
  const one = n => { if (!n || n.nodeType !== 1) return '?'; let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) { if (e.hadRecentInput) continue; window.__perf.cls += e.value; window.__perf.n++;
      if (window.__perf.shifts.length < 25) window.__perf.shifts.push([Math.round(e.startTime), +e.value.toFixed(4), (e.sources || []).slice(0, 2).map(s => one(s.node)).join(' ')]); } }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { }
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__perf.fcp = e.startTime; }).observe({ type: 'paint', buffered: true }); } catch (e) { }
}

/* page signature: visible elements keyed by tag, id, two classes and two ancestors, plus occurrence; box and a few computed styles */
function SIG() {
  const one = n => { let s = n.tagName.toLowerCase(); if (n.id && !/^w-node|^\d/.test(n.id)) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  const seen = {}, out = {};
  for (const e of document.body.querySelectorAll('*')) {
    if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK|META|BR|PATH|G|DEFS|USE)$/i.test(e.tagName)) continue;
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    let k = one(e); const p = e.parentElement, g = p && p.parentElement; k = (g ? one(g) + '>' : '') + (p ? one(p) + '>' : '') + k;
    seen[k] = (seen[k] || 0) + 1; k += '#' + seen[k];
    let t = ''; for (const c of e.childNodes) if (c.nodeType === 3) t += c.nodeValue; t = t.replace(/\s+/g, ' ').trim().slice(0, 50);
    out[k] = { b: [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)],
      s: [cs.fontSize, cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), cs.fontWeight, cs.color, cs.backgroundColor, cs.borderTopLeftRadius, cs.borderTopColor + ' ' + cs.borderTopWidth, cs.minHeight].join('|'), t,
      a: [e.getAttribute('role') || '', e.getAttribute('tabindex') || '', e.getAttribute('for') || '', e.getAttribute('aria-label') ? 'L' : ''].join('|') };
  }
  return out;
}

/* per-page measures of the fixes (both variants); returns plain data, no member data */
function MEASURE(file) {
  const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none'; };
  const px = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
  const rgb = s => { const m = /rgba?\(([^)]+)\)/.exec(s || ''); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v[3] == null ? 1 : v[3]]; };
  const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const bgOf = e => { const st = []; for (let n = e; n && n.nodeType === 1; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c && c[3] > 0) { st.push(c); if (c[3] >= 1) break; } }
    let b = [255, 255, 255]; for (let i = st.length - 1; i >= 0; i--) { const c = st[i]; b = [0, 1, 2].map(j => c[j] * c[3] + b[j] * (1 - c[3])); } return b; };
  const ratio = (e, pseudo) => { if (!e) return null; const cs = getComputedStyle(e, pseudo || null); let f = rgb(cs.color); if (!f) return null; const b = bgOf(e); f = [0, 1, 2].map(j => f[j] * f[3] + b[j] * (1 - f[3]));
    const a = lum(f), z = lum(b); return +(((Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05)).toFixed(2)); };
  const st = (e, props) => { if (!e) return null; const c = getComputedStyle(e); const o = { box: px(e), t: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 30) }; props.forEach(p => o[p] = c.getPropertyValue(p)); return o; };
  const first = sel => [].find.call(document.querySelectorAll(sel), vis);
  const all = sel => [].filter.call(document.querySelectorAll(sel), vis);
  const o = { coarse: matchMedia('(pointer:coarse)').matches, vw: innerWidth, sw: document.documentElement.scrollWidth,
    chunks: [].map.call(document.querySelectorAll('script[src*="/chunks/"]'), s => s.src.replace(/^.*\//, '')),
    nav: all('.tll-nav-v1 .tll-btn, .tll-nav-v1 a.tll-nav-signup, .tll-nav-v1 a.tll-nav-pen-cta').map(e => (e.innerText || '').trim().slice(0, 18) + ' ' + Math.round(e.getBoundingClientRect().height)) };
  const f = file;
  if (f === 'stories.html') {
    const h = first('.tll-library-newsletter h3'); o.nlH3 = h && { fs: getComputedStyle(h).fontSize, em: h.querySelector('em') && getComputedStyle(h.querySelector('em')).color, emRatio: ratio(h.querySelector('em')) };
    const n = document.getElementById('tll-q-note'); o.qnote = n && { vis: vis(n), s3: n.getAttribute('data-s3'), text: n.innerText.replace(/\s+/g, ' ').trim().slice(0, 220), links: [].map.call(n.querySelectorAll('a'), a => a.getAttribute('href')) };
    const cards = all('.tll-lib-card'); o.cards = cards.length;
    const tab = c => [c, ...c.querySelectorAll('*')].filter(e => vis(e) && e.tabIndex >= 0 && (e.matches('a[href],button,input,select,textarea,[tabindex]'))).length;
    o.tabStops = cards.slice(0, 40).map(tab).reduce((m, x) => (m[x] = (m[x] || 0) + 1, m), {});
    o.bylineRowRole = all('.tll-lib-byline[role],.tll-lib-byline[tabindex]').length;
    let own = 0, dot = 0, tot = 0, ownLineNoMark = 0; for (const p of all('.tll-lib-card [data-s3-place]')) { tot++; const nm = p.parentNode.querySelector('.tll-lib-byline-name'); if (!nm) continue; const a = nm.getBoundingClientRect(), b = p.getBoundingClientRect();
      if (b.top >= a.bottom - 2) { own++; const c = getComputedStyle(p, '::before').content; if (c && c !== 'none' && c !== 'normal' && c !== '""') dot++; if (!p.hasAttribute('data-tll-own-line')) ownLineNoMark++; } }
    o.place = { tot, own, dot, ownLineNoMark };
    o.mono = ['.tll-lib-meta', '.tll-lib-read', '.tll-chip-row .tll-filter-label', '.tll-library-hero-inner .tll-eyebrow-rose'].map(s => { const e = first(s); return s.replace(/^.* /, '') + ' ' + (e ? getComputedStyle(e).fontSize : '-'); });
    o.pressed = [].map.call(document.querySelectorAll('[data-tll-place][aria-pressed="true"]'), c => c.getAttribute('data-tll-place')); o.url = location.search;
  }
  if (/^stories__/.test(f)) { o.save = st(first('.tll-save-btn'), ['min-height']); }
  if (f === 'support.html') { const e = first('.tll-support-direct-title em'); o.em = st(e, ['font-size']); o.emCol = e && px(e.closest('.tll-support-direct-title')); o.ghost = st(first('a.tll-cta-ghost-dark'), ['color', 'background-color', 'border-top-color', 'border-top-left-radius', 'font-family', 'font-size']); o.ghostRatio = ratio(first('a.tll-cta-ghost-dark')); }
  if (f === 'contact.html') { o.ghost = st(first('a.tll-cta-ghost-dark'), ['color', 'background-color', 'border-top-color', 'border-top-left-radius', 'font-size']); o.ghostRatio = ratio(first('a.tll-cta-ghost-dark')); o.h3 = all('.tll-contact-faq-card h3').map(e => getComputedStyle(e).fontSize + ' ' + (e.innerText || '').trim().slice(0, 30)); }
  if (f === 'about.html') { o.btn = all('.tll-about-final-actions a, a.tll-about-final-button, a.tll-about-final-button-secondary, a.tll-about-final-button-light').map(e => st(e, ['border-top-left-radius', 'font-weight', 'background-color', 'color', 'font-family', 'min-height'])).slice(0, 6);
    o.cite = st(first('.tll-about-final-cite'), ['font-family']); o.li = st(first('.tll-about-final-li'), ['font-family']); o.btnRatio = all('a.tll-about-final-button, a.tll-about-final-button-secondary, a.tll-about-final-button-light').map(e => ratio(e)); }
  if (f === 'for-expats.html') { o.emptyFor = document.querySelectorAll('form label[for=""]').length; o.labels = [].map.call(document.querySelectorAll('form label'), l => { const i = l.querySelector('input,textarea,select'); return (l.getAttribute('for') === null ? 'nofor' : l.getAttribute('for') === '' ? 'empty' : (document.getElementById(l.getAttribute('for')) === i ? 'own' : 'other')) + (i ? ':' + i.type : ''); });
    o.btns = all('a[data-tll-btn], a[data-tll-x="finder-go"]').map(e => st(e, ['border-top-left-radius', 'font-family', 'background-color', 'color', 'border-top-color', 'min-height'])); o.finder = st(first('[data-tll-x="finder-input"]'), ['min-height']); }
  if (f === 'submit.html' || f === 'my-pets.html') { for (const c of ['tll-pen-helptext', 'tll-pen-help', 'tll-pen-legend', 'tll-pen-status', 'tll-pen-label']) { const e = [].find.call(document.querySelectorAll('.' + c), x => vis(x) && x.innerText.trim()); o[c] = e ? [getComputedStyle(e).color, getComputedStyle(e).fontWeight, getComputedStyle(e).fontStyle, getComputedStyle(e).fontSize, ratio(e)].join(' ') : 'none visible'; }
    const inp = [].find.call(document.querySelectorAll('input,textarea'), x => vis(x) && x.placeholder); o.ph = inp ? getComputedStyle(inp, '::placeholder').color + ' ' + ratio(inp, '::placeholder') : null;
    o.step = all('.tllst-nav button').map(e => st(e, ['border-top-left-radius', 'font-family', 'text-transform', 'background-color'])); o.gate = !!first('[data-ms-content="anonymous"] a[href*="login"]'); }
  if (f === 'this-page-does-not-exist-sweep.html') { o.btn = all('.tll404-btn').map(e => st(e, ['background-color', 'color', 'border-top-left-radius', 'font-family', 'min-height'])); o.btnRatio = all('.tll404-btn').map(e => ratio(e)); }
  if (f === 'the-map.html') { const s = document.getElementById('tllm-sample'); o.sample = s && st(s, ['font-family']); o.mono = ['.tllm-card-label', '.tllm-cell-l', '.tllm-bar-k', '.tllm-eyebrow', '#tllm-sample>span:first-child'].map(q => { const e = first(q); return q + ' ' + (e ? getComputedStyle(e).fontSize : '-'); });
    o.cta = all('a.tll-park-cta, a.tlllb-cta').map(e => st(e, ['background-color', 'border-top-left-radius', 'color'])); o.ctaRatio = all('a.tll-park-cta, a.tlllb-cta').map(e => ratio(e)); }
  if (f === 'account.html') { const p = first('#tll-note .tll-note-pill') || first('#tll-note'); o.pill = px(p); o.dt = all('[data-tll-wr=stats] dt, .a3-prog-top a, ul.a3-status li, .tll-account-eyebrow').slice(0, 5).map(e => getComputedStyle(e).fontSize);
    o.dtOverflow = all('[data-tll-wr=stats] dt').filter(e => e.scrollWidth > e.clientWidth + 1).length; o.exp = all('.tll-exp button').map(e => st(e, ['background-color', 'border-top-left-radius', 'min-height']));
    const side = all('.tll-account-sidebar a, .tll-acct-side a, [class*="side"] a').slice(-3).map(px); o.side = side; }
  if (f === 'travelers.html') { o.chips = all('.tll-trav-linkchips span').slice(0, 4).map(e => Math.round(e.getBoundingClientRect().height)); }
  if (f === 'profile.html') { o.tape = all('.tll-alb-tape').slice(0, 6).map(t => { const s = t.querySelector('small'); return s ? Math.round(t.getBoundingClientRect().width) + '/' + s.scrollWidth + '/' + getComputedStyle(s).whiteSpace + '/' + getComputedStyle(s).fontSize : 'nosmall'; }); }
  if (f === 'gallery.html') { o.credit = all('.tll-lounge-credit').slice(0, 2).map(e => getComputedStyle(e).fontSize); }
  return o;
}

async function load(browser, v, file, w, signed, opt = {}) {
  const pth = f2p(file), phone = w < 800;
  const st = { v, page: mask(pth), file: mask(file), w, signed: signed ? 'in' : 'out', q: opt.q || '', tag: opt.tag || '', errs: [], cons: [], bad: [], failed: [], nonGet: 0, wfFetched: 0, local: [], localBytes: 0 };
  const ctx = await browser.newContext({ ...(opt.ctx || {}), viewport: { width: w, height: phone ? 844 : 900 }, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 2 : 1,
    userAgent: phone ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
  let chunkAt = null; const waiters = []; st.hold = 0;
  await ctx.addInitScript(PERF);
  if (signed) await ctx.addInitScript(() => { try { localStorage.setItem('_ms-mid', 'check-test'); } catch (e) { } });
  if (opt.init) await ctx.addInitScript(opt.init);
  await ctx.route('**/*', async route => {
    const q = route.request(), u = q.url(), ty = q.resourceType();
    try {
      if (/^(data|blob|about):/.test(u)) return route.continue();
      try { if (q.isNavigationRequest() && q.frame().parentFrame() === null) st.navs = (st.navs || 0) + 1; } catch (e) { }
      const m = RE_JSD.exec(u);
      if (m) { if (opt.block && opt.block.test(m[1])) { st.local.push('BLOCKED ' + m[1]); return route.abort(); }
        const lf = path.join(SRC[v], m[1]); st.local.push(m[1]); const ok = fs.existsSync(lf); const body = ok ? fs.readFileSync(lf) : ''; st.localBytes += body.length;
        if (opt.slowJs) await sleep(opt.slowJs);
        if (/^chunks\/stories/.test(m[1]) && chunkAt == null) { chunkAt = Date.now(); waiters.splice(0).forEach(f => f()); }
        return route.fulfill({ status: ok ? 200 : 404, headers: { 'content-type': 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body }); }
      if (q.method() !== 'GET') { st.nonGet++; return route.abort(); }
      if (/challenges\.cloudflare\.com/.test(u)) return route.abort();
      if (RE_ADS.test(u)) return route.fulfill({ status: 200, headers: { 'content-type': /\.js|gtag|\/js\?/.test(u) ? 'application/javascript' : 'text/plain', 'access-control-allow-origin': '*' }, body: '' });
      if (RE_MS.test(u)) { if (opt.noMs) return route.abort(); return route.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: msStub(300, !signed) }); }
      if (/memberstack\.com/.test(u)) return route.abort();
      if (RE_SITE.test(u)) { const pu = new URL(u); let pp = pu.pathname.replace(/\/+$/, '') || '/';
        const fl = path.join(HTML, p2f(pp));
        if ((!pu.search || q.isNavigationRequest()) && fs.existsSync(fl) && (q.isNavigationRequest() || ty === 'fetch' || ty === 'xhr' || ty === 'document')) {
          let body = fs.readFileSync(fl, 'utf8');
          if (q.isNavigationRequest()) { if (SRI[v]) body = body.replace(/(<script src="https:\/\/cdn\.jsdelivr\.net\/gh\/[^"]+\/tll-site-layers-v16\.js"[^>]*? integrity=")[^"]*"/, '$1' + SRI[v] + '"'); if (opt.mod) body = opt.mod(body); }
          return route.fulfill({ status: pp === '/this-page-does-not-exist-sweep' ? 404 : 200, headers: { 'content-type': 'text/html; charset=utf-8' }, body }); }
        const c = getA(u); if (c) return route.fulfill(c);
        if (q.isNavigationRequest()) return route.abort();
        net.miss++; net.missTypes['site ' + ty] = (net.missTypes['site ' + ty] || 0) + 1; st.miss = (st.miss || 0) + 1;
        if (ty === 'image') return route.fulfill({ status: 200, headers: { 'content-type': 'image/png' }, body: PNG1 });
        return route.abort(); }
      if (RE_WF.test(u) && opt.holdWf && ty === 'script' && !RE_WFHEAD.test(u)) { const t0 = Date.now(); await new Promise(r => { if (chunkAt != null) r(); else { waiters.push(r); setTimeout(r, opt.holdCap || 9000); } });
        const left = (chunkAt != null ? chunkAt : Date.now()) + opt.holdWf - Date.now(); if (left > 0) await sleep(left); st.hold = Math.max(st.hold, Date.now() - t0); }
      if (RE_WF.test(u)) { const c = getA(u); if (c) { if (opt.slowAll) await sleep(opt.slowAll); return route.fulfill(c); }
        net.miss++; net.missTypes['wf ' + ty] = (net.missTypes['wf ' + ty] || 0) + 1; st.miss = (st.miss || 0) + 1;
        if (ty === 'image') { net.stand++; return route.fulfill({ status: 200, headers: { 'content-type': 'image/png' }, body: PNG1 }); }
        return route.abort(); }
      if (/workers\.dev/.test(u)) { st.workerAbort = (st.workerAbort || 0) + 1; return route.abort(); }
      { const h0 = new URL(u).hostname; if (/(^|\.)(thatlayover\.life|webflow\.io|webflow\.com|website-files\.com|memberstack\.com|workers\.dev)$/i.test(h0)) { st.guardHit = (st.guardHit || 0) + 1; return route.abort(); } }
      if (opt.slowAll) await sleep(opt.slowAll);
      { const h = new URL(u).host; st.cont = st.cont || {}; st.cont[h] = (st.cont[h] || 0) + 1; }
      return route.continue();
    } catch (e) { st.failed.push('route ' + String(e).slice(0, 80)); try { await route.abort(); } catch (e2) { } }
  });
  const page = await ctx.newPage();
  if (opt.throttle) { const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: opt.throttle.lat, downloadThroughput: opt.throttle.down, uploadThroughput: opt.throttle.down }); if (opt.throttle.cpu) await cdp.send('Emulation.setCPUThrottlingRate', { rate: opt.throttle.cpu }); }
  page.on('pageerror', e => st.errs.push(mask((e && e.message || String(e)).slice(0, 200)) + ' @ ' + mask(((e && e.stack) || '').split('\n').slice(1, 2).map(s => s.trim()).join(' | ')).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error') st.cons.push(mask(m.text()).slice(0, 200)); });
  page.on('response', r => { const s = r.status(), u = r.url(); if (s >= 400 && !/workers\.dev/.test(u) && !/this-page-does-not-exist/.test(u)) st.bad.push(s + ' ' + mask(u).replace(/\?.*/, '').slice(0, 120)); });
  page.on('requestfailed', r => { const t = (r.failure() || {}).errorText || ''; const u = r.url(); if (/ERR_ABORTED/.test(t)) return; st.failed.push(t + ' ' + mask(u).replace(/\?.*/, '').slice(0, 120)); });
  try {
    const r = await page.goto(O + pth + (opt.q || ''), { waitUntil: 'load', timeout: 90000 }); st.status = r ? r.status() : null;
    await sleep(opt.wait || (signed ? 5000 : 4000));
    st.perfLoad = await page.evaluate(() => ({ cls: +window.__perf.cls.toFixed(4), fcp: window.__perf.fcp && Math.round(window.__perf.fcp), n: window.__perf.n }));
    await page.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += innerHeight) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await sleep(1500);
    st.perf = await page.evaluate(() => ({ cls: +window.__perf.cls.toFixed(4), n: window.__perf.n, shifts: window.__perf.shifts }));
    st.m = await page.evaluate(MEASURE, file);
    if (opt.sig !== false) { const sig = await page.evaluate(SIG); st.sigN = Object.keys(sig); st.sigFile = [v, file.replace(/^profile/, 'PROFILE'), w, st.signed, opt.tag || 'base', opt.run || 0].join('_') + '.json.gz';
      fs.writeFileSync(path.join(OUT, 'sig', st.sigFile), zlib.gzipSync(JSON.stringify(sig))); st.sigN = st.sigN.length; }
    if (opt.act) st.act = await opt.act(page, ctx).catch(e => 'act error ' + String(e).slice(0, 200));
  } catch (e) { st.navErr = String(e).slice(0, 160); }
  await ctx.close();
  fs.writeFileSync(NETF, JSON.stringify(net));
  st.wfMB = +(net.wfBytes / 1e6).toFixed(1);
  return st;
}
module.exports = { load, sleep, net, mask, OUT };

const PAGES = [['home.html', 0], ['stories.html', 0], ['stories__lisbon-sun-sails-city-built-to-stand-back-up.html', 0], ['stories__balkans-ev-road-trip-twelve-countries.html', 0],
  ['support.html', 0], ['contact.html', 0], ['about.html', 0], ['for-expats.html', 0], ['submit.html', 1], ['my-pets.html', 1], ['share-photos.html', 0],
  ['this-page-does-not-exist-sweep.html', 0], ['the-map.html', 0], ['account.html', 1], ['travelers.html', 0], ['profile.html', 0], ['gallery.html', 0], ['the-paw-passport.html', 0]];
if (require.main === module && process.env.AB_MAIN) (async () => {
  const SET = process.argv[2] || 'smoke';
  let cells = [];
  if (SET === 'smoke') cells = [['home.html', 390, 0, 'live', 0], ['home.html', 390, 0, 'base', 0], ['home.html', 390, 0, 'br', 0]];
  else if (SET === 'ab') { for (let run = 0; run < 3; run++) for (const [f, s] of PAGES) for (const w of [390, 1440]) for (const v of [['live', 'base', 'br'], ['br', 'live', 'base'], ['base', 'br', 'live']][run % 3]) cells.push([f, w, s, v, run]); }
  else if (SET === 'extra') { for (let run = 10; run < 16; run++) for (const [f, w] of [['gallery.html', 1440], ['share-photos.html', 1440], ['the-paw-passport.html', 1440], ['stories__lisbon-sun-sails-city-built-to-stand-back-up.html', 390], ['profile.html', 390], ['home.html', 1440]]) for (const v of (run % 2 ? ['br', 'live'] : ['live', 'br'])) cells.push([f, w, 0, v, run]); }
  else if (SET === 'fcp3') { for (let run = 60; run < 75; run++) for (const [f, w, sg] of [['stories__lisbon-sun-sails-city-built-to-stand-back-up.html', 1440, 0], ['travelers.html', 390, 0], ['about.html', 1440, 0]]) for (const v of [['live', 'base', 'br'], ['br', 'live', 'base'], ['base', 'br', 'live']][run % 3]) cells.push([f, w, sg, v, run]); }
  else if (SET === 'fcp2') { for (let run = 40; run < 49; run++) for (const [f, w, sg] of [['about.html', 1440, 0], ['account.html', 1440, 1], ['submit.html', 1440, 1], ['support.html', 390, 0], ['travelers.html', 390, 0], ['share-photos.html', 1440, 0], ['stories__lisbon-sun-sails-city-built-to-stand-back-up.html', 1440, 0]]) for (const v of [['live', 'base', 'br'], ['br', 'live', 'base'], ['base', 'br', 'live']][run % 3]) cells.push([f, w, sg, v, run]); }
  else if (SET === 'fcp') { for (let run = 20; run < 32; run++) for (const [f, w] of [['stories__lisbon-sun-sails-city-built-to-stand-back-up.html', 390], ['stories__balkans-ev-road-trip-twelve-countries.html', 390], ['the-paw-passport.html', 1440]]) for (const v of (run % 2 ? ['br', 'live'] : ['live', 'br'])) cells.push([f, w, 0, v, run]); }
  const RES = path.join(OUT, SET + '.jsonl');
  const done = new Set(fs.existsSync(RES) ? fs.readFileSync(RES, 'utf8').split('\n').filter(Boolean).map(l => { const j = JSON.parse(l); return [j.file, j.w, j.signed, j.v, j.run].join(' '); }) : []);
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const [f, w, s, v, run] of cells) { const key = [mask(f), w, s ? 'in' : 'out', v, run].join(' '); if (done.has(key)) continue;
      const st = await load(browser, v, f, w, !!s, { run }); st.run = run;
      fs.appendFileSync(RES, JSON.stringify(st) + '\n');
      console.log(key, 'st', st.status, 'errs', st.errs.length, 'cons', st.cons.length, 'cls', st.perf && st.perf.cls, 'fcp', st.perfLoad && st.perfLoad.fcp, 'wf', st.wfFetched, 'MB', st.wfMB, st.navErr || ''); } }
  finally { await browser.close(); }
})();
