# Fix A3: the page-parsed rewrites laid out before the first paint (14 Nov 2026)

Author report. Branch claude/fix-story-first-frame-a3-2026-11-14, made from claude/fix-story-first-frame-a2-2026-11-14 (73ab244) and pushed. Head 39f4b67 (39f4b67c64d66fa1605a23d81429f041434457de). Not merged into the session branch. Nothing was published and layers-release was not touched.

- Core SRI at head: sha384-T61+wAVXYVn8ZgDKiEEj+0QbcnVYW1kXtwpJdmfnaPUlUAjqGHmfbq7Y8U80aqnm
- A rebuild at head changes no bytes. No chunk changed (the diff against 73ab244 is the build script, the core and the story test).
- Core size: 256,759 bytes, 77.6 KB gzip (A2: 250,582 bytes, 75.3 KB gzip). Most of the growth is comments, as in A2.
- Tests: 57 files, 590 tests pass (A2 had 579).

## What caused the three shifts

The template script (tll-st3-story-js-v1) and the site flag script (tllflagsv53, a Webflow page script) both rewrite the story head at DOMContentLoaded. With A2 the head is already painted in the magazine layout by then, so their changes moved painted content:

1. Balkans, 320 to 375 px: the flag script puts four 22 px flags and "+8 countries" in front of the country crumb. The crumb wraps to a second row (breadcrumb 44 to 73 px) and the headline, byline, Receipts line and photo move down 29 px.
2. Croatia, 390 px: the template turns the country crumb into a link, and the magazine style makes crumb links 44 px tall (breadcrumb +26 px). The place-and-date line was clamped to one line by A2's hold and became two lines when the hold ended (+12 px).
3. Southern Africa, 344 to 412 px: both at once (link box and four flags), 38 px.

Two smaller shifts before DOMContentLoaded came from the template's tll-st3-r1-v1 style, which arrives in the body after the first paint: it hides the first place pill of the meta row and the arrow in front of the hidden title crumb (0.01 to 0.02 on Croatia and Southern Africa).

## The fix (all in the story layer of the core, src/site-layers/build-site-layers-v16.py)

A new piece, PF, runs right after the early run (so the stamp has already read the full date):

- **Place-and-date line:** the template's own words go in at once ({place} from the byline location, {Month Year}). The template writes the same words again, so nothing moves. The one-line clamp of A2 is gone. If the template's handler never writes its words (the script threw), the old words come back after it, so the finished page is what it would have been.
- **Country link box:** when the template will turn the crumb into a link (the same test the template uses), data-tll-mg-wait-d on the hero gives the crumb the link's box (inline-flex, centered, 44 px) until the template's handler has run. The template copies the crumb's attributes to the link, so the hold sits on the hero, not the crumb.
- **Flags:** when the flag script will draw flags, an empty stand-in of the same size goes in front of the crumb text: a span with the flag script's own inline style, empty 22 px boxes, and the "+N countries" count as generated text. It has no text of its own, so neither page script reads it. A watcher on the breadcrumb takes it out in the same step as the real flags arrive; when the template swaps the crumb for its link, the stand-in goes with the old crumb.
- The country reading copies the flag script's own (its alias list is read from src/site-layers/tllflagsv53.js at build time; the build checks that the flag script and the template script still contain the code PF mirrors and stops if either changed).
- The Intl region table is built only when a place is not on the flag script's alias list (Balkans needs none).
- Two rules from tll-st3-r1-v1 join the early style, keyed like the other copies; the template's own rule wins every tie once it arrives.

Every hold clears by DOMContentLoaded or on failure:
- wait-d clears after the template's handler, or at DOMContentLoaded if the template script never came.
- The stand-in goes at DOMContentLoaded if there is no flag script on the page, else in the first task after it.
- When the core runs after parsing (JS late), none of this runs.
- Nothing new is hidden, so slow 4G shows no content later than A2.

## Lab check (my own, quick)

Method: the regression check's harness (h.cjs) copied to scratchpad nov14/a3lab as h3.cjs, with the same caches and routing plus the behavior check's caches. www HTML (plain-GET copies from the checks) served at the www address. The core tag was swapped in the routed HTML: W is the 16.64.0 core (integrity kept), A2 the 16.65.0 core and A3 this build (integrity attribute removed for both). Fresh context per load, cores interleaved each round. Unthrottled, and slow 4G (150 ms per request, 1.6 Mbit/s, CPU 4x). CLS is the sum of every layout-shift entry.

| case | core | loads | CLS median | CLS max | loads > 0.1 | FCP median ms |
|---|---|---|---|---|---|---|
| Balkans 320 | W | 4 | 0.1256 | 0.1265 | 4 | 180 |
| | A2 | 4 | 0.1343 | 0.1367 | 4 | 178 |
| | A3 | 4 | 0.0023 | 0.0023 | 0 | 176 |
| Balkans 360 | W | 4 | 0.0176 | 0.0178 | 0 | 182 |
| | A2 | 4 | 0.1515 | 0.1515 | 4 | 178 |
| | A3 | 4 | 0.0195 | 0.0195 | 0 | 178 |
| Balkans 375 | W | 4 | 0.0164 | 0.0170 | 0 | 166 |
| | A2 | 4 | 0.1502 | 0.1534 | 4 | 168 |
| | A3 | 4 | 0.0213 | 0.0213 | 0 | 164 |
| Croatia 390 | W | 4 | 0.0835 | 0.1311 | 1 | 174 |
| | A2 | 4 | 0.0577 | 0.0639 | 0 | 180 |
| | A3 | 4 | 0.0066 | 0.0066 | 0 | 158 |
| Southern Africa 360 | W | 4 | 0.0668 | 0.0671 | 0 | 174 |
| | A2 | 4 | 0.0585 | 0.0585 | 0 | 170 |
| | A3 | 4 | 0.0144 | 0.0153 | 0 | 162 |
| Southern Africa 390 | W | 4 | 0.0574 | 0.0626 | 0 | 174 |
| | A2 | 4 | 0.0654 | 0.0725 | 0 | 178 |
| | A3 | 4 | 0.0120 | 0.0120 | 0 | 174 |
| Madrid 390 | W | 4 | 0.0683 | 0.3861 | 1 | 158 |
| | A2 | 4 | 0.0039 | 0.0081 | 0 | 184 |
| | A3 | 4 | 0.0039 | 0.0039 | 0 | 156 |
| Balkans 360, slow 4G | W | 4 | 0.0340 | 0.0340 | 0 | 6496 |
| | A2 | 4 | 0.1498 | 0.1498 | 4 | 6592 |
| | A3 | 4 | 0.0195 | 0.0195 | 0 | 6622 |
| Croatia 390, slow 4G | W | 4 | 0.1401 | 0.1401 | 3 | 6590 |
| | A2 | 4 | 0.0740 | 0.0743 | 0 | 6668 |
| | A3 | 4 | 0.0063 | 0.0063 | 0 | 6742 |

- What is left on A3 at these widths is the nav's own 0.004 at DOMContentLoaded (not touched), the headline growing when its web font arrives on Balkans (also on www), and on Southern Africa the route strip under the photo moving when the Receipts line goes in (0.008).
- Finished page: in every unthrottled case all A3 loads ended with the same layout hash as W. No hold, stand-in or early style was left in any load. 0 page errors.
- One slow-4G Croatia load on A3 (and one A2 load in an earlier batch) ended with the reader notes and the write-for-us ask in the other order. This is the race at the foot of the story noted in the 16.65.0 regression check (item 13), not the head.

Failure cases (1 load each, W against A3, Balkans or Southern Africa at 360): the finished page matched W in all four, nothing was left on.

| case | W CLS | A3 CLS |
|---|---|---|
| template script throws at its top | 0.067 | 0.096 (the old words come back and the link box goes) |
| flag script missing (404) | 0.020 | 0.138 (the stand-in goes after DOMContentLoaded) |
| flag script throws | 0.061 | 0.014 |
| hero photo aborted | 0.017 | 0.019 |

Bandwidth: 0 bytes from Webflow or jsDelivr (0 cache misses, flag images from the cache), all non-GETs aborted, 412 lab loads in all. Scratch data about 3 MB in scratchpad nov14/a3lab.

## Worth knowing

1. **Slow 4G FCP:** A3 is about 30 ms later than A2 on Balkans and about 75 ms later on Croatia (4 loads each, CPU 4x). On Croatia most of it is the Intl region table, which the flag script builds anyway, but later. Building it in idle time while the head loads was tried and measured no better. A static table in the core would save about 45 ms there but adds about 2 KB gzip to every page and could differ from a browser's own names; not done. Unthrottled, FCP is the same as A2.
2. **The failure cases are worse than www** when the template script throws or the flag script is missing, because the reservation is let go after the first paint. They are still under or near 0.14 and the finished page is unchanged.
3. **PF mirrors two page scripts.** If the template script or tllflagsv53 changes in Webflow, the repo copies (src/pages/story/after-2026-10-20/embed-3074c26c-after.html, src/site-layers/tllflagsv53.js) should be refreshed and the build rerun; the build stops if the mirrored code is no longer in those copies. A mismatch only costs a small shift; the page scripts still own the finished page.
4. **US state flags:** tll-story-fixes-1029 adds a US flag at 1.4 s for crumbs like "New Orleans, Louisiana". That is not reserved; no saved story at these widths was checked for it.
5. The stand-in shows its count in the crumb's font; the flag images themselves arrive later, as before.
