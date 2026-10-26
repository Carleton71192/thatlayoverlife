/* tll-note-typing-v1 (26 Oct 2026): while a form field outside the "Tell the editor" note has focus, html gets
   .tll-typing and the pill steps aside, so it never sits on a field above the phone keyboard. */
(function(){
  if(window.__tllTyping) return; window.__tllTyping=1;
  var H=document.documentElement, F='input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]),textarea,select,[contenteditable="true"]';
  function on(t){ return t&&t.matches&&t.matches(F)&&!(t.closest&&t.closest('#tll-note')); }
  document.addEventListener('focusin',function(e){ if(on(e.target)) H.classList.add('tll-typing'); });
  document.addEventListener('focusout',function(){ setTimeout(function(){ if(!on(document.activeElement)) H.classList.remove('tll-typing'); },0); });
})();
