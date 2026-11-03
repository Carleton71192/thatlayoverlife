const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const w of [390, 1440]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, isMobile: w < 800 });
    const p = await ctx.newPage();
    await p.addInitScript(() => { window.__ls = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__ls.push({ v: e.value, t: Math.round(e.startTime), src: (e.sources || []).slice(0, 3).map((s) => { const n = s.node; return n ? (n.id || n.className || n.tagName).toString().slice(0, 60) + ` ${Math.round(s.previousRect.y)}->${Math.round(s.currentRect.y)} h${Math.round(s.previousRect.height)}->${Math.round(s.currentRect.height)}` : '?'; }) }); }).observe({ type: 'layout-shift', buffered: true }); });
    await p.goto('https://www.thatlayover.life/stories', { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(8000);
    const r = await p.evaluate(() => {
      const img = document.querySelector('#tll-shelf-grid img.tll-lib-img'); const cs = img && getComputedStyle(img);
      const grid = document.querySelector('#tll-shelf-grid'); const gcs = grid && getComputedStyle(grid);
      const total = window.__ls.reduce((a, e) => a + e.v, 0);
      const top = [...window.__ls].sort((a, b) => b.v - a.v).slice(0, 6);
      return { total: +total.toFixed(3), n: window.__ls.length, img: cs && { ar: cs.aspectRatio, h: cs.height, w: cs.width, attrs: [img.getAttribute('width'), img.getAttribute('height')], loading: img.loading }, grid: gcs && { display: gcs.display, cols: gcs.gridTemplateColumns.slice(0, 80), cards: grid.children.length, h: grid.getBoundingClientRect().height, anim: gcs.animationName }, top };
    });
    console.log(w, JSON.stringify(r, null, 1));
    await ctx.close();
  }
  await b.close();
})();
