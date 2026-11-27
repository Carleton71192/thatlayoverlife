/* 27 Nov late-lead (from asia-cls-2026-11-25/bin/pw.cjs): set lead, 8 loads per case and variant; placeState adds leadPos (lead index among visible items) and clsNow; frames sampled up to 25 s so the click cases are covered. */
/* Nov 25 asia-cls-check (from check-3/bin/pw.cjs): /stories with ?place=Asia, Europe, Nowhere and no place, at 390 and 1440, at normal speed,
   core and chunks 3 s late, and Webflow footer scripts held 5 s after the stories chunk; old (16.69.0) against new (2c51cda), 6 loads each.
   Set eq: home, /for-expats and a story page, signatures for page equality.
   Usage: NODE_PATH=/opt/node22/lib/node_modules node pw.cjs <set> [filter]. Resumable (skips name+variant+run already in results/<set>.jsonl). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, OUT } = require('./ab.cjs');

/* in the page before any script: when the place mark went on and off, DOMContentLoaded, when a place chip was first pressed, and a
   frame-by-frame record (requestAnimationFrame, up to 12 s) of: mark, grid visibility, cards shown, index of the lead card. A new entry
   is kept only when that state changes. */
const WATCH = () => {
  const W = window.__pw = { on: null, off: null, dcl: null, pressedAt: null, pressed: null, fr: [] };
  document.addEventListener('DOMContentLoaded', () => { W.dcl = Math.round(performance.now()); });
  new MutationObserver(() => { const h = !!document.documentElement && document.documentElement.hasAttribute('data-tll-place-wait');
    if (h && W.on == null) W.on = Math.round(performance.now()); if (!h && W.on != null && W.off == null) W.off = Math.round(performance.now()); })
    .observe(document, { attributes: true, subtree: true, attributeFilter: ['data-tll-place-wait'] });
  let last = '';
  /* the lead: a short hash of the lead item's card id (story slug), so the files hold no titles */
  const LID = e => { const c = e.querySelector('[id]') || e; let h = 0; for (const ch of String(c.id || '?')) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 'L' + (h % 46656).toString(36); };
  const tick = () => {
    const g = document.querySelector('.tll-lib-grid') || document.querySelector('.tll-library-grid');
    const m = !!document.documentElement && document.documentElement.hasAttribute('data-tll-place-wait');
    const p = document.querySelector('[data-tll-place][aria-pressed="true"]'); const pv = p ? p.getAttribute('data-tll-place') : '';
    if (pv && pv.toLowerCase() !== 'all' && W.pressedAt == null) { W.pressedAt = Math.round(performance.now()); W.pressed = pv; }
    let st = (m ? 'mark' : '-');
    if (g) { const cards = document.querySelectorAll('.tll-lib-card'); let shown = 0; for (const c of cards) if (c.offsetParent) shown++;
      const le = g.querySelector(':scope > [data-tll-lead]');
      st += ' ' + getComputedStyle(g).visibility + ' ' + shown + ' ' + (le ? LID(le) + (le.offsetParent ? '' : '*') : 'x'); }
    else st += ' nogrid 0 x';
    st += ' ' + (pv || 'none');
    if (st !== last) { last = st; W.fr.push(Math.round(performance.now()) + ' ' + st); }
    if (performance.now() < 25000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const placeState = page => page.evaluate(() => { const g = document.querySelector('.tll-lib-grid') || document.querySelector('.tll-library-grid');
  const cards = document.querySelectorAll('.tll-lib-card'); const le = g && g.querySelector(':scope > [data-tll-lead]');
  const LID = e => { const c = e.querySelector('[id]') || e; let h = 0; for (const ch of String(c.id || '?')) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 'L' + (h % 46656).toString(36); };
  const ch = performance.getEntriesByType('resource').filter(e => /\/chunks\/stories/.test(e.name)).map(e => Math.round(e.responseEnd));
  return { url: location.search, pressed: [].map.call(document.querySelectorAll('[data-tll-place][aria-pressed="true"]'), c => c.getAttribute('data-tll-place')),
    shown: [].filter.call(cards, c => c.offsetParent).length, leadPos: (() => { if (!g) return null; const v = [...g.children].filter(k => k.offsetParent !== null && getComputedStyle(k).display !== 'none' && !k.hasAttribute('data-tll-q-miss')); const L = [...g.children].filter(k => k.hasAttribute('data-tll-lead')); return { nLead: L.length, pos: L.length ? v.indexOf(L[0]) : null, nVis: v.length }; })(), total: cards.length, lead: le ? LID(le) : null, leadVis: le ? !!le.offsetParent : null,
    gridVis: g ? getComputedStyle(g).visibility : null, clsNow: window.__perf ? +window.__perf.cls.toFixed(4) : null, mark: document.documentElement.hasAttribute('data-tll-place-wait'), pw: window.__pw || null, chunkEnd: ch,
    chunks: [].map.call(document.querySelectorAll('script[src*="/chunks/"]'), s => s.src.replace(/^.*\//, '')) }; });

const T = { lead: [] };
const RUNS = +(process.env.RUNS || 8);
const clickAsia = async page => { await page.click('[data-tll-chips="place-sort"] [data-tll-place="Asia"]'); await new Promise(r => setTimeout(r, 1500)); return placeState(page); };
for (const run of [...Array(RUNS).keys()]) {
  for (const [pl, ws] of [['Asia', [1440, 390]], ['Europe', [1440]], ['Nowhere', [1440]], ['', [1440]]]) for (const w of ws) {
    const q = pl ? '?place=' + pl : '', base = { q, init: WATCH, act: placeState, sig: false }, tag = pl || 'none';
    T.lead.push([`normal ${tag} ${w}`, ['old', 'new'], 'stories.html', w, Object.assign({}, base, { wait: 6000 }), run]);
    T.lead.push([`late3s ${tag} ${w}`, ['old', 'new'], 'stories.html', w, Object.assign({}, base, { slowJs: 3000, wait: 9000 }), run]);
  }
  for (const [m, w] of [['late3s', 1440], ['normal', 1440], ['late3s', 390]]) T.lead.push([`${m} clickAsia ${w}`, ['old', 'new'], 'stories.html', w,
    Object.assign({ init: WATCH, act: clickAsia, sig: false }, m === 'late3s' ? { slowJs: 3000, wait: 9000 } : { wait: 6000 }), run]);
}
if (require.main === module) (async () => {
  const set = process.argv[2], flt = process.argv[3]; const RES = path.join(OUT, set + '.jsonl');
  const done = new Set(fs.existsSync(RES) ? fs.readFileSync(RES, 'utf8').split('\n').filter(Boolean).map(l => { const j = JSON.parse(l); return j.name + ' ' + j.v + ' ' + j.run; }) : []);
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { let i = 0; for (const [name, order, f, w, opt, run] of T[set]) { if (flt && !name.includes(flt)) continue; i++;
      for (const v of ((run + i) % 2 ? order.slice().reverse() : order)) { if (done.has(name + ' ' + v + ' ' + run)) continue;
        const st = await load(browser, v, f, w, false, Object.assign({ sig: set === 'eq', tag: set, run }, opt)); st.name = name; st.run = run;
        fs.appendFileSync(RES, JSON.stringify(st) + '\n');
        const a = st.act || {}; console.log(name, v, run, 'errs', st.errs.length, 'cls', st.perfLoad && st.perfLoad.cls, st.perf && st.perf.cls, 'hold', st.hold, 'miss', st.miss || 0,
          a.pw ? JSON.stringify({ on: a.pw.on, off: a.pw.off, dcl: a.pw.dcl, pr: a.pw.pressedAt, shown: a.shown, lead: a.lead, vis: a.gridVis }) : '', st.navErr || ''); } } }
  finally { await browser.close(); }
})();
