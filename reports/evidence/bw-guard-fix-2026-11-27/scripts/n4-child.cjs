'use strict';
/* N4 child: failed fetches inside the guard, with NO unhandledRejection handler (Node 22 default: an unhandled rejection
   ends the process). Prints ALIVE at the end. Stub ports come from the parent. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.env.WT + '/tools/wf-guard.cjs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wfn4-'));
(async () => {
  const WFH = `http://www.thatlayover.life:${process.env.WP}`, CDN = `http://cdn.prod.website-files.com:${process.env.WP}`, LOC = `http://localhost:${process.env.OP}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const ctx = await browser.newContext();
  const g = W.guard(ctx, { label: 'n4', mode: process.env.MODE, cacheDir: tmp(), logFile: path.join(tmp(), 'l.md'), stateDir: tmp(), onTrip: 'close' }); await g.ready;
  const pg = await ctx.newPage();
  const res = {};
  // the guard's own fetch fails (page img, page fetch, navigation)
  await pg.goto(LOC + '/blank.html').catch(e => res.blank = 'err');
  await pg.setContent(`<img src="${CDN}/fail-img.png"><script>window.__f = fetch('${WFH}/fail-doc.js').then(r=>r.status, e=>'err')</script>`);
  res.pageFetch = await pg.evaluate(() => window.__f).catch(e => 'EVAL1 ' + e.message.split('\n')[0] + ' url=' + pg.url()); await sleep(500);
  res.nav = await pg.goto(WFH + '/fail-nav.html').then(r => r && r.status(), e => 'err: ' + e.message.split('\n')[0].slice(0, 60));
  // strict mode: a non-Webflow GET the guard fetches itself fails
  res.navOther = await pg.goto(LOC + '/failalways-other.html').then(r => r && r.status(), e => 'err: ' + e.message.split('\n')[0].slice(0, 60));
  // a caller route.fetch that fails (Webflow and other host), caught by the caller
  await pg.route('**/c-*.js', async r => { try { const x = await r.fetch({ url: r.request().url().replace('/c-', '/fail-c-') }); await r.fulfill({ response: x }); } catch (e) { res['caller ' + r.request().url().split('/').pop()] = 'caught: ' + e.message.slice(0, 50); await r.abort(); } });
  res.blank2 = await pg.goto(LOC + '/blank.html').then(r => r && r.status(), e => 'err: ' + e.message.split('\n')[0].slice(0, 80));
  res.eval2 = await pg.evaluate(([a, b]) => Promise.all([fetch(a).catch(() => 0), fetch(b).catch(() => 0)]), [CDN + '/c-wf.js', LOC + '/c-other.js']).catch(e => 'EVAL2 ' + e.message.split('\n')[0] + ' url=' + pg.url());
  // context.request that fails
  res.ctxRequest = await ctx.request.get(WFH + '/fail-req.js').then(r => r.status(), e => 'caught: ' + e.message.slice(0, 50));
  res.ctxRequestOther = await ctx.request.get(LOC + '/failalways-req.js').then(r => r.status(), e => 'caught: ' + e.message.slice(0, 50));
  // ask again for the URLs that failed once (fetch-once must not fetch them again)
  await pg.setContent(`<img src="${CDN}/fail-img.png"><script>window.__f = fetch('${WFH}/fail-doc.js').then(r=>r.status, e=>'err')</script>`);
  res.pageFetchAgain = await pg.evaluate(() => window.__f).catch(e => 'EVAL3 ' + e.message.split('\n')[0] + ' url=' + pg.url()); await sleep(500);
  await ctx.close(); await sleep(300);
  console.log('RESULTS ' + JSON.stringify(res));
  console.log('STATS ' + JSON.stringify({ failed: g.stats().failed, gets: g.stats().gets, cacheRefused: g.stats().cacheRefused, misses: g.stats().misses }));
  await browser.close();
  await sleep(500);
  console.log('ALIVE');
})();
