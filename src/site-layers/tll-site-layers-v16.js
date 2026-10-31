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
   script src/site-layers/tll-profile-count-v1.js (29 Oct: profile STORIES stat keeps the writer own count (the head script wrote the site total))
   script src/site-layers/tll-hover-v1.js (29 Oct Nancy: dark pink hover on light backgrounds instead of bright teal on /account)
   script src/site-layers/tll-home-bands-v1.js (29 Oct Nancy: home photo bands use members story photos at full size, credited and linked)
   script src/site-layers/tll-photos-caption-v1.js (29 Oct: /share-photos caption room 600 characters with a running count (was cut at 256))
   script src/site-layers/tll-lounge-labels-v1.js (29 Oct Nancy: /gallery tile labels small, in the corner, off the photo)
   script src/site-layers/tll-stories-places-v1.js (29 Oct Nancy: /stories place chips add Asia, Middle East and Oceania; in the library line)
   script src/site-layers/tll-stories-noimg-v1.js (29 Oct Nancy: /stories card without a photo shows a plain panel; the lead goes to the newest story with a photo)
   script src/site-layers/tll-linkout-preview-v1.js (29 Oct Nancy: /submit link-out form previews the article and sends its share photo (photos only, never ads) once the Worker route is live)
   script src/site-layers/tll-linkout-summary-v1.js (31 Oct Nancy: AI summary box for linked articles, labeled as AI, and an own-photo backup when the article has no usable photo)
   script src/site-layers/tll-byline-links-v1.js (29 Oct Nancy: story card writer name and photo open the writer page)
   script src/site-layers/tll-mbar-align-v1.js (29 Oct Nancy: member bar links line up with the page column)
   script src/site-layers/tll-story-fixes-1029-v1.js (29 Oct Nancy: US flag for US state labels; related heading Other stories from this frequent traveler)
   script src/site-layers/tll-email-hello-v1.js (29 Oct Nancy: every site email address shows and links to hello@thatlayover.life)
   script src/site-layers/tll-ep-marks-v1.js (29 Oct tester Mariam: /edit-profile field marks say saved to your account when only the public page update failed)
   script src/site-layers/tll-ep-help-v1.js (29 Oct tester Roberta: help marks open on tap and keyboard; One line reads Tagline with a hint)
   script src/site-layers/tll-expert-from-v1.js (29 Oct tester Roberta: Location Expert form asks where you are from)
   script src/site-layers/tll-submit-gallery-v1.js (29 Oct tester Roberta: /submit gallery keeps every photo picked, plain autosave line)
   script src/site-layers/tll-submit-long-v1.js (29 Oct Nancy: long stories arrive in full (body-part-1..12))
   script src/site-layers/tll-photos-form-v2.js (29 Oct Nancy: /share-photos takes 30 photos and PNG)
   script src/site-layers/tll-ep-linkstack-v1.js (29 Oct Nancy: More links editor on /edit-profile)
   script src/site-layers/tll-pf-linkstack-v1.js (29 Oct Nancy: More links on public profiles)
   script src/site-layers/tll-redesign-p0-v1.js (31 Oct Nancy: expats tiles coming soon, Horseshoe Bend off the home shelf, labeled map counts)
   script src/site-layers/tll-expats-map-v1.js (31 Oct Nancy: expats map with flags on /for-expats (opt-in, home base, country level))
   script src/site-layers/tll-story-captions-v1.js (31 Oct Roberta: photo captions on story pages from Photo placements)
   script src/site-layers/tll-intake-v1.js (31 Oct Nancy: instant set-up of submissions, ending check before send)
   script src/site-layers/tll-lounge-members-v1.js (31 Oct Nancy: member photos appear in the Lounge)
   script src/site-layers/tll-crew-v1.js (31 Oct Nancy approved the companions mockup: invite then accept, Travels with, shared pets)
   script src/site-layers/tll-home-value-v1.js (31 Oct Value Playbook Phase 1: home value section, staged behind ?preview=value)
   script src/site-layers/tll-collections-v1.js (31 Oct Nancy: souvenir collections on /edit-profile and profiles, private by default with opt in)
   script src/site-layers/tll-whats-new-v1.js (31 Oct Nancy: What is new dot and /account card for signed-in members, entries switched on in the CMS)
   script src/site-layers/tll-ads-v1.js (31 Oct Nancy: AdSense, tastefully (story pages, library, countries only))
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
 sortsol:{src:C+'6aba3d42f18f65b8d06aea74_6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars.jpeg',alt:'A murmuration of starlings at sunset during Sort Sol in Denmark',place:'Sort Sol, Denmark',by:'Nancy Carleton',href:'/stories/sort-sol-black-sun-denmark',pos:'42% 40%'},
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
".tll-ph-row.tll-ph-row-below{margin:28px auto 8px}"+
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

function stories(){var h1=document.querySelector('.tll-library-hero h1');if(!h1)return;
  /* Nancy, 29 Oct: "You can not see the search bar on top of scroll". The photos sit under the search bar, not in the hero, and a search
     (?q=) shows its results first with no photos above them. "on the shelf" reads "in the library" (house words). */
  var w=document.createTreeWalker(h1.closest('section')||h1.parentNode,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){if(/next story on the shelf/.test(t.nodeValue))t.nodeValue=t.nodeValue.replace('next story on the shelf','next story in the library');}
  if(document.querySelector('.tll-ph-row'))return;
  if(/[?&]q=[^&]/.test(location.search))return;
  var bar=document.querySelector('section.tllsb-bar');
  var row=el('div','tll-ph-row');['ibiza','jaguar','antarctica','fitzroy'].forEach(function(k){row.appendChild(tile(P[k],!bar));});
  if(bar){row.classList.add('tll-ph-row-below');bar.insertAdjacentElement('afterend',row);}else h1.insertAdjacentElement('afterend',row);}
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
  var fig=el('div','tll-ph-side');fig.appendChild(tile(P.sortsol,true)) /* Nancy, 29 Oct: Denmark, where she lives, makes more sense under her credit */;sec.appendChild(fig);sec.classList.add('tll-ph-split');
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
      stands next to it, with copy that follows the pressed filter: Pitch your layover first, then the directory that filter is about.
   Later the same day (Nancy: "Maybe we separate pets from people? Breed is weird on the search bar"; "Zain's flags are hard to see the white parts"):
   4. Pets get their own block under the people, titled Travel companions with a link to The Paw Passport; the Pets list is moved there, not removed.
      The first chip reads People, the Pets chip is hidden, and every chip count and the N CARDS line count people only (computed from the cards).
      The search box reads Name, city or country; a search still narrows the pets block, and the filter chips no longer hide it.
   5. Empty grid cells: the open-slot embed sits in the grid as display:contents, and Webflow's base CSS gives every .w-embed a ::before and ::after
      clearfix pinned to grid row 1, column 1, which took the first cell; those are switched off inside the grid. Any item whose card is not shown
      is also hidden with its own class, so the page script's filter clicks cannot bring that gap back.
   6. Card flags get a thin dark ring so white areas of a flag read on the cream card. */
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
"html body .tv-flags span{box-shadow:0 0 0 1px rgba(10,11,20,.24)!important}"+
"html body [data-tll-roster-grid] .tll-tf-gone,html body .tll-tf-pets-grid .tll-tf-gone{display:none!important}"+
"html body [data-tll-roster-grid] .w-embed::before,html body [data-tll-roster-grid] .w-embed::after{content:none!important;display:none!important}"+
"html body [data-tv-chips] [data-tv-filter=\"pets\"]{display:none!important}"+
".tll-tf-pets{margin:64px 0 0}.tll-tf-pets[hidden]{display:none!important}"+
".tll-tf-pets-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 24px;border-top:3px solid #0A0B14;border-bottom:1px solid #E0DACE;padding:16px 0;margin:0 0 32px}"+
".tll-tf-pets-h{font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:28px;line-height:1.1;letter-spacing:-.02em;color:#0A0B14;margin:0}"+
".tll-tf-pets-a{font:700 12px/1.4 "+MONO+";letter-spacing:1.5px;text-transform:uppercase;color:#067A79!important;text-decoration:none!important;min-height:44px;display:inline-flex;align-items:center}"+
".tll-tf-pets-a:hover{text-decoration:underline!important}.tll-tf-pets-a:focus-visible{outline:3px solid #0A0B14;outline-offset:2px}"+
".tll-tf-pets-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));gap:24px;align-items:stretch}"+
".tll-tf-pets-grid .w-dyn-item,.tll-tf-pets-grid .w-dyn-item.tv-hide{display:flex!important;min-width:0}"+
".tll-tf-pets-grid .w-dyn-item.tll-tf-pno{display:none!important}"+
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
function shown(c){if(!c||c.classList.contains('w-condition-invisible'))return false;var cs=getComputedStyle(c);return cs.display!=='none'&&cs.visibility!=='hidden';}
/* An item whose card is hidden (or that has no card) gets its own class; the page script toggles tv-hide on every filter click and would bring the gap back. */
function empties(){[].forEach.call(document.querySelectorAll('[data-tll-roster-grid] .w-dyn-item,.tll-tf-pets-grid .w-dyn-item'),function(it){
  if(!shown(it.querySelector('[data-tll-trav-card]')))it.classList.add('tll-tf-gone');});}
function on(c,k){var m=c.querySelector('[data-tv-on="'+k+'"]');return !!m&&!m.classList.contains('w-condition-invisible');}
function words(){var q=document.querySelector('input[data-tll-trav-search]');return q?q.value.trim().toLowerCase().split(/\s+/).filter(Boolean):[];}
function people(){return [].slice.call(document.querySelectorAll('[data-tll-roster-grid] [data-tll-trav-card]')).filter(function(c){
  var it=c.closest('.w-dyn-item');return c.getAttribute('data-tll-trav-card')!=='pet'&&!(it&&it.classList.contains('tll-tf-gone'));});}
var busy=false;
/* Counts come from the cards on the page: people only, now that pets have their own block. */
function counts(){if(busy)return;busy=true;try{
  var ps=people();
  ['everyone','expats','creators','press'].forEach(function(f){var n=ps.filter(function(c){return f==='everyone'||on(c,f);}).length;
    var sp=document.querySelector('[data-tv-filter="'+f+'"] [data-tv-n]');if(sp&&sp.textContent!==' · '+n)sp.textContent=' · '+n;});
  var line=document.querySelector('[data-tv-countline]');if(line){var cur=current(),w=words();
    var total=ps.filter(function(c){return cur==='everyone'||on(c,cur);}).length;
    var vis=ps.filter(function(c){var it=c.closest('.w-dyn-item');return !(it&&it.classList.contains('tv-hide'));}).length;
    var t=w.length?vis+' OF '+total:total+(total===1?' CARD':' CARDS');if(line.textContent!==t)line.textContent=t;}
  pets();}finally{busy=false;}}
/* The pets block follows the search box, not the chips. */
function pets(){var box=document.querySelector('.tll-tf-pets');if(!box)return;var w=words(),n=0;
  [].forEach.call(box.querySelectorAll('.w-dyn-item'),function(it){if(it.classList.contains('tll-tf-gone'))return;var c=it.querySelector('[data-tll-trav-card]');
    var t=c?((c.getAttribute('aria-label')||'')+' '+(c.textContent||'')).toLowerCase():'';var ok=!!c&&w.every(function(x){return t.indexOf(x)>-1;});
    it.classList.toggle('tll-tf-pno',!ok);if(ok)n++;});
  box.hidden=!n;}
function separate(){var grid=document.querySelector('[data-tll-roster-grid]'),list=grid&&grid.querySelector('[data-tv-list="pets"]');
  var ev=document.querySelector('[data-tv-filter="everyone"]');if(ev){var tn=ev.firstChild;if(tn&&tn.nodeType===3&&/everyone/i.test(tn.nodeValue))tn.nodeValue='People';}
  var q=document.querySelector('input[data-tll-trav-search]');if(q&&/breed/i.test(q.getAttribute('placeholder')||''))q.setAttribute('placeholder','Name, city or country');
  var lt=document.querySelector('[data-tll-trav-search-text]');if(lt&&/pet/i.test(lt.getAttribute('data-tll-trav-search-text')))lt.setAttribute('data-tll-trav-search-text','Find a traveler');
  var pp=document.querySelector('[data-tv-filter="pets"][aria-pressed="true"]');if(pp&&ev)ev.click();
  if(list&&!document.querySelector('.tll-tf-pets')){var box=document.createElement('div');box.className='tll-tf-pets';
    box.innerHTML='<div class="tll-tf-pets-head"><h2 class="tll-tf-pets-h">Travel companions</h2><a class="tll-tf-pets-a" href="/the-paw-passport">The Paw Passport →</a></div><div class="tll-tf-pets-grid"></div>';
    box.querySelector('.tll-tf-pets-grid').appendChild(list);grid.parentNode.insertBefore(box,grid.nextSibling);}
  empties();counts();
  var line=document.querySelector('[data-tv-countline]');
  if(line&&!line.__tllTf){line.__tllTf=1;new MutationObserver(function(){counts();}).observe(line,{childList:true,characterData:true,subtree:true});}
  if(q&&!q.__tllTf){q.__tllTf=1;q.addEventListener('input',function(){setTimeout(counts,200);});q.addEventListener('search',function(){setTimeout(counts,0);});}}
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
function run(){style();chips();placeTile();setTimeout(separate,0);
  var grid=document.querySelector('[data-tll-roster-grid]');
  if(grid&&!grid.__tllTf){grid.__tllTf=1;new MutationObserver(function(ms){for(var i=0;i<ms.length;i++)for(var j=0;j<ms[i].addedNodes.length;j++){var n=ms[i].addedNodes[j];
    if(n.nodeType===1&&(n.classList.contains('tll-trav-linkchips')||n.querySelector('.tll-trav-linkchips'))){chips(grid);return;}}}).observe(grid,{childList:true,subtree:true});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.addEventListener('load',function(){run();chips();separate();setTimeout(function(){chips();separate();},600);});
})();

/* Pet cards as posters (29 Oct 2026, Nancy, pointing at the Paw Passport card in the Claude Design prototype 3.4). In the Travel
   companions block each pet card is the photo itself: a slight tilt, the name over the bottom of the photo in Playfair, and one
   mono line under it with the breed and the card's own stats (the CMS values, never typed). The PET chip stays; the one-line bio
   stays on the pet's own page. Same card and link; nothing removed. */
(function(){
if(!/^\/travelers\/?$/.test(location.pathname))return;
var CSS="html body .tll-tf-pets .tv-card{position:relative!important;display:block!important;aspect-ratio:4/5;overflow:hidden!important;padding:0!important;border:0!important;border-radius:2px!important;background:#0A0B14!important;"+
"transform:rotate(-1.2deg);box-shadow:0 14px 30px rgba(10,11,20,.18);transition:transform 260ms cubic-bezier(.23,1,.32,1),box-shadow 260ms cubic-bezier(.23,1,.32,1)}"+
"html body .tll-tf-pets .tv-card:nth-child(even),html body .tll-tf-pets [role=listitem]:nth-child(even) .tv-card{transform:rotate(1deg)}"+
"@media (hover:hover) and (pointer:fine){html body .tll-tf-pets .tv-card:hover{transform:rotate(0) translateY(-4px);box-shadow:0 20px 38px rgba(10,11,20,.24)}}"+
"html body .tll-tf-pets .tv-card:focus-visible{outline:3px solid #C8325B;outline-offset:4px}"+
"html body .tll-tf-pets .tv-photo{position:absolute!important;inset:0!important;height:100%!important;width:100%!important;margin:0!important;aspect-ratio:auto!important}"+
"html body .tll-tf-pets .tv-photo img{width:100%!important;height:100%!important;object-fit:cover!important}"+
"html body .tll-tf-pets .tv-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,11,20,0) 48%,rgba(10,11,20,.78) 100%);pointer-events:none}"+
"html body .tll-tf-pets .tv-label{display:none!important}"+
"html body .tll-tf-pets .tv-body{position:absolute!important;left:0;right:0;bottom:0;z-index:2;padding:0 20px 20px!important;background:none!important;border:0!important}"+
"html body .tll-tf-pets .tv-name{margin:0 0 6px!important;color:#F7F1E8!important;font:800 28px/1.05 'Playfair Display',Georgia,serif!important;letter-spacing:-.01em}"+
"html body .tll-tf-pets .tv-line,html body .tll-tf-pets .tv-stats{display:none!important}"+
"html body .tll-tf-pets .tll-pc-meta{margin:0;font:600 11px/1.5 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#00C9C8}"+
"@media (prefers-reduced-motion:reduce){html body .tll-tf-pets .tv-card{transition:none}}";
function txt(el){if(!el)return '';var out=[];(function walk(n){[].forEach.call(n.childNodes,function(c){if(c.nodeType===3){var v=c.nodeValue.trim();if(v)out.push(v);}else if(c.nodeType===1)walk(c);});})(el);return out.join(' ').replace(/\s+/g,' ').trim();}
function run(){
  var box=document.querySelector('.tll-tf-pets');if(!box)return;
  if(!document.getElementById('tll-pet-cards-v1')){var s=document.createElement('style');s.id='tll-pet-cards-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  [].forEach.call(box.querySelectorAll('.tv-card'),function(c){if(c.querySelector('.tll-pc-meta'))return;
    var parts=[txt(c.querySelector('.tv-label')),txt(c.querySelector('.tv-stats'))].filter(Boolean);if(!parts.length)return;
    var m=document.createElement('p');m.className='tll-pc-meta';m.textContent=parts.join(' · ');var b=c.querySelector('.tv-body');if(b)b.appendChild(m);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,0);});else setTimeout(run,0);
setTimeout(run,900);setTimeout(run,2000);
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
/* preview card: "80-something +AQ" broke mid-word in a third of the card; stats now wrap as whole words */
"html body .ep-pv-stats b .tll-eps-aq{display:block;margin-top:4px;font:600 12px/1.3 'JetBrains Mono',ui-monospace,monospace!important;letter-spacing:.12em;text-transform:uppercase;color:inherit}"+
"html body p.ep-note.tll-eps-lived,html body p.tll-eps-optin{margin:8px 0 0;font-size:14px;line-height:1.45;color:#5F5A54}html body p.tll-eps-optin{margin:0 0 16px;padding:10px 12px;border-left:3px solid #067A79;background:#FFFFFF}"+
"html body p.ep-note.tll-eps-lived a,html body p.tll-eps-optin a{color:#067A79;font-weight:600;text-decoration:underline;text-underline-offset:3px}html body p.ep-note.tll-eps-lived a:hover,html body p.tll-eps-optin a:hover{color:#C8325B}"+
"html body #ep-dirs-h>span:not(.tll-eps-chip){display:none}"+
".tll-eps-quick{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:12px 0 4px}.tll-eps-quick[hidden]{display:none}.tll-eps-quick>span{width:100%;font-size:14px;color:#5F5A54}"+
".tll-eps-qb{min-height:40px;padding:8px 12px;border:1.5px solid #0A0B14;border-radius:999px;background:#FFFFFF;color:#0A0B14;font:600 14px/1.2 'IBM Plex Sans Condensed',system-ui,sans-serif;cursor:pointer}.tll-eps-qb:hover{border-color:#C8325B;color:#C8325B}.tll-eps-qb:focus-visible{outline:3px solid #C8325B;outline-offset:2px}"+
"html body .ep-pv-stats{display:flex!important;flex-wrap:wrap;gap:12px 22px}html body .ep-pv-stats>*{min-width:0}html body .ep-pv-stats b{white-space:nowrap;overflow-wrap:normal!important;word-break:keep-all;font-size:28px!important}"+
/* blocks (Nancy: "too long. Should be in blocks. Also should identify optional vs required") */
"html body section.ep-sec.tll-eps-blk{position:relative;background:#FDF9F3;border:1.5px solid #E0DACE;border-radius:4px;padding:22px 22px 24px!important;margin:0 0 16px!important}"+
"html body section.ep-sec.tll-eps-blk>h2.ep-eb{cursor:pointer;padding-right:96px;margin-bottom:12px}"+
"html body section.ep-sec.tll-eps-shut{padding-bottom:22px!important}html body section.ep-sec.tll-eps-shut>h2.ep-eb{margin-bottom:0}"+
"html body section.ep-sec.tll-eps-shut>*:not(h2.ep-eb):not(.tll-eps-tog){display:none!important}"+
".tll-eps-chip{display:inline-block;vertical-align:middle;margin-left:10px;padding:4px 8px;border:1px solid #D9D2C5;border-radius:999px;font:600 12px/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;color:#5F5A54;background:#FFFFFF}"+
".tll-eps-chip--req{border-color:#C8325B;color:#C8325B}"+
".tll-eps-tog{position:absolute;top:16px;right:16px;min-height:44px;padding:0 14px;border:1.5px solid #0A0B14;background:transparent;color:#0A0B14;font:600 14px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;cursor:pointer;border-radius:0}"+
".tll-eps-tog:focus-visible{outline:3px solid #C8325B;outline-offset:2px}"+
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
var bar,txt,btn,retry,save,okTimer=0,photoPending=false;
function hhmm(){var d=new Date();return d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});}
function paint(){var s=$('[data-ep-status]');if(!s||!bar)return;var st=s.getAttribute('data-state')||'',t=(s.textContent||'').trim();
  bar.setAttribute('data-s',st||'idle');
  if(st==='busy'){txt.innerHTML='<span class="tll-eps-dot"></span>'+(photoPending?'Saving your photo…':'Saving…');}
  else if(st==='ok'){txt.innerHTML='<span class="tll-eps-dot"></span><b>'+(photoPending?'Photo saved':'Saved')+'</b> · '+hhmm();photoPending=false;}
  else if(st==='fail'){photoPending=false;var why=/did not update/.test(t)?(/sign in/i.test(lastErr)||!lastErr?'Saved to your account. Your public page is not updating right now; nothing is lost, and it catches up on your next save once that is fixed.':'Saved to your account. Your public page did not update yet: '+lastErr):t; /* 29 Oct: the Worker answers "Please sign in again" when its own member check fails, not because the writer is signed out */txt.innerHTML='';var d=el('span','tll-eps-dot');txt.appendChild(d);txt.appendChild(D.createTextNode(why));}
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
  var acts=el('div','tll-eps-acts'),cancel=el('button','tll-eps-btn tll-eps-btn--ghost'),use=el('button','tll-eps-btn');cancel.type=use.type='button';cancel.textContent='Cancel';use.textContent='Save photo';acts.appendChild(cancel);acts.appendChild(use);
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
    use.disabled=true;use.textContent='Saving…';out.toBlob(function(b){done();if(!b)return;var f=new File([b],'profile-photo.jpg',{type:'image/jpeg'});photoPending=true;pass(input,f);},'image/jpeg',.9);});
  setTimeout(function(){st.focus();},30);}
D.addEventListener('change',function(e){var t=e.target;if(!t||t.id!=='ep-f-photo'||t.__tllEpsPass)return;var f=t.files&&t.files[0];if(!f||!/^image\//.test(f.type||'image/'))return;
  e.stopImmediatePropagation();e.preventDefault();cropFlow(f,t);},true);

/* ---------- 6: the page as blocks ---------- */
var CHIP={'ep-who':['Name required','req'],'ep-dirs':['Opt in','']};
function setShut(sec,shut){sec.classList.toggle('tll-eps-shut',shut);var b=sec.querySelector(':scope>.tll-eps-tog');if(b){b.textContent=shut?'Open':'Close';b.setAttribute('aria-expanded',shut?'false':'true');}}
function openTo(id){var sec=D.getElementById(id);if(sec&&sec.classList.contains('tll-eps-blk'))setShut(sec,false);}
/* Some parts of a section are their own embeds after it (Shown as, One line, From and lived in after Who you are; the bio note after
   About you). Each part with no section of its own moves into the section before it, so the block holds all of its fields. */
function gather(){var secs=[].slice.call(D.querySelectorAll('section.ep-sec[id]'));if(!secs.length)return;
  [].forEach.call(D.querySelectorAll('div[data-ep]'),function(d){var k=d.getAttribute('data-ep');if(k==='top'||d.querySelector('section.ep-sec')||d.closest('section.ep-sec'))return;
    var prev=null;secs.forEach(function(s){if(s.compareDocumentPosition(d)&Node.DOCUMENT_POSITION_FOLLOWING)prev=s;});
    if(!prev)return;var next=secs[secs.indexOf(prev)+1];if(next&&(next.compareDocumentPosition(d)&Node.DOCUMENT_POSITION_FOLLOWING))return;
    prev.appendChild(d);});}
function blocks(){gather();[].forEach.call(D.querySelectorAll('section.ep-sec[id]'),function(sec,i){if(sec.classList.contains('tll-eps-blk'))return;sec.classList.add('tll-eps-blk');
  var h=sec.querySelector(':scope>h2.ep-eb');var c=CHIP.hasOwnProperty(sec.id)?CHIP[sec.id]:['Optional',''];
  if(h&&c){var chip=el('span','tll-eps-chip'+(c[1]?' tll-eps-chip--req':''));chip.textContent=c[0];h.appendChild(chip);}
  var t=el('button','tll-eps-tog');t.type='button';t.setAttribute('aria-controls',sec.id);sec.appendChild(t);
  t.addEventListener('click',function(){setShut(sec,!sec.classList.contains('tll-eps-shut'));});
  if(h)h.addEventListener('click',function(e){if(e.target.closest('a,button,[tabindex]'))return;setShut(sec,!sec.classList.contains('tll-eps-shut'));});
  setShut(sec,sec.id!=='ep-who'&&location.hash!=='#'+sec.id);});
  D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#ep-"]');if(a){openTo(a.getAttribute('href').slice(1));return;}
    if(e.target.closest&&e.target.closest('[data-ep-dev-next],[data-ep-next]'))[].forEach.call(D.querySelectorAll('section.tll-eps-shut'),function(x){setShut(x,false);});},true);
  addEventListener('hashchange',function(){openTo(location.hash.slice(1));});}

/* ---------- 7: where you have lived, and the expat desks (Nancy: "We ask the expat question twice"; "The expat desk should still be
   tied here with this form tied to the expat submission. This is definitely opt in.") ----------
   Has lived in under Who you are stays the everyday question. The Directories block is marked Opt in, with a line at its top that points
   to the location expert application on /for-expats. Under Has lived in, a line points to the desks. Inside the desks, each country
   from From and Has lived in with no desk yet is offered as one tap ("Add a desk for Denmark"), which runs the page's own desk Add, so
   nothing new is stored and nothing is added without a tap. The preview's Antarctica mark reads "+ Antarctica" in place of AQ. */
var LIVED_NOTE='Know one of these well? Add it as a desk in <a href="#ep-dirs">Directories</a> (opt in).';
var OPTIN_NOTE='Add a desk only for a place you know well enough to help a visitor. Want to be listed as a location expert? <a href="/for-expats#tll-expert-apply">Claim your desk →</a>';
function livedPaint(E){var lf=D.querySelector('[data-ep-livedflags]'),sub=lf&&lf.closest('.ep-sub'),L=E.list(E.get('from-and-lived-in'));
  if(sub){var n=D.getElementById('tll-eps-lived');if(!n){n=el('p','ep-note tll-eps-lived');n.id='tll-eps-lived';n.innerHTML=LIVED_NOTE;sub.appendChild(n);}
    var h=L.length<2;if(n.hidden!==h)n.hidden=h;}
  var dirs=D.getElementById('ep-dirs');if(dirs&&!D.getElementById('tll-eps-optin')){var o=el('p','tll-eps-optin');o.id='tll-eps-optin';o.innerHTML=OPTIN_NOTE;
    var ld=dirs.querySelector(':scope>p.ep-lede'),h2=dirs.querySelector(':scope>h2.ep-eb'),at=ld||h2;if(at)at.parentNode.insertBefore(o,at.nextSibling);else dirs.insertBefore(o,dirs.firstChild);}
  var box=D.querySelector('[data-ep-desks]'),add=box&&box.querySelector('.ep-desk-add');
  if(add){var qk=D.getElementById('tll-eps-quick');if(!qk){qk=el('div','tll-eps-quick');qk.id='tll-eps-quick';add.parentNode.insertBefore(qk,add);}
    var have={};(E.desksShown||E.jsonList('desks')).forEach(function(d){if(d&&d.c)have[d.c]=1;});
    var todo=L.filter(function(c,i){return c&&!have[c]&&L.indexOf(c)===i;}),key=todo.join(',');
    if(qk.getAttribute('data-k')!==key){qk.setAttribute('data-k',key);qk.innerHTML='';
      if(todo.length){var t=el('span');t.textContent='From your profile:';qk.appendChild(t);
        todo.forEach(function(c){var b=el('button','tll-eps-qb');b.type='button';b.setAttribute('data-tll-desk',c);b.textContent='Add a desk for '+E.cname(c);qk.appendChild(b);});}}
    var hid=!todo.length;if(qk.hidden!==hid)qk.hidden=hid;}
  var pc=D.querySelector('[data-ep-pv-countries]');
  if(pc&&!pc.querySelector('.tll-eps-aq')&&/ \+AQ$/.test(pc.textContent)){var t2=pc.textContent.replace(/ \+AQ$/,'');pc.textContent=t2;var a=el('small','tll-eps-aq');a.textContent='+ Antarctica';pc.appendChild(a);}}
function lived(){var E=window.TLLEP;if(!E||!E.paint||!E.list)return false;if(E.__tllLived)return true;E.__tllLived=1;
  D.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-tll-desk]');if(!b)return;
    var q=D.querySelector('[data-ep-deskq]'),ab=D.querySelector('[data-ep-desk-add]');if(!q||!ab)return;
    q.value=E.cname(b.getAttribute('data-tll-desk'));ab.click();});
  var P=E.paint;E.paint=function(){var r=P.apply(this,arguments);livedPaint(E);return r;};livedPaint(E);return true;}

function run(){if(!D.getElementById('tll-ep-ux-v1')){var s=el('style');s.id='tll-ep-ux-v1';s.textContent=CSS;D.head.appendChild(s);}
  buildBar();watchShifts();blocks();if(!lived())addEventListener('load',lived);BOXES.forEach(function(b){wireBox(b[0],b[1]);});
  /* boxes the page draws later (the expat desks open when Live there is switched on) */
  new MutationObserver(function(){BOXES.forEach(function(b){wireBox(b[0],b[1]);});}).observe(D.body,{childList:true,subtree:true});}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',run);else run();
})();

/* tll-submit-ux-v1 (29 Oct 2026, tester Luke via Nancy: "I couldn't find a clear way to insert headings"; "I wasn't entirely sure what to go
   with for the Pull Quote ... the sign-off and reader question"). Part 1, the live story form: clearer hints and an example in the box for
   Pull quote, Reader question and Sign-off, and a line under Body on subheads and photos. Part 2, the newer editor (when it ships): the
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
var HINTS={'pull-quote':['One or two sentences copied word for word from your story: the line you would want someone to screenshot. Leave blank and the editor suggests three.','e.g. "The smell alone was enough to bring in the queues."'],
 'reader-question':['One question for readers, about your trip or theirs. It closes the story and invites replies.','e.g. Which food festival would you travel for?'],
 'sign-off':['Your last line, in your voice: a mood, then your name.','e.g. Still raising glasses. Nancy'],
 'body':['Start anywhere. The middle is fine. Put each subhead on its own line and the editor sets it as a heading. Want a photo in a certain spot? Add it in Photos and write [photo: what it shows] on its own line where it goes.','']};
function hints(){[].forEach.call(document.querySelectorAll('form textarea[name],form input[name]'),function(i){var h=HINTS[i.name];if(!h||i.dataset.tllSu)return;i.dataset.tllSu='1';
  var lab=i.closest('label'),sp=lab&&lab.querySelector('.tll-pen-helptext');if(sp&&!(i.name==='body'&&/Autosaves/.test(sp.textContent)&&false))sp.textContent=i.name==='body'?h[0]+' '+((sp.textContent.match(/Autosaves[^.]*\.(?: Drafts[^.]*\.)?/)||[''])[0]):h[0];
  if(h[1]&&!i.getAttribute('placeholder'))i.setAttribute('placeholder',h[1]);});}
/* tester Shahzain: "A human looks within 48 hours" reads oddly; the success message (a plain div the API cannot edit) now says "reviews it". */
function looks(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){if(/A human looks within 48 hours/.test(t.nodeValue))t.nodeValue=t.nodeValue.replace(/A human looks within 48 hours/g,'A human reviews it within 48 hours');}}
function all(){run();hints();looks();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',all);else all();
})();

/* tll-profile-count-v1 (29 Oct 2026, Nancy's profile read "52 STORIES"). The site head script tll-live-stories-v1 rewrites any number
   that sits next to the word "stories" with the site-wide story total from the sitemap; on /contributors/{slug} that overwrote the
   writer's own count in the stat strip. Here the strip's STORIES number is set back to the writer's own count (the profile's
   "N STORIES · NEWEST FIRST" line, which that script does not touch) whenever it changes. Nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/contributors\/[^/]+\/?$/.test(location.pathname))return;
function own(){var m=document.querySelector('[data-pf5="stories-meta"]');var n=m&&parseInt(m.textContent,10);return n>0?n:0;}
function fix(){var n=own();if(!n)return;[].forEach.call(document.querySelectorAll('.pf5-stat-k'),function(k){if(!/^stor(y|ies)$/i.test((k.textContent||'').trim()))return;
  var v=k.previousElementSibling;if(!v)return;var t=v.firstChild&&v.firstChild.nodeType===3?v.firstChild:null,want=String(n);
  if(t){if(t.nodeValue.trim()!==want)t.nodeValue=want;}else if((v.textContent||'').trim()!==want)v.textContent=want;
  var lab=n===1?'STORY':'STORIES';if((k.textContent||'').trim()!==lab)k.textContent=lab;});}
function run(){fix();var S=document.querySelector('.pf5-stat-k');var box=S&&S.parentNode&&S.parentNode.parentNode;
  if(box)new MutationObserver(function(){fix();}).observe(box,{subtree:true,childList:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
addEventListener('load',function(){fix();setTimeout(fix,1500);});
})();

/* tll-hover-v1 (29 Oct 2026, Nancy: "still having blue on hover, it is too light, maybe the dark pink?"). On light backgrounds the
   /account profile card turned its whole text bright teal on hover, and the account pick-in cards outlined in bright teal (#00C9C8 is
   for dark backgrounds only). Hover is now ink text with a dark pink (#C8325B) border and link line. Namespaced; nothing removed. */
(function(){
var CSS="html body a.tll-apc:hover,html body a.tll-apc:hover *,html body a.tll-apc:focus-visible,html body a.tll-apc:focus-visible *{color:#0A0B14!important}"+
"html body a.tll-apc:hover,html body a.tll-apc:focus-visible{border-color:#C8325B!important}"+
"html body a.tll-apc:hover .tll-apc-go,html body a.tll-apc:focus-visible .tll-apc-go{color:#C8325B!important;text-decoration-color:#C8325B!important}"+
"html body .tll-account-actions-section .tll-pickin-card:hover{outline-color:#C8325B!important;border-color:#C8325B!important}";
function add(){if(document.getElementById('tll-hover-v1'))return;var s=document.createElement('style');s.id='tll-hover-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();

/* tll-home-bands-v1 (29 Oct 2026, Nancy: the Brazil band "looks pixelated"; the Montenegro band "I think we have better images for this").
   The two full-width photo bands on the home page now show members' own story photos at full size (2400 px wide), each credited to the
   writer and linked to the story it came from. Captions name the place of a published story, never where anyone is now. Home only;
   the figure, its classes and its data-h3-il key stay; nothing is removed and no data-ms-* element is touched. */
(function(){
if(!/^\/(index\.html)?$/.test(location.pathname))return;
var C='https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/';
var B={
 rio:{src:C+'6ac86ab8eaf54b2878f9344b_6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river.jpeg',w:2400,h:1350,
  alt:'A jaguar swimming across the Cuiaba River in the Pantanal',pos:'50% 42%',label:'In the library · Pantanal, Brazil',by:'Nancy Carleton',href:'/stories/pantanal-glimmers-in-the-wild'},
 montenegro:{src:C+'6aba3d42f18f65b8d06aea74_6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars.jpeg',w:2400,h:1350,
  alt:'A murmuration of starlings at sunset during Sort Sol, cars parked below',pos:'50% 40%',label:'On the map · Sort Sol, Denmark',by:'Nancy Carleton',href:'/stories/sort-sol-black-sun-denmark'}
};
var CSS=".h3-il[data-tll-band] figcaption{padding:0!important;background:none!important}"+
".h3-il[data-tll-band] figcaption a{display:inline-block;padding:8px 12px;background:rgba(10,11,20,.72);color:#F7F1E8!important;text-decoration:none!important}"+
".h3-il[data-tll-band] figcaption b{font-weight:600}"+
".h3-il[data-tll-band] figcaption a:hover b,.h3-il[data-tll-band] figcaption a:focus-visible b{text-decoration:underline;text-decoration-color:#F0507A;text-underline-offset:3px}"+
".h3-il[data-tll-band] figcaption a:focus-visible{outline:3px solid #F0507A;outline-offset:3px}";
function swap(){
  if(!document.getElementById('tll-home-bands-v1')){var s=document.createElement('style');s.id='tll-home-bands-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  Object.keys(B).forEach(function(k){
    var f=document.querySelector('figure.h3-il[data-h3-il="'+k+'"]');if(!f||f.getAttribute('data-tll-band'))return;
    var p=B[k],i=f.querySelector('img'),c=f.querySelector('figcaption');if(!i||!c)return;
    f.setAttribute('data-tll-band','1');
    i.removeAttribute('srcset');i.removeAttribute('sizes');i.src=p.src;i.alt=p.alt;i.width=p.w;i.height=p.h;i.style.objectPosition=p.pos;
    var a=document.createElement('a');a.href=p.href;a.appendChild(document.createTextNode(p.label+' · '));
    var b=document.createElement('b');b.textContent=p.by;a.appendChild(b);c.textContent='';c.appendChild(a);
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',swap);else swap();
})();

/* tll-photos-caption-v1 (29 Oct 2026). Nancy's own photo caption on /share-photos stopped mid-sentence ("proof that The Ice"):
   the caption input had a 256 character limit and gave no sign of it. The limit is now 1,000 (600 until 29 Oct) with a running "N of 1000" line, so the
   writer sees the room left. Same input, same name; /share-photos only; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/share-photos\/?$/.test(location.pathname))return;
var MAX=1000;
function run(){
  var i=document.querySelector('input[name="caption"],textarea[name="caption"]');if(!i||i.dataset.tllCap)return;
  i.dataset.tllCap='1';i.setAttribute('maxlength',String(MAX));
  var c=document.createElement('span');c.className='tll-cap-count';c.setAttribute('aria-live','polite');
  c.style.cssText='display:block;margin:6px 0 0;font:500 12px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.04em;color:#6B6660;text-align:right';
  function paint(){var n=(i.value||'').length;c.textContent=n+' of '+MAX;c.style.color=n>=MAX?'#C8325B':'#6B6660';}
  i.addEventListener('input',paint);paint();
  i.insertAdjacentElement('afterend',c);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();

/* tll-lounge-labels-v1 (29 Oct 2026, Nancy on /gallery: "The text over the images takes up all of the space"). The credit labels the
   TLL Lounge v2 page script paints on each tile (span.tll-lounge-credit, span.tll-lounge-open) become one small line in the corner:
   smaller type, tighter tracking, a long place wraps to a second short line. Same elements and text; /gallery only; nothing removed. */
(function(){
if(!/^\/gallery\/?$/.test(location.pathname))return;
var CSS="html body .tll-lounge-credit,html body .tll-lounge-open{position:absolute!important;left:10px!important;bottom:10px!important;right:auto!important;top:auto!important;"+
"max-width:calc(100% - 20px)!important;width:auto!important;box-sizing:border-box!important;margin:0!important;padding:4px 7px!important;"+
"font:600 10px/1.3 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace!important;letter-spacing:.08em!important;text-transform:uppercase;"+
"white-space:normal!important;overflow-wrap:anywhere;"+
"background:rgba(10,11,20,.62)!important;color:#F7F1E8!important;border-radius:2px!important}"+
"@media (max-width:767px){html body .tll-lounge-credit,html body .tll-lounge-open{left:8px!important;bottom:8px!important;max-width:calc(100% - 16px)!important;font-size:9.5px!important;padding:3px 6px!important}}";
function add(){if(document.getElementById('tll-lounge-labels-v1'))return;var s=document.createElement('style');s.id='tll-lounge-labels-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();

/* tll-stories-places-v1 (29 Oct 2026, Nancy on /stories: "Where is Asia and Oceania?"). The place chips stopped at Europe, Africa,
   Americas and Antarctica, while the Stories region field also has Asia, Middle East and Oceania. The missing three are added as copies
   of an existing chip, in alphabetical order. The page's own chip script (TLL Stories chips v1) filters by the card's region text, so the new
   chips work through it; if that script has already wired its chips, the new ones filter the same way on their own. A region with no
   story yet shows the page's own "No stories from ... yet" note. Also: "the next story on the shelf" reads "the next story in the
   library" wherever it appears on /stories (house words). /stories only; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
var ORDER=['all','Africa','Americas','Antarctica','Asia','Europe','Middle East','Oceania']; /* alphabetical after All places (Nancy, 29 Oct) */
function words(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),t;
  while(t=w.nextNode()){if(t.nodeValue.indexOf('story on the shelf')>-1)t.nodeValue=t.nodeValue.replace('story on the shelf','story in the library');}}
function chips(){
  var row=document.querySelector('[data-tll-chips="place-sort"] .tll-chip-row');if(!row||row.dataset.tllPlaces)return;
  var have={};[].forEach.call(row.querySelectorAll('[data-tll-place]'),function(c){have[c.getAttribute('data-tll-place')]=c;});
  var model=row.querySelector('.tll-shelf-chip[data-tll-place]');if(!model)return;
  row.dataset.tllPlaces='1';
  var grid=document.querySelector('.tll-lib-grid')||document.querySelector('.tll-library-grid');
  var wired=!!(grid&&grid.dataset.tllChips);
  var added=[];
  ORDER.forEach(function(p){if(have[p])return;var c=model.cloneNode(true);c.setAttribute('data-tll-place',p);c.textContent=p;
    c.className='tll-shelf-chip';c.setAttribute('aria-pressed','false');have[p]=c;added.push(c);});
  /* place every chip in alphabetical order, after the label */
  ORDER.forEach(function(p){if(have[p])row.appendChild(have[p]);});
  if(!wired||!grid)return;
  /* fallback when the page script ran first: filter the same way it does */
  added.forEach(function(c){c.addEventListener('click',function(e){e.preventDefault();var v=c.getAttribute('data-tll-place');
    [].forEach.call(row.querySelectorAll('[data-tll-place]'),function(x){var on=x===c;x.classList.toggle('tll-filter-chip-on',on);x.classList.toggle('tll-shelf-chip',!on);x.setAttribute('aria-pressed',on?'true':'false');});
    var n=0;[].forEach.call(grid.children,function(el){var r=el.querySelector('[data-tll-region]');var show=!!r&&r.textContent.trim()===v;el.style.display=show?'':'none';if(show)n++;});
    var note=document.getElementById('tll-chip-note');if(note)note.remove();
    if(!n){note=document.createElement('div');note.id='tll-chip-note';note.setAttribute('role','status');
      note.style.cssText='border:2px dashed #c9b89a;border-radius:10px;padding:28px;margin-bottom:20px;text-align:center;background:#fff;font-size:14px;color:#3a3a3a';
      note.textContent='No stories from '+v+' yet. Be the first.';grid.parentNode.insertBefore(note,grid);}
  });});
}
function run(){chips();words();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(words,1500);
})();

/* tll-stories-noimg-v1 (29 Oct 2026, Nancy on /stories: "The photo is not coming through"). A story with no hero photo (Zain's
   link-out has none yet) showed a broken image with its alt text, and as the newest story it took the big lead slot. Now:
   1. A card without a photo shows a plain ink panel with the story's country in place of the broken image.
   2. The lead slot goes to the newest story that has a photo; the photo-less one stays in the grid, next in line.
   The page's own scripts keep sorting and filtering; this only steps in when the first visible card has no photo.
   /stories only; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/stories\/?$/.test(location.pathname))return;
var CSS=".tll-noimg{display:flex!important;align-items:flex-end;justify-content:flex-start;box-sizing:border-box;padding:18px 20px;background:#0A0B14!important;color:#F7F1E8;"+
"font:italic 800 clamp(22px,2.4vw,34px)/1.05 'Playfair Display',Georgia,serif;width:100%;aspect-ratio:4/3;overflow:hidden}"+
".tll-noimg span{display:block;max-width:100%;overflow-wrap:anywhere}"+
"[data-tll-lead] .tll-noimg{aspect-ratio:3/2;font-size:clamp(34px,4vw,60px)}";
function noPhoto(img){if(!img)return true;var s=img.getAttribute('src')||'';
  return !s||/placeholder/i.test(s)||img.classList.contains('w-dyn-bind-empty')||(img.complete&&img.naturalWidth===0);}
function cardImg(k){return k.querySelector('.tll-lib-card > img.tll-lib-img, .tll-lib-card img.tll-lib-img:not(.tll-lib-byline-img)');}
function panel(k){
  var img=cardImg(k);if(!img||!noPhoto(img)||k.querySelector('.tll-noimg'))return;
  var c=k.querySelector('[data-tll-country]');var place=(c&&c.textContent.trim())||'';
  var p=document.createElement('div');p.className='tll-noimg';p.setAttribute('aria-hidden','true');
  var t=document.createElement('span');t.textContent=place;p.appendChild(t);
  img.style.display='none';img.insertAdjacentElement('afterend',p);k.setAttribute('data-tll-noimg','1');}
function visible(k){return k.offsetParent!==null&&getComputedStyle(k).display!=='none'&&!k.hasAttribute('data-tll-q-miss');}
var busy=false;
function lead(){
  var g=document.querySelector('.tll-lib-grid');if(!g||busy)return;
  var kids=[].slice.call(g.children).filter(visible);if(kids.length<2)return;
  kids.forEach(panel);
  if(!kids[0].hasAttribute('data-tll-noimg'))return;
  var first=null;for(var i=1;i<kids.length;i++){if(!kids[i].hasAttribute('data-tll-noimg')){first=kids[i];break;}}
  if(!first)return;
  busy=true;g.insertBefore(first,kids[0]);busy=false;
  document.dispatchEvent(new Event('tll:lib-filtered'));}
function run(){
  if(!document.getElementById('tll-stories-noimg-v1')){var s=document.createElement('style');s.id='tll-stories-noimg-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  var g=document.querySelector('.tll-lib-grid');if(!g)return;
  [].forEach.call(g.querySelectorAll('img.tll-lib-img'),function(i){i.addEventListener('error',function(){setTimeout(lead,0);});});
  var t;new MutationObserver(function(){if(busy)return;clearTimeout(t);t=setTimeout(lead,60);}).observe(g,{childList:true,attributes:true,attributeFilter:['style','data-tll-q-miss']});
  setTimeout(lead,0);setTimeout(lead,700);setTimeout(lead,1600);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* tll-linkout-preview-v1 (29 Oct 2026, Nancy: "Build the Open Graph pull"; "I want the photos to always be photos or art, never ads").
   On the /submit link-out form ("Link to a story you already published"), pasting the link asks the Worker for the article's own
   share photo, title and description (GET /link-preview). It shows a preview under the link field, fills Title and One-line summary
   only when they are empty (the writer's own article's words; they can change anything), and sends the photo with the form in a new
   hidden field, og-image, only while "Use this photo" is ticked. The Worker offers a photo only when it is a real photo file of a
   decent size and not ad, logo, icon or banner shaped. No AI writes anything. If the Worker cannot be reached the form works exactly
   as before. Existing field names unchanged; new hidden fields og-image, og-site, og-image-size; no data-ms-* element touched. */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/link-preview?url=';
var CSS=".tll-lp{margin:10px 0 18px;border:1.5px solid #E0DACE;border-radius:4px;background:#FDF9F3;overflow:hidden;font:400 14px/1.45 'Inter Tight',system-ui,sans-serif;color:#0A0B14}"+
".tll-lp[hidden]{display:none!important}"+
".tll-lp-wait,.tll-lp-err{padding:12px 14px;color:#5F5A54}"+
".tll-lp-err{color:#9B2747}"+
".tll-lp-card{display:grid;grid-template-columns:168px minmax(0,1fr);gap:0}"+
".tll-lp-card.tll-lp-noimg{grid-template-columns:1fr}"+
".tll-lp-img{display:block;width:100%;height:100%;min-height:112px;object-fit:cover;background:#E9E2D6}"+
".tll-lp-body{padding:12px 14px;min-width:0}"+
".tll-lp-site{font:600 11px/1.4 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#067A79;margin:0 0 4px}"+
".tll-lp-title{font:700 16px/1.25 'Inter Tight',system-ui,sans-serif;margin:0 0 4px;overflow-wrap:anywhere}"+
".tll-lp-desc{margin:0;color:#3a3a3a;overflow-wrap:anywhere}"+
".tll-lp-foot{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;padding:10px 14px;border-top:1px solid #E0DACE;font-size:13px;color:#5F5A54}"+
".tll-lp-foot label{display:inline-flex;align-items:center;gap:8px;color:#0A0B14;cursor:pointer;min-height:32px}"+
".tll-lp-foot input{width:18px;height:18px;accent-color:#C8325B;margin:0}"+
"@media (max-width:560px){.tll-lp-card{grid-template-columns:1fr}.tll-lp-img{height:180px}}";
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function hidden(form,name){var i=form.querySelector('input[type="hidden"][name="'+name+'"]');if(!i){i=document.createElement('input');i.type='hidden';i.name=name;i.setAttribute('data-name',name);form.appendChild(i);}return i;}
function setVal(input,v){if(!input||input.value.trim())return false;input.value=v;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));return true;}
function run(){
  var form=document.querySelector('form[data-tll-form="link-out-story"]');if(!form||form.dataset.tllLp)return;
  var url=form.querySelector('input[name="external-url"]');if(!url)return;
  form.dataset.tllLp='1';
  if(!document.getElementById('tll-linkout-preview-v1')){var s=document.createElement('style');s.id='tll-linkout-preview-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  var title=form.querySelector('input[name="field-5"]'),summary=form.querySelector('input[name="summary"]');
  var ogImg=hidden(form,'og-image'),ogSite=hidden(form,'og-site'),ogSize=hidden(form,'og-image-size');
  var box=el('div','tll-lp');box.hidden=true;box.setAttribute('aria-live','polite');
  var field=url.closest('label')||url;field.insertAdjacentElement('afterend',box);
  var last='',timer=0,seq=0;
  function clear(){ogImg.value='';ogSite.value='';ogSize.value='';}
  function show(node){box.textContent='';box.appendChild(node);box.hidden=false;}
  function look(){
    var v=(url.value||'').trim();if(v===last)return;last=v;clear();
    if(!/^https?:\/\/[^\s/]+\.[^\s]+$/i.test(v)){box.hidden=true;return;}
    var my=++seq;show(el('div','tll-lp-wait','Reading the link…'));
    fetch(API+encodeURIComponent(v),{credentials:'omit'}).then(function(r){
      if(r.status===404||r.status===405)return null; /* the Worker route is not live yet: stay quiet */
      return r.json().catch(function(){return null;});
    }).then(function(d){
      if(my!==seq)return;
      if(!d){box.hidden=true;return;}
      if(!d.ok){show(el('div','tll-lp-err',(d.reason||'That link could not be read.')+' You can still send it: add a title and a one-line summary.'));return;}
      var card=el('div','tll-lp-card'+(d.image?'':' tll-lp-noimg'));
      if(d.image){var im=el('img','tll-lp-img');im.src=d.image;im.alt=d.imageAlt||'';im.loading='lazy';
        im.addEventListener('error',function(){im.remove();card.classList.add('tll-lp-noimg');ogImg.value='';use&&(use.checked=false,use.disabled=true);});card.appendChild(im);}
      var body=el('div','tll-lp-body');body.appendChild(el('p','tll-lp-site',d.siteName||''));
      if(d.title)body.appendChild(el('p','tll-lp-title',d.title));if(d.description)body.appendChild(el('p','tll-lp-desc',d.description));
      card.appendChild(body);
      var wrap=el('div');wrap.appendChild(card);
      var foot=el('div','tll-lp-foot'),use=null;
      if(d.image){var lab=el('label');use=el('input');use.type='checkbox';use.checked=true;lab.appendChild(use);lab.appendChild(document.createTextNode('Use this photo from the article'));foot.appendChild(lab);
        ogImg.value=d.image;ogSize.value=(d.imageWidth||'')+'x'+(d.imageHeight||'');
        use.addEventListener('change',function(){ogImg.value=use.checked?d.image:'';});}
      else if(d.imageNote){foot.appendChild(el('span','',d.imageNote+' Your card shows the country instead.'));}
      ogSite.value=d.siteName||'';
      var filled=[];if(title&&d.title&&setVal(title,d.title))filled.push('Title');if(summary&&d.description&&setVal(summary,d.description.slice(0,200)))filled.push('One-line summary');
      if(filled.length)foot.appendChild(el('span','',filled.join(' and ')+' filled from the article. Change anything.'));
      if(foot.childNodes.length)wrap.appendChild(foot);
      show(wrap);
    }).catch(function(){if(my===seq)box.hidden=true;});
  }
  function soon(){clearTimeout(timer);timer=setTimeout(look,500);}
  url.addEventListener('input',soon);url.addEventListener('paste',function(){setTimeout(look,0);});url.addEventListener('change',look);url.addEventListener('blur',look);
  if(url.value)look();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();

/* tll-linkout-summary-v1 (31 Oct 2026, Nancy: "building the AI summary box for linked articles and pulling in OG images or having a
   backup option"). Works beside tll-linkout-preview-v1 on the /submit link-out form.
   1. AI summary box: once the link reads, asks the Worker (GET /link-summary) for a short neutral summary of the linked article and
      shows it under the preview, labeled "Summary by AI, from the linked article". It is never put into the writer's own fields; the
      published story shows the same labeled box. If the Worker has no key yet or the article cannot be read, no box shows.
   2. Backup photo: when the article has no usable photo, or the writer unticks it, an optional "Your own photo" upload appears
      (field name hero-image, cleaned and uploaded by photo-clean like every other photo field). The Worker uses the article photo
      first, then this one, else the country card. No data-ms-* element touched; existing field names unchanged. */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/link-summary?url=';
var CSS=".tll-ls{margin:-8px 0 18px;border:1.5px solid #E0DACE;border-top:0;border-radius:0 0 4px 4px;background:#fff;padding:12px 14px;font:400 15px/1.5 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}"+
".tll-ls[hidden],.tll-own[hidden]{display:none!important}"+
".tll-ls-k{font:600 11px/1.4 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#067A79;margin:0 0 6px}"+
".tll-ls p{margin:0}.tll-ls-wait{color:#5F5A54}"+
".tll-own{margin:0 0 18px;padding:12px 14px;border:1.5px dashed #E0DACE;border-radius:4px;font:400 14px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54}"+
".tll-own b{display:block;color:#0A0B14;font-weight:600;margin:0 0 4px}.tll-own input{display:block;margin-top:8px;font:inherit;max-width:100%}";
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function run(){
  var form=document.querySelector('form[data-tll-form="link-out-story"]');if(!form||form.dataset.tllLs)return;
  var url=form.querySelector('input[name="external-url"]'),lp=form.querySelector('.tll-lp');if(!url||!lp)return;
  form.dataset.tllLs='1';
  if(!document.getElementById('tll-linkout-summary-v1')){var s=document.createElement('style');s.id='tll-linkout-summary-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  var box=el('div','tll-ls');box.hidden=true;box.setAttribute('aria-live','polite');lp.insertAdjacentElement('afterend',box);
  var own=el('div','tll-own');own.hidden=true;
  own.appendChild(el('b','','Your own photo (optional)'));
  own.appendChild(document.createTextNode("The article has no photo we can use. Add one of yours, or leave it and the card shows the country."));
  var file=form.querySelector('input[type="file"][name="hero-image"]');
  if(!file){file=el('input');file.type='file';file.name='hero-image';file.setAttribute('data-name','hero-image');file.accept='image/jpeg,image/png,image/webp,image/heic';}
  own.appendChild(file);box.insertAdjacentElement('afterend',own);
  var ogImg=form.querySelector('input[name="og-image"]');
  var last='',seq=0;
  function photoCheck(){
    var reading=!lp.hidden&&lp.querySelector('.tll-lp-wait');
    own.hidden=lp.hidden||!!reading||!!(ogImg&&ogImg.value);
  }
  function summary(){
    var v=(url.value||'').trim();
    if(lp.hidden||lp.querySelector('.tll-lp-wait')||!/^https?:\/\//i.test(v)){if(lp.hidden){box.hidden=true;last='';}return;}
    if(v===last)return;last=v;var my=++seq;
    box.textContent='';box.appendChild(el('p','tll-ls-k','Summary by AI, from the linked article'));box.appendChild(el('p','tll-ls-wait','Reading the article…'));box.hidden=false;
    fetch(API+encodeURIComponent(v),{credentials:'omit'}).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;}).then(function(d){
      if(my!==seq)return;
      if(!d||!d.ok||!d.summary){box.hidden=true;return;}
      box.textContent='';box.appendChild(el('p','tll-ls-k',d.label||'Summary by AI, from the linked article'));box.appendChild(el('p','',d.summary));box.hidden=false;
    });
  }
  function tick(){photoCheck();summary();}
  new MutationObserver(tick).observe(lp,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  form.addEventListener('change',function(e){if(e.target&&e.target.type==='checkbox')setTimeout(photoCheck,0);});
  tick();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1600);setTimeout(run,3500);
})();

/* tll-byline-links-v1 (29 Oct 2026, Nancy on /stories: "When I click the user names here it does not take me to their profile").
   Each story card is one link to the story, so the writer's name and photo inside it went to the story too (a link cannot sit
   inside a link). The name and the small photo in a card byline (.tll-lib-byline-name, .tll-lib-byline-img) now open the writer's
   page, /contributors/{slug}, where the slug is the writer's name the way Webflow makes slugs (Nancy Carleton -> nancy-carleton).
   They act as links for mouse, touch and keyboard (role=link, Enter). Every other part of the card still opens the story.
   Nothing removed; no data-ms-* element touched. */
(function(){
function slug(name){return String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
var CSS=".tll-lib-byline-name[data-tll-bl]{cursor:pointer;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}"+
".tll-lib-byline-name[data-tll-bl]:hover{color:#C8325B!important}"+
".tll-lib-byline-name[data-tll-bl]:focus-visible,.tll-lib-byline-img[data-tll-bl]:focus-visible{outline:3px solid #C8325B;outline-offset:2px;border-radius:2px}"+
".tll-lib-byline-img[data-tll-bl]{cursor:pointer}";
/* The name element can also hold the place line (data-s3-place, "Sao Paulo, Brazil"), so read only its own text. */
function nameOf(n){if(!n)return '';var own='';[].forEach.call(n.childNodes,function(c){if(c.nodeType===3)own+=c.nodeValue;});own=own.trim();
  if(own)return own;var c=n.cloneNode(true);[].forEach.call(c.querySelectorAll('[data-s3-place],[data-tll-place]'),function(x){x.remove();});
  var first=c.firstElementChild;return (first?first.textContent:c.textContent).trim();}
function hrefFor(card){var s=slug(nameOf(card.querySelector('.tll-lib-byline-name')));return s?'/contributors/'+s:'';}
function wire(){
  var names=document.querySelectorAll('.tll-lib-byline-name:not([data-tll-bl])');if(!names.length)return;
  if(!document.getElementById('tll-byline-links-v1')){var st=document.createElement('style');st.id='tll-byline-links-v1';st.textContent=CSS;(document.body||document.head).appendChild(st);}
  [].forEach.call(names,function(n){
    var card=n.closest('.tll-lib-byline')||n.parentElement;var href=hrefFor(card);if(!href)return;
    [n,card.querySelector('.tll-lib-byline-img')].forEach(function(el){if(!el||el.getAttribute('data-tll-bl'))return;
      el.setAttribute('data-tll-bl',href);el.setAttribute('role','link');el.setAttribute('tabindex','0');
      if(el===n)el.setAttribute('aria-label',nameOf(n)+', writer page');else el.setAttribute('aria-hidden','true');});
  });
}
function go(e){var t=e.target.closest&&e.target.closest('[data-tll-bl]');if(!t)return;
  if(e.type==='keydown'&&e.key!=='Enter')return;
  e.preventDefault();e.stopPropagation();
  var href=t.getAttribute('data-tll-bl');if(e.metaKey||e.ctrlKey)window.open(href,'_blank','noopener');else location.href=href;}
document.addEventListener('click',go,true);document.addEventListener('keydown',go,true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
setTimeout(wire,800);setTimeout(wire,2000);
})();

/* tll-mbar-align-v1 (29 Oct 2026, Nancy on /account: "The overview, profile... etc seems too left aligned and not consistent with the
   design"). The member bar (OVERVIEW PROFILE MAP PETS CONTRIBUTIONS SETTINGS, nav.tll-mbar on /account, /edit-profile, /the-map and
   /my-pets) ran from the very left edge of the window while the page content sits in a centered column. The bar keeps its full-width
   rule, and its links now start where the content column starts (the site's 1208 px column, 24 px gutters on small screens). The
   current page line is the light-background rose #C8325B. Same element and links; nothing removed; no data-ms-* element touched. */
(function(){
var CSS="html body nav.tll-mbar{box-sizing:border-box;width:100%;padding-left:max(24px,calc((100% - 1208px) / 2 + 12px))!important;padding-right:max(24px,calc((100% - 1208px) / 2 + 12px))!important;column-gap:28px}"+
"html body nav.tll-mbar a[aria-current=\"page\"]{border-bottom-color:#C8325B}"+
"html body nav.tll-mbar a:focus-visible{outline-color:#C8325B}"+
"@media (max-width:767px){html body nav.tll-mbar{padding-left:24px!important;padding-right:24px!important;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;column-gap:22px}html body nav.tll-mbar::-webkit-scrollbar{display:none}html body nav.tll-mbar a{flex:0 0 auto}}";
function add(){if(document.getElementById('tll-mbar-align-v1'))return;var s=document.createElement('style');s.id='tll-mbar-align-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
add();
})();

/* tll-story-fixes-1029-v1 (29 Oct 2026, Nancy's notes).
   1. "The New Orleans card should show a US flag": the site flag script (tllflagsv5) only knows country names, so a label like
      "NEW ORLEANS, LOUISIANA" got no flag. A label whose last part is a US state (Georgia is left to the country flag) or Washington DC, now gets the US flag, drawn the
      same way (22 px round flag before the text) only when no flag is there yet.
   2. Story pages: the related-stories heading "Other stops on this layover" shows the same traveler's other stories, so it reads
      "Other stories from this frequent traveler" (rose italic on "traveler", as before on "layover").
   Same elements; nothing removed; no data-ms-* element touched. */
(function(){
var SET={};'alabama alaska arizona arkansas california colorado connecticut delaware florida hawaii idaho illinois indiana iowa kansas kentucky louisiana maine maryland massachusetts michigan minnesota mississippi missouri montana nebraska nevada ohio oklahoma oregon pennsylvania tennessee texas utah vermont virginia washington wisconsin wyoming dc'.split(' ').forEach(function(s){SET[s]=1;});
['new hampshire','new jersey','new mexico','new york','north carolina','north dakota','rhode island','south carolina','south dakota','west virginia','district of columbia','washington dc'].forEach(function(s){SET[s]=1;});
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z ]+/g,' ').replace(/\s+/g,' ').trim();}
function flags(){
  [].forEach.call(document.querySelectorAll('.tll-lib-meta,.tll-story-byline-loc,[data-tll-crumb=country]'),function(e){
    if(e.__usf||e.querySelector('img[src*="flag"]'))return;
    var parts=e.textContent.split(',');var last=norm(parts[parts.length-1]);if(!SET[last])return;
    e.__usf=1;
    var w=document.createElement('span');w.setAttribute('aria-hidden','true');w.style.cssText='display:inline-flex;vertical-align:-6px;margin-right:6px';
    var i=document.createElement('img');i.src='https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/us.svg';i.alt='';i.onerror=function(){i.remove();};
    i.style.cssText='width:22px;height:22px;border-radius:50%';w.appendChild(i);e.insertBefore(w,e.firstChild);
  });
}
function heading(){
  [].forEach.call(document.querySelectorAll('.tll-related-header h1,.tll-related-header h2,.tll-related-header h3'),function(h){
    if(h.dataset.tllRh||!/other stops on this\s*layover/i.test(h.textContent.replace(/\s+/g,' ')))return;h.dataset.tllRh='1';
    var em=h.querySelector('em,.tll-text-rose');
    if(em){[].forEach.call(h.childNodes,function(n){if(n.nodeType===3&&/Other stops on this/i.test(n.nodeValue))n.nodeValue='Other stories from this frequent ';});em.textContent='traveler';}
    else h.textContent='Other stories from this frequent traveler';
  });
}
/* flags run after the site flag script (DOMContentLoaded and 1200 ms), so a country it knows always wins; Georgia is left to it. */
function later(){setTimeout(flags,1400);setTimeout(flags,2600);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){heading();later();});else{heading();later();}
setTimeout(heading,1300);
})();

/* tll-email-hello-v1 (29 Oct 2026, Nancy: "Any mentions of emails on the site should go to hello@thatlayover.life"). The only mailbox
   is hello@thatlayover.life. Any other @thatlayover.life address on a page (press@, partnerships@ on the writer page contact cards,
   or any other) is shown and linked as hello@thatlayover.life; a mailto subject line is kept. Runs on every page and again for content
   that arrives late. The page sources are being corrected too; this is the safety net. Nothing removed; no data-ms-* element touched. */
(function(){
var HELLO='hello@thatlayover.life';
var RE=/\b(?!hello@)[A-Za-z0-9._%+-]+@thatlayover\.life\b/gi;
function fix(root){
  [].forEach.call((root||document).querySelectorAll('a[href^="mailto:"]'),function(a){var h=a.getAttribute('href');var n=h.replace(/^mailto:[^?]*/i,function(m){return /@thatlayover\.life$/i.test(m)&&!/^mailto:hello@/i.test(m)?'mailto:'+HELLO:m;});if(n!==h)a.setAttribute('href',n);});
  var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT),t;
  while(t=w.nextNode()){if(t.nodeValue.indexOf('@thatlayover.life')>-1){var v=t.nodeValue.replace(RE,HELLO);if(v!==t.nodeValue)t.nodeValue=v;}}
  [].forEach.call((root||document).querySelectorAll('input[placeholder*="@thatlayover.life"],[aria-label*="@thatlayover.life"]'),function(el){['placeholder','aria-label'].forEach(function(k){var v=el.getAttribute(k);if(v)el.setAttribute(k,v.replace(RE,HELLO));});});
}
function run(){if(!document.body)return;fix(document.body);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);setTimeout(run,3000);
})();

/* tll-ep-marks-v1 (29 Oct 2026, tester Mariam's screenshot of /edit-profile). When the account save works but the public page update
   does not (the bar reads "Saved to your account. Your public page did not update yet: ..."), the page still marked each field
   "Not saved. Try again" in error red, which says the writing was lost. It was not. Those field marks now read "Saved. Public page
   pending" as one small line under the label, in plain ink with the same retry on tap; a real failure (nothing saved) keeps the red "Not saved".
   /edit-profile only; same elements; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/edit-profile\/?$/.test(location.pathname))return;
var CSS="html body .ep-saved.ep-saved--pending{display:block!important;width:auto!important;max-width:100%!important;margin:4px 0 0!important;padding:0!important;border:0!important;background:transparent!important;color:#5F5A54!important;font:400 12px/1.35 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif!important;letter-spacing:0!important;text-transform:none!important;white-space:normal!important;text-align:left!important;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px;cursor:pointer}";
function accountOk(){var s=document.querySelector('[data-ep-status]');return !!s&&/saved to your account/i.test(s.textContent||'');}
function fix(){if(!accountOk())return;[].forEach.call(document.querySelectorAll('.ep-saved--fail:not(.ep-saved--pending)'),function(m){m.classList.add('ep-saved--pending');m.textContent='Saved. Public page pending';m.title='Saved to your account. Tap to try the public page again.';});}
function run(){
  if(!document.getElementById('tll-ep-marks-v1')){var s=document.createElement('style');s.id='tll-ep-marks-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
  var t=0;new MutationObserver(function(){clearTimeout(t);t=setTimeout(fix,30);}).observe(document.body,{childList:true,subtree:true,characterData:true});fix();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* tll-ep-help-v1 (29 Oct 2026, tester Roberta: "The question mark/help does not work"; "I couldn't make out what One line meant").
   1. The small "i" help marks (.ep-i on /edit-profile, and any [data-tll-tip] mark) only had a hover title, so a tap or a keyboard
      press showed nothing. They are now buttons: tap, click, Enter or Space opens a small note with the same words under the label;
      a second tap, Escape or a tap elsewhere closes it. Screen readers get the note through aria-describedby.
   2. "One line" is labeled "Tagline", with a visible hint and an example placeholder. Same input and field name (one-line).
   /edit-profile marks plus any page that uses .ep-i; nothing removed; no data-ms-* element touched. */
(function(){
var CSS=".ep-i[data-tll-help]{cursor:pointer;-webkit-tap-highlight-color:transparent}"+
".ep-i[data-tll-help]:focus-visible{outline:3px solid #C8325B;outline-offset:2px;border-radius:50%}"+
".tll-help-note{display:block;margin:8px 0 2px;padding:10px 12px;max-width:520px;border-left:3px solid #067A79;background:#E8F4F3;color:#0A0B14;"+
"font:400 14px/1.45 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif;letter-spacing:0;text-transform:none;border-radius:2px}"+
".tll-help-note[hidden]{display:none!important}"+
".tll-tagline-hint{margin:6px 0 0;font:400 13px/1.45 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif;color:#5F5A54}";
var n=0,open=null;
function close(){if(!open)return;open.note.hidden=true;open.mark.setAttribute('aria-expanded','false');open=null;}
function wire(mark){
  if(mark.dataset.tllHelp)return;var text=mark.getAttribute('aria-label')||mark.getAttribute('title')||mark.getAttribute('data-tll-tip')||'';if(!text)return;
  mark.dataset.tllHelp='1';mark.setAttribute('role','button');mark.setAttribute('tabindex','0');mark.setAttribute('aria-expanded','false');
  mark.setAttribute('aria-label','What is this?');mark.removeAttribute('title');
  var note=document.createElement('span');note.className='tll-help-note';note.id='tll-help-'+(++n);note.hidden=true;note.textContent=text;
  mark.setAttribute('aria-controls',note.id);mark.setAttribute('aria-describedby',note.id);
  var host=mark.closest('label,.ep-label,legend,h2,h3')||mark.parentNode;host.insertAdjacentElement('afterend',note);
  function toggle(e){e.preventDefault();e.stopPropagation();if(open&&open.mark===mark){close();return;}close();note.hidden=false;mark.setAttribute('aria-expanded','true');open={mark:mark,note:note};}
  mark.addEventListener('click',toggle);
  mark.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')toggle(e);if(e.key==='Escape')close();});
}
function tagline(){
  var input=document.getElementById('ep-f-one-line');if(!input||input.dataset.tllTag)return;input.dataset.tllTag='1';
  var lab=document.querySelector('label[for="ep-f-one-line"]');
  if(lab){[].forEach.call(lab.childNodes,function(c){if(c.nodeType===3&&/One line/i.test(c.nodeValue))c.nodeValue=c.nodeValue.replace(/One line/i,'Tagline');});}
  if(!input.placeholder)input.placeholder='Example: I finish bucket lists. Then I rebuild them.';
  var hint=document.createElement('p');hint.className='tll-tagline-hint';hint.textContent='A short line that sits under your name on your page and on the Travelers list. Not a job title.';
  input.insertAdjacentElement('afterend',hint);
}
function run(){
  if(!document.getElementById('tll-ep-help-v1')){var s=document.createElement('style');s.id='tll-ep-help-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
  [].forEach.call(document.querySelectorAll('.ep-i,[data-tll-tip]'),wire);tagline();
}
document.addEventListener('click',function(e){if(open&&!open.note.contains(e.target))close();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);setTimeout(run,3000);
})();

/* tll-expert-from-v1 (29 Oct 2026, tester Roberta on the Location Expert application: "It did not ask where I am from"). The
   /for-expats "Claim your desk" form (#tll-expert-apply) gets one more field in its grid, "Where you are from" (name from-country,
   optional), built like the fields beside it, with country suggestions when the page offers its country list. It travels with the
   existing Webflow form submission. Existing fields unchanged; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/for-expats\/?$/.test(location.pathname))return;
function run(){
  var city=document.getElementById('le-city');if(!city||document.getElementById('le-from'))return;
  var grid=city.closest('.tllpr-grid');var years=document.getElementById('le-years');
  var model=(years&&years.parentElement)||city.parentElement;if(!grid||!model)return;
  var wrap=model.cloneNode(true);var lab=wrap.querySelector('label');var inp=wrap.querySelector('input');if(!lab||!inp)return;
  lab.setAttribute('for','le-from');lab.textContent='Where you are from (optional)';
  inp.id='le-from';inp.name='from-country';inp.setAttribute('data-name','from-country');inp.value='';inp.removeAttribute('required');
  inp.placeholder='The country you grew up in';inp.autocomplete='country-name';
  if(document.getElementById('tll-country-list'))inp.setAttribute('list','tll-country-list');
  grid.appendChild(wrap);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);
})();

/* tll-submit-gallery-v1 (29 Oct 2026; captions and placement added 31 Oct 2026, see below; tester Roberta Bianchi on /submit: "I could only upload one hero image and 1 gallery image.
   I could not select several images for the gallery" and "I would make the autosave part more clear.").
   STAGED: not in the published bundle until Nancy says yes.

   Why it happened: the gallery field (name photo-gallery) already allows several photos, but every new pick replaces the last one,
   and the page never shows what is chosen. Picking photos one at a time left only the last photo.

   What this does on /submit only, story form (form[data-tll-form="submit-story"]):
   1. Gallery: each pick is added to the photos already chosen (same photo twice is skipped), up to the limit in the field's label
      (12 today). A row of small previews with a Remove button on each, a count ("3 of 12 photos chosen") and an "Add more photos"
      button sit under the field. The field itself keeps its name; the chosen photos are put back into it, so the existing photo script
      (tllphotocleanv11) strips location data and uploads all of them on Send exactly as before. No new upload code.
   2. Cover photo: a preview and the line "This is your cover photo. Add more photos in the gallery below."
   3. Autosave line (from the footer script tll-form-steps-js-v2): readable 13px text instead of 10px mono, and plain wording.
      Before the first save: "Your words save as a draft every 20 seconds. Photos are added when you send."
      After each save: "Draft saved · 2:41 PM" plus where it is kept (this device, and your account when signed in).
      When a draft was brought back on load: "Draft restored from your last visit."
      Reads the existing draft key only to know a draft was restored; writes nothing new.
   Nothing removed; field names unchanged; no data-ms-* element touched. */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var FORM='form[data-tll-form="submit-story"]';
var CSS=
".tll-sg{margin:10px 0 4px}"+
".tll-sg-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:10px;margin:0 0 10px;padding:0;list-style:none}"+
".tll-sg-row:empty{display:none}"+
".tll-sg-item{position:relative;margin:0;border:1px solid #E0DACE;border-radius:8px;overflow:hidden;background:#FBF7F0;aspect-ratio:1/1}"+
".tll-sg-item img{display:block;width:100%;height:100%;object-fit:cover}"+
".tll-sg-name{display:flex;align-items:center;justify-content:center;height:100%;padding:8px;box-sizing:border-box;font:400 12px/1.3 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54;text-align:center;overflow-wrap:anywhere}"+
".tll-sg-rm{position:absolute;top:4px;right:4px;min-width:44px;min-height:32px;padding:0 10px;border:0;border-radius:999px;background:rgba(10,11,20,.82);color:#fff;font:600 12px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;cursor:pointer}"+
".tll-sg-rm:focus-visible,.tll-sg-add:focus-visible{outline:3px solid #C8325B;outline-offset:2px}"+
".tll-sg-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px}"+
".tll-sg-count{font:600 14px/1.4 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}"+
".tll-sg-add{min-height:44px;padding:0 18px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;cursor:pointer}"+
".tll-sg-add[hidden]{display:none}"+
".tll-sg-help{margin:6px 0 0;font:400 13px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54}"+
".tll-sg-note{margin:6px 0 0;font:400 13px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#C8325B}"+
".tll-sg-note:empty{display:none}"+
".tll-sg-hero{display:flex;gap:12px;align-items:center;margin:10px 0 4px}"+
".tll-sg-hero[hidden]{display:none}"+
".tll-sg-hero .tll-sg-item{width:100%;aspect-ratio:16/9}"+
/* captions and placement (31 Oct 2026) */
".tll-cp{margin:12px 0 4px;padding:0;list-style:none;display:grid;gap:10px}.tll-cp:empty{display:none}"+
".tll-cp-h{margin:14px 0 4px;font:600 11px/1.4 'JetBrains Mono',ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79}"+
".tll-cp li{display:grid;grid-template-columns:56px minmax(0,1fr);gap:6px 12px;align-items:start}"+
".tll-cp img,.tll-cp .tll-cp-x{grid-row:span 2;width:56px;height:56px;object-fit:cover;border-radius:6px;background:#FBF7F0;font:400 11px/1.2 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54;overflow:hidden}"+
".tll-cp input,.tll-cp select,.tll-cap-cover{width:100%;min-height:44px;padding:8px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;font:400 15px/1.3 'IBM Plex Sans Condensed',system-ui,sans-serif;box-sizing:border-box}"+
".tll-cp label,.tll-cap-lab{display:block;font:600 13px/1.3 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}"+
".tll-cp small,.tll-cap-help{display:block;margin:2px 0 0;font:400 12px/1.4 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54}"+
/* autosave line */
"html body .tllst-save{font:400 13px/1.45 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif!important;letter-spacing:0!important;text-transform:none!important;color:#5F5A54!important;margin-top:10px!important}"+
"html body .tllst-save b{font-weight:600;color:#0A0B14}"+
"html body .tllst-save .tll-sg-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#067A79;margin-right:8px;vertical-align:1px}";

function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function key(f){return [f.name,f.size].join('|');}   /* same name and size = same photo; pickers can give a fresh time on each pick */
var canSet=(function(){try{return typeof DataTransfer==='function'&&!!new DataTransfer().items;}catch(e){return false;}})();
function setFiles(inp,list){if(!canSet)return false;try{var dt=new DataTransfer();list.forEach(function(f){dt.items.add(f);});inp.files=dt.files;return true;}catch(e){return false;}}
function thumb(f,onRemove,label){
  var li=el('li','tll-sg-item');var url='';
  if(/^image\//.test(f.type)){url=URL.createObjectURL(f);var i=document.createElement('img');i.alt='';i.src=url;
    i.onerror=function(){i.remove();li.insertBefore(el('span','tll-sg-name',f.name),li.firstChild);};li.appendChild(i);}
  else li.appendChild(el('span','tll-sg-name',f.name));
  if(onRemove){var b=el('button','tll-sg-rm','Remove');b.type='button';b.setAttribute('aria-label','Remove '+(label||f.name));b.addEventListener('click',function(){if(url)URL.revokeObjectURL(url);onRemove();});li.appendChild(b);}
  li.__url=url;return li;
}
function clearRow(row){[].forEach.call(row.children,function(li){if(li.__url)URL.revokeObjectURL(li.__url);});row.textContent='';}

/* Captions and placement (31 Oct 2026, Roberta: "Could you add captions or choose where each photo sits?").
   Each gallery photo gets an optional caption (200 characters) and a "Where it goes" menu built from the headings the writer typed
   (a short line on its own with no closing punctuation), or "Gallery at the end". The choices travel in one hidden field,
   photo-plan, as JSON in gallery order: [{"n":1,"name":"IMG_2.jpg","caption":"...","after":"The Art of Arriving First"}].
   The cover photo gets a caption field, cover-caption. The builder copies them to the story's Photo placements row. */
var CAPMAX=200;
function headings(form){var b=form.querySelector('textarea[name="body"]');if(!b)return[];var seen={},out=[];
  String(b.value||'').split(/\n/).forEach(function(l){var t=l.trim();if(t.length<3||t.length>90||/[.!?…:;,"”')\]]$/.test(t)||t.split(/\s+/).length>14||seen[t])return;seen[t]=1;out.push(t);});return out;}
function planField(form){var h=form.querySelector('input[name="photo-plan"]');if(!h){h=document.createElement('input');h.type='hidden';h.name='photo-plan';h.setAttribute('data-name','photo-plan');form.appendChild(h);}return h;}
function gallery(form){
  var inp=form.querySelector('input[type="file"][name="photo-gallery"]');if(!inp||inp.__tllSg)return;inp.__tllSg=1;
  inp.multiple=true;
  var field=inp.closest('label')||inp;           /* the list sits outside the label so a tap on Remove never opens the picker */
  var lab=field.querySelector&&field.querySelector('.tll-pen-label');
  var m=lab&&/up to\s*(\d+)/i.exec(lab.textContent);var MAX=m?parseInt(m[1],10):12;
  var kept=[];
  var box=el('div','tll-sg');var row=el('ul','tll-sg-row');row.setAttribute('aria-label','Gallery photos chosen');
  var bar=el('div','tll-sg-bar');var count=el('span','tll-sg-count');count.setAttribute('aria-live','polite');
  var add=el('button','tll-sg-add','Add more photos');add.type='button';add.addEventListener('click',function(){inp.click();});
  bar.appendChild(count);bar.appendChild(add);
  var note=el('p','tll-sg-note');note.setAttribute('role','status');
  var help=el('p','tll-sg-help',canSet?'Pick several photos at once, or add more with another pick. They upload when you send.'
                                      :'Pick all your gallery photos at once: hold one photo, then tap the others. They upload when you send.');
  var capH=el('p','tll-cp-h','Captions and placement (optional)');capH.hidden=true;var plan=el('ul','tll-cp');var meta={};
  box.appendChild(row);box.appendChild(bar);box.appendChild(note);box.appendChild(help);box.appendChild(capH);box.appendChild(plan);
  field.parentNode.insertBefore(box,field.nextSibling);
  var hidden=planField(form);
  function save(){var out=[];kept.forEach(function(f,i){var m=meta[key(f)]||{};if((m.caption||'').trim()||(m.after&&m.after!=='gallery'))out.push({n:i+1,name:f.name,caption:(m.caption||'').trim().slice(0,CAPMAX),after:m.after&&m.after!=='gallery'?m.after:'gallery'});});hidden.value=out.length?JSON.stringify(out):'';}
  function fill(sel,cur){var hs=headings(form);sel.textContent='';var o=document.createElement('option');o.value='gallery';o.textContent='Gallery at the end';sel.appendChild(o);
    hs.forEach(function(h){var x=document.createElement('option');x.value=h;x.textContent='After: '+h;sel.appendChild(x);});
    if(cur&&cur!=='gallery'&&hs.indexOf(cur)<0){var y=document.createElement('option');y.value=cur;y.textContent='After: '+cur;sel.appendChild(y);}sel.value=cur||'gallery';}
  function renderPlan(){plan.textContent='';capH.hidden=!kept.length;
    kept.forEach(function(f,i){var k=key(f),m=meta[k]||(meta[k]={caption:'',after:'gallery'});var li=document.createElement('li');
      var th;if(/^image\//.test(f.type)){th=document.createElement('img');th.alt='';th.src=URL.createObjectURL(f);th.onload=function(){URL.revokeObjectURL(th.src);};}else th=el('span','tll-cp-x',f.name);li.appendChild(th);
      var id='tll-cp-'+i;var c=el('div');var lb=el('label',null,'Caption for photo '+(i+1));lb.setAttribute('for',id);var inp2=document.createElement('input');inp2.id=id;inp2.type='text';inp2.maxLength=CAPMAX;inp2.value=m.caption;inp2.placeholder='What are we looking at?';
      var cnt=el('small',null,'');function cc(){cnt.textContent=(inp2.value.length)+' of '+CAPMAX;}cc();inp2.addEventListener('input',function(){m.caption=inp2.value;cc();save();});c.appendChild(lb);c.appendChild(inp2);c.appendChild(cnt);li.appendChild(c);
      var d=el('div');var lb2=el('label',null,'Where it goes');lb2.setAttribute('for',id+'-w');var sel=document.createElement('select');sel.id=id+'-w';fill(sel,m.after);
      sel.addEventListener('focus',function(){fill(sel,m.after);});sel.addEventListener('change',function(){m.after=sel.value;save();});d.appendChild(lb2);d.appendChild(sel);li.appendChild(d);plan.appendChild(li);});
    save();}
  function render(){
    clearRow(row);
    kept.forEach(function(f,i){row.appendChild(thumb(f,function(){kept.splice(i,1);setFiles(inp,kept);note.textContent='';render();},'photo '+(i+1)+' of '+kept.length+', '+f.name));});
    count.textContent=kept.length?(kept.length+' of '+MAX+' photo'+(MAX===1?'':'s')+' chosen'):'No gallery photos yet';
    add.textContent=kept.length?'Add more photos':'Choose photos';
    add.hidden=!canSet||kept.length>=MAX;
    renderPlan();
  }
  inp.addEventListener('change',function(){
    var picked=[].slice.call(inp.files||[]);
    if(!canSet){kept=picked.slice(0,MAX);note.textContent=picked.length>MAX?'Only the first '+MAX+' photos are kept.':'';render();return;}
    if(!picked.length){setFiles(inp,kept);render();return;}   /* picker closed with nothing: keep what was chosen */
    var seen={};kept.forEach(function(f){seen[key(f)]=1;});
    var added=0,skipped=0,dropped=0;
    picked.forEach(function(f){if(seen[key(f)]){skipped++;return;}if(kept.length>=MAX){dropped++;return;}seen[key(f)]=1;kept.push(f);added++;});
    setFiles(inp,kept);
    note.textContent=dropped?('The gallery holds '+MAX+' photos. '+dropped+' photo'+(dropped===1?' was':'s were')+' not added.'):(skipped&&!added?'That photo is already in the gallery.':'');
    render();
  });
  render();
}

function hero(form){
  var inp=form.querySelector('input[type="file"][name="hero-image"]');if(!inp||inp.__tllSg)return;inp.__tllSg=1;
  var field=inp.closest('label')||inp;
  var box=el('div','tll-sg-hero');box.hidden=true;var row=el('ul','tll-sg-row');row.style.cssText='margin:0;display:block;flex:0 0 120px;width:120px';
  var txt=el('p','tll-sg-help','This is your cover photo. Add more photos in the gallery below.');txt.style.margin='0';
  var wrap=el('div');wrap.appendChild(txt);
  if(!form.querySelector('input[name="cover-caption"]')){var cl=el('label','tll-cap-lab','Cover caption (optional)');cl.setAttribute('for','tll-cap-cover');cl.style.marginTop='8px';
    var ci=document.createElement('input');ci.type='text';ci.id='tll-cap-cover';ci.name='cover-caption';ci.setAttribute('data-name','cover-caption');ci.className='tll-cap-cover';ci.maxLength=CAPMAX;ci.placeholder='What are we looking at?';
    var ch=el('small','tll-cap-help','0 of '+CAPMAX);ci.addEventListener('input',function(){ch.textContent=ci.value.length+' of '+CAPMAX;});wrap.appendChild(cl);wrap.appendChild(ci);wrap.appendChild(ch);}
  box.appendChild(row);box.appendChild(wrap);field.parentNode.insertBefore(box,field.nextSibling);
  inp.addEventListener('change',function(){clearRow(row);var f=inp.files&&inp.files[0];box.hidden=!f;if(f)row.appendChild(thumb(f,null));});
}

function autosaveLine(form){
  var s=form.querySelector('.tllst-save');if(!s||s.__tllSg)return;s.__tllSg=1;
  var member=false;
  try{var ms=window.$memberstackDom;if(ms&&ms.getCurrentMember)ms.getCurrentMember().then(function(r){member=!!(r&&r.data);}).catch(function(){});}catch(e){}
  var restored=false;try{restored=!!localStorage.getItem('tllStoryDraft');}catch(e){}
  function put(html){s.__tllBusy=1;s.innerHTML=html;s.__tllBusy=0;}
  var idle=(restored?'<span class="tll-sg-dot" aria-hidden="true"></span><b>Draft restored from your last visit.</b> ':'')+
           'Your words save as a draft every 20 seconds. Photos are added when you send.';
  function rewrite(){
    if(s.__tllBusy)return;
    var t=s.textContent||'';var m=/^Draft saved (\d{1,2}):(\d{2})/.exec(t);
    if(m){var h=parseInt(m[1],10),ap=h>=12?'PM':'AM';h=h%12||12;
      put('<span class="tll-sg-dot" aria-hidden="true"></span><b>Draft saved · '+h+':'+m[2]+' '+ap+'</b>. Kept on this device'+(member?' and in your account':'')+'. Photos are added when you send.');}
    else if(!t.trim())put(idle);
  }
  new MutationObserver(rewrite).observe(s,{childList:true,characterData:true,subtree:true});
  rewrite();
}

function run(){
  var form=document.querySelector(FORM);if(!form)return;
  if(!document.getElementById('tll-submit-gallery-v1')){var st=document.createElement('style');st.id='tll-submit-gallery-v1';st.textContent=CSS;(document.head||document.documentElement).appendChild(st);}
  gallery(form);hero(form);autosaveLine(form);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);setTimeout(run,3000);
})();

/* tll-submit-long-v1 (29 Oct 2026, Nancy: "Expand the forms for longer stories"). Roberta's Pompeii story arrived cut off mid-word
   at about 4,900 characters: Webflow keeps only about 5,000 characters of any one form field. The body box on /submit has no limit
   of its own, so the full text is now also sent in numbered pieces of up to 3,500 characters (hidden fields body-part-1 to
   body-part-12, about 7,000 words in all), cut at a space. The body field itself is unchanged and still sent; whoever builds the
   story joins body-part-1, body-part-2 and on in order. A short help line says long stories are fine. /submit only; nothing
   removed; no data-ms-* element touched. */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var SIZE=3500,MAXP=12;
function parts(t){var out=[];while(t.length>SIZE&&out.length<MAXP-1){var cut=t.lastIndexOf(' ',SIZE);if(cut<SIZE*0.6)cut=SIZE;out.push(t.slice(0,cut));t=t.slice(cut);}out.push(t);return out;}
function sync(ta){
  var f=ta.form;if(!f)return;var t=ta.value||'';
  [].forEach.call(f.querySelectorAll('input[data-tll-part]'),function(h){h.parentNode.removeChild(h);});
  if(t.length<=SIZE)return;
  parts(t).forEach(function(p,i){var h=document.createElement('input');h.type='hidden';h.name='body-part-'+(i+1);h.setAttribute('data-name','body-part-'+(i+1));h.setAttribute('data-tll-part','1');h.value=p;f.appendChild(h);});
}
function run(){
  var ta=document.querySelector('form textarea[name="body"]');if(!ta||ta.dataset.tllLong)return;ta.dataset.tllLong='1';
  ta.removeAttribute('maxlength');
  var tm=0;ta.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){sync(ta);},400);});
  if(ta.form)ta.form.addEventListener('submit',function(){sync(ta);},true);
  var p=document.createElement('p');p.className='tll-long-hint';p.textContent='Write as long as the story needs. Long stories arrive in full.';
  p.style.cssText='margin:6px 0 0;font:400 13px/1.45 "IBM Plex Sans Condensed","Inter Tight",system-ui,sans-serif;color:#5F5A54';
  ta.insertAdjacentElement('afterend',p);sync(ta);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();

/* tll-photos-form-v2 (29 Oct 2026, Nancy: "Expand the photo submission"). /share-photos took 12 photos, JPG or WebP only. This
   layer stops the page's own tll-photos-form-v1 (it checks window.__tllPhotosForm and steps aside) and runs the same script with
   three changes: up to 30 photos per send, PNG accepted (the upload step already converts every photo to JPEG), and the two hint
   lines say so. Everything else is v1 unchanged (source: src/pages/share-photos/v3/tll-photos-form-v1.js). Thirty photo links
   stay well under Webflow's field size. /share-photos only; nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/share-photos\/?$/.test(location.pathname))return;
window.__tllPhotosForm='v2';
function hints(){var map={'Up to 12 photos, straight from your camera roll.':'Up to 30 photos, straight from your camera roll.','Up to 12 at a time. JPG or WebP, 25MB each at most.':'Up to 30 at a time. JPG, PNG or WebP, 25MB each at most.','Up to 12 at a time. JPG or WebP.':'Up to 30 at a time. JPG, PNG or WebP, 25MB each at most.'};
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){var v=t.nodeValue.trim();if(map[v])t.nodeValue=t.nodeValue.replace(v,map[v]);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hints);else hints();
setTimeout(hints,1500);
})();
(function(){
  if(window.__tllPhotosFormV2Ran) return; window.__tllPhotosFormV2Ran=1;
  var d=document;
  function el(tag,attrs,txt){var e=d.createElement(tag); if(attrs){for(var k in attrs){e.setAttribute(k,attrs[k]);}} if(txt!=null) e.textContent=txt; return e;}
  function after(ref,node){ ref.parentNode.insertBefore(node,ref.nextSibling); }
  /* the child of container that holds node (the label around an input, the row around a radio) */
  function topIn(node,container){ var n=node; while(n&&n.parentNode!==container) n=n.parentNode; return n; }
  function addRef(inp,attr,id){ var v=(inp.getAttribute(attr)||'').split(/\s+/).filter(Boolean); if(v.indexOf(id)<0){ v.push(id); inp.setAttribute(attr,v.join(' ')); } }
  function dropRef(inp,attr,id){ var v=(inp.getAttribute(attr)||'').split(/\s+/).filter(function(x){return x&&x!==id;}); if(v.length) inp.setAttribute(attr,v.join(' ')); else inp.removeAttribute(attr); }
  function val(i){ return i&&i.value ? i.value.trim() : ''; }

  function run(){
    var form=d.querySelector('form[data-tll-form="share-photos"]'); if(!form) return;
    function byName(n){ return form.querySelector('[name="'+n+'"]'); }

    /* refs, all anchored on input names */
    var photos=byName('photos'), country=byName('country'), city=byName('city'), year=byName('year'), trip=byName('trip-type'),
        caption=byName('caption'), pets=byName('pets-along'), named=form.querySelector('input[name="credit-mode"][value="named"]'),
        social=byName('syndication-social'), rotation=byName('syndication-rotation'), press=byName('syndication-press'),
        rights=byName('agree-rights'), licence=byName('agree-licence'), people=byName('agree-people'),
        submit=form.querySelector('input[type="submit"]');
    var photosFs=photos&&photos.closest('fieldset'), storyFs=country&&country.closest('fieldset'), petFs=pets&&pets.closest('fieldset'),
        creditFs=named&&named.closest('fieldset');
    var dropZone=photos&&topIn(photos,photosFs);                                  /* …8688, the label around the file input */
    var grid=country&&topIn(country,storyFs);                                     /* …86b5 */
    var countryLabel=grid&&topIn(country,grid), cityLabel=grid&&topIn(city,grid), yearLabel=grid&&topIn(year,grid), tripLabel=grid&&topIn(trip,grid);
    var captionLabel=caption&&topIn(caption,storyFs);                             /* …86bb */
    var creditLabel=named&&topIn(named,creditFs), radiosRow=creditLabel&&topIn(named,creditLabel);      /* …86dd, …86dc */
    var shareLabel=social&&topIn(social,creditFs), checksRow=shareLabel&&topIn(social,shareLabel);     /* …86fd, …86fc */
    var rightsLabel=rights&&topIn(rights,creditFs), licenceLabel=licence&&topIn(licence,creditFs), peopleLabel=people&&topIn(people,creditFs);
    var promisesLabel=rightsLabel&&rightsLabel.previousElementSibling;           /* 455964ef-…2f04 */
    if(promisesLabel&&promisesLabel.tagName!=='DIV') promisesLabel=null;
    var status=submit&&submit.nextElementSibling; if(!status||status.tagName!=='SPAN') status=form.querySelector('.tll-pen-status');
    var foot=status?status.textContent:'';
    var detail, share, sum, errs={}, kept=[];

    /* 1 · row 18: placeholders go; the label and the help line carry the guidance */
    try{ [photos,country,city,year,caption,pets].forEach(function(i){ if(i) i.removeAttribute('placeholder'); }); }catch(e){}

    /* 2 · rows 12 and 17: the photo input is required and asks for JPG or WebP; the year is optional and numeric on phones */
    try{ photos.required=true; photos.setAttribute('accept','image/jpeg,image/png,image/webp'); if(year){ year.required=false; year.setAttribute('inputmode','numeric'); } }catch(e){}

    /* 3 · rows 19 and 20: a click on the heading text of the credit and syndication labels must not tick the first control */
    try{
      var guard=function(label,row){ label.addEventListener('click',function(ev){ if(!row.contains(ev.target)) ev.preventDefault(); }); };
      guard(creditLabel,radiosRow); guard(shareLabel,checksRow);
    }catch(e){}

    /* 4 · row 14: the caption block sits directly under "Where is this?" */
    try{ grid.insertBefore(captionLabel,countryLabel.nextSibling); }catch(e){}

    function disclosure(id,btnId,text){
      var btn=el('button',{type:'button',id:btnId,'class':'tll-pen-disclosure','aria-expanded':'false','aria-controls':id},text);
      var panel=el('div',{id:id,'class':'tll-pen-panel'}), inner=el('div',{'class':'tll-pen-panel-inner'}); panel.appendChild(inner);
      var o={btn:btn,panel:panel,inner:inner,on:false,open:function(v){ o.on=!!v; btn.setAttribute('aria-expanded',o.on?'true':'false'); panel.classList.toggle('is-open',o.on); }};
      btn.addEventListener('click',function(){ o.open(!o.on); remember(); });
      return o;
    }
    function remember(){ try{ sessionStorage.setItem('tllPhotosPanels',JSON.stringify({detail:!!(detail&&detail.on),share:!!(share&&share.on)})); }catch(e){} }

    /* 5 · rows 15 to 17: "More detail (optional)" holds city, year, trip type and the whole pet fieldset; the pet label span gets .tll-photos-vh */
    try{
      detail=disclosure('tll-more-detail','tll-more-detail-btn','More detail (optional)');
      storyFs.appendChild(detail.btn);
      storyFs.appendChild(el('p',{'class':'tll-pen-disclosure-help'},'City, year, trip type and a pet in the shot. None of it is required.'));
      storyFs.appendChild(detail.panel);
      [cityLabel,yearLabel,tripLabel,petFs].forEach(function(n){ if(n) detail.inner.appendChild(n); });
      var petLabel=pets&&pets.closest('label'), petSpan=petLabel&&petLabel.querySelector('.tll-pen-label');   /* row 16: the legend carries the question; the span (…86c4) is visually hidden, the label (…86c6) stays connected */
      if(petSpan) petSpan.classList.add('tll-photos-vh');
    }catch(e){}

    /* 6 · row 20: "Where else it may appear (optional)" holds the syndication label with its three rows */
    try{
      share=disclosure('tll-more-share','tll-more-share-btn','Where else it may appear (optional)');
      after(creditLabel,share.btn); after(share.btn,share.panel);
      share.inner.appendChild(shareLabel);
    }catch(e){}

    /* 7 · row 21: the promises become a named group. The label and the three rows live inside the credit fieldset in the
       Designer tree, so the group is reordered to form level, right after that fieldset, where section 8 numbers it */
    try{
      promisesLabel.id='tll-promises-label';
      var wrap=el('div',{'class':'tll-pen-promises',role:'group','aria-labelledby':'tll-promises-label'});
      form.insertBefore(wrap,creditFs.nextSibling);
      [promisesLabel,rightsLabel,licenceLabel,peopleLabel].forEach(function(n){ wrap.appendChild(n); });
    }catch(e){}

    /* 8 · row 25: the footnote span is the live region for the validation count */
    try{ status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); }catch(e){}

    /* 9 · row 19: credited-as line under the credit row, from one read-only getCurrentMember call; the fallback shows first */
    var credited;
    try{
      credited=el('p',{id:'tll-credited-as','class':'tll-credited-as'},'Credited with the name on your account.');
      after(creditLabel,credited);
      showCredited();
      var tries=0;
      (function tick(){
        var ms=window.$memberstackDom;
        if(ms&&typeof ms.getCurrentMember==='function'){
          try{ ms.getCurrentMember().then(function(r){
            var cf=(r&&r.data&&r.data.customFields)||{}, name=(String(cf['first-name']||'')+' '+String(cf['last-name']||'')).trim();
            if(name) credited.textContent='Credited as '+name+', from your account.';
          }).catch(function(){}); }catch(e){}
        } else if(++tries<40) setTimeout(tick,250);
      })();
    }catch(e){}
    function showCredited(){ if(credited) credited.hidden=!named.checked; }

    /* 10 · rows 11 to 13: drop zone state, count, size and type checks, the file list, the file error lines */
    var MAX=30, MAXB=25*1024*1024, OK={'image/jpeg':1,'image/png':1,'image/webp':1};
    var fileErrs, list, count, canDT=false;
    try{ canDT=!!new DataTransfer().items; }catch(e){}
    try{
      fileErrs=el('div',{id:'tll-photos-file-errors','class':'tll-photos-file-errors','aria-live':'polite'});
      list=el('ul',{id:'tll-photos-list','class':'tll-photos-list',role:'list',hidden:''});
      count=el('p',{id:'tll-photos-count','class':'tll-photos-count',role:'status',hidden:''});
      after(dropZone,fileErrs); after(fileErrs,list); after(list,count);
      var depth=0;
      dropZone.addEventListener('dragenter',function(ev){ ev.preventDefault(); depth++; dropZone.classList.add('is-dragover'); });
      dropZone.addEventListener('dragover',function(ev){ ev.preventDefault(); });
      dropZone.addEventListener('dragleave',function(){ if(--depth<=0){ depth=0; dropZone.classList.remove('is-dragover'); } });
      dropZone.addEventListener('drop',function(ev){
        ev.preventDefault(); depth=0; dropZone.classList.remove('is-dragover');
        var fl=ev.dataTransfer&&ev.dataTransfer.files; if(!fl||!fl.length) return;
        if(canDT) addFiles(fl); else { try{ photos.files=fl; }catch(e){} addFiles(photos.files); }
      });
      photos.addEventListener('change',function(){ addFiles(photos.files); });
      if(photos.files&&photos.files.length) addFiles(photos.files);
    }catch(e){}
    function ext(n){ var m=/\.([a-z0-9]+)$/i.exec(n); return m?m[1].toUpperCase():''; }
    function mb(n){ return Math.max(0.1,Math.round(n/104857.6)/10)+' MB'; }
    function okType(f){ return !!OK[f.type]||(!f.type&&/\.(jpe?g|png|webp)$/i.test(f.name)); }
    function dup(f){ return kept.some(function(k){ var o=k.file; return o.name===f.name&&o.size===f.size&&o.lastModified===f.lastModified; }); }
    function sync(){ if(!canDT) return false; try{ var dt=new DataTransfer(); kept.forEach(function(k){ dt.items.add(k.file); }); photos.files=dt.files; return true; }catch(e){ return false; } }
    function row(k,i){
      var li=el('li',{'class':'tll-photos-row'}); li.style.setProperty('--tll-i',i);
      var th=el('div',{'class':'tll-photos-thumb'});
      if(window.URL&&URL.createObjectURL){
        k.url=URL.createObjectURL(k.file); var img=el('img',{alt:'',src:k.url,decoding:'async'});
        img.onerror=function(){ th.removeChild(img); th.classList.add('is-blank'); th.textContent=ext(k.file.name); }; th.appendChild(img);
      } else { th.classList.add('is-blank'); th.textContent=ext(k.file.name); }
      var meta=el('div',{'class':'tll-photos-meta'}); meta.appendChild(el('span',{'class':'tll-photos-name'},k.file.name)); meta.appendChild(el('span',{'class':'tll-photos-size'},mb(k.file.size)));
      var rm=el('button',{type:'button','class':'tll-photos-remove','aria-label':'Remove '+k.file.name},'Remove');
      rm.addEventListener('click',function(){ remove(k); });
      li.appendChild(th); li.appendChild(meta); li.appendChild(rm); k.li=li; return li;
    }
    function drop(k){ if(k.url) URL.revokeObjectURL(k.url); if(k.li&&k.li.parentNode) k.li.parentNode.removeChild(k.li); }
    function clearRows(){ kept.forEach(drop); kept=[]; }
    function setCount(msg){ var n=kept.length; count.textContent=msg||(n?n+' of '+MAX+' chosen.':''); count.hidden=!count.textContent; list.hidden=!n; }
    function addFiles(fl){
      var msgs=[], added=[], over=false;
      while(fileErrs.firstChild) fileErrs.removeChild(fileErrs.firstChild);
      if(!canDT) clearRows();                     /* no rebuild possible: the input holds the new pick alone, so the list mirrors it */
      for(var i=0;i<fl.length;i++){ var f=fl[i];
        if(!okType(f)){ msgs.push(f.name+' is not a JPG, PNG or WebP. Try the original from your Photos app.'); continue; }
        if(f.size>MAXB){ msgs.push(f.name+' is over 25MB. Export a smaller copy and try again.'); continue; }
        if(dup(f)) continue;
        if(kept.length+added.length>=MAX){ over=true; continue; }
        added.push({file:f});
      }
      if(over) msgs.push("That's more than 30. We kept the first 30 and left the rest for next time.");
      msgs.forEach(function(m){ fileErrs.appendChild(el('p',{'class':'tll-photos-file-error'},m)); });
      if(!canDT&&msgs.length){ photos.value=''; setCount('Choose your photos again.'); summary(); return; }
      added.forEach(function(k,i){ kept.push(k); list.appendChild(row(k,i)); });
      if(canDT&&!sync()) startOver(); else setCount();
      settled();
    }
    function startOver(){ clearRows(); photos.value=''; setCount('Choose your photos again.'); }   /* row 13 fallback: no FileList rebuild */
    function remove(k){
      var i=kept.indexOf(k); if(i<0) return; kept.splice(i,1); drop(k);
      if(sync()) setCount(); else startOver();
      settled();
    }
    /* a drop or a Remove changes the input without a change event, so the photos error clears here as it would in onEdit */
    function settled(){ if(photos.files&&photos.files.length&&clearErr('photos')) live(); summary(); }

    /* 11 · row 22: the summary line at the top of the promises group, computed from the live inputs */
    try{
      sum=el('p',{id:'tll-photos-summary','class':'tll-photos-summary',hidden:''});
      after(promisesLabel,sum);
    }catch(e){}
    function summary(){
      if(!sum) return;
      var n=kept.length, w=val(country), c=val(city), y=val(year);
      if(!n||!w){ sum.hidden=true; sum.textContent=''; return; }
      sum.textContent=n+' '+(n===1?'photo':'photos')+' from '+(c?c+', '+w:w)+(/^\d{4}$/.test(y)?', '+y:'')+'.'; sum.hidden=false;
    }

    /* 12 · rows 17, 23 and 25: inline errors with stable ids, the check in the capture phase, focus to the first failure,
       the count in the live region, errors cleared on input. noValidate only once the check is installed */
    try{
      var mkErr=function(key,input,label){ if(!input||!label) return; var s=el('span',{id:'tll-err-'+key,'class':'tll-pen-error',hidden:''}); after(label,s); errs[key]={s:s,i:input,l:label}; };
      mkErr('photos',photos,dropZone); mkErr('country',country,countryLabel); mkErr('year',year,yearLabel);
      mkErr('rights',rights,rightsLabel); mkErr('license',licence,licenceLabel); mkErr('people',people,peopleLabel);
      form.addEventListener('submit',function(ev){
        var fails=check(); live();
        if(!fails.length) return;
        ev.preventDefault(); ev.stopImmediatePropagation();
        var k=fails[0]; if(fails.indexOf('year')>=0&&detail){ detail.open(true); remember(); }   /* the year error sits inside the panel: open it whenever the year fails, wherever it falls in the list */
        try{ errs[k].i.focus(); }catch(e){}
      },true);
      form.addEventListener('input',onEdit); form.addEventListener('change',onEdit);
      form.noValidate=true;
    }catch(e){}
    function setErr(k,msg){ var e=errs[k]; if(!e) return false; e.s.textContent=msg; e.s.hidden=false; e.i.setAttribute('aria-invalid','true'); addRef(e.i,'aria-describedby',e.s.id); e.l.classList.add('is-invalid'); return true; }
    function clearErr(k){ var e=errs[k]; if(!e||e.s.hidden) return false; e.s.hidden=true; e.s.textContent=''; e.i.removeAttribute('aria-invalid'); dropRef(e.i,'aria-describedby',e.s.id); e.l.classList.remove('is-invalid'); return true; }
    function check(){
      var fails=[];
      function test(k,bad,msg){ if(!errs[k]) return; if(bad()){ setErr(k,msg); fails.push(k); } else clearErr(k); }
      test('photos',function(){ return !(photos.files&&photos.files.length); },'Add at least one photo.');
      test('country',function(){ return !val(country); },'Tell us the country, at least.');
      test('year',function(){ var y=val(year), lo=+year.getAttribute('min')||1990, hi=+year.getAttribute('max')||2030;
        return !!(year.validity&&year.validity.badInput)||(y&&!(/^\d{4}$/.test(y)&&+y>=lo&&+y<=hi)); },'A four-digit year. Guessing is allowed.');
      var tick='Tick this one to send.';
      test('rights',function(){ return !rights.checked; },tick); test('license',function(){ return !licence.checked; },tick); test('people',function(){ return !people.checked; },tick);
      return fails;
    }
    function live(){ if(!status) return; var n=0; for(var k in errs){ if(!errs[k].s.hidden) n++; } status.textContent=n?(n===1?'One thing to fix above.':n+' things to fix above.'):foot; }
    function onEdit(ev){
      var t=ev.target, cleared=false;
      for(var k in errs){ if(errs[k].i===t&&clearErr(k)) cleared=true; }
      if(cleared) live();
      if(t&&t.name==='credit-mode') showCredited();
      summary();
    }

    /* 13 · row 26: focus lands on the success box when Webflow shows it */
    try{
      var done=form.parentNode.querySelector('.w-form-done');
      done.setAttribute('tabindex','-1');
      var mo=new MutationObserver(function(){ if(getComputedStyle(done).display!=='none'){ mo.disconnect(); try{ done.focus(); }catch(e){} } });
      mo.observe(done,{attributes:true,attributeFilter:['style']});
    }catch(e){}

    /* 14 · rows 15 and 20: panels remembered for the session, and opened when a field inside already holds a value */
    try{
      var saved={}; try{ saved=JSON.parse(sessionStorage.getItem('tllPhotosPanels')||'{}')||{}; }catch(e){}
      var hasDetail=[city,year,pets].some(val)||!!(trip&&trip.selectedIndex>0&&trip.value);
      var hasShare=[social,rotation,press].some(function(i){ return i&&i.checked; });
      if(detail) detail.open(saved.detail||hasDetail);
      if(share) share.open(saved.share||hasShare);
    }catch(e){}
  }

  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded',run); else run();
})();

/* tll-ep-linkstack-v1 (29 Oct 2026, Nancy: Linktree-style links on profiles, "Yes please" to the list including the paid ones).
   /edit-profile gets a "More links" block under Shop and partners: up to 12 links, each a type, a label and a link. Saved inside the
   existing partners value as partners.stack (the Contributors collection is at Webflow's 60-field limit), through the editor's own
   save (window.TLLEP.set), so it travels like every other profile field. The Shop and partners inputs rebuild partners without the
   stack, so their saves are merged here to keep it. Nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/edit-profile\/?$/.test(location.pathname))return;
var TYPES=[['web','Web link','https://'],['pdf','PDF (menu, resume, schedule)','Link to the PDF file'],['youtube','YouTube video','https://youtu.be/...'],['x','X post','https://x.com/you/status/...'],['tiktok','TikTok','https://www.tiktok.com/@you/video/...'],['twitch','Twitch channel','https://twitch.tv/you'],['music','Music (Spotify, Apple Music)','Song, album or playlist link'],['presave','Music pre-save','Your pre-save page'],['podcast','Podcast','Spotify or Apple Podcasts link'],['book','Book','Where your book is sold'],['shop','Shop or affiliate product','Product or store link'],['digital','Digital product','Where it is sold'],['course','Course','Course page'],['tips','Tips','Ko-fi, Buy Me a Coffee, PayPal...'],['booking','Booking (Calendly and others)','https://calendly.com/you'],['contact','Contact card','Email to include (optional)']];
var MAX=12,PAID={shop:'AFFILIATE',digital:'PAID',course:'PAID',tips:'TIPS'};
var CSS='.tll-ls{margin:22px 0 0;padding:18px 0 0;border-top:1px solid #E0DACE}.tll-ls h3{margin:0 0 4px;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79}'+
'.tll-ls p{margin:0 0 12px;font:400 13px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54}.tll-ls-row{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1.4fr) auto;gap:8px;align-items:center;margin:0 0 8px}'+
'.tll-ls-row select,.tll-ls-row input{width:100%;min-height:44px;padding:8px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;font:400 15px/1.3 "IBM Plex Sans Condensed",system-ui,sans-serif}'+
'.tll-ls-row button,.tll-ls-add{min-height:44px;padding:0 12px;border:0;background:transparent;color:#C8325B;font:600 13px/1 "IBM Plex Sans Condensed",system-ui,sans-serif;cursor:pointer}.tll-ls-add{padding:0;border-bottom:1px solid #C8325B;min-height:32px}'+
'.tll-ls-tag{grid-column:1/-1;margin:-4px 0 4px;font:400 12px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54}@media(max-width:640px){.tll-ls-row{grid-template-columns:1fr 1fr}.tll-ls-row button{grid-column:2;justify-self:end}.tll-ls-row input[data-k=url]{grid-column:1/-1}}';
function E(){return window.TLLEP}
function pt(){try{var p=JSON.parse((E()&&E().get('partners'))||'null');return p&&typeof p==='object'&&!Array.isArray(p)?p:{}}catch(e){return {}}}
var stack=null,box,list,tm;
function save(){var e=E();if(!e)return;var p=pt();p.stack=stack.filter(function(l){return l.t&&(l.url||l.t==='contact')});e.set('partners',JSON.stringify(p))}
function later(){clearTimeout(tm);tm=setTimeout(save,600)}
function row(l,i){var r=document.createElement('div');r.className='tll-ls-row';
  var s=document.createElement('select');s.setAttribute('aria-label','Link type');TYPES.forEach(function(t){var o=document.createElement('option');o.value=t[0];o.textContent=t[1];s.appendChild(o)});s.value=l.t||'web';
  var a=document.createElement('input');a.setAttribute('data-k','label');a.maxLength=60;a.placeholder='Label people see';a.setAttribute('aria-label','Label');a.value=l.label||'';
  var u=document.createElement('input');u.setAttribute('data-k','url');u.setAttribute('aria-label','Link');u.value=l.url||'';
  var x=document.createElement('button');x.type='button';x.textContent='Remove';x.setAttribute('aria-label','Remove this link');
  var tag=document.createElement('div');tag.className='tll-ls-tag';
  function hint(){var t=TYPES.filter(function(z){return z[0]===s.value})[0];u.placeholder=t?t[2]:'https://';u.type=s.value==='contact'?'email':'url';tag.textContent=PAID[s.value]?'Shown with a '+PAID[s.value]+' tag, so readers know.':'';tag.hidden=!tag.textContent}
  s.onchange=function(){l.t=s.value;hint();later()};a.oninput=function(){l.label=a.value;later()};u.oninput=function(){l.url=u.value.trim();later()};
  x.onclick=function(){stack.splice(stack.indexOf(l),1);paint();save()};
  hint();[s,a,u,x,tag].forEach(function(n){r.appendChild(n)});return r}
function paint(){list.innerHTML='';stack.forEach(function(l,i){list.appendChild(row(l,i))});add.hidden=stack.length>=MAX}
var add;
function build(){
  var e=E();if(!e||!e.set||document.querySelector('.tll-ls'))return !!document.querySelector('.tll-ls');
  var u2=document.querySelector('[data-ep-pt="u2"]'),op=document.querySelector('[data-ep-pt-open]');if(!u2)return false;
  var host=u2;while(host.parentElement&&!(op?host.parentElement.contains(op):false))host=host.parentElement;
  var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  box=document.createElement('div');box.className='tll-ls';box.innerHTML='<h3>More links</h3><p>Up to 12. A web page, a PDF, a video, music, a podcast, a book, a booking page, something you sell or a tip jar. Videos, music, posts and bookings open right on your page when a reader taps them.</p>';
  list=document.createElement('div');box.appendChild(list);
  add=document.createElement('button');add.type='button';add.className='tll-ls-add';add.textContent='+ Add a link';
  add.onclick=function(){if(stack.length>=MAX)return;stack.push({t:'web',label:'',url:''});paint();var r=list.lastChild;if(r)r.querySelector('input').focus()};
  box.appendChild(add);
  (host.parentElement?host:u2).insertAdjacentElement('afterend',box);
  stack=(pt().stack||[]).slice(0,MAX);paint();
  /* keep the stack when the Shop and partners inputs save partners without it */
  var set=e.set;e.set=function(k,v){if(k==='partners'&&stack){try{var p=JSON.parse(v||'{}');if(p&&typeof p==='object'&&!p.stack&&stack.length){p.stack=stack.filter(function(l){return l.t&&(l.url||l.t==='contact')});v=JSON.stringify(p)}}catch(err){}}return set.apply(this,arguments.length>1?[k,v].concat([].slice.call(arguments,2)):[k,v])};
  return true}
var n=0;(function tick(){if(!build()&&++n<40)setTimeout(tick,250)})();
})();

/* tll-pf-linkstack-v1 (29 Oct 2026). Public profile (/contributors/{slug}): shows the member's "More links" (partners.stack, set on
   /edit-profile) under their link buttons. Plain links are buttons. YouTube, X posts, TikTok videos, Twitch, Spotify, Apple Music,
   Apple Podcasts and Calendly show as a card that loads the player only when tapped, so no outside service loads until the reader
   asks. Shop, digital products, courses and tips carry an AFFILIATE, PAID or TIPS tag and rel="sponsored". The contact card saves a
   .vcf with the member's name, profile link and the email they chose to share. Never touches data-ms-* elements. */
(function(){
if(!/^\/contributors\/[^/]+\/?$/.test(location.pathname))return;
var TAG={shop:'AFFILIATE',digital:'PAID',course:'PAID',tips:'TIPS'},WORD={web:'Link',pdf:'PDF',book:'Book',presave:'Pre-save',booking:'Book a time',contact:'Contact'};
var CSS='.tll-lsp{display:grid;gap:10px;width:100%;flex-basis:100%;margin:14px 0 0}.tll-lsp-h{margin:0;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;color:#067A79}'+
'.tll-lsp-btns{display:flex;flex-wrap:wrap;gap:8px}.tll-lsp-card{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;padding:10px 14px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;font:600 15px/1.3 "IBM Plex Sans Condensed",system-ui,sans-serif;text-align:left;cursor:pointer}'+
'.tll-lsp-card span{display:block;font:500 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1px;color:#5F5A54;text-transform:uppercase}.tll-lsp-card b{flex:none;width:34px;height:34px;border-radius:50%;background:#C8325B;color:#fff;display:grid;place-items:center;font-size:13px}'+
'.tll-lsp-frame{width:100%;border:0;border-radius:4px;background:#F7F1E8}@media(hover:hover){.tll-lsp-card:hover{border-color:#C8325B}}.tll-lsp-card:focus-visible{outline:3px solid #0A0B14;outline-offset:2px}';
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function safe(u){u=String(u||'').trim();return /^https:\/\/\S+$/i.test(u)?u:''}
function embed(l){var u=safe(l.url),m;if(!u)return null;var host=location.hostname;
  if(l.t==='youtube'&&(m=u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{6,})/)))return {src:'https://www.youtube-nocookie.com/embed/'+m[1],h:'56.25%',name:'YouTube'};
  if(l.t==='x'&&(m=u.match(/(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/)))return {src:'https://platform.twitter.com/embed/Tweet.html?id='+m[1]+'&dnt=true',px:560,name:'X'};
  if(l.t==='tiktok'&&(m=u.match(/tiktok\.com\/.*\/video\/(\d+)/)))return {src:'https://www.tiktok.com/embed/v2/'+m[1],px:740,name:'TikTok'};
  if(l.t==='twitch'&&(m=u.match(/twitch\.tv\/([\w]+)\/?$/)))return {src:'https://player.twitch.tv/?channel='+m[1]+'&parent='+host+'&autoplay=false',h:'56.25%',name:'Twitch'};
  if((l.t==='music'||l.t==='podcast')&&(m=u.match(/open\.spotify\.com\/(?:intl-\w+\/)?(track|album|playlist|episode|show|artist)\/(\w+)/)))return {src:'https://open.spotify.com/embed/'+m[1]+'/'+m[2],px:(m[1]==='track'||m[1]==='episode')?152:352,name:'Spotify'};
  if(l.t==='music'&&/^https:\/\/music\.apple\.com\//.test(u))return {src:u.replace('https://music.apple.com/','https://embed.music.apple.com/'),px:/[?&]i=/.test(u)?175:450,name:'Apple Music'};
  if(l.t==='podcast'&&/^https:\/\/podcasts\.apple\.com\//.test(u))return {src:u.replace('https://podcasts.apple.com/','https://embed.podcasts.apple.com/'),px:/[?&]i=/.test(u)?175:450,name:'Apple Podcasts'};
  if(l.t==='booking'&&/^https:\/\/calendly\.com\//.test(u))return {src:u+(u.indexOf('?')>-1?'&':'?')+'embed_type=Inline&hide_gdpr_banner=1&embed_domain='+host,px:700,name:'Calendly'};
  return null}
function vcf(l){var name=((document.querySelector('h1')||{}).textContent||'').trim(),em=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.url||'')?l.url:'';
  var t=['BEGIN:VCARD','VERSION:3.0','FN:'+name.replace(/[\r\n;,]/g,' '),'URL:'+location.origin+location.pathname].concat(em?['EMAIL:'+em]:[]).concat(['END:VCARD']).join('\r\n');
  var a=el('a','pf5-btn pf5-btn-line',l.label||'Save my contact');a.href=URL.createObjectURL(new Blob([t],{type:'text/vcard'}));a.download=(name||'contact').replace(/[^\w]+/g,'-')+'.vcf';return a}
function run(){
  var root=document.querySelector('[data-pf5="root"]');if(!root||document.querySelector('.tll-lsp'))return;
  var P;try{P=JSON.parse(root.getAttribute('data-partners')||'null')}catch(e){P=null}
  var S=P&&Array.isArray(P.stack)?P.stack.slice(0,12):[];if(!S.length)return;
  var st=el('style');st.textContent=CSS;document.head.appendChild(st);
  var w=el('div','tll-lsp');w.appendChild(el('p','tll-lsp-h','MORE LINKS'));var btns=el('div','tll-lsp-btns'),cards=el('div','tll-lsp');cards.style.margin='0';
  S.forEach(function(l){if(!l||!l.t)return;
    if(l.t==='contact'){btns.appendChild(vcf(l));return}
    var u=safe(l.url);if(!u)return;var em=embed(l);
    if(em){var c=el('button','tll-lsp-card');c.type='button';c.appendChild(el('b',null,'▶'));var tx=el('div',null,l.label||em.name);tx.appendChild(el('span',null,em.name+' · tap to load'));c.appendChild(tx);
      c.onclick=function(){var f=el('iframe','tll-lsp-frame');f.src=em.src;f.title=(l.label||em.name);f.loading='lazy';f.allow='autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write';f.setAttribute('allowfullscreen','');
        if(em.h){var bx=el('div');bx.style.cssText='position:relative;width:100%;padding-top:'+em.h;f.style.cssText='position:absolute;inset:0;height:100%';bx.appendChild(f);c.replaceWith(bx)}else{f.style.height=em.px+'px';c.replaceWith(f)}};
      cards.appendChild(c);return}
    var a=el('a','pf5-btn pf5-btn-line',l.label||WORD[l.t]||'Link');a.href=u;a.target='_blank';a.rel=TAG[l.t]?'sponsored noopener':'noopener';
    if(TAG[l.t]){var tg=el('span','pf5-tag',TAG[l.t]);a.appendChild(tg)}
    if(l.t==='pdf'){var p=el('span','pf5-tag','PDF');a.appendChild(p)}
    var s=el('span',null,'↗');s.setAttribute('aria-hidden','true');a.appendChild(s);btns.appendChild(a)});
  if(btns.childNodes.length)w.appendChild(btns);if(cards.childNodes.length)w.appendChild(cards);
  var B=document.querySelector('[data-pf5="buttons"]');if(B)B.insertAdjacentElement('afterend',w);else root.appendChild(w);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,50)});else setTimeout(run,50);
setTimeout(run,1500);
})();

/* tll-redesign-p0-v1 (31 Oct 2026, Nancy's answers to the redesign plan questions). Visual change kept small; hooks untouched.
   1. Home Expats block: Moving guides, Visa trackers and Lifestyle/City hubs do not exist yet, so the three tiles stop linking
      (href removed, aria-disabled) and carry a COMING SOON tag; one line under them points to the Sunday letter form.
   2. Home shelf: Horseshoe Bend (a 1-minute read) stays live on /stories but is not featured on the home shelf.
   3. Country counts are labeled by what they count. Home map band: "Nancy's map: 89 countries + Antarctica · ..." (the number
      still comes live from her saved map). /the-map: the typed "87" on "Already logged" is replaced by the live count from the
      same source (the Worker's /owner-map), labeled "On Nancy's map". The footer keeps "countries in our stories".
   Nothing removed from the DOM; no data-ms-* element touched. */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
var SOON=/^(moving guides|visa trackers|lifestyle hubs|city hubs)$/i;
function expats(){
  var cards=[].filter.call(document.querySelectorAll('a.h3-ex-card'),function(a){var b=a.querySelector('b');return b&&SOON.test(b.textContent.trim());});
  if(!cards.length||document.querySelector('.tll-soon-line'))return;
  cards.forEach(function(a){a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.setAttribute('data-tll-soon','');
    var t=document.createElement('em');t.className='tll-soon-tag';t.textContent='Coming soon';a.insertBefore(t,a.firstChild);});
  var form=document.getElementById('wf-form-The-Layover-Letter')||document.getElementById('h3-news-email');
  var line=document.createElement('p');line.className='tll-soon-line';
  line.innerHTML='Guides, visa dates and city hubs are on the way. <a href="#'+(form?form.id:'h3b-letter')+'">Get the Sunday letter and hear when they open →</a>';
  var last=cards[cards.length-1];last.parentNode.parentNode.insertBefore(line,last.parentNode.nextSibling);
}
function shelf(){[].forEach.call(document.querySelectorAll('.h3-card[href*="/stories/horseshoe-bend-arizona"]'),function(c){c.style.display='none';c.setAttribute('aria-hidden','true');c.setAttribute('tabindex','-1');});}
var RX=/^(\d+) countries( \+ AQ)?( · )/;
function band(){
  var dash=document.querySelector('[data-h3-dash]');if(!dash||dash.__tllLbl)return;dash.__tllLbl=1;
  function fix(){var w=document.createTreeWalker(dash,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){var m=t.nodeValue.match(RX);if(m)t.nodeValue=t.nodeValue.replace(RX,"Nancy's map: $1 countries"+(m[2]?' + Antarctica':'')+'$3');}}
  new MutationObserver(fix).observe(dash,{childList:true,subtree:true,characterData:true});fix();
}
function best(row){var r=0;for(var k in row){var v=row[k];r=Math.max(r,v==='lived'?3:v==='visited'?2:v==='layover'?1:0);}return r;}
function mapPage(){
  var card=[].filter.call(document.querySelectorAll('.tll-map-explainer-card'),function(c){var l=c.querySelector('.tll-map-explainer-label');return l&&/already logged/i.test(l.textContent);})[0];
  if(!card||card.__tll)return;card.__tll=1;
  var num=card.querySelector('.tll-map-explainer-num'),lab=card.querySelector('.tll-map-explainer-label');
  lab.textContent='On Nancy’s map';
  fetch('https://tll-travel-wire.thatlayoverlife.workers.dev/owner-map',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||d.v!==2||!d.states)return;var hum={};(d.travelers||[]).forEach(function(t){if(t&&!t.pet)hum[t.id]=1;});
    var c=0,ata=false;Object.keys(d.states).forEach(function(k){var row=d.states[k]||{},own={};for(var id in row)if(hum[id]||!Object.keys(hum).length)own[id]=row[id];if(best(own)>=2){if(k==='010')ata=true;else c++;}});
    if(c){num.textContent=String(c);if(ata)lab.textContent='On Nancy’s map, plus Antarctica';}
  }).catch(function(){});
}
function css(){if(document.getElementById('tll-redesign-p0-v1'))return;var s=document.createElement('style');s.id='tll-redesign-p0-v1';
  s.textContent='.h3-ex-card[data-tll-soon]{cursor:default}.h3-ex-card[data-tll-soon]:hover{transform:none}.tll-soon-tag{display:inline-block;align-self:flex-start;width:max-content;margin:0 0 8px;padding:2px 8px;border-radius:2px;background:#0A0B14;color:#FDF9F3;font:600 11px/1.5 "JetBrains Mono",ui-monospace,monospace;font-style:normal;letter-spacing:1.5px;text-transform:uppercase}'+
  '.tll-soon-line{margin:14px 0 0;font:400 15px/1.5 "Inter Tight","IBM Plex Sans Condensed",system-ui,sans-serif}.tll-soon-line a{color:inherit;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}';
  document.head.appendChild(s);}
function run(){if(P==='/'){css();expats();shelf();band();}if(P==='/the-map')mapPage();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();

/* tll-expats-map-v1 (31 Oct 2026, Roberta's beta idea; Nancy: "build the expats map of where people live on the expats page,
   maybe with flags"). /for-expats gets a section after the directory: a world map with the countries where opted-in expats
   live filled in teal, and under it each country with its flag and the members there, each linking to their profile with the
   place they show on it. Data: the Worker's GET /expats-map, which lists only members who switched on Expats (or are in the
   expat directory), with a public profile, at the city they already show; never a live location, never coordinates.
   Map shapes: world-atlas 2.0.2 with topojson-client 3.1.0 and d3-geo 3.1.1, the same sources the map page uses. If the data
   or the map cannot load, the section stays hidden. Nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/for-expats\/?$/.test(location.pathname))return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/expats-map';
var CDN='https://cdn.jsdelivr.net/npm/';
var ALIAS={us:'United States of America',cz:'Czechia',ba:'Bosnia and Herz.',do:'Dominican Rep.',cd:'Dem. Rep. Congo',cf:'Central African Rep.',ss:'S. Sudan',gq:'Eq. Guinea',sb:'Solomon Is.',kr:'South Korea',kp:'North Korea',la:'Laos',ru:'Russia',mk:'Macedonia',sz:'eSwatini',ci:"Côte d'Ivoire",tw:'Taiwan',bo:'Bolivia',ve:'Venezuela',ir:'Iran',sy:'Syria',tz:'Tanzania',md:'Moldova',ae:'United Arab Emirates',gb:'United Kingdom',vn:'Vietnam',xk:'Kosovo',ps:'Palestine',fk:'Falkland Is.',eh:'W. Sahara'};
var DN=null;try{DN=new Intl.DisplayNames(['en'],{type:'region'});}catch(e){}
function cname(c){try{return DN?DN.of(c.toUpperCase()):c.toUpperCase();}catch(e){return c.toUpperCase();}}
function norm(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z]+/g,' ').trim();}
function flag(c){return 'https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/'+c+'.svg';}
function load(src){return new Promise(function(ok,no){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s);});}
function libs(){var p=Promise.resolve();
  if(!window.topojson)p=p.then(function(){return load(CDN+'topojson-client@3.1.0/dist/topojson-client.min.js');});
  if(!(window.d3&&window.d3.geoPath&&window.d3.geoNaturalEarth1)){p=p.then(function(){return window.d3&&window.d3.range?0:load(CDN+'d3-array@3.2.4/dist/d3-array.min.js');}).then(function(){return load(CDN+'d3-geo@3.1.1/dist/d3-geo.min.js');});}
  return p;}
var CSS='[data-tll-x="expats-map"]{padding:clamp(48px,7vw,88px) 0}[data-tll-x="expats-map"] .tll-em-lede{max-width:60ch;color:#5F5A54;margin:0 0 20px}'+
'.tll-em-map{width:100%;height:auto;display:block;margin:0 0 24px}.tll-em-map path{fill:#EFE8DC;stroke:#FDF9F3;stroke-width:.5}.tll-em-map path.on{fill:#067A79}.tll-em-map .dot{fill:#C8325B;stroke:#FDF9F3;stroke-width:2}'+
'.tll-em-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin:0;padding:0;list-style:none}'+
'.tll-em-c{border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;padding:14px 16px}.tll-em-c h3{display:flex;align-items:center;gap:10px;margin:0 0 8px;font:800 20px/1.2 "Playfair Display",Georgia,serif;color:#0A0B14}'+
'.tll-em-c h3 img{width:24px;height:24px;border-radius:50%;box-shadow:0 0 0 1px rgba(10,11,20,.18)}.tll-em-c ul{margin:0;padding:0;list-style:none}'+
'.tll-em-c li{margin:0 0 6px;font:400 15px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-em-c a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-em-c small{display:block;color:#5F5A54;font-size:13px}.tll-em-c small img{width:14px;height:14px;border-radius:50%;vertical-align:-2px;margin:0 4px 0 2px}'+
'.tll-em-join{margin:18px 0 0;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-em-join a{color:#0A0B14;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}';
function el(t,a,x){var e=document.createElement(t);if(a)for(var k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;return e;}
function build(data,world){
  if(document.querySelector('[data-tll-x="expats-map"]'))return;
  var after=document.querySelector('section[data-tll-x="dir"]')||document.getElementById('tll-expert-apply');if(!after)return;
  var st=el('style',{id:'tll-expats-map-v1'});st.textContent=CSS;document.head.appendChild(st);
  var sec=el('section',{'data-tll-x':'expats-map','aria-labelledby':'tll-em-h'}),inner=el('div',{'data-tll-x':'inner'});
  var ey=el('div',{'data-tll-x':'eyebrow'});ey.appendChild(el('div',null,'THE EXPATS MAP · WHERE MEMBERS LIVE'));inner.appendChild(ey);
  inner.appendChild(el('h2',{id:'tll-em-h','data-tll-x':'dir-h2'},'Where our expats call home.'));
  inner.appendChild(el('p',{'class':'tll-em-lede'},'Members who list themselves as expats, shown by the home base on their profile. Only people who switched it on, and only the city they chose to show.'));
  var have={};Object.keys(data.countries||{}).forEach(function(c){have[norm(ALIAS[c]||cname(c))]=c;have[norm(cname(c))]=c;});
  try{
    var feats=topojson.feature(world,world.objects.countries).features.filter(function(f){return f.properties&&f.properties.name!=='Antarctica';});
    var W=960,H=470,proj=d3.geoNaturalEarth1().fitSize([W,H],{type:'FeatureCollection',features:feats}),path=d3.geoPath(proj);
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('class','tll-em-map');svg.setAttribute('role','img');
    var names=Object.keys(data.countries).map(function(c){return cname(c);});
    svg.setAttribute('aria-label','World map. Countries with expat members: '+names.join(', ')+'.');
    var dots=[];feats.forEach(function(f){var p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',path(f)||'');var c=have[norm(f.properties.name)];
      if(c){p.setAttribute('class','on');var t=document.createElementNS('http://www.w3.org/2000/svg','title');t.textContent=cname(c);p.appendChild(t);dots.push(f);}svg.appendChild(p);});
    /* a dot on each country with members, so small countries (Denmark) show; country level only */
    dots.forEach(function(f){var xy=path.centroid(f);if(!isFinite(xy[0]))return;var d=document.createElementNS('http://www.w3.org/2000/svg','circle');d.setAttribute('cx',xy[0]);d.setAttribute('cy',xy[1]);d.setAttribute('r',6);d.setAttribute('class','dot');svg.appendChild(d);});
    inner.appendChild(svg);
  }catch(e){}
  var by={};data.expats.forEach(function(x){(by[x.country]=by[x.country]||[]).push(x);});
  var list=el('ul',{'class':'tll-em-list'});
  Object.keys(by).sort(function(a,b){return cname(a).localeCompare(cname(b));}).forEach(function(c){
    var li=el('li',{'class':'tll-em-c'}),h=el('h3');var fi=el('img',{src:flag(c),alt:'',loading:'lazy'});fi.onerror=function(){fi.remove();};h.appendChild(fi);h.appendChild(document.createTextNode(cname(c)));li.appendChild(h);
    var ul=el('ul');by[c].forEach(function(x){var m=el('li'),a=el('a',{href:'/contributors/'+encodeURIComponent(x.slug)},x.name);m.appendChild(a);
      var sm=el('small',null,x.place);if(x.from&&x.from!==c){sm.appendChild(document.createTextNode(' · from '));var ff=el('img',{src:flag(x.from),alt:'',loading:'lazy'});ff.onerror=function(){ff.remove();};sm.appendChild(ff);sm.appendChild(document.createTextNode(cname(x.from)));}
      m.appendChild(sm);ul.appendChild(m);});li.appendChild(ul);list.appendChild(li);});
  inner.appendChild(list);
  var j=el('p',{'class':'tll-em-join'});j.innerHTML='Living abroad? <a href="/edit-profile">Switch on Expats on your profile</a> and you join the map, at the city you choose.';inner.appendChild(j);
  sec.appendChild(inner);after.parentNode.insertBefore(sec,after.nextSibling);
}
function run(){
  Promise.all([fetch(API,{cache:'no-cache'}).then(function(r){return r.ok?r.json():null;}),libs().then(function(){return fetch(CDN+'world-atlas@2.0.2/countries-110m.json').then(function(r){return r.json();});})])
  .then(function(a){var d=a[0];if(!d||!d.expats||!d.expats.length)return;build(d,a[1]);}).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* tll-story-captions-v1 (31 Oct 2026, Roberta: captions and choosing where each photo sits). Story pages only. Reads caption
   lines from the story's Photo placements text, the same text the inline-photo script (tllinlinephotosv2b) reads:
     Caption: photo-filename-slug | The writer's caption
   (that script skips these lines, so nothing else changes). Each captioned photo shows its caption under it: a figcaption
   when it sits inline in the story, a small line under the thumbnail in the gallery, and the lightbox caption when opened.
   Captions are the writer's own words, never written by AI. Nothing removed; no data-ms-* element touched. */
(function(){
if(!/^\/stories\/[^/]+\/?$/.test(location.pathname))return;
var CSS='.tll-ph-cap{display:block;margin:8px 0 0;font:400 14px/1.45 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54;text-align:left}'+
'.tll-inline-photo .tll-ph-cap{padding:0 4vw}@media(max-width:767px){.tll-inline-photo .tll-ph-cap{padding:0 16px}}'+
'.tll-story-gallery .tll-ph-cap{font-size:13px;margin:6px 0 0}';
function go(){
  var X=window.tllPh,sec=document.querySelector('.tll-story-gallery');if(!X||!X.P||!sec||sec.getAttribute('data-tll-gallery-built')!=='1')return false;
  var caps={};X.P().split(/\r?\n/).forEach(function(l){var m=/^\s*caption\s*:\s*([^|]+)\|(.+)$/i.exec(l);if(m)caps[m[1].trim().toLowerCase()]=m[2].trim().slice(0,300);});
  if(!Object.keys(caps).length)return true;
  if(!document.getElementById('tll-story-captions-v1')){var st=document.createElement('style');st.id='tll-story-captions-v1';st.textContent=CSS;document.head.appendChild(st);}
  [].forEach.call(document.querySelectorAll('a.tll-gallery-link'),function(a){
    var img=a.querySelector('img');if(!img||a.__tllCap)return;var c=caps[X.S(img.getAttribute('src'))];if(!c)return;a.__tllCap=1;
    var fig=a.closest('figure.tll-inline-photo');var cap=document.createElement(fig?'figcaption':'span');cap.className='tll-ph-cap';cap.textContent=c;
    if(fig)fig.appendChild(cap);else a.parentNode.insertBefore(cap,a.nextSibling);
    var js=a.querySelector('script.w-json');if(js){try{var d=JSON.parse(js.textContent);(d.items||[]).forEach(function(it){it.caption=c;});js.textContent=JSON.stringify(d);}catch(e){}}
  });
  return true;
}
var n=0;(function t(){if(go())return;if(++n>60)return;setTimeout(t,200);})();
})();

/* tll-intake-v1 (31 Oct 2026, Nancy: submissions should be set up instantly; a next-day report checks them; stories that end
   mid-sentence, like Roberta's, should be caught). /submit and /share-photos.
   1. Before sending a story: if the last line does not end a sentence (no . ! ? or closing quote), a note under the story box
      shows the ending and asks the writer to finish it; a second press of Send sends it as it is.
   2. After Webflow accepts a form (its success box shows), the same fields go to the Worker's POST /intake with the member's
      Memberstack token, which publishes the story, link-out or photos at once and links them to the member's profile. The
      success box then says where it is live. If that step fails nothing is lost: the Webflow copy is set up in the daily round.
   Expat and press applications are not sent here; Nancy approves them from the next-day report.
   Field names unchanged; nothing removed; no data-ms-* element touched. */
(function(){
var P=location.pathname.replace(/\/+$/,'');if(P!=='/submit'&&P!=='/share-photos')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/intake';
var CSS='.tll-end-note{margin:8px 0 0;padding:10px 12px;border-left:3px solid #C8325B;background:#FBEFF2;color:#0A0B14;font:400 14px/1.45 "IBM Plex Sans Condensed",system-ui,sans-serif;border-radius:2px}'+
'.tll-end-note b{font-weight:600}.tll-intake-msg{margin:12px 0 0;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-intake-msg a{color:#0A0B14;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}';
function css(){if(document.getElementById('tll-intake-v1'))return;var s=document.createElement('style');s.id='tll-intake-v1';s.textContent=CSS;document.head.appendChild(s);}
function kindOf(f){if(f.matches('[data-tll-form="share-photos"]'))return'photos';if(f.querySelector('[name="external-url"]'))return'linkout';if(f.querySelector('textarea[name="body"]'))return'story';return'';}
function fields(f){var o={};[].forEach.call(f.elements,function(e){if(!e.name||e.disabled||e.type==='file'||e.type==='submit'||e.type==='button')return;
  if((e.type==='checkbox'||e.type==='radio')){if(e.type==='radio'&&!e.checked)return;o[e.name]=e.type==='checkbox'?String(e.checked):e.value;return;}
  if(o[e.name]&&e.value&&e.type==='hidden')o[e.name]=e.value;else if(!o[e.name]||e.value)o[e.name]=e.value;});return o;}
function token(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function lastLine(t){var ls=String(t||'').split(/\n/).map(function(l){return l.trim();}).filter(Boolean);return ls[ls.length-1]||'';}
function endCheck(form){
  var ta=form.querySelector('textarea[name="body"]');if(!ta||form.__tllEnd)return;form.__tllEnd=1;var warned='';
  document.addEventListener('submit',function(ev){if(ev.target!==form)return;var l=lastLine(ta.value);if(!l||/[.!?…"”')\]]$/.test(l)){return;}
    if(warned===l)return;warned=l;ev.preventDefault();ev.stopImmediatePropagation();
    var n=form.querySelector('.tll-end-note');if(!n){n=document.createElement('p');n.className='tll-end-note';n.setAttribute('role','alert');ta.insertAdjacentElement('afterend',n);}
    n.innerHTML='';var b=document.createElement('b');b.textContent='Your story seems to stop mid-sentence: ';n.appendChild(b);n.appendChild(document.createTextNode('"...'+l.slice(-70)+'". Finish the last line, or press Send again to send it as it is.'));
    try{ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);}catch(e){}
  },true);
  ta.addEventListener('input',function(){var n=form.querySelector('.tll-end-note');if(n&&/[.!?…"”')\]]$/.test(lastLine(ta.value)))n.remove();});
}
function watch(form){
  if(form.__tllIntake)return;form.__tllIntake=1;var kind=kindOf(form);if(!kind)return;
  var wrap=form.closest('.w-form')||form.parentNode,done=wrap&&wrap.querySelector('.w-form-done');if(!done)return;
  var sent=false;
  new MutationObserver(function(){if(sent||getComputedStyle(done).display==='none')return;sent=true;
    var tok=token(),data=fields(form);if(!tok)return;
    var msg=document.createElement('p');msg.className='tll-intake-msg';msg.textContent='Setting it up on the site…';done.appendChild(msg);
    fetch(API,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+tok},body:JSON.stringify({kind:kind,fields:data})})
    .then(function(r){return r.json().catch(function(){return{};}).then(function(j){return{ok:r.ok&&j.ok,j:j};});})
    .then(function(x){if(!x.ok){msg.textContent='Saved. It goes live as soon as the editor sets it up.';return;}
      if(kind==='photos'){msg.innerHTML='Your photos are in the Lounge. <a href="/gallery">See them →</a>';return;}
      msg.innerHTML='';msg.appendChild(document.createTextNode('It is live. '));var a=document.createElement('a');a.href=x.j.url;a.textContent='Read it on the site →';msg.appendChild(a);})
    .catch(function(){msg.textContent='Saved. It goes live as soon as the editor sets it up.';});
  }).observe(done,{attributes:true,attributeFilter:['style','class']});
}
function run(){css();[].forEach.call(document.querySelectorAll('form'),function(f){if(P==='/submit'&&kindOf(f)==='story')endCheck(f);if(kindOf(f))watch(f);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();

/* tll-lounge-members-v1 (31 Oct 2026, Nancy: photos sent through /share-photos should be set up instantly). /gallery only.
   Reads the member photos the Worker published (GET /lounge: published Photo submissions, gallery opt-in, no removal request)
   and puts the newest twelve first in the Lounge grid, built like the page's own tiles (photo, small credit label in the corner,
   place and caption in the label for screen readers). Tiles the page already has are untouched. Hidden if nothing loads.
   No data-ms-* element touched. */
(function(){
if(!/^\/gallery\/?$/.test(location.pathname))return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/lounge';
function run(){
  var tiles=document.querySelectorAll('[data-tll-loc]');if(!tiles.length||document.querySelector('[data-tll-member-photo]'))return;
  var grid=tiles[0].parentElement,model=[].filter.call(tiles,function(t){return t.getAttribute('data-tll-has-img')==='1';})[0]||tiles[0];
  fetch(API).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.photos||!d.photos.length||document.querySelector('[data-tll-member-photo]'))return;
    d.photos.slice(0,12).reverse().forEach(function(p){
      var t=model.cloneNode(false);t.removeAttribute('id');t.setAttribute('data-tll-member-photo','');t.setAttribute('data-tll-photo-ready','true');t.setAttribute('data-tll-has-img','1');
      t.setAttribute('data-tll-loc',model.getAttribute('data-tll-loc')||'');t.style.backgroundImage="url('"+String(p.img).replace(/'/g,'%27')+"')";t.style.display='';
      t.setAttribute('role','img');t.setAttribute('aria-label',(p.caption||p.alt||'Member photo')+(p.place?', '+p.place:''));
      var c=document.createElement('span');c.className='tll-lounge-credit';c.textContent=(p.credit?p.credit+' · ':'')+String(p.place||'').toUpperCase();t.appendChild(c);
      grid.insertBefore(t,grid.firstChild);
    });
  }).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,300);});else setTimeout(run,300);
})();

/* tll-crew-v1 (31 Oct 2026, Nancy approved the companions mockup: "Yes your mock up looks good").
   Travel companions and shared pets, invite then accept. Talks to the Worker (/crew/*); while the Worker routes are not live
   every part stays hidden and /edit-profile keeps its old crew field exactly as it was.
   /edit-profile 04 Your crew: search a traveler, pick Partner, Family or Travel buddy, Send invite; pending invites (Cancel),
     companions (Leave), and "Share a pet" for pets you own. Enter in the crew field no longer saves a private name.
   /account: a card per request, Accept or Not now.
   /contributors/<slug> and /pets/<slug>: "Travels with", accepted links only. Names, avatars and the companion type only:
     never a place. A shared pet's countries stay on the pet and never count toward a person's total.
   No data-ms-* element touched; no form or field names changed. */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var TYPES={partner:'Partner',family:'Family',buddy:'Travel buddy'};
var CSS='.tll-crew{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-crew [hidden]{display:none!important}.tll-crew-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:18px 0 8px}'+
'.tll-crew-p{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #E0DACE;border-radius:8px;padding:10px;margin:0 0 8px;text-decoration:none;color:inherit}'+
'.tll-crew-av{width:36px;height:36px;border-radius:50%;flex:none;background:#067A79 center/cover no-repeat;color:#fff;display:grid;place-items:center;font:600 13px/1 "JetBrains Mono",monospace}'+
'.tll-crew-p div{flex:1;min-width:0}.tll-crew-p small{display:block;color:#5F5A54;font-size:13px}'+
'.tll-crew-b{border:1.5px solid #0A0B14;background:transparent;border-radius:4px;padding:8px 12px;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;min-height:40px;color:#0A0B14}'+
'.tll-crew-b.p{background:#C8325B;border-color:#C8325B;color:#fff}'+
'.tll-crew-chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.tll-crew-chip{border:1px solid #E0DACE;border-radius:999px;padding:6px 12px;font-size:14px;background:#FDF9F3;cursor:pointer;min-height:36px}'+
'.tll-crew-chip[aria-pressed="true"]{background:#0A0B14;color:#FDF9F3;border-color:#0A0B14}'+
'.tll-crew-res{border:1px solid #E0DACE;border-radius:4px;background:#fff;margin:4px 0 8px}.tll-crew-res button{display:flex;width:100%;gap:10px;align-items:center;border:0;background:none;padding:8px 10px;text-align:left;font:inherit;cursor:pointer;min-height:44px}'+
'.tll-crew-res button:hover{background:#F7F1E8}.tll-crew-msg{font-size:13px;color:#5F5A54;margin:6px 0}'+
'.tll-crew-card{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff}'+
'.tll-crew-card h3{font:800 20px/1.2 "Playfair Display",Georgia,serif;margin:0 0 10px}.tll-crew-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}'+
'.tll-crew-pub{max-width:760px;margin:28px auto;padding:0 16px}.tll-crew-pub .tll-crew-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}';
function css(){if(document.getElementById('tll-crew-v1'))return;var s=document.createElement('style');s.id='tll-crew-v1';s.textContent=CSS;document.head.appendChild(s);}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;}).then(function(j){return j&&Object.assign(j,{status:r.status});});}).catch(function(){return null;});}
function initials(n){return String(n||'').split(/\s+/).map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();}
function personRow(p,sub,href){var r=el(href?'a':'div','tll-crew-p');if(href)r.href=href;var av=el('span','tll-crew-av');if(p.avatar)av.style.backgroundImage='url("'+p.avatar+'")';else av.textContent=initials(p.name);
  var d=el('div');d.appendChild(document.createTextNode(p.name||''));if(sub)d.appendChild(el('small','',sub));r.appendChild(av);r.appendChild(d);return r;}
function btn(txt,primary,fn){var b=el('button','tll-crew-b'+(primary?' p':''),txt);b.type='button';b.addEventListener('click',fn);return b;}

/* ---------- /edit-profile ---------- */
function editProfile(){
  var sec=document.getElementById('ep-crew');if(!sec||sec.dataset.tllCrew)return;
  var q=sec.querySelector('[data-ep-crewq]'),oldList=sec.querySelector('[data-ep-crewlist]'),note=sec.querySelector('[data-ep-crewnote]');if(!q)return;
  sec.dataset.tllCrew='wait';
  post('/crew/inbox').then(function(d){
    if(!d||!d.ok){sec.dataset.tllCrew='';return;}   /* Worker not live: keep the old field */
    sec.dataset.tllCrew='live';css();
    var box=el('div','tll-crew');if(oldList){oldList.hidden=true;oldList.insertAdjacentElement('afterend',box);}else sec.appendChild(box);
    if(note)note.textContent='They see the invite on their account and say yes or no. Nothing shows on either profile until they do.';
    var res=el('div','tll-crew-res');res.hidden=true;q.insertAdjacentElement('afterend',res);
    var pick=el('div');pick.hidden=true;res.insertAdjacentElement('afterend',pick);
    var msg=el('p','tll-crew-msg');msg.setAttribute('aria-live','polite');pick.insertAdjacentElement('afterend',msg);
    var chosen=null,type='partner',timer=0,seq=0;
    function render(d){
      box.textContent='';
      if(d.companions.length){box.appendChild(el('p','tll-crew-k','Travels with'));d.companions.forEach(function(c){var r=personRow(c,TYPES[c.type]||TYPES.buddy);r.appendChild(btn('Leave',false,function(){if(!confirm('Remove '+c.name+' from your companions? Only the link goes; nothing else changes.'))return;post('/crew/leave',{kind:'person',other:c.id}).then(refresh);}));box.appendChild(r);});}
      var out=d.outgoing||[];if(out.length){box.appendChild(el('p','tll-crew-k','Waiting for a yes'));out.forEach(function(i){var r=personRow({name:i.toName},i.kind==='pet'?'Co-owner of '+i.petName:(TYPES[i.type]||''));r.appendChild(btn('Cancel',false,function(){post('/crew/cancel',{id:i.id}).then(refresh);}));box.appendChild(r);});}
      var own=(d.pets||[]).filter(function(p){return p.owner;});
      (d.pets||[]).forEach(function(p){box.appendChild(el('p','tll-crew-k',p.name+(p.owner?'':' (shared with you)')));
        if(!p.coOwners.length&&p.owner)box.appendChild(el('p','tll-crew-msg','Not shared yet. Search a traveler above, then pick Share '+p.name+'.'));
        p.coOwners.forEach(function(o){var r=personRow(o,'Co-owner');if(p.owner)r.appendChild(btn('Remove',false,function(){post('/crew/leave',{kind:'pet',pet:p.id,who:o.id}).then(refresh);}));box.appendChild(r);});
        if(!p.owner)box.appendChild(btn('Leave '+p.name,false,function(){post('/crew/leave',{kind:'pet',pet:p.id}).then(refresh);}));});
      pets=own;
    }
    var pets=[];
    function refresh(){post('/crew/inbox').then(function(d){if(d&&d.ok)render(d);});}
    function choose(p){chosen=p;res.hidden=true;q.value=p.name;pick.textContent='';
      var chips=el('div','tll-crew-chips');var opts=[['partner','Partner'],['family','Family'],['buddy','Travel buddy']].concat(pets.map(function(x){return['pet:'+x.id,'Share '+x.name];}));
      opts.forEach(function(o){var c=el('button','tll-crew-chip',o[1]);c.type='button';c.setAttribute('aria-pressed',String(o[0]===type));c.addEventListener('click',function(){type=o[0];[].forEach.call(chips.children,function(x){x.setAttribute('aria-pressed','false');});c.setAttribute('aria-pressed','true');});chips.appendChild(c);});
      pick.appendChild(chips);
      pick.appendChild(btn('Send invite',true,function(){var body=/^pet:/.test(type)?{kind:'pet',pet:type.slice(4),to:chosen.id}:{kind:'person',to:chosen.id,type:type};
        post('/crew/invite',body).then(function(r){if(r&&r.ok){msg.textContent='Invite sent to '+chosen.name+'. You can cancel it any time.';q.value='';pick.hidden=true;refresh();}else msg.textContent=(r&&r.error)||'That did not go through. Try again in a moment.';});}));
      pick.hidden=false;}
    function search(){var v=q.value.trim();if(v.length<2){res.hidden=true;return;}var my=++seq;
      fetch(API+'/crew/people?q='+encodeURIComponent(v)).then(function(r){return r.json();}).then(function(j){if(my!==seq)return;res.textContent='';
        var list=(j&&j.people||[]).filter(function(p){return p.id!==d.me.id;});
        if(!list.length){res.appendChild(el('p','tll-crew-msg','No traveler by that name yet. Not on TLL? Name them in the story byline instead.'));res.hidden=false;return;}
        list.forEach(function(p){var b=el('button');b.type='button';var av=el('span','tll-crew-av');if(p.avatar)av.style.backgroundImage='url("'+p.avatar+'")';else av.textContent=initials(p.name);b.appendChild(av);b.appendChild(document.createTextNode(p.name));b.addEventListener('click',function(){choose(p);});res.appendChild(b);});res.hidden=false;}).catch(function(){});}
    /* take Enter and typing away from the old private-name handler */
    q.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();search();}},true);
    q.addEventListener('input',function(e){e.stopImmediatePropagation();pick.hidden=true;clearTimeout(timer);timer=setTimeout(search,300);},true);
    q.setAttribute('placeholder','Search travelers by name');
    render(d);
  });
}

/* ---------- /account ---------- */
function account(){
  if(document.getElementById('tll-crew-inbox'))return;
  post('/crew/inbox').then(function(d){
    if(!d||!d.ok||!d.incoming.length||document.getElementById('tll-crew-inbox'))return;css();
    var wrap=el('div','tll-crew');wrap.id='tll-crew-inbox';
    d.incoming.forEach(function(i){var card=el('section','tll-crew-card');
      card.appendChild(el('h3','',i.kind==='pet'?'Share '+i.petName:'A travel companion request'));
      card.appendChild(personRow({name:i.fromName,avatar:i.fromAvatar},i.kind==='pet'?'wants you as co-owner of '+i.petName:'wants to add you as '+(TYPES[i.type]||TYPES.buddy)));
      card.appendChild(el('p','tll-crew-msg',i.kind==='pet'?'Every co-owner can log '+i.petName+"'s countries. They never count toward your own total.":'If you accept, you show on each other\'s profile under "Travels with". Your maps stay your own. Either of you can leave any time.'));
      var row=el('div','tll-crew-row');
      row.appendChild(btn('Accept',true,function(){post('/crew/answer',{id:i.id,accept:true}).then(function(r){card.textContent='';card.appendChild(el('p','',r&&r.ok?'Done. You now travel together on That Layover Life.':'That did not go through. Reload and try again.'));});}));
      row.appendChild(btn('Not now',false,function(){post('/crew/answer',{id:i.id,accept:false}).then(function(){card.remove();});}));
      card.appendChild(row);wrap.appendChild(card);});
    var main=document.querySelector('main')||document.body;var h=main.querySelector('h1');
    var anchor=h&&(h.closest('section')||h.parentElement);if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(wrap,anchor.nextSibling);else main.insertBefore(wrap,main.firstChild);
  });
}

/* ---------- public profile and pet pages ---------- */
function publicPage(kind,slug){
  if(document.getElementById('tll-crew-pub'))return;
  fetch(API+'/crew/public?'+(kind==='pet'?'pet=':'slug=')+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||document.getElementById('tll-crew-pub'))return;
    var people=kind==='pet'?(d.owners||[]).map(function(o,n){return [o,n?'Co-owner':'Owner','/contributors/'+o.slug];}):
      (d.companions||[]).map(function(c){return [c,c.type,'/contributors/'+c.slug];}).concat((d.pets||[]).map(function(p){return [p,'Shared pet','/pets/'+p.slug];}));
    if(kind==='pet'&&people.length<2)return;   /* show owners only when the pet is shared */
    if(!people.length)return;css();
    var s=el('section','tll-crew tll-crew-pub');s.id='tll-crew-pub';s.appendChild(el('p','tll-crew-k','Travels with'));
    var g=el('div','tll-crew-grid');people.forEach(function(x){g.appendChild(personRow(x[0],x[1],x[2]));});s.appendChild(g);
    var main=document.querySelector('main')||document.body;var h=main.querySelector('h1');var anchor=h&&(h.closest('section')||h.parentElement);
    if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(s,anchor.nextSibling);else main.appendChild(s);
  }).catch(function(){});
}

function run(){
  if(P==='/edit-profile')editProfile();
  else if(P==='/account')account();
  else{var m=/^\/contributors\/([^/]+)$/.exec(P);if(m)publicPage('person',m[1]);else{m=/^\/pets\/([^/]+)$/.exec(P);if(m)publicPage('pet',m[1]);}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,900);});else setTimeout(run,900);
setTimeout(run,3000);
})();

/* tll-home-value-v1 (31 Oct 2026, Value Playbook Phase 1: homepage value messaging). STAGED: renders only for a preview,
   https://www.thatlayover.life/?preview=value (remembered in this browser; ?preview=off clears it). The public home page is
   unchanged until Nancy approves; then PUBLIC below flips to true.
   Under the weekly cover: the value line and the three section 2 lines from the playbook (slide show, uncle deck, lost account),
   then the call to action as one question, "What do you collect?", with the pursuit hubs as answers. Copy is the playbook's own,
   in Nancy's words. Clicks carry division "tll" for GA4 (Phase 7 tagging). No nav or footer touched; no data-ms-* element. */
(function(){
var PUBLIC=false;
var P=location.pathname.replace(/\/+$/,'')||'/';if(P!=='/')return;
var q=new URLSearchParams(location.search).get('preview');
try{if(q==='value')localStorage.setItem('tll-preview-value','1');if(q==='off')localStorage.removeItem('tll-preview-value');}catch(e){}
var on=PUBLIC;try{on=on||localStorage.getItem('tll-preview-value')==='1';}catch(e){}
if(!on&&q!=='value')return;
var PURSUITS=[['foodie','Food'],['marathons','Marathons'],['trekking','Trekking'],['dog-travel','Dog travel']];
var LINES=[['The slide show.','Remember when Grandpa pulled out the slide projector after dinner? This is that.'],
  ['The uncle deck.','Remember when your uncle made a PowerPoint of his trip to Boston? (This really happened.) This is that, except people ask to see it.'],
  ['The lost account.','A friend got locked out of Instagram and lost every travel photo with it. TLL is the copy that does not vanish when an app decides you are someone else.']];
var CSS='.tll-val{background:#FDF9F3;color:#0A0B14;padding:72px 16px 80px;font:400 17px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif}'+
'.tll-val-in{max-width:1120px;margin:0 auto}.tll-val-ey{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:2px;text-transform:uppercase;color:#067A79;margin:0 0 14px}'+
'.tll-val h2{font:800 clamp(30px,4.6vw,52px)/1.04 "Playfair Display",Georgia,serif;margin:0 0 16px;max-width:18ch}.tll-val h2 em{font-style:italic;color:#C8325B}'+
'.tll-val-lede{max-width:60ch;color:#3a3833;margin:0 0 36px}'+
'.tll-val-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin:0 0 48px}'+
'.tll-val-card{border-top:2px solid #0A0B14;padding:16px 0 0}.tll-val-card b{display:block;font:800 22px/1.15 "Playfair Display",Georgia,serif;margin:0 0 8px}.tll-val-card p{margin:0;color:#3a3833}'+
'.tll-val-ask{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;border:1px solid #E0DACE;background:#fff;border-radius:4px;padding:20px}'+
'.tll-val-ask strong{font:800 24px/1.1 "Playfair Display",Georgia,serif;margin-right:8px}'+
'.tll-val-ask a{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1.5px solid #0A0B14;border-radius:999px;color:#0A0B14;text-decoration:none;font-weight:600}'+
'.tll-val-ask a:hover,.tll-val-ask a:focus-visible{background:#0A0B14;color:#FDF9F3}'+
'.tll-val-ask a.p{background:#C8325B;border-color:#C8325B;color:#fff}'+
'.tll-val-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 10px}'+
'@media (max-width:760px){.tll-val{padding:52px 16px 60px}.tll-val-grid{grid-template-columns:1fr;gap:22px}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function track(name,extra){try{window.gtag&&gtag('event',name,Object.assign({division:'tll'},extra||{}));}catch(e){}}
function run(){
  if(document.getElementById('tll-val'))return;
  var hero=document.querySelector('[data-h3-hero]');if(!hero)return;
  if(!document.getElementById('tll-home-value-v1')){var s=el('style');s.id='tll-home-value-v1';s.textContent=CSS;document.head.appendChild(s);}
  var sec=el('section','tll-val');sec.id='tll-val';sec.setAttribute('aria-labelledby','tll-val-h');
  var inn=el('div','tll-val-in');sec.appendChild(inn);
  if(!PUBLIC)inn.appendChild(el('p','tll-val-flag','Preview · not live'));
  inn.appendChild(el('p','tll-val-ey','Why That Layover Life'));
  var h=el('h2');h.id='tll-val-h';h.appendChild(document.createTextNode('The family slide show, rebuilt for people who '));h.appendChild(el('em','','never stop going.'));inn.appendChild(h);
  inn.appendChild(el('p','tll-val-lede',"It keeps your trips somewhere that is yours, shows them off the way Grandpa's slide projector did, and puts you next to people who travel the way you do. Free, no card, 16+."));
  var g=el('div','tll-val-grid');LINES.forEach(function(l){var c=el('div','tll-val-card');c.appendChild(el('b','',l[0]));c.appendChild(el('p','',l[1]));g.appendChild(c);});inn.appendChild(g);
  var ask=el('div','tll-val-ask');ask.appendChild(el('strong','','What do you collect?'));
  PURSUITS.forEach(function(p){var a=el('a','',p[1]);a.href='/pursuits/'+p[0]+'?utm_source=home&utm_medium=value&utm_campaign=tll';a.addEventListener('click',function(){track('value_pursuit_click',{pursuit:p[0]});});ask.appendChild(a);});
  var j=el('a','p','Countries, too: join free');j.href='/signup?utm_source=home&utm_medium=value&utm_campaign=tll';j.addEventListener('click',function(){track('value_join_click');});ask.appendChild(j);
  inn.appendChild(ask);
  hero.insertAdjacentElement('afterend',sec);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();

/* tll-collections-v1 (31 Oct 2026, Nancy: "Add postcards and shot glasses, private by default, build it"; "Private by default with
   opt in"). Souvenir collections. Talks to the Worker (/collections/*); while those routes are not live nothing shows.
   /edit-profile: "My collections" under 04 Your crew. Add an item (collection, country, optional city, year, caption, photo);
     each collection has its own "Show on my profile" switch, off until the member turns it on. Photos are redrawn on a canvas
     before upload (no EXIF, no GPS) and go to Cloudinary (unsigned preset tll_photos, folder tll/collections).
   /contributors/<slug>: a "Collections" shelf per collection the member chose to show, countries counted, never typed.
   Year only, city only. No data-ms-* element touched; no form or field names changed. */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var CLOUD='https://api.cloudinary.com/v1_1/idonvlow/image/upload',PRESET='tll_photos',EDGE=2000;
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-col{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-col [hidden]{display:none!important}'+
'.tll-col-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:18px 0 8px}'+
'.tll-col-group{border:1px solid #E0DACE;border-radius:8px;background:#fff;padding:12px;margin:0 0 12px}'+
'.tll-col-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin:0 0 10px}.tll-col-head b{font:800 18px/1.2 "Playfair Display",Georgia,serif}'+
'.tll-col-head label{display:inline-flex;align-items:center;gap:8px;font-size:14px;min-height:36px;cursor:pointer}.tll-col-head input{width:18px;height:18px;accent-color:#C8325B}'+
'.tll-col-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}'+
'.tll-col-it{position:relative;border-radius:6px;overflow:hidden;background:#F7F1E8;min-height:120px;display:flex;flex-direction:column;justify-content:flex-end}'+
'.tll-col-it img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.tll-col-it span{position:relative;display:block;padding:6px 8px;background:linear-gradient(transparent,rgba(10,11,20,.78));color:#fff;font-size:13px;line-height:1.3}'+
'.tll-col-it button{position:absolute;top:4px;right:4px;width:32px;height:32px;border:0;border-radius:50%;background:rgba(10,11,20,.7);color:#fff;font-size:18px;line-height:1;cursor:pointer}'+
'.tll-col-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border:1px dashed #E0DACE;border-radius:8px;padding:12px;margin-top:8px}'+
'.tll-col-form label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#5F5A54}.tll-col-form .w{grid-column:1/-1}'+
'.tll-col-form input,.tll-col-form select{box-sizing:border-box;width:100%;max-width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;min-height:44px}'+
'.tll-col-b{border:0;background:#C8325B;color:#fff;border-radius:4px;padding:10px 16px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;min-height:44px;cursor:pointer}'+
'.tll-col-msg{font-size:13px;color:#5F5A54;margin:6px 0}.tll-col-pub{max-width:1120px;margin:32px auto;padding:0 16px}'+
'.tll-col-pub .tll-col-group{background:transparent;border:0;border-top:2px solid #0A0B14;border-radius:0;padding:14px 0 0}'+
'@media (max-width:560px){.tll-col-form{grid-template-columns:1fr}}';
function css(){if(document.getElementById('tll-collections-v1'))return;var s=document.createElement('style');s.id='tll-collections-v1';s.textContent=CSS;document.head.appendChild(s);}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function countries(){var out=[];try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var a=65;a<91;a++)for(var b=65;b<91;b++){var c=String.fromCharCode(a,b),n=dn.of(c);if(n&&n!==c&&!/^(EU|EZ|UN|QO|XA|XB|ZZ|FX|YU|SU|ZR|TP|UK)$/.test(c))out.push(n);}}catch(e){}return out.filter(function(v,i,s){return s.indexOf(v)===i;}).sort();}
function clean(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,EDGE/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*s);c.height=Math.round(h*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej('read');},'image/jpeg',0.88);};im.onerror=function(){URL.revokeObjectURL(u);rej('read');};im.src=u;});}
function upload(file){return clean(file).then(function(blob){var fd=new FormData();fd.append('file',blob,'item.jpg');fd.append('upload_preset',PRESET);fd.append('folder','tll/collections');return fetch(CLOUD,{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){if(!j.secure_url)throw 'upload';return j.secure_url;});});}
function tile(i,onDel){var t=el('div','tll-col-it');if(i.photo){var im=el('img');im.src=i.photo.replace('/upload/','/upload/c_fill,w_400,h_400,q_auto,f_auto/');im.alt=(i.categoryName||'')+', '+i.country;im.loading='lazy';t.appendChild(im);}
  t.appendChild(el('span','',[i.country,i.city,i.year].filter(Boolean).join(' · ')+(i.caption?' · '+i.caption:'')));
  if(onDel){var x=el('button','','×');x.type='button';x.setAttribute('aria-label','Remove '+i.country);x.addEventListener('click',onDel);t.appendChild(x);}return t;}
function groupsOf(items){var g={},order=[];items.forEach(function(i){var k=i.category==='other'?'other:'+i.categoryName.toLowerCase():i.category;if(!g[k]){g[k]={category:i.category,name:i.categoryName,items:[]};order.push(k);}g[k].items.push(i);});return order.map(function(k){return g[k];});}

function editProfile(){
  var crew=document.getElementById('ep-crew');if(!crew||document.getElementById('tll-col'))return;
  post('/collections/mine').then(function(d){
    if(!d||!d.ok||document.getElementById('tll-col'))return;css();
    var sec=el('section','ep-sec tll-col');sec.id='tll-col';sec.setAttribute('aria-labelledby','tll-col-h');
    var h=el('h2','ep-eb','04B · My collections');h.id='tll-col-h';sec.appendChild(h);
    sec.appendChild(el('p','ep-lede','Magnets, mugs, postcards, shot glasses: whatever you bring home. Private until you switch a collection on, and only that collection shows on your profile. Year and city only, never dates.'));
    var list=el('div');sec.appendChild(list);
    var f=el('div','tll-col-form');f.setAttribute('role','group');f.setAttribute('aria-label','Add to my collections');
    function field(lbl,node,wide){var l=el('label',wide?'w':'',lbl);l.appendChild(node);f.appendChild(l);return node;}
    var cat=el('select');d.categories.forEach(function(c){var o=el('option','',c.name);o.value=c.slug;cat.appendChild(o);});field('Collection',cat);
    var own=el('input');own.maxLength=40;own.placeholder='Sand, spoons, beer mats…';var ownL=field('Your name for it',own);ownL.parentNode.hidden=true;
    cat.addEventListener('change',function(){ownL.parentNode.hidden=cat.value!=='other';});
    var ctry=el('input');ctry.setAttribute('list','tll-col-countries');ctry.required=true;ctry.autocomplete='off';field('Country',ctry);
    var dl=el('datalist');dl.id='tll-col-countries';countries().forEach(function(n){var o=el('option');o.value=n;dl.appendChild(o);});f.appendChild(dl);
    var city=el('input');city.maxLength=60;field('City (optional)',city);
    var year=el('input');year.type='number';year.inputMode='numeric';year.min='1900';year.max=String(new Date().getFullYear());field('Year (optional)',year);
    var cap=el('input');cap.maxLength=140;field('A line about it (optional)',cap,true);
    var file=el('input');file.type='file';file.accept='image/jpeg,image/png,image/webp,image/heic';field('Photo (optional)',file,true);
    var btn=el('button','tll-col-b','Add to my collections');btn.type='button';f.appendChild(btn);
    var msg=el('p','tll-col-msg');msg.setAttribute('aria-live','polite');f.appendChild(msg);
    sec.appendChild(f);
    function render(items,shown){list.textContent='';if(!items.length){list.appendChild(el('p','tll-col-msg','Nothing yet. Add your first piece below.'));return;}
      groupsOf(items).forEach(function(g){var box=el('div','tll-col-group'),hd=el('div','tll-col-head');
        var n=new Set(g.items.map(function(i){return i.country;})).size;hd.appendChild(el('b','',g.name+' · '+n+(n===1?' country':' countries')));
        var lab=el('label'),sw=el('input');sw.type='checkbox';sw.checked=g.items.some(function(i){return i.shown;});lab.appendChild(sw);lab.appendChild(document.createTextNode('Show on my profile'));
        sw.addEventListener('change',function(){sw.disabled=true;post('/collections/show',{category:g.category,own:g.category==='other'?g.name:'',show:sw.checked}).then(function(){sw.disabled=false;refresh();});});
        hd.appendChild(lab);box.appendChild(hd);var grid=el('div','tll-col-grid');
        g.items.forEach(function(i){grid.appendChild(tile(i,function(){if(!confirm('Remove this '+g.name.toLowerCase()+' from '+i.country+'?'))return;post('/collections/delete',{id:i.id}).then(refresh);}));});
        box.appendChild(grid);list.appendChild(box);});}
    function refresh(){post('/collections/mine').then(function(r){if(r&&r.ok)render(r.items,r.shown);});}
    f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();e.stopPropagation();add();}},true);
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();add();});
    function add(){
      if(!ctry.value.trim()){msg.textContent='Pick a country.';ctry.focus();return;}
      btn.disabled=true;msg.textContent=file.files[0]?'Cleaning and uploading the photo…':'Adding…';
      (file.files[0]?upload(file.files[0]):Promise.resolve('')).then(function(url){
        return post('/collections/add',{category:cat.value,own:own.value,country:ctry.value,city:city.value,year:year.value,caption:cap.value,photo:url});
      }).then(function(r){btn.disabled=false;if(r&&r.ok){msg.textContent='Added. '+(r.item.shown?'It shows on your profile.':'Private until you switch this collection on.');ctry.value='';city.value='';year.value='';cap.value='';file.value='';refresh();}else msg.textContent=(r&&r.error)||'That did not go through. Try again.';})
      .catch(function(){btn.disabled=false;msg.textContent='The photo could not be uploaded. Try another, or add it without a photo.';});
    }
    crew.insertAdjacentElement('afterend',sec);render(d.items,d.shown);
  });
}

function profile(slug){
  if(document.getElementById('tll-col-pub'))return;
  fetch(API+'/collections/public?slug='+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||!d.shelves.length||document.getElementById('tll-col-pub'))return;css();
    var s=el('section','tll-col tll-col-pub');s.id='tll-col-pub';s.appendChild(el('p','tll-col-k','Collections'));
    d.shelves.forEach(function(g){var box=el('div','tll-col-group'),hd=el('div','tll-col-head');hd.appendChild(el('b','',g.name+' · '+g.countries+(g.countries===1?' country':' countries')));box.appendChild(hd);
      var grid=el('div','tll-col-grid');g.items.forEach(function(i){grid.appendChild(tile(i));});box.appendChild(grid);s.appendChild(box);});
    var after=document.getElementById('tll-crew-pub');var main=document.querySelector('main')||document.body;
    if(after)after.insertAdjacentElement('afterend',s);else{var h=main.querySelector('h1'),a=h&&(h.closest('section')||h.parentElement);if(a&&a.parentNode)a.parentNode.insertBefore(s,a.nextSibling);else main.appendChild(s);}
  }).catch(function(){});
}

function run(){if(P==='/edit-profile')editProfile();else{var m=/^\/contributors\/([^/]+)$/.exec(P);if(m)profile(m[1]);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
setTimeout(run,3500);
})();

/* tll-whats-new-v1 (31 Oct 2026, Nancy: "when we add a new function, is there a way to prompt current users to check it out?"
   "Yes please"). Signed-in members only. The Worker (GET /whats-new) lists the entries Nancy switched on in the CMS "What's new"
   collection. An entry a member has not seen, and that started after they joined:
   1. puts a small rose dot on the member bar's account link (any page), with "new" for screen readers;
   2. shows as a card at the top of /account: title, one line, a button to the feature and "Got it".
   Seen entries are kept on the member's own Memberstack record (JSON key tllSeenNew, merged with what is there), so they stay
   gone on every device; this browser keeps a copy too. Nothing shows while no entry is live. The nav component is not edited
   in the Designer: the dot is added in the browser to a link the member bar already has, never to a data-ms-* element. */
(function(){
if(window.__tllWhatsNew)return;window.__tllWhatsNew=1;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/whats-new';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-wn-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#C8325B;margin-left:6px;vertical-align:middle;box-shadow:0 0 0 2px #FDF9F3}'+
'.tll-wn-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}'+
'.tll-wn{max-width:760px;margin:20px auto;padding:0 16px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-wn-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-wn-card{border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff;padding:14px 16px;margin:0 0 10px}'+
'.tll-wn-card h3{font:800 19px/1.2 "Playfair Display",Georgia,serif;margin:0 0 4px}.tll-wn-card p{margin:0 0 10px;color:#3a3833}'+
'.tll-wn-row{display:flex;flex-wrap:wrap;gap:8px}.tll-wn-row a,.tll-wn-row button{display:inline-flex;align-items:center;min-height:40px;padding:0 14px;border-radius:4px;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;text-decoration:none}'+
'.tll-wn-row a{background:#C8325B;color:#fff;border:0}.tll-wn-row button{background:transparent;border:1.5px solid #0A0B14;color:#0A0B14}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-whats-new-v1'))return;var s=el('style');s.id='tll-whats-new-v1';s.textContent=CSS;document.head.appendChild(s);}
function ms(){return window.$memberstackDom;}
function local(){try{return JSON.parse(localStorage.getItem('tll-seen-new')||'[]');}catch(e){return[];}}
function saveLocal(a){try{localStorage.setItem('tll-seen-new',JSON.stringify(a));}catch(e){}}
function seenRemote(){var m=ms();if(!m||!m.getMemberJSON)return Promise.resolve({json:{},seen:[]});
  return m.getMemberJSON().then(function(j){var d=(j&&j.data)||{};return{json:d,seen:Array.isArray(d.tllSeenNew)?d.tllSeenNew:[]};}).catch(function(){return{json:{},seen:[]};});}
function markSeen(id){var l=local();if(l.indexOf(id)<0){l.push(id);saveLocal(l);}
  var m=ms();if(!m||!m.getMemberJSON||!m.updateMemberJSON)return;
  m.getMemberJSON().then(function(j){var d=(j&&j.data)||{};var s=Array.isArray(d.tllSeenNew)?d.tllSeenNew.slice():[];if(s.indexOf(id)<0)s.push(id);d.tllSeenNew=s.slice(-50);return m.updateMemberJSON({json:d});}).catch(function(){});}
function dots(n){
  [].forEach.call(document.querySelectorAll('.tll-wn-dot,.tll-wn-sr'),function(x){x.remove();});if(!n)return;
  var links=[].filter.call(document.querySelectorAll('a[href^="/account"]'),function(a){return ![].some.call(a.attributes,function(x){return x.name.indexOf('data-ms-')===0;})&&a.offsetParent!==null&&!a.closest('#tll-wn');});
  var a=links[0];if(!a)return;var d=el('span','tll-wn-dot');d.setAttribute('aria-hidden','true');a.appendChild(d);a.appendChild(el('span','tll-wn-sr',' ('+n+' new)'));}
function card(list,left){
  var box=document.getElementById('tll-wn');if(!list.length){if(box)box.remove();return;}
  if(!box){box=el('section','tll-wn');box.id='tll-wn';box.setAttribute('aria-label','New on That Layover Life');
    var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),anc=h&&(h.closest('section')||h.parentElement);
    if(anc&&anc.parentNode)anc.parentNode.insertBefore(box,anc.nextSibling);else main.insertBefore(box,main.firstChild);}
  box.textContent='';box.appendChild(el('p','tll-wn-k','New on That Layover Life'));
  list.forEach(function(e){var c=el('div','tll-wn-card');c.appendChild(el('h3','',e.title));if(e.line)c.appendChild(el('p','',e.line));
    var row=el('div','tll-wn-row');
    if(e.link){var a=el('a','',e.button);a.href=e.link;a.addEventListener('click',function(){markSeen(e.id);try{window.gtag&&gtag('event','whats_new_click',{division:'tll',entry:e.id});}catch(x){}});row.appendChild(a);}
    var b=el('button','','Got it');b.type='button';b.addEventListener('click',function(){markSeen(e.id);left(e.id);});row.appendChild(b);
    c.appendChild(row);box.appendChild(c);});}
function run(){
  var m=ms();if(!m||!m.getCurrentMember)return;
  m.getCurrentMember().then(function(r){
    var mem=r&&r.data;if(!mem)return null;
    return Promise.all([fetch(API).then(function(x){return x.ok?x.json():{entries:[]};}).catch(function(){return{entries:[]};}),seenRemote()]).then(function(v){
      var joined=Date.parse(mem.createdAt||mem.created_at||'')||0,seen=v[1].seen.concat(local());
      var fresh=(v[0].entries||[]).filter(function(e){return seen.indexOf(e.id)<0&&(!joined||!e.starts||Date.parse(e.starts)>=joined-864e5);});
      if(!fresh.length)return;css();
      function left(id){fresh=fresh.filter(function(e){return e.id!==id;});dots(fresh.length);if(P==='/account')card(fresh,left);}
      dots(fresh.length);if(P==='/account')card(fresh,left);
    });
  }).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1400);});else setTimeout(run,1400);
})();

/* tll-ads-v1 (31 Oct 2026, Nancy: "AdSense is on. Can you implement it tastefully?"). Publisher ca-pub-7257230007536660.
   Where ads may appear: story pages, the /stories library and country pages. Nowhere else: the home page, forms (/submit,
   /share-photos, /contact), account and profile editing, login and signup, the map, the Lounge, About and the legal pages
   stay ad-free, and so does any sponsored or hosted story. On those pages every ad request is paused, which also keeps
   Google's Auto ads off them.
   Placements, at most two per story: one in-article unit between two sections (never before the third paragraph, none on
   stories under 600 words) and one after the story ends; one below the stories rail on country pages; on /stories one after the ninth card. Each sits in a quiet frame labeled "Annonce" (Phase 0B, 31 Oct), with its
   space held so the page does not jump; an ad slot Google leaves unfilled folds away. Manual units need slot ids from the
   AdSense account (SLOTS below); until then only the ad-free rules apply and Auto ads are calmed by the same frame style.
   Consent: Google's consent message (Funding Choices) decides personalized or not. No data-ms-* element touched. */
(function(){
var CLIENT='ca-pub-7257230007536660';
var SLOTS={inArticle:'',display:''};   /* fill from AdSense > Ads > By ad unit: an In-article unit and a Display (responsive) unit */
var P=location.pathname.replace(/\/+$/,'')||'/';
var ALLOW=/^\/stories(\/[^/]+)?$|^\/countries\/[^/]+$/.test(P);
window.adsbygoogle=window.adsbygoogle||[];
if(!ALLOW){window.adsbygoogle.pauseAdRequests=1;return;}
var CSS='.tll-ad{display:block;max-width:760px;margin:44px auto;padding:10px 0 0;border-top:1px solid #E0DACE;text-align:center;clear:both}'+
'.tll-ad::before{content:"Annonce";display:block;margin:0 0 8px;font:600 10px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#6B6660}'+
'.tll-ad ins{display:block;min-height:250px}.tll-ad.is-empty{display:none}'+
'.google-auto-placed{max-width:760px;margin:44px auto!important;padding-top:10px;border-top:1px solid #E0DACE}'+
'.tll-lib-ad{grid-column:1/-1}';
function css(){if(document.getElementById('tll-ads-v1'))return;var s=document.createElement('style');s.id='tll-ads-v1';s.textContent=CSS;document.head.appendChild(s);}
function script(){if(document.querySelector('script[src*="adsbygoogle.js"]'))return;var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+CLIENT;document.head.appendChild(s);}
function sponsored(){var t=(document.querySelector('[data-tll-sponsored]')||{}).textContent||'';return /\S/.test(t)||/\bReklame\b|\bHosted:/i.test((document.querySelector('.tll-story-ledger,.tll-ledger,main')||document.body).innerText.slice(0,4000));}
function unit(slot,fmt,extra){var w=document.createElement('aside');w.className='tll-ad'+(extra?' '+extra:'');w.setAttribute('aria-label','Annonce (advertisement)');
  var i=document.createElement('ins');i.className='adsbygoogle';i.setAttribute('data-ad-client',CLIENT);i.setAttribute('data-ad-slot',slot);
  if(fmt==='fluid'){i.setAttribute('data-ad-layout','in-article');i.setAttribute('data-ad-format','fluid');i.style.textAlign='center';}else{i.setAttribute('data-ad-format','auto');i.setAttribute('data-full-width-responsive','true');}
  w.appendChild(i);new MutationObserver(function(){if(i.getAttribute('data-ad-status')==='unfilled')w.classList.add('is-empty');}).observe(i,{attributes:true,attributeFilter:['data-ad-status']});
  return w;}
function push(w){try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){w.classList.add('is-empty');}}
function story(){
  if(sponsored()){window.adsbygoogle.pauseAdRequests=1;return;}
  var b=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')).filter(function(x){return x.id!=='tll-quick-answers';}).sort(function(x,y){return y.querySelectorAll(':scope>p').length-x.querySelectorAll(':scope>p').length;})[0];
  if(!b||document.querySelector('.tll-ad'))return;
  var ps=b.querySelectorAll(':scope>p');var words=(b.innerText||'').split(/\s+/).filter(Boolean).length;
  if(SLOTS.inArticle&&words>=600&&ps.length>=4){   /* Phase 0B: at most one in-article unit, after the third paragraph, none under 600 words */var hs=[].slice.call(b.querySelectorAll(':scope>h2')).filter(function(h){var before=0,n=h.previousElementSibling;while(n){if(n.tagName==='P')before++;n=n.previousElementSibling;}return before>=3;});
    var mid=hs.length?hs[Math.floor(hs.length/2)]:ps[Math.max(3,Math.floor(ps.length/2))];var w=unit(SLOTS.inArticle,'fluid');mid.parentNode.insertBefore(w,mid);push(w);}
  if(SLOTS.display){var w2=unit(SLOTS.display,'auto');b.parentNode.insertBefore(w2,b.nextSibling);push(w2);}
}
function library(){
  if(!SLOTS.display||document.querySelector('.tll-ad'))return;var cards=document.querySelectorAll('a.tll-lib-card');if(cards.length<12)return;
  var c=cards[8],cell=c.closest('.w-dyn-item')||c;var w=unit(SLOTS.display,'auto','tll-lib-ad');cell.parentNode.insertBefore(w,cell.nextSibling);push(w);
}
function country(){
  if(!SLOTS.display||document.querySelector('.tll-ad'))return;var lists=document.querySelectorAll('main .w-dyn-list,.w-dyn-list');var l=lists[lists.length-1];if(!l)return;
  var w=unit(SLOTS.display,'auto');l.parentNode.insertBefore(w,l.nextSibling);push(w);
}
function run(){css();script();if(/^\/stories\/[^/]+$/.test(P))story();else if(P==='/stories')library();else if(/^\/countries\//.test(P))country();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,600);});else setTimeout(run,600);
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
var CS=document.createElement('style');CS.id='tll-mag-cover-v1';CS.textContent="/* The magazine cover (26 Oct 2026, direction A, Nancy: \"I prefer the full page image hero\"). Home page only. Restyles the existing\n   [data-h3-hero] block: the cover story's photo full bleed, a chip with the writer's face (\"{Name} went to {Place}\"), the kicker,\n   the site's own headline in Newsreader, the deck, a button to the cover story and a Join free button (29 Oct), the photo credit with coordinates, and the stamp,\n   which lands once on load. No element removed: the eyebrow, the FREE line and the old coordinates are hidden.\n   Loads after the page's own styles and after tll-home-hero-phone-v1, so it wins the cascade with the same specificity. */\nbody:not(.tll-none) [data-h3-hero]{position:relative !important;min-height:max(calc(100svh - 96px),640px) !important;display:flex !important;flex-direction:column !important;justify-content:flex-end !important;margin:0 !important;padding:0 !important;border:0 !important;border-radius:0 !important;overflow:hidden !important;background:#0A0B14 !important;--tll-cover-pos:var(--tll-cover-pos-phone,50% 50%)}\nbody:not(.tll-none) [data-h3-hero] > img[data-tll-parallax=\"hero\"]{position:absolute !important;inset:0 !important;top:calc(-1 * var(--tll-cover-zoom,0%)) !important;bottom:auto !important;width:100% !important;height:calc(100% + var(--tll-cover-zoom,0%)) !important;max-width:none !important;object-fit:cover !important;object-position:var(--tll-cover-pos) !important;border-radius:0 !important;transform:none !important;opacity:1 !important;filter:none !important}\nbody:not(.tll-none) [data-h3-hero]::after{content:\"\" !important;position:absolute !important;inset:0 !important;z-index:1 !important;pointer-events:none !important;background:linear-gradient(180deg,rgba(10,11,20,.32) 0%,rgba(10,11,20,0) 20%,rgba(10,11,20,0) 46%,rgba(10,11,20,.42) 66%,rgba(10,11,20,.84) 100%) !important}\nbody:not(.tll-none) [data-h3-hero] > div:has(> h1){position:relative !important;z-index:2 !important;width:100% !important;max-width:none !important;margin:0 !important;padding:0 16px max(clamp(40px,8vh,80px),76px) !important;box-sizing:border-box !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-eyebrow{display:none !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip{display:inline-flex !important;align-items:center;gap:10px;padding:6px 14px 6px 6px;min-height:48px;border-radius:999px;background:rgba(10,11,20,.6);color:#F7F1E8 !important;text-decoration:none !important;font:400 13px/1.2 'Inter Tight',system-ui,sans-serif;margin:0 0 18px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);max-width:100%}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip img{width:36px;height:36px;border-radius:50%;object-fit:cover;flex:0 0 36px;position:static;box-shadow:0 0 0 1.5px #F0507A}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip b{display:block;font-weight:500;font-size:15px}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip:hover b,body:not(.tll-none) [data-h3-hero] .tll-mg-chip:focus-visible b{text-decoration:underline;text-decoration-color:#F0507A;text-underline-offset:3px}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip:focus-visible{outline:3px solid #F0507A;outline-offset:2px}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-kicker{display:block !important;font:500 13px/1.3 'Inter Tight',system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#F7F1E8;opacity:.85;margin:0 0 12px}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title){font-family:'Newsreader',Georgia,serif !important;font-weight:500 !important;font-size:clamp(46px,12vw,64px) !important;line-height:.95 !important;letter-spacing:-.02em !important;max-width:12ch !important;margin:0 !important;padding:0 !important;color:#F7F1E8 !important;text-wrap:balance}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) em{font-style:italic;color:inherit}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p{font-family:'Inter Tight',system-ui,sans-serif !important;font-size:19px !important;line-height:1.45 !important;max-width:36ch !important;margin:16px 0 0 !important;color:#E8E2D8 !important;text-wrap:pretty}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta{display:flex !important;flex-direction:column !important;gap:12px !important;margin:24px 0 0 !important;position:relative;z-index:3}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn{flex:none !important;width:100% !important;min-height:48px !important;box-sizing:border-box !important;justify-content:center !important;border-radius:0 !important;font:600 16px/1 'Inter Tight',system-ui,sans-serif !important;letter-spacing:0 !important;background:#D63859 !important;color:#fff !important;border-color:transparent !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn:hover{background:#B82C4B !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn:focus-visible{outline:3px solid #F7F1E8 !important;outline-offset:2px}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn.tll-mg-join{background:transparent !important;color:#F7F1E8 !important;border:1.5px solid #F7F1E8 !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn.tll-mg-join:hover{background:#F7F1E8 !important;color:#0D0F1A !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn + .h3-btn:not(.tll-mg-join){display:none !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-free{display:none !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-coords,body:not(.tll-none) [data-h3-hero] > div:has(> .h3-hero-coords){display:none !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-by{position:relative;z-index:2;margin:14px 0 0 !important;font:400 13px/1.5 'Inter Tight',system-ui,sans-serif;color:#B9B3A8}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-by b{color:#F7F1E8;font-weight:500}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-stamp{position:absolute !important;right:16px !important;left:auto !important;top:20px !important;bottom:auto !important;width:96px;z-index:2;color:#F7F1E8;opacity:.95;transform-origin:50% 50%;animation:tllMgLand 420ms cubic-bezier(.2,.9,.3,1.2) 250ms both;pointer-events:none}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-stamp svg{display:block;width:100%;height:auto}\n@keyframes tllMgLand{from{opacity:0;transform:scale(1.6) rotate(-14deg)}to{opacity:.95;transform:none}}\n@media(prefers-reduced-motion:reduce){body:not(.tll-none) [data-h3-hero] .tll-mg-stamp{animation:none}}\n@media(min-width:768px){\nbody:not(.tll-none) [data-h3-hero]{min-height:min(88vh,860px) !important;--tll-cover-pos:var(--tll-cover-pos-desk,50% 50%);--tll-cover-zoom:0%}\nbody:not(.tll-none) [data-h3-hero]::after{background:linear-gradient(90deg,rgba(10,11,20,.55) 0%,rgba(10,11,20,.36) 34%,rgba(10,11,20,.08) 62%,rgba(10,11,20,0) 78%),linear-gradient(180deg,rgba(10,11,20,.3) 0%,rgba(10,11,20,0) 18%,rgba(10,11,20,0) 64%,rgba(10,11,20,.34) 100%) !important}\nbody:not(.tll-none) [data-h3-hero] > img[data-tll-parallax=\"hero\"]{filter:brightness(1.14) saturate(1.06)}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title),body:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p,body:not(.tll-none) [data-h3-hero] .tll-mg-kicker{text-shadow:0 1px 2px rgba(10,11,20,.35),0 2px 24px rgba(10,11,20,.45)}\nbody:not(.tll-none) [data-h3-hero] > div:has(> h1){max-width:1240px !important;margin:0 auto !important;padding:0 var(--h3-g,48px) 56px !important}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title){font-size:clamp(56px,6vw,96px) !important}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p{font-size:20px !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta{flex-direction:row !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn{width:auto !important;min-width:240px;padding:0 28px !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-stamp{width:150px;right:var(--h3-g,48px);top:32px}\n}\n\n/* The magazine type on the rest of the home page (26 Oct 2026, direction A: Newsreader for display, Inter Tight for text, the\n   monospace only inside the stamp). The h3 sections read their faces from three variables, so one override switches them all;\n   the weights come down from Playfair's 800 to Newsreader's 500 and the tracking on the small caps comes in. */\n:root{--h3-head:'Newsreader',Georgia,serif;--h3-body:'Inter Tight',system-ui,sans-serif;--h3-mono:'Inter Tight',system-ui,sans-serif}\n.h3 [class*=\"h3-title\"]{font-weight:500 !important;letter-spacing:-.02em !important}\n.h3-card-title{font-weight:500 !important;letter-spacing:-.01em !important;font-size:clamp(22px,1.9vw,30px) !important;line-height:1.1 !important}\n.h3-ey,.h3-card-meta,.h3-card-tag,.h3-shelf-note,.h3-hero-free{font-weight:500 !important;letter-spacing:.08em !important}\n.h3-ey{font-size:13px !important}\n.h3-card-meta,.h3-card-tag{font-size:12px !important}\n.h3-card-by small{font-weight:500 !important;letter-spacing:.08em !important}\n.h3-lede{font-size:clamp(17px,1.4vw,20px) !important;line-height:1.5 !important}\n.h3-btn{font-weight:600 !important;letter-spacing:0 !important}\n\n/* The people who went (26 Oct 2026, from the approved cover prototype): the contributors' faces and one action tile (29 Oct, Nancy agreed: no open seats, stories first), placed before the\n   \"You went. Write it down.\" chapter. Built by the script below; links to the contributor pages and to /travelers. */\n.tll-mg-people .tll-mg-sechead{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:0 0 28px}\n.tll-mg-people .tll-mg-sechead h2{margin:0 !important}\n.tll-mg-people .tll-mg-all{font:500 15px/1.3 'Inter Tight',system-ui,sans-serif;color:#0A0B14 !important;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:4px;min-height:44px;display:inline-flex;align-items:center}\n.tll-mg-faces{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:24px 20px}\n.tll-mg-faces a{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-decoration:none !important;color:#0A0B14 !important;min-height:44px;padding:4px 0}\n.tll-mg-faces img,.tll-mg-faces i{width:72px;height:72px;border-radius:50%;object-fit:cover;margin-bottom:8px;flex:0 0 72px}\n.tll-mg-faces img{box-shadow:0 0 0 1.5px #C8325B}\n.tll-mg-faces i{display:flex;align-items:center;justify-content:center;border:1.5px dashed #C8325B;color:#C8325B;font-style:normal;font-size:28px;box-sizing:border-box}\n.tll-mg-faces b{font:500 16px/1.25 'Inter Tight',system-ui,sans-serif;color:#0A0B14}\n.tll-mg-faces span{font:400 14px/1.4 'Inter Tight',system-ui,sans-serif;color:#6B6660}\n.tll-mg-faces .tll-mg-open b{color:#C8325B}\n.tll-mg-faces a:hover b,.tll-mg-faces a:focus-visible b{text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:3px}\n.tll-mg-faces a:focus-visible{outline:3px solid #C8325B;outline-offset:2px;border-radius:4px}\n@media(min-width:768px){.tll-mg-faces{grid-template-columns:repeat(4,1fr);gap:32px}}\n\n/* Stamps on the library cards and on the letter (26 Oct build list: \"stamp on cards\"). Each card carries data-loc and data-date, so\n   the stamp is drawn from them; the letter's stamp reads SUNDAY. Decorative, aria-hidden, no pointer events. */\n.h3-card-ph .tll-mg-card-stamp{position:absolute;right:10px;top:10px;width:58px;color:#0A0B14;background:rgba(247,241,232,.82);border-radius:50%;z-index:2;pointer-events:none;transform:rotate(-6deg)}\n.h3-card-ph .tll-mg-card-stamp svg{display:block;width:100%;height:auto}\n@media(min-width:768px){.h3-card-ph .tll-mg-card-stamp{width:68px;right:12px;top:12px}}\nsection[data-h3=\"news\"]{position:relative}\nsection[data-h3=\"news\"] .tll-mg-letter-stamp{position:absolute;right:16px;top:16px;width:84px;color:#0A0B14;opacity:.9;z-index:2;pointer-events:none}\nsection[data-h3=\"news\"] .tll-mg-letter-stamp svg{display:block;width:100%;height:auto}\n@media(min-width:768px){section[data-h3=\"news\"] .tll-mg-letter-stamp{width:120px;right:var(--h3-g,48px);top:32px}}\n";(document.head||document.documentElement).appendChild(CS);
function place(){document.body.appendChild(CS);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();
/* Fills the cover from COVER (built by build-cover.py from the story's CMS item; nothing typed here is a story headline or body).
   Moves: the hero photo's src and alt are swapped, a chip and a kicker go before the h1, the deck text is set, the first button
   points at the cover story, a credit line and the stamp are appended. Runs once. */
(function(){
var COVER={"slug": "spain-madrid-wedding-ibiza", "title": "Spain: A Wedding and an Adventure", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad72dc3c7e76f61648a3c30_6ad72d77eeadeeb5b887095e_chesney-lish-spain-hero.jpeg", "alt": "Sunset over the sea from a beach bar in Ibiza, the sun low behind a thatched roof", "w": 1440, "h": 1920, "author": "Chesney Lish", "authorSlug": "chesney-lish", "avatar": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg", "place": "Ibiza", "stampPlace": "IBIZA", "stampDate": "27 SEP 2024", "stampArc": "BY THE PEOPLE WHO WENT", "coords": "38.98° N 1.43° E", "posPhone": "50% 100%", "posDesk": "50% 100%", "phoneZoom": "90%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"};var COVERS=[{"slug": "spain-madrid-wedding-ibiza", "title": "Spain: A Wedding and an Adventure", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad72dc3c7e76f61648a3c30_6ad72d77eeadeeb5b887095e_chesney-lish-spain-hero.jpeg", "alt": "Sunset over the sea from a beach bar in Ibiza, the sun low behind a thatched roof", "w": 1440, "h": 1920, "author": "Chesney Lish", "authorSlug": "chesney-lish", "avatar": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg", "place": "Ibiza", "stampPlace": "IBIZA", "stampDate": "27 SEP 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "38.98° N 1.43° E", "posPhone": "50% 100%", "posDesk": "50% 100%", "phoneZoom": "90%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "pantanal-glimmers-in-the-wild", "title": "Glimmers in the Wild: 120 Wooden Bridges, Jaguars, and No Guide", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ac86ab8eaf54b2878f9344b_6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river.jpeg", "alt": "A jaguar swimming the Cuiaba River with only its head and shoulders above the green water, looking straight at the camera", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Porto Jofre", "stampPlace": "PORTO JOFRE", "stampDate": "09 OCT 2026", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "agra-taj-mahal-keep-calm-and-curry-on", "title": "Keep Calm and Curry On", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acd1b923c1b0924065c1b18_6acd1b18901ddd1d8c4a33af_tll-in-agra-hero-taj-dawn-reflecting-pool.jpeg", "alt": "The Taj Mahal at dawn under a blue sky, reflected in the long garden pool between rows of cypress trees.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Agra", "stampPlace": "AGRA", "stampDate": "26 JUL 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "angkor-wat-most-indiana-jones-thing", "title": "The Most Indiana Jones Thing I Have Ever Done", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acce2ba03c2f8625896075a_6acce1fe9356a088c9deb375_tll-kh-hero-angkor-wat-sunrise-reflection.jpeg", "alt": "Angkor Wat's towers behind sugar palms at sunrise, the temple reflected in a rain-filled pool under an orange sky.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Siem Reap", "stampPlace": "SIEM REAP", "stampDate": "27 AUG 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "sort-sol-black-sun-denmark", "title": "I Drove Across Denmark to Watch a Million Birds Go to Bed", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6aba3d42f18f65b8d06aea74_6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars.jpeg", "alt": "A vast flock of starlings streaming across an orange sunset sky above wind turbines, with a line of parked cars and watchers along the marsh road below", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Rudbøl", "stampPlace": "RUDBØL", "stampDate": "29 SEP 2026", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "kilimanjaro-someone-was-already-awake", "title": "Someone Was Already Awake", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6aca68353e10fde58370d8db_6aca67718cbe7fd65ada6665_tll-kili-hero-glacier.jpeg", "alt": "A wall of glacier ice standing in the open on Kilimanjaro's summit plateau, with an unbroken floor of cloud stretching to the horizon behind it.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Tanzania", "stampPlace": "TANZANIA", "stampDate": "07 AUG 2025", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "bali-extended-layover-edition", "title": "Bali, Indonesia: Extended Layover Edition", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accb5fa77e495b89531db5a_6accb559bef9cade998d596f_tll-bali-hero-jatiluwih.jpeg", "alt": "Jatiluwih rice terraces stepping down a hillside under a lone coconut palm, a volcano faint on the horizon.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Bali", "stampPlace": "BALI", "stampDate": "13 FEB 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "luxembourg-schengen-road-trip", "title": "I’ve Been in Schengen for Years. This Weekend I Actually Went.", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad61a51fae3fb151cb482cb_6ad61926138353e2371f0646_lux-hero-luxembourg-city-skyline.jpeg", "alt": "Luxembourg City from the Pétrusse valley: the national flag, the spires of Notre-Dame Cathedral and the old fortress wall above autumn trees", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Schengen", "stampPlace": "SCHENGEN", "stampDate": "19 OCT 2026", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "istanbul-me-and-my-champagne-vacay", "title": "Me and My Champagne Vacay in Istanbul", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acd22bca172d6041e178f43_6acd2245c069c95705bd59f0_istanbul-hero-galata-bridge.jpeg", "alt": "The Galata Bridge in Istanbul lined with fishermen above the restaurants on its lower level, the New Mosque across the water", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Istanbul", "stampPlace": "ISTANBUL", "stampDate": "16 APR 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "cabo-san-lucas-final-fiesta-bachelorette", "title": "Final Fiesta", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acd1d69500078906e984068_6acd1d1113a10f320b1ae511_cabo-hero-el-arco-from-the-water.jpeg", "alt": "El Arco and the pale granite stacks at Land's End, Cabo San Lucas, seen from the water", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Cabo San Lucas", "stampPlace": "CABO SAN LUCAS", "stampDate": "22 JUN 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "laos-slowest-race-in-vientiane", "title": "The Slowest Race in Vientiane", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acd1c9fbe35f878324f780d_6acd1c03382125aa1175ce04_tll-laos-hero-that-luang.jpeg", "alt": "The gold stupa of Pha That Luang in Vientiane under a cloudy sky, sugar palms on either side.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Vientiane", "stampPlace": "VIENTIANE", "stampDate": "11 JUL 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "egypt-history-101-by-us", "title": "Egypt History 101 (by Us)", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accdb497e4bf299e34c64a1_6accda519a6e03060987175d_tll-egypt-hero-giza-night.jpeg", "alt": "The Giza pyramids and the Sphinx lit up at night for the light show", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Egypt", "stampPlace": "EGYPT", "stampDate": "31 OCT 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "uruguay-tiradentes-wine-yards", "title": "Uruguay Would Rather You Didn't Know", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accd59410785e9dc6928ff9_6accd402e982361969921f2c_uruguay-hero-vineyard-sunset.jpeg", "alt": "Autumn grapevines with red and purple leaves along a netted trellis at sunset, a stand of tall trees on the horizon, Maldonado, Uruguay", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Punta Del Este", "stampPlace": "PUNTA DEL ESTE", "stampDate": "23 APR 2023", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "costa-rica-the-layover-was-the-vacation", "title": "The Layover Was the Vacation", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accbf33ef7f287503353758_6accbe8e66345a014d7dd03c_costa-rica-hero-waterfall-turquoise-pool.jpeg", "alt": "A tall waterfall pouring into a turquoise pool, framed by moss and dense green forest", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Costa Rica", "stampPlace": "COSTA RICA", "stampDate": "16 JUL 2023", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "oregon-pacific-northwest-epic-trip", "title": "Celebrating an Epic Trip in the Pac NW!", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accbebb72e26ecd2eab5e22_6accbdcf189c2b52651f1bf0_oregon-hero-mt-bailey-rock-window.jpeg", "alt": "Through a natural rock window near the top of Mt. Bailey, a lake far below and snow-dusted ridges beyond", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Portland", "stampPlace": "PORTLAND", "stampDate": "27 JUN 2023", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "amsterdam-stroopwafel-time", "title": "Stroopwafel Time", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accbb7a5f59788946a582f6_6accbabae33bb05d0e792378_amsterdam-hero-damrak-dancing-houses.jpeg", "alt": "A row of tall, narrow canal houses on the Damrak in black, brick, maroon and dark green, leaning slightly against each other above the water", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Amsterdam", "stampPlace": "AMSTERDAM", "stampDate": "09 AUG 2023", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "vietnam-year-of-the-dragon", "title": "The Year of the Dragon", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accb17cf0f89e81f06bfdbe_6accb0aeeb9526b52b0ec7b4_tll-vn-hero-hoi-an-lanterns.jpeg", "alt": "Silk lanterns painted with flowers, butterflies and birds, glowing in rows at night in Hoi An.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Vietnam", "stampPlace": "VIETNAM", "stampDate": "28 FEB 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "doha-layover-dunes-camels-falcons", "title": "Patience, Iago, Patience!", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accb04b158b115c416602dc_6accafdf70262b369b3309a1_doha-hero-inland-sea-lagoon.jpeg", "alt": "Clear turquoise water lapping a curved shore of pale sand, low dunes running to the horizon under a blue sky in Qatar's desert", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Qatar", "stampPlace": "QATAR", "stampDate": "01 MAR 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "texas-hill-country-boot-scootin-eclipse", "title": "A Boot Scootin' Eclipse", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accaa3eeb9526b52b0ccefd_6acca962fa704fbd871549a8_texas-eclipse-hero-totality-corona-through-cloud.jpeg", "alt": "Totality over the Texas Hill Country: the Moon fully covering the Sun, the white ring of the corona glowing through thin cloud", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Texas Hill Country", "stampPlace": "TEXAS HILL COUNT", "stampDate": "10 APR 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "el-salvador-ice-cream-over-a-lake-of-acid", "title": "Ice Cream Over a Lake of Acid", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acca8dd37b47d99f14394b0_6acca87e2f878b6022e8941c_el-salvador-hero-santa-ana-crater-lake.jpeg", "alt": "Santa Ana's crater seen from the rim: layered gray walls stepping down to a steaming, bright green acid lake", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Santa Ana", "stampPlace": "SANTA ANA", "stampDate": "13 APR 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "aruba-curacao-dushi-detour", "title": "A Delightful \"Dushi\" Detour to Aruba and Curaçao", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acc9dd0901463fb94a5312d_6acc9d23a0ca3be2b7318b01_aruba-curacao-hero-conchi-natural-pool-arikok.jpeg", "alt": "Conchi, Aruba's natural pool, a bowl of calm turquoise water ringed by dark volcanic rock in Arikok National Park, with swimmers on the rocks and surf breaking beyond", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Aruba And Curaçao", "stampPlace": "ARUBA AND CURAÇA", "stampDate": "04 AUG 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "morocco-toubkal-peaks-mules-uno-vengeance", "title": "Moroccan Adventure: Peaks, Sugared Up Mules, & UNO Vengeance", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acc99ae84d1be665478a717_6acc99056a6fe50b5eda0551_tll-morocco-hero-aroumd-village.jpeg", "alt": "The village of Aroumd stacked on a hillside below the High Atlas, its ochre houses above green terraces, with a man riding a mule along the trail in the foreground", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Morocco", "stampPlace": "MOROCCO", "stampDate": "02 AUG 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "eswatini-lesotho-how-many-goats-small-car", "title": "How Many Goats Can Fit in a Small Car?", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acc91782709d096fa1eb1e9_6acc9052a9570a006e230493_tll-sa-hero-jacaranda-sunset.jpeg", "alt": "Sunset over the hills of Eswatini, an orange sky above blue ridgelines and dense green forest, with a purple jacaranda in bloom in the foreground", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Eswatini And Lesotho", "stampPlace": "ESWATINI AND LES", "stampDate": "27 OCT 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "northern-brazil-sequins-to-sloths", "title": "From Sequins to Sloths: Northern Brazil for the Chronically Curious", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6abccf813c37a815d4c03dde_6abcce087012c0cb94fe18b3_brazil-hero-riverboats-at-sunset-rio-negro.jpeg", "alt": "Two wooden riverboats on the still Rio Negro at sunset, sky and water washed gold and pink", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Salvador", "stampPlace": "SALVADOR", "stampDate": "30 SEP 2026", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "mexico-holy-mole-teotihuacan-cenotes-pink-lagoons", "title": "Holy Mole", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accbeceb55fa97ba3b92de4_6accbe52f0ddedac9e55b651_mexico-hero-teotihuacan-pyramid-of-the-moon.jpeg", "alt": "The Pyramid of the Moon at Teotihuacán under heavy clouds, with visitors crossing the plaza below", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Mexico", "stampPlace": "MEXICO", "stampDate": "12 OCT 2026", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}];
/* one cover per week (weeks start Monday, UTC), the same for every reader that week; the fixed cover above if the list is empty */
(function(){if(!COVERS.length)return;var d=new Date(),w=Math.floor((Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-Date.UTC(2026,0,5))/604800000),i=((w%COVERS.length)+COVERS.length)%COVERS.length;try{var q=/[?&]cover=(\d+)/.exec(location.search);if(q)i=Math.min(+q[1],COVERS.length-1);}catch(e){}COVER=COVERS[i];})();
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
