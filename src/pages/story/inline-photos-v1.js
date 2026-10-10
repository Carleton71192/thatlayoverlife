/* TLL story inline photos v1 (10 Oct 2026, Nancy: photos through the scroll). Once the gallery script has built its tiles,
   move them into the story body, one after every fourth paragraph, as wide figures that still open the lightbox.
   Photos that do not fit stay in the gallery; the gallery hides when it is empty. No-JS readers keep the gallery. */
(function(){
var css='.tll-inline-photo{margin:2.2em -4vw;padding:0}.tll-inline-photo a{display:block}.tll-inline-photo img{display:block;width:100%;height:auto;max-height:78vh;object-fit:cover;border-radius:0}@media(max-width:767px){.tll-inline-photo{margin:1.8em -16px}}';
function go(){var sec=document.querySelector('.tll-story-gallery');if(!sec||sec.getAttribute('data-tll-gallery-built')!=='1')return false;
var links=[].slice.call(sec.querySelectorAll('a.tll-gallery-link'));if(!links.length)return true;
var bodies=[].slice.call(document.querySelectorAll('.tll-body')).filter(function(b){return b.id!=='tll-quick-answers';});
var body=bodies.sort(function(a,b){return b.querySelectorAll(':scope > p').length-a.querySelectorAll(':scope > p').length;})[0];if(!body)return true;
var ps=[].slice.call(body.querySelectorAll(':scope > p')).filter(function(p){return p.textContent.trim().length>40;});
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
for(var i=3,k=0;i<ps.length-1&&k<links.length;i+=4,k++){var f=document.createElement('figure');f.className='tll-inline-photo';f.appendChild(links[k]);ps[i].parentNode.insertBefore(f,ps[i].nextSibling);}
if(!sec.querySelector('a.tll-gallery-link'))sec.style.display='none';
try{var lb=window.Webflow&&window.Webflow.require&&window.Webflow.require('lightbox');if(lb&&lb.ready)lb.ready();}catch(e){}
return true;}
var n=0;(function tick(){if(go()||++n>40)return;setTimeout(tick,150);})();
})();
