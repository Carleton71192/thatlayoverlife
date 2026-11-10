/* tll-site-layers-v16 chunk profile: loaded by the core loader on paths matching /^\/contributors\/[^/]+$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-profile-count-v1.js */
(function(){
if(!/^\/contributors\/[^/]+\/?$/.test(location.pathname))return;
function own(){var m=document.querySelector('[data-pf5="stories-meta"]');var n=m&&parseInt(m.textContent,10);return n>0?n:0;}
function fix(){var n=own();if(!n)return;[].forEach.call(document.querySelectorAll('.pf5-stat-k'),function(k){if(!/^stor(y|ies)$/i.test((k.textContent||'').trim()))return;
  var v=k.previousElementSibling;if(!v)return;var t=v.firstChild&&v.firstChild.nodeType===3?v.firstChild:null,want=String(n);
  if(t){if(t.nodeValue.trim()!==want)t.nodeValue=want;}else if((v.textContent||'').trim()!==want)v.textContent=want;
  var lab=n===1?'STORY':'STORIES';if((k.textContent||'').trim()!==lab)k.textContent=lab;});}
function run(){fix();var S=document.querySelector('.pf5-stat-k');var box=S&&S.parentNode&&S.parentNode.parentNode;
  if(box)new MutationObserver(function(){fix();}).observe(box,{subtree:true,childList:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
addEventListener('load',function(){fix();setTimeout(fix,1500);});
})();
/* src/site-layers/tll-pf-linkstack-v1.js */
(function(){
if(!/^\/contributors\/[^/]+\/?$/.test(location.pathname))return;
var TAG={shop:'AFFILIATE',digital:'PAID',course:'PAID',tips:'TIPS'},WORD={web:'Link',pdf:'PDF',book:'Book',presave:'Pre-save',booking:'Book a time',contact:'Contact'};
var CSS='.tll-lsp{display:grid;gap:10px;width:100%;flex-basis:100%;margin:14px 0 0}.tll-lsp-h{margin:0;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;color:#067A79}'+
'.tll-lsp-btns{display:flex;flex-wrap:wrap;gap:8px}.tll-lsp-card{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;padding:10px 14px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;font:600 15px/1.3 "IBM Plex Sans Condensed",system-ui,sans-serif;text-align:left;cursor:pointer}'+
'.tll-lsp-card span{display:block;font:500 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1px;color:#5F5A54;text-transform:uppercase}.tll-lsp-card b{flex:none;width:34px;height:34px;border-radius:50%;background:#C8325B;color:#fff;display:grid;place-items:center;font-size:13px}'+
'.tll-lsp-frame{width:100%;border:0;border-radius:4px;background:#F7F1E8}@media(hover:hover){.tll-lsp-card:hover{border-color:#C8325B}}.tll-lsp-card:focus-visible{outline:3px solid #0A0B14;outline-offset:2px}';
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function safe(u){u=String(u||'').trim();return /^https:\/\/\S+$/i.test(u)?u:''}
function embed(l){var u=safe(l.url),m;if(!u)return null;var host=location.hostname;
  if(l.t==='youtube'&&(m=u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{6,})/)))return {src:'https://www.youtube-nocookie.com/embed/'+m[1],h:'56.25%',name:'YouTube'};
  if(l.t==='x'&&(m=u.match(/(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/)))return {src:'https://platform.twitter.com/embed/Tweet.html?id='+m[1]+'&dnt=true',px:560,name:'X'};
  if(l.t==='tiktok'&&(m=u.match(/tiktok\.com\/.*\/video\/(\d+)/)))return {src:'https://www.tiktok.com/embed/v2/'+m[1],px:740,name:'TikTok'};
  if(l.t==='twitch'&&(m=u.match(/twitch\.tv\/([\w]+)\/?$/)))return {src:'https://player.twitch.tv/?channel='+m[1]+'&parent='+host+'&autoplay=false',h:'56.25%',name:'Twitch'};
  if((l.t==='music'||l.t==='podcast')&&(m=u.match(/open\.spotify\.com\/(?:intl-\w+\/)?(track|album|playlist|episode|show|artist)\/(\w+)/)))return {src:'https://open.spotify.com/embed/'+m[1]+'/'+m[2],px:(m[1]==='track'||m[1]==='episode')?152:352,name:'Spotify'};
  if(l.t==='music'&&/^https:\/\/music\.apple\.com\//.test(u))return {src:u.replace('https://music.apple.com/','https://embed.music.apple.com/'),px:/[?&]i=/.test(u)?175:450,name:'Apple Music'};
  if(l.t==='podcast'&&/^https:\/\/podcasts\.apple\.com\//.test(u))return {src:u.replace('https://podcasts.apple.com/','https://embed.podcasts.apple.com/'),px:/[?&]i=/.test(u)?175:450,name:'Apple Podcasts'};
  if(l.t==='booking'&&/^https:\/\/calendly\.com\//.test(u))return {src:u+(u.indexOf('?')>-1?'&':'?')+'embed_type=Inline&hide_gdpr_banner=1&embed_domain='+host,px:700,name:'Calendly'};
  return null}
function vcf(l){var name=((document.querySelector('h1')||{}).textContent||'').trim(),em=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.url||'')?l.url:'';
  var t=['BEGIN:VCARD','VERSION:3.0','FN:'+name.replace(/[\r\n;,]/g,' '),'URL:'+location.origin+location.pathname].concat(em?['EMAIL:'+em]:[]).concat(['END:VCARD']).join('\r\n');
  var a=el('a','pf5-btn pf5-btn-line',l.label||'Save my contact');a.href=URL.createObjectURL(new Blob([t],{type:'text/vcard'}));a.download=(name||'contact').replace(/[^\w]+/g,'-')+'.vcf';return a}
function run(){
  var root=document.querySelector('[data-pf5="root"]');if(!root||document.querySelector('.tll-lsp'))return;
  var P;try{P=JSON.parse(root.getAttribute('data-partners')||'null')}catch(e){P=null}
  var S=P&&Array.isArray(P.stack)?P.stack.slice(0,12):[];if(!S.length)return;
  var st=el('style');st.textContent=CSS;document.head.appendChild(st);
  var w=el('div','tll-lsp');w.appendChild(el('p','tll-lsp-h','MORE LINKS'));var btns=el('div','tll-lsp-btns'),cards=el('div','tll-lsp');cards.style.margin='0';
  S.forEach(function(l){if(!l||!l.t)return;
    if(l.t==='contact'){btns.appendChild(vcf(l));return}
    var u=safe(l.url);if(!u)return;var em=embed(l);
    if(em){var c=el('button','tll-lsp-card');c.type='button';c.appendChild(el('b',null,'▶'));var tx=el('div',null,l.label||em.name);tx.appendChild(el('span',null,em.name+' · tap to load'));c.appendChild(tx);
      c.onclick=function(){var f=el('iframe','tll-lsp-frame');f.src=em.src;f.title=(l.label||em.name);f.loading='lazy';f.allow='autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write';f.setAttribute('allowfullscreen','');
        if(em.h){var bx=el('div');bx.style.cssText='position:relative;width:100%;padding-top:'+em.h;f.style.cssText='position:absolute;inset:0;height:100%';bx.appendChild(f);c.replaceWith(bx)}else{f.style.height=em.px+'px';c.replaceWith(f)}};
      cards.appendChild(c);return}
    var a=el('a','pf5-btn pf5-btn-line',l.label||WORD[l.t]||'Link');a.href=u;a.target='_blank';a.rel=TAG[l.t]?'sponsored noopener':'noopener';
    if(TAG[l.t]){var tg=el('span','pf5-tag',TAG[l.t]);a.appendChild(tg)}
    if(l.t==='pdf'){var p=el('span','pf5-tag','PDF');a.appendChild(p)}
    var s=el('span',null,'↗');s.setAttribute('aria-hidden','true');a.appendChild(s);btns.appendChild(a)});
  if(btns.childNodes.length)w.appendChild(btns);if(cards.childNodes.length)w.appendChild(cards);
  var B=document.querySelector('[data-pf5="buttons"]');if(B)B.insertAdjacentElement('afterend',w);else root.appendChild(w);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,50)});else setTimeout(run,50);
setTimeout(run,1500);
})();
/* src/site-layers/tll-crew-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var TYPES={partner:'Partner',family:'Family',buddy:'Travel buddy'};
var CSS='.tll-crew{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-crew [hidden]{display:none!important}.tll-crew-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:18px 0 8px}'+
'.tll-crew-p{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #E0DACE;border-radius:8px;padding:10px;margin:0 0 8px;text-decoration:none;color:inherit}'+
'.tll-crew-av{width:36px;height:36px;border-radius:50%;flex:none;background:#067A79 center/cover no-repeat;color:#fff;display:grid;place-items:center;font:600 13px/1 "JetBrains Mono",monospace}'+
'.tll-crew-p div{flex:1;min-width:0}.tll-crew-p small{display:block;color:#5F5A54;font-size:13px}'+
'.tll-crew-b{border:1.5px solid #0A0B14;background:transparent;border-radius:4px;padding:8px 12px;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;min-height:40px;color:#0A0B14}'+
'.tll-crew-inv{margin:10px 0 14px}.tll-crew-inv .tll-crew-row{display:flex;flex-wrap:wrap;gap:8px}a.tll-crew-b{display:inline-flex;align-items:center;text-decoration:none}'+
'.tll-crew-b.p{background:#C8325B;border-color:#C8325B;color:#fff}'+
'.tll-crew-chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.tll-crew-chip{border:1px solid #E0DACE;border-radius:999px;padding:6px 12px;font-size:14px;background:#FDF9F3;cursor:pointer;min-height:36px}'+
'.tll-crew-chip[aria-pressed="true"]{background:#0A0B14;color:#FDF9F3;border-color:#0A0B14}'+
'.tll-crew-res{border:1px solid #E0DACE;border-radius:4px;background:#fff;margin:4px 0 8px}.tll-crew-res button{display:flex;width:100%;gap:10px;align-items:center;border:0;background:none;padding:8px 10px;text-align:left;font:inherit;cursor:pointer;min-height:44px}'+
'.tll-crew-res button:hover{background:#F7F1E8}.tll-crew-msg{font-size:13px;color:#5F5A54;margin:6px 0}'+
'.tll-crew-card{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff}'+
'.tll-crew-card h3{font:800 20px/1.2 "Playfair Display",Georgia,serif;margin:0 0 10px}.tll-crew-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}'+
'.tll-crew-pub{max-width:760px;margin:28px auto;padding:0 16px}.tll-crew-pub .tll-crew-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}';
function css(){if(document.getElementById('tll-crew-v1'))return;var s=document.createElement('style');s.id='tll-crew-v1';s.textContent=CSS;document.head.appendChild(s);}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;}).then(function(j){return j&&Object.assign(j,{status:r.status});});}).catch(function(){return null;});}
function initials(n){return String(n||'').split(/\s+/).map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();}
function personRow(p,sub,href){var r=el(href?'a':'div','tll-crew-p');if(href)r.href=href;var av=el('span','tll-crew-av');if(p.avatar)av.style.backgroundImage='url("'+p.avatar+'")';else av.textContent=initials(p.name);
  var d=el('div');d.appendChild(document.createTextNode(p.name||''));if(sub)d.appendChild(el('small','',sub));r.appendChild(av);r.appendChild(d);return r;}
function btn(txt,primary,fn){var b=el('button','tll-crew-b'+(primary?' p':''),txt);b.type='button';b.addEventListener('click',fn);return b;}

/* ---------- /edit-profile ---------- */
function editProfile(){
  var sec=document.getElementById('ep-crew');if(!sec||sec.dataset.tllCrew)return;
  var q=sec.querySelector('[data-ep-crewq]'),oldList=sec.querySelector('[data-ep-crewlist]'),note=sec.querySelector('[data-ep-crewnote]');if(!q)return;
  sec.dataset.tllCrew='wait';
  post('/crew/inbox').then(function(d){
    if(!d||!d.ok){sec.dataset.tllCrew='';return;}   /* Worker not live: keep the old field */
    sec.dataset.tllCrew='live';css();
    var box=el('div','tll-crew');if(oldList){oldList.hidden=true;oldList.insertAdjacentElement('afterend',box);}else sec.appendChild(box);
    if(note)note.textContent='They see the invite on their account and say yes or no. Nothing shows on either profile until they do.';
    var res=el('div','tll-crew-res');res.hidden=true;q.insertAdjacentElement('afterend',res);
    var pick=el('div');pick.hidden=true;res.insertAdjacentElement('afterend',pick);
    var msg=el('p','tll-crew-msg');msg.setAttribute('aria-live','polite');pick.insertAdjacentElement('afterend',msg);
    var me=d.me||{};var inv=el('div','tll-crew-inv');inv.appendChild(el('p','tll-crew-k','Not on TLL yet? Invite them'));
    var link=function(ch){return 'https://www.thatlayover.life/signup?ref='+encodeURIComponent(me.slug||'')+'&utm_source=invite&utm_medium='+ch+'&utm_campaign=tll';};
    var text=function(ch){return 'I keep my trips on That Layover Life. Join me there and we can link up as travel companions. Free, no card: '+link(ch);};
    var row=el('div','tll-crew-row');
    function go(ch,href){var a=el('a','tll-crew-b',ch==='sms'?'Text':ch==='whatsapp'?'WhatsApp':'Email');a.href=href;if(ch==='whatsapp'){a.target='_blank';a.rel='noopener';}
      a.addEventListener('click',function(){try{window.gtag&&gtag('event','crew_invite',{division:'tll',channel:ch});}catch(x){}});row.appendChild(a);}
    go('email','mailto:?subject='+encodeURIComponent('Join me on That Layover Life')+'&body='+encodeURIComponent(text('email')));
    go('sms','sms:?&body='+encodeURIComponent(text('sms')));
    go('whatsapp','https://wa.me/?text='+encodeURIComponent(text('whatsapp')));
    row.appendChild(btn(navigator.share?'Share (Instagram and more)':'Copy invite link',false,function(){
      try{window.gtag&&gtag('event','crew_invite',{division:'tll',channel:'share'});}catch(x){}
      if(navigator.share){navigator.share({title:'That Layover Life',text:text('share').replace(/: https.*$/,'.'),url:link('share')}).catch(function(){});}
      else if(navigator.clipboard){navigator.clipboard.writeText(text('copy')).then(function(){msg.textContent='Invite copied. Paste it into Instagram or anywhere.';});}}));
    inv.appendChild(row);inv.appendChild(el('p','tll-crew-msg','When they join from your link, they can send you a companion request in one tap.'));
    msg.insertAdjacentElement('afterend',inv);
    var chosen=null,type='partner',timer=0,seq=0;
    function render(d){
      box.textContent='';
      if(d.companions.length){box.appendChild(el('p','tll-crew-k','Travels with'));d.companions.forEach(function(c){var r=personRow(c,TYPES[c.type]||TYPES.buddy);r.appendChild(btn('Leave',false,function(){if(!confirm('Remove '+c.name+' from your companions? Only the link goes; nothing else changes.'))return;post('/crew/leave',{kind:'person',other:c.id}).then(refresh);}));box.appendChild(r);});}
      var out=d.outgoing||[];if(out.length){box.appendChild(el('p','tll-crew-k','Waiting for a yes'));out.forEach(function(i){var r=personRow({name:i.toName},i.kind==='pet'?'Co-owner of '+i.petName:(TYPES[i.type]||''));r.appendChild(btn('Cancel',false,function(){post('/crew/cancel',{id:i.id}).then(refresh);}));box.appendChild(r);});}
      var own=(d.pets||[]).filter(function(p){return p.owner;});
      (d.pets||[]).forEach(function(p){box.appendChild(el('p','tll-crew-k',p.name+(p.owner?'':' (shared with you)')));
        if(!p.coOwners.length&&p.owner)box.appendChild(el('p','tll-crew-msg','Not shared yet. Search a traveler above, then pick Share '+p.name+'.'));
        p.coOwners.forEach(function(o){var r=personRow(o,'Co-owner');if(p.owner)r.appendChild(btn('Remove',false,function(){post('/crew/leave',{kind:'pet',pet:p.id,who:o.id}).then(refresh);}));box.appendChild(r);});
        if(!p.owner)box.appendChild(btn('Leave '+p.name,false,function(){post('/crew/leave',{kind:'pet',pet:p.id}).then(refresh);}));});
      pets=own;
    }
    var pets=[];
    function refresh(){post('/crew/inbox').then(function(d){if(d&&d.ok)render(d);});}
    function choose(p){chosen=p;res.hidden=true;q.value=p.name;pick.textContent='';
      var chips=el('div','tll-crew-chips');var opts=[['partner','Partner'],['family','Family'],['buddy','Travel buddy']].concat(pets.map(function(x){return['pet:'+x.id,'Share '+x.name];}));
      opts.forEach(function(o){var c=el('button','tll-crew-chip',o[1]);c.type='button';c.setAttribute('aria-pressed',String(o[0]===type));c.addEventListener('click',function(){type=o[0];[].forEach.call(chips.children,function(x){x.setAttribute('aria-pressed','false');});c.setAttribute('aria-pressed','true');});chips.appendChild(c);});
      pick.appendChild(chips);
      pick.appendChild(btn('Send invite',true,function(){var body=/^pet:/.test(type)?{kind:'pet',pet:type.slice(4),to:chosen.id}:{kind:'person',to:chosen.id,type:type};
        post('/crew/invite',body).then(function(r){if(r&&r.ok){msg.textContent='Invite sent to '+chosen.name+'. You can cancel it any time.';q.value='';pick.hidden=true;refresh();}else msg.textContent=(r&&r.error)||'That did not go through. Try again in a moment.';});}));
      pick.hidden=false;}
    function search(){var v=q.value.trim();if(v.length<2){res.hidden=true;return;}var my=++seq;
      fetch(API+'/crew/people?q='+encodeURIComponent(v)).then(function(r){return r.json();}).then(function(j){if(my!==seq)return;res.textContent='';
        var list=(j&&j.people||[]).filter(function(p){return p.id!==d.me.id;});
        if(!list.length){res.appendChild(el('p','tll-crew-msg','No traveler by that name yet. Invite them with the buttons below, or name them in a story byline.'));res.hidden=false;return;}
        list.forEach(function(p){var b=el('button');b.type='button';var av=el('span','tll-crew-av');if(p.avatar)av.style.backgroundImage='url("'+p.avatar+'")';else av.textContent=initials(p.name);b.appendChild(av);b.appendChild(document.createTextNode(p.name));b.addEventListener('click',function(){choose(p);});res.appendChild(b);});res.hidden=false;}).catch(function(){});}
    /* take Enter and typing away from the old private-name handler */
    q.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();search();}},true);
    q.addEventListener('input',function(e){e.stopImmediatePropagation();pick.hidden=true;clearTimeout(timer);timer=setTimeout(search,300);},true);
    q.setAttribute('placeholder','Search travelers by name');
    render(d);
  });
}

/* ---------- /account ---------- */
function account(){
  if(document.getElementById('tll-crew-inbox'))return;
  post('/crew/inbox').then(function(d){
    if(!d||!d.ok||!d.incoming.length||document.getElementById('tll-crew-inbox'))return;css();
    var wrap=el('div','tll-crew');wrap.id='tll-crew-inbox';
    d.incoming.forEach(function(i){var card=el('section','tll-crew-card');
      card.appendChild(el('h3','',i.kind==='pet'?'Share '+i.petName:'A travel companion request'));
      card.appendChild(personRow({name:i.fromName,avatar:i.fromAvatar},i.kind==='pet'?'wants you as co-owner of '+i.petName:'wants to add you as '+(TYPES[i.type]||TYPES.buddy)));
      card.appendChild(el('p','tll-crew-msg',i.kind==='pet'?'Every co-owner can log '+i.petName+"'s countries. They never count toward your own total.":'If you accept, you show on each other\'s profile under "Travels with". Your maps stay your own. Either of you can leave any time.'));
      var row=el('div','tll-crew-row');
      row.appendChild(btn('Accept',true,function(){post('/crew/answer',{id:i.id,accept:true}).then(function(r){card.textContent='';card.appendChild(el('p','',r&&r.ok?'Done. You now travel together on That Layover Life.':'That did not go through. Reload and try again.'));});}));
      row.appendChild(btn('Not now',false,function(){post('/crew/answer',{id:i.id,accept:false}).then(function(){card.remove();});}));
      card.appendChild(row);wrap.appendChild(card);});
    var main=document.querySelector('main')||document.body;var h=main.querySelector('h1');
    var anchor=h&&(h.closest('section')||h.parentElement);if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(wrap,anchor.nextSibling);else main.insertBefore(wrap,main.firstChild);
  });
}

/* ---------- public profile and pet pages ---------- */
function publicPage(kind,slug){
  if(document.getElementById('tll-crew-pub'))return;
  fetch(API+'/crew/public?'+(kind==='pet'?'pet=':'slug=')+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||document.getElementById('tll-crew-pub'))return;
    var people=kind==='pet'?(d.owners||[]).map(function(o,n){return [o,n?'Co-owner':'Owner','/contributors/'+o.slug];}):
      (d.companions||[]).map(function(c){return [c,c.type,'/contributors/'+c.slug];}).concat((d.pets||[]).map(function(p){return [p,'Shared pet','/pets/'+p.slug];}));
    if(kind==='pet'&&people.length<2)return;   /* show owners only when the pet is shared */
    if(!people.length)return;css();
    var s=el('section','tll-crew tll-crew-pub');s.id='tll-crew-pub';s.appendChild(el('p','tll-crew-k','Travels with'));
    var g=el('div','tll-crew-grid');people.forEach(function(x){g.appendChild(personRow(x[0],x[1],x[2]));});s.appendChild(g);
    var main=document.querySelector('main')||document.body;var h=main.querySelector('h1');var anchor=h&&(h.closest('section')||h.parentElement);
    if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(s,anchor.nextSibling);else main.appendChild(s);
  }).catch(function(){});
}

/* ---------- joined from an invite ---------- */
(function(){try{var ref=new URLSearchParams(location.search).get('ref');if(ref&&/^[a-z0-9-]{2,80}$/.test(ref))localStorage.setItem('tll-ref',JSON.stringify({slug:ref,at:Date.now()}));}catch(e){}})();
function invited(){
  var ref=null;try{ref=JSON.parse(localStorage.getItem('tll-ref')||'null');}catch(e){}
  if(!ref||!ref.slug||Date.now()-ref.at>1000*60*60*24*30||document.getElementById('tll-crew-ref'))return;
  function done(){try{localStorage.removeItem('tll-ref');}catch(e){}}
  post('/crew/inbox').then(function(d){
    if(!d||!d.ok)return;if(d.me&&d.me.slug===ref.slug){done();return;}
    if(d.companions.some(function(c){return c.slug===ref.slug;})||d.outgoing.some(function(i){return i.toSlug===ref.slug;})){done();return;}
    return fetch(API+'/crew/people?q='+encodeURIComponent(ref.slug.replace(/-/g,' '))).then(function(r){return r.json();}).then(function(j){
      var p=(j&&j.people||[]).filter(function(x){return x.slug===ref.slug;})[0];if(!p){done();return;}css();
      var card=el('section','tll-crew-card tll-crew');card.id='tll-crew-ref';card.appendChild(el('h3','','You joined from '+p.name+"'s invite"));
      card.appendChild(personRow(p,'Send a travel companion request?'));
      var row=el('div','tll-crew-row');
      row.appendChild(btn('Send request',true,function(){post('/crew/invite',{kind:'person',to:p.id,type:'buddy'}).then(function(r){done();card.textContent='';card.appendChild(el('p','',r&&r.ok?'Sent. You show on each other\'s profile once '+p.name+' says yes.':(r&&r.error)||'That did not go through.'));});}));
      row.appendChild(btn('No thanks',false,function(){done();card.remove();}));card.appendChild(row);
      var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(card,an.nextSibling);else main.insertBefore(card,main.firstChild);
    });
  }).catch(function(){});
}

function run(){
  if(P==='/edit-profile')editProfile();
  else if(P==='/account'){account();invited();}
  else{var m=/^\/contributors\/([^/]+)$/.exec(P);if(m)publicPage('person',m[1]);else{m=/^\/pets\/([^/]+)$/.exec(P);if(m)publicPage('pet',m[1]);}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,900);});else setTimeout(run,900);
setTimeout(run,3000);
})();
/* src/site-layers/tll-collections-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var CLOUD='https://api.cloudinary.com/v1_1/idonvlow/image/upload',PRESET='tll_photos',EDGE=2000;
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-col{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-col [hidden]{display:none!important}'+
'.tll-col-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:18px 0 8px}'+
'.tll-col-group{border:1px solid #E0DACE;border-radius:8px;background:#fff;padding:12px;margin:0 0 12px}'+
'.tll-col-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin:0 0 10px}.tll-col-head b{font:800 18px/1.2 "Playfair Display",Georgia,serif}'+
'.tll-col-head label{display:inline-flex;align-items:center;gap:8px;font-size:14px;min-height:36px;cursor:pointer}.tll-col-head input{width:18px;height:18px;accent-color:#C8325B}'+
'.tll-col-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}'+
'.tll-col-it{position:relative;border-radius:6px;overflow:hidden;background:#F7F1E8;min-height:120px;display:flex;flex-direction:column;justify-content:flex-end}'+
'.tll-col-it img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.tll-col-it span{position:relative;display:block;padding:6px 8px;background:linear-gradient(transparent,rgba(10,11,20,.78));color:#fff;font-size:13px;line-height:1.3}'+
'.tll-col-n{position:absolute;top:6px;left:6px;font:600 11px/1 "JetBrains Mono",monospace;font-style:normal;background:rgba(10,11,20,.7);color:#fff;border-radius:999px;padding:4px 7px}.tll-col-it[role=button]{cursor:pointer}'+
'.tll-col-it button{position:absolute;top:4px;right:4px;width:32px;height:32px;border:0;border-radius:50%;background:rgba(10,11,20,.7);color:#fff;font-size:18px;line-height:1;cursor:pointer}'+
'.tll-col-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border:1px dashed #E0DACE;border-radius:8px;padding:12px;margin-top:8px}'+
'.tll-col-form label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#5F5A54}.tll-col-form .w{grid-column:1/-1}'+
'.tll-col-form input,.tll-col-form select{box-sizing:border-box;width:100%;max-width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;min-height:44px}'+
'.tll-col-b{border:0;background:#C8325B;color:#fff;border-radius:4px;padding:10px 16px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;min-height:44px;cursor:pointer}'+
'.tll-col-msg{font-size:13px;color:#5F5A54;margin:6px 0}.tll-col-pub{max-width:1120px;margin:32px auto;padding:0 16px}'+
'.tll-col-pub .tll-col-group{background:transparent;border:0;border-top:2px solid #0A0B14;border-radius:0;padding:14px 0 0}'+
'@media (max-width:560px){.tll-col-form{grid-template-columns:1fr}}';
function css(){if(document.getElementById('tll-collections-v1'))return;var s=document.createElement('style');s.id='tll-collections-v1';s.textContent=CSS;document.head.appendChild(s);}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function countries(){var out=[];try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var a=65;a<91;a++)for(var b=65;b<91;b++){var c=String.fromCharCode(a,b),n=dn.of(c);if(n&&n!==c&&!/^(EU|EZ|UN|QO|XA|XB|ZZ|FX|YU|SU|ZR|TP|UK)$/.test(c))out.push(n);}}catch(e){}return out.filter(function(v,i,s){return s.indexOf(v)===i;}).sort();}
function clean(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,EDGE/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*s);c.height=Math.round(h*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej('read');},'image/jpeg',0.88);};im.onerror=function(){URL.revokeObjectURL(u);rej('read');};im.src=u;});}
function upload(file){return clean(file).then(function(blob){var fd=new FormData();fd.append('file',blob,'item.jpg');fd.append('upload_preset',PRESET);fd.append('folder','tll/collections');return fetch(CLOUD,{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){if(!j.secure_url)throw 'upload';return j.secure_url;});});}
function tile(i,onDel){var t=el('div','tll-col-it'),ph=(i.photos&&i.photos.length?i.photos:(i.photo?[i.photo]:[])),k=0,sz=function(u){return u.replace('/upload/','/upload/c_fill,w_400,h_400,q_auto,f_auto/');};
  if(ph.length){var im=el('img');im.src=sz(ph[0]);im.alt=(i.categoryName||'')+', '+i.country;im.loading='lazy';t.appendChild(im);
    if(ph.length>1){var n=el('em','tll-col-n','1/'+ph.length);t.appendChild(n);t.tabIndex=0;t.setAttribute('role','button');t.setAttribute('aria-label','Next photo of '+i.country);
      var next=function(e){if(e.target.tagName==='BUTTON')return;k=(k+1)%ph.length;im.src=sz(ph[k]);n.textContent=(k+1)+'/'+ph.length;};t.addEventListener('click',next);t.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();next(e);}});}}
  t.appendChild(el('span','',[i.country,i.city,i.year].filter(Boolean).join(' · ')+(i.caption?' · '+i.caption:'')));
  if(onDel){var x=el('button','','×');x.type='button';x.setAttribute('aria-label','Remove '+i.country);x.addEventListener('click',onDel);t.appendChild(x);}return t;}
function groupsOf(items){var g={},order=[];items.forEach(function(i){var k=i.category==='other'?'other:'+i.categoryName.toLowerCase():i.category;if(!g[k]){g[k]={category:i.category,name:i.categoryName,items:[]};order.push(k);}g[k].items.push(i);});return order.map(function(k){return g[k];});}

function editProfile(){
  var crew=document.getElementById('ep-crew');if(!crew||document.getElementById('tll-col'))return;
  post('/collections/mine').then(function(d){
    if(!d||!d.ok||document.getElementById('tll-col'))return;css();
    var sec=el('section','ep-sec tll-col');sec.id='tll-col';sec.setAttribute('aria-labelledby','tll-col-h');
    var h=el('h2','ep-eb','04B · My collections');h.id='tll-col-h';sec.appendChild(h);
    sec.appendChild(el('p','ep-lede','Magnets, mugs, postcards, shot glasses: whatever you bring home. Private until you switch a collection on, and only that collection shows on your profile. Year and city only, never dates.'));
    var list=el('div');sec.appendChild(list);
    var f=el('div','tll-col-form');f.setAttribute('role','group');f.setAttribute('aria-label','Add to my collections');
    function field(lbl,node,wide){var l=el('label',wide?'w':'',lbl);l.appendChild(node);f.appendChild(l);return node;}
    var cat=el('select');d.categories.forEach(function(c){var o=el('option','',c.name);o.value=c.slug;cat.appendChild(o);});field('Collection',cat);
    var own=el('input');own.maxLength=40;own.placeholder='Sand, spoons, beer mats…';var ownL=field('Your name for it',own);ownL.parentNode.hidden=true;
    cat.addEventListener('change',function(){ownL.parentNode.hidden=cat.value!=='other';});
    var ctry=el('input');ctry.setAttribute('list','tll-col-countries');ctry.required=true;ctry.autocomplete='off';field('Country',ctry);
    var dl=el('datalist');dl.id='tll-col-countries';countries().forEach(function(n){var o=el('option');o.value=n;dl.appendChild(o);});f.appendChild(dl);
    var city=el('input');city.maxLength=60;field('City (optional)',city);
    var year=el('input');year.type='number';year.inputMode='numeric';year.min='1900';year.max=String(new Date().getFullYear());field('Year (optional)',year);
    var cap=el('input');cap.maxLength=140;field('A line about it (optional)',cap,true);
    var file=el('input');file.type='file';file.multiple=true;file.accept='image/jpeg,image/png,image/webp,image/heic';field('Photos (optional, up to 6: front, back, on the shelf)',file,true);
    var btn=el('button','tll-col-b','Add to my collections');btn.type='button';f.appendChild(btn);
    var msg=el('p','tll-col-msg');msg.setAttribute('aria-live','polite');f.appendChild(msg);
    sec.appendChild(f);
    function render(items,shown){list.textContent='';if(!items.length){list.appendChild(el('p','tll-col-msg','Nothing yet. Add your first piece below.'));return;}
      groupsOf(items).forEach(function(g){var box=el('div','tll-col-group'),hd=el('div','tll-col-head');
        var n=new Set(g.items.map(function(i){return i.country;})).size;hd.appendChild(el('b','',g.name+' · '+n+(n===1?' country':' countries')));
        var lab=el('label'),sw=el('input');sw.type='checkbox';sw.checked=g.items.some(function(i){return i.shown;});lab.appendChild(sw);lab.appendChild(document.createTextNode('Show on my profile'));
        sw.addEventListener('change',function(){sw.disabled=true;post('/collections/show',{category:g.category,own:g.category==='other'?g.name:'',show:sw.checked}).then(function(){sw.disabled=false;refresh();});});
        hd.appendChild(lab);box.appendChild(hd);var grid=el('div','tll-col-grid');
        g.items.forEach(function(i){grid.appendChild(tile(i,function(){if(!confirm('Remove this '+g.name.toLowerCase()+' from '+i.country+'?'))return;post('/collections/delete',{id:i.id}).then(refresh);}));});
        box.appendChild(grid);list.appendChild(box);});}
    function refresh(){post('/collections/mine').then(function(r){if(r&&r.ok)render(r.items,r.shown);});}
    f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();e.stopPropagation();add();}},true);
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();add();});
    function add(){
      if(!ctry.value.trim()){msg.textContent='Pick a country.';ctry.focus();return;}
      var files=[].slice.call(file.files||[]);if(files.length>6){msg.textContent='Up to 6 photos per piece. Pick your best 6.';return;}
      btn.disabled=true;msg.textContent=files.length?'Cleaning and uploading '+(files.length===1?'the photo':files.length+' photos')+'…':'Adding…';
      files.reduce(function(p,f){return p.then(function(urls){return upload(f).then(function(u){urls.push(u);msg.textContent='Uploaded '+urls.length+' of '+files.length+'…';return urls;});});},Promise.resolve([])).then(function(urls){
        return post('/collections/add',{category:cat.value,own:own.value,country:ctry.value,city:city.value,year:year.value,caption:cap.value,photos:urls});
      }).then(function(r){btn.disabled=false;if(r&&r.ok){msg.textContent='Added. '+(r.item.shown?'It shows on your profile.':'Private until you switch this collection on.');ctry.value='';city.value='';year.value='';cap.value='';file.value='';refresh();}else msg.textContent=(r&&r.error)||'That did not go through. Try again.';})
      .catch(function(){btn.disabled=false;msg.textContent='The photo could not be uploaded. Try another, or add it without a photo.';});
    }
    crew.insertAdjacentElement('afterend',sec);render(d.items,d.shown);
  });
}

function profile(slug){
  if(document.getElementById('tll-col-pub'))return;
  fetch(API+'/collections/public?slug='+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||!d.shelves.length||document.getElementById('tll-col-pub'))return;css();
    var s=el('section','tll-col tll-col-pub');s.id='tll-col-pub';s.appendChild(el('p','tll-col-k','Collections'));
    d.shelves.forEach(function(g){var box=el('div','tll-col-group'),hd=el('div','tll-col-head');hd.appendChild(el('b','',g.name+' · '+g.countries+(g.countries===1?' country':' countries')));box.appendChild(hd);
      var grid=el('div','tll-col-grid');g.items.forEach(function(i){grid.appendChild(tile(i));});box.appendChild(grid);s.appendChild(box);});
    var after=document.getElementById('tll-crew-pub');var main=document.querySelector('main')||document.body;
    if(after)after.insertAdjacentElement('afterend',s);else{var h=main.querySelector('h1'),a=h&&(h.closest('section')||h.parentElement);if(a&&a.parentNode)a.parentNode.insertBefore(s,a.nextSibling);else main.appendChild(s);}
  }).catch(function(){});
}

function run(){if(P==='/edit-profile')editProfile();else{var m=/^\/contributors\/([^/]+)$/.exec(P);if(m)profile(m[1]);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
setTimeout(run,3500);
})();
/* src/site-layers/tll-stamps-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var CLOUD='https://api.cloudinary.com/v1_1/idonvlow/image/upload',PRESET='tll_photos',EDGE=2000;
var P=location.pathname.replace(/\/+$/,'')||'/';
var WT_PUBLIC=false,WTQ=new URLSearchParams(location.search).get('preview');
try{if(WTQ==='worktrips')localStorage.setItem('tll-preview-worktrips','1');if(WTQ==='off')localStorage.removeItem('tll-preview-worktrips');}catch(e){}
var WT=WT_PUBLIC||WTQ==='worktrips';try{WT=WT||localStorage.getItem('tll-preview-worktrips')==='1';}catch(e){}
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var CSS='.tll-st{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-st [hidden]{display:none!important}'+
'.tll-st-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:18px 0 8px}'+
'.tll-st-group{border:1px solid #E0DACE;border-radius:8px;background:#fff;padding:12px;margin:0 0 12px}'+
'.tll-st-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin:0 0 10px}'+
'.tll-st-badge{display:inline-flex;align-items:center;gap:8px;font:600 12px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:1.5px solid #0A0B14;border-radius:999px;padding:8px 12px}'+
'.tll-st-badge i{font-style:normal;color:#C8325B}'+
'.tll-st-head label{display:inline-flex;align-items:center;gap:8px;font-size:14px;min-height:36px;cursor:pointer}.tll-st-head input{width:18px;height:18px;accent-color:#C8325B}'+
'.tll-st-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}'+
'.tll-st-it{display:flex;gap:10px;align-items:center;border:1px dashed #C8B9A6;border-radius:6px;padding:8px;background:#FDF9F3;position:relative}'+
'.tll-st-it img{width:52px;height:52px;object-fit:cover;border-radius:4px;flex:none}.tll-st-it b{display:block;font-weight:600}.tll-st-it small{color:#5F5A54;font-size:13px}'+
'.tll-st-it button{position:absolute;top:4px;right:4px;width:28px;height:28px;border:0;border-radius:50%;background:#0A0B14;color:#fff;cursor:pointer}'+
'.tll-st-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border:1px dashed #E0DACE;border-radius:8px;padding:12px;margin-top:8px}'+
'.tll-st-form label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#5F5A54}.tll-st-form .w{grid-column:1/-1}'+
'.tll-st-form input,.tll-st-form select{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;min-height:44px}'+
'.tll-st-b{border:0;background:#C8325B;color:#fff;border-radius:4px;padding:10px 16px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;min-height:44px;cursor:pointer}'+
'.tll-st-form label.c{flex-direction:row;align-items:flex-start;gap:8px;color:#0A0B14;font-size:14px}.tll-st-form label.c input{width:18px;height:18px;min-height:0;accent-color:#C8325B;margin-top:2px;flex:none}'+
'.tll-st-wt{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;background:#0A0B14;color:#FDF9F3;padding:3px 6px;border-radius:2px;margin-left:6px;vertical-align:middle}'+
'.tll-st-msg{font-size:13px;color:#5F5A54;margin:6px 0}.tll-st-pub{max-width:1120px;margin:32px auto;padding:0 16px}'+
'@media (max-width:560px){.tll-st-form{grid-template-columns:1fr}}';
function css(){if(document.getElementById('tll-stamps-v1'))return;var s=document.createElement('style');s.id='tll-stamps-v1';s.textContent=CSS;document.head.appendChild(s);}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function countries(){var out=[];try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var a=65;a<91;a++)for(var b=65;b<91;b++){var c=String.fromCharCode(a,b),n=dn.of(c);if(n&&n!==c&&!/^(EU|EZ|UN|QO|XA|XB|ZZ|FX|YU|SU|ZR|TP|UK)$/.test(c))out.push(n);}}catch(e){}return out.filter(function(v,i,s){return s.indexOf(v)===i;}).sort();}
function upload(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,EDGE/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*s);c.height=Math.round(h*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej('read');},'image/jpeg',0.88);};im.onerror=function(){rej('read');};im.src=u;})
  .then(function(blob){var fd=new FormData();fd.append('file',blob,'stamp.jpg');fd.append('upload_preset',PRESET);fd.append('folder','tll/stamps');return fetch(CLOUD,{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){if(!j.secure_url)throw 'upload';return j.secure_url;});});}
function item(s,onDel){var t=el('div','tll-st-it');if(s.photo){var im=el('img');im.src=s.photo.replace('/upload/','/upload/c_fill,w_120,h_120,q_auto,f_auto/');im.alt=s.what;im.loading='lazy';t.appendChild(im);}
  var d=el('div'),bt=el('b','',s.what);if(s.workTrip)bt.appendChild(el('span','tll-st-wt','Work trip'));d.appendChild(bt);d.appendChild(el('small','',[s.city,s.country,s.year].filter(Boolean).join(' · ')));t.appendChild(d);
  if(onDel){var x=el('button','','×');x.type='button';x.setAttribute('aria-label','Remove '+s.what);x.addEventListener('click',onDel);t.appendChild(x);}return t;}
function badge(name,count,countries){var b=el('span','tll-st-badge');b.appendChild(document.createTextNode(name+' '));var i=el('i','',count+(count===1?' stamp':' stamps')+' · '+countries+(countries===1?' country':' countries'));b.appendChild(i);return b;}

function editProfile(){
  var anchor=document.getElementById('tll-col')||document.getElementById('ep-crew');if(!anchor||document.getElementById('tll-st'))return;
  post('/stamps/mine').then(function(d){
    if(!d||!d.ok||document.getElementById('tll-st'))return;css();
    var sec=el('section','ep-sec tll-st');sec.id='tll-st';var h=el('h2','ep-eb','05C · Pursuit stamps');sec.appendChild(h);
    sec.appendChild(el('p','ep-lede','A stamp is one thing you did: the race, the trail, the library, the dish. Where, the year and one photo. Private until you switch a pursuit on; profiles show the year only.'));
    var list=el('div');sec.appendChild(list);
    var f=el('div','tll-st-form');f.setAttribute('role','group');f.setAttribute('aria-label','Add a stamp');
    function field(l,n,w){var x=el('label',w?'w':'',l);x.appendChild(n);f.appendChild(x);return n;}
    var ps=d.pursuits.filter(function(p){return WT||!p.draft;}).sort(function(a,b){return (b.picked?1:0)-(a.picked?1:0);});
    var pur=el('select');ps.forEach(function(p){var o=el('option','',p.name);o.value=p.slug;pur.appendChild(o);});field('Pursuit',pur);
    var what=el('input');what.maxLength=80;what.placeholder='Tokyo Marathon, the W Trek, Trinity College Library';field('What',what);
    var ctry=el('input');ctry.setAttribute('list','tll-st-countries');ctry.autocomplete='off';field('Country',ctry);
    var dl=el('datalist');dl.id='tll-st-countries';countries().forEach(function(n){var o=el('option');o.value=n;dl.appendChild(o);});f.appendChild(dl);
    var city=el('input');city.maxLength=60;field('City (optional)',city);
    var mon=el('select');mon.appendChild(el('option','','Month (optional)'));MONTHS.forEach(function(m,i){var o=el('option','',m);o.value=String(i+1);mon.appendChild(o);});field('Month',mon);
    var yr=el('input');yr.type='number';yr.inputMode='numeric';yr.min='1900';yr.max=String(new Date().getFullYear());field('Year',yr);
    var file=el('input');file.type='file';file.accept='image/jpeg,image/png,image/webp,image/heic';field('One photo (optional)',file,true);
    var wt=el('input'),named=el('input'),wtBox=el('div','w');wt.type='checkbox';named.type='checkbox';
    if(WT){var wl=el('label','c');wl.appendChild(wt);wl.appendChild(document.createTextNode('Work trip. Back home? Good. Now tell us.'));wtBox.appendChild(wl);
      var nl=el('label','c');nl.hidden=true;nl.appendChild(named);nl.appendChild(document.createTextNode('I have permission to name them (the company, client or colleague in "What"). Leave this off and your profile says "A work trip".'));wtBox.appendChild(nl);
      f.appendChild(wtBox);var sync=function(){if(pur.value==='work-trips')wt.checked=true;wt.disabled=pur.value==='work-trips';nl.hidden=!wt.checked;if(!wt.checked)named.checked=false;};
      wt.addEventListener('change',sync);pur.addEventListener('change',sync);sync();}
    var btn=el('button','tll-st-b','Add the stamp');btn.type='button';f.appendChild(btn);var msg=el('p','tll-st-msg');msg.setAttribute('aria-live','polite');f.appendChild(msg);sec.appendChild(f);
    function render(stamps){list.textContent='';if(!stamps.length){list.appendChild(el('p','tll-st-msg','No stamps yet. Add your first below.'));return;}
      var g={},order=[];stamps.forEach(function(s){if(!g[s.pursuit]){g[s.pursuit]={name:s.pursuitName,items:[]};order.push(s.pursuit);}g[s.pursuit].items.push(s);});
      order.forEach(function(k){var box=el('div','tll-st-group'),hd=el('div','tll-st-head'),it=g[k].items;
        hd.appendChild(badge(g[k].name,it.length,new Set(it.map(function(s){return s.country;})).size));
        var lab=el('label'),sw=el('input');sw.type='checkbox';sw.checked=it.some(function(s){return s.shown;});lab.appendChild(sw);lab.appendChild(document.createTextNode('Show on my profile'));
        sw.addEventListener('change',function(){sw.disabled=true;post('/stamps/show',{pursuit:k,show:sw.checked}).then(function(){sw.disabled=false;refresh();});});
        hd.appendChild(lab);box.appendChild(hd);var grid=el('div','tll-st-list');
        it.forEach(function(s){var card=item(s,function(){if(!confirm('Remove '+s.what+'?'))return;post('/stamps/delete',{id:s.id}).then(refresh);});
          /* A single work-trip stamp can stay private while the rest of the pursuit shows (Nancy, 31 Oct). */
          if(WT&&s.workTrip){var pl=el('label');pl.style.cssText='display:flex;gap:6px;align-items:center;font-size:12px;color:#5F5A54;margin-top:4px';var pc=el('input');pc.type='checkbox';pc.checked=!!s.private;pc.style.cssText='width:16px;height:16px;accent-color:#C8325B';
            pl.appendChild(pc);pl.appendChild(document.createTextNode('Keep this one private'));pc.addEventListener('change',function(){pc.disabled=true;post('/stamps/private',{id:s.id,private:pc.checked}).then(function(){refresh();});});var d=card.querySelector('div');(d||card).appendChild(pl);}
          grid.appendChild(card);});box.appendChild(grid);list.appendChild(box);});}
    function refresh(){post('/stamps/mine').then(function(r){if(r&&r.ok)render(r.stamps);});}
    function add(){if(!what.value.trim()&&!wt.checked){msg.textContent='Say what it was.';what.focus();return;}if(!ctry.value.trim()){msg.textContent='Pick a country.';ctry.focus();return;}if(!yr.value){msg.textContent='Add the year.';yr.focus();return;}
      btn.disabled=true;msg.textContent=file.files[0]?'Cleaning and uploading the photo…':'Adding…';
      (file.files[0]?upload(file.files[0]):Promise.resolve('')).then(function(url){return post('/stamps/add',{pursuit:pur.value,what:what.value,country:ctry.value,city:city.value,month:mon.value,year:yr.value,photo:url,workTrip:wt.checked,namedOk:named.checked});})
      .then(function(r){btn.disabled=false;if(r&&r.ok){try{window.dispatchEvent(new CustomEvent('tll:stamp-added',{detail:{country:ctry.value,workTrip:!!r.stamp.workTrip}}));}catch(e){}msg.textContent='Stamped. '+(r.stamp.shown?'It shows on your profile.':'Private until you switch this pursuit on.');what.value='';ctry.value='';named.checked=false;city.value='';mon.value='';yr.value='';file.value='';refresh();}else msg.textContent=(r&&r.error)||'That did not go through. Try again.';})
      .catch(function(){btn.disabled=false;msg.textContent='The photo could not be uploaded. Try another, or add the stamp without a photo.';});}
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();add();});
    f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();e.stopPropagation();add();}},true);
    anchor.insertAdjacentElement('afterend',sec);render(d.stamps);
  });
}
function profile(slug){
  if(document.getElementById('tll-st-pub'))return;
  fetch(API+'/stamps/public?slug='+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||!d.shelves.length||document.getElementById('tll-st-pub'))return;css();
    var s=el('section','tll-st tll-st-pub');s.id='tll-st-pub';s.appendChild(el('p','tll-st-k','Pursuits'));
    d.shelves.forEach(function(g){var box=el('div','tll-st-group'),hd=el('div','tll-st-head'),a=el(g.live===false?'span':'a');if(g.live!==false)a.href='/pursuits/'+g.pursuit;a.style.textDecoration='none';a.style.color='inherit';a.appendChild(badge(g.name,g.count,g.countries));hd.appendChild(a);box.appendChild(hd);
      var grid=el('div','tll-st-list');g.stamps.forEach(function(x){grid.appendChild(item(x));});box.appendChild(grid);s.appendChild(box);});
    var after=document.getElementById('tll-col-pub')||document.getElementById('tll-crew-pub'),main=document.querySelector('main')||document.body;
    if(after)after.insertAdjacentElement('afterend',s);else{var h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(s,an.nextSibling);else main.appendChild(s);}
  }).catch(function(){});
}
function hub(slug){
  var m=document.querySelector('meta[name="robots"]');if(!m){m=document.createElement('meta');m.name='robots';document.head.appendChild(m);}
  m.content='noindex, follow';m.setAttribute('data-tll-hub','pending');
  fetch(API+'/pursuits/status?slug='+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){if(d&&d.ok&&d.indexable){m.content='index, follow';m.setAttribute('data-tll-hub','indexable');}}).catch(function(){});
}
var m=/^\/pursuits\/([^/]+)$/.exec(P);if(m)hub(m[1]);
function run(){if(P==='/edit-profile')editProfile();else{var c=/^\/contributors\/([^/]+)$/.exec(P);if(c)profile(c[1]);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1600);});else setTimeout(run,1600);
setTimeout(run,4000);
})();
/* src/site-layers/tll-album-v1.js */
(function(){
/* Pet passports (/pets/<slug>) borrow the projector for their slide show; the album itself shows on profiles only. */
var m=/^\/contributors\/([^/]+)\/?$/.exec(location.pathname),PROJECTOR_ONLY=!m&&/^\/pets\/[^/]+\/?$/.test(location.pathname);if(!m&&!PROJECTOR_ONLY)return;var SLUG=m?m[1]:'';
/* STAGED until Nancy approves: shows with ?preview=album (remembered in this browser; ?preview=off clears) or a shared ?play= link. Flip PUBLIC to true to launch. */
var PUBLIC=true,q=new URLSearchParams(location.search);try{if(q.get('preview')==='album')localStorage.setItem('tll-preview-album','1');if(q.get('preview')==='off')localStorage.removeItem('tll-preview-album');}catch(e){}
var on=PUBLIC||q.get('preview')==='album';try{on=on||localStorage.getItem('tll-preview-album')==='1';}catch(e){}if(!on)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/album?slug=';
var PENGUIN='<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true"><ellipse cx="32" cy="38" rx="16" ry="20" fill="#0A0B14"/><ellipse cx="32" cy="41" rx="10" ry="15" fill="#FDF9F3"/><circle cx="32" cy="18" r="11" fill="#0A0B14"/><circle cx="28" cy="16" r="2" fill="#FDF9F3"/><circle cx="36" cy="16" r="2" fill="#FDF9F3"/><path d="M29 21l3 3 3-3z" fill="#E9A23B"/><path d="M24 58l5-3M40 58l-5-3" stroke="#E9A23B" stroke-width="3" stroke-linecap="round"/></svg>';
var CSS='.tll-alb{max-width:1120px;margin:40px auto;padding:0 16px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-alb-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}'+
'.tll-alb h2{font:800 clamp(26px,3.6vw,38px)/1.1 "Playfair Display",Georgia,serif;margin:0 0 18px}'+
'.tll-alb-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 18px}@media (min-width:640px){.tll-alb-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media (min-width:1000px){.tll-alb-grid{grid-template-columns:repeat(7,minmax(0,1fr))}}'+
'.tll-alb-mount{position:relative;display:block;width:100%;aspect-ratio:1;background:#F4EEE3;border:10px solid #FBF8F2;box-shadow:0 1px 0 #E0DACE,0 6px 14px rgba(10,11,20,.10);border-radius:3px;padding:0;cursor:pointer;overflow:visible;font:inherit;color:inherit;text-align:left}'+
'.tll-alb-mount img{width:100%;height:100%;object-fit:cover;display:block}'+
'.tll-alb-mount:focus-visible{outline:3px solid #C8325B;outline-offset:3px}'+
'.tll-alb-tape{position:absolute;left:50%;bottom:-14px;transform:translateX(-50%) rotate(-2deg);background:rgba(232,201,120,.85);padding:5px 8px;font:600 10px/1.3 "JetBrains Mono",monospace;letter-spacing:.8px;text-transform:uppercase;white-space:normal;text-align:center;width:max-content;max-width:calc(100% + 8px);color:#0A0B14;box-shadow:0 1px 2px rgba(0,0,0,.12)}'+
'.tll-alb-tape b,.tll-alb-tape small{display:block;white-space:nowrap}.tll-alb-tape small{font-size:9px;font-weight:500;letter-spacing:.5px;text-transform:none;margin-top:2px}'+
'.tll-alb-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;height:100%;color:#9A948B;font:600 12px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;cursor:default}'+
'.tll-alb-play{position:absolute;top:8px;right:8px;background:rgba(10,11,20,.72);color:#fff;border-radius:999px;padding:5px 10px;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px}'+
'.tll-ss{position:fixed;inset:0;z-index:99999;background:#0A0B14;color:#F3EEE6;display:flex;flex-direction:column}'+
'.tll-ss-stage{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;padding:16px}.tll-ss-stage img{max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 0 0 12px #F3EEE6}'+
'.tll-ss-cap{padding:12px 20px 18px;display:flex;flex-wrap:wrap;gap:6px 18px;align-items:baseline;justify-content:space-between}'+
'.tll-ss-cap p{margin:0}.tll-ss-m{font:600 12px/1.4 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#00C9C8}.tll-ss-line{font:800 20px/1.25 "Playfair Display",Georgia,serif}.tll-ss-sub{color:#B9B2A8}'+
'.tll-ss-bar{display:flex;gap:8px;align-items:center}.tll-ss-bar button,.tll-ss-bar a{background:transparent;border:1.5px solid #F3EEE6;color:#F3EEE6;border-radius:4px;min-height:40px;padding:0 12px;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}'+
'.tll-ss-nav{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:96px;border:0;background:transparent;color:#F3EEE6;font-size:40px;cursor:pointer}.tll-ss-prev{left:0}.tll-ss-next{right:0}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-album-v1'))return;var s=el('style');s.id='tll-album-v1';s.textContent=CSS;document.head.appendChild(s);}
/* Loading (1 Nov 2026): each host gets the size it can serve. Cloudinary (member uploads) crops to the square mount (c_fill) or limits the
   stage to w; a Webflow CMS file (Nancy's story heroes and gallery photos) tries its -p- variant for the mount (a lowercase name even for a
   .JPG upload, as Webflow writes it) and goes back to the original on the first error, since variants exist per file and a browser does not
   try another candidate after a 404. Other hosts pass through. The stage img carries no decoding hint: it swaps src on every slide, and an
   async decode could paint a blank frame between two photos. */
function sized(u,w,h){return /res\.cloudinary\.com/.test(u)?u.replace('/upload/','/upload/'+(h?'c_fill,w_'+w+',h_'+h:'c_limit,w_'+w)+',q_auto,f_auto/'):u;}
/* 10 Nov 2026 (week one item 4): a Webflow file's variant comes from tll-img-variants-v1 (the CMS file's site-bucket twin, only widths
   that exist), so the old guess {CMS URL}-p-{w}, which always failed on CMS files, is gone; a file without a known variant keeps its original. */
function wf(u,w){var V=window.__tllImgV;return V?V.pick(u,w):u;}
function fallback(img,orig){if(img.getAttribute('src')===orig)return;img.addEventListener('error',function h(){img.removeEventListener('error',h);img.src=orig;});}
var audio=null,sound=false;
function click(){if(!sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();var n=audio.sampleRate*0.06,b=audio.createBuffer(1,n,audio.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,6)*0.6;var s=audio.createBufferSource();s.buffer=b;s.connect(audio.destination);s.start();}catch(e){}}
window.__tllAlbumShow=function(c,name){return show(c,name);};
function show(c,name){
  var i=0,ss=el('div','tll-ss');ss.setAttribute('role','dialog');ss.setAttribute('aria-modal','true');ss.setAttribute('aria-label',name+', '+c.name+' slide show');
  var stage=el('div','tll-ss-stage'),img=el('img');stage.appendChild(img);ss.appendChild(stage);
  var prev=el('button','tll-ss-nav tll-ss-prev','‹'),next=el('button','tll-ss-nav tll-ss-next','›');prev.setAttribute('aria-label','Previous');next.setAttribute('aria-label','Next');ss.appendChild(prev);ss.appendChild(next);
  var cap=el('div','tll-ss-cap'),txt=el('div'),mono=el('p','tll-ss-m'),line=el('p','tll-ss-line'),sub=el('p','tll-ss-sub');txt.appendChild(mono);txt.appendChild(line);txt.appendChild(sub);cap.appendChild(txt);
  var bar=el('div','tll-ss-bar'),read=el('a','','Read the story'),snd=el('button','','Sound off'),share=el('button','','Share'),close=el('button','','Close');
  bar.appendChild(read);bar.appendChild(snd);bar.appendChild(share);bar.appendChild(close);cap.appendChild(bar);ss.appendChild(cap);
  function draw(){var p=c.photos[i];img.src=sized(p.img,1800);img.alt=p.alt||p.line||c.name;mono.textContent=c.name+' · '+(i+1)+' / '+c.photos.length;line.textContent=p.line||'';sub.textContent=p.sub||'';read.hidden=!p.href;if(p.href)read.href=p.href;
    var n=c.photos[(i+1)%c.photos.length];if(n){var pre=new Image();pre.src=sized(n.img,1800);}}
  function go(d){i=(i+d+c.photos.length)%c.photos.length;click();draw();}
  function end(){document.removeEventListener('keydown',key,true);ss.remove();document.documentElement.style.overflow='';try{var u=new URL(location.href);u.searchParams.delete('play');history.replaceState(null,'',u);}catch(e){}}
  function key(e){if(e.key==='Escape'){e.preventDefault();end();}else if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();go(1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}}
  prev.onclick=function(){go(-1);};next.onclick=function(){go(1);};stage.onclick=function(){go(1);};close.onclick=end;
  snd.onclick=function(){sound=!sound;snd.textContent=sound?'Sound on':'Sound off';if(sound)click();};
  share.onclick=function(){var u=location.origin+location.pathname+'?play='+c.key;try{window.gtag&&gtag('event','slideshow_share',{division:'tll',continent:c.key});}catch(e){}
    if(navigator.share)navigator.share({title:name+' · '+c.name,url:u}).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(u).then(function(){share.textContent='Link copied';});};
  var x0=null;ss.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});ss.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(dx<0?1:-1);x0=null;});
  document.addEventListener('keydown',key,true);document.documentElement.style.overflow='hidden';document.body.appendChild(ss);draw();close.focus();
  try{var u=new URL(location.href);u.searchParams.set('play',c.key);history.replaceState(null,'',u);window.gtag&&gtag('event','slideshow_open',{division:'tll',continent:c.key});}catch(e){}
}
function group(d){var model=d.model||'seven',mc=d.mapCounts||null,by={};d.continents.forEach(function(c){by[c.key]=c;});
  var hc=window.__tllExpatOn&&d.homes&&d.homes.perContinent||null;function merge(key,name,keys){var ps=[],n=0,m=0,h=0,cv=null;keys.forEach(function(k){var c=by[k];if(hc)h+=hc[k]||0;if(!c)return;ps=ps.concat(c.photos);n+=c.countries;if(mc)m+=mc[k]||0;cv=cv||c.cover;});return{key:key,name:name,photos:ps,countries:n,map:mc?m:null,homes:h,cover:cv};}
  var one=function(k){return merge(k,by[k]?by[k].name:k,[k]);};
  var L={seven:[one('africa'),one('antarctica'),one('asia'),one('europe'),one('north-america'),one('oceania'),one('south-america')],
    americas:[one('africa'),merge('america','America',['north-america','south-america']),one('antarctica'),one('asia'),one('europe'),one('oceania')],
    eurasia:[one('africa'),one('antarctica'),merge('eurasia','Eurasia',['europe','asia']),one('north-america'),one('oceania'),one('south-america')],
    olympic:[one('africa'),merge('america','America',['north-america','south-america']),one('asia'),one('europe'),one('oceania')]};
  return L[model]||L.seven;}
var HEAD={seven:'Seven continents, one slide each.',americas:'Six continents, one slide each.',eurasia:'Six continents, one slide each.',olympic:'Five continents, one slide each.'};
function run(){
  if(document.getElementById('tll-alb'))return;
  fetch(API+encodeURIComponent(SLUG)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||!d.continents||!d.continents.length||document.getElementById('tll-alb'))return;
    if(!d.continents.some(function(c){return c.photos.length;}))return;css();var all=d.continents;d.continents=group(d);
    var sec=el('section','tll-alb');sec.id='tll-alb';sec.appendChild(el('p','tll-alb-k','The album'));sec.appendChild(el('h2','',HEAD[d.model]||HEAD.seven));
    var grid=el('div','tll-alb-grid');
    d.continents.forEach(function(c){var b;
      if(c.photos.length){b=el('button','tll-alb-mount');b.type='button';b.setAttribute('aria-label','Play '+c.name+', '+c.photos.length+' photos');
        /* the mount is a square of 150 to 170px, reserved by its aspect-ratio; 400 covers it at 2x */
        var im=el('img');im.src=wf(sized(c.cover.img,400,400),500);im.alt='';im.loading='lazy';im.decoding='async';fallback(im,c.cover.img);b.appendChild(im);b.appendChild(el('span','tll-alb-play','▶ Play'));
        var tp=el('span','tll-alb-tape');tp.appendChild(el('b','',c.name));var nC=c.map!=null&&c.map>0?c.map:c.countries;tp.appendChild(el('small','',c.photos.length+(c.photos.length===1?' photo':' photos')+' · '+nC+(nC===1?' country':' countries')+(c.homes?' · '+c.homes+(c.homes===1?' home':' homes'):'')));b.appendChild(tp);
        b.onclick=function(){show(c,d.name);};}
      else{b=el('div','tll-alb-mount');var e=el('div','tll-alb-empty');if(c.key==='antarctica')e.innerHTML=PENGUIN;e.appendChild(el('span','',c.map?'No photos yet':'Not yet'));b.appendChild(e);var te=el('span','tll-alb-tape');te.appendChild(el('b','',c.name));if(c.map)te.appendChild(el('small','',c.map+(c.map===1?' country':' countries')+(c.homes?' · '+c.homes+(c.homes===1?' home':' homes'):'')));b.appendChild(te);}
      grid.appendChild(b);});
    sec.appendChild(grid);
    var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);
    if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.appendChild(sec);
    var want=new URLSearchParams(location.search).get('play');if(want){var c=d.continents.filter(function(x){return x.key===want&&x.photos.length;})[0];if(c)show(c,d.name);}
  }).catch(function(){});
}
if(!PROJECTOR_ONLY){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,700);});else setTimeout(run,700);}
})();
/* src/site-layers/tll-pros-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/pros';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-pro-label{display:inline-block;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:2px;text-transform:uppercase;color:#C8325B;border:1.5px solid #C8325B;border-radius:2px;padding:3px 8px;margin:0 0 12px}'+
'.tll-pro-box{max-width:680px;margin:36px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #067A79;border-radius:4px;background:#fff;display:flex;gap:14px;align-items:center;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-pro-rek{color:#0A0B14;border-color:#0A0B14;margin-right:8px}.tll-pro-rek a{color:inherit}'+
'.tll-pro-box img{width:56px;height:56px;border-radius:50%;object-fit:cover;flex:none}.tll-pro-box p{margin:0}.tll-pro-k{font:600 11px/1.4 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79}'+
'.tll-pro-box a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-pro-badge{display:inline-flex;gap:6px;align-items:center;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;background:#0A0B14;color:#FDF9F3;border-radius:999px;padding:6px 10px;margin:8px 0}'+
'.tll-pro-badge b{color:#00C9C8;font-weight:600}'+
'.tll-pro-row{max-width:1120px;margin:32px auto;padding:0 16px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-pro-row .tll-pro-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}'+
'.tll-pro-row a.tll-pro-card{display:flex;gap:10px;align-items:center;border:1px solid #E0DACE;border-radius:8px;padding:10px;background:#fff;color:#0A0B14;text-decoration:none}.tll-pro-card img{width:40px;height:40px;border-radius:50%;object-fit:cover}.tll-pro-card small{display:block;color:#5F5A54}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-pros-v1'))return;var s=el('style');s.id='tll-pros-v1';s.textContent=CSS;document.head.appendChild(s);}
function story(pros){
  var main=document.querySelector('main')||document.body,by=main.querySelector('a[href^="/contributors/"]');if(!by)return;
  var slug=(by.getAttribute('href').split('/')[2]||'').replace(/[?#].*$/,''),p=pros.filter(function(x){return x.slug===slug;})[0];if(!p||document.querySelector('.tll-pro-label'))return;css();
  var h1=main.querySelector('h1'),CAT={'move-pros':'Move pros','pet-travel-pros':'Pet travel pros','road-warrior':'Road warrior'};
  if(h1){var lab=el('div','tll-pro-label','From the Pros'+(CAT[p.category]?' · '+CAT[p.category]:''));
    /* Paid or hosted, or a piece about the pro's own paid service: "Reklame for [name]" comes first, the name linked, rel sponsored. */
    if(p.sponsored&&!document.querySelector('.tll-pro-rek')){var rk=el('div','tll-pro-label tll-pro-rek');rk.appendChild(document.createTextNode('Reklame for '));if(p.url){var ra=el('a','',p.linkName);ra.href=p.url;ra.target='_blank';ra.rel='sponsored noopener noreferrer';rk.appendChild(ra);}else rk.appendChild(document.createTextNode(p.linkName));h1.parentNode.insertBefore(rk,h1);h1.parentNode.insertBefore(document.createTextNode(' '),h1);}
    h1.parentNode.insertBefore(lab,h1);}
  var box=el('aside','tll-pro-box');box.setAttribute('aria-label','About the writer');if(p.avatar){var im=el('img');im.src=p.avatar;im.alt='';box.appendChild(im);}
  var t=el('div');t.appendChild(el('p','tll-pro-k','From the Pros'));var line=el('p');line.appendChild(document.createTextNode(p.name+(p.line?', '+p.line:'')+'. '));
  if(p.url){var a=el('a','',p.linkName);a.href=p.url;a.rel=p.rel;a.target='_blank';line.appendChild(a);}t.appendChild(line);box.appendChild(t);
  var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var share=document.querySelector('.tll-story-share-row');
  if(share)share.parentNode.insertBefore(box,share);else if(body)body.insertAdjacentElement('afterend',box);else main.appendChild(box);
}
function profile(pros,slug){var p=pros.filter(function(x){return x.slug===slug;})[0];if(!p||document.querySelector('.tll-pro-badge'))return;css();
  var h1=(document.querySelector('main')||document.body).querySelector('h1');if(!h1)return;var b=el('div','tll-pro-badge');b.appendChild(el('b','','Pro'));if(p.line)b.appendChild(document.createTextNode(p.line));h1.insertAdjacentElement('afterend',b);}
function hub(pros,slug){var list=pros.filter(function(x){return x.pursuit&&x.pursuit.slug===slug;});if(!list.length||document.getElementById('tll-pro-row'))return;css();
  var s=el('section','tll-pro-row');s.id='tll-pro-row';var k=el('p','tll-pro-k','From the Pros');s.appendChild(k);var g=el('div','tll-pro-grid');
  list.forEach(function(p){var a=el('a','tll-pro-card');a.href='/contributors/'+p.slug;if(p.avatar){var im=el('img');im.src=p.avatar;im.alt='';a.appendChild(im);}var d=el('div');d.appendChild(document.createTextNode(p.name));if(p.line)d.appendChild(el('small','',p.line));a.appendChild(d);g.appendChild(a);});
  s.appendChild(g);var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(s,an.nextSibling);else main.appendChild(s);}
var m;
if(!/^\/(stories|contributors|pursuits)\/[^/]+$/.test(P))return;
function run(){fetch(API).then(function(r){return r.ok?r.json():null;}).then(function(d){var pros=d&&d.pros||[];if(!pros.length)return;
  if((m=/^\/stories\/([^/]+)$/.exec(P)))story(pros);else if((m=/^\/contributors\/([^/]+)$/.exec(P)))profile(pros,m[1]);else if((m=/^\/pursuits\/([^/]+)$/.exec(P)))hub(pros,m[1]);}).catch(function(){});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,800);});else setTimeout(run,800);
})();
