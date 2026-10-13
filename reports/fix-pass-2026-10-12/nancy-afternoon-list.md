# For Nancy (fix pass and after, 12 Oct 2026, evening)

Running list. Everything I changed is an unpublished edit; you publish. Full check of the 18 items: `verification.md`. What changed: `report-back.md`.

## Still open after your answers
1. **Ko-fi URLs.** You picked Ko-fi for the Paw Passport and said OK to the TLL Ko-fi page. I still need both links: the TLL Ko-fi page, and the Paw Passport product on Ko-fi. The buttons stay hidden until then, and your /faq line B goes in at the same time (it points at the Ko-fi button).
2. **Newsletter name**, three options:
   - **Gate Change.** "Your inbox deserves better than deals. Gate Change lands when a story earns it." Travel-literate and a little dramatic.
   - **Window Seat.** Calm, everyone's favorite seat, reads well in a subject line ("Window Seat: Sort Sol").
   - **Long Way Round.** Matches the brand's "get lost on purpose" line.
3. **Your 87.** Your sheet and the map both say 87, but not the same 87. Please fix the map in the map editor (only the map writes your record):
   - On your sheet, not on the map: **Aruba, Botswana, Curaçao, Faroe Islands, Liechtenstein** (add as Visited or Lived).
   - On the map, not on your sheet: **Luxembourg** (your Not Yet Visited tab says Booked: remove until you go), **Antarctica** and **New Caledonia** (count them or not?), **Taiwan** and **Dominican Republic** (marked Layover, so they don't count; that matches "airports don't count").
   - If Antarctica and New Caledonia count, you are at 89, not 87.
   - Magnus: your sheet says 11, his CMS list 13, the map 14 (Austria, Hungary, Sweden and Denmark differ). Which is right?
   Once the map is right, I re-export its public copy and wire the footer, home and profile counts to it (footer step needs you present).
4. **Jaguars:** you said yes to naming the number. How many did you see?
5. **/submit change log:** `submit-change-log.md`. Approve rows 1 to 9, and tell me whether the email sign-up inputs count toward the 7 (I recommend counting story inputs only and leading with Google).
6. **EXIF, option A (re-encode in the browser):** before I build it, please send one test photo through /share-photos and tell me if it arrives anywhere. I think the current form never delivers the file, so option A also needs a real upload target (Webflow's File Upload element on a paid form plan, or the Worker).
7. **Guides:** check each answer against its source and send me the "last checked" date (you said OK).
8. **Banned words left for you** (35 other lines are already changed; full list in `applied/banned-words-log.md`):
   - ~~Blocked code edits~~: applied after your OK (the /stories "no stories" notes and the story page "More stories are on their way.").
   - **/terms** (legal): "The byline is human or it doesn't ship." → "…or it doesn't run."?
   - ~~/login and /signup success messages~~: done by the account 3.0 build ("Taking you to your account.", "come find your corner of the library.").
   - **Your bio:** "a Google Sheet that Jay calls the Trip Ledger": keep (it's Jay's name for it) or change?
   - **/edit-profile "Log a place to your Trip Ledger"** comes from site-wide code: OK to change to "Log a place"?
   - **Draft stories** with "ledger" (Country #88 on the ledger, #TravelLedger, "the full ledger") need your rewrite before they go live. "Ship" in Aruba, Antarctica and the cruise draft means a boat, so I left it.
9. **Outside the list:** the Seven Continents marathon story may show a false "Reklame" label (its Disclosure reads "Paid for by the travelers"); /for-brands links to charter rule 08, which was removed.

## Proposals waiting for you (nothing changed yet)
- **/share-photos** ("way too complicated"): `reports/page-simplify-2026-10-12/share-photos.md`. One Paper column, four groups, a real file list, two story inputs, credit row, three promise cards, one button. City, year, trip type, pets and the three opt-ins fold under two collapsed disclosures. Your calls: the upload target (the form is a plain GET today, so photos most likely never arrive), year optional, the review and withdrawal wording, the opt-ins, numbered or plain labels. Defaults in brackets in section 6.
- **/edit-profile** ("a mess"): `reports/page-simplify-2026-10-12/edit-profile.md`. One column, THE BASICS first with two required fields (Name, The place you know best), chips for OPEN TO, one link stack, one sticky Save, the typed country boxes gone, the Log a place card hidden here. Your calls: where Log a place lives, which link stack is canonical, clearing typed country counts, one Save or two, dropping the 48h promise. Defaults in brackets in section 6.

## Decided (12 Oct)
- Footer guides: build short pages now; footer links stay as they are.
- La Paz: not hosted. Its Disclosure field is empty, so the hosted line never shows.
- Passport total: 249.
- Photo placement: Plan B (the "Photo placements" collection). Built and staged. Your defaults confirmed.
- Free line B on the home page, "The reading list." rename, /faq line B (waits on Ko-fi), clear "Currently in" (done), pillar recommendation: keep Stories From the Road and Paw Passport in search, take the three thin pillars out until each has 3 stories (done, unpublished), events in the existing site footer without Consent Mode (in progress), public count source = the map's published copy.

## Needs you in the Designer (2 minutes each)
1. ~~/destinations links~~: done by API (all three links now "current item"). Just check after publish that Denmark, Brazil and France open their own pages.
2. **Story template, hosted box** (element 578a8d42, class tll-sponsored): Element settings > Conditional visibility > "Disclosure is set". Then the box only exists on stories with a disclosure.
3. **Pillars Template**, collection list `tllpr-stories`: add filter "Pillar equals Current Pillar" (keep "Status equals Published").
4. **Hero images Load: Eager**: Stories Template hero (tll-story-hero-img) and Countries Template hero (data-ct3 hero-img): Image settings > Load > Eager.
5. **Sitemap at template level:** Destinations Template and Collections Template > Page settings > Sitemap indexing off (stops new items from coming back into the sitemap).
6. **Photo alt text (optional, improves accessibility):** Stories Template, add a hidden collection list bound to the story's Photo gallery with attribute `data-tll-photo-alts`, each item an Image with alt from the field. The script already uses it if it's there. The API can't bind multi-image fields.

## Needs you present (shared components: nav, footer, "Tell the editor")
- **Footer counts: done and live (12 Oct, Nancy present).** Nancy picked "countries with a story": the footer embed (tll-live-counts-v2) now counts every country named in a live story byline on /stories, read the same way as the card flags (47 today across 42 live stories; Balkans counts its 12). Stories still come from the sitemap (42, correct), pets from the sitemap. The old embed counted the five hidden 2.0 cards on /destinations, hence "5". No data-tll-count attributes needed for the footer any more; decision 6 only still matters for the sign-up strip and profiles.
- Banned words in the nav and footer: none found.

## Needs your click (accounts, services, Google)
- **Google Analytics Admin:** two properties are named That Layover Life; the site sends to G-T1K83PRL1R only. Find the other one (grouped under Lub Bub) and archive or rename it.
- **Search Console:** add a Domain property for thatlayover.life, verify with the DNS TXT record at your registrar, then submit https://www.thatlayover.life/sitemap.xml.
- After the events go in: mark them as key events in GA4.

## Staged outside the fix pass
- La Tomatina hero is your after-fight photo of the three of you (old hero moved into the gallery). Check the faces sit in frame after publish.
- Seven Continents flags (8 countries incl. South Africa). The story is still a draft.
- **Story photo placement (Plan B).** Photos now sit under the section they belong to. This also fixes the La Tomatina problem you saw: the live page uses the old script, which drops a photo after every fourth paragraph in gallery order, which is why Calvin Harris photos showed up next to La Tomatina text. After publish, check La Tomatina, Morocco and Pantanal: photos at the end of the right sections, lightbox opens, gallery leftovers at the end.
- **Pantanal:** jaguars plural (title, excerpt, opening line); "São Paulo" with the tilde in its search description.

## Evening fixes, live (12 Oct, third publish 17:48 UTC)
- **Map editor, Aruba and 47 other places** (S68, 13 Oct): the stamp for Aruba opened the editor with nothing to click because the editor only listed places that have a shape in the map outline. Every one of the 250 passport places can now be found in the search and logged. They count and show in the stamps and the list; the map itself still has no outline to fill for Aruba, Curaçao, the Faroe Islands, Hong Kong, Macao, Bermuda, Gibraltar, Jersey and the other small territories.
- **Home chapter 01** (S67, 13 Oct): "The library." replaces "The reading list."; the Rio interlude caption now reads "In the library · Brazil". The saved-stories block on /account still says "Your reading list." Say the word and it becomes "Your library."
- **/account counters** (S61): LOGGED, the Map and lists badge and Layover Wrapped now agree (the lists block could not reach the count function, so Wrapped stayed on "0 countries, 100% couch"). The footer under /account now counts stories from the sitemap (42), not the typed 6. Check /account logged in, Overview tab.
- **/destinations** (S62): every country named in a posted story counts as filed (47 with the footer's reading), not only the nine tiles with a Story Ref. Check the lede number and the dark STORY FILED tiles.
- **Nature heroes** (S66, 13 Oct): Monkeys in Sweaters now opens on the monkey in the tree; From Portland to Mayfield Heights on the sunset mirrored in still water beside the lift bridge. Jay and Dad are in the galleries. Alternatives if either misses: Monkeys, the Ha Long Bay limestone, the Ba Ho boulders, the Phu Quoc sunset; Maine, the Champlain summit signpost in fog, the forest waterfall, the waterfall under the stone bridge at dusk.
- **Camino hero** (S64): Obrigada, F* now opens on the blue route tiles with the pilgrim walking up the lane; the sunrise road is in the gallery. If you would rather have the vineyard with the roses, the church with the flower beds, the turquoise shoreline or the Porto rooftops, say which.
- **Hero swaps** (S63): Monkeys in Sweaters now opens on Jay at the infinity pool with the Son Tra headland; Ninja Duckies on the five ducks lined up on the balcony; Cerveja, Bandeira on the Arena Brasileira stage in the rain; From Portland to Mayfield Heights on Dad in the granite boulders and fog. Old heroes sit in each gallery. I could not measure orientation from here, so if either landscape is not landscape, say which and I swap it: Brazil alternatives are the fans under the big screen or the Ilhabela sunset swimmers; Maine alternatives are the Lake Erie boat with the Cleveland skyline or the lift-bridge sunset.

## Publish
- **Published 12 Oct at Nancy's word** (four full site publishes on 12 Oct, about 16:35, 16:52, 17:48 and 18:06 UTC, and three on 13 Oct about 05:48, 07:11 and 07:23 UTC): every staged edit above is live, including account and sign-in 3.0, "doing the math", photo placement, Pantanal, the flags and the footer count. Nancy: check /account logged in (LOGGED number, Wrapped stats, every tab), a sign-in on your phone, and La Tomatina, Morocco and Pantanal photo placement.
