// node run.cjs out.jsonl runs "case;case"   case = page:WxH[:restore]
const fs = require('fs'); const { chromium } = require('playwright'); const L = require('./lib.cjs');
const PATH = { home: '/', stories: '/stories', story: '/stories/spain-madrid-wedding-ibiza', balkans: '/stories/balkans-ev-road-trip-twelve-countries', croatia: '/stories/croatia-te-amo-velho-birthday-week' };
(async () => {
  const [out, runs, cases] = process.argv.slice(2); const HS = ['www', 'test'];
  let browser = await chromium.launch(); let n = 0;
  for (let run = 0; run < +runs; run++) for (const cs of cases.split(';')) {
    const [k, wh, mode] = cs.split(':'); const [w, h] = wh.split('x').map(Number);
    const order = (run + n) % 2 ? HS.slice().reverse() : HS;
    for (const host of order) for (let tries = 0; tries < 2; tries++) {
      try { const t0 = Date.now();
        const { ctx, pg, st } = await L.open(browser, { host, p: PATH[k], w, h, mode: mode || 'fresh' });
        const r = await pg.evaluate(L.PROBE); await ctx.close(); L.addDoc(st.docBytes);
        const sh = r.sh || []; const cls4 = sh.filter(e => e.t <= 4000).reduce((a, e) => a + e.v, 0); const clsAll = sh.reduce((a, e) => a + e.v, 0);
        const lcp = r.lcp && r.lcp.length ? r.lcp[r.lcp.length - 1] : null;
        fs.appendFileSync(out, JSON.stringify({ case: cs, host, run, at: new Date().toISOString(), ms: Date.now() - t0, cls4: +cls4.toFixed(5), clsAll: +clsAll.toFixed(5), lcpT: lcp && lcp[0], lcpEl: lcp && lcp[2], fcp: r.fcp,
          errs: st.errs, cons: st.cons.filter(x => !/ERR_FAILED|ERR_BLOCKED|net::/.test(x)).slice(0, 8), consNoise: st.cons.length, failed: st.failed.filter(x => !/ERR_ABORTED|ERR_FAILED/.test(x)).slice(0, 10), failedN: st.failed.length,
          scriptBad: st.scriptBad, stored: st.stored, blocked: st.blocked, coreOk: st.coreOk, docBytes: st.docBytes, net: st.net, hit: st.hit, aborted: st.aborted, ...r }) + '\n');
        console.log(new Date().toISOString().slice(11, 19), cs, host, run, 'cls4', cls4.toFixed(4), 'lcp', lcp && lcp[0], 'errs', st.errs.length, 'blk', st.blocked.length, 'doc', st.docBytes, 'net', st.net); n++; break; }
      catch (e) { console.error('ERR', cs, host, run, e.message.slice(0, 300)); try { await browser.close(); } catch (x) { } browser = await chromium.launch(); }
    }
  }
  await browser.close();
})();
