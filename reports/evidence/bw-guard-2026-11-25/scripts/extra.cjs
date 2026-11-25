'use strict';
/* Follow-ups: routes registered before guard(), fetch failures inside the guard, the <a ping> and unload cases. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start, count } = require('./stub.cjs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wfgchk-'));
const unhandled = [];
process.on('unhandledRejection', e => unhandled.push(String(e && e.message).split('\n')[0]));
const note = (k, v) => console.log(k, JSON.stringify(v));

(async () => {
  const pages = {}; const { server, port, hits } = await start(pages);
  const H = (h, p) => `http://${h}:${port}${p}`; const WF = 'www.thatlayover.life', CDN = 'cdn.prod.website-files.com';
  const ofPath = p => h => h.path === p;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const log = () => path.join(tmp(), 'log.md');

  // E1 a context route that serves a local copy, registered BEFORE guard()
  {
    const ctx = await browser.newContext();
    let served = 0;
    await ctx.route('**/e1-cached.html', r => { served++; return r.fulfill({ status: 200, contentType: 'text/html', body: '<p>local copy</p>' }); });
    const g = W.guard(ctx, { label: 'e1', logFile: log() }); await g.ready;
    const pg = await ctx.newPage(); await pg.goto(H(WF, '/e1-cached.html')).catch(() => { });
    note('E1 context route registered before guard(): local route ran, request reached server', { localRouteRan: served, reachedServer: count(hits, ofPath('/e1-cached.html')), body: (await pg.content()).slice(0, 80) });
    await ctx.close();
  }
  // E2 a page route registered before guard() that continues a Webflow image
  {
    const ctx = await browser.newContext(); const pg = await ctx.newPage();
    await pg.route('**/*.png', r => r.continue());
    const g = W.guard(ctx, { label: 'e2', logFile: log() }); await g.ready;
    await pg.setContent(`<img src="${H(CDN, '/e2-img.png')}">`); await sleep(500);
    note('E2 page route registered before guard() continues a Webflow image', count(hits, ofPath('/e2-img.png')) ? 'REACHED SERVER' : 'blocked');
    await ctx.close();
  }
  // E3 the same with the guard given the page
  {
    const ctx = await browser.newContext(); const pg = await ctx.newPage();
    await pg.route('**/*.png', r => r.continue());
    const g = W.guard(pg, { label: 'e3', logFile: log() }); await g.ready;
    await pg.setContent(`<img src="${H(CDN, '/e3-img.png')}">`); await sleep(500);
    note('E3 same, guard(page)', count(hits, ofPath('/e3-img.png')) ? 'REACHED SERVER' : 'blocked');
    await ctx.close();
  }
  // E4 caller route.fetch of a Webflow page that fails (network error): does the harness survive?
  {
    const n0 = unhandled.length;
    const ctx = await browser.newContext(); const g = W.guard(ctx, { label: 'e4', logFile: log() }); await g.ready;
    const pg = await ctx.newPage();
    let caught = null;
    await pg.route('**/e4.html', async r => { try { const resp = await r.fetch(); await r.fulfill({ response: resp }); } catch (e) { caught = e.message.split('\n')[0]; await r.abort(); } });
    await pg.goto(H(WF, '/fail-e4.html').replace('fail-e4', 'e4')).catch(() => { });
    // a Webflow page whose connection drops
    await pg.unroute('**/e4.html');
    await pg.route('**/fail-e4b.html', async r => { try { const resp = await r.fetch(); await r.fulfill({ response: resp }); } catch (e) { caught = e.message.split('\n')[0]; await r.abort().catch(() => { }); } });
    await pg.goto(H(WF, '/fail-e4b.html')).catch(() => { }); await sleep(300);
    note('E4 caller route.fetch error caught by caller; unhandled rejections raised by the guard', { caught, unhandled: unhandled.slice(n0) });
    await ctx.close();
  }
  // E5 <a ping> and unload beacons on context.close (no navigation)
  pages['/e5.html'] = () => `<!doctype html><script>addEventListener('pagehide', () => { navigator.sendBeacon('${H('localhost', '/e5-beacon-close')}', 'u'); });
    addEventListener('visibilitychange', () => { fetch('${H(WF, '/e5-keepalive-vis')}', {method:'POST', body:'k', keepalive:true}); });</script>`;
  {
    const ctx = await browser.newContext(); const g = W.guard(ctx, { label: 'e5', logFile: log() }); await g.ready;
    const pg = await ctx.newPage(); await pg.goto(H('localhost', '/e5.html'));
    await pg.close({ runBeforeUnload: false }); await sleep(800);
    await ctx.close(); await sleep(300);
    note('E5 beacons when the page is closed', hits.filter(h => h.path.startsWith('/e5-') && h.method !== 'GET').map(h => h.method + ' ' + h.host + h.path));
    const ctx2 = await browser.newContext(); const g2 = W.guard(ctx2, { label: 'e5b', logFile: log() }); await g2.ready;
    const p2 = await ctx2.newPage(); await p2.goto(H('localhost', '/e5.html')); await p2.goto(H('localhost', '/hello')).catch(() => { }); await sleep(800);
    note('E5 beacons on navigation away (to a Webflow host too)', hits.filter(h => h.path.startsWith('/e5-') && h.method !== 'GET').map(h => h.method + ' ' + h.host + h.path));
    await ctx2.close();
  }
  // E6 cache mode with an empty cache folder whose parent has an asset-index.txt: refused vs fetched; and a 404 first fetch
  {
    const base = tmp(), cdir = path.join(base, 'assets'); fs.mkdirSync(cdir);
    const ctx = await browser.newContext(); const g = W.guard(ctx, { label: 'e6', mode: 'cache', cacheDir: cdir, logFile: log() }); await g.ready;
    const pg = await ctx.newPage(); await pg.setContent(`<img src="${H(CDN, '/e6-missing-404.gif')}">`); await sleep(400);
    await pg.reload(); await pg.setContent(`<img src="${H(CDN, '/e6-missing-404.gif')}">`); await sleep(400);
    note('E6 cache mode: a 404 first fetch is stored and replayed (network fetches, stats)', { fetches: count(hits, ofPath('/e6-missing-404.gif')), stats: g.stats() });
    await ctx.close();
  }
  note('unhandled rejections in total', unhandled);
  await browser.close(); server.close();
})().catch(async e => { console.error('FATAL', e.message); process.exit(1); });
