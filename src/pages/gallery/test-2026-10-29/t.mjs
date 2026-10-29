import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const places = ['Montenegro','Vietnam','Bulgaria','Ghana','Qatar','Antarctica','Deception Island','Patagonia'];
const tiles = places.map(p => `<div data-tll-loc="${p}" data-tll-img="http://img.test/a.jpg" data-tll-credit="NC · ${p.toUpperCase()}" style="position:relative;height:200px;background-size:cover"></div>`).join('');
const layer = fs.readFileSync(path.join(ROOT, 'src/site-layers/tll-lounge-labels-v1.js'), 'utf8');
const oldCss = '.tll-lounge-credit{position:absolute;left:24px;bottom:20px;padding:10px 12px;font:600 13px/1.9 monospace;letter-spacing:3px;background:rgba(10,11,20,.7);color:#fff;max-width:120px}';
const html = `<!doctype html><html><head><style>body{font-family:sans-serif;background:#F7F1E8}.g{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;max-width:1032px;margin:20px auto}@media(max-width:767px){.g{grid-template-columns:repeat(2,1fr)}}${oldCss}</style></head><body><div class="g">${tiles}</div>
<script>(function(){[].forEach.call(document.querySelectorAll('[data-tll-loc]'),function(t){t.style.backgroundImage="url('"+t.dataset.tllImg+"')";var c=document.createElement('span');c.className='tll-lounge-credit';c.textContent=t.dataset.tllCredit;t.appendChild(c);});})();</script>
${process.env.AFTER ? '<script>' + layer + '</script>' : ''}</body></html>`;
const b = await chromium.launch();
for (const w of [390, 1440]) { const p = await b.newPage({ viewport: { width: w, height: 700 } });
  await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://img.test/')) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'antarctica-landing.jpg')), contentType: 'image/jpeg' }); return r.fulfill({ body: html, contentType: 'text/html' }); });
  await p.goto('http://tll.test/gallery'); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(DIR, `${process.env.AFTER ? 'after' : 'before'}-${w}.png`) }); await p.close(); }
await b.close(); console.log('ok');
