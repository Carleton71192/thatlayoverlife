// Screenshots and checks for the phone prototype, offline (local photos and fonts).
// Usage: node shots.mjs [width]   (default 390). Writes shots/full-<w>.png, shots/screen-<w>-<n>.png and shots/sheet-<w>.png,
// then prints: page height, horizontal overflow, small tap targets, the tab test, and axe contrast violations if AXE is set.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const W = +(process.argv[2] || 390), H = 844;
const OUT = path.join(DIR, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(); const errs = [];
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
p.on('pageerror', e => errs.push(e.message)); p.on('requestfailed', r => errs.push('failed ' + r.url()));
await p.goto('file://' + path.join(DIR, 'home-phone-proto-local.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const m = await p.evaluate(() => {
  const small = [];
  for (const e of document.querySelectorAll('a,button,input,[role=tab]')) { const r = e.getBoundingClientRect(); if (r.width && (r.width < 44 || r.height < 44)) small.push((e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); }
  return { height: document.documentElement.scrollHeight, overflow: document.documentElement.scrollWidth > innerWidth, small };
});
console.log('width', W, 'page height', m.height, 'screens', (m.height / H).toFixed(1), 'horizontal overflow', m.overflow, 'small targets', m.small.length ? m.small : 'none');
await p.screenshot({ path: path.join(OUT, `full-${W}.png`), fullPage: true });
const n = Math.min(12, Math.ceil(m.height / H));
for (let i = 0; i < n; i++) { await p.evaluate(y => scrollTo(0, y), i * H); await p.waitForTimeout(150); await p.screenshot({ path: path.join(OUT, `screen-${W}-${i + 1}.png`) }); }
// tabs
await p.evaluate(() => scrollTo(0, 0));
const tabs = {};
for (const t of ['others', 'nancy', 'new']) { await p.click(`.tab[data-tab="${t}"]`); await p.waitForTimeout(100); tabs[t] = await p.evaluate(() => ({ cards: [...document.querySelectorAll('.card')].filter(c => !c.hidden).length, dots: document.querySelector('[data-dots]').children.length })); }
console.log('tabs', JSON.stringify(tabs));
// the row: does the next card peek in?
const peek = await p.evaluate(() => { const c = [...document.querySelectorAll('.card')].filter(c => !c.hidden); const r0 = c[0].getBoundingClientRect(), r1 = c[1].getBoundingClientRect(); return { first: Math.round(r0.width), peek: Math.round(innerWidth - r1.left) }; });
console.log('card width', peek.first, 'next card peeks', peek.peek + 'px');
if (process.env.AXE) {
  await p.addScriptTag({ path: process.env.AXE });
  const r = await p.evaluate(() => axe.run(document, { runOnly: ['color-contrast', 'target-size', 'image-alt', 'link-name', 'button-name', 'heading-order', 'label'] }));
  console.log('axe violations', r.violations.length ? r.violations.map(v => v.id + ': ' + v.nodes.map(x => x.target[0] + ' ' + (x.any[0]?.message || '').slice(0, 90)).join(' | ')) : 'none');
}
// contact sheet of the screens
const sheet = `<body style="margin:0;background:#1a1c2c;padding:24px;display:flex;gap:16px;align-items:flex-start">${Array.from({ length: n }, (_, i) => `<img src="screen-${W}-${i + 1}.png" style="width:${W / 2}px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.5)">`).join('')}</body>`;
fs.writeFileSync(path.join(OUT, 'sheet.html'), sheet);
const s = await b.newPage({ viewport: { width: n * (W / 2 + 16) + 32, height: H / 2 + 48 }, deviceScaleFactor: 2 });
await s.goto('file://' + path.join(OUT, 'sheet.html')); await s.waitForTimeout(300); await s.screenshot({ path: path.join(OUT, `sheet-${W}.png`), fullPage: true });
await b.close(); console.log('errors:', errs.length ? errs : 'none');
