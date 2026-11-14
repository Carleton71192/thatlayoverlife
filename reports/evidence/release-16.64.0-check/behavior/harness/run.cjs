// node run.cjs out.jsonl runs case;case...  case = key:WxH:mode[:holdMs][:nojs]  variants via env V (default W,T)
const fs = require('fs'); const { chromium } = require('/opt/node-tools/node_modules/playwright'); const L = require('./lib.cjs');
const PROF = process.env.PROF; L.addPage('/stories/spain-madrid-wedding-ibiza', 'story'); if (PROF) L.addPage('/contributors/' + PROF, 'profile');
const PATH = { home: '/', paw: '/the-paw-passport', about: '/about', stories: '/stories', story: '/stories/spain-madrid-wedding-ibiza', profile: '/contributors/' + PROF };
const launch = () => chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
(async () => {
  const [out, runs, cases] = process.argv.slice(2); const VS = (process.env.V || 'W,T').split(',');
  let browser = await launch();
  for (let run = 0; run < +runs; run++) for (const cs of cases.split(';')) {
    const [k, wh, mode, hold, nojs] = cs.split(':'); const [w, h] = wh.split('x').map(Number);
    const order = run % 2 ? VS.slice().reverse() : VS;
    for (const v of order) for (let tries = 0; tries < 2; tries++) {
      try { const t0 = Date.now();
        const { ctx, pg, st } = await L.open(browser, { v, p: PATH[k], w, h, mode, holdImgMs: +hold || 0, js: nojs !== 'nojs' });
        const r = nojs === 'nojs' ? {} : await pg.evaluate(L.PROBE);
        await ctx.close();
        const cls = (r.sh || []).reduce((a, e) => a + e.v, 0);
        const cur = st.reqs.filter(x => /curacao/i.test(x[1])).map(x => x[1].replace(/^.*\//, ''));
        const wfImg = st.reqs.filter(x => x[0] === 'image' && /website-files\.com/.test(x[1])).length;
        fs.appendFileSync(out, JSON.stringify({ case: cs, v, run, ms: Date.now() - t0, cls: +cls.toFixed(5), curacao: cur, wfImg, selfFetch: st.selfFetch, errs: st.errs, failed: st.failed.slice(0, 15), scriptBad: st.scriptBad, netWF: st.netWF, netJSD: st.netJSD, hit: st.hit, aborted: st.aborted, ...r }) + '\n');
        console.log(cs, v, run, 'cls', cls.toFixed(4), 'errs', st.errs.length, 'netWF', st.netWF, 'ms', Date.now() - t0); break; }
      catch (e) { console.error('ERR', cs, v, run, e.message.slice(0, 300)); try { await browser.close(); } catch (x) { } browser = await launch(); }
    }
  }
  await browser.close();
})();
