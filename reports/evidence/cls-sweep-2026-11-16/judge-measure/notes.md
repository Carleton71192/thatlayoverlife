# Layout shift sweep, independent measurement check (17 November 2026)

Verdict: PASS WITH NOTES. Nothing measured here should keep the 16.67.0 core off the live site.

Checked: branch claude/cls-sweep-2026-11-16 at afe01e7 against the session branch at 586ce62. Read only: no Webflow tool call, no publish, every non-GET aborted, no form sent. Loads ran 01:02 to 01:55 UTC.

## Build and scope

- Diff, 141 files: 130 evidence files under reports/evidence/cls-sweep-2026-11-16/, 5 under src/site-layers (build script, two new layers, page-heroes, the built core), 2 new test files, and 4 new files under src/pages. Nothing under src/site. No chunk changed.
- The 4 files under src/pages are new read-only copies of page code (live-2026-11-16 folders: the profile script, two /stories footer scripts, the /the-map full screen embed). Added, nothing modified. Each one is an exact copy of what www serves today (checked against my own GET). The build reads them to check its copied rules. The brief said nothing under src/pages, so this is a note.
- Rebuild at afe01e7: byte equal to the committed core and to the builders' core. 276,440 bytes, sha384-rm9a+UhEyhRi7OWymOTl2Ji8o28uPBQD2TMRg6nRg/j1KkvzpCR+UuahQy1PwQu/. A rebuild leaves the tree clean. The 24 chunks and the search index equal layers-release 3df16988 byte for byte.
- Tests: 707 pass (59 files).

## Method (own harness, harness/jm.cjs)

- HTML: one plain GET per page at 01:00 UTC, 17 pages (the 14 survey pages and the Balkans, Lisbon and Southern Africa stories), 1.05 MB. All 17 equal the builders' copies. Every page carries the 16.66.0 core tag (pin 3df16988, sha384-trfI5wIn...). Every load is served from that copy at the www address.
- Two arms on the same HTML, with only the integrity attribute of the core tag removed: control = the live 16.66.0 core from a local file (layers-release 3df16988), new = my rebuild of afe01e7. Chunks from the git objects of pin 3df16988 in both arms.
- Webflow css, js, images and fonts, Google fonts: local caches from the earlier checks; a file not in the cache is aborted, never fetched. Ads and analytics get an empty answer. Memberstack is served patched as in the earlier checks. Math.random is seeded the same on every load.
- Chromium headless (Playwright), a fresh context per load, one browser, one load at a time. The arms alternate, and the arm that goes first changes every round. 390x844 and 360x780: Android Chrome UA, isMobile, hasTouch, deviceScaleFactor 3. 1440x900: desktop UA, deviceScaleFactor 1.
- CLS: the sum of every layout-shift entry until at least 4 s after load and 5 s after navigation start. The input-excluded sum is kept as a column (Chromium flags the early phone shifts as input under isMobile). FCP and LCP from the paint and largest-contentful-paint entries.
- Finished page, at the end of every load: the box of every laid-out element (left, top plus scroll, width, height), the same list with tag, id and classes, the page text, the classes on html, the body tree (tags, ids, classes, attribute names) and the list of style elements. "Equal" means every new load ends on a list that a control load of the same cell also ended on.
- Sets: standard, 40 cells, 5 loads an arm (400 loads); CPU 4x, the 16 cells the builders changed, 3 loads an arm (96 loads); a follow-up on /layovers 1440, 15 more loads an arm (30 loads); one late look at /travelers 390 (2 loads). The two home cells of the standard set were run a second time because my own commands had overlapped them; the first 20 loads are not used. 0 failed loads, 0 retries, no other browser running during any load.
- Files: table.md (every cell), cells.json, loads.csv (one row per load), harness/.

## Results against the four checks

1. Finished page equals the control: yes, in 40 of 40 standard cells and 16 of 16 CPU 4x cells (boxes, tagged boxes, page text, html classes). No hold attribute and no stand-in is left at the end of any load. The body tree is equal in all 40 standard cells; at CPU 4x two /stories cells differ only in the order of script and style elements that scripts append to the end of the body. One difference in the head, by design: style#tll-fp-title-v1 stays on /travelers.
2. No cell worse than the control by more than 0.01: holds. One cell tripped this in the 5-load set, /layovers 1440 (control 0.0014, new 0.0146). It is a font swap race with two states (about 0.0014 or 0.0146 to 0.0191); the control hit the high state in 1 of 5 loads and the new core in 4 of 5. In 15 more loads an arm both arms hit it 8 of 15 times: medians 0.0146 and 0.0146, max 0.0191 and 0.0191. The new core does nothing on /layovers at 1440. Not a regression.
3. No cell the builders claim fixed at median 0.05 or more, or with a load over 0.1: holds. The 16 claimed cells read 0.0000 to 0.0300 with the new core at standard speed (control 0.0119 to 0.3007) and 0.0000 to 0.0311 at CPU 4x. Loads over 0.1: control 42 of 200 standard and 21 of 48 at CPU 4x; new 0 of 200 and 0 of 48. The highest new load in any set is 0.0311 (/stories 1440).
4. FCP and LCP. Standard speed, change per cell (new minus control, medians): FCP median +4 ms, range -32 to +20; LCP median -4 ms, range -308 to +20. Pooled FCP medians: phones 140 control and 136 new, 1440 px 152 and 148. CPU 4x: FCP median -40 ms, range -124 to +32; LCP median -46 ms, range -552 to +380. The two that are later: /account 1440 LCP +380 ms and the profile at 390 FCP +32 ms (notes 2 and 3).

## The cells the builders changed (CLS median, max in brackets)

| cell | control | new | CPU 4x control | CPU 4x new |
|---|---|---|---|---|
| /travelers 390 | 0.1239 (0.1277) | 0.0100 (0.0100) | 0.1239 | 0.0100 |
| /travelers 1440 | 0.0912 (0.1967) | 0.0058 (0.0058) | 0.1384 | 0.0058 |
| /the-map 390 | 0.1396 (0.1630) | 0.0000 (0.0000) | 0.1630 | 0.0000 |
| /the-map 1440 | 0.1083 (0.3509) | 0.0114 (0.0116) | 0.1084 | 0.0110 |
| /for-expats 390 | 0.0772 (0.0878) | 0.0049 (0.0096) | 0.0878 | 0.0097 |
| /for-expats 1440 | 0.0391 (0.0391) | 0.0001 (0.0003) | 0.0415 | 0.0004 |
| /about 390 | 0.0245 (0.0246) | 0.0003 (0.0003) | 0.0245 | 0.0003 |
| /about 1440 | 0.0567 (0.0608) | 0.0005 (0.0008) | 0.0365 | 0.0007 |
| /account 390 | 0.0119 (0.0119) | 0.0119 (0.0119) | 0.0119 | 0.0119 |
| /account 1440 | 0.3007 (0.3007) | 0.0037 (0.0037) | 0.3008 | 0.0037 |
| /submit 390 | 0.1439 (0.1439) | 0.0000 (0.0002) | 0.1439 | 0.0003 |
| /submit 1440 | 0.0552 (0.0552) | 0.0002 (0.0003) | 0.0554 | 0.0003 |
| /contributors/<profile> 390 | 0.0763 (0.0763) | 0.0004 (0.0004) | 0.0763 | 0.0004 |
| /contributors/<profile> 1440 | 0.1178 (0.1178) | 0.0008 (0.0011) | 0.1178 | 0.0013 |
| /stories 390 | 0.0285 (0.0285) | 0.0073 (0.0073) | 0.0285 | 0.0073 |
| /stories 1440 | 0.0498 (0.1140) | 0.0300 (0.0311) | 0.0654 | 0.0311 |

At 360: /travelers 0.1141 to 0.0112, /the-map 0.1249 to 0.0000, /stories 0.0334 to 0.0085.

The builders' tables hold. Where my numbers differ from part A's table (/travelers 390 0.0100 against 0.0142, /the-map 390 0.0000 against 0.0034, /for-expats 390 0.0049 against 0.0131) mine are lower: part A measured before part B took out the Menu button move (0.0034 on phones).

## Pages outside the builders' scope

- Home and the three stories: equal to or lower than the control in all 11 cells. Phones drop by the Menu button move (for example Balkans 390 0.0034 to 0.0000, Southern Africa 390 0.0057 to 0.0002); Balkans 360 reads 0.0082 (max 0.0153) against 0.0195. The 1440 cells are unchanged (0.0001 to 0.0005).
- /layovers 390 0.0178 to 0.0000 (max 0.0383 to 0.0146), /the-paw-passport 390 0.0558 to 0.0187, /cookies 390 0.0033 to 0.0000.
- /login 390 0.0100 to 0.0144 and /signup 390 0.0036 to 0.0076: inside the 0.01 line. Both are font swap races on the form; the max is 0.0179 control and 0.0144 new on /login, 0.0109 and 0.0113 on /signup.
- /login 1440, /signup 1440, /cookies 1440, /the-paw-passport 1440: no change (within 0.0013).

## Notes (none blocking)

1. Scope: the 4 new files under src/pages (see Build and scope). Copies only.
2. /account 1440 at CPU 4x: the largest paint is 380 ms later (508 to 888 ms; 488, 508, 520 against 904, 888, 884). It is the greeting line of the member dashboard, which now shows when the page is parsed, not when the page script has run. At standard speed the difference is +8 ms. The builders reported this (about 0.34 s). The lab is signed out; for a signed-in member on a slow phone the dashboard would come that much later. One look at /account signed in before release is still open, as the builders say.
3. First paint on a slow phone: the profile at 390 is 32 ms later at CPU 4x (440 to 472 ms). At standard speed no cell is more than 20 ms later.
4. /travelers at phone width, look: the title box stays 121 px tall for every verb. One late look (8.3 s, a short verb on screen): control title 81 px, new 121 px, the hero 490 against 531 px and everything under it 40 to 41 px lower (page height 8,317 against 8,358 px). Same elements, same order. In return the verb change no longer moves the page: 0.0128 and 0.0181 for the control's two changes, 0.0049 and 0.0070 with the new core. This is the design the builders describe; it is a visible change, so it should be a known one.
5. What is left with the new core, highest first: /stories 1440 0.030 (font jump and the story count, as the builders say), /the-paw-passport 390 0.019, /layovers 1440 0.015 (font race, same as control), /login 390 0.014, /account 390 0.012 (sign-in links, same as control), /the-map 1440 0.011, /travelers 360 0.011.
6. Image requests: the new core asks for 2 fewer card photos on /stories 1440 and 1 fewer on the profile at 390; the same files in the other 38 cells. No extra image in any cell.
7. Page errors: 2 per /signup load in both arms (the known "Object" error with the aborted POST), none elsewhere. Console error counts equal in every standard cell.
8. Not covered here: the builders' stress set (jQuery held), failure cases, other screen sizes, a signed-in session, browsers other than Chromium. Lab fonts are Liberation (no Georgia or Arial), so font jump sizes on real phones are not measured. Documents are served whole from disk.

## Bandwidth and disk

- Webflow hosts: 17 HTML GETs, 1.05 MB. 0 css, js, image, video or font bytes (all from the caches). 6 image URLs not in the cache were aborted (2 each on / 1440, Lisbon 1440 and Southern Africa 1440, the same in both arms).
- jsDelivr and Google fonts: 0 bytes (git objects and caches). Turnstile went to the network on the pages that load it.
- Disk: 6.5 GB free at the start; the scratch folder for this check is about 15 MB.
