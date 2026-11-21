const fs = require('fs');
const { chromium } = require('playwright');
const { load, sleep } = require('./d.cjs');
const OUT = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-debug/results/extra2.jsonl';
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const w of [1440, 390]) for (const signed of [false, true]) {
    global.__ACT = async p => { const g = p.locator('.tll-map-cta-row a[href="#tll-map-canvas"]').first(); await g.scrollIntoViewIfNeeded(); await sleep(400);
      const before = await p.evaluate(() => { const m = document.getElementById('tll-map-layers'); return { y: Math.round(scrollY), mapTop: m ? Math.round(m.getBoundingClientRect().top) : null }; });
      const vis = await g.isVisible(); if (vis) { if (w < 800) await g.tap(); else await g.click(); } await sleep(1200);
      const after = await p.evaluate(() => { const m = document.getElementById('tll-map-layers'); return { y: Math.round(scrollY), hash: location.hash, mapTop: m ? Math.round(m.getBoundingClientRect().top) : null, fs: !!document.fullscreenElement, edit: !!document.querySelector('.tllm-edit-open,[data-tllm-editing="1"]') }; });
      return { text: (await g.innerText()).slice(0, 40), vis, before, after }; };
    const st = await load(browser, 'the-map.html', w, signed); st.tag = 'ghost'; fs.appendFileSync(OUT, JSON.stringify(st) + '\n'); console.log(w, signed ? 'in' : 'out', JSON.stringify(st.act)); } }
  finally { await browser.close(); }
})();
