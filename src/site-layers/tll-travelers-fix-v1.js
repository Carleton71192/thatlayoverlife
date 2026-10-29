/* tll-travelers-fix-v1 (29 Oct 2026, Nancy's /travelers screenshot: the link chips look weird, the open slot still shows, the first grid cell is
   empty; Nancy agreed to retire the open-slot signals). /travelers only. Three fixes, namespaced tll-tf-, nothing removed, no data-ms-* element touched:
   1. Link chips: the 26px circles with IG, YT, WEB and LINK (clipped once the 12px type floor applies) become labelled pills (Instagram, YouTube,
      Website, Link) and move inside the card's text area, so they sit in the card padding instead of on its left edge. The chips are added by the
      page's own script after this one runs, so a watcher on the grid catches them as they arrive.
   2. Empty cells: a CMS item whose card is hidden (a Webflow condition) still took a grid cell. Items with no visible card are hidden.
   3. Open slot: the "OPEN SLOT · Your name here." card is hidden (the page script keeps writing to it on every filter click) and one action tile
      stands next to it, with copy that follows the pressed filter: Pitch your layover first, then the directory that filter is about. */
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
function empties(){[].forEach.call(document.querySelectorAll('[data-tll-roster-grid] .w-dyn-item'),function(it){if(it.classList.contains('tv-hide'))return;
  var c=it.querySelector('[data-tll-trav-card]');if(!c||!visible(c))it.classList.add('tv-hide');});}
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
function run(){style();chips();placeTile();
  var grid=document.querySelector('[data-tll-roster-grid]');
  if(grid&&!grid.__tllTf){grid.__tllTf=1;new MutationObserver(function(ms){for(var i=0;i<ms.length;i++)for(var j=0;j<ms[i].addedNodes.length;j++){var n=ms[i].addedNodes[j];
    if(n.nodeType===1&&(n.classList.contains('tll-trav-linkchips')||n.querySelector('.tll-trav-linkchips'))){chips(grid);return;}}}).observe(grid,{childList:true,subtree:true});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.addEventListener('load',function(){run();chips();empties();setTimeout(function(){chips();empties();},600);});
})();
