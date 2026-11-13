# Story hero photo jump: the box is reserved before the photo arrives

13 November 2026. Branch claude/fix-story-hero-2026-11-13. Nothing in Webflow was changed and nothing was published. This needs no Webflow change, so there is no webflow-proposal.json: the fix ships with the next layers core release.

## What was wrong

Found on 12 November (reports/evidence/fonts-2026-11-12/CHANGES.md, "Found on the way" 1). The story hero `<img class="tll-story-hero-img">` has no width or height in the template, and the story layer (src/design/magazine-2026-10/story-build/tll-mag-story-v1.html) gives it `height:auto; aspect-ratio:auto`. Until the photo's size is known, its box is only the alt text line (about 28 px), so everything under it moves down when the photo lands. On 12 November that was one shift of 0.4 to 1.2 on about half of all story loads.

## The fix (story layer only)

1. The rule keeps the photo's own ratio first and adds a default for the moment before it is known:
   `.tll-story-hero-img{... aspect-ratio:auto var(--tll-hero-r,16/9) ...}`. With `auto` first, the browser uses the photo's real ratio as soon as it knows it, so the finished page is the same as today to the pixel (checked below). Width, height, max-height, fit and corners are unchanged.
2. The story layer script sets `--tll-hero-r` on the hero img (the only change it makes to the photo) from a table of each hero's own width and height, keyed by the last 8 hex digits of its CMS file id. The table holds all 57 story heroes on the site today. A hero that is not in the table yet (a new story) gets the 16/9 default, the shape of 42 of the 57.
3. The table is written by a new tool, src/site-layers/build-hero-ratios-v1.py, from saved story pages. It reads each photo's size from its header (EXIF orientation applied), keeps the sizes in src/site-layers/story-hero-sizes-v1.json and rewrites the `/*HERO*/` table in the story layer. A photo already in the JSON costs nothing; a new one costs one ranged GET of its first 16 KB. Run it after new stories go live, then rebuild the layers.
4. Eager loading and high fetch priority: already in place. The template sends `loading="lazy" fetchpriority="high"`, and the core's tll-img-variants-v1 switches the hero to `loading="eager"` as the parser adds it (checked in every run: eager and high at DOMContentLoaded, the photo request starts at parse time). Setting Eager in the Designer instead is not advised: tll-img-variants-v1 adds the phone-sized srcset only to a lazy hero, so an eager template hero would download the full original on phones, more bytes for no visible gain.

Rebuilt with python3 src/site-layers/build-site-layers-v16.py: only the core changes (the story section); all 24 chunks are byte identical to the live 16.63.0 chunks. Tests: 513 pass (504 before, plus 9 in test/story-hero-box-layer.test.js).

## Measured before and after

Method: Playwright Chromium, a buffered layout-shift observer, every shift summed over 7 s after DOMContentLoaded. Phones as mobile at DPR 3. Restored = load, scroll to 1,233 px, reload. Pages are the 13 November plain-GET snapshots of the live pages (byte equal to www); before is the live core 16.63.0, after is this build. Three runs per cell, before and after interleaved. "Photo held" holds only the hero photo for 1.5 s, the slow-photo case that jumped; "photo at once" serves it immediately from the local cache.

| Story (hero shape) | Case | Photo held: before | after | Shift at photo arrival | Photo at once: before | after |
|---|---|---|---|---|---|---|
| Spain (3:4) | 390x844 fresh | 0.634 | 0.039 | 0.288 to 0.000 | 0.039 | 0.040 |
| Spain (3:4) | 360x800 fresh | 0.591 | 0.042 | 0.264 to 0.000 | 0.062 | 0.043 |
| Spain (3:4) | 1440x900 fresh | 0.430 | 0.010 | 0.251 to 0.000 | 0.013 | 0.015 |
| Spain (3:4) | 390x844 restored | 1.160 | 0.187 | 0.566 to 0.000 | 0.187 | 0.187 |
| Spain (3:4) | 360x800 restored | 1.132 | 0.189 | 0.547 to 0.000 | 0.189 | 0.189 |
| Spain (3:4) | 1440x900 restored | 1.279 | 0.403 | 0.531 to 0.000 | 0.829 | 0.829 |
| Pantanal (16:9) | 390x844 fresh | 0.430 | 0.121 | 0.111 to 0.000 | 0.120 | 0.120 |
| Pantanal (16:9) | 360x800 fresh | 0.354 | 0.045 | 0.090 to 0.000 | 0.044 | 0.044 |
| Pantanal (16:9) | 1440x900 fresh | 0.309 | 0.012 | 0.184 to 0.000 | 0.014 | 0.009 |
| Pantanal (16:9) | 390x844 restored | 0.860 | 0.382 | 0.239 to 0.000 | 0.357 | 0.357 |
| Pantanal (16:9) | 360x800 restored | 0.851 | 0.390 | 0.231 to 0.000 | 0.416 | 0.416 |
| Pantanal (16:9) | 1440x900 restored | 0.831 | 0.386 | 0.469 to 0.000 | 0.386 | 0.386 |
| Sort sol (16:9) | 390x844 fresh | 0.410 | 0.086 | 0.101 to 0.000 | 0.121 | 0.086 |
| Sort sol (16:9) | 360x800 fresh | 0.343 | 0.026 | 0.090 to 0.000 | 0.026 | 0.026 |
| Sort sol (16:9) | 1440x900 fresh | 0.228 | 0.014 | 0.146 to 0.000 | 0.011 | 0.012 |
| Sort sol (16:9) | 390x844 restored | 0.792 | 0.315 | 0.239 to 0.000 | 0.315 | 0.315 |
| Sort sol (16:9) | 360x800 restored | 0.827 | 0.366 | 0.231 to 0.000 | 0.366 | 0.366 |
| Sort sol (16:9) | 1440x900 restored | 0.797 | 0.396 | 0.469 to 0.000 | 0.396 | 0.396 |

Medians of 3 runs. "Shift at photo arrival" is the largest shift landing within 250 ms after the photo arrived, before and after.

Pooled over the 54 loads of each kind:
- Photo held: median 0.720 to 0.154, mean 0.672 to 0.196, max 1.279 to 0.829. The shift when the photo lands was there in 54 of 54 loads before (up to 0.566) and in 0 of 54 after.
- Photo at once: median 0.170 and 0.155, mean 0.206 and 0.204, no change, as expected (the photo is there before the story style is). So with the fix a slow photo costs nothing extra.

A hero the table does not know yet (empty table, 16/9 default, photo held): Spain, a portrait photo, at 390 is 0.089 and 0.233 (0.634 today, 0.039 with its table entry), at 1440 0.008; Pantanal, 16:9, is the same as with its entry (0.121 at 390, 0.010 at 1440).

## The finished look is the same

After the photo, fonts and page have settled, the first screen and the full page were captured at 390, 360 and 1440 for all three stories, before and after. Spain and Sort sol: identical to the pixel at all three widths, top screen and full page; hero, figure, caption and story body boxes equal (for example Spain at 390: photo 358 x 477.33 at y 394.34 both ways; Sort sol at 1440: 1200 x 675). Pantanal: hero, figure and caption boxes equal at every width, but the page itself loads in two states with the unchanged build (a second load of today's core differs from the first in the same way: the breadcrumb arrow shade, the From line 3 px lower, page height 11 to 33 px). The fixed build matched one of those loads to the pixel at every width (390 the first, 360 and 1440 the second).

## What remains (not this fix)

Restored reloads still shift 0.19 to 0.83, the same before and after with the photo at once. That shift lands at DOMContentLoaded, when the story layer's style is placed: first paint usually comes before it, so the page is painted once in the template's own head layout (dark hero, at least 88vh tall) and then restyled. Fixing it means applying the story style from the first paint, as the cover layer does (its F1 step), which moves the cascade order and the byline move. That is a separate, larger change and should be reviewed on its own.

## Bandwidth

Browser loads: 266 (216 in the matrix, 15 probes, 27 for screenshots, 8 for the default check). Webflow bytes in browsers: 0. Every Webflow file came from the existing local cache (nov13/fontrel/check/cache); 11 inline photos further down the Pantanal and Sort sol pages were not in it and were aborted, never fetched. HTML: no new GETs (the 13 November snapshots). Hero sizes: 2 from the cache and 55 header reads of 16 KB each, 0.90 MB, once. Total Webflow bytes for this task: 0.90 MB.

## Files

- src/design/magazine-2026-10/story-build/tll-mag-story-v1.html: the rule and the table lookup (source).
- src/site-layers/tll-site-layers-v16.js: rebuilt core.
- src/site-layers/build-hero-ratios-v1.py, src/site-layers/story-hero-sizes-v1.json: the size tool and its data.
- test/story-hero-box-layer.test.js: 9 tests.
- reports/evidence/story-hero-2026-11-13/shift-before-after.json: every cell, the screenshot comparison and the byte counts.
- Scratch (not in the repo): nov13/next/story-hero (harness h/, raw runs out/, screenshots shots/ and shots2/).

## Release

Commit, push to layers-release as usual, register tllsitelayersv16 at the new commit with its SRI (this build: sha384-NWcPKwsZWXWPjFAyu3P54S4zVlq6305XwpALt4TqzZQCFEiAYph1H1c/1bzyXm0G; the measured build differs from it only in one number inside a comment), check on the test site, then www. Rollback: 16.63.0, pin 1f2e549aee8627b2f67211463f764380f751c17b, sha384-H+oSdrkcwOOlCvbyOd9Xm+EvqvWHK8Z0lJRpRfsE//z/ZWm7d2GXDxMktP77zztd.
