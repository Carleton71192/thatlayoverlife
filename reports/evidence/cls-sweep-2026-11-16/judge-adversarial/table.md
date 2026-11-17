# Adversarial check of the 16.67.0 core: every scenario, both arms

ctl = live 16.66.0 core routed from a local copy; new = the branch core (afe01e7 build). One load per scenario and arm unless the scenario name ends in a round number.
CLS counts every layout-shift entry. "late" is the part of it later than 1 s after the load event. "same" compares the finished page of the two arms.

## Flags (336)

- back / travelers-back-390 [back]: boxes differ: 2 lines differ (y or height by -41)
- back / travelers-back-390 [back]: scrollY differs
- back / travelers-back-390 [back2]: boxes differ: 2 lines differ (y or height by -82)
- back / travelers-back-390 [back2]: scrollY differs
- back / map-back-390 [back]: body tree differs
- back / map-back-390 [back]: boxes differ: 275/440 boxes
- back / map-back-390 [back]: aria/focus differ
- back / map-back-390 [back]: scrollY differs
- back / map-back-390 [back2]: body tree differs
- back / map-back-390 [back2]: boxes differ: 275/440 boxes
- back / map-back-390 [back2]: aria/focus differ
- back / map-back-390 [back2]: CLS new 0.9190 over 0.1
- back / map-back-390 [back2]: scrollY differs
- back / expats-back-390 [back]: body tree differs
- back / expats-back-390 [back]: boxes differ: 19 lines differ, names too
- back / expats-back-390 [back]: CLS new 0.1207 over 0.1
- back / expats-back-390 [back2]: body tree differs
- back / expats-back-390 [back2]: boxes differ: 17 lines differ, names too
- back / expats-back-390 [back2]: CLS new 0.1207 over 0.1
- back / about-back-390 [back]: body tree differs
- back / about-back-390 [back]: boxes differ: 1 lines differ, names too
- back / about-back-390 [back2]: body tree differs
- back / about-back-390 [back2]: boxes differ: 1 lines differ, names too
- back / account-back-390 [back]: CLS new 0.2504 over 0.1
- back / account-back-390 [back2]: CLS new 0.2408 over 0.1
- back / profile-back-390 [back]: body tree differs
- back / profile-back-390 [back]: boxes differ: 423 lines differ, names too
- back / profile-back-390 [back]: CLS new 0.6883 over 0.1
- back / profile-back-390 [back]: scrollY differs
- back / profile-back-390 [back2]: body tree differs
- back / profile-back-390 [back2]: boxes differ: 423 lines differ, names too
- back / profile-back-390 [back2]: CLS new 0.6870 over 0.1
- back / profile-back-390 [back2]: scrollY differs
- back / map-back-1440 [back]: body tree differs
- back / map-back-1440 [back]: boxes differ: 52 lines differ, names too
- back / map-back-1440 [back]: CLS new 0.3076 over 0.1
- back / map-back-1440 [back]: scrollY differs
- back / map-back-1440 [back2]: body tree differs
- back / map-back-1440 [back2]: boxes differ: 298/462 boxes
- back / map-back-1440 [back2]: aria/focus differ
- back / map-back-1440 [back2]: CLS new 0.7333 over 0.1
- back / map-back-1440 [back2]: scrollY differs
- back / stories-back-1440 [back]: body tree differs
- back / stories-back-1440 [back]: boxes differ: 1155/1153 boxes
- back / stories-back-1440 [back2]: body tree differs
- back / stories-back-1440 [back2]: boxes differ: 1155/1153 boxes
- back / account-back-1440 [back]: boxes differ: 21 lines differ (y or height by -77)
- back / account-back-1440 [back]: CLS new 0.3676 over 0.1
- back / account-back-1440 [back]: scrollY differs
- back / account-back-1440 [back2]: boxes differ: 21 lines differ (y or height by -77)
- back / account-back-1440 [back2]: CLS new 0.3675 over 0.1
- back / account-back-1440 [back2]: scrollY differs
- cuts / travelers-cut3-390 [end]: (by design) title hold +40 px
- fail / travelers-jq404-390 [end]: (by design) title hold +40 px
- fail / submit-parity-throw-390 [end]: CLS new 0.1408 > ctl 0.0000
- fail / submit-parity-throw-390 [end]: CLS new 0.1408 over 0.1
- fail / stories-mnav-missing-390 [end]: more console errors in new
- fail / stories-parity-throw-390 [end]: body tree differs
- fail / stories-pagechunk404-390 [end]: CLS new 0.1157 over 0.1
- fail / stories-pagechunk-throw-390 [end]: CLS new 0.1164 over 0.1
- fail / map-tll-map-invite-js-v1-throw-390 [end]: body tree differs
- fail / map-tll-map-invite-js-v1-throw-390 [end]: boxes differ: 439/440 boxes
- fail / map-tll-map-invite-js-v1-throw-390 [end]: aria/focus differ
- fail / map-tll-map-invite-js-v1-missing-390 [end]: body tree differs
- fail / map-tll-map-invite-js-v1-missing-390 [end]: boxes differ: 403 lines differ (x or width)
- fail / map-tll-mp3-passport-js-v1-throw-390 [end]: body tree differs
- fail / map-tll-mp3-passport-js-v1-throw-390 [end]: boxes differ: 421 lines differ (x or width)
- fail / map-tll-map-snapshot-v1-throw-390 [end]: body tree differs
- fail / map-tll-map-snapshot-v1-throw-390 [end]: boxes differ: 403 lines differ (x or width)
- fail / map-mapcode-throw-390 [end]: boxes differ: 92 lines differ (y or height by 844,854)
- fail / map-mapcode-throw-390 [end]: left: style#tll-fp-map-v1
- fail / map-mapcode-throw-390 [end]: hold: fp-map-v1 kept
- fail / map-mapcode-empty-390 [end]: hold: fp-map-v1 let go at 9588 ms
- fail / map-mapcss404-390 [end]: body tree differs
- fail / map-mapdata404-390 [end]: hold: fp-map-v1 let go at 9586 ms
- fail / map-tll-map-invite-js-v1-throw-1440 [end]: body tree differs
- fail / map-tll-map-invite-js-v1-throw-1440 [end]: boxes differ: 461/462 boxes
- fail / map-tll-map-invite-js-v1-throw-1440 [end]: aria/focus differ
- fail / map-tll-map-invite-js-v1-missing-1440 [end]: body tree differs
- fail / map-tll-map-invite-js-v1-missing-1440 [end]: boxes differ: 7 lines differ, names too
- fail / map-mapcode-throw-1440 [end]: boxes differ: 112 lines differ (y or height by 900,910)
- fail / map-mapcode-throw-1440 [end]: left: style#tll-fp-map-v1
- fail / map-mapcode-throw-1440 [end]: hold: fp-map-v1 kept
- fail / map-mapcode-empty-1440 [end]: late shift new 0.0373 > ctl 0.0000
- fail / map-mapcode-empty-1440 [end]: hold: fp-map-v1 let go at 9630 ms
- fail / map-mapdata404-1440 [end]: late shift new 0.0268 > ctl 0.0000
- fail / map-mapdata404-1440 [end]: hold: fp-map-v1 let go at 9582 ms
- fail / profile-tll-pf5-profile-js-v1-throw-1440 [end]: CLS new 0.0297 > ctl 0.0088
- fail / stories-tll-lib-lead-v1-throw-1440 [end]: body tree differs
- fail / stories-tll-lib-lead-v1-throw-1440 [end]: boxes differ: 1153/1155 boxes
- fail / stories-tll-lib-lead-v1-throw-1440 [end]: more console errors in new
- fail / stories-shareyours404-1440 [end]: body tree differs
- fail / stories-shareyours404-1440 [end]: boxes differ: 1150/1148 boxes
- maptall / map-768x1024 [end]: body tree differs
- maptall / map-768x1024 [end]: boxes differ: 7 lines differ, names too
- maptall / map-1024x1366 [end]: body tree differs
- maptall / map-1024x1366 [end]: boxes differ: 17 lines differ, names too
- maptall / map-1440x1600 [end]: body tree differs
- maptall / map-1440x1600 [end]: boxes differ: 17 lines differ, names too
- maptall / map-1920x1080 [end]: body tree differs
- maptall / map-1920x1080 [end]: boxes differ: 7 lines differ, names too
- maptall / map-2560x1440 [end]: body tree differs
- maptall / map-2560x1440 [end]: boxes differ: 7 lines differ, names too
- mapuse / map-use-768 [loaded]: body tree differs
- mapuse / map-use-768 [loaded]: boxes differ: 7 lines differ, names too
- mapuse / map-use-768 [at-map]: body tree differs
- mapuse / map-use-768 [at-map]: boxes differ: 7 lines differ, names too
- mapuse / map-use-768 [btn0]: body tree differs
- mapuse / map-use-768 [btn0]: boxes differ: 7 lines differ, names too
- mapuse / map-use-768 [btn0]: CLS new 0.1527 over 0.1
- mapuse / map-use-768 [chip0]: body tree differs
- mapuse / map-use-768 [chip0]: boxes differ: 7 lines differ, names too
- mapuse / map-use-768 [chip0]: CLS new 0.1533 over 0.1
- mapuse / map-use-768 [chip1]: body tree differs
- mapuse / map-use-768 [chip1]: boxes differ: 7 lines differ, names too
- mapuse / map-use-768 [chip1]: CLS new 0.1537 over 0.1
- mapuse / map-use-768 [tap-map]: body tree differs
- mapuse / map-use-768 [tap-map]: boxes differ: 7 lines differ, names too
- mapuse / map-use-768 [tap-map]: CLS new 0.1541 over 0.1
- mapuse / map-use-768 [bottom]: body tree differs
- mapuse / map-use-768 [bottom]: boxes differ: 7 lines differ, names too
- mapuse / map-use-768 [bottom]: CLS new 0.1541 over 0.1
- markup / trav-list-pets-390 [end]: body tree differs
- markup / map-hash-passport-390 [end]: CLS new 2.1083 over 0.1
- markup / map-hash-passport-1440 [end]: boxes differ: 21 lines differ (y or height by 910)
- markup / map-hash-passport-1440 [end]: CLS new 0.9844 over 0.1
- markup / map-hash-passport-1440 [end]: scrollY differs
- markup / trav-newverb-390 [end]: (by design) title hold +40 px
- markup / account-navplain-390 [end]: CLS new 0.1745 over 0.1
- markup / st-firsthidden-1440 [end]: body tree differs
- markup / st-firsthidden-1440 [end]: boxes differ: 1152/1150 boxes
- markup / st-notitle-1440 [end]: body tree differs
- markup / st-notitle-1440 [end]: boxes differ: 1149/1147 boxes
- markup / st-q-390 [end]: CLS new 0.3841 over 0.1
- markup / st-q-1440 [end]: CLS new 0.7132 > ctl 0.2389
- markup / st-q-1440 [end]: CLS new 0.7132 over 0.1
- menu / travelers-menu-390 [open]: (by design) title hold +40 px
- reload / travelers-reload-mid-390 [scrolled]: (by design) title hold +40 px
- reload / travelers-reload-mid-390 [reloaded]: (by design) title hold +40 px
- reload / travelers-reload-bottom-390 [scrolled]: (by design) title hold +40 px
- reload / travelers-reload-bottom-390 [scrolled]: scrollY differs
- reload / travelers-reload-bottom-390 [reloaded]: boxes differ: 207 lines differ (y or height by 40,41,81)
- reload / travelers-reload-bottom-390 [reloaded]: CLS new 0.7626 over 0.1
- reload / travelers-reload-bottom-390 [reloaded]: scrollY differs
- reload / map-reload-mid-390 [reloaded]: body tree differs
- reload / map-reload-mid-390 [reloaded]: boxes differ: 85 lines differ, names too
- reload / map-reload-mid-390 [reloaded]: CLS new 1.3125 over 0.1
- reload / map-reload-mid-390 [reloaded]: scrollY differs
- reload / map-reload-bottom-390 [reloaded]: body tree differs
- reload / map-reload-bottom-390 [reloaded]: boxes differ: 58 lines differ, names too
- reload / map-reload-bottom-390 [reloaded]: CLS new 1.1338 over 0.1
- reload / map-reload-bottom-390 [reloaded]: scrollY differs
- reload / map-reload-mid-1440 [reloaded]: body tree differs
- reload / map-reload-mid-1440 [reloaded]: boxes differ: 298/462 boxes
- reload / map-reload-mid-1440 [reloaded]: aria/focus differ
- reload / map-reload-mid-1440 [reloaded]: html class differs
- reload / map-reload-mid-1440 [reloaded]: CLS new 0.8265 over 0.1
- reload / map-reload-mid-1440 [reloaded]: scrollY differs
- reload / expats-reload-mid-390 [reloaded]: body tree differs
- reload / expats-reload-mid-390 [reloaded]: boxes differ: 18 lines differ, names too
- reload / expats-reload-mid-390 [reloaded]: CLS new 0.4811 over 0.1
- reload / expats-reload-bottom-390 [reloaded]: boxes differ: 2 lines differ (y or height by -1)
- reload / expats-reload-bottom-390 [reloaded]: CLS new 1.0168 > ctl 0.0997
- reload / expats-reload-bottom-390 [reloaded]: CLS new 1.0168 over 0.1
- reload / expats-reload-bottom-390 [reloaded]: late shift new 0.0118 > ctl 0.0000
- reload / expats-reload-bottom-390 [reloaded]: scrollY differs
- reload / about-reload-bottom-390 [reloaded]: body tree differs
- reload / about-reload-bottom-390 [reloaded]: boxes differ: 48 lines differ, names too
- reload / about-reload-bottom-390 [reloaded]: CLS new 0.4936 > ctl 0.1308
- reload / about-reload-bottom-390 [reloaded]: CLS new 0.4936 over 0.1
- reload / account-reload-mid-390 [reloaded]: CLS new 0.2504 over 0.1
- reload / account-reload-bottom-390 [reloaded]: CLS new 0.2504 over 0.1
- reload / submit-reload-mid-390 [scrolled]: more console errors in new
- reload / submit-reload-mid-390 [reloaded]: more console errors in new
- reload / profile-reload-mid-390 [scrolled]: more console errors in new
- reload / profile-reload-mid-390 [reloaded]: CLS new 1.0957 over 0.1
- reload / profile-reload-mid-390 [reloaded]: more console errors in new
- reload / profile-reload-bottom-390 [scrolled]: CLS new 0.3246 over 0.1
- reload / profile-reload-bottom-390 [reloaded]: CLS new 1.3612 over 0.1
- reload2 / expats-reload-bottom-390-r1 [scrolled]: more console errors in new
- reload2 / expats-reload-bottom-390-r1 [reloaded]: body tree differs
- reload2 / expats-reload-bottom-390-r1 [reloaded]: boxes differ: 414/417 boxes
- reload2 / expats-reload-bottom-390-r1 [reloaded]: aria/focus differ
- reload2 / expats-reload-bottom-390-r1 [reloaded]: html class differs
- reload2 / expats-reload-bottom-390-r1 [reloaded]: CLS new 1.0216 over 0.1
- reload2 / expats-reload-bottom-390-r1 [reloaded]: more console errors in new
- reload2 / expats-reload-bottom-390-r1 [reloaded]: scrollY differs
- reload2 / about-reload-bottom-390-r1 [reloaded]: body tree differs
- reload2 / about-reload-bottom-390-r1 [reloaded]: boxes differ: 41 lines differ, names too
- reload2 / about-reload-bottom-390-r1 [reloaded]: CLS new 0.5208 > ctl 0.1530
- reload2 / about-reload-bottom-390-r1 [reloaded]: CLS new 0.5208 over 0.1
- reload2 / about-reload-bottom-390-r1 [reloaded]: scrollY differs
- reload2 / expats-reload-bottom-390-r2 [scrolled]: more console errors in new
- reload2 / expats-reload-bottom-390-r2 [reloaded]: body tree differs
- reload2 / expats-reload-bottom-390-r2 [reloaded]: boxes differ: 414/417 boxes
- reload2 / expats-reload-bottom-390-r2 [reloaded]: aria/focus differ
- reload2 / expats-reload-bottom-390-r2 [reloaded]: html class differs
- reload2 / expats-reload-bottom-390-r2 [reloaded]: CLS new 1.0216 over 0.1
- reload2 / expats-reload-bottom-390-r2 [reloaded]: more console errors in new
- reload2 / expats-reload-bottom-390-r2 [reloaded]: scrollY differs
- reload2 / about-reload-bottom-390-r2 [reloaded]: body tree differs
- reload2 / about-reload-bottom-390-r2 [reloaded]: boxes differ: 48 lines differ, names too
- reload2 / about-reload-bottom-390-r2 [reloaded]: CLS new 0.4936 > ctl 0.1308
- reload2 / about-reload-bottom-390-r2 [reloaded]: CLS new 0.4936 over 0.1
- reload2 / expats-reload-bottom-390-r3 [reloaded]: body tree differs
- reload2 / expats-reload-bottom-390-r3 [reloaded]: boxes differ: 45 lines differ, names too
- reload2 / expats-reload-bottom-390-r3 [reloaded]: CLS new 1.0168 over 0.1
- reload2 / about-reload-bottom-390-r3 [reloaded]: body tree differs
- reload2 / about-reload-bottom-390-r3 [reloaded]: boxes differ: 48 lines differ, names too
- reload2 / about-reload-bottom-390-r3 [reloaded]: CLS new 0.4465 > ctl 0.1550
- reload2 / about-reload-bottom-390-r3 [reloaded]: CLS new 0.4465 over 0.1
- resize / travelers-rotate-390 [a]: (by design) title hold +40 px
- resize / travelers-rotate-390 [b]: CLS new 0.6449 over 0.1
- resize / travelers-rotate-390 [c]: CLS new 1.2856 over 0.1
- resize / travelers-resize-1440-768 [a]: body tree differs
- resize / travelers-resize-1440-768 [b]: CLS new 0.9383 over 0.1
- resize / travelers-resize-1440-768 [b]: late shift new 0.9367 > ctl 0.9108
- resize / travelers-resize-1440-768 [c]: CLS new 1.6172 over 0.1
- resize / travelers-resize-1440-768 [c]: late shift new 1.6155 > ctl 1.5896
- resize / map-rotate-390 [b]: CLS new 0.5371 over 0.1
- resize / map-rotate-390 [c]: CLS new 1.1048 over 0.1
- resize / map-resize-1440-768 [b]: CLS new 0.6183 over 0.1
- resize / map-resize-1440-768 [c]: CLS new 1.0451 over 0.1
- resize / expats-rotate-390 [b]: CLS new 0.5469 over 0.1
- resize / expats-rotate-390 [c]: CLS new 1.0847 over 0.1
- resize / expats-resize-1440-768 [b]: CLS new 0.8021 over 0.1
- resize / expats-resize-1440-768 [c]: CLS new 1.3660 over 0.1
- resize / about-rotate-390 [b]: CLS new 0.9163 over 0.1
- resize / about-rotate-390 [c]: CLS new 1.4541 over 0.1
- resize / about-resize-1440-768 [b]: CLS new 0.5602 over 0.1
- resize / about-resize-1440-768 [c]: CLS new 0.9540 over 0.1
- resize / account-rotate-390 [b]: CLS new 0.5490 over 0.1
- resize / account-rotate-390 [c]: CLS new 1.0869 over 0.1
- resize / account-resize-1440-768 [b]: CLS new 0.3071 over 0.1
- resize / account-resize-1440-768 [c]: CLS new 0.5205 over 0.1
- resize / submit-rotate-390 [b]: CLS new 0.5056 over 0.1
- resize / submit-rotate-390 [c]: CLS new 1.0117 over 0.1
- resize / submit-resize-1440-768 [b]: CLS new 0.3939 over 0.1
- resize / submit-resize-1440-768 [c]: CLS new 0.6564 over 0.1
- resize / profile-rotate-390 [b]: CLS new 0.5375 over 0.1
- resize / profile-rotate-390 [c]: CLS new 1.0754 over 0.1
- resize / profile-resize-1440-768 [b]: CLS new 0.6211 over 0.1
- resize / profile-resize-1440-768 [c]: CLS new 1.0729 over 0.1
- resize / stories-rotate-390 [b]: CLS new 0.5441 over 0.1
- resize / stories-rotate-390 [c]: CLS new 1.0819 over 0.1
- resize / stories-resize-1440-768 [b]: CLS new 0.6347 over 0.1
- resize / stories-resize-1440-768 [c]: CLS new 1.1525 over 0.1
- resize / travelers-resize-1440-500 [a]: body tree differs
- resize / travelers-resize-1440-500 [b]: CLS new 0.9682 over 0.1
- resize / travelers-resize-1440-500 [b]: late shift new 0.9665 > ctl 0.9407
- resize / travelers-resize-1440-500 [c]: CLS new 1.6470 over 0.1
- resize / travelers-resize-1440-500 [c]: late shift new 1.6453 > ctl 1.6196
- resize / map-resize-1440-390 [b]: CLS new 0.9202 over 0.1
- resize / map-resize-1440-390 [c]: CLS new 1.6030 over 0.1
- rm / map-rm-390 [end]: body tree differs
- rm / map-rm-1440 [end]: body tree differs
- signedin / account-in-fast-390 [end]: CLS new 0.1917 over 0.1
- signedin / account-in-late-390 [end]: CLS new 0.2304 > ctl 0.1325
- signedin / account-in-late-390 [end]: CLS new 0.2304 over 0.1
- signedin / account-in-late-390 [end]: late shift new 0.2304 > ctl 0.1325
- signedin / account-in-fast-1440 [end]: CLS new 0.1176 over 0.1
- signedin / account-in-late-1440 [end]: CLS new 0.1236 over 0.1
- signedin / submit-in-fast-390 [end]: CLS new 0.9438 over 0.1
- signedin / submit-in-late-390 [end]: CLS new 0.9435 over 0.1
- signedin / submit-in-fast-1440 [end]: CLS new 0.7798 over 0.1
- signedin / submit-in-late-1440 [end]: CLS new 0.7785 over 0.1
- signedin / map-in-fast-1440 [end]: body tree differs
- signedin / map-in-fast-1440 [end]: boxes differ: 1 lines differ (x or width)
- signedin / map-in-fast-1440 [end]: aria/focus differ
- signedin / account-in-hash-settings-390 [end]: CLS new 0.1917 over 0.1
- signedin / account-in-hash-settings-1440 [end]: CLS new 0.4291 over 0.1
- signedin / account-in-fast-cut-390 [end]: CLS new 0.3998 over 0.1
- signedin / account-in-late-cut-390 [end]: CLS new 0.4332 over 0.1
- signedin / account-in-fast-cut-1440 [end]: body tree differs
- signedin / account-in-fast-cut-1440 [end]: boxes differ: 62 lines differ (y or height by -8)
- signedin / account-in-late-cut-1440 [end]: CLS new 0.7844 over 0.1
- signedin / submit-in-fast-cut-390 [end]: body tree differs
- signedin / submit-in-fast-cut-390 [end]: boxes differ: 60 lines differ (y or height by 8)
- signedin / submit-in-fast-cut-390 [end]: CLS new 0.1088 > ctl 0.0004
- signedin / submit-in-fast-cut-390 [end]: CLS new 0.1088 over 0.1
- signedin / submit-in-late-cut-390 [end]: CLS new 1.0129 over 0.1
- signedin / submit-in-late-cut-1440 [end]: CLS new 0.9620 over 0.1
- signedin2 / account-in-fast-cut-1440-r1 [end]: CLS new 0.7837 over 0.1
- signedin2 / submit-in-fast-cut-390-r1 [end]: CLS new 0.1088 over 0.1
- signedin2 / account-in-fast-cut-1440-r2 [end]: CLS new 0.7837 over 0.1
- signedin2 / submit-in-fast-cut-390-r2 [end]: CLS new 0.1088 over 0.1
- signedin2 / account-in-fast-cut-1440-r3 [end]: CLS new 0.7837 over 0.1
- signedin2 / submit-in-fast-cut-390-r3 [end]: CLS new 0.1088 over 0.1
- slow / stories-cut1-390 [end]: body tree differs
- slow / stories-cut2-390 [end]: body tree differs
- slow / stories-even-1440 [end]: body tree differs
- slow / stories-cut1-1440 [end]: body tree differs
- storiesuse / stories-chips-390 [place-all]: CLS new 0.2715 over 0.1
- storiesuse / stories-chips-1440 [place-all]: CLS new 0.3865 over 0.1
- storiesuse / stories-chips-q-1440 [place-all]: CLS new 0.3874 over 0.1
- stq2 / st-q-1440-r1 [end]: CLS new 0.1197 over 0.1
- stq2 / st-q-1440-r2 [end]: CLS new 0.1197 over 0.1
- stq2 / st-q-1440-r3 [end]: CLS new 0.1197 over 0.1
- stq2 / st-q-1440-r4 [end]: CLS new 0.7132 > ctl 0.2310
- stq2 / st-q-1440-r4 [end]: CLS new 0.7132 over 0.1
- stq2 / st-q-1440-r5 [end]: CLS new 0.7124 > ctl 0.2389
- stq2 / st-q-1440-r5 [end]: CLS new 0.7124 over 0.1
- stq2 / st-q-1440-r6 [end]: CLS new 0.1189 over 0.1
- stq2 / st-q-1440-r7 [end]: CLS new 0.7132 over 0.1
- stq2 / st-q-1440-r8 [end]: CLS new 0.1197 over 0.1
- stq2 / st-q-390-r1 [end]: CLS new 0.3841 over 0.1
- stq2 / st-q-390-r2 [end]: CLS new 0.3841 over 0.1
- stq2 / st-q-390-r3 [end]: CLS new 0.3841 over 0.1
- stq2 / st-q-390-r4 [end]: CLS new 0.3841 over 0.1
- trav10 / travelers-10s-320-1 [end]: (by design) title hold +40 px
- trav10 / travelers-10s-320-1 [end]: CLS new 0.1514 over 0.1
- trav10 / travelers-10s-320-2 [end]: (by design) title hold +40 px
- trav10 / travelers-10s-320-2 [end]: CLS new 0.1514 over 0.1
- trav10 / travelers-10s-390-1 [end]: (by design) title hold +40 px
- trav10 / travelers-10s-390-2 [end]: (by design) title hold +40 px
- travuse / travelers-use-390 [q-den]: (by design) title hold +40 px
- travuse / travelers-use-390 [q-den]: scrollY differs
- travuse / travelers-use-390 [q-none]: scrollY differs
- travuse / travelers-use-390 [chip-expats]: CLS new 0.2123 over 0.1
- travuse / travelers-use-390 [chip-creators]: CLS new 0.2124 over 0.1
- travuse / travelers-use-390 [chip-press]: CLS new 0.2124 over 0.1
- travuse / travelers-use-390 [chip-everyone]: (by design) title hold +40 px
- travuse / travelers-use-390 [chip-everyone]: CLS new 0.4288 over 0.1
- travuse / travelers-use-1440 [chip-everyone]: CLS new 0.1579 over 0.1
- travuse / travelers-use-320 [q-den]: (by design) title hold +40 px
- travuse / travelers-use-320 [q-den]: CLS new 0.1514 over 0.1
- travuse / travelers-use-320 [q-den]: scrollY differs
- travuse / travelers-use-320 [q-none]: CLS new 0.1620 over 0.1
- travuse / travelers-use-320 [q-none]: scrollY differs
- travuse / travelers-use-320 [q-clear]: CLS new 0.1620 over 0.1
- travuse / travelers-use-320 [chip-expats]: CLS new 0.3090 over 0.1
- travuse / travelers-use-320 [chip-creators]: CLS new 0.3092 over 0.1
- travuse / travelers-use-320 [chip-press]: CLS new 0.3092 over 0.1
- travuse / travelers-use-320 [chip-everyone]: CLS new 0.4743 over 0.1
- w320 / travelers-320 [end]: (by design) title hold +40 px
- w320 / travelers-320 [end]: CLS new 0.1514 over 0.1

## Set back (12 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-back-390 | back | 0.2833 | 0.0053 | 0.0479 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 20/20 | boxes: 2 lines differ (y or height by -41); scrollY 1054/1013 |
| travelers-back-390 | back2 | 0.2746 | 0.0053 | 0.0479 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 20/20 | boxes: 2 lines differ (y or height by -82); scrollY 1095/1013 |
| map-back-390 | back | 1.5685 | 0.0495 | 0.0327 | 0.0077 | N N N N N N y | - | 0/0 | 20/20 | boxes: 275/440 boxes; scrollY 4379/987; docH 6644/7447 |
| map-back-390 | back2 | 2.2630 | 0.9190 | 0.0109 | 0.0074 | N N N N N N y | - | 0/0 | 20/20 | boxes: 275/440 boxes; scrollY 2660/962; docH 6644/7447 |
| expats-back-390 | back | 0.8614 | 0.1207 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 20/20 | boxes: 19 lines differ, names too |
| expats-back-390 | back2 | 0.8046 | 0.1207 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 20/20 | boxes: 17 lines differ, names too |
| about-back-390 | back | 0.3919 | 0.0058 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 27/27 | boxes: 1 lines differ, names too |
| about-back-390 | back2 | 0.3919 | 0.0058 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 27/27 | boxes: 1 lines differ, names too |
| account-back-390 | back | 0.2507 | 0.2504 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 20/20 |  |
| account-back-390 | back2 | 0.2507 | 0.2408 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 20/20 |  |
| submit-back-390 | back | 0.2369 | 0.0414 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 20/20 |  |
| submit-back-390 | back2 | 0.2369 | 0.0412 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 20/20 |  |
| profile-back-390 | back | 1.3273 | 0.6883 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 20/20 | boxes: 423 lines differ, names too; scrollY 982/1013 |
| profile-back-390 | back2 | 1.2904 | 0.6870 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 20/20 | boxes: 423 lines differ, names too; scrollY 951/1013 |
| stories-back-390 | back | 0.0024 | 0.0019 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 24/24 |  |
| stories-back-390 | back2 | 0.0045 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 24/24 |  |
| map-back-1440 | back | 1.7049 | 0.3076 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 20/20 | boxes: 52 lines differ, names too; scrollY 1142/1054 |
| map-back-1440 | back2 | 1.2628 | 0.7333 | 0.0000 | 0.0000 | N N N N N N y | - | 0/0 | 20/20 | boxes: 298/462 boxes; scrollY 3630/1116; docH 5351/5868 |
| travelers-back-1440 | back | 0.2507 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | tll-fp-title-v1 | 0/0 | 20/20 |  |
| travelers-back-1440 | back2 | 0.2507 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | tll-fp-title-v1 | 0/0 | 20/20 |  |
| stories-back-1440 | back | 0.0165 | 0.0177 | 0.0000 | 0.0000 | N N y y y N y | - | 0/0 | 42/38 | boxes: 1155/1153 boxes |
| stories-back-1440 | back2 | 0.0165 | 0.0155 | 0.0000 | 0.0000 | N N y y y N y | - | 0/0 | 42/38 | boxes: 1155/1153 boxes |
| account-back-1440 | back | 0.5238 | 0.3676 | 0.0000 | 0.0000 | N y y y y y y | - | 0/0 | 20/20 | boxes: 21 lines differ (y or height by -77); scrollY 685/608 |
| account-back-1440 | back2 | 0.5280 | 0.3675 | 0.0000 | 0.0000 | N y y y y y y | - | 0/0 | 20/20 | boxes: 21 lines differ (y or height by -77); scrollY 685/608 |

## Set cuts (16 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-cut3-390 | end | 0.1698 | 0.0392 | 0.0181 | 0.0070 | N y y y y y y | tll-fp-title-v1 | 0/0 | 6/6 | boxes: title hold +40 px; docH 8317/8358 |
| travelers-cut3-1440 | end | 0.2927 | 0.0353 | 0.0065 | 0.0065 | y y y y y y y | tll-fp-title-v1 | 0/0 | 6/6 |  |
| map-cut3-390 | end | 0.5523 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 |  |
| map-cut3-1440 | end | 0.0684 | 0.0036 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 |  |
| expats-cut3-390 | end | 0.0773 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 |  |
| expats-cut3-1440 | end | 0.0400 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 |  |
| about-cut3-390 | end | 0.0970 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 |  |
| about-cut3-1440 | end | 0.0366 | 0.0011 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 |  |
| account-cut3-390 | end | 0.3000 | 0.0938 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 |  |
| account-cut3-1440 | end | 0.0694 | 0.0184 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 |  |
| submit-cut3-390 | end | 0.1439 | 0.0002 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 7/7 |  |
| submit-cut3-1440 | end | 0.0554 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 7/7 |  |
| profile-cut3-390 | end | 0.0763 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 |  |
| profile-cut3-1440 | end | 0.1178 | 0.0008 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 |  |
| stories-cut3-390 | end | 0.0267 | 0.0062 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| stories-cut3-1440 | end | 0.0655 | 0.0300 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |

## Set fail (144 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-jq404-390 | end | 0.1562 | 0.0387 | 0.0181 | 0.0070 | N y y y y y y | tll-fp-title-v1 | 1/1 | 5/5 | boxes: title hold +40 px; docH 8317/8358 |
| travelers-ms404-390 | end | 0.1281 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 1/1 |  |
| travelers-mnav-throw-390 | end | 0.1166 | 0.0142 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 1/1 | 4/4 |  |
| travelers-mnav-missing-390 | end | 0.1213 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-parity-throw-390 | end | 0.1234 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 1/1 | 4/4 |  |
| travelers-sitechunk404-390 | end | 0.1234 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 5/5 |  |
| travelers-pagechunk404-390 | end | 0.1134 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 5/5 |  |
| travelers-pagechunk-throw-390 | end | 0.1134 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 5/5 |  |
| map-jq404-390 | end | 0.1632 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 5/5 |  |
| map-ms404-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| map-mnav-throw-390 | end | 0.1470 | 0.0034 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| map-mnav-missing-390 | end | 0.1242 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-parity-throw-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| map-sitechunk404-390 | end | 0.1630 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| map-pagechunk404-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| map-pagechunk-throw-390 | end | 0.1632 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| expats-jq404-390 | end | 0.0989 | 0.0049 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 5/5 |  |
| expats-ms404-390 | end | 0.0878 | 0.0049 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| expats-mnav-throw-390 | end | 0.0604 | 0.0083 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| expats-mnav-missing-390 | end | 0.0604 | 0.0049 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-parity-throw-390 | end | 0.0772 | 0.0096 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| expats-sitechunk404-390 | end | 0.0878 | 0.0049 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| expats-pagechunk404-390 | end | 0.0772 | 0.0097 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| expats-pagechunk-throw-390 | end | 0.0772 | 0.0049 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| about-jq404-390 | end | 0.0457 | 0.0007 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 5/5 |  |
| about-ms404-390 | end | 0.0243 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| about-mnav-throw-390 | end | 0.0106 | 0.0037 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| about-mnav-missing-390 | end | 0.0109 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-parity-throw-390 | end | 0.0245 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| about-sitechunk404-390 | end | 0.0243 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| about-pagechunk404-390 | end | 0.0243 | 0.0002 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-pagechunk-throw-390 | end | 0.0245 | 0.0002 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-jq404-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 5/5 |  |
| account-ms404-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| account-mnav-throw-390 | end | 0.0073 | 0.0073 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| account-mnav-missing-390 | end | 0.0073 | 0.0073 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-parity-throw-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| account-sitechunk404-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| account-pagechunk404-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| account-pagechunk-throw-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| submit-jq404-390 | end | 0.1436 | 0.0002 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 5/5 |  |
| submit-ms404-390 | end | 0.1437 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| submit-mnav-throw-390 | end | 0.1437 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| submit-mnav-missing-390 | end | 0.1437 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-parity-throw-390 | end | 0.0000 | 0.1408 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| submit-sitechunk404-390 | end | 0.1408 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| submit-pagechunk404-390 | end | 0.1437 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| submit-pagechunk-throw-390 | end | 0.1437 | 0.0002 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| profile-jq404-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 5/5 |  |
| profile-ms404-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| profile-mnav-throw-390 | end | 0.0503 | 0.0038 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| profile-mnav-missing-390 | end | 0.0503 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-parity-throw-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 | nav None/navigate |
| profile-sitechunk404-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| profile-pagechunk404-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| profile-pagechunk-throw-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| stories-jq404-390 | end | 0.0283 | 0.0061 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 5/5 |  |
| stories-ms404-390 | end | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/4 |  |
| stories-mnav-throw-390 | end | 0.0216 | 0.0113 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 8/8 |  |
| stories-mnav-missing-390 | end | 0.0240 | 0.0140 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/8 |  |
| stories-parity-throw-390 | end | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y N y y y y y | - | 1/1 | 8/8 |  |
| stories-sitechunk404-390 | end | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 9/9 |  |
| stories-pagechunk404-390 | end | 0.1485 | 0.1157 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 9/9 |  |
| stories-pagechunk-throw-390 | end | 0.1486 | 0.1164 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 9/9 |  |
| travelers-tv-v2-js-throw-390 | end | 0.1006 | 0.0147 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| travelers-tll-trav-v2-js-throw-390 | end | 0.1239 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 1/1 | 4/4 |  |
| travelers-tll-trav-dir-js-throw-390 | end | 0.1239 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 1/1 | 4/4 |  |
| travelers-tll-trav-search-js-throw-390 | end | 0.1234 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 1/1 | 4/4 |  |
| travelers-tll-trav-cms-cards-js-v1-throw-390 | end | 0.1234 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 1/1 | 4/4 |  |
| travelers-reveal404-390 | end | 0.1712 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 5/5 |  |
| travelers-tv-v2-js-throw-1440 | end | 0.0036 | 0.0019 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| travelers-tll-trav-v2-js-throw-1440 | end | 0.1357 | 0.0058 | 0.0041 | 0.0041 | y y y y y y y | tll-fp-title-v1 | 1/1 | 4/4 |  |
| travelers-tll-trav-dir-js-throw-1440 | end | 0.1464 | 0.0058 | 0.0041 | 0.0041 | y y y y y y y | tll-fp-title-v1 | 1/1 | 4/4 |  |
| travelers-tll-trav-search-js-throw-1440 | end | 0.1464 | 0.0058 | 0.0041 | 0.0041 | y y y y y y y | tll-fp-title-v1 | 1/1 | 4/4 |  |
| travelers-tll-trav-cms-cards-js-v1-throw-1440 | end | 0.0858 | 0.0051 | 0.0041 | 0.0041 | y y y y y y y | tll-fp-title-v1 | 1/1 | 4/4 |  |
| travelers-reveal404-1440 | end | 0.1369 | 0.0062 | 0.0041 | 0.0041 | y y y y y y y | tll-fp-title-v1 | 0/0 | 5/5 |  |
| map-tll-map-invite-js-v1-throw-390 | end | 0.0999 | 0.0000 | 0.0000 | 0.0000 | N N y N N N y | - | 1/1 | 4/4 | boxes: 439/440 boxes; docH 7357/7447; marks differ |
| map-tll-map-invite-js-v1-missing-390 | end | 0.0999 | 0.0017 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 4/4 | boxes: 403 lines differ (x or width); docH 7358/7357 |
| map-tll-mp3-passport-js-v1-throw-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | N N y y y y y | - | 1/1 | 4/4 | boxes: 421 lines differ (x or width); docH 7994/7996 |
| map-tll-map-snapshot-v1-throw-390 | end | 0.1630 | 0.0000 | 0.0000 | 0.0000 | N N y y y y y | - | 1/1 | 4/4 | boxes: 403 lines differ (x or width); docH 7449/7447 |
| map-tll-v91-map-clusters-v2-throw-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| map-mapcode404-390 | end | 0.1395 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 7/7 |  |
| map-mapcode-throw-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | N y y y y y y | tll-fp-map-v1 | 1/1 | 4/4 | boxes: 92 lines differ (y or height by 844,854); docH 3327/4181; fp-map-v1 kept |
| map-mapcode-empty-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 | fp-map-v1 let go at 9588 ms |
| map-mapcss404-390 | end | 0.1624 | 0.0000 | 0.0000 | 0.0000 | y N y y y y y | - | 0/0 | 5/5 |  |
| map-mapdata404-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 | fp-map-v1 let go at 9586 ms |
| map-mapembed404-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| map-reveal404-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| map-tll-map-invite-js-v1-throw-1440 | end | 0.1748 | 0.0037 | 0.0000 | 0.0000 | N N y N N N y | - | 1/1 | 4/4 | boxes: 461/462 boxes; docH 5778/5868; marks differ |
| map-tll-map-invite-js-v1-missing-1440 | end | 0.2008 | 0.0048 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 4/4 | boxes: 7 lines differ, names too |
| map-tll-mp3-passport-js-v1-throw-1440 | end | 0.1606 | 0.0114 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| map-tll-map-snapshot-v1-throw-1440 | end | 0.3560 | 0.0035 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| map-tll-v91-map-clusters-v2-throw-1440 | end | 0.1199 | 0.0037 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| map-mapcode404-1440 | end | 0.2904 | 0.0452 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 7/7 |  |
| map-mapcode-throw-1440 | end | 0.0264 | 0.0003 | 0.0000 | 0.0000 | N y y y y y y | tll-fp-map-v1 | 1/1 | 4/4 | boxes: 112 lines differ (y or height by 900,910); docH 2911/3821; fp-map-v1 kept |
| map-mapcode-empty-1440 | end | 0.0433 | 0.0381 | 0.0000 | 0.0373 | y y y y y y y | - | 0/0 | 4/4 | fp-map-v1 let go at 9630 ms |
| map-mapcss404-1440 | end | 0.1140 | 0.0114 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| map-mapdata404-1440 | end | 0.0264 | 0.0276 | 0.0000 | 0.0268 | y y y y y y y | - | 0/0 | 5/5 | fp-map-v1 let go at 9582 ms |
| map-mapembed404-1440 | end | 0.3560 | 0.0114 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| map-reveal404-1440 | end | 0.1062 | 0.0032 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| expats-tll-expats-js-v1-throw-390 | end | 0.0877 | 0.0096 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| expats-tll-expats-js-v1-throw-1440 | end | 0.0391 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| account-tll-a3-account-js-v1-throw-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| account-tll-acct-gate-v2-js-throw-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| account-tll-apc-js-v1-throw-390 | end | 0.0120 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| account-tll-acct-counts-v1-throw-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 3/3 | 4/4 |  |
| account-gateflash404-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| account-tll-a3-account-js-v1-throw-1440 | end | 0.0036 | 0.0037 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| account-tll-acct-gate-v2-js-throw-1440 | end | 0.2972 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| account-tll-apc-js-v1-throw-1440 | end | 0.3007 | 0.0037 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| account-tll-acct-counts-v1-throw-1440 | end | 0.3007 | 0.0037 | 0.0000 | 0.0000 | y y y y y y y | - | 3/3 | 4/4 |  |
| account-gateflash404-1440 | end | 0.3007 | 0.0037 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| submit-tll-form-steps-js-v2-throw-390 | end | 0.1437 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| submit-tll-share-fork-js-v1-throw-390 | end | 0.1437 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| submit-tll-story-extras-js-v1-throw-390 | end | 0.1437 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| submit-gateflash404-390 | end | 0.1437 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| submit-tll-form-steps-js-v2-throw-1440 | end | 0.0554 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| submit-tll-share-fork-js-v1-throw-1440 | end | 0.0552 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| submit-tll-story-extras-js-v1-throw-1440 | end | 0.0552 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| submit-gateflash404-1440 | end | 0.0552 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| profile-tll-pf5-profile-js-v1-throw-390 | end | 0.0046 | 0.0022 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| profile-tll-pf5-n-v1-throw-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| profile-tll-pf5-n-v1-missing-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-tll-pf5-visibility-v1-throw-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| profile-pf3guard404-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| profile-tll-pf5-profile-js-v1-throw-1440 | end | 0.0088 | 0.0297 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| profile-tll-pf5-n-v1-throw-1440 | end | 0.1178 | 0.0008 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| profile-tll-pf5-n-v1-missing-1440 | end | 0.1178 | 0.0019 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-tll-pf5-visibility-v1-throw-1440 | end | 0.1178 | 0.0019 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 4/4 |  |
| profile-pf3guard404-1440 | end | 0.1178 | 0.0019 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 5/5 |  |
| stories-tll-lib-lead-v1-throw-390 | end | 0.0123 | 0.0173 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 8/8 |  |
| stories-tll-lib-lead-v1-missing-390 | end | 0.0199 | 0.0191 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-tll-lib-chips-v1-throw-390 | end | 0.0556 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 8/8 |  |
| stories-tll-lib-search-v4-throw-390 | end | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 8/8 |  |
| stories-tll-s3-stories-js-v1-throw-390 | end | 0.0361 | 0.0061 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 8/8 |  |
| stories-shareyours404-390 | end | 0.0302 | 0.0082 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 9/9 |  |
| stories-gsap404-390 | end | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 9/9 |  |
| stories-tll-lib-lead-v1-throw-1440 | end | 0.0303 | 0.0403 | 0.0000 | 0.0000 | N N y y y N y | - | 1/1 | 8/10 | boxes: 1153/1155 boxes; docH 14743/14993 |
| stories-tll-lib-lead-v1-missing-1440 | end | 0.0919 | 0.0666 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-tll-lib-chips-v1-throw-1440 | end | 0.1359 | 0.0300 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 8/8 |  |
| stories-tll-lib-search-v4-throw-1440 | end | 0.0495 | 0.0311 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 8/8 |  |
| stories-tll-s3-stories-js-v1-throw-1440 | end | 0.1114 | 0.0300 | 0.0000 | 0.0000 | y y y y y y y | - | 1/1 | 8/8 |  |
| stories-shareyours404-1440 | end | 0.1201 | 0.0315 | 0.0000 | 0.0000 | N N y y y N y | - | 0/0 | 14/11 | boxes: 1150/1148 boxes; docH 15594/15330 |
| stories-gsap404-1440 | end | 0.0498 | 0.0311 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 9/9 |  |

## Set jsoff (8 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-jsoff-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 0/0 |  |
| map-jsoff-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 0/0 |  |
| expats-jsoff-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 0/0 |  |
| about-jsoff-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 0/0 |  |
| account-jsoff-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 0/0 |  |
| submit-jsoff-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 0/0 |  |
| profile-jsoff-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 43/43 |  |
| stories-jsoff-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 44/44 |  |

## Set maptall (8 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| map-390x844 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-844x390 | end | 0.0839 | 0.0007 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-768x1024 | end | 0.4418 | 0.0484 | 0.0017 | 0.0017 | N N y y y y y | - | 0/0 | 4/4 | boxes: 7 lines differ, names too |
| map-1024x1366 | end | 0.6472 | 0.0103 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 4/4 | boxes: 17 lines differ, names too |
| map-1440x900 | end | 0.0941 | 0.0114 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-1440x1600 | end | 0.5422 | 0.0079 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 4/4 | boxes: 17 lines differ, names too |
| map-1920x1080 | end | 0.2782 | 0.0106 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 5/5 | boxes: 7 lines differ, names too |
| map-2560x1440 | end | 0.2566 | 0.0025 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 5/5 | boxes: 7 lines differ, names too |

## Set mapuse (3 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| map-use-390 | loaded | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-390 | at-map | 0.2249 | 0.0853 | 0.0853 | 0.0853 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-390 | btn0 | 0.2249 | 0.0853 | 0.0853 | 0.0853 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-390 | btn1 | 0.2249 | 0.0853 | 0.0853 | 0.0853 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-390 | chip0 | 0.2318 | 0.0922 | 0.0922 | 0.0922 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-390 | tap-map | 0.2318 | 0.0922 | 0.0922 | 0.0922 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-390 | bottom | 0.2318 | 0.0922 | 0.0922 | 0.0922 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-1440 | loaded | 0.1083 | 0.0032 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-1440 | at-map | 0.1083 | 0.0032 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-1440 | btn0 | 0.1586 | 0.0535 | 0.0503 | 0.0503 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-1440 | chip0 | 0.1588 | 0.0537 | 0.0505 | 0.0505 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-1440 | chip1 | 0.1589 | 0.0538 | 0.0507 | 0.0506 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-1440 | tap-map | 0.1591 | 0.0540 | 0.0508 | 0.0508 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-1440 | bottom | 0.1591 | 0.0540 | 0.0508 | 0.0508 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-use-768 | loaded | 0.4428 | 0.0484 | 0.0017 | 0.0017 | N N y y y y y | - | 0/0 | 4/4 | boxes: 7 lines differ, names too |
| map-use-768 | at-map | 0.4428 | 0.0484 | 0.0017 | 0.0017 | N N y y y y y | - | 0/0 | 4/4 | boxes: 7 lines differ, names too |
| map-use-768 | btn0 | 0.5471 | 0.1527 | 0.1060 | 0.1060 | N N y y y y y | - | 0/0 | 4/4 | boxes: 7 lines differ, names too |
| map-use-768 | chip0 | 0.5476 | 0.1533 | 0.1065 | 0.1065 | N N y y y y y | - | 0/0 | 4/4 | boxes: 7 lines differ, names too |
| map-use-768 | chip1 | 0.5480 | 0.1537 | 0.1070 | 0.1070 | N N y y y y y | - | 0/0 | 4/4 | boxes: 7 lines differ, names too |
| map-use-768 | tap-map | 0.5485 | 0.1541 | 0.1074 | 0.1074 | N N y y y y y | - | 0/0 | 4/4 | boxes: 7 lines differ, names too |
| map-use-768 | bottom | 0.5485 | 0.1541 | 0.1074 | 0.1074 | N N y y y y y | - | 0/0 | 4/4 | boxes: 7 lines differ, names too |

## Set markup (66 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| trav-noem-390 | end | 0.1001 | 0.0045 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| trav-notitle-390 | end | 0.1154 | 0.0050 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| trav-nochips-390 | end | 0.1234 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| trav-chipword-390 | end | 0.1134 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| trav-list-expats-390 | end | 0.1278 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| trav-list-expats-1440 | end | 0.1404 | 0.0058 | 0.0041 | 0.0041 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| trav-q-390 | end | 0.1134 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| trav-q-1440 | end | 0.3038 | 0.0058 | 0.0041 | 0.0041 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| trav-list-pets-390 | end | 0.2010 | 0.0050 | 0.0479 | 0.0000 | y N y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| trav-list-pets-1440 | end | 0.1389 | 0.0017 | 0.0000 | 0.0000 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| map-hash-passport-390 | end | 2.4828 | 2.1083 | 0.0327 | 0.0327 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-hash-passport-1440 | end | 1.3457 | 0.9844 | 0.0000 | 0.0000 | N y y y y y y | - | 0/0 | 4/4 | boxes: 21 lines differ (y or height by 910); scrollY 840/1750 |
| trav-nosearchwrap-390 | end | 0.1208 | 0.0100 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| trav-newverb-390 | end | 0.1455 | 0.0198 | 0.0349 | 0.0147 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; docH 8317/8358 |
| trav-newverb-1440 | end | 0.3129 | 0.0165 | 0.0148 | 0.0148 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| map-nomount-390 | end | 0.1351 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-nomount-1440 | end | 0.2791 | 0.0076 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-nocounter-390 | end | 0.0403 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-nocounter-1440 | end | 0.2447 | 0.0024 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-noboot-1440 | end | 0.3548 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-nodir-390 | end | 0.0772 | 0.0097 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-nodir-1440 | end | 0.0391 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-nohero-390 | end | 0.0082 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-navplain-390 | end | 0.2476 | 0.1745 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-navplain-1440 | end | 0.0452 | 0.0452 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-navplain-390 | end | 0.0038 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-navplain-1440 | end | 0.0037 | 0.0021 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-nocta-390 | end | 0.0006 | 0.0006 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| stories-nocta-390 | end | 0.0316 | 0.0060 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| pf-off-390 | end | 0.0000 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-unlisted-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-pen-390 | end | 0.0763 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-pen-1440 | end | 0.1049 | 0.0011 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-pen-empty-390 | end | 0.0763 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-first-390 | end | 0.0763 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-contact-off-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-contact-relay-390 | end | 0.0001 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-contact-relay-1440 | end | 0.1178 | 0.0019 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-contact-instagram-390 | end | 0.0831 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-badsnap-390 | end | 0.0640 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-nosnap-390 | end | 0.0640 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-nosnap-1440 | end | 0.1066 | 0.0055 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-noid-390 | end | 0.0763 | 0.0503 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-nolinks-390 | end | 0.0562 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-noflags-390 | end | 0.0703 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-partners-390 | end | 0.0001 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-partners-1440 | end | 0.1364 | 0.0008 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| pf-nophoto-390 | end | 0.0763 | 0.0015 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| st-pick5-390 | end | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-pick5-1440 | end | 0.1140 | 0.0300 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-pick40-390 | end | 0.0361 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-pick40-1440 | end | 0.1114 | 0.0300 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-nopick-390 | end | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-oldfirst-390 | end | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-oldfirst-1440 | end | 0.1127 | 0.0311 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-firsthidden-390 | end | 0.0361 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-firsthidden-1440 | end | 0.0312 | 0.0311 | 0.0000 | 0.0000 | N N y y y N y | - | 0/0 | 10/8 | boxes: 1152/1150 boxes; docH 15459/15222 |
| st-noform-390 | end | 0.0120 | 0.0068 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-noform-1440 | end | 0.0919 | 0.0300 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-nofilters-390 | end | 0.0122 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-notitle-1440 | end | 0.0207 | 0.0043 | 0.0000 | 0.0000 | N N y y y N y | - | 0/0 | 13/10 | boxes: 1149/1147 boxes; docH 15624/15360 |
| st-q-390 | end | 0.4122 | 0.3841 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-1440 | end | 0.2389 | 0.7132 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-none-390 | end | 0.1230 | 0.0990 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-q-none-1440 | end | 0.1229 | 0.0411 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| st-q-two-390 | end | 0.0635 | 0.0364 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |

## Set menu (12 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-menu-390 | open | 0.1162 | 0.0058 | 0.0008 | 0.0008 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; docH 8317/8358 |
| travelers-menu-390 | closed | 0.1300 | 0.0118 | 0.0146 | 0.0067 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| map-menu-390 | open | 0.1404 | 0.0008 | 0.0008 | 0.0008 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-menu-390 | closed | 0.1414 | 0.0018 | 0.0018 | 0.0018 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-menu-390 | open | 0.0781 | 0.0104 | 0.0008 | 0.0008 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-menu-390 | closed | 0.0790 | 0.0114 | 0.0018 | 0.0018 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-menu-390 | open | 0.0253 | 0.0011 | 0.0008 | 0.0008 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-menu-390 | closed | 0.0263 | 0.0021 | 0.0018 | 0.0018 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-menu-390 | open | 0.0127 | 0.0127 | 0.0008 | 0.0008 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-menu-390 | closed | 0.0137 | 0.0137 | 0.0018 | 0.0018 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-menu-390 | open | 0.1587 | 0.0008 | 0.0008 | 0.0008 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-menu-390 | closed | 0.1597 | 0.0018 | 0.0018 | 0.0018 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-menu-390 | open | 0.0771 | 0.0012 | 0.0008 | 0.0008 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-menu-390 | closed | 0.0781 | 0.0022 | 0.0018 | 0.0018 | y y y y y y y | - | 0/0 | 4/4 |  |
| stories-menu-390 | open | 0.0369 | 0.0078 | 0.0008 | 0.0008 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-menu-390 | closed | 0.0379 | 0.0088 | 0.0018 | 0.0018 | y y y y y y y | - | 0/0 | 8/8 |  |
| account-menu-768 | open | 0.0049 | 0.0049 | 0.0007 | 0.0007 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-menu-768 | closed | 0.0057 | 0.0057 | 0.0016 | 0.0016 | y y y y y y y | - | 0/0 | 4/4 |  |
| stories-menu-768 | open | 0.0911 | 0.0314 | 0.0007 | 0.0007 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-menu-768 | closed | 0.0920 | 0.0323 | 0.0016 | 0.0016 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-earlytap-390 | end | 0.0275 | 0.0335 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 | focus on button.tllmm-btn / body |
| account-earlytap-390 | end | 0.3008 | 0.0946 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 6/6 | focus on button.tllmm-btn / body |

## Set reload (19 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-reload-mid-390 | scrolled | 0.1150 | 0.0050 | 0.0000 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 8/8 | boxes: title hold +40 px; docH 8317/8358 |
| travelers-reload-mid-390 | reloaded | 0.3225 | 0.0052 | 0.0479 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 8/8 | boxes: title hold +40 px; docH 8317/8358 |
| travelers-reload-bottom-390 | scrolled | 0.1106 | 0.0050 | 0.0000 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 8/8 | boxes: title hold +40 px; scrollY 7473/7514; docH 8317/8358 |
| travelers-reload-bottom-390 | reloaded | 0.9861 | 0.7626 | 0.0479 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 8/8 | boxes: 207 lines differ (y or height by 40,41,81); scrollY 7433/7514; docH 8317/8358 |
| travelers-reload-mid-1440 | scrolled | 0.1297 | 0.0017 | 0.0000 | 0.0000 | y y y y y y y | tll-fp-title-v1 | 0/0 | 8/8 |  |
| travelers-reload-mid-1440 | reloaded | 0.1060 | 0.0412 | 0.0000 | 0.0000 | y y y y y y y | tll-fp-title-v1 | 0/0 | 8/8 |  |
| map-reload-mid-390 | scrolled | 0.2249 | 0.0853 | 0.0853 | 0.0853 | y y y y y y y | - | 0/0 | 8/8 |  |
| map-reload-mid-390 | reloaded | 2.4231 | 1.3125 | 0.0114 | 0.0114 | N N y y y y y | - | 0/0 | 8/8 | boxes: 85 lines differ, names too; scrollY 1522/1324 |
| map-reload-bottom-390 | scrolled | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/8 |  |
| map-reload-bottom-390 | reloaded | 2.3211 | 1.1338 | 0.0285 | 0.0111 | N N y y y y y | - | 0/0 | 10/8 | boxes: 58 lines differ, names too; scrollY 3912/3109 |
| map-reload-mid-1440 | scrolled | 0.0929 | 0.0114 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| map-reload-mid-1440 | reloaded | 1.9598 | 0.8265 | 0.0000 | 0.0000 | N N N N N N N | - | 0/0 | 8/8 | boxes: 298/462 boxes; scrollY 3928/1502; docH 5351/5868 |
| expats-reload-mid-390 | scrolled | 0.0877 | 0.0096 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| expats-reload-mid-390 | reloaded | 0.4633 | 0.4811 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 8/8 | boxes: 18 lines differ, names too |
| expats-reload-bottom-390 | scrolled | 0.0773 | 0.0096 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| expats-reload-bottom-390 | reloaded | 0.0997 | 1.0168 | 0.0000 | 0.0118 | N y y y y y y | - | 0/0 | 8/8 | boxes: 2 lines differ (y or height by -1); scrollY 6395/6394 |
| about-reload-mid-390 | scrolled | 0.0245 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| about-reload-mid-390 | reloaded | 0.3546 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| about-reload-bottom-390 | scrolled | 0.0246 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| about-reload-bottom-390 | reloaded | 0.1308 | 0.4936 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 8/8 | boxes: 48 lines differ, names too |
| account-reload-mid-390 | scrolled | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| account-reload-mid-390 | reloaded | 0.2510 | 0.2504 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| account-reload-bottom-390 | scrolled | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| account-reload-bottom-390 | reloaded | 0.2504 | 0.2504 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| submit-reload-mid-390 | scrolled | 0.1439 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/9 |  |
| submit-reload-mid-390 | reloaded | 0.2369 | 0.0412 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/9 |  |
| submit-reload-bottom-390 | scrolled | 0.1437 | 0.0002 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 9/9 |  |
| submit-reload-bottom-390 | reloaded | 0.2369 | 0.0414 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 9/9 |  |
| profile-reload-mid-390 | scrolled | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/10 |  |
| profile-reload-mid-390 | reloaded | 1.8140 | 1.0957 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/10 |  |
| profile-reload-bottom-390 | scrolled | 0.4005 | 0.3246 | 0.3242 | 0.3242 | y y y y y y y | - | 0/0 | 8/8 |  |
| profile-reload-bottom-390 | reloaded | 1.4374 | 1.3612 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-reload-mid-390 | scrolled | 0.0344 | 0.0079 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 14/14 |  |
| stories-reload-mid-390 | reloaded | 0.0303 | 0.0095 | 0.0003 | 0.0003 | y y y y y y y | - | 0/0 | 14/14 |  |
| stories-reload-bottom-390 | scrolled | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 28/28 |  |
| stories-reload-bottom-390 | reloaded | 0.0353 | 0.0134 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 28/28 |  |
| stories-reload-mid-1440 | scrolled | 0.1114 | 0.0300 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 23/21 |  |
| stories-reload-mid-1440 | reloaded | 0.0049 | 0.0041 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 23/21 |  |

## Set reload2 (6 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| expats-reload-bottom-390-r1 | scrolled | 0.0877 | 0.0049 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/12 |  |
| expats-reload-bottom-390-r1 | reloaded | 1.1130 | 1.0216 | 0.0118 | 0.0118 | N N y N N N N | - | 0/0 | 8/12 | boxes: 414/417 boxes; scrollY 6395/5523 |
| about-reload-bottom-390-r1 | scrolled | 0.0246 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| about-reload-bottom-390-r1 | reloaded | 0.1530 | 0.5208 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 8/8 | boxes: 41 lines differ, names too; scrollY 4903/5014 |
| expats-reload-bottom-390-r2 | scrolled | 0.0772 | 0.0096 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/12 |  |
| expats-reload-bottom-390-r2 | reloaded | 1.1083 | 1.0216 | 0.0118 | 0.0118 | N N y N N N N | - | 0/0 | 8/12 | boxes: 414/417 boxes; scrollY 6394/5524 |
| about-reload-bottom-390-r2 | scrolled | 0.0439 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| about-reload-bottom-390-r2 | reloaded | 0.1308 | 0.4936 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 8/8 | boxes: 48 lines differ, names too |
| expats-reload-bottom-390-r3 | scrolled | 0.0877 | 0.0049 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 12/12 |  |
| expats-reload-bottom-390-r3 | reloaded | 1.0891 | 1.0168 | 0.0118 | 0.0118 | N N y y y y y | - | 0/0 | 12/12 | boxes: 45 lines differ, names too |
| about-reload-bottom-390-r3 | scrolled | 0.0439 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| about-reload-bottom-390-r3 | reloaded | 0.1550 | 0.4465 | 0.0000 | 0.0000 | N N y y y y y | - | 0/0 | 8/8 | boxes: 48 lines differ, names too |

## Set resize (18 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-rotate-390 | a | 0.1154 | 0.0050 | 0.0000 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; docH 8317/8358 |
| travelers-rotate-390 | b | 0.7552 | 0.6449 | 0.6399 | 0.6399 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-rotate-390 | c | 1.3960 | 1.2856 | 1.2806 | 1.2806 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-resize-1440-768 | a | 0.2872 | 0.0016 | 0.0000 | 0.0000 | y N y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-resize-1440-768 | b | 1.1980 | 0.9383 | 0.9108 | 0.9367 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-resize-1440-768 | c | 1.8768 | 1.6172 | 1.5896 | 1.6155 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| map-rotate-390 | a | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-rotate-390 | b | 0.6767 | 0.5371 | 0.5371 | 0.5371 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-rotate-390 | c | 1.2444 | 1.1048 | 1.1048 | 1.1048 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-resize-1440-768 | a | 0.3560 | 0.0114 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-resize-1440-768 | b | 0.9629 | 0.6183 | 0.6069 | 0.6069 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-resize-1440-768 | c | 1.3896 | 1.0451 | 1.0336 | 1.0336 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-rotate-390 | a | 0.0772 | 0.0097 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-rotate-390 | b | 0.6144 | 0.5469 | 0.5371 | 0.5371 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-rotate-390 | c | 1.1522 | 1.0847 | 1.0750 | 1.0750 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-resize-1440-768 | a | 0.0391 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-resize-1440-768 | b | 0.8411 | 0.8021 | 0.8020 | 0.8020 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-resize-1440-768 | c | 1.4050 | 1.3660 | 1.3659 | 1.3659 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-rotate-390 | a | 0.0246 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-rotate-390 | b | 0.9405 | 0.9163 | 0.9160 | 0.9160 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-rotate-390 | c | 1.4784 | 1.4541 | 1.4538 | 1.4538 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-resize-1440-768 | a | 0.0608 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-resize-1440-768 | b | 0.6209 | 0.5602 | 0.5601 | 0.5601 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-resize-1440-768 | c | 1.0147 | 0.9540 | 0.9539 | 0.9539 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-rotate-390 | a | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-rotate-390 | b | 0.5490 | 0.5490 | 0.5371 | 0.5371 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-rotate-390 | c | 1.0869 | 1.0869 | 1.0750 | 1.0750 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-resize-1440-768 | a | 0.3007 | 0.0037 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-resize-1440-768 | b | 0.6042 | 0.3071 | 0.3034 | 0.3034 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-resize-1440-768 | c | 0.8176 | 0.5205 | 0.5168 | 0.5168 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-rotate-390 | a | 0.1437 | 0.0002 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-rotate-390 | b | 0.6491 | 0.5056 | 0.5054 | 0.5054 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-rotate-390 | c | 1.1552 | 1.0117 | 1.0115 | 1.0115 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-resize-1440-768 | a | 0.0554 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-resize-1440-768 | b | 0.4491 | 0.3939 | 0.3938 | 0.3938 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-resize-1440-768 | c | 0.7117 | 0.6564 | 0.6563 | 0.6563 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-rotate-390 | a | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-rotate-390 | b | 0.6134 | 0.5375 | 0.5371 | 0.5371 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-rotate-390 | c | 1.1513 | 1.0754 | 1.0750 | 1.0750 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-resize-1440-768 | a | 0.1178 | 0.0019 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-resize-1440-768 | b | 0.7370 | 0.6211 | 0.6192 | 0.6192 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-resize-1440-768 | c | 1.1888 | 1.0729 | 1.0710 | 1.0710 | y y y y y y y | - | 0/0 | 4/4 |  |
| stories-rotate-390 | a | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-rotate-390 | b | 0.5655 | 0.5441 | 0.5371 | 0.5371 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-rotate-390 | c | 1.1034 | 1.0819 | 1.0750 | 1.0750 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-resize-1440-768 | a | 0.0312 | 0.0300 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-resize-1440-768 | b | 0.6360 | 0.6347 | 0.6047 | 0.6047 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-resize-1440-768 | c | 1.1537 | 1.1525 | 1.1225 | 1.1225 | y y y y y y y | - | 0/0 | 8/8 |  |
| travelers-resize-1440-500 | a | 0.1312 | 0.0017 | 0.0000 | 0.0000 | y N y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-resize-1440-500 | b | 1.0719 | 0.9682 | 0.9407 | 0.9665 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-resize-1440-500 | c | 1.7508 | 1.6470 | 1.6196 | 1.6453 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| map-resize-1440-390 | a | 0.1148 | 0.0114 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-resize-1440-390 | b | 1.0236 | 0.9202 | 0.9088 | 0.9088 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-resize-1440-390 | c | 1.7064 | 1.6030 | 1.5916 | 1.5916 | y y y y y y y | - | 0/0 | 4/4 |  |

## Set rm (16 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-rm-390 | end | 0.1584 | 0.0045 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| travelers-rm-1440 | end | 0.1578 | 0.0013 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-rm-390 | end | 0.1396 | 0.0000 | 0.0000 | 0.0000 | y N y y y y y | - | 0/0 | 4/4 |  |
| map-rm-1440 | end | 0.3577 | 0.0114 | 0.0000 | 0.0000 | y N y y y y y | - | 0/0 | 4/4 |  |
| expats-rm-390 | end | 0.0772 | 0.0097 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-rm-1440 | end | 0.0391 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-rm-390 | end | 0.0245 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-rm-1440 | end | 0.0615 | 0.0005 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-rm-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-rm-1440 | end | 0.3007 | 0.0037 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-rm-390 | end | 0.0003 | 0.0002 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-rm-1440 | end | 0.0552 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-rm-390 | end | 0.0763 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-rm-1440 | end | 0.1178 | 0.0011 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| stories-rm-390 | end | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
| stories-rm-1440 | end | 0.1114 | 0.0311 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |

## Set signedin (30 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| account-in-fast-390 | end | 0.1918 | 0.1917 | 0.0262 | 0.0262 | y y y y y y y | - | 0/0 | 5/5 |  |
| account-in-late-390 | end | 0.1325 | 0.2304 | 0.1325 | 0.2304 | y y y y y y y | - | 0/0 | 5/5 |  |
| account-in-fast-1440 | end | 0.4147 | 0.1176 | 0.0254 | 0.0254 | y y y y y y y | - | 0/0 | 5/5 |  |
| account-in-late-1440 | end | 0.4207 | 0.1236 | 0.1225 | 0.1225 | y y y y y y y | - | 0/0 | 5/5 |  |
| submit-in-fast-390 | end | 1.0968 | 0.9438 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| submit-in-late-390 | end | 1.0964 | 0.9435 | 0.8813 | 0.8813 | y y y y y y y | - | 0/0 | 1/1 |  |
| submit-in-fast-1440 | end | 0.8635 | 0.7798 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| submit-in-late-1440 | end | 0.8587 | 0.7785 | 0.7028 | 0.7028 | y y y y y y y | - | 0/0 | 1/1 |  |
| travelers-in-fast-390 | end | 0.1137 | 0.0107 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 1/1 |  |
| travelers-in-fast-1440 | end | 0.1469 | 0.0061 | 0.0041 | 0.0041 | y y y y y y y | tll-fp-title-v1 | 0/0 | 1/1 |  |
| map-in-fast-390 | end | 0.0694 | 0.0416 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| map-in-fast-1440 | end | 0.0367 | 0.0369 | 0.0000 | 0.0000 | N N y N y N y | - | 0/0 | 1/1 | boxes: 1 lines differ (x or width) |
| stories-in-fast-390 | end | 0.0275 | 0.0077 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| stories-in-fast-1440 | end | 0.0505 | 0.0309 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| profile-in-fast-390 | end | 0.0771 | 0.0012 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| profile-in-fast-1440 | end | 0.1188 | 0.0018 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| about-in-fast-390 | end | 0.0447 | 0.0010 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| about-in-fast-1440 | end | 0.0618 | 0.0011 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| expats-in-fast-390 | end | 0.0780 | 0.0057 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| expats-in-fast-1440 | end | 0.0401 | 0.0011 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| account-in-hash-settings-390 | end | 0.1917 | 0.1917 | 0.0262 | 0.0262 | y y y y y y y | - | 0/0 | 5/5 |  |
| account-in-hash-settings-1440 | end | 0.6261 | 0.4291 | 0.1419 | 0.1419 | y y y y y y y | - | 0/0 | 5/5 |  |
| account-in-fast-cut-390 | end | 0.4003 | 0.3998 | 0.0262 | 0.0262 | y y y y y y y | - | 0/0 | 5/5 |  |
| account-in-late-cut-390 | end | 0.4337 | 0.4332 | 0.1637 | 0.1637 | y y y y y y y | - | 0/0 | 5/5 |  |
| account-in-fast-cut-1440 | end | 0.7883 | 0.0000 | 0.0254 | 0.0000 | N N N y y y y | - | 0/0 | 5/5 | boxes: 62 lines differ (y or height by -8) |
| account-in-late-cut-1440 | end | 0.7844 | 0.7844 | 0.0829 | 0.0829 | y y y y y y y | - | 0/0 | 5/5 |  |
| submit-in-fast-cut-390 | end | 0.0004 | 0.1088 | 0.0000 | 0.0000 | N N N y y y y | - | 0/0 | 1/1 | boxes: 60 lines differ (y or height by 8) |
| submit-in-late-cut-390 | end | 1.1133 | 1.0129 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| submit-in-fast-cut-1440 | end | 0.0440 | 0.0430 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| submit-in-late-cut-1440 | end | 1.0504 | 0.9620 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |

## Set signedin2 (6 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| account-in-fast-cut-1440-r1 | end | 0.7883 | 0.7837 | 0.0254 | 0.0254 | y y y y y y y | - | 0/0 | 5/5 |  |
| submit-in-fast-cut-390-r1 | end | 0.1092 | 0.1088 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| account-in-fast-cut-1440-r2 | end | 0.7883 | 0.7837 | 0.0254 | 0.0254 | y y y y y y y | - | 0/0 | 5/5 |  |
| submit-in-fast-cut-390-r2 | end | 0.1093 | 0.1088 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |
| account-in-fast-cut-1440-r3 | end | 0.7883 | 0.7837 | 0.0254 | 0.0254 | y y y y y y y | - | 0/0 | 5/5 |  |
| submit-in-fast-cut-390-r3 | end | 0.1093 | 0.1088 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 1/1 |  |

## Set slow (40 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-even-390 | end | 0.1254 | 0.0120 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-cut1-390 | end | 0.1242 | 0.0120 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-cut2-390 | end | 0.1149 | 0.0120 | 0.0128 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-even-1440 | end | 0.0975 | 0.0080 | 0.0041 | 0.0041 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-cut1-1440 | end | 0.0975 | 0.0059 | 0.0041 | 0.0041 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| map-even-390 | end | 0.1648 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-cut1-390 | end | 0.2058 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-cut2-390 | end | 0.1641 | 0.0000 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-even-1440 | end | 0.1246 | 0.0125 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| map-cut1-1440 | end | 0.1150 | 0.0125 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-even-390 | end | 0.1012 | 0.0096 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-cut1-390 | end | 0.0877 | 0.0097 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-cut2-390 | end | 0.1012 | 0.0096 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-even-1440 | end | 0.0400 | 0.0007 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-cut1-1440 | end | 0.0400 | 0.0005 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-even-390 | end | 0.0246 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-cut1-390 | end | 0.0246 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-cut2-390 | end | 0.0249 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-even-1440 | end | 0.0364 | 0.0006 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-cut1-1440 | end | 0.0365 | 0.0006 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-even-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-cut1-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-cut2-390 | end | 0.0119 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-even-1440 | end | 0.3043 | 0.0035 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-cut1-1440 | end | 0.3019 | 0.0035 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-even-390 | end | 0.1413 | 0.0002 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-cut1-390 | end | 0.1413 | 0.0002 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-cut2-390 | end | 0.1413 | 0.0003 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-even-1440 | end | 0.0541 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-cut1-1440 | end | 0.0541 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-even-390 | end | 0.0796 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-cut1-390 | end | 0.0797 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-cut2-390 | end | 0.0796 | 0.0004 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-even-1440 | end | 0.1224 | 0.0019 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-cut1-1440 | end | 0.1224 | 0.0011 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| stories-even-390 | end | 0.0274 | 0.0078 | 0.0000 | 0.0002 | y y y y y y y | - | 0/0 | 10/10 |  |
| stories-cut1-390 | end | 0.0274 | 0.0069 | 0.0000 | 0.0002 | y N y y y y y | - | 0/0 | 10/10 |  |
| stories-cut2-390 | end | 0.0274 | 0.0078 | 0.0000 | 0.0000 | y N y y y y y | - | 0/0 | 10/10 |  |
| stories-even-1440 | end | 0.0667 | 0.0305 | 0.0000 | 0.0000 | y N y y y y y | - | 0/0 | 10/10 |  |
| stories-cut1-1440 | end | 0.0657 | 0.0300 | 0.0000 | 0.0000 | y N y y y y y | - | 0/0 | 10/10 |  |

## Set storiesuse (3 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| stories-chips-390 | loaded | 0.0284 | 0.0070 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 12/12 |  |
| stories-chips-390 | place-Africa | 0.0310 | 0.0095 | 0.0026 | 0.0026 | y y y y y y y | - | 0/0 | 12/12 |  |
| stories-chips-390 | place-Antarctica | 0.0396 | 0.0181 | 0.0112 | 0.0112 | y y y y y y y | - | 0/0 | 12/12 |  |
| stories-chips-390 | place-all | 0.2929 | 0.2715 | 0.2645 | 0.2645 | y y y y y y y | - | 0/0 | 12/12 |  |
| stories-chips-1440 | loaded | 0.0498 | 0.0300 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 14/14 |  |
| stories-chips-1440 | place-Africa | 0.0788 | 0.0589 | 0.0290 | 0.0290 | y y y y y y y | - | 0/0 | 14/14 |  |
| stories-chips-1440 | place-Antarctica | 0.0999 | 0.0800 | 0.0500 | 0.0500 | y y y y y y y | - | 0/0 | 14/14 |  |
| stories-chips-1440 | place-all | 0.4064 | 0.3865 | 0.3565 | 0.3565 | y y y y y y y | - | 0/0 | 14/14 |  |
| stories-chips-q-1440 | loaded | 0.0503 | 0.0308 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 14/14 |  |
| stories-chips-q-1440 | place-Africa | 0.0793 | 0.0597 | 0.0290 | 0.0290 | y y y y y y y | - | 0/0 | 14/14 |  |
| stories-chips-q-1440 | place-Antarctica | 0.1003 | 0.0809 | 0.0500 | 0.0500 | y y y y y y y | - | 0/0 | 14/14 |  |
| stories-chips-q-1440 | place-all | 0.4068 | 0.3874 | 0.3565 | 0.3565 | y y y y y y y | - | 0/0 | 14/14 |  |

## Set stq2 (12 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| st-q-1440-r1 | end | 0.3590 | 0.1197 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-1440-r2 | end | 0.1770 | 0.1197 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-1440-r3 | end | 0.1773 | 0.1197 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-1440-r4 | end | 0.2310 | 0.7132 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-1440-r5 | end | 0.2389 | 0.7124 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-1440-r6 | end | 0.1691 | 0.1189 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-1440-r7 | end | 0.7661 | 0.7132 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-1440-r8 | end | 0.1694 | 0.1197 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-390-r1 | end | 0.4122 | 0.3841 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-390-r2 | end | 0.4122 | 0.3841 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-390-r3 | end | 0.4122 | 0.3841 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |
| st-q-390-r4 | end | 0.4199 | 0.3841 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 10/10 |  |

## Set trav10 (8 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-10s-320-1 | end | 0.1695 | 0.1514 | 0.0000 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; docH 7773/7813 |
| travelers-10s-320-2 | end | 0.1684 | 0.1514 | 0.0000 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; docH 7773/7813 |
| travelers-10s-390-1 | end | 0.1328 | 0.0188 | 0.0327 | 0.0138 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; docH 8317/8358 |
| travelers-10s-390-2 | end | 0.1333 | 0.0188 | 0.0327 | 0.0138 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; docH 8317/8358 |
| travelers-10s-768-1 | end | 0.2621 | 0.0077 | 0.0049 | 0.0049 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-10s-768-2 | end | 0.2708 | 0.0077 | 0.0049 | 0.0049 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-10s-1440-1 | end | 0.0170 | 0.0150 | 0.0133 | 0.0133 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-10s-1440-2 | end | 0.0170 | 0.0150 | 0.0133 | 0.0133 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |

## Set travuse (3 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-use-390 | q-den | 0.1150 | 0.0050 | 0.0000 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; scrollY 28/69; docH 3385/3425 |
| travelers-use-390 | q-none | 0.1293 | 0.0100 | 0.0144 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | scrollY 28/69 |
| travelers-use-390 | q-clear | 0.1293 | 0.0100 | 0.0144 | 0.0050 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-390 | chip-expats | 0.3317 | 0.2123 | 0.2167 | 0.2073 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-390 | chip-creators | 0.3317 | 0.2124 | 0.2168 | 0.2073 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-390 | chip-press | 0.3317 | 0.2124 | 0.2168 | 0.2073 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-390 | chip-everyone | 0.6051 | 0.4288 | 0.4902 | 0.4238 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; docH 8317/8358 |
| travelers-use-1440 | q-den | 0.1467 | 0.0026 | 0.0010 | 0.0010 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-1440 | q-none | 0.1509 | 0.0067 | 0.0051 | 0.0051 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-1440 | q-clear | 0.1518 | 0.0077 | 0.0061 | 0.0061 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-1440 | chip-expats | 0.1518 | 0.0077 | 0.0061 | 0.0061 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-1440 | chip-creators | 0.1519 | 0.0077 | 0.0061 | 0.0061 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-1440 | chip-press | 0.1519 | 0.0077 | 0.0061 | 0.0061 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-1440 | chip-everyone | 0.3020 | 0.1579 | 0.1563 | 0.1563 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-320 | q-den | 0.1691 | 0.1514 | 0.0000 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; scrollY 390/430; docH 3467/3508 |
| travelers-use-320 | q-none | 0.2003 | 0.1620 | 0.0311 | 0.0107 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | scrollY 390/430 |
| travelers-use-320 | q-clear | 0.2003 | 0.1620 | 0.0311 | 0.0107 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-320 | chip-expats | 0.3473 | 0.3090 | 0.1781 | 0.1577 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-320 | chip-creators | 0.3474 | 0.3092 | 0.1783 | 0.1578 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-320 | chip-press | 0.3474 | 0.3092 | 0.1783 | 0.1578 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |
| travelers-use-320 | chip-everyone | 0.5125 | 0.4743 | 0.3433 | 0.3229 | y y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 |  |

## Set w320 (8 scenarios)

| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |
|---|---|---|---|---|---|---|---|---|---|---|
| travelers-320 | end | 0.1695 | 0.1514 | 0.0000 | 0.0000 | N y y y y y y | tll-fp-title-v1 | 0/0 | 4/4 | boxes: title hold +40 px; docH 7773/7813 |
| map-320 | end | 0.0056 | 0.0012 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| expats-320 | end | 0.0044 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| about-320 | end | 0.0051 | 0.0006 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| account-320 | end | 0.0120 | 0.0119 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| submit-320 | end | 0.2093 | 0.0005 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| profile-320 | end | 0.0044 | 0.0001 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 4/4 |  |
| stories-320 | end | 0.0758 | 0.0145 | 0.0000 | 0.0000 | y y y y y y y | - | 0/0 | 8/8 |  |
