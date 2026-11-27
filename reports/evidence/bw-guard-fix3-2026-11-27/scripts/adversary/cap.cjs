'use strict';
/* C1 to C4: caps, reservations and the size-limit allowance in a browser run, old (686e520) and new code.
   Run: node -r ./dnsmap.cjs cap.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start } = require('./stub3.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfc-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
(async () => {
  const pages = {}; const S = await start(pages); const WP = S.wf.port, OP = S.other.port;
  const CDN = `http://cdn.prod.website-files.com:${WP}`, LOC = `http://localhost:${OP}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const base = o => Object.assign({ logFile: path.join(tmp(), 'log.md'), stateDir: tmp() }, o);
  const since = h0 => { const hs = S.wf.hits.slice(h0); return { requests: hs.length, bytesWrittenByStub: hs.reduce((a, h) => a + (h.wrote || 0), 0) }; };
  const fetches = (n, tag, url, range) => `<p>${tag}</p><script>window.__r = Promise.all(Array.from({length:${n}}, (_, i) => fetch('${url}'.replace('N', i)${range ? `, {headers: {Range: '${range}'}}` : ''}).then(r => r.status, e => 'err')))</script>`;

  /* C1: 60 Webflow GETs at once, each with a small Range the server ignores (200, Content-Length 3 MB), day cap 3 MB */
  for (const mode of ['block', 'fetch-once']) {
    pages['/c1.html'] = () => fetches(60, 'c1', `${CDN}/ign/c1-${mode}-N.js`, 'bytes=0-1');
    const trips = []; const ctx = await browser.newContext();
    const g = W.guard(ctx, base({ label: 'c1', mode, cacheDir: tmp(), dayCapMB: 3, onTrip: e => trips.push(e.message) })); await g.ready;
    const h0 = S.wf.hits.length; const pg = await ctx.newPage();
    await pg.goto(LOC + '/c1.html').catch(() => { }); await pg.evaluate(() => window.__r).catch(() => { }); await sleep(1500);
    const st = g.stats();
    note(`C1 ${mode}: 60 fetches with Range bytes=0-1, server ignores Range (200, 3 MB), day cap 3 MB`, Object.assign(since(h0), { countedMB: st.mb, dayCapMB: 3, tooBig: st.tooBig, gets: st.gets, responses: st.responses, unfinished: st.unfinished, logLine: W.logLine ? g.run.line() : null, trip: trips[0] || null }));
    await ctx.close().catch(() => { });
  }
  /* C2: the same 60 GETs without a Range header (each reserves getCapMB) for comparison */
  {
    pages['/c2.html'] = () => fetches(60, 'c2', `${CDN}/ign/c2-N.js`, null);
    const trips = []; const ctx = await browser.newContext();
    const g = W.guard(ctx, base({ label: 'c2', mode: 'block', dayCapMB: 3, getCapMB: 1, onTrip: e => trips.push(e.message) })); await g.ready;
    const h0 = S.wf.hits.length; const pg = await ctx.newPage();
    await pg.goto(LOC + '/c2.html').catch(() => { }); await pg.evaluate(() => window.__r).catch(() => { }); await sleep(1500);
    const st = g.stats();
    note('C2 block: 60 fetches, no Range, server sends 3 MB, getCapMB 1, day cap 3 MB', Object.assign(since(h0), { countedMB: st.mb, gets: st.gets, trip: trips[0] || null }));
    await ctx.close().catch(() => { });
  }
  /* C3: N-3 probe. An extensionless 3 MB video sent as application/octet-stream (no video type), fetch-once without
     allowVideo and block mode; and a 3 MB extensionless JSON from a server that ignores Range */
  for (const mode of ['fetch-once', 'block']) {
    pages['/c3.html'] = () => `<p>c3</p><script>window.__r = Promise.all([
      fetch('${CDN}/octet/clip-${mode}').then(r => r.arrayBuffer()).then(b => b.byteLength, e => 'err'),
      fetch('${CDN}/ign/data-${mode}?ct=application/json').then(r => r.arrayBuffer()).then(b => b.byteLength, e => 'err'),
      fetch('${CDN}/octet/real-${mode}?ct=video/mp4').then(r => r.arrayBuffer()).then(b => b.byteLength, e => 'err')])</script>`;
    const ctx = await browser.newContext();
    const g = W.guard(ctx, base({ label: 'c3', mode, cacheDir: tmp(), onTrip: 'close' })); await g.ready;
    const h0 = S.wf.hits.length; const pg = await ctx.newPage();
    await pg.goto(LOC + '/c3.html').catch(() => { }); const res = await pg.evaluate(() => window.__r).catch(e => 'ERR'); await sleep(800);
    note(`C3 ${mode}: extensionless octet-stream 3 MB, 3 MB JSON with Range ignored, 3 MB video/mp4`, { pageGot: res, perRequest: S.wf.hits.slice(h0).map(h => `${h.path} range=${h.range} wrote=${h.wrote}`), countedMB: g.stats().mb, blocked: g.stats().blocked });
    await ctx.close().catch(() => { });
  }
  /* C4: extensionless video through resource types other than fetch/xhr, fetch-once without allowVideo */
  {
    pages['/c4.html'] = () => `<p>c4</p><iframe src="${CDN}/noext-video-if"></iframe><embed src="${CDN}/noext-video-em"><object data="${CDN}/noext-video-ob"></object>
      <script src="${CDN}/noext-video-sc"></script><link rel="prefetch" href="${CDN}/noext-video-pf"><script>new EventSource('${CDN}/noext-video-es');</script>`;
    const ctx = await browser.newContext();
    const g = W.guard(ctx, base({ label: 'c4', mode: 'fetch-once', cacheDir: tmp(), onTrip: 'close' })); await g.ready;
    const h0 = S.wf.hits.length; const pg = await ctx.newPage();
    await pg.goto(LOC + '/c4.html').catch(() => { }); await sleep(2500);
    note('C4 fetch-once: extensionless 3 MB video by iframe, embed, object, script, prefetch, EventSource', { perRequest: S.wf.hits.slice(h0).map(h => `${h.path} range=${h.range} wrote=${h.wrote}`), countedMB: g.stats().mb });
    await ctx.close().catch(() => { });
  }
  await browser.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
