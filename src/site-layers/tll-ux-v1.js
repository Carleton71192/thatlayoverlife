/* tll-ux-v1 (31 Oct 2026, "User flows, UX and design system"). STAGED: UX_PUBLIC false; shows with ?preview=ux (remembered in this
   browser; ?preview=off clears). Goal: every visitor reaches the first stamp on their own map, and every page has a next step.
   Story pages   Hero photo at most 60vh (50vh on phones) so the story's first line shows on a 390x844 screen. "In this story"
                 under the dek for stories over 2,500 words (in the body, not pinned). End block before the share row: the next
                 story, then the join card for visitors ("Start your free map. Free. No card. 16+."). Events story_read_75,
                 next_story_click.
   /account      ?welcome=1 (and a member whose map is still empty): three steps with a progress line. 1 home country (from the
                 browser language, editable), 2 countries been to with Lived / Stayed / Layover, 3 one photo (optional; links to
                 Share photos). Then the passport reveal: stamps press in (scale .95 to 1, 200ms ease-out, 40ms stagger, at most 12
                 animated, none with reduced motion). Saved the same way the map and Quick log save. Event first_stamp.
                 "On this day" (private, only on your own /account): stamps from this month in earlier years.
   Everywhere    signup_start on links to /signup, story_submit_start on the first keystroke in /submit. gtag only, so events
                 follow the site's analytics consent. No data-ms-* element touched; nav and footer untouched. */
(function(){
var UX_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='ux')localStorage.setItem('tll-preview-ux','1');if(q==='off')localStorage.removeItem('tll-preview-ux');}catch(e){}
var ON=UX_PUBLIC||q==='ux';try{ON=ON||localStorage.getItem('tll-preview-ux')==='1';}catch(e){}if(!ON)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var CSS=':root{--ease-out:cubic-bezier(0.23,1,0.32,1)}'+
'.tll-story-hero-img{max-height:60vh!important}@media (max-width:600px){.tll-story-hero-img{max-height:50vh!important}}'+
'.tll-ux{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-ux [hidden]{display:none!important}'+
'.tll-ux-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-ux-toc{max-width:680px;margin:20px auto;padding:14px 16px;border-left:3px solid #067A79;background:#fff}.tll-ux-toc ol{margin:0;padding-left:20px}.tll-ux-toc a{color:#0A0B14}'+
'.tll-ux-end{max-width:680px;margin:32px auto;display:grid;gap:12px}.tll-ux-next{display:flex;gap:14px;align-items:center;border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:12px;color:#0A0B14;text-decoration:none;min-height:44px}'+
'.tll-ux-next img{width:96px;height:72px;object-fit:cover;border-radius:4px;flex:none}.tll-ux-next b{display:block;font:800 20px/1.2 "Playfair Display",Georgia,serif}'+
'.tll-ux-join{border:1px solid #0A0B14;border-radius:6px;padding:16px;background:#FDF9F3}.tll-ux-join b{display:block;font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-ux-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:4px;border:0;background:#C8325B;color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;transition:transform 140ms var(--ease-out)}'+
'.tll-ux-btn:active{transform:scale(.97)}.tll-ux-btn.ghost{background:#fff;color:#0A0B14;border:1.5px solid #0A0B14}.tll-ux-btn[disabled]{opacity:.55;cursor:default}'+
'.tll-ux-wel{position:fixed;inset:0;z-index:9999;background:rgba(10,11,20,.55);display:flex;align-items:flex-end;justify-content:center}'+
'.tll-ux-sheet{width:100%;max-width:560px;max-height:92vh;overflow:auto;background:#FDF9F3;border-radius:12px 12px 0 0;padding:20px 16px 24px}@media (min-width:700px){.tll-ux-wel{align-items:center}.tll-ux-sheet{border-radius:12px}}'+
'.tll-ux-prog{height:4px;background:#E0DACE;border-radius:2px;margin:0 0 6px}.tll-ux-prog i{display:block;height:100%;background:#C8325B;border-radius:2px;transition:width 200ms var(--ease-out)}'+
'.tll-ux-sheet h2{font:800 28px/1.1 "Playfair Display",Georgia,serif;margin:6px 0 12px}.tll-ux-sheet input[type=text],.tll-ux-sheet select{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#fff;min-height:44px}'+
'.tll-ux-rows{display:grid;gap:6px;margin:10px 0;max-height:40vh;overflow:auto}.tll-ux-row{display:flex;align-items:center;gap:8px;justify-content:space-between;border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:6px 8px}'+
'.tll-ux-chips{display:flex;gap:4px}.tll-ux-chips button{min-height:36px;min-width:44px;padding:0 8px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;cursor:pointer}.tll-ux-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-ux-acts{display:flex;justify-content:space-between;gap:8px;margin-top:14px}'+
'.tll-ux-stamps{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.tll-ux-stamp{font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:2px solid #C8325B;color:#C8325B;border-radius:6px;padding:10px;transform:rotate(-2deg)}'+
'.tll-ux-press{animation:tllPress 200ms var(--ease-out) both}@keyframes tllPress{from{transform:scale(.95) rotate(-2deg);opacity:0}to{transform:scale(1) rotate(-2deg);opacity:1}}'+
'.tll-ux-otd{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-ux-v1'))return;var s=el('style');s.id='tll-ux-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
css();

/* Events everywhere */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';if(/^\/signup\b/.test(h))track('signup_start',{from:P});},true);
if(P==='/submit'){var started=false;document.addEventListener('input',function(){if(started)return;started=true;track('story_submit_start');},true);}

/* Story pages */
function story(){var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];if(!body||document.getElementById('tll-ux-end'))return;
  var words=(body.textContent||'').trim().split(/\s+/).length,heads=[].slice.call(body.querySelectorAll('h2,h3'));
  if(words>2500&&heads.length>=2&&!document.getElementById('tll-ux-toc')){var t=el('nav','tll-ux tll-ux-toc');t.id='tll-ux-toc';t.setAttribute('aria-label','In this story');t.appendChild(el('p','tll-ux-k','In this story'));var ol=el('ol');
    heads.forEach(function(h,i){if(!h.id)h.id='s-'+(i+1)+'-'+h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40);var li=el('li'),a=el('a','',h.textContent.trim());a.href='#'+h.id;li.appendChild(a);ol.appendChild(li);});t.appendChild(ol);body.insertBefore(t,body.firstChild);}
  var sent=false;window.addEventListener('scroll',function(){if(sent)return;var r=body.getBoundingClientRect();if(r.height>0&&(innerHeight-r.top)/r.height>=0.75){sent=true;track('story_read_75',{story:P.split('/')[2]});}},{passive:true});
  var here=P.split('/')[2],links=[].slice.call(document.querySelectorAll('main a[href^="/stories/"]')).filter(function(a){var s=(a.getAttribute('href').split('/')[2]||'').replace(/[?#].*$/,'');return s&&s!==here&&!a.closest('nav,header,footer,.tll-ux-end');});
  var nx=links.filter(function(a){return a.querySelector('img');})[0]||links[0],end=el('div','tll-ux tll-ux-end');end.id='tll-ux-end';
  if(nx){var card=el('a','tll-ux-next');card.href=nx.getAttribute('href');var im=nx.querySelector('img');if(im){var i2=el('img');i2.src=im.currentSrc||im.src;i2.alt='';i2.loading='lazy';card.appendChild(i2);}var tx=el('div');tx.appendChild(el('span','tll-ux-k','Next story'));
    var title=(nx.querySelector('h2,h3,h4,b,strong')||nx).textContent.trim().split('\n')[0].slice(0,120);tx.appendChild(el('b','',title||'Keep reading'));card.appendChild(tx);card.addEventListener('click',function(){track('next_story_click',{from:here});});end.appendChild(card);}
  if(!tok()){var j=el('div','tll-ux-join');j.appendChild(el('b','','Start your free map.'));j.appendChild(el('p','','Free. No card. 16+.'));var ja=el('a','tll-ux-btn','Join free');ja.href='/signup?utm_source=story&utm_medium=end&utm_campaign=tll';j.appendChild(ja);end.appendChild(j);}
  if(!end.children.length)return;var share=document.querySelector('.tll-story-share-row');if(share)share.parentNode.insertBefore(end,share);else body.insertAdjacentElement('afterend',end);}

/* Welcome: first stamp in under two minutes */
function readStates(j){var r=j&&j.tllStates;if(!r||r.v!==2||!r.states){try{r=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){r=null;}}if(!r||r.v!==2||!r.states)r={v:2,travelers:[{id:'t1',name:'Me',color:'#F0507A',pet:false}],states:{}};return r;}
function names(){var out=[];try{var dn=new Intl.DisplayNames(['en'],{type:'region'}),N=window.__tllN2A||{};Object.keys(N).forEach(function(num){var a=N[num],n=a==='XK'?'Kosovo':dn.of(a);if(n&&n!==a)out.push({num:num,a2:a,name:n});});}catch(e){}return out.sort(function(a,b){return a.name.localeCompare(b.name);});}
function welcome(force){var ms=window.$memberstackDom;if(!ms||!ms.getMemberJSON||document.getElementById('tll-ux-wel'))return;
  ms.getMemberJSON().then(function(j){var json=(j&&j.data)||{},rec=readStates(json);if(!force&&Object.keys(rec.states).length)return;if(json.tllWelcomed&&!force)return;
    var all=names();if(!all.length)return;var me=(rec.travelers.filter(function(t){return !t.pet;})[0]||{id:'t1'}).id,picks={},home='';
    var reg=(navigator.language||'').split('-')[1];if(reg){var hit=all.filter(function(c){return c.a2===reg.toUpperCase();})[0];if(hit){home=hit.num;picks[hit.num]='lived';}}
    var wrap=el('div','tll-ux tll-ux-wel');wrap.id='tll-ux-wel';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-labelledby','tll-ux-wel-h');var sh=el('div','tll-ux-sheet');wrap.appendChild(sh);document.body.appendChild(wrap);
    var step=1;function frame(n,title){sh.textContent='';var pr=el('div','tll-ux-prog'),bar=el('i');bar.style.width=(n*100/3)+'%';pr.appendChild(bar);sh.appendChild(pr);sh.appendChild(el('p','tll-ux-k',n+' of 3'));var h=el('h2','',title);h.id='tll-ux-wel-h';sh.appendChild(h);}
    function acts(back,next,label,skip){var a=el('div','tll-ux-acts');if(back){var b=el('button','tll-ux-btn ghost','Back');b.type='button';b.onclick=back;a.appendChild(b);}else a.appendChild(el('span'));
      var nx=el('button','tll-ux-btn',label||'Next');nx.type='button';nx.onclick=next;a.appendChild(nx);if(skip){var s=el('button','tll-ux-btn ghost','Skip');s.type='button';s.onclick=skip;a.insertBefore(s,nx);}sh.appendChild(a);return nx;}
    function s1(){frame(1,'Where is home?');var sel=el('select');sel.setAttribute('aria-label','Home country');sel.appendChild(el('option','','Pick a country'));all.forEach(function(c){var o=el('option','',c.name);o.value=c.num;sel.appendChild(o);});sel.value=home;sh.appendChild(sel);
      sh.appendChild(el('p','','The country you call home. You can change it later.')).style.cssText='font-size:13px;color:#5F5A54';
      acts(null,function(){if(home&&picks[home]==='lived'&&sel.value!==home)delete picks[home];home=sel.value;if(home)picks[home]='lived';s2();});}
    function s2(){frame(2,'Where have you been?');var find=el('input');find.type='text';find.placeholder='Type a country';find.setAttribute('aria-label','Find a country');sh.appendChild(find);var rows=el('div','tll-ux-rows');sh.appendChild(rows);
      function draw(){rows.textContent='';var f=find.value.trim().toLowerCase();all.filter(function(c){return f?c.name.toLowerCase().indexOf(f)>-1:picks[c.num];}).slice(0,40).forEach(function(c){var r=el('div','tll-ux-row');r.appendChild(el('span','',c.name));var ch=el('div','tll-ux-chips');
        [['lived','LIVED'],['visited','STAYED'],['layover','LAYOVER']].forEach(function(m){var b=el('button','',m[1]);b.type='button';b.setAttribute('aria-pressed',String(picks[c.num]===m[0]));b.onclick=function(){if(picks[c.num]===m[0])delete picks[c.num];else picks[c.num]=m[0];draw();};ch.appendChild(b);});r.appendChild(ch);rows.appendChild(r);});
        if(!rows.children.length)rows.appendChild(el('p','','Type a country, then tap Lived, Stayed or Layover.'));}
      find.oninput=draw;draw();setTimeout(function(){find.focus();},50);acts(s1,function(){save().then(s3);},'Save my map');}
    function save(){var e=rec.states;Object.keys(picks).forEach(function(num){var x=Object.assign({},e[num]||{});if(!x[me])x[me]=picks[num];e[num]=x;});var t=Date.now();json.tllStates=rec;json.tllStatesAt=t;json.tllWelcomed=t;
      return ms.updateMemberJSON({json:json}).then(function(){try{localStorage.setItem('tllStates',JSON.stringify(rec));localStorage.setItem('tllStatesAt',String(t));}catch(e){}if(Object.keys(picks).length)track('first_stamp',{count:Object.keys(picks).length});}).catch(function(){});}
    function s3(){frame(3,'One photo for your first album page');sh.appendChild(el('p','','Optional. Pick one you took yourself; we take the location out before it uploads.'));var a=el('a','tll-ux-btn ghost','Add a photo');a.href='/share-photos?utm_source=welcome';sh.appendChild(a);
      acts(null,ask,'Next',ask);}
    /* Optional, one tap, multi-select: "How do you travel most?" Saved privately to the member's travel-style field, to a GA4 user
       property only after analytics consent, and counted monthly for Nancy. Never shown publicly. */
    function ask(){sh.textContent='';sh.appendChild(el('p','tll-ux-k','One more, optional'));var h=el('h2','','How do you travel most?');h.id='tll-ux-wel-h';sh.appendChild(h);
      var opts=[['big-trips','A few big trips a year'],['short-trips','Lots of short trips and layovers'],['abroad','I live abroad (or did)'],['work','For work'],['pet','With my pet'],['pursuit','For a pursuit (running, hiking, food, more)']],picked={};
      var box=el('div','tll-ux-chips');box.style.cssText='flex-wrap:wrap;gap:8px;margin:10px 0';box.setAttribute('role','group');box.setAttribute('aria-label','How do you travel most? Pick any');
      opts.forEach(function(o){var b=el('button','',o[1]);b.type='button';b.style.cssText='min-height:44px;font:600 14px/1.2 "IBM Plex Sans Condensed",sans-serif;letter-spacing:0;padding:0 14px';b.setAttribute('aria-pressed','false');
        b.onclick=function(){picked[o[0]]=!picked[o[0]];b.setAttribute('aria-pressed',String(!!picked[o[0]]));};box.appendChild(b);});sh.appendChild(box);
      sh.appendChild(el('p','','Pick any. Only we see this; it helps us make TLL for people like you.')).style.cssText='font-size:13px;color:#5F5A54';
      acts(null,function(){var list=Object.keys(picked).filter(function(k){return picked[k];});if(list.length){
          try{if(ms.updateMember)ms.updateMember({customFields:{'travel-style':list.join(',')}}).catch(function(){});}catch(e){}
          post('/travel-style',{styles:list});try{if(window.__tllConsent&&__tllConsent.analytics&&window.gtag)gtag('set','user_properties',{travel_style:list.join(',')});}catch(e){}
          track('travel_style_answer',{count:list.length});}reveal();},'Show my passport',reveal);}
    function reveal(){sh.textContent='';sh.appendChild(el('p','tll-ux-k','Your passport'));var h=el('h2','','Stamped.');h.id='tll-ux-wel-h';sh.appendChild(h);var box=el('div','tll-ux-stamps');var codes=Object.keys(picks);
      codes.forEach(function(num,i){var c=all.filter(function(x){return x.num===num;})[0];if(!c)return;var s=el('span','tll-ux-stamp',c.name+' · '+(picks[num]==='lived'?'Lived':picks[num]==='visited'?'Stayed':'Layover'));if(!RM&&i<12){s.classList.add('tll-ux-press');s.style.animationDelay=(i*40)+'ms';}box.appendChild(s);});
      sh.appendChild(box);if(!codes.length)sh.appendChild(el('p','','Your first stamp goes here. The map is one tap away.'));var a=el('a','tll-ux-btn','See my map');a.href='/the-map';sh.appendChild(a);var c=el('button','tll-ux-btn ghost','Close');c.type='button';c.style.marginLeft='8px';c.onclick=function(){wrap.remove();};sh.appendChild(c);}
    document.addEventListener('keydown',function k(e){if(e.key==='Escape'&&document.getElementById('tll-ux-wel')){wrap.remove();document.removeEventListener('keydown',k);}});
    s1();if(force)track('signup_complete');}).catch(function(){});}

/* On this day, private to the member on /account */
function onThisDay(){if(document.getElementById('tll-ux-otd'))return;post('/stamps/mine').then(function(d){if(!d||!d.ok)return;var now=new Date(),m=now.getMonth()+1,y=now.getFullYear();
  var hits=(d.stamps||[]).filter(function(s){return s.month===m&&s.year&&s.year<y;});if(!hits.length||document.getElementById('tll-ux-otd'))return;
  var box=el('section','tll-ux tll-ux-otd');box.id='tll-ux-otd';box.appendChild(el('p','tll-ux-k','On this day · only you see this'));
  hits.slice(0,3).forEach(function(s){var n=y-s.year;box.appendChild(el('p','',(n===1?'A year ago':n+' years ago')+' this month: '+s.what+', '+[s.city,s.country].filter(Boolean).join(', ')+'.'));});
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);});}

function run(){if(/^\/stories\/[^/]+$/.test(P))story();else if(P==='/account'){var w=new URLSearchParams(location.search).get('welcome')==='1';setTimeout(function(){welcome(w);},w?0:1500);onThisDay();}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1400);});else setTimeout(run,1400);
})();
