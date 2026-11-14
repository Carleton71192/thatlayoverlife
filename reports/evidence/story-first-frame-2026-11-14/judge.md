# Judge: fix A vs fix C (14 Nov 2026)

Branches: claude/fix-story-first-frame-a-2026-11-14 at 4fec1d8, claude/fix-story-first-frame-c-2026-11-14 at fd2d88f. Raw data: scratchpad nov14/adv/ (not kept in the repo).

RECOMMEND C NOW, A LATER

**Why.** C is a 21-line head style with no observers. In my own loads it removes the 0.32 jump on the reported story: 0 of 40 fresh 390 loads went over 0.1, against 12 of 30 on the live core. It never overrides the template. It leaves three things: the old-hero-to-magazine flash, the jump on reload after scrolling, and the jump on a story with no hero photo.

A is far better for visitors on almost every story case. It is not ready to merge for two reasons:
1. Its copies of the template's byline, avatar and meta-row rules move to the end of the body, so they silently override any later Designer edit to those rules.
2. On stories with a Receipts line and a long place name in the place-and-date line it adds a new 0.035 to 0.08 shift.

Both are fixable. Once they are fixed, A should replace C, and C's style becomes redundant but harmless. Nothing was merged.

Branches checked: origin/claude/fix-story-first-frame-a-2026-11-14 at 4fec1d8, and origin/claude/fix-story-first-frame-c-2026-11-14 at fd2d88f, each diffed against claude/new-session-zxm063.
- **Tests:** A passes 57 files and 567 tests; C passes 57 files and 560 tests.
- **Rebuild:** each branch's build script reproduces its committed core byte for byte (worktree clean after the rebuild).
- **A's own measurement:** its batch died at load 17 with a browser crash, after recording only live-core runs. A's author made no measured claims; every A number below is mine.

**Method**
- Harness libx.cjs used from cls390 by absolute path, driver scratchpad/nov14/adv/adv.cjs.
- 16.64.0 test HTML served at the www address, fresh loads. 390x844 at DPR 3, or 1440x900.
- The pinned core URL is answered with the core under test (live comes from `git show` of pin 6ec769bb), and the page's SRI is set to that core's hash.
- In every iteration the three cores ran in rotating order.
- Webflow and jsDelivr files came only from the local caches. A cache miss was aborted, never fetched.
- "Held" means only the hero photo was held for 1.5 s.
- "Slow 4G" means 150 ms per request, one shared 1.6 Mbit/s pipe and CPU 4x slower.
- CLS is the sum of all layout-shift entries over 4 s after load.
- "Off frames" counts the frames painted before DOMContentLoaded in which the hero, h1, byline or photo sits more than 4 px from its final place. This is the visible flash.
- "Tall photo" counts loads in which the writer photo was painted taller than 60 px.

**Measurements**

| case | core | loads | bad >0.1 | CLS median | CLS max | LCP median ms | FCP median ms | off frames (median) | tall writer photo (loads) |
|---|---|---|---|---|---|---|---|---|---|
| story 390, photo instant | live | 20 | 8 | 0.0483 | 0.3577 | 356 | 170 | 3 | 20 |
| | A | 20 | 0 | 0.0050 | 0.0091 | 212 | 200 | 0 | 0 |
| | C | 20 | 0 | 0.0594 | 0.0795 | 356 | 196 | 2 | 0 |
| story 390, photo held 1.5 s | live | 10 | 4 | 0.0540 | 0.3613 | 1646 | 178 | 3 | 7 |
| | A | 10 | 0 | 0.0056 | 0.0091 | 1654 | 176 | 0 | 0 |
| | C | 10 | 0 | 0.0454 | 0.0806 | 1644 | 168 | 3 | 0 |
| story 1440, photo instant | live | 10 | 0 | 0.0124 | 0.0153 | 330 | 168 | 3 | 10 |
| | A | 10 | 0 | 0.0003 | 0.0013 | 224 | 214 | 0 | 0 |
| | C | 10 | 0 | 0.0127 | 0.0148 | 348 | 186 | 3 | 0 |
| story 390, slow 4G | live | 8 | 0 | 0.0690 | 0.0713 | 9012 | 5448 | 3 | 0 |
| | A | 8 | 0 | 0.0090 | 0.0090 | 9018 | 5502 | 0 | 0 |
| | C | 8 | 0 | 0.0774 | 0.0796 | 9016 | 5436 | 3 | 0 |
| story 390, reduced motion | live | 10 | 3 | 0.0556 | 0.3594 | 380 | 174 | 3 | 8 |
| | A | 10 | 0 | 0.0055 | 0.0090 | 222 | 176 | 0 | 0 |
| | C | 10 | 0 | 0.0611 | 0.0814 | 386 | 200 | 2.5 | 0 |
| story 390, reload after scrolling to 2500 px | live | 5 | 5 | 0.1930 | 0.8273 | 136 | 136 | 2 | 2 |
| | A | 5 | 0 | 0.0063 | 0.0330 | 156 | 156 | 2 | 0 |
| | C | 5 | 5 | 0.1930 | 0.1930 | 144 | 144 | 2 | 0 |
| story with no hero photo (img removed from saved HTML), 390 | live | 8 | 8 | 0.4873 | 0.7032 | 222 | 222 | 3 | 7 |
| | A | 8 | 0 | 0.0068 | 0.0800 | 214 | 214 | 2 | 0 |
| | C | 8 | 8 | 0.3856 | 0.4253 | 234 | 214 | 2.5 | 0 |
| Balkans story (has Receipts line), 390 | live | 10 | 4 | 0.0596 | 0.1183 | 360 | 206 | 3 | 0 |
| | A | 10 | 1 | 0.0811 | 0.1185 | 226 | 180 | 3 | 0 |
| | C | 10 | 3 | 0.0386 | 0.1183 | 386 | 198 | 2 | 0 |
| Balkans, 1440 | live | 4 | 0 | 0.0050 | 0.0362 | 280 | 238 | 3 | 0 |
| | A | 4 | 0 | 0.0006 | 0.0145 | 212 | 212 | 0 | 0 |
| | C | 4 | 0 | 0.0021 | 0.0060 | 224 | 224 | 3.5 | 0 |
| Balkans, 390, slow 4G | live | 4 | 4 | 0.1624 | 0.1624 | 5476 | 5476 | 3 | 0 |
| | A | 4 | 4 | 0.1181 | 0.1181 | 9132 (see breakage 4) | 5514 | 4 | 0 |
| | C | 4 | 4 | 0.1624 | 0.1624 | 5488 | 5488 | 3 | 0 |
| Luxembourg story (hero photo not cached, so aborted), 390 | live | 8 | 0 | 0.0446 | 0.0620 | 194 | 168 | 3 | 0 |
| | A | 8 | 0 | 0.0281 | 0.0294 | 234 | 170 | 1 | 0 |
| | C | 8 | 0 | 0.0455 | 0.0607 | 262 | 180 | 3 | 0 |
| Even-brave story (hero photo not cached, so aborted), 390 | live | 8 | 0 | 0.0580 | 0.0726 | 358 | 166 | 3 | 0 |
| | A | 8 | 0 | 0.0210 | 0.0216 | 228 | 164 | 0 | 0 |
| | C | 8 | 0 | 0.0553 | 0.0709 | 350 | 158 | 2.5 | 0 |
| home 390 | all three | 4 each | 0 | 0.0034 | 0.0034 | 204 / 250 / 252 | | 0 | 0 |
| home 1440 | all three | 3 each | 0 | 0.0005 | 0.0005 | 280 / 244 / 252 | | 0 | 0 |
| /stories 390 | all three | 4 each | 0 | 0.0284 | 0.036 / 0.028 / 0.029 | 654 / 646 / 772 | | 0 | 0 |
| a traveler profile, 390 | all three | 4 each | 0 | 0.0762 | 0.076 / 0.076 / 0.080 | 242 / 234 / 308 | | 0 | 0 |

- **CLS p75, story 390 instant:** live 0.346, A 0.008, C 0.065.
- **Non-story pages:** the LCP spreads on home, /stories and the profile are noise from 3 or 4 loads. C runs nothing there (it checks the page id), and the layout hashes match the live core's pattern.
- **JavaScript off:** no observer can run, so CLS cannot be measured. The finished layout hash was identical for all three cores, because no core code runs.
- **Core failing to load (core request aborted):** 3 loads, CLS 0.12 to 0.23. The page renders with the template styles alone, and there were no page errors other than the failed script. This is the same for every branch, because the core is what is missing. Neither branch adds a way to hide content that depends on the core.
- **Finished page:** at every width and case, the final layout hash and the computed-style hash of the hero, byline and route strip were the same for live, A and C. One slow-4G load each on live and C ended in a different final layout; A ended the same every time. The figure, the byline moved into the hero, the stamp, the "min read" span, the caption, `--tll-hero-r` and the Receipts line were all present and identical.
- **Bandwidth and safety:**
  - 378 loads fetched 0 bytes from Webflow and 0 from jsDelivr. Cache misses were aborted: 16 loads per core on Luxembourg, 1 with JavaScript off.
  - About 5,780 non-GET requests were aborted. No page errors.
  - No Webflow calls, no publish, no push, no jsDelivr release.
  - Disk had 6.9G free before every batch.

**Breakage found**

1. **A overrides future template edits (confirmed).**
   - Test: I changed the template's own end-of-body style in the served HTML, avatar `border-radius:50%` to `6px` and byline link `gap:12px` to `20px`.
   - Live and C show 6px and 20px. A shows 50% and 12px.
   - Cause: A copies 14 template rules into style#tll-mag-story-v1, which moves to the end of the body at DOMContentLoaded and so wins every tie against the template.
   - Any later Designer change to the byline row, the avatar or the meta-row rules would silently do nothing on story pages. That includes changed values when the when-home item moves the avatar rules into the template head.
   - Fix: keep the copies in a separate head style placed before the template's style, or remove it at DOMContentLoaded.
2. **A adds a new shift on stories with a Receipts line or a long place name in the place-and-date line (Balkans, 390).**
   - The Receipts line is inserted when the Receipts block arrives, after the first paint, and pushes the photo down 46 px (0.037).
   - The template's own helper (script#tll-st3-story-js-v1, which runs at DOMContentLoaded) then rewrites the place-and-date line ({place} · {Month Year}). The byline is already painted in the hero, so it shrinks from 56 to 44 px and the photo moves 13 px (0.080).
   - Median 0.081 with 1 of 10 loads at 0.118, against C 0.039 (3 of 10 bad) and live 0.060 (4 of 10 bad). On slow 4G all three cores are bad on Balkans: A 0.118, live and C 0.162.
   - Fix: reserve the Receipts line's height, or insert it only at DOMContentLoaded, and hold or reserve the place-and-date line until the template helper has run.
3. **C leaves three real cases unfixed and slightly raises the typical shift.**
   - Reload after scrolling: 5 of 5 loads at 0.193.
   - Story with no hero photo: 8 of 8 at 0.39 to 0.43.
   - The old-hero-to-magazine flash stays: 2 to 3 off frames on almost every load.
   - Its good-run shift is 0.065 to 0.080, against 0.040 for good live runs. That is still under 0.1, and the original author saw the same.
4. **LCP caveat for A.** The 9132 ms LCP on slow-4G Balkans happens because the hero photo becomes the LCP element on A, while live and C report the h1 at about 5.5 s. The photo arrives at the bandwidth-bound time on all three. On every non-throttled story case, A's LCP is 120 to 145 ms earlier, because the photo paints in its final place from the start. A's FCP is up to about 45 ms later in some cases, within the run-to-run spread.
5. **Nothing else broke.**
   - Neither branch touches home, /stories or the profile.
   - Reduced motion behaves like the normal load. The template's `transition:none !important` still wins over A's copied transition.
   - No errors in either branch with the core blocked.
   - A's two document-wide MutationObservers produced no errors in about 120 A loads and stop at DOMContentLoaded.

**What Nancy would see on her phone**
- **Today:** on about a third of story loads the writer's photo flashes huge and the text jumps back up. Almost every load shows the old dark hero for a moment before the cream magazine page snaps in. Reloading partway down a story jumps.
- **With C:** the huge writer photo and the big jump are gone. The quick dark-hero-to-magazine switch and a small nudge are still there on almost every load. A reload partway down still jumps. The finished page looks exactly as it does now, and her template edits keep working.
- **With A:** the story opens straight in the magazine layout with no flash, the hero photo shows a little sooner, and reloads stay put. On stories with an "Edited by ... Published ..." line under the byline, the photo still nudges down a little once. If she later changes the writer photo's shape or ring, the byline spacing or the meta row in the template, A would quietly ignore the change on story pages.

**Files** (all under scratchpad/nov14/adv/, about 436K in total; core copies deleted, no traces or screenshots kept):
- adv.cjs
- an.py
- batch.sh
- b1.txt, b2.txt, b3.txt, b4.txt
- batch.log
- m.jsonl
- full.jsonl
- test-1.log (A), test-2.log (C)
- cov.cjs
