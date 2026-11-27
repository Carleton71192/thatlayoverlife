# rl171: B08 /my-pets empty-state wording on the test site (27 Nov 2026, plain GETs only)

- Nancy in chat 27 Nov: "OK on the your besties" (B08: "your besties" at 0 pets, "Register your pet" on the add card).
- Pre-write: one plain GET of test /my-pets; its footer equals classb-2026-11-25/B08-my-pets-heading/before.html byte for byte. Site lastUpdated 13:29:19Z, nothing staged after the rl170 publish.
- set_page_freeform_code /my-pets footer with B08 after.html; published the Webflow subdomain only (publishTaskId 77e546fb-595a-4cda-a413-2cf2ee05ee51, stamp 13:44:23 UTC).
- Post-publish GETs: the test /my-pets footer equals after.html byte for byte (trailing newline stripped); with that block swapped back to before.html the test page equals www (host and stamp masked). www still serves before.html.
- Bandwidth: 3 HTML GETs from Webflow hosts, about 0.45 MB (M).
- Not tested by hand: the heading and add card at 0 pets need a signed-in member with no pets.
