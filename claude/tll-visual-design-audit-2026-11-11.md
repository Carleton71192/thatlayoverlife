Saved copy of Nancy's Claude Doc "That Layover Life: visual design audit (11 Nov 2026)", https://claude.ai/artifact/AHciwbpzkoNerWPBvJfQ5p, as read on 11 November 2026 (text only; tables flattened to rows with " | "). The doc is the source; this copy is for sessions that cannot open it.

Status notes added by the cloud session on 11 November 2026, not part of the doc:
- The audit was written before the www publish of 14:06:54 UTC. Already fixed since: the broken "Layover guides" section (styled, shows two guides, hidden when empty), "The library." at 196px on its own 72px edge (now a section label on the shared 1240 column, which also ends the double headline), and "Par avion" on the Lounge postcards (removed, staged).
- The yellow-green asterisk tab and the magenta square at the screen edge are not in the site's HTML; they look like browser extensions in the reviewer's Chrome. To be confirmed.

# That Layover Life: visual design audit
 · 
A Creative Director / UI / brand read of thatlayover.life, visual layer only: identity, hierarchy, type, polish, and a refinement plan. Every number below was measured from the live site's computed styles, not estimated.
## How this was reviewed
Live site, logged in as Nancy, Chrome, 11 Nov 2026.
Desktop: homepage top to footer, plus one story page (Morocco: Peaks, Sugared Up Mules & UNO Vengeance).
Mobile (390px): the same two pages rendered in a 390px same-origin frame inside Chrome. This reproduces the CSS breakpoints accurately but is not a real phone (no Safari chrome, no notch, no real touch).
Measured with code: font families per visible text element, type sizes, heading scale, colors, WCAG contrast ratios on solid backgrounds, button and chip styles, left-edge alignment of every section heading, body measure (characters per line).
Compared against the 9 Nov design review in this project, so you can see what moved.
Needs Visual Verification (could not be judged from what I saw): the logged-out homepage; /stories, /the-map, /for-expats, /the-paw-passport this round; hover, focus and pressed states; contrast of text sitting on photos (no solid background to measure against); a real iPhone in Safari; dark mode (none observed).
## The short version
The identity is genuinely editorial now. The 9 Nov type drift is mostly fixed: the homepage runs on the three spec faces (Playfair Display, IBM Plex Sans Condensed, JetBrains Mono), and story pages now carry captioned photos in the flow. It reads as a magazine, not a template.
What still costs you "high-end publication" credibility is a handful of finishing faults, not taste:
A broken section on the homepage: "The hours between flights" renders flush to the left edge of the screen with a gray Webflow "No items found." bar under it, on desktop and mobile.
Five different left edges for section headings on one page, so the page feels assembled from parts.
No heading scale: section H2s are 45, 64, 80, 100 and 196px.
Two corner languages (square buttons, pill chips) and two chip styles on the same page.
Three floating elements competing at the screen edges.
Story body runs about 85 characters per line on desktop.
Fix those six and the site moves from "well-designed indie" to "publication."
Dimension | Score /10 | One-line verdict
Visual identity and brand consistency | 7.5 | Distinctive and on-spec; two roses and two teals need defined roles
Above the fold and hierarchy | 7 | Strong H1 and CTA pair; stamp and duplicate photo credit add noise
Typography and readability | 6.5 | Right faces, wrong scale; desktop measure too wide
Trust signals and polish | 5.5 | One broken section, misaligned edges, mixed corner radii
## 1. Visual identity and brand consistency
### What the brand looks like right now
Type: Playfair Display 800 for display (57 visible text elements on the homepage), IBM Plex Sans Condensed for body and UI (100), JetBrains Mono for eyebrows, labels and stamps (114). Leftovers: DM Sans on 7 elements and DM Serif Display on 2. On 9 Nov there were nine families including Inter Tight (118 elements) and Newsreader; those are gone from the homepage.
Palette as rendered (most to least used on the homepage):
Role (observed) | Value | Where it shows up
Ink | #0A0B14 | Nav, dark sections, body text on cream
Cream | #F7F1E8 | Main page background, text on ink
Cream, lighter | #FDF9F3 / #F8F2E6 | Cards, the "Why" section; reads as a third off-white
Muted text | #6B6660 | Secondary copy
Warm gray | #C9C3B8, #CFCBC4, #B9B3A8 | Secondary text on ink; three near-identical grays
Rose, display | #F0507A | Italic accent words, LIFE in the wordmark, map fill, Paw Passport block
Rose, action | #D63859 | Filled buttons, skip link
Teal, bright | #00C9C8 | Eyebrows and stats on ink
Teal, deep | #067A79 | Eyebrows on cream
Story body | #3A3A3A | Story paragraphs only (homepage body uses ink)
### Verdict: premium publication or template?
Publication. The cues that do the work: square-cornered buttons, the black mono place labels, the circular postmark stamp, the washi-tape and Par Avion postcards in the Lounge, italic rose accent words inside heavy Playfair headlines, and the ink/cream rhythm with full-bleed photo breaks. None of that comes from a Webflow template.
Where it slips toward template:
The wordmark lockup mixes three treatments in one line (italic lowercase serif "that", caps serif "LAYOVER", rose caps "LIFE.") at about 15px in the nav. At that size it reads as small, not confident. Syne, which the spec reserves for the wordmark, was not detected in the nav lockup. Needs Visual Verification that the wordmark is the intended asset and not a text fallback.
Two roses doing overlapping jobs. #F0507A and #D63859 sit side by side in the hero area and the map section. Close enough to look like a mismatch, not a system.
Three off-whites and three warm grays that the eye registers as "almost the same color" rather than deliberate steps.
### Contrast and accessibility (measured)
On solid backgrounds, no homepage text failed WCAG AA. Specifics worth knowing:
Pair | Ratio | Status
White on rose action button (#D63859), 16px semibold | 4.60 | Passes AA, with almost no margin
Deep teal #067A79 eyebrows on cream, 12px | 4.60 | Passes AA, barely
Rose display #F0507A italic on cream, 42 to 100px | 3.05 | Passes only because it is large; would fail below 24px
Rose display #F0507A on ink | 5.73 | Comfortable
Bright teal #00C9C8 on ink | 9.51 | Comfortable
Search placeholder #6B6A72 on cream | 4.76 | Passes
Rose action #D63859 as small text on cream (calculated) | about 4.1 | Fails AA at body/eyebrow sizes. The story-page eyebrow "STORIES FROM THE ROAD" appears in this rose: Needs Visual Verification of its exact color
Micro-type is the bigger risk: the postmark stamps set JetBrains Mono at 8, 9 and 9.5px ("TLL", "STORIES FROM THE ROAD", dates). Fine as decoration, but if any of it carries meaning (the cover date), it is unreadable on a phone.
### Is rose used intentionally to guide the eye?
Mostly yes. In the hero, the only filled color is "Read the cover story", so the eye goes H1, then rose button. In the Lounge, "See the Lounge" is the only rose fill. It breaks down in three places:
The Paw Passport block is a full rose panel, so its outlined CTA ("Open the Paw Passport") becomes the lowest-emphasis element in the block.
The "What do you collect?" chip row ends in a rose-filled pill ("Countries, too: join free"), which competes with the hero CTA one screen up.
Rose italics appear in nearly every H2 (payday, in one spot, who used to be you, whatever the species, Lounge, affordable, wedding invitation). Repeated on every section, the accent stops being an accent.
## 2. Above the fold and visual hierarchy
### Focal point on landing
On desktop (1920px window): the H1 "Find your next somewhere." (Playfair 800, 86px, line-height 1.0) sitting over a darkened Atlas mountain village, then the rose "Read the cover story" button. That is the right order.
Competing for attention:
The postmark stamp, top right ("THAT LAYOVER LIFE · MOROCCO · 02 AUG 2024"), floats over the photo at the same visual weight as the photo-credit chip. Charming once; on the hero it splits focus.
The photo credit appears twice in the fold: a pill chip with avatar ("Photo: Nancy Carleton, Morocco") above the eyebrow, and a text line ("Photo Nancy Carleton · Morocco") under the buttons.
A muleteer and mule sit at the far right edge, cropped by the viewport and partly behind the floating pink widget. The best human detail in the photo is at the edge where nobody looks.
Overlay darkness: the hero image is dimmed hard to make cream text readable. The village loses its color. A bottom-left gradient instead of an even dim would keep the right half of the photo alive.
### Image-to-text balance
Hero: well balanced, about 25% of the width for text, the rest image. Through the page, the rhythm alternates text-heavy cream blocks with full-bleed photos (jaguar, Nyhavn, glacier), which is good pacing.
Where it goes wrong:
Two giant headings back to back. "Trips that can't wait for payday." (100px) is followed one block later by "The library." (196px). Two shouting headlines with only a filter row between them; neither wins.
Library cards are tilted postcards with titles of different lengths, so the title baselines step down unevenly (one line, two lines, three lines). Charming tilt, untidy text.
Sparse zones: the Paw Passport rose panel has a large empty lower half on desktop; the space under the Library cards before "More landing weekly" is about 150px of nothing.
Homepage length: 13,398px on desktop (down from 14,045 on 9 Nov). On mobile the first story card title is about 2,870px down, roughly three and a half phone screens.
### Navigation bar
Desktop: ink bar (#0A0B14), about 62px tall, sticky. Wordmark left, six links centered (Stories, Travelers, The Map, Expats, Paw Passport, About) in IBM Plex Sans Condensed, outlined "Share your story" button and a pill avatar chip on the right. Clean and clearly separated from the page. Two issues:
No active-page indicator observed on the links. Needs Visual Verification of hover and current states.
The avatar chip is inconsistent between pages: on the homepage it shows Nancy's photo, on the story page it showed an "N" initial in a rose circle on first load.
Mobile (390px): wordmark plus three boxed controls in a row (Share your story, Nancy, MENU), each with a 1px cream border. Three outlined boxes in 390px reads crowded and makes the wordmark the smallest thing in the bar.
## 3. Typography and readability
### Pairing
Playfair Display 800 + IBM Plex Sans Condensed + JetBrains Mono is a strong, non-generic pairing: high-contrast didone display, a narrow humanist sans that keeps cards compact, and a mono that says "ticket stub / passport stamp." No friction between the faces themselves. Friction comes from how often each is used:
JetBrains Mono is the most-used face on the homepage (114 elements), mostly at 12px uppercase with wide tracking. Mono at that size in that volume makes the page feel like small print.
DM Sans (7) and DM Serif Display (2) still render somewhere on the homepage. Off spec.
### Heading scale: there isn't one
Measured H2 sizes on the homepage: 45, 64, 80, 80, 80, 80, 80, 100, 196px. The H1 is 86px, so three H2s outrank the H1. Sections that do the same job (introduce a product area) use different sizes.
### Body measure and spacing
Context | Size / line-height | Column | Characters per line | Verdict
Story body, desktop | 17px / 28.9px (1.7) | 680px | about 85 | Too wide for a condensed face. Target 60 to 70
Story body, mobile 390 | 17px / 28.9px | 342px | about 43 | Good
Story H1, desktop | 72px / 73px, 760px wide | n/a | n/a | Wraps to four lines; feels heavy above a single byline
Paragraph spacing | 18px margin-bottom | n/a | n/a | Slightly tight for 1.7 line-height; 24px would breathe
Story body color | #3A3A3A on cream | n/a | n/a | Softer than homepage ink; fine, but it is a fourth text color
Scannability on story pages improved since 9 Nov: the Morocco story now has 12 subheads, 9 captioned figures and a pull quote. Remaining issue: portrait photos render at almost a full viewport height on desktop, so the reader scrolls through a wall of image between short text runs.
## 4. Visual trust signals and polish
### UI element inventory (homepage, measured)
Element | Font | Size / weight | Corner radius | Height
Primary button (Read the cover story) | Plex Condensed | 16px / 600 | 0 | 48
Outline button (Join free, Send a photo) | Plex Condensed | 16px / 600 | 0 | 48
Nav button (Share your story) | Plex Condensed | 15px / 600 | 0 | 40
Interest chips (Food, Marathons) | Plex Condensed | 17px / 600 | pill | 44
Filter chips (All, Travel Logistics) | JetBrains Mono | 12px / 700 | pill | 44
Search suggestions (Patagonia, whale sharks) | JetBrains Mono | 12px / 400 | pill | 44
Floating "Tell the editor" | Plex Condensed | 14px / 700 | pill | 44
Skip link | JetBrains Mono | 12px / 700 | 6px | 38
Read: buttons are a clean square system (good, a real signature). Chips are pills, which is defensible, but there are three chip styles on one page (17px sans semibold, 12px mono bold, 12px mono regular), and three button heights (38, 40, 48).
### Alignment
Measured left edge of each section heading at the same window width:
Section | Left edge
Hero H1 | 412px
"The family slide show..." | 400px
Most sections (Trips, Map, Locals, Lounge, closing) | 340px
"The library." | 72px
"The hours between flights." | 0px
Paw Passport (right half of split) | 1056px, by design
Three of these (412, 400, 340) should be one number. The library's 72px break-out is a deliberate oversized moment and can stay if it is the only exception.
### Visible defects
Broken Layover guides section. "Layover guides" eyebrow in default text, H2 at 45px with zero padding, a default underlined teal link, then Webflow's gray "No items found." empty-state bar spanning the full width. Appears on desktop and on mobile. This is the single most damaging visual on the site, because it says "unfinished" in a place everyone scrolls past.
Underlined headline on the Paw Passport panel ("whatever the species." has a text underline). Underlines on headlines read as links.
Three floating elements at the viewport edges: a yellow-green asterisk tab top right, a magenta square widget right edge, and the "Tell the editor" pill bottom left. On mobile the collapsed "Tell the editor" dot sits over story body text and photo captions. I could not identify the purpose of the asterisk tab and the magenta widget from the screen: Needs Visual Verification of what they are and whether they are needed on public pages.
Image sizing on stories: portrait images fill nearly the full desktop viewport (see section 3).
### Disclosures and trust marks
The Receipts block at the end of each story (Submitted by, Edited by, Published, Sources, plus the "Tell the editor" line) is the best trust device on the site, and it looks professional: mono labels in deep teal, hairline row rules, right-aligned values. Its weakness is placement and scale: it sits after the full story at 12px, so a skimming reader never sees that the piece was edited and sourced.
Byline: avatar, name, "From Morocco · August 2024 · 5 min read" in small muted text. Clean.
Editorial badges, partner logos, "human-verified" stamps: none observed on the homepage or the story page. If they exist elsewhere: Needs Visual Verification. The postmark stamp is decorative, not a verification mark, though it is shaped like one.
Contributor role label: "FOUNDER" in rose mono above the author card; contributor cards in the Library show "CONTRIBUTOR" in mono. Consistent.
## 5. UI/UX refinement plan
### Five specific before / after changes
1. Fix or remove the Layover guides section
Before: section h3g, H2 Playfair 45px at left 0, padding 0, default underlined teal link, Webflow empty state "No items found." on a gray bar.
After: until guides exist, hide the whole section (Webflow: set the Collection List's empty state to display: none and hide the wrapper when the list is empty). When it returns: same container as other sections (left edge 340px at 1920), eyebrow in JetBrains Mono 12px deep teal like every other eyebrow, H2 at the shared section size (see change 2), link styled as the site's text link with arrow, ink with a 1px rose underline offset 4px.
2. One heading scale, one left edge
Before: H2s at 45, 64, 80, 100, 196px; H1 at 86px; heading left edges at 412, 400, 340, 72, 0.
After: H1 hero 96px / 0.98. Section H2 72px / 1.0 everywhere, except one deliberate display moment ("The library." can stay oversized at 160px if "Trips that can't wait for payday" drops to an eyebrow + 40px subhead above it). Card H3 28px / 1.08 as now. One container with left edge 340px at 1920 (equivalently a max-width of about 1240px, centered), applied to hero text, the "Why" section and the footer.
3. Story body measure and image rhythm
Before: 680px column, 17px / 1.7, about 85 characters per line, 18px paragraph gap; portrait images near full viewport height; Receipts at the end.
After: 600px column, 18px / 1.65, target 62 to 68 characters; 24px paragraph gap; in-body images capped at max-height 70vh with object-fit cover (landscape full column, portrait at 66% column width, centered or paired two-up); a compact Receipts line under the byline ("Edited by Nancy Carleton · Sources listed · Last updated 2 Aug 2024" in 12px mono, linking down to the full block).
4. Unify chips and controls
Before: three chip styles (Plex 17px/600 pill; Mono 12px/700 pill; Mono 12px/400 pill), button heights 38/40/48, one rose-filled chip in the interest row.
After: one chip: JetBrains Mono 12px / 500, uppercase, letter-spacing 0.08em, height 36px, padding 0 14px, 1px ink border, pill radius kept (pills = filters, squares = actions, as a stated rule). Selected chip = ink fill, cream text. No rose-filled chips; the "join free" ask becomes a text link after the row. Buttons: 48px for primary and secondary everywhere, 40px only in the nav.
5. Calm the hero and the edges
Before: two photo credits in the fold, postmark stamp top right, even dark overlay on the whole photo, three floating widgets at the edges, mobile nav with three outlined boxes.
After: one credit (keep the text line under the buttons, drop the avatar chip, or vice versa); stamp moved to overlap the bottom-right corner of the hero by half its diameter (a "stamped" detail rather than a floating badge); overlay changed to a left-to-right gradient, ink at 75% to transparent at 60% width, so the right half keeps its color; reposition the image focal point so the muleteer sits at about 75% width, not the edge; on mobile, nav = wordmark + avatar + MENU only, with "Share your story" moved into the menu and the hero; "Tell the editor" hidden on story pages until the reader reaches the Receipts block, and hidden whenever the footer is in view.
### Prioritized task list
Quick aesthetic fixes (Webflow Styles and settings, no new content, about a day of work)
Hide the Layover guides section while its collection is empty. Highest priority: visible defect.
Remove the underline from the Paw Passport headline italic.
Swap the Paw Passport CTA to a filled ink button with cream text on the rose panel.
Remove the duplicate hero photo credit.
Delete the remaining DM Sans and DM Serif Display classes; remap those 9 elements to Plex Condensed / Playfair.
Collapse the three off-whites to two (page #F7F1E8, card #FDF9F3) and the three warm grays to one (#C9C3B8).
Assign the two roses fixed jobs: #D63859 for anything clickable, #F0507A for display accents only, never on small text.
Set paragraph margin to 24px and story body to 600px / 18px / 1.65.
Cap in-story images at 70vh.
Make the nav avatar render the same (photo) on every page.
Add a visible current-page state to nav links (2px rose underline under the active link).
Raise stamp micro-type from 8 to 9.5px to at least 11px wherever it carries real information (the date).
Structural / layout redesigns (need a design pass and decisions)
One shared section container and one heading scale across the homepage (change 2).
Resolve the double headline before the Library: merge "Trips that can't wait for payday" into the Library intro.
Unify the chip system and button heights (change 4).
Rework the hero overlay, focal point and stamp placement (change 5).
Mobile nav simplification and "Tell the editor" visibility rules.
Library cards: keep the tilt, but clamp titles to two lines and align title baselines so the row reads tidy.
Bring the Receipts summary up under the byline on story pages so the editorial trust mark is seen.
Shorten the mobile path to the first story (currently about 2,870px): move the Library directly under the hero on small screens.
Decide what the asterisk tab and the magenta edge widget are for; remove from public pages any that are not essential.
## What improved since the 9 Nov review
Inter Tight, Newsreader and Druk are gone from the homepage; the three spec faces now carry it.
Story pages have in-flow photos with captions (9 figcaptions), subheads and a pull quote, instead of a photo grid after the text.
Homepage is about 650px shorter.
No solid-background text on the homepage fails AA contrast.
## Sources
Live pages reviewed: thatlayover.life and Morocco story, 11 Nov 2026, logged in.
Contrast thresholds: WCAG 2.2, Success Criterion 1.4.3 Contrast (Minimum), 4.5:1 for normal text, 3:1 for text at 24px+ or 18.66px+ bold.
Readable measure guidance (45 to 75 characters, about 66 ideal): Robert Bringhurst, The Elements of Typographic Style, section 2.1.2.
Prior baseline: project doc tll-design-review-2026-11-09.md.
