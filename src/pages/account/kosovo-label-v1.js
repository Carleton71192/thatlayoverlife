/* TLL account place labels v1.1 (10 Oct 2026). The map now saves Kosovo, Northern Cyprus and Somaliland as 900, 901 and 902
   (ISO 3166 user-assigned codes; the world map file has no code for them, and older saves used "undefined" for Kosovo).
   The sticker sheet has no name for those keys, so this labels them. It reads and writes no data; tllStates stays map-only. */
(function(){
var L={'undefined':['Kosovo','🇽🇰'],'900':['Kosovo','🇽🇰'],'901':['Northern Cyprus',''],'902':['Somaliland','']};
function fix(){[].forEach.call(document.querySelectorAll('[data-tll-ls=sheet] li'),function(li){var b=li.querySelector('b');if(!b)return;var x=L[b.textContent.trim()];if(!x)return;b.textContent=x[0];var i=li.querySelector('i');if(i&&x[1])i.textContent=x[1];});
[].forEach.call(document.querySelectorAll('[data-tll-wr=stats] dd'),function(dd){if(/\bundefined\b/.test(dd.textContent))dd.textContent=dd.textContent.replace(/\bundefined\b/g,'Kosovo');});}
function start(){fix();var ul=document.querySelector('[data-tll-ls=sheet]');if(ul&&window.MutationObserver)new MutationObserver(fix).observe(ul,{childList:true,subtree:true});}
if(document.readyState!=='loading')start();else document.addEventListener('DOMContentLoaded',start);
})();
