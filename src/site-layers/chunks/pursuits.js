/* tll-site-layers-v16 chunk pursuits: loaded by the core loader on paths matching /^\/pursuits\/[^/]+$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
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
/* src/site-layers/tll-pros-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/pros';
var ROUTE_LIVE=false,pv=/[?&]preview=wire(&|$)/.test(location.search);try{pv=pv||localStorage.getItem('tll-preview-wire')==='1';}catch(e){}
if(!ROUTE_LIVE&&!pv)return;
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
/* src/site-layers/tll-series-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var ROUTES_LIVE=false,pv=/[?&]preview=wire(&|$)/.test(location.search);try{pv=pv||localStorage.getItem('tll-preview-wire')==='1';}catch(e){}
if(!ROUTES_LIVE&&!pv)return;
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
