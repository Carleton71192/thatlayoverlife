/* tll-byline-links-v1 (29 Oct 2026, Nancy on /stories: "When I click the user names here it does not take me to their profile").
   Each story card is one link to the story, so the writer's name and photo inside it went to the story too (a link cannot sit
   inside a link). The name and the small photo in a card byline (.tll-lib-byline-name, .tll-lib-byline-img) now open the writer's
   page, /contributors/{slug}, where the slug is the writer's name the way Webflow makes slugs (Nancy Carleton -> nancy-carleton).
   They act as links for mouse, touch and keyboard (role=link, Enter). Every other part of the card still opens the story.
   Nothing removed; no data-ms-* element touched.
   22 Nov 2026 (sweep of 21 Nov, A11): the site script tllauthorlinkv1 also makes the byline row (div.tll-lib-byline) a role=link with
   tabindex 0 and an aria-label, inside the card link, so every card was three Tab stops (card, byline row, name). Once the name in a
   row is our keyboard link, strip() takes role, tabindex and aria-label off the row (the row's own click still works for mouse and
   touch), at each wire pass and whenever that script sets them again (its second pass runs at 1.5 s). Each card is two stops. */
(function(){
function slug(name){return String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
var CSS=".tll-lib-byline-name[data-tll-bl]{cursor:pointer;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}"+
".tll-lib-byline-name[data-tll-bl]:hover{color:#C8325B!important}"+
".tll-lib-byline-name[data-tll-bl]:focus-visible,.tll-lib-byline-img[data-tll-bl]:focus-visible{outline:3px solid #C8325B;outline-offset:2px;border-radius:2px}"+
".tll-lib-byline-img[data-tll-bl]{cursor:pointer}";
/* The name element can also hold the place line (data-s3-place, "Sao Paulo, Brazil"), so read only its own text. */
function nameOf(n){if(!n)return '';var own='';[].forEach.call(n.childNodes,function(c){if(c.nodeType===3)own+=c.nodeValue;});own=own.trim();
  if(own)return own;var c=n.cloneNode(true);[].forEach.call(c.querySelectorAll('[data-s3-place],[data-tll-place]'),function(x){x.remove();});
  var first=c.firstElementChild;return (first?first.textContent:c.textContent).trim();}
function hrefFor(card){var s=slug(nameOf(card.querySelector('.tll-lib-byline-name')));return s?'/contributors/'+s:'';}
function wire(){
  var names=document.querySelectorAll('.tll-lib-byline-name:not([data-tll-bl])');if(!names.length)return;
  if(!document.getElementById('tll-byline-links-v1')){var st=document.createElement('style');st.id='tll-byline-links-v1';st.textContent=CSS;(document.body||document.head).appendChild(st);}
  [].forEach.call(names,function(n){
    var card=n.closest('.tll-lib-byline')||n.parentElement;var href=hrefFor(card);if(!href)return;
    [n,card.querySelector('.tll-lib-byline-img')].forEach(function(el){if(!el||el.getAttribute('data-tll-bl'))return;
      el.setAttribute('data-tll-bl',href);
      /* 7 Nov 2026 (baseline audit, axe aria-hidden-focus on 57 cards): only the name is a keyboard link; the photo stays clickable
         for mouse and touch but is not focusable, since it is hidden from screen readers and the name already carries the link. */
      if(el===n){el.setAttribute('role','link');el.setAttribute('tabindex','0');el.setAttribute('aria-label',nameOf(n)+', writer page');}
      else el.setAttribute('aria-hidden','true');});
  });
}
function strip(){[].forEach.call(document.querySelectorAll('.tll-lib-byline[role],.tll-lib-byline[tabindex]'),function(b){
  if(!b.querySelector('[data-tll-bl][role="link"]'))return;b.removeAttribute('role');b.removeAttribute('tabindex');b.removeAttribute('aria-label');});}
var watching=false;
function watch(){if(watching||!window.MutationObserver||!document.querySelector('.tll-lib-byline'))return;watching=true;
  new MutationObserver(strip).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['role','tabindex']});}
function go(e){var t=e.target.closest&&e.target.closest('[data-tll-bl]');if(!t)return;
  if(e.type==='keydown'&&e.key!=='Enter')return;
  e.preventDefault();e.stopPropagation();
  var href=t.getAttribute('data-tll-bl');if(e.metaKey||e.ctrlKey)window.open(href,'_blank','noopener');else location.href=href;}
document.addEventListener('click',go,true);document.addEventListener('keydown',go,true);
function pass(){wire();strip();watch();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',pass);else pass();
setTimeout(pass,800);setTimeout(pass,2000);
})();
