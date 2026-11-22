/* Sweep Nov 21 CHECK, part 3: text overflow and clipping count, live vs branch, plus a few crops for the eye. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, OUT } = require('./ab.cjs');
const RES = path.join(OUT, 'ov.jsonl'); fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
const OVER = () => { const out = [];
  for (const e of document.body.querySelectorAll('*')) { if (/^(SCRIPT|STYLE|SVG|PATH|IMG|INPUT|TEXTAREA|SELECT|HTML|BODY)$/i.test(e.tagName)) continue; const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
    let txt = false; for (const c of e.childNodes) if (c.nodeType === 3 && c.nodeValue.trim()) txt = true; if (!txt) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden') continue;
    const xo = e.scrollWidth > e.clientWidth + 1 && /hidden|clip|auto|scroll/.test(cs.overflowX + cs.overflow); const pr = e.parentElement && e.parentElement.getBoundingClientRect();
    const spill = pr && pr.width > 10 && (r.right > pr.right + 2 || r.left < pr.left - 2) && !/absolute|fixed/.test(cs.position) && cs.display !== 'inline';
    const off = r.right > innerWidth + 1;
    if (xo || spill || off) out.push((xo ? 'clip ' : spill ? 'spill ' : 'offscreen ') + e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0] + ' "' + (e.innerText || '').trim().slice(0, 24) + '" ' + Math.round(r.width) + '/' + Math.round(pr ? pr.width : 0)); }
  return out; };
const CELLS = [['stories.html', 390, 0, '.tll-lib-grid'], ['account.html', 390, 1, null], ['account.html', 1440, 1, null], ['the-map.html', 390, 0, null], ['the-map.html', 1440, 0, null], ['for-expats.html', 390, 0, null],
  ['profile.html', 390, 0, '.tll-alb'], ['profile.html', 1440, 0, '.tll-alb'], ['gallery.html', 390, 0, null], ['submit.html', 390, 1, null], ['my-pets.html', 390, 1, null], ['this-page-does-not-exist-sweep.html', 390, 0, '.tll404-ctas'],
  ['support.html', 390, 0, '.tll-support-direct-title'], ['about.html', 390, 0, '.tll-about-final-actions'], ['travelers.html', 390, 0, null], ['home.html', 390, 0, 'nav']];
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try { for (const [f, w, s, crop] of CELLS) for (const v of ['live', 'br']) {
      const st = await load(browser, v, f, w, !!s, { sig: false, tag: 'ov', act: async (page) => { const o = await page.evaluate(OVER);
        if (crop) { const el = await page.$(crop); if (el) { await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: path.join(OUT, 'shots', [v, f.replace(/^profile/, 'PROFILE').replace('.html', ''), w].join('_') + '.png'), timeout: 8000 }).catch(() => { }); } }
        return o; } });
      const row = { file: st.file, w, v, errs: st.errs.length, over: st.act };
      fs.appendFileSync(RES, JSON.stringify(row) + '\n'); console.log(f, w, v, Array.isArray(st.act) ? st.act.length : st.act); } }
  finally { await browser.close(); }
})();
