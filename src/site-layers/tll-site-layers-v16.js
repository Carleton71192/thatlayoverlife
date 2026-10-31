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
   script src/site-layers/tll-stamps-v1.js (31 Oct Value Playbook Phase 2: pursuit stamps and badges, hub noindex until 6 stories from 3 writers)
   script src/site-layers/tll-album-v1.js (31 Oct Value Playbook Phase 3: continent album and Slide Show on profiles, staged behind ?preview=album)
   script src/site-layers/tll-album-settings-v1.js (31 Oct Nancy: per-continent map counts (numbers only) and how each member counts continents (7, 6 or 5))
   script src/site-layers/tll-export-v1.js (31 Oct Value Playbook Phase 4: Download everything on /account, zip built in the browser)
   script src/site-layers/tll-pros-v1.js (31 Oct Value Playbook Phase 6: From the Pros label, author box with one link, pro badge, hub row)
   script src/site-layers/tll-division-v1.js (31 Oct Value Playbook Phase 7: tll or paw-passport on GA4 and revenue links, entity from one setting)
   script src/site-layers/tll-paw-v1.js (31 Oct Value Playbook Phase 8: Paw Passport waitlist and QR landing, staged behind ?preview=paw until the trademark is clear)
   script src/site-layers/tll-metrics-v1.js (31 Oct Value Playbook Phase 9: owner-only investor metrics on /account with snapshot download)
   script src/site-layers/tll-series-v1.js (31 Oct Nancy: every story series (labels, chips, story boxes, Trip Kit, pet note))
   script src/site-layers/tll-expat-v1.js (31 Oct Nancy: expat build (Lived in, My moves, Living Library, For Expats; staged))
   script src/site-layers/tll-pet-passport-v1.js (31 Oct Nancy: pet build (Paw Passport page, editor, landing; staged))
   script src/site-layers/tll-work-trips-v1.js (31 Oct Nancy: That Work Trip Life (map, series labels, Trip Kit; hub staged))
   script src/site-layers/tll-ux-v1.js (31 Oct Nancy: user flows (story end block, first-stamp welcome, On this day, events; staged))
   script src/site-layers/tll-phase0-v1.js (31 Oct Nancy: Phase 0 fixes (contact relay, support headline, search, map buttons, shelf count, Thailand stub))
   script src/site-layers/tll-ads-v1.js (31 Oct Nancy: AdSense, tastefully (story pages, library, countries only))
   story  src/design/magazine-2026-10/story-build/tll-mag-story-v1.html (the magazine story page: Newsreader, the byline in the head, the stamp on the photo; /stories/{slug} only)
   first  src/site-layers/tll-consent-mode-v2.js (Consent Mode v2 defaults and CookieConsent updates; AdSense readiness, 28 Oct 2026)
   cover  src/design/magazine-2026-10/cover-build/tll-mag-cover-v1.html (the magazine cover: the cover story photo full bleed, the chip, the stamp; home page only)
   No data-ms-* element is touched. */
/* TLL Consent Mode (v2 28 Oct; Phase 0, 31 Oct 2026). The site head now carries the one consent tool (tll-consent-v3: Google's certified
   message, Consent Mode v2 defaults, GA4 and ads only after consent). This file only sets the same denied defaults when that head code is
   missing, for example on a page served before the head change was published. */
window.dataLayer=window.dataLayer||[];if(typeof window.gtag!=='function'){window.gtag=function(){dataLayer.push(arguments);};}
if(!window.__tllConsent){gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});}
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
'.tll-crew-inv{margin:10px 0 14px}.tll-crew-inv .tll-crew-row{display:flex;flex-wrap:wrap;gap:8px}a.tll-crew-b{display:inline-flex;align-items:center;text-decoration:none}'+
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
    var me=d.me||{};var inv=el('div','tll-crew-inv');inv.appendChild(el('p','tll-crew-k','Not on TLL yet? Invite them'));
    var link=function(ch){return 'https://www.thatlayover.life/signup?ref='+encodeURIComponent(me.slug||'')+'&utm_source=invite&utm_medium='+ch+'&utm_campaign=tll';};
    var text=function(ch){return 'I keep my trips on That Layover Life. Join me there and we can link up as travel companions. Free, no card: '+link(ch);};
    var row=el('div','tll-crew-row');
    function go(ch,href){var a=el('a','tll-crew-b',ch==='sms'?'Text':ch==='whatsapp'?'WhatsApp':'Email');a.href=href;if(ch==='whatsapp'){a.target='_blank';a.rel='noopener';}
      a.addEventListener('click',function(){try{window.gtag&&gtag('event','crew_invite',{division:'tll',channel:ch});}catch(x){}});row.appendChild(a);}
    go('email','mailto:?subject='+encodeURIComponent('Join me on That Layover Life')+'&body='+encodeURIComponent(text('email')));
    go('sms','sms:?&body='+encodeURIComponent(text('sms')));
    go('whatsapp','https://wa.me/?text='+encodeURIComponent(text('whatsapp')));
    row.appendChild(btn(navigator.share?'Share (Instagram and more)':'Copy invite link',false,function(){
      try{window.gtag&&gtag('event','crew_invite',{division:'tll',channel:'share'});}catch(x){}
      if(navigator.share){navigator.share({title:'That Layover Life',text:text('share').replace(/: https.*$/,'.'),url:link('share')}).catch(function(){});}
      else if(navigator.clipboard){navigator.clipboard.writeText(text('copy')).then(function(){msg.textContent='Invite copied. Paste it into Instagram or anywhere.';});}}));
    inv.appendChild(row);inv.appendChild(el('p','tll-crew-msg','When they join from your link, they can send you a companion request in one tap.'));
    msg.insertAdjacentElement('afterend',inv);
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
        if(!list.length){res.appendChild(el('p','tll-crew-msg','No traveler by that name yet. Invite them with the buttons below, or name them in a story byline.'));res.hidden=false;return;}
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

/* ---------- joined from an invite ---------- */
(function(){try{var ref=new URLSearchParams(location.search).get('ref');if(ref&&/^[a-z0-9-]{2,80}$/.test(ref))localStorage.setItem('tll-ref',JSON.stringify({slug:ref,at:Date.now()}));}catch(e){}})();
function invited(){
  var ref=null;try{ref=JSON.parse(localStorage.getItem('tll-ref')||'null');}catch(e){}
  if(!ref||!ref.slug||Date.now()-ref.at>1000*60*60*24*30||document.getElementById('tll-crew-ref'))return;
  function done(){try{localStorage.removeItem('tll-ref');}catch(e){}}
  post('/crew/inbox').then(function(d){
    if(!d||!d.ok)return;if(d.me&&d.me.slug===ref.slug){done();return;}
    if(d.companions.some(function(c){return c.slug===ref.slug;})||d.outgoing.some(function(i){return i.toSlug===ref.slug;})){done();return;}
    return fetch(API+'/crew/people?q='+encodeURIComponent(ref.slug.replace(/-/g,' '))).then(function(r){return r.json();}).then(function(j){
      var p=(j&&j.people||[]).filter(function(x){return x.slug===ref.slug;})[0];if(!p){done();return;}css();
      var card=el('section','tll-crew-card tll-crew');card.id='tll-crew-ref';card.appendChild(el('h3','','You joined from '+p.name+"'s invite"));
      card.appendChild(personRow(p,'Send a travel companion request?'));
      var row=el('div','tll-crew-row');
      row.appendChild(btn('Send request',true,function(){post('/crew/invite',{kind:'person',to:p.id,type:'buddy'}).then(function(r){done();card.textContent='';card.appendChild(el('p','',r&&r.ok?'Sent. You show on each other\'s profile once '+p.name+' says yes.':(r&&r.error)||'That did not go through.'));});}));
      row.appendChild(btn('No thanks',false,function(){done();card.remove();}));card.appendChild(row);
      var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(card,an.nextSibling);else main.insertBefore(card,main.firstChild);
    });
  }).catch(function(){});
}

function run(){
  if(P==='/edit-profile')editProfile();
  else if(P==='/account'){account();invited();}
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
var PUBLIC=true;
var P=location.pathname.replace(/\/+$/,'')||'/';if(P!=='/')return;
var q=new URLSearchParams(location.search).get('preview');
try{if(q==='value')localStorage.setItem('tll-preview-value','1');if(q==='off')localStorage.removeItem('tll-preview-value');}catch(e){}
var on=PUBLIC;try{on=on||localStorage.getItem('tll-preview-value')==='1';}catch(e){}
if(!on&&q!=='value')return;
var PURSUITS=[['foodie','Food'],['marathons','Marathons'],['trekking','Trekking'],['dog-travel','Dog travel']];
var LINES=[['The slide show.','Remember when Grandpa pulled out the slide projector after dinner? This is that.'],
  ['The trip deck.','Remember the 80-slide deck someone made of one weekend in Boston? This is that, except people ask to see it.'],
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
  PURSUITS.forEach(function(p){var a=el('a','',p[1]);/* Phase 0 (31 Oct): the pursuit hubs are not built yet (/pursuits/* answered 404), so these open the library search instead. */
    var Q={foodie:'food',marathons:'marathon',trekking:'trek'};a.href=(p[0]==='dog-travel'?'/the-paw-passport?':'/stories?q='+Q[p[0]]+'&')+'utm_source=home&utm_medium=value&utm_campaign='+(p[0]==='dog-travel'?'paw-passport':'tll');a.addEventListener('click',function(){track('value_pursuit_click',{pursuit:p[0]});});ask.appendChild(a);});
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
'.tll-col-n{position:absolute;top:6px;left:6px;font:600 11px/1 "JetBrains Mono",monospace;font-style:normal;background:rgba(10,11,20,.7);color:#fff;border-radius:999px;padding:4px 7px}.tll-col-it[role=button]{cursor:pointer}'+
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
function tile(i,onDel){var t=el('div','tll-col-it'),ph=(i.photos&&i.photos.length?i.photos:(i.photo?[i.photo]:[])),k=0,sz=function(u){return u.replace('/upload/','/upload/c_fill,w_400,h_400,q_auto,f_auto/');};
  if(ph.length){var im=el('img');im.src=sz(ph[0]);im.alt=(i.categoryName||'')+', '+i.country;im.loading='lazy';t.appendChild(im);
    if(ph.length>1){var n=el('em','tll-col-n','1/'+ph.length);t.appendChild(n);t.tabIndex=0;t.setAttribute('role','button');t.setAttribute('aria-label','Next photo of '+i.country);
      var next=function(e){if(e.target.tagName==='BUTTON')return;k=(k+1)%ph.length;im.src=sz(ph[k]);n.textContent=(k+1)+'/'+ph.length;};t.addEventListener('click',next);t.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();next(e);}});}}
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
    var file=el('input');file.type='file';file.multiple=true;file.accept='image/jpeg,image/png,image/webp,image/heic';field('Photos (optional, up to 6: front, back, on the shelf)',file,true);
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
      var files=[].slice.call(file.files||[]);if(files.length>6){msg.textContent='Up to 6 photos per piece. Pick your best 6.';return;}
      btn.disabled=true;msg.textContent=files.length?'Cleaning and uploading '+(files.length===1?'the photo':files.length+' photos')+'…':'Adding…';
      files.reduce(function(p,f){return p.then(function(urls){return upload(f).then(function(u){urls.push(u);msg.textContent='Uploaded '+urls.length+' of '+files.length+'…';return urls;});});},Promise.resolve([])).then(function(urls){
        return post('/collections/add',{category:cat.value,own:own.value,country:ctry.value,city:city.value,year:year.value,caption:cap.value,photos:urls});
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

/* tll-stamps-v1 (31 Oct 2026, Value Playbook Phase 2: pursuit stamps and badges). Talks to the Worker (/stamps/*, /pursuits/status);
   while those routes are not live nothing shows and nothing changes.
   /edit-profile: "05C · Pursuit stamps" under My collections: log what, where (country, optional city), when (year, optional month)
     and one photo, per pursuit. Each pursuit has its own "Show on my profile" switch, off until the member turns it on.
   /contributors/<slug>: a badge per shown pursuit (stamps and countries, counted, never typed) and the stamps, year only.
   /pursuits/<slug>: noindex until the Worker says the hub meets the 19 Oct rule (6 live stories, 3 writers, a written intro).
   Photos redrawn on a canvas before upload (no GPS). No data-ms-* element touched; no form or field names changed.
   31 Oct, That Work Trip Life (STAGED: WT_PUBLIC false, shows with ?preview=worktrips, remembered; ?preview=off clears):
   a "Work trip" switch and "I have permission to name them" (off by default: the stamp reads "A work trip" in public).
   Pursuits still in draft are hidden from the list unless previewing. A work-trip stamp tells tll-work-trips-v1, which puts
   the country on the member's map if it is not there yet. Months in the future are refused: post after, not during. */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var CLOUD='https://api.cloudinary.com/v1_1/idonvlow/image/upload',PRESET='tll_photos',EDGE=2000;
var P=location.pathname.replace(/\/+$/,'')||'/';
var WT_PUBLIC=false,WTQ=new URLSearchParams(location.search).get('preview');
try{if(WTQ==='worktrips')localStorage.setItem('tll-preview-worktrips','1');if(WTQ==='off')localStorage.removeItem('tll-preview-worktrips');}catch(e){}
var WT=WT_PUBLIC||WTQ==='worktrips';try{WT=WT||localStorage.getItem('tll-preview-worktrips')==='1';}catch(e){}
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var CSS='.tll-st{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-st [hidden]{display:none!important}'+
'.tll-st-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:18px 0 8px}'+
'.tll-st-group{border:1px solid #E0DACE;border-radius:8px;background:#fff;padding:12px;margin:0 0 12px}'+
'.tll-st-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin:0 0 10px}'+
'.tll-st-badge{display:inline-flex;align-items:center;gap:8px;font:600 12px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:1.5px solid #0A0B14;border-radius:999px;padding:8px 12px}'+
'.tll-st-badge i{font-style:normal;color:#C8325B}'+
'.tll-st-head label{display:inline-flex;align-items:center;gap:8px;font-size:14px;min-height:36px;cursor:pointer}.tll-st-head input{width:18px;height:18px;accent-color:#C8325B}'+
'.tll-st-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}'+
'.tll-st-it{display:flex;gap:10px;align-items:center;border:1px dashed #C8B9A6;border-radius:6px;padding:8px;background:#FDF9F3;position:relative}'+
'.tll-st-it img{width:52px;height:52px;object-fit:cover;border-radius:4px;flex:none}.tll-st-it b{display:block;font-weight:600}.tll-st-it small{color:#5F5A54;font-size:13px}'+
'.tll-st-it button{position:absolute;top:4px;right:4px;width:28px;height:28px;border:0;border-radius:50%;background:#0A0B14;color:#fff;cursor:pointer}'+
'.tll-st-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border:1px dashed #E0DACE;border-radius:8px;padding:12px;margin-top:8px}'+
'.tll-st-form label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#5F5A54}.tll-st-form .w{grid-column:1/-1}'+
'.tll-st-form input,.tll-st-form select{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;min-height:44px}'+
'.tll-st-b{border:0;background:#C8325B;color:#fff;border-radius:4px;padding:10px 16px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;min-height:44px;cursor:pointer}'+
'.tll-st-form label.c{flex-direction:row;align-items:flex-start;gap:8px;color:#0A0B14;font-size:14px}.tll-st-form label.c input{width:18px;height:18px;min-height:0;accent-color:#C8325B;margin-top:2px;flex:none}'+
'.tll-st-wt{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;background:#0A0B14;color:#FDF9F3;padding:3px 6px;border-radius:2px;margin-left:6px;vertical-align:middle}'+
'.tll-st-msg{font-size:13px;color:#5F5A54;margin:6px 0}.tll-st-pub{max-width:1120px;margin:32px auto;padding:0 16px}'+
'@media (max-width:560px){.tll-st-form{grid-template-columns:1fr}}';
function css(){if(document.getElementById('tll-stamps-v1'))return;var s=document.createElement('style');s.id='tll-stamps-v1';s.textContent=CSS;document.head.appendChild(s);}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function countries(){var out=[];try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var a=65;a<91;a++)for(var b=65;b<91;b++){var c=String.fromCharCode(a,b),n=dn.of(c);if(n&&n!==c&&!/^(EU|EZ|UN|QO|XA|XB|ZZ|FX|YU|SU|ZR|TP|UK)$/.test(c))out.push(n);}}catch(e){}return out.filter(function(v,i,s){return s.indexOf(v)===i;}).sort();}
function upload(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,EDGE/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*s);c.height=Math.round(h*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej('read');},'image/jpeg',0.88);};im.onerror=function(){rej('read');};im.src=u;})
  .then(function(blob){var fd=new FormData();fd.append('file',blob,'stamp.jpg');fd.append('upload_preset',PRESET);fd.append('folder','tll/stamps');return fetch(CLOUD,{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){if(!j.secure_url)throw 'upload';return j.secure_url;});});}
function item(s,onDel){var t=el('div','tll-st-it');if(s.photo){var im=el('img');im.src=s.photo.replace('/upload/','/upload/c_fill,w_120,h_120,q_auto,f_auto/');im.alt=s.what;im.loading='lazy';t.appendChild(im);}
  var d=el('div'),bt=el('b','',s.what);if(s.workTrip)bt.appendChild(el('span','tll-st-wt','Work trip'));d.appendChild(bt);d.appendChild(el('small','',[s.city,s.country,s.year].filter(Boolean).join(' · ')));t.appendChild(d);
  if(onDel){var x=el('button','','×');x.type='button';x.setAttribute('aria-label','Remove '+s.what);x.addEventListener('click',onDel);t.appendChild(x);}return t;}
function badge(name,count,countries){var b=el('span','tll-st-badge');b.appendChild(document.createTextNode(name+' '));var i=el('i','',count+(count===1?' stamp':' stamps')+' · '+countries+(countries===1?' country':' countries'));b.appendChild(i);return b;}

function editProfile(){
  var anchor=document.getElementById('tll-col')||document.getElementById('ep-crew');if(!anchor||document.getElementById('tll-st'))return;
  post('/stamps/mine').then(function(d){
    if(!d||!d.ok||document.getElementById('tll-st'))return;css();
    var sec=el('section','ep-sec tll-st');sec.id='tll-st';var h=el('h2','ep-eb','05C · Pursuit stamps');sec.appendChild(h);
    sec.appendChild(el('p','ep-lede','A stamp is one thing you did: the race, the trail, the library, the dish. Where, the year and one photo. Private until you switch a pursuit on; profiles show the year only.'));
    var list=el('div');sec.appendChild(list);
    var f=el('div','tll-st-form');f.setAttribute('role','group');f.setAttribute('aria-label','Add a stamp');
    function field(l,n,w){var x=el('label',w?'w':'',l);x.appendChild(n);f.appendChild(x);return n;}
    var ps=d.pursuits.filter(function(p){return WT||!p.draft;}).sort(function(a,b){return (b.picked?1:0)-(a.picked?1:0);});
    var pur=el('select');ps.forEach(function(p){var o=el('option','',p.name);o.value=p.slug;pur.appendChild(o);});field('Pursuit',pur);
    var what=el('input');what.maxLength=80;what.placeholder='Tokyo Marathon, the W Trek, Trinity College Library';field('What',what);
    var ctry=el('input');ctry.setAttribute('list','tll-st-countries');ctry.autocomplete='off';field('Country',ctry);
    var dl=el('datalist');dl.id='tll-st-countries';countries().forEach(function(n){var o=el('option');o.value=n;dl.appendChild(o);});f.appendChild(dl);
    var city=el('input');city.maxLength=60;field('City (optional)',city);
    var mon=el('select');mon.appendChild(el('option','','Month (optional)'));MONTHS.forEach(function(m,i){var o=el('option','',m);o.value=String(i+1);mon.appendChild(o);});field('Month',mon);
    var yr=el('input');yr.type='number';yr.inputMode='numeric';yr.min='1900';yr.max=String(new Date().getFullYear());field('Year',yr);
    var file=el('input');file.type='file';file.accept='image/jpeg,image/png,image/webp,image/heic';field('One photo (optional)',file,true);
    var wt=el('input'),named=el('input'),wtBox=el('div','w');wt.type='checkbox';named.type='checkbox';
    if(WT){var wl=el('label','c');wl.appendChild(wt);wl.appendChild(document.createTextNode('Work trip. Back home? Good. Now tell us.'));wtBox.appendChild(wl);
      var nl=el('label','c');nl.hidden=true;nl.appendChild(named);nl.appendChild(document.createTextNode('I have permission to name them (the company, client or colleague in "What"). Leave this off and your profile says "A work trip".'));wtBox.appendChild(nl);
      f.appendChild(wtBox);var sync=function(){if(pur.value==='work-trips')wt.checked=true;wt.disabled=pur.value==='work-trips';nl.hidden=!wt.checked;if(!wt.checked)named.checked=false;};
      wt.addEventListener('change',sync);pur.addEventListener('change',sync);sync();}
    var btn=el('button','tll-st-b','Add the stamp');btn.type='button';f.appendChild(btn);var msg=el('p','tll-st-msg');msg.setAttribute('aria-live','polite');f.appendChild(msg);sec.appendChild(f);
    function render(stamps){list.textContent='';if(!stamps.length){list.appendChild(el('p','tll-st-msg','No stamps yet. Add your first below.'));return;}
      var g={},order=[];stamps.forEach(function(s){if(!g[s.pursuit]){g[s.pursuit]={name:s.pursuitName,items:[]};order.push(s.pursuit);}g[s.pursuit].items.push(s);});
      order.forEach(function(k){var box=el('div','tll-st-group'),hd=el('div','tll-st-head'),it=g[k].items;
        hd.appendChild(badge(g[k].name,it.length,new Set(it.map(function(s){return s.country;})).size));
        var lab=el('label'),sw=el('input');sw.type='checkbox';sw.checked=it.some(function(s){return s.shown;});lab.appendChild(sw);lab.appendChild(document.createTextNode('Show on my profile'));
        sw.addEventListener('change',function(){sw.disabled=true;post('/stamps/show',{pursuit:k,show:sw.checked}).then(function(){sw.disabled=false;refresh();});});
        hd.appendChild(lab);box.appendChild(hd);var grid=el('div','tll-st-list');
        it.forEach(function(s){var card=item(s,function(){if(!confirm('Remove '+s.what+'?'))return;post('/stamps/delete',{id:s.id}).then(refresh);});
          /* A single work-trip stamp can stay private while the rest of the pursuit shows (Nancy, 31 Oct). */
          if(WT&&s.workTrip){var pl=el('label');pl.style.cssText='display:flex;gap:6px;align-items:center;font-size:12px;color:#5F5A54;margin-top:4px';var pc=el('input');pc.type='checkbox';pc.checked=!!s.private;pc.style.cssText='width:16px;height:16px;accent-color:#C8325B';
            pl.appendChild(pc);pl.appendChild(document.createTextNode('Keep this one private'));pc.addEventListener('change',function(){pc.disabled=true;post('/stamps/private',{id:s.id,private:pc.checked}).then(function(){refresh();});});var d=card.querySelector('div');(d||card).appendChild(pl);}
          grid.appendChild(card);});box.appendChild(grid);list.appendChild(box);});}
    function refresh(){post('/stamps/mine').then(function(r){if(r&&r.ok)render(r.stamps);});}
    function add(){if(!what.value.trim()&&!wt.checked){msg.textContent='Say what it was.';what.focus();return;}if(!ctry.value.trim()){msg.textContent='Pick a country.';ctry.focus();return;}if(!yr.value){msg.textContent='Add the year.';yr.focus();return;}
      btn.disabled=true;msg.textContent=file.files[0]?'Cleaning and uploading the photo…':'Adding…';
      (file.files[0]?upload(file.files[0]):Promise.resolve('')).then(function(url){return post('/stamps/add',{pursuit:pur.value,what:what.value,country:ctry.value,city:city.value,month:mon.value,year:yr.value,photo:url,workTrip:wt.checked,namedOk:named.checked});})
      .then(function(r){btn.disabled=false;if(r&&r.ok){try{window.dispatchEvent(new CustomEvent('tll:stamp-added',{detail:{country:ctry.value,workTrip:!!r.stamp.workTrip}}));}catch(e){}msg.textContent='Stamped. '+(r.stamp.shown?'It shows on your profile.':'Private until you switch this pursuit on.');what.value='';ctry.value='';named.checked=false;city.value='';mon.value='';yr.value='';file.value='';refresh();}else msg.textContent=(r&&r.error)||'That did not go through. Try again.';})
      .catch(function(){btn.disabled=false;msg.textContent='The photo could not be uploaded. Try another, or add the stamp without a photo.';});}
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();add();});
    f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();e.stopPropagation();add();}},true);
    anchor.insertAdjacentElement('afterend',sec);render(d.stamps);
  });
}
function profile(slug){
  if(document.getElementById('tll-st-pub'))return;
  fetch(API+'/stamps/public?slug='+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||!d.shelves.length||document.getElementById('tll-st-pub'))return;css();
    var s=el('section','tll-st tll-st-pub');s.id='tll-st-pub';s.appendChild(el('p','tll-st-k','Pursuits'));
    d.shelves.forEach(function(g){var box=el('div','tll-st-group'),hd=el('div','tll-st-head'),a=el(g.live===false?'span':'a');if(g.live!==false)a.href='/pursuits/'+g.pursuit;a.style.textDecoration='none';a.style.color='inherit';a.appendChild(badge(g.name,g.count,g.countries));hd.appendChild(a);box.appendChild(hd);
      var grid=el('div','tll-st-list');g.stamps.forEach(function(x){grid.appendChild(item(x));});box.appendChild(grid);s.appendChild(box);});
    var after=document.getElementById('tll-col-pub')||document.getElementById('tll-crew-pub'),main=document.querySelector('main')||document.body;
    if(after)after.insertAdjacentElement('afterend',s);else{var h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(s,an.nextSibling);else main.appendChild(s);}
  }).catch(function(){});
}
function hub(slug){
  var m=document.querySelector('meta[name="robots"]');if(!m){m=document.createElement('meta');m.name='robots';document.head.appendChild(m);}
  m.content='noindex, follow';m.setAttribute('data-tll-hub','pending');
  fetch(API+'/pursuits/status?slug='+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){if(d&&d.ok&&d.indexable){m.content='index, follow';m.setAttribute('data-tll-hub','indexable');}}).catch(function(){});
}
var m=/^\/pursuits\/([^/]+)$/.exec(P);if(m)hub(m[1]);
function run(){if(P==='/edit-profile')editProfile();else{var c=/^\/contributors\/([^/]+)$/.exec(P);if(c)profile(c[1]);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1600);});else setTimeout(run,1600);
setTimeout(run,4000);
})();

/* tll-album-v1 (31 Oct 2026, Value Playbook Phase 3: the continent album and Slide Show mode). /contributors/<slug> only.
   Seven slide mounts, one per continent: the cover photo, a washi-tape label in mono ("Europe · 23 photos · 4 countries").
   Empty continents read "Not yet" in grey; Antarctica shows a penguin until earned. A mount with photos opens Slide Show:
   full screen, one photo per slide, caption in mono, the story title as the line, the projector click as the only sound (off by
   default). Keys: arrows or space, Esc to close; swipe on phones. The show is a link (?play=europe) and works on a TV browser.
   Photos come from GET /album: the member's live stories plus the collections and stamps they chose to show. Nothing private.
   No data-ms-* element touched. */
(function(){
/* Pet passports (/pets/<slug>) borrow the projector for their slide show; the album itself shows on profiles only. */
var m=/^\/contributors\/([^/]+)\/?$/.exec(location.pathname),PROJECTOR_ONLY=!m&&/^\/pets\/[^/]+\/?$/.test(location.pathname);if(!m&&!PROJECTOR_ONLY)return;var SLUG=m?m[1]:'';
/* STAGED until Nancy approves: shows with ?preview=album (remembered in this browser; ?preview=off clears) or a shared ?play= link. Flip PUBLIC to true to launch. */
var PUBLIC=true,q=new URLSearchParams(location.search);try{if(q.get('preview')==='album')localStorage.setItem('tll-preview-album','1');if(q.get('preview')==='off')localStorage.removeItem('tll-preview-album');}catch(e){}
var on=PUBLIC||q.get('preview')==='album';try{on=on||localStorage.getItem('tll-preview-album')==='1';}catch(e){}if(!on)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/album?slug=';
var PENGUIN='<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true"><ellipse cx="32" cy="38" rx="16" ry="20" fill="#0A0B14"/><ellipse cx="32" cy="41" rx="10" ry="15" fill="#FDF9F3"/><circle cx="32" cy="18" r="11" fill="#0A0B14"/><circle cx="28" cy="16" r="2" fill="#FDF9F3"/><circle cx="36" cy="16" r="2" fill="#FDF9F3"/><path d="M29 21l3 3 3-3z" fill="#E9A23B"/><path d="M24 58l5-3M40 58l-5-3" stroke="#E9A23B" stroke-width="3" stroke-linecap="round"/></svg>';
var CSS='.tll-alb{max-width:1120px;margin:40px auto;padding:0 16px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-alb-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}'+
'.tll-alb h2{font:800 clamp(26px,3.6vw,38px)/1.1 "Playfair Display",Georgia,serif;margin:0 0 18px}'+
'.tll-alb-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 18px}@media (min-width:640px){.tll-alb-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media (min-width:1000px){.tll-alb-grid{grid-template-columns:repeat(7,minmax(0,1fr))}}'+
'.tll-alb-mount{position:relative;display:block;width:100%;aspect-ratio:1;background:#F4EEE3;border:10px solid #FBF8F2;box-shadow:0 1px 0 #E0DACE,0 6px 14px rgba(10,11,20,.10);border-radius:3px;padding:0;cursor:pointer;overflow:visible;font:inherit;color:inherit;text-align:left}'+
'.tll-alb-mount img{width:100%;height:100%;object-fit:cover;display:block}'+
'.tll-alb-mount:focus-visible{outline:3px solid #C8325B;outline-offset:3px}'+
'.tll-alb-tape{position:absolute;left:50%;bottom:-14px;transform:translateX(-50%) rotate(-2deg);background:rgba(232,201,120,.85);padding:5px 8px;font:600 10px/1.3 "JetBrains Mono",monospace;letter-spacing:.8px;text-transform:uppercase;white-space:normal;text-align:center;width:max-content;max-width:calc(100% + 8px);color:#0A0B14;box-shadow:0 1px 2px rgba(0,0,0,.12)}'+
'.tll-alb-tape b,.tll-alb-tape small{display:block;white-space:nowrap}.tll-alb-tape small{font-size:9px;font-weight:500;letter-spacing:.5px;text-transform:none;margin-top:2px}'+
'.tll-alb-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;height:100%;color:#9A948B;font:600 12px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;cursor:default}'+
'.tll-alb-play{position:absolute;top:8px;right:8px;background:rgba(10,11,20,.72);color:#fff;border-radius:999px;padding:5px 10px;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px}'+
'.tll-ss{position:fixed;inset:0;z-index:99999;background:#0A0B14;color:#F3EEE6;display:flex;flex-direction:column}'+
'.tll-ss-stage{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;padding:16px}.tll-ss-stage img{max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 0 0 12px #F3EEE6}'+
'.tll-ss-cap{padding:12px 20px 18px;display:flex;flex-wrap:wrap;gap:6px 18px;align-items:baseline;justify-content:space-between}'+
'.tll-ss-cap p{margin:0}.tll-ss-m{font:600 12px/1.4 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#00C9C8}.tll-ss-line{font:800 20px/1.25 "Playfair Display",Georgia,serif}.tll-ss-sub{color:#B9B2A8}'+
'.tll-ss-bar{display:flex;gap:8px;align-items:center}.tll-ss-bar button,.tll-ss-bar a{background:transparent;border:1.5px solid #F3EEE6;color:#F3EEE6;border-radius:4px;min-height:40px;padding:0 12px;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}'+
'.tll-ss-nav{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:96px;border:0;background:transparent;color:#F3EEE6;font-size:40px;cursor:pointer}.tll-ss-prev{left:0}.tll-ss-next{right:0}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-album-v1'))return;var s=el('style');s.id='tll-album-v1';s.textContent=CSS;document.head.appendChild(s);}
function sized(u,w){return /res\.cloudinary\.com/.test(u)?u.replace('/upload/','/upload/c_limit,w_'+w+',q_auto,f_auto/'):u;}
var audio=null,sound=false;
function click(){if(!sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();var n=audio.sampleRate*0.06,b=audio.createBuffer(1,n,audio.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,6)*0.6;var s=audio.createBufferSource();s.buffer=b;s.connect(audio.destination);s.start();}catch(e){}}
window.__tllAlbumShow=function(c,name){return show(c,name);};
function show(c,name){
  var i=0,ss=el('div','tll-ss');ss.setAttribute('role','dialog');ss.setAttribute('aria-modal','true');ss.setAttribute('aria-label',name+', '+c.name+' slide show');
  var stage=el('div','tll-ss-stage'),img=el('img');stage.appendChild(img);ss.appendChild(stage);
  var prev=el('button','tll-ss-nav tll-ss-prev','‹'),next=el('button','tll-ss-nav tll-ss-next','›');prev.setAttribute('aria-label','Previous');next.setAttribute('aria-label','Next');ss.appendChild(prev);ss.appendChild(next);
  var cap=el('div','tll-ss-cap'),txt=el('div'),mono=el('p','tll-ss-m'),line=el('p','tll-ss-line'),sub=el('p','tll-ss-sub');txt.appendChild(mono);txt.appendChild(line);txt.appendChild(sub);cap.appendChild(txt);
  var bar=el('div','tll-ss-bar'),read=el('a','','Read the story'),snd=el('button','','Sound off'),share=el('button','','Share'),close=el('button','','Close');
  bar.appendChild(read);bar.appendChild(snd);bar.appendChild(share);bar.appendChild(close);cap.appendChild(bar);ss.appendChild(cap);
  function draw(){var p=c.photos[i];img.src=sized(p.img,1800);img.alt=p.alt||p.line||c.name;mono.textContent=c.name+' · '+(i+1)+' / '+c.photos.length;line.textContent=p.line||'';sub.textContent=p.sub||'';read.hidden=!p.href;if(p.href)read.href=p.href;
    var n=c.photos[(i+1)%c.photos.length];if(n){var pre=new Image();pre.src=sized(n.img,1800);}}
  function go(d){i=(i+d+c.photos.length)%c.photos.length;click();draw();}
  function end(){document.removeEventListener('keydown',key,true);ss.remove();document.documentElement.style.overflow='';try{var u=new URL(location.href);u.searchParams.delete('play');history.replaceState(null,'',u);}catch(e){}}
  function key(e){if(e.key==='Escape'){e.preventDefault();end();}else if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();go(1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}}
  prev.onclick=function(){go(-1);};next.onclick=function(){go(1);};stage.onclick=function(){go(1);};close.onclick=end;
  snd.onclick=function(){sound=!sound;snd.textContent=sound?'Sound on':'Sound off';if(sound)click();};
  share.onclick=function(){var u=location.origin+location.pathname+'?play='+c.key;try{window.gtag&&gtag('event','slideshow_share',{division:'tll',continent:c.key});}catch(e){}
    if(navigator.share)navigator.share({title:name+' · '+c.name,url:u}).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(u).then(function(){share.textContent='Link copied';});};
  var x0=null;ss.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});ss.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(dx<0?1:-1);x0=null;});
  document.addEventListener('keydown',key,true);document.documentElement.style.overflow='hidden';document.body.appendChild(ss);draw();close.focus();
  try{var u=new URL(location.href);u.searchParams.set('play',c.key);history.replaceState(null,'',u);window.gtag&&gtag('event','slideshow_open',{division:'tll',continent:c.key});}catch(e){}
}
function group(d){var model=d.model||'seven',mc=d.mapCounts||null,by={};d.continents.forEach(function(c){by[c.key]=c;});
  var hc=window.__tllExpatOn&&d.homes&&d.homes.perContinent||null;function merge(key,name,keys){var ps=[],n=0,m=0,h=0,cv=null;keys.forEach(function(k){var c=by[k];if(hc)h+=hc[k]||0;if(!c)return;ps=ps.concat(c.photos);n+=c.countries;if(mc)m+=mc[k]||0;cv=cv||c.cover;});return{key:key,name:name,photos:ps,countries:n,map:mc?m:null,homes:h,cover:cv};}
  var one=function(k){return merge(k,by[k]?by[k].name:k,[k]);};
  var L={seven:[one('africa'),one('antarctica'),one('asia'),one('europe'),one('north-america'),one('oceania'),one('south-america')],
    americas:[one('africa'),merge('america','America',['north-america','south-america']),one('antarctica'),one('asia'),one('europe'),one('oceania')],
    eurasia:[one('africa'),one('antarctica'),merge('eurasia','Eurasia',['europe','asia']),one('north-america'),one('oceania'),one('south-america')],
    olympic:[one('africa'),merge('america','America',['north-america','south-america']),one('asia'),one('europe'),one('oceania')]};
  return L[model]||L.seven;}
var HEAD={seven:'Seven continents, one slide each.',americas:'Six continents, one slide each.',eurasia:'Six continents, one slide each.',olympic:'Five continents, one slide each.'};
function run(){
  if(document.getElementById('tll-alb'))return;
  fetch(API+encodeURIComponent(SLUG)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||!d.continents||!d.continents.length||document.getElementById('tll-alb'))return;
    if(!d.continents.some(function(c){return c.photos.length;}))return;css();var all=d.continents;d.continents=group(d);
    var sec=el('section','tll-alb');sec.id='tll-alb';sec.appendChild(el('p','tll-alb-k','The album'));sec.appendChild(el('h2','',HEAD[d.model]||HEAD.seven));
    var grid=el('div','tll-alb-grid');
    d.continents.forEach(function(c){var b;
      if(c.photos.length){b=el('button','tll-alb-mount');b.type='button';b.setAttribute('aria-label','Play '+c.name+', '+c.photos.length+' photos');
        var im=el('img');im.src=sized(c.cover.img,600);im.alt='';im.loading='lazy';b.appendChild(im);b.appendChild(el('span','tll-alb-play','▶ Play'));
        var tp=el('span','tll-alb-tape');tp.appendChild(el('b','',c.name));var nC=c.map!=null&&c.map>0?c.map:c.countries;tp.appendChild(el('small','',c.photos.length+(c.photos.length===1?' photo':' photos')+' · '+nC+(nC===1?' country':' countries')+(c.homes?' · '+c.homes+(c.homes===1?' home':' homes'):'')));b.appendChild(tp);
        b.onclick=function(){show(c,d.name);};}
      else{b=el('div','tll-alb-mount');var e=el('div','tll-alb-empty');if(c.key==='antarctica')e.innerHTML=PENGUIN;e.appendChild(el('span','',c.map?'No photos yet':'Not yet'));b.appendChild(e);var te=el('span','tll-alb-tape');te.appendChild(el('b','',c.name));if(c.map)te.appendChild(el('small','',c.map+(c.map===1?' country':' countries')+(c.homes?' · '+c.homes+(c.homes===1?' home':' homes'):'')));b.appendChild(te);}
      grid.appendChild(b);});
    sec.appendChild(grid);
    var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);
    if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.appendChild(sec);
    var want=new URLSearchParams(location.search).get('play');if(want){var c=d.continents.filter(function(x){return x.key===want&&x.photos.length;})[0];if(c)show(c,d.name);}
  }).catch(function(){});
}
if(!PROJECTOR_ONLY){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,700);});else setTimeout(run,700);}
})();

/* tll-album-settings-v1 (31 Oct 2026, Nancy: "Yes make the posted change"; "some people see 6 continents and other 7. It's cultural.").
   /the-map: after each map save (the page's own POST /map-snapshot), counts the countries a member has lived in or visited per
   continent from the saved map in this browser and sends only those seven numbers to the Worker (POST /album/settings), so the
   album can say "Africa · 9 countries". Since 31 Oct it also sends how many of those were marked Lived (seven more numbers) for
   "Lived in" and the album's home marks. The country list itself never leaves the map.
   /edit-profile: "05D · Your album" asks how the member counts continents (7, 6 with one America, 6 with Eurasia, or the 5 of the
   Olympic rings). The first time, the choice is suggested from the browser language; nothing is saved until the member picks.
   No data-ms-* element touched. */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var M49={"as": "004 031 048 050 051 064 086 096 104 116 144 156 158 162 166 196 268 275 344 356 360 364 368 376 392 398 400 408 410 414 417 418 422 446 458 462 496 512 524 586 608 626 634 682 702 704 760 762 764 784 792 795 860 887 901", "eu": "008 020 040 056 070 100 112 191 203 208 233 234 246 248 250 276 292 300 336 348 352 372 380 428 438 440 442 470 492 498 499 528 578 616 620 642 643 674 688 703 705 724 744 752 756 804 807 826 831 832 833 900", "an": "010 074 239 260 334", "af": "012 024 072 108 120 132 140 148 174 175 178 180 204 226 231 232 262 266 270 288 324 384 404 426 430 434 450 454 466 478 480 504 508 516 562 566 624 638 646 654 678 686 690 694 706 710 716 728 729 732 748 768 788 800 818 834 854 894 902", "oc": "016 036 090 184 242 258 296 316 520 540 548 554 570 574 580 583 584 585 598 612 772 776 798 876 882", "na": "028 044 052 060 084 092 124 136 188 192 212 214 222 304 308 312 320 332 340 388 474 484 500 531 533 534 535 558 581 591 630 652 659 660 662 663 666 670 780 796 840 850", "sa": "032 068 076 152 170 218 238 254 328 600 604 740 858 862"};
var SHORT={af:'africa',an:'antarctica',as:'asia',eu:'europe',na:'north-america',oc:'oceania',sa:'south-america'};
var BY={};Object.keys(M49).forEach(function(k){M49[k].split(' ').forEach(function(c){BY[c]=SHORT[k];});});
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function counts(){var d;try{d=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){d=null;}if(!d||!d.states)return null;
  var people=(d.travelers||[]).filter(function(t){return t&&!t.pet;}).map(function(t){return t.id;});
  var out={africa:0,antarctica:0,asia:0,europe:0,'north-america':0,oceania:0,'south-america':0},homes={africa:0,antarctica:0,asia:0,europe:0,'north-america':0,oceania:0,'south-america':0};
  Object.keys(d.states).forEach(function(code){var s=d.states[code]||{},k=BY[code];if(!k)return;
    var hit=Object.keys(s).some(function(id){return (!people.length||people.indexOf(id)>-1)&&(s[id]==='lived'||s[id]==='visited');});if(hit&&out[k]<80)out[k]++;
    var home=Object.keys(s).some(function(id){return (!people.length||people.indexOf(id)>-1)&&s[id]==='lived';});if(home&&homes[k]<80)homes[k]++;});
  out.__homes=homes;return out;}
if(P==='/the-map'&&!window.__tllAlbumCounts){window.__tllAlbumCounts=1;var f0=window.fetch;
  window.fetch=function(u,o){var p=f0.apply(this,arguments);try{if(String(u).indexOf('/map-snapshot')>-1&&o&&String(o.method).toUpperCase()==='POST')p.then(function(r){if(r&&r.ok){var c=counts();if(c){var h=c.__homes;delete c.__homes;post('/album/settings',{counts:c,homes:h});}}}).catch(function(){});}catch(e){}return p;};}
var OPTS=[['seven','7 continents','North and South America apart, as taught in the US, UK, China and India'],['americas','6 continents, one America','As taught across Latin America, Spain, Portugal, France, Italy and Greece'],['eurasia','6 continents, with Eurasia','Europe and Asia as one, as taught in Russia and parts of Eastern Europe'],['olympic','5 continents, the Olympic rings','The five inhabited continents, America as one, no Antarctica']];
function suggest(){var l=(navigator.language||'en').toLowerCase().slice(0,2);if(['es','pt','fr','it','el','ro','ca'].indexOf(l)>-1)return'americas';if(['ru','be','kk','uk'].indexOf(l)>-1)return'eurasia';return'seven';}
function editProfile(){
  var anchor=document.getElementById('tll-st')||document.getElementById('tll-col')||document.getElementById('ep-crew');if(!anchor||document.getElementById('tll-alb-set'))return;
  post('/crew/inbox').then(function(me){if(!me||!me.ok||!me.me||document.getElementById('tll-alb-set'))return null;
    return fetch(API+'/album?slug='+encodeURIComponent(me.me.slug)).then(function(r){return r.ok?r.json():{};}).catch(function(){return{};});}).then(function(a){
    if(!a||document.getElementById('tll-alb-set'))return;
    var saved=a.model&&a.mapCounts!==undefined?a.model:null,cur=saved||a.model||'seven',sug=suggest();
    var sec=document.createElement('section');sec.className='ep-sec';sec.id='tll-alb-set';
    sec.innerHTML='<h2 class="ep-eb">05D · Your album</h2><p class="ep-lede">How do you count continents? It depends where you learned it. Your album groups its slides your way.</p>';
    var box=document.createElement('div');box.setAttribute('role','radiogroup');box.setAttribute('aria-label','How you count continents');box.style.cssText='display:grid;gap:8px;margin:8px 0';
    var msg=document.createElement('p');msg.setAttribute('aria-live','polite');msg.style.cssText='font-size:13px;color:#5F5A54;margin:6px 0';
    OPTS.forEach(function(o){var l=document.createElement('label');l.style.cssText='display:flex;gap:10px;align-items:flex-start;border:1px solid #E0DACE;border-radius:6px;padding:10px 12px;background:#fff;cursor:pointer;font:400 15px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif';
      var r=document.createElement('input');r.type='radio';r.name='tll-continents';r.value=o[0];r.checked=o[0]===cur;r.style.cssText='width:18px;height:18px;margin-top:2px;accent-color:#C8325B';
      var t=document.createElement('span');t.innerHTML='<b></b><br><small style="color:#5F5A54"></small>';t.querySelector('b').textContent=o[1]+(o[0]===sug&&o[0]!==cur?' (suggested for your language)':'');t.querySelector('small').textContent=o[2];
      r.addEventListener('change',function(){post('/album/settings',{model:o[0]}).then(function(x){msg.textContent=x&&x.ok?'Saved. Your album now shows '+o[1].toLowerCase()+'.':'That did not save. Try again.';});});
      l.appendChild(r);l.appendChild(t);box.appendChild(l);});
    sec.appendChild(box);sec.appendChild(msg);anchor.insertAdjacentElement('afterend',sec);
  });
}
if(P==='/edit-profile'){var go=function(){editProfile();};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(go,2200);});else setTimeout(go,2200);setTimeout(go,5000);}
})();

/* tll-export-v1 (31 Oct 2026, Value Playbook Phase 4: "Download everything"). /account only, signed-in members.
   One button builds a zip in the browser: README, profile, every story (each as its own readable page, drafts included), collections
   and stamps (JSON and a spreadsheet-friendly CSV), pets, companions, the map (the full saved map from this browser or the member's
   account, plus the summary) and every photo, in folders. The Worker (POST /export) sends only the member's own records; photos are
   fetched straight from where they live. A photo that will not download is listed in photos/not-downloaded.txt, never silently lost.
   JSZip 3.10.1 loads from cdnjs only when the button is pressed. No data-ms-* element touched. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/account')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/export';
var JSZIP='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
var CSS='.tll-exp{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-exp-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}'+
'.tll-exp h3{font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}.tll-exp p{margin:0 0 12px;color:#3a3833}'+
'.tll-exp button{border:0;background:#C8325B;color:#fff;border-radius:4px;min-height:44px;padding:0 18px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-exp button[disabled]{opacity:.6;cursor:wait}'+
'.tll-exp-msg{font-size:13px;color:#5F5A54;margin:8px 0 0}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function lib(){return window.JSZip?Promise.resolve(window.JSZip):new Promise(function(res,rej){var s=document.createElement('script');s.src=JSZIP;s.crossOrigin='anonymous';s.onload=function(){res(window.JSZip);};s.onerror=rej;document.head.appendChild(s);});}
function cname(c){c=String(c||'').toUpperCase();try{return new Intl.DisplayNames(['en'],{type:'region'}).of(c)||c;}catch(e){return c;}}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function csv(rows,cols){var q=function(v){v=v==null?'':Array.isArray(v)?v.join(' '):String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};return cols.join(',')+'\n'+rows.map(function(r){return cols.map(function(c){return q(r[c]);}).join(',');}).join('\n')+'\n';}
function storyPage(s){return '<!doctype html><meta charset="utf-8"><title>'+esc(s.title)+'</title><style>body{max-width:680px;margin:40px auto;padding:0 16px;font:17px/1.6 Georgia,serif;color:#0A0B14}small{color:#5F5A54}</style>'+
  '<h1>'+esc(s.title)+'</h1><p><small>'+esc([s.place,s.trip,s.status==='draft'?'Draft':''].filter(Boolean).join(' · '))+'</small></p>'+(s.excerpt?'<p><em>'+esc(s.excerpt)+'</em></p>':'')+(s.body||'')+(s.signOff?'<p>'+esc(s.signOff)+'</p>':'')+
  (s.link?'<p><small>Online: <a href="'+esc(s.link)+'">'+esc(s.link)+'</a></small></p>':'')+(s.externalUrl?'<p><small>Published at: <a href="'+esc(s.externalUrl)+'">'+esc(s.externalUrl)+'</a></small></p>':'');}
function mapData(){var local=null;try{local=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){}if(local)return Promise.resolve(local);
  var ms=window.$memberstackDom;if(!ms||!ms.getMemberJSON)return Promise.resolve(null);return ms.getMemberJSON().then(function(j){var d=j&&j.data||{};return d.tllStates||null;}).catch(function(){return null;});}
function ext(type,url){if(/png/.test(type))return'png';if(/webp/.test(type))return'webp';if(/gif/.test(type))return'gif';var m=/\.(jpe?g|png|webp|gif)(\?|$)/i.exec(url||'');return m?m[1].toLowerCase().replace('jpeg','jpg'):'jpg';}
function run(){
  if(document.getElementById('tll-exp')||!tok())return;
  var box=el('section','tll-exp');box.id='tll-exp';box.appendChild(el('p','tll-exp-k','Your copy'));box.appendChild(el('h3','','Download everything'));
  box.appendChild(el('p','','Your stories, photos, collections, stamps and map in one zip file. Yours to keep, whatever happens to any app.'));
  var b=el('button','','Download everything');b.type='button';var msg=el('p','tll-exp-msg');msg.setAttribute('aria-live','polite');box.appendChild(b);box.appendChild(msg);
  b.addEventListener('click',function(){b.disabled=true;msg.textContent='Gathering your stories and records…';
    try{window.gtag&&gtag('event','download_everything',{division:'tll'});}catch(e){}
    Promise.all([lib(),fetch(API,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:'{}'}).then(function(r){return r.json();}),mapData()]).then(function(v){
      var Z=v[0],d=v[1],map=v[2];if(!d||!d.ok)throw new Error((d&&d.error)||'The download could not start.');
      var zip=new Z(),root=zip.folder('that-layover-life');
      root.file('README.txt','That Layover Life: your copy\nExported '+d.exportedAt+'\nProfile: '+d.profileLink+'\n\nInside:\n- profile.json: your profile as it is saved\n- stories/: each story as a page you can open in any browser, plus stories.json\n- collections.csv and stamps.csv: open in Excel, Numbers or Google Sheets (JSON copies too)\n- pets.json, companions.json\n- map/: my-map.json (your full map, every country and how you know it), countries.csv (Lived, Stayed, Layover) and map-summary.json\n- places-lived.csv and .json: the places you have lived, with years\n- photos/: every photo, in folders by story, collection, stamp and pet\n\nPrivate collections and stamps are included: this copy is only for you.\n');
      root.file('profile.json',JSON.stringify(d.profile,null,2));
      var st=root.folder('stories');st.file('stories.json',JSON.stringify(d.stories,null,2));d.stories.forEach(function(s){st.file(s.slug+'.html',storyPage(s));});
      root.file('collections.json',JSON.stringify(d.collections,null,2));root.file('collections.csv',csv(d.collections,['collection','country','city','year','caption','shownOnProfile','photos']));
      root.file('stamps.json',JSON.stringify(d.stamps,null,2));root.file('stamps.csv',csv(d.stamps,['pursuit','what','country','city','month','year','workTrip','shownOnProfile','photo']));
      root.file('pets.json',JSON.stringify(d.pets,null,2));root.file('companions.json',JSON.stringify(d.companions,null,2));
      var mf=root.folder('map');mf.file('map-summary.json',JSON.stringify(d.mapSummary,null,2));if(map)mf.file('my-map.json',JSON.stringify(map,null,2));
      /* Expat build: places lived (from the profile) and every country marked on the map, as spreadsheets. */
      var pl=(d.placesLived||[]).map(function(x){return {country:cname(x.c),code:String(x.c||'').toUpperCase(),years:x.years||'',placesIKnowWell:x.knows||'',homeNow:x.now===true?'yes':''};});
      root.file('places-lived.json',JSON.stringify(pl,null,2));root.file('places-lived.csv',csv(pl,['country','code','years','placesIKnowWell','homeNow']));
      if(map&&map.states){var N=window.__tllN2A||{},rows=[];Object.keys(map.states).forEach(function(num){var e=map.states[num]||{};Object.keys(e).forEach(function(t){var tr=(map.travelers||[]).filter(function(x){return x.id===t;})[0];var a2=N[num]||'';
        rows.push({country:a2?cname(a2):num,code:a2||num,traveler:tr?tr.name:t,mark:e[t]==='lived'?'Lived':e[t]==='visited'?'Stayed':e[t]==='layover'?'Layover':e[t]});});});
        mf.file('countries.csv',csv(rows,['country','code','traveler','mark']));}
      var ph=root.folder('photos'),missing=[],done=0,list=d.photos||[];
      var one=function(p){return fetch(p.url,{mode:'cors'}).then(function(r){if(!r.ok)throw 0;return r.blob();}).then(function(blob){ph.file(p.folder+'/'+p.name+'.'+ext(blob.type,p.url),blob);})
        .catch(function(){missing.push(p.folder+'/'+p.name+': '+p.url);}).then(function(){done++;msg.textContent='Photos '+done+' of '+list.length+'…';});};
      var queue=list.slice(),workers=[0,1,2,3].map(function(){return (function next(){var p=queue.shift();return p?one(p).then(next):Promise.resolve();})();});
      return Promise.all(workers).then(function(){if(missing.length)ph.file('not-downloaded.txt','These photos could not be downloaded, so here are their links:\n'+missing.join('\n')+'\n');
        msg.textContent='Packing the zip…';return zip.generateAsync({type:'blob'});}).then(function(blob){
        var a=el('a');a.href=URL.createObjectURL(blob);a.download='that-layover-life-'+((d.profile&&d.profile.slug)||'me')+'-'+d.exportedAt.slice(0,10)+'.zip';document.body.appendChild(a);a.click();
        setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},4000);b.disabled=false;try{window.gtag&&gtag('event','download_complete',{division:'tll',photos:list.length-missing.length});}catch(e){}
        msg.textContent='Done. '+d.stories.length+(d.stories.length===1?' story, ':' stories, ')+(list.length-missing.length)+((list.length-missing.length)===1?' photo':' photos')+(missing.length?' ('+missing.length+' listed as links)':'')+'.';});
    }).catch(function(e){b.disabled=false;msg.textContent=(e&&e.message)||'The download did not finish. Try again.';});
  });
  /* Site owner only: the Paw Passport waitlist (the Worker answers 403 to everyone else, and nothing shows). */
  fetch(API.replace('/export','/paw/waitlist/export'),{method:'POST',headers:{Authorization:'Bearer '+tok()}}).then(function(r){if(r.status!==200)return;var n=r.headers.get('X-Count')||'0';return r.blob().then(function(blob){
    var p=el('p','tll-exp-msg'),a=el('a','','Download the CSV');a.href=URL.createObjectURL(blob);a.download='paw-passport-waitlist.csv';p.appendChild(document.createTextNode('Paw Passport waitlist: '+n+(n==='1'?' sign-up · ':' sign-ups · ')));p.appendChild(a);box.appendChild(p);});}).catch(function(){});
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);
  var after=document.getElementById('tll-wn')||document.getElementById('tll-crew-inbox');
  if(after)after.insertAdjacentElement('afterend',box);else if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1600);});else setTimeout(run,1600);
})();

/* tll-pros-v1 (31 Oct 2026, Value Playbook Phase 6: "From the Pros"). Reads GET /pros (the pros Nancy published in the CMS).
   Story pages by a pro: a "From the Pros" label above the headline and an author box after the story with their pro line and
   ONE link, anchored on their name or brand, with the rel the Worker decided (ugc nofollow until trusted, sponsored when paid
   or hosted). Profiles of a pro: a PRO badge with their line. Pursuit hubs: a "From the Pros" row of the pros in that hub.
   Nothing shows while no pro is published. No data-ms-* element touched; nav and footer untouched. */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/pros';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-pro-label{display:inline-block;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:2px;text-transform:uppercase;color:#C8325B;border:1.5px solid #C8325B;border-radius:2px;padding:3px 8px;margin:0 0 12px}'+
'.tll-pro-box{max-width:680px;margin:36px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #067A79;border-radius:4px;background:#fff;display:flex;gap:14px;align-items:center;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-pro-rek{color:#0A0B14;border-color:#0A0B14;margin-right:8px}.tll-pro-rek a{color:inherit}'+
'.tll-pro-box img{width:56px;height:56px;border-radius:50%;object-fit:cover;flex:none}.tll-pro-box p{margin:0}.tll-pro-k{font:600 11px/1.4 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79}'+
'.tll-pro-box a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-pro-badge{display:inline-flex;gap:6px;align-items:center;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;background:#0A0B14;color:#FDF9F3;border-radius:999px;padding:6px 10px;margin:8px 0}'+
'.tll-pro-badge b{color:#00C9C8;font-weight:600}'+
'.tll-pro-row{max-width:1120px;margin:32px auto;padding:0 16px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-pro-row .tll-pro-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}'+
'.tll-pro-row a.tll-pro-card{display:flex;gap:10px;align-items:center;border:1px solid #E0DACE;border-radius:8px;padding:10px;background:#fff;color:#0A0B14;text-decoration:none}.tll-pro-card img{width:40px;height:40px;border-radius:50%;object-fit:cover}.tll-pro-card small{display:block;color:#5F5A54}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-pros-v1'))return;var s=el('style');s.id='tll-pros-v1';s.textContent=CSS;document.head.appendChild(s);}
function story(pros){
  var main=document.querySelector('main')||document.body,by=main.querySelector('a[href^="/contributors/"]');if(!by)return;
  var slug=(by.getAttribute('href').split('/')[2]||'').replace(/[?#].*$/,''),p=pros.filter(function(x){return x.slug===slug;})[0];if(!p||document.querySelector('.tll-pro-label'))return;css();
  var h1=main.querySelector('h1'),CAT={'move-pros':'Move pros','pet-travel-pros':'Pet travel pros','road-warrior':'Road warrior'};
  if(h1){var lab=el('div','tll-pro-label','From the Pros'+(CAT[p.category]?' · '+CAT[p.category]:''));
    /* Paid or hosted, or a piece about the pro's own paid service: "Reklame for [name]" comes first, the name linked, rel sponsored. */
    if(p.sponsored&&!document.querySelector('.tll-pro-rek')){var rk=el('div','tll-pro-label tll-pro-rek');rk.appendChild(document.createTextNode('Reklame for '));if(p.url){var ra=el('a','',p.linkName);ra.href=p.url;ra.target='_blank';ra.rel='sponsored noopener noreferrer';rk.appendChild(ra);}else rk.appendChild(document.createTextNode(p.linkName));h1.parentNode.insertBefore(rk,h1);h1.parentNode.insertBefore(document.createTextNode(' '),h1);}
    h1.parentNode.insertBefore(lab,h1);}
  var box=el('aside','tll-pro-box');box.setAttribute('aria-label','About the writer');if(p.avatar){var im=el('img');im.src=p.avatar;im.alt='';box.appendChild(im);}
  var t=el('div');t.appendChild(el('p','tll-pro-k','From the Pros'));var line=el('p');line.appendChild(document.createTextNode(p.name+(p.line?', '+p.line:'')+'. '));
  if(p.url){var a=el('a','',p.linkName);a.href=p.url;a.rel=p.rel;a.target='_blank';line.appendChild(a);}t.appendChild(line);box.appendChild(t);
  var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var share=document.querySelector('.tll-story-share-row');
  if(share)share.parentNode.insertBefore(box,share);else if(body)body.insertAdjacentElement('afterend',box);else main.appendChild(box);
}
function profile(pros,slug){var p=pros.filter(function(x){return x.slug===slug;})[0];if(!p||document.querySelector('.tll-pro-badge'))return;css();
  var h1=(document.querySelector('main')||document.body).querySelector('h1');if(!h1)return;var b=el('div','tll-pro-badge');b.appendChild(el('b','','Pro'));if(p.line)b.appendChild(document.createTextNode(p.line));h1.insertAdjacentElement('afterend',b);}
function hub(pros,slug){var list=pros.filter(function(x){return x.pursuit&&x.pursuit.slug===slug;});if(!list.length||document.getElementById('tll-pro-row'))return;css();
  var s=el('section','tll-pro-row');s.id='tll-pro-row';var k=el('p','tll-pro-k','From the Pros');s.appendChild(k);var g=el('div','tll-pro-grid');
  list.forEach(function(p){var a=el('a','tll-pro-card');a.href='/contributors/'+p.slug;if(p.avatar){var im=el('img');im.src=p.avatar;im.alt='';a.appendChild(im);}var d=el('div');d.appendChild(document.createTextNode(p.name));if(p.line)d.appendChild(el('small','',p.line));a.appendChild(d);g.appendChild(a);});
  s.appendChild(g);var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(s,an.nextSibling);else main.appendChild(s);}
var m;
if(!/^\/(stories|contributors|pursuits)\/[^/]+$/.test(P))return;
function run(){fetch(API).then(function(r){return r.ok?r.json():null;}).then(function(d){var pros=d&&d.pros||[];if(!pros.length)return;
  if((m=/^\/stories\/([^/]+)$/.exec(P)))story(pros);else if((m=/^\/contributors\/([^/]+)$/.exec(P)))profile(pros,m[1]);else if((m=/^\/pursuits\/([^/]+)$/.exec(P)))hub(pros,m[1]);}).catch(function(){});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,800);});else setTimeout(run,800);
})();

/* tll-division-v1 (31 Oct 2026, Value Playbook Phase 7: revenue wiring). Two divisions, That Layover Life ("tll") and Paw Passport
   ("paw-passport"), told apart on every money surface.
   1. Every page sets the GA4 parameter division (paw-passport on /the-paw-passport, /pets/*, /my-pets and the dog-travel hub;
      tll everywhere else), so every event carries it.
   2. A click on a revenue link (rel sponsored, a partner or shop link on a profile, a Ko-fi, tip or shop link, a Pro's author
      link, a sponsor link) sends a revenue_click event with division, surface and the link's domain, and adds UTM tags
      (utm_source=thatlayoverlife, utm_medium=<surface>, utm_campaign=<division>) when the link has none. Ads are not touched.
   3. Elements marked data-tll-entity="legal-name" (registration-number, registered-city-and-country, legal-contact-email,
      tll-division-name, paw-passport-division-name) are filled from the one Site settings item (GET /settings), so no page
      carries a typed company name. Empty settings leave the page's own text. No data-ms-* element touched. */
(function(){
if(window.__tllDivision)return;window.__tllDivision=1;
var P=location.pathname.replace(/\/+$/,'')||'/';
var D=/^\/(the-paw-passport|my-pets|pets\/|pursuits\/dog-travel)/.test(P)?'paw-passport':'tll';
window.tllDivision=D;
try{window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};gtag('set',{division:D});}catch(e){}
var SHOP=/(^|\.)(ko-fi\.com|buymeacoffee\.com|patreon\.com|gumroad\.com|etsy\.com|shopify\.com|myshopify\.com|amazon\.[a-z.]+|amzn\.to|booking\.com|getyourguide\.[a-z]+|viator\.com)$/i;
function surface(a){if(a.closest('.tll-pro-box'))return'pro-author';if(a.closest('[data-tll-partner],.tll-pf-partner,.tll-partners'))return'partner';
  if(/sponsored/.test(a.rel||''))return'sponsored';if(a.hasAttribute('data-tll-kofi'))return'shop';try{if(SHOP.test(new URL(a.href).hostname))return'shop';}catch(e){}return'';}
document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var u;try{u=new URL(a.href,location.href);}catch(x){return;}
  if(u.hostname===location.hostname||!/^https?:$/.test(u.protocol))return;var s=surface(a);if(!s)return;
  if(!u.searchParams.has('utm_source')){u.searchParams.set('utm_source','thatlayoverlife');u.searchParams.set('utm_medium',s);u.searchParams.set('utm_campaign',D);a.href=u.toString();}
  try{gtag('event','revenue_click',{division:D,surface:s,link_domain:u.hostname});}catch(x){}
},true);
var marks=document.querySelectorAll('[data-tll-entity]');
function fill(){var m=document.querySelectorAll('[data-tll-entity]');if(!m.length)return;
  fetch('https://tll-travel-wire.thatlayoverlife.workers.dev/settings').then(function(r){return r.ok?r.json():null;}).then(function(d){var e=d&&d.entity||{};
    [].forEach.call(m,function(n){if([].some.call(n.attributes,function(x){return x.name.indexOf('data-ms-')===0;}))return;var v=e[n.getAttribute('data-tll-entity')];if(v)n.textContent=v;});}).catch(function(){});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fill);else fill();
})();

/* tll-paw-v1 (31 Oct 2026, Value Playbook Phase 8: Paw Passport waitlist and QR landing, no prices). STAGED until the trademark
   clearance search is clear: shows only with ?preview=paw (remembered; ?preview=off clears) or a QR link (?qr=...) while PUBLIC
   is false. /the-paw-passport only.
   1. Waitlist card: email, pet name, what they want (the guide, a plush travel buddy), one consent box; one email when it is
      ready. Sent to the Worker (POST /paw/waitlist), which keeps it private.
   2. QR landing (?qr=mini or ?qr=big, printed on each toy): "Where did your travel buddy go?" Signed-in members add the trip as a
      Dog Travel stamp (country, city, year, one photo, GPS removed in the browser) through the stamps the site already has;
      everyone else can join free or join the waitlist.
   Events carry division paw-passport. No prices anywhere. No data-ms-* element touched. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/the-paw-passport')return;
var PUBLIC=false,q=new URLSearchParams(location.search),QR=(q.get('qr')||'').toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,20);
try{if(q.get('preview')==='paw')localStorage.setItem('tll-preview-paw','1');if(q.get('preview')==='off')localStorage.removeItem('tll-preview-paw');}catch(e){}
var on=PUBLIC||q.get('preview')==='paw'||!!QR;try{on=on||localStorage.getItem('tll-preview-paw')==='1';}catch(e){}if(!on)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var TOYS={mini:'Mini travel buddy',big:'Big travel buddy'};
var CSS='.tll-paw{max-width:760px;margin:28px auto;padding:18px;border:1px solid #E0DACE;border-radius:6px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-paw-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}.tll-paw h3{font:800 24px/1.15 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-paw p{margin:0 0 12px;color:#3a3833}.tll-paw-f{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tll-paw-f .w{grid-column:1/-1}'+
'.tll-paw label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#5F5A54}.tll-paw label.c{flex-direction:row;align-items:flex-start;gap:8px;color:#0A0B14;font-size:14px}'+
'.tll-paw input[type=email],.tll-paw input[type=text],.tll-paw input[type=number],.tll-paw input[type=file]{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;min-height:44px}'+
'.tll-paw input[type=checkbox]{width:18px;height:18px;accent-color:#C8325B;margin-top:2px;flex:none}.tll-paw-hp{position:absolute;left:-9999px}'+
'.tll-paw button,.tll-paw a.b{border:0;background:#C8325B;color:#fff;border-radius:4px;min-height:44px;padding:0 18px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;display:inline-flex;align-items:center;text-decoration:none}'+
'.tll-paw-msg{font-size:13px;color:#5F5A54;margin:8px 0 0}.tll-paw-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 8px}'+
'@media (max-width:560px){.tll-paw-f{grid-template-columns:1fr}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'paw-passport'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function field(f,lbl,type,wide,attrs){var l=el('label',wide?'w':'',lbl),i=el('input');i.type=type;Object.keys(attrs||{}).forEach(function(k){i.setAttribute(k,attrs[k]);});l.appendChild(i);f.appendChild(l);return i;}
function box(k,h,p){var b=el('section','tll-paw');if(!PUBLIC)b.appendChild(el('p','tll-paw-flag','Preview · not live'));b.appendChild(el('p','tll-paw-k',k));b.appendChild(el('h3','',h));if(p)b.appendChild(el('p','',p));return b;}
function waitlist(source){
  var b=box('Paw Passport · coming','Be first when it is ready.','The EU pet travel guide and a plush travel buddy for your dog. No prices yet. We email you once, when it is ready.');
  var f=el('div','tll-paw-f');f.setAttribute('role','group');f.setAttribute('aria-label','Join the Paw Passport waitlist');
  var email=field(f,'Email','email',false,{autocomplete:'email',required:''}),pet=field(f,"Your pet's name (optional)",'text',false,{maxlength:'40'});
  var g=el('label','c w'),gi=el('input');gi.type='checkbox';gi.checked=true;g.appendChild(gi);g.appendChild(document.createTextNode('The EU pet travel guide (PDF)'));f.appendChild(g);
  var p=el('label','c w'),pi=el('input');pi.type='checkbox';pi.checked=true;p.appendChild(pi);p.appendChild(document.createTextNode('A plush travel buddy'));f.appendChild(p);
  var c=el('label','c w'),ci=el('input');ci.type='checkbox';c.appendChild(ci);c.appendChild(document.createTextNode('Email me when it is ready. Nothing else, and you can say stop any time.'));f.appendChild(c);
  var hp=el('input','tll-paw-hp');hp.type='text';hp.tabIndex=-1;hp.autocomplete='off';hp.setAttribute('aria-hidden','true');f.appendChild(hp);
  var btn=el('button','','Join the waitlist');btn.type='button';var w=el('div','w');w.appendChild(btn);f.appendChild(w);b.appendChild(f);
  var msg=el('p','tll-paw-msg');msg.setAttribute('aria-live','polite');b.appendChild(msg);
  btn.addEventListener('click',function(){var ints=[];if(gi.checked)ints.push('guide');if(pi.checked)ints.push('plush');btn.disabled=true;
    fetch(API+'/paw/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.value,pet:pet.value,interests:ints,consent:ci.checked,source:source,website:hp.value})})
    .then(function(r){return r.json();}).then(function(d){btn.disabled=false;if(d&&d.ok){msg.textContent="You're on the list. One email when it is ready.";track('paw_waitlist_join',{source:source});email.value='';}else msg.textContent=(d&&d.error)||'That did not go through. Try again.';})
    .catch(function(){btn.disabled=false;msg.textContent='That did not go through. Try again.';});});
  return b;}
function upload(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var s=Math.min(1,2000/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej('read');},'image/jpeg',0.88);};im.onerror=function(){rej('read');};im.src=u;})
  .then(function(blob){var fd=new FormData();fd.append('file',blob,'buddy.jpg');fd.append('upload_preset','tll_photos');fd.append('folder','tll/stamps');return fetch('https://api.cloudinary.com/v1_1/idonvlow/image/upload',{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){if(!j.secure_url)throw 'up';return j.secure_url;});});}
function qrPanel(){
  var toy=TOYS[QR]||'Travel buddy';track('paw_qr_scan',{toy:QR});
  var b=box('Paw Passport · '+toy,'Where did your travel buddy go?','Add the trip as a stamp on your Dog Travel page: the country, the year and one photo. Private until you choose to show it.');
  if(!tok()){var a=el('a','b','Join free to add the stamp');a.href='/signup?utm_source=qr&utm_medium=plush&utm_campaign=paw-passport';b.appendChild(a);b.appendChild(el('p','tll-paw-msg','Already a member? Log in, then scan again.'));return b;}
  var f=el('div','tll-paw-f');var ctry=field(f,'Country','text',false,{list:'tll-paw-c',autocomplete:'off'}),city=field(f,'City (optional)','text',false,{maxlength:'60'}),yr=field(f,'Year','number',false,{min:'1990',max:String(new Date().getFullYear()),value:String(new Date().getFullYear())}),ph=field(f,'One photo (optional)','file',false,{accept:'image/*'});
  var dl=el('datalist');dl.id='tll-paw-c';try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var x=65;x<91;x++)for(var y=65;y<91;y++){var cc=String.fromCharCode(x,y),n=dn.of(cc);if(n&&n!==cc){var o=el('option');o.value=n;dl.appendChild(o);}}}catch(e){}f.appendChild(dl);
  var btn=el('button','','Add the stamp');btn.type='button';var w=el('div','w');w.appendChild(btn);f.appendChild(w);b.appendChild(f);var msg=el('p','tll-paw-msg');msg.setAttribute('aria-live','polite');b.appendChild(msg);
  btn.addEventListener('click',function(){if(!ctry.value.trim()){msg.textContent='Pick a country.';return;}btn.disabled=true;msg.textContent=ph.files[0]?'Cleaning and uploading the photo…':'Adding…';
    (ph.files[0]?upload(ph.files[0]):Promise.resolve('')).then(function(url){return fetch(API+'/stamps/add',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:JSON.stringify({pursuit:'dog-travel',what:toy,country:ctry.value,city:city.value,year:yr.value,photo:url})}).then(function(r){return r.json();});})
    .then(function(d){btn.disabled=false;if(d&&d.ok){msg.textContent='Stamped. See it under Pursuit stamps on your profile settings.';track('paw_qr_stamp',{toy:QR});}else msg.textContent=(d&&d.error)||'That did not go through.';})
    .catch(function(){btn.disabled=false;msg.textContent='The photo could not be uploaded. Try again without it.';});});
  return b;}
function css(){if(document.getElementById('tll-paw-v1'))return;var s=el('style');s.id='tll-paw-v1';s.textContent=CSS;document.head.appendChild(s);}
function run(){if(document.getElementById('tll-paw-wrap'))return;css();var wrap=el('div');wrap.id='tll-paw-wrap';
  if(QR)wrap.appendChild(qrPanel());wrap.appendChild(waitlist(QR?'qr:'+QR:'the-paw-passport'));
  var main=document.querySelector('main')||document.body,hero=main.querySelector('.tll-paw-hero')||main.querySelector('h1');var an=hero&&(hero.closest('section')||hero);
  if(an&&an.parentNode)an.parentNode.insertBefore(wrap,an.nextSibling);else main.appendChild(wrap);if(QR)wrap.scrollIntoView({block:'start'});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,900);});else setTimeout(run,900);
})();

/* tll-metrics-v1 (31 Oct 2026, Value Playbook Phase 9: private investor metrics). /account, site owner only: the Worker
   (POST /metrics) answers 403 to everyone else and nothing shows. Headline numbers counted from the live site, the change since
   the oldest kept day (up to 30 days back), a line of travelers and stories over time, and "Download investor snapshot": a
   one-page HTML file with the same numbers and the date, to attach to an email. Totals only, no names or places.
   No data-ms-* element touched. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/account')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/metrics';
var ROWS=[['travelers','Travelers'],['stories','Stories live'],['countries','Countries covered'],['writers','Writers'],['storiesLast30Days','Stories, last 30 days'],['pets','Pets'],
  ['companionLinks','Companion links'],['collectors','Collectors'],['collectionItems','Collection pieces'],['stampers','Members with stamps'],['stamps','Pursuit stamps'],['pawWaitlist','Paw Passport waitlist']];
var CSS='.tll-met{max-width:760px;margin:24px auto;padding:18px;border:1px solid #E0DACE;border-left:3px solid #067A79;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-met-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}.tll-met h3{font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 12px}'+
'.tll-met-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:0 0 14px}.tll-met-c{border:1px solid #E0DACE;border-radius:4px;padding:10px}'+
'.tll-met-c b{display:block;font:800 26px/1.1 "Playfair Display",Georgia,serif}.tll-met-c span{font-size:13px;color:#5F5A54}.tll-met-c i{display:block;margin-top:4px;font-style:normal;font:600 11px/1 "JetBrains Mono",monospace;color:#067A79}'+
'.tll-met button{border:0;background:#0A0B14;color:#FDF9F3;border-radius:4px;min-height:44px;padding:0 16px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-met small{display:block;color:#5F5A54;margin-top:8px}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function line(hist){var w=640,h=120,keys=[['travelers','#C8325B'],['stories','#067A79']],max=1;hist.forEach(function(d){keys.forEach(function(k){max=Math.max(max,d[k[0]]||0);});});
  var x=function(i){return hist.length<2?w/2:16+i*(w-32)/(hist.length-1);},y=function(v){return h-16-(v/max)*(h-32);};
  var s='<svg viewBox="0 0 '+w+' '+h+'" width="100%" role="img" aria-label="Travelers and stories over time"><line x1="16" y1="'+(h-16)+'" x2="'+(w-16)+'" y2="'+(h-16)+'" stroke="#E0DACE"/>';
  keys.forEach(function(k){s+='<polyline fill="none" stroke="'+k[1]+'" stroke-width="2.5" points="'+hist.map(function(d,i){return x(i).toFixed(1)+','+y(d[k[0]]||0).toFixed(1);}).join(' ')+'"/>';var last=hist[hist.length-1];s+='<text x="'+(w-16)+'" y="'+(y(last[k[0]]||0)-6).toFixed(1)+'" text-anchor="end" font-family="monospace" font-size="11" fill="'+k[1]+'">'+(k[0]==='travelers'?'Travelers ':'Stories ')+(last[k[0]]||0)+'</text>';});
  return s+'</svg>';}
function snapshot(d){var t=d.today,first=d.history[0];var rows=ROWS.map(function(r){var ch=first&&first.date!==t.date?(t[r[0]]-(first[r[0]]||0)):null;return '<tr><td>'+r[1]+'</td><td style="text-align:right;font-weight:700">'+t[r[0]]+'</td><td style="text-align:right;color:#067A79">'+(ch==null?'':(ch>=0?'+':'')+ch+' since '+first.date)+'</td></tr>';}).join('');
  return '<!doctype html><meta charset="utf-8"><title>That Layover Life: metrics '+t.date+'</title><style>body{max-width:720px;margin:40px auto;padding:0 16px;font:16px/1.5 Georgia,serif;color:#0A0B14}table{width:100%;border-collapse:collapse}td{padding:8px 4px;border-bottom:1px solid #E0DACE}h1{font-size:30px;margin:0 0 4px}p{color:#5F5A54}</style>'+
  '<h1>That Layover Life</h1><p>Counted from the live site on '+t.date+'. Totals only. Traffic figures come from Google Analytics separately.</p><table>'+rows+'</table>'+(d.history.length>1?'<h2 style="font-size:18px;margin-top:28px">Growth</h2>'+line(d.history):'')+'<p style="margin-top:24px">www.thatlayover.life</p>';}
function run(){
  if(document.getElementById('tll-met')||!tok())return;
  fetch(API,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:'{}'}).then(function(r){return r.status===200?r.json():null;}).then(function(d){
    if(!d||!d.ok||document.getElementById('tll-met'))return;var s=el('style');s.textContent=CSS;document.head.appendChild(s);
    var box=el('section','tll-met');box.id='tll-met';box.appendChild(el('p','tll-met-k','Only you see this'));box.appendChild(el('h3','','Investor metrics'));
    var g=el('div','tll-met-g'),first=d.history[0];
    ROWS.forEach(function(r){var c=el('div','tll-met-c');c.appendChild(el('b','',String(d.today[r[0]])));c.appendChild(el('span','',r[1]));
      if(first&&first.date!==d.today.date){var ch=d.today[r[0]]-(first[r[0]]||0);if(ch)c.appendChild(el('i','',(ch>=0?'+':'')+ch+' since '+first.date));}g.appendChild(c);});
    box.appendChild(g);if(d.history.length>1){var ch=el('div');ch.innerHTML=line(d.history);box.appendChild(ch);}
    var b=el('button','','Download investor snapshot');b.type='button';b.onclick=function(){var a=el('a');a.href=URL.createObjectURL(new Blob([snapshot(d)],{type:'text/html'}));a.download='that-layover-life-metrics-'+d.today.date+'.html';document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},2000);};
    box.appendChild(b);box.appendChild(el('small','','Counted from the live site. The growth line fills in one point a day from today.'));
    /* "How do you travel most?" answers, this month (members count once; multi-select, so the rows can add up to more). */
    var ts=d.travelStyle||{},months=Object.keys(ts).sort(),cur=months[months.length-1];
    if(cur){var L={'big-trips':'A few big trips a year','short-trips':'Lots of short trips and layovers',abroad:'I live abroad (or did)',work:'For work',pet:'With my pet',pursuit:'For a pursuit'};
      box.appendChild(el('p','tll-met-k','How members travel · '+cur+' · '+ts[cur].members+(ts[cur].members===1?' answer':' answers')));var tg=el('div','tll-met-g');
      Object.keys(L).forEach(function(k){var c=el('div','tll-met-c');c.appendChild(el('b','',String(ts[cur][k]||0)));c.appendChild(el('span','',L[k]));tg.appendChild(c);});box.appendChild(tg);}
    var after=document.getElementById('tll-exp'),main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);
    if(after)after.insertAdjacentElement('afterend',box);else if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);
  }).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,2000);});else setTimeout(run,2000);
})();

/* tll-series-v1 (31 Oct 2026). Every story series in one layer, read from GET /series and /series/story (Worker).
   Work trips: The Free Evening, Plus One Day. Expats: The First Friend, The Partner Who Moved Too, Moving Back.
   Pets: First Trip Together, The Sitter Was the Hero, Cats Who Travel.
   - Story cards on /stories, /countries/<slug>, /for-expats, /the-paw-passport: a black washi-tape label, e.g. "The First Friend · Copenhagen".
   - /stories: filter chips, one per series that has stories.
   - Story pages: the label above the headline; the writer's template fields; their safety note (only if written); a Trip Kit
     (reklamelink, rel sponsored, no cards); the "Pet-friendly or pet-tolerant?" note (writer's experience, dated, no stars,
     links nofollow ugc); a LinkedIn share link (no SDK).
   Nothing shows until a story is tagged with a series theme. No schema added: stories keep Article only. No data-ms-* touched. */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-wt-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 11px/1.3 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%);margin:0 0 10px;max-width:100%}'+
'.tll-wt-card-tape{position:absolute;top:10px;left:10px;z-index:3;margin:0;font-size:10px;padding:5px 10px}'+
'.tll-sr-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 16px;font:400 14px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-sr-chips button{min-height:44px;padding:0 14px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-sr-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-sr-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-sr-box{max-width:680px;margin:28px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-sr-box ol{margin:8px 0 0;padding-left:20px}.tll-sr-box p{margin:0 0 6px}.tll-sr-box b{font-weight:600}.tll-sr-box small{display:block;color:#5F5A54;margin-top:8px}'+
'.tll-sr-box a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-sr-kit a{margin-right:14px}.tll-sr-kit i{font-style:normal;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#5F5A54;margin-left:4px}'+
'.tll-sr-li{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;background:#0A0B14;color:#FDF9F3!important;text-decoration:none!important;font-weight:600}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-series-v1'))return;var s=el('style');s.id='tll-series-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:x&&x.division||'tll'},x||{}));}catch(e){}}
function tape(text,cls){return el('span','tll-wt-tape'+(cls?' '+cls:''),text);}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
function div(group){return group==='pets'?'paw-passport':'tll';}
function line(box,label,val){if(!val)return;var p=el('p');p.appendChild(el('b','',label+': '));p.appendChild(document.createTextNode(val));box.appendChild(p);}

function labelCards(cards){var by={};cards.forEach(function(c){by[c.slug]=c;});
  Object.keys(by).forEach(function(slug){[].slice.call(document.querySelectorAll('a[href="/stories/'+slug+'"],a[href^="/stories/'+slug+'?"]')).forEach(function(a){
    if(a.closest('.tll-wt-rail')||a.closest('nav,header,footer,.tll-sr-box'))return;var card=a.closest('.w-dyn-item')||a;if(card.querySelector('.tll-wt-card-tape'))return;
    if(getComputedStyle(card).position==='static')card.style.position='relative';card.appendChild(tape(by[slug].label,'tll-wt-card-tape'));card.setAttribute('data-tll-series',by[slug].series);});});}
function chips(series){if(document.getElementById('tll-sr-chips'))return;var have=series.filter(function(s){return s.stories.length;});if(!have.length)return;
  var first=document.querySelector('main .w-dyn-item a[href^="/stories/"]'),list=first&&first.closest('.w-dyn-list');if(!list)return;
  var row=el('div','tll-sr-chips');row.id='tll-sr-chips';row.setAttribute('role','group');row.setAttribute('aria-label','Story series');row.appendChild(el('span','tll-sr-k','Series'));var on='';
  have.forEach(function(s){var b=el('button','',s.name);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){on=on===s.slug?'':s.slug;
    [].slice.call(row.querySelectorAll('button')).forEach(function(x){x.setAttribute('aria-pressed',String(x===b&&on!==''));});
    [].slice.call(list.querySelectorAll('.w-dyn-item')).forEach(function(it){it.hidden=!!on&&it.getAttribute('data-tll-series')!==on;});track('series_filter',{series:on||'all',division:div(s.group)});});row.appendChild(b);});
  list.parentNode.insertBefore(row,list);}

function fieldsBox(d){var f=d.fields||{},s=d.series,box=el('aside','tll-sr-box'),name=d.label.split(' · ')[0];box.setAttribute('aria-label',name);box.appendChild(el('p','tll-sr-k',name));
  if(s==='the-free-evening'){var t=[f.time,f.start?'starting from a '+f.start.toLowerCase():''].filter(Boolean).join(', ');if(t)box.appendChild(el('p','',t));
    if(f.stops&&f.stops.length){var ol=el('ol');f.stops.forEach(function(x){ol.appendChild(el('li','',x.stop+(x.move?' · '+x.move:'')));});box.appendChild(ol);}}
  else if(s==='plus-one-day'){if(f.extraDays)box.appendChild(el('p','',f.extraDays+(f.extraDays===1?' extra day':' extra days')));line(box,'Who paid for what',f.whoPaid);line(box,'Best decision',f.best);line(box,'Worst decision',f.worst);}
  else if(s==='the-first-friend'){var a=[f.yearsThere?f.yearsThere+(f.yearsThere===1?' year in':' years in'):'',f.monthsItTook?'it took '+f.monthsItTook+(f.monthsItTook===1?' month':' months'):''].filter(Boolean).join(', ');if(a)box.appendChild(el('p','',a.charAt(0).toUpperCase()+a.slice(1)+'.'));
    line(box,'Where it happened',f.where);line(box,'What worked',f.worked);line(box,'What did not',f.didNot);}
  else if(s==='the-partner-who-moved-too'){var m=[f.from&&f.to?f.from+' to '+f.to:'',f.years].filter(Boolean).join(', ');if(m)box.appendChild(el('p','',m));line(box,'What happened to my work',f.work);line(box,'What I wish someone had told me',f.wish);}
  else if(s==='moving-back'){var mb=[f.from&&f.to?f.from+' back to '+f.to:'',f.yearsAway?f.yearsAway+' away':''].filter(Boolean).join(', ');if(mb)box.appendChild(el('p','',mb));line(box,'The strangest thing about home now',f.strangest);line(box,'What I kept from abroad',f.kept);}
  else if(s==='the-sitter-was-the-hero'){line(box,'The hero',f.sitter);}
  else if(s==='cats-who-travel'){line(box,'Carrier or harness',f.carrier);line(box,'Where they hid',f.hid);}
  if(f.when)box.appendChild(el('small','',(d.group==='pets'?"Writer's experience, ":'Written ')+f.when));
  return box.children.length>1?box:null;}
function petBox(b){var box=el('aside','tll-sr-box');box.setAttribute('aria-label','Pet-friendly or pet-tolerant?');box.appendChild(el('p','tll-sr-k','Pet-friendly or pet-tolerant?'));
  if(b.stayedAt){var p=el('p');p.appendChild(el('b','','Stayed at: '));if(b.url){var a=el('a','',b.stayedAt);a.href=b.url;a.rel=b.rel;a.target='_blank';p.appendChild(a);}else p.appendChild(document.createTextNode(b.stayedAt));if(b.city)p.appendChild(document.createTextNode(', '+b.city));box.appendChild(p);}
  line(box,'What we paid for the pet',b.paid);line(box,'Size or weight rule',b.sizeRule);line(box,'What made it welcoming',b.welcoming);line(box,'What we would tell the next owner',b.tell);
  box.appendChild(el('small','',"Writer's experience"+(b.when?', '+b.when:'')+'. No business can pay to change or remove a note.'));return box;}
function storyPage(slug){get('/series/story?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||document.getElementById('tll-sr-story'))return;
  var main=document.querySelector('main')||document.body,h1=main.querySelector('h1');var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var wrap=el('div');wrap.id='tll-sr-story';css();
  if(d.series){if(h1&&!document.querySelector('.tll-sr-head-tape')){var t=tape(d.label,'tll-sr-head-tape');h1.parentNode.insertBefore(t,h1);}
    var fb=fieldsBox(d);if(fb)wrap.appendChild(fb);
    if(d.safetyNote){var sn=el('aside','tll-sr-box');sn.appendChild(el('p','tll-sr-k','Safety, from the writer'));sn.appendChild(el('p','',d.safetyNote));wrap.appendChild(sn);}
    var sh=el('div','tll-sr-box'),li=el('a','tll-sr-li','Share on LinkedIn');li.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.origin+location.pathname);li.target='_blank';li.rel='noopener';
    li.addEventListener('click',function(){track('share_click',{channel:'linkedin',series:d.series,division:div(d.group)});});sh.appendChild(li);wrap.appendChild(sh);}
  /* Linked sponsor label (staged with the expat and pet previews): the existing "Reklame for" label gets the sponsor's name as a link. */
  var prev=false;try{prev=localStorage.getItem('tll-preview-pets')==='1'||localStorage.getItem('tll-preview-expat')==='1';}catch(e){}
  if(prev&&d.sponsor){var rk=document.querySelector('[data-tll-reklame]');if(!rk&&h1){rk=el('div','tll-reklame');rk.setAttribute('data-tll-reklame','1');rk.setAttribute('lang','da');h1.parentNode.insertBefore(rk,h1);}
    if(rk&&!rk.querySelector('a')){rk.textContent='Reklame for ';var sa=el('a','',d.sponsor.name);sa.href=d.sponsor.url;sa.target='_blank';sa.rel=d.sponsor.rel;sa.style.color='inherit';sa.addEventListener('click',function(){track('revenue_click',{slot:'sponsor_label',division:div(d.group)});});rk.appendChild(sa);}}
  if(d.petBox)wrap.appendChild(petBox(d.petBox));
  if(d.tripKit&&d.tripKit.length){var k=el('aside','tll-sr-box tll-sr-kit');k.appendChild(el('p','tll-sr-k','Trip Kit · reklamelink'));var p=el('p');
    d.tripKit.forEach(function(x){var a=el('a','',x.label);a.href=x.url;a.rel=x.rel;a.target='_blank';a.addEventListener('click',function(){track('revenue_click',{slot:'trip_kit',label:x.label,division:'tll'});});p.appendChild(a);});
    p.appendChild(el('i','','reklamelink'));k.appendChild(p);wrap.appendChild(k);}
  if(!wrap.children.length)return;var share=document.querySelector('.tll-story-share-row');if(share)share.parentNode.insertBefore(wrap,share);else if(body)body.insertAdjacentElement('afterend',wrap);else main.appendChild(wrap);});}

function run(){var m;
  if((m=/^\/stories\/([^/]+)$/.exec(P))){storyPage(m[1]);return;}
  if(!(P==='/stories'||/^\/countries\/[^/]+$/.test(P)||P==='/for-expats'||P==='/the-paw-passport'||P==='/pursuits/work-trips'))return;
  get('/series').then(function(d){if(!d||!d.ok)return;var cards=[];d.series.forEach(function(s){cards=cards.concat(s.stories);});if(!cards.length)return;css();
    labelCards(cards);if(P==='/stories')chips(d.series);setTimeout(function(){labelCards(cards);},2500);window.__tllSeries=d;});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
})();

/* tll-expat-v1 (31 Oct 2026, expat build on the Value Playbook: "The move, the first friend and the partner who moved too").
   STAGED: EX_PUBLIC false; shows with ?preview=expat (remembered in this browser; ?preview=off clears).
   /contributors/<slug>  "Lived in [n]" beside the map numbers (from countries marked Lived on the map, never typed; hidden when the
                         member shows ranges), tap for Places I have lived with years (today's home only if they switched Show home
                         base on). Milestone badges, never a ranking. "My moves" slide show, only if the member switched it on.
                         Person JSON-LD keeps the country of the home base, never the city.
   /edit-profile         "05E · Your moves": Show home base, Open to coffee with newcomers (the Living Library), My moves, Moved back,
                         and one optional line per home for the show.
   /for-expats           The landing in one scroll: hero, three promises, the three series rows, the Living Library (opted-in members
                         only, shuffled per session, no contact details on cards, Get in touch after sign-in, Report on every card),
                         practical links, the Layover Club line. Empty parts are left out, never shown empty.
   Counts are computed, never typed. City or country only. No data-ms-* element touched; nav and footer untouched. */
(function(){
var EX_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='expat')localStorage.setItem('tll-preview-expat','1');if(q==='off')localStorage.removeItem('tll-preview-expat');}catch(e){}
var ON=EX_PUBLIC||q==='expat';try{ON=ON||localStorage.getItem('tll-preview-expat')==='1';}catch(e){}
window.__tllExpatOn=ON;if(!ON)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var FLAGS='https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/';
var BADGES={'first-move-abroad':'First move abroad','lived-on-two-continents':'Lived on 2 continents','moved-back':'Moved back'};
var CSS='.tll-ex{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-ex [hidden]{display:none!important}'+
'.tll-ex-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-ex-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 8px}'+
'.tll-ex-stat{background:none;border:0;padding:0;text-align:left;cursor:pointer;color:inherit;font:inherit;min-height:44px}.tll-ex-stat:focus-visible{outline:2px solid #C8325B;outline-offset:2px}'+
'.tll-ex-pop{max-width:760px;margin:12px 0;padding:14px 16px;border:1px solid #E0DACE;border-radius:6px;background:#fff}.tll-ex-pop ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}.tll-ex-pop li{display:flex;gap:10px;align-items:center}.tll-ex-pop img{width:24px;height:24px}.tll-ex-pop small{color:#5F5A54;display:block}'+
'.tll-ex-badges{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.tll-ex-badge{font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:1.5px solid #0A0B14;border-radius:999px;padding:8px 12px}'+
'.tll-ex-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;border:0;background:#C8325B;color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-ex-btn.ink{background:#0A0B14;color:#FDF9F3}.tll-ex-btn.ghost{background:#fff;color:#0A0B14;border:1.5px solid #0A0B14}'+
'.tll-ex-sec{background:#FDF9F3}.tll-ex-in{max-width:1120px;margin:0 auto;padding:44px 16px}.tll-ex h2{font:800 clamp(28px,4vw,46px)/1.05 "Playfair Display",Georgia,serif;margin:0 0 12px}.tll-ex h3{font:800 24px/1.15 "Playfair Display",Georgia,serif;margin:0 0 12px}'+
'.tll-ex-lede{max-width:62ch;color:#3a3833;margin:0 0 16px}.tll-ex-small{font:600 12px/1.4 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;color:#5F5A54;margin:10px 0 0}'+
'.tll-ex-prom{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.tll-ex-prom a{display:block;border-top:2px solid #0A0B14;padding:14px 0 0;color:#0A0B14;text-decoration:none}.tll-ex-prom b{display:block;font:800 20px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-ex-row{border-top:2px solid #0A0B14;padding:22px 0 0;margin:30px 0 0}.tll-ex-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);gap:14px;overflow-x:auto;padding:6px 0 10px}'+
'.tll-ex-rail a{position:relative;display:block;border:1px solid #E0DACE;border-radius:6px;background:#fff;color:#0A0B14;text-decoration:none;overflow:hidden}.tll-ex-rail .ph{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:#E0DACE}.tll-ex-rail b{display:block;font:800 19px/1.2 "Playfair Display",Georgia,serif;padding:12px}'+
'.tll-ex-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 10px/1.3 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;padding:5px 10px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%)}.tll-ex-rail .tll-ex-tape{position:absolute;top:10px;left:10px}'+
'.tll-ex-books{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}.tll-ex-book{border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:14px;display:flex;flex-direction:column;gap:6px}'+
'.tll-ex-book header{display:flex;gap:10px;align-items:center}.tll-ex-book header img{width:48px;height:48px;border-radius:50%;object-fit:cover}.tll-ex-book b{font:800 19px/1.2 "Playfair Display",Georgia,serif}.tll-ex-book small{color:#5F5A54;display:block}'+
'.tll-ex-book .acts{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:8px}.tll-ex-book .rep{font-size:13px;color:#5F5A54}'+
'.tll-ex details{border:1px dashed #C8B9A6;border-radius:6px;padding:12px 14px;background:#fff;margin:0 0 16px}.tll-ex summary{cursor:pointer;font-weight:600;min-height:28px}'+
'.tll-ex-set label{display:flex;gap:10px;align-items:flex-start;border:1px solid #E0DACE;border-radius:6px;padding:10px 12px;background:#fff;margin:0 0 8px;cursor:pointer}.tll-ex-set input[type=checkbox]{width:18px;height:18px;margin-top:2px;accent-color:#C8325B;flex:none}'+
'.tll-ex-set input[type=text]{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;min-height:44px}'+
'@media (max-width:760px){.tll-ex-prom{grid-template-columns:1fr}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-expat-v1'))return;var s=el('style');s.id='tll-expat-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
function cname(c){c=String(c||'').toUpperCase();try{return new Intl.DisplayNames(['en'],{type:'region'}).of(c)||c;}catch(e){return c;}}
function plural(n,one,many){return n+' '+(n===1?one:many);}

/* Profile */
function profile(slug){get('/album?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||!d.homes||document.getElementById('tll-ex-lived'))return;css();var h=d.homes;
  var S=document.querySelector('[data-pf5="stats"]'),ranges=S&&/under 10|-something/.test(S.textContent||'');
  if(S&&h.total>0&&!ranges){var cell=el('div'),b=el('button','tll-ex-stat');b.type='button';b.id='tll-ex-lived';b.setAttribute('aria-expanded','false');
    b.appendChild(el('div','pf5-stat-v',String(h.total)));b.appendChild(el('div','pf5-stat-k',h.total===1?'COUNTRY LIVED IN':'COUNTRIES LIVED IN'));cell.appendChild(b);
    var info=S.querySelector('.pf5-stat-i');if(info)S.insertBefore(cell,info);else S.appendChild(cell);
    var pop=el('div','tll-ex tll-ex-pop');pop.hidden=true;pop.id='tll-ex-lived-list';b.setAttribute('aria-controls',pop.id);pop.appendChild(el('p','tll-ex-k','Places I have lived'));
    if(h.places.length){var ul=el('ul');h.places.forEach(function(p){var li=el('li'),im=el('img');im.src=FLAGS+p.c+'.svg';im.alt='';li.appendChild(im);var t=el('div');t.appendChild(document.createTextNode(cname(p.c)));if(p.years)t.appendChild(el('small','',p.years));li.appendChild(t);ul.appendChild(li);});pop.appendChild(ul);}
    else pop.appendChild(el('p','','Counted from the map. The places and years appear here once they are added on the profile.'));
    S.insertAdjacentElement('afterend',pop);b.onclick=function(){pop.hidden=!pop.hidden;b.setAttribute('aria-expanded',String(!pop.hidden));};}
  var head=S||document.querySelector('main h1');
  if(head&&h.badges&&h.badges.length){var bd=el('div','tll-ex tll-ex-badges');bd.setAttribute('aria-label','Milestones');h.badges.forEach(function(k){bd.appendChild(el('span','tll-ex-badge',BADGES[k]||k));});head.insertAdjacentElement('afterend',bd);}
  if(d.moves&&window.__tllAlbumShow){var mv=el('div','tll-ex');var btn=el('button','tll-ex-btn ink','▶ My moves');btn.type='button';mv.style.margin='10px 0';mv.appendChild(btn);(head||document.body).insertAdjacentElement('afterend',mv);
    btn.onclick=function(){track('slideshow_play',{show:'my-moves'});window.__tllAlbumShow({key:'moves',name:'My moves',photos:d.moves.map(function(m){return{img:m.img||FLAGS+m.c+'.svg',alt:m.alt||cname(m.c),line:m.line||cname(m.c),sub:[cname(m.c),m.years].filter(Boolean).join(' · '),href:m.href};})},d.name);};}
}).catch(function(){});
  /* Person schema: the home base keeps its country only. */
  [].slice.call(document.querySelectorAll('script[type="application/ld+json"]')).forEach(function(s){try{var j=JSON.parse(s.textContent);if(j&&j.homeLocation&&j.homeLocation.name){var parts=String(j.homeLocation.name).split(',');j.homeLocation.name=parts[parts.length-1].trim();s.textContent=JSON.stringify(j);}}catch(e){}});
}

/* Edit profile */
function editProfile(){var anchor=document.getElementById('tll-alb-set')||document.getElementById('tll-st')||document.getElementById('tll-col');if(!anchor||document.getElementById('tll-ex-set'))return;
  post('/album/settings',{read:true}).then(function(s){if(!s||!s.ok||document.getElementById('tll-ex-set'))return;css();
    var sec=el('section','ep-sec tll-ex tll-ex-set');sec.id='tll-ex-set';sec.appendChild(el('h2','ep-eb','05E · Your moves'));
    sec.appendChild(el('p','ep-lede','For the places you have lived. Everything here is off until you switch it on.'));
    var msg=el('p','tll-ex-small');msg.setAttribute('aria-live','polite');
    function sw(key,label,sub){var l=el('label'),i=el('input');i.type='checkbox';i.checked=s[key]===true;l.appendChild(i);var t=el('span');t.appendChild(el('b','',label));if(sub){t.appendChild(el('br'));t.appendChild(el('small','',sub));}l.appendChild(t);
      i.addEventListener('change',function(){var b={};b[key]=i.checked;i.disabled=true;post('/album/settings',b).then(function(r){i.disabled=false;msg.textContent=r&&r.ok?'Saved.':'That did not save. Try again.';if(!(r&&r.ok))i.checked=!i.checked;});});sec.appendChild(l);}
    sw('showHomeBase','Show my home base on my profile','City and country only. Off: your profile and cards leave it out.');
    sw('coffee','Open to coffee with newcomers','Puts your card in the Living Library on For Expats. No contact details on the card; people reach you through your profile after they sign in.');
    sw('moves','Show "My moves" on my profile','A slide show, one slide per place you have lived, in order.');
    sw('movedBack','I moved back','Adds the Moved back milestone to your profile.');
    if(s.desks&&s.desks.length){sec.appendChild(el('p','tll-ex-k','One line per home, for My moves (optional)'));var lines=Object.assign({},s.moveLines||{}),t0=null;
      s.desks.forEach(function(dk){var l=el('label');l.style.display='block';l.appendChild(el('span','',cname(dk.c)+(dk.years?' · '+dk.years:'')));var i=el('input');i.type='text';i.maxLength=90;i.value=lines[dk.c]||'';i.placeholder='The moving boxes won.';l.appendChild(i);sec.appendChild(l);
        i.addEventListener('input',function(){lines[dk.c]=i.value;clearTimeout(t0);t0=setTimeout(function(){post('/album/settings',{moveLines:lines}).then(function(r){msg.textContent=r&&r.ok?'Saved.':'That did not save.';});},900);});});}
    sec.appendChild(msg);anchor.insertAdjacentElement('afterend',sec);});}

/* The Living Library */
function shuffle(list){var seed;try{seed=sessionStorage.getItem('tll-ll-seed');if(!seed){seed=String(Math.floor(Math.random()*1e9));sessionStorage.setItem('tll-ll-seed',seed);}}catch(e){seed=String(Math.floor(Math.random()*1e9));}
  var x=Number(seed)||1,a=list.slice();for(var i=a.length-1;i>0;i--){x=(x*1103515245+12345)%2147483648;var j=x%(i+1),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function library(books){var signed=!!tok(),wrap=el('div','tll-ex-row');wrap.id='living-library';wrap.appendChild(el('p','tll-ex-k','The Living Library'));wrap.appendChild(el('h3','','People you can borrow for coffee'));
  var det=el('details'),sum=el('summary','','Borrow a book: how it works');det.appendChild(sum);
  [['Every card is a member who moved to this city and said yes to coffee with newcomers. Think of them as a book you can borrow for an hour.'],
   ['Good to ask: how they made their first friend here, which neighborhood felt like home, what they wish they had known in month one.'],
   ['Please do not ask for legal, immigration or tax advice, for their address or workplace, or for favors they did not offer. For rules, use the official sources on our guides.'],
   ['Saying thank you: buy the coffee. Nobody is paid through That Layover Life, so please do not offer money.']].forEach(function(t){det.appendChild(el('p','',t[0]));});
  wrap.appendChild(det);var g=el('div','tll-ex-books');
  shuffle(books).forEach(function(b){var c=el('article','tll-ex-book'),h=el('header');if(b.avatar){var im=el('img');im.src=b.avatar;im.alt='';im.loading='lazy';h.appendChild(im);}var hn=el('div');hn.appendChild(el('b','',b.name));
    var sub=[b.homeCity,b.years?b.years.replace(/now/i,'today'):''].filter(Boolean).join(' · ');if(sub)hn.appendChild(el('small','',sub));h.appendChild(hn);c.appendChild(h);
    if(b.knowsWell.length)c.appendChild(el('p','','Knows well: '+b.knowsWell.join('; ')));if(b.languages.length)c.appendChild(el('small','','Speaks '+b.languages.join(', ')));if(b.interests.length)c.appendChild(el('small','','Into '+b.interests.join(', ')));
    if(b.stories.length){var p=el('p');p.appendChild(document.createTextNode('Wrote: '));b.stories.forEach(function(s,i){var a=el('a','',s.title);a.href='/stories/'+s.slug;p.appendChild(a);if(i<b.stories.length-1)p.appendChild(document.createTextNode(' · '));});c.appendChild(p);}
    var acts=el('div','acts'),go=el('a','tll-ex-btn'+(signed?'':' ghost'),signed?'Get in touch':'Sign in to get in touch');go.href=signed?'/contributors/'+b.slug+'#contact':'/login';go.addEventListener('click',function(){track('living_library_contact',{signed:signed});});acts.appendChild(go);
    var rep=el('a','rep','Report');rep.href='/contact?subject='+encodeURIComponent('Report a Living Library card: '+b.slug);acts.appendChild(rep);c.appendChild(acts);g.appendChild(c);});
  wrap.appendChild(g);return wrap;}

/* For Expats landing */
function landing(){if(document.getElementById('tll-ex-land'))return;Promise.all([get('/series?group=expat'),get('/living-library')]).then(function(v){if(document.getElementById('tll-ex-land'))return;css();
  var series=(v[0]&&v[0].series||[]).filter(function(s){return s.stories.length;}),books=v[1]&&v[1].books||[];
  var sec=el('section','tll-ex tll-ex-sec');sec.id='tll-ex-land';var inn=el('div','tll-ex-in');sec.appendChild(inn);
  if(!EX_PUBLIC)inn.appendChild(el('p','tll-ex-flag','Preview · not live · copy is draft'));
  inn.appendChild(el('p','tll-ex-k','For people who moved abroad'));inn.appendChild(el('h2','','Your homes count too.'));
  inn.appendChild(el('p','tll-ex-lede','For the people who fill their passports and have to get a new one. Mark the places you have lived, keep the move as a story, and find the people who did it before you.'));
  var cta=el('a','tll-ex-btn','Add the places you’ve lived');cta.href='/the-map?mark=lived&utm_source=for-expats&utm_medium=hero&utm_campaign=tll';cta.addEventListener('click',function(){track('signup_start',{from:'for-expats'});});inn.appendChild(cta);
  inn.appendChild(el('p','tll-ex-small','Free. No card. 16+.'));
  var pr=el('div','tll-ex-row');pr.appendChild(el('p','tll-ex-k','The expat group without the comment section'));var pg=el('div','tll-ex-prom');
  var proms=[[series.length?'#tll-ex-series':'/stories','Stories from people who moved','The first friend, the partner who moved too, the move back home, told by the people who lived it.'],
    ['/countries','Pages with their sources','Practical pages link the official source and say when we last checked it.']];
  if(books.length)proms.push(['#living-library','People you can borrow for coffee','Members who said yes to coffee with newcomers. No contact details on cards, no paid places.']);
  proms.forEach(function(p){var a=el('a');a.href=p[0];a.appendChild(el('b','',p[1]));a.appendChild(el('span','',p[2]));pg.appendChild(a);});pr.appendChild(pg);inn.appendChild(pr);
  if(series.length){var sr=el('div');sr.id='tll-ex-series';series.forEach(function(s){var row=el('div','tll-ex-row');row.appendChild(el('h3','',s.name));var r=el('div','tll-ex-rail');
    s.stories.slice(0,12).forEach(function(c){var a=el('a');a.href='/stories/'+c.slug;var im=el(c.image?'img':'div','ph');if(c.image){im.src=c.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(el('span','tll-ex-tape',c.label));a.appendChild(el('b','',c.title));r.appendChild(a);});row.appendChild(r);sr.appendChild(row);});inn.appendChild(sr);}
  if(books.length)inn.appendChild(library(books));
  var pr2=el('div','tll-ex-row');pr2.appendChild(el('p','tll-ex-k','Moving with a pet'));var pa=el('a','tll-ex-btn ghost','The Paw Passport');pa.href='/the-paw-passport?utm_source=for-expats&utm_medium=practical&utm_campaign=paw-passport';
  pa.addEventListener('click',function(){track('practical_click',{division:'paw-passport',to:'the-paw-passport'});});pr2.appendChild(pa);inn.appendChild(pr2);
  var club=el('div','tll-ex-row');var cp=el('p','');cp.appendChild(document.createTextNode('That Layover Life stays free because readers chip in. '));var ca=el('a','','The Layover Club');ca.href='/support#layover-club';ca.addEventListener('click',function(){track('revenue_click',{slot:'layover_club',from:'for-expats'});});cp.appendChild(ca);club.appendChild(cp);inn.appendChild(club);
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.insertBefore(sec,main.firstChild);});}

function run(){var m;
  if((m=/^\/contributors\/([^/]+)$/.exec(P)))profile(m[1]);
  else if(P==='/edit-profile')editProfile();
  else if(P==='/for-expats')landing();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1800);});else setTimeout(run,1800);
if(P==='/edit-profile')setTimeout(run,5200);
})();

/* tll-pet-passport-v1 (31 Oct 2026, pet build: "Pet owners and the Paw Passport"). STAGED: PP_PUBLIC false; shows with
   ?preview=pets (remembered in this browser; ?preview=off clears).
   /pets/<slug>        The Paw Passport: stamps by country (counted, never typed), the firsts strip, the pet's own counter with a
                       flag map, a slide show of photos from stories the pet is tagged in, "Travels with" the owner, Forever
                       traveler (a small paw mark, opt-in by the owner). Private or members-only passports show a short note and
                       noindex instead. LinkedIn share link, no SDK.
   /my-pets            "Passport details" per pet: home city, birthday month, status, who can see it, firsts, the counter.
   /the-paw-passport   The landing in one scroll: hero, value strip, Paw Passports, the three series, the five newest
                       "Pet-friendly or pet-tolerant?" notes, Pet travel pros, rules last checked with official links.
                       The EU guide's Buy button stays hidden until Nancy fills the link and confirms the guide is checked.
   Never where a pet is now. City or country only, after the trip. No vet, medical or legal advice. Events carry division
   paw-passport. No data-ms-* element touched; nav and footer untouched. */
(function(){
var PP_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='pets')localStorage.setItem('tll-preview-pets','1');if(q==='off')localStorage.removeItem('tll-preview-pets');}catch(e){}
var ON=PP_PUBLIC||q==='pets';try{ON=ON||localStorage.getItem('tll-preview-pets')==='1';}catch(e){}if(!ON)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var FLAGS='https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/';
var GUIDE_URL='';/* Nancy: the Ko-fi or Stripe link for the EU pet guide, only once it has been checked against Regulation (EU) 2026/131. */
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var FIRSTS=[['train','First train'],['ferry','First ferry'],['flight','First flight'],['snow','First snow'],['beach','First beach'],['border','First border']];
var CSS='.tll-pp{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-pp [hidden]{display:none!important}'+
'.tll-pp-in{max-width:1120px;margin:0 auto;padding:36px 16px}.tll-pp-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-pp-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 8px}'+
'.tll-pp h2{font:800 clamp(28px,4vw,46px)/1.05 "Playfair Display",Georgia,serif;margin:0 0 12px}.tll-pp h3{font:800 22px/1.15 "Playfair Display",Georgia,serif;margin:0 0 10px}'+
'.tll-pp-sec{border-top:2px solid #0A0B14;padding:20px 0 0;margin:28px 0 0}.tll-pp-chips{display:flex;flex-wrap:wrap;gap:8px}.tll-pp-chip{display:inline-flex;gap:6px;align-items:center;border:1px solid #E0DACE;border-radius:999px;padding:6px 10px;background:#fff}.tll-pp-chip img{width:18px;height:18px}'+
'.tll-pp-firsts{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px}.tll-pp-first{border:1px dashed #C8B9A6;border-radius:6px;padding:10px;background:#FDF9F3}.tll-pp-first b{display:block}.tll-pp-first small{color:#5F5A54}'+
'.tll-pp-count{font:800 44px/1 "Playfair Display",Georgia,serif}.tll-pp-paw{display:inline-flex;gap:6px;align-items:center;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;border:1.5px solid #0A0B14;border-radius:999px;padding:7px 12px;margin:0 0 12px}'+
'.tll-pp-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;border:0;background:#C8325B;color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;margin:6px 8px 0 0}.tll-pp-btn.ink{background:#0A0B14;color:#FDF9F3}.tll-pp-btn.ghost{background:#fff;color:#0A0B14;border:1.5px solid #0A0B14}'+
'.tll-pp-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(200px,1fr);gap:12px;overflow-x:auto;padding:6px 0 10px}.tll-pp-rail a{position:relative;display:block;border:1px solid #E0DACE;border-radius:6px;background:#fff;color:#0A0B14;text-decoration:none;overflow:hidden}'+
'.tll-pp-rail .ph{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:#E0DACE}.tll-pp-rail b{display:block;font:800 18px/1.2 "Playfair Display",Georgia,serif;padding:10px 12px 2px}.tll-pp-rail small{display:block;padding:0 12px 10px;color:#5F5A54}'+
'.tll-pp-tape{position:absolute;top:10px;left:10px;display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 10px/1.3 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;padding:5px 10px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%)}'+
'.tll-pp-notes{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}.tll-pp-note{border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:14px}.tll-pp-note p{margin:0 0 6px}.tll-pp-note small{color:#5F5A54}'+
'.tll-pp-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.tll-pp-strip p{border-top:2px solid #0A0B14;padding:12px 0 0;margin:0;font:800 19px/1.25 "Playfair Display",Georgia,serif}'+
'.tll-pp-lock{max-width:680px;margin:40px auto;padding:24px;border:1px solid #E0DACE;border-radius:6px;background:#fff;text-align:center}'+
'.tll-pp-ed{border:1px solid #E0DACE;border-radius:8px;background:#fff;padding:14px;margin:14px 0}.tll-pp-ed label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#5F5A54;margin:0 0 8px}'+
'.tll-pp-ed input[type=text],.tll-pp-ed input[type=number],.tll-pp-ed select{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;min-height:44px}'+
'.tll-pp-g2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tll-pp-fr{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:6px;align-items:end;margin:0 0 6px}'+
'@media (max-width:760px){.tll-pp-strip{grid-template-columns:1fr}.tll-pp-g2,.tll-pp-fr{grid-template-columns:1fr}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-pet-passport-v1'))return;var s=el('style');s.id='tll-pet-passport-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'paw-passport'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
function a2(name){var n=String(name||'').toLowerCase();try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var x=65;x<91;x++)for(var y=65;y<91;y++){var c=String.fromCharCode(x,y);if(String(dn.of(c)||'').toLowerCase()===n)return c.toLowerCase();}}catch(e){}return'';}
function cname(c){try{return new Intl.DisplayNames(['en'],{type:'region'}).of(String(c).toUpperCase())||c;}catch(e){return c;}}
function noindex(){var m=document.querySelector('meta[name="robots"]');if(!m){m=el('meta');m.name='robots';document.head.appendChild(m);}m.content='noindex, follow';}
function mount(sec){var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.insertBefore(sec,main.firstChild);}

/* The pet's page */
function petPage(slug){get('/pets/public?slug='+encodeURIComponent(slug)+(tok()?'&member=1':'')).then(function(d){if(!d||!d.ok||document.getElementById('tll-pp-page'))return;css();
  if(d.private){noindex();var main=document.querySelector('main')||document.body;[].slice.call(main.children).forEach(function(c){c.hidden=true;});
    var box=el('section','tll-pp tll-pp-lock');box.id='tll-pp-page';box.appendChild(el('h3','',d.membersOnly?'This Paw Passport is for members':'This Paw Passport is private'));
    if(d.membersOnly){var a=el('a','tll-pp-btn','Sign in');a.href='/login';box.appendChild(a);}main.appendChild(box);return;}
  var sec=el('section','tll-pp');sec.id='tll-pp-page';var inn=el('div','tll-pp-in');sec.appendChild(inn);if(!PP_PUBLIC)inn.appendChild(el('p','tll-pp-flag','Preview · not live'));
  if(d.forever)inn.appendChild(el('span','tll-pp-paw','🐾 Forever traveler'));
  inn.appendChild(el('p','tll-pp-k','Paw Passport'+(d.homeCity?' · '+d.homeCity:'')));
  var s1=el('div','tll-pp-sec');s1.appendChild(el('h3','',d.count?d.name+', '+d.count+(d.count===1?' country':' countries'):'Stamps'));
  if(d.countries.length){var ch=el('div','tll-pp-chips');d.countries.forEach(function(n){var c=el('span','tll-pp-chip'),code=a2(n);if(code){var im=el('img');im.src=FLAGS+code+'.svg';im.alt='';c.appendChild(im);}c.appendChild(document.createTextNode(n));ch.appendChild(c);});s1.appendChild(ch);}
  else s1.appendChild(el('p','','The first stamp goes here after the first trip.'));inn.appendChild(s1);
  if(d.firsts.length){var s2=el('div','tll-pp-sec');s2.appendChild(el('h3','','Firsts'));var g=el('div','tll-pp-firsts');d.firsts.forEach(function(f){var c=el('div','tll-pp-first');c.appendChild(el('b','',f.label));var sub=[f.where,f.when].filter(Boolean).join(' · ');if(sub)c.appendChild(el('small','',sub));g.appendChild(c);});s2.appendChild(g);inn.appendChild(s2);}
  if(d.pursuit){var s3=el('div','tll-pp-sec');s3.appendChild(el('p','tll-pp-k',d.pursuit.label));s3.appendChild(el('div','tll-pp-count',String(d.pursuit.count)));
    if(d.pursuit.countries.length){var pc=el('div','tll-pp-chips');d.pursuit.countries.forEach(function(c){var x=el('span','tll-pp-chip'),im=el('img');im.src=FLAGS+c+'.svg';im.alt='';x.appendChild(im);x.appendChild(document.createTextNode(cname(c)));pc.appendChild(x);});s3.appendChild(pc);}inn.appendChild(s3);}
  var photos=[];d.album.forEach(function(c){photos=photos.concat(c.photos);});
  if(photos.length&&window.__tllAlbumShow){var s4=el('div','tll-pp-sec');s4.appendChild(el('h3','','The slide show'));s4.appendChild(el('p','',d.album.map(function(c){return c.name+' · '+c.photos.length;}).join('   ')));
    var b=el('button','tll-pp-btn ink','▶ Play');b.type='button';b.onclick=function(){track('slideshow_play',{show:'pet'});window.__tllAlbumShow({key:'pet',name:d.name,photos:photos},d.name);};s4.appendChild(b);inn.appendChild(s4);}
  if(d.stories.length){var s5=el('div','tll-pp-sec');s5.appendChild(el('h3','','In these stories'));var r=el('div','tll-pp-rail');d.stories.forEach(function(st){var a=el('a');a.href='/stories/'+st.slug;var im=el(st.image?'img':'div','ph');if(st.image){im.src=st.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(el('b','',st.title));r.appendChild(a);});s5.appendChild(r);inn.appendChild(s5);}
  var s6=el('div','tll-pp-sec');var tw=el('p');tw.appendChild(document.createTextNode('Travels with '));var oa=el('a','',d.owner.name);oa.href='/contributors/'+d.owner.slug;tw.appendChild(oa);s6.appendChild(tw);
  var li=el('a','tll-pp-btn ghost','Share on LinkedIn');li.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.origin+location.pathname);li.target='_blank';li.rel='noopener';li.onclick=function(){track('share_click',{channel:'linkedin',page:'pet'});};s6.appendChild(li);inn.appendChild(s6);
  mount(sec);});}

/* The editor on /my-pets */
function editor(){if(document.getElementById('tll-pp-eds'))return;post('/pets/mine').then(function(d){if(!d||!d.ok||!d.pets.length||document.getElementById('tll-pp-eds'))return;css();
  var wrap=el('section','tll-pp');wrap.id='tll-pp-eds';var inn=el('div','tll-pp-in');wrap.appendChild(inn);inn.appendChild(el('p','tll-pp-k','Passport details'));
  d.pets.forEach(function(p){var box=el('div','tll-pp-ed');box.appendChild(el('h3','',p.name));var msg=el('p','');msg.setAttribute('aria-live','polite');msg.style.cssText='font-size:13px;color:#5F5A54';
    function save(b){b.id=p.id;post('/pets/update',b).then(function(r){msg.textContent=r&&r.ok?'Saved.':(r&&r.error)||'That did not save. Try again.';});}
    function fld(label,node){var l=el('label','',label);l.appendChild(node);return l;}
    var g=el('div','tll-pp-g2'),hc=el('input');hc.type='text';hc.maxLength=60;hc.value=p.homeCity;hc.placeholder='Copenhagen';hc.onchange=function(){save({homeCity:hc.value});};g.appendChild(fld('Home city',hc));
    var bm=el('select');bm.appendChild(el('option','','Birthday month (optional)'));MONTHS.forEach(function(m,i){var o=el('option','',m);o.value=String(i+1);if(p.birthdayMonth===i+1)o.selected=true;bm.appendChild(o);});bm.value=p.birthdayMonth?String(p.birthdayMonth):'';bm.onchange=function(){save({birthdayMonth:bm.value||null});};g.appendChild(fld('Birthday month',bm));
    var vs=el('select');[['public','Everyone'],['members','Members only'],['private','Only me']].forEach(function(o){var x=el('option','',o[1]);x.value=o[0];vs.appendChild(x);});vs.value=p.visibility;vs.onchange=function(){save({visibility:vs.value});};g.appendChild(fld('Who can see this passport',vs));
    var st=el('select');[['traveling','Traveling'],['forever','Forever traveler']].forEach(function(o){var x=el('option','',o[1]);x.value=o[0];st.appendChild(x);});st.value=p.status;st.onchange=function(){save({status:st.value});};g.appendChild(fld('Status',st));box.appendChild(g);
    box.appendChild(el('p','','Forever traveler is for a pet who has died. The page stays, with a small paw mark, and we never send birthday reminders.')).style.cssText='font-size:13px;color:#5F5A54';
    box.appendChild(el('p','tll-pp-k','Firsts'));var firsts=(p.firsts||[]).slice(),rows=el('div');
    function draw(){rows.textContent='';FIRSTS.concat([['own','Your own first']]).forEach(function(fk){var cur=firsts.filter(function(f){return f.k===fk[0];})[0]||{k:fk[0],label:fk[0]==='own'?'':fk[1],where:'',when:''};var r=el('div','tll-pp-fr');
      var lab=el('input');lab.type='text';lab.value=fk[0]==='own'?cur.label:fk[1];lab.disabled=fk[0]!=='own';lab.placeholder='First gondola';var wh=el('input');wh.type='text';wh.maxLength=60;wh.value=cur.where;wh.placeholder='City or country';
      var wn=el('input');wn.type='text';wn.maxLength=20;wn.value=cur.when;wn.placeholder='May 2025';r.appendChild(fld(fk[0]==='own'?'Your own first':'',lab));r.appendChild(fld('Where',wh));r.appendChild(fld('When',wn));
      [lab,wh,wn].forEach(function(i){i.onchange=function(){firsts=firsts.filter(function(f){return f.k!==fk[0];});if((fk[0]!=='own'||lab.value.trim())&&(wh.value.trim()||wn.value.trim()))firsts.push({k:fk[0],label:lab.value,where:wh.value,when:wn.value});save({firsts:firsts});};});rows.appendChild(r);});}
    draw();box.appendChild(rows);
    box.appendChild(el('p','tll-pp-k','Their own counter'));var g2=el('div','tll-pp-g2'),pl=el('input');pl.type='text';pl.maxLength=40;pl.value=p.pursuitLabel;pl.placeholder='Beaches sniffed';var pn=el('input');pn.type='number';pn.min='0';pn.value=String(p.pursuitCount||0);
    var pcs=el('input');pcs.type='text';pcs.value=p.pursuitCountries;pcs.placeholder='Country codes, e.g. dk, se, de';g2.appendChild(fld('Counter name',pl));g2.appendChild(fld('Count',pn));box.appendChild(g2);box.appendChild(fld('Where it counted (for the flag map)',pcs));
    pl.onchange=function(){save({pursuitLabel:pl.value});};pn.onchange=function(){save({pursuitCount:Number(pn.value)||0});};pcs.onchange=function(){save({pursuitCountries:pcs.value});};
    var v=el('a','tll-pp-btn ghost','See the passport');v.href='/pets/'+p.slug;box.appendChild(v);box.appendChild(msg);inn.appendChild(box);});
  mount(wrap);});}

/* The landing */
function landing(){if(document.getElementById('tll-pp-land'))return;Promise.all([get('/pets/featured'),get('/series?group=pets'),get('/pets/notes'),get('/pros')]).then(function(v){if(document.getElementById('tll-pp-land'))return;css();
  var pets=v[0]&&v[0].pets||[],series=(v[1]&&v[1].series||[]).filter(function(s){return s.stories.length;}),notes=v[2]&&v[2].notes||[],pros=(v[3]&&v[3].pros||[]).filter(function(p){return p.category==='pet-travel-pros';});
  var sec=el('section','tll-pp');sec.id='tll-pp-land';sec.style.background='#FDF9F3';var inn=el('div','tll-pp-in');sec.appendChild(inn);if(!PP_PUBLIC)inn.appendChild(el('p','tll-pp-flag','Preview · not live · hero line is Nancy’s pick'));
  inn.appendChild(el('p','tll-pp-k','The Paw Passport'));inn.appendChild(el('h2','','Every pet deserves a passport.'));
  var cta=el('a','tll-pp-btn','Start your pet’s passport');cta.href='/my-pets?utm_source=the-paw-passport&utm_medium=hero&utm_campaign=paw-passport';cta.onclick=function(){track('signup_start',{from:'the-paw-passport'});};inn.appendChild(cta);
  var strip=el('div','tll-pp-strip');['For the cat who did not want to go, and went anyway.','For the dog who stayed home and still gets the slide show.','For the train ride where he finally fell asleep.'].forEach(function(t){strip.appendChild(el('p','',t));});var ss=el('div','tll-pp-sec');ss.appendChild(strip);inn.appendChild(ss);
  if(pets.length){var s1=el('div','tll-pp-sec');s1.appendChild(el('h3','','Paw Passports'));var r=el('div','tll-pp-rail');pets.forEach(function(p){var a=el('a');a.href='/pets/'+p.slug;var im=el('img','ph');im.src=p.avatar;im.alt='';im.loading='lazy';a.appendChild(im);a.appendChild(el('b','',p.name+(p.forever?' 🐾':'')));if(p.count)a.appendChild(el('small','',p.count+(p.count===1?' country':' countries')));r.appendChild(a);});s1.appendChild(r);inn.appendChild(s1);}
  series.forEach(function(s){var row=el('div','tll-pp-sec');row.appendChild(el('h3','',s.name));var r=el('div','tll-pp-rail');s.stories.slice(0,12).forEach(function(c){var a=el('a');a.href='/stories/'+c.slug;var im=el(c.image?'img':'div','ph');if(c.image){im.src=c.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(el('span','tll-pp-tape',c.label));a.appendChild(el('b','',c.title));r.appendChild(a);});row.appendChild(r);inn.appendChild(row);});
  if(notes.length){var s3=el('div','tll-pp-sec');s3.appendChild(el('h3','','Pet-friendly or pet-tolerant?'));var g=el('div','tll-pp-notes');notes.forEach(function(n){var b=n.box,c=el('div','tll-pp-note');var top=[b.stayedAt,b.city].filter(Boolean).join(', ');if(top)c.appendChild(el('b','',top));
    if(b.welcoming)c.appendChild(el('p','',b.welcoming));c.appendChild(el('small','',"Writer's experience"+(b.when?', '+b.when:'')));var a=el('a','','Read the story');a.href='/stories/'+n.story;a.style.display='block';c.appendChild(a);g.appendChild(c);});s3.appendChild(g);inn.appendChild(s3);}
  if(pros.length){var s4=el('div','tll-pp-sec');s4.appendChild(el('h3','','Pet travel pros'));var r4=el('div','tll-pp-rail');pros.forEach(function(p){var a=el('a');a.href='/contributors/'+p.slug;if(p.avatar){var im=el('img','ph');im.src=p.avatar;im.alt='';a.appendChild(im);}a.appendChild(el('b','',p.name));if(p.line)a.appendChild(el('small','',p.line));r4.appendChild(a);});s4.appendChild(r4);inn.appendChild(s4);}
  var s5=el('div','tll-pp-sec');s5.appendChild(el('h3','','The rules, from the source'));var rp=el('p');rp.appendChild(document.createTextNode('Rules last checked 31 October 2026: '));
  [['EU pet travel rules (EUR-Lex)','https://eur-lex.europa.eu/eli/reg_del/2026/131/oj'],['DSB, pets on the train','https://www.dsb.dk/find-produkter-og-services/medbringe-din-hund-eller-kaledyr/']].forEach(function(l,i){var a=el('a','',l[0]);a.href=l[1];a.target='_blank';a.rel='noopener';rp.appendChild(a);if(!i)rp.appendChild(document.createTextNode(' · '));});s5.appendChild(rp);
  s5.appendChild(el('p','','We report what the rules say and link them. For your own trip, check with your vet and the operator.'));
  if(GUIDE_URL){var gb=el('a','tll-pp-btn','Buy the EU pet guide');gb.href=GUIDE_URL;gb.target='_blank';gb.rel='noopener';gb.onclick=function(){track('revenue_click',{slot:'eu_pet_guide'});};s5.appendChild(gb);}inn.appendChild(s5);
  mount(sec);});}

function run(){var m;if((m=/^\/pets\/([^/]+)$/.exec(P)))petPage(m[1]);else if(P==='/my-pets')editor();else if(P==='/the-paw-passport')landing();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1500);});else setTimeout(run,1500);
if(P==='/my-pets')setTimeout(run,4500);
})();

/* tll-work-trips-v1 (31 Oct 2026, That Work Trip Life). Reads GET /work-trips and /work-trips/story from the Worker; while those
   routes are not live nothing shows.
   1. Map: when a member adds a work-trip stamp (tll-stamps-v1 sends tll:stamp-added), the country goes on their map as BEEN for
      them, only where it is not logged yet. Nothing is ever downgraded or removed. Same record the map and Quick log write.
   2. Series labels, story boxes and the Trip Kit moved to tll-series-v1 (one layer for every series).
   3. The hub on /pursuits/work-trips. STAGED: HUB_PUBLIC false; shows with ?preview=worktrips (remembered, ?preview=off clears).
      Intro, The Free Evening rail, Plus One Day rail, Conference Cities, the stamps wall (year only, "A work trip" unless the member
      gave permission), road warrior picks, How to join, LinkedIn share. Clicks carry division tll.
   LinkedIn sharing is a plain link to linkedin.com/sharing/share-offsite, no SDK. No data-ms-* element touched. */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var HUB_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='worktrips')localStorage.setItem('tll-preview-worktrips','1');if(q==='off')localStorage.removeItem('tll-preview-worktrips');}catch(e){}
var PREVIEW=q==='worktrips';try{PREVIEW=PREVIEW||localStorage.getItem('tll-preview-worktrips')==='1';}catch(e){}
var N2A={"004":"AF","248":"AX","008":"AL","012":"DZ","016":"AS","020":"AD","024":"AO","660":"AI","010":"AQ","028":"AG","032":"AR","051":"AM","533":"AW","036":"AU","040":"AT","031":"AZ","044":"BS","048":"BH","050":"BD","052":"BB","112":"BY","056":"BE","084":"BZ","204":"BJ","060":"BM","064":"BT","068":"BO","070":"BA","072":"BW","076":"BR","096":"BN","100":"BG","854":"BF","108":"BI","116":"KH","120":"CM","124":"CA","132":"CV","140":"CF","148":"TD","152":"CL","156":"CN","170":"CO","174":"KM","178":"CG","180":"CD","184":"CK","188":"CR","384":"CI","191":"HR","192":"CU","196":"CY","203":"CZ","208":"DK","262":"DJ","212":"DM","214":"DO","218":"EC","818":"EG","222":"SV","226":"GQ","232":"ER","233":"EE","231":"ET","238":"FK","234":"FO","242":"FJ","246":"FI","250":"FR","254":"GF","258":"PF","266":"GA","270":"GM","268":"GE","276":"DE","288":"GH","292":"GI","300":"GR","304":"GL","308":"GD","320":"GT","324":"GN","624":"GW","328":"GY","332":"HT","340":"HN","344":"HK","348":"HU","352":"IS","356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE","376":"IL","380":"IT","388":"JM","392":"JP","400":"JO","398":"KZ","404":"KE","296":"KI","408":"KP","410":"KR","414":"KW","417":"KG","418":"LA","428":"LV","422":"LB","426":"LS","430":"LR","434":"LY","438":"LI","440":"LT","442":"LU","446":"MO","807":"MK","450":"MG","454":"MW","458":"MY","462":"MV","466":"ML","470":"MT","584":"MH","478":"MR","480":"MU","484":"MX","583":"FM","498":"MD","492":"MC","496":"MN","499":"ME","504":"MA","508":"MZ","104":"MM","516":"NA","520":"NR","524":"NP","528":"NL","540":"NC","554":"NZ","558":"NI","562":"NE","566":"NG","570":"NU","578":"NO","512":"OM","586":"PK","585":"PW","275":"PS","591":"PA","598":"PG","600":"PY","604":"PE","608":"PH","616":"PL","620":"PT","630":"PR","634":"QA","638":"RE","642":"RO","643":"RU","646":"RW","659":"KN","662":"LC","670":"VC","882":"WS","674":"SM","678":"ST","682":"SA","686":"SN","688":"RS","690":"SC","694":"SL","702":"SG","703":"SK","705":"SI","090":"SB","706":"SO","710":"ZA","728":"SS","724":"ES","144":"LK","729":"SD","740":"SR","748":"SZ","752":"SE","756":"CH","760":"SY","158":"TW","762":"TJ","834":"TZ","764":"TH","626":"TL","768":"TG","772":"TK","776":"TO","780":"TT","788":"TN","792":"TR","795":"TM","800":"UG","804":"UA","784":"AE","826":"GB","840":"US","858":"UY","860":"UZ","548":"VU","862":"VE","704":"VN","732":"EH","887":"YE","894":"ZM","716":"ZW","531":"CW","798":"TV","652":"BL","535":"BQ","074":"BV","166":"CC","162":"CX","831":"GG","312":"GP","239":"GS","316":"GU","334":"HM","833":"IM","086":"IO","832":"JE","136":"KY","663":"MF","580":"MP","474":"MQ","500":"MS","574":"NF","666":"PM","612":"PN","654":"SH","744":"SJ","534":"SX","796":"TC","260":"TF","581":"UM","336":"VA","092":"VG","850":"VI","876":"WF","175":"YT","900":"XK"};
window.__tllN2A=window.__tllN2A||N2A;
var CSS='.tll-wt-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 11px/1.3 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%);margin:0 0 10px;max-width:100%}'+
'.tll-wt-card-tape{position:absolute;top:10px;left:10px;z-index:3;margin:0;font-size:10px;padding:5px 10px}'+
'.tll-wt{font:400 16px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14;background:#FDF9F3}.tll-wt [hidden]{display:none!important}'+
'.tll-wt-in{max-width:1120px;margin:0 auto;padding:40px 16px}.tll-wt-k{font:600 11px/1.4 "JetBrains Mono",monospace;letter-spacing:2px;text-transform:uppercase;color:#067A79;margin:0 0 10px}'+
'.tll-wt h2{font:800 clamp(28px,4vw,44px)/1.05 "Playfair Display",Georgia,serif;margin:0 0 14px}.tll-wt h3{font:800 24px/1.15 "Playfair Display",Georgia,serif;margin:0 0 12px}'+
'.tll-wt-sec{border-top:2px solid #0A0B14;padding:22px 0 0;margin:34px 0 0}.tll-wt-lede{max-width:62ch;color:#3a3833}'+
'.tll-wt-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);gap:14px;overflow-x:auto;padding:6px 0 10px}'+
'.tll-wt-rail a{position:relative;display:block;border:1px solid #E0DACE;border-radius:6px;background:#fff;color:#0A0B14;text-decoration:none;overflow:hidden}'+
'.tll-wt-rail .tll-wt-ph{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:#E0DACE}.tll-wt-rail b{display:block;font:800 19px/1.2 "Playfair Display",Georgia,serif;padding:12px 12px 4px}.tll-wt-rail small{display:block;padding:0 12px 12px;color:#5F5A54}'+
'.tll-wt-wall{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px}.tll-wt-wall a{border:1px dashed #C8B9A6;border-radius:6px;padding:10px;background:#fff;color:#0A0B14;text-decoration:none}.tll-wt-wall b{display:block}.tll-wt-wall small{color:#5F5A54}'+
'.tll-wt-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;counter-reset:s}.tll-wt-steps div{border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:16px}.tll-wt-steps b{display:block;font:800 20px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-wt-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;background:#C8325B;color:#fff;text-decoration:none;font-weight:600;margin:8px 8px 0 0}.tll-wt-btn.li{background:#0A0B14}'+
'.tll-wt-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 8px}.tll-wt-empty{color:#5F5A54;font-style:italic}'+
'.tll-wt-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 16px}.tll-wt-chips button{min-height:40px;padding:0 14px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-wt-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-wt-box{max-width:680px;margin:28px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-wt-box ol{margin:8px 0 0;padding-left:20px}.tll-wt-box p{margin:0 0 6px}'+
'.tll-wt-kit a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px;margin-right:14px}.tll-wt-kit i{font-style:normal;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#5F5A54;margin-left:4px}'+
'@media (max-width:760px){.tll-wt-steps{grid-template-columns:1fr}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-work-trips-v1'))return;var s=el('style');s.id='tll-work-trips-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tape(text,cls){return el('span','tll-wt-tape'+(cls?' '+cls:''),text);}
function liBtn(url,where){var a=el('a','tll-wt-btn li','Share on LinkedIn');a.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(url);a.target='_blank';a.rel='noopener';a.addEventListener('click',function(){track('linkedin_share',{where:where});});return a;}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}

/* 1. Map */
function a2(name){var n=String(name||'').trim().toLowerCase();if(!n)return'';try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var num in N2A){var c=N2A[num],x=c==='XK'?'kosovo':String(dn.of(c)||'').toLowerCase();if(x===n)return num;}}catch(e){}return'';}
window.addEventListener('tll:stamp-added',function(ev){var d=ev.detail||{};if(!d.workTrip)return;var num=a2(d.country),ms=window.$memberstackDom;if(!num||!ms||!ms.getMemberJSON)return;
  ms.getMemberJSON().then(function(j){var json=(j&&j.data)||{},r=json.tllStates;
    if(!r||r.v!==2||!r.states){try{r=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){r=null;}}
    if(!r||r.v!==2||!r.states)r={v:2,travelers:[{id:'t1',name:'Me',color:'#F0507A',pet:false}],states:{}};
    var me=(r.travelers||[]).filter(function(t){return t&&!t.pet;})[0],id=me?me.id:'t1',e=Object.assign({},r.states[num]||{});
    if(e[id])return;e[id]='visited';r.states[num]=e;var t=Date.now();json.tllStates=r;json.tllStatesAt=t;
    return ms.updateMemberJSON({json:json}).then(function(){try{localStorage.setItem('tllStates',JSON.stringify(r));localStorage.setItem('tllStatesAt',String(t));}catch(e){}
      var m=document.querySelector('#tll-st .tll-st-msg');if(m)m.textContent+=' '+d.country+' is on your map now.';});
  }).catch(function(){});});

/* 3. The hub */
var INTRO_DRAFT='Work sends you somewhere for three days of meetings. This is for the hours around them: the free evening after the last session, and the one day you add on your own time. Written by members once they are home, never during. Nobody names a company, a client or a colleague unless they have permission.';
function hub(d){if(document.getElementById('tll-wt-hub'))return;css();var sec=el('section','tll-wt');sec.id='tll-wt-hub';var inn=el('div','tll-wt-in');sec.appendChild(inn);
  if(!HUB_PUBLIC)inn.appendChild(el('p','tll-wt-flag','Preview · not live'));inn.appendChild(el('p','tll-wt-k','Work trips'));inn.appendChild(el('h2','',(d.hub&&d.hub.name)||'That Work Trip Life'));
  var intro=String(d.hub&&d.hub.intro||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();if(intro)inn.appendChild(el('p','tll-wt-lede',intro));else{inn.appendChild(el('p','tll-wt-lede',INTRO_DRAFT));inn.appendChild(el('p','tll-wt-flag','Draft intro · Nancy to approve or rewrite'));}
  inn.appendChild(liBtn(location.origin+location.pathname,'hub'));
  d.series.forEach(function(s){var b=el('div','tll-wt-sec');b.appendChild(tape(s.name));b.appendChild(el('h3','',s.slug==='the-free-evening'?'A few hours after the last session':'The work trip, plus one day'));
    if(!s.stories.length)b.appendChild(el('p','tll-wt-empty','No stories in this series yet.'));else{var r=el('div','tll-wt-rail');s.stories.slice(0,12).forEach(function(c){var a=el('a');a.href='/stories/'+c.slug;var im=el(c.image?'img':'div','tll-wt-ph');if(c.image){im.src=c.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(tape(c.label,'tll-wt-card-tape'));a.appendChild(el('b','',c.title));if(c.excerpt)a.appendChild(el('small','',c.excerpt.slice(0,120)));r.appendChild(a);});b.appendChild(r);}inn.appendChild(b);});
  var cc=el('div','tll-wt-sec');cc.appendChild(el('h3','','Conference Cities'));cc.appendChild(el('p','tll-wt-empty','Copenhagen first. The guide is a draft until a writer who went fills it in.'));inn.appendChild(cc);
  var w=el('div','tll-wt-sec');w.appendChild(el('h3','','The stamps wall'));var wall=d.wall||{stamps:[]};
  if(!wall.stamps.length)w.appendChild(el('p','tll-wt-empty','No work-trip stamps shown yet.'));else{w.appendChild(el('p','tll-wt-lede',wall.countries+(wall.countries===1?' country':' countries')+' so far, from members who chose to show their work trips.'));var g=el('div','tll-wt-wall');
    wall.stamps.forEach(function(s){var a=el('a');a.href='/contributors/'+s.memberSlug;a.appendChild(el('b','',[s.city,s.country].filter(Boolean).join(', ')));a.appendChild(el('small','',[s.what,s.year,s.member].filter(Boolean).join(' · ')));g.appendChild(a);});w.appendChild(g);}inn.appendChild(w);
  if(d.roadWarriors&&d.roadWarriors.length){var rw=el('div','tll-wt-sec');rw.appendChild(el('h3','','Road warrior picks'));var rg=el('div','tll-wt-wall');d.roadWarriors.forEach(function(p){var a=el('a');a.href='/contributors/'+p.slug;a.appendChild(el('b','',p.name));a.appendChild(el('small','',[p.line,p.employer].filter(Boolean).join(' · ')));rg.appendChild(a);});rw.appendChild(rg);inn.appendChild(rw);}
  var j=el('div','tll-wt-sec');j.appendChild(el('h3','','How to join'));var st=el('div','tll-wt-steps');
  [['Join free','A profile, your map and your stamps. No card.'],['Add a work-trip stamp','Switch on Work trip. Your profile says "A work trip" unless you choose to name the company.'],['Back home? Good. Now tell us.','Write The Free Evening or Plus One Day for the city you just left.']].forEach(function(x){var c=el('div');c.appendChild(el('b','',x[0]));c.appendChild(el('p','',x[1]));st.appendChild(c);});
  j.appendChild(st);var jb=el('a','tll-wt-btn','Join free');jb.href='/signup?utm_source=work-trips&utm_medium=hub&utm_campaign=tll';jb.addEventListener('click',function(){track('work_trips_join');});j.appendChild(jb);
  var sb=el('a','tll-wt-btn li','Write your story');sb.href='/submit?utm_source=work-trips&utm_medium=hub&utm_campaign=tll';j.appendChild(sb);inn.appendChild(j);
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.appendChild(sec);}

function run(){if(P!=='/pursuits/work-trips'||!(HUB_PUBLIC||PREVIEW))return;
  get('/work-trips').then(function(d){if(!d||!d.ok)return;css();hub(d);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
})();

/* tll-ux-v1 (31 Oct 2026, "User flows, UX and design system"). STAGED: UX_PUBLIC false; shows with ?preview=ux (remembered in this
   browser; ?preview=off clears). Goal: every visitor reaches the first stamp on their own map, and every page has a next step.
   Story pages   Hero photo at most 60vh (50vh on phones) so the story's first line shows on a 390x844 screen. "In this story"
                 under the dek for stories over 2,500 words (in the body, not pinned). End block before the share row: the next
                 story, then the join card for visitors ("Start your free map. Free. No card. 16+."). Events story_read_75,
                 next_story_click.
   /account      ?welcome=1 (and a member whose map is still empty): three steps with a progress line. 1 home country (from the
                 browser language, editable), 2 countries been to with Lived / Stayed / Layover, 3 one photo (optional; links to
                 Share photos). Then the passport reveal: stamps press in (scale .95 to 1, 200ms ease-out, 40ms stagger, at most 12
                 animated, none with reduced motion). Saved the same way the map and Quick log save. Event first_stamp.
                 "On this day" (private, only on your own /account): stamps from this month in earlier years.
   Everywhere    signup_start on links to /signup, story_submit_start on the first keystroke in /submit. gtag only, so events
                 follow the site's analytics consent. No data-ms-* element touched; nav and footer untouched. */
(function(){
var UX_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='ux')localStorage.setItem('tll-preview-ux','1');if(q==='off')localStorage.removeItem('tll-preview-ux');}catch(e){}
var ON=UX_PUBLIC||q==='ux';try{ON=ON||localStorage.getItem('tll-preview-ux')==='1';}catch(e){}if(!ON)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var CSS=':root{--ease-out:cubic-bezier(0.23,1,0.32,1)}'+
'.tll-story-hero-img{max-height:60vh!important}@media (max-width:600px){.tll-story-hero-img{max-height:50vh!important}}'+
'.tll-ux{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-ux [hidden]{display:none!important}'+
'.tll-ux-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-ux-toc{max-width:680px;margin:20px auto;padding:14px 16px;border-left:3px solid #067A79;background:#fff}.tll-ux-toc ol{margin:0;padding-left:20px}.tll-ux-toc a{color:#0A0B14}'+
'.tll-ux-end{max-width:680px;margin:32px auto;display:grid;gap:12px}.tll-ux-next{display:flex;gap:14px;align-items:center;border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:12px;color:#0A0B14;text-decoration:none;min-height:44px}'+
'.tll-ux-next img{width:96px;height:72px;object-fit:cover;border-radius:4px;flex:none}.tll-ux-next b{display:block;font:800 20px/1.2 "Playfair Display",Georgia,serif}'+
'.tll-ux-join{border:1px solid #0A0B14;border-radius:6px;padding:16px;background:#FDF9F3}.tll-ux-join b{display:block;font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-ux-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:4px;border:0;background:#C8325B;color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;transition:transform 140ms var(--ease-out)}'+
'.tll-ux-btn:active{transform:scale(.97)}.tll-ux-btn.ghost{background:#fff;color:#0A0B14;border:1.5px solid #0A0B14}.tll-ux-btn[disabled]{opacity:.55;cursor:default}'+
'.tll-ux-wel{position:fixed;inset:0;z-index:9999;background:rgba(10,11,20,.55);display:flex;align-items:flex-end;justify-content:center}'+
'.tll-ux-sheet{width:100%;max-width:560px;max-height:92vh;overflow:auto;background:#FDF9F3;border-radius:12px 12px 0 0;padding:20px 16px 24px}@media (min-width:700px){.tll-ux-wel{align-items:center}.tll-ux-sheet{border-radius:12px}}'+
'.tll-ux-prog{height:4px;background:#E0DACE;border-radius:2px;margin:0 0 6px}.tll-ux-prog i{display:block;height:100%;background:#C8325B;border-radius:2px;transition:width 200ms var(--ease-out)}'+
'.tll-ux-sheet h2{font:800 28px/1.1 "Playfair Display",Georgia,serif;margin:6px 0 12px}.tll-ux-sheet input[type=text],.tll-ux-sheet select{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#fff;min-height:44px}'+
'.tll-ux-rows{display:grid;gap:6px;margin:10px 0;max-height:40vh;overflow:auto}.tll-ux-row{display:flex;align-items:center;gap:8px;justify-content:space-between;border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:6px 8px}'+
'.tll-ux-chips{display:flex;gap:4px}.tll-ux-chips button{min-height:36px;min-width:44px;padding:0 8px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;cursor:pointer}.tll-ux-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-ux-acts{display:flex;justify-content:space-between;gap:8px;margin-top:14px}'+
'.tll-ux-stamps{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.tll-ux-stamp{font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:2px solid #C8325B;color:#C8325B;border-radius:6px;padding:10px;transform:rotate(-2deg)}'+
'.tll-ux-press{animation:tllPress 200ms var(--ease-out) both}@keyframes tllPress{from{transform:scale(.95) rotate(-2deg);opacity:0}to{transform:scale(1) rotate(-2deg);opacity:1}}'+
'.tll-ux-otd{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-ux-v1'))return;var s=el('style');s.id='tll-ux-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
css();

/* Events everywhere */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';if(/^\/signup\b/.test(h))track('signup_start',{from:P});},true);
if(P==='/submit'){var started=false;document.addEventListener('input',function(){if(started)return;started=true;track('story_submit_start');},true);}

/* Story pages */
function story(){var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];if(!body||document.getElementById('tll-ux-end'))return;
  var words=(body.textContent||'').trim().split(/\s+/).length,heads=[].slice.call(body.querySelectorAll('h2,h3'));
  if(words>2500&&heads.length>=2&&!document.getElementById('tll-ux-toc')){var t=el('nav','tll-ux tll-ux-toc');t.id='tll-ux-toc';t.setAttribute('aria-label','In this story');t.appendChild(el('p','tll-ux-k','In this story'));var ol=el('ol');
    heads.forEach(function(h,i){if(!h.id)h.id='s-'+(i+1)+'-'+h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40);var li=el('li'),a=el('a','',h.textContent.trim());a.href='#'+h.id;li.appendChild(a);ol.appendChild(li);});t.appendChild(ol);body.insertBefore(t,body.firstChild);}
  var sent=false;window.addEventListener('scroll',function(){if(sent)return;var r=body.getBoundingClientRect();if(r.height>0&&(innerHeight-r.top)/r.height>=0.75){sent=true;track('story_read_75',{story:P.split('/')[2]});}},{passive:true});
  var here=P.split('/')[2],links=[].slice.call(document.querySelectorAll('main a[href^="/stories/"]')).filter(function(a){var s=(a.getAttribute('href').split('/')[2]||'').replace(/[?#].*$/,'');return s&&s!==here&&!a.closest('nav,header,footer,.tll-ux-end');});
  var nx=links.filter(function(a){return a.querySelector('img');})[0]||links[0],end=el('div','tll-ux tll-ux-end');end.id='tll-ux-end';
  if(nx){var card=el('a','tll-ux-next');card.href=nx.getAttribute('href');var im=nx.querySelector('img');if(im){var i2=el('img');i2.src=im.currentSrc||im.src;i2.alt='';i2.loading='lazy';card.appendChild(i2);}var tx=el('div');tx.appendChild(el('span','tll-ux-k','Next story'));
    var title=(nx.querySelector('h2,h3,h4,b,strong')||nx).textContent.trim().split('\n')[0].slice(0,120);tx.appendChild(el('b','',title||'Keep reading'));card.appendChild(tx);card.addEventListener('click',function(){track('next_story_click',{from:here});});end.appendChild(card);}
  if(!tok()){var j=el('div','tll-ux-join');j.appendChild(el('b','','Start your free map.'));j.appendChild(el('p','','Free. No card. 16+.'));var ja=el('a','tll-ux-btn','Join free');ja.href='/signup?utm_source=story&utm_medium=end&utm_campaign=tll';j.appendChild(ja);end.appendChild(j);}
  if(!end.children.length)return;var share=document.querySelector('.tll-story-share-row');if(share)share.parentNode.insertBefore(end,share);else body.insertAdjacentElement('afterend',end);}

/* Welcome: first stamp in under two minutes */
function readStates(j){var r=j&&j.tllStates;if(!r||r.v!==2||!r.states){try{r=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){r=null;}}if(!r||r.v!==2||!r.states)r={v:2,travelers:[{id:'t1',name:'Me',color:'#F0507A',pet:false}],states:{}};return r;}
function names(){var out=[];try{var dn=new Intl.DisplayNames(['en'],{type:'region'}),N=window.__tllN2A||{};Object.keys(N).forEach(function(num){var a=N[num],n=a==='XK'?'Kosovo':dn.of(a);if(n&&n!==a)out.push({num:num,a2:a,name:n});});}catch(e){}return out.sort(function(a,b){return a.name.localeCompare(b.name);});}
function welcome(force){var ms=window.$memberstackDom;if(!ms||!ms.getMemberJSON||document.getElementById('tll-ux-wel'))return;
  ms.getMemberJSON().then(function(j){var json=(j&&j.data)||{},rec=readStates(json);if(!force&&Object.keys(rec.states).length)return;if(json.tllWelcomed&&!force)return;
    var all=names();if(!all.length)return;var me=(rec.travelers.filter(function(t){return !t.pet;})[0]||{id:'t1'}).id,picks={},home='';
    var reg=(navigator.language||'').split('-')[1];if(reg){var hit=all.filter(function(c){return c.a2===reg.toUpperCase();})[0];if(hit){home=hit.num;picks[hit.num]='lived';}}
    var wrap=el('div','tll-ux tll-ux-wel');wrap.id='tll-ux-wel';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-labelledby','tll-ux-wel-h');var sh=el('div','tll-ux-sheet');wrap.appendChild(sh);document.body.appendChild(wrap);
    var step=1;function frame(n,title){sh.textContent='';var pr=el('div','tll-ux-prog'),bar=el('i');bar.style.width=(n*100/3)+'%';pr.appendChild(bar);sh.appendChild(pr);sh.appendChild(el('p','tll-ux-k',n+' of 3'));var h=el('h2','',title);h.id='tll-ux-wel-h';sh.appendChild(h);}
    function acts(back,next,label,skip){var a=el('div','tll-ux-acts');if(back){var b=el('button','tll-ux-btn ghost','Back');b.type='button';b.onclick=back;a.appendChild(b);}else a.appendChild(el('span'));
      var nx=el('button','tll-ux-btn',label||'Next');nx.type='button';nx.onclick=next;a.appendChild(nx);if(skip){var s=el('button','tll-ux-btn ghost','Skip');s.type='button';s.onclick=skip;a.insertBefore(s,nx);}sh.appendChild(a);return nx;}
    function s1(){frame(1,'Where is home?');var sel=el('select');sel.setAttribute('aria-label','Home country');sel.appendChild(el('option','','Pick a country'));all.forEach(function(c){var o=el('option','',c.name);o.value=c.num;sel.appendChild(o);});sel.value=home;sh.appendChild(sel);
      sh.appendChild(el('p','','The country you call home. You can change it later.')).style.cssText='font-size:13px;color:#5F5A54';
      acts(null,function(){if(home&&picks[home]==='lived'&&sel.value!==home)delete picks[home];home=sel.value;if(home)picks[home]='lived';s2();});}
    function s2(){frame(2,'Where have you been?');var find=el('input');find.type='text';find.placeholder='Type a country';find.setAttribute('aria-label','Find a country');sh.appendChild(find);var rows=el('div','tll-ux-rows');sh.appendChild(rows);
      function draw(){rows.textContent='';var f=find.value.trim().toLowerCase();all.filter(function(c){return f?c.name.toLowerCase().indexOf(f)>-1:picks[c.num];}).slice(0,40).forEach(function(c){var r=el('div','tll-ux-row');r.appendChild(el('span','',c.name));var ch=el('div','tll-ux-chips');
        [['lived','LIVED'],['visited','STAYED'],['layover','LAYOVER']].forEach(function(m){var b=el('button','',m[1]);b.type='button';b.setAttribute('aria-pressed',String(picks[c.num]===m[0]));b.onclick=function(){if(picks[c.num]===m[0])delete picks[c.num];else picks[c.num]=m[0];draw();};ch.appendChild(b);});r.appendChild(ch);rows.appendChild(r);});
        if(!rows.children.length)rows.appendChild(el('p','','Type a country, then tap Lived, Stayed or Layover.'));}
      find.oninput=draw;draw();setTimeout(function(){find.focus();},50);acts(s1,function(){save().then(s3);},'Save my map');}
    function save(){var e=rec.states;Object.keys(picks).forEach(function(num){var x=Object.assign({},e[num]||{});if(!x[me])x[me]=picks[num];e[num]=x;});var t=Date.now();json.tllStates=rec;json.tllStatesAt=t;json.tllWelcomed=t;
      return ms.updateMemberJSON({json:json}).then(function(){try{localStorage.setItem('tllStates',JSON.stringify(rec));localStorage.setItem('tllStatesAt',String(t));}catch(e){}if(Object.keys(picks).length)track('first_stamp',{count:Object.keys(picks).length});}).catch(function(){});}
    function s3(){frame(3,'One photo for your first album page');sh.appendChild(el('p','','Optional. Pick one you took yourself; we take the location out before it uploads.'));var a=el('a','tll-ux-btn ghost','Add a photo');a.href='/share-photos?utm_source=welcome';sh.appendChild(a);
      acts(null,ask,'Next',ask);}
    /* Optional, one tap, multi-select: "How do you travel most?" Saved privately to the member's travel-style field, to a GA4 user
       property only after analytics consent, and counted monthly for Nancy. Never shown publicly. */
    function ask(){sh.textContent='';sh.appendChild(el('p','tll-ux-k','One more, optional'));var h=el('h2','','How do you travel most?');h.id='tll-ux-wel-h';sh.appendChild(h);
      var opts=[['big-trips','A few big trips a year'],['short-trips','Lots of short trips and layovers'],['abroad','I live abroad (or did)'],['work','For work'],['pet','With my pet'],['pursuit','For a pursuit (running, hiking, food, more)']],picked={};
      var box=el('div','tll-ux-chips');box.style.cssText='flex-wrap:wrap;gap:8px;margin:10px 0';box.setAttribute('role','group');box.setAttribute('aria-label','How do you travel most? Pick any');
      opts.forEach(function(o){var b=el('button','',o[1]);b.type='button';b.style.cssText='min-height:44px;font:600 14px/1.2 "IBM Plex Sans Condensed",sans-serif;letter-spacing:0;padding:0 14px';b.setAttribute('aria-pressed','false');
        b.onclick=function(){picked[o[0]]=!picked[o[0]];b.setAttribute('aria-pressed',String(!!picked[o[0]]));};box.appendChild(b);});sh.appendChild(box);
      sh.appendChild(el('p','','Pick any. Only we see this; it helps us make TLL for people like you.')).style.cssText='font-size:13px;color:#5F5A54';
      acts(null,function(){var list=Object.keys(picked).filter(function(k){return picked[k];});if(list.length){
          try{if(ms.updateMember)ms.updateMember({customFields:{'travel-style':list.join(',')}}).catch(function(){});}catch(e){}
          post('/travel-style',{styles:list});try{if(window.__tllConsent&&__tllConsent.analytics&&window.gtag)gtag('set','user_properties',{travel_style:list.join(',')});}catch(e){}
          track('travel_style_answer',{count:list.length});}reveal();},'Show my passport',reveal);}
    function reveal(){sh.textContent='';sh.appendChild(el('p','tll-ux-k','Your passport'));var h=el('h2','','Stamped.');h.id='tll-ux-wel-h';sh.appendChild(h);var box=el('div','tll-ux-stamps');var codes=Object.keys(picks);
      codes.forEach(function(num,i){var c=all.filter(function(x){return x.num===num;})[0];if(!c)return;var s=el('span','tll-ux-stamp',c.name+' · '+(picks[num]==='lived'?'Lived':picks[num]==='visited'?'Stayed':'Layover'));if(!RM&&i<12){s.classList.add('tll-ux-press');s.style.animationDelay=(i*40)+'ms';}box.appendChild(s);});
      sh.appendChild(box);if(!codes.length)sh.appendChild(el('p','','Your first stamp goes here. The map is one tap away.'));var a=el('a','tll-ux-btn','See my map');a.href='/the-map';sh.appendChild(a);var c=el('button','tll-ux-btn ghost','Close');c.type='button';c.style.marginLeft='8px';c.onclick=function(){wrap.remove();};sh.appendChild(c);}
    document.addEventListener('keydown',function k(e){if(e.key==='Escape'&&document.getElementById('tll-ux-wel')){wrap.remove();document.removeEventListener('keydown',k);}});
    s1();if(force)track('signup_complete');}).catch(function(){});}

/* On this day, private to the member on /account */
function onThisDay(){if(document.getElementById('tll-ux-otd'))return;post('/stamps/mine').then(function(d){if(!d||!d.ok)return;var now=new Date(),m=now.getMonth()+1,y=now.getFullYear();
  var hits=(d.stamps||[]).filter(function(s){return s.month===m&&s.year&&s.year<y;});if(!hits.length||document.getElementById('tll-ux-otd'))return;
  var box=el('section','tll-ux tll-ux-otd');box.id='tll-ux-otd';box.appendChild(el('p','tll-ux-k','On this day · only you see this'));
  hits.slice(0,3).forEach(function(s){var n=y-s.year;box.appendChild(el('p','',(n===1?'A year ago':n+' years ago')+' this month: '+s.what+', '+[s.city,s.country].filter(Boolean).join(', ')+'.'));});
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);});}

/* /submit: what a story is, above the form (31 Oct, Nancy: "we need to be clearer about what a travel story looks like"). Draft copy
   in docs/what-a-story-is-2026-10-31.md; shows in the ux preview until she approves. A gentle hint, never a block, when a headline
   reads like a guide. */
function whatAStoryIs(){if(document.getElementById('tll-ux-what'))return;var f=document.querySelector('main form')||document.querySelector('form');if(!f)return;
  var b=el('section','tll-ux');b.id='tll-ux-what';b.style.cssText='max-width:680px;margin:0 auto 28px;padding:18px 20px;border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff';
  b.appendChild(el('p','tll-ux-k','What a story looks like here'));var h=el('h2','','You went. Something happened. You tell it.');h.style.cssText='font:800 24px/1.15 "Playfair Display",Georgia,serif;margin:0 0 10px';b.appendChild(h);
  var ul=el('ul');ul.style.cssText='margin:0 0 10px;padding-left:18px;display:grid;gap:4px';
  [['One trip, first person.','A weekend, a layover, a year abroad. Not "Thailand" but "the night bus to Chiang Mai."'],['You were there.','Your photos, your dates, your mistakes. No stock photos, no press kits, no "top ten".'],['A place and a time.','City or country, month and year. After the trip, never during.'],['The bit that went sideways.','The missed ferry, the wrong hostel, the kindness you did not expect. That is the story.'],['In your words.','We fix typos. AI writes nothing here, and anything AI made is labeled.']]
  .forEach(function(x){var li=el('li');li.appendChild(el('b','',x[0]+' '));li.appendChild(document.createTextNode(x[1]));ul.appendChild(li);});b.appendChild(ul);
  b.appendChild(el('p','','Not sure? Ask: could only you have written it? Then it belongs here.'));
  var s=el('p','','What we send back: guides, roundups, "best of" lists, hotel or product reviews, anything written to sell something. We will tell you why, kindly, and point you to where it fits.');s.style.cssText='font-size:13px;color:#5F5A54;margin:6px 0 0';b.appendChild(s);
  f.parentNode.insertBefore(b,f);
  var title=f.querySelector('input[name*="title" i],input[name*="headline" i],input[id*="title" i]');if(title){var hint=el('p','');hint.style.cssText='font-size:13px;color:#5F5A54;margin:4px 0 0';hint.hidden=true;hint.textContent='Sounds like a guide. Stories here are one trip, told by the person who took it. Keep going if that is what this is.';title.insertAdjacentElement('afterend',hint);
    title.addEventListener('input',function(){hint.hidden=!/\b(best|top \d|top ten|guide|destination|luxury|ultimate)\b/i.test(title.value);});}}
function run(){if(P==='/submit')whatAStoryIs();if(/^\/stories\/[^/]+$/.test(P))story();else if(P==='/account'){var w=new URLSearchParams(location.search).get('welcome')==='1';setTimeout(function(){welcome(w);},w?0:1500);onThisDay();}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1400);});else setTimeout(run,1400);
})();

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
/* Phase 0 (31 Oct): the ad script loads only after ad consent from the one consent tool (tll-consent-v3 in the site head). */
function consented(cb){var C=window.__tllConsent;if(C&&C.ready){if(C.ads)cb();return;}window.addEventListener('tll:consent',function h(e){if(e.detail&&e.detail.ads){window.removeEventListener('tll:consent',h);cb();}});}
function run(){css();consented(script);if(/^\/stories\/[^/]+$/.test(P))story();else if(P==='/stories')library();else if(/^\/countries\//.test(P))country();}
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
var CS=document.createElement('style');CS.id='tll-mag-cover-v1';CS.textContent="/* The magazine cover (26 Oct 2026, direction A, Nancy: \"I prefer the full page image hero\"). Home page only. Restyles the existing\n   [data-h3-hero] block: the cover story's photo full bleed, a chip with the writer's face (\"Photo: {Name}, {Place}\"; Phase 0, 31 Oct: \"went to\" read like a live check-in), the kicker,\n   the site's own headline in Newsreader, the deck, a button to the cover story and a Join free button (29 Oct), the photo credit with coordinates, and the stamp,\n   which lands once on load. No element removed: the eyebrow, the FREE line and the old coordinates are hidden.\n   Loads after the page's own styles and after tll-home-hero-phone-v1, so it wins the cascade with the same specificity. */\nbody:not(.tll-none) [data-h3-hero]{position:relative !important;min-height:max(calc(100svh - 96px),640px) !important;display:flex !important;flex-direction:column !important;justify-content:flex-end !important;margin:0 !important;padding:0 !important;border:0 !important;border-radius:0 !important;overflow:hidden !important;background:#0A0B14 !important;--tll-cover-pos:var(--tll-cover-pos-phone,50% 50%)}\nbody:not(.tll-none) [data-h3-hero] > img[data-tll-parallax=\"hero\"]{position:absolute !important;inset:0 !important;top:calc(-1 * var(--tll-cover-zoom,0%)) !important;bottom:auto !important;width:100% !important;height:calc(100% + var(--tll-cover-zoom,0%)) !important;max-width:none !important;object-fit:cover !important;object-position:var(--tll-cover-pos) !important;border-radius:0 !important;transform:none !important;opacity:1 !important;filter:none !important}\nbody:not(.tll-none) [data-h3-hero]::after{content:\"\" !important;position:absolute !important;inset:0 !important;z-index:1 !important;pointer-events:none !important;background:linear-gradient(180deg,rgba(10,11,20,.32) 0%,rgba(10,11,20,0) 20%,rgba(10,11,20,0) 46%,rgba(10,11,20,.42) 66%,rgba(10,11,20,.84) 100%) !important}\nbody:not(.tll-none) [data-h3-hero] > div:has(> h1){position:relative !important;z-index:2 !important;width:100% !important;max-width:none !important;margin:0 !important;padding:0 16px max(clamp(40px,8vh,80px),76px) !important;box-sizing:border-box !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-eyebrow{display:none !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip{display:inline-flex !important;align-items:center;gap:10px;padding:6px 14px 6px 6px;min-height:48px;border-radius:999px;background:rgba(10,11,20,.6);color:#F7F1E8 !important;text-decoration:none !important;font:400 13px/1.2 'Inter Tight',system-ui,sans-serif;margin:0 0 18px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);max-width:100%}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip img{width:36px;height:36px;border-radius:50%;object-fit:cover;flex:0 0 36px;position:static;box-shadow:0 0 0 1.5px #F0507A}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip b{display:block;font-weight:500;font-size:15px}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip:hover b,body:not(.tll-none) [data-h3-hero] .tll-mg-chip:focus-visible b{text-decoration:underline;text-decoration-color:#F0507A;text-underline-offset:3px}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-chip:focus-visible{outline:3px solid #F0507A;outline-offset:2px}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-kicker{display:block !important;font:500 13px/1.3 'Inter Tight',system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#F7F1E8;opacity:.85;margin:0 0 12px}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title){font-family:'Newsreader',Georgia,serif !important;font-weight:500 !important;font-size:clamp(46px,12vw,64px) !important;line-height:.95 !important;letter-spacing:-.02em !important;max-width:12ch !important;margin:0 !important;padding:0 !important;color:#F7F1E8 !important;text-wrap:balance}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) em{font-style:italic;color:inherit}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p{font-family:'Inter Tight',system-ui,sans-serif !important;font-size:19px !important;line-height:1.45 !important;max-width:36ch !important;margin:16px 0 0 !important;color:#E8E2D8 !important;text-wrap:pretty}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta{display:flex !important;flex-direction:column !important;gap:12px !important;margin:24px 0 0 !important;position:relative;z-index:3}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn{flex:none !important;width:100% !important;min-height:48px !important;box-sizing:border-box !important;justify-content:center !important;border-radius:0 !important;font:600 16px/1 'Inter Tight',system-ui,sans-serif !important;letter-spacing:0 !important;background:#D63859 !important;color:#fff !important;border-color:transparent !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn:hover{background:#B82C4B !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn:focus-visible{outline:3px solid #F7F1E8 !important;outline-offset:2px}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn.tll-mg-join{background:transparent !important;color:#F7F1E8 !important;border:1.5px solid #F7F1E8 !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn.tll-mg-join:hover{background:#F7F1E8 !important;color:#0D0F1A !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn + .h3-btn:not(.tll-mg-join){display:none !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-free{display:none !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-coords,body:not(.tll-none) [data-h3-hero] > div:has(> .h3-hero-coords){display:none !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-by{position:relative;z-index:2;margin:14px 0 0 !important;font:400 13px/1.5 'Inter Tight',system-ui,sans-serif;color:#B9B3A8}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-by b{color:#F7F1E8;font-weight:500}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-stamp{position:absolute !important;right:16px !important;left:auto !important;top:20px !important;bottom:auto !important;width:96px;z-index:2;color:#F7F1E8;opacity:.95;transform-origin:50% 50%;animation:tllMgLand 420ms cubic-bezier(.2,.9,.3,1.2) 250ms both;pointer-events:none}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-stamp svg{display:block;width:100%;height:auto}\n@keyframes tllMgLand{from{opacity:0;transform:scale(1.6) rotate(-14deg)}to{opacity:.95;transform:none}}\n@media(prefers-reduced-motion:reduce){body:not(.tll-none) [data-h3-hero] .tll-mg-stamp{animation:none}}\n@media(min-width:768px){\nbody:not(.tll-none) [data-h3-hero]{min-height:min(88vh,860px) !important;--tll-cover-pos:var(--tll-cover-pos-desk,50% 50%);--tll-cover-zoom:0%}\nbody:not(.tll-none) [data-h3-hero]::after{background:linear-gradient(90deg,rgba(10,11,20,.55) 0%,rgba(10,11,20,.36) 34%,rgba(10,11,20,.08) 62%,rgba(10,11,20,0) 78%),linear-gradient(180deg,rgba(10,11,20,.3) 0%,rgba(10,11,20,0) 18%,rgba(10,11,20,0) 64%,rgba(10,11,20,.34) 100%) !important}\nbody:not(.tll-none) [data-h3-hero] > img[data-tll-parallax=\"hero\"]{filter:brightness(1.14) saturate(1.06)}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title),body:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p,body:not(.tll-none) [data-h3-hero] .tll-mg-kicker{text-shadow:0 1px 2px rgba(10,11,20,.35),0 2px 24px rgba(10,11,20,.45)}\nbody:not(.tll-none) [data-h3-hero] > div:has(> h1){max-width:1240px !important;margin:0 auto !important;padding:0 var(--h3-g,48px) 56px !important}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title){font-size:clamp(56px,6vw,96px) !important}\nbody:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p{font-size:20px !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta{flex-direction:row !important}\nbody:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn{width:auto !important;min-width:240px;padding:0 28px !important}\nbody:not(.tll-none) [data-h3-hero] .tll-mg-stamp{width:150px;right:var(--h3-g,48px);top:32px}\n}\n\n/* The magazine type on the rest of the home page (26 Oct 2026, direction A: Newsreader for display, Inter Tight for text, the\n   monospace only inside the stamp). The h3 sections read their faces from three variables, so one override switches them all;\n   the weights come down from Playfair's 800 to Newsreader's 500 and the tracking on the small caps comes in. */\n:root{--h3-head:'Newsreader',Georgia,serif;--h3-body:'Inter Tight',system-ui,sans-serif;--h3-mono:'Inter Tight',system-ui,sans-serif}\n.h3 [class*=\"h3-title\"]{font-weight:500 !important;letter-spacing:-.02em !important}\n.h3-card-title{font-weight:500 !important;letter-spacing:-.01em !important;font-size:clamp(22px,1.9vw,30px) !important;line-height:1.1 !important}\n.h3-ey,.h3-card-meta,.h3-card-tag,.h3-shelf-note,.h3-hero-free{font-weight:500 !important;letter-spacing:.08em !important}\n.h3-ey{font-size:13px !important}\n.h3-card-meta,.h3-card-tag{font-size:12px !important}\n.h3-card-by small{font-weight:500 !important;letter-spacing:.08em !important}\n.h3-lede{font-size:clamp(17px,1.4vw,20px) !important;line-height:1.5 !important}\n.h3-btn{font-weight:600 !important;letter-spacing:0 !important}\n\n/* The people who went (26 Oct 2026, from the approved cover prototype): the contributors' faces and one action tile (29 Oct, Nancy agreed: no open seats, stories first), placed before the\n   \"You went. Write it down.\" chapter. Built by the script below; links to the contributor pages and to /travelers. */\n.tll-mg-people .tll-mg-sechead{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:0 0 28px}\n.tll-mg-people .tll-mg-sechead h2{margin:0 !important}\n.tll-mg-people .tll-mg-all{font:500 15px/1.3 'Inter Tight',system-ui,sans-serif;color:#0A0B14 !important;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:4px;min-height:44px;display:inline-flex;align-items:center}\n.tll-mg-faces{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:24px 20px}\n.tll-mg-faces a{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-decoration:none !important;color:#0A0B14 !important;min-height:44px;padding:4px 0}\n.tll-mg-faces img,.tll-mg-faces i{width:72px;height:72px;border-radius:50%;object-fit:cover;margin-bottom:8px;flex:0 0 72px}\n.tll-mg-faces img{box-shadow:0 0 0 1.5px #C8325B}\n.tll-mg-faces i{display:flex;align-items:center;justify-content:center;border:1.5px dashed #C8325B;color:#C8325B;font-style:normal;font-size:28px;box-sizing:border-box}\n.tll-mg-faces b{font:500 16px/1.25 'Inter Tight',system-ui,sans-serif;color:#0A0B14}\n.tll-mg-faces span{font:400 14px/1.4 'Inter Tight',system-ui,sans-serif;color:#6B6660}\n.tll-mg-faces .tll-mg-open b{color:#C8325B}\n.tll-mg-faces a:hover b,.tll-mg-faces a:focus-visible b{text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:3px}\n.tll-mg-faces a:focus-visible{outline:3px solid #C8325B;outline-offset:2px;border-radius:4px}\n@media(min-width:768px){.tll-mg-faces{grid-template-columns:repeat(4,1fr);gap:32px}}\n\n/* Stamps on the library cards and on the letter (26 Oct build list: \"stamp on cards\"). Each card carries data-loc and data-date, so\n   the stamp is drawn from them; the letter's stamp reads SUNDAY. Decorative, aria-hidden, no pointer events. */\n.h3-card-ph .tll-mg-card-stamp{position:absolute;right:10px;top:10px;width:58px;color:#0A0B14;background:rgba(247,241,232,.82);border-radius:50%;z-index:2;pointer-events:none;transform:rotate(-6deg)}\n.h3-card-ph .tll-mg-card-stamp svg{display:block;width:100%;height:auto}\n@media(min-width:768px){.h3-card-ph .tll-mg-card-stamp{width:68px;right:12px;top:12px}}\nsection[data-h3=\"news\"]{position:relative}\nsection[data-h3=\"news\"] .tll-mg-letter-stamp{position:absolute;right:16px;top:16px;width:84px;color:#0A0B14;opacity:.9;z-index:2;pointer-events:none}\nsection[data-h3=\"news\"] .tll-mg-letter-stamp svg{display:block;width:100%;height:auto}\n@media(min-width:768px){section[data-h3=\"news\"] .tll-mg-letter-stamp{width:120px;right:var(--h3-g,48px);top:32px}}\n";(document.head||document.documentElement).appendChild(CS);
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
  chip.innerHTML='<img src="'+esc(COVER.avatar)+'" alt="" width="36" height="36"><span><b>Photo: '+esc(COVER.author)+'</b>'+esc(COVER.place)+'</span>';
  var kick=document.createElement('div');kick.className='tll-mg-kicker';kick.textContent=COVER.kicker||"This week's cover";
  words.insertBefore(chip,h1);words.insertBefore(kick,h1);
  var dek=h1.nextElementSibling;if(dek&&dek.tagName==='P'&&COVER.dek)dek.textContent=COVER.dek;
  var cta=hero.querySelector('.h3-hero-cta'),btn=cta&&cta.querySelector('a');
  if(btn){btn.textContent=COVER.button||'Read the cover story';btn.href='/stories/'+COVER.slug;}
  /* 29 Oct 2026, Nancy: the hero said free to join but gave no way to join. The second button (hidden until now) becomes Join free. */
  var join=cta&&cta.querySelectorAll('a')[1];if(join&&COVER.join){join.textContent=COVER.join;join.href='/signup';join.classList.add('tll-mg-join');}
  var by=document.createElement('p');by.className='tll-mg-by';var b=document.createElement('b');b.textContent='Photo';by.appendChild(b);
  /* Phase 0 (Nancy, 31 Oct: remove the coordinates; they were precise to about 1 km). */
  by.appendChild(document.createTextNode(' '+COVER.author+' · '+COVER.place));
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
