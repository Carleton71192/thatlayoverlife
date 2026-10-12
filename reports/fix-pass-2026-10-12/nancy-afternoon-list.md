# For Nancy this afternoon (fix pass, 12 Oct 2026)

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
8. **Legal and story wording** with banned words: list to come from the sweep.

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
- **Footer counts:** add `data-tll-count="owner-countries"` to the footer's "87" and `data-tll-count="owner-pets"` to its "1", so one script fills them from the source you pick in decision 6. Until then the 87 stays typed (and two scripts that overwrote it with the visitor's own count are being removed).
- Banned words in the nav or footer, if the sweep finds any (to come).

## Needs your click (accounts, services, Google)
- **Google Analytics Admin:** two properties are named That Layover Life; the site sends to G-T1K83PRL1R only. Find the other one (grouped under Lub Bub) and archive or rename it.
- **Search Console:** add a Domain property for thatlayover.life, verify with the DNS TXT record at your registrar, then submit https://www.thatlayover.life/sitemap.xml.
- After the events go in: mark them as key events in GA4.

## Staged outside the fix pass
- La Tomatina hero is your after-fight photo of the three of you (old hero moved into the gallery). Check the faces sit in frame after publish.
- Seven Continents flags (8 countries incl. South Africa). The story is still a draft.
- **Story photo placement (Plan B).** Photos now sit under the section they belong to. This also fixes the La Tomatina problem you saw: the live page uses the old script, which drops a photo after every fourth paragraph in gallery order, which is why Calvin Harris photos showed up next to La Tomatina text. After publish, check La Tomatina, Morocco and Pantanal: photos at the end of the right sections, lightbox opens, gallery leftovers at the end.
- **Pantanal:** jaguars plural (title, excerpt, opening line); "São Paulo" with the tilde in its search description.

## Publish
- Nothing has been published since your fix-pass prompt. When you're ready, one full site publish covers every staged change (the sitemap changes need a full publish).
