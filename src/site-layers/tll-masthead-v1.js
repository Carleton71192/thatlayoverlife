/* tll-masthead-v1 (26 Oct 2026, the magazine direction, Nancy: "I like written by the people who went"): the site footer's
   tagline under the wordmark reads the masthead line. Text only; the element, its place and its styles stay. The site never
   claims that no story was written by AI. Styles: tll-masthead-v1.html. */
(function(){
  var LINE='Written by the people who went. Travel stories from members around the world, edited in Copenhagen.';
  function run(){
    [].forEach.call(document.querySelectorAll('footer a[href="/"] + p'),function(p){
      if(p.dataset.tllMasthead)return;p.dataset.tllMasthead='1';p.textContent=LINE;p.classList.add('tll-masthead');});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
