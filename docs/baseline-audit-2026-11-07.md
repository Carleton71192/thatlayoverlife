# Baseline audit of the live site, 7 November 2026

Measured on www.thatlayover.life with site layers 16.49.0 live, once every host the pages use was allowed in this environment (Webflow's file server, jQuery, the consent message, AdSense, Memberstack). The spam-check subdomain brunhild.challenges.cloudflare.com was still refused; it affects only the Turnstile box on /stories, /login and /signup.

**How it was measured.** Lighthouse 12, mobile settings (simulated slow 4G and a 4x slower CPU), three runs per page, the median run kept. Accessibility with axe-core 4.10 at 390 and 1440 px wide. Layout at 360, 390, 768, 1024 and 1440 px. A second browser test, throttled the same way, loaded each page with the live script and again with the staged script swapped in, three runs each. Scripts and raw results: `scratchpad/baseline-2026-11/`.

## Against the targets in the redesign brief

| Page | Performance (target 85, home 80) | Accessibility (95) | Best practices (95) | SEO (100) | Largest image shown | Layout shift (0.1) |
|---|---|---|---|---|---|---|
| Home | 39 | 96 | 82 | 92 | 12.7 s | 0.78 to 0.85 in the browser test (Lighthouse reads 0) |
| /stories | 45 | 93 | 96 | 100 | 14.7 s | 0.39 in the browser test |
| /stories/antarctica-marathon | 56 | 96 | 96 | 100 | 10.7 s | 0.09 |
| /the-map | 30 | 96 | 100 | 100 | 9.8 s | 0 |
| /the-paw-passport | 60 | 95 | 96 | 100 | 14.2 s | 0 |

No page meets the performance target. Accessibility meets 95 on four of five pages. The home page misses best practices (a script on the page uses a deprecated browser feature) and SEO (links Google cannot follow: anchors without a real address).

**Why Lighthouse and the browser test disagree on layout shift.** Lighthouse stops measuring shortly after the page loads. The home page's big jump happens later, at about 5.5 seconds on a slow phone, so a real visitor sees it and Lighthouse does not. The brief's figure of 0.70 matches the browser test.

## What makes the pages slow, biggest first

1. **Our own site script blocks the first paint on every page.** The one 500 KB file (136 KB compressed) costs about 3.3 s of render-blocking on slow mobile. The staged 16.50.x split fixes this; see below.
2. **Photos are served at full upload size.** /stories downloads cards of 500 KB to 1 MB each where a phone needs about 50 KB; Lighthouse estimates 3 MB of savings on that page alone. The Paw Passport hero is a 1.2 MB background photo. The /the-map header photo is 400 KB. These are CMS photos served at their uploaded size, so the fix is either smaller uploads or resizing on the way out (the Phase 1B photo pipeline).
3. **Fonts.** The magazine cover and story pages load Newsreader (about 270 KB for two files) on top of the brand fonts. The Designer still loads DM Sans, Recoleta and DM Serif Display, which the brand does not use; when they finish, at about 9 s, the home page shifts again (0.08). Both wait for the fonts session in Phase 2.
4. **Late discovery of the main image.** The home cover photo is added by our script, so the browser finds it only after the script runs. 16.50.x adds an early preload for it.
5. **Third-party scripts that block the first paint:** Webflow's jQuery (about 1.7 s on story, map and Paw Passport pages), webfont.js (about 1 s) and the old CookieConsent library, which still loads from the site footer although the new consent tool switched it off on 31 Oct (about 0.4 s).
6. **The map.** MapLibre and the world outline file (about 500 KB together) and heavy drawing. The 6 s of main-thread time measured here is inflated: this test browser draws the globe without a graphics card.
7. **/stories page weight of 11 MB** is mostly four 1.5 MB Turnstile challenge requests, very likely a retry loop caused by the one spam-check host still blocked here. To recheck once that host is allowed.

## Fixed today, staged as site layers 16.50.1

The home page's 0.78 layout shift had one main cause, and it was ours: the value section ("The slide show. The trip deck. The lost account.") was inserted when the page finished parsing, after the phone had already drawn the cover, and pushed "01 · The stories" about 1,000 px down. It now goes in before the first paint. Registered in Webflow as 16.50.1 and applied to the header; **not published**. jsDelivr serves the core and chunks byte for byte as registered.

## Live 16.49.0 against staged 16.50.1 (browser test, slow phone, three runs each)

| Page | First paint | Largest image shown | Layout shift | Our script downloaded |
|---|---|---|---|---|
| Home | 3.1 s to 2.1 s | 9.2 s to 7.6 s | 0.85 to 0.19 | 135 KB to 47 KB |
| /stories | 3.1 s to 2.6 s | 22.8 s to 20.5 s | 0.39 to 0.47 | 135 KB to 51 KB |
| Story page | 2.6 s to 2.3 s | 2.6 s to 2.3 s | 0.03 to 0.04 | 135 KB to 53 KB |
| /the-paw-passport | 2.4 s to 2.2 s | 12.7 s to 12.3 s | 0.02 to 0.02 | 135 KB to 58 KB |

Medians of three runs, 16.49.0 first. Story page: its largest element is the headline text, so the image column is the headline time.

**/stories gets slightly worse with 16.50.x (0.39 to 0.47).** The live page already shifts 0.39: its own footer code moves the search box into the filter row when the page finishes parsing. With the faster first paint, the phone now draws the page once more before the page's own search-bar styles arrive (they sit at about 90% of a 260 KB page), which adds about 0.08. The fix is page code on /stories: move the two style blocks `tll-lib-fixfirst-v1` and `tll-s3-stories-v1` from the page footer to the page head, and make the search-merge script run as soon as the filter row exists instead of at the end of parsing. Not staged: it is the main library page, and a staged page edit goes live with anyone's next publish, so it waits for Nancy's word and a before-and-after screenshot check.

## Still above target after 16.50.1, and what each needs

- **Home layout shift.** Two causes remain. The phone header shows both "Log in / Sign up" and the members' "Account" pill until Memberstack loads, wraps to two lines, then snaps back. The fix is a header rule (keep it on one line while loading), which by the house rule waits for a session with Nancy. The unused Designer fonts cause the late 0.08 shift; that is the fonts session.
- **Photo sizes** on /stories, /the-paw-passport and /the-map: Phase 1B photo pipeline, or Nancy re-uploading the three biggest heroes at 2000 px wide.
- **Old CookieConsent library** in the site footer: one line to remove. It would go live with anyone's next publish, so it waits for Nancy's word.

## Accessibility (axe, 11 pages at 390 and 1440)

- **Critical:** two checkboxes on /for-expats without a label (`#checkbox`, `#xg-check`).
- **Serious, contrast:** 792 elements on 7 pages. The biggest groups: the home value section's eyebrow and heading color, the teal eyebrows, the story card meta lines on /stories at desktop width, and the Been / Want toggles on /the-map.
- **Serious, aria-hidden-focus:** 57 author photos on /stories cards are hidden from screen readers but still focusable.
- **Serious, label-content-name-mismatch:** the footer wordmark on every page (known since the Phase 2 audit).
- **Moderate:** no `<main>` on the story template, /login and /signup; no h1 on /submit and /share-photos signed out.
- No horizontal scrolling at any of the five widths on any of the 11 pages.

## Consent

Before any choice, no GA4, Ahrefs or ad requests on any of the 11 pages; `__tllConsent` reads all false. Google's consent tool loads its own helper files from the ads domain, which is expected. The consent message itself did not appear in this test: the test machine is not in the EU, so Google shows no message. Checking the EU message needs a browser in Europe.

## Links

All 110 sitemap pages return 200. 319 internal links checked, none broken. The six 301s published on 3 Nov work. /for-affiliates returns 404 until its redirect is added in Site settings.

## Limits

- Lab measurements from one machine through a proxy, not real-user data. Real phones will differ, but the causes above are the same everywhere.
- The map's main-thread time is inflated by software drawing.
- One spam-check host still blocked; the /stories weight figure needs a recheck.
