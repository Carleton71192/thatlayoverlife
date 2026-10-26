// Chapter 04 (Paw Passport) at phone width: the live home styles (84f7180f) plus the chapter embed, before and after.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const R = path.resolve(DIR, '../../../../..');
const base = fs.readFileSync(path.join(DIR, '../embeds/84f7180f.html'), 'utf8');
const photo = fs.readFileSync(R + '/handoff/claude-design-source/v3/images/magnus-holi-side.jpg');
const b = await chromium.launch();
for (const which of ['before', 'after']) {
  const emb = fs.readFileSync(path.join(DIR, `embed-a4c1009d-${which}.html`), 'utf8');
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://tll.test/')) return r.fulfill({ body: `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#fff">${base}<div class="w-embed">${emb}</div><script>document.querySelectorAll('[data-h3-mag]').forEach(e=>e.textContent='14')</script></body></html>`, contentType: 'text/html' }); if (r.request().resourceType() === 'image') return r.fulfill({ body: photo, contentType: 'image/jpeg' }); return r.abort(); });
  await p.goto('http://tll.test/').catch(() => {}); await p.waitForTimeout(600);
  const m = await p.evaluate(() => ({ eyebrows: [...document.querySelectorAll('.h3-c5-panel .h3-ey')].map(e => e.textContent.trim()), caption: document.querySelector('.h3-c5-ph figcaption').textContent.trim(), capOverflow: (() => { const c = document.querySelector('.h3-c5-ph figcaption').getBoundingClientRect(); return c.right > innerWidth - 8; })() }));
  console.log(which, JSON.stringify(m));
  await (await p.$('.h3-c5')).screenshot({ path: path.join(DIR, `ch04-390-${which}.png`) });
  await p.close();
}
await b.close();
