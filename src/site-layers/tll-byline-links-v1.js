/* tll-byline-links-v1 (29 Oct 2026, Nancy on /stories: "When I click the user names here it does not take me to their profile").
   Each story card is one link to the story, so the writer's name and photo inside it went to the story too (a link cannot sit
   inside a link). The name and the small photo in a card byline (.tll-lib-byline-name, .tll-lib-byline-img) now open the writer's
   page, /contributors/{slug}, where the slug is the writer's name the way Webflow makes slugs (Nancy Carleton -> nancy-carleton).
   They act as links for mouse, touch and keyboard (role=link, Enter). Every other part of the card still opens the story.
   Nothing removed; no data-ms-* element touched. */
(function(){
function slug(name){return String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
var CSS=".tll-lib-byline-name[data-tll-bl]{cursor:pointer;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}"+
".tll-lib-byline-name[data-tll-bl]:hover{color:#C8325B!important}"+
".tll-lib-byline-name[data-tll-bl]:focus-visible,.tll-lib-byline-img[data-tll-bl]:focus-visible{outline:3px solid #C8325B;outline-offset:2px;border-radius:2px}"+
".tll-lib-byline-img[data-tll-bl]{cursor:pointer}";
function hrefFor(card){var n=card.querySelector('.tll-lib-byline-name');var s=slug(n&&n.textContent.trim());return s?'/contributors/'+s:'';}
function wire(){
  var names=document.querySelectorAll('.tll-lib-byline-name:not([data-tll-bl])');if(!names.length)return;
  if(!document.getElementById('tll-byline-links-v1')){var st=document.createElement('style');st.id='tll-byline-links-v1';st.textContent=CSS;(document.body||document.head).appendChild(st);}
  [].forEach.call(names,function(n){
    var card=n.closest('.tll-lib-byline')||n.parentElement;var href=hrefFor(card);if(!href)return;
    [n,card.querySelector('.tll-lib-byline-img')].forEach(function(el){if(!el||el.getAttribute('data-tll-bl'))return;
      el.setAttribute('data-tll-bl',href);el.setAttribute('role','link');el.setAttribute('tabindex','0');
      if(el===n)el.setAttribute('aria-label',n.textContent.trim()+', writer page');else el.setAttribute('aria-hidden','true');});
  });
}
function go(e){var t=e.target.closest&&e.target.closest('[data-tll-bl]');if(!t)return;
  if(e.type==='keydown'&&e.key!=='Enter')return;
  e.preventDefault();e.stopPropagation();
  var href=t.getAttribute('data-tll-bl');if(e.metaKey||e.ctrlKey)window.open(href,'_blank','noopener');else location.href=href;}
document.addEventListener('click',go,true);document.addEventListener('keydown',go,true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
setTimeout(wire,800);setTimeout(wire,2000);
})();
