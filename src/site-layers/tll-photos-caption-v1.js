/* tll-photos-caption-v1 (29 Oct 2026). Nancy's own photo caption on /share-photos stopped mid-sentence ("proof that The Ice"):
   the caption input had a 256 character limit and gave no sign of it. The limit is now 1,000 (600 until 29 Oct) with a running "N of 1000" line, so the
   writer sees the room left. Same input, same name; /share-photos only; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/share-photos\/?$/.test(location.pathname))return;
var MAX=1000;
function run(){
  var i=document.querySelector('input[name="caption"],textarea[name="caption"]');if(!i||i.dataset.tllCap)return;
  i.dataset.tllCap='1';i.setAttribute('maxlength',String(MAX));
  var c=document.createElement('span');c.className='tll-cap-count';c.setAttribute('aria-live','polite');
  c.style.cssText='display:block;margin:6px 0 0;font:500 12px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.04em;color:#6B6660;text-align:right';
  function paint(){var n=(i.value||'').length;c.textContent=n+' of '+MAX;c.style.color=n>=MAX?'#C8325B':'#6B6660';}
  i.addEventListener('input',paint);paint();
  i.insertAdjacentElement('afterend',c);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();
