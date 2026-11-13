/* Bandwidth fixes 4 and 5, cache harness (13 Nov 2026). Zero network to Webflow hosts:
   - documents: the live www HTML saved by the 07:35 post-publish check (one plain GET each, fontrel/www/raw), or for "after" the same HTML
     with the proposal applied (after/ dir, built by apply.py)
   - every other Webflow-host GET: served from the fontrel/check cache if present, else ABORTED (never fetched) and recorded
   - every non-GET aborted; jsDelivr layers: live for "before"; for "after" the core and chunks are served from the local build
   Counts every request a page makes to Webflow hosts, and the wire bytes they would cost (measured sizes from nov13/bandwidth per-visit). */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const CACHE = SP + '/nov13/fontrel/check/cache';
const RAW = SP + '/nov13/fontrel/www/raw';
const HERE = __dirname;
const SIZES = JSON.parse(fs.readFileSync(path.join(HERE, 'sizes.json')));
const WT = process.env.WT || '/home/user/thatlayoverlife/.claude/worktrees/wf_b3d586d1-61d-2';
const WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const PIN = '1f2e549aee8627b2f67211463f764380f751c17b';
const key = u => crypto.createHash('sha1').update(u).digest('hex');
const MODE = process.argv[2] || 'before';
const ORIGIN = 'https://www.thatlayover.life';
const CARRY = SP + '/nov13/fontrel/check/carry/raw/www';
const ALLP = [['/', 'home'], ['/the-paw-passport', 'the-paw-passport'], ['/contributors/profile-1', 'contributors__profile-1'], ['/contributors/profile-2', 'contributors__profile-2'],
  ['/contributors/profile-3', 'contributors__profile-3'], ['/contributors/profile-4', 'contributors__profile-4'], ['/about', 'about'], ['/stories/spain-madrid-wedding-ibiza', 'stories__spain-madrid-wedding-ibiza']];
const PAGES = process.env.ONLY ? ALLP.filter(x => process.env.ONLY.split(',').includes(x[1])) : ALLP;
const WIDTHS = (process.env.WIDTHS || '390,1440').split(',').map(Number);
function doc(n) { if (MODE !== 'before') return fs.readFileSync(path.join(HERE, MODE, n + '.html'));
  const a = path.join(RAW, n + '.html'); return fs.readFileSync(fs.existsSync(a) ? a : path.join(CARRY, n + '.html')); }
const FACTS = 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25%2F689e5ba67671442434f3ca35%2F6ab13a0d90d9e8873f2f463c%2Ftllfactsv1-1.0.0.js';
function localLayer(u) {
  // after: the pinned core and chunk URLs answer with the local build of this branch
  const m = u.match(/cdn\.jsdelivr\.net\/gh\/Carleton71192\/thatlayoverlife@[0-9a-f]+\/(src\/site-layers\/.*\.js)$/);
  return m ? path.join(WT, m[1]) : null;
}
const PROBE = () => {
  const T = s => (s || '').replace(/\s+/g, ' ').trim();
  const out = {};
  const foot = document.querySelector('footer[data-tll-canonical-footer]');
  const row = foot && foot.querySelector('[class^="inline-div-1-"]');
  out.footer = row ? T(row.innerText || row.textContent) : null;
  out.tllCounts = window.tllCounts || null;
  out.storyNumbers = [...document.querySelectorAll('div,span,p,strong')].filter(e => !e.children.length && /^stor(y|ies)( filed| published| on the shelf)?$/i.test(T(e.textContent))).map(e => { const q = e.previousElementSibling || (e.parentElement && e.parentElement.previousElementSibling); return q ? T(q.textContent) + ' ' + T(e.textContent) : null; }).filter(Boolean);
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t; out.writers = [];
  while ((t = tw.nextNode())) { if (/writers? so far\./.test(t.nodeValue)) out.writers.push(T(t.nodeValue)); }
  out.mag = [...document.querySelectorAll('[data-h3-mag-wrap]')].map(w => (w.hidden ? 'hidden:' : '') + T(w.textContent));
  out.magN = [...document.querySelectorAll('[data-tll-mag-n]')].map(w => T(w.textContent));
  const tot = document.querySelector('[data-h3-total]'); out.h3Total = tot ? T(tot.textContent) : null;
  const track = document.querySelector('[data-h3-track]');
  if (track) { const cs = [...track.querySelectorAll('.h3-card')]; out.railAll = cs.map(c => c.getAttribute('data-slug')).sort(); out.railShown = cs.filter(c => !c.hidden).length;
    out.railComm = cs.filter(c => c.querySelector('.tll-comm-tag')).map(c => c.getAttribute('data-slug')).sort(); }
  const L = document.querySelector('[data-pf5="stories-list"]');
  if (L) { out.cards = [...L.querySelectorAll('[data-pf5="story-card"]')].map(c => c.getAttribute('data-st3-slug'));
    out.cardsVisible = [...L.querySelectorAll('[data-pf5="story-card"]')].filter(c => c.getBoundingClientRect().height > 0).map(c => c.getAttribute('data-st3-slug'));
    out.storiesMeta = T((document.querySelector('[data-pf5="stories-meta"]') || {}).textContent); out.storiesHead = T((document.querySelector('[data-pf5="stories-head"]') || {}).textContent);
    out.stats = T((document.querySelector('[data-pf5="stats"]') || {}).innerText);
    out.emptyShown = !!(document.querySelector('[data-pf5="stories-empty"]:not([hidden])'));
    const P = document.querySelector('[data-pf5="pets-list"]'); out.pets = P ? [...P.querySelectorAll('[data-pf5="pet-card"]')].map(c => c.getAttribute('data-owner')) : null;
    out.petsShown = !!document.querySelector('[data-pf5="pets"]:not([hidden])');
    out.robots = (document.querySelector('meta[name="robots"]') || {}).content || null; }
  out.layerCss = !!document.getElementById('tll-pf5-pre-v1');
  return out;
};
(async () => {
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const res = [];
  for (const [p, n] of PAGES) for (const w of WIDTHS) {
    const mobile = w < 800;
    const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1 });
    const st = { self: [], wfAssets: [], aborted: [], cacheHits: 0, nonGet: 0, errs: [], layersLocal: 0 };
    const url = ORIGIN + p;
    await ctx.route('**/*', async rt => {
      const q = rt.request(), u = q.url();
      if (q.method() !== 'GET') { st.nonGet++; return rt.abort(); }
      if (q.isNavigationRequest() && u.split('#')[0].split('?')[0].replace(/\/$/, '') === url.replace(/\/$/, '')) return rt.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8' }, body: doc(n) });
      if (MODE !== 'before' && u === FACTS) { st.wfAssets.push({ u, t: 'script', wire: null, served: 'local 1.1.0' }); return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript' }, body: fs.readFileSync(path.join(HERE, MODE, 'tllfactsv1-1.1.0.js')) }); }
      if (MODE !== 'before') { const f = localLayer(u); if (f) { st.layersLocal++; return rt.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: fs.readFileSync(f) }); } }
      if (WF.test(u)) {
        const isSelf = u.startsWith(ORIGIN + '/');
        const rec = { u: u.replace(ORIGIN, ''), t: q.resourceType(), wire: SIZES[u] || null };
        if (isSelf) st.self.push(rec); else st.wfAssets.push(rec);
        const fm = path.join(CACHE, key(u) + '.json');
        if (fs.existsSync(fm)) { const m = JSON.parse(fs.readFileSync(fm)); st.cacheHits++; rec.served = 'cache';
          const hd = Object.assign({}, m.headers); if (isSelf) hd['access-control-allow-origin'] = '*';
          return rt.fulfill({ status: m.status, headers: hd, body: fs.readFileSync(path.join(CACHE, key(u) + '.b')) }); }
        rec.served = 'blocked'; st.aborted.push(u); return rt.abort();
      }
      return rt.continue();
    });
    const pg = await ctx.newPage();
    pg.on('pageerror', e => st.errs.push(e.message.slice(0, 160)));
    try { await pg.goto(url, { waitUntil: 'load', timeout: 90000 }); } catch (e) { st.errs.push('goto ' + e.message.slice(0, 100)); }
    await pg.waitForTimeout(5000);
    const r1 = await pg.evaluate(PROBE);
    // scroll to the bottom in steps, as a reader would, to trigger lazy images, then read again
    await pg.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise(f => setTimeout(f, 120)); } });
    await pg.waitForTimeout(2000);
    const r2 = await pg.evaluate(PROBE);
    const sum = a => a.reduce((s, x) => s + (x.wire || 0), 0);
    const imgs = st.wfAssets.filter(x => x.t === 'image');
    res.push({ mode: MODE, p, w, probe: r1, probeScrolled: { cards: r2.cards, cardsVisible: r2.cardsVisible, footer: r2.footer },
      self: st.self.map(x => x.u), selfWire: sum(st.self), imgReq: imgs.length, imgUnknown: imgs.filter(x => !x.wire).length, imgWire: sum(imgs),
      imgList: imgs.map(x => x.u.replace(/^https:\/\/cdn\.prod\.website-files\.com\//, '')),
      wfAssetReq: st.wfAssets.length, cacheHits: st.cacheHits, blocked: st.aborted.length, nonGetAborted: st.nonGet, layersLocal: st.layersLocal, errs: st.errs });
    console.error(MODE, p, w, 'self', st.self.map(x => x.u).join(' '), 'img', imgs.length, 'blocked', st.aborted.length, 'errs', st.errs.length);
    await ctx.close();
  }
  fs.writeFileSync(path.join(HERE, 'out-' + MODE + '.json'), JSON.stringify(res, null, 1));
  await b.close();
})();
