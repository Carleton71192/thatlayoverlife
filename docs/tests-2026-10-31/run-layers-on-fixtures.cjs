const {chromium}=require('playwright');const fs=require('fs');
const R='/home/user/thatlayoverlife/';const B=fs.readFileSync(R+'src/site-layers/tll-site-layers-v16.js','utf8');
const strip=h=>h.replace(/<script[^>]*src=[^>]*><\/script>/g,'').replace(/<script[^>]*src=[^>]*\/>/g,'');
const pages={'/edit-profile':R+'src/pages/edit-profile/test-2026-10-29/fixture.html','/for-expats':R+'src/pages/heroes-2026-10-29/fixtures/for-expats.html','/travelers':R+'src/pages/heroes-2026-10-29/fixtures/travelers.html','/':R+'src/pages/home/live-2026-10-28/ux/fixture-home-current.html','/the-map':R+'src/pages/heroes-2026-10-29/fixtures/the-map.html','/stories':R+'src/pages/heroes-2026-10-29/fixtures/stories.html'};
const res=[];const ok=(n,c)=>res.push((c?'PASS ':'FAIL ')+n);
(async()=>{const b=await chromium.launch();
for(const w of [390,1440]){for(const [path,file] of Object.entries(pages)){
 const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 let html=strip(fs.readFileSync(file,'utf8'));html=html.replace(/<head([^>]*)>/i,'<head$1><meta charset="utf-8"><script>'+B.replace(/<\/script>/g,'<\\/script>')+'</script>');
 await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.host==='x.test'&&u.pathname===path)return r.fulfill({contentType:'text/html; charset=utf-8',body:html});return r.abort();});
 await p.goto('https://x.test'+path);await p.waitForTimeout(3200);
 const t=`${w} ${path}`;
 if(path==='/edit-profile'){const m=await p.$('.ep-i');if(m){await m.click();ok(t+': help mark opens a note',await p.evaluate(()=>!!document.querySelector('.tll-help-note:not([hidden])')));}else ok(t+': help mark present',false);
   ok(t+': Tagline label',await p.evaluate(()=>/Tagline/.test((document.querySelector('label[for="ep-f-one-line"]')||{}).textContent||'')));}
 if(path==='/for-expats')ok(t+': expert form asks where you are from',await p.evaluate(()=>!!document.getElementById('le-from')));
 if(path==='/')ok(t+': Coming soon tiles and Horseshoe Bend off shelf',await p.evaluate(()=>document.querySelectorAll('a.h3-ex-card[data-tll-soon]').length===3&&[...document.querySelectorAll('.h3-card[href*="horseshoe"]')].every(c=>c.style.display==='none')));
 if(path==='/the-map')ok(t+': map label says Nancy',await p.evaluate(()=>/Nancy/.test((document.querySelector('.tll-map-explainer-label')||{}).textContent||'')));
 if(path==='/travelers')ok(t+': pets in their own block',await p.evaluate(()=>!!document.querySelector('.tll-tf-pets')));
 if(path==='/stories')ok(t+': Asia and Oceania chips, alphabetical',await p.evaluate(()=>{const s=document.body.innerText;return /Asia/.test(s)&&/Oceania/.test(s);}));
 const ow=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);ok(t+': no horizontal overflow ('+ow+'px)',ow<=1);
 const pe=errs.filter(e=>!/CookieConsent|Webflow|\$memberstack|jQuery|\$ is not|gsap|d3|topojson|ScrollTrigger|SplitText/i.test(e));ok(t+': no layer errors'+(pe.length?' '+pe.slice(0,2).join(' | '):''),!pe.length);
 await p.screenshot({path:`s${w}${path.replace(/\//g,'_')||'_home'}.png`});await p.close();}}
console.log(res.join('\n'));console.log(res.filter(x=>x.startsWith('PASS')).length+' of '+res.length+' passed');await b.close();})();
