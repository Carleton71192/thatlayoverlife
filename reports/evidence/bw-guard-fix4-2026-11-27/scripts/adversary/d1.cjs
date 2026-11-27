'use strict';
/* D1, D2: F-3 (too little left of a cap) across runs, old (686e520) vs new (49889e7), in a browser.
   node -r ./dnsmap.cjs d1.cjs <tools parent>
   The day total is set by a closed run in the tally (no log files are read). Delivered bytes are counted by a relay in its
   own process (relayproc4.cjs); the stub is stub4.cjs. Every host name maps to 127.0.0.1. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(path.resolve(process.argv[2], 'tools/wf-guard.cjs'));
const { start } = require('./stub4.cjs'); const { relay } = require('./relayc.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'd1-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
const prefill = (st, mb) => { const d = new Date(); fs.mkdirSync(st, { recursive: true }); fs.writeFileSync(path.join(st, `tally-${d.toISOString().slice(0, 10)}.json`), JSON.stringify({ runs: { earlier: { label: 'earlier', pid: 999999, bytes: mb * 1e6, reserved: 0, closed: true, updated: d.toISOString() } } })); };
(async () => {
  const pages = {}; const S = await start(pages); const R = await relay(S.wf.port, +(process.env.RELAY_RATE || 0));
  const CDN = `http://cdn.prod.website-files.com:${R.port}`, LOC = `http://localhost:${S.other.port}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const runPage = async (tag, o, script) => {
    pages['/d.html'] = () => `<p>${tag}</p><script>${script}</script>`;
    const trips = []; const ctx = await browser.newContext();
    const g = W.guard(ctx, Object.assign({ label: 'adv4-d', logFile: path.join(tmp(), 'log.md'), readLogs: [], onTrip: e => trips.push(e.message.slice(0, 160)) }, o)); await g.ready;
    const h0 = S.wf.hits.length, m0 = await R.mark(); const pg = await ctx.newPage();
    await pg.goto(LOC + '/d.html').catch(() => { }); const res = await pg.evaluate(() => window.__r).catch(e => 'eval ' + e.message.slice(0, 60)); await sleep(500);
    const st = g.stats(); await ctx.close().catch(() => { }); await sleep(200);
    const out = { page: res, wfRequests: S.wf.hits.slice(h0).map(h => h.path.split('?')[0]), delivered: await R.since(m0), counted: st.bytes, lowRefused: st.lowRefused, cacheFetches: st.cacheFetches, cacheRefused: st.cacheRefused, trip: trips[0] || null };
    note(tag, out); return out;
  };
  const seq = urls => `window.__r = (async () => { const o = []; for (const u of ${JSON.stringify(urls)}) { try { const r = await fetch(u); o.push(r.status + ' ' + (await r.arrayBuffer()).byteLength); } catch (e) { o.push('err'); } } return o.join(', '); })()`;
  /* D1: fetch-once, run 1 with 0.3 MB left of a 3 MB day cap, run 2 with a fresh day budget, one cache folder.
     The page asks for a 3 MB script, then a 50 KB script. */
  {
    const cd = tmp(), urls = [`${CDN}/kb/d1-big.js?kb=3000`, `${CDN}/kb/d1-small.js?kb=50`];
    const st1 = tmp(); prefill(st1, 2.7);
    const a = await runPage('D1 run 1: fetch-once, 0.3 MB left of a 3 MB day cap', { mode: 'fetch-once', cacheDir: cd, stateDir: st1, dayCapMB: 3 }, seq(urls));
    const b = await runPage('D1 run 2: fetch-once, fresh day budget (cap 10 MB), same cache', { mode: 'fetch-once', cacheDir: cd, stateDir: tmp(), dayCapMB: 10 }, seq(urls));
    const c = await runPage('D1 run 3: fetch-once, fresh day budget (cap 10 MB), same cache', { mode: 'fetch-once', cacheDir: cd, stateDir: tmp(), dayCapMB: 10 }, seq(urls));
    note('D1 total', { delivered: a.delivered + b.delivered + c.delivered, requests: a.wfRequests.length + b.wfRequests.length + c.wfRequests.length });
  }
  /* D1b: the same with only the 50 KB script */
  {
    const cd = tmp(), urls = [`${CDN}/kb/d1b-small.js?kb=50`];
    const st1 = tmp(); prefill(st1, 2.7);
    const a = await runPage('D1b run 1: fetch-once, 0.3 MB left, 50 KB script', { mode: 'fetch-once', cacheDir: cd, stateDir: st1, dayCapMB: 3 }, seq(urls));
    const b = await runPage('D1b run 2: fresh day budget (cap 10 MB), same cache', { mode: 'fetch-once', cacheDir: cd, stateDir: tmp(), dayCapMB: 10 }, seq(urls));
    note('D1b total', { delivered: a.delivered + b.delivered, requests: a.wfRequests.length + b.wfRequests.length });
  }
  /* D2: block mode, 0.3 MB left of a 3 MB day cap, the page asks for a 50 KB script 40 times in a row */
  await runPage('D2 block, 0.3 MB left, one 50 KB script asked for 40 times', { mode: 'block', stateDir: (() => { const s = tmp(); prefill(s, 2.7); return s; })(), dayCapMB: 3 },
    seq(Array.from({ length: 40 }, (_, i) => `${CDN}/kb/d2.js?kb=50&n=${i}`)));
  /* D3: block mode, a redirect hop with 70 KB of headers (stub4 /hdr does not redirect; use a .js with 70 KB headers), far from a cap */
  await runPage('D3 block, a .js with 70 KB of headers, asked for 3 times', { mode: 'block', stateDir: tmp() },
    seq([`${CDN}/hdr/d3.js?kb=100&hk=70`, `${CDN}/hdr/d3.js?kb=100&hk=70`, `${CDN}/hdr/d3.js?kb=100&hk=70`]));
  await browser.close(); R.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
