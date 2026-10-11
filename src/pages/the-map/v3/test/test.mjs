import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const B='http://127.0.0.1:8799/mp3/', OUT=process.cwd()+'/';
const REC={v:2,travelers:[{id:'t1',name:'Me',color:'#F0507A',pet:false},{id:'t2',name:'Magnus',color:'#7C5CBF',pet:true}],states:{'208':{t1:'lived'},'076':{t1:'lived',t2:'visited'},'250':{t1:'visited',t2:'visited'},'024':{t1:'layover'},'900':{t1:'visited'},'752':{t2:'visited'}}};
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const errs=[];
async function page(w,h,file,rec){const ctx=await b.newContext({viewport:{width:w,height:h}});if(rec)await ctx.addInitScript(r=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('tllStates',r);localStorage.setItem('tllStatesAt',String(Date.now()));sessionStorage.setItem('seeded','1');}},JSON.stringify(rec));const p=await ctx.newPage();p.on('pageerror',e=>errs.push(file+w+': '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(file+w+' console: '+m.text());});await p.goto(B+file);await p.waitForTimeout(1800);return p;}
for(const w of [1280,375]){
  const p=await page(w,900,'page-member.html',REC);
  const r=await p.evaluate(()=>({counter:document.getElementById('tll-map-counter').textContent,big:document.querySelector('[data-mp3=total]').textContent,sub:document.querySelector('.mp3-sub').innerText,tiles:[...document.querySelectorAll('.mp3-tiles li')].map(l=>l.innerText.replace(/\s+/g,' ')),shown:document.getElementById('mp3-shown').textContent,stamps:document.querySelectorAll('.mp3-stamp').length,kos:document.querySelector('[data-id="900"]')?.getAttribute('aria-label'),swe:document.querySelector('[data-id="752"]')?.getAttribute('aria-label'),ago:document.querySelector('[data-id="024"]')?.innerText.replace(/\s+/g,' '),ex:[...document.querySelectorAll('.tll-map-explainer-card')].map(c=>c.innerText.replace(/\s+/g,' ')),h:[...document.querySelectorAll('h1,h2,h3')].map(x=>x.tagName+':'+x.textContent.trim().slice(0,30)),visitor:!document.querySelector('[data-mp3-visitor]').hidden,overflow:document.documentElement.scrollWidth>innerWidth}));
  console.log(w,JSON.stringify(r,null,0));
  await p.screenshot({path:OUT+`member-${w}-top.png`,fullPage:false,clip:undefined});
  await p.locator('#tll-passport').scrollIntoViewIfNeeded();await p.waitForTimeout(200);
  await p.screenshot({path:OUT+`member-${w}-passport.png`,fullPage:true});
  const before=await p.evaluate(()=>localStorage.getItem('tllStates'));
  // open editor from Kosovo stamp (on the drawn map) and Antigua (not on 110m)
  for(const id of ['900','028','074']){
    await p.locator(`[data-id="${id}"]`).first().click();await p.waitForTimeout(500);
    const o=await p.evaluate(()=>({q:document.getElementById('tllQ').value,rows:[...document.querySelectorAll('#tllL>div>span')].map(s=>s.textContent).slice(0,3),labels:[...document.querySelectorAll('#tllL button')].slice(0,3).map(b=>b.textContent),focus:document.activeElement.id,x:document.getElementById('tllX').getAttribute('role')}));
    console.log('open',id,JSON.stringify(o));
    if(id==='900'&&w===1280)await p.screenshot({path:OUT+'editor-1280.png'});
    if(id==='900'&&w===375)await p.screenshot({path:OUT+'editor-375.png'});
    await p.focus('#tllX');await p.keyboard.press('Enter');await p.waitForTimeout(900);
    console.log(' closed, focus back on', await p.evaluate(()=>document.activeElement.getAttribute('data-id')));
  }
  const after=await p.evaluate(()=>localStorage.getItem('tllStates'));
  console.log('tllStates unchanged by passport:',JSON.parse(before)&&before===after);
  // now edit through the editor: mark Sweden for Me as Stayed, then save
  await p.locator('[data-id="752"]').first().click();await p.waitForTimeout(400);
  await p.evaluate(()=>{const r=[...document.querySelectorAll('#tllL>div')].find(d=>/Sweden/.test(d.textContent));r.querySelectorAll('div')[0].querySelectorAll('button')[1].click();});
  await p.locator('#tllSave').click();await p.waitForTimeout(1000);
  console.log('after editor save:',await p.evaluate(()=>[document.querySelector('[data-mp3=total]').textContent,document.querySelector('[data-id="752"]').getAttribute('aria-label'),document.getElementById('tll-map-counter').textContent]));
  // list view, filters, search
  await p.locator('[data-v=list]').click();await p.locator('[data-st=been]').click();
  console.log('list been:',await p.evaluate(()=>[document.getElementById('mp3-shown').textContent,[...document.querySelectorAll('.mp3-table tbody tr:not(.mp3-lt) th')].map(t=>t.textContent).join(',')]));
  await p.screenshot({path:OUT+`member-${w}-list.png`,fullPage:false});
  await p.locator('[data-st=all]').click();await p.fill('#mp3-q','zzz');await p.waitForTimeout(100);
  console.log('nomatch visible',await p.locator('#mp3-none').isVisible());
  await p.fill('#mp3-q','us');console.log('us ->',await p.evaluate(()=>[...document.querySelectorAll('.mp3-table tbody tr:not(.mp3-lt) th')].map(t=>t.textContent).join(',')));
  await p.fill('#mp3-q','cote');console.log('cote ->',await p.evaluate(()=>document.getElementById('mp3-shown').textContent));
  await p.context().close();
}
for(const w of [1280,375]){
  const p=await page(w,900,'page-public.html',null);
  const r=await p.evaluate(()=>({member:[...document.querySelectorAll('[data-mp3-member]')].map(e=>getComputedStyle(e).display),visitor:getComputedStyle(document.querySelector('[data-mp3-visitor]')).display,text:document.getElementById('tll-passport').innerText.replace(/\s+/g,' '),cards:[...document.querySelectorAll('.tll-map-explainer-card')].map(c=>getComputedStyle(c).display+':'+c.innerText.replace(/\s+/g,' ').slice(0,50)),overflow:document.documentElement.scrollWidth>innerWidth}));
  console.log('public',w,JSON.stringify(r));
  await p.locator('#tll-passport').scrollIntoViewIfNeeded();await p.screenshot({path:OUT+`public-${w}.png`,fullPage:true});
  await p.context().close();
}
console.log('errors',errs);await b.close();
