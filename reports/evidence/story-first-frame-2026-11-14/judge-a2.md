# Judge: A2 vs live vs C (14 Nov 2026)

RECOMMEND A2

A2 should replace C. My own loads show that both of the judge's breakages are gone. In 465 measured loads (510 with the observer audit), no A2 load on any saved story went over 0.1. A2 never shows the template's own values in the wrong place on the finished page, and a template edit, whether a changed value or a deleted rule, wins as it does on live. The leftovers listed below are all smaller than what live and C do on the same pages. None of them blocks a release, but two are worth a follow-up. Nothing was merged or pushed, and nothing was published.

**Checks**
- I checked out origin/claude/fix-story-first-frame-a2-2026-11-14 at 73ab244 in a temporary worktree. The worktree, its node_modules symlink and the core copies have been removed.
- **Diff against A (4fec1d8):** 3 files, +387/-81, only in the build script, the core and test/story-first-frame-layer.test.js.
- **Diff against claude/new-session-zxm063:** the same 3 files (three-dot diff, +569/-7). It merges cleanly; `git merge-tree` showed no conflicts. The two-dot diff also shows judge.md, fix-c.md and the when-home lines. Those are only commits on new-session since the branch point, not changes in A2.
- **Tests:** 57 files and 579 tests pass.
- **Rebuild:** the build script reproduces the committed core byte for byte (worktree clean).
- **The report's SRI is wrong.** The core at head 73ab244 is sha384-lCTj52h4CPjzkOy2Ls4A5XdnVYwEqHFIXJYewsQbjZB2jarPkrzxWG+vqRINw9l8. The value in the report, sha384-1m/Pmn2jy/..., belongs to the earlier commit f0723dc. Use the lCTj52h4 value at release.

**Method**
- The judge's adv.cjs, copied unchanged into nov14/a2judge/. I only added the core names, the extra cases, final-page checks, and an optional MutationObserver audit used only in the separate observer runs.
- Harness libx.cjs from cls390, used by absolute path. 16.64.0 test HTML served at the www address.
- Cores rotated every iteration: live (pin 6ec769bb), C (fd2d88f) and A2 (73ab244).
- CLS, off frames and tall writer photo are defined as in judge.md.

**Table (my numbers)**

| case | core | loads | bad >0.1 | CLS median | CLS max | LCP median ms | FCP median ms | off frames (median) | tall writer photo (loads) |
|---|---|---|---|---|---|---|---|---|---|
| story 390 instant | live | 20 | 7 | 0.0471 | 0.3576 | 378 | 208 | 3 | 16 |
| | C | 20 | 0 | 0.0470 | 0.0798 | 374 | 196 | 2.5 | 0 |
| | A2 | 20 | 0 | 0.0034 | 0.0070 | 238 | 228 | 0 | 0 |
| story 390, photo held 1.5 s | live | 10 | 4 | 0.0540 | 0.3585 | 1666 | 208 | 3 | 10 |
| | C | 10 | 0 | 0.0539 | 0.0798 | 1668 | 212 | 2 | 0 |
| | A2 | 10 | 0 | 0.0034 | 0.0038 | 1672 | 230 | 0 | 0 |
| story 1440 | live | 10 | 0 | 0.0127 | 0.0153 | 394 | 208 | 3 | 10 |
| | C | 10 | 0 | 0.0146 | 0.0149 | 392 | 254 | 3 | 0 |
| | A2 | 10 | 0 | 0.0001 | 0.0021 | 226 | 218 | 0 | 0 |
| story 390 slow 4G | live | 8 | 0 | 0.0700 | 0.0713 | 9022 | 5456 | 3 | 0 |
| | C | 8 | 0 | 0.0774 | 0.0797 | 9012 | 5486 | 3 | 0 |
| | A2 | 8 | 0 | 0.0069 | 0.0069 | 9024 | 5520 | 0 | 0 |
| story 390 reduced motion | live | 10 | 3 | 0.0554 | 0.3594 | 382 | 188 | 3 | 10 |
| | C | 10 | 0 | 0.0610 | 0.0814 | 356 | 204 | 2.5 | 0 |
| | A2 | 10 | 0 | 0.0049 | 0.0069 | 218 | 166 | 0 | 0 |
| reload after scrolling to 2500 px | live | 5 | 5 | 0.1930 | 0.1930 | 168 | 168 | 2 | 0 |
| | C | 5 | 5 | 0.1930 | 0.1930 | 184 | 184 | 2 | 0 |
| | A2 | 5 | 0 | 0.0063 | 0.0063 | 156 | 156 | 2 | 0 |
| no hero photo | live | 8 | 8 | 0.6317 | 0.6927 | 250 | 232 | 3 | 7 |
| | C | 8 | 8 | 0.3882 | 0.4253 | 212 | 208 | 3 | 0 |
| | A2 | 8 | 0 | 0.0087 | 0.0299 | 188 | 188 | 2 | 0 |
| Balkans 390 | live | 10 | 3 | 0.0386 | 0.1197 | 302 | 208 | 3 | 0 |
| | C | 10 | 5 | 0.0995 | 0.1623 | 374 | 198 | 2 | 0 |
| | A2 | 10 | 0 | 0.0095 | 0.0112 | 242 | 226 | 0 | 0 |
| Balkans 1440 | live | 4 | 0 | 0.0034 | 0.0036 | 324 | 270 | 3 | 0 |
| | C | 4 | 0 | 0.0211 | 0.0680 | 270 | 270 | 3.5 | 0 |
| | A2 | 4 | 0 | 0.0010 | 0.0015 | 180 | 180 | 1 | 0 |
| Balkans 390 slow 4G | live | 4 | 4 | 0.1624 | 0.1624 | 5482 | 5482 | 3 | 0 |
| | C | 4 | 4 | 0.1414 | 0.1624 | 5524 | 5524 | 3.5 | 0 |
| | A2 | 4 | 0 | 0.0111 | 0.0111 | 9148 (photo becomes LCP, as on A) | 5548 | 1 | 0 |
| Luxembourg (hero photo not cached, aborted) | live | 8 | 0 | 0.0447 | 0.0610 | 178 | 178 | 3 | 0 |
| | C | 8 | 0 | 0.0437 | 0.0608 | 322 | 242 | 3 | 0 |
| | A2 | 8 | 0 | 0.0149 | 0.0180 | 250 | 170 | 1 | 0 |
| Even-brave | live | 8 | 0 | 0.0439 | 0.0728 | 372 | 212 | 3 | 0 |
| | C | 8 | 0 | 0.0442 | 0.0702 | 342 | 164 | 2 | 0 |
| | A2 | 8 | 0 | 0.0038 | 0.0084 | 238 | 232 | 0 | 0 |
| template edit, 390 (radius 50% to 6px, gap 12px to 20px) | live | 3 | 0 | 0.0396 | 0.0539 | 396 | 212 | 3 | 2 |
| | C | 3 | 0 | 0.0659 | 0.0797 | 388 | 180 | 3 | 0 |
| | A2 | 3 | 0 | 0.0034 | 0.0034 | 264 | 220 | 0 | 0 |
| home 390 | live / C / A2 | 4 each | 0 | 0.0034 each | 0.0034 each | 300 / 270 / 222 | | 0 | 0 |
| home 1440 | live / C / A2 | 3 each | 0 | 0.0005 each | 0.0005 each | 276 / 284 / 260 | | 0 | 0 |
| /stories 390 | live / C / A2 | 4 each | 0 | 0.0277 / 0.0324 / 0.0285 | 0.037 / 0.036 / 0.036 | 682 / 842 / 746 | | 0 | 0 |
| a traveler profile 390 | live / C / A2 | 4 each | 0 | 0.0762 / 0.0763 / 0.0779 | 0.076 / 0.080 / 0.080 | 304 / 238 / 222 | | 0 | 0 |

My extra cases (not in judge.md):

| case | core | loads | bad >0.1 | CLS median | CLS max | off frames (median) |
|---|---|---|---|---|---|---|
| very long title, 390 | live | 6 | 0 | 0.0192 | 0.0365 | 3 |
| | C | 6 | 0 | 0.0187 | 0.0365 | 2.5 |
| | A2 | 6 | 0 | 0.0207 | 0.0233 | 1 |
| Balkans, 46-letter place name | live | 6 | 3 | 0.0787 | 0.1633 | 3 |
| | C | 6 | 4 | 0.1209 | 0.1633 | 3 |
| | A2 | 6 | 0 | 0.0797 | 0.0806 | 3 |
| Balkans, place "Porto Jofre, Brazil" (a real one) | live | 3 | 2 | 0.1155 | 0.1202 | 3 |
| | A2 | 3 | 0 | 0.0094 | 0.0111 | 0 |
| Balkans, place of 23 letters | live | 3 | 1 | 0.0813 | 0.1173 | 3 |
| | A2 | 3 | 0 | 0.0095 | 0.0111 | 0 |
| Balkans, place of 30 letters | live | 3 | 0 | 0.0384 | 0.0823 | 3 |
| | A2 | 3 | 0 | 0.0797 | 0.0797 | 3 |
| Balkans with no hero photo (Receipts line, no photo) | live | 6 | 6 | 0.3006 | 0.3629 | 3 |
| | C | 6 | 6 | 0.3174 | 0.3208 | 3 |
| | A2 | 6 | 2 | 0.0580 | 0.1076 | 2 |
| Balkans, reload after scrolling to 2500 px | live | 5 | 5 | 0.4059 | 0.4062 | 2 |
| | C | 5 | 5 | 0.3759 | 0.4060 | 2 |
| | A2 | 5 | 0 | 0.0808 | 0.0870 | 2 |

- **CLS p75, story 390 instant:** live 0.343, C 0.065, A2 0.006.
- **Template edit:** live, C and A2 all ended at 6px and 20px in every load.
- **Second edit:** I deleted the avatar's `border-radius:50%` from the served template style. All three cores ended at 0px, so a deleted rule wins too; the early copy does not survive the end of parsing.
- **Finished page:**
  - In every story case, all three cores shared one final layout hash. The one exception was one slow-4G Balkans load each on C and A2, the same as the judge and the author saw.
  - The early style (`#tll-story-st3-early-v1`) was gone at the end in every load.
  - No hold attribute was left on the finished page, and the photo was visible in every load.
  - The figure, the "min read" span, the Receipts line, the caption and the avatar values were the same on all three cores.

**Trying to break it**
- **Home, /stories, a traveler profile:** nothing changes. Same CLS and the same layout-hash pattern as live; home's hash differs per load on all three cores. The observer audit showed no extra observer from A2 on those pages.
- **JavaScript off:** the final layout hash was identical on all three cores, on the reported story and on Balkans.
- **The core failing to load:** 3 loads, CLS 0.20 median, 0.74 max. The core is what is missing, so this is the same on every branch; there were no page errors.
- **Reduced motion:** behaves like the normal load (table above).
- **Very long title:** fine, max 0.023.
- **Observers after DOMContentLoaded:** I wrapped MutationObserver for 15 loads.
  - On the story page, A2's two new observers were disconnected by DOMContentLoaded every time. The early-run one usually stops 10 to 200 ms after it starts, once the Receipts block and the template script have been parsed.
  - The observers that stay on also exist on live and C.
- **Console:** 0 page errors in 510 loads. The 5 distinct console messages (Memberstack and ad requests failing in the harness) came at the same rate on all three cores.
- **Bandwidth and safety:**
  - 0 bytes from Webflow and 0 from jsDelivr; the harness byte-count file was unchanged before and after.
  - 54 cache misses (the Luxembourg hero photo and the JavaScript-off loads) were aborted, not fetched.
  - 7,935 non-GET requests were aborted; 0 driver errors.
  - Disk had 6.9 to 7.6G free before every batch.
  - No Webflow calls of any kind, no publish, no push to layers-release, no jsDelivr release, no merge.

**Breakage found (none blocks a release)**
1. **Long place names (confirms the author's item 4, now measured).**
   - With a place of about 30 letters or more, the place-and-date line ends on two lines at 390. A2 clamps it to one line until the template script has run, then it grows when the hold ends. The photo moves about 13 px: a steady 0.08 on every load, with 3 visible off frames.
   - Live on the same page: median 0.038, max 0.082.
   - Places up to 23 letters, including the real "Porto Jofre, Brazil", are clean at 0.01.
   - Possible fix: write the template's shortened line ({place}, {Month Year}) early instead of clamping it, or reserve two lines when the raw line is long.
2. **A story with a Receipts line and no hero photo (author's item 5, now measured).**
   - 2 of 6 loads went over 0.1 (max 0.108, median 0.058). Live and C were 6 of 6 at 0.30 to 0.36.
   - Cause: before DOMContentLoaded, the route strip under the hero shrinks (its text reflows when a late template style arrives), and the body section moves up 22 px. The early style does not copy the route strip rules.
   - No saved story is like this today.
3. **Reload partway down the Balkans story.**
   - 0.07 to 0.09 on 4 of 5 loads; live and C were 0.38 to 0.41.
   - At DOMContentLoaded something above the window shrinks by about 30 px, and scroll anchoring does not absorb it. On live this is hidden inside the big magazine switch.
   - Much better than today, but not the near-zero the author saw on the reported story (0.006 there too).
4. **FCP is 20 to 30 ms later than live** on the 390 story and Balkans (228 against 208 ms). The author reported this too; it comes from the early style and run. LCP is 100 to 140 ms earlier on every non-throttled story case.
5. **The SRI in the report is from f0723dc, not the head** (see Checks).

**What Nancy would see on her phone**
- **Today:** on about a third of story loads the writer's photo flashes huge and the text jumps back up. Almost every load flashes the old dark hero before the cream page snaps in. A story without a hero photo, and a reload partway down, both jump hard.
- **With C:** the huge writer photo and the big jump are gone. The quick dark-to-cream switch and a small nudge stay, and a reload partway down or a story with no photo still jumps.
- **With A2:**
  - The story opens straight in the magazine layout, with no dark flash and nothing moving.
  - The hero photo appears about a tenth of a second sooner than today. The text appears a hair later, too little to notice.
  - On a story with an "Edited by ... Published ..." line, the photo stays still.
  - Her template edits to the writer photo, the byline or the meta row still show up.
  - What remains:
    - a very long place in the place-and-date line (about 30 letters or more) gives one small nudge of the photo;
    - a reload partway down the Balkans story gives a small nudge;
    - a future story with a Receipts line but no hero photo may nudge the text once.

**Files** (scratch data, about 1.4M, no traces or screenshots kept, core copies and the worktree removed), all in scratchpad/nov14/a2judge/:
- adv.cjs (the driver, the judge's with my additions)
- an2.py (the table; an.py is the judge's original)
- batch.sh, b1.txt, b2.txt, batch.log
- m.jsonl (all loads) and obs.jsonl (the observer audit)
- test.log, build.log, netbytes.before

To re-run, put core-live.js, core-C.js and core-A2.js back into that folder from `git show`.
