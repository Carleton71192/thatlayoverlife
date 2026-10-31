/* tll-pet-passport-v1 (31 Oct 2026, pet build: "Pet owners and the Paw Passport"). STAGED: PP_PUBLIC false; shows with
   ?preview=pets (remembered in this browser; ?preview=off clears).
   /pets/<slug>        The Paw Passport: stamps by country (counted, never typed), the firsts strip, the pet's own counter with a
                       flag map, a slide show of photos from stories the pet is tagged in, "Travels with" the owner, Forever
                       traveler (a small paw mark, opt-in by the owner). Private or members-only passports show a short note and
                       noindex instead. LinkedIn share link, no SDK.
   /my-pets            "Passport details" per pet: home city, birthday month, status, who can see it, firsts, the counter.
   /the-paw-passport   The landing in one scroll: hero, value strip, Paw Passports, the three series, the five newest
                       "Pet-friendly or pet-tolerant?" notes, Pet travel pros, rules last checked with official links.
                       The EU guide's Buy button stays hidden until Nancy fills the link and confirms the guide is checked.
   Never where a pet is now. City or country only, after the trip. No vet, medical or legal advice. Events carry division
   paw-passport. No data-ms-* element touched; nav and footer untouched. */
(function(){
var PP_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='pets')localStorage.setItem('tll-preview-pets','1');if(q==='off')localStorage.removeItem('tll-preview-pets');}catch(e){}
var ON=PP_PUBLIC||q==='pets';try{ON=ON||localStorage.getItem('tll-preview-pets')==='1';}catch(e){}if(!ON)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var FLAGS='https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/';
var GUIDE_URL='';/* Nancy: the Ko-fi or Stripe link for the EU pet guide, only once it has been checked against Regulation (EU) 2026/131. */
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var FIRSTS=[['train','First train'],['ferry','First ferry'],['flight','First flight'],['snow','First snow'],['beach','First beach'],['border','First border']];
var CSS='.tll-pp{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-pp [hidden]{display:none!important}'+
'.tll-pp-in{max-width:1120px;margin:0 auto;padding:36px 16px}.tll-pp-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-pp-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 8px}'+
'.tll-pp h2{font:800 clamp(28px,4vw,46px)/1.05 "Playfair Display",Georgia,serif;margin:0 0 12px}.tll-pp h3{font:800 22px/1.15 "Playfair Display",Georgia,serif;margin:0 0 10px}'+
'.tll-pp-sec{border-top:2px solid #0A0B14;padding:20px 0 0;margin:28px 0 0}.tll-pp-chips{display:flex;flex-wrap:wrap;gap:8px}.tll-pp-chip{display:inline-flex;gap:6px;align-items:center;border:1px solid #E0DACE;border-radius:999px;padding:6px 10px;background:#fff}.tll-pp-chip img{width:18px;height:18px}'+
'.tll-pp-firsts{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px}.tll-pp-first{border:1px dashed #C8B9A6;border-radius:6px;padding:10px;background:#FDF9F3}.tll-pp-first b{display:block}.tll-pp-first small{color:#5F5A54}'+
'.tll-pp-count{font:800 44px/1 "Playfair Display",Georgia,serif}.tll-pp-paw{display:inline-flex;gap:6px;align-items:center;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;border:1.5px solid #0A0B14;border-radius:999px;padding:7px 12px;margin:0 0 12px}'+
'.tll-pp-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;border:0;background:#C8325B;color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;margin:6px 8px 0 0}.tll-pp-btn.ink{background:#0A0B14;color:#FDF9F3}.tll-pp-btn.ghost{background:#fff;color:#0A0B14;border:1.5px solid #0A0B14}'+
'.tll-pp-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(200px,1fr);gap:12px;overflow-x:auto;padding:6px 0 10px}.tll-pp-rail a{position:relative;display:block;border:1px solid #E0DACE;border-radius:6px;background:#fff;color:#0A0B14;text-decoration:none;overflow:hidden}'+
'.tll-pp-rail .ph{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:#E0DACE}.tll-pp-rail b{display:block;font:800 18px/1.2 "Playfair Display",Georgia,serif;padding:10px 12px 2px}.tll-pp-rail small{display:block;padding:0 12px 10px;color:#5F5A54}'+
'.tll-pp-tape{position:absolute;top:10px;left:10px;display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 10px/1.3 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;padding:5px 10px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%)}'+
'.tll-pp-notes{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}.tll-pp-note{border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:14px}.tll-pp-note p{margin:0 0 6px}.tll-pp-note small{color:#5F5A54}'+
'.tll-pp-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.tll-pp-strip p{border-top:2px solid #0A0B14;padding:12px 0 0;margin:0;font:800 19px/1.25 "Playfair Display",Georgia,serif}'+
'.tll-pp-lock{max-width:680px;margin:40px auto;padding:24px;border:1px solid #E0DACE;border-radius:6px;background:#fff;text-align:center}'+
'.tll-pp-ed{border:1px solid #E0DACE;border-radius:8px;background:#fff;padding:14px;margin:14px 0}.tll-pp-ed label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#5F5A54;margin:0 0 8px}'+
'.tll-pp-ed input[type=text],.tll-pp-ed input[type=number],.tll-pp-ed select{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;min-height:44px}'+
'.tll-pp-g2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tll-pp-fr{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:6px;align-items:end;margin:0 0 6px}'+
'@media (max-width:760px){.tll-pp-strip{grid-template-columns:1fr}.tll-pp-g2,.tll-pp-fr{grid-template-columns:1fr}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-pet-passport-v1'))return;var s=el('style');s.id='tll-pet-passport-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'paw-passport'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
function a2(name){var n=String(name||'').toLowerCase();try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var x=65;x<91;x++)for(var y=65;y<91;y++){var c=String.fromCharCode(x,y);if(String(dn.of(c)||'').toLowerCase()===n)return c.toLowerCase();}}catch(e){}return'';}
function cname(c){try{return new Intl.DisplayNames(['en'],{type:'region'}).of(String(c).toUpperCase())||c;}catch(e){return c;}}
function noindex(){var m=document.querySelector('meta[name="robots"]');if(!m){m=el('meta');m.name='robots';document.head.appendChild(m);}m.content='noindex, follow';}
function mount(sec){var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.insertBefore(sec,main.firstChild);}

/* The pet's page */
function petPage(slug){get('/pets/public?slug='+encodeURIComponent(slug)+(tok()?'&member=1':'')).then(function(d){if(!d||!d.ok||document.getElementById('tll-pp-page'))return;css();
  if(d.private){noindex();var main=document.querySelector('main')||document.body;[].slice.call(main.children).forEach(function(c){c.hidden=true;});
    var box=el('section','tll-pp tll-pp-lock');box.id='tll-pp-page';box.appendChild(el('h3','',d.membersOnly?'This Paw Passport is for members':'This Paw Passport is private'));
    if(d.membersOnly){var a=el('a','tll-pp-btn','Sign in');a.href='/login';box.appendChild(a);}main.appendChild(box);return;}
  var sec=el('section','tll-pp');sec.id='tll-pp-page';var inn=el('div','tll-pp-in');sec.appendChild(inn);if(!PP_PUBLIC)inn.appendChild(el('p','tll-pp-flag','Preview · not live'));
  if(d.forever)inn.appendChild(el('span','tll-pp-paw','🐾 Forever traveler'));
  inn.appendChild(el('p','tll-pp-k','Paw Passport'+(d.homeCity?' · '+d.homeCity:'')));
  var s1=el('div','tll-pp-sec');s1.appendChild(el('h3','',d.count?d.name+', '+d.count+(d.count===1?' country':' countries'):'Stamps'));
  if(d.countries.length){var ch=el('div','tll-pp-chips');d.countries.forEach(function(n){var c=el('span','tll-pp-chip'),code=a2(n);if(code){var im=el('img');im.src=FLAGS+code+'.svg';im.alt='';c.appendChild(im);}c.appendChild(document.createTextNode(n));ch.appendChild(c);});s1.appendChild(ch);}
  else s1.appendChild(el('p','','The first stamp goes here after the first trip.'));inn.appendChild(s1);
  if(d.firsts.length){var s2=el('div','tll-pp-sec');s2.appendChild(el('h3','','Firsts'));var g=el('div','tll-pp-firsts');d.firsts.forEach(function(f){var c=el('div','tll-pp-first');c.appendChild(el('b','',f.label));var sub=[f.where,f.when].filter(Boolean).join(' · ');if(sub)c.appendChild(el('small','',sub));g.appendChild(c);});s2.appendChild(g);inn.appendChild(s2);}
  if(d.pursuit){var s3=el('div','tll-pp-sec');s3.appendChild(el('p','tll-pp-k',d.pursuit.label));s3.appendChild(el('div','tll-pp-count',String(d.pursuit.count)));
    if(d.pursuit.countries.length){var pc=el('div','tll-pp-chips');d.pursuit.countries.forEach(function(c){var x=el('span','tll-pp-chip'),im=el('img');im.src=FLAGS+c+'.svg';im.alt='';x.appendChild(im);x.appendChild(document.createTextNode(cname(c)));pc.appendChild(x);});s3.appendChild(pc);}inn.appendChild(s3);}
  var photos=[];d.album.forEach(function(c){photos=photos.concat(c.photos);});
  if(photos.length&&window.__tllAlbumShow){var s4=el('div','tll-pp-sec');s4.appendChild(el('h3','','The slide show'));s4.appendChild(el('p','',d.album.map(function(c){return c.name+' · '+c.photos.length;}).join('   ')));
    var b=el('button','tll-pp-btn ink','▶ Play');b.type='button';b.onclick=function(){track('slideshow_play',{show:'pet'});window.__tllAlbumShow({key:'pet',name:d.name,photos:photos},d.name);};s4.appendChild(b);inn.appendChild(s4);}
  if(d.stories.length){var s5=el('div','tll-pp-sec');s5.appendChild(el('h3','','In these stories'));var r=el('div','tll-pp-rail');d.stories.forEach(function(st){var a=el('a');a.href='/stories/'+st.slug;var im=el(st.image?'img':'div','ph');if(st.image){im.src=st.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(el('b','',st.title));r.appendChild(a);});s5.appendChild(r);inn.appendChild(s5);}
  var s6=el('div','tll-pp-sec');var tw=el('p');tw.appendChild(document.createTextNode('Travels with '));var oa=el('a','',d.owner.name);oa.href='/contributors/'+d.owner.slug;tw.appendChild(oa);s6.appendChild(tw);
  var li=el('a','tll-pp-btn ghost','Share on LinkedIn');li.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.origin+location.pathname);li.target='_blank';li.rel='noopener';li.onclick=function(){track('share_click',{channel:'linkedin',page:'pet'});};s6.appendChild(li);inn.appendChild(s6);
  mount(sec);});}

/* The editor on /my-pets */
function editor(){if(document.getElementById('tll-pp-eds'))return;post('/pets/mine').then(function(d){if(!d||!d.ok||!d.pets.length||document.getElementById('tll-pp-eds'))return;css();
  var wrap=el('section','tll-pp');wrap.id='tll-pp-eds';var inn=el('div','tll-pp-in');wrap.appendChild(inn);inn.appendChild(el('p','tll-pp-k','Passport details'));
  d.pets.forEach(function(p){var box=el('div','tll-pp-ed');box.appendChild(el('h3','',p.name));var msg=el('p','');msg.setAttribute('aria-live','polite');msg.style.cssText='font-size:13px;color:#5F5A54';
    function save(b){b.id=p.id;post('/pets/update',b).then(function(r){msg.textContent=r&&r.ok?'Saved.':(r&&r.error)||'That did not save. Try again.';});}
    function fld(label,node){var l=el('label','',label);l.appendChild(node);return l;}
    var g=el('div','tll-pp-g2'),hc=el('input');hc.type='text';hc.maxLength=60;hc.value=p.homeCity;hc.placeholder='Copenhagen';hc.onchange=function(){save({homeCity:hc.value});};g.appendChild(fld('Home city',hc));
    var bm=el('select');bm.appendChild(el('option','','Birthday month (optional)'));MONTHS.forEach(function(m,i){var o=el('option','',m);o.value=String(i+1);if(p.birthdayMonth===i+1)o.selected=true;bm.appendChild(o);});bm.value=p.birthdayMonth?String(p.birthdayMonth):'';bm.onchange=function(){save({birthdayMonth:bm.value||null});};g.appendChild(fld('Birthday month',bm));
    var vs=el('select');[['public','Everyone'],['members','Members only'],['private','Only me']].forEach(function(o){var x=el('option','',o[1]);x.value=o[0];vs.appendChild(x);});vs.value=p.visibility;vs.onchange=function(){save({visibility:vs.value});};g.appendChild(fld('Who can see this passport',vs));
    var st=el('select');[['traveling','Traveling'],['forever','Forever traveler']].forEach(function(o){var x=el('option','',o[1]);x.value=o[0];st.appendChild(x);});st.value=p.status;st.onchange=function(){save({status:st.value});};g.appendChild(fld('Status',st));box.appendChild(g);
    box.appendChild(el('p','','Forever traveler is for a pet who has died. The page stays, with a small paw mark, and we never send birthday reminders.')).style.cssText='font-size:13px;color:#5F5A54';
    box.appendChild(el('p','tll-pp-k','Firsts'));var firsts=(p.firsts||[]).slice(),rows=el('div');
    function draw(){rows.textContent='';FIRSTS.concat([['own','Your own first']]).forEach(function(fk){var cur=firsts.filter(function(f){return f.k===fk[0];})[0]||{k:fk[0],label:fk[0]==='own'?'':fk[1],where:'',when:''};var r=el('div','tll-pp-fr');
      var lab=el('input');lab.type='text';lab.value=fk[0]==='own'?cur.label:fk[1];lab.disabled=fk[0]!=='own';lab.placeholder='First gondola';var wh=el('input');wh.type='text';wh.maxLength=60;wh.value=cur.where;wh.placeholder='City or country';
      var wn=el('input');wn.type='text';wn.maxLength=20;wn.value=cur.when;wn.placeholder='May 2025';r.appendChild(fld(fk[0]==='own'?'Your own first':'',lab));r.appendChild(fld('Where',wh));r.appendChild(fld('When',wn));
      [lab,wh,wn].forEach(function(i){i.onchange=function(){firsts=firsts.filter(function(f){return f.k!==fk[0];});if((fk[0]!=='own'||lab.value.trim())&&(wh.value.trim()||wn.value.trim()))firsts.push({k:fk[0],label:lab.value,where:wh.value,when:wn.value});save({firsts:firsts});};});rows.appendChild(r);});}
    draw();box.appendChild(rows);
    box.appendChild(el('p','tll-pp-k','Their own counter'));var g2=el('div','tll-pp-g2'),pl=el('input');pl.type='text';pl.maxLength=40;pl.value=p.pursuitLabel;pl.placeholder='Beaches sniffed';var pn=el('input');pn.type='number';pn.min='0';pn.value=String(p.pursuitCount||0);
    var pcs=el('input');pcs.type='text';pcs.value=p.pursuitCountries;pcs.placeholder='Country codes, e.g. dk, se, de';g2.appendChild(fld('Counter name',pl));g2.appendChild(fld('Count',pn));box.appendChild(g2);box.appendChild(fld('Where it counted (for the flag map)',pcs));
    pl.onchange=function(){save({pursuitLabel:pl.value});};pn.onchange=function(){save({pursuitCount:Number(pn.value)||0});};pcs.onchange=function(){save({pursuitCountries:pcs.value});};
    var v=el('a','tll-pp-btn ghost','See the passport');v.href='/pets/'+p.slug;box.appendChild(v);box.appendChild(msg);inn.appendChild(box);});
  mount(wrap);});}

/* The landing */
function landing(){if(document.getElementById('tll-pp-land'))return;Promise.all([get('/pets/featured'),get('/series?group=pets'),get('/pets/notes'),get('/pros')]).then(function(v){if(document.getElementById('tll-pp-land'))return;css();
  var pets=v[0]&&v[0].pets||[],series=(v[1]&&v[1].series||[]).filter(function(s){return s.stories.length;}),notes=v[2]&&v[2].notes||[],pros=(v[3]&&v[3].pros||[]).filter(function(p){return p.category==='pet-travel-pros';});
  var sec=el('section','tll-pp');sec.id='tll-pp-land';sec.style.background='#FDF9F3';var inn=el('div','tll-pp-in');sec.appendChild(inn);if(!PP_PUBLIC)inn.appendChild(el('p','tll-pp-flag','Preview · not live · hero line is Nancy’s pick'));
  inn.appendChild(el('p','tll-pp-k','The Paw Passport'));inn.appendChild(el('h2','','Every pet deserves a passport.'));
  var cta=el('a','tll-pp-btn','Start your pet’s passport');cta.href='/my-pets?utm_source=the-paw-passport&utm_medium=hero&utm_campaign=paw-passport';cta.onclick=function(){track('signup_start',{from:'the-paw-passport'});};inn.appendChild(cta);
  var strip=el('div','tll-pp-strip');['For the cat who did not want to go, and went anyway.','For the dog who stayed home and still gets the slide show.','For the train ride where he finally fell asleep.'].forEach(function(t){strip.appendChild(el('p','',t));});var ss=el('div','tll-pp-sec');ss.appendChild(strip);inn.appendChild(ss);
  if(pets.length){var s1=el('div','tll-pp-sec');s1.appendChild(el('h3','','Paw Passports'));var r=el('div','tll-pp-rail');pets.forEach(function(p){var a=el('a');a.href='/pets/'+p.slug;var im=el('img','ph');im.src=p.avatar;im.alt='';im.loading='lazy';a.appendChild(im);a.appendChild(el('b','',p.name+(p.forever?' 🐾':'')));if(p.count)a.appendChild(el('small','',p.count+(p.count===1?' country':' countries')));r.appendChild(a);});s1.appendChild(r);inn.appendChild(s1);}
  series.forEach(function(s){var row=el('div','tll-pp-sec');row.appendChild(el('h3','',s.name));var r=el('div','tll-pp-rail');s.stories.slice(0,12).forEach(function(c){var a=el('a');a.href='/stories/'+c.slug;var im=el(c.image?'img':'div','ph');if(c.image){im.src=c.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(el('span','tll-pp-tape',c.label));a.appendChild(el('b','',c.title));r.appendChild(a);});row.appendChild(r);inn.appendChild(row);});
  if(notes.length){var s3=el('div','tll-pp-sec');s3.appendChild(el('h3','','Pet-friendly or pet-tolerant?'));var g=el('div','tll-pp-notes');notes.forEach(function(n){var b=n.box,c=el('div','tll-pp-note');var top=[b.stayedAt,b.city].filter(Boolean).join(', ');if(top)c.appendChild(el('b','',top));
    if(b.welcoming)c.appendChild(el('p','',b.welcoming));c.appendChild(el('small','',"Writer's experience"+(b.when?', '+b.when:'')));var a=el('a','','Read the story');a.href='/stories/'+n.story;a.style.display='block';c.appendChild(a);g.appendChild(c);});s3.appendChild(g);inn.appendChild(s3);}
  if(pros.length){var s4=el('div','tll-pp-sec');s4.appendChild(el('h3','','Pet travel pros'));var r4=el('div','tll-pp-rail');pros.forEach(function(p){var a=el('a');a.href='/contributors/'+p.slug;if(p.avatar){var im=el('img','ph');im.src=p.avatar;im.alt='';a.appendChild(im);}a.appendChild(el('b','',p.name));if(p.line)a.appendChild(el('small','',p.line));r4.appendChild(a);});s4.appendChild(r4);inn.appendChild(s4);}
  var s5=el('div','tll-pp-sec');s5.appendChild(el('h3','','The rules, from the source'));var rp=el('p');rp.appendChild(document.createTextNode('Rules last checked 31 October 2026: '));
  [['EU pet travel rules (EUR-Lex)','https://eur-lex.europa.eu/eli/reg_del/2026/131/oj'],['DSB, pets on the train','https://www.dsb.dk/find-produkter-og-services/medbringe-din-hund-eller-kaledyr/']].forEach(function(l,i){var a=el('a','',l[0]);a.href=l[1];a.target='_blank';a.rel='noopener';rp.appendChild(a);if(!i)rp.appendChild(document.createTextNode(' · '));});s5.appendChild(rp);
  s5.appendChild(el('p','','We report what the rules say and link them. For your own trip, check with your vet and the operator.'));
  if(GUIDE_URL){var gb=el('a','tll-pp-btn','Buy the EU pet guide');gb.href=GUIDE_URL;gb.target='_blank';gb.rel='noopener';gb.onclick=function(){track('revenue_click',{slot:'eu_pet_guide'});};s5.appendChild(gb);}inn.appendChild(s5);
  mount(sec);});}

function run(){var m;if((m=/^\/pets\/([^/]+)$/.exec(P)))petPage(m[1]);else if(P==='/my-pets')editor();else if(P==='/the-paw-passport')landing();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1500);});else setTimeout(run,1500);
if(P==='/my-pets')setTimeout(run,4500);
})();
