'use strict';
/* N3 unload traffic with and without the guard (control), and N1x: where TCP connections to the Webflow stub come from. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start } = require('./stub2.cjs');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wfn3-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
const unhandled = []; process.on('unhandledRejection', e => unhandled.push(String(e && e.message)));
(async () => {
  const pages = {}; const S = await start(pages); const WP = S.wf.port, OP = S.other.port;
  const WFH = `http://www.thatlayover.life:${WP}`, CDN = `http://cdn.prod.website-files.com:${WP}`, LOC = `http://localhost:${OP}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const base = o => Object.assign({ logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), onTrip: 'close' }, o);
  pages['/u.html'] = () => `<!doctype html><p>u</p><script>
   const fr=document.createElement('iframe'); document.body.appendChild(fr); const sb=fr.contentWindow.navigator.sendBeacon.bind(fr.contentWindow.navigator), cf=fr.contentWindow.fetch.bind(fr.contentWindow);
   addEventListener('pagehide', () => {
     navigator.sendBeacon('${WFH}/u-beacon','b');
     fetch('${WFH}/u-ka-post',{method:'POST',body:'k',keepalive:true}).catch(()=>0);
     fetch('${CDN}/u-ka-get.js',{keepalive:true}).catch(()=>0);
     new Image().src='${CDN}/u-img.png';
     try{ const r=new XMLHttpRequest(); r.open('POST','${WFH}/u-xhr'); r.send('x'); }catch(e){}
     try{ sb('${WFH}/u-realm-beacon','r'); }catch(e){}
     try{ cf('${WFH}/u-realm-ka',{method:'POST',body:'r',keepalive:true}).catch(()=>0); }catch(e){}
     try{ fetch(new Request('${WFH}/u-req-obj',{method:'POST',body:'q',keepalive:true})).catch(()=>0);}catch(e){}
     navigator.sendBeacon('${LOC}/u-local-beacon','l');
   });
   addEventListener('visibilitychange', () => { navigator.sendBeacon('${WFH}/v-beacon','v'); fetch('${CDN}/v-ka-get.js',{keepalive:true}).catch(()=>0); });
  </script>`;
  pages['/next.html'] = () => '<p>next</p>';
  if (!process.env.ONLY_X) for (const guardMode of ['none', 'cache-only', 'cache-only all']) for (const ending of ['navigate away', 'page.close']) {
    const ctx = await browser.newContext(); let g = null;
    if (guardMode !== 'none') { g = W.guard(ctx, base({ label: 'n3', unloadNonGet: guardMode.endsWith('all') ? 'all' : 'webflow' })); await g.ready; }
    const h0 = S.wf.hits.length, o0 = S.other.hits.length;
    const pg = await ctx.newPage(); await pg.goto(LOC + '/u.html'); await sleep(300);
    if (ending === 'navigate away') await pg.goto(LOC + '/next.html'); else await pg.close();
    await sleep(1500);
    note(`N3 unload, guard ${guardMode}, ${ending}`, { webflowStub: S.wf.hits.slice(h0).map(h => h.method + ' ' + h.path), localNonGet: S.other.hits.slice(o0).filter(h => h.method !== 'GET').map(h => h.method + ' ' + h.path), stats: g && { nonGet: g.stats().nonGet, unloadStopped: g.stats().unloadStopped, leaks: g.stats().leaks } });
    await ctx.close(); await sleep(200);
  }
  // N1x: TCP connections to the Webflow stub with no HTTP request
  const html = tmp();
  const variants = {
    preconnect: `<link rel=preconnect href="${CDN}"><p>x</p>`,
    dnsPrefetch: `<link rel=dns-prefetch href="${CDN}"><p>x</p>`,
    websocket: `<script>try{new WebSocket('ws://www.thatlayover.life:${WP}/ws')}catch(e){}</script>`,
    imgMisses: `<img src="${CDN}/m1.png"><img src="${CDN}/m2.png"><link rel=stylesheet href="${CDN}/m.css">`,
    nothing: `<p>plain</p>`,
    specPrerender: `<script type="speculationrules">{"prerender":[{"source":"list","urls":["/pre.html"]}]}</script>`,
    specPrefetch: `<script type="speculationrules">{"prefetch":[{"source":"list","urls":["/spf.html"]}]}</script>`,
    linkPrefetch: `<link rel=prefetch href="${CDN}/lp.js">`,
    iframe: `<iframe src="${WFH}/frame.html"></iframe>`,
    popup: `<script>window.open('${WFH}/popup.html')</script>`,
    eventSource: `<script>new EventSource('${WFH}/sse')</script>`,
    worker: `<script>new Worker(URL.createObjectURL(new Blob(["fetch('${CDN}/worker.js').catch(()=>0)"])))</script>`,
    favicon: `<link rel=icon href="${CDN}/fav.png"><link rel=manifest href="${WFH}/site.webmanifest">`,
    video: `<video src="${CDN}/v.mp4" preload=auto muted></video>`,
  };
  for (const [k, body] of Object.entries(variants)) {
    fs.writeFileSync(path.join(html, k + '.html'), `<!doctype html>${body}`);
    const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'n1x', htmlDir: html })); await g.ready;
    const c0 = S.wf.conns.length, h0 = S.wf.hits.length;
    const pg = await ctx.newPage();
    for (let i = 0; i < 3; i++) { await pg.goto(`${WFH}/${k}.html`).catch(() => { }); await sleep(400); }
    await sleep(800);
    note(`N1x cache-only, page ${k} loaded 3 times from htmlDir`, { tcpConnectionsToWebflowStub: S.wf.conns.length - c0, httpRequests: S.wf.hits.slice(h0).map(h => h.method + ' ' + h.path), misses: g.stats().misses });
    await ctx.close();
  }
  // same, without the guard, a non-Webflow page with only a preconnect, for scale
  note('unhandled', unhandled);
  await browser.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
