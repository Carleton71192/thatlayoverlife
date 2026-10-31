/* tll-expat-v1 (31 Oct 2026, expat build on the Value Playbook: "The move, the first friend and the partner who moved too").
   STAGED: EX_PUBLIC false; shows with ?preview=expat (remembered in this browser; ?preview=off clears).
   /contributors/<slug>  "Lived in [n]" beside the map numbers (from countries marked Lived on the map, never typed; hidden when the
                         member shows ranges), tap for Places I have lived with years (today's home only if they switched Show home
                         base on). Milestone badges, never a ranking. "My moves" slide show, only if the member switched it on.
                         Person JSON-LD keeps the country of the home base, never the city.
   /edit-profile         "05E · Your moves": Show home base, Open to coffee with newcomers (the Living Library), My moves, Moved back,
                         and one optional line per home for the show.
   /for-expats           The landing in one scroll: hero, three promises, the three series rows, the Living Library (opted-in members
                         only, shuffled per session, no contact details on cards, Get in touch after sign-in, Report on every card),
                         practical links, the Layover Club line. Empty parts are left out, never shown empty.
   Counts are computed, never typed. City or country only. No data-ms-* element touched; nav and footer untouched. */
(function(){
var EX_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='expat')localStorage.setItem('tll-preview-expat','1');if(q==='off')localStorage.removeItem('tll-preview-expat');}catch(e){}
var ON=EX_PUBLIC||q==='expat';try{ON=ON||localStorage.getItem('tll-preview-expat')==='1';}catch(e){}
window.__tllExpatOn=ON;if(!ON)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var FLAGS='https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/';
var BADGES={'first-move-abroad':'First move abroad','lived-on-two-continents':'Lived on 2 continents','moved-back':'Moved back'};
var CSS='.tll-ex{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-ex [hidden]{display:none!important}'+
'.tll-ex-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-ex-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 8px}'+
'.tll-ex-stat{background:none;border:0;padding:0;text-align:left;cursor:pointer;color:inherit;font:inherit;min-height:44px}.tll-ex-stat:focus-visible{outline:2px solid #C8325B;outline-offset:2px}'+
'.tll-ex-pop{max-width:760px;margin:12px 0;padding:14px 16px;border:1px solid #E0DACE;border-radius:6px;background:#fff}.tll-ex-pop ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}.tll-ex-pop li{display:flex;gap:10px;align-items:center}.tll-ex-pop img{width:24px;height:24px}.tll-ex-pop small{color:#5F5A54;display:block}'+
'.tll-ex-badges{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.tll-ex-badge{font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:1.5px solid #0A0B14;border-radius:999px;padding:8px 12px}'+
'.tll-ex-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;border:0;background:#C8325B;color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-ex-btn.ink{background:#0A0B14;color:#FDF9F3}.tll-ex-btn.ghost{background:#fff;color:#0A0B14;border:1.5px solid #0A0B14}'+
'.tll-ex-sec{background:#FDF9F3}.tll-ex-in{max-width:1120px;margin:0 auto;padding:44px 16px}.tll-ex h2{font:800 clamp(28px,4vw,46px)/1.05 "Playfair Display",Georgia,serif;margin:0 0 12px}.tll-ex h3{font:800 24px/1.15 "Playfair Display",Georgia,serif;margin:0 0 12px}'+
'.tll-ex-lede{max-width:62ch;color:#3a3833;margin:0 0 16px}.tll-ex-small{font:600 12px/1.4 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;color:#5F5A54;margin:10px 0 0}'+
'.tll-ex-prom{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.tll-ex-prom a{display:block;border-top:2px solid #0A0B14;padding:14px 0 0;color:#0A0B14;text-decoration:none}.tll-ex-prom b{display:block;font:800 20px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-ex-row{border-top:2px solid #0A0B14;padding:22px 0 0;margin:30px 0 0}.tll-ex-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);gap:14px;overflow-x:auto;padding:6px 0 10px}'+
'.tll-ex-rail a{position:relative;display:block;border:1px solid #E0DACE;border-radius:6px;background:#fff;color:#0A0B14;text-decoration:none;overflow:hidden}.tll-ex-rail .ph{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:#E0DACE}.tll-ex-rail b{display:block;font:800 19px/1.2 "Playfair Display",Georgia,serif;padding:12px}'+
'.tll-ex-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 10px/1.3 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;padding:5px 10px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%)}.tll-ex-rail .tll-ex-tape{position:absolute;top:10px;left:10px}'+
'.tll-ex-books{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}.tll-ex-book{border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:14px;display:flex;flex-direction:column;gap:6px}'+
'.tll-ex-book header{display:flex;gap:10px;align-items:center}.tll-ex-book header img{width:48px;height:48px;border-radius:50%;object-fit:cover}.tll-ex-book b{font:800 19px/1.2 "Playfair Display",Georgia,serif}.tll-ex-book small{color:#5F5A54;display:block}'+
'.tll-ex-book .acts{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:8px}.tll-ex-book .rep{font-size:13px;color:#5F5A54}'+
'.tll-ex details{border:1px dashed #C8B9A6;border-radius:6px;padding:12px 14px;background:#fff;margin:0 0 16px}.tll-ex summary{cursor:pointer;font-weight:600;min-height:28px}'+
'.tll-ex-set label{display:flex;gap:10px;align-items:flex-start;border:1px solid #E0DACE;border-radius:6px;padding:10px 12px;background:#fff;margin:0 0 8px;cursor:pointer}.tll-ex-set input[type=checkbox]{width:18px;height:18px;margin-top:2px;accent-color:#C8325B;flex:none}'+
'.tll-ex-set input[type=text]{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;min-height:44px}'+
'@media (max-width:760px){.tll-ex-prom{grid-template-columns:1fr}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-expat-v1'))return;var s=el('style');s.id='tll-expat-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
function cname(c){c=String(c||'').toUpperCase();try{return new Intl.DisplayNames(['en'],{type:'region'}).of(c)||c;}catch(e){return c;}}
function plural(n,one,many){return n+' '+(n===1?one:many);}

/* Profile */
function profile(slug){get('/album?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||!d.homes||document.getElementById('tll-ex-lived'))return;css();var h=d.homes;
  var S=document.querySelector('[data-pf5="stats"]'),ranges=S&&/under 10|-something/.test(S.textContent||'');
  if(S&&h.total>0&&!ranges){var cell=el('div'),b=el('button','tll-ex-stat');b.type='button';b.id='tll-ex-lived';b.setAttribute('aria-expanded','false');
    b.appendChild(el('div','pf5-stat-v',String(h.total)));b.appendChild(el('div','pf5-stat-k',h.total===1?'COUNTRY LIVED IN':'COUNTRIES LIVED IN'));cell.appendChild(b);
    var info=S.querySelector('.pf5-stat-i');if(info)S.insertBefore(cell,info);else S.appendChild(cell);
    var pop=el('div','tll-ex tll-ex-pop');pop.hidden=true;pop.id='tll-ex-lived-list';b.setAttribute('aria-controls',pop.id);pop.appendChild(el('p','tll-ex-k','Places I have lived'));
    if(h.places.length){var ul=el('ul');h.places.forEach(function(p){var li=el('li'),im=el('img');im.src=FLAGS+p.c+'.svg';im.alt='';li.appendChild(im);var t=el('div');t.appendChild(document.createTextNode(cname(p.c)));if(p.years)t.appendChild(el('small','',p.years));li.appendChild(t);ul.appendChild(li);});pop.appendChild(ul);}
    else pop.appendChild(el('p','','Counted from the map. The places and years appear here once they are added on the profile.'));
    S.insertAdjacentElement('afterend',pop);b.onclick=function(){pop.hidden=!pop.hidden;b.setAttribute('aria-expanded',String(!pop.hidden));};}
  var head=S||document.querySelector('main h1');
  if(head&&h.badges&&h.badges.length){var bd=el('div','tll-ex tll-ex-badges');bd.setAttribute('aria-label','Milestones');h.badges.forEach(function(k){bd.appendChild(el('span','tll-ex-badge',BADGES[k]||k));});head.insertAdjacentElement('afterend',bd);}
  if(d.moves&&window.__tllAlbumShow){var mv=el('div','tll-ex');var btn=el('button','tll-ex-btn ink','▶ My moves');btn.type='button';mv.style.margin='10px 0';mv.appendChild(btn);(head||document.body).insertAdjacentElement('afterend',mv);
    btn.onclick=function(){track('slideshow_play',{show:'my-moves'});window.__tllAlbumShow({key:'moves',name:'My moves',photos:d.moves.map(function(m){return{img:m.img||FLAGS+m.c+'.svg',alt:m.alt||cname(m.c),line:m.line||cname(m.c),sub:[cname(m.c),m.years].filter(Boolean).join(' · '),href:m.href};})},d.name);};}
}).catch(function(){});
  /* Person schema: the home base keeps its country only. */
  [].slice.call(document.querySelectorAll('script[type="application/ld+json"]')).forEach(function(s){try{var j=JSON.parse(s.textContent);if(j&&j.homeLocation&&j.homeLocation.name){var parts=String(j.homeLocation.name).split(',');j.homeLocation.name=parts[parts.length-1].trim();s.textContent=JSON.stringify(j);}}catch(e){}});
}

/* Edit profile */
function editProfile(){var anchor=document.getElementById('tll-alb-set')||document.getElementById('tll-st')||document.getElementById('tll-col');if(!anchor||document.getElementById('tll-ex-set'))return;
  post('/album/settings',{read:true}).then(function(s){if(!s||!s.ok||document.getElementById('tll-ex-set'))return;css();
    var sec=el('section','ep-sec tll-ex tll-ex-set');sec.id='tll-ex-set';sec.appendChild(el('h2','ep-eb','05E · Your moves'));
    sec.appendChild(el('p','ep-lede','For the places you have lived. Everything here is off until you switch it on.'));
    var msg=el('p','tll-ex-small');msg.setAttribute('aria-live','polite');
    function sw(key,label,sub){var l=el('label'),i=el('input');i.type='checkbox';i.checked=s[key]===true;l.appendChild(i);var t=el('span');t.appendChild(el('b','',label));if(sub){t.appendChild(el('br'));t.appendChild(el('small','',sub));}l.appendChild(t);
      i.addEventListener('change',function(){var b={};b[key]=i.checked;i.disabled=true;post('/album/settings',b).then(function(r){i.disabled=false;msg.textContent=r&&r.ok?'Saved.':'That did not save. Try again.';if(!(r&&r.ok))i.checked=!i.checked;});});sec.appendChild(l);}
    sw('showHomeBase','Show my home base on my profile','City and country only. Off: your profile and cards leave it out.');
    sw('coffee','Open to coffee with newcomers','Puts your card in the Living Library on For Expats. No contact details on the card; people reach you through your profile after they sign in.');
    sw('moves','Show "My moves" on my profile','A slide show, one slide per place you have lived, in order.');
    sw('movedBack','I moved back','Adds the Moved back milestone to your profile.');
    if(s.desks&&s.desks.length){sec.appendChild(el('p','tll-ex-k','One line per home, for My moves (optional)'));var lines=Object.assign({},s.moveLines||{}),t0=null;
      s.desks.forEach(function(dk){var l=el('label');l.style.display='block';l.appendChild(el('span','',cname(dk.c)+(dk.years?' · '+dk.years:'')));var i=el('input');i.type='text';i.maxLength=90;i.value=lines[dk.c]||'';i.placeholder='The moving boxes won.';l.appendChild(i);sec.appendChild(l);
        i.addEventListener('input',function(){lines[dk.c]=i.value;clearTimeout(t0);t0=setTimeout(function(){post('/album/settings',{moveLines:lines}).then(function(r){msg.textContent=r&&r.ok?'Saved.':'That did not save.';});},900);});});}
    sec.appendChild(msg);anchor.insertAdjacentElement('afterend',sec);});}

/* The Living Library */
function shuffle(list){var seed;try{seed=sessionStorage.getItem('tll-ll-seed');if(!seed){seed=String(Math.floor(Math.random()*1e9));sessionStorage.setItem('tll-ll-seed',seed);}}catch(e){seed=String(Math.floor(Math.random()*1e9));}
  var x=Number(seed)||1,a=list.slice();for(var i=a.length-1;i>0;i--){x=(x*1103515245+12345)%2147483648;var j=x%(i+1),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function library(books){var signed=!!tok(),wrap=el('div','tll-ex-row');wrap.id='living-library';wrap.appendChild(el('p','tll-ex-k','The Living Library'));wrap.appendChild(el('h3','','People you can borrow for coffee'));
  var det=el('details'),sum=el('summary','','Borrow a book: how it works');det.appendChild(sum);
  [['Every card is a member who moved to this city and said yes to coffee with newcomers. Think of them as a book you can borrow for an hour.'],
   ['Good to ask: how they made their first friend here, which neighborhood felt like home, what they wish they had known in month one.'],
   ['Please do not ask for legal, immigration or tax advice, for their address or workplace, or for favors they did not offer. For rules, use the official sources on our guides.'],
   ['Saying thank you: buy the coffee. Nobody is paid through That Layover Life, so please do not offer money.']].forEach(function(t){det.appendChild(el('p','',t[0]));});
  wrap.appendChild(det);var g=el('div','tll-ex-books');
  shuffle(books).forEach(function(b){var c=el('article','tll-ex-book'),h=el('header');if(b.avatar){var im=el('img');im.src=b.avatar;im.alt='';im.loading='lazy';h.appendChild(im);}var hn=el('div');hn.appendChild(el('b','',b.name));
    var sub=[b.homeCity,b.years?b.years.replace(/now/i,'today'):''].filter(Boolean).join(' · ');if(sub)hn.appendChild(el('small','',sub));h.appendChild(hn);c.appendChild(h);
    if(b.knowsWell.length)c.appendChild(el('p','','Knows well: '+b.knowsWell.join('; ')));if(b.languages.length)c.appendChild(el('small','','Speaks '+b.languages.join(', ')));if(b.interests.length)c.appendChild(el('small','','Into '+b.interests.join(', ')));
    if(b.stories.length){var p=el('p');p.appendChild(document.createTextNode('Wrote: '));b.stories.forEach(function(s,i){var a=el('a','',s.title);a.href='/stories/'+s.slug;p.appendChild(a);if(i<b.stories.length-1)p.appendChild(document.createTextNode(' · '));});c.appendChild(p);}
    var acts=el('div','acts'),go=el('a','tll-ex-btn'+(signed?'':' ghost'),signed?'Get in touch':'Sign in to get in touch');go.href=signed?'/contributors/'+b.slug+'#contact':'/login';go.addEventListener('click',function(){track('living_library_contact',{signed:signed});});acts.appendChild(go);
    var rep=el('a','rep','Report');rep.href='/contact?subject='+encodeURIComponent('Report a Living Library card: '+b.slug);acts.appendChild(rep);c.appendChild(acts);g.appendChild(c);});
  wrap.appendChild(g);return wrap;}

/* For Expats landing */
function landing(){if(document.getElementById('tll-ex-land'))return;Promise.all([get('/series?group=expat'),get('/living-library')]).then(function(v){if(document.getElementById('tll-ex-land'))return;css();
  var series=(v[0]&&v[0].series||[]).filter(function(s){return s.stories.length;}),books=v[1]&&v[1].books||[];
  var sec=el('section','tll-ex tll-ex-sec');sec.id='tll-ex-land';var inn=el('div','tll-ex-in');sec.appendChild(inn);
  if(!EX_PUBLIC)inn.appendChild(el('p','tll-ex-flag','Preview · not live · copy is draft'));
  inn.appendChild(el('p','tll-ex-k','For people who moved abroad'));inn.appendChild(el('h2','','Your homes count too.'));
  inn.appendChild(el('p','tll-ex-lede','For the people who fill their passports and have to get a new one. Mark the places you have lived, keep the move as a story, and find the people who did it before you.'));
  var cta=el('a','tll-ex-btn','Add the places you’ve lived');cta.href='/the-map?mark=lived&utm_source=for-expats&utm_medium=hero&utm_campaign=tll';cta.addEventListener('click',function(){track('signup_start',{from:'for-expats'});});inn.appendChild(cta);
  inn.appendChild(el('p','tll-ex-small','Free. No card. 16+.'));
  var pr=el('div','tll-ex-row');pr.appendChild(el('p','tll-ex-k','The expat group without the comment section'));var pg=el('div','tll-ex-prom');
  var proms=[[series.length?'#tll-ex-series':'/stories','Stories from people who moved','The first friend, the partner who moved too, the move back home, told by the people who lived it.'],
    ['/countries','Pages with their sources','Practical pages link the official source and say when we last checked it.']];
  if(books.length)proms.push(['#living-library','People you can borrow for coffee','Members who said yes to coffee with newcomers. No contact details on cards, no paid places.']);
  proms.forEach(function(p){var a=el('a');a.href=p[0];a.appendChild(el('b','',p[1]));a.appendChild(el('span','',p[2]));pg.appendChild(a);});pr.appendChild(pg);inn.appendChild(pr);
  if(series.length){var sr=el('div');sr.id='tll-ex-series';series.forEach(function(s){var row=el('div','tll-ex-row');row.appendChild(el('h3','',s.name));var r=el('div','tll-ex-rail');
    s.stories.slice(0,12).forEach(function(c){var a=el('a');a.href='/stories/'+c.slug;var im=el(c.image?'img':'div','ph');if(c.image){im.src=c.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(el('span','tll-ex-tape',c.label));a.appendChild(el('b','',c.title));r.appendChild(a);});row.appendChild(r);sr.appendChild(row);});inn.appendChild(sr);}
  if(books.length)inn.appendChild(library(books));
  var pr2=el('div','tll-ex-row');pr2.appendChild(el('p','tll-ex-k','Moving with a pet'));var pa=el('a','tll-ex-btn ghost','The Paw Passport');pa.href='/the-paw-passport?utm_source=for-expats&utm_medium=practical&utm_campaign=paw-passport';
  pa.addEventListener('click',function(){track('practical_click',{division:'paw-passport',to:'the-paw-passport'});});pr2.appendChild(pa);inn.appendChild(pr2);
  var club=el('div','tll-ex-row');var cp=el('p','');cp.appendChild(document.createTextNode('That Layover Life stays free because readers chip in. '));var ca=el('a','','The Layover Club');ca.href='/support#layover-club';ca.addEventListener('click',function(){track('revenue_click',{slot:'layover_club',from:'for-expats'});});cp.appendChild(ca);club.appendChild(cp);inn.appendChild(club);
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.insertBefore(sec,main.firstChild);});}

function run(){var m;
  if((m=/^\/contributors\/([^/]+)$/.exec(P)))profile(m[1]);
  else if(P==='/edit-profile')editProfile();
  else if(P==='/for-expats')landing();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1800);});else setTimeout(run,1800);
if(P==='/edit-profile')setTimeout(run,5200);
})();
