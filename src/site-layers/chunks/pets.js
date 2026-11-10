/* tll-site-layers-v16 chunk pets: loaded by the core loader on paths matching /^\/(pets\/[^/]+|my-pets|the-paw-passport)$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
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
/* src/site-layers/tll-series-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-wt-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 11px/1.3 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%);margin:0 0 10px;max-width:100%}'+
'.tll-wt-card-tape{position:absolute;top:10px;left:10px;z-index:3;margin:0;font-size:10px;padding:5px 10px}'+
'.tll-sr-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 16px;font:400 14px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-sr-chips button{min-height:44px;padding:0 14px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-sr-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-sr-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-sr-box{max-width:680px;margin:28px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-sr-box ol{margin:8px 0 0;padding-left:20px}.tll-sr-box p{margin:0 0 6px}.tll-sr-box b{font-weight:600}.tll-sr-box small{display:block;color:#5F5A54;margin-top:8px}'+
'.tll-sr-box a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-sr-kit a{margin-right:14px}.tll-sr-kit i{font-style:normal;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#5F5A54;margin-left:4px}'+
'.tll-sr-li{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;background:#0A0B14;color:#FDF9F3!important;text-decoration:none!important;font-weight:600}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-series-v1'))return;var s=el('style');s.id='tll-series-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:x&&x.division||'tll'},x||{}));}catch(e){}}
function tape(text,cls){return el('span','tll-wt-tape'+(cls?' '+cls:''),text);}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
function div(group){return group==='pets'?'paw-passport':'tll';}
function line(box,label,val){if(!val)return;var p=el('p');p.appendChild(el('b','',label+': '));p.appendChild(document.createTextNode(val));box.appendChild(p);}

function labelCards(cards){var by={};cards.forEach(function(c){by[c.slug]=c;});
  Object.keys(by).forEach(function(slug){[].slice.call(document.querySelectorAll('a[href="/stories/'+slug+'"],a[href^="/stories/'+slug+'?"]')).forEach(function(a){
    if(a.closest('.tll-wt-rail')||a.closest('nav,header,footer,.tll-sr-box'))return;var card=a.closest('.w-dyn-item')||a;if(card.querySelector('.tll-wt-card-tape'))return;
    if(getComputedStyle(card).position==='static')card.style.position='relative';card.appendChild(tape(by[slug].label,'tll-wt-card-tape'));card.setAttribute('data-tll-series',by[slug].series);});});}
function chips(series){if(document.getElementById('tll-sr-chips'))return;var have=series.filter(function(s){return s.stories.length;});if(!have.length)return;
  var first=document.querySelector('main .w-dyn-item a[href^="/stories/"]'),list=first&&first.closest('.w-dyn-list');if(!list)return;
  var row=el('div','tll-sr-chips');row.id='tll-sr-chips';row.setAttribute('role','group');row.setAttribute('aria-label','Story series');row.appendChild(el('span','tll-sr-k','Series'));var on='';
  have.forEach(function(s){var b=el('button','',s.name);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){on=on===s.slug?'':s.slug;
    [].slice.call(row.querySelectorAll('button')).forEach(function(x){x.setAttribute('aria-pressed',String(x===b&&on!==''));});
    [].slice.call(list.querySelectorAll('.w-dyn-item')).forEach(function(it){it.hidden=!!on&&it.getAttribute('data-tll-series')!==on;});track('series_filter',{series:on||'all',division:div(s.group)});});row.appendChild(b);});
  list.parentNode.insertBefore(row,list);}

function fieldsBox(d){var f=d.fields||{},s=d.series,box=el('aside','tll-sr-box'),name=d.label.split(' · ')[0];box.setAttribute('aria-label',name);box.appendChild(el('p','tll-sr-k',name));
  if(s==='the-free-evening'){var t=[f.time,f.start?'starting from a '+f.start.toLowerCase():''].filter(Boolean).join(', ');if(t)box.appendChild(el('p','',t));
    if(f.stops&&f.stops.length){var ol=el('ol');f.stops.forEach(function(x){ol.appendChild(el('li','',x.stop+(x.move?' · '+x.move:'')));});box.appendChild(ol);}}
  else if(s==='plus-one-day'){if(f.extraDays)box.appendChild(el('p','',f.extraDays+(f.extraDays===1?' extra day':' extra days')));line(box,'Who paid for what',f.whoPaid);line(box,'Best decision',f.best);line(box,'Worst decision',f.worst);}
  else if(s==='the-first-friend'){var a=[f.yearsThere?f.yearsThere+(f.yearsThere===1?' year in':' years in'):'',f.monthsItTook?'it took '+f.monthsItTook+(f.monthsItTook===1?' month':' months'):''].filter(Boolean).join(', ');if(a)box.appendChild(el('p','',a.charAt(0).toUpperCase()+a.slice(1)+'.'));
    line(box,'Where it happened',f.where);line(box,'What worked',f.worked);line(box,'What did not',f.didNot);}
  else if(s==='the-partner-who-moved-too'){var m=[f.from&&f.to?f.from+' to '+f.to:'',f.years].filter(Boolean).join(', ');if(m)box.appendChild(el('p','',m));line(box,'What happened to my work',f.work);line(box,'What I wish someone had told me',f.wish);}
  else if(s==='moving-back'){var mb=[f.from&&f.to?f.from+' back to '+f.to:'',f.yearsAway?f.yearsAway+' away':''].filter(Boolean).join(', ');if(mb)box.appendChild(el('p','',mb));line(box,'The strangest thing about home now',f.strangest);line(box,'What I kept from abroad',f.kept);}
  else if(s==='the-sitter-was-the-hero'){line(box,'The hero',f.sitter);}
  else if(s==='cats-who-travel'){line(box,'Carrier or harness',f.carrier);line(box,'Where they hid',f.hid);}
  if(f.when)box.appendChild(el('small','',(d.group==='pets'?"Writer's experience, ":'Written ')+f.when));
  return box.children.length>1?box:null;}
function petBox(b){var box=el('aside','tll-sr-box');box.setAttribute('aria-label','Pet-friendly or pet-tolerant?');box.appendChild(el('p','tll-sr-k','Pet-friendly or pet-tolerant?'));
  if(b.stayedAt){var p=el('p');p.appendChild(el('b','','Stayed at: '));if(b.url){var a=el('a','',b.stayedAt);a.href=b.url;a.rel=b.rel;a.target='_blank';p.appendChild(a);}else p.appendChild(document.createTextNode(b.stayedAt));if(b.city)p.appendChild(document.createTextNode(', '+b.city));box.appendChild(p);}
  line(box,'What we paid for the pet',b.paid);line(box,'Size or weight rule',b.sizeRule);line(box,'What made it welcoming',b.welcoming);line(box,'What we would tell the next owner',b.tell);
  box.appendChild(el('small','',"Writer's experience"+(b.when?', '+b.when:'')+'. No business can pay to change or remove a note.'));return box;}
function storyPage(slug){get('/series/story?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||document.getElementById('tll-sr-story'))return;
  var main=document.querySelector('main')||document.body,h1=main.querySelector('h1');var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var wrap=el('div');wrap.id='tll-sr-story';css();
  if(d.series){if(h1&&!document.querySelector('.tll-sr-head-tape')){var t=tape(d.label,'tll-sr-head-tape');h1.parentNode.insertBefore(t,h1);}
    var fb=fieldsBox(d);if(fb)wrap.appendChild(fb);
    if(d.safetyNote){var sn=el('aside','tll-sr-box');sn.appendChild(el('p','tll-sr-k','Safety, from the writer'));sn.appendChild(el('p','',d.safetyNote));wrap.appendChild(sn);}
    var sh=el('div','tll-sr-box'),li=el('a','tll-sr-li','Share on LinkedIn');li.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.origin+location.pathname);li.target='_blank';li.rel='noopener';
    li.addEventListener('click',function(){track('share_click',{channel:'linkedin',series:d.series,division:div(d.group)});});sh.appendChild(li);wrap.appendChild(sh);}
  /* Linked sponsor label (staged with the expat and pet previews): the existing "Reklame for" label gets the sponsor's name as a link. */
  var prev=false;try{prev=localStorage.getItem('tll-preview-pets')==='1'||localStorage.getItem('tll-preview-expat')==='1';}catch(e){}
  if(prev&&d.sponsor){var rk=document.querySelector('[data-tll-reklame]');if(!rk&&h1){rk=el('div','tll-reklame');rk.setAttribute('data-tll-reklame','1');rk.setAttribute('lang','da');h1.parentNode.insertBefore(rk,h1);}
    if(rk&&!rk.querySelector('a')){rk.textContent='Reklame for ';var sa=el('a','',d.sponsor.name);sa.href=d.sponsor.url;sa.target='_blank';sa.rel=d.sponsor.rel;sa.style.color='inherit';sa.addEventListener('click',function(){track('revenue_click',{slot:'sponsor_label',division:div(d.group)});});rk.appendChild(sa);}}
  if(d.petBox)wrap.appendChild(petBox(d.petBox));
  if(d.tripKit&&d.tripKit.length){var k=el('aside','tll-sr-box tll-sr-kit');k.appendChild(el('p','tll-sr-k','Trip Kit · reklamelink'));var p=el('p');
    d.tripKit.forEach(function(x){var a=el('a','',x.label);a.href=x.url;a.rel=x.rel;a.target='_blank';a.addEventListener('click',function(){track('revenue_click',{slot:'trip_kit',label:x.label,division:'tll'});});p.appendChild(a);});
    p.appendChild(el('i','','reklamelink'));k.appendChild(p);wrap.appendChild(k);}
  if(!wrap.children.length)return;var share=document.querySelector('.tll-story-share-row');if(share)share.parentNode.insertBefore(wrap,share);else if(body)body.insertAdjacentElement('afterend',wrap);else main.appendChild(wrap);});}

function run(){var m;
  if((m=/^\/stories\/([^/]+)$/.exec(P))){storyPage(m[1]);return;}
  if(!(P==='/stories'||/^\/countries\/[^/]+$/.test(P)||P==='/for-expats'||P==='/the-paw-passport'||P==='/pursuits/work-trips'))return;
  get('/series').then(function(d){if(!d||!d.ok)return;var cards=[];d.series.forEach(function(s){cards=cards.concat(s.stories);});if(!cards.length)return;css();
    labelCards(cards);if(P==='/stories')chips(d.series);setTimeout(function(){labelCards(cards);},2500);window.__tllSeries=d;});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
})();
