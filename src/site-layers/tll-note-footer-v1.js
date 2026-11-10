/* tll-note-footer-v1 (10 Nov 2026, week-one hygiene, item 9: "Hide the Tell the editor pill when the footer is in view"). The pill
   (#tll-note, from the site footer code) is fixed bottom left and sat on top of the footer columns at the end of every page. An
   IntersectionObserver on the canonical footer (footer[data-tll-canonical-footer], else the last footer on the page) puts
   html.tll-note-footer on while any part of the footer is on screen; the style here fades the pill out and takes it out of the tab
   order and the accessibility tree (visibility:hidden) for that time. An open note card, or a pill that has keyboard focus, stays.
   The home-hero rule in tll-ux-1028-v1 (.tll-note-out) is untouched; both can apply at once. Every page; nothing removed; the footer
   component is untouched; no data-ms-* element touched. */
(function(){
var CSS='html.tll-note-footer #tll-note:not([data-open="true"]):not(:focus-within){opacity:0;visibility:hidden;pointer-events:none;transition:opacity 200ms ease,visibility 0s linear 200ms}'+
'@media (prefers-reduced-motion:reduce){html.tll-note-footer #tll-note:not([data-open="true"]):not(:focus-within){transition:none}}';
function style(){if(document.getElementById('tll-note-footer-v1'))return;var s=document.createElement('style');s.id='tll-note-footer-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
style();
function run(){
  if(!window.IntersectionObserver||!document.getElementById('tll-note'))return;
  var f=document.querySelector('footer[data-tll-canonical-footer]');
  if(!f){var all=document.querySelectorAll('footer');f=all.length?all[all.length-1]:null;}
  if(!f)return;
  new IntersectionObserver(function(es){for(var i=0;i<es.length;i++)document.documentElement.classList.toggle('tll-note-footer',es[i].isIntersecting);},{threshold:0}).observe(f);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
