// Offline axe check (contrast and target size) of the export pages with TODAY's site head and site footer swapped in,
// plus the phone layers. Page bodies are still the 13 Oct export, so trust site chrome results most.
// Usage: AXE=<path to axe.min.js> node axe.mjs [width] [page ...]   (MEMBER=1 for signed-in blocks)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../..');
const EXP = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/pages');
const HEAD = fs.readFileSync(path.join(ROOT, 'src/pages/spotlight/live-2026-10-25/site-head-after.html'), 'utf8');
const FOOT = fs.readFileSync(path.join(ROOT, 'src/site/site-footer-2026-10-21-after.html'), 'utf8');
const LAYERS = ['src/site-layers/tll-nav-phone-v1.html', 'src/pages/home/tll-home-hero-phone-v1.html', ...(process.env.EXTRA ? process.env.EXTRA.split(',') : [])]
  .map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
const PHOTO = fs.readFileSync(path.join(ROOT, 'handoff/claude-design-source/v3/images/coast2.jpg'));
const AXE = fs.readFileSync(process.env.AXE, 'utf8');
const [w = '390', ...pages] = process.argv.slice(2);
const list = pages.length ? pages : ['index', 'stories', 'travelers', 'destinations', 'the-map', 'account', 'about', 'submit', 'the-paw-passport'];
const hide = process.env.MEMBER ? 'anonymous' : 'members', show = process.env.MEMBER ? 'members' : 'anonymous';
const swap = (html, a, b, repl) => { const i = html.indexOf(a), j = html.indexOf(b); return i < 0 || j < 0 ? html : html.slice(0, i + a.length) + '\n' + repl + '\n' + html.slice(j); };
const b = await chromium.launch(); const out = {};
for (const pg of list) {
  let html = fs.readFileSync(path.join(EXP, pg + '.html'), 'utf8');
  html = swap(html, '<!-- SITE HEAD CODE (Webflow site settings) -->', '<!-- /SITE HEAD CODE -->', HEAD + LAYERS);
  html = swap(html, '<!-- SITE FOOTER CODE (Webflow site settings) -->', '<!-- /SITE FOOTER CODE -->', FOOT);
  html = html.replace('</head>', `<style>[data-ms-content="${hide}"]{display:none!important}[data-ms-content="${show}"]{display:flex!important}</style></head>`);
  const tmp = path.join(EXP, `__axe-${pg}.html`); fs.writeFileSync(tmp, html);
  const p = await b.newPage({ viewport: { width: +w, height: 844 } });
  await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith('file:')) return r.continue(); if (r.request().resourceType() === 'image') return r.fulfill({ body: PHOTO, contentType: 'image/jpeg' }); return r.abort(); });
  await p.goto('file://' + tmp, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(2500);
  await p.addScriptTag({ content: AXE });
  const res = await p.evaluate(async () => {
    const r = await axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast', 'target-size', 'link-in-text-block'] }, resultTypes: ['violations'] });
    return r.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => { const el = document.querySelector(n.target[0]); const zone = el ? (el.closest('.tll-nav-v1') ? 'nav' : el.closest('footer,.tll-footer-v1,[role=contentinfo]') ? 'footer' : 'body') : '?';
      return { zone, target: n.target.join(' '), text: el ? (el.textContent || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 50) : '', why: (n.any[0] && n.any[0].message || '').slice(0, 140) }; }) }));
  });
  out[pg] = res; await p.screenshot({ path: path.join(DIR, `../audit/axe-${pg}-${w}${process.env.MEMBER ? '-m' : ''}.png`), fullPage: true });
  await p.close(); fs.unlinkSync(tmp);
  const c = {}; res.forEach(v => v.nodes.forEach(n => { const k = v.id + ':' + n.zone; c[k] = (c[k] || 0) + 1; }));
  console.log(pg, JSON.stringify(c));
}
await b.close();
fs.writeFileSync(path.join(DIR, `../audit/axe-${w}${process.env.MEMBER ? '-m' : ''}.json`), JSON.stringify(out, null, 1));
