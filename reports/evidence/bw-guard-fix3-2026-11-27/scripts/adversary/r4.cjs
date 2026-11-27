'use strict';
/* R4h: the R-4 helpers. g.goto() and g.finalResponse() on an apex 301 to www, block mode, against stub3.
   Run: node -r ./dnsmap.cjs r4.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start } = require('./stub3.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wf4-'));
(async () => {
  const pages = {}; const S = await start(pages); const WP = S.wf.port;
  pages['/landing.html'] = () => '<p>landing</p>';
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const ctx = await browser.newContext(); const g = W.guard(ctx, { label: 'r4', mode: 'block', logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), onTrip: 'close' }); await g.ready;
  const pg = await ctx.newPage(); const h0 = S.wf.hits.length;
  const u = `http://thatlayover.life:${WP}/r?code=301&to=${encodeURIComponent(`http://www.thatlayover.life:${WP}/landing.html`)}`;
  const raw = await pg.goto(u); const viaHelper = await g.goto(pg, u); const fr = await g.finalResponse(pg, 5000);
  console.log('R4h', JSON.stringify({ plainGoto: { status: raw.status(), mark: raw.headers()['x-wf-guard-redirect'] || null, url: raw.url() }, gGoto: viaHelper && { status: viaHelper.status(), url: viaHelper.url(), text: (await viaHelper.text()).slice(0, 20) }, finalResponse: fr && fr.url(), pageUrl: pg.url(), wfRequests: S.wf.hits.length - h0, gets: g.stats().gets }));
  await ctx.close(); await browser.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
