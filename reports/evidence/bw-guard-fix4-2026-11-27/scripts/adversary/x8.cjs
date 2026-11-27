'use strict';
/* X8r: the round 3 X8 case with the relay in its own process and a rate (RELAY_RATE): block mode and fetch-once, one page
   fetch()es 60 different 3 MB .js URLs one after another with Range bytes=0-1, the server ignores Range, day cap 12 MB.
   node -r ./dnsmap.cjs x8.cjs <tools parent>. All on 127.0.0.1 (stub4 /kb/, relayproc4). */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(path.resolve(process.argv[2], 'tools/wf-guard.cjs'));
const { start } = require('./stub4.cjs'); const { relay } = require('./relayc.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'x8-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const pages = {}; const S = await start(pages); const R = await relay(S.wf.port, +(process.env.RELAY_RATE || 0));
  const CDN = `http://cdn.prod.website-files.com:${R.port}`, LOC = `http://localhost:${S.other.port}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  for (const mode of ['block', 'fetch-once']) {
    const urls = Array.from({ length: 60 }, (_, i) => `${CDN}/kb/x8-${mode}-${i}.js?kb=3000`);
    pages['/x.html'] = () => `<script>window.__r = (async () => { let ok = 0, err = 0; for (const u of ${JSON.stringify(urls)}) { try { const r = await fetch(u, { headers: { Range: 'bytes=0-1' } }); await r.arrayBuffer(); ok++; } catch (e) { err++; } } return ok + ' ok, ' + err + ' err'; })()</script>`;
    const trips = []; const ctx = await browser.newContext();
    const g = W.guard(ctx, { label: 'adv4-x8', mode, cacheDir: tmp(), logFile: path.join(tmp(), 'log.md'), readLogs: [], stateDir: tmp(), dayCapMB: 12, onTrip: e => trips.push(e.message.slice(0, 200)) }); await g.ready;
    const h0 = S.wf.hits.length, m0 = await R.mark(); const pg = await ctx.newPage();
    await pg.goto(LOC + '/x.html').catch(() => { }); const res = await pg.evaluate(() => window.__r).catch(e => 'eval ' + e.message.slice(0, 50)); await sleep(800);
    const st = g.stats(); await ctx.close().catch(() => { }); await sleep(300);
    console.log(`X8r ${mode}`, JSON.stringify({ page: res, requests: S.wf.hits.length - h0, delivered: await R.since(m0), perConn: (await R.conns(m0)), counted: st.bytes, trip: trips[0] || null }));
  }
  await browser.close(); R.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
