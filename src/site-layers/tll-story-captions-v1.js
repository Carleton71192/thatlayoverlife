/* tll-story-captions-v1 (31 Oct 2026, Roberta: captions and choosing where each photo sits). Story pages only. Reads caption
   lines from the story's Photo placements text, the same text the inline-photo script (tllinlinephotosv2b) reads:
     Caption: photo-filename-slug | The writer's caption
   (that script skips these lines, so nothing else changes). Each captioned photo shows its caption under it: a figcaption
   when it sits inline in the story, a small line under the thumbnail in the gallery, and the lightbox caption when opened.
   Captions are the writer's own words, never written by AI. Nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/stories\/[^/]+\/?$/.test(location.pathname))return;
var CSS='.tll-ph-cap{display:block;margin:8px 0 0;font:400 14px/1.45 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54;text-align:left}'+
'.tll-inline-photo .tll-ph-cap{padding:0 4vw}@media(max-width:767px){.tll-inline-photo .tll-ph-cap{padding:0 16px}}'+
'.tll-story-gallery .tll-ph-cap{font-size:13px;margin:6px 0 0}';
function go(){
  var X=window.tllPh,sec=document.querySelector('.tll-story-gallery');if(!X||!X.P||!sec||sec.getAttribute('data-tll-gallery-built')!=='1')return false;
  var caps={};X.P().split(/\r?\n/).forEach(function(l){var m=/^\s*caption\s*:\s*([^|]+)\|(.+)$/i.exec(l);if(m)caps[m[1].trim().toLowerCase()]=m[2].trim().slice(0,300);});
  if(!Object.keys(caps).length)return true;
  if(!document.getElementById('tll-story-captions-v1')){var st=document.createElement('style');st.id='tll-story-captions-v1';st.textContent=CSS;document.head.appendChild(st);}
  [].forEach.call(document.querySelectorAll('a.tll-gallery-link'),function(a){
    var img=a.querySelector('img');if(!img||a.__tllCap)return;var c=caps[X.S(img.getAttribute('src'))];if(!c)return;a.__tllCap=1;
    var fig=a.closest('figure.tll-inline-photo');var cap=document.createElement(fig?'figcaption':'span');cap.className='tll-ph-cap';cap.textContent=c;
    if(fig)fig.appendChild(cap);else a.parentNode.insertBefore(cap,a.nextSibling);
    var js=a.querySelector('script.w-json');if(js){try{var d=JSON.parse(js.textContent);(d.items||[]).forEach(function(it){it.caption=c;});js.textContent=JSON.stringify(d);}catch(e){}}
  });
  return true;
}
var n=0;(function t(){if(go())return;if(++n>60)return;setTimeout(t,200);})();
})();
