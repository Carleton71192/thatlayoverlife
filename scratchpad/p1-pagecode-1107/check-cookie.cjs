/* Cookie task check (7 Nov 2026). Copied from swap-live.cjs and extended: loads a live www.thatlayover.life page with the site
   footer custom-code block replaced by before/site-footer.html (as served) or after/site-footer.html (library script tag and
   CookieConsent.run block removed), then checks the consent stand-in in the site head, the footer "Cookie settings" link, the
   GA4 events helper and the pre-choice network. Usage:
     node check-cookie.cjs <path> <width> <layers: old|new> <variant: before|after> [runs=3]
     node check-cookie.cjs all [runs=3]      full matrix: home and a story page, 390 and 1440, layers old and new, before and after
   Each run prints one JSON line; the case ends with medians (fcp, lcp, cls) and the boolean checks. "all" also prints a summary
   that compares before and after per page, width and layers pin, and writes every run to RESULTS (default: beside the shots).
   Throttled like Lighthouse mobile when width < 800. The layers option swaps the site layers pin: old = the pin the page serves
   today (4fdf0e1 on home, f9e8ab4 on stories), new = staged 16.50.1 (pin 544f412). SHOTDIR=dir chooses where screenshots go.
   Requests watched: cookieconsent.umd.js (must be absent after), the site layers, and anything that must wait for a consent
   choice (googletagmanager.com/gtag, google-analytics.com, analytics.ahrefs.com, adsbygoogle.js, doubleclick.net). */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
const NEW = '544f412343657747c405d12d5d966a08784cccc5', NEWSRI = 'sha384-T/eNEKiifHPXkqmxXQNq0YE+noKr4zXkKi/jumEY/gtAu7S3qIZr3VvOmQOam/tB';
const DIR = __dirname, BEFORE = path.join(DIR, 'before', 'site-footer.html'), AFTER = path.join(DIR, 'after', 'site-footer.html');
const SHOTDIR = process.env.SHOTDIR || '/tmp/check-cookie'; fs.mkdirSync(SHOTDIR, { recursive: true });
const RESULTS = process.env.RESULTS || path.join(SHOTDIR, 'results.json');
const STORY = process.env.STORY || '/stories/spain-madrid-wedding-ibiza';
const WATCH = /googletagmanager\.com\/gtag|google-analytics\.com|analytics\.ahrefs\.com|adsbygoogle\.js|doubleclick\.net/;
const median = (a) => { const s = a.slice().sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
const med3 = (a) => { const s = a.slice().sort((x, y) => x - y); const m = Math.floor(s.length / 2); return +(s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2).toFixed(3); };

async function runOnce(pagePath, width, layers, variant, i) {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, isMobile: width < 800, hasTouch: width < 800, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (width < 800) { await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
  const reqs = { cookieconsent: [], layers: [], watched: [], fundingchoices: 0 };
  p.on('request', (r) => { const u = r.url(); const short = u.replace(/^https:\/\/[^/]+\//, '').slice(0, 90);
    if (/cookieconsent/.test(u)) reqs.cookieconsent.push(short); if (/site-layers|chunks\//.test(u)) reqs.layers.push(u.replace(/^https:\/\/[^/]+\/gh\/Carleton71192\/thatlayoverlife@/, '').replace(/^([0-9a-f]{7})[0-9a-f]{33}\/src\/site-layers\//, '$1 '));
    if (WATCH.test(u)) reqs.watched.push(u.slice(0, 120)); if (/fundingchoicesmessages\.google\.com/.test(u)) reqs.fundingchoices++; });
  const errors = []; p.on('pageerror', (e) => errors.push(String(e.message).slice(0, 160)));
  await p.route('https://www.thatlayover.life' + pagePath, async (route) => {
    let body = execSync('curl -sS -m 60 https://www.thatlayover.life' + pagePath, { maxBuffer: 1 << 26 }).toString('utf8');
    const before = fs.readFileSync(BEFORE, 'utf8').trim(), after = fs.readFileSync(AFTER, 'utf8').trim();
    const n = body.split(before).length - 1; if (n !== 1) throw new Error(`before/site-footer.html occurs ${n} times in the served page`);
    if (variant === 'after') body = body.replace(before, () => after);
    if (layers === 'new') { const re = /(<script[^>]*thatlayoverlife@)([0-9a-f]{40})(\/src\/site-layers\/tll-site-layers-v16\.js[^>]*>)/g; const m = body.match(re); if (!m || m.length !== 1) throw new Error('layers tag count ' + (m ? m.length : 0));
      body = body.replace(re, (tag, a, pin, c) => (a + NEW + c).replace(/integrity="[^"]*"/, 'integrity="' + NEWSRI + '"')); if (!body.includes(NEW)) throw new Error('layers swap failed'); }
    await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body });
  });
  await p.addInitScript(() => { window.__m = { lcp: 0, cls: 0, fcp: 0, shifts: [] };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__m.cls += e.value; window.__m.shifts.push([Math.round(e.startTime), +e.value.toFixed(3)]); } }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime; }).observe({ type: 'paint', buffered: true }); });
  await p.goto('https://www.thatlayover.life' + pagePath, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(12000);
  const m = await p.evaluate(() => window.__m);
  const errorsBeforeClick = errors.length;
  /* The stand-in: locked on window (configurable false, getter), run() a no-op, acceptedCategory() reading the real consent. */
  const win = await p.evaluate(() => { const out = {}; try {
    const d = Object.getOwnPropertyDescriptor(window, 'CookieConsent'); const cc = window.CookieConsent;
    out.ccPresent = !!cc; out.ccLocked = !!d && d.configurable === false && typeof d.get === 'function' && typeof d.set === 'function';
    out.ccKeys = cc ? Object.keys(cc).sort().join(',') : ''; out.acceptedCategoryFn = !!cc && typeof cc.acceptedCategory === 'function'; out.runFn = !!cc && typeof cc.run === 'function';
    out.necessary = cc && cc.acceptedCategory ? cc.acceptedCategory('necessary') : null; out.analytics = cc && cc.acceptedCategory ? cc.acceptedCategory('analytics') : null;
    try { out.runReturns = cc.run({}); out.runThrows = false; } catch (e) { out.runThrows = String(e); }
    out.ccLibraryDom = !!document.querySelector('#cc-main, .cc-main, [data-cc]'); out.tllEv = typeof window.tllEv;
    out.consent = window.__tllConsent ? { ready: window.__tllConsent.ready, analytics: window.__tllConsent.analytics, ads: window.__tllConsent.ads } : null;
    const dl = window.dataLayer || []; let def = null; for (const e of dl) { if (e && e[0] === 'consent' && e[1] === 'default') { def = e[2]; break; } }
    out.consentDefault = def ? { analytics_storage: def.analytics_storage, ad_storage: def.ad_storage } : null;
    out.tcfapi = typeof window.__tcfapi; out.googlefc = typeof window.googlefc; out.gtagTag = !!document.querySelector('script[src*="googletagmanager.com/gtag"]');
  } catch (e) { out.error = String(e); } return out; });
  /* Footer "Cookie settings" link: wrap googlefc.showRevocationMessage and callbackQueue.push, add a later capture listener on
     document (the head handler stops immediate propagation, so this one staying silent means the head handler ran), then click. */
  const click = await p.evaluate(async () => { const out = {}; try {
    const links = [].slice.call(document.querySelectorAll('a')).filter((a) => /^\s*cookie settings\s*$/i.test(a.textContent || ''));
    out.linkCount = links.length; const a = links.filter((x) => x.closest('footer') || x.hasAttribute('data-tll-cookie-prefs')).pop() || links.pop();
    if (!a) { out.found = false; return out; } out.found = true; out.href = a.getAttribute('href'); out.prefsAttr = a.hasAttribute('data-tll-cookie-prefs');
    window.googlefc = window.googlefc || {}; googlefc.callbackQueue = googlefc.callbackQueue || []; const q = googlefc.callbackQueue;
    const c = { pushes: 0, revocation: 0, laterCaptureRan: false, revocationErr: null }; const push = q.push; q.push = function () { c.pushes++; return push.apply(q, arguments); };
    out.revocationWrapped = typeof googlefc.showRevocationMessage === 'function';
    if (out.revocationWrapped) { const o = googlefc.showRevocationMessage; googlefc.showRevocationMessage = function () { c.revocation++; try { return o.apply(this, arguments); } catch (e) { c.revocationErr = String(e).slice(0, 120); } }; }
    const later = () => { c.laterCaptureRan = true; }; document.addEventListener('click', later, true);
    const qLen = () => (typeof q.length === 'number' ? q.length : null); out.queueBefore = qLen(); const href = location.href;
    try { a.click(); out.clickThrew = false; } catch (e) { out.clickThrew = String(e).slice(0, 160); }
    await new Promise((r) => setTimeout(r, 800)); document.removeEventListener('click', later, true);
    out.queueAfter = qLen(); out.pushes = c.pushes; out.revocationCalls = c.revocation; out.revocationErr = c.revocationErr; out.headHandlerRan = !c.laterCaptureRan; out.navigated = location.href !== href;
    out.reopenReached = c.pushes > 0 || c.revocation > 0 || (out.queueBefore !== null && out.queueAfter !== null && out.queueAfter > out.queueBefore);
  } catch (e) { out.error = String(e).slice(0, 160); } return out; });
  await p.waitForTimeout(1500); const clickErrors = errors.slice(errorsBeforeClick);
  const shot = path.join(SHOTDIR, `${pagePath.replace(/[^a-z0-9]+/gi, '_') || 'home'}-${width}-${layers}-${variant}-${i}.png`); await p.screenshot({ path: shot, fullPage: false });
  await b.close();
  return { path: pagePath, width, layers, variant, run: i, fcp: Math.round(m.fcp), lcp: Math.round(m.lcp), cls: +m.cls.toFixed(3), shifts: m.shifts.filter((s) => s[1] >= 0.01), errors: errors.slice(0, errorsBeforeClick), clickErrors, reqs, win, click, shot };
}

async function runCase(pagePath, width, layers, variant, runs) {
  const rows = []; for (let i = 1; i <= runs; i++) { const r = await runOnce(pagePath, width, layers, variant, i); rows.push(r); console.log(JSON.stringify(r)); }
  const w = rows[0].win, c = rows[0].click; const same = (f) => rows.every((r) => JSON.stringify(f(r)) === JSON.stringify(f(rows[0])));
  const checks = {
    noCookieConsentRequest: rows.every((r) => r.reqs.cookieconsent.length === 0),
    cookieconsentRequests: rows.map((r) => r.reqs.cookieconsent.length),
    layersServed: rows.map((r) => (r.reqs.layers.find((u) => /tll-site-layers-v16/.test(u)) || '').split(' ')[0]),
    standIn: rows.every((r) => r.win.ccPresent && r.win.ccLocked && r.win.acceptedCategoryFn && r.win.runFn && r.win.necessary === true && r.win.analytics === false && r.win.runThrows === false && !r.win.ccLibraryDom),
    ccKeys: w.ccKeys, tllEvFunction: rows.every((r) => r.win.tllEv === 'function'),
    consentReadyFalse: rows.every((r) => r.win.consent && r.win.consent.ready === false && r.win.consent.analytics === false),
    consentDefaultDenied: rows.every((r) => r.win.consentDefault && r.win.consentDefault.analytics_storage === 'denied' && r.win.consentDefault.ad_storage === 'denied'),
    noWatchedRequests: rows.every((r) => r.reqs.watched.length === 0), watched: [...new Set(rows.flatMap((r) => r.reqs.watched))],
    fundingchoicesRequests: rows.map((r) => r.reqs.fundingchoices), tcfapi: rows.map((r) => r.win.tcfapi),
    linkFound: rows.every((r) => r.click.found), clickNoThrow: rows.every((r) => r.click.found && r.click.clickThrew === false && r.clickErrors.length === 0),
    headHandlerRan: rows.every((r) => r.click.headHandlerRan === true), reopenReached: rows.every((r) => r.click.reopenReached === true),
    pushes: rows.map((r) => r.click.pushes), revocationCalls: rows.map((r) => r.click.revocationCalls), revocationWrapped: rows.map((r) => r.click.revocationWrapped),
    errorsUnion: [...new Set(rows.flatMap((r) => r.errors))], errorsPerRun: rows.map((r) => r.errors.length), clickErrorsUnion: [...new Set(rows.flatMap((r) => r.clickErrors))],
    stableAcrossRuns: same((r) => [r.win.ccKeys, r.win.tllEv, r.click.found, r.click.headHandlerRan]),
  };
  const summary = { path: pagePath, width, layers, variant, runs, fcp: median(rows.map((r) => r.fcp)), lcp: median(rows.map((r) => r.lcp)), cls: med3(rows.map((r) => r.cls)), fcpRuns: rows.map((r) => r.fcp), lcpRuns: rows.map((r) => r.lcp), clsRuns: rows.map((r) => r.cls), checks };
  console.log('CASE ' + JSON.stringify(summary)); return { summary, rows };
}

(async () => {
  const [, , a1, a2, a3, a4, a5] = process.argv; const all = [];
  if (a1 === 'all') {
    const runs = +a2 || 3; const paths = (process.env.PATHS || '/,' + STORY).split(','); const widths = (process.env.WIDTHS || '390,1440').split(',').map(Number);
    for (const pagePath of paths) for (const width of widths) for (const layers of ['old', 'new']) for (const variant of ['before', 'after']) all.push(await runCase(pagePath, width, layers, variant, runs));
    fs.writeFileSync(RESULTS, JSON.stringify(all, null, 1));
    console.log('\nSUMMARY (medians of ' + runs + ' runs; before = served footer, after = library and run block removed)');
    console.log('path | width | layers | variant | fcp | lcp | cls | cc req | stand-in | tllEv | ready false | no tracking | link click ok | head handler | reopen | errors');
    for (const { summary: s } of all) { const c = s.checks; console.log([s.path, s.width, s.layers, s.variant, s.fcp, s.lcp, s.cls, c.cookieconsentRequests.join('/'), c.standIn, c.tllEvFunction, c.consentReadyFalse, c.noWatchedRequests, c.clickNoThrow, c.headHandlerRan, c.reopenReached, c.errorsUnion.length].join(' | ')); }
    console.log('\nERRORS before vs after (union over runs):');
    for (const pagePath of paths) for (const width of widths) for (const layers of ['old', 'new']) { const bf = all.find((x) => x.summary.path === pagePath && x.summary.width === width && x.summary.layers === layers && x.summary.variant === 'before').summary.checks.errorsUnion; const af = all.find((x) => x.summary.path === pagePath && x.summary.width === width && x.summary.layers === layers && x.summary.variant === 'after').summary.checks.errorsUnion;
      console.log(`${pagePath} ${width} ${layers}: equal=${JSON.stringify(bf) === JSON.stringify(af)} before=${JSON.stringify(bf)} after=${JSON.stringify(af)}`); }
    console.log('results: ' + RESULTS);
  } else { const r = await runCase(a1, +a2 || 390, a3 || 'old', a4 || 'after', +a5 || 3); fs.writeFileSync(RESULTS, JSON.stringify([r], null, 1)); }
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
