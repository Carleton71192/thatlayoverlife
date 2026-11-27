'use strict';
/* Break-it scenarios for tools/wf-guard.cjs. One Chromium, every host mapped to a local stub, no proxy. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start, count, sent } = require('./stub.cjs');

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wfgchk-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = {};
const note = (k, v) => { out[k] = v; console.log(k, JSON.stringify(v)); };
const readLog = f => { try { return fs.readFileSync(f, 'utf8').trim().split('\n'); } catch (e) { return []; } };

const unhandled = [];
process.on('unhandledRejection', e => { unhandled.push(String(e && e.message).split('\n')[0]); console.log('UNHANDLED REJECTION', String(e && e.message).split('\n')[0]); });
(async () => {
  let P;
  const pages = {};
  const { server, port, hits } = await start(pages); P = port;
  const H = (host, p) => `http://${host}:${P}${p}`;
  const WF = 'www.thatlayover.life', CDN = 'cdn.prod.website-files.com';
  let browser; const launch = async (tag) => { if (browser) await browser.close().catch(() => { }); browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] }); browser.on('disconnected', () => console.log('DISCONNECTED during', tag)); };
  const fresh = async (opts, ctxOpts) => { const ctx = await browser.newContext(ctxOpts); const g = W.guard(ctx, Object.assign({ logFile: path.join(tmp(), 'log.md') }, opts)); await g.ready; return { ctx, g }; };
  const ofPath = p => h => h.path === p;

  await launch('S0');
  // S0 sanity: a Webflow host name lands on the stub
  pages['/hello.html'] = () => '<p>hi</p>';
  {
    const { ctx, g } = await fresh({ label: 's0' });
    const pg = await ctx.newPage(); await pg.goto(H(WF, '/hello.html'));
    note('S0 sanity host seen by stub', hits.filter(ofPath('/hello.html')).map(h => h.host));
    await ctx.close();
  }

  await launch('S1');
  // S1 host spellings, block mode, real host list
  const S1 = {
    upper: H('WWW.THATLAYOVER.LIFE', '/s1-upper.png'), apex: H('thatlayover.life', '/s1-apex.png'),
    apexUpper: H('ThatLayover.Life', '/s1-apexu.png'), cdn: H(CDN, '/s1-cdn.jpg'), cdnUpper: H('CDN.PROD.WEBSITE-FILES.COM', '/s1-cdnu.webp'),
    assetsGlobal: H('assets-global.website-files.com', '/s1-ag.avif'), deepSub: H('a.b.c.website-files.com', '/s1-deep.png'),
    webflowIo: H('that-layover-life.webflow.io', '/s1-wfio.png'), wfioUpper: H('THAT-LAYOVER-LIFE.WEBFLOW.IO', '/s1-wfiou.png'),
    trailingDot: H('www.thatlayover.life.', '/s1-dot.png'), cdnTrailingDot: H('cdn.prod.website-files.com.', '/s1-cdndot.png'),
    otherSub: H('cdn.thatlayover.life', '/s1-othersub.png'), uploadsWebflowCom: H('uploads-ssl.webflow.com', '/s1-wfcom.png'),
    noExtImg: H(CDN, '/noext-img-1'), extUpper: H(CDN, '/s1-EXTU.JPG'), encodedExt: H(CDN, '/s1-enc%2Epng'),
  };
  pages['/s1.html'] = () => `<!doctype html>${Object.values(S1).map(u => `<img src="${u}">`).join('')}
    <div style="width:10px;height:10px;background:url(${H(CDN, '/s1-cssbg.png')})"></div>
    <script>window.__f = Promise.all([fetch('${H(CDN, '/noext-img-fetch')}').then(r=>r.status,e=>'err'), fetch('${H(CDN, '/s1-enc2%2Epng')}').then(r=>r.status,e=>'err')]);</script>`;
  {
    const { ctx, g } = await fresh({ label: 's1' });
    const pg = await ctx.newPage(); await pg.goto(H('localhost', '/s1.html')); await pg.evaluate(() => window.__f); await sleep(500);
    const r = {};
    for (const [k, u] of Object.entries(S1)) { const p = new URL(u).pathname; r[k] = count(hits, ofPath(p)) ? 'REACHED SERVER' : 'blocked'; }
    r.cssBackground = count(hits, ofPath('/s1-cssbg.png')) ? 'REACHED SERVER' : 'blocked';
    r.fetchNoExtImage = count(hits, ofPath('/noext-img-fetch')) ? 'REACHED SERVER (counted as non-media)' : 'blocked';
    r.fetchEncodedExt = count(hits, ofPath('/s1-enc2%2Epng')) ? 'REACHED SERVER' : 'blocked';
    note('S1 host spellings (block mode)', r); note('S1 stats', g.stats());
    await ctx.close();
  }

  await launch('S2');
  // S2 redirects into Webflow hosts
  pages['/s2.html'] = () => `<!doctype html>
    <img src="${H('localhost', '/r?to=' + encodeURIComponent(H(CDN, '/s2-a.png')))}">
    <img src="${H(WF, '/r?to=' + encodeURIComponent(H(CDN, '/s2-b.png')))}">
    <img src="${H('img.example.org', '/r?to=' + encodeURIComponent(H(CDN, '/s2-e.png')))}">
    <script src="${H('localhost', '/r?to=' + encodeURIComponent(H(WF, '/kb300.js')))}"></script>`;
  pages['/s2-page.html'] = () => '<p>landed</p>';
  {
    const { ctx, g } = await fresh({ label: 's2' });
    const pg = await ctx.newPage(); await pg.goto(H('localhost', '/s2.html')); await sleep(500);
    note('S2 redirect non-Webflow img -> Webflow img', count(hits, ofPath('/s2-a.png')) ? 'REACHED SERVER (not blocked)' : 'blocked');
    note('S2 redirect Webflow page path -> Webflow img', count(hits, ofPath('/s2-b.png')) ? 'REACHED SERVER (not blocked)' : 'blocked');
    note('S2 redirect other host img -> Webflow img', count(hits, ofPath('/s2-e.png')) ? 'REACHED SERVER (not blocked)' : 'blocked');
    const js = sent(hits, ofPath('/kb300.js'));
    note('S2 non-Webflow script redirected to a 300 KB Webflow script: stub sent, guard counted', { stubSent: js, guardBytes: g.stats().bytes });
    const before = g.stats().bytes;
    await pg.goto(H('localhost', '/r?to=' + encodeURIComponent(H(WF, '/s2-page.html'))));
    await sleep(300);
    note('S2 navigation non-Webflow -> Webflow page: counted bytes added, pageLoads', { added: g.stats().bytes - before, pageLoads: g.stats().pageLoads });
    // caller route.fetch of a non-Webflow URL that redirects to a Webflow image
    await pg.route('**/s2-local.png', async route => { try { const r = await route.fetch({ url: H('localhost', '/r?to=' + encodeURIComponent(H(CDN, '/s2-d.png'))) }); await route.fulfill({ response: r }); } catch (e) { note('S2 caller route.fetch error', e.message.split('\n')[0]); await route.abort(); } });
    note('S2 caller route.fetch result', await pg.evaluate(u => fetch(u).then(r => r.status, e => 'err'), H('localhost', '/s2-local.png')));
    note('S2 caller route.fetch non-Webflow URL redirecting to Webflow image (block mode)', count(hits, ofPath('/s2-d.png')) ? 'REACHED SERVER (not blocked, not counted)' : 'blocked');
    await ctx.close();
  }

  await launch('S3');
  // S3 service worker
  pages.__sw = () => `
    self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(Promise.all([
      fetch('${H(CDN, '/s3-install.png')}').catch(()=>0),
      fetch('${H('localhost', '/s3-sw-post')}', {method:'POST', body:'x'}).catch(()=>0),
      fetch('${H(WF, '/s3-sw-put')}', {method:'PUT', body:'x'}).catch(()=>0),
      fetch('${H(WF, '/kb500.js')}').catch(()=>0)])); });
    self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
    self.addEventListener('fetch', e => { if (e.request.url.includes('/s3-')) e.respondWith(fetch(e.request)); });`;
  pages['/s3.html'] = () => `<!doctype html><script>window.__reg = navigator.serviceWorker.register('/sw.js').then(()=>navigator.serviceWorker.ready).then(()=>'ok', e=>'err '+e);</script>`;
  pages['/s3b.html'] = () => `<!doctype html><img src="${H(CDN, '/s3-ctrl.png')}"><script>window.__p = fetch('${H('localhost', '/s3-page-post')}', {method:'POST', body:'y'}).then(r=>r.status,e=>'blocked');</script>`;
  {
    const { ctx, g } = await fresh({ label: 's3' });
    const pg = await ctx.newPage(); await pg.goto(H('localhost', '/s3.html'));
    note('S3 sw register', await pg.evaluate(() => window.__reg)); await sleep(1000);
    await pg.goto(H('localhost', '/s3b.html')); const pr = await pg.evaluate(() => window.__p); await sleep(500);
    note('S3 service worker', {
      swInstallWebflowImage: count(hits, ofPath('/s3-install.png')) ? 'REACHED SERVER' : 'blocked',
      swPOST: count(hits, h => h.path === '/s3-sw-post' && h.method === 'POST') ? 'REACHED SERVER' : 'blocked',
      swPUT: count(hits, h => h.path === '/s3-sw-put' && h.method === 'PUT') ? 'REACHED SERVER' : 'blocked',
      sw500KBWebflowScriptSent: sent(hits, ofPath('/kb500.js')),
      pageImgThroughSW: count(hits, ofPath('/s3-ctrl.png')) ? 'REACHED SERVER' : 'blocked',
      pagePOSTThroughSW: count(hits, h => h.path === '/s3-page-post' && h.method === 'POST') ? 'REACHED SERVER' : 'blocked', pagePostResult: pr,
      guardStats: g.stats(),
    });
    await ctx.close();
    try {
    // the same with serviceWorkers: 'block'
    const n0 = hits.length;
    var b = await fresh({ label: 's3-block' }, { serviceWorkers: 'block' });
    const pg2 = await b.ctx.newPage(); await pg2.goto(H('localhost', '/s3.html')); note('S3 with serviceWorkers block: register', await pg2.evaluate(() => window.__reg));
    await sleep(500); note('S3 with serviceWorkers block: new hits on install URLs', hits.slice(n0).filter(h => h.path.startsWith('/s3-') || h.path === '/kb500.js').length);
    await b.ctx.close();
    } catch (e) { note('S3 serviceWorkers block variant error', e.message.split('\n')[0]); try { await b.ctx.close(); } catch (e2) { } }
  }

  await launch('S4');
  // S4 range requests
  pages['/s4.html'] = () => `<!doctype html><video src="${H(CDN, '/s4.mp4')}" preload="auto" muted></video><video src="${H(CDN, '/s4.mp4')}" preload="auto" muted></video>
    <video src="${H(CDN, '/noext-video-4')}" preload="auto" muted></video>
    <script>window.__r = fetch('${H(WF, '/s4-r.mp4')}', {headers:{Range:'bytes=0-99'}}).then(r=>r.status,e=>'err');
    window.__r2 = fetch('${H(WF, '/kb800.js')}', {headers:{Range:'bytes=0-99'}}).then(r=>r.status,e=>'err');</script>`;
  {
    const { ctx, g } = await fresh({ label: 's4-block' });
    const pg = await ctx.newPage(); await pg.goto(H('localhost', '/s4.html')); await pg.evaluate(() => Promise.all([window.__r, window.__r2])); await sleep(800);
    note('S4 block mode', { videoHits: count(hits, ofPath('/s4.mp4')), noExtVideoHits: count(hits, ofPath('/noext-video-4')), fetchRangeMp4: count(hits, ofPath('/s4-r.mp4')),
      rangeOnNonMedia: hits.filter(ofPath('/kb800.js')).map(h => ({ range: h.range, sent: h.sent })), guardBytes: g.stats().bytes });
    await ctx.close();
    const cdir = tmp();
    const c = await fresh({ label: 's4-cache', mode: 'cache', cacheDir: cdir });
    const n0 = hits.length;
    const pg2 = await c.ctx.newPage(); await pg2.goto(H('localhost', '/s4.html')); await sleep(1500);
    const vh = hits.slice(n0).filter(ofPath('/s4.mp4'));
    note('S4 cache mode', { videoNetworkFetches: vh.length, rangesSentUpstream: vh.map(h => h.range), sentBytes: vh.reduce((s, h) => s + h.sent, 0), stats: c.g.stats() });
    await pg2.reload(); await sleep(800);
    note('S4 cache mode after reload: new upstream video fetches', hits.slice(n0).filter(ofPath('/s4.mp4')).length - vh.length);
    await c.ctx.close();
  }

  await launch('S5');
  // S5 a page that keeps loading
  pages['/s5.html'] = () => `<!doctype html><script src="${H(WF, '/stream')}"></script><p>never</p>`;
  {
    const logFile = path.join(tmp(), 'log.md'); const trips = [];
    const { ctx, g } = await fresh({ label: 's5-stream', runCapMB: 1, logFile, onTrip: e => trips.push(e.message) });
    const pg = await ctx.newPage(); pg.goto(H('localhost', '/s5.html')).catch(() => { });
    await sleep(4000);
    const streamed = sent(hits, ofPath('/stream'));
    note('S5 endless 1.28 MB/s Webflow script, run cap 1 MB, after 4 s', { stubSentMB: +(streamed / 1e6).toFixed(2), guardMB: g.stats().mb, tripped: trips.length });
    await ctx.close(); await sleep(300);
    note('S5 log line after close', readLog(logFile));
    // polling loop of finished responses
    const logFile2 = path.join(tmp(), 'log.md'); const trips2 = [];
    pages['/s5b.html'] = () => `<!doctype html><script>setInterval(()=>fetch('${H(WF, '/kb200.js')}?'+Math.random()).catch(()=>0), 30)</script>`;
    const b = await fresh({ label: 's5-poll', runCapMB: 1, logFile: logFile2, onTrip: e => trips2.push(e.message) });
    const n0 = hits.length; const pg2 = await b.ctx.newPage(); pg2.goto(H('localhost', '/s5b.html')).catch(() => { });
    await sleep(2500); const nAt = hits.length;
    await sleep(1000);
    note('S5 polling 200 KB Webflow fetches, run cap 1 MB', { trips: trips2, fetchesBeforeStop: hits.slice(n0, nAt).filter(ofPath('/kb200.js')).length,
      stubSentMB: +(sent(hits.slice(n0), ofPath('/kb200.js')) / 1e6).toFixed(2), guardMB: b.g.stats().mb, laterHits: hits.length - nAt, log: readLog(logFile2) });
    await b.ctx.close().catch(() => { });
  }

  await launch('S6');
  // S6 two contexts in one run
  {
    const logFile = path.join(tmp(), 'log.md'), cdir = tmp();
    const run = W.createRun({ label: 's6-shared', mode: 'cache', logFile });
    const A = await browser.newContext(), B = await browser.newContext();
    const ga = W.guard(A, { run, mode: 'cache', cacheDir: cdir }), gb = W.guard(B, { run, mode: 'cache', cacheDir: cdir }); await ga.ready; await gb.ready;
    pages['/s6.html'] = () => `<!doctype html><img src="${H(CDN, '/slow-s6.png')}">`;
    const pa = await A.newPage(), pb = await B.newPage();
    await Promise.all([pa.goto(H('localhost', '/s6.html')), pb.goto(H('localhost', '/s6.html'))]); await sleep(1200);
    note('S6 two contexts, same cache, same image at the same time: upstream fetches', count(hits, ofPath('/slow-s6.png')));
    pages['/s6f.html'] = () => `<!doctype html><img src="${H(CDN, '/fail-s6.png')}">`;
    await pa.goto(H('localhost', '/s6f.html')); await sleep(400);
    await pb.goto(H('localhost', '/s6f.html')); await sleep(400);
    const C = await browser.newContext(); const gc = W.guard(C, { run, mode: 'cache', cacheDir: cdir }); await gc.ready;
    const pc = await C.newPage(); await pc.goto(H('localhost', '/s6f.html')); await sleep(400);
    note('S6 first fetch failed in A; B (guarded before) and C (guarded after) load it: upstream fetches', count(hits, ofPath('/fail-s6.png')));
    await A.close(); await B.close(); await C.close(); run.close();
    note('S6 shared run log', readLog(logFile));
  }
  await launch('S6c');
  // S6c page target: close the page, keep using the context
  {
    const logFile = path.join(tmp(), 'log.md');
    const ctx = await browser.newContext(); const p1 = await ctx.newPage();
    const g = W.guard(p1, { label: 's6c-page', logFile }); await g.ready;
    await p1.goto(H(WF, '/kb100.js')); await p1.close(); await sleep(300);
    const p2 = await ctx.newPage(); await p2.goto(H(WF, '/kb400.js')); await sleep(300);
    note('S6c page target closed, then 400 KB more in the same context', { guardMB: g.stats().mb, log: readLog(logFile) });
    await ctx.close();
  }

  await launch('S8');
  // S8 daily cap across two runs
  {
    const logFile = path.join(tmp(), 'log.md'); fs.writeFileSync(logFile, '# log\n');
    const a = await fresh({ label: 's8-a', dayCapMB: 1, logFile, onTrip: 'close' });
    const pa = await a.ctx.newPage(); await pa.goto(H(WF, '/kb600.js')); await sleep(200); await a.ctx.close(); await sleep(200);
    const tripsB = [];
    const b = await fresh({ label: 's8-b', dayCapMB: 1, logFile, onTrip: e => tripsB.push(e.cap) });
    const pb = await b.ctx.newPage(); await pb.goto(H(WF, '/kb600.js')).catch(() => { }); await sleep(300);
    note('S8 sequential runs, day cap 1 MB, 0.6 + 0.6 MB', { tripsB, log: readLog(logFile) });
    await b.ctx.close().catch(() => { });
    const logFile2 = path.join(tmp(), 'log.md'); fs.writeFileSync(logFile2, '# log\n');
    const t = [];
    const c = await fresh({ label: 's8-c', dayCapMB: 1, logFile: logFile2, onTrip: e => t.push('c ' + e.cap) });
    const d = await fresh({ label: 's8-d', dayCapMB: 1, logFile: logFile2, onTrip: e => t.push('d ' + e.cap) });
    const pc = await c.ctx.newPage(), pd = await d.ctx.newPage();
    await Promise.all([pc.goto(H(WF, '/kb600.js')), pd.goto(H(WF, '/kb600.js'))]); await sleep(300);
    await c.ctx.close(); await d.ctx.close(); await sleep(200);
    note('S8 concurrent runs, day cap 1 MB, 0.6 + 0.6 MB', { trips: t, log: readLog(logFile2), dayTotal: W.readDailyTotalMB(logFile2, new Date()) });
    // a run that starts on a day already past the cap
    let err = null; try { await fresh({ label: 's8-e', dayCapMB: 1, logFile: logFile2 }); } catch (e) { err = e.message; }
    note('S8 third run after the cap', err ? 'refused: ' + err.slice(0, 90) : 'STARTED');
  }

  await launch('S9');
  // S9 non-GET
  pages['/s9.html'] = () => `<!doctype html><form id=f method=post action="${H('localhost', '/s9-form')}"><input name=a value=1></form>
    <script>
    const R = {};
    window.__all = Promise.all([
      fetch('${H('localhost', '/s9-post')}', {method:'POST', body:'x'}).then(r=>R.post=r.status, e=>R.post='blocked'),
      fetch('${H(WF, '/s9-put')}', {method:'PUT', body:'x'}).then(r=>R.put=r.status, e=>R.put='blocked'),
      fetch('${H('localhost', '/s9-head')}', {method:'HEAD'}).then(r=>R.head=r.status, e=>R.head='blocked'),
      fetch('${H('api.memberstack.example', '/s9-patch')}', {method:'PATCH', body:'x'}).then(r=>R.patch=r.status, e=>R.patch='blocked'),
      new Promise(res => { const x = new XMLHttpRequest(); x.open('DELETE', '${H('localhost', '/s9-delete')}'); x.onload=()=>{R.del=x.status;res()}; x.onerror=()=>{R.del='blocked';res()}; x.send(); }),
    ]).then(() => { R.beacon = navigator.sendBeacon('${H('localhost', '/s9-beacon')}', 'b'); return R; });
    addEventListener('pagehide', () => { navigator.sendBeacon('${H('localhost', '/s9-beacon-unload')}', 'u'); fetch('${H('localhost', '/s9-keepalive')}', {method:'POST', body:'k', keepalive:true}); });
    </script>`;
  {
    const { ctx, g } = await fresh({ label: 's9' });
    const pg = await ctx.newPage(); await pg.goto(H('localhost', '/s9.html'));
    const r = await pg.evaluate(() => window.__all); await sleep(500);
    await pg.evaluate(() => document.getElementById('f').submit()); await sleep(800);
    await pg.goto(H('localhost', '/s9.html')); await pg.goto(H('localhost', '/hello.html')); await sleep(800);
    // a ping from <a ping>
    await pg.setContent(`<a id=l href="${H('localhost', '/hello.html')}" ping="${H('localhost', '/s9-ping')}">x</a>`); await pg.click('#l'); await sleep(800);
    await pg.request.post(H('localhost', '/s9-apirequest'), { data: 'z' }).catch(() => { });
    const nonGet = hits.filter(h => h.path.startsWith('/s9-') && h.method !== 'GET').map(h => h.method + ' ' + h.path);
    note('S9 page results', r); note('S9 non-GET requests that reached the stub', nonGet); note('S9 stats', g.stats());
    await ctx.close();
  }

  await launch('S10');
  // S10 caller route tricks
  pages['/s10.html'] = () => `<!doctype html><img src="${H('localhost', '/s10-local.png')}"><img src="${H('localhost', '/s10-b.png')}">`;
  {
    const { ctx, g } = await fresh({ label: 's10' });
    const pg = await ctx.newPage();
    await pg.route('**/s10-local.png', r => r.fallback({ url: H(CDN, '/s10-rewritten.png') }));
    await pg.route('**/s10-b.png', r => r.continue({ url: H(CDN, '/s10-cont.png') }));
    await pg.goto(H('localhost', '/s10.html')); await sleep(500);
    note('S10 caller fallback({url}) rewriting to a Webflow image', count(hits, ofPath('/s10-rewritten.png')) ? 'REACHED SERVER' : 'blocked');
    note('S10 caller continue({url}) rewriting to a Webflow image', count(hits, ofPath('/s10-cont.png')) ? 'REACHED SERVER' : 'blocked');
    // direct navigation to a Webflow image
    await pg.goto(H(CDN, '/s10-nav.png')).catch(() => { });
    note('S10 page.goto a Webflow image', count(hits, ofPath('/s10-nav.png')) ? 'REACHED SERVER' : 'blocked');
    // routes registered before guard
    await ctx.close();
    const ctx2 = await browser.newContext();
    await ctx2.route('**/s10-pre.png', r => r.continue());
    const g2 = W.guard(ctx2, { label: 's10-pre', logFile: path.join(tmp(), 'l.md') }); await g2.ready;
    const p2 = await ctx2.newPage(); await p2.setContent(`<img src="${H(CDN, '/s10-pre.png')}">`); await sleep(500);
    note('S10 caller route registered BEFORE guard (documented limit)', count(hits, ofPath('/s10-pre.png')) ? 'REACHED SERVER' : 'blocked');
    await ctx2.close();
  }

  note('unhandled rejections seen', unhandled);
  await browser.close();
  server.close();
  fs.writeFileSync(path.join(__dirname, 'main-result.json'), JSON.stringify(out, null, 1));
})().catch(e => { console.error('FATAL', e); fs.writeFileSync(path.join(__dirname, 'main-result.json'), JSON.stringify(out, null, 1)); process.exit(1); });
