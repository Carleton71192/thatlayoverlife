'use strict';
/* R1 to R9: the N-4 redirect page, run against old (686e520) and new code. Webflow host names map to the "wf" stub on
   127.0.0.1 (Chromium host resolver map, curl --connect-to). Run: node -r ./dnsmap.cjs redir.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start } = require('./stub3r.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfr-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
(async () => {
  const pages = {}; const S = await start(pages); const WP = S.wf.port, OP = S.other.port;
  const WWW = `http://www.thatlayover.life:${WP}`, APEX = `http://thatlayover.life:${WP}`, LOC = `http://localhost:${OP}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const base = o => Object.assign({ logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), onTrip: 'close' }, o);
  const wfHits = (h0, f) => S.wf.hits.slice(h0).filter(h => !f || f(h)).map(h => `${h.method} ${h.host} ${h.path}`);
  const sentSince = h0 => S.wf.hits.slice(h0).reduce((a, h) => a + (h.wrote || h.sent || 0), 0);
  const leaksOf = g => g.stats().leaks;
  pages['/landing.html'] = () => '<p>landing</p><img src="rel.png"><script>window.__loc = location.href</script>';
  pages['/t|x.html'] = () => '<p>pipe page</p>' + 'x'.repeat(200000);

  for (const mode of ['block', 'fetch-once']) {
    /* R1: apex -> 301 -> www/landing.html (the check's N9 case) */
    {
      const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'r1', mode, cacheDir: tmp() })); await g.ready;
      const pg = await ctx.newPage(); const h0 = S.wf.hits.length;
      const resp = await pg.goto(`${APEX}/r?code=301&to=${encodeURIComponent(WWW + '/landing.html')}`).catch(e => e.message);
      await pg.waitForURL(/landing/, { timeout: 5000 }).catch(() => { }); await sleep(400);
      note(`R1 ${mode} apex 301 to www/landing.html`, { gotoStatus: resp && resp.status ? resp.status() : resp, loc: await pg.evaluate(() => window.__loc).catch(e => 'ERR'), wfRequests: wfHits(h0), pageLoads: g.stats().pageLoads, leaks: leaksOf(g) });
      await ctx.close();
    }
    /* R2: a redirect to a path with "|": Chromium asks for %7C, the guard kept the "|" form */
    {
      const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'r2', mode, cacheDir: tmp() })); await g.ready;
      const pg = await ctx.newPage(); const h0 = S.wf.hits.length;
      await pg.goto(`${WWW}/r?code=302&to=${encodeURIComponent('/t|x.html')}`).catch(() => { }); await sleep(1500);
      note(`R2 ${mode} 302 to /t|x.html (server answers both forms)`, { finalUrl: pg.url(), wfRequests: wfHits(h0), bytesSentByWfStub: sentSince(h0), guardMB: g.stats().mb, gets: g.stats().gets, pageLoads: g.stats().pageLoads });
      await ctx.close();
    }
    /* R3: the same, but the server sends the %7C form back to the "|" form (a canonicalizing redirect) */
    {
      const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'r3', mode, cacheDir: tmp(), runCapMB: 50 })); await g.ready;
      const pg = await ctx.newPage(); const h0 = S.wf.hits.length;
      pg.goto(`${WWW}/loop/start?raw=${encodeURIComponent('/loop/t|x')}`).catch(() => { }); await sleep(8000);
      const hs = wfHits(h0);
      note(`R3 ${mode} 302 to /loop/t|x, server 301s /loop/t%7Cx to /loop/t|x, 8 s`, { finalUrl: pg.url(), wfRequestCount: hs.length, first: hs.slice(0, 6), guardGets: g.stats().gets, redirectPages: g.stats().redirectPages, pageLoads: g.stats().pageLoads });
      await ctx.close();
    }
    /* R4: JavaScript off: the redirect page cannot run */
    {
      const ctx = await browser.newContext({ javaScriptEnabled: false }); const g = W.guard(ctx, base({ label: 'r4', mode, cacheDir: tmp() })); await g.ready;
      const pg = await ctx.newPage(); const h0 = S.wf.hits.length;
      await pg.goto(`${APEX}/r?code=301&to=${encodeURIComponent(WWW + '/landing.html')}`).catch(() => { }); await sleep(500);
      note(`R4 ${mode} JavaScript off`, { url: pg.url(), body: (await pg.content()).slice(0, 80), wfRequests: wfHits(h0) });
      await ctx.close();
    }
    /* R5: a harness that reads the page right after goto */
    {
      const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'r5', mode, cacheDir: tmp() })); await g.ready;
      const pg = await ctx.newPage();
      await pg.goto(`${APEX}/r?code=301&to=${encodeURIComponent(WWW + '/landing.html')}`).catch(() => { });
      let c; try { c = (await pg.content()).slice(0, 120); } catch (e) { c = 'ERR ' + e.message.split('\n')[0]; }
      note(`R5 ${mode} page.content() right after goto`, { content: c, url: pg.url() });
      await ctx.close();
    }
    /* R6: two pages load the same redirecting URL at once */
    {
      const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'r6', mode, cacheDir: tmp() })); await g.ready;
      const p1 = await ctx.newPage(), p2 = await ctx.newPage(), p3 = await ctx.newPage(); const h0 = S.wf.hits.length;
      const A = `${APEX}/r?code=301&to=${encodeURIComponent(WWW + '/landing.html')}`;
      await Promise.all([p1.goto(A).catch(() => { }), p2.goto(A).catch(() => { }), p3.goto(WWW + '/landing.html').catch(() => { })]); await sleep(1500);
      note(`R6 ${mode} two pages goto the apex URL, a third goes straight to www/landing.html`, { urls: [p1.url(), p2.url(), p3.url()], landingGets: wfHits(h0, h => h.path === '/landing.html').length, wfRequests: wfHits(h0, h => !/rel\.png/.test(h.path)) });
      await ctx.close();
    }
    /* R7: localhost page -> 302 -> Webflow page (strict mode): page loads counted? */
    {
      const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'r7', mode, cacheDir: tmp() })); await g.ready;
      const pg = await ctx.newPage(); const h0 = S.wf.hits.length;
      await pg.goto(`${LOC}/r?code=302&to=${encodeURIComponent(WWW + '/landing.html')}`).catch(() => { }); await sleep(800);
      note(`R7 ${mode} localhost 302 to a Webflow page`, { url: pg.url(), pageLoads: g.stats().pageLoads, wfRequests: wfHits(h0), redirectPages: g.stats().redirectPages });
      await ctx.close();
    }
    /* R8: a redirect chain of 25 hops on Webflow hosts */
    {
      const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'r8', mode, cacheDir: tmp() })); await g.ready;
      const pg = await ctx.newPage(); const h0 = S.wf.hits.length;
      let u = WWW + '/landing.html'; for (let i = 0; i < 25; i++) u = `${i % 2 ? WWW : APEX}/r?code=302&n=${i}&to=${encodeURIComponent(u)}`;
      const r = await pg.goto(u).then(x => x && x.status(), e => 'ERR ' + e.message.split('\n')[0]); await sleep(800);
      note(`R8 ${mode} 25-hop chain`, { goto: r, wfRequestCount: wfHits(h0).length, landingReached: wfHits(h0, h => h.path === '/landing.html').length, leaks: leaksOf(g), redirectLimit: g.stats().redirectLimit });
      await ctx.close();
    }
    /* R9: an iframe that redirects (not the main frame) */
    {
      pages['/r9.html'] = () => `<iframe src="${APEX}/r?code=301&to=${encodeURIComponent(WWW + '/landing.html')}"></iframe>`;
      const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'r9', mode, cacheDir: tmp() })); await g.ready;
      const pg = await ctx.newPage(); const h0 = S.wf.hits.length;
      await pg.goto(`${LOC}/r9.html`).catch(() => { }); await sleep(800);
      const fr = pg.frames()[1];
      note(`R9 ${mode} iframe apex 301 to www`, { frameLoc: fr ? await fr.evaluate(() => location.href).catch(() => 'ERR') : null, wfRequests: wfHits(h0) });
      await ctx.close();
    }
  }
  /* R10: a caller route that fulfills a 302 into a Webflow host (pre-existing path; old and new) */
  {
    const ctx = await browser.newContext(); const g = W.guard(ctx, base({ label: 'r10', mode: 'block' })); await g.ready;
    await ctx.route('**/hop-to-wf', r => r.fulfill({ status: 302, headers: { location: WWW + '/landing.html?via=fulfill' } }));
    const pg = await ctx.newPage(); const h0 = S.wf.hits.length;
    await pg.goto(`${LOC}/hop-to-wf`).catch(() => { }); await sleep(800);
    note('R10 caller route fulfills a 302 to a Webflow page', { url: pg.url(), wfRequests: wfHits(h0), leaks: leaksOf(g), guardGets: g.stats().gets });
    await ctx.close();
  }
  await browser.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
