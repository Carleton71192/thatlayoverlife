// node trace.cjs out.jsonl page runs : per-frame rects of the hero content's children until 1.5 s
const fs = require('fs'); const { chromium } = require('playwright'); const L = require('./lib.cjs');
const PATH = { story: '/stories/spain-madrid-wedding-ibiza', balkans: '/stories/balkans-ev-road-trip-twelve-countries', croatia: '/stories/croatia-te-amo-velho-birthday-week' };
const TR = () => { const R = []; window.__R = R; const d = n => { let s = n.tagName.toLowerCase(); const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; if (c.length) s += '.' + c.join('.'); return s; };
  const f = () => { const t = Math.round(performance.now()); const c = document.querySelector('.tll-story-hero-content'); const row = [t];
    if (c) for (const k of c.children) { const r = k.getBoundingClientRect(); row.push([d(k), Math.round(r.top), Math.round(r.height)]); }
    const h = document.querySelector('.tll-story-hero'); row.push(h ? h.getAttributeNames().filter(a => a.indexOf('wait') > 0).join(',') : '-');
    const last = R[R.length - 1]; if (!last || JSON.stringify(last.slice(1)) !== JSON.stringify(row.slice(1))) R.push(row); if (t < 1500) requestAnimationFrame(f); }; requestAnimationFrame(f); };
(async () => { const [out, pgk, runs, hosts] = process.argv.slice(2); const b = await chromium.launch();
  for (let i = 0; i < +runs; i++) for (const host of (hosts || 'test').split(',')) { const { ctx, pg } = await L.open(b, { host, p: PATH[pgk], w: 390, h: 844, wait: 2000, traceInit: TR });
    const r = await pg.evaluate(() => ({ R: window.__R, sh: window.__T.sh, dcl: window.__T.dcl })); await ctx.close();
    fs.appendFileSync(out, JSON.stringify({ host, i, ...r }) + '\n'); console.log(host, i, r.sh.reduce((a, e) => a + e.v, 0).toFixed(4)); }
  await b.close(); })();
