// Stand-in test for tll-submit-gallery-v1 (29 Oct 2026). Serves /submit from the saved live pieces: the 13 Oct form export,
// the live footer code (form steps + autosave), the live photo script (tllphotocleanv11) and the new layer. Cloudinary is stubbed.
// Run: node src/pages/submit/live-2026-10-29/try-gallery.mjs
import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const FORM = read('src/pages/submit/live-2026-10-29/form-story-export-2026-10-13.html');
const FOOT = read('src/pages/submit/live-2026-10-29/page-footer-live.html');
const CLEAN = read('src/pages/submit/live-2026-10-29/photo-clean-v1.1-live.js');
const LAYER = read('src/site-layers/tll-submit-gallery-v1.js');
const page_ = withLayer => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;background:#F7F1E8;font-family:system-ui,sans-serif;color:#0A0B14}main{max-width:760px;margin:0 auto;padding:24px 16px}
.tll-pen-field{display:block;margin:0 0 16px}.tll-pen-label{display:block;font-weight:600;margin:0 0 6px}.tll-pen-input{display:block;width:100%;box-sizing:border-box}
.w-checkbox-input{margin-right:6px}.w-form-done,.w-form-fail{display:none}</style></head>
<body><main>${FORM}</main>${FOOT}<script>${CLEAN}</script>${withLayer ? `<script>${LAYER}</script>` : ''}</body></html>`;

const errors = [];
const results = {};
const ok = (name, cond, detail) => { results[name] = { pass: !!cond, detail }; };

const browser = await chromium.launch();
async function open(width, withLayer) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${width}${withLayer ? '' : ' (no layer)'}: ${e.message}`));
  const uploads = [];
  let sentUrl = null;
  await page.route('**/*', async route => {
    const u = route.request().url();
    if (u.startsWith('https://api.cloudinary.com/')) {
      const folder = /name="folder"\r\n\r\n([^\r]+)/.exec(route.request().postDataBuffer()?.toString('latin1') || '')?.[1];
      uploads.push(folder);
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ secure_url: `https://res.cloudinary.com/idonvlow/image/upload/${folder}/p${uploads.length}.jpg` }) });
    }
    if (u.startsWith('https://www.thatlayover.life/submit')) {
      if (u.includes('?')) sentUrl = u;
      return route.fulfill({ status: 200, contentType: 'text/html', body: page_(withLayer) });
    }
    return route.abort();
  });
  await page.clock.install();
  await page.goto('https://www.thatlayover.life/submit');
  return { ctx, page, uploads, sent: () => sentUrl };
}
async function makeImages(page, n, tag) {
  const data = await page.evaluate(([n, tag]) => Array.from({ length: n }, (_, i) => {
    const c = document.createElement('canvas'); c.width = 320; c.height = 200; const g = c.getContext('2d');
    g.fillStyle = `hsl(${(i * 67 + tag.length * 40) % 360} 60% 55%)`; g.fillRect(0, 0, 320, 200);
    g.fillStyle = '#fff'; g.font = 'bold 48px sans-serif'; g.fillText(tag + (i + 1), 24, 120);
    return c.toDataURL('image/png').split(',')[1];
  }), [n, tag]);
  return data.map((b, i) => ({ name: `${tag}${i + 1}.png`, mimeType: 'image/png', buffer: Buffer.from(b, 'base64') }));
}

for (const width of [390, 1440]) {
  const { ctx, page, sent } = await open(width, true);
  await page.evaluate(() => { const t = document.querySelector('textarea[name="body"]'); t.value = 'I waited forty years for Pompeii.\nThe Art of Arriving First\nOk, so there I was, at the entry.\nGet a Guide and Wait for the Sunset\nLater in the morning, we joined a guided visit.'; t.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.evaluate(() => { document.querySelectorAll('fieldset,[hidden],.tllst-step').forEach(e => { e.hidden = false; e.style.display = ''; }); });
  const imgs = await makeImages(page, 3, 'G');
  await page.locator('input[name="photo-gallery"]').setInputFiles(imgs);
  await page.evaluate(() => { let e = document.querySelector('.tll-cp'); while (e) { if (getComputedStyle(e).display === 'none') e.style.setProperty('display', 'block', 'important'); if (e.hidden) e.hidden = false; e = e.parentElement; } });
  const rows = page.locator('.tll-cp li');
  ok(`${width}: one caption row per photo`, await rows.count() === 3);
  const opts = await page.locator('#tll-cp-1-w option').allTextContents();
  ok(`${width}: headings from the story offered`, opts.includes('After: The Art of Arriving First') && opts.includes('After: Get a Guide and Wait for the Sunset') && !opts.some(o => /forty years/.test(o)), opts.join(' / '));
  await page.locator('#tll-cp-1').fill('The Forum at 9am, Vesuvius behind.');
  await page.locator('#tll-cp-1-w').selectOption('The Art of Arriving First');
  const plan = JSON.parse(await page.locator('input[name="photo-plan"]').inputValue() || '[]');
  ok(`${width}: photo-plan holds caption and place`, plan.length === 1 && plan[0].n === 2 && plan[0].caption === 'The Forum at 9am, Vesuvius behind.' && plan[0].after === 'The Art of Arriving First', JSON.stringify(plan));
  ok(`${width}: caption counter`, (await page.locator('.tll-cp li').nth(1).locator('small').textContent()) === '34 of 200');
  await page.locator('input[type="file"][name="photo-gallery"]').setInputFiles([]);
  const h = await makeImages(page, 1, 'H');
  await page.locator('input[name="hero-image"]').setInputFiles(h);
  ok(`${width}: cover caption field`, await page.locator('input[name="cover-caption"]').count() === 1);
  ok(`${width}: caption kept after another pick`, (await page.locator('#tll-cp-1').inputValue()) === 'The Forum at 9am, Vesuvius behind.');
  const ow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(`${width}: no overflow`, ow <= 1, ow);
  await page.locator('.tll-cp').screenshot({ path: path.join(here, `captions-${width}.png`) }).catch(() => {});
  await ctx.close();
}
await browser.close();
const names = Object.keys(results);
names.forEach(n => console.log(`${results[n].pass ? 'PASS' : 'FAIL'}  ${n}${results[n].pass ? '' : '  ' + (results[n].detail ?? '')}`));
console.log('page errors:', errors.length ? errors.join(' | ') : 'none');
console.log(`${names.filter(n => results[n].pass).length} of ${names.length} passed`);
