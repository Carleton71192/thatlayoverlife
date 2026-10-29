import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import fs from 'fs';
const R='/home/user/thatlayoverlife/';const css=f=>fs.readFileSync(R+'handoff/claude-design-source/webflow-export-2026-10-13/css/'+f);
const b=await chromium.launch();
for (const [tag,bundle] of [['before','src/site-layers/tll-site-layers-v15.js'],['after','src/site-layers/tll-site-layers-v16.js']]) for (const w of [390,1440]) {
const html=fs.readFileSync(R+'src/pages/edit-profile/test-2026-10-29/fixture.html','utf8').replace('<!--BUNDLE-->','<script>'+fs.readFileSync(R+bundle,'utf8')+'</script>');
const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith('http://tll.test/css/'))return r.fulfill({body:css(u.split('/').pop()),contentType:'text/css'});if(u==='http://tll.test/edit-profile')return r.fulfill({body:html,contentType:'text/html; charset=utf-8'});return r.abort();});
await p.addInitScript(()=>{const member={id:'m',profileImage:'',customFields:{name:'Nancy'}};window.$memberstackDom={getCurrentMember:async()=>({data:member}),getMemberJSON:async()=>({data:{}}),updateMember:async()=>({}),updateMemberJSON:async()=>({}),getMemberCookie:()=>'t',onAuthChange:()=>{}};});
await p.goto('http://tll.test/edit-profile');await p.waitForTimeout(1500);
const o={h:await p.evaluate(()=>document.documentElement.scrollHeight),shut:await p.evaluate(()=>[...document.querySelectorAll('section.ep-sec')].map(s=>s.id+(s.classList.contains('tll-eps-shut')?':shut':':open')+' '+((s.querySelector('.tll-eps-chip')||{}).textContent||'')))};
if(tag==='after'){await p.evaluate(()=>document.querySelector('a[href="#ep-dirs"]').click());await p.waitForTimeout(300);o.afterTab=await p.evaluate(()=>document.getElementById('ep-dirs').classList.contains('tll-eps-shut')?'still shut':'opened');
 await p.screenshot({path:'/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/blk-'+w+'.png',fullPage:true});}
console.log(tag,w,JSON.stringify(o),errs.slice(0,2));await p.close();}
await b.close();
