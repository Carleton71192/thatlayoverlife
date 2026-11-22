/* tll-place-wait-v1 (22 Nov 2026, check of the sweep of 21 Nov, note 3; reports/evidence/sweep-2026-11-21/fix.md, Nov 22 follow-up).
   A12 presses the place chip a shared /stories?place= link names, but only once the stories chunk has come and the page's chip script
   has wired the grid. When the scripts came 3 s late the grid first painted all 57 cards and then dropped to the 11 of that place
   (CLS 0.26 live, 0.52 with A12). Core, /stories only: it runs in the head after the other core layers, in the same synchronous core
   script as the chunk loader, so the stories chunk's script tag is already there when it looks. When ?place= names one of the place
   chips and the loader has asked for the stories chunk, html gets data-tll-place-wait and the core style tll-sweep-1121-v1 keeps the
   card grid visibility:hidden (it keeps its room, so nothing reflows) while that chunk is on its way. tll-stories-places-v1 takes the
   mark off right after its replay has pressed the chip, found none to press, or given up after the 3 s it waits for the grid.
   Here the mark also goes at once if the chunk fails, and in any case after 10 s. Otherwise it goes 3.5 s after the later of the
   chunk's load and DOMContentLoaded: the replay starts at DOMContentLoaded (the page's chip script waits for it too, and on /stories
   the page's footer scripts can hold it seconds after the chunk has run), and gives up after 29 polls of 100 ms, so the extra 0.5 s
   keeps the core from letting go before the replay does on a busy main thread (review 2, finding 3.1). A fixed wait from the core
   would race a chunk that comes late, so the wait counts from the chunk. Without a valid ?place= nothing happens. The list is the
   place chips of tll-stories-places-v1 (ORDER there, without All places). No data-ms-* element is touched. */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
var PLACES=['africa','americas','antarctica','asia','europe','middle east','oceania'],want='';
try{want=(new URLSearchParams(location.search).get('place')||'').trim().toLowerCase();}catch(e){}
if(PLACES.indexOf(want)<0)return;
var c=document.querySelector('script[src*="/chunks/stories.js"],script[src*="/chunks/stories-preview.js"]');if(!c)return;
var h=document.documentElement;function show(){h.removeAttribute('data-tll-place-wait');}
h.setAttribute('data-tll-place-wait','');
function late(){setTimeout(show,3500);}
c.addEventListener('load',function(){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',late);else late();});
c.addEventListener('error',show);
setTimeout(show,10000);
})();
