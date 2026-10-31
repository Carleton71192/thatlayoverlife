/* tll-phase0-v1 (31 Oct 2026, Phase 0 "fix and protect"). Small fixes for things that looked broken, all in this one layer:
   /contact          The member-to-member relay form ("through TLL") is gone. A ?relay= link explains how to reach a member instead.
   /contributors/*   Contact buttons that pointed at that relay are hidden.
   /support          The "Six doors. Pick yours." headline is ink, not white on cream.
   /stories          The search field keeps its width on phones, and search also matches words inside the stories (title, place,
                     country and body), from an index loaded only when someone searches.
   /the-map          "Open full screen" (it opened a panel with no map) is hidden; "Edit my destinations" shows to members only.
   Home              The shelf note counts the cards it really shows, never a typed number.
   Everywhere        The Thailand stub stays out of rails and featured spots and carries noindex.
   No data-ms-* element touched; nav and footer components untouched. */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
var STUB='the-art-of-wellbeing-thailand-luxury-health-destination-2026';
var INDEX='https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@3fe8983ca837580596badbe3c3d8173470780d19/src/data/story-search-index.json';
function css(t,id){if(document.getElementById(id))return;var s=document.createElement('style');s.id=id;s.textContent=t;document.head.appendChild(s);}
function norm(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();}
function member(cb){var n=0,iv=setInterval(function(){var ms=window.$memberstackDom;if(ms&&ms.getCurrentMember){clearInterval(iv);ms.getCurrentMember().then(function(r){cb(!!(r&&r.data));}).catch(function(){cb(false);});}else if(++n>40){clearInterval(iv);cb(false);}},150);}

/* Old addresses (Phase 0, Nancy approved 31 Oct). Real 301s belong in Webflow Site settings; until Nancy adds them this sends people on.
   /my-passport is a draft page now, so this runs on the 404 page it lands on. */
var MOVED={'/my-passport':'/the-map','/countries':'/destinations','/for-affiliates':'/creators'};
if(MOVED[P]){location.replace(MOVED[P]+(location.search||''));}
/* Noindex until they have content: /spotlight, /awards, /creators, and contributor profiles with no stories yet. */
function noindex(){var m=document.querySelector('meta[name="robots"]');if(!m){m=document.createElement('meta');m.name='robots';document.head.appendChild(m);}m.content='noindex, follow';}
if(/^\/(spotlight|awards|creators)$/.test(P))noindex();
if(/^\/contributors\/[^/]+$/.test(P)){var emp=function(){var e=document.querySelector('[data-pf5="stories-empty"]'),l=document.querySelector('[data-pf5="stories-list"]');
  if((e&&getComputedStyle(e).display!=='none')||(l&&!l.querySelector('a[href^="/stories/"]')))noindex();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(emp,800);});else setTimeout(emp,800);}
/* Thailand stub: noindex on its page, out of every rail and featured spot elsewhere. */
if(P==='/stories/'+STUB){var m=document.querySelector('meta[name="robots"]');if(!m){m=document.createElement('meta');m.name='robots';document.head.appendChild(m);}m.content='noindex, follow';}
else css('a[href="/stories/'+STUB+'"],.w-dyn-item:has(a[href="/stories/'+STUB+'"]){display:none!important}','tll-p0-stub');

if(P==='/contact'){css('[data-tll-relay]{display:none!important}','tll-p0-contact');
  if(/[?&]relay=/.test(location.search)){var run=function(){if(document.getElementById('tll-p0-relay'))return;var p=document.createElement('p');p.id='tll-p0-relay';p.style.cssText='max-width:680px;margin:32px auto;padding:0 20px;font:400 16px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14';
    p.textContent='Members choose how to be reached. Use the links on their profile, or write to us at hello@thatlayover.life.';var main=document.querySelector('main')||document.body;main.insertBefore(p,main.firstChild);};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();}}
if(/^\/contributors\/[^/]+$/.test(P))css('a[href*="/contact?relay="],a[href*="contact?relay="]{display:none!important}','tll-p0-relaybtn');
/* Home base shows only when the member switches it on (12 Oct rule; Nancy, 31 Oct: "Yep"). Until the Worker says so, it stays hidden.
   The Person structured data never carries a home location. */
if(/^\/contributors\/[^/]+$/.test(P)){
  var hb=function(show){var root=document.querySelector('[data-pf5="root"]'),home=root?String(root.getAttribute('data-home')||'').trim():'';
    [].slice.call(document.querySelectorAll('script[type="application/ld+json"]')).forEach(function(s){try{var j=JSON.parse(s.textContent);if(j&&j.homeLocation){delete j.homeLocation;s.textContent=JSON.stringify(j);}}catch(e){}});
    if(show||!home)return;var meta=document.querySelector('[data-pf5="meta"]');if(!meta)return;var sp=[].slice.call(meta.children);
    sp.forEach(function(e,i){if(e.tagName==='SPAN'&&(e.textContent||'').trim()===home){e.remove();var nx=sp[i+1];if(nx&&nx.textContent.trim()==='\u00b7')nx.remove();}});};
  var go=function(){fetch('https://tll-travel-wire.thatlayoverlife.workers.dev/album?slug='+encodeURIComponent(P.split('/')[2])).then(function(r){return r.ok?r.json():{};}).catch(function(){return{};}).then(function(d){hb(!!(d&&d.showHomeBase));setTimeout(function(){hb(!!(d&&d.showHomeBase));},1500);});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(go,300);});else setTimeout(go,300);}
if(P==='/support')css('main h1,.tll-support-hero h1,h1{color:#0A0B14!important}','tll-p0-support');

if(P==='/stories'){
  css('@media (max-width:767px){.tll-lib-searchslot{flex-wrap:wrap;width:100%;min-width:0}.tll-lib-searchslot .tllsb-form{flex:1 1 100%;min-width:220px;width:100%}.tll-lib-searchslot .tllsb-input,.tllsb-input{min-width:0;width:100%!important;font-size:16px!important}}','tll-p0-search');
  var q=new URLSearchParams(location.search).get('q');
  if(q&&q.trim()){var words=norm(q).split(/\s+/).filter(function(w){return w.length>2;});
    fetch(INDEX).then(function(r){return r.ok?r.json():null;}).then(function(ix){if(!ix||!words.length)return;
      function apply(){var cards=[].slice.call(document.querySelectorAll('[data-tll-card]'));if(!cards.length)return;var hits=0;
        cards.forEach(function(c){var a=c.matches('a[href^="/stories/"]')?c:c.querySelector('a[href^="/stories/"]');var slug=a?(a.getAttribute('href').split('/')[2]||'').replace(/[?#].*$/,''):'';
          var item=c.closest('.tll-lib-grid > *')||c,t=norm(c.textContent)+' '+(ix[slug]||'');
          var hit=words.every(function(w){return t.indexOf(w)>-1;});if(hit){item.removeAttribute('data-tll-q-miss');hits++;}else item.setAttribute('data-tll-q-miss','1');});
        var note=document.getElementById('tll-q-note');if(hits&&note)note.remove();
        if(!hits)cards.forEach(function(c){(c.closest('.tll-lib-grid > *')||c).removeAttribute('data-tll-q-miss');});}
      apply();setTimeout(apply,1200);}).catch(function(){});}
}

if(P==='/the-map'){
  function tidy(isMember){[].slice.call(document.querySelectorAll('a,button')).forEach(function(b){var t=(b.textContent||'').trim();
    if(/^open full screen$/i.test(t))b.style.display='none';
    if(!isMember&&/^edit my destinations$/i.test(t))b.style.display='none';});}
  member(function(m){tidy(m);setTimeout(function(){tidy(m);},2500);});
}
if(/^\/contributors\/[^/]+$|^\/account$/.test(P))member(function(m){if(m)return;[].slice.call(document.querySelectorAll('a,button')).forEach(function(b){if(/^edit my destinations$/i.test((b.textContent||'').trim()))b.style.display='none';});});

if(P==='/'){var shelf=function(){var sec=document.querySelector('[data-h3-shelf]');if(!sec)return;var note=sec.querySelector('.h3-shelf-note'),track=sec.querySelector('[data-h3-track]');if(!note||!track||/newest/i.test(note.textContent))return;
    var n=new Set([].slice.call(track.querySelectorAll('a[href^="/stories/"]')).map(function(a){return a.getAttribute('href');})).size;if(!n)return;
    var w=document.createTreeWalker(note,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){var s=t.nodeValue,o=s;s=s.replace(/\b0?\d+(?=\s*stor(y|ies)\b)/i,(n<10?'0':'')+n).replace(/\bstor(y|ies)\b/i,n===1?'newest story':'newest stories');if(s!==o)t.nodeValue=s;}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(shelf,600);});else setTimeout(shelf,600);setTimeout(shelf,2500);}
})();
