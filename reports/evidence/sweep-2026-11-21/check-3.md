# Sweep Nov 21, check 3: independent check of ff8b7cd (review 2 follow-up) against f3bc3f4 and live 16.68.0

Checked head: claude/sweep-fixes-2026-11-21 at ff8b7cd5978837b747c135c639347e80ef82c5c2 (dabf400 item 1, ff8b7cd item 2, on f3bc3f4).
Core sha384 checked: sha384-7BuGLQzS/89d4eCS1J14BHSv96uxPPr4tl62X1kJtq7Ngzljs24q8/rce1BHepYz (273,848 B, 81,141 B gzip).
Live reference: 16.68.0, pin 0f04fabf.

**Result: PASS WITH NOTES.** Every claim in the builder's report reproduces. The review 2 case (Webflow footer scripts held 4 to 5 s
after the stories chunk) shows all cards and then the place's at f3bc3f4 in 12 of 12 loads, and never at ff8b7cd (0 of 12). One
acceptance item is not met, and it is not new: with ?place=Asia the CLS is above live (1440: 0.059 against 0.031; 390: 0.0031
against 0), the same at f3bc3f4 and at ff8b7cd (note 1).

Nothing was written to Webflow, Memberstack, Cloudinary or the Worker; nothing was published or submitted; every non-GET was aborted
(0 seen); nothing was downloaded from Webflow hosts (net.json: 0 bytes, 0 misses). One Chromium at a time.

## 1. Build, tests, diff

| Check | Result |
|---|---|
| Rebuild in a clean worktree at ff8b7cd (`python3 src/site-layers/build-site-layers-v16.py`) | byte-equal: `git status` clean, core and all 27 chunks unchanged |
| Core | 273,848 B, 81,141 B gzip, sha384 as above (the builder's figures) |
| `npx vitest run` | 849 passed, 72 files |
| `node --test worker/test/*.test.js` | 83 of 83 |
| `node --test worker/test` on Node 22.23.5 | fails, "Cannot find module .../worker/test" (as fix.md now says) |
| New tests against the f3bc3f4 layer | the 3.5 s case and the four DOMContentLoaded cases fail, the error case passes (as claimed) |
| Diff f3bc3f49..ff8b7cd | tll-place-wait-v1.js, its built copy in the core, the layer's one-line description in build-site-layers-v16.py (and that line in the core header), test/stories-place-url-layer.test.js, fix.md. Nothing else |
| Commit messages and added text | no em dash, no exclamation mark outside `!important`, none of the banned words, trailer lines exact in both commits |

The layer change itself: the release timer is `setTimeout(show,3500)`, started at the chunk's load if the document has parsed, else at
DOMContentLoaded; the error path and the 10 s cap are as before. The replay in tll-stories-places-v1 starts at DOMContentLoaded and
polls 29 times at 100 ms, so the core no longer lets go before the replay can press the chip.

fix.md (item 2): the note 8 row matches the cached /for-expats page. Of the four static eyebrows, THE DIRECTORY and WHAT A LOCATION
EXPERT DOES hold their text in an inner div, the first and last hold it directly; the map's is drawn by tll-expats-map-v1. The three
outer boxes that read 10px are the two nested ones and the map's, and only the map's text was really 10px, so "two" (the nested
ones that were really 12px) and review 2's "three" (the boxes that read 10px) describe the same thing. The worker command rows are right.

## 2. Browser: /stories?place=

Harness: check-3/bin/ab.cjs (check-2's, with base pointed at the f3bc3f4 worktree, br at the ff8b7cd worktree, and a new holdWf
option) and check-3/bin/pw.cjs. Cached HTML from the plain-GET cache, core and chunks from disk (live from git 0f04fabf), Webflow-host
assets from the asset cache only, Memberstack stand-in, signed out. holdWf holds every Webflow-host script after the head (jQuery,
webflow.js, GSAP and the 16 footer scripts; the three head scripts before and around the core are not held) until that many ms after
the stories chunk was answered, which holds DOMContentLoaded back the same way. The page records when the mark went on and off,
DOMContentLoaded, when a place chip was first pressed, and a 50 ms timeline of mark, grid visibility and cards shown. A "flash" is a
moment where the grid is visible with more cards than at the end (all 57, then the place's). CLS is after a scroll to the bottom and back.

150 loads (results/place.jsonl, summary results/place-summary.txt). CLS is the median of the loads; "end" is grid visible and mark gone
at the end.

| Case | n | live CLS | f3bc3f4 CLS, end, flash | ff8b7cd CLS, end, flash | ff8b7cd pressed, cards |
|---|---|---|---|---|---|
| a normal Europe 390 | 2 | 0 | 0, 2/2, 0 | 0, 2/2, 0 | Europe, 14 |
| a normal Europe 1440 | 2 | 0.0307 | 0.0307, 2/2, 0 | 0.0305, 2/2, 0 | Europe, 14 |
| a normal Asia 390 | 2 | 0 | 0, 2/2, 0 | 0.0015, 2/2, 0 | Asia, 11 |
| a normal Asia 1440 | 2 | 0.0309 | 0.06, 2/2, 0 | 0.0852, 2/2, 0 | Asia, 11 |
| b core and chunks 3 s late, Europe 390 | 2 | 0.2569 | 0.2569, 2/2, 0 | 0.2569, 2/2, 0 | Europe, 14 |
| b late, Europe 1440 | 2 | 0.1374 | 0.1374, 2/2, 0 | 0.1374, 2/2, 0 | Europe, 14 |
| b late, Asia 390 | 2 | 0.2569 | 0.2569, 2/2, 0 | 0.2569, 2/2, 0 | Asia, 11 |
| b late, Asia 1440 | 2 | 0.1374 | 0.1374, 2/2, 0 | 0.1374, 2/2, 0 | Asia, 11 |
| c footer held 4 s, Europe 390 | 2 | 0.005 | 0.005, 2/2, **2** | 0.005, 2/2, 0 | Europe, 14 |
| c held 5 s, Europe 390 | 2 | 0.005 | 0.005, 2/2, **2** | 0.005, 2/2, 0 | Europe, 14 |
| c late 3 s and held 5 s, Europe 390 | 1 | 0.0061 | 0.0061, 1/1, **1** | 0.0061, 1/1, 0 | Europe, 14 |
| c held 4 s, Europe 1440 | 2 | 0.0303 | 0.0305, 2/2, **2** | 0.0304, 2/2, 0 | Europe, 14 |
| c held 5 s, Europe 1440 | 2 | 0.0307 | 0.0398, 2/2, **2** | 0.0302, 2/2, 0 | Europe, 14 |
| c late 3 s and held 5 s, Europe 1440 | 1 | 0.03 | 0.0296, 1/1, **1** | 0.0296, 1/1, 0 | Europe, 14 |
| c held 4 s, Asia 390 | 2 | 0.005 | 0.0081, 2/2, **2** | 0.0081, 2/2, 0 | Asia, 11 |
| c held 5 s, Asia 390 | 2 | 0.005 | 0.0081, 2/2, **2** | 0.0081, 2/2, 0 | Asia, 11 |
| c late 3 s and held 5 s, Asia 390 | 1 | 0.0061 | 0.0091, 1/1, **1** | 0.0091, 1/1, 0 | Asia, 11 |
| c held 4 s, Asia 1440 | 2 | 0.0306 | 0.0595, 2/2, **2** | 0.0595, 2/2, 0 | Asia, 11 |
| c held 5 s, Asia 1440 | 2 | 0.0304 | 0.0595, 2/2, **2** | 0.06, 2/2, 0 | Asia, 11 |
| c late 3 s and held 5 s, Asia 1440 | 1 | 0.0297 | 0.0588, 1/1, **1** | 0.0588, 1/1, 0 | Asia, 11 |
| d stories chunk blocked, Europe 390 / 1440 | 1+1 | 0 / 0.0592 | 0 / 0.0588, 2/2, 0 | 0 / 0.0593, 2/2, 0 | none, 57 |
| d blocked, Asia 390 / 1440 | 1+1 | 0 / 0.0596 | 0 / 0.0597, 2/2, 0 | 0 / 0.059, 2/2, 0 | none, 57 |
| e page chip script missing, Europe 390 / 1440 | 1+1 | 0 / 0.031 | 0 / 0.0308, 2/2, 0 | 0 / 0.0302, 2/2, 0 | none, 57 |
| e missing, Asia 390 / 1440 | 1+1 | 0 / 0.0308 | 0 / 0.0307, 2/2, 0 | 0 / 0.0304, 2/2, 0 | none, 57 |
| f ?place=Nowhere 390 / 1440 | 1+1 | 0 / 0.031 | 0 / 0.0304, 2/2, 0 | 0 / 0.0301, 2/2, 0 | none, 57 |
| f Nowhere, late 3 s, 390 / 1440 | 1+1 | 0.2569 / 0.1374 | same, 2/2, 0 | same, 2/2, 0 | none, 57 |
| f Nowhere, held 5 s, 390 / 1440 | 1+1 | 0.005 / 0.0304 | 0.005 / 0.0307, 2/2, 0 | 0.005 / 0.0303, 2/2, 0 | none, 57 |

All 150 loads: grid visible and mark gone at the end, 0 page errors. The one console error in every load, in all three variants, is
the harness's own abort of the Turnstile script. Live ignores ?place= (all 57 cards, "all" pressed) in every case, as before.

What the timings show:

- Case c at f3bc3f4: DOMContentLoaded came 4.1 s and 5.1 s after the chunk (the hold works); the mark went 1.0 s and 2.0 s before
  DOMContentLoaded, all 57 cards painted, and 0.2 s after DOMContentLoaded they dropped to the place's. That is review 2's finding 3.1,
  now seen in Chromium. At ff8b7cd the mark went 0.17 to 0.31 s after DOMContentLoaded, right after the replay pressed the chip; no flash.
- CLS does not catch that flash (the grid's height change is below the first screen), so the flash count is the measure for 3.1.
- Case b: here DOMContentLoaded comes about 2.8 s before the chunk (the footer scripts are not slowed), so this is the "chunk after
  DOMContentLoaded" path; the replay presses the chip as soon as the chunk runs, in both f3bc3f4 and ff8b7cd. CLS equals live.
- Case d: the mark goes at once (0.1 to 0.18 s before DOMContentLoaded) in both. Case e: the replay gives up 2.9 to 3.1 s after
  DOMContentLoaded and the grid shows all cards; the core's 3.5 s had not yet run.
- Case f: no mark at all.

### Extra loads at normal speed (results/x.jsonl, 48 loads)

| Case | n | live | f3bc3f4 | ff8b7cd |
|---|---|---|---|---|
| ?place=Asia 1440 | 6 | 0.0307 | 0.0596 | 0.0594 |
| ?place=Europe 1440 | 6 | 0.031 | 0.0308 | 0.0304 |
| ?place=Asia 390 | 4 | 0 | 0.0031 | 0.0031 |

The 0.0852 median in the first table came from one load at 0.1105 (one extra 0.0699 shift of the grid section while the grid was
still hidden); it did not come back in these 6 loads, where ff8b7cd reads 0.0591 to 0.06.

## 3. Browser: pages without ?place= (results/eq.jsonl, 60 loads; results/h.jsonl, 15 loads)

/stories, home, /for-expats, /about and the Lisbon story, 390 and 1440, 2 loads each of live, f3bc3f4 and ff8b7cd, with page
signatures (every visible element's box, text and key styles; check-2's an2.py). f3bc3f4 against ff8b7cd: 0 boxes changed, 0
elements only in one, 0 style or text changes, 0 unstable keys except 4 on home, in all 10 cells. 0 page
errors. CLS at load equal. After the scroll, home at 390 read 0.0795 / 0.1581 (median); the extra 0.1563 is the footer reveal and
happens at random: 5 more loads each read live 0.0615 to 0.0782, f3bc3f4 0.0615 to 0.1998 (one high), ff8b7cd 0.0777 in all five.
The layer returns on its first line outside /stories, so nothing else could differ.

## 4. Notes

1. **CLS with ?place=Asia is above live, at f3bc3f4 and at ff8b7cd alike** (not introduced by this head). At 1440 the replay takes the
   mark off right after its click; the page's lead layer (tll-lib-lead-v1, a MutationObserver on the grid with a 30 ms debounce)
   then moves the lead mark to a different card (an Asia story) 40 to 60 ms after the grid is shown, and the cards move: one shift of
   0.0292 in 12 of 12 Asia loads at 1440 (0.0031 at 390). Europe keeps its lead card, so it equals live. Live has no such shift only
   because it ignores ?place=. A small follow-up would close it: let the replay take the mark off after the lead layer has run (for
   example a 100 ms timeout after the click, or on the next `tll:lib-filtered`), with a unit test. Values stay below 0.1 except the
   single 0.1105 load.
2. The note 3 browser figures in fix.md are marked as measured at f3bc3f4; this check measured ff8b7cd and they still hold (late 3 s:
   0.2569 at 390 and 0.1374 at 1440, equal to live; normal Europe 1440 0.0304 against live 0.031).
3. The 10 s cap counts from the core's run. A visit where DOMContentLoaded comes more than about 9.8 s after the core ran would still
   let go before the replay presses the chip (that is the cap doing its job); none of the cases here came close (the worst, late 3 s
   and held 5 s, released 0.2 s after DOMContentLoaded, after the press).

## 5. Files

- check-3/bin: ab.cjs (load harness, from check-2 with holdWf), pw.cjs (cases), an.py (place summary), an2.py (page signatures,
  from check-2), run.sh.
- check-3/results: place.jsonl, place-summary.txt, x.jsonl, eq.jsonl, eq-base-br.txt, h.jsonl, net.json. Page signature files stay in
  the scratchpad (they hold page text).
