/* tll-site-layers-v16 chunk story: loaded by the core loader on paths matching /^\/stories\/[^/]+$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-story-ask-v1.js */
(function(){
if(!/^\/stories\/[a-z0-9-]+\/?$/.test(location.pathname))return;
var CSS=".tll-sa{margin:28px 0 0;padding:20px 22px;border:1px solid rgba(10,11,20,.14);border-radius:2px;background:#FDF9F3;font-size:16px;line-height:1.5;color:#1A1A1A}"+
".tll-sa-k{display:block;margin:0 0 6px;font:600 12px/1.4 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:#C8325B}"+
".tll-sa a{color:#1A1A1A;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:4px}"+
".tll-sa a:hover{color:#C8325B}.tll-sa a:focus-visible{outline:2px solid #C8325B;outline-offset:2px}";
function run(){if(document.querySelector('.tll-sa'))return;var row=document.querySelector('.tll-story-share-row');if(!row)return;
  var s=document.createElement('style');s.id='tll-story-ask-v1';s.textContent=CSS;document.head.appendChild(s);
  var p=document.createElement('p');p.className='tll-sa';
  p.innerHTML='<span class="tll-sa-k">Write for TLL</span>Went somewhere worth telling? <a href="/submit">Pitch a layover story →</a> or <a href="/share-photos">send one photo</a>.';
  row.insertAdjacentElement('afterend',p);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
/* src/site-layers/tll-story-captions-v1.js */
(function(){
if(!/^\/stories\/[^/]+\/?$/.test(location.pathname))return;
var CSS='.tll-ph-cap{display:block;margin:8px 0 0;font:400 14px/1.45 "IBM Plex Sans Condensed",TLLSansA,TLLSansR,system-ui,sans-serif;color:#5F5A54;text-align:left}'+
'.tll-inline-photo .tll-ph-cap{padding:0 4vw}@media(max-width:767px){.tll-inline-photo .tll-ph-cap{padding:0 16px}}'+
'.tll-story-gallery .tll-ph-cap{font-size:13px;margin:6px 0 0}';
function go(){
  var X=window.tllPh,sec=document.querySelector('.tll-story-gallery');if(!X||!X.P||!sec||sec.getAttribute('data-tll-gallery-built')!=='1')return false;
  var caps={};X.P().split(/\r?\n/).forEach(function(l){var m=/^\s*caption\s*:\s*([^|]+)\|(.+)$/i.exec(l);if(m)caps[m[1].trim().toLowerCase()]=m[2].trim().slice(0,300);});
  if(!Object.keys(caps).length)return true;
  if(!document.getElementById('tll-story-captions-v1')){var st=document.createElement('style');st.id='tll-story-captions-v1';st.textContent=CSS;document.head.appendChild(st);}
  [].forEach.call(document.querySelectorAll('a.tll-gallery-link'),function(a){
    var img=a.querySelector('img');if(!img||a.__tllCap)return;var c=caps[X.S(img.getAttribute('src'))];if(!c)return;a.__tllCap=1;
    var fig=a.closest('figure.tll-inline-photo');var cap=document.createElement(fig?'figcaption':'span');cap.className='tll-ph-cap';cap.textContent=c;
    if(fig)fig.appendChild(cap);else a.parentNode.insertBefore(cap,a.nextSibling);
    var js=a.querySelector('script.w-json');if(js){try{var d=JSON.parse(js.textContent);(d.items||[]).forEach(function(it){it.caption=c;});js.textContent=JSON.stringify(d);}catch(e){}}
  });
  return true;
}
var n=0;(function t(){if(go())return;if(++n>60)return;setTimeout(t,200);})();
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
