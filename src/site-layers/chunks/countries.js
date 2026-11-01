/* tll-site-layers-v16 chunk countries: loaded by the core loader on paths matching /^\/countries\/[^/]+$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-series-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-wt-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 11px/1.3 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%);margin:0 0 10px;max-width:100%}'+
'.tll-wt-card-tape{position:absolute;top:10px;left:10px;z-index:3;margin:0;font-size:10px;padding:5px 10px}'+
'.tll-sr-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 16px;font:400 14px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-sr-chips button{min-height:44px;padding:0 14px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-sr-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-sr-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-sr-box{max-width:680px;margin:28px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-sr-box ol{margin:8px 0 0;padding-left:20px}.tll-sr-box p{margin:0 0 6px}.tll-sr-box b{font-weight:600}.tll-sr-box small{display:block;color:#5F5A54;margin-top:8px}'+
'.tll-sr-box a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-sr-kit a{margin-right:14px}.tll-sr-kit i{font-style:normal;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#5F5A54;margin-left:4px}'+
'.tll-sr-li{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;background:#0A0B14;color:#FDF9F3!important;text-decoration:none!important;font-weight:600}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-series-v1'))return;var s=el('style');s.id='tll-series-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:x&&x.division||'tll'},x||{}));}catch(e){}}
function tape(text,cls){return el('span','tll-wt-tape'+(cls?' '+cls:''),text);}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
function div(group){return group==='pets'?'paw-passport':'tll';}
function line(box,label,val){if(!val)return;var p=el('p');p.appendChild(el('b','',label+': '));p.appendChild(document.createTextNode(val));box.appendChild(p);}

function labelCards(cards){var by={};cards.forEach(function(c){by[c.slug]=c;});
  Object.keys(by).forEach(function(slug){[].slice.call(document.querySelectorAll('a[href="/stories/'+slug+'"],a[href^="/stories/'+slug+'?"]')).forEach(function(a){
    if(a.closest('.tll-wt-rail')||a.closest('nav,header,footer,.tll-sr-box'))return;var card=a.closest('.w-dyn-item')||a;if(card.querySelector('.tll-wt-card-tape'))return;
    if(getComputedStyle(card).position==='static')card.style.position='relative';card.appendChild(tape(by[slug].label,'tll-wt-card-tape'));card.setAttribute('data-tll-series',by[slug].series);});});}
function chips(series){if(document.getElementById('tll-sr-chips'))return;var have=series.filter(function(s){return s.stories.length;});if(!have.length)return;
  var first=document.querySelector('main .w-dyn-item a[href^="/stories/"]'),list=first&&first.closest('.w-dyn-list');if(!list)return;
  var row=el('div','tll-sr-chips');row.id='tll-sr-chips';row.setAttribute('role','group');row.setAttribute('aria-label','Story series');row.appendChild(el('span','tll-sr-k','Series'));var on='';
  have.forEach(function(s){var b=el('button','',s.name);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){on=on===s.slug?'':s.slug;
    [].slice.call(row.querySelectorAll('button')).forEach(function(x){x.setAttribute('aria-pressed',String(x===b&&on!==''));});
    [].slice.call(list.querySelectorAll('.w-dyn-item')).forEach(function(it){it.hidden=!!on&&it.getAttribute('data-tll-series')!==on;});track('series_filter',{series:on||'all',division:div(s.group)});});row.appendChild(b);});
  list.parentNode.insertBefore(row,list);}

function fieldsBox(d){var f=d.fields||{},s=d.series,box=el('aside','tll-sr-box'),name=d.label.split(' · ')[0];box.setAttribute('aria-label',name);box.appendChild(el('p','tll-sr-k',name));
  if(s==='the-free-evening'){var t=[f.time,f.start?'starting from a '+f.start.toLowerCase():''].filter(Boolean).join(', ');if(t)box.appendChild(el('p','',t));
    if(f.stops&&f.stops.length){var ol=el('ol');f.stops.forEach(function(x){ol.appendChild(el('li','',x.stop+(x.move?' · '+x.move:'')));});box.appendChild(ol);}}
  else if(s==='plus-one-day'){if(f.extraDays)box.appendChild(el('p','',f.extraDays+(f.extraDays===1?' extra day':' extra days')));line(box,'Who paid for what',f.whoPaid);line(box,'Best decision',f.best);line(box,'Worst decision',f.worst);}
  else if(s==='the-first-friend'){var a=[f.yearsThere?f.yearsThere+(f.yearsThere===1?' year in':' years in'):'',f.monthsItTook?'it took '+f.monthsItTook+(f.monthsItTook===1?' month':' months'):''].filter(Boolean).join(', ');if(a)box.appendChild(el('p','',a.charAt(0).toUpperCase()+a.slice(1)+'.'));
    line(box,'Where it happened',f.where);line(box,'What worked',f.worked);line(box,'What did not',f.didNot);}
  else if(s==='the-partner-who-moved-too'){var m=[f.from&&f.to?f.from+' to '+f.to:'',f.years].filter(Boolean).join(', ');if(m)box.appendChild(el('p','',m));line(box,'What happened to my work',f.work);line(box,'What I wish someone had told me',f.wish);}
  else if(s==='moving-back'){var mb=[f.from&&f.to?f.from+' back to '+f.to:'',f.yearsAway?f.yearsAway+' away':''].filter(Boolean).join(', ');if(mb)box.appendChild(el('p','',mb));line(box,'The strangest thing about home now',f.strangest);line(box,'What I kept from abroad',f.kept);}
  else if(s==='the-sitter-was-the-hero'){line(box,'The hero',f.sitter);}
  else if(s==='cats-who-travel'){line(box,'Carrier or harness',f.carrier);line(box,'Where they hid',f.hid);}
  if(f.when)box.appendChild(el('small','',(d.group==='pets'?"Writer's experience, ":'Written ')+f.when));
  return box.children.length>1?box:null;}
function petBox(b){var box=el('aside','tll-sr-box');box.setAttribute('aria-label','Pet-friendly or pet-tolerant?');box.appendChild(el('p','tll-sr-k','Pet-friendly or pet-tolerant?'));
  if(b.stayedAt){var p=el('p');p.appendChild(el('b','','Stayed at: '));if(b.url){var a=el('a','',b.stayedAt);a.href=b.url;a.rel=b.rel;a.target='_blank';p.appendChild(a);}else p.appendChild(document.createTextNode(b.stayedAt));if(b.city)p.appendChild(document.createTextNode(', '+b.city));box.appendChild(p);}
  line(box,'What we paid for the pet',b.paid);line(box,'Size or weight rule',b.sizeRule);line(box,'What made it welcoming',b.welcoming);line(box,'What we would tell the next owner',b.tell);
  box.appendChild(el('small','',"Writer's experience"+(b.when?', '+b.when:'')+'. No business can pay to change or remove a note.'));return box;}
function storyPage(slug){get('/series/story?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||document.getElementById('tll-sr-story'))return;
  var main=document.querySelector('main')||document.body,h1=main.querySelector('h1');var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var wrap=el('div');wrap.id='tll-sr-story';css();
  if(d.series){if(h1&&!document.querySelector('.tll-sr-head-tape')){var t=tape(d.label,'tll-sr-head-tape');h1.parentNode.insertBefore(t,h1);}
    var fb=fieldsBox(d);if(fb)wrap.appendChild(fb);
    if(d.safetyNote){var sn=el('aside','tll-sr-box');sn.appendChild(el('p','tll-sr-k','Safety, from the writer'));sn.appendChild(el('p','',d.safetyNote));wrap.appendChild(sn);}
    var sh=el('div','tll-sr-box'),li=el('a','tll-sr-li','Share on LinkedIn');li.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.origin+location.pathname);li.target='_blank';li.rel='noopener';
    li.addEventListener('click',function(){track('share_click',{channel:'linkedin',series:d.series,division:div(d.group)});});sh.appendChild(li);wrap.appendChild(sh);}
  /* Linked sponsor label (staged with the expat and pet previews): the existing "Reklame for" label gets the sponsor's name as a link. */
  var prev=false;try{prev=localStorage.getItem('tll-preview-pets')==='1'||localStorage.getItem('tll-preview-expat')==='1';}catch(e){}
  if(prev&&d.sponsor){var rk=document.querySelector('[data-tll-reklame]');if(!rk&&h1){rk=el('div','tll-reklame');rk.setAttribute('data-tll-reklame','1');rk.setAttribute('lang','da');h1.parentNode.insertBefore(rk,h1);}
    if(rk&&!rk.querySelector('a')){rk.textContent='Reklame for ';var sa=el('a','',d.sponsor.name);sa.href=d.sponsor.url;sa.target='_blank';sa.rel=d.sponsor.rel;sa.style.color='inherit';sa.addEventListener('click',function(){track('revenue_click',{slot:'sponsor_label',division:div(d.group)});});rk.appendChild(sa);}}
  if(d.petBox)wrap.appendChild(petBox(d.petBox));
  if(d.tripKit&&d.tripKit.length){var k=el('aside','tll-sr-box tll-sr-kit');k.appendChild(el('p','tll-sr-k','Trip Kit · reklamelink'));var p=el('p');
    d.tripKit.forEach(function(x){var a=el('a','',x.label);a.href=x.url;a.rel=x.rel;a.target='_blank';a.addEventListener('click',function(){track('revenue_click',{slot:'trip_kit',label:x.label,division:'tll'});});p.appendChild(a);});
    p.appendChild(el('i','','reklamelink'));k.appendChild(p);wrap.appendChild(k);}
  if(!wrap.children.length)return;var share=document.querySelector('.tll-story-share-row');if(share)share.parentNode.insertBefore(wrap,share);else if(body)body.insertAdjacentElement('afterend',wrap);else main.appendChild(wrap);});}

function run(){var m;
  if((m=/^\/stories\/([^/]+)$/.exec(P))){storyPage(m[1]);return;}
  if(!(P==='/stories'||/^\/countries\/[^/]+$/.test(P)||P==='/for-expats'||P==='/the-paw-passport'||P==='/pursuits/work-trips'))return;
  get('/series').then(function(d){if(!d||!d.ok)return;var cards=[];d.series.forEach(function(s){cards=cards.concat(s.stories);});if(!cards.length)return;css();
    labelCards(cards);if(P==='/stories')chips(d.series);setTimeout(function(){labelCards(cards);},2500);window.__tllSeries=d;});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
})();
/* src/site-layers/tll-ads-v1.js */
(function(){
var CLIENT='ca-pub-7257230007536660';
var SLOTS={inArticle:'',display:''};   /* fill from AdSense > Ads > By ad unit: an In-article unit and a Display (responsive) unit */
var P=location.pathname.replace(/\/+$/,'')||'/';
var ALLOW=/^\/stories(\/[^/]+)?$|^\/countries\/[^/]+$/.test(P);
window.adsbygoogle=window.adsbygoogle||[];
if(!ALLOW){window.adsbygoogle.pauseAdRequests=1;return;}
var CSS='.tll-ad{display:block;max-width:760px;margin:44px auto;padding:10px 0 0;border-top:1px solid #E0DACE;text-align:center;clear:both}'+
'.tll-ad::before{content:"Annonce";display:block;margin:0 0 8px;font:600 10px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#6B6660}'+
'.tll-ad ins{display:block;min-height:250px}.tll-ad.is-empty{display:none}'+
'.google-auto-placed{max-width:760px;margin:44px auto!important;padding-top:10px;border-top:1px solid #E0DACE}'+
'.tll-lib-ad{grid-column:1/-1}';
function css(){if(document.getElementById('tll-ads-v1'))return;var s=document.createElement('style');s.id='tll-ads-v1';s.textContent=CSS;document.head.appendChild(s);}
function script(){if(document.querySelector('script[src*="adsbygoogle.js"]'))return;var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+CLIENT;document.head.appendChild(s);}
function sponsored(){var t=(document.querySelector('[data-tll-sponsored]')||{}).textContent||'';return /\S/.test(t)||/\bReklame\b|\bHosted:/i.test((document.querySelector('.tll-story-ledger,.tll-ledger,main')||document.body).innerText.slice(0,4000));}
function unit(slot,fmt,extra){var w=document.createElement('aside');w.className='tll-ad'+(extra?' '+extra:'');w.setAttribute('aria-label','Annonce (advertisement)');
  var i=document.createElement('ins');i.className='adsbygoogle';i.setAttribute('data-ad-client',CLIENT);i.setAttribute('data-ad-slot',slot);
  if(fmt==='fluid'){i.setAttribute('data-ad-layout','in-article');i.setAttribute('data-ad-format','fluid');i.style.textAlign='center';}else{i.setAttribute('data-ad-format','auto');i.setAttribute('data-full-width-responsive','true');}
  w.appendChild(i);new MutationObserver(function(){if(i.getAttribute('data-ad-status')==='unfilled')w.classList.add('is-empty');}).observe(i,{attributes:true,attributeFilter:['data-ad-status']});
  return w;}
function push(w){try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){w.classList.add('is-empty');}}
function story(){
  if(sponsored()){window.adsbygoogle.pauseAdRequests=1;return;}
  var b=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')).filter(function(x){return x.id!=='tll-quick-answers';}).sort(function(x,y){return y.querySelectorAll(':scope>p').length-x.querySelectorAll(':scope>p').length;})[0];
  if(!b||document.querySelector('.tll-ad'))return;
  var ps=b.querySelectorAll(':scope>p');var words=(b.innerText||'').split(/\s+/).filter(Boolean).length;
  if(SLOTS.inArticle&&words>=600&&ps.length>=4){   /* Phase 0B: at most one in-article unit, after the third paragraph, none under 600 words */var hs=[].slice.call(b.querySelectorAll(':scope>h2')).filter(function(h){var before=0,n=h.previousElementSibling;while(n){if(n.tagName==='P')before++;n=n.previousElementSibling;}return before>=3;});
    var mid=hs.length?hs[Math.floor(hs.length/2)]:ps[Math.max(3,Math.floor(ps.length/2))];var w=unit(SLOTS.inArticle,'fluid');mid.parentNode.insertBefore(w,mid);push(w);}
  if(SLOTS.display){var w2=unit(SLOTS.display,'auto');b.parentNode.insertBefore(w2,b.nextSibling);push(w2);}
}
function library(){
  if(!SLOTS.display||document.querySelector('.tll-ad'))return;var cards=document.querySelectorAll('a.tll-lib-card');if(cards.length<12)return;
  var c=cards[8],cell=c.closest('.w-dyn-item')||c;var w=unit(SLOTS.display,'auto','tll-lib-ad');cell.parentNode.insertBefore(w,cell.nextSibling);push(w);
}
function country(){
  if(!SLOTS.display||document.querySelector('.tll-ad'))return;var lists=document.querySelectorAll('main .w-dyn-list,.w-dyn-list');var l=lists[lists.length-1];if(!l)return;
  var w=unit(SLOTS.display,'auto');l.parentNode.insertBefore(w,l.nextSibling);push(w);
}
/* Phase 0 (31 Oct): the ad script loads only after ad consent from the one consent tool (tll-consent-v3 in the site head). */
function consented(cb){var C=window.__tllConsent;if(C&&C.ready){if(C.ads)cb();return;}window.addEventListener('tll:consent',function h(e){if(e.detail&&e.detail.ads){window.removeEventListener('tll:consent',h);cb();}});}
function run(){css();consented(script);if(/^\/stories\/[^/]+$/.test(P))story();else if(P==='/stories')library();else if(/^\/countries\//.test(P))country();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,600);});else setTimeout(run,600);
})();
