/* bwimg harness, 13 Nov 2026 (bandwidth fixes 2, 3 and 7). Bandwidth rule:
   - documents: the single plain-GET snapshots already on disk (fontrel/www/raw after the 07:35 publish; fontrel/check/carry/raw/www for
     pages not in it); never fetched here.
   - layers core and chunks at any jsDelivr pin: served from a local build dir (base = the live 16.63.0 build, after = this branch).
   - Webflow hosts: served from fontrel/check/cache (read only) or this run's own cache (../cache). A file in neither is blocked, unless
     the run is a prefetch run (allowFetch), which GETs it once into ../cache and counts its bytes (budget 120 MB for this agent).
   - every non-GET is aborted; ad and analytics hosts are aborted (not Webflow, not needed for image picks). */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const D = path.join(__dirname, '..');
const SP = path.join(D, '../../..');
const CACHES = [path.join(D, 'cache'), path.join(SP, 'nov13/fontrel/check/cache')];
const BYTES = path.join(D, 'out', 'webflow-bytes.json');
const WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const NOISE = /^https?:\/\/([a-z0-9-]+\.)*(googlesyndication\.com|googletagmanager\.com|google-analytics\.com|doubleclick\.net|adtrafficquality\.google|fundingchoicesmessages\.google\.com|clarity\.ms)(\/|$)/i;
const JSD = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@[0-9a-f]{40}\/src\/site-layers\/(.+)$/;
const LIMIT = 120e6;
let bytes = fs.existsSync(BYTES) ? JSON.parse(fs.readFileSync(BYTES)) : { net: 0, n: 0, urls: [] };
const key = u => crypto.createHash('sha1').update(u).digest('hex');
const sri = b => 'sha384-' + crypto.createHash('sha384').update(b).digest('base64');
function cached(u) {
  const k = key(u);
  for (const c of CACHES) { const fm = path.join(c, k + '.json'); if (fs.existsSync(fm)) return { m: JSON.parse(fs.readFileSync(fm)), b: fs.readFileSync(path.join(c, k + '.b')) }; }
  return null;
}
function profilePath() {
  // the profile page whose own name appears most often (the most story cards of its own; the 10 MB phone page in the bandwidth report);
  // its slug is read at run time, never written
  const dir = path.join(SP, 'nov13/fontrel/check/carry/raw/www');
  let best = null, n = -1;
  for (const f of fs.readdirSync(dir)) if (/^contributors__/.test(f)) { const h = fs.readFileSync(path.join(dir, f), 'utf8'); const t = (/<title>([^<·]+)·/.exec(h) || [])[1];
    if (!t) continue; const c = h.split(t.trim()).length; if (c > n) { n = c; best = f; } }
  return '/' + best.replace(/\.html$/, '').replace(/__/g, '/');
}
const PAGES = { home: { p: '/', f: 'nov13/fontrel/www/raw/home.html' }, paw: { p: '/the-paw-passport', f: 'nov13/fontrel/www/raw/the-paw-passport.html' },
  stories: { p: '/stories', f: 'nov13/fontrel/www/raw/stories.html' } };
function page(name) {
  if (name === 'profileA') { const p = profilePath(); return { p, f: 'nov13/fontrel/check/carry/raw/www/' + p.slice(1).replace(/\//g, '__') + '.html' }; }
  return PAGES[name];
}
const CORE_RX = /(<script src="https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@[0-9a-f]{40}\/src\/site-layers\/tll-site-layers-v16\.js"[^>]*integrity=")([^"]+)(")/;
function doc(name, build, mod) {
  const pg = page(name); let h = fs.readFileSync(path.join(SP, pg.f), 'utf8');
  if (mod) h = mod(h);
  const core = fs.readFileSync(path.join(D, build, 'tll-site-layers-v16.js'));
  if (!CORE_RX.test(h)) throw new Error('core tag ' + name);
  h = h.replace(CORE_RX, (m, a, b, c) => a + sri(core) + c);
  return Buffer.from(h);
}
const UA_M = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';
const UA_D = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
async function open(browser, { name, build, w, h, dpr, mod, allowFetch = false, init, js = true }) {
  const mobile = w < 800, pg0 = page(name), url = 'https://www.thatlayover.life' + pg0.p;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: dpr || (mobile ? 3 : 1),
    userAgent: mobile ? UA_M : UA_D, javaScriptEnabled: js });
  const st = { wf: {}, blocked: [], aborted: 0, errs: [], fetched: 0 };
  const body = doc(name, build, mod);
  await ctx.route('**/*', async rt => {
    const q = rt.request(), u = q.url();
    if (q.method() !== 'GET') { st.aborted++; return rt.abort(); }
    if (q.isNavigationRequest() && u.split('#')[0].split('?')[0].replace(/\/$/, '') === url.replace(/\/$/, ''))
      return rt.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8' }, body });
    const j = JSD.exec(u);
    if (j) { const f = path.join(D, build, j[1]); if (!fs.existsSync(f)) { st.blocked.push(u); return rt.abort(); }
      return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body: fs.readFileSync(f) }); }
    if (NOISE.test(u)) { st.aborted++; return rt.abort(); }
    if (WF.test(u)) {
      const c = cached(u);
      if (c) { if (!st.wf[u]) st.wf[u] = { n: 0, size: c.b.length, type: q.resourceType() }; st.wf[u].n++; return rt.fulfill({ status: c.m.status, headers: c.m.headers, body: c.b }); }
      if (!allowFetch || bytes.net > LIMIT) { st.blocked.push(u); return rt.abort(); }
      try {
        const r = await rt.fetch({ timeout: 120000 }); const b = await r.body(); const hd = r.headers();
        delete hd['content-encoding']; delete hd['content-length']; delete hd['transfer-encoding'];
        const k = key(u); fs.writeFileSync(path.join(CACHES[0], k + '.b'), b); fs.writeFileSync(path.join(CACHES[0], k + '.json'), JSON.stringify({ u, status: r.status(), headers: hd }));
        bytes.net += b.length; bytes.n++; bytes.urls.push([u, b.length]); fs.writeFileSync(BYTES, JSON.stringify(bytes)); st.fetched++;
        st.wf[u] = { n: 1, size: b.length, type: q.resourceType(), fresh: true };
        return rt.fulfill({ status: r.status(), headers: hd, body: b });
      } catch (e) { st.blocked.push('fetchfail ' + u); return rt.abort(); }
    }
    return rt.continue();
  });
  const pg = await ctx.newPage();
  if (init) await pg.addInitScript(init);
  pg.on('pageerror', e => st.errs.push('pageerror: ' + e.message.slice(0, 200)));
  await pg.goto(url, { waitUntil: 'load', timeout: 120000 });
  return { ctx, pg, st };
}
async function scrollAll(pg) {
  await pg.evaluate(async () => { const H = () => document.documentElement.scrollHeight; for (let y = 0; y < H(); y += Math.round(innerHeight * .8)) { scrollTo(0, y); await new Promise(f => setTimeout(f, 250)); } scrollTo(0, H()); await new Promise(f => setTimeout(f, 800)); });
}
function summary(st) {
  const rows = Object.entries(st.wf).map(([u, v]) => ({ u, ...v }));
  const img = rows.filter(r => r.type === 'image');
  return { wfBytes: rows.reduce((a, r) => a + r.size, 0), imgBytes: img.reduce((a, r) => a + r.size, 0), wfFiles: rows.length, imgFiles: img.length,
    imgs: img.map(r => [r.u.replace('https://cdn.prod.website-files.com/', ''), r.size]).sort((a, b) => b[1] - a[1]), blocked: st.blocked, errs: st.errs, aborted: st.aborted, fetched: st.fetched };
}
module.exports = { open, scrollAll, summary, D, bytes: () => bytes };
