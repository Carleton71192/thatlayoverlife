/* Nov 22 check-2: FCP outlier on the Lisbon story at 1440. A warm-up load first, then 20 cycles of live, base, br in rotating order;
   each load also records navigation and core timing. Usage: NODE_PATH=/opt/node22/lib/node_modules node fcpx.cjs */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, OUT } = require('./ab.cjs');
const RES = path.join(OUT, 'fcpx.jsonl');
const F = 'stories__lisbon-sun-sails-city-built-to-stand-back-up.html';
const timing = page => page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const c = performance.getEntriesByType('resource').filter(r => /tll-site-layers-v16\.js/.test(r.name))[0];
  return { respEnd: Math.round(n.responseEnd), domInt: Math.round(n.domInteractive), dcl: Math.round(n.domContentLoadedEventEnd), coreStart: c && Math.round(c.startTime), coreEnd: c && Math.round(c.responseEnd) }; });
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { await load(browser, 'live', F, 1440, false, { sig: false, tag: 'warm' });
    for (let run = 0; run < 20; run++) for (const v of [['live', 'base', 'br'], ['br', 'live', 'base'], ['base', 'br', 'live']][run % 3]) {
      const st = await load(browser, v, F, 1440, false, { sig: false, tag: 'fcpx', act: timing }); st.run = run;
      fs.appendFileSync(RES, JSON.stringify({ v, run, fcp: st.perfLoad && st.perfLoad.fcp, cls: st.perf && st.perf.cls, errs: st.errs.length, t: st.act }) + '\n'); } }
  finally { await browser.close(); }
})();
