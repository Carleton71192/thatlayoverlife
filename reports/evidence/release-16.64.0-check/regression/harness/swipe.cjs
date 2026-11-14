const fs=require('fs');const { chromium } = require('/opt/node-tools/node_modules/playwright');
const H=require('./run.cjs');
(async()=>{
 const b=await chromium.launch({proxy:process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined});
 const out=[];
 for(const fail of [[],['^/stories$']]) for(const host of ['w','t']){
  // reuse runOne routing by passing a custom hook: run with scroll false, then act in page via sc.after
  const r=await H.runOne(b,{name:'swipe',host,path:'/',w:390,h:844,dpr:3,mobile:true,fail,wait:3000,after:async pg=>{
    const pre=await pg.evaluate(()=>{const s=document.querySelector('[data-h3-shelf]');s.scrollIntoView();return 1;});
    await pg.waitForTimeout(1500);
    const a=await pg.evaluate(()=>{const t=document.querySelector('[data-h3-shelf] [data-h3-track]');const cs=[...t.querySelectorAll('.h3-card')].filter(c=>!c.hidden);
      return cs.map(c=>{const i=c.querySelector('.h3-card-ph img');const ph=c.querySelector('.h3-card-ph');const by=c.querySelector('.h3-card-by'),ti=c.querySelector('.h3-card-title'),me=c.querySelector('.h3-card-meta');
        const last=[...c.children].filter(x=>x.getBoundingClientRect().height>0).pop();
        return {d:getComputedStyle(i).display,src:!!i.currentSrc,nw:i.naturalWidth,phH:Math.round(ph.getBoundingClientRect().height),cardH:Math.round(c.getBoundingClientRect().height),gap:Math.round(c.getBoundingClientRect().bottom-(last?last.getBoundingClientRect().bottom:0))};});});
    for(let k=0;k<8;k++){await pg.evaluate(()=>{const t=document.querySelector('[data-h3-shelf] [data-h3-track]');t.scrollBy({left:300});});await pg.waitForTimeout(400);}
    await pg.waitForTimeout(1500);
    const b2=await pg.evaluate(()=>{const t=document.querySelector('[data-h3-shelf] [data-h3-track]');return [...t.querySelectorAll('.h3-card')].filter(c=>!c.hidden).map(c=>{const i=c.querySelector('.h3-card-ph img');return (i.currentSrc?'s':'-')+(i.naturalWidth?'n':'0')+getComputedStyle(i).display[0];}).join(' ');});
    return {atRail:a,afterSwipe:b2};
  }});
  out.push({host,fail,after:r.after,errs:r.errs});
  console.error(host,fail,JSON.stringify(r.after).slice(0,600));
 }
 fs.writeFileSync(__dirname+'/../out/swipe.json',JSON.stringify(out,null,1));
 await b.close();
})();
