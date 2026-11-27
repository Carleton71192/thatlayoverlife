'use strict';
/* New probes for cdeb7a4: cache-only misses with every resource kind, unload traffic, routes before guard(), video ranges,
   redirects. Two local stubs (stub2.cjs): Webflow host names use the "wf" port, everything else the "other" port. One Chromium,
   every host name mapped to 127.0.0.1, no proxy. Run: node -r ./dnsmap.cjs new.cjs <worktree> [only,phases] */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start } = require('./stub2.cjs');
const only = process.argv[3] ? process.argv[3].split(',') : null;
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wfnew-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const T0 = Date.now(); const out = {};
const note = (k, v) => { out[k] = v; console.log(((Date.now() - T0) / 1000).toFixed(1) + 's', k, JSON.stringify(v)); };
const unhandled = []; process.on('unhandledRejection', e => { unhandled.push(String(e && e.message).split('\n')[0]); });
const want = k => !only || only.includes(k);

(async () => {
  const pages = {};
  const S = await start(pages); const WP = S.wf.port, OP = S.other.port;
  const WFH = `http://www.thatlayover.life:${WP}`, CDN = `http://cdn.prod.website-files.com:${WP}`, LOC = `http://localhost:${OP}`, OTH = `http://img.example.org:${OP}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const mark = () => ({ h: S.wf.hits.length, c: S.wf.conns.length, oh: S.other.hits.length });
  const since = m => ({ wfConnections: S.wf.conns.length - m.c, wfRequests: S.wf.hits.slice(m.h).map(h => `${h.method} ${h.host}${h.path}${h.range ? ' [' + h.range + ']' : ''}`) });
  const base = (o) => Object.assign({ logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), onTrip: 'close' }, o);
  const html = tmp();

  /* N1: cache-only, a Webflow page from htmlDir that asks for every kind of Webflow resource; none is cached */
  const big = () => `<!doctype html><html><head>
<link rel="icon" href="${CDN}/fav.png"><link rel="apple-touch-icon" href="${CDN}/touch.png"><link rel="manifest" href="${WFH}/site.webmanifest">
<link rel="preconnect" href="http://assets-global.website-files.com:${WP}"><link rel="dns-prefetch" href="http://uploads-ssl.webflow.com:${WP}">
<link rel="stylesheet" href="${CDN}/main.css"><link rel="preload" as="image" href="${CDN}/preload.png"><link rel="prefetch" href="${CDN}/prefetch.js">
<link rel="modulepreload" href="${CDN}/mod.js">
<script type="speculationrules">{"prerender":[{"source":"list","urls":["/pre.html"]}],"prefetch":[{"source":"list","urls":["/spec-prefetch.html"]}]}</script>
<style>@import url(${CDN}/imp.css); @font-face{font-family:x;src:url(${CDN}/f.woff2)} body{font-family:x;background:url(${CDN}/bg.png)}</style>
</head><body>text
<img src="${CDN}/a.png" srcset="${CDN}/a2.png 2x"><picture><source srcset="${CDN}/pic.webp"><img src="${CDN}/pic.png"></picture>
<video src="${CDN}/v.mp4" poster="${CDN}/poster.png" preload="auto" muted></video><audio src="${CDN}/a.mp3" preload="auto"></audio>
<iframe src="${WFH}/frame.html"></iframe><object data="${CDN}/obj.svg"></object><embed src="${CDN}/emb.svg">
<svg width=1 height=1><image href="${CDN}/svgimg.png" width=1 height=1 /></svg>
<a id=pl href="${LOC}/next.html" ping="${WFH}/ping">x</a>
<script src="${CDN}/s.js"></script>
<script>
 window.__R = {};
 fetch('${CDN}/f.json').then(r=>__R.fetch=r.status,e=>__R.fetch='blocked');
 const x=new XMLHttpRequest(); x.open('GET','${CDN}/x.json'); x.onload=()=>__R.xhr=x.status; x.onerror=()=>__R.xhr='blocked'; x.send();
 try { const es = new EventSource('${WFH}/sse'); es.onerror=()=>{__R.sse='error'; es.close();}; es.onopen=()=>__R.sse='open'; } catch(e) {}
 try { const ws = new WebSocket('ws://www.thatlayover.life:${WP}/ws'); ws.onerror=()=>__R.ws='error'; } catch(e) { __R.ws='threw'; }
 try { new Worker(URL.createObjectURL(new Blob(["fetch('${CDN}/worker.js').catch(()=>0); fetch('${WFH}/worker-post',{method:'POST',body:'w'}).catch(()=>0)"]))); } catch(e) {}
 const fr=document.createElement('iframe'); document.body.appendChild(fr);
 window.__sb=fr.contentWindow.navigator.sendBeacon.bind(fr.contentWindow.navigator); window.__cf=fr.contentWindow.fetch.bind(fr.contentWindow);
 __R.cleanRealmSendBeacon = /native code/.test(fr.contentWindow.Navigator.prototype.sendBeacon.toString()) ? 'native (not patched)' : 'patched';
 __R.cleanRealmFetch = /native code/.test(fr.contentWindow.fetch.toString()) ? 'native (not patched)' : 'patched';
 addEventListener('pagehide', () => {
   navigator.sendBeacon('${WFH}/u-beacon','b');
   fetch('${WFH}/u-ka-post',{method:'POST',body:'k',keepalive:true}).catch(()=>0);
   fetch('${CDN}/u-ka-get.js',{keepalive:true}).catch(()=>0);
   new Image().src='${CDN}/u-img.png';
   try{ const r=new XMLHttpRequest(); r.open('POST','${WFH}/u-xhr'); r.send('x'); }catch(e){}
   try{ window.__sb('${WFH}/u-realm-beacon','r'); }catch(e){}
   try{ window.__cf('${WFH}/u-realm-ka',{method:'POST',body:'r',keepalive:true}).catch(()=>0); }catch(e){}
   try{ fetch(new Request('${WFH}/u-req-obj',{method:'POST',body:'q',keepalive:true})).catch(()=>0);}catch(e){}
   navigator.sendBeacon('${LOC}/u-local-beacon','l');
 });
 addEventListener('visibilitychange', () => { navigator.sendBeacon('${WFH}/v-beacon','v'); fetch('${CDN}/v-ka-get.js',{keepalive:true}).catch(()=>0); });
</script></body></html>`;
  fs.writeFileSync(path.join(html, 'home.html'), big());
  pages['/next.html'] = () => '<p>next</p>';
  for (const [k, ending] of [['N1a', 'navigate away'], ['N1b', 'page.close'], ['N1c', 'context.close'], ['N1d', 'page.close, unloadNonGet all']]) {
    if (!want('N1')) break;
    const ctx = await browser.newContext();
    const g = W.guard(ctx, base({ label: k, htmlDir: html, cacheDir: tmp(), unloadNonGet: k === 'N1d' ? 'all' : 'webflow' })); await g.ready;
    const m = mark(), om = S.other.hits.length;
    const pg = await ctx.newPage();
    await pg.goto(WFH + '/').catch(e => note(k + ' goto error', e.message.split('\n')[0]));
    await sleep(1500);
    const R = await pg.evaluate(() => window.__R).catch(() => null);
    await pg.evaluate(() => window.open('/popup.html')).catch(() => { }); await sleep(300);
    if (ending === 'navigate away') { await pg.click('#pl').catch(e => note(k + ' click', e.message)); await sleep(1500); }
    else if (ending.startsWith('page.close')) { await pg.close(); await sleep(1500); }
    const st = g.stats();
    if (ending === 'context.close') { await ctx.close(); await sleep(1500); } else { await ctx.close(); await sleep(300); }
    note(`${k} cache-only miss, ${ending}`, Object.assign(since(m), { pageResults: R, otherHostNonGet: S.other.hits.slice(om).filter(h => h.method !== 'GET').map(h => h.method + ' ' + h.path),
      stats: { pageLoads: st.pageLoads, cacheHits: st.cacheHits, misses: st.misses, nonGet: st.nonGet, unloadStopped: st.unloadStopped, leaks: st.leaks, bytes: st.bytes, gets: st.gets, lastWord: st.lastWord } }));
  }

  /* N2: routes registered before guard() */
  if (want('N2')) {
    const cdir = tmp();
    // a cached Webflow stylesheet in the cache layout
    const mc = W.makeCache(cdir); mc.put(`${CDN}/cached.css`, 200, { 'content-type': 'text/css' }, Buffer.from('p{color:blue}'));
    const ctx = await browser.newContext();
    const ran = { ctxFulfill: 0, ctxContinue: 0, pageContinue: 0, ctxFetchHit: null, ctxFetchMiss: null };
    await ctx.route('**/saved.html', r => { ran.ctxFulfill++; return r.fulfill({ status: 200, contentType: 'text/html', body: `<link rel=stylesheet href="${CDN}/cached.css"><img src="${CDN}/n2-ctx-cont.png"><img src="${CDN}/n2-page-cont.png"><p>local</p>` }); });
    await ctx.route('**/n2-ctx-cont.png', r => { ran.ctxContinue++; return r.continue(); });
    await ctx.route('**/cached.css', async r => { try { const resp = await r.fetch(); ran.ctxFetchHit = resp.status(); return r.fulfill({ response: resp }); } catch (e) { ran.ctxFetchHit = 'threw ' + e.message.slice(0, 60); return r.abort(); } });
    await ctx.route('**/n2-miss.js', async r => { try { const resp = await r.fetch(); ran.ctxFetchMiss = resp.status(); return r.fulfill({ response: resp }); } catch (e) { ran.ctxFetchMiss = 'threw: ' + e.message.slice(0, 90); return r.abort(); } });
    const pg = await ctx.newPage();
    await pg.route('**/n2-page-cont.png', r => { ran.pageContinue++; return r.continue(); });
    const g = W.guard(ctx, base({ label: 'N2', cacheDir: cdir })); await g.ready;
    const m = mark();
    await pg.goto(WFH + '/saved.html').catch(e => note('N2 goto', e.message.split('\n')[0]));
    const color = await pg.evaluate(() => getComputedStyle(document.querySelector('p')).color).catch(() => null);
    await pg.evaluate(u => fetch(u).then(r => r.status, () => 'blocked'), CDN + '/n2-miss.js').catch(() => { });
    await sleep(500);
    note('N2 routes registered before guard(), cache-only', Object.assign(since(m), { ran, cssColorFromCache: color, lastWord: g.lastWord(), stats: { cacheHits: g.stats().cacheHits, misses: g.stats().misses } }));
    // unrouteAll and unroute keep the guard
    await ctx.unrouteAll(); const m2 = mark();
    await pg.setContent(`<img src="${CDN}/n2-after-unrouteall.png">`).catch(() => { }); await sleep(300);
    await ctx.unroute('**/*'); await pg.setContent(`<img src="${CDN}/n2-after-unroute.png">`).catch(() => { }); await sleep(300);
    note('N2 after unrouteAll and unroute(**/*)', Object.assign(since(m2), { lastWord: g.lastWord() }));
    // race: a page that keeps asking for Webflow images while the caller calls unrouteAll
    await pg.setContent(`<script>let i=0; setInterval(()=>{ for (let k=0;k<20;k++) { const im=new Image(); im.src='${CDN}/race-'+(i++)+'.png'; } }, 1)</script>`);
    await sleep(300); const m3 = mark();
    for (let k = 0; k < 10; k++) { await ctx.unrouteAll({ behavior: 'ignoreErrors' }); await ctx.unroute('**/*').catch(() => { }); await sleep(30); }
    await sleep(300);
    const r3 = since(m3);
    note('N2 race: Webflow images requested in a loop while unrouteAll and unroute run 10 times', { wfConnections: r3.wfConnections, wfRequests: r3.wfRequests.length, sample: r3.wfRequests.slice(0, 3) });
    await ctx.close();
  }

  /* N6: video ranges */
  if (want('N6')) {
    // cache-only, video miss and a cached whole file
    const cdir = tmp(); const mc = W.makeCache(cdir);
    mc.put(`${CDN}/cached.mp4`, 200, { 'content-type': 'video/mp4', 'accept-ranges': 'bytes' }, Buffer.alloc(3000000, 9));
    pages['/n6.html'] = () => `<video id=a src="${CDN}/miss.mp4" preload=auto muted></video><video id=b src="${CDN}/cached.mp4" preload=auto muted></video>
      <script>window.__f = Promise.all([fetch('${CDN}/cached.mp4',{headers:{Range:'bytes=10-19'}}).then(async r=>[r.status, r.headers.get('content-range'), (await r.arrayBuffer()).byteLength]),
      fetch('${CDN}/cached.mp4',{headers:{Range:'bytes=-5'}}).then(async r=>[r.status, r.headers.get('content-range'), (await r.arrayBuffer()).byteLength]),
      fetch('${CDN}/cached.mp4',{headers:{Range:'bytes=9999999-'}}).then(async r=>[r.status, r.headers.get('content-range')])])</script>`;
    let ctx = await browser.newContext(); let g = W.guard(ctx, base({ label: 'N6a', cacheDir: cdir })); await g.ready;
    let m = mark(); let pg = await ctx.newPage(); await pg.goto(LOC + '/n6.html'); const fr = await pg.evaluate(() => window.__f); await sleep(1500);
    note('N6a cache-only: video miss and a cached whole file', Object.assign(since(m), { slices: fr, stats: { cacheHits: g.stats().cacheHits, misses: g.stats().missList } }));
    await ctx.close();
    // fetch-once with allowVideo
    const cdir2 = tmp();
    pages['/n6b.html'] = () => `<video src="${CDN}/allowed.mp4" preload=auto muted></video>
      <script>window.__f = Promise.all([
        fetch('${CDN}/r1.mp4',{headers:{Range:'bytes=0-99'}}).then(r=>r.status,()=>'blocked'),
        fetch('${CDN}/r2.mp4',{headers:{Range:'bytes=0-'}}).then(async r=>[r.status, r.headers.get('content-range')],()=>'blocked'),
        fetch('${CDN}/r3.mp4',{headers:{Range:'bytes=-2500000'}}).then(async r=>[r.status, r.headers.get('content-range')],()=>'blocked'),
        fetch('${CDN}/r4.mp4',{headers:{Range:'bytes=0-9,100-199'}}).then(r=>r.status,()=>'blocked'),
        fetch('${CDN}/r5.mp4').then(r=>r.status,()=>'blocked'),
        fetch('${CDN}/r6.mp4',{headers:{Range:'bytes=500000-2999999'}}).then(async r=>[r.status, r.headers.get('content-range')],()=>'blocked'),
        fetch('${CDN}/noext-video-7').then(async r=>[r.status, (await r.arrayBuffer()).byteLength],()=>'blocked'),
      ])</script>`;
    ctx = await browser.newContext(); g = W.guard(ctx, base({ label: 'N6b', mode: 'fetch-once', cacheDir: cdir2, allowVideo: true })); await g.ready;
    await ctx.route('**/r8.mp4', r => r.fallback({ headers: Object.assign({}, r.request().headers(), { range: 'bytes=0-' }) }));
    m = mark(); pg = await ctx.newPage(); await pg.goto(LOC + '/n6b.html'); const fr2 = await pg.evaluate(() => window.__f); await sleep(2500);
    const fr3 = await pg.evaluate(u => fetch(u, { headers: { Range: 'bytes=0-99' } }).then(r => r.status, () => 'blocked'), CDN + '/r8.mp4');
    let rq = null; try { const resp = await ctx.request.get(CDN + '/r9.mp4', { headers: { range: 'bytes=0-' } }); rq = [resp.status(), resp.headers()['content-range']]; } catch (e) { rq = 'threw ' + e.message.slice(0, 80); }
    await sleep(300);
    const reqs = S.wf.hits.slice(m.h).map(h => ({ path: h.path, range: h.range, sent: h.sent }));
    note('N6b fetch-once allowVideo: what reached the stub', { pageResults: fr2, callerFallbackWidened: fr3, contextRequestOpenRange: rq, requests: reqs, maxSentOneRequest: Math.max(0, ...reqs.map(r => r.sent)), stats: { bytes: g.stats().bytes, blocked: g.stats().blocked, tooBig: g.stats().tooBig } });
    await ctx.close();
    // fetch-once without allowVideo: an extensionless video by fetch() (resource type fetch, class doc)
    ctx = await browser.newContext(); g = W.guard(ctx, base({ label: 'N6c', mode: 'fetch-once', cacheDir: tmp() })); await g.ready;
    m = mark(); pg = await ctx.newPage(); await pg.goto(LOC + '/next.html');
    const fr4 = await pg.evaluate(u => fetch(u).then(r => r.status, () => 'blocked'), CDN + '/noext-video-8'); await sleep(300);
    note('N6c fetch-once, video not allowed: fetch() of an extensionless Webflow video', { result: fr4, requests: S.wf.hits.slice(m.h).map(h => ({ path: h.path, range: h.range, sent: h.sent, wrote: h.wrote })), counted: g.stats().bytes, blocked: g.stats().blocked });
    await ctx.close();
  }

  /* N9: redirects with strictRedirects (default) */
  if (want('N9')) {
    pages['/landing.html'] = () => `<p>landing</p><img src="rel.png"><script>window.__loc = location.href</script>`;
    for (const withGuard of [false, true]) {
      const ctx = await browser.newContext(); let g = null;
      if (withGuard) { g = W.guard(ctx, base({ label: 'N9', mode: 'fetch-once', cacheDir: tmp() })); await g.ready; }
      const m = mark(); const pg = await ctx.newPage();
      await pg.goto(`http://thatlayover.life:${WP}/r?code=301&to=${encodeURIComponent(WFH + '/landing.html')}`).catch(e => note('N9 goto', e.message.split('\n')[0]));
      await sleep(300);
      note(`N9 apex 301 to www page, guard ${withGuard ? 'on (fetch-once)' : 'off'}`, { pageUrl: pg.url(), locationHref: await pg.evaluate(() => window.__loc).catch(() => null), relImageHost: S.wf.hits.slice(m.h).filter(h => h.path === '/rel.png').map(h => h.host), pageLoads: g && g.stats().pageLoads });
      await ctx.close();
    }
    // does Chromium route the next hop after route.fulfill with a 302? (no guard)
    const ctx = await browser.newContext(); const seen = [];
    await ctx.route('**/*', r => { seen.push(new URL(r.request().url()).pathname); if (r.request().url().endsWith('/hop1')) return r.fulfill({ status: 302, headers: { location: LOC + '/next.html' } }); return r.continue(); });
    const pg = await ctx.newPage(); await pg.goto(LOC + '/hop1').catch(() => { });
    await pg.setContent(`<img src="${LOC}/hop1">`); await sleep(300);
    note('N9 no guard: requests the route saw after fulfilling a 302 (navigation, then an image)', { seen, finalUrl: pg.url() });
    await ctx.close();
  }

  note('unhandled rejections', unhandled);
  await browser.close(); S.close();
  fs.writeFileSync(path.join(process.env.OUTDIR || '.', 'new-result.json'), JSON.stringify(out, null, 1));
  process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
