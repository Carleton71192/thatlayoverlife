// Reproduces "SETTINGS in the member bar does nothing on /account" and checks the fix.
// Page: today's account tab script (live 22 Oct footer), the member bar, and a stand-in for webflow.js smooth scroll
// (same-page # link: preventDefault, stopPropagation, history.pushState, scroll; no hashchange), as webflow.js does.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const foot = fs.readFileSync(path.join(ROOT, 'src/pages/account/live-2026-10-22/page-footer-2026-10-22-after.html'), 'utf8');
const a3 = foot.match(/<script id="tll-a3-account-js-v1">[\s\S]*?<\/script>/)[0];
const css = fs.readFileSync(path.join(ROOT, 'src/pages/account/a3-account.css'), 'utf8');
const bar = fs.readFileSync(path.join(DIR, '../tll-member-bar-v1.html'), 'utf8');
const fix = fs.readFileSync(path.join(DIR, '../tll-account-hash-tabs-v1.js'), 'utf8');
const wfScroll = `<script>document.addEventListener('click',function(e){var a=e.target.closest('a[href*="#"]');if(!a||a.pathname!==location.pathname||!a.hash)return;var t=document.querySelector(a.hash);if(!t)return;e.preventDefault();e.stopPropagation();if(location.hash!==a.hash)history.pushState({hash:a.hash},'',a.hash);t.scrollIntoView();});</script>`;
const page = (withFix) => `<!doctype html><html><head><style>${css}</style></head><body>
${withFix ? `<script>${fix}</script>` : ''}
<div data-ms-content="members">${bar.replace(' hidden>', '>')}
<section class="tll-account-hero"><h1>Hi, Nancy</h1><a data-tll-acct-signout href="#">Sign out</a></section>
<section class="tll-account-actions-section"><div><div class="tll-pickin-card">card</div></div></section>
<section class="tll-account-mine-section" id="stories"><div class="tll-account-mine-block">My stories</div><div class="tll-account-mine-block">My pets</div></section>
<section class="tll-account-settings-section" id="settings"><h2>Email and password</h2></section>
<div style="height:3000px"></div></div>${wfScroll}${a3}</body></html>`;
const b = await chromium.launch(); let fails = 0;
for (const withFix of [false, true]) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.route('**/*', r => r.request().url().startsWith('http://tll.test/') ? r.fulfill({ body: page(withFix), contentType: 'text/html' }) : r.abort());
  await p.goto('http://tll.test/account'); await p.waitForTimeout(300);
  const state = () => p.evaluate(() => ({ hash: location.hash, settingsShown: getComputedStyle(document.getElementById('settings')).display !== 'none', storiesShown: getComputedStyle(document.querySelector('.tll-account-mine-block')).display !== 'none', sel: (document.querySelector('[role=tab][aria-selected=true]') || {}).id }));
  await p.click('.tll-mbar a[href="/account#stories"]'); await p.waitForTimeout(200); const s1 = await state();
  await p.click('.tll-mbar a[href="/account#settings"]'); await p.waitForTimeout(200); const s2 = await state();
  await p.click('.tll-mbar a[href="/account#settings"]'); await p.waitForTimeout(200); const s3 = await state();
  const ok = s1.storiesShown && s1.sel === 'a3-tab-stories' && s2.settingsShown && s2.sel === 'a3-tab-settings' && s3.settingsShown;
  console.log(withFix ? 'with fix   ' : 'without fix', ok ? 'PASS' : 'FAIL', JSON.stringify({ contributions: s1, settings: s2, settingsAgain: s3 }));
  if (withFix && !ok) fails++;
  await p.close();
}
await b.close(); process.exit(fails);
