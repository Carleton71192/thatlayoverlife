// Before (v13 bundle) and after (v14) screenshots of the current-home stand-in for the 28 Oct UX brief.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../../..'); const OUT = path.join(DIR, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const base = fs.readFileSync(path.join(DIR, 'fixture-home-current.html'), 'utf8');
const FONTS = path.join(ROOT, 'src/design/magazine-2026-10/type/fonts'); const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const imgMap = Object.fromEntries(fs.readFileSync(path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/build.py'), 'utf8').match(/'([^']+)': '([^']+\.jpe?g)'/g).map(s => { const m = s.match(/'([^']+)': '([^']+)'/); return [m[1], m[2]]; }));
const face = (fam, style, w, file) => `@font-face{font-family:'${fam}';font-style:${style};font-weight:${w};src:url(http://tll.test/fonts/${file}.woff2) format('woff2')}`;
const FONTCSS = [face('Playfair Display', 'normal', 800, 'playfair-display-latin-800-normal'), face('Playfair Display', 'italic', 800, 'playfair-display-latin-800-italic'), face('JetBrains Mono', 'normal', 400, 'jetbrains-mono-latin-400-normal'), face('JetBrains Mono', 'normal', 600, 'jetbrains-mono-latin-600-normal'), face('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), face('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'), face('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), face('Inter Tight', 'italic', '100 900', 'inter-tight-latin-wght-italic'), face('IBM Plex Sans Condensed', 'normal', 400, 'ibm-plex-sans-condensed-latin-400-normal')].join('');
const b = await chromium.launch();
for (const [tag, bundle] of [['navnow', 'src/site-layers/tll-site-layers-v14.js'], ['navprop', 'src/site-layers/tll-site-layers-v14.js']])
for (const [w, h] of [[1440, 900]]) for (const mode of ['cover']) {
  const html = base.replace('<!--BUNDLE-->', '<script>' + fs.readFileSync(path.join(ROOT, bundle), 'utf8') + '</script>').replace('<!--LAYER-->', tag === 'navprop' ? '<style>' + fs.readFileSync(path.join(DIR, 'proposal-nav.css'), 'utf8') + '</style>' : '');
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.addInitScript(() => { Math.random = () => 0.42; });
  await p.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('http://tll.test/css/')) return r.fulfill({ body: fs.readFileSync(path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop())), contentType: 'text/css' });
    if (u.startsWith('http://tll.test/fonts/')) { const f = path.join(FONTS, u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'font/woff2' }) : r.abort(); }
    if (u === 'http://tll.test/' || u === 'http://tll.test/home-without-cover') return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: FONTCSS, contentType: 'text/css' });
    if (/curacao/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'hero-curacao.jpg')), contentType: 'image/jpeg' });
    const key = Object.keys(imgMap).find(k => u.includes(k.split('/').pop().split('_')[0])); if (key) return r.fulfill({ body: fs.readFileSync(path.join(IMG, imgMap[key])), contentType: 'image/jpeg' });
    if (/\.(jpe?g|png|webp|avif)(\?|$)/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'pantanal-jaguar.jpg')), contentType: 'image/jpeg' });
    return r.abort(); });
  await p.goto(mode === 'cover' ? 'http://tll.test/' : 'http://tll.test/home-without-cover').catch(() => {}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  await p.screenshot({ path: path.join(OUT, `${tag}-${w}.png`), clip: { x: 0, y: 0, width: w, height: 80 } }); await p.close(); continue;
  if (mode === 'cover') {
    await p.evaluate(() => { document.querySelectorAll('[data-h3="news"] .w-form-done').forEach(e => { e.style.display = 'block'; const f = e.parentElement.querySelector('form'); if (f) f.style.display = 'none'; });
      const n = document.getElementById('tll-note'); n.setAttribute('data-open', 'true'); n.querySelector('form').style.display = 'none'; n.querySelector('.w-form-done').style.display = 'block'; });
    for (const [sel, nm, pad] of [['[data-h3-dash] .h3-ctas', 'dash-free', 40], ['.h3-c2 .h3-ctas', 'founders-note', 40], ['.h3-ex-foot', 'expats-note', 40], ['[data-h3="news-in"]', 'news-done', 0], ['.h3-c5-ph figcaption', 'magnus-caption', 60]]) {
      const el = await p.$(sel); if (!el) { console.log('missing', sel); continue; } await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(250);
      const bb = await el.boundingBox(); await p.screenshot({ path: path.join(OUT, `${tag}-${w}-${nm}.png`), clip: { x: 0, y: Math.max(0, bb.y - pad), width: w, height: Math.min(bb.height + pad * 2, 700) } }); }
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300); const nb = await (await p.$('#tll-note')).boundingBox();
    await p.screenshot({ path: path.join(OUT, `${tag}-${w}-note-done.png`), clip: { x: 0, y: Math.max(0, nb.y - 20), width: Math.min(w, nb.width + 40), height: nb.height + 40 } });
  }
  await p.close(); console.log(tag, w, mode);
}
await b.close();
