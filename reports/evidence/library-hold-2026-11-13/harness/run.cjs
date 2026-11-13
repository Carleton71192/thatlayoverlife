// node run.cjs <out.jsonl> <runs> <cases,...> <variants,...>   case = WxH:mode:Y (mode restore | rslow | fresh | slow)
// Variants interleaved per run (order reversed on odd runs), as in nov12/fonts/review/m.cjs.
const fs = require('fs'); const { chromium } = require('/opt/node-tools/node_modules/playwright'); const L = require('./lib.cjs');
const launch = () => chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
(async () => {
  const [out, runs, cases, variants] = process.argv.slice(2);
  let browser = await launch();
  for (let run = 0; run < +runs; run++) for (const cs of cases.split(',')) {
    const [wh, mode, Y] = cs.split(':'); const [w, h] = wh.split('x').map(Number);
    const vs = variants.split(','); const order = run % 2 ? vs.slice().reverse() : vs;
    for (const v of order) for (let tries = 0; tries < 3; tries++) {
      try { const t0 = Date.now(); const r = await L.one(browser, { v, w, h, mode, Y: Y || 0 });
        fs.appendFileSync(out, JSON.stringify({ case: cs, v, run, ms: Date.now() - t0, cls: r.cls, sh: r.sh, y: r.y, trackH: r.trackH, total: r.total, val: r.val, valLow: r.valLow,
          shown: r.shown, aborted: r.aborted, hit: r.hit, miss: r.miss, errs: r.errs }) + '\n'); break; }
      catch (e) { console.error('ERR', cs, v, run, e.message.slice(0, 200)); try { await browser.close(); } catch (x) { } browser = await launch(); }
    }
  }
  await browser.close();
})();
