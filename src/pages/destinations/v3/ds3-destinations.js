/* tll-ds3-destinations-js-v1 (Destinations 3.0, rows D3, D4, D6, D9, D10; approved 12 Oct 2026). Every number is counted from what rendered on this page: stories from the Stories list, filed countries from the Countries tiles whose Story Ref is set. Nothing typed. Reads tllStates (never writes it) for the signed-in member's own tile marks. */
(function(){
  var B='https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/',J='https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/';
  var HOST={mx:'6aba209779fdd6acfa9a5b57_flag-mx',cl:'6aba2096310af94e01eb9a06_flag-cl',ar:'6aba209d0b20448acd7ab45d_flag-ar',me:'6aba2098bc9469648f2dd31d_flag-me',gh:'6aba20853c5a2a7f5f712e62_flag-gh',aq:'6aba209b6b8ff3588d0d3677_flag-aq',bg:'6aba2095d472a995a4b681fe_flag-bg',dk:'6abaabea6aa280006821dd68_flag-dk'};
  var ALIAS={usa:'us','united states':'us',oregon:'us',uk:'gb',dubai:'ae','sao paulo':'br','ho chi minh city':'vn',copenhagen:'dk'};
  var MAPID='AD020AE784AF004AG028AI660AL008AM051AO024AQ010AR032AS016AT040AU036AW533AX248AZ031BA070BB052BD050BE056BF854BG100BH048BI108BJ204BL652BM060BN096BO068BQ535BR076BS044BT064BV074BW072BY112BZ084CA124CC166CD180CF140CG178CH756CI384CK184CL152CM120CN156CO170CR188CU192CV132CW531CX162CY196CZ203DE276DJ262DK208DM212DO214DZ012EC218EE233EG818EH732ER232ES724ET231FI246FJ242FK238FM583FO234FR250GA266GB826GD308GE268GF254GG831GH288GI292GL304GM270GN324GP312GQ226GR300GS239GT320GU316GW624GY328HK344HM334HN340HR191HT332HU348ID360IE372IL376IM833IN356IO086IQ368IR364IS352IT380JE832JM388JO400JP392KE404KG417KH116KI296KM174KN659KP408KR410KW414KY136KZ398LA418LB422LC662LI438LK144LR430LS426LT440LU442LV428LY434MA504MC492MD498ME499MF663MG450MH584MK807ML466MM104MN496MO446MP580MQ474MR478MS500MT470MU480MV462MW454MX484MY458MZ508NA516NC540NE562NF574NG566NI558NL528NO578NP524NR520NU570NZ554OM512PA591PE604PF258PG598PH608PK586PL616PM666PN612PR630PS275PT620PW585PY600QA634RE638RO642RS688RU643RW646SA682SB090SC690SD729SE752SG702SH654SI705SJ744SK703SL694SM674SN686SO706SR740SS728ST678SV222SX534SY760SZ748TC796TD148TF260TG768TH764TJ762TK772TL626TM795TN788TO776TR792TT780TV798TW158TZ834UA804UG800UM581US840UY858UZ860VA336VC670VE862VG092VI850VN704VU548WF876WS882YE887YT175ZA710ZM894ZW716XK900';
  var IDX=null;
  function nz(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z ]+/g,' ').replace(/\s+/g,' ').trim();}
  function idx(){if(IDX)return IDX;IDX={};try{var d=new Intl.DisplayNames(['en'],{type:'region'});for(var a=65;a<91;a++)for(var b=65;b<91;b++){var c=String.fromCharCode(a,b),n=d.of(c);if(n&&n!==c)IDX[nz(n)]=c.toLowerCase();}}catch(e){}return IDX;}
  /* Region bylines that name no single country. Balkans: the twelve countries the story itself names (route Copenhagen to Kosovo and back), pending Nancy's check. */
  var REGION={balkans:['dk','pl','cz','sk','at','hu','si','rs','xk','al','mk','bg']};
  function one(s){s=nz(s);return s?(ALIAS[s]||idx()[s]||''):'';}
  function isoFromByline(t){var segs=String(t||'').split(','),s=nz(segs[segs.length-1]);if(!s||/ and | or |\//.test(' '+s+' '))return '';return ALIAS[s]||idx()[s]||'';}
  /* Every country a byline names: 'Chile and Argentina', 'Denmark, Sweden and Norway', a region from REGION, or the last segment of 'City, Country'. */
  function isosFromByline(t){var r=REGION[nz(t)];if(r)return r.slice();var parts=String(t||'').split(/,|\s+and\s+|\s+&\s+|\//i),out=[],all=true;parts.forEach(function(p){if(!nz(p))return;var c=one(p);if(c){if(out.indexOf(c)<0)out.push(c);}else all=false;});if(all&&out.length)return out;var l=one(parts[parts.length-1]);return l?[l]:[];}
  function src(c){c=String(c||'').trim().toLowerCase();if(!/^[a-z]{2}$/.test(c))return '';return HOST[c]?B+HOST[c]+'.svg':J+c+'.svg';}
  function img(c,size){var s=src(c);if(!s)return null;var i=document.createElement('img');i.src=s;i.alt='';i.width=size;i.height=size;i.loading='lazy';i.decoding='async';i.onerror=function(){var p=i.parentNode;i.remove();if(p&&p.getAttribute('data-ds3')==='flag'&&!p.querySelector('img'))p.hidden=true;};return i;}
  function txt(root,sel){var e=root.querySelector(sel);return e?e.textContent.replace(/\s+/g,' ').trim():'';}
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s));}
  function pad(k){return String(k).padStart(3,'0');}
  function mapId(iso){iso=String(iso||'').toUpperCase();var i=MAPID.indexOf(iso);while(i>-1&&i%5!==0)i=MAPID.indexOf(iso,i+1);return i>-1?MAPID.substr(i+2,3):'';}

  function shelf(){
    var cards=$$('[data-ds3=shelf] [data-ds3=card]');
    cards.forEach(function(card){
      var place=card.querySelector('[data-ds3=place]');
      if(place&&!place.textContent.trim()){var cn=txt(card,'[data-ds3=cname]');if(cn)place.textContent=cn;}
      var meta=card.querySelector('[data-ds3=meta]'),mins=parseInt(txt(card,'[data-ds3=mins]'),10);
      if(meta&&mins>0&&!meta.__ds3){meta.__ds3=1;meta.appendChild(document.createTextNode(' \u00b7 '+mins+' MIN'));}
      var f=card.querySelector('[data-ds3=flag]');
      if(f&&!f.firstChild){var cs=isosFromByline(place?place.textContent:''),c0=txt(card,'[data-ds3=iso]').toLowerCase();if(c0&&cs.indexOf(c0)<0)cs.unshift(c0);
        var MAX=4,shown=0;cs.forEach(function(c,k){if(k>=MAX)return;var i=img(c,26);if(i){f.appendChild(i);shown++;}});
        if(cs.length>MAX){var more=document.createElement('span');more.setAttribute('data-ds3','flagmore');more.textContent='+'+(cs.length-MAX);f.appendChild(more);}
        if(!shown)f.hidden=true;else if(cs.length>1)f.setAttribute('data-ds3-n',String(Math.min(cs.length,MAX+1)));}
    });
    return cards.length;
  }

  function atlas(){
    var ul=document.querySelector('[data-tll-atlas=grid]'),tiles=$$('[data-ds3=atlas] [data-ds3=tile]'),filed=[];
    if(!tiles.length)return null;
    tiles.forEach(function(t){
      var iso=(t.getAttribute('data-ds3-iso')||'').trim(),story=txt(t,'[data-ds3=tstory]');
      var fl=t.querySelector('[data-ds3=tflag]');if(fl&&!fl.firstChild){var i=img(iso,24);if(i)fl.appendChild(i);}
      var m=t.querySelector('[data-ds3=tmeta]');if(!m){m=document.createElement('small');m.setAttribute('data-ds3','tmeta');var nm=t.querySelector('[data-ds3=tname]');(nm?nm.parentNode:t).appendChild(m);}
      if(story){t.setAttribute('data-ds3-filed','');m.textContent='STORY FILED';filed.push({n:txt(t,'[data-ds3=tname]'),u:t.href});}else m.textContent='OPEN';
    });
    if(ul){
      ul.innerHTML='';ul.classList.add('ds3-on');
      tiles.forEach(function(t){var li=document.createElement('li');li.appendChild(t);ul.appendChild(li);});
      $$('[data-ds3=atlas]').forEach(function(w){w.classList.add('ds3-moved');w.setAttribute('aria-hidden','true');});
    }
    return {total:tiles.length,filed:filed,tiles:tiles};
  }

  function words(n,one,many){return n+' '+(n===1?one:many);}
  function counts(nStories,a){
    var k=document.querySelector('[data-tll-atlas=kicker]');if(k)k.textContent='EVERY COUNTRY \u00b7 BY FLAG \u00b7 '+a.total;
    var nF=a.filed.length,rest=a.total-nF;
    var sub=document.querySelector('.tlldx-sub');
    if(sub){sub.textContent='';sub.appendChild(document.createTextNode('Countries with a published story: '+nF+'. The other '+rest+' are open until someone files. '));var j=document.createElement('a');j.href='#atlas-all';j.setAttribute('data-tll-atlas','jump');j.textContent='Jump to every country by flag';sub.appendChild(j);sub.appendChild(document.createTextNode('.'));}
    var h2=document.querySelector('.tlldx-h2');
    if(h2&&nStories){var em=h2.querySelector('em');var cls=em?em.className:'tlldx-accent2';h2.textContent='';h2.appendChild(document.createTextNode(words(nF,'country','countries')+', '+nStories+' '));var e2=document.createElement('em');e2.className=cls;e2.textContent=nStories===1?'story':'stories';h2.appendChild(e2);h2.appendChild(document.createTextNode('.'));}
    if(nF&&!document.getElementById('tll-ds3-itemlist')){
      var ld={'@context':'https://schema.org','@type':'ItemList','@id':'https://www.thatlayover.life/destinations#countries-with-stories','name':'Countries with a published story on That Layover Life','numberOfItems':nF,'itemListElement':a.filed.map(function(f,i){return {'@type':'ListItem','position':i+1,'name':f.n,'url':f.u};})};
      var s=document.createElement('script');s.type='application/ld+json';s.id='tll-ds3-itemlist';s.textContent=JSON.stringify(ld);document.head.appendChild(s);
    }
  }

  /* Signed-in member only: their own depth on their own tiles, never a total. Same counting rule as the map: own non-pet travelers. */
  function mine(a){
    var tries=0,iv=setInterval(function(){var ms=window.$memberstackDom;if(!ms){if(++tries>40)clearInterval(iv);return;}clearInterval(iv);
      ms.getCurrentMember().then(function(r){var id=r&&r.data&&r.data.id;if(!id)return;
        var ls=null;try{if(localStorage.getItem('tllStatesOwner')===id)ls=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){}
        if(ls&&ls.v===2&&ls.states)mark(a,ls);
        return ms.getMemberJSON().then(function(mj){var st=mj&&mj.data&&mj.data.tllStates;if(st&&st.v===2&&st.states)mark(a,st);});
      }).catch(function(){});},250);
  }
  function mark(a,d){
    var hum={},any=0,R={lived:3,visited:2,layover:1},W={3:'LIVED',2:'STAYED',1:'LAYOVER'},dep={};
    (d.travelers||[]).forEach(function(t){if(t&&!t.pet){hum[t.id]=1;any=1;}});
    Object.keys(d.states).forEach(function(k){var row=d.states[k]||{},b=0;Object.keys(row).forEach(function(id){if(any&&!hum[id])return;b=Math.max(b,R[row[id]]||0);});dep[pad(k)]=b;});
    a.tiles.forEach(function(t){var id=mapId(t.getAttribute('data-ds3-iso')),b=id?dep[id]||0:0,m=t.querySelector('[data-ds3=tmine]');
      if(!b){if(m)m.remove();return;}
      if(!m){m=document.createElement('small');m.setAttribute('data-ds3','tmine');var tm=t.querySelector('[data-ds3=tmeta]');tm.parentNode.insertBefore(m,tm.nextSibling);}
      m.innerHTML='<span class="ds3-sr">On your map: </span>'+W[b];});
  }

  function boot(){
    try{var oc=document.querySelector('.tlldx-card-open');if(oc&&oc.getAttribute('href')==='/share')oc.setAttribute('href','/submit');}catch(e){}
    try{var n=shelf();var a=atlas();if(a){counts(n,a);mine(a);}}catch(e){if(window.console)console.warn('ds3',e);}
  }
  if(document.readyState!=='loading')boot();else document.addEventListener('DOMContentLoaded',boot);
})();
