/* /stories at 390 with the after head and footer swapped in (and the share block 1.1.0 inline in the head, as staged): search input width, CLS, search still works. */
const { chromium } = require('playwright'); const fs = require('fs'); const { execSync } = require('child_process');
const bh = fs.readFileSync(__dirname + '/before/stories-head.html', 'utf8').trim(), ah = fs.readFileSync(__dirname + '/after/stories-head.html', 'utf8').trim();
const bf = fs.readFileSync(__dirname + '/before/stories-footer.html', 'utf8').trim(), af = fs.readFileSync(__dirname + '/after/stories-footer.html', 'utf8').trim();
const SHARE = fs.readFileSync(__dirname + '/share-yours/v1.1.0.js', 'utf8'); const TAG = /<script src="https:\/\/cdn\.prod\.website-files\.com\/[^"]*tll_library_share_yours-1\.0\.0\.js" type="text\/javascript"><\/script>/;
(async () => { const b = await chromium.launch();
  for (const width of [390, 1440]) for (const variant of ['live', 'staged']) { const runs = [];
    for (let i = 0; i < 3; i++) {
      const ctx = await b.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, isMobile: width < 800, hasTouch: width < 800 }); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true }); if (width < 800) { await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
      const errs = []; p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 80)));
      await p.route('https://www.thatlayover.life/stories', async (route) => { let body = execSync('curl -sS -m 60 https://www.thatlayover.life/stories', { maxBuffer: 1 << 26 }).toString('utf8');
        if (variant === 'staged') { for (const [x, y] of [[bh, ah], [bf, af]]) { if (body.split(x).length !== 2) throw new Error('block count'); body = body.replace(x, () => y); } if (!TAG.test(body)) throw new Error('share tag'); body = body.replace(TAG, '').replace('<head>', '<head><script>' + SHARE + '</script>'); }
        await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body }); });
      await p.addInitScript(() => { window.__cls = 0; window.__fcp = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__fcp = e.startTime; }).observe({ type: 'paint', buffered: true }); });
      await p.goto('https://www.thatlayover.life/stories', { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(10000);
      const r = await p.evaluate(() => { const i = document.getElementById('tll-lib-q'); const btn = document.querySelector('.tllsb-btn'); return { cls: +window.__cls.toFixed(3), fcp: Math.round(window.__fcp), inputW: i ? Math.round(i.getBoundingClientRect().width) : null, btnW: btn ? Math.round(btn.getBoundingClientRect().width) : null, merged: !!document.querySelector('.tll-filters-inner[data-tll-merged] .tllsb-form'), share: !!document.getElementById('tll-lib-share'), lead: document.querySelectorAll('[data-tll-lead]').length }; });
      if (i === 0 && variant === 'staged') { await p.focus('#tll-lib-q'); await p.keyboard.type('train'); await Promise.all([p.waitForURL(/\?q=train/, { timeout: 30000 }), p.keyboard.press('Enter')]); r.searchNav = p.url().endsWith('?q=train'); }
      r.errs = errs; runs.push(r); await ctx.close(); }
    const med = (k) => runs.map((x) => x[k]).sort((a, b) => a - b)[1];
    console.log(width, variant, 'cls med', med('cls'), 'runs', runs.map((x) => x.cls).join('/'), 'fcp med', med('fcp'), 'input', runs[0].inputW, 'btn', runs[0].btnW, 'merged', runs[0].merged, 'share', runs[0].share, 'lead', runs[0].lead, 'search', runs[0].searchNav, 'errs', JSON.stringify(runs.flatMap((x) => x.errs))); }
  await b.close(); })();
