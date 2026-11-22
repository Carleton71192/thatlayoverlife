/* Sweep 21 Nov 2026, lens DEBUG: one load per page and width on live www (signed out) plus a signed-in Memberstack stand-in.
   Top-frame documents and same-site GETs come from the plain-GET cache (sweep-cache/html); a same-site path not cached is fetched once and stored.
   Webflow-host CSS/JS/fonts/images: shared asset cache (sweep-cache/assets), fetched once and stored; video aborted; images over the budget get a 1x1 stand-in.
   Every non-GET aborted. Ads/analytics answered empty. Memberstack: real script signed out (its non-GET calls aborted), or the stand-in (no name, made-up address).
   Usage: NODE_PATH=/opt/node22/lib/node_modules node d.cjs <set> */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21';
const HTML = path.join(SP, 'sweep-cache/html'), AS = path.join(SP, 'sweep-cache/assets'), OUT = path.join(SP, 'sweep-debug/results');
fs.mkdirSync(AS, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
const O = 'https://www.thatlayover.life';
const PROFILE = fs.readFileSync(path.join(HTML, 'profile-path.txt'), 'utf8').trim();
const f2p = f => { const k = f.slice(0, -5); return k === 'home' ? '/' : k === 'profile' ? PROFILE : '/' + k.replace(/__/g, '/'); };
const p2f = p => p === '/' ? 'home.html' : p === PROFILE ? 'profile.html' : p.replace(/^\//, '').replace(/\//g, '__') + '.html';
const sha = s => crypto.createHash('sha1').update(s).digest('hex');
const mask = s => String(s).replace(/contributors\/[^/?#\s"'):]+/g, 'contributors/<profile>').replace(/gh\/[^/]+\/thatlayoverlife/g, 'gh/OWNER/thatlayoverlife');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SET = process.argv[2] || 'smoke';
const SKIP = new Set(['awards.html', 'creators.html', 'spotlight.html']); /* 301s */
const ALL = fs.readdirSync(HTML).filter(f => f.endsWith('.html') && !SKIP.has(f)).sort();
const NETF = path.join(OUT, 'net.json');
const net = fs.existsSync(NETF) ? JSON.parse(fs.readFileSync(NETF, 'utf8')) : { wfBytes: 0, wfN: 0, siteBytes: 0, siteN: 0, stand: 0 };
const BUDGET = 60e6;
const RE_WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const RE_SITE = /^https:\/\/(www\.)?thatlayover\.life(\/|$)/i;
const RE_ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com|adtrafficquality\.google|google\.com\/pagead|clarity\.ms/;
const RE_MS = /^https:\/\/static\.memberstack\.com\/scripts\/v\d\/memberstack\.js/;
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive', 'alt-svc', 'set-cookie', 'report-to', 'nel']);
function getA(u) { const k = path.join(AS, sha(u)); if (!fs.existsSync(k + '.json')) return null; const m = JSON.parse(fs.readFileSync(k + '.json', 'utf8'));
  const h = {}; for (const x in m.headers || {}) if (!DROP.has(x.toLowerCase())) h[x.toLowerCase()] = String(m.headers[x]); h['access-control-allow-origin'] = '*';
  return { status: m.status, headers: h, body: fs.readFileSync(k + '.b') }; }
function putA(u, status, headers, body) { const k = path.join(AS, sha(u)); const hd = {}; for (const x in headers) if (!DROP.has(x.toLowerCase())) hd[x] = headers[x];
  fs.writeFileSync(k + '.b', body); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers: hd })); }
function msStub(delay, out) { return '(function(){var M=' + (out ? 'null;var X=' : '') + '{id:"mem_sweep_test",verified:true,auth:{email:"reader@example.com",hasPassword:true,providers:[]},customFields:{},metaData:{},permissions:[],planConnections:[],createdAt:"2026-01-01T00:00:00.000Z"};' +
  'var DELAY=' + (+delay || 0) + ';function later(v){return new Promise(function(r){setTimeout(function(){r(v);},DELAY);});}' +
  'var api={getCurrentMember:function(){return later({data:M});},getMemberJSON:function(){return later({data:{}});},getApp:function(){return later({data:{id:"app_sweep",plans:[],contentGroups:[]}});},' +
  'onAuthChange:function(cb){setTimeout(function(){try{cb(M);}catch(e){}},DELAY);return {unsubscribe:function(){}};},getMemberCookie:function(){return M?"sweep":null;}};' +
  'window.$memberstackDom=new Proxy(api,{get:function(t,k){if(k in t)return t[k];if(typeof k!=="string"||k==="then")return undefined;return function(){return later({data:null});};}});window.$memberstackReady=true;' +
  'try{document.dispatchEvent(new Event("memberstack.ready"));}catch(e){}})();'; }

function PROBE() {
  const one = n => { let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  const trail = n => { const a = []; for (let k = 0; n && n.nodeType === 1 && k < 3 && n !== document.body; k++, n = n.parentElement) a.unshift(one(n)); return a.join('>'); };
  const ids = {}; for (const n of document.querySelectorAll('[id]')) ids[n.id] = (ids[n.id] || 0) + 1;
  const dup = Object.keys(ids).filter(k => ids[k] > 1).map(k => k + 'x' + ids[k]);
  const badHash = []; for (const a of document.querySelectorAll('a[href^="#"]')) { const h = a.getAttribute('href'); if (h.length > 1 && !document.getElementById(decodeURIComponent(h.slice(1))) && !document.getElementsByName(h.slice(1)).length) badHash.push(h + ' ' + trail(a)); }
  const vis = n => { const r = n.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(n); return cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const imgNoAlt = [], imgEmptyBig = [], imgBroken = [];
  for (const i of document.images) { if (!vis(i)) continue; const r = i.getBoundingClientRect(); const al = i.getAttribute('alt'); const hid = i.closest('[aria-hidden="true"],[role="presentation"]');
    const src = (i.currentSrc || i.src || '').replace(/^.*\//, '').slice(-50);
    if (al === null && !hid) imgNoAlt.push(trail(i) + ' ' + src + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    else if (al !== null && !al.trim() && !hid && r.width >= 120 && r.height >= 80) { const lk = i.closest('a'); imgEmptyBig.push(trail(i) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) + (lk ? ' link:' + ((lk.innerText || '').trim() ? 'text' : (lk.getAttribute('aria-label') ? 'label' : 'EMPTY')) : '')); }
    if (i.complete && i.naturalWidth === 0 && i.src && !/^data:/.test(i.src)) imgBroken.push(trail(i) + ' ' + src); }
  const emptyLinks = []; for (const a of document.querySelectorAll('a[href]')) { if (!vis(a)) continue; const t = (a.innerText || '').trim() || a.getAttribute('aria-label') || a.getAttribute('title') || [].map.call(a.querySelectorAll('img[alt]'), i => i.alt).join('').trim() || (a.querySelector('svg title') || {}).textContent;
    if (!t) emptyLinks.push(trail(a) + ' ' + mask(a.getAttribute('href')).slice(0, 60)); }
  function mask(s) { return String(s).replace(/contributors\/[^/?#\s"']+/g, 'contributors/<profile>'); }
  const hrefHash = [].filter.call(document.querySelectorAll('a[href="#"]'), a => vis(a) && !a.getAttribute('role') && !a.closest('.w-lightbox,.w-dropdown,.w-tab-menu,[data-ms-action]') && !a.className.match(/w-lightbox|w-tab-link|w-dropdown/)).map(a => trail(a) + ' "' + (a.innerText || '').trim().slice(0, 30) + '"');
  const unresolved = (document.body.innerText.match(/\{\{[^}]{1,40}\}\}|undefined|NaN|\[object Object\]/g) || []).slice(0, 8);
  const emptyBind = document.querySelectorAll('.w-dyn-bind-empty').length;
  const lbEmpty = [].filter.call(document.querySelectorAll('.tll-story-gallery'), g => vis(g)).map(g => ({ tiles: g.querySelectorAll('a').length, placeholder: [].filter.call(g.querySelectorAll('img'), i => /placeholder/.test(i.src) && vis(i)).length }));
  const fails = []; for (const n of document.querySelectorAll('.w-form-fail')) if (vis(n)) fails.push(trail(n));
  return { dup, badHash, imgNoAlt, imgEmptyBig: imgEmptyBig.slice(0, 12), imgEmptyBigN: imgEmptyBig.length, imgBroken, emptyLinks: emptyLinks.slice(0, 15), emptyLinksN: emptyLinks.length, hrefHash: hrefHash.slice(0, 10), unresolved, emptyBind, lbEmpty, fails,
    docH: document.documentElement.scrollHeight, vw: innerWidth, sx: document.documentElement.scrollWidth, title: document.title, h1: [].map.call(document.querySelectorAll('h1'), h => (h.innerText || '').trim().slice(0, 50)).filter(Boolean).length };
}

async function load(browser, file, w, signed) {
  const pth = f2p(file), phone = w < 800;
  const st = { page: mask(pth), w, signed: signed ? 'in' : 'out', errs: [], cons: [], warns: [], bad: [], failed: [], nonGet: [], wfFetched: 0, siteFetched: [], stand: 0, worker: [], jsd: [] };
  const ctx = await browser.newContext({ viewport: { width: w, height: phone ? 844 : 900 }, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 2 : 1,
    userAgent: phone ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
  if (signed) await ctx.addInitScript(() => { try { localStorage.setItem('_ms-mid', 'sweep-test'); } catch (e) { } });
  await ctx.route('**/*', async route => {
    const q = route.request(), u = q.url(), ty = q.resourceType();
    try {
      if (/^(data|blob|about):/.test(u)) return route.continue();
      { const m = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@[0-9a-f]{40}\/src\/site-layers\/(tll-site-layers-v16\.js|chunks\/[a-z-]+\.js)$/.exec(u);
        if (m && global.__LOCAL) { const lf = path.join(global.__LOCAL, m[1]); (st.local = st.local || []).push(m[1]);
          return route.fulfill({ status: fs.existsSync(lf) ? 200 : 404, headers: { 'content-type': 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body: fs.existsSync(lf) ? fs.readFileSync(lf) : '' }); } }
      if (q.method() !== 'GET') { st.nonGet.push(q.method() + ' ' + mask(u.replace(/\?.*/, '')).slice(0, 90)); return route.abort(); }
      if (RE_ADS.test(u)) return route.fulfill({ status: 200, headers: { 'content-type': /\.js|gtag|\/js\?/.test(u) ? 'application/javascript' : 'text/plain', 'access-control-allow-origin': '*' }, body: '' });
      if (RE_MS.test(u)) return route.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: msStub(300, !signed) });
      if (/memberstack\.com/.test(u) && !RE_MS.test(u)) { st.nonGet.push('ms-in-abort ' + new URL(u).host); return route.abort(); }
      if (RE_SITE.test(u)) { const pu = new URL(u); let pp = pu.pathname.replace(/\/+$/, '') || '/';
        if (!q.isNavigationRequest()) (st.same = st.same || []).push(ty + ' ' + mask(pu.pathname + pu.search).slice(0, 70));
        const f = path.join(HTML, p2f(pp));
        if ((!pu.search || q.isNavigationRequest()) && fs.existsSync(f) && (q.isNavigationRequest() || ty === 'fetch' || ty === 'xhr' || ty === 'document')) return route.fulfill({ status: pp === '/this-page-does-not-exist-sweep' ? 404 : 200, headers: { 'content-type': 'text/html; charset=utf-8' }, body: (global.__MOD && q.isNavigationRequest()) ? global.__MOD(fs.readFileSync(f, 'utf8'), pp) : fs.readFileSync(f) });
        const c = getA(u); if (c) return route.fulfill(c);
        if (q.isNavigationRequest() && q.frame() !== q.frame().page().mainFrame()) return route.abort();
        const r = await route.fetch(); const b = await r.body(); putA(u, r.status(), r.headers(), b); net.siteBytes += b.length; net.siteN++; st.siteFetched.push(r.status() + ' ' + mask(pu.pathname + pu.search).slice(0, 80));
        return route.fulfill(getA(u)); }
      if (RE_WF.test(u)) { const c = getA(u); if (c) return route.fulfill(c);
        if (ty === 'media' || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u)) { st.stand++; return route.abort(); }
        if ((ty === 'image') && net.wfBytes > BUDGET) { st.stand++; net.stand++; return route.fulfill({ status: 200, headers: { 'content-type': 'image/png' }, body: PNG1 }); }
        if (net.wfBytes > BUDGET + 15e6) { st.stand++; return route.abort(); }
        const r = await route.fetch(); const b = await r.body(); putA(u, r.status(), r.headers(), b); net.wfBytes += b.length; net.wfN++; st.wfFetched++;
        return route.fulfill(getA(u)); }
      return route.continue();
    } catch (e) { st.failed.push('route ' + String(e).slice(0, 80)); try { await route.abort(); } catch (e2) { } }
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => st.errs.push(mask((e && e.message || String(e)).slice(0, 200)) + ' @ ' + mask(((e && e.stack) || '').split('\n').slice(1, 3).map(s => s.trim()).join(' | ')).slice(0, 260)));
  page.on('console', m => { const t = mask(m.text()).slice(0, 220); if (m.type() === 'error') st.cons.push(t); else if (m.type() === 'warning') st.warns.push(t); });
  page.on('response', r => { const u = r.url(), s = r.status();
    if (/workers\.dev/.test(u)) st.worker.push(s + ' ' + mask(u.replace(/^https:\/\/[^/]+/, '')).slice(0, 90));
    if (/cdn\.jsdelivr\.net/.test(u)) { if (s >= 400) st.jsd.push(s + ' ' + mask(u).slice(-90)); }
    if (s >= 400 && !/workers\.dev/.test(u)) st.bad.push(s + ' ' + r.request().resourceType() + ' ' + mask(u).replace(/\?.*/, '').slice(0, 140)); });
  page.on('requestfailed', r => { const t = (r.failure() || {}).errorText || ''; const u = r.url(); if (/ERR_ABORTED/.test(t) && (st.nonGet.length || /memberstack|\.mp4|\.webm/.test(u))) return;
    st.failed.push(t + ' ' + r.resourceType() + ' ' + mask(u).replace(/\?.*/, '').slice(0, 140)); });
  let pr = null;
  try { const r = await page.goto(O + pth + (global.__Q || ''), { waitUntil: 'load', timeout: 60000 }); st.status = r ? r.status() : null;
    await sleep(signed ? 6000 : 5000);
    await page.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += innerHeight) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await sleep(1500);
    pr = await page.evaluate(PROBE);
    if (global.__ACT) st.act = await global.__ACT(page, file, w, signed).catch(e => 'act error ' + String(e).slice(0, 200));
  } catch (e) { st.navErr = String(e).slice(0, 160); }
  st.probe = pr;
  await ctx.close();
  fs.writeFileSync(NETF, JSON.stringify(net));
  return st;
}

module.exports = { load, sleep, O };
if (require.main === module) (async () => {
  let cells = [];
  if (SET === 'smoke') cells = [['home.html', 390, 0], ['for-expats.html', 1440, 0]];
  else if (SET === 'out390') cells = ALL.map(f => [f, 390, 0]);
  else if (SET === 'out1440') cells = ALL.map(f => [f, 1440, 0]);
  else if (SET === 'in') for (const f of ['account.html', 'submit.html', 'my-pets.html', 'share-photos.html', 'the-map.html', 'edit-profile.html', 'profile.html', 'home.html', 'stories.html', 'for-expats.html', 'travelers.html', 'stories__lisbon-sun-sails-city-built-to-stand-back-up.html']) for (const w of [390, 1440]) cells.push([f, w, 1]);
  else { const [f, w, s] = SET.split(':'); cells = [[f, +w, +s || 0]]; }
  const RES = path.join(OUT, (process.env.TAG||'') + SET.replace(/[^a-z0-9]/gi, '_') + '.jsonl');
  const done = new Set(fs.existsSync(RES) ? fs.readFileSync(RES, 'utf8').split('\n').filter(Boolean).map(l => { const j = JSON.parse(l); return j.file + ' ' + j.w + ' ' + j.signed; }) : []);
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const [f, w, s] of cells) { const key = f + ' ' + w + ' ' + (s ? 'in' : 'out'); if (done.has(key)) continue;
      const st = await load(browser, f, w, !!s); st.file = f;
      fs.appendFileSync(RES, JSON.stringify(st) + '\n');
      console.log(key, 'st', st.status, 'errs', st.errs.length, 'cons', st.cons.length, 'bad', st.bad.length, 'failed', st.failed.length, 'wf', st.wfFetched, 'MB', (net.wfBytes / 1e6).toFixed(1)); } }
  finally { await browser.close(); }
})();
