'use strict';
/* Browser probes for N-1 to N-4 and N-7 on one worktree. One Chromium, every host name mapped to 127.0.0.1, no proxy.
   Webflow host names use the port of a relay (relay.cjs) in front of a local stub, so "delivered" is what reached the client
   host. A second stub ("x") behind its own relay serves odd answers for N-3. Nothing here talks to the internet.
   Run: node -r ./dnsmap.cjs repro-browser.cjs <worktree> [P1,P2,P3,P4,P7] */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const WT = process.argv[2]; const W = require(WT + '/tools/wf-guard.cjs');
const { start } = require('./stub2.cjs'); const { relay } = require('./relay.cjs');
const only = (process.argv[3] || 'P1,P2,P3,P4,P7').split(',');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wfrb-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const T0 = Date.now();
const note = (k, v) => console.log(((Date.now() - T0) / 1000).toFixed(1) + 's', k, JSON.stringify(v));
const unhandled = []; process.on('unhandledRejection', e => { unhandled.push(String(e && e.message).split('\n')[0]); });
const curlLog = () => { const f = path.join(tmp(), 'curl.log'); process.env.CURL_WRAP_LOG = f; return () => { try { return fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(l => l.split(' ').pop()); } catch (e) { return []; } }; };

/* stub "x": answers for N-3 (n = bytes, r = honours Range) */
function xstub() {
  const hits = [];
  const kinds = {
    '/nr-video': { type: 'video/mp4', n: 3e6, r: false }, '/nr-video-chunked': { type: 'video/mp4', n: 3e6, r: false, chunked: true },
    '/r-video': { type: 'video/mp4', n: 3e6, r: true }, '/json-big': { type: 'application/json', n: 3e6, r: true },
    '/json-big-nr': { type: 'application/json', n: 3e6, r: false }, '/json-small': { type: 'application/json', n: 3e5, r: true },
    '/json-08': { type: 'application/json', n: 8e5, r: true }, '/font-noext': { type: 'font/woff2', n: 3e6, r: true },
    '/img-noext': { type: 'image/png', n: 3e6, r: true }, '/v.json': { type: 'video/mp4', n: 3e6, r: true },
    '/page-noext': { type: 'text/html', n: 2e6, r: false },
  };
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x'); const k = kinds[u.pathname];
    const rec = { path: u.pathname + u.search, range: req.headers.range || null, ua: req.headers['user-agent'] || '' }; hits.push(rec);
    if (!k) { res.writeHead(404); return res.end(); }
    const full = Buffer.alloc(k.n, 65);
    const m = k.r && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    const h = { 'content-type': k.type, 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'accept-ranges': k.r ? 'bytes' : 'none' };
    if (m) {
      let a, b; if (m[1] === '') { a = k.n - +m[2]; b = k.n - 1; } else { a = +m[1]; b = m[2] ? Math.min(+m[2], k.n - 1) : k.n - 1; }
      res.writeHead(206, Object.assign(h, { 'content-range': `bytes ${a}-${b}/${k.n}`, 'content-length': b - a + 1 })); return res.end(full.subarray(a, b + 1));
    }
    if (k.chunked) { res.writeHead(200, h); let left = k.n; const c = Buffer.alloc(64000, 65); const go = () => { while (left > 0) { const x = c.subarray(0, Math.min(c.length, left)); left -= x.length; if (!res.write(x)) return res.once('drain', go); } res.end(); }; res.on('close', () => { left = 0; }); return go(); }
    res.writeHead(200, Object.assign(h, { 'content-length': k.n })); res.end(full);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r({ srv, port: srv.address().port, hits })));
}

(async () => {
  const pages = {}; const S = await start(pages); const RL = await relay(S.wf.port); const X = await xstub(); const RX = await relay(X.port);
  const WP = RL.port, OP = S.other.port;
  const WFH = `http://www.thatlayover.life:${WP}`, APEX = `http://thatlayover.life:${WP}`, CDN = `http://cdn.prod.website-files.com:${WP}`, LOC = `http://localhost:${OP}`;
  const XC = `http://cdn.prod.website-files.com:${RX.port}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const base = o => Object.assign({ logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), onTrip: 'close' }, o);
  const mk = async (o, co) => { const trips = []; const ctx = await browser.newContext(co); const g = W.guard(ctx, base(Object.assign({ onTrip: e => trips.push(e.message) }, o))); await g.ready; return { ctx, g, trips }; };
  const hitsSince = h0 => S.wf.hits.slice(h0);
  const logOf = g => { try { return fs.readFileSync(g._logFile, 'utf8').trim(); } catch (e) { return null; } };

  if (only.includes('P1')) {
    /* N-1a: 100 slow images at once in fetch-once (getCapMB 5, run cap 200 MB: 40 reservations fill the run cap) */
    for (const n of [45, 100]) {
      pages[`/p1-${n}.html`] = () => Array.from({ length: n }, (_, i) => `<img src="${CDN}/slow-p1-${n}-${i}.png?ms=800">`).join('');
      const { ctx, g, trips } = await mk({ label: 'p1', mode: 'fetch-once', cacheDir: tmp() }); const h0 = S.wf.hits.length;
      const pg = await ctx.newPage(); await pg.goto(`${LOC}/p1-${n}.html`).catch(() => { }); await sleep(4000);
      const loaded = await pg.evaluate(() => [...document.images].filter(i => i.naturalWidth > 0).length).catch(() => null);
      const st = g.stats(); await ctx.close().catch(() => { });
      note(`P1a fetch-once, ${n} slow Webflow images at once`, { imagesLoaded: loaded, stubRequests: S.wf.hits.length - h0, trips, stopped: st.stopped, waits: st.waits, waitRefused: st.waitRefused, bytes: st.bytes });
    }
    /* N-1b: run cap 1 MB, ten 200 KB scripts at once in block mode: four fit */
    {
      pages['/p1b.html'] = () => Array.from({ length: 10 }, (_, i) => `<script src="${WFH}/kb200.js?i=${i}"></script>`).join('');
      const logFile = path.join(tmp(), 'log.md');
      const { ctx, g, trips } = await mk({ label: 'p1b', mode: 'block', runCapMB: 1, logFile }); const h0 = S.wf.hits.length, r0 = RL.mark();
      const pg = await ctx.newPage(); await pg.goto(`${LOC}/p1b.html`).catch(() => { }); await sleep(1500);
      const st = g.stats(); await ctx.close().catch(() => { }); await sleep(300);
      note('P1b block, run cap 1 MB, ten 200 KB Webflow scripts at once', { stubRequests: S.wf.hits.length - h0, completeResponses: hitsSince(h0).filter(h => h.wrote >= 200000).length, deliveredToClient: RL.since(r0), counted: st.bytes, trips, log: fs.readFileSync(logFile, 'utf8').trim() });
    }
    /* N-1c: GETs serialised by reservations (getCapMB 5, run cap 6 MB); the context closes while four wait */
    {
      pages['/p1c.html'] = () => Array.from({ length: 5 }, (_, i) => `<img src="${CDN}/slow-p1c-${i}.png?ms=2500">`).join('');
      const { ctx, g } = await mk({ label: 'p1c', mode: 'fetch-once', cacheDir: tmp(), runCapMB: 6 }); const h0 = S.wf.hits.length;
      const pg = await ctx.newPage(); pg.goto(`${LOC}/p1c.html`).catch(() => { }); await sleep(1200);
      const st = g.stats(); const t = Date.now(); await ctx.close().catch(() => { }); const closeS = (Date.now() - t) / 1000; await sleep(6000);
      note('P1c fetch-once, run cap 6 MB so one GET at a time; context closed while GETs wait', { stubRequestsAtClose: st.gets + 1, stubRequestsAfter6s: S.wf.hits.length - h0, waits: st.waits, contextCloseSeconds: closeS });
    }
    /* N-1d: the same with reserveWaitS 1: GETs that wait longer are refused, the run goes on */
    {
      const logFile = path.join(tmp(), 'log.md');
      pages['/p1d.html'] = () => Array.from({ length: 4 }, (_, i) => `<img src="${CDN}/slow-p1d-${i}.png?ms=2500">`).join('');
      const { ctx, g, trips } = await mk({ label: 'p1d', mode: 'fetch-once', cacheDir: tmp(), runCapMB: 6, reserveWaitS: 1, logFile }); const h0 = S.wf.hits.length;
      const pg = await ctx.newPage(); await pg.goto(`${LOC}/p1d.html`).catch(() => { }); await sleep(6000);
      const st = g.stats(); await ctx.close().catch(() => { });
      note('P1d fetch-once, one GET at a time, reserveWaitS 1, four 2.5 s images', { stubRequests: S.wf.hits.length - h0, waits: st.waits, waitRefused: st.waitRefused, stopped: st.stopped, trips, log: fs.readFileSync(logFile, 'utf8').trim() });
    }
  }

  if (only.includes('P2')) {
    /* N-2a: block mode, a page with a 6 MB script (Content-Length) and an 8 MB chunked script, loaded three times */
    pages['/p2.html'] = () => `<script src="${WFH}/kb6000.js"></script><script src="${WFH}/chunked?kb=8000"></script>`;
    const logFile = path.join(tmp(), 'log.md');
    const { ctx, g, trips } = await mk({ label: 'p2', mode: 'block', logFile }); const h0 = S.wf.hits.length, r0 = RL.mark();
    const pg = await ctx.newPage(); for (let i = 0; i < 3; i++) { await pg.goto(`${LOC}/p2.html`).catch(() => { }); await sleep(800); }
    const st = g.stats(); await ctx.close().catch(() => { }); await sleep(300);
    note('P2a block, 6 MB and chunked 8 MB Webflow scripts, page loaded 3 times', { stubRequests: hitsSince(h0).map(h => h.path), deliveredToClient: RL.since(r0), counted: st.bytes, countedCoversDelivered: st.bytes >= RL.since(r0), tooBig: st.tooBig, refusedAgain: st.refusedAgain, trips, log: fs.readFileSync(logFile, 'utf8').trim() });
    /* N-2b: run cap 1 MB, a page polls 200 KB files one by one */
    pages['/p2b.html'] = () => `<script>(async()=>{for(let i=0;i<8;i++){try{await (await fetch('${WFH}/kb200.js?poll='+i)).text()}catch(e){}}})()</script>`;
    {
      const lf = path.join(tmp(), 'log.md');
      const { ctx, g, trips } = await mk({ label: 'p2b', mode: 'block', runCapMB: 1, logFile: lf }); const h0 = S.wf.hits.length, r0 = RL.mark();
      const pg = await ctx.newPage(); await pg.goto(`${LOC}/p2b.html`).catch(() => { }); await sleep(2500);
      const st = g.stats(); await ctx.close().catch(() => { }); await sleep(300);
      note('P2b block, run cap 1 MB, page polls 200 KB Webflow files', { stubRequests: S.wf.hits.length - h0, deliveredToClient: RL.since(r0), counted: st.bytes, countedCoversDelivered: st.bytes >= RL.since(r0), trips, log: fs.readFileSync(lf, 'utf8').trim() });
    }
  }

  if (only.includes('P3')) {
    /* N-3: fetch() of extensionless (and one mislabelled) Webflow URLs, by mode; what reached the stub and the client */
    const cases = [['nr-video', {}], ['nr-video-chunked', {}], ['r-video', {}], ['r-video', { range: 'bytes=0-' }], ['json-small', {}], ['json-08', {}], ['json-big', {}], ['json-big-nr', {}], ['font-noext', {}], ['img-noext', {}], ['v.json', {}], ['page-noext', {}]];
    for (const [mode, extra] of [['fetch-once', {}], ['fetch-once', { allowVideo: true }], ['block', {}]]) {
      const { ctx, g } = await mk(Object.assign({ label: 'p3', mode, cacheDir: mode === 'fetch-once' ? tmp() : undefined }, extra));
      const pg = await ctx.newPage(); await pg.goto(`${LOC}/blank.html`).catch(() => { });
      for (const [p, o] of cases) {
        const h0 = X.hits.length, r0 = RX.mark(), b0 = g.stats().bytes;
        const res = await pg.evaluate(async ([u, range]) => { try { const r = await fetch(u, range ? { headers: { Range: range } } : {}); const b = await r.arrayBuffer(); return [r.status, b.byteLength]; } catch (e) { return 'blocked'; } }, [`${XC}/${p}?m=${mode}${extra.allowVideo ? 'v' : ''}`, o.range]);
        await sleep(150);
        note(`P3 ${mode}${extra.allowVideo ? ' allowVideo' : ''}: fetch() of /${p}${o.range ? ' with Range ' + o.range : ''}`, { page: res, requests: X.hits.slice(h0).map(h => h.range || 'no range'), deliveredToClient: RX.since(r0), counted: g.stats().bytes - b0 });
      }
      await ctx.close().catch(() => { });
    }
  }

  if (only.includes('P4')) {
    pages['/landing.html'] = () => `<p>landing</p><img src="rel.png"><script>window.__loc = location.href</script>`;
    pages['/x y.html'] = () => `<p>space</p><script>window.__loc = location.href</script>`;
    const go = async (label, mode, startUrl, finalPath, co, cacheDir, extra) => {
      const { ctx, g } = await mk(Object.assign({ label, mode, cacheDir }, extra || {}), co); const h0 = S.wf.hits.length, oh0 = S.other.hits.length; const cl = curlLog();
      const pg = await ctx.newPage(); let resp = null, err = null;
      try { resp = await pg.goto(startUrl); } catch (e) { err = e.message.split('\n')[0].slice(0, 90); }
      const right = { urlAfterGoto: pg.url(), respStatus: resp && resp.status(), respRedirectMark: resp && !!resp.headers()['x-wf-guard-redirect'] };
      await sleep(800);
      const r = Object.assign(right, { err, pageUrl: pg.url(), locationHref: await pg.evaluate(() => window.__loc || null).catch(() => null),
        finalFetches: hitsSince(h0).filter(h => decodeURIComponent(h.path) === finalPath).length, relImage: hitsSince(h0).filter(h => h.path === '/rel.png').map(h => h.host),
        otherHostRequests: S.other.hits.slice(oh0).map(h => h.path), stubRequests: hitsSince(h0).length, curlCalls: cl().length });
      const st = g.stats(); r.pageLoads = st.pageLoads; r.redirectPages = st.redirectPages; r.misses = st.misses; r.cacheHits = st.cacheHits; r.leaks = st.leaks; r.redirectLimit = st.redirectLimit;
      await ctx.close().catch(() => { }); return r;
    };
    const r301 = to => `${APEX}/r?code=301&to=${encodeURIComponent(to)}`;
    for (const mode of ['block', 'fetch-once']) {
      const cd = mode === 'fetch-once' ? tmp() : undefined;
      note(`P4a ${mode}: apex 301 to www /landing.html`, await go('p4a', mode, r301(WFH + '/landing.html'), '/landing.html', {}, cd));
      if (cd) note('P4b cache-only on the cache P4a filled: the same navigation', await go('p4b', 'cache-only', r301(WFH + '/landing.html'), '/landing.html', {}, cd));
    }
    note('P4c block: 301 to an upper-case host and a path with a space', await go('p4c', 'block', `${APEX}/r?code=301&to=${encodeURIComponent('http://WWW.THATLAYOVER.LIFE:' + WP + '/x y.html#frag')}`, '/x y.html', {}));
    note('P4d block: Webflow 302 to a localhost page', await go('p4d', 'block', `${APEX}/r?code=302&to=${encodeURIComponent(LOC + '/landing.html')}`, '/landing.html', {}));
    note('P4e block, JavaScript off: apex 301 to www', await go('p4e', 'block', r301(WFH + '/landing.html'), '/landing.html', { javaScriptEnabled: false }));
    /* a redirect loop: /r on the apex host points to itself with a counter; 25 hops before it ends at /landing.html */
    const loop = (i, end) => i >= end ? `${WFH}/landing.html` : `${APEX}/r?code=302&to=${encodeURIComponent(loop(i + 1, end))}`;
    for (const hops of [20, 21, 25]) note(`P4f block: a chain of ${hops} redirects before /landing.html`, await go('p4f', 'block', loop(0, hops), '/landing.html', {}));
    note('P4g fetch-once: a chain of 25 redirects', await go('p4g', 'fetch-once', loop(0, 25), '/landing.html', {}, tmp()));
    /* an iframe whose src redirects (not the main frame): unchanged behaviour expected */
    pages['/p4h.html'] = () => `<iframe src="${r301(WFH + '/landing.html')}"></iframe>`;
    note('P4h block: an iframe that redirects apex to www', await go('p4h', 'block', `${LOC}/p4h.html`, '/landing.html', {}));
  }

  if (only.includes('P7')) {
    /* N-7: a live page sends a beacon and a POST fetch to Webflow; then the wording of trips */
    pages['/p7.html'] = () => `<script>window.r=[navigator.sendBeacon('${WFH}/b7'), 0]; fetch('${WFH}/p7', {method:'POST', body:'x'}).then(()=>window.r[1]='sent',()=>window.r[1]='stopped')</script>`;
    const lf = path.join(tmp(), 'log.md');
    const { ctx, g } = await mk({ label: 'p7', mode: 'cache-only', logFile: lf }); const h0 = S.wf.hits.length;
    const pg = await ctx.newPage(); await pg.goto(`${LOC}/p7.html`).catch(() => { }); await sleep(500);
    const r = await pg.evaluate(() => window.r).catch(() => null); const st = g.stats(); await ctx.close().catch(() => { }); await sleep(300);
    note('P7a live page: sendBeacon and POST fetch to Webflow', { pageResults: r, webflowStub: S.wf.hits.slice(h0).map(h => h.method + ' ' + h.path), nonGet: st.nonGet, unloadStopped: st.unloadStopped, log: fs.readFileSync(lf, 'utf8').trim() });
    for (const [name, o, url] of [['run cap 0.5 MB, first GET 1 MB', { runCapMB: 0.5 }, `${WFH}/kb1000.js`], ['run cap 0.5 MB, 0.3 MB then 0.3 MB', { runCapMB: 0.5 }, null], ['getCapMB 0.2, a 1 MB file (size limit, not a cap)', { getCapMB: 0.2 }, `${WFH}/kb1000.js`]]) {
      const lf2 = path.join(tmp(), 'log.md'); const { ctx, g, trips } = await mk(Object.assign({ label: 'p7t', mode: 'block', logFile: lf2 }, o));
      const pg = await ctx.newPage();
      if (url) await pg.goto(url).catch(() => { }); else { await pg.goto(`${WFH}/kb300.js?a`).catch(() => { }); await pg.goto(`${WFH}/kb300.js?b`).catch(() => { }); }
      await sleep(500); await ctx.close().catch(() => { }); await sleep(200);
      note(`P7b trip wording: ${name}`, { trips, counted: g.stats().bytes, log: fs.readFileSync(lf2, 'utf8').trim() });
    }
  }
  note('unhandled rejections', unhandled);
  await browser.close(); RL.close(); RX.close(); X.srv.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
