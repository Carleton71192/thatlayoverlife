# Fix A4, independent measurement against the gate (15 November 2026)

Verdict: FAIL on one part of the gate, (d), by its letter. Every other part passes, most of them by a wide margin.

- (d) fails on the reload at 2,500 px on Balkans at 390: 1 of 3 A4 loads in the gate run, and 3 of 10 in the recheck, end with the page scrolled to 2,503 px instead of 2,500. The page itself is laid out exactly as on www; the only boxes that differ are the fixed reading progress bar and the note button, which follow the scroll. No www, A2 or A3 load ended anywhere but 2,500 (W 13 of 13, A2 13 of 13, A3 3 of 3). The author saw the same thing (6 of 10) and still counted (d) as a pass.
- (a), (b), (c), (e) and (f) pass. No A4 load went over 0.1 in any of the 99 cells (highest 0.091, Southern Africa 768). No cell is worse than A2 by more than 0.01 median, so nothing needed a recheck under (c); the two reload cells were rechecked anyway (Balkans for (d), Pantanal because the author flagged it).

Nothing was merged, published or pushed to layers-release. No Webflow tool calls.

## The core under test

- Branch claude/fix-story-first-frame-a4-2026-11-14, head ea2cec26b9c4df4a6b8b07ac1432794ea0d91e25 (commits 4404866, c6c9127, ea2cec2 on 39f4b67).
- The local file scratchpad nov14/a4core/tll-site-layers-v16-a4-ea2cec2.js is byte for byte the core committed at that head.
- SRI: sha384-v1EUdNInqs4fB+zOZjwfXmb5dgDGjFa92/8UygZtiMSfypWvrp2fXt3PAbbZbcsN, as claimed.
- A clean build of the head in a detached worktree (node_modules symlinked) exits 0, leaves the tree clean and gives the same bytes. The worktree is removed.
- Size: the file is 251,121 bytes and 75,694 bytes with gzip -9. The report says 251,113 and 75,683. The SRI and the bytes match, so only the size in the report is off, by 8 and 11 bytes.
- All four cores load the same chunk pin and carry the same chunk SRIs, so the routed chunks are the same for every core.
- The diff from 39f4b67 touches only src/site-layers/ (the build script, the two new region-name files and the built core) and the story test.

## Method

- Harness: the A3 measure judge's m.cjs, copied to scratchpad nov14/a4judge-measure with an A4 core added. Same caches, routing, Memberstack patch, ad stubs and slow 4G model. www plain-GET HTML at the www address. W keeps the 16.64.0 core tag and its integrity. For A2, A3 and A4 the integrity attribute is removed from the core tag in the routed HTML only, and the core URL is answered with the local core.
- Fresh browser context per load. Within each round the four cores run in turn, and the starting core rotates each round.
- Cells: the nine stories at 320, 344, 360, 375, 390 and 412 (5 loads per core), 768 and 1440 (3 loads), and reload after scrolling to 2,500 px at 390 (3 loads). Slow 4G (150 ms per request, one 1.6 Mbit/s pipe, CPU 4x) at 360 and 390 (3 loads). Then 10 more loads per core (W, A2, A4) on the Balkans and Pantanal reloads.
- CLS is the sum of every layout-shift entry until about 3.5 s after load (headless Chromium marks every entry hadRecentInput, so every entry counts, as in the earlier checks).
- Finished page: the box of every visible element (left, top plus scroll, width, height) is written out and hashed after the wait. "Same as www" means the list equals a W load's list in the same cell.

### One browser at a time

- A second lab harness (another judge's) ran on this machine during this check. A monitor logged every browser on the machine every 10 to 20 s.
- In the first chunk, a second browser was up for parts of 05:26 to 05:29 UTC. The four jobs whose loads fall in that window (Madrid 320, Balkans 344, Croatia 344, Southern Africa 344; 80 loads) were run again and the first rows were dropped. The medians barely moved (www Croatia 344 0.111 then 0.078; every A2, A3 and A4 median the same).
- A second chunk that started while the other harness was busy was stopped after 11 loads and run again from the start.
- From then on the harness waited before each load until every browser outside its own process tree had been idle for a few seconds, and it checked the CPU time those browsers used during each load. 0 of the 1,040 loads it checked ran next to a busy browser. The other harness waits while this one runs, so its browser stayed idle.
- Gate rows: 1,404 unthrottled, 216 slow 4G and 60 recheck loads (1,680), all measured with one active browser.

## Results by part of the gate

### (a) No A4 load over 0.1 where www and A2 stay under 0.1: PASS

- Unthrottled: 0 of 351 A4 loads over 0.1, in any cell. The highest is 0.091 (Southern Africa 768).
- Slow 4G: 0 of 54. The highest is 0.0195 (Balkans 360).
- For scale: www has 155 of 351 unthrottled loads over 0.1, A2 31, A3 9.

### (b) Where www or A2 go over 0.1, A4 not worse than A2 by more than 0.01 median: PASS

- 53 unthrottled cells have a www or A2 load over 0.1. In none of them is A4 worse than A2 by more than 0.01; in most it is far lower.
- 768 px (the nav shift at DOMContentLoaded, on every core): A4 medians 0.074 to 0.086, never over 0.1. A2 goes over 0.1 on 12 of 27 loads at 768 and A3 on 9 of 27. A4 is lower than A2 on 7 of the 9 stories at 768 and equal on the other 2 (Southern Africa and Madrid).

### (c) No cell worse than A2 by more than 0.01 median: PASS

- 0 of 99 cells (81 unthrottled, 18 slow 4G) are worse than A2 by more than 0.01 median.
- 44 cells are better than A2 by more than 0.01 (31 unthrottled, 13 slow 4G).
- The judge's M cells are back at or below A2: Vietnam 320 to 412, Phuket 320 to 412, Lisbon 390 and 412 and Texas 320 to 412 are equal to A2 or lower (Vietnam 390 0.016 against 0.031). At 768, Lisbon, Vietnam and Phuket are 0.015 to 0.025 lower than A2.
- On A3, 15 cells were worse than A2 by more than 0.01 in this same run (Vietnam, Phuket and Lisbon at phone widths, and Southern Africa, Vietnam and Phuket at 768), so the A3 finding reproduces and A4 removes it.
- Reload at 2,500 px, 10 more loads per core:
  - Pantanal: A2 0.0284, A4 0.0251 (A4 lower). Both split between 0.006 and 0.03 to 0.08, as the author found. Not a failure here.
  - Balkans: A2 0.0236, A4 0.0105.

### (d) Finished page equals www box for box on every unthrottled load: FAIL (Balkans reload at 390)

- 350 of 351 unthrottled A4 loads in the gate run equal www. The one miss is the Balkans reload at 2,500 px, load 3: 286 of 289 boxes are the same, and the 3 that differ are the progress bar (top 2,500 against 2,503) and the two note-button boxes (3,284 against 3,287). scrollY is 2,503.
- Recheck, 10 more loads per core: A4 3 of 10 at 2,503 (7 of 10 equal www). W and A2 10 of 10 at 2,500. Pantanal reload: 10 of 10 equal on all cores.
- A diagnostic run (12 A4 loads, not part of the gate) ended at 2,503 on 7 of 12. 3 A2 and 3 W loads ended at 2,500.
- What the frame traces show:
  - On W and A2, the page is still growing while the browser tries to restore the position, and the restore lands on exactly 2,500 at the load event.
  - On the A4 loads that end at 2,503, the scroll is already at 2,497 at about 300 ms, while the document is interactive and before the load event, and the restore does not move it again.
  - The story body section above the view then grows 6 px before load (11,306 to 11,312 px, on every core). Scroll anchoring adds those 6 px, which leaves the page at 2,503.
  - Likely cause: A4 holds the story under the head, so the page reaches its full height earlier than on A2, and that lets the restore finish before the last height change.
- On slow 4G, 53 of 54 A4 loads equal www. The other one (Phuket 390) is the known foot-of-story order race (11 boxes in one band about 300 px tall at 10,000 px: the reader notes and the write-for-us ask in the other order). The same miss is on one A2 and one A3 load. The gate allows it.

### (e) No hold, stand-in or early style left, 0 page errors: PASS

- No load on any core ended with data-tll-mg-wait-r, data-tll-mg-wait-d, the flag stand-in or the early style in the page (1,680 gate loads).
- 0 page errors on any core. Console messages are the Memberstack offline line and aborted requests, at the same rate on all cores.

### (f) Slow 4G median FCP not later than A2 by more than 40 ms: PASS

- Median over the 18 cells of (A4 cell median minus A2 cell median): 0 ms (range -80 to +68). Over all 54 loads per core: A4 6,650 ms, A2 6,656 ms.
- For comparison, A3 was +66 ms against A2 in this run. A4 is +94 ms against www.
- Unthrottled FCP: A4 is 4 ms earlier than A2 (median of 81 cells, range -40 to +36).

## A3 gains kept (unthrottled medians; A4, then A3, A2 and www)

| cell | A4 | A3 | A2 | www |
|---|---|---|---|---|
| Balkans 320 | 0.0023 | 0.0023 | 0.1343 | 0.1256 |
| Balkans 344 | 0.0039 | 0.0039 | 0.1348 | 0.1243 |
| Balkans 360 | 0.0195 | 0.0195 | 0.1468 | 0.0170 |
| Balkans 375 | 0.0213 | 0.0213 | 0.1534 | 0.0164 |
| Croatia 390 | 0.0039 | 0.0104 | 0.0552 | 0.1436 |
| Southern Africa 344 | 0.0039 | 0.0140 | 0.0514 | 0.0418 |
| Southern Africa 360 | 0.0042 | 0.0136 | 0.0585 | 0.0613 |
| Southern Africa 375 | 0.0041 | 0.0128 | 0.0584 | 0.0627 |
| Southern Africa 390 | 0.0057 | 0.0168 | 0.0557 | 0.0612 |
| Southern Africa 412 | 0.0073 | 0.0185 | 0.0603 | 0.1195 |

- All kept. A4 is the same as A3 on Balkans and lower than A3 on Croatia and Southern Africa.
- At phone widths (fresh loads, 320 to 412), the median cell is 0.0041 on A4, 0.0106 on A3, 0.0123 on A2 and 0.0661 on www.
- Balkans 360 and 375 are 0.0195 and 0.0213 on every A4 load here; the author reports 0.0087 and 0.0150 medians. They are still slightly above www (0.017 and 0.016), as on A3.

## The author's claims, checked

- SRI, clean rebuild, story-layer-only change: confirmed. Byte and gzip sizes: off by 8 and 11 bytes (see above).
- No A4 load over 0.1, no cell worse than A2 by more than 0.01, 0 leftovers, 0 page errors: confirmed.
- "All 351 A4 finished pages equal www box for box": not confirmed. 350 of 351 here, and 7 of 10 in the Balkans recheck. The author's own risk 2 describes the same 3 px.
- Slow 4G FCP +8 ms against A2: here 0 ms. Unthrottled -4 ms: same here.
- Pantanal reload +0.011 against A2 in the author's recheck: here A4 is 0.003 lower than A2 on 10 loads per core. It is a race on both cores.

## Not covered, and limits

- Real devices, real network chunking (documents are served whole), other browsers, other widths and other stories.
- Hero photos that were not in the local caches were aborted, not fetched (bandwidth rule), the same on every core.
- The adversarial cases (ADV1 to ADV5) are outside this lens and were not run.
- Region table (outside the gate, checked without a browser): the 280 names in region-names-v1.json are Chromium 141's. Node's ICU 77.1 names 4 of them differently (FK, HK, MO, PS). Other engines may differ too, as the author says in risk 4.

## Bandwidth and safety

- 0 bytes from Webflow hosts and 0 from jsDelivr: every request to them was a cache hit or an aborted image. The harness's own cache folder stayed empty. No HTML GET was made.
- All 5,839 non-GET requests in the recorded loads were aborted.
- About 1,800 lab loads in all, including the dropped and diagnostic ones. Scratch data is about 9 MB in scratchpad nov14/a4judge-measure. Disk stayed above 7G free.
- No member data in these files. Stories are named by place only.

## Files

- table.md: every cell (W, A2, A3, A4: CLS median, max and loads over 0.1; A4 and A3 minus A2; A4 finished page same as www; FCP medians), and the rechecks.
- cells.json: the same per cell, with every load's CLS and the summaries.
