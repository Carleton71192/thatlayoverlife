'use strict';
/* check-repro (fix3), extra probes on one tree. One Chromium, every host name mapped to 127.0.0.1, no proxy. A local stub on
   127.0.0.1 answers on Webflow host names through a relay (../relayline.cjs), so the figure per line is what reached the
   client host. Nothing here talks to the internet.
   X1: an extensionless 3 MB JSON whose server answers a Range with a 206 of unknown total ("bytes 0-999999/*").
   X2: an extensionless 3 MB JSON whose server answers every Range with 416 and a whole GET with 200.
   X3: an extensionless 1.2 MB JSON, server honours Range (one chunk plus a small rest).
   X4: block mode, run cap 2 MB, 12 endless chunked streams at once: counted, reserved and delivered.
   X5: wf-get style run with a run cap: an endless stream; counted vs the cap.
   X6: a tally entry whose pid is alive but whose start time differs (A-5), and one with no start time (older runs).
   Run: node -r ../dnsmap.cjs x.cjs <tree> */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http'), { spawn } = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const T = process.argv[2]; const W = require(T + '/tools/wf-guard.cjs');
const { relay } = require('../relayline.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfx-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
function stub() {
  const hits = [];
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x'); const p = u.pathname; const range = req.headers.range || null;
    const rec = { path: p + u.search, range }; hits.push(rec);
    const h = { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' };
    if (p.startsWith('/star')) {
      const full = Buffer.alloc(3e6, 66); const m = /^bytes=(\d+)-(\d*)$/.exec(range || '');
      if (m) { const a = +m[1], b = m[2] ? Math.min(+m[2], full.length - 1) : full.length - 1; res.writeHead(206, Object.assign(h, { 'content-range': `bytes ${a}-${b}/*`, 'content-length': b - a + 1 })); return res.end(full.subarray(a, b + 1)); }
      res.writeHead(200, Object.assign(h, { 'content-length': full.length })); return res.end(full);
    }
    if (p.startsWith('/r416')) {
      if (range) { res.writeHead(416, Object.assign(h, { 'content-range': 'bytes */3000000', 'content-length': 0 })); return res.end(); }
      const full = Buffer.alloc(3e6, 67); res.writeHead(200, Object.assign(h, { 'content-length': full.length })); return res.end(full);
    }
    if (p.startsWith('/j12')) {
      const full = Buffer.alloc(1.2e6, 68); const m = /^bytes=(\d+)-(\d*)$/.exec(range || '');
      if (m) { const a = +m[1], b = m[2] ? Math.min(+m[2], full.length - 1) : full.length - 1; res.writeHead(206, Object.assign(h, { 'content-range': `bytes ${a}-${b}/${full.length}`, 'content-length': b - a + 1, 'accept-ranges': 'bytes' })); return res.end(full.subarray(a, b + 1)); }
      res.writeHead(200, Object.assign(h, { 'content-length': full.length })); return res.end(full);
    }
    if (p.startsWith('/endless')) {
      res.writeHead(200, { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }); const c = Buffer.alloc(64000, 32); let on = true;
      const go = () => { while (on) { if (!res.write(c)) return res.once('drain', go); } }; res.on('close', () => { on = false; }); return go();
    }
    if (p === '/page.html') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('<p>x</p>'); }
    res.writeHead(404); res.end();
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r({ srv, port: srv.address().port, hits })));
}
(async () => {
  const S = await stub(); const R = await relay(S.port); const CDN = `http://cdn.prod.website-files.com:${R.port}`;
  const L = await stub(); const LOC = `http://localhost:${L.port}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const mk = async o => { const trips = []; const ctx = await browser.newContext(); const g = W.guard(ctx, Object.assign({ logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), onTrip: e => trips.push(e.message) }, o)); await g.ready; return { ctx, g, trips }; };
  console.log('start'); /* resets the relay line counter */
  for (const [name, p] of [['X1 206 with unknown total (bytes 0-999999/*)', '/star'], ['X2 416 to every Range, 200 without', '/r416'], ['X3 1.2 MB, Range honoured', '/j12']]) {
    for (const mode of ['fetch-once', 'block']) {
      const { ctx, g } = await mk({ label: 'x', mode, cacheDir: tmp() }); const pg = await ctx.newPage(); await pg.goto(LOC + '/page.html').catch(() => { });
      await sleep(300); console.log('-- reset'); const h0 = S.hits.length;
      const res = await pg.evaluate(async u => { try { const r = await fetch(u); const b = await r.arrayBuffer(); return [r.status, b.byteLength]; } catch (e) { return 'blocked'; } }, `${CDN}${p}-${mode}`);
      await sleep(400);
      note(`${name}, ${mode}: page fetch() of an extensionless Webflow URL`, { page: res, requests: S.hits.slice(h0).map(h => h.range || 'no range'), counted: g.stats().bytes });
      await ctx.close().catch(() => { });
    }
  }
  /* X4: 12 endless streams at once, block mode, run cap 2 MB */
  {
    L.srv.removeAllListeners('request');
    L.srv.on('request', (q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(`<p>x4</p><script>for(let i=0;i<12;i++) fetch('${CDN}/endless.js?i='+i).then(r=>r.text()).catch(()=>{})</script>`); });
    const { ctx, g, trips } = await mk({ label: 'x4', mode: 'block', runCapMB: 2 }); const pg = await ctx.newPage();
    console.log('-- reset'); const h0 = S.hits.length;
    await pg.goto(LOC + '/x4.html').catch(() => { }); await sleep(6000);
    const st = g.stats(); const res = g.run.reserved; await ctx.close().catch(() => { }); await sleep(500);
    note('X4 block, run cap 2 MB, 12 endless Webflow streams at once', { requests: S.hits.length - h0, counted: st.bytes, reservedAtStop: res, capBytes: 2e6, countedPlusReservedOverCap: st.bytes + res > 2e6, gets: st.gets, unfinished: st.unfinished, trip: trips[0] || null });
  }
  await browser.close();
  /* X5: one run (createRun + curlFetch as wf-get does), endless stream, run cap 0.5 MB */
  {
    const G = require(T + '/tools/wf-get.cjs');
    console.log('-- reset');
    const r = await G.wfGet([`${CDN}/endless.js?w=1`], { label: 'x5', quiet: true, stateDir: tmp(), logFile: path.join(tmp(), 'log.md'), out: tmp(), runCapMB: 0.5 });
    await sleep(400);
    note('X5 wf-get, run cap 0.5 MB, one endless stream', { counted: r.bytes, capBytes: 5e5, countedOverCap: r.bytes > 5e5, stopped: r.stopped && r.stopped.message.slice(0, 200) });
  }
  /* X6: stale reservations (no browser) */
  {
    const holder = spawn('sleep', ['30']); await sleep(200);
    for (const [name, entry] of [['pid alive, start time differs', { pid: holder.pid, pidStart: '1' }], ['pid alive, no start time stored', { pid: holder.pid }], ['pid alive, start time matches', { pid: holder.pid, pidStart: W.procStart ? W.procStart(holder.pid) : undefined }]]) {
      const st = tmp(); const day = new Date();
      fs.writeFileSync(path.join(st, `tally-${day.toISOString().slice(0, 10)}.json`), JSON.stringify({ runs: { hold01: Object.assign({ label: 'holder', bytes: 0, reserved: 1e6, closed: false }, entry) } }));
      const run = W.createRun({ label: 'x6', stateDir: st, logFile: path.join(tmp(), 'log.md'), dayCapMB: 1.5, reserveWaitS: 1, onTrip: 'close', noLog: true });
      const g = await run.reserveWait(); note(`X6 tally: 1 MB reserved by a live pid, ${name}; day cap 1.5 MB`, { grant: g, tripped: !!run.error });
      run.close();
    }
    holder.kill('SIGKILL');
  }
  R.srv.close(); S.srv.close(); L.srv.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
