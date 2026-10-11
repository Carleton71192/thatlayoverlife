/* TLL public traveler profile 3.0 (pf3, 11 Oct 2026). Rows P3, P4, P5, P10 and the sameAs line from the approved proposal.
   Reads only: the bound Member ID on [data-pf3="owner"], the viewer's own Memberstack id and tllStates (never written here),
   the Directory item already on the page, and the /stories shelf. Nothing is typed: every count is counted.
   P5: the old footer binder is switched off by the header page script tllpf3guardv1 (window.__tllProfStats=1). As a fallback
   this script locks the three counted stats so no other writer (binder, sitewide story counter) can change them afterwards. */
(function(){
  if(window.__pf3Prof) return; window.__pf3Prof=1;
  var D=document;
  function q(s,r){return [].slice.call((r||D).querySelectorAll(s));}
  function one(s,r){return (r||D).querySelector(s);}
  function txt(e){return e?(e.textContent||'').trim():'';}
  function lock(el,val){if(!el)return;el.__pf3v=String(val);if(el.textContent!==el.__pf3v)el.textContent=el.__pf3v;
    if(!el.__pf3o&&window.MutationObserver){el.__pf3o=new MutationObserver(function(){if(el.__pf3v!=null&&el.textContent!==el.__pf3v)el.textContent=el.__pf3v;});el.__pf3o.observe(el,{childList:true,characterData:true,subtree:true});}}
  function stat(el){return el?el.closest('[data-tll-prof="stat"]'):null;}

  /* P5. Stats. Visitors see the bound Country count and Continents marathoned; nothing else may overwrite them. */
  var nC=one('[data-tll-prof="n-countries"]'),nK=one('[data-tll-prof="n-continents"]'),nS=one('[data-tll-prof="n-stories"]');
  if(nC&&/^\d+$/.test(txt(nC)))lock(nC,txt(nC));
  if(nK&&/^\d+$/.test(txt(nK)))lock(nK,txt(nK));
  var sS=stat(nS);if(sS)sS.classList.add('pf3-pending');
  function storiesDone(n){if(!nS||!sS)return;sS.classList.remove('pf3-pending');if(n==null){sS.style.display='none';return;}lock(nS,n);}
  setTimeout(function(){if(sS&&sS.classList.contains('pf3-pending'))storiesDone(null);},10000);

  /* Same rule as the map editor's tllOwnN: Lived + Stayed for the member's own (non-pet) travelers, layovers apart. */
  function ownN(d){var hum={},any=0;(d&&d.travelers||[]).forEach(function(t){if(t&&!t.pet){hum[t.id]=1;any=1;}});var n=0;
    Object.keys(d&&d.states||{}).forEach(function(k){var row=d.states[k]||{},ok=false;Object.keys(row).forEach(function(id){if(any&&!hum[id])return;var v=row[id];if(v==='lived'||v==='visited')ok=true;});if(ok)n++;});return n;}
  var ownerId=((one('[data-pf3="owner"]')||{getAttribute:function(){return '';}}).getAttribute('data-member')||'').trim();
  function showOwn(st){if(!nC||!st||st.v!==2||!st.states)return;lock(nC,ownN(st));var s=stat(nC);if(s){s.setAttribute('data-pf3-own','');s.style.display='';}}
  if(ownerId&&nC){var tries=0,iv=setInterval(function(){var ms=window.$memberstackDom;if(!ms){if(++tries>40)clearInterval(iv);return;}clearInterval(iv);
    ms.getCurrentMember().then(function(r){var id=r&&r.data&&r.data.id;if(!id||id!==ownerId)return;
      var ls=null;try{if(localStorage.getItem('tllStatesOwner')===id)ls=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){}
      if(ls&&ls.v===2)showOwn(ls);
      return ms.getMemberJSON().then(function(mj){var st=mj&&mj.data&&mj.data.tllStates;if(st&&st.v===2)showOwn(st);});
    }).catch(function(){});},250);}

  function ready(fn){if(D.readyState!=='loading')fn();else D.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    var slug=decodeURIComponent((location.pathname.match(/\/contributors\/([^\/?#]+)/)||[])[1]||'').toLowerCase();
    var heroId=one('[data-tll-prof="hero-id"]');

    /* P3. Hide Traveler Category when it says the same as Badge ("Founder" twice). */
    var role=one('[data-tll-prof="badge-role"]'),cat=one('[data-tll-prof="badge-cat"]');
    function norm(s){return s.toLowerCase().replace(/^the\s+/,'').trim();}
    if(role&&cat&&txt(cat)&&norm(txt(role))===norm(txt(cat)))cat.classList.add('pf3-dupe');

    /* P4. Languages from the Directory item (bound element), shown only when the member has the expat directory on.
       Speaks and pronouns are moved (not copied) behind Lives in so the mono line reads in order. */
    var dir=q('[data-tll-dir]').filter(function(n){return (n.getAttribute('data-slug')||'').toLowerCase()===slug;})[0];
    var expat=dir&&((dir.getAttribute('data-flags')||'').split(/\s+/).indexOf('expat')>-1);
    var lang=q('[data-tll-prof="dir-src"] [data-pf3="langs"]').filter(function(n){return (n.getAttribute('data-slug')||'').toLowerCase()===slug;})[0];
    var dh=one('[data-tll-prof="dir-hero"]'),lives=dh&&!dh.hasAttribute('hidden')?one('[data-tll-prof="dir-lives"]',dh):null,pro=one('[data-tll-prof="pronouns"]');
    if(heroId&&lang&&expat&&txt(lang)){if(lives)lives.parentNode.insertBefore(lang,lives.nextSibling);else heroId.appendChild(lang);}else lang=null;
    if(pro&&lives)lives.parentNode.insertBefore(pro,(lang||lives).nextSibling);
    var parts=[one('[data-tll-prof="home"]'),lives,lang,pro];
    var first=true;parts.forEach(function(e){if(!e)return;if(!txt(e)||e.style.display==='none'){e.classList.remove('pf3-sep');return;}if(first){first=false;e.classList.remove('pf3-sep');}else e.classList.add('pf3-sep');});

    /* P8. tll-prof-v2-js hides every [data-tll-link] row whose URL line is not a full URL, which includes the switched-on
       Directory rows tll-prof-dir-js-v1 just rendered (their URL line is shortened). Show those rows again; their href is a
       checked http(s) URL from the member's own Directory item, and the empty state goes when one is visible. */
    var dl=one('[data-tll-prof="dir-links"]');
    if(dl&&!dl.hasAttribute('hidden')){var shown=0;q('[data-tll-link]',dl).forEach(function(a){if(/^https?:\/\//i.test(a.getAttribute('href')||'')){a.style.display='';shown++;}});
      if(shown){var le=one('[data-tll-prof="links-empty"]');if(le)le.style.display='none';}}

    /* sameAs for the Person (…#person): only links that exist on the page, never typed. */
    var hrefs=[];q('[data-tll-link]').forEach(function(a){if(a.style.display==='none')return;var h=a.getAttribute('href')||'';if(/^https?:\/\//i.test(h)&&!/thatlayover\.life/i.test(h)&&hrefs.indexOf(h)<0)hrefs.push(h);});
    var can=one('link[rel="canonical"]');
    if(hrefs.length&&can&&can.href){var s=D.createElement('script');s.type='application/ld+json';s.id='tll-pf3-sameas';s.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Person','@id':can.href.split('#')[0]+'#person','sameAs':hrefs});D.head.appendChild(s);}

    /* P5 stories count and P10 photos: the same /stories shelf tll-prof-v2-js reads, same byline match. */
    var name=txt(one('[data-tll-prof="name"]'));
    if(!name||!window.fetch||!window.DOMParser){storiesDone(null);return;}
    fetch('/stories',{credentials:'same-origin'}).then(function(r){return r.text();}).then(function(h){
      var doc=new DOMParser().parseFromString(h,'text/html'),lc=name.toLowerCase();
      var cards=q('a.tll-lib-card,[data-tll-card]',doc).filter(function(c){var img=c.querySelector('.tll-lib-byline-img');var by=(img&&img.getAttribute('alt'))||'';return by.trim().toLowerCase()===lc||(c.textContent||'').toLowerCase().indexOf(lc)>-1;});
      var seen={};cards=cards.filter(function(c){var k=c.getAttribute('href')||c.id;if(!k||seen[k])return false;seen[k]=1;return true;});
      storiesDone(cards.length);
      var pics={};cards.forEach(function(c){var href=c.getAttribute('href')||('/stories/'+c.id);if(href&&!/^\/stories\//.test(href)&&c.id)href='/stories/'+c.id;
        var im=c.querySelector('img.tll-lib-img,.tll-lib-img img,img:not(.tll-lib-byline-img)'),src=im?(im.getAttribute('src')||''):'';
        if(!src){var bg=c.querySelector('.tll-lib-img');var m=bg&&(bg.getAttribute('style')||'').match(/url\(["']?([^"')]+)/);if(m)src=m[1];}
        if(src)pics[href.replace(/\/$/,'')]=src;});
      function deco(){q('[data-tll-prof="filed-list"] .tll-prof-story').forEach(function(a){if(a.__pf3)return;a.__pf3=1;
        var body=D.createElement('span');body.className='pf3-story-body';q('.tll-prof-story-meta,.tll-prof-story-title',a).forEach(function(x){body.appendChild(x);});a.appendChild(body);
        var src=pics[(a.getAttribute('href')||'').replace(/^https?:\/\/[^\/]+/i,'').replace(/\/$/,'')];
        if(src){var i=D.createElement('img');i.className='pf3-story-img';i.src=src;i.alt='';i.width=210;i.height=164;i.loading='lazy';i.decoding='async';a.insertBefore(i,a.firstChild);}});}
      deco();var fl=one('[data-tll-prof="filed-list"]');
      if(fl&&window.MutationObserver){var mo=new MutationObserver(deco);mo.observe(fl,{childList:true});setTimeout(function(){mo.disconnect();},15000);}
    }).catch(function(){storiesDone(null);});

    /* Owner view stays current if the map is edited in another tab. */
    window.addEventListener('storage',function(e){if(e.key!=='tllStates'||!ownerId||!nC||!stat(nC)||!stat(nC).hasAttribute('data-pf3-own'))return;try{showOwn(JSON.parse(e.newValue||'null'));}catch(x){}});
  });
})();
