const fs = require('fs'); const { chromium } = require('/opt/node-tools/node_modules/playwright'); const L = require('./lib.cjs');
L.addPage('/stories/spain-madrid-wedding-ibiza', 'story');
const TR = () => { const R = []; window.__R = R; const S = ['.tll-story-hero', '.tll-story-hero-img', '#tll-main', 'h1', '.tll-rv', '.st3-author-text', '.tll-story-body-section', '.tll-mg-cap', '.st3-from'];
  const f = () => { const t = Math.round(performance.now()); const row = [t]; for (const s of S) { const n = document.querySelector(s); if (!n) { row.push(null); continue; } const r = n.getBoundingClientRect(); row.push([Math.round(r.top), Math.round(r.height), Math.round(r.width), getComputedStyle(n).display === 'none' ? 'N' : '']); }
    const last = R[R.length - 1]; if (!last || JSON.stringify(last.slice(1)) !== JSON.stringify(row.slice(1))) R.push(row); if (t < 2000) requestAnimationFrame(f); }; requestAnimationFrame(f); };
const launch = () => chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
(async () => { const [out, runs] = process.argv.slice(2); const browser = await launch();
  for (let i = 0; i < +runs; i++) for (const v of (i % 2 ? ['T', 'W'] : ['W', 'T'])) {
    const ctxP = L.open; // patch: add trace init via a wrapper context
    const { ctx, pg, st } = await (async () => { const o = await L.open(browser, { v, p: '/stories/spain-madrid-wedding-ibiza', w: 390, h: 844, mode: 'fresh', wait: 0, traceInit: TR }); return o; })();
    await pg.waitForTimeout(4000);
    const r = await pg.evaluate(() => ({ sh: window.__T.sh, R: window.__R, dcl: window.__T.dcl }));
    await ctx.close(); const cls = r.sh.reduce((a, e) => a + e.v, 0);
    fs.appendFileSync(out, JSON.stringify({ v, i, cls, ...r }) + '\n'); console.log(v, i, cls.toFixed(4)); }
  await browser.close(); })();
