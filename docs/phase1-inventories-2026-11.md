# Phase 1 inventories (1 Nov 2026, read-only, from the saved code)

Three inventories written before the Phase 1 builds. Nothing here changed the site; the builds that followed are logged in docs/tll-phase1-change-log-2026-11.md. Sizes are from the committed files; nothing could be measured live.


## The site layers bundle: what runs where

Inventory of src/site-layers/tll-site-layers-v16.js at HEAD 4fdf0e1 (16.49.0, the pin the lock file records as live): 500.5 KB raw (512,561 bytes; 143 KB gzip), not 426 KB; 426,524 bytes was pin 11e6a7c, before the expat, pet, UX, phase 0 and story-is layers. Composition: 9.4 KB header comment, 0.6 KB consent fallback, 9.6 KB style loader (9 CSS blocks), 412.3 KB of 58 scripts (19.3 to 431.5 KB), 20.9 KB story layer (/stories/{slug}), 47.9 KB cover layer (/). Block comments alone are 76.4 KB (15 percent). Live versus dead by page: home runs 110 KB (51.8 KB scripts + consent + styles + cover) and carries 390.8 KB dead; /stories runs 98.5 KB, 402.3 KB dead; a story page runs 125.7 KB (incl. the story layer), 375.1 KB dead. Every page unconditionally runs 14 scripts totaling 35 KB plus consent, the 9 styles, the work-trips country table and stamp listener, the ads pause line, and the preview checks of five staged layers (82.5 KB that is off for the public). Only about 21 KB truly needs the synchronous header on every page (consent fallback, the 9 styles, ux-1028 head CSS, mbar-align CSS, division, two tiny delegates, plus a loader); the cover (home) and three page-bound parse-time pieces (story layer font link, photos-form-v2 on /share-photos, album-settings fetch wrapper on /the-map) need synchronous loading on their own paths only; everything else waits for DOMContentLoaded or a timer and can be a deferred per-path chunk with a pinned jsDelivr URL and SRI. Findings below are per file or group with sizes, paths, paint requirement, defer/chunk verdict, the cross-layer globals that fix load order, and a concrete split plan. Read-only; nothing was changed, built, pushed or published.


### Bundle totals and the 426 KB figure (500.5 KB)

/home/user/thatlayoverlife/src/site-layers/tll-site-layers-v16.js at HEAD 4fdf0e1 is 512,561 bytes (500.5 KB raw, 143.3 KB gzip). handoff/WEBFLOW-LOCK.md records 16.49.0 pin 4fdf0e1dd86efb7222ce9974a11c5f3b37dec395 as registered, applied and published, so the live file is 500 KB. 426 KB matches pin 11e6a7c (426,524 bytes, 16.46.x); 16.47.0 (89eca2f) added series, expat, pet-passport and ux (+68 KB), then phase0, story-is and ads. Layout inside the file: header comment 0 to 9.4 KB; consent fallback; style loader 9.7 to 19.3 KB; 58 scripts 19.3 to 431.5 KB; story layer 431.5 to 452.4 KB; cover layer 452.4 to 500.3 KB. The script is a Webflow registered hosted script (tllsitelayersv16) applied site-wide in the header, which is what makes it render-blocking; the saved head in scratchpad/p0-1031/after/site-head.html does not contain the tag because Webflow injects it. Block comments total 76.4 KB in 197 blocks (the build concatenates sources verbatim, no minify). Per page: home 110.0 KB live, 390.8 KB dead; /stories 98.5 KB live, 402.3 KB dead; story page 125.7 KB live, 375.1 KB dead.

**Recommendation:** Treat 500 KB as the baseline. Strip comments in the build (keep them in the sources) for an easy 15 percent raw cut before any split; the split plan below is what removes the 375 to 400 KB of dead weight per page.


### Pages that each layer runs on (reference list) (412.3 KB)

All pages: account-hash-tabs 1.1, note-typing 0.8, footer-wordmark 0.8, masthead 0.8, ux-1028 3.0, hover 1.2, byline-links 3.2, mbar-align 1.5, story-fixes-1029 3.1, email-hello 1.6, ep-help 3.9, redesign-p0 4.8, whats-new 6.0, division 3.1 (35.0 KB) plus consent 0.6, styles 9.6, the work-trips table and listener, the ads pause line. '/': home-bands 2.8, home-value 5.6, phase0, redesign-p0, cover 47.9. '/stories': page-heroes 16.0, stories-places 3.3, stories-noimg 3.3, series 11.5, story-is 4.9, ads 5.9, phase0. '/stories/{slug}': story layer 20.9, story-ask 1.7, story-captions 2.3, pros 6.5, series 11.5, ux-v1 18.3 (staged), story-is 4.9, ads 5.9, phase0 (stub only). '/submit': submit-ux 3.8, linkout-preview 6.6, linkout-summary 4.6, submit-gallery 15.6, submit-long 2.2, intake 5.3, story-is 4.9, ux-v1 18.3. '/share-photos': photos-form-v2 18.6, photos-caption 1.3, intake 5.3. '/edit-profile': ep-country 3.6, ep-ux 28.7, ep-marks 2.1, ep-help 3.9, ep-linkstack 6.4, crew 16.9, collections 13.4, stamps 15.8, album-settings 7.1, expat 19.5. '/contributors/{slug}': profile-count 1.6, pf-linkstack 6.3, crew, collections, stamps, album 12.8, pros, expat, phase0. '/account': crew, whats-new, export 10.3, metrics 7.0, ux-v1, hover. '/the-map': page-heroes, album-settings, redesign-p0, phase0. '/for-expats': page-heroes, expert-from 1.5, expats-map 8.1, series, expat, redesign-p0. '/travelers': page-heroes, travelers-fix 17.5. '/about': page-heroes. '/spotlight': open-slots 1.9. '/gallery': lounge-labels 1.6, lounge-members 2.0. '/pursuits/{slug}': stamps, pros, series and work-trips (work-trips only). '/pets/{slug}', '/my-pets', '/the-paw-passport': album, crew, pet-passport 20.5, paw 10.0, series. '/countries/{slug}': ads. '/contact', '/support': phase0 CSS lines.

**Recommendation:** Use this as the table of which chunk holds which layer; the per-group findings below give the paint timing and dependencies for each entry.


### src/site-layers/tll-consent-mode-v2.js (first in the bundle) (0.64 KB)

0.64 KB. All pages. Sets dataLayer and a gtag stub, then gtag('consent','default', all denied) only when window.__tllConsent is absent. Since 31 Oct the site head's inline tll-consent-v3 (line 6 of scratchpad/p0-1031/after/site-head.html) sets the same defaults first and defines __tllConsent, so this is a fallback for pages served without that head code. Must run before any Google tag script executes, so it belongs in the synchronous header, first; it has no DOM work.

**Recommendation:** Keep in the core, first line. Do not defer; a deferred consent default would run after gtag.js on a page that lacks the head tool.


### STYLES group: 9 CSS blocks injected by the loader (nav-phone, contrast, note-phone, photos-tap, home-coords, footer-wordmark, tap-colors, shelf-ring, masthead) (9.62 KB)

9.05 KB CSS, 9.62 KB with the loader wrapper. All pages (CSS is page-neutral; photos-tap targets /share-photos, tap-colors /account, home-coords and shelf-ring the home page, the rest the header and footer). Injected synchronously into head at script time, so they shape the first paint of the phone header, contrast fixes, the round note button, the footer wordmark and masthead. Deferring them would show the unstyled phone header and footer wordmark for a frame on every page.

**Recommendation:** Keep in the core (synchronous). Optional trim: move photos-tap (1.2), tap-colors (1.2), home-coords (0.7) and shelf-ring (0.6) into their path chunks as inline CSS, saving 3.7 KB sitewide; those four only matter after their page content is parsed anyway.


### Sitewide synchronous group: tll-ux-1028-v1.js, tll-mbar-align-v1.js, tll-note-typing-v1.js, member-bar/tll-account-hash-tabs-v1.js, tll-division-v1.js (9.55 KB)

ux-1028 3.00 KB, all pages: injects HEAD CSS synchronously (note button hidden over the home hero, transitions) and TAIL CSS into body at DOMContentLoaded (type floor, success contrast). mbar-align 1.50 KB, all pages: synchronous CSS for nav.tll-mbar (member bar on /account, /edit-profile, /the-map, /my-pets); deferred it would jump the bar from the left edge to the column after paint. note-typing 0.79 KB and account-hash-tabs 1.14 KB, all pages: focusin and capture-phase click delegates, order-free, tiny. division 3.12 KB, all pages: sets window.tllDivision, gtag('set',{division}) which should land before GA config (GA loads after consent, asynchronously, so the risk under defer is small but real), a click delegate that adds utm parameters to outbound revenue links, and a /settings fetch only when [data-tll-entity] exists.

**Recommendation:** Keep all five in the core: ux-1028 and mbar-align because their CSS is parse-time, division because of the gtag set order, the two delegates because they are 2 KB. Core sitewide total with consent, styles and a loader: about 21 KB.


### Sitewide DOMContentLoaded group: tll-footer-wordmark-v1.js, tll-masthead-v1.js, tll-email-hello-v1.js, tll-byline-links-v1.js, tll-story-fixes-1029-v1.js, tll-hover-v1.js, tll-whats-new-v1.js (16.78 KB)

footer-wordmark 0.83 and masthead 0.76: rewrite the footer wordmark and masthead line at DOMContentLoaded on every page. email-hello 1.62: tree-walks the whole body for @thatlayover.life addresses on every page at DOMContentLoaded. byline-links 3.19: wires .tll-lib-byline-name and -img on any page that has library cards (home shelf, /stories, profiles) at DOMContentLoaded. story-fixes-1029 3.15: no path guard; walks every page for US state flag images and the related heading, DOMContentLoaded. hover 1.21: CSS for .tll-apc (/account) injected into body at DOMContentLoaded, so not first paint. whats-new 6.02: no guard; at DOMContentLoaded + 1.4 s checks Memberstack, fetches /whats-new for signed-in members, puts a dot on the first a[href^='/account'] link on every page and the card on /account. None of these touch the first paint; a defer script runs after parse and before DOMContentLoaded, so their timing does not change under defer.

**Recommendation:** One sitewide deferred chunk (about 17 KB with these seven). hover and the whats-new card could move to the /account chunk, leaving the whats-new dot (about 2 KB) sitewide; byline-links could join the home, /stories and profile chunks instead of being sitewide.


### Multi-path utilities with sitewide parse cost: tll-redesign-p0-v1.js, tll-phase0-v1.js, tll-ep-help-v1.js, tll-ads-v1.js (pause branch), tll-work-trips-v1.js (table and listener) (37.28 KB)

redesign-p0 4.76: computes P on all pages; run() at DOMContentLoaded and again at 1.5 s does css()+expats()+shelf()+band() on '/' and mapPage() on /the-map; nothing elsewhere. phase0 8.40: parse-time css() on /contact (hides [data-tll-relay]), /support (h1 color), /stories (search slot), and a stub-hiding rule on every page; DOMContentLoaded work on /contributors/*, /stories, /the-map, /account and '/'. The parse-time CSS on /contact and /support would flash for a frame under defer (under 0.5 KB of CSS). ep-help 3.87: no guard, DOMContentLoaded, only finds .ep-i marks on /edit-profile. ads 5.94: on every non-ad page it only sets window.adsbygoogle.pauseAdRequests=1 and returns; the ad script never loads there, so the line is moot off /stories, /stories/*, /countries/*. work-trips 14.31: sets window.__tllN2A (country number to alpha-2 table) and registers the tll:stamp-added listener before its path guard, so both run on every page; the hub code runs only on /pursuits/work-trips and is staged (HUB_PUBLIC false).

**Recommendation:** Move phase0's three parse-time css() lines (contact, support, stub) into the core (tiny), chunk the rest of phase0 with its pages; chunk redesign-p0 to '/' and /the-map; ep-help to /edit-profile; ads to /stories, /stories/*, /countries/*; split work-trips into the N2A table plus listener (edit-profile and account chunks) and the hub (pursuits chunk).


### Cover layer (src/design/magazine-2026-10/cover-build/tll-mag-cover-v1.html, appended last) (47.93 KB)

47.93 KB in the bundle: 11.74 KB CSS, 34.55 KB JS (the COVER data object, chip, kicker, deck, credit, the library card stamps and the letter stamp), plus the Newsreader and Inter Tight font link. Path guard /^\/(index\.html)?$/, home only. Must run before first paint: v16's F1 appends the cover style to head at script time and watches the parser with a MutationObserver so the hero is filled the moment [data-h3-hero] has a next sibling, then moves the style to the end of body at DOMContentLoaded for cascade order. A deferred or dynamically injected script cannot promise parse-time execution, so the old hero would show for a blink again (the bug F1 fixed). Only run() needs parse time; cards() and letter() stamps already wait for DOMContentLoaded and a track observer.

**Recommendation:** Keep the cover synchronous, but only on '/': either a page-level registered header script on the Home page (same pinned jsDelivr URL pattern and SRI, synchronous, absent elsewhere) or inline in the core behind the existing guard. Optional second step without any design change: keep the CSS, font link and hero fill (about 14 KB) synchronous and load the card and letter stamps (about 33 KB) as a deferred home chunk, since they already run at DOMContentLoaded.


### Story layer (src/design/magazine-2026-10/story-build/tll-mag-story-v1.html) (20.93 KB)

20.93 KB in the bundle: 14.49 KB CSS, 5.50 KB JS, plus the Newsreader font link. Path guard /^\/stories\/[^/]+\/?$/, story pages only. Timing today: the font link is appended to head at script time (so the Newsreader request starts early); the style is appended to the END of body at DOMContentLoaded by design (so it sits after the template's head and footer styles and wins ties); the JS (caption under the photo, byline into the head, stamp) runs at DOMContentLoaded. So the only part that is really before first paint is the font request; the style placement already happens at parse end, and a defer script runs at exactly that point (readyState 'interactive', place() runs at once).

**Recommendation:** Load it only on /stories/*: a page-level header script on the Stories template keeps today's timing exactly. If it becomes a loader chunk instead, keep a 0.3 KB font-link line in the core for story pages so the Newsreader request is not delayed, and defer the rest; the style still lands at parse end. Keep story-ask before story-is in the same chunk (story-is appends its line inside the .tll-sa box story-ask builds).


### Home scripts: tll-home-bands-v1.js, tll-home-value-v1.js (+ redesign-p0 and phase0 home parts) (8.42 KB)

home-bands 2.79 KB, guard /^\/(index\.html)?$/: swaps the photo bands for members' story photos at DOMContentLoaded. home-value 5.63 KB, P==='/', PUBLIC true: builds the value section at DOMContentLoaded. redesign-p0 on '/': hides Horseshoe Bend from the shelf and adds the coming-soon tiles at DOMContentLoaded (+1.5 s retry). phase0 on '/': shelf count at DOMContentLoaded. None run before paint. Home live set today: 51.8 KB of scripts of which 14 all-page scripts are 35 KB; cover 47.9; consent and styles 10.3; dead 390.8 KB.

**Recommendation:** Home chunk, deferred: home-bands, home-value, redesign-p0 (home half), phase0 (home half), byline-links; about 17 KB. With the cover synchronous on '/', home would load about 21 KB core + 48 KB cover + 17 KB home chunk + 17 KB sitewide chunk, about 103 KB instead of 500, and about 69 KB of it before paint instead of 500.


### /stories library group: tll-page-heroes-v1.js, tll-stories-places-v1.js, tll-stories-noimg-v1.js, tll-series-v1.js, tll-story-is-v1.js, tll-ads-v1.js (44.85 KB)

page-heroes 15.95 KB, PAGES map {/stories,/travelers,/the-map,/about,/for-expats}: credited hero photos at DOMContentLoaded. stories-places 3.33 and stories-noimg 3.28, /^\/stories\/?$/: chips and no-photo panels at DOMContentLoaded. series 11.49: P==='/stories' chips and card tapes at DOMContentLoaded + 1.2 s, also /stories/*, /for-expats, /pursuits/work-trips, /the-paw-passport; writes window.__tllSeries after its fetch (nobody reads it). story-is 4.86: empty-search note on /stories, block on /submit, line on story pages. ads 5.94: on /stories builds the library ad unit at DOMContentLoaded + 0.6 s and loads adsbygoogle only after window.__tllConsent.ads or the tll:consent event (handles both the already-ready and not-yet cases, so late loading is safe). Live on /stories today 98.5 KB; dead 402.3 KB.

**Recommendation:** One deferred /stories chunk, about 45 KB, in this order: page-heroes, stories-places, stories-noimg, series, story-is, ads. Total on /stories becomes about 21 + 17 + 45 = 83 KB.


### Story page group: tll-story-ask-v1.js, tll-story-captions-v1.js, tll-pros-v1.js, tll-series-v1.js, tll-ux-v1.js, tll-story-is-v1.js, tll-ads-v1.js (+ story layer) (51.12 KB)

story-ask 1.69, /^\/stories\/[a-z0-9-]+\/?$/: end-of-story ask at DOMContentLoaded. story-captions 2.30, /^\/stories\/[^/]+\/?$/: reads window.tllPh (page-provided by the template's inline photo script) with retries, captions from placements. pros 6.51: story(), profile() and pursuit() branches at DOMContentLoaded + 0.8 s. series 11.49: story tapes and chips at + 1.2 s. ux-v1 18.33: staged (UX_PUBLIC false, ?preview=ux), story end block and hero cap at + 1.4 s; reads __tllN2A with a {} fallback. story-is 4.86: appends a line inside .tll-sa (needs story-ask first). ads 5.94: in-article unit after consent. Nothing here is before paint except the story layer's font link. Live on a story page today 125.7 KB; dead 375.1 KB.

**Recommendation:** Deferred story chunk, order: story-ask, story-captions, pros, series, story-is, ads, then ux-v1 (or drop ux-v1 from the public build until it is switched on): about 54 KB public, 72 KB with ux-v1. With the story layer synchronous on the template, a story page becomes about 21 + 21 + 17 + 54 = 113 KB.


### /submit group: tll-submit-ux-v1.js, tll-linkout-preview-v1.js, tll-linkout-summary-v1.js, tll-submit-gallery-v1.js, tll-submit-long-v1.js, tll-intake-v1.js, tll-story-is-v1.js, tll-ux-v1.js (61.21 KB)

All guarded on /submit (intake on /submit and /share-photos). submit-ux 3.81 (toolbar labels), linkout-preview 6.60 and linkout-summary 4.56 (Worker link-preview and link-summary), submit-gallery 15.59 (keeps every picked photo, localStorage tllStoryDraft, Memberstack), submit-long 2.16 (body-part-1..12), intake 5.30 (Worker /intake, ending check), story-is 4.86 (block above the form), ux-v1 18.33 (staged guide hint). All run at DOMContentLoaded; none before paint. Dead on every other page.

**Recommendation:** Deferred /submit chunk, about 61 KB (43 KB without ux-v1). Keep the SCRIPTS order inside the chunk; story-is after submit-ux.


### /share-photos group: tll-photos-form-v2.js, tll-photos-caption-v1.js, tll-intake-v1.js (25.18 KB)

photos-form-v2 18.63 KB, /^\/share-photos\/?$/: sets window.__tllPhotosForm='v2' at script time so the page's own inline tll-photos-form-v1 checks it and steps aside, then runs the 30-photo form. That handoff only works if this layer executes before the page body's script, which means synchronous in the head on that page; deferred, both forms would run. photos-caption 1.25 (600-character count) and intake 5.30 run at DOMContentLoaded.

**Recommendation:** Synchronous chunk for /share-photos only (page-level header script, or the loader inserting it with document.write is not acceptable; use the page-level script). About 25 KB on that page, zero elsewhere.


### /edit-profile group: edit-profile-fixes/tll-ep-country-v1.js, tll-ep-ux-v1.js, tll-ep-marks-v1.js, tll-ep-help-v1.js, tll-ep-linkstack-v1.js, tll-crew-v1.js, tll-collections-v1.js, tll-stamps-v1.js, tll-album-settings-v1.js, tll-expat-v1.js (117.42 KB)

ep-country 3.58 (/^\/edit-profile/), ep-ux 28.73, ep-marks 2.08, ep-linkstack 6.39 all on /edit-profile; the first, second and last read window.TLLEP lazily (page-provided by the edit-profile page code), so order against page code does not matter. ep-help 3.87 unguarded but only finds marks here. crew 16.93 (also /account, /contributors/*, /pets/*), collections 13.38 (also profiles), stamps 15.84 (also profiles and /pursuits/*; dispatches tll:stamp-added after a stamp is saved), album-settings 7.14 (continent setting here; on /the-map it wraps window.fetch at parse time), expat 19.48 staged (EX_PUBLIC false; sets window.__tllExpatOn at script time, read lazily by album at DOMContentLoaded + 0.7 s). All run at DOMContentLoaded plus 0.9 to 1.8 s timers; none before paint.

**Recommendation:** Deferred /edit-profile chunk, about 118 KB public (99 KB without expat), order as in SCRIPTS, plus the work-trips N2A table and tll:stamp-added listener (about 5 KB) placed before stamps so a work-trip stamp still lands on the map.


### /contributors/{slug} group: tll-profile-count-v1.js, tll-pf-linkstack-v1.js, tll-crew-v1.js, tll-collections-v1.js, tll-stamps-v1.js, tll-album-v1.js, tll-pros-v1.js, tll-expat-v1.js, tll-phase0-v1.js (profile part) (92.84 KB)

profile-count 1.61 and pf-linkstack 6.27 guarded on /contributors/*. album 12.75 (PUBLIC true) on /contributors/* and lends its projector on /pets/*; defines window.__tllAlbumShow at script time, called lazily by expat (My moves) and pet-passport (Play) on click. crew, collections, stamps and pros share this page with others (see above). phase0 on profiles: noindex when the story list is empty, home-base rule via the Worker /album route, relay-button hide (parse-time CSS, tiny). expat 19.48 staged. All DOMContentLoaded plus timers.

**Recommendation:** Deferred profile chunk, about 73 KB public (93 KB with expat): album before expat and pet code so __tllAlbumShow exists when their buttons render; stamps before pros.


### /account group: tll-export-v1.js, tll-metrics-v1.js, tll-crew-v1.js, tll-whats-new-v1.js, tll-ux-v1.js, tll-hover-v1.js (41.67 KB)

export 10.34 and metrics 7.02 guarded on /account; export loads JSZip from cdnjs on click and reads window.__tllN2A with a {} fallback (country names in the map rows go missing if work-trips is absent). crew (companions card), whats-new card (+1.4 s), ux-v1 staged (welcome flow), hover CSS for .tll-apc. phase0 member check for /account. All DOMContentLoaded plus timers.

**Recommendation:** Deferred /account chunk, about 42 KB public (60 KB with ux-v1), including the N2A table from work-trips so export keeps its country names.


### /the-map and /for-expats groups: tll-album-settings-v1.js, tll-expats-map-v1.js, tll-expert-from-v1.js, tll-page-heroes-v1.js, tll-series-v1.js, tll-expat-v1.js, tll-redesign-p0-v1.js (68.84 KB)

/the-map: album-settings 7.14 replaces window.fetch at script time when P==='/the-map' to add per-continent counts to the map's own request, so it must run before the page body script (synchronous on that page); page-heroes 15.95, redesign-p0 mapPage() and phase0 map buttons at DOMContentLoaded. /for-expats: expert-from 1.50 (form field), expats-map 8.12 (loads d3 and topojson from jsDelivr on demand, Worker /expats-map), page-heroes, series chips, expat 19.48 staged, redesign-p0 coming-soon tiles; all DOMContentLoaded.

**Recommendation:** /the-map: album-settings synchronous on that page (page-level script, 7 KB), the rest a deferred map chunk of about 29 KB. /for-expats: one deferred chunk of about 37 KB public (57 KB with expat).


### Single-page small layers: tll-travelers-fix-v1.js, tll-open-slots-v1.js, tll-lounge-labels-v1.js, tll-lounge-members-v1.js, tll-paw-v1.js, tll-pet-passport-v1.js, tll-work-trips-v1.js (hub), tll-ads-v1.js (/countries) (67.76 KB)

travelers-fix 17.50 on /travelers (+ page-heroes 15.95 there). open-slots 1.94 on /spotlight. lounge-labels 1.58 and lounge-members 2.02 on /gallery (Worker /lounge). paw 9.95 on /the-paw-passport, staged (PUBLIC false, ?preview=paw or ?qr=). pet-passport 20.46 on /my-pets, /the-paw-passport, /pets/*, staged (PP_PUBLIC false). work-trips hub 14.31 on /pursuits/work-trips, staged (HUB_PUBLIC false); its N2A table and stamp listener are needed on /edit-profile. ads on /countries/*. All DOMContentLoaded; none before paint; each is dead weight on every other page today.

**Recommendation:** Path chunks: travelers 33.5 KB, spotlight 1.9, gallery 3.6, pursuits (stamps, pros, series, work-trips) 48 KB, pets (album, crew, pet-passport, paw, series) 72 KB, countries 5.9 KB (ads only). The staged ones can be left out of the public manifest and loaded only when the preview flag or localStorage key is set.


### Staged layers in every download: tll-expat-v1.js, tll-pet-passport-v1.js, tll-ux-v1.js, tll-paw-v1.js, tll-work-trips-v1.js (hub) (82.53 KB)

19.48 + 20.46 + 18.33 + 9.95 + 14.31 = 82.5 KB with PUBLIC flags false; on the public site each runs only its URLSearchParams and localStorage preview check, then returns. stamps-v1 also carries a staged work-trip toggle (WT_PUBLIC false). home-value and album are PUBLIC true (live).

**Recommendation:** The loader can gate these on the preview flag or localStorage key at request time (the same checks the files already do at their top), so public visitors never download them; flip to the normal chunk when a layer goes public.


### Cross-layer globals and events that fix load order (0 KB)

1) window.__tllConsent and the tll:consent event: written by the inline head tool; read by the consent fallback (script time), ads (checks ready first, then listens) and ux-v1 (lazily); safe at any load time. 2) window.__tllPhotosForm='v2': written by photos-form-v2 at script time, read by the /share-photos page's own inline v1 script; must precede the page body (synchronous). 3) window.fetch wrapper: album-settings on /the-map at script time; must precede the page body (synchronous). 4) window.__tllN2A: written by work-trips at script time on every page; read lazily by export (/account) and ux-v1 (/account, /stories/*, /submit) with a {} fallback, so a missing table silently drops country names. 5) tll:stamp-added CustomEvent: dispatched by stamps (edit-profile) after a save; listened by work-trips; listener must exist before the user saves (same chunk, work-trips part first). 6) window.__tllAlbumShow: function defined by album at script time, called on click by expat and pet-passport. 7) window.__tllExpatOn: set by expat at script time, read by album in run() at DOMContentLoaded + 0.7 s. 8) window.tllDivision and gtag('set',{division}): division; nobody else reads the global. 9) window.TLLEP (edit-profile page code) read lazily by ep-country, ep-ux, ep-linkstack; window.tllPh (story template page code) read lazily with retries by story-captions. 10) DOM handoffs that depend on SCRIPTS order within DOMContentLoaded: story-is appends into story-ask's .tll-sa; division's surface() reads pros' .tll-pro-box at click time (runtime, fine); ux-1028 TAIL and hover expect the member-bar CSS. 11) Run-once guards __tllHashTabs, __tllTyping, __tllWhatsNew, __tllDivision, __tllPhotosFormV2Ran, __tllAlbumCounts, __tllSeries only protect against double execution.

**Recommendation:** Inside each chunk keep today's SCRIPTS order; insert dynamically with async=false so chunks execute in order; keep 2 and 3 synchronous on their pages; carry the N2A table into the edit-profile and account chunks; keep album ahead of expat and pet code.


### Split plan: core, synchronous page pieces, deferred chunks, loader (21 KB)

CORE (site-wide registered header script, synchronous, about 21 KB): consent fallback; the 9 styles; ux-1028; mbar-align; division; note-typing; account-hash-tabs; phase0's three parse-time css() lines; a story-page font-link line; and a loader of about 1.5 KB that holds a manifest {path regex: [[url, sha384], ...]} generated by the build. SYNCHRONOUS PAGE PIECES (parse-time needs, applied per page with Webflow page-level custom code so they never load elsewhere): cover layer on Home (47.9 KB, or 14 KB CSS plus hero fill with the stamps deferred); story layer on the Stories template (20.9 KB); photos-form-v2 (+ caption, intake) on /share-photos (25.2 KB); album-settings on /the-map (7.1 KB). DEFERRED CHUNKS via the loader (defer semantics: run after parse, before DOMContentLoaded, so every DOMContentLoaded or timer layer behaves exactly as today): sitewide 17 KB; home 17 KB; stories 45 KB; story 54 KB (72 with ux-v1); submit 43 KB (61 with ux-v1); edit-profile 99 KB (118 with expat); profile 73 KB (93 with expat); account 42 KB (60 with ux-v1); map 29 KB; for-expats 37 KB (57 with expat); travelers 33.5; spotlight 1.9; gallery 3.6; pursuits 48; pets 72; countries 5.9. Resulting load: home about 103 KB (69 before paint), /stories about 83 KB (21 before paint), story page about 113 KB (42 before paint), versus 500 KB before paint everywhere today. LOADER mechanics: each chunk is one file under src/site-layers/chunks/, served from cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@<commit>/..., inserted as script elements with src, integrity (sha384 from the build), crossOrigin 'anonymous', async=false (keeps order, never blocks the parser). Because the core embeds the chunks' hashes and commit, build and commit the chunks first, then build the core pinned to that commit, then register the core (its own SRI) in Webflow as today; one core registration replaces tllsitelayersv16, so the 15-script cap is unchanged, and page-level applications of the four synchronous pieces need checking against that cap. jsDelivr serves gzip and brotli and sends CORS headers, which SRI needs. Keep the preview-gated layers out of the public manifest and request them only when the preview flag or localStorage key is present. Nothing in this plan changes copy, design, nav, footer, consent order or any data-ms-* element; it changes only where and when the same code is fetched.

**Recommendation:** Implement in two steps that can be verified offline with vitest, node parse checks and Playwright against local HTML: step 1 strip comments and emit the chunk files plus manifest from a build-site-layers-v17.py; step 2 register the core and the four page-level synchronous pieces, then verify with Playwright that the home hero fills before DOMContentLoaded, that /share-photos runs one form, that the map request carries the continent counts, and that each page requests only its chunks.


## Third-party and custom scripts on the home page and /stories

Read-only inventory of every third-party and custom script on the home page and /stories, built from the saved Webflow code (scratchpad/p0-1031/after/site-head.html, before/site-footer.html and the page blocks), the 28 Oct live home embeds (src/pages/home/live-2026-10-28/embeds), the 13 Oct export (handoff/claude-design-source/webflow-export-2026-10-13/pages/index.html and stories.html, which carries the Designer-level loads), the registered-script records (src/pages/share-photos/v3/state/registered-scripts.json, reports/evidence/2026-09-30/webflow-site/site-scripts.json) and handoff/WEBFLOW-LOCK.md. Nothing live could be fetched, so every "render-blocking" call is from tag position and attributes in the saved code.

Headline results. (1) No GSAP, ScrollTrigger or SplitText anywhere: the export shows zero data-w-id attributes on home and /stories (no Webflow interactions), and a repo-wide grep finds them only in a test harness. (2) The render-blocking set in the head is: the Google Fonts stylesheet link (Playfair Display 800, JetBrains Mono) in the site head, three registered header scripts output by Webflow as plain script tags (tll_memberstack_init_v2, tllformcontrolsv3 and the jsDelivr site-layers bundle tllsitelayersv16, 500.5 KB raw, 139.7 KB gzip), plus whatever Webflow itself adds from Site settings (its CSS, and webfont.js with WebFont.load for the Designer fonts). (3) The one consent-rule gap: the home page head still carries its own unconditional AdSense script tag (added 28 Oct, src/seo/adsense/home-head-with-adsense.html); the 31 Oct Phase 0 change removed the site-wide copy but no record shows the home page head was edited, so adsbygoogle.js very likely loads on the home page before any choice, on a page where tll-ads-v1 pauses ad requests. (4) The home page carries two map stacks in body embeds: the dashboard (d3-array, d3-geo, topojson-client, world-atlas 110m from jsDelivr npm) and the Map 2.0 loader (tll-map-layers.js 104.9 KB plus maplibre-gl 5.24, world-atlas 50m, OpenFreeMap tiles). (5) Thirteen registered footer scripts load on every page as separate synchronous requests at the end of body; most serve one page (map editor, story notes, bookmarks, avatars) and at least one is dead (tllfbkplacev1, whose button the footer code removes). Two home page scripts and four /stories page scripts (from the 13 Oct export) duplicate work now done in the head code or the bundle. Everything in Site settings, Designer fonts, jQuery, webflow.js, Turnstile and the registered scripts needs Nancy; the inline custom code blocks and the bundle split are repo work that still needs her go-ahead to apply, since the hard rules forbid publishing. Copy note: two script and style ids on the site contain a word the copy rules do not allow; they are referred to by file, not by name.


### Home page head: unconditional AdSense script (page-level code) (0.3 KB)

scratchpad/p0-1031/before/home-head.html lines 1 to 3: the AdSense verification meta tag and `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7257230007536660">`, added 28 Oct (handoff/WEBFLOW-LOCK.md line 135, copy in src/seo/adsense/home-head-with-adsense.html). The 31 Oct Phase 0 change (scratchpad/p0-1031/after/site-head.html, docs/tll-phase0-change-log-2026-11.md row 'Site head') removed the site-wide copy and made verification meta-tag only, but the after folder has no home-head.html and no lock note records a home page head edit, so this tag is very likely still live. It is async, so not render-blocking, but it loads before any consent choice, on the one page where src/site-layers/tll-ads-v1.js sets adsbygoogle.pauseAdRequests, and it duplicates the meta tag now in the site head.

**Recommendation:** Remove the script tag from the home page head (the meta tag may stay or go; the site head already has it). The ads layer loads adsbygoogle only after ad consent and never on home. This is a Webflow page-code write, so it needs Nancy's go-ahead; nothing was changed here.


### Site-layers bundle tllsitelayersv16 (jsDelivr, SRI, registered header script) (500.5 KB)

Applied in the header as a registered hosted script (handoff/WEBFLOW-LOCK.md lines 165 to 200: 16.x pins and sha384 hashes; latest noted 16.32.0 and later). Webflow outputs registered scripts as plain `<script src>` tags without async or defer (see handoff/claude-design-source/webflow-export-2026-10-13/pages/index.html lines 350 to 351 for the header ones), so it is render-blocking on every page. src/site-layers/tll-site-layers-v16.js is 512,561 bytes raw (500.5 KB) and 143,007 bytes gzip; node --check passes. Its header lists 9 style layers, 57 script layers, the story page skin and the home cover (src/site-layers/build-site-layers-v16.py lines 18 to 75). On the home page the active parts are the consent defaults, the style layers, footer wordmark and masthead, tll-home-bands-v1, tll-redesign-p0-v1, tll-home-value-v1 (preview only), the cover (which injects a second Google Fonts stylesheet, Newsreader and Inter Tight) and tll-ads-v1 (pauses). On /stories: tll-page-heroes-v1, tll-stories-places-v1, tll-stories-noimg-v1, tll-byline-links-v1, tll-ads-v1 (one unit after the ninth card, after ad consent). The other 40-plus layers are for /edit-profile, /submit, /share-photos, /account, /the-map, /for-expats, pets, series, stamps, album, export and metrics, and run their path check then exit.

**Recommendation:** Defer, then split. Step 1: test on the subdomain whether the Webflow applied-script `attributes` field accepts `defer` (the records show `attributes: {}`); if not, move the script to the footer location, which takes it out of the render path. Step 2: build a small core bundle (consent defaults, style layers, nav and footer text, ads gate) and per-page bundles loaded by pathname from the same pinned commit (each file needs its own SRI hash). Both are repo changes plus one registered-script swap; applying needs Nancy's go-ahead.


### Google Fonts stylesheet link in the site head (Playfair Display 800, JetBrains Mono 400/600) (0.4 KB)

scratchpad/p0-1031/after/site-head.html lines 73 to 74: `<link rel="preconnect" href="https://fonts.gstatic.com">` and `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,800;1,800&family=JetBrains+Mono:wght@400;600&display=swap">`. A stylesheet link in the head is render-blocking. Used for every h1/h2 (tll-proto-type-v1 forces Playfair 800) and the mono eyebrows. The same two families are also requested by the Designer font settings (see the fonts finding), so they are fetched twice by different URLs. The site head also declares @font-face aliases (DM Sans, Inter, Syne, Recoleta, DM Serif Display, Druk) that point at fonts.gstatic.com woff2 files with font-display swap (lines 157 to 168); those fetch only when text uses the family and do not block.

**Recommendation:** Keep the fonts, make the link non-blocking: add `<link rel="preload" as="style">` and switch the stylesheet link to the `media="print" onload="this.media='all'"` pattern the old CookieConsent stylesheet used (before/site-head.html lines 11 to 12), with a noscript copy. Then pick one path for Playfair and JetBrains Mono (head link or Designer), which needs Nancy because the Designer side is a Site settings change.


### Registered header script tll_memberstack_init_v2 (Memberstack login and session)

Site settings, Custom code, Scripts; location header (reports/evidence/2026-09-30/webflow-site/site-scripts.json, first entry; export index.html line 350 shows it as a plain script tag from cdn.prod.website-files.com, so render-blocking). It loads https://static.memberstack.com/scripts/v2/memberstack.js for app_cmpdpi625001s0slnhgz17hgs (reports/evidence/2026-09-30/webflow-site/third-party-inventory-from-code.md). It powers login, the data-ms-content member/anonymous gating (tll-core-v2-css in the site footer hides members blocks until html.ms-loaded) and every $memberstackDom call in the code. Its source is Webflow-hosted and could not be read from the sandbox; size unknown.

**Recommendation:** Keep. It must run early so member blocks do not flash. Only possible trim: test async or defer on the subdomain and watch for a flash of the anonymous nav; a change here touches nav behavior and Site settings, so it needs Nancy.


### Registered header script tllformcontrolsv3 (form control restyle)

Site settings script, location header, applied site-wide (site-scripts.json; export index.html line 351, plain script tag, render-blocking). Created 25 Sep (registered-scripts.json). troubleshoot-plan.md line 88: it restyles form controls on every page, file fields included; its code is Webflow-hosted and unread, size unknown. The site footer block tll-forms-v2 (scratchpad/p0-1031/after/site-footer.html lines 45 to 152) now specifies the same controls in CSS, so this script is a likely duplicate.

**Recommendation:** Read its code once the CDN host is reachable, then either remove it or move it to the footer location. Site settings change, needs Nancy.


### Webflow Designer fonts (webfont.js and WebFont.load, Site settings)

The Designer loads Google Fonts through its own webfont.js plus a WebFont.load call in the head, which Webflow writes synchronously (render-blocking). The MCP API does not expose the Designer font list (reports/evidence/2026-09-30/webflow/fonts.json note), so the families are inferred from the style dump in handoff/claude-design-source/webflow-export-2026-10-13/css/fonts.css: Playfair Display 400/700/800, IBM Plex Sans Condensed 400 to 700 (body and button variables), JetBrains Mono, Dancing Script 700 (the 'that' in the nav wordmark), Teko 400/700 (Heading Font variable, but the head code forces h1 and h2 to Playfair, so Teko is probably never painted) and IBM Plex Sans 400 (two styles). Playfair and JetBrains Mono overlap with the head link.

**Recommendation:** Needs Nancy in the Designer: remove Teko and IBM Plex Sans if no element renders them, and keep one request path for Playfair and JetBrains Mono. Dancing Script stays (nav wordmark is off-limits). Verify on the live page source once reachable: look for ajax.googleapis.com/ajax/libs/webfont and the WebFont.load families list.


### jQuery 3.5.1 (Webflow runtime)

https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js, end of body, plain script tag (export index.html line 896, stories.html line 462). Webflow adds it for webflow.js. Not render-blocking (after the content) but it delays DOMContentLoaded and every registered footer script waits behind it.

**Recommendation:** Keep. It is platform code and cannot be removed or deferred from custom code. Flag for Nancy only as context.


### webflow.js (site runtime: forms, nav, dropdowns, Turnstile loader; GSAP only with interactions)

Site-specific file at the end of body; its URL was not captured in the export (fixture comment, src/pages/home/live-2026-10-28/ux/fixture-home-current.html near line 1121). It runs the form runtime, which also injects Cloudflare Turnstile, and the nav and dropdown behavior. Webflow bundles GSAP, ScrollTrigger and SplitText only when Webflow Interactions are used: the export shows 0 data-w-id attributes on both home and /stories, and no repo file loads gsap, so there is nothing of that kind to defer or remove.

**Recommendation:** Keep. When the live site is reachable, confirm by searching the page source for 'gsap' and 'data-w-id'. Platform code, Nancy.


### Cloudflare Turnstile (Webflow form bot protection)

Site settings, Forms, bot protection puts data-turnstile-sitekey on every Webflow form and webflow.js loads https://challenges.cloudflare.com/turnstile/v0/api.js on pages with forms. Home has two forms (newsletter 'Html Form' in the footer component and 'Library search'); /stories has the search bar and the footer newsletter. The custom code strips the key from the two search forms because the invisible widget kept their buttons disabled (scratchpad/p0-1031/before/home-footer.html search routing v2; before/stories-footer.html search UI v2). Load timing cannot be read here; it is Webflow's own runtime.

**Recommendation:** Keep as is. Loading Turnstile only when the newsletter field gets focus would mean taking the newsletter form away from Webflow's own handler, and that form lives in the footer component, which is off-limits. Nancy could review the Site settings toggle, nothing else to do in code.


### Registered footer scripts, 13 site-wide (Site settings, Scripts, location footer)

Loaded on every page after jQuery as separate plain script tags from cdn.prod.website-files.com (export index.html lines 900 to 912; site-scripts.json; troubleshoot-plan.md line 82). Not render-blocking, but 13 serial requests before DOMContentLoaded. By name and the reports: tll_memberstack_skin_v1 (member UI skin), tll_world_map_v1 (loads d3@7, topojson-client@3 and world-atlas@2 from jsDelivr for the old SVG map; only /the-map has the canvas; troubleshoot-plan.md line 42 says it loads on every page), tllfactsv1 (counters), tllreveal 1.1.0 (scroll reveal), the member record sync script registered 23 Sep 16:35 (its id contains a word the copy rules do not allow; see registered-scripts.json), tll_save_story and tll_saved_shelf (bookmarks, story and account pages), tll_reader_notes and tll_reader_notes_form (story comments), tllformlabelsv1 (form labels), tllavatarv1 (avatars), tllmapv3 (map editor), tllfbkplacev1 1.1.0 (loads the old feedback widget; the footer block tll-note-v1-js in after/site-footer.html line 299 removes that widget's button, so this script now does nothing useful). Their code is Webflow-hosted and unread from the sandbox; sizes unknown.

**Recommendation:** Page-scope or fold. Remove tllfbkplacev1 (dead). Move tll_world_map_v1 and tllmapv3 to /the-map page scripts (docs/redesign-plan-2026-10-31.md row 11 already proposes this), the notes, bookmark and sync scripts to the story and account pages, and read the rest before deciding. All Site settings changes, Nancy's go-ahead required; the API can apply them once approved.


### Home page scripts (page-level registered, 13 Oct export): tllhomesearchv5, tll_home_story_counter

export index.html lines 1203 to 1204, end of body. tllhomesearchv5 (28 Sep) routed the home search; the page footer code 'home search routing v2' (before/home-footer.html) and embed d3ac79f6 now do that job. tll_home_story_counter (9 Oct) writes the story count; the site head tll-live-stories-v1 (after/site-head.html lines 100 to 117) and the Site stats collection (31 Oct) now cover counts. Whether both are still applied after 13 Oct is not recorded.

**Recommendation:** Confirm in the Designer that they are still applied, then remove both as duplicates. Needs Nancy.


### /stories page scripts (page-level registered, 13 Oct export): tllauthorlinkv1, tllstorycountv2, tllstorycountv3, tllflagsv53

export stories.html lines 769 to 772, end of body. tllstorycountv2 and v3 are both applied (v3 replaced v2 on 11 Oct, STATUS row S35, but v2 was not removed). tllauthorlinkv1 (28 Sep) links card bylines; the bundle's tll-byline-links-v1 (29 Oct) now does the same. tllflagsv53 (12 Oct, src/site-layers/tllflagsv53.js) writes the country flag labels on cards.

**Recommendation:** Remove tllstorycountv2 and tllauthorlinkv1 as duplicates; keep tllstorycountv3 and tllflagsv53 unless their work moves into the bundle's stories layer. Needs Nancy (page settings).


### Home embed 405baa84 (dashboard chapter): d3-array, d3-geo, topojson-client, world-atlas 110m from jsDelivr npm (9.5 KB)

src/pages/home/live-2026-10-28/embeds/405baa84.html line 51 and 71: loads cdn.jsdelivr.net/npm/d3-array@3.2.4, d3-geo@3.1.1, topojson-client@3.1.0 and world-atlas@2.0.2/countries-110m.json, plus the owner record from jsDelivr gh and the Worker /owner-map, to draw the small SVG map in the dashboard chapter. Body embed, so not render-blocking, but it fetches four files on every home visit as soon as the embed script runs.

**Recommendation:** Load on approach: start the four fetches from an IntersectionObserver when the dashboard section is within one viewport, and keep the no-JS and reduced-motion paths. Embed edit, so Nancy's go-ahead; file-only change can be staged.


### Home embed 4b170d8b (Map 2.0 loader): tll-map-layers.js, maplibre-gl 5.24, world-atlas 50m, OpenFreeMap tiles (128.4 KB)

src/pages/home/live-2026-10-28/embeds/4b170d8b.html: loads map-2.0/dist/tll-map-layers.css (23.5 KB) and tll-map-layers.js (104.9 KB) from jsDelivr pinned to 6a1098ab with a statically.io fallback; that script in turn loads maplibre-gl@5.24.0, world-atlas 50m and topojson-client from jsDelivr npm, tiles from tiles.openfreemap.org, and strava-embeds.com on demand (map-2.0/dist/tll-map-layers.js lines 194 to 204). It was added 9 Oct beside the hidden old iframe (STATUS row S05) and is still in the 28 Oct live embed capture, while the dashboard embed above draws its own map since 21 Oct. The 13 Oct export does not contain #tll-map-layers, so whether the band is shown or hidden today could not be settled from the repo; a hidden section still runs the loader.

**Recommendation:** Check in the Designer whether the tll-map band is hidden. If hidden, remove the embed (Nancy). If shown, load the Map 2.0 code on approach the same way as the dashboard. Either way the home page should not carry two map libraries.


### Consent tool and the gated analytics and ads loads (fundingchoicesmessages, gtag, Ahrefs, adsbygoogle) (4.2 KB)

scratchpad/p0-1031/after/site-head.html lines 6 to 32 (tll-consent-v3): inline in the head, sets Consent Mode v2 defaults to denied, loads https://fundingchoicesmessages.google.com/i/pub-7257230007536660 async, and only after analytics consent loads https://www.googletagmanager.com/gtag/js?id=G-T1K83PRL1R and https://analytics.ahrefs.com/analytics.js, both async by createElement. src/site-layers/tll-ads-v1.js loads adsbygoogle.js only after ad consent and only on /stories, /stories/{slug} and /countries/{slug}. The GA4 events block in the footer (after/site-footer.html lines 180 to 244) sends nothing without consent. The site footer no longer loads cookieconsent.umd.js (diff before to after, lines 1 to 30 removed).

**Recommendation:** Keep exactly as is; this is the consent rule. Two cosmetic cleanups only: the comment at site-head line 25 still says the old CookieConsent script loads, and the #cc-main style block (lines 42 to 50) styles a banner that no longer exists. Both are comment and dead-CSS trims, no visible change.


### Site head inline styles and scripts (first-party, all pages) (45.9 KB)

scratchpad/p0-1031/after/site-head.html is 47,035 bytes of inline code: style blocks tll-embed-mode, tll-shelf-fix, tll-craft-polish, tll-proto-type-v1, tll-consistency-v1, tll-mobile-nav-v1, tll-proto-parity-v1, tll-v9-chrome-v1, tll-v9-type-v1, tll-v91-hero-scrim-v1, tll-v91-motion-v1, tll-floor-v1, and scripts tll-live-stories-v1 (fetches /sitemap.xml once per session for the story count), the page-class script, tll-mobile-nav-js-v1, tll-proto-parity-js-v1 (walks up to 5,000 elements with getComputedStyle after load for contrast repair), tll-v9-chrome-js-v1, tll-v91-motion-js-v1, tll-floor-js-v1 (tree walk after load). Inline code in the head is parsed before first paint by nature, but there is no network cost; the heavy DOM walks run after load.

**Recommendation:** Keep. Later, fold the thirteen style blocks into one and retire rules that later blocks override (tll-craft-polish hover lift is undone by tll-v91-motion-v1). The two after-load contrast walkers (this one and tll-a11y-motion-v1 in the footer) do the same job twice; keeping one is a CPU saving on phones. Repo work, Nancy's go-ahead to apply.


### Site footer inline code (first-party, all pages) (27.8 KB)

scratchpad/p0-1031/after/site-footer.html, 28,482 bytes, end of body: share-link fixes, tll-pass-a CSS, tll-core-v2-css (data-ms-content gating, never to be removed), tll-forms-v2 CSS, tll-core-v2 JS (lazy images, founder avatar from lh3.googleusercontent.com, login redirect), tll-a11y-motion-v1 (skip link, contrast repair, tap targets, desktop parallax), tll-ga4-events-v1 (consent gated), tll-note-v1 CSS and JS (Tell the editor). No third-party script loads; one image request to Google (the founder avatar).

**Recommendation:** Keep. Nothing here blocks rendering. The avatar could move to a Webflow-hosted asset to drop the Google image request, which is a CMS or asset change for Nancy.


### Home page head and footer inline code (page-level, first-party) (16.2 KB)

scratchpad/p0-1031/before/home-head.html (11,296 bytes, apart from the AdSense lines above): canonical and og:url, styles tll-home-search-v3, tll-home-search-mobile-v4, tll-flow-v1 (long-scroll layer, ticker animation, reveal), tll-home-hero-cap-v1, tll-home-search-left-v5 and v6, scripts tll-home-search-placeholder-v1 and tll-live-writers-v1 (fetches /sitemap.xml once per session for the writer count). before/home-footer.html (5,288 bytes): honesty pass v1, voice sweep v1, search routing v2 (strips Turnstile from the search form), h3-note-fade-v1. All inline, no external hosts.

**Recommendation:** Keep. tll-live-stories-v1 (site head) and tll-live-writers-v1 both fetch /sitemap.xml on a first visit; one fetch could feed both counts, or both could read the new Site stats collection. Minor, repo work.


### /stories page head and footer inline code (page-level, first-party) (45.9 KB)

scratchpad/p0-1031/before/stories-head.html (11,422 bytes): canonical, styles tll-lib-search-v2, tll-lib-filters-mobile-v1, tll-flow-v1, tll-v9-j12-v1. before/stories-footer.html (35,624 bytes): card links v2, Stories Index v4 CSS, tll-lib-search-v4, search UI v2 (strips Turnstile from the search form), tll-lib-chips-v1, tll-lib-chips-css-v1, tll-lib-fixfirst-v1, tll-lib-lead-v1, tll-s3-stories-v1 CSS and JS. No external script or stylesheet loads on this page beyond the site-wide set.

**Recommendation:** Keep. The chips, lead and search scripts could move into the bundle's stories layer later so /stories has one script instead of four, but that is a tidy-up, not a performance fix.


### Story template head and footer (page-level, for /stories/{slug}) (48 KB)

scratchpad/p0-1031/after/storytpl-head.html (19,024 bytes): Article and FAQ JSON-LD, tll-ld-unescape-v1, date format, the route strip and meta styles, Been here script (member JSON), label scripts (Reklame for, from Sponsor fields only), tll-v9-j13-v1. before/storytpl-footer.html (30,079 bytes): FAQ schema, share fix, keep-reading fallback, gallery, tll-st3-story-v1. No external loads here; on story pages the bundle adds the Newsreader and Inter Tight Google Fonts stylesheet and, after ad consent, up to two AdSense units.

**Recommendation:** Keep. If Newsreader stays the story typeface, add it to the one preloaded Google Fonts request instead of a script-inserted link, so the swap happens before first paint.


### Second Google Fonts stylesheet injected by the bundle (Newsreader, Inter Tight) on home and story pages

src/site-layers/build-site-layers-v16.py lines 86 to 112: the story and cover parts insert `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader...&family=Inter+Tight...">` by script on /stories/{slug} and on the home page. Script-inserted stylesheets do not block parsing, but the fonts arrive after the bundle has run, so the cover and story type swap late.

**Recommendation:** Move the request into the site head beside the existing Google Fonts link once that link is made non-blocking, or preload the two families on those pages. Repo change to the build script plus the head edit, Nancy's go-ahead to apply.


### Cloudinary (api.cloudinary.com/v1_1/idonvlow, upload preset tll_photos)

Called only from the bundle on user actions: the photo crop on /edit-profile (tll-ep-ux-v1), /share-photos uploads (tll-photos-form-v2) and the companion photo in stamps (tll-stamps-v1), at src/site-layers/tll-site-layers-v16.js lines 2294, 2465 and 2904. No Cloudinary script or stylesheet is loaded; these are fetch POSTs after a tap. Nothing runs on home or /stories.

**Recommendation:** Keep. No change.


### Worker endpoints and other on-demand hosts referenced by the bundle

tll-travel-wire.thatlayoverlife.workers.dev (owner-map, lounge, intake, link-preview, link-summary, expats-map, export, metrics, pros, settings, whats-new, album), YouTube nocookie, TikTok, Twitch, X embed hosts and wa.me share links, all fetched or built only on the pages and actions that use them (profile link stacks, series, forms). cdn.jsdelivr.net/gh for pinned data files, and HatScripts circle-flags on contributor pages. None loads a script at first paint on home or /stories.

**Recommendation:** Keep. No change.


### Webflow site CSS (cdn.prod.website-files.com, Designer-generated)

Webflow writes its compiled stylesheet as a blocking `<link rel="stylesheet">` in the head on every page (represented in the export by css/webflow-base.css and css/tll-webflow.css). It is the platform's own output and sits before all custom code.

**Recommendation:** Keep. Platform, Nancy only as context. The custom head styles above layer on top of it with !important, which is why consolidating them later matters more than this file.


## Images the site layers insert, and how they are sized

Read-only inventory of every image the site layers insert or re-point, from the v16 bundle sources (cover build, story build, page heroes, home bands, album, collections, stamps, expat, pet passport, work trips, crew, pros, ux, lounge members, linkout preview, expats map) plus the Webflow page code they depend on (home fixture, live library-rail embed, story template footer). Hosts seen: cdn.prod.website-files.com/69d6145cf421c777840c1e25/ (site assets placed in the Designer; the 13 Oct export manifest lists -p-500/800/1080/1600 variants for Curacao.jpg and -p-500 for nancy-carleton-avatar.jpg, but only originals for sortsol-hero, pantanal-hero and magnus-holi-side, so variants are per file and must be probed with an onerror fallback), cdn.prod.website-files.com/6a0b29c6d081332e921900d8/ (CMS re-hosted story heroes and contributor avatars with doubled ids; zero entries in the manifest, variant existence unknown), res.cloudinary.com/idonvlow/ (member uploads: collections, stamps, lounge photos, intake story covers and galleries; URL transforms work), cdn.jsdelivr.net HatScripts circle-flags SVGs, Memberstack profileImage hosts passed through by profile-sync (no URL resizing), and third-party og:image hosts for link-out stories. Only three layers size anything today: album (Cloudinary c_limit,w_600 and w_1800), collections (c_fill,w_400,h_400) and stamps (c_fill,w_120,h_120); every Webflow-hosted image is inserted as the full original, including the home cover hero, the two home bands, the page-hero tiles, album mounts and series rails. Reserved boxes are mostly in place through CSS aspect-ratio or fixed heights; the gaps are the story hero (made static by the magazine layer with height:auto and no width/height), the related cards, and the lounge tiles. Likely LCP elements: the home cover hero (its real fetch cannot start until the 426 KB blocking bundle has run and the hero element is parsed, after the browser has already started fetching the Webflow Curacao.jpg with fetchpriority=high, so one image is wasted and the LCP image starts late), the story hero (already fetchpriority=high in the template, the problem there is layout shift, not priority), the /the-map background and the /for-expats side photo (inserted eager but without fetchpriority), and on /gallery the twelve member tiles the lounge layer prepends to the top of the grid as untransformed Cloudinary backgrounds. Recommended shape for a fix: one shared helper in the bundle that, per host, builds a Webflow srcset only from candidates no wider than the known original (-p-500, -p-800, -p-1080, -p-1600) with sizes, Cloudinary c_limit or c_fill transforms with q_auto,f_auto, decoding=async, loading=lazy unless the image is above the fold, fetchpriority=high on exactly one LCP candidate per page, width/height or a CSS aspect-ratio on every box, and a one-time onerror that strips srcset and sizes and resets src to the original (the browser does not try other srcset candidates after a 404). Nothing was changed; the live sizes in KB could not be measured from the sandbox.


### Home cover hero: [data-h3-hero] > img[data-tll-parallax="hero"] (src/design/magazine-2026-10/cover-build/tll-mag-cover-v1.html line 104)

The Webflow page already carries this img with loading=eager, fetchpriority=high, decoding=async and a site-bucket src (69d6145cf421c777840c1e25/6a115e2be857613f33b48a9d_Curacao.jpg, which has -p-500/800/1080/1600 variants in the export manifest). The cover script removes srcset and sizes, sets img.src to COVER.img, a full original from the CMS bucket (6a0b29c6d081332e921900d8/..._chesney-lish-spain-hero.jpeg, declared 1440x1920), and sets width=1440 height=1920. The v16 build runs this from a MutationObserver as soon as the hero has a next sibling, but that is still after the 426 KB render-blocking bundle has downloaded and executed, so the browser has already begun fetching Curacao.jpg at high priority and the real LCP image starts late. No sized variant is used: a 390 px phone downloads the 1440x1920 original. Layout: the hero section has a CSS min-height and the img is absolutely positioned, so the swap causes no layout shift. This is the LCP element of the home page.

**Recommendation:** Keep eager, fetchpriority=high and decoding=async on the element after the swap (they survive because only src, srcset and sizes change; verify in the Playwright harness). Build a srcset from the Webflow pattern with candidates no wider than the original (-p-500 500w, -p-800 800w, -p-1080 1080w, original 1440w) and sizes=100vw, with a one-time onerror handler that strips srcset and sizes and resets src to the original. Because the 25 covers are fixed at build time, let build-cover.py probe which variants exist (it runs where the network is available) and write only verified candidates into COVERS, which removes the runtime guesswork. To start the fetch earlier, emit a <link rel=preload as=image fetchpriority=high imagesrcset imagesizes> for the current week's cover at the top of the bundle before the body is parsed, or better, in a small inline head script placed before the bundle tag that repeats the week arithmetic from line 97. The wasted Curacao fetch can only be removed on the Webflow side (a smaller placeholder on the Designer image element), which is a tradeoff because that image is what shows if the bundle ever fails.


### Home cover chip avatar: .tll-mg-chip img (cover build line 107)

Inserted through innerHTML with src=COVER.avatar, width=36 height=36, no loading attribute (eager, which is right because the chip sits inside the hero), no decoding attribute, no sized variant. Hosts: Chesney Lish from the CMS bucket (variants unknown), Nancy Carleton from the site bucket (nancy-carleton-avatar.jpg has a -p-500 variant in the manifest). Box is reserved by the attributes and the 36 px CSS. Not the LCP element.

**Recommendation:** Use the -p-500 variant when the host is cdn.prod.website-files.com, with the onerror fallback to the original; add decoding=async and fetchpriority=low so it never competes with the hero.


### Home people strip faces: .tll-mg-faces img (cover build line 133)

Three contributor avatars inserted with width=72 height=72 loading=lazy, full original URLs (two from the CMS bucket, Nancy from the site bucket). Reserved 72 px circles. Below the fold, lazy is correct.

**Recommendation:** Same -p-500 with fallback and decoding=async as the chip. Keep lazy.


### Home photo bands: figure.h3-il[data-h3-il=rio|montenegro] img (src/site-layers/tll-home-bands-v1.js line 25)

The page's own band images are site-bucket interludes with loading=lazy, decoding=async, width=2000 height=1500. The layer strips srcset and sizes, points src at the full CMS-bucket pantanal and sortsol heroes and sets width=2400 height=1350, while the cover data describes the same two files as 1440x1920, so one of the declared sizes is wrong. The band height is fixed by CSS (52vh and 60vh, min 320 px) with object-fit cover, so the mismatch causes no shift, but the attributes mislead the browser's sizing of the lazy fetch. Lazy and decoding=async survive the swap. Not LCP.

**Recommendation:** Correct width and height to the real intrinsic size of each file or drop them (the CSS height already reserves the box). Add a srcset of verified Webflow candidates with sizes=100vw and the onerror fallback. Keep lazy.


### Home shelf cards: .h3-card-ph img and .h3-card-by img (not a layer: Webflow embed src/pages/home/live-2026-10-28/embeds/94ce12c0.html; the cover layer only appends an SVG stamp)

Nine cards, each with the full original CMS hero (the same 1440x1920 files used as covers) shown in a 380x475 box with width=380 height=475, loading=lazy, decoding=async, no srcset; CSS .h3-card-ph{aspect-ratio:4/5} reserves the box. Nine 40x40 lazy avatars, same full originals. The map card in the same embed sets [data-h3-mc-img].src on interaction with no width or height. tll-redesign-p0-v1 hides one card and tll-phase0-v1 edits the shelf note; neither touches src.

**Recommendation:** This is a Webflow page embed, so the change belongs in the embed, not the bundle: srcset -p-500 500w, -p-800 800w with sizes="(max-width:767px) 70vw, 300px" and the onerror fallback; avatars -p-500. If editing the embed is off the table, the bundle could rewrite these at runtime, but that re-fetches images already in flight and is the weaker option.


### Story page hero: .tll-story-hero-img, moved into figure.tll-mg-fig by the magazine layer (src/design/magazine-2026-10/story-build/tll-mag-story-v1.html lines 20, 22 and the script)

The template img has fetchpriority=high, decoding=async, no loading attribute (eager), no width or height and no srcset; src is the full CMS hero. The magazine layer turns it from an absolutely positioned backdrop into a static block (position:relative, width:100%, height:auto, max-height:85vh, aspect-ratio:auto), so until the file arrives the figure is 0 px tall and everything under it shifts down when the photo lands. The layer does not change src, so the preload scanner already fetches it at high priority; the problem is layout shift, not priority. LCP candidate on desktop; on phones the h1 block often fills the first screen and the text may be LCP instead.

**Recommendation:** Reserve the box: give .tll-mg-fig a provisional aspect-ratio (3/2 matches the landscape heroes; read img.naturalWidth and naturalHeight when img.complete and set the exact ratio inline, then clear the provisional rule on load). Enable the Designer's responsive setting on the CMS image element so Webflow emits srcset and width/height natively, which also fixes the related cards. Do not add a second fetchpriority or preload; it already has one.


### Story page related cards and gallery: .tll-related-img, .tll-gallery-img, figure.tll-inline-photo (not a layer: scratchpad/p0-1031/before/storytpl-footer.html lines 84 and 130 to 140, src/site-layers/tllinlinephotosv2b.js)

Related cards clone the CMS hero with loading=lazy and no width or height; the magazine layer gives .tll-related-img-wrap a radius but no aspect-ratio, so they shift on load. Gallery tiles are built from the w-json payload with the full original URL, loading=lazy, and the magazine CSS .tll-gallery-img{aspect-ratio:1 !important} reserves a square; the same rule still applies after tllinlinephotosv2b moves a tile into figure.tll-inline-photo, so inline photos are square and reserved. tll-story-captions-v1 only adds captions. None are LCP.

**Recommendation:** Add aspect-ratio:3/2 to .tll-related-img-wrap in the magazine CSS (no visible change before load). For gallery and inline tiles use -p-500 (tiles under 300 px) and -p-800 (inline, under 760 px) with the fallback; keep lazy. These are template scripts, so the edit is in Webflow page code.


### /stories row of four covers: .tll-ph-row .tll-ph-img img (src/site-layers/tll-page-heroes-v1.js, img() line 102, stories() line 113)

img() sets src to the full original, decoding=async, loading=lazy unless eager, no width or height, no srcset; the frame reserves the box with CSS aspect-ratio 4/5 (3/4 on phones) and fades the image in on load. On /stories the four tiles go under the search bar and are lazy (eager only when the bar is missing). Tiles are about 220 px wide on desktop and 46vw on phones, yet each is a 1440x1920 original. Not LCP (the library lead card or h1 is).

**Recommendation:** -p-500 with the fallback is enough for both breakpoints (46vw at 2x on a 390 px phone is 360 px). Keep lazy. Note ibiza and jaguar are CMS-bucket files; fitzroy, bulgaria, montenegro, lapaz and ghana also exist as site-bucket originals (for example 69d6145cf421c777840c1e25/6a0e022469c0ce59398ce287_La Paz Mexico.jpg) whose -p- variants appear in the export manifest, so those five could point at verified site-bucket variants.


### /travelers faces: .tll-ph-faces .tll-ph-img img (page heroes, travelers() line 117)

Four avatars inserted eager (above the fold), full originals, 64 px circles on phones and 4/5 tiles of about 140 px at 1200 px and up; boxes reserved by CSS. Not LCP (the h1 is).

**Recommendation:** -p-500 with fallback (Nancy's site-bucket avatar is known to have it), decoding=async, keep eager, add fetchpriority=low.


### /the-map background: .tll-ph-bg .tll-ph-img img (page heroes, map() line 120)

The sortsol hero inserted eager as an absolutely positioned backdrop under a deep scrim, full original, no srcset, no fetchpriority; the section padding reserves the box. Largest painted element on the page, so an LCP candidate, and it cannot start loading until the bundle has run.

**Recommendation:** fetchpriority=high on this one image, eager, srcset -p-1080 and -p-1600 (the site-bucket copy of sortsol has no variants in the manifest, so probe and fall back) with sizes=100vw. Since the URL is fixed per path, emit a preload link for it at bundle start when location.pathname is /the-map.


### /about filmstrip: .tll-ph-strip .tll-ph-img img (page heroes, about() line 123)

Four lazy tiles (ibiza, magnus, fitzroy, jaguar) in fixed 320 px tall cells (240 px, 72vw wide on phones), full originals, boxes reserved by CSS height. Not LCP.

**Recommendation:** -p-800 with fallback (72vw at 2x on a phone is about 560 px), keep lazy.


### /for-expats side photo and band of three: .tll-ph-side and .tll-ph-band .tll-ph-img img (page heroes, expats() lines 125 to 131)

The side tile (sortsol) is eager, 4/5 at 320 px on desktop and 4/3 full width on phones, no fetchpriority; the band of three (montenegro, lapaz, ghana) is lazy at 3/2 in roughly 340 px columns. All full originals; boxes reserved by CSS aspect-ratio. The side tile is an LCP candidate on both breakpoints.

**Recommendation:** Side tile: fetchpriority=high, srcset -p-800 and -p-1080 with sizes="(min-width:1100px) 320px, 100vw" and fallback. Band: -p-800 with fallback, keep lazy.


### Profile album mounts: .tll-alb-mount img (src/site-layers/tll-album-v1.js line 77, sized() line 32)

sized(u,w) only transforms res.cloudinary.com (c_limit,w_600,q_auto,f_auto); Webflow CMS heroes and gallery photos (from the Worker's /album, hero-image.url and photo-gallery urls) pass through as full originals. alt='', loading=lazy, square box reserved by CSS aspect-ratio:1, mounts are about 150 px at seven columns and about 170 px at two. Inserted 700 ms after DOMContentLoaded, not LCP.

**Recommendation:** Extend sized() per host: Cloudinary c_fill,w_400,h_400,q_auto,f_auto (the mount is square, so a server-side crop saves bytes), Webflow -p-500 with the fallback, other hosts untouched. Keep lazy.


### Slide show stage: .tll-ss-stage img and the next-slide preloader (album lines 46 and 47)

On demand only; Cloudinary gets c_limit,w_1800, Webflow URLs load at full size; object-fit contain in a full-screen stage, no layout concern. Prefetches the next slide with new Image().

**Recommendation:** Low priority. Webflow -p-1600 with fallback would trim the largest files; otherwise leave as is.


### Collection tiles: .tll-col-it img (src/site-layers/tll-collections-v1.js line 36 to 39)

Cloudinary c_fill,w_400,h_400,q_auto,f_auto, loading=lazy, img absolutely filling a tile with min-height 120 px in 120 px plus columns; box reserved. Clicking cycles src through more photos with the same transform. Private by default, profile and /edit-profile only. Already sized.

**Recommendation:** Fine as is. Optional: w_300,h_300 with dpr_auto matches the 120 to 200 px tiles more closely.


### Stamp thumbnails: .tll-st-it img (src/site-layers/tll-stamps-v1.js line 46)

Cloudinary c_fill,w_120,h_120,q_auto,f_auto in a 52 px box, loading=lazy, reserved. Already sized.

**Recommendation:** Fine as is.


### Lounge member tiles on /gallery: [data-tll-member-photo] with style.backgroundImage (src/site-layers/tll-lounge-members-v1.js line 16)

The Worker's /lounge returns the raw Cloudinary secure_url (photo-clean uploads up to 2000 px on the long edge, JPEG 0.88) and the layer sets it as a CSS background on a clone of the page's own tile, then inserts the twelve tiles before grid.firstChild, so they become the first tiles in the viewport. CSS backgrounds cannot be lazy and carry no priority hint, so all twelve full-size uploads start together 300 ms after DOMContentLoaded plus the fetch, and the top ones are the LCP candidates for the page. Box is reserved by the cloned tile's CSS.

**Recommendation:** Apply a Cloudinary transform (c_fill,w_600,h_600,q_auto,f_auto,dpr_auto, matched to the tile's aspect) either in the layer or, better, in the Worker's lounge handler in src/intake.js so every consumer gets sized URLs. If the layer is ever rebuilt, prefer an <img> with loading=lazy over a background so the browser can defer tiles below the fold.


### Living Library book avatars: .tll-ex-book header img (src/site-layers/tll-expat-v1.js line 97)

48 px circle, loading=lazy, alt='', reserved by CSS. Host varies: contributor avatar.url from the CMS is a Webflow CDN file when Nancy uploaded it in the Designer, or the Memberstack profileImage URL passed through by profile-sync (src/profile-sync.js line 380), which cannot be resized by URL. Not LCP.

**Recommendation:** -p-500 with fallback only when the host is cdn.prod.website-files.com; leave Memberstack hosts as they are; add decoding=async.


### Series rails: expat .ph, pet passport .ph, work trips .tll-wt-ph (tll-expat-v1.js line 120, tll-pet-passport-v1.js lines 69 and 105, tll-work-trips-v1.js line 61)

c.image is each story's hero-image.url from the Worker (src/series.js line 61): Webflow CMS bucket for Nancy's stories, Cloudinary for intake stories with the writer's own photo, and third-party og:image hosts for link-out stories (src/intake.js line 141). Inserted as full originals, alt='', loading=lazy, in 240 px (expat, work) or 200 px (pets) columns; boxes reserved by CSS aspect-ratio 16/10 or 4/3. Not LCP (rails appear 1.2 to 1.8 s after load).

**Recommendation:** One shared sized(url,w) helper: Cloudinary c_fill,w_480,h_300 (or h_360 for 4/3) with q_auto,f_auto; Webflow -p-500 with fallback; other hosts untouched and keep the existing onerror-free behavior (consider removing the img on error so a dead og:image shows the plain panel). Keep lazy.


### Pet passport avatars, pros row and chips (tll-pet-passport-v1.js lines 61, 65, 104, 108)

Pet avatars .ph 4/3 lazy, reserved. The pros row (line 108) inserts avatars with no loading attribute, so they load eagerly though the row sits in the fourth section of the landing. Flag chips are 18 px circle-flags SVGs from jsDelivr, fixed size, tiny. Staged page.

**Recommendation:** Add loading=lazy and decoding=async to the pros avatars; -p-500 with fallback for Webflow-hosted avatars; flags are fine.


### Expat flags and expats map flags (tll-expat-v1.js lines 58 and 64, tll-expats-map-v1.js flag())

circle-flags SVGs from cdn.jsdelivr.net, 24 px and 14 px, fixed CSS sizes; the map layer adds loading=lazy and removes the img on error, the expat popover does neither. SVGs are a few hundred bytes each. The My moves slide show falls back to the flag SVG when a story photo is missing.

**Recommendation:** Mirror the map layer's pattern in the popover (lazy and onerror remove). No sizing needed.


### Pro author box and hub row avatars: .tll-pro-box img, .tll-pro-card img (src/site-layers/tll-pros-v1.js lines 28 and 39)

56 px and 40 px circles reserved by CSS, no loading attribute (eager) although the box sits at the end of the story and the row is a hub section; full original avatar URLs (Webflow or Memberstack hosts). Not LCP.

**Recommendation:** loading=lazy, decoding=async, -p-500 with fallback for Webflow hosts.


### Next story card: .tll-ux-next img (src/site-layers/tll-ux-v1.js line 60, staged)

Clones im.currentSrc or im.src from the first related card into a 96x72 box, loading=lazy, reserved by CSS. Today that is the full CMS hero because the related cards have no srcset.

**Recommendation:** -p-500 with fallback; if the Designer's responsive setting is turned on for related cards, currentSrc will already be a variant and this needs nothing.


### Crew avatars: span.tll-crew-av background (src/site-layers/tll-crew-v1.js lines 34 and 91)

36 px circles with CSS background-image from p.avatar (Contributors or Pets CMS; Webflow or Memberstack host), no lazy possible, fixed box. Small count, signed-in only.

**Recommendation:** Low priority: -p-500 for Webflow hosts with a probe fallback (background images give no error event, so test with new Image() first or accept the original).


### Link-out preview: img.tll-lp-img (src/site-layers/tll-linkout-preview-v1.js line 53)

Third-party og:image from the Worker's link preview, loading=lazy, fixed 180 px box with min-height, onerror removes it and unticks the use-photo box. /submit only. Not LCP.

**Recommendation:** Fine as is; no transform is possible on foreign hosts.


### Cross-cutting: Webflow variant URLs and the fallback contract

The export manifest shows variants are per file, not per bucket: Curacao.jpg has -p-500 to -p-1600 and nancy-carleton-avatar.jpg has -p-500, while sortsol-hero, pantanal-hero and magnus-holi-side (same site bucket) are listed as originals only, and the CMS bucket 6a0b29c6d081332e921900d8 has no manifest entries at all. Webflow also never generates a variant wider than the original. When a srcset candidate returns 404 the browser fires error on the img and does not try the other candidates.

**Recommendation:** Any srcset use must list only candidates narrower than the known original, attach a one-time onerror that removes srcset and sizes and sets src back to the original, and guard against a second error. Where the set of files is fixed at build time (covers, page heroes, home bands), probe once in the build script and emit only verified candidates. The Playwright harness can verify the fallback by returning 404 for -p- URLs and asserting the original loads.


### Cross-cutting: the home cover is the only image whose fetch waits on the bundle and matters for LCP

Story heroes are in the HTML with fetchpriority=high, so the scanner fetches them early. The cover, the /the-map background and the /for-expats side photo are the layer-inserted LCP candidates, and the lounge tiles are the /gallery ones; all start only after the 426 KB blocking bundle executes.

**Recommendation:** Order of value: cover preload plus verified srcset, then the story hero reserved box, then the lounge transform, then /the-map and /for-expats fetchpriority, then the shelf and rail variants.
