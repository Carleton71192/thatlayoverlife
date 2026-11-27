'use strict';
/* R3b: how far the redirect-page loop of R3 goes in block mode: a 200 KB page, run cap 20 MB. Old and new code.
   Run: node -r ./dnsmap.cjs loop.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start } = require('./stub3.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfl-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const S = await start({}); const WWW = `http://www.thatlayover.life:${S.wf.port}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  for (const [label, raw] of [['pipe', '/loop/t|x?kb=200'], ['caret', '/loop/t^x?kb=200']]) {
    const trips = []; const ctx = await browser.newContext();
    const g = W.guard(ctx, { label: 'r3b', mode: 'block', logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), runCapMB: 20, onTrip: e => trips.push(e.message) }); await g.ready;
    const pg = await ctx.newPage(); const h0 = S.wf.hits.length, t0 = Date.now();
    pg.goto(`${WWW}/loop/start?raw=${encodeURIComponent(raw)}`).catch(() => { });
    while (!trips.length && Date.now() - t0 < 60000) await sleep(250);
    const hs = S.wf.hits.slice(h0);
    console.log(`R3b block, redirect to ${raw}, server 301s the escaped form back, run cap 20 MB`, JSON.stringify({ seconds: (Date.now() - t0) / 1000, wfRequests: hs.length, stubBytesWritten: hs.reduce((a, h) => a + (h.wrote || 0), 0), countedMB: g.stats().mb, pageLoads: g.stats().pageLoads, redirectPages: g.stats().redirectPages, trip: trips[0] || 'no trip in 60 s' }));
    await ctx.close().catch(() => { });
  }
  await browser.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
