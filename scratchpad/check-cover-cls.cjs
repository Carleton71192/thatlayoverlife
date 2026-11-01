// Offline check of the home cover's layout shift and loading attributes (1 Nov 2026). Mirrors the v16 bundle: the cover's font link and
// style go into the head before the body is parsed, the script runs later. For each width the page is measured with the style in place
// but the script not yet run, then the script is added and the page measured again; the first element after the hero must not move by
// more than 2px. The cover img must carry fetchpriority=high, loading=eager and decoding=async, a preload link must exist for it, the chip
// avatar (eager, above the fold) must keep its original file, and every other image the cover layer inserts must be lazy or low priority.
// Variants (the lazy people faces) are checked twice: served, and answered with 404 so the one-time fallback to the original is exercised.
// Remote requests are served from local files or aborted.
// Usage (from the repo root): node scratchpad/check-cover-cls.cjs
//   COVER=<cover html> (default the built tll-mag-cover-v1.html)  TAG=<name for the screenshots, default after>
//   COMPARE=<tag> diffs this run's screenshots against an earlier run saved under that tag (pixel count and bounding box; python3 with Pillow)
//   STYLE=body puts the cover style at the end of the body instead of the head (the pre-v16 placement and the approved final state), for a before run
// After the script has run, the style is moved from the head to the end of the body, as the bundle does at DOMContentLoaded, and nothing may move then either.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'src/design/magazine-2026-10/cover-build');
const COVER = path.resolve(ROOT, process.env.COVER || path.join(DIR, 'tll-mag-cover-v1.html'));
const TAG = process.env.TAG || 'after'; const OUT = path.join(ROOT, 'scratchpad/shots-cls'); fs.mkdirSync(OUT, { recursive: true });
const base = fs.readFileSync(path.join(DIR, 'fixture-home.html'), 'utf8');
const cov = fs.readFileSync(COVER, 'utf8');
const css = /<style id="tll-mag-cover-v1">\n([\s\S]*?)<\/style>/.exec(cov)[1];
const js = /<script id="tll-mag-cover-js-v1">\n([\s\S]*?)<\/script>/.exec(cov)[1];
const font = /<link rel="stylesheet" href="([^"]+)">/.exec(cov)[1];
const STYLE = '<link rel="stylesheet" href="' + font + '"><style id="tll-mag-cover-v1">\n' + css + '</style>';
const html = process.env.STYLE === 'body' ? base.replace('<!--LAYER-->', STYLE) : base.replace('<head>', '<head>' + STYLE);
const FONTS = path.join(ROOT, 'src/design/magazine-2026-10/type/fonts'); const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const imgMap = Object.fromEntries(fs.readFileSync(path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/build.py'), 'utf8').match(/'([^']+)': '([^']+\.jpe?g)'/g).map(s => { const m = s.match(/'([^']+)': '([^']+)'/); return [m[1], m[2]]; }));
const face = (fam, style, w, file) => `@font-face{font-family:'${fam}';font-style:${style};font-weight:${w};src:url(http://tll.test/fonts/${file}.woff2) format('woff2')}`;
const FONTCSS = [face('Playfair Display', 'normal', 800, 'playfair-display-latin-800-normal'), face('Playfair Display', 'italic', 800, 'playfair-display-latin-800-italic'),
  face('JetBrains Mono', 'normal', 400, 'jetbrains-mono-latin-400-normal'), face('JetBrains Mono', 'normal', 600, 'jetbrains-mono-latin-600-normal'),
  face('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), face('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'),
  face('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), face('Inter Tight', 'italic', '100 900', 'inter-tight-latin-wght-italic'),
  face('IBM Plex Sans Condensed', 'normal', 400, 'ibm-plex-sans-condensed-latin-400-normal')].join('');
let fails = 0; const ok = (cond, msg) => { console.log((cond ? '  PASS ' : '  FAIL ') + msg); if (!cond) fails++; };
const measure = () => { const hero = document.querySelector('[data-h3-hero]'); const sy = window.scrollY; const top = e => Math.round((e.getBoundingClientRect().top + sy) * 10) / 10;
  const words = hero.querySelector('h1').parentElement; let after = null, seen = false; const it = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT); let n;
  while ((n = it.nextNode())) { if (n === hero) { seen = true; continue; } if (!seen || hero.contains(n)) continue; if (n.getBoundingClientRect().height > 0) { after = n; break; } }
  return { heroH: Math.round(hero.getBoundingClientRect().height), words: top(words), h1: top(hero.querySelector('h1')), next: top(hero.nextElementSibling), after: after ? top(after) : null,
    afterIs: after ? after.tagName + '.' + String(after.className).slice(0, 24) : null, doc: document.documentElement.scrollHeight }; };
(async () => {
  const b = await chromium.launch();
  for (const variants of ['served', '404']) for (const [w, h] of [[390, 844], [1440, 900]]) {
    console.log(`\n${TAG} ${w}x${h}, variants ${variants}`);
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }); const reqs = [];
    await p.route('**/*', r => { const u = r.request().url(); reqs.push(u);
      if (u.startsWith('http://tll.test/css/')) { const f = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'text/css' }) : r.abort(); }
      if (u.startsWith('http://tll.test/fonts/')) { const f = path.join(FONTS, u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'font/woff2' }) : r.abort(); }
      if (u.startsWith('http://tll.test/')) return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
      if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: FONTCSS, contentType: 'text/css' });
      if (variants === '404' && /-p-\d+\.(jpe?g|png)$/i.test(u)) return r.fulfill({ status: 404, body: 'no variant' });
      if (/avatar/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'avatar-nancy.jpg')), contentType: 'image/jpeg' });
      if (/curacao/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'hero-curacao.jpg')), contentType: 'image/jpeg' });
      const key = Object.keys(imgMap).find(k => u.includes(k.split('/').pop().split('_')[0]));
      if (key) return r.fulfill({ body: fs.readFileSync(path.join(IMG, imgMap[key])), contentType: 'image/jpeg' });
      if (/\.(jpe?g|png|webp|avif)(\?|$)/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'pantanal-jaguar.jpg')), contentType: 'image/jpeg' });
      return r.abort(); });
    await p.goto('http://tll.test/').catch(() => {}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    const before = await p.evaluate(measure);
    if (variants === 'served') await p.screenshot({ path: path.join(OUT, `${TAG}-${w}-prerun.png`), clip: { x: 0, y: 0, width: w, height: Math.min(before.heroH + 60, h + 400) } });
    await p.addScriptTag({ content: js });
    await p.waitForSelector('[data-h3-hero][data-tll-cover]'); await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => Promise.all([].map.call(document.querySelectorAll('[data-h3-hero] img'), i => i.complete ? null : new Promise(res => { i.addEventListener('load', res); i.addEventListener('error', res); }))));
    await p.waitForTimeout(800);
    const after = await p.evaluate(measure);
    console.log('  pre-run ', JSON.stringify(before)); console.log('  post-run', JSON.stringify(after));
    const d = k => Math.abs(after[k] - before[k]);
    ok(d('after') <= 2, `first element after the hero (${after.afterIs}) moved ${d('after')}px`);
    ok(d('next') <= 2, `hero's next sibling moved ${d('next')}px`);
    ok(d('heroH') <= 2, `hero height changed ${d('heroH')}px (${before.heroH} to ${after.heroH})`);
    ok(d('words') <= 2, `words block (the Lighthouse div#tll-main) moved ${d('words')}px`);
    ok(d('h1') <= 2, `h1 moved ${d('h1')}px`);
    // the bundle moves the style to the end of the body once the page is parsed; with the raised specificity that must change nothing
    await p.evaluate(() => { const s = document.getElementById('tll-mag-cover-v1'); if (s) document.body.appendChild(s); }); await p.waitForTimeout(300);
    const moved = await p.evaluate(measure); const dm = k => Math.abs(moved[k] - after[k]);
    ok(dm('after') <= 2 && dm('words') <= 2 && dm('h1') <= 2 && dm('heroH') <= 2, `style moved to the end of the body: after ${dm('after')}px, words ${dm('words')}px, h1 ${dm('h1')}px, hero height ${dm('heroH')}px`);
    const a = await p.evaluate(() => { const hero = document.querySelector('[data-h3-hero]'); const img = hero.querySelector('img[data-tll-parallax="hero"]'); const chip = hero.querySelector('.tll-mg-chip img');
      const pre = [].map.call(document.querySelectorAll('link[rel="preload"][as="image"]'), l => ({ href: l.href, pri: l.getAttribute('fetchpriority') }));
      return { src: img.currentSrc || img.src, pri: img.getAttribute('fetchpriority'), loading: img.getAttribute('loading'), dec: img.getAttribute('decoding'), srcset: img.getAttribute('srcset'), w: img.naturalWidth, preload: pre,
        chip: chip ? { src: chip.getAttribute('src'), dec: chip.getAttribute('decoding'), pri: chip.getAttribute('fetchpriority'), loading: chip.getAttribute('loading'), ok: chip.complete && chip.naturalWidth > 0 } : null,
        cards: [].map.call(document.querySelectorAll('.h3-card-ph img'), i => i.getAttribute('loading')), chipOrig: hero.dataset.tllCover }; });
    ok(a.pri === 'high' && a.loading === 'eager' && a.dec === 'async' && !a.srcset, `cover img fetchpriority=${a.pri} loading=${a.loading} decoding=${a.dec} srcset=${a.srcset}`);
    ok(a.w > 0, `cover img loaded (${a.w}px wide): ${a.src.split('/').pop().slice(0, 50)}`);
    ok(a.preload.some(l => l.href === a.src && l.pri === 'high'), `preload link for the cover: ${JSON.stringify(a.preload)}`);
    ok(a.chip && a.chip.dec === 'async' && a.chip.pri === 'low' && a.chip.loading === 'eager', `chip avatar loading=${a.chip && a.chip.loading} decoding=${a.chip && a.chip.dec} fetchpriority=${a.chip && a.chip.pri}`);
    ok(a.chip && !/-p-\d+\./.test(a.chip.src) && a.chip.ok, `chip avatar keeps the original file (eager, above the fold) and loaded: ${a.chip && a.chip.src.split('/').pop()}`);
    ok(a.cards.length > 0 && a.cards.every(l => l === 'lazy'), `${a.cards.length} shelf card images are loading=lazy`);
    // the people strip sits far down the page: scroll it in so its lazy faces load, then check them
    await p.evaluate(() => { const s = document.querySelector('.tll-mg-people'); if (s) s.scrollIntoView(); });
    await p.waitForTimeout(900);
    const f = await p.evaluate(() => [].map.call(document.querySelectorAll('.tll-mg-faces img'), i => ({ src: i.getAttribute('src').split('/').pop(), loading: i.getAttribute('loading'), dec: i.getAttribute('decoding'), ok: i.complete && i.naturalWidth > 0 })));
    ok(f.length === 3 && f.every(x => x.loading === 'lazy' && x.dec === 'async'), `${f.length} people faces are lazy and decoding=async`);
    if (variants === 'served') ok(f.every(x => /-p-500\./.test(x.src) && x.ok), `faces use -p-500 and loaded: ${f.map(x => x.src).join(', ')}`);
    else ok(f.every(x => !/-p-\d+\./.test(x.src) && x.ok), `faces fell back to the originals and loaded: ${f.map(x => x.src).join(', ')}`);
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200);
    if (variants === 'served') { await p.screenshot({ path: path.join(OUT, `${TAG}-${w}-hero.png`), clip: { x: 0, y: 0, width: w, height: after.heroH } }); await p.screenshot({ path: path.join(OUT, `${TAG}-${w}-full.png`), fullPage: true }); }
    const errs = reqs.filter(u => /-p-\d+\./.test(u)); console.log(`  variant requests: ${errs.length} (${[...new Set(errs.map(u => u.split('/').pop()))].join(', ')})`);
    await p.close();
  }
  await b.close();
  // a pixel differs when its summed R, G and B difference is over 30 (Pillow clips each add at 255, which cannot pull a true sum over 30 back under it)
  if (process.env.COMPARE) { const { spawnSync } = require('child_process');
    const PY = ['import sys, json', 'from PIL import Image, ImageChops',
      "a = Image.open(sys.argv[1]).convert('RGB'); b = Image.open(sys.argv[2]).convert('RGB')",
      'W = min(a.width, b.width); H = min(a.height, b.height)',
      'r, g, bl = ImageChops.difference(a.crop((0, 0, W, H)), b.crop((0, 0, W, H))).split()',
      'mask = ImageChops.add(ImageChops.add(r, g), bl).point(lambda v: 255 if v > 30 else 0)',
      "print(json.dumps({'a': [a.width, a.height], 'b': [b.width, b.height], 'n': mask.histogram()[255], 'total': W * H, 'box': mask.getbbox()}))"].join('\n');
    for (const w of [390, 1440]) for (const kind of ['hero', 'full']) { const A = path.join(OUT, `${process.env.COMPARE}-${w}-${kind}.png`), B = path.join(OUT, `${TAG}-${w}-${kind}.png`);
      if (!fs.existsSync(A) || !fs.existsSync(B)) { console.log(`compare ${w} ${kind}: missing file`); continue; }
      const r = spawnSync('python3', ['-I', '-c', PY, A, B], { encoding: 'utf8' }); if (r.status !== 0) { console.log(`compare ${w} ${kind}: python3 with Pillow failed: ${(r.stderr || '').trim().split('\n').pop()}`); fails++; continue; }
      const d = JSON.parse(r.stdout); const box = d.box; /* box: [x0, y0, x1, y1) of the differing pixels, or null */
      console.log(`compare ${process.env.COMPARE} vs ${TAG} ${w} ${kind}: sizes ${d.a[0]}x${d.a[1]} vs ${d.b[0]}x${d.b[1]}, ${d.n} differing pixels of ${d.total} (${(100 * d.n / d.total).toFixed(3)}%)` + (box ? `, box x ${box[0]}-${box[2] - 1} y ${box[1]}-${box[3] - 1}` : '')); } }
  console.log(fails ? `\n${fails} check(s) failed` : '\nall checks passed'); process.exit(fails ? 1 : 0);
})();
