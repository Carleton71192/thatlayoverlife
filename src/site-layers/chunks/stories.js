/* tll-site-layers-v16 chunk stories: loaded by the core loader on paths matching /^\/stories$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-stories-places-v1.js */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
var ORDER=['all','Africa','Americas','Antarctica','Asia','Europe','Middle East','Oceania']; /* alphabetical after All places (Nancy, 29 Oct) */
function words(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),t;
  while(t=w.nextNode()){if(t.nodeValue.indexOf('story on the shelf')>-1)t.nodeValue=t.nodeValue.replace('story on the shelf','story in the library');}}
function chips(){
  var row=document.querySelector('[data-tll-chips="place-sort"] .tll-chip-row');if(!row||row.dataset.tllPlaces)return;
  var have={};[].forEach.call(row.querySelectorAll('[data-tll-place]'),function(c){have[c.getAttribute('data-tll-place')]=c;});
  var model=row.querySelector('.tll-shelf-chip[data-tll-place]');if(!model)return;
  row.dataset.tllPlaces='1';
  var grid=document.querySelector('.tll-lib-grid')||document.querySelector('.tll-library-grid');
  var wired=!!(grid&&grid.dataset.tllChips);
  var added=[];
  ORDER.forEach(function(p){if(have[p])return;var c=model.cloneNode(true);c.setAttribute('data-tll-place',p);c.textContent=p;
    c.className='tll-shelf-chip';c.setAttribute('aria-pressed','false');have[p]=c;added.push(c);});
  /* place every chip in alphabetical order, after the label */
  ORDER.forEach(function(p){if(have[p])row.appendChild(have[p]);});
  if(!wired||!grid)return;
  /* fallback when the page script ran first: filter the same way it does */
  added.forEach(function(c){c.addEventListener('click',function(e){e.preventDefault();var v=c.getAttribute('data-tll-place');
    [].forEach.call(row.querySelectorAll('[data-tll-place]'),function(x){var on=x===c;x.classList.toggle('tll-filter-chip-on',on);x.classList.toggle('tll-shelf-chip',!on);x.setAttribute('aria-pressed',on?'true':'false');});
    var n=0;[].forEach.call(grid.children,function(el){var r=el.querySelector('[data-tll-region]');var show=!!r&&r.textContent.trim()===v;el.style.display=show?'':'none';if(show)n++;});
    var note=document.getElementById('tll-chip-note');if(note)note.remove();
    if(!n){note=document.createElement('div');note.id='tll-chip-note';note.setAttribute('role','status');
      note.style.cssText='border:2px dashed #c9b89a;border-radius:10px;padding:28px;margin-bottom:20px;text-align:center;background:#fff;font-size:14px;color:#3a3a3a';
      note.textContent='No stories from '+v+' yet. Be the first.';grid.parentNode.insertBefore(note,grid);}
  });});
}
function url(e){var c=e.target&&e.target.closest&&e.target.closest('[data-tll-chips="place-sort"] [data-tll-place]');if(!c||!history.replaceState)return;
  var v=c.getAttribute('data-tll-place')||'',q=new URLSearchParams(location.search);if(!v||v==='all')q.delete('place');else q.set('place',v);
  var s=q.toString();history.replaceState(history.state,'',location.pathname+(s?'?'+s:'')+location.hash);}
document.addEventListener('click',url);
function shown(){document.documentElement.removeAttribute('data-tll-place-wait');}
function replay(){var want=(new URLSearchParams(location.search).get('place')||'').trim().toLowerCase();if(!want||want==='all'){shown();return;}var n=0;
  (function go(){var grid=document.querySelector('.tll-lib-grid')||document.querySelector('.tll-library-grid');
    if(!grid||!grid.dataset.tllChips){if(++n<30)setTimeout(go,100);else shown();return;}
    var hit=null;[].forEach.call(document.querySelectorAll('[data-tll-chips="place-sort"] [data-tll-place]'),function(c){if((c.getAttribute('data-tll-place')||'').toLowerCase()===want)hit=c;});
    if(hit&&hit.getAttribute('aria-pressed')!=='true')hit.click();shown();})();}
function dots(){[].forEach.call(document.querySelectorAll('.tll-lib-card [data-s3-place]'),function(p){var n=p.parentNode&&p.parentNode.querySelector('.tll-lib-byline-name');if(!n)return;
  p.removeAttribute('data-tll-own-line');var a=n.getBoundingClientRect(),b=p.getBoundingClientRect();if(b.height>0&&a.height>0&&b.top>=a.bottom-2)p.setAttribute('data-tll-own-line','');});}
var dt;function later(){clearTimeout(dt);dt=setTimeout(dots,120);}
window.addEventListener('resize',later);document.addEventListener('tll:lib-filtered',later);document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('[data-tll-place],[data-tll-sort]'))later();});
try{document.fonts&&document.fonts.ready&&document.fonts.ready.then(later);}catch(e){}
function run(){chips();words();replay();dots();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(words,1500);
})();
/* src/site-layers/tll-story-is-v1.js */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-story-is-v1'))return;var s=el('style');s.id='tll-story-is-v1';s.textContent='.tll-si{max-width:680px;margin:0 auto 28px;padding:18px 20px;border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",TLLSansA,TLLSansR,system-ui,sans-serif;color:#0A0B14}'+
'.tll-si-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}.tll-si h2{font:800 24px/1.15 "Playfair Display",TLLSerifG,TLLSerifN,TLLSerifT,Georgia,serif;margin:0 0 10px}'+
'.tll-si ul{margin:0 0 10px;padding-left:18px;display:grid;gap:4px}.tll-si li{text-wrap:pretty}.tll-si p{margin:0}.tll-si small{display:block;font-size:13px;color:#5F5A54;margin:6px 0 0}.tll-si-hint{font:400 13px/1.4 "IBM Plex Sans Condensed",TLLSansA,TLLSansR,system-ui,sans-serif;color:#5F5A54;margin:4px 0 0}';document.head.appendChild(s);}
function submit(){if(document.getElementById('tll-si'))return;var f=document.querySelector('main form')||document.querySelector('form');if(!f)return;css();
  var b=el('section','tll-si');b.id='tll-si';b.appendChild(el('p','tll-si-k','What a story looks like here'));b.appendChild(el('h2','','You went. Something happened. You tell it.'));
  var ul=el('ul');[['One trip, first person.','A weekend, a layover, a year abroad. Not "Thailand" but "the night bus to Chiang Mai."'],['You were there.','Use your own photos and keep the mistakes in. Stock photos and press kits get sent back.'],['A place and a time.','City or country, month and year. After the trip, never during.'],['The bit that went sideways.','The missed ferry, the wrong hostel, the kindness you did not expect. That is the story.'],['In your words.','We fix typos. AI writes nothing here, and anything AI made is labeled.']]
  .forEach(function(x){var li=el('li');li.appendChild(el('b','',x[0]+' '));li.appendChild(document.createTextNode(x[1]));ul.appendChild(li);});b.appendChild(ul);
  b.appendChild(el('p','','Not sure? Ask: could only you have written it? Then it belongs here.'));
  b.appendChild(el('small','','What we send back: guides, roundups, "best of" lists, hotel or product reviews, anything written to sell something. We will tell you why, kindly, and point you to where it fits.'));
  f.parentNode.insertBefore(b,f);
  var title=f.querySelector('input[name*="title" i],input[name*="headline" i],input[id*="title" i]');if(title&&!(title.nextElementSibling&&title.nextElementSibling.classList.contains('tll-si-hint'))){var hint=el('p','tll-si-hint','Sounds like a guide. Stories here are one trip, told by the person who took it. Keep going if that is what this is.');hint.hidden=true;title.insertAdjacentElement('afterend',hint);
    title.addEventListener('input',function(){hint.hidden=!/\b(best|top \d+|top ten|guide|destination|luxury|ultimate)\b/i.test(title.value);});}}
function storyEnd(){var p=document.querySelector('.tll-sa');if(!p||p.querySelector('.tll-si-line'))return;var s=el('span','tll-si-line',' One trip, told by the person who took it. Could only you have written it? Then send it.');p.appendChild(s);}
function search(){var n=document.getElementById('tll-q-note');if(!n||n.dataset.tllSi||n.getAttribute('data-s3'))return;n.dataset.tllSi='1';var q=n.querySelector('span');var word=q?q.textContent:'';n.textContent='';
  var k=document.querySelectorAll('.tll-lib-grid [data-tll-card]').length;
  n.appendChild(document.createTextNode('No story matches “'));var sp=el('span','',word);n.appendChild(sp);n.appendChild(document.createTextNode('” yet'+(k?', so here are all '+k+'. ':'. ')+'Every story here is one trip, told by someone who went. '));
  var share=el('a','','Share your story');share.href='/submit';n.appendChild(share);n.appendChild(document.createTextNode(' · '));
  var link=el('a','','See all stories');link.href='/stories';n.appendChild(link);}
function run(){if(P==='/submit')submit();else if(/^\/stories\/[^/]+$/.test(P))storyEnd();else if(P==='/stories'){search();setTimeout(search,1500);setTimeout(search,3500);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,900);});else setTimeout(run,900);
setTimeout(run,3000);
})();
/* src/site-layers/tll-trust-v1.js */
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
'[data-tll-correction-line]{margin:0 0 10px;font:400 15px/1.5 "IBM Plex Sans Condensed",TLLSansA,TLLSansR,system-ui,sans-serif;color:#0A0B14}'+
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
/* src/site-layers/tll-stories-count-v1.js */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
var W=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty'];
function word(n){n=Math.max(0,Math.floor(+n||0));return n<=20?W[n]:String(n);}
function fromCards(){var s={};[].forEach.call(document.querySelectorAll('.tll-lib-grid a.tll-lib-card[href*="/stories/"],a.tll-lib-card[href*="/stories/"]'),function(a){var h=(a.getAttribute('href')||'').split('?')[0].replace(/\/$/,'');if(h)s[h]=1;});return Object.keys(s).length;}
function fromCounts(){var c=window.tllCounts;var n=c&&+c.s;return n>0?n:0;}
var span=null,rest=null,bare=false;
function split(){
  var h=document.querySelector('h1.tll-library-title');if(!h)return false;
  span=h.querySelector('[data-tll-count]');if(span){rest=span.nextSibling;return true;}
  var t=h.firstChild;while(t&&t.nodeType!==3&&!t.textContent.trim())t=t.nextSibling;if(!t||t.nodeType!==3)return false;
  var m=t.nodeValue.match(/^(\s*)([A-Za-z-]+|\d+)(\s+stor(?:y|ies)\b)/);
  if(!m){var f=t.nodeValue.match(/^(\s*)Stories\b/);if(!f)return false; /* the count-free Designer text: "Stories, all worth the " */
    span=document.createElement('span');span.setAttribute('data-tll-count','');span.hidden=true;
    t.nodeValue=' stories'+t.nodeValue.slice(f[0].length);h.insertBefore(span,t);rest=t;bare=true;return true;}
  span=document.createElement('span');span.setAttribute('data-tll-count','');span.textContent=m[2];
  t.nodeValue=t.nodeValue.slice(m[1].length+m[2].length);h.insertBefore(span,t);rest=t;return true;}
function put(n){if(!span)return;if(!n){if(bare&&span.hidden&&rest&&rest.nodeType===3)rest.nodeValue=rest.nodeValue.replace(/^\s*stories\b/,'Stories');return;}
  var w=word(n);if(span.textContent!==w)span.textContent=w;if(span.hidden){span.hidden=false;if(rest&&rest.nodeType===3)rest.nodeValue=rest.nodeValue.replace(/^\s*Stories\b/,' stories');}
  if(rest&&rest.nodeType===3){var v=rest.nodeValue,want=n===1?' story':' stories',m=v.match(/^\s+stor(?:y|ies)\b/);if(m&&m[0]!==want)rest.nodeValue=want+v.slice(m[0].length);}}
function run(){if(!split())return;put(fromCounts()||fromCards());
  document.addEventListener('tll:counts',function(){put(fromCounts());});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
/* src/site-layers/tll-stories-strip-v1.js */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
if(document.getElementById('tll-stories-strip-v1'))return;
var s=document.createElement('style');s.id='tll-stories-strip-v1';
s.textContent='html body .tll-ph-row,html body .tll-ph-row.tll-ph-row-below{display:none}';
(document.head||document.documentElement).appendChild(s);
})();
