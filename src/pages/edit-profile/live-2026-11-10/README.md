# Portfolio link under What you make, 10 November 2026 (M1 to M3)

Change log: handoff/CHANGE-LOG-MAKES-PORTFOLIO-2026-11-10.md (Nancy: "Approve M1 to M3 as written, keep it optional").

- before/4080e4be.html: /edit-profile embed 4080e4be-411e-19fe-af28-9d3d1b70fadf as read from Webflow before the write (same as live-2026-10-29/after).
- after/4080e4be.html: written and read back identical; served on the subdomain (publish f8e9f526) identical.
  Adds the "Portfolio link · optional" box under the chips (inside [data-ep-makes], so it shows only while Make things is on) and
  script tll-ep-js-pf at the end of the embed. The link is saved inside partners as portfolio. Part G rebuilds partners from the Shop
  and partners boxes and the More links editor adds its stack, so tll-ep-js-pf wraps E.set to keep portfolio in every partners save.
  A link with spaces or no dot gets "One link only, with no spaces." and is not saved; https is added when left off; http becomes https.
- Public page: src/pages/contributors-template/live-2026-11-10/ (embed 9094ca5e, tll-pf5-n-v1): "SEE THE WORK →" after MAKES,
  only while Make things is on and an https link is saved; opens in a new tab, rel "noopener ugc".
- Worker: src/profile-sync.js keeps partners.portfolio (https, under 200 characters). Deploy source: branch
  worker/portfolio-on-b305b3b (the live 29 October commit plus this change only). Not deployed yet: until it is, the link saves to
  the member's account but the public page does not show it.

Tested on a local copy of the page with the live layers (16.51.0) and the More links editor, stand-in member with a shop link, a partner
and one More link: typing the link saves it; editing the shop box keeps it; editing a More link keeps it and the stack; clearing it removes
it and it stays removed; Make things off hides the box and keeps the link; no page errors; 375 px wide with no sideways scroll.
Public script tested with stand-in profiles: shows with Make things on, hidden with it off, a javascript: link ignored.
