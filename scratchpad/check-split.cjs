/* check-split.cjs (1 Nov 2026): offline check of the split site layers. Serves the built core and chunks from a mocked jsDelivr origin
   and a mocked site, visits a set of paths and asserts, per path: which chunks were requested and in what order, that no chunk a page
   does not need was requested, that every chunk passed its SRI check and executed (script load events, no error events), that a few
   known globals from the chunks exist, that no page error appears that the one-file bundle did not also produce on the same fixture,
   and that the core is at least 40 percent smaller than the one-file bundle. The sandbox cannot reach jsDelivr or the site, so every
   request is answered locally. Run from the repo root: node scratchpad/check-split.cjs */
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
const size = (name) => fs.statSync(path.join(ROOT, 'src/site-layers/chunks', name + '.js')).size;
const CASES = [
  ['/', ['site', 'home']],
  ['/stories', ['site', 'stories']],
  ['/stories/x', ['site', 'story']],
  ['/account', ['site', 'account']],
  ['/edit-profile', ['site', 'edit-profile']],
  ['/the-map', ['site', 'map']],
  ['/contact', ['site']],
  ['/share-photos', ['site', 'share-photos']],
  ['/contributors/jay', ['site', 'profile']],
  ['/pursuits/work-trips', ['site', 'pursuits']],
  ['/stories/x?preview=ux', ['site', 'story-preview']],
  ['/account/', ['site', 'account'], { v: true }],   // trailing slash on the page, ?v= cache-buster on the core URL
  /* slow: chunk responses are held back so they execute after DOMContentLoaded, the branch a slow connection takes; the layers'
     readyState checks must still run them (marks present) in order and without errors. */
  ['/', ['site', 'home'], { slow: true }],
  ['/stories/x', ['site', 'story'], { slow: true }],
  ['/edit-profile', ['site', 'edit-profile'], { slow: true }],
];
/* Globals a chunk's layers set at script time or at DOMContentLoaded: extra proof the chunk ran, beyond the load event. */
const MARKS = {
  site: 'window.__tllWhatsNew===1',
  'edit-profile': '!!window.__tllN2A', account: '!!window.__tllN2A', pursuits: '!!window.__tllN2A',
  profile: "typeof window.__tllAlbumShow==='function'",
  stories: 'Array.isArray(window.adsbygoogle)', story: 'Array.isArray(window.adsbygoogle)', 'story-preview': 'Array.isArray(window.adsbygoogle)',
  home: "!!document.getElementById('tll-redesign-p0-v1')",
};
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
  page.on('pageerror', (e) => pageErrors.push(String(e.message || e).split('\n')[0]));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u.startsWith(CDN)) {
      const rel = u.slice(CDN.length).replace(/[?#].*$/, '');
      if (rel.startsWith('chunks/')) { requested.push(rel.slice(7).replace(/\.js$/, '')); if (opts && opts.slow) await new Promise((r) => setTimeout(r, 500)); }
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
  const marks = {};
  for (const name of requested) if (MARKS[name]) marks[name] = await page.evaluate(MARKS[name]);
  await ctx.close();
  return { requested, loads: st.loads, errs: st.errs, pageErrors, consoleErrors, marks, afterDcl: st.chunkAt.length > 0 && st.dcl > 0 && st.chunkAt.every((t) => t > st.dcl) };
}
(async () => {
  const b = await chromium.launch(); let fails = 0;
  const check = (ok, msg) => { if (!ok) fails++; console.log((ok ? '  ok   ' : '  FAIL ') + msg); };
  check(core.length <= 0.6 * OLD_BYTES, `core ${core.length} bytes is at least 40 percent under the one-file bundle (${OLD_BYTES} bytes): ${(100 - 100 * core.length / OLD_BYTES).toFixed(1)} percent smaller`);
  for (const [p, expect, opts] of CASES) {
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
