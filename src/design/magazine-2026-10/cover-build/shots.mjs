// Screenshots of the offline home stand-in before and after the cover layer, at 390 and 1280. Remote requests are served from local files or aborted.
// Usage: node shots.mjs   (BUNDLE=<built bundle> injects it as the header site script instead of the raw layer; AXE=<axe.min.js> runs checks on the hero)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const OUT = path.join(DIR, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const base = fs.readFileSync(path.join(DIR, 'fixture-home.html'), 'utf8');
const layer = process.env.BUNDLE ? '<script>' + fs.readFileSync(path.resolve(ROOT, process.env.BUNDLE), 'utf8') + '</script>' : fs.readFileSync(path.join(DIR, 'tll-mag-cover-v1.html'), 'utf8');
const FONTS = path.join(ROOT, 'src/design/magazine-2026-10/type/fonts'); const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const imgMap = Object.fromEntries(fs.readFileSync(path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/build.py'), 'utf8').match(/'([^']+)': '([^']+\.jpe?g)'/g).map(s => { const m = s.match(/'([^']+)': '([^']+)'/); return [m[1], m[2]]; }));
const face = (fam, style, w, file) => `@font-face{font-family:'${fam}';font-style:${style};font-weight:${w};src:url(http://tll.test/fonts/${file}.woff2) format('woff2')}`;
const FONTCSS = [face('Playfair Display', 'normal', 800, 'playfair-display-latin-800-normal'), face('Playfair Display', 'italic', 800, 'playfair-display-latin-800-italic'),
  face('JetBrains Mono', 'normal', 400, 'jetbrains-mono-latin-400-normal'), face('JetBrains Mono', 'normal', 600, 'jetbrains-mono-latin-600-normal'),
  face('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), face('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'),
  face('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), face('Inter Tight', 'italic', '100 900', 'inter-tight-latin-wght-italic'),
  face('IBM Plex Sans Condensed', 'normal', 400, 'ibm-plex-sans-condensed-latin-400-normal')].join('');
const b = await chromium.launch(); const errs = [];
for (const which of ['before', 'after']) for (const [w, h] of [[390, 844], [1280, 900]]) {
  const html = which === 'after' ? (process.env.BUNDLE ? base.replace('<head>', '<head>' + layer) : base.replace('<!--LAYER-->', layer)) : base;
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  p.on('pageerror', e => errs.push(which + ' ' + w + ': ' + e.message));
  await p.route('**/*', r => {
    const u = r.request().url();
    if (u.startsWith('http://tll.test/css/')) { const f = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'text/css' }) : r.abort(); }
    if (u.startsWith('http://tll.test/fonts/')) { const f = path.join(FONTS, u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'font/woff2' }) : r.abort(); }
    if (u.startsWith('http://tll.test/')) return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: FONTCSS, contentType: 'text/css' });
    if (/curacao/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'hero-curacao.jpg')), contentType: 'image/jpeg' });
    const key = Object.keys(imgMap).find(k => u.includes(k.split('/').pop().split('_')[0]));
    if (key) return r.fulfill({ body: fs.readFileSync(path.join(IMG, imgMap[key])), contentType: 'image/jpeg' });
    if (/\.(jpe?g|png|webp|avif)(\?|$)/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'pantanal-jaguar.jpg')), contentType: 'image/jpeg' });
    return r.abort();
  });
  await p.goto('http://tll.test/').catch(() => {}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1200);
  const m = await p.evaluate(() => { const hero = document.querySelector('[data-h3-hero]'); const r = hero.getBoundingClientRect(); const img = hero.querySelector('img'); const small = []; for (const e of hero.querySelectorAll('a,button')) { const b = e.getBoundingClientRect(); if (b.width && (b.width < 44 || b.height < 44)) small.push((e.textContent || '').trim().slice(0, 24) + ' ' + Math.round(b.width) + 'x' + Math.round(b.height)); } return { h: Math.round(r.height), img: img && img.src.split('/').pop().slice(0, 40), h1: getComputedStyle(hero.querySelector('h1')).fontFamily.slice(0, 20), over: document.documentElement.scrollWidth > innerWidth, small }; });
  console.log(which, w, JSON.stringify(m));
  await p.screenshot({ path: path.join(OUT, `home-${which}-${w}.png`), clip: { x: 0, y: 0, width: w, height: Math.min(m.h + 100, 1400) } });
  if (process.env.AXE && which === 'after') { await p.addScriptTag({ path: process.env.AXE }); const r = await p.evaluate(() => axe.run(document.querySelector('[data-h3-hero]'), { runOnly: ['color-contrast', 'target-size', 'image-alt', 'link-name', 'heading-order'] })); console.log('axe', w, r.violations.length ? r.violations.map(v => v.id + ': ' + v.nodes.slice(0, 4).map(x => x.target[0]).join(', ')) : 'none'); }
  await p.close();
}
await b.close(); console.log('errors:', errs.length ? errs : 'none');
