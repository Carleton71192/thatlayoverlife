const { chromium } = require('playwright');
const [,, path, sel] = process.argv;
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true });
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.addInitScript((sel) => { window.__log = []; const t0 = performance.now(); let last = '';
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__log.push(['LCP', Math.round(e.startTime), (e.element && (e.element.className || e.element.tagName) || '').toString().slice(0, 50)]); }).observe({ type: 'largest-contentful-paint', buffered: true });
    const tick = () => { const el = document.querySelector(sel); let why = 'missing';
      if (el) { why = 'shown'; for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none') { why = (cs.opacity === '0' ? 'opacity0' : cs.visibility === 'hidden' ? 'hidden' : 'none') + ' on ' + (n.id ? '#' + n.id : n.tagName.toLowerCase() + '.' + String(n.className).split(' ').slice(0, 2).join('.')).slice(0, 70) + ' html.' + document.documentElement.className.slice(0, 80); break; } } }
      if (why !== last) { window.__log.push([why, Math.round(performance.now() - t0)]); last = why; }
      if (performance.now() - t0 < 25000) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); }, sel);
  await p.goto('https://www.thatlayover.life' + path, { waitUntil: 'load', timeout: 90000 }); await p.waitForTimeout(12000);
  console.log(JSON.stringify(await p.evaluate(() => window.__log), null, 0)); await b.close(); })();
