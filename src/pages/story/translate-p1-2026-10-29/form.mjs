import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const layer = fs.readFileSync(path.join(ROOT, 'src/site-layers/tll-submit-lang-v1.js'), 'utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="max-width:640px;margin:20px auto;padding:0 16px;background:#F7F1E8;font-family:sans-serif">
<form data-tll-form="submit-story"><fieldset data-tll-step="1"><legend>The story</legend><label>Headline<input name="name"></label><label>Excerpt<textarea name="excerpt"></textarea></label><label>Body<textarea name="body"></textarea></label></fieldset><input type="submit" value="Send"></form><script>${layer}</script></body></html>`;
const b = await chromium.launch(); const out = {};
for (const [loc, w] of [['pt-BR', 390], ['da-DK', 1280], ['ja-JP', 1280]]) {
  const ctx = await b.newContext({ locale: loc, viewport: { width: w, height: 1000 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/*', r => r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' })); await p.goto('https://www.thatlayover.life/submit'); await p.waitForTimeout(200);
  out[loc] = await p.evaluate(() => { const fd = new FormData(document.querySelector('form')); return { lang: fd.get('story-language'), allow: fd.get('allow-translation'), englishBoxShown: !document.querySelector('.tll-sl details').hidden }; });
  if (loc === 'pt-BR') { await p.selectOption('select[name="story-language"]', 'en'); out.afterEnglish = await p.evaluate(() => ({ englishBoxShown: !document.querySelector('.tll-sl details').hidden })); await p.selectOption('select[name="story-language"]', 'pt-BR'); await p.screenshot({ path: path.join(DIR, 'submit-lang-390.png'), fullPage: true }); }
  out[loc].errs = errs; await ctx.close(); }
await b.close(); console.log(JSON.stringify(out));
