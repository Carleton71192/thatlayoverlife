/* tll-site-layers-v16 chunk site: loaded by the core loader on paths matching /^/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-footer-wordmark-v1.js */
(function(){
  function run(){
    [].forEach.call(document.querySelectorAll('footer a[href="/"]'),function(a){
      if(a.classList.contains('tll-fwm')) return;
      var t=a.textContent.replace(/\s+/g,' ').trim(); if(!/^that ?layover life\.?$/i.test(t)) return;
      a.classList.add('tll-fwm'); a.setAttribute('aria-label','That Layover Life, home');
      a.innerHTML='<span class="tll-fwm-that">that</span><span class="tll-fwm-block">LAYOVER <span class="tll-fwm-life">LIFE.</span></span>';
    });
  }
  if(document.readyState!=='loading') run(); else document.addEventListener('DOMContentLoaded',run);
})();
/* src/site-layers/tll-masthead-v1.js */
(function(){
  var LINE='Travel stories from members around the world, edited in Copenhagen with a Samoyed on the editor\'s feet.';
  function run(){
    [].forEach.call(document.querySelectorAll('footer a[href="/"] + p'),function(p){
      if(p.dataset.tllMasthead)return;p.dataset.tllMasthead='1';p.textContent=LINE;p.classList.add('tll-masthead');});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
/* src/site-layers/tll-hover-v1.js */
(function(){
var CSS="html body a.tll-apc:hover,html body a.tll-apc:hover *,html body a.tll-apc:focus-visible,html body a.tll-apc:focus-visible *{color:#0A0B14!important}"+
"html body a.tll-apc:hover,html body a.tll-apc:focus-visible{border-color:#C8325B!important}"+
"html body a.tll-apc:hover .tll-apc-go,html body a.tll-apc:focus-visible .tll-apc-go{color:#C8325B!important;text-decoration-color:#C8325B!important}"+
"html body .tll-account-actions-section .tll-pickin-card:hover{outline-color:#C8325B!important;border-color:#C8325B!important}";
function add(){if(document.getElementById('tll-hover-v1'))return;var s=document.createElement('style');s.id='tll-hover-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();
/* src/site-layers/tll-byline-links-v1.js */
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
function go(e){var t=e.target.closest&&e.target.closest('[data-tll-bl]');if(!t)return;
  if(e.type==='keydown'&&e.key!=='Enter')return;
  e.preventDefault();e.stopPropagation();
  var href=t.getAttribute('data-tll-bl');if(e.metaKey||e.ctrlKey)window.open(href,'_blank','noopener');else location.href=href;}
document.addEventListener('click',go,true);document.addEventListener('keydown',go,true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
setTimeout(wire,800);setTimeout(wire,2000);
})();
/* src/site-layers/tll-story-fixes-1029-v1.js */
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
/* src/site-layers/tll-email-hello-v1.js */
(function(){
var HELLO='hello@thatlayover.life';
var RE=/\b(?!hello@)[A-Za-z0-9._%+-]+@thatlayover\.life\b/gi;
function fix(root){
  [].forEach.call((root||document).querySelectorAll('a[href^="mailto:"]'),function(a){var h=a.getAttribute('href');var n=h.replace(/^mailto:[^?]*/i,function(m){return /@thatlayover\.life$/i.test(m)&&!/^mailto:hello@/i.test(m)?'mailto:'+HELLO:m;});if(n!==h)a.setAttribute('href',n);});
  var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT),t;
  while(t=w.nextNode()){if(t.nodeValue.indexOf('@thatlayover.life')>-1){var v=t.nodeValue.replace(RE,HELLO);if(v!==t.nodeValue)t.nodeValue=v;}}
  [].forEach.call((root||document).querySelectorAll('input[placeholder*="@thatlayover.life"],[aria-label*="@thatlayover.life"]'),function(el){['placeholder','aria-label'].forEach(function(k){var v=el.getAttribute(k);if(v)el.setAttribute(k,v.replace(RE,HELLO));});});
}
function run(){if(!document.body)return;fix(document.body);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);setTimeout(run,3000);
})();
/* src/site-layers/tll-ep-help-v1.js */
(function(){
var CSS=".ep-i[data-tll-help]{cursor:pointer;-webkit-tap-highlight-color:transparent}"+
".ep-i[data-tll-help]:focus-visible{outline:3px solid #C8325B;outline-offset:2px;border-radius:50%}"+
".tll-help-note{display:block;margin:8px 0 2px;padding:10px 12px;max-width:520px;border-left:3px solid #067A79;background:#E8F4F3;color:#0A0B14;"+
"font:400 14px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;letter-spacing:0;text-transform:none;border-radius:2px}"+
".tll-help-note[hidden]{display:none!important}"+
".tll-tagline-hint{margin:6px 0 0;font:400 13px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54}";
var n=0,open=null;
function close(){if(!open)return;open.note.hidden=true;open.mark.setAttribute('aria-expanded','false');open=null;}
function wire(mark){
  if(mark.dataset.tllHelp)return;var text=mark.getAttribute('aria-label')||mark.getAttribute('title')||mark.getAttribute('data-tll-tip')||'';if(!text)return;
  mark.dataset.tllHelp='1';mark.setAttribute('role','button');mark.setAttribute('tabindex','0');mark.setAttribute('aria-expanded','false');
  mark.setAttribute('aria-label','What is this?');mark.removeAttribute('title');
  var note=document.createElement('span');note.className='tll-help-note';note.id='tll-help-'+(++n);note.hidden=true;note.textContent=text;
  mark.setAttribute('aria-controls',note.id);mark.setAttribute('aria-describedby',note.id);
  var host=mark.closest('label,.ep-label,legend,h2,h3')||mark.parentNode;host.insertAdjacentElement('afterend',note);
  function toggle(e){e.preventDefault();e.stopPropagation();if(open&&open.mark===mark){close();return;}close();note.hidden=false;mark.setAttribute('aria-expanded','true');open={mark:mark,note:note};}
  mark.addEventListener('click',toggle);
  mark.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')toggle(e);if(e.key==='Escape')close();});
}
function tagline(){
  var input=document.getElementById('ep-f-one-line');if(!input||input.dataset.tllTag)return;input.dataset.tllTag='1';
  var lab=document.querySelector('label[for="ep-f-one-line"]');
  if(lab){[].forEach.call(lab.childNodes,function(c){if(c.nodeType===3&&/One line/i.test(c.nodeValue))c.nodeValue=c.nodeValue.replace(/One line/i,'Tagline');});}
  if(!input.placeholder)input.placeholder='Example: I finish bucket lists. Then I rebuild them.';
  var hint=document.createElement('p');hint.className='tll-tagline-hint';hint.textContent='A short line that sits under your name on your page and on the Travelers list. Not a job title.';
  input.insertAdjacentElement('afterend',hint);
}
function run(){
  if(!document.getElementById('tll-ep-help-v1')){var s=document.createElement('style');s.id='tll-ep-help-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
  [].forEach.call(document.querySelectorAll('.ep-i,[data-tll-tip]'),wire);tagline();
}
document.addEventListener('click',function(e){if(open&&!open.note.contains(e.target))close();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);setTimeout(run,3000);
})();
/* src/site-layers/tll-whats-new-v1.js */
(function(){
if(window.__tllWhatsNew)return;window.__tllWhatsNew=1;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/whats-new';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-wn-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#C8325B;margin-left:6px;vertical-align:middle;box-shadow:0 0 0 2px #FDF9F3}'+
'.tll-wn-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}'+
'.tll-wn{max-width:760px;margin:20px auto;padding:0 16px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-wn-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-wn-card{border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff;padding:14px 16px;margin:0 0 10px}'+
'.tll-wn-card h3{font:800 19px/1.2 "Playfair Display",Georgia,serif;margin:0 0 4px}.tll-wn-card p{margin:0 0 10px;color:#3a3833}'+
'.tll-wn-row{display:flex;flex-wrap:wrap;gap:8px}.tll-wn-row a,.tll-wn-row button{display:inline-flex;align-items:center;min-height:40px;padding:0 14px;border-radius:4px;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;text-decoration:none}'+
'.tll-wn-row a{background:#C8325B;color:#fff;border:0}.tll-wn-row button{background:transparent;border:1.5px solid #0A0B14;color:#0A0B14}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-whats-new-v1'))return;var s=el('style');s.id='tll-whats-new-v1';s.textContent=CSS;document.head.appendChild(s);}
function ms(){return window.$memberstackDom;}
function local(){try{return JSON.parse(localStorage.getItem('tll-seen-new')||'[]');}catch(e){return[];}}
function saveLocal(a){try{localStorage.setItem('tll-seen-new',JSON.stringify(a));}catch(e){}}
function seenRemote(){var m=ms();if(!m||!m.getMemberJSON)return Promise.resolve({json:{},seen:[]});
  return m.getMemberJSON().then(function(j){var d=(j&&j.data)||{};return{json:d,seen:Array.isArray(d.tllSeenNew)?d.tllSeenNew:[]};}).catch(function(){return{json:{},seen:[]};});}
function markSeen(id){var l=local();if(l.indexOf(id)<0){l.push(id);saveLocal(l);}
  var m=ms();if(!m||!m.getMemberJSON||!m.updateMemberJSON)return;
  m.getMemberJSON().then(function(j){var d=(j&&j.data)||{};var s=Array.isArray(d.tllSeenNew)?d.tllSeenNew.slice():[];if(s.indexOf(id)<0)s.push(id);d.tllSeenNew=s.slice(-50);return m.updateMemberJSON({json:d});}).catch(function(){});}
function dots(n){
  [].forEach.call(document.querySelectorAll('.tll-wn-dot,.tll-wn-sr'),function(x){x.remove();});if(!n)return;
  var links=[].filter.call(document.querySelectorAll('a[href^="/account"]'),function(a){return ![].some.call(a.attributes,function(x){return x.name.indexOf('data-ms-')===0;})&&a.offsetParent!==null&&!a.closest('#tll-wn');});
  var a=links[0];if(!a)return;var d=el('span','tll-wn-dot');d.setAttribute('aria-hidden','true');a.appendChild(d);a.appendChild(el('span','tll-wn-sr',' ('+n+' new)'));}
function card(list,left){
  var box=document.getElementById('tll-wn');if(!list.length){if(box)box.remove();return;}
  if(!box){box=el('section','tll-wn');box.id='tll-wn';box.setAttribute('aria-label','New on That Layover Life');
    var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),anc=h&&(h.closest('section')||h.parentElement);
    if(anc&&anc.parentNode)anc.parentNode.insertBefore(box,anc.nextSibling);else main.insertBefore(box,main.firstChild);}
  box.textContent='';box.appendChild(el('p','tll-wn-k','New on That Layover Life'));
  list.forEach(function(e){var c=el('div','tll-wn-card');c.appendChild(el('h3','',e.title));if(e.line)c.appendChild(el('p','',e.line));
    var row=el('div','tll-wn-row');
    if(e.link){var a=el('a','',e.button);a.href=e.link;a.addEventListener('click',function(){markSeen(e.id);try{window.gtag&&gtag('event','whats_new_click',{division:'tll',entry:e.id});}catch(x){}});row.appendChild(a);}
    var b=el('button','','Got it');b.type='button';b.addEventListener('click',function(){markSeen(e.id);left(e.id);});row.appendChild(b);
    c.appendChild(row);box.appendChild(c);});}
function run(){
  var m=ms();if(!m||!m.getCurrentMember)return;
  m.getCurrentMember().then(function(r){
    var mem=r&&r.data;if(!mem)return null;
    return Promise.all([fetch(API).then(function(x){return x.ok?x.json():{entries:[]};}).catch(function(){return{entries:[]};}),seenRemote()]).then(function(v){
      var joined=Date.parse(mem.createdAt||mem.created_at||'')||0,seen=v[1].seen.concat(local());
      var fresh=(v[0].entries||[]).filter(function(e){return seen.indexOf(e.id)<0&&(!joined||!e.starts||Date.parse(e.starts)>=joined-864e5);});
      if(!fresh.length)return;css();
      function left(id){fresh=fresh.filter(function(e){return e.id!==id;});dots(fresh.length);if(P==='/account')card(fresh,left);}
      dots(fresh.length);if(P==='/account')card(fresh,left);
    });
  }).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1400);});else setTimeout(run,1400);
})();
/* src/site-layers/tll-note-footer-v1.js */
(function(){
var CSS='html.tll-note-footer #tll-note:not([data-open="true"]):not(:focus-within){opacity:0;visibility:hidden;pointer-events:none;transition:opacity 200ms ease,visibility 0s linear 200ms}'+
'@media (prefers-reduced-motion:reduce){html.tll-note-footer #tll-note:not([data-open="true"]):not(:focus-within){transition:none}}';
function style(){if(document.getElementById('tll-note-footer-v1'))return;var s=document.createElement('style');s.id='tll-note-footer-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
style();
function run(){
  if(!window.IntersectionObserver||!document.getElementById('tll-note'))return;
  var f=document.querySelector('footer[data-tll-canonical-footer]');
  if(!f){var all=document.querySelectorAll('footer');f=all.length?all[all.length-1]:null;}
  if(!f)return;
  new IntersectionObserver(function(es){for(var i=0;i<es.length;i++)document.documentElement.classList.toggle('tll-note-footer',es[i].isIntersecting);},{threshold:0}).observe(f);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
/* src/site-layers/tll-p0-closeout-v1.js */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
if(P==='/submit'||P==='/share-photos'){
  var clear=function(){[].forEach.call(document.querySelectorAll('input[placeholder],textarea[placeholder]'),function(i){
    if(/^\s*example text\s*$/i.test(i.getAttribute('placeholder')||''))i.setAttribute('placeholder','');});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clear);else clear();
  window.addEventListener('load',clear);setTimeout(clear,1500);
}
var outside=false,n=0;
(function ask(){
  if(typeof window.__tcfapi==='function'){try{window.__tcfapi('addEventListener',2,function(tc,ok){if(!ok||!tc)return;
    if(tc.gdprApplies===false)outside=true;else if(tc.gdprApplies===true)outside=false;});}catch(e){}}
  else if(++n<150)setTimeout(ask,100);
})();
/* window, capture: runs before the head script's document listener, and only steps in when outside is true. */
window.addEventListener('click',function(e){
  if(!outside||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target&&e.target.closest&&e.target.closest('a[data-tll-cookie-prefs]');if(!a)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(P!=='/cookies')location.assign('/cookies');else window.scrollTo(0,0);
},true);
})();
