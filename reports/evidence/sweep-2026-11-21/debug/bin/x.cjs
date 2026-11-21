/* targeted checks: R1 on /for-expats, the /the-map full screen link, layers with changed markup */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, sleep } = require('./d.cjs');
const OUT = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-debug/results/extra.jsonl';
const rm = (re) => (h) => { const n = (h.match(re) || []).length; return h.replace(re, '<!-- removed by sweep -->'); };
const CASES = [
  { file: 'for-expats.html', w: 1440, q: '?country=Denmark', act: async p => p.evaluate(() => ({ h2: (document.querySelector('[data-tll-x="dir-h2"]') || {}).innerText, cards: document.querySelectorAll('[data-tll-x="dir-experts"] .tllx-card').length,
      fallback: !!document.querySelector('[data-tll-x="dir-fallback"]'), empty: [].map.call(document.querySelectorAll('.tllx-empty'), e => e.innerText.slice(0, 90)), quick: document.querySelectorAll('[data-tll-x] button').length })) },
  { file: 'for-expats.html', w: 390, q: '?country=Denmark', act: async p => p.evaluate(() => ({ h2: (document.querySelector('[data-tll-x="dir-h2"]') || {}).innerText, cards: document.querySelectorAll('[data-tll-x="dir-experts"] .tllx-card').length, empty: [].map.call(document.querySelectorAll('.tllx-empty'), e => e.innerText.slice(0, 90)) })) },
  { file: 'the-map.html', w: 1440, act: async p => { const a = p.locator('a[data-tll-map="fullscreen"]'); const vis = await a.isVisible(); const y0 = await p.evaluate(() => scrollY); if (vis) await a.click(); await sleep(800);
      const r = await p.evaluate(() => ({ fs: !!document.fullscreenElement, hash: location.hash, y: scrollY, canvas: !!document.getElementById('tll-map-canvas') })); const g = p.locator('.tll-map-cta-row a[href="#tll-map-canvas"]'); r.ghost = (await g.count()) ? (await g.first().innerText()).slice(0, 40) : null; r.vis = vis; r.y0 = y0; return r; } },
  { file: 'the-map.html', w: 390, act: async p => { const a = p.locator('a[data-tll-map="fullscreen"]'); const vis = await a.isVisible(); if (vis) await a.tap(); await sleep(800); return Object.assign({ vis }, await p.evaluate(() => ({ fs: !!document.fullscreenElement, hash: location.hash, y: scrollY }))); } },
  /* markup differs: containers the layers look for removed from the document */
  { file: 'stories__lisbon-sun-sails-city-built-to-stand-back-up.html', w: 390, mod: rm(/<section class="tll-story-gallery"[\s\S]*?<\/section>/), tag: 'no-gallery' },
  { file: 'stories__lisbon-sun-sails-city-built-to-stand-back-up.html', w: 390, mod: h => h.replace(/class="tll-story-share-row/g, 'class="x-share-row'), tag: 'no-share-row' },
  { file: 'stories__lisbon-sun-sails-city-built-to-stand-back-up.html', w: 1440, mod: h => h.replace(/<h1\b/, '<h2').replace(/<\/h1>/, '</h2>'), tag: 'no-h1' },
  { file: 'stories.html', w: 390, mod: h => h.replace(/tll-lib-grid/g, 'x-lib-grid'), tag: 'no-lib-grid' },
  { file: 'travelers.html', w: 390, mod: h => h.replace(/class="tv-card/g, 'class="x-card'), tag: 'no-tv-card' },
  { file: 'home.html', w: 390, mod: h => h.replace(/data-h3-track/g, 'data-x-track'), tag: 'no-h3-track' },
  { file: 'profile.html', w: 1440, mod: h => h.replace(/<h1\b/, '<h2').replace(/<\/h1>/, '</h2>'), tag: 'no-h1' },
  ...['home.html', 'stories.html', 'stories__balkans-ev-road-trip-twelve-countries.html', 'profile.html', 'travelers.html', 'about.html', 'the-paw-passport.html', 'for-expats.html', 'cookies.html', 'account.html', 'edit-profile.html'].map(f => ({ file: f, w: 390, tag: 'same-site' })),
];
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const c of CASES) { global.__Q = c.q || ''; global.__MOD = c.mod || null; global.__ACT = c.act || null;
      const st = await load(browser, c.file, c.w, false); st.file = c.file; st.tag = c.tag || c.q || 'act'; delete st.probe.dup;
      fs.appendFileSync(OUT, JSON.stringify(st) + '\n'); console.log(c.file, c.w, st.tag, 'errs', st.errs.length, JSON.stringify(st.act || '').slice(0, 300)); } }
  finally { await browser.close(); }
})();
