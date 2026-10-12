# For Nancy this afternoon (fix pass, 12 Oct 2026)

Running list. Everything I changed is an unpublished edit; you publish. Full check of the 18 items: `verification.md`. What changed: `report-back.md`.

## Decisions still open (answer in one message, any order)
1. **Paw Passport checkout:** Ko-fi or Gumroad, and the product URL. Until then the buy button, the "coming soon" line, the €9 price, the price meta line and the "everyone who bought it" note are hidden (unpublished).
2. **TLL Ko-fi page URL** (account hello@thatlayover.life). Until then the two /support Ko-fi buttons, "Coming soon", "Price TBC" and the Ko-fi cancel note are hidden. (Correction: the earlier list said these were already removed. They weren't; they are now.)
3. **/faq paid-tier line.** Your proposed line mentions the Ko-fi button, which is hidden until you send the URL. Pick one:
   - A (works today): "Membership is free and stays free. Every published story stays free to read."
   - B (once Ko-fi is live): "Membership is free and stays free. If you want to buy us a coffee, the Ko-fi button is there. It unlocks nothing except our gratitude."
4. **Newsletter name:** "The Layover Letter" everywhere? Yes or no.
5. **Country count rule.** Your map counts Lived + Stayed, which makes you **85**. The site says **87**, which only works if your two layover-only countries (Taiwan, Dominican Republic) count. Magnus is **14** on the map (Denmark marked lived) and **13** in his CMS list. Pick: 85 or 87, and Magnus 13 or 14.
6. **Where logged-out pages read the count from:** the map's own published copy of your record (needs a re-export when you log a country) or the CMS fields (Contributors "Country count", Magnus's list), kept in step with the map.
7. **Home free line under the headline:** A "Free, forever. No card, no paywall." (from the brief) or B "Free to join. We're not a gym. No card, no paywall." (keeps your protected line, which is currently nowhere on the site word for word).
8. **Rename "The shelf." on the home page:** Option 1 "Just filed." (eyebrow "Chapter 01 · Fresh from the road", caption "Just filed · Brazil") or Option 2 "The reading list." (eyebrow "Chapter 01 · Start reading", caption "On the reading list · Brazil").
9. **/submit restructure** (write first, sign up at the end, three steps, five required fields, everything else under "More options"). It moves your Memberstack gate, so I'll bring a change log first. Two questions now: OK to draft it? And do the sign-up inputs count toward the "7 or fewer"? (Google sign-up is 5 + 1 click; email sign-up adds 4.)
10. **Measurement events** (story submitted, sign-up, newsletter, Ko-fi click, guide checkout click, affiliate click), consent-gated: add them to the existing site footer code block, or as one new script? And Google Consent Mode: yes or no (no keeps today's "nothing before consent").
11. **EXIF on /share-photos.** Nothing strips location data today. The page's "We strip EXIF" promises are removed (unpublished). Pick: A re-encode in the browser, B Uploadcare, C upload through the Worker with metadata removed, or D you strip location before anything is published. Note: the form probably doesn't deliver the photo files at all (plain Webflow form, not the File Upload element). One test submission from you would confirm.
12. **/pillars pages:** noindex all five, or only the four thin ones (1, 1, 0, 0 stories)?
13. **"Currently in Copenhagen, Denmark · filing weekly"** (your Contributors CMS line): it is now out of the page HTML. Clear the field too?
14. **Guides /copenhagen-stopover and /ees-etias-layover:** please check each answer against its source and give me the "last checked" date. Then I remove the DRAFT boxes, noindex and "THE LEDGER", drop "€9." and turn draft off.
15. **Photo placement defaults I used** (change any): Kilimanjaro Uhuru sign stays in the gallery; Sort Sol beach and lighthouse under "Sunday"; Sort Sol carved sign under "Finding the birds"; Paraguay neon sign under "The country across the bridge"; Morocco souk photos at the first afternoon.
16. **Pantanal title** now reads "Glimmers in the Wild: 120 Wooden Bridges, Jaguars, and No Guide". If you'd rather name the number ("Two Jaguars", "Three Jaguars"), tell me how many.

## Decided (12 Oct)
- Footer guides: build short pages now; footer links stay as they are.
- La Paz: not hosted. Its Disclosure field is empty, so the hosted line never shows.
- Passport total: 249.
- Photo placement: Plan B (the "Photo placements" collection). Built and staged.

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
