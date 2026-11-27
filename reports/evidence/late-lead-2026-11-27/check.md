# Late lead mark on /stories: independent check of claude/late-lead-2026-11-27

Checked head: claude/late-lead-2026-11-27 at 175788f36984006730042341a7ce206261e1286b (three commits on a2ad2ad: 80f173a, 1745c65,
175788f). Reference: core 16.70.0, live on www since 27 Nov (a2ad2ad; its core and chunks equal pin 121b4fe, core
sha384-lQYmZoXkPCA3mw+DdnKr0yq4bL6dMnbqZ5NfY1Vcg7RZB3wJZFrur0X0OmlH1fDf, the integrity in the saved 27 Nov live /stories page).

**Result: PASS.** With the core and chunks 1, 3 or 6 s late, the lead mark now ends on the first visible card in every load
(old: on a card the filter hid in every Asia load). It is on the first visible card at the end of every chip click, in all 41
new cases and 284 new chip clicks, and in no new frame does the visible grid have its lead on a hidden card. CLS is equal to
16.70.0 in every case. Home, /stories without a place and the Lisbon story show no DOM or CLS change. The core rebuilds byte for
byte. No page code changed. The notes in section 6 are about things that were there before and are not made worse.

Nothing was written to Webflow, Memberstack or the story Worker. No form was submitted. Every non-GET was aborted (0 seen).
0 bytes from Webflow hosts (net.json: wfBytes 0); 6 home images not in the cache got a 1x1 stand-in, nothing was fetched.
One Chromium at a time, closed at the end.

## 1. Diff, build, tests

| Check | Result |
|---|---|
| Diff a2ad2ad..175788f | tll-stories-places-v1.js (one document click listener and a comment), chunks/stories.js and stories-preview.js (the same lines), the stories hash line in the core, test/stories-late-lead.test.js, the builder's evidence folder, one line in handoff/BANDWIDTH-LOG.md. No file under src/pages, no before.html or after.html, nothing else in src. |
| Rebuild at 175788f in a clean worktree (`python3 src/site-layers/build-site-layers-v16.py`) | byte-equal: `git status` clean after the build |
| New core | 273,848 B, sha384-vtQYZzh8oCb2Dn6Z0Cz+jrg60Clgicg8f5ba6uSWukhCgZOkACTCBxMUnrvaJ81M (the builder's figure) |
| chunks/stories.js, stories-preview.js | 19,087 B sha384-vWfoaU0d...JX, 30,176 B sha384-qdiuy5Hx...9BO, equal to the core's stories line |
| Rebuild at a2ad2ad | byte-equal; core lQYm..., as live. 121b4fe and a2ad2ad have the same core and chunks |
| zxm063 since a2ad2ad (now a51d714) | no change in src/site-layers or test, so the new integrity holds on the current work branch |
| `npx vitest run` at 175788f | 882 of 882, 74 files |
| `node --test worker/test/*.test.js` | 83 of 83 |
| The 7 new tests against the a2ad2ad layer | 6 fail, 1 passes (the normal speed test), as claimed |
| Commit messages and added text | no em dash, no exclamation mark, none of the banned words; both trailer lines exact |
| Saved 21 Nov /stories against the saved 27 Nov live page | tll-lib-lead-v1, tll-lib-chips-v1, tll-lib-search-v4 and tll-s3-stories-js-v1 byte-equal; same 57 cards and regions; only the core pin, two webflow.js bundles and the form labels script differ |

The change, read line by line: a second document click listener, registered after url(). On a click inside the place-sort row
whose target is in a `[data-tll-place]` or `[data-tll-sort]` chip, it dispatches `tll:lib-filtered` on document. The chip's own
handler (page chip or the layer's fallback) sits on the chip, so it runs first, in the target phase; neither calls
stopPropagation, so the listener always sees the click. Listeners of the event: the page's lead layer (mark, synchronous), the
page's s3 note (only acts on #tll-q-note without data-s3) and this layer's dots (debounced 120 ms). The noimg layer dispatches the
event and does not listen to it. mark() also moves a picked card to the front; the saved page has one pick (a Europe card), and the
pick behaves the same in both builds (it leads Europe and All places in every load).

## 2. Browser: how it was run

bin/ab.cjs and bin/pw.cjs (from the builder's harness, which comes from the asia-cls check). Variants: old = a clean a2ad2ad worktree
(rebuilt, lQYm...), new = a clean 175788f worktree (rebuilt, vtQY...), each core tag's integrity set to its own hash. Top-frame
HTML from the 21 Nov plain-GET cache, Webflow-host assets from the asset cache only (misses: images get a 1x1 stand-in, the rest is
aborted, nothing is stored), Memberstack stand-in, signed out, story Worker aborted. Added in this copy: a last check before any
pass-through that aborts a Webflow, site, Memberstack or Worker host (0 hits), and a count of top-level navigations.
lateNs: core and chunks each answered N s late (so the stories chunk runs about 2N s in).

In the page, before any script: every animation frame (to 40 s) records grid visibility, visible items and the lead item; a window
click listener (bubble phase, so after every document listener) records the state at the end of each chip click and 50 ms later.
**ok** means one lead mark on the first visible item, or no mark when no item is visible. Lead items are named by a hash of the
card id, so the files hold no titles. badFr: loads with a frame where the grid is visible and ok fails. CLS: after a scroll to the
bottom and back, and after the clicks (median, then range).

## 3. ?place= on load (results/load.jsonl, 136 loads; Asia 4 per case and build, the rest 3)

| Case | end ok old / new | badFr old / new | replay click ok in the click old / new | CLS old / new |
|---|---|---|---|---|
| Asia 1440 normal | 4 / 4 | 0 / 0 | 0 / 4 (ok 50 ms later in both) | 0.0305 / 0.0304 |
| Asia 1440 late1s | **0 / 4** | **4 / 0** | 0 / 4 | 0.1374 / 0.1374 |
| Asia 1440 late3s | **0 / 4** | **4 / 0** | 0 / 4 | 0.1374 / 0.1374 |
| Asia 1440 late6s | **0 / 4** | **4 / 0** | 0 / 4 | 0.1374 / 0.1374 |
| Asia 390 normal | 4 / 4 | 0 / 0 | 0 / 4 (ok 50 ms later in both) | 0 / 0 |
| Asia 390 late1s, late3s, late6s | **0 / 4** each | **4 / 0** each | 0 / 4 each | 0.2569 / 0.2569 each |
| Europe 1440 normal, late1s, late3s, late6s | 3 / 3 each | 0 / 0 | 3 / 3 | 0.0302 / 0.0302; late 0.1374 both |
| Nowhere 1440, all four speeds | 3 / 3 each | 0 / 0 | no press | 0.0307 / 0.0302; late 0.1374 both |
| no place 1440, all four speeds | 3 / 3 each | 0 / 0 | no press | 0.0302 / 0.0304; late 0.1374 both |

The new late lead is the same card as at normal speed (Asia: the same hashed card in all 32 Asia loads of the new build; old late:
the first card of All places, hidden). Asia shows 11 cards, Europe 14, Nowhere and none 57 with All places pressed, in every load.
0 card shifts. The one new load at 0.0403 (Asia 1440 normal, run 0) is a share-row shift at 464 ms in the first, cold load, before
any press.

## 4. Chip clicks after the load (results/click.jsonl, 40 loads, 4 per case and build)

No place; trusted clicks on Asia, then Europe, then All places, 400 ms apart.

| Case | clicks ok in the click old / new | ok 50 ms later old / new | badFr old / new | CLS old / new |
|---|---|---|---|---|
| normal 1440 | 4 of 12 / **12 of 12** | 12 / 12 | 4 / 0 | 0.0306 / 0.0307 |
| late1s 1440 | 8 of 12 / **12 of 12** | 8 / 12 | 4 / 0 | 0.1374 / 0.1374 |
| late3s 1440 | 8 of 12 / **12 of 12** | 8 / 12 | 4 / 0 | 0.1374 / 0.1374 |
| late6s 1440 | 8 of 12 / **12 of 12** | 8 / 12 | 4 / 0 | 0.1374 / 0.1374 |
| late3s 390 | 8 of 12 / **12 of 12** | 8 / 12 | 4 / 0 | 0.2569 / 0.2569 |

Old, late: the Asia click leaves the lead on a hidden card until Europe is clicked. Old, normal: Asia and Europe are wrong for
the 30 ms before the lead layer's timer. New: right at the end of every click. The clicks add 0 to CLS.

## 5. Trying to break it (results/brk.jsonl, 96 loads, 3 per case and build, 1440 unless noted)

| Case | end ok old / new | badFr old / new | in the click old / new | CLS old / new |
|---|---|---|---|---|
| rapid, one task: Asia, Europe, Oceania, Middle East, All, Asia, Antarctica, Asia by script, state read after each, normal | 3 / 3 | 3 / 0 | 6 / **24 of 24** | 0.0305 / 0.0300 |
| same, late3s | 3 / 3 | 3 / 0 | 6 / **24 of 24** | 0.1374 / 0.1374 |
| rapid, trusted clicks with no pause, normal | 3 / 3 | 3 / 0 | 0 / **24 of 24** | 0.0307 / 0.0307 |
| same, late3s | **0 / 3** | 3 / 0 | 3 / **24 of 24** | 0.1374 / 0.1374 |
| filter that hides every card: Oceania (fallback when late) then Antarctica (page chip) then Asia; both regions renamed in this run's copy of the HTML; normal | 3 / 3 | 3 / 0 | 0 / **9 of 9** | 0.0307 / 0.0302 |
| same, late3s | **0 / 3** | 3 / 0 | 0 / **9 of 9** | 0.1374 / 0.1374 |
| ?place=Oceania with no Oceania card, normal | 3 / 3 | 3 / 0 | 0 / 3 | 0.0300 / 0.0300 |
| same, late3s | **0 / 3** | 3 / 0 | 0 / 3 | 0.1374 / 0.1374 |
| back and forward: ?place=Europe, click Asia, open the Lisbon story, back, forward, back; normal | 3 / 3 | 3 / 0 | 3 / 12 of 12 | 0.0308 / 0.0309 |
| same, late3s | **0 / 3** | 3 / 0 | 3 / 12 of 12 | 0.1374 / 0.1374 |
| reduced motion, 390: ?place=Asia, then Europe, Asia; normal | 3 / 3 | 3 / 0 | 0 / 9 of 9 | 0 / 0 |
| same, late3s | **0 / 3** | 3 / 0 | 3 / 9 of 9 | 0.2569 / 0.2569 |
| Enter on the focused Asia chip, normal | 3 / 3 | 3 / 0 | 0 / 3 | 0.0347 / 0.0299 |
| same, late3s | **0 / 3** | 3 / 0 | 0 / 3 | 0.1374 / 0.1374 |
| sort chip (added to this run's copy of the HTML) after Asia, normal | 3 / 3 | 3 / 0 | 0 / 6 of 6 | 0.0587 / 0.0591 |
| same, late3s | 3 / 3 | 3 / 0 | 0 / 6 of 6 | 0.1584 / 0.1584 |

- With nothing visible the new build leaves no card marked (Oceania, Antarctica, ?place=Oceania: 0 visible, 0 marks). Old keeps
  the mark on a hidden card there even at normal speed, because the page's own chip moves no card when none match. The fix covers
  that too.
- Back and forward: the back navigation reloaded the page in every load (pageshow persisted false in 24 of 24 back navigations), so ?place=Asia
  replays through the fallback when late; new is right after each back (6 of 6 per speed), old wrong in all late ones. A
  back-forward cache restore was not seen in this harness; it would keep the DOM as it was on leaving, which in the new build is
  already right.
- Enter on a chip fires the same click, so keyboard use is covered. Old Enter, normal, 0.0347 and 0.0519: a share-row shift in the
  load phase before the key press, not the lead.
- In 41 new cases, 0 loads with a bad frame, and every one of the 284 new chip clicks ok at the end of the click and 50 ms later.

## 6. Other pages (results/eq.jsonl, 36 loads, bin/an2.py)

Home, /stories without a place and the Lisbon story, 390 and 1440, 3 loads each of old and new. Page signatures: 0 boxes changed,
0 elements only in one build, 0 style, text or attribute changes, in all 6 cells (unstable keys: 2 on home, 0 elsewhere). 0 page
errors, the same console lines. CLS at load equal (home 0 and 0.0005, /stories 0 and 0.0300 against 0.0307, Lisbon 0 and 0.0001).
Home at 1440 after the scroll read 0.4429, 0.0229, 0.0129 old and 0.2144, 0.0005, 0.0035 new: the random footer reveal the asia-cls
check saw on home; home loads the same core code apart from the stories hash line, and the same bytes from disk.

## 7. Notes (none blocks)

1. **Before, both builds, not made worse:** with the core late, Asia (a fallback chip) and then a sort chip shows all 57 cards while
   Asia still looks pressed (the page's filter keeps its last page place). The lead is on the first visible card in both builds;
   CLS 0.1584 in both. The live page has no sort chips today, as the builder says.
2. **Before, not changed:** the core's tll-stories-noimg-v1 (lead goes to the newest story with a photo) does not listen to
   tll:lib-filtered and does not see the fallback's display changes, so after a fallback chip it does not re-check the first card.
   If the first card of Asia, Middle East or Oceania ever has no photo, a late load would lead with the photo panel while normal
   speed leads with a photo. Not seen here: in every load the lead had a photo and was the same card as at normal speed.
3. Taking it live needs the new pin and integrity (vtQY...) in the site head as 16.71.0, like any core change.

## 8. Files

- check/bin: ab.cjs (load harness), pw.cjs (sets load, click, brk, eq), an.py (summaries), an2.py (page signatures, from the
  asia-cls check), run.sh.
- check/results: load, click, brk and eq .jsonl, the three -summary.txt files, an-old-new.json, net.json. Signature files
  stay in the scratchpad (they hold page text).
- Bandwidth: 312 browser runs (308 measured, 4 smoke), 368 top-level page loads (the back and forward cases load 5 pages each),
  0 MB from Webflow (M), 0 HTML GETs.
