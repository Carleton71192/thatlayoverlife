/* tll-work-trips-v1 (31 Oct 2026, That Work Trip Life). Reads GET /work-trips and /work-trips/story from the Worker; while those
   routes are not live nothing shows.
   1. Map: when a member adds a work-trip stamp (tll-stamps-v1 sends tll:stamp-added), the country goes on their map as BEEN for
      them, only where it is not logged yet. Nothing is ever downgraded or removed. Same record the map and Quick log write.
   2. Series labels, black washi tape: "The Free Evening · City" and "Plus One Day · City" on story cards (/stories, country pages,
      the hub) and above the headline on the story. /stories gets two filter chips. The story gets the writer's template fields,
      their safety note (only if they wrote one), a Trip Kit (labeled reklamelink, rel sponsored, no cards) and a LinkedIn button.
      Nothing shows until a story is tagged with one of the two themes. No schema added: stories keep Article only.
   3. The hub on /pursuits/work-trips. STAGED: HUB_PUBLIC false; shows with ?preview=worktrips (remembered, ?preview=off clears).
      Intro, The Free Evening rail, Plus One Day rail, Conference Cities, the stamps wall (year only, "A work trip" unless the member
      gave permission), road warrior picks, How to join, LinkedIn share. Clicks carry division tll.
   LinkedIn sharing is a plain link to linkedin.com/sharing/share-offsite, no SDK. No data-ms-* element touched. */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var HUB_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='worktrips')localStorage.setItem('tll-preview-worktrips','1');if(q==='off')localStorage.removeItem('tll-preview-worktrips');}catch(e){}
var PREVIEW=q==='worktrips';try{PREVIEW=PREVIEW||localStorage.getItem('tll-preview-worktrips')==='1';}catch(e){}
var N2A={"004":"AF","248":"AX","008":"AL","012":"DZ","016":"AS","020":"AD","024":"AO","660":"AI","010":"AQ","028":"AG","032":"AR","051":"AM","533":"AW","036":"AU","040":"AT","031":"AZ","044":"BS","048":"BH","050":"BD","052":"BB","112":"BY","056":"BE","084":"BZ","204":"BJ","060":"BM","064":"BT","068":"BO","070":"BA","072":"BW","076":"BR","096":"BN","100":"BG","854":"BF","108":"BI","116":"KH","120":"CM","124":"CA","132":"CV","140":"CF","148":"TD","152":"CL","156":"CN","170":"CO","174":"KM","178":"CG","180":"CD","184":"CK","188":"CR","384":"CI","191":"HR","192":"CU","196":"CY","203":"CZ","208":"DK","262":"DJ","212":"DM","214":"DO","218":"EC","818":"EG","222":"SV","226":"GQ","232":"ER","233":"EE","231":"ET","238":"FK","234":"FO","242":"FJ","246":"FI","250":"FR","254":"GF","258":"PF","266":"GA","270":"GM","268":"GE","276":"DE","288":"GH","292":"GI","300":"GR","304":"GL","308":"GD","320":"GT","324":"GN","624":"GW","328":"GY","332":"HT","340":"HN","344":"HK","348":"HU","352":"IS","356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE","376":"IL","380":"IT","388":"JM","392":"JP","400":"JO","398":"KZ","404":"KE","296":"KI","408":"KP","410":"KR","414":"KW","417":"KG","418":"LA","428":"LV","422":"LB","426":"LS","430":"LR","434":"LY","438":"LI","440":"LT","442":"LU","446":"MO","807":"MK","450":"MG","454":"MW","458":"MY","462":"MV","466":"ML","470":"MT","584":"MH","478":"MR","480":"MU","484":"MX","583":"FM","498":"MD","492":"MC","496":"MN","499":"ME","504":"MA","508":"MZ","104":"MM","516":"NA","520":"NR","524":"NP","528":"NL","540":"NC","554":"NZ","558":"NI","562":"NE","566":"NG","570":"NU","578":"NO","512":"OM","586":"PK","585":"PW","275":"PS","591":"PA","598":"PG","600":"PY","604":"PE","608":"PH","616":"PL","620":"PT","630":"PR","634":"QA","638":"RE","642":"RO","643":"RU","646":"RW","659":"KN","662":"LC","670":"VC","882":"WS","674":"SM","678":"ST","682":"SA","686":"SN","688":"RS","690":"SC","694":"SL","702":"SG","703":"SK","705":"SI","090":"SB","706":"SO","710":"ZA","728":"SS","724":"ES","144":"LK","729":"SD","740":"SR","748":"SZ","752":"SE","756":"CH","760":"SY","158":"TW","762":"TJ","834":"TZ","764":"TH","626":"TL","768":"TG","772":"TK","776":"TO","780":"TT","788":"TN","792":"TR","795":"TM","800":"UG","804":"UA","784":"AE","826":"GB","840":"US","858":"UY","860":"UZ","548":"VU","862":"VE","704":"VN","732":"EH","887":"YE","894":"ZM","716":"ZW","531":"CW","798":"TV","652":"BL","535":"BQ","074":"BV","166":"CC","162":"CX","831":"GG","312":"GP","239":"GS","316":"GU","334":"HM","833":"IM","086":"IO","832":"JE","136":"KY","663":"MF","580":"MP","474":"MQ","500":"MS","574":"NF","666":"PM","612":"PN","654":"SH","744":"SJ","534":"SX","796":"TC","260":"TF","581":"UM","336":"VA","092":"VG","850":"VI","876":"WF","175":"YT","900":"XK"};
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

/* 2. Series labels */
function cardsFor(series){var by={};series.forEach(function(s){s.stories.forEach(function(c){by[c.slug]=c;});});return by;}
function labelCards(by){Object.keys(by).forEach(function(slug){[].slice.call(document.querySelectorAll('a[href="/stories/'+slug+'"],a[href^="/stories/'+slug+'?"]')).forEach(function(a){
  if(a.closest('.tll-wt-rail')||a.closest('nav,header,footer'))return;var card=a.closest('.w-dyn-item')||a;if(card.querySelector('.tll-wt-card-tape'))return;
  if(getComputedStyle(card).position==='static')card.style.position='relative';card.appendChild(tape(by[slug].label,'tll-wt-card-tape'));card.setAttribute('data-tll-series',by[slug].series);});});}
function chips(series){if(document.getElementById('tll-wt-chips'))return;var have=series.filter(function(s){return s.stories.length;});if(!have.length)return;
  var first=document.querySelector('main .w-dyn-item a[href^="/stories/"]'),list=first&&first.closest('.w-dyn-list');if(!list)return;
  var row=el('div','tll-wt-chips');row.id='tll-wt-chips';row.appendChild(el('span','tll-wt-k','Work trips'));var on='';
  have.forEach(function(s){var b=el('button','',s.name);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){on=on===s.slug?'':s.slug;
    [].slice.call(row.querySelectorAll('button')).forEach(function(x){x.setAttribute('aria-pressed',String(x===b&&on!==''));});
    [].slice.call(list.querySelectorAll('.w-dyn-item')).forEach(function(it){it.hidden=!!on&&it.getAttribute('data-tll-series')!==on;});track('series_filter',{series:on||'all'});});row.appendChild(b);});
  list.parentNode.insertBefore(row,list);}
function storyPage(slug){get('/work-trips/story?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||document.getElementById('tll-wt-story'))return;
  var main=document.querySelector('main')||document.body,h1=main.querySelector('h1');var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var wrap=el('div');wrap.id='tll-wt-story';css();
  if(d.series){if(h1)h1.parentNode.insertBefore(tape(d.label),h1);var f=d.fields||{},box=el('aside','tll-wt-box');box.setAttribute('aria-label',d.series==='the-free-evening'?'The Free Evening':'Plus One Day');
    if(d.series==='the-free-evening'){box.appendChild(el('p','tll-wt-k','The Free Evening'));var line=[f.time,f.start?'starting from a '+f.start.toLowerCase():''].filter(Boolean).join(', ');if(line)box.appendChild(el('p','',line));
      if(f.stops&&f.stops.length){var ol=el('ol');f.stops.forEach(function(s){ol.appendChild(el('li','',s.stop+(s.move?' · '+s.move:'')));});box.appendChild(ol);}}
    else{box.appendChild(el('p','tll-wt-k','Plus One Day'));if(f.extraDays)box.appendChild(el('p','',f.extraDays+(f.extraDays===1?' extra day':' extra days')));
      if(f.whoPaid)box.appendChild(el('p','','Who paid for what: '+f.whoPaid));if(f.best)box.appendChild(el('p','','Best decision: '+f.best));if(f.worst)box.appendChild(el('p','','Worst decision: '+f.worst));}
    if(box.children.length>1)wrap.appendChild(box);
    if(d.safetyNote){var sn=el('aside','tll-wt-box');sn.appendChild(el('p','tll-wt-k','Safety, from the writer'));sn.appendChild(el('p','',d.safetyNote));wrap.appendChild(sn);}
    var sh=el('div','tll-wt-box');sh.appendChild(liBtn(location.origin+location.pathname,'story'));wrap.appendChild(sh);}
  if(d.tripKit&&d.tripKit.length){var k=el('aside','tll-wt-box tll-wt-kit');k.appendChild(el('p','tll-wt-k','Trip Kit · reklamelink'));var p=el('p');
    d.tripKit.forEach(function(x){var a=el('a','',x.label);a.href=x.url;a.rel=x.rel;a.target='_blank';a.addEventListener('click',function(){track('revenue_click',{slot:'trip_kit',label:x.label});});p.appendChild(a);});
    p.appendChild(el('i','','reklamelink'));k.appendChild(p);wrap.appendChild(k);}
  if(!wrap.children.length)return;var share=document.querySelector('.tll-story-share-row');if(share)share.parentNode.insertBefore(wrap,share);else if(body)body.insertAdjacentElement('afterend',wrap);else main.appendChild(wrap);});}

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

function run(){var m;
  if((m=/^\/stories\/([^/]+)$/.exec(P))){storyPage(m[1]);return;}
  var isHub=P==='/pursuits/work-trips',cards=P==='/stories'||/^\/countries\/[^/]+$/.test(P);if(!isHub&&!cards)return;if(isHub&&!(HUB_PUBLIC||PREVIEW))return;
  get('/work-trips').then(function(d){if(!d||!d.ok)return;css();if(isHub)hub(d);var by=cardsFor(d.series);labelCards(by);if(P==='/stories')chips(d.series);setTimeout(function(){labelCards(by);},2500);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
})();
