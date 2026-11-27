'use strict';
/* K1: in fetch-once, a GET refused after waiting for other runs' reservations keeps its one-fetch claim, so the URL is
   never fetched later, although nothing was fetched. K2: the same when the context closes during the wait.
   Run: node -r ./dnsmap.cjs claim.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start } = require('./stub3.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfk-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
(async () => {
  const pages = {}; const S = await start(pages); const CDN = `http://cdn.prod.website-files.com:${S.wf.port}`, LOC = `http://localhost:${S.other.port}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  for (const k of ['K1 wait times out', 'K2 context closes during the wait']) {
    const st = tmp(), cacheDir = tmp(), day = new Date(); const holder = spawn('sleep', ['60']);
    fs.writeFileSync(path.join(st, `tally-${day.toISOString().slice(0, 10)}.json`), JSON.stringify({ runs: { hold01: { label: 'holder', pid: holder.pid, bytes: 0, reserved: 2e6, closed: false } } }));
    pages['/k.html'] = () => `<img src="${CDN}/k-${k[1]}.png"><p>k</p>`;
    const h0 = S.wf.hits.length;
    let ctx = await browser.newContext(); let g = W.guard(ctx, { label: 'k', mode: 'fetch-once', cacheDir, stateDir: st, logFile: path.join(tmp(), 'log.md'), dayCapMB: 2, reserveWaitS: k[1] === '1' ? 1 : 30, onTrip: 'close' }); await g.ready;
    let pg = await ctx.newPage(); pg.goto(LOC + '/k.html').catch(() => { });
    await sleep(k[1] === '1' ? 2500 : 800);
    const s1 = g.stats(); await ctx.close().catch(() => { }); await sleep(300);
    holder.kill('SIGKILL'); await sleep(200);
    ctx = await browser.newContext(); g = W.guard(ctx, { label: 'k2', mode: 'fetch-once', cacheDir, stateDir: st, logFile: path.join(tmp(), 'log.md'), dayCapMB: 2, onTrip: 'close' }); await g.ready;
    pg = await ctx.newPage(); await pg.goto(LOC + '/k.html').catch(() => { }); await sleep(800);
    const s2 = g.stats();
    note(k, { first: { waits: s1.waits, waitRefused: s1.waitRefused, cacheFetches: s1.cacheFetches }, laterRunWithBudget: { cacheFetches: s2.cacheFetches, cacheRefused: s2.cacheRefused, cacheHits: s2.cacheHits }, webflowStubRequests: S.wf.hits.length - h0, claimFiles: fs.readdirSync(cacheDir).filter(f => f.endsWith('.claim')).length });
    await ctx.close().catch(() => { });
  }
  await browser.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
