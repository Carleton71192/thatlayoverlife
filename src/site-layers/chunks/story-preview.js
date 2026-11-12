/* tll-site-layers-v16 chunk story-preview: loaded by the core loader on paths matching /^\/stories\/[^/]+$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-story-ask-v1.js */
(function(){
if(!/^\/stories\/[a-z0-9-]+\/?$/.test(location.pathname))return;
var CSS=".tll-sa{margin:28px 0 0;padding:20px 22px;border:1px solid rgba(10,11,20,.14);border-radius:2px;background:#FDF9F3;font-size:16px;line-height:1.5;color:#1A1A1A}"+
".tll-sa-k{display:block;margin:0 0 6px;font:600 12px/1.4 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:#C8325B}"+
".tll-sa a{color:#1A1A1A;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:4px}"+
".tll-sa a:hover{color:#C8325B}.tll-sa a:focus-visible{outline:2px solid #C8325B;outline-offset:2px}";
function run(){if(document.querySelector('.tll-sa'))return;var row=document.querySelector('.tll-story-share-row');if(!row)return;
  var s=document.createElement('style');s.id='tll-story-ask-v1';s.textContent=CSS;document.head.appendChild(s);
  var p=document.createElement('p');p.className='tll-sa';
  p.innerHTML='<span class="tll-sa-k">Write for TLL</span>Went somewhere worth telling? <a href="/submit">Pitch a layover story →</a> or <a href="/share-photos">send one photo</a>.';
  row.insertAdjacentElement('afterend',p);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
/* src/site-layers/tll-story-captions-v1.js */
(function(){
if(!/^\/stories\/[^/]+\/?$/.test(location.pathname))return;
var CSS='.tll-ph-cap{display:block;margin:8px 0 0;font:400 14px/1.45 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54;text-align:left}'+
'.tll-inline-photo .tll-ph-cap{padding:0 4vw}@media(max-width:767px){.tll-inline-photo .tll-ph-cap{padding:0 16px}}'+
'.tll-story-gallery .tll-ph-cap{font-size:13px;margin:6px 0 0}';
function go(){
  var X=window.tllPh,sec=document.querySelector('.tll-story-gallery');if(!X||!X.P||!sec||sec.getAttribute('data-tll-gallery-built')!=='1')return false;
  var caps={};X.P().split(/\r?\n/).forEach(function(l){var m=/^\s*caption\s*:\s*([^|]+)\|(.+)$/i.exec(l);if(m)caps[m[1].trim().toLowerCase()]=m[2].trim().slice(0,300);});
  if(!Object.keys(caps).length)return true;
  if(!document.getElementById('tll-story-captions-v1')){var st=document.createElement('style');st.id='tll-story-captions-v1';st.textContent=CSS;document.head.appendChild(st);}
  [].forEach.call(document.querySelectorAll('a.tll-gallery-link'),function(a){
    var img=a.querySelector('img');if(!img||a.__tllCap)return;var c=caps[X.S(img.getAttribute('src'))];if(!c)return;a.__tllCap=1;
    var fig=a.closest('figure.tll-inline-photo');var cap=document.createElement(fig?'figcaption':'span');cap.className='tll-ph-cap';cap.textContent=c;
    if(fig)fig.appendChild(cap);else a.parentNode.insertBefore(cap,a.nextSibling);
    var js=a.querySelector('script.w-json');if(js){try{var d=JSON.parse(js.textContent);(d.items||[]).forEach(function(it){it.caption=c;});js.textContent=JSON.stringify(d);}catch(e){}}
  });
  return true;
}
var n=0;(function t(){if(go())return;if(++n>60)return;setTimeout(t,200);})();
})();
/* src/site-layers/tll-pros-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/pros';
var ROUTE_LIVE=false,pv=/[?&]preview=wire(&|$)/.test(location.search);try{pv=pv||localStorage.getItem('tll-preview-wire')==='1';}catch(e){}
if(!ROUTE_LIVE&&!pv)return;
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-pro-label{display:inline-block;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:2px;text-transform:uppercase;color:#C8325B;border:1.5px solid #C8325B;border-radius:2px;padding:3px 8px;margin:0 0 12px}'+
'.tll-pro-box{max-width:680px;margin:36px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #067A79;border-radius:4px;background:#fff;display:flex;gap:14px;align-items:center;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-pro-rek{color:#0A0B14;border-color:#0A0B14;margin-right:8px}.tll-pro-rek a{color:inherit}'+
'.tll-pro-box img{width:56px;height:56px;border-radius:50%;object-fit:cover;flex:none}.tll-pro-box p{margin:0}.tll-pro-k{font:600 11px/1.4 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79}'+
'.tll-pro-box a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-pro-badge{display:inline-flex;gap:6px;align-items:center;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;background:#0A0B14;color:#FDF9F3;border-radius:999px;padding:6px 10px;margin:8px 0}'+
'.tll-pro-badge b{color:#00C9C8;font-weight:600}'+
'.tll-pro-row{max-width:1120px;margin:32px auto;padding:0 16px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-pro-row .tll-pro-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}'+
'.tll-pro-row a.tll-pro-card{display:flex;gap:10px;align-items:center;border:1px solid #E0DACE;border-radius:8px;padding:10px;background:#fff;color:#0A0B14;text-decoration:none}.tll-pro-card img{width:40px;height:40px;border-radius:50%;object-fit:cover}.tll-pro-card small{display:block;color:#5F5A54}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-pros-v1'))return;var s=el('style');s.id='tll-pros-v1';s.textContent=CSS;document.head.appendChild(s);}
function story(pros){
  var main=document.querySelector('main')||document.body,by=main.querySelector('a[href^="/contributors/"]');if(!by)return;
  var slug=(by.getAttribute('href').split('/')[2]||'').replace(/[?#].*$/,''),p=pros.filter(function(x){return x.slug===slug;})[0];if(!p||document.querySelector('.tll-pro-label'))return;css();
  var h1=main.querySelector('h1'),CAT={'move-pros':'Move pros','pet-travel-pros':'Pet travel pros','road-warrior':'Road warrior'};
  if(h1){var lab=el('div','tll-pro-label','From the Pros'+(CAT[p.category]?' · '+CAT[p.category]:''));
    /* Paid or hosted, or a piece about the pro's own paid service: "Reklame for [name]" comes first, the name linked, rel sponsored. */
    if(p.sponsored&&!document.querySelector('.tll-pro-rek')){var rk=el('div','tll-pro-label tll-pro-rek');rk.appendChild(document.createTextNode('Reklame for '));if(p.url){var ra=el('a','',p.linkName);ra.href=p.url;ra.target='_blank';ra.rel='sponsored noopener noreferrer';rk.appendChild(ra);}else rk.appendChild(document.createTextNode(p.linkName));h1.parentNode.insertBefore(rk,h1);h1.parentNode.insertBefore(document.createTextNode(' '),h1);}
    h1.parentNode.insertBefore(lab,h1);}
  var box=el('aside','tll-pro-box');box.setAttribute('aria-label','About the writer');if(p.avatar){var im=el('img');im.src=p.avatar;im.alt='';box.appendChild(im);}
  var t=el('div');t.appendChild(el('p','tll-pro-k','From the Pros'));var line=el('p');line.appendChild(document.createTextNode(p.name+(p.line?', '+p.line:'')+'. '));
  if(p.url){var a=el('a','',p.linkName);a.href=p.url;a.rel=p.rel;a.target='_blank';line.appendChild(a);}t.appendChild(line);box.appendChild(t);
  var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var share=document.querySelector('.tll-story-share-row');
  if(share)share.parentNode.insertBefore(box,share);else if(body)body.insertAdjacentElement('afterend',box);else main.appendChild(box);
}
function profile(pros,slug){var p=pros.filter(function(x){return x.slug===slug;})[0];if(!p||document.querySelector('.tll-pro-badge'))return;css();
  var h1=(document.querySelector('main')||document.body).querySelector('h1');if(!h1)return;var b=el('div','tll-pro-badge');b.appendChild(el('b','','Pro'));if(p.line)b.appendChild(document.createTextNode(p.line));h1.insertAdjacentElement('afterend',b);}
function hub(pros,slug){var list=pros.filter(function(x){return x.pursuit&&x.pursuit.slug===slug;});if(!list.length||document.getElementById('tll-pro-row'))return;css();
  var s=el('section','tll-pro-row');s.id='tll-pro-row';var k=el('p','tll-pro-k','From the Pros');s.appendChild(k);var g=el('div','tll-pro-grid');
  list.forEach(function(p){var a=el('a','tll-pro-card');a.href='/contributors/'+p.slug;if(p.avatar){var im=el('img');im.src=p.avatar;im.alt='';a.appendChild(im);}var d=el('div');d.appendChild(document.createTextNode(p.name));if(p.line)d.appendChild(el('small','',p.line));a.appendChild(d);g.appendChild(a);});
  s.appendChild(g);var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(s,an.nextSibling);else main.appendChild(s);}
var m;
if(!/^\/(stories|contributors|pursuits)\/[^/]+$/.test(P))return;
function run(){fetch(API).then(function(r){return r.ok?r.json():null;}).then(function(d){var pros=d&&d.pros||[];if(!pros.length)return;
  if((m=/^\/stories\/([^/]+)$/.exec(P)))story(pros);else if((m=/^\/contributors\/([^/]+)$/.exec(P)))profile(pros,m[1]);else if((m=/^\/pursuits\/([^/]+)$/.exec(P)))hub(pros,m[1]);}).catch(function(){});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,800);});else setTimeout(run,800);
})();
/* src/site-layers/tll-series-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var ROUTES_LIVE=false,pv=/[?&]preview=wire(&|$)/.test(location.search);try{pv=pv||localStorage.getItem('tll-preview-wire')==='1';}catch(e){}
if(!ROUTES_LIVE&&!pv)return;
var P=location.pathname.replace(/\/+$/,'')||'/';
/* The washi tape (.tll-wt-tape, .tll-wt-card-tape) and the small label (.tll-sr-k) come from tll-components-v1 in the core since November 12, 2026. */
var CSS='.tll-sr-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 16px;font:400 14px/1.4 var(--tll-ui-f-body)}.tll-sr-chips button{min-height:44px;padding:0 14px;border:1.5px solid var(--tll-ui-ink);border-radius:999px;background:#fff;color:var(--tll-ui-ink);font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-sr-chips button[aria-pressed=true]{background:var(--tll-ui-ink);color:var(--tll-ui-paper)}'+
'.tll-sr-box{max-width:680px;margin:28px auto;padding:16px 18px;border:1px solid var(--tll-ui-line);border-radius:4px;background:#fff;font:400 15px/1.55 var(--tll-ui-f-body);color:var(--tll-ui-ink)}.tll-sr-box ol{margin:8px 0 0;padding-left:20px}.tll-sr-box p{margin:0 0 6px}.tll-sr-box b{font-weight:600}.tll-sr-box small{display:block;color:var(--tll-ui-muted-2);margin-top:8px}'+
'.tll-sr-box a{color:var(--tll-ui-ink);font-weight:600;text-decoration:underline;text-decoration-color:var(--tll-ui-rose-text);text-underline-offset:3px}'+
'.tll-sr-kit a{margin-right:14px}.tll-sr-kit i{font-style:normal;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:var(--tll-ui-muted-2);margin-left:4px}'+
'[data-tll-reklame] a[data-tll-sponsor]{color:inherit}.tll-sr-li{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;background:var(--tll-ui-ink);color:var(--tll-ui-paper)!important;text-decoration:none!important;font-weight:600}';
var U=window.__tllUI,el=U.el; /* shared helpers from the core (tll-components-v1.js) */
function css(){U.style('tll-series-v1',CSS);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:x&&x.division||'tll'},x||{}));}catch(e){}}
function tape(text,cls){return el('span','tll-wt-tape tll-ui-tape'+(cls?' '+cls:''),text);}
function get(path){return U.json(API+path);}
function div(group){return group==='pets'?'paw-passport':'tll';}
function line(box,label,val){if(!val)return;var p=el('p');p.appendChild(el('b','',label+': '));p.appendChild(document.createTextNode(val));box.appendChild(p);}

function labelCards(cards){var by={};cards.forEach(function(c){by[c.slug]=c;});
  Object.keys(by).forEach(function(slug){[].slice.call(document.querySelectorAll('a[href="/stories/'+slug+'"],a[href^="/stories/'+slug+'?"]')).forEach(function(a){
    if(a.closest('.tll-wt-rail')||a.closest('nav,header,footer,.tll-sr-box'))return;var card=a.closest('.w-dyn-item')||a;if(card.querySelector('.tll-wt-card-tape'))return;
    if(getComputedStyle(card).position==='static')card.style.position='relative';card.appendChild(tape(by[slug].label,'tll-wt-card-tape tll-ui-tape--sm tll-ui-tape--corner'));card.setAttribute('data-tll-series',by[slug].series);});});}
function chips(series){if(document.getElementById('tll-sr-chips'))return;var have=series.filter(function(s){return s.stories.length;});if(!have.length)return;
  var first=document.querySelector('main .w-dyn-item a[href^="/stories/"]'),list=first&&first.closest('.w-dyn-list');if(!list)return;
  var row=el('div','tll-sr-chips');row.id='tll-sr-chips';row.setAttribute('role','group');row.setAttribute('aria-label','Story series');row.appendChild(el('span','tll-sr-k tll-ui-kicker','Series'));var on='';
  have.forEach(function(s){var b=el('button','',s.name);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){on=on===s.slug?'':s.slug;
    [].slice.call(row.querySelectorAll('button')).forEach(function(x){x.setAttribute('aria-pressed',String(x===b&&on!==''));});
    [].slice.call(list.querySelectorAll('.w-dyn-item')).forEach(function(it){it.hidden=!!on&&it.getAttribute('data-tll-series')!==on;});track('series_filter',{series:on||'all',division:div(s.group)});});row.appendChild(b);});
  list.parentNode.insertBefore(row,list);}

function fieldsBox(d){var f=d.fields||{},s=d.series,box=el('aside','tll-sr-box'),name=d.label.split(' · ')[0];box.setAttribute('aria-label',name);box.appendChild(el('p','tll-sr-k tll-ui-kicker',name));
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
function petBox(b){var box=el('aside','tll-sr-box');box.setAttribute('aria-label','Pet-friendly or pet-tolerant?');box.appendChild(el('p','tll-sr-k tll-ui-kicker','Pet-friendly or pet-tolerant?'));
  if(b.stayedAt){var p=el('p');p.appendChild(el('b','','Stayed at: '));if(b.url){var a=el('a','',b.stayedAt);a.href=b.url;a.rel=b.rel;a.target='_blank';p.appendChild(a);}else p.appendChild(document.createTextNode(b.stayedAt));if(b.city)p.appendChild(document.createTextNode(', '+b.city));box.appendChild(p);}
  line(box,'What we paid for the pet',b.paid);line(box,'Size or weight rule',b.sizeRule);line(box,'What made it welcoming',b.welcoming);line(box,'What we would tell the next owner',b.tell);
  box.appendChild(el('small','',"Writer's experience"+(b.when?', '+b.when:'')+'. No business can pay to change or remove a note.'));return box;}
function storyPage(slug){get('/series/story?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||document.getElementById('tll-sr-story'))return;
  var main=document.querySelector('main')||document.body,h1=main.querySelector('h1');var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var wrap=el('div');wrap.id='tll-sr-story';css();
  if(d.series){if(h1&&!document.querySelector('.tll-sr-head-tape')){var t=tape(d.label,'tll-sr-head-tape tll-ui-tape--above');h1.parentNode.insertBefore(t,h1);}
    var fb=fieldsBox(d);if(fb)wrap.appendChild(fb);
    if(d.safetyNote){var sn=el('aside','tll-sr-box');sn.appendChild(el('p','tll-sr-k tll-ui-kicker','Safety, from the writer'));sn.appendChild(el('p','',d.safetyNote));wrap.appendChild(sn);}
    var sh=el('div','tll-sr-box'),li=el('a','tll-sr-li','Share on LinkedIn');li.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.origin+location.pathname);li.target='_blank';li.rel='noopener';
    li.addEventListener('click',function(){track('share_click',{channel:'linkedin',series:d.series,division:div(d.group)});});sh.appendChild(li);wrap.appendChild(sh);}
  /* Linked sponsor label (staged with the expat and pet previews): the existing "Reklame for" label gets the sponsor's name as a link. */
  var prev=false;try{prev=localStorage.getItem('tll-preview-pets')==='1'||localStorage.getItem('tll-preview-expat')==='1';}catch(e){}
  if(prev&&d.sponsor){var rk=document.querySelector('[data-tll-reklame]');if(!rk&&h1){rk=el('div','tll-reklame');rk.setAttribute('data-tll-reklame','1');rk.setAttribute('lang','da');h1.parentNode.insertBefore(rk,h1);}
    if(rk&&!rk.querySelector('a')){rk.textContent='Reklame for ';var sa=el('a','',d.sponsor.name);sa.setAttribute('data-tll-sponsor','');sa.href=d.sponsor.url;sa.target='_blank';sa.rel=d.sponsor.rel;sa.addEventListener('click',function(){track('revenue_click',{slot:'sponsor_label',division:div(d.group)});});rk.appendChild(sa);}}
  if(d.petBox)wrap.appendChild(petBox(d.petBox));
  if(d.tripKit&&d.tripKit.length){var k=el('aside','tll-sr-box tll-sr-kit');k.appendChild(el('p','tll-sr-k tll-ui-kicker','Trip Kit · reklamelink'));var p=el('p');
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
/* src/site-layers/tll-ux-v1.js */
(function(){
var UX_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='ux')localStorage.setItem('tll-preview-ux','1');if(q==='off')localStorage.removeItem('tll-preview-ux');}catch(e){}
var ON=UX_PUBLIC||q==='ux';try{ON=ON||localStorage.getItem('tll-preview-ux')==='1';}catch(e){}if(!ON)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var CSS=':root{--ease-out:cubic-bezier(0.23,1,0.32,1)}'+
'.tll-story-hero-img{max-height:60vh!important}@media (max-width:600px){.tll-story-hero-img{max-height:50vh!important}}'+
'.tll-ux{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-ux [hidden]{display:none!important}'+
'.tll-ux-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-ux-toc{max-width:680px;margin:20px auto;padding:14px 16px;border-left:3px solid #067A79;background:#fff}.tll-ux-toc ol{margin:0;padding-left:20px}.tll-ux-toc a{color:#0A0B14}'+
'.tll-ux-end{max-width:680px;margin:32px auto;display:grid;gap:12px}.tll-ux-next{display:flex;gap:14px;align-items:center;border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:12px;color:#0A0B14;text-decoration:none;min-height:44px}'+
'.tll-ux-next img{width:96px;height:72px;object-fit:cover;border-radius:4px;flex:none}.tll-ux-next b{display:block;font:800 20px/1.2 "Playfair Display",Georgia,serif}'+
'.tll-ux-join{border:1px solid #0A0B14;border-radius:6px;padding:16px;background:#FDF9F3}.tll-ux-join b{display:block;font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-ux-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:4px;border:0;background:#C8325B;color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;transition:transform 140ms var(--ease-out)}'+
'.tll-ux-btn:active{transform:scale(.97)}.tll-ux-btn.ghost{background:#fff;color:#0A0B14;border:1.5px solid #0A0B14}.tll-ux-btn[disabled]{opacity:.55;cursor:default}'+
'.tll-ux-wel{position:fixed;inset:0;z-index:9999;background:rgba(10,11,20,.55);display:flex;align-items:flex-end;justify-content:center}'+
'.tll-ux-sheet{width:100%;max-width:560px;max-height:92vh;overflow:auto;background:#FDF9F3;border-radius:12px 12px 0 0;padding:20px 16px 24px}@media (min-width:700px){.tll-ux-wel{align-items:center}.tll-ux-sheet{border-radius:12px}}'+
'.tll-ux-prog{height:4px;background:#E0DACE;border-radius:2px;margin:0 0 6px}.tll-ux-prog i{display:block;height:100%;background:#C8325B;border-radius:2px;transition:width 200ms var(--ease-out)}'+
'.tll-ux-sheet h2{font:800 28px/1.1 "Playfair Display",Georgia,serif;margin:6px 0 12px}.tll-ux-sheet input[type=text],.tll-ux-sheet select{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#fff;min-height:44px}'+
'.tll-ux-rows{display:grid;gap:6px;margin:10px 0;max-height:40vh;overflow:auto}.tll-ux-row{display:flex;align-items:center;gap:8px;justify-content:space-between;border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:6px 8px}'+
'.tll-ux-chips{display:flex;gap:4px}.tll-ux-chips button{min-height:36px;min-width:44px;padding:0 8px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;cursor:pointer}.tll-ux-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-ux-acts{display:flex;justify-content:space-between;gap:8px;margin-top:14px}'+
'.tll-ux-stamps{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.tll-ux-stamp{font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:2px solid #C8325B;color:#C8325B;border-radius:6px;padding:10px;transform:rotate(-2deg)}'+
'.tll-ux-press{animation:tllPress 200ms var(--ease-out) both}@keyframes tllPress{from{transform:scale(.95) rotate(-2deg);opacity:0}to{transform:scale(1) rotate(-2deg);opacity:1}}'+
'.tll-ux-otd{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-ux-v1'))return;var s=el('style');s.id='tll-ux-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
css();

/* Events everywhere */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';if(/^\/signup\b/.test(h))track('signup_start',{from:P});},true);
if(P==='/submit'){var started=false;document.addEventListener('input',function(){if(started)return;started=true;track('story_submit_start');},true);}

/* Story pages */
function story(){var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];if(!body||document.getElementById('tll-ux-end'))return;
  var words=(body.textContent||'').trim().split(/\s+/).length,heads=[].slice.call(body.querySelectorAll('h2,h3'));
  if(words>2500&&heads.length>=2&&!document.getElementById('tll-ux-toc')){var t=el('nav','tll-ux tll-ux-toc');t.id='tll-ux-toc';t.setAttribute('aria-label','In this story');t.appendChild(el('p','tll-ux-k','In this story'));var ol=el('ol');
    heads.forEach(function(h,i){if(!h.id)h.id='s-'+(i+1)+'-'+h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40);var li=el('li'),a=el('a','',h.textContent.trim());a.href='#'+h.id;li.appendChild(a);ol.appendChild(li);});t.appendChild(ol);body.insertBefore(t,body.firstChild);}
  var sent=false;window.addEventListener('scroll',function(){if(sent)return;var r=body.getBoundingClientRect();if(r.height>0&&(innerHeight-r.top)/r.height>=0.75){sent=true;track('story_read_75',{story:P.split('/')[2]});}},{passive:true});
  var here=P.split('/')[2],links=[].slice.call(document.querySelectorAll('main a[href^="/stories/"]')).filter(function(a){var s=(a.getAttribute('href').split('/')[2]||'').replace(/[?#].*$/,'');return s&&s!==here&&!a.closest('nav,header,footer,.tll-ux-end');});
  var nx=links.filter(function(a){return a.querySelector('img');})[0]||links[0],end=el('div','tll-ux tll-ux-end');end.id='tll-ux-end';
  if(nx){var card=el('a','tll-ux-next');card.href=nx.getAttribute('href');var im=nx.querySelector('img');if(im){var i2=el('img');i2.src=im.currentSrc||im.src;i2.alt='';i2.loading='lazy';card.appendChild(i2);}var tx=el('div');tx.appendChild(el('span','tll-ux-k','Next story'));
    var title=(nx.querySelector('h2,h3,h4,b,strong')||nx).textContent.trim().split('\n')[0].slice(0,120);tx.appendChild(el('b','',title||'Keep reading'));card.appendChild(tx);card.addEventListener('click',function(){track('next_story_click',{from:here});});end.appendChild(card);}
  if(!tok()){var j=el('div','tll-ux-join');j.appendChild(el('b','','Start your free map.'));j.appendChild(el('p','','Free. No card. 16+.'));var ja=el('a','tll-ux-btn','Join free');ja.href='/signup?utm_source=story&utm_medium=end&utm_campaign=tll';j.appendChild(ja);end.appendChild(j);}
  if(!end.children.length)return;var share=document.querySelector('.tll-story-share-row');if(share)share.parentNode.insertBefore(end,share);else body.insertAdjacentElement('afterend',end);}

/* Welcome: first stamp in under two minutes */
function readStates(j){var r=j&&j.tllStates;if(!r||r.v!==2||!r.states){try{r=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){r=null;}}if(!r||r.v!==2||!r.states)r={v:2,travelers:[{id:'t1',name:'Me',color:'#F0507A',pet:false}],states:{}};return r;}
function names(){var out=[];try{var dn=new Intl.DisplayNames(['en'],{type:'region'}),N=window.__tllN2A||{};Object.keys(N).forEach(function(num){var a=N[num],n=a==='XK'?'Kosovo':dn.of(a);if(n&&n!==a)out.push({num:num,a2:a,name:n});});}catch(e){}return out.sort(function(a,b){return a.name.localeCompare(b.name);});}
function welcome(force){var ms=window.$memberstackDom;if(!ms||!ms.getMemberJSON||document.getElementById('tll-ux-wel'))return;
  ms.getMemberJSON().then(function(j){var json=(j&&j.data)||{},rec=readStates(json);if(!force&&Object.keys(rec.states).length)return;if(json.tllWelcomed&&!force)return;
    var all=names();if(!all.length)return;var me=(rec.travelers.filter(function(t){return !t.pet;})[0]||{id:'t1'}).id,picks={},home='';
    var reg=(navigator.language||'').split('-')[1];if(reg){var hit=all.filter(function(c){return c.a2===reg.toUpperCase();})[0];if(hit){home=hit.num;picks[hit.num]='lived';}}
    var wrap=el('div','tll-ux tll-ux-wel');wrap.id='tll-ux-wel';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-labelledby','tll-ux-wel-h');var sh=el('div','tll-ux-sheet');wrap.appendChild(sh);document.body.appendChild(wrap);
    var step=1;function frame(n,title){sh.textContent='';var pr=el('div','tll-ux-prog'),bar=el('i');bar.style.width=(n*100/3)+'%';pr.appendChild(bar);sh.appendChild(pr);sh.appendChild(el('p','tll-ux-k',n+' of 3'));var h=el('h2','',title);h.id='tll-ux-wel-h';sh.appendChild(h);}
    function acts(back,next,label,skip){var a=el('div','tll-ux-acts');if(back){var b=el('button','tll-ux-btn ghost','Back');b.type='button';b.onclick=back;a.appendChild(b);}else a.appendChild(el('span'));
      var nx=el('button','tll-ux-btn',label||'Next');nx.type='button';nx.onclick=next;a.appendChild(nx);if(skip){var s=el('button','tll-ux-btn ghost','Skip');s.type='button';s.onclick=skip;a.insertBefore(s,nx);}sh.appendChild(a);return nx;}
    function s1(){frame(1,'Where is home?');var sel=el('select');sel.setAttribute('aria-label','Home country');sel.appendChild(el('option','','Pick a country'));all.forEach(function(c){var o=el('option','',c.name);o.value=c.num;sel.appendChild(o);});sel.value=home;sh.appendChild(sel);
      sh.appendChild(el('p','','The country you call home. You can change it later.')).style.cssText='font-size:13px;color:#5F5A54';
      acts(null,function(){if(home&&picks[home]==='lived'&&sel.value!==home)delete picks[home];home=sel.value;if(home)picks[home]='lived';s2();});}
    function s2(){frame(2,'Where have you been?');var find=el('input');find.type='text';find.placeholder='Type a country';find.setAttribute('aria-label','Find a country');sh.appendChild(find);var rows=el('div','tll-ux-rows');sh.appendChild(rows);
      function draw(){rows.textContent='';var f=find.value.trim().toLowerCase();all.filter(function(c){return f?c.name.toLowerCase().indexOf(f)>-1:picks[c.num];}).slice(0,40).forEach(function(c){var r=el('div','tll-ux-row');r.appendChild(el('span','',c.name));var ch=el('div','tll-ux-chips');
        [['lived','LIVED'],['visited','STAYED'],['layover','LAYOVER']].forEach(function(m){var b=el('button','',m[1]);b.type='button';b.setAttribute('aria-pressed',String(picks[c.num]===m[0]));b.onclick=function(){if(picks[c.num]===m[0])delete picks[c.num];else picks[c.num]=m[0];draw();};ch.appendChild(b);});r.appendChild(ch);rows.appendChild(r);});
        if(!rows.children.length)rows.appendChild(el('p','','Type a country, then tap Lived, Stayed or Layover.'));}
      find.oninput=draw;draw();setTimeout(function(){find.focus();},50);acts(s1,function(){save().then(s3);},'Save my map');}
    function save(){var e=rec.states;Object.keys(picks).forEach(function(num){var x=Object.assign({},e[num]||{});if(!x[me])x[me]=picks[num];e[num]=x;});var t=Date.now();json.tllStates=rec;json.tllStatesAt=t;json.tllWelcomed=t;
      return ms.updateMemberJSON({json:json}).then(function(){try{localStorage.setItem('tllStates',JSON.stringify(rec));localStorage.setItem('tllStatesAt',String(t));}catch(e){}if(Object.keys(picks).length)track('first_stamp',{count:Object.keys(picks).length});}).catch(function(){});}
    function s3(){frame(3,'One photo for your first album page');sh.appendChild(el('p','','Optional. Pick one you took yourself; we take the location out before it uploads.'));var a=el('a','tll-ux-btn ghost','Add a photo');a.href='/share-photos?utm_source=welcome';sh.appendChild(a);
      acts(null,ask,'Next',ask);}
    /* Optional, one tap, multi-select: "How do you travel most?" Saved privately to the member's travel-style field, to a GA4 user
       property only after analytics consent, and counted monthly for Nancy. Never shown publicly. */
    function ask(){sh.textContent='';sh.appendChild(el('p','tll-ux-k','One more, optional'));var h=el('h2','','How do you travel most?');h.id='tll-ux-wel-h';sh.appendChild(h);
      var opts=[['big-trips','A few big trips a year'],['short-trips','Lots of short trips and layovers'],['abroad','I live abroad (or did)'],['work','For work'],['pet','With my pet'],['pursuit','For a pursuit (running, hiking, food, more)']],picked={};
      var box=el('div','tll-ux-chips');box.style.cssText='flex-wrap:wrap;gap:8px;margin:10px 0';box.setAttribute('role','group');box.setAttribute('aria-label','How do you travel most? Pick any');
      opts.forEach(function(o){var b=el('button','',o[1]);b.type='button';b.style.cssText='min-height:44px;font:600 14px/1.2 "IBM Plex Sans Condensed",sans-serif;letter-spacing:0;padding:0 14px';b.setAttribute('aria-pressed','false');
        b.onclick=function(){picked[o[0]]=!picked[o[0]];b.setAttribute('aria-pressed',String(!!picked[o[0]]));};box.appendChild(b);});sh.appendChild(box);
      sh.appendChild(el('p','','Pick any. Only we see this; it helps us make TLL for people like you.')).style.cssText='font-size:13px;color:#5F5A54';
      acts(null,function(){var list=Object.keys(picked).filter(function(k){return picked[k];});if(list.length){
          try{if(ms.updateMember)ms.updateMember({customFields:{'travel-style':list.join(',')}}).catch(function(){});}catch(e){}
          post('/travel-style',{styles:list});try{if(window.__tllConsent&&__tllConsent.analytics&&window.gtag)gtag('set','user_properties',{travel_style:list.join(',')});}catch(e){}
          track('travel_style_answer',{count:list.length});}reveal();},'Show my passport',reveal);}
    function reveal(){sh.textContent='';sh.appendChild(el('p','tll-ux-k','Your passport'));var h=el('h2','','Stamped.');h.id='tll-ux-wel-h';sh.appendChild(h);var box=el('div','tll-ux-stamps');var codes=Object.keys(picks);
      codes.forEach(function(num,i){var c=all.filter(function(x){return x.num===num;})[0];if(!c)return;var s=el('span','tll-ux-stamp',c.name+' · '+(picks[num]==='lived'?'Lived':picks[num]==='visited'?'Stayed':'Layover'));if(!RM&&i<12){s.classList.add('tll-ux-press');s.style.animationDelay=(i*40)+'ms';}box.appendChild(s);});
      sh.appendChild(box);if(!codes.length)sh.appendChild(el('p','','Your first stamp goes here. The map is one tap away.'));var a=el('a','tll-ux-btn','See my map');a.href='/the-map';sh.appendChild(a);var c=el('button','tll-ux-btn ghost','Close');c.type='button';c.style.marginLeft='8px';c.onclick=function(){wrap.remove();};sh.appendChild(c);}
    document.addEventListener('keydown',function k(e){if(e.key==='Escape'&&document.getElementById('tll-ux-wel')){wrap.remove();document.removeEventListener('keydown',k);}});
    s1();if(force)track('signup_complete');}).catch(function(){});}

/* On this day, private to the member on /account */
function onThisDay(){if(document.getElementById('tll-ux-otd'))return;post('/stamps/mine').then(function(d){if(!d||!d.ok)return;var now=new Date(),m=now.getMonth()+1,y=now.getFullYear();
  var hits=(d.stamps||[]).filter(function(s){return s.month===m&&s.year&&s.year<y;});if(!hits.length||document.getElementById('tll-ux-otd'))return;
  var box=el('section','tll-ux tll-ux-otd');box.id='tll-ux-otd';box.appendChild(el('p','tll-ux-k','On this day · only you see this'));
  hits.slice(0,3).forEach(function(s){var n=y-s.year;box.appendChild(el('p','',(n===1?'A year ago':n+' years ago')+' this month: '+s.what+', '+[s.city,s.country].filter(Boolean).join(', ')+'.'));});
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);});}

function run(){if(/^\/stories\/[^/]+$/.test(P))story();else if(P==='/account'){var w=new URLSearchParams(location.search).get('welcome')==='1';setTimeout(function(){welcome(w);},w?0:1500);onThisDay();}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1400);});else setTimeout(run,1400);
})();
/* src/site-layers/tll-story-is-v1.js */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
var U=window.__tllUI,el=U.el; /* shared helpers from the core (tll-components-v1.js); the label .tll-si-k comes from tll-components-v1 */
function css(){U.style('tll-story-is-v1','.tll-si{max-width:680px;margin:0 auto 28px;padding:18px 20px;border:1px solid var(--tll-ui-line);border-left:3px solid var(--tll-ui-rose-text);border-radius:4px;background:#fff;font:400 15px/1.5 var(--tll-ui-f-body);color:var(--tll-ui-ink)}'+
'.tll-si h2{font:800 24px/1.15 var(--tll-ui-f-head);margin:0 0 10px}'+
'.tll-si ul{margin:0 0 10px;padding-left:18px;display:grid;gap:4px}.tll-si li{text-wrap:pretty}.tll-si p{margin:0}.tll-si small{display:block;font-size:13px;color:var(--tll-ui-muted-2);margin:6px 0 0}.tll-si-hint{font:400 13px/1.4 var(--tll-ui-f-body);color:var(--tll-ui-muted-2);margin:4px 0 0}');}
function submit(){if(document.getElementById('tll-si'))return;var f=document.querySelector('main form')||document.querySelector('form');if(!f)return;css();
  var b=el('section','tll-si');b.id='tll-si';b.appendChild(el('p','tll-si-k tll-ui-kicker','What a story looks like here'));b.appendChild(el('h2','','You went. Something happened. You tell it.'));
  var ul=el('ul');[['One trip, first person.','A weekend, a layover, a year abroad. Not "Thailand" but "the night bus to Chiang Mai."'],['You were there.','Use your own photos and keep the mistakes in. Stock photos and press kits get sent back.'],['A place and a time.','City or country, month and year. After the trip, never during.'],['The bit that went sideways.','The missed ferry, the wrong hostel, the kindness you did not expect. That is the story.'],['In your words.','We fix typos. AI writes nothing here, and anything AI made is labeled.']]
  .forEach(function(x){var li=el('li');li.appendChild(el('b','',x[0]+' '));li.appendChild(document.createTextNode(x[1]));ul.appendChild(li);});b.appendChild(ul);
  b.appendChild(el('p','','Not sure? Ask: could only you have written it? Then it belongs here.'));
  b.appendChild(el('small','','What we send back: guides, roundups, "best of" lists, hotel or product reviews, anything written to sell something. We will tell you why, kindly, and point you to where it fits.'));
  f.parentNode.insertBefore(b,f);
  var title=f.querySelector('input[name*="title" i],input[name*="headline" i],input[id*="title" i]');if(title&&!(title.nextElementSibling&&title.nextElementSibling.classList.contains('tll-si-hint'))){var hint=el('p','tll-si-hint','Sounds like a guide. Stories here are one trip, told by the person who took it. Keep going if that is what this is.');hint.hidden=true;title.insertAdjacentElement('afterend',hint);
    title.addEventListener('input',function(){hint.hidden=!/\b(best|top \d+|top ten|guide|destination|luxury|ultimate)\b/i.test(title.value);});}}
function storyEnd(){var p=document.querySelector('.tll-sa');if(!p||p.querySelector('.tll-si-line'))return;var s=el('span','tll-si-line',' One trip, told by the person who took it. Could only you have written it? Then send it.');p.appendChild(s);}
function search(){var n=document.getElementById('tll-q-note');if(!n||n.dataset.tllSi)return;n.dataset.tllSi='1';var q=n.querySelector('span'),a=n.querySelector('a');var word=q?q.textContent:'';n.textContent='';
  n.appendChild(document.createTextNode('Nothing filed for “'));var sp=el('span','',word);n.appendChild(sp);n.appendChild(document.createTextNode('” yet. Every story here is one trip, told by someone who went. Yours could be the first. '));
  var link=el('a','','See all stories');link.href='/stories';n.appendChild(link);if(a&&a.href&&!/\/stories\/?$/.test(a.getAttribute('href')||''))link.href=a.href;}
function run(){if(P==='/submit')submit();else if(/^\/stories\/[^/]+$/.test(P))storyEnd();else if(P==='/stories'){search();setTimeout(search,1500);setTimeout(search,3500);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,900);});else setTimeout(run,900);
setTimeout(run,3000);
})();
/* src/site-layers/tll-trust-v1.js */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
var isStories=P==='/stories',isStory=/^\/stories\/[^/]+$/.test(P),isHome=P==='/'||P==='/index.html';
if(!isStories&&!isStory&&!isHome)return;
var MONTHS='January|February|March|April|May|June|July|August|September|October|November|December';
var CSS=
'html.tllp-stories .tll-lib-card [data-s3-mins][data-tll-mins]::after{content:none!important}'+
'.tll-related-meta[data-tll-mins]::after{content:none!important}'+
'.tll-lib-card [data-tll-fund]{display:block;margin:6px 0 0;font:600 10px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#5F5A54}'+
'.tll-lib-card [data-s3-kicker] [data-tll-trip-date]:not(:empty)::before{content:"\\00a0\\00b7\\00a0"}'+
'.tll-story-body>a[data-tll-commissioned="story"].tll-comm-on{display:flex;width:-moz-fit-content;width:fit-content;margin:0 0 12px}'+
'[data-tll-correction-line]{margin:0 0 10px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'[data-tll-correction-line] b{font-weight:600}';
function css(){if(document.getElementById('tll-trust-v1'))return;var s=document.createElement('style');s.id='tll-trust-v1';s.textContent=CSS;document.head.appendChild(s);}
function clean(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
/* The funding label from the option's name and the partner. Unknown or empty values give no label. */
function fundLabel(f,who){f=clean(f).toLowerCase();who=clean(who);
  if(f==='self-funded')return'Self-funded';
  if(f==='commissioned by tll')return'Commissioned by TLL';
  if(f==='hosted by')return who?'Hosted by '+who:'';
  if(f==='gifted by')return who?'Gifted by '+who:'';
  if(f==='sponsored by')return who?'Reklame · Sponsored by '+who:'';
  return'';}
function mins(el){if(!el||el.hasAttribute('data-tll-mins'))return;var t=clean(el.textContent),m=t.match(/^(\d+)(?:\s*min(?:\s*read)?)?$/);if(!m)return;
  el.textContent=m[1]+' min read';el.setAttribute('data-tll-mins','1');}
function cards(){
  [].forEach.call(document.querySelectorAll('a.tll-lib-card'),function(c){
    mins(c.querySelector('[data-s3-mins]'));
    var f=c.querySelector('[data-tll-facts="card"]');if(!f)return;
    var kick=c.querySelector('[data-s3-kicker]');
    if(kick&&!kick.querySelector('[data-tll-trip-date]')){
      var shown=c.querySelector('[data-tll-facts="trip-shown"]'),when=clean(f.getAttribute('data-tll-trip'));
      if(shown&&!shown.classList.contains('w-condition-invisible')&&new RegExp('^('+MONTHS+') \\d{4}$').test(when)){
        var d=document.createElement('div');d.setAttribute('data-tll-trip-date','1');d.textContent=when;kick.appendChild(d);}}
    if(!c.querySelector('[data-tll-fund]')){
      var label=fundLabel(f.getAttribute('data-tll-funding'),f.getAttribute('data-tll-funding-partner'));
      if(label){var l=document.createElement('div');l.setAttribute('data-tll-fund','1');l.textContent=label;
        if(kick&&kick.parentNode)kick.parentNode.insertBefore(l,kick.nextSibling);else{var b=c.querySelector('.tll-lib-body');if(b)b.appendChild(l);}}}
  });}
function story(){
  [].forEach.call(document.querySelectorAll('.tll-related-meta'),mins);
  /* 1. the funding chip, above the first paragraph */
  var chips=document.querySelectorAll('a[data-tll-commissioned="story"][data-tll-funding]'),done=document.querySelector('a[data-tll-fund-chip]');
  if(!done)for(var i=0;i<chips.length;i++){var a=chips[i],label=fundLabel(a.getAttribute('data-tll-funding'),a.getAttribute('data-tll-funding-partner'));if(!label)continue;
    a.textContent=label;a.setAttribute('href','/editorial-charter#rule-4');a.setAttribute('data-tll-fund-chip','1');a.classList.add('tll-comm-on');
    var col=document.querySelector('.tll-story-body'),body=col&&col.querySelector(':scope > .w-richtext');
    if(body&&a.parentNode===col)col.insertBefore(a,body);
    break;}
  /* 4. receipts: Last updated only with a real date; the correction line above it */
  var up=document.querySelector('[data-tll-lg="updated"]'),row=up&&up.closest('.tll-ledger-row'),au=document.querySelector('[data-st3-updated]');
  if(row&&au&&!clean(au.getAttribute('data-st3-updated')))row.style.display='none';
  var cn=document.querySelector('[data-tll-correction]'),note=cn&&clean(cn.getAttribute('data-tll-correction'));
  if(note&&row&&!document.querySelector('[data-tll-correction-line]')){var p=document.createElement('p');p.setAttribute('data-tll-correction-line','1');
    var b=document.createElement('b');b.textContent='Correction'+(clean(up.textContent)?', '+clean(up.textContent):'')+': ';p.appendChild(b);p.appendChild(document.createTextNode(note));row.parentNode.insertBefore(p,row);}
  /* 5. Reklame never alone */
  var r=document.querySelector('[data-tll-reklame]');if(r&&r.firstChild&&r.firstChild.nodeType===3&&/^Reklame for\s*$/.test(r.firstChild.nodeValue))r.firstChild.nodeValue='Reklame · Sponsored by ';
}
function home(){[].forEach.call(document.querySelectorAll('.h3-card-meta'),function(m){var t=m.textContent;if(/\d+ min$/.test(t))m.textContent=t+' read';});}
function run(){css();if(isStories)cards();if(isStory)story();if(isHome)home();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.addEventListener('load',function(){run();setTimeout(run,1500);});
if(isHome)document.addEventListener('tll:counts',function(){setTimeout(home,0);});
})();
