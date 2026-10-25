# /spotlight from "Is featured" (25 Oct 2026)

Nancy, 25 Oct: yes, drive /spotlight from the Contributors "Is featured" switch.

- /spotlight (6a0e9c71167aeb2da791f69d): new collection list feefed39-0cc9-1aad-3cc1-8a1508542eb4 at the end of main. Source Contributors, filter Is featured is on, limit 1, attributes data-tll-spot-src, hidden, aria-hidden.
- Inside the item, a block [data-tll-spot] with attributes bound to Slug, Name, Credit mode, Pen name, Badge label, Home base, One line, Bio short, plus an Image bound to Photo.
- Site head: spotlight() no longer types Nancy's card. It reads the hidden list. Featured: name per credit mode (pen name never shows the real name), photo or initials, BADGE · HOME BASE, one line or short bio, Full profile to /contributors/<slug>. Nobody featured: "Not picked yet this week." with Meet the travelers to /travelers.
- Before/after: site-head-before.html, site-head-after.html. Offline test: test/t.mjs (featured, pen name, none), screenshots in test/.
- No one has Is featured on today (checked 25 Oct). Nancy switches it on for one Contributor at a time.
- Applied differently from the first plan: the new card code lives in the /spotlight page footer (page-footer-after.html, read back identical), not the site head. Footer scripts run before DOMContentLoaded, so it renders first and sets data-tll-sp, and the old site head spotlight() skips the card. The site head is unchanged (its dead Nancy card can be removed next time the site head is edited; site-head-after.html is that version).
- The card's static link now points to /travelers, and its static text (no-JS and crawlers) reads TRAVELER / Picked from the travelers / Not picked yet this week. / Meanwhile, every traveler on the site has a profile worth a look. / Meet the travelers. "87 countries" is gone from the page source.
- Offline test against the live site head: test/t-footer.mjs (featured, pen name, none all pass; the old card never renders).
