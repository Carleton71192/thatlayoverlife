/* tll-story-translate-v1 (multilingual stories, Phase 1; Nancy's prompt, 29 Oct 2026). STAGED: not in the published bundle until
   Nancy approves the change log (handoff/MULTILINGUAL-P1-CHANGELOG-2026-10-29.md).
   On /stories/{slug}: the story body wrapper (.tll-story-body) gets lang = the story's language. When the writer allows translation
   and the story's language differs from the reader's, a small pill above the body offers "Read it in English" (named in the
   reader's language). A tap asks the Worker (POST /translate, slug + target only) for a labeled translation of the title, excerpt
   and body text. Images, captions, names, places and the sign-off stay as they are. "Show the original" puts back the exact
   original HTML. Never on load, never a redirect, never unlabeled; translated text is never in the page source.
   Hooks the template needs (proposed in the change log; nothing happens without them):
     [data-tll-story-lang]  hidden text bound to Story language (option name like "Español (es)")
     [data-tll-tr-allow]    hidden element shown only when Allow translation is on (conditional visibility)
     [data-tll-tr-author]   hidden element shown only when Author translation (English) is set
   Remembers the reader's chosen language in localStorage (try/catch). GA4 events translate_open and translate_original with
   source_lang and target_lang only. No data-ms-* element touched. */
(function(){
if(!/^\/stories\/[^/]+\/?$/.test(location.pathname))return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/translate';
var TARGETS=['en','es','pt-BR','da'];
var UI={
  en:{read:'Read it in English',orig:'Show the original',robot:'Translated by a robot. Some jokes may have missed their connection.',author:'Translated by the author.',wait:'Translating',err:'Our translator missed its connection. Try again in a minute.',done:'Showing the English translation.',back:'Showing the original.'},
  es:{read:'Leer en español',orig:'Ver el original',robot:'Traducido por un robot. Puede que algún chiste haya perdido su conexión.',author:'Traducido por el autor.',wait:'Traduciendo',err:'Nuestro traductor perdió su conexión. Inténtalo de nuevo en un minuto.',done:'Mostrando la traducción al español.',back:'Mostrando el original.'},
  'pt-BR':{read:'Ler em português',orig:'Ver o original',robot:'Traduzido por um robô. Algumas piadas podem ter perdido a conexão.',author:'Traduzido pelo autor.',wait:'Traduzindo',err:'Nosso tradutor perdeu a conexão. Tente de novo em um minuto.',done:'Mostrando a tradução em português.',back:'Mostrando o original.'},
  da:{read:'Læs på dansk',orig:'Vis originalen',robot:'Oversat af en robot. Nogle vittigheder kan have misset deres forbindelse.',author:'Oversat af forfatteren.',wait:'Oversætter',err:'Vores oversætter missede sin forbindelse. Prøv igen om et minut.',done:'Viser den danske oversættelse.',back:'Viser originalen.'}
};
var CSS=".tll-tr{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin:0 0 22px}"+
".tll-tr-pill{display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:8px 14px;border:1.5px solid #0A0B14;border-radius:999px;background:transparent;color:#0A0B14;"+
"font:600 12px/1.2 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:background-color 160ms cubic-bezier(.23,1,.32,1),color 160ms cubic-bezier(.23,1,.32,1),transform 120ms cubic-bezier(.23,1,.32,1)}"+
"@media (hover:hover) and (pointer:fine){.tll-tr-pill:hover{background:#0A0B14;color:#F7F1E8}}.tll-tr-pill:active{transform:scale(.97)}"+
".tll-tr-pill:focus-visible{outline:3px solid #C8325B;outline-offset:3px}"+
".tll-tr-pill[aria-busy=\"true\"]{opacity:.7;cursor:progress}"+
".tll-tr-label{flex-basis:100%;margin:0;font:italic 400 14px/1.5 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif;color:#5F5A54}"+
".tll-tr-label[hidden]{display:none}"+
".tll-tr-err{flex-basis:100%;margin:0;font:400 14px/1.5 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif;color:#9B2747}"+
".tll-tr-sr{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}"+
".tll-tr-busy .tll-body{position:relative;color:transparent!important}"+
".tll-tr-busy .tll-body *{visibility:hidden}"+
".tll-tr-busy .tll-body::after{content:'';position:absolute;inset:0;border-radius:4px;background:linear-gradient(90deg,#EFE8DC 0%,#F7F1E8 50%,#EFE8DC 100%);background-size:200% 100%;animation:tllTrShim 900ms linear infinite}"+
"@keyframes tllTrShim{from{background-position:200% 0}to{background-position:-200% 0}}"+
"@media (prefers-reduced-motion:reduce){.tll-tr-busy .tll-body::after{animation:none}.tll-tr-pill{transition:none}}";
function code(name){var s=String(name||'').trim();var m=s.match(/\(([A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})?)\)\s*$/)||s.match(/^([a-z]{2,3}(?:-[A-Z]{2})?)\b/);return m?m[1]:'';}
function base(c){return String(c||'').toLowerCase().split('-')[0];}
function match(c){var b=base(c);for(var i=0;i<TARGETS.length;i++){if(TARGETS[i].toLowerCase()===String(c).toLowerCase())return TARGETS[i];}for(var j=0;j<TARGETS.length;j++){if(base(TARGETS[j])===b)return TARGETS[j];}return '';}
function shown(el){return !!el&&!el.classList.contains('w-condition-invisible')&&getComputedStyle(el).display!=='none';}
function remembered(){try{return localStorage.getItem('tllTranslateTo')||'';}catch(e){return '';}}
function remember(t){try{localStorage.setItem('tllTranslateTo',t);}catch(e){}}
function event(name,src,tgt){try{if(typeof window.gtag==='function')window.gtag('event',name,{source_lang:src,target_lang:tgt});}catch(e){}}
function readerTarget(storyLang){
  var r=remembered();if(r&&TARGETS.indexOf(r)>-1&&base(r)!==base(storyLang))return r;
  var langs=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'en']);
  for(var i=0;i<langs.length;i++){var m=match(langs[i]);if(m){return base(m)===base(storyLang)?'':m;}}
  return base(storyLang)==='en'?'':'en';
}
function run(){
  var wrap=document.querySelector('.tll-story-body');if(!wrap||wrap.dataset.tllTr)return;
  var langEl=document.querySelector('[data-tll-story-lang]');
  var storyLang=code(langEl&&langEl.textContent)||'en';
  wrap.setAttribute('lang',storyLang);wrap.dataset.tllTr='1';
  if(!shown(document.querySelector('[data-tll-tr-allow]')))return;
  var target=readerTarget(storyLang);if(!target)return;
  var body=wrap.querySelector('.tll-body');if(!body)return;
  var titleEl=document.querySelector('.tll-story-title'),exEl=document.querySelector('.tll-story-excerpt');
  var orig={body:body.innerHTML,title:titleEl?titleEl.innerHTML:null,excerpt:exEl?exEl.innerHTML:null,titleLang:titleEl&&titleEl.getAttribute('lang'),exLang:exEl&&exEl.getAttribute('lang')};
  var t=UI[target]||UI.en;
  if(!document.getElementById('tll-story-translate-v1')){var s=document.createElement('style');s.id='tll-story-translate-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  var bar=document.createElement('div');bar.className='tll-tr';
  var pill=document.createElement('button');pill.type='button';pill.className='tll-tr-pill';pill.textContent=t.read;pill.setAttribute('lang',target);
  var label=document.createElement('p');label.className='tll-tr-label';label.hidden=true;label.setAttribute('lang',target);
  var live=document.createElement('p');live.className='tll-tr-sr';live.setAttribute('aria-live','polite');
  bar.appendChild(pill);bar.appendChild(label);bar.appendChild(live);
  wrap.insertBefore(bar,wrap.firstChild);
  var translated=false,cache=null,busy=false;
  function setLang(el,l){if(el){if(l)el.setAttribute('lang',l);else el.removeAttribute('lang');}}
  function showOriginal(){body.innerHTML=orig.body;if(titleEl&&orig.title!=null)titleEl.innerHTML=orig.title;if(exEl&&orig.excerpt!=null)exEl.innerHTML=orig.excerpt;
    wrap.setAttribute('lang',storyLang);setLang(titleEl,orig.titleLang);setLang(exEl,orig.exLang);
    translated=false;pill.textContent=t.read;label.hidden=true;live.textContent=t.back;event('translate_original',storyLang,target);}
  function showTranslation(d){
    body.innerHTML=d.bodyHtml;
    if(d.title&&titleEl){titleEl.textContent=d.title;setLang(titleEl,target);}
    if(d.excerpt&&exEl){exEl.textContent=d.excerpt;setLang(exEl,target);}
    wrap.setAttribute('lang',target);translated=true;pill.textContent=t.orig;
    label.textContent=d.by==='author'?t.author:t.robot;label.hidden=false;live.textContent=t.done;
    remember(target);event('translate_open',storyLang,target);}
  function error(){var e=bar.querySelector('.tll-tr-err');if(!e){e=document.createElement('p');e.className='tll-tr-err';e.setAttribute('role','status');e.setAttribute('lang',target);bar.appendChild(e);}e.textContent=t.err;}
  pill.addEventListener('click',function(){
    if(busy)return;var e=bar.querySelector('.tll-tr-err');if(e)e.remove();
    if(translated){showOriginal();return;}
    if(cache){showTranslation(cache);return;}
    busy=true;pill.setAttribute('aria-busy','true');live.textContent=t.wait;wrap.classList.add('tll-tr-busy');
    var slug=location.pathname.replace(/\/+$/,'').split('/').pop();
    fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',body:JSON.stringify({slug:slug,target:target})})
      .then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d};});})
      .then(function(x){if(!x.ok||!x.d||!x.d.ok||typeof x.d.bodyHtml!=='string')throw new Error('no');cache=x.d;showTranslation(x.d);})
      .catch(function(){error();})
      .then(function(){busy=false;pill.removeAttribute('aria-busy');wrap.classList.remove('tll-tr-busy');});
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
