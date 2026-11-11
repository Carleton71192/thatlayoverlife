/* tll-site-layers-v16: the core of the site layers, one registered site-wide header script. Built by src/site-layers/build-site-layers-v16.py.
   In order: consent fallback, chunk loader, 11 styles, then
   core   src/site-layers/tll-img-variants-v1.js (10 Nov week one item 4: CMS photos get a srcset from their site-bucket twin variants, the story hero loads first)
   core   src/components/member-bar/tll-account-hash-tabs-v1.js (member bar SETTINGS and CONTRIBUTIONS open their /account tab)
   core   src/site-layers/tll-note-typing-v1.js (note button steps aside while typing)
   core   src/site-layers/tll-ux-1028-v1.js (28 Oct UX review: type floor, success message contrast, Tell the editor clear of the home hero)
   core   src/site-layers/tll-page-heroes-v1.js (29 Oct: story photos on /stories, /travelers, /the-map, /about and /for-expats, credited and linked)
   core   src/site-layers/tll-home-bands-v1.js (29 Oct Nancy: home photo bands use members story photos at full size, credited and linked)
   core   src/site-layers/tll-lounge-labels-v1.js (29 Oct Nancy: /gallery tile labels small, in the corner, off the photo)
   core   src/site-layers/tll-stories-noimg-v1.js (29 Oct Nancy: /stories card without a photo shows a plain panel; the lead goes to the newest story with a photo)
   core   src/site-layers/tll-mbar-align-v1.js (29 Oct Nancy: member bar links line up with the page column)
   core   src/site-layers/tll-photos-form-v2.js (29 Oct Nancy: /share-photos takes 30 photos and PNG)
   core   src/site-layers/tll-home-value-v1.js (31 Oct Value Playbook Phase 1: home value section, staged behind ?preview=value)
   core   src/site-layers/tll-album-settings-v1.js (31 Oct Nancy: per-continent map counts (numbers only) and how each member counts continents (7, 6 or 5))
   core   src/site-layers/tll-division-v1.js (31 Oct Value Playbook Phase 7: tll or paw-passport on GA4 and revenue links, entity from one setting)
   core   src/site-layers/tll-phase0-v1.js (31 Oct Nancy: Phase 0 fixes (contact relay, support headline, search, map buttons, shelf count, Thailand stub))
   core   src/site-layers/tll-drafted-v1.js (8 Nov Nancy: the empty pages are drafts; footer, pill, account card and edit-profile links to them hidden)
   core   src/site-layers/tll-ads-v1.js (31 Oct Nancy: AdSense, tastefully (story pages, library, countries only))
   core   src/site-layers/tll-pwa-hold-v1.js (10 Nov Lighthouse: the footer PWA client HEAD /sw.js is answered locally with a 404 until the PWA Worker is live (no console 404, nothing registered))
   story  src/design/magazine-2026-10/story-build/tll-mag-story-v1.html (the magazine story page: Playfair Display 800 and Plex, the byline in the head, the stamp on the photo; /stories/{slug} only)
   cover  src/design/magazine-2026-10/cover-build/tll-mag-cover-v1.html (the magazine cover: the cover story photo full bleed, the chip, the stamp; home page only)
   first  src/site-layers/tll-consent-mode-v2.js (Consent Mode v2 defaults when the head consent tool is missing)
   Styles: tll-nav-phone-v1 (phone header), tll-contrast-v1 (contrast), tll-note-phone-v1 (round note button on phones), tll-photos-tap-v1 (/share-photos drop zone tap on iPhones), tll-home-coords-v1 (home photo coordinates inside the screen on phones), tll-footer-wordmark-v1 (footer wordmark matches the header), tll-tap-colors-v1 (/account Stories tab: ink text and a rose underline on hover and tap, no rose or teal text), tll-shelf-ring-v1 (home library rail: room for the avatar ring on phones), tll-masthead-v1 (footer masthead line in Playfair Display italic), tll-buttons-v1 (one button set: filled rose, outlined, text link; square corners; IBM Plex Sans Condensed 600), tll-focus-v1 (10 Nov hygiene: 2px rose keyboard focus ring (focus-visible) on links, buttons and fields)
   The other layers come in per-path chunks from chunks/ at this same commit, loaded by the chunk loader below:
   chunk  site /^/: tll-footer-wordmark-v1, tll-masthead-v1, tll-hover-v1, tll-byline-links-v1, tll-story-fixes-1029-v1, tll-email-hello-v1, tll-ep-help-v1, tll-whats-new-v1, tll-note-footer-v1
   chunk  home /^\/(index\.html)?$/: tll-redesign-p0-v1
   chunk  stories /^\/stories$/: tll-stories-places-v1, tll-series-v1, tll-story-is-v1, tll-stories-count-v1, tll-stories-strip-v1
   chunk  story /^\/stories\/[^/]+$/: tll-story-ask-v1, tll-story-captions-v1, tll-pros-v1, tll-series-v1, tll-story-is-v1 (+ staged in story-preview: tll-ux-v1)
   chunk  submit /^\/submit$/: tll-submit-ux-v1, tll-linkout-preview-v1, tll-linkout-summary-v1, tll-submit-gallery-v1, tll-submit-long-v1, tll-intake-v1, tll-story-is-v1 (+ staged in submit-preview: tll-ux-v1)
   chunk  share-photos /^\/share-photos$/: tll-photos-caption-v1, tll-intake-v1
   chunk  edit-profile /^\/edit-profile/: tll-ep-country-v1, tll-ep-ux-v1, tll-ep-marks-v1, tll-ep-linkstack-v1, tll-crew-v1, tll-collections-v1, tll-stamps-v1, tll-work-trips-v1 (+ staged in edit-profile-preview: tll-expat-v1)
   chunk  profile /^\/contributors\/[^/]+$/: tll-profile-count-v1, tll-pf-linkstack-v1, tll-crew-v1, tll-collections-v1, tll-stamps-v1, tll-album-v1, tll-pros-v1 (+ staged in profile-preview: tll-expat-v1)
   chunk  account /^\/account$/: tll-crew-v1, tll-export-v1, tll-metrics-v1, tll-work-trips-v1 (+ staged in account-preview: tll-ux-v1)
   chunk  map /^\/the-map$/: tll-redesign-p0-v1
   chunk  for-expats /^\/for-expats$/: tll-expert-from-v1, tll-expats-map-v1, tll-series-v1 (+ staged in for-expats-preview: tll-expat-v1)
   chunk  travelers /^\/travelers$/: tll-travelers-fix-v1
   chunk  pursuits /^\/pursuits\/[^/]+$/: tll-stamps-v1, tll-pros-v1, tll-series-v1, tll-work-trips-v1
   chunk  pets /^\/(pets\/[^/]+|my-pets|the-paw-passport)$/: tll-crew-v1, tll-album-v1, tll-series-v1 (+ staged in pets-preview: tll-paw-v1, tll-pet-passport-v1)
   chunk  countries /^\/countries\/[^/]+$/: tll-series-v1
   chunk  misc /^\/(spotlight|gallery)$/: tll-open-slots-v1, tll-lounge-members-v1
   No data-ms-* element is touched. */
/* src/site-layers/tll-consent-mode-v2.js */
window.dataLayer=window.dataLayer||[];if(typeof window.gtag!=='function'){window.gtag=function(){dataLayer.push(arguments);};}
if(!window.__tllConsent){gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});}
/* Chunk loader: the per-path layers live in chunks/ beside this file at the same pinned commit, read off this script's own src, so no
   placeholder is needed. async=false keeps the order without blocking the parser; the hashes come from the same build as the chunks.
   window.__tllLayersBase is that folder, so other files of the same release (the story search index) load from the same commit.
   A preview flag or a tll-preview-* key switches a chunk to its -preview variant, which also carries the staged layers. */
(function(){
var S=document.currentScript,src=S&&S.src||'';
if(!src){var all=document.querySelectorAll('script[src*="tll-site-layers-v16"]');if(all.length)src=all[all.length-1].src;}
var m=/^(.*\/)tll-site-layers-v16\.js(?:[?#].*)?$/.exec(src);if(!m){try{console.warn('tll-site-layers: not served from its pinned URL, chunks skipped');}catch(e){}return;}
window.__tllLayersBase=m[1];
var P=location.pathname.replace(/\/+$/,'')||'/',pv=/[?&](preview|qr)=/.test(location.search);
try{for(var i=0;i<localStorage.length;i++){if(String(localStorage.key(i)).indexOf('tll-preview-')===0)pv=true;}}catch(e){}
var C=[['site',/^/,'sha384-9ULtKo8HR6zktJWt0Wihybu52d0nP3YjwXF/3X4VTnLsbKtEYY+zWt8aSR+ADQXQ'],
['home',/^\/(index\.html)?$/,'sha384-Cs2fwadNjTkLuL1Hf8HVTz3/nCa5ZP0fhs7fklYwC96eDqIOJ3AyM1iHDGM/JoQY'],
['stories',/^\/stories$/,'sha384-Gm85dzb8OiWvRk6Bj91WkHV/YPT59d21hmd9gA2DvcQKr3BAMu8LH4pV6zWdM3h1'],
['story',/^\/stories\/[^/]+$/,'sha384-KoxFBaGmQWFaVyaN9qm3x/Ey62m49oNRzhqHD+l/ljunemiXESEJzgwRXzybrhmo','story-preview','sha384-8N6GoJJj+4YkkNbo5cVDo6tocKl8SDv4sYRgBcSP3Rg3rKI8Zo54YaWJ0ci4u+hn'],
['submit',/^\/submit$/,'sha384-vecbBUt+ELSUum+uEwPfQ36sTT0zPkbkh/6dZAwlLyEFC+16V3PwZAEQ6boRpTOA','submit-preview','sha384-0ZrABamYYX6228IlzPMq40VTCaj9DNpykXMO7FsD9rSl6U2ROYr/qw+QdF3BRUm9'],
['share-photos',/^\/share-photos$/,'sha384-qHMKKfwgA5R2Pth9khIH+rAu6ptChFg7821QVc304wshp1qfJTO8cWj5HNbRcjiH'],
['edit-profile',/^\/edit-profile/,'sha384-yJNKXMkFEN8QX2X+oNINDpRhZzX9wNguoLNiac0TIj/tTwc8tlhJ51sArMdoawrp','edit-profile-preview','sha384-ZqZmatLSojBvn7ytJMp0BtVGkeUJTVPVMT+EzHjGuaNT1OmuuFZlY1MjrlWRuolV'],
['profile',/^\/contributors\/[^/]+$/,'sha384-9q1zFCBwOM0+3QnZxePntmtxid46sUZ5Vw0C8n0neZhwFfyImbU/5O+QOY+i22TF','profile-preview','sha384-8imBbnjUUjpdRAOv3rIlP6vZ86cdKl7YapwJUTXVdwXOl3FuMLeRfE0ad5CGqyBy'],
['account',/^\/account$/,'sha384-UwOT6QlhJSkRcbRvJnRDuCZWEEsdI8wI/FyQO3vQe3Kcet1ySXowkOEM2XqA0br/','account-preview','sha384-poM/NLAHiWEyb3QhM8H9ZjSsGfzOxlHYDC3Y1gSOESQft+UFENNhwZMXB7R1kLq9'],
['map',/^\/the-map$/,'sha384-zNLJZ3LyimY02ipulGJDCyAEagjs42+b/iV9JRfMSyJyL4+wQ3zG4vS5gQVoSzgJ'],
['for-expats',/^\/for-expats$/,'sha384-yAc2Sv43xd+ihXG41fHsOkyIe5+fXe2RWG3E2NPrs8DQdhvn9WbN9Me/PTxlT28E','for-expats-preview','sha384-r+YYmkCj3PxW00qIiO6v0esi/XC42vL+26anvNpBuYFvnxN4cASo7gIW3V1+RKf6'],
['travelers',/^\/travelers$/,'sha384-5M2lOzRkwk4MHu694JhLwBdeOv3KzqAlSeSu381ASnbCt8xt+uz4ZShDYu0R60Pk'],
['pursuits',/^\/pursuits\/[^/]+$/,'sha384-xVEkdzcX8jR4AOW1eRUGfRoKTvzwixR8KCfQIAyvlmj51Ma2EP3DyHyAYa+jEp2Q'],
['pets',/^\/(pets\/[^/]+|my-pets|the-paw-passport)$/,'sha384-TuR0lzUVTtZ0G1fkQm+P0LBwqrNiYnM1DVusZInhiDtYbizmScJW1pQYeye1UJPC','pets-preview','sha384-eMt3BB11tu/hV/MRxuQHutpPVFu8smDJSG5Z6yYpBAW4b9hYBqI07cc9HiWmYKZz'],
['countries',/^\/countries\/[^/]+$/,'sha384-I0ADpRWbi7LOkRL/AVmTuJOMYrlx+zqLIsznUmkKcXuK/O3UaFvtPo+bXVf4xFfA'],
['misc',/^\/(spotlight|gallery)$/,'sha384-8EF4Rvlyb9Px7Ap+rpdiNHoDU6hPE0EV5dLIbQSLMGgZ+M/zz1CWT78I/9t9tUkj']],h=document.head||document.documentElement;
for(var j=0;j<C.length;j++){var c=C[j];if(!c[1].test(P))continue;var n=c[0],g=c[2];if(pv&&c[3]){n=c[3];g=c[4];}
  var s=document.createElement('script');s.src=m[1]+'chunks/'+n+'.js';s.setAttribute('integrity',g);s.setAttribute('crossorigin','anonymous');s.async=false;h.appendChild(s);}
})();
(function(){var L=[["tll-nav-phone-v1", "/* 26 Oct 2026: one button shape in the header on phones (Nancy's 23 Oct critique, point 1; prototype 3.4 header).\n   Square corners and one 44px height for Sign up, the account button and MENU, and a single row from 360px up (320px phones wrap to two tidy rows).\n   Only the links are restyled. No data-ms-* element is touched (the round avatar letter stays as Memberstack sets it). */\n@media (max-width:767px){\nbody .tll-nav-v1 .tll-nav-main{padding:6px 0 !important}\nbody .tll-nav-v1 .tll-nav-inner{align-items:center !important;column-gap:8px !important}\nbody .tll-nav-v1 .tll-nav-logo{flex:0 1 auto;min-width:0}\nbody .tll-nav-v1 .tll-nav-cta-row{margin-left:auto !important;gap:6px !important;align-items:center !important}\nbody .tll-nav-v1 .tll-nav-signin{min-height:44px !important;display:inline-flex !important;align-items:center !important;padding:0 4px !important;margin-right:-8px !important}\nbody .tll-nav-v1 .tll-nav-signup,body .tll-nav-v1 .tll-nav-account-link,body .tll-nav-v1 .tllmm-btn{box-sizing:border-box !important;height:44px !important;min-height:44px !important;border-radius:0 !important;display:inline-flex !important;align-items:center !important;justify-content:center !important}\nbody .tll-nav-v1 .tll-nav-signup{padding:0 14px !important;font-size:13px !important}\nbody .tll-nav-v1 .tll-nav-account-link{padding:0 12px 0 8px !important;border:1.5px solid #F7F1E8 !important;gap:8px !important}\nbody .tll-nav-v1 .tllmm-btn{padding:0 12px !important;min-width:68px !important;border:1.5px solid #F7F1E8 !important;font-size:12px !important;letter-spacing:2px !important}\n}\n@media (max-width:399px){\nbody .tll-nav-v1 .tll-nav-logo{zoom:.86}\nbody .tll-nav-v1 .tll-nav-signup{padding:0 10px !important}\nbody .tll-nav-v1 .tllmm-btn{padding:0 8px !important;min-width:60px !important;letter-spacing:1px !important}\n}\n"], ["tll-contrast-v1", "/* 26 Oct 2026: three text-contrast failures found by an axe check (WCAG AA needs 4.5:1 for small text).\n   1. Header \"Sign up\" and \"Share your story\": cream or white on #F0507A (3.07 and 3.42). Now white on #D63859 (4.6), the\n      look most pages already had; only the home page on desktop used the lighter rose.\n   2. /stories \"Share your story\" button (.tll-cta-rose): cream on teal #00A9A4 (2.59). Now white on #D63859 (4.6).\n   3. Rose words on light backgrounds (.tll-text-rose, #F0507A on cream, 3.07). Now #C8325B (4.64), the site rule for rose\n      text on light. Rose on dark sections keeps the bright #F0507A. Links only; no data-ms-* element is touched. */\nbody .tll-nav-v1 a.tll-nav-signup,body .tll-nav-v1 a.tll-nav-pen-cta{background-color:#D63859 !important;color:#FFFFFF !important}\nbody .tll-nav-v1 a.tll-nav-signup:hover,body .tll-nav-v1 a.tll-nav-pen-cta:hover{background-color:#C8325B !important;color:#FFFFFF !important}\nbody a.tll-cta-rose{background-color:#D63859 !important;color:#FFFFFF !important}\nbody a.tll-cta-rose:hover{background-color:#C8325B !important}\nbody .tll-text-rose{color:#C8325B}\nbody :is(.tll-section-dark,.tll-nav-v1,footer,.tll-footer-v1,.tll-story-hero,.tlldx-hero,.tllpx-hero,.tllec-hero,.tll-support-hero,.tll-auth-section,[data-h3-hero]) .tll-text-rose{color:#F0507A}\n"], ["tll-note-phone-v1", "/* 26 Oct 2026: the floating \"Tell the editor\" pill covered page content on phones (the /account tab strip, the Languages\n   field on /edit-profile). Prototype 3.4 already set the answer: under 960px the pill is a 44px round button with the dot\n   only (the words stay for screen readers). It also steps aside while a form field outside the note has focus. */\n@media (max-width:959px){\nbody #tll-note .tll-note-pill{font-size:0 !important;gap:0 !important;padding:0 !important;width:44px !important;height:44px !important;min-height:44px !important;justify-content:center !important;letter-spacing:0 !important}\nbody #tll-note .tll-note-pill::before{width:10px !important;height:10px !important}\n}\nhtml.tll-typing #tll-note:not([data-open=\"true\"]){display:none !important}\n"], ["tll-photos-tap-v1", "/* 26 Oct 2026, Nancy on an iPhone: \"Tap to add photo doesn't work\" on /share-photos. The file input sat hidden inside the drop\n   zone (1px, clipped, pointer-events none) and relied on the label passing the tap on, which iPhone browsers do not always do.\n   Now the input itself covers the whole drop zone, fully transparent, so a tap lands on the real file input on every phone.\n   Drag and drop and the keyboard still work; the focus ring shows on the drop zone. */\nbody [data-tll-form=share-photos] fieldset.tll-pen-fieldset label.tll-photos-drop{position:relative !important}\nbody [data-tll-form=share-photos] fieldset.tll-pen-fieldset label.tll-photos-drop input.tll-photos-drop-input{position:absolute !important;inset:0 !important;width:100% !important;height:100% !important;min-height:0 !important;margin:0 !important;padding:0 !important;border:0 !important;opacity:0 !important;clip-path:none !important;overflow:hidden !important;cursor:pointer !important;pointer-events:auto !important;z-index:2 !important;font-size:16px !important;display:block !important}\nbody [data-tll-form=share-photos] label.tll-photos-drop:has(> input.tll-photos-drop-input:focus-visible){outline:3px solid #F0507A;outline-offset:2px}\n"], ["tll-home-coords-v1", "/* 26 Oct 2026, Nancy: the coordinates on the home photo were half off the screen on her phone. The 20 Oct coordinates embed\n   (h3-hero-coords-v3) sets them to position:static under 900px; the phone hero layer moves them top-right but never reset that,\n   so they sat flush against the right edge and the last letters were cut. Top-right, 16px in from the edges, on phones. */\n@media (max-width:767px){\nbody:not(.tll-none) [data-h3-hero] .h3-hero-coords{position:absolute !important;margin:0 !important;top:16px !important;right:16px !important;left:auto !important;max-width:calc(100% - 32px) !important;white-space:nowrap !important;overflow:visible !important;text-overflow:clip !important;text-align:right !important}\n}\n"], ["tll-footer-wordmark-v1", "/* 26 Oct 2026, Nancy: \"What's going on with the logo\" (site footer). The footer link was plain text \"that LAYOVER LIFE\" in\n   generic classes: a big sans \"that\", a small rose \"LAYOVER LIFE\". Now it is the header wordmark at footer size:\n   italic serif \"that\", Playfair \"LAYOVER\", rose \"LIFE.\". The words are rebuilt by tll-footer-wordmark-v1.js. */\nbody footer a.tll-fwm{display:inline-flex !important;align-items:baseline !important;gap:6px !important;white-space:nowrap !important;text-decoration:none !important;color:#F8F2E6 !important;font-size:inherit !important;line-height:1 !important;margin:0 0 4px !important}\nbody footer a.tll-fwm .tll-fwm-that{font:italic 400 18px/1 'DM Serif Display','Playfair Display',Georgia,serif !important;opacity:.85;color:#F8F2E6 !important;letter-spacing:0 !important;text-transform:none !important}\nbody footer a.tll-fwm .tll-fwm-block{font:800 24px/1 'Playfair Display',Georgia,serif !important;letter-spacing:.01em !important;color:#F8F2E6 !important;text-transform:uppercase !important}\nbody footer a.tll-fwm .tll-fwm-life{color:#F0507A !important;font:inherit !important}\n"], ["tll-tap-colors-v1", "/* 26 Oct 2026, Nancy on the /account Stories tab: \"Not a fan of the light blue on hover click.\"\n   The row title's hover was bright rose (#F0507A) on cream, which fails contrast (3.07:1). The site's contrast layer then recolors it\n   from its palette, and the result on an iPhone long-press was a pale teal. The magazine rule instead: text stays ink, the underline\n   goes rose (#C8325B on light). Same for the Edit and Share links in that tab. No element or script changes; CSS only, after the\n   script's own styles by specificity. */\nbody .tms-row .tms-t:hover,body .tms-row .tms-t:focus-visible,body .tms-row:hover .tms-t,body .tms-row:active .tms-t{color:#0A0B14 !important;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:4px}\nbody .tms-act:hover,body .tms-act:focus-visible{color:#0A0B14 !important;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:3px}\nbody .tms-act:focus-visible{outline-color:#C8325B}\nbody .tms-row:hover,body .tms-row:active{border-color:#0A0B14 !important}\n@media(hover:none){body .tms-row:hover .tms-t,body .tms-row .tms-t:hover{text-decoration-color:transparent}body .tms-row:active .tms-t{text-decoration-color:#C8325B}}\n"], ["tll-shelf-ring-v1", "/* 26 Oct 2026, Nancy on the home library on her phone: \"The user circles are getting cut off.\" The 40px avatar's rose ring is a\n   box-shadow drawn outside its box, and on phones the story rail (.h3-track) is the scroll container, so it clips the ring at its\n   left and top edges on the first card. Three pixels of padding on those sides, pulled back by the same negative margin, keep every\n   card exactly where it was and give the ring room. Desktop (the pinned rail) was never clipped. CSS only. */\n.h3-shelf:not(.is-pinned) .h3-track{padding-left:3px;padding-top:3px;margin-left:-3px;margin-top:-3px;scroll-padding-left:3px}\n"], ["tll-masthead-v1", "/* 26 Oct 2026: the masthead line in the footer, in italic. The script tll-masthead-v1.js writes the text.\n   10 Nov 2026: Playfair Display 800 italic (the type system; the site head loads it on every page, so the Georgia fallback that\n   showed on every page but the home and story pages is gone with the Newsreader request). */\nfooter p.tll-masthead{font-family:'Playfair Display',Georgia,serif !important;font-style:italic;font-weight:800 !important;font-size:18px !important;line-height:1.4 !important;letter-spacing:0 !important;text-transform:none !important;max-width:34ch;text-wrap:pretty}\n"], ["tll-buttons-v1", "/* 10 Nov 2026, week-one quick wins item 1 (claude/tll-fix-sequence-2026-11-09.md, Prompt 2): one button set for the whole site.\n   Three kinds, from the brief: filled rose (#D63859, white text), outlined (1.5px line in the text color: ink on light, cream on\n   dark), and a text link with its arrow. Every button: IBM Plex Sans Condensed 600, 16px, no tracking, no capitals, square corners\n   (border-radius 0; the 6px nav corners and the 999px pills are gone), 48px tall, 24px of side padding. Nav buttons are the compact\n   size (40px, 15px type) so the header keeps its height; the nav component itself is untouched, these are site-code overrides.\n   Applied to the classes found on the home page, /stories, a story page and /the-paw-passport (9 Nov inventory, review item 6):\n     filled rose   .h3-btn.h3-btn-rose, .tll-cta-rose, .tll-library-news-submit, .tllsb-btn, form .w-button (Send, Send it, Search),\n                   .tll-btn.tll-btn-primary (nav Sign up)\n     outlined      .h3-btn.h3-btn-line, .h3-btn.h3-btn-ink (was filled ink: the set has one fill, rose), .tll-cta-ghost,\n                   .tll-place-btn (Been here / Want to go), .tll-btn.tll-btn-ghost-rose (nav Share your story), .tll-btn (others)\n     text link     .h3-shelf-all, .tll-mg-people .tll-mg-all, .tll-link-arrow (for new layers)\n   Not buttons, so not touched: the filter chips (.h3-chip, .tll-shelf-chip, .tll-filter-chip-on), the Tell the editor pill, the\n   mobile menu button (.tllmm-btn), the cookie banner (#cc-main) and Memberstack's own modals. The home search form keeps its field\n   but loses its pill shape so the square button sits inside it. Every rule carries html body for specificity over page code. */\nhtml body .h3-btn,html body .tll-btn,html body form .w-button,html body .tll-cta-rose,html body .tll-cta-ghost,html body .tllsb-btn,html body .tll-library-news-submit,html body .tll-place-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;box-sizing:border-box;min-height:48px !important;height:auto !important;padding:0 24px !important;margin-top:0;margin-bottom:0;font-family:'IBM Plex Sans Condensed',system-ui,sans-serif !important;font-weight:600 !important;font-size:16px !important;line-height:1.1 !important;letter-spacing:0 !important;text-transform:none !important;text-decoration:none !important;border-radius:0 !important;border-width:1.5px !important;border-style:solid !important;cursor:pointer;white-space:nowrap}\nhtml body form .w-button{min-width:0}\n/* filled rose */\nhtml body .h3-btn.h3-btn-rose,html body .tll-cta-rose,html body .tll-library-news-submit,html body .tllsb-btn,html body form .w-button,html body .tll-btn.tll-btn-primary,html body .tll-nav-v1 a.tll-nav-signup{background:#D63859 !important;color:#FFFFFF !important;border-color:#D63859 !important}\nhtml body .h3-btn.h3-btn-rose:hover,html body .tll-cta-rose:hover,html body .tll-library-news-submit:hover,html body .tllsb-btn:hover,html body form .w-button:hover,html body .tll-btn.tll-btn-primary:hover,html body .tll-nav-v1 a.tll-nav-signup:hover{background:#C8325B !important;border-color:#C8325B !important;color:#FFFFFF !important}\n/* outlined: the line and the text take the color of the words around them (ink on cream, cream on the dark sections and the nav) */\nhtml body .h3-btn.h3-btn-line,html body .h3-btn.h3-btn-ink,html body .tll-cta-ghost,html body .tll-place-btn,html body .tll-btn:not(.tll-btn-primary):not(.tll-nav-signup){background:transparent !important;color:inherit !important;border-color:currentColor !important;box-shadow:none !important}\nhtml body .h3-btn.h3-btn-line.h3-on-light,html body .tll-place-btn,html body .tll-btn.tll-btn-ghost-rose{color:#0A0B14 !important}\nhtml body .tll-cta-ghost,html body .tll-nav-v1 .tll-btn:not(.tll-nav-signup),html body .tll-nav-v1 a.tll-nav-pen-cta{color:#F7F1E8 !important;border-color:#F7F1E8 !important}\nhtml body .h3-btn.h3-btn-line:hover,html body .h3-btn.h3-btn-ink:hover,html body .tll-cta-ghost:hover,html body .tll-place-btn:hover,html body .tll-btn:not(.tll-btn-primary):not(.tll-nav-signup):hover,html body .tll-nav-v1 a.tll-nav-pen-cta:hover{background:color-mix(in srgb,currentColor 12%,transparent) !important}\n/* the story page's own layer (tll-st3-story-v1) shapes [data-tll-places] [data-tll-place-toggle] with !important, so the pair is repeated here with more weight */\nhtml body [data-tll-places] [data-tll-place-toggle].tll-place-btn,html body .tll-place-btn[data-tll-place-toggle]{min-height:44px !important;padding:0 18px !important;border-radius:0 !important;font-family:'IBM Plex Sans Condensed',system-ui,sans-serif !important;font-size:15px !important;font-weight:600 !important;letter-spacing:0 !important;text-transform:none !important;border:1.5px solid currentColor !important;background:transparent !important;color:#0A0B14 !important}\nhtml body .tll-place-btn[aria-pressed=\"true\"],html body [data-tll-places] [data-tll-place-toggle].tll-place-btn[aria-pressed=\"true\"]{background:#0A0B14 !important;color:#F7F1E8 !important;border-color:#0A0B14 !important}\n/* the nav pair: compact, square, Sign up filled, Share your story outlined; the component is untouched */\nhtml body .tll-nav-v1 .tll-btn,html body .tll-nav-v1 a.tll-nav-signup,html body .tll-nav-v1 a.tll-nav-pen-cta{min-height:40px !important;padding:0 16px !important;font-size:15px !important;border-radius:0 !important;font-weight:600 !important;letter-spacing:0 !important;text-transform:none !important}\n/* the search buttons sit inside their fields: square field, square button. The home page's own rules carry an id (form:has(#Search-the-library))\n   and the news form and the note form carry !important, so these three repeat the set with enough specificity to win. */\nhtml body form.tll-home-search{border-radius:0 !important}\nhtml body form.tll-home-search input[type=submit].w-button,html body [data-h3=\"search\"] form:has(#Search-the-library) input[type=submit].w-button{min-height:44px !important;height:auto !important;padding:0 20px !important;font-family:'IBM Plex Sans Condensed',system-ui,sans-serif !important;font-size:15px !important;font-weight:600 !important;line-height:1.1 !important;letter-spacing:0 !important;text-transform:none !important;background:#D63859 !important;color:#FFFFFF !important;border:1.5px solid #D63859 !important;border-radius:0 !important}\nhtml body form.tll-home-search input[type=submit].w-button:hover,html body [data-h3=\"search\"] form:has(#Search-the-library) input[type=submit].w-button:hover{background:#C8325B !important;border-color:#C8325B !important;color:#FFFFFF !important}\nhtml body [data-h3=\"news-form\"] input[type=submit].w-button,html body #tll-note input[type=submit].w-button{min-height:48px !important;padding:0 24px !important;font-family:'IBM Plex Sans Condensed',system-ui,sans-serif !important;font-size:16px !important;font-weight:600 !important;letter-spacing:0 !important;text-transform:none !important;background:#D63859 !important;color:#FFFFFF !important;border:1.5px solid #D63859 !important;border-radius:0 !important}\nhtml body [data-h3=\"news-form\"] input[type=submit].w-button:hover,html body #tll-note input[type=submit].w-button:hover{background:#C8325B !important;border-color:#C8325B !important;color:#FFFFFF !important}\nhtml.tllp-stories body .tll-library-filters .tll-lib-searchslot .tllsb-btn,html body .tllsb-btn.w-button{font-family:'IBM Plex Sans Condensed',system-ui,sans-serif !important;font-size:15px !important;font-weight:600 !important;letter-spacing:0 !important;text-transform:none !important;background:#D63859 !important;color:#FFFFFF !important;border:1.5px solid #D63859 !important;border-radius:0 !important;padding:0 20px !important;min-height:44px !important}\nhtml.tllp-stories body .tll-library-filters .tll-lib-searchslot .tllsb-btn:hover,html body .tllsb-btn.w-button:hover{background:#C8325B !important;color:#FFFFFF !important}\n/* the text link with its arrow: body face, 600, a rose underline; the arrow is in the text */\nhtml body .h3-shelf-all,html body .tll-mg-people .tll-mg-all,html body .tll-link-arrow{font-family:'IBM Plex Sans Condensed',system-ui,sans-serif !important;font-size:16px !important;font-weight:600 !important;letter-spacing:0 !important;text-transform:none !important;color:#0A0B14 !important;text-decoration:underline !important;text-decoration-color:#C8325B !important;text-decoration-thickness:2px !important;text-underline-offset:4px !important}\nhtml body .h3-shelf-all:hover,html body .tll-mg-people .tll-mg-all:hover,html body .tll-link-arrow:hover{color:#C8325B !important}\n@media(max-width:600px){html body .tll-nav-v1 .tll-btn,html body .tll-nav-v1 a.tll-nav-signup,html body .tll-nav-v1 a.tll-nav-pen-cta{padding:0 12px !important;font-size:14px !important}}\n"], ["tll-focus-v1", "/* tll-focus-v1 (10 Nov 2026, week-one hygiene, item 9): one visible keyboard focus ring site-wide. Links, buttons, role=button and\n   role=link controls (the card bylines) and form fields show a 2px rose (#C8325B) outline with a 2px offset when focus comes from the keyboard (:focus-visible). A mouse or tap\n   focus (:focus without -visible) gets nothing from this style, so the ring never appears on click.\n   Why !important and the html body prefix: the site head code already carries two site-wide rings that fight each other, both\n   !important (tll-a11y-focus-v1: 3px #F0507A; tll-v9-chrome-v1: 3px ink plus a teal halo), and a third without (tll-craft-polish: 2px\n   #F0507A). A plain a:focus-visible rule here never paints. This rule, with !important and the id in :not() for specificity, wins over\n   those site-wide blocks and over the page-level rings on the home chapters (.h3 ..., tll-home3-v1) and the /stories cards and chips\n   (tll-s3-stories-v1, tll-lib-fixfirst-v1, tll-lib-chips-css-v1), and clears the 6px teal halo (box-shadow) the v9 chrome block adds.\n   Those blocks can come off the site and page code once this is live. The Tell the editor note (#tll-note) is left out and keeps its\n   own teal ring and drop shadow on its dark card (rose on ink is about 3:1, teal is clearer); the second rule restates that teal ring so\n   the site-wide !important blocks cannot paint bright rose on it. Nothing removed; no data-ms-* element touched. */\nhtml body :is(a,button,[role=button],[role=link],input,select,textarea):not(#tll-note *):focus-visible{outline:2px solid #C8325B !important;outline-offset:2px !important;box-shadow:none !important}\nhtml body #tll-note a:focus-visible,html body #tll-note button:focus-visible,html body #tll-note input:focus-visible,html body #tll-note textarea:focus-visible{outline:3px solid #00C9C8 !important;outline-offset:3px !important}\nhtml body #tll-note .tll-note-close:focus-visible{outline-offset:-3px !important}\n"]];var h=document.head||document.documentElement;for(var i=0;i<L.length;i++){if(document.getElementById(L[i][0]))continue;var s=document.createElement('style');s.id=L[i][0];s.textContent=L[i][1];h.appendChild(s);}})();
/* src/site-layers/tll-img-variants-v1.js */
(function(){
if(window.__tllImgV)return;
var H='https://cdn.prod.website-files.com/',SITE='69d6145cf421c777840c1e25',W=[500,800,1080,1600,2000];
/* The last six hex digits of each twin's id, grouped by how many variants it has (0 to 4); every other twin has all five. */
/*TABLE*/var T={0:'18c14062300e62a66787095ebc8683f600baf8ce14',1:'0198b807e83f0c8dd90f01e11f64a0215a0023764124db7831a08633818334db0335690b36c0283d2d9d3fe51e3fe8db41f7da458a1245ac464beadf4c9b234c9bc750ff3653a18a551c3e5acf487c2d597d6e087d9a6e7fce8b817a158c5ca58c5d708e866a9d88b8a66e82b0e948bfc72bceaf18e2bd06e3bee3e51d60e6d68ee72224f24e74f43f38f7718af857c1f9ccc7fa1e85',2:'001dfb037114052c2107a2720d359f0f0b2e1009c1102dcc1035d8135b1e136ef516046c17e95c1f21571f645420f5382159b421f42923012023013534260034c391354df235675e37d85c37f5f9382d3f382e6239312e3b7ca93f928843115a4418ed4d9cf04fafba4fafea50c10c50c128530fa2530fc0531fc154acbf54ad1655b1ed55b42c55b651581e515857b55fb4b864b8bf6602d968e9786b3b446bae946baed46c6e6c72e7b17d58a185671586d0c688b2da8fe65a91904894866e95ae7796014598c2f79d9ce09e45a39e76a9a1162fa678baa9b77eab99f2ab9a8bafccc6afcdaab844e4c6953ccbe17ecc283dcca402cfdba9cfdbbecfdbd3d13568d1ba6ad524ccd57c2ad91a6bda1ab4de66e5de71f2e290f9e6e704e6e801e6f062f12d34f24e2df303c3f339e6f33c27f74124f814caf814dff8335af833ddf89cdef9627bfb4bfbfc5a45fe713dff3224ff98a5ffec99',3:'01913d023f5a032a12032a800348a8048bfe064c9106e83907395007396508bbee0a59f80b3cfd0b3d4e0bc9330bc9540bfa330c1fb70c6b300c74500c74650db1330db2bb0e3d4e0e3d820f0b190f50fe0f6a160f6d2c0f73a20fc529100a06102db7141053175c201a66571b0d2d1db5871eb40f1f1d4521594e216f1421765921f3282212ba229a6522b02d23baea249faa24a04724f7cb2539cd2633a32633b82969eb29b1a02a09262acb7c2adcd62b604a2b9b182c0d952dfde82e989c2edc6b304e4c30670431954c31dc5d33811c3542da3544cf354505354522368c26377d8837f98f3888b139964a3a531c3a567d3b5e3b3ef6a73fd3093fd3b841de77448422448eb04a14534b08c34b507c4e96ac50aed250ff2151196351d7875476b459e01a5b0dae5b9f285cb9235d20d65ddb215eada85f04e15fb3a85fc6fc649fda6602c466b4c668c68568e2686b129b6b7a296c6dfd6c6e03729d0b75dc4a76356d76d1d2776d93776dd777f3137860d578951078981179b85b79d3cc7a23717ac8d27ac90a7c2e0f7dd03c7df7fe7e0c457fcea080d05784d16584d5168741e489128c8b51978bea868bebb18ce2878d612b8db7338eb05e9189ec91af9494868396dce5973a089a94ee9a9b329ac1179dce889e309d9ec0d49fd9249fe774a076bba11611a287e6a35076a4445daa6698abcab9ac7431af0ee2b1bdb2bbb440bc541fbe0d90c268f2c4377ec47b10c4a981c56705c70f00c954c0c9affccbdb97cbf1c7cd33cecd4d95cd53cfcdb6abceaf3cceaf51cf3b40cf3c01cf3c55cf715cd0a761d0c047d0c162d4b6d1d4b6e6d50005d52ea8d9e153da685add5fa8dd6084dd7861ddd108de52a3deb450debc8bdfe7e6dfe822dfe847e0e61ce10f79e2bcb4e2bce0e31152e3361be70065e902a5e902e2e916dfeb31aded9740ed976aed97f4eeed4befc57cf000d2f29319f2932ef29343f31807f3183df43aedf6603df7a934f7b458f8216ef8df87fb731afbba1afbfee0fc40c4fdcd47fe1098',4:'00922e01bbd70225e804f01c0ae5680b4cec0bb7520bfa120c1fcc0cf92c13e2ac1f2d3823761526d7062846612ac2012e521633146f332f9035b9c436ad2d3a29f8426aeb4351af465be347866e479cc34a09344bd3534e816850ce4751255451d772530f835acf5e5bb8065f050d602ca862101767612b6781ac68a6da6a2fc36b215a6e6d9872a49874814475db4f7c82d57db4597db87a7e1ed584c43e85d35d892be18be8d38beaa9914aec91afdb98270e9a42bc9a8d50a077a7ab9c43ac71c8ac722dafa073b1daf6b4593ab48a9db8f4a0b92154c43793c947c2cc83decf71cfd0c155d40880d438d1d49fbbd4e542d56a4ad71eded8a9c7da0551db18e5dc5947dea16ddfeff7e093a4e116ace8941ceeed0befddecf213e6fd661c'};/*/TABLE*/
var N={};(function(){for(var c in T){var s=T[c];for(var i=0;i+6<=s.length;i+=6)N[s.substr(i,6)]=+c;}})();
var RC=/^https:\/\/cdn\.prod\.website-files\.com\/6a0b29c6d081332e921900d8\/[0-9a-f]{24}_(?:[0-9a-f]{24}_)*([0-9a-f]{24})_([^\/?#]+)\.(?:jpe?g|png)$/i;
var RS=/^https:\/\/cdn\.prod\.website-files\.com\/69d6145cf421c777840c1e25\/([0-9a-f]{24})_([^\/?#]+)\.(?:jpe?g|png)$/i;
function twin(u){
  if(typeof u!=='string')return null;var m=RC.exec(u),cms=!!m;
  if(!m){m=RS.exec(u);if(!m||/-p-\d+$/.test(m[2]))return null;}
  var id=m[1].toLowerCase(),n=N[id.slice(-6)];
  if(n==null){if(!cms)return null;n=W.length;}
  if(!n)return null;
  return {base:H+SITE+'/'+id+'_'+m[2].replace(/%25/g,'%'),n:n};
}
function srcset(u){
  var t=twin(u);if(!t)return '';var s=[];
  for(var i=0;i<t.n;i++)s.push(t.base+'-p-'+W[i]+'.jpg '+W[i]+'w');
  /* the variants stop below the photo's own width, so the original is the next size up */
  if(t.n<W.length)s.push(u+' '+W[t.n]+'w');
  return s.join(', ');
}
/* one URL for a box w device pixels wide (for code that writes a single src): the smallest variant that covers it, else the original */
function pick(u,w){
  var t=twin(u);if(!t)return u;
  for(var i=0;i<t.n;i++)if(W[i]>=w)return t.base+'-p-'+W[i]+'.jpg';
  return t.n<W.length?u:t.base+'-p-'+W[t.n-1]+'.jpg';
}
/* sizes by class (the img's own class, else its parent's); the library lead card (first in the grid) is wider from 768px up */
var BY=[['tll-story-hero-img','(min-width:1280px) 1200px, calc(100vw - 32px)'],['tll-lib-byline-img','24px'],['st3-author-img','44px'],['st3-cc-img','60px'],
  ['tll-lib-img','(min-width:1280px) 385px, (min-width:768px) 47vw, calc(100vw - 48px)'],['tll-related-img','(min-width:991px) 840px, calc(100vw - 40px)'],
  ['tll-gallery-img','(min-width:900px) 300px, (min-width:600px) 33vw, 50vw'],['tll-paw-ex-img','(min-width:767px) 280px, calc(100vw - 32px)']];
var BYP=[['h3-card-by','40px'],['h3-card-ph','(min-width:991px) 26vw, 80vw'],['h3-pc','(min-width:1440px) 220px, (min-width:991px) 15vw, 44vw'],
  ['tll-mg-chip','36px'],['h3-c5-ph','(min-width:991px) 50vw, 100vw']];
var INLINE='(min-width:991px) 880px, calc(100vw - 48px)';
var LEAD='(min-width:1280px) 700px, (min-width:991px) 55vw, (min-width:768px) 95vw, calc(100vw - 48px)';
function has(e,c){return !!e&&(' '+(e.getAttribute('class')||'')+' ').indexOf(' '+c+' ')>=0;}
function guess(img){
  var i,p=img.parentElement;
  if(img.closest&&img.closest('.tll-inline-photo'))return INLINE;
  if(has(img,'tll-lib-img')){var it=img.closest&&img.closest('.tll-lib-grid>*');if(it&&!it.previousElementSibling)return LEAD;}
  for(i=0;i<BY.length;i++)if(has(img,BY[i][0]))return BY[i][1];
  for(i=0;i<BYP.length;i++)if(has(p,BYP[i][0]))return BYP[i][1];
  /* review 10 Nov: classless CMS card photos on /destinations and contributor pages are about 300px wide on desktop, full column on phones */
  if(!img.getAttribute('class')&&/^\/(destinations$|contributors\/)/.test(location.pathname.replace(/\/+$/,''))&&img.closest&&img.closest('.w-dyn-item'))return '(min-width:991px) 300px, calc(100vw - 32px)';
  var w=parseInt(img.getAttribute('width'),10);
  return w>0&&w<=160?w+'px':'100vw';
}
function ms(el){
  for(var e=el;e&&e.nodeType===1;e=e.parentNode){var a=e.attributes;for(var i=0;i<a.length;i++)if(a[i].name.lastIndexOf('data-ms-',0)===0)return true;}
  return false;
}
function lazy(img){return (img.getAttribute('loading')||'').toLowerCase()==='lazy';}
/* apply(img[, sizes[, src]]): writes srcset and sizes for src (default: the img's own src). A layer about to set src passes the new URL
   first, so the browser fetches once, from the srcset. Returns true when a srcset is in place. */
function apply(img,sz,src,moved){
  if(!img||img.nodeName!=='IMG')return false;
  var layer=src!=null;src=layer?String(src):img.getAttribute('src');if(!src)return false;
  if(img.getAttribute('data-tll-vx')===src)return false;
  var mine=img.getAttribute('data-tll-v')!=null;
  if(!layer&&!mine&&img.getAttribute('srcset'))return false;
  if(ms(img))return false;
  var ss=srcset(src);
  if(!ss){if(mine||layer){img.removeAttribute('srcset');img.removeAttribute('sizes');img.removeAttribute('data-tll-v');}return false;}
  if(mine&&img.getAttribute('data-tll-v')===src&&img.getAttribute('srcset')===ss){
    /* the same photo moved by a script (a story photo into the body column): its box changed, so its sizes follow while it is lazy and
       not yet fetched (a lazy image is fetched only near the screen, after the move) */
    if(moved&&!sz&&img.getAttribute('data-tll-vs')==null&&lazy(img)&&!img.complete){var g=guess(img);if(g!==img.getAttribute('sizes'))img.setAttribute('sizes',g);}
    return true;}
  var s=sz||guess(img);
  /* review 10 Nov: sizes a layer passed survive the later move scan (they were reset to 100vw on /about, /for-expats, /stories) */
  if(sz)img.setAttribute('data-tll-vs','');else img.removeAttribute('data-tll-vs');
  img.setAttribute('data-tll-v',src);img.setAttribute('sizes',s);img.setAttribute('srcset',ss);
  return true;
}
function hero(img){
  if(!has(img,'tll-story-hero-img'))return false;
  if(img.getAttribute('data-tll-hero'))return true;img.setAttribute('data-tll-hero','1');
  if(!ms(img)){
    if(lazy(img)&&(!img.getAttribute('srcset')||img.getAttribute('data-tll-v')!=null)){var ss=srcset(img.getAttribute('src'));
      if(ss){img.setAttribute('data-tll-v',img.getAttribute('src'));img.setAttribute('sizes',guess(img));img.setAttribute('srcset',ss);}}
    img.setAttribute('loading','eager');img.setAttribute('fetchpriority','high');
  }
  return true;
}
function consider(img,moved){
  if(img.getAttribute('data-tll-v')!=null&&img.getAttribute('srcset')){apply(img,null,null,moved);return;}
  if(hero(img))return;
  if(!lazy(img)||img.getAttribute('srcset'))return;
  apply(img);
}
function scan(n){
  if(n.nodeType!==1)return;
  if(n.nodeName==='IMG'){consider(n,true);return;}
  if(n.firstElementChild){var l=n.getElementsByTagName('img');for(var i=0;i<l.length;i++)consider(l[i],true);}
}
/* a variant that fails (a width Webflow did not build): drop the srcset, the original loads once */
document.addEventListener('error',function(e){
  var i=e.target;if(!i||i.nodeName!=='IMG'||i.getAttribute('data-tll-v')==null||!i.getAttribute('srcset'))return;
  var src=i.getAttribute('src');if(i.currentSrc&&i.currentSrc===src)return;
  i.setAttribute('data-tll-vx',src);i.removeAttribute('srcset');i.removeAttribute('sizes');i.removeAttribute('data-tll-v');i.removeAttribute('data-tll-vs');
},true);
if(window.MutationObserver){
  new MutationObserver(function(recs){
    for(var r=0;r<recs.length;r++){var x=recs[r];
      if(x.type==='attributes'){if(x.target.nodeName==='IMG')consider(x.target);continue;}
      for(var j=0;j<x.addedNodes.length;j++)scan(x.addedNodes[j]);}
  }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
}
/* once the page is parsed: every img again, in case one was missed */
function pass(){var l=document.images;for(var i=0;i<l.length;i++)consider(l[i]);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',pass);else pass();
window.__tllImgV={twin:twin,srcset:srcset,pick:pick,apply:apply,sizes:guess};
})();
/* src/components/member-bar/tll-account-hash-tabs-v1.js */
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
/* src/site-layers/tll-note-typing-v1.js */
(function(){
  if(window.__tllTyping) return; window.__tllTyping=1;
  var H=document.documentElement, F='input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]),textarea,select,[contenteditable="true"]';
  function on(t){ return t&&t.matches&&t.matches(F)&&!(t.closest&&t.closest('#tll-note')); }
  document.addEventListener('focusin',function(e){ if(on(e.target)) H.classList.add('tll-typing'); });
  document.addEventListener('focusout',function(){ setTimeout(function(){ if(!on(document.activeElement)) H.classList.remove('tll-typing'); },0); });
})();
/* src/site-layers/tll-ux-1028-v1.js */
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
/* src/site-layers/tll-page-heroes-v1.js */
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
/* Loading (10 Nov 2026, week one item 4; was 1 Nov). Each photo carries a srcset of its Webflow variants from tll-img-variants-v1
   (window.__tllImgV, in the core ahead of this layer): CMS files take their site-bucket twin's -p-500 to -p-2000, and the table there knows
   which widths exist, so jaguar, Sort Sol and Magnus (marked as having none until now) get theirs too. The 1 Nov try of {CMS URL}-p-{w}
   always failed (the CMS bucket has no variants) and cost a 403 per tile before the original. src stays the original, the fallback; a
   missing variant drops the srcset and the original loads once. The two photos painted above the fold (/the-map backdrop, /for-expats
   side tile) ask for high priority and are preloaded from here with the same srcset and sizes, so the preload and the img are one
   request; on /for-expats only from 1100px up, where the tile sits beside the copy, since below that it is after the copy. */
var V=window.__tllImgV||null;
var SZ={row:'(max-width:767px) 46vw, 220px',faces:'(min-width:1200px) 141px, 64px',map:'100vw',side:'(min-width:1100px) 320px, 100vw',strip:'(max-width:767px) 72vw, 25vw',band:'(max-width:767px) 72vw, 340px'};
function preload(p,sz){try{var pl=document.createElement('link');pl.rel='preload';pl.as='image';pl.href=p.src;var ss=V&&V.srcset(p.src);if(ss){pl.setAttribute('imagesrcset',ss);pl.setAttribute('imagesizes',sz);}
  pl.setAttribute('fetchpriority','high');(document.head||document.documentElement).appendChild(pl);}catch(e){}}
if(path==='/the-map')preload(P.sortsol,SZ.map);
else if(path==='/for-expats'&&window.matchMedia&&window.matchMedia('(min-width:1100px)').matches)preload(P.sortsol,SZ.side);
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
/* sz: the sizes for the srcset (the box width); pri: a fetchpriority hint. Boxes are sized by the CSS above (aspect-ratio or a fixed height).
   loading and the srcset are written before src, so the browser asks for one file.
   loading is always written: the site footer (tll-core-v2) marks every img without one as lazy at DOMContentLoaded and on load, which would
   catch the two eager photos. */
function img(p,eager,sz,pri){var i=document.createElement('img');i.loading=eager?'eager':'lazy';if(pri)i.setAttribute('fetchpriority',pri);if(V)V.apply(i,sz,p.src);
  i.src=p.src;i.alt=p.alt||'';i.decoding='async';
  i.style.objectPosition=p.pos||'50% 50%';function on(){i.classList.add('tll-ph-in');}
  i.addEventListener('load',on);i.addEventListener('error',function(){if(!i.getAttribute('srcset')&&(!i.currentSrc||i.currentSrc===i.getAttribute('src')))on();});
  if(i.complete&&i.naturalWidth)on();return i;}
function frame(p,eager,sz,pri){var f=el('span','tll-ph-img');f.appendChild(img(p,eager,sz,pri));return f;}
function cap(p){var c=el('span','tll-ph-cap');var b=el('b');b.textContent=p.place;c.appendChild(b);c.appendChild(document.createTextNode(p.by));return c;}
function tile(p,eager,sz,pri){var a=el('a','tll-ph-tile');a.href=p.href;a.appendChild(frame(p,eager,sz,pri));a.appendChild(cap(p));return a;}

function stories(){var h1=document.querySelector('.tll-library-hero h1');if(!h1)return;
  /* Nancy, 29 Oct: "You can not see the search bar on top of scroll". The photos sit under the search bar, not in the hero, and a search
     (?q=) shows its results first with no photos above them. "on the shelf" reads "in the library" (house words). */
  var w=document.createTreeWalker(h1.closest('section')||h1.parentNode,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){if(/next story on the shelf/.test(t.nodeValue))t.nodeValue=t.nodeValue.replace('next story on the shelf','next story in the library');}
  if(document.querySelector('.tll-ph-row'))return;
  if(/[?&]q=[^&]/.test(location.search))return;
  var bar=document.querySelector('section.tllsb-bar');
  /* tiles are about 220px wide on desktop and 46vw on phones; under the search bar the row is lazy, in the hero (no bar) it is eager */
  var row=el('div','tll-ph-row');['ibiza','jaguar','antarctica','fitzroy'].forEach(function(k){row.appendChild(tile(P[k],!bar,SZ.row));});
  if(bar){row.classList.add('tll-ph-row-below');bar.insertAdjacentElement('afterend',row);}else h1.insertAdjacentElement('afterend',row);}
function travelers(){var inner=document.querySelector('.tll-travelers-hero .tll-travelers-hero-inner');if(!inner||inner.querySelector('.tll-ph-faces'))return;
  var ul=el('ul','tll-ph-faces');ul.setAttribute('aria-label','Some of the travelers');
  /* above the fold, so eager, but low priority: the h1 is the page's largest paint, not these 64px circles */
  FACES.forEach(function(f){var li=el('li');var a=el('a','tll-ph-tile');a.href=f.href;a.appendChild(frame({src:f.src,alt:'',pos:f.pos},true,SZ.faces,'low'));
    var c=el('span','tll-ph-cap');var b=el('b');b.textContent=f.name;c.appendChild(b);a.appendChild(c);li.appendChild(a);ul.appendChild(li);});
  inner.insertBefore(ul,inner.firstChild);inner.classList.add('tll-ph-grid');}
function map(){var sec=document.querySelector('section.tll-map-hero');if(!sec||sec.querySelector('.tll-ph-bg'))return;var p=P.sortsol;
  var bg=el('div','tll-ph-bg');bg.setAttribute('aria-hidden','true');bg.appendChild(frame(p,true,SZ.map,'high'));sec.insertBefore(bg,sec.firstChild);sec.classList.add('tll-ph-hasbg');
  var cr=el('a','tll-ph-credit');cr.href=p.href;var b=el('b');b.textContent='Photo';cr.appendChild(b);cr.appendChild(document.createTextNode(' '+p.by+' · '+p.place));sec.appendChild(cr);}
function about(){var hero=document.querySelector('.tll-about-final-hero');if(!hero||hero.querySelector('.tll-ph-strip'))return;
  /* a quarter of the width, 72vw on phones */
  var s=el('div','tll-ph-strip');['ibiza','magnus','fitzroy','jaguar'].forEach(function(k){s.appendChild(tile(P[k],false,SZ.strip));});hero.appendChild(s);}
function expats(){var h1=document.querySelector('main h1')||document.querySelector('h1');var sec=h1&&h1.closest('section');if(!sec||sec.classList.contains('tll-ph-split'))return;
  var copy=el('div','tll-ph-copy');while(sec.firstChild)copy.appendChild(sec.firstChild);sec.appendChild(copy);
  var fig=el('div','tll-ph-side');fig.appendChild(tile(P.sortsol,true,SZ.side,'high')) /* Nancy, 29 Oct: Denmark, where she lives, makes more sense under her credit */;sec.appendChild(fig);sec.classList.add('tll-ph-split');
  var dir=document.querySelector('[data-tll-x="dir"]');if(!dir||document.querySelector('.tll-ph-band'))return;
  var band=el('section','tll-ph-band');band.setAttribute('aria-labelledby','tll-ph-band-t');var lab=el('p','tll-ph-label');lab.id='tll-ph-band-t';lab.textContent='From the stories';band.appendChild(lab);
  /* roughly 340px columns, 72vw on phones */
  var three=el('div','tll-ph-three');['montenegro','lapaz','ghana'].forEach(function(k){three.appendChild(tile(P[k],false,SZ.band));});band.appendChild(three);
  dir.insertAdjacentElement('afterend',band);}

function run(){if(!document.getElementById('tll-page-heroes-v1')){var s=el('style');s.id='tll-page-heroes-v1';s.textContent=CSS;document.body.appendChild(s);}
  try{({'/stories':stories,'/travelers':travelers,'/the-map':map,'/about':about,'/for-expats':expats})[path]();}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
/* src/site-layers/tll-home-bands-v1.js */
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
    /* 10 Nov 2026 (week one item 4): the band no longer drops to the 2400 px original on every screen. Its srcset comes from the photo's
       site-bucket twin variants (tll-img-variants-v1, full width), written before src so the photo is fetched once; with no variants
       known the srcset is cleared and the original loads as before. */
    var V=window.__tllImgV;if(!(V&&V.apply(i,'100vw',p.src))){i.removeAttribute('srcset');i.removeAttribute('sizes');}
    i.src=p.src;i.alt=p.alt;i.width=p.w;i.height=p.h;i.style.objectPosition=p.pos;
    var a=document.createElement('a');a.href=p.href;a.appendChild(document.createTextNode(p.label+' · '));
    var b=document.createElement('b');b.textContent=p.by;a.appendChild(b);c.textContent='';c.appendChild(a);
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',swap);else swap();
})();
/* src/site-layers/tll-lounge-labels-v1.js */
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
/* src/site-layers/tll-stories-noimg-v1.js */
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
/* src/site-layers/tll-mbar-align-v1.js */
(function(){
var CSS="html body nav.tll-mbar{box-sizing:border-box;width:100%;padding-left:max(24px,calc((100% - 1208px) / 2 + 12px))!important;padding-right:max(24px,calc((100% - 1208px) / 2 + 12px))!important;column-gap:28px}"+
"html body nav.tll-mbar a[aria-current=\"page\"]{border-bottom-color:#C8325B}"+
"html body nav.tll-mbar a:focus-visible{outline-color:#C8325B}"+
"@media (max-width:767px){html body nav.tll-mbar{padding-left:24px!important;padding-right:24px!important;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;column-gap:22px}html body nav.tll-mbar::-webkit-scrollbar{display:none}html body nav.tll-mbar a{flex:0 0 auto}}";
function add(){if(document.getElementById('tll-mbar-align-v1'))return;var s=document.createElement('style');s.id='tll-mbar-align-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
add();
})();
/* src/site-layers/tll-photos-form-v2.js */
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
/* src/site-layers/tll-home-value-v1.js */
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
/* 7 Nov 2026 (baseline audit): inserted at DOMContentLoaded, the section landed after the phone had painted the cover and pushed
   "01 · The stories" about 1,000 px down (layout shift 0.70 on the live home page). Now it goes in as soon as the parser has
   created the hero, before the first paint; DOMContentLoaded and the 1.5 s timer stay as fallbacks. This layer is in the core. */
if(document.readyState==='loading'){
  if(window.MutationObserver){var mo=new MutationObserver(function(){if(document.querySelector('[data-h3-hero]')){run();if(document.getElementById('tll-val'))mo.disconnect();}});
    mo.observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener('DOMContentLoaded',function(){mo.disconnect();});}
  document.addEventListener('DOMContentLoaded',run);
}else run();
setTimeout(run,1500);
})();
/* src/site-layers/tll-album-settings-v1.js */
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
if(P==='/edit-profile'){var n=0,poll=function(){var iv=setInterval(function(){n++;var st=document.getElementById('tll-st'),any=st||document.getElementById('tll-col')||document.getElementById('ep-crew');if(st||(any&&n>=5)||n>=30){clearInterval(iv);editProfile();}},500);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',poll);else poll();}
})();
/* src/site-layers/tll-division-v1.js */
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
/* src/site-layers/tll-phase0-v1.js */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
var STUB='the-art-of-wellbeing-thailand-luxury-health-destination-2026';
/* 11 Nov 2026: the story search index ships in the same release commit as the core (the slim layers-release branch; the main
   branch is over jsDelivr's 50 MB package limit). The core's chunk loader sets window.__tllLayersBase to its own folder, so the
   index always matches the release that is live and no pin is written here. Without it (core not loaded from its URL) no index. */
var INDEX=null;try{if(window.__tllLayersBase)INDEX=new URL('../data/story-search-index.json',window.__tllLayersBase).href;}catch(e){}
function css(t,id){if(document.getElementById(id))return;var s=document.createElement('style');s.id=id;s.textContent=t;document.head.appendChild(s);}
function norm(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();}
function member(cb){var n=0,iv=setInterval(function(){var ms=window.$memberstackDom;if(ms&&ms.getCurrentMember){clearInterval(iv);ms.getCurrentMember().then(function(r){cb(!!(r&&r.data));}).catch(function(){cb(false);});}else if(++n>40){clearInterval(iv);cb(false);}},150);}

/* Old addresses (Phase 0, Nancy approved 31 Oct). Real 301s belong in Webflow Site settings; until Nancy adds them this sends people on.
   /my-passport is a draft page now, so this runs on the 404 page it lands on. */
/* 8 Nov: the empty pages are drafts (Nancy), so their addresses and /for-affiliates go to the nearest live page. 10 Nov: all of these
   have Webflow 301s now (Nancy's combined import); this map stays as the fallback in case an import replaces the list again. */
var MOVED={'/countries':'/destinations','/for-affiliates':'/travelers','/newsletter':'/','/creators':'/travelers','/awards':'/stories',
  '/spotlight':'/travelers','/pets':'/the-paw-passport','/pillars/paw-passport':'/the-paw-passport','/my-passport':'/the-map'};
if(MOVED[P]){location.replace(MOVED[P]+(location.search||''));}
/* Noindex until they have content: /spotlight, /awards, /creators, /travel-wire (8 Nov: other publishers' headlines; kept, out of the index), contributor profiles with no stories yet and, from 1 Nov, pending pursuit
   hubs (/pursuits/{slug}) at parse time, before the pursuits chunk arrives; tll-stamps-v1 reuses this meta and lifts it when the hub is indexable. */
function noindex(){var m=document.querySelector('meta[name="robots"]');if(!m){m=document.createElement('meta');m.name='robots';document.head.appendChild(m);}m.content='noindex, follow';}
if(/^\/(spotlight|awards|creators|travel-wire)$|^\/pursuits\/[^/]+$/.test(P))noindex();
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
  if(q&&q.trim()&&INDEX){var words=norm(q).split(/\s+/).filter(function(w){return w.length>2;});
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
/* src/site-layers/tll-drafted-v1.js */
(function(){
var P=location.pathname.replace(/\/+$/,'')||'/';
if(document.getElementById('tll-drafted-v1'))return;
var s=document.createElement('style');s.id='tll-drafted-v1';
s.textContent='footer a[href="/awards"],footer a[href="/spotlight"],footer a[href="/creators"],'+
  '[data-tll-fyp="travelers"] a.tll-fyp-pill[href="/creators"],a.tll-fyp-pill[href="/creators"],'+
  '.tll-account-settings-grid a.tll-account-settings-card[href="/newsletter"],'+
  '.ep-dir a.ep-mono[href="/creators"]{display:none!important}';
if(P==='/travel-wire')s.textContent+='.inline-div-12-1-2-3-4-5-6-7-8-9-10-11-12{display:none!important}';
document.head.appendChild(s);
if(P==='/travel-wire'){var desk=function(){[].slice.call(document.querySelectorAll('div')).some(function(d){if(d.children.length||!/^THE BLOG DESK/i.test((d.textContent||'').trim()))return false;
    var b=d.closest('[class^="inline-div-12-"]')||d.parentElement&&d.parentElement.parentElement&&d.parentElement.parentElement.parentElement;if(b)b.style.display='none';return true;});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',desk);else desk();}
if(/^\/edit-profile/.test(P)){var fix=function(){[].slice.call(document.querySelectorAll('[data-ep-makes] p.ep-note, p.ep-note')).forEach(function(p){
    var w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){if(t.nodeValue.indexOf('/creators')>-1)t.nodeValue=t.nodeValue.split('/creators').join('/travelers');}});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();setTimeout(fix,1500);}
})();
/* src/site-layers/tll-ads-v1.js */
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
/* 1 Nov 2026 (loading): after ad consent the script is fetched only once the browser is idle (requestIdleCallback, 4 s at the latest;
   a 2 s timer where that is missing), so it never competes with the page's own images and fonts. It loads on every allowed page whether
   or not the slot ids are filled, so Auto ads behave as before; only the manual units above wait for their ids. The consent gate is unchanged. */
function idle(cb){if(window.requestIdleCallback)window.requestIdleCallback(function(){cb();},{timeout:4000});else setTimeout(cb,2000);}
function run(){css();consented(function(){idle(script);});if(/^\/stories\/[^/]+$/.test(P))story();else if(P==='/stories')library();else if(/^\/countries\//.test(P))country();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,600);});else setTimeout(run,600);
})();
/* src/site-layers/tll-pwa-hold-v1.js */
(function(){
var PWA_LIVE=false;
var pv=/[?&]preview=pwa(&|$)/.test(location.search);try{pv=pv||localStorage.getItem('tll-preview-pwa')==='1';}catch(e){}
if(PWA_LIVE||pv||location.hostname==='pwa-preview.thatlayover.life'||typeof window.fetch!=='function'||typeof window.Response!=='function'||window.__tllPwaHold)return;
window.__tllPwaHold=1;
var f=window.fetch;
function held(input){try{var u=typeof input==='string'?input:(input&&input.url)||String(input||'');var a=new URL(u,location.href);
  return a.origin===location.origin&&a.pathname==='/sw.js';}catch(e){return false;}}
window.fetch=function(input){
  if(held(input))return Promise.resolve(new Response(null,{status:404,statusText:'PWA not live'}));
  return f.apply(this,arguments);};
})();
(function(){if(!/^\/stories\/[^/]+\/?$/.test(location.pathname))return;if(document.getElementById('tll-mag-story-v1'))return;
function place(){var s=document.createElement('style');s.id='tll-mag-story-v1';s.textContent="/* The magazine story page, layer v1 (26 Oct 2026). handoff/CREATIVE-DIRECTION-2026-10-26.md, direction A with the stamp.\n   10 Nov 2026: the type system. Headlines Playfair Display 800 (the only weight the site loads, so every display rule says 800),\n   text IBM Plex Sans Condensed, eyebrows and labels JetBrains Mono (400 and 600 loaded); no Newsreader, no Inter Tight, no font link\n   of its own (the site head loads Playfair and JetBrains Mono, Webflow loads Plex). Negative tracking capped at -.01em for the heavier face.\n   Loads after tll-v9-j13-v1 (head) and before tll-st3-story-v1 (footer) and overrides both by specificity and !important.\n   Restyles only: no element is removed, no binding changes, no data-* hook moves except the two the script makes (the hero caption\n   under the photo and the author row into the head). Rose means \"you can press this\". One gutter, one radius, one measure. */\n:root{--st3-f-head:'Playfair Display',Georgia,serif;--st3-f-body:'IBM Plex Sans Condensed',system-ui,sans-serif;\n  --mg-ink:#0A0B14;--mg-cream:#F7F1E8;--mg-paper:#FDF9F3;--mg-line:#D8D0C4;--mg-text:#2a2a2a;--mg-muted:#6B6660;--mg-rose:#C8325B;--mg-teal:#067A79;\n  --mg-head:'Playfair Display',Georgia,serif;--mg-text-f:'IBM Plex Sans Condensed',system-ui,sans-serif;--mg-mono:'JetBrains Mono',ui-monospace,monospace;--mg-m:16px;--mg-r:4px}\n@media(min-width:900px){:root{--mg-m:40px}}\n.tll-story-article{font-family:var(--mg-text-f)}\n\n/* the head: words first, then the photo, then its caption */\n.tll-story-hero{display:flex !important;flex-direction:column !important;align-items:stretch !important;min-height:0 !important;background:var(--mg-cream) !important;padding:0 0 8px !important;overflow:visible !important}\n.tll-story-hero-overlay{order:-1;position:static !important;min-height:0 !important;background:none !important;display:block !important;padding:0 !important}\n.tll-story-hero-content{display:grid;grid-template-columns:minmax(0,1fr);row-gap:0;max-width:1280px !important;padding:28px var(--mg-m) 24px !important}\n.tll-story-hero-content>*{grid-column:1;min-width:0}\n.tll-mg-fig{position:relative;width:calc(100% - 2*var(--mg-m));max-width:1200px;margin:0 auto}\n.tll-story-hero-img{position:relative !important;inset:auto !important;display:block;width:100% !important;height:auto !important;max-height:85vh;aspect-ratio:auto;object-fit:cover !important;margin:0 !important;border-radius:var(--mg-r);transform:none !important}\n.tll-mg-cap{display:flex;justify-content:space-between;gap:16px;margin:10px 0 0;font:400 13px/1.4 var(--mg-text-f);color:var(--mg-muted)}\n.tll-mg-cap b{font-weight:500;color:var(--mg-ink)}\n.tll-mg-cap:empty{display:none}\n.tll-story-hero [data-tll-breadcrumb]{display:flex;flex-wrap:wrap;align-items:center;font:500 13px/1.4 var(--mg-text-f) !important;color:var(--mg-muted) !important;margin:0 0 10px !important;letter-spacing:0 !important;text-transform:none !important}\n.tll-story-hero [data-tll-breadcrumb] a{display:inline-flex;align-items:center;min-height:44px;color:var(--mg-muted) !important;text-decoration:none}\n.tll-story-hero [data-tll-breadcrumb] span{color:var(--mg-line) !important;margin:0 6px}\n.tll-story-hero .tll-story-meta-row{display:flex !important;flex-wrap:wrap;gap:0 8px;margin:0 !important;background:none !important;padding:0 !important;border-radius:0 !important;backdrop-filter:none !important}\n.tll-story-hero .tll-story-meta-row .tll-eyebrow-teal{font:600 12px/1.4 var(--mg-mono) !important;letter-spacing:.12em !important;text-transform:uppercase !important;color:var(--mg-rose) !important;background:none !important;border:0 !important;padding:0 !important;margin:0 !important;border-radius:0 !important}\n.tll-story-hero .tll-story-meta-row .tll-story-meta-divider:has(+ .w-dyn-bind-empty),.tll-story-hero .tll-story-meta-row .tll-story-meta-divider:has(+ .tll-story-reading-time){display:none !important}\n.tll-story-hero .tll-story-meta-row .tll-eyebrow-teal img{display:none !important}\n.tll-story-hero .tll-story-meta-divider{color:var(--mg-rose) !important;font:600 12px/1.4 var(--mg-mono) !important;width:auto !important;height:auto !important;margin:0 !important;padding:0 !important;background:none !important;border:0 !important;opacity:1 !important}\n.tll-story-hero .tll-story-meta-divider:empty::before{content:\"\\00b7\"}\n.tll-story-hero .tll-story-reading-time{display:none !important}\nh1.tll-story-title{font-family:var(--mg-head) !important;font-weight:800 !important;font-size:clamp(34px,8.5vw,48px) !important;line-height:1.04 !important;letter-spacing:-.01em !important;color:var(--mg-ink) !important;text-shadow:none !important;margin:14px 0 0 !important;text-wrap:balance;max-width:none !important}\n.tll-story-excerpt{font-family:var(--mg-text-f) !important;font-weight:400 !important;font-size:20px !important;line-height:1.45 !important;color:var(--mg-text) !important;max-width:44ch !important;margin:18px 0 0 !important}\n.tll-story-hero .tll-story-author-top{display:none !important}\n.tll-story-hero [data-tll-hero-caption]{display:none !important}\n/* the byline, moved into the head by the script */\n.tll-story-hero-content .st3-author{margin:24px 0 0 !important;padding:0 !important;border:0 !important}\n.tll-story-hero-content .st3-author-avatar{width:44px;height:44px;border:0}\n.tll-story-hero-content .st3-author-name{font:600 16px/1.3 var(--mg-text-f);color:var(--mg-ink)}\n.tll-story-hero-content .st3-author-name::after{content:none}\n.tll-story-hero-content .st3-author-filed{font:400 14px/1.4 var(--mg-text-f);letter-spacing:0;text-transform:none;color:var(--mg-muted);margin-top:2px}\n.tll-story-hero-content .st3-author-filed [data-st3-loc]{text-transform:capitalize}\n.tll-mg-stamp{position:absolute;right:12px;top:12px;width:96px;color:var(--mg-cream);opacity:.95}\n.tll-mg-stamp svg{display:block;width:100%;height:auto}\n@media(min-width:900px){\n  .tll-story-hero-content{padding:48px var(--mg-m) 32px !important}\n  .tll-mg-stamp{width:150px;right:24px;top:24px}\n  h1.tll-story-title{font-size:clamp(46px,4.9vw,72px) !important;line-height:1.02 !important;max-width:16ch !important}\n  .tll-story-excerpt{font-size:22px !important}\n  .tll-story-hero-img{max-height:min(85vh,820px)}\n}\n\n/* the reading column */\n.tll-story-body-section{padding-top:40px !important}\n.tll-story-body>.st3-from{font:400 14px/1.5 var(--mg-text-f);color:var(--mg-muted)}\n.tll-story-body>.st3-from a{color:var(--mg-ink);text-decoration:underline;text-decoration-color:var(--mg-rose);text-underline-offset:3px}\n.tll-story-body>.st3-lede{display:none !important}\n.tll-story-body>.w-richtext.tll-body{font-family:var(--mg-text-f) !important;font-size:19px !important;line-height:1.6 !important;color:var(--mg-text) !important}\n.tll-story-body>.w-richtext.tll-body p{margin:0 0 1.2em}\n.tll-story-body>.w-richtext.tll-body>p:first-child::first-letter{font-family:var(--mg-head);font-size:3.6em;line-height:.85;float:left;padding:.08em .1em 0 0;color:var(--mg-ink);font-weight:800}\n.tll-story-body>.w-richtext.tll-body h2,.tll-story-body>.w-richtext.tll-body h3{font-family:var(--mg-head);font-weight:800;font-size:28px;line-height:1.1;letter-spacing:-.01em;margin:1.4em 0 .5em;color:var(--mg-ink)}\n.tll-story-body>.w-richtext.tll-body h3{font-size:24px}\n.tll-story-body>.w-richtext.tll-body a{color:var(--mg-ink);text-decoration:underline;text-decoration-color:var(--mg-rose);text-decoration-thickness:2px;text-underline-offset:4px}\n.tll-story-body>.tll-story-pullquote{background:none !important;border:0 !important;border-left:3px solid var(--mg-rose) !important;border-radius:0 !important;padding:0 0 0 20px !important;margin:8px 0 32px !important;font-family:var(--mg-head) !important;font-style:italic !important;font-weight:800 !important;font-size:24px !important;line-height:1.3 !important;letter-spacing:-.01em;color:var(--mg-ink) !important}\n.tll-story-body>.tll-aeo-box{background:var(--mg-paper) !important;border:1px solid var(--mg-line) !important;border-radius:var(--mg-r) !important;padding:24px 20px !important}\n.tll-story-body>.tll-aeo-box .tll-aeo-eyebrow{font:800 24px/1.1 var(--mg-head) !important;letter-spacing:-.01em !important;text-transform:none !important;color:var(--mg-ink) !important;margin:0 0 6px !important}\n.tll-story-body>.tll-aeo-box .w-richtext{font-family:var(--mg-text-f) !important;font-size:16px !important;line-height:1.55 !important;color:var(--mg-text) !important}\n.tll-story-body>.tll-aeo-box .w-richtext p{margin:12px 0 0}\n.tll-story-body>.tll-aeo-box .w-richtext p strong{display:block;font-family:var(--mg-head);font-weight:800;font-size:19px;color:var(--mg-ink);letter-spacing:-.01em;margin-top:8px}\n[data-tll-links-card]>:first-child{font:600 11px/1.4 var(--mg-mono) !important;letter-spacing:.12em !important;text-transform:uppercase !important;color:var(--mg-muted) !important}\n[data-tll-links-card] .w-richtext a{text-decoration-color:var(--mg-rose) !important}\n.tll-story-share-row .tll-story-share-label{font:500 12px/1.4 var(--mg-text-f) !important;letter-spacing:.06em;color:var(--mg-muted) !important}\n.tll-story-share-row .tll-story-share-link{font:600 14px/1 var(--mg-text-f) !important;border-radius:0 !important}\n\n/* after the story: same type, rose for taps */\n.tll-eyebrow-teal,.tll-eyebrow-rose,.tll-aeo-eyebrow,[data-tll-places] [data-tll-places-label],[data-tll-ledger] .tll-sl-title,[data-tll-ledger] .tll-ledger-k,.st3-tw-h,.st3-cc-badge,.st3-aff-k,.st3-trip-k,.st3-trip-by,[data-tll-places] [data-tll-places-note]{font-family:var(--mg-mono) !important;letter-spacing:.1em !important}\n.tll-story-aftermatter .tll-related-header .tll-eyebrow-teal,.tll-story-feedback .tll-eyebrow-teal{font:600 11px/1.4 var(--mg-mono) !important;letter-spacing:.12em !important;color:var(--mg-muted) !important}\n.tll-story-aftermatter .tll-related-header h2{font-family:var(--mg-head) !important;font-weight:800 !important;letter-spacing:-.01em;font-size:clamp(28px,3.6vw,40px) !important;line-height:1.05 !important}\n.tll-story-aftermatter .tll-related-header h2 .tll-text-rose{color:inherit !important;font-style:italic}\n.tll-related-card{text-decoration:none !important;color:var(--mg-ink) !important}\n.tll-related-img-wrap{border-radius:var(--mg-r);overflow:hidden}\n.tll-related-loc{font:600 11px/1.4 var(--mg-mono) !important;letter-spacing:.12em !important;text-transform:uppercase !important;color:var(--mg-muted) !important;margin-top:12px}\n.tll-related-headline{font-family:var(--mg-head) !important;font-weight:800 !important;font-size:22px !important;line-height:1.12 !important;letter-spacing:-.01em !important;color:var(--mg-ink) !important;margin:6px 0 0 !important}\n.tll-related-meta{font:400 13px/1.4 var(--mg-text-f) !important;color:var(--mg-muted) !important}\n.st3-cc-name{font-weight:800 !important;letter-spacing:-.01em !important}\n.st3-cc-avatar,.st3-author-avatar{border-color:var(--mg-line) !important}\n.st3-cc-link,.st3-author-name{color:var(--mg-ink) !important;text-decoration-color:var(--mg-rose) !important}\n[data-tll-story-cta]>div:first-child>div:first-child{font-weight:800 !important;letter-spacing:-.01em !important}\n.st3-trip-h{font-weight:800 !important}\n[data-tll-ledger] .tll-sl-title{font-weight:600 !important}\n[data-tll-ledger] .tll-ledger-note a,.tll-feedback-link{text-decoration-color:var(--mg-rose) !important}\n.tll-story-feedback p{font-family:var(--mg-text-f)}\n.tll-story-article a:focus-visible,.tll-story-article button:focus-visible{outline-color:var(--mg-rose) !important}\n/* 26 Oct, from Nancy's subdomain check: spacing, the From line, the invite, the sign-off, inline photos and the gallery */\n.tll-story-body>.st3-from{margin:0 0 28px !important}\n.tll-story-body>.st3-from [data-st3-from-part=\"city\"]:not(:empty)::after{content:\", \"}\n.tll-story-body>.st3-from a+a:not(:empty)::before,.tll-story-body>.st3-from [data-st3-from-part=\"pursuit\"]:not(:empty)::before{content:\"\\00b7\";color:var(--mg-muted);text-decoration:none;display:inline-block;margin:0 .45em}\n.tll-story-body>.st3-from a.w-dyn-bind-empty,.tll-story-body>.st3-from a:empty{display:none}\n.tll-story-body>.w-richtext.tll-body{margin-bottom:40px !important}\n.tll-story-body .tll-persp-ask{margin:0 0 32px !important;padding:24px 0 0 !important;border-top:1px solid var(--mg-line) !important;font:400 16px/1.5 var(--mg-text-f) !important;color:var(--mg-text) !important}\n.tll-story-body .tll-persp-ask b{font-weight:600;color:var(--mg-ink)}\n.tll-story-body .tll-persp-ask a{color:var(--mg-ink) !important;font-weight:600 !important;text-decoration:underline !important;text-decoration-color:var(--mg-rose) !important;text-decoration-thickness:2px !important;text-underline-offset:4px !important;display:inline-flex;align-items:center;min-height:44px}\n.tll-story-body>.tll-aeo-box,.tll-story-body>[data-tll-links-card]{margin:0 0 32px !important}\n.tll-story-body .tll-signoff{margin:8px 0 40px !important;padding:28px 0 0 !important;border-top:1px solid var(--mg-line) !important;color:var(--mg-ink) !important}\n.tll-story-body .tll-signoff-rule{width:40px;height:3px;background:var(--mg-rose) !important;border-radius:0;margin:0 0 14px}\n.tll-story-body .tll-signoff-label{font:600 11px/1.4 var(--mg-mono) !important;letter-spacing:.12em;text-transform:uppercase;color:var(--mg-muted) !important}\n.tll-story-body .tll-signoff-name{font:800 28px/1.1 var(--mg-head) !important;letter-spacing:-.01em;color:var(--mg-ink) !important;margin:6px 0 4px}\n.tll-story-body .tll-signoff-loc{font:italic 400 16px/1.4 var(--mg-text-f) !important;color:var(--mg-text) !important}\n.tll-story-body .tll-story-share-row{margin:0 0 8px}\n.tll-story-body .tll-inline-photo{margin:2em 0 2.4em !important;max-width:none !important;width:auto !important;padding:0}\n.tll-story-body .tll-inline-photo a{display:block;border-radius:var(--mg-r);overflow:hidden}\n.tll-story-body .tll-inline-photo img{display:block;width:100%;height:auto;max-height:none;object-fit:cover;border-radius:var(--mg-r)}\n.tll-story-body .tll-inline-photo figcaption{font:400 13px/1.45 var(--mg-text-f);color:var(--mg-muted);margin:10px 0 0;text-wrap:pretty}\n@media(min-width:900px){.tll-story-body .tll-inline-photo{margin:2.4em calc(-1*min(6vw,100px)) 2.8em !important}.tll-story-body .tll-inline-photo figcaption{padding:0 min(6vw,100px)}}\n.tll-story-gallery{background:var(--mg-cream) !important;padding:48px 0 56px !important}\n.tll-gallery-inner{max-width:1200px !important;padding:0 var(--mg-m) !important}\n.tll-gallery-label{font:800 28px/1.1 var(--mg-head) !important;letter-spacing:-.01em !important;text-transform:none !important;color:var(--mg-ink) !important;margin:0 0 20px !important}\n.tll-gallery-grid{display:grid !important;grid-template-columns:repeat(2,1fr) !important;gap:8px !important}\n@media(min-width:600px){.tll-gallery-grid{grid-template-columns:repeat(3,1fr) !important;gap:12px !important}}\n@media(min-width:900px){.tll-gallery-grid{grid-template-columns:repeat(4,1fr) !important}}\n.tll-gallery-link{display:block;border-radius:var(--mg-r);overflow:hidden;background:var(--mg-ink2)}\n.tll-gallery-img{width:100% !important;height:auto !important;aspect-ratio:1 !important;object-fit:cover !important;border-radius:0 !important;display:block}\n.tll-story-aftermatter{padding-top:48px !important}\n.tll-aftermatter-container{gap:36px !important}\n";document.body.appendChild(s);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();
/* Three small moves the CSS cannot make: the hero caption goes under the photo with the writer's credit, the author row (the bound
   byline) moves into the head with the reading time, and the stamp is drawn from the story's byline location (the data-st3-byline attribute, as the st3 script reads it; the span's own text is the contributor's home), the date and the pillar.
   Nothing is deleted; the caption element is hidden, not removed. Runs once. */
(function(){
var SVG='<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><defs><filter id="tll-mg-ink" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter><path id="tll-mg-top" d="M30,100 A70,70 0 1,1 170,100"/><path id="tll-mg-bottom" d="M34,100 A66,66 0 0,0 166,100"/></defs><g filter="url(#tll-mg-ink)"><g fill="none" stroke="currentColor"><circle cx="100" cy="100" r="94" stroke-width="3"/><circle cx="100" cy="100" r="86" stroke-width="1.2"/><circle cx="100" cy="100" r="58" stroke-width="1.2"/></g><g fill="currentColor" font-family="\'JetBrains Mono\',ui-monospace,monospace" text-anchor="middle"><text font-size="12.5" font-weight="600" letter-spacing="3"><textPath href="#tll-mg-top" startOffset="50%">THAT LAYOVER LIFE</textPath></text><text font-size="9" letter-spacing="1.4"><textPath href="#tll-mg-bottom" startOffset="50%">{A}</textPath></text><text x="100" y="82" font-size="8" letter-spacing="3" font-weight="600">TLL</text><text x="100" y="{Y}" font-size="{S}" font-weight="600" letter-spacing="1">{P}</text><text x="100" y="124" font-size="9.5" letter-spacing="2">{D}</text></g></g></svg>';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
/* 8 Nov 2026 (Nancy: "That stamp is kind of a mess"): long place names were cut at 16 letters (TEXAS HILL COUNT). Names up to 10
   letters stay on one line at 16px; longer ones break at a space onto two lines at 11px, so the whole name fits inside the inner ring. */
function stampText(svg,place){var p=String(place||'');var s=p.length>10?'11':'16';var y='106';var txt=esc(p);
  if(p.length>10){var i=p.lastIndexOf(' ',13);if(i<4)i=p.indexOf(' ');if(i>0){txt='<tspan x="100" dy="0">'+esc(p.slice(0,i))+'</tspan><tspan x="100" dy="12">'+esc(p.slice(i+1))+'</tspan>';y='100';}
    else if(p.length>14){s='9';}}
  /* 10 Nov 2026 (week-one hygiene, item 9): every stamp carried the same filter and path ids (tll-mg-ink, -top, -bottom), 59 copies on the home
     page. Each copy now gets its own suffix from one page-wide counter, so url(#...) and the textPath href point at their own defs. */
  var u=(window.__tllMgN=(window.__tllMgN||0)+1);svg=svg.replace(/tll-mg-(ink|top|bottom)/g,'tll-mg-$1-'+u);
  return svg.replace('{P}',txt).replace('{S}',s).replace('{Y}',y);}
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
  var place=(loc.split(',')[0]||'').trim().toUpperCase();
  var when=txt(document.querySelector('[data-st3-when]')),d=when.match(/(\d{1,2}) (\w{3})\w* (\d{4})/)||when.match(/(\w{3})\w* (\d{1,2}),? (\d{4})/);
  var date=d?(d[0].match(/^\d/)?(('0'+d[1]).slice(-2)+' '+d[2].toUpperCase()+' '+d[3]):(('0'+d[2]).slice(-2)+' '+d[1].toUpperCase()+' '+d[3])):'';
  var pills=document.querySelectorAll('.tll-story-meta-row .tll-eyebrow-teal'),pill=pills.length>1?txt(pills[1]).toUpperCase():'';
  var arc=pill||'BY THE PEOPLE WHO WENT';
  var le=document.querySelector('.st3-author-filed [data-st3-loc]');if(le&&le.textContent===le.textContent.toUpperCase())le.textContent=le.textContent.toLowerCase().replace(/(^|[\s-])([a-z])/g,function(m,a,b){return a+b.toUpperCase();});
  if(place){var st=document.createElement('span');st.className='tll-mg-stamp';st.setAttribute('aria-hidden','true');
    st.innerHTML=stampText(SVG,place).replace('{D}',esc(date)).replace('{A}',esc(arc));var fg=hero.querySelector('.tll-mg-fig');(fg||c).appendChild(st);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
/* 10 Nov 2026 (Lighthouse baseline, landmark-one-main): the story template has no <main>. The story's own container,
   article.tll-story-article, takes role="main" in place; nothing is wrapped or moved. Skipped when the page already has a main. */
function main(){if(document.querySelector('main,[role="main"]'))return;var a=document.querySelector('article.tll-story-article');if(a)a.setAttribute('role','main');}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',main);else main();
})();

/* Captions under inline photos, from the photo's own CMS alt text (never invented). The photos are placed by a later script, so this watches for them. */
(function(){function cap(){var n=0;[].forEach.call(document.querySelectorAll('.tll-story-body figure.tll-inline-photo'),function(f){if(f.querySelector('figcaption'))return;var im=f.querySelector('img'),a=im&&(im.getAttribute('alt')||'').trim();if(!a||/^[a-z0-9-]+$/.test(a)&&a.indexOf(' ')<0)return;var c=document.createElement('figcaption');c.textContent=a;f.appendChild(c);n++;});return n;}
function arm(){cap();var b=document.querySelector('.tll-story-body');if(!b||!('MutationObserver' in window))return;var mo=new MutationObserver(function(){cap();});mo.observe(b,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();},15000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arm);else arm();window.addEventListener('load',cap);})();
})();
(function(){if(!/^\/(index\.html)?$/.test(location.pathname))return;if(document.getElementById('tll-mag-cover-v1'))return;
/* F1: the style goes in at once, so the cover is styled from the first paint; it moves to the end of the body once the page is parsed, as in v9 to v15. */
var CS=document.createElement('style');CS.id='tll-mag-cover-v1';CS.textContent="/* The magazine cover (26 Oct 2026, direction A, Nancy: \"I prefer the full page image hero\"). Home page only. Restyles the existing\n   [data-h3-hero] block: the cover story's photo full bleed, a chip with the writer's face (\"Photo: {Name}, {Place}\"; Phase 0, 31 Oct: \"went to\" read like a live check-in), the kicker,\n   the site's own headline in Playfair Display 800 (10 Nov 2026: the type system; Newsreader and Inter Tight are gone), the deck, a button to the cover story and a Join free button (29 Oct), the photo credit with coordinates, and the stamp,\n   which lands once on load. No element removed: the eyebrow, the FREE line and the old coordinates are hidden.\n   Since v16 this style sits in the head from the first paint and moves to the end of the body once the page is parsed, so every hero rule\n   carries one extra type selector (html body) and beats the page's own tll-home-hero-phone-v1 rules in either position (1 Nov 2026: with\n   the same specificity the page's phone rules won until the move, and the headline and deck resized after load). */\nhtml body:not(.tll-none) [data-h3-hero]{position:relative !important;min-height:calc(100vh - 96px) !important;min-height:max(calc(100svh - 96px),640px) !important;display:flex !important;flex-direction:column !important;justify-content:flex-end !important;margin:0 !important;padding:0 !important;border:0 !important;border-radius:0 !important;overflow:hidden !important;background:#0A0B14 !important;--tll-cover-pos:var(--tll-cover-pos-phone,50% 50%)}\nhtml body:not(.tll-none) [data-h3-hero] > img[data-tll-parallax=\"hero\"]{position:absolute !important;inset:0 !important;top:calc(-1 * var(--tll-cover-zoom,0%)) !important;bottom:auto !important;width:100% !important;height:calc(100% + var(--tll-cover-zoom,0%)) !important;max-width:none !important;object-fit:cover !important;object-position:var(--tll-cover-pos) !important;border-radius:0 !important;transform:none !important;opacity:1 !important;filter:none !important}\nhtml body:not(.tll-none) [data-h3-hero]::after{content:\"\" !important;position:absolute !important;inset:0 !important;z-index:1 !important;pointer-events:none !important;background:linear-gradient(180deg,rgba(10,11,20,.32) 0%,rgba(10,11,20,0) 20%,rgba(10,11,20,0) 46%,rgba(10,11,20,.42) 66%,rgba(10,11,20,.84) 100%) !important}\nhtml body:not(.tll-none) [data-h3-hero] > div:has(> h1){position:relative !important;z-index:2 !important;width:100% !important;max-width:none !important;margin:0 !important;padding:0 16px max(clamp(40px,8vh,80px),76px) !important;box-sizing:border-box !important}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-eyebrow{display:none !important}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-chip{display:inline-flex !important;align-items:center;gap:10px;padding:6px 14px 6px 6px;min-height:48px;border-radius:999px;background:rgba(10,11,20,.6);color:#F7F1E8 !important;text-decoration:none !important;font:400 13px/1.2 'IBM Plex Sans Condensed',system-ui,sans-serif;margin:0 0 18px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);max-width:100%}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-chip img{width:36px;height:36px;border-radius:50%;object-fit:cover;flex:0 0 36px;position:static;box-shadow:0 0 0 1.5px #F0507A}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-chip b{display:block;font-weight:500;font-size:15px}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-chip:hover b,html body:not(.tll-none) [data-h3-hero] .tll-mg-chip:focus-visible b{text-decoration:underline;text-decoration-color:#F0507A;text-underline-offset:3px}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-chip:focus-visible{outline:3px solid #F0507A;outline-offset:2px}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-kicker{display:block !important;font:600 12px/1.3 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#F7F1E8;opacity:.85;margin:0 0 12px}\nhtml body:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title){font-family:'Playfair Display',Georgia,serif !important;font-weight:800 !important;font-size:clamp(42px,11vw,58px) !important;line-height:1 !important;letter-spacing:-.01em !important;max-width:12ch !important;margin:0 !important;padding:0 !important;color:#F7F1E8 !important;text-wrap:balance}\nhtml body:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) em{font-style:italic;color:inherit}\nhtml body:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p{font-family:'IBM Plex Sans Condensed',system-ui,sans-serif !important;font-size:19px !important;line-height:1.45 !important;max-width:36ch !important;margin:16px 0 0 !important;color:#E8E2D8 !important;text-wrap:pretty}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-cta{display:flex !important;flex-direction:column !important;gap:12px !important;margin:24px 0 0 !important;position:relative;z-index:3}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn{flex:none !important;width:100% !important;min-height:48px !important;box-sizing:border-box !important;justify-content:center !important;border-radius:0 !important;font:600 16px/1 'IBM Plex Sans Condensed',system-ui,sans-serif !important;letter-spacing:0 !important;background:#D63859 !important;color:#fff !important;border-color:transparent !important}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn:hover{background:#B82C4B !important}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn:focus-visible{outline:3px solid #F7F1E8 !important;outline-offset:2px}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn.tll-mg-join{background:transparent !important;color:#F7F1E8 !important;border:1.5px solid #F7F1E8 !important}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn.tll-mg-join:hover{background:#F7F1E8 !important;color:#0D0F1A !important}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn + .h3-btn:not(.tll-mg-join){display:none !important}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-free{display:none !important}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-coords,html body:not(.tll-none) [data-h3-hero] > div:has(> .h3-hero-coords){display:none !important}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-by{position:relative;z-index:2;margin:14px 0 0 !important;font:400 13px/1.5 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#B9B3A8}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-by b{color:#F7F1E8;font-weight:500}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-stamp{position:absolute !important;right:16px !important;left:auto !important;top:20px !important;bottom:auto !important;width:96px;z-index:2;color:#F7F1E8;opacity:.95;transform-origin:50% 50%;animation:tllMgLand 420ms cubic-bezier(.2,.9,.3,1.2) 250ms both;pointer-events:none}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-stamp svg{display:block;width:100%;height:auto}\n@keyframes tllMgLand{from{opacity:0;transform:scale(1.6) rotate(-14deg)}to{opacity:.95;transform:none}}\n@media(prefers-reduced-motion:reduce){html body:not(.tll-none) [data-h3-hero] .tll-mg-stamp{animation:none}}\n/* Layout shift (1 Nov 2026; Lighthouse on the home page: CLS 0.70, the words block moved after load). The hero height above is fixed from\n   the first paint (this style sits in the head), so nothing under the hero moves when the cover fills it. Inside the hero the words block\n   is bottom-anchored, so until the script has run (no data-tll-cover yet) the room its pieces will take is held in advance: the chip and\n   the kicker above the h1 (48 + 18 and 16.9 + 12, measured), the deck's third line, and under the buttons the credit line (14 + 19.5),\n   plus the Join button on phones where the buttons stack (48 + 12). The page's eyebrow is hidden at every width, not only on phones, since\n   the script hides it anyway. Pre-run only; once the script runs the real elements take that room and the final page is unchanged. */\nhtml body:not(.tll-none) [data-h3-hero]:not([data-tll-cover]) > div:has(> h1) > div:has(+ h1){display:none !important}\nhtml body:not(.tll-none) [data-h3-hero]:not([data-tll-cover]) > div:has(> h1){padding-top:95px !important}\nhtml body:not(.tll-none) [data-h3-hero]:not([data-tll-cover]) h1:not(.tll-story-title) + p{min-height:calc(3 * 1.45em)}\nhtml body:not(.tll-none) [data-h3-hero]:not([data-tll-cover]) .h3-hero-cta{margin-bottom:93.5px !important}\n@media(min-width:768px){\nhtml body:not(.tll-none) [data-h3-hero]{min-height:min(88vh,860px) !important;--tll-cover-pos:var(--tll-cover-pos-desk,50% 50%);--tll-cover-zoom:0%}\nhtml body:not(.tll-none) [data-h3-hero]:not([data-tll-cover]) .h3-hero-cta{margin-bottom:33.5px !important}\nhtml body:not(.tll-none) [data-h3-hero]::after{background:linear-gradient(90deg,rgba(10,11,20,.55) 0%,rgba(10,11,20,.36) 34%,rgba(10,11,20,.08) 62%,rgba(10,11,20,0) 78%),linear-gradient(180deg,rgba(10,11,20,.3) 0%,rgba(10,11,20,0) 18%,rgba(10,11,20,0) 64%,rgba(10,11,20,.34) 100%) !important}\nhtml body:not(.tll-none) [data-h3-hero] > img[data-tll-parallax=\"hero\"]{filter:brightness(1.14) saturate(1.06)}\nhtml body:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title),html body:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p,html body:not(.tll-none) [data-h3-hero] .tll-mg-kicker{text-shadow:0 1px 2px rgba(10,11,20,.35),0 2px 24px rgba(10,11,20,.45)}\nhtml body:not(.tll-none) [data-h3-hero] > div:has(> h1){max-width:1240px !important;margin:0 auto !important;padding:0 var(--h3-g,48px) 56px !important}\nhtml body:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title){font-size:clamp(52px,5.4vw,86px) !important}\nhtml body:not(.tll-none) [data-h3-hero] h1:not(.tll-story-title) + p{font-size:20px !important}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-cta{flex-direction:row !important}\nhtml body:not(.tll-none) [data-h3-hero] .h3-hero-cta .h3-btn{width:auto !important;min-width:240px;padding:0 28px !important}\nhtml body:not(.tll-none) [data-h3-hero] .tll-mg-stamp{width:150px;right:var(--h3-g,48px);top:32px}\n}\n\n/* The type on the rest of the home page (10 Nov 2026, the type system: Playfair Display 800 for headlines, IBM Plex Sans Condensed\n   for text, JetBrains Mono for eyebrows). The h3 sections read their faces from the page's own variables (--h3-head, --h3-body,\n   --h3-mono in tll-home3-v1), which already name those three faces, so the 26 Oct Newsreader and Inter Tight override is gone and\n   the page's eyebrow sizes and tracking stand. Playfair 800 runs wider than the Newsreader 500 the sizes were tuned for: the\n   headline tracking is -.01em (the page's -.03em and the shelf's -.05em were set for the lighter face) and the two largest\n   clamps come down about 10% so the lines hold at 1440. The italic rose accent words were already Playfair. Buttons: tll-buttons-v1. */\n.h3 [class*=\"h3-title\"]{font-weight:800 !important;letter-spacing:-.01em !important}\n.h3-title-xl{font-size:clamp(42px,6.4vw,100px) !important}\n.h3-c2 .h3-title-xl{font-size:clamp(50px,7.2vw,150px) !important}\n.h3-title-shelf{font-size:clamp(56px,11.5vw,196px) !important}\n.h3-card-title{font-weight:800 !important;letter-spacing:-.01em !important}\n.h3-lede{font-size:clamp(17px,1.4vw,20px) !important;line-height:1.5 !important}\n\n/* The people who went (26 Oct 2026, from the approved cover prototype): the contributors' faces and one action tile (29 Oct, Nancy agreed: no open seats, stories first), placed before the\n   \"You went. Write it down.\" chapter. Built by the script below; links to the contributor pages and to /travelers. */\n.tll-mg-people .tll-mg-sechead{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:0 0 28px}\n.tll-mg-people .tll-mg-sechead h2{margin:0 !important}\n.tll-mg-people .tll-mg-all{font:600 15px/1.3 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14 !important;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:4px;min-height:44px;display:inline-flex;align-items:center}\n.tll-mg-faces{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:24px 20px}\n.tll-mg-faces a{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-decoration:none !important;color:#0A0B14 !important;min-height:44px;padding:4px 0}\n.tll-mg-faces img,.tll-mg-faces i{width:72px;height:72px;border-radius:50%;object-fit:cover;margin-bottom:8px;flex:0 0 72px}\n.tll-mg-faces img{box-shadow:0 0 0 1.5px #C8325B}\n.tll-mg-faces i{display:flex;align-items:center;justify-content:center;border:1.5px dashed #C8325B;color:#C8325B;font-style:normal;font-size:28px;box-sizing:border-box}\n.tll-mg-faces b{font:600 16px/1.25 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}\n.tll-mg-faces span{font:400 14px/1.4 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#6B6660}\n.tll-mg-faces .tll-mg-open b{color:#C8325B}\n.tll-mg-faces a:hover b,.tll-mg-faces a:focus-visible b{text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:3px}\n.tll-mg-faces a:focus-visible{outline:3px solid #C8325B;outline-offset:2px;border-radius:4px}\n@media(min-width:768px){.tll-mg-faces{grid-template-columns:repeat(4,1fr);gap:32px}}\n\n/* Stamps on the library cards and on the letter (26 Oct build list: \"stamp on cards\"). Each card carries data-loc and data-date, so\n   the stamp is drawn from them; the letter's stamp reads SUNDAY. Decorative, aria-hidden, no pointer events. */\n.h3-card-ph .tll-mg-card-stamp{position:absolute;right:10px;top:10px;width:58px;color:#0A0B14;background:rgba(247,241,232,.82);border-radius:50%;z-index:2;pointer-events:none;transform:rotate(-6deg)}\n.h3-card-ph .tll-mg-card-stamp svg{display:block;width:100%;height:auto}\n@media(min-width:768px){.h3-card-ph .tll-mg-card-stamp{width:68px;right:12px;top:12px}}\nsection[data-h3=\"news\"]{position:relative}\nsection[data-h3=\"news\"] .tll-mg-letter-stamp{position:absolute;right:16px;top:16px;width:84px;color:#0A0B14;opacity:.9;z-index:2;pointer-events:none}\nsection[data-h3=\"news\"] .tll-mg-letter-stamp svg{display:block;width:100%;height:auto}\n@media(min-width:768px){section[data-h3=\"news\"] .tll-mg-letter-stamp{width:120px;right:var(--h3-g,48px);top:32px}}\n";(document.head||document.documentElement).appendChild(CS);
function place(){document.body.appendChild(CS);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();
/* Fills the cover from COVER (built by build-cover.py from the story's CMS item; nothing typed here is a story headline or body).
   Moves: the hero photo's src and alt are swapped, a chip and a kicker go before the h1, the deck text is set, the first button
   points at the cover story, a credit line and the stamp are appended. Runs once. */
(function(){
var COVER={"slug": "spain-madrid-wedding-ibiza", "title": "Spain: A Wedding and an Adventure", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad72dc3c7e76f61648a3c30_6ad72d77eeadeeb5b887095e_chesney-lish-spain-hero.jpeg", "alt": "Sunset over the sea from a beach bar in Ibiza, the sun low behind a thatched roof", "w": 1440, "h": 1920, "author": "Chesney Lish", "authorSlug": "chesney-lish", "avatar": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg", "place": "Ibiza", "stampPlace": "IBIZA", "stampDate": "27 SEP 2024", "stampArc": "BY THE PEOPLE WHO WENT", "coords": "38.98° N 1.43° E", "posPhone": "50% 100%", "posDesk": "50% 100%", "phoneZoom": "90%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"};var COVERS=[{"slug": "spain-madrid-wedding-ibiza", "title": "Spain: A Wedding and an Adventure", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad72dc3c7e76f61648a3c30_6ad72d77eeadeeb5b887095e_chesney-lish-spain-hero.jpeg", "alt": "Sunset over the sea from a beach bar in Ibiza, the sun low behind a thatched roof", "w": 1440, "h": 1920, "author": "Chesney Lish", "authorSlug": "chesney-lish", "avatar": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg", "place": "Ibiza", "stampPlace": "IBIZA", "stampDate": "27 SEP 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "38.98° N 1.43° E", "posPhone": "50% 100%", "posDesk": "50% 100%", "phoneZoom": "90%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "pantanal-glimmers-in-the-wild", "title": "Glimmers in the Wild: 120 Wooden Bridges, Jaguars, and No Guide", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ac86ab8eaf54b2878f9344b_6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river.jpeg", "alt": "A jaguar swimming the Cuiaba River with only its head and shoulders above the green water, looking straight at the camera", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Porto Jofre", "stampPlace": "PORTO JOFRE", "stampDate": "09 OCT 2026", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "agra-taj-mahal-keep-calm-and-curry-on", "title": "Keep Calm and Curry On", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acd1b923c1b0924065c1b18_6acd1b18901ddd1d8c4a33af_tll-in-agra-hero-taj-dawn-reflecting-pool.jpeg", "alt": "The Taj Mahal at dawn under a blue sky, reflected in the long garden pool between rows of cypress trees.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Agra", "stampPlace": "AGRA", "stampDate": "26 JUL 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "angkor-wat-most-indiana-jones-thing", "title": "The Most Indiana Jones Thing I Have Ever Done", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acce2ba03c2f8625896075a_6acce1fe9356a088c9deb375_tll-kh-hero-angkor-wat-sunrise-reflection.jpeg", "alt": "Angkor Wat's towers behind sugar palms at sunrise, the temple reflected in a rain-filled pool under an orange sky.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Siem Reap", "stampPlace": "SIEM REAP", "stampDate": "27 AUG 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "sort-sol-black-sun-denmark", "title": "I Drove Across Denmark to Watch a Million Birds Go to Bed", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6aba3d42f18f65b8d06aea74_6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars.jpeg", "alt": "A vast flock of starlings streaming across an orange sunset sky above wind turbines, with a line of parked cars and watchers along the marsh road below", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Rudbøl", "stampPlace": "RUDBØL", "stampDate": "29 SEP 2026", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "kilimanjaro-someone-was-already-awake", "title": "Someone Was Already Awake", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6aca68353e10fde58370d8db_6aca67718cbe7fd65ada6665_tll-kili-hero-glacier.jpeg", "alt": "A wall of glacier ice standing in the open on Kilimanjaro's summit plateau, with an unbroken floor of cloud stretching to the horizon behind it.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Tanzania", "stampPlace": "TANZANIA", "stampDate": "07 AUG 2025", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "bali-extended-layover-edition", "title": "Bali, Indonesia: Extended Layover Edition", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accb5fa77e495b89531db5a_6accb559bef9cade998d596f_tll-bali-hero-jatiluwih.jpeg", "alt": "Jatiluwih rice terraces stepping down a hillside under a lone coconut palm, a volcano faint on the horizon.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Bali", "stampPlace": "BALI", "stampDate": "13 FEB 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "luxembourg-schengen-road-trip", "title": "I’ve Been in Schengen for Years. This Weekend I Actually Went.", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad61a51fae3fb151cb482cb_6ad61926138353e2371f0646_lux-hero-luxembourg-city-skyline.jpeg", "alt": "Luxembourg City from the Pétrusse valley: the national flag, the spires of Notre-Dame Cathedral and the old fortress wall above autumn trees", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Schengen", "stampPlace": "SCHENGEN", "stampDate": "19 OCT 2026", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "istanbul-me-and-my-champagne-vacay", "title": "Me and My Champagne Vacay in Istanbul", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acd22bca172d6041e178f43_6acd2245c069c95705bd59f0_istanbul-hero-galata-bridge.jpeg", "alt": "The Galata Bridge in Istanbul lined with fishermen above the restaurants on its lower level, the New Mosque across the water", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Istanbul", "stampPlace": "ISTANBUL", "stampDate": "16 APR 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "cabo-san-lucas-final-fiesta-bachelorette", "title": "Final Fiesta", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acd1d69500078906e984068_6acd1d1113a10f320b1ae511_cabo-hero-el-arco-from-the-water.jpeg", "alt": "El Arco and the pale granite stacks at Land's End, Cabo San Lucas, seen from the water", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Cabo San Lucas", "stampPlace": "CABO SAN LUCAS", "stampDate": "22 JUN 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "laos-slowest-race-in-vientiane", "title": "The Slowest Race in Vientiane", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acd1c9fbe35f878324f780d_6acd1c03382125aa1175ce04_tll-laos-hero-that-luang.jpeg", "alt": "The gold stupa of Pha That Luang in Vientiane under a cloudy sky, sugar palms on either side.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Vientiane", "stampPlace": "VIENTIANE", "stampDate": "11 JUL 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "egypt-history-101-by-us", "title": "Egypt History 101 (by Us)", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accdb497e4bf299e34c64a1_6accda519a6e03060987175d_tll-egypt-hero-giza-night.jpeg", "alt": "The Giza pyramids and the Sphinx lit up at night for the light show", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Egypt", "stampPlace": "EGYPT", "stampDate": "31 OCT 2022", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "uruguay-tiradentes-wine-yards", "title": "Uruguay Would Rather You Didn't Know", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accd59410785e9dc6928ff9_6accd402e982361969921f2c_uruguay-hero-vineyard-sunset.jpeg", "alt": "Autumn grapevines with red and purple leaves along a netted trellis at sunset, a stand of tall trees on the horizon, Maldonado, Uruguay", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Punta Del Este", "stampPlace": "PUNTA DEL ESTE", "stampDate": "23 APR 2023", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "costa-rica-the-layover-was-the-vacation", "title": "The Layover Was the Vacation", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accbf33ef7f287503353758_6accbe8e66345a014d7dd03c_costa-rica-hero-waterfall-turquoise-pool.jpeg", "alt": "A tall waterfall pouring into a turquoise pool, framed by moss and dense green forest", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Costa Rica", "stampPlace": "COSTA RICA", "stampDate": "16 JUL 2023", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "oregon-pacific-northwest-epic-trip", "title": "Celebrating an Epic Trip in the Pac NW!", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accbebb72e26ecd2eab5e22_6accbdcf189c2b52651f1bf0_oregon-hero-mt-bailey-rock-window.jpeg", "alt": "Through a natural rock window near the top of Mt. Bailey, a lake far below and snow-dusted ridges beyond", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Portland", "stampPlace": "PORTLAND", "stampDate": "27 JUN 2023", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "amsterdam-stroopwafel-time", "title": "Stroopwafel Time", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accbb7a5f59788946a582f6_6accbabae33bb05d0e792378_amsterdam-hero-damrak-dancing-houses.jpeg", "alt": "A row of tall, narrow canal houses on the Damrak in black, brick, maroon and dark green, leaning slightly against each other above the water", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Amsterdam", "stampPlace": "AMSTERDAM", "stampDate": "09 AUG 2023", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "vietnam-year-of-the-dragon", "title": "The Year of the Dragon", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accb17cf0f89e81f06bfdbe_6accb0aeeb9526b52b0ec7b4_tll-vn-hero-hoi-an-lanterns.jpeg", "alt": "Silk lanterns painted with flowers, butterflies and birds, glowing in rows at night in Hoi An.", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Vietnam", "stampPlace": "VIETNAM", "stampDate": "28 FEB 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "doha-layover-dunes-camels-falcons", "title": "Patience, Iago, Patience!", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accb04b158b115c416602dc_6accafdf70262b369b3309a1_doha-hero-inland-sea-lagoon.jpeg", "alt": "Clear turquoise water lapping a curved shore of pale sand, low dunes running to the horizon under a blue sky in Qatar's desert", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Qatar", "stampPlace": "QATAR", "stampDate": "01 MAR 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "el-salvador-ice-cream-over-a-lake-of-acid", "title": "Ice Cream Over a Lake of Acid", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acca8dd37b47d99f14394b0_6acca87e2f878b6022e8941c_el-salvador-hero-santa-ana-crater-lake.jpeg", "alt": "Santa Ana's crater seen from the rim: layered gray walls stepping down to a steaming, bright green acid lake", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Santa Ana", "stampPlace": "SANTA ANA", "stampDate": "13 APR 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "aruba-curacao-dushi-detour", "title": "A Delightful \"Dushi\" Detour to Aruba and Curaçao", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acc9dd0901463fb94a5312d_6acc9d23a0ca3be2b7318b01_aruba-curacao-hero-conchi-natural-pool-arikok.jpeg", "alt": "Conchi, Aruba's natural pool, a bowl of calm turquoise water ringed by dark volcanic rock in Arikok National Park, with swimmers on the rocks and surf breaking beyond", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Aruba And Curaçao", "stampPlace": "ARUBA AND CURAÇAO", "stampDate": "04 AUG 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "morocco-toubkal-peaks-mules-uno-vengeance", "title": "Moroccan Adventure: Peaks, Sugared Up Mules, & UNO Vengeance", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acc99ae84d1be665478a717_6acc99056a6fe50b5eda0551_tll-morocco-hero-aroumd-village.jpeg", "alt": "The village of Aroumd stacked on a hillside below the High Atlas, its ochre houses above green terraces, with a man riding a mule along the trail in the foreground", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Morocco", "stampPlace": "MOROCCO", "stampDate": "02 AUG 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "eswatini-lesotho-how-many-goats-small-car", "title": "How Many Goats Can Fit in a Small Car?", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6acc91782709d096fa1eb1e9_6acc9052a9570a006e230493_tll-sa-hero-jacaranda-sunset.jpeg", "alt": "Sunset over the hills of Eswatini, an orange sky above blue ridgelines and dense green forest, with a purple jacaranda in bloom in the foreground", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Eswatini And Lesotho", "stampPlace": "ESWATINI AND LESOTHO", "stampDate": "27 OCT 2024", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "northern-brazil-sequins-to-sloths", "title": "From Sequins to Sloths: Northern Brazil for the Chronically Curious", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6abccf813c37a815d4c03dde_6abcce087012c0cb94fe18b3_brazil-hero-riverboats-at-sunset-rio-negro.jpeg", "alt": "Two wooden riverboats on the still Rio Negro at sunset, sky and water washed gold and pink", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Salvador", "stampPlace": "SALVADOR", "stampDate": "30 SEP 2026", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}, {"slug": "mexico-holy-mole-teotihuacan-cenotes-pink-lagoons", "title": "Holy Mole", "img": "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6accbeceb55fa97ba3b92de4_6accbe52f0ddedac9e55b651_mexico-hero-teotihuacan-pyramid-of-the-moon.jpeg", "alt": "The Pyramid of the Moon at Teotihuacán under heavy clouds, with visitors crossing the plaza below", "w": 1440, "h": 1920, "author": "Nancy Carleton", "authorSlug": "nancy-carleton", "avatar": "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg", "place": "Mexico", "stampPlace": "MEXICO", "stampDate": "12 OCT 2026", "stampArc": "STORIES FROM THE ROAD", "coords": "", "posPhone": "50% 50%", "posDesk": "50% 50%", "phoneZoom": "0%", "kicker": "This week's cover", "dek": "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", "button": "Read the cover story", "join": "Join free"}];
/* one cover per week (weeks start Monday, UTC), the same for every reader that week; the fixed cover above if the list is empty */
(function(){if(!COVERS.length)return;var d=new Date(),w=Math.floor((Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-Date.UTC(2026,0,5))/604800000),i=((w%COVERS.length)+COVERS.length)%COVERS.length;try{var q=/[?&]cover=(\d+)/.exec(location.search);if(q)i=Math.min(+q[1],COVERS.length-1);}catch(e){}COVER=COVERS[i];})();
var SVG='<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><defs><filter id="tll-mg-ink" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter><path id="tll-mg-top" d="M30,100 A70,70 0 1,1 170,100"/><path id="tll-mg-bottom" d="M34,100 A66,66 0 0,0 166,100"/></defs><g filter="url(#tll-mg-ink)"><g fill="none" stroke="currentColor"><circle cx="100" cy="100" r="94" stroke-width="3"/><circle cx="100" cy="100" r="86" stroke-width="1.2"/><circle cx="100" cy="100" r="58" stroke-width="1.2"/></g><g fill="currentColor" font-family="\'JetBrains Mono\',ui-monospace,monospace" text-anchor="middle"><text font-size="12.5" font-weight="600" letter-spacing="3"><textPath href="#tll-mg-top" startOffset="50%">THAT LAYOVER LIFE</textPath></text><text font-size="9" letter-spacing="1.4"><textPath href="#tll-mg-bottom" startOffset="50%">{A}</textPath></text><text x="100" y="82" font-size="8" letter-spacing="3" font-weight="600">TLL</text><text x="100" y="{Y}" font-size="{S}" font-weight="600" letter-spacing="1">{P}</text><text x="100" y="124" font-size="9.5" letter-spacing="2">{D}</text></g></g></svg>';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
/* 8 Nov 2026 (Nancy: "That stamp is kind of a mess"): long place names were cut at 16 letters (TEXAS HILL COUNT). Names up to 10
   letters stay on one line at 16px; longer ones break at a space onto two lines at 11px, so the whole name fits inside the inner ring. */
function stampText(svg,place){var p=String(place||'');var s=p.length>10?'11':'16';var y='106';var txt=esc(p);
  if(p.length>10){var i=p.lastIndexOf(' ',13);if(i<4)i=p.indexOf(' ');if(i>0){txt='<tspan x="100" dy="0">'+esc(p.slice(0,i))+'</tspan><tspan x="100" dy="12">'+esc(p.slice(i+1))+'</tspan>';y='100';}
    else if(p.length>14){s='9';}}
  /* 10 Nov 2026 (week-one hygiene, item 9): every stamp carried the same filter and path ids (tll-mg-ink, -top, -bottom), 59 copies on the home
     page. Each copy now gets its own suffix from one page-wide counter, so url(#...) and the textPath href point at their own defs. */
  var u=(window.__tllMgN=(window.__tllMgN||0)+1);svg=svg.replace(/tll-mg-(ink|top|bottom)/g,'tll-mg-$1-'+u);
  return svg.replace('{P}',txt).replace('{S}',s).replace('{Y}',y);}
/* LCP (1 Nov 2026): in the site bundle this runs in the head, so the cover photo is asked for here, before the hero is parsed, at high
   priority; the hero would otherwise start its fetch only after the bundle has run. The page's own hero file still loads once (Designer). */
/* 10 Nov 2026 (week one item 4): when the cover photo has Webflow variants (its site-bucket twin, tll-img-variants-v1), the preload carries
   the same srcset and sizes as the img below, so the browser fetches one file sized for the screen, once. */
(function(){if(!COVER.img||!COVER.slug)return;try{if(document.querySelector('link[rel="preload"][href="'+COVER.img+'"]'))return;var l=document.createElement('link');l.rel='preload';l.as='image';l.href=COVER.img;var V=window.__tllImgV,ss=V&&V.srcset(COVER.img);if(ss){l.setAttribute('imagesrcset',ss);l.setAttribute('imagesizes','100vw');}l.setAttribute('fetchpriority','high');(document.head||document.documentElement).appendChild(l);}catch(e){}})();
function run(){
  var hero=document.querySelector('[data-h3-hero]');if(!hero||hero.dataset.tllCover)return;hero.dataset.tllCover=COVER.slug?'1':'0';if(!COVER.slug)return;
  hero.style.setProperty('--tll-cover-pos-phone',COVER.posPhone||'50% 50%');hero.style.setProperty('--tll-cover-pos-desk',COVER.posDesk||'50% 50%');hero.style.setProperty('--tll-cover-zoom',COVER.phoneZoom||'0%');
  var img=hero.querySelector('img[data-tll-parallax="hero"]');
  /* the cover is the page's largest paint: eager, high priority, async decode. 10 Nov 2026 (week one item 4): no more guesswork and no
     more stripping either; the srcset holds only the variants Webflow built for the photo's twin (tll-img-variants-v1), full width, the
     same as the preload above, and is written before src. A photo with no variants keeps the original, as before. */
  if(img){img.loading='eager';img.setAttribute('fetchpriority','high');img.decoding='async';var V=window.__tllImgV;if(!(V&&V.apply(img,'100vw',COVER.img))){img.removeAttribute('srcset');img.removeAttribute('sizes');}img.src=COVER.img;img.alt=COVER.alt||'';if(COVER.w){img.width=COVER.w;img.height=COVER.h;}}
  var h1=hero.querySelector('h1');if(!h1)return;var words=h1.parentNode;var ey=h1.previousElementSibling;if(ey&&ey.tagName==='DIV')ey.classList.add('tll-mg-eyebrow');
  var chip=document.createElement('a');chip.className='tll-mg-chip';chip.href='/contributors/'+COVER.authorSlug;
  /* eager is written out: the site footer marks every img without a loading attribute as lazy, and the chip sits inside the hero, above the
     fold, so it keeps the original file (no variant try on a photo painted first) at low priority behind the cover */
  /* 10 Nov 2026 (week one item 4): the 36px face takes the smallest Webflow variant that exists (tll-img-variants-v1), not the full file;
     the original comes back if that variant fails */
  var V=window.__tllImgV,av=V?V.pick(COVER.avatar,120):COVER.avatar;
  chip.innerHTML='<img src="'+esc(av)+'" alt="" width="36" height="36" loading="eager" decoding="async" fetchpriority="low"><span><b>Photo: '+esc(COVER.author)+'</b>'+esc(COVER.place)+'</span>';
  if(av!==COVER.avatar){var ci=chip.querySelector('img');ci.addEventListener('error',function h(){ci.removeEventListener('error',h);ci.src=COVER.avatar;});}
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
    st.innerHTML=stampText(SVG,COVER.stampPlace).replace('{D}',esc(COVER.stampDate||'')).replace('{A}',esc(COVER.stampArc||'BY THE PEOPLE WHO WENT'));hero.appendChild(st);}
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
/* 8 Nov 2026 (Nancy: "That stamp is kind of a mess"): long place names were cut at 16 letters (TEXAS HILL COUNT). Names up to 10
   letters stay on one line at 16px; longer ones break at a space onto two lines at 11px, so the whole name fits inside the inner ring. */
function stampText(svg,place){var p=String(place||'');var s=p.length>10?'11':'16';var y='106';var txt=esc(p);
  if(p.length>10){var i=p.lastIndexOf(' ',13);if(i<4)i=p.indexOf(' ');if(i>0){txt='<tspan x="100" dy="0">'+esc(p.slice(0,i))+'</tspan><tspan x="100" dy="12">'+esc(p.slice(i+1))+'</tspan>';y='100';}
    else if(p.length>14){s='9';}}
  /* 10 Nov 2026 (week-one hygiene, item 9): every stamp carried the same filter and path ids (tll-mg-ink, -top, -bottom), 59 copies on the home
     page. Each copy now gets its own suffix from one page-wide counter, so url(#...) and the textPath href point at their own defs. */
  var u=(window.__tllMgN=(window.__tllMgN||0)+1);svg=svg.replace(/tll-mg-(ink|top|bottom)/g,'tll-mg-$1-'+u);
  return svg.replace('{P}',txt).replace('{S}',s).replace('{Y}',y);}
/* the 72px faces are lazy and far down the page, so they take a Webflow variant about 500px wide. 10 Nov 2026 (week one item 4): the
   variant comes from tll-img-variants-v1, which maps a CMS file to its site-bucket twin and knows which widths exist (the old guess,
   {CMS URL}-p-500, always failed on CMS files). A photo without a variant keeps its original; the fallback below stays for the rare miss. */
function small(u,w){var V=window.__tllImgV;return V?V.pick(u,w):u;}
function fallback(img,orig){if(!img||!orig||img.getAttribute('src')===orig)return;img.addEventListener('error',function h(){img.removeEventListener('error',h);img.src=orig;});}
function run(){
  var anchor=document.querySelector('section.h3-c2,section[data-h3-first100]');if(!anchor||document.querySelector('.tll-mg-people')||!PEOPLE.length)return;
  var sec=document.createElement('section');sec.className='h3 h3-sec h3-cream tll-mg-people';sec.setAttribute('aria-labelledby','tll-mg-people-t');
  var h='<div class="h3-in"><div class="tll-mg-sechead"><h2 id="tll-mg-people-t" class="h3-title-l">The people who went.</h2><a class="tll-mg-all" href="/travelers">All travelers \u2192</a></div><ul class="tll-mg-faces">';
  PEOPLE.forEach(function(p){h+='<li><a href="/contributors/'+esc(p.slug)+'"><img src="'+esc(small(p.avatar,500))+'" alt="" width="72" height="72" loading="lazy" decoding="async"><b>'+esc(p.name)+'</b><span>'+esc(p.sub)+'</span></a></li>';});
  h+='<li><a class="tll-mg-open" href="/submit"><i aria-hidden="true">+</i><b>Pitch your layover.</b><span>We edit lightly and keep your byline.</span></a></li></ul></div>';
  sec.innerHTML=h;[].forEach.call(sec.querySelectorAll('.tll-mg-faces img'),function(im,i){fallback(im,PEOPLE[i]&&PEOPLE[i].avatar);});anchor.parentNode.insertBefore(sec,anchor);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* Stamps on the library cards (from each card's data-loc and data-date) and on the letter. The rail may be rebuilt after load, so this watches it for a while. */
(function(){
var SVG='<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><defs><filter id="tll-mg-ink" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter><path id="tll-mg-top" d="M30,100 A70,70 0 1,1 170,100"/><path id="tll-mg-bottom" d="M34,100 A66,66 0 0,0 166,100"/></defs><g filter="url(#tll-mg-ink)"><g fill="none" stroke="currentColor"><circle cx="100" cy="100" r="94" stroke-width="3"/><circle cx="100" cy="100" r="86" stroke-width="1.2"/><circle cx="100" cy="100" r="58" stroke-width="1.2"/></g><g fill="currentColor" font-family="\'JetBrains Mono\',ui-monospace,monospace" text-anchor="middle"><text font-size="12.5" font-weight="600" letter-spacing="3"><textPath href="#tll-mg-top" startOffset="50%">THAT LAYOVER LIFE</textPath></text><text font-size="9" letter-spacing="1.4"><textPath href="#tll-mg-bottom" startOffset="50%">{A}</textPath></text><text x="100" y="82" font-size="8" letter-spacing="3" font-weight="600">TLL</text><text x="100" y="{Y}" font-size="{S}" font-weight="600" letter-spacing="1">{P}</text><text x="100" y="124" font-size="9.5" letter-spacing="2">{D}</text></g></g></svg>';
if(!SVG)return;
var MON=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
/* 8 Nov 2026 (Nancy: "That stamp is kind of a mess"): long place names were cut at 16 letters (TEXAS HILL COUNT). Names up to 10
   letters stay on one line at 16px; longer ones break at a space onto two lines at 11px, so the whole name fits inside the inner ring. */
function stampText(svg,place){var p=String(place||'');var s=p.length>10?'11':'16';var y='106';var txt=esc(p);
  if(p.length>10){var i=p.lastIndexOf(' ',13);if(i<4)i=p.indexOf(' ');if(i>0){txt='<tspan x="100" dy="0">'+esc(p.slice(0,i))+'</tspan><tspan x="100" dy="12">'+esc(p.slice(i+1))+'</tspan>';y='100';}
    else if(p.length>14){s='9';}}
  /* 10 Nov 2026 (week-one hygiene, item 9): every stamp carried the same filter and path ids (tll-mg-ink, -top, -bottom), 59 copies on the home
     page. Each copy now gets its own suffix from one page-wide counter, so url(#...) and the textPath href point at their own defs. */
  var u=(window.__tllMgN=(window.__tllMgN||0)+1);svg=svg.replace(/tll-mg-(ink|top|bottom)/g,'tll-mg-$1-'+u);
  return svg.replace('{P}',txt).replace('{S}',s).replace('{Y}',y);}
function stamp(place,date,arc,cls){var st=document.createElement('span');st.className=cls;st.setAttribute('aria-hidden','true');
  st.innerHTML=stampText(SVG,place).replace('{D}',esc(date)).replace('{A}',esc(arc));return st;}
function cards(){var n=0;[].forEach.call(document.querySelectorAll('.h3-card'),function(c){var ph=c.querySelector('.h3-card-ph');if(!ph||ph.querySelector('.tll-mg-card-stamp'))return;
  var loc=(c.getAttribute('data-loc')||'').split(',')[0].trim().toUpperCase().slice(0,16);if(!loc)return;
  var d=(c.getAttribute('data-date')||'').match(/^(\d{4})-(\d{2})-(\d{2})/),date=d?d[3]+' '+MON[+d[2]-1]+' '+d[1]:'';
  var arc=(c.getAttribute('data-pillar')||'').trim().toUpperCase()||'BY THE PEOPLE WHO WENT';ph.appendChild(stamp(loc,date,arc,'tll-mg-card-stamp'));n++;});return n;}
function letter(){var s=document.querySelector('section[data-h3="news"]');if(!s||s.querySelector('.tll-mg-letter-stamp'))return;s.appendChild(stamp('SUNDAY','09:00 CPH','THE LAYOVER LETTER','tll-mg-letter-stamp'));}
function run(){cards();letter();var t=document.querySelector('.h3-track');if(t&&window.MutationObserver){var mo=new MutationObserver(function(){cards();});mo.observe(t,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();},15000);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
})();
