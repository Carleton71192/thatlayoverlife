# Bandwidth fixes 2, 3 and 7: smaller photos, same look

13 November 2026. From reports/bandwidth-2026-11-13.md, section 3. Built and measured offline. Nothing in Webflow was changed and nothing was published.

## What changes

**Fix 2. Phones at 3x get card and cover photos at 2x.** The image layer (src/site-layers/tll-img-variants-v1.js) gets `cap()`. It puts extra entries in front of a photo's `sizes` list. They only match phones (up to 767px wide) at 2.5 dppx and up, and each gives two thirds of the normal width. A 343px card on a 3x phone now takes the 800px file instead of the 1080px one. The home cover takes the 800px file instead of the 1600px one. Phones at 1x and 2x, tablets and desktops match none of the new entries, so they pick exactly as before.
- Card photos covered: /stories library cards and the lead card, related story cards, home rail cards and postcards, and profile and destination cards.
- The cover uses the same list for its preload and its img, so it is still fetched once.
- Story heroes, inline and gallery photos, home bands and avatars are not touched.

**Fix 3. Home page.**
- The never-shown Curacao hero: this needs a Webflow change, see webflow-proposal.json. One Designer image goes from eager with high fetch priority to lazy. With JavaScript, the cover layer has already set the cover photo before layout, so the Curacao file is never fetched. With JavaScript off, browsers ignore lazy loading, and the Curacao photo loads and shows as today (nojs.jsonl, checked at 390 and 1440).
- The 0 x 0 rail photos: new core layer src/site-layers/tll-rail-hold-v1.js, for the home page under 900px only. The rail script in the page draws six cards as it is parsed. About a second later it draws a new six once newer stories arrive, and hides the rest. By then the browser had already downloaded the first six photos. The layer keeps the rail card photos at display:none until the first of two things happens: the rail's second draw, or the rail coming within 1250px of the screen. After that, the shown cards load as before and the hidden cards are never fetched. The photo box keeps its size (aspect-ratio 4/5, ink background), so nothing moves. src and srcset are not touched.

**Fix 7. Paw Passport hero.** New core style src/site-layers/tll-paw-hero-img-v1.html. `.tll-paw-hero` takes Montenegro coast-p-1080.jpg on phones and -p-1600.jpg from 768px up, instead of the 1.18 MB original. It is in the head before the page is parsed, so the original is never requested.

Release: commit, then register the new core (src/site-layers/tll-site-layers-v16.js, sha384-NKwmv/EgAV30hlkqu2A/UgstoTBx9rW8B071bo6tDd1OYRxxHbiRO45yTSzBg6/k at build time) the usual way. No chunk changed. The Webflow proposal works with the live core and with this one, so the two can ship in either order.

## Webflow bytes per view (measured from the local cache, nothing refetched)

The before view is today's www HTML with today's core (16.63.0). The after view is the same HTML with this branch's core, plus the proposal on the home page. Bytes are summed over distinct Webflow-host responses per view: HTML, CSS, scripts and images. Full table: measurements.json.

| View | Before | After | Saved |
|---|---|---|---|
| Home, phone 390 at 3x, no scroll | 4.73 MB | 2.87 MB | 1.85 MB (39%) |
| Home, phone 390 at 3x, scrolled to the bottom | 6.62 MB | 4.64 MB | 1.98 MB |
| Home, phone 390 at 2x, no scroll | 3.74 MB | 2.87 MB | 0.87 MB (rail hold and Curacao only, same files picked) |
| Home, desktop 1440, no scroll or scrolled | 3.95 / 5.60 MB | 3.63 / 5.29 MB | 0.31 MB (Curacao) |
| /the-paw-passport, phone 390 at 3x | 2.62 MB | 1.62 MB | 1.00 MB |
| /the-paw-passport, desktop 1440 | 2.55 MB | 1.79 MB | 0.77 MB |
| Profile page with the most own stories, phone 390 at 3x, scrolled | 11.66 MB | 7.85 MB | 3.81 MB (photos 10.34 to 6.53 MB) |
| Same profile, phone 390 at 3x, no scroll | 3.81 MB | 3.22 MB | 0.58 MB |
| Same profile, phone 390 at 2x | 7.85 MB | 7.85 MB | 0 (unchanged, as intended) |
| /stories, phone 390 at 3x, no scroll (cached files only) | 3.78 MB | 3.26 MB | 0.52 MB; six cards 1080 to 800 |
| /stories at 2x and at 1440 | same | same | 0, identical file lists |

How the home phone saving splits, at 3x with no scroll: the layers alone save 1.54 MB, the proposal alone saves 0.31 MB, and both together save 1.85 MB.

The rail photos that load and then get hidden were never on screen. A browser sampled every 50 ms through a full page scroll and a full swipe of the rail row (vis-base.json, vis-after.json). Before: 5 hidden photos loaded, 0 of them ever on screen. After: 0 loaded, and all 6 shown cards still load when the row is swiped. The Curacao photo was never painted either: the img showed the cover photo at its first animation frame, and the only largest-paint entry was the cover photo.

## What it looks like (shots/, before on the left, after on the right)

| Crop | Sharpness before / after | Pixels off by more than 24 of 255 |
|---|---|---|
| Home cover, phone 390 at 3x | 5.43 / 5.41 | 0.0% (the dark cover shade hides the difference) |
| Home rail card, phone 390 at 3x | 24.55 / 17.85 | 11.9%, very slightly softer fine texture |
| Home cover, desktop 1440 | 20.01 / 20.01 | 0.0%, identical |
| Paw hero, phone 390 at 3x | 11.16 / 8.76 | 0.08% (under the dark shade) |
| Paw hero, desktop 1440 | 9.80 / 9.14 | 0.03% |
| Profile card, phone 390 at 3x | 25.24 / 17.13 | 3.2%, very slightly softer |

Sharpness is the mean absolute Laplacian. Full-page captures at CSS scale, kept in the scratchpad: home 390 differs in 0.12% of pixels, home 1440 and both Paw Passport pages in 0.0%. Layout is the same: equal page heights, and no side scroll. At 1x and 2x nothing changes. The file lists picked at 2x and at 1440 are identical, apart from the photos that are no longer downloaded at all.

## Method and budget

- Documents: the single plain-GET snapshots already on disk (scratchpad nov13/fontrel/www/raw, plus nov13/fontrel/check/carry/raw/www for the profile page). No HTML was fetched.
- Webflow files: served from nov13/fontrel/check/cache, plus one fetch-once cache of my own. Files missing from both were fetched once each: 114 files, 17.1 MB, mostly the 800px and 1080px card copies and the Paw originals.
- Every measured run was cache only: 0 blocked and 0 fetched, except on /stories, where uncached files were blocked in both runs. Every non-GET was aborted.
- Math.random was seeded, so the rail order and the rotating word are the same in each run.
- Scripts: harness/. They ran from the scratchpad (nov13/next/bwimg).

Rollback: revert this branch's commit and rebuild the core. For the proposal, set the image back to Eager and add fetchpriority=high again.
