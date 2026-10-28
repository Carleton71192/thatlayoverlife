// Offline measurements and screenshots of the current-home stand-in for the 28 Oct UX brief.
// Usage: node measure.mjs [tag]   env AFTER=<css/js file list, comma separated> injects the staged fixes; SHOTS=1 saves screenshots.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../../..');
const TAG = process.argv[2] || 'before'; const OUT = path.join(DIR, 'shots'); fs.mkdirSync(OUT, { recursive: true });
let html = fs.readFileSync(path.join(DIR, 'fixture-home-current.html'), 'utf8');
const bundle = fs.readFileSync(path.join(ROOT, process.env.BUNDLE || 'src/site-layers/tll-site-layers-v13.js'), 'utf8');
html = html.replace('<!--BUNDLE-->', '<script>' + bundle + '</script>');
if (process.env.AFTER) html = html.replace('<!--LAYER-->', process.env.AFTER.split(',').map(f => fs.readFileSync(path.resolve(ROOT, f), 'utf8')).join('\n'));
const FONTS = path.join(ROOT, 'src/design/magazine-2026-10/type/fonts'); const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const imgMap = Object.fromEntries(fs.readFileSync(path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/build.py'), 'utf8').match(/'([^']+)': '([^']+\.jpe?g)'/g).map(s => { const m = s.match(/'([^']+)': '([^']+)'/); return [m[1], m[2]]; }));
const face = (fam, style, w, file) => `@font-face{font-family:'${fam}';font-style:${style};font-weight:${w};src:url(http://tll.test/fonts/${file}.woff2) format('woff2')}`;
const FONTCSS = [face('Playfair Display', 'normal', 800, 'playfair-display-latin-800-normal'), face('Playfair Display', 'italic', 800, 'playfair-display-latin-800-italic'),
  face('JetBrains Mono', 'normal', 400, 'jetbrains-mono-latin-400-normal'), face('JetBrains Mono', 'normal', 600, 'jetbrains-mono-latin-600-normal'),
  face('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), face('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'),
  face('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), face('Inter Tight', 'italic', '100 900', 'inter-tight-latin-wght-italic'),
  face('IBM Plex Sans Condensed', 'normal', 400, 'ibm-plex-sans-condensed-latin-400-normal')].join('');
const b = await chromium.launch(); const res = {};
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 }); const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 120)));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('http://tll.test/css/')) { const f = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'text/css' }) : r.abort(); }
    if (u.startsWith('http://tll.test/fonts/')) { const f = path.join(FONTS, u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'font/woff2' }) : r.abort(); }
    if (u === 'http://tll.test/' ) return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
    if (u.startsWith('http://tll.test/')) return r.fulfill({ status: 404, body: '' });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: FONTCSS, contentType: 'text/css' });
    if (u.includes('cookieconsent') && u.endsWith('.js')) return r.fulfill({ body: fs.readFileSync('/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/adtest/node_modules/vanilla-cookieconsent/dist/cookieconsent.umd.js'), contentType: 'application/javascript' });
    if (u.includes('cookieconsent') && u.endsWith('.css')) return r.fulfill({ body: fs.readFileSync('/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/adtest/node_modules/vanilla-cookieconsent/dist/cookieconsent.css'), contentType: 'text/css' });
    if (/curacao/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'hero-curacao.jpg')), contentType: 'image/jpeg' });
    const key = Object.keys(imgMap).find(k => u.includes(k.split('/').pop().split('_')[0]));
    if (key) return r.fulfill({ body: fs.readFileSync(path.join(IMG, imgMap[key])), contentType: 'image/jpeg' });
    if (/\.(jpe?g|png|webp|avif)(\?|$)/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'pantanal-jaguar.jpg')), contentType: 'image/jpeg' });
    return r.abort(); });
  await p.goto('http://tll.test/').catch(() => {}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  if (process.env.SHOTS) {
    await p.screenshot({ path: path.join(OUT, `${TAG}-${w}-first.png`) });
  }
  // small text: every visible element with its own text under 14px
  const small = await p.evaluate(() => { const out = []; const seen = new Set();
    for (const el of document.querySelectorAll('body *')) { if (el.closest('#cc-main,script,style,noscript,[hidden]')) continue;
      const own = [...el.childNodes].filter(n => n.nodeType === 3 && n.nodeValue.trim()).map(n => n.nodeValue.trim()).join(' ');
      if (!own) continue; const cs = getComputedStyle(el); const fs = parseFloat(cs.fontSize); const r = el.getBoundingClientRect();
      if (fs >= 14 || !r.width || !r.height || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      let hid = false; for (let x = el; x; x = x.parentElement) { const c = getComputedStyle(x); if (c.display === 'none' || c.visibility === 'hidden') { hid = true; break; } } if (hid) continue;
      const key = own.slice(0, 50) + fs; if (seen.has(key)) continue; seen.add(key);
      out.push({ px: fs, text: own.slice(0, 70), tag: el.tagName.toLowerCase(), cls: (el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0, 40), sec: (el.closest('section,footer,nav,header,[data-h3-hero]') || {}).className?.toString().slice(0, 30) || '' }); }
    return out; });
  // note pill vs hero
  const pill = await p.evaluate(() => { const n = document.querySelector('#tll-note .tll-note-pill'); const hero = document.querySelector('[data-h3-hero]'); if (!n) return null; const r = n.getBoundingClientRect(); const cs = getComputedStyle(document.getElementById('tll-note'));
    const hits = []; if (cs.display !== 'none' && r.width) for (const e of hero.querySelectorAll('h1,p,a,.h3-hero-coords,figcaption')) { const b = e.getBoundingClientRect(); if (b.width && !(b.right < r.left || b.left > r.right || b.bottom < r.top || b.top > r.bottom)) hits.push((e.textContent || '').trim().slice(0, 40)); }
    return { shown: cs.display !== 'none' && cs.opacity !== '0' && r.width > 0, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], name: n.getAttribute('aria-label') || n.textContent.trim(), covers: hits }; });
  // contrast of named items, success messages forced visible
  await p.evaluate(() => { document.querySelectorAll('[data-h3="news"] .w-form-done, #tll-note .w-form-done').forEach(e => { e.style.display = 'block'; }); const n = document.getElementById('tll-note'); if (n) n.setAttribute('data-open', 'true'); });
  await p.addScriptTag({ path: path.join(ROOT, '../../tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/axe/node_modules/axe-core/axe.min.js') }).catch(async () => await p.addScriptTag({ path: '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/axe/node_modules/axe-core/axe.min.js' }));
  const ax = await p.evaluate(async () => { const r = await axe.run(document, { runOnly: ['color-contrast'] }); return r.violations.flatMap(v => v.nodes.map(n => ({ t: (n.target || []).join(' ').slice(0, 60), d: (n.any[0] && n.any[0].data) ? [n.any[0].data.contrastRatio, n.any[0].data.fgColor, n.any[0].data.bgColor, n.any[0].data.fontSize] : null, html: n.html.slice(0, 90) }))); });
  if (process.env.SHOTS) {
    for (const [sel, nm] of [['[data-h3="news"]', 'news-done'], ['#tll-note', 'note-open'], ['.h3-ex-foot', 'expats-foot']]) { const el = await p.$(sel); if (el) { await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await el.screenshot({ path: path.join(OUT, `${TAG}-${w}-${nm}.png`) }).catch(() => {}); } }
  }
  res[w] = { small, pill, contrast: ax, errs };
  await p.close();
}
await b.close(); fs.writeFileSync(path.join(OUT, `${TAG}.json`), JSON.stringify(res, null, 1));
for (const w of Object.keys(res)) { console.log('==', w, 'small text items', res[w].small.length, 'pill', JSON.stringify(res[w].pill), 'contrast fails', res[w].contrast.length, 'errors', res[w].errs.length); }
