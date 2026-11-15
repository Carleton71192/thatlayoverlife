# Release 16.66.0, behavior check: real test site against real www (15 November 2026)

Verdict: PASS WITH NOTES. Nothing found that should keep 16.66.0 off www.

Core under test: tllsitelayersv16 16.66.0 on that-layover-life.webflow.io (layers-release pin 3df16988ac1674485a2fe44d24f3763073d0c98d, SRI sha384-trfI5wIn..., published 20:18:14 UTC), against www.thatlayover.life on 16.64.0 (pin 6ec769bb, SRI sha384-m7ORNXLx...). Independent checker, read only: no Webflow tool calls, no publish, every non-GET aborted. Loads ran 20:26 to 21:01 UTC.

## Method

- Plain GET of the nine pages on each host at 20:26 UTC (home, /stories and seven stories). On every page the two copies differ only in the Last Published comment, data-wf-domain and the core tag (pin and SRI).
- Chromium headless (Playwright 1.56.1), fresh context per load, the two hosts alternating within each round. Main documents and reloads went to the real hosts over the network. Same-origin fetches made by scripts for the nine paths: the plain-GET copy of the same host.
- Webflow css and js, images, flags and fonts: local caches from the earlier checks; a missed image was aborted, never fetched (the same files on both hosts, listed below). jsDelivr: the 16.66.0 core and four chunks at the new pin were fetched once and cached; the cached core matches the release SRI (sha384-trfI5wIn...) and equals the local A4R build byte for byte. Memberstack served patched (no hiding when its aborted app POST fails) and ad and analytics endpoints answered with an empty body on both hosts, as in the A4R judge, so ad fills do not differ between hosts.
- Widths: 320x780, 360x780, 375x780 and 390x844 at deviceScaleFactor 3 (mobile, 5 loads per host), 1440x900 (3 loads per host). Reload after scrolling to 2,500 px at 390 on Balkans and Madrid (5 per host). Home and /stories at 390 (5 per host) and 1440 (3 per host).
- CLS is the sum of every layout-shift entry until at least 3.5 s after the load event and 4 s after navigation start (the sum up to 4 s is the same number on every load). FCP and LCP from the paint and largest-contentful-paint entries.
- Finished page: the box of every visible element (left, top plus scroll, width, height), hashed. "Equals www" means the list equals a www load's list in the same cell.
- One browser at a time: before every load the harness waited until no browser outside its own process tree had used CPU, and would have rerun a load that overlapped another browser. No other browser was active during the run (0 waits, 0 reruns).
- 386 measured loads (193 per host), plus 4 smoke loads before the run. Files: table.md (per cell), summary.json, loads.csv (one row per load), home-boxes.json, harness/.

## Results

1. Core on every load. 193 of 193 test loads requested pin 3df16988 once, got HTTP 200, passed the SRI check and ran (window.tllSelfDoc present); the tag on the page carries pin 3df16988 and sha384-trfI5wIn. 193 of 193 www loads ran pin 6ec769bb the same way.
2. Errors. 0 page errors and 0 failed scripts on either host. Console errors are the same 1,034 on each host: the Memberstack network error from the aborted POST, the aborted request line, and an about:blank sandbox notice.
3. Holds and stand-in. On all 171 test story loads the early style was added and gone before the end, and the route strip hold (data-tll-mg-wait-r) was set; the Receipts hold (-d) was set on the 143 loads of the six stories with a Receipts line (not on Madrid, which has none). The flag stand-in (data-tll-mg-flags) appeared on Balkans, Southern Africa, Madrid, Vietnam and Lisbon (median life 182 ms, longest 262 ms, gone a median 15 ms after DOMContentLoaded). On Croatia ("Croatia and Bosnia and Herzegovina") and Phuket ("Phuket to Singapore") the crumb has no flag on either host, so no stand-in is drawn; that is expected. At the end of every load: no hold, no stand-in, no early style, nothing in the hero left hidden. www never has any of these (expected).
4. Finished page. Every one of the 179 test story, reload and /stories loads ends with the same box list as a www load in its cell; no foot-of-story order case was needed. The two reload cells end at scrollY 2,500 on both hosts (10 of 10 each). Home has a part chosen at random on every load (story cards whose text widths change), so no two home loads match on either host, www included. With Math.random seeded the same on both hosts, home equals www box for box at 390 and 1440 (3 of 3 each), with the same CLS. Hero photo loaded on 156 of 171 story loads per host; the other 15 are the 1440 heroes of Croatia, Southern Africa, Phuket, Lisbon and Vietnam that are not in the local caches and were aborted on both hosts (the hero box is there, the photo is not drawn).

## CLS (median, max, loads over 0.1), www then test

| cell | www | test |
|---|---|---|
| Balkans 320 / 360 / 375 / 390 | 0.128, 0.018, 0.016, 0.036 | 0.002, 0.020, 0.021, 0.003 |
| Croatia 320 / 360 / 375 / 390 | 0.069, 0.119, 0.043, 0.144 | 0.002, 0.004, 0.004, 0.004 |
| Southern Africa 320 / 360 / 375 / 390 | 0.067, 0.067, 0.063, 0.055 | 0.002, 0.004, 0.004, 0.006 |
| Madrid 320 / 360 / 375 / 390 | 0.040, 0.066, 0.047, 0.057 | 0.002, 0.004, 0.004, 0.003 |
| Vietnam 320 / 360 / 375 / 390 | 0.105, 0.034, 0.034, 0.214 | 0.008, 0.012, 0.013, 0.016 |
| Phuket 320 / 360 / 375 / 390 | 0.125, 0.067, 0.066, 0.147 | 0.019, 0.012, 0.011, 0.014 |
| Lisbon 320 / 360 / 375 / 390 | 0.062, 0.048, 0.047, 0.211 | 0.002, 0.004, 0.004, 0.004 |
| Stories at 1440 (7 cells) | 0.009 to 0.016 | 0.0001 in every cell |
| Balkans reload at 2,500 (390) | 0.376 (5 of 5 over 0.1) | 0.0105 (0 of 5) |
| Madrid reload at 2,500 (390) | 0.229 (5 of 5) | 0.0063 (0 of 5) |
| Home 390 / 1440 | 0.0034 / 0.0005 | 0.0034 / 0.0005 |
| /stories 390 / 1440 | 0.0284 / 0.0498 | 0.0284 / 0.0498 |

- Story loads at phone widths (140 per host): www median 0.066, max 0.380, 51 over 0.1; test median 0.0043, max 0.021, 0 over 0.1. Median cell: www 0.065, test 0.0043.
- Test loads over 0.1: 1 of 193, a /stories load at 1440 (0.116). www has the same load shape once in the same cell (0.113): the search bar and the chips move about 7 px before DOMContentLoaded. The story layer, the only part this release changes, does not run on /stories; the 16.65.0 check saw the same rare /stories race. Not caused by 16.66.0.
- Test is equal to or lower than www in every story cell except Balkans 360 and 375 (0.020 and 0.021 against 0.018 and 0.016), as the A4R judge measured (0.0195 and 0.0213). The test numbers match the A4R lab to the fourth decimal in most cells (for example Croatia 390 0.0039, Southern Africa 390 0.0057, the Balkans reload 0.0105).

## FCP and LCP

- Phone widths (28 cells): pooled median FCP 264 ms on both hosts; median of cell differences (test minus www) +2 ms, range -76 to +104 ms. LCP pooled 420 ms on www, 308 ms on test; median cell difference -94 ms (range -152 to +28).
- 1440 (7 cells): FCP pooled 284 ms www, 280 ms test (cell difference median -12 ms); LCP 300 ms www, 280 ms test.
- Reloads at 2,500 px: FCP 188 ms on both; LCP (a paragraph, the page is scrolled) 188 ms www, 238 ms test, about +50 ms on both stories. This is the known note in the release: the story body is held until the Receipts line is in. The large shift www has here (0.23 to 0.38) is gone.
- Home and /stories: FCP and LCP within the spread of the two hosts (home 1440 FCP median: test 448 ms, www 360 ms on the unseeded loads; test 396 ms, www 400 ms on the seeded ones).

## Notes (not blocking)

- Balkans 360 and 375 stay slightly above www (about 0.02 against 0.017), as the A4R judge found. Well under 0.1.
- Reload LCP about 50 ms later than www (see above); FCP the same.
- Home cannot be compared box for box without fixing Math.random, on either host; with it fixed the pages are equal.
- Headless Chromium only. Documents are served whole by Playwright after the network fetch, so real chunked parsing on slow phones is not covered here.

## Bandwidth and disk

- Webflow hosts: 0 image, video or font bytes. HTML: 18 plain GETs (1.37 MB) and 410 navigations including the smoke loads (31.5 MB on the wire, body and headers). 0 css or js fetched from Webflow (all cache hits). Total from Webflow hosts about 32.9 MB.
- jsDelivr 0.34 MB (the 16.66.0 core, 252,289 bytes, and chunks site, story, home and stories at the new pin, each once). Google fonts 0 (cached). Ads and analytics answered locally.
- Disk free 8G before every batch.
