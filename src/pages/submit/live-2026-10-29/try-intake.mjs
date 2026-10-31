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
const LAYER = read('src/site-layers/tll-submit-gallery-v1.js') + '\n' + read('src/site-layers/tll-intake-v1.js');
const page_ = withLayer => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;background:#F7F1E8;font-family:system-ui,sans-serif;color:#0A0B14}main{max-width:760px;margin:0 auto;padding:24px 16px}
.tll-pen-field{display:block;margin:0 0 16px}.tll-pen-label{display:block;font-weight:600;margin:0 0 6px}.tll-pen-input{display:block;width:100%;box-sizing:border-box}
.w-checkbox-input{margin-right:6px}.w-form-done,.w-form-fail{display:none}</style></head>
<body><main>${FORM.replace("</form>","</form><div class=\"w-form-done\" style=\"display:none\"><div>Thank you.</div></div>")}</main>${FOOT}<script>${CLEAN}</script><script>window.$memberstackDom={getMemberCookie:()=>'tok',getCurrentMember:async()=>({data:{id:'m'}})}</script>${withLayer ? `<script>${LAYER}</script>` : ''}</body></html>`;


const res = []; const ok = (n, c, d) => res.push(`${c ? 'PASS' : 'FAIL'}  ${n}${c ? '' : '  ' + (d ?? '')}`);
const browser = await chromium.launch();
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } }); const errs = []; page.on('pageerror', e => errs.push(e.message));
  let intake = null;
  await page.route('**/*', async route => { const u = route.request().url();
    if (u.endsWith('/intake')) { intake = { body: JSON.parse(route.request().postData()), auth: route.request().headers()['authorization'] }; return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, url: '/stories/unmatchable-pompeii' }) }); }
    if (u.startsWith('https://www.thatlayover.life/submit')) return route.fulfill({ status: 200, contentType: 'text/html', body: page_(true) });
    return route.abort(); });
  await page.goto('https://www.thatlayover.life/submit'); await page.waitForTimeout(800);
  await page.evaluate(() => { const f = document.querySelector('form[data-tll-form="submit-story"]'); f.querySelector('textarea[name="body"]').value = 'I waited forty years.\nIts frescoes are among the most p'; f.querySelector('[name="name"]').value = 'Unmatchable Pompeii';
    window.__sub = 0; f.addEventListener('submit', e => { e.preventDefault(); window.__sub++; }); f.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true })); });
  ok(`${width}: first send stopped with a note`, await page.evaluate(() => window.__sub === 0 && /stop mid-sentence/.test((document.querySelector('.tll-end-note') || {}).textContent || '')));
  await page.evaluate(() => { const f = document.querySelector('form[data-tll-form="submit-story"]'); f.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true })); });
  ok(`${width}: second send goes through`, await page.evaluate(() => window.__sub === 1));
  await page.evaluate(() => { const t = document.querySelector('textarea[name="body"]'); t.value += 'owerful in the world.'; t.dispatchEvent(new Event('input', { bubbles: true })); });
  ok(`${width}: note goes away once finished`, await page.evaluate(() => !document.querySelector('.tll-end-note')));
  await page.evaluate(() => { const f = document.querySelector('form[data-tll-form="submit-story"]'); const h = document.createElement('input'); h.type = 'hidden'; h.name = 'hero-image'; h.value = 'https://res.cloudinary.com/x/hero.jpg'; f.appendChild(h);
    const d = (f.closest('.w-form') || f.parentNode).querySelector('.w-form-done'); d.style.display = 'block'; });
  await page.waitForTimeout(600);
  ok(`${width}: success sends the story to the Worker with the token`, intake && intake.body.kind === 'story' && intake.auth === 'Bearer tok' && intake.body.fields.name === 'Unmatchable Pompeii' && /powerful in the world\.$/.test(intake.body.fields.body) && intake.body.fields['hero-image'] === 'https://res.cloudinary.com/x/hero.jpg', JSON.stringify(intake && intake.body.fields).slice(0, 300));
  ok(`${width}: success box links to the live story`, await page.evaluate(() => { const a = document.querySelector('.tll-intake-msg a'); return !!a && a.getAttribute('href') === '/stories/unmatchable-pompeii'; }));
  ok(`${width}: no page errors`, !errs.length, errs.join(' | '));
  await page.close();
}
await browser.close(); console.log(res.join('\n')); console.log(res.filter(r => r.startsWith('PASS')).length + ' of ' + res.length + ' passed');
