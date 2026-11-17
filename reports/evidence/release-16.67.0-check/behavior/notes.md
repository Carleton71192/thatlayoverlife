# Release 16.67.0, behavior check: real test site against real www (17 November 2026)

Verdict: PASS WITH NOTES. Nothing found that should keep 16.67.0 off www.

Core under test: tllsitelayersv16 16.67.0 on that-layover-life.webflow.io (layers-release pin a254306f6c62a79f314754d24b44041d61be716d, SRI sha384-2Bc75us2..., published 10:29:16 UTC), against www.thatlayover.life on 16.66.0 (pin 3df16988ac1674485a2fe44d24f3763073d0c98d, SRI sha384-trfI5wIn...). Independent checker, read only: no Webflow tool calls, no publish, every non-GET aborted. Loads ran 10:42 to 11:17 UTC.

## Method

- Chromium headless (Playwright, node 22), fresh context per load, the two hosts alternating first place by round and cell. The main document of every load is one real navigation to the real host (418 navigations in all, including 4 smoke loads and 14 loads run before a harness fix and set aside). Any other navigation of the top frame would have been aborted (none happened).
- Same-origin fetches made by scripts for the checked paths: plain-GET copies of the same host (the carry check's copies of 10:31 UTC, plus one GET of the Southern Africa story on each host at 10:37 UTC).
- jsDelivr files of our repo (core and chunks, at whatever pin the page asked for): `git show <pin>:<path>`, byte equal to jsDelivr (carry check: 26 of 26 files). Both cores hash to their release SRI, so the browser's SRI check ran for real on every load.
- Webflow css and js, images, flags and fonts: local caches of the earlier checks; a missed image was aborted, never fetched (six 1440 hero files of the Lisbon and Southern Africa stories, aborted on both hosts the same way). Memberstack served patched (signed out; no hiding when its aborted app POST fails) as in the earlier checks. Ads and analytics answered with an empty body on both hosts. Math.random seeded the same on both hosts. challenges.cloudflare.com went to the network on /login and /stories (both hosts alike).
- Harness fix during the run: answers kept by earlier checks that name one origin in access-control-allow-origin (the travel-wire Worker on /the-map, kept from www) blocked the test origin in the lab only. The real Worker echoes the asking origin (checked with one GET with the test origin). The harness now echoes the page origin; the 14 loads before the fix were set aside.
- Widths: 390x844 and 360x780 at deviceScaleFactor 3 (mobile), 1440x900. CLS counts every layout-shift entry until at least 4 s after the load event (the input-excluded column drops entries marked hadRecentInput; no input is sent, but Chromium marks early shifts that way under isMobile). FCP and LCP from the paint and largest-contentful-paint entries.
- Finished page: the box of every visible element (left, top plus scroll, width, height), hashed; "equal" means the list equals a www load's list in the same cell. Holds: the sweep's head styles (`tll-fp-*`, `tll-es-*`), `data-tll-es-*` marks, the Menu stand-in (`.tllmm-btn[aria-hidden]`), the story holds (`data-tll-mg-wait-r`, `-d`, `data-tll-mg-flags`, `tll-story-st3-early-v1`), all watched from the first byte and read again at the end.
- One browser at a time: before every load the harness waited until no browser outside its own process tree was running, and checked again after the load (0 waits, 0 reruns).
- Sets: A (the eight changed pages at 390 and 1440, 5 loads per host), B (360 for /travelers, /the-map, /stories, 5 per host), C (home, /layovers, /login, Balkans, Lisbon, Southern Africa at 390 and 1440, 3 per host): 262 loads. Follow-ups: F (first paint with navigation timing, 6 cells x 6 per host), G (images not drawn, 2 cells x 3), H (/about 1440 and 390, /submit 1440, 8 per host): 132 loads. Files: table.md (sets A, B, C per cell), summary.json, loads.csv (one row per load, all sets), harness/.

## Results

1. Core on every load. 197 of 197 test loads requested pin a254306f once, got HTTP 200, passed the SRI check and ran (window.tllSelfDoc present); the tag on the page carries pin a254306f and sha384-2Bc75us2. The chunks came from the same pin (site, travelers, map, for-expats, account, submit, profile, stories, story, home). 197 of 197 www loads ran pin 3df16988 the same way. Every load had exactly one navigation, status 200, and ended on the requested path.
2. Holds and stand-ins. At the end of every test load: no `tll-fp-*` or `tll-es-*` style, no `data-tll-es-*` mark, no Menu stand-in, no story hold or flag stand-in, nothing in a story hero left hidden. The one style left is `style#tll-fp-title-v1` on /travelers (21 of 21 loads), by design. Seen and gone, test medians (added, removed in ms): /travelers `tll-fp-page` 145, 342 and `tll-fp-ours` 145, 225; /the-map `tll-fp-map` 157, 490, `tll-fp-maptitle` 171, 261, `tll-fp-page` 157, 373; /about `tll-fp-note` 145, 236 and `tll-fp-page` 145, 301; /account `tll-es-nav` 196, 312; /submit `tll-es-nav` 163, 257; profile `tll-es-pf5` 173, 402 and the head stand-in (`data-tll-es-ghost`) life 223; /stories `tll-es-libtitle` 228, 362. The Menu stand-in appeared on every test page and was gone in every load (median life 88 to 296 ms). The three stories set and cleared the route strip and Receipts holds and the flag stand-in on both hosts alike. www never has any of the new holds (expected).
3. Finished page. All 131 test loads of sets A, B and C end with the same box list as a www load in their cell, /travelers included (the title is 121 px at 360 and 390 and 166 px at 1440 on both hosts in every load, so the title exception was not needed here). The 132 follow-up loads: same, 66 of 66. Page text, Menu button count and html classes equal on both hosts in every cell of sets A, B and C. Home, with Math.random seeded, equal at 390 and 1440.
4. Errors. 0 page errors and 0 failed scripts on either host. Console errors are the same on both hosts, load for load, in kind and count: the Memberstack network error from the aborted POST and the aborted request line, nothing else.

## CLS (median, max, loads over 0.1), www then test, with the lab

See table.md for every cell with FCP and LCP. In short:

| page | 390 www / test (lab) | 1440 www / test (lab) | 360 www / test |
|---|---|---|---|
| /travelers | 0.113 (5 of 5) / 0.0100 (0.124 to 0.010) | 0.146 (5 of 5) / 0.0058 (0.091 to 0.006) | 0.120 (5 of 5) / 0.011 |
| /the-map | 0.140 (5 of 5) / 0.0000 (0.140 to 0.000) | 0.115 (5 of 5) / 0.011 (0.108 to 0.011) | 0.125 (5 of 5) / 0.0000 |
| /for-expats | 0.088 / 0.0097 (0.077 to 0.005) | 0.039 / 0.0004 (0.039 to 0.0001) | |
| /about | 0.025 / 0.0000 (0.025 to 0.0003) | 0.037 / 0.0001 (0.057 to 0.0005) | |
| /account (signed out) | 0.012 / 0.012 (0.012 to 0.012) | 0.301 (5 of 5) / 0.0037 (0.301 to 0.004) | |
| /submit | 0.144 (5 of 5) / 0.0002 (0.144 to 0.000) | 0.055 / 0.0002 (0.055 to 0.0002) | |
| contributor profile | 0.076 / 0.0004 (0.076 to 0.0004) | 0.118 (5 of 5) / 0.0013 (0.118 to 0.0008) | |
| /stories | 0.028 / 0.0073 (0.029 to 0.007) | 0.111 (3 of 5) / 0.030 (0.050 to 0.030) | 0.033 / 0.0085 |

- Changed pages (sets A and B, 95 loads per host): www median 0.111, max 0.358, 48 over 0.1; test median 0.0037, max 0.031, 0 over 0.1. Input-excluded: www 23 over 0.1, test 0.
- The test numbers match the lab to the third decimal in almost every cell. The real www numbers match the lab control too, except /travelers 1440 (0.146 against 0.091) and /stories 1440 (0.111 against 0.050), both higher on real www; test is at the lab value there.
- /for-expats 390: test 0.0097 against the lab's 0.005; this is the known Plex font wrap (fix.md item 9, 0.005 to 0.010). /account 390 is 0.012 on both hosts (unchanged by design).
- Other pages (set C, 36 loads per host): test equal to or lower than www in every cell; max www 0.042, test 0.038 (/login 390); 0 over 0.1 on either host. /layovers 1440 has the known two-state font race on both hosts alike (0.0014 or 0.019).

## FCP and LCP

- Sets A and B, changed pages: pooled median FCP www 264 ms, test 244 ms; LCP www 332 ms, test 292 ms. LCP is earlier on test where the hero photo is now in the first paint (/the-map, /travelers, /stories phone widths: /stories 390 LCP 864 to 436 ms).
- Per cell the FCP medians move both ways (test minus www from -124 to +100 ms), and DCL moves with them: the two hosts deliver the document at different times. Follow-up F recorded navigation timing on the six cells with the largest gaps. First paint after the document is in, test minus www (medians, 6 pairs): /the-map 1440 -20 ms, /for-expats 390 +13, /account 1440 +10, /stories 1440 +8, /travelers 390 -1, /about 1440 +46.
- /about 1440 then got 8 more pairs (set H): over 14 pairs, first paint after the document is in is +24 ms on test (median, range -10 to +84; later in 12 of 14). Raw FCP over the same loads is 44 ms earlier on test, because the www documents arrived later. Neighbors: /about 390 +9 ms (5 of 8 later), /submit 1440 +2 ms (4 of 8). The lab measured /about 1440 at +4 to +12 ms. A small first paint cost on /about desktop, against a page that no longer moves.

## Notes (not blocking)

1. /about 1440 first paint about 24 ms later after the document is in (above). Well within normal network spread; worth a look only if field data shows it.
2. Lazy images far below the screen: on the profile at 390 one image (at 5,384 px) and on /stories at 1440 two images (at 11,329 px) are not loaded yet at the end on test, while www had loaded them (3 of 3 loads each, set G). On www an early state of the page put them near the screen for a moment; with 16.67.0 they wait until the reader scrolls there, like the other lazy images. No box differs.
3. /account 390 on test fetched the map collections file in 2 of 5 loads (www 0 of 5), a timing difference of the account map code; same boxes, same CLS.
4. Not covered here, as in the release note: /account signed in, reload and back navigation (the adversarial checks cover those), real chunked parsing on slow phones. Headless Chromium only.

## Bandwidth and disk

- Webflow hosts: 0 image, video or font bytes; 0 css or js fetched (all cache hits). HTML: 2 plain GETs (0.45 MB) and 418 navigations (27.6 MB on the wire, body and headers). Total from Webflow hosts about 28 MB.
- jsDelivr and other third parties: 0 bytes (all from git or caches). Cloudflare challenge frame from the network on /login and /stories.
- Disk free 5.1G before and after.
