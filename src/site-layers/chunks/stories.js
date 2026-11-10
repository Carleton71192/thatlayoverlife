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
function run(){chips();words();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(words,1500);
})();
/* src/site-layers/tll-series-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-wt-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 11px/1.3 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%);margin:0 0 10px;max-width:100%}'+
'.tll-wt-card-tape{position:absolute;top:10px;left:10px;z-index:3;margin:0;font-size:10px;padding:5px 10px}'+
'.tll-sr-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 16px;font:400 14px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-sr-chips button{min-height:44px;padding:0 14px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-sr-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-sr-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-sr-box{max-width:680px;margin:28px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-sr-box ol{margin:8px 0 0;padding-left:20px}.tll-sr-box p{margin:0 0 6px}.tll-sr-box b{font-weight:600}.tll-sr-box small{display:block;color:#5F5A54;margin-top:8px}'+
'.tll-sr-box a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-sr-kit a{margin-right:14px}.tll-sr-kit i{font-style:normal;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#5F5A54;margin-left:4px}'+
'.tll-sr-li{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;background:#0A0B14;color:#FDF9F3!important;text-decoration:none!important;font-weight:600}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-series-v1'))return;var s=el('style');s.id='tll-series-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:x&&x.division||'tll'},x||{}));}catch(e){}}
function tape(text,cls){return el('span','tll-wt-tape'+(cls?' '+cls:''),text);}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
function div(group){return group==='pets'?'paw-passport':'tll';}
function line(box,label,val){if(!val)return;var p=el('p');p.appendChild(el('b','',label+': '));p.appendChild(document.createTextNode(val));box.appendChild(p);}

function labelCards(cards){var by={};cards.forEach(function(c){by[c.slug]=c;});
  Object.keys(by).forEach(function(slug){[].slice.call(document.querySelectorAll('a[href="/stories/'+slug+'"],a[href^="/stories/'+slug+'?"]')).forEach(function(a){
    if(a.closest('.tll-wt-rail')||a.closest('nav,header,footer,.tll-sr-box'))return;var card=a.closest('.w-dyn-item')||a;if(card.querySelector('.tll-wt-card-tape'))return;
    if(getComputedStyle(card).position==='static')card.style.position='relative';card.appendChild(tape(by[slug].label,'tll-wt-card-tape'));card.setAttribute('data-tll-series',by[slug].series);});});}
function chips(series){if(document.getElementById('tll-sr-chips'))return;var have=series.filter(function(s){return s.stories.length;});if(!have.length)return;
  var first=document.querySelector('main .w-dyn-item a[href^="/stories/"]'),list=first&&first.closest('.w-dyn-list');if(!list)return;
  var row=el('div','tll-sr-chips');row.id='tll-sr-chips';row.setAttribute('role','group');row.setAttribute('aria-label','Story series');row.appendChild(el('span','tll-sr-k','Series'));var on='';
  have.forEach(function(s){var b=el('button','',s.name);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){on=on===s.slug?'':s.slug;
    [].slice.call(row.querySelectorAll('button')).forEach(function(x){x.setAttribute('aria-pressed',String(x===b&&on!==''));});
    [].slice.call(list.querySelectorAll('.w-dyn-item')).forEach(function(it){it.hidden=!!on&&it.getAttribute('data-tll-series')!==on;});track('series_filter',{series:on||'all',division:div(s.group)});});row.appendChild(b);});
  list.parentNode.insertBefore(row,list);}

function fieldsBox(d){var f=d.fields||{},s=d.series,box=el('aside','tll-sr-box'),name=d.label.split(' · ')[0];box.setAttribute('aria-label',name);box.appendChild(el('p','tll-sr-k',name));
  if(s==='the-free-evening'){var t=[f.time,f.start?'starting from a '+f.start.toLowerCase():''].filter(Boolean).join(', ');if(t)box.appendChild(el('p','',t));
    if(f.stops&&f.stops.length){var ol=el('ol');f.stops.forEach(function(x){ol.appendChild(el('li','',x.stop+(x.move?' · '+x.move:'')));});box.appendChild(ol);}}
  else if(s==='plus-one-day'){if(f.extraDays)box.appendChild(el('p','',f.extraDays+(f.extraDays===1?' extra day':' extra days')));line(box,'Who paid for what',f.whoPaid);line(box,'Best decision',f.best);line(box,'Worst decision',f.worst);}
  else if(s==='the-first-friend'){var a=[f.yearsThere?f.yearsThere+(f.yearsThere===1?' year in':' years in'):'',f.monthsItTook?'it took '+f.monthsItTook+(f.monthsItTook===1?' month':' months'):''].filter(Boolean).join(', ');if(a)box.appendChild(el('p','',a.charAt(0).toUpperCase()+a.slice(1)+'.'));
    line(box,'Where it happened',f.where);line(box,'What worked',f.worked);line(box,'What did not',f.didNot);}
  else if(s==='the-partner-who-moved-too'){var m=[f.from&&f.to?f.from+' to '+f.to:'',f.years].filter(Boolean).join(', ');if(m)box.appendChild(el('p','',m));line(box,'What happened to my work',f.work);line(box,'What I wish someone had told me',f.wish);}
  else if(s==='moving-back'){var mb=[f.from&&f.to?f.from+' back to '+f.to:'',f.yearsAway?f.yearsAway+' away':''].filter(Boolean).join(', ');if(mb)box.appendChild(el('p','',mb));line(box,'The strangest thing about home now',f.strangest);line(box,'What I kept from abroad',f.kept);}
  else if(s==='the-sitter-was-the-hero'){line(box,'The hero',f.sitter);}
  else if(s==='cats-who-travel'){line(box,'Carrier or harness',f.carrier);line(box,'Where they hid',f.hid);}
  if(f.when)box.appendChild(el('small','',(d.group==='pets'?"Writer's experience, ":'Written ')+f.when));
  return box.children.length>1?box:null;}
function petBox(b){var box=el('aside','tll-sr-box');box.setAttribute('aria-label','Pet-friendly or pet-tolerant?');box.appendChild(el('p','tll-sr-k','Pet-friendly or pet-tolerant?'));
  if(b.stayedAt){var p=el('p');p.appendChild(el('b','','Stayed at: '));if(b.url){var a=el('a','',b.stayedAt);a.href=b.url;a.rel=b.rel;a.target='_blank';p.appendChild(a);}else p.appendChild(document.createTextNode(b.stayedAt));if(b.city)p.appendChild(document.createTextNode(', '+b.city));box.appendChild(p);}
  line(box,'What we paid for the pet',b.paid);line(box,'Size or weight rule',b.sizeRule);line(box,'What made it welcoming',b.welcoming);line(box,'What we would tell the next owner',b.tell);
  box.appendChild(el('small','',"Writer's experience"+(b.when?', '+b.when:'')+'. No business can pay to change or remove a note.'));return box;}
function storyPage(slug){get('/series/story?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||document.getElementById('tll-sr-story'))return;
  var main=document.querySelector('main')||document.body,h1=main.querySelector('h1');var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var wrap=el('div');wrap.id='tll-sr-story';css();
  if(d.series){if(h1&&!document.querySelector('.tll-sr-head-tape')){var t=tape(d.label,'tll-sr-head-tape');h1.parentNode.insertBefore(t,h1);}
    var fb=fieldsBox(d);if(fb)wrap.appendChild(fb);
    if(d.safetyNote){var sn=el('aside','tll-sr-box');sn.appendChild(el('p','tll-sr-k','Safety, from the writer'));sn.appendChild(el('p','',d.safetyNote));wrap.appendChild(sn);}
    var sh=el('div','tll-sr-box'),li=el('a','tll-sr-li','Share on LinkedIn');li.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.origin+location.pathname);li.target='_blank';li.rel='noopener';
    li.addEventListener('click',function(){track('share_click',{channel:'linkedin',series:d.series,division:div(d.group)});});sh.appendChild(li);wrap.appendChild(sh);}
  /* Linked sponsor label (staged with the expat and pet previews): the existing "Reklame for" label gets the sponsor's name as a link. */
  var prev=false;try{prev=localStorage.getItem('tll-preview-pets')==='1'||localStorage.getItem('tll-preview-expat')==='1';}catch(e){}
  if(prev&&d.sponsor){var rk=document.querySelector('[data-tll-reklame]');if(!rk&&h1){rk=el('div','tll-reklame');rk.setAttribute('data-tll-reklame','1');rk.setAttribute('lang','da');h1.parentNode.insertBefore(rk,h1);}
    if(rk&&!rk.querySelector('a')){rk.textContent='Reklame for ';var sa=el('a','',d.sponsor.name);sa.href=d.sponsor.url;sa.target='_blank';sa.rel=d.sponsor.rel;sa.style.color='inherit';sa.addEventListener('click',function(){track('revenue_click',{slot:'sponsor_label',division:div(d.group)});});rk.appendChild(sa);}}
  if(d.petBox)wrap.appendChild(petBox(d.petBox));
  if(d.tripKit&&d.tripKit.length){var k=el('aside','tll-sr-box tll-sr-kit');k.appendChild(el('p','tll-sr-k','Trip Kit · reklamelink'));var p=el('p');
    d.tripKit.forEach(function(x){var a=el('a','',x.label);a.href=x.url;a.rel=x.rel;a.target='_blank';a.addEventListener('click',function(){track('revenue_click',{slot:'trip_kit',label:x.label,division:'tll'});});p.appendChild(a);});
    p.appendChild(el('i','','reklamelink'));k.appendChild(p);wrap.appendChild(k);}
  if(!wrap.children.length)return;var share=document.querySelector('.tll-story-share-row');if(share)share.parentNode.insertBefore(wrap,share);else if(body)body.insertAdjacentElement('afterend',wrap);else main.appendChild(wrap);});}

function run(){var m;
  if((m=/^\/stories\/([^/]+)$/.exec(P))){storyPage(m[1]);return;}
  if(!(P==='/stories'||/^\/countries\/[^/]+$/.test(P)||P==='/for-expats'||P==='/the-paw-passport'||P==='/pursuits/work-trips'))return;
  get('/series').then(function(d){if(!d||!d.ok)return;var cards=[];d.series.forEach(function(s){cards=cards.concat(s.stories);});if(!cards.length)return;css();
    labelCards(cards);if(P==='/stories')chips(d.series);setTimeout(function(){labelCards(cards);},2500);window.__tllSeries=d;});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
})();
/* src/site-layers/tll-story-is-v1.js */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-story-is-v1'))return;var s=el('style');s.id='tll-story-is-v1';s.textContent='.tll-si{max-width:680px;margin:0 auto 28px;padding:18px 20px;border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-si-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}.tll-si h2{font:800 24px/1.15 "Playfair Display",Georgia,serif;margin:0 0 10px}'+
'.tll-si ul{margin:0 0 10px;padding-left:18px;display:grid;gap:4px}.tll-si p{margin:0}.tll-si small{display:block;font-size:13px;color:#5F5A54;margin:6px 0 0}.tll-si-hint{font:400 13px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54;margin:4px 0 0}';document.head.appendChild(s);}
function submit(){if(document.getElementById('tll-si'))return;var f=document.querySelector('main form')||document.querySelector('form');if(!f)return;css();
  var b=el('section','tll-si');b.id='tll-si';b.appendChild(el('p','tll-si-k','What a story looks like here'));b.appendChild(el('h2','','You went. Something happened. You tell it.'));
  var ul=el('ul');[['One trip, first person.','A weekend, a layover, a year abroad. Not "Thailand" but "the night bus to Chiang Mai."'],['You were there.','Your photos, your dates, your mistakes. No stock photos, no press kits, no "top ten".'],['A place and a time.','City or country, month and year. After the trip, never during.'],['The bit that went sideways.','The missed ferry, the wrong hostel, the kindness you did not expect. That is the story.'],['In your words.','We fix typos. AI writes nothing here, and anything AI made is labeled.']]
  .forEach(function(x){var li=el('li');li.appendChild(el('b','',x[0]+' '));li.appendChild(document.createTextNode(x[1]));ul.appendChild(li);});b.appendChild(ul);
  b.appendChild(el('p','','Not sure? Ask: could only you have written it? Then it belongs here.'));
  b.appendChild(el('small','','What we send back: guides, roundups, "best of" lists, hotel or product reviews, anything written to sell something. We will tell you why, kindly, and point you to where it fits.'));
  f.parentNode.insertBefore(b,f);
  var title=f.querySelector('input[name*="title" i],input[name*="headline" i],input[id*="title" i]');if(title&&!(title.nextElementSibling&&title.nextElementSibling.classList.contains('tll-si-hint'))){var hint=el('p','tll-si-hint','Sounds like a guide. Stories here are one trip, told by the person who took it. Keep going if that is what this is.');hint.hidden=true;title.insertAdjacentElement('afterend',hint);
    title.addEventListener('input',function(){hint.hidden=!/\b(best|top \d+|top ten|guide|destination|luxury|ultimate)\b/i.test(title.value);});}}
function storyEnd(){var p=document.querySelector('.tll-sa');if(!p||p.querySelector('.tll-si-line'))return;var s=el('span','tll-si-line',' One trip, told by the person who took it. Could only you have written it? Then send it.');p.appendChild(s);}
function search(){var n=document.getElementById('tll-q-note');if(!n||n.dataset.tllSi)return;n.dataset.tllSi='1';var q=n.querySelector('span'),a=n.querySelector('a');var word=q?q.textContent:'';n.textContent='';
  n.appendChild(document.createTextNode('Nothing filed for “'));var sp=el('span','',word);n.appendChild(sp);n.appendChild(document.createTextNode('” yet. Every story here is one trip, told by someone who went. Yours could be the first. '));
  var link=el('a','','See all stories');link.href='/stories';n.appendChild(link);if(a&&a.href&&!/\/stories\/?$/.test(a.getAttribute('href')||''))link.href=a.href;}
function run(){if(P==='/submit')submit();else if(/^\/stories\/[^/]+$/.test(P))storyEnd();else if(P==='/stories'){search();setTimeout(search,1500);setTimeout(search,3500);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,900);});else setTimeout(run,900);
setTimeout(run,3000);
})();
/* src/site-layers/tll-stories-count-v1.js */
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
/* src/site-layers/tll-stories-strip-v1.js */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
if(document.getElementById('tll-stories-strip-v1'))return;
var s=document.createElement('style');s.id='tll-stories-strip-v1';
s.textContent='html body .tll-ph-row,html body .tll-ph-row.tll-ph-row-below{display:none}';
(document.head||document.documentElement).appendChild(s);
})();
