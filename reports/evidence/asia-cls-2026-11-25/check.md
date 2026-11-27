# Asia layout shift (check 3 note 1): independent check of 2c51cda against live 16.69.0

Checked head: claude/asia-cls-2026-11-25 at 2c51cda74b9ae34a013562ad01bca6b9ec8abf8b (one commit on a997980).
Reference: live core 16.69.0 (work branch claude/new-session-zxm063 at a997980; its core and chunks equal pin 77b56b3f, core
sha384-7BuGLQzS/89d4eCS1J14BHSv96uxPPr4tl62X1kJtq7Ngzljs24q8/rce1BHepYz, the integrity www serves since 25 Nov 08:01 UTC).

**Result: PASS WITH NOTES.** Every claim in the builder's report reproduces. With ?place=Asia the 0.0292 shift of the lead card is
gone in 24 of 24 loads (old: 12 of 12 at 1440 in the normal and held cases), and CLS with ?place=Asia now equals /stories without a
place (1440: 0.0305 against 0.0593; 390: 0 against 0.0031). The full grid never paints before the filter (0 of 288 loads, either
build). No page errors. Home, /for-expats and the Lisbon story are unchanged. The notes are about wording, one pre-existing lead
problem when the scripts are late, and a scroll-phase footer shift on home that is noise.

Nothing was written to Webflow, Memberstack, Cloudinary or the Worker; nothing was published or submitted; every non-GET was aborted
(0 seen). 0 bytes from Webflow hosts and 0 plain HTML GETs (net.json: wfBytes 0; 26 image misses got a 1x1 stand-in, nothing
fetched). One Chromium at a time, closed at the end.

## 1. Build, tests, diff

| Check | Result |
|---|---|
| Rebuild in a clean worktree at 2c51cda (`python3 src/site-layers/build-site-layers-v16.py`) | byte-equal: `git status` clean, core and all 27 chunks unchanged |
| Core | 273,848 B, sha384-lQYmZoXkPCA3mw+DdnKr0yq4bL6dMnbqZ5NfY1Vcg7RZB3wJZFrur0X0OmlH1fDf (the builder's figure) |
| chunks/stories.js, stories-preview.js | 18,416 B and 29,505 B, sha384 as the builder gives |
| Rebuild at a997980 | byte-equal too; core hash 7BuG... as live |
| `npx vitest run` | 853 passed, 72 files |
| `node --test worker/test/*.test.js` | 83 of 83 |
| The 4 new tests against the a997980 layer | tests 1 to 3 fail (test 1: lead still on the Africa card), test 4 passes, as claimed |
| Diff a997980..2c51cda | tll-stories-places-v1.js (replay and new settle()), the two stories chunks, one hash line in the core, the test file, one line in handoff/BANDWIDTH-LOG.md. tll-place-wait-v1 and all page code unchanged |
| Commit message and added text | no em dash, no exclamation mark (only JS `!`), none of the banned words, both trailer lines exact |

The change: when the replay presses a chip it first starts a MutationObserver on the grid (child list, subtree, and the style,
data-tll-lead and data-tll-q-miss attributes), clicks, and takes the mark off once the grid has been quiet for 100 ms, or 400 ms after
the click at most. Chip already pressed, no chip, and the 29-poll give-up still let go at once. The claim that the page's chip click
fires no tll:lib-filtered holds: in the saved 21 Nov /stories footer only tll-lib-search-v4 dispatches it.

## 2. Browser: /stories with ?place=

Harness: bin/ab.cjs and bin/pw.cjs, from check-3's (reports/evidence/sweep-2026-11-21/check-3/bin), with two variants: old (a997980
worktree) and new (2c51cda worktree), each core tag's integrity set to its own hash. Top-frame HTML from the 21 Nov plain-GET cache;
the 25 Nov saved live HTML for /stories, home, /for-expats and the Balkans story is the same apart from the publish stamp, the core pin
and integrity, and two webflow.js bundle names, which are not in the asset cache, so the 21 Nov HTML was used. Webflow-host assets from
the asset cache only, Memberstack stand-in, signed out. late3s: core and chunks answered 3 s late. hold5s: Webflow footer scripts held
until 5 s after the stories chunk (which holds DOMContentLoaded back the same way). The page records, on every animation frame, the
mark, grid visibility, cards shown and which item carries the lead mark.

288 loads: 4 queries x 2 widths x 3 speeds x 6 loads x 2 builds, order alternated (results/place.jsonl, summary
results/place-summary.txt). CLS is after a scroll to the bottom and back (median, then range). cardShift: loads with a shift whose
source is a story card (the 0.0292 one). flash: a frame with the grid visible and more cards than at the end. leadMove: a frame with
the grid visible and the lead mark not yet on its final card. off-press: when the mark came off after the chip press (the frame
sampler sees the press up to one frame late, so "at the click" reads about -10 ms).

| Case | old CLS | new CLS | cardShift old / new | leadMove old / new | off-press old / new (ms) |
|---|---|---|---|---|---|
| Asia 1440 normal | 0.0593 (0.0591 to 0.0600) | **0.0305** (0.0302 to 0.0308) | 6 / **0** | 6 / **0** | -19 to -12 / 120 to 151 |
| Asia 1440 hold5s | 0.0597 (0.0594 to 0.0600) | **0.0302** (0.0302 to 0.0306) | 6 / **0** | 6 / **0** | -15 to -11 / 113 to 157 |
| Asia 1440 late3s | 0.1374 | 0.1374 | 0 / 0 | 0 / 0 | -11 to -7 / 123 to 138 |
| Asia 390 normal | 0.0031 | **0** | 0 / 0 | 6 / **0** | -19 to -12 / 135 to 155 |
| Asia 390 hold5s | 0.0081 | **0.0050** | 0 / 0 | 6 / **0** | -37 to -11 / 118 to 144 |
| Asia 390 late3s | 0.2569 | 0.2569 | 0 / 0 | 0 / 0 | -17 to -8 / 125 to 140 |
| Europe 1440 normal | 0.0304 | 0.0300 | 0 / 0 | 0 / 0 | -28 to -13 / 178 to 210 |
| Europe 1440 hold5s | 0.0305 (one old load 0.0487) | 0.0304 | 0 / 0 | 0 / 0 | -59 to -15 / 155 to 224 |
| Europe 1440 late3s | 0.1374 | 0.1374 | 0 / 0 | 0 / 0 | -14 to -10 / 175 to 205 |
| Europe 390 normal, hold5s, late3s | 0, 0.0050, 0.2569 | 0, 0.0050, 0.2569 | 0 / 0 | 0 / 0 | old at the click / 159 to 207 |
| Nowhere 1440 normal, hold5s, late3s | 0.0304, 0.0303, 0.1374 | 0.0304, 0.0307, 0.1374 | 0 / 0 | 0 / 0 | no mark in either |
| Nowhere 390 normal, hold5s, late3s | 0, 0.0050, 0.2569 | same | 0 / 0 | 0 / 0 | no mark in either |
| no place 1440 normal, hold5s, late3s | 0.0303, 0.0304, 0.1374 | 0.0304, 0.0304, 0.1374 | 0 / 0 | 0 / 0 | no mark in either |
| no place 390 normal, hold5s, late3s | 0, 0.0050, 0.2569 | same | 0 / 0 | 0 / 0 | no mark in either |

In all 288 loads: flash 0, grid visible and mark gone at the end, the place's chip pressed (Asia 11 cards, Europe 14, Nowhere and no
place all 57 with "all" pressed), 0 page errors, 0 console errors apart from the harness's own abort of the Turnstile script, 0
non-GETs, 0 failed loads.

What the frames show (results/place.jsonl, act.pw.fr), one Asia 1440 pair:

- old: grid hidden with 57 cards; 728 ms grid visible, 11 cards, lead mark still on a card the filter hid; 787 ms lead mark moves to an
  Asia card, shift 0.0292 on that card at 786 ms.
- new: 669 ms 11 cards, still hidden; 702 ms lead mark moves to the Asia card, still hidden; 816 ms grid visible with the lead already
  in place, no card shift.

So the mark now comes off 113 to 224 ms after the press (the builder estimated about 130 ms) and the late and held cases still stay
hidden until the press (flash 0, mark on before and off after the press in all of them). The worst case of the replay (3.3 s after
DOMContentLoaded) was not exercised in the browser here; the unit test covers the 0.4 s cap.

## 3. Browser: home, /for-expats, a story page (results/eq.jsonl, 36 loads; results/h.jsonl, 20 loads)

390 and 1440, 3 loads each of old and new, with page signatures (bin/an2.py; signature files stay in the scratchpad, they hold page
text). In all 6 cells: 0 boxes changed, 0 elements only in one, 0 style or text changes, 0 unstable keys except 2 and 4 on home. 0
page errors, same console lines, same bytes from disk (only the stories chunks differ, and these pages do not load them). CLS at load
equal.

Home at 1440 after the scroll read 0.0005 (old) against 0.2147 (new) in those 3 loads, from a footer shift (footer.inline-footer-0-1)
in all three new loads. 20 more loads (results/h.jsonl) show it is the random footer reveal check-3 saw on home at 390: old had it in
2 of 10 (0.2155, 0.3167), new in 2 of 10 (0.418 twice); the rest read 0.0003 to 0.0237 in both. The code home runs is byte-equal in
both builds (core differs only in the stories chunk hashes), so this is not from the change.

## 4. Notes

1. **Wording in the builder's report.** "The rebuilt core is still 273848 bytes, sha384-lQYm..." is right for the size only; the hash
   is new (16.69.0 is 7BuG...). Taking this live needs a new pin and the new integrity in the site head, as for any core change.
2. **Pre-existing, both builds: with the core and chunks 3 s late, the lead mark stays on a card the filter hid** (Asia: 12 of 12 late
   loads, old and new; Europe, Nowhere and no place are not affected because their first card stays visible). The probe
   (results/probe.jsonl, 8 loads) shows the same when a reader clicks the Asia chip by hand after a late load: the lead stays on the
   hidden first card, while at normal speed it moves to the Asia card. bin/probe2.cjs (2 loads, old) shows the grid's visible items
   are not moved to the end in the late case (first visible item 30, not 46), so the page's lead layer gets no child-list change to
   re-mark on. CLS is not affected (the lead never moves there), but the visible Asia grid then has no lead card. Not introduced by
   2c51cda; worth a small follow-up in the page's chip or lead script.
3. The new settle() also watches style on every card in the subtree; a grid with an animation that keeps writing style would wait the
   full 0.4 s. None was seen here (the mark came off by 224 ms in every load).

## 5. Files

- bin: ab.cjs (load harness, from check-3, variants old and new), pw.cjs (sets place, eq, h, probe), an.py (place summary), an2.py
  (page signatures, from check-3), probe2.cjs (late-lead probe), run.sh.
- results: place.jsonl, place-summary.txt, eq.jsonl, an-old-new.json, h.jsonl, probe.jsonl, net.json, run.log.
- Bandwidth: 362 browser page loads (288 place, 36 eq, 20 h, 8 probe, 2 probe2, 8 trial loads), 0 MB from Webflow (M), 0 HTML GETs.
