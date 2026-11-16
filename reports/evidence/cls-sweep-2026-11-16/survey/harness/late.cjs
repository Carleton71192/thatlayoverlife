/* one diagnostic load of /travelers at 390: mutations and h1 style between 3.0 and 4.2 s */
const { chromium } = require('playwright'); const H = require('./h.cjs');
(async () => { const b = await chromium.launch();
  const orig = b.newContext.bind(b);
  b.newContext = async (o) => { const c = await orig(o); c.addInitScript(() => {
    window.__L = []; const h1s = () => { const h = document.querySelector('.tll-travelers-title'); if (!h) return null; const cs = getComputedStyle(h); const em = h.querySelector('em'); const ce = em && getComputedStyle(em);
      return [Math.round(h.getBoundingClientRect().height), cs.fontFamily.slice(0, 40), cs.fontSize, cs.letterSpacing, cs.fontWeight, ce && ce.fontFamily.slice(0, 30), ce && ce.fontStyle, ce && ce.fontWeight, h.innerHTML.length]; };
    const mo = new MutationObserver(l => { const t = performance.now(); if (t < 2500 || t > 4500) return; for (const m of l) __L.push([Math.round(t), m.type, m.target.nodeName + '.' + String(m.target.className || '').slice(0, 40), m.attributeName, (m.addedNodes[0] && m.addedNodes[0].nodeName) || '']); });
    document.addEventListener('DOMContentLoaded', () => mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true }));
    [2500, 3000, 3300, 3500, 3700, 4000].forEach(t => setTimeout(() => __L.push(['h1@' + t, h1s(), document.fonts.status, [...document.fonts].filter(f => f.status !== 'unloaded').map(f => f.family + ' ' + f.style + ' ' + f.weight + ' ' + f.status).join('|').slice(0, 400)]), t - performance.now()));
    document.fonts.addEventListener('loadingdone', e => __L.push(['fontsdone', Math.round(performance.now()), e.fontfaces.map(f => f.family + ' ' + f.style + ' ' + f.weight).join('|')]));
    document.fonts.addEventListener('loading', e => __L.push(['fontsloading', Math.round(performance.now()), e.fontfaces.map(f => f.family + ' ' + f.style + ' ' + f.weight).join('|')]));
  }); return c; };
  const ctxs = []; const oc = b.newContext; b.newContext = async o => { const c = await oc(o); ctxs.push(c); const op = c.close.bind(c); c.close = async () => { const p = c.pages()[0]; try { console.log(JSON.stringify(await p.evaluate(() => window.__L), null, 0)); } catch (e) { console.log('x', e.message); } return op(); }; return c; };
  const r = await H.open(b, { page: 'travelers', w: 390, h: 844, v: 'base' }); console.log('shifts', JSON.stringify(r.r.T.sh.map(s => [s.t, s.v])));
  await b.close(); })();
