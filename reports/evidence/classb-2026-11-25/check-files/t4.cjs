/* classb-check: the "after Send" rule of B02, with a story whose last line ends a sentence (the core end check lets it through). */
const { chromium } = require('playwright'); const L = require('./cb-lib.cjs'); const fs = require('fs');
(async () => { const b = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const w of [390, 1440]) for (const v of ['before', 'B02', 'all']) { const { ctx, pg, st } = await L.open(b, 'submit', v, w, true); const o = { v, w };
    const sel = 'textarea[name="body"]'; await pg.click(sel); await pg.keyboard.type('Typed by the check 4.'); await L.sleep(1300); o.lsTyped = !!(await L.LS(pg));
    o.submitHandlers = await pg.evaluate(() => { const f = document.querySelector('form[data-tll-form="submit-story"]'); let seen = 0; f.addEventListener('submit', () => seen++); f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); return seen; });
    await L.sleep(800); o.lsAfterSubmit = !!(await L.LS(pg));
    await pg.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }))); await pg.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
    await L.sleep(200); o.lsAfterLeave = !!(await L.LS(pg));
    o.boxes = await pg.evaluate(() => { const w = document.querySelector('form[data-tll-form="submit-story"]').closest('.w-form'); return ['.w-form-done', '.w-form-fail'].map(s => { const e = w.querySelector(s); return e ? getComputedStyle(e).display : '-'; }).join(' '); });
    await pg.evaluate(() => { const e = document.querySelector('textarea[name="body"]'); e.value += ' Again.'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await L.sleep(1300); o.lsAfterRetype = !!(await L.LS(pg));
    o.nonGet = st.nonGet; o.errs = st.errs; console.log(JSON.stringify(o)); fs.appendFileSync(__dirname + '/../results/t4.jsonl', JSON.stringify(o) + '\n'); await ctx.close(); } } finally { await b.close(); } })();
