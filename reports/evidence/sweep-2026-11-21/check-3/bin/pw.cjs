/* Nov 22 check-3: /stories?place= cases (a) to (f) for live (0f04fabf), base (f3bc3f4) and br (ff8b7cd), plus page equality base vs br.
   Usage: NODE_PATH=/opt/node22/lib/node_modules node pw.cjs <set> [filter]. Sets: place, eq. Resumable (skips name+variant+run already in results/<set>.jsonl). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, OUT } = require('./ab.cjs');

/* in the page before any script: when the mark went on and off, DOMContentLoaded, when a place chip was first pressed, and a timeline of
   mark / grid visibility / cards shown every 50 ms up to 14 s */
const WATCH = () => { window.__pw = { on: null, off: null, dcl: null, pressedAt: null, pressed: null, tl: [] };
  document.addEventListener('DOMContentLoaded', () => { window.__pw.dcl = Math.round(performance.now()); });
  new MutationObserver(() => { const h = !!document.documentElement && document.documentElement.hasAttribute('data-tll-place-wait'); if (h && window.__pw.on == null) window.__pw.on = Math.round(performance.now()); if (!h && window.__pw.on != null && window.__pw.off == null) window.__pw.off = Math.round(performance.now()); })
    .observe(document, { attributes: true, subtree: true, attributeFilter: ['data-tll-place-wait'] });
  let last = ''; const iv = setInterval(() => { const g = document.querySelector('.tll-lib-grid') || document.querySelector('.tll-library-grid'); const m = !!document.documentElement && document.documentElement.hasAttribute('data-tll-place-wait');
    const p = document.querySelector('[data-tll-place][aria-pressed="true"]'); const pv = p ? p.getAttribute('data-tll-place') : '';
    if (pv && pv.toLowerCase() !== 'all' && window.__pw.pressedAt == null) { window.__pw.pressedAt = Math.round(performance.now()); window.__pw.pressed = pv; }
    const st = (m ? 'mark' : '-') + ' ' + (g ? getComputedStyle(g).visibility + ' ' + [].filter.call(document.querySelectorAll('.tll-lib-card'), c => c.offsetParent).length : 'nogrid') + ' ' + (pv || 'none');
    if (st !== last) { last = st; window.__pw.tl.push(Math.round(performance.now()) + ' ' + st); } if (performance.now() > 14000) clearInterval(iv); }, 50); };
const placeState = page => page.evaluate(() => { const g = document.querySelector('.tll-lib-grid') || document.querySelector('.tll-library-grid');
  const ch = performance.getEntriesByType('resource').filter(e => /\/chunks\/stories/.test(e.name)).map(e => Math.round(e.responseEnd));
  return { url: location.search, pressed: [].map.call(document.querySelectorAll('[data-tll-place][aria-pressed="true"]'), c => c.getAttribute('data-tll-place')), shown: [].filter.call(document.querySelectorAll('.tll-lib-card'), c => c.offsetParent).length,
    total: document.querySelectorAll('.tll-lib-card').length, gridVis: g ? getComputedStyle(g).visibility : null, mark: document.documentElement.hasAttribute('data-tll-place-wait'), pw: window.__pw || null, chunkEnd: ch,
    chunks: [].map.call(document.querySelectorAll('script[src*="/chunks/"]'), s => s.src.replace(/^.*\//, '')) }; });

const LEADW = () => { window.__lead = []; new MutationObserver(ms => { for (const m of ms) if (m.attributeName === 'data-tll-lead' && m.target.hasAttribute('data-tll-lead')) window.__lead.push(Math.round(performance.now()) + ' ' + (m.target.id || (m.target.querySelector('a[id]') || {}).id || '?')); })
  .observe(document, { attributes: true, subtree: true, attributeFilter: ['data-tll-lead'] }); };
const both = (...fns) => fns.map(f => '(' + f.toString() + ')();').join('\n');
const placeLead = async page => Object.assign(await placeState(page), { lead: await page.evaluate(() => window.__lead) });
const T = { place: [], eq: [], x: [], h: [] };
const add = (set, name, vs, file, w, opt, runs) => { for (let run = 0; run < (runs || 1); run++) for (const v of vs) T[set].push([name, v, file, w, opt, run]); };
const V3 = ['live', 'base', 'br'];
const chipsOff = b => b.replace('<script id="tll-lib-chips-v1">', '<script id="tll-lib-chips-v1" type="text/plain">');
for (const pl of ['Europe', 'Asia']) for (const w of [390, 1440]) {
  const q = '?place=' + pl, base = { q, init: WATCH, act: placeState };
  add('place', `a normal ${pl} ${w}`, V3, 'stories.html', w, Object.assign({}, base, { wait: 6000 }), 2);
  add('place', `b late3s ${pl} ${w}`, V3, 'stories.html', w, Object.assign({}, base, { slowJs: 3000, wait: 9000 }), 2);
  add('place', `c hold4s ${pl} ${w}`, V3, 'stories.html', w, Object.assign({}, base, { holdWf: 4000, wait: 9000 }), 2);
  add('place', `c hold5s ${pl} ${w}`, V3, 'stories.html', w, Object.assign({}, base, { holdWf: 5000, wait: 9000 }), 2);
  add('place', `c late3s+hold5s ${pl} ${w}`, V3, 'stories.html', w, Object.assign({}, base, { slowJs: 3000, holdWf: 5000, wait: 9000 }), 1);
  add('place', `d chunk blocked ${pl} ${w}`, V3, 'stories.html', w, Object.assign({}, base, { block: /^chunks\/stories/, wait: 6000 }), 1);
  add('place', `e chips missing ${pl} ${w}`, V3, 'stories.html', w, Object.assign({}, base, { mod: chipsOff, wait: 6000 }), 1);
}
for (const w of [390, 1440]) {
  add('place', `f unknown Nowhere ${w}`, V3, 'stories.html', w, { q: '?place=Nowhere', init: WATCH, act: placeState, wait: 6000 }, 1);
  add('place', `f unknown Nowhere late3s ${w}`, V3, 'stories.html', w, { q: '?place=Nowhere', slowJs: 3000, init: WATCH, act: placeState, wait: 9000 }, 1);
  add('place', `f unknown Nowhere hold5s ${w}`, V3, 'stories.html', w, { q: '?place=Nowhere', holdWf: 5000, init: WATCH, act: placeState, wait: 9000 }, 1);
}
/* extra: more loads at 1440 normal speed, with the times the lead card was marked */
for (const pl of ['Asia', 'Europe']) add('x', `x normal ${pl} 1440`, V3, 'stories.html', 1440, { q: '?place=' + pl, init: both(WATCH, LEADW), act: placeLead, wait: 6000 }, 6);
add('x', 'x normal Asia 390', V3, 'stories.html', 390, { q: '?place=Asia', init: both(WATCH, LEADW), act: placeLead, wait: 6000 }, 4);
/* more loads of home at 390 (scroll-phase CLS spread in eq) */
add('h', 'h home 390', V3, 'home.html', 390, {}, 5);
/* page equality: base (f3bc3f4) vs br (ff8b7cd) with signatures; /stories without ?place= and four other pages; live too for reference */
for (const f of ['stories.html', 'home.html', 'for-expats.html', 'about.html', 'stories__lisbon-sun-sails-city-built-to-stand-back-up.html']) for (const w of [390, 1440])
  add('eq', `eq ${f} ${w}`, [['base', 'br', 'live']], f, w, {}, 2);

if (require.main === module) (async () => {
  const set = process.argv[2], flt = process.argv[3]; const RES = path.join(OUT, set + '.jsonl');
  const done = new Set(fs.existsSync(RES) ? fs.readFileSync(RES, 'utf8').split('\n').filter(Boolean).map(l => { const j = JSON.parse(l); return j.name + ' ' + j.v + ' ' + j.run; }) : []);
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const [name, vv, f, w, opt, run] of T[set]) { if (flt && !name.includes(flt)) continue;
      const order = Array.isArray(vv) ? vv : [vv];
      for (const v of (run % 2 ? order.slice().reverse() : order)) { if (done.has(name + ' ' + v + ' ' + run)) continue;
        const st = await load(browser, v, f, w, false, Object.assign({ sig: set === 'eq', tag: set, run }, opt)); st.name = name; st.run = run;
        fs.appendFileSync(RES, JSON.stringify(st) + '\n');
        const a = st.act || {}; console.log(name, v, run, 'errs', st.errs.length, 'cls', st.perf && st.perf.cls, 'hold', st.hold, a.pw ? JSON.stringify({ on: a.pw.on, off: a.pw.off, dcl: a.pw.dcl, pr: a.pw.pressedAt, ch: a.chunkEnd, shown: a.shown, vis: a.gridVis }) : '', st.navErr || ''); } } }
  finally { await browser.close(); }
})();
