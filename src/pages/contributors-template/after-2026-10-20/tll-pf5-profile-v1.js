/* TLL public profile v2 (pf5, 20 October 2026). Packet C rows C1.2, C1.3, C2.1 to C2.11.
   Reads only: the CMS-bound attributes on [data-pf5="root"], the switch flags (a [data-pf5-flag] span exists only
   when its switch is on), the bound avatar image and name heading, and the two page-level lists (Stories, Pets)
   filtered here by the bound contributor and owner slugs. Nothing is typed; every count comes from map-snapshot
   or from the stories list. Never touches data-ms-* elements. */
(function(){
  if(window.__tllPf5) return; window.__tllPf5=1;
  var D=document, q=function(s,r){ return (r||D).querySelector(s); }, qa=function(s,r){ return [].slice.call((r||D).querySelectorAll(s)); };
  var root=q('[data-pf5="root"]'); if(!root) return;
  var A=function(n){ var v=root.getAttribute('data-'+n); return v==null?'':String(v).trim(); };
  var on=function(k){ var f=q('[data-pf5-flag="'+k+'"]'); return !!(f&&!f.classList.contains('w-condition-invisible')); };
  var slug=A('slug'), realName=A('name'), credit=A('credit')||'Full', pen=A('pen'), contact=A('contact')||'Relay';
  var email=A('email'), vis=A('visibility')||'Public', memberId=A('member'), snapRaw=A('snapshot'), badge=A('badge');
  var FLAGS='https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/';
  var UP=function(s){ return String(s||'').toUpperCase(); };
  function el(tag,cls,text){ var e=D.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; }
  function esc(s){ return String(s||''); }
  function clear(n){ while(n&&n.firstChild) n.removeChild(n.firstChild); }

  /* C2.11 credit mode. Full: the name. First: the first name only. Pen: the pen name; the real name is not rendered. */
  function shown(){
    var c=credit.toLowerCase();
    if(c==='pen') return pen||'Traveler';
    if(c==='first') return (realName.split(/\s+/)[0]||'Traveler');
    return realName||'Traveler';
  }
  var name=shown(), parts=name.split(/\s+/), first=parts[0]||'Traveler', last=parts.length>1?parts.slice(1).join(' '):'';
  var initials=parts.slice(0,2).map(function(p){ return Array.from(p)[0]||''; }).join('').toUpperCase();

  /* Hero */
  function hero(){
    var H=q('[data-pf5="hero"]'); if(!H) return;
    var photo=q('[data-pf5="photo"]'), img=photo&&q('img',photo);
    var hasImg=!!(img&&!img.classList.contains('w-dyn-bind-empty')&&img.getAttribute('src'));
    if(photo){
      if(img){ img.setAttribute('alt',name); img.setAttribute('loading','eager'); }
      if(!hasImg){ photo.appendChild(el('div','pf5-initials',initials)); }
      if(badge){ photo.appendChild(el('span','pf5-badge',UP(badge))); }
    }
    var ey=q('[data-pf5="eyebrow"]'); if(ey) ey.textContent='TRAVELER · '+UP(slug);
    var slot=q('[data-pf5="name-slot"]'), h=slot&&q('h1,h2,h3',slot);
    if(h){ clear(h); h.appendChild(D.createTextNode(last?first+' ':first)); if(last){ h.appendChild(el('em',null,last)); } }
    var ol=q('[data-pf5="one-line"]'); if(ol){ ol.textContent=A('one-line'); }
    var meta=q('[data-pf5="meta"]');
    if(meta){
      clear(meta);
      var bits=[], home=A('home'), since=A('since'), y=since?String(new Date(since).getFullYear()):'';
      if(home) bits.push(home);
      if(y&&y!=='NaN') bits.push('ON TLL SINCE '+y);
      bits.forEach(function(t,i){ if(i) meta.appendChild(el('span',null,'·')); meta.appendChild(el('span',null,t)); });
      var iso=A('flags').toLowerCase().split(/[\s,]+/).filter(function(c){ return /^[a-z]{2}$/.test(c); }).slice(0,5);
      if(iso.length){
        var g=el('span','pf5-flags'); g.appendChild(el('span',null,'FROM · HAS LIVED IN'));
        var row=el('span','pf5-flags-row');
        iso.forEach(function(c){ var i=D.createElement('img'); i.className='pf5-flag'; i.src=FLAGS+c+'.svg'; i.alt=''; i.title=c.toUpperCase(); i.width=28; i.height=28; i.loading='lazy'; row.appendChild(i); });
        g.appendChild(row); meta.appendChild(g);
      }
    }
  }

  /* C1.2, C1.3, C2.2 stat strip from map-snapshot. Empty snapshot: STORIES only, never a zero. */
  function snapshot(){ try{ var s=JSON.parse(snapRaw||'null'); return s&&typeof s==='object'?s:null; }catch(e){ return null; } }
  function ranged(n){ n=+n||0; if(!on('ranges')) return String(n); if(n<10) return 'under 10'; return (Math.floor(n/10)*10)+'-something'; }
  function stats(storyCount){
    var S=q('[data-pf5="stats"]'); if(!S) return; clear(S);
    var snap=snapshot(), items=[];
    if(snap&&(+snap.countries||snap.antarctica)){
      items.push([ranged(snap.countries), snap.antarctica?'+AQ':'', 'COUNTRIES']);
      items.push([ranged(snap.places), on('ranges')?'':'/ 249', 'PLACES']);
    }
    if(storyCount>0) items.push([String(storyCount),'', storyCount===1?'STORY':'STORIES']);
    if(snap&&+snap.layovers>0) items.push(['+'+(+snap.layovers),'', 'LAYOVERS']);
    if(!items.length) return;
    items.forEach(function(it){ var d=el('div'), v=el('div','pf5-stat-v',it[0]+(it[1]?' ':'')); if(it[1]){ v.appendChild(el('small',null,it[1])); } d.appendChild(v); d.appendChild(el('div','pf5-stat-k',it[2])); S.appendChild(d); });
    var i=el('a','pf5-stat-i','i'); i.href='/the-map'; i.title='What counts: lived or stayed. Antarctica beside. Layovers beside, never inside.'; i.setAttribute('aria-label','What counts'); S.appendChild(i);
  }

  /* C2.3 buttons: contact per contact-mode, one outline button per filled link that is switched on, Edit profile for the owner. */
  var LINKS=[['instagram','Instagram'],['youtube','YouTube'],['website','Website'],['tiktok','TikTok'],['substack','Substack'],['strava','Strava'],['alltrails','AllTrails'],['komoot','Komoot'],['garmin','Garmin'],['beli','Beli']];
  function liveLinks(){
    var shownKeys=A('links-shown').toLowerCase().split(/[\s,]+/).filter(Boolean), out=[];
    LINKS.forEach(function(l){ var u=A('link-'+l[0]); if(!/^https?:\/\//i.test(u)) return; if(shownKeys.length&&shownKeys.indexOf(l[0])<0) return; out.push({key:l[0],label:l[1],href:u}); });
    return out;
  }
  function obfuscate(e){ var m=e.split('@'); return m.length===2?(m[0]+' [at] '+m[1]):e; }
  function buttons(){
    var B=q('[data-pf5="buttons"]'), N=q('[data-pf5="contact-note"]'); if(!B) return; clear(B);
    var mode=contact.toLowerCase(), note='';
    if(mode==='email'){
      if(email){ var a=el('a','pf5-btn',obfuscate(email)); a.href='mailto:'+email; B.appendChild(a); note='Email shown by their choice.'; }
    } else if(mode!=='off'){
      var href='/contact?relay='+encodeURIComponent(slug);
      if(mode==='instagram'&&/^https?:\/\//i.test(A('link-instagram'))) href=A('link-instagram');
      var c=el('a','pf5-btn','Get in touch'); c.href=href; if(/^https?:/i.test(href)){ c.target='_blank'; c.rel='noopener'; } B.appendChild(c);
      note='Opens their chosen channel or the relay form. Nobody’s email is shown until they reply.';
    }
    liveLinks().forEach(function(l){ var a=el('a','pf5-btn pf5-btn-line',l.label+' '); a.href=l.href; a.target='_blank'; a.rel='noopener'; var s=el('span',null,'↗'); s.setAttribute('aria-hidden','true'); a.appendChild(s); B.appendChild(a); });
    if(N) N.textContent=note;
    B.setAttribute('data-pf5-ready','1');
  }
  function ownerButton(){ var B=q('[data-pf5="buttons"]'); if(!B||q('.pf5-edit',B)) return; var a=el('a','pf5-edit','EDIT PROFILE →'); a.href='/edit-profile'; B.appendChild(a); }

  /* C2.4 About: Bio long as paragraphs, hidden when empty. */
  function about(){
    var S=q('[data-pf5="about"]'), bio=q('[data-pf5="bio"]'); if(!S) return;
    var txt=bio?(bio.textContent||'').trim():'';
    if(!bio||bio.classList.contains('w-dyn-bind-empty')||!txt) S.setAttribute('hidden','hidden');
  }

  /* C2.5 Stories where Contributor is this member (the co-traveler join needs a nested list bound in the Designer). */
  function stories(){
    var S=q('[data-pf5="stories"]'), L=q('[data-pf5="stories-list"]'); if(!S||!L) return 0;
    var kept=0;
    qa('[data-pf5="story-card"]',L).forEach(function(card){
      var item=card.closest('.w-dyn-item')||card;
      if((card.getAttribute('data-by')||'').trim()!==slug){ item.parentNode&&item.parentNode.removeChild(item); return; }
      kept++;
      var s=card.getAttribute('data-st3-slug')||''; var ext=card.getAttribute('data-external')||'';
      if(/^https?:\/\//i.test(ext)){ card.href=ext; card.target='_blank'; card.rel='noopener'; }
      else if(/^[a-z0-9-]+$/.test(s)) card.href=(card.getAttribute('data-st3-base')||'/stories/')+s;
      var place=(card.getAttribute('data-place')||card.getAttribute('data-city')||'').trim();
      var ey=q('[data-pf5="card-eyebrow"]',card); if(ey) ey.textContent=UP(place)+(ext?(place?' · ':'')+'OPENS ELSEWHERE':'');
      var im=q('[data-pf5="card-img"]',card), img=im&&q('img',im);
      if(im&&(!img||img.classList.contains('w-dyn-bind-empty')||!img.getAttribute('src'))){ im.classList.add('pf5-noimg'); im.appendChild(el('span',null,place||first)); }
      else if(img){ img.alt=''; }
      var pillar=(card.getAttribute('data-pillar')||'').trim(), mins=parseInt(card.getAttribute('data-minutes')||'',10);
      var meta=q('[data-pf5="card-meta"]',card); if(meta) meta.textContent=[pillar?UP(pillar):'', mins>0?(mins+' MIN READ'):''].filter(Boolean).join(' · ');
    });
    var head=q('[data-pf5="stories-head"]'), m=q('[data-pf5="stories-meta"]'), E=q('[data-pf5="stories-empty"]');
    if(head) head.textContent='Stories by '+first;
    if(head&&m&&!(head.parentNode&&head.parentNode.classList.contains('pf5-head'))){ var w=el('div','pf5-head'); head.parentNode.insertBefore(w,head); w.appendChild(head); w.appendChild(m); }
    if(m) m.textContent=kept?(kept+(kept===1?' STORY':' STORIES')+' · NEWEST FIRST'):'';
    if(!kept){
      L.setAttribute('hidden','hidden');
      if(E){ clear(E); E.appendChild(el('span',null,first+' has not written one yet.')); E.removeAttribute('hidden'); }
    }
    return kept;
  }
  function ownerWrite(){ var E=q('[data-pf5="stories-empty"]'); if(!E||E.hasAttribute('hidden')||q('.pf5-write',E)) return; var a=el('a','pf5-write','Write your first →'); a.href='/submit'; E.appendChild(a); }

  /* C2.6 Travels with: Pets where Owner is this member (Shared with needs the Designer). Hidden when none. */
  function pets(){
    var S=q('[data-pf5="pets"]'), L=q('[data-pf5="pets-list"]'); if(!S||!L) return;
    var kept=0;
    qa('[data-pf5="pet-card"]',L).forEach(function(card){
      var item=card.closest('.w-dyn-item')||card;
      if((card.getAttribute('data-owner')||'').trim()!==slug){ item.parentNode&&item.parentNode.removeChild(item); return; }
      kept++;
      var s=card.getAttribute('data-st3-slug')||''; if(/^[a-z0-9-]+$/.test(s)) card.href=(card.getAttribute('data-st3-base')||'/pets/')+s;
      var body=q('[data-pf5="pet-body"]',card); if(body&&!q('.pf5-pet-label',body)) body.insertBefore(el('p','pf5-pet-label','TRAVELS WITH'),body.firstChild);
      var pn=(card.getAttribute('data-name')||'').trim(), h=q('[data-pf5="pet-name"]',card);
      if(h&&pn){ var pp=pn.split(/\s+/); clear(h); h.appendChild(D.createTextNode(pp.length>1?pp.slice(0,-1).join(' ')+' ':'')); h.appendChild(el('em',null,(pp.length>1?pp[pp.length-1]:pp[0])+'.')); }
      var breed=(card.getAttribute('data-breed')||'').trim(), places=parseInt(card.getAttribute('data-places')||'',10), line=(card.getAttribute('data-line')||card.getAttribute('data-quote')||'').trim();
      var pl=q('[data-pf5="pet-line"]',card); if(pl) pl.textContent=[breed, places>0?(places+' places'):'', line].filter(Boolean).join(' · ');
      var pm=q('[data-pf5="pet-meta"]',card); if(pm) pm.textContent='PAW PASSPORT →';
      var img=q('[data-pf5="pet-img"] img',card); if(img) img.alt=pn;
    });
    if(kept) S.removeAttribute('hidden'); else S.setAttribute('hidden','hidden');
  }

  /* C2.8 footer line. The report link carries the slug so the editor knows which profile. */
  function foot(){
    var F=q('[data-pf5="foot"]'); if(!F) return; clear(F);
    var row=el('div','pf5-foot-line'); row.appendChild(el('span',null,'HOSTED OR GIFTED TRAVEL IS LABELED AT THE TOP OF EVERY STORY'));
    var a=el('a',null,'REPORT THIS PROFILE'); a.href='mailto:hello@thatlayover.life?subject='+encodeURIComponent('Report profile /contributors/'+slug); row.appendChild(a); F.appendChild(row);
  }

  /* C2.10 Person JSON-LD: name per credit mode, url, image, homeLocation, sameAs from the links that are on. No email. */
  function jsonld(){
    var old=q('script[data-pf5="ld"]'); if(old) old.parentNode.removeChild(old);
    var img=q('[data-pf5="photo"] img'), src=img&&!img.classList.contains('w-dyn-bind-empty')?img.getAttribute('src'):'';
    var p={'@context':'https://schema.org','@type':'Person','@id':'https://www.thatlayover.life/contributors/'+slug+'#person','name':name,'url':'https://www.thatlayover.life/contributors/'+slug};
    if(src) p.image=src;
    if(A('home')) p.homeLocation={'@type':'Place','name':A('home')};
    var same=liveLinks().map(function(l){ return l.href; }); if(same.length) p.sameAs=same;
    var s=D.createElement('script'); s.type='application/ld+json'; s.setAttribute('data-pf5','ld'); s.textContent=JSON.stringify(p); D.head.appendChild(s);
    if(credit.toLowerCase()!=='full'&&D.title&&realName&&D.title.indexOf(realName)>-1) D.title=D.title.split(realName).join(name);
  }

  /* C2.9 visibility. Unlisted: noindex (set in the head). Off: visitors go to /travelers, the owner sees the page with a banner. */
  function owner(cb){
    var k=0, iv=setInterval(function(){
      var ms=window.$memberstackDom; if(!ms){ if(++k>40){ clearInterval(iv); cb(false); } return; }
      clearInterval(iv);
      ms.getCurrentMember().then(function(r){ cb(!!(r&&r.data&&memberId&&r.data.id===memberId)); }).catch(function(){ cb(false); });
    },150);
  }
  function offMode(isOwner){
    var html=D.documentElement;
    if(vis.toLowerCase()!=='off') return;
    if(isOwner){
      html.classList.add('pf5-owner');
      var b=el('div','pf5-banner'); b.appendChild(D.createTextNode('Your page is set to Off. Only you can see it. '));
      var a=el('a',null,'Change in Edit profile →'); a.href='/edit-profile'; b.appendChild(a);
      var main=q('main')||D.body; main.insertBefore(b,main.firstChild);
    } else { location.replace('/travelers'); }
  }

  function run(){
    hero(); buttons(); about();
    var n=stories(); pets(); stats(n); foot(); jsonld();
    owner(function(is){ if(is){ ownerButton(); ownerWrite(); } offMode(is); });
  }
  if(D.readyState==='loading') D.addEventListener('DOMContentLoaded',run); else run();
})();
