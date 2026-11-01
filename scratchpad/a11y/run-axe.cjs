/* Phase 2C accessibility audit, offline (1 Nov 2026). Run from the repo root:
     node scratchpad/a11y/run-axe.cjs axe            every fixture, 390 and 1440 wide, axe-core + the DOM checks
     node scratchpad/a11y/run-axe.cjs axe home story-spain   only those fixtures
     node scratchpad/a11y/run-axe.cjs static         the static scan of the saved page code and layer CSS
   Nothing leaves the sandbox: every request is answered from local files or aborted.
   Fixtures: the saved stand-ins (cover-build, story-build, heroes-2026-10-29, the 28 Oct home) and, at lower fidelity, the 13 Oct Webflow
   export pages for the form and help pages. Each gets the current site head CSS blocks (scratchpad/p0-1031/after/site-head.html, styles
   only, replaced by id), the newest saved page code by id, and the raw site layers in the v16 bundle order (not the built bundle).
   Results: scratchpad/a11y/axe-<page>-<width>.json, scratchpad/a11y/summary.json, scratchpad/a11y/static-scan.json. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const OUT = __dirname;
const EXPORT = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13');
const R = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const MODE = process.argv[2] || 'axe';
const ONLY = process.argv.slice(3);

/* ---------- sources ---------- */
const SITE_HEAD = 'scratchpad/p0-1031/after/site-head.html';
const STYLES = ['tll-nav-phone-v1', 'tll-contrast-v1', 'tll-note-phone-v1', 'tll-photos-tap-v1', 'tll-home-coords-v1', 'tll-footer-wordmark-v1', 'tll-tap-colors-v1', 'tll-shelf-ring-v1', 'tll-masthead-v1'].map(n => 'src/site-layers/' + n + '.html');
const SCRIPTS = ['src/components/member-bar/tll-account-hash-tabs-v1.js', 'src/site-layers/tll-note-typing-v1.js', 'src/components/edit-profile-fixes/tll-ep-country-v1.js', 'src/site-layers/tll-footer-wordmark-v1.js', 'src/site-layers/tll-masthead-v1.js', 'src/site-layers/tll-ux-1028-v1.js', 'src/site-layers/tll-page-heroes-v1.js', 'src/site-layers/tll-story-ask-v1.js', 'src/site-layers/tll-open-slots-v1.js', 'src/site-layers/tll-travelers-fix-v1.js', 'src/site-layers/tll-ep-ux-v1.js', 'src/site-layers/tll-submit-ux-v1.js', 'src/site-layers/tll-profile-count-v1.js', 'src/site-layers/tll-hover-v1.js', 'src/site-layers/tll-home-bands-v1.js', 'src/site-layers/tll-photos-caption-v1.js', 'src/site-layers/tll-lounge-labels-v1.js', 'src/site-layers/tll-stories-places-v1.js', 'src/site-layers/tll-stories-noimg-v1.js', 'src/site-layers/tll-linkout-preview-v1.js', 'src/site-layers/tll-linkout-summary-v1.js', 'src/site-layers/tll-byline-links-v1.js', 'src/site-layers/tll-mbar-align-v1.js', 'src/site-layers/tll-story-fixes-1029-v1.js', 'src/site-layers/tll-email-hello-v1.js', 'src/site-layers/tll-ep-marks-v1.js', 'src/site-layers/tll-ep-help-v1.js', 'src/site-layers/tll-expert-from-v1.js', 'src/site-layers/tll-submit-gallery-v1.js', 'src/site-layers/tll-submit-long-v1.js', 'src/site-layers/tll-photos-form-v2.js', 'src/site-layers/tll-ep-linkstack-v1.js', 'src/site-layers/tll-pf-linkstack-v1.js', 'src/site-layers/tll-redesign-p0-v1.js', 'src/site-layers/tll-expats-map-v1.js', 'src/site-layers/tll-story-captions-v1.js', 'src/site-layers/tll-intake-v1.js', 'src/site-layers/tll-lounge-members-v1.js', 'src/site-layers/tll-crew-v1.js', 'src/site-layers/tll-home-value-v1.js', 'src/site-layers/tll-collections-v1.js', 'src/site-layers/tll-whats-new-v1.js', 'src/site-layers/tll-stamps-v1.js', 'src/site-layers/tll-album-v1.js', 'src/site-layers/tll-album-settings-v1.js', 'src/site-layers/tll-export-v1.js', 'src/site-layers/tll-pros-v1.js', 'src/site-layers/tll-division-v1.js', 'src/site-layers/tll-paw-v1.js', 'src/site-layers/tll-metrics-v1.js', 'src/site-layers/tll-series-v1.js', 'src/site-layers/tll-expat-v1.js', 'src/site-layers/tll-pet-passport-v1.js', 'src/site-layers/tll-work-trips-v1.js', 'src/site-layers/tll-ux-v1.js', 'src/site-layers/tll-phase0-v1.js', 'src/site-layers/tll-story-is-v1.js', 'src/site-layers/tll-ads-v1.js'];
const STORY_LAYER = 'src/design/magazine-2026-10/story-build/tll-mag-story-v1.html';
const COVER_LAYER = 'src/design/magazine-2026-10/cover-build/tll-mag-cover-v1.html';

/* The fixtures. kind: 'fixture' (a saved stand-in with <!--LAYER-->) or 'export' (a 13 Oct export page). code: newest saved page code files. */
const PAGES = [
  { name: 'home', path: '/', file: 'src/design/magazine-2026-10/cover-build/fixture-home.html', kind: 'fixture', home: true, code: ['scratchpad/p0-1031/before/home-head.html', 'scratchpad/p0-1031/before/home-footer.html'], note: '13 Oct export body with the 26 Oct hero embeds (cover-build fixture); current head CSS; cover layer' },
  { name: 'home-1028', path: '/', file: 'src/pages/home/live-2026-10-28/ux/fixture-home-current.html', kind: 'fixture', home: true, code: ['scratchpad/p0-1031/before/home-head.html', 'scratchpad/p0-1031/before/home-footer.html'], note: '28 Oct live embeds on the 13 Oct export body; current head CSS; cover layer' },
  { name: 'story-spain', path: '/stories/spain-madrid-wedding-ibiza', file: 'src/design/magazine-2026-10/story-build/fixture-spain-madrid-wedding-ibiza.html', kind: 'fixture', story: true, code: ['scratchpad/p0-1031/after/storytpl-head.html', 'scratchpad/p0-1031/before/storytpl-footer.html'], note: 'Stories template tree of 26 Oct filled from the CMS item; current head CSS and template code; story layer' },
  { name: 'story-ghana', path: '/stories/ghana-easter-everyone-wears-white', file: 'src/design/magazine-2026-10/story-build/fixture-ghana-easter-everyone-wears-white.html', kind: 'fixture', story: true, code: ['scratchpad/p0-1031/after/storytpl-head.html', 'scratchpad/p0-1031/before/storytpl-footer.html'], note: 'same build, Ghana story' },
  { name: 'story-pantanal', path: '/stories/pantanal-glimmers-in-the-wild', file: 'src/design/magazine-2026-10/story-build/fixture-pantanal-glimmers-in-the-wild.html', kind: 'fixture', story: true, code: ['scratchpad/p0-1031/after/storytpl-head.html', 'scratchpad/p0-1031/before/storytpl-footer.html'], note: 'same build, Pantanal story with photo placements' },
  { name: 'stories', path: '/stories', file: 'src/pages/heroes-2026-10-29/fixtures/stories.html', kind: 'fixture', code: ['scratchpad/p0-1031/before/stories-head.html', 'scratchpad/p0-1031/before/stories-footer.html'], note: '29 Oct live element tree; current head CSS and page code' },
  { name: 'the-map', path: '/the-map', file: 'src/pages/heroes-2026-10-29/fixtures/the-map.html', kind: 'fixture', code: ['scratchpad/p0-1031/before/map-head.html', 'scratchpad/p0-1031/before/map-footer.html'], note: '29 Oct live element tree; current head CSS and page code; the map itself needs d3 from a CDN and does not draw' },
  { name: 'travelers', path: '/travelers', file: 'src/pages/heroes-2026-10-29/fixtures/travelers.html', kind: 'fixture', code: ['src/pages/heroes-2026-10-29/code/travelers-head.html', 'src/pages/heroes-2026-10-29/code/travelers-footer.html'], note: '29 Oct live element tree; current head CSS' },
  { name: 'about', path: '/about', file: 'src/pages/heroes-2026-10-29/fixtures/about.html', kind: 'fixture', code: ['src/pages/heroes-2026-10-29/code/about-head.html'], note: '29 Oct live element tree; current head CSS' },
  { name: 'for-expats', path: '/for-expats', file: 'src/pages/heroes-2026-10-29/fixtures/for-expats.html', kind: 'fixture', code: ['src/pages/heroes-2026-10-29/code/for-expats-head.html', 'src/pages/heroes-2026-10-29/code/for-expats-footer.html'], note: '29 Oct live element tree; current head CSS' },
  { name: 'contact', path: '/contact', file: 'pages/contact.html', kind: 'export', code: ['scratchpad/p0-1031/before/contact-head.html'], note: '13 Oct export body (Designer markup); current head CSS and 31 Oct page code; Phase 0 layer hides the relay form' },
  { name: 'support', path: '/support', file: 'pages/support.html', kind: 'export', code: ['scratchpad/p0-1031/before/support-head.html'], note: '13 Oct export body; current head CSS and 31 Oct page code' },
  { name: 'signup', path: '/signup', file: 'pages/signup.html', kind: 'export', code: [], note: '13 Oct export body (Memberstack form markup as the Designer holds it)' },
  { name: 'login', path: '/login', file: 'pages/login.html', kind: 'export', code: [], note: '13 Oct export body' },
  { name: 'edit-profile', path: '/edit-profile', file: 'pages/edit-profile.html', kind: 'export', code: [], note: '13 Oct export body; the 29 Oct /edit-profile layers run on top (signed-out, so Memberstack-driven parts stay empty)' },
  { name: 'submit', path: '/submit', file: 'pages/submit.html', kind: 'export', code: ['src/pages/submit/live-2026-10-29/page-head-live.html', 'src/pages/submit/live-2026-10-29/page-footer-live.html'], note: '13 Oct export body; 29 Oct page code; /submit layers' },
  { name: 'share-photos', path: '/share-photos', file: 'pages/share-photos.html', kind: 'export', code: ['src/pages/share-photos/live-2026-10-23/page-footer-after.html'], note: '13 Oct export body; 23 Oct page footer' },
  { name: 'my-pets', path: '/my-pets', file: 'pages/my-pets.html', kind: 'export', code: [], note: '13 Oct export body' },
  { name: 'newsletter', path: '/newsletter', file: 'pages/newsletter.html', kind: 'export', code: [], note: '13 Oct export body' },
  { name: 'account', path: '/account', file: 'pages/account.html', kind: 'export', code: ['src/pages/account/live-2026-10-27/page-footer-2026-10-27-after.html'], note: '13 Oct export body; 27 Oct page footer; signed out' },
  { name: 'the-paw-passport', path: '/the-paw-passport', file: 'pages/the-paw-passport.html', kind: 'export', code: [], note: '13 Oct export body' },
  { name: 'destinations', path: '/destinations', file: 'pages/destinations.html', kind: 'export', code: ['src/pages/destinations/v3/head-live-after-ds3.html'], note: '13 Oct export body; ds3 head code' },
];

/* ---------- fixture assembly ---------- */
function blocks(html) { const out = []; const re = /<(style|script)(\s[^>]*)?>([\s\S]*?)<\/\1>/g; let m; while ((m = re.exec(html))) { const id = (m[2] || '').match(/\sid="([^"]+)"/); out.push({ tag: m[1], id: id ? id[1] : null, full: m[0], inner: m[3] }); } return out; }
function replaceById(html, src, appendBefore, stylesOnly) {
  const add = [];
  for (const b of blocks(src)) {
    if (stylesOnly && b.tag !== 'style') continue;
    if (b.id) { const re = new RegExp('<' + b.tag + '\\s[^>]*id="' + b.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*>[\\s\\S]*?<\\/' + b.tag + '>'); if (re.test(html)) { html = html.replace(re, () => b.full); continue; } }
    else if (html.includes(b.inner.trim())) continue;
    add.push(b.full);
  }
  if (add.length) { for (const mark of appendBefore) { const i = html.indexOf(mark); if (i >= 0) { html = html.slice(0, i) + add.join('\n') + '\n' + html.slice(i); add.length = 0; break; } } }
  return html;
}
function buildPage(pg) {
  let html = pg.kind === 'export' ? fs.readFileSync(path.join(EXPORT, pg.file), 'utf8') : R(pg.file);
  html = html.replace(/href="\.\.\/css\/([^"]+)"/g, 'href="http://tll.test/css/$1"').replace(/src="\.\.\/js\/([^"]+)"/g, 'src="http://tll.test/js/$1"');
  /* current site head CSS blocks, by id; new ones go at the end of the site head region. The head's own DOM scripts (path class, mobile nav,
     prototype parity, v9 chrome landmarks and skip link, motion hook, 12px floor) go in the same way, so the two 13 Oct based home fixtures
     and the export pages carry the current chrome; the consent block (Google tags) is left out, as are all third-party tags. */
  const headSrc = R(SITE_HEAD).replace(/<script id="tll-consent-v3">[\s\S]*?<\/script>/, '');
  html = replaceById(html, headSrc, ['<!-- PAGE HEAD CODE -->', '<!-- /SITE HEAD CODE -->', '<!--BUNDLE-->', '</head>'], false);
  /* newest saved page code, by id (styles and scripts); new head blocks before the page head end, footer blocks before the body end */
  for (const f of pg.code) { const isHead = /head/.test(path.basename(f)); html = replaceById(html, R(f), isHead ? ['<!-- /PAGE HEAD CODE -->', '<!--BUNDLE-->', '</head>'] : ['<!-- /PAGE FOOTER CODE -->', '<!--LAYER-->', '</body>'], false); }
  /* the raw layers, in the v16 bundle order; the story and cover layers only where the bundle would run them */
  let layer = STYLES.map(R).join('\n') + '\n' + SCRIPTS.map(f => '<script>' + R(f) + '</script>').join('\n');
  if (pg.story) layer += '\n' + R(STORY_LAYER);
  if (pg.home) layer += '\n' + R(COVER_LAYER);
  html = html.includes('<!--LAYER-->') ? html.replace('<!--LAYER-->', layer) : html.replace(/<\/body>/, layer + '\n</body>');
  return html;
}

/* ---------- offline routing ---------- */
const FONTS = path.join(ROOT, 'src/design/magazine-2026-10/type/fonts');
const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const face = (fam, style, w, file) => `@font-face{font-family:'${fam}';font-style:${style};font-weight:${w};src:url(http://tll.test/fonts/${file}.woff2) format('woff2')}`;
const FONTCSS = [face('Playfair Display', 'normal', 800, 'playfair-display-latin-800-normal'), face('Playfair Display', 'italic', 800, 'playfair-display-latin-800-italic'), face('JetBrains Mono', 'normal', 400, 'jetbrains-mono-latin-400-normal'), face('JetBrains Mono', 'normal', 600, 'jetbrains-mono-latin-600-normal'), face('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), face('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'), face('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), face('Inter Tight', 'italic', '100 900', 'inter-tight-latin-wght-italic'), face('IBM Plex Sans Condensed', 'normal', 400, 'ibm-plex-sans-condensed-latin-400-normal'), face('IBM Plex Sans Condensed', 'normal', '500 700', 'ibm-plex-sans-condensed-latin-600-normal')].join('');
const SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#9a958c"/></svg>';
function route(html) {
  return r => {
    const u = r.request().url();
    if (u.startsWith('http://tll.test/css/')) { const f = path.join(EXPORT, 'css', u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'text/css' }) : r.abort(); }
    if (u.startsWith('http://tll.test/fonts/')) { const f = path.join(FONTS, u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'font/woff2' }) : r.abort(); }
    if (u.startsWith('http://tll.test/js/')) return r.abort();
    if (u.startsWith('http://tll.test/') && r.request().resourceType() === 'document') return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ body: FONTCSS, contentType: 'text/css' });
    if (u.includes('workers.dev')) return r.fulfill({ body: '{"ok":true,"items":[],"stamps":[],"photos":[],"count":0}', contentType: 'application/json' });
    if (/curacao/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'hero-curacao.jpg')), contentType: 'image/jpeg' });
    if (/avatar|nancy/i.test(u) && /\.(jpe?g|png|webp)/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'avatar-nancy.jpg')), contentType: 'image/jpeg' });
    if (/\.svg(\?|$)/i.test(u)) return r.fulfill({ body: SVG, contentType: 'image/svg+xml' });
    if (/\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(u) || /website-files\.com|cloudinary/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'pantanal-jaguar.jpg')), contentType: 'image/jpeg' });
    return r.abort();
  };
}

/* ---------- the in-page checks ---------- */
const CHECKS = `(() => {
  const desc = el => { const t = el.tagName.toLowerCase(); const id = el.id ? '#' + el.id : ''; const c = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : ''; const n = (el.getAttribute('name') ? '[name=' + el.getAttribute('name') + ']' : ''); const tx = (el.value && el.type !== 'password' ? '' : (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40)); return t + id + c + n + (tx ? ' "' + tx + '"' : ''); };
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(vis).map(h => h.tagName[1] + ' ' + h.textContent.trim().replace(/\\s+/g, ' ').slice(0, 70));
  const mains = document.querySelectorAll('main,[role=main]').length;
  const skip = document.querySelector('.tll-skip'); const skipTarget = skip && skip.getAttribute('href');
  const fields = [...document.querySelectorAll('input,textarea,select')].filter(f => !['hidden', 'submit', 'button', 'reset', 'image'].includes(f.type));
  const idCount = {}; fields.forEach(f => { if (f.id) idCount[f.id] = (idCount[f.id] || 0) + 1; });
  const unlabeled = [], shared = [];
  fields.forEach(f => { const id = f.id; const lab = id && idCount[id] === 1 && document.querySelector('label[for="' + CSS.escape(id) + '"]'); const name = lab || f.closest('label') || f.getAttribute('aria-label') || f.getAttribute('aria-labelledby') || f.getAttribute('title'); if (!name) unlabeled.push(desc(f) + (vis(f) ? '' : ' (hidden)')); if (id && idCount[id] > 1) shared.push(desc(f)); });
  const floor = document.documentElement.getAttribute('data-tll-floor');
  const small = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t; const seen = new Set();
  while ((t = w.nextNode())) { if (!t.nodeValue.trim()) continue; const e = t.parentElement; if (!e || seen.has(e) || e.closest('script,style,noscript')) continue; seen.add(e); if (!vis(e)) continue; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 12) small.push(fs.toFixed(1) + 'px ' + desc(e) + (e.closest('svg') ? ' (svg)' : '')); }
  const targets = []; for (const el of document.querySelectorAll('a[href],button,[role=button],input[type=submit],input[type=checkbox],input[type=radio]')) { if (!vis(el)) continue; const r = el.getBoundingClientRect(); if (r.width < 24 || r.height < 24) targets.push(Math.round(r.width) + 'x' + Math.round(r.height) + ' ' + desc(el)); }
  const pill = document.querySelector('#tll-note .tll-note-pill'); const pillRect = pill && vis(pill) ? pill.getBoundingClientRect() : null;
  return { headings, mains, skip: skip ? { text: skip.textContent.trim(), href: skipTarget, targetExists: !!(skipTarget && document.querySelector(skipTarget)) } : null, fields: fields.length, unlabeled, shared, floor, smallAfterFloor: small, under24: targets, pill: pillRect ? { w: Math.round(pillRect.width), h: Math.round(pillRect.height), fixed: getComputedStyle(document.getElementById('tll-note')).position } : null };
})()`;
const FOCUS = `(async () => {
  const desc = el => { const t = el.tagName.toLowerCase(); const id = el.id ? '#' + el.id : ''; const c = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : ''; return t + id + c + ' "' + (el.getAttribute('aria-label') || el.textContent || el.value || '').trim().replace(/\\s+/g, ' ').slice(0, 30) + '"'; };
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const note = document.getElementById('tll-note'); const pill = note && note.querySelector('.tll-note-pill');
  const foc = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])')].filter(vis);
  const covered = [], noRing = []; let tested = 0;
  for (const el of foc.slice(0, 500)) { el.focus(); await new Promise(r => requestAnimationFrame(r)); if (document.activeElement !== el) continue; tested++;
    const cs = getComputedStyle(el); const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
    if (!ring) noRing.push(desc(el));
    if (pill && vis(pill) && getComputedStyle(note).opacity !== '0' && el !== pill) { const r = el.getBoundingClientRect(), q = pill.getBoundingClientRect(); if (q.width && r.left < q.right && r.right > q.left && r.top < q.bottom && r.bottom > q.top) covered.push(desc(el) + ' at y=' + Math.round(r.top)); } }
  window.scrollTo(0, 0);
  return { focusable: foc.length, tested, noRingCount: noRing.length, noRing: noRing.slice(0, 25), coveredByNote: covered };
})()`;

/* ---------- axe run ---------- */
async function runAxe() {
  const { chromium } = require('playwright');
  const AXE = require.resolve('axe-core/axe.min.js');
  const b = await chromium.launch();
  const summary = [];
  const pages = ONLY.length ? PAGES.filter(p => ONLY.includes(p.name)) : PAGES;
  for (const pg of pages) {
    const html = buildPage(pg);
    for (const [w, h] of [[390, 844], [1440, 900]]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, locale: 'en-DK' });
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
      await p.route('**/*', route(html));
      const t0 = Date.now();
      await p.goto('http://tll.test' + pg.path, { waitUntil: 'load', timeout: 60000 }).catch(e => errs.push('goto: ' + e.message.slice(0, 120)));
      await p.evaluate(() => document.fonts.ready).catch(() => {});
      await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); } scrollTo(0, 0); }).catch(() => {});
      await p.waitForTimeout(1500);
      const checks = await p.evaluate(CHECKS).catch(e => ({ error: String(e.message) }));
      await p.addScriptTag({ path: AXE });
      const res = await p.evaluate(async () => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }, rules: { 'label-content-name-mismatch': { enabled: true } }, resultTypes: ['violations', 'incomplete'] })).catch(e => ({ error: String(e.message), violations: [], incomplete: [] }));
      await p.keyboard.press('Tab').catch(() => {});
      const focus = await p.evaluate(FOCUS).catch(e => ({ error: String(e.message) }));
      const violations = (res.violations || []).map(v => ({ id: v.id, impact: v.impact, help: v.help, tags: v.tags.filter(t => /wcag|best/.test(t)), count: v.nodes.length, nodes: v.nodes.slice(0, 12).map(n => ({ target: n.target.join(' '), html: (n.html || '').slice(0, 160), summary: (n.failureSummary || '').replace(/\s+/g, ' ').slice(0, 220) })) }));
      const incomplete = (res.incomplete || []).map(v => ({ id: v.id, impact: v.impact, count: v.nodes.length, sample: v.nodes.slice(0, 4).map(n => n.target.join(' ')) }));
      const out = { page: pg.name, url: 'http://tll.test' + pg.path, width: w, fixture: pg.file, kind: pg.kind, note: pg.note, axe: res.testEngine ? res.testEngine.version : null, ms: Date.now() - t0, violations, incomplete, checks, focus, pageErrors: errs.slice(0, 12) };
      fs.writeFileSync(path.join(OUT, `axe-${pg.name}-${w}.json`), JSON.stringify(out, null, 1));
      const ser = violations.filter(v => v.impact === 'serious').reduce((a, v) => a + v.count, 0), crit = violations.filter(v => v.impact === 'critical').reduce((a, v) => a + v.count, 0);
      summary.push({ page: pg.name, width: w, critical: crit, serious: ser, moderate: violations.filter(v => v.impact === 'moderate').reduce((a, v) => a + v.count, 0), minor: violations.filter(v => v.impact === 'minor').reduce((a, v) => a + v.count, 0), rules: violations.map(v => v.id + ':' + v.impact + 'x' + v.count), incomplete: incomplete.map(v => v.id + 'x' + v.count), unlabeled: checks.unlabeled ? checks.unlabeled.length : null, sharedIds: checks.shared ? checks.shared.length : null, mains: checks.mains, floor: checks.floor, smallAfterFloor: checks.smallAfterFloor ? checks.smallAfterFloor.length : null, coveredByNote: focus.coveredByNote ? focus.coveredByNote.length : null, noRing: focus.noRingCount, errors: errs.length });
      console.log(`${pg.name} @${w}: critical ${crit}, serious ${ser}; ${violations.map(v => v.id + ':' + v.impact + 'x' + v.count).join(', ') || 'no violations'}; incomplete ${incomplete.map(v => v.id + 'x' + v.count).join(', ') || 'none'}; fields ${checks.fields} unlabeled ${checks.unlabeled && checks.unlabeled.length} shared ${checks.shared && checks.shared.length}; mains ${checks.mains}; floor ${checks.floor}; errors ${errs.length}; ${Date.now() - t0}ms`);
      await ctx.close();
    }
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 1));
}

/* ---------- static scan ---------- */
const SOURCES = [
  'scratchpad/p0-1031/after/site-head.html', 'scratchpad/p0-1031/after/site-footer.html', 'scratchpad/p0-1031/after/storytpl-head.html',
  'scratchpad/p0-1031/before/storytpl-footer.html', 'scratchpad/p0-1031/before/home-head.html', 'scratchpad/p0-1031/before/home-footer.html',
  'scratchpad/p0-1031/before/stories-head.html', 'scratchpad/p0-1031/before/stories-footer.html', 'scratchpad/p0-1031/before/map-head.html',
  'scratchpad/p0-1031/before/map-footer.html', 'scratchpad/p0-1031/before/contact-head.html', 'scratchpad/p0-1031/before/support-head.html',
  'scratchpad/p0-1031/before/mypassport-head.html', 'scratchpad/p0-1031/before/mypassport-footer.html',
  'src/pages/heroes-2026-10-29/code/about-head.html', 'src/pages/heroes-2026-10-29/code/for-expats-head.html', 'src/pages/heroes-2026-10-29/code/for-expats-footer.html',
  'src/pages/heroes-2026-10-29/code/travelers-head.html', 'src/pages/heroes-2026-10-29/code/travelers-footer.html',
  'reports/evidence/2026-09-30/webflow/page-code/editorial-charter.head.html', 'reports/evidence/2026-09-30/webflow/page-code/privacy.head.html',
  'reports/evidence/2026-09-30/webflow/page-code/terms.head.html', 'reports/evidence/2026-09-30/webflow/page-code/cookies.head.html',
  'src/pages/sweep-2026-10-19/travel-wire-footer-after.html',
  'src/pages/submit/live-2026-10-29/page-head-live.html', 'src/pages/submit/live-2026-10-29/page-footer-live.html', 'src/pages/share-photos/live-2026-10-23/page-footer-after.html',
  'src/pages/account/live-2026-10-27/page-footer-2026-10-27-after.html', 'src/pages/creators/live-2026-11-01/after/page-footer.html', 'src/pages/spotlight/live-2026-10-25/page-footer-after.html',
  'src/pages/contributors-template/live-2026-10-28/tll-pf5-n-v1.html', 'src/pages/country/v3/live-head-after.html', 'src/pages/country/v3/live-footer-after.html',
  'src/pages/destinations/v3/head-live-after-ds3.html', 'src/pages/the-map/live-2026-10-25/embed-682054d4-after.html', 'src/pages/about/after-2026-10-20b/embed-c024f6d7-about.html',
  'src/pages/home/live-2026-10-29/founders-a0d1cd97-after.html', 'src/pages/travelers/after-2026-10-20/tv-foot-e467ec5e.html', 'src/pages/travelers/after-2026-10-20/tv-head-d8735ad4.html',
  'src/pages/travelers/after-2026-10-20/tv-open-4cd74f9a.html', 'src/pages/story/live-2026-10-25/embed-5496c6ff-after.html', 'src/pages/edit-profile/live-2026-10-29/after/4080e4be.html',
  'src/components/member-bar/tll-member-bar-v1.html',
  ...STYLES, ...SCRIPTS, STORY_LAYER, COVER_LAYER,
];
/* font-size, and the font: shorthand (font:500 10.5px/1.4 ...), which the st3 footer and the magazine layers use */
const SMALL = /font(?:-size)?\s*:\s*(?:[a-z0-9 ]*?\s)?(9|9\.5|10|10\.5|11|11\.5)px(?![0-9])/g;
function lum(hex) { const c = hex.replace('#', ''); const n = c.length === 3 ? c.split('').map(x => x + x).join('') : c; const [r, g, b] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function mix(fg, a, bg) { const h = x => x.replace('#', '').match(/../g).map(v => parseInt(v, 16)); const f = h(fg), b = h(bg); return '#' + f.map((v, i) => Math.round(v * a + b[i] * (1 - a)).toString(16).padStart(2, '0')).join(''); }
function ratio(a, b) { const l1 = lum(a), l2 = lum(b); return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)); }
/* text and background pairs read from the saved CSS; alpha means the whole element is drawn at that opacity over `over` */
const PAIRS = [
  ['Keep reading label as it was (bright teal on paper)', '#00C9C8', '#FDF9F3', 'story aftermatter; the known 1.97:1'],
  ['Keep reading label now (story layer: muted on cream)', '#6B6660', '#F7F1E8', 'tll-mag-story-v1 .tll-related-header .tll-eyebrow-teal'],
  ['Keep reading label, st3 footer only (deep teal on cream)', '#067A79', '#F7F1E8', 'storytpl-footer --st3-teal-deep'],
  ['Bright teal eyebrow on cream', '#00C9C8', '#F7F1E8', '[class*=eyebrow] in a dark container that sits on cream'],
  ['Legal tabs text on cream', '#cfcbc4', '#F7F1E8', 'privacy/terms head [data-tll-legal=tabs] a'],
  ['Legal tabs text on ink (if the tabs sit in the dark hero)', '#cfcbc4', '#0A0B14', 'same rule, dark section'],
  ['Legal tab, current page (ink on rose)', '#0A0B14', '#F0507A', '[data-tll-legal=tabs] a[aria-current=page]'],
  ['Support club Join button dimmed (white on rose at 45% over ink)', mix('#ffffff', .45, '#0A0B14'), mix('#D63859', .45, '#0A0B14'), 'support-head [data-tll-club=join][aria-disabled=true]{opacity:.45}'],
  ['Support club Tip button dimmed (cream at 45% over ink)', mix('#F7F1E8', .45, '#0A0B14'), '#0A0B14', 'support-head [data-tll-club=tip][aria-disabled=true]{opacity:.45}'],
  ['Disabled Webflow button (white on rose at 55% over cream)', mix('#ffffff', .55, '#F7F1E8'), mix('#D63859', .55, '#F7F1E8'), 'site-footer .w-button:disabled{opacity:.55}'],
  ['Disabled UX button (white on rose at 55% over paper)', mix('#ffffff', .55, '#FDF9F3'), mix('#D63859', .55, '#FDF9F3'), 'tll-ux-v1 .tll-ux-btn[disabled]{opacity:.55}'],
  ['Export button disabled (white on rose at 60% over cream)', mix('#ffffff', .6, '#F7F1E8'), mix('#D63859', .6, '#F7F1E8'), 'tll-export-v1 .tll-exp button[disabled]{opacity:.6}'],
  ['Placeholder text on a white input', '#9a958c', '#ffffff', 'site-head tll-craft-polish ::placeholder'],
  ['Placeholder text on cream', '#9a958c', '#F7F1E8', 'same rule, cream field'],
  ['Travel Wire region tag, Europe (white on bright rose)', '#ffffff', '#F0507A', 'travel-wire footer RC.EUROPE, 9px'],
  ['Travel Wire region tag, Americas (white on amber)', '#ffffff', '#D98A2B', 'travel-wire footer RC.AMERICAS, 9px'],
  ['Travel Wire region tag, Middle East (white on #C8425E)', '#ffffff', '#C8425E', 'travel-wire footer, 9px'],
  ['Travel Wire region tag, Global (white on #4a4d63)', '#ffffff', '#4a4d63', 'travel-wire footer, 9px'],
  ['Travel Wire source line (muted on white)', '#6B6660', '#ffffff', 'travel-wire footer, 9px'],
  ['Travel Wire READ AT SOURCE link (deep teal on white)', '#067A79', '#ffffff', 'travel-wire footer, 9px'],
  ['Travel Wire chip, off (#3a3a3a on white)', '#3a3a3a', '#ffffff', 'travel-wire footer, 10px'],
  ['Charter DRAFT badge (amber text on amber tint)', '#b8791f', '#fbf0df', 'editorial-charter head [data-tll-draft], 9px bold'],
  ['Charter clients line (amber on cream)', '#b8791f', '#F7F1E8', 'editorial-charter head [data-tll-rule08=clients]'],
  ['Amber mono label on paper', '#D98A2B', '#FDF9F3', 'st3 --st3-amber, Traveler of the week 11px'],
  ['Amber label on ink', '#D98A2B', '#0A0B14', 'support [data-tll-club=soon]'],
  ['Shelf eyebrow (rose on white)', '#C8425E', '#ffffff', 'site-head .tll-shelf-eyebrow 11px'],
  ['Rose text on cream (bright)', '#F0507A', '#F7F1E8', 'h1 em, .tll-text-rose before tll-contrast-v1'],
  ['Rose text on cream (site rule)', '#C8325B', '#F7F1E8', 'tll-contrast-v1 .tll-text-rose'],
  ['White on bright rose button', '#ffffff', '#F0507A', 'tll-proto-parity .tll-nav-pen-cta before tll-contrast-v1'],
  ['White on dark rose button', '#ffffff', '#D63859', 'tll-contrast-v1 nav buttons, cover CTA'],
  ['Skip link (ink on bright rose)', '#0A0B14', '#F0507A', 'tll-v9-chrome .tll-skip'],
  ['Contact relay small print on ink', '#cfcbc4', '#0A0B14', 'contact-head [data-tll-relay-note] 10px'],
  ['Support note on ink', '#9a9cb3', '#0A0B14', 'support-head [data-tll-club=note] 13px'],
  ['Muted text on cream', '#6B6660', '#F7F1E8', '--tll-muted, captions and meta'],
  ['Muted text on paper', '#6B6660', '#FDF9F3', 'same on paper'],
  ['Slate on ink', '#9496AC', '#0A0B14', 'v9 retired grey repair on dark'],
  ['Cover byline on ink (photo at its darkest)', '#B9B3A8', '#0A0B14', 'tll-mag-cover-v1 .tll-mg-by, over the photo gradient'],
  ['Cover chip text over a white photo area (cream on 60% ink)', '#F7F1E8', mix('#0A0B14', .6, '#ffffff'), 'tll-mag-cover-v1 .tll-mg-chip worst case'],
  ['Location pill over a white photo area (cream on 72% ink)', '#F7F1E8', mix('#0A0B14', .72, '#ffffff'), 'tll-proto-parity [data-tll-loc] > span worst case'],
  ['Home search button (dark teal text on bright teal)', '#06302f', '#00C9C8', 'tll-proto-parity form.tll-home-search input[type=submit]'],
  ['Bright teal on ink', '#00C9C8', '#0A0B14', 'eyebrows on dark sections'],
  ['Story body text on cream', '#3a3a3a', '#F7F1E8', 'tll-proto-type .w-richtext p'],
  ['Story hero caption cream at 85% over ink', mix('#F7F1E8', .85, '#0A0B14'), '#0A0B14', 'cover kicker opacity .85 worst case'],
];
function runStatic() {
  const small = [], aria = [], roles = [];
  for (const f of SOURCES) {
    if (!fs.existsSync(path.join(ROOT, f))) { console.log('missing', f); continue; }
    const s = R(f); let m;
    SMALL.lastIndex = 0;
    while ((m = SMALL.exec(s))) {
      const before = s.slice(Math.max(0, m.index - 220), m.index); const after = s.slice(m.index, m.index + 60);
      const open = before.lastIndexOf('{'); let sel = open >= 0 ? before.slice(0, open) : before; const cut = Math.max(sel.lastIndexOf('}'), sel.lastIndexOf(';'), sel.lastIndexOf('\n'), sel.lastIndexOf('"'), sel.lastIndexOf('\'')); sel = sel.slice(cut + 1).trim();
      const decl = (open >= 0 ? before.slice(open + 1) : '') + after;
      const color = (decl.match(/(?:^|;|\s)color\s*:\s*([^;!}"']+)/) || [])[1];
      small.push({ file: f, size: m[1] + 'px', selector: sel.slice(-120), color: color ? color.trim() : null, decl: decl.replace(/\s+/g, ' ').slice(0, 160) });
    }
    const ra = /aria-label\s*[=:]\s*['"]([^'"]{1,80})['"]|setAttribute\('aria-label',\s*([^)]{1,90})\)/g;
    while ((m = ra.exec(s))) aria.push({ file: f, value: (m[1] || m[2]).trim(), context: s.slice(Math.max(0, m.index - 110), m.index).replace(/\s+/g, ' ').slice(-110) });
    const rr = /role\s*[=:]\s*['"]([a-z]+)['"]|setAttribute\('role',\s*'([a-z]+)'\)/g;
    while ((m = rr.exec(s))) roles.push({ file: f, role: m[1] || m[2], context: s.slice(Math.max(0, m.index - 100), m.index).replace(/\s+/g, ' ').slice(-100) });
  }
  /* Designer classes under 12px in the 13 Oct export CSS (the Webflow style dump) */
  let css = fs.readFileSync(path.join(EXPORT, 'css/tll-webflow.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media[^{]*\{/g, '');
  const designer = []; const rb = /([^{}]+)\{([^{}]*)\}/g; let m;
  while ((m = rb.exec(css))) { const d = m[2]; const f = d.match(/font-size\s*:\s*(9|9\.5|10|10\.5|11|11\.5)px/); if (f) designer.push({ selector: m[1].trim().replace(/\s+/g, ' ').slice(0, 90), size: f[1] + 'px', color: (d.match(/(?:^|;|\s)color\s*:\s*([^;]+)/) || [])[1] }); }
  const contrast = PAIRS.map(([name, fg, bg, where]) => ({ name, fg, bg, where, ratio: +ratio(fg, bg).toFixed(2), passAA: ratio(fg, bg) >= 4.5 }));
  const out = { generated: new Date().toISOString(), sources: SOURCES.length, smallText: small, designerUnder12: designer, ariaLabels: aria, roles, contrast };
  fs.writeFileSync(path.join(OUT, 'static-scan.json'), JSON.stringify(out, null, 1));
  console.log('sub-12px declarations in page code and layers:', small.length, '| Designer classes under 12px (export CSS):', designer.length, '| aria-label:', aria.length, '| role:', roles.length);
  const byFile = {}; small.forEach(x => { byFile[x.file] = (byFile[x.file] || 0) + 1; }); console.log(JSON.stringify(byFile, null, 1));
  console.log('\nCONTRAST'); for (const c of contrast) console.log(`${c.passAA ? 'pass' : 'FAIL'} ${c.ratio.toFixed(2)}:1  ${c.name}  (${c.fg} on ${c.bg})  ${c.where}`);
}

if (MODE === 'static') runStatic(); else runAxe().catch(e => { console.error(e); process.exit(1); });
