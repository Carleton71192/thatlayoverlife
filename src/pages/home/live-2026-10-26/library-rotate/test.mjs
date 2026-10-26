// Home library rotation: the live 94ce12c0 embed before and after. Loads the page 8 times with different random seeds.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url));
const which = process.argv[2] || 'after';
const embed = fs.readFileSync(path.join(DIR, `embed-94ce12c0-${which}.html`), 'utf8');
const b = await chromium.launch(); const firsts = new Set(); let orderOk = true, chipOk = true, errs = [];
for (let i = 0; i < 8; i++) {
  const p = await b.newPage({ viewport: { width: 390, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(s => { let x = s; Math.random = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }, i * 7919 + 1);
  await p.route('**/*', r => r.request().url().startsWith('http://tll.test/') ? r.fulfill({ body: `<!doctype html><html><body><div class="h3-chips" data-h3-chips><button data-p="" aria-pressed="true">All</button></div>${embed}</body></html>`, contentType: 'text/html' }) : r.abort());
  await p.goto('http://tll.test/').catch(() => {}); await p.waitForTimeout(400);
  const s = await p.evaluate(() => { const v = [...document.querySelectorAll('[data-h3-track] .h3-card')].filter(c => !c.hidden);
    const ph = c => !!((c.querySelector('.h3-card-ph img') || {}).getAttribute && (c.querySelector('.h3-card-ph img').getAttribute('src') || '').trim());
    return { shown: v.map(c => c.getAttribute('href')), photos: v.map(ph), nancy: v.map(c => c.getAttribute('data-by') === 'Nancy Carleton') }; });
  firsts.add(s.shown.join(','));
  const lastPhoto = s.photos.lastIndexOf(true), firstNo = s.photos.indexOf(false); if (firstNo > -1 && firstNo < lastPhoto) orderOk = false;
  const chip = await p.$('[data-h3-chips] [data-p]:not([data-p=""])');
  if (chip) { await chip.click(); const d = await p.evaluate(() => [...document.querySelectorAll('[data-h3-track] .h3-card')].filter(c => !c.hidden).map(c => c.getAttribute('data-date') || '')); if (i === 0) console.log('chip view dates:', d.join(' ')); }
  if (i === 0) console.log('cards on page:', await p.evaluate(() => document.querySelectorAll('[data-h3-track] .h3-card').length), 'shown:', s.shown.length);
  await p.close();
}
await b.close();
console.log(which, 'distinct six-card sets over 8 visits:', firsts.size, '| photos-first order kept:', orderOk, '| errors:', errs.length ? errs : 'none');
process.exit(which === 'after' && (firsts.size < 3 || !orderOk || errs.length) ? 1 : 0);
