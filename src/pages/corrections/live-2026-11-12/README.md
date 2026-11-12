# /corrections (page 6af47b5bb6b903179f4bed8d), as staged on 12 November 2026

Built by the trust and conversion session (handoff/CHANGE-LOG-TRUST-CONVERSION-2026-11-11.md, items 20 and 21).

- Hero: eyebrow "CHARTER RULE 7", h1 "Corrections", intro "When we get something wrong, we fix it on the story and log it here."
- Collection list 113b72a3-1c36-6630-331f-4bae390556bc inside block a79bb9e2 (data-tll-corrections="list"):
  source Stories, filter "Correction note is set" (correction-note isSet), sort Last updated newest first, limit 100.
- Item card f68b398d (data-tll-corrections="entry"): date line 3734bc88 (attributes data-date = Last updated, data-slug = Slug),
  h3 38e5fc6f bound to Name, p 4b6b208c bound to Correction note. The page footer script writes "Correction, 11 November 2026"
  and links the h3 to /stories/{slug}.
- Empty slot: the card dad0770c "No corrections yet. If you spot one, tell us at hello@thatlayover.life." (Webflow's default
  "No items found." removed).
- Head code: robots noindex, follow (Nancy deletes that line when the first correction is in) and the style block below.
  The page is also out of the sitemap (includeInSitemap false); switch that on at the same time.

To log a correction: on the story, fill Correction note and set Last updated to the date of the fix, then publish the story.
It shows on the story above "Last updated" and appears here.
