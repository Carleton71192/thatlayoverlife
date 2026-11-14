# Fix C: writer avatar sized in the head (14 Nov 2026)

Author report.

The E2 fix is built, committed and pushed. At 390 it removes the 0.32 shift: 0 bad runs in 40 loads with my build, against 13 of 40 on the live 16.64.0 core. 1440 does not change, and the finished page is identical on both cores.

Branch: claude/fix-story-first-frame-c-2026-11-14 (from claude/new-session-zxm063). It is pushed to origin and the push worked on the first try.
Commit: fd2d88fc93480be1ff349b133513fdbe6825198d

Diff summary (4 files, 129 insertions, 2 deletions, all in src/site-layers plus one test):
- New core layer src/site-layers/tll-story-avatar-v1.js (21 lines). It runs at head time and only when html[data-wf-page] is 6a0b29eedc14f1444e935766. It adds one style, style#tll-story-avatar-v1 (it skips if that style already exists):
  .st3-author-avatar{flex:none;width:40px;height:40px;overflow:hidden;box-sizing:border-box}.st3-author-img{display:block;width:100%;height:100%;object-fit:cover}
  - These are the template's own selectors and values from page-footer.after.html. The specificity is the same as the template's, and the template's end-of-body style comes later, so it still wins every tie.
  - The magazine 44px hero avatar rule (0,2,0) still wins over it.
  - The ring, colour and round corners stay with the template.
  - It sets no observer and no listeners, and touches no markup.
- src/site-layers/build-site-layers-v16.py (+7/-2): the layer is added to SCRIPTS and CORE right after tll-library-hold-v1, with a "why in core" note and a history line in the docstring.
- src/site-layers/tll-site-layers-v16.js rebuilt (+10).
  - Before the change, the rebuild reproduced the pinned core byte for byte: SRI m7ORNX..., the same as pin 6ec769bb.
  - The new core SRI is sha384-180VQ9oHNMXpDAkum2I2Yms9JgHhJ+qk0EcvE3thD72bw5yEJRRFEvjChFF2wasT.
  - No chunk changed.
- New test test/story-avatar-layer.test.js (8 tests). They check:
  - the style is added once, only on the Stories Template;
  - the selectors and every declaration equal the template's rules, parsed from page-footer.after.html;
  - the magazine 44px rule is still present;
  - the build registers the layer after library-hold, and the core carries it once, before the story layer;
  - there is no page-parsed wait or observer, and no em dashes or exclamation marks in its comments.

Tests: the full suite passes, 57 files and 560 tests.

Measurements (the harness's libx.cjs used from cls390 by absolute path; driver scratchpad/nov14/c/run.cjs):
- Page: story /stories/spain-madrid-wedding-ibiza, test-site HTML (16.64.0) served at the www address, fresh loads.
- Phone 390x844 at DPR 3; desktop 1440x900.
- Live and build were alternated in every iteration. Both cores were served the same way, at the pin URL, by a route registered after the harness route: live is `git show` of pin 6ec769bb, build is my worktree core.
- The page's SRI was set to the served core's hash (unchanged for live).
- "Delayed" holds only the hero photo (matched by its CMS id) for 1.5 s. Every other Webflow file, including the avatar, comes instantly from the cache.
- CLS is the total of all layout-shift entries over 4 s after load, the same method as the diagnosis. In this harness every entry reports hadRecentInput true, on both cores. LCP is the last largest-contentful-paint entry, which was the hero img in every run.

| width | hero photo | core | loads | bad (CLS > 0.1) | CLS median | CLS max | LCP median ms | LCP p75 ms |
|---|---|---|---|---|---|---|---|---|
| 390 | instant | live 16.64.0 | 30 | 9 (30 %) | 0.0538 | 0.3577 | 366 | 420 |
| 390 | instant | build | 30 | 0 (0 %) | 0.0402 | 0.0800 | 354 | 380 |
| 390 | held 1.5 s | live 16.64.0 | 10 | 4 (40 %) | 0.0539 | 0.3585 | 1668 | 1704 |
| 390 | held 1.5 s | build | 10 | 0 (0 %) | 0.0473 | 0.0798 | 1656 | 1676 |
| 1440 | instant | live 16.64.0 | 30 | 0 (0 %) | 0.0125 | 0.0153 | 342 | 428 |
| 1440 | instant | build | 30 | 0 (0 %) | 0.0126 | 0.0154 | 360 | 448 |
| 1440 | held 1.5 s | live 16.64.0 | 10 | 0 (0 %) | 0.0140 | 0.0158 | 1654 | 1668 |
| 1440 | held 1.5 s | build | 10 | 0 (0 %) | 0.0126 | 0.0154 | 1642 | 1656 |

CLS per run:
- 390 instant, live: 0.0149 0.0540 0.0402 0.3429 0.3577 0.0392 0.3577 0.0540 0.3577 0.0402 0.3577 0.0538 0.0540 0.3429 0.0538 0.0402 0.0397 0.0392 0.0538 0.3577 0.0538 0.3464 0.3577 0.0426 0.0538 0.0539 0.0538 0.0396 0.0396 0.0391
- 390 instant, build: 0.0249 0.0402 0.0648 0.0392 0.0392 0.0797 0.0538 0.0797 0.0392 0.0648 0.0392 0.0402 0.0653 0.0000 0.0653 0.0402 0.0538 0.0398 0.0797 0.0797 0.0399 0.0389 0.0653 0.0658 0.0389 0.0391 0.0401 0.0400 0.0000 0.0800
- 390 held, live: 0.3428 0.0538 0.3577 0.3585 0.0249 0.3466 0.0539 0.0539 0.0402 0.0392
- 390 held, build: 0.0653 0.0407 0.0539 0.0798 0.0392 0.0400 0.0402 0.0798 0.0541 0.0399
- 1440 instant, live: 0.0127 0.0144 0.0153 0.0126 0.0126 0.0144 0.0097 0.0148 0.0148 0.0097 0.0126 0.0106 0.0136 0.0123 0.0127 0.0097 0.0094 0.0096 0.0124 0.0153 0.0103 0.0127 0.0094 0.0097 0.0098 0.0097 0.0094 0.0145 0.0144 0.0098
- 1440 instant, build: 0.0106 0.0136 0.0097 0.0128 0.0126 0.0148 0.0097 0.0098 0.0127 0.0094 0.0126 0.0123 0.0107 0.0094 0.0123 0.0127 0.0107 0.0123 0.0126 0.0148 0.0147 0.0148 0.0136 0.0148 0.0127 0.0148 0.0144 0.0154 0.0123 0.0094
- 1440 held, live: 0.0123 0.0132 0.0158 0.0149 0.0153 0.0139 0.0140 0.0136 0.0145 0.0115
- 1440 held, build: 0.0124 0.0127 0.0110 0.0128 0.0000 0.0154 0.0147 0.0123 0.0098 0.0154

Notes:
- Every live bad run has the diagnosis entry: 0.31793 from #tll-main, .tll-rv and .st3-author-text. None of the 80 build loads has an entry over 0.1.
- Some build runs at 390 are 0.065 to 0.080, against 0.04 to 0.054 for good live runs. This is the remaining meta-row and magazine-switch shift the diagnosis describes, and E2 measured the same (median 0.040, max 0.080). The E2 avatar rule does not fix that part.
- The finished page is the same on both cores. At each width and hold, every load of both cores gave the same layout hash over all visible body elements, and the same computed styles for the avatar and its img (44x44 in the magazine byline).
- Every live load ran the pinned core without the new style, and every build load ran the build with it. The core was served once per load.
- LCP shows no regression: the medians are within about 18 ms either way, inside the run-to-run spread.
- Bandwidth and safety:
  - 160 loads fetched 0 bytes from Webflow and 0 from jsDelivr.
  - 2,403 non-GET requests were aborted.
  - No page errors.
  - The only failed script is Google's fundingchoices consent script (ERR_BLOCKED_BY_ORB), on both cores.
- No Webflow calls, no publish, no layers-release push, no jsDelivr release.
- Disk had 6.9G free before every batch.
- Data kept is about 368K, in scratchpad/nov14/c/:
  - m-390-0.jsonl, m-390-1500.jsonl, m-1440-0.jsonl, m-1440-1500.jsonl
  - batch.log
  - analysis script an.py
  - core-live.js
  - No traces or screenshots were kept.
- The worktree has an untracked node_modules symlink to /home/user/thatlayoverlife/node_modules. It was not committed.
