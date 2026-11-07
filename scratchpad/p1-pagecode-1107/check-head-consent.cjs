/* Consent head fix check (7 Nov 2026): loads live pages with the site head block swapped for after/site-head.html and reports
   whether the consent state resolves outside the EEA (this machine is not in the EEA) and which tags then load. */
const { chromium } = require('playwright'); const fs = require('fs'); const { execSync } = require('child_process');
const dir = __dirname; const before = fs.readFileSync(dir + '/before/site-head.html', 'utf8').trim(), after = fs.readFileSync(dir + '/after/site-head.html', 'utf8').trim();
(async () => { const b = await chromium.launch();
  for (const variant of ['before', 'after']) for (const path of ['/', '/stories', '/stories/antarctica-marathon']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const hits = {};
    p.on('request', (r) => { const u = r.url(); for (const [k, re] of [['gtag', /googletagmanager\.com\/gtag\/js/], ['ga4collect', /google-analytics\.com\/(g\/)?collect/], ['ahrefs', /analytics\.ahrefs\.com/], ['adsense', /adsbygoogle\.js/], ['fc', /fundingchoicesmessages/]]) if (re.test(u)) hits[k] = (hits[k] || 0) + 1; });
    await p.route('https://www.thatlayover.life' + path, async (route) => { let body = execSync('curl -sS -m 60 https://www.thatlayover.life' + path, { maxBuffer: 1 << 26 }).toString('utf8'); const n = body.split(before).length - 1; if (n !== 1) throw new Error('head block occurs ' + n + ' times'); if (variant === 'after') body = body.replace(before, () => after); await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body }); });
    const errs = []; p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 100)));
    await p.goto('https://www.thatlayover.life' + path, { waitUntil: 'load', timeout: 90000 }); await p.waitForTimeout(9000);
    const st = await p.evaluate(() => new Promise((res) => { const out = { consent: JSON.stringify(window.__tllConsent), gtagFn: typeof window.gtag, dl: (window.dataLayer || []).filter((x) => x && x[0] === 'consent').map((x) => x[1] + ':' + JSON.stringify(x[2])).slice(0, 3) }; if (typeof __tcfapi === 'function') __tcfapi('getTCData', 2, (tc, ok) => { out.tc = ok && tc ? { gdprApplies: tc.gdprApplies, eventStatus: tc.eventStatus, cmpStatus: tc.cmpStatus } : 'no'; res(out); }); else { out.tc = 'no api'; res(out); } }));
    console.log(variant, path, JSON.stringify({ ...st, hits, errs })); await p.close(); }
  await b.close(); })();
