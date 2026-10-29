/* tll-ep-marks-v1 (29 Oct 2026, tester Mariam's screenshot of /edit-profile). When the account save works but the public page update
   does not (the bar reads "Saved to your account. Your public page did not update yet: ..."), the page still marked each field
   "Not saved. Try again" in error red, which says the writing was lost. It was not. Those field marks now read "Saved to your
   account. Page update pending" in plain ink with the same retry on tap; a real failure (nothing saved) keeps the red "Not saved".
   /edit-profile only; same elements; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/edit-profile\/?$/.test(location.pathname))return;
var CSS="html body .ep-saved.ep-saved--pending{color:#5F5A54!important;border-color:#E0DACE!important;background:transparent!important;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}";
function accountOk(){var s=document.querySelector('[data-ep-status]');return !!s&&/saved to your account/i.test(s.textContent||'');}
function fix(){if(!accountOk())return;[].forEach.call(document.querySelectorAll('.ep-saved--fail:not(.ep-saved--pending)'),function(m){m.classList.add('ep-saved--pending');m.textContent='Saved to your account. Page update pending';});}
function run(){
  if(!document.getElementById('tll-ep-marks-v1')){var s=document.createElement('style');s.id='tll-ep-marks-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
  var t=0;new MutationObserver(function(){clearTimeout(t);t=setTimeout(fix,30);}).observe(document.body,{childList:true,subtree:true,characterData:true});fix();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
