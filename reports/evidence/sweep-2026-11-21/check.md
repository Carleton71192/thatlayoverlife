# Sweep of Nov 21: independent check of claude/sweep-fixes-2026-11-21

Checked on Nov 22, 2026, at branch head 1ef84abb4d359a2db9a2a18dc9e4133f34ce6b6d against the live core 16.68.0 (pin
0f04fabf403d5c61d1e1f4ff8d850c493a9de62f). The builder's report was not trusted; every number below was measured again here.
Nothing was written to Webflow, Memberstack, Cloudinary or the Worker; no form was sent; every non-GET in the browser was aborted.
No page HTML was fetched again (the plain-GET cache of Nov 21 was used); 0 bytes came from Webflow hosts (all assets were already in
the shared cache). No member name, email or handle is in this file or in check/.

**Verdict: PASS WITH NOTES.** Every class A fix does what it claims, the rebuild is byte-equal, all tests pass, no new page or console
error appeared in 216 A/B loads plus 59 break tests, and no page got worse in CLS or FCP beyond the limits because of a fix. Two notes
should be dealt with before this goes out: A08's card is broken on the home page, and A08's card is in the public site chunk while
its words still wait for Nancy (class-c C14).

## 1. Build and tests

| Check | Result |
|---|---|
| Rebuild in a clean worktree at 1ef84ab | core and all 26 chunk files byte-equal to the committed ones |
| Core | 272,423 B, gzip -9 80,697 B, sha384-rX6JpX+ziDO8ce0A32rdwa+F2hX4IyqAQ8eXNR648g+BpItDm62qGyZxty1TxIFF (live 16.68.0: 277,485 B, its sha matches the live tag) |
| Core styles | the 12 unchanged styles are equal to live once comments are taken out (whitespace-insensitive); only tll-buttons-v1 changed and tll-sweep-1121-v1 is new; the layer code after the styles is byte-equal |
| Loader | only the rules changed, plus `if(!g)continue;`; simulated: /countries/x loads site only, with ?preview= or a tll-preview-* key it loads countries-preview; /spotlight?qr=1 loads misc-preview |
| vitest | 827 passed in 72 files (base fae9bb6: 759 in 63, as the builder said) |
| node --test worker/test | 83 of 83 |
| Public chunks | 501,410 B to 421,060 B in total (80,350 B less; site.js grew 3,694 B for A08 and A11). Per page: /stories 324,162 to 313,677 B of core plus chunks, a story 328,085 to 309,474 B, /for-expats 318,314 to 306,697 B |
| Moved layers still self-gate | tll-series-v1 (ROUTES_LIVE false), tll-pros-v1 (ROUTE_LIVE false); tll-open-slots-v1 only serves /spotlight, which answers 301 |
| A21 tool | rerun on the cached HTML: all 16 saved files byte-equal; template pages refused; its /login footer split equals src/pages/auth/au3-footer-block.html except a trailing newline the tool adds (the "byte for byte" in fix.md is off by that newline) |
| Copy rules | no banned word, em dash or exclamation mark in the added layer code, styles, tests or the builder's reports (the saved live page code in src/pages/live-2026-11-21 carries the live page wording as is, see note 7) |

## 2. Browser method

Harness: check/bin/ab.cjs (A/B), bt.cjs (behavior and break tests), ov.cjs (text clipping), an.py (analysis). One Chromium at a
time. Top-frame HTML from the plain-GET cache; the jsDelivr core and chunks answered from disk: "live" from git 0f04fabf, "branch"
from the worktree (the core tag's integrity set to the branch hash, as a release would do). Memberstack replaced by a stand-in
(signed out, or a made-up signed-in member). 18 pages x 390 and 1440 x 2 variants x 3 loads = 216 loads, interleaved live and branch.
Each load: CLS at load + 4 s and after a full scroll, FCP, page and console errors, the fix measures, and a signature of every visible
element (box, font size and family, weight, color, background, radius, border, min-height, own text, role, tabindex, for). The page
equality check flags an element only when all 3 live loads agree, all 3 branch loads agree, and they differ.

Pages: /, /stories, two stories (Lisbon, Balkans), /support, /contact, /about, /for-expats, /submit and /my-pets (signed in),
/share-photos, the 404 page, /the-map, /account (signed in), /travelers, the profile linked from the Lisbon story
(/contributors/<profile>), /gallery, /the-paw-passport.

## 3. Errors, CLS and FCP (medians of 3 loads; flagged pages re-run 9 to 21 times)

- Page errors: 0 live, 0 branch, on every page. Console errors: equal counts on every page (the same Turnstile and Worker lines).
  No new failed request. 0 non-GET left the browser.
- CLS: no page worse by more than 0.01 because of a fix. One page crossed the line in the median: /gallery at 1440 (0.0323 to 0.0845).
  Traced: in both variants the same two shifts happen (the nav logo row when the fonts land, and the gallery grid at
  inline-div-10 moving from y 433 to 503). When they land in one frame the score is 0.0843; in two frames 0.0203 + 0.0181. Over 9
  loads each: live 3 of 9 at 0.0845, branch 6 of 9. Same shifts, same elements, no element of this branch involved; the branch core
  arrives a little sooner, so the two coincide more often. Pre-existing race, not a regression of a fix (it is worth fixing on the
  page: reserve the grid's height).
- Other CLS deltas: account 390 -0.014, home 1440 +0.0029 (one scroll-time footer shift of 0.316 in 1 branch load; 0.215 once in a
  live load at 390), travelers +0.003, support 1440 +0.0012, my-pets 1440 +0.0027 (0.83 in both: pre-existing, the signed-in
  /my-pets and /submit at 1440 shift 0.78 to 0.83 on live too).
- FCP: every page within +30 ms in the median. First-pass outliers re-run: share-photos 1440 (+116 in 3 loads) is +0 over 9;
  the-paw-passport 1440 (+80) is -8 over 21; Lisbon 390 (+40) is +6 over 12 more and +28 over 21; Balkans 390 is -4 over 15. The
  harness's FCP spread is about 100 ms between loads of the same variant.

## 4. Per fix

| Fix | Verdict | Measured (live -> branch) |
|---|---|---|
| A01 /stories empty search | PASS | ?q=zzqx: live note "Nothing … yet … Yours could be the first. See all stories" (the banned verb); branch keeps the page's own note "No stories match “zzqx” yet. Share your story → / Clear the search". ?q=lisbon: no note, 2 cards, equal. The fallback (only without the page note) is covered by unit tests; its words wait for C13 |
| A02 /support email at 390 | PASS | em 40px, 396px wide in a 342px column -> 28px, 274px; scrollWidth 390; 1440 unchanged at 40px |
| A03 .tll-cta-ghost-dark | PASS | cream on teal 2.59:1, 999px pill, 13px -> ink outline 16.37:1 (/contact) and 17.86:1 (/support), square, 48px, 16px |
| A04 closing headings | PASS | /stories and /contact h3 at 390: 16.32px -> 26px; 1440 unchanged (32px on /stories); /stories rose word 3.07:1 -> 4.64:1. /contact has one such h3, so no other card grew |
| A05 /about buttons, cite, list | PASS | radius 8px, weight 700, "IBM Plex Sans" (not loaded) -> 0px, 600, Plex Sans Condensed, 48px; cite and list now Plex Sans Condensed. The filled button moves from #C8325B (5.17:1) to the set's #D63859 (4.60:1, still AA at 16px 600) |
| A06 /submit and /my-pets form text | PASS, note 5 | help 4.97 -> 7.67:1, help text 3.57 -> 7.67:1 (italic 300 -> normal 400), legend 3.35 -> 5.06:1, status 4.17 -> 7.58:1, placeholder 3.49 -> 5.42:1, labels 12.48 -> 13.5px |
| A07 /for-expats labels | PASS | empty for="": 7 -> 0, each now names its own field; clicking the consent sentence: live does not tick, branch ticks (both forms); checkbox names "(no name)" -> the consent sentences; fields with a label 9 -> 14 of 14. Break: inputs without ids -> left alone, no error; with core and chunks 3 s late it still ticks |
| A08 gate return card | PASS WITH NOTE (notes 1, 2) | Click on the page gate's Log in link: key stored on /submit, /my-pets, /share-photos (live: none); the nav's Log in link stores nothing. Signed in with the key: card on /account 1440 at x 1214 to 1424, y 770 to 824, above the moved pill (y 840), no overlap with any fixed element; on /account 390 and /stories 390 bottom right, clear of the pill. The link goes back and clears the key; × clears it; 31 minutes old, signed out, bad JSON, or Memberstack blocked: no card, no error. **On the home page the card is not fixed**: the home page's parallax rule `.tllp-home :has(> img[data-tll-parallax="hero"]) ~ *` sets position:relative with more weight than `.tll-gate-back`, so the card sits at the foot of the page at x -16 (390 and 1440) |
| A09 /account pill | PASS | 1440: pill x 16 -> 1286; at 960 and 1440 the opened note card stays in view (x 584 to 944 at 960; 1064 to 1424 at 1440); 390 unchanged |
| A10 44px targets | PASS | nav Share your story 40 -> 44px on touch at 390 (Sign up was 44); Save for later 26 -> 44px; /travelers link chips 32 -> 44px; /for-expats country field 35 -> 44px on touch, 35px with a mouse (as written) |
| A11 byline tab stops | PASS | real Tab walk: 3 stops a card (card, byline row, name) -> 2 (card, name), at 390 and 1440; byline rows with role or tabindex 57 -> 0 |
| A12 ?place= | PASS, note 3 | Asia chip -> ?place=Asia, 11 cards; All places -> no param, 57; history length unchanged. Load ?place=Europe: live ignores it (57), branch presses Europe (14). ?place=europe (lower case) works; ?place=Nowhere and ?place=all leave All; ?q=lisbon&place=Europe gives 2; an HTML payload in place does nothing; the page chip script missing -> gives up quietly |
| A13 button set | PASS | 404: two cream fills and a ghost -> one rose fill (4.60:1) and two cream outlines; /submit step button 999px mono uppercase -> square Plex 48px; /the-map: teal pill (5.16:1) and a 9px rose button -> square rose 48px (4.60:1); /account Download everything 4px 15px -> square 48px 16px; /for-expats data-tll-btn pair 7px DM Sans 700 -> set, FIND 24px mono -> Plex 44px |
| A14 12px mono floor | PASS, note 4 | /stories meta 10 -> 12, read 10.5 -> 12, filter label 10.5 -> 12; /account dt 8.5 -> 12, no dt overflow; /the-map card labels 9 to 11 -> 12; /gallery credits 9.5/10 -> 12; profile, 404, /the-paw-passport, /about eyebrows 10 to 11 -> 12 |
| A15 album tape | PASS | second line nowrap, 177px in a 129px tape -> wraps, 112px in 130px (1440) and 142px in 160px (390); 12px |
| A16 byline dot | PASS | places on their own line: 17 of 57 at 390, 6 of 57 at 1440; with a leading dot 17 -> 0 and 6 -> 0; all marked |
| A17 SAMPLE MAP banner | PASS | #tllm-sample "IBM Plex Sans" (not loaded) -> Plex Sans Condensed at 390 and 1440; the label stays mono 12px |
| A18 staged layers out of public chunks | PASS | public chunk files 80,350 B lighter in total (the builder's 63.3 KB counted less); countries has no public file and loads only with a preview flag; ?preview=wire on /stories loads stories-preview; series and pros still send no request without it |
| A19 open slots, home value header | PASS | open slots now misc-preview only; /spotlight answers 301, so nothing public changes; the header text matches PUBLIC=true |
| A20 archive move | PASS | 36 renames, no content change; build output equal |
| A21 page code splitter | PASS | see section 1 |
| defrag: comments out of core styles | PASS | section 1: 12 styles equal to live without comments; the core 5,062 B smaller with every fix in |

The page-equality signature found no change outside these fixes on any of the 36 page and width pairs: every stable difference is a
fix above (or its knock-on: boxes below a resized element move). Elements present in one variant only: none, apart from the
/for-expats reveal class (timing). The home page's rotating cards differ load to load in both variants.

## 5. Break tests (check/results/bt.jsonl, bt-gate.jsonl)

- Slow network (300 ms, 200 KB/s, CPU x4) on /stories?place=Europe, /for-expats, /account, /submit: 0 errors both variants; CLS
  equal or lower on the branch (/stories 0.0133 -> 0.0061, /account 0.1596 -> 0.1151); the place filter still applies.
- Chunks blocked (core only) on /stories, /for-expats, /account, /submit, /support: 0 page errors; the core styles still apply.
- Core and chunks 3 s late: /for-expats labels still fixed; /stories?place=Asia filters, but late (note 3).
- Missing markup: no page chip script, inputs without ids, Memberstack script blocked, no gate key, bad gate key: all quiet, no error.

## 6. Notes

1. **A08 on the home page (fix before release).** `.tll-gate-back` (0,1,0) loses to the home parallax rule (0,2,1), so the card is
   position:relative and lands at the foot of the page, 16px off the left edge. A member who signs up from a gate and lands on the
   home page does not see it. Suggested: write the rule as `html body #tll-gate-back.tll-gate-back{position:fixed !important;...}`
   (or add `!important` to position), rebuild, and add a home check. Seen only on the home page among /, /account, /stories,
   /the-map and /about.
2. **A08 words before release.** The card is in the public site chunk, so the moment this core is pinned every member who signs in
   from a gate sees "Back to your story / pets / photos". class-c C14 still asks Nancy about those words. Either wait for her answer
   or move tll-gate-return-v1 to the staged list until then. A01's fallback (C13) is public too, but only shows when the page note
   is missing, which did not happen in any load here.
3. **A12 with late scripts.** When the core and chunks arrive 3 s late, a shared ?place= link first paints all 57 cards and then
   drops to 11: CLS 0.26 (live, which ignores the param) -> 0.52 (branch). At normal speed the CLS is equal to live (0.0304).
   Only shared links with a place are affected. A small guard (hide the grid while a ?place= is pending, up to the 3 s the replay
   already waits) would remove it.
4. **A14 clips 4 more place tags on /stories at 390.** `.tll-lib-meta` keeps letter-spacing 2px and nowrap with an ellipsis; at
   12px four more card tags end in "…" (for example SAGARMATHA NATIONAL PARK, KING GEORGE ISLAND, ANTA…). 63 clipped text runs ->
   67. Suggested: letter-spacing 1px at the 12px size on that class.
5. **A06 side effect on /my-pets.** Four field labels there are h6.tll-pen-label at 16px Plex Sans Condensed 700 (Countries crossed
   together, Instagram @, TikTok @, Strava); the 13.5px label rule makes them 13.5px. Consistent with the other labels, but a
   change fix.md does not mention.
6. **fix.md numbers that did not reproduce exactly:** the /the-map rose button was already #D63859 (4.60:1), not #F0507A at 3.07:1;
   the public chunks are 80,350 B lighter, not 63.3 KB; the /login footer split differs from au3-footer-block.html by one trailing
   newline. None changes a verdict.
7. **Outside this branch, seen in passing:** the live /destinations page code (now saved in src/pages/live-2026-11-21) prints "The
   other N are open until someone …" with the banned verb, and the live /stories page code still holds a fallback note with it
   (not shown here, because the data-s3 note wins). Proposals only; no Webflow writes.
8. The /for-expats map eyebrow (data-tll-x=eyebrow, 10px in the page CSS) is lifted to 12px by the page's tll-floor-js only when the
   map draws before window load; it was 12px or 10px in different loads of both variants. Adding `[data-tll-x=eyebrow]` to the A14
   list would make it steady.

## 7. Files

- check/bin: ab.cjs, bt.cjs, ov.cjs, an.py
- check/results: ab.jsonl (216 loads), extra.jsonl and fcp.jsonl (re-runs), bt.jsonl and bt-gate.jsonl (behavior and break
  tests; bt-gate replaces the three "A08 gate click" rows of bt.jsonl, whose first version clicked the nav link), an-summary.json
  (perf, errors, measures, page-equality counts; page text left out), ov-summary.json (clipping, text left out)
