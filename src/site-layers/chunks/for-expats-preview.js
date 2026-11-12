/* tll-site-layers-v16 chunk for-expats-preview: loaded by the core loader on paths matching /^\/for-expats$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-expert-from-v1.js */
(function(){
if(!/^\/for-expats\/?$/.test(location.pathname))return;
function run(){
  var city=document.getElementById('le-city');if(!city||document.getElementById('le-from'))return;
  var grid=city.closest('.tllpr-grid');var years=document.getElementById('le-years');
  var model=(years&&years.parentElement)||city.parentElement;if(!grid||!model)return;
  var wrap=model.cloneNode(true);var lab=wrap.querySelector('label');var inp=wrap.querySelector('input');if(!lab||!inp)return;
  lab.setAttribute('for','le-from');lab.textContent='Where you are from (optional)';
  inp.id='le-from';inp.name='from-country';inp.setAttribute('data-name','from-country');inp.value='';inp.removeAttribute('required');
  inp.placeholder='The country you grew up in';inp.autocomplete='country-name';
  if(document.getElementById('tll-country-list'))inp.setAttribute('list','tll-country-list');
  grid.appendChild(wrap);
}
var NAMES=[['le-name','name-or-pen-name'],['le-links','published-links']];
function names(){
  for(var i=0;i<NAMES.length;i++){var inp=document.querySelector('#tll-expert-apply form input#'+NAMES[i][0]),want=NAMES[i][1];if(!inp)continue;
    if(inp.getAttribute('name')!==want)inp.setAttribute('name',want);
    if(inp.getAttribute('data-name')!==want)inp.setAttribute('data-name',want);}
}
function both(){names();run();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',both);else both();
setTimeout(both,1200);
/* The form can arrive, or be drawn again, after this chunk has run. */
if(window.MutationObserver)new MutationObserver(names).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['name','data-name']});
/* Capture on the document: before Webflow's submit handler, which is delegated on the document in the bubble phase. */
document.addEventListener('submit',names,true);
})();
/* src/site-layers/tll-expats-map-v1.js */
(function(){
if(!/^\/for-expats\/?$/.test(location.pathname))return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/expats-map';
var CDN='https://cdn.jsdelivr.net/npm/';
var ALIAS={us:'United States of America',cz:'Czechia',ba:'Bosnia and Herz.',do:'Dominican Rep.',cd:'Dem. Rep. Congo',cf:'Central African Rep.',ss:'S. Sudan',gq:'Eq. Guinea',sb:'Solomon Is.',kr:'South Korea',kp:'North Korea',la:'Laos',ru:'Russia',mk:'Macedonia',sz:'eSwatini',ci:"Côte d'Ivoire",tw:'Taiwan',bo:'Bolivia',ve:'Venezuela',ir:'Iran',sy:'Syria',tz:'Tanzania',md:'Moldova',ae:'United Arab Emirates',gb:'United Kingdom',vn:'Vietnam',xk:'Kosovo',ps:'Palestine',fk:'Falkland Is.',eh:'W. Sahara'};
var DN=null;try{DN=new Intl.DisplayNames(['en'],{type:'region'});}catch(e){}
function cname(c){try{return DN?DN.of(c.toUpperCase()):c.toUpperCase();}catch(e){return c.toUpperCase();}}
function norm(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z]+/g,' ').trim();}
function flag(c){return 'https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/'+c+'.svg';}
function load(src){return new Promise(function(ok,no){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s);});}
function libs(){var p=Promise.resolve();
  if(!window.topojson)p=p.then(function(){return load(CDN+'topojson-client@3.1.0/dist/topojson-client.min.js');});
  if(!(window.d3&&window.d3.geoPath&&window.d3.geoNaturalEarth1)){p=p.then(function(){return window.d3&&window.d3.range?0:load(CDN+'d3-array@3.2.4/dist/d3-array.min.js');}).then(function(){return load(CDN+'d3-geo@3.1.1/dist/d3-geo.min.js');});}
  return p;}
var CSS='[data-tll-x="expats-map"]{padding:clamp(48px,7vw,88px) 0}[data-tll-x="expats-map"] .tll-em-lede{max-width:60ch;color:var(--tll-ui-muted-2);margin:0 0 20px}'+
'.tll-em-map{width:100%;height:auto;display:block;margin:0 0 24px}.tll-em-map path{fill:#EFE8DC;stroke:var(--tll-ui-paper);stroke-width:.5}.tll-em-map path.on{fill:var(--tll-ui-teal-text)}.tll-em-map .dot{fill:var(--tll-ui-rose-text);stroke:var(--tll-ui-paper);stroke-width:2}'+
'.tll-em-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin:0;padding:0;list-style:none}'+
'.tll-em-c{border:1px solid var(--tll-ui-line);border-radius:4px;background:var(--tll-ui-paper);padding:14px 16px}.tll-em-c h3{display:flex;align-items:center;gap:10px;margin:0 0 8px;font:800 20px/1.2 var(--tll-ui-f-head);color:var(--tll-ui-ink)}'+
'.tll-em-c h3 img{width:24px;height:24px;border-radius:50%;box-shadow:0 0 0 1px rgba(10,11,20,.18)}.tll-em-c ul{margin:0;padding:0;list-style:none}'+
'.tll-em-c li{margin:0 0 6px;font:400 15px/1.4 var(--tll-ui-f-body);color:var(--tll-ui-ink)}.tll-em-c a{color:var(--tll-ui-ink);font-weight:600;text-decoration:underline;text-decoration-color:var(--tll-ui-rose-text);text-underline-offset:3px}'+
'.tll-em-c small{display:block;color:var(--tll-ui-muted-2);font-size:13px}.tll-em-c small img{width:14px;height:14px;border-radius:50%;vertical-align:-2px;margin:0 4px 0 2px}'+
'.tll-em-join{margin:18px 0 0;font:400 15px/1.5 var(--tll-ui-f-body)}.tll-em-join a{color:var(--tll-ui-ink);text-decoration:underline;text-decoration-color:var(--tll-ui-rose-text);text-underline-offset:3px}';
function el(t,a,x){var e=document.createElement(t);if(a)for(var k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;return e;}
function build(data,world){
  if(document.querySelector('[data-tll-x="expats-map"]'))return;
  var after=document.querySelector('section[data-tll-x="dir"]')||document.getElementById('tll-expert-apply');if(!after)return;
  var st=el('style',{id:'tll-expats-map-v1'});st.textContent=CSS;document.head.appendChild(st);
  var sec=el('section',{'data-tll-x':'expats-map','aria-labelledby':'tll-em-h'}),inner=el('div',{'data-tll-x':'inner'});
  var ey=el('div',{'data-tll-x':'eyebrow'});ey.appendChild(el('div',null,'THE EXPATS MAP · WHERE MEMBERS LIVE'));inner.appendChild(ey);
  inner.appendChild(el('h2',{id:'tll-em-h','data-tll-x':'expats-map-h2'},'Where our expats call home.'));
  inner.appendChild(el('p',{'class':'tll-em-lede'},'Members who list themselves as expats, shown by the home base on their profile. Only people who switched it on, and only the city they chose to show.'));
  var have={};Object.keys(data.countries||{}).forEach(function(c){have[norm(ALIAS[c]||cname(c))]=c;have[norm(cname(c))]=c;});
  try{
    var feats=topojson.feature(world,world.objects.countries).features.filter(function(f){return f.properties&&f.properties.name!=='Antarctica';});
    var W=960,H=470,proj=d3.geoNaturalEarth1().fitSize([W,H],{type:'FeatureCollection',features:feats}),path=d3.geoPath(proj);
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('class','tll-em-map');svg.setAttribute('role','img');
    var names=Object.keys(data.countries).map(function(c){return cname(c);});
    svg.setAttribute('aria-label','World map. Countries with expat members: '+names.join(', ')+'.');
    var dots=[];feats.forEach(function(f){var p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',path(f)||'');var c=have[norm(f.properties.name)];
      if(c){p.setAttribute('class','on');var t=document.createElementNS('http://www.w3.org/2000/svg','title');t.textContent=cname(c);p.appendChild(t);dots.push(f);}svg.appendChild(p);});
    /* a dot on each country with members, so small countries (Denmark) show; country level only */
    dots.forEach(function(f){var xy=path.centroid(f);if(!isFinite(xy[0]))return;var d=document.createElementNS('http://www.w3.org/2000/svg','circle');d.setAttribute('cx',xy[0]);d.setAttribute('cy',xy[1]);d.setAttribute('r',6);d.setAttribute('class','dot');svg.appendChild(d);});
    inner.appendChild(svg);
  }catch(e){}
  var by={};data.expats.forEach(function(x){(by[x.country]=by[x.country]||[]).push(x);});
  var list=el('ul',{'class':'tll-em-list'});
  Object.keys(by).sort(function(a,b){return cname(a).localeCompare(cname(b));}).forEach(function(c){
    var li=el('li',{'class':'tll-em-c'}),h=el('h3');var fi=el('img',{src:flag(c),alt:'',loading:'lazy'});fi.onerror=function(){fi.remove();};h.appendChild(fi);h.appendChild(document.createTextNode(cname(c)));li.appendChild(h);
    var ul=el('ul');by[c].forEach(function(x){var m=el('li'),a=el('a',{href:'/contributors/'+encodeURIComponent(x.slug)},x.name);m.appendChild(a);
      var sm=el('small',null,x.place);if(x.from&&x.from!==c){sm.appendChild(document.createTextNode(' · from '));var ff=el('img',{src:flag(x.from),alt:'',loading:'lazy'});ff.onerror=function(){ff.remove();};sm.appendChild(ff);sm.appendChild(document.createTextNode(cname(x.from)));}
      m.appendChild(sm);ul.appendChild(m);});li.appendChild(ul);list.appendChild(li);});
  inner.appendChild(list);
  var j=el('p',{'class':'tll-em-join'});j.innerHTML='Living abroad? <a href="/edit-profile">Switch on Expats on your profile</a> and you join the map, at the city you choose.';inner.appendChild(j);
  sec.appendChild(inner);after.parentNode.insertBefore(sec,after.nextSibling);
}
function run(){
  Promise.all([fetch(API,{cache:'no-cache'}).then(function(r){return r.ok?r.json():null;}),libs().then(function(){return fetch(CDN+'world-atlas@2.0.2/countries-110m.json').then(function(r){return r.json();});})])
  .then(function(a){var d=a[0];if(!d||!d.expats||!d.expats.length)return;build(d,a[1]);}).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
/* src/site-layers/tll-series-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var ROUTES_LIVE=false,pv=/[?&]preview=wire(&|$)/.test(location.search);try{pv=pv||localStorage.getItem('tll-preview-wire')==='1';}catch(e){}
if(!ROUTES_LIVE&&!pv)return;
var P=location.pathname.replace(/\/+$/,'')||'/';
/* The washi tape (.tll-wt-tape, .tll-wt-card-tape) and the small label (.tll-sr-k) come from tll-components-v1 in the core since 12 Nov. */
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
/* src/site-layers/tll-expat-v1.js */
(function(){
var EX_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='expat')localStorage.setItem('tll-preview-expat','1');if(q==='off')localStorage.removeItem('tll-preview-expat');}catch(e){}
var ON=EX_PUBLIC||q==='expat';try{ON=ON||localStorage.getItem('tll-preview-expat')==='1';}catch(e){}
window.__tllExpatOn=ON;if(!ON)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var FLAGS='https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/';
var BADGES={'first-move-abroad':'First move abroad','lived-on-two-continents':'Lived on 2 continents','moved-back':'Moved back'};
/* The small label (.tll-ex-k) and the washi tape (.tll-ex-tape) come from tll-components-v1 in the core since 12 Nov. */
var CSS='.tll-ex{font:400 15px/1.5 var(--tll-ui-f-body);color:var(--tll-ui-ink)}.tll-ex [hidden]{display:none!important}'+
'.tll-ex-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:var(--tll-ui-rose-text);margin:0 0 8px}'+
'.tll-ex-stat{background:none;border:0;padding:0;text-align:left;cursor:pointer;color:inherit;font:inherit;min-height:44px}.tll-ex-stat:focus-visible{outline:2px solid var(--tll-ui-rose-text);outline-offset:2px}'+
'.tll-ex-pop{max-width:760px;margin:12px 0;padding:14px 16px;border:1px solid var(--tll-ui-line);border-radius:6px;background:#fff}.tll-ex-pop ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}.tll-ex-pop li{display:flex;gap:10px;align-items:center}.tll-ex-pop img{width:24px;height:24px}.tll-ex-pop small{color:var(--tll-ui-muted-2);display:block}'+
'.tll-ex-badges{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.tll-ex-badge{font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--tll-ui-ink);border-radius:999px;padding:8px 12px}'+
'.tll-ex-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;border:0;background:var(--tll-ui-rose-text);color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-ex-btn.ink{background:var(--tll-ui-ink);color:var(--tll-ui-paper)}.tll-ex-btn.ghost{background:#fff;color:var(--tll-ui-ink);border:1.5px solid var(--tll-ui-ink)}'+
'.tll-ex-sec{background:var(--tll-ui-paper)}.tll-ex-in{max-width:1120px;margin:0 auto;padding:44px 16px}.tll-ex h2{font:800 clamp(28px,4vw,46px)/1.05 var(--tll-ui-f-head);margin:0 0 12px}.tll-ex h3{font:800 24px/1.15 var(--tll-ui-f-head);margin:0 0 12px}'+
'.tll-ex-lede{max-width:62ch;color:#3a3833;margin:0 0 16px}.tll-ex-small{font:600 12px/1.4 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;color:var(--tll-ui-muted-2);margin:10px 0 0}'+
'.tll-ex-prom{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.tll-ex-prom a{display:block;border-top:2px solid var(--tll-ui-ink);padding:14px 0 0;color:var(--tll-ui-ink);text-decoration:none}.tll-ex-prom b{display:block;font:800 20px/1.2 var(--tll-ui-f-head);margin:0 0 6px}'+
'.tll-ex-row{border-top:2px solid var(--tll-ui-ink);padding:22px 0 0;margin:30px 0 0}.tll-ex-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);gap:14px;overflow-x:auto;padding:6px 0 10px}'+
'.tll-ex-rail a{position:relative;display:block;border:1px solid var(--tll-ui-line);border-radius:6px;background:#fff;color:var(--tll-ui-ink);text-decoration:none;overflow:hidden}.tll-ex-rail .ph{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:var(--tll-ui-line)}.tll-ex-rail b{display:block;font:800 19px/1.2 var(--tll-ui-f-head);padding:12px}'+
'.tll-ex-books{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}.tll-ex-book{border:1px solid var(--tll-ui-line);border-radius:6px;background:#fff;padding:14px;display:flex;flex-direction:column;gap:6px}'+
'.tll-ex-book header{display:flex;gap:10px;align-items:center}.tll-ex-book header img{width:48px;height:48px;border-radius:50%;object-fit:cover}.tll-ex-book b{font:800 19px/1.2 var(--tll-ui-f-head)}.tll-ex-book small{color:var(--tll-ui-muted-2);display:block}'+
'.tll-ex-book .acts{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:8px}.tll-ex-book .rep{font-size:13px;color:var(--tll-ui-muted-2)}'+
'.tll-ex details{border:1px dashed #C8B9A6;border-radius:6px;padding:12px 14px;background:#fff;margin:0 0 16px}.tll-ex summary{cursor:pointer;font-weight:600;min-height:28px}'+
'.tll-ex-set label{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--tll-ui-line);border-radius:6px;padding:10px 12px;background:#fff;margin:0 0 8px;cursor:pointer}.tll-ex-set input[type=checkbox]{width:18px;height:18px;margin-top:2px;accent-color:var(--tll-ui-rose-text);flex:none}'+
'.tll-ex-set input[type=text]{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid var(--tll-ui-line);border-radius:4px;background:var(--tll-ui-paper);min-height:44px}'+
'.tll-ex.tll-ex-moves{margin:10px 0}#tll-ex-set label.tll-ex-desk{display:block}'+
'@media (max-width:760px){.tll-ex-prom{grid-template-columns:1fr}}';
var U=window.__tllUI,el=U.el; /* shared helpers from the core (tll-components-v1.js) */
function css(){U.style('tll-expat-v1',CSS);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function get(path){return U.json(API+path);}
function cname(c){c=String(c||'').toUpperCase();try{return new Intl.DisplayNames(['en'],{type:'region'}).of(c)||c;}catch(e){return c;}}
function plural(n,one,many){return n+' '+(n===1?one:many);}

/* Profile */
function profile(slug){get('/album?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||!d.homes||document.getElementById('tll-ex-lived'))return;css();var h=d.homes;
  var S=document.querySelector('[data-pf5="stats"]'),ranges=S&&/under 10|-something/.test(S.textContent||'');
  if(S&&h.total>0&&!ranges){var cell=el('div'),b=el('button','tll-ex-stat');b.type='button';b.id='tll-ex-lived';b.setAttribute('aria-expanded','false');
    b.appendChild(el('div','pf5-stat-v',String(h.total)));b.appendChild(el('div','pf5-stat-k',h.total===1?'COUNTRY LIVED IN':'COUNTRIES LIVED IN'));cell.appendChild(b);
    var info=S.querySelector('.pf5-stat-i');if(info)S.insertBefore(cell,info);else S.appendChild(cell);
    var pop=el('div','tll-ex tll-ex-pop');pop.hidden=true;pop.id='tll-ex-lived-list';b.setAttribute('aria-controls',pop.id);pop.appendChild(el('p','tll-ex-k tll-ui-kicker','Places I have lived'));
    if(h.places.length){var ul=el('ul');h.places.forEach(function(p){var li=el('li'),im=el('img');im.src=FLAGS+p.c+'.svg';im.alt='';li.appendChild(im);var t=el('div');t.appendChild(document.createTextNode(cname(p.c)));if(p.years)t.appendChild(el('small','',p.years));li.appendChild(t);ul.appendChild(li);});pop.appendChild(ul);}
    else pop.appendChild(el('p','','Counted from the map. The places and years appear here once they are added on the profile.'));
    S.insertAdjacentElement('afterend',pop);b.onclick=function(){pop.hidden=!pop.hidden;b.setAttribute('aria-expanded',String(!pop.hidden));};}
  var head=S||document.querySelector('main h1');
  if(head&&h.badges&&h.badges.length){var bd=el('div','tll-ex tll-ex-badges');bd.setAttribute('aria-label','Milestones');h.badges.forEach(function(k){bd.appendChild(el('span','tll-ex-badge',BADGES[k]||k));});head.insertAdjacentElement('afterend',bd);}
  if(d.moves&&window.__tllAlbumShow){var mv=el('div','tll-ex tll-ex-moves');var btn=el('button','tll-ex-btn ink','▶ My moves');btn.type='button';mv.appendChild(btn);(head||document.body).insertAdjacentElement('afterend',mv);
    btn.onclick=function(){track('slideshow_play',{show:'my-moves'});window.__tllAlbumShow({key:'moves',name:'My moves',photos:d.moves.map(function(m){return{img:m.img||FLAGS+m.c+'.svg',alt:m.alt||cname(m.c),line:m.line||cname(m.c),sub:[cname(m.c),m.years].filter(Boolean).join(' · '),href:m.href};})},d.name);};}
}).catch(function(){});
  /* Person schema: the home base keeps its country only. */
  [].slice.call(document.querySelectorAll('script[type="application/ld+json"]')).forEach(function(s){try{var j=JSON.parse(s.textContent);if(j&&j.homeLocation&&j.homeLocation.name){var parts=String(j.homeLocation.name).split(',');j.homeLocation.name=parts[parts.length-1].trim();s.textContent=JSON.stringify(j);}}catch(e){}});
}

/* Edit profile */
function editProfile(){var anchor=document.getElementById('tll-alb-set')||document.getElementById('tll-st')||document.getElementById('tll-col');if(!anchor||document.getElementById('tll-ex-set'))return;
  post('/album/settings',{read:true}).then(function(s){if(!s||!s.ok||document.getElementById('tll-ex-set'))return;css();
    var sec=el('section','ep-sec tll-ex tll-ex-set');sec.id='tll-ex-set';sec.appendChild(el('h2','ep-eb','05E · Your moves'));
    sec.appendChild(el('p','ep-lede','For the places you have lived. Everything here is off until you switch it on.'));
    var msg=el('p','tll-ex-small');msg.setAttribute('aria-live','polite');
    function sw(key,label,sub){var l=el('label'),i=el('input');i.type='checkbox';i.checked=s[key]===true;l.appendChild(i);var t=el('span');t.appendChild(el('b','',label));if(sub){t.appendChild(el('br'));t.appendChild(el('small','',sub));}l.appendChild(t);
      i.addEventListener('change',function(){var b={};b[key]=i.checked;i.disabled=true;post('/album/settings',b).then(function(r){i.disabled=false;msg.textContent=r&&r.ok?'Saved.':'That did not save. Try again.';if(!(r&&r.ok))i.checked=!i.checked;});});sec.appendChild(l);}
    sw('showHomeBase','Show my home base on my profile','City and country only. Off: your profile and cards leave it out.');
    sw('coffee','Open to coffee with newcomers','Puts your card in the Living Library on For Expats. No contact details on the card; people reach you through your profile after they sign in.');
    sw('moves','Show "My moves" on my profile','A slide show, one slide per place you have lived, in order.');
    sw('movedBack','I moved back','Adds the Moved back milestone to your profile.');
    if(s.desks&&s.desks.length){sec.appendChild(el('p','tll-ex-k tll-ui-kicker','One line per home, for My moves (optional)'));var lines=Object.assign({},s.moveLines||{}),t0=null;
      s.desks.forEach(function(dk){var l=el('label','tll-ex-desk');l.appendChild(el('span','',cname(dk.c)+(dk.years?' · '+dk.years:'')));var i=el('input');i.type='text';i.maxLength=90;i.value=lines[dk.c]||'';i.placeholder='The moving boxes won.';l.appendChild(i);sec.appendChild(l);
        i.addEventListener('input',function(){lines[dk.c]=i.value;clearTimeout(t0);t0=setTimeout(function(){post('/album/settings',{moveLines:lines}).then(function(r){msg.textContent=r&&r.ok?'Saved.':'That did not save.';});},900);});});}
    sec.appendChild(msg);anchor.insertAdjacentElement('afterend',sec);});}

/* The Living Library */
function shuffle(list){var seed;try{seed=sessionStorage.getItem('tll-ll-seed');if(!seed){seed=String(Math.floor(Math.random()*1e9));sessionStorage.setItem('tll-ll-seed',seed);}}catch(e){seed=String(Math.floor(Math.random()*1e9));}
  var x=Number(seed)||1,a=list.slice();for(var i=a.length-1;i>0;i--){x=(x*1103515245+12345)%2147483648;var j=x%(i+1),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function library(books){var signed=!!tok(),wrap=el('div','tll-ex-row');wrap.id='living-library';wrap.appendChild(el('p','tll-ex-k tll-ui-kicker','The Living Library'));wrap.appendChild(el('h3','','People you can borrow for coffee'));
  var det=el('details'),sum=el('summary','','Borrow a book: how it works');det.appendChild(sum);
  [['Every card is a member who moved to this city and said yes to coffee with newcomers. Think of them as a book you can borrow for an hour.'],
   ['Good to ask: how they made their first friend here, which neighborhood felt like home, what they wish they had known in month one.'],
   ['Please do not ask for legal, immigration or tax advice, for their address or workplace, or for favors they did not offer. For rules, use the official sources on our guides.'],
   ['Saying thank you: buy the coffee. Nobody is paid through That Layover Life, so please do not offer money.']].forEach(function(t){det.appendChild(el('p','',t[0]));});
  wrap.appendChild(det);var g=el('div','tll-ex-books');
  shuffle(books).forEach(function(b){var c=el('article','tll-ex-book'),h=el('header');if(b.avatar){var im=el('img');im.src=b.avatar;im.alt='';im.loading='lazy';h.appendChild(im);}var hn=el('div');hn.appendChild(el('b','',b.name));
    var sub=[b.homeCity,b.years?b.years.replace(/now/i,'today'):''].filter(Boolean).join(' · ');if(sub)hn.appendChild(el('small','',sub));h.appendChild(hn);c.appendChild(h);
    if(b.knowsWell.length)c.appendChild(el('p','','Knows well: '+b.knowsWell.join('; ')));if(b.languages.length)c.appendChild(el('small','','Speaks '+b.languages.join(', ')));if(b.interests.length)c.appendChild(el('small','','Into '+b.interests.join(', ')));
    if(b.stories.length){var p=el('p');p.appendChild(document.createTextNode('Wrote: '));b.stories.forEach(function(s,i){var a=el('a','',s.title);a.href='/stories/'+s.slug;p.appendChild(a);if(i<b.stories.length-1)p.appendChild(document.createTextNode(' · '));});c.appendChild(p);}
    var acts=el('div','acts'),go=el('a','tll-ex-btn'+(signed?'':' ghost'),signed?'Get in touch':'Sign in to get in touch');go.href=signed?'/contributors/'+b.slug+'#contact':'/login';go.addEventListener('click',function(){track('living_library_contact',{signed:signed});});acts.appendChild(go);
    var rep=el('a','rep','Report');rep.href='/contact?subject='+encodeURIComponent('Report a Living Library card: '+b.slug);acts.appendChild(rep);c.appendChild(acts);g.appendChild(c);});
  wrap.appendChild(g);return wrap;}

/* For Expats landing */
function landing(){if(document.getElementById('tll-ex-land'))return;Promise.all([get('/series?group=expat'),get('/living-library')]).then(function(v){if(document.getElementById('tll-ex-land'))return;css();
  var series=(v[0]&&v[0].series||[]).filter(function(s){return s.stories.length;}),books=v[1]&&v[1].books||[];
  var sec=el('section','tll-ex tll-ex-sec');sec.id='tll-ex-land';var inn=el('div','tll-ex-in');sec.appendChild(inn);
  if(!EX_PUBLIC)inn.appendChild(el('p','tll-ex-flag','Preview · not live · copy is draft'));
  inn.appendChild(el('p','tll-ex-k tll-ui-kicker','For people who moved abroad'));inn.appendChild(el('h2','','Your homes count too.'));
  inn.appendChild(el('p','tll-ex-lede','For the people who fill their passports and have to get a new one. Mark the places you have lived, keep the move as a story, and find the people who did it before you.'));
  var cta=el('a','tll-ex-btn','Add the places you’ve lived');cta.href='/the-map?mark=lived&utm_source=for-expats&utm_medium=hero&utm_campaign=tll';cta.addEventListener('click',function(){track('signup_start',{from:'for-expats'});});inn.appendChild(cta);
  inn.appendChild(el('p','tll-ex-small','Free. No card. 16+.'));
  var pr=el('div','tll-ex-row');pr.appendChild(el('p','tll-ex-k tll-ui-kicker','The expat group without the comment section'));var pg=el('div','tll-ex-prom');
  var proms=[[series.length?'#tll-ex-series':'/stories','Stories from people who moved','The first friend, the partner who moved too, the move back home, told by the people who lived it.'],
    ['/countries','Pages with their sources','Practical pages link the official source and say when we last checked it.']];
  if(books.length)proms.push(['#living-library','People you can borrow for coffee','Members who said yes to coffee with newcomers. No contact details on cards, no paid places.']);
  proms.forEach(function(p){var a=el('a');a.href=p[0];a.appendChild(el('b','',p[1]));a.appendChild(el('span','',p[2]));pg.appendChild(a);});pr.appendChild(pg);inn.appendChild(pr);
  if(series.length){var sr=el('div');sr.id='tll-ex-series';series.forEach(function(s){var row=el('div','tll-ex-row');row.appendChild(el('h3','',s.name));var r=el('div','tll-ex-rail');
    s.stories.slice(0,12).forEach(function(c){var a=el('a');a.href='/stories/'+c.slug;var im=el(c.image?'img':'div','ph');if(c.image){im.src=c.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(el('span','tll-ex-tape tll-ui-tape tll-ui-tape--sm tll-ui-tape--corner',c.label));a.appendChild(el('b','',c.title));r.appendChild(a);});row.appendChild(r);sr.appendChild(row);});inn.appendChild(sr);}
  if(books.length)inn.appendChild(library(books));
  var pr2=el('div','tll-ex-row');pr2.appendChild(el('p','tll-ex-k tll-ui-kicker','Moving with a pet'));var pa=el('a','tll-ex-btn ghost','The Paw Passport');pa.href='/the-paw-passport?utm_source=for-expats&utm_medium=practical&utm_campaign=paw-passport';
  pa.addEventListener('click',function(){track('practical_click',{division:'paw-passport',to:'the-paw-passport'});});pr2.appendChild(pa);inn.appendChild(pr2);
  var club=el('div','tll-ex-row');var cp=el('p','');cp.appendChild(document.createTextNode('That Layover Life stays free because readers chip in. '));var ca=el('a','','The Layover Club');ca.href='/support#layover-club';ca.addEventListener('click',function(){track('revenue_click',{slot:'layover_club',from:'for-expats'});});cp.appendChild(ca);club.appendChild(cp);inn.appendChild(club);
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.insertBefore(sec,main.firstChild);});}

function run(){var m;
  if((m=/^\/contributors\/([^/]+)$/.exec(P)))profile(m[1]);
  else if(P==='/edit-profile')editProfile();
  else if(P==='/for-expats')landing();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1800);});else setTimeout(run,1800);
if(P==='/edit-profile')setTimeout(run,5200);
})();
