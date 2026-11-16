# Layout shift survey, live www (core 16.66.0), non-story pages: per cell

CLS counts every layout-shift entry (see notes.md on the input flag). 5 loads per cell, Math.random seeded. Ranked worst first. Phase: parsing (before DOMContentLoaded), after DCL (before load), after load.

## Live

| rank | cell | CLS median | CLS max | loads > 0.1 | median without input-flagged entries | FCP median ms | LCP median ms | DCL median ms | shifts over 0.005 (phase, node, loads, median value) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | /account 1440 | 0.3007 | 0.3007 | 4 of 5 | 0.3007 | 112 | 148 | 161 | after DCL, div.tll-account-wrap > div.a3-grid, 4 of 5, 0.2972 |
| 2 | /submit 390 | 0.1437 | 0.1439 | 5 of 5 | 0.0000 | 132 | 132 | 149 | after DCL, main#main, 5 of 5, 0.1436 |
| 3 | /the-map 390 | 0.1396 | 0.1396 | 5 of 5 | 0.0000 | 152 | 240 | 203 | after DCL, main#main > div.w-embed.w-script, 5 of 5, 0.1390 |
| 4 | /contributors/<profile> 1440 | 0.1178 | 0.1178 | 5 of 5 | 0.1178 | 148 | 212 | 198 | after DCL, div > div, 5 of 5, 0.1170 |
| 5 | /travelers 390 | 0.1134 | 0.1239 | 5 of 5 | 0.0128 | 140 | 140 | 206 | after DCL, main#main > section.tll-trav-section, 5 of 5, 0.0938; after load, main#main > section.tll-trav-section, 5 of 5, 0.0128; after DCL, section.tll-trav-section > div.tll-container, 1 of 5, 0.0130 |
| 6 | /the-map 1440 | 0.1083 | 0.3577 | 3 of 5 | 0.1083 | 172 | 256 | 209 | after DCL, main#main > div.w-embed.w-script, 5 of 5, 0.0232; after load, main#main > div.w-embed.w-script, 5 of 5, 0.0667; parsing, main > section.tll-section.tll-bg-bone, 1 of 5, 0.2580 |
| 7 | /travelers 1440 | 0.0912 | 0.1603 | 2 of 5 | 0.0912 | 152 | 152 | 161 | after DCL, main#main > section.tll-trav-section, 5 of 5, 0.0816; after DCL, (text), 1 of 5, 0.0714; parsing, div.w-dyn-item > a.tv-card.w-inline-block, 1 of 5, 0.0545 |
| 8 | /for-expats 390 | 0.0773 | 0.0878 | 0 of 5 | 0.0000 | 152 | 168 | 206 | after DCL, main#main.inline-main-0 > section, 5 of 5, 0.0772; parsing, main.inline-main-0 > section, 1 of 5, 0.0106 |
| 9 | /contributors/<profile> 390 | 0.0763 | 0.0763 | 0 of 5 | 0.0000 | 144 | 200 | 196 | after DCL, div > div#tll-main, 4 of 5, 0.0762 |
| 10 | /submit 1440 | 0.0552 | 0.0552 | 0 of 5 | 0.0552 | 124 | 124 | 131 | after DCL, main#main, 4 of 5, 0.0551 |
| 11 | /stories 1440 | 0.0495 | 0.1114 | 1 of 5 | 0.0495 | 216 | 216 | 399 | parsing, main.tll-stories-index > section.tll-library-grid-section, 5 of 5, 0.0138; after DCL, div.tll-container.tll-filters-inner > div.tll-chip-rows, 4 of 5, 0.0184; after DCL, (text), 3 of 5, 0.0161 |
| 12 | /for-expats 1440 | 0.0391 | 0.0415 | 0 of 5 | 0.0391 | 172 | 200 | 212 | after DCL, main#main.inline-main-0 > section.inline-section-0-1.tll-ph-split, 5 of 5, 0.0390 |
| 13 | /about 1440 | 0.0365 | 0.0615 | 0 of 5 | 0.0365 | 148 | 148 | 147 | after DCL, article#tll-about-final.tll-about-final > div.tll-about-final-body, 4 of 5, 0.0470 |
| 14 | /stories 390 | 0.0284 | 0.0284 | 0 of 5 | 0.0002 | 188 | 548 | 366 | after DCL, div.tll-container.tll-filters-inner > div.tll-chip-rows, 5 of 5, 0.0162; after DCL, (text), 5 of 5, 0.0093 |
| 15 | /about 390 | 0.0245 | 0.0439 | 0 of 5 | 0.0000 | 140 | 140 | 160 | after DCL, div.tll-nav-inner > div.tll-nav-cta-row, 4 of 5, 0.0243; after DCL, (text), 1 of 5, 0.0439 |
| 16 | /the-paw-passport 390 | 0.0220 | 0.0558 | 0 of 5 | 0.0000 | 156 | 220 | 186 | after DCL, main#main.inline-main-0 > section.tll-paw-steps, 3 of 5, 0.0188 |
| 17 | /layovers 390 | 0.0178 | 0.0390 | 0 of 5 | 0.0000 | 136 | 136 | 147 | after DCL, main#main.inline-main-0-1 > section.tllcx-body, 3 of 5, 0.0145; parsing, main.inline-main-0-1 > section.tllcx-body, 1 of 5, 0.0146 |
| 18 | /layovers 1440 | 0.0147 | 0.0191 | 0 of 5 | 0.0147 | 156 | 156 | 174 | after DCL, main#main.inline-main-0-1 > section.tllcx-body, 3 of 5, 0.0169; parsing, main.inline-main-0-1 > section.tllcx-body, 1 of 5, 0.0147 |
| 19 | /account 390 | 0.0119 | 0.0119 | 0 of 5 | 0.0000 | 132 | 400 | 169 | after load, div.tll-nav-inner > div.tll-nav-cta-row, 5 of 5, 0.0119 |
| 20 | /login 390 | 0.0117 | 0.0636 | 0 of 5 | 0.0000 | 128 | 128 | 144 | after DCL, div.tll-auth-split > div.tll-auth-form-col, 2 of 5, 0.0476; after DCL, form > input.tll-btn.tll-btn-primary, 2 of 5, 0.0062; parsing, form > input.tll-btn.tll-btn-primary, 2 of 5, 0.0057 |
| 21 | /the-paw-passport 1440 | 0.0080 | 0.0080 | 0 of 5 | 0.0080 | 148 | 232 | 162 | after DCL, main#main.inline-main-0 > section.tll-paw-steps, 3 of 5, 0.0080 |
| 22 | /signup 390 | 0.0036 | 0.0579 | 0 of 5 | 0.0000 | 124 | 124 | 148 | after DCL, div.tll-auth-split > div.tll-auth-form-col, 1 of 5, 0.0576 |
| 23 | /cookies 390 | 0.0034 | 0.0038 | 0 of 5 | 0.0000 | 124 | 124 | 134 | - |
| 24 | / 390 | 0.0034 | 0.0034 | 0 of 5 | 0.0000 | 204 | 204 | 377 | - |
| 25 | /login 1440 | 0.0023 | 0.0036 | 0 of 5 | 0.0023 | 136 | 136 | 140 | - |
| 26 | /signup 1440 | 0.0016 | 0.0022 | 0 of 5 | 0.0016 | 148 | 148 | 166 | - |
| 27 | / 1440 | 0.0005 | 0.0005 | 0 of 5 | 0.0005 | 216 | 216 | 362 | - |
| 28 | /cookies 1440 | 0.0001 | 0.0007 | 0 of 5 | 0.0001 | 120 | 120 | 123 | - |

## Bisect and diagnostic variants (median and max; compare with the live median; local-core variants compare best with the local core control, which changes paint timing on /travelers and /the-map at 1440)


| cell | variant | n | CLS median | CLS max | live median |
|---|---|---|---|---|---|
| /about 390 | core without page-heroes + site head mobile nav off | 3 | 0.0002 | 0.0003 | 0.0245 |
| /about 390 | core without page-heroes | 3 | 0.0036 | 0.0082 | 0.0245 |
| /about 390 | CPU 4x slower + core without page-heroes | 2 | 0.0036 | 0.0036 | 0.0245 |
| /about 390 | site head mobile nav off | 3 | 0.0108 | 0.0109 | 0.0245 |
| /about 390 | web fonts blocked | 3 | 0.0243 | 0.0243 | 0.0245 |
| /about 390 | CPU 4x slower | 3 | 0.0245 | 0.0245 | 0.0245 |
| /about 390 | CPU 4x slower + local core, no SRI (control) | 2 | 0.0245 | 0.0245 | 0.0245 |
| /about 390 | core without ux-1028 nav signup size | 3 | 0.0246 | 0.0246 | 0.0245 |
| /about 390 | Memberstack blocked | 2 | 0.0350 | 0.0457 | 0.0245 |
| /about 390 | body styles moved to head | 3 | 0.0440 | 0.0457 | 0.0245 |
| /about 390 | webflow.js, jQuery, GSAP blocked | 2 | 0.0457 | 0.0457 | 0.0245 |
| /about 390 | core blocked | 3 | 0.0931 | 0.1007 | 0.0245 |
| /about 1440 | core without page-heroes | 3 | 0.0005 | 0.0006 | 0.0365 |
| /about 1440 | core without page-heroes + site head mobile nav off | 3 | 0.0006 | 0.0007 | 0.0365 |
| /about 1440 | core blocked | 3 | 0.0056 | 0.0058 | 0.0365 |
| /about 1440 | webflow.js, jQuery, GSAP blocked | 2 | 0.0313 | 0.0615 | 0.0365 |
| /about 1440 | web fonts blocked | 3 | 0.0358 | 0.0358 | 0.0365 |
| /about 1440 | core without ux-1028 nav signup size | 3 | 0.0364 | 0.0567 | 0.0365 |
| /about 1440 | body styles moved to head | 3 | 0.0365 | 0.0608 | 0.0365 |
| /about 1440 | site head mobile nav off | 3 | 0.0366 | 0.0608 | 0.0365 |
| /about 1440 | Memberstack blocked | 2 | 0.0611 | 0.0615 | 0.0365 |
| /about 1440 | site head wordmark off | 3 | 0.0615 | 0.0615 | 0.0365 |
| /account 390 | site head navOut off | 3 | 0.0000 | 0.0000 | 0.0119 |
| /account 390 | Memberstack blocked | 3 | 0.0000 | 0.0000 | 0.0119 |
| /account 390 | CPU 4x slower | 3 | 0.0119 | 0.0119 | 0.0119 |
| /account 390 | core blocked | 3 | 0.0176 | 0.0176 | 0.0119 |
| /account 1440 | site head navOut off | 3 | 0.0170 | 0.0170 | 0.3007 |
| /account 1440 | Memberstack blocked | 3 | 0.2982 | 0.2982 | 0.3007 |
| /account 1440 | core blocked | 3 | 0.3040 | 0.3040 | 0.3007 |
| /cookies 390 | CPU 4x slower | 3 | 0.0034 | 0.0034 | 0.0034 |
| /for-expats 390 | core without page-heroes + site head mobile nav off | 3 | 0.0000 | 0.0106 | 0.0773 |
| /for-expats 390 | core without page-heroes | 3 | 0.0034 | 0.0034 | 0.0773 |
| /for-expats 390 | CPU 4x slower + core without page-heroes | 2 | 0.0139 | 0.0139 | 0.0773 |
| /for-expats 390 | site head mobile nav off | 3 | 0.0604 | 0.0708 | 0.0773 |
| /for-expats 390 | core without ux-1028 nav signup size | 3 | 0.0772 | 0.0877 | 0.0773 |
| /for-expats 390 | site head wordmark off | 3 | 0.0772 | 0.0878 | 0.0773 |
| /for-expats 390 | Memberstack blocked | 2 | 0.0824 | 0.0877 | 0.0773 |
| /for-expats 390 | body styles moved to head | 3 | 0.0878 | 0.0878 | 0.0773 |
| /for-expats 390 | Webflow-hosted custom scripts blocked | 3 | 0.0878 | 0.0878 | 0.0773 |
| /for-expats 390 | CPU 4x slower | 3 | 0.0878 | 0.0878 | 0.0773 |
| /for-expats 390 | CPU 4x slower + local core, no SRI (control) | 2 | 0.0878 | 0.0878 | 0.0773 |
| /for-expats 390 | web fonts blocked | 3 | 0.0894 | 0.0894 | 0.0773 |
| /for-expats 390 | core blocked | 3 | 0.0931 | 0.0931 | 0.0773 |
| /for-expats 390 | webflow.js, jQuery, GSAP blocked | 2 | 0.0989 | 0.0989 | 0.0773 |
| /for-expats 1440 | core without page-heroes | 3 | 0.0001 | 0.0001 | 0.0391 |
| /for-expats 1440 | core without page-heroes + site head mobile nav off | 3 | 0.0001 | 0.0026 | 0.0391 |
| /for-expats 1440 | core blocked | 3 | 0.0123 | 0.0968 | 0.0391 |
| /for-expats 1440 | web fonts blocked | 3 | 0.0390 | 0.0390 | 0.0391 |
| /for-expats 1440 | core without ux-1028 nav signup size | 3 | 0.0391 | 0.0391 | 0.0391 |
| /for-expats 1440 | Webflow-hosted custom scripts blocked | 3 | 0.0391 | 0.0391 | 0.0391 |
| /for-expats 1440 | site head mobile nav off | 3 | 0.0391 | 0.0391 | 0.0391 |
| /for-expats 1440 | site head wordmark off | 3 | 0.0391 | 0.0391 | 0.0391 |
| /for-expats 1440 | webflow.js, jQuery, GSAP blocked | 2 | 0.0400 | 0.0400 | 0.0391 |
| /for-expats 1440 | Memberstack blocked | 2 | 0.0403 | 0.0416 | 0.0391 |
| /for-expats 1440 | body styles moved to head | 3 | 0.0416 | 0.0416 | 0.0391 |
| / 390 | web fonts blocked | 2 | 0.0034 | 0.0034 | 0.0034 |
| / 390 | CPU 4x slower | 3 | 0.0034 | 0.0034 | 0.0034 |
| / 390 | core blocked | 2 | 0.1546 | 0.1546 | 0.0034 |
| /layovers 390 | web fonts blocked | 3 | 0.0034 | 0.0034 | 0.0178 |
| /layovers 390 | site head mobile nav off | 3 | 0.0146 | 0.0146 | 0.0178 |
| /layovers 390 | site head wordmark off | 3 | 0.0180 | 0.0180 | 0.0178 |
| /layovers 390 | CPU 4x slower | 3 | 0.0180 | 0.0180 | 0.0178 |
| /layovers 390 | core without ux-1028 nav signup size | 3 | 0.0383 | 0.0385 | 0.0178 |
| /layovers 390 | body styles moved to head | 3 | 0.0390 | 0.0390 | 0.0178 |
| /layovers 390 | core blocked | 3 | 0.0947 | 0.1096 | 0.0178 |
| /layovers 1440 | web fonts blocked | 3 | 0.0000 | 0.0000 | 0.0147 |
| /layovers 1440 | core without ux-1028 nav signup size | 3 | 0.0014 | 0.0014 | 0.0147 |
| /layovers 1440 | site head mobile nav off | 3 | 0.0014 | 0.0146 | 0.0147 |
| /layovers 1440 | site head wordmark off | 3 | 0.0014 | 0.0146 | 0.0147 |
| /layovers 1440 | core blocked | 3 | 0.0022 | 0.0179 | 0.0147 |
| /layovers 1440 | body styles moved to head | 3 | 0.0146 | 0.0146 | 0.0147 |
| /login 390 | site head mobile nav off | 3 | 0.0057 | 0.0144 | 0.0117 |
| /login 390 | Webflow-hosted custom scripts blocked | 3 | 0.0091 | 0.0631 | 0.0117 |
| /login 390 | web fonts blocked | 2 | 0.0104 | 0.0115 | 0.0117 |
| /login 390 | CPU 4x slower | 3 | 0.0192 | 0.0192 | 0.0117 |
| /login 390 | core without ux-1028 nav signup size | 2 | 0.0363 | 0.0636 | 0.0117 |
| /login 390 | Memberstack blocked | 3 | 0.0418 | 0.0636 | 0.0117 |
| /login 390 | webflow.js, jQuery, GSAP blocked | 3 | 0.0576 | 0.0638 | 0.0117 |
| /login 390 | core blocked | 2 | 0.1156 | 0.1239 | 0.0117 |
| /login 1440 | web fonts blocked | 2 | 0.0016 | 0.0016 | 0.0023 |
| /login 1440 | core without ux-1028 nav signup size | 2 | 0.0021 | 0.0023 | 0.0023 |
| /login 1440 | site head mobile nav off | 3 | 0.0024 | 0.0036 | 0.0023 |
| /login 1440 | site head wordmark off | 3 | 0.0025 | 0.0039 | 0.0023 |
| /login 1440 | core blocked | 2 | 0.0041 | 0.0044 | 0.0023 |
| /the-map 390 | core without page-heroes | 3 | 0.1107 | 0.1392 | 0.1396 |
| /the-map 390 | site head mobile nav off | 3 | 0.1242 | 0.1242 | 0.1396 |
| /the-map 390 | core without page-heroes + site head mobile nav off | 3 | 0.1335 | 0.1340 | 0.1396 |
| /the-map 390 | body styles moved to head | 3 | 0.1390 | 0.1390 | 0.1396 |
| /the-map 390 | web fonts blocked | 3 | 0.1390 | 0.1860 | 0.1396 |
| /the-map 390 | CPU 4x slower + body styles moved to head | 2 | 0.1390 | 0.1390 | 0.1396 |
| /the-map 390 | core without ux-1028 nav signup size | 3 | 0.1396 | 0.1630 | 0.1396 |
| /the-map 390 | Webflow-hosted custom scripts blocked | 3 | 0.1396 | 0.1396 | 0.1396 |
| /the-map 390 | Memberstack blocked | 2 | 0.1396 | 0.1396 | 0.1396 |
| /the-map 390 | hasTouch off | 3 | 0.1464 | 0.1464 | 0.1396 |
| /the-map 390 | CPU 4x slower + local core, no SRI (control) | 2 | 0.1630 | 0.1630 | 0.1396 |
| /the-map 390 | webflow.js, jQuery, GSAP blocked | 2 | 0.1643 | 0.1875 | 0.1396 |
| /the-map 390 | CPU 4x slower + core without page-heroes | 2 | 0.1649 | 0.1707 | 0.1396 |
| /the-map 390 | isMobile off | 3 | 0.1860 | 0.1860 | 0.1396 |
| /the-map 390 | CPU 4x slower | 3 | 0.1866 | 0.2058 | 0.1396 |
| /the-map 390 | core blocked | 3 | 0.2359 | 0.2581 | 0.1396 |
| /the-map 1440 | core without ux-1028 nav signup size | 3 | 0.0929 | 0.0988 | 0.1083 |
| /the-map 1440 | body styles moved to head | 3 | 0.0935 | 0.0935 | 0.1083 |
| /the-map 1440 | core without page-heroes | 3 | 0.0951 | 0.0980 | 0.1083 |
| /the-map 1440 | core without page-heroes + site head mobile nav off | 3 | 0.0980 | 0.1199 | 0.1083 |
| /the-map 1440 | web fonts blocked | 3 | 0.1081 | 0.1133 | 0.1083 |
| /the-map 1440 | local core, no SRI (control) | 3 | 0.1134 | 0.3577 | 0.1083 |
| /the-map 1440 | Memberstack blocked | 2 | 0.2248 | 0.3509 | 0.1083 |
| /the-map 1440 | webflow.js, jQuery, GSAP blocked | 2 | 0.2307 | 0.3628 | 0.1083 |
| /the-map 1440 | core blocked | 3 | 0.3165 | 0.3537 | 0.1083 |
| /the-map 1440 | Webflow-hosted custom scripts blocked | 3 | 0.3509 | 0.3645 | 0.1083 |
| /the-map 1440 | site head mobile nav off | 3 | 0.3560 | 0.3594 | 0.1083 |
| /the-paw-passport 390 | web fonts blocked | 3 | 0.0034 | 0.0034 | 0.0220 |
| /the-paw-passport 390 | site head mobile nav off | 3 | 0.0188 | 0.0188 | 0.0220 |
| /the-paw-passport 390 | CPU 4x slower | 3 | 0.0222 | 0.0222 | 0.0220 |
| /the-paw-passport 390 | body styles moved to head | 3 | 0.0558 | 0.0558 | 0.0220 |
| /the-paw-passport 390 | Webflow-hosted custom scripts blocked | 3 | 0.0558 | 0.0610 | 0.0220 |
| /the-paw-passport 390 | core blocked | 3 | 0.1009 | 0.1023 | 0.0220 |
| /the-paw-passport 1440 | web fonts blocked | 2 | 0.0001 | 0.0001 | 0.0080 |
| /the-paw-passport 1440 | core without ux-1028 nav signup size | 2 | 0.0080 | 0.0080 | 0.0080 |
| /the-paw-passport 1440 | site head wordmark off | 3 | 0.0080 | 0.0080 | 0.0080 |
| /contributors/<profile> 390 | profile script run at once | 3 | 0.0035 | 0.0537 | 0.0763 |
| /contributors/<profile> 390 | profile hero() off | 3 | 0.0177 | 0.0177 | 0.0763 |
| /contributors/<profile> 390 | site head mobile nav off | 3 | 0.0503 | 0.0503 | 0.0763 |
| /contributors/<profile> 390 | chunks blocked | 3 | 0.0763 | 0.0763 | 0.0763 |
| /contributors/<profile> 390 | Webflow-hosted custom scripts blocked | 3 | 0.0763 | 0.0763 | 0.0763 |
| /contributors/<profile> 390 | body styles moved to head | 3 | 0.0763 | 0.0763 | 0.0763 |
| /contributors/<profile> 390 | web fonts blocked | 3 | 0.0763 | 0.0763 | 0.0763 |
| /contributors/<profile> 390 | core without ux-1028 nav signup size | 3 | 0.0763 | 0.0763 | 0.0763 |
| /contributors/<profile> 390 | webflow.js, jQuery, GSAP blocked | 2 | 0.0763 | 0.0763 | 0.0763 |
| /contributors/<profile> 390 | Memberstack blocked | 2 | 0.0763 | 0.0763 | 0.0763 |
| /contributors/<profile> 390 | CPU 4x slower | 3 | 0.0763 | 0.0763 | 0.0763 |
| /contributors/<profile> 390 | core blocked | 3 | 0.6317 | 0.6317 | 0.0763 |
| /contributors/<profile> 1440 | profile script run at once | 3 | 0.0196 | 0.0196 | 0.1178 |
| /contributors/<profile> 1440 | profile hero() off | 3 | 0.0517 | 0.0517 | 0.1178 |
| /contributors/<profile> 1440 | Memberstack blocked | 2 | 0.0687 | 0.1178 | 0.1178 |
| /contributors/<profile> 1440 | web fonts blocked | 3 | 0.1177 | 0.1177 | 0.1178 |
| /contributors/<profile> 1440 | chunks blocked | 3 | 0.1178 | 0.1178 | 0.1178 |
| /contributors/<profile> 1440 | Webflow-hosted custom scripts blocked | 3 | 0.1178 | 0.1178 | 0.1178 |
| /contributors/<profile> 1440 | body styles moved to head | 3 | 0.1178 | 0.1178 | 0.1178 |
| /contributors/<profile> 1440 | core without ux-1028 nav signup size | 3 | 0.1178 | 0.1178 | 0.1178 |
| /contributors/<profile> 1440 | site head mobile nav off | 3 | 0.1178 | 0.1178 | 0.1178 |
| /contributors/<profile> 1440 | webflow.js, jQuery, GSAP blocked | 2 | 0.1224 | 0.1224 | 0.1178 |
| /contributors/<profile> 1440 | core blocked | 3 | 0.1242 | 0.1261 | 0.1178 |
| /signup 390 | core without ux-1028 nav signup size | 3 | 0.0036 | 0.0146 | 0.0036 |
| /signup 390 | web fonts blocked | 3 | 0.0061 | 0.0061 | 0.0036 |
| /signup 390 | site head mobile nav off | 3 | 0.0076 | 0.0375 | 0.0036 |
| /signup 390 | site head wordmark off | 3 | 0.0110 | 0.0409 | 0.0036 |
| /signup 390 | CPU 4x slower | 3 | 0.0175 | 0.0175 | 0.0036 |
| /signup 390 | body styles moved to head | 3 | 0.0409 | 0.0601 | 0.0036 |
| /signup 390 | core blocked | 3 | 0.1161 | 0.1233 | 0.0036 |
| /signup 1440 | web fonts blocked | 3 | 0.0001 | 0.0001 | 0.0016 |
| /signup 1440 | site head mobile nav off | 3 | 0.0002 | 0.0016 | 0.0016 |
| /signup 1440 | core without ux-1028 nav signup size | 3 | 0.0017 | 0.0084 | 0.0016 |
| /signup 1440 | core blocked | 3 | 0.0046 | 0.0087 | 0.0016 |
| /signup 1440 | body styles moved to head | 3 | 0.0084 | 0.0084 | 0.0016 |
| /stories 390 | core without page-heroes + site head mobile nav off | 3 | 0.0241 | 0.0318 | 0.0284 |
| /stories 390 | body styles moved to head | 3 | 0.0284 | 0.0361 | 0.0284 |
| /stories 390 | CPU 4x slower | 3 | 0.0284 | 0.0284 | 0.0284 |
| /stories 390 | CPU 4x slower + body styles moved to head | 2 | 0.0284 | 0.0284 | 0.0284 |
| /stories 390 | site head mobile nav off | 3 | 0.0318 | 0.0319 | 0.0284 |
| /stories 390 | core blocked | 3 | 0.2232 | 0.2240 | 0.0284 |
| /stories 1440 | chunks blocked | 5 | 0.0316 | 0.0943 | 0.0495 |
| /stories 1440 | core blocked | 5 | 0.0364 | 0.1668 | 0.0495 |
| /stories 1440 | core without ux-1028 nav signup size | 5 | 0.0495 | 0.0495 | 0.0495 |
| /stories 1440 | Memberstack blocked | 5 | 0.0495 | 0.0498 | 0.0495 |
| /stories 1440 | site head wordmark off | 3 | 0.0495 | 0.1114 | 0.0495 |
| /stories 1440 | core without page-heroes | 5 | 0.0498 | 0.0498 | 0.0495 |
| /stories 1440 | local core, no SRI (control) | 5 | 0.0498 | 0.1114 | 0.0495 |
| /stories 1440 | site head mobile nav off | 3 | 0.0498 | 0.1140 | 0.0495 |
| /stories 1440 | core without page-heroes + site head mobile nav off | 3 | 0.0498 | 0.1140 | 0.0495 |
| /stories 1440 | Webflow-hosted custom scripts blocked | 5 | 0.0514 | 0.1201 | 0.0495 |
| /stories 1440 | CPU 4x slower + body styles moved to head | 2 | 0.0654 | 0.0654 | 0.0495 |
| /stories 1440 | CPU 4x slower | 3 | 0.0655 | 0.0658 | 0.0495 |
| /stories 1440 | body styles moved to head | 5 | 0.0741 | 0.1358 | 0.0495 |
| /stories 1440 | web fonts blocked | 5 | 0.0916 | 0.0916 | 0.0495 |
| /submit 390 | site head navOut off | 3 | 0.0000 | 0.0002 | 0.1437 |
| /submit 390 | core without ux-1028 nav signup size | 3 | 0.1437 | 0.1437 | 0.1437 |
| /submit 390 | isMobile off | 3 | 0.1437 | 0.1437 | 0.1437 |
| /submit 390 | CPU 4x slower | 3 | 0.1439 | 0.1439 | 0.1437 |
| /submit 390 | core blocked | 3 | 0.1571 | 0.2145 | 0.1437 |
| /submit 1440 | site head navOut off | 3 | 0.0002 | 0.0002 | 0.0552 |
| /submit 1440 | core blocked | 3 | 0.0535 | 0.0549 | 0.0552 |
| /submit 1440 | core without ux-1028 nav signup size | 3 | 0.0552 | 0.0552 | 0.0552 |
| /travelers 390 | core without page-heroes + site head mobile nav off | 3 | 0.0780 | 0.0796 | 0.1134 |
| /travelers 390 | core without page-heroes | 3 | 0.0833 | 0.0880 | 0.1134 |
| /travelers 390 | CPU 4x slower + core without page-heroes | 2 | 0.0838 | 0.0838 | 0.1134 |
| /travelers 390 | body styles moved to head | 3 | 0.1109 | 0.1124 | 0.1134 |
| /travelers 390 | CPU 4x slower + body styles moved to head | 2 | 0.1109 | 0.1109 | 0.1134 |
| /travelers 390 | web fonts blocked | 3 | 0.1128 | 0.1233 | 0.1134 |
| /travelers 390 | isMobile off | 3 | 0.1129 | 0.1234 | 0.1134 |
| /travelers 390 | hasTouch off | 3 | 0.1133 | 0.1137 | 0.1134 |
| /travelers 390 | site head mobile nav off | 3 | 0.1166 | 0.1209 | 0.1134 |
| /travelers 390 | Memberstack blocked | 2 | 0.1182 | 0.1234 | 0.1134 |
| /travelers 390 | site head greys timer off | 2 | 0.1208 | 0.1281 | 0.1134 |
| /travelers 390 | core blocked | 3 | 0.1210 | 0.1225 | 0.1134 |
| /travelers 390 | core without ux-1028 nav signup size | 3 | 0.1234 | 0.1281 | 0.1134 |
| /travelers 390 | chunks blocked | 3 | 0.1238 | 0.1239 | 0.1134 |
| /travelers 390 | CPU 4x slower | 3 | 0.1239 | 0.1239 | 0.1134 |
| /travelers 390 | CPU 4x slower + local core, no SRI (control) | 2 | 0.1239 | 0.1239 | 0.1134 |
| /travelers 390 | Webflow-hosted custom scripts blocked | 3 | 0.1564 | 0.1712 | 0.1134 |
| /travelers 390 | webflow.js, jQuery, GSAP blocked | 2 | 0.1627 | 0.1692 | 0.1134 |
| /travelers 1440 | core blocked | 3 | 0.0222 | 0.0223 | 0.0912 |
| /travelers 1440 | core without page-heroes | 3 | 0.0589 | 0.0589 | 0.0912 |
| /travelers 1440 | core without page-heroes + site head mobile nav off | 3 | 0.0750 | 0.2273 | 0.0912 |
| /travelers 1440 | site head wordmark off | 3 | 0.0879 | 0.1357 | 0.0912 |
| /travelers 1440 | Webflow-hosted custom scripts blocked | 3 | 0.0882 | 0.0912 | 0.0912 |
| /travelers 1440 | chunks blocked | 3 | 0.0895 | 0.0897 | 0.0912 |
| /travelers 1440 | site head mobile nav off | 3 | 0.1353 | 0.1457 | 0.0912 |
| /travelers 1440 | web fonts blocked | 3 | 0.1366 | 0.1366 | 0.0912 |
| /travelers 1440 | Memberstack blocked | 2 | 0.1446 | 0.1538 | 0.0912 |
| /travelers 1440 | core without ux-1028 nav signup size | 3 | 0.1484 | 0.1499 | 0.0912 |
| /travelers 1440 | body styles moved to head | 3 | 0.1589 | 0.1591 | 0.0912 |
| /travelers 1440 | CPU 4x slower | 3 | 0.2042 | 0.2043 | 0.0912 |
| /travelers 1440 | webflow.js, jQuery, GSAP blocked | 2 | 0.2864 | 0.2864 | 0.0912 |
| /travelers 1440 | local core, no SRI (control) | 3 | 0.3040 | 0.3040 | 0.0912 |
