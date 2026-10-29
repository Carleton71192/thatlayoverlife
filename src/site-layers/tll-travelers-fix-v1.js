/* tll-travelers-fix-v1 (29 Oct 2026, Nancy's /travelers screenshot: the link chips look weird, the open slot still shows, the first grid cell is
   empty; Nancy agreed to retire the open-slot signals). /travelers only. Three fixes, namespaced tll-tf-, nothing removed, no data-ms-* element touched:
   1. Link chips: the 26px circles with IG, YT, WEB and LINK (clipped once the 12px type floor applies) become labelled pills (Instagram, YouTube,
      Website, Link) and move inside the card's text area, so they sit in the card padding instead of on its left edge. The chips are added by the
      page's own script after this one runs, so a watcher on the grid catches them as they arrive.
   2. Empty cells: a CMS item whose card is hidden (a Webflow condition) still took a grid cell. Items with no visible card are hidden.
   3. Open slot: the "OPEN SLOT · Your name here." card is hidden (the page script keeps writing to it on every filter click) and one action tile
      stands next to it, with copy that follows the pressed filter: Pitch your layover first, then the directory that filter is about.
   Later the same day (Nancy: "Maybe we separate pets from people? Breed is weird on the search bar"; "Zain's flags are hard to see the white parts"):
   4. Pets get their own block under the people, titled Travel companions with a link to The Paw Passport; the Pets list is moved there, not removed.
      The first chip reads People, the Pets chip is hidden, and every chip count and the N CARDS line count people only (computed from the cards).
      The search box reads Name, city or country; a search still narrows the pets block, and the filter chips no longer hide it.
   5. Empty grid cells: the open-slot embed sits in the grid as display:contents, and Webflow's base CSS gives every .w-embed a ::before and ::after
      clearfix pinned to grid row 1, column 1, which took the first cell; those are switched off inside the grid. Any item whose card is not shown
      is also hidden with its own class, so the page script's filter clicks cannot bring that gap back.
   6. Card flags get a thin dark ring so white areas of a flag read on the cream card. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/travelers')return;
var LABEL={instagram:'Instagram',youtube:'YouTube',website:'Website',blog:'Website',tiktok:'TikTok',strava:'Strava',newsletter:'Newsletter',other:'Link'};
var TILE={
 everyone:{ey:'WRITE FOR TLL',t:'Pitch your layover.',b:'We edit lightly and keep your byline. Your card here comes with it.',c:'Pitch a layover story →',h:'/submit',s:['or join the Travelers','/signup']},
 expats:{ey:'LIVE THERE',t:'Know a place by heart?',b:'Switch on Live there in your profile and your page lists under the city you call home.',c:'Switch on Live there →',h:'/edit-profile'},
 creators:{ey:'MAKE THINGS',t:'Show your work.',b:'Switch on Make things and the links you choose sit on your page.',c:'Add your links →',h:'/edit-profile'},
 press:{ey:'PRESS',t:'Working travel journalist?',b:'Switch on Press. An editor reviews within 48 hours, and hosted trips stay labeled at the top of every story.',c:'Apply as press →',h:'/edit-profile'},
 pets:{ey:'PETS',t:'Travel with a pet?',b:'Any species, with paperwork. A pet gets a passport page of their own.',c:'Add a pet →',h:'/my-pets'}
};
var MONO="'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";
var CSS=
"html body .tll-trav-linkchips{display:flex!important;flex-wrap:wrap;gap:8px!important;margin:14px 0 0!important;padding:0!important}"+
"html body .tll-trav-linkchips span{width:auto!important;height:auto!important;min-height:32px;padding:0 12px!important;display:inline-flex!important;align-items:center;box-sizing:border-box;"+
"border:1px solid #D9D2C5!important;border-radius:999px!important;background:#FDF9F3!important;color:#1A1A1A!important;font:600 12px/1 "+MONO+"!important;letter-spacing:.06em!important;"+
"text-transform:none;cursor:pointer;transition:border-color 150ms ease}"+
"html body .tll-trav-linkchips span:hover{border-color:#C8325B!important}"+
"html body .tll-trav-linkchips span:focus-visible{outline:2px solid #C8325B!important;outline-offset:2px;border-color:#C8325B!important}"+
"html body [data-tv-open]{display:none!important}"+
"html body .tv-flags span{box-shadow:0 0 0 1px rgba(10,11,20,.24)!important}"+
"html body [data-tll-roster-grid] .tll-tf-gone,html body .tll-tf-pets-grid .tll-tf-gone{display:none!important}"+
"html body [data-tll-roster-grid] .w-embed::before,html body [data-tll-roster-grid] .w-embed::after{content:none!important;display:none!important}"+
"html body [data-tv-chips] [data-tv-filter=\"pets\"]{display:none!important}"+
".tll-tf-pets{margin:64px 0 0}.tll-tf-pets[hidden]{display:none!important}"+
".tll-tf-pets-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 24px;border-top:3px solid #0A0B14;border-bottom:1px solid #E0DACE;padding:16px 0;margin:0 0 32px}"+
".tll-tf-pets-h{font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:28px;line-height:1.1;letter-spacing:-.02em;color:#0A0B14;margin:0}"+
".tll-tf-pets-a{font:700 12px/1.4 "+MONO+";letter-spacing:1.5px;text-transform:uppercase;color:#067A79!important;text-decoration:none!important;min-height:44px;display:inline-flex;align-items:center}"+
".tll-tf-pets-a:hover{text-decoration:underline!important}.tll-tf-pets-a:focus-visible{outline:3px solid #0A0B14;outline-offset:2px}"+
".tll-tf-pets-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));gap:24px;align-items:stretch}"+
".tll-tf-pets-grid .w-dyn-item,.tll-tf-pets-grid .w-dyn-item.tv-hide{display:flex!important;min-width:0}"+
".tll-tf-pets-grid .w-dyn-item.tll-tf-pno{display:none!important}"+
".tll-tf-tile{border:1px solid #E0DACE;background:#FDF9F3;padding:24px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;min-height:280px;min-width:0;box-sizing:border-box}"+
".tll-tf-tile[hidden]{display:none!important}"+
".tll-tf-ey{font:600 12px/1.4 "+MONO+";letter-spacing:.18em;color:#C8325B;text-transform:uppercase}"+
".tll-tf-t{font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:24px;line-height:1.05;letter-spacing:-.02em;margin:10px 0 0;color:#0A0B14}"+
".tll-tf-b{font-family:'IBM Plex Sans Condensed','DM Sans',system-ui,sans-serif;font-size:14px;line-height:1.5;color:#3a3a3a;margin:10px 0 0}"+
".tll-tf-acts{display:flex;flex-direction:column;align-items:flex-start;gap:10px}"+
".tll-tf-c{font-family:'IBM Plex Sans Condensed','DM Sans',system-ui,sans-serif;font-size:15px;font-weight:600;background:#D63859;color:#fff!important;border:0;border-radius:0;padding:12px 20px;min-height:44px;box-sizing:border-box;display:inline-flex;align-items:center;text-decoration:none!important}"+
".tll-tf-c:hover{background:#B82C4B}"+
".tll-tf-c:focus-visible,.tll-tf-s:focus-visible{outline:3px solid #0A0B14;outline-offset:2px}"+
".tll-tf-s{font-family:'IBM Plex Sans Condensed','DM Sans',system-ui,sans-serif;font-size:14px;color:#1A1A1A!important;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}";
function style(){if(document.getElementById('tll-travelers-fix-v1'))return;var s=document.createElement('style');s.id='tll-travelers-fix-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
style();
function chips(root){[].forEach.call((root||document).querySelectorAll('.tll-trav-linkchips'),function(row){
  if(!row.dataset.tllTf){row.dataset.tllTf='1';[].forEach.call(row.querySelectorAll('span[data-t]'),function(sp){var l=LABEL[sp.getAttribute('data-t')]||'Link';sp.textContent=l;sp.setAttribute('aria-label',l+', opens in a new tab');});}
  var card=row.closest('[data-tll-trav-card]'),body=card&&card.querySelector('.tv-body');if(body&&row.parentNode!==body)body.appendChild(row);});}
function visible(el){if(!el)return false;var cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return false;var r=el.getBoundingClientRect();return r.width>0&&r.height>0;}
function shown(c){if(!c||c.classList.contains('w-condition-invisible'))return false;var cs=getComputedStyle(c);return cs.display!=='none'&&cs.visibility!=='hidden';}
/* An item whose card is hidden (or that has no card) gets its own class; the page script toggles tv-hide on every filter click and would bring the gap back. */
function empties(){[].forEach.call(document.querySelectorAll('[data-tll-roster-grid] .w-dyn-item,.tll-tf-pets-grid .w-dyn-item'),function(it){
  if(!shown(it.querySelector('[data-tll-trav-card]')))it.classList.add('tll-tf-gone');});}
function on(c,k){var m=c.querySelector('[data-tv-on="'+k+'"]');return !!m&&!m.classList.contains('w-condition-invisible');}
function words(){var q=document.querySelector('input[data-tll-trav-search]');return q?q.value.trim().toLowerCase().split(/\s+/).filter(Boolean):[];}
function people(){return [].slice.call(document.querySelectorAll('[data-tll-roster-grid] [data-tll-trav-card]')).filter(function(c){
  var it=c.closest('.w-dyn-item');return c.getAttribute('data-tll-trav-card')!=='pet'&&!(it&&it.classList.contains('tll-tf-gone'));});}
var busy=false;
/* Counts come from the cards on the page: people only, now that pets have their own block. */
function counts(){if(busy)return;busy=true;try{
  var ps=people();
  ['everyone','expats','creators','press'].forEach(function(f){var n=ps.filter(function(c){return f==='everyone'||on(c,f);}).length;
    var sp=document.querySelector('[data-tv-filter="'+f+'"] [data-tv-n]');if(sp&&sp.textContent!==' · '+n)sp.textContent=' · '+n;});
  var line=document.querySelector('[data-tv-countline]');if(line){var cur=current(),w=words();
    var total=ps.filter(function(c){return cur==='everyone'||on(c,cur);}).length;
    var vis=ps.filter(function(c){var it=c.closest('.w-dyn-item');return !(it&&it.classList.contains('tv-hide'));}).length;
    var t=w.length?vis+' OF '+total:total+(total===1?' CARD':' CARDS');if(line.textContent!==t)line.textContent=t;}
  pets();}finally{busy=false;}}
/* The pets block follows the search box, not the chips. */
function pets(){var box=document.querySelector('.tll-tf-pets');if(!box)return;var w=words(),n=0;
  [].forEach.call(box.querySelectorAll('.w-dyn-item'),function(it){if(it.classList.contains('tll-tf-gone'))return;var c=it.querySelector('[data-tll-trav-card]');
    var t=c?((c.getAttribute('aria-label')||'')+' '+(c.textContent||'')).toLowerCase():'';var ok=!!c&&w.every(function(x){return t.indexOf(x)>-1;});
    it.classList.toggle('tll-tf-pno',!ok);if(ok)n++;});
  box.hidden=!n;}
function separate(){var grid=document.querySelector('[data-tll-roster-grid]'),list=grid&&grid.querySelector('[data-tv-list="pets"]');
  var ev=document.querySelector('[data-tv-filter="everyone"]');if(ev){var tn=ev.firstChild;if(tn&&tn.nodeType===3&&/everyone/i.test(tn.nodeValue))tn.nodeValue='People';}
  var q=document.querySelector('input[data-tll-trav-search]');if(q&&/breed/i.test(q.getAttribute('placeholder')||''))q.setAttribute('placeholder','Name, city or country');
  var lt=document.querySelector('[data-tll-trav-search-text]');if(lt&&/pet/i.test(lt.getAttribute('data-tll-trav-search-text')))lt.setAttribute('data-tll-trav-search-text','Find a traveler');
  var pp=document.querySelector('[data-tv-filter="pets"][aria-pressed="true"]');if(pp&&ev)ev.click();
  if(list&&!document.querySelector('.tll-tf-pets')){var box=document.createElement('div');box.className='tll-tf-pets';
    box.innerHTML='<div class="tll-tf-pets-head"><h2 class="tll-tf-pets-h">Travel companions</h2><a class="tll-tf-pets-a" href="/the-paw-passport">The Paw Passport →</a></div><div class="tll-tf-pets-grid"></div>';
    box.querySelector('.tll-tf-pets-grid').appendChild(list);grid.parentNode.insertBefore(box,grid.nextSibling);}
  empties();counts();
  var line=document.querySelector('[data-tv-countline]');
  if(line&&!line.__tllTf){line.__tllTf=1;new MutationObserver(function(){counts();}).observe(line,{childList:true,characterData:true,subtree:true});}
  if(q&&!q.__tllTf){q.__tllTf=1;q.addEventListener('input',function(){setTimeout(counts,200);});q.addEventListener('search',function(){setTimeout(counts,0);});}}
function current(){var b=document.querySelector('[data-tv-filter][aria-pressed="true"]');var k=b&&b.getAttribute('data-tv-filter');return TILE[k]?k:'everyone';}
var tile=null;
function paint(){if(!tile)return;var o=TILE[current()];
  tile.innerHTML='<div><div class="tll-tf-ey"></div><div class="tll-tf-t"></div><p class="tll-tf-b"></p></div><div class="tll-tf-acts"><a class="tll-tf-c"></a></div>';
  tile.querySelector('.tll-tf-ey').textContent=o.ey;tile.querySelector('.tll-tf-t').textContent=o.t;tile.querySelector('.tll-tf-b').textContent=o.b;
  var a=tile.querySelector('.tll-tf-c');a.textContent=o.c;a.href=o.h;
  if(o.s){var s=document.createElement('a');s.className='tll-tf-s';s.textContent=o.s[0];s.href=o.s[1];tile.querySelector('.tll-tf-acts').appendChild(s);}}
function mirror(open){if(tile)tile.hidden=open.classList.contains('tv-hide');}
function placeTile(){var open=document.querySelector('[data-tv-open]');if(!open||tile)return;
  tile=document.createElement('div');tile.className='tll-tf-tile';open.parentNode.insertBefore(tile,open.nextSibling);paint();mirror(open);
  new MutationObserver(function(){mirror(open);}).observe(open,{attributes:true,attributeFilter:['class']});
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-tv-filter]'))setTimeout(paint,0);});}
function run(){style();chips();placeTile();setTimeout(separate,0);
  var grid=document.querySelector('[data-tll-roster-grid]');
  if(grid&&!grid.__tllTf){grid.__tllTf=1;new MutationObserver(function(ms){for(var i=0;i<ms.length;i++)for(var j=0;j<ms[i].addedNodes.length;j++){var n=ms[i].addedNodes[j];
    if(n.nodeType===1&&(n.classList.contains('tll-trav-linkchips')||n.querySelector('.tll-trav-linkchips'))){chips(grid);return;}}}).observe(grid,{childList:true,subtree:true});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.addEventListener('load',function(){run();chips();separate();setTimeout(function(){chips();separate();},600);});
})();
