const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true }); const p = await ctx.newPage();
  await p.addInitScript(() => {
    window.__mv = []; window.__ls = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__ls.push([Math.round(e.startTime), +e.value.toFixed(3)]); }).observe({ type: 'layout-shift', buffered: true });
    const wrap = (name) => { const orig = Node.prototype[name]; Node.prototype[name] = function (...a) { if (this.classList && this.classList.contains('tll-lib-grid')) { const st = (new Error().stack || '').split('\n').slice(2, 5).map((s) => s.trim().replace(/https:\/\/[^ )]*\/([^/ )]+)/g, '$1').slice(0, 110)); window.__mv.push({ t: Math.round(performance.now()), op: name, node: (a[0] && a[0].querySelector && (a[0].querySelector('a[id]') || {}).id || '').slice(0, 40), first: ((this.firstElementChild && this.firstElementChild.querySelector('a[id]')) || {}).id, st }); } return orig.apply(this, a); }; };
    wrap('insertBefore'); wrap('appendChild');
    const dE = document.dispatchEvent.bind(document); document.dispatchEvent = (e) => { if (e.type === 'tll:lib-filtered') window.__mv.push({ t: Math.round(performance.now()), op: 'event', st: (new Error().stack || '').split('\n').slice(2, 4).map((s) => s.trim().replace(/https:\/\/[^ )]*\/([^/ )]+)/g, '$1').slice(0, 110)) }); return dE(e); };
  });
  await p.goto('https://www.thatlayover.life/stories', { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(20000);
  const r = await p.evaluate(() => ({ mv: window.__mv, ls: window.__ls, firstCards: [...document.querySelectorAll('.tll-lib-grid > *')].slice(0, 3).map((k) => [(k.querySelector('a[id]') || {}).id, k.getAttribute('data-tll-noimg'), k.getAttribute('data-tll-lead')]) }));
  console.log('moves', r.mv.length, 'shifts', r.ls.length, 'last shift at', r.ls.length && r.ls[r.ls.length - 1][0]);
  const byStack = {}; for (const m of r.mv) { const k = m.op + ' | ' + m.st.join(' <- '); byStack[k] = (byStack[k] || 0) + 1; }
  console.log(JSON.stringify(byStack, null, 1));
  console.log('first 12 moves', JSON.stringify(r.mv.slice(0, 12).map((m) => [m.t, m.op, m.node, m.first])));
  console.log('shift times', JSON.stringify(r.ls.slice(0, 50)));
  console.log('top cards now', JSON.stringify(r.firstCards));
  await b.close();
})();
