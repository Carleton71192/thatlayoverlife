'use strict';
/* check-repro (fix4) T1 to T7: GETs that are cut or refused at a size limit, where loopback buffering makes the delivered bytes
   swing run to run. Here the relay runs in its own process and is limited to RELAY_RATE bytes per second (default 12.5 MB/s,
   a 100 Mbit/s link), so what is delivered past the cut is what a real link would carry. Old and new alternate, REPS times.
   Run: node -r ./dnsmap.cjs cut4.cjs <old tree> <new tree>. Everything is on 127.0.0.1. */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { relay } = require('./relayfile.cjs');
const RATE = +(process.env.RELAY_RATE || 12500000), REPS = +(process.env.REPS || 6);
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfc-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x'), p = u.pathname;
    if (p === '/page.html') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(`<script>fetch('${u.searchParams.get('f')}').then(r => r.text()).catch(() => {})</script>`); }
    const c = Buffer.alloc(64000, 32); const mb = +(u.searchParams.get('mb') || 0);
    if (p.startsWith('/len')) { res.writeHead(200, { 'content-type': 'application/javascript', 'content-length': mb * 1e6, 'access-control-allow-origin': '*' }); }
    else res.writeHead(200, { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' });
    let left = p.startsWith('/endless') ? Infinity : mb * 1e6;
    const go = () => { while (left > 0) { const k = Math.min(c.length, left); left -= k; if (!res.write(k === c.length ? c : c.subarray(0, k))) return res.once('drain', go); } res.end(); };
    res.on('close', () => { left = 0; }); go();
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const R = await relay(srv.address().port, RATE); const CDN = `http://cdn.prod.website-files.com:${R.port}`;
  const trees = process.argv.slice(2).map(t => ({ t, tag: path.basename(t), G: require(t + '/tools/wf-get.cjs'), W: require(t + '/tools/wf-guard.cjs') }));
  const cases = [
    ['T1 wf-get, endless chunked stream, run cap 0.5 MB', 'endless.js', { runCapMB: 0.5 }],
    ['T2 wf-get, chunked 3 MB, run cap 0.5 MB', 'chunked.js?mb=3', { runCapMB: 0.5 }],
    ['T3 wf-get, content-length 3 MB, --max-filesize 1', 'len.js?mb=3', { maxFileMB: 1 }],
    ['T4 wf-get, chunked 30 MB, --max-filesize 1', 'chunked.js?mb=30', { maxFileMB: 1 }],
    ['T5 wf-get, endless chunked stream, run cap 2 MB', 'endless.js', { runCapMB: 2 }],
    ['T6 wf-get, content-length 30 MB, default 5 MB limit', 'len.js?mb=30', {}],
  ];
  const out = {};
  for (const [name, p, o] of cases) for (let i = 0; i < REPS; i++) for (const T of (i % 2 ? trees.slice().reverse() : trees)) {
    await sleep(300); const m = R.mark();
    const r = await T.G.wfGet([`${CDN}/${p}${p.includes('?') ? '&' : '?'}i=${i}&t=${T.tag}`], Object.assign({ label: 'cut4', quiet: true, stateDir: tmp(), logFile: path.join(tmp(), 'log.md'), out: tmp() }, o));
    await sleep(700); const k = `${name} | ${T.tag}`; (out[k] = out[k] || []).push([r.bytes, R.since(m)]);
  }
  /* T7: the browser guard in block mode, one endless stream fetched by a page, run cap 2 MB (X4 one stream at a time) */
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  for (let i = 0; i < REPS; i++) for (const T of (i % 2 ? trees.slice().reverse() : trees)) {
    const ctx = await browser.newContext(); const trips = [];
    const g = T.W.guard(ctx, { label: 'cut4-t7', mode: 'block', runCapMB: 2, logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), onTrip: e => trips.push(e.message) }); await g.ready;
    const pg = await ctx.newPage(); await sleep(200); const m = R.mark();
    await pg.goto(`http://localhost:${srv.address().port}/page.html?f=${encodeURIComponent(CDN + '/endless.js?b=' + i + T.tag)}`).catch(() => { });
    for (let w = 0; w < 100 && !trips.length; w++) await sleep(100);
    await sleep(700); const st = g.stats(); await ctx.close().catch(() => { }); await sleep(300);
    const k = `T7 guard block, page fetch of an endless stream, run cap 2 MB | ${T.tag}`; (out[k] = out[k] || []).push([st.bytes, R.since(m)]);
  }
  await browser.close();
  const med = a => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  for (const [k, rows] of Object.entries(out)) { const d = rows.map(r => r[1]), c = rows.map(r => r[0]);
    console.log(k, JSON.stringify({ rate: RATE, counted: c, delivered: d, deliveredMedian: med(d), deliveredMin: Math.min(...d), deliveredMax: Math.max(...d), countedMax: Math.max(...c) })); }
  srv.close(); R.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
