import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.route(/^https?:/, r => r.fulfill({status:200, contentType:'image/svg+xml', body:'<svg xmlns="http://www.w3.org/2000/svg"/>'}));
await p.goto('file:///home/user/thatlayoverlife/src/pages/destinations/v3/test/mock.html'); await p.waitForTimeout(500);
console.log(JSON.stringify(await p.evaluate(()=>({cards:[...document.querySelectorAll('[data-ds3=card]')].map(a=>a.getAttribute('href')),tiles:[...document.querySelectorAll('[data-ds3=tile]')].map(a=>a.getAttribute('href')),detail:document.documentElement.innerHTML.split('href="/detail_').length-1,ld:(document.getElementById('tll-ds3-itemlist')||{}).textContent})),null,1),errs);
await b.close();
