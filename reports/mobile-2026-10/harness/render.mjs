// Offline render of the 13 Oct home export at phone width. Remote hosts are blocked here, so
// the hero photo is swapped for a local stand-in and every other remote request is dropped.
// Usage: node render.mjs <out.png> [extra.css] [width] [height]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../../..');
const EXP = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13');
const [out, extra, w = '390', h = '844'] = process.argv.slice(2);
let html = fs.readFileSync(path.join(EXP, 'pages/index.html'), 'utf8');
// today's hero CTA embed (13326a8e, read 26 Oct)
html = html.replace(/<p class="h3 h3-hero-free">[\s\S]*?<div class="h3 h3-hero-cta">[\s\S]*?<\/div>/,
 '<style>.h3-hero-free{margin:14px 0 0;font-family:var(--h3-mono);font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(247,241,232,.85)}</style><div class="h3 h3-hero-cta"><a class="h3-btn h3-btn-rose" href="/stories">Read the stories →</a><a class="h3-btn h3-btn-line" href="/the-map">Build your free map</a></div><p class="h3 h3-hero-free">Free, forever. No card, no paywall.</p>');
html = html.replace(/https:\/\/s3\.amazonaws\.com\/webflow-prod-assets\/[^"]*Curacao\.jpg/g, 'file://' + path.join(ROOT, 'handoff/claude-design-source/v3/images/coast2.jpg'));
// floating "Tell the editor" pill stand-in, as styled in the site footer (fixed bottom-left, z 60)
if (process.env.TLLP) html = html.replace('<body class="body"', '<body class="body tllp-home"');
html = html.replace('</body>', '<a id="tll-note" href="#" style="position:fixed;left:16px;bottom:16px;z-index:60;background:#0A0B14;color:#F7F1E8;border-radius:999px;padding:10px 16px;font:600 12px JetBrains Mono,monospace">Tell the editor</a></body>');
if (extra) html = html.replace('</head>', '<style id="harness-extra">' + fs.readFileSync(extra, 'utf8').replace(/^<style[^>]*>|<\/style>\s*$/g, '') + '</style></head>');
const tmp = path.join(EXP, 'pages', '__harness.html'); fs.writeFileSync(tmp, html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
await p.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
await p.goto('file://' + tmp, { waitUntil: 'load', timeout: 30000 }).catch(e => console.log('load:', e.message));
await p.waitForTimeout(1200);
const info = await p.evaluate(() => {
  const q = s => document.querySelector(s), r = el => el && el.getBoundingClientRect();
  const hero = q('[data-h3-hero]'), h1 = hero && hero.querySelector('h1');
  const lines = h1 ? Math.round(r(h1).height / parseFloat(getComputedStyle(h1).lineHeight)) : null;
  const ey = h1 && h1.previousElementSibling;
  const btns = [...document.querySelectorAll('[data-h3-hero] .h3-btn')].map(a => Math.round(r(a).width));
  const free = q('.h3-hero-free'), note = q('#tll-note');
  const ov = (a, b) => a && b && !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  return { body: document.body.className, heroH: hero && Math.round(r(hero).height), h1Size: h1 && getComputedStyle(h1).fontSize, h1Lines: lines,
    eyebrow: ey && { shown: getComputedStyle(ey).display !== 'none', color: getComputedStyle(ey).color },
    btns, freeColor: free && getComputedStyle(free).color, noteCoversFree: ov(r(free), r(note)), scrollW: document.documentElement.scrollWidth };
});
console.log(JSON.stringify(info));
await p.screenshot({ path: out }); await b.close(); fs.unlinkSync(tmp);
