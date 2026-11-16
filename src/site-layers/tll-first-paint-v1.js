/* tll-first-paint-v1 (16 Nov 2026, layout shift sweep, causes C4, C5, C8 and C11; reports/evidence/cls-sweep-2026-11-16/fix.md).
   /travelers, /the-map and (the page style only) /about. There the page's own code settles the first screen after the first paint: styles
   that sit at the end of the body, scripts that run when the page is parsed, the map that is drawn after load, the title verb that
   changes every 3.2 s.
   This layer lays the same end state out before the first paint and lets go once the page's own code has done its part, so the finished
   page is the page's own. Nothing is removed from the page, no data-ms-* element is touched, the nav and the footer are left alone.
     page style   style#tll-fp-page-v1 in the head: copies of the page rules that shape the first screen and arrive late (the /travelers
                  search box from tll-trav-search-css; the Open full screen link on /the-map; the phone sizes of the /about hero,
                  which the page sets in an embed after the article), three stand-ins for what the /travelers
                  page script writes when the page is parsed (the empty search note is hidden; each chip count and the card count keep
                  room for one figure), and on /the-map the closed phone sheet of the map left out of the layout. In the head it comes
                  before the page's own styles, so the page wins every tie. Taken out right after the page-parsed listeners have run.
     our style    style#tll-fp-ours-v1 (/travelers): the three rules of our own travelers chunk (tll-travelers-fix-v1) that change the chip
                  row and the card grid (no Pets chip, no open slot, no empty first cell), and the chunk's word for the first chip
                  (People). The chunk comes in by itself after the core; until it is in, a painted grid moved one cell. Taken out when
                  the chunk's style is in, or after load without it (the chip then reads Everyone again).
     title        style#tll-fp-title-v1 (/travelers): the title keeps the height of its tallest verb, measured on a hidden copy of the
                  title at the width it has. The words and the rotation are the page's. Not set when the reader asks for reduced motion
                  (the page does not rotate then); taken out when the page is parsed and the page script has not written a verb.
     map          style#tll-fp-map-v1 (/the-map): the Map 2.0 mount keeps one screen of height until the map is drawn, so what follows it
                  starts below the screen instead of being pushed there after load. Let go when the map is taller than that, when the
                  embed's own status line reports a failure, when there is no mount, or after 20 s.
     map title    style#tll-fp-maptitle-v1 (/the-map): the title keeps the height of its first layout while the web fonts arrive (its two
                  font files come one after the other, and with one of them in the title is a line shorter for a frame). Let go when
                  the font set has finished loading, or after 20 s.
     invite       /the-map: the signed-out "Start your own map" link is put in by the page head script when the page is parsed; here it
                  goes in as soon as the counter has been parsed, made the same way, only if that script is on the page. The script
                  finds it and leaves it.
   Every early state has a hard release (20 s), and none is left when the page code it stands in for is missing or fails: the page then
   ends as it does without this layer. If the core runs after the page is parsed, the layer does nothing. */
(function(){
var path=location.pathname.replace(/\/+$/,'')||'/';
if(path!=='/travelers'&&path!=='/the-map'&&path!=='/about')return;
if(document.readyState!=='loading'||!window.MutationObserver)return;
var D=document,TRAV=path==='/travelers',MAP=path==='/the-map',HARD=20000;
/* Copies of page rules, one rule a line, exactly as the page has them (the build checks each against the saved page code). */
var PAGE_TRAV=
/*copy:src/pages/heroes-2026-10-29/code/travelers-footer.html*/
"[data-tll-trav-search-wrap]{max-width:560px;margin:0 0 18px}"+
"[data-tll-trav-search-wrap] label{display:block;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6B6660;margin:0 0 8px}"+
"input[data-tll-trav-search]{width:100%;box-sizing:border-box;height:48px;padding:0 16px 0 44px;border:1.5px solid #c9b89a;border-radius:999px;background:#FDF9F3 url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%230A0B14' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M20 20l-3.5-3.5'/%3E%3C/svg%3E\") 16px 50% no-repeat;color:#0A0B14;font:500 16px/1 'Inter',system-ui,sans-serif;-webkit-appearance:none;appearance:none;transition:border-color .15s ease,box-shadow .15s ease}"+
"[data-tll-trav-search-note]{margin:8px 0 0;font-size:14px;line-height:1.5;color:#6B6660;min-height:1.5em}"+
"[data-tll-trav-search-note][hidden]{display:none}"+
/*end*/
/* stand-ins: the page script hides the empty note and writes " · n" into each chip and "n CARDS" into the count when the page is parsed */
"[data-tll-trav-search-note]:empty{display:none}"+
"[data-tv-chips] [data-tv-n]:empty::after{content:' \\B7  0';visibility:hidden}"+
"[data-tv-chips] [data-tv-countline]:empty::after{content:'0 CARDS';visibility:hidden}";
var OURS_TRAV=
/*copy:src/site-layers/tll-travelers-fix-v1.js*/
"html body [data-tv-open]{display:none!important}"+
"html body [data-tll-roster-grid] .w-embed::before,html body [data-tll-roster-grid] .w-embed::after{content:none!important;display:none!important}"+
"html body [data-tv-chips] [data-tv-filter=\"pets\"]{display:none!important}";
/*end*/
var PAGE_MAP=
/*copy:src/pages/the-map/live-2026-11-16/embed-fs.live.html*/
"[data-tll-map=fullscreen]{display:inline-block;margin-top:14px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1px;color:#06302f;background:#00C9C8;padding:9px 18px;border-radius:6px;font-weight:700;text-decoration:none}"+
/*end*/
/* stand-in: on phones the map's sheet (.tllm-drawer in map-2.0/dist/tll-map-layers.css) is fixed to the bottom of the screen and slid out
   of sight until it is opened. When the map is drawn before the page is parsed, the site's reveal script then gives the embed a transform,
   the hidden sheet is placed against the embed instead of the screen, and the browser books that as a jump of 0.13 nobody sees. Until
   the page is parsed the closed sheet is not laid out at all; an opened one is left alone. */
"@media (max-width:760px){#tll-map-layers .tllm-drawer:not([data-open=\"1\"]){display:none}}";
var PAGE_ABOUT=
"@media(max-width:600px){"+
/*copy:src/pages/about/live-2026-11-13/next/embed-c024f6d7.after.html*/
".tll-about-final-title{font-size:38px;letter-spacing:-.5px}"+
".tll-about-final-hero{padding-top:52px;padding-bottom:40px}"+
".tll-about-final-intro{font-size:18px}"+
/*end*/
"}";
var MAP_HOLD="#tll-map-layers{min-height:min(100vh,1400px)}";
function sheet(id,css){var s=D.createElement('style');s.id=id;s.textContent=css;(D.head||D.documentElement).appendChild(s);return s;}
function drop(s){if(s&&s.parentNode)s.parentNode.removeChild(s);}
function once(f){var d=0;return function(){if(!d){d=1;try{f();}catch(e){}}};}
/* an element has arrived whole once an element follows it or one of its ancestors below the body's own children */
function whole(n){for(;n&&n.parentNode&&n.parentNode!==D.body;n=n.parentNode){if(n.nextElementSibling)return true;}return false;}
var parsed=0,steps=[],mo=null;
function tick(){for(var i=steps.length-1;i>=0;i--){var done=true;try{done=steps[i]();}catch(e){}if(done)steps.splice(i,1);}
  if(!steps.length&&mo){mo.disconnect();mo=null;}}

/* the page style: until the page-parsed listeners have run */
var A=sheet('tll-fp-page-v1',TRAV?PAGE_TRAV:MAP?PAGE_MAP:PAGE_ABOUT),relA=once(function(){drop(A);});
setTimeout(relA,HARD);

if(TRAV){
  /* our chunk's rules: until its style is in the head (it is added there when the chunk runs), or after load without it */
  /* and the chunk's name for the first chip: it renames Everyone to People right after the page is parsed, and the shorter word rewraps
     the chip row on phones. The same word goes in as soon as the chip has been parsed; it is put back if the chunk never came. */
  var named=null;
  var B=sheet('tll-fp-ours-v1',OURS_TRAV),hmo=null,relB=once(function(){drop(B);if(hmo){hmo.disconnect();hmo=null;}
    if(named&&!D.getElementById('tll-travelers-fix-v1')&&named.nodeValue==='People')named.nodeValue='Everyone';});
  var chunkIn=function(){if(D.getElementById('tll-travelers-fix-v1'))relB();};
  steps.push(function(){var ev=D.querySelector('[data-tv-chips] [data-tv-filter="everyone"]');if(!ev||(!parsed&&!whole(ev)))return parsed;
    var tn=ev.firstChild;if(tn&&tn.nodeType===3&&/^\s*Everyone\s*$/.test(tn.nodeValue)){tn.nodeValue='People';named=tn;}return true;});
  if(D.head){hmo=new MutationObserver(chunkIn);hmo.observe(D.head,{childList:true});}
  window.addEventListener('load',function(){setTimeout(relB,0);});
  setTimeout(relB,HARD);

  /* the title: WORDS are the page's verbs (tv-v2-js); a verb the page shows that is not listed here is added when it is seen */
  /*words:src/pages/travelers/live-2026-11-13/fonts/d8735ad4.after.html*/
  var WORDS=['are','live','photograph','were'];
  var C=null,wrote=0,off=0,emo=null,rt=0;
  var still=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var measure=function(){if(still||off)return;var h=D.querySelector('.tll-travelers-title'),em=h&&h.querySelector('em'),p=h&&h.parentNode;if(!em||!p)return;
    var w=h.getBoundingClientRect().width;if(!w)return;
    var cs=window.getComputedStyle(h),c=h.cloneNode(true),ce=c.querySelector('em'),max=0;
    c.removeAttribute('id');c.setAttribute('aria-hidden','true');
    c.style.cssText='position:absolute!important;visibility:hidden!important;pointer-events:none!important;left:0!important;top:0!important;margin:0!important;'+
      'min-height:0!important;height:auto!important;box-sizing:border-box!important;width:'+w+'px!important';
    p.appendChild(c);
    for(var i=0;i<WORDS.length;i++){ce.textContent=WORDS[i];max=Math.max(max,c.getBoundingClientRect().height);}
    p.removeChild(c);if(mo)mo.takeRecords();
    var pad=cs.boxSizing==='border-box'?0:(parseFloat(cs.paddingTop)||0)+(parseFloat(cs.paddingBottom)||0)+(parseFloat(cs.borderTopWidth)||0)+(parseFloat(cs.borderBottomWidth)||0);
    var v=Math.round((max-pad)*100)/100;if(!(v>0))return;
    var css='h1.tll-travelers-title{min-height:'+v+'px}';
    if(!C)C=sheet('tll-fp-title-v1',css);else if(C.textContent!==css)C.textContent=css;};
  var relC=function(){off=1;drop(C);C=null;if(emo){emo.disconnect();emo=null;}};
  var again=function(){clearTimeout(rt);rt=setTimeout(function(){try{measure();}catch(e){}},200);};
  if(!still){
    steps.push(function(){var h=D.querySelector('.tll-travelers-title'),em=h&&h.querySelector('em');if(!em||(!parsed&&!whole(h)))return parsed;
      emo=new MutationObserver(function(){wrote=1;var w=(em.textContent||'').replace(/\s+/g,' ').trim();if(w&&WORDS.indexOf(w)<0){WORDS.push(w);try{measure();}catch(e){}}});
      emo.observe(em,{childList:true,characterData:true,subtree:true});
      measure();return true;});
    window.addEventListener('load',again);window.addEventListener('resize',again);
    try{if(D.fonts&&D.fonts.addEventListener)D.fonts.addEventListener('loadingdone',again);}catch(e){}
    /* a last resort only: without a page-parsed event the page script has not run, so nothing rotates */
    setTimeout(function(){if(!parsed)relC();},HARD);
  }
  D.addEventListener('DOMContentLoaded',function(){parsed=1;tick();
    setTimeout(function(){relA();chunkIn();if(still)return;if(!wrote)relC();else{try{measure();}catch(e){}}},0);});
}else if(MAP){
  /* the map mount */
  var M=sheet('tll-fp-map-v1',MAP_HOLD),ro=null,bmo=null;
  var relM=once(function(){drop(M);if(ro){ro.disconnect();ro=null;}if(bmo){bmo.disconnect();bmo=null;}});
  setTimeout(relM,HARD);
  steps.push(function(){var root=D.getElementById('tll-map-layers');if(!root)return parsed;
    var boot=D.getElementById('tllm-boot');
    var drawn=function(){if(!root.querySelector('.tllm-bar'))return;var mh=parseFloat(window.getComputedStyle(root).minHeight)||0;if(root.getBoundingClientRect().height>mh+1)relM();};
    if(window.ResizeObserver){ro=new window.ResizeObserver(drawn);ro.observe(root);}
    else window.addEventListener('load',function(){setTimeout(relM,3000);});
    if(boot){bmo=new MutationObserver(function(){if(/DID NOT|MAP ERROR/.test(boot.textContent||''))relM();});bmo.observe(boot,{childList:true,characterData:true,subtree:true});}
    return true;});
  /* the title while the web fonts arrive. The title is set in two Playfair Display files (800 and 800 italic for the rose words). They
     arrive one after the other, and with only one of them in, "Every country, on the map." fits one line at desktop widths where it
     takes two both before (fallback faces) and after: the page under the title went up 83 px and down again, or was painted one line
     short and then moved down (0.24 to 0.37 at 1440). The title keeps the height of its first layout until the font set has finished
     loading; if the finished title is a different height, it changes once then, as it did before. */
  steps.push(function(){var h=D.querySelector('.tll-map-title'),F=D.fonts;if(!h||(!parsed&&!whole(h)))return parsed;
    if(!F||!F.addEventListener)return true;
    var v=Math.round(h.getBoundingClientRect().height*100)/100;if(!(v>0))return true;
    var T=sheet('tll-fp-maptitle-v1','h1.tll-map-title{min-height:'+v+'px}'),relT=once(function(){drop(T);});
    var done=function(){if(F.status==='loaded')relT();};
    F.addEventListener('loadingdone',done);F.addEventListener('loadingerror',done);
    try{if(F.ready&&F.ready.then)F.ready.then(done,relT);}catch(e){}
    setTimeout(relT,HARD);return true;});
  /* the invite */
  steps.push(function(){if(!D.documentElement.classList.contains('tll-map-public')||!D.getElementById('tll-map-invite-js-v1'))return true;
    if(D.querySelector('[data-tll-map-invite]'))return true;
    var hc=D.querySelector('.tll-map-hero-counter');if(!hc)return parsed;
    var a=D.createElement('a');a.href='/signup';a.setAttribute('data-tll-map-invite','1');a.textContent='Start your own map →';hc.parentNode.insertBefore(a,hc.nextSibling);return true;});
  D.addEventListener('DOMContentLoaded',function(){parsed=1;tick();if(!D.getElementById('tll-map-layers'))relM();setTimeout(relA,0);});
}else D.addEventListener('DOMContentLoaded',function(){setTimeout(relA,0);});
mo=new MutationObserver(tick);mo.observe(D.documentElement,{childList:true,subtree:true});tick();
})();
