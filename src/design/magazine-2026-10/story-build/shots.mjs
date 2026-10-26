// Screenshots of the offline story fixture, before and after the magazine layer, at 390 and 1280.
// Remote requests are answered from local files (fonts, photos) or aborted; nothing leaves the sandbox.
// Usage: node shots.mjs [slug]   (AXE=<axe.min.js> adds the contrast and target checks on the after)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const SLUG = process.argv[2] || 'spain-madrid-wedding-ibiza';
const OUT = path.join(DIR, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const base = fs.readFileSync(path.join(DIR, `fixture-${SLUG}.html`), 'utf8');
const layer = process.env.BUNDLE ? '<script>' + fs.readFileSync(path.resolve(ROOT, process.env.BUNDLE), 'utf8') + '</script>' : fs.readFileSync(path.join(DIR, 'tll-mag-story-v1.html'), 'utf8');
const FONTS = path.join(ROOT, 'src/design/magazine-2026-10/type/fonts');
const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const imgMap = Object.fromEntries(fs.readFileSync(path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/build.py'), 'utf8').match(/'([^']+)': '([^']+\.jpe?g)'/g).map(s => { const m = s.match(/'([^']+)': '([^']+)'/); return [m[1], m[2]]; }));
const face = (fam, style, w, file) => `@font-face{font-family:'${fam}';font-style:${style};font-weight:${w};src:url(http://tll.test/fonts/${file}.woff2) format('woff2')}`;
const FONTCSS = [face('Playfair Display', 'normal', 800, 'playfair-display-latin-800-normal'), face('Playfair Display', 'italic', 800, 'playfair-display-latin-800-italic'),
  face('JetBrains Mono', 'normal', 400, 'jetbrains-mono-latin-400-normal'), face('JetBrains Mono', 'normal', 600, 'jetbrains-mono-latin-600-normal'),
  face('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), face('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'),
  face('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), face('Inter Tight', 'italic', '100 900', 'inter-tight-latin-wght-italic'),
  face('IBM Plex Sans Condensed', 'normal', 400, 'ibm-plex-sans-condensed-latin-400-normal')].join('');
const b = await chromium.launch(); const errs = [];
for (const which of ['before', 'after']) for (const [w, h] of [[390, 844], [1280, 900]]) {
  const html = which === 'after' ? (process.env.BUNDLE ? base.replace('<!-- SITE HEAD CODE (Webflow site settings) -->', layer + '<!-- SITE HEAD CODE (Webflow site settings) -->') : base.replace('<!--LAYER-->', layer)) : base;
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  p.on('pageerror', e => errs.push(which + ' ' + w + ': ' + e.message));
  await p.route('**/*', r => {
    const u = r.request().url();
    if (u.startsWith('http://tll.test/css/')) return r.fulfill({ body: fs.readFileSync(path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop())), contentType: 'text/css' });
    if (u.startsWith('http://tll.test/fonts/')) { const f = path.join(FONTS, u.split('/').pop()); if (!fs.existsSync(f)) return r.abort(); return r.fulfill({ body: fs.readFileSync(path.join(FONTS, u.split('/').pop())), contentType: 'font/woff2' }); }
    if (u.startsWith('http://tll.test/')) return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
    if (u.startsWith('file://')) return r.continue();
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: FONTCSS, contentType: 'text/css' });
    const key = Object.keys(imgMap).find(k => u.includes(k.split('/').pop().split('_')[0]));
    if (key) return r.fulfill({ body: fs.readFileSync(path.join(IMG, imgMap[key])), contentType: 'image/jpeg' });
    return r.abort();
  });
  await p.goto('http://tll.test/stories/' + SLUG).catch(() => {}); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } scrollTo(0, 0); }); await p.waitForTimeout(900);
  const m = await p.evaluate(() => { const small = []; for (const e of document.querySelectorAll('article a,article button')) { const r = e.getBoundingClientRect(); if (r.width && (r.width < 44 || r.height < 44)) small.push((e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 24) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); } return { h: document.documentElement.scrollHeight, over: document.documentElement.scrollWidth > innerWidth, small, font: getComputedStyle(document.querySelector('h1')).fontFamily.slice(0, 30) }; });
  console.log(which, w, 'height', m.h, 'overflow', m.over, 'h1 font', m.font, 'small', m.small.length ? m.small.slice(0, 8) : 'none');
  await p.screenshot({ path: path.join(OUT, `${SLUG}-${which}-${w}.png`), fullPage: true });
  if (process.env.AXE && which === 'after') { await p.addScriptTag({ path: process.env.AXE }); const r = await p.evaluate(() => axe.run(document.querySelector('article') || document, { runOnly: ['color-contrast', 'target-size', 'image-alt', 'link-name', 'heading-order'] })); console.log('axe', w, r.violations.length ? r.violations.map(v => v.id + ': ' + v.nodes.slice(0, 4).map(x => x.target[0]).join(', ')) : 'none'); }
  await p.close();
}
await b.close(); console.log('errors:', errs.length ? errs : 'none');
