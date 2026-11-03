// Baseline browser audit: axe at 390 and 1440, overflow at five widths, screenshots, pre-consent third-party requests, console errors.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const OUT = process.argv[2]; const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const PAGES = ['/', '/stories', '/stories/antarctica-marathon', '/the-map', '/the-paw-passport', '/login', '/signup', '/submit', '/share-photos', '/for-expats', '/travelers'];
const WIDTHS = [360, 390, 768, 1024, 1440];
const TRACK = [['ga4', /googletagmanager\.com\/gtag|google-analytics\.com\/(g\/)?collect/], ['ahrefs', /analytics\.ahrefs\.com/], ['adsense', /pagead2\.googlesyndication\.com|adsbygoogle/], ['fundingchoices', /fundingchoicesmessages\.google\.com/]];
const slug = (p) => p === '/' ? 'home' : p.slice(1).replace(/\//g, '_');
(async () => {
  fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const p of PAGES) {
    const row = { page: p, widths: {}, axe: {}, preConsent: {}, consoleErrors: [], status: null };
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 });
      const page = await ctx.newPage();
      const hits = {}; TRACK.forEach(([k]) => hits[k] = []);
      page.on('request', (r) => { for (const [k, re] of TRACK) if (re.test(r.url())) hits[k].push(r.url().slice(0, 140)); });
      if (w === 390) page.on('console', (m) => { if (m.type() === 'error') row.consoleErrors.push(m.text().slice(0, 200)); });
      if (w === 390) page.on('pageerror', (e) => row.consoleErrors.push('pageerror: ' + String(e.message).slice(0, 200)));
      let resp; try { resp = await page.goto('https://www.thatlayover.life' + p, { waitUntil: 'load', timeout: 60000 }); } catch (e) { row.widths[w] = { error: String(e.message).slice(0, 160) }; await ctx.close(); continue; }
      if (w === 390) row.status = resp && resp.status();
      await page.waitForTimeout(6000);
      const ov = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth; const sw = document.documentElement.scrollWidth; const wide = [];
        if (sw > vw + 1) for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); if (r.right > vw + 1 && r.width > 0 && getComputedStyle(el).position !== 'fixed') { wide.push((el.id ? '#' + el.id : '') + '.' + String(el.className || '').toString().split(' ').slice(0, 2).join('.') + ' ' + Math.round(r.right)); if (wide.length > 5) break; } }
        return { vw, sw, overflow: sw > vw + 1, wide, h: document.documentElement.scrollHeight };
      });
      row.widths[w] = ov;
      await page.screenshot({ path: path.join(OUT, 'shots', `${slug(p)}-${w}.png`) });
      if (w === 390 || w === 1440) {
        row.preConsent[w] = Object.fromEntries(Object.entries(hits).map(([k, v]) => [k, v.length]));
        row.preConsentSample = row.preConsentSample || {}; for (const [k, v] of Object.entries(hits)) if (v.length && k !== 'fundingchoices') row.preConsentSample[k] = v.slice(0, 2);
        await page.addScriptTag({ content: AXE });
        const ax = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }); return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, targets: v.nodes.slice(0, 4).map((x) => x.target.join(' ').slice(0, 120)) })); });
        row.axe[w] = ax;
        if (w === 390) await page.screenshot({ path: path.join(OUT, 'shots', `${slug(p)}-390-full.png`), fullPage: true });
      }
      await ctx.close();
    }
    results.push(row); console.log('done', p, row.status);
    fs.writeFileSync(path.join(OUT, 'browser-results.json'), JSON.stringify(results, null, 1));
  }
  await browser.close();
  console.log('BROWSER-DONE');
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
