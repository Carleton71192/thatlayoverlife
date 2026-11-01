/* tll-site-layers-v16 chunk account: loaded by the core loader on paths matching /^\/account$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
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
/* src/site-layers/tll-export-v1.js */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/account')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/export';
var JSZIP='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
var CSS='.tll-exp{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-exp-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}'+
'.tll-exp h3{font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}.tll-exp p{margin:0 0 12px;color:#3a3833}'+
'.tll-exp button{border:0;background:#C8325B;color:#fff;border-radius:4px;min-height:44px;padding:0 18px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-exp button[disabled]{opacity:.6;cursor:wait}'+
'.tll-exp-msg{font-size:13px;color:#5F5A54;margin:8px 0 0}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function lib(){return window.JSZip?Promise.resolve(window.JSZip):new Promise(function(res,rej){var s=document.createElement('script');s.src=JSZIP;s.crossOrigin='anonymous';s.onload=function(){res(window.JSZip);};s.onerror=rej;document.head.appendChild(s);});}
function cname(c){c=String(c||'').toUpperCase();try{return new Intl.DisplayNames(['en'],{type:'region'}).of(c)||c;}catch(e){return c;}}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function csv(rows,cols){var q=function(v){v=v==null?'':Array.isArray(v)?v.join(' '):String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};return cols.join(',')+'\n'+rows.map(function(r){return cols.map(function(c){return q(r[c]);}).join(',');}).join('\n')+'\n';}
function storyPage(s){return '<!doctype html><meta charset="utf-8"><title>'+esc(s.title)+'</title><style>body{max-width:680px;margin:40px auto;padding:0 16px;font:17px/1.6 Georgia,serif;color:#0A0B14}small{color:#5F5A54}</style>'+
  '<h1>'+esc(s.title)+'</h1><p><small>'+esc([s.place,s.trip,s.status==='draft'?'Draft':''].filter(Boolean).join(' · '))+'</small></p>'+(s.excerpt?'<p><em>'+esc(s.excerpt)+'</em></p>':'')+(s.body||'')+(s.signOff?'<p>'+esc(s.signOff)+'</p>':'')+
  (s.link?'<p><small>Online: <a href="'+esc(s.link)+'">'+esc(s.link)+'</a></small></p>':'')+(s.externalUrl?'<p><small>Published at: <a href="'+esc(s.externalUrl)+'">'+esc(s.externalUrl)+'</a></small></p>':'');}
function mapData(){var local=null;try{local=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){}if(local)return Promise.resolve(local);
  var ms=window.$memberstackDom;if(!ms||!ms.getMemberJSON)return Promise.resolve(null);return ms.getMemberJSON().then(function(j){var d=j&&j.data||{};return d.tllStates||null;}).catch(function(){return null;});}
function ext(type,url){if(/png/.test(type))return'png';if(/webp/.test(type))return'webp';if(/gif/.test(type))return'gif';var m=/\.(jpe?g|png|webp|gif)(\?|$)/i.exec(url||'');return m?m[1].toLowerCase().replace('jpeg','jpg'):'jpg';}
function run(){
  if(document.getElementById('tll-exp')||!tok())return;
  var box=el('section','tll-exp');box.id='tll-exp';box.appendChild(el('p','tll-exp-k','Your copy'));box.appendChild(el('h3','','Download everything'));
  box.appendChild(el('p','','Your stories, photos, collections, stamps and map in one zip file. Yours to keep, whatever happens to any app.'));
  var b=el('button','','Download everything');b.type='button';var msg=el('p','tll-exp-msg');msg.setAttribute('aria-live','polite');box.appendChild(b);box.appendChild(msg);
  b.addEventListener('click',function(){b.disabled=true;msg.textContent='Gathering your stories and records…';
    try{window.gtag&&gtag('event','download_everything',{division:'tll'});}catch(e){}
    Promise.all([lib(),fetch(API,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:'{}'}).then(function(r){return r.json();}),mapData()]).then(function(v){
      var Z=v[0],d=v[1],map=v[2];if(!d||!d.ok)throw new Error((d&&d.error)||'The download could not start.');
      var zip=new Z(),root=zip.folder('that-layover-life');
      root.file('README.txt','That Layover Life: your copy\nExported '+d.exportedAt+'\nProfile: '+d.profileLink+'\n\nInside:\n- profile.json: your profile as it is saved\n- stories/: each story as a page you can open in any browser, plus stories.json\n- collections.csv and stamps.csv: open in Excel, Numbers or Google Sheets (JSON copies too)\n- pets.json, companions.json\n- map/: my-map.json (your full map, every country and how you know it), countries.csv (Lived, Stayed, Layover) and map-summary.json\n- places-lived.csv and .json: the places you have lived, with years\n- photos/: every photo, in folders by story, collection, stamp and pet\n\nPrivate collections and stamps are included: this copy is only for you.\n');
      root.file('profile.json',JSON.stringify(d.profile,null,2));
      var st=root.folder('stories');st.file('stories.json',JSON.stringify(d.stories,null,2));d.stories.forEach(function(s){st.file(s.slug+'.html',storyPage(s));});
      root.file('collections.json',JSON.stringify(d.collections,null,2));root.file('collections.csv',csv(d.collections,['collection','country','city','year','caption','shownOnProfile','photos']));
      root.file('stamps.json',JSON.stringify(d.stamps,null,2));root.file('stamps.csv',csv(d.stamps,['pursuit','what','country','city','month','year','workTrip','shownOnProfile','photo']));
      root.file('pets.json',JSON.stringify(d.pets,null,2));root.file('companions.json',JSON.stringify(d.companions,null,2));
      var mf=root.folder('map');mf.file('map-summary.json',JSON.stringify(d.mapSummary,null,2));if(map)mf.file('my-map.json',JSON.stringify(map,null,2));
      /* Expat build: places lived (from the profile) and every country marked on the map, as spreadsheets. */
      var pl=(d.placesLived||[]).map(function(x){return {country:cname(x.c),code:String(x.c||'').toUpperCase(),years:x.years||'',placesIKnowWell:x.knows||'',homeNow:x.now===true?'yes':''};});
      root.file('places-lived.json',JSON.stringify(pl,null,2));root.file('places-lived.csv',csv(pl,['country','code','years','placesIKnowWell','homeNow']));
      if(map&&map.states){var N=window.__tllN2A||{},rows=[];Object.keys(map.states).forEach(function(num){var e=map.states[num]||{};Object.keys(e).forEach(function(t){var tr=(map.travelers||[]).filter(function(x){return x.id===t;})[0];var a2=N[num]||'';
        rows.push({country:a2?cname(a2):num,code:a2||num,traveler:tr?tr.name:t,mark:e[t]==='lived'?'Lived':e[t]==='visited'?'Stayed':e[t]==='layover'?'Layover':e[t]});});});
        mf.file('countries.csv',csv(rows,['country','code','traveler','mark']));}
      var ph=root.folder('photos'),missing=[],done=0,list=d.photos||[];
      var one=function(p){return fetch(p.url,{mode:'cors'}).then(function(r){if(!r.ok)throw 0;return r.blob();}).then(function(blob){ph.file(p.folder+'/'+p.name+'.'+ext(blob.type,p.url),blob);})
        .catch(function(){missing.push(p.folder+'/'+p.name+': '+p.url);}).then(function(){done++;msg.textContent='Photos '+done+' of '+list.length+'…';});};
      var queue=list.slice(),workers=[0,1,2,3].map(function(){return (function next(){var p=queue.shift();return p?one(p).then(next):Promise.resolve();})();});
      return Promise.all(workers).then(function(){if(missing.length)ph.file('not-downloaded.txt','These photos could not be downloaded, so here are their links:\n'+missing.join('\n')+'\n');
        msg.textContent='Packing the zip…';return zip.generateAsync({type:'blob'});}).then(function(blob){
        var a=el('a');a.href=URL.createObjectURL(blob);a.download='that-layover-life-'+((d.profile&&d.profile.slug)||'me')+'-'+d.exportedAt.slice(0,10)+'.zip';document.body.appendChild(a);a.click();
        setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},4000);b.disabled=false;try{window.gtag&&gtag('event','download_complete',{division:'tll',photos:list.length-missing.length});}catch(e){}
        msg.textContent='Done. '+d.stories.length+(d.stories.length===1?' story, ':' stories, ')+(list.length-missing.length)+((list.length-missing.length)===1?' photo':' photos')+(missing.length?' ('+missing.length+' listed as links)':'')+'.';});
    }).catch(function(e){b.disabled=false;msg.textContent=(e&&e.message)||'The download did not finish. Try again.';});
  });
  /* Site owner only: the Paw Passport waitlist (the Worker answers 403 to everyone else, and nothing shows). */
  fetch(API.replace('/export','/paw/waitlist/export'),{method:'POST',headers:{Authorization:'Bearer '+tok()}}).then(function(r){if(r.status!==200)return;var n=r.headers.get('X-Count')||'0';return r.blob().then(function(blob){
    var p=el('p','tll-exp-msg'),a=el('a','','Download the CSV');a.href=URL.createObjectURL(blob);a.download='paw-passport-waitlist.csv';p.appendChild(document.createTextNode('Paw Passport waitlist: '+n+(n==='1'?' sign-up · ':' sign-ups · ')));p.appendChild(a);box.appendChild(p);});}).catch(function(){});
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);
  var after=document.getElementById('tll-wn')||document.getElementById('tll-crew-inbox');
  if(after)after.insertAdjacentElement('afterend',box);else if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1600);});else setTimeout(run,1600);
})();
/* src/site-layers/tll-metrics-v1.js */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/account')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/metrics';
var ROWS=[['travelers','Travelers'],['stories','Stories live'],['countries','Countries covered'],['writers','Writers'],['storiesLast30Days','Stories, last 30 days'],['pets','Pets'],
  ['companionLinks','Companion links'],['collectors','Collectors'],['collectionItems','Collection pieces'],['stampers','Members with stamps'],['stamps','Pursuit stamps'],['pawWaitlist','Paw Passport waitlist']];
var CSS='.tll-met{max-width:760px;margin:24px auto;padding:18px;border:1px solid #E0DACE;border-left:3px solid #067A79;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-met-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}.tll-met h3{font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 12px}'+
'.tll-met-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:0 0 14px}.tll-met-c{border:1px solid #E0DACE;border-radius:4px;padding:10px}'+
'.tll-met-c b{display:block;font:800 26px/1.1 "Playfair Display",Georgia,serif}.tll-met-c span{font-size:13px;color:#5F5A54}.tll-met-c i{display:block;margin-top:4px;font-style:normal;font:600 11px/1 "JetBrains Mono",monospace;color:#067A79}'+
'.tll-met button{border:0;background:#0A0B14;color:#FDF9F3;border-radius:4px;min-height:44px;padding:0 16px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-met small{display:block;color:#5F5A54;margin-top:8px}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function line(hist){var w=640,h=120,keys=[['travelers','#C8325B'],['stories','#067A79']],max=1;hist.forEach(function(d){keys.forEach(function(k){max=Math.max(max,d[k[0]]||0);});});
  var x=function(i){return hist.length<2?w/2:16+i*(w-32)/(hist.length-1);},y=function(v){return h-16-(v/max)*(h-32);};
  var s='<svg viewBox="0 0 '+w+' '+h+'" width="100%" role="img" aria-label="Travelers and stories over time"><line x1="16" y1="'+(h-16)+'" x2="'+(w-16)+'" y2="'+(h-16)+'" stroke="#E0DACE"/>';
  keys.forEach(function(k){s+='<polyline fill="none" stroke="'+k[1]+'" stroke-width="2.5" points="'+hist.map(function(d,i){return x(i).toFixed(1)+','+y(d[k[0]]||0).toFixed(1);}).join(' ')+'"/>';var last=hist[hist.length-1];s+='<text x="'+(w-16)+'" y="'+(y(last[k[0]]||0)-6).toFixed(1)+'" text-anchor="end" font-family="monospace" font-size="11" fill="'+k[1]+'">'+(k[0]==='travelers'?'Travelers ':'Stories ')+(last[k[0]]||0)+'</text>';});
  return s+'</svg>';}
function snapshot(d){var t=d.today,first=d.history[0];var rows=ROWS.map(function(r){var ch=first&&first.date!==t.date?(t[r[0]]-(first[r[0]]||0)):null;return '<tr><td>'+r[1]+'</td><td style="text-align:right;font-weight:700">'+t[r[0]]+'</td><td style="text-align:right;color:#067A79">'+(ch==null?'':(ch>=0?'+':'')+ch+' since '+first.date)+'</td></tr>';}).join('');
  return '<!doctype html><meta charset="utf-8"><title>That Layover Life: metrics '+t.date+'</title><style>body{max-width:720px;margin:40px auto;padding:0 16px;font:16px/1.5 Georgia,serif;color:#0A0B14}table{width:100%;border-collapse:collapse}td{padding:8px 4px;border-bottom:1px solid #E0DACE}h1{font-size:30px;margin:0 0 4px}p{color:#5F5A54}</style>'+
  '<h1>That Layover Life</h1><p>Counted from the live site on '+t.date+'. Totals only. Traffic figures come from Google Analytics separately.</p><table>'+rows+'</table>'+(d.history.length>1?'<h2 style="font-size:18px;margin-top:28px">Growth</h2>'+line(d.history):'')+'<p style="margin-top:24px">www.thatlayover.life</p>';}
function run(){
  if(document.getElementById('tll-met')||!tok())return;
  fetch(API,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:'{}'}).then(function(r){return r.status===200?r.json():null;}).then(function(d){
    if(!d||!d.ok||document.getElementById('tll-met'))return;var s=el('style');s.textContent=CSS;document.head.appendChild(s);
    var box=el('section','tll-met');box.id='tll-met';box.appendChild(el('p','tll-met-k','Only you see this'));box.appendChild(el('h3','','Investor metrics'));
    var g=el('div','tll-met-g'),first=d.history[0];
    ROWS.forEach(function(r){var c=el('div','tll-met-c');c.appendChild(el('b','',String(d.today[r[0]])));c.appendChild(el('span','',r[1]));
      if(first&&first.date!==d.today.date){var ch=d.today[r[0]]-(first[r[0]]||0);if(ch)c.appendChild(el('i','',(ch>=0?'+':'')+ch+' since '+first.date));}g.appendChild(c);});
    box.appendChild(g);if(d.history.length>1){var ch=el('div');ch.innerHTML=line(d.history);box.appendChild(ch);}
    var b=el('button','','Download investor snapshot');b.type='button';b.onclick=function(){var a=el('a');a.href=URL.createObjectURL(new Blob([snapshot(d)],{type:'text/html'}));a.download='that-layover-life-metrics-'+d.today.date+'.html';document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},2000);};
    box.appendChild(b);box.appendChild(el('small','','Counted from the live site. The growth line fills in one point a day from today.'));
    /* "How do you travel most?" answers, this month (members count once; multi-select, so the rows can add up to more). */
    var ts=d.travelStyle||{},months=Object.keys(ts).sort(),cur=months[months.length-1];
    if(cur){var L={'big-trips':'A few big trips a year','short-trips':'Lots of short trips and layovers',abroad:'I live abroad (or did)',work:'For work',pet:'With my pet',pursuit:'For a pursuit'};
      box.appendChild(el('p','tll-met-k','How members travel · '+cur+' · '+ts[cur].members+(ts[cur].members===1?' answer':' answers')));var tg=el('div','tll-met-g');
      Object.keys(L).forEach(function(k){var c=el('div','tll-met-c');c.appendChild(el('b','',String(ts[cur][k]||0)));c.appendChild(el('span','',L[k]));tg.appendChild(c);});box.appendChild(tg);}
    var after=document.getElementById('tll-exp'),main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);
    if(after)after.insertAdjacentElement('afterend',box);else if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);
  }).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,2000);});else setTimeout(run,2000);
})();
/* src/site-layers/tll-work-trips-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var HUB_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='worktrips')localStorage.setItem('tll-preview-worktrips','1');if(q==='off')localStorage.removeItem('tll-preview-worktrips');}catch(e){}
var PREVIEW=q==='worktrips';try{PREVIEW=PREVIEW||localStorage.getItem('tll-preview-worktrips')==='1';}catch(e){}
var N2A={"004":"AF","248":"AX","008":"AL","012":"DZ","016":"AS","020":"AD","024":"AO","660":"AI","010":"AQ","028":"AG","032":"AR","051":"AM","533":"AW","036":"AU","040":"AT","031":"AZ","044":"BS","048":"BH","050":"BD","052":"BB","112":"BY","056":"BE","084":"BZ","204":"BJ","060":"BM","064":"BT","068":"BO","070":"BA","072":"BW","076":"BR","096":"BN","100":"BG","854":"BF","108":"BI","116":"KH","120":"CM","124":"CA","132":"CV","140":"CF","148":"TD","152":"CL","156":"CN","170":"CO","174":"KM","178":"CG","180":"CD","184":"CK","188":"CR","384":"CI","191":"HR","192":"CU","196":"CY","203":"CZ","208":"DK","262":"DJ","212":"DM","214":"DO","218":"EC","818":"EG","222":"SV","226":"GQ","232":"ER","233":"EE","231":"ET","238":"FK","234":"FO","242":"FJ","246":"FI","250":"FR","254":"GF","258":"PF","266":"GA","270":"GM","268":"GE","276":"DE","288":"GH","292":"GI","300":"GR","304":"GL","308":"GD","320":"GT","324":"GN","624":"GW","328":"GY","332":"HT","340":"HN","344":"HK","348":"HU","352":"IS","356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE","376":"IL","380":"IT","388":"JM","392":"JP","400":"JO","398":"KZ","404":"KE","296":"KI","408":"KP","410":"KR","414":"KW","417":"KG","418":"LA","428":"LV","422":"LB","426":"LS","430":"LR","434":"LY","438":"LI","440":"LT","442":"LU","446":"MO","807":"MK","450":"MG","454":"MW","458":"MY","462":"MV","466":"ML","470":"MT","584":"MH","478":"MR","480":"MU","484":"MX","583":"FM","498":"MD","492":"MC","496":"MN","499":"ME","504":"MA","508":"MZ","104":"MM","516":"NA","520":"NR","524":"NP","528":"NL","540":"NC","554":"NZ","558":"NI","562":"NE","566":"NG","570":"NU","578":"NO","512":"OM","586":"PK","585":"PW","275":"PS","591":"PA","598":"PG","600":"PY","604":"PE","608":"PH","616":"PL","620":"PT","630":"PR","634":"QA","638":"RE","642":"RO","643":"RU","646":"RW","659":"KN","662":"LC","670":"VC","882":"WS","674":"SM","678":"ST","682":"SA","686":"SN","688":"RS","690":"SC","694":"SL","702":"SG","703":"SK","705":"SI","090":"SB","706":"SO","710":"ZA","728":"SS","724":"ES","144":"LK","729":"SD","740":"SR","748":"SZ","752":"SE","756":"CH","760":"SY","158":"TW","762":"TJ","834":"TZ","764":"TH","626":"TL","768":"TG","772":"TK","776":"TO","780":"TT","788":"TN","792":"TR","795":"TM","800":"UG","804":"UA","784":"AE","826":"GB","840":"US","858":"UY","860":"UZ","548":"VU","862":"VE","704":"VN","732":"EH","887":"YE","894":"ZM","716":"ZW","531":"CW","798":"TV","652":"BL","535":"BQ","074":"BV","166":"CC","162":"CX","831":"GG","312":"GP","239":"GS","316":"GU","334":"HM","833":"IM","086":"IO","832":"JE","136":"KY","663":"MF","580":"MP","474":"MQ","500":"MS","574":"NF","666":"PM","612":"PN","654":"SH","744":"SJ","534":"SX","796":"TC","260":"TF","581":"UM","336":"VA","092":"VG","850":"VI","876":"WF","175":"YT","900":"XK"};
window.__tllN2A=window.__tllN2A||N2A;
var CSS='.tll-wt-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 11px/1.3 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%);margin:0 0 10px;max-width:100%}'+
'.tll-wt-card-tape{position:absolute;top:10px;left:10px;z-index:3;margin:0;font-size:10px;padding:5px 10px}'+
'.tll-wt{font:400 16px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14;background:#FDF9F3}.tll-wt [hidden]{display:none!important}'+
'.tll-wt-in{max-width:1120px;margin:0 auto;padding:40px 16px}.tll-wt-k{font:600 11px/1.4 "JetBrains Mono",monospace;letter-spacing:2px;text-transform:uppercase;color:#067A79;margin:0 0 10px}'+
'.tll-wt h2{font:800 clamp(28px,4vw,44px)/1.05 "Playfair Display",Georgia,serif;margin:0 0 14px}.tll-wt h3{font:800 24px/1.15 "Playfair Display",Georgia,serif;margin:0 0 12px}'+
'.tll-wt-sec{border-top:2px solid #0A0B14;padding:22px 0 0;margin:34px 0 0}.tll-wt-lede{max-width:62ch;color:#3a3833}'+
'.tll-wt-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);gap:14px;overflow-x:auto;padding:6px 0 10px}'+
'.tll-wt-rail a{position:relative;display:block;border:1px solid #E0DACE;border-radius:6px;background:#fff;color:#0A0B14;text-decoration:none;overflow:hidden}'+
'.tll-wt-rail .tll-wt-ph{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:#E0DACE}.tll-wt-rail b{display:block;font:800 19px/1.2 "Playfair Display",Georgia,serif;padding:12px 12px 4px}.tll-wt-rail small{display:block;padding:0 12px 12px;color:#5F5A54}'+
'.tll-wt-wall{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px}.tll-wt-wall a{border:1px dashed #C8B9A6;border-radius:6px;padding:10px;background:#fff;color:#0A0B14;text-decoration:none}.tll-wt-wall b{display:block}.tll-wt-wall small{color:#5F5A54}'+
'.tll-wt-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;counter-reset:s}.tll-wt-steps div{border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:16px}.tll-wt-steps b{display:block;font:800 20px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-wt-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;background:#C8325B;color:#fff;text-decoration:none;font-weight:600;margin:8px 8px 0 0}.tll-wt-btn.li{background:#0A0B14}'+
'.tll-wt-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 8px}.tll-wt-empty{color:#5F5A54;font-style:italic}'+
'.tll-wt-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 16px}.tll-wt-chips button{min-height:40px;padding:0 14px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-wt-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-wt-box{max-width:680px;margin:28px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-wt-box ol{margin:8px 0 0;padding-left:20px}.tll-wt-box p{margin:0 0 6px}'+
'.tll-wt-kit a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px;margin-right:14px}.tll-wt-kit i{font-style:normal;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#5F5A54;margin-left:4px}'+
'@media (max-width:760px){.tll-wt-steps{grid-template-columns:1fr}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-work-trips-v1'))return;var s=el('style');s.id='tll-work-trips-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tape(text,cls){return el('span','tll-wt-tape'+(cls?' '+cls:''),text);}
function liBtn(url,where){var a=el('a','tll-wt-btn li','Share on LinkedIn');a.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(url);a.target='_blank';a.rel='noopener';a.addEventListener('click',function(){track('linkedin_share',{where:where});});return a;}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}

/* 1. Map */
function a2(name){var n=String(name||'').trim().toLowerCase();if(!n)return'';try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var num in N2A){var c=N2A[num],x=c==='XK'?'kosovo':String(dn.of(c)||'').toLowerCase();if(x===n)return num;}}catch(e){}return'';}
window.addEventListener('tll:stamp-added',function(ev){var d=ev.detail||{};if(!d.workTrip)return;var num=a2(d.country),ms=window.$memberstackDom;if(!num||!ms||!ms.getMemberJSON)return;
  ms.getMemberJSON().then(function(j){var json=(j&&j.data)||{},r=json.tllStates;
    if(!r||r.v!==2||!r.states){try{r=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){r=null;}}
    if(!r||r.v!==2||!r.states)r={v:2,travelers:[{id:'t1',name:'Me',color:'#F0507A',pet:false}],states:{}};
    var me=(r.travelers||[]).filter(function(t){return t&&!t.pet;})[0],id=me?me.id:'t1',e=Object.assign({},r.states[num]||{});
    if(e[id])return;e[id]='visited';r.states[num]=e;var t=Date.now();json.tllStates=r;json.tllStatesAt=t;
    return ms.updateMemberJSON({json:json}).then(function(){try{localStorage.setItem('tllStates',JSON.stringify(r));localStorage.setItem('tllStatesAt',String(t));}catch(e){}
      var m=document.querySelector('#tll-st .tll-st-msg');if(m)m.textContent+=' '+d.country+' is on your map now.';});
  }).catch(function(){});});

/* 3. The hub */
var INTRO_DRAFT='Work sends you somewhere for three days of meetings. This is for the hours around them: the free evening after the last session, and the one day you add on your own time. Written by members once they are home, never during. Nobody names a company, a client or a colleague unless they have permission.';
function hub(d){if(document.getElementById('tll-wt-hub'))return;css();var sec=el('section','tll-wt');sec.id='tll-wt-hub';var inn=el('div','tll-wt-in');sec.appendChild(inn);
  if(!HUB_PUBLIC)inn.appendChild(el('p','tll-wt-flag','Preview · not live'));inn.appendChild(el('p','tll-wt-k','Work trips'));inn.appendChild(el('h2','',(d.hub&&d.hub.name)||'That Work Trip Life'));
  var intro=String(d.hub&&d.hub.intro||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();if(intro)inn.appendChild(el('p','tll-wt-lede',intro));else{inn.appendChild(el('p','tll-wt-lede',INTRO_DRAFT));inn.appendChild(el('p','tll-wt-flag','Draft intro · Nancy to approve or rewrite'));}
  inn.appendChild(liBtn(location.origin+location.pathname,'hub'));
  d.series.forEach(function(s){var b=el('div','tll-wt-sec');b.appendChild(tape(s.name));b.appendChild(el('h3','',s.slug==='the-free-evening'?'A few hours after the last session':'The work trip, plus one day'));
    if(!s.stories.length)b.appendChild(el('p','tll-wt-empty','No stories in this series yet.'));else{var r=el('div','tll-wt-rail');s.stories.slice(0,12).forEach(function(c){var a=el('a');a.href='/stories/'+c.slug;var im=el(c.image?'img':'div','tll-wt-ph');if(c.image){im.src=c.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(tape(c.label,'tll-wt-card-tape'));a.appendChild(el('b','',c.title));if(c.excerpt)a.appendChild(el('small','',c.excerpt.slice(0,120)));r.appendChild(a);});b.appendChild(r);}inn.appendChild(b);});
  var cc=el('div','tll-wt-sec');cc.appendChild(el('h3','','Conference Cities'));cc.appendChild(el('p','tll-wt-empty','Copenhagen first. The guide is a draft until a writer who went fills it in.'));inn.appendChild(cc);
  var w=el('div','tll-wt-sec');w.appendChild(el('h3','','The stamps wall'));var wall=d.wall||{stamps:[]};
  if(!wall.stamps.length)w.appendChild(el('p','tll-wt-empty','No work-trip stamps shown yet.'));else{w.appendChild(el('p','tll-wt-lede',wall.countries+(wall.countries===1?' country':' countries')+' so far, from members who chose to show their work trips.'));var g=el('div','tll-wt-wall');
    wall.stamps.forEach(function(s){var a=el('a');a.href='/contributors/'+s.memberSlug;a.appendChild(el('b','',[s.city,s.country].filter(Boolean).join(', ')));a.appendChild(el('small','',[s.what,s.year,s.member].filter(Boolean).join(' · ')));g.appendChild(a);});w.appendChild(g);}inn.appendChild(w);
  if(d.roadWarriors&&d.roadWarriors.length){var rw=el('div','tll-wt-sec');rw.appendChild(el('h3','','Road warrior picks'));var rg=el('div','tll-wt-wall');d.roadWarriors.forEach(function(p){var a=el('a');a.href='/contributors/'+p.slug;a.appendChild(el('b','',p.name));a.appendChild(el('small','',[p.line,p.employer].filter(Boolean).join(' · ')));rg.appendChild(a);});rw.appendChild(rg);inn.appendChild(rw);}
  var j=el('div','tll-wt-sec');j.appendChild(el('h3','','How to join'));var st=el('div','tll-wt-steps');
  [['Join free','A profile, your map and your stamps. No card.'],['Add a work-trip stamp','Switch on Work trip. Your profile says "A work trip" unless you choose to name the company.'],['Back home? Good. Now tell us.','Write The Free Evening or Plus One Day for the city you just left.']].forEach(function(x){var c=el('div');c.appendChild(el('b','',x[0]));c.appendChild(el('p','',x[1]));st.appendChild(c);});
  j.appendChild(st);var jb=el('a','tll-wt-btn','Join free');jb.href='/signup?utm_source=work-trips&utm_medium=hub&utm_campaign=tll';jb.addEventListener('click',function(){track('work_trips_join');});j.appendChild(jb);
  var sb=el('a','tll-wt-btn li','Write your story');sb.href='/submit?utm_source=work-trips&utm_medium=hub&utm_campaign=tll';j.appendChild(sb);inn.appendChild(j);
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.appendChild(sec);}

function run(){if(P!=='/pursuits/work-trips'||!(HUB_PUBLIC||PREVIEW))return;
  get('/work-trips').then(function(d){if(!d||!d.ok)return;css();hub(d);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
})();
