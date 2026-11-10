/* tll-stories-count-v1 (10 Nov 2026, week-one item 3: the /stories headline count). The Designer H1 reads "Six stories, all worth the
   detour." (a typed word) and two hosted page scripts rewrite it on load: tllstorycountv2 (sitemap count, cached per visit) and
   tllstorycountv3 (count of the cards in the grid), so the headline could disagree with the footer and the home chapter, which read
   window.tllCounts.s from tll-live-counts-v3. Now the number comes from tllCounts.s when the footer has published it (and again on
   every tll:counts event), and from the story cards in the grid until then. Words up to twenty, digits above (house rule: counts are
   never typed; words are fine when computed). The number sits in its own span, so the two hosted scripts' regexes (which want the
   word and " stories" in one text node) no longer match and stop rewriting the headline; both can come off the page code later.
   /stories only; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
var W=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty'];
function word(n){n=Math.max(0,Math.floor(+n||0));return n<=20?W[n]:String(n);}
function fromCards(){var s={};[].forEach.call(document.querySelectorAll('.tll-lib-grid a.tll-lib-card[href*="/stories/"],a.tll-lib-card[href*="/stories/"]'),function(a){var h=(a.getAttribute('href')||'').split('?')[0].replace(/\/$/,'');if(h)s[h]=1;});return Object.keys(s).length;}
function fromCounts(){var c=window.tllCounts;var n=c&&+c.s;return n>0?n:0;}
var span=null,rest=null;
function split(){
  var h=document.querySelector('h1.tll-library-title');if(!h)return false;
  span=h.querySelector('[data-tll-count]');if(span){rest=span.nextSibling;return true;}
  var t=h.firstChild;while(t&&t.nodeType!==3&&!t.textContent.trim())t=t.nextSibling;if(!t||t.nodeType!==3)return false;
  var m=t.nodeValue.match(/^(\s*)([A-Za-z-]+|\d+)(\s+stor(?:y|ies)\b)/);if(!m)return false;
  span=document.createElement('span');span.setAttribute('data-tll-count','');span.textContent=m[2];
  t.nodeValue=t.nodeValue.slice(m[1].length+m[2].length);h.insertBefore(span,t);rest=t;return true;}
function put(n){if(!n||!span)return;var w=word(n);if(span.textContent!==w)span.textContent=w;
  if(rest&&rest.nodeType===3){var v=rest.nodeValue,want=n===1?' story':' stories',m=v.match(/^\s+stor(?:y|ies)\b/);if(m&&m[0]!==want)rest.nodeValue=want+v.slice(m[0].length);}}
function run(){if(!split())return;put(fromCounts()||fromCards());
  document.addEventListener('tll:counts',function(){put(fromCounts());});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
