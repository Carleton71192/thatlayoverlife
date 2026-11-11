/* tll-site-layers-v16 chunk home: loaded by the core loader on paths matching /^\/(index\.html)?$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-redesign-p0-v1.js */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
var SOON=/^(moving guides|visa trackers|lifestyle hubs|city hubs)$/i;
function unlink(a){var d=document.createElement('div');d.className=a.className.replace(/(^|\s)tll-rv(-in)?(?=\s|$)/g,' ').trim();
  [].forEach.call(a.attributes,function(x){if(!/^(href|class|target|rel|download|hreflang|ping|referrerpolicy|type|aria-disabled|tabindex)$/i.test(x.name))d.setAttribute(x.name,x.value);});
  while(a.firstChild)d.appendChild(a.firstChild);a.parentNode.replaceChild(d,a);return d;}
function expats(){
  var cards=[].filter.call(document.querySelectorAll('a.h3-ex-card'),function(a){var b=a.querySelector('b');return b&&SOON.test(b.textContent.trim())&&![].some.call(a.attributes,function(x){return /^data-ms-/i.test(x.name);});});
  if(!cards.length||document.querySelector('.tll-soon-line'))return;
  cards=cards.map(function(a){var d=unlink(a);d.setAttribute('data-tll-soon','');
    var t=document.createElement('em');t.className='tll-soon-tag';t.textContent='Coming soon';d.insertBefore(t,d.firstChild);return d;});
  var form=document.getElementById('wf-form-The-Layover-Letter')||document.getElementById('h3-news-email');
  var line=document.createElement('p');line.className='tll-soon-line';
  line.innerHTML='Guides, visa dates and city hubs are on the way. <a href="#'+(form?form.id:'h3b-letter')+'">Get the letter and hear when they open →</a>';
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
  s.textContent='.h3-ex-card[data-tll-soon]{cursor:default}.h3-ex-card[data-tll-soon]:hover{transform:none;border-color:var(--h3-line,#E0DACE)}.tll-soon-tag{display:inline-block;align-self:flex-start;width:max-content;margin:0 0 8px;padding:2px 8px;border-radius:2px;background:#0A0B14;color:#FDF9F3;font:600 11px/1.5 "JetBrains Mono",ui-monospace,monospace;font-style:normal;letter-spacing:1.5px;text-transform:uppercase}'+
  '.tll-soon-line{margin:14px 0 0;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-soon-line a{color:inherit;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}';
  document.head.appendChild(s);}
function run(){if(P==='/'){css();expats();shelf();band();}if(P==='/the-map')mapPage();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
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
