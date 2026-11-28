# rl172: core 16.71.0 (late lead fix), www publish check (28 Nov 2026, plain GETs only)

- Nancy in chat 28 Nov: "Publish www". Pre-check 09:16 UTC: nothing changed since the 27 Nov 16:41 test publish; 15 site scripts, core 16.71.0.
- Published www, apex and the test site (publishTaskId 9741a341-2c7a-4bf5-9ace-feb9ac1359ff, stamp 09:16:21 UTC).
- GETs from 09:17:54 UTC, 13 pages on www and test: HTML identical on 13 of 13 after masking host and stamp. www carries pin 25974224 and SRI vtQY... once on every page, and no 121b4fe9.
- The apex is not reachable from this machine's proxy; it shares the publish.
- Bandwidth: 26 HTML GETs from Webflow hosts, about 1.7 MB (M); no images, no browser.
