// Mobile review of the live site (21 October 2026). Run from the repo root in a session whose network allows the site hosts:
//   node tools/mobile-review.mjs [origin]      default origin https://www.thatlayover.life
// For each page, at 390x844 (phone) and 1440x900 (desktop): a full-page screenshot, the page's scroll width against the viewport,
// every element wider than the viewport (first twelve, by selector), text under 12px, tap targets under 44px in the first two
// screens, console errors, broken images, and the response status. Output: reports/mobile-review/<date>/README.md plus the PNGs.
// Signed out only. It reads pages, it changes nothing.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Playwright lives in the global modules here, not in the repo, so resolve it either way.
const { chromium } = (() => { try { return require('playwright'); } catch { return require('/opt/node-tools/node_modules/playwright'); } })();
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ORIGIN = (process.argv[2] || 'https://www.thatlayover.life').replace(/\/$/, '');
const PAGES = [
  '/', '/stories', '/stories/even-brave-boys-get-scared', '/travelers', '/contributors/jay-carleton', '/destinations', '/countries/bulgaria',
  '/the-map', '/about', '/contact', '/newsletter', '/submit', '/share-photos', '/login', '/signup', '/account', '/edit-profile',
  '/my-passport', '/my-pets', '/the-paw-passport', '/support', '/travel-wire', '/editorial-charter', '/privacy', '/terms', '/this-page-does-not-exist',
];
const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844, mobile: true },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
];
const day = new Date().toISOString().slice(0, 10);
const out = join('reports', 'mobile-review', day);
mkdirSync(out, { recursive: true });

const sel = (el) => {
  const id = el.id ? '#' + el.id : '';
  const cls = (el.className && typeof el.className === 'string') ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
  return el.tagName.toLowerCase() + id + cls;
};

async function audit(page, vp) {
  return page.evaluate(({ vw, selSrc }) => {
    const sel = new Function('el', `return (${selSrc})(el)`);
    const wide = [];
    const small = [];
    const taps = [];
    const broken = [];
    const all = document.querySelectorAll('body *');
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (r.right > vw + 1 && r.width > 8) wide.push({ s: sel(el), right: Math.round(r.right), width: Math.round(r.width) });
      const fs = parseFloat(cs.fontSize);
      if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && fs && fs < 12) small.push({ s: sel(el), px: fs });
      if (/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && r.top < window.innerHeight * 2 && (r.width < 44 || r.height < 44) && r.width > 0) taps.push({ s: sel(el), w: Math.round(r.width), h: Math.round(r.height), t: (el.textContent || el.value || '').trim().slice(0, 30) });
      if (el.tagName === 'IMG' && el.complete && el.naturalWidth === 0 && el.getAttribute('src')) broken.push(el.getAttribute('src').slice(0, 120));
    }
    return {
      scrollWidth: document.documentElement.scrollWidth,
      wide: wide.slice(0, 12), wideCount: wide.length,
      small: small.slice(0, 8), smallCount: small.length,
      taps: taps.slice(0, 10), tapCount: taps.length,
      broken: broken.slice(0, 8), brokenCount: broken.length,
      title: document.title,
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 80)),
    };
  }, { vw: vp.width, selSrc: sel.toString() });
}

const browser = await chromium.launch();
const lines = [`# Mobile review, ${day}, ${ORIGIN}`, '', 'Signed out. Phone is 390 by 844, desktop 1440 by 900. "Wider than the screen" lists elements whose right edge passes the viewport; a scroll width above the viewport width means the page scrolls sideways.', ''];
for (const path of PAGES) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: vp.mobile ? 3 : 1, userAgent: vp.mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
    let status = 0;
    try {
      const res = await page.goto(ORIGIN + path, { waitUntil: 'networkidle', timeout: 45000 });
      status = res ? res.status() : 0;
      await page.waitForTimeout(1500);
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(800);
    } catch (e) {
      errors.push('load: ' + String(e).slice(0, 120));
    }
    const name = (path === '/' ? 'home' : path.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-')) + '-' + vp.name + '.png';
    try { await page.screenshot({ path: join(out, name), fullPage: true }); } catch {}
    let a = null;
    try { a = await audit(page, vp); } catch (e) { errors.push('audit: ' + String(e).slice(0, 120)); }
    lines.push(`## ${path} at ${vp.name} (${status})`, '');
    if (a) {
      lines.push(`- Title: ${a.title || '(none)'}; H1: ${a.h1.join(' | ') || '(none)'}`);
      lines.push(`- Scroll width ${a.scrollWidth} against ${vp.width}${a.scrollWidth > vp.width + 1 ? ' (scrolls sideways)' : ''}`);
      lines.push(`- Wider than the screen: ${a.wideCount}${a.wide.length ? ' ' + a.wide.map((w) => `${w.s} (${w.width}px, right edge ${w.right})`).join('; ') : ''}`);
      lines.push(`- Text under 12px: ${a.smallCount}${a.small.length ? ' ' + a.small.map((s) => `${s.s} ${s.px}px`).join('; ') : ''}`);
      lines.push(`- Tap targets under 44px in the first two screens: ${a.tapCount}${a.taps.length ? ' ' + a.taps.map((t) => `${t.s} ${t.w}x${t.h} "${t.t}"`).join('; ') : ''}`);
      lines.push(`- Broken images: ${a.brokenCount}${a.broken.length ? ' ' + a.broken.join('; ') : ''}`);
    }
    lines.push(`- Console errors: ${errors.length}${errors.length ? ' ' + [...new Set(errors)].slice(0, 5).join(' || ') : ''}`);
    lines.push(`- Screenshot: ${name}`, '');
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(out, 'README.md'), lines.join('\n'));
console.log('written', join(out, 'README.md'));
