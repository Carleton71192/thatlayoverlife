/* tll-p0-closeout-v1 (11 Nov 2026, launch blockers close-out; Nancy: "Approve P1 to P5" on handoff/CHANGE-LOG-P0-CLOSEOUT-2026-11-11.md).
   P4: Webflow puts "Example Text" in the placeholder of every form input and its tools cannot change it. On /submit and
       /share-photos the hint is cleared wherever it still reads "Example Text" (any case). No field is renamed, no value is touched.
   P5: "Cookie settings" in the footer reopens Google's consent message (the site head script). Outside the EEA, the UK and
       Switzerland Google has no message, so the click did nothing. Once the consent tool has answered that the rules do not apply
       (gdprApplies false), the click opens /cookies instead. In Europe, and until the answer arrives, this listener stands aside and
       the head script runs as before. Every page; the footer component and the consent script are untouched; no data-ms-* element touched. */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
if(P==='/submit'||P==='/share-photos'){
  var clear=function(){[].forEach.call(document.querySelectorAll('input[placeholder],textarea[placeholder]'),function(i){
    if(/^\s*example text\s*$/i.test(i.getAttribute('placeholder')||''))i.setAttribute('placeholder','');});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clear);else clear();
  window.addEventListener('load',clear);setTimeout(clear,1500);
}
var outside=false,n=0;
(function ask(){
  if(typeof window.__tcfapi==='function'){try{window.__tcfapi('addEventListener',2,function(tc,ok){if(!ok||!tc)return;
    if(tc.gdprApplies===false)outside=true;else if(tc.gdprApplies===true)outside=false;});}catch(e){}}
  else if(++n<150)setTimeout(ask,100);
})();
/* window, capture: runs before the head script's document listener, and only steps in when outside is true. */
window.addEventListener('click',function(e){
  if(!outside||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target&&e.target.closest&&e.target.closest('a[data-tll-cookie-prefs]');if(!a)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(P!=='/cookies')location.assign('/cookies');else window.scrollTo(0,0);
},true);
})();
