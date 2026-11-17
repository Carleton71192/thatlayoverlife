/* debug: scroll to the end (or mid page), reload, and trace every layout-shift entry with its sources, the scroll position and the page height per frame.
   usage: node dbg-reload.cjs <page> <bottom|mid> <w> <h> <arms,comma> [N] */
const L = require('./lib.cjs'); const { chromium } = require('playwright');
const TR = () => { if (window.top !== window) return; const X = window.__X = { ev: [], samples: [], sh: [] }; const now = () => Math.round(performance.now());
  const nm = n => { if (!n) return 'null'; if (n.nodeType !== 1) return '#text<' + (n.parentElement ? n.parentElement.tagName.toLowerCase() + '.' + String(n.parentElement.className).split(' ')[0] : '') + '>'; return n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + '.' + String(n.className && n.className.baseVal != null ? n.className.baseVal : n.className).split(' ').slice(0, 2).join('.'); };
  new PerformanceObserver(l => { for (const e of l.getEntries()) X.sh.push([Math.round(e.startTime), +e.value.toFixed(4), document.readyState[0], e.hadRecentInput ? 'inp' : '', e.sources.map(s => nm(s.node) + ' ' + [s.previousRect.x, s.previousRect.y, s.previousRect.width, s.previousRect.height].map(Math.round) + '>' + [s.currentRect.x, s.currentRect.y, s.currentRect.width, s.currentRect.height].map(Math.round))]); }).observe({ type: 'layout-shift', buffered: true });
  const secs = () => { const out = []; const walk = (n, d) => { for (const c of n.children) { if (/^(SCRIPT|STYLE|LINK|NOSCRIPT|IFRAME)$/.test(c.tagName)) continue; const r = c.getBoundingClientRect(); if (!c.getClientRects().length) continue; out.push(' '.repeat(d) + nm(c).slice(0, 44) + ' ' + Math.round(r.top + scrollY) + '+' + Math.round(r.height)); if (d < (window.__DEPTH || 2) && r.height > 300) walk(c, d + 1); } }; walk(document.body, 0); return out; };
  X.maps = []; const map = tag => { try { X.maps.push([now(), tag, Math.round(scrollY), document.documentElement.scrollHeight, secs()]); } catch (e) { X.maps.push([now(), tag, 'ERR ' + e]); } };
  document.addEventListener('DOMContentLoaded', () => map('DCL capture'), true);
  window.addEventListener('DOMContentLoaded', () => { map('DCL end'); setTimeout(() => map('DCL+0'), 0); requestAnimationFrame(() => map('DCL raf')); });
  window.addEventListener('load', () => { map('load'); setTimeout(() => map('load+0'), 0); requestAnimationFrame(() => map('load raf')); setTimeout(() => map('load+600'), 600); });
  try { document.fonts.addEventListener('loadingdone', e => X.ev.push([now(), 'fonts loadingdone ' + (e.fontfaces || []).length, Math.round(scrollY), document.readyState[0]])); document.fonts.addEventListener('loading', () => X.ev.push([now(), 'fonts loading', Math.round(scrollY), document.readyState[0]])); } catch (e) { }
  window.addEventListener('scroll', () => { if (!X.sc) { X.sc = 1; map('first scroll'); } }, true);
  if (window.__RAFMAPS) { let lh = 0, n = 0; const t2 = () => { const de = document.documentElement; if (de && document.body && de.scrollHeight !== lh && n < 14) { lh = de.scrollHeight; n++; map('raf'); } if (document.readyState === 'loading') requestAnimationFrame(t2); }; requestAnimationFrame(t2); }

  document.addEventListener('DOMContentLoaded', () => X.ev.push([now(), 'DCL capture', scrollY, document.documentElement.scrollHeight]), true);
  window.addEventListener('DOMContentLoaded', () => { X.ev.push([now(), 'DCL end', scrollY, document.documentElement.scrollHeight]); setTimeout(() => X.ev.push([now(), 'DCL+0', scrollY, document.documentElement.scrollHeight]), 0); });
  window.addEventListener('load', () => X.ev.push([now(), 'load', scrollY, document.documentElement.scrollHeight]));
  window.addEventListener('scroll', () => X.ev.push([now(), 'scroll', Math.round(scrollY), document.readyState[0]]), true);
  let last = ''; const tick = () => { const de = document.documentElement; const s = Math.round(scrollY) + ' / ' + (de ? de.scrollHeight : 0) + ' ' + document.readyState[0]; if (s !== last) { last = s; X.samples.push([now(), s]); } requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
(async () => { const b = await chromium.launch(); const [pg, where, w, h, arms, N] = [process.argv[2] || 'about', process.argv[3] || 'bottom', +process.argv[4] || 390, +process.argv[5] || 844, (process.argv[6] || 'ctl,new').split(','), +process.argv[7] || 1];
  for (let i = 1; i <= N; i++) for (const arm of arms) {
    const { ctx, page } = await L.openPage(b, { w, h, arm, init: TR }); if (process.env.RAFMAPS) await ctx.addInitScript(() => { window.__RAFMAPS = 1; window.__DEPTH = 3; });
    await page.goto(L.ORIGIN + L.PAGES[pg], { waitUntil: 'load' }); await L.sleep(3000);
    const y = await page.evaluate(wh => { const max = document.documentElement.scrollHeight - innerHeight; const y = wh === 'bottom' ? max : Math.min(max, Math.round(innerHeight * 1.6)); window.scrollTo(0, y); return y; }, where);
    await L.sleep(700); await page.reload({ waitUntil: 'load' }); await L.sleep(4000);
    const x = await page.evaluate(() => ({ X: window.__X, holds: window.__J.holds, sy: Math.round(scrollY), dh: document.documentElement.scrollHeight }));
    console.log('==', pg, where, w, arm, i, 'wantY', y, 'endY', x.sy, 'docH', x.dh, 'cls', x.X.sh.reduce((a, s) => a + s[1], 0).toFixed(4), 'holds', JSON.stringify(x.holds));
    for (const e of x.X.ev) console.log('  ev', JSON.stringify(e)); for (const s of x.X.samples) console.log('  y/h', s[0], s[1]);
    if (process.env.MAPS) { let prev = null; for (const m of x.X.maps) { console.log('  map', m[0], m[1], 'y', m[2], 'h', m[3]); const cur = m[4] || []; if (!prev) for (const l of cur) console.log('      ' + l); else { const pm = new Map(prev.map(l => [l.replace(/ -?\d+\+\d+$/, ''), l])); for (const l of cur) { const k = l.replace(/ -?\d+\+\d+$/, ''); if (pm.get(k) !== l) console.log('      ' + l + '   (was ' + (pm.get(k) || 'absent').trim().split(' ').pop() + ')'); } } prev = cur; } }
    for (const s of x.X.sh) if (s[1] > 0.001) console.log('  sh', s[0], s[1], s[2], s[3], '\n      ' + s[4].join('\n      ').replace(/contributors\/[^ ]+/g, 'contributors/<profile>'));
    await ctx.close(); }
  await b.close(); })();
