# Nav and footer variant, prototype for a session with Nancy (1 Nov 2026)

UX Phase 3, items 1 and 2 from `docs/expat-pets-ux-2026-10-31.md` ("Nav and footer variant, prepared only"). **Nothing here is applied to the site.** The nav and the footer are shared Webflow components, and the standing rule is to change them only with Nancy present. This folder is the thing to look at together.

The sandbox cannot reach thatlayover.life, so everything was built from saved code. The prototype reuses the live class names, ids, form names and copy, so each change maps to one Designer or code step below. Fix pass of 1 Nov: see "Critic notes" at the end for what changed since the first draft and why.

## What "today" means in this folder

The saved element trees of the two components are the **13 Oct export** (`src/pages/heroes-2026-10-29/build_fixtures.py` line 2: "nav and footer from the 13 Oct export"; the same trees sit in `src/design/magazine-2026-10/cover-build/fixture-home.html`). Both components were edited and published after that, on **20 Oct 2026 07:00 UTC** (`handoff/STATUS.md` S91 and S92, `src/components/footer/HANDOFF-NOTE-2026-10-20.md`, `handoff/CHANGE-LOG-PACKET-A-2026-10-19.md`):

- Nav: link `7593d683` "Destinations" (`/destinations` in the 13 Oct tree) became "The Map" (`/the-map`) placed after Travelers, and a new link `a4874c6a` "Expats" (`/for-expats`) was added after it (Packet A row A1.1: "Stories, Travelers, The Map, Expats, Paw Passport, About. Destinations leaves the nav"). So the live nav has **six** links, not the five in the export. The post-20-Oct tree is not in the saved code, so six is the count on record, to confirm in the Designer (`docs/phase3-usability-audit-2026-11.md` lists both 20 Oct links as "(20 Oct note)" rows in its nav table, not in the export). One thing to settle at the same time: `handoff/STATUS.md` B40 (7 to 8 Oct) records that Nancy wanted Destinations in the nav, and Packet A A1.1 took it out on 20 Oct.
- Footer: rebuilt (S92, "A2 footer finished"): four columns (Read, Contribute with "For creators" before "For press", TLL, Legal with four links since there is no /colophon page), the stats line moved under the columns in the order countries in our stories, stories, travelers, pet, then the mail link and "© 2026 That Layover Life · Copenhagen"; Instagram, Newsletter, LinkedIn and the Samoyed line gone. Served check on thatlayover.life that day: **four footer headings, 21 footer anchors**. The 20 Oct tree, its class names, its heading tag and sizes and the hrefs as built are not in the saved code; the column content is from A2.2 to A2.5 plus the S92 amendments.
- The site code is the 31 Oct state in `scratchpad/p0-1031/after/` (head and footer), the footer component embed `src/components/footer/tll-foot-v1.html` and the v16 layers.

"Today" below and in `before.png` means: the 13 Oct trees with the 20 Oct edits applied from those records, under the 31 Oct site code. It is a reconstruction, not a capture. The render script reproduces the 21 footer anchors S92 served, which is the one check available offline.

## Files

| File | What it is |
|---|---|
| `index.html` | The prototype. Self-contained: no external request. The brand fonts are embedded from `src/design/magazine-2026-10/type/fonts` (Playfair Display 800 and 800 italic, IBM Plex Sans Condensed 400 and 600, JetBrains Mono 400 and 600) and `src/pages/home/mobile-proto-2026-10-26/fonts` (IBM Plex Sans Condensed 700). Open it in a browser. The yellow bar at the top is a prototype control (Logged out, Logged in) and is not part of the design. Resize under 992px for the phone header. |
| `before.png` | Today, at 390px, as defined above (see "How before.png was made"). |
| `after-390.png` | The variant at 390px under the live cascade: logged out, menu open, logged in, logged in with the menu open, scrolled, the story end block, the footer closed and open, Tell the editor open. |
| `after-1440.png` | The variant at 1440px: logged out, logged in, the story end block with the footer, the footer, Tell the editor open. |
| `render.cjs` | `node design/nav-footer-variant-2026-11/render.cjs` embeds the fonts, builds the "today" page in memory, renders the three sheets and prints the measurements. The variant is rendered with the 13 Oct Designer class values placed before the head blocks, as Webflow loads its stylesheet before the head code, so the numbers are of the live cascade and not of the prototype alone. Writes only inside this folder. |

Query flags on `index.html` for anyone scripting it: `?state=in`, `?menu=open`, `?note=open`, `?foot=open`, `?shot=1` (hides the control bar).

## What changed

### 1. The header (TLL Nav v1)

| | Today | Variant |
|---|---|---|
| Phone bar | 81px tall at 390 (measured: the Designer small-breakpoint `padding:12px 16px` plus the 1px border-bottom on `.tll-nav-v1`), **not sticky**: the Designer sets `position: sticky`, but `tll-v9-chrome-v1` in the site head sets `position: relative` under 900px. So on a phone the header scrolls away. | **56px** tall at 320 to 991 (measured), `position: sticky`, one row, 44px targets inside it, the wordmark included. |
| 900 to 991px | 138px, two rows: the Designer medium breakpoint wraps `.tll-nav-inner` and sends `.tll-nav-links-row` to a second row (`width:100%; order:3`). | The phone header. The six links do not fit one 13px row with the three actions under 992px, so the MENU button takes over at Webflow's own tablet breakpoint instead of the 899px the site head uses today. |
| Phone row, logged out | Wordmark, "Log in", "Sign up", MENU. "Share your story" is hidden under 480px by the Designer class and added to the menu by `tll-mobile-nav-js-v1`. | Wordmark, **"Join free"** (filled), MENU. "Share your story" and "Log in" are text links inside the menu. |
| Phone row, logged in | Wordmark, a bordered pill with the avatar letter and "Account" (103px wide), MENU. | Wordmark, **"My map"** (filled, to /the-map, per the saved brief), the account as a **36px avatar circle** in a 44px target (aria-label "Account"), MENU. "Share your story" is a text link inside the menu. |
| Phone menu | Stories, Travelers, The Map, Expats, Paw Passport, About, Share your story (7 links). | Logged out: the six links, Share your story, Log in (8). Logged in: the six links, Share your story (7). |
| Desktop row, logged out | Six links; "Share your story" as a filled button; "Log in"; "Sign up" (two filled buttons, both repainted to #D63859 by `tll-contrast-v1`). | Six links; "Share your story" and "Log in" as text links; **"Join free"** as the one filled button. |
| Desktop row, logged in | Six links; filled "Share your story"; the avatar and "Account" in a bordered pill. | Six links; "Share your story" as a text link; filled **"My map"**; the avatar circle. |
| Filled buttons | `#D63859` with white, because `tll-contrast-v1` (26 Oct) repaints `.tll-nav-signup` and `.tll-nav-pen-cta` from the Designer's `#F0507A` (white on it is 3.42:1, bone #F8F2E6 on it 3.07:1, both under AA). | The same `#D63859` with white (4.60:1), `#C8325B` on hover (5.17:1), written into the variant block itself so no layer has to repaint it. The avatar circle too (today it is `#F0507A` with `#F8F2E6`, 3.07:1). |
| Menu button label | "MENU" and "CLOSE ✕" (v9 chrome). | "MENU" and "CLOSE" at a fixed width (62px, 60px under 480px, 58px under 350px), so the row does not move when it opens. The ✕ glyph shows from 480px up, as decoration. |
| Small phones | The phone layer zooms the wordmark to 86% under 400px. | Under 480px the wordmark is 13px with "that" at 12px, the buttons 12px. Under 350px the italic "that" steps out so the member row still fits one row. Under 320px the row may wrap. |

The labels. "Join free" is the most repeated button in the code (`docs/copy-audit-2026-10-31/copy-sheet.csv` row TLL-0314, "Keep"); the sheet has **no row whose current text is "Sign up"** (0 of 1,512 rows; two rows carry the phrase inside a sentence, TLL-0128 and TLL-0949, neither the nav button), so "Sign up" to "Join free" in the nav is a new decision for this session, not an audit outcome. "My map" for members is the saved brief (`docs/expat-pets-ux-2026-10-31.md` line 268: one primary action, "Join free" for visitors, "My map" for members); no other brief for this is in any file. The text link keeps the live label "Share your story", which the copy sheet proposes to rewrite to "Spill your trip" (rows TLL-0001 and TLL-0002, with TLL-1045 and TLL-1492 "Matches the nav button"); that rewrite is Nancy's call and is not applied here.

### 2. The footer (TLL Site Footer) and "Tell the editor"

| | Today | Variant |
|---|---|---|
| Floating "Tell the editor" pill | Fixed bottom left on every page (`#tll-note .tll-note-pill`, `tll-note-v1-css` in `scratchpad/p0-1031/after/site-footer.html`). Under 960px the layer `tll-note-phone-v1` makes it a 44px round button with the dot only; `docs/phase2-a11y-audit-2026-11.md` section 1.3 measured it 44 by 44 at 390 and found the focus ring of 26 elements drawn under it, among them footer links and the hello@ link. | **Removed.** The card and the Webflow form ("Tell the editor", `#tll-note-form`, fields Note, Email, page) stay exactly as they are, so submissions keep landing in Webflow Forms. The card opens from two links instead. |
| Help row | None. "Contact" sits inside the TLL column, which is an accordion on phones. | A new row between the stats line and the meta row, on every page that carries the footer component: **"Help and contact"** (to /contact) and **"Tell the editor"** (opens the card). 44px rows, 15px, cream, a rose dot. |
| Column headings | `h4` in the 13 Oct tree, 11px (Designer). axe `heading-order` fires on `<h4>Navigate</h4>` after an h2 or h3 column on 31 of 44 runs (`docs/phase2-a11y-audit-2026-11.md` line 56). The 20 Oct tag and size are not in the saved code. | **h2**, styled the same, at **12px** (the floor). The footer embed's `h4` selectors become `:is(h2,h4)`. |
| Stats labels | 10px (13 Oct Designer value; the 20 Oct value not in the saved code). | **12px.** |
| Footer wordmark | `tll-footer-wordmark-v1.js` sets `aria-label="That Layover Life, home"` on a link whose visible text is "thatLAYOVER LIFE."; axe `label-content-name-mismatch`, serious, every page, 44 runs (`docs/phase2-a11y-audit-2026-11.md` section 2.5, line 193 as the file stands). | No aria-label; the accessible name is the visible text. |
| Story end block | Next story, then the join card for visitors (`src/site-layers/tll-ux-v1.js`, Phase 1, staged); "Next story" eyebrow at 11px (`.tll-ux-k`, line 24). | The same, plus one line at the end: "Spot something in this story? **Tell the editor**" (opens the card); `.tll-ux-k` at 12px. |
| Note card eyebrow | 12px in `tll-note-v1-css`, but 11px live: the site head rule `[class*=eyebrow]{font-size:11px !important}` (`tll-consistency-v1`) matches `.tll-note-eyebrow`. | 12px, with `!important` on the id selector so the head rule loses. |

## What did not change

- Colors: ink `#0A0B14` at 96% with the blur, bone `#F8F2E6` and `#F7F4EE` for the wordmark, rose `#F0507A` for the wordmark accent, the menu's Share link and the footer headings on ink (5.57:1), footer `#0D0F1A`, teal `#00C9C8` for the footer counts. All read from the Designer export, the saved head and `tll-contrast-v1`.
- Fonts: Playfair Display 800 for the wordmark (the head overrides the Designer's Druk Wide with Playfair, `tll-proto-parity-v1`), IBM Plex Sans Condensed for links and buttons, JetBrains Mono on the MENU button, the footer counts and the note card's labels. The masthead line asks for Newsreader (`tll-masthead-v1`); the saved head loads only Playfair Display and JetBrains Mono from Google, and whether Webflow's project settings load Newsreader is not in the saved code (`reports/evidence/webflow-export-2026-10-13/state/styles/fonts.json` lists custom fonts only), so the prototype shows the Georgia italic fallback.
- The six nav links, their order and their targets as recorded on 20 Oct: Stories, Travelers, The Map, Expats, Paw Passport, About.
- The footer: the wordmark, the masthead line, the four columns with their 19 links in the recorded order (Read 5, Contribute 5, TLL 5, Legal 4), the stats line, the phone accordions from `tll-foot-v1`, the mail link and the copyright line. Link targets are the planned ones (A2.2 to A2.5: Destinations to /stories#by-place, The Layover Lounge to /gallery, Cookies opens the consent preferences); the hrefs as built on 20 Oct are not in the saved code.
- The note card: the eyebrow with the page path, "Spot something? Send a note.", the two fields, "Goes to Nancy's desk", "Send", the done and fail messages, the rose pill submit, and the rule that hides the widget while the consent banner or preferences are open (`html.show--consent #tll-note, html.show--preferences #tll-note, html.tll-note-hidden #tll-note{display:none !important}`).

## Counts, and where they come from

Measured by `render.cjs` in headless Chromium: "today" from the assembled page, the variant from `index.html` with the 13 Oct Designer classes in front of it (21 selectors matched for the variant, 22 for today).

| Count | Today | Variant |
|---|---|---|
| Header height at 390 | 81.2px, `position: relative` | **56px**, `position: sticky` |
| Header height at 900 to 991 | 138px (two rows) | 56px (phone header) |
| Header height at 1440 | 77px, sticky | 68px, sticky |
| Nav links (primary) | 6 on record (5 in the 13 Oct export); confirm in the Designer | 6 |
| Links in the phone menu, logged out / in | 7 / 7 | 8 / 7 |
| Interactive items in the phone row at 390, logged out | 4 (wordmark, Log in, Sign up, MENU) | 3 (wordmark, Join free, MENU) |
| Interactive items in the phone row at 390, logged in | 3 (wordmark, account pill, MENU) | 4 (wordmark, My map, avatar, MENU) |
| Interactive items in the desktop row, logged out / in | 10 / 9 | 10 / 10 |
| Footer links (anchors) | 21 (wordmark 1, columns 19, mail 1) plus the pill button; S92 served 21 | **23** (wordmark 1, columns 19, help row 2, mail 1) |
| Targets under 44px in the header | at 390: the wordmark link (19px tall); at 1440: the wordmark (22px), "Log in" (33px), "Sign up" (37px), "Share your story" (43px), the account pill (42px) | none; every link and button is 44px tall, the wordmark included |
| Text under 12px in the nav, the footer and the note card | 8 in the footer (4 headings at 11px, 4 stats labels at 10px; 13 Oct Designer values, the 20 Oct values not in the saved code), plus the avatar letter at 11px when logged in (Designer `.tll-nav-avatar`), plus the note eyebrow at 11px while the card is open (`tll-consistency-v1`); the pill's 0px text under 960px is left out, as the a11y audit leaves it out | **0** |
| Filled button colors | `#D63859` on white (4.60:1, from `tll-contrast-v1`); the avatar `#F0507A` on `#F8F2E6` (3.07:1) | `#D63859` on white for both (4.60:1) |

Row widths at 390 in the variant, logged in: wordmark 126px, My map 61px, avatar 44px, MENU 60px, gaps 8, 6 and 6px, so 311px of the 358px inside the padding, 47px left over. At 360: 17px left over. At 340 the "that" has stepped out (wordmark 98px): 283px of 308, 25px left over. At 320: 277px of 288, 11px left over. No item overflows the viewport and the document never scrolls sideways at 320, 340, 360, 390, 430, 768, 991, 992, 1024, 1199 or 1440, with the menu closed or open, logged out or in.

Contrast pairs used (computed, WCAG formula): white on `#F0507A` 3.42:1, `#F8F2E6` on `#F0507A` 3.07:1, white on `#D63859` 4.60:1, white on `#C8325B` 5.17:1, `#F0507A` on `#0D0F1A` 5.57:1, `#C9C3B8` on `#0D0F1A` 10.89:1, `#B9B3A8` on `#0D0F1A` 9.16:1, `#8A857B` on `#0D0F1A` 5.20:1, `#9496AC` on `#0A0B14` 6.74:1, `#067A79` on `#FAF7F2` 4.83:1. `docs/phase2-a11y-audit-2026-11.md` section 2.4 (line 170 as the file stands) gives the same 3.42:1 for the live buttons before the contrast layer.

Sources: nav tree `src/design/magazine-2026-10/cover-build/fixture-home.html` line 443 (13 Oct export, identical in `src/pages/heroes-2026-10-29/fixtures/stories.html`), with the 20 Oct edits from `handoff/STATUS.md` S91, `src/components/footer/HANDOFF-NOTE-2026-10-20.md` and `handoff/CHANGE-LOG-PACKET-A-2026-10-19.md` A1.1; footer content from `handoff/STATUS.md` S92 and the Packet A log A2.2 to A2.7; note markup `src/pages/heroes-2026-10-29/fixtures/stories.html`; Designer classes `reports/evidence/webflow-export-2026-10-13/state/styles/styles-full.json` and `variables.json`; component trees `reports/evidence/webflow-export-2026-10-13/state/components/8484ce87-193e-8ab5-fff8-590bb198f8a8.json` (TLL Nav v1, 63 instances, the pre-20-Oct tree) and `710ff458-c06e-d602-a663-e5e88ca1456b.json` (TLL Site Footer, 63 instances, the pre-20-Oct tree); head code `scratchpad/p0-1031/after/site-head.html` (`tll-mobile-nav-v1`, `tll-mobile-nav-js-v1`, `tll-proto-parity-v1`, `tll-v9-chrome-v1`, `tll-v9-chrome-js-v1`, `tll-consistency-v1`); footer code `scratchpad/p0-1031/after/site-footer.html` (`tll-core-v2-css`, `tll-note-v1-css`, `tll-note-v1-js`); footer component embed `src/components/footer/tll-foot-v1.html` (element 082f2f3d); layers `src/site-layers/tll-nav-phone-v1`, `tll-contrast-v1`, `tll-note-phone-v1`, `tll-note-typing-v1`, `tll-footer-wordmark-v1`, `tll-masthead-v1`, `tll-ux-v1.js`, listed in `build-site-layers-v16.py`.

## How before.png was made

There is no live screenshot. `render.cjs` assembles a page in memory from: the 13 Oct nav tree with Destinations renamed to The Map after Travelers and Expats added; the footer content on record for 20 Oct (the prototype's footer without the help row, with h4 headings and the wordmark aria-label the layer writes today); the `#tll-note` markup from the stories fixture, pill included; the Designer class values from the 13 Oct export for the classes that carry over (base rules first, then the breakpoint blocks, as Webflow writes them) and the 13 Oct values of the old heading, label, count and meta classes applied to the reconstructed parts; the 31 Oct head and footer style and script blocks listed above; the footer embed `tll-foot-v1`; the six v16 layers that touch the nav, the footer or the note widget (`tll-nav-phone-v1`, `tll-contrast-v1`, `tll-note-phone-v1`, `tll-footer-wordmark-v1`, `tll-masthead-v1`, `tll-note-typing-v1`); and the same embedded fonts with the head's font aliases (DM Sans, Syne and Inter to Plex; DM Serif Display, Druk and Recoleta to Playfair). The live count script inside the footer embed is dropped (it fetches the sitemap). `tll-ux-1028-v1.js` is not loaded (its pill rules only act on the home page hero). It is a reconstruction, not a capture: check it against the live site before the session.

## Designer and code steps, component by component

Every style change below lives in site code, not in Designer classes, which is how every nav and footer rule since 20 Sep has been done. The Designer steps are structural only.

### A. TLL Nav v1 (component 8484ce87, group "TLL Globals", 63 instances in the 13 Oct export)

1. Open the component. Confirm the six links (Stories, Travelers, The Map, Expats, Paw Passport, About). Nothing changes in `.tll-nav-logo` or `.tll-nav-links-row`.
2. In `.tll-nav-cta-row`, the "Share your story" link (href /submit) keeps its place before the two Memberstack blocks and keeps the class `tll-nav-pen-cta` (the site head's press rule in `tll-v91-motion-v1` targets it); swap `tll-btn tll-btn-ghost-rose` for `tll-nav-link` so it is a text link.
3. In the Anonymous block (`.tll-nav-anon`, `data-ms-content="anonymous"`): keep "Log in" (`tll-nav-link tll-nav-signin`, /login); change the "Sign up" button text to "Join free". Classes (`tll-btn tll-btn-primary tll-nav-signup`) and href (/signup) stay.
4. In the Members block (`.tll-nav-member`, `data-ms-content="members"`), add a link before the account link: text "My map", href /the-map, classes `tll-btn tll-btn-primary tll-nav-map-cta`.
5. On `.tll-nav-account-link` add the custom attribute `aria-label="Account"`. The `.tll-nav-account-text` span (bound to the Memberstack first name) can stay; the new CSS hides it. Deleting it also removes that binding, which is fine.
6. The MENU button and the two menu copies of "Share your story" and "Log in" are not Designer elements. The script adds them, as `tll-mobile-nav-js-v1` does today.

### B. Site head code (Site settings, Custom code, Head)

1. Replace the style block `tll-mobile-nav-v1` and the nav rules inside `tll-v9-chrome-v1` (the `.tllmm-btn` rule and the whole `@media(max-width:899px)` block) with the block `tll-nav-v1-variant` from `index.html`. That block also carries the nav lockup rules now in `tll-proto-parity-v1` (`.tll-nav-logo-block`, `.tll-nav-logo-life`, `.tll-nav-pen-cta`, `.tll-nav-signup`, `.tll-nav-signin` and the 768 to 1199px rule), so those lines can go too; the `@font-face` aliases in `tll-proto-parity-v1` stay (the rest of the site still uses them). Every Designer value the block has to beat is reset inside it and named in its header comment: the small-breakpoint padding and border on `.tll-nav-v1`, the medium-breakpoint wrap on `.tll-nav-inner` and the second-row rules on `.tll-nav-links-row`, the uppercase, letter-spacing, margin, pill radius, border and tiny-breakpoint `display:none` on `.tll-nav-pen-cta`, the border and padding on `.tll-nav-account-link`, and the "DM Sans" family on `.tll-nav-link` and `.tll-btn`.
2. Replace the script `tll-mobile-nav-js-v1` with part 1 of the script in `index.html` (MENU button, "Share your story" copied into the menu for everyone and "Log in" for visitors, Escape and close on pick). Remove the `menu()` function from `tll-v9-chrome-js-v1`: it relabels the button to "CLOSE ✕" and "MENU", and it closes the menu and resets `aria-expanded` when a link in the menu is picked; the new script does both. In the same script, `landmarks()` sets `role="banner"` on `<nav class="tll-nav-v1">`, which axe flags on every page (`docs/phase2-a11y-audit-2026-11.md` line 55, banner is not allowed on a nav): drop that one line while the file is open; the nav already has `aria-label="Main"`.
3. The one line that makes today's phone header scroll away is `.tll-nav-v1{position:relative}` in the 899px block. If Nancy wants only the sticky fix before the session, removing that line is enough.
4. The menu's "Log in" copy carries no `data-ms-content`: each time the menu opens, the script reads whether `.tll-nav-anon` is displayed (whatever Memberstack did to it) and hides or shows the copy to match. The member block's `display:flex` is written under the same condition as the site's own rule (`html.ms-loaded [data-ms-content="members"]{display:block}` in `tll-core-v2-css`). What Memberstack itself does to those elements, and which script adds `html.ms-loaded`, is not in the saved code: confirm on the staged site that the member row lays out as a row.

### C. Site layers (`src/site-layers`, built by `build-site-layers-v16.py`)

1. Retire `tll-nav-phone-v1.html` and `.js` (the 26 Oct phone header styles) and the nav part of `tll-contrast-v1.html` (the first two rules, which repaint `.tll-nav-signup` and `.tll-nav-pen-cta`; the `.tll-cta-rose` and `.tll-text-rose` rules stay). The variant block replaces them.
2. Retire `tll-note-phone-v1.html` (the 44px round pill under 960px, and the `html.tll-typing` rule) and `tll-note-typing-v1.js` (adds `html.tll-typing` while a field outside the note has focus, so the pill steps aside). Both only serve the pill. `tll-ux-1028-v1.js` keeps two pill lines (the hide-over-the-home-hero rules and the pill `aria-label`); they do nothing once the pill is gone and can be trimmed at the next edit of that file.
3. `tll-ux-v1.js`, function `story()`: after the join card, append the line `<p class="tll-ux-note">Spot something in this story? <a href="#tll-note-card" data-tll-note-open="1">Tell the editor</a></p>`, add the `.tll-ux-note` rules from `tll-ux-end-css` in `index.html`, and lift `.tll-ux-k` from 11px to 12px (line 24). This is a release of the layers, not a Designer step.
4. `tll-footer-wordmark-v1.js`: drop the line `a.setAttribute('aria-label','That Layover Life, home')` so the link's name is its visible text. `tll-footer-wordmark-v1.html` and `tll-masthead-v1` stay as they are.

### D. TLL Site Footer (component 710ff458, 63 instances in the 13 Oct export; the 20 Oct tree is not in the saved code)

1. Open the component. Between the stats line and the row with the mail link and the copyright, add a Div Block with the custom attribute `data-tll-foot="help"` and the class `tll-foot-help`.
2. Inside it, two text links: "Help and contact", href /contact; "Tell the editor", href `#tll-note-card`, custom attribute `data-tll-note-open="1"`.
3. Change the four column headings from H4 to H2 (same classes, so they look the same).
4. In the footer component embed `tll-foot-v1` (element 082f2f3d, source `src/components/footer/tll-foot-v1.html`, which lives in the component next to the counts embed, not in the site footer code): change its `h4` selectors to `:is(h2,h4)`, add the `.tll-foot-help` rules from `tll-foot-variant` in `index.html` (the desktop rule and the one line inside the 767px block), and add the 12px heading and stats-label rules if the Designer classes still say 11px and 10px.
5. Nothing else in the footer moves. The stats line, the mail link and the copyright line stay where S92 put them.

### E. The Tell the editor widget (`#tll-note`)

Where it sits: in the footer component, root element `d654a9bb-4e8d-350e-33b3-281d6cf99bb7`, with the Webflow form "Tell the editor" (`#tll-note-form`, element `47a85add-df88-fb59-0e68-b0e1a6383bc5`); the pill, card, close, eyebrow and title styles were created empty in the Designer so the site code CSS applies (`handoff/STATUS.md` S92).

1. Delete the pill button (`.tll-note-pill`) or leave it; the new `tll-note-v1-css` hides it (`#tll-note .tll-note-pill{display:none}`).
2. Keep the card, the close button, the eyebrow, the title and the form untouched.
3. In the site footer code, replace `tll-note-v1-css` with the block of that id in `index.html` (the live rules minus the pill, with the consent-hide rule kept and the eyebrow pinned at 12px), and replace `tll-note-v1-js` with part 2 of the script in `index.html`: the card opens from any element with `data-tll-note-open`, focus goes to the textarea, Escape and the close button shut it, and focus returns to the link that opened it. `aria-expanded` and `aria-controls` are set on those links.

### F. Order of work

A, D and E in the Designer first (one staged publish covers all three), then B in the head and the footer code, then C as a layers release. Rollback: the current originals of the head and footer code are `scratchpad/p0-1031/after/site-head.html` and `site-footer.html` (the 31 Oct state, after Phase 0; `before/` is the pre-Phase-0 state, which still loads the CookieConsent banner and gates GA4 on it, and must not be restored); the layers roll back by re-applying the previous version.

### G. Links queued for the same session

These are not part of the variant, but they sit in the two components and the docs park them for "a session together":

- `docs/tll-phase0-change-log-2026-11.md` line 147: links to /spotlight, /awards and /creators in the nav and footer components. `docs/phase3-usability-audit-2026-11.md` items 11 to 13: Spotlight and The Layover Awards link to noindex pages; "For affiliates" relies on a pending 301 to /creators. Item 31: "Copenhagen stopover" and "EES and ETIAS on a layover" go to draft pages (404). Those findings were read off the 13 Oct footer. The 20 Oct record (Packet A A2.8, S92) says Spotlight, the two guides and the Awards were dropped and "For affiliates" became "For creators" (/creators). If the live footer still shows any of them, this is the session to drop them; if it matches the record, items 11, 12 and 31 are already closed and only the /creators empty state (item 13) remains.

## Not in the saved code (stated, not guessed)

- The post-20-Oct element trees of both components: the nav's six links are on record (S91, the handoff note, A1.1) but not saved as a tree; the footer's class names, heading tag and sizes, and hrefs as built.
- Which of the 89 pages carry the two components. The 13 Oct export counts 63 instances of each; the rest are CMS templates, drafts and member pages whose chrome is not in the saved files. "Help and contact in the same footer place on every page" holds for every page with the component.
- Whether Memberstack serves a member photo for the avatar. The saved nav shows only the first-letter span (`data-ms-member="first-letter"`); the variant keeps that. A photo would need the `profile-image` binding, which is not in the saved code.
- What Memberstack does to `data-ms-content` elements after `html.ms-loaded`, and which script adds that class.
- The Designer's own typography settings for `h2`, `h4` and `body`, the Webflow stylesheet URL, and whether the project loads Newsreader. `before.png` uses Webflow's defaults for those.
- The live figures in the stats line. The prototype's digits are stand-ins; the counts embed (v3.1 or later, `src/components/footer/tll-live-counts-v3.html`, label "countries in our stories") writes the real ones at load and the prototype keeps the markup shape it reads.

## Open questions for Nancy

1. **The member's primary action.** Built as the saved brief says: "My map" filled for members, "Share your story" a text link. The alternative is "Share your story" filled (as the live desktop row has it) and "My map" in the menu. Which one?
2. **The nav button label.** The copy sheet proposes "Spill your trip" for "Share your story" (TLL-0001, TLL-0002). Apply it here, since the component is open, or leave it for the voice refresh?
3. **"Join free" in the nav.** The nav says "Sign up"; every other join button says "Join free" (TLL-0314). The sheet has no row for the nav's "Sign up", so this is a new decision. Confirm the swap.
4. **"Contact" twice.** The TLL column keeps "Contact" and the help row adds "Help and contact". Keep both, or drop the column link once the help row is live?
5. **"Help and contact" target.** It points to /contact. /faq is live too (and sits in the TLL column); should the link go to a help page that leads to both?
6. **The menu breakpoint.** The phone header now runs to 991px (Webflow's tablet breakpoint) instead of 899px, because six links and three actions do not fit one row under 992px. Fine, or shrink the row to keep 900 to 991 on one line?
7. **"CLOSE" without the glyph** on the MENU button under 480px, so the button keeps one width. The copy sheet keeps "CLOSE ✕" (row TLL-0004).
8. **The italic "that" under 350px.** It steps out so the member row fits in one row on 320 and 340px phones. The alternative is a smaller wordmark for everyone, which would fall under the 12px floor.
9. **Footer headings and stats labels at 12px**, up from the 13 Oct Designer 11px and 10px (the 20 Oct values are not saved). Fix while the component is open, as built here, or leave for the voice refresh?
10. **Footer headings as h2.** axe flags the h4s after an h2 or h3 column on 31 of 44 runs. The change is one tag per heading plus the selector change in `tll-foot-v1`.
11. **The 68px desktop header** keeps today's proportions (12px padding and the 44px row). A 56px desktop header would match the phone; the brief did not ask for it.
12. **Avatar letter.** It is Playfair 800 here, as the Designer's `tll-nav-avatar` uses the wordmark face, now at 14px on `#D63859` (the Designer has 11px on `#F0507A`). Keep, or Plex?
13. **The queued link decisions** in G, if the live footer still carries any of Spotlight, Awards, the two guides or "For affiliates". And the nav: six links as recorded, or Destinations back in (STATUS B40), which would make seven and change the row budgets here.

## Checks done here

- Rendered under the live cascade (Designer classes first, then the head blocks) at 320, 340, 360, 390, 430, 768, 991, 992, 1024, 1199 and 1440, logged out and in, menu closed and open: no overflow, no sideways scroll, no target under 44px in the header, no text under 12px in the nav, the footer or the note card, the header 56px on every width under 992 and 68px from 992 up.
- The "today" reconstruction serves 21 footer anchors, the number S92 recorded for the live site on 20 Oct.
- Keyboard: MENU and CLOSE toggle `aria-expanded`, Escape closes the menu and returns focus, the note card is `role="dialog"` with a labeled title, the footer accordion headings are buttons with `aria-expanded`.
- Copy: American English, no em dashes, no exclamation marks, none of the banned words. The strings that are not mine are the live ones.
- Not done, because the sandbox cannot reach the site: axe and Lighthouse on the staged pages, a live before screenshot, Memberstack behavior, the live footer tree.

## Critic notes

A review of the first draft of this folder listed gaps and errors. Each was checked against the saved code; what changed, and where the review was off:

- **Dates and trees.** Right. The fixtures carry the 13 Oct trees (`build_fixtures.py` line 2) and S92 records the 20 Oct publish. "Today" is now defined at the top, and the nav and footer in `index.html` and `before.png` carry the 20 Oct edits from the records, labeled as a reconstruction.
- **Nav link count.** Right that five was unconfirmed; the count is six, not seven. S91 says "Destinations became The Map after Travelers, Expats added", the handoff note says link 7593d683 "is now The Map", and that element is "Destinations" in the 13 Oct component JSON. Packet A A1.1 lists the six.
- **Footer is the 13 Oct tree.** Right. Rebuilt to the S92 and Packet A record: four columns, 19 links, stats line under the columns, mail and copyright; 21 anchors reproduced.
- **The "later brief".** Right, it is in no file. Built to the saved brief ("My map" for members); the other option is open question 1.
- **Copy audit rows TLL-0001, 0002, 1045, 1492 and the missing "Sign up" row.** Right. Stated under "The labels" and as open questions 2 and 3. Checked: 0 rows with `current_text` "Sign up".
- **Queued link decisions.** Right that they belong in this session. Added as section G and open question 13, with the note that the 20 Oct record says most of those links are already gone.
- **Accessibility findings.** Right. The footer wordmark aria-label, the h4 heading order and the `role="banner"` on the nav are now carried (sections 2, B2, C4, D3).
- **Cascade rules for the live Designer stylesheet.** Right; the critic's measurement was reproduced (81px on phones, 138px at 900 to 991, scrollWidth 401 and 436 logged in). The resets are in the variant block and the render now measures the live cascade. One more Designer value was found on the way: `.tll-nav-pen-cta` is `display:none` at the tiny breakpoint, and `.tll-nav-account-link` carries a 1px border and padding; both are reset.
- **Layers that serve the pill.** Right. C2 retires `tll-note-phone-v1` and `tll-note-typing-v1`; the consent-hide rule is back in `tll-note-v1-css`.
- **The 12px list.** Right. `.tll-ux-k` at 11px, the note eyebrow at 11px live, the avatar at 11px: all counted and all lifted.
- **Contrast of the filled buttons.** Right. `#D63859` with white now, as `tll-contrast-v1` already does live; the avatar too.
- **The position of `#tll-note`.** Right, S92 has the element ids. Section E now gives them.
- **D3 (`tll-foot-v1` is a component embed, not site footer code).** Right. D4 now says so.
- **F rollback to `before/`.** Right, that would undo Phase 0. F now points at `after/`.
- **B2 `menu()` description.** Right; it also closes on a link pick. Fixed.
- **before.png layers.** Right. All six are loaded now, so the pill is the 44px round button.
- **Newsreader "never loads".** Right; the head loads only Playfair and JetBrains Mono, and the project font settings are not in the saved code. Said that way now.
- **Fonts comment.** Right; Plex 700 comes from the mobile-proto folder. The HTML comment names both folders.
- **Prototype-only `tll-in` and `tll-out` classes in the head block.** Right. The head block no longer uses them; the stand-in rules sit in `tll-proto-base`, labeled, and the menu's "Log in" copy no longer depends on cloned `data-ms-content`.
- **"Elements under 12px: 9" and "no item under 44px".** Right that both rested on the 13 Oct footer and on the prototype alone. Recounted under the live cascade; the wordmark link was 41px and is now 44px.
- Where the review was off: the nav has six links on record, not seven, so the menu counts are 8 and 7, not seven-link figures. The counts embed the review calls v3.1 is v3.2 in the saved file (`src/components/footer/tll-live-counts-v3.html`, 20 Oct, Packet B); S92 served v3.1 that morning, so the live version is one of the two. Everything else in the review checked out.
