'use strict';
/* check-repro (fix3): A-6. An extensionless 3 MB file sent as application/octet-stream whose first bytes are an MP4 header
   ("ftyp" at offset 4) or a WebM header, Range honoured or ignored; fetch-once without allowVideo, and block. The relay runs
   in its own process (../relayproc.cjs). Run: node -r ../dnsmap.cjs x3.cjs <tree> */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http'), { spawn } = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const T = process.argv[2]; const W = require(T + '/tools/wf-guard.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfx3-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const mp4 = Buffer.alloc(3e6, 1); Buffer.from([0, 0, 0, 0x20]).copy(mp4, 0); mp4.write('ftypisom', 4, 'latin1');
  const webm = Buffer.alloc(3e6, 1); Buffer.from([0x1a, 0x45, 0xdf, 0xa3]).copy(webm, 0);
  const hits = [];
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x'); const range = req.headers.range || null; hits.push(u.pathname + ' ' + (range || 'no range'));
    const full = u.pathname.includes('webm') ? webm : mp4; const honour = !u.pathname.includes('ign');
    const h = { 'content-type': 'application/octet-stream', 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' };
    const m = honour && /^bytes=(\d+)-(\d*)$/.exec(range || '');
    if (m) { const a = +m[1], b = m[2] ? Math.min(+m[2], full.length - 1) : full.length - 1; res.writeHead(206, Object.assign(h, { 'content-range': `bytes ${a}-${b}/${full.length}`, 'content-length': b - a + 1 })); return res.end(full.subarray(a, b + 1)); }
    res.writeHead(200, Object.assign(h, { 'content-length': full.length })); res.end(full);
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const rp = spawn(process.execPath, [path.join(__dirname, '../relayproc.cjs'), String(srv.address().port)], { stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  const [P, CP] = (await new Promise(ok => rp.stdout.once('data', d => ok(String(d).trim())))).split(' ').map(Number);
  const conns = () => new Promise(ok => http.get(`http://127.0.0.1:${CP}/`, r => { let b = ''; r.on('data', d => b += d); r.on('end', () => ok(JSON.parse(b))); }));
  const loc = http.createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); s.end('<p>x</p>'); }); await new Promise(r => loc.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  for (const mode of ['fetch-once', 'block']) for (const p of ['/mp4-octet', '/webm-octet', '/mp4-octet-ign']) {
    const ctx = await browser.newContext(); const g = W.guard(ctx, { label: 'x3', mode, cacheDir: tmp(), logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), onTrip: 'close' }); await g.ready;
    const pg = await ctx.newPage(); await pg.goto(`http://localhost:${loc.address().port}/`).catch(() => { });
    const c0 = (await conns()).length, h0 = hits.length;
    const res = await pg.evaluate(async u => { try { const r = await fetch(u); const b = await r.arrayBuffer(); return [r.status, b.byteLength]; } catch (e) { return 'blocked'; } }, `http://cdn.prod.website-files.com:${P}${p}-${mode}`);
    await sleep(500); const del = (await conns()).slice(c0);
    console.log(`X3 ${mode}: fetch() of an extensionless octet-stream ${p.includes('webm') ? 'WebM' : 'MP4'} 3 MB, Range ${p.includes('ign') ? 'ignored' : 'honoured'}`, JSON.stringify({ page: res, requests: hits.slice(h0), deliveredPerConnection: del, delivered: del.reduce((a, b) => a + b, 0), counted: g.stats().bytes, blocked: g.stats().blocked }));
    await ctx.close().catch(() => { });
  }
  await browser.close(); rp.kill(); srv.close(); loc.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
