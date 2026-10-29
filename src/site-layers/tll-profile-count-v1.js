/* tll-profile-count-v1 (29 Oct 2026, Nancy's profile read "52 STORIES"). The site head script tll-live-stories-v1 rewrites any number
   that sits next to the word "stories" with the site-wide story total from the sitemap; on /contributors/{slug} that overwrote the
   writer's own count in the stat strip. Here the strip's STORIES number is set back to the writer's own count (the profile's
   "N STORIES · NEWEST FIRST" line, which that script does not touch) whenever it changes. Nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/contributors\/[^/]+\/?$/.test(location.pathname))return;
function own(){var m=document.querySelector('[data-pf5="stories-meta"]');var n=m&&parseInt(m.textContent,10);return n>0?n:0;}
function fix(){var n=own();if(!n)return;[].forEach.call(document.querySelectorAll('.pf5-stat-k'),function(k){if(!/^stor(y|ies)$/i.test((k.textContent||'').trim()))return;
  var v=k.previousElementSibling;if(!v)return;var t=v.firstChild&&v.firstChild.nodeType===3?v.firstChild:null,want=String(n);
  if(t){if(t.nodeValue.trim()!==want)t.nodeValue=want;}else if((v.textContent||'').trim()!==want)v.textContent=want;
  var lab=n===1?'STORY':'STORIES';if((k.textContent||'').trim()!==lab)k.textContent=lab;});}
function run(){fix();var S=document.querySelector('.pf5-stat-k');var box=S&&S.parentNode&&S.parentNode.parentNode;
  if(box)new MutationObserver(function(){fix();}).observe(box,{subtree:true,childList:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
addEventListener('load',function(){fix();setTimeout(fix,1500);});
})();
