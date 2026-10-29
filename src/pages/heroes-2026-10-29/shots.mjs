// Before/after screenshots of the five stand-ins. Usage: TAG=before BUNDLE=src/site-layers/tll-site-layers-v14.js node shots.mjs [page ...]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../..');
const TAG = process.env.TAG || 'before'; const OUT = path.join(DIR, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const bundle = fs.readFileSync(path.join(ROOT, process.env.BUNDLE || 'src/site-layers/tll-site-layers-v14.js'), 'utf8');
const FONTS = path.join(ROOT, 'src/design/magazine-2026-10/type/fonts'); const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const imgMap = Object.fromEntries(fs.readFileSync(path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/build.py'), 'utf8').match(/'([^']+)': '([^']+\.jpe?g)'/g).map(s => { const m = s.match(/'([^']+)': '([^']+)'/); return [m[1], m[2]]; }));
const face = (fam, style, w, file) => `@font-face{font-family:'${fam}';font-style:${style};font-weight:${w};src:url(http://tll.test/fonts/${file}.woff2) format('woff2')}`;
const FONTCSS = [face('Playfair Display', 'normal', 800, 'playfair-display-latin-800-normal'), face('Playfair Display', 'italic', 800, 'playfair-display-latin-800-italic'), face('JetBrains Mono', 'normal', 400, 'jetbrains-mono-latin-400-normal'), face('JetBrains Mono', 'normal', 600, 'jetbrains-mono-latin-600-normal'), face('JetBrains Mono', 'normal', 700, 'jetbrains-mono-latin-600-normal'), face('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), face('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'), face('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), face('IBM Plex Sans Condensed', 'normal', '400 700', 'ibm-plex-sans-condensed-latin-400-normal')].join('');
const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : ['for-expats', 'stories', 'travelers', 'the-map', 'about'];
const b = await chromium.launch(); const report = {};
for (const page of PAGES) for (const [w, h] of [[390, 844], [1440, 900]]) {
  const html = fs.readFileSync(path.join(DIR, 'fixtures', page + '.html'), 'utf8').replace('<!--BUNDLE-->', '<script>' + bundle + '</script>');
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 }); const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 140)));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('http://tll.test/css/')) { const f = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'text/css' }) : r.abort(); }
    if (u.startsWith('http://tll.test/fonts/')) { const f = path.join(FONTS, u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'font/woff2' }) : r.abort(); }
    if (u === 'http://tll.test/' + page) return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
    if (u.startsWith('http://tll.test/')) return r.fulfill({ status: 404, body: '' });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: FONTCSS, contentType: 'text/css' });
    const key = Object.keys(imgMap).find(k => decodeURIComponent(decodeURIComponent(u)).includes(decodeURIComponent(decodeURIComponent(k.split('/').pop())).split('_').pop().slice(0, 18)) || u.includes(k.split('/').pop().split('_')[0]));
    if (key) return r.fulfill({ body: fs.readFileSync(path.join(IMG, imgMap[key])), contentType: 'image/jpeg' });
    if (/\.(jpe?g|png|webp|avif)(\?|$)/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'montenegro-coast.jpg')), contentType: 'image/jpeg' });
    return r.abort(); });
  await p.goto('http://tll.test/' + page).catch(() => {}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  await p.screenshot({ path: path.join(OUT, `${TAG}-${page}-${w}.png`) });
  if (process.env.FULL) await p.screenshot({ path: path.join(OUT, `${TAG}-${page}-${w}-full.png`), fullPage: true });
  if (process.env.AXE) { await p.addScriptTag({ content: fs.readFileSync(process.env.AXE, 'utf8') }); report[page + '-' + w + '-axe'] = await p.evaluate(async () => { const r = await axe.run(document, { runOnly: ['color-contrast', 'image-alt', 'link-name', 'list', 'listitem', 'aria-allowed-attr', 'nested-interactive', 'scrollable-region-focusable'] }); return r.violations.map(v => [v.id, v.nodes.length, v.nodes.filter(n => /tll-ph|tll-mg-join/.test(n.html)).map(n => n.html.slice(0, 90) + ' | ' + (n.any[0] || {}).message)]); }); }
  if (process.env.MEASURE) report[page + '-' + w + '-m'] = await p.evaluate(sel => Array.from(document.querySelectorAll(sel)).slice(0, 12).map(e => { const r = e.getBoundingClientRect(), c = getComputedStyle(e); return [e.tagName + '.' + (e.className || '').toString().slice(0, 40), Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), c.display, c.maxWidth, c.padding, c.backgroundColor]; }), process.env.MEASURE);
  report[page + '-' + w] = await p.evaluate(() => ({ over: document.documentElement.scrollWidth > innerWidth, h1: (document.querySelector('h1') || {}).textContent }));
  report[page + '-' + w].errs = errs; await p.close();
}
await b.close(); console.log(JSON.stringify(report));
