# Baseline audit, 3 Nov 2026: status

First attempt after Nancy allowed www.thatlayover.life, thatlayoverlife.webflow.io, tll-travel-wire.thatlayoverlife.workers.dev and cdn.jsdelivr.net.

**Not valid yet.** Webflow's file server (cdn.prod.website-files.com), Webflow's jQuery (d3e54v103j8qbb.cloudfront.net), Google's consent message (fundingchoicesmessages.google.com) and AdSense (pagead2.googlesyndication.com) are still blocked by the environment's network policy. Every page loaded without its stylesheet, images and Webflow scripts, so the Lighthouse and axe numbers from this run were discarded. The /stories "no photo" panels and layout shift seen in this run were caused by the blocked images (tll-stories-noimg-v1 did its job), not by a live bug.

**Valid from this run:**
- Live site layers version: 16.49.0 (pin 4fdf0e1), as expected. 16.50.0 is staged, not published.
- Home page head still loads adsbygoogle.js (the staged removal waits on the publish).
- Site head served byte for byte as saved in scratchpad/p0-1031/after/site-head.html.
- Site footer is the pre-Phase 0 copy, as the Phase 0 log planned; its GA4 events helper reads consent through the CookieConsent stand-in in the head.
- Link check (linkcheck.json): all 110 sitemap URLs return 200; 319 internal links checked; no broken internal links. One story body (marathon-on-all-7-continents) links to the bare domain thatlayover.life, which costs a redirect.

**To rerun:** `run-lh.sh` (Lighthouse, five pages, three runs each, run alone), then `node browser-audit.cjs <outdir>` (axe at 390 and 1440, overflow at five widths, screenshots, pre-consent requests), `python3 linkcheck.py <dir with raw/sitemap.xml>`. Needs lighthouse@12 and axe-core@4 from npm and the Playwright Chromium at /opt/pw-browsers. `node hosts.cjs` lists every host the pages request and which are blocked.
