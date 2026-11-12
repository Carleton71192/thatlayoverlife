// NODE_PATH=/opt/node22/lib/node_modules PATH=/opt/node22/bin:$PATH node check.cjs
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, 'index.html');

(async () => {
  const browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const out = {};
  for (const w of [390, 1440, 360, 1920]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const info = await page.evaluate(() => {
      const q = (s) => document.querySelector(s);
      const fs = (el) => el && parseFloat(getComputedStyle(el).fontSize);
      const small = [];
      document.querySelectorAll('body *').forEach((el) => {
        if (!el.childNodes.length) return;
        const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!hasText) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') return;
        if (el.closest('.sr') || el.closest('thead.sr')) return;
        const r = el.getBoundingClientRect(); if (!r.width) return;
        if (parseFloat(cs.fontSize) < 12) small.push(el.tagName + '.' + el.className + ' ' + cs.fontSize);
      });
      const fams = new Set();
      document.querySelectorAll('body *').forEach((el) => fams.add(getComputedStyle(el).fontFamily.split(',')[0].trim()));
      const wide = [];
      document.querySelectorAll('body *').forEach((el) => { const r = el.getBoundingClientRect(); if (r.right > document.documentElement.clientWidth + 1 && !el.closest('pre')) wide.push(el.tagName + '.' + el.className + ' ' + Math.round(r.right)); });
      return {
        scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
        readout: q('.readout').innerText.replace(/\s+/g, ' '),
        measure: q('#measure-out').innerText,
        col680: q('#col680').innerText,
        coverTitle: fs(q('.tll-type-cover-title')), storyTitle: fs(q('#story-title')),
        small: small.slice(0, 10), fams: Array.from(fams), wide: wide.slice(0, 10),
        now: Array.from(document.querySelectorAll('.step')).map((r) => r.dataset.step + '=' + r.querySelector('[data-now]').textContent),
        calc: Array.from(document.querySelectorAll('#calc-body tr')).map((r) => r.innerText.replace(/\s+/g, ' ')),
        opacity0: Array.from(document.querySelectorAll('body *')).filter((e) => getComputedStyle(e).opacity === '0').length,
      };
    });
    if (w === 390 || w === 1440) {
      // interactions
      await page.click('#b-long'); await page.waitForTimeout(100);
      info.afterLong = await page.evaluate(() => document.querySelector('#status').textContent + ' | ' + document.querySelector('.step [data-title]').textContent);
      const longWide = await page.evaluate(() => document.documentElement.scrollWidth);
      info.scrollAfterLong = longWide;
      await page.click('#b-rand'); await page.waitForTimeout(100);
      info.afterRand = await page.evaluate(() => document.querySelector('#status').textContent);
      await page.click('#b-short');
      await page.click('#b-reset'); await page.waitForTimeout(100);
      info.afterReset = await page.evaluate(() => document.querySelector('#status').textContent);
      await page.click('.chip[data-w="390"]'); await page.waitForTimeout(50);
      info.calc390 = await page.evaluate(() => Array.from(document.querySelectorAll('#calc-body tr')).slice(0, 3).map((r) => r.innerText.replace(/\s+/g, ' ')));
      await page.fill('#w-num', '1920'); await page.press('#w-num', 'Enter'); await page.dispatchEvent('#w-num', 'change');
      info.calc1920 = await page.evaluate(() => document.querySelector('#calc-body tr').innerText.replace(/\s+/g, ' '));
      await page.click('#b-measure');
      info.measurePressed = await page.getAttribute('#b-measure', 'aria-pressed');
      await page.click('#b-measure');
      await page.click('#b-copy'); await page.waitForTimeout(200);
      info.copy = await page.textContent('#copy-status');
      await page.click('.step details summary');
      info.liveMath = await page.textContent('.step [data-live-math]');
      await page.click('.chip[data-w="1440"]');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(__dirname, `shot-${w}.png`), fullPage: true });
      // keyboard focus check
      await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
      info.focusOutline = await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return e.tagName + ' ' + cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor; });
    }
    info.errors = errors;
    out[w] = info;
    await ctx.close();
  }
  // resize live: one page, change viewport
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const before = await page.textContent('#r-title');
  await page.setViewportSize({ width: 700, height: 900 }); await page.waitForTimeout(300);
  const after = await page.textContent('#r-title');
  out.resize = { before, after, w: await page.textContent('#r-w') };
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
})();
