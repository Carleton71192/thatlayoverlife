# /spotlight from "Is featured" (25 Oct 2026)

Nancy, 25 Oct: yes, drive /spotlight from the Contributors "Is featured" switch.

- /spotlight (6a0e9c71167aeb2da791f69d): new collection list feefed39-0cc9-1aad-3cc1-8a1508542eb4 at the end of main. Source Contributors, filter Is featured is on, limit 1, attributes data-tll-spot-src, hidden, aria-hidden.
- Inside the item, a block [data-tll-spot] with attributes bound to Slug, Name, Credit mode, Pen name, Badge label, Home base, One line, Bio short, plus an Image bound to Photo.
- Site head: spotlight() no longer types Nancy's card. It reads the hidden list. Featured: name per credit mode (pen name never shows the real name), photo or initials, BADGE · HOME BASE, one line or short bio, Full profile to /contributors/<slug>. Nobody featured: "Not picked yet this week." with Meet the travelers to /travelers.
- Before/after: site-head-before.html, site-head-after.html. Offline test: test/t.mjs (featured, pen name, none), screenshots in test/.
- No one has Is featured on today (checked 25 Oct). Nancy switches it on for one Contributor at a time.
