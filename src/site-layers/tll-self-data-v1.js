/* tll-self-data-v1 (13 Nov 2026, bandwidth fixes 4 and 5, reports/bandwidth-2026-11-13.md). Core, every page, runs in the head.
   Fix 4. Page scripts used to download whole site pages to read a number: the footer counts and the head story count read /stories
   and /sitemap.xml, and four scripts read Magnus's pet page for his country list (home, /the-paw-passport, /about and the site-wide
   tllfactsv1). Every one of those bytes is Webflow bandwidth. The numbers now come from data the page already carries:
   - [data-tll-site-stats]: the one Site stats CMS item (collection site-stats, written by the Worker every 30 minutes with the same
     rules as the footer script), rendered into the page by a one-item collection list. Its four numbers are put in the session
     keys the footer (tllCounts5) and the head story count (tllStoryN) already read first, just before DOMContentLoaded, so those
     scripts find them and never fetch. Their own code is unchanged. Without the element nothing is seeded and they fetch as before.
   - [data-tll-pet][data-tll-pet-countries]: a pet's Countries list field, rendered the same way. window.tllPetCountries(slug)
     resolves to that list (the same text as window.TLL_PET.countries on the pet page). Without the element it falls back to the
     pet page itself, fetched once per page view however many scripts ask, and kept for the visit.
   - window.tllSelfDoc(path): one GET per path per page view, shared by every script that asks for the same page.
   Fix 5. On a profile (/contributors/{slug}) the page carries every story card and every pet card, and the profile script removes
   the ones that are not this member's. Their lazy photos could start loading before it ran. A style set here, before the first
   paint, hides the cards whose data-by (stories) or data-owner (pets) is not the slug in the address, so their photos are never
   requested. The match itself stays the profile script's: right after it has run (it matches on DOMContentLoaded) the style is
   removed, so every card the profile script kept shows exactly as today, and the ones it removed were never painted. Nothing is typed; no data-ms-* element is touched. */
(function(){
var D=document,W=window,P=(location.pathname.replace(/\/+$/,'')||'/');
function ss(k,v){try{if(arguments.length<2)return sessionStorage.getItem(k);sessionStorage.setItem(k,v);}catch(e){}return null;}
var memo={};
function doc(path){if(!memo[path])memo[path]=fetch(path,{cache:'no-cache'}).then(function(r){if(!r.ok)throw Error('HTTP '+r.status);return r.text();});return memo[path];}
W.tllSelfDoc=doc;

/* Site stats */
var K={s:'stories',t:'travelers',p:'pets',c:'countries'};
function stats(){var e=D.querySelector('[data-tll-site-stats]');if(!e)return null;var o={},ok=true;
  Object.keys(K).forEach(function(k){var v=(e.getAttribute('data-'+K[k])||'').trim();if(!/^\d+$/.test(v))ok=false;o[k]=+v;});
  return ok&&o.s>0?o:null;}
W.tllSiteStats=stats;
function seed(){var o=stats();if(!o)return;ss('tllCounts5',JSON.stringify({p:o.p,s:o.s,t:o.t,c:o.c}));ss('tllStoryN',String(o.s));}

/* Pet countries */
function esc(s){return String(s).replace(/["\\]/g,'\\$&');}
/* A script that runs while the page is still being read (home's chapter 04 line does) may ask before the element further down has
   arrived, so the lookup waits for the end of parsing; nothing is fetched before then. */
var parsed=new Promise(function(res){if(D.readyState!=='loading')res();else D.addEventListener('readystatechange',function f(){if(D.readyState!=='loading'){D.removeEventListener('readystatechange',f);res();}});});
function petCountries(slug){
  return parsed.then(function(){
    var e=D.querySelector('[data-tll-pet="'+esc(slug)+'"][data-tll-pet-countries]');
    if(e)return e.getAttribute('data-tll-pet-countries')||'';
    var c=ss('tllPetC:'+slug);if(c!=null)return c;
    return doc('/pets/'+slug).then(function(h){var m=h.match(/window\.TLL_PET=\{countries:"([^"]*)"/);if(!m)throw Error('no list');ss('tllPetC:'+slug,m[1]);return m[1];});});}
W.tllPetCountries=petCountries;

/* Profiles: other members' cards stay hidden until the profile script has matched them */
var pf=P.match(/^\/contributors\/([a-z0-9-]+)$/),pre=null;
if(pf){var s=pf[1];pre=D.createElement('style');pre.id='tll-pf5-pre-v1';
  pre.textContent='[data-pf5="stories-list"] [data-pf5="story-card"]:not([data-by="'+s+'"]),[data-pf5="pets-list"] [data-pf5="pet-card"]:not([data-owner="'+s+'"]){display:none!important}';
  (D.head||D.documentElement).appendChild(pre);}

function unhide(){if(pre&&pre.parentNode)pre.parentNode.removeChild(pre);pre=null;}
/* readyState turns interactive right before DOMContentLoaded fires, so seed() runs ahead of every DOMContentLoaded listener, including
   the ones registered earlier in the head. The profile script matches its cards on DOMContentLoaded; the listener added here is the
   last one registered, so the style comes off right after that match, in the same task, before the next paint. */
function ready(){seed();if(!pre)return;if(D.readyState==='loading'||D.readyState==='interactive')D.addEventListener('DOMContentLoaded',unhide);else unhide();}
if(D.readyState==='loading')D.addEventListener('readystatechange',function f(){if(D.readyState!=='loading'){D.removeEventListener('readystatechange',f);ready();}});
else{seed();unhide();}
})();
