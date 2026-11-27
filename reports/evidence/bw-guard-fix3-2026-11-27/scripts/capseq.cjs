'use strict';
/* C1s: like cap.cjs C1, but the page makes its 60 fetches one after another, so the old code's false stop (N-1) does not
   hide its spend. Range bytes=0-1, the server ignores Range (200, Content-Length 3 MB), day cap 3 MB.
   Also C1b: the same 60 at once with day cap 12 MB.  Run: node -r ./dnsmap.cjs capseq.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start } = require('./stub3.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfc-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const pages = {}; const S = await start(pages); const WP = S.wf.port, OP = S.other.port;
  const CDN = `http://cdn.prod.website-files.com:${WP}`, LOC = `http://localhost:${OP}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  for (const [tag, seq, cap] of [['C1s', true, 3], ['C1b', false, 12]]) for (const mode of ['block', 'fetch-once']) {
    pages['/s.html'] = () => seq
      ? `<p>s</p><script>window.__r = (async () => { const out = []; for (let i = 0; i < 60; i++) { out.push(await fetch('${CDN}/ign/${tag}-${mode}-' + i + '.js', { headers: { Range: 'bytes=0-1' } }).then(r => r.status, e => 'err')); } return out; })()</script>`
      : `<p>s</p><script>window.__r = Promise.all(Array.from({length: 60}, (_, i) => fetch('${CDN}/ign/${tag}-${mode}-' + i + '.js', { headers: { Range: 'bytes=0-1' } }).then(r => r.status, e => 'err')))</script>`;
    const trips = []; const ctx = await browser.newContext();
    const g = W.guard(ctx, { label: 'c1s', mode, cacheDir: tmp(), logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), dayCapMB: cap, onTrip: e => trips.push(e.message) }); await g.ready;
    const h0 = S.wf.hits.length; const pg = await ctx.newPage();
    await pg.goto(LOC + '/s.html').catch(() => { }); await pg.evaluate(() => window.__r).catch(() => { }); await sleep(1500);
    const hs = S.wf.hits.slice(h0), st = g.stats();
    console.log(`${tag} ${mode}: 60 fetches ${seq ? 'one after another' : 'at once'}, Range bytes=0-1 ignored (200, 3 MB), day cap ${cap} MB`, JSON.stringify({ requests: hs.length, bytesWrittenByStub: hs.reduce((a, h) => a + (h.wrote || 0), 0), countedMB: st.mb, gets: st.gets, unfinished: st.unfinished, trip: trips[0] || null }));
    await ctx.close().catch(() => { });
  }
  await browser.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
