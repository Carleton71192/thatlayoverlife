# Fix A2: repaired full early layout (14 Nov 2026)

Author report. Branch claude/fix-story-first-frame-a2-2026-11-14 at 73ab244. Note: the SRI quoted below is from f0723dc; the head core SRI is in judge-a2.md.

## Fix A2: both breakages are fixed and the branch is pushed

Branch `claude/fix-story-first-frame-a2-2026-11-14`, made from origin/claude/fix-story-first-frame-a-2026-11-14 (4fec1d8) and pushed to origin. The remote matches head.

Commits:
- 76eb5bf: template edits win again; no photo nudge from the Receipts line
- f0723dc: the no-photo story stays put too
- 73ab244 (head, 73ab244fba39d7133c33d79f314641a4fed6c420): nodes added by scripts no longer count as the parser moving on

The rebuild reproduces the committed core byte for byte (worktree clean). New core SRI: sha384-1m/Pmn2jy/i6MajyxTMlE/Qa5oFJUbgXHD9Bm6o6dwJ/0JI0xen9LBkIVxMkgVFd. No chunk changed.

**Fix C not brought in.** The new early head style sizes the avatar from the first paint, so A2 never paints a tall writer photo (0 of 116 loads in the final batch). C's style would add nothing. It would be redundant but harmless if both are ever released.

## Diff (against 4fec1d8: 3 files, +387/-81, all in src/site-layers plus the test)

`src/site-layers/build-site-layers-v16.py`, and the core rebuilt from it:

**1. Template override (judge's breakage 1).**
- The 15 template copies (meta row, byline row, avatar) left `style#tll-mag-story-v1`.
- They now sit in their own `style#tll-story-st3-early-v1`. It stays in the head, always before the template's `tll-st3-story-v1`, so it loses every tie.
- It is removed once that style has been parsed (it has its own `.sheet`), or at DOMContentLoaded as a fallback.
- Effect: a later Designer edit to those rules, whether a changed value or a removed rule, wins on the finished page.

**2. Receipts line and place-and-date shift (judge's breakage 2).** First, a trace on the Balkans story at 390 on A:
- The photo moved 46 px down when the Receipts line went in. The Receipts block is parsed after the first paint. Entry 0.037.
- The template helper `script#tll-st3-story-js-v1` runs at DOMContentLoaded and shortened the place-and-date line from two lines (34 px) to one (17 px). The photo moved 13 px up. Entry 0.034 to 0.081.

The fix is two holds on `.tll-story-hero`, set when the byline goes into the hero early:
- `data-tll-mg-wait-r` keeps the photo figure (or a stamp with no photo) invisible until the Receipts block has arrived and the Receipts line is in, in the same step.
- `data-tll-mg-wait-d` keeps the place-and-date line to its first line (`-webkit-line-clamp:1`) and invisible until the helper's own DOMContentLoaded handler has run. The core adds its release listener only after the helper script has been parsed, so it runs after the helper's.
- Both holds also clear at DOMContentLoaded. Their rules are at the end of the story style and match nothing on the finished page.

**3. No-photo story.** It showed a 0.07 shift on every load on both A and A2: the "How this trip was paid for" link was hidden only when the footer style `tll-foot-v1` arrived.
- The early style now also carries the footer rule `a[data-tll-commissioned="story"]{display:none}`, keyed the same way.
- The early style now waits for both the template and footer styles.
- A commissioned story still shows the link, because the footer's `.tll-comm-on` rule is heavier.

**4. Robustness, found on slow 4G (1 of 4 Balkans loads at 0.077).**
- A consent iframe that a script appends to the end of the body counted as the parser moving past a half-parsed Receipts block.
- `whole()` now ignores siblings of the body's own children and the story style itself.

`test/story-first-frame-layer.test.js` (27 tests, A had 15):
- The new placement and removal of the early style.
- The holds and the listener order against the template script, in a stand-in page.
- The iframe and story-style cases.
- The footer rule, checked against `src/components/footer/tll-foot-v1.html`.
- The template-edit test: a small cascade over the finished page's styles, with the avatar corner changed from 50% to 6px and the byline gap from 12px to 20px in a fixture. The edited values win. A control shows the old A placement would lose them.

## Tests

Full suite green: 57 files, 579 tests (was 567).

## Measurements

Method: the judge's `adv.cjs` (copied to `nov14/a2` so cores could be named live, C, A2 and A), the same harness and serving. Cores rotate every iteration, against the final core 73ab244. Final batch file `m3.jsonl`: 250 loads.

- "Off frames" is the judge's metric.
- "Visible off frames" is my addition: the same count, but leaving out a hidden photo and a hero edge below the window.
- Template edit: live, C and A2 all ended at 6px and 20px. On A the judge measured 50% and 12px.

| case | core | loads | bad >0.1 | CLS median | CLS max | LCP median ms | FCP median ms | off frames (median) | visible off frames (median) | tall writer photo (loads) |
|---|---|---|---|---|---|---|---|---|---|---|
| story 390 instant | live | 20 | 6 | 0.0541 | 0.3585 | 358 | 174 | 3 | 3 | 20 |
| | C | 20 | 0 | 0.0672 | 0.0805 | 348 | 160 | 3 | 3 | 0 |
| | A2 | 20 | 0 | 0.0069 | 0.0069 | 268 | 202 | 0 | 0 | 0 |
| story 390 held 1.5 s | live | 10 | 2 | 0.0545 | 0.3585 | 1678 | 182 | 3 | 3 | 9 |
| | C | 10 | 0 | 0.0539 | 0.0549 | 1680 | 184 | 3 | 3 | 0 |
| | A2 | 10 | 0 | 0.0069 | 0.0070 | 1678 | 176 | 0 | 0 | 0 |
| story 1440 | live | 10 | 0 | 0.0132 | 0.0158 | 352 | 202 | 4 | 4 | 10 |
| | C | 10 | 0 | 0.0127 | 0.0153 | 358 | 176 | 4 | 4 | 0 |
| | A2 | 10 | 0 | 0.0022 | 0.0022 | 244 | 184 | 0 | 0 | 0 |
| Balkans 390 | live | 10 | 3 | 0.0815 | 0.1625 | 202 | 176 | 3 | 3 | 0 |
| | C | 10 | 3 | 0.0815 | 0.1642 | 162 | 162 | 3 | 3 | 0 |
| | A2 | 10 | 0 | 0.0111 | 0.0111 | 264 | 200 | 1 | 0 | 0 |
| Balkans 1440 | live | 4 | 0 | 0.0356 | 0.0364 | 214 | 214 | 4 | 4 | 0 |
| | C | 4 | 0 | 0.0195 | 0.0362 | 290 | 254 | 3.5 | 3.5 | 0 |
| | A2 | 4 | 0 | 0.0006 | 0.0014 | 238 | 238 | 1 | 0 | 0 |
| reload after scrolling to 2500 px | live | 5 | 5 | 0.1934 | 0.2286 | 124 | 124 | 3 | 3 | 5 |
| | C | 5 | 5 | 0.1930 | 0.1930 | 156 | 156 | 3 | 3 | 0 |
| | A2 | 5 | 0 | 0.0063 | 0.0063 | 132 | 132 | 3 | 3 | 0 |
| no hero photo | live | 8 | 8 | 0.4030 | 0.7071 | 198 | 176 | 3 | 3 | 8 |
| | C | 8 | 8 | 0.4016 | 0.4253 | 238 | 176 | 3 | 3 | 0 |
| | A2 | 8 | 0 | 0.0107 | 0.0118 | 212 | 176 | 2.5 | 0 | 0 |
| story slow 4G | live | 4 | 0 | 0.0690 | 0.0690 | 9038 | 5488 | 3 | 3 | 0 |
| | C | 4 | 0 | 0.0774 | 0.0796 | 9018 | 5496 | 3 | 3 | 0 |
| | A2 | 4 | 0 | 0.0069 | 0.0069 | 9026 | 5624 | 0 | 0 | 0 |
| Balkans slow 4G | live | 4 | 3 | 0.1624 | 0.1624 | 5546 | 5546 | 3 | 3 | 0 |
| | C | 4 | 3 | 0.1411 | 0.1624 | 5564 | 5564 | 3 | 3 | 0 |
| | A2 | 4 | 0 | 0.0111 | 0.0111 | 9164 | 5666 | 1 | 0 | 0 |
| template edit, 390 | live | 3 | 1 | 0.0540 | 0.3577 | 444 | 308 | 3 | 3 | 3 |
| | C | 3 | 0 | 0.0548 | 0.0796 | 512 | 324 | 4 | 4 | 0 |
| | A2 | 3 | 0 | 0.0069 | 0.0084 | 280 | 208 | 0 | 0 | 0 |
| Balkans 390, A against A2 | A | 8 | 7 | 0.1181 | 0.1190 | 212 | 202 | 4 | 4 | 0 |
| | A2 | 8 | 0 | 0.0111 | 0.0111 | 264 | 204 | 1 | 0 | 0 |

- **No A2 load went over 0.02** in the final batch.
- **Finished page:** in every case, one final layout hash was shared by live, C and A2 (one exception under slow 4G, noted below). The figure, the byline in the hero, the Receipts line, the stamp, the "min read" span, the caption and `--tll-hero-r` were identical across the three cores in every case.
- **Bandwidth and safety:**
  - 0 bytes from Webflow or jsDelivr; the harness byte-count file was unchanged before and after.
  - 0 cache misses, 3,972 non-GETs aborted, 0 page errors, 0 driver errors.
  - Disk had 7.5 to 8G free before every batch.
- **Not a Webflow call:** no Webflow calls of any kind, no publish, no push to layers-release, no jsDelivr release, no merge.

## Still not fixed, or worth knowing

1. **The photo now shows a little later.** On Balkans it appears about 50 ms later than on A (LCP 264 against 212 ms, side by side), because it stays hidden until the Receipts block arrives. A2's LCP is still 90 to 110 ms earlier than live and C on the reported story at both widths. On Balkans, live and C report the h1 as LCP, so those numbers are not comparable. If a template ever loses the Receipts block, the photo stays hidden until DOMContentLoaded.
2. **FCP is 20 to 40 ms later than live on the 390 story.** This comes from A's early style and early run, not A2's holds: A and A2 matched side by side (202 against 204 ms).
3. **Off frames on Balkans and the no-photo story (judge's metric 1 and 2.5)** are frames where only the hidden photo or the hero's bottom edge below the window moved. The visible count is 0.
4. **A long place name could still shift slightly.** If the template's final place-and-date line needs two lines at 390, it grows by one line when the hold ends. None of the saved stories do this.
5. **A no-photo story with a Receipts line:** the body below the hero could still move when the line goes in. No saved story is like that.
6. **One slow-4G story load ended with a different final layout.** It was A2 and the first slow load in the batch; this happened in two batches, with the same element count and page height. The judge saw the same once each on live and C.
7. **A Designer edit can still show briefly.** It changes the first frames only until the template style is parsed, then the template wins. Once the when-home item moves the avatar rules into the template head, the copies in the early style become redundant and can be deleted.
8. **Re-running the measurements:** `adv.cjs` now reads its cores from its own folder, and the core copies were deleted. Put `core-live.js`, `core-C.js` and `core-A2.js` back from `git show` before re-running.

## Files

In the repo:
- src/site-layers/build-site-layers-v16.py
- src/site-layers/tll-site-layers-v16.js
- test/story-first-frame-layer.test.js

Scratch data, about 304K, in scratchpad/nov14/a2/:
- adv.cjs (driver), an.py (analysis), batch.sh
- b.txt, b2.txt, b3.txt (batch files; b3.txt is the final run)
- batch.log
- m3.jsonl (final data)
- netbytes.before

No traces, screenshots or core copies were kept. The node_modules symlink in the worktree has been removed.
