'use strict';
/* C5, C6: several runs on one tally near the day cap, with Range headers a server ignores, in one Chromium.
   Run: node -r ./dnsmap.cjs cap3.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start } = require('./stub4.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfc3-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
(async () => {
  const pages = {}; const S = await start(pages);
  const CDN = `http://cdn.prod.website-files.com:${S.wf.port}`, LOC = `http://localhost:${S.other.port}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const tallyMB = st => { const t = W.readTally(st, new Date()); let b = 0; for (const r of Object.values(t.runs)) b += r.bytes || 0; return +(b / 1e6).toFixed(3); };
  for (const [tag, path0, range, kb, mode] of [
    ['C5 .js with Range bytes=0-1, server ignores Range (200, 0.9 MB)', '/kb/c5-', 'bytes=0-1', 900, 'block'],
    ['C5 same, fetch-once', '/kb/c5f-', 'bytes=0-1', 900, 'fetch-once'],
    ['C6 extensionless, no Range, server honors Range (3 MB JSON, probe and join)', '/big/c6-', null, 3000, 'block'],
    ['C6 same, fetch-once', '/big/c6f-', null, 3000, 'fetch-once'],
  ]) {
    const st = tmp(); const h0 = S.wf.hits.length; const ctxs = [], gs = [], trips = [];
    for (let k = 0; k < 4; k++) {
      pages[`/c${k}.html`] = () => `<script>window.__r = Promise.all(Array.from({length: 8}, (_, i) => fetch('${CDN}${path0}${k}-' + i + '${/kb/.test(path0) ? '.js' : ''}?kb=${kb}'${range ? `, {headers: {Range: '${range}'}}` : ''}).then(r => r.status, e => 'err')))</script>`;
      const ctx = await browser.newContext(); ctxs.push(ctx);
      const g = W.guard(ctx, { label: `adv3-c-${k}`, mode, cacheDir: tmp(), stateDir: st, logFile: path.join(tmp(), 'log.md'), dayCapMB: 5, onTrip: e => trips.push(e.message.slice(0, 120)) }); await g.ready; gs.push(g);
    }
    await Promise.all(ctxs.map(async (ctx, k) => { const pg = await ctx.newPage(); await pg.goto(`${LOC}/c${k}.html`).catch(() => { }); await pg.evaluate(() => window.__r).catch(() => { }); }));
    await sleep(1000);
    const maxDuring = tallyMB(st);
    for (const c of ctxs) await c.close().catch(() => { });
    await sleep(300);
    const hs = S.wf.hits.slice(h0);
    note(`${tag}: 4 runs on one tally, 8 fetches each, day cap 5 MB`, { tallyMB: tallyMB(st), tallyBeforeClose: maxDuring, capMB: 5, stubRequests: hs.length, stubBytesWritten: hs.reduce((a, h) => a + (h.wrote || 0), 0), perRunMB: gs.map(g => g.stats().mb), trips: trips.length });
  }
  await browser.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
