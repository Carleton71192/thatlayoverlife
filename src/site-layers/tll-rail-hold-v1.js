/* tll-rail-hold-v1 (13 Nov 2026, bandwidth fix 3, reports/bandwidth-2026-11-13.md). Home page, phones and small tablets only (under
   900px, where the story rail is a swipe row, not pinned).
   Why: the rail script in the page (h3-shelf-js) draws six cards from the CMS snapshot as it is parsed, then, once the newer stories
   from /stories are in (about a second later), draws a new six and hides the rest. The browser has already fetched the photos of the
   first six by then (they sit inside its lazy loading margin), so on phones several of them are downloaded for cards that are hidden
   before anyone could see them (measured 13 Nov from cached files, one seeded run: five photos, about 400 KB at 2x and 700 KB at 3x,
   0 x 0 on the page at the end and never on screen, checked every 50 ms through a full scroll and a full swipe of the row).
   What: from the head, the rail card photos (.h3-card-ph img) are display:none until the first of
     - the second draw of the rail (the newer stories are in, or a pillar chip was tapped), or
     - the rail coming within 1250px of the screen (the browser's own lazy margin on 4G), so a reader who scrolls there early
       still gets photos in time.
   Then the hold style is removed and the shown cards load as before; hidden cards stay display:none and are never fetched.
   The photo box keeps its size (aspect-ratio 4/5 on .h3-card-ph, ink background), so nothing moves. src, srcset and alt are not
   touched (the rail script reads src to order the cards). Without JavaScript nothing here runs. No data-ms-* element is touched. */
(function(){
if(!/^\/(index\.html)?$/.test(location.pathname))return;
if(!window.matchMedia||!window.matchMedia('(max-width:899px)').matches)return;
if(document.getElementById('tll-rail-hold-v1'))return;
var st=document.createElement('style');st.id='tll-rail-hold-v1';
st.textContent='[data-h3-shelf] [data-h3-track] .h3-card-ph img{display:none!important}';
(document.head||document.documentElement).appendChild(st);
var draws=0,io=null,done=false;
function go(){if(done)return;done=true;if(st.parentNode)st.parentNode.removeChild(st);if(io){io.disconnect();io=null;}document.removeEventListener('h3:stories',drawn);}
function drawn(){if(++draws>=2)go();}
document.addEventListener('h3:stories',drawn);
function watch(){if(done)return;var s=document.querySelector('[data-h3-shelf]');
  if(!s||!window.IntersectionObserver){go();return;}
  io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++)if(es[i].isIntersecting){go();return;}},{rootMargin:'1250px 0px 1250px 0px'});
  io.observe(s);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();
