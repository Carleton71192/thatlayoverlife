# Stories 3.0: proposed changes for /stories and the story page (for Nancy's approval)

Sources:
- handoff/claude-design-source/v3/: TLL Site Prototype 3.0 (screens `stories` and `story`, plus the STORIES and LOUNGE data in the script), tll-system.css, PROMPT.md, updates-10c/UPDATES.md (homepage interludes only, so nothing here for these pages), audit-2026-10-09.md.
- The live /stories page (69d61469f421c777840c204d) and the Stories Template (6a0b29eedc14f1444e935766), read on 10 October 2026: element trees, page code, applied scripts, JSON-LD, the Stories and Contributors collection schemas.
- handoff/STATUS.md rows S18, S21, S22 (the 9 Oct fix-first pass) and S27, S28 (the 10 Oct story work).

Read only. Nothing has been changed in Webflow and nothing has been published.

## How it gets built

- **Same method as homepage 3.0.** New HTML embeds go in, plus one namespaced style block per page: `s3-` on /stories and `st3-` on the story page. They use the tll-system.css tokens, copied in the same way home3.css copied them.
- **tll-system.css is not loaded as a file on the story page.** Its `.tll-body` rule would restyle the story rich text. That rich text already uses `.tll-body`, and three of the 10 Oct scripts find the story body by that class.
- **Old parts are hidden, never deleted.** Every element ID, data-* attribute, form name, input name and CMS binding stays.
- **Story content stays bound to the CMS.**
  - Embeds on the template use Webflow's embed field bindings. These cover plain text, number, date, image URL, option and reference name/slug.
  - The rich text fields (Body, Short version, Quick answers, Links and mentions) stay as the existing native RichText elements and are only restyled.
  - No copy from a story is typed into an embed.
- **No new Stories fields.** The Stories collection is at Webflow's 60-field cap (counted on 10 Oct: 60 custom fields). Everything below uses fields that already exist, the Contributors collection, or the Trip Bundles and Pet Notes collections. Any later idea that needs a new Stories field means retiring one first, and Nancy picks which (C10).
- **Motion (Emil rules):**
  - Hover and press only. Chips get a 150ms ease-out color change and scale(.97) on press.
  - The card title keeps the 1px ink hairline underline from 9 Oct (S22). The prototype's rose underline is not brought back.
  - No hover effects on touch.
  - With prefers-reduced-motion, all transitions are off.
- **Draft first.** Each page is built on the staging branch or a draft duplicate, and the live pages change only after Nancy says yes.
- **Not touched:**
  - TLL Nav v1, TLL Site Footer, the feedback button (tllfbkplacev1).
  - Any Memberstack data-ms-* block.
  - Story CMS items and slugs.
  - The site head and footer code.

## Must survive (added 9 and 10 October)

| What | Where it lives | How the proposal keeps it |
|---|---|---|
| Inline gallery photos | Script tllstoryinlinephotosv1 1.0.0 moves `.tll-story-gallery a.tll-gallery-link` into the `.tll-body` with the most paragraphs | The body RichText 2da5de32 keeps its class and its place. No new element gets `.tll-body`. `.tll-inline-photo` gets restyled for the st3 column width only |
| "Were you on this trip too?" line | Script tllstoryperspv1, inserted after the body | Kept. Styled with st3 tokens |
| Pet notes and Trip Bundles data | Hidden block [data-tll-extras] 5781db09 (lists pet-notes and trip-bundles, embed 3c3cdbd0 with tll-story-extras-v1) | Kept. Row 13 adds attributes inside it and moves the script to a v2. v1 stays on the page until v2 is approved |
| Shout-out labels | [data-tll-links-card] f2c407ba (Affiliate link and Comped labels, rel="sponsored nofollow") | Kept as is |
| FAQ schema | Template footer script, reads #tll-quick-answers | #tll-quick-answers stays as is |
| Share fix, keep-reading fallback, gallery builder | Template footer scripts | Kept. Class names they target are unchanged |
| /stories fix-first | Footer v5 (src/pages/stories/footer-v5-fixfirst.html, matches live): search v4 with data-tll-q-miss, chips sort newest first, lead card, hairline hover | Kept. The s3 block loads after it and only restyles |

## /stories: section by section

What the prototype shows, in order:
- Eyebrow "THE LIBRARY".
- H1 "{N} stories, all worth *the detour.*"
- Line "Counted by hand in Copenhagen. More landing weekly."
- Underlined search with placeholder "A country, a train line, a feeling", "✕ CLEAR" and "SEARCH →".
- "FRONT OF THE SHELF" (Most read, Press desk, Location experts).
- No-results line.
- Filter rows PILLAR, PLACE and SORT.
- A grid of story cards.

| # | Section | Change | Live parts kept |
|---|---|---|---|
| 1 | Hero | Prototype type: eyebrow "THE LIBRARY" in #067A79 (live is rose), H1 in Playfair 800 at clamp(44px, 6.4vw, 112px), rose italic "the detour." CSS only, no new element. The count word stays live (tllstorycountv2 reads the sitemap). | Section 2a4d…6ba0, eyebrow span 2a4d…6b7a, h1 acc2873a, hidden lede 2a4d…6b81 and hidden stats 2a4d…6b9e (both stay hidden, see open point 2) |
| 2 | Search | Restyled to the prototype input: Playfair-scale text, 3px ink underline, rose "Search →" button, placeholder "A country, a train line, a feeling", and "✕ Clear" only while a search runs (S21 behavior). It sits under the hero, as in the prototype, not inside the chip row. | Form 6b8749f3…6cd0 (GET, name "Html Form"), input #tll-lib-q name q with its aria-label, clear link #tll-lib-clear, search v4 |
| 3 | No results | The note reads: Nothing on the shelf for "{query}" yet. Then "Share your story →" (/submit) and "Clear the search". It keeps today's behavior of showing the whole shelf. "Be the first!" is dropped (open point 3). | #tll-q-note, role=status |
| 4 | Place filter | Mono label "PLACE" and pill chips as in the prototype. The chips are All places, Europe, Africa, Americas, Antarctica. "By country" and "By city" are not added (open point 5). | Row 94028673, chips [data-tll-place] with role=button and aria-pressed, tll-lib-chips-v1 |
| 5 | Pillar and Sort rows | Stay hidden, as Nancy set them on 9 Oct. If she wants them back: the pillar row uses the existing /pillars/* links (the prototype's pillar chips do nothing when clicked), and the sort row uses the existing Most recent / A to Z by country / Read time chips (open point 4). | Chip row 8d8b8cc3 [data-tll-chiprow], sort row 98f819bc [data-tll-sort] |
| 6 | Front of the shelf | Stays hidden (open point 1). | Section 70da7443 [data-tll-fos] |
| 7 | Story cards | Prototype card, restyled in CSS on the server-rendered cards: <br>- 4:3 photo with an ink country badge top left (from the Byline location already in the card). <br>- Title on a cream tab overlapping the photo. <br>- Mono "{PILLAR} · {N} MIN" (Pillar name, Reading time). <br>- Excerpt. <br>- Byline: the contributor's own photo (bound), name and "· {PLACE}". <br>- "SPONSORED · BY {name}" only when Disclosure starts with "Hosted:". This needs one hidden [data-tll-disclosure] block in the card, bound to Disclosure (existing field). <br>- Grid minmax(min(100%, 340px), 1fr), gaps 8vh by 3vw. <br>- The 9 Oct lead card and the straight photos stay. <br>- Card titles stay h2 (one h1 on the page). | List 43ed9711 (tll-lib-grid), link 7e8747f4 a.tll-lib-card[data-tll-card="cms"], card ids, bindings, the hidden author/country/date/mins/region blocks, "Read the story →", empty state |
| 8 | Below the grid | Not in the prototype. Kept, with st3 type tokens only: "More stories on the way." and The Weekly Layover newsletter. | Sections 2a4d…6c09 and 2a4d…6c24, newsletter form and its action |
| 9 | Style block | One `<style id="tll-s3-stories-v1">` at the end of the page footer. It overrides tll-v9-j12-v1 and tll-flow-v1 where they clash. Those two can be retired after approval, never before. | All existing head and footer blocks |

Proposed changes on /stories: 9.

## Story page (Stories Template): section by section

What the prototype shows, in order:
1. An 88vh photo hero: flag, "{COUNTRY} · {PILLAR} · {N} MIN", title.
2. ROUTE strip.
3. Sponsored box.
4. Author row "{name} →" with "FILED FROM COPENHAGEN · MAY 2026".
5. Lede, body, then the pull quote in an ink box.
6. "THE SHORT VERSION".
7. "{COUNTRY}, AND YOU?" with "Been here" / "Want to go".
8. Affiliate aside.
9. "SHOUT-OUTS · UNPAID, THE WRITER JUST LIKED THEM".
10. "TRAVELLED WITH".
11. "PART OF A TRIP".
12. "THE LEDGER" (banned word, see open point 10) with 8 rows.
13. "Have a layover story like this?" CTA.

| # | Section | Change | Live parts kept |
|---|---|---|---|
| 1 | Hero | J13 already gives the 88vh photo, gradient and title scale. Added: a 26px circle flag before the meta row (tllflagsv4 already resolves it), meta row in mono teal "{BYLINE LOCATION} · {PILLAR} · {N} MIN". The excerpt and the author block leave the hero (rows 4 and 5). The breadcrumb stays, small, because it matches the BreadcrumbList schema. | Hero image 8ab51244 (bound, fetchpriority high), h1 f95e…53e (bound), meta row 2bf67900, breadcrumb [data-tll-breadcrumb], [data-tll-hero-caption] |
| 2 | Route | Ink strip with mono "ROUTE", stops joined by →, and the note in teal on the right. It still hides when Route stops is empty. | 803511c6 [data-tll-route], [data-tll-route-stops], [data-tll-route-note] (Route stops and Route note fields) |
| 3 | Sponsored | Prototype box. Copy: "This story is sponsored by **{name}**. The travel was hosted; the opinions were not. Disclosed at the top, never buried. That is the charter." The name comes from the text after "Hosted:" in Disclosure, and the box shows only then, as today. The prototype's em dash is removed. | 578a8d42 [data-tll-sponsored], [data-tll-sponsored-text], tll-label-js-v1 (Reklame) |
| 4 | Author row | New embed at the top of the body column: contributor Photo, "{Contributor name} →" linking to /contributors/{slug}, and "FILED FROM {CONTRIBUTOR LOCATION} · {MONTH YEAR}" (Contributors "Location" field plus Published date). This replaces the prototype's typed "COPENHAGEN · MAY 2026". The hero author block is hidden: it shows a typed "NC" and a typed "Nancy Carleton" on every story (open point 9). | Author block f95e…549 (hidden, not deleted), tllauthorlinkv1 |
| 5 | Lede | Excerpt at 18px/1.65, weight 500, under the author row (an embed bound to Excerpt). The hero excerpt f95e…540 is hidden. | Excerpt binding, og and SEO fields |
| 6 | Short version | The prototype box style: paper background, hairline border, mono teal "THE SHORT VERSION". It stays above the body, where it is today, and the prototype puts it after the quote (open point 6). | dfae2cae, RichText 81948c95 (Short version), Article "abstract" in JSON-LD |
| 7 | Body | 16px/1.7, #3a3a3a, 680px column. Inline photos and the perspective line work as today. | RichText 2da5de32 .tll-body (Body), tllstoryinlinephotosv1, tllstoryperspv1, gallery d462e341 |
| 8 | Pull quote | Ink box, Playfair 800 italic 22px in cream, with curly quotes added by CSS. | Blockquote f95e…55a (Pull quote) |
| 9 | Quick answers, links card, sign-off, hashtags, reader question, share | Not in the prototype. All kept, restyled with st3 tokens only. | #tll-quick-answers (FAQ schema), [data-tll-links-card], TLL Sign-Off v1, TLL Hashtag Set v1, TLL Reader Question v1, share row [data-tll-share] |
| 10 | Affiliate aside | New embed, aria-label "Affiliate disclosure". Mono "AFFILIATE LINKS" with: "Some links in this story pay the writer a small commission if you book. The writer chose to include them. It never changes what they said about a place." It shows only after tll-label-js-v1 has labeled at least one affiliate link in the body or the links card, so no field is needed. | tll-label-js-v1 labels and rel attributes |
| 11 | Traveled with | New section "TRAVELED WITH" (US spelling, see open point 7). Chips with an initial and a name link to /contributors/{slug}. The data comes from the existing multi-reference "Human co-travelers": a nested list inside a new hidden block [data-tll-cotravel], built like [data-tll-extras]. The section hides when the list is empty. | No new field |
| 12 | {Country}, and you? | Pills as in the prototype: Been here is ink and turns teal "✓ Been here" when on, Want to go turns rose "★ On my list". The label "{Country}, and you?" comes from the Byline location. The note keeps the live wording, "Log in to save" and "Saves to your lists", not the prototype's "SAVES TO YOUR MAP AND LISTS" (open point 8). CSS `order` moves it to the top of the aftermatter. | 4fce04b3 [data-tll-places], [data-tll-place-toggle] with role=button and aria-pressed, [data-tll-places-note] role=status, tll-places-js-v1 (tllPlaces) |
| 13 | Part of a trip | tll-story-extras v2 renders "Other perspectives" as the prototype's ink card: <br>- Mono "PART OF A TRIP · {n} STORIES". <br>- h2 = the Trip Bundle item's Name. <br>- A numbered list (01, 02...) of the bundle's stories: title from the Stories multi-reference, by-line where Webflow can bind it, this story in bold, each linked to /stories/{slug}. <br>- The prototype's "BRAZIL · 2025" meta has no source and is left out. <br>- Pet-friendly notes stay as built on 10 Oct. <br>Needs data-name and a nested story list inside the trip-bundles list (Trip Bundles collection, not Stories). | [data-tll-extras] 5781db09, lists [data-tll-extras-list="pet-notes"] and [data-tll-extras-list="trip-bundles"], [data-tll-bundle] data-slugs |
| 14 | Receipts block (live heading "THE LEDGER") | Prototype styling: two-column mono keys and values, the same 8 rows (Submitted by, Edited by, Trip, Published, Last updated, What it cost, Sources, Disclosure). Empty rows still say "Contributor to add". The prototype's default values (for example "19 September 2026", "Paid for by the traveler") are not used. "Tell the editor" in the note becomes mailto:hello@thatlayover.life?subject=CORRECTION, as in the prototype. The visible heading needs a new name (open point 10). | 11d05765 [data-tll-ledger="story"], rows [data-tll-lg=*], show-posted / show-traveled / show-edited switches, tll-ledger-js-v1 |
| 15 | CTA | Prototype layout: "Have a layover story like this?", sub line, and "Share your story →" (/submit). It keeps the live sub line "Reviewed by a human within 48 hours. Your byline stays yours." (open point 11). | 71c9b928 [data-tll-story-cta] |
| 16 | Contributor card, keep reading, Tell the editor | Not in the prototype. Kept after the CTA, with st3 type. The contributor card is all typed text for Nancy (name, bio, "FOUNDER · NAMED TRAVELER", /contributors/nancy-carleton). A bound twin embed replaces it on screen, using Name, Bio short, Photo, Badge and slug, and the original is hidden (open point 9). | b3f20463…aed0c with [data-tll-count="nc"] and [data-tll-vouch] (hidden), keep-reading list c6e74446 and its fallback, tll-story-feedback, ad slot #tll-ad-slot-story (stays off), hidden action chips b3f20463…aed1c |
| 17 | Style block | One `<style id="tll-st3-story-v1">` at the end of the template footer. It loads after tll-v9-j13-v1 and tll-ledger-v1, and both of those stay. | All existing head and footer code |

Proposed changes on the story page: 17.

## SEO, AEO and accessibility

- **Headings.** One h1 per page: the library title, and the story title. Card titles and story sections are h2, and the new sections (Traveled with, Part of a trip) get h2 with aria-labelledby, as in the prototype markup.
- **Images.**
  - Story card photos keep alt="" because the title is the link text.
  - The hero image, the author photo and the inline photos keep or get descriptive alt text.
  - The prototype's avatar alt "Nancy Carleton" becomes the contributor name.
- **Contrast.** Teal text on light is #067A79 and small rose text on light is #C8325B. The amber sponsored chip uses ink text on #D98A2B. Teal text on ink is #00C9C8.
- **Focus and controls.**
  - Visible 3px focus rings, ink on light and teal on dark.
  - Chips and toggles keep role=button and aria-pressed.
  - The prototype's clickable spans and divs are not copied: every new control is an <a> or a <button> (J01).
  - Tap targets are at least 44px.
- **Search.** The input keeps its aria-label, and the no-results note keeps role=status.
- **Structured data.**
  - /stories: the CollectionPage and BreadcrumbList stay.
  - The story page: Article, BreadcrumbList and the FAQPage script stay.
  - One fix: dateModified is bound to Published date. Propose binding it to Last updated, and filling Last updated on the 8 live stories so the field is never blank.
- **Canonicals and metadata.** Both canonicals stay. The /stories SEO title already contains "Library".
- **Motion.** prefers-reduced-motion turns off chip transitions and the hero parallax (data-tll-parallax).

## Open points (Nancy)

1. **Front of the shelf.** The prototype brings it back. You hid it on 9 Oct, and its copy breaks the rules:
   - "MOST READ THIS WEEK": there is no working read counter, the View count field has no verified webhook, and the prototype just picks two stories.
   - Em dashes in "The Pros are being recruited [em dash] hosted trips disclosed at the top, verdicts their own" and "Eight years somewhere beats eight days everywhere [em dash] the first Location Expert stories land here".
   - A claim, "The Pros are being recruited".

   Proposal: keep it hidden.
2. **Hero line and first screen.** "Counted by hand in Copenhagen. More landing weekly." was hidden on 9 Oct, and "More landing weekly" is a schedule promise. Separately, the prototype's 112px H1 and search under the hero push the first story below the fold on a phone, which undoes fix-first item 2. Keep the line hidden? Prototype H1 size on desktop only?
3. **"Be the first!"** has an exclamation mark. Proposal: drop it and keep "Share your story →".
4. **Pillar and Sort rows.** These were hidden on 9 Oct, and the prototype shows them. The prototype's pillar chips do nothing when clicked. Bring either back?
5. **"By country" and "By city"** in the prototype's Place row. By country only repeats the A to Z sort, and By city is a placeholder ("same order until cities are logged"). Proposal: leave both out.
6. **The short version's position.** The prototype puts it after the body. It was kept at the top on purpose (answer-first, B03). Keep it at the top?
7. **"TRAVELLED WITH"** is UK spelling. Proposal: "TRAVELED WITH" (US English rule). Should Pet co-travelers show here too?
8. **"SAVES TO YOUR MAP AND LISTS".** This is not true today: the map reads tllStates, not tllPlaces. Proposal: keep "Saves to your lists".
9. **The author is typed, not bound, on the template.** The hero shows "NC" and "Nancy Carleton", and the contributor card has your name, bio, "FOUNDER · NAMED TRAVELER", /contributors/nancy-carleton and data-tll-count="nc". It is correct today because all 8 published stories are yours, and wrong for the first story by anyone else. Proposal: bound twins as in rows 4 and 16. The TLL Sign-Off v1 component also carries a typed "Nancy Carleton" prop, while a Sign-off CMS field exists. Change that component, or leave it?
10. **"THE LEDGER"** is a banned word. It is live today and in the prototype. The data-tll-ledger attribute stays because it is not visible copy. The heading needs a new name: "THE RECEIPTS" would echo "Every story carries its receipts" and the homepage's "THE MAP, WITH RECEIPTS". Your call.
11. **CTA line.** The prototype says "Pass the submission rules and it publishes when you send it." Instant publish is not live: S27 is blocked on the Cloudflare worker. Keep "Reviewed by a human within 48 hours. Your byline stays yours." until it is?
12. **Shout-outs heading.** The prototype heading is "SHOUT-OUTS · UNPAID, THE WRITER JUST LIKED THEM", but shout-outs can be marked Affiliate link or Comped (S27), so "UNPAID" can be false. Proposal: keep "Links & mentions" with its labels, and no separate shout-outs list.
13. **Prototype sample data, not used:**
    - The Brazil story's "OPEN SLOT" hotel, restaurant and trip legs.
    - "Jay Carleton" tagged as a co-traveler.
    - "FILED FROM COPENHAGEN · MAY 2026".
    - The default values in the receipts rows.
    - One Nancy photo as every card's byline avatar.

    Please confirm that none of these should appear.
14. **Live claims to check.** "Spot a fact that's off? ... It gets fixed within 24 hours." (Tell the editor), and "THE WEEKLY LAYOVER" next to "No schedule we'd break" (newsletter). Are both still true?
15. **Outside these pages.**
    - PROMPT.md says "No ticket strip at the top of pages". The departures board (tll-v9-departures-v1, quieter option 2) runs from the site head on /stories and every story. Changing it is a site-level change, so it is not in this proposal. Keep it, or switch it off?
    - The prototype nav (MENU button, logged-in states) is not part of this proposal. TLL Nav v1, TLL Site Footer and Memberstack stay as they are.
