const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  for (const path of ['/travelers', '/stories/antarctica-marathon', '/']) { const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const hits = [];
    p.on('request', (r) => { const u = r.url(); if (/doubleclick\.net|googleads|pagead\/ads|google-analytics\.com|googletagmanager\.com\/gtag|analytics\.ahrefs|adsbygoogle/.test(u)) hits.push(u.slice(0, 110)); });
    await p.goto('https://www.thatlayover.life' + path, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(8000);
    const st = await p.evaluate(() => ({ consent: JSON.stringify(window.__tllConsent || null), fc: !!document.querySelector('.fc-consent-root, .fc-dialog-container'), ads: !!window.adsbygoogle && window.adsbygoogle.loaded === true }));
    console.log(path, JSON.stringify(st), hits.length, JSON.stringify(hits.slice(0, 6))); await p.close(); }
  await b.close(); })();
