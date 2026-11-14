# Release 16.65.0, independent regression check (14 November 2026)

Verdict: PASS WITH NOTES. Nothing is broken: no new errors, the finished story page is the same as www on every load, every failure case recovers. One measured regression: the Balkans story at 320 to 375 px wide. The breadcrumb grows when the flags script runs, and that moves the painted photo 29 px. CLS goes from 0.017 on www to 0.15 on the test site.

## What was compared
- Test site (16.65.0, pin 0daa78b4) against www (16.64.0, pin 6ec769bb). The HTML came from one plain GET per page per host, served locally to Playwright. After the host name, pin, SRI and publish date are normalized, the HTML is the same on 12 pages (6 stories, a 404 under /stories/, /stories, /travelers, /layovers, /account, a contributor profile). The core is the only difference.
- 293 browser loads in chromium.launch() at 320 to 1440 px wide. Profiles: unthrottled, and slow 4G (150 ms per request, one 1.6 Mbit/s pipe, CPU 4x). Variants: www HTML at www, test HTML at the test address, and test HTML at the www address (to separate host effects from code).
- The two cores served from local copies that match their SRI (the 16.65.0 copy also matches git byte for byte). Chunks are the same at both pins (git diff), so they come from the 16.64.0 cache.

## Behavior changes in the core diff (only the story block, only on /stories/<slug>)
1. The story style (tll-mag-story-v1) goes into the head while the page is being parsed. Before, it was appended to the body at DOMContentLoaded. A MutationObserver moves it after each style element that arrives later. At DOMContentLoaded it moves to the end of the body, the same final place as before. It gains two hold rules.
2. A new early style, tll-story-st3-early-v1, exists only during parsing. It copies the template's meta row, byline row and avatar rules and the footer's commissioned-link rule. Every selector is zero specificity and scoped to the story template page id. It is removed once the template and footer styles have sheets, or at DOMContentLoaded.
3. run() now runs during parsing, as soon as the byline row and the Receipts block (if present) have arrived whole. It falls back to DOMContentLoaded. run() and the Receipts line are still once only.
4. Two holds on the hero:
   - wait-r keeps the photo (and a stamp with no photo) invisible until the Receipts line is in.
   - wait-d clamps the place-and-date line to one invisible line until the template script's DOMContentLoaded work has run.
   Both clear by DOMContentLoaded.
5. Both new observers disconnect by DOMContentLoaded. The diff adds no pageshow, pagehide or unload handler. Other paths are unchanged (the path test returns early). When the core runs after parsing, the old path runs as before.

## Findings
1. Regression, Balkans story at 320 to 375 px: CLS about 0.15 on every load, against 0.017 on www at 360 and 375. It appears on both profiles and in every variant, including the test HTML at the www address, so it will reach www.
   - Cause: at DOMContentLoaded, tllflagsv53 (a page script) adds flags and "+8 countries" to the breadcrumb's country crumb. The breadcrumb grows from 44 to 73 px. In the early layout this pushes the headline, byline, Receipts line and photo down 29 px after they have been painted.
   - On www the same growth happens inside the full layout switch at DOMContentLoaded. That switch is a larger visual change, but CLS mostly misses it because the photo is moved into a new figure.
   - At 384 px and wider the breadcrumb does not wrap, and the test site is better than www (0.011 against 0.016 to 0.09).
   - Southern Africa (a long four-country crumb) moves its photo 38 px at DOMContentLoaded at 344 to 412 px. Its CLS is about the same as www (0.06), so it is not worse by the number, but the photo jump is visible.
   - Possible fix: hold or reserve the breadcrumb the way wait-d holds the place-and-date line, or let the flags script run before first paint.
2. On the other four stories CLS falls sharply (0.04 to 0.23 on www, 0.004 to 0.05 on test) at every width and profile.
3. Slow 4G FCP is 56 to 180 ms later on test (median about +90 ms) on every story. The judge measured +20 to 30 ms unthrottled.
4. Slow 4G LCP is reported later on test on 3 of 12 story and width cases (Pantanal 360 and 390, Balkans 390): about 9.0 to 10.3 s against 6.5 s. The photo appears at the same moment on both sides (8.95 s against 8.98 s on Pantanal). The cause is that the first-paint headline in the magazine layout (43k px) is smaller than the old dark-hero headline (89k px), so the late photo becomes the LCP element. This is a change in what gets measured, not a slower page, but field LCP for stories may read worse on slow phones.
5. The template helper script tll-st3-story-js-v1 is inline in the template, so it cannot be routed to 500. A thrown error was injected at its top on both sides instead. Result: the same page error on both, the same finished page as www, no hold left on, and the early style removed.
6. Hero photo request aborted (matched by its file id, because a page script rewrites the src to a -p-1080 variant): the box is still reserved, the finished layout is the same as www, no hold is left on, and there are no new errors.
7. Reduced motion, 1440 desktop and JavaScript off: the finished page is the same as www, with no new errors.
8. Non-story pages: none of /travelers, a profile, /layovers or /stories has an element with an st3 class (only CSS selectors). Their finished layout and errors match www. /travelers has CLS of about 0.11 on www and test alike, an existing issue that is not part of this release.
9. /account signed out: the same on both sides (CLS 0.011 slow, the same 10 console lines).
10. Consent: with a stub CMP where GDPR applies and no answer is given, no ad or analytics request was made in 6 s on either side. With consent at 3 s, gtag, Ahrefs and AdSense load only after it, on both sides. The real Funding Choices answers at the www address (it reports that GDPR does not apply here, then loads the tags). It does not answer at the webflow.io address. The test HTML served at the www address behaves like www, so this is about the host, not the code.
11. Back and forward: headless Chromium under request routing never restored from the back/forward cache (pageshow persisted false on all 10 navigations, both sides). The back navigation reloads the page, and the result matches the first load. A real restore was not exercised; see the static notes in item 5 of the diff list.
12. Errors: across 293 loads, the console sets and counts are the same on www and test (Memberstack offline message, aborted requests). There are 0 page errors other than the injected one and 0 driver errors.
13. Slow loads on both sides sometimes swap the order of two late blocks at the foot of the story (the write-for-us ask and the reader notes). This is not part of the release.

## Bandwidth and safety
- Webflow bytes in browsers: 0. Images, fonts and video from Webflow hosts were served from local caches or aborted; flag SVG misses got a local placeholder of the same CSS size. The HTML GETs from Webflow hosts total about 4.8 MB.
- jsDelivr bytes: 0 (all hits from cache; the misses failed through the proxy and were aborted on both sides).
- Other: 0.29 MB (Google Fonts CSS and font files, cached after the first fetch). 1,052 non-GET requests aborted.
- No Webflow tool calls, no publish, no screenshots, no member data in these files.

Files: cls-table.json (CLS medians by story, profile and width). The harness and raw loads are in the session scratchpad (nov14/check1665-regression).
