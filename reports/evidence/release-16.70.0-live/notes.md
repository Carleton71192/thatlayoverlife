# rl170: keep going batch on www (27 Nov 2026, plain GETs only)

- Nancy in chat 27 Nov: "Publish www".
- Pre-check: site lastUpdated 2026-11-27T10:06:00Z (bookkeeping after the 10:05:49 test publish); 15 site scripts equal r1670 after.json; /submit head and footer and /edit-profile footer read back through the API as the B18, B02 and B17 after blocks.
- Published www, apex and the test site (publishTaskId 9f539395-349e-4a86-a8d6-dd32b78328d1). Page stamp 13:29:02 UTC.
- First GETs at 13:29 found 9 www pages still cached at the 09:44 publish; re-fetched at 13:30:54 after a 90 s wait.
- 13 pages on www and test (home, /stories, /about, /travelers, /the-map, /for-expats, /account, /submit, /my-pets, /share-photos, /login, Balkans story, /edit-profile): HTML identical on 13 of 13 after masking host and stamp. Every page carries core pin 121b4fe9 once and no 77b56b3f.
- Split from www HTML with tools/page-code-from-html.py: /submit head equals B18 after.html, /submit footer equals B02 after.html, /edit-profile footer equals B17 after.html (byte for byte, trailing newline stripped).
- The apex is not reachable from this machine's proxy; it shares the publish.
- Bandwidth: 44 HTML GETs from Webflow hosts, about 8.7 MB (M; 5.18 MB first round, 3.56 MB re-fetch); no images, no browser.
