/* debug: /stories?q=<term> at 1440 (and other sizes): every layout-shift entry with all its sources, plus where the search form is over time */
const L = require('./lib.cjs'); const { chromium } = require('playwright'); const fs = require('fs');
const TR = () => { if (window.top !== window) return; const X = window.__X = { ev: [], samples: [], sh: [] }; const now = () => Math.round(performance.now());
  const nm = n => { if (!n) return 'null'; if (n.nodeType !== 1) return '#text<' + (n.parentElement ? n.parentElement.tagName.toLowerCase() + '.' + String(n.parentElement.className).split(' ')[0] : '') + '>'; return n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + '.' + String(n.className).split(' ').slice(0, 2).join('.'); };
  new PerformanceObserver(l => { for (const e of l.getEntries()) X.sh.push([Math.round(e.startTime), +e.value.toFixed(4), document.readyState[0], e.sources.map(s => nm(s.node) + ' ' + [s.previousRect.x, s.previousRect.y, s.previousRect.width, s.previousRect.height].map(Math.round) + '>' + [s.currentRect.x, s.currentRect.y, s.currentRect.width, s.currentRect.height].map(Math.round))]); }).observe({ type: 'layout-shift', buffered: true });
  const mo = new MutationObserver(recs => { for (const r of recs) { for (const n of r.addedNodes) if (n.nodeType === 1) { if (n.classList && n.classList.contains('tll-lib-searchslot')) X.ev.push([now(), 'slot added', document.readyState]); if (n.id === 'tll-lib-lead-v1') X.ev.push([now(), 'lead script parsed']); if (n.classList && n.classList.contains('tllsb-form')) X.ev.push([now(), 'form moved to ' + (n.parentNode && n.parentNode.className)]); }
      for (const n of r.removedNodes) if (n.nodeType === 1 && n.classList && n.classList.contains('tll-lib-searchslot')) X.ev.push([now(), 'slot removed']); } });
  mo.observe(document, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => X.ev.push([now(), 'DCL']), true); window.addEventListener('load', () => X.ev.push([now(), 'load']));
  let last = ''; const tick = () => { const g = s => { const n = document.querySelector(s); if (!n) return 'x'; const r = n.getBoundingClientRect(); return n.getClientRects().length ? [r.x, r.y, r.width, r.height].map(Math.round).join(',') : 'hidden'; };
    const s = ['.tllsb-form', '.tllsb-bar', '.tll-chip-rows', '.tll-lib-grid', 'h1.tll-library-title'].map(g).join(' | '); if (s !== last) { last = s; X.samples.push([now(), s]); } requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
(async () => { const b = await chromium.launch(); const out = []; const q = process.argv[2] || '?q=lisbon', w = +process.argv[3] || 1440, h = +process.argv[4] || 900, N = +process.argv[5] || 4;
  const order = []; for (let i = 1; i <= N; i++) order.push(...(i % 2 ? [['ctl', i], ['new', i]] : [['new', i], ['ctl', i]]));
  for (const [arm, i] of order) {
    const { ctx, page, st } = await L.openPage(b, { w, h, arm, init: TR });
    await page.goto(L.ORIGIN + '/stories' + q, { waitUntil: 'load' }); await L.sleep(4000);
    const x = await page.evaluate(() => ({ X: window.__X, fcp: window.__J.fcp, holds: window.__J.holds }));
    out.push({ arm, i, x, nonGet: st.nonGet }); console.log('==', arm, i, 'fcp', x.fcp, 'cls', x.X.sh.reduce((a, s) => a + s[1], 0).toFixed(4), 'holds', JSON.stringify(x.holds)); for (const e of x.X.ev) console.log('  ev', JSON.stringify(e)); for (const s of x.X.samples) console.log('  rect', s[0], s[1]); for (const s of x.X.sh) if (s[1] > 0.002) console.log('  sh', s[0], s[1], s[2], '\n      ' + s[3].join('\n      '));
    await ctx.close(); }
  await b.close(); })();
