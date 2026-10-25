// Offline phone audit of the 13 Oct export pages with today's phone layers applied.
// Remote images get a local stand-in photo; other remote requests are dropped.
// Usage: node audit.mjs [width] [page ...]   (MEMBER=1 to show the members-only blocks)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../..');
const EXP = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/pages');
const OUT = path.join(DIR, '../audit');
const LAYERS = ['src/site-layers/tll-nav-phone-v1.html', 'src/pages/home/tll-home-hero-phone-v1.html', ...(process.env.EXTRA ? process.env.EXTRA.split(',') : [])]
  .map(f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/<\/?style[^>]*>/g, '')).join('\n');
const PHOTO = fs.readFileSync(path.join(ROOT, 'handoff/claude-design-source/v3/images/coast2.jpg'));
const [w = '390', ...pages] = process.argv.slice(2);
const list = pages.length ? pages : ['index', 'stories', 'travelers', 'destinations', 'the-map', 'account', 'about', 'submit', 'the-paw-passport'];
const hide = process.env.MEMBER ? 'anonymous' : 'members', show = process.env.MEMBER ? 'members' : 'anonymous';
const b = await chromium.launch();
const report = {};
for (const pg of list) {
  let html = fs.readFileSync(path.join(EXP, pg + '.html'), 'utf8');
  html = html.replace('</head>', `<style>[data-ms-content="${hide}"]{display:none!important}[data-ms-content="${show}"]{display:flex!important}${LAYERS}</style></head>`);
  const tmp = path.join(EXP, `__audit-${pg}.html`); fs.writeFileSync(tmp, html);
  const p = await b.newPage({ viewport: { width: +w, height: 844 }, deviceScaleFactor: 1 });
  await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith('file:')) return r.continue(); if (r.request().resourceType() === 'image') return r.fulfill({ body: PHOTO, contentType: 'image/jpeg' }); return r.abort(); });
  await p.goto('file://' + tmp, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(1200);
  report[pg] = await p.evaluate((W) => {
    const vis = e => { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const label = e => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ' "' + (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) + '"');
    const all = [...document.body.querySelectorAll('*')].filter(vis);
    const wide = all.filter(e => { const r = e.getBoundingClientRect(); return r.right > W + 1 && getComputedStyle(e).position !== 'fixed'; })
      .filter(e => !e.closest('[data-h3-track],.h3-track,[style*="overflow-x"]'))
      .filter(e => { let a = e.parentElement; while (a && a !== document.body) { const o = getComputedStyle(a).overflowX; if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') return false; a = a.parentElement; } return true; });
    const leaves = all.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim().length > 1));
    const tiny = leaves.filter(e => parseFloat(getComputedStyle(e).fontSize) < 12 && !e.closest('[aria-hidden="true"]'));
    const taps = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button]')].filter(vis)
      .filter(e => { const r = e.getBoundingClientRect(); return r.height < 40 && !(e.closest('p,li') && getComputedStyle(e).display === 'inline'); });
    const fixed = all.filter(e => getComputedStyle(e).position === 'fixed').map(label);
    const uniq = a => [...new Set(a)];
    return { scrollW: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
      wide: uniq(wide.slice(0, 400).map(label)).slice(0, 12), tiny: uniq(tiny.map(e => parseFloat(getComputedStyle(e).fontSize) + 'px ' + label(e))).slice(0, 15), tinyN: tiny.length,
      smallTaps: uniq(taps.map(e => (e.getBoundingClientRect().height | 0) + 'px ' + label(e))).slice(0, 15), smallTapsN: taps.length, fixed };
  }, +w);
  await p.screenshot({ path: path.join(OUT, `${pg}-${w}${process.env.MEMBER ? '-m' : ''}.png`), fullPage: true });
  await p.close(); fs.unlinkSync(tmp);
}
await b.close();
fs.writeFileSync(path.join(OUT, `audit-${w}${process.env.MEMBER ? '-m' : ''}.json`), JSON.stringify(report, null, 1));
for (const [k, v] of Object.entries(report)) console.log(k, 'scrollW', v.scrollW, 'h', v.height, 'wide', v.wide.length, 'tiny', v.tinyN, 'smallTaps', v.smallTapsN);
