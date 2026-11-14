STORY PAGE 390 FIRST-FRAME SHIFT: CAUSE FOUND AND REPRODUCED (no code changed, no Webflow calls, repo clean)

Summary
The shift is not caused by the hero photo. It comes from the writer's avatar photo in the author row. That image has no size until the template's own story style is parsed, and that style sits at the very end of the body. The magazine layout itself is only applied at DOMContentLoaded. If the avatar arrives early, Chrome paints it at its natural size (342x513 px), which pushes the author text below the fold. Then the end-of-body template style shrinks the avatar to 40 px, and if Chrome paints that state too, before DOMContentLoaded, it counts the author text coming back up about 540 px. That entry is 0.318.

Measured (16.64.0 core at pin 6ec769bb, test HTML served at the www address, 390x844 DPR 3, fresh, all images instant from the local cache)
- 36 loads: 14 bad (39 %).
- The big entry was 0.31793 in 12 runs and 0.32155 in 2 runs (those two also include the nav logo). Bad-run page totals were 0.3428 to 0.3577.
- Good-run median 0.0396; median over all 36 loads 0.0482.
- Combined with the 14 Nov check: 8 of 21 (T) plus 14 of 36 now on 16.64.0, and 4 of 21 on 16.63.0.
- Bad-run sources were identical every time (previousRect y to currentRect y, viewport px):
  - div#tll-main.tll-story-hero-content: 339 to 361, height 365 to 343 (the meta row reflows).
  - div.tll-container.tll-rv: 816 to 790, height 28 to 54.
  - div.st3-author-text: previousRect empty (it was off screen at y about 1329) to 794, size 148x37. This is the element that makes the 0.318: about 0.50 of the viewport affected, moved about 540/844 = 0.64.
- The rAF trace of a bad run, in order:
  - Frame A: old Webflow hero (the dark overlay, min-height 72vh, 641 px tall). The avatar img has no box yet.
  - Frame B: avatar loaded at natural size, author row 564 px tall, author text at 1329.
  - Frame C: template style parsed, avatar 36 to 40 px, author text at 794. Big entry here.
  - Then DOMContentLoaded and the magazine style: hero 789 px, cream, text above the photo.
- The window from "template style parsed" to "magazine style inserted" was 28 to 85 ms in the bad runs. During it the parser waits on the 15 sync Webflow-hosted scripts at the end of the body.
- Frame B happens while the parser waits on jQuery, webflow.schunk and webflow.js (the schunk wait is 40 to 250 ms).
- Good runs miss one of those painted frames, or Chrome records the author text leaving the viewport in frame B (a 0.00045 entry) and then does not count its return. Which of the two it does is decided inside Chrome. The trigger itself is deterministic (see the experiments).
- Side note: the magazine switch at DOMContentLoaded is a large visible jump on almost every load, because a pre-DOMContentLoaded frame nearly always paints. CLS barely counts it, because run() moves the hero img into a new figure and the author row into the hero, and Chrome does not score moved nodes. The CLS number therefore understates what visitors see.
- The good-run 0.04 is the same mechanism, smaller: the meta row reflows when the template style lands (0.0142), and the body section moves at the magazine switch (0.0249).

Code (file and line references)
1. Magazine style injected late:
   - /home/user/thatlayoverlife/src/site-layers/tll-site-layers-v16.js lines 1181 to 1183. These lines are the same at pin 6ec769bb and in the working tree.
   - place() creates style#tll-mag-story-v1 and appends it to the body only on DOMContentLoaded.
   - Built from /home/user/thatlayoverlife/src/site-layers/build-site-layers-v16.py lines 264 to 267.
   - The cover layer got the F1 fix in lines 268 to 285 (style into the head at once, moved to the end of the body at DOMContentLoaded, run early through a MutationObserver). The story layer never got it.
2. Magazine JS also runs only at DOMContentLoaded:
   - core line 1234 run(), wired at line 1257.
   - heroR() at line 1207 sets --tll-hero-r.
   - line 1242 wraps the hero img in figure.tll-mg-fig; line 1246 moves .st3-author into the hero.
   - Source file: /home/user/thatlayoverlife/src/design/magazine-2026-10/story-build/tll-mag-story-v1.html. Hero restyle lines 16 to 21, avatar 44 px at line 43, heroR at line 176, run() at line 203, DOMContentLoaded wiring at line 226.
3. Template-side trigger:
   - The Stories Template (6a0b29eedc14f1444e935766) Before-</body> code has style#tll-st3-story-v1. The saved copy matches the live page byte for byte: /home/user/thatlayoverlife/src/pages/stories-template/live-2026-11-13/fonts/page-footer.after.html, style starting at line 159, avatar rules .st3-author-avatar 40x40 and .st3-author-img 100% at lines 202 to 203.
   - That is the only rule that sizes the avatar. Nothing in the head and nothing in the shared Webflow CSS sizes it.
   - In the page, the avatar img (img.st3-author-img, loading lazy, no width or height) is at char 74,700 of 209,500. The template style is at char 184,566, after jQuery (130,552), webflow.schunk and webflow.js.
   - The template style also carries the meta-row rules (flex, hide items 5 and 6) that make the #tll-main 22 px move.
4. Other story-page code: nothing else in the head or after DOMContentLoaded contributes a large shift. The chunk scripts (async=false) and tll-a11y-motion (which adds id tll-main) do not change layout. .tll-rv is a wrapper class added by tllreveal.
   - The 14 Nov "hero photo held" runs were clean because the harness held every Webflow image, including the avatar.

Causal checks (harness only, each change applied to the served HTML copy in the scratchpad, 20 loads each)
- E1, hold only the avatar 1.5 s: 0 of 20 bad, median 0.047.
- E2, one head rule sizing .st3-author-avatar and .st3-author-img: 0 of 20 bad, median 0.040, max 0.080.
- E3, template style plus magazine style copied into the head (originals kept, so the final cascade is unchanged): median 0.0034, but 3 of 20 at 0.09 to 0.13.
  - Cause: the hero img box grows from 219 to 520 px when the photo loads, because --tll-hero-r is only set by heroR() at DOMContentLoaded.
  - So an early style alone is not enough: heroR has to run early too.
- E4, story parts hidden (visibility hidden on .tll-story-hero, [data-tll-route] and .tll-story-body-section) until the DOMContentLoaded handlers ran, 3 s timeout: 0 of 20 bad, median 0.0034, max 0.0039.
  - Released 10 to 27 ms after DOMContentLoaded. FCP and LCP in the harness did not get worse: LCP median 352 ms, against 364 to 370 ms in E2 and E3.
- Bandwidth: 119 loads, 0 bytes fetched from Webflow or jsDelivr (net-bytes.json unchanged), every non-GET aborted (1,787).
- Every layout-shift entry in this harness reports hadRecentInput true, on both cores. This is probably a Playwright artifact. A real visitor with no input would have these counted.

Two fix ideas
A. Render-blocking early style plus early run (the F1 pattern on the story layer):
   - In build lines 264 to 267, append style#tll-mag-story-v1 to the head at once. The core is the last script in the head, so the style lands after every head style. Move it to the end of the body at DOMContentLoaded so it still wins ties over the template's end-of-body style.
   - Add the few template-critical rules to that early style (avatar 40 px and img fit, meta row). They can be keyed on html[data-wf-page="6a0b29eedc14f1444e935766"]. The template already has that attribute on html; body has no attributes.
   - Run heroR as soon as the hero img exists, and the author move and figure wrap as soon as .st3-author exists, using a MutationObserver as in the cover's NEW_RUN, with DOMContentLoaded as the fallback.
   - rcpt() needs [data-tll-ledger="story"], which is parsed later (char about 109,700). Either wait for it or reserve the line's height.
   - Fixes the visible flash too, not only the CLS.
B. Hold visibility until the layout is applied:
   - On story paths the core adds a class to html at head time, plus a rule that sets visibility hidden on the hero, the route strip and the body section.
   - Remove the class right after place() and run() in the DOMContentLoaded handler, with a timeout of about 1.5 to 2.5 s and a pageshow fallback.
   - Hidden boxes keep their size and are not scored, so nothing moves. Measured in E4.
   - Cost: the hero (the LCP element) cannot paint before DOMContentLoaded. On slow phones DOMContentLoaded waits on about 20 sync scripts at the end of the body, so the timeout bounds the LCP loss. Visitors without JavaScript are unaffected.
   - Smaller and quicker to ship, but it keeps the late layout.

For the when-home list (Designer, later, not now): give the template's st3-author-img a fixed 40x40 size, or move the avatar rules into the template head. This removes the trigger even before A or B.

Scratch files (not in the repo)
- Tracer: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov14/cls390/trace.cjs
- Harness copy with the experiment hooks: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov14/cls390/libx.cjs
- Analysis: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov14/cls390/an.py
- Data:
  - /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov14/cls390/main36.jsonl
  - /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov14/cls390/e1-avhold.jsonl
  - /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov14/cls390/e2-avcss.jsonl
  - /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov14/cls390/e3-headcss.jsonl
  - /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov14/cls390/e4-hold.jsonl