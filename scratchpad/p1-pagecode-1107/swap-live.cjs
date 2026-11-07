/* Loads a live www.thatlayover.life page in Playwright with saved code blocks replaced by edited ones, so a staged
   Webflow page-code change can be measured before it is written. Usage:
   node swap-live.cjs <path> <width> <layers: old|new> [before=after ...]   (each pair: file paths; "before" must occur
   once in the served HTML and is replaced by the contents of "after"). Prints JSON: fcp, lcp, cls, shifts, errors,
   requests matching /cookieconsent|site-layers/, and a screenshot path. Throttled like Lighthouse mobile when width < 800.
   The layers option swaps the site layers pin: old = live 16.49.0, new = staged 16.50.1 (pin 544f412). */
const { chromium } = require('playwright'); const fs = require('fs'); const { execSync } = require('child_process');
const OLD = '4fdf0e1dd86efb7222ce9974a11c5f3b37dec395', NEW = '544f412343657747c405d12d5d966a08784cccc5', NEWSRI = 'sha384-T/eNEKiifHPXkqmxXQNq0YE+noKr4zXkKi/jumEY/gtAu7S3qIZr3VvOmQOam/tB';
const [,, path, widthArg, layers, ...pairs] = process.argv; const width = +widthArg || 390; const out = process.env.SHOT || `/tmp/swap-${width}-${layers}.png`;
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, isMobile: width < 800, hasTouch: width < 800, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (width < 800) { await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
  const reqs = []; p.on('request', (r) => { if (/cookieconsent|site-layers|chunks\//.test(r.url())) reqs.push(r.url().replace(/^https:\/\/[^/]+\//, '').slice(0, 90)); });
  const errors = []; p.on('pageerror', (e) => errors.push(String(e.message).slice(0, 160)));
  await p.route('https://www.thatlayover.life' + path, async (route) => {
    let body = execSync('curl -sS -m 60 https://www.thatlayover.life' + path, { maxBuffer: 1 << 26 }).toString('utf8');
    for (const pair of pairs) { const [bf, af] = pair.split('='); const before = fs.readFileSync(bf, 'utf8').trim(), after = fs.readFileSync(af, 'utf8').trim(); const n = body.split(before).length - 1; if (n !== 1) throw new Error(`block ${bf} occurs ${n} times in the served page`); body = body.replace(before, () => after); }
    if (layers === 'new') { body = body.replace(new RegExp('(<script[^>]*' + OLD + '[^>]*>)'), (tag) => tag.replace(OLD, NEW).replace(/integrity="[^"]*"/, 'integrity="' + NEWSRI + '"')); if (!body.includes(NEW)) throw new Error('layers swap failed'); }
    await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body });
  });
  await p.addInitScript(() => { window.__m = { lcp: 0, cls: 0, fcp: 0, shifts: [] };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__m.cls += e.value; window.__m.shifts.push([Math.round(e.startTime), +e.value.toFixed(3), (e.sources || []).slice(0, 3).map((s) => { const n = s.node; return n ? (n.id ? '#' + n.id : (n.nodeType === 1 ? n.tagName.toLowerCase() + '.' + String(n.className).split(' ').slice(0, 2).join('.') : '#text')).slice(0, 50) + ' y' + Math.round(s.previousRect.y) + '>' + Math.round(s.currentRect.y) : '?'; })]); } }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime; }).observe({ type: 'paint', buffered: true }); });
  await p.goto('https://www.thatlayover.life' + path, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(12000);
  const m = await p.evaluate(() => window.__m); await p.screenshot({ path: out, fullPage: false });
  console.log(JSON.stringify({ path, width, layers, fcp: Math.round(m.fcp), lcp: Math.round(m.lcp), cls: +m.cls.toFixed(3), shifts: m.shifts.filter((s) => s[1] >= 0.01), errors, reqs, shot: out }));
  await b.close();
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
