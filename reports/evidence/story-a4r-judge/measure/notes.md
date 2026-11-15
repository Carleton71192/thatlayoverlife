# Fix A4R (A4 repair round), independent measurement against the gate (15 November 2026)

Verdict: PASS on all six parts of the gate.

- (a) 0 of 351 unthrottled A4R loads and 0 of 54 slow 4G loads over 0.1. Highest unthrottled 0.0914 (Southern Africa 768), highest slow 4G 0.0195.
- (b) In the 54 unthrottled cells where www or A2 go over 0.1, A4R is never worse than A2 by more than 0.01 median once the one flagged cell is rechecked.
- (c) One cell was flagged on 3 loads: the reload at 2,500 px on Balkans at 390 (A4R 0.0455 against A2 0.0105). With 10 more loads per core it is 0.0105 on A4R and on A2. No other cell is worse than A2 by more than 0.0003.
- (d) 351 of 351 unthrottled A4R loads end with the same box list as a www load in their cell, including all 27 gate reloads and all 20 recheck reloads (every one at scrollY 2,500). On slow 4G, 48 of 54 equal www; the other 6 are the known foot-of-story order race, the same shape as on A2 (6 of 54) and A3 (5 of 54).
- (e) No hold, stand-in or early style left on any load, 0 page errors on any core.
- (f) Slow 4G: median of cell FCP differences (A4R minus A2) +10 ms, range -40 to +40.

The A4 judge's (d) failure is fixed: A4 (ea2cec2), run beside A4R in the recheck for reference, ended at 2,503 on 5 of 10 Balkans reloads; A4R on 0 of 10 (and 0 of 3 in the gate run).

Nothing was merged, published or pushed to layers-release. No Webflow tool calls.

## The core under test

- Branch claude/fix-story-first-frame-a4-2026-11-14, head 413139c2eac8f51d2175e77fdecda91f108113c1 (one commit on ea2cec2). The diff from ea2cec2 touches only src/site-layers/build-site-layers-v16.py, the built core and test/story-first-frame-layer.test.js.
- SRI of the local file scratchpad nov14/a4core/tll-site-layers-v16-a4r-413139c.js: sha384-trfI5wInWYlCUfz0XKnR/BqQpouu3JHGMLplaS1AFlYR8UiNBqoOU/6oYwcAJYTl, as claimed.
- The file equals the core committed at that head byte for byte (cmp).
- Clean rebuild: a detached worktree at 413139c (node_modules symlinked), python3 src/site-layers/build-site-layers-v16.py exits 0, leaves the tree clean, and the rebuilt core equals the local file byte for byte. The story test passes there (49 of 49, vitest). The worktree is removed.
- Size: 252,289 bytes, 76,036 bytes with gzip -9 -n. Both match the author's numbers.
- All cores (A2, A3, A4, A4R) carry the same chunk pin and the same chunk SRIs, so the routed chunks are the same for every core.

## Method

- Harness: the A4 measure judge's m.cjs, copied to scratchpad nov14/a4rjm with the A4R core added (and the A4 core kept for the recheck). Same caches, routing, Memberstack patch, ad stubs and slow 4G model. www plain-GET HTML at the www address. W keeps the 16.64.0 core tag and its integrity. For A2, A3, A4R (and A4) the integrity attribute is removed from the core tag in the routed HTML only, and the core URL is answered with the local core.
- Fresh browser context per load. Within each round the cores run in turn (W, A2, A3, A4R), and the starting core rotates each round.
- Cells: the nine stories (Balkans, Croatia, Southern Africa, Pantanal, Madrid, Lisbon, Vietnam, Phuket, Texas) at 320, 344, 360, 375, 390 and 412 (5 loads per core) and 768 and 1440 (3 loads); reload after scrolling to 2,500 px at 390 on all nine (3 loads); slow 4G (150 ms per request, one 1.6 Mbit/s pipe, CPU 4x) at 360 and 390 (3 loads). Then 10 more loads per core (W, A2, A3, A4R, and A4 for reference) on the Balkans and Pantanal reloads.
- CLS is the sum of every layout-shift entry until about 3.5 s after load (headless Chromium marks every entry hadRecentInput, so every entry counts, as in the earlier checks).
- Finished page: the box of every visible element (left, top plus scroll, width, height) is written out and hashed after the wait. "Same as www" means the list equals a W load's list in the same cell. The final scrollY is recorded too.

### One browser at a time

- Every load waits until no browser outside this harness has used CPU for a few seconds, and is run again if another browser used more than 0.3 s of CPU while it ran. 0 of 1,880 loads had to be run again.
- A monitor logged every browser on the machine every 10 s. The adversarial judge's harness had a browser open from 13:42 to 13:53 UTC (it uses the same yield rule). The 8 fresh cells with loads in that window (Balkans 344 and 360, Croatia 344, Madrid 320 and 344, Pantanal 320 and 344, Southern Africa 344; 160 loads) were run again later with no other browser up, and every gate number below uses the rerun. The medians barely moved (largest change: A3 Balkans 360, 0.0195 then 0.0124; every A4R median the same).
- Gate rows: 1,404 unthrottled, 216 slow 4G and 100 recheck loads (1,720), all with one active browser.

## Results by part of the gate

### (a) No A4R load over 0.1 where www and A2 stay under 0.1: PASS

- Unthrottled: 0 of 351 A4R loads over 0.1, in any cell. Highest 0.0914 (Southern Africa 768); the other 768 maxima are 0.074 to 0.083.
- Slow 4G: 0 of 54. Highest 0.0195 (Balkans 360).
- For scale, unthrottled loads over 0.1: www 162 of 351, A2 30, A3 5 (Balkans 375 once at 0.32, and Southern Africa, Vietnam and Phuket at 768).

### (b) Where www or A2 go over 0.1, A4R not worse than A2 by more than 0.01 median: PASS

- 54 unthrottled cells have a www or A2 load over 0.1. One of them is the flagged Balkans reload (A2 has one load at 0.135 there); it passes after the recheck under (c). In the other 53, A4R is at most equal to A2 plus 0.0003.
- 768 px (the nav shift at DOMContentLoaded, on every core including www): A4R medians 0.074 to 0.091, A2 0.074 to 0.144. A4R is lower than A2 on 6 of the 9 stories at 768 and equal on 3 (Pantanal, Madrid, Lisbon). A2 goes over 0.1 on 8 of 27 loads at 768, A3 on 4, www on 4, A4R on 0.

### (c) No cell worse than A2 by more than 0.01 median: PASS after the recheck

- Flagged on the gate's 3 loads: the reload at 2,500 px on Balkans at 390, A4R 0.0455 (loads 0.0455, 0.0105, 0.0455) against A2 0.0105 (0.0105, 0.0105, 0.1352).
- Recheck, 10 more loads per core:
  - Balkans: A4R 0.0105 (3 of 10 loads at 0.041 to 0.046), A2 0.0105 (3 of 10 at 0.081), A3 0.0105 (4 of 10 at 0.071 to 0.081), A4 0.0105 (1 of 10 at 0.046), W 0.3759.
  - Pantanal: A4R 0.0174, A2 0.0284, A3 0.0063, A4 0.0251, W 0.3377. A4R is lower than A2.
  - Pooled over the gate and recheck loads (13 per core): Balkans A4R 0.0105, A2 0.0105; Pantanal A4R 0.0063, A2 0.0284.
- Cause of the high reload values: on 4 of the 5 high A4R Balkans reloads the extra shift is a single entry on the story body section (0.039) at 210 to 245 ms, 45 to 55 ms after DOMContentLoaded; on the fifth it is 0.030 on the body's headings and paragraphs at DOMContentLoaded. All of it comes before the load event, so the repair round's scroll at the load event is not the cause. A diagnostic run of 12 more A4R Balkans reloads (not part of the gate) recorded the load event time: 3 of 12 were high (0.041 to 0.046), and in each the large entry came 23 to 83 ms before the load event; scrollY was 2,497 at the load event on all 12 and 2,500 at the end. The same race shows on A2 (0.08 on Balkans, and 0.039 on Phuket in this run), A3 and A4. All cores split between a low and a high value on these reloads, so it is a race on every core, not something A4R adds. Its high value is lower on A4R (about 0.045) than on A2 and A3 (about 0.08).
- No other cell, unthrottled or slow 4G, is worse than A2 by more than 0.0003 (Pantanal 375). 33 unthrottled and 13 slow 4G cells are better than A2 by more than 0.01.
- The A3 finding (M) reproduces on A3 in this run (12 unthrottled cells worse than A2 by more than 0.01: Vietnam 320 to 390, Phuket 344 to 412, Lisbon 390, the Pantanal reload) and is gone on A4R: every one of those cells equals A2, and Phuket 768, Lisbon 412 and the Phuket reload are lower.

### (d) Finished page equals www box for box on every unthrottled load: PASS

- 351 of 351 unthrottled A4R loads equal a www load in their cell. W, A2 and A3 are 351 of 351 too.
- Reloads: all 27 gate reloads on every core end at scrollY 2,500. In the recheck, A4R 20 of 20 at 2,500 and equal to www; A4 ended at 2,503 on 5 of 10 Balkans reloads, so the repair round's fix is what makes the difference.
- Slow 4G: 48 of 54 A4R loads equal www. Each of the other 6 (Balkans 360 and 390, Croatia 360, Madrid 360, Vietnam 360, Texas 360) differs from a www list in exactly 11 consecutive boxes in one band about 360 to 390 px tall near the foot of the story, with the same left, width and height values in the other order: the known foot-of-story order race (reader notes and the write-for-us ask). A2 has the same on 6 of 54 loads and A3 on 5. The gate allows it.

### (e) No hold, stand-in or early style left, 0 page errors: PASS

- No load on any core ended with data-tll-mg-wait-r, data-tll-mg-wait-d, a flag stand-in (data-tll-mg-flags) or the early style in the page (1,720 gate loads), and no element of the hero was left hidden.
- 0 page errors on any core. Console messages are the Memberstack offline line and aborted requests, at the same rate on all cores (for example 1,259 and 708 on A4R against 1,256 and 705 on W over the unthrottled run).

### (f) Slow 4G median FCP not later than A2 by more than 40 ms: PASS

- Median over the 18 cells of (A4R cell median minus A2 cell median): +10 ms (range -40 to +40). Over all 54 loads per core: A4R 6,658 ms, A2 6,646 ms, A3 6,722 ms, www 6,550 ms.
- For comparison A3 is +72 ms against A2 in this run. A4R is +108 ms against www, about the same as A4 in the A4 judge's run (+94).
- Unthrottled FCP: median of the 81 cell differences against A2 is +4 ms (range -52 to +48); pooled medians A4R 184 ms, A2 180 ms.

## A3 gains kept (unthrottled medians; A4R, then A3, A2 and www)

| cell | A4R | A3 | A2 | www |
|---|---|---|---|---|
| Balkans 320 | 0.0023 | 0.0023 | 0.1343 | 0.1256 |
| Balkans 344 | 0.0039 | 0.0039 | 0.1348 | 0.1243 |
| Balkans 360 | 0.0195 | 0.0124 | 0.1515 | 0.0170 |
| Balkans 375 | 0.0213 | 0.0211 | 0.1534 | 0.0170 |
| Croatia 390 | 0.0039 | 0.0104 | 0.0681 | 0.2125 |
| Southern Africa 344 | 0.0039 | 0.0140 | 0.0514 | 0.0340 |
| Southern Africa 360 | 0.0042 | 0.0136 | 0.0585 | 0.0613 |
| Southern Africa 375 | 0.0041 | 0.0128 | 0.0584 | 0.0633 |
| Southern Africa 390 | 0.0057 | 0.0168 | 0.0709 | 0.0550 |
| Southern Africa 412 | 0.0073 | 0.0185 | 0.0730 | 0.1349 |

- All kept. A4R equals or beats A3 everywhere except Balkans 360, where A3's median is lower in this run (0.0124 against 0.0195; both split between about 0.009 and 0.0195 from load to load). Balkans 360 and 375 stay slightly above www (0.017), as on A3 and A4.
- At phone widths (fresh loads, 320 to 412), the median cell is 0.0042 on A4R, 0.0106 on A3, 0.0152 on A2 and 0.0655 on www.

## The author's claims, checked

- SRI, byte equality with the committed core, clean rebuild, sizes, changed files: confirmed.
- (a) 0 loads over 0.1, highest 0.086 (Southern Africa 768): 0 loads confirmed; the highest here is 0.0914 at the same cell. www and A2 loads over 0.1 (151 and 29): here 162 and 30.
- (b) 52 cells with a www or A2 load over 0.1: here 54. At 768, A4R 0.074 to 0.086: here 0.074 to 0.091.
- (c) Balkans and Pantanal reloads flagged on 3 loads: here only Balkans was flagged (0.0455 against 0.0105, the same numbers); Pantanal was lower than A2. Recheck Balkans 0.0105 on A4R, A2 and A4: confirmed. Pantanal A4R 0.0268 against A2 0.0284: here 0.0174 against 0.0284. 30 and 13 cells better than A2: here 33 and 13.
- (d) 351 of 351 equal www, 20 of 20 reloads at 2,500: confirmed. Slow 4G 49 of 54 with 5 race loads against 1 on A2: here 48 of 54 on A4R and the same count (6) on A2, so the race is not more frequent on A4R in this run.
- (e) Confirmed.
- (f) Slow 4G -20 ms against A2: here +10 ms, inside the 40 ms limit. Unthrottled -4 ms: here +4 ms.
- A3 gains: the author's values match these to the fourth decimal on every cell except Balkans 360 (0.0192 against 0.0195 here) and Southern Africa 390 (A2 0.059 there, 0.071 here).

## Not covered, and limits

- The adversarial cases (flag script failures, template throws, parser stalls, US state flag) are outside this lens and were not run here.
- The reload fix scrolls one pixel and back at the load event; it was measured here only in Chromium 141 headless (Playwright headless shell 1194), not in Safari or Firefox, and only at 390 px.
- The reload cells are a race on every core. A new 3-load sample can flag the Balkans or Pantanal reload again; on 13 loads per core neither is worse than A2.
- Real devices, real network chunking (documents are served whole), other widths and other stories. Hero photos that were not in the local caches were aborted, not fetched (bandwidth rule), the same on every core.

## Bandwidth and safety

- 0 bytes from Webflow hosts and 0 from jsDelivr: every request to them was a cache hit or an aborted image (the harness's own cache folder stayed empty). No HTML GET was made.
- All 5,810 non-GET requests in the recorded loads were aborted.
- 1,892 lab loads in all (1,720 gate and recheck loads, the 160 loads of the overlap window that the rerun replaced, and 12 diagnostic reloads). Scratch data about 6 MB in scratchpad nov14/a4rjm. Disk stayed above 7G free.
- No member data in these files. Stories are named by place only.

## Files

- table.md: every cell (W, A2, A3, A4R: CLS median, max and loads over 0.1; A4R and A3 minus A2; A4R finished page same as www; FCP medians), the recheck with A4 for reference and the final scroll position, and the pooled reload cells.
- cells.json: the same per cell, with every load's CLS, the run summaries and the gate flags.
