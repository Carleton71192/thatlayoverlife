/* Sweep 21 Nov 2026, lens UX: consent checkboxes. Tap the sentence next to each required checkbox and read whether it ticks, plus the
   accessible name Chromium computes. Read only; no form sent. Usage: NODE_PATH=/opt/node22/lib/node_modules node cb.cjs */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, sleep } = require('./h.cjs');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-ux';
global.__ACT = async (page) => {
  const out = [];
  const n = await page.evaluate(() => document.querySelectorAll('input[type=checkbox]').length);
  for (let i = 0; i < n; i++) {
    const r = await page.evaluate(i => { const c = document.querySelectorAll('input[type=checkbox]')[i]; if (c.closest('#tll-note-form,footer')) return null;
      const outer = c.closest('label') && c.closest('label').parentElement && c.closest('label').parentElement.closest('label');
      const txt = outer ? [].filter.call(outer.childNodes, x => !(x.nodeType === 1 && x.contains(c))).map(x => x.textContent).join(' ').trim() : '';
      const shown = c.closest('label') && c.closest('label').getBoundingClientRect().height > 0;
      return { name: c.name, req: c.required, nested: !!outer, outerFor: outer ? outer.getAttribute('for') : null, txt: txt.slice(0, 50), shown }; }, i);
    if (!r || !r.shown) continue;
    const loc = page.locator('input[type=checkbox]').nth(i);
    r.aria = await loc.ariaSnapshot().catch(e => 'err');
    if (r.nested && r.txt) {
      const before = await loc.isChecked();
      await page.evaluate(i => { const c = document.querySelectorAll('input[type=checkbox]')[i]; const outer = c.closest('label').parentElement.closest('label'); const t = [].find.call(outer.children, x => !x.contains(c)) || outer; t.scrollIntoView({ block: 'center' }); }, i);
      const box = await page.evaluate(i => { const c = document.querySelectorAll('input[type=checkbox]')[i]; const outer = c.closest('label').parentElement.closest('label'); const el = [].find.call(outer.children, x => !x.contains(c)); const rr = (el || outer).getBoundingClientRect(); return { x: rr.left + Math.min(30, rr.width / 2), y: rr.top + rr.height / 2 }; }, i);
      await page.mouse.click(box.x, box.y); await sleep(300);
      r.tapText = { before, after: await loc.isChecked() };
    }
    out.push(r);
  }
  return out;
};
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  const res = [];
  try { for (const [f, s] of [['signup.html', 0], ['for-expats.html', 0], ['my-pets.html', 1], ['share-photos.html', 1], ['submit.html', 1]]) { const st = await load(browser, f, 390, !!s); res.push({ file: f, act: st.act }); console.log(f, JSON.stringify(st.act)); } }
  finally { await browser.close(); fs.writeFileSync(path.join(SP, 'results', 'cb.json'), JSON.stringify(res, null, 1)); }
})();
