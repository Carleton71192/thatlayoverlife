# rl172: core 16.71.0 (late lead fix), test site check (27 Nov 2026, plain GETs only)

- Core 16.71.0 (merge bf43cf0 of 175788f; check PASS in reports/evidence/late-lead-2026-11-27/): layers-release pin 2597422466de9dc1ff7f8bcb0c738c2f2f84f933, SRI sha384-vtQYZzh8oCb2Dn6Z0Cz+jrg60Clgicg8f5ba6uSWukhCgZOkACTCBxMUnrvaJ81M, 273,848 B. jsDelivr serves 29 of 29 files byte-equal (core, 27 chunks, story search index).
- Pre-check: site lastUpdated 14:12:53 UTC (after the rl171 publish); 15 site scripts equal r1670 after.json.
- 16:41:11 UTC registered tllsitelayersv16 16.71.0; 16:41:15 add_site_script (only the core touched). Read back: 15 scripts, same ids, versions and locations, core 16.70.0 -> 16.71.0.
- Published the Webflow subdomain only (publishTaskId f44f4b2a-bbfd-48c5-9387-cc023f9d1892, stamp 16:41:24 UTC). No page code changed.
- 13 pages on test and www (home, /stories, /about, /travelers, /the-map, /for-expats, /account, /submit, /my-pets, /share-photos, /login, Balkans story, /edit-profile): HTML identical on 13 of 13 after masking host, stamp, core pin and SRI. Test carries pin 25974224 once and no 121b4fe9; www still carries 121b4fe9.
- Bandwidth: 26 HTML GETs from Webflow hosts, about 1.7 MB (M); no images, no browser.
- Not checked here: the lead mark in a real browser on the test site (the check on saved pages covers it).
