/* tll-collections-v1 (31 Oct 2026, Nancy: "Add postcards and shot glasses, private by default, build it"; "Private by default with
   opt in"). Souvenir collections. Talks to the Worker (/collections/*); while those routes are not live nothing shows.
   /edit-profile: "My collections" under 04 Your crew. Add an item (collection, country, optional city, year, caption, photo);
     each collection has its own "Show on my profile" switch, off until the member turns it on. Photos are redrawn on a canvas
     before upload (no EXIF, no GPS) and go to Cloudinary (unsigned preset tll_photos, folder tll/collections).
   /contributors/<slug>: a "Collections" shelf per collection the member chose to show, countries counted, never typed.
   Year only, city only. No data-ms-* element touched; no form or field names changed. */
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
function tile(i,onDel){var t=el('div','tll-col-it');if(i.photo){var im=el('img');im.src=i.photo.replace('/upload/','/upload/c_fill,w_400,h_400,q_auto,f_auto/');im.alt=(i.categoryName||'')+', '+i.country;im.loading='lazy';t.appendChild(im);}
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
    var file=el('input');file.type='file';file.accept='image/jpeg,image/png,image/webp,image/heic';field('Photo (optional)',file,true);
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
      btn.disabled=true;msg.textContent=file.files[0]?'Cleaning and uploading the photo…':'Adding…';
      (file.files[0]?upload(file.files[0]):Promise.resolve('')).then(function(url){
        return post('/collections/add',{category:cat.value,own:own.value,country:ctry.value,city:city.value,year:year.value,caption:cap.value,photo:url});
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
