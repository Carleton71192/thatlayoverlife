/* Live check of tll-lounge-deck-v1 on a published site (nothing is swapped or blocked except analytics and ads).
   NODE_PATH=<playwright>/node_modules node src/pages/gallery/deck-2026-11-11/live.mjs [base] [chromium|webkit]
   base defaults to the test site, https://that-layover-life.webflow.io */
import { createRequire } from 'module'; const pw = createRequire(import.meta.url)('playwright');
import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'https://that-layover-life.webflow.io', ENGINE = process.argv[3] || 'chromium', HOST = new URL(BASE).host.split('.')[0];
const BLOCK = /googletagmanager|google-analytics|doubleclick|googlesyndication|adservice|clarity\.ms|facebook\.net/;
let pass = 0, fail = 0; const fails = [];
const eq = (a, b, name) => { if (JSON.stringify(a) === JSON.stringify(b)) pass++; else { fail++; fails.push(name + ' | got: ' + JSON.stringify(a)); console.log('FAIL', name, JSON.stringify(a)); } };
const browser = await pw[ENGINE].launch();
async function open(w, p) { const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, hasTouch: w < 768 && ENGINE === 'chromium' }); const reqs = [], bad = [], errs = [];
  await ctx.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = '#cc-main{display:none!important}'; document.head.appendChild(s); }));
  await ctx.route('**/*', (r) => BLOCK.test(r.request().url()) ? r.abort() : r.continue());
  const page = await ctx.newPage(); page.on('request', (r) => reqs.push(r.url())); page.on('response', (r) => { if (r.status() >= 400 && /jsdelivr/.test(r.url())) bad.push(r.status() + ' ' + r.url()); }); page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE + p, { waitUntil: 'load' }); await page.waitForTimeout(1500); return { ctx, page, reqs, bad, errs }; }
const TOP = '.tll-deck-stage .tll-deck-card:not([aria-hidden="true"])';
const count = (page) => page.locator('.tll-deck-count').innerText();
async function dragBy(page, dx) { await page.evaluate(() => document.querySelector('.tll-deck').scrollIntoView({ block: 'start' })); await page.waitForTimeout(100); const b = await page.locator(TOP).boundingBox(); const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await page.mouse.move(x, y); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(x + dx * i / 10, y); await page.waitForTimeout(35); } await page.waitForTimeout(220); await page.mouse.up(); await page.waitForTimeout(600); }
for (const w of [390, 1440]) { const T = `[${HOST} ${ENGINE} ${w}] `;
  { const { ctx, page, reqs, bad, errs } = await open(w, '/gallery');
    eq([!!(await page.$('.tll-deck')), await page.locator('[data-tll-loc]').count(), reqs.some((u) => /chunks\/misc\.js/.test(u)), reqs.some((u) => /misc-preview/.test(u)), bad, await page.evaluate(() => getComputedStyle(document.querySelector('[data-tll-loc]').parentElement).display !== 'none')], [false, 17, true, false, [], true], T + 'no flag: today\'s grid, public chunk only, no failed layer file');
    var baseErrs = errs.slice(); await ctx.close(); }
  { const { ctx, page, reqs, bad, errs } = await open(w, '/gallery?preview=lounge');
    eq([reqs.some((u) => /misc-preview\.js/.test(u)), bad, await count(page), await page.locator(TOP).getAttribute('aria-label'), await page.evaluate(() => getComputedStyle(document.querySelector('[data-tll-loc]').parentElement).display)], [true, [], '1 of 17', 'Montenegro, photo by NC', 'none'], T + 'flag: deck in place of the grid, Montenegro first');
    eq(await page.evaluate(() => { const im = document.querySelector('.tll-deck-stage .tll-deck-card:not([aria-hidden="true"]) img'); return im.complete && im.naturalWidth > 0; }), true, T + 'the top photo has loaded');
    await page.evaluate(() => { const c = document.querySelector('[data-tll-lounge-chips]'); scrollTo(0, c.getBoundingClientRect().top + scrollY - (innerWidth < 768 ? 150 : 110)); }); await page.waitForTimeout(300); await page.screenshot({ path: path.join(DIR, `live-${HOST}-${ENGINE}-${w}.png`) });
    await dragBy(page, 100); eq(await count(page), '1 of 17', T + '100 px drag springs back');
    await dragBy(page, 160); eq(await count(page), '2 of 17', T + '160 px drag throws');
    await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(450); await page.locator('.tll-deck [data-deck="prev"]').click(); await page.waitForTimeout(450); eq(await count(page), '2 of 17', T + 'Next then Previous');
    await page.locator(TOP).focus(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(450); eq(await count(page), '3 of 17', T + 'right arrow');
    await page.locator('[data-tll-lounge-chips] button[data-val="Asia"]').click(); await page.waitForTimeout(300); eq(await count(page), '1 of 3', T + 'Asia chip');
    for (let i = 0; i < 3; i++) { await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(420); }
    eq((await page.locator(TOP).innerText()).replace(/\s+/g, ' ').trim(), 'That is all 3. Start again Add yours', T + 'end card');
    await page.locator('[data-tll-lounge-chips] button[data-val="all"]').click(); await page.waitForTimeout(300);
    await page.locator('.tll-deck [data-deck="grid"]').click(); await page.waitForTimeout(250); eq(await page.evaluate(() => [].filter.call(document.querySelectorAll('[data-tll-loc]'), (t) => t.getBoundingClientRect().width > 0).length), 17, T + 'See all as a grid');
    await page.locator('.tll-deck-backbar [data-deck="deck"]').click(); await page.waitForTimeout(250); eq(await count(page), '1 of 17', T + 'Back to the deck');
    eq([errs.filter((e) => !baseErrs.includes(e)), await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)], [[], true], T + 'no new page errors, no sideways scroll');
    await ctx.close(); }
  { const { ctx, page } = await open(w, '/gallery?preview=lounge-above'); eq([await count(page), await page.evaluate(() => getComputedStyle(document.querySelector('[data-tll-loc]').parentElement).display !== 'none')], ['1 of 17', true], T + 'lounge-above: deck above, grid shown'); await ctx.close(); }
}
/* Other pages still load the core and their chunks from the new release with no failure; /spotlight gets no deck even with the flag. */
for (const p of ['/', '/stories', '/travelers', '/share-photos', '/spotlight?preview=lounge']) { const { ctx, page, reqs, bad, errs } = await open(1440, p);
  eq([reqs.some((u) => /tll-site-layers-v16\.js/.test(u)), reqs.filter((u) => /\/chunks\//.test(u)).length > 0, bad, !!(await page.$('.tll-deck'))], [true, true, [], false], `[${HOST} ${ENGINE}] ${p}: core and chunks load, no deck`); await ctx.close(); }
await browser.close(); console.log(`${HOST} ${ENGINE}: ${pass} passed, ${fail} failed`); if (fail) { console.log(fails.join('\n')); process.exit(1); }
