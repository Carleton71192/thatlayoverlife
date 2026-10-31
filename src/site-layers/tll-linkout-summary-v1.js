/* tll-linkout-summary-v1 (31 Oct 2026, Nancy: "building the AI summary box for linked articles and pulling in OG images or having a
   backup option"). Works beside tll-linkout-preview-v1 on the /submit link-out form.
   1. AI summary box: once the link reads, asks the Worker (GET /link-summary) for a short neutral summary of the linked article and
      shows it under the preview, labeled "Summary by AI, from the linked article". It is never put into the writer's own fields; the
      published story shows the same labeled box. If the Worker has no key yet or the article cannot be read, no box shows.
   2. Backup photo: when the article has no usable photo, or the writer unticks it, an optional "Your own photo" upload appears
      (field name hero-image, cleaned and uploaded by photo-clean like every other photo field). The Worker uses the article photo
      first, then this one, else the country card. No data-ms-* element touched; existing field names unchanged. */
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
