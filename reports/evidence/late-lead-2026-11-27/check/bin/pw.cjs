/* 27 Nov late-lead-check: /stories on saved pages, old (a2ad2ad, core 16.70.0) against new (175788f), through ab.cjs (cache-only, misses aborted).
   Sets:
     load   ?place=Asia, Europe, Nowhere and none at 1440 (Asia also 390); normal, late1s, late3s, late6s (core and chunks answered 1, 3, 6 s late).
     click  no place; a reader clicks Asia, then Europe, then All places (trusted clicks, 400 ms apart); normal, late1s, late3s, late6s at 1440, late3s 390.
     brk    attempts to break it: rapid clicks (one task, and trusted clicks with no pause), a filter that hides every card (fallback chip and
            page chip, regions renamed in the saved HTML of this run only), back and forward navigation, reduced motion, Enter on a chip,
            a sort chip after a fallback place (sort chip added to the saved HTML of this run only).
     eq     page signatures and CLS: home, /stories (no place) and the Lisbon story at 390 and 1440, normal speed.
   In the page (init script, before any page script): every animation frame up to 25 s records grid visibility, visible items, lead item and
   whether it is hidden (kept on change); a window click listener (bubble phase, so after every document listener) records the state at the
   end of each chip click and again 50 ms later. Lead items are named by a short hash of the card id, so the files hold no titles.
   Usage: NODE_PATH=/opt/node22/lib/node_modules node pw.cjs <set> [filter]. Resumable (skips name+variant+run already in results/<set>.jsonl). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, OUT } = require('./ab.cjs');

const WATCH = () => {
  const W = window.__pw = { on: null, off: null, dcl: null, fr: [], clicks: [], shows: [] };
  window.addEventListener('pageshow', e => W.shows.push((e.persisted ? 'bf ' : 'new ') + Math.round(performance.now())));
  document.addEventListener('DOMContentLoaded', () => { W.dcl = Math.round(performance.now()); });
  new MutationObserver(() => { const h = !!document.documentElement && document.documentElement.hasAttribute('data-tll-place-wait');
    if (h && W.on == null) W.on = Math.round(performance.now()); if (!h && W.on != null && W.off == null) W.off = Math.round(performance.now()); })
    .observe(document, { attributes: true, subtree: true, attributeFilter: ['data-tll-place-wait'] });
  const LID = e => { const c = e.querySelector('[id]') || e; let h = 0; for (const ch of String(c.id || '?')) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 'L' + (h % 46656).toString(36); };
  const S = window.__pwState = () => {
    const g = document.querySelector('.tll-lib-grid') || document.querySelector('.tll-library-grid'); if (!g) return null;
    const kids = [...g.children]; const vis = k => k.offsetParent !== null && getComputedStyle(k).display !== 'none' && !k.hasAttribute('data-tll-q-miss');
    const V = kids.filter(vis), L = kids.filter(k => k.hasAttribute('data-tll-lead'));
    const p = document.querySelector('[data-tll-place][aria-pressed="true"]');
    return { gv: getComputedStyle(g).visibility, nVis: V.length, nLead: L.length, lid: L[0] ? LID(L[0]) : 'x', leadHidden: L.some(k => !vis(k)),
      onFirst: L.length === 1 && L[0] === V[0], noimg: !!(L[0] && L[0].querySelector('.tll-noimg')), pressed: p ? p.getAttribute('data-tll-place') : 'none',
      mark: document.documentElement.hasAttribute('data-tll-place-wait') };
  };
  /* ok: the lead rule holds (one lead on the first visible item, or no lead when nothing is visible) */
  const ok = s => s.nVis ? s.onFirst : s.nLead === 0;
  window.addEventListener('click', e => { const c = e.target && e.target.closest && e.target.closest('[data-tll-place],[data-tll-sort]'); if (!c) return;
    const s = S(); const rec = { t: Math.round(performance.now()), chip: c.getAttribute('data-tll-place') || ('sort:' + c.getAttribute('data-tll-sort')), trusted: e.isTrusted, inClick: s && { ...s, ok: ok(s) } };
    W.clicks.push(rec); setTimeout(() => { const s2 = S(); rec.at50 = s2 && { ...s2, ok: ok(s2) }; }, 50); });
  let last = '';
  const tick = () => {
    const s = S(); let st;
    if (!s) st = (document.documentElement && document.documentElement.hasAttribute('data-tll-place-wait') ? 'mark' : '-') + ' nogrid';
    else st = (s.mark ? 'mark' : '-') + ' ' + s.gv + ' ' + s.nVis + ' ' + s.nLead + ' ' + s.lid + (s.leadHidden ? '*' : '') + ' ' + (ok(s) ? 'ok' : 'BAD') + ' ' + s.pressed;
    if (st !== last) { last = st; W.fr.push(Math.round(performance.now()) + ' ' + st); }
    if (performance.now() < 40000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const ST = page => page.evaluate(() => { const s = window.__pwState ? window.__pwState() : null;
  return { url: location.search, s, cls: window.__perf ? +window.__perf.cls.toFixed(4) : null, pw: window.__pw || null,
    chunks: [].map.call(document.querySelectorAll('script[src*="/chunks/"]'), x => x.src.replace(/^.*\//, '')) }; });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CH = v => `[data-tll-chips="place-sort"] [data-tll-place="${v}"]`;
const seqClick = (list, gap) => async page => { const out = []; for (const v of list) { await page.click(CH(v)); if (gap) await sleep(gap); out.push(await ST(page)); } await sleep(600); return { steps: out.map(o => ({ url: o.url, s: o.s })), end: await ST(page) }; };
/* one task: every chip clicked back to back by script (not trusted), state read in the same task after each */
const burst = list => async page => { const r = await page.evaluate(L => { const out = []; for (const v of L) { const c = document.querySelector(`[data-tll-chips="place-sort"] [data-tll-place="${v}"]`); if (!c) { out.push('nochip ' + v); continue; } c.click(); out.push(window.__pwState()); } return out; }, list);
  await sleep(600); return { burst: r, end: await ST(page) }; };
const SPEED = { normal: { wait: 6000 }, late1s: { slowJs: 1000, wait: 7000 }, late3s: { slowJs: 3000, wait: 9000 }, late6s: { slowJs: 6000, wait: 15000 } };
/* saved HTML of this run only: the one Oceania card and the one Antarctica card get another region, so both chips hide every card */
const EMPTY = b => b.replace(/(data-tll-region="1" hidden="">)Oceania</, '$1Oceania-x<').replace(/(data-tll-region="1" hidden="">)Antarctica</, '$1Antarctica-x<');
const SORT = b => b.replace(/(data-tll-place="Antarctica"[^>]*>[^<]*<\/a>)/, '$1<a href="#" class="tll-shelf-chip" data-tll-sort="time" aria-pressed="false">Shortest</a>');
const LISBON = '/stories/lisbon-sun-sails-city-built-to-stand-back-up';

const T = { load: [], click: [], brk: [], eq: [] };
const base = (o) => Object.assign({ init: WATCH, sig: false }, o);
for (let run = 0; run < 4; run++) {
  for (const [pl, ws] of [['Asia', [1440, 390]], ['Europe', [1440]], ['Nowhere', [1440]], ['', [1440]]]) for (const w of ws) for (const sp of Object.keys(SPEED)) {
    if (pl !== 'Asia' && run >= 3) continue;
    T.load.push([`${sp} ${pl || 'none'} ${w}`, 'stories.html', w, base(Object.assign({ q: pl ? '?place=' + pl : '', act: ST }, SPEED[sp])), run]); }
  for (const [sp, w] of [['normal', 1440], ['late1s', 1440], ['late3s', 1440], ['late6s', 1440], ['late3s', 390]])
    T.click.push([`${sp} click Asia,Europe,all ${w}`, 'stories.html', w, base(Object.assign({ act: seqClick(['Asia', 'Europe', 'all'], 400) }, SPEED[sp])), run]);
}
for (let run = 0; run < 3; run++) {
  const SEQ = ['Asia', 'Europe', 'Oceania', 'Middle East', 'all', 'Asia', 'Antarctica', 'Asia'];
  for (const sp of ['normal', 'late3s']) {
    T.brk.push([`${sp} rapid-burst`, 'stories.html', 1440, base(Object.assign({ act: burst(SEQ) }, SPEED[sp])), run]);
    T.brk.push([`${sp} rapid-trusted`, 'stories.html', 1440, base(Object.assign({ act: seqClick(SEQ, 0) }, SPEED[sp])), run]);
    T.brk.push([`${sp} empty Oceania,Antarctica,Asia`, 'stories.html', 1440, base(Object.assign({ mod: EMPTY, act: seqClick(['Oceania', 'Antarctica', 'Asia'], 400) }, SPEED[sp])), run]);
    T.brk.push([`${sp} empty ?place=Oceania`, 'stories.html', 1440, base(Object.assign({ mod: EMPTY, q: '?place=Oceania', act: ST }, SPEED[sp])), run]);
    T.brk.push([`${sp} reduced-motion ?place=Asia then Europe,Asia`, 'stories.html', 390, base(Object.assign({ ctx: { reducedMotion: 'reduce' }, q: '?place=Asia', act: seqClick(['Europe', 'Asia'], 400) }, SPEED[sp])), run]);
    T.brk.push([`${sp} enter-key Asia`, 'stories.html', 1440, base(Object.assign({ act: async page => { await page.focus(CH('Asia')); await page.keyboard.press('Enter'); await sleep(600); return { end: await ST(page) }; } }, SPEED[sp])), run]);
    T.brk.push([`${sp} sort after Asia`, 'stories.html', 1440, base(Object.assign({ mod: SORT, act: async page => { await page.click(CH('Asia')); await sleep(400); await page.click('[data-tll-chips="place-sort"] [data-tll-sort="time"]'); await sleep(600); return { end: await ST(page) }; } }, SPEED[sp])), run]);
    /* back and forward: ?place=Europe, click Asia (address now ?place=Asia; Asia is a fallback chip when late), open a story, back, forward, back */
    T.brk.push([`${sp} back-forward`, 'stories.html', 1440, base(Object.assign({ q: '?place=Europe', act: async (page) => {
      const out = {}; await page.click(CH('Asia')); await sleep(400); out.before = await ST(page);
      await page.goto('https://www.thatlayover.life' + LISBON, { waitUntil: 'load', timeout: 90000 }); await sleep(1500);
      await page.goBack({ waitUntil: 'load', timeout: 90000 }); await sleep((SPEED[sp].slowJs || 0) * 2 + 3000); out.back1 = await ST(page);
      await page.goForward({ waitUntil: 'load', timeout: 90000 }); await sleep(1500);
      await page.goBack({ waitUntil: 'load', timeout: 90000 }); await sleep((SPEED[sp].slowJs || 0) * 2 + 3000); out.back2 = await ST(page);
      return out; } }, SPEED[sp])), run]);
  }
}
for (let run = 0; run < 3; run++) for (const f of ['home.html', 'stories.html', 'stories__lisbon-sun-sails-city-built-to-stand-back-up.html']) for (const w of [390, 1440])
  T.eq.push([`eq ${f.replace(/__.*/, '__lisbon')} ${w}`, f, w, { sig: true, act: async page => ({ chunks: await page.evaluate(() => [].map.call(document.querySelectorAll('script[src*="/chunks/"]'), x => x.src.replace(/^.*\//, ''))) }) }, run]);

if (require.main === module) (async () => {
  const set = process.argv[2], flt = process.argv[3]; const RES = path.join(OUT, set + '.jsonl');
  const done = new Set(fs.existsSync(RES) ? fs.readFileSync(RES, 'utf8').split('\n').filter(Boolean).map(l => { const j = JSON.parse(l); return j.name + ' ' + j.v + ' ' + j.run; }) : []);
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { let i = 0; for (const [name, f, w, opt, run] of T[set]) { if (flt && !name.includes(flt)) continue; if (process.env.MAXRUN && run >= +process.env.MAXRUN) continue; i++;
      for (const v of ((run + i) % 2 ? ['new', 'old'] : ['old', 'new'])) { if (done.has(name + ' ' + v + ' ' + run)) continue;
        const st = await load(browser, v, f, w, false, Object.assign({ tag: set, run }, opt)); st.name = name; st.run = run;
        fs.appendFileSync(RES, JSON.stringify(st) + '\n');
        const a = st.act || {}; const e = a.end || a; console.log(name, v, run, 'navs', st.navs, 'errs', st.errs.length, 'cls', st.perfLoad && st.perfLoad.cls, st.perf && st.perf.cls, 'miss', st.miss || 0, 'guard', st.guardHit || 0,
          e && e.s ? JSON.stringify(e.s) : (typeof a === 'string' ? a : ''), st.navErr || ''); } } }
  finally { await browser.close(); }
})();
module.exports = { T };
