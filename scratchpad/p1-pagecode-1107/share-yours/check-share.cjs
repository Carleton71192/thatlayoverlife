/* Measures /stories with the share-yours script moved to the head as version 1.1.0 (inline, early insert) against the live 1.0.0 footer script. */
const { chromium } = require('playwright'); const fs = require('fs'); const { execSync } = require('child_process');
const NEW = fs.readFileSync(__dirname + '/v1.1.0.js', 'utf8');
const TAG = /<script src="https:\/\/cdn\.prod\.website-files\.com\/[^"]*tll_library_share_yours-1\.0\.0\.js" type="text\/javascript"><\/script>/;
(async () => { const b = await chromium.launch();
  for (const width of [390, 1440]) for (const variant of ['live', 'early']) { const out = [];
    for (let i = 0; i < 3; i++) {
      const ctx = await b.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, isMobile: width < 800, hasTouch: width < 800 }); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true }); if (width < 800) { await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
      const errs = []; p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 80)));
      await p.route('https://www.thatlayover.life/stories', async (route) => { let body = execSync('curl -sS -m 60 https://www.thatlayover.life/stories', { maxBuffer: 1 << 26 }).toString('utf8');
        if (variant === 'early') { if (!TAG.test(body)) throw new Error('tag not found'); body = body.replace(TAG, ''); body = body.replace('<head>', '<head><script id="tll-share-yours-1-1-0">' + NEW + '</script>'); }
        await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body }); });
      await p.addInitScript(() => { window.__cls = 0; window.__sh = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__cls += e.value; window.__sh.push([Math.round(e.startTime), +e.value.toFixed(3), (e.sources || []).slice(0, 2).map((s) => s.node && s.node.nodeType === 1 ? (s.node.id || s.node.className || s.node.tagName).toString().slice(0, 30) : '?')]); } }).observe({ type: 'layout-shift', buffered: true }); });
      await p.goto('https://www.thatlayover.life/stories', { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(10000);
      const r = await p.evaluate(() => ({ cls: +window.__cls.toFixed(3), sh: window.__sh.filter((s) => s[1] >= 0.02), share: !!document.getElementById('tll-lib-share'), shareText: (document.querySelector('#tll-lib-share p') || {}).textContent, pos: document.getElementById('tll-lib-share') && document.getElementById('tll-lib-share').previousElementSibling.className.slice(0, 40) }));
      out.push(r); await ctx.close(); }
    const med = out.map((o) => o.cls).sort((a, b) => a - b)[1];
    console.log(width, variant, 'cls runs', out.map((o) => o.cls).join('/'), 'median', med, 'share', out[0].share, '|', out[0].shareText, '| after:', out[0].pos, '| shifts run1:', JSON.stringify(out[0].sh).slice(0, 300)); }
  await b.close(); })();
