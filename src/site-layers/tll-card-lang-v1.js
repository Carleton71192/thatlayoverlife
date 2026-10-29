/* tll-card-lang-v1 (multilingual stories, Phase 1; Nancy's prompt, 29 Oct 2026). STAGED: not in the published bundle until Nancy
   approves the change log. Story cards on /stories and the home rails get a small language tag ("ES", "DA", "PT-BR") on stories
   not written in English, in the existing black washi-tape label style (.tll-lib-meta). Needs one hidden text element in the card
   template bound to Story language: [data-tll-card-lang] (option name like "Español (es)"). English stories get no tag. The tag
   names the language in its own words for screen readers ("Español"). Nothing removed; no data-ms-* element touched. */
(function(){
var CSS=".tll-lang-tag{display:inline-flex;align-items:center;margin:0 0 0 6px;padding:4px 7px;background:#0A0B14;color:#F7F1E8;"+
"font:600 10.5px/1 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;vertical-align:middle}";
function parse(s){s=String(s||'').trim();var m=s.match(/^(.*?)\s*\(([A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})?)\)\s*$/);return m?{name:m[1].trim(),code:m[2]}:{name:s,code:''};}
function run(){
  var hooks=document.querySelectorAll('[data-tll-card-lang]:not([data-tll-lt])');if(!hooks.length)return;
  if(!document.getElementById('tll-card-lang-v1')){var s=document.createElement('style');s.id='tll-card-lang-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  [].forEach.call(hooks,function(h){h.setAttribute('data-tll-lt','1');var p=parse(h.textContent);if(!p.code||/^en(-|$)/i.test(p.code))return;
    var card=h.closest('.tll-lib-card')||h.parentElement;var meta=card.querySelector('.tll-lib-meta');
    var tag=document.createElement('span');tag.className='tll-lang-tag';tag.textContent=p.code.toUpperCase();tag.setAttribute('lang',p.code);tag.setAttribute('aria-label',p.name);tag.title=p.name;
    if(meta)meta.appendChild(tag);else{var body=card.querySelector('.tll-lib-body')||card;body.insertBefore(tag,body.firstChild);}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);
})();
