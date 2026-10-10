/* TLL account Kosovo label v1 (10 Oct 2026). The world map file has no numeric code for Kosovo, so the map saves Kosovo under
   the key "undefined" and the sticker sheet showed an "undefined" stamp (seen on Magnus's pet stamps). This relabels that one
   sticker as Kosovo with its flag. It reads and writes no data; tllStates stays map-only. */
(function(){
function fix(root){[].forEach.call((root||document).querySelectorAll('[data-tll-ls=sheet] li'),function(li){var b=li.querySelector('b');if(!b||b.textContent.trim()!=='undefined')return;b.textContent='Kosovo';var i=li.querySelector('i');if(i)i.textContent='🇽🇰';});
[].forEach.call(document.querySelectorAll('[data-tll-wr=stats] dd'),function(dd){if(/\bundefined\b/.test(dd.textContent))dd.textContent=dd.textContent.replace(/\bundefined\b/g,'Kosovo');});}
function start(){fix();var ul=document.querySelector('[data-tll-ls=sheet]');if(ul&&window.MutationObserver)new MutationObserver(function(){fix();}).observe(ul,{childList:true,subtree:true});}
if(document.readyState!=='loading')start();else document.addEventListener('DOMContentLoaded',start);
})();
