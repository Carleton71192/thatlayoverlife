# B34 Layover Awards (/awards, page 6abbd8ce8bbb9040c31da900)
Built 29 Sep 2026 from handoff/screens/34-layover-awards.html. Staged, unpublished.
- Head: canonical + tll-awards-v1 CSS (attribute selectors data-tll-aw=..., no new Webflow classes).
- Footer: tll-awards-js-v1 (140 counter, member-id from $memberstackDom, year, one per category, local "Your nominations" list keyed tllAwardMine).
- Form: Webflow form "Award nomination", method post, fields category (native select, 5 options), place (required, max 120), why (required, max 140), member-id (hidden), year (hidden). Own success/error copy.
- Gate: data-ms-content="members" around the form, data-ms-content="anonymous" block with Log in / Create a free account.
- Submissions land in Webflow Forms, not in the Award Nominations collection (no Worker yet). Editors copy accepted ones into the collection and set the logged flag in review.
