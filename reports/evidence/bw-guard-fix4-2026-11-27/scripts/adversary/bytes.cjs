'use strict';
/* B1 to B4: Webflow bytes at a relay, one tools tree per run (old 686e520 or new 49889e7; round 3 script, relay moved to its own process).
   Run: node -r ./dnsmap.cjs bytes.cjs <tools parent> [only]   (RELAY_RATE=<bytes/s> limits the relay)
   Every Webflow host name goes to the relay port on 127.0.0.1 (Chromium: host resolver rules; curl: --connect-to). */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const only = process.argv[3] || '';
const { start } = require('./stub4.cjs');
const RATE = +(process.env.RELAY_RATE || 0); const { relay } = require('./relayc.cjs'); /* round 4: the relay runs in its own process */
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfb-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
(async () => {
  const pages = {}; const S = await start(pages); const R = await relay(S.wf.port, RATE); if (RATE) console.log(`relay limited to ${RATE} bytes/s`);
  const CDN = `http://cdn.prod.website-files.com:${R.port}`, LOC = `http://localhost:${S.other.port}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const one = async (tag, url, o, cacheDir) => {
    pages['/p.html'] = () => `<p>${tag}</p><script>window.__r = fetch('${url}').then(async r => r.status + ' ' + (await r.arrayBuffer()).byteLength, e => 'err ' + e.message)</script>`;
    const trips = []; const ctx = await browser.newContext();
    const g = W.guard(ctx, Object.assign({ label: 'adv4-' + tag.split(' ')[0], logFile: path.join(tmp(), 'log.md'), stateDir: o.stateDir || tmp(), cacheDir, onTrip: e => trips.push(e.message) }, o)); await g.ready;
    const h0 = S.wf.hits.length, m0 = await R.mark(); const pg = await ctx.newPage();
    await pg.goto(LOC + '/p.html').catch(() => { }); const res = await pg.evaluate(() => window.__r).catch(e => 'eval ' + e.message); await sleep(800);
    const st = g.stats(); await ctx.close().catch(() => { }); await sleep(200);
    const hs = S.wf.hits.slice(h0);
    const out = { page: res, wfRequests: hs.map(h => `${h.path.split('?')[0]}${h.range ? ' ' + h.range : ''}`), deliveredAtRelay: await R.since(m0), countedBytes: st.bytes, trip: trips[0] || null };
    note(`${tag} ${o.mode}`, out); return out;
  };
  /* B1: an extensionless JSON of 8 MB (over getCapMB 5), server honors Range, Content-Length known */
  if (!only || only === 'B1') for (const mode of ['block', 'fetch-once']) {
    for (let i = 0; i < 3; i++) await one(`B1 8 MB extensionless JSON, Range honored, try ${i + 1}`, `${CDN}/big/b1-${mode}-${i}?kb=8000`, { mode }, tmp());
    await one('B1v 8 MB extensionless video/mp4, Range honored', `${CDN}/big/b1v-${mode}?kb=8000&ct=video/mp4`, { mode }, tmp());
  }
  /* B2: an extensionless 3 MB JSON, server honors Range but sends "bytes a-b/*" */
  if (!only || only === 'B2') for (const mode of ['block', 'fetch-once']) await one('B2 3 MB extensionless JSON, 206 with total "*"', `${CDN}/star/b2-${mode}?kb=3000`, { mode }, tmp());
  /* B3: fetch-once, the same URL as B2 in three runs on one cache folder, run cap 1.02 MB each (fresh stateDir per run) */
  if (!only || only === 'B3') { const cd = tmp(); for (let i = 1; i <= 3; i++) await one(`B3 fetch-once run ${i} of 3 on one cache folder, run cap 1.02 MB`, `${CDN}/star/b3?kb=3000`, { mode: 'fetch-once', runCapMB: 1.02 }, cd); }
  /* B4: block, run cap 1 MB, a 0.98 MB script with 60 KB of response headers */
  if (!only || only === 'B4') for (const mode of ['block', 'fetch-once']) await one('B4 0.98 MB .js with 60 KB of headers, run cap 1 MB', `${CDN}/hdr/b4-${mode}.js?kb=980&hk=60&ct=application/javascript`, { mode, runCapMB: 1 }, tmp());
  if (!only || only === 'B4') await one('B4b 0.95 MB .js with 20 KB of headers, run cap 1 MB', `${CDN}/hdr/b4b.js?kb=960&hk=20&ct=application/javascript`, { mode: 'block', runCapMB: 1 }, tmp());
  /* B5: the R-1 cases: an extensionless 3 MB JSON whose server honors Range, the same from a server that ignores Range, a 0.5 MB one */
  if (!only || only === 'B5') for (const mode of ['block', 'fetch-once']) {
    await one('B5a 3 MB extensionless JSON, Range honored', `${CDN}/big/b5a-${mode}?kb=3000`, { mode }, tmp());
    await one('B5b 3 MB extensionless JSON, Range ignored', `${CDN}/kb/b5b-${mode}?kb=3000`, { mode }, tmp());
    await one('B5c 0.5 MB extensionless JSON, Range honored', `${CDN}/big/b5c-${mode}?kb=500`, { mode }, tmp());
  }
  /* B6: extensionless application/octet-stream files whose first bytes are a video or another format, fetch-once */
  if (!only || only === 'B6') for (const k of ['mp4', 'webm', 'avi', 'ts', 'ogg', 'flv', 'text']) await one(`B6 extensionless octet-stream ${k}, 3 MB, Range honored`, `${CDN}/sniff/${k}/b6`, { mode: 'fetch-once' }, tmp());
  await browser.close(); R.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
