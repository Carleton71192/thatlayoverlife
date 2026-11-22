# Sweep Nov 21, review 2: adversarial review of the Nov 22 follow-up (notes 1 to 4 and 8)

Reviewed: claude/sweep-fixes-2026-11-21 from 1ef84abb to f3bc3f49 (commits e620a60, ecd127a, 22adb7f, dfd0316, 4136afc, f3bc3f4),
and the whole branch's src/site-layers against claude/new-session-zxm063 (zxm063 has no src/site-layers or tools change since the
merge base fae9bb6; the live core, layers-release 0f04fab, is byte-equal to c1d5fba, an ancestor of the branch). No browser was run
(another checker holds it). Nothing was downloaded from Webflow hosts; the plain-GET HTML cache of the Nov 21 sweep was read from disk.
No Webflow, Memberstack, Cloudinary or Worker writes; nothing published.

**Verdict: PASS WITH NOTES.** Notes 1, 2, 4 and 8 hold as fixed. Note 3 holds for the case that was measured (core and chunks late)
but not for the opposite case (the page's own footer scripts late), where the grid is shown again before the chip is pressed. No path
keeps the grid hidden for good. Two report claims are inaccurate (note 8 "all five eyebrows", the worker test command).

## 1. What was checked and holds

| Check | Result |
|---|---|
| Rebuild | `python3 src/site-layers/build-site-layers-v16.py` at f3bc3f4 leaves the tree clean (byte-equal) |
| Core | 273,683 B, 81,102 B gzip (79.2 KB), sha384-zZQB/zsehgGnNd/jgQFu0T1AqScv35Wvg4rT533wLyECh6g4NFcOeANuIB6Qe25t, as claimed |
| Chunk SRIs | site, site-preview, stories, stories-preview hashes in the loader match the files |
| Tests | vitest 844 passed in 72 files; `node --test worker/test/*.test.js` 83 of 83. The bare `node --test worker/test` fails on Node 22 (see 3.3) |
| Note 1 (A08 card position) | `html body #tll-gate-back.tll-gate-back` is (1,1,2), over the site head's `.tllp-home :has(> img[data-tll-parallax="hero"]) ~ *` (0,2,1, no !important); the /account lift (1,2,2) still wins over the base rule. No other `~ *` or `body > *` rule with position was found on the cached pages (only `.tll-embed body > *:not(main){display:none !important}`, which hides the card in embed mode, as intended). The card is built by the layer, so no Webflow interaction targets it |
| Note 2 (staged) | chunks/site.js carries no `tll-gate-return` string; site-preview.js holds every site layer in the same order plus tll-gate-return-v1. The loader picks site-preview only with `[?&](preview|qr)=` or a `tll-preview-*` localStorage key. No public layer writes a `tll-preview-*` key without a `?preview=` value. Nothing else in src, worker or test reads `tll-gate-return` or `tll-gate-back`. gate-return-layer.test.js still runs the layer source directly, and chunks-staged-layer.test.js covers the loader choice on /, /account, /submit, /my-pets, /share-photos, /about |
| Release inputs | tools/release-layers.sh copies the working tree's core and `chunks/*.js` after `rm -f chunks/*.js`, so site-preview.js goes out; countries.js (on layers-release today) is dropped, and the loader no longer asks for it. The builder's worktree has only an untracked node_modules link, nothing extra under chunks/ |
| Note 4 (letter-spacing) | `.tll-lib-meta` is in the markup only on /stories (57 cards) among the 36 cached pages; elsewhere it is only named in CSS or read by scripts. tll-card-lang-v1 (which reads it) is not in the build. (1,1,2) with !important beats the page's (0,1,0) 2px !important |
| Note 8 (eyebrow) | `[data-tll-x=eyebrow]` appears in the markup only on /for-expats (for-press has only `apply-note`). The rule makes the map's late eyebrow steady at 12px; see 3.2 for the report claim |
| ?place= guard, can it hang | Bad value (`Mars`, `all`, empty): no mark. Core not on its pinned URL or no stories chunk asked for: no mark. Chunk SRI or network error: `error` takes the mark off at once. Chunk throws before replay: `load` still fires, mark off 3 s later. Page chip script missing: replay gives up after 29 polls and calls shown(). Chunk stalls with neither event: 10 s cap. Memberstack is not involved in this path. bfcache: the timers belong to the page and resume with it, and the mark is normally gone before the visitor leaves. An earlier core layer that throws stops the core before tll-place-wait-v1, so no mark is set (safe side). No `visibility:visible` rule or inline style on /stories that would undo the hide was found in the cached page or the core |
| Selector reach of the hide | `:is(.tll-lib-grid,.tll-library-grid)` matches one element on /stories (`tll-lib-grid w-dyn-items`); `.tll-library-grid-section` is a different class token and is not hidden |
| !important against Webflow | The grid's `visibility:hidden !important` exists only while html carries the mark; the card's !important applies only to the layer's own element. Neither reaches an element that Webflow interactions animate on the cached pages |
| Copy rules | Added text (layers, styles, tests, fix.md) and all six commit messages: no em dash, no exclamation mark outside `!important` and code, none of the banned words, US spelling. No member name, email or handle. Trailer lines exact in all six commits |

## 2. Result per note

| Note | Builder's claim | Review |
|---|---|---|
| 1 | card fixed on the home page | Holds (specificity and !important; Chromium figures not re-run here) |
| 2 | card unreachable without a preview flag; A01 page note wins | Holds. Informational: when the Paw Passport toys with `?qr=` are printed, every scanner loads all preview chunks, site-preview included; the card still cannot show from a QR visit alone (the key is set only by a gate click on /submit, /my-pets or /share-photos with site-preview loaded there) |
| 3 | grid held until the chip is pressed; CLS back to live with late scripts | Holds for "core and chunks late". Not for "page footer scripts late" (3.1) |
| 4 | place tags clip as live | Holds by code; browser counts not re-run here |
| 8 | eyebrows steady at 12px | Fix holds; "all five were affected" is a measurement artifact (3.2) |

## 3. Findings

### 3.1 Note 3: the core's 3 s counts from the chunk's load, but the replay counts from DOMContentLoaded (PLAUSIBLE, logic confirmed in the test DOM)

- src/site-layers/tll-place-wait-v1.js:20 (core src/site-layers/tll-site-layers-v16.js:1548): `c.addEventListener('load',function(){setTimeout(show,3000);})`.
- src/site-layers/tll-stories-places-v1.js:59 to 61: `run()` (and so `replay()`) waits for DOMContentLoaded while the page is still loading.
- On /stories the core and its chunks come from jsDelivr in the head, but the page ends with 22 blocking scripts from the Webflow
  CDN (jQuery, webflow.js, GSAP and the tll_* footer scripts, bytes 226,695 to 289,534 of the cached page), and the page's chip script
  tll-lib-chips-v1 also waits for DOMContentLoaded. When the stories chunk has run and those footer scripts are more than 3 s slower,
  the mark is taken off while the replay has not started: the 57 cards (parsed at byte 64k) show, then drop to the place's when
  DOMContentLoaded fires. That is the same shift note 3 was about. The builder's late test delayed the core and chunks, which is the
  opposite case.
- Shown with a scratch test (not committed) on the repo's test/mini-dom.js: readyState `loading`, chunk `load` at 0 s, chip script
  and DOMContentLoaded at 4 s. At 3 s: mark off, chip not pressed. At 4.5 s: chip pressed.
- Suggested change: start the 3 s at the later of the chunk's load and DOMContentLoaded, for example
  `c.addEventListener('load',function(){function t(){setTimeout(show,3000);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',t);else t();});`,
  and add a unit test with readyState `loading`. The 10 s cap stays.
- Related, minor: the replay gives up after 29 polls of 100 ms (about 2.9 s plus timer drift) and the core lets go at 3.0 s, so on a
  busy main thread a chip script that wires the grid at about 3 s can still be pressed after the grid is shown. A margin (3.5 s in
  the core) would close it.
- Not a hang: worst case the grid is blank for 10 s on a ?place= link when the chunk stalls with no load or error event. The grid is
  hidden with visibility, so its photos do not count for LCP until it shows.

### 3.2 Note 8: "all five /for-expats eyebrows were affected" is a measurement artifact (CONFIRMED from the harness code and the cached page)

- reports/evidence/sweep-2026-11-21/fix.md:98, and the builder's harness (scratchpad nov22/fix-notes/bcheck/bin/s4b.cjs lines 5 to 7),
  read `getComputedStyle(e).fontSize` of the outer `[data-tll-x=eyebrow]` element.
- The three that read 10px (THE DIRECTORY, the map's, WHAT A LOCATION EXPERT DOES) hold their text in a nested `<div>`; the two that
  read 12px hold the text directly. The page's tll-floor-js sets 12px inline on the element that holds the text, so it lifts the inner
  div and leaves the outer at 10px. On live the visible text of the two static nested eyebrows was already 12px; only the map's (drawn
  by tll-expats-map-v1 after window load) was really 10px, which is what the check's note 8 said.
- The fix is right and harmless; only the "before" column and the sentence "All five were affected, not only the map's" should say
  that the visible text of those two was already 12px.

### 3.3 fix.md says `node --test worker/test` passed (CONFIRMED)

- reports/evidence/sweep-2026-11-21/fix.md:89 (and the same row at :15): "node --test worker/test | 83 | 83, all pass". On Node 22.23
  that exact command fails ("Cannot find module .../worker/test"); the 83 come from `node --test worker/test/*.test.js`, as the
  builder's message says. The row should name the command that ran.

### 3.4 Not found

- No selector added since 1ef84ab reaches elements outside the pages it was written for.
- No added rule beats a Webflow interaction on an element the fix did not create.
- No file is missing from what tools/release-layers.sh would release.

## 4. Before release

1. Fix 3.1 (start the core's 3 s at DOMContentLoaded when the page is still loading), rebuild, add the unit test.
2. Correct fix.md rows for 3.2 and 3.3.
3. Notes 1, 2, 4 and 8 need nothing more. C13 and C14 still wait for Nancy; the card stays staged until C14 is answered.
