/* Render script for the nav and footer variant prototype (1 Nov 2026).
   node design/nav-footer-variant-2026-11/render.cjs
   1. Embeds the brand fonts into index.html (between the FONTS markers), so the prototype makes no external request.
   2. Builds "today" in memory from the saved code (nothing is written for it) and renders before.png at 390.
   3. Renders index.html at 390 and 1440 in each state and writes after-390.png and after-1440.png as labeled sheets.
   4. Prints the counts used in README.md: header height, link counts, computed position.
   Reads only: the fixtures, the saved head and footer code, the Designer style export, the font files. Writes only inside this folder. */
'use strict';
const fs = require('fs'), path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const DIR = __dirname, ROOT = path.resolve(DIR, '..', '..');
const R = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* ---------- 1. fonts ---------- */
const FONT_DIR = 'src/design/magazine-2026-10/type/fonts', FONT_DIR2 = 'src/pages/home/mobile-proto-2026-10-26/fonts';
const FONTS = [
  ['Playfair Display', 800, 'normal', `${FONT_DIR}/playfair-display-latin-800-normal.woff2`],
  ['Playfair Display', 800, 'italic', `${FONT_DIR}/playfair-display-latin-800-italic.woff2`],
  ['IBM Plex Sans Condensed', 400, 'normal', `${FONT_DIR}/ibm-plex-sans-condensed-latin-400-normal.woff2`],
  ['IBM Plex Sans Condensed', 600, 'normal', `${FONT_DIR}/ibm-plex-sans-condensed-latin-600-normal.woff2`],
  ['IBM Plex Sans Condensed', 700, 'normal', `${FONT_DIR2}/ibm-plex-sans-condensed-latin-700-normal.woff2`],
  ['JetBrains Mono', 400, 'normal', `${FONT_DIR}/jetbrains-mono-latin-400-normal.woff2`],
  ['JetBrains Mono', 600, 'normal', `${FONT_DIR}/jetbrains-mono-latin-600-normal.woff2`],
];
const b64 = {};
function face(family, weight, style, file) {
  if (!b64[file]) b64[file] = fs.readFileSync(path.join(ROOT, file)).toString('base64');
  return `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};font-display:swap;src:url(data:font/woff2;base64,${b64[file]}) format('woff2')}`;
}
const brandFontCss = FONTS.map((f) => face(...f)).join('\n');
/* The live head aliases the legacy families to Plex and Playfair files (tll-proto-parity-v1). Same aliases here, for the "today" render only. */
const aliasFontCss = [
  ...['DM Sans', 'Syne', 'Inter'].flatMap((fam) => [
    face(fam, '100 500', 'normal', FONTS[2][3]), face(fam, 600, 'normal', FONTS[3][3]), face(fam, '700 900', 'normal', FONTS[4][3]),
    face(fam, '100 900', 'italic', FONTS[2][3])]),
  ...['DM Serif Display', 'Druk Wide Web Heavy', 'Recoleta'].flatMap((fam) => [face(fam, '100 900', 'normal', FONTS[0][3]), face(fam, '100 900', 'italic', FONTS[1][3])]),
].join('\n');

const INDEX = path.join(DIR, 'index.html');
let index = fs.readFileSync(INDEX, 'utf8');
const fontsBlock = `/*FONTS-START*/\n${brandFontCss}\n/*FONTS-END*/`;
const next = index.replace(/\/\*FONTS-START\*\/[\s\S]*?\/\*FONTS-END\*\//, fontsBlock);
if (next !== index) { fs.writeFileSync(INDEX, next); index = next; console.log('fonts embedded into index.html'); }

/* ---------- 2. "today" page, assembled from the saved code ---------- */
const styleById = (src, id) => (src.match(new RegExp(`<style id="${id}">[\\s\\S]*?</style>`)) || [''])[0];
const scriptById = (src, id) => (src.match(new RegExp(`<script id="${id}">[\\s\\S]*?</script>`)) || [''])[0];
const head = R('scratchpad/p0-1031/after/site-head.html');
const foot = R('scratchpad/p0-1031/before/site-footer.html');
const footComp = R('src/components/footer/tll-foot-v1.html');
const fixtureHome = R('src/design/magazine-2026-10/cover-build/fixture-home.html');
const fixtureStories = R('src/pages/heroes-2026-10-29/fixtures/stories.html');

const navMarkup = fixtureHome.match(/<!-- component: TLL Nav v1 -->[\s\S]*?<!-- \/component: TLL Nav v1 -->/)[0];
let footerMarkup = fixtureStories.match(/<footer class="inline-footer-0-1"[\s\S]*?<\/footer>/)[0].replace(/<script[\s\S]*?<\/script>/g, '');
function balanced(src, start) {
  const i = src.indexOf(start); if (i < 0) throw new Error('not found ' + start);
  let depth = 0, j = i; const re = /<\/?div\b[^>]*>/g; re.lastIndex = i; let m;
  while ((m = re.exec(src))) { if (m[0][1] === '/') depth--; else depth++; if (depth === 0) { j = m.index + m[0].length; break; } }
  return src.slice(i, j);
}
const noteMarkup = balanced(fixtureStories, '<div id="tll-note"');

/* Designer classes (13 Oct export) for the selectors the markup uses. */
const styles = JSON.parse(R('reports/evidence/webflow-export-2026-10-13/state/styles/styles-full.json'));
const vars = JSON.parse(R('reports/evidence/webflow-export-2026-10-13/state/styles/variables.json'));
const varById = {};
(function walk(v) { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') { if (v.id && v.cssName) varById[v.id] = v; Object.values(v).forEach(walk); } })(vars);
function val(v) {
  if (v && typeof v === 'object' && v.id) { const d = varById[v.id]; if (!d) return 'initial'; const x = d.value; return x && typeof x === 'object' ? `${x.value}${x.unit || ''}` : String(x); }
  return String(v);
}
const BP = { medium: '(max-width:991px)', small: '(max-width:767px)', tiny: '(max-width:479px)' };
const PROP = { 'grid-column-gap': 'column-gap', 'grid-row-gap': 'row-gap' };
const classesUsed = new Set();
for (const m of (navMarkup + footerMarkup).matchAll(/class="([^"]+)"/g)) m[1].split(/\s+/).forEach((c) => c && classesUsed.add('.' + c));
['.tll-btn', '.tll-btn-primary', '.tll-btn-ghost-rose'].forEach((c) => classesUsed.add(c));
let designerCss = '', designerCount = 0; const bpCss = { medium: '', small: '', tiny: '' };
for (const s of styles) {
  if (!classesUsed.has(s.selector)) continue; designerCount++;
  const p = s.properties || {}; const decl = (o) => Object.entries(o || {}).map(([k, v]) => `${PROP[k] || k}:${val(v)}`).join(';');
  if (p.base && p.base.properties) designerCss += `${s.selector}{${decl(p.base.properties)}}\n`;
  for (const bp of Object.keys(BP)) { const b = p.breakpoints && p.breakpoints[bp]; if (b && b.properties && Object.keys(b.properties).length) bpCss[bp] += `${s.selector}{${decl(b.properties)}}\n`; }
}
/* Webflow writes every breakpoint block after all base rules, largest breakpoint first. */
for (const bp of Object.keys(BP)) designerCss += `@media ${BP[bp]}{\n${bpCss[bp]}}\n`;

const parityCss = styleById(head, 'tll-proto-parity-v1').replace(/@font-face\{[^}]*\}/g, '');
const todayHtml = `<!DOCTYPE html><html lang="en" class="ms-loaded"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>today</title>
<style>${brandFontCss}\n${aliasFontCss}</style>
<style id="webflow-base">*{box-sizing:border-box}body{margin:0;background:#FAF7F2;color:#0A0B14;font:400 16px/1.55 'DM Sans',sans-serif}a{color:inherit}h4{margin:10px 0;font-size:18px;line-height:24px;font-weight:700}.w-condition-invisible{display:none}</style>
<style id="designer-13-oct">${designerCss}</style>
${styleById(foot, 'tll-core-v2-css')}
${styleById(head, 'tll-consistency-v1')}
${styleById(head, 'tll-mobile-nav-v1')}
${parityCss}
${styleById(head, 'tll-v9-chrome-v1')}
${styleById(foot, 'tll-note-v1-css')}
${styleById(footComp, 'tll-foot-v1')}
${R('src/site-layers/tll-nav-phone-v1.html').match(/<style[\s\S]*?<\/style>/)[0]}
${R('src/site-layers/tll-footer-wordmark-v1.html').match(/<style[\s\S]*?<\/style>/)[0]}
${R('src/site-layers/tll-masthead-v1.html').match(/<style[\s\S]*?<\/style>/)[0]}
<style id="today-standin">.proto-hero{background:#0B1220;color:#FAF7F2;padding:56px 20px 48px}.proto-hero-in,.proto-body{max-width:680px;margin:0 auto}.proto-eyebrow{font:600 11px/1.4 'JetBrains Mono',monospace;letter-spacing:3px;text-transform:uppercase;color:#00C9C8;margin:0 0 14px}.proto-hero h1{font:800 clamp(34px,4.2vw,56px)/1.03 'Playfair Display',Georgia,serif;margin:0 0 14px}.proto-hero h1 em{color:#F0507A}.proto-hero p{font-size:17px;line-height:1.6;margin:0;max-width:46ch}.proto-body{padding:36px 20px 40px}.proto-body p{font-size:17px;line-height:1.7;color:#3a3a3a}</style>
</head><body>
${navMarkup}
<main id="main"><section class="proto-hero"><div class="proto-hero-in"><p class="proto-eyebrow">Today · Nav and footer as saved 29 to 31 Oct 2026</p><h1>One row. One <em>action.</em></h1><p>The same stand-in page, with the live nav, footer and Tell the editor pill, so the two renders compare like for like.</p></div></section><article class="proto-body"><p>Filler for the scroll only.</p><p>On phones the live nav is not sticky: the Designer sets it sticky, but the v9 chrome block sets position relative under 900px.</p></article></main>
${footerMarkup}
${noteMarkup}
${scriptById(head, 'tll-mobile-nav-js-v1')}
${scriptById(head, 'tll-v9-chrome-js-v1')}
${scriptById(foot, 'tll-note-v1-js')}
<script>${R('src/site-layers/tll-footer-wordmark-v1.js')}</script>
<script>${R('src/site-layers/tll-masthead-v1.js')}</script>
<script>/* wordmark(), from tll-proto-parity-js-v1 */(function(){[].forEach.call(document.querySelectorAll('.tll-nav-logo-block'),function(b){var t=b.textContent.trim();if(/^LAYOVER LIFE\\.?$/i.test(t))b.innerHTML='LAYOVER <span class="tll-nav-logo-life">LIFE.</span>';});})();</script>
<script>/* footer accordions, from tll-foot-v1 */${(footComp.match(/<script>([\s\S]*?)<\/script>/) || ['', ''])[1].split('/* The Data API')[0]}</script>
<script>(function(){var q=new URLSearchParams(location.search);if(q.get('state')==='in'){document.documentElement.classList.add('tll-in');var s=document.createElement('style');s.textContent='html.tll-in [data-ms-content="anonymous"]{display:none !important}html.tll-in [data-ms-content="members"]{display:block !important}';document.head.appendChild(s);}else{var s2=document.createElement('style');s2.textContent='html [data-ms-content="members"]{display:none !important}html [data-ms-content="anonymous"]{display:block !important}';document.head.appendChild(s2);}if(q.get('menu')==='open')window.addEventListener('load',function(){var b=document.querySelector('.tllmm-btn');if(b)b.click();});})();</script>
</body></html>`;

/* ---------- 3. render helpers ---------- */
const SCALE = 2;
async function sheet(browser, width, panels, out) {
  /* panels: [{label, png(Buffer)}] stacked vertically with a label bar, at SCALE device pixels */
  const p = await browser.newPage({ viewport: { width: 400, height: 400 } });
  const imgs = panels.map((x) => 'data:image/png;base64,' + x.png.toString('base64'));
  const data = await p.evaluate(async ({ imgs, labels, width, scale }) => {
    const loaded = await Promise.all(imgs.map((src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src; })));
    const bar = 30 * scale, gut = 14 * scale, pad = 14 * scale;
    const H = loaded.reduce((a, i) => a + bar + i.height + gut, pad) + pad - gut;
    const c = document.createElement('canvas'); c.width = width * scale + pad * 2; c.height = H;
    const g = c.getContext('2d'); g.fillStyle = '#E6E2DA'; g.fillRect(0, 0, c.width, c.height);
    let y = pad;
    loaded.forEach((img, k) => {
      g.fillStyle = '#0A0B14'; g.fillRect(pad, y, width * scale, bar);
      g.fillStyle = '#FAF7F2'; g.font = `600 ${12 * scale}px "JetBrains Mono", monospace`; g.textBaseline = 'middle'; g.fillText(labels[k].toUpperCase(), pad + 10 * scale, y + bar / 2);
      y += bar; g.drawImage(img, pad, y); g.strokeStyle = 'rgba(10,11,20,.25)'; g.lineWidth = 1; g.strokeRect(pad + .5, y + .5, img.width - 1, img.height - 1); y += img.height + gut;
    });
    return c.toDataURL('image/png');
  }, { imgs, labels: panels.map((x) => x.label), width, scale: SCALE });
  fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64')); await p.close(); console.log('wrote', path.relative(ROOT, out));
}
async function open(browser, width, height, url, html) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: SCALE });
  page.on('console', (m) => { if (m.type() === 'error') console.log('  [page error]', m.text().slice(0, 120)); });
  if (html) { await page.route('http://today.local/**', (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html })); await page.goto('http://today.local' + url, { waitUntil: 'load' }); }
  else await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250);
  return page;
}
function qs(base, params) { return base + '?' + new URLSearchParams(params).toString(); }
const shotTop = (page, h) => page.screenshot({ clip: { x: 0, y: 0, width: page.viewportSize().width, height: h } });
async function shotEl(page, sel) { const box = await page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: innerWidth, height: r.height }; }, sel); return page.screenshot({ fullPage: true, clip: box }); }
async function shotBottom(page) { await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(250); return page.screenshot({ fullPage: false }); }

async function measure(page, label) {
  const m = await page.evaluate(() => {
    const nav = document.querySelector('.tll-nav-v1'); const r = nav.getBoundingClientRect(); const cs = getComputedStyle(nav);
    const vis = (el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
    const navAll = [...nav.querySelectorAll('a,button')];
    const rowVisible = navAll.filter(vis).map((a) => (a.textContent.trim() || a.getAttribute('aria-label')) + '(' + Math.round(a.getBoundingClientRect().width) + 'x' + Math.round(a.getBoundingClientRect().height) + ')');
    const menuLinks = [...nav.querySelectorAll('.tll-nav-links-row a')].filter(vis).map((a) => a.textContent.trim());
    const foot = document.querySelector('footer'); const footLinks = [...foot.querySelectorAll('a')];
    const footVisibleCols = footLinks.filter(vis).length;
    const small = [...document.querySelectorAll('nav *, footer *')].filter((e) => e.children.length === 0 && e.textContent.trim() && vis(e)).map((e) => parseFloat(getComputedStyle(e).fontSize)).filter((s) => s < 12);
    const inner = nav.querySelector('.tll-nav-inner').getBoundingClientRect(); const cta = nav.querySelector('.tll-nav-cta-row'); const ctaBoxes = [...cta.querySelectorAll('a,button')].filter(vis).map((e) => e.getBoundingClientRect()); const logoBox = nav.querySelector('.tll-nav-logo').getBoundingClientRect(); const gapAfterLogo = Math.round(Math.min(...ctaBoxes.map((b) => b.left)) - logoBox.right); const rowRight = Math.round(Math.max(...ctaBoxes.map((b) => b.right)));
    const overflow = navAll.filter(vis).filter((a) => { const b = a.getBoundingClientRect(); return b.right > innerWidth + .5 || b.left < -.5 || a.scrollWidth > a.clientWidth + 1; }).map((a) => a.textContent.trim());
    return { navHeight: Math.round(r.height * 10) / 10, position: cs.position, rowVisible, menuLinks, footAnchors: footLinks.length, footVisibleCols, smallText: small.length, innerRight: Math.round(inner.right), rowRight, gapAfterLogo, overflow, scrollW: document.documentElement.scrollWidth };
  });
  console.log(`[${label}]`, JSON.stringify(m));
  return m;
}

(async () => {
  const browser = await chromium.launch();
  const report = {};
  /* before, 390 */
  {
    const panels = [];
    let p = await open(browser, 390, 844, '/stories', todayHtml);
    report.beforeOut = await measure(p, 'today 390 logged out');
    panels.push({ label: 'Today, 390, logged out', png: await shotTop(p, 300) }); await p.close();
    p = await open(browser, 390, 844, '/stories?menu=open', todayHtml);
    await p.waitForTimeout(150); await measure(p, 'today 390 menu open');
    panels.push({ label: 'Today, 390, menu open', png: await shotTop(p, 560) }); await p.close();
    p = await open(browser, 390, 844, '/stories?state=in', todayHtml);
    report.beforeIn = await measure(p, 'today 390 logged in');
    panels.push({ label: 'Today, 390, logged in', png: await shotTop(p, 300) }); await p.close();
    p = await open(browser, 390, 844, '/stories', todayHtml);
    panels.push({ label: 'Today, 390, footer (accordions closed)', png: await shotEl(p, 'footer') });
    panels.push({ label: 'Today, 390, page bottom, floating pill', png: await shotBottom(p) }); await p.close();
    await sheet(browser, 390, panels, path.join(DIR, 'before.png'));
    p = await open(browser, 1440, 900, '/stories', todayHtml); report.before1440 = await measure(p, 'today 1440 logged out'); await p.close();
    p = await open(browser, 1440, 900, '/stories?state=in', todayHtml); await measure(p, 'today 1440 logged in'); await p.close();
  }
  /* after, 390 */
  const url = 'file://' + INDEX;
  {
    const panels = [];
    let p = await open(browser, 390, 844, qs(url, { shot: 1 }));
    report.afterOut = await measure(p, 'variant 390 logged out');
    panels.push({ label: 'Variant, 390, logged out', png: await shotTop(p, 300) }); await p.close();
    p = await open(browser, 390, 844, qs(url, { shot: 1, menu: 'open' }));
    report.afterOutMenu = await measure(p, 'variant 390 logged out, menu open');
    panels.push({ label: 'Variant, 390, logged out, menu open', png: await shotTop(p, 560) }); await p.close();
    p = await open(browser, 390, 844, qs(url, { shot: 1, state: 'in' }));
    report.afterIn = await measure(p, 'variant 390 logged in');
    panels.push({ label: 'Variant, 390, logged in', png: await shotTop(p, 300) }); await p.close();
    p = await open(browser, 390, 844, qs(url, { shot: 1, state: 'in', menu: 'open' }));
    report.afterInMenu = await measure(p, 'variant 390 logged in, menu open');
    panels.push({ label: 'Variant, 390, logged in, menu open', png: await shotTop(p, 480) }); await p.close();
    p = await open(browser, 390, 844, qs(url, { shot: 1 }));
    await p.evaluate(() => window.scrollTo(0, 600)); await p.waitForTimeout(200);
    panels.push({ label: 'Variant, 390, scrolled, header stays', png: await shotTop(p, 140) });
    panels.push({ label: 'Variant, 390, story end block', png: await shotEl(p, '#tll-ux-end') });
    panels.push({ label: 'Variant, 390, footer (accordions closed)', png: await shotEl(p, 'footer') }); await p.close();
    p = await open(browser, 390, 844, qs(url, { shot: 1, foot: 'open' }));
    panels.push({ label: 'Variant, 390, footer, every column open', png: await shotEl(p, 'footer') }); await p.close();
    p = await open(browser, 390, 844, qs(url, { shot: 1, note: 'open' }));
    panels.push({ label: 'Variant, 390, Tell the editor open', png: await shotBottom(p) }); await p.close();
    await sheet(browser, 390, panels, path.join(DIR, 'after-390.png'));
  }
  /* after, 1440 */
  {
    const panels = [];
    let p = await open(browser, 1440, 900, qs(url, { shot: 1 }));
    report.after1440Out = await measure(p, 'variant 1440 logged out');
    panels.push({ label: 'Variant, 1440, logged out', png: await shotTop(p, 420) }); await p.close();
    p = await open(browser, 1440, 900, qs(url, { shot: 1, state: 'in' }));
    report.after1440In = await measure(p, 'variant 1440 logged in');
    panels.push({ label: 'Variant, 1440, logged in', png: await shotTop(p, 160) }); await p.close();
    p = await open(browser, 1440, 900, qs(url, { shot: 1 }));
    panels.push({ label: 'Variant, 1440, story end block and footer', png: await (async () => { await p.evaluate(() => document.getElementById('tll-ux-end').scrollIntoView()); await p.waitForTimeout(150); return p.screenshot({ fullPage: false }); })() });
    panels.push({ label: 'Variant, 1440, footer', png: await shotEl(p, 'footer') }); await p.close();
    p = await open(browser, 1440, 900, qs(url, { shot: 1, note: 'open' }));
    panels.push({ label: 'Variant, 1440, Tell the editor open', png: await shotBottom(p) }); await p.close();
    await sheet(browser, 1440, panels, path.join(DIR, 'after-1440.png'));
  }
  /* extra widths, measured only */
  for (const w of [320, 360, 430, 768, 899, 900, 1024]) {
    for (const st of ['out', 'in']) for (const menu of ['closed', 'open']) { const p = await open(browser, w, 800, qs(url, { shot: 1, state: st, menu })); await measure(p, `variant ${w} ${st} menu ${menu}`); await p.close(); }
  }
  await browser.close();
  console.log('designer classes used in the today render:', designerCount);
  console.log('REPORT ' + JSON.stringify(report));
})().catch((e) => { console.error(e); process.exit(1); });
