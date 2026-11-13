/* tll-library-hold-v1 (13 Nov 2026, the home library jump that blocks Nancy's choice 9). Home only, in the core (it must see the library's
   first draw, which happens while the page is parsed, before the first paint).
   What moved: on phones the library is a swipe row and its height is the tallest of the six cards on show. The cards first come from the
   ten stories written into the page; about 1 to 2.6 s later the story feed (/stories) arrives, the library draws again from every published
   story ("10 published" becomes the full count) and usually shows six other cards. Their tallest card was about 46 px shorter, so the row
   shrank and everything under it (the value section once N9 is on, the Layover guides band, the photo interlude) moved up while a reader
   who had reloaded halfway down the page was looking at it.
   The hold: every card on the swipe row is at least as tall as the tallest card the library holds (shown or not), measured from copies
   of the cards, so which six are on show no longer changes the row's height. A card's minutes line already sits at its foot (visual audit,
   12 Nov), so a shorter title gets a little more room above that line, as it does today whenever a long title is on show. The hold never
   shrinks while the page is open (a chip, the feed or the web fonts can only add to it) and is kept for this tab at this window width
   (sessionStorage), so a reload or a Back starts from the final height before the first paint and the feed has nothing left to change.
   Only the swipe row (phones, tablets, reduced motion); the pinned desktop rail is sized by its own script and is left alone. The same
   style also keeps room for the two-line heading of the Layover guides band on phones up to 365px wide (see the rule below). The copies
   are measured off screen with their photos' addresses removed first, so measuring never downloads a photo. No card, chip, link or count
   is changed; no nav, footer, form or data-ms-* element is touched. */
(function(){
if(!/^\/(index\.html)?$/.test(location.pathname))return;
if(window.__tllLibHold)return;window.__tllLibHold=1;
var KEY='tll-lib-hold-v1',hold=0,W=window.innerWidth;
/* The second rule is the Layover guides band right under the library (13 Nov, same measurements): its heading "The hours between flights."
   (Playfair Display 800, 28px on phones) is 323.4px wide set in Playfair and 313.7px in the fallback face, so on a phone 354 to 363px wide
   (360 is the common one) it took one line until the web font arrived and then two, and the band grew 29px under a reader restored to the
   photo interlude below it. Up to 365px wide the heading keeps room for its two lines from the first paint; wider phones fit it on one
   line in either face and are left as they are. */
var CSS='.h3-shelf:not(.is-pinned) [data-h3-track]>.h3-card:not([hidden]):not([aria-hidden="true"]){min-height:var(--tll-lib-hold,0px)}'+
'@media (max-width:365px){[data-h3-guides] .h3g-title{min-height:calc(2 * 1.04em)}}';
var st=document.createElement('style');st.id='tll-library-hold-v1';st.textContent=CSS;(document.head||document.documentElement).appendChild(st);
function set(h){if(!(h>hold))return;hold=Math.ceil(h);document.documentElement.style.setProperty('--tll-lib-hold',hold+'px');
  try{sessionStorage.setItem(KEY,JSON.stringify({w:W,h:hold}));}catch(e){}}
try{var s=JSON.parse(sessionStorage.getItem(KEY)||'null');if(s&&s.w===W&&s.h>0&&s.h<2000)set(s.h);}catch(e){}
/* The tallest card, from copies: each card is copied through an inert template, its images lose src and srcset (the boxes keep their size
   from the CSS: the 40px avatar, the 4:5 photo), stamps and ids are dropped, and the copies are laid out at the real card width in a hidden
   box inside the library row, then removed in the same task, so nothing is painted. Cards taken out of the rail by a script (inline
   display:none or aria-hidden) are left out, as they never show. */
function measure(){
  var sec=document.querySelector('[data-h3-shelf]'),track=sec&&sec.querySelector('[data-h3-track]');if(!track||sec.classList.contains('is-pinned'))return;
  var cards=[].filter.call(track.querySelectorAll('.h3-card'),function(c){return c.getAttribute('aria-hidden')!=='true'&&c.style.display!=='none';});
  var ref=null;for(var i=0;i<cards.length;i++){if(!cards[i].hidden&&cards[i].offsetWidth>0){ref=cards[i];break;}}if(!ref)return;
  var w=ref.getBoundingClientRect().width,t=document.createElement('template');
  t.innerHTML=cards.map(function(c){return c.outerHTML;}).join('');
  [].forEach.call(t.content.querySelectorAll('img,source'),function(m){m.removeAttribute('src');m.removeAttribute('srcset');m.removeAttribute('data-tll-v');});
  [].forEach.call(t.content.querySelectorAll('.tll-mg-card-stamp,svg'),function(m){m.parentNode&&m.parentNode.removeChild(m);});
  [].forEach.call(t.content.querySelectorAll('[id]'),function(m){m.removeAttribute('id');});
  var box=document.createElement('div');box.className='h3-track';box.setAttribute('aria-hidden','true');
  box.style.cssText='position:absolute;left:0;top:0;width:'+w+'px;height:0;margin:0;padding:0;overflow:hidden;visibility:hidden;display:block;pointer-events:none;contain:layout style';
  box.appendChild(document.importNode(t.content,true));
  [].forEach.call(box.children,function(k){k.hidden=false;k.style.cssText='display:flex;flex-direction:column;width:'+w+'px;min-height:0;margin:0;flex:none';});
  track.parentNode.appendChild(box);
  var m=0;[].forEach.call(box.children,function(k){var h=k.getBoundingClientRect().height;if(h>m)m=h;});
  box.parentNode.removeChild(box);set(m);
}
function safe(){try{measure();}catch(e){}}
/* When: each library draw announces itself with h3:stories, synchronously at the end of the draw, so the hold is in place in the same task
   as the draw (the first one runs while the page is parsed, before the first paint; the feed's one runs before its frame is painted).
   Also when the web fonts have arrived, when the page is parsed and loaded, and after a change of window width (the hold starts over there). */
document.addEventListener('h3:stories',safe);
document.addEventListener('DOMContentLoaded',safe);window.addEventListener('load',safe);
try{document.fonts&&document.fonts.addEventListener&&document.fonts.addEventListener('loadingdone',safe);}catch(e){}
var rz=0;window.addEventListener('resize',function(){if(window.innerWidth===W)return;clearTimeout(rz);rz=setTimeout(function(){W=window.innerWidth;hold=0;
  document.documentElement.style.removeProperty('--tll-lib-hold');safe();},200);});
if(document.readyState!=='loading')safe();
})();
