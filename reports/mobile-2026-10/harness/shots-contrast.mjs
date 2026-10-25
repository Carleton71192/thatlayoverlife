// Before/after crops for the contrast layer: home header at 1440 and the /stories share button and rose heading.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const R = path.resolve(DIR, '../../..');
const EXP = R + '/handoff/claude-design-source/webflow-export-2026-10-13/pages';
const HEAD = fs.readFileSync(R + '/src/pages/spotlight/live-2026-10-25/site-head-after.html', 'utf8'), FOOT = fs.readFileSync(R + '/src/site/site-footer-2026-10-21-after.html', 'utf8');
const C = fs.readFileSync(R + '/src/site-layers/tll-contrast-v1.html', 'utf8');
const swap = (h, a, b, x) => { const i = h.indexOf(a), j = h.indexOf(b); return h.slice(0, i + a.length) + x + h.slice(j); };
const b = await chromium.launch();
for (const [pg, sel, w] of [['index', '.tll-nav-v1', 1440], ['stories', '.tll-cta-rose', 1440], ['stories', 'h3:has(.tll-text-rose)', 390]]) for (const on of [0, 1]) {
  let h = fs.readFileSync(`${EXP}/${pg}.html`, 'utf8');
  h = swap(h, '<!-- SITE HEAD CODE (Webflow site settings) -->', '<!-- /SITE HEAD CODE -->', HEAD + (on ? C : ''));
  h = swap(h, '<!-- SITE FOOTER CODE (Webflow site settings) -->', '<!-- /SITE FOOTER CODE -->', FOOT);
  h = h.replace('</head>', '<style>[data-ms-content="members"]{display:none!important}[data-ms-content="anonymous"]{display:flex!important}</style></head>');
  fs.writeFileSync(`${EXP}/__s.html`, h); const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
  await p.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  await p.goto(`file://${EXP}/__s.html`).catch(() => {}); await p.waitForTimeout(1500);
  const el = await p.$(sel); const tag = sel.replace(/[^a-z]/g, '').slice(0, 12);
  if (el) { if (sel !== '.tll-nav-v1') { const box = await el.boundingBox(); await p.screenshot({ fullPage: true, path: `${DIR}/../contrast-${pg}-${tag}-${on ? 'after' : 'before'}.png`, clip: { x: 0, y: Math.max(0, box.y - 60), width: Math.min(w, 900), height: box.height + 120 } }); } else await el.screenshot({ path: `${DIR}/../contrast-${pg}-${tag}-${on ? 'after' : 'before'}.png` }); }
  else console.log('missing', sel);
  await p.close();
}
await b.close(); fs.unlinkSync(`${EXP}/__s.html`);
