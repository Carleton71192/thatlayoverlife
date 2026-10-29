/* tll-ep-linkstack-v1 (29 Oct 2026, Nancy: Linktree-style links on profiles, "Yes please" to the list including the paid ones).
   /edit-profile gets a "More links" block under Shop and partners: up to 12 links, each a type, a label and a link. Saved inside the
   existing partners value as partners.stack (the Contributors collection is at Webflow's 60-field limit), through the editor's own
   save (window.TLLEP.set), so it travels like every other profile field. The Shop and partners inputs rebuild partners without the
   stack, so their saves are merged here to keep it. Nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/edit-profile\/?$/.test(location.pathname))return;
var TYPES=[['web','Web link','https://'],['pdf','PDF (menu, resume, schedule)','Link to the PDF file'],['youtube','YouTube video','https://youtu.be/...'],['x','X post','https://x.com/you/status/...'],['tiktok','TikTok','https://www.tiktok.com/@you/video/...'],['twitch','Twitch channel','https://twitch.tv/you'],['music','Music (Spotify, Apple Music)','Song, album or playlist link'],['presave','Music pre-save','Your pre-save page'],['podcast','Podcast','Spotify or Apple Podcasts link'],['book','Book','Where your book is sold'],['shop','Shop or affiliate product','Product or store link'],['digital','Digital product','Where it is sold'],['course','Course','Course page'],['tips','Tips','Ko-fi, Buy Me a Coffee, PayPal...'],['booking','Booking (Calendly and others)','https://calendly.com/you'],['contact','Contact card','Email to include (optional)']];
var MAX=12,PAID={shop:'AFFILIATE',digital:'PAID',course:'PAID',tips:'TIPS'};
var CSS='.tll-ls{margin:22px 0 0;padding:18px 0 0;border-top:1px solid #E0DACE}.tll-ls h3{margin:0 0 4px;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79}'+
'.tll-ls p{margin:0 0 12px;font:400 13px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54}.tll-ls-row{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1.4fr) auto;gap:8px;align-items:center;margin:0 0 8px}'+
'.tll-ls-row select,.tll-ls-row input{width:100%;min-height:44px;padding:8px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;font:400 15px/1.3 "IBM Plex Sans Condensed",system-ui,sans-serif}'+
'.tll-ls-row button,.tll-ls-add{min-height:44px;padding:0 12px;border:0;background:transparent;color:#C8325B;font:600 13px/1 "IBM Plex Sans Condensed",system-ui,sans-serif;cursor:pointer}.tll-ls-add{padding:0;border-bottom:1px solid #C8325B;min-height:32px}'+
'.tll-ls-tag{grid-column:1/-1;margin:-4px 0 4px;font:400 12px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54}@media(max-width:640px){.tll-ls-row{grid-template-columns:1fr 1fr}.tll-ls-row button{grid-column:2;justify-self:end}.tll-ls-row input[data-k=url]{grid-column:1/-1}}';
function E(){return window.TLLEP}
function pt(){try{var p=JSON.parse((E()&&E().get('partners'))||'null');return p&&typeof p==='object'&&!Array.isArray(p)?p:{}}catch(e){return {}}}
var stack=null,box,list,tm;
function save(){var e=E();if(!e)return;var p=pt();p.stack=stack.filter(function(l){return l.t&&(l.url||l.t==='contact')});e.set('partners',JSON.stringify(p))}
function later(){clearTimeout(tm);tm=setTimeout(save,600)}
function row(l,i){var r=document.createElement('div');r.className='tll-ls-row';
  var s=document.createElement('select');s.setAttribute('aria-label','Link type');TYPES.forEach(function(t){var o=document.createElement('option');o.value=t[0];o.textContent=t[1];s.appendChild(o)});s.value=l.t||'web';
  var a=document.createElement('input');a.setAttribute('data-k','label');a.maxLength=60;a.placeholder='Label people see';a.setAttribute('aria-label','Label');a.value=l.label||'';
  var u=document.createElement('input');u.setAttribute('data-k','url');u.setAttribute('aria-label','Link');u.value=l.url||'';
  var x=document.createElement('button');x.type='button';x.textContent='Remove';x.setAttribute('aria-label','Remove this link');
  var tag=document.createElement('div');tag.className='tll-ls-tag';
  function hint(){var t=TYPES.filter(function(z){return z[0]===s.value})[0];u.placeholder=t?t[2]:'https://';u.type=s.value==='contact'?'email':'url';tag.textContent=PAID[s.value]?'Shown with a '+PAID[s.value]+' tag, so readers know.':'';tag.hidden=!tag.textContent}
  s.onchange=function(){l.t=s.value;hint();later()};a.oninput=function(){l.label=a.value;later()};u.oninput=function(){l.url=u.value.trim();later()};
  x.onclick=function(){stack.splice(stack.indexOf(l),1);paint();save()};
  hint();[s,a,u,x,tag].forEach(function(n){r.appendChild(n)});return r}
function paint(){list.innerHTML='';stack.forEach(function(l,i){list.appendChild(row(l,i))});add.hidden=stack.length>=MAX}
var add;
function build(){
  var e=E();if(!e||!e.set||document.querySelector('.tll-ls'))return !!document.querySelector('.tll-ls');
  var u2=document.querySelector('[data-ep-pt="u2"]'),op=document.querySelector('[data-ep-pt-open]');if(!u2)return false;
  var host=u2;while(host.parentElement&&!(op?host.parentElement.contains(op):false))host=host.parentElement;
  var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  box=document.createElement('div');box.className='tll-ls';box.innerHTML='<h3>More links</h3><p>Up to 12. A web page, a PDF, a video, music, a podcast, a book, a booking page, something you sell or a tip jar. Videos, music, posts and bookings open right on your page when a reader taps them.</p>';
  list=document.createElement('div');box.appendChild(list);
  add=document.createElement('button');add.type='button';add.className='tll-ls-add';add.textContent='+ Add a link';
  add.onclick=function(){if(stack.length>=MAX)return;stack.push({t:'web',label:'',url:''});paint();var r=list.lastChild;if(r)r.querySelector('input').focus()};
  box.appendChild(add);
  (host.parentElement?host:u2).insertAdjacentElement('afterend',box);
  stack=(pt().stack||[]).slice(0,MAX);paint();
  /* keep the stack when the Shop and partners inputs save partners without it */
  var set=e.set;e.set=function(k,v){if(k==='partners'&&stack){try{var p=JSON.parse(v||'{}');if(p&&typeof p==='object'&&!p.stack&&stack.length){p.stack=stack.filter(function(l){return l.t&&(l.url||l.t==='contact')});v=JSON.stringify(p)}}catch(err){}}return set.apply(this,arguments.length>1?[k,v].concat([].slice.call(arguments,2)):[k,v])};
  return true}
var n=0;(function tick(){if(!build()&&++n<40)setTimeout(tick,250)})();
})();
