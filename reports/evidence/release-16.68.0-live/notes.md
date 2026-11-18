# Send wait release live check (18 Nov 2026, plain GETs only)

- Published www, apex and test site 10:38:37 UTC (publishTaskId 086d7edd-fc02-49c6-884d-efabbd6f05ae). Webflow get_site: both custom domains lastPublished 2026-11-18T10:38:37Z.
- www /submit served core pin 0f04fabf from 10:38:48 UTC.
- 12 pages on www and the test site (home, /stories, /about, /travelers, /the-map, /for-expats, /account, /submit, /my-pets, /share-photos, /login, Balkans story): HTML identical after masking host and stamp, 12 of 12. Each carries core 0f04fabf once and no older core pin; photo clean f67f3f74 once on /submit and /my-pets only, 22019832 nowhere; the /submit footer block equals webflow-c-after.html once.
- About 25 HTML GETs from Webflow hosts, no images, no browser. The apex is not reachable from this sandbox; its publish time is confirmed in Webflow only.
