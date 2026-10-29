/* tll-story-fixes-1029-v1 (29 Oct 2026, Nancy's notes).
   1. "The New Orleans card should show a US flag": the site flag script (tllflagsv5) only knows country names, so a label like
      "NEW ORLEANS, LOUISIANA" got no flag. A label whose last part is a US state (Georgia is left to the country flag) or Washington DC, now gets the US flag, drawn the
      same way (22 px round flag before the text) only when no flag is there yet.
   2. Story pages: the related-stories heading "Other stops on this layover" shows the same traveler's other stories, so it reads
      "Other stories from this frequent traveler" (rose italic on "traveler", as before on "layover").
   Same elements; nothing removed; no data-ms-* element touched. */
(function(){
var SET={};'alabama alaska arizona arkansas california colorado connecticut delaware florida hawaii idaho illinois indiana iowa kansas kentucky louisiana maine maryland massachusetts michigan minnesota mississippi missouri montana nebraska nevada ohio oklahoma oregon pennsylvania tennessee texas utah vermont virginia washington wisconsin wyoming dc'.split(' ').forEach(function(s){SET[s]=1;});
['new hampshire','new jersey','new mexico','new york','north carolina','north dakota','rhode island','south carolina','south dakota','west virginia','district of columbia','washington dc'].forEach(function(s){SET[s]=1;});
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z ]+/g,' ').replace(/\s+/g,' ').trim();}
function flags(){
  [].forEach.call(document.querySelectorAll('.tll-lib-meta,.tll-story-byline-loc,[data-tll-crumb=country]'),function(e){
    if(e.__usf||e.querySelector('img[src*="flag"]'))return;
    var parts=e.textContent.split(',');var last=norm(parts[parts.length-1]);if(!SET[last])return;
    e.__usf=1;
    var w=document.createElement('span');w.setAttribute('aria-hidden','true');w.style.cssText='display:inline-flex;vertical-align:-6px;margin-right:6px';
    var i=document.createElement('img');i.src='https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/us.svg';i.alt='';i.onerror=function(){i.remove();};
    i.style.cssText='width:22px;height:22px;border-radius:50%';w.appendChild(i);e.insertBefore(w,e.firstChild);
  });
}
function heading(){
  [].forEach.call(document.querySelectorAll('.tll-related-header h1,.tll-related-header h2,.tll-related-header h3'),function(h){
    if(h.dataset.tllRh||!/other stops on this\s*layover/i.test(h.textContent.replace(/\s+/g,' ')))return;h.dataset.tllRh='1';
    var em=h.querySelector('em,.tll-text-rose');
    if(em){[].forEach.call(h.childNodes,function(n){if(n.nodeType===3&&/Other stops on this/i.test(n.nodeValue))n.nodeValue='Other stories from this frequent ';});em.textContent='traveler';}
    else h.textContent='Other stories from this frequent traveler';
  });
}
/* flags run after the site flag script (DOMContentLoaded and 1200 ms), so a country it knows always wins; Georgia is left to it. */
function later(){setTimeout(flags,1400);setTimeout(flags,2600);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){heading();later();});else{heading();later();}
setTimeout(heading,1300);
})();
