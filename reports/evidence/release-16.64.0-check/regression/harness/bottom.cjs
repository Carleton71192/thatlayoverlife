const fs=require('fs');const { chromium } = require('/opt/node-tools/node_modules/playwright');
const H=require('./run.cjs');
(async()=>{
 const b=await chromium.launch({proxy:process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined});
 const out=[];
 for(let rep=0;rep<3;rep++) for(const [w,h,dpr,mob] of [[1440,900,1,false],[360,780,3,true]]) for(const host of ['w','t']){
  const r=await H.runOne(b,{name:'bottom',host,path:'/',w,h,dpr,mobile:mob,wait:6000,after:async pg=>{
    await pg.evaluate(()=>{window.__det=[];new PerformanceObserver(l=>{for(const e of l.getEntries())window.__det.push({t:Math.round(e.startTime),v:+e.value.toFixed(4),inp:e.hadRecentInput,src:(e.sources||[]).map(s=>({n:s.node&&s.node.nodeType===1?(s.node.tagName+'.'+String(s.node.className).slice(0,30)):(s.node?('#text:'+String(s.node.textContent).trim().slice(0,30)):'?'),p:[Math.round(s.previousRect.y),Math.round(s.previousRect.height)],c:[Math.round(s.currentRect.y),Math.round(s.currentRect.height)]}))});}).observe({type:'layout-shift'});});
    // scroll in steps like a reader
    for(let i=0;i<60;i++){const done=await pg.evaluate(()=>{scrollBy(0,innerHeight*0.6);return innerHeight+scrollY>=document.documentElement.scrollHeight-2;});await pg.waitForTimeout(250);if(done)break;}
    await pg.waitForTimeout(3000);
    return await pg.evaluate(()=>({det:window.__det,foot:(document.querySelector('footer')||{}).innerText?.replace(/\s+/g,' ').slice(0,400).replace(/[A-Z][a-z]+ [A-Z][a-z]+/g,'X'),h:document.documentElement.scrollHeight}));
  }});
  out.push({host,w,rep,after:r.after});
  console.error(host,w,rep,JSON.stringify(r.after.det).slice(0,700));
 }
 fs.writeFileSync(__dirname+'/../out/bottom.json',JSON.stringify(out,null,1));
 await b.close();
})();
