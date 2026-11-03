const { chromium } = require('playwright');
const PAGES = ['/', '/stories', '/stories/antarctica-marathon', '/the-map', '/the-paw-passport', '/login', '/signup', '/submit', '/share-photos', '/for-expats', '/travelers', '/account'];
(async () => { const b = await chromium.launch(); const hosts = {};
  for (const path of PAGES) { const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
    p.on('request', (r) => { const h = new URL(r.url()).host; if (!h) return; hosts[h] = hosts[h] || { ok: 0, fail: 0, pages: new Set() }; hosts[h].pages.add(path); });
    p.on('requestfinished', (r) => { const h = new URL(r.url()).host; if (hosts[h]) hosts[h].ok++; });
    p.on('requestfailed', (r) => { const h = new URL(r.url()).host; if (hosts[h]) hosts[h].fail++; });
    try { await p.goto('https://www.thatlayover.life' + path, { waitUntil: 'load', timeout: 45000 }); await p.waitForTimeout(5000); } catch (e) {}
    await ctx.close(); }
  for (const [h, v] of Object.entries(hosts).sort()) console.log((v.fail && !v.ok ? 'BLOCKED ' : v.fail ? 'partial ' : 'ok      ') + h.padEnd(48) + ' ok ' + v.ok + ' fail ' + v.fail + '  ' + [...v.pages].slice(0, 4).join(' '));
  await b.close(); })();
