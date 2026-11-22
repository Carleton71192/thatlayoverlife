/* tll-stories-places-v1 (29 Oct 2026, Nancy on /stories: "Where is Asia and Oceania?"). The place chips stopped at Europe, Africa,
   Americas and Antarctica, while the Stories region field also has Asia, Middle East and Oceania. The missing three are added as copies
   of an existing chip, in alphabetical order. The page's own chip script (TLL Stories chips v1) filters by the card's region text, so the new
   chips work through it; if that script has already wired its chips, the new ones filter the same way on their own. A region with no
   story yet shows the page's own "No stories from ... yet" note. Also: "the next story on the shelf" reads "the next story in the
   library" wherever it appears on /stories (house words). /stories only; nothing removed; no data-ms-* element touched.
   22 Nov 2026 (sweep of 21 Nov, A12): a chosen place chip is kept in the address as ?place= (replaceState, so a reload or a shared
   link keeps it; All places takes it out; ?q= and the rest stay), and on load a ?place= that names a chip presses that chip once the
   page's chip script has wired the grid, through the chip's own click, so the page filters it the usual way.
   22 Nov 2026 (check of the sweep, note 3): while that replay is pending the core layer tll-place-wait-v1 keeps the grid hidden
   (visibility, so no reflow); shown() takes its mark off once the chip is pressed, no chip matches or the replay gives up.
   22 Nov 2026 (sweep of 21 Nov, A16): on a card whose writer name is long, the place wraps to a line of its own and that line began
   with the page's "· " (17 of 57 cards at 390). dots() marks such a place data-tll-own-line (it sits below the name); the core style
   tll-sweep-1121-v1 then drops the dot and keeps the place on its own line. Measured when the page is parsed, when the fonts are in,
   after a chip or search redraw and on resize. */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
var ORDER=['all','Africa','Americas','Antarctica','Asia','Europe','Middle East','Oceania']; /* alphabetical after All places (Nancy, 29 Oct) */
function words(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),t;
  while(t=w.nextNode()){if(t.nodeValue.indexOf('story on the shelf')>-1)t.nodeValue=t.nodeValue.replace('story on the shelf','story in the library');}}
function chips(){
  var row=document.querySelector('[data-tll-chips="place-sort"] .tll-chip-row');if(!row||row.dataset.tllPlaces)return;
  var have={};[].forEach.call(row.querySelectorAll('[data-tll-place]'),function(c){have[c.getAttribute('data-tll-place')]=c;});
  var model=row.querySelector('.tll-shelf-chip[data-tll-place]');if(!model)return;
  row.dataset.tllPlaces='1';
  var grid=document.querySelector('.tll-lib-grid')||document.querySelector('.tll-library-grid');
  var wired=!!(grid&&grid.dataset.tllChips);
  var added=[];
  ORDER.forEach(function(p){if(have[p])return;var c=model.cloneNode(true);c.setAttribute('data-tll-place',p);c.textContent=p;
    c.className='tll-shelf-chip';c.setAttribute('aria-pressed','false');have[p]=c;added.push(c);});
  /* place every chip in alphabetical order, after the label */
  ORDER.forEach(function(p){if(have[p])row.appendChild(have[p]);});
  if(!wired||!grid)return;
  /* fallback when the page script ran first: filter the same way it does */
  added.forEach(function(c){c.addEventListener('click',function(e){e.preventDefault();var v=c.getAttribute('data-tll-place');
    [].forEach.call(row.querySelectorAll('[data-tll-place]'),function(x){var on=x===c;x.classList.toggle('tll-filter-chip-on',on);x.classList.toggle('tll-shelf-chip',!on);x.setAttribute('aria-pressed',on?'true':'false');});
    var n=0;[].forEach.call(grid.children,function(el){var r=el.querySelector('[data-tll-region]');var show=!!r&&r.textContent.trim()===v;el.style.display=show?'':'none';if(show)n++;});
    var note=document.getElementById('tll-chip-note');if(note)note.remove();
    if(!n){note=document.createElement('div');note.id='tll-chip-note';note.setAttribute('role','status');
      note.style.cssText='border:2px dashed #c9b89a;border-radius:10px;padding:28px;margin-bottom:20px;text-align:center;background:#fff;font-size:14px;color:#3a3a3a';
      note.textContent='No stories from '+v+' yet. Be the first.';grid.parentNode.insertBefore(note,grid);}
  });});
}
function url(e){var c=e.target&&e.target.closest&&e.target.closest('[data-tll-chips="place-sort"] [data-tll-place]');if(!c||!history.replaceState)return;
  var v=c.getAttribute('data-tll-place')||'',q=new URLSearchParams(location.search);if(!v||v==='all')q.delete('place');else q.set('place',v);
  var s=q.toString();history.replaceState(history.state,'',location.pathname+(s?'?'+s:'')+location.hash);}
document.addEventListener('click',url);
function shown(){document.documentElement.removeAttribute('data-tll-place-wait');}
function replay(){var want=(new URLSearchParams(location.search).get('place')||'').trim().toLowerCase();if(!want||want==='all'){shown();return;}var n=0;
  (function go(){var grid=document.querySelector('.tll-lib-grid')||document.querySelector('.tll-library-grid');
    if(!grid||!grid.dataset.tllChips){if(++n<30)setTimeout(go,100);else shown();return;}
    var hit=null;[].forEach.call(document.querySelectorAll('[data-tll-chips="place-sort"] [data-tll-place]'),function(c){if((c.getAttribute('data-tll-place')||'').toLowerCase()===want)hit=c;});
    if(hit&&hit.getAttribute('aria-pressed')!=='true')hit.click();shown();})();}
function dots(){[].forEach.call(document.querySelectorAll('.tll-lib-card [data-s3-place]'),function(p){var n=p.parentNode&&p.parentNode.querySelector('.tll-lib-byline-name');if(!n)return;
  p.removeAttribute('data-tll-own-line');var a=n.getBoundingClientRect(),b=p.getBoundingClientRect();if(b.height>0&&a.height>0&&b.top>=a.bottom-2)p.setAttribute('data-tll-own-line','');});}
var dt;function later(){clearTimeout(dt);dt=setTimeout(dots,120);}
window.addEventListener('resize',later);document.addEventListener('tll:lib-filtered',later);document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('[data-tll-place],[data-tll-sort]'))later();});
try{document.fonts&&document.fonts.ready&&document.fonts.ready.then(later);}catch(e){}
function run(){chips();words();replay();dots();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(words,1500);
})();
