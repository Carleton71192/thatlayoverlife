import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const dir = new URL('.', import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const width of [1280, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: width === 1280 ? 900 : 844 } });
  const page = await ctx.newPage();
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (url.startsWith('http://tll.test/')) { const p = new URL(url).pathname; if (p.endsWith('.css')) return route.fulfill({ body: fs.readFileSync(dir + p.slice(1)), contentType: 'text/css' }); if (p.endsWith('.html')) return route.fulfill({ body: fs.readFileSync(dir + p.slice(1)), contentType: 'text/html' }); }
    if (/\.js(\?|$)/.test(url)) return route.fulfill({ contentType: 'application/javascript', body: /cookieconsent/.test(url) ? 'window.CookieConsent={run(){},show(){},hide(){}}' : '' });
    if (/\.css(\?|$)|fonts\.googleapis/.test(url)) return route.fulfill({ contentType: 'text/css', body: '' });
    return route.fulfill({ status: 204, body: '' });
  });
  await page.goto('http://tll.test/mock-in.html'); await page.waitForTimeout(600);
  await page.click('#tll-more-detail-btn'); await page.click('#tll-more-share-btn'); await page.waitForTimeout(400);
  const gaps = await page.evaluate(() => ['tll-more-detail', 'tll-more-share'].map(id => { const b = document.getElementById(id + '-btn').getBoundingClientRect(); const f = document.getElementById(id).firstElementChild.firstElementChild.getBoundingClientRect(); return { id, buttonBottom: Math.round(b.bottom), firstChildTop: Math.round(f.top), gap: Math.round(f.top - b.bottom) }; }));
  console.log(width, JSON.stringify(gaps));
  await page.screenshot({ path: dir + `in-${width}-panels-open.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
