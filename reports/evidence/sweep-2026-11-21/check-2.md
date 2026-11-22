# Sweep of Nov 21: check 2 of claude/sweep-fixes-2026-11-21 (the Nov 22 follow-up)

Checked on Nov 22, 2026, at branch head f3bc3f49a25d59e083cfb2b50ee8fd8e5cb485a6, against the live core 16.68.0 (pin
0f04fabf403d5c61d1e1f4ff8d850c493a9de62f, "live") and against the head of the first check, 1ef84abb ("base"). The new head is "br".
The builder's report was not trusted; every number below was measured again here, in a clean worktree and in Chromium.
Nothing was written to Webflow, Memberstack, Cloudinary or the Worker; no form was sent; every non-GET in the browser was aborted.
No page HTML was fetched again (the plain-GET cache of Nov 21 was used) and 0 bytes came from Webflow or site hosts: the harness
copy fetches nothing that is not in the cache (it would answer a missing image with a 1x1 stand-in and abort anything else; the
counter stayed at 0 misses over every load). No member name, email or handle is in this file or in check-2/.

**Verdict: PASS WITH NOTES.** All five notes are resolved as the builder says, the rebuild is byte-equal, all tests pass, the page
signature against 1ef84abb changes only where these notes say it should, the site's code threw 0 page errors in 324 A/B loads plus 585 focus,
rerun and timing loads (the only page errors seen came from my own watcher, note 1), and CLS and FCP stay within the earlier limits on all 18 pages at 390 and 1440. The notes in section 6 do not
block the branch; note 1 there is about my own harness slip, which I corrected.

## 1. Build and tests

| Check | Result |
|---|---|
| Rebuild in a clean worktree at f3bc3f4 | core and all 27 chunk files byte-equal to the committed ones; worktree clean after the build |
| Core | 273,683 B, gzip -9 81,102 B (79.2 KB), sha384-zZQB/zsehgGnNd/jgQFu0T1AqScv35Wvg4rT533wLyECh6g4NFcOeANuIB6Qe25t (as the builder said; 1ef84ab: 272,423 B) |
| Chunks | site.js 23,692 B -> 20,588 B; new site-preview.js 23,839 B. site-preview.js is the old site.js with three lines changed: its header names site-preview, and the card's two CSS rules (section 4) |
| Loader | the site entry gains its preview pair ('site-preview' and its hash); the stories and stories-preview hashes change (the replay's shown()); nothing else in the loader changed |
| vitest | 844 passed in 72 files (1ef84ab: 827; +17 = 4 + 3 + 2 + 6 + 1 + 1, as listed) |
| Worker | `node --test worker/test/*.test.js`: 83 of 83. The bare `node --test worker/test` fails on node 22.23.5 (it tries to load the directory as a module), as the builder said |
| Commits | 6 commits on top of 1ef84ab, each with both trailer lines exactly as asked |
| Copy rules | no banned word, em dash or exclamation mark in the 550 added lines or in the commit messages |

## 2. Browser method

Harness: check-2/bin, a copy of check/bin (on this branch) extended to three variants. ab.cjs (A/B loads, page signature), bt2.cjs
(focus tests), an2.py and sum2.py (analysis), fcpx.cjs (a timing rerun). One Chromium at a time (one slip, see note 1). Top-frame HTML
from the plain-GET cache; the jsDelivr core and chunks answered from disk: live from git 0f04fabf, base from a worktree at 1ef84ab,
br from a clean worktree at f3bc3f4 (the core tag's integrity set to each variant's hash, as a release would do). Memberstack replaced
by a stand-in (signed out, or a made-up signed-in member with no name). The preview flag is a localStorage tll-preview-check key
(also ?preview= and ?qr= once each). 18 pages x 390 and 1440 x 3 variants x 3 loads = 324 loads, the variant order rotating per run.

## 3. Errors, CLS and FCP (medians of 3 loads; outliers re-run)

- Page errors: 0 in every variant on every page. Console errors: the same count in all three variants on every page (the same
  Turnstile and Worker lines). No new failed request; every non-GET (24 per variant on /account) was aborted in the browser.
- CLS, br against live: no page worse by more than 0.0019 (support 1440, 0.0015 -> 0.0034). /gallery 1440 is 0.0388 -> 0.0386 here;
  base drew the 0.0845 race this time (the pre-existing one the first check traced). /my-pets and /submit at 1440 sit at 0.83 and 0.78
  in all three variants, as before.
- FCP, br against live, first pass: within +30 ms except about 1440 (+124), support 390 (+116), account 1440 (+100), travelers 390
  (+80) and submit 1440 (+44). Re-run 9 more loads per variant (and 15 more for about, travelers and the Lisbon story at 1440):

| Page | Width | live | base | br (median ms, loads) |
|---|---|---|---|---|
| about | 1440 | 170 (24) | 158 (24) | 152 (24) |
| account | 1440 | 156 (9) | 140 (9) | 148 (9) |
| share-photos | 1440 | 136 (9) | 148 (9) | 152 (9) |
| Lisbon story | 1440 | 160 (24) | 174 (24) | 220 (24) |
| submit | 1440 | 136 (9) | 140 (9) | 136 (9) |
| support | 390 | 176 (9) | 172 (9) | 164 (9) |
| travelers | 390 | 156 (24) | 174 (24) | 156 (24) |

  The Lisbon story at 1440 looked slower on br in the rotating runs, which mixed three pages: the first load after a page change was
  slower in every variant, and br held that place more often. On that page alone, one warm-up load and 20 cycles (fcpx.cjs): FCP
  live 172, base 160, br 170 ms (means 185, 181, 177); domInteractive 246, 262, 250 ms; the core arrives at 37, 41, 39 ms. No
  difference. Nothing in this change runs on a story page apart from a path test in tll-place-wait-v1, and site.js is 3 KB smaller.

Per page, br against live (CLS after a full scroll; FCP from the first pass, before the re-runs above):

| Page | Width | CLS live | CLS base | CLS br | d | FCP live | FCP base | FCP br | d |
|---|---|---|---|---|---|---|---|---|---|
| / | 390 | 0.0777 | 0.0777 | 0.0777 | 0 | 268 | 212 | 240 | -28 |
| / | 1440 | 0.0005 | 0.0005 | 0.0005 | 0 | 252 | 252 | 264 | +12 |
| /stories | 390 | 0 | 0 | 0 | 0 | 416 | 500 | 360 | -56 |
| /stories | 1440 | 0.0304 | 0.0300 | 0.0299 | -0.0005 | 300 | 272 | 268 | -32 |
| Lisbon story | 390 | 0 | 0 | 0 | 0 | 244 | 144 | 164 | -80 |
| Lisbon story | 1440 | 0.0001 | 0.0001 | 0.0001 | 0 | 272 | 204 | 260 | -12 |
| Balkans story | 390 | 0 | 0 | 0 | 0 | 208 | 280 | 124 | -84 |
| Balkans story | 1440 | 0.0001 | 0.0001 | 0.0001 | 0 | 152 | 136 | 144 | -8 |
| /support | 390 | 0 | 0 | 0 | 0 | 136 | 180 | 252 | +116 (rerun -12) |
| /support | 1440 | 0.0015 | 0.0027 | 0.0034 | +0.0019 | 196 | 200 | 168 | -28 |
| /contact | 390 | 0 | 0 | 0 | 0 | 172 | 184 | 164 | -8 |
| /contact | 1440 | 0.0031 | 0.0016 | 0.0016 | -0.0015 | 244 | 184 | 180 | -64 |
| /about | 390 | 0 | 0 | 0 | 0 | 152 | 144 | 156 | +4 |
| /about | 1440 | 0.0006 | 0.0005 | 0.0005 | -0.0001 | 136 | 136 | 260 | +124 (rerun -18) |
| /for-expats | 390 | 0 | 0 | 0 | 0 | 172 | 192 | 176 | +4 |
| /for-expats | 1440 | 0.0003 | 0.0001 | 0.0001 | -0.0002 | 156 | 156 | 152 | -4 |
| /submit (in) | 390 | 0.0004 | 0.0004 | 0.0004 | 0 | 120 | 136 | 124 | +4 |
| /submit (in) | 1440 | 0.7833 | 0.7833 | 0.7833 | 0 | 128 | 136 | 172 | +44 (rerun 0) |
| /my-pets (in) | 390 | 0.0640 | 0.0640 | 0.0640 | 0 | 184 | 136 | 148 | -36 |
| /my-pets (in) | 1440 | 0.8302 | 0.8271 | 0.8269 | -0.0033 | 148 | 156 | 128 | -20 |
| /share-photos | 390 | 0 | 0 | 0 | 0 | 136 | 156 | 156 | +20 |
| /share-photos | 1440 | 0.0006 | 0.0002 | 0.0007 | +0.0001 | 164 | 136 | 176 | +12 (rerun +16) |
| 404 page | 390 | 0 | 0 | 0 | 0 | 148 | 176 | 148 | 0 |
| 404 page | 1440 | 0.0028 | 0.0027 | 0.0025 | -0.0003 | 160 | 176 | 188 | +28 |
| /the-map | 390 | 0.0853 | 0.0853 | 0.0853 | 0 | 144 | 164 | 144 | 0 |
| /the-map | 1440 | 0.0110 | 0.0110 | 0.0110 | 0 | 192 | 172 | 184 | -8 |
| /account (in) | 390 | 0.1834 | 0.1804 | 0.1804 | -0.0030 | 140 | 180 | 140 | 0 |
| /account (in) | 1440 | 0.1176 | 0.1178 | 0.1178 | +0.0002 | 164 | 124 | 264 | +100 (rerun -8) |
| /travelers | 390 | 0.0088 | 0.0120 | 0.0059 | -0.0029 | 140 | 188 | 220 | +80 (rerun 0) |
| /travelers | 1440 | 0.0069 | 0.0046 | 0.0080 | +0.0011 | 188 | 184 | 152 | -36 |
| profile | 390 | 0.0001 | 0.0001 | 0.0001 | 0 | 200 | 168 | 140 | -60 |
| profile | 1440 | 0.0008 | 0.0008 | 0.0008 | 0 | 148 | 152 | 176 | +28 |
| /gallery | 390 | 0 | 0 | 0 | 0 | 136 | 140 | 148 | +12 |
| /gallery | 1440 | 0.0388 | 0.0845 | 0.0386 | -0.0002 | 140 | 148 | 152 | +12 |
| /the-paw-passport | 390 | 0 | 0 | 0 | 0 | 180 | 188 | 176 | -4 |
| /the-paw-passport | 1440 | 0.0083 | 0.0080 | 0.0080 | -0.0003 | 172 | 196 | 176 | +4 |

## 4. Page equality against 1ef84abb (no preview flag)

Same signature as the first check (box, font size and family, weight, colors, radius, border, min-height, own text, role, tabindex,
for; an element counts only when all 3 loads of each variant agree and the two variants differ). Over the 36 page and width pairs:

- /stories 390 and 1440: 55 and 56 .tll-lib-meta boxes (and 2 spans in them) change size; no style, text or attribute changes in the
  signature (letter-spacing is not in it). That is note 4.
- /for-expats 390 and 1440: 3 eyebrow divs go from 10px to 12px in every load; nothing else. That is note 8.
- The other 32 pairs: no stable difference at all. No element present in one variant only, on any page.

## 5. Per note

| Note | Verdict | Measured |
|---|---|---|
| 1, A08 card on the home page | PASS | With the flag, signed in, key set: on /, /account, /stories, /the-map and /about at 390 and 1440 the card is position fixed, z-index 2147483000, 16 px from the right and 16 px from the bottom (on /account at 1440: 76 px, above the pill), in view and on top (elementFromPoint at its left edge is the card) at the top, the middle and the foot of the page, overlapping no other fixed element. base on /: position relative, z-index 2, at x -16, 13,597 px below the fold at 390 (the first check's finding, reproduced). /account at 960: fixed, bottom 76. Also ?preview= on / 390 and ?qr= on /stories 1440: fixed 16/16. The link goes back to /submit and clears the key; the close button clears it and removes the card; 31 minutes old, signed out, or Memberstack blocked: no card, no error |
| 2, A08 staged (C14) | PASS | Without the flag, signed in with a key set, on the same 10 page and width pairs: live and br both load site.js, show no card, add no card style, and leave the key in sessionStorage untouched (equal to live). Gate click on /submit 390, /my-pets 1440, /share-photos 390 without the flag: live stores no key, base stores it, br stores none (sessionStorage keys equal to live). With the flag the same clicks store the key (site-preview.js plus the page's preview chunk), and the nav Log in link stores nothing. Any preview flag now loads site-preview.js instead of site.js, which is site.js plus this layer |
| 2, A01 (C13) | PASS | /stories?q=zzqx at 390, 2 loads each and once with the scripts 3 s late: base and br show the page's own note ("No stories match ..."), data-s3 set, no data-tll-si, the layer's fallback never shown; live shows its own layer's note, as the first check found |
| 3, A12 ?place= with late scripts | PASS | Core and chunks 3 s late, /stories?place=Europe: 390 CLS live 0.2569, base 0.2569, br 0.2569 in 5 of 5 loads each (and 3 more of br); 1440 live 0.1374 in 5 of 5, base 0.1374 in 4 and 0.0924 in 1, br 0.1374 in 5 of 5 (and 2 more). End state on br: Europe pressed, 14 cards, grid visible, mark gone. ?place=Asia late at 390: base 0.5179 in 3 of 3, br 0.2569 in 3 of 3 plus 2, equal to live. The mark goes on at about 3.05 s (with the core) and off at 6.08 to 6.09 s, as the chip is pressed. Normal speed ?place=Europe: 390 CLS 0 in all variants; 1440 live 0.0307, br 0.0302 to 0.0308 (5 loads). Without ?place=, with ?place=Nowhere: no mark, nothing changes. ?place=europe, ?place=Middle East, ?q=lisbon&place=Europe: pressed, 14, 1 and 2 cards. All chunks blocked or the stories chunk blocked: mark off within 0.2 s, 57 cards, no error. Page chip script missing: mark off after 3.2 s, 57 cards (section 6, note 2). With the flag (stories-preview.js) late: same as without. Slow network (300 ms, 200 KB/s, CPU x4): live 0.0124, br 0.0133, Europe pressed |
| 4, A14 place tags | PASS | /stories, every text run clipped, spilled or off screen (3 loads each at 390, 2 at 1440): 390 live 63, base 67, br 63; 1440 live 57, base 58, br 57. The clipped .tll-lib-meta tags of 57: 390 live 2, base 6, br 2; 1440 live 1, base 2, br 1. The br list is the same set of elements as live's at both widths (no new clipping; the rest are the long card titles and five tll-shelf-chip links, equal in all variants). The tags are 12 px with letter-spacing 1px on br (live 10 px and 2px) |
| 8, /for-expats eyebrow | PASS | The five [data-tll-x=eyebrow] elements: br 12, 12, 12, 12, 12 px in all 4 loads at 390, all 4 at 1440 and both loads with the scripts 3 s late. live and base were 12, 10, 10, 10, 12 px in every one of those loads (the map's is one of the 10s) |

## 6. Notes

1. **My harness slip, corrected.** At 12:45 UTC a `node -e "require(...bt2.cjs)"` syntax check ran the focus script's main (its main
   was not yet guarded), so a second Chromium ran for about 40 seconds next to the A/B run (5 focus loads). I stopped it at once,
   deleted those 5 rows, guarded the main, and dropped and re-ran the 15 A/B rows that were loading at that time (/stories 390 and
   1440, both stories at 390 and 1440, run 0; the dropped rows are kept in check-2/results/ab-overlap-dropped.jsonl). Every number
   in this file comes from loads that ran alone. The first focus watcher for note 3 also failed in my harness (it observed
   documentElement before it existed, which logged 2 page errors from the init script in every one of those /stories loads, in all
   variants, 70 rows); the CLS and end state of those rows stand, and the mark times above come from the corrected rerun (N3b rows, 0 errors).
2. **The grid is hidden while a ?place= replay waits.** That is the fix, and it costs no CLS, but a shared ?place= link now shows an
   empty grid area for a moment: about 0.45 to 0.5 s at normal speed (mark on at 0.1 to 0.33 s, off at 0.54 to 0.84 s), about 3 s
   when the scripts come 3 s late, and 3.2 s before all 57 cards show if the page's chip script is missing. Plain /stories and an
   unknown place are untouched. Worth knowing for LCP on shared place links; not a reason to hold the branch.
3. **Preview testers.** Any page with ?preview=, ?qr= or a tll-preview-* key now loads site-preview.js in place of site.js. I compared
   the two files: site-preview.js carries every public site layer unchanged plus tll-gate-return-v1, so testers lose nothing.
4. **Small wording point.** The tll-place-wait-v1 header says it "runs in the head right after the chunk loader"; in the core it runs
   after the other core layers, in the same synchronous core script, so the chunk's script tag is already there when it looks. The
   behavior is as described; the wording is slightly loose.
5. The bare `node --test worker/test` in the house test line fails on this node (22.23.5); the glob form passes 83 of 83. A test
   script in package.json, or the glob in the house notes, would avoid the mismatch.

## 7. Files

- check-2/bin: ab.cjs (A/B, three variants, nothing fetched), bt2.cjs (focus tests), an2.py, sum2.py, show-bt2.py, fcpx.cjs
- check-2/results: ab.jsonl (324 loads), ab-overlap-dropped.jsonl (the 15 rows dropped in note 1), bt2.jsonl (focus tests; N3b
  replaces the watcher of the N3 rows), fcp2.jsonl and fcp3.jsonl (FCP re-runs), fcpx.jsonl (the Lisbon timing run), summary.json
  (perf, errors, page-equality counts by element class; no page text), net.json (0 bytes fetched, 0 cache misses)
