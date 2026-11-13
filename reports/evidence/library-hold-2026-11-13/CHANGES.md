# Home library hold, for Nancy's choice 9 (13 Nov 2026)

Branch `claude/fix-library-hold-2026-11-13`. Layers only; no Webflow write and no publish. N9 stays off in the committed code.

## Short version

The library rail now holds the height of its tallest card from the first paint, so the story feed redraw no longer moves the page; the Layover guides heading keeps room for its second line at 360; the interlude caption is swapped before it is painted. All in the layers core (new tll-library-hold-v1, plus tll-home-bands-v1). **With N9 on, the bar passes in all 12 cases** (largest rise +0.004 against the 0.02 allowed; N9 medians 0.000 to 0.008 against today's 0.000 to 0.063). With N9 off the fix also lowers today's restored reloads to 0.005 or less. N9 is still off in the committed code; n9-on.patch is the one-line change. No Webflow change is needed.

## What moved, and why

Measured on the live www home page (core 16.63.0, pin 1f2e549a) in the cache harness, phones at 390x844 and 360x800, restored reloads:

1. **The library rail redraws.** On phones the library is a swipe row and its height is the tallest of the six cards on show. The first six come from the ten stories written into the page; 1 to 2.6 s later the story feed (/stories) arrives, the library draws again from all 56 published stories ("10 published" becomes the full count) and usually shows six other cards. Card heights differ only by title lines (1 to 5 lines at 390, 22.68 px each) and by a two-line minutes line ("Stories From the Road · 7 min read", +19 px). The first six usually include one of the editor's stories with a three-line title and a two-line minutes line; the feed's six usually do not, so the row shrank by 20 to 46 px and everything below it moved up: the value section (with N9 on), the Layover guides band (section.h3g) and the photo interlude (figure.h3-il). Today at 390 restored to 4,000 px that is a 0.03 to 0.08 shift on its own.
2. **The guides band heading rewraps at 360.** "The hours between flights." (Playfair Display 800, 28 px) is 323.4 px wide in Playfair and 313.7 px in the fallback face; at 360 the text box is 320 px, so it was one line until the web font arrived and then two, and the band grew 29 px under a reader restored to the interlude. This is the "interlude settles after load" seen on 12 and 13 Nov (bimodal, depending on whether the scroll position is restored before or after the font arrives).
3. **The interlude caption grows after paint.** tll-home-bands-v1 swapped the band photo and caption at DOMContentLoaded; the new caption (the place, then the writer's name) takes two lines on phones where the old one took one (41 to 68 px), after the band had been painted.

## The change (all in the layers core, home page only)

- **src/site-layers/tll-library-hold-v1.js** (new core layer, registered in build-site-layers-v16.py after tll-home-bands-v1):
  - Every card on the swipe row gets `min-height: var(--tll-lib-hold)`, the height of the tallest card the library holds, shown or not, so which six are on show no longer changes the row's height. Measured from copies of the cards made through an inert template, with every image's src, srcset and data-tll-v removed before the copies enter the page (measuring downloads nothing), laid out at the real card width in a hidden box and removed in the same task.
  - It runs on every library draw (the library's own `h3:stories` event, fired synchronously at the end of each draw, so the first draw is held before the first paint and the feed's draw before its frame), on DOMContentLoaded, on load, when web fonts finish loading, and after a change of window width (starts over).
  - It never shrinks while the page is open, and it is kept for the tab at that window width (sessionStorage `tll-lib-hold-v1`), so a reload or a Back starts from the final height before the first paint and the feed has nothing left to change.
  - Only the swipe row (`.h3-shelf:not(.is-pinned)`: phones, tablets, reduced motion). The pinned desktop rail is sized by the library's own script and is untouched (checked at 1440x900: no change).
  - Second rule: up to 365 px wide, `[data-h3-guides] .h3g-title` keeps `min-height: calc(2 * 1.04em)`, so the guides heading has room for its two lines from the first paint. At 390 and wider it fits one line in either face and is left alone.
- **src/site-layers/tll-home-bands-v1.js**: each band is swapped as soon as the parser has closed its figure (the figure or a box around it has a next node, so the caption text is complete), from a parse-time MutationObserver, before that band is painted; DOMContentLoaded stays as the fallback.
- **src/site-layers/tll-site-layers-v16.js**: rebuilt (core only; no chunk changed).
- **test/library-hold-layer.test.js**: 16 tests (the hold in a stand-in page: tallest card shown or not, cards taken out of the rail left out, never shrinks, kept per width, pinned rail left alone, copies stripped of photo addresses before import, width change starts over; the build carries the layer once; N9 stays false in the source and in the core; the early band swap waits for closed figures). Full suite: 53 files, 520 tests pass.

**What it looks like.** On a reload the row is as tall as the library's tallest card (today Balkans EV Road Trip, five title lines): 610 px at 390 (was 564 to 610 depending on the six on show), 581 px at 360 (was 535 to 581). A card with a short title gets more room above its minutes line, which already sits at the card foot (visual audit, 12 Nov); that is how the row looks today whenever a long title is on show. On a first visit the row starts at the tallest of the ten stories in the page and grows once when the feed brings a taller one (below the fold on a first visit; fresh loads unchanged, table below). See library-before-after.jpg (same six cards, before and after, 390 and 360; the byline row above the cards, a contributor's name and two avatars, is painted out in all four panels).

## N9 against the bar

Bar (the home reviewer's): with N9 switched on, the median restored-reload shift may not be more than 0.02 above today, in all 12 cases (390x844 and 360x800; restored to 1,233, 2,500 and 4,000 px; normal and slow 4G), 5 runs each. Today = www now (16.63.0, N9 off).

| case (width, network, restored to px) | today | fix, N9 off | fix + N9 | rise | result | fix + N9 runs |
|---|---|---|---|---|---|---|
| 390 normal 1,233 | 0.000 | 0.000 | 0.003 | +0.003 | pass | 0.098, 0.003, 0.003, 0.003, 0.003 |
| 390 normal 2,500 | 0.020 | 0.000 | 0.000 | -0.020 | pass | 0.000, 0.000, 0.000, 0.000, 0.000 |
| 390 normal 4,000 | 0.029 | 0.005 | 0.007 | -0.022 | pass | 0.007, 0.007, 0.007, 0.007, 0.007 |
| 390 slow 4G 1,233 | 0.000 | 0.000 | 0.003 | +0.003 | pass | 0.003, 0.003, 0.003, 0.003, 0.003 |
| 390 slow 4G 2,500 | 0.022 | 0.000 | 0.000 | -0.022 | pass | 0.000, 0.000, 0.000, 0.000, 0.000 |
| 390 slow 4G 4,000 | 0.063 | 0.005 | 0.007 | -0.056 | pass | 0.007, 0.007, 0.007, 0.007, 0.007 |
| 360 normal 1,233 | 0.000 | 0.000 | 0.004 | +0.004 | pass | 0.004, 0.004, 0.004, 0.004, 0.004 |
| 360 normal 2,500 | 0.014 | 0.000 | 0.000 | -0.014 | pass | 0.000, 0.000, 0.000, 0.000, 0.000 |
| 360 normal 4,000 | 0.062 | 0.003 | 0.008 | -0.054 | pass | 0.008, 0.008, 0.008, 0.008, 0.008 |
| 360 slow 4G 1,233 | 0.000 | 0.000 | 0.004 | +0.004 | pass | 0.004, 0.004, 0.004, 0.004, 0.004 |
| 360 slow 4G 2,500 | 0.013 | 0.000 | 0.000 | -0.013 | pass | 0.000, 0.000, 0.000, 0.000, 0.000 |
| 360 slow 4G 4,000 | 0.062 | 0.003 | 0.008 | -0.054 | pass | 0.008, 0.008, 0.008, 0.008, 0.008 |

**Passes in all 12 cases** (5 runs per cell, 180 loads). The largest rise is +0.0037; in 8 of 12 cases fix + N9 is below today. With N9 off the fix brings every case to 0.005 or less (today up to 0.063). What is left with N9 on is a steady 0.003 to 0.008, the same in every run: one line of text near the top of the screen nudged by less than a pixel (0.003 to 0.004), and at 4,000 px also the search form under the interlude (6 px); neither comes from the library.

Two of the 12 N9 runs at 390 restored to 1,233 px (fix + N9 run 0 here, 0.098; and 1 of 4 runs of N9 alone in the earlier run, 0.094; none in the other 126 N9 runs) painted the page before the parser had finished the library embed: the heading "The library." drew at its old size (85 px tall) and shrank when the embed's own style arrived. It does not move the medians. It is not from the hold, and with N9 off the value section sits at that scroll position instead, so N9 makes this race reachable there; on a connection that streams the page slowly it may show more often than in this harness, which hands over the HTML in one piece. Worth watching after N9 goes on (see Webflow below for what was tried).

**Without this fix, N9 fails** (earlier run, same harness, 3 to 4 runs per cell, HEAD with N9 on):

| case | today | N9 alone | rise |
|---|---|---|---|
| 390 normal 2,500 | 0.020 | 0.054 | +0.034 FAIL |
| 390 slow 4G 2,500 | 0.022 | 0.054 | +0.032 FAIL |
| 360 normal 2,500 | 0.014 | 0.057 | +0.042 FAIL |
| 360 slow 4G 2,500 | 0.014 | 0.057 | +0.043 FAIL |

The other 8 cases passed with N9 alone too. The four misses are the restored reloads at 2,500 px, where with N9 on the value section sits right under the library and the feed redraw moves it.

**Fresh loads** (not part of the bar; 3 runs; load and wait, no scroll): 390 normal and slow 4G 0.003 in every variant (today, fix, fix + N9); 360 normal and slow 4G 0.004 in every variant. On a first visit the row grows once when the feed brings a taller card, below the first screen.

**Desktop** (1440x900, restored to 1,233, one run each): the pinned rail is untouched (0.002 today, 0.003 with the fix, the same sources).

## The one-line change for N9

`n9-on.patch` in this folder (applies cleanly to this branch):

```
-var N9_PHONES_AFTER_LIBRARY=false;
+var N9_PHONES_AFTER_LIBRARY=true;
```

in src/site-layers/tll-home-value-v1.js, then `python3 src/site-layers/build-site-layers-v16.py`. That build carries the same code as the fix2N9 variant measured above.

## Webflow

No Webflow change is needed for the bar, so there is no webflow-proposal.json. Tried and dropped: moving the embed's `<style id=h3b-rail>` ahead of the library markup, against the first-paint race above. With a forced paint in the middle of the embed (a 1.5 s parser stall right after the library section), the heading kept its size with the move, but the row still moved 0.04 to 0.09 when the parse resumed, because the library's own script fills the story counts and draws the cards at the end of the embed. The move alone would not fix the race, so it is not proposed.

## Release (Merge step)

The layers change ships the usual way: rebuild layers-release from the merged commit, then register tllsitelayersv16 at that pin with its new SRI (for example 16.64.0). No embed edit is needed for the bar.

Merge notes (checked 13 Nov):

- **Rewrite, do not merge as is.** The first copy of library-before-after.jpg (commit f475f1a) shows a contributor's full name and two members' avatars. It is replaced on this branch, but the original stays in the branch history, so bring the branch in as a squash (or rewrite it) so f475f1a's image never reaches the session branch.
- **The session branch has moved.** Since the branch point (8a8a28e) claude/new-session-zxm063 has 1a64e2f (tll-home-value-v1.js and the core: the trip deck line) plus two docs commits. `git merge-tree` is clean. Rebuild the core from the merged tree and take the pin and SRI from that build, not from this branch's committed core (branch core sha384-EtPfQcdL...; the merged tree rebuilt here gave sha384-ejs9h/0Q..., byte equal to the text merge today, but rebuild anyway and use the SRI the build prints).
- n9-on.patch touches a different line from 1a64e2f and still applies to the merged tree (checked with git apply --check).

## Method and bandwidth

- Harness: the reviewer's method (nov12/fonts/review/m.cjs): buffered layout-shift observer, isMobile and touch, DPR 3, Memberstack held 40 s, every non-GET aborted; restored reload = load, wait 2.5 s, scroll to Y, wait 0.8 s, (slow 4G: throttle), reload, wait 6 s (12 s on slow 4G); the score is the sum of layout-shift values after the reload; variants interleaved per run, order reversed on odd runs.
- Bandwidth rule: the home document is the live www HTML fetched once by plain GET after the 07:35 publish (nov13/fontrel/www/raw/home.html); every Webflow-host request was served from the shared local cache (nov13/fontrel/check/cache) and anything not in it was aborted. This task fetched **0 Webflow bytes and 0 HTML pages**; the matrices ran 373 browser loads (180 final, 150 first run, 36 fresh, 6 stall), plus about 50 probe, screenshot and measuring loads; 32,264 Webflow responses were served from the cache and 509 Webflow requests that were not in it were aborted (interlude and card photos at sizes not cached; they sit in boxes of fixed size in every variant).
- The committed core differs from the measured fix2 build in one comment line only (a writer's name taken out of the tll-home-bands-v1 comment); no code differs.
- Core and chunks at the live pin were served from each variant's build. base = repo HEAD before this branch (byte equal to the live 16.63.0 core); fix2 = this branch; fix2N9 = this branch with the patch above; baseN9 = HEAD with N9 on (earlier run, same harness).
- harness/ here is a copy of the three scripts for reference (they expect the scratchpad layout). Scripts and raw runs: scratchpad nov13/next/libhold (h/lib.cjs, h/run.cjs, h/sum.py; out/q*.jsonl final matrix, out/m1 first matrix, out/fresh.jsonl, out/stall.jsonl). Summary copied here as results.txt.
