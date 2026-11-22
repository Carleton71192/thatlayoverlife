# Sweep fixes core 16.69.0: test site check (22 Nov 2026, plain GETs only)

- Core 16.69.0: layers-release pin 77b56b3f8413045f2c49c3b40bd7e658689b6a90, built from the merge 2f71c73 (sweep branch at ff8b7cd). SRI sha384-7BuGLQzS/89d4eCS1J14BHSv96uxPPr4tl62X1kJtq7Ngzljs24q8/rce1BHepYz, equal to the core check 3 tested.
- jsDelivr serves all 29 files byte-equal (core, 27 chunks, story search index).
- Registered 16.69.0 and set the site scripts at 16:13:50 UTC: the same 15 scripts, only the core version changed (read back equal).
- Published the Webflow subdomain only at 16:14 UTC (publishTaskId 599d5c63-12ec-462c-80ca-1f2602978bd1). The test site served the new pin from 16:14:21 UTC.
- 12 pages on the test site and www (home, /stories, /about, /travelers, /the-map, /for-expats, /account, /submit, /my-pets, /share-photos, /login, Balkans story): HTML identical on 12 of 12 after masking host, stamp, core pin and SRI. Test carries pin 77b56b3f once and no 0f04fabf; www carries 0f04fabf once and no 77b56b3f.
- About 30 HTML GETs from Webflow hosts, no images, no browser. The HTML files are kept here.
