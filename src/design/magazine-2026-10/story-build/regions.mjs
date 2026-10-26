// Element screenshots of the after page at 390 and 1280: the From line, an inline photo, the invite and sign-off, the gallery.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const SLUG = process.argv[2] || 'pantanal-glimmers-in-the-wild';
const base = fs.readFileSync(path.join(DIR, `fixture-${SLUG}.html`), 'utf8');
const html = base.replace('<!--LAYER-->', fs.readFileSync(path.join(DIR, 'tll-mag-story-v1.html'), 'utf8'));
const FONTS = path.join(ROOT, 'src/design/magazine-2026-10/type/fonts'); const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const GAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/design/magazine-2026-10/story', SLUG + '.json'), 'utf8'))['photo-gallery'] || [];
const face = (fam, style, w, file) => `@font-face{font-family:'${fam}';font-style:${style};font-weight:${w};src:url(http://tll.test/fonts/${file}.woff2) format('woff2')}`;
const FONTCSS = [face('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), face('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'), face('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), face('JetBrains Mono', 'normal', 400, 'jetbrains-mono-latin-400-normal'), face('JetBrains Mono', 'normal', 600, 'jetbrains-mono-latin-600-normal')].join('');
const b = await chromium.launch(); const errs = [];
for (const w of [390, 1280]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 }); p.on('pageerror', e => errs.push(w + ': ' + e.message));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('http://tll.test/css/')) return r.fulfill({ body: fs.readFileSync(path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop())), contentType: 'text/css' });
    if (u.startsWith('http://tll.test/fonts/')) { const f = path.join(FONTS, u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'font/woff2' }) : r.abort(); }
    if (u.startsWith('http://tll.test/')) return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: FONTCSS, contentType: 'text/css' });
    if (GAL.some(g => u === g.url) || /pantanal|jaguar/.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'pantanal-jaguar.jpg')), contentType: 'image/jpeg' });
    if (/nancy-carleton-avatar/.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'avatar-nancy.jpg')), contentType: 'image/jpeg' });
    return r.abort(); });
  await p.goto('http://tll.test/stories/' + SLUG).catch(() => {}); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); } }); await p.waitForTimeout(1500);
  for (const [name, sel] of [['from', '.tll-story-body > .st3-from'], ['inline', '.tll-story-body .tll-inline-photo'], ['end', '.tll-story-body .tll-persp-ask'], ['signoff', '.tll-signoff'], ['gallery', '.tll-story-gallery']]) {
    const el = await p.$(sel); if (!el) { console.log(w, name, 'not found'); continue; }
    await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
    const box = await el.evaluate(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y + window.scrollY, w: r.width, h: r.height }; });
    await p.screenshot({ path: path.join(DIR, 'shots', `region-${name}-${w}.png`), fullPage: true, clip: { x: 0, y: Math.max(0, box.y - 60), width: w, height: Math.min(1600, box.h + 140) } });
  }
  console.log(w, 'inline photos', await p.$$eval('.tll-inline-photo', e => e.length), 'captions', await p.$$eval('.tll-inline-photo figcaption', e => e.length), 'gallery tiles', await p.$$eval('.tll-gallery-link', e => e.length), 'from text', JSON.stringify(await p.$eval('.tll-story-body > .st3-from', e => e.innerText)));
  await p.close();
}
await b.close(); console.log('errors', errs.length ? errs : 'none');
