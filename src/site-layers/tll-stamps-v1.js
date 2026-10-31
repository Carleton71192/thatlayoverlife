/* tll-stamps-v1 (31 Oct 2026, Value Playbook Phase 2: pursuit stamps and badges). Talks to the Worker (/stamps/*, /pursuits/status);
   while those routes are not live nothing shows and nothing changes.
   /edit-profile: "05C · Pursuit stamps" under My collections: log what, where (country, optional city), when (year, optional month)
     and one photo, per pursuit. Each pursuit has its own "Show on my profile" switch, off until the member turns it on.
   /contributors/<slug>: a badge per shown pursuit (stamps and countries, counted, never typed) and the stamps, year only.
   /pursuits/<slug>: noindex until the Worker says the hub meets the 19 Oct rule (6 live stories, 3 writers, a written intro).
   Photos redrawn on a canvas before upload (no GPS). No data-ms-* element touched; no form or field names changed.
   31 Oct, That Work Trip Life (STAGED: WT_PUBLIC false, shows with ?preview=worktrips, remembered; ?preview=off clears):
   a "Work trip" switch and "I have permission to name them" (off by default: the stamp reads "A work trip" in public).
   Pursuits still in draft are hidden from the list unless previewing. A work-trip stamp tells tll-work-trips-v1, which puts
   the country on the member's map if it is not there yet. Months in the future are refused: post after, not during. */
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
