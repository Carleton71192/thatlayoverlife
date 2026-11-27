// Does guard() (a context route) turn off the browser HTTP cache? Local stub only, no Webflow host.
const http = require('http'), path = require('path');
const { chromium } = require('playwright');
const { guard } = require(path.resolve(process.argv[2], 'tools/wf-guard.cjs'));
let hits = {};
const srv = http.createServer((q, r) => {
  hits[q.url] = (hits[q.url] || 0) + 1;
  if (q.url.startsWith('/s.css')) { r.writeHead(200, { 'content-type': 'text/css', 'cache-control': 'public, max-age=3600' }); return r.end('body{color:red}' + ' '.repeat(50000)); }
  r.writeHead(200, { 'content-type': 'text/html', 'cache-control': 'no-cache' }); r.end('<link rel=stylesheet href="/s.css"><p>x</p>');
});
srv.listen(0, '127.0.0.1', async () => {
  const base = `http://127.0.0.1:${srv.address().port}`;
  const b = await chromium.launch();
  for (const withGuard of [false, true]) {
    hits = {};
    const ctx = await b.newContext();
    let g = null;
    if (withGuard) { g = guard(ctx, { label: 'cache-probe', hosts: ['127.0.0.1'], logFile: path.join(__dirname, 'probe-log.md') }); await g.ready; }
    const p = await ctx.newPage();
    for (let i = 0; i < 3; i++) { await p.goto(base + '/p' + i); }
    const st = g ? g.stats() : null;
    await ctx.close();
    console.log(JSON.stringify({ withGuard, cssHits: hits['/s.css'] || 0, htmlHits: Object.keys(hits).filter(k => k.startsWith('/p')).length, guardBytes: st && st.bytes }));
  }
  await b.close(); srv.close();
});
