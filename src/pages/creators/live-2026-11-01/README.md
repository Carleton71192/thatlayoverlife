# /creators, 1 November 2026: MAKES on the cards

Page 6abd0c6f30f767558eb3782b on site 69d6145cf421c777840c1e25. Change log: handoff/CHANGE-LOG-CREATORS-MAKES-2026-11-01.md. Nancy: "Add MAKES to the /creators cards".

- before/: the page head and footer code as served on www on 1 November (identical to src/seo/live-2026-10-28/), and list-settings.json, the hidden collection list's source, filters and the 18 Directory bindings on its source card and photo.
- after/: page-footer.html (tll-dir-js-v2; the head code is unchanged) and list-settings.json (the list on Contributors, filtered list-creators isOn and visibility equals Public, with 19 Contributors bindings on the card and the photo bound to avatar).

Elements: collection list wrapper 51e50175-6eb8-ce98-2b88-575fffaca035, source card 028ea5e8-3f08-8ffc-2986-6bb279d2492f, photo 3ea46f9e-3f51-0be6-539e-e532a02e8746. The empty-state block 51e50175-6eb8-ce98-2b88-575fffaca039 still reads "Nobody has switched on "I'm a creator" yet."; the API refused to set its text.

Order of the write (Webflow refuses a new list source while the card carries bindings): clear the card to its one static attribute and clear the photo binding, set the source and filters, then bind the card and the photo, all in one call. Read back: 20 attributes, source, filters and photo as planned. Footer code written, read back identical. Published to the subdomain only (task e47c1450, 08:36 UTC, 1 November). Served HTML compared with after/page-footer.html: identical. The one source card carries the real creator's data (data-credit renders the option name, "Pen"; data-cmode "Email"; empty fields render empty).

Before the write, an adversarial review (four lenses, two refuters per finding) confirmed 22 findings, one a blocker: the relay form left the site on 31 October (Phase 0), so a "Contact open" button to /contact?relay= would dead-end. Fixed: only Instagram mode gets a contact button. Also from the review: home base, flags and languages are not bound (the profile does not show them); the report subject names the profile address; the sample card stays off while the grid is narrowed; the count reads "n OF total" when narrowed; no Other chip; "OTHER THINGS" wording; the splitter and the first-letter fallback match the profile; aria hint on the Instagram button. Refuted and left alone: eight.

Tested on a local copy of the live page with three stand-ins (Pen name, First name with hidden links and a bad partners value, Pen with an empty pen name and only Other), then on the subdomain with the real list: shuffle, search, make chips, Contact open filter, sample card, report links, no console errors from the script.
