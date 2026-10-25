// Measures the header row at a given width, signed out (default) or signed in (MEMBER=1).
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../..');
const EXP = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13');
const [out, extra, w = '390'] = process.argv.slice(2);
let html = fs.readFileSync(path.join(EXP, 'pages/index.html'), 'utf8');
const hide = process.env.MEMBER ? '[data-ms-content="anonymous"]' : '[data-ms-content="members"]';
const show = process.env.MEMBER ? `[data-ms-content="members"]` : `[data-ms-content="anonymous"]`;
html = html.replace("</head>", `<style>${hide}{display:none !important}${show}{display:flex !important}</style></head>`);
if (process.env.MEMBER) html = html.replace('data-ms-member="first-name">Account<', 'data-ms-member="first-name">Nancy<');
if (extra) html = html.replace('</head>', '<style>' + fs.readFileSync(extra, 'utf8').replace(/<\/?style[^>]*>/g, '') + '</style></head>');
const tmp = path.join(EXP, 'pages/__nav.html'); fs.writeFileSync(tmp, html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 700 }, deviceScaleFactor: 2 });
await p.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
await p.goto('file://' + tmp).catch(() => {}); await p.waitForTimeout(900);
console.log(await p.evaluate(() => {
  const nav = document.querySelector('.tll-nav-v1'); const R = e => { if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return cs.display === 'none' || !r.width ? 'hidden' : `${r.left|0},${r.top|0} ${r.width|0}x${r.height|0} radius=${cs.borderRadius}`; };
  const chain=[];let e=nav.querySelector(".tll-nav-account-link");while(e&&e!==nav){chain.push(e.className.slice(0,24)+":"+getComputedStyle(e).display);e=e.parentElement;}
  return JSON.stringify({ chain, navH: nav.getBoundingClientRect().height | 0, logo: R(nav.querySelector('.tll-nav-logo')), share: R(nav.querySelector('.tll-nav-pen-cta')), login: R(nav.querySelector('.tll-nav-signin')), signup: R(nav.querySelector('.tll-nav-signup')), acct: R(nav.querySelector('.tll-nav-account-link')), menu: R(nav.querySelector('.tllmm-btn')), scrollW: document.documentElement.scrollWidth }, null, 0);
}));
await p.screenshot({ path: out, clip: { x: 0, y: 0, width: +w, height: 180 } }); await b.close(); fs.unlinkSync(tmp);
