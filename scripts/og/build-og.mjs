// Renders 1200x630 Open Graph cards from scripts/og/pages.json with Playwright. Photos and fonts come from the scratchpad (not committed).
import fs from 'node:fs'; import path from 'node:path';
const S = process.env.OG_SCRATCH; const out = process.env.OG_OUT || path.join(S, 'og', 'out');
const { chromium } = await import(process.env.PW || 'playwright');
fs.mkdirSync(out, { recursive: true });
const pages = JSON.parse(fs.readFileSync('scripts/og/pages.json', 'utf8'));
const tpl = fs.readFileSync('scripts/og/template.html', 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const head = (h) => esc(h).replace(/\|([^|]+)\|/g, '<em>$1</em>');
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const p of pages) {
  const photoFile = p.photo ? fs.readdirSync(path.join(S, 'og/photos-s')).find((f) => f.startsWith(p.photo)) : null;
  const photoData = photoFile ? 'data:image/jpeg;base64,' + fs.readFileSync(path.join(S, 'og/photos-s', photoFile)).toString('base64') : '';
  const html = tpl.replace('FONTS_CSS', 'file://' + path.join(S, 'og/fonts/fonts.css')).replace('CLASS', photoFile ? 'with-photo' : 'plain')
    .replace('POS', p.pos || '50% 50%').replace('PHOTO', photoData)
    .replace('EYEBROW', esc(p.eyebrow)).replace('HEADLINE', head(p.h));
  await page.setContent(html, { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(out, `og-${p.slug}.png`), type: 'png' });
  console.log('ok', p.slug);
}
await browser.close();
