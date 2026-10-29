/* tll-submit-lang-v1 (multilingual stories, Phase 1; Nancy's prompt, 29 Oct 2026). STAGED: not in the published bundle until Nancy
   approves the change log. On /submit, step 1 of the "Story submission" form (form[data-tll-form="submit-story"]) gets:
     "I'm writing in" (required; name story-language; BCP-47 code), pre-selected from Chrome's Language Detector on the writer's
       own text when the browser has it (desktop Chrome), otherwise the browser language, otherwise English. The writer can
       always change it; once they do, the guess never overrides them.
     "Let readers see a translation of my story." (name allow-translation; on by default) with the line under it.
     For a story not in English, a collapsed optional box: "Got your own English version? Paste it here."
       (name author-translation-english).
   The fields travel with the existing Webflow form submission. Nothing rewrites the writer's text; no AI writes anything.
   Existing field names unchanged; no data-ms-* element touched. */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var LANGS=[['en','English'],['es','Español'],['pt-BR','Português (Brasil)'],['da','Dansk'],['de','Deutsch'],['fr','Français'],['it','Italiano'],['nl','Nederlands'],['sv','Svenska'],['nb','Norsk bokmål'],['ja','日本語'],['other','Other']];
var CSS=".tll-sl{margin:0 0 22px}.tll-sl label{display:block}"+
".tll-sl-k{display:block;margin:0 0 6px;font:600 12px/1.3 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:#0A0B14}"+
".tll-sl-k b{color:#C8325B;font-weight:600;margin-left:8px}"+
".tll-sl select,.tll-sl input[type=text],.tll-sl textarea{width:100%;box-sizing:border-box;min-height:48px;padding:10px 12px;border:1.5px solid #E0DACE;border-radius:4px;background:#FDF9F3;font:400 16px/1.4 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif;color:#0A0B14}"+
".tll-sl textarea{min-height:160px}"+
".tll-sl select:focus,.tll-sl input:focus,.tll-sl textarea:focus{outline:3px solid #C8325B;outline-offset:1px}"+
".tll-sl-help{margin:6px 0 0;font:400 14px/1.45 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif;color:#5F5A54}"+
".tll-sl-check{display:flex!important;gap:10px;align-items:flex-start;cursor:pointer;min-height:44px}"+
".tll-sl-check input{width:20px;height:20px;margin:2px 0 0;accent-color:#C8325B;flex:0 0 auto}"+
".tll-sl-check span{font:600 16px/1.4 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif;color:#0A0B14}"+
".tll-sl details summary{cursor:pointer;min-height:44px;display:flex;align-items:center;font:600 15px/1.4 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif;color:#067A79}"+
".tll-sl [hidden]{display:none!important}";
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function guessFromBrowser(){var l=(navigator.languages&&navigator.languages[0])||navigator.language||'en';var b=l.toLowerCase().split('-')[0];
  if(b==='pt')return 'pt-BR';if(b==='no'||b==='nb'||b==='nn')return 'nb';for(var i=0;i<LANGS.length;i++)if(LANGS[i][0].toLowerCase()===b)return LANGS[i][0];return 'en';}
function fromDetected(code){var b=String(code||'').toLowerCase().split('-')[0];if(b==='pt')return 'pt-BR';if(b==='no'||b==='nn')return 'nb';
  for(var i=0;i<LANGS.length;i++)if(LANGS[i][0].toLowerCase()===b)return LANGS[i][0];return '';}
function run(){
  var form=document.querySelector('form[data-tll-form="submit-story"]');if(!form||form.dataset.tllSl)return;form.dataset.tllSl='1';
  var step=form.querySelector('[data-tll-step="1"]')||form;
  if(!document.getElementById('tll-submit-lang-v1')){var s=document.createElement('style');s.id='tll-submit-lang-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  var box=el('div','tll-sl');
  var lab=el('label');lab.appendChild(el('span','tll-sl-k',"I'm writing in"));lab.querySelector('.tll-sl-k').appendChild(el('b','','Required'));
  var sel=document.createElement('select');sel.name='story-language';sel.setAttribute('data-name','story-language');sel.required=true;
  LANGS.forEach(function(l){var o=document.createElement('option');o.value=l[0];o.textContent=l[1];if(l[0]!=='other')o.lang=l[0];sel.appendChild(o);});
  lab.appendChild(sel);box.appendChild(lab);
  var other=el('label');other.hidden=true;other.appendChild(el('span','tll-sl-k','Language code'));var oin=document.createElement('input');oin.type='text';oin.name='story-language-other';oin.setAttribute('data-name','story-language-other');oin.placeholder='For example: pl, tr, ko';oin.maxLength=12;other.appendChild(oin);box.appendChild(other);
  box.appendChild(el('p','tll-sl-help','Write it in whatever language it comes out in. We keep your words exactly as you wrote them.'));
  var cons=el('label','tll-sl-check');var cb=document.createElement('input');cb.type='checkbox';cb.name='allow-translation';cb.setAttribute('data-name','allow-translation');cb.value='yes';cb.checked=true;
  cons.appendChild(cb);cons.appendChild(el('span','','Let readers see a translation of my story.'));
  var consWrap=el('div');consWrap.style.marginTop='16px';consWrap.appendChild(cons);consWrap.appendChild(el('p','tll-sl-help','Your words stay exactly as you wrote them. Translations are labeled and the original is one tap away.'));box.appendChild(consWrap);
  var det=document.createElement('details');det.style.marginTop='12px';var sum=document.createElement('summary');sum.textContent='Got your own English version? Paste it here.';det.appendChild(sum);
  var ta=document.createElement('textarea');ta.name='author-translation-english';ta.setAttribute('data-name','author-translation-english');ta.setAttribute('aria-label','Your English version (optional)');ta.lang='en';
  det.appendChild(ta);det.appendChild(el('p','tll-sl-help','Optional. English readers see your version, labeled "Translated by the author."'));box.appendChild(det);
  var anchor=step.querySelector('legend,h2,h3');if(anchor&&anchor.nextSibling)anchor.parentNode.insertBefore(box,anchor.nextSibling);else step.insertBefore(box,step.firstChild);
  var touched=false;
  function sync(){other.hidden=sel.value!=='other';oin.required=sel.value==='other';det.hidden=/^en/.test(sel.value);}
  sel.addEventListener('change',function(){touched=true;sync();});
  sel.value=guessFromBrowser();sync();
  /* Chrome's on-device Language Detector (desktop Chrome 138+): a better guess once the writer has written a few lines. */
  var body=form.querySelector('textarea[name="body"]'),excerpt=form.querySelector('textarea[name="excerpt"]'),t=0;
  if(!('LanguageDetector' in self))return;
  function detect(){var txt=((excerpt&&excerpt.value)||'')+' '+((body&&body.value)||'');if(touched||txt.trim().length<80)return;
    Promise.resolve().then(function(){return self.LanguageDetector.availability();}).then(function(a){if(a==='unavailable')return null;return self.LanguageDetector.create();})
      .then(function(d){return d?d.detect(txt.slice(0,2000)):null;}).then(function(r){if(!r||!r[0]||touched)return;var top=r[0];if(top.confidence<0.7)return;var c=fromDetected(top.detectedLanguage);if(c){sel.value=c;sync();}})
      .catch(function(){});}
  [body,excerpt].forEach(function(x){if(x)x.addEventListener('input',function(){clearTimeout(t);t=setTimeout(detect,1200);});});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();
