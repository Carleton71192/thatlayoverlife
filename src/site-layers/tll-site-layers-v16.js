/* tll-site-layers-v16: one site script, so the site stays within Webflow's 15-script limit. Built by src/site-layers/build-site-layers-v16.py from:
   style  src/site-layers/tll-nav-phone-v1.html (phone header)
   style  src/site-layers/tll-contrast-v1.html (contrast)
   style  src/site-layers/tll-note-phone-v1.html (round note button on phones)
   style  src/site-layers/tll-photos-tap-v1.html (/share-photos drop zone tap on iPhones)
   style  src/site-layers/tll-home-coords-v1.html (home photo coordinates inside the screen on phones)
   style  src/site-layers/tll-footer-wordmark-v1.html (footer wordmark matches the header)
   style  src/site-layers/tll-tap-colors-v1.html (/account Stories tab: ink text and a rose underline on hover and tap, no rose or teal text)
   style  src/site-layers/tll-shelf-ring-v1.html (home library rail: room for the avatar ring on phones)
   style  src/site-layers/tll-masthead-v1.html (footer masthead line in Newsreader italic)
   script src/components/member-bar/tll-account-hash-tabs-v1.js (member bar SETTINGS and CONTRIBUTIONS open their /account tab)
   script src/site-layers/tll-note-typing-v1.js (note button steps aside while typing)
   script src/components/edit-profile-fixes/tll-ep-country-v1.js (/edit-profile country field reads "Portland, Oregon, USA"; pen name note copy)
   script src/site-layers/tll-footer-wordmark-v1.js (footer wordmark text)
   script src/site-layers/tll-masthead-v1.js (footer masthead line: Written by the people who went)
   script src/site-layers/tll-ux-1028-v1.js (28 Oct UX review: type floor, success message contrast, Tell the editor clear of the home hero)
   script src/site-layers/tll-page-heroes-v1.js (29 Oct: story photos on /stories, /travelers, /the-map, /about and /for-expats, credited and linked)
   script src/site-layers/tll-story-ask-v1.js (29 Oct: end-of-story ask, Pitch a layover story first, then send one photo)
   script src/site-layers/tll-open-slots-v1.js (29 Oct: /spotlight coming-soon and open-slot cards become one Pitch your layover tile)
   script src/site-layers/tll-travelers-fix-v1.js (29 Oct testers: /travelers link chips as labelled pills inside the card, no empty grid cell, one action tile instead of the open slot)
   script src/site-layers/tll-ep-ux-v1.js (29 Oct testers: /edit-profile save bar at the bottom, field stays put while saving, country suggestions, photo crop)
   script src/site-layers/tll-submit-ux-v1.js (29 Oct testers: /submit toolbar buttons labelled, Subhead easy to find)
   story  src/design/magazine-2026-10/story-build/tll-mag-story-v1.html (the magazine story page: Newsreader, the byline in the head, the stamp on the photo; /stories/{slug} only)
   first  src/site-layers/tll-consent-mode-v2.js (Consent Mode v2 defaults and CookieConsent updates; AdSense readiness, 28 Oct 2026)
   cover  src/design/magazine-2026-10/cover-build/tll-mag-cover-v1.html (the magazine cover: the cover story photo full bleed, the chip, the stamp; home page only)
   No data-ms-* element is touched. */
/* TLL Consent Mode v2 (28 Oct 2026, AdSense readiness, approved by Nancy). Google tags start with every storage denied.
   CookieConsent (orestbida v3) still keeps GA4 from loading at all until analytics is accepted; this adds the Consent Mode signal
   on top, so GA4 and, later, Google's own ads consent message read the same state. */
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
(function(){function u(){try{var a=!!(window.CookieConsent&&CookieConsent.acceptedCategory&&CookieConsent.acceptedCategory('analytics'));gtag('consent','update',{analytics_storage:a?'granted':'denied'});}catch(e){}}
window.addEventListener('cc:onConsent',u);window.addEventListener('cc:onChange',u);})();
(function(){var L=[["tll-nav-phone-v1", "/* 26 Oct 2026: one button shape in the header on phones (Nancy's 23 Oct critique, point 1; prototype 3.4 header).\n   Square corners and one 44px height for Sign up, the account button and MENU, and a single row from 360px up (320px phones wrap to two tidy rows).\n   Only the links are restyled. No data-ms-* element is touched (the round avatar letter stays as Memberstack sets it). */\n@media (max-width:767px){\nbody .tll-nav-v1 .tll-nav-main{padding:6px 0 !important}\nbody .tll-nav-v1 .tll-nav-inner{align-items:center !important;column-gap:8px !important}\nbody .tll-nav-v1 .tll-nav-logo{flex:0 1 auto;min-width:0}\nbody .tll-nav-v1 .tll-nav-cta-row{margin-left:auto !important;gap:6px !important;align-items:center !important}\nbody .tll-nav-v1 .tll-nav-signin{min-height:44px !important;display:inline-flex !important;align-items:center !important;padding:0 4px !important;margin-right:-8px !important}\nbody .tll-nav-v1 .tll-nav-signup,body .tll-nav-v1 .tll-nav-account-link,body .tll-nav-v1 .tllmm-btn{box-sizing:border-box !important;height:44px !important;min-height:44px !important;border-radius:0 !important;display:inline-flex !important;align-items:center !important;justify-content:center !important}\nbody .tll-nav-v1 .tll-nav-signup{padding:0 14px !important;font-size:13px !important}\nbody .tll-nav-v1 .tll-nav-account-link{padding:0 12px 0 8px !important;border:1.5px solid #F7F1E8 !important;gap:8px !important}\nbody .tll-nav-v1 .tllmm-btn{padding:0 12px !important;min-width:68px !important;border:1.5px solid #F7F1E8 !important;font-size:12px !important;letter-spacing:2px !important}\n}\n@media (max-width:399px){\nbody .tll-nav-v1 .tll-nav-logo{zoom:.86}\nbody .tll-nav-v1 .tll-nav-signup{padding:0 10px !important}\nbody .tll-nav-v1 .tllmm-btn{padding:0 8px !important;min-width:60px !important;letter-spacing:1px !important}\n}\n"], ["tll-contrast-v1", "/* 26 Oct 2026: three text-contrast failures found by an axe check (WCAG AA needs 4.5:1 for small text).\n   1. Header \"Sign up\" and \"Share your story\": cream or white on #F0507A (3.07 and 3.42). Now white on #D63859 (4.6), the\n      look most pages already had; only the home page on desktop used the lighter rose.\n   2. /stories \"Share your story\" button (.tll-cta-rose): cream on teal #00A9A4 (2.59). Now white on #D63859 (4.6).\n   3. Rose words on light backgrounds (.tll-text-rose, #F0507A on cream, 3.07). Now #C8325B (4.64), the site rule for rose\n      text on light. Rose on dark sections keeps the bright #F0507A. Links only; no data-ms-* element is touched. */\nbody .tll-nav-v1 a.tll-nav-signup,body .tll-nav-v1 a.tll-nav-pen-cta{background-color:#D63859 !important;color:#FFFFFF !important}\nbody .tll-nav-v1 a.tll-nav-signup:hover,body .tll-nav-v1 a.tll-nav-pen-cta:hover{background-color:#C8325B !important;color:#FFFFFF !important}\nbody a.tll-cta-rose{background-color:#D63859 !important;color:#FFFFFF !important}\nbody a.tll-cta-rose:hover{background-color:#C8325B !important}\nbody .tll-text-rose{color:#C8325B}\nbody :is(.tll-section-dark,.tll-nav-v1,footer,.tll-footer-v1,.tll-story-hero,.tlldx-hero,.tllpx-hero,.tllec-hero,.tll-support-hero,.tll-auth-section,[data-h3-hero]) .tll-text-rose{color:#F0507A}\n"], ["tll-note-phone-v1", "/* 26 Oct 2026: the floating \"Tell the editor\" pill covered page content on phones (the /account tab strip, the Languages\n   field on /edit-profile). Prototype 3.4 already set the answer: under 960px the pill is a 44px round button with the dot\n   only (the words stay for screen readers). It also steps aside while a form field outside the note has focus. */\n@media (max-width:959px){\nbody #tll-note .tll-note-pill{font-size:0 !important;gap:0 !important;padding:0 !important;width:44px !important;height:44px !important;min-height:44px !important;justify-content:center !important;letter-spacing:0 !important}\nbody #tll-note .tll-note-pill::before{width:10px !important;height:10px !important}\n}\nhtml.tll-typing #tll-note:not([data-open=\"true\"]){display:none !important}\n"], ["tll-photos-tap-v1", "/* 26 Oct 2026, Nancy on an iPhone: \"Tap to add photo doesn't work\" on /share-photos. The file input sat hidden inside the drop\n   zone (1px, clipped, pointer-events none) and relied on the label passing the tap on, which iPhone browsers do not always do.\n   Now the input itself covers the whole drop zone, fully transparent, so a tap lands on the real file input on every phone.\n   Drag and drop and the keyboard still work; the focus ring shows on the drop zone. */\nbody [data-tll-form=share-photos] fieldset.tll-pen-fieldset label.tll-photos-drop{position:relative !important}\nbody [data-tll-form=share-photos] fieldset.tll-pen-fieldset label.tll-photos-drop input.tll-photos-drop-input{position:absolute !important;inset:0 !important;width:100% !important;height:100% !important;min-height:0 !important;margin:0 !important;padding:0 !important;border:0 !important;opacity:0 !important;clip-path:none !important;overflow:hidden !important;cursor:pointer !important;pointer-events:auto !important;z-index:2 !important;font-size:16px !important;display:block !important}\nbody [data-tll-form=share-photos] label.tll-photos-drop:has(> input.tll-photos-drop-input:focus-visible){outline:3px solid #F0507A;outline-offset:2px}\n"], ["tll-home-coords-v1", "/* 26 Oct 2026, Nancy: the coordinates on the home photo were half off the screen on her phone. The 20 Oct coordinates embed\n   (h3-hero-coords-v3) sets them to position:static under 900px; the phone hero layer moves them top-right but never reset that,\n   so they sat flush against the right edge and the last letters were cut. Top-right, 16px in from the edges, on phones. */\n@media (max-width:767px){\nbody:not(.tll-none) [data-h3-hero] .h3-hero-coords{position:absolute !important;margin:0 !important;top:16px !important;right:16px !important;left:auto !important;max-width:calc(100% - 32px) !important;white-space:nowrap !important;overflow:visible !important;text-overflow:clip !important;text-align:right !important}\n}\n"], ["tll-footer-wordmark-v1", "/* 26 Oct 2026, Nancy: \"What's going on with the logo\" (site footer). The footer link was plain text \"that LAYOVER LIFE\" in\n   generic classes: a big sans \"that\", a small rose \"LAYOVER LIFE\". Now it is the header wordmark at footer size:\n   italic serif \"that\", Playfair \"LAYOVER\", rose \"LIFE.\". The words are rebuilt by tll-footer-wordmark-v1.js. */\nbody footer a.tll-fwm{display:inline-flex !important;align-items:baseline !important;gap:6px !important;white-space:nowrap !important;text-decoration:none !important;color:#F8F2E6 !important;font-size:inherit !important;line-height:1 !important;margin:0 0 4px !important}\nbody footer a.tll-fwm .tll-fwm-that{font:italic 400 18px/1 'DM Serif Display','Playfair Display',Georgia,serif !important;opacity:.85;color:#F8F2E6 !important;letter-spacing:0 !important;text-transform:none !important}\nbody footer a.tll-fwm .tll-fwm-block{font:800 24px/1 'Playfair Display',Georgia,serif !important;letter-spacing:.01em !important;color:#F8F2E6 !important;text-transform:uppercase !important}\nbody footer a.tll-fwm .tll-fwm-life{color:#F0507A !important;font:inherit !important}\n"], ["tll-tap-colors-v1", "/* 26 Oct 2026, Nancy on the /account Stories tab: \"Not a fan of the light blue on hover click.\"\n   The row title's hover was bright rose (#F0507A) on cream, which fails contrast (3.07:1). The site's contrast layer then recolors it\n   from its palette, and the result on an iPhone long-press was a pale teal. The magazine rule instead: text stays ink, the underline\n   goes rose (#C8325B on light). Same for the Edit and Share links in that tab. No element or script changes; CSS only, after the\n   script's own styles by specificity. */\nbody .tms-row .tms-t:hover,body .tms-row .tms-t:focus-visible,body .tms-row:hover .tms-t,body .tms-row:active .tms-t{color:#0A0B14 !important;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:4px}\nbody .tms-act:hover,body .tms-act:focus-visible{color:#0A0B14 !important;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:3px}\nbody .tms-act:focus-visible{outline-color:#C8325B}\nbody .tms-row:hover,body .tms-row:active{border-color:#0A0B14 !important}\n@media(hover:none){body .tms-row:hover .tms-t,body .tms-row .tms-t:hover{text-decoration-color:transparent}body .tms-row:active .tms-t{text-decoration-color:#C8325B}}\n"], ["tll-shelf-ring-v1", "/* 26 Oct 2026, Nancy on the home library on her phone: \"The user circles are getting cut off.\" The 40px avatar's rose ring is a\n   box-shadow drawn outside its box, and on phones the story rail (.h3-track) is the scroll container, so it clips the ring at its\n   left and top edges on the first card. Three pixels of padding on those sides, pulled back by the same negative margin, keep every\n   card exactly where it was and give the ring room. Desktop (the pinned rail) was never clipped. CSS only. */\n.h3-shelf:not(.is-pinned) .h3-track{padding-left:3px;padding-top:3px;margin-left:-3px;margin-top:-3px;scroll-padding-left:3px}\n"], ["tll-masthead-v1", "/* 26 Oct 2026: the masthead line in the footer, set in Newsreader italic. The script tll-masthead-v1.js writes the text. */\nfooter p.tll-masthead{font-family:'Newsreader',Georgia,serif !important;font-style:italic;font-weight:400 !important;font-size:18px !important;line-height:1.4 !important;letter-spacing:0 !important;text-transform:none !important;max-width:34ch;text-wrap:pretty}\n"]];var h=document.head||document.documentElement;for(var i=0;i<L.length;i++){if(document.getElementById(L[i][0]))continue;var s=document.createElement('style');s.id=L[i][0];s.textContent=L[i][1];h.appendChild(s);}})();
/* tll-account-hash-tabs-v1 (26 Oct 2026). On /account, a tap on a same-page link such as the member bar's SETTINGS
   (/account#settings) or CONTRIBUTIONS (/account#stories) opens that account tab.
   Why: Webflow's smooth scroll catches same-page # links, scrolls to the target and changes the address with pushState,
   which fires no hashchange, so the account tabs never heard the tap and the target section stayed hidden.
   This listener runs first (capture phase) and only acts when a matching account tab button exists (#a3-tab-<name>). */
(function(){
  if(window.__tllHashTabs) return; window.__tllHashTabs=1;
  function same(a){ return a.host===location.host && a.pathname.replace(/\/$/,'')===location.pathname.replace(/\/$/,''); }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button>0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
    var a=e.target&&e.target.closest&&e.target.closest('a[href*="#"]'); if(!a||!a.hash||!same(a)) return;
    var tab=document.getElementById('a3-tab-'+decodeURIComponent(a.hash.slice(1))); if(!tab) return;
    e.preventDefault(); e.stopPropagation();
    tab.click();
  },true);
})();

/* tll-note-typing-v1 (26 Oct 2026): while a form field outside the "Tell the editor" note has focus, html gets
   .tll-typing and the pill steps aside, so it never sits on a field above the phone keyboard. */
(function(){
  if(window.__tllTyping) return; window.__tllTyping=1;
  var H=document.documentElement, F='input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]),textarea,select,[contenteditable="true"]';
  function on(t){ return t&&t.matches&&t.matches(F)&&!(t.closest&&t.closest('#tll-note')); }
  document.addEventListener('focusin',function(e){ if(on(e.target)) H.classList.add('tll-typing'); });
  document.addEventListener('focusout',function(){ setTimeout(function(){ if(!on(document.activeElement)) H.classList.remove('tll-typing'); },0); });
})();

/* tll-ep-country-v1 (26 Oct 2026). Edit profile, "From, and has lived in": accept the way people write places.
   Nancy typed "Portland, Oregon, USA" and got "No country by that name". The matcher took only an exact country name,
   a two letter code or the start of a name. Now it reads each comma part from the end, knows common short forms
   (USA, UK, England, Holland, UAE ...) and US state names, then falls back to the old matcher. Exact country names win
   first, so "Georgia" stays the country. Same stored value as before: two letter codes in from-and-lived-in. */
(function(){
  if(!/^\/edit-profile/.test(location.pathname)) return;
  var ALIAS={'usa':'us','u.s.a.':'us','u.s.a':'us','u.s.':'us','u.s':'us','america':'us','united states of america':'us','the united states':'us',
    'uk':'gb','u.k.':'gb','u.k':'gb','britain':'gb','great britain':'gb','england':'gb','scotland':'gb','wales':'gb','northern ireland':'gb','the united kingdom':'gb',
    'holland':'nl','the netherlands':'nl','uae':'ae','u.a.e.':'ae','emirates':'ae','the emirates':'ae','korea':'kr','republic of korea':'kr',
    'czech republic':'cz','burma':'mm','swaziland':'sz','macedonia':'mk','east timor':'tl','cabo verde':'cv',"cote d'ivoire":'ci',"côte d'ivoire":'ci',
    'vatican':'va','holy see':'va','turkiye':'tr','türkiye':'tr','russian federation':'ru','drc':'cd','democratic republic of the congo':'cd','republic of ireland':'ie'};
  var ST={}; "alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming|washington dc|washington d.c.|district of columbia|puerto rico".split('|').forEach(function(x){ ST[x]=1; }); /* US states (Georgia is left to the country) */
  function norm(s){ return String(s||'').trim().toLowerCase().replace(/\s+/g,' '); }
  function patch(){
    var E=window.TLLEP; if(!E||!E.ccode||E.ccode.__tll||!E.C) return false;
    var base=E.ccode;
    function exact(p){ for(var i=0;i<E.C.length;i++){ if(E.C[i].c===p||E.C[i].n.toLowerCase()===p) return E.C[i].c; } return ''; }
    var f=function(q){
      var s=norm(q); if(!s) return '';
      var parts=s.split(/\s*[,;\/]\s*|\s+-\s+/).filter(Boolean);
      for(var i=parts.length-1;i>=0;i--){ var p=parts[i]; var c=exact(p)||ALIAS[p]||(ST[p]?'us':''); if(c) return c; }
      return base(q) || (parts.length>1 ? base(parts[parts.length-1]) : '');
    };
    f.__tll=1; E.ccode=f; return true;
  }
  if(!patch()){ var n=0, iv=setInterval(function(){ if(patch()||++n>40) clearInterval(iv); },250); document.addEventListener('DOMContentLoaded',patch); }
  /* Copy on the same page: the pen name note used a banned phrase; the country hint now says a place works. */
  function copy(){
    var pen=document.querySelector('[data-ep-penwrap] .ep-note');
    if(pen&&/real name stays on file/i.test(pen.textContent)) pen.textContent='Only the editor sees your full name. Readers see your pen name, and every byline is still a person.';
    var fn=document.querySelector('[data-ep-flagnote]');
    if(fn&&!fn.hasAttribute('data-hold')&&/^Type a country and press Enter/.test(fn.textContent)) fn.textContent='Type a country, or a place with its country, and press Enter. Up to five.';
  }
  if(document.readyState!=='loading') copy(); else document.addEventListener('DOMContentLoaded',copy);
})();

/* tll-footer-wordmark-v1 (26 Oct 2026): the site footer's home link "that LAYOVER LIFE" becomes the header wordmark
   (that + LAYOVER + LIFE.). Text only; the link, its href and its place stay. Styles: tll-footer-wordmark-v1.html. */
(function(){
  function run(){
    [].forEach.call(document.querySelectorAll('footer a[href="/"]'),function(a){
      if(a.classList.contains('tll-fwm')) return;
      var t=a.textContent.replace(/\s+/g,' ').trim(); if(!/^that ?layover life\.?$/i.test(t)) return;
      a.classList.add('tll-fwm'); a.setAttribute('aria-label','That Layover Life, home');
      a.innerHTML='<span class="tll-fwm-that">that</span><span class="tll-fwm-block">LAYOVER <span class="tll-fwm-life">LIFE.</span></span>';
    });
  }
  if(document.readyState!=='loading') run(); else document.addEventListener('DOMContentLoaded',run);
})();

/* tll-masthead-v1 (26 Oct 2026, the magazine direction, Nancy: "I like written by the people who went"): the site footer's
   tagline under the wordmark reads the masthead line. Text only; the element, its place and its styles stay. The site never
   claims that no story was written by AI. Styles: tll-masthead-v1.html. */
(function(){
  var LINE='Written by the people who went. Travel stories from members around the world, edited in Copenhagen.';
  function run(){
    [].forEach.call(document.querySelectorAll('footer a[href="/"] + p'),function(p){
      if(p.dataset.tllMasthead)return;p.dataset.tllMasthead='1';p.textContent=LINE;p.classList.add('tll-masthead');});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* tll-ux-1028-v1 (28 Oct 2026 visual review, desktop 1440 and phone 390). Three fixes, namespaced, nothing removed:
   1. Type floor: 14px for selling lines, 12px for meta, captions and photo credits (the card stamps are aria-hidden drawings and stay as drawn).
   2. Contrast: the newsletter and Tell the editor success messages (the site-wide form rule painted ink text on a 7% teal tint, which on the
      note's dark card is close to invisible), the "Opening city by city" note and the newsletter small print reach 4.5:1 or better.
   3. Tell the editor: on a page with the home hero, the button waits until the hero has cleared the bottom of the screen, so it never sits on
      the hero on first load; it fades up in 200ms. It stays reachable by keyboard (focus brings it back) and gets aria-label "Tell the editor". */
(function(){
var HEAD="body:has([data-h3-hero]) #tll-note:not(.tll-note-out):not([data-open=\"true\"]):not(:focus-within){opacity:0;transform:translateY(8px);pointer-events:none}"+
"#tll-note{transition:opacity 200ms cubic-bezier(.23,1,.32,1),transform 200ms cubic-bezier(.23,1,.32,1)}"+
"@media (prefers-reduced-motion:reduce){#tll-note{transition:opacity 120ms linear}body:has([data-h3-hero]) #tll-note:not(.tll-note-out){transform:none}}";
var TAIL="html body:not(.tll-none) [data-h3-hero] .h3.h3-hero-free{font-size:14px!important;letter-spacing:1px!important}"+
"html body:not(.tll-none) [data-h3-hero] .h3.h3-hero-coords{font-size:12px!important}"+
"html body .h3 [data-h3-dash-sub],html body .h3-c2 .h3-ctas .h3-note{font-size:14px!important;letter-spacing:.12em!important}"+
"html body .tll-nav-v1 .tll-nav-signup{font-size:14px!important}"+
"html body .h3-ex-foot .h3-note{color:#6B6660!important;opacity:1!important}"+
"html body [data-h3=\"news\"] .h3-c7-note{color:#0A0B14!important;opacity:1!important}"+
"html body [data-h3=\"news\"] .w-form-done{background:#0D0F1A!important;border:0!important;color:#F7F1E8!important;text-align:left!important}"+
"html body #tll-note .w-form-done{background:#12141F!important;border:1px solid #067A79!important;color:#F7F1E8!important}";
function style(id,css,where){if(document.getElementById(id))return;var s=document.createElement('style');s.id=id;s.textContent=css;where.appendChild(s);}
style('tll-ux-1028-head',HEAD,document.head||document.documentElement);
function run(){style('tll-ux-1028',TAIL,document.body);
  var W=document.getElementById('tll-note');if(!W)return;var pill=W.querySelector('.tll-note-pill');if(pill&&!pill.getAttribute('aria-label'))pill.setAttribute('aria-label','Tell the editor');
  var hero=document.querySelector('[data-h3-hero]');if(!hero){W.classList.add('tll-note-out');return;}
  var t=0;function upd(){t=0;var r=hero.getBoundingClientRect();W.classList.toggle('tll-note-out',!(r.bottom>innerHeight-76&&r.top<innerHeight));}
  upd();addEventListener('scroll',function(){if(!t)t=requestAnimationFrame(upd);},{passive:true});addEventListener('resize',upd);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* tll-page-heroes-v1 (29 Oct 2026, Nancy: "This page needs images" /for-expats; "hero love" for /stories, /travelers, /the-map, /about).
   Photos from the members' own stories, each credited to the writer and linked to the story it came from. No AI-written headline or
   body copy: the only new words are place names, bylines and two short labels. No member's current whereabouts: captions name the place
   of a published story, never where anyone is now. Runs only on the five paths below; namespaced tll-ph-; nothing is removed, and no
   data-ms-* element is touched.
     /stories     four story covers under the title (a swipe row on phones)
     /travelers   the writers' faces beside the title (a row of faces above it on phones)
     /the-map     a story photo behind the hero, under a deep scrim, with its credit
     /about       a filmstrip of four story photos along the bottom of the hero, Magnus included
     /for-expats  a story photo beside the hero, and a row of three story photos after the directory */
(function(){
var path=location.pathname.replace(/\/+$/,'')||'/';
var PAGES={'/stories':1,'/travelers':1,'/the-map':1,'/about':1,'/for-expats':1};
if(!PAGES[path])return;
var C='https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/';
var P={
 ibiza:{src:C+'6ad72dc3c7e76f61648a3c30_6ad72d77eeadeeb5b887095e_chesney-lish-spain-hero.jpeg',alt:'Sunset over the sea from a beach bar in Ibiza, the sun low behind a thatched roof',place:'Ibiza, Spain',by:'Chesney Lish',href:'/stories/spain-madrid-wedding-ibiza',pos:'50% 88%'},
 jaguar:{src:C+'6ac86ab8eaf54b2878f9344b_6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river.jpeg',alt:'A jaguar swimming across a river in the Pantanal',place:'Pantanal, Brazil',by:'Nancy Carleton',href:'/stories/pantanal-glimmers-in-the-wild',pos:'42% 60%'},
 antarctica:{src:C+'6ab3d9bc5c183888afac103a_6ab3d9295c183888afabcab9_antarctica-hero-landing-in-the-sun.jpeg',alt:'The sun over a snowfield and mountains on a landing in Antarctica',place:'Antarctica',by:'Nancy Carleton',href:'/stories/antarctica-marathon',pos:'60% 50%'},
 fitzroy:{src:C+'6a3e79b1f2ea14b30d7a5e0f_6a0e0225995b48deb53b96e8_Fitz%2520Roy.jpeg',alt:'The granite peaks of Fitz Roy above green hills in Patagonia',place:'Patagonia',by:'Nancy Carleton',href:'/stories/patagonia-w-trek-christmas-new-year',pos:'62% 40%'},
 sortsol:{src:C+'6aba3d42f18f65b8d06aea74_6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars.jpeg',alt:'',place:'Sort Sol, Denmark',by:'Nancy Carleton',href:'/stories/sort-sol-black-sun-denmark',pos:'50% 35%'},
 bulgaria:{src:C+'6aae867b7b616826932f4447_6a1183262f8a632aeff43aed_Bulgaria.jpeg',alt:'A yellow building and wisteria on a quiet tree-lined street in Bulgaria',place:'Bulgaria',by:'Nancy Carleton',href:'/stories/balkans-ev-road-trip-twelve-countries',pos:'50% 45%'},
 montenegro:{src:C+'6a0e027dbb2d090c01c473b4_6a0e02265e2392e5fc632431_Montenegro%2520coast.jpeg',alt:'The Montenegro coast at sunset from a wooded hillside',place:'Montenegro',by:'Nancy Carleton',href:'/stories/montenegro-budva-switchback-roads',pos:'50% 50%'},
 lapaz:{src:C+'6aae867b7b616826932f4444_6a0e022469c0ce59398ce287_La%2520Paz%2520Mexico.jpeg',alt:'A sea lion swimming toward the camera off La Paz',place:'La Paz, Mexico',by:'Nancy Carleton',href:'/stories/la-paz-mexico-whale-sharks',pos:'40% 50%'},
 ghana:{src:C+'6a0e027dbb2d090c01c473b8_6a0e0224fb0e0ee3c092ec01_Ghana%2520kids.jpeg',alt:'Three children sitting together on a bench in Ghana',place:'Ghana',by:'Nancy Carleton',href:'/stories/ghana-easter-everyone-wears-white',pos:'55% 50%'},
 magnus:{src:'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6ac9f3a6135a91817959e01a_magnus-holi-side.jpg',alt:'Magnus the Samoyed, his white coat dusted with Holi colors',place:'Magnus',by:'Paw Passport',href:'/pets/magnus-waffles',pos:'50% 30%'}
};
var FACES=[
 {name:'Chesney Lish',href:'/contributors/chesney-lish',src:C+'6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg',pos:'50% 25%'},
 {name:'Barzy Adam',href:'/contributors/barzy-adam',src:C+'6ad72dc2c7c33fe2b4d53be9_6ad72d778e0db3aa7718c140_barzy-adam-avatar.jpeg',pos:'50% 30%'},
 {name:'Magnus',href:'/pets/magnus-waffles',src:P.magnus.src,pos:'50% 30%'},
 {name:'Nancy Carleton',href:'/contributors/nancy-carleton',src:'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg',pos:'50% 35%'}
];
var CSS=
/* shared: tiles, captions, credit */
".tll-ph-tile{display:block;position:relative;text-decoration:none!important;color:inherit!important;-webkit-tap-highlight-color:transparent}"+
".tll-ph-img{display:block;position:relative;overflow:hidden;border-radius:2px;background:#E9E2D6}"+
".tll-ph-img img{display:block;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;object-fit:cover;opacity:0;transition:opacity 400ms cubic-bezier(.23,1,.32,1),transform 600ms cubic-bezier(.23,1,.32,1)}"+
".tll-ph-img img.tll-ph-in{opacity:1}"+
"@media (hover:hover) and (pointer:fine){.tll-ph-tile:hover .tll-ph-img img{transform:scale(1.03)}}"+
".tll-ph-tile:focus-visible{outline:3px solid #C8325B;outline-offset:3px}"+
".tll-ph-cap{display:block;margin:10px 0 0;font:500 12px/1.45 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#5F5A54;text-align:left}"+
".tll-ph-cap b{display:block;font-weight:600;color:#1A1A1A}"+
".tll-ph-label{margin:0 0 16px;font:600 12px/1.4 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:#C8325B}"+
"@media (prefers-reduced-motion:reduce){.tll-ph-img img{transition:none;opacity:1}.tll-ph-tile:hover .tll-ph-img img{transform:none}}"+
/* /stories: four covers under the title */
".tll-ph-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;max-width:960px;margin:36px auto 12px;padding:0 24px;box-sizing:border-box}"+
".tll-ph-row .tll-ph-img{aspect-ratio:4/5}"+
"@media (max-width:767px){.tll-ph-row{display:flex;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;gap:12px;margin:22px 0 6px;padding:0 24px 6px;scroll-padding:0 24px;scrollbar-width:none}"+
".tll-ph-row::-webkit-scrollbar{display:none}.tll-ph-row>.tll-ph-tile{flex:0 0 46%;scroll-snap-align:start}.tll-ph-row .tll-ph-cap b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tll-ph-row .tll-ph-img{aspect-ratio:3/4}}"+
/* /travelers: the writers' faces */
".tll-ph-faces{display:flex;gap:14px;margin:0 0 28px;padding:0;list-style:none}"+
".tll-ph-faces li{margin:0;padding:0;list-style:none}"+
".tll-ph-faces .tll-ph-img{width:64px;height:64px;border-radius:50%;box-shadow:0 0 0 2px #F7F1E8,0 0 0 3.5px #C8325B}"+
".tll-ph-faces .tll-ph-cap{margin-top:8px;width:72px;margin-left:-4px;text-align:center;letter-spacing:.02em;text-transform:none;font-size:12px;color:#1A1A1A}"+
".tll-ph-faces .tll-ph-cap b{font-weight:600}"+
"@media (min-width:1200px){"+
".tll-travelers-hero .tll-travelers-hero-inner.tll-ph-grid{max-width:1232px!important;display:grid!important;grid-template-columns:minmax(0,1fr) 300px;column-gap:72px;align-items:center}"+
".tll-travelers-hero .tll-travelers-hero-inner.tll-ph-grid{grid-template-rows:1fr auto auto auto 1fr}"+
".tll-ph-grid>:not(.tll-ph-faces){grid-column:1}.tll-ph-grid>:nth-child(2){grid-row:2}.tll-ph-grid>:nth-child(3){grid-row:3}.tll-ph-grid>:nth-child(4){grid-row:4}"+
".tll-ph-grid>.tll-ph-faces{grid-column:2;grid-row:1/-1;display:grid;grid-template-columns:repeat(2,1fr);gap:18px 18px;margin:0}"+
".tll-ph-grid>.tll-ph-faces li:nth-child(even){transform:translateY(36px)}"+
".tll-ph-grid>.tll-ph-faces .tll-ph-img{width:100%;height:auto;aspect-ratio:4/5;border-radius:2px;box-shadow:none}"+
".tll-ph-grid>.tll-ph-faces .tll-ph-cap{width:auto;margin:8px 0 0;text-align:left}}"+
/* /the-map: a story photo behind the hero */
".tll-ph-hasbg{position:relative!important;isolation:isolate;overflow:hidden;border-radius:0!important}"+
".tll-ph-bg{position:absolute;inset:0;z-index:-1;pointer-events:none;background:#0A0B14}"+
".tll-ph-bg .tll-ph-img{position:absolute;inset:0;border-radius:0;background:#0A0B14}"+
".tll-ph-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,11,20,.95) 0%,rgba(10,11,20,.88) 42%,rgba(10,11,20,.5) 100%),linear-gradient(0deg,#0A0B14 0%,rgba(10,11,20,0) 34%)}"+
".tll-ph-credit{position:absolute;right:24px;bottom:18px;z-index:1;font:500 12px/1.4 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#C9C2B8!important;text-decoration:none!important}"+
".tll-ph-credit b{color:#F7F1E8;font-weight:600}"+
".tll-ph-credit:hover b,.tll-ph-credit:focus-visible b{text-decoration:underline;text-decoration-color:#F0507A;text-underline-offset:3px}"+
".tll-ph-credit:focus-visible{outline:3px solid #F0507A;outline-offset:3px}"+
"@media (max-width:767px){html body section.tll-map-hero.tll-ph-hasbg{padding-top:244px!important;padding-bottom:64px!important}.tll-ph-bg .tll-ph-img{bottom:auto;height:270px}"+
".tll-ph-bg::after{background:linear-gradient(180deg,rgba(10,11,20,.1) 0,rgba(10,11,20,.35) 130px,rgba(10,11,20,.9) 225px,#0A0B14 268px)}"+
".tll-ph-credit{bottom:20px;left:24px;right:24px}}"+
/* /about: a filmstrip along the bottom of the hero */
".tll-ph-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin:56px 0 0;padding:0}"+
".tll-ph-strip .tll-ph-tile{height:320px}"+
".tll-ph-strip .tll-ph-img{height:100%;border-radius:0;background:#1A1C28}"+
".tll-ph-strip .tll-ph-img::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,11,20,0) 52%,rgba(10,11,20,.86) 100%);pointer-events:none}"+
".tll-ph-strip .tll-ph-cap{position:absolute;left:16px;right:16px;bottom:14px;margin:0;z-index:1;color:#D9D3C9}"+
".tll-ph-strip .tll-ph-cap b{color:#F7F1E8}"+
".tll-ph-strip .tll-ph-tile:focus-visible{outline-color:#F0507A;outline-offset:-3px}"+
"@media (max-width:767px){.tll-ph-strip{display:flex;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;margin-top:40px;scrollbar-width:none}"+
".tll-ph-strip::-webkit-scrollbar{display:none}.tll-ph-strip>.tll-ph-tile{flex:0 0 72%;height:240px;scroll-snap-align:start}}"+
/* /for-expats: a photo beside the hero, a row of three after the directory */
"@media (min-width:1100px){"+
"section.tll-ph-split{max-width:1072px!important;display:grid!important;grid-template-columns:minmax(0,1fr) 320px;column-gap:56px;align-items:center}"+
"section.tll-ph-split h1{font-size:clamp(56px,5.2vw,76px)!important;line-height:1!important}}"+
".tll-ph-side .tll-ph-img{aspect-ratio:4/5}"+
"@media (max-width:1099px){.tll-ph-side{margin-top:32px}.tll-ph-side .tll-ph-img{aspect-ratio:4/3}}"+
".tll-ph-band{max-width:1072px;margin:0 auto;padding:56px 24px 8px;box-sizing:border-box}"+
".tll-ph-band .tll-ph-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}"+
".tll-ph-band .tll-ph-img{aspect-ratio:3/2}"+
"@media (max-width:767px){.tll-ph-band{padding:40px 0 4px}.tll-ph-band .tll-ph-label{padding:0 24px}"+
".tll-ph-band .tll-ph-three{display:flex;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;gap:12px;padding:0 24px 6px;scroll-padding:0 24px;scrollbar-width:none}"+
".tll-ph-band .tll-ph-three::-webkit-scrollbar{display:none}.tll-ph-band .tll-ph-three>.tll-ph-tile{flex:0 0 72%;scroll-snap-align:start}}";

function el(tag,cls){var e=document.createElement(tag);if(cls)e.className=cls;return e;}
function img(p,eager){var i=document.createElement('img');i.src=p.src;i.alt=p.alt||'';i.decoding='async';if(!eager)i.loading='lazy';
  i.style.objectPosition=p.pos||'50% 50%';function on(){i.classList.add('tll-ph-in');}
  if(i.complete&&i.naturalWidth)on();else{i.addEventListener('load',on);i.addEventListener('error',on);}return i;}
function frame(p,eager){var f=el('span','tll-ph-img');f.appendChild(img(p,eager));return f;}
function cap(p){var c=el('span','tll-ph-cap');var b=el('b');b.textContent=p.place;c.appendChild(b);c.appendChild(document.createTextNode(p.by));return c;}
function tile(p,eager){var a=el('a','tll-ph-tile');a.href=p.href;a.appendChild(frame(p,eager));a.appendChild(cap(p));return a;}

function stories(){var h1=document.querySelector('.tll-library-hero h1');if(!h1||document.querySelector('.tll-ph-row'))return;
  var row=el('div','tll-ph-row');['ibiza','jaguar','antarctica','fitzroy'].forEach(function(k){row.appendChild(tile(P[k],true));});
  h1.insertAdjacentElement('afterend',row);}
function travelers(){var inner=document.querySelector('.tll-travelers-hero .tll-travelers-hero-inner');if(!inner||inner.querySelector('.tll-ph-faces'))return;
  var ul=el('ul','tll-ph-faces');ul.setAttribute('aria-label','Some of the travelers');
  FACES.forEach(function(f){var li=el('li');var a=el('a','tll-ph-tile');a.href=f.href;a.appendChild(frame({src:f.src,alt:'',pos:f.pos},true));
    var c=el('span','tll-ph-cap');var b=el('b');b.textContent=f.name;c.appendChild(b);a.appendChild(c);li.appendChild(a);ul.appendChild(li);});
  inner.insertBefore(ul,inner.firstChild);inner.classList.add('tll-ph-grid');}
function map(){var sec=document.querySelector('section.tll-map-hero');if(!sec||sec.querySelector('.tll-ph-bg'))return;var p=P.sortsol;
  var bg=el('div','tll-ph-bg');bg.setAttribute('aria-hidden','true');bg.appendChild(frame(p,true));sec.insertBefore(bg,sec.firstChild);sec.classList.add('tll-ph-hasbg');
  var cr=el('a','tll-ph-credit');cr.href=p.href;var b=el('b');b.textContent='Photo';cr.appendChild(b);cr.appendChild(document.createTextNode(' '+p.by+' · '+p.place));sec.appendChild(cr);}
function about(){var hero=document.querySelector('.tll-about-final-hero');if(!hero||hero.querySelector('.tll-ph-strip'))return;
  var s=el('div','tll-ph-strip');['ibiza','magnus','fitzroy','jaguar'].forEach(function(k){s.appendChild(tile(P[k],false));});hero.appendChild(s);}
function expats(){var h1=document.querySelector('main h1')||document.querySelector('h1');var sec=h1&&h1.closest('section');if(!sec||sec.classList.contains('tll-ph-split'))return;
  var copy=el('div','tll-ph-copy');while(sec.firstChild)copy.appendChild(sec.firstChild);sec.appendChild(copy);
  var fig=el('div','tll-ph-side');fig.appendChild(tile(P.bulgaria,true));sec.appendChild(fig);sec.classList.add('tll-ph-split');
  var dir=document.querySelector('[data-tll-x="dir"]');if(!dir||document.querySelector('.tll-ph-band'))return;
  var band=el('section','tll-ph-band');band.setAttribute('aria-labelledby','tll-ph-band-t');var lab=el('p','tll-ph-label');lab.id='tll-ph-band-t';lab.textContent='From the stories';band.appendChild(lab);
  var three=el('div','tll-ph-three');['montenegro','lapaz','ghana'].forEach(function(k){three.appendChild(tile(P[k],false));});band.appendChild(three);
  dir.insertAdjacentElement('afterend',band);}

function run(){if(!document.getElementById('tll-page-heroes-v1')){var s=el('style');s.id='tll-page-heroes-v1';s.textContent=CSS;document.body.appendChild(s);}
  try{({'/stories':stories,'/travelers':travelers,'/the-map':map,'/about':about,'/for-expats':expats})[path]();}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* tll-story-ask-v1 (29 Oct 2026, Nancy agreed to the contributor research, practices 3 and 7: ask inline at the end of a story, with exact
   labels, stories first). One quiet line after the share row on /stories/{slug}: "Pitch a layover story" to /submit, then "send one photo"
   to /share-photos. No pop-up, no decline button to shame. Namespaced tll-sa-; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/stories\/[a-z0-9-]+\/?$/.test(location.pathname))return;
var CSS=".tll-sa{margin:28px 0 0;padding:20px 22px;border:1px solid rgba(10,11,20,.14);border-radius:2px;background:#FDF9F3;font-size:16px;line-height:1.5;color:#1A1A1A}"+
".tll-sa-k{display:block;margin:0 0 6px;font:600 12px/1.4 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:#C8325B}"+
".tll-sa a{color:#1A1A1A;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:4px}"+
".tll-sa a:hover{color:#C8325B}.tll-sa a:focus-visible{outline:2px solid #C8325B;outline-offset:2px}";
function run(){if(document.querySelector('.tll-sa'))return;var row=document.querySelector('.tll-story-share-row');if(!row)return;
  var s=document.createElement('style');s.id='tll-story-ask-v1';s.textContent=CSS;document.head.appendChild(s);
  var p=document.createElement('p');p.className='tll-sa';
  p.innerHTML='<span class="tll-sa-k">Write for TLL</span>Went somewhere worth telling? <a href="/submit">Pitch a layover story →</a> or <a href="/share-photos">send one photo</a>.';
  row.insertAdjacentElement('afterend',p);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* tll-open-slots-v1 (29 Oct 2026, Nancy agreed to retire the open-slot signals: show who is here, then one action tile, stories first).
   /spotlight: the site head script draws two "COMING SOON · Spotlight slot" cards and an "OPEN SLOT · Your name here." card. Here the two
   coming-soon cards are hidden and the third becomes one action tile, Pitch your layover. Works whichever script runs first: it marks the
   cards so the head script skips them, and redraws them if the head script got there first. Nothing removed; no data-ms-* element touched. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/spotlight')return;
function run(){
  ['a.inline-a-1-1','a.inline-a-2-1'].forEach(function(s){var a=document.querySelector(s);if(!a||a.dataset.tllSa)return;a.dataset.tllSa='1';a.dataset.tllSp='1';a.style.setProperty('display','none','important');a.setAttribute('aria-hidden','true');a.tabIndex=-1;});
  var a=document.querySelector('a.inline-a-3');if(!a||a.dataset.tllSa)return;a.dataset.tllSa='1';a.dataset.tllSp='1';a.href='/submit';
  a.setAttribute('style','display:block;border:1px solid #E0DACE;border-radius:2px;padding:28px 24px;text-align:left;background:#FDF9F3;text-decoration:none;color:#1A1A1A');
  a.innerHTML='<div style="font-family:JetBrains Mono,monospace;font-size:12px;letter-spacing:.18em;font-weight:600;color:#C8325B;margin-bottom:10px;text-transform:uppercase">Write for TLL</div>'+
    '<div style="font-family:Playfair Display,Georgia,serif;font-weight:800;font-size:24px;margin-bottom:8px">Pitch your layover.</div>'+
    '<p style="margin:0 0 18px;color:#3a3a3a;font-size:16px;line-height:1.5">We edit lightly and keep your byline.</p>'+
    '<span style="display:inline-block;background:#D63859;color:#fff;border-radius:2px;padding:12px 18px;font-weight:700">Pitch a layover story →</span>';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.addEventListener('load',run);
})();

/* tll-travelers-fix-v1 (29 Oct 2026, Nancy's /travelers screenshot: the link chips look weird, the open slot still shows, the first grid cell is
   empty; Nancy agreed to retire the open-slot signals). /travelers only. Three fixes, namespaced tll-tf-, nothing removed, no data-ms-* element touched:
   1. Link chips: the 26px circles with IG, YT, WEB and LINK (clipped once the 12px type floor applies) become labelled pills (Instagram, YouTube,
      Website, Link) and move inside the card's text area, so they sit in the card padding instead of on its left edge. The chips are added by the
      page's own script after this one runs, so a watcher on the grid catches them as they arrive.
   2. Empty cells: a CMS item whose card is hidden (a Webflow condition) still took a grid cell. Items with no visible card are hidden.
   3. Open slot: the "OPEN SLOT · Your name here." card is hidden (the page script keeps writing to it on every filter click) and one action tile
      stands next to it, with copy that follows the pressed filter: Pitch your layover first, then the directory that filter is about. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/travelers')return;
var LABEL={instagram:'Instagram',youtube:'YouTube',website:'Website',blog:'Website',tiktok:'TikTok',strava:'Strava',newsletter:'Newsletter',other:'Link'};
var TILE={
 everyone:{ey:'WRITE FOR TLL',t:'Pitch your layover.',b:'We edit lightly and keep your byline. Your card here comes with it.',c:'Pitch a layover story →',h:'/submit',s:['or join the Travelers','/signup']},
 expats:{ey:'LIVE THERE',t:'Know a place by heart?',b:'Switch on Live there in your profile and your page lists under the city you call home.',c:'Switch on Live there →',h:'/edit-profile'},
 creators:{ey:'MAKE THINGS',t:'Show your work.',b:'Switch on Make things and the links you choose sit on your page.',c:'Add your links →',h:'/edit-profile'},
 press:{ey:'PRESS',t:'Working travel journalist?',b:'Switch on Press. An editor reviews within 48 hours, and hosted trips stay labeled at the top of every story.',c:'Apply as press →',h:'/edit-profile'},
 pets:{ey:'PETS',t:'Travel with a pet?',b:'Any species, with paperwork. A pet gets a passport page of their own.',c:'Add a pet →',h:'/my-pets'}
};
var MONO="'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";
var CSS=
"html body .tll-trav-linkchips{display:flex!important;flex-wrap:wrap;gap:8px!important;margin:14px 0 0!important;padding:0!important}"+
"html body .tll-trav-linkchips span{width:auto!important;height:auto!important;min-height:32px;padding:0 12px!important;display:inline-flex!important;align-items:center;box-sizing:border-box;"+
"border:1px solid #D9D2C5!important;border-radius:999px!important;background:#FDF9F3!important;color:#1A1A1A!important;font:600 12px/1 "+MONO+"!important;letter-spacing:.06em!important;"+
"text-transform:none;cursor:pointer;transition:border-color 150ms ease}"+
"html body .tll-trav-linkchips span:hover{border-color:#C8325B!important}"+
"html body .tll-trav-linkchips span:focus-visible{outline:2px solid #C8325B!important;outline-offset:2px;border-color:#C8325B!important}"+
"html body [data-tv-open]{display:none!important}"+
".tll-tf-tile{border:1px solid #E0DACE;background:#FDF9F3;padding:24px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;min-height:280px;min-width:0;box-sizing:border-box}"+
".tll-tf-tile[hidden]{display:none!important}"+
".tll-tf-ey{font:600 12px/1.4 "+MONO+";letter-spacing:.18em;color:#C8325B;text-transform:uppercase}"+
".tll-tf-t{font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:24px;line-height:1.05;letter-spacing:-.02em;margin:10px 0 0;color:#0A0B14}"+
".tll-tf-b{font-family:'IBM Plex Sans Condensed','DM Sans',system-ui,sans-serif;font-size:14px;line-height:1.5;color:#3a3a3a;margin:10px 0 0}"+
".tll-tf-acts{display:flex;flex-direction:column;align-items:flex-start;gap:10px}"+
".tll-tf-c{font-family:'IBM Plex Sans Condensed','DM Sans',system-ui,sans-serif;font-size:15px;font-weight:600;background:#D63859;color:#fff!important;border:0;border-radius:0;padding:12px 20px;min-height:44px;box-sizing:border-box;display:inline-flex;align-items:center;text-decoration:none!important}"+
".tll-tf-c:hover{background:#B82C4B}"+
".tll-tf-c:focus-visible,.tll-tf-s:focus-visible{outline:3px solid #0A0B14;outline-offset:2px}"+
".tll-tf-s{font-family:'IBM Plex Sans Condensed','DM Sans',system-ui,sans-serif;font-size:14px;color:#1A1A1A!important;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}";
function style(){if(document.getElementById('tll-travelers-fix-v1'))return;var s=document.createElement('style');s.id='tll-travelers-fix-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
style();
function chips(root){[].forEach.call((root||document).querySelectorAll('.tll-trav-linkchips'),function(row){
  if(!row.dataset.tllTf){row.dataset.tllTf='1';[].forEach.call(row.querySelectorAll('span[data-t]'),function(sp){var l=LABEL[sp.getAttribute('data-t')]||'Link';sp.textContent=l;sp.setAttribute('aria-label',l+', opens in a new tab');});}
  var card=row.closest('[data-tll-trav-card]'),body=card&&card.querySelector('.tv-body');if(body&&row.parentNode!==body)body.appendChild(row);});}
function visible(el){if(!el)return false;var cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return false;var r=el.getBoundingClientRect();return r.width>0&&r.height>0;}
function empties(){[].forEach.call(document.querySelectorAll('[data-tll-roster-grid] .w-dyn-item'),function(it){if(it.classList.contains('tv-hide'))return;
  var c=it.querySelector('[data-tll-trav-card]');if(!c||!visible(c))it.classList.add('tv-hide');});}
function current(){var b=document.querySelector('[data-tv-filter][aria-pressed="true"]');var k=b&&b.getAttribute('data-tv-filter');return TILE[k]?k:'everyone';}
var tile=null;
function paint(){if(!tile)return;var o=TILE[current()];
  tile.innerHTML='<div><div class="tll-tf-ey"></div><div class="tll-tf-t"></div><p class="tll-tf-b"></p></div><div class="tll-tf-acts"><a class="tll-tf-c"></a></div>';
  tile.querySelector('.tll-tf-ey').textContent=o.ey;tile.querySelector('.tll-tf-t').textContent=o.t;tile.querySelector('.tll-tf-b').textContent=o.b;
  var a=tile.querySelector('.tll-tf-c');a.textContent=o.c;a.href=o.h;
  if(o.s){var s=document.createElement('a');s.className='tll-tf-s';s.textContent=o.s[0];s.href=o.s[1];tile.querySelector('.tll-tf-acts').appendChild(s);}}
function mirror(open){if(tile)tile.hidden=open.classList.contains('tv-hide');}
function placeTile(){var open=document.querySelector('[data-tv-open]');if(!open||tile)return;
  tile=document.createElement('div');tile.className='tll-tf-tile';open.parentNode.insertBefore(tile,open.nextSibling);paint();mirror(open);
  new MutationObserver(function(){mirror(open);}).observe(open,{attributes:true,attributeFilter:['class']});
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-tv-filter]'))setTimeout(paint,0);});}
function run(){style();chips();placeTile();
  var grid=document.querySelector('[data-tll-roster-grid]');
  if(grid&&!grid.__tllTf){grid.__tllTf=1;new MutationObserver(function(ms){for(var i=0;i<ms.length;i++)for(var j=0;j<ms[i].addedNodes.length;j++){var n=ms[i].addedNodes[j];
    if(n.nodeType===1&&(n.classList.contains('tll-trav-linkchips')||n.querySelector('.tll-trav-linkchips'))){chips(grid);return;}}}).observe(grid,{childList:true,subtree:true});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.addEventListener('load',function(){run();chips();empties();setTimeout(function(){chips();empties();},600);});
})();

/* tll-ep-ux-v1 (29 Oct 2026). /edit-profile, from the first paid testers' notes relayed by Nancy:
   "It is not clear how to save your profile"; "the page flickers and moves up and down every time I enter and save any information on
   the mobile version"; "it doesn't go back to the same section I was filling"; "Saved to your account ... hard to notice, I just saw this on
   the top of the screen. Maybe it can be at the bottom"; "The names of the countries don't appear in the dropdown list on the mobile version";
   "I was writing the entire names of the countries but couldn't see any indication that it is accepted or not"; "For the profile photo it
   would be great if there could be a crop or readjust feature".
   1. Save bar: one bar fixed to the bottom of the screen says what the page is doing (changes save as you type, Saving, Saved with the time,
      or what went wrong and Try again) next to View my page. The two status lines in the page header and the sticky tab bar are hidden, so a
      long message no longer grows the header and pushes the form down.
   2. The field being typed in stays put: if anything above it changes height while saving, the page scrolls by the same amount
      (iPhone Safari has no scroll anchoring of its own).
   3. The reason: when the site's save service refuses a save, the bar says why, in the service's own words.
   4. Countries: a list of matching countries opens under the From, Has lived in and expat desk boxes on every phone; tapping one adds it.
      Leaving the box with a full country name typed adds it too. UK, USA, England and other common short forms work. A line says
      "Added {country}." Same stored value as before (two letter codes).
   5. Photo: choosing a profile photo opens a square crop first. Drag to move, slider or pinch to zoom, Use photo. The cropped copy is a fresh
      1080 px JPEG, so it carries no location data either. Then the page's own upload runs as before.
   Namespaced tll-eps-; nothing removed; no data-ms-* element touched; Memberstack is called only by the page's own scripts. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/edit-profile')return;
var D=document;
var CSS=
".ep-hero-save [data-ep-status],.ep-hero-save [data-ep-retry],.ep-bar-st{display:none!important}"+
"body.tll-eps-on{padding-bottom:84px!important}"+
"body.tll-eps-on #tll-note{bottom:84px!important}"+
".tll-eps{position:fixed;left:0;right:0;bottom:0;z-index:70;background:#FDF9F3;border-top:1.5px solid #0A0B14;box-shadow:0 -6px 18px rgba(10,11,20,.08);padding:10px max(16px,env(safe-area-inset-left)) calc(10px + env(safe-area-inset-bottom));font-family:'IBM Plex Sans Condensed',system-ui,sans-serif}"+
".tll-eps-in{max-width:1120px;margin:0 auto;display:flex;align-items:center;gap:12px;min-height:44px}"+
".tll-eps-t{flex:1;min-width:0;font-size:15px;line-height:1.3;color:#1A1A1A}"+
".tll-eps-t b{font-weight:700}"+
".tll-eps-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#067A79;margin-right:8px;vertical-align:1px}"+
".tll-eps[data-s=busy] .tll-eps-dot{background:#B07A1A}"+
".tll-eps[data-s=fail] .tll-eps-dot{background:#C8325B}"+
".tll-eps[data-s=fail] .tll-eps-t{color:#8E1F3D}"+
".tll-eps-btn{flex:none;display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1.5px solid #0A0B14;background:#0A0B14;color:#F7F1E8!important;font:600 15px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;text-decoration:none!important;cursor:pointer;border-radius:0}"+
".tll-eps-btn[hidden]{display:none!important}"+
".tll-eps-btn--ghost{background:transparent;color:#0A0B14!important}"+
".tll-eps-btn:focus-visible{outline:3px solid #C8325B;outline-offset:2px}"+
"@media (max-width:520px){.tll-eps-t{font-size:13px}.tll-eps-btn{padding:0 12px;font-size:14px}.tll-eps-btn--ghost{display:none}}"+
/* country suggestions */
".tll-eps-ac{position:relative}"+
".tll-eps-list{position:absolute;left:0;right:0;top:100%;z-index:65;margin:4px 0 0;padding:4px 0;list-style:none;background:#FDF9F3;border:1.5px solid #0A0B14;box-shadow:0 10px 24px rgba(10,11,20,.14);max-height:264px;overflow:auto}"+
".tll-eps-list li{margin:0;padding:0;list-style:none}"+
".tll-eps-list button{display:flex;align-items:center;gap:10px;width:100%;min-height:44px;padding:0 14px;border:0;background:transparent;color:#1A1A1A;font:500 16px/1.2 'IBM Plex Sans Condensed',system-ui,sans-serif;text-align:left;cursor:pointer}"+
".tll-eps-list button[aria-selected=true],.tll-eps-list button:hover{background:#F0E8DA}"+
".tll-eps-added{display:block;margin:6px 0 0;font-size:14px;color:#067A79;font-weight:600}"+
/* crop dialog */
".tll-eps-crop{position:fixed;inset:0;z-index:90;background:rgba(10,11,20,.72);display:flex;align-items:center;justify-content:center;padding:16px}"+
".tll-eps-card{background:#FDF9F3;width:min(100%,420px);padding:20px;border:1.5px solid #0A0B14;font-family:'IBM Plex Sans Condensed',system-ui,sans-serif;color:#1A1A1A}"+
".tll-eps-card h2{margin:0 0 4px;font:800 24px/1.1 'Playfair Display',Georgia,serif!important;color:#0A0B14;letter-spacing:-.01em}"+
".tll-eps-card p{margin:0 0 14px;font-size:14px;line-height:1.45;color:#3a3a3a}"+
".tll-eps-stage{position:relative;width:100%;aspect-ratio:1/1;background:#0A0B14;overflow:hidden;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}"+
".tll-eps-stage canvas{display:block;width:100%;height:100%}"+
".tll-eps-stage::after{content:'';position:absolute;inset:0;pointer-events:none;border-radius:50%;box-shadow:0 0 0 999px rgba(10,11,20,.45);outline:2px solid rgba(247,241,232,.9);outline-offset:-2px}"+
".tll-eps-zoom{display:flex;align-items:center;gap:10px;margin:14px 0 16px;font-size:14px}"+
".tll-eps-zoom input{flex:1;accent-color:#C8325B;min-height:44px}"+
".tll-eps-acts{display:flex;gap:10px;justify-content:flex-end}";

function el(t,c){var e=D.createElement(t);if(c)e.className=c;return e;}
function $(s,r){return (r||D).querySelector(s);}

/* ---------- 1 and 3: the save bar, and the reason ---------- */
var lastErr='';
(function(){var f=window.fetch;if(!f||f.__tllEps)return;var w=function(u,o){var p=f.apply(this,arguments);var s=String(u&&u.url||u);
  if(/\/profile\/save$/.test(s))p.then(function(r){if(r.ok){lastErr='';return;}r.clone().json().then(function(j){lastErr=String(j&&j.error||'');paint();}).catch(function(){lastErr='';});}).catch(function(){lastErr='';});
  return p;};w.__tllEps=1;window.fetch=w;})();
var bar,txt,btn,retry,save,okTimer=0;
function hhmm(){var d=new Date();return d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});}
function paint(){var s=$('[data-ep-status]');if(!s||!bar)return;var st=s.getAttribute('data-state')||'',t=(s.textContent||'').trim();
  bar.setAttribute('data-s',st||'idle');
  if(st==='busy'){txt.innerHTML='<span class="tll-eps-dot"></span>Saving…';}
  else if(st==='ok'){txt.innerHTML='<span class="tll-eps-dot"></span><b>Saved</b> · '+hhmm();}
  else if(st==='fail'){var why=/did not update/.test(t)&&lastErr?'Saved to your account. Your public page did not update yet: '+lastErr:t;txt.innerHTML='';var d=el('span','tll-eps-dot');txt.appendChild(d);txt.appendChild(D.createTextNode(why));}
  else{txt.innerHTML='<span class="tll-eps-dot"></span>Changes save as you type, or tap Save.';}
  retry.hidden=st!=='fail';btn.hidden=st==='fail';save.hidden=st==='fail';}
function buildBar(){if($('.tll-eps'))return;bar=el('div','tll-eps');bar.setAttribute('data-s','idle');
  var i=el('div','tll-eps-in');txt=el('p','tll-eps-t');txt.setAttribute('role','status');txt.setAttribute('aria-live','polite');txt.style.margin='0';
  var v=$('[data-ep-view]');btn=el('a','tll-eps-btn tll-eps-btn--ghost');btn.textContent='View my page →';btn.href=v?v.getAttribute('href'):'/travelers';btn.target='_blank';btn.rel='noopener';
  retry=el('button','tll-eps-btn');retry.type='button';retry.textContent='Try again';retry.hidden=true;
  save=el('button','tll-eps-btn');save.type='button';save.textContent='Save';
  save.addEventListener('click',function(){var a=D.activeElement;if(a&&a.blur&&a!==D.body)a.blur();var before=Date.now();txt.innerHTML='<span class="tll-eps-dot"></span>Saving\u2026';bar.setAttribute('data-s','busy');
    setTimeout(function(){var r=$('[data-ep-retry]');if(r)r.click();setTimeout(function(){var st=$('[data-ep-status]'),k=st&&st.getAttribute('data-state');if(k!=='busy'&&k!=='fail'){bar.setAttribute('data-s','ok');txt.innerHTML='<span class="tll-eps-dot"></span><b>Saved</b> \u00b7 '+hhmm();}},700);},80);});
  retry.addEventListener('click',function(){var r=$('[data-ep-retry]');if(r)r.click();});
  i.appendChild(txt);i.appendChild(save);i.appendChild(btn);i.appendChild(retry);bar.appendChild(i);D.body.appendChild(bar);D.body.classList.add('tll-eps-on');
  var s=$('[data-ep-status]');if(s)new MutationObserver(paint).observe(s,{attributes:true,childList:true,characterData:true,subtree:true});
  if(v)new MutationObserver(function(){btn.href=v.getAttribute('href');}).observe(v,{attributes:true,attributeFilter:['href']});
  paint();}

/* ---------- 2: keep the field being typed in still ---------- */
var anchor=null,top0=0,raf=0;
function track(){var a=D.activeElement;if(a&&a!==D.body&&a.matches&&a.matches('input,textarea,select,[contenteditable]')&&!a.closest('.tll-eps,.tll-eps-crop')){anchor=a;top0=a.getBoundingClientRect().top;}else anchor=null;}
function hold(){raf=0;if(!anchor||!anchor.isConnected)return;var t=anchor.getBoundingClientRect().top,dy=t-top0;if(Math.abs(dy)>1){window.scrollBy(0,dy);}top0=anchor.getBoundingClientRect().top;}
D.addEventListener('focusin',track);D.addEventListener('input',track,true);
addEventListener('scroll',function(){if(anchor&&!raf)top0=anchor.getBoundingClientRect().top;},{passive:true});
function watchShifts(){var root=$('main')||D.body;new MutationObserver(function(){if(anchor&&!raf)raf=requestAnimationFrame(hold);}).observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden','class','style','data-state']});}

/* ---------- 4: countries ---------- */
var ALIAS={'uk':'United Kingdom','u.k.':'United Kingdom','britain':'United Kingdom','great britain':'United Kingdom','england':'United Kingdom','scotland':'United Kingdom','wales':'United Kingdom','northern ireland':'United Kingdom',
 'usa':'United States','u.s.':'United States','u.s.a.':'United States','america':'United States','united states of america':'United States','the us':'United States','the usa':'United States',
 'uae':'United Arab Emirates','dubai':'United Arab Emirates','holland':'Netherlands','the netherlands':'Netherlands','czech republic':'Czechia','korea':'South Korea','republic of korea':'South Korea',
 'russian federation':'Russia','cote d\'ivoire':'Ivory Coast','côte d\'ivoire':'Ivory Coast','türkiye':'Turkey','turkiye':'Turkey','vatican':'Vatican City','holy see':'Vatican City','burma':'Myanmar',
 'swaziland':'Eswatini','cabo verde':'Cape Verde','macedonia':'North Macedonia','bosnia':'Bosnia and Herzegovina','drc':'DR Congo','democratic republic of the congo':'DR Congo','east timor':'Timor-Leste',
 'viet nam':'Vietnam','the bahamas':'Bahamas','the gambia':'Gambia','persia':'Iran'};
function names(){var o=D.querySelectorAll('#ep-countries option');return [].map.call(o,function(x){return x.value;}).filter(Boolean);}
function norm(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,' ');}
function resolve(q){q=norm(q);if(!q)return '';var N=names(),i;for(i=0;i<N.length;i++)if(norm(N[i])===q)return N[i];if(ALIAS[q]){var a=ALIAS[q];for(i=0;i<N.length;i++)if(N[i]===a)return a;}return '';}
function matches(q){q=norm(q);if(!q)return [];var N=names(),out=[],seen={};function add(n){if(!seen[n]){seen[n]=1;out.push(n);}}
  if(ALIAS[q])add(ALIAS[q]);N.forEach(function(n){if(norm(n).indexOf(q)===0)add(n);});N.forEach(function(n){if(out.length<8&&norm(n).indexOf(' '+q)>0)add(n);});
  Object.keys(ALIAS).forEach(function(k){if(k.indexOf(q)===0&&q.length>1)add(ALIAS[k]);});return out.slice(0,6);}
var BOXES=[['[data-ep-fromq]','[data-ep-from-add]'],['[data-ep-livedq]','[data-ep-lived-add]'],['[data-ep-deskq]','[data-ep-desk-add]']];
function wireBox(sel,addSel){var q=$(sel);if(!q||q.__tllEps)return;q.__tllEps=1;var addB=q.parentNode.querySelector(addSel)||$(addSel);
  q.removeAttribute('list');q.setAttribute('role','combobox');q.setAttribute('aria-autocomplete','list');q.setAttribute('aria-expanded','false');q.setAttribute('autocapitalize','words');
  var wrap=q.parentNode;wrap.classList.add('tll-eps-ac');var ul=el('ul','tll-eps-list');ul.id='tll-eps-l-'+(q.id||Math.random().toString(36).slice(2));ul.setAttribute('role','listbox');ul.hidden=true;q.setAttribute('aria-controls',ul.id);wrap.appendChild(ul);
  var note=el('span','tll-eps-added');note.setAttribute('role','status');note.setAttribute('aria-live','polite');wrap.parentNode.insertBefore(note,wrap.nextSibling);
  var cur=-1,picking=false,nt=0;
  function close(){ul.hidden=true;q.setAttribute('aria-expanded','false');q.removeAttribute('aria-activedescendant');cur=-1;}
  function open(list){ul.innerHTML='';if(!list.length){close();return;}list.forEach(function(n,i){var li=el('li');var b=el('button');b.type='button';b.id=ul.id+'-'+i;b.setAttribute('role','option');b.setAttribute('aria-selected','false');b.tabIndex=-1;b.textContent=n;
      b.addEventListener('pointerdown',function(e){e.preventDefault();picking=true;});b.addEventListener('click',function(){commit(n);});li.appendChild(b);ul.appendChild(li);});
    ul.hidden=false;q.setAttribute('aria-expanded','true');}
  function commit(n){picking=false;close();if(!n)return;q.value=n;if(addB)addB.click();
    setTimeout(function(){clearTimeout(nt);if(!q.value){note.textContent='Added '+n+'.';nt=setTimeout(function(){note.textContent='';},4000);}else note.textContent='';},60);}
  q.addEventListener('input',function(){note.textContent='';open(matches(q.value));});
  q.addEventListener('keydown',function(e){var bs=ul.querySelectorAll('button');if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!bs.length)return;e.preventDefault();cur=(cur+(e.key==='ArrowDown'?1:-1)+bs.length)%bs.length;
      [].forEach.call(bs,function(b,i){b.setAttribute('aria-selected',i===cur?'true':'false');});q.setAttribute('aria-activedescendant',bs[cur].id);bs[cur].scrollIntoView({block:'nearest'});}
    else if(e.key==='Enter'){var n=cur>-1&&bs[cur]?bs[cur].textContent:(resolve(q.value)||'');if(n){e.preventDefault();e.stopImmediatePropagation();commit(n);}}
    else if(e.key==='Escape'){close();}},true);
  if(addB)addB.addEventListener('click',function(e){if(e.isTrusted){var n=resolve(q.value);if(n&&n!==q.value)q.value=n;var v=q.value;setTimeout(function(){if(v&&!q.value){note.textContent='Added '+v+'.';clearTimeout(nt);nt=setTimeout(function(){note.textContent='';},4000);}},60);}},true);
  q.addEventListener('blur',function(){setTimeout(function(){if(picking)return;close();var n=resolve(q.value);if(n)commit(n);},150);});}

/* ---------- 5: photo crop ---------- */
function cropFlow(file,input){var url=URL.createObjectURL(file),img=new Image();img.onload=function(){show(img,url,input);};img.onerror=function(){URL.revokeObjectURL(url);pass(input,file);};img.src=url;}
function pass(input,file){try{var dt=new DataTransfer();dt.items.add(file);input.files=dt.files;}catch(e){}input.__tllEpsPass=1;input.dispatchEvent(new Event('change',{bubbles:true}));input.__tllEpsPass=0;}
function show(img,url,input){var back=D.activeElement,ov=el('div','tll-eps-crop'),card=el('div','tll-eps-card');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','tll-eps-ch');
  card.innerHTML='<h2 id="tll-eps-ch">Place your photo</h2><p>Drag to move it, zoom to fit. The circle is what shows on your card.</p>';
  var st=el('div','tll-eps-stage'),cv=el('canvas');cv.width=720;cv.height=720;st.appendChild(cv);st.tabIndex=0;st.setAttribute('aria-label','Photo position. Arrow keys move it, plus and minus zoom.');
  var zw=el('label','tll-eps-zoom');zw.innerHTML='<span>Zoom</span>';var z=el('input');z.type='range';z.min='1';z.max='3';z.step='0.01';z.value='1';z.setAttribute('aria-label','Zoom');zw.appendChild(z);
  var acts=el('div','tll-eps-acts'),cancel=el('button','tll-eps-btn tll-eps-btn--ghost'),use=el('button','tll-eps-btn');cancel.type=use.type='button';cancel.textContent='Cancel';use.textContent='Use photo';acts.appendChild(cancel);acts.appendChild(use);
  card.appendChild(st);card.appendChild(zw);card.appendChild(acts);ov.appendChild(card);D.body.appendChild(ov);
  var W=img.naturalWidth,H=img.naturalHeight,base=Math.max(720/W,720/H),s=base,x=(720-W*s)/2,y=(720-H*s)/2,ctx=cv.getContext('2d');
  function clamp(){var w=W*s,h=H*s;x=Math.min(0,Math.max(720-w,x));y=Math.min(0,Math.max(720-h,y));}
  function draw(){clamp();ctx.fillStyle='#0A0B14';ctx.fillRect(0,0,720,720);ctx.drawImage(img,x,y,W*s,H*s);}
  function zoomTo(ns,cx,cy){ns=Math.max(base,Math.min(base*3,ns));cx=cx==null?360:cx;cy=cy==null?360:cy;x=cx-(cx-x)*ns/s;y=cy-(cy-y)*ns/s;s=ns;z.value=String(s/base);draw();}
  draw();var pts={},startD=0,startS=s;
  function scale(){return 720/st.getBoundingClientRect().width;}
  st.addEventListener('pointerdown',function(e){st.setPointerCapture(e.pointerId);pts[e.pointerId]={x:e.clientX,y:e.clientY};var k=Object.keys(pts);if(k.length===2){var a=pts[k[0]],b=pts[k[1]];startD=Math.hypot(a.x-b.x,a.y-b.y);startS=s;}});
  st.addEventListener('pointermove',function(e){var p=pts[e.pointerId];if(!p)return;var k=Object.keys(pts),f=scale();
    if(k.length===2){p.x=e.clientX;p.y=e.clientY;var a=pts[k[0]],b=pts[k[1]],d=Math.hypot(a.x-b.x,a.y-b.y);if(startD)zoomTo(startS*d/startD);return;}
    x+=(e.clientX-p.x)*f;y+=(e.clientY-p.y)*f;p.x=e.clientX;p.y=e.clientY;draw();});
  function up(e){delete pts[e.pointerId];startD=0;}st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
  st.addEventListener('wheel',function(e){e.preventDefault();zoomTo(s*(e.deltaY<0?1.06:1/1.06));},{passive:false});
  z.addEventListener('input',function(){zoomTo(base*parseFloat(z.value));});
  st.addEventListener('keydown',function(e){var m={ArrowLeft:[12,0],ArrowRight:[-12,0],ArrowUp:[0,12],ArrowDown:[0,-12]}[e.key];if(m){e.preventDefault();x+=m[0];y+=m[1];draw();}else if(e.key==='+'||e.key==='='){zoomTo(s*1.06);}else if(e.key==='-'){zoomTo(s/1.06);}});
  function done(){ov.remove();URL.revokeObjectURL(url);D.removeEventListener('keydown',esc,true);if(back&&back.focus)back.focus();}
  function esc(e){if(e.key==='Escape'){e.preventDefault();done();input.value='';}if(e.key==='Tab'){var f=[st,z,cancel,use],i=f.indexOf(D.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();use.focus();}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();st.focus();}}}
  D.addEventListener('keydown',esc,true);
  cancel.addEventListener('click',function(){done();input.value='';});
  use.addEventListener('click',function(){var out=el('canvas');out.width=out.height=1080;var o=out.getContext('2d'),k=1080/720;o.fillStyle='#FFFFFF';o.fillRect(0,0,1080,1080);o.drawImage(img,x*k,y*k,W*s*k,H*s*k);
    out.toBlob(function(b){done();if(!b)return;var f=new File([b],'profile-photo.jpg',{type:'image/jpeg'});pass(input,f);},'image/jpeg',.9);});
  setTimeout(function(){st.focus();},30);}
D.addEventListener('change',function(e){var t=e.target;if(!t||t.id!=='ep-f-photo'||t.__tllEpsPass)return;var f=t.files&&t.files[0];if(!f||!/^image\//.test(f.type||'image/'))return;
  e.stopImmediatePropagation();e.preventDefault();cropFlow(f,t);},true);

function run(){if(!D.getElementById('tll-ep-ux-v1')){var s=el('style');s.id='tll-ep-ux-v1';s.textContent=CSS;D.head.appendChild(s);}
  buildBar();watchShifts();BOXES.forEach(function(b){wireBox(b[0],b[1]);});
  /* boxes the page draws later (the expat desks open when Live there is switched on) */
  new MutationObserver(function(){BOXES.forEach(function(b){wireBox(b[0],b[1]);});}).observe(D.body,{childList:true,subtree:true});}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',run);else run();
})();

/* tll-submit-ux-v1 (29 Oct 2026, tester Luke via Nancy: "I couldn't find a clear way to insert headings"). /submit story editor: the
   toolbar buttons read B, I, H, a curly quote and an arrow; the subhead button was there but not readable as one. Each button now shows
   its word (Bold, Italic, Subhead, Quote, Link) and a line under the toolbar says how. Namespaced tll-su-; nothing removed. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/submit')return;
var WORDS={bold:'Bold',italic:'Italic',h2:'Subhead',blockquote:'Quote',createLink:'Link'};
var CSS=".tsv5-tools .tll-su-w{font:600 13px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;letter-spacing:0;margin-left:6px;text-transform:none}"+
".tsv5-tools .tsv5-tool{width:auto!important;min-width:44px;padding:0 10px!important;display:inline-flex;align-items:center}"+
".tsv5-tools{flex-wrap:wrap;gap:6px}"+
".tll-su-hint{margin:6px 0 0;font-size:13px;line-height:1.4;color:#5F5A54}";
function run(){var t=document.querySelector('.tsv5-tools');if(!t||t.dataset.tllSu)return;t.dataset.tllSu='1';
  var s=document.createElement('style');s.id='tll-submit-ux-v1';s.textContent=CSS;document.head.appendChild(s);
  [].forEach.call(t.querySelectorAll('.tsv5-tool'),function(b){var k=b.getAttribute('data-arg')||b.getAttribute('data-cmd'),w=WORDS[k];if(!w)return;
    var g=b.firstChild;if(g&&g.nodeType===3){var sp=document.createElement('span');sp.setAttribute('aria-hidden','true');sp.textContent=g.nodeValue;b.replaceChild(sp,g);}
    var l=document.createElement('span');l.className='tll-su-w';l.textContent=w;b.appendChild(l);});
  var h=document.createElement('p');h.className='tll-su-hint';h.textContent='Put the cursor on a line and tap Subhead to make it a heading.';t.insertAdjacentElement('afterend',h);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

(function(){if(!/^\/stories\/[^/]+\/?$/.test(location.pathname))return;if(document.getElementById('tll-mag-story-v1'))return;
if(!document.querySelector('link[href="'+"https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Inter+Tight:wght@400;500;600&display=swap"+'"]')){var f=document.createElement('link');f.rel='stylesheet';f.href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Inter+Tight:wght@400;500;600&display=swap";(document.head||document.documentElement).appendChild(f);}
function place(){var s=document.createElement('style');s.id='tll-mag-story-v1';s.textContent="/* The magazine story page, layer v1 (26 Oct 2026). handoff/CREATIVE-DIRECTION-2026-10-26.md, direction A with the stamp, Newsreader.\n   Loads after tll-v9-j13-v1 (head) and before tll-st3-story-v1 (footer) and overrides both by specificity and !important.\n   Restyles only: no element is removed, no binding changes, no data-* hook moves except the two the script makes (the hero caption\n   under the photo and the author row into the head). Rose means \"you can press this\". One gutter, one radius, one measure. */\n:root{--st3-f-head:'Newsreader',Georgia,serif;--st3-f-body:'Inter Tight',system-ui,sans-serif;\n  --mg-ink:#0A0B14;--mg-cream:#F7F1E8;--mg-paper:#FDF9F3;--mg-line:#D8D0C4;--mg-text:#2a2a2a;--mg-muted:#6B6660;--mg-rose:#C8325B;--mg-teal:#067A79;\n  --mg-head:'Newsreader',Georgia,serif;--mg-text-f:'Inter Tight',system-ui,sans-serif;--mg-m:16px;--mg-r:4px}\n@media(min-width:900px){:root{--mg-m:40px}}\n.tll-story-article{font-family:var(--mg-text-f)}\n\n/* the head: words first, then the photo, then its caption */\n.tll-story-hero{display:flex !important;flex-direction:column !important;align-items:stretch !important;min-height:0 !important;background:var(--mg-cream) !important;padding:0 0 8px !important;overflow:visible !important}\n.tll-story-hero-overlay{order:-1;position:static !important;min-height:0 !important;background:none !important;display:block !important;padding:0 !important}\n.tll-story-hero-content{display:grid;grid-template-columns:minmax(0,1fr);row-gap:0;max-width:1280px !important;padding:28px var(--mg-m) 24px !important}\n.tll-story-hero-content>*{grid-column:1;min-width:0}\n.tll-mg-fig{position:relative;width:calc(100% - 2*var(--mg-m));max-width:1200px;margin:0 auto}\n.tll-story-hero-img{position:relative !important;inset:auto !important;display:block;width:100% !important;height:auto !important;max-height:85vh;aspect-ratio:auto;object-fit:cover !important;margin:0 !important;border-radius:var(--mg-r);transform:none !important}\n.tll-mg-cap{display:flex;justify-content:space-between;gap:16px;margin:10px 0 0;font:400 13px/1.4 var(--mg-text-f);color:var(--mg-muted)}\n.tll-mg-cap b{font-weight:500;color:var(--mg-ink)}\n.tll-mg-cap:empty{display:none}\n.tll-story-hero [data-tll-breadcrumb]{display:flex;flex-wrap:wrap;align-items:center;font:500 13px/1.4 var(--mg-text-f) !important;color:var(--mg-muted) !important;margin:0 0 10px !important;letter-spacing:0 !important;text-transform:none !important}\n.tll-story-hero [data-tll-breadcrumb] a{display:inline-flex;align-items:center;min-height:44px;color:var(--mg-muted) !important;text-decoration:none}\n.tll-story-hero [data-tll-breadcrumb] span{color:var(--mg-line) !important;margin:0 6px}\n.tll-story-hero .tll-story-meta-row{display:flex !important;flex-wrap:wrap;gap:0 8px;margin:0 !important;background:none !important;padding:0 !important;border-radius:0 !important;backdrop-filter:none !important}\n.tll-story-hero .tll-story-meta-row .tll-eyebrow-teal{font:500 13px/1.4 var(--mg-text-f) !important;letter-spacing:.06em !important;text-transform:uppercase !important;color:var(--mg-rose) !important;background:none !important;border:0 !important;padding:0 !important;margin:0 !important;border-radius:0 !important}\n.tll-story-hero .tll-story-meta-row .tll-story-meta-divider:has(+ .w-dyn-bind-empty),.tll-story-hero .tll-story-meta-row .tll-story-meta-divider:has(+ .tll-story-reading-time){display:none !important}\n.tll-story-hero .tll-story-meta-row .tll-eyebrow-teal img{display:none !important}\n.tll-story-hero .tll-story-meta-divider{color:var(--mg-rose) !important;font:500 13px/1.4 var(--mg-text-f) !important;width:auto !important;height:auto !important;margin:0 !important;padding:0 !important;background:none !important;border:0 !important;opacity:1 !important}\n.tll-story-hero .tll-story-meta-divider:empty::before{content:\"\\00b7\"}\n.tll-story-hero .tll-story-reading-time{display:none !important}\nh1.tll-story-title{font-family:var(--mg-head) !important;font-weight:500 !important;font-size:clamp(38px,9.5vw,52px) !important;line-height:1 !important;letter-spacing:-.02em !important;color:var(--mg-ink) !important;text-shadow:none !important;margin:14px 0 0 !important;text-wrap:balance;max-width:none !important}\n.tll-story-excerpt{font-family:var(--mg-head) !important;font-weight:400 !important;font-size:21px !important;line-height:1.4 !important;color:var(--mg-text) !important;max-width:44ch !important;margin:18px 0 0 !important;font-variation-settings:\"opsz\" 24}\n.tll-story-hero .tll-story-author-top{display:none !important}\n.tll-story-hero [data-tll-hero-caption]{display:none !important}\n/* the byline, moved into the head by the script */\n.tll-story-hero-content .st3-author{margin:24px 0 0 !important;padding:0 !important;border:0 !important}\n.tll-story-hero-content .st3-author-avatar{width:44px;height:44px;border:0}\n.tll-story-hero-content .st3-author-name{font:500 16px/1.3 var(--mg-text-f);color:var(--mg-ink)}\n.tll-story-hero-content .st3-author-name::after{content:none}\n.tll-story-hero-content .st3-author-filed{font:400 14px/1.4 var(--mg-text-f);letter-spacing:0;text-transform:none;color:var(--mg-muted);margin-top:2px}\n.tll-story-hero-content .st3-author-filed [data-st3-loc]{text-transform:capitalize}\n.tll-mg-stamp{position:absolute;right:12px;top:12px;width:96px;color:var(--mg-cream);opacity:.95}\n.tll-mg-stamp svg{display:block;width:100%;height:auto}\n@media(min-width:900px){\n  .tll-story-hero-content{padding:48px var(--mg-m) 32px !important}\n  .tll-mg-stamp{width:150px;right:24px;top:24px}\n  h1.tll-story-title{font-size:clamp(52px,5.4vw,80px) !important;line-height:.98 !important;max-width:16ch !important}\n  .tll-story-excerpt{font-size:24px !important}\n  .tll-story-hero-img{max-height:min(85vh,820px)}\n}\n\n/* the reading column */\n.tll-story-body-section{padding-top:40px !important}\n.tll-story-body>.st3-from{font:400 14px/1.5 var(--mg-text-f);color:var(--mg-muted)}\n.tll-story-body>.st3-from a{color:var(--mg-ink);text-decoration:underline;text-decoration-color:var(--mg-rose);text-underline-offset:3px}\n.tll-story-body>.st3-lede{display:none !important}\n.tll-story-body>.w-richtext.tll-body{font-family:var(--mg-head) !important;font-size:19px !important;line-height:1.6 !important;color:var(--mg-text) !important;font-variation-settings:\"opsz\" 16}\n.tll-story-body>.w-richtext.tll-body p{margin:0 0 1.2em}\n.tll-story-body>.w-richtext.tll-body>p:first-child::first-letter{font-size:3.6em;line-height:.85;float:left;padding:.08em .1em 0 0;color:var(--mg-ink);font-weight:500}\n.tll-story-body>.w-richtext.tll-body h2,.tll-story-body>.w-richtext.tll-body h3{font-family:var(--mg-head);font-weight:500;font-size:28px;line-height:1.1;letter-spacing:-.015em;margin:1.4em 0 .5em;color:var(--mg-ink)}\n.tll-story-body>.w-richtext.tll-body h3{font-size:24px}\n.tll-story-body>.w-richtext.tll-body a{color:var(--mg-ink);text-decoration:underline;text-decoration-color:var(--mg-rose);text-decoration-thickness:2px;text-underline-offset:4px}\n.tll-story-body>.tll-story-pullquote{background:none !important;border:0 !important;border-left:3px solid var(--mg-rose) !important;border-radius:0 !important;padding:0 0 0 20px !important;margin:8px 0 32px !important;font-family:var(--mg-head) !important;font-style:normal !important;font-weight:400 !important;font-size:26px !important;line-height:1.25 !important;letter-spacing:-.01em;color:var(--mg-ink) !important}\n.tll-story-body>.tll-aeo-box{background:var(--mg-paper) !important;border:1px solid var(--mg-line) !important;border-radius:var(--mg-r) !important;padding:24px 20px !important}\n.tll-story-body>.tll-aeo-box .tll-aeo-eyebrow{font:500 24px/1.1 var(--mg-head) !important;letter-spacing:-.015em !important;text-transform:none !important;color:var(--mg-ink) !important;margin:0 0 6px !important}\n.tll-story-body>.tll-aeo-box .w-richtext{font-family:var(--mg-text-f) !important;font-size:16px !important;line-height:1.55 !important;color:var(--mg-text) !important}\n.tll-story-body>.tll-aeo-box .w-richtext p{margin:12px 0 0}\n.tll-story-body>.tll-aeo-box .w-richtext p strong{display:block;font-family:var(--mg-head);font-weight:500;font-size:19px;color:var(--mg-ink);letter-spacing:-.01em;margin-top:8px}\n[data-tll-links-card]>:first-child{font:500 12px/1.4 var(--mg-text-f) !important;letter-spacing:.06em !important;text-transform:uppercase !important;color:var(--mg-muted) !important}\n[data-tll-links-card] .w-richtext a{text-decoration-color:var(--mg-rose) !important}\n.tll-story-share-row .tll-story-share-label{font:500 12px/1.4 var(--mg-text-f) !important;letter-spacing:.06em;color:var(--mg-muted) !important}\n.tll-story-share-row .tll-story-share-link{font:500 14px/1 var(--mg-text-f) !important;border-radius:var(--mg-r) !important}\n\n/* after the story: same type, rose for taps */\n.tll-eyebrow-teal,.tll-eyebrow-rose,.tll-aeo-eyebrow,[data-tll-places] [data-tll-places-label],[data-tll-ledger] .tll-sl-title,[data-tll-ledger] .tll-ledger-k,.st3-tw-h,.st3-cc-badge,.st3-aff-k,.st3-trip-k,.st3-trip-by,.st3-author-filed,[data-tll-places] [data-tll-places-note]{font-family:var(--mg-text-f) !important;letter-spacing:.06em !important}\n.tll-story-aftermatter .tll-related-header .tll-eyebrow-teal,.tll-story-feedback .tll-eyebrow-teal{font:500 12px/1.4 var(--mg-text-f) !important;letter-spacing:.06em !important;color:var(--mg-muted) !important}\n.tll-story-aftermatter .tll-related-header h2{font-family:var(--mg-head) !important;font-weight:500 !important;letter-spacing:-.02em;font-size:clamp(30px,4vw,44px) !important;line-height:1.05 !important}\n.tll-story-aftermatter .tll-related-header h2 .tll-text-rose{color:inherit !important;font-style:italic}\n.tll-related-card{text-decoration:none !important;color:var(--mg-ink) !important}\n.tll-related-img-wrap{border-radius:var(--mg-r);overflow:hidden}\n.tll-related-loc{font:500 12px/1.4 var(--mg-text-f) !important;letter-spacing:.06em !important;text-transform:uppercase !important;color:var(--mg-muted) !important;margin-top:12px}\n.tll-related-headline{font-family:var(--mg-head) !important;font-weight:500 !important;font-size:22px !important;line-height:1.12 !important;letter-spacing:-.015em !important;color:var(--mg-ink) !important;margin:6px 0 0 !important}\n.tll-related-meta{font:400 13px/1.4 var(--mg-text-f) !important;color:var(--mg-muted) !important}\n.st3-cc-name{font-weight:500 !important;letter-spacing:-.02em !important}\n.st3-cc-avatar,.st3-author-avatar{border-color:var(--mg-line) !important}\n.st3-cc-link,.st3-author-name{color:var(--mg-ink) !important;text-decoration-color:var(--mg-rose) !important}\n[data-tll-story-cta]>div:first-child>div:first-child{font-weight:500 !important;letter-spacing:-.015em !important}\n.st3-trip-h,[data-tll-ledger] .tll-sl-title{font-weight:500 !important}\n[data-tll-ledger] .tll-ledger-note a,.tll-feedback-link{text-decoration-color:var(--mg-rose) !important}\n.tll-story-feedback p{font-family:var(--mg-text-f)}\n.tll-story-article a:focus-visible,.tll-story-article button:focus-visible{outline-color:var(--mg-rose) !important}\n/* 26 Oct, from Nancy's subdomain check: spacing, the From line, the invite, the sign-off, inline photos and the gallery */\n.tll-story-body>.st3-from{margin:0 0 28px !important}\n.tll-story-body>.st3-from [data-st3-from-part=\"city\"]:not(:empty)::after{content:\", \"}\n.tll-story-body>.st3-from a+a:not(:empty)::before,.tll-story-body>.st3-from [data-st3-from-part=\"pursuit\"]:not(:empty)::before{content:\"\\00b7\";color:var(--mg-muted);text-decoration:none;display:inline-block;margin:0 .45em}\n.tll-story-body>.st3-from a.w-dyn-bind-empty,.tll-story-body>.st3-from a:empty{display:none}\n.tll-story-body>.w-richtext.tll-body{margin-bottom:40px !important}\n.tll-story-body .tll-persp-ask{margin:0 0 32px !important;padding:24px 0 0 !important;border-top:1px solid var(--mg-line) !important;font:400 16px/1.5 var(--mg-text-f) !important;color:var(--mg-text) !important}\n.tll-story-body .tll-persp-ask b{font-weight:500;color:var(--mg-ink)}\n.tll-story-body .tll-persp-ask a{color:var(--mg-ink) !important;font-weight:500 !important;text-decoration:underline !important;text-decoration-color:var(--mg-rose) !important;text-decoration-thickness:2px !important;text-underline-offset:4px !important;display:inline-flex;align-items:center;min-height:44px}\n.tll-story-body>.tll-aeo-box,.tll-story-body>[data-tll-links-card]{margin:0 0 32px !important}\n.tll-story-body .tll-signoff{margin:8px 0 40px !important;padding:28px 0 0 !important;border-top:1px solid var(--mg-line) !important;color:var(--mg-ink) !important}\n.tll-story-body .tll-signoff-rule{width:40px;height:3px;background:var(--mg-rose) !important;border-radius:0;margin:0 0 14px}\n.tll-story-body .tll-signoff-label{font:500 12px/1.4 var(--mg-text-f) !important;letter-spacing:.06em;text-transform:uppercase;color:var(--mg-muted) !important}\n.tll-story-body .tll-signoff-name{font:500 28px/1.1 var(--mg-head) !important;letter-spacing:-.02em;color:var(--mg-ink) !important;margin:6px 0 4px}\n.tll-story-body .tll-signoff-loc{font:italic 400 17px/1.4 var(--mg-head) !important;color:var(--mg-text) !important}\n.tll-story-body .tll-story-share-row{margin:0 0 8px}\n.tll-story-body .tll-inline-photo{margin:2em 0 2.4em !important;max-width:none !important;width:auto !important;padding:0}\n.tll-story-body .tll-inline-photo a{display:block;border-radius:var(--mg-r);overflow:hidden}\n.tll-story-body .tll-inline-photo img{display:block;width:100%;height:auto;max-height:none;object-fit:cover;border-radius:var(--mg-r)}\n.tll-story-body .tll-inline-photo figcaption{font:400 13px/1.45 var(--mg-text-f);color:var(--mg-muted);margin:10px 0 0;text-wrap:pretty}\n@media(min-width:900px){.tll-story-body .tll-inline-photo{margin:2.4em calc(-1*min(6vw,100px)) 2.8em !important}.tll-story-body .tll-inline-photo figcaption{padding:0 min(6vw,100px)}}\n.tll-story-gallery{background:var(--mg-cream) !important;padding:48px 0 56px !important}\n.tll-gallery-inner{max-width:1200px !important;padding:0 var(--mg-m) !important}\n.tll-gallery-label{font:500 28px/1.1 var(--mg-head) !important;letter-spacing:-.02em !important;text-transform:none !important;color:var(--mg-ink) !important;margin:0 0 20px !important}\n.tll-gallery-grid{display:grid !important;grid-template-columns:repeat(2,1fr) !important;gap:8px !important}\n@media(min-width:600px){.tll-gallery-grid{grid-template-columns:repeat(3,1fr) !important;gap:12px !important}}\n@media(min-width:900px){.tll-gallery-grid{grid-template-columns:repeat(4,1fr) !important}}\n.tll-gallery-link{display:block;border-radius:var(--mg-r);overflow:hidden;background:var(--mg-ink2)}\n.tll-gallery-img{width:100% !important;height:auto !important;aspect-ratio:1 !important;object-fit:cover !important;border-radius:0 !important;display:block}\n.tll-story-aftermatter{padding-top:48px !important}\n.tll-aftermatter-container{gap:36px !important}\n";document.body.appendChild(s);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();
/* Three small moves the CSS cannot make: the hero caption goes under the photo with the writer's credit, the author row (the bound
   byline) moves into the head with the reading time, and the stamp is drawn from the story's byline location (the data-st3-byline attribute, as the st3 script reads it; the span's own text is the contributor's home), the date and the pillar.
   Nothing is deleted; the caption element is hidden, not removed. Runs once. */
(function(){
var SVG='<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><defs><filter id="tll-mg-ink" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter><path id="tll-mg-top" d="M30,100 A70,70 0 1,1 170,100"/><path id="tll-mg-bottom" d="M34,100 A66,66 0 0,0 166,100"/></defs><g filter="url(#tll-mg-ink)"><g fill="none" stroke="currentColor"><circle cx="100" cy="100" r="94" stroke-width="3"/><circle cx="100" cy="100" r="86" stroke-width="1.2"/><circle cx="100" cy="100" r="58" stroke-width="1.2"/></g><g fill="currentColor" font-family="\'JetBrains Mono\',ui-monospace,monospace" text-anchor="middle"><text font-size="12.5" font-weight="600" letter-spacing="3"><textPath href="#tll-mg-top" startOffset="50%">THAT LAYOVER LIFE</textPath></text><text font-size="9" letter-spacing="1.4"><textPath href="#tll-mg-bottom" startOffset="50%">{A}</textPath></text><text x="100" y="82" font-size="8" letter-spacing="3" font-weight="600">TLL</text><text x="100" y="106" font-size="{S}" font-weight="600" letter-spacing="1">{P}</text><text x="100" y="124" font-size="9.5" letter-spacing="2">{D}</text></g></g></svg>';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function txt(el){return el&&!el.classList.contains('w-dyn-bind-empty')?el.textContent.trim():'';}
function run(){
  var hero=document.querySelector('.tll-story-hero'),c=hero&&hero.querySelector('.tll-story-hero-content');
  if(!c||c.dataset.tllMag)return;c.dataset.tllMag='1';
  var img=hero.querySelector('.tll-story-hero-img'),cap=hero.querySelector('[data-tll-hero-caption]'),by=txt(document.querySelector('.st3-author-name'));
  if(img){var f=document.createElement('div');f.className='tll-mg-cap';var ct=cap?txt(cap.querySelector('div')||cap):'';
    if(ct){var s=document.createElement('span');s.textContent=ct;f.appendChild(s);}
    if(by){var cr=document.createElement('span');var b=document.createElement('b');b.textContent='Photo';cr.appendChild(b);cr.appendChild(document.createTextNode(' '+by));f.appendChild(cr);}
    var fig=document.createElement('figure');fig.className='tll-mg-fig';img.parentNode.insertBefore(fig,img);fig.appendChild(img);if(f.childNodes.length)fig.appendChild(f);}
  var a=document.querySelector('.st3-author');
  if(a){var mins=document.querySelector('.tll-story-reading-time'),m=txt(mins).match(/\d+/),w=a.querySelector('[data-st3-when]');
    if(m&&w){var sp=document.createElement('span');sp.className='tll-mg-mins';sp.textContent=' · '+m[0]+' min read';w.insertAdjacentElement('afterend',sp);}
    c.appendChild(a);}
  var L=document.querySelector('[data-st3-loc]'),loc=(L&&(L.getAttribute('data-st3-byline')||L.getAttribute('data-st3-country-name')||'').trim())||txt(L)||txt(document.querySelector('.tll-story-meta-row .tll-eyebrow-teal'));
  var place=(loc.split(',')[0]||'').trim().toUpperCase().slice(0,16);
  var when=txt(document.querySelector('[data-st3-when]')),d=when.match(/(\d{1,2}) (\w{3})\w* (\d{4})/)||when.match(/(\w{3})\w* (\d{1,2}),? (\d{4})/);
  var date=d?(d[0].match(/^\d/)?(('0'+d[1]).slice(-2)+' '+d[2].toUpperCase()+' '+d[3]):(('0'+d[2]).slice(-2)+' '+d[1].toUpperCase()+' '+d[3])):'';
  var pills=document.querySelectorAll('.tll-story-meta-row .tll-eyebrow-teal'),pill=pills.length>1?txt(pills[1]).toUpperCase():'';
  var arc=pill||'BY THE PEOPLE WHO WENT';
  var le=document.querySelector('.st3-author-filed [data-st3-loc]');if(le&&le.textContent===le.textContent.toUpperCase())le.textContent=le.textContent.toLowerCase().replace(/(^|[\s-])([a-z])/g,function(m,a,b){return a+b.toUpperCase();});
  if(place){var st=document.createElement('span');st.className='tll-mg-stamp';st.setAttribute('aria-hidden','true');
    st.innerHTML=SVG.replace('{P}',esc(place)).replace('{S}',place.length>10?'12':'16').replace('{D}',esc(date)).replace('{A}',esc(arc));var fg=hero.querySelector('.tll-mg-fig');(fg||c).appendChild(st);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* Captions under inline photos, from the photo's own CMS alt text (never invented). The photos are placed by a later script, so this watches for them. */
(function(){function cap(){var n=0;[].forEach.call(document.querySelectorAll('.tll-story-body figure.tll-inline-photo'),function(f){if(f.querySelector('figcaption'))return;var im=f.querySelector('img'),a=im&&(im.getAttribute('alt')||'').trim();if(!a||/^[a-z0-9-]+$/.test(a)&&a.indexOf(' ')<0)return;var c=document.createElement('figcaption');c.textContent=a;f.appendChild(c);n++;});return n;}
function arm(){cap();var b=document.querySelector('.tll-story-body');if(!b||!('MutationObserver' in window))return;var mo=new MutationObserver(function(){cap();});mo.observe(b,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();},15000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arm);else arm();window.addEventListener('load',cap);})();
})();
(function(){if(!/^\/(index\.html)?$/.test(location.pathname))return;if(document.getElementById('tll-mag-cover-v1'))return;
if(!document.querySelector('link[href="'+"https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Inter+Tight:ital,wght@0,400;0,500;0,600;1,400&display=swap"+'"]')){var f=document.createElement('link');f.rel='stylesheet';f.href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Inter+Tight:ital,wght@0,400;0,500;0,600;1,400&display=swap";(document.head||document.documentElement).appendChild(f);}
/* F1: the style goes in at once, so the cover is styled from the first paint; it moves to the end of the body once the page is parsed, as in v9 to v15. */
var CS=document.createElement('style');CS.id='tll-mag-cover-v1';CS.textContent="/* The magazine cover (26 Oct 2026, direction A, Nancy: \"I prefer the full page image hero\"). Home page only. Restyles the existing\n   [data-h3-hero] block: the cover story's photo full bleed, a chip with the writer's face (\"{Name} went to {Place}\"), the kicker,\n   the site's own headline in Newsreader, the deck, a button to the cover story and a Join free button (29 Oct), the photo credit with coordinates, and the stamp,\n   which lands once on load. No element removed: the eyebrow, the FREE line and the old coordinates are hidden.\n   Loads after the page's own styles and after tll-home-hero-phone-v1, so it wins the cascade with the same specificity. */\nbody:not(.tll-none) [data-h3-hero]{position:relative !important;min-height:max(calc(100svh - 96px),640px) !important;display:flex !important;flex-direction:column !important;justify-content:flex-end !important;margin:0 !important;padding:0 !important;border:0 !important;border-radius:0 !important;overflow:hidden !important;background:#0A0B14 !important;--tll-cover-pos:var(--tll-cover-pos-phone,50% 50%)}\nbody:not(.tll-none) [data-h3-hero] > img[data-tll-parallax=\"hero\"]{position:absolute !important;inset:0 !important;top:calc(-1 * var(--tll-cover-zoom,0%)) !important;bottom:auto !important;width:100% !important;height:calc(100% + var(--tll-cover-zoom,0%)) !important;max-width:none !important;object-fit:cover !important;object-position:var(--tll-cover-pos) !important;border-radius:0 !important;transform:none !important;opacity:1 !important;filter:none !important}\nbody:not(.tll-none) [data-h3-hero]::after{content:\"\" !important;position:absolute !important;inset:0 !important;z-index:1 !important;pointer-events:none !important;background:linear-gradient(180deg,rgba(10,11,20,.4) 0%,rgba(10,11,20,0) 22%,rgba(10,11,20,.05) 52%,rgba(10,11,20,.5) 70%,rgba(10,11,20,.9) 100%) !important}\nbody:not(.tll-none) [data-h3-hero] > div:has(> h1){position:relative !important;z-index:2 !important;width:100% !important;max-width:none !important;margin:0 !important;padding:0 16px max(clamp(40px,8vh,80px),76px) !important;box-sizing:border-box !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-eyebrow{display:none !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip{display:inline-flex !important;align-items:center;gap:10px;padding:6px 14px 6px 6px;min-height:48px;border-radius:999px;background:rgba(10,11,20,.6);color:#F7F1E8 !important;text-decoration:none !important;font:400 13px/1.2 'Inter Tight',system-ui,sans-serif;margin:0 0 18px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);max-width:100%}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip img{width:36px;height:36px;border-radius:50%;object-fit:cover;flex:0 0 36px;position:static;box-shadow:0 0 0 1.5px #F0507A}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip b{display:block;font-weight:500;font-size:15px}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip:hover b,body:not(.tll-none) [data-h3-hero] .tll-mg-chip:focus-visible b{text-decoration:underline;text-decoration-color:#F0507A;text-underline-offset:3px}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip:focus-visible{outline:3px solid #F0507A;outline-offset:2px}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-kicker{display:block !important;font:500 13px/1.3 'Inter Tight',system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#F7F1E8;opacity:.85;margin:0 0 12px}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title){font-family:'Newsreader',Georgia,serif !important;font-weight:500 !important;font-size:clamp(46px,12vw,64px) !important;line-height:.95 !important;letter-spacing:-.02em !important;max-width:12ch !important;margin:0 !important;padding:0 !important;color:#F7F1E8 !important;text-wrap:balance}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) em{font-style:italic;color:inherit}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p{font-family:'Inter Tight',system-ui,sans-serif !important;font-size:19px !important;line-height:1.45 !important;max-width:36ch !important;margin:16px 0 0 !important;color:#E8E2D8 !important;text-wrap:pretty}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta{display:flex !important;flex-direction:column !important;gap:12px !important;margin:24px 0 0 !important;position:relative;z-index:3}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn{flex:none !important;width:100% !important;min-height:48px !important;box-sizing:border-box !important;justify-content:center !important;border-radius:0 !important;font:600 16px/1 'Inter Tight',system-ui,sans-serif !important;letter-spacing:0 !important;background:#D63859 !important;color:#fff !important;border-color:transparent !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn:hover{background:#B82C4B !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn:focus-visible{outline:3px solid #F7F1E8 !important;outline-offset:2px}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn.tll-mg-join{background:transparent !important;color:#F7F1E8 !important;border:1.5px solid #F7F1E8 !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn.tll-mg-join:hover{background:#F7F1E8 !important;color:#0D0F1A !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn + .h3-btn:not(.tll-mg-join){display:none !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-free{display:none !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-coords,body:not(.tll-none) [data-h3-hero] > div:has(> .h3-hero-coords){display:none !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-by{position:relative;z-index:2;margin:14px 0 0 !important;font:400 13px/1.5 'Inter Tight',system-ui,sans-serif;color:#B9B3A8}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-by b{color:#F7F1E8;font-weight:500}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-stamp{position:absolute !important;right:16px !important;left:auto !important;top:20px !important;bottom:auto !important;width:96px;z-index:2;color:#F7F1E8;opacity:.95;transform-origin:50% 50%;animation:tllMgLand 420ms cubic-bezier(.2,.9,.3,1.2) 250ms both;pointer-events:none}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-stamp svg{display:block;width:100%;height:auto}\n@keyframes tllMgLand{from{opacity:0;transform:scale(1.6) rotate(-14deg)}to{opacity:.95;transform:none}}\n@media(prefers-reduced-motion:reduce){body:not(.tll-none) [data-h3-hero] .tll-mg-stamp{animation:none}}\n@media(min-width:768px){\nbody:not(.tll-none) [data-h3-hero]{min-height:min(88vh,860px) !important;--tll-cover-pos:var(--tll-cover-pos-desk,50% 50%);--tll-cover-zoom:0%}\nbody:not(.tll-none) [data-h3-hero]::after{background:linear-gradient(180deg,rgba(10,11,20,.4) 0%,rgba(10,11,20,0) 22%,rgba(10,11,20,.1) 50%,rgba(10,11,20,.72) 72%,rgba(10,11,20,.94) 100%) !important}\nbody:not(.tll-none) [data-h3-hero] > div:has(> h1){max-width:1240px !important;margin:0 auto !important;padding:0 var(--h3-g,48px) 56px !important}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title){font-size:clamp(56px,6vw,96px) !important}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p{font-size:20px !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta{flex-direction:row !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn{width:auto !important;min-width:240px;padding:0 28px !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-stamp{width:150px;right:var(--h3-g,48px);top:32px}\n}\n\n/* The magazine type on the rest of the home page (26 Oct 2026, direction A: Newsreader for display, Inter Tight for text, the\n   monospace only inside the stamp). The h3 sections read their faces from three variables, so one override switches them all;\n   the weights come down from Playfair's 800 to Newsreader's 500 and the tracking on the small caps comes in. */\n:root{--h3-head:'Newsreader',Georgia,serif;--h3-body:'Inter Tight',system-ui,sans-serif;--h3-mono:'Inter Tight',system-ui,sans-serif}\n.h3 [class*=\"h3-title\"]{font-weight:500 !important;letter-spacing:-.02em !important}\n.h3-card-title{font-weight:500 !important;letter-spacing:-.01em !important;font-size:clamp(22px,1.9vw,30px) !important;line-height:1.1 !important}\n.h3-ey,.h3-card-meta,.h3-card-tag,.h3-shelf-note,.h3-hero-free{font-weight:500 !important;letter-spacing:.08em !important}\n.h3-ey{font-size:13px !important}\n.h3-card-meta,.h3-card-tag{font-size:12px !important}\n.h3-card-by small{font-weight:500 !important;letter-spacing:.08em !important}\n.h3-lede{font-size:clamp(17px,1.4vw,20px) !important;line-height:1.5 !important}\n.h3-btn{font-weight:600 !important;letter-spacing:0 !important}\n\n/* The people who went (26 Oct 2026, from the approved cover prototype): the contributors' faces and one action tile (29 Oct, Nancy agreed: no open seats, stories first), placed before the\n   \"You went. Write it down.\" chapter. Built by the script below; links to the contributor pages and to /travelers. */\n.tll-mg-people .tll-mg-sechead{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:0 0 28px}\n.tll-mg-people .tll-mg-sechead h2{margin:0 !important}\n.tll-mg-people .tll-mg-all{font:500 15px/1.3 'Inter Tight',system-ui,sans-serif;color:#0A0B14 !important;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:4px;min-height:44px;display:inline-flex;align-items:center}\n.tll-mg-faces{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:24px 20px}\n.tll-mg-faces a{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-decoration:none !important;color:#0A0B14 !important;min-height:44px;padding:4px 0}\n.tll-mg-faces img,.tll-mg-faces i{width:72px;height:72px;border-radius:50%;object-fit:cover;margin-bottom:8px;flex:0 0 72px}\n.tll-mg-faces img{box-shadow:0 0 0 1.5px #C8325B}\n.tll-mg-faces i{display:flex;align-items:center;justify-content:center;border:1.5px dashed #C8325B;color:#C8325B;font-style:normal;font-size:28px;box-sizing:border-box}\n.tll-mg-faces b{font:500 16px/1.25 'Inter Tight',system-ui,sans-serif;color:#0A0B14}\n.tll-mg-faces span{font:400 14px/1.4 'Inter Tight',system-ui,sans-serif;color:#6B6660}\n.tll-mg-faces .tll-mg-open b{color:#C8325B}\n.tll-mg-faces a:hover b,.tll-mg-faces a:focus-visible b{text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:3px}\n.tll-mg-faces a:focus-visible{outline:3px solid #C8325B;outline-offset:2px;border-radius:4px}\n@media(min-width:768px){.tll-mg-faces{grid-template-columns:repeat(4,1fr);gap:32px}}\n\n/* Stamps on the library cards and on the letter (26 Oct build list: \"stamp on cards\"). Each card carries data-loc and data-date, so\n   the stamp is drawn from them; the letter's stamp reads SUNDAY. Decorative, aria-hidden, no pointer events. */\n.h3-card-ph .tll-mg-card-stamp{position:absolute;right:10px;top:10px;width:58px;color:#0A0B14;background:rgba(247,241,232,.82);border-radius:50%;z-index:2;pointer-events:none;transform:rotate(-6deg)}\n.h3-card-ph .tll-mg-card-stamp svg{display:block;width:100%;height:auto}\n@media(min-width:768px){.h3-card-ph .tll-mg-card-stamp{width:68px;right:12px;top:12px}}\nsection[data-h3=\"news\"]{position:relative}\nsection[data-h3=\"news\"] .tll-mg-letter-stamp{position:absolute;right:16px;top:16px;width:84px;color:#0A0B14;opacity:.9;z-index:2;pointer-events:none}\nsection[data-h3=\"news\"] .tll-mg-letter-stamp svg{display:block;width:100%;height:auto}\n@media(min-width:768px){section[data-h3=\"news\"] .tll-mg-letter-stamp{width:120px;right:var(--h3-g,48px);top:32px}}\n";(document.head||document.documentElement).appendChild(CS);
function place(){document.body.appendChild(CS);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();
/* Fills the cover from COVER (built by build-cover.py from the story's CMS item; nothing typed here is a story headline or body).
   Moves: the hero photo's src and alt are swapped, a chip and a kicker go before the h1, the deck text is set, the first button
   points at the cover story, a credit line and the stamp are appended. Runs once. */
(function(){
var COVER={"slug": "spain-madrid-wedding-ibiza", "title": "Spain: A Wedding and an Adventure", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad72dc3c7e76f61648a3c30_6ad72d77eeadeeb5b887095e_chesney-lish-spain-hero.jpeg", "alt": "Sunset over the sea from a beach bar in Ibiza, the sun low behind a thatched roof", "w": 1440, "h": 1920, "author": "Chesney Lish", "authorSlug": "chesney-lish", "avatar": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg", "place": "Ibiza", "stampPlace": "IBIZA", "stampDate": "27 SEP 2024", "stampArc": "BY THE PEOPLE WHO WENT", "coords": "38.98° N 1.43° E", "posPhone": "50% 100%", "posDesk": "50% 100%", "phoneZoom": "90%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"};
var SVG='<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><defs><filter id="tll-mg-ink" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter><path id="tll-mg-top" d="M30,100 A70,70 0 1,1 170,100"/><path id="tll-mg-bottom" d="M34,100 A66,66 0 0,0 166,100"/></defs><g filter="url(#tll-mg-ink)"><g fill="none" stroke="currentColor"><circle cx="100" cy="100" r="94" stroke-width="3"/><circle cx="100" cy="100" r="86" stroke-width="1.2"/><circle cx="100" cy="100" r="58" stroke-width="1.2"/></g><g fill="currentColor" font-family="\'JetBrains Mono\',ui-monospace,monospace" text-anchor="middle"><text font-size="12.5" font-weight="600" letter-spacing="3"><textPath href="#tll-mg-top" startOffset="50%">THAT LAYOVER LIFE</textPath></text><text font-size="9" letter-spacing="1.4"><textPath href="#tll-mg-bottom" startOffset="50%">{A}</textPath></text><text x="100" y="82" font-size="8" letter-spacing="3" font-weight="600">TLL</text><text x="100" y="106" font-size="{S}" font-weight="600" letter-spacing="1">{P}</text><text x="100" y="124" font-size="9.5" letter-spacing="2">{D}</text></g></g></svg>';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function run(){
  var hero=document.querySelector('[data-h3-hero]');if(!hero||hero.dataset.tllCover||!COVER.slug)return;hero.dataset.tllCover='1';
  hero.style.setProperty('--tll-cover-pos-phone',COVER.posPhone||'50% 50%');hero.style.setProperty('--tll-cover-pos-desk',COVER.posDesk||'50% 50%');hero.style.setProperty('--tll-cover-zoom',COVER.phoneZoom||'0%');
  var img=hero.querySelector('img[data-tll-parallax="hero"]');
  if(img){img.removeAttribute('srcset');img.removeAttribute('sizes');img.src=COVER.img;img.alt=COVER.alt||'';if(COVER.w){img.width=COVER.w;img.height=COVER.h;}}
  var h1=hero.querySelector('h1');if(!h1)return;var words=h1.parentNode;var ey=h1.previousElementSibling;if(ey&&ey.tagName==='DIV')ey.classList.add('tll-mg-eyebrow');
  var chip=document.createElement('a');chip.className='tll-mg-chip';chip.href='/contributors/'+COVER.authorSlug;
  chip.innerHTML='<img src="'+esc(COVER.avatar)+'" alt="" width="36" height="36"><span><b>'+esc(COVER.author)+'</b>went to '+esc(COVER.place)+'</span>';
  var kick=document.createElement('div');kick.className='tll-mg-kicker';kick.textContent=COVER.kicker||"This week's cover";
  words.insertBefore(chip,h1);words.insertBefore(kick,h1);
  var dek=h1.nextElementSibling;if(dek&&dek.tagName==='P'&&COVER.dek)dek.textContent=COVER.dek;
  var cta=hero.querySelector('.h3-hero-cta'),btn=cta&&cta.querySelector('a');
  if(btn){btn.textContent=COVER.button||'Read the cover story';btn.href='/stories/'+COVER.slug;}
  /* 29 Oct 2026, Nancy: the hero said free to join but gave no way to join. The second button (hidden until now) becomes Join free. */
  var join=cta&&cta.querySelectorAll('a')[1];if(join&&COVER.join){join.textContent=COVER.join;join.href='/signup';join.classList.add('tll-mg-join');}
  var by=document.createElement('p');by.className='tll-mg-by';var b=document.createElement('b');b.textContent='Photo';by.appendChild(b);
  by.appendChild(document.createTextNode(' '+COVER.author+' · '+COVER.place+(COVER.coords?' · '+COVER.coords:'')));
  (cta||words).insertAdjacentElement(cta?'afterend':'beforeend',by);
  if(SVG&&COVER.stampPlace){var st=document.createElement('span');st.className='tll-mg-stamp';st.setAttribute('aria-hidden','true');
    st.innerHTML=SVG.replace('{P}',esc(COVER.stampPlace)).replace('{S}',COVER.stampPlace.length>10?'12':'16').replace('{D}',esc(COVER.stampDate||'')).replace('{A}',esc(COVER.stampArc||'BY THE PEOPLE WHO WENT'));hero.appendChild(st);}
}
/* F1: fill the hero as soon as it has arrived (its next sibling exists), before the first paint; the page-parsed event stays as the fallback. */
(function(){if(document.readyState!=='loading'){run();return;}var mo=null;
function ready(){var h=document.querySelector('[data-h3-hero]');return !!(h&&h.nextElementSibling);}
if(window.MutationObserver){mo=new MutationObserver(function(){if(ready()){mo.disconnect();mo=null;run();}});mo.observe(document.documentElement,{childList:true,subtree:true});}
document.addEventListener('DOMContentLoaded',function(){if(mo){mo.disconnect();mo=null;}run();});})();
})();

/* The people who went: PEOPLE is written by build-cover.py from the contributors on the live library rail. */
(function(){
var PEOPLE=[{"name": "Chesney Lish", "slug": "chesney-lish", "avatar": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg", "sub": "Madrid and Ibiza"}, {"name": "Barzy Adam", "slug": "barzy-adam", "avatar": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad72dc2c7c33fe2b4d53be9_6ad72d778e0db3aa7718c140_barzy-adam-avatar.jpeg", "sub": "Arizona"}, {"name": "Nancy Carleton", "slug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "sub": "Editor · Copenhagen"}];
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function run(){
  var anchor=document.querySelector('section.h3-c2,section[data-h3-first100]');if(!anchor||document.querySelector('.tll-mg-people')||!PEOPLE.length)return;
  var sec=document.createElement('section');sec.className='h3 h3-sec h3-cream tll-mg-people';sec.setAttribute('aria-labelledby','tll-mg-people-t');
  var h='<div class="h3-in"><div class="tll-mg-sechead"><h2 id="tll-mg-people-t" class="h3-title-l">The people who went.</h2><a class="tll-mg-all" href="/travelers">All travelers \u2192</a></div><ul class="tll-mg-faces">';
  PEOPLE.forEach(function(p){h+='<li><a href="/contributors/'+esc(p.slug)+'"><img src="'+esc(p.avatar)+'" alt="" width="72" height="72" loading="lazy"><b>'+esc(p.name)+'</b><span>'+esc(p.sub)+'</span></a></li>';});
  h+='<li><a class="tll-mg-open" href="/submit"><i aria-hidden="true">+</i><b>Pitch your layover.</b><span>We edit lightly and keep your byline.</span></a></li></ul></div>';
  sec.innerHTML=h;anchor.parentNode.insertBefore(sec,anchor);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* Stamps on the library cards (from each card's data-loc and data-date) and on the letter. The rail may be rebuilt after load, so this watches it for a while. */
(function(){
var SVG='<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><defs><filter id="tll-mg-ink" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter><path id="tll-mg-top" d="M30,100 A70,70 0 1,1 170,100"/><path id="tll-mg-bottom" d="M34,100 A66,66 0 0,0 166,100"/></defs><g filter="url(#tll-mg-ink)"><g fill="none" stroke="currentColor"><circle cx="100" cy="100" r="94" stroke-width="3"/><circle cx="100" cy="100" r="86" stroke-width="1.2"/><circle cx="100" cy="100" r="58" stroke-width="1.2"/></g><g fill="currentColor" font-family="\'JetBrains Mono\',ui-monospace,monospace" text-anchor="middle"><text font-size="12.5" font-weight="600" letter-spacing="3"><textPath href="#tll-mg-top" startOffset="50%">THAT LAYOVER LIFE</textPath></text><text font-size="9" letter-spacing="1.4"><textPath href="#tll-mg-bottom" startOffset="50%">{A}</textPath></text><text x="100" y="82" font-size="8" letter-spacing="3" font-weight="600">TLL</text><text x="100" y="106" font-size="{S}" font-weight="600" letter-spacing="1">{P}</text><text x="100" y="124" font-size="9.5" letter-spacing="2">{D}</text></g></g></svg>';
if(!SVG)return;
var MON=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function stamp(place,date,arc,cls){var st=document.createElement('span');st.className=cls;st.setAttribute('aria-hidden','true');
  st.innerHTML=SVG.replace('{P}',esc(place)).replace('{S}',place.length>10?'12':'16').replace('{D}',esc(date)).replace('{A}',esc(arc));return st;}
function cards(){var n=0;[].forEach.call(document.querySelectorAll('.h3-card'),function(c){var ph=c.querySelector('.h3-card-ph');if(!ph||ph.querySelector('.tll-mg-card-stamp'))return;
  var loc=(c.getAttribute('data-loc')||'').split(',')[0].trim().toUpperCase().slice(0,16);if(!loc)return;
  var d=(c.getAttribute('data-date')||'').match(/^(\d{4})-(\d{2})-(\d{2})/),date=d?d[3]+' '+MON[+d[2]-1]+' '+d[1]:'';
  var arc=(c.getAttribute('data-pillar')||'').trim().toUpperCase()||'BY THE PEOPLE WHO WENT';ph.appendChild(stamp(loc,date,arc,'tll-mg-card-stamp'));n++;});return n;}
function letter(){var s=document.querySelector('section[data-h3="news"]');if(!s||s.querySelector('.tll-mg-letter-stamp'))return;s.appendChild(stamp('SUNDAY','09:00 CPH','THE LAYOVER LETTER','tll-mg-letter-stamp'));}
function run(){cards();letter();var t=document.querySelector('.h3-track');if(t&&window.MutationObserver){var mo=new MutationObserver(function(){cards();});mo.observe(t,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();},15000);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
})();
