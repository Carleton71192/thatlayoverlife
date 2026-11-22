/* tll-place-wait-v1 (22 Nov 2026, check of the sweep of 21 Nov, note 3; reports/evidence/sweep-2026-11-21/fix.md, Nov 22 follow-up).
   A12 presses the place chip a shared /stories?place= link names, but only once the stories chunk has come and the page's chip script
   has wired the grid. When the scripts came 3 s late the grid first painted all 57 cards and then dropped to the 11 of that place
   (CLS 0.26 live, 0.52 with A12). Core, runs in the head right after the chunk loader, /stories only: when ?place= names one of the
   place chips and the loader has asked for the stories chunk, html gets data-tll-place-wait and the core style tll-sweep-1121-v1 keeps
   the card grid visibility:hidden (it keeps its room, so nothing reflows) while that chunk is on its way. tll-stories-places-v1 takes
   the mark off right after its replay has pressed the chip, found none to press, or given up after the 3 s it waits for the grid.
   Here the mark also goes if the chunk fails, 3 s after the chunk has run (the replay's own wait), and in any case after 10 s.
   A fixed 3 s from the core would race a chunk that comes 3 s after it, so the wait counts from the chunk. Without a valid ?place=
   nothing happens. The list is the place chips of tll-stories-places-v1 (ORDER there, without All places). No data-ms-* element is
   touched. */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
var PLACES=['africa','americas','antarctica','asia','europe','middle east','oceania'],want='';
try{want=(new URLSearchParams(location.search).get('place')||'').trim().toLowerCase();}catch(e){}
if(PLACES.indexOf(want)<0)return;
var c=document.querySelector('script[src*="/chunks/stories.js"],script[src*="/chunks/stories-preview.js"]');if(!c)return;
var h=document.documentElement;function show(){h.removeAttribute('data-tll-place-wait');}
h.setAttribute('data-tll-place-wait','');
c.addEventListener('load',function(){setTimeout(show,3000);});c.addEventListener('error',show);
setTimeout(show,10000);
})();
