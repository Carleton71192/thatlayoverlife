'use strict';
/* N7: many Webflow GETs at once (fetch-once) against the run cap; N2r: unrouteAll race repeated; S6c: guard(page) log after the page closes. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start } = require('./stub2r.cjs');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wfn7-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
(async () => {
  const pages = {}; const S = await start(pages); const WP = S.wf.port, OP = S.other.port;
  const CDN = `http://cdn.prod.website-files.com:${WP}`, WFH = `http://www.thatlayover.life:${WP}`, LOC = `http://localhost:${OP}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const base = o => Object.assign({ logFile: path.join(tmp(), 'log.md'), stateDir: tmp() }, o);
  for (const n of [30, 45]) {
    pages['/n7.html'] = () => Array.from({ length: n }, (_, i) => `<img src="${CDN}/slow-n7-${n}-${i}.png?ms=800">`).join('');
    const trips = []; const ctx = await browser.newContext();
    const g = W.guard(ctx, base({ label: 'n7', mode: 'fetch-once', cacheDir: tmp(), onTrip: e => trips.push(e.message) })); await g.ready;
    const h0 = S.wf.hits.length; const pg = await ctx.newPage();
    await pg.goto(LOC + '/n7.html').catch(() => { }); await sleep(2500);
    const st = g.stats();
    note(`N7 fetch-once page with ${n} Webflow images at once (about 70 bytes each), run cap 200 MB, getCapMB 5`, { trips, countedBytes: st.bytes, stubRequests: S.wf.hits.length - h0, cacheFetches: st.cacheFetches, stopped: st.stopped });
    await ctx.close().catch(() => { });
  }
  // the same near the daily cap: the logs already hold 240 MB today
  {
    const logf = path.join(tmp(), 'log.md'); const d = new Date();
    fs.writeFileSync(logf, `- ${d.getUTCDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]}, earlier work: 240 MB (M)\n`);
    pages['/n7b.html'] = () => Array.from({ length: 3 }, (_, i) => `<img src="${CDN}/slow-n7b-${i}.png?ms=800">`).join('');
    const trips = []; const ctx = await browser.newContext();
    const g = W.guard(ctx, base({ label: 'n7b', mode: 'fetch-once', cacheDir: tmp(), logFile: logf, onTrip: e => trips.push(e.message) })); await g.ready;
    const pg = await ctx.newPage(); await pg.goto(LOC + '/n7b.html').catch(() => { }); await sleep(2000);
    note('N7b 240 MB already logged today (10 MB left), a page with 3 small Webflow images at once', { trips, countedBytes: g.stats().bytes, cacheFetches: g.stats().cacheFetches });
    await ctx.close().catch(() => { });
  }
  // N2r: unrouteAll race, 40 rounds
  {
    const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'n2r', onTrip: 'close' })); await g.ready;
    const pg = await ctx.newPage(); await pg.goto(LOC + '/next.html').catch(() => { });
    pages['/next.html'] = () => '<p>n</p>';
    await pg.setContent(`<script>let i=0; setInterval(()=>{ for (let k=0;k<30;k++) { const im=new Image(); im.src='${CDN}/race-'+(i++)+'.png'; fetch('${WFH}/racef-'+(i++)+'.js').catch(()=>0); } }, 1)</script>`);
    await sleep(300); const h0 = S.wf.hits.length, c0 = S.wf.conns.length;
    for (let k = 0; k < 40; k++) { await ctx.unrouteAll({ behavior: 'ignoreErrors' }); await sleep(5); await ctx.unroute('**/*').catch(() => { }); await sleep(5); }
    await sleep(500);
    note('N2r race: page requests Webflow URLs every 1 ms while the caller runs unrouteAll and unroute 40 times', { httpRequestsAtWebflowStub: S.wf.hits.length - h0, sample: S.wf.hits.slice(h0, h0 + 3).map(h => h.path), tcpConnections: S.wf.conns.length - c0, misses: g.stats().misses, leaks: g.stats().leaks });
    await ctx.close();
  }
  // S6c: guard(page), page closed, then more Webflow traffic in the same context (block mode so bytes are counted)
  {
    const logf = path.join(tmp(), 'log.md'); const ctx = await browser.newContext(); const p1 = await ctx.newPage();
    const g = W.guard(p1, base({ label: 's6c', mode: 'block', logFile: logf, onTrip: 'close' })); await g.ready;
    await p1.goto(WFH + '/kb100.js').catch(() => { }); await p1.close(); await sleep(300);
    const p2 = await ctx.newPage(); await p2.goto(WFH + '/kb400.js').catch(() => { }); await sleep(300);
    const before = fs.existsSync(logf) ? fs.readFileSync(logf, 'utf8') : '';
    await ctx.close(); await sleep(300);
    note('S6c guard(page): page closed, 400 KB more in the same context', { guardMB: g.stats().mb, logBeforeContextClose: before, logAfter: fs.readFileSync(logf, 'utf8').trim() });
  }
  await browser.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
