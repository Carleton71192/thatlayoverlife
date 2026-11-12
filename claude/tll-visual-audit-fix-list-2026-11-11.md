# That Layover Life: visual audit fix list (11 Nov 2026)

Source audit: /home/user/thatlayoverlife/claude/tll-visual-design-audit-2026-11-11.md (written before the two publishes of 11 Nov).
Basis: three rechecks of https://www.thatlayover.life after the 17:07 UTC publish (signed out, Chromium, 1920x1080, 1440x900, 390x844), plus a fourth pass for this list that trialed the "Stage now" set together in a local browser (also at 1024x768 and 768x1024). Nothing in this list has been written to Webflow, published or committed.

Labels: STAGE NOW (finishing fix, no judgment call, reversible), NANCY DECIDES (changes the look or conflicts with the kit), NANCY PRESENT (shared nav, footer or "Tell the editor").

Not assessed, as instructed: the home "Layover guides" row (being rebuilt by another agent in embed 94ce12c0).

## What this pass changed in the three readers' proposals

These came out of trialing the Stage now set together. Each is already folded into the sections below.

1. Letter note contrast: not a defect. The reader measured the note "No schedule we'd break. Unsubscribe anytime." at opacity .75 (4.2:1). On www the computed opacity is 1: layer /home/user/thatlayoverlife/src/site-layers/tll-ux-1028-v1.js line 16 (`html body [data-h3="news"] .h3-c7-note{color:#0A0B14!important;opacity:1!important}`) already overrides the embed. Midnight on #F0507A is 5.73:1. Dropped from Stage now.
2. Skip link: the proposed rule `.tll-skip{...font-weight:600 !important}` would lose to the live `.tll-skip:focus{font-weight:700 !important}` (higher weight of selector), and the link is only ever seen while focused. Corrected selector below, trialed. Live corners are 2px today, not 6px.
3. Paw Passport underline: a rule with the same selector placed earlier in the page loses to the base rule. The rule below carries one more class, so it wins wherever it sits. Trialed.
4. Story 12px floor rule: it only works when it sits after lines 73 to 109 of the story layer (same weight, later wins). Placed at the end of the layer's style block it was trialed on three stories: 15, 9 and 14 text runs under 12px become 0.
5. Value section onto the shared edge: fine at 1920, 1440, 768 and 390, but at 1024 wide the row "What do you collect?" wraps (the rose pill drops to a second line; the box goes from 86px to 140px tall, the section from 720px to 774px). By arithmetic this happens for windows of about 965 to 1035px wide. Kept in Stage now with this noted; hold it if that is not acceptable.
6. Hero onto the shared edge: text contrast against the photo was re-measured after the move. It is not lower anywhere (1920: kicker 7.7 to 8.3:1 median, H1 lightest pixel 4.9 to 5.6:1; 1440, 1024, 768, 390 the same or better).
7. Story type size (18px / 1.65): the story reader labeled it STAGE NOW because it is the written kit rule. It changes line counts on every story, so it is under "Nancy decides" here, with the column width.
8. Page height on the home page moves by 39 to 73px between two readings of the same page with no change applied (late-loading content). Height checks after staging need that tolerance.

## 1. Already fixed, or not a defect, since the audit

| Audit item | State on www now |
|---|---|
| Broken "Layover guides" section ("No items found.", 45px H2 at left 0) | Fixed in the 14:06 publish; the row is being rebuilt now. Not assessed here. |
| "The library." at 196px on its own 72px edge | Now a 44px label (28px at 390) on the shared column, left edge 340 / 100 / 20. |
| Two giant headlines back to back before the library | Gone with the line above: 100px chapter headline, then a 44px label 263px lower. |
| "Par avion" on the Lounge postcards | Removed. |
| Tilted library cards with stepping titles | Only the photo is tilted (about 0.8 degrees). Cards are equal height and every title starts on the same line. What still steps is the "N min read" line (Stage now, S12). |
| Three button heights (38, 40, 48) | Real buttons already follow the kit: 48 standard, 44 search (kit compact), 40 nav. The "38" is the keyboard-only skip link (Stage now, S9). |
| Third off-white #F8F2E6 | Not a surface anywhere now. Surfaces are Cream #F7F1E8 and Paper #FDF9F3, plus one white box (table item T6). |
| DM Sans (7) and DM Serif Display (2) | Names only, on 9 elements in the shared nav and footer. No DM file is downloaded; the glyphs render as IBM Plex Sans Condensed and Playfair Display. Not visible. Cleanup is NANCY PRESENT (P5). |
| Story eyebrow "appears in #D63859, about 4.1:1" | It is #C8325B on Cream: 4.60:1, passes. (Its color role is table item T2.) |
| Story body color #3A3A3A "a fourth text color" | Paragraphs are #2A2A2A (13.7:1). Only list items are still #3A3A3A (Stage now, S6). |
| Text under 12px on the home page | None in HTML at any of the three widths. Everything smaller is inside the 8 stamp drawings (aria-hidden). See T8. |
| Letter note contrast (found by a reader) | Not a defect, see point 1 above. |
| "Tell the editor" over the footer | Already hidden there by /home/user/thatlayoverlife/src/site-layers/tll-note-footer-v1.js. |
| Yellow-green asterisk tab and magenta square at the screen edge | Not served by the site: the loaded page holds exactly three fixed or sticky elements (nav, library pin, "Tell the editor"); 24 fixed-position rules in the page's code were each identified and none sits at the top right or right edge; no such color exists in the code. Consistent with browser extensions in the reviewer's Chrome. Ten second check for Nancy: open www in an Incognito window and sign in. If both are gone, they are extensions. |
| Homepage length 13,398px | Now 15,946px at 1920x1080, 13,984px at 1440x900, about 14,660px at 390x844, signed out. It rises with window height (12vh paddings, pinned library). Information only. |

## 2. Stage now

Eighteen small edits (S1 to S17, S10 in two parts). They land in two places: one site layers release (four source files) and two home embeds. No write to the Stories template and no write to site head code is needed.

Rules for whoever applies them:
- Line numbers below were checked against the repo at HEAD (fc9c865) and match what is live (bundle 3066315, built from ab1cf5c).
- Embeds: read the staged embed first and edit that text. Do not paste from the saved live copies. a4c1009d holds another session's staged, unpublished edits. 94ce12c0 is being rebuilt by another agent.
- Nothing here changes words, removes content, touches the nav, the footer or "Tell the editor", or changes story text size or column width.
- Trial sheets used for this pass: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/plan/stage-now-home-trial.css and /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/plan/stage-now-story-trial.css. Measured results: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/plan/check1.json, check2.json, check4b.json in the same folder.

### Group A. One site layers release

Build order after the edits: build-cover.py (in /home/user/thatlayoverlife/src/design/magazine-2026-10/cover-build/), then /home/user/thatlayoverlife/src/site-layers/build-site-layers-v16.py, then a layers release. The git log shows release 16.59.0 (photo hold) already staged in the site header, so this is the release after it. If Nancy answers N1 to N4, N6, N10, T1 or T2 before the release is cut, those edits are in the same four files and can ride along.

#### A1. Cover layer: /home/user/thatlayoverlife/src/design/magazine-2026-10/cover-build/cover.template.html

**S1. Hero text onto the shared left edge** (audit: 412 and 340 should be one number)
- Now: hero chip, kicker, H1, both paragraphs, buttons and credit start at 412 / 172 / 16 (1920 / 1440 / 390). Every other section starts at 340 / 100 / 20.
- Line 58: change `max-width:1240px !important` to `max-width:calc(1240px + 2*var(--h3-g,48px)) !important`.
- Line 12: change `padding:0 16px max(clamp(40px,8vh,80px),76px) !important` to `padding:0 var(--h3-g,20px) max(clamp(40px,8vh,80px),76px) !important`.
- Moves: the whole hero text column, 72px left at 1920 and 1440, 4px right at 390 (buttons there go from 358px to 350px wide). Windows from 768 to 1383px wide do not change. The stamp and the photo do not move. This and S2 are the two most visible edits in this section.
- Verify: H1 left edge 340 at 1920, 100 at 1440, 51 at 1024, 38 at 768, 20 at 390; H1 still two lines; no sideways scroll. Trialed: all true.

**S2. Stamp to its intended place** (the source means right 72px, top 32px on desktop; a later `!important` on line 35 wins, so it sits at right 16px, top 20px)
- Line 63: change `{width:150px;right:var(--h3-g,48px);top:32px}` to `{width:150px;right:var(--h3-g,48px) !important;top:32px !important}`.
- Moves: the stamp 56px left and 12px down at 1920 and 1440 (22px left, 12px down at 768). Phone unchanged. It then matches the Letter stamp, which already sits at 72 / 32.
- Verify: stamp box x 1698 to 1848, top 109 at 1920; x 1218 to 1368 at 1440; x 580 to 730 at 768; unchanged at 390 (96px wide, right 16px).

**S3. Hero filled button hover to the kit color**
- Now: "Read the cover story" hovers to #B82C4B; every other filled button hovers to the kit's #C8325B.
- Line 26: change `#B82C4B` to `#C8325B`.
- Moves: nothing. Verify: hover background rgb(200, 50, 91). Trialed.

**S4. "Join free" hover to the kit's 12% tint**
- Now: hover fills Cream with dark text. The kit and the button layer (tll-buttons-v1.html line 25) use a 12% tint of the label color for outlined buttons.
- Line 29: change `{background:#F7F1E8 !important;color:#0D0F1A !important}` to `{background:color-mix(in srgb,currentColor 12%,transparent) !important}`.
- Moves: nothing. Verify: hover background is Cream at 12%, label stays #F7F1E8. Trialed.

**S5. Two near-duplicate light grays in the hero (not visible to the eye; ride along)**
- Line 22: `color:#E8E2D8 !important` to `color:#F7F1E8 !important` (the two hero paragraphs; contrast goes up).
- Line 33: `color:#B9B3A8` to `color:#C9C3B8` (the credit line; contrast goes up). Skip if N4 removes that line.
- Moves: nothing.

#### A2. Story layer: /home/user/thatlayoverlife/src/design/magazine-2026-10/story-build/tll-mag-story-v1.html

Add these three rules as the last rules of the style block, directly before `</style>` on line 128. The position matters for S8.

**S6. List items match the paragraph color**
- Now: paragraphs #2A2A2A, list items #3A3A3A in the same story (43 of 57 stories have lists).
- Add: `.tll-story-body>.w-richtext.tll-body li{color:inherit}`
- Moves: nothing. Verify: list item color rgb(42, 42, 42). Trialed on Morocco.

**S7. Stray dot after the eyebrow** ("STORIES FROM THE ROAD ·" on 55 of 57 stories; the dot is a divider whose neighbors are hidden; it is drawn by CSS, there is no text in it)
- Add: `.tll-story-hero .tll-story-meta-row>.tll-story-meta-divider:nth-child(4){display:none !important}`
- Moves: nothing else. Verify: the fourth child of `.tll-story-meta-row` has display none. Trialed on three stories.

**S8. 12px floor on story pages** (Receipts title 10px, Receipts row labels 10.5px, "Morocco, and you?" and "Log in to save" 10.5px, "Links", "Signed,", "KEEP READING", related place names and the feedback block's "TELL THE EDITOR" label 11px; this is the label inside the story page, not the floating button)
- Add:
```
[data-tll-ledger] .tll-sl-title,[data-tll-ledger] .tll-ledger-k,[data-tll-places] [data-tll-places-label],[data-tll-places] [data-tll-places-note],[data-tll-links-card]>:first-child,.tll-story-body .tll-signoff-label,.tll-story-aftermatter .tll-related-header .tll-eyebrow-teal,.tll-story-feedback .tll-eyebrow-teal,.tll-related-loc{font-size:12px !important}
```
- Moves: the Receipts block grows 2px; the page grows 6 to 8px. No sideways scroll.
- Verify: zero visible text runs under 12px on /stories/morocco-toubkal-peaks-mules-uno-vengeance, /stories/horseshoe-bend-arizona and /stories/balkans-ev-road-trip-twelve-countries at 1440 and 390 (the phone "Tell the editor" dot keeps a hidden 0px label; that is the shared component and is not counted). Trialed: 15 / 9 / 14 runs become 0.
- The source rules sit in the Stories template footer code (style tll-st3-story-v1, lines 268, 272, 289, 292) and in this layer (lines 73, 80, 85, 109). Fixing them at source is optional cleanup for a later template edit; the override is enough.

#### A3. Button layer: /home/user/thatlayoverlife/src/site-layers/tll-buttons-v1.html

**S9. Skip link to the kit's button shape** (keyboard only; seen on Tab from the top of any page)
- Now: 166.5 x 38.4px, 2px corners, JetBrains Mono 700 (only 400 and 600 are loaded). The kit: square corners, 40px minimum target, Mono 400 or 600.
- Add before `</style>` on line 44:
```
html body .tll-skip,html body .tll-skip:focus{box-sizing:border-box !important;min-height:40px !important;display:inline-flex !important;align-items:center !important;border-radius:0 !important;font-weight:600 !important}
```
- Moves: the skip link on every page, 1.6px taller. Nothing a mouse or touch user sees. This is not the nav component; the link is made by the site footer code and styled in /home/user/thatlayoverlife/src/site-layers/tll-v9-chrome-v1.html line 4.
- Verify: focus it with Tab: 166.5 x 40, radius 0, weight 600. Trialed.

#### A4. Value layer: /home/user/thatlayoverlife/src/site-layers/tll-home-value-v1.js

**S10a. "Why That Layover Life" section onto the shared left edge** (audit: 400 and 340 should be one number)
- Now: eyebrow, H2, lede, three cards and the "What do you collect?" box start at 400 / 160 / 16 in a 1120px column.
- Line 18: change `padding:72px 16px 80px` to `padding:72px var(--h3-g,clamp(20px,5vw,72px)) 80px`.
- Line 19: change `max-width:1120px` to `max-width:1240px`.
- Line 30: change `.tll-val{padding:52px 16px 60px}` to `.tll-val{padding:52px var(--h3-g,20px) 60px}`.
- Moves: left edge to 340 / 100 / 20. Cards grow from 361 to 401px wide at 1920 and 1440; the box grows to 1240px. Section height unchanged at 1920, 1440 (730), 768 (763) and 390 (1050). At 1024 the section is narrower than today (922px against 992px), cards 319 to 295px, and the rose pill wraps to a second line (box 86 to 140px, section 720 to 774px). See point 5 at the top.
- Verify: H2 left edge 340 / 100 / 51 / 38 / 20 at 1920 / 1440 / 1024 / 768 / 390; no sideways scroll. Trialed. Before and after at 1024: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/plan/shots/sheet-stage-now-val-1024.jpg

**S10b. One gray, not two (not visible; ride along)**
- Lines 21 and 23: `#3a3833` to `#3A3A3A` (lede and card text; the page's other secondary text is #3A3A3A).
- Moves: nothing.

### Group B. Home embeds (page 69d6145df421c777840c1e46)

#### B1. Embed a4c1009d (Paw Passport), style id h3b-paw

**S11. Remove the underline from "whatever the species."** (audit: an underlined headline reads as a link; the kit: never an accent line under a title)
- Now: `text-decoration:underline`, 3px, offset 8px, from `.h3 .h3-c5-panel [class*="h3-title"] em` in embed 84f7180f.
- Append to style h3b-paw: `.h3.h3-c5 .h3-c5-panel [class*="h3-title"] em{text-decoration:none}`
- Moves: paint only. The word stays italic and ink. Nothing shifts.
- Verify: computed text-decoration-line none on `.h3-c5-panel h2 em`. Trialed.
- Keep the other session's staged edits in this embed.
- Shot: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/home/shots/person-paw-1920-after-A-no-underline.png

#### B2. Embed 94ce12c0 (library and guides), style id h3b-rail. Apply only after the guides rebuild has landed, and merge, do not overwrite: the embed also holds style id h3-guides-v1.

**S12. "N min read" on one line across the cards** (audit: uneven baselines; no title is cut)
- Now: the minutes line sits 40, 71 or 101px below the title top at 1920, depending on title length.
- Append to style h3b-rail:
```
.h3-track .h3-card{display:flex;flex-direction:column}
.h3-track .h3-card .h3-card-meta{margin-top:auto;padding-top:10px}
```
- Moves: only the minutes line, to the bottom of each card. Card heights unchanged (742 / 648 / 549 at 1920 / 1440 / 390); the rail still pins. The 50 hidden cards keep their own `display:block !important`.
- Verify: on the six visible cards the minutes line has the same offset from the card top (713 at 1920, 619 at 1440, 520 at 390). Trialed.

**S13. Gap under the cards when the library is not pinned (phones and short windows)**
- Now: 108px from the cards to "More landing weekly." at 390 (122px at 768). The audit called this band sparse. The space is the pinned layout's bottom padding, which has no job when nothing is pinned.
- Append to style h3b-rail: `.h3-shelf:not(.is-pinned) .h3-shelf-pin{padding-bottom:16px}`
- Moves: gap 108 to 56px at 390, 122 to 56px at 768; the page gets 52px shorter at 390 and 66px at 768. The pinned desktop layout does not change.
- Verify: cards bottom to `.h3-shelf-foot` top is 56px at 390 and 768. Trialed.

**S14. Filter chip weight to a loaded weight (no visible change)**
- Now: `.h3-chip{...font-weight:700!important...}`. JetBrains Mono is loaded at 400 and 600 only, so it already renders as 600.
- Change `font-weight:700!important` to `font-weight:600!important` in the `.h3-chip` rule of style h3b-rail.
- Moves: nothing.

#### B3. Only when these embeds are next opened for another reason (not worth a write alone)

**S15.** Embed 84f7180f (style id tll-home3-v1): replace every `#cfcbc4` with `#C9C3B8` (rules `.h3-dark .h3-lede`, `.h3-legend`, `.h3-toggle button`, `.h3-gets span`). Light gray on dark; about 11:1 either way.
**S16.** Embed 405baa84: `.h3-steps span{...color:#cfcbc4}` to `#C9C3B8`.
**S17.** Embed a0d1cd97: `.h3-fd span{...color:#cfcbc4...}` to `#C9C3B8`.
- These three make the one warm gray on dark the same value the footer already uses. Not visible to the eye.

### Group C. Stories template (6a0b29eedc14f1444e935766)

Nothing to write. Every story fix above sits in the story layer, which is injected after the template's own code.

### After staging: one check run

On the staged test copy, signed out, at 1920x1080, 1440x900, 1024x768, 390x844: the "Verify" numbers above, no sideways scroll on home and on the three stories, and the hero text contrast (script /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/plan/check1.cjs with contrast1.py reads them; pass the test copy address through the `url` option of the page opener). Before and after of the hero as it will look with S1 and S2: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/plan/shots/sheet-stage-now-hero-1920.jpg (2x originals beside it: stage-now-hero-d1920-before@2x.png, stage-now-hero-d1920-after@2x.png, and the same for m390 and t1024).

## 3. Nancy decides

Ten questions, most important first. Each has a recommendation. The rest are in the table after them.

### N1. How wide and how large should story text be?

Now: 680px column, 17px / 1.7, 20.4px between paragraphs. That is about 95 characters a line on desktop (longest 104 to 106), not the 85 the audit counted. The kit (v2.3 rule 1) already says 18px, line height 1.65, 60 to 75 characters. The 18px never shows because an older 17px rule in the site head wins.

Measured on four stories (characters per line average / longest; paragraph lines; page height at 1920):

| Option | Characters | Morocco (9 photos) | Balkans (text only, 1,791 words) | Short story (174 words) | La Tomatina (12 photos) |
|---|---|---|---|---|---|
| Now: 680px, 17px / 1.7 | 95 / 104 | 71 lines, 21,689px | 119 lines, 12,858px | 13 lines, 4,997px | 96 lines, 25,066px |
| A. Size only: 680px, 18px / 1.65 | 90 / 99 | 72, 21,848 (+159) | 127, 13,221 (+363) | 13, 5,010 (+13) | 98, 25,246 (+180) |
| B. 560px, 18px / 1.65 (recommended) | 73.5 / 82 | 88, 21,499 (-190) | 152, 14,142 (+1,284) | 15, 5,151 (+154) | 117, 24,782 (-284) |
| C. 540px, 18px / 1.65 | 70.5 / 80 | 89, 21,437 (-252) | 155, 14,231 (+1,373) | 16, 5,181 (+184) | 122, 24,753 (-313) |
| D. Audit: 600px, 18px / 1.65 | 79 / 87 | 81, 21,570 (-119) | 141, 13,728 (+870) | 15, 5,127 (+130) | 109, 24,792 (-274) |

Phones (390): the column is the screen, so only the size changes anything. 46 characters a line become 44. Morocco 133 to 138 lines (+368px), Balkans 224 to 239 (+655px), short story 23 to 24 (+51px), La Tomatina 173 to 183 (+546px).

Photo stories get shorter on desktop because the photos shrink with the column; text-only stories get up to 10% longer.

Recommendation: B, with 24px between paragraphs (adds 27px on Morocco and 63px on Balkans on top of B). B is the widest column that puts the average line inside the kit's 60 to 75. The audit's 600px (D) leaves 79 characters, outside the kit and outside the audit's own 62 to 68 target. If only the size is wanted now, A is the kit rule as written and can be staged alone.

Second choice inside B: the Receipts, author card and pitch box stay 680px wide unless `:root{--st3-col:560px}` is added too. Recommended, so the page keeps one edge.

Lands in the story layer (replace line 61, edit line 62, add one rule; needs a layers release):
```
.tll-story-body>.w-richtext.tll-body{font-family:var(--mg-text-f) !important;font-size:18px !important;line-height:1.65 !important;color:var(--mg-text) !important}
.tll-story-body>.w-richtext.tll-body p,.tll-story-body>.w-richtext.tll-body li{font-size:18px !important;line-height:1.65 !important;color:inherit}
.tll-story-body>.w-richtext.tll-body p{margin:0 0 24px}
.tll-story-body-section .tll-reading-column.tll-story-body{max-width:560px !important}
```
Also moves: the short version box, pull quote, links card, sign-off and share row narrow with the column; the drop cap grows from 61 to 65px; photos in the text keep their 100px bleed. Look at: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/story/shots/body-text-1920-before.png and /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/story/shots/body-text-1920-after.png (1440 pair in the same folder).

### N2. Should photos inside a story be shown whole?

Now: every photo in story text is cropped to a square as wide as the figure (880x880 at 1920x1080, 853x853 at 1440x900, 342x342 at 390). A 3:4 portrait loses 25% of its height, a 16:9 landscape loses 44% of its width. This looks like an accident: the square rule for the end gallery grid (story layer line 125) also catches photos in the text. 11 of 57 stories have photos in the text.

Options:
- a) The audit as written: natural shape, capped at 70% of window height, cropped to fit. Portraits lose more than today (36% of height at 1080, 45% at 900).
- b) Whole photo, never taller than 70% of the window, centered (recommended). A portrait becomes 567x756 at 1920, 473x630 at 1440, 342x456 at 390. Landscapes show whole at full width.
- c) Keep the squares.

Recommendation: b. Members' photos are shown as taken, and the page gets shorter: Morocco -1,692px at 1920, -2,005px at 1440, -170px at 390; La Tomatina -2,324 / -2,823 / -35.

Lands in the story layer after line 115:
`.tll-story-body .tll-inline-photo img.tll-gallery-img{aspect-ratio:auto !important;width:auto !important;max-width:100% !important;max-height:70vh !important;margin:0 auto}`
The end gallery grid keeps its squares. Look at: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/story/shots/crop-portrait-morocco-palace.png, /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/story/shots/crop-landscape-tomatina-16x9.png, and the pair body-portrait-1920-before.png / body-portrait-1920-after.png in the same folder.

### N3. How dark should the home hero photo be?

Now, desktop: two shades are stacked. The page's own overlay (42%, 22%, 78%, 94% ink from top to bottom, full width) sits under the cover layer's lighter side shade, so the lower 40% of the photo is 78 to 94% ink everywhere. That breaks kit v2.2 rule 4 (no heavy dark overlay across the whole photo) and is what the audit saw.
Now, phone: the kicker "THIS WEEK'S COVER" (12px) measures 2.7:1 against the photo (3.1:1 at full opacity). That is under the 4.5:1 floor, so something has to change on phones whatever is chosen for desktop.

Options:
- A. Leave as is (not possible for the phone kicker).
- B. Text-side shade only, tested (recommended): switch the page overlay off from 768px up and use one left-to-right shade. Every hero text line stays at 4.5:1 or better on its lightest pixel at 1920, 1440 and 768 (kicker 10.2:1, paragraphs 6.0:1 or better), and the right half of the photo gets 2.5 times brighter. On phones, a slightly stronger band behind the kicker and full opacity: kicker 8.0:1, headline 11.3:1; the hillside behind the photo chip gets darker.
- C. B, and also switch on the brightness line that is in the source but never applies (line 56 is cancelled by line 10). Not tested for contrast.

Recommendation: B. The contrast numbers for B were measured with the hero text at its present position; if S1 is staged first, re-measure (text moves toward the darker side, so it should not get worse).

Lands in cover.template.html (layers release). Desktop, inside the 768px block: add `html body:not(.tll-none) [data-h3-hero] > div:empty{background-image:none !important}` and replace the gradient on line 55 with
`linear-gradient(90deg,rgba(10,11,20,.82) 0%,rgba(10,11,20,.74) 30%,rgba(10,11,20,.5) 50%,rgba(10,11,20,.14) 68%,rgba(10,11,20,0) 84%),linear-gradient(180deg,rgba(10,11,20,.3) 0%,rgba(10,11,20,0) 18%,rgba(10,11,20,0) 60%,rgba(10,11,20,.5) 100%)`.
Phone: line 11 gradient becomes `linear-gradient(180deg,rgba(10,11,20,.32) 0%,rgba(10,11,20,.12) 16%,rgba(10,11,20,.5) 30%,rgba(10,11,20,.6) 60%,rgba(10,11,20,.84) 100%)` and line 19 `opacity:.85` becomes `opacity:1` (tested with the page overlay left on at phone width).
Look at: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/home/shots/person-hero-1920-before.png and person-hero-1920-after-sim.png in the same folder; phone: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/home/sim/hero-m390-P_live.png and hero-m390-P_fix.png.

### N4. The hero credits the photo twice. Which one stays?

Now, at all three widths: a chip with Nancy's face above the kicker ("Photo: Nancy Carleton / Morocco", links to her contributor page) and a text line under the buttons ("Photo Nancy Carleton · Morocco", no link).

Options:
- A. Keep the chip, hide the line (recommended): the chip is the designed element and carries the link. `html body:not(.tll-none) [data-h3-hero] .tll-mg-by{display:none}`, and the room held before the script runs drops by 33.5px (lines 51 and 54: `margin-bottom:93.5px` to `60px`, `33.5px` to `0`) so nothing jumps.
- B. Keep the line, hide the chip (the audit's first choice): hide `.tll-mg-chip` and cut `padding-top:95px` (line 46) to 29px. The link to the contributor page is lost unless the line is made a link.

This removes content from view, so it is hers to choose. Lands in cover.template.html (layers release).

### N5. Which two section headlines keep the rose italic word?

Now: the kit (v2.3 rule 3) allows the rose italic word on the H1 and at most two section heads. Seven section heads carry one: "never stop going.", "payday.", "in one spot.", "who used to be you.", "Lounge.", "Write it down.", and the rotating closing word. Two more carry an italic word in another color (Paw Passport in ink, the Letter in Cream). The audit said the same: repeated on every section, the accent stops being an accent.

Options: any two of the seven. Recommendation: "Trips that can't wait for payday." (the first chapter) and "You went. Write it down." (the one display line, and the ask). The other five keep the italic and take the headline color.

Lands in embed 84f7180f: `.h3 [class*="h3-title"] em{font-style:italic;color:var(--h3-rose)}` becomes `color:inherit`, and the two keepers are named by their id (read the ids from the staged embeds) with `color:var(--h3-rose)`; the value headline follows in /home/user/thatlayoverlife/src/site-layers/tll-home-value-v1.js line 20. If "never stop going." is one of her two, its rose changes from #C8325B to #F0507A there so all accents match (3.26:1 on Paper, allowed at headline size).

### N6. One heading scale on the home page?

Now at 1920: H1 86px. H2s at 44, 44, 64, 80 (six), 100 (two), 138. Three H2s are larger than the H1. All are Playfair Display 800. The 64 is an accident (a site head rule overrides the 52px the value layer asks for).

Options:
- A. Three sizes (recommended): label 44, section 80, one display line 138. "Trips that can't wait for payday." and "Your inbox deserves better than deals." go from 100 to 80 at 1920 (92 to 75 at 1440, 42 to 36 at 390). The value headline stays at 64 for now. Then the H1 is larger than every H2 but one.
- B. A, and the value headline also to the section size (80) or back to its intended 52.
- C. The audit's numbers (H1 96, H2 72, library label 160). Not recommended, see section 5.

Lands in cover.template.html line 73: `.h3-title-xl{font-size:clamp(36px,5.2vw,80px) !important}` (layers release). Moves the line breaks of those two headlines and the height of their sections; check 390 and 1440.

### N7. Paw Passport panel: crop the photo so the section fits a screen?

Now: the section is 1,441px tall at 1920 (1,081 at 1440) because the 2:3 photo sets the height. The text block is about 570px, with 433px of plain rose above it and about 440px below. Phones are fine.

Options:
- A. Leave.
- B. Let the section fall back to its own height (recommended): 880px at 1920x1080, 859px at 1440x900. The photo is cropped top and bottom at its present focus; Magnus's face and the caption stay in. The page gets 561px shorter at 1920 and 222px at 1440.

Lands in embed a4c1009d, style h3b-paw: `@media(min-width:900px){.h3-c5-ph img{position:absolute;inset:0}}`. It crops her photo, so it is hers to choose. Look at: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/home/shots/person-paw-1920-before.png and person-paw-1920-after-B-no-underline-880-tall.png in the same folder.

### N8. One chip style, and what happens to the rose "Countries, too: join free" pill?

Now: three chip styles, all pills, all 44px tall: interest chips (Plex 17px / 600, sentence case), filter chips (JetBrains Mono 12px caps), search suggestions (JetBrains Mono 12px / 400, as typed). The join pill is filled #C8325B with a white label. The kit says fills are for buttons (square, #D63859) and chips are never buttons, so the pill fits neither rule.

Two choices:
1. Chips. Option A (recommended): one chip everywhere: JetBrains Mono 12px / 600, 1.5px letter spacing, 44px tall, 16px side padding, 1.5px Midnight outline, pill; selected is Midnight with a Cream label. Filters and interest chips in caps through CSS (the words in the page stay as written); search suggestions keep the typed case, because in caps they wrap to two rows at 390. Trialed: one row on desktop, three rows at 390, box heights unchanged. Option B: leave the interest chips in Plex and only align the two mono styles.
2. The join pill. Option A (recommended): the kit's text link after the row (Plex 600, Midnight, 2px #C8325B underline), same words. Option B: an outlined chip like its neighbors. This is the value section's sign-up link and has its own click event (value_join_click), so compare that count for two weeks before and after.

Lands in tll-home-value-v1.js lines 26 and 28 (layers release), embed 94ce12c0 `.h3-chip` (padding 0 20px to 0 16px), embed 84f7180f `.h3-try a` (weight 600, padding 0 16px). Text link rule for line 28:
`.tll-val-ask a.p{border:0;border-radius:0;padding:0;background:none;color:#0A0B14;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:5px}` and `.tll-val-ask a.p:hover{background:none;color:#C8325B}`.
Look at: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/system/after-1920-val@2x.png, after-1920-intro-chips@2x.png and after-390-val@2x.png in the same folder.

### N9. On phones, should the library come before "Why That Layover Life"?

Now at 390x844: the first story title is 2,918px down, about three and a half screens. Above it: nav 103px, hero 748px, value section 1,050px, chapter intro 409px, library label 156px, then the card's photo.

Options:
- A. Leave the order (the Value Playbook put that section second on purpose).
- B. On phones only, insert the value section after the library (recommended, with the check below). Trialed: first story title at 1,869px (2.2 screens). Cutting the intro's top padding on phones from 101 to 56px takes another 45px. Desktop unchanged.

Lands in tll-home-value-v1.js line 49 (insert after embed 94ce12c0 on phones; layers release). The section was moved to "before first paint" on 7 Nov to stop a layout shift of 0.70. Below the library it should land under the first screen, but the shift has to be measured again before this is published. Look at: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/system/trial-390-library-up@2x.png

### N10. A one-line Receipts summary under the story byline?

Now: the Receipts block is the best trust device on the site and starts 70 to 90% down the page (85% on Morocco).

Options:
- A. Leave.
- B. Add one linked line under the byline, built from the block's own rows (recommended): "Edited by Nancy Carleton · Sources listed · Published 2 August 2024". It prints nothing unless two facts exist. Across 57 stories: full line on 45, "Edited by" plus "Sources" on 4, nothing on 8. One line on desktop, two at 390, 40px tap height, adds 46px to the head.

Not as the audit wrote it: "Last updated" is filled on 1 of 57 stories, so the line uses Published, and Updated when it exists.
Second choice: the look. The kit's text link is Plex 600 Midnight with a 2px rose underline; the audit asked for 12px mono. The mock uses mono 12px #6B6660 with a rose underline. Recommendation: the mock (it sits with the mono byline details), if she accepts it as a kit exception for metadata.

This adds words to every story page, so it is hers. Lands in the story layer (script after line 157 plus one CSS rule; layers release). Code: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/story/proposed-receipts-line.js and proposed-nancy-decides.css (rule D6) in the same folder. Look at: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/story/shots/proposed-all-hero-1920.png and proposed-all-hero-390.png.

### The rest, in one table

| # | Question | Now (measured) | Options | Recommendation | Lands in |
|---|---|---|---|---|---|
| T1 | Story title: fewer lines on desktop? | 72px, max width 16 characters; Morocco wraps to 4 lines. Of 57 titles: 12 on one line, 23 on two, 12 on three, 7 on four, 3 on five. | 16ch (now), 20ch, 22ch | 22ch: 25 / 23 / 7 / 1 / 1; Morocco 3 lines, head 74px shorter. Phones unchanged. | Story layer line 51 (`16ch` to `22ch`) |
| T2 | Story eyebrow color: rose or teal? | #C8325B, 4.60:1. The kit reserves teal for the eyebrow above a headline; the 26 Oct direction says rose means "you can press this", and this is not a link. | Rose (now), Deep Teal #067A79 (also 4.60:1) | Teal, per the kit. | Story layer lines 29 and 32 (`--mg-rose` to `--mg-teal`) |
| T3 | Story text color: #2A2A2A or Midnight? | #2A2A2A, 13.7:1 on Paper. | Keep, or `--mg-text:#0A0B14` (also changes excerpt, short version box, sign-off) | Keep. No contrast gain worth the change. | Story layer line 10 |
| T4 | Paw Passport button: allow a Midnight fill on the rose panel? | Outlined ink on rose since 10 Nov, because the kit has one fill only (#D63859), and that fill on #F0507A is about 1.3:1 against the panel. | Keep outlined; or a written kit exception: "on a Sunset Rose panel the main button is Midnight with a Cream label" | Keep outlined unless she adds that line to the kit. If she does: `html body .h3-c5-panel .h3-btn.h3-btn-ink{background:#0A0B14 !important;color:#F7F1E8 !important;border-color:#0A0B14 !important}`, hover `#23263C`. The same exception would help the Letter's subscribe button, which sits on the same rose. | Embed a4c1009d |
| T5 | Value headline size | 64px by accident (layer asks for 52px). | 64, 52, 80 | With N6: leave at 64 until she sees the two 80s. | tll-home-value-v1.js line 20 |
| T6 | The white "What do you collect?" box | #FFFFFF, the only white surface on the page (1120x86). | White, Cream #F7F1E8 | Cream, if she wants two off-whites only. The kit does speak of white cards, so white is not wrong. | tll-home-value-v1.js line 24 |
| T7 | Phone side margin: 20px or the kit table's 24px? | Page gutter 20px at 390 (16px in hero and value section today; 20px after S1 and S10a). The kit's v2 token table says 24px minimum. | 20, 24 | Ask whether the v2 table still binds. If yes: floor of `--h3-g` from 20px to 24px. | Embed 84f7180f |
| T8 | Should the cover date be readable? | The date exists only inside the stamp drawing: 7.1px on the desktop hero, 4.6px on the phone hero, about 3px on library cards. The place is repeated as real text; the date is not. | Leave as decoration; or add the date as real text (hero kicker or credit line; card meta line) | Her call (it adds words). Making it 11px inside the stamp is not possible, see section 5. | cover.template.html; embed 94ce12c0 |
| T9 | "Read the stories" link after the library on desktop | Hidden while the library is pinned, so desktop has no link to all stories right after the cards. | Leave; or move the foot inside the pinned block | Show it. Needs a markup change, not only CSS. | Embed 94ce12c0 (after the guides rebuild) |
| T10 | Clamp library card titles? | With S12 the row is tidy and no title is cut. | No clamp; 3 lines (cuts 2 to 3 of 56 titles); 2 lines (cuts 6 to 12) | No clamp. | Embed 84f7180f |
| T11 | Hero photo: the muleteer at the edge | He spans 92 to 98% of the width; the photo is cropped top and bottom only, so he cannot be moved sideways. On phones he is out of frame. | Accept; or choose another frame of the scene | Accept. N3 option B makes him readable where he is. | Cover photo choice |
| T12 | Stamp half over the hero's bottom corner (audit) | Stamp sits top right. | Leave top right (after S2); or move it, which needs the hero's `overflow:hidden` lifted | Leave. | cover.template.html |
| T13 | The kit contradicts itself on stamps | Section 14 still says "never passport-stamp graphics" and "never luggage-tag motifs"; v2.4 rule 3 treats the cover stamp as part of the site. | Strike one | Strike the two "never" lines, since the stamp and tag are live by her own direction. | /home/user/thatlayoverlife/handoff/TLL-BrandKit-v2.6.html (next kit version) |
| T14 | Hero brightness line that never applies | Line 56 `filter:brightness(1.14) saturate(1.06)` is cancelled by line 10. | Delete the dead line; or switch it on (N3 option C) | Decide with N3. | cover.template.html |
| T15 | Subheads inside stories | 30px / 1.15 from a site head rule; the layer asks for 28px / 1.1. | Leave; or let the layer win | Leave. Noted only. | Story layer line 64 |
| T16 | Story hero photo height | 1200x820 at 1920 (76% of the window), 1200x765 at 1440 (85%); a portrait hero shows 55% of its height. | Leave; or lower the cap | Leave for now; decide after N2. | Story layer line 53 |

Noted, no action proposed: the two hero paragraphs open alike ("True trip stories..." and "Travel stories from people who left the airport..."); both are deliberate. Captions under photos in story text are file-name text; already logged in /home/user/thatlayoverlife/claude/findings-2026-11-09/design-review-items.md. Section padding doubles where two sections meet (209 to 240px content to content on desktop); it is consistent everywhere and belongs to the heading scale decision.

## 4. Nancy present (shared nav, footer, "Tell the editor")

| # | Item | Now (measured) | Smallest fix, ready when she is |
|---|---|---|---|
| P1 | "Tell the editor" dot over story text on phones | A 44x44 dot fixed at left 16px, bottom 16px covers the first 36px of any line that passes. On Morocco at 390: over body text at 39% of scroll stops, over photos at 27%. On desktop the pill never touches text. | Same pattern as the footer layer: on /stories/{slug} under 960px, set `html.tll-note-wait` at load and drop it the first time `[data-tll-ledger]` enters the screen; CSS `@media(max-width:959px){html.tll-note-wait #tll-note:not([data-open="true"]):not(:focus-within){opacity:0;visibility:hidden;pointer-events:none}}`. The Receipts note and the feedback block both already offer "Tell the editor". Files: /home/user/thatlayoverlife/src/site-layers/tll-note-phone-v1.html, /home/user/thatlayoverlife/src/site-layers/tll-note-footer-v1.js. Shot: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/story/shots/phone-note-over-text-390.png |
| P2 | Nav avatar shows "N" before the photo | Not a per-page difference: on every page load Memberstack writes the initial, then the site script (tllavatarv1 1.0.0) paints the photo once the member answer arrives. The audit caught the first state. Read from code and a simulated member view; not checked signed in. | Remember the photo address for the session: after the member answer `sessionStorage.setItem('tllAv',url)`; at boot, if present, paint it at once (tllavatarv1 1.0.1 or one small layer). Optional: the initial's font names two faces that are not loaded; set IBM Plex Sans Condensed 600 on Webflow class `.tll-nav-avatar`. |
| P3 | Phone nav is crowded | Signed out at 390: bar 103px, two rows, not sticky. Row 1: wordmark 124x22. Row 2: "Share your story" outlined 122x40, "Log in" text, "Sign up" filled 70x44, "MENU" outlined 60x44. Heights 40, 44, 44, 44. Signed in (the audit's view) the account chip replaces Log in and Sign up, giving three outlined boxes. | The audit's proposal: wordmark, avatar and MENU only, with "Share your story" moved into the menu and the hero. Kit notes to settle at the same time: nav buttons are 40px in the kit (live 44 for three of them), the kit says the phone menu button keeps a rounded shape (live square), MENU is weight 700 (kit: 400 or 600). File: /home/user/thatlayoverlife/src/site-layers/tll-nav-phone-v1.html lines 10 to 19. Shot: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/system/shot-390-nav@2x.png |
| P4 | Nav and footer columns do not match the page column | Page column 1240px (left edge 340 at 1920). Footer 1120px (left 400). Nav 1440px (left 240). | Footer class max-width to 1240px with the page gutter; nav is a choice (a wider bar is common). |
| P5 | DM Sans and DM Serif Display names | Still named on 6 nav links, the hidden phone-menu "Share your story" link (class tll-nav-link, variable `--_typography---tll-font-body`), "that" in the nav wordmark (class tll-nav-logo-that) and "that" in the footer wordmark. The site head maps the names to the Plex and Playfair files, so nothing wrong shows. | Remap the two Webflow classes and /home/user/thatlayoverlife/src/site-layers/tll-footer-wordmark-v1.html line 6 to the real family names. No visible change. |
| P6 | Nav wordmark "that" | Live text, three spans, 167x26 at 1920 (124px wide at 390). "that" asks for italic weight 400, has no such file, and renders as Playfair ExtraBold slanted by the browser. The kit's logo rule says "that" is light weight. Syne is not used, which fits the kit (wordmark artwork only). | Either load a light italic for that one word or swap the text for the wordmark artwork. A choice, no fix proposed. |
| P7 | Grays and off-whites in the nav and footer | #C9C3B8 (21 footer links), #B9B3A8 (footer masthead and stat labels), #8A857B (copyright), #F8F2E6 (nav links, footer wordmark), #F7F4EE (nav wordmark). All pass 4.5:1. | If she wants one warm gray: #C9C3B8, and Cream #F7F1E8 for the two near-creams. |
| P8 | Current-page state on nav links | The audit saw none. Not rechecked in this round. | The audit's proposal: 2px rose underline under the active link. Check live first. |

## 5. Not recommended

| Audit suggestion | Why not |
|---|---|
| "#D63859 for anything clickable" | Against the kit for links and small text: #D63859 on Cream is 4.09:1 and fails 4.5:1. The kit's text rose #C8325B stays for links and small text; #D63859 stays for the filled button only. Live already follows this (seven filled controls, never text). |
| Chip height 36px, weight 500 | The kit's tap floor is 40px and chips are 44px now. JetBrains Mono is loaded at 400 and 600 only, so 500 would not render. See N8 for the kit-safe version. |
| 48px for every button outside the nav | The kit keeps the search button compact at 44px. Real buttons already follow the kit. |
| Paw Passport button filled ink with a cream label, as a quick fix | That was the look until 10 Nov; the kit (v2.4 rule 1) allows one fill, #D63859. Only as a written kit exception (T4). |
| Story column 600px | Leaves 79 characters a line: outside the kit's 60 to 75 and outside the audit's own 62 to 68 target. 560px is the widest that fits (N1). |
| Story photos capped at 70vh with object-fit cover | Crops portraits harder than today (36 to 45% of the height cut). The whole-photo version in N2 gets the same calmer page with no crop. Removing the square rule with no cap at all would make portraits 880x1173, taller than the window, so that must not ship alone either. |
| H1 96px, section H2 72px, "The library." kept oversized at 160px with "Trips..." dropped to a 40px subhead | The double headline was solved the other way (library is the 44px label). 96 and 72 match neither the kit's old numbers nor the live 80, and would re-wrap every section head for no measured gain. N6 option A reaches "H1 above the H2s" by changing two headlines. |
| Clamp library card titles to two lines | Cuts 6 of 56 titles at 1920, 12 at 1440, 9 at 390, including the current cover story. S12 tidies the row without cutting anything. |
| Stamp date at 11px or more inside the stamp | The date is 9.5 units of a 200-unit drawing; 12px text would need a 253px stamp. If the date should be readable it has to be real text (T8). |
| Muleteer repositioned to 75% of the width | The photo is cropped top and bottom only; moving him would need a 5x zoom. |
| "Last updated" in the line under the byline | Filled on 1 of 57 stories. Use Published (N10). |
| Removing the dark overlay alone | Without a replacement the 12px kicker drops to 4.2 to 4.5:1 and the worst 5% of the 20px paragraph to 3.9:1 at 1920. Use the tested text-side shade (N3). |
| Collapse the off-whites as a task | Already two surfaces plus one white box (T6). #F8F2E6 is not a surface. |
| Delete the DM Sans and DM Serif classes as a quick fix | They are in the shared nav and footer and change nothing on screen (P5). |
| Hide the Layover guides section; merge "Trips..." into the library intro; remove "Par avion" | Already done or overtaken (section 1). |

## 6. Suggested order

1. Stage Group A (one layers release) and B1 now. B2 as soon as the guides rebuild is in. One check run.
2. Ask Nancy N1 to N4 first: N1 and N2 change every story, N3 holds the one measured contrast failure (phone kicker 2.7:1), N4 is quick. All four land in the same layer files as Group A, so answers that arrive before the release is cut can ride in it.
3. N5 to N10 and the table when she has time to look at the screenshots.
4. Section 4 in one sitting with her, phone nav and the phone "Tell the editor" dot first.

## Files

- This list: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/plan/visual-audit-fix-list.md
- This pass (trial sheets, scripts, measurements, shots): /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/plan/ (stage-now-home-trial.css, stage-now-story-trial.css, check1.cjs to check5.cjs, check4b.cjs, contrast1.py, check1.json, check2.json, check4.json, check4b.json, shots/)
- Home recheck: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/home/
- Scale, alignment and controls recheck: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/system/
- Story recheck: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/story/

Limits: signed out only (the nav avatar and the signed-in phone nav are from code and a simulation); headless Chromium, not a real iPhone; hover states checked for the two hero buttons only; whether the page overlay class on the hero is used on any other page was not checked (the N3 fix targets the hero's own empty div and does not touch the class).
