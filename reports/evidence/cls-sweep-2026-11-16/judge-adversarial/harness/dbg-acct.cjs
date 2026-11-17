/* debug: /account 390 signed-in stub, late answer: when does #tll-exp go in, when is the dashboard first laid out, in each arm */
const L = require('./lib.cjs'); const { chromium } = require('playwright'); const fs = require('fs');
const TR = () => { if (window.top !== window) return; const X = window.__X = { ev: [], samples: [] }; const now = () => Math.round(performance.now());
  const mo = new MutationObserver(recs => { for (const r of recs) { if (r.type === 'attributes' && r.target === document.documentElement) X.ev.push([now(), 'html.class', document.documentElement.className.replace(/wf-\S+/g, '').replace(/\s+/g, ' ').trim()]);
    for (const n of r.addedNodes) if (n.nodeType === 1 && (n.id === 'tll-exp' || (n.querySelector && n.querySelector('#tll-exp')))) X.ev.push([now(), 'tll-exp added', document.readyState]); } });
  mo.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  document.addEventListener('DOMContentLoaded', () => X.ev.push([now(), 'DCL']), true); window.addEventListener('load', () => X.ev.push([now(), 'load']));
  let last = ''; const tick = () => { const g = s => { const n = document.querySelector(s); if (!n) return 'x'; const r = n.getBoundingClientRect(); return n.getClientRects().length ? Math.round(r.top) + '+' + Math.round(r.height) : 'hidden'; };
    const s = ['nav.tll-nav-v1', '.tll-account-hero', '#tll-exp', '.a3-rail', '#a3-ph-overview'].map(g).join(' | '); if (s !== last) { last = s; X.samples.push([now(), s]); } requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
(async () => { const b = await chromium.launch(); const out = [];
  for (const [arm, i] of [['ctl', 1], ['new', 1], ['new', 2], ['ctl', 2], ['ctl', 3], ['new', 3]]) {
    const { ctx, page, st } = await L.openPage(b, { w: 390, h: 844, arm, ms: 'in', msDelay: +process.argv[2] || 1500, init: TR });
    await page.goto(L.ORIGIN + '/account', { waitUntil: 'load' }); await L.sleep(5000);
    const x = await page.evaluate(() => ({ X: window.__X, sh: window.__J.sh.map(s => [s.t, +s.v.toFixed(4), s.src.slice(0, 2).map(q => q[0].slice(-30) + q[1] + '>' + q[2]).join(' ; ')]), fcp: window.__J.fcp }));
    out.push({ arm, i, x, nonGet: st.nonGet }); console.log('==', arm, i, 'fcp', x.fcp, 'cls', x.sh.reduce((a, s) => a + s[1], 0).toFixed(4)); for (const e of x.X.ev) console.log('  ev', JSON.stringify(e)); for (const s of x.X.samples) console.log('  rect', s[0], s[1]); for (const s of x.sh) console.log('  sh', JSON.stringify(s));
    await ctx.close(); }
  fs.writeFileSync('../results/dbg-acct-' + (process.argv[2] || 1500) + '.json', JSON.stringify(out)); await b.close(); })();
