const {chromium}=require('playwright');const fs=require('fs');
const R='/home/user/thatlayoverlife/';const L=fs.readFileSync(R+'src/site-layers/tll-expats-map-v1.js','utf8');
const html=fs.readFileSync(R+'src/pages/heroes-2026-10-29/fixtures/for-expats.html','utf8').replace(/<script[^>]*src=[^>]*><\/script>/g,'').replace('</body>','<script>'+L+'</script></body>');
const M='/tmp/mapdeps/node_modules/';
const data={v:1,expats:[{name:'Nancy Carleton',slug:'nancy-carleton',country:'dk',place:'Copenhagen, Denmark',from:'us'},{name:'Roberta Bianchi',slug:'roberta-bianchi',country:'it',place:'Florence, Italy',from:'it'},{name:'Zain M',slug:'zain-m',country:'th',place:'Bangkok, Thailand',from:'pk'}],countries:{dk:1,it:1,th:1}};
(async()=>{const b=await chromium.launch();
for(const w of [390,1440]){const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=r.request().url();
 if(u.startsWith('https://x.test/'))return r.fulfill({contentType:'text/html; charset=utf-8',body:html});
 if(u.includes('/expats-map'))return r.fulfill({contentType:'application/json',body:JSON.stringify(data)});
 const m=u.match(/cdn\.jsdelivr\.net\/npm\/([^@]+)@[^/]+\/(.+)$/);if(m)return r.fulfill({path:M+m[1]+'/'+m[2]});
 return r.abort();});
await p.goto('https://x.test/for-expats');await p.waitForTimeout(2500);
const info=await p.evaluate(()=>{const s=document.querySelector('[data-tll-x="expats-map"]');if(!s)return null;const prev=s.previousElementSibling;return {after:prev&&prev.getAttribute('data-tll-x'),on:[...s.querySelectorAll('path.on title')].map(t=>t.textContent),cards:[...s.querySelectorAll('.tll-em-c')].map(c=>c.innerText.replace(/\s+/g,' ')),ow:document.documentElement.scrollWidth-innerWidth};});
console.log(w,JSON.stringify(info),'errors',errs.filter(e=>!/CookieConsent|Webflow|jQuery|\$/.test(e)));
const s=await p.$('[data-tll-x="expats-map"]');if(s)await s.screenshot({path:'em'+w+'.png'});await p.close();}
await b.close();})();
