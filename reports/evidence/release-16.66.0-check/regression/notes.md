# Release 16.66.0, independent regression check (15 November 2026)

Verdict: PASS WITH NOTES. Nothing found that should keep 16.66.0 off www. The Balkans case that failed 16.65.0 (320 to 375 px) is fixed. No fault, profile or navigation made the test site worse than www, apart from the known empty crumb box when the flag script fails (note 1).

Core under test: tllsitelayersv16 16.66.0 on that-layover-life.webflow.io (layers-release pin 3df16988ac1674485a2fe44d24f3763073d0c98d, SRI sha384-trfI5wIn..., published 20:18:14 UTC), against www.thatlayover.life on 16.64.0 (pin 6ec769bb, SRI sha384-m7ORNXLx...). Read only: no Webflow tool calls, no publish, every non-GET aborted. Loads ran 21:08 to 22:30 UTC.

## Method

- HTML: one plain GET per page per host at 21:05 UTC (13 pages: seven stories, a 404 under /stories/, /stories, /travelers, /layovers, /account signed out, one contributor profile). After the host name, pin, SRI and the Last Published comment are normalized, the two copies are the same on all 13 pages. The test pages carry pin 3df16988 and its SRI once and neither 6ec769bb nor 0daa78b4. The GETs are listed in html-gets.tsv (1.8 MB on the wire).
- Browser: headless Chromium (Playwright), a fresh context per load, the two hosts alternating within each round. Each host's HTML is served at its own address (www at www, test at the webflow.io address). A third variant (test HTML at the www address) ran only in the smoke loads and matched the test address.
- The cores come from local caches and run with their SRI in place: the cached 16.66.0 core matches sha384-trfI5wIn... and equals git at the pin byte for byte. git shows that only the core differs between the two pins under src/site-layers, so chunks are served from the existing caches. Every story load ran its host's core (237 of 237 each side; the other 6 per side are JavaScript off).
- Images, fonts and video from Webflow hosts: local caches only. 128 misses were aborted, never fetched; flag SVG misses got a local placeholder of the same size. Memberstack served patched (no hiding after its aborted POST), ad and analytics endpoints answered locally with an empty body, as in the earlier checks.
- Slow 4G: 150 ms per request, one 1.6 Mbit/s pipe, CPU 4x. Phone widths at deviceScaleFactor 3 (390 at 390x844, others at a height of 780), desktop at 1440x900.
- CLS is the sum of all layout-shift entries until 3.5 s (4 s on slow and 6 s on consent loads) after the load event. "Equals www" means the box list of every visible element (left, top plus scroll, width, height) equals a www load of the same page, width and fault.
- One browser at a time: the harness waited for any other browser to go quiet before each load and would have rerun a load that overlapped; no other browser ran.
- 486 measured loads (243 per host) plus 10 smoke loads. Files: table.md (per cell), summary.json, loads.csv (one row per load), html-gets.tsv. The harness is in the session scratchpad (nov15/check1666-regression), built from the A4R adversarial harness.

## Results

1. Balkans 320 to 375 px (the 16.65.0 failure), 5 loads per host per width, unthrottled:

   | width | www | test |
   |---|---|---|
   | 320 / 330 / 340 / 344 | 0.126 / 0.129 / 0.126 / 0.127 | 0.002 / 0.003 / 0.004 / 0.004 |
   | 350 / 360 / 368 / 375 | 0.018 / 0.017 / 0.017 / 0.016 | 0.004 / 0.009 / 0.004 / 0.021 |
   | slow 4G 320 / 344 / 375 | 0.131 / 0.129 / 0.035 | 0.003 / 0.004 / 0.021 |

   16.65.0 measured about 0.15 here. The photo no longer moves after it is painted (no hero move at any width under 375). 375 stays a little above www (0.021 against 0.016), as the A4R judge and the behavior check found. Every test load ends equal to www.
2. Slow 4G on all seven stories at 360 and 390 (3 loads per host): www median 0.034 to 0.247 with 30 of 42 loads over 0.1; test 0.0034 to 0.0195, none over 0.1. FCP is later on test by a median of 104 ms (60 to 160 ms) across the 23 slow story cells; the photo shows a median 50 ms later (33 to 72 ms). On Balkans 375 and 390 the reported LCP moves from the headline (6.5 s) to the late photo (10.3 s), while the photo appears at the same moment on both hosts; this is the change in what is measured that the 16.65.0 check described, not a slower page. Every test load ends equal to www.
3. Flag script routed to 404 (both hosts; Balkans, Southern Africa, Croatia and Madrid at 360 and 390, plus slow 4G): no new errors, no CLS above 0.02 on test (www 0.02 to 0.35). Finished page equals www on Southern Africa, Croatia and Madrid. On Balkans the flag stand-in stays as an empty hidden box 137 px wide in the crumb. At 390 the page is otherwise the same height; at 360 the crumb wraps to a second line (44 to 73 px), so the headline and photo sit 29 px lower for the life of the page. It does not move after paint (CLS 0.0195, the same as a normal load). This is the known note in the release. Combined with the template throw, Southern Africa keeps the empty box too. A flag script that throws behaves the same as a 404.
4. Template script failing (a throw injected at the top of tll-st3-story-js-v1 on both hosts; four stories, 360 and 390, plus slow 4G): the same single page error on both hosts, no hold left on, finished page equals www on every load. Test CLS 0.003 to 0.0099 (slow Southern Africa 390: 0.040, www 0.085); www 0.04 to 0.36.
5. Hero photo aborted (four stories at 390, plus slow 4G): box reserved, finished page equals www, no hold left, no new errors. Test 0.003 to 0.006, www 0.04 to 0.14.
6. Reduced motion (390 and 1440) and JavaScript off (390 and 1440): finished page equals www on every load. JavaScript off: CLS 0, nothing hidden, no early style, no hold on either host.
7. Back and forward (Balkans and Southern Africa at 390, story to /stories, back, forward, back): the restored story equals the first load on both hosts, every hold and the early style gone, Receipts line, stamp, minutes and caption present once. Headless Chromium under request routing never restored from the back/forward cache (pageshow persisted false on all navigations, both hosts), so the new reload and back scroll nudge ran on a reload path only.
8. Resize and rotation after load (390x844 to 844x390 and back; 360 to 412, 320 and 1024; 1440 to 390 and back; four stories): after every step the test page equals www box for box, the shift sum during each resize is the same number on both hosts, and no hold or stand-in comes back.
9. Consent stub, GDPR applies and no answer (Balkans, /stories and /travelers at 390, 6 s): 0 ad or analytics requests on either host other than the consent script itself. With consent given at 3 s, AdSense, gtag and Ahrefs are requested about 35 ms after it on both hosts.
10. Non-story pages, 390 and 1440, plus slow 4G at 390: the profile, /layovers, /account signed out and the 404 under /stories/ end equal to www with CLS within 0.01 of www and the same console lines. On the 404 the story block's path test matches, but nothing is left behind (no early style, no wrapper on document.addEventListener).
    - /travelers draws a random selection, so no two loads match on either host. With Math.random seeded the same on both, test equals www box for box at 390, 1440 and slow 390 (8 of 8) with the same CLS (0.09 to 0.14 on both, an existing issue noted in the 16.65.0 check).
    - /stories ends equal to www on every load. At 1440 an existing race (the search bar and filters move 7 px while the chips paint) sometimes pushes CLS to 0.11. Over 18 loads per host it hit www 5 times and test 6 times (12 extra loads: www 5, test 3). The story layer does not run on /stories. Not caused by 16.66.0.
11. Errors: 0 driver errors. Page errors only where a fault was injected, the same on both hosts (template throw 24 and 24, flag throw 2 and 2). Console sets otherwise the same (Memberstack offline message, aborted requests, the about:blank sandbox notice; on /account a blocked tunnel line on both hosts).
12. Foot of story: on slow loads of Vietnam and Phuket two finished-page variants occur (late content near the foot); both variants appear on both hosts and the heading order is the same. Not part of this release.

## Notes (not blocking)

- If the flag script fails, Balkans keeps an empty 137 px box in the crumb; at 360 that adds a second crumb line and 29 px of space above the headline (www shows the plain crumb). Stable, no shift. Southern Africa keeps one only when the template script fails too.
- Slow 4G FCP about 100 ms later than www; photo about 50 ms later; reported LCP later on Balkans 375 and 390 because the measured element changes.
- Balkans 375 at 0.021 against www 0.016.
- Headless Chromium only; documents served whole, so chunked parsing on a real slow phone is not covered.

## Bandwidth and safety

- Webflow hosts: 26 plain GETs of HTML, 1.8 MB on the wire. Browser loads fetched 0 bytes from Webflow hosts and 0 from jsDelivr (all cache hits; misses aborted or placeholders). No sitemap crawl.
- 1,465 non-GET requests aborted. No form submitted, no Webflow tool call, no publish, no screenshots, no member data in these files (the profile is named only as "profile").
- Disk free 7.4G throughout.
