'use strict';
/* check-repro (fix3): x2.cjs X8 with per-connection delivered bytes (relay.cjs); run with X8_ONLY_BLOCK=n */
/* check-repro (fix3), more extra probes on one tree, same setup as x.cjs (stub on 127.0.0.1 behind ../relayline.cjs).
   X7: fetch-once allowVideo, an empty cache, a page fetch() of an extensionless 3 MB video (Range honoured) with Range bytes=0-.
   X8: 60 fetches one after another with Range bytes=0-1, server ignores Range (3 MB), day cap 12 MB (C1b, one by one).
   X9: R-4: g.goto() and g.finalResponse() on an apex 301 to www (new head only; older trees lack them).
   X10: one page navigates to 12 different apex URLs that 301 to www pages, within a few seconds (the 8 in 10 s limit).
   Run: node -r ../dnsmap.cjs x2.cjs <tree> */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const T = process.argv[2]; const W = require(T + '/tools/wf-guard.cjs');
const { relay } = require('../relay.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfx2-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
(async () => {
  const hits = []; let LP = 0;
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x'); const p = u.pathname; const range = req.headers.range || null; hits.push({ host: req.headers.host, path: p + u.search, range });
    if (p.startsWith('/vid')) {
      const full = Buffer.alloc(3e6, 7); const m = /^bytes=(\d+)-(\d*)$/.exec(range || ''); const h = { 'content-type': 'video/mp4', 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'accept-ranges': 'bytes' };
      if (m) { const a = +m[1], b = m[2] ? Math.min(+m[2], full.length - 1) : full.length - 1; res.writeHead(206, Object.assign(h, { 'content-range': `bytes ${a}-${b}/${full.length}`, 'content-length': b - a + 1 })); return res.end(full.subarray(a, b + 1)); }
      res.writeHead(200, Object.assign(h, { 'content-length': full.length })); return res.end(full);
    }
    if (p.startsWith('/ign/')) { const b = Buffer.alloc(3e6, 5); res.writeHead(200, { 'content-type': 'application/javascript', 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'content-length': b.length }); return res.end(b); }
    if (p === '/r') { res.writeHead(301, { location: u.searchParams.get('to'), 'content-length': 0 }); return res.end(); }
    if (p.startsWith('/landing')) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('<p>landing ' + p + '</p>' + ' '.repeat(5000)); }
    res.writeHead(404); res.end();
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const R = await relay(srv.address().port); let P = R.port; R.srv = { close: R.close };
  /* SEPARATE=1: the relay runs in its own process (../relayproc.cjs) and R.conns is read from it */
  let ctlPort = 0, rp = null;
  if (process.env.SEPARATE) {
    rp = require('child_process').spawn(process.execPath, [path.join(__dirname, '../relayproc.cjs'), String(srv.address().port)], { stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
    const line = await new Promise(ok => rp.stdout.once('data', d => ok(String(d).trim()))); P = +line.split(' ')[0]; ctlPort = +line.split(' ')[1];
  }
  const sepConns = () => new Promise(ok => http.get(`http://127.0.0.1:${ctlPort}/`, r => { let b = ''; r.on('data', d => b += d); r.on('end', () => ok(JSON.parse(b))); }));
  const CDN = `http://cdn.prod.website-files.com:${P}`, WWW = `http://www.thatlayover.life:${P}`, APEX = `http://thatlayover.life:${P}`;
  const pages = {};
  const loc = http.createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end(pages[q.url] || '<p>blank</p>'); });
  await new Promise(r => loc.listen(0, '127.0.0.1', r)); const LOC = `http://localhost:${loc.address().port}`;
  let browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const mk = async o => { const trips = []; const ctx = await browser.newContext(); const g = W.guard(ctx, Object.assign({ logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), onTrip: e => trips.push(e.message) }, o)); await g.ready; return { ctx, g, trips }; };
  console.log('start');
  if (process.env.PRE_CURL) { /* control: the same bytes as the new head's X7, sent by a plain curl (through the wrapper), no guard */
    const { execFile } = require('child_process');
    await new Promise(ok => execFile('curl', ['-sS', '--no-buffer', '-o', '/dev/null', '-H', 'range: bytes=' + process.env.PRE_CURL, '--noproxy', '*', '--connect-to', '::127.0.0.1:', '--url', `${CDN}/vid-pre`], () => ok()));
    console.log('PRE_CURL done');
  }
  if (!process.env.SKIP_X7) { /* X7 (SKIP_X7=1 skips it) */
    const { ctx, g } = await mk({ label: 'x7', mode: 'fetch-once', cacheDir: tmp(), allowVideo: true }); const pg = await ctx.newPage(); await pg.goto(LOC + '/blank').catch(() => { });
    await sleep(200); console.log('-- reset'); const h0 = hits.length;
    const res = await pg.evaluate(async u => { try { const r = await fetch(u, { headers: { Range: 'bytes=0-' } }); const b = await r.arrayBuffer(); return [r.status, b.byteLength]; } catch (e) { return 'blocked'; } }, `${CDN}/vid-x7`);
    await sleep(400);
    note('X7 fetch-once allowVideo, empty cache: fetch() of an extensionless 3 MB video with Range bytes=0-', { page: res, requests: hits.slice(h0).map(h => h.range || 'no range'), counted: g.stats().bytes });
    await ctx.close().catch(() => { });
    if (process.env.SLEEP_AFTER_X7) await sleep(+process.env.SLEEP_AFTER_X7);
    if (process.env.RELAUNCH) { await browser.close(); browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] }); }
    if (process.env.LAG) { await sleep(1000); const hs = process._getActiveHandles().map(h => h.constructor.name); const cnt = {}; for (const h of hs) cnt[h] = (cnt[h] || 0) + 1;
      let lag = 0; for (let i = 0; i < 40; i++) { const t = Date.now(); await sleep(10); lag = Math.max(lag, Date.now() - t - 10); }
      const tm = process.getActiveResourcesInfo ? process.getActiveResourcesInfo().filter(x => x === 'Timeout').length : null;
      note('LAG after X7', { handles: cnt, timeouts: tm, maxTimerLagMs: lag }); }
  }
  for (const mode of (process.env.X8_ONLY_BLOCK ? Array(+process.env.X8_ONLY_BLOCK).fill('block') : ['block', 'fetch-once'])) { /* X8 (X8_ONLY_BLOCK=n: block mode n times, then exit) */
    pages['/x8'] = `<p>x8</p><script>window.__r = (async () => { const out = []; for (let i = 0; i < 60; i++) out.push(await fetch('${CDN}/ign/x8-${mode}-' + i + '.js', { headers: { Range: 'bytes=0-1' } }).then(r => r.status, e => 'err')); return out; })()</script>`;
    const { ctx, g, trips } = await mk({ label: 'x8', mode, cacheDir: tmp(), dayCapMB: 12 }); const pg = await ctx.newPage();
    console.log('-- reset'); const h0 = hits.length; const c0 = process.env.SEPARATE ? (await sepConns()).length : R.conns.length;
    await pg.goto(LOC + '/x8').catch(() => { }); const r = await pg.evaluate(() => window.__r).catch(() => 'closed'); await sleep(1000);
    const st = g.stats();
    note(`X8 ${mode}: 60 fetches one after another, Range bytes=0-1 ignored (200, 3 MB), day cap 12 MB`, { perConnectionDelivered: process.env.SEPARATE ? (await sepConns()).slice(c0) : R.conns.slice(c0).map(c => c.delivered), requests: hits.length - h0, served200: Array.isArray(r) ? r.filter(x => x === 200).length : r, counted: st.bytes, gets: st.gets, trip: (trips[0] || '').slice(0, 160) });
    await ctx.close().catch(() => { });
  }
  if (process.env.X8_ONLY_BLOCK) { await browser.close(); process.exit(0); }
  if (W.countFor) { /* X9: R-4 helpers (new head only) */
    const { ctx, g } = await mk({ label: 'x9', mode: 'block' }); const pg = await ctx.newPage(); console.log('-- reset');
    const r1 = await pg.goto(`${APEX}/r?to=${encodeURIComponent(WWW + '/landing-x9')}`).catch(e => null);
    const f = g.finalResponse ? await g.finalResponse(pg, 5000) : null; const fInfo = f && [f.status(), f.url(), (await f.text()).slice(0, 20)];
    const r2 = g.goto ? await g.goto(pg, `${APEX}/r?to=${encodeURIComponent(WWW + '/landing-x9b')}`).catch(e => null) : null;
    note('X9 R-4: page.goto vs g.finalResponse vs g.goto on an apex 301 to www', { gotoStatus: r1 && r1.status(), gotoMark: r1 && r1.headers()['x-wf-guard-redirect'], finalResponse: fInfo, gGoto: r2 && [r2.status(), r2.url(), !!r2.headers()['x-wf-guard-redirect'], (await r2.text()).slice(0, 20)], gets: g.stats().gets });
    await ctx.close().catch(() => { });
  } else console.log('X9 skipped: no g.goto or g.finalResponse in this tree');
  { /* X10 */
    const { ctx, g } = await mk({ label: 'x10', mode: 'block' }); const pg = await ctx.newPage(); console.log('-- reset'); const h0 = hits.length; const urls = [];
    for (let i = 0; i < 12; i++) { await pg.goto(`${APEX}/r?to=${encodeURIComponent(WWW + '/landing-x10-' + i)}`).catch(() => { }); urls.push(pg.url().replace(/^.*\//, '')); }
    await sleep(300); const st = g.stats();
    note('X10 block: one page goes to 12 apex URLs that 301 to www pages, one after another', { requests: hits.length - h0, gets: st.gets, pageLoads: st.pageLoads, redirectPages: st.redirectPages, redirectDirect: st.redirectDirect, finalUrls: urls });
    await ctx.close().catch(() => { });
  }
  await browser.close(); if (rp) rp.kill(); srv.close(); loc.close(); R.srv.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
