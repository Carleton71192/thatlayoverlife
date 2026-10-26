// Site footer wordmark before and after tll-site-layers-v3, at 390 and 1280, with today's site head and footer.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const R = path.resolve(DIR, '../../..');
const swap = (h, a, b, x) => { const i = h.indexOf(a), j = h.indexOf(b); return h.slice(0, i + a.length) + x + h.slice(j); };
let base = fs.readFileSync(R + '/handoff/claude-design-source/webflow-export-2026-10-13/pages/about.html', 'utf8');
base = swap(base, '<!-- SITE HEAD CODE (Webflow site settings) -->', '<!-- /SITE HEAD CODE -->', fs.readFileSync(R + '/src/pages/spotlight/live-2026-10-25/site-head-after.html', 'utf8'));
base = swap(base, '<!-- SITE FOOTER CODE (Webflow site settings) -->', '<!-- /SITE FOOTER CODE -->', fs.readFileSync(R + '/src/site/site-footer-2026-10-21-after.html', 'utf8'));
base = base.replace('</head>', '<style>/* live footer is dark; the export lacks that class style */footer{background:#0A0B14}</style></head>');
const v3 = fs.readFileSync(R + '/src/site-layers/tll-site-layers-v3.js', 'utf8');
const b = await chromium.launch(); const errs = [];
for (const which of ['before', 'after']) for (const w of [390, 1280]) {
  const h = which === 'after' ? base.replace('</head>', '<script>' + v3 + '</script></head>') : base;
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 }); p.on('pageerror', e => errs.push(e.message));
  await p.route('**/*', r => r.request().url().startsWith('http://tll.test/') ? r.fulfill({ body: h, contentType: 'text/html; charset=utf-8' }) : r.abort());
  await p.goto('http://tll.test/about').catch(() => {}); await p.waitForTimeout(900);
  const a = await p.$('footer a[href="/"]'); if (!a) { console.log('no footer home link'); continue; }
  const info = await a.evaluate(e => ({ html: e.innerHTML.slice(0, 160), h: Math.round(e.getBoundingClientRect().height) }));
  console.log(which, w, JSON.stringify(info));
  const box = await a.boundingBox(); await p.screenshot({ path: path.join(DIR, `../footer-logo-${which}-${w}.png`), clip: { x: Math.max(0, box.x - 16), y: box.y - 16, width: Math.min(420, w), height: box.height + 60 }, fullPage: true });
  await p.close();
}
await b.close(); console.log('errors:', errs.length ? errs : 'none');
