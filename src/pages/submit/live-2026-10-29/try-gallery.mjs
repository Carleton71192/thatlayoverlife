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
const showStep3 = page => page.evaluate(() => document.querySelectorAll('[data-tll-step]').forEach(x => x.classList.toggle('tllst-hide', x.getAttribute('data-tll-step') !== '3')));

// 1. Before: the live page without the layer. Two picks, one photo each.
{
  const { ctx, page } = await open(390, false);
  const imgs = await makeImages(page, 2, 'g');
  const g = page.locator('input[name="photo-gallery"]');
  await g.setInputFiles([imgs[0]]); await g.setInputFiles([imgs[1]]);
  const n = await g.evaluate(i => i.files.length);
  ok('before: second pick replaces the first (bug reproduced)', n === 1, `files after two picks: ${n}`);
  const t = await page.locator('.tllst-save').textContent();
  ok('before: save line is empty until the first save', t === '', JSON.stringify(t));
  await ctx.close();
}

for (const width of [390, 1440]) {
  const { ctx, page, uploads, sent } = await open(width, true);
  const W = `${width}: `;
  ok(W + 'idle autosave line', (await page.locator('.tllst-save').textContent()).includes('Your words save as a draft every 20 seconds. Photos are added when you send.'));
  await showStep3(page);
  const gal = page.locator('input[name="photo-gallery"]');
  const g = await makeImages(page, 5, 'g');
  const h = await makeImages(page, 1, 'hero');
  await page.locator('input[name="hero-image"]').setInputFiles(h);
  ok(W + 'cover photo preview and line', await page.locator('.tll-sg-hero:not([hidden]) img').count() === 1 && await page.getByText('This is your cover photo. Add more photos in the gallery below.').isVisible());
  await gal.setInputFiles([g[0], g[1]]);
  await gal.setInputFiles([g[2]]);
  await gal.setInputFiles([g[1], g[3], g[4]]);   // g2 again: skipped
  let n = await gal.evaluate(i => [...i.files].map(f => f.name).join(','));
  ok(W + 'picks add up, duplicate skipped', n === 'g1.png,g2.png,g3.png,g4.png,g5.png', n);
  ok(W + 'five previews and count', await page.locator('.tll-sg .tll-sg-item').count() === 5 && (await page.locator('.tll-sg-count').textContent()) === '5 of 12 photos chosen', await page.locator('.tll-sg-count').textContent());
  await page.locator('.tll-sg .tll-sg-rm').nth(1).click();   // remove g2
  n = await gal.evaluate(i => [...i.files].map(f => f.name).join(','));
  ok(W + 'Remove takes that photo out of the field', n === 'g1.png,g3.png,g4.png,g5.png', n);
  await gal.setInputFiles([]);   // picker closed with nothing chosen
  n = await gal.evaluate(i => i.files.length);
  ok(W + 'empty pick keeps the chosen photos', n === 4, String(n));
  // over the limit
  const many = await makeImages(page, 10, 'm');
  await gal.setInputFiles(many);
  ok(W + 'limit of 12 with a note', (await gal.evaluate(i => i.files.length)) === 12 && /holds 12 photos\. 2 photos were not added/.test(await page.locator('.tll-sg-note').textContent()), await page.locator('.tll-sg-note').textContent());
  ok(W + 'Add more hidden at the limit', await page.locator('.tll-sg-add').isHidden());
  for (let k = 0; k < 8; k++) await page.locator('.tll-sg .tll-sg-rm').last().click();
  ok(W + 'back to 4 after removing 8', (await gal.evaluate(i => i.files.length)) === 4 && await page.locator('.tll-sg-add').isVisible());
  // Remove tap must not open the file picker (list is outside the label)
  let chooser = false; page.once('filechooser', () => { chooser = true; });
  await page.locator('.tll-sg .tll-sg-rm').last().click(); await page.waitForTimeout(150);
  ok(W + 'Remove does not open the picker', !chooser);
  const fc = page.waitForEvent('filechooser', { timeout: 2000 }).catch(() => null);
  await page.locator('.tll-sg-add').click();
  ok(W + 'Add more photos opens the picker', !!(await fc));
  await page.screenshot({ path: path.join(here, `gallery-${width}.png`), fullPage: false, clip: await page.locator('fieldset:has(input[name="photo-gallery"])').boundingBox().then(b => ({ x: 0, y: Math.max(0, b.y - 10), width, height: Math.min(b.height + 20, 1400) })) }).catch(() => {});
  // fill the required fields so the form can send
  await page.evaluate(() => {
    const f = document.querySelector('form[data-tll-form="submit-story"]');
    f.querySelectorAll('[required]').forEach(el => {
      if (el.type === 'file') return;
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = true;
      else if (el.tagName === 'SELECT') { const o = [...el.options].find(o => o.value && !o.disabled) || el.options[el.options.length - 1]; if (o && !o.value) o.value = 'Test'; if (o) o.selected = true; }
      else if (!el.value) el.value = el.type === 'email' ? 'a@b.co' : el.type === 'url' ? 'https://example.com' : el.type === 'number' ? '1' : 'Test words for the draft';
    });
  });
  // autosave fires on the 20 second timer
  await page.clock.fastForward(20000);
  const saveText = await page.locator('.tllst-save').textContent();
  ok(W + 'autosave line rewritten to 12-hour time', /^Draft saved · \d{1,2}:\d{2} (AM|PM)\. Kept on this device\. Photos are added when you send\.$/.test(saveText), saveText);
  await page.locator('.tllst-save').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(here, `autosave-${width}.png`), clip: await page.locator('.tllst-nav').boundingBox().then(b => ({ x: 0, y: b.y - 10, width, height: b.height + 20 })) });
  // send: photo-clean uploads cover + 3 gallery photos, then the form goes with the links
  await page.evaluate(() => { const a = document.querySelector('.tll-pen-actions'); if (a) a.classList.remove('tllst-hide'); });
  const invalid = await page.evaluate(() => [...document.querySelectorAll('form[data-tll-form="submit-story"] input,form[data-tll-form="submit-story"] textarea,form[data-tll-form="submit-story"] select')].filter(e => e.willValidate && !e.checkValidity()).map(e => (e.name || e.id) + ':' + e.validationMessage));
  if (invalid.length) console.log(W + 'invalid before send: ' + invalid.join(' ; '));
  await page.evaluate(() => { const f = document.querySelector('form[data-tll-form="submit-story"]'); f.requestSubmit(f.querySelector('[type="submit"]')); });
  await page.waitForURL(/\?/, { timeout: 15000 }).catch(() => {});
  const q = sent() ? new URL(sent()).searchParams : null;
  const galLinks = q ? (q.get('photo-gallery') || '').split('\n').filter(Boolean) : [];
  ok(W + 'Send uploads cover + 3 gallery photos', uploads.filter(x => x === 'tll/photo-gallery').length === 3 && uploads.filter(x => x === 'tll/hero-image').length === 1, uploads.join(','));
  ok(W + 'form sends 3 gallery links', galLinks.length === 3, galLinks.join(' | '));
  await ctx.close();
}

// restored draft on load
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('restore: ' + e.message));
  await page.route('**/*', r => r.request().url().startsWith('https://www.thatlayover.life/submit') ? r.fulfill({ status: 200, contentType: 'text/html', body: page_(true) }) : r.abort());
  await page.addInitScript(() => { try { localStorage.setItem('tllStoryDraft', JSON.stringify({ title: 'Earlier' })); } catch (e) {} });
  await page.goto('https://www.thatlayover.life/submit');
  ok('restored draft line', (await page.locator('.tllst-save').textContent()).startsWith('Draft restored from your last visit.'));
  await ctx.close();
}

await browser.close();
let fail = 0;
for (const [k, v] of Object.entries(results)) { if (!v.pass) fail++; console.log(`${v.pass ? 'PASS' : 'FAIL'}  ${k}${v.detail !== undefined && !v.pass ? '  -> ' + v.detail : ''}`); }
console.log(`page errors: ${errors.length ? errors.join(' || ') : 'none'}`);
console.log(`${Object.keys(results).length - fail} of ${Object.keys(results).length} passed`);
process.exit(fail || errors.length ? 1 : 0);
