/* tll-quick-log-v1 (25 Oct 2026). Nancy, 23 Oct: "I still find myself logging on Places Been because their interface is easier."
   Nancy, 25 Oct: four columns, and yes to a Places Been import.
   /the-map only. A Quick log sheet: the map stays in view (bottom sheet on phones, side panel on wide screens), one search,
   one row per country with four big boxes, BEEN, LIVED, WANT and LAYOVER. Tap on, tap again off. Every tap saves.
   Saved data keeps its shape: countries in tllStates (BEEN = "visited", LIVED = "lived", LAYOVER = "layover", one per traveler),
   WANT in tllPlaces keyed by the country slug, the same record the country pages write. Only BEEN and LIVED count toward the 249;
   the counters elsewhere on the page already follow that rule.
   Import from Places Been: the CSV export (layer,type,name,country_code,...,status,...). Countries come from the pins' country
   codes and are added as BEEN where nothing is logged yet (nothing is ever downgraded or removed); Wishlist pins add WANT;
   Cities, Airports and National parks pins join the map logbook (tllLog). Nothing is sent before Import is pressed.
   Signed-out visitors get a sign-in link instead. Touches no data-ms-* element. */
(function(){
  if(window.__tllQuickLog) return; window.__tllQuickLog=1;
  var D=document, W=window;
  var N2A={"004":"AF","248":"AX","008":"AL","012":"DZ","016":"AS","020":"AD","024":"AO","660":"AI","010":"AQ","028":"AG","032":"AR","051":"AM","533":"AW","036":"AU","040":"AT","031":"AZ","044":"BS","048":"BH","050":"BD","052":"BB","112":"BY","056":"BE","084":"BZ","204":"BJ","060":"BM","064":"BT","068":"BO","070":"BA","072":"BW","076":"BR","096":"BN","100":"BG","854":"BF","108":"BI","116":"KH","120":"CM","124":"CA","132":"CV","140":"CF","148":"TD","152":"CL","156":"CN","170":"CO","174":"KM","178":"CG","180":"CD","184":"CK","188":"CR","384":"CI","191":"HR","192":"CU","196":"CY","203":"CZ","208":"DK","262":"DJ","212":"DM","214":"DO","218":"EC","818":"EG","222":"SV","226":"GQ","232":"ER","233":"EE","231":"ET","238":"FK","234":"FO","242":"FJ","246":"FI","250":"FR","254":"GF","258":"PF","266":"GA","270":"GM","268":"GE","276":"DE","288":"GH","292":"GI","300":"GR","304":"GL","308":"GD","320":"GT","324":"GN","624":"GW","328":"GY","332":"HT","340":"HN","344":"HK","348":"HU","352":"IS","356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE","376":"IL","380":"IT","388":"JM","392":"JP","400":"JO","398":"KZ","404":"KE","296":"KI","408":"KP","410":"KR","414":"KW","417":"KG","418":"LA","428":"LV","422":"LB","426":"LS","430":"LR","434":"LY","438":"LI","440":"LT","442":"LU","446":"MO","807":"MK","450":"MG","454":"MW","458":"MY","462":"MV","466":"ML","470":"MT","584":"MH","478":"MR","480":"MU","484":"MX","583":"FM","498":"MD","492":"MC","496":"MN","499":"ME","504":"MA","508":"MZ","104":"MM","516":"NA","520":"NR","524":"NP","528":"NL","540":"NC","554":"NZ","558":"NI","562":"NE","566":"NG","570":"NU","578":"NO","512":"OM","586":"PK","585":"PW","275":"PS","591":"PA","598":"PG","600":"PY","604":"PE","608":"PH","616":"PL","620":"PT","630":"PR","634":"QA","638":"RE","642":"RO","643":"RU","646":"RW","659":"KN","662":"LC","670":"VC","882":"WS","674":"SM","678":"ST","682":"SA","686":"SN","688":"RS","690":"SC","694":"SL","702":"SG","703":"SK","705":"SI","090":"SB","706":"SO","710":"ZA","728":"SS","724":"ES","144":"LK","729":"SD","740":"SR","748":"SZ","752":"SE","756":"CH","760":"SY","158":"TW","762":"TJ","834":"TZ","764":"TH","626":"TL","768":"TG","772":"TK","776":"TO","780":"TT","788":"TN","792":"TR","795":"TM","800":"UG","804":"UA","784":"AE","826":"GB","840":"US","858":"UY","860":"UZ","548":"VU","862":"VE","704":"VN","732":"EH","887":"YE","894":"ZM","716":"ZW","531":"CW","798":"TV","652":"BL","535":"BQ","074":"BV","166":"CC","162":"CX","831":"GG","312":"GP","239":"GS","316":"GU","334":"HM","833":"IM","086":"IO","832":"JE","136":"KY","663":"MF","580":"MP","474":"MQ","500":"MS","574":"NF","666":"PM","612":"PN","654":"SH","744":"SJ","534":"SX","796":"TC","260":"TF","581":"UM","336":"VA","092":"VG","850":"VI","876":"WF","175":"YT","900":"XK"};
  var COLS=[['visited','BEEN'],['lived','LIVED'],['want','WANT'],['layover','LAYOVER']];
  var names; try{ names=new Intl.DisplayNames(['en'],{type:'region'}); }catch(e){ names=null; }
  var FIX={XK:'Kosovo',AQ:'Antarctica',TW:'Taiwan',PS:'Palestine',VA:'Vatican City',MM:'Myanmar',CI:"Côte d'Ivoire",CZ:'Czechia',TR:'Türkiye',MK:'North Macedonia',SZ:'Eswatini',CV:'Cabo Verde',TL:'Timor-Leste'};
  function nameOf(a2){ return FIX[a2]||(names&&names.of(a2))||a2; }
  function flag(a2){ return /^[A-Z]{2}$/.test(a2)&&a2!=='XK'?a2.replace(/./g,function(c){return String.fromCodePoint(127397+c.charCodeAt(0));}):''; }
  function slug(n){ return String(n).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
  var A2N={}, LIST=Object.keys(N2A).map(function(num){ var a2=N2A[num]; A2N[a2]=num; return {num:num,a2:a2,name:nameOf(a2)}; })
    .sort(function(x,y){ return x.name.localeCompare(y.name,'en'); });
  LIST.forEach(function(c){ c.key=slug(c.name); c.hay=(c.name+' '+c.a2).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); });

  /* ---------- the record ---------- */
  function readJSON(k){ try{ return JSON.parse(localStorage.getItem(k)||'null'); }catch(e){ return null; } }
  function rec(){
    var r=readJSON('tllStates');
    if(!r||r.v!==2||!r.states) r={v:2,travelers:[],states:{}};
    if(!r.travelers||!r.travelers.length) r.travelers=[{id:'t1',name:'Me',color:'#F0507A',pet:false}];
    return r;
  }
  var data=rec(), places={}, log=null, cur=null, member=null, dirty={states:false,places:false,log:false}, timer=null;
  function me(){ var t=data.travelers.filter(function(x){return !x.pet;})[0]; return t?t.id:'t1'; }
  function ms(){ return W.$memberstackDom||null; }
  function memberCheck(cb){
    var n=0, iv=setInterval(function(){ var m=ms(); if(m&&m.getCurrentMember){ clearInterval(iv);
      m.getCurrentMember().then(function(r){ member=!!(r&&r.data); if(!member) return cb(false);
        return m.getMemberJSON().then(function(j){ var d=(j&&j.data)||{}; places=d.tllPlaces||{}; log=d.tllLog||null; if(d.tllStates&&d.tllStates.v===2&&d.tllStates.states){ data=d.tllStates; } cb(true); });
      }).catch(function(){ member=false; cb(false); }); }
      else if(++n>60){ clearInterval(iv); member=false; cb(false); } },150);
  }
  function tell(){
    try{ localStorage.setItem('tllStates',JSON.stringify(data)); localStorage.setItem('tllStatesAt',String(Date.now())); }catch(e){}
    try{ W.dispatchEvent(new CustomEvent('tll:states',{detail:JSON.parse(JSON.stringify(data))})); }catch(e){}
    try{ if(W.__tllMapApply) W.__tllMapApply(JSON.parse(JSON.stringify(data))); }catch(e){}
    try{ if(W.__tllQuickCount) W.__tllQuickCount(); }catch(e){}
  }
  function save(){
    clearTimeout(timer); say('Saving');
    timer=setTimeout(function(){
      var m=ms(); if(!m){ say('Not saved. Check your connection and tap again.',1); return; }
      var want=Object.assign({},dirty); dirty={states:false,places:false,log:false};
      m.getMemberJSON().then(function(j){
        var json=(j&&j.data)||{}, t=Date.now();
        if(want.states){ json.tllStates=JSON.parse(JSON.stringify(data)); json.tllStatesAt=t; }
        if(want.places){ json.tllPlaces=Object.assign({},places); }
        if(want.log){ json.tllLog=JSON.parse(JSON.stringify(log)); json.tllLogAt=t; }
        return m.updateMemberJSON({json:json}).then(function(){
          if(want.states){ try{ localStorage.setItem('tllStatesAt',String(t)); }catch(e){} }
          if(want.log){ try{ localStorage.setItem('tllLog',JSON.stringify(log)); }catch(e){} try{ W.dispatchEvent(new CustomEvent('tll:log',{detail:{log:log,parks:readJSON('tllParks')}})); }catch(e){} }
          say('Saved');
        });
      }).catch(function(){ dirty.states=dirty.states||want.states; dirty.places=dirty.places||want.places; dirty.log=dirty.log||want.log; say('Not saved. Check your connection and tap again.',1); });
    },700);
  }
  function depth(num,tid){ var e=data.states[num]; return e&&e[tid]||''; }
  function setDepth(num,tid,v){
    var e=Object.assign({},data.states[num]||{});
    if(!v||e[tid]===v) delete e[tid]; else e[tid]=v;
    if(Object.keys(e).length) data.states[num]=e; else delete data.states[num];
    dirty.states=true; tell(); save();
  }
  function wants(c){ var p=places[c.key]; return !!(p&&p.state==='want'); }
  function setWant(c){
    if(wants(c)) delete places[c.key]; else places[c.key]={state:'want',name:c.name,at:new Date().toISOString()};
    dirty.places=true; save();
  }

  /* ---------- styles ---------- */
  var css=D.createElement('style'); css.id='tll-quick-log-css';
  css.textContent=
  '.tql-open{display:flex;justify-content:center;margin:14px 0 6px}'+
  '.tql-open a,.tql-open button{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 24px;border:0;border-radius:999px;background:#D63859;color:#fff;font:600 16px/1 "IBM Plex Sans Condensed","IBM Plex Sans",system-ui,sans-serif;text-decoration:none;cursor:pointer}'+
  '.tql-open a:focus-visible,.tql-open button:focus-visible{outline:3px solid #0A0B14;outline-offset:3px}'+
  '.tql{position:fixed;z-index:9990;left:0;right:0;bottom:0;height:62vh;height:62dvh;display:flex;flex-direction:column;background:#F7F1E8;color:#0A0B14;border-radius:18px 18px 0 0;box-shadow:0 -10px 30px rgba(10,11,20,.25);font:400 16px/1.4 "IBM Plex Sans","IBM Plex Sans Condensed",system-ui,sans-serif}'+
  '.tql[hidden]{display:none}'+
  '@media (min-width:900px){.tql{left:auto;top:0;height:auto;width:440px;border-radius:0;box-shadow:-10px 0 30px rgba(10,11,20,.2)}}'+
  '.tql-hd{display:flex;align-items:center;gap:10px;padding:12px 16px 6px}'+
  '.tql-hd h2{margin:0;flex:1;font:800 22px/1.1 "Playfair Display",Georgia,serif}'+
  '.tql-x{width:44px;height:44px;border:0;background:transparent;font-size:26px;line-height:1;cursor:pointer;color:#0A0B14;border-radius:50%}'+
  '.tql-x:focus-visible,.tql button:focus-visible,.tql input:focus-visible{outline:3px solid #067A79;outline-offset:2px}'+
  '.tql-who{display:flex;gap:8px;overflow-x:auto;padding:4px 16px 8px;scrollbar-width:none}'+
  '.tql-who button{flex:none;min-height:40px;padding:0 14px;border:1.5px solid #0A0B14;border-radius:999px;background:transparent;font:600 14px/1 inherit;cursor:pointer;color:#0A0B14}'+
  '.tql-who button[aria-pressed="true"]{background:#0A0B14;color:#F7F1E8}'+
  '.tql-find{padding:0 16px 8px}'+
  '.tql-find input{width:100%;box-sizing:border-box;min-height:48px;padding:0 14px;border:1.5px solid #8A847B;border-radius:12px;background:#fff;font:400 17px/1 inherit;color:#0A0B14}'+
  '.tql-cols,.tql-row{display:grid;grid-template-columns:1fr repeat(4,52px);align-items:center;gap:4px;padding:0 12px 0 16px}'+
  '.tql-cols{padding-top:2px;padding-bottom:6px;font:600 10px/1.2 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1px;color:#5E5A54;text-align:center;border-bottom:1px solid #E0DACE}'+
  '.tql-cols span:first-child{text-align:left}'+
  '.tql-list{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}'+
  '.tql-row{min-height:56px;border-bottom:1px solid #EAE3D6}'+
  '.tql-nm{display:flex;align-items:center;gap:10px;min-width:0;font-size:16px}'+
  '.tql-nm b{font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
  '.tql-fl{font-size:22px;width:28px;flex:none;text-align:center}'+
  '.tql-bx{justify-self:center;width:44px;height:44px;border:2px solid #8A847B;border-radius:10px;background:#fff;cursor:pointer;padding:0;color:#fff;font:700 18px/1 system-ui,sans-serif}'+
  '.tql-bx[aria-pressed="true"]{border-color:transparent}'+
  '.tql-bx[data-k="visited"][aria-pressed="true"]{background:#067A79}'+
  '.tql-bx[data-k="lived"][aria-pressed="true"]{background:#0A0B14}'+
  '.tql-bx[data-k="want"][aria-pressed="true"]{background:#C8325B}'+
  '.tql-bx[data-k="layover"][aria-pressed="true"]{background:#8A5A14}'+
  '.tql-bx:disabled{opacity:.25;cursor:not-allowed}'+
  '.tql-ft{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;padding:10px 16px calc(10px + env(safe-area-inset-bottom));border-top:1px solid #E0DACE;font-size:14px}'+
  '.tql-st{flex:1;min-width:120px;color:#5E5A54}.tql-st[data-err]{color:#C8325B}'+
  '.tql-imp{min-height:44px;border:0;background:transparent;color:#067A79;font:600 14px/1 inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:0}'+
  '.tql-pv{margin:8px 16px;padding:12px 14px;border:1.5px solid #067A79;border-radius:12px;background:#fff;font-size:15px}'+
  '.tql-pv p{margin:0 0 8px}.tql-pv button{min-height:44px;margin:4px 8px 0 0;padding:0 18px;border-radius:999px;font:600 15px/1 inherit;cursor:pointer}'+
  '.tql-pv .go{background:#D63859;color:#fff;border:0}.tql-pv .no{background:transparent;border:1.5px solid #0A0B14;color:#0A0B14}'+
  '.tql-empty{padding:24px 16px;color:#5E5A54}'+
  '@media (prefers-reduced-motion:no-preference){.tql{transition:transform .18s ease}}';
  D.head.appendChild(css);

  /* ---------- the sheet ---------- */
  var sheet, list, find, who, st, pv, opener, built=false;
  function el(t,a,txt){ var e=D.createElement(t); if(a) for(var k in a) e.setAttribute(k,a[k]); if(txt!=null) e.textContent=txt; return e; }
  function say(t,err){ if(!st) return; st.textContent=t; if(err) st.setAttribute('data-err','1'); else st.removeAttribute('data-err'); }
  function build(){
    if(built) return; built=true;
    sheet=el('section',{'class':'tql',id:'tql','aria-label':'Quick log',hidden:''});
    var hd=el('div',{'class':'tql-hd'}); hd.appendChild(el('h2',null,'Quick log'));
    var x=el('button',{'class':'tql-x',type:'button','aria-label':'Close quick log'},'×'); x.addEventListener('click',close); hd.appendChild(x);
    who=el('div',{'class':'tql-who',role:'group','aria-label':'Whose map'});
    var fw=el('div',{'class':'tql-find'}); find=el('input',{type:'search',placeholder:'Search countries',autocomplete:'off',enterkeyhint:'search','aria-label':'Search countries'}); fw.appendChild(find);
    find.addEventListener('input',paint);
    var cols=el('div',{'class':'tql-cols','aria-hidden':'true'}); cols.appendChild(el('span',null,'COUNTRY')); COLS.forEach(function(c){ cols.appendChild(el('span',null,c[1])); });
    list=el('div',{'class':'tql-list',role:'list'});
    pv=el('div'); pv.hidden=true;
    var ft=el('div',{'class':'tql-ft'}); st=el('span',{'class':'tql-st',role:'status','aria-live':'polite'},'Every tap saves.');
    var imp=el('button',{'class':'tql-imp',type:'button'},'Import from Places Been');
    var file=el('input',{type:'file',accept:'.csv,text/csv',hidden:''});
    imp.addEventListener('click',function(){ file.click(); });
    file.addEventListener('change',function(){ var f=file.files&&file.files[0]; if(f) readImport(f); file.value=''; });
    ft.appendChild(st); ft.appendChild(imp); ft.appendChild(file);
    [hd,who,fw,pv,cols,list,ft].forEach(function(n){ sheet.appendChild(n); });
    D.body.appendChild(sheet);
    D.addEventListener('keydown',function(e){ if(e.key==='Escape'&&sheet&&!sheet.hidden) close(); });
    list.addEventListener('click',function(e){
      var b=e.target.closest('.tql-bx'); if(!b||b.disabled) return;
      var c=LIST[+b.getAttribute('data-i')], k=b.getAttribute('data-k');
      if(k==='want') setWant(c); else setDepth(c.num,cur,k);
      paintRow(b.parentNode,c);
    });
  }
  function paintWho(){
    who.textContent='';
    if(!cur||!data.travelers.some(function(t){return t.id===cur;})) cur=me();
    data.travelers.forEach(function(t){
      var b=el('button',{type:'button','aria-pressed':String(t.id===cur)},(t.pet?'🐾 ':'')+t.name);
      b.addEventListener('click',function(){ cur=t.id; paintWho(); paint(); });
      who.appendChild(b);
    });
    who.hidden=data.travelers.length<2;
  }
  function isPet(){ var t=data.travelers.filter(function(x){return x.id===cur;})[0]; return !!(t&&t.pet); }
  function paintRow(row,c){
    var d=depth(c.num,cur), pet=isPet();
    [].forEach.call(row.querySelectorAll('.tql-bx'),function(b){
      var k=b.getAttribute('data-k'), on=k==='want'?wants(c):d===k;
      b.setAttribute('aria-pressed',String(on)); b.textContent=on?'✓':'';
      b.disabled=k==='want'&&pet;
    });
  }
  function paint(){
    var q=(find.value||'').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    list.textContent=''; var n=0, frag=D.createDocumentFragment();
    LIST.forEach(function(c,i){
      if(q&&c.hay.indexOf(q)<0) return; n++;
      var row=el('div',{'class':'tql-row',role:'listitem'});
      var nm=el('span',{'class':'tql-nm'}); nm.appendChild(el('span',{'class':'tql-fl','aria-hidden':'true'},flag(c.a2))); nm.appendChild(el('b',null,c.name)); row.appendChild(nm);
      COLS.forEach(function(k){ row.appendChild(el('button',{'class':'tql-bx',type:'button','data-k':k[0],'data-i':String(i),'aria-label':k[1].charAt(0)+k[1].slice(1).toLowerCase()+', '+c.name})); });
      paintRow(row,c); frag.appendChild(row);
    });
    list.appendChild(frag);
    if(!n) list.appendChild(el('p',{'class':'tql-empty'},'No country by that name. Try the local spelling or the two-letter code.'));
  }
  function open(){
    build(); data=rec(); paintWho(); paint(); sheet.hidden=false; find.focus({preventScroll:true});
    if(location.hash!=='#quick-log') try{ history.replaceState(null,'','#quick-log'); }catch(e){}
  }
  function close(){
    if(!sheet) return; sheet.hidden=true; pv.hidden=true;
    if(location.hash==='#quick-log') try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){}
    if(opener) opener.focus();
  }
  W.addEventListener('tll:states',function(e){ if(e.detail&&e.detail.v===2&&e.detail.states&&sheet&&!sheet.hidden){ data=e.detail; paint(); } });

  /* ---------- Places Been import ---------- */
  function csvRows(t){
    var out=[], row=[], f='', q=false;
    for(var i=0;i<t.length;i++){ var ch=t[i];
      if(q){ if(ch==='"'){ if(t[i+1]==='"'){ f+='"'; i++; } else q=false; } else f+=ch; }
      else if(ch==='"') q=true; else if(ch===','){ row.push(f); f=''; }
      else if(ch==='\n'||ch==='\r'){ if(ch==='\r'&&t[i+1]==='\n') i++; row.push(f); out.push(row); row=[]; f=''; }
      else f+=ch; }
    if(f||row.length){ row.push(f); out.push(row); }
    return out.filter(function(r){ return r.length>1||r[0]; });
  }
  var plan=null;
  function readImport(file){
    var r=new FileReader();
    r.onload=function(){
      var rows=csvRows(String(r.result||'').replace(/^﻿/,'')); if(rows.length<2) return importMsg('That file has no rows. Export a CSV from Places Been and try again.');
      var h=rows[0].map(function(x){ return x.trim().toLowerCase(); }), ix=function(n){ return h.indexOf(n); };
      var iL=ix('layer'), iN=ix('name'), iC=ix('country_code'), iS=ix('status');
      if(iC<0||iS<0) return importMsg('That does not look like a Places Been export. It needs country_code and status columns.');
      var been={}, want={}, add={cities:[],airports:[],parks:[]}, skipped=0;
      var LAY={'cities':'cities','airports':'airports','national parks and monuments':'parks'};
      rows.slice(1).forEach(function(c){
        var a2=(c[iC]||'').trim().toUpperCase(), s=(c[iS]||'').trim().toLowerCase(), lay=iL>=0?(c[iL]||'').trim().toLowerCase():'', nm=iN>=0?(c[iN]||'').trim():'';
        if(s==='been'){ if(A2N[a2]) been[A2N[a2]]=1; var k=LAY[lay]; if(k&&nm) add[k].push(nm); else if(lay&&!k) skipped++; }
        else if(s==='wishlist'||s==='want'){ if(A2N[a2]) want[A2N[a2]]=1; }
      });
      var t=me(), newC=Object.keys(been).filter(function(n){ return !depth(n,t); });
      var newW=Object.keys(want).filter(function(n){ var c=LIST.filter(function(x){return x.num===n;})[0]; return c&&!been[n]&&!depth(n,t)&&!wants(c); });
      var L=log||readJSON('tllLog')||{}, newL={};
      Object.keys(add).forEach(function(k){ var have={}; (L[k]||[]).forEach(function(e){ if(e&&e.n) have[String(e.n).toLowerCase().trim()]=1; });
        newL[k]=add[k].filter(function(n){ var key=n.toLowerCase().trim(); if(have[key]) return false; have[key]=1; return true; }); });
      plan={countries:newC,want:newW,log:newL};
      var bits=[newC.length+(newC.length===1?' country':' countries')+' to add as BEEN',newW.length+' to WANT',newL.cities.length+(newL.cities.length===1?' city':' cities'),newL.airports.length+(newL.airports.length===1?' airport':' airports'),newL.parks.length+(newL.parks.length===1?' park':' parks')];
      pv.className='tql-pv'; pv.textContent=''; pv.hidden=false;
      pv.appendChild(el('p',null,'From your Places Been file: '+bits.join(', ')+'. Nothing you already logged changes.'+(skipped?' '+skipped+(skipped===1?' pin in another list (landmarks, UNESCO, ports) stays':' pins in other lists (landmarks, UNESCO, ports) stay')+' in Places Been for now.':'')));
      var go=el('button',{'class':'go',type:'button'},'Import'), no=el('button',{'class':'no',type:'button'},'Cancel');
      go.disabled=!(newC.length||newW.length||newL.cities.length||newL.airports.length||newL.parks.length);
      go.addEventListener('click',applyImport); no.addEventListener('click',function(){ pv.hidden=true; plan=null; });
      pv.appendChild(go); pv.appendChild(no); go.focus();
    };
    r.onerror=function(){ importMsg('That file could not be read. Try the export again.'); };
    r.readAsText(file);
  }
  function importMsg(t){ pv.className='tql-pv'; pv.textContent=''; pv.hidden=false; pv.appendChild(el('p',null,t)); var no=el('button',{'class':'no',type:'button'},'Close'); no.addEventListener('click',function(){ pv.hidden=true; }); pv.appendChild(no); }
  function applyImport(){
    if(!plan) return; var t=me(), now=Date.now();
    plan.countries.forEach(function(n){ var e=Object.assign({},data.states[n]||{}); if(!e[t]) e[t]='visited'; data.states[n]=e; });
    if(plan.countries.length){ dirty.states=true; tell(); }
    plan.want.forEach(function(n){ var c=LIST.filter(function(x){return x.num===n;})[0]; if(c) places[c.key]={state:'want',name:c.name,at:new Date().toISOString()}; });
    if(plan.want.length) dirty.places=true;
    var L=log||readJSON('tllLog')||{}, any=false;
    ['cities','airports','parks'].forEach(function(k){ if(plan.log[k].length){ any=true; L[k]=(L[k]||[]).concat(plan.log[k].map(function(n){ return {n:n.slice(0,80),at:now}; })); } });
    if(any){ log=L; dirty.log=true; }
    pv.hidden=true; var c=plan.countries.length; plan=null; paint(); save();
    say('Imported. '+c+(c===1?' country':' countries')+' added. Saving');
  }

  /* ---------- the button ---------- */
  function mount(){
    var map=D.getElementById('tll-map-layers'); var host=map&&map.parentNode; if(!host||D.querySelector('.tql-open')) return;
    var w=el('div',{'class':'tql-open'});
    host.insertBefore(w,map.nextSibling);
    memberCheck(function(isMember){
      if(isMember){
        opener=el('button',{type:'button','aria-controls':'tql'},'Quick log your countries'); opener.addEventListener('click',open); w.appendChild(opener);
        try{ localStorage.setItem('tllStates',JSON.stringify(data)); }catch(e){}
        if(location.hash==='#quick-log') open();
      } else {
        var a=el('a',{href:'/login?redirect='+encodeURIComponent('/the-map#quick-log')},'Sign in to log your countries'); w.appendChild(a);
      }
    });
  }
  if(D.readyState==='loading') D.addEventListener('DOMContentLoaded',mount); else mount();
  W.tllQuickLog={open:open,close:close};
})();
