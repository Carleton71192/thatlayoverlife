/* tll-early-state-v1 (16 Nov 2026, layout shift sweep part B, causes C1, C3, C6 and C9; reports/evidence/cls-sweep-2026-11-16/fix.md).
   Some of the site's own code settles the first screen only when the page is parsed, after the first paint: the site head moves the nav
   out of the members wrapper (/account, /submit) and adds the Menu button (every page), the /stories page code moves the search form
   into the filter row and marks the lead card, and the profile page code builds the profile head. Each of those moved what a
   reader was already looking at.
   This layer lays the same end state out while the page is parsed, before the first paint, and hands the page back right before the
   page's own code runs, so that code finds the page as it has always found it and the finished page is its own work.
     when     A MutationObserver watches the page arrive; a piece goes in once the elements it needs have arrived whole.
     before   Window capture of DOMContentLoaded, which runs before every listener on the document: the stand-in Menu button is taken
              out, the nav's early style is removed, the lead mark is taken off, and the early extras on the profile photo are
              removed. The page's own listeners then do their work in the same task, so no frame is painted in between.
     after    Window bubble of DOMContentLoaded, which runs after every listener on the document: follow-ups (a tap on the stand-in
              Menu button is passed on and the focus it left there goes to the real button, the profile stand-in is let go one timer
              later, after the page's own timer).
     hard     After 20 s without a page-parsed event everything is handed back and the layer stops.
   Pieces:
     Menu     every page with the site head script tll-mobile-nav-js-v1: a stand-in button with the real button's class at the end of
              the nav's button row, so the row has its final width (and, from 768 to 899 px, the header its final height) from the
              first paint. It is not announced and not in the tab order.
     nav      /account and /submit, with the site head script tll-proto-parity-js-v1: until the page is parsed a style shows the
              nav inside its hidden [data-ms-content] wrapper (the wrapper has no box of its own, its other children stay hidden),
              the picture navOut() makes when it moves the nav in front of the wrapper. Nothing is moved, so page scripts that run while the page is parsed find it as served.
              The wrapper and every data-ms-* attribute are left as they are.
     stories  /stories: (1) the search form goes into the filter row, made the way the page's tll-lib-lead-v1 makes it; it is handed
              back the moment that script's element is parsed, right before it runs and merges for itself. (2) The first card
              leads from the moment the parser adds it. When the whole grid has arrived and the page's rules name another card (a pick
              further down, a newer story), the page's own moves are made: the chip script's order (newest first), the pick in
              front, the mark. Before the page's scripts run the mark is taken off and a changed order is put back. Not with a
              search (?q=). (3) The title stays in its fallback faces until both of its font files are in, then takes both at once
              (with one of the two in, the rose word jumped 130 px and back). With a search (?q=) it lets go in a frame of its own,
              never in the frame in which the search filter brings the matching cards up.
              Two things our stories chunk does when the page is parsed are left to the chunk, after a try each. The story count
              in front of the title: put in early it rewraps a title that is still in its fallback faces, which moved more of the
              page than the chunk's own write does later. The place chips it adds and orders: put in early, the longer row wraps
              on tablets, and a chip changes rows when the web font arrives (0.07 at 768 px against 0.03).
     profile  /contributors/{slug}: a stand-in for the hero's text column, filled from the same attributes of [data-pf5="root"] the
              page's tll-pf5-profile-js-v1 and tll-pf5-n-v1 read, sits right after the real column, which is left untouched and not
              shown until the page's code has filled it (one timer after the page-parsed listeners). Then the stand-in is removed
              and the real column shows. The flags in the stand-in are their round places only: no file is asked for early. The
              home base is never in the stand-in: the core's own rule is that it stays hidden until the Worker says the member has
              switched it on. The badge and the initials on the photo go in early and are removed right before the page's code
              adds its own. A profile set to Off gets no stand-in.
   If a page script is missing or throws, the page ends as it does without this layer: nothing here survives the hand-back.
   No data-ms-* attribute is read or written apart from finding the nav's wrapper; no form or field name is touched. If the core runs
   after the page is parsed, the layer does nothing. */
(function(){
var D=document,W=window;
if(D.readyState!=='loading'||!W.MutationObserver)return;
if(W.__tllEarlyState)return;W.__tllEarlyState=1;
var path=location.pathname.replace(/\/+$/,'')||'/',HARD=20000;
var steps=[],keep=[],before=[],after=[],hard=[],mo=null,over=0;
function q(s,r){return (r||D).querySelector(s);}
function el(t,c,x){var e=D.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
function drop(n){if(n&&n.parentNode)n.parentNode.removeChild(n);}
function sheet(id,css){var s=D.createElement('style');s.id=id;s.textContent=css;(D.head||D.documentElement).appendChild(s);return s;}
function once(f){var d=0;return function(){if(!d){d=1;try{f();}catch(e){}}};}
function clear(n){while(n&&n.firstChild)n.removeChild(n.firstChild);}
/* an element has arrived whole once an element follows it or one of its ancestors below the body's own children */
function whole(n){for(;n&&n.parentNode&&n.parentNode!==D.body;n=n.parentNode){if(n.nextElementSibling)return true;}return false;}
/* the same, and a child of the body counts once an element follows it (the nav is the body's first child on most pages) */
function done(n){for(;n&&n.parentNode;n=n.parentNode){if(n.nextElementSibling)return true;if(n.parentNode===D.body)break;}return false;}
/* back to where a node was: in front of the node that followed it, or at the end of its old parent */
function back(n,p,ref){if(n&&p)p.insertBefore(n,ref&&ref.parentNode===p?ref:null);}
function inDoc(n){return !!(n&&D.documentElement.contains(n));}

/* ---- the Menu button (C9) ---- */
if(D.getElementById('tll-mobile-nav-js-v1'))(function(){
  var mb=null,tap=0,foc=0;
  steps.push(function(){var nav=q('.tll-nav-v1'),cta=nav&&q('.tll-nav-cta-row',nav);
    if(!cta||!q('.tll-nav-links-row',nav)||!done(cta))return false;
    if(nav.__tllmm||q('.tllmm-btn',cta))return true;
    mb=el('button','tllmm-btn','Menu');mb.type='button';mb.tabIndex=-1;mb.setAttribute('aria-hidden','true');
    mb.addEventListener('click',function(){tap=1;});cta.appendChild(mb);
    /* the real button is the row's last child: should the parser still add to the row, the stand-in stays last */
    keep.push(function(){if(mb.parentNode&&mb.nextSibling)mb.parentNode.appendChild(mb);});
    return true;});
  before.push(function(){foc=!!(mb&&D.activeElement===mb);drop(mb);});
  /* a tap on the stand-in is passed on. Where the tap left the focus on the stand-in (browsers that focus a tapped button) and it fell
     back to the body when the stand-in went, the real button takes it first, as after a tap on the real button */
  after.push(function(){if(!tap)return;var b=q('.tll-nav-v1 .tll-nav-cta-row .tllmm-btn');if(!b)return;
    if(foc&&(!D.activeElement||D.activeElement===D.body||D.activeElement===mb)){try{b.focus({preventScroll:true});}catch(e){}}
    b.click();});
})();

/* ---- the nav on /account and /submit (C1) ---- */
/* The nav is the first child of a [data-ms-content="members"] wrapper, which the site keeps hidden until Memberstack has answered
   (html.ms-loaded); navOut() in the site head moves the nav in front of the wrapper when the page is parsed. Here nothing is moved:
   until then a style gives the wrapper no box of its own (display:contents) and shows the nav as its only child, which is the same
   picture; with a box of its own the wrapper would start at the top and count as moved by the nav's height when navOut() has run
   (0.05 at 1440 on /account). The page's scripts that
   run while the page is parsed find the page as it was served (tll-a3-account-js-v1 on /account takes the first
   [data-ms-content="members"] in the document: with the nav moved out early that was the nav's own member block, and the account
   page lost its tab rail). No data-ms-* attribute is written; the mark is on the nav. Not where :has() is unknown. */
if((path==='/account'||path==='/submit')&&D.getElementById('tll-proto-parity-js-v1'))(function(){
  var ok=false;try{ok=!!(W.CSS&&W.CSS.supports&&W.CSS.supports('selector(:has(*))'));}catch(e){}
  if(!ok)return;
  var nav=null,st=null,MARK='data-tll-es-nav',WR='html:not(.ms-loaded) [data-ms-content]:has(>nav['+MARK+'])';
  steps.push(function(){var n=q('nav.tll-nav-v1'),w=n&&n.parentNode;if(!n)return false;
    if(!w||w.nodeType!==1||!w.hasAttribute('data-ms-content'))return true;
    nav=n;n.setAttribute(MARK,'');
    st=sheet('tll-es-nav-v1',WR+'{display:contents!important}'+WR+'>:not(nav['+MARK+']){display:none!important}');return true;});
  /* let go before navOut() runs: it then moves the nav out in the same task, so no frame is painted in between */
  before.push(function(){drop(st);if(nav)nav.removeAttribute(MARK);});
})();

/* ---- /stories (C6) ---- */
if(path==='/stories')(function(){
  /* (1) the search form in the filter row: what merge() in the page's tll-lib-lead-v1 makes */
  var slot=null,form=null,fp=null,fn=null,clr=null,cp=null,cn=null,bar=null,bd='',bs=false,inner=null;
  function merge(){inner=q('.tll-library-filters .tll-filters-inner');form=q('.tllsb-form');bar=q('.tllsb-bar');
    if(!inner||!form||!bar||!whole(bar)||!whole(inner))return false;
    if(q('.tllsb-form',inner))return true;
    fp=form.parentNode;fn=form.nextSibling;clr=D.getElementById('tll-lib-clear');if(clr){cp=clr.parentNode;cn=clr.nextSibling;}
    bs=bar.hasAttribute('style');bd=bar.style.display;
    slot=el('div','tll-lib-searchslot');slot.appendChild(form);if(clr)slot.appendChild(clr);inner.appendChild(slot);
    inner.setAttribute('data-tll-merged','1');bar.style.display='none';return true;}
  var unmerge=once(function(){if(!slot)return;
    if(clr&&clr.parentNode===slot)back(clr,cp,cn);if(form.parentNode===slot)back(form,fp,fn);
    drop(slot);inner.removeAttribute('data-tll-merged');bar.style.display=bd;if(!bs)bar.removeAttribute('style');});
  var merged=false;
  steps.push(function(){if(D.getElementById('tll-lib-lead-v1')){unmerge();return true;}
    if(!merged)merged=merge();return false;});
  before.push(unmerge);

  /* (2) the lead card. At the page-parsed event chips v1 puts the cards in order (newest first, each card appended again) and
     tll-lib-lead-v1 moves the editor's pick to the front and marks the first card shown. Here: the first card leads from the moment
     the parser adds it (it is the pick or the newest story on all but rare days). When the whole grid has arrived the page's rules are
     asked: if they name the first card, nothing more is done and the page sorts the rest when it is parsed, as it always has. If they
     name another card, the page's own moves are made (the same order, the pick in front, the mark), so a grid that has been painted
     moves as it does when the page does it. Before the page's scripts run the mark is taken off and a changed order is put back. */
  var lead=null,was=null,grid=null;
  function txt(k,a){var n=q('['+a+']',k);return n?n.textContent.trim():'';}
  function pickOf(k){return q('[data-tll-pick]:not(.w-condition-invisible)',k);}
  /* a card the site hides (the stub story) cannot lead: the page's scripts skip what is not shown */
  function shown(k){return W.getComputedStyle(k).display!=='none';}
  var QS=/[?&]q=[^&]/.test(location.search);
  if(!QS){
    /* at once, before the card's own content has arrived: a frame painted with the first card half parsed and not yet marked showed
       it as a plain card, and marking it afterwards moved it (0.05 at 1440 in 1 load of 32) */
    steps.push(function(){var g=q('.tll-lib-grid'),k=g&&g.firstElementChild;if(!k)return false;
      if(!lead){lead=k;k.setAttribute('data-tll-lead','1');}return true;});
    steps.push(function(){grid=q('.tll-lib-grid');if(!grid||!whole(grid))return false;
      var rows=[].slice.call(grid.children).filter(function(k){return k.hasAttribute('data-tll-card')||q('[data-tll-card]',k);})
        .map(function(k,i){return {k:k,i:i,d:Date.parse(txt(k,'data-tll-date'))||0};});
      if(!rows.length)return true;
      rows.sort(function(a,b){return (b.d-a.d)||(a.i-b.i);});
      var to=null,pick=null,i;
      for(i=0;i<rows.length&&!pick;i++){if(pickOf(rows[i].k)&&shown(rows[i].k))pick=rows[i].k;}
      for(i=0;i<rows.length&&!pick&&!to;i++){if(shown(rows[i].k))to=rows[i].k;}
      to=pick||to;
      if(to&&to===lead&&grid.firstElementChild===to)return true;
      was=[].slice.call(grid.childNodes);
      rows.forEach(function(r){grid.appendChild(r.k);});
      if(pick&&grid.firstElementChild!==pick)grid.insertBefore(pick,grid.firstElementChild);
      if(lead&&lead!==to)lead.removeAttribute('data-tll-lead');lead=to;if(to)to.setAttribute('data-tll-lead','1');return true;});
    before.push(function(){if(lead)lead.removeAttribute('data-tll-lead');
      if(was)was.forEach(function(n){if(n.parentNode===grid)grid.appendChild(n);});});
  }

  /* (3) the title's two font files at once (the step tll-first-paint-v1 takes for the /the-map title). Until both are in, the title and
     its rose word each stay in their own fallback faces (their own stacks without Playfair Display), so the title looks and wraps as it
     does today before the fonts arrive; what goes is the state with one file in. */
  steps.push(function(){var h=q('h1.tll-library-title'),F=D.fonts;if(!h||!whole(h))return false;
    if(!F||!F.load||!F.check||!W.Promise)return true;
    var PF=/^\s*["']?Playfair Display["']?\s*,\s*/i,cs=W.getComputedStyle(h),fam=cs.fontFamily||'',rest=fam.replace(PF,'');
    if(!rest||rest===fam)return true;
    var em=q('em',h),ec=em&&W.getComputedStyle(em),ef=ec?ec.fontFamily||'':'',er=ef.replace(PF,''),tx=h.textContent||'',need=[cs.fontWeight+' 1em "Playfair Display"'];
    if(ec&&er&&er!==ef&&ec.fontStyle==='italic')need.push('italic '+ec.fontWeight+' 1em "Playfair Display"');else er='';
    var all=true,i;for(i=0;i<need.length;i++)if(!F.check(need[i],tx))all=false;
    if(all)return true;
    /* the page sets the title's family with !important from a selector of three classes and two tags; the class is repeated here to outweigh it */
    var sel='h1.tll-library-title.tll-library-title.tll-library-title.tll-library-title';
    var T=sheet('tll-es-libtitle-v1',sel+'{font-family:'+rest+'!important}'+(er?sel+' em{font-family:'+er+'!important}':'')),relT=once(function(){drop(T);});
    setTimeout(relT,HARD);
    /* With a search (?q=) the core's own search filter (tll-phase0-v1) hides the cards that do not match once the search index has
       answered, and the page's script does it again when the page is parsed: the matching cards come up from far below. In a frame that
       also changes the title's faces the browser multiplies the two moves (0.71 at 1440 in 4 of 9 lab loads; apart they are 0.01 and
       0.05). So with a search the title is let go in a frame in which the set of hidden cards is the one of the frame before. */
    var go=relT;
    if(QS&&W.requestAnimationFrame)go=function(){var n=-1,left=30,f=function(){var c=D.querySelectorAll('[data-tll-q-miss]').length;
      if(c===n||--left<0)relT();else{n=c;W.requestAnimationFrame(f);}};W.requestAnimationFrame(f);};
    var jobs=[];for(i=0;i<need.length;i++)jobs.push(F.load(need[i],tx));
    W.Promise.all(jobs).then(go,go);return true;});
})();

/* ---- the profile head (C3) ---- */
if(/^\/contributors\/[^/]+$/.test(path))(function(){
  var root=null,ghost=null,gs=null,extras=[],slug='';
  function A(n){var v=root.getAttribute('data-'+n);return v==null?'':String(v).trim();}
  function on(k){var f=q('[data-pf5-flag="'+k+'"]');return !!(f&&!f.classList.contains('w-condition-invisible'));}
  function UP(s){return String(s||'').toUpperCase();}
  function g(k){return q('[data-pf5="'+k+'"]',ghost);}
  function url(u){u=String(u||'').trim();return /^https?:\/\/\S+$/i.test(u)?u:'';}
  function bit(meta,t){var l=meta.lastChild;if(l&&!(l.classList&&l.classList.contains('pf5-flags')))meta.appendChild(el('span',null,'·'));meta.appendChild(el('span',null,t));}
  function arrow(a){var s=el('span',null,'↗');s.setAttribute('aria-hidden','true');a.appendChild(s);}
  /*links:src/pages/contributors-template/live-2026-11-16/tll-pf5-profile-js-v1.live.js*/
  var LINKS=[['instagram','Instagram'],['youtube','YouTube'],['website','Website'],['tiktok','TikTok'],['substack','Substack'],['strava','Strava'],['alltrails','AllTrails'],['komoot','Komoot'],['garmin','Garmin'],['beli','Beli']];
  /* the stat strip. n is the member's story count, or -1 while the story list is still arriving: the STORIES cell then keeps its room */
  function stats(n){var S=g('stats');if(!S)return;clear(S);
    var snap=null;try{snap=JSON.parse(A('snapshot')||'null');}catch(e){}if(!snap||typeof snap!=='object')snap=null;
    var rg=on('ranges'),items=[];
    function ranged(v){v=+v||0;if(!rg)return String(v);if(v<10)return 'under 10';return (Math.floor(v/10)*10)+'-something';}
    if(snap&&(+snap.countries||snap.antarctica)){items.push([ranged(snap.countries),snap.antarctica?'+AQ':'','COUNTRIES']);items.push([ranged(snap.places),rg?'':'/ 250','PLACES']);}
    if(n>0)items.push([String(n),'',n===1?'STORY':'STORIES']);else if(n<0&&items.length)items.push(['0','','STORIES',1]);
    if(snap&&+snap.layovers>0)items.push(['+'+(+snap.layovers),'','LAYOVERS']);
    if(!items.length)return;
    items.forEach(function(it){var d=el('div'),v=el('div','pf5-stat-v',it[0]+(it[1]?' ':''));if(it[1])v.appendChild(el('small',null,it[1]));
      d.appendChild(v);d.appendChild(el('div','pf5-stat-k',it[2]));if(it[3])d.style.visibility='hidden';S.appendChild(d);});
    var i=el('a','pf5-stat-i','i');i.href='/the-map';i.title='What counts: lived or stayed. Antarctica beside. Layovers beside, never inside.';i.setAttribute('aria-label','What counts');S.appendChild(i);}
  /* the member's own stories in the list, as stories() in the page script counts them; -1 until the list has arrived whole */
  function count(){var L=q('[data-pf5="stories-list"]');if(!L||!whole(L))return -1;var n=0;
    [].forEach.call(L.querySelectorAll('[data-pf5="story-card"]'),function(c){if((c.getAttribute('data-by')||'').trim()===slug)n++;});return n;}
  /* hero() and buttons() of tll-pf5-profile-js-v1, then run() of tll-pf5-n-v1, written into the stand-in. Returns the shown name. */
  function build(){
    var name=A('name'),credit=(A('credit')||'Full').toLowerCase();
    name=credit==='pen'?(A('pen')||'Traveler'):credit==='first'?(name.split(/\s+/)[0]||'Traveler'):(name||'Traveler');
    var parts=name.split(/\s+/),first=parts[0]||'Traveler',last=parts.length>1?parts.slice(1).join(' '):'';
    var ey=g('eyebrow');if(ey)ey.textContent='TRAVELER · '+UP(slug);
    var sl=g('name-slot'),h=sl&&q('h1,h2,h3',sl);
    if(h){clear(h);h.appendChild(D.createTextNode(last?first+' ':first));if(last)h.appendChild(el('em',null,last));}
    var ol=g('one-line');if(ol)ol.textContent=A('one-line');
    var nv=!!D.getElementById('tll-pf5-n-v1'),P=null;
    if(nv){try{P=JSON.parse(A('partners')||'null');}catch(e){P=null;}if(!P||typeof P!=='object'||Array.isArray(P))P=null;}
    var meta=g('meta');
    if(meta){clear(meta);
      /* the home base (data-home) is left out: see the head of this file */
      var since=A('since'),y=since?String(new Date(since).getFullYear()):'';
      if(y&&y!=='NaN')meta.appendChild(el('span',null,'ON TLL SINCE '+y));
      var iso=A('flags').toLowerCase().split(/[\s,]+/).filter(function(c){return /^[a-z]{2}$/.test(c);}).slice(0,5),lab=null;
      if(iso.length){var fg=el('span','pf5-flags');lab=el('span',null,'FROM · HAS LIVED IN');fg.appendChild(lab);var row=el('span','pf5-flags-row');
        /* the flags keep their round 28 px places; the files are asked for by the page's own images, when the page code has run, as always */
        iso.forEach(function(c){var i=D.createElement('img');i.className='pf5-flag';i.alt='';i.title=c.toUpperCase();i.width=28;i.height=28;row.appendChild(i);});
        fg.appendChild(row);meta.appendChild(fg);}
      if(nv){var place=A('from-place').toUpperCase();
        if(lab)lab.textContent='FROM'+(place?' '+place:'')+(iso.length>1?' · HAS LIVED IN':'');else if(place)bit(meta,'FROM '+place);
        var makes=A('makes').split(',').map(function(m){return m.trim().toUpperCase();}).filter(Boolean),cr=on('creators');
        if(makes.length&&cr)bit(meta,'MAKES '+makes.join(' · '));
        var work=P&&/^https:\/\//i.test(url(P.portfolio))?url(P.portfolio):'';
        if(work&&cr){var l=meta.lastChild;if(l&&!(l.classList&&l.classList.contains('pf5-flags')))meta.appendChild(el('span',null,'·'));
          var w0=el('a','pf5-work','SEE THE WORK →');w0.href=work;w0.target='_blank';w0.rel='noopener ugc';meta.appendChild(w0);}
        if(P&&P.open===true)bit(meta,'OPEN TO PARTNERSHIPS');}}
    var B=g('buttons'),N=g('contact-note');
    if(B){clear(B);var mode=(A('contact')||'Relay').toLowerCase(),note='',email=A('email'),a;
      if(mode==='email'){if(email){var m=email.split('@');a=el('a','pf5-btn',m.length===2?(m[0]+' [at] '+m[1]):email);a.href='mailto:'+email;B.appendChild(a);note='Email shown by their choice.';}}
      else if(mode!=='off'){var href='/contact?relay='+encodeURIComponent(slug);
        if(mode==='instagram'&&/^https?:\/\//i.test(A('link-instagram')))href=A('link-instagram');
        a=el('a','pf5-btn','Get in touch');a.href=href;if(/^https?:/i.test(href)){a.target='_blank';a.rel='noopener';}B.appendChild(a);
        note='Opens their chosen channel or the relay form. Nobody’s email is shown until they reply.';}
      var shown=A('links-shown').toLowerCase().split(/[\s,]+/).filter(Boolean);
      LINKS.forEach(function(k){var u=A('link-'+k[0]);if(!/^https?:\/\//i.test(u))return;if(shown.length&&shown.indexOf(k[0])<0)return;
        var b=el('a','pf5-btn pf5-btn-line',k[1]+' ');b.href=u;b.target='_blank';b.rel='noopener';arrow(b);B.appendChild(b);});
      if(N)N.textContent=note;B.setAttribute('data-pf5-ready','1');
      if(P){var list=[];if(url(P.store))list.push(['Store',url(P.store)]);
        (Array.isArray(P.links)?P.links:[]).slice(0,3).forEach(function(x){var u=url(x&&x.url),nm=String((x&&x.name)||'').trim();if(u&&nm)list.push([nm,u]);});
        if(list.length){var w=el('div','pf5-partners');
          list.forEach(function(x){var b=el('a','pf5-btn pf5-btn-line',x[0]);b.href=x[1];b.target='_blank';b.rel='sponsored noopener';b.appendChild(el('span','pf5-tag','PARTNER'));arrow(b);w.appendChild(b);});
          B.appendChild(w);}}}
    return name;}
  var swap=once(function(){drop(gs);drop(ghost);});
  steps.push(function(){root=q('[data-pf5="root"]');var hero=q('[data-pf5="hero"]');if(!root||!hero||!whole(hero))return false;
    var real=q('[data-pf5="id"]',hero);if(!real||real.parentNode!==hero)return true;
    /* a page set to Off is hidden from visitors by the page's own code once it has run: nothing of it is filled in early */
    if(A('visibility').toLowerCase()==='off')return true;
    slug=A('slug');ghost=real.cloneNode(true);ghost.setAttribute('data-tll-es-ghost','1');
    var name,n=count();try{name=build();stats(n);}catch(e){ghost=null;return true;}
    gs=sheet('tll-es-pf5-v1','[data-pf5="hero"]>[data-pf5="id"]:not([data-tll-es-ghost]){display:none!important}');
    hero.insertBefore(ghost,real.nextSibling);
    /* the story list comes later in the page: the count goes in when it has arrived */
    if(n<0)steps.push(function(){var c=count();if(c<0)return false;try{stats(c);}catch(e){}return true;});
    /* on the photo: the initials when there is no photo, and the badge, as hero() adds them */
    try{var photo=q('[data-pf5="photo"]',hero),img=photo&&q('img',photo),badge=A('badge'),x;
      if(photo){if(!(img&&!img.classList.contains('w-dyn-bind-empty')&&img.getAttribute('src'))){
          x=el('div','pf5-initials',name.split(/\s+/).slice(0,2).map(function(p){return Array.from(p)[0]||'';}).join('').toUpperCase());photo.appendChild(x);extras.push(x);}
        if(badge){x=el('span','pf5-badge',UP(badge));photo.appendChild(x);extras.push(x);}}}catch(e){}
    return true;});
  before.push(function(){extras.forEach(drop);});
  /* one timer after the page-parsed listeners: tll-pf5-n-v1 finishes the real column on a timer it sets from its own listener, before this one */
  after.push(function(){setTimeout(swap,0);});
  hard.push(swap);
})();

if(!steps.length)return;
function run(list){for(var i=0;i<list.length;i++){try{list[i]();}catch(e){}}}
function tick(){if(over)return;var i,d;
  for(i=0;i<steps.length;i++){d=true;try{d=steps[i]();}catch(e){}if(d){steps.splice(i,1);i--;}}
  run(keep);
  if(!steps.length&&!keep.length&&mo){mo.disconnect();mo=null;}}
var handBack=once(function(){over=1;steps=[];keep=[];if(mo){mo.disconnect();mo=null;}run(before);});
var parsed=0;
W.addEventListener('DOMContentLoaded',function(){parsed=1;handBack();},true);
W.addEventListener('DOMContentLoaded',function(){run(after);});
setTimeout(function(){if(!parsed)handBack();run(hard);},HARD);
mo=new MutationObserver(tick);mo.observe(D.documentElement,{childList:true,subtree:true});tick();
})();
