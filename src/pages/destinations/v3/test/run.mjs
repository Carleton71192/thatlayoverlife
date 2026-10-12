import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='warning'||m.type()==='error') errs.push(m.text()); });
  await p.route(/^https?:/, r => r.fulfill({status:200, contentType:'image/svg+xml', body:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="#c33"/></svg>'}));
  await p.goto('file:///home/user/thatlayoverlife/src/pages/destinations/v3/test/mock.html');
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({
    sub: document.querySelector('.tlldx-sub').textContent,
    h2: document.querySelector('.tlldx-h2').innerHTML,
    kicker: document.querySelector('[data-tll-atlas=kicker]').textContent,
    lis: [...document.querySelectorAll('[data-tll-atlas=grid] > li')].map(l => l.innerText.replace(/\n/g,' | ')),
    metas: [...document.querySelectorAll('[data-ds3=meta]')].map(m=>m.textContent),
    places: [...document.querySelectorAll('[data-ds3=place]')].map(m=>m.textContent),
    flags: [...document.querySelectorAll('[data-ds3=flag]')].map(f=>f.hidden?'hidden':(f.querySelector('img')||{}).src||'none'),
    ld: (document.getElementById('tll-ds3-itemlist')||{}).textContent,
    open: document.querySelector('.tlldx-card-open').getAttribute('href'),
    atlasHidden: [...document.querySelectorAll('[data-ds3=atlas]')].map(a=>getComputedStyle(a).display),
    scrollW: document.documentElement.scrollWidth,
    h1s: document.querySelectorAll('h1').length,
    cols: getComputedStyle(document.querySelector('[data-ds3=shelf] .w-dyn-items')).gridTemplateColumns,
  }));
  console.log(w, JSON.stringify(r, null, 1), 'errors:', errs);
  await p.screenshot({ path: `/home/user/thatlayoverlife/src/pages/destinations/v3/test/shot-${w}.png`, fullPage: true });
  // focus test
  await p.keyboard.press('Tab');
  await p.close();
}
await b.close();
