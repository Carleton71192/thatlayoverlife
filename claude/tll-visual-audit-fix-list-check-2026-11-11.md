# Check of the "Stage now" fix list (S1 to S17), 11 Nov 2026

List checked: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/visual-audit/plan/visual-audit-fix-list.md
Measured on the test site https://that-layover-life.webflow.io (published 21:49:44 UTC, layers pin caac45af), signed out, headless Chromium, 1920x1080, 1440x900, 390x844, plus 1024x768, 768x1024, 1280x720 and 1366x768 where an item makes a claim there. Before values were also read on https://www.thatlayover.life (pin 3066315b). Nothing was written to Webflow, published, committed or pushed. Every request that was not a GET was aborted in the browser.

## Verdict

"Stage now" cannot be applied exactly as written. One item breaks the home page as written:

- **S12 (must_fix before applying):** appended to style h3b-rail as the list instructs, the first rule shows all 56 library cards in place of 6. One selector change fixes it (below).

With S12 corrected, S1 to S11 and S14 do what the list says at 1920, 1440 and 390, and nothing else on the page moves beyond what each item claims. S13 does what the list says, but it was measured before the rebuilt "Layover guides" band existed and now sits directly above it, so it needs one look before it goes in. S15 to S17 were checked for selectors only.

No Stage now item changes words, and none touches the nav, the footer or the floating "Tell the editor" button. Every proposed color passes 4.5:1 and every text size ends at 12px or more.

## Corrections

| # | Severity | Item | The list says | What is true | Evidence |
|---|---|---|---|---|---|
| 1 | must_fix | S12 | Append `.h3-track .h3-card{display:flex;flex-direction:column}` to style h3b-rail. "The 50 hidden cards keep their own `display:block !important`." "Card heights unchanged." | The 50 extra cards are hidden by the `hidden` attribute and the rule `.h3-card[hidden]{display:none}` in style tll-home3-v1 (same weight, earlier in the page). No card carries `aria-hidden="true"` (0 of 56). The appended rule comes later, wins, and shows all 56 cards. | Test site, rule appended at the end of h3b-rail: cards shown 6 to 56 at every width. Page height 16,099 to 40,099px at 1920x1080 and 14,126 to 34,517px at 1440x900 (the pinned sideways scroll grows by 24,000 and 20,391px). Card height 741.9 to 772.1 and 648.1 to 704.1. At 1024x768 the rail loses its pin (cards 336 to 266px wide). At 390 the swipe row holds 56 cards and the rail is 45px taller. Shot: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov11c/fixlist-check/shots/s12-as-written-1440.png |
| 2 | must_fix (the fix for row 1) | S12 | as above | Use `.h3-track .h3-card:not([hidden]){display:flex;flex-direction:column}` and keep the second rule as written. | With this rule at the end of h3b-rail: 6 cards shown, 50 hidden, card heights unchanged (741.9 / 648.1 / 549.5), minutes line at one offset from the card top on all six (712.7 at 1920, 618.9 at 1440, 520.3 at 390, 560 at 1024, 866.1 at 768), only the six minutes lines move (-10 to +50.5px), page height unchanged, pin state unchanged at all seven sizes, guides band unchanged. Holds after each of the four filter chips is pressed (55 or 50 hidden, 1 or 6 shown). Shot: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov11c/fixlist-check/shots/s12-corrected-1440.png |
| 3 | should_fix | S12, why the list missed it | "Trialed." | The list's trial sheet was injected into the head, which sits before the page's own styles, so `.h3-card[hidden]` still won there. I get the same clean result when the rule is the first rule in the head (6 cards, only minutes lines move). Placement decides the outcome. | Same page, same rule: first in head 6 cards shown; end of h3b-rail 56 cards shown. The check run after staging must read the real staged embed, not an injected sheet. |
| 4 | should_fix | S13 | Gap under the cards 108 to 56px at 390, 122 to 56px at 768. Nothing about what follows. | The numbers are right (107.5 to 56 and 121.9 to 56; page 52 and 66px shorter; pinned sizes do not move). But the rebuilt guides band now follows the foot line with a cream pause of 101px (390) or 112px (768), and its own comment says the pause is there "so the space under that line is not tighter than the space above it". After S13 the foot line has 56px above and 101 or 112px below. Before: 107.5 above, 101 below. Not broken, no selector clash, the band only moves up and keeps its height (835.7 at 390, 728.4 at 768). It is a spacing decision next to a block that was tuned today. | Shots: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov11c/fixlist-check/shots/s13-before-390.png and s13-after-390.png (768 pair beside them). S13 also acts at 1280x720 (page 11,586 to 11,545) and 1366x768 (12,092 to 12,046), where the rail does not pin. |
| 5 | note | S12 | "N min read on one line across the cards", card height 549 at 390. | At 390 the minutes line itself wraps to two lines on 8 of the 56 cards (for example "Stories From the Road · 7 min read"), and on 1 of 56 at 1280x720. When one of those is among the six, cards are 568.7px tall, not 549.5, and its first line sits one line higher than its neighbors. At 1920, 1440, 1024, 768 and 1366 no minutes line wraps. | All 56 cards measured with the corrected rule on: minutes line count 48 one line and 8 two lines at 390; 56 of 56 one line at 1920, 1440, 1024, 768, 1366. |
| 6 | note | S12 | "No judgment call." | It changes the look: on a card with a one line title the minutes line ends up 60.5px below the title at 1920 (56 at 1440, 45.3 at 390), where today it is 10px below on every card. It answers the audit, but it is visible. | Gap from title bottom to minutes line: today 10 on all cards; after 0, 30.2 or 60.5 plus the 10px padding at 1920. |
| 7 | note | S10a | Section height unchanged at 1920, 1440, 768, 390; 720 to 774 at 1024; pill wraps for windows of about 965 to 1035. | All confirmed (pill wraps from 970 to 1030 in 10px steps). Not listed: the section also grows 25 or 26px at 760, 820 to 840 and 1060 to 1120 wide, because the narrower cards take one more line of text. No sideways scroll at any width from 700 to 1440. | Sweep in /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov11c/fixlist-check/home3.json (for example 1100 wide: 705 to 730px). Shots: shots/value-ask-before-1024.png and value-ask-after-1024.png in the same folder. |
| 8 | note | S8 | "Moves: the Receipts block grows 2px; the page grows 6 to 8px." | Confirmed (Receipts +2.6px; page +8, +6, +8). Also moves, not listed: the "Been here" and "Want to go" buttons 17.8px to the right because the label before them gets wider, and the Receipts values 7.3px to the right. Nothing wraps and there is no sideways scroll at 390. | story-test.json, same folder; "sized" list per story. |
| 9 | note | S8, S6, S7 placement | "The position matters for S8." | Confirmed. At the end of style tll-mag-story-v1: 15 / 9 / 14 small text runs become 0. The same rule in the head (first or last) changes nothing (15 remain). S6 and S7 work in any position. | Morocco, Horseshoe Bend, Balkans at 1920, 1440, 390. |
| 10 | note | S7 | Dot on 55 of 57 stories. | Confirmed on all 57 test site stories: the fourth child of the row is the divider on 57 of 57; 55 show "pillar ·" today and show the pillar alone after; 2 have no pillar and show nothing before or after. The rule hides that divider always, so if the date after it is ever shown again the dot must come back with it. | /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov11c/fixlist-check/s7all.json |
| 11 | note | S9 | "Skip link to the kit's button shape." | Shape only: 166.5 x 38.4, 2px corners, weight 700 becomes 166.5 x 40, 0px, 600, on the home page, /stories, a story, /the-paw-passport and /layovers. The label stays JetBrains Mono 12px capitals with 1.5px spacing, where kit buttons are Plex 600 sentence case. Colors are untouched: white on #D63859, 4.6:1. Off screen, the idle link changes from block to flex with no effect on layout. | shots/skip-before-1440.png and skip-after-1440.png, same folder. |
| 12 | note | S16 | Embed 405baa84: `.h3-steps span` to #C9C3B8. | In the page that rule is in style id h3b-dash, which holds a second #cfcbc4 rule the list does not name: `.h3-dash-line`. The page has 8 uses of #cfcbc4; S15 to S17 as written leave one behind. S17's rule is in style id h3b-first100. | grep of the test site HTML. |
| 13 | note | List header and "Rules" | "94ce12c0 is being rebuilt by another agent", "apply only after the guides rebuild has landed". | The rebuild is on the test site. The embed holds, in order: the chapter intro, the library section, style h3-guides-v1 (9,218 characters), style h3b-rail (6,486), script h3-shelf-js. Rendered it is 37,181 characters. S12 to S14 edit h3b-rail only, which comes after the guides style. | fetched/test-home.html, same folder. |
| 14 | note | Section 1 (not Stage now) | "#F8F2E6: not a surface anywhere now." | On story pages the block that holds the in-page "TELL THE EDITOR" label has background rgb(248, 242, 230), which is #F8F2E6. | Computed background behind `.tll-story-feedback .tll-eyebrow-teal` on all three stories. |

## Collision check with the rebuilt "Layover guides" row

- Selectors: every rule in h3-guides-v1 is scoped to `[data-h3-guides]`, except `.w-embed:has(>.h3-shelf:not(.is-pinned))~[data-h3-guides]` (the cream pause). S12, S13 and S14 target `.h3-track .h3-card`, `.h3-shelf:not(.is-pinned) .h3-shelf-pin` and `.h3-chip`. No shared selector, no shared property.
- Measured: with corrected S12 and with S14, 0 of the band's elements move at any width. With S13 the band moves up by 51.6px (390) and 66px (768) and keeps its height, its 2 rows and its cream pause.
- Merge rule stands: edit the text of style h3b-rail inside the staged embed and leave style h3-guides-v1 above it as it is. Do not paste a saved copy: the www copy of h3-guides-v1 is the old one (3,852 characters).

## What I measured, item by item (test site)

| Item | Selector and "before" | After the proposed CSS | Other movement |
|---|---|---|---|
| S1 | Hero chip, kicker, H1, both paragraphs, buttons, credit all start at 412 / 172 / 16. Correct. | 340 / 100 / 20. H1 still 2 lines, paragraphs still 3 and 2 lines, hero height unchanged (860 / 792 / 748), buttons 358 to 350px at 390. At 1024 and 768 nothing moves (51.2 and 38.4). No sideways scroll. | 16 hero elements move 72px left on desktop, 15 move 4px right at 390. Nothing outside the hero. Text against the photo is not lower: H1 lightest pixel 4.80 to 5.54:1 at 1920, kicker 5.43 to 5.69:1. |
| S2 | Stamp x 1754 to 1904, top 97 at 1920 (right 16px, top 20px). Correct. | x 1698 to 1848, top 109 at 1920; 1218 to 1368 at 1440; 579.6 to 729.6 at 768; 822.8 to 972.8 at 1024; unchanged at 390 (278 to 374). The Letter stamp does sit at 72 / 32. | Stamp and its drawing only. With S1 also on, the stamp overlaps no hero text at any of five widths. |
| S3 | Hover rgb(184, 44, 75). Correct. | rgb(200, 50, 91). White label on it 5.17:1. Kit: "On hover it turns #C8325B." | 0 elements move. |
| S4 | Hover fill rgb(247, 241, 232), label rgb(13, 15, 26). Correct. | Fill Cream at 12%, label stays rgb(247, 241, 232). Kit: outlined buttons add "a 12% tint of that color". | 0 elements move. |
| S5 | Paragraphs rgb(232, 226, 216), credit rgb(185, 179, 168). Correct. | rgb(247, 241, 232) and rgb(201, 195, 184). Credit against the photo 8.87 to 10.55:1; first paragraph at 390, lightest pixel, 4.62 to 5.30:1. | 0 elements move. |
| S6 | List items rgb(58, 58, 58), paragraphs rgb(42, 42, 42). Correct. 43 of 57 stories have list items. | rgb(42, 42, 42), 13.68:1 on Paper. | 0 elements move. |
| S7 | Row shows "Stories From the Road ·". Correct. | Dot gone on 55 of 55. | Row 15.2px narrower, nothing else. |
| S8 | 10px, 10.5px and 11px on the nine selectors; all nine match. Correct. | All 12px, one line each. Small text runs 15 / 9 / 14 to 0 at 1920, 1440 and 390. Colors unchanged: #6B6660 on Paper 5.42:1, on the feedback block 5.1:1, Deep Teal #067A79 on Paper 4.92:1, Midnight 18.7:1. | See correction 8. The label named "TELL THE EDITOR" is inside the story page, not inside #tll-note. |
| S9 | 166.5 x 38.4, radius 2px, weight 700. Correct. JetBrains Mono is loaded at 400 and 600 only. | 166.5 x 40, radius 0, weight 600. | Skip link only, 1.6px taller. |
| S10a | Eyebrow, H2, lede, cards, box at 400 / 160 / 16; cards 361.3px; box 1120px. Correct. | 340 / 100 / 20; cards 401.3px; box 1240px; section 730.5 unchanged at 1920 and 1440, 1049.5 unchanged at 390; 51.2 at 1024, 38.4 at 768. | 22 elements inside the section. At 1024 everything below moves 54px down, as the list says. See correction 7. |
| S10b | rgb(58, 56, 51). Correct. | rgb(58, 58, 58), 10.84:1 on Paper. Not a kit color, and neither is the one it replaces. | 0 elements move. |
| S11 | `.h3-c5-panel h2 em`: underline, 3px. The section does carry both classes h3 and h3-c5. Correct. | text-decoration-line none; still italic, still rgb(10, 11, 20). Works at the end of h3b-paw and as the first rule in the head. Kit: "Never put an accent line under a title." | 0 elements move. |
| S12 | Minutes line 40.2, 70.5 or 100.7px below the title top at 1920. Correct. | As written: breaks (correction 1). Corrected: one offset on all six cards. | Corrected: six minutes lines only. |
| S13 | 107.5px at 390, 121.9px at 768. Correct. | 56px at both. | Everything below moves up 51.6 or 66px. See correction 4. |
| S14 | `.h3-chip` weight 700. Correct. | 600. Chip widths unchanged (68.1, 181.2, 224.7, 224.7) and a screenshot of the chip row is the same file byte for byte before and after. | 0 elements move. |
| S15 to S17 | #cfcbc4 is in the four S15 rules, in `.h3-steps span` and in `.h3-fd span`. | Not trialed. #C9C3B8 on Midnight is 11.19:1 (today 12.13:1). | See correction 12. |

## www against the test site

- Every "before" value for S1 to S14 is the same on both. The layer code the items edit is identical in the two bundles (they differ only in two lines of checksums for /submit and /share-photos), and styles h3b-paw, h3b-rail and tll-home3-v1 are identical character for character.
- The one difference is the guides section: on www style h3-guides-v1 is the old one (3,852 characters, 40px top padding, no cream pause); on the test site it is the new band (9,218 characters, 96px top padding at 1920, cream pause when the rail is not pinned). Page height at 1920x1080 is 16,099px on the test site and 15,946px on www; at 1440x900 14,126 and 13,984.
- Which six cards show in the library changes from load to load on both sites, so per-card numbers differ between two readings of the same page.

## Source lines

Checked at HEAD 80cecb2; src/ is unchanged since fc9c865, the commit the list names. Every quoted line holds the quoted text: cover.template.html lines 12, 22, 26, 29, 33, 35, 58, 63; tll-mag-story-v1.html lines 73, 80, 85, 109 (all 11px) and `</style>` on 128; tll-buttons-v1.html line 25 and `</style>` on 44; tll-v9-chrome-v1.html line 4; tll-home-value-v1.js lines 18, 19, 21, 23, 30; tll-ux-1028-v1.js line 16. build-cover.py and build-site-layers-v16.py exist where the list says.

## Taste, words, shared components

- Words: no Stage now item adds, removes or changes a word. S7 removes a dot drawn by CSS.
- Shared components: none touched. The skip link (S9) is a direct child of the body on every page, outside the nav. S8 changes a label inside the story page that reads "TELL THE EDITOR"; the floating button is not matched by any S8 selector.
- Judgment calls inside "Stage now": S12 (correction 6), S13 (correction 4), and S10a at 970 to 1030 wide, which the list already flags.

## Also seen, outside Stage now

- note: the phone hero kicker "THIS WEEK'S COVER" (12px) measures 2.47:1 at its lightest pixel and 2.71:1 median against the photo at 390, before and after S1. The list holds this under N3. It is on www today and Stage now does not change it.

## Not checked

- The Stories template footer code lines (268, 272, 289, 292) and the embed ids (a4c1009d, 94ce12c0, 84f7180f, 405baa84, a0d1cd97): the Webflow element tools were off limits. Embeds were identified by their style ids in the published HTML.
- Signed-in views, real phones, and hover states other than the two hero buttons.
- For layer edits (S1 to S5, S10, S14) I replaced the quoted text inside the live style element, and for appended rules I appended to the named style element, because that is where the code will sit. page.addStyleTag alone would have hidden correction 1 and would have failed S8.

## Files

Folder: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov11c/fixlist-check
- This report: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov11c/fixlist-check/report.md
- Scripts: home.cjs, home2.cjs, home3.cjs, story.cjs, s7all.cjs, chip.cjs, misc.cjs, contrast.py, lib.cjs
- Measurements: home-test.json, home-www.json, home2.json, home3.json, story-test.json, story-www.json, s7all.json
- Shots (2x): shots/s12-before-1440.png, s12-as-written-1440.png, s12-corrected-1440.png (and the 390 set), s13-before-390.png, s13-after-390.png, s13-before-768.png, s13-after-768.png, hero-before-1920.png, hero-after-1920.png (and 1440, 390), value-before-1440.png, value-after-1440.png, value-ask-before-1024.png, value-ask-after-1024.png, skip-before-1440.png, skip-after-1440.png, paw-before-1440.png, paw-after-1440.png
