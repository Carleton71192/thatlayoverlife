// Consent and evidence capture for the EU legal audit.
// Usage: node consent-test.js <url> <evidenceDir> [mode]
//   mode: A (no interaction, default), B (reject all), C (accept all), or "all"
// Fresh browser context per run. Records cookies, localStorage, sessionStorage, every network request
// grouped by host, console errors, failed requests, screenshots at 375, 768 and 1440, and axe results.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const url = process.argv[2];
const outDir = process.argv[3];
const modeArg = (process.argv[4] || 'A').toUpperCase();
const modes = modeArg === 'ALL' ? ['A', 'B', 'C'] : [modeArg];
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const exe = '/opt/pw-browsers/chromium';

const REJECT = [/afvis/i, /kun nødvendige/i, /reject/i, /decline/i, /only necessary/i, /nej tak/i];
const ACCEPT = [/accepter alle/i, /tillad alle/i, /accept all/i, /allow all/i, /^ok$/i, /accepter/i];

async function clickBanner(page, patterns) {
  const buttons = await page.locator('button, a[role=button], [role=button], input[type=button], input[type=submit]').all();
  for (const b of buttons) {
    const txt = ((await b.textContent().catch(() => '')) || (await b.getAttribute('value').catch(() => '')) || '').trim();
    if (patterns.some(p => p.test(txt))) { await b.click({ timeout: 3000 }).catch(() => {}); return txt; }
  }
  return null;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  let launch = { headless: true };
  try { if (fs.statSync(exe).isFile()) launch.executablePath = exe; } catch {}
  const browser = await chromium.launch(launch);
  const summary = {};
  for (const mode of modes) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'da-DK' });
    const page = await ctx.newPage();
    const requests = []; const failed = []; const consoleErrs = [];
    page.on('request', r => requests.push({ url: r.url(), type: r.resourceType(), method: r.method() }));
    page.on('requestfailed', r => failed.push(r.url() + ' :: ' + (r.failure() && r.failure().errorText)));
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
    page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text()); });
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    let clicked = null;
    if (mode === 'B') clicked = await clickBanner(page, REJECT);
    if (mode === 'C') clicked = await clickBanner(page, ACCEPT);
    await page.waitForTimeout(3000);
    const cookies = await ctx.cookies();
    const storage = await page.evaluate(() => ({
      localStorage: Object.fromEntries(Object.keys(localStorage).map(k => [k, (localStorage.getItem(k) || '').slice(0, 80)])),
      sessionStorage: Object.fromEntries(Object.keys(sessionStorage).map(k => [k, (sessionStorage.getItem(k) || '').slice(0, 80)])),
    }));
    const origin = new URL(url).hostname;
    const byHost = {};
    for (const r of requests) { const h = new URL(r.url).hostname; (byHost[h] = byHost[h] || []).push(r.type + ' ' + r.url.slice(0, 140)); }
    const thirdParty = Object.keys(byHost).filter(h => h !== origin && !h.endsWith('.' + origin));
    const bannerText = await page.evaluate(() => {
      const el = [...document.querySelectorAll('[id*=cookie i],[class*=cookie i],[id*=consent i],[class*=consent i],[aria-label*=cookie i]')][0];
      return el ? el.innerText.slice(0, 500) : null;
    });
    for (const w of [375, 768, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(outDir, `mode-${mode}-${w}.png`), fullPage: true });
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    const docWidth375 = await page.evaluate(async () => { return document.documentElement.scrollWidth; });
    await page.addScriptTag({ content: axeSrc });
    const axe = await page.evaluate(async () => await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] }));
    const result = {
      url, mode, clicked, status: resp && resp.status(), finalUrl: page.url(),
      title: await page.title(), lang: await page.evaluate(() => document.documentElement.lang),
      bannerFound: !!bannerText, bannerText,
      cookies: cookies.map(c => ({ name: c.name, domain: c.domain, expires: c.expires, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite })),
      storage, thirdPartyHosts: thirdParty, requestsByHost: byHost, failedRequests: failed, consoleErrors: consoleErrs,
      axeViolations: axe.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 8).map(n => n.target.join(' ')) })),
    };
    fs.writeFileSync(path.join(outDir, `mode-${mode}.json`), JSON.stringify(result, null, 2));
    summary[mode] = { cookies: cookies.length, thirdPartyHosts: thirdParty, failed: failed.length, consoleErrors: consoleErrs.length, axeViolations: axe.violations.length, bannerFound: !!bannerText, clicked };
    await ctx.close();
  }
  await browser.close();
  console.log(JSON.stringify(summary, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
