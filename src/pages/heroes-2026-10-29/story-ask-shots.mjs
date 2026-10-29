// The end of a story page, before (v14) and after (v15: the end-of-story ask). Run: node story-ask-shots.mjs [slug]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR0 = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR0, '../../..'); const DIR = path.join(ROOT, 'src/design/magazine-2026-10/story-build');
const SLUG = process.argv[2] || 'pantanal-glimmers-in-the-wild';
const base = fs.readFileSync(path.join(DIR, `fixture-${SLUG}.html`), 'utf8');

const FONTS = path.join(ROOT, 'src/design/magazine-2026-10/type/fonts'); const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const GAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/design/magazine-2026-10/story', SLUG + '.json'), 'utf8'))['photo-gallery'] || [];
const face = (fam, style, w, file) => `@font-face{font-family:'${fam}';font-style:${style};font-weight:${w};src:url(http://tll.test/fonts/${file}.woff2) format('woff2')}`;
const FONTCSS = [face('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), face('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'), face('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), face('JetBrains Mono', 'normal', 400, 'jetbrains-mono-latin-400-normal'), face('JetBrains Mono', 'normal', 600, 'jetbrains-mono-latin-600-normal')].join('');
const b = await chromium.launch(); const errs = [];
for (const [tag, bundle] of [['before', 'src/site-layers/tll-site-layers-v14.js'], ['after', 'src/site-layers/tll-site-layers-v15.js']])
for (const w of [390, 1440]) {
  const html = base.replace('<!--LAYER-->', '<script>' + fs.readFileSync(path.join(ROOT, bundle), 'utf8') + '</script>');
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 }); p.on('pageerror', e => errs.push(w + ': ' + e.message));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('http://tll.test/css/')) return r.fulfill({ body: fs.readFileSync(path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop())), contentType: 'text/css' });
    if (u.startsWith('http://tll.test/fonts/')) { const f = path.join(FONTS, u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'font/woff2' }) : r.abort(); }
    if (u.startsWith('http://tll.test/')) return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: FONTCSS, contentType: 'text/css' });
    if (/\.(jpe?g|png)/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'pantanal-jaguar.jpg')), contentType: 'image/jpeg' });
    return r.abort(); });
  await p.goto('http://tll.test/stories/' + SLUG).catch(() => {}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1200);
  const el = await p.$('.tll-story-share-row'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
  const bb = await el.boundingBox(); await p.screenshot({ path: path.join(DIR0, 'shots', `${tag}-story-end-${w}.png`), clip: { x: 0, y: Math.max(0, bb.y - 260), width: w, height: 560 } });
  console.log(tag, w, await p.evaluate(() => { const a = document.querySelector('.tll-sa'); return a ? a.textContent : null; }));
  await p.close(); }
await b.close(); console.log(errs.filter(e => !/CookieConsent/.test(e)));
