// node rail.cjs <build> <w> <h> [mod]: when do the home rail photos start, and which cards were shown at that moment (cache only)
const { chromium } = require('/opt/node-tools/node_modules/playwright'); const L = require('./lib.cjs'); const P = require('./proposal.cjs');
const [build, w, h, mod] = process.argv.slice(2);
const INIT = () => {
  const T = window.__R = { ev: [], first: null };
  const snap = tag => { const tr = document.querySelector('[data-h3-track]'); if (!tr) return;
    T.ev.push({ tag, t: Math.round(performance.now()), shown: [...tr.querySelectorAll('.h3-card')].filter(c => !c.hidden).map(c => c.getAttribute('data-slug')) }); };
  document.addEventListener('h3:stories', () => snap('render'));
  document.addEventListener('DOMContentLoaded', () => snap('dcl'));
  // the hero img: every src it had, and what it showed at the first animation frame after it was parsed
  const mo = new MutationObserver(() => { const i = document.querySelector('[data-h3-hero] img[data-tll-parallax="hero"]'); if (!i || T.hero) return; T.hero = { t: Math.round(performance.now()), src0: i.getAttribute('src'), load0: i.getAttribute('loading') };
    requestAnimationFrame(() => { T.hero.raf = { t: Math.round(performance.now()), cur: i.currentSrc, src: i.getAttribute('src') }; }); });
  mo.observe(document, { childList: true, subtree: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-paint' || e.name === 'first-contentful-paint') T[e.name] = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true });
  T.lcp = []; new PerformanceObserver(l => { for (const e of l.getEntries()) T.lcp.push({ t: Math.round(e.startTime), url: (e.url || '').slice(-60), size: e.size }); }).observe({ type: 'largest-contentful-paint', buffered: true });
};
(async () => {
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const o = await L.open(b, { name: 'home', build, w: +w, h: +h, init: INIT, mod: mod ? P.home : null });
  await o.pg.waitForTimeout(6000);
  const r = await o.pg.evaluate(() => {
    const res = performance.getEntriesByType('resource').filter(e => e.initiatorType === 'img' || /\.(jpe?g|png)$/i.test(e.name)).map(e => ({ t: Math.round(e.startTime), u: e.name.replace(/^.*\//, '').slice(0, 70) }));
    const rail = [...document.querySelectorAll('[data-h3-track] .h3-card')].map(c => { const i = c.querySelector('.h3-card-ph img'); return { slug: c.getAttribute('data-slug'), hidden: c.hidden, cur: i && (i.currentSrc || '').replace(/^.*\//, '').slice(0, 60), complete: i && i.complete && i.naturalWidth > 0 }; });
    const hi = document.querySelector('[data-h3-hero] img[data-tll-parallax="hero"]');
    return { R: window.__R, res, rail, heroNow: hi && { cur: hi.currentSrc.replace(/^.*\//, ''), loading: hi.loading, fp: hi.getAttribute('fetchpriority') } };
  });
  console.log(JSON.stringify({ ...r, sum: L.summary(o.st) }, null, 1));
  await o.ctx.close(); await b.close();
})();
