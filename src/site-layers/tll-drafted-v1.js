/* tll-drafted-v1 (8 Nov 2026; Nancy: "Draft the empty ones, keep the map and gallery", for the AdSense "Low value content" review).
   Five pages and one Pillars item are drafts now: /newsletter, /creators, /awards, /spotlight, /pets and /pillars/paw-passport.
   This layer keeps the live pages from linking at them, at parse time so nothing flashes:
     footer          the Read column's "The Layover Awards" and "Spotlight" and the Contribute column's "For creators" are hidden
                     (by href, never by class: /gallery shares their class). The footer component itself is untouched.
     /travelers      the "Creators & affiliates" pill (it pointed at /creators) is hidden.
     /account        the Newsletter settings card ("Manage your subscription") is hidden: there is no preferences flow behind it.
     /edit-profile   the "What is this" link to /creators is hidden and the note names /travelers instead.
   /travel-wire    9 Nov (Nancy: "Hide the Blog Desk tile from the layer"): the Blog Desk block (heading, intro, the "OPEN SLOTS · THE DESK
                   IS NEW" tile and the "Add my blog" pitch) is hidden until a blog is on the wire. The page keeps the headlines.
   The forwards for the old addresses live in tll-phase0-v1 (MOVED). Real 301s belong in Webflow Site settings; Nancy adds them.
   Undo: remove this layer from CORE and republish the pages. No data-ms-* element touched; nav and footer components untouched. */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
if(document.getElementById('tll-drafted-v1'))return;
var s=document.createElement('style');s.id='tll-drafted-v1';
s.textContent='footer a[href="/awards"],footer a[href="/spotlight"],footer a[href="/creators"],'+
  '[data-tll-fyp="travelers"] a.tll-fyp-pill[href="/creators"],a.tll-fyp-pill[href="/creators"],'+
  '.tll-account-settings-grid a.tll-account-settings-card[href="/newsletter"],'+
  '.ep-dir a.ep-mono[href="/creators"]{display:none!important}';
if(P==='/travel-wire')s.textContent+='.inline-div-12-1-2-3-4-5-6-7-8-9-10-11-12{display:none!important}';
document.head.appendChild(s);
if(P==='/travel-wire'){var desk=function(){[].slice.call(document.querySelectorAll('div')).some(function(d){if(d.children.length||!/^THE BLOG DESK/i.test((d.textContent||'').trim()))return false;
    var b=d.closest('[class^="inline-div-12-"]')||d.parentElement&&d.parentElement.parentElement&&d.parentElement.parentElement.parentElement;if(b)b.style.display='none';return true;});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',desk);else desk();}
if(/^\/edit-profile/.test(P)){var fix=function(){[].slice.call(document.querySelectorAll('[data-ep-makes] p.ep-note, p.ep-note')).forEach(function(p){
    var w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){if(t.nodeValue.indexOf('/creators')>-1)t.nodeValue=t.nodeValue.split('/creators').join('/travelers');}});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();setTimeout(fix,1500);}
})();
