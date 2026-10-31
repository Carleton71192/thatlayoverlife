/* tll-paw-v1 (31 Oct 2026, Value Playbook Phase 8: Paw Passport waitlist and QR landing, no prices). STAGED until the trademark
   clearance search is clear: shows only with ?preview=paw (remembered; ?preview=off clears) or a QR link (?qr=...) while PUBLIC
   is false. /the-paw-passport only.
   1. Waitlist card: email, pet name, what they want (the guide, a plush travel buddy), one consent box; one email when it is
      ready. Sent to the Worker (POST /paw/waitlist), which keeps it private.
   2. QR landing (?qr=mini or ?qr=big, printed on each toy): "Where did your travel buddy go?" Signed-in members add the trip as a
      Dog Travel stamp (country, city, year, one photo, GPS removed in the browser) through the stamps the site already has;
      everyone else can join free or join the waitlist.
   Events carry division paw-passport. No prices anywhere. No data-ms-* element touched. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/the-paw-passport')return;
var PUBLIC=false,q=new URLSearchParams(location.search),QR=(q.get('qr')||'').toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,20);
try{if(q.get('preview')==='paw')localStorage.setItem('tll-preview-paw','1');if(q.get('preview')==='off')localStorage.removeItem('tll-preview-paw');}catch(e){}
var on=PUBLIC||q.get('preview')==='paw'||!!QR;try{on=on||localStorage.getItem('tll-preview-paw')==='1';}catch(e){}if(!on)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var TOYS={mini:'Mini travel buddy',big:'Big travel buddy'};
var CSS='.tll-paw{max-width:760px;margin:28px auto;padding:18px;border:1px solid #E0DACE;border-radius:6px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-paw-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}.tll-paw h3{font:800 24px/1.15 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-paw p{margin:0 0 12px;color:#3a3833}.tll-paw-f{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tll-paw-f .w{grid-column:1/-1}'+
'.tll-paw label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#5F5A54}.tll-paw label.c{flex-direction:row;align-items:flex-start;gap:8px;color:#0A0B14;font-size:14px}'+
'.tll-paw input[type=email],.tll-paw input[type=text],.tll-paw input[type=number],.tll-paw input[type=file]{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;min-height:44px}'+
'.tll-paw input[type=checkbox]{width:18px;height:18px;accent-color:#C8325B;margin-top:2px;flex:none}.tll-paw-hp{position:absolute;left:-9999px}'+
'.tll-paw button,.tll-paw a.b{border:0;background:#C8325B;color:#fff;border-radius:4px;min-height:44px;padding:0 18px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;display:inline-flex;align-items:center;text-decoration:none}'+
'.tll-paw-msg{font-size:13px;color:#5F5A54;margin:8px 0 0}.tll-paw-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 8px}'+
'@media (max-width:560px){.tll-paw-f{grid-template-columns:1fr}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'paw-passport'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function field(f,lbl,type,wide,attrs){var l=el('label',wide?'w':'',lbl),i=el('input');i.type=type;Object.keys(attrs||{}).forEach(function(k){i.setAttribute(k,attrs[k]);});l.appendChild(i);f.appendChild(l);return i;}
function box(k,h,p){var b=el('section','tll-paw');if(!PUBLIC)b.appendChild(el('p','tll-paw-flag','Preview · not live'));b.appendChild(el('p','tll-paw-k',k));b.appendChild(el('h3','',h));if(p)b.appendChild(el('p','',p));return b;}
function waitlist(source){
  var b=box('Paw Passport · coming','Be first when it is ready.','The EU pet travel guide and a plush travel buddy for your dog. No prices yet. We email you once, when it is ready.');
  var f=el('div','tll-paw-f');f.setAttribute('role','group');f.setAttribute('aria-label','Join the Paw Passport waitlist');
  var email=field(f,'Email','email',false,{autocomplete:'email',required:''}),pet=field(f,"Your pet's name (optional)",'text',false,{maxlength:'40'});
  var g=el('label','c w'),gi=el('input');gi.type='checkbox';gi.checked=true;g.appendChild(gi);g.appendChild(document.createTextNode('The EU pet travel guide (PDF)'));f.appendChild(g);
  var p=el('label','c w'),pi=el('input');pi.type='checkbox';pi.checked=true;p.appendChild(pi);p.appendChild(document.createTextNode('A plush travel buddy'));f.appendChild(p);
  var c=el('label','c w'),ci=el('input');ci.type='checkbox';c.appendChild(ci);c.appendChild(document.createTextNode('Email me when it is ready. Nothing else, and you can say stop any time.'));f.appendChild(c);
  var hp=el('input','tll-paw-hp');hp.type='text';hp.tabIndex=-1;hp.autocomplete='off';hp.setAttribute('aria-hidden','true');f.appendChild(hp);
  var btn=el('button','','Join the waitlist');btn.type='button';var w=el('div','w');w.appendChild(btn);f.appendChild(w);b.appendChild(f);
  var msg=el('p','tll-paw-msg');msg.setAttribute('aria-live','polite');b.appendChild(msg);
  btn.addEventListener('click',function(){var ints=[];if(gi.checked)ints.push('guide');if(pi.checked)ints.push('plush');btn.disabled=true;
    fetch(API+'/paw/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.value,pet:pet.value,interests:ints,consent:ci.checked,source:source,website:hp.value})})
    .then(function(r){return r.json();}).then(function(d){btn.disabled=false;if(d&&d.ok){msg.textContent="You're on the list. One email when it is ready.";track('paw_waitlist_join',{source:source});email.value='';}else msg.textContent=(d&&d.error)||'That did not go through. Try again.';})
    .catch(function(){btn.disabled=false;msg.textContent='That did not go through. Try again.';});});
  return b;}
function upload(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var s=Math.min(1,2000/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej('read');},'image/jpeg',0.88);};im.onerror=function(){rej('read');};im.src=u;})
  .then(function(blob){var fd=new FormData();fd.append('file',blob,'buddy.jpg');fd.append('upload_preset','tll_photos');fd.append('folder','tll/stamps');return fetch('https://api.cloudinary.com/v1_1/idonvlow/image/upload',{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){if(!j.secure_url)throw 'up';return j.secure_url;});});}
function qrPanel(){
  var toy=TOYS[QR]||'Travel buddy';track('paw_qr_scan',{toy:QR});
  var b=box('Paw Passport · '+toy,'Where did your travel buddy go?','Add the trip as a stamp on your Dog Travel page: the country, the year and one photo. Private until you choose to show it.');
  if(!tok()){var a=el('a','b','Join free to add the stamp');a.href='/signup?utm_source=qr&utm_medium=plush&utm_campaign=paw-passport';b.appendChild(a);b.appendChild(el('p','tll-paw-msg','Already a member? Log in, then scan again.'));return b;}
  var f=el('div','tll-paw-f');var ctry=field(f,'Country','text',false,{list:'tll-paw-c',autocomplete:'off'}),city=field(f,'City (optional)','text',false,{maxlength:'60'}),yr=field(f,'Year','number',false,{min:'1990',max:String(new Date().getFullYear()),value:String(new Date().getFullYear())}),ph=field(f,'One photo (optional)','file',false,{accept:'image/*'});
  var dl=el('datalist');dl.id='tll-paw-c';try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var x=65;x<91;x++)for(var y=65;y<91;y++){var cc=String.fromCharCode(x,y),n=dn.of(cc);if(n&&n!==cc){var o=el('option');o.value=n;dl.appendChild(o);}}}catch(e){}f.appendChild(dl);
  var btn=el('button','','Add the stamp');btn.type='button';var w=el('div','w');w.appendChild(btn);f.appendChild(w);b.appendChild(f);var msg=el('p','tll-paw-msg');msg.setAttribute('aria-live','polite');b.appendChild(msg);
  btn.addEventListener('click',function(){if(!ctry.value.trim()){msg.textContent='Pick a country.';return;}btn.disabled=true;msg.textContent=ph.files[0]?'Cleaning and uploading the photo…':'Adding…';
    (ph.files[0]?upload(ph.files[0]):Promise.resolve('')).then(function(url){return fetch(API+'/stamps/add',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:JSON.stringify({pursuit:'dog-travel',what:toy,country:ctry.value,city:city.value,year:yr.value,photo:url})}).then(function(r){return r.json();});})
    .then(function(d){btn.disabled=false;if(d&&d.ok){msg.textContent='Stamped. See it under Pursuit stamps on your profile settings.';track('paw_qr_stamp',{toy:QR});}else msg.textContent=(d&&d.error)||'That did not go through.';})
    .catch(function(){btn.disabled=false;msg.textContent='The photo could not be uploaded. Try again without it.';});});
  return b;}
function css(){if(document.getElementById('tll-paw-v1'))return;var s=el('style');s.id='tll-paw-v1';s.textContent=CSS;document.head.appendChild(s);}
function run(){if(document.getElementById('tll-paw-wrap'))return;css();var wrap=el('div');wrap.id='tll-paw-wrap';
  if(QR)wrap.appendChild(qrPanel());wrap.appendChild(waitlist(QR?'qr:'+QR:'the-paw-passport'));
  var main=document.querySelector('main')||document.body,hero=main.querySelector('.tll-paw-hero')||main.querySelector('h1');var an=hero&&(hero.closest('section')||hero);
  if(an&&an.parentNode)an.parentNode.insertBefore(wrap,an.nextSibling);else main.appendChild(wrap);if(QR)wrap.scrollIntoView({block:'start'});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,900);});else setTimeout(run,900);
})();
