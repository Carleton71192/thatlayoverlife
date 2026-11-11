/* tll-site-layers-v16 chunk submit-preview: loaded by the core loader on paths matching /^\/submit$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-submit-ux-v1.js */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/submit')return;
var WORDS={bold:'Bold',italic:'Italic',h2:'Subhead',blockquote:'Quote',createLink:'Link'};
var CSS=".tsv5-tools .tll-su-w{font:600 13px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;letter-spacing:0;margin-left:6px;text-transform:none}"+
".tsv5-tools .tsv5-tool{width:auto!important;min-width:44px;padding:0 10px!important;display:inline-flex;align-items:center}"+
".tsv5-tools{flex-wrap:wrap;gap:6px}"+
".tll-su-hint{margin:6px 0 0;font-size:13px;line-height:1.4;color:#5F5A54}";
function run(){var t=document.querySelector('.tsv5-tools');if(!t||t.dataset.tllSu)return;t.dataset.tllSu='1';
  var s=document.createElement('style');s.id='tll-submit-ux-v1';s.textContent=CSS;document.head.appendChild(s);
  [].forEach.call(t.querySelectorAll('.tsv5-tool'),function(b){var k=b.getAttribute('data-arg')||b.getAttribute('data-cmd'),w=WORDS[k];if(!w)return;
    var g=b.firstChild;if(g&&g.nodeType===3){var sp=document.createElement('span');sp.setAttribute('aria-hidden','true');sp.textContent=g.nodeValue;b.replaceChild(sp,g);}
    var l=document.createElement('span');l.className='tll-su-w';l.textContent=w;b.appendChild(l);});
  var h=document.createElement('p');h.className='tll-su-hint';h.textContent='Put the cursor on a line and tap Subhead to make it a heading.';t.insertAdjacentElement('afterend',h);}
var HINTS={'pull-quote':['One or two sentences copied word for word from your story: the line you would want someone to screenshot. Leave blank and the editor suggests three.','e.g. "The smell alone was enough to bring in the queues."'],
 'reader-question':['One question for readers, about your trip or theirs. It closes the story and invites replies.','e.g. Which food festival would you travel for?'],
 'sign-off':['Your last line, in your voice: a mood, then your name.','e.g. Still raising glasses. Nancy'],
 'body':['Start anywhere. The middle is fine. Put each subhead on its own line and the editor sets it as a heading. Want a photo in a certain spot? Add it in Photos and write [photo: what it shows] on its own line where it goes.','']};
function hints(){[].forEach.call(document.querySelectorAll('form textarea[name],form input[name]'),function(i){var h=HINTS[i.name];if(!h||i.dataset.tllSu)return;i.dataset.tllSu='1';
  var lab=i.closest('label'),sp=lab&&lab.querySelector('.tll-pen-helptext');if(sp&&!(i.name==='body'&&/Autosaves/.test(sp.textContent)&&false))sp.textContent=i.name==='body'?h[0]+' '+((sp.textContent.match(/Autosaves[^.]*\.(?: Drafts[^.]*\.)?/)||[''])[0]):h[0];
  if(h[1]&&!i.getAttribute('placeholder'))i.setAttribute('placeholder',h[1]);});}
/* tester Shahzain: "A human looks within 48 hours" reads oddly; the success message (a plain div the API cannot edit) now says "reviews it". */
/* 11 Nov 2026 (Nancy: one story about review, a human reads every story before it goes live): the two link-out lines sit in
   an HTML form the API cannot edit, so they are brought into line here. */
function looks(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){var v=t.nodeValue;if(!/48 hours/.test(v))continue;
  v=v.replace(/A human looks within 48 hours/g,'A human reads it, usually within 48 hours').replace(/A human reviews it within 48 hours/g,'A human reads it before it goes live, usually within 48 hours');
  if(v!==t.nodeValue)t.nodeValue=v;}}
function all(){run();hints();looks();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',all);else all();
})();
/* src/site-layers/tll-linkout-preview-v1.js */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/link-preview?url=';
var CSS=".tll-lp{margin:10px 0 18px;border:1.5px solid #E0DACE;border-radius:4px;background:#FDF9F3;overflow:hidden;font:400 14px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}"+
".tll-lp[hidden]{display:none!important}"+
".tll-lp-wait,.tll-lp-err{padding:12px 14px;color:#5F5A54}"+
".tll-lp-err{color:#9B2747}"+
".tll-lp-card{display:grid;grid-template-columns:168px minmax(0,1fr);gap:0}"+
".tll-lp-card.tll-lp-noimg{grid-template-columns:1fr}"+
".tll-lp-img{display:block;width:100%;height:100%;min-height:112px;object-fit:cover;background:#E9E2D6}"+
".tll-lp-body{padding:12px 14px;min-width:0}"+
".tll-lp-site{font:600 11px/1.4 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#067A79;margin:0 0 4px}"+
".tll-lp-title{font:700 16px/1.25 'IBM Plex Sans Condensed',system-ui,sans-serif;margin:0 0 4px;overflow-wrap:anywhere}"+
".tll-lp-desc{margin:0;color:#3a3a3a;overflow-wrap:anywhere}"+
".tll-lp-foot{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;padding:10px 14px;border-top:1px solid #E0DACE;font-size:13px;color:#5F5A54}"+
".tll-lp-foot label{display:inline-flex;align-items:center;gap:8px;color:#0A0B14;cursor:pointer;min-height:32px}"+
".tll-lp-foot input{width:18px;height:18px;accent-color:#C8325B;margin:0}"+
"@media (max-width:560px){.tll-lp-card{grid-template-columns:1fr}.tll-lp-img{height:180px}}";
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function hidden(form,name){var i=form.querySelector('input[type="hidden"][name="'+name+'"]');if(!i){i=document.createElement('input');i.type='hidden';i.name=name;i.setAttribute('data-name',name);form.appendChild(i);}return i;}
function setVal(input,v){if(!input||input.value.trim())return false;input.value=v;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));return true;}
function run(){
  var form=document.querySelector('form[data-tll-form="link-out-story"]');if(!form||form.dataset.tllLp)return;
  var url=form.querySelector('input[name="external-url"]');if(!url)return;
  form.dataset.tllLp='1';
  if(!document.getElementById('tll-linkout-preview-v1')){var s=document.createElement('style');s.id='tll-linkout-preview-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  var title=form.querySelector('input[name="field-5"]'),summary=form.querySelector('input[name="summary"]');
  var ogImg=hidden(form,'og-image'),ogSite=hidden(form,'og-site'),ogSize=hidden(form,'og-image-size');
  var box=el('div','tll-lp');box.hidden=true;box.setAttribute('aria-live','polite');
  var field=url.closest('label')||url;field.insertAdjacentElement('afterend',box);
  var last='',timer=0,seq=0;
  function clear(){ogImg.value='';ogSite.value='';ogSize.value='';}
  function show(node){box.textContent='';box.appendChild(node);box.hidden=false;}
  function look(){
    var v=(url.value||'').trim();if(v===last)return;last=v;clear();
    if(!/^https?:\/\/[^\s/]+\.[^\s]+$/i.test(v)){box.hidden=true;return;}
    var my=++seq;show(el('div','tll-lp-wait','Reading the link…'));
    fetch(API+encodeURIComponent(v),{credentials:'omit'}).then(function(r){
      if(r.status===404||r.status===405)return null; /* the Worker route is not live yet: stay quiet */
      return r.json().catch(function(){return null;});
    }).then(function(d){
      if(my!==seq)return;
      if(!d){box.hidden=true;return;}
      if(!d.ok){show(el('div','tll-lp-err',(d.reason||'That link could not be read.')+' You can still send it: add a title and a one-line summary.'));return;}
      var card=el('div','tll-lp-card'+(d.image?'':' tll-lp-noimg'));
      if(d.image){var im=el('img','tll-lp-img');im.src=d.image;im.alt=d.imageAlt||'';im.loading='lazy';
        im.addEventListener('error',function(){im.remove();card.classList.add('tll-lp-noimg');ogImg.value='';use&&(use.checked=false,use.disabled=true);});card.appendChild(im);}
      var body=el('div','tll-lp-body');body.appendChild(el('p','tll-lp-site',d.siteName||''));
      if(d.title)body.appendChild(el('p','tll-lp-title',d.title));if(d.description)body.appendChild(el('p','tll-lp-desc',d.description));
      card.appendChild(body);
      var wrap=el('div');wrap.appendChild(card);
      var foot=el('div','tll-lp-foot'),use=null;
      if(d.image){var lab=el('label');use=el('input');use.type='checkbox';use.checked=true;lab.appendChild(use);lab.appendChild(document.createTextNode('Use this photo from the article'));foot.appendChild(lab);
        ogImg.value=d.image;ogSize.value=(d.imageWidth||'')+'x'+(d.imageHeight||'');
        use.addEventListener('change',function(){ogImg.value=use.checked?d.image:'';});}
      else if(d.imageNote){foot.appendChild(el('span','',d.imageNote+' Your card shows the country instead.'));}
      ogSite.value=d.siteName||'';
      var filled=[];if(title&&d.title&&setVal(title,d.title))filled.push('Title');if(summary&&d.description&&setVal(summary,d.description.slice(0,200)))filled.push('One-line summary');
      if(filled.length)foot.appendChild(el('span','',filled.join(' and ')+' filled from the article. Change anything.'));
      if(foot.childNodes.length)wrap.appendChild(foot);
      show(wrap);
    }).catch(function(){if(my===seq)box.hidden=true;});
  }
  function soon(){clearTimeout(timer);timer=setTimeout(look,500);}
  url.addEventListener('input',soon);url.addEventListener('paste',function(){setTimeout(look,0);});url.addEventListener('change',look);url.addEventListener('blur',look);
  if(url.value)look();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();
/* src/site-layers/tll-linkout-summary-v1.js */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/link-summary?url=';
var CSS=".tll-ls{margin:-8px 0 18px;border:1.5px solid #E0DACE;border-top:0;border-radius:0 0 4px 4px;background:#fff;padding:12px 14px;font:400 15px/1.5 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}"+
".tll-ls[hidden],.tll-own[hidden]{display:none!important}"+
".tll-ls-k{font:600 11px/1.4 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#067A79;margin:0 0 6px}"+
".tll-ls p{margin:0}.tll-ls-wait{color:#5F5A54}"+
".tll-own{margin:0 0 18px;padding:12px 14px;border:1.5px dashed #E0DACE;border-radius:4px;font:400 14px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54}"+
".tll-own b{display:block;color:#0A0B14;font-weight:600;margin:0 0 4px}.tll-own input{display:block;margin-top:8px;font:inherit;max-width:100%}";
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function run(){
  var form=document.querySelector('form[data-tll-form="link-out-story"]');if(!form||form.dataset.tllLs)return;
  var url=form.querySelector('input[name="external-url"]'),lp=form.querySelector('.tll-lp');if(!url||!lp)return;
  form.dataset.tllLs='1';
  if(!document.getElementById('tll-linkout-summary-v1')){var s=document.createElement('style');s.id='tll-linkout-summary-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  var box=el('div','tll-ls');box.hidden=true;box.setAttribute('aria-live','polite');lp.insertAdjacentElement('afterend',box);
  var own=el('div','tll-own');own.hidden=true;
  own.appendChild(el('b','','Your own photo (optional)'));
  own.appendChild(document.createTextNode("The article has no photo we can use. Add one of yours, or leave it and the card shows the country."));
  var file=form.querySelector('input[type="file"][name="hero-image"]');
  if(!file){file=el('input');file.type='file';file.name='hero-image';file.setAttribute('data-name','hero-image');file.accept='image/jpeg,image/png,image/webp,image/heic';}
  own.appendChild(file);box.insertAdjacentElement('afterend',own);
  var ogImg=form.querySelector('input[name="og-image"]');
  var last='',seq=0;
  function photoCheck(){
    var reading=!lp.hidden&&lp.querySelector('.tll-lp-wait');
    own.hidden=lp.hidden||!!reading||!!(ogImg&&ogImg.value);
  }
  function summary(){
    var v=(url.value||'').trim();
    if(lp.hidden||lp.querySelector('.tll-lp-wait')||!/^https?:\/\//i.test(v)){if(lp.hidden){box.hidden=true;last='';}return;}
    if(v===last)return;last=v;var my=++seq;
    box.textContent='';box.appendChild(el('p','tll-ls-k','Summary by AI, from the linked article'));box.appendChild(el('p','tll-ls-wait','Reading the article…'));box.hidden=false;
    fetch(API+encodeURIComponent(v),{credentials:'omit'}).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;}).then(function(d){
      if(my!==seq)return;
      if(!d||!d.ok||!d.summary){box.hidden=true;return;}
      box.textContent='';box.appendChild(el('p','tll-ls-k',d.label||'Summary by AI, from the linked article'));box.appendChild(el('p','',d.summary));box.hidden=false;
    });
  }
  function tick(){photoCheck();summary();}
  new MutationObserver(tick).observe(lp,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  form.addEventListener('change',function(e){if(e.target&&e.target.type==='checkbox')setTimeout(photoCheck,0);});
  tick();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1600);setTimeout(run,3500);
})();
/* src/site-layers/tll-submit-gallery-v1.js */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var FORM='form[data-tll-form="submit-story"]';
var CSS=
".tll-sg{margin:10px 0 4px}"+
".tll-sg-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:10px;margin:0 0 10px;padding:0;list-style:none}"+
".tll-sg-row:empty{display:none}"+
".tll-sg-item{position:relative;margin:0;border:1px solid #E0DACE;border-radius:8px;overflow:hidden;background:#FBF7F0;aspect-ratio:1/1}"+
".tll-sg-item img{display:block;width:100%;height:100%;object-fit:cover}"+
".tll-sg-name{display:flex;align-items:center;justify-content:center;height:100%;padding:8px;box-sizing:border-box;font:400 12px/1.3 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54;text-align:center;overflow-wrap:anywhere}"+
".tll-sg-rm{position:absolute;top:4px;right:4px;min-width:44px;min-height:32px;padding:0 10px;border:0;border-radius:999px;background:rgba(10,11,20,.82);color:#fff;font:600 12px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;cursor:pointer}"+
".tll-sg-rm:focus-visible,.tll-sg-add:focus-visible{outline:3px solid #C8325B;outline-offset:2px}"+
".tll-sg-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px}"+
".tll-sg-count{font:600 14px/1.4 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}"+
".tll-sg-add{min-height:44px;padding:0 18px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;cursor:pointer}"+
".tll-sg-add[hidden]{display:none}"+
".tll-sg-help{margin:6px 0 0;font:400 13px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54}"+
".tll-sg-note{margin:6px 0 0;font:400 13px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#C8325B}"+
".tll-sg-note:empty{display:none}"+
".tll-sg-hero{display:flex;gap:12px;align-items:center;margin:10px 0 4px}"+
".tll-sg-hero[hidden]{display:none}"+
".tll-sg-hero .tll-sg-item{width:100%;aspect-ratio:16/9}"+
/* captions and placement (31 Oct 2026) */
".tll-cp{margin:12px 0 4px;padding:0;list-style:none;display:grid;gap:10px}.tll-cp:empty{display:none}"+
".tll-cp-h{margin:14px 0 4px;font:600 11px/1.4 'JetBrains Mono',ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79}"+
".tll-cp li{display:grid;grid-template-columns:56px minmax(0,1fr);gap:6px 12px;align-items:start}"+
".tll-cp img,.tll-cp .tll-cp-x{grid-row:span 2;width:56px;height:56px;object-fit:cover;border-radius:6px;background:#FBF7F0;font:400 11px/1.2 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54;overflow:hidden}"+
".tll-cp input,.tll-cp select,.tll-cap-cover{width:100%;min-height:44px;padding:8px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;font:400 15px/1.3 'IBM Plex Sans Condensed',system-ui,sans-serif;box-sizing:border-box}"+
".tll-cp label,.tll-cap-lab{display:block;font:600 13px/1.3 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}"+
".tll-cp small,.tll-cap-help{display:block;margin:2px 0 0;font:400 12px/1.4 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54}"+
/* autosave line */
"html body .tllst-save{font:400 13px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif!important;letter-spacing:0!important;text-transform:none!important;color:#5F5A54!important;margin-top:10px!important}"+
"html body .tllst-save b{font-weight:600;color:#0A0B14}"+
"html body .tllst-save .tll-sg-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#067A79;margin-right:8px;vertical-align:1px}";

function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function key(f){return [f.name,f.size].join('|');}   /* same name and size = same photo; pickers can give a fresh time on each pick */
var canSet=(function(){try{return typeof DataTransfer==='function'&&!!new DataTransfer().items;}catch(e){return false;}})();
function setFiles(inp,list){if(!canSet)return false;try{var dt=new DataTransfer();list.forEach(function(f){dt.items.add(f);});inp.files=dt.files;return true;}catch(e){return false;}}
function thumb(f,onRemove,label){
  var li=el('li','tll-sg-item');var url='';
  if(/^image\//.test(f.type)){url=URL.createObjectURL(f);var i=document.createElement('img');i.alt='';i.src=url;
    i.onerror=function(){i.remove();li.insertBefore(el('span','tll-sg-name',f.name),li.firstChild);};li.appendChild(i);}
  else li.appendChild(el('span','tll-sg-name',f.name));
  if(onRemove){var b=el('button','tll-sg-rm','Remove');b.type='button';b.setAttribute('aria-label','Remove '+(label||f.name));b.addEventListener('click',function(){if(url)URL.revokeObjectURL(url);onRemove();});li.appendChild(b);}
  li.__url=url;return li;
}
function clearRow(row){[].forEach.call(row.children,function(li){if(li.__url)URL.revokeObjectURL(li.__url);});row.textContent='';}

/* Captions and placement (31 Oct 2026, Roberta: "Could you add captions or choose where each photo sits?").
   Each gallery photo gets an optional caption (200 characters) and a "Where it goes" menu built from the headings the writer typed
   (a short line on its own with no closing punctuation), or "Gallery at the end". The choices travel in one hidden field,
   photo-plan, as JSON in gallery order: [{"n":1,"name":"IMG_2.jpg","caption":"...","after":"The Art of Arriving First"}].
   The cover photo gets a caption field, cover-caption. The builder copies them to the story's Photo placements row. */
var CAPMAX=200;
function headings(form){var b=form.querySelector('textarea[name="body"]');if(!b)return[];var seen={},out=[];
  String(b.value||'').split(/\n/).forEach(function(l){var t=l.trim();if(t.length<3||t.length>90||/[.!?…:;,"”')\]]$/.test(t)||t.split(/\s+/).length>14||seen[t])return;seen[t]=1;out.push(t);});return out;}
function planField(form){var h=form.querySelector('input[name="photo-plan"]');if(!h){h=document.createElement('input');h.type='hidden';h.name='photo-plan';h.setAttribute('data-name','photo-plan');form.appendChild(h);}return h;}
function gallery(form){
  var inp=form.querySelector('input[type="file"][name="photo-gallery"]');if(!inp||inp.__tllSg)return;inp.__tllSg=1;
  inp.multiple=true;
  var field=inp.closest('label')||inp;           /* the list sits outside the label so a tap on Remove never opens the picker */
  var lab=field.querySelector&&field.querySelector('.tll-pen-label');
  var m=lab&&/up to\s*(\d+)/i.exec(lab.textContent);var MAX=m?parseInt(m[1],10):12;
  var kept=[];
  var box=el('div','tll-sg');var row=el('ul','tll-sg-row');row.setAttribute('aria-label','Gallery photos chosen');
  var bar=el('div','tll-sg-bar');var count=el('span','tll-sg-count');count.setAttribute('aria-live','polite');
  var add=el('button','tll-sg-add','Add more photos');add.type='button';add.addEventListener('click',function(){inp.click();});
  bar.appendChild(count);bar.appendChild(add);
  var note=el('p','tll-sg-note');note.setAttribute('role','status');
  var help=el('p','tll-sg-help',canSet?'Pick several photos at once, or add more with another pick. They upload when you send.'
                                      :'Pick all your gallery photos at once: hold one photo, then tap the others. They upload when you send.');
  var capH=el('p','tll-cp-h','Captions and placement (optional)');capH.hidden=true;var plan=el('ul','tll-cp');var meta={};
  box.appendChild(row);box.appendChild(bar);box.appendChild(note);box.appendChild(help);box.appendChild(capH);box.appendChild(plan);
  field.parentNode.insertBefore(box,field.nextSibling);
  var hidden=planField(form);
  function save(){var out=[];kept.forEach(function(f,i){var m=meta[key(f)]||{};if((m.caption||'').trim()||(m.after&&m.after!=='gallery'))out.push({n:i+1,name:f.name,caption:(m.caption||'').trim().slice(0,CAPMAX),after:m.after&&m.after!=='gallery'?m.after:'gallery'});});hidden.value=out.length?JSON.stringify(out):'';}
  function fill(sel,cur){var hs=headings(form);sel.textContent='';var o=document.createElement('option');o.value='gallery';o.textContent='Gallery at the end';sel.appendChild(o);
    hs.forEach(function(h){var x=document.createElement('option');x.value=h;x.textContent='After: '+h;sel.appendChild(x);});
    if(cur&&cur!=='gallery'&&hs.indexOf(cur)<0){var y=document.createElement('option');y.value=cur;y.textContent='After: '+cur;sel.appendChild(y);}sel.value=cur||'gallery';}
  function renderPlan(){plan.textContent='';capH.hidden=!kept.length;
    kept.forEach(function(f,i){var k=key(f),m=meta[k]||(meta[k]={caption:'',after:'gallery'});var li=document.createElement('li');
      var th;if(/^image\//.test(f.type)){th=document.createElement('img');th.alt='';th.src=URL.createObjectURL(f);th.onload=function(){URL.revokeObjectURL(th.src);};}else th=el('span','tll-cp-x',f.name);li.appendChild(th);
      var id='tll-cp-'+i;var c=el('div');var lb=el('label',null,'Caption for photo '+(i+1));lb.setAttribute('for',id);var inp2=document.createElement('input');inp2.id=id;inp2.type='text';inp2.maxLength=CAPMAX;inp2.value=m.caption;inp2.placeholder='What are we looking at?';
      var cnt=el('small',null,'');function cc(){cnt.textContent=(inp2.value.length)+' of '+CAPMAX;}cc();inp2.addEventListener('input',function(){m.caption=inp2.value;cc();save();});c.appendChild(lb);c.appendChild(inp2);c.appendChild(cnt);li.appendChild(c);
      var d=el('div');var lb2=el('label',null,'Where it goes');lb2.setAttribute('for',id+'-w');var sel=document.createElement('select');sel.id=id+'-w';fill(sel,m.after);
      sel.addEventListener('focus',function(){fill(sel,m.after);});sel.addEventListener('change',function(){m.after=sel.value;save();});d.appendChild(lb2);d.appendChild(sel);li.appendChild(d);plan.appendChild(li);});
    save();}
  function render(){
    clearRow(row);
    kept.forEach(function(f,i){row.appendChild(thumb(f,function(){kept.splice(i,1);setFiles(inp,kept);note.textContent='';render();},'photo '+(i+1)+' of '+kept.length+', '+f.name));});
    count.textContent=kept.length?(kept.length+' of '+MAX+' photo'+(MAX===1?'':'s')+' chosen'):'No gallery photos yet';
    add.textContent=kept.length?'Add more photos':'Choose photos';
    add.hidden=!canSet||kept.length>=MAX;
    renderPlan();
  }
  inp.addEventListener('change',function(){
    var picked=[].slice.call(inp.files||[]);
    if(!canSet){kept=picked.slice(0,MAX);note.textContent=picked.length>MAX?'Only the first '+MAX+' photos are kept.':'';render();return;}
    if(!picked.length){setFiles(inp,kept);render();return;}   /* picker closed with nothing: keep what was chosen */
    var seen={};kept.forEach(function(f){seen[key(f)]=1;});
    var added=0,skipped=0,dropped=0;
    picked.forEach(function(f){if(seen[key(f)]){skipped++;return;}if(kept.length>=MAX){dropped++;return;}seen[key(f)]=1;kept.push(f);added++;});
    setFiles(inp,kept);
    note.textContent=dropped?('The gallery holds '+MAX+' photos. '+dropped+' photo'+(dropped===1?' was':'s were')+' not added.'):(skipped&&!added?'That photo is already in the gallery.':'');
    render();
  });
  render();
}

function hero(form){
  var inp=form.querySelector('input[type="file"][name="hero-image"]');if(!inp||inp.__tllSg)return;inp.__tllSg=1;
  var field=inp.closest('label')||inp;
  var box=el('div','tll-sg-hero');box.hidden=true;var row=el('ul','tll-sg-row');row.style.cssText='margin:0;display:block;flex:0 0 120px;width:120px';
  var txt=el('p','tll-sg-help','This is your cover photo. Add more photos in the gallery below.');txt.style.margin='0';
  var wrap=el('div');wrap.appendChild(txt);
  if(!form.querySelector('input[name="cover-caption"]')){var cl=el('label','tll-cap-lab','Cover caption (optional)');cl.setAttribute('for','tll-cap-cover');cl.style.marginTop='8px';
    var ci=document.createElement('input');ci.type='text';ci.id='tll-cap-cover';ci.name='cover-caption';ci.setAttribute('data-name','cover-caption');ci.className='tll-cap-cover';ci.maxLength=CAPMAX;ci.placeholder='What are we looking at?';
    var ch=el('small','tll-cap-help','0 of '+CAPMAX);ci.addEventListener('input',function(){ch.textContent=ci.value.length+' of '+CAPMAX;});wrap.appendChild(cl);wrap.appendChild(ci);wrap.appendChild(ch);}
  box.appendChild(row);box.appendChild(wrap);field.parentNode.insertBefore(box,field.nextSibling);
  inp.addEventListener('change',function(){clearRow(row);var f=inp.files&&inp.files[0];box.hidden=!f;if(f)row.appendChild(thumb(f,null));});
}

function autosaveLine(form){
  var s=form.querySelector('.tllst-save');if(!s||s.__tllSg)return;s.__tllSg=1;
  var member=false;
  try{var ms=window.$memberstackDom;if(ms&&ms.getCurrentMember)ms.getCurrentMember().then(function(r){member=!!(r&&r.data);}).catch(function(){});}catch(e){}
  var restored=false;try{restored=!!localStorage.getItem('tllStoryDraft');}catch(e){}
  function put(html){s.__tllBusy=1;s.innerHTML=html;s.__tllBusy=0;}
  var idle=(restored?'<span class="tll-sg-dot" aria-hidden="true"></span><b>Draft restored from your last visit.</b> ':'')+
           'Your words save as a draft every 20 seconds. Photos are added when you send.';
  function rewrite(){
    if(s.__tllBusy)return;
    var t=s.textContent||'';var m=/^Draft saved (\d{1,2}):(\d{2})/.exec(t);
    if(m){var h=parseInt(m[1],10),ap=h>=12?'PM':'AM';h=h%12||12;
      put('<span class="tll-sg-dot" aria-hidden="true"></span><b>Draft saved · '+h+':'+m[2]+' '+ap+'</b>. Kept on this device'+(member?' and in your account':'')+'. Photos are added when you send.');}
    else if(!t.trim())put(idle);
  }
  new MutationObserver(rewrite).observe(s,{childList:true,characterData:true,subtree:true});
  rewrite();
}

function run(){
  var form=document.querySelector(FORM);if(!form)return;
  if(!document.getElementById('tll-submit-gallery-v1')){var st=document.createElement('style');st.id='tll-submit-gallery-v1';st.textContent=CSS;(document.head||document.documentElement).appendChild(st);}
  gallery(form);hero(form);autosaveLine(form);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);setTimeout(run,3000);
})();
/* src/site-layers/tll-submit-long-v1.js */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var SIZE=3500,MAXP=12;
function parts(t){var out=[];while(t.length>SIZE&&out.length<MAXP-1){var cut=t.lastIndexOf(' ',SIZE);if(cut<SIZE*0.6)cut=SIZE;out.push(t.slice(0,cut));t=t.slice(cut);}out.push(t);return out;}
function sync(ta){
  var f=ta.form;if(!f)return;var t=ta.value||'';
  [].forEach.call(f.querySelectorAll('input[data-tll-part]'),function(h){h.parentNode.removeChild(h);});
  if(t.length<=SIZE)return;
  parts(t).forEach(function(p,i){var h=document.createElement('input');h.type='hidden';h.name='body-part-'+(i+1);h.setAttribute('data-name','body-part-'+(i+1));h.setAttribute('data-tll-part','1');h.value=p;f.appendChild(h);});
}
function run(){
  var ta=document.querySelector('form textarea[name="body"]');if(!ta||ta.dataset.tllLong)return;ta.dataset.tllLong='1';
  ta.removeAttribute('maxlength');
  var tm=0;ta.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){sync(ta);},400);});
  if(ta.form)ta.form.addEventListener('submit',function(){sync(ta);},true);
  var p=document.createElement('p');p.className='tll-long-hint';p.textContent='Write as long as the story needs. Long stories arrive in full.';
  p.style.cssText='margin:6px 0 0;font:400 13px/1.45 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54';
  ta.insertAdjacentElement('afterend',p);sync(ta);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();
/* src/site-layers/tll-intake-v1.js */
(function(){
var P=location.pathname.replace(/\/+$/,'');if(P!=='/submit'&&P!=='/share-photos')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/intake';
var CSS='.tll-end-note{margin:8px 0 0;padding:10px 12px;border-left:3px solid #C8325B;background:#FBEFF2;color:#0A0B14;font:400 14px/1.45 "IBM Plex Sans Condensed",system-ui,sans-serif;border-radius:2px}'+
'.tll-end-note b{font-weight:600}.tll-intake-msg{margin:12px 0 0;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-intake-msg a{color:#0A0B14;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}';
function css(){if(document.getElementById('tll-intake-v1'))return;var s=document.createElement('style');s.id='tll-intake-v1';s.textContent=CSS;document.head.appendChild(s);}
function kindOf(f){if(f.matches('[data-tll-form="share-photos"]'))return'photos';if(f.querySelector('[name="external-url"]'))return'linkout';if(f.querySelector('textarea[name="body"]'))return'story';return'';}
function fields(f){var o={};[].forEach.call(f.elements,function(e){if(!e.name||e.disabled||e.type==='file'||e.type==='submit'||e.type==='button')return;
  if((e.type==='checkbox'||e.type==='radio')){if(e.type==='radio'&&!e.checked)return;o[e.name]=e.type==='checkbox'?String(e.checked):e.value;return;}
  if(o[e.name]&&e.value&&e.type==='hidden')o[e.name]=e.value;else if(!o[e.name]||e.value)o[e.name]=e.value;});return o;}
function token(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function lastLine(t){var ls=String(t||'').split(/\n/).map(function(l){return l.trim();}).filter(Boolean);return ls[ls.length-1]||'';}
function endCheck(form){
  var ta=form.querySelector('textarea[name="body"]');if(!ta||form.__tllEnd)return;form.__tllEnd=1;var warned='';
  document.addEventListener('submit',function(ev){if(ev.target!==form)return;var l=lastLine(ta.value);if(!l||/[.!?…"”')\]]$/.test(l)){return;}
    if(warned===l)return;warned=l;ev.preventDefault();ev.stopImmediatePropagation();
    var n=form.querySelector('.tll-end-note');if(!n){n=document.createElement('p');n.className='tll-end-note';n.setAttribute('role','alert');ta.insertAdjacentElement('afterend',n);}
    n.innerHTML='';var b=document.createElement('b');b.textContent='Your story seems to stop mid-sentence: ';n.appendChild(b);n.appendChild(document.createTextNode('"...'+l.slice(-70)+'". Finish the last line, or press Send again to send it as it is.'));
    try{ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);}catch(e){}
  },true);
  ta.addEventListener('input',function(){var n=form.querySelector('.tll-end-note');if(n&&/[.!?…"”')\]]$/.test(lastLine(ta.value)))n.remove();});
}
var SAVED='Saved. It is with the editor.';
function watch(form){
  if(form.__tllIntake)return;form.__tllIntake=1;var kind=kindOf(form);if(!kind)return;
  var wrap=form.closest('.w-form')||form.parentNode,done=wrap&&wrap.querySelector('.w-form-done');if(!done)return;
  var sent=false;
  new MutationObserver(function(){if(sent||getComputedStyle(done).display==='none')return;sent=true;
    var tok=token(),data=fields(form);if(!tok)return;
    var msg=document.createElement('p');msg.className='tll-intake-msg';msg.textContent=kind==='photos'?'Setting it up on the site…':'Sending it to the editor…';done.appendChild(msg);
    fetch(API,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+tok},body:JSON.stringify({kind:kind,fields:data})})
    .then(function(r){return r.json().catch(function(){return{};}).then(function(j){return{ok:r.ok&&j.ok,j:j};});})
    .then(function(x){if(!x.ok){msg.textContent=SAVED;return;}
      if(kind==='photos'){msg.innerHTML='Your photos are in the Lounge. <a href="/gallery">See them →</a>';return;}
      /* 11 Nov 2026 (Nancy: a human reads every story before it goes live): the Worker now saves stories and link-outs as
         drafts and answers held:true; the page's own message already says it is with the editor, so this line steps aside.
         An older Worker that still answers with a url keeps the old line, so the two can be released in either order. */
      if(x.j.held||!x.j.url){msg.remove();return;}
      msg.innerHTML='';msg.appendChild(document.createTextNode('It is live. '));var a=document.createElement('a');a.href=x.j.url;a.textContent='Read it on the site →';msg.appendChild(a);})
    .catch(function(){msg.textContent=SAVED;});
  }).observe(done,{attributes:true,attributeFilter:['style','class']});
}
function run(){css();[].forEach.call(document.querySelectorAll('form'),function(f){if(P==='/submit'&&kindOf(f)==='story')endCheck(f);if(kindOf(f))watch(f);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();
/* src/site-layers/tll-ux-v1.js */
(function(){
var UX_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='ux')localStorage.setItem('tll-preview-ux','1');if(q==='off')localStorage.removeItem('tll-preview-ux');}catch(e){}
var ON=UX_PUBLIC||q==='ux';try{ON=ON||localStorage.getItem('tll-preview-ux')==='1';}catch(e){}if(!ON)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var CSS=':root{--ease-out:cubic-bezier(0.23,1,0.32,1)}'+
'.tll-story-hero-img{max-height:60vh!important}@media (max-width:600px){.tll-story-hero-img{max-height:50vh!important}}'+
'.tll-ux{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-ux [hidden]{display:none!important}'+
'.tll-ux-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-ux-toc{max-width:680px;margin:20px auto;padding:14px 16px;border-left:3px solid #067A79;background:#fff}.tll-ux-toc ol{margin:0;padding-left:20px}.tll-ux-toc a{color:#0A0B14}'+
'.tll-ux-end{max-width:680px;margin:32px auto;display:grid;gap:12px}.tll-ux-next{display:flex;gap:14px;align-items:center;border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:12px;color:#0A0B14;text-decoration:none;min-height:44px}'+
'.tll-ux-next img{width:96px;height:72px;object-fit:cover;border-radius:4px;flex:none}.tll-ux-next b{display:block;font:800 20px/1.2 "Playfair Display",Georgia,serif}'+
'.tll-ux-join{border:1px solid #0A0B14;border-radius:6px;padding:16px;background:#FDF9F3}.tll-ux-join b{display:block;font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-ux-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:4px;border:0;background:#C8325B;color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;transition:transform 140ms var(--ease-out)}'+
'.tll-ux-btn:active{transform:scale(.97)}.tll-ux-btn.ghost{background:#fff;color:#0A0B14;border:1.5px solid #0A0B14}.tll-ux-btn[disabled]{opacity:.55;cursor:default}'+
'.tll-ux-wel{position:fixed;inset:0;z-index:9999;background:rgba(10,11,20,.55);display:flex;align-items:flex-end;justify-content:center}'+
'.tll-ux-sheet{width:100%;max-width:560px;max-height:92vh;overflow:auto;background:#FDF9F3;border-radius:12px 12px 0 0;padding:20px 16px 24px}@media (min-width:700px){.tll-ux-wel{align-items:center}.tll-ux-sheet{border-radius:12px}}'+
'.tll-ux-prog{height:4px;background:#E0DACE;border-radius:2px;margin:0 0 6px}.tll-ux-prog i{display:block;height:100%;background:#C8325B;border-radius:2px;transition:width 200ms var(--ease-out)}'+
'.tll-ux-sheet h2{font:800 28px/1.1 "Playfair Display",Georgia,serif;margin:6px 0 12px}.tll-ux-sheet input[type=text],.tll-ux-sheet select{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#fff;min-height:44px}'+
'.tll-ux-rows{display:grid;gap:6px;margin:10px 0;max-height:40vh;overflow:auto}.tll-ux-row{display:flex;align-items:center;gap:8px;justify-content:space-between;border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:6px 8px}'+
'.tll-ux-chips{display:flex;gap:4px}.tll-ux-chips button{min-height:36px;min-width:44px;padding:0 8px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;cursor:pointer}.tll-ux-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-ux-acts{display:flex;justify-content:space-between;gap:8px;margin-top:14px}'+
'.tll-ux-stamps{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.tll-ux-stamp{font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:2px solid #C8325B;color:#C8325B;border-radius:6px;padding:10px;transform:rotate(-2deg)}'+
'.tll-ux-press{animation:tllPress 200ms var(--ease-out) both}@keyframes tllPress{from{transform:scale(.95) rotate(-2deg);opacity:0}to{transform:scale(1) rotate(-2deg);opacity:1}}'+
'.tll-ux-otd{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-ux-v1'))return;var s=el('style');s.id='tll-ux-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
css();

/* Events everywhere */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';if(/^\/signup\b/.test(h))track('signup_start',{from:P});},true);
if(P==='/submit'){var started=false;document.addEventListener('input',function(){if(started)return;started=true;track('story_submit_start');},true);}

/* Story pages */
function story(){var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];if(!body||document.getElementById('tll-ux-end'))return;
  var words=(body.textContent||'').trim().split(/\s+/).length,heads=[].slice.call(body.querySelectorAll('h2,h3'));
  if(words>2500&&heads.length>=2&&!document.getElementById('tll-ux-toc')){var t=el('nav','tll-ux tll-ux-toc');t.id='tll-ux-toc';t.setAttribute('aria-label','In this story');t.appendChild(el('p','tll-ux-k','In this story'));var ol=el('ol');
    heads.forEach(function(h,i){if(!h.id)h.id='s-'+(i+1)+'-'+h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40);var li=el('li'),a=el('a','',h.textContent.trim());a.href='#'+h.id;li.appendChild(a);ol.appendChild(li);});t.appendChild(ol);body.insertBefore(t,body.firstChild);}
  var sent=false;window.addEventListener('scroll',function(){if(sent)return;var r=body.getBoundingClientRect();if(r.height>0&&(innerHeight-r.top)/r.height>=0.75){sent=true;track('story_read_75',{story:P.split('/')[2]});}},{passive:true});
  var here=P.split('/')[2],links=[].slice.call(document.querySelectorAll('main a[href^="/stories/"]')).filter(function(a){var s=(a.getAttribute('href').split('/')[2]||'').replace(/[?#].*$/,'');return s&&s!==here&&!a.closest('nav,header,footer,.tll-ux-end');});
  var nx=links.filter(function(a){return a.querySelector('img');})[0]||links[0],end=el('div','tll-ux tll-ux-end');end.id='tll-ux-end';
  if(nx){var card=el('a','tll-ux-next');card.href=nx.getAttribute('href');var im=nx.querySelector('img');if(im){var i2=el('img');i2.src=im.currentSrc||im.src;i2.alt='';i2.loading='lazy';card.appendChild(i2);}var tx=el('div');tx.appendChild(el('span','tll-ux-k','Next story'));
    var title=(nx.querySelector('h2,h3,h4,b,strong')||nx).textContent.trim().split('\n')[0].slice(0,120);tx.appendChild(el('b','',title||'Keep reading'));card.appendChild(tx);card.addEventListener('click',function(){track('next_story_click',{from:here});});end.appendChild(card);}
  if(!tok()){var j=el('div','tll-ux-join');j.appendChild(el('b','','Start your free map.'));j.appendChild(el('p','','Free. No card. 16+.'));var ja=el('a','tll-ux-btn','Join free');ja.href='/signup?utm_source=story&utm_medium=end&utm_campaign=tll';j.appendChild(ja);end.appendChild(j);}
  if(!end.children.length)return;var share=document.querySelector('.tll-story-share-row');if(share)share.parentNode.insertBefore(end,share);else body.insertAdjacentElement('afterend',end);}

/* Welcome: first stamp in under two minutes */
function readStates(j){var r=j&&j.tllStates;if(!r||r.v!==2||!r.states){try{r=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){r=null;}}if(!r||r.v!==2||!r.states)r={v:2,travelers:[{id:'t1',name:'Me',color:'#F0507A',pet:false}],states:{}};return r;}
function names(){var out=[];try{var dn=new Intl.DisplayNames(['en'],{type:'region'}),N=window.__tllN2A||{};Object.keys(N).forEach(function(num){var a=N[num],n=a==='XK'?'Kosovo':dn.of(a);if(n&&n!==a)out.push({num:num,a2:a,name:n});});}catch(e){}return out.sort(function(a,b){return a.name.localeCompare(b.name);});}
function welcome(force){var ms=window.$memberstackDom;if(!ms||!ms.getMemberJSON||document.getElementById('tll-ux-wel'))return;
  ms.getMemberJSON().then(function(j){var json=(j&&j.data)||{},rec=readStates(json);if(!force&&Object.keys(rec.states).length)return;if(json.tllWelcomed&&!force)return;
    var all=names();if(!all.length)return;var me=(rec.travelers.filter(function(t){return !t.pet;})[0]||{id:'t1'}).id,picks={},home='';
    var reg=(navigator.language||'').split('-')[1];if(reg){var hit=all.filter(function(c){return c.a2===reg.toUpperCase();})[0];if(hit){home=hit.num;picks[hit.num]='lived';}}
    var wrap=el('div','tll-ux tll-ux-wel');wrap.id='tll-ux-wel';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-labelledby','tll-ux-wel-h');var sh=el('div','tll-ux-sheet');wrap.appendChild(sh);document.body.appendChild(wrap);
    var step=1;function frame(n,title){sh.textContent='';var pr=el('div','tll-ux-prog'),bar=el('i');bar.style.width=(n*100/3)+'%';pr.appendChild(bar);sh.appendChild(pr);sh.appendChild(el('p','tll-ux-k',n+' of 3'));var h=el('h2','',title);h.id='tll-ux-wel-h';sh.appendChild(h);}
    function acts(back,next,label,skip){var a=el('div','tll-ux-acts');if(back){var b=el('button','tll-ux-btn ghost','Back');b.type='button';b.onclick=back;a.appendChild(b);}else a.appendChild(el('span'));
      var nx=el('button','tll-ux-btn',label||'Next');nx.type='button';nx.onclick=next;a.appendChild(nx);if(skip){var s=el('button','tll-ux-btn ghost','Skip');s.type='button';s.onclick=skip;a.insertBefore(s,nx);}sh.appendChild(a);return nx;}
    function s1(){frame(1,'Where is home?');var sel=el('select');sel.setAttribute('aria-label','Home country');sel.appendChild(el('option','','Pick a country'));all.forEach(function(c){var o=el('option','',c.name);o.value=c.num;sel.appendChild(o);});sel.value=home;sh.appendChild(sel);
      sh.appendChild(el('p','','The country you call home. You can change it later.')).style.cssText='font-size:13px;color:#5F5A54';
      acts(null,function(){if(home&&picks[home]==='lived'&&sel.value!==home)delete picks[home];home=sel.value;if(home)picks[home]='lived';s2();});}
    function s2(){frame(2,'Where have you been?');var find=el('input');find.type='text';find.placeholder='Type a country';find.setAttribute('aria-label','Find a country');sh.appendChild(find);var rows=el('div','tll-ux-rows');sh.appendChild(rows);
      function draw(){rows.textContent='';var f=find.value.trim().toLowerCase();all.filter(function(c){return f?c.name.toLowerCase().indexOf(f)>-1:picks[c.num];}).slice(0,40).forEach(function(c){var r=el('div','tll-ux-row');r.appendChild(el('span','',c.name));var ch=el('div','tll-ux-chips');
        [['lived','LIVED'],['visited','STAYED'],['layover','LAYOVER']].forEach(function(m){var b=el('button','',m[1]);b.type='button';b.setAttribute('aria-pressed',String(picks[c.num]===m[0]));b.onclick=function(){if(picks[c.num]===m[0])delete picks[c.num];else picks[c.num]=m[0];draw();};ch.appendChild(b);});r.appendChild(ch);rows.appendChild(r);});
        if(!rows.children.length)rows.appendChild(el('p','','Type a country, then tap Lived, Stayed or Layover.'));}
      find.oninput=draw;draw();setTimeout(function(){find.focus();},50);acts(s1,function(){save().then(s3);},'Save my map');}
    function save(){var e=rec.states;Object.keys(picks).forEach(function(num){var x=Object.assign({},e[num]||{});if(!x[me])x[me]=picks[num];e[num]=x;});var t=Date.now();json.tllStates=rec;json.tllStatesAt=t;json.tllWelcomed=t;
      return ms.updateMemberJSON({json:json}).then(function(){try{localStorage.setItem('tllStates',JSON.stringify(rec));localStorage.setItem('tllStatesAt',String(t));}catch(e){}if(Object.keys(picks).length)track('first_stamp',{count:Object.keys(picks).length});}).catch(function(){});}
    function s3(){frame(3,'One photo for your first album page');sh.appendChild(el('p','','Optional. Pick one you took yourself; we take the location out before it uploads.'));var a=el('a','tll-ux-btn ghost','Add a photo');a.href='/share-photos?utm_source=welcome';sh.appendChild(a);
      acts(null,ask,'Next',ask);}
    /* Optional, one tap, multi-select: "How do you travel most?" Saved privately to the member's travel-style field, to a GA4 user
       property only after analytics consent, and counted monthly for Nancy. Never shown publicly. */
    function ask(){sh.textContent='';sh.appendChild(el('p','tll-ux-k','One more, optional'));var h=el('h2','','How do you travel most?');h.id='tll-ux-wel-h';sh.appendChild(h);
      var opts=[['big-trips','A few big trips a year'],['short-trips','Lots of short trips and layovers'],['abroad','I live abroad (or did)'],['work','For work'],['pet','With my pet'],['pursuit','For a pursuit (running, hiking, food, more)']],picked={};
      var box=el('div','tll-ux-chips');box.style.cssText='flex-wrap:wrap;gap:8px;margin:10px 0';box.setAttribute('role','group');box.setAttribute('aria-label','How do you travel most? Pick any');
      opts.forEach(function(o){var b=el('button','',o[1]);b.type='button';b.style.cssText='min-height:44px;font:600 14px/1.2 "IBM Plex Sans Condensed",sans-serif;letter-spacing:0;padding:0 14px';b.setAttribute('aria-pressed','false');
        b.onclick=function(){picked[o[0]]=!picked[o[0]];b.setAttribute('aria-pressed',String(!!picked[o[0]]));};box.appendChild(b);});sh.appendChild(box);
      sh.appendChild(el('p','','Pick any. Only we see this; it helps us make TLL for people like you.')).style.cssText='font-size:13px;color:#5F5A54';
      acts(null,function(){var list=Object.keys(picked).filter(function(k){return picked[k];});if(list.length){
          try{if(ms.updateMember)ms.updateMember({customFields:{'travel-style':list.join(',')}}).catch(function(){});}catch(e){}
          post('/travel-style',{styles:list});try{if(window.__tllConsent&&__tllConsent.analytics&&window.gtag)gtag('set','user_properties',{travel_style:list.join(',')});}catch(e){}
          track('travel_style_answer',{count:list.length});}reveal();},'Show my passport',reveal);}
    function reveal(){sh.textContent='';sh.appendChild(el('p','tll-ux-k','Your passport'));var h=el('h2','','Stamped.');h.id='tll-ux-wel-h';sh.appendChild(h);var box=el('div','tll-ux-stamps');var codes=Object.keys(picks);
      codes.forEach(function(num,i){var c=all.filter(function(x){return x.num===num;})[0];if(!c)return;var s=el('span','tll-ux-stamp',c.name+' · '+(picks[num]==='lived'?'Lived':picks[num]==='visited'?'Stayed':'Layover'));if(!RM&&i<12){s.classList.add('tll-ux-press');s.style.animationDelay=(i*40)+'ms';}box.appendChild(s);});
      sh.appendChild(box);if(!codes.length)sh.appendChild(el('p','','Your first stamp goes here. The map is one tap away.'));var a=el('a','tll-ux-btn','See my map');a.href='/the-map';sh.appendChild(a);var c=el('button','tll-ux-btn ghost','Close');c.type='button';c.style.marginLeft='8px';c.onclick=function(){wrap.remove();};sh.appendChild(c);}
    document.addEventListener('keydown',function k(e){if(e.key==='Escape'&&document.getElementById('tll-ux-wel')){wrap.remove();document.removeEventListener('keydown',k);}});
    s1();if(force)track('signup_complete');}).catch(function(){});}

/* On this day, private to the member on /account */
function onThisDay(){if(document.getElementById('tll-ux-otd'))return;post('/stamps/mine').then(function(d){if(!d||!d.ok)return;var now=new Date(),m=now.getMonth()+1,y=now.getFullYear();
  var hits=(d.stamps||[]).filter(function(s){return s.month===m&&s.year&&s.year<y;});if(!hits.length||document.getElementById('tll-ux-otd'))return;
  var box=el('section','tll-ux tll-ux-otd');box.id='tll-ux-otd';box.appendChild(el('p','tll-ux-k','On this day · only you see this'));
  hits.slice(0,3).forEach(function(s){var n=y-s.year;box.appendChild(el('p','',(n===1?'A year ago':n+' years ago')+' this month: '+s.what+', '+[s.city,s.country].filter(Boolean).join(', ')+'.'));});
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);});}

function run(){if(/^\/stories\/[^/]+$/.test(P))story();else if(P==='/account'){var w=new URLSearchParams(location.search).get('welcome')==='1';setTimeout(function(){welcome(w);},w?0:1500);onThisDay();}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1400);});else setTimeout(run,1400);
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
  var ul=el('ul');[['One trip, first person.','A weekend, a layover, a year abroad. Not "Thailand" but "the night bus to Chiang Mai."'],['You were there.','Use your own photos and keep the mistakes in. Stock photos and press kits get sent back.'],['A place and a time.','City or country, month and year. After the trip, never during.'],['The bit that went sideways.','The missed ferry, the wrong hostel, the kindness you did not expect. That is the story.'],['In your words.','We fix typos. AI writes nothing here, and anything AI made is labeled.']]
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
