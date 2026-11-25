# Sweep fixes core 16.69.0 live check (25 Nov 2026, plain GETs only)

- Published www, apex and test site (publishTaskId c57a0e40-fafb-406e-93df-ff49edcfbff2). www served core pin 77b56b3f from 08:01:33 UTC.
- 12 pages on www and the test site (home, /stories, /about, /travelers, /the-map, /for-expats, /account, /submit, /my-pets, /share-photos, /login, Balkans story): HTML identical after masking host and stamp, 12 of 12. www carries pin 77b56b3f once and no 0f04fabf.
- About 25 HTML GETs from Webflow hosts, no images, no browser. The apex is not reachable from this sandbox; it shares the publish.
