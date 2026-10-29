/* tll-stories-noimg-v1 (29 Oct 2026, Nancy on /stories: "The photo is not coming through"). A story with no hero photo (Zain's
   link-out has none yet) showed a broken image with its alt text, and as the newest story it took the big lead slot. Now:
   1. A card without a photo shows a plain ink panel with the story's country in place of the broken image.
   2. The lead slot goes to the newest story that has a photo; the photo-less one stays in the grid, next in line.
   The page's own scripts keep sorting and filtering; this only steps in when the first visible card has no photo.
   /stories only; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
var CSS=".tll-noimg{display:flex!important;align-items:flex-end;justify-content:flex-start;box-sizing:border-box;padding:18px 20px;background:#0A0B14!important;color:#F7F1E8;"+
"font:italic 800 clamp(22px,2.4vw,34px)/1.05 'Playfair Display',Georgia,serif;width:100%;aspect-ratio:4/3;overflow:hidden}"+
".tll-noimg span{display:block;max-width:100%;overflow-wrap:anywhere}"+
"[data-tll-lead] .tll-noimg{aspect-ratio:3/2;font-size:clamp(34px,4vw,60px)}";
function noPhoto(img){if(!img)return true;var s=img.getAttribute('src')||'';
  return !s||/placeholder/i.test(s)||img.classList.contains('w-dyn-bind-empty')||(img.complete&&img.naturalWidth===0);}
function cardImg(k){return k.querySelector('.tll-lib-card > img.tll-lib-img, .tll-lib-card img.tll-lib-img:not(.tll-lib-byline-img)');}
function panel(k){
  var img=cardImg(k);if(!img||!noPhoto(img)||k.querySelector('.tll-noimg'))return;
  var c=k.querySelector('[data-tll-country]');var place=(c&&c.textContent.trim())||'';
  var p=document.createElement('div');p.className='tll-noimg';p.setAttribute('aria-hidden','true');
  var t=document.createElement('span');t.textContent=place;p.appendChild(t);
  img.style.display='none';img.insertAdjacentElement('afterend',p);k.setAttribute('data-tll-noimg','1');}
function visible(k){return k.offsetParent!==null&&getComputedStyle(k).display!=='none'&&!k.hasAttribute('data-tll-q-miss');}
var busy=false;
function lead(){
  var g=document.querySelector('.tll-lib-grid');if(!g||busy)return;
  var kids=[].slice.call(g.children).filter(visible);if(kids.length<2)return;
  kids.forEach(panel);
  if(!kids[0].hasAttribute('data-tll-noimg'))return;
  var first=null;for(var i=1;i<kids.length;i++){if(!kids[i].hasAttribute('data-tll-noimg')){first=kids[i];break;}}
  if(!first)return;
  busy=true;g.insertBefore(first,kids[0]);busy=false;
  document.dispatchEvent(new Event('tll:lib-filtered'));}
function run(){
  if(!document.getElementById('tll-stories-noimg-v1')){var s=document.createElement('style');s.id='tll-stories-noimg-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  var g=document.querySelector('.tll-lib-grid');if(!g)return;
  [].forEach.call(g.querySelectorAll('img.tll-lib-img'),function(i){i.addEventListener('error',function(){setTimeout(lead,0);});});
  var t;new MutationObserver(function(){if(busy)return;clearTimeout(t);t=setTimeout(lead,60);}).observe(g,{childList:true,attributes:true,attributeFilter:['style','data-tll-q-miss']});
  setTimeout(lead,0);setTimeout(lead,700);setTimeout(lead,1600);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
