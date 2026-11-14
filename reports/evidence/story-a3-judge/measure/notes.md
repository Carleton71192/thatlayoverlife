# Fix A3, independent measurement (14 November 2026)

Verdict: FAIL by the rule set for this check (no A3 load over 0.1 on any story at any width, and no cell worse than A2 by more than 0.01 median). A3 does fix the three 16.65.0 findings, and on slow 4G it passes both parts of the rule. Unthrottled, it breaks both parts:

- 8 of 351 unthrottled A3 loads went over 0.1. 2 were at phone widths: Texas 320 (0.147) and Vietnam 375 (0.101). 6 were at 768 (Southern Africa 2 of 3, Phuket 3 of 3, Vietnam 1 of 3). At 768, A2 and www also go over 0.1 (9 of 27 loads each), and most of that number is a nav shift at DOMContentLoaded that A3 does not touch.
- 18 of 99 cells are worse than A2 by more than 0.01 median. Most of them are on the stories whose place is not on the flag script's alias list (Vietnam, Phuket, Lisbon). One browser at a time, the excess is still there on Vietnam 360 (0.031 against 0.012) and Lisbon 390 (0.016 against 0.004). With the Intl region table skipped in a lab copy of A3, both go back to the A2 level, and A3's gains on Croatia and Southern Africa stay.

Nothing was merged, pushed to layers-release or published. No Webflow tool calls.

## The core under test
- Branch claude/fix-story-first-frame-a3-2026-11-14, head 39f4b67c64d66fa1605a23d81429f041434457de. I made a detached worktree at that head (node_modules symlinked) and ran src/site-layers/build-site-layers-v16.py. The build exits 0 and leaves the worktree clean, so the committed core is the build of that head.
- The local file scratchpad nov14/a3core/tll-site-layers-v16-a3-39f4b67.js is byte for byte the committed core (sha256 375e2700...dddb0ce, 256,759 bytes). Its SRI is sha384-T61+wAVXYVn8ZgDKiEEj+0QbcnVYW1kXtwpJdmfnaPUlUAjqGHmfbq7Y8U80aqnm, as claimed.
- The A2 copy (check1665-regression/core-new.js) equals git 73ab244 and has the 16.65.0 release SRI (sha384-lCTj52h4...). The www copy (core-old.js) has the 16.64.0 SRI (sha384-m7ORNXLx...).

## Method
- HTML: the plain-GET www copies saved by the 16.65.0 checks today, all from the 08:16:45 UTC publish (16.64.0): Balkans, Pantanal, Phuket, Southern Africa, Madrid and Texas from the regression check, Croatia from the behavior check, Lisbon and Vietnam from the carry check. No new GET was needed.
- Every load serves the www HTML at the www address. W keeps the 16.64.0 core tag and its integrity. For A2 and A3 the integrity attribute is removed from the core tag in the routed HTML only, and the core URL is answered with the local core. Chunks are the same at every pin used here.
- Harness: m.cjs, made from the regression check's h.cjs (same routing, caches, Memberstack patch, ad stubs, slow 4G model). Fresh browser context per load. The three cores run in turn within each round, and the starting core rotates each round. Every non-GET is aborted.
- Widths 320, 344, 360, 375, 390 and 412 (5 loads per core per cell), 768 and 1440 (3 loads), all 9 stories. Slow 4G (150 ms per request, one 1.6 Mbit/s pipe, CPU 4x) at 360 and 390, 3 loads per core per cell. Reload after scrolling to 2,500 px at 390, 3 loads per core per story. In all, 1,053 unthrottled loads, 162 slow 4G loads and 105 single-browser loads.
- The unthrottled batch ran 3 browsers side by side on 4 CPUs, and slow 4G ran 2. To check that this did not make the result, the worst cells were run again with one browser at a time (105 loads).
- CLS is the sum of every layout-shift entry until about 4 s after load. Headless Chromium marks every entry hadRecentInput, so every entry counts, as in the earlier checks. A session-window value is also in cells.json and loads.csv.
- Finished layout: after the wait, the box of every visible element (rounded left, top, width, height) is written out and hashed. "Same as www" means the A3 load's full list equals a list seen on a www load in the same cell.

## Results

1. **The three 16.65.0 findings are fixed.**
   - Balkans 320 to 375: A2 0.135 to 0.152 on every load. A3 0.002 to 0.021 on every load, close to www at 360 and 375 (0.018 and 0.017). At 320 and 344 www itself is 0.126 to 0.127.
   - Croatia 390: A2 0.055 median. A3 0.010 on every load (5 of 5). The late two-line place-and-date line and the second breadcrumb row are gone.
   - Southern Africa 344 to 412: A2 0.056 to 0.083. A3 0.012 to 0.019.
   - At phone widths (unthrottled), the mean CLS after DOMContentLoaded falls from 0.030 on A2 to 0.006 on A3.
2. **A new shift before DOMContentLoaded, caused by A3 (the main reason for the FAIL).**
   - On stories with a Receipts line, the photo is held invisible until the line is in. If a frame is painted before the Receipts block has been parsed, the line goes in after that paint and the hero grows by 46 to 60 px. The photo is hidden, so it does not count, but the route strip and the story body under it are visible and move down.
   - This happened on 48 of 270 A2 loads at phone widths and on 158 of 270 A3 loads (www 12). By story, A2 against A3: Croatia 10 against 25 of 30, Southern Africa 10 against 30, Lisbon 8 against 29, Vietnam 7 against 30, Phuket 5 against 30, Texas 8 against 14. Balkans, Madrid and Pantanal: 0 on both.
   - A trace on Vietnam 360 shows the first frame on A3 at about 185 ms with no Receipts line and the hero 479 px tall. In the next frame the line is in and the hero is 539 px. On A2 the first frame already has the line.
   - Likely cause: PF.pre() builds the flag script's Intl region table before the first paint when the place is not on the alias list (Croatia, Southern Africa, Lisbon, Vietnam, Phuket, Madrid and Pantanal need it; Balkans and Texas do not). That work gives the parser a reason to yield a frame early. Test, one browser at a time, 5 loads per core, with a lab copy of A3 whose table() keeps only the alias list (not a build to use; it would drop flags for most places):

     | story, width | A2 | A3 | A3 without the table |
     |---|---|---|---|
     | Vietnam 360 | 0.0121 | 0.0307 | 0.0122 |
     | Lisbon 390 | 0.0040 | 0.0155 | 0.0038 |
     | Phuket 360 | 0.0270 | 0.0249 | 0.0120 |
     | Croatia 390 | 0.0552 | 0.0104 | 0.0039 |
     | Southern Africa 360 | 0.0585 | 0.0136 | 0.0042 |

   - Madrid and Pantanal need the table but have no shift, so the table is not the whole story.
   - Possible fixes: a static region table in the core (the author measured about 2 KB gzip), or keep the route strip and body still while wait-r holds the photo.
3. **The two phone-width A3 loads over 0.1** (both in the 3-browser batch; 0 of 35 loads one browser at a time):
   - Texas 320, round 3: a frame was painted before the early run (breadcrumb 44 px, headline at 232). The run and PF then gave the crumb its link box and the flag stand-in (breadcrumb 95 px), and the head moved 51 px (0.145). A2 had the same early paint in the same round (0.134), with a smaller move. Any paint before the early run costs A3 more than A2, because A3 changes the head more when it runs.
   - Vietnam 375, round 4: three paints while the head was parsed, each moving the route strip and the body (0.045 + 0.013 + 0.030 + 0.012).
4. **768 px.** A3 is over 0.1 on Southern Africa (0.155, 2 of 3), Phuket (0.107, 3 of 3) and Vietnam (0.107, 1 of 3). A2 is over 0.1 on 9 of 27 loads at 768, and so is www. Most of the number is a nav shift at DOMContentLoaded (the logo block and the hero move about 8 px, 0.074 to 0.086 on all three cores). The rest is the route strip moving before DOMContentLoaded (item 2). The nav is out of scope here, but by the rule these loads count against A3. At 1440, A3 is 0.0001 on every cell.
5. **Cells worse than A2 by more than 0.01 median** (A2 then A3; all unthrottled; none on slow 4G):
   - Vietnam 320 to 390: 0.008 to 0.016 against 0.026 to 0.031.
   - Phuket 344, 360, 390, 412 and 768: 0.012 to 0.016 against 0.025 to 0.030, and 0.096 against 0.107 at 768.
   - Lisbon 390 and 412: 0.004 against 0.016. Lisbon 768: 0.074 against 0.089.
   - Texas 344, 360 and 412: 0.004 against 0.015 to 0.019. One browser at a time, Texas 360 is 0.0043 on both, so these three may come from the parallel batch. They are counted because they were measured.
   - Reload at 2,500 px: Pantanal 0.028 against 0.044 (paragraphs in view move 58 px before DOMContentLoaded), Phuket 0.011 against 0.041.
   - A3 is better than A2 by more than 0.01 median in 35 of the 99 cells.
6. **Slow 4G (360 and 390, all 9 stories): passes.** No A3 load over 0.1 (A2 3 of 54, www 32 of 54). No cell worse than A2 by more than 0.01. The worst A3 cells are Vietnam 390 (0.073) and Phuket 390 (0.061), about the same as A2 (0.074 and 0.061).
7. **FCP and LCP.**
   - Unthrottled: FCP is the same as A2 (median of cell medians -4 ms, range -44 to +40) and as www (+2 ms). LCP is +6 ms against A2 and 92 ms earlier than www.
   - Slow 4G: FCP is later than A2 by a median of 64 ms (range -48 to +156): Croatia +100 and +76, Southern Africa +112 and +112, Pantanal 390 +132, Lisbon 390 +156, Phuket 360 +100, Balkans -16 and -48, Texas +8. Against www, A3 FCP is later by a median of 162 ms (48 to 268). LCP is later than A2 by a median of 32 ms.
   - As in the regression check, on slow 4G the photo becomes the LCP element on A2 and A3 where www reports the headline (Balkans 390, Pantanal 360 and 390). So LCP reads 2.4 to 3.9 s later there, though the photo appears at the same time.
8. **Finished page.**
   - Unthrottled (including the reloads), all 351 A3 loads end with a box list that equals www's in the same cell (also 351 of 351 for A2). There is one finished layout per cell on every core.
   - On slow 4G, 49 of 54 A3 loads match a www layout. The others, and 9 www and 19 A2 loads against the most common www layout, differ only in 11 boxes in a band about 300 px tall at the foot of the story: the reader notes and the write-for-us ask in the other order. This is the known race at the foot (regression check item 13), seen on all three cores.
   - No load on any core ended with the early style, a hold or the flag stand-in still in the page. 0 page errors in 1,320 measured loads. Console messages are the Memberstack offline line and aborted requests, at the same rate on all cores (unthrottled 1,957 / 1,959 / 1,959).

## Not covered, and limits
- Real devices, real network chunking (each document is served whole, so paints during parsing come from parser yields, not from data arriving), other browsers, desktop widths other than 1440, and stories other than these 9.
- Hero photos that were not in the local caches were aborted, not fetched (bandwidth rule): Pantanal at 360 and wider, and Croatia, Southern Africa, Lisbon, Vietnam, Phuket and Texas at 412, 768 and 1440. The box is still reserved, but the photo is not drawn. This is the same on all three cores.
- The failure cases in the author's report (template script throws, flag script 404) were not run again here; that is not part of the measurement lens.
- The US state flag that tll-story-fixes-1029 adds at 1.4 s: unthrottled, no shift after 1 s was seen on any story or core (the Texas crumb is "Texas Hill Country"). No story with a "City, State" crumb was in the set.

## Bandwidth and safety
- 0 bytes from Webflow hosts and 0 from jsDelivr in browsers: every Webflow and jsDelivr request was a cache hit, or an aborted image miss (images never fetched). The harness's fetch counter file was never created, because nothing was fetched. No new plain GET was needed.
- Other third-party GETs that are not ads (for example the Memberstack API) went to the network, as in the regression harness. They were not counted. All 4,208 non-GET requests were aborted.
- No member data in these files. Story names are given by place only.
- Scratch data is about 6 MB in the session scratchpad (nov14/a3judge-measure: harness, raw rows, box lists). Disk had 6.8 to 7.5G free throughout. The worktree is removed.

## Files
- table.md: every cell (W, A2, A3: CLS median, max and loads over 0.1, FCP and LCP medians, finished layout), and the single-browser table.
- cells.json: the same per cell, with more fields.
- loads.csv: one row per load, numbers and hashes only.
