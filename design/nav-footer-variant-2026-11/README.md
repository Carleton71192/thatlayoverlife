# Nav and footer variant, prototype for a session with Nancy (1 Nov 2026)

UX Phase 3, items 1 and 2 from `docs/expat-pets-ux-2026-10-31.md` ("Nav and footer variant, prepared only"). **Nothing here is applied to the site.** The nav and the footer are shared Webflow components, and the standing rule is to change them only with Nancy present. This folder is the thing to look at together.

The sandbox cannot reach thatlayover.life, so everything was built from saved code. The prototype reuses the live class names, ids, form names and copy, so each change maps to one Designer or code step below.

## Files

| File | What it is |
|---|---|
| `index.html` | The prototype. Self-contained: no external request. The three brand fonts are embedded from `src/design/magazine-2026-10/type/fonts` and `src/pages/home/mobile-proto-2026-10-26/fonts` (Playfair Display 800, IBM Plex Sans Condensed 400, 600 and 700, JetBrains Mono 400 and 600). Open it in a browser. The yellow bar at the top is a prototype control (Logged out, Logged in) and is not part of the design. Resize under 900px for the phone header. |
| `before.png` | Today, at 390px: the live nav and footer, assembled from the saved code (see "How before.png was made"). |
| `after-390.png` | The variant at 390px: logged out, menu open, logged in, logged in with the menu open, scrolled, the story end block, the footer closed and open, Tell the editor open. |
| `after-1440.png` | The variant at 1440px: logged out, logged in, the story end block with the footer, the footer, Tell the editor open. |
| `render.cjs` | `node design/nav-footer-variant-2026-11/render.cjs` embeds the fonts, builds the "today" page in memory, renders the three sheets and prints the measurements. Writes only inside this folder. |

Query flags on `index.html` for anyone scripting it: `?state=in`, `?menu=open`, `?note=open`, `?foot=open`, `?shot=1` (hides the control bar).

## What changed

### 1. The header (TLL Nav v1)

| | Today (saved 29 to 31 Oct) | Variant |
|---|---|---|
| Phone bar | 81px tall at 390 (measured), **not sticky**: the Designer sets `.tll-nav-v1` to `position: sticky`, but `tll-v9-chrome-v1` in the site head sets `position: relative` under 900px (`scratchpad/p0-1031/after/site-head.html`, the `@media(max-width:899px)` block). So on a phone the header scrolls away. | **56px** tall at 390 (measured), `position: sticky`, one row, 44px targets inside it. |
| Phone row, logged out | Wordmark, "Log in", "Sign up", MENU. "Share your story" is hidden under 480px by the Designer class and added to the menu by `tll-mobile-nav-js-v1`. | Wordmark, **"Join free"** (filled rose), MENU. "Share your story" and "Log in" are text links inside the menu. |
| Phone row, logged in | Wordmark, a bordered pill with the avatar letter and "Account" (103px wide), MENU. | Wordmark, **"Share your story"** (filled rose), the account as a **36px avatar circle** in a 44px target (aria-label "Account"), MENU. |
| Phone menu | Stories, Destinations, Travelers, Paw Passport, About, Share your story (6 links). | Logged out: the five links, Share your story, Log in (7). Logged in: the five links (5). |
| Desktop row, logged out | Five links; "Share your story" as a filled rose button; "Log in"; "Sign up" (two filled buttons). | Five links; "Share your story" and "Log in" as text links; **"Join free"** as the one filled button. |
| Desktop row, logged in | Five links; filled "Share your story"; the avatar and "Account" in a bordered pill. | Five links; filled "Share your story"; the avatar circle. |
| Menu button label | "MENU" and "CLOSE ✕" (v9 chrome). | "MENU" and "CLOSE" at a fixed width (62px, 60px under 480px, 58px under 380px), so the row does not shift when it opens. The ✕ glyph shows from 480px up, as decoration. |
| Small phones | The phone layer zooms the wordmark to 86% under 400px. | Under 480px the wordmark is 13px with "that" at 12px, the buttons 12px. Under 380px the italic "that" steps out so the member row still fits. Under 340px the row may wrap, as today. |

The primary action label "Join free" is the most repeated button in the code already (`docs/copy-audit-2026-10-31/copy-sheet.csv`, row TLL-0314, "Keep"). "Sign up" in the nav becomes "Join free" so the site says one thing.

### 2. The footer (TLL Site Footer) and "Tell the editor"

| | Today | Variant |
|---|---|---|
| Floating "Tell the editor" pill | Fixed bottom left on every page (`#tll-note .tll-note-pill`, `scratchpad/p0-1031/before/site-footer.html`, `tll-note-v1-css`). At 390 it covers the `hello@thatlayover.life` link in the footer's last row (see `before.png`, last panel). | **Removed.** The card and the Webflow form ("Tell the editor", `#tll-note-form`, fields Note, Email, page) stay exactly as they are, so submissions keep landing in Webflow Forms. The card opens from two links instead. |
| Help row | None. "Contact" sits inside the Discover column, which is an accordion on phones. | A new row above the meta row, on every page that carries the footer component: **"Help and contact"** (to /contact) and **"Tell the editor"** (opens the card). 44px rows, 15px, cream, a rose dot. |
| Story end block | Next story, then the join card for visitors (`src/site-layers/tll-ux-v1.js`, Phase 1, staged). | The same, plus one line at the end: "Spot something in this story? **Tell the editor**" (opens the card). |

## What did not change

- Colors: ink `#0A0B14` at 96% with the blur, bone `#F8F2E6` and `#F7F4EE` for the wordmark, rose `#F0507A` with `#D63859` on hover, footer `#0D0F1A`, teal `#00C9C8` for the footer counts. All read from the Designer export and the saved head.
- Fonts: Playfair Display 800 for the wordmark (the head overrides the Designer's Druk Wide with Playfair, `tll-proto-parity-v1`), IBM Plex Sans Condensed for links and buttons, JetBrains Mono on the MENU button, the footer counts and the note card's labels.
- The five nav links, their order and their targets: Stories, Destinations, Travelers, Paw Passport, About.
- The footer: the wordmark, the masthead line, the three counts, the six columns with their 26 links in the same order (Navigate 4, Discover 6, Contribute 5, TLL 5, Guides 3, Work with us 3), the phone accordions from `src/components/footer/tll-foot-v1.html`, the meta row (copyright line, email, Instagram, Newsletter, LinkedIn).
- The note card: the eyebrow with the page path, "Spot something? Send a note.", the two fields, "Goes to Nancy's desk", "Send", the done and fail messages, the rose pill submit.
- The footer's text sizes under 12px (the three count labels at 10px, the six column headings at 11px) are the live Designer values. They break the 12px floor today and still do here. Listed under open questions.

## Counts, and where they come from

Measured by `render.cjs` in headless Chromium, from `index.html` and from the assembled "today" page.

| Count | Today | Variant |
|---|---|---|
| Header height at 390 | 81.2px, `position: relative` | **56px**, `position: sticky` |
| Header height at 1440 | 77px, sticky | 68px, sticky |
| Nav links (primary) | 5 | 5 |
| Links in the phone menu, logged out / in | 6 / 5 | 7 / 5 |
| Interactive items in the phone row at 390, logged out | 4 (wordmark, Log in, Sign up, MENU) | 3 (wordmark, Join free, MENU) |
| Interactive items in the phone row at 390, logged in | 3 (wordmark, account pill, MENU) | 4 (wordmark, Share your story, avatar, MENU) |
| Interactive items in the desktop row, logged out / in | 9 / 8 | 9 / 8 |
| Footer links (anchors) | 31 (wordmark 1, columns 26, meta 4) plus the pill button | **33** (wordmark 1, columns 26, help row 2, meta 4) |
| Targets under 44px in the header | at 390: the wordmark link (19px tall); at 1440: the wordmark (22px), "Log in" (33px), "Sign up" (37px), "Share your story" (43px), the account pill (42px) | none; every link and button is 41 to 44px tall, the wordmark included |
| Elements under 12px in nav and footer | 9 (footer, Designer values) | 9 (the same) |

Row widths at 390 in the variant, logged in: wordmark 126px, Share your story 108px, avatar 44px, MENU 60px, three 6px gaps, 8px left over. At 360 the "that" steps out (wordmark 98px, 13px left over). At 320 the row wraps to two rows (103px tall). No item overflows the viewport at 320, 360, 390, 430, 768, 899, 900, 1024 or 1440, with the menu closed or open, logged out or in.

Sources: nav markup `src/design/magazine-2026-10/cover-build/fixture-home.html` line 443 (identical in `src/pages/heroes-2026-10-29/fixtures/stories.html`); footer and note markup `src/pages/heroes-2026-10-29/fixtures/stories.html` lines 487 to 498; Designer classes `reports/evidence/webflow-export-2026-10-13/state/styles/styles-full.json` (71 selectors used) and `variables.json`; component trees `reports/evidence/webflow-export-2026-10-13/state/components/8484ce87-193e-8ab5-fff8-590bb198f8a8.json` (TLL Nav v1, 63 instances) and `710ff458-c06e-d602-a663-e5e88ca1456b.json` (TLL Site Footer, 63 instances); head code `scratchpad/p0-1031/after/site-head.html` (`tll-mobile-nav-v1`, `tll-mobile-nav-js-v1`, `tll-proto-parity-v1`, `tll-v9-chrome-v1`, `tll-v9-chrome-js-v1`); footer code `scratchpad/p0-1031/before/site-footer.html` (`tll-core-v2-css`, `tll-note-v1-css`, `tll-note-v1-js`); layers `src/site-layers/tll-nav-phone-v1.html`, `tll-footer-wordmark-v1.html` and `.js`, `tll-masthead-v1.html` and `.js`, `tll-ux-v1.js`.

## How before.png was made

There is no live screenshot. `render.cjs` assembles a page in memory from: the nav markup in the home fixture, the footer and `#tll-note` markup in the stories fixture, the Designer class values from the 13 Oct export (base rules first, then the breakpoint blocks, as Webflow writes them), the saved head and footer style and script blocks listed above, the three site layers that touch the nav and footer, and the same embedded fonts with the head's font aliases (DM Sans, Syne and Inter to Plex; DM Serif Display, Druk and Recoleta to Playfair). The live count script inside the footer embed is dropped (it fetches the sitemap). It is a faithful reconstruction, not a capture: check it against the live site before the session.

## Designer and code steps, component by component

Every style change below lives in site code, not in Designer classes, which is how every nav and footer rule since 20 Sep has been done. The Designer steps are structural only.

### A. TLL Nav v1 (component, group "TLL Globals", 63 instances in the 13 Oct export)

1. Open the component. Nothing changes in `.tll-nav-logo` or `.tll-nav-links-row`.
2. In `.tll-nav-cta-row`, move the "Share your story" link (classes `tll-btn tll-btn-ghost-rose tll-nav-pen-cta`, href /submit) into the Members block (`.tll-nav-member`, custom attribute `data-ms-content="members"`), before the account link. Swap `tll-btn-ghost-rose` for `tll-btn-primary` so it is the filled rose button.
3. In the Anonymous block (`.tll-nav-anon`, `data-ms-content="anonymous"`), add a text link before "Log in": text "Share your story", href /submit, classes `tll-nav-link tll-nav-pen-link`. Keep "Log in" (`tll-nav-link tll-nav-signin`, /login).
4. Change the "Sign up" button text to "Join free". Classes (`tll-btn tll-btn-primary tll-nav-signup`) and href (/signup) stay.
5. On `.tll-nav-account-link` add the custom attribute `aria-label="Account"`. The `.tll-nav-account-text` span (bound to the Memberstack first name) can stay; the new CSS hides it. Deleting it also removes that binding, which is fine.
6. The MENU button and the two menu copies of "Share your story" and "Log in" are not Designer elements. The script adds them, as `tll-mobile-nav-js-v1` does today.

### B. Site head code (Site settings, Custom code, Head)

1. Replace the style block `tll-mobile-nav-v1` and the nav rules inside `tll-v9-chrome-v1` (the `.tllmm-btn` rule and the whole `@media(max-width:899px)` block) with the block `tll-nav-v1-variant` from `index.html`. That block also carries the nav lockup rules now in `tll-proto-parity-v1` (`.tll-nav-logo-block`, `.tll-nav-logo-life`, `.tll-nav-pen-cta`, `.tll-nav-signup`, `.tll-nav-signin` and the 768 to 1199px rule), so those lines can go too.
2. Replace the script `tll-mobile-nav-js-v1` with part 1 of the script in `index.html` (MENU button, the two anonymous links copied into the menu with `data-ms-content="anonymous"`, Escape and close on pick). Remove the `menu()` function from `tll-v9-chrome-js-v1`, which only relabels the button.
3. The one line that makes today's phone header scroll away is `.tll-nav-v1{position:relative}` in the 899px block. If Nancy wants only the sticky fix before the session, removing that line is enough.

### C. Site layers (`src/site-layers`, built by `build-site-layers-v16.py`)

1. Retire `tll-nav-phone-v1.html` and `.js` (the 26 Oct phone header styles). The variant block replaces them.
2. `tll-ux-v1.js`, function `story()`: after the join card, append the line `<p class="tll-ux-note">Spot something in this story? <a href="#tll-note-card" data-tll-note-open="1">Tell the editor</a></p>` and add the `.tll-ux-note` rules from `tll-ux-end-css` in `index.html`. This is a release of the layers, not a Designer step.
3. `tll-footer-wordmark-v1` and `tll-masthead-v1` stay as they are.

### D. TLL Site Footer (component, 63 instances, 117 nodes, one HTML embed)

1. Open the component. Between the columns block (class starting `inline-div-7-`) and the meta row (class starting `inline-div-9-`), add a Div Block with class `tll-foot-help` and custom attribute `data-tll-foot="help"`.
2. Inside it, two Link Blocks or text links: "Help and contact", href /contact; "Tell the editor", href `#tll-note-card`, custom attribute `data-tll-note-open="1"`.
3. In the site footer code, next to `tll-foot-v1`, add the `.tll-foot-help` rules from `tll-foot-variant` in `index.html` (the desktop rule and the one line inside the 767px block).
4. Nothing else in the footer moves.

### E. The Tell the editor widget (`#tll-note`)

Where it sits: the 19 Oct Packet A note in the site footer code says the form is a Webflow form in the site footer component; in the 29 Oct fixtures `#tll-note` follows the `</footer>` tag. The 13 Oct component export predates it. Its exact place in the Designer tree is not in the saved code, so check it in the Designer.

1. Delete the pill button (`.tll-note-pill`) or leave it; the new `tll-note-v1-css` hides it (`#tll-note .tll-note-pill{display:none}`).
2. Keep the card, the close button, the eyebrow, the title and the form untouched.
3. In the site footer code, replace `tll-note-v1-js` with part 2 of the script in `index.html`: the card opens from any element with `data-tll-note-open`, focus goes to the textarea, Escape and the close button shut it, and focus returns to the link that opened it. `aria-expanded` and `aria-controls` are set on those links.

### F. Order of work

A, D and E in the Designer first (one staged publish covers all three components), then B in the head and the footer code, then C as a layers release. Rollback: the originals of the head and footer code are in `scratchpad/p0-1031/before/`; the layers roll back by re-applying the previous version.

## Not in the saved code (stated, not guessed)

- Which of the 89 pages carry the two components. The 13 Oct export counts 63 instances of each; the rest are CMS templates, drafts and member pages whose chrome is not in the saved files. "Help and contact in the same footer place on every page" holds for every page with the component.
- The Designer position of `#tll-note` (see E).
- Whether Memberstack serves a member photo for the avatar. The saved nav shows only the first-letter span (`data-ms-member="first-letter"`); the variant keeps that. A photo would need the `profile-image` binding, which is not in the saved code.
- The Designer's own typography settings for `h4` and `body`, and the Webflow stylesheet URL. `before.png` uses Webflow's defaults for those.
- The live Memberstack behavior of cloned elements with `data-ms-content`. The variant's menu copies carry the attribute; confirm on the staged site that Memberstack hides them for members as the CSS does here.

## Open questions for Nancy

1. **The member's primary action.** The 31 Oct UX doc planned "My map" for members; this build follows the later brief, "Share your story" filled. Which one?
2. **"Contact" twice.** The Discover column keeps "Contact" (same links, same order) and the help row adds "Help and contact". Keep both, or drop the column link once the help row is live?
3. **"Help and contact" target.** It points to /contact. /faq is live too; should the link go to a help page that leads to both?
4. **"Join free" in the nav.** The nav said "Sign up"; every other join button says "Join free". Confirm the swap.
5. **"CLOSE" without the glyph** on the MENU button under 480px, so the button keeps one width. The copy sheet keeps "CLOSE ✕" (row TLL-0004).
6. **The italic "that" under 380px.** It steps out so the member row fits in one row on 360px phones. The alternative is a smaller wordmark for everyone, which would fall under the 12px floor.
7. **Footer text under 12px** (10px count labels, 11px column headings) is live Designer styling. Fix while the component is open, or leave for the voice refresh?
8. **The 68px desktop header** keeps today's proportions (12px padding and the 44px row). A 56px desktop header would match the phone; the brief did not ask for it.
9. **Avatar letter.** It is Playfair 800 here, as the Designer's `tll-nav-avatar` uses the wordmark face. Keep, or Plex?

## Checks done here

- Rendered at 320, 360, 390, 430, 768, 899, 900, 1024 and 1440, logged out and in, menu closed and open: no overflow, no item under 44px in the header, the header 56px on every phone width except 320 logged in (two rows, 103px).
- Keyboard: MENU and CLOSE toggle `aria-expanded`, Escape closes the menu and returns focus, the note card is `role="dialog"` with a labeled title, the footer accordion headings are buttons with `aria-expanded`.
- Copy: American English, no em dashes, no exclamation marks, none of the banned words. The strings that are not mine are the live ones.
- Not done, because the sandbox cannot reach the site: axe and Lighthouse on the staged pages, a live before screenshot, Memberstack behavior.
