const { chromium } = require('playwright');
const OLD = '4fdf0e1dd86efb7222ce9974a11c5f3b37dec395', NEWPIN = '8c86c215bfe6d410411ef2accfdd09a97a3568cb', NEWSRI = 'sha384-Q8cRDGMgdVyOjz9tprSh586TE//TU11ozIll+NC3TjPYRb0lVtVOvVA9zX5dVDGe';
const PAGES = process.argv.slice(2);
async function run(b, path, variant) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0; p.on('response', async (r) => { try { const h = await r.headerValue('content-length'); if (h) bytes += +h; } catch (e) {} });
  if (variant === 'new') await p.route('https://www.thatlayover.life' + path, async (route) => { let body = require('child_process').execSync('curl -sS -m 60 https://www.thatlayover.life' + path, { maxBuffer: 1 << 26 }).toString('utf8');
    body = body.replace(new RegExp('(<script[^>]*' + OLD + '[^>]*>)', 'g'), (tag) => tag.replace(OLD, NEWPIN).replace(/integrity="[^"]*"/, 'integrity="' + NEWSRI + '"'));
    if (!body.includes(NEWPIN)) throw new Error('swap failed'); await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body }); });
  await p.addInitScript(() => { window.__m = { lcp: 0, cls: 0, fcp: 0, el: '' }; new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__m.lcp = e.startTime; window.__m.el = String((e.element && (e.element.className || e.element.tagName)) || '').slice(0, 40); } }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime; }).observe({ type: 'paint', buffered: true }); });
  await p.goto('https://www.thatlayover.life' + path, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(10000);
  const m = await p.evaluate(() => ({ ...window.__m, js: performance.getEntriesByType('resource').filter((r) => /thatlayoverlife@/.test(r.name)).reduce((a, r) => a + (r.encodedBodySize || 0), 0), layer: [...document.scripts].map((s) => s.src).filter((s) => /tll-site-layers-v16/.test(s))[0] || '' }));
  await ctx.close(); return m;
}
(async () => { const b = await chromium.launch();
  for (const path of PAGES) for (const variant of ['old', 'new']) for (let i = 0; i < 3; i++) { const m = await run(b, path, variant);
    console.log(JSON.stringify({ path, variant, i, fcp: Math.round(m.fcp), lcp: Math.round(m.lcp), cls: +m.cls.toFixed(3), el: m.el, layersKB: Math.round(m.js / 1024), pin: m.layer.includes(NEWPIN) ? 'new' : m.layer.includes(OLD) ? 'old' : '?' })); }
  await b.close(); })();
