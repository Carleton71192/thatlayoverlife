/* tll-a3-account-js-v1 · Account 3.0 (approved by Nancy 12 Oct 2026, "Go with defaults").
   Builds the tab rail, the hero status line and action row, the profile progress, Finish your profile, the panel headings,
   the list rule lines and the signed-out gate lines. Reads Memberstack with getCurrentMember only. Never calls updateMember,
   updateMemberJSON or anything that writes tllStates, tllPlaces or tllLists. Nothing is moved: tabs show and hide existing parts. */
(function(){
  if(window.__tllA3) return; window.__tllA3=1;
  var d=document, H=d.documentElement;
  function $(s,r){return (r||d).querySelector(s);}
  function $$(s,r){return [].slice.call((r||d).querySelectorAll(s));}
  function el(tag,attrs,txt){var e=d.createElement(tag); if(attrs){for(var k in attrs){e.setAttribute(k,attrs[k]);}} if(txt!=null) e.textContent=txt; return e;}
  function after(ref,node){ if(ref&&ref.parentNode) ref.parentNode.insertBefore(node,ref.nextSibling); }

  /* A13: signed-out gate lines and a way back. Runs for everyone; the gate card only shows to signed-out visitors. */
  function gate(){
    var card=$('[data-ms-content="anonymous"] .tll-account-gateout-card'); if(!card||$('.a3-gate',card)) return;
    var w=el('div',{'class':'a3-gate'});
    w.appendChild(el('p',{'class':'a3-gate-k'},'Behind the sign-in'));
    var ul=el('ul');
    ['Your map, counted out of 249.','Your lists and your Layover Wrapped.','Your share card, and who gets to see it.'].forEach(function(t){ ul.appendChild(el('li',null,t)); });
    w.appendChild(ul);
    var btns=$('.tll-account-gateout-buttons',card);
    if(btns) card.insertBefore(w,btns); else card.appendChild(w);
    card.appendChild(el('a',{href:'/stories','class':'a3-gate-back'},'Back to the stories →'));
  }
  gate();

  var M=$('[data-ms-content="members"]'); if(!M) return;
  function top(n){ while(n&&n.parentNode&&n.parentNode!==M) n=n.parentNode; return (n&&n.parentNode===M)?n:null; }
  var hero=$('.tll-account-hero',M);
  var actions=$('.tll-account-actions-section',M);
  var card1=actions&&$('.tll-pickin-card',actions), cards=card1?card1.parentNode:null;
  var data=$('.tll-acct-data',M);
  var map=$('[data-tll-acct="map"]',M);
  var extras=$('[data-tll-acct="extras"]',M);
  var lists=$('[data-tll-ls="sec"]',M), wr=$('[data-tll-wr="sec"]',M);
  var mine=$('.tll-account-mine-section',M), blocks=$$('.tll-account-mine-block',M);
  var stories=blocks[0]||null, pets=blocks[1]||null;
  var settings=$('.tll-account-settings-section',M);
  var share=top($('#tll-share-host',M));

  /* A2: action row (Edit profile beside the existing Sign out link, which keeps its place and its Memberstack attribute). */
  var signout=hero&&$('[data-tll-acct-signout]',hero);
  if(signout&&!$('.a3-btn-edit',hero)){
    var edit=el('a',{href:'/edit-profile','class':'a3-btn-edit'},'Edit profile');
    signout.parentNode.insertBefore(edit,signout);
  }

  /* A12: the rail. */
  var TABS=[
    {k:'overview',label:'Overview',leaves:[cards,wr],before:actions,h:'Overview',p:'Everything you have logged, written and shared. Tap a card to go to it.'},
    {k:'map',label:'Map and lists',leaves:[map,lists],before:map||extras,h:'Map and lists',p:'List by list. The full map lives on its own page.',cta:['/the-map','Open your map →','']},
    {k:'stories',label:'Stories',leaves:[stories],before:mine,h:'Your stories',cta:['/submit','Share another story','a3-cta-rose']},
    {k:'pets',label:'Pets',leaves:[pets],before:mine,h:'Pets',p:'Each pet gets a Paw Passport. Your pet follows your profile’s privacy setting.',cta:['/my-pets','+ Add a pet','']},
    {k:'card',label:'Share card',leaves:[share],before:share,h:'Share card'},
    {k:'privacy',label:'Privacy and data',leaves:[data],before:null,h:null},
    {k:'settings',label:'Login and email',leaves:[settings],before:settings,h:'Login and email'}
  ].filter(function(t){ t.leaves=t.leaves.filter(Boolean); return t.leaves.length>0; });
  if(TABS.length<2||!hero) return;
  var CONTAINERS=[actions,extras,mine].filter(Boolean);
  var byKey={};

  var rail=el('nav',{'class':'a3-rail','aria-label':'Account sections'});
  var list=el('div',{role:'tablist','aria-orientation':'vertical','aria-label':'Account sections'});
  rail.appendChild(list);
  TABS.forEach(function(t){
    byKey[t.k]=t;
    var b=el('button',{type:'button','class':'a3-tab',role:'tab',id:'a3-tab-'+t.k,'aria-selected':'false',tabindex:'-1','data-a3-tab':t.k});
    b.appendChild(el('span',null,t.label));
    var badge=el('span',{'class':'a3-badge','data-a3-badge':t.k}); b.appendChild(badge);
    list.appendChild(b); t.btn=b; t.badge=badge;
    var ids=[];
    t.leaves.forEach(function(n,i){ if(!n.id) n.id='a3-'+t.k+'-'+i; n.setAttribute('role','tabpanel'); n.setAttribute('aria-labelledby','a3-tab-'+t.k); ids.push(n.id); });
    if(t.h&&t.before){
      var ph=el('div',{'class':'a3-ph',id:'a3-ph-'+t.k,tabindex:'-1','data-a3-off':''});
      var tx=el('div'); tx.appendChild(el('h2',null,t.h)); if(t.p) tx.appendChild(el('p',null,t.p)); ph.appendChild(tx);
      if(t.cta) ph.appendChild(el('a',{href:t.cta[0],'class':('a3-cta '+t.cta[2]).trim()},t.cta[1]));
      M.insertBefore(ph,t.before); t.ph=ph; ids.unshift(ph.id);
    }
    b.setAttribute('aria-controls',ids.join(' '));
  });
  var editLink=el('a',{href:'/edit-profile','class':'a3-rail-link'},'Edit profile →');
  rail.appendChild(editLink);
  after(hero,rail);
  M.classList.add('a3-grid');

  /* A10: point to the Share card tab from the privacy panel; the "Your data stays yours." title is the panel heading. */
  var dataTitle=data&&$('.tll-acct-data-t',data);
  if(data&&!$('.a3-note',data)&&byKey.card){
    var dd=$('.tll-acct-data-d',data)||dataTitle;
    var note=el('p',{'class':'a3-note'}); note.appendChild(d.createTextNode('Who sees your card and your profile is set on the '));
    var go=el('a',{href:'#card','data-a3-go':'card'},'Share card tab'); note.appendChild(go); note.appendChild(d.createTextNode('.'));
    after(dd,note);
  }
  if(dataTitle) dataTitle.setAttribute('tabindex','-1');

  var cur=null;
  function select(k,how){
    var t=byKey[k]; if(!t) return;
    cur=k;
    TABS.forEach(function(o){
      var on=(o.k===k);
      o.btn.setAttribute('aria-selected',on?'true':'false'); o.btn.setAttribute('tabindex',on?'0':'-1');
      o.leaves.forEach(function(n){ if(on) n.removeAttribute('data-a3-off'); else n.setAttribute('data-a3-off',''); });
      if(o.ph){ if(on) o.ph.removeAttribute('data-a3-off'); else o.ph.setAttribute('data-a3-off',''); }
    });
    CONTAINERS.forEach(function(c){
      var any=TABS.some(function(o){ return o.k===k&&o.leaves.some(function(n){ return n!==c&&c.contains(n); }); });
      if(any) c.removeAttribute('data-a3-off'); else c.setAttribute('data-a3-off','');
    });
    if(how&&how.hash!==false){ try{ history.replaceState(null,'','#'+k); }catch(e){} }
    if(how&&how.focusTab) t.btn.focus();
    if(how&&how.focusPanel){ var f=t.ph||(k==='privacy'?dataTitle:null)||t.leaves[0]; if(f){ if(!f.hasAttribute('tabindex')) f.setAttribute('tabindex','-1'); try{ f.focus({preventScroll:false}); }catch(e){ f.focus(); } } }
  }
  list.addEventListener('click',function(e){ var b=e.target.closest('[data-a3-tab]'); if(!b) return; select(b.getAttribute('data-a3-tab'),{focusPanel:true}); });
  list.addEventListener('keydown',function(e){
    var keys=TABS.map(function(t){return t.k;}), i=keys.indexOf(cur), n=null;
    if(e.key==='ArrowDown'||e.key==='ArrowRight') n=(i+1)%keys.length;
    else if(e.key==='ArrowUp'||e.key==='ArrowLeft') n=(i-1+keys.length)%keys.length;
    else if(e.key==='Home') n=0; else if(e.key==='End') n=keys.length-1;
    if(n===null) return; e.preventDefault(); select(keys[n],{focusTab:true});
  });
  d.addEventListener('click',function(e){ var a=e.target.closest&&e.target.closest('[data-a3-go]'); if(!a) return; e.preventDefault(); select(a.getAttribute('data-a3-go'),{focusPanel:true}); });
  function fromHash(){ var h=(location.hash||'').replace('#',''); return byKey[h]?h:null; }
  window.addEventListener('hashchange',function(){ var h=fromHash(); if(h&&h!==cur) select(h,{hash:false}); });
  function narrow(){ var w=window.matchMedia&&window.matchMedia('(max-width:830px)').matches; list.setAttribute('aria-orientation',w?'horizontal':'vertical'); }
  narrow(); if(window.matchMedia){ var mq=window.matchMedia('(max-width:830px)'); if(mq.addEventListener) mq.addEventListener('change',narrow); }
  select(fromHash()||'overview',{hash:false});
  H.classList.add('a3-on');

  /* Badges: only numbers the live scripts already computed (LOGGED total, pet count). Never typed. */
  function countOf(sel){ var l=cards&&$(sel,cards); var c=l&&l.parentNode.querySelector('.tll-mod-count'); var v=c?c.textContent.trim():''; return /^\d+$/.test(v)?v:''; }
  function badges(){ if(byKey.map) byKey.map.badge.textContent=countOf('[data-tll-mod="countries"]'); if(byKey.pets) byKey.pets.badge.textContent=countOf('[data-tll-mod="pets"]'); }
  badges();
  if(cards&&window.MutationObserver) new MutationObserver(badges).observe(cards,{childList:true,subtree:true,characterData:true});

  /* A7: one rule line per list tab, from the design. Lists without a rule in the design get none. */
  var RULES={countries:'Set foot outside the airport. Layovers count separately.',airports:'Connected through or flew from.',cities:'One night, or the center on foot.',unesco:'Stood inside the listed property.',landmarks:'Saw it in person.',parks:'Boots inside the boundary.',ports:'Boarded or left a boat here.',marathons:'42.195 km, finished.'};
  var lsInner=lists&&$('[data-tll-ls="inner"]',lists), lsTabs=lists&&$('[data-tll-ls="tabs"]',lists);
  if(lsInner&&lsTabs){
    var rule=el('p',{'class':'a3-rule'}); var rk=el('b',null,'WHAT COUNTS'); var rt=el('span'); rule.appendChild(rk); rule.appendChild(rt);
    after(lsTabs,rule);
    var paintRule=function(){ var s=$('[data-tll-ls-tab][aria-selected="true"]',lsTabs); var k=s?s.getAttribute('data-tll-ls-tab'):'countries'; var r=RULES[k]||''; rt.textContent=r; rule.hidden=!r; };
    paintRule();
    if(window.MutationObserver) new MutationObserver(paintRule).observe(lsTabs,{attributes:true,subtree:true,attributeFilter:['aria-selected'],childList:true});
  }

  /* A2, A3, A5: status line, progress and Finish your profile, from existing Memberstack data only. Read only. */
  function yes(v){ return v===true||v==='true'||v==='on'||v==='yes'||v===1||v==='1'; }
  function has(v){ return typeof v==='string'?v.trim().length>0:(v!=null&&v!==false&&v!==''); }
  /* E3 (look build, 27 Oct 2026, handoff/CHANGE-LOG-EDIT-PROFILE-LOOK-2026-10-27.md): the same eight steps as this page's profile card and the /edit-profile developing card, read from the saved profile and the map. Nothing typed. */
  function list(v){ return String(v||'').split(',').map(function(x){return x.trim();}).filter(Boolean); }
  function mapSaved(j){ if(j&&j.tllSnapshot&&Number(j.tllSnapshot.places||0)>0) return true; try{ var s=JSON.parse(localStorage.getItem('tllStates')||'null'); return !!(s&&s.v===2&&s.states&&Object.keys(s.states).length); }catch(e){ return false; } }
  function checks(m,j){
    var cf=(m&&m.customFields)||{}, ls=list(cf['links-shown']);
    var links=['instagram-url','youtube-url','personal-website-url','tiktok-url','substack-url','strava-url','alltrails-url','komoot-url','garmin-url','beli-url'].filter(function(k){ return has(cf[k]); });
    var on=links.filter(function(k){ return !ls.length||ls.indexOf(k.replace(/-url$/,'').replace('personal-website','website'))>-1; }).length;
    /* Records saved by the older editor keep links in link-{name} with link-{name}-on; those count too, so nobody's done step flips back. */
    if(!on) on=Object.keys(cf).some(function(k){ return /^link-/.test(k)&&!/-on$/.test(k)&&has(cf[k])&&yes(cf[k+'-on']); })?1:0;
    return [
      ['Photo','add a photo',has(m.profileImage),'/edit-profile#ep-who'],
      ['One line','write your one line',has(cf['one-line']),'/edit-profile#ep-who'],
      ['Home base','add your home base',has(cf['home-base'])||has(cf['lives-country']),'/edit-profile#ep-who'],
      ['Flags you have lived under','add the flags you have lived under',list(cf['from-and-lived-in']).length>0,'/edit-profile#ep-who'],
      ['Languages','add the languages you speak',list(cf.languages).length>0,'/edit-profile#ep-who'],
      ['Bio','write a short bio',has(cf['bio-long'])||has(cf['bio-short']),'/edit-profile#ep-about'],
      ['A link switched on','switch on a link',on>0,'/edit-profile#ep-links'],
      ['Your map saved','save your map',mapSaved(j),'/the-map']
    ];
  }
  function paintMember(m,j){
    if(!m||$('.a3-status',hero)) return;
    var cf=m.customFields||{};
    var lvl=String(cf['share-level']||'off').toLowerCase();
    var vis=lvl==='public'?'PUBLIC':lvl==='unlisted'?'LINK ONLY':'JUST YOU';
    var dir=[]; if(yes(cf['is-expat'])) dir.push('/EXPATS'); if(yes(cf['is-creator'])) dir.push('/CREATORS'); if(yes(cf['is-press'])) dir.push('/PRESS');
    var st=el('ul',{'class':'a3-status','aria-label':'Profile status'});
    st.appendChild(el('li',null,'PROFILE · '+vis));
    st.appendChild(el('li',null,'DIRECTORY · '+(dir.length?dir.join(' '):'OFF')));
    var h1=$('h1',hero); after(h1,st);
    var c=checks(m,j), done=c.filter(function(x){return x[2];}).length, next=c.filter(function(x){return !x[2];})[0];
    var pr=el('div',{'class':'a3-prog'});
    var tp=el('div',{'class':'a3-prog-top'}); var lab=el('span',{id:'a3-prog-l'},'PROFILE '+done+' OF '+c.length+' DONE'); tp.appendChild(lab);
    tp.appendChild(el('a',{href:next?next[3]:'/edit-profile'},next?('Next: '+next[1]+' →'):'All done →'));
    pr.appendChild(tp);
    var bar=el('div',{'class':'a3-bar',role:'progressbar','aria-labelledby':'a3-prog-l','aria-valuemin':'0','aria-valuemax':String(c.length),'aria-valuenow':String(done)});
    var fill=el('span'); fill.style.width=Math.round(done/c.length*100)+'%'; bar.appendChild(fill); pr.appendChild(bar);
    var row=$('.tll-account-hero-row',hero); after(row||h1,pr);
    var wrIn=wr&&$('[data-tll-wr="inner"]',wr);
    if(wrIn&&!$('.a3-finish',wrIn)){
      var f=el('section',{'class':'a3-finish','aria-labelledby':'a3-fin-h'});
      f.appendChild(el('h3',{id:'a3-fin-h'},'Finish your profile'));
      f.appendChild(el('p',null,'It shows on your Travelers card.'));
      var ul=el('ul');
      c.forEach(function(x){
        var li=el('li',x[2]?{'class':'a3-done'}:null);
        li.appendChild(el('span',{'class':'a3-dot','aria-hidden':'true'},x[2]?'✓':''));
        var l=el('span',{'class':'a3-lbl'},x[0]); l.appendChild(el('span',{'class':'a3-sr'},x[2]?' (done)':' (to do)')); li.appendChild(l);
        if(!x[2]){ li.appendChild(el('a',{href:x[3],'class':'a3-add','aria-label':'Add '+x[0].toLowerCase()},'ADD →')); }
        ul.appendChild(li);
      });
      f.appendChild(ul); wrIn.appendChild(f); wrIn.classList.add('a3-wr2');
    }
  }
  var tries=0, iv=setInterval(function(){
    var ms=window.$memberstackDom;
    if(ms&&ms.getCurrentMember){ clearInterval(iv); ms.getCurrentMember().then(function(r){ var m=r&&r.data; if(!m) return; if(ms.getMemberJSON) return ms.getMemberJSON().then(function(j){ paintMember(m,j&&j.data); }).catch(function(){ paintMember(m,null); }); paintMember(m,null); }).catch(function(){}); }
    else if(++tries>30) clearInterval(iv);
  },300);
})();
