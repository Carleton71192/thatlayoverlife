// node vis.cjs <build> [prop]: were the rail photos that load and then get hidden ever on screen? Samples every 50 ms during a slow
// scroll through the whole page and a full swipe of the rail row (cache only, images not fetched).
const { chromium } = require('/opt/node-tools/node_modules/playwright'); const L = require('./lib.cjs'); const P = require('./proposal.cjs');
const [build, prop] = process.argv.slice(2);
const INIT = () => {
  let s = 20261113; Math.random = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const V = window.__vis = {};
  const tick = () => { const tr = document.querySelector('[data-h3-track]');
    if (tr) { const tb = tr.getBoundingClientRect();
      tr.querySelectorAll('.h3-card').forEach(c => { if (c.hidden) return; const r = c.querySelector('.h3-card-ph').getBoundingClientRect();
        const on = r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > Math.max(0, tb.left) && r.left < Math.min(innerWidth, tb.right);
        if (on) { const slug = c.getAttribute('data-slug'); V[slug] = V[slug] || Math.round(performance.now()); } }); }
    setTimeout(tick, 50); };
  document.addEventListener('DOMContentLoaded', tick);
};
(async () => {
  const b = await chromium.launch();
  const o = await L.open(b, { name: 'home', build, w: 390, h: 844, dpr: 3, mod: prop ? P.home : null, init: INIT });
  const pg = o.pg; await pg.waitForTimeout(4000);
  await L.scrollAll(pg);
  // scroll to the rail and swipe it to the end
  await pg.evaluate(async () => { const tr = document.querySelector('[data-h3-track]'); tr.scrollIntoView({ block: 'center' }); await new Promise(f => setTimeout(f, 600));
    for (let x = 0; x <= tr.scrollWidth; x += 120) { tr.scrollLeft = x; await new Promise(f => setTimeout(f, 120)); } await new Promise(f => setTimeout(f, 800)); });
  const r = await pg.evaluate(() => { const rail = [...document.querySelectorAll('[data-h3-track] .h3-card')].map(c => { const i = c.querySelector('.h3-card-ph img');
    return { slug: c.getAttribute('data-slug'), hidden: c.hidden, loaded: !!(i && i.complete && i.naturalWidth > 0) }; }); return { rail, vis: window.__vis }; });
  const hl = r.rail.filter(c => c.hidden && c.loaded).map(c => c.slug);
  console.log(JSON.stringify({ build, prop: !!prop, shownOnScreen: Object.keys(r.vis).length, shownLoaded: r.rail.filter(c => !c.hidden && c.loaded).length,
    hiddenLoaded: hl.length, hiddenLoadedEverOnScreen: hl.filter(s => r.vis[s]).length, blocked: o.st.blocked.length, fetched: o.st.fetched }));
  await o.ctx.close(); await b.close();
})();
