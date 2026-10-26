// Home hero coordinates on a phone, with the LIVE 20 Oct coordinates embed (de5cdec9) in place of the 13 Oct copy.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const R = path.resolve(DIR, '../../..');
let h = fs.readFileSync(R + '/handoff/claude-design-source/webflow-export-2026-10-13/pages/index.html', 'utf8');
const live = fs.readFileSync(R + '/src/pages/home/live-2026-10-26/embeds/de5cdec9.html', 'utf8');
h = h.replace(/<p class="h3 h3-hero-side"[\s\S]*?<\/style>/, live);
const hero = fs.readFileSync(R + '/src/pages/home/tll-home-hero-phone-v1.html', 'utf8');
h = h.replace(/<p class="h3 h3-hero-free">[\s\S]*?<div class="h3 h3-hero-cta">[\s\S]*?<\/div>/, '<div class="h3 h3-hero-cta"><a class="h3-btn h3-btn-rose" href="/stories">Read the stories →</a><a class="h3-btn h3-btn-line" href="/the-map">Build your free map</a></div><p class="h3 h3-hero-free">Free, forever. No card, no paywall.</p>' + hero);
if (process.env.EXTRA) h = h.replace('</head>', fs.readFileSync(process.env.EXTRA, 'utf8') + '</head>');
const b = await chromium.launch(); let bad = 0;
for (const w of [390, 360, 320]) {
  const p = await b.newPage({ viewport: { width: w, height: 844 } });
  await p.route('**/*', r => r.request().url().startsWith('http://tll.test/') ? r.fulfill({ body: h, contentType: 'text/html' }) : r.abort());
  await p.goto('http://tll.test/').catch(() => {}); await p.waitForTimeout(800);
  const m = await p.evaluate(() => { const c = document.querySelector('.h3-hero-coords'), hero = document.querySelector('[data-h3-hero]'); const r = c.getBoundingClientRect(), hr = hero.getBoundingClientRect(); return { pos: getComputedStyle(c).position, right: Math.round(innerWidth - r.right), top: Math.round(r.top - hr.top), overflow: c.scrollWidth > c.clientWidth + 1 }; });
  const ok = m.pos === 'absolute' && m.right >= 15 && !m.overflow && m.top < 40;
  console.log(w, ok ? 'PASS' : 'FAIL', JSON.stringify(m)); if (!ok) bad++;
  if (w === 390) await p.screenshot({ path: path.join(DIR, `../coords-390-${process.env.EXTRA ? 'after' : 'before'}.png`), clip: { x: 0, y: 0, width: 390, height: 260 } });
  await p.close();
}
await b.close(); process.exit(bad);
