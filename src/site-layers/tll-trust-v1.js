/* tll-trust-v1 (11 Nov 2026, Nancy's trust and conversion prompt; handoff/CHANGE-LOG-TRUST-CONVERSION-2026-11-11.md, items 10, 12, 14, 18, 19, 21).
   The site keeps its own charter: who paid sits above the first paragraph, numbers carry their unit, a date only shows when it is real.
   Nothing here invents a value: every label comes from a CMS field bound into the page as an attribute, and no label shows when the field is empty.
   1. Funding label (charter rule 4). Story page: the template's chip link (a[data-tll-commissioned="story"], hidden until switched on)
      carries data-tll-funding (Stories field Funding) and data-tll-funding-partner (Funding partner). When Funding is set the chip
      reads "Self-funded", "Hosted by {name}", "Gifted by {name}", "Reklame · Sponsored by {name}" or "Commissioned by TLL", links to
      /editorial-charter#rule-4 and moves to sit directly above the first paragraph of the body. /stories cards: the hidden marker
      [data-tll-facts="card"] carries the same two values and the label is one short line under the card's kicker.
   2. Reading time as text. /stories cards, the Keep reading cards and the home rail printed the unit through CSS ("9" plus ::after
      " min"), so anything reading the text saw a bare number. The text itself now says "9 min read" and the CSS unit is switched off.
   3. Traveled date on /stories cards: month and year from Trip when, only when it is a plain "Month YYYY" and the writer's Show
      traveled date switch is on (the [data-tll-facts="trip-shown"] marker renders only then).
   4. Story page receipts: the Last updated row shows only when the story has a Last updated date (the template used to print the
      published date there); when a Correction note exists it prints as "Correction, {date}: {note}" above that row.
   5. Sponsored stories: the label before the headline reads "Reklame · Sponsored by {name}", never "Reklame" alone.
   Each part is guarded by its own selectors; nothing removed; no data-ms-* element touched. */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
var isStories=P==='/stories',isStory=/^\/stories\/[^/]+$/.test(P),isHome=P==='/'||P==='/index.html';
if(!isStories&&!isStory&&!isHome)return;
var MONTHS='January|February|March|April|May|June|July|August|September|October|November|December';
var CSS=
'html.tllp-stories .tll-lib-card [data-s3-mins][data-tll-mins]::after{content:none!important}'+
'.tll-related-meta[data-tll-mins]::after{content:none!important}'+
'.tll-lib-card [data-tll-fund]{display:block;margin:6px 0 0;font:600 10px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#5F5A54}'+
'.tll-lib-card [data-s3-kicker] [data-tll-trip-date]:not(:empty)::before{content:"\\00a0\\00b7\\00a0"}'+
'.tll-story-body>a[data-tll-commissioned="story"].tll-comm-on{display:flex;width:-moz-fit-content;width:fit-content;margin:0 0 12px}'+
'[data-tll-correction-line]{margin:0 0 10px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'[data-tll-correction-line] b{font-weight:600}';
function css(){if(document.getElementById('tll-trust-v1'))return;var s=document.createElement('style');s.id='tll-trust-v1';s.textContent=CSS;document.head.appendChild(s);}
function clean(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
/* The funding label from the option's name and the partner. Unknown or empty values give no label. */
function fundLabel(f,who){f=clean(f).toLowerCase();who=clean(who);
  if(f==='self-funded')return'Self-funded';
  if(f==='commissioned by tll')return'Commissioned by TLL';
  if(f==='hosted by')return who?'Hosted by '+who:'';
  if(f==='gifted by')return who?'Gifted by '+who:'';
  if(f==='sponsored by')return who?'Reklame · Sponsored by '+who:'';
  return'';}
function mins(el){if(!el||el.hasAttribute('data-tll-mins'))return;var t=clean(el.textContent),m=t.match(/^(\d+)(?:\s*min(?:\s*read)?)?$/);if(!m)return;
  el.textContent=m[1]+' min read';el.setAttribute('data-tll-mins','1');}
function cards(){
  [].forEach.call(document.querySelectorAll('a.tll-lib-card'),function(c){
    mins(c.querySelector('[data-s3-mins]'));
    var f=c.querySelector('[data-tll-facts="card"]');if(!f)return;
    var kick=c.querySelector('[data-s3-kicker]');
    if(kick&&!kick.querySelector('[data-tll-trip-date]')){
      var shown=c.querySelector('[data-tll-facts="trip-shown"]'),when=clean(f.getAttribute('data-tll-trip'));
      if(shown&&!shown.classList.contains('w-condition-invisible')&&new RegExp('^('+MONTHS+') \\d{4}$').test(when)){
        var d=document.createElement('div');d.setAttribute('data-tll-trip-date','1');d.textContent=when;kick.appendChild(d);}}
    if(!c.querySelector('[data-tll-fund]')){
      var label=fundLabel(f.getAttribute('data-tll-funding'),f.getAttribute('data-tll-funding-partner'));
      if(label){var l=document.createElement('div');l.setAttribute('data-tll-fund','1');l.textContent=label;
        if(kick&&kick.parentNode)kick.parentNode.insertBefore(l,kick.nextSibling);else{var b=c.querySelector('.tll-lib-body');if(b)b.appendChild(l);}}}
  });}
function story(){
  [].forEach.call(document.querySelectorAll('.tll-related-meta'),mins);
  /* 1. the funding chip, above the first paragraph */
  var chips=document.querySelectorAll('a[data-tll-commissioned="story"][data-tll-funding]'),done=document.querySelector('a[data-tll-fund-chip]');
  if(!done)for(var i=0;i<chips.length;i++){var a=chips[i],label=fundLabel(a.getAttribute('data-tll-funding'),a.getAttribute('data-tll-funding-partner'));if(!label)continue;
    a.textContent=label;a.setAttribute('href','/editorial-charter#rule-4');a.setAttribute('data-tll-fund-chip','1');a.classList.add('tll-comm-on');
    var col=document.querySelector('.tll-story-body'),body=col&&col.querySelector(':scope > .w-richtext');
    if(body&&a.parentNode===col)col.insertBefore(a,body);
    break;}
  /* 4. receipts: Last updated only with a real date; the correction line above it */
  var up=document.querySelector('[data-tll-lg="updated"]'),row=up&&up.closest('.tll-ledger-row'),au=document.querySelector('[data-st3-updated]');
  if(row&&au&&!clean(au.getAttribute('data-st3-updated')))row.style.display='none';
  var cn=document.querySelector('[data-tll-correction]'),note=cn&&clean(cn.getAttribute('data-tll-correction'));
  if(note&&row&&!document.querySelector('[data-tll-correction-line]')){var p=document.createElement('p');p.setAttribute('data-tll-correction-line','1');
    var b=document.createElement('b');b.textContent='Correction'+(clean(up.textContent)?', '+clean(up.textContent):'')+': ';p.appendChild(b);p.appendChild(document.createTextNode(note));row.parentNode.insertBefore(p,row);}
  /* 5. Reklame never alone */
  var r=document.querySelector('[data-tll-reklame]');if(r&&r.firstChild&&r.firstChild.nodeType===3&&/^Reklame for\s*$/.test(r.firstChild.nodeValue))r.firstChild.nodeValue='Reklame · Sponsored by ';
}
function home(){[].forEach.call(document.querySelectorAll('.h3-card-meta'),function(m){var t=m.textContent;if(/\d+ min$/.test(t))m.textContent=t+' read';});}
function run(){css();if(isStories)cards();if(isStory)story();if(isHome)home();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.addEventListener('load',function(){run();setTimeout(run,1500);});
if(isHome)document.addEventListener('tll:counts',function(){setTimeout(home,0);});
})();
