/* tll-metrics-v1 (31 Oct 2026, Value Playbook Phase 9: private investor metrics). /account, site owner only: the Worker
   (POST /metrics) answers 403 to everyone else and nothing shows. Headline numbers counted from the live site, the change since
   the oldest kept day (up to 30 days back), a line of travelers and stories over time, and "Download investor snapshot": a
   one-page HTML file with the same numbers and the date, to attach to an email. Totals only, no names or places.
   No data-ms-* element touched. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/account')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/metrics';
var ROWS=[['travelers','Travelers'],['stories','Stories live'],['countries','Countries covered'],['writers','Writers'],['storiesLast30Days','Stories, last 30 days'],['pets','Pets'],
  ['companionLinks','Companion links'],['collectors','Collectors'],['collectionItems','Collection pieces'],['stampers','Members with stamps'],['stamps','Pursuit stamps'],['pawWaitlist','Paw Passport waitlist']];
var CSS='.tll-met{max-width:760px;margin:24px auto;padding:18px;border:1px solid #E0DACE;border-left:3px solid #067A79;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-met-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}.tll-met h3{font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 12px}'+
'.tll-met-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:0 0 14px}.tll-met-c{border:1px solid #E0DACE;border-radius:4px;padding:10px}'+
'.tll-met-c b{display:block;font:800 26px/1.1 "Playfair Display",Georgia,serif}.tll-met-c span{font-size:13px;color:#5F5A54}.tll-met-c i{display:block;margin-top:4px;font-style:normal;font:600 11px/1 "JetBrains Mono",monospace;color:#067A79}'+
'.tll-met button{border:0;background:#0A0B14;color:#FDF9F3;border-radius:4px;min-height:44px;padding:0 16px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-met small{display:block;color:#5F5A54;margin-top:8px}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function line(hist){var w=640,h=120,keys=[['travelers','#C8325B'],['stories','#067A79']],max=1;hist.forEach(function(d){keys.forEach(function(k){max=Math.max(max,d[k[0]]||0);});});
  var x=function(i){return hist.length<2?w/2:16+i*(w-32)/(hist.length-1);},y=function(v){return h-16-(v/max)*(h-32);};
  var s='<svg viewBox="0 0 '+w+' '+h+'" width="100%" role="img" aria-label="Travelers and stories over time"><line x1="16" y1="'+(h-16)+'" x2="'+(w-16)+'" y2="'+(h-16)+'" stroke="#E0DACE"/>';
  keys.forEach(function(k){s+='<polyline fill="none" stroke="'+k[1]+'" stroke-width="2.5" points="'+hist.map(function(d,i){return x(i).toFixed(1)+','+y(d[k[0]]||0).toFixed(1);}).join(' ')+'"/>';var last=hist[hist.length-1];s+='<text x="'+(w-16)+'" y="'+(y(last[k[0]]||0)-6).toFixed(1)+'" text-anchor="end" font-family="monospace" font-size="11" fill="'+k[1]+'">'+(k[0]==='travelers'?'Travelers ':'Stories ')+(last[k[0]]||0)+'</text>';});
  return s+'</svg>';}
function snapshot(d){var t=d.today,first=d.history[0];var rows=ROWS.map(function(r){var ch=first&&first.date!==t.date?(t[r[0]]-(first[r[0]]||0)):null;return '<tr><td>'+r[1]+'</td><td style="text-align:right;font-weight:700">'+t[r[0]]+'</td><td style="text-align:right;color:#067A79">'+(ch==null?'':(ch>=0?'+':'')+ch+' since '+first.date)+'</td></tr>';}).join('');
  return '<!doctype html><meta charset="utf-8"><title>That Layover Life: metrics '+t.date+'</title><style>body{max-width:720px;margin:40px auto;padding:0 16px;font:16px/1.5 Georgia,serif;color:#0A0B14}table{width:100%;border-collapse:collapse}td{padding:8px 4px;border-bottom:1px solid #E0DACE}h1{font-size:30px;margin:0 0 4px}p{color:#5F5A54}</style>'+
  '<h1>That Layover Life</h1><p>Counted from the live site on '+t.date+'. Totals only. Traffic figures come from Google Analytics separately.</p><table>'+rows+'</table>'+(d.history.length>1?'<h2 style="font-size:18px;margin-top:28px">Growth</h2>'+line(d.history):'')+'<p style="margin-top:24px">www.thatlayover.life</p>';}
function run(){
  if(document.getElementById('tll-met')||!tok())return;
  fetch(API,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:'{}'}).then(function(r){return r.status===200?r.json():null;}).then(function(d){
    if(!d||!d.ok||document.getElementById('tll-met'))return;var s=el('style');s.textContent=CSS;document.head.appendChild(s);
    var box=el('section','tll-met');box.id='tll-met';box.appendChild(el('p','tll-met-k','Only you see this'));box.appendChild(el('h3','','Investor metrics'));
    var g=el('div','tll-met-g'),first=d.history[0];
    ROWS.forEach(function(r){var c=el('div','tll-met-c');c.appendChild(el('b','',String(d.today[r[0]])));c.appendChild(el('span','',r[1]));
      if(first&&first.date!==d.today.date){var ch=d.today[r[0]]-(first[r[0]]||0);if(ch)c.appendChild(el('i','',(ch>=0?'+':'')+ch+' since '+first.date));}g.appendChild(c);});
    box.appendChild(g);if(d.history.length>1){var ch=el('div');ch.innerHTML=line(d.history);box.appendChild(ch);}
    var b=el('button','','Download investor snapshot');b.type='button';b.onclick=function(){var a=el('a');a.href=URL.createObjectURL(new Blob([snapshot(d)],{type:'text/html'}));a.download='that-layover-life-metrics-'+d.today.date+'.html';document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},2000);};
    box.appendChild(b);box.appendChild(el('small','','Counted from the live site. The growth line fills in one point a day from today.'));
    var after=document.getElementById('tll-exp'),main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);
    if(after)after.insertAdjacentElement('afterend',box);else if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);
  }).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,2000);});else setTimeout(run,2000);
})();
