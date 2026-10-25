import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const head=fs.readFileSync('head.html','utf8');
const body=(item)=>`<main><section><a class="inline-a-0-1" href="/travelers">old</a></section>
<a class="inline-a-1-1"></a><a class="inline-a-2-1"></a><a class="inline-a-3"></a>
<div data-tll-spot-src hidden><div class="w-dyn-list">${item}</div></div></main>`;
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for (const [name,item] of [['featured','<div role="listitem" class="w-dyn-item"><div data-tll-spot data-slug="jay-carleton" data-name="Jay Carleton" data-credit="Full" data-pen="" data-badge="FOUNDING 02" data-home="Copenhagen, Denmark" data-line="Runs on <coffee>"><img src="https://example.com/jay.jpg"></div></div>'],['pen','<div class="w-dyn-item"><div data-tll-spot data-slug="x" data-name="Real Person" data-credit="Pen" data-pen="Wanderer" data-badge="" data-home="" data-line="" data-bio="Short bio"><img src=""></div></div>'],['none','<div class="w-dyn-empty">No items found.</div>']]){
  const p=await b.newPage({viewport:{width:390,height:800}});
  const errs=[];p.on('pageerror',e=>errs.push(String(e)));
  await p.route('**/*',r=>{const u=r.request().url(); if(u.startsWith('http://tll.test/spotlight'))return r.fulfill({contentType:'text/html',body:`<!doctype html><html><head>${head}</head><body>${body(item)}</body></html>`}); return r.fulfill({status:204,body:''});});
  await p.goto('http://tll.test/spotlight'); await p.waitForTimeout(800);
  const o=await p.evaluate(()=>{const a=document.querySelector('a.inline-a-0-1');return {href:a.getAttribute('href'),text:a.innerText.replace(/\s+/g,' '),html:a.innerHTML.includes('<coffee>')}});
  console.log(name,JSON.stringify(o),errs.slice(0,3));
  await p.screenshot({path:name+'.png'});
}
await b.close();
