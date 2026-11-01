/* check-split.cjs (1 Nov 2026): offline check of the split site layers. Serves the built core and chunks from a mocked jsDelivr origin
   and a mocked site, visits a set of paths and asserts, per path: which chunks were requested and in what order, that no chunk a page
   does not need was requested, that every chunk passed its SRI check and executed (script load events, no error events), that a few
   known globals from the chunks exist, that no page error appears that the one-file bundle did not also produce on the same fixture,
   and that the core is at least 40 percent smaller than the one-file bundle. The sandbox cannot reach jsDelivr or the site, so every
   request is answered locally. Run from the repo root: node scratchpad/check-split.cjs
   Extended after the 1 Nov review of the split. A probe runs in the page when the first chunk is requested and before any chunk is
   served (so before any chunk code has run) and records the ads pause and the robots meta at that moment. Per path:
     every page       window.adsbygoogle.pauseAdRequests is 1 off the ad pages (home, forms, account, map, profiles, hubs) and unset on
                      /stories, story pages and country pages, already at the probe; the ad script is never added (the fixture gives no
                      ad consent); the core carries the ads layer and no chunk does.
     /stories         the page-heroes code is in the core response and in no chunk; its style is on the page after load (also checked on
                      /travelers and /about, and the /gallery label style on /gallery).
     /pursuits/x      meta robots noindex, follow exists at the probe, before the pursuits chunk is served; after load there is still one
                      robots meta, now claimed by tll-stamps-v1 (data-tll-hub=pending, since the stubbed Worker says nothing). */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const PIN = '0123456789abcdef0123456789abcdef01234567';   // any pin works: the loader reuses whatever pin the core was served from
const CDN = `https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@${PIN}/src/site-layers/`;
const SITE = 'https://www.thatlayover.life';
const LIVE_PIN = '4fdf0e1';   // 16.49.0, the one-file bundle the lock file records as live
const core = fs.readFileSync(path.join(ROOT, 'src/site-layers/tll-site-layers-v16.js'));
let old = null;
try { old = execSync(`git show ${LIVE_PIN}:src/site-layers/tll-site-layers-v16.js`, { cwd: ROOT, maxBuffer: 1 << 24 }); } catch (e) { console.log('old bundle not readable from git, control run skipped'); }
const OLD_BYTES = old ? old.length : 512561;
const sri = (b) => 'sha384-' + crypto.createHash('sha384').update(b).digest('base64');
const chunkPath = (name) => path.join(ROOT, 'src/site-layers/chunks', name + '.js');
const size = (name) => fs.statSync(chunkPath(name)).size;
const ADS_OK = /^\/stories(\/[^/?]+)?$|^\/countries\/[^/]+$/;   // the only paths where tll-ads-v1 leaves ad requests unpaused
const HEROES = /^\/(stories|travelers|the-map|about|for-expats)$/;
const MARKER = (name) => `/* src/site-layers/${name}.js */`;
const CASES = [
  ['/', ['site', 'home']],
  ['/stories', ['site', 'stories']],
  ['/stories/x', ['site', 'story']],
  ['/account', ['site', 'account']],
  ['/edit-profile', ['site', 'edit-profile']],
  ['/the-map', ['site', 'map']],
  ['/contact', ['site']],
  ['/about', ['site']],   // the about chunk is gone: page-heroes moved into the core
  ['/travelers', ['site', 'travelers']],
  ['/gallery', ['site', 'misc']],
  ['/countries/denmark', ['site', 'countries']],
  ['/share-photos', ['site', 'share-photos']],
  ['/contributors/jay', ['site', 'profile']],
  ['/pursuits/work-trips', ['site', 'pursuits']],
  ['/stories/x?preview=ux', ['site', 'story-preview']],
  ['/account/', ['site', 'account'], { v: true }],   // trailing slash on the page, ?v= cache-buster on the core URL
  /* slow: chunk responses are held back so they execute after DOMContentLoaded, the branch a slow connection takes; the layers'
     readyState checks must still run them (marks present) in order and without errors. */
  ['/', ['site', 'home'], { slow: true }],
  ['/stories', ['site', 'stories'], { slow: true }],
  ['/stories/x', ['site', 'story'], { slow: true }],
  ['/edit-profile', ['site', 'edit-profile'], { slow: true }],
  ['/pursuits/work-trips', ['site', 'pursuits'], { slow: true }],
];
/* Globals a chunk's layers set at script time or at DOMContentLoaded: extra proof the chunk ran, beyond the load event (which a classic
   script fires only after it has executed). The stories and story chunks leave no such mark on a fixture page since the ads layer moved
   into the core, so the load event alone covers them. */
const MARKS = {
  site: 'window.__tllWhatsNew===1',
  'edit-profile': '!!window.__tllN2A', account: '!!window.__tllN2A', pursuits: '!!window.__tllN2A',
  profile: "typeof window.__tllAlbumShow==='function'",
  home: "!!document.getElementById('tll-redesign-p0-v1')",
};
/* Run in the page before any chunk is served: what the synchronous core alone has done. */
const PROBE = () => ({
  pause: window.adsbygoogle ? window.adsbygoogle.pauseAdRequests : 'no adsbygoogle',
  robots: (document.querySelector('meta[name="robots"]') || {}).content || '',
  robotsCount: document.querySelectorAll('meta[name="robots"]').length,
  chunksRun: window.__loads.filter((u) => u.indexOf('/chunks/') > -1).length,
});
const AFTER = () => ({
  pause: window.adsbygoogle ? window.adsbygoogle.pauseAdRequests : 'no adsbygoogle',
  adScript: !!document.querySelector('script[src*="adsbygoogle.js"]'),
  heroesStyle: !!document.getElementById('tll-page-heroes-v1'),
  loungeStyle: !!document.getElementById('tll-lounge-labels-v1'),
  robots: (document.querySelector('meta[name="robots"]') || {}).content || '',
  robotsCount: document.querySelectorAll('meta[name="robots"]').length,
  hub: (document.querySelector('meta[name="robots"]') || { getAttribute: () => null }).getAttribute('data-tll-hub'),
});
function fixture(coreBytes, v) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>fixture</title>
<script src="${CDN}tll-site-layers-v16.js${v ? '?v=1' : ''}" integrity="${sri(coreBytes)}" crossorigin="anonymous"></script>
</head><body><main><h1>Fixture</h1><p>A page with a footer and a form.</p><form><input name="caption"><textarea name="body"></textarea></form></main>
<footer><a href="/">that LAYOVER LIFE.</a><p>tagline</p><a href="/account">Account</a></footer></body></html>`;
}
async function visit(browser, p, coreBytes, opts) {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    window.__loads = []; window.__errs = []; window.__dcl = 0; window.__chunkAt = [];
    document.addEventListener('DOMContentLoaded', () => { window.__dcl = performance.now(); });
    document.addEventListener('load', (e) => { if (e.target && e.target.tagName === 'SCRIPT') { window.__loads.push(e.target.src); if (e.target.src.indexOf('/chunks/') > -1) window.__chunkAt.push(performance.now()); } }, true);
    document.addEventListener('error', (e) => { if (e.target && e.target.tagName === 'SCRIPT') window.__errs.push(e.target.src); }, true);
  });
  const page = await ctx.newPage(); const requested = [], pageErrors = [], consoleErrors = [];
  let probe = null;   // one probe per visit, run when the first chunk is requested; every chunk response waits for it
  page.on('pageerror', (e) => pageErrors.push(String(e.message || e).split('\n')[0]));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u.startsWith(CDN)) {
      const rel = u.slice(CDN.length).replace(/[?#].*$/, '');
      if (rel.startsWith('chunks/')) {
        requested.push(rel.slice(7).replace(/\.js$/, ''));
        if (!probe) probe = page.evaluate(PROBE).catch((e) => ({ error: String(e).split('\n')[0] }));
        await probe;
        if (opts && opts.slow) await new Promise((r) => setTimeout(r, 500));
      }
      const body = rel === 'tll-site-layers-v16.js' ? coreBytes : (fs.existsSync(path.join(ROOT, 'src/site-layers', rel)) ? fs.readFileSync(path.join(ROOT, 'src/site-layers', rel)) : null);
      if (!body) return route.fulfill({ status: 404, body: '' });
      return route.fulfill({ status: 200, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' }, body });
    }
    if (u.startsWith(SITE)) return route.fulfill({ status: 200, contentType: 'text/html', body: fixture(coreBytes, opts && opts.v) });
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });   // Worker, fonts, flags, Memberstack: quiet stubs
  });
  await page.goto(SITE + p, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  const st = await page.evaluate(() => ({ loads: window.__loads, errs: window.__errs, dcl: window.__dcl, chunkAt: window.__chunkAt }));
  const after = await page.evaluate(AFTER);
  const marks = {};
  for (const name of requested) if (MARKS[name]) marks[name] = await page.evaluate(MARKS[name]);
  const atProbe = probe ? await probe : null;
  await ctx.close();
  return { requested, loads: st.loads, errs: st.errs, pageErrors, consoleErrors, marks, atProbe, after, afterDcl: st.chunkAt.length > 0 && st.dcl > 0 && st.chunkAt.every((t) => t > st.dcl) };
}
(async () => {
  const b = await chromium.launch(); let fails = 0;
  const check = (ok, msg) => { if (!ok) fails++; console.log((ok ? '  ok   ' : '  FAIL ') + msg); };
  const coreText = core.toString('utf8');
  check(core.length <= 0.6 * OLD_BYTES, `core ${core.length} bytes is at least 40 percent under the one-file bundle (${OLD_BYTES} bytes): ${(100 - 100 * core.length / OLD_BYTES).toFixed(1)} percent smaller`);
  const allChunks = fs.readdirSync(path.join(ROOT, 'src/site-layers/chunks')).filter((f) => f.endsWith('.js'));
  for (const name of ['tll-ads-v1', 'tll-page-heroes-v1', 'tll-stories-noimg-v1', 'tll-home-bands-v1', 'tll-lounge-labels-v1']) {
    const inChunks = allChunks.filter((f) => fs.readFileSync(chunkPath(f.slice(0, -3)), 'utf8').indexOf(MARKER(name)) > -1);
    check(coreText.indexOf(MARKER(name)) > -1 && inChunks.length === 0, `${name} is in the core and in no chunk${inChunks.length ? ' (found in ' + inChunks.join(', ') + ')' : ''}`);
  }
  check(coreText.indexOf('window.adsbygoogle.pauseAdRequests=1;return;') > -1, 'the ads pause line is in the core');
  for (const [p, expect, opts] of CASES) {
    const bare = p.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';
    console.log(`\n${p}${opts && opts.v ? ' (core URL with ?v=1)' : ''}${opts && opts.slow ? ' (chunks held back 500 ms)' : ''}`);
    const r = await visit(b, p, core, opts);
    const control = old ? await visit(b, p, old, opts) : null;
    check(JSON.stringify(r.requested) === JSON.stringify(expect), `chunks requested in order: ${JSON.stringify(r.requested)}`);
    if (opts && opts.slow) check(r.afterDcl, 'chunks executed after DOMContentLoaded (the slow-connection branch)');
    check(r.errs.length === 0, `no script error events (SRI or load failures): ${JSON.stringify(r.errs)}`);
    const chunkLoads = r.loads.filter((u) => u.indexOf('/chunks/') > -1).map((u) => u.replace(/^.*\/chunks\//, '').replace(/\.js$/, ''));
    check(r.loads.some((u) => u.indexOf('tll-site-layers-v16.js') > -1), 'core script load event seen (SRI passed)');
    check(JSON.stringify(chunkLoads) === JSON.stringify(expect), `chunk load events in order (executed): ${JSON.stringify(chunkLoads)}`);
    check(!r.consoleErrors.some((t) => /integrity|digest/i.test(t)), `no integrity console error: ${JSON.stringify(r.consoleErrors.filter((t) => /integrity|digest/i.test(t)))}`);
    for (const name of Object.keys(r.marks)) check(r.marks[name] === true, `chunk ${name} left its mark (${MARKS[name]})`);
    /* Ads: the pause is the core's doing, so it is already set when the first chunk is requested and no chunk has run yet. */
    const wantPause = ADS_OK.test(bare) ? undefined : 1;
    check(r.atProbe && r.atProbe.chunksRun === 0 && !r.atProbe.error, `probe ran before any chunk executed: ${JSON.stringify(r.atProbe)}`);
    check(r.atProbe && r.atProbe.pause === wantPause, `adsbygoogle.pauseAdRequests is ${wantPause === 1 ? '1' : 'unset'} before any chunk is served (${ADS_OK.test(bare) ? 'an ad page' : 'an ad-free page'}): got ${JSON.stringify(r.atProbe && r.atProbe.pause)}`);
    check(r.after.pause === wantPause, `adsbygoogle.pauseAdRequests still ${wantPause === 1 ? '1' : 'unset'} after load: got ${JSON.stringify(r.after.pause)}`);
    check(r.after.adScript === false, 'no adsbygoogle.js script added without ad consent');
    /* Heroes and labels: core layers that shape the first paint on their pages. */
    if (HEROES.test(bare)) check(r.after.heroesStyle, 'page-heroes style on the page (from the core)');
    if (bare === '/gallery') check(r.after.loungeStyle, 'lounge-labels style on the page (from the core)');
    /* Pursuit hubs: noindex from the synchronous core, then the same meta claimed by tll-stamps-v1 from the chunk. */
    if (/^\/pursuits\/[^/]+$/.test(bare)) {
      check(r.atProbe && r.atProbe.robots === 'noindex, follow' && r.atProbe.robotsCount === 1, `meta robots noindex, follow exists before the pursuits chunk is served: ${JSON.stringify(r.atProbe && r.atProbe.robots)}`);
      check(r.after.robots === 'noindex, follow' && r.after.robotsCount === 1 && r.after.hub === 'pending', `one robots meta after load, pending under tll-stamps-v1: ${JSON.stringify({ robots: r.after.robots, count: r.after.robotsCount, hub: r.after.hub })}`);
    } else check(r.after.robots === '' || r.after.robots !== 'noindex, follow' || /^\/(spotlight|awards|creators)$/.test(bare), `no stray noindex on ${bare}: ${JSON.stringify(r.after.robots)}`);
    if (control) {
      const extra = r.pageErrors.filter((e) => control.pageErrors.indexOf(e) < 0);
      check(extra.length === 0, `no page error beyond the one-file bundle's on this fixture (old: ${control.pageErrors.length}, new: ${r.pageErrors.length})${extra.length ? ': ' + JSON.stringify(extra) : ''}`);
    } else check(r.pageErrors.length === 0, `no page errors: ${JSON.stringify(r.pageErrors)}`);
    const total = core.length + r.requested.reduce((n, name) => n + size(name), 0);
    check(total < OLD_BYTES, `total downloaded ${(total / 1024).toFixed(1)} KB (core ${(core.length / 1024).toFixed(1)} + chunks) is under the one-file bundle ${(OLD_BYTES / 1024).toFixed(1)} KB`);
  }
  await b.close();
  console.log(fails ? `\n${fails} check(s) failed` : '\nall checks passed');
  process.exit(fails ? 1 : 0);
})();
