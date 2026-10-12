import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const out={};
for (const f of ['bulgaria','denmark','chad','kosovo']) {
  for (const w of [1280,375]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
    await p.route('**/*', r => r.request().url().startsWith('file:')||r.request().url().startsWith('data:') ? r.continue() : r.abort());
    await p.goto('file://' + process.cwd() + '/' + f + '.html');
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${f}-${w}.png`, fullPage: true });
    const info = await p.evaluate(() => ({
      h:[...document.querySelectorAll('h1,h2,h3,[role=heading]')].filter(e=>e.offsetParent!==null).map(e=>(e.tagName+(e.getAttribute('aria-level')?'/'+e.getAttribute('aria-level'):''))+': '+e.textContent.trim().slice(0,70)),
      ld:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent.slice(0,400)),
      robots:(document.querySelector('meta[name=robots]')||{}).content||'',
      onmap:(document.querySelector('[data-ct3=onmap]')||{}).innerText||'',
      logit:(document.querySelector('.tllcx-cta a.tll-btn-primary')||{}).href,
      sources:(document.querySelector('[data-ct3=sources]')||{}).innerText||'',
      facts:(document.querySelector('[data-ct3=facts-note]')||{}).innerText||'',
      kicker:(document.querySelector('[data-ct3=filed-kicker]')||{}).innerText||'',
      meta:(document.querySelector('[data-tll-ctry-meta]')||{}).innerText||'',
      hscroll: document.documentElement.scrollWidth>window.innerWidth,
      heroH: document.querySelector('.tllcx-hero').getBoundingClientRect().height,
      small:[...document.querySelectorAll('a,[role=button]')].filter(a=>a.offsetParent!==null&&a.getBoundingClientRect().height<44&&!a.closest('[data-ct3=qa-list],[data-ct3=sources],[data-ct3=qa-from],[data-tll-cx-expats],nav')).map(a=>a.textContent.trim().slice(0,30)+':'+Math.round(a.getBoundingClientRect().height)),
      errs:[]
    }));
    info.errs=errs; out[f+'-'+w]=info;
    await p.close();
  }
}
console.log(JSON.stringify(out,null,1));
await b.close();
