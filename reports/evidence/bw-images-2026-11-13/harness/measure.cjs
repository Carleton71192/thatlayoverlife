// node measure.cjs <tag> <page> <build> <w> <h> <dpr> <mode: top|scroll> [prop] [fetch] [shots]
// One view: Webflow bytes from the cache (deduped per URL), which file each card and hero photo took, and screenshots.
// Math.random is seeded, so the home rail order, the rotating word and the cover week are the same in every run.
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright'); const L = require('./lib.cjs'); const P = require('./proposal.cjs');
const [tag, name, build, w, h, dpr, mode, ...flags] = process.argv.slice(2);
const prop = flags.includes('prop'), allowFetch = flags.includes('fetch'), shots = flags.includes('shots');
const OUT = path.join(L.D, 'out'), SH = path.join(L.D, 'shots');
const INIT = () => {
  let s = 20261113; Math.random = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const T = window.__V = { vis: {} };
  // which rail photos were ever on screen (IntersectionObserver clips by the swipe row), and while their card was shown
  const seen = new WeakSet();
  const io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) { const c = e.target.closest('.h3-card'); if (c && !c.hidden) T.vis[c.getAttribute('data-slug')] = 1; } }, { threshold: 0.01 });
  const mo = new MutationObserver(() => { document.querySelectorAll('[data-h3-track] .h3-card-ph').forEach(p => { if (!seen.has(p)) { seen.add(p); io.observe(p); } }); });
  mo.observe(document, { childList: true, subtree: true });
};
(async () => {
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const o = await L.open(b, { name, build, w: +w, h: +h, dpr: +dpr, mod: prop && name === 'home' ? P.home : null, allowFetch, init: INIT });
  const pg = o.pg; await pg.waitForTimeout(5000);
  if (shots) await pg.screenshot({ path: path.join(SH, `${tag}-top.png`) });
  if (mode === 'scroll') { await L.scrollAll(pg); await pg.waitForTimeout(2500); await L.scrollAll(pg); await pg.waitForTimeout(1500); }
  const r = await pg.evaluate(() => {
    const short = u => (u || '').replace(/^https:\/\/cdn\.prod\.website-files\.com\/[0-9a-f]+\//, '');
    const cards = [...document.querySelectorAll('img')].filter(i => i.closest('.h3-card-ph,.h3-pc,.w-dyn-item,.tll-lib-grid,.tll-related')).map(i => { const r = i.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), cur: short(i.currentSrc), sizes: i.getAttribute('sizes'), shown: r.width > 0 }; });
    const hero = document.querySelector('[data-h3-hero] img[data-tll-parallax="hero"]');
    const paw = document.querySelector('.tll-paw-hero');
    const rail = [...document.querySelectorAll('[data-h3-track] .h3-card')].map(c => { const i = c.querySelector('.h3-card-ph img'); return { slug: c.getAttribute('data-slug'), hidden: c.hidden, loaded: !!(i && i.complete && i.naturalWidth > 0), cur: i && short(i.currentSrc) }; });
    return { cards, hero: hero && { cur: short(hero.currentSrc), sizes: hero.getAttribute('sizes'), loading: hero.getAttribute('loading') }, paw: paw && getComputedStyle(paw).backgroundImage.replace(/^.*\//, ''),
      rail, vis: window.__V.vis, hscroll: document.documentElement.scrollWidth - document.documentElement.clientWidth, H: document.documentElement.scrollHeight };
  });
  if (shots) {
    await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(800);
    await pg.screenshot({ path: path.join(SH, `${tag}-full.png`), fullPage: true, scale: 'css' });
    const first = await pg.$('[data-h3-track] .h3-card:not([hidden]) .h3-card-ph') || await pg.$('.w-dyn-item img') || null;
    if (first) { await first.scrollIntoViewIfNeeded(); await pg.waitForTimeout(800);
      // the same frame in both runs: no running animation or transition (a reveal zoom otherwise lands at a different point)
      await pg.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' }); await pg.waitForTimeout(500);
      await first.screenshot({ path: path.join(SH, `${tag}-card.png`) }); }
  }
  const s = L.summary(o.st);
  const res = { tag, name, build, w: +w, h: +h, dpr: +dpr, mode, prop, ...s, ...r };
  fs.writeFileSync(path.join(OUT, `m-${tag}.json`), JSON.stringify(res, null, 1));
  console.log(tag, 'wf', s.wfBytes, 'img', s.imgBytes, 'files', s.imgFiles, 'blocked', s.blocked.length, 'fetched', s.fetched, 'errs', s.errs.length, 'agentBytes', L.bytes().net);
  await o.ctx.close(); await b.close();
})();
