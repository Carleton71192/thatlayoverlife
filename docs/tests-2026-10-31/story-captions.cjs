const {chromium}=require('playwright');const fs=require('fs');
const R='/home/user/thatlayoverlife/';let h=fs.readFileSync(R+'src/design/magazine-2026-10/story-build/fixture-pantanal-glimmers-in-the-wild.html','utf8');
const L=fs.readFileSync(R+'src/site-layers/tll-story-captions-v1.js','utf8');
h=h.replace('Kilometer 42 | pantanal-capybara-portrait<br>','Kilometer 42 | pantanal-capybara-portrait<br>Caption: pantanal-capybara-portrait | A capybara at Kilometer 42, unbothered.<br>Caption: pantanal-driving-the-transpantaneira | The road that ends on purpose.<br>').replace('</body>','<script>'+L+'</script></body>');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith('https://x.test/'))return r.fulfill({contentType:'text/html; charset=utf-8',body:h});return r.abort();});
await p.goto('https://x.test/stories/pantanal-glimmers-in-the-wild');await p.waitForTimeout(4000);
console.log(JSON.stringify(await p.evaluate(()=>({built:(document.querySelector('.tll-story-gallery')||{}).getAttribute?.('data-tll-gallery-built'),links:document.querySelectorAll('a.tll-gallery-link').length,inline:document.querySelectorAll('figure.tll-inline-photo').length,caps:[...document.querySelectorAll('.tll-ph-cap')].map(c=>c.tagName+': '+c.textContent),lb:[...document.querySelectorAll('a.tll-gallery-link script.w-json')].map(s=>{try{return JSON.parse(s.textContent).items[0].caption||''}catch(e){return 'x'}}).filter(Boolean)}))));
console.log('errors',errs.slice(0,3));await b.close();})();
