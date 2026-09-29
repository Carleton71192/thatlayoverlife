# B33 Answer guides (pages 6abbdbbadcc11e6928b4481c /copenhagen-stopover, 6abbdbbbbcdc0c05aaa893fc /ees-etias-layover)
Built 29 Sep 2026 from handoff/screens/33-answer-guides-aeo.html and the GUIDES data in prototype-logic.js. Staged, unpublished.
- Slugs are top level (/copenhagen-stopover, /ees-etias-layover), not /guides/..., because the Webflow API cannot create page folders. Nancy can move both into a "guides" folder in the Designer; the canonical links and the tab links then need updating.
- Head (both): canonical, temporary <meta name="robots" content="noindex,follow"> (tll-guide-noindex-v1) to be removed with the DRAFT banner once every answer is checked, shared tll-guide-v1 CSS, hero image per page from existing site assets (Denmark Ice / Doha).
- Body: hero, guide tabs (CPH stopover / EES / ETIAS with aria-current), THE SHORT VERSION, DRAFT banner (data-tll-draft), five H3 questions each with a source link (new tab, noopener), THE LEDGER (dl: CHECKED BY Nancy Carleton, editor / LAST CHECKED Draft, not yet checked / SOURCES / UPDATED), CTA (Paw Passport €9 -> /the-paw-passport, price confirmed on the live Paw page; Share your story -> /submit).
- FAQPage JSON-LD set per page from the same five Q&As.
- US spelling applied to the prototype copy: center, travelers.
