/* tll-intake-v1 (31 Oct 2026, Nancy: submissions should be set up instantly; a next-day report checks them; stories that end
   mid-sentence, like Roberta's, should be caught). /submit and /share-photos.
   1. Before sending a story: if the last line does not end a sentence (no . ! ? or closing quote), a note under the story box
      shows the ending and asks the writer to finish it; a second press of Send sends it as it is.
   2. After Webflow accepts a form (its success box shows), the same fields go to the Worker's POST /intake with the member's
      Memberstack token, which publishes the story, link-out or photos at once and links them to the member's profile. The
      success box then says where it is live. If that step fails nothing is lost: the Webflow copy is set up in the daily round.
   Expat and press applications are not sent here; Nancy approves them from the next-day report.
   Field names unchanged; nothing removed; no data-ms-* element touched. */
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
function watch(form){
  if(form.__tllIntake)return;form.__tllIntake=1;var kind=kindOf(form);if(!kind)return;
  var wrap=form.closest('.w-form')||form.parentNode,done=wrap&&wrap.querySelector('.w-form-done');if(!done)return;
  var sent=false;
  new MutationObserver(function(){if(sent||getComputedStyle(done).display==='none')return;sent=true;
    var tok=token(),data=fields(form);if(!tok)return;
    var msg=document.createElement('p');msg.className='tll-intake-msg';msg.textContent='Setting it up on the site…';done.appendChild(msg);
    fetch(API,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+tok},body:JSON.stringify({kind:kind,fields:data})})
    .then(function(r){return r.json().catch(function(){return{};}).then(function(j){return{ok:r.ok&&j.ok,j:j};});})
    .then(function(x){if(!x.ok){msg.textContent='Saved. It goes live as soon as the editor sets it up.';return;}
      if(kind==='photos'){msg.innerHTML='Your photos are in the Lounge. <a href="/gallery">See them →</a>';return;}
      msg.innerHTML='';msg.appendChild(document.createTextNode('It is live. '));var a=document.createElement('a');a.href=x.j.url;a.textContent='Read it on the site →';msg.appendChild(a);})
    .catch(function(){msg.textContent='Saved. It goes live as soon as the editor sets it up.';});
  }).observe(done,{attributes:true,attributeFilter:['style','class']});
}
function run(){css();[].forEach.call(document.querySelectorAll('form'),function(f){if(P==='/submit'&&kindOf(f)==='story')endCheck(f);if(kindOf(f))watch(f);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();
