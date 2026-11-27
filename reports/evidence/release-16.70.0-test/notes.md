# rl170: core 16.70.0 and three page code fixes, test site check (27 Nov 2026, plain GETs only)

- Core 16.70.0 (Asia layout-shift fix, merge cfdb893): layers-release pin 121b4fe911753853376831035bcd13d60de402a1, built from 0225477. SRI sha384-lQYmZoXkPCA3mw+DdnKr0yq4bL6dMnbqZ5NfY1Vcg7RZB3wJZFrur0X0OmlH1fDf. jsDelivr serves all 29 files byte-equal (core, 27 chunks, story search index).
- Found before writing: tllformlabelsv2 2.0.0 was registered, applied in place of tllformlabelsv1 and published to www, apex and test at 09:44:50 UTC by a writer outside this log. Left as is. Baseline src/site/live-2026-11-27/r1670/site-scripts.before.json.
- Pre-write check (pre/): 2 plain GETs of the test site. The /submit head and footer and the /edit-profile footer equal the class B before.html files byte for byte.
- 10:03:40 UTC registered tllsitelayersv16 16.70.0; 10:03:44 add_site_script (only the core touched). Read back: 15 scripts, same ids, versions and locations, core 16.69.0 -> 16.70.0. The core is now listed after tllformlabelsv2; the order of scripts within the head and within the footer is unchanged.
- set_page_freeform_code: /submit head (B18), /edit-profile footer (B17), /submit footer (B02).
- Published the Webflow subdomain only (publishTaskId 31797884-d5ee-43f3-a272-2f8638654c31).
- 13 pages on test and www (home, /stories, /about, /travelers, /the-map, /for-expats, /account, /submit, /my-pets, /share-photos, /login, Balkans story, /edit-profile): HTML identical on 13 of 13 after masking host, stamp, core pin and SRI and swapping each class B block for its counterpart. Test carries pin 121b4fe once and no 77b56b3f; www still carries 77b56b3f. Test /submit has B02 and B18 after blocks once each; test /edit-profile has the B17 after block once, and each script id once.
- Bandwidth: 28 HTML GETs from Webflow hosts, about 1.9 MB (M); no images, no browser.
- Still to test on the test site by a person or a later browser run: B02 reload after typing, and the fail box. B08 and B15 wait for Nancy.
