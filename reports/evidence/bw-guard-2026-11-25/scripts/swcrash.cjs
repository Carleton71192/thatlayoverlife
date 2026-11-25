const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { start } = require('./stub.cjs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const pages = {}; const { server, port } = await start(pages); const H = (h, p) => `http://${h}:${port}${p}`;
  pages.__sw = () => `self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(Promise.all([fetch('${H('cdn.prod.website-files.com', '/s3-install.png')}').catch(()=>0), fetch('${H('localhost', '/s3-sw-post')}', {method:'POST', body:'x'}).catch(()=>0), fetch('${H('www.thatlayover.life', '/kb500.js')}').catch(()=>0)])); });
    self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
    self.addEventListener('fetch', e => { if (e.request.url.includes('/s3-')) e.respondWith(fetch(e.request)); });`;
  pages['/s3.html'] = () => `<!doctype html><script>window.__reg = navigator.serviceWorker.register('/sw.js').then(()=>navigator.serviceWorker.ready).then(()=>'ok', e=>'err '+e);</script>`;
  pages['/s3b.html'] = () => `<!doctype html><img src="${H('cdn.prod.website-files.com', '/s3-ctrl.png')}"><script>window.__p = fetch('${H('localhost', '/s3-page-post')}', {method:'POST', body:'y'}).then(r=>r.status,e=>'blocked');</script>`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  browser.on('disconnected', () => console.log('browser disconnected'));
  const W = require(process.argv[2] + '/tools/wf-guard.cjs');
  const mode = process.argv[3];
  const ctx = await browser.newContext();
  if (mode !== 'noguard') { const g = W.guard(ctx, { label: 'x', logFile: '/dev/null' }); await g.ready; }
  const pg = await ctx.newPage();
  await pg.goto(H('localhost', '/s3.html')); console.log(await pg.evaluate(() => window.__reg)); await sleep(500);
  await pg.goto(H('localhost', '/s3b.html')); console.log('post', await pg.evaluate(() => window.__p)); await sleep(500);
  console.log('closing'); await ctx.close().catch(e => console.log('close err', e.message)); console.log('closed');
  for (const sw of ['block', 'allow']) for (const gd of [false, true]) {
    const c2 = await browser.newContext({ serviceWorkers: sw }).catch(e => (console.log('newContext err', e.message.split('\n')[0]), null));
    if (!c2) break;
    if (gd) { const g2 = W.guard(c2, { label: 'y', logFile: '/dev/null' }); await g2.ready; }
    const p2 = await c2.newPage(); p2.on('crash', () => console.log('PAGE CRASH'));
    await p2.goto(H('localhost', '/s3.html')).catch(e => console.log('goto err', e.message.split('\n')[0]));
    console.log('sw', sw, 'guard', gd, await p2.evaluate(() => window.__reg).catch(e => 'EVAL ERR ' + e.message.split('\n')[0]));
    await c2.close().catch(() => { });
  }
  await browser.close().catch(() => { }); server.close(); console.log('done');
})();
