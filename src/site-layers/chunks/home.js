/* tll-site-layers-v16 chunk home: loaded by the core loader on paths matching /^\/(index\.html)?$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-home-bands-v1.js */
(function(){
if(!/^\/(index\.html)?$/.test(location.pathname))return;
var C='https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/';
var B={
 rio:{src:C+'6ac86ab8eaf54b2878f9344b_6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river.jpeg',w:2400,h:1350,
  alt:'A jaguar swimming across the Cuiaba River in the Pantanal',pos:'50% 42%',label:'In the library · Pantanal, Brazil',by:'Nancy Carleton',href:'/stories/pantanal-glimmers-in-the-wild'},
 montenegro:{src:C+'6aba3d42f18f65b8d06aea74_6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars.jpeg',w:2400,h:1350,
  alt:'A murmuration of starlings at sunset during Sort Sol, cars parked below',pos:'50% 40%',label:'On the map · Sort Sol, Denmark',by:'Nancy Carleton',href:'/stories/sort-sol-black-sun-denmark'}
};
var CSS=".h3-il[data-tll-band] figcaption{padding:0!important;background:none!important}"+
".h3-il[data-tll-band] figcaption a{display:inline-block;padding:8px 12px;background:rgba(10,11,20,.72);color:#F7F1E8!important;text-decoration:none!important}"+
".h3-il[data-tll-band] figcaption b{font-weight:600}"+
".h3-il[data-tll-band] figcaption a:hover b,.h3-il[data-tll-band] figcaption a:focus-visible b{text-decoration:underline;text-decoration-color:#F0507A;text-underline-offset:3px}"+
".h3-il[data-tll-band] figcaption a:focus-visible{outline:3px solid #F0507A;outline-offset:3px}";
function swap(){
  if(!document.getElementById('tll-home-bands-v1')){var s=document.createElement('style');s.id='tll-home-bands-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  Object.keys(B).forEach(function(k){
    var f=document.querySelector('figure.h3-il[data-h3-il="'+k+'"]');if(!f||f.getAttribute('data-tll-band'))return;
    var p=B[k],i=f.querySelector('img'),c=f.querySelector('figcaption');if(!i||!c)return;
    f.setAttribute('data-tll-band','1');
    i.removeAttribute('srcset');i.removeAttribute('sizes');i.src=p.src;i.alt=p.alt;i.width=p.w;i.height=p.h;i.style.objectPosition=p.pos;
    var a=document.createElement('a');a.href=p.href;a.appendChild(document.createTextNode(p.label+' · '));
    var b=document.createElement('b');b.textContent=p.by;a.appendChild(b);c.textContent='';c.appendChild(a);
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',swap);else swap();
})();
/* src/site-layers/tll-redesign-p0-v1.js */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
var SOON=/^(moving guides|visa trackers|lifestyle hubs|city hubs)$/i;
function expats(){
  var cards=[].filter.call(document.querySelectorAll('a.h3-ex-card'),function(a){var b=a.querySelector('b');return b&&SOON.test(b.textContent.trim());});
  if(!cards.length||document.querySelector('.tll-soon-line'))return;
  cards.forEach(function(a){a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.setAttribute('data-tll-soon','');
    var t=document.createElement('em');t.className='tll-soon-tag';t.textContent='Coming soon';a.insertBefore(t,a.firstChild);});
  var form=document.getElementById('wf-form-The-Layover-Letter')||document.getElementById('h3-news-email');
  var line=document.createElement('p');line.className='tll-soon-line';
  line.innerHTML='Guides, visa dates and city hubs are on the way. <a href="#'+(form?form.id:'h3b-letter')+'">Get the Sunday letter and hear when they open →</a>';
  var last=cards[cards.length-1];last.parentNode.parentNode.insertBefore(line,last.parentNode.nextSibling);
}
function shelf(){[].forEach.call(document.querySelectorAll('.h3-card[href*="/stories/horseshoe-bend-arizona"]'),function(c){c.style.display='none';c.setAttribute('aria-hidden','true');c.setAttribute('tabindex','-1');});}
var RX=/^(\d+) countries( \+ AQ)?( · )/;
function band(){
  var dash=document.querySelector('[data-h3-dash]');if(!dash||dash.__tllLbl)return;dash.__tllLbl=1;
  function fix(){var w=document.createTreeWalker(dash,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){var m=t.nodeValue.match(RX);if(m)t.nodeValue=t.nodeValue.replace(RX,"Nancy's map: $1 countries"+(m[2]?' + Antarctica':'')+'$3');}}
  new MutationObserver(fix).observe(dash,{childList:true,subtree:true,characterData:true});fix();
}
function best(row){var r=0;for(var k in row){var v=row[k];r=Math.max(r,v==='lived'?3:v==='visited'?2:v==='layover'?1:0);}return r;}
function mapPage(){
  var card=[].filter.call(document.querySelectorAll('.tll-map-explainer-card'),function(c){var l=c.querySelector('.tll-map-explainer-label');return l&&/already logged/i.test(l.textContent);})[0];
  if(!card||card.__tll)return;card.__tll=1;
  var num=card.querySelector('.tll-map-explainer-num'),lab=card.querySelector('.tll-map-explainer-label');
  lab.textContent='On Nancy’s map';
  fetch('https://tll-travel-wire.thatlayoverlife.workers.dev/owner-map',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||d.v!==2||!d.states)return;var hum={};(d.travelers||[]).forEach(function(t){if(t&&!t.pet)hum[t.id]=1;});
    var c=0,ata=false;Object.keys(d.states).forEach(function(k){var row=d.states[k]||{},own={};for(var id in row)if(hum[id]||!Object.keys(hum).length)own[id]=row[id];if(best(own)>=2){if(k==='010')ata=true;else c++;}});
    if(c){num.textContent=String(c);if(ata)lab.textContent='On Nancy’s map, plus Antarctica';}
  }).catch(function(){});
}
function css(){if(document.getElementById('tll-redesign-p0-v1'))return;var s=document.createElement('style');s.id='tll-redesign-p0-v1';
  s.textContent='.h3-ex-card[data-tll-soon]{cursor:default}.h3-ex-card[data-tll-soon]:hover{transform:none}.tll-soon-tag{display:inline-block;align-self:flex-start;width:max-content;margin:0 0 8px;padding:2px 8px;border-radius:2px;background:#0A0B14;color:#FDF9F3;font:600 11px/1.5 "JetBrains Mono",ui-monospace,monospace;font-style:normal;letter-spacing:1.5px;text-transform:uppercase}'+
  '.tll-soon-line{margin:14px 0 0;font:400 15px/1.5 "Inter Tight","IBM Plex Sans Condensed",system-ui,sans-serif}.tll-soon-line a{color:inherit;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}';
  document.head.appendChild(s);}
function run(){if(P==='/'){css();expats();shelf();band();}if(P==='/the-map')mapPage();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();
/* src/site-layers/tll-home-value-v1.js */
(function(){
var PUBLIC=true;
var P=location.pathname.replace(/\/+$/,'')||'/';if(P!=='/')return;
var q=new URLSearchParams(location.search).get('preview');
try{if(q==='value')localStorage.setItem('tll-preview-value','1');if(q==='off')localStorage.removeItem('tll-preview-value');}catch(e){}
var on=PUBLIC;try{on=on||localStorage.getItem('tll-preview-value')==='1';}catch(e){}
if(!on&&q!=='value')return;
var PURSUITS=[['foodie','Food'],['marathons','Marathons'],['trekking','Trekking'],['dog-travel','Dog travel']];
var LINES=[['The slide show.','Remember when Grandpa pulled out the slide projector after dinner? This is that.'],
  ['The trip deck.','Remember the 80-slide deck someone made of one weekend in Boston? This is that, except people ask to see it.'],
  ['The lost account.','A friend got locked out of Instagram and lost every travel photo with it. TLL is the copy that does not vanish when an app decides you are someone else.']];
var CSS='.tll-val{background:#FDF9F3;color:#0A0B14;padding:72px 16px 80px;font:400 17px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif}'+
'.tll-val-in{max-width:1120px;margin:0 auto}.tll-val-ey{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:2px;text-transform:uppercase;color:#067A79;margin:0 0 14px}'+
'.tll-val h2{font:800 clamp(30px,4.6vw,52px)/1.04 "Playfair Display",Georgia,serif;margin:0 0 16px;max-width:18ch}.tll-val h2 em{font-style:italic;color:#C8325B}'+
'.tll-val-lede{max-width:60ch;color:#3a3833;margin:0 0 36px}'+
'.tll-val-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin:0 0 48px}'+
'.tll-val-card{border-top:2px solid #0A0B14;padding:16px 0 0}.tll-val-card b{display:block;font:800 22px/1.15 "Playfair Display",Georgia,serif;margin:0 0 8px}.tll-val-card p{margin:0;color:#3a3833}'+
'.tll-val-ask{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;border:1px solid #E0DACE;background:#fff;border-radius:4px;padding:20px}'+
'.tll-val-ask strong{font:800 24px/1.1 "Playfair Display",Georgia,serif;margin-right:8px}'+
'.tll-val-ask a{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1.5px solid #0A0B14;border-radius:999px;color:#0A0B14;text-decoration:none;font-weight:600}'+
'.tll-val-ask a:hover,.tll-val-ask a:focus-visible{background:#0A0B14;color:#FDF9F3}'+
'.tll-val-ask a.p{background:#C8325B;border-color:#C8325B;color:#fff}'+
'.tll-val-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 10px}'+
'@media (max-width:760px){.tll-val{padding:52px 16px 60px}.tll-val-grid{grid-template-columns:1fr;gap:22px}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function track(name,extra){try{window.gtag&&gtag('event',name,Object.assign({division:'tll'},extra||{}));}catch(e){}}
function run(){
  if(document.getElementById('tll-val'))return;
  var hero=document.querySelector('[data-h3-hero]');if(!hero)return;
  if(!document.getElementById('tll-home-value-v1')){var s=el('style');s.id='tll-home-value-v1';s.textContent=CSS;document.head.appendChild(s);}
  var sec=el('section','tll-val');sec.id='tll-val';sec.setAttribute('aria-labelledby','tll-val-h');
  var inn=el('div','tll-val-in');sec.appendChild(inn);
  if(!PUBLIC)inn.appendChild(el('p','tll-val-flag','Preview · not live'));
  inn.appendChild(el('p','tll-val-ey','Why That Layover Life'));
  var h=el('h2');h.id='tll-val-h';h.appendChild(document.createTextNode('The family slide show, rebuilt for people who '));h.appendChild(el('em','','never stop going.'));inn.appendChild(h);
  inn.appendChild(el('p','tll-val-lede',"It keeps your trips somewhere that is yours, shows them off the way Grandpa's slide projector did, and puts you next to people who travel the way you do. Free, no card, 16+."));
  var g=el('div','tll-val-grid');LINES.forEach(function(l){var c=el('div','tll-val-card');c.appendChild(el('b','',l[0]));c.appendChild(el('p','',l[1]));g.appendChild(c);});inn.appendChild(g);
  var ask=el('div','tll-val-ask');ask.appendChild(el('strong','','What do you collect?'));
  PURSUITS.forEach(function(p){var a=el('a','',p[1]);/* Phase 0 (31 Oct): the pursuit hubs are not built yet (/pursuits/* answered 404), so these open the library search instead. */
    var Q={foodie:'food',marathons:'marathon',trekking:'trek'};a.href=(p[0]==='dog-travel'?'/the-paw-passport?':'/stories?q='+Q[p[0]]+'&')+'utm_source=home&utm_medium=value&utm_campaign='+(p[0]==='dog-travel'?'paw-passport':'tll');a.addEventListener('click',function(){track('value_pursuit_click',{pursuit:p[0]});});ask.appendChild(a);});
  var j=el('a','p','Countries, too: join free');j.href='/signup?utm_source=home&utm_medium=value&utm_campaign=tll';j.addEventListener('click',function(){track('value_join_click');});ask.appendChild(j);
  inn.appendChild(ask);
  hero.insertAdjacentElement('afterend',sec);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();
