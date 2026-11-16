# Layout shift survey: live www, core 16.66.0, pages that are not stories (16 November 2026)

Read only. No Webflow tool calls, no publish, every non-GET aborted, no form sent. Loads ran 14:03 to 15:19 UTC.

## Method

- Pages (14): /, /stories, /travelers, /layovers, /the-map, /for-expats, /the-paw-passport, /about, /cookies, /account (signed out), the contributor profile linked from the Lisbon story (/contributors/<profile>), and the other nav pages that are not stories: /submit, /login, /signup.
- HTML: one plain GET per page at 14:02 UTC (14 GETs, 856 KB). Every page carries the 16.66.0 core tag (pin 3df16988, sha384-trfI5wIn...). Each load is served from that copy at the www address.
- Core and chunks: the git objects of pin 3df16988, byte for byte what jsDelivr serves, SRI intact (the browser checked it on every live load). Bisect cores are local files with one layer taken out; their tag has integrity removed in the routed HTML only.
- Webflow css and js, Google fonts, jsDelivr: local caches (all hits). Webflow images, video and fonts: cache or abort, never fetched. Ads and analytics answered empty. Memberstack patched as in the 16.66.0 checks. Turnstile and our Worker went to the network; the Worker answers were stored on first use and replayed.
- Chromium headless (Playwright 1.56.1), fresh context per load, one browser at a time (no other browser ran: 0 waits, 0 overlaps, 0 retries). Math.random seeded the same on every load.
- 390x844: Android Chrome UA, isMobile, hasTouch, deviceScaleFactor 3. 1440x900: desktop UA, dsf 1.
- CLS: sum of the layout-shift entries until at least 4 s after load and 5 s after navigation start. FCP and LCP from the paint and largest-contentful-paint entries. For every entry the harness keeps time, value, ready state and up to 5 sources (node path, old and new rect).
- Bisect: core blocked, chunks blocked, all Webflow-hosted custom scripts blocked, web fonts blocked, Memberstack blocked, webflow.js with jQuery and GSAP blocked, every body style moved into the head, a core without one layer (page-heroes, or the ux-1028 nav rule), HTML patches that switch off one site head function (navOut, mobile nav, wordmark, greys timer) or change the profile script, and a frame trace (boxes of the nav and main's children on every animation frame). Extra: CPU 4x slower at 390 (a slower phone).
- 774 measured loads: 140 live (14 pages, 2 widths, 5 each), 634 variants and traces. Files: table.md, summary.json (cells, variants, causes), loads.csv (one row per load), harness/.

## One lab finding to read first: the input flag

The task asked for CLS with hadRecentInput excluded. No input is ever sent, but under isMobile emulation Chromium flags every shift in roughly the first 0.9 s with hadRecentInput. With isMobile off (same viewport, UA and dsf) the same shifts are not flagged and have the same values (/travelers 390: 0.094 at 203 ms, flag 0; /the-map 390: 0.139, flag 0). Excluding flagged entries would report almost every phone cell as 0. The tables therefore count every entry; the input-excluded median is kept as a column. This matches the 16.66.0 lab numbers (/stories 390 0.0284, /travelers 390 about 0.11).

## Results (CLS median, max, loads over 0.1; worst first)

Real (median 0.05 or more, or any load over 0.1): 11 cells.

| cell | median | max | over 0.1 | main shifts | cause |
|---|---|---|---|---|---|
| /account 1440 | 0.3007 | 0.3007 | 4 of 5 | page grid moves down 77 px after DCL | C1 |
| /submit 390 | 0.1437 | 0.1439 | 5 of 5 | main moves down 119 px after DCL | C1 |
| /the-map 390 | 0.1396 | 0.1396 | 5 of 5 | hero grows 436 to 730 px after DCL | C2, C4 behind it |
| /contributors/<profile> 1440 | 0.1178 | 0.1178 | 5 of 5 | profile head rebuilt after DCL | C3 |
| /travelers 390 | 0.1134 | 0.1239 | 5 of 5 | faces row added after DCL (0.094), title rewraps at 3.6 s (0.013) | C2, C8, C11 |
| /the-map 1440 | 0.1083 | 0.3577 | 3 of 5 | backdrop after DCL (0.023), map grows after load (0.067), passport style race (0.26 once) | C2, C4, C5 |
| /travelers 1440 | 0.0912 | 0.1603 | 2 of 5 | hero widened 900 to 1232 px after DCL (0.082), search style race (0.055) | C2, C5 |
| /for-expats 390 | 0.0773 | 0.0878 | 0 of 5 | side photo added after DCL | C2 |
| /contributors/<profile> 390 | 0.0763 | 0.0763 | 0 of 5 | profile head rebuilt after DCL | C3 |
| /submit 1440 | 0.0552 | 0.0552 | 0 of 5 | main moves down 77 px after DCL | C1 |
| /stories 1440 | 0.0495 | 0.1114 | 1 of 5 | 7 px title change while parsing (0.014, 0.063 once), search moved into the chips row after DCL (0.018), lead card (0.016) | C7, C6 |

Below the line (small, still ours where noted):

| cell | median | max | cause |
|---|---|---|---|
| /for-expats 1440 | 0.0391 | 0.0415 | C2 (split hero) |
| /about 1440 | 0.0365 | 0.0615 | C2 (filmstrip) |
| /stories 390 | 0.0284 | 0.0284 | C6 (0.016), C9 (0.009) |
| /about 390 | 0.0245 | 0.0439 | C2 and C9 |
| /the-paw-passport 390 | 0.0220 | 0.0558 | C10 (fonts blocked: 0.0034) |
| /layovers 390 / 1440 | 0.0178 / 0.0147 | 0.0390 / 0.0191 | C10 |
| /account 390 | 0.0119 | 0.0119 | C1 (nav row) |
| /login 390 | 0.0117 | 0.0636 | C9 and C10, mixed |
| /the-paw-passport 1440 | 0.0080 | 0.0080 | C10 |
| /signup 390 | 0.0036 | 0.0579 | one load 0.058 (form column, after DCL) |
| /, /cookies, /login 1440, /signup 1440 | 0.0001 to 0.0034 | 0.0038 | the 0.0034 on phones is C9 |

FCP medians 112 to 216 ms, LCP medians 120 to 548 ms (per cell in table.md). One /stories 1440 load stalled (DCL 13.4 s, FCP 2.4 s, cause not found, not repeated in 34 later /stories loads); medians are not affected.

## Causes (bisect evidence; file and line in this repo)

- C1 (ours, site head). tll-proto-parity-js-v1 navOut() moves the nav out of the [data-ms-content="members"] wrapper at DOMContentLoaded. On /account and /submit the nav sits inside that wrapper, which is display:none for a signed-out reader, so the nav appears after the first paint. src/site/live-2026-11-13/fonts/site-head.after.html:211 (navOut) and :242-243 (run at DOMContentLoaded); the live head is identical. navOut off: /account 1440 0.3007 to 0.0170, /submit 390 0.1437 to 0.0000, /submit 1440 0.0552 to 0.0002. Memberstack or the core blocked: no change. The nav markup itself is a nav component matter; the fix belongs in the head script or the page CSS.
- C2 (ours, core). tll-page-heroes-v1 adds the page photos at DOMContentLoaded, after the first paint. src/site-layers/tll-page-heroes-v1.js:159-161 (run), travelers() :138 with the 1200 px grid rule :72, map() :144 with the phone rule padding-top 244 px :88, about() :147 with :92, expats() :150 with :103 (core lines 254 to 406 of src/site-layers/tll-site-layers-v16.js). Without the layer: /for-expats 390 0.0773 to 0.0034, /for-expats 1440 0.0391 to 0.0001, /about 1440 0.0365 to 0.0005, /about 390 0.0245 to 0.0036, /travelers 1440 0.3040 (local core control) to 0.0589. Frame traces: /the-map 390 hero 436 to 730 px at DCL; /travelers 390 faces list inserted, hero 355 to 490 px.
- C3 (ours, page code). The contributors template script tll-pf5-profile-js-v1 is the last script in the body and builds the profile head at DOMContentLoaded. src/pages/contributors-template/after-2026-10-20/tll-pf5-profile-v1.js:199-204 (live differs only in one count label). Running it at once: 1440 0.1178 to 0.0196, 390 0.0763 to 0.0035; hero() off: 0.0517 and 0.0177. Core, chunks, Webflow-hosted scripts, fonts, Memberstack, webflow.js: no change.
- C4 (ours, page embed). The Map 2.0 container has no reserved height; after load the map is drawn and its section grows from 37 px to 2,500 to 4,300 px. src/pages/the-map/live-2026-10-25/embed-682054d4-after.html:5 (div#tll-map-layers, pin 46a21a18). 0.067 after load in 5 of 5 loads at 1440. At 390 it is below the fold today only because C2 pushed it down; with page-heroes off it comes into view (median 0.11), so C2 and C4 need fixing together.
- C5 (ours, page footer code). Styles at the end of the body apply after an early first paint: the /the-map passport block (tll-mp3-map-v1, src/pages/heroes-2026-10-29/code/the-map-footer.html:171) grows from 146 to 371 px; the /travelers search box (tll-trav-search-css, src/pages/heroes-2026-10-29/code/travelers-footer.html:110) grows from 26 to 48 px and the cards reflow. A race: 1 to 2 of 5 live loads, and it gets worse when the first paint comes earlier (the local core without SRI paints earlier: /travelers 1440 control 0.304; CPU 4x: /travelers 1440 0.204, 3 of 3 over 0.1). On a real phone over a network the paint before the page end is the normal case, so this is user-facing.
- C6 (ours, page footer code). /stories tll-lib-lead-v1 merge() moves the search form into the filter row at DOMContentLoaded; chip rows move from 493 to 628 px (0.018 in 4 of 5 loads at 1440, 0.016 at 390). The lead card is then re-marked and the grid grows (0.016). src/pages/heroes-2026-10-29/code/stories-footer.html:191.
- C7 (partly ours). The known /stories 1440 race: the library title is 180 px tall in the fallback face and 173 px in Playfair Display, so everything under it moves up 7 px when the web font arrives during parsing (trace: Playfair woff2 done at 185 ms, title changes at 228 ms). Every load has it (0.014); in 1 to 2 of 5 it is worth 0.063 because more of the page was painted. The fallback faces only set size-adjust (src/site-layers/tll-font-fallbacks-v1.html:22-27), no ascent or line-gap overrides. Lab caveat: this Linux image has Liberation fonts and no Georgia, so the size of this jump on an iPhone or Android phone is not measured here.
- C8 (ours, page embed). /travelers rotates the title verb (are, live, photograph, were) every 3.2 s; "photograph" wraps the title to three lines at 390 (81 to 121 px). src/pages/travelers/live-2026-11-13/fonts/d8735ad4.after.html:108-110. 0.013 at about 3.65 s in every 390 load (0.004 at 1440); it repeats while the page is open, so field CLS can be higher than this window shows.
- C9 (ours, site head). tll-mobile-nav-js-v1 adds the Menu button at DOMContentLoaded (CTA row 254 to 320 px wide). src/site/live-2026-11-13/fonts/site-head.after.html:141-153. 0.0034 on every phone page; more where it moves other content (/about 390: 0.0245 to 0.0108 without it).
- C10 (fonts). Web font swap where fallback metrics differ: /layovers verdict paragraph 158 to 132 px, /the-paw-passport steps, the nav wordmark, auth forms. Fonts blocked: /layovers 1440 0.0147 to 0.0000, /the-paw-passport 390 0.0220 to 0.0034. Same lab caveat as C7.
- C11 (ours, page embed). /travelers chip labels and counts filled after DOMContentLoaded (src/pages/travelers/live-2026-11-13/fonts/d8735ad4.after.html:37, :51-53): 0.036 and 0.010, visible once C2 is gone.

Not causes: Memberstack (blocked: no change on any real cell), webflow.js with jQuery and GSAP (blocked: no improvement), the 16.66.0 story layer (does not run on these paths), the ux-1028 nav signup size rule (no consistent change), the site head wordmark, the greys timer.

## Images and other lab artifacts

- Images: in the 140 live loads, 2 image URLs were not cached and were aborted, both on / at 1440 (the Southern Africa cover photo, two sizes); its box is sized by the cover CSS and / at 1440 stays at 0.0005. No image was aborted in any other live cell. With the core or the Webflow-hosted scripts blocked, pages ask for other image sizes (no srcset from the core), and 27 uncached URLs were aborted on /stories, the profile, /the-paw-passport 390 and / 390; the "core blocked" and "Webflow-hosted scripts blocked" numbers on those cells (for example profile 390 at 0.63) are partly lab artifacts and are not used as evidence of a cause. Above the fold, the page photos sit in frames sized by aspect-ratio or a fixed height (tll-ph-img, the paw example), so their arrival does not move anything; the one image without width and height or aspect-ratio above the fold is the profile photo, which was cached and painted in every load. No shift in this survey comes from an aborted image.
- Documents are served whole from disk, so the first paint usually comes after the parser has read most of the page. Races C5 and C7 are rarer here than on a phone over a network; C1, C2, C3, C6 and C9 do not depend on that (they run at DOMContentLoaded, after the first paint, in every load).
- The local core without SRI paints earlier than the live core; variant cores are compared with that control (summary.json and table.md list both).
- Ads answered empty, so ad fills on /stories are not covered.
- /signup logs 2 page errors per load ("Object", Memberstack or Turnstile with the aborted POST); no other page errors.
- Chromium only.

## CPU 4x slower, 390 (3 loads per page)

/the-map 0.187 (3 of 3 over 0.1), /submit 0.144 (3 of 3), /travelers 0.124 (3 of 3), /for-expats 0.088, profile 0.076, /stories 0.028, /about 0.025, /the-paw-passport 0.022, /login 0.019, /layovers 0.018, /signup 0.018, /account 0.012, / and /cookies 0.003. At 1440: /travelers 0.204 (3 of 3), /stories 0.066. Without page-heroes at CPU 4x: /for-expats 0.014, /about 0.004, /travelers 0.084.

## Bandwidth and disk

- Webflow hosts: 14 HTML GETs, 856 KB; 0 css or js fetched (all cache hits); 0 image, video or font bytes; 2 image URLs aborted. Documents for every load came from disk.
- jsDelivr: 3.3 KB (6 circle flag SVGs, once). Our Worker: 148 KB once, then replayed. Turnstile went to the network (13 requests).
- Disk: 7.4 GB free at the start; the scratch folder for this survey is 17 MB.
