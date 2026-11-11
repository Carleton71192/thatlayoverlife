/* tll-site-layers-v16 chunk map: loaded by the core loader on paths matching /^\/the-map$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
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
