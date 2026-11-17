# Layout shift sweep, part B: the smaller sets (16 November 2026)

Same harness and rules as the tables in fix.md. Control = live 16.66.0 core routed from a local copy, new = the 16.67.0 core (parts A and B). CLS counts every entry. One load a cell and core unless a count is given.

## The finished page: boxes, body tree, head, image files

Boxes: every laid-out box at the end of the load (position and size). Body tree: tags, attributes and text of everything in the body (script and iframe tags by name only). Head: the list of the head's children. Images: the image files asked for during the load.

| cell | boxes equal | body tree equal | head equal | html classes equal | images: control / new / only new | control CLS | new CLS |
|---|---|---|---|---|---|---|---|
| /account 390 | yes | yes | yes | yes | 0 / 0 / 0 | 0.0119 | 0.0119 |
| /account 1440 | yes | yes | yes | yes | 0 / 0 / 0 | 0.3007 | 0.0037 |
| /submit 390 | yes | yes | yes | yes | 0 / 0 / 0 | 0.1437 | 0.0003 |
| /submit 1440 | yes | yes | yes | yes | 0 / 0 / 0 | 0.0552 | 0.0004 |
| /contributors/<profile> 390 | no | no | yes | yes | 20 / 19 / 0 | 0.0807 | 0.0004 |
| /contributors/<profile> 1440 | yes | yes | yes | yes | 26 / 26 / 0 | 0.1180 | 0.0008 |
| /stories 390 | yes | yes | yes | yes | 56 / 56 / 0 | 0.0284 | 0.0073 |
| /stories 1440 | yes | yes | yes | yes | 72 / 70 / 0 | 0.0316 | 0.0311 |
| / 390 | yes | yes | yes | yes | 7 / 7 / 0 | 0.0034 | 0.0000 |
| / 1440 | yes | yes | yes | yes | 16 / 16 / 0 | 0.0005 | 0.0005 |
| story: Balkans 360 | yes | yes | yes | yes | 6 / 6 / 0 | 0.0196 | 0.0043 |
| story: Balkans 390 | yes | no | yes | yes | 6 / 6 / 0 | 0.0034 | 0.0000 |
| story: Balkans 1440 | yes | yes | yes | yes | 6 / 6 / 0 | 0.0001 | 0.0001 |
| story: Lisbon 360 | yes | no | yes | yes | 3 / 3 / 0 | 0.0041 | 0.0001 |
| story: Lisbon 390 | yes | yes | yes | yes | 3 / 3 / 0 | 0.0038 | 0.0006 |
| story: Lisbon 1440 | yes | yes | yes | yes | 4 / 4 / 0 | 0.0001 | 0.0001 |
| story: Southern Africa 360 | yes | yes | yes | yes | 6 / 6 / 0 | 0.0041 | 0.0001 |
| story: Southern Africa 390 | yes | yes | yes | yes | 6 / 6 / 0 | 0.0057 | 0.0002 |
| story: Southern Africa 1440 | yes | yes | yes | yes | 7 / 7 / 0 | 0.0001 | 0.0001 |
| /travelers 390 | yes | yes | no | yes | 23 / 23 / 0 | 0.1234 | 0.0100 |
| /travelers 1440 | yes | yes | no | yes | 26 / 26 / 0 | 0.3022 | 0.0058 |
| /the-map 390 | yes | yes | yes | yes | 1 / 1 / 0 | 0.1396 | 0.0000 |
| /the-map 1440 | yes | yes | yes | yes | 1 / 1 / 0 | 0.0980 | 0.0037 |
| /for-expats 390 | yes | yes | yes | yes | 7 / 7 / 0 | 0.0877 | 0.0049 |
| /for-expats 1440 | yes | yes | yes | yes | 8 / 8 / 0 | 0.0395 | 0.0004 |
| /about 390 | yes | yes | yes | yes | 2 / 2 / 0 | 0.0457 | 0.0003 |
| /about 1440 | yes | yes | yes | yes | 4 / 4 / 0 | 0.0572 | 0.0006 |
| /layovers 390 | yes | yes | yes | yes | 0 / 0 / 0 | 0.0180 | 0.0147 |
| /layovers 1440 | yes | yes | yes | yes | 0 / 0 / 0 | 0.0146 | 0.0146 |
| /the-paw-passport 390 | yes | yes | yes | yes | 2 / 2 / 0 | 0.0320 | 0.0188 |
| /the-paw-passport 1440 | yes | yes | yes | yes | 2 / 2 / 0 | 0.0080 | 0.0080 |
| /cookies 390 | yes | yes | yes | yes | 0 / 0 / 0 | 0.0034 | 0.0000 |
| /cookies 1440 | yes | yes | yes | yes | 0 / 0 / 0 | 0.0004 | 0.0001 |
| /login 390 | yes | yes | yes | yes | 0 / 0 / 0 | 0.0090 | 0.0057 |
| /login 1440 | yes | yes | yes | yes | 0 / 0 / 0 | 0.0085 | 0.0024 |
| /signup 390 | yes | yes | yes | yes | 0 / 0 / 0 | 0.0109 | 0.0076 |
| /signup 1440 | yes | yes | yes | yes | 0 / 0 / 0 | 0.0002 | 0.0018 |

The html element: its classes are compared without the font loader's wf-* classes. Its `data-tll-floor` attribute is a counter the site's type floor script leaves (how many sizes it wrote in its last pass); it differs in these cells (control / new): /account 390: 1 / 6; /contributors/<profile> 390: 16 / 1; /the-map 390: 4 / 3; /the-map 1440: 4 / 3.

### Four more loads a cell and core, for the three cells where one control load differed above (and home)

In those three control loads the site's own type floor or touch target script had written one more inline size (a font size of 12px on album labels; a padding of 0.0002 to 0.0005 px on three links). Core of bdc6d21.

| cell | loads control / new | box lists seen | body trees seen | control CLS | new CLS |
|---|---|---|---|---|---|
| /contributors/<profile> 390 | 4 / 4 | 1 | 1 | 0.0763 | 0.0004 |
| / 390 | 4 / 4 | 1 | 1 | 0.0034 | 0.0000 |
| story: Balkans 390 | 4 / 4 | 1 | 1 | 0.0034 | 0.0000 |
| story: Lisbon 360 | 4 / 4 | 1 | 1 | 0.0041 | 0.0001 |

## Parser held for 350 ms at one point of the page (a paint lands there)

| point | width | control | new | boxes equal | body tree equal | html classes equal |
|---|---|---|---|---|---|---|
| /stories, after the hero, before the filter row | 390 | 0.0267 | 0.0062 | yes | yes | yes |
| /stories, after the hero, before the filter row | 1440 | 0.0398 | 0.0203 | yes | yes | yes |
| /stories, after the search bar, before the grid | 390 | 0.0284 | 0.0073 | yes | yes | yes |
| /stories, after the search bar, before the grid | 1440 | 0.0452 | 0.0263 | yes | yes | yes |
| /stories, inside the first card, after its place line (3 loads a core, median) | 390 | 0.0284 | 0.0073 | yes | yes | yes |
| /stories, inside the first card, after its place line (3 loads a core, median) | 1440 | 0.0495 | 0.0300 | yes | yes | yes |
| /stories, inside the grid after the third card | 390 | 0.0274 | 0.0073 | yes | yes | yes |
| /stories, inside the grid after the third card | 1440 | 0.0495 | 0.0300 | yes | yes | yes |
| /stories, inside the grid after card 30 | 390 | 0.0284 | 0.0073 | yes | yes | yes |
| /stories, inside the grid after card 30 | 1440 | 0.0495 | 0.0300 | yes | yes | yes |
| /stories, after the page, before the page scripts | 390 | 0.0294 | 0.0073 | yes | yes | yes |
| /stories, after the page, before the page scripts | 1440 | 0.0931 | 0.0300 | yes | yes | yes |
| profile, inside the hero before the text column | 390 | 0.1294 | 0.0571 | yes | yes | yes |
| profile, inside the hero before the text column | 1440 | 0.1556 | 0.1021 | yes | yes | yes |
| profile, after the hero | 390 | 0.0763 | 0.0004 | yes | yes | yes |
| profile, after the hero | 1440 | 0.1178 | 0.0017 | yes | yes | yes |
| profile, before the story list | 390 | 0.0763 | 0.0004 | yes | yes | yes |
| profile, before the story list | 1440 | 0.1178 | 0.0018 | yes | yes | yes |
| /account, after the nav | 390 | 0.2612 | 0.0938 | yes | yes | yes |
| /account, after the nav | 1440 | 0.0694 | 0.0185 | yes | yes | yes |
| /submit, after the nav | 390 | 0.1439 | 0.0000 | yes | yes | yes |
| /submit, after the nav | 1440 | 0.0552 | 0.0001 | yes | yes | yes |

## Failure cases, control against new

What counts here is the finished page: with the page code broken it has to end as it does with the control. The CLS of a broken page is given for the record.

| case | page | width | control CLS | new CLS | boxes equal | body tree equal | head equal | html classes equal |
|---|---|---|---|---|---|---|---|---|
| site head script tll-proto-parity-js-v1 throws when it starts | /account | 390 | 0.0000 | 0.0000 | yes | yes | yes | yes |
| site head script tll-proto-parity-js-v1 throws when it starts | /account | 1440 | 0.0166 | 0.0001 | yes | yes | yes | yes |
| site head script tll-proto-parity-js-v1 throws when it starts | /submit | 390 | 0.0000 | 0.1410 | yes | yes | yes | yes |
| site head script tll-proto-parity-js-v1 throws when it starts | /submit | 1440 | 0.0000 | 0.0538 | yes | yes | yes | yes |
| site head script tll-proto-parity-js-v1 not on the page | /account | 390 | 0.0000 | 0.0000 | yes | yes | yes | yes |
| site head script tll-proto-parity-js-v1 not on the page | /account | 1440 | 0.0166 | 0.0166 | yes | yes | yes | yes |
| site head script tll-proto-parity-js-v1 not on the page | /submit | 390 | 0.0142 | 0.0000 | yes | yes | yes | yes |
| site head script tll-proto-parity-js-v1 not on the page | /submit | 1440 | 0.0002 | 0.0002 | yes | yes | yes | yes |
| site head script tll-mobile-nav-js-v1 throws when it starts | /submit | 390 | 0.1439 | 0.0002 | yes | yes | yes | yes |
| site head script tll-mobile-nav-js-v1 not on the page | /stories | 390 | 0.0318 | 0.0073 | yes | yes | yes | yes |
| /stories script tll-lib-lead-v1 throws when it starts | /stories | 390 | 0.0123 | 0.0177 | yes | yes | yes | yes |
| /stories script tll-lib-lead-v1 throws when it starts | /stories | 1440 | 0.0919 | 0.0403 | no | no | yes | yes |
| /stories script tll-lib-lead-v1 not on the page | /stories | 390 | 0.0123 | 0.0195 | yes | yes | yes | yes |
| /stories script tll-lib-lead-v1 not on the page | /stories | 1440 | 0.0304 | 0.0666 | yes | yes | yes | yes |
| /stories script tll-lib-chips-v1 not on the page | /stories | 390 | 0.0633 | 0.0073 | yes | yes | yes | yes |
| /stories script tll-lib-chips-v1 not on the page | /stories | 1440 | 0.1356 | 0.0300 | yes | yes | yes | yes |
| our stories chunk does not load | /stories | 390 | 0.1485 | 0.1168 | yes | yes | yes | yes |
| our stories chunk does not load | /stories | 1440 | 0.0931 | 0.0599 | yes | yes | yes | yes |
| profile script tll-pf5-profile-js-v1 throws when it starts | /contributors/<profile> | 390 | 0.0046 | 0.0022 | yes | yes | yes | yes |
| profile script tll-pf5-profile-js-v1 throws when it starts | /contributors/<profile> | 1440 | 0.0088 | 0.0289 | yes | yes | yes | yes |
| profile script tll-pf5-profile-js-v1 not on the page | /contributors/<profile> | 390 | 0.0046 | 0.0022 | yes | yes | yes | yes |
| profile script tll-pf5-profile-js-v1 not on the page | /contributors/<profile> | 1440 | 0.0088 | 0.0286 | yes | yes | yes | yes |
| profile notes embed tll-pf5-n-v1 not on the page | /contributors/<profile> | 1440 | 0.1178 | 0.0019 | yes | yes | yes | yes |

## Other screen sizes

| page | screen | control | new | boxes equal |
|---|---|---|---|---|
| /account | 360x800 | 0.0077 | 0.0077 | yes |
| /account | 390x1100 | 0.0070 | 0.0070 | yes |
| /account | 412x915 | 0.0085 | 0.0085 | yes |
| /account | 768x1024 | 0.0042 | 0.0041 | yes |
| /account | 1440x1200 | 0.2999 | 0.0027 | yes |
| /submit | 360x800 | 0.1516 | 0.0003 | yes |
| /submit | 390x1100 | 0.1816 | 0.0046 | yes |
| /submit | 412x915 | 0.1974 | 0.0496 | yes |
| /submit | 768x1024 | 0.1375 | 0.0070 | yes |
| /submit | 1440x1200 | 0.0921 | 0.0056 | yes |
| /contributors/<profile> | 360x800 | 0.0111 | 0.0004 | yes |
| /contributors/<profile> | 390x1100 | 0.1505 | 0.0056 | yes |
| /contributors/<profile> | 412x915 | 0.0861 | 0.0009 | yes |
| /contributors/<profile> | 768x1024 | 0.3342 | 0.0081 | yes |
| /contributors/<profile> | 1440x1200 | 0.1824 | 0.0387 | yes |
| /stories | 360x800 | 0.0402 | 0.0081 | yes |
| /stories | 390x1100 | 0.0180 | 0.0084 | yes |
| /stories | 412x915 | 0.1174 | 0.0993 | yes |
| /stories | 768x1024 | 0.0311 | 0.0312 | no |
| /stories | 1440x1200 | 0.0427 | 0.0291 | no |

## The page as a member's browser has it when the page is parsed (/account, /submit)

Read on the page right after its own page-parsed listeners have run (`var/init-a3.js`): the Account 3.0 class on `html`, the tab rail, its tabs and panel headings, where the nav is, and a hash of the markup of the members wrapper (scripts, styles and frames emptied). The lab is signed out, so this is the dashboard markup before Memberstack takes it away; a signed-in member keeps it. Final core against control.

| page | width | load | html.a3-on control / new | tab rail | tabs | panel headings | nav parent | wrapper markup equal | layer's style or mark left |
|---|---|---|---|---|---|---|---|---|---|
| /account | 390 | standard | 1 / 1 | 1 / 1 | 7 / 7 | 6 / 6 | tll-account-wrap / tll-account-wrap | yes | no |
| /account | 390 | stress | 1 / 1 | 1 / 1 | 7 / 7 | 6 / 6 | tll-account-wrap / tll-account-wrap | yes | no |
| /account | 1440 | standard | 1 / 1 | 1 / 1 | 7 / 7 | 6 / 6 | tll-account-wrap / tll-account-wrap | yes | no |
| /account | 1440 | stress | 1 / 1 | 1 / 1 | 7 / 7 | 6 / 6 | tll-account-wrap / tll-account-wrap | yes | no |
| /submit | 390 | standard | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | tll-share-wrap / tll-share-wrap | yes | no |
| /submit | 390 | stress | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | tll-share-wrap / tll-share-wrap | yes | no |
| /submit | 1440 | standard | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | tll-share-wrap / tll-share-wrap | yes | no |
| /submit | 1440 | stress | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | tll-share-wrap / tll-share-wrap | yes | no |

## /stories with uncached card photos answered by a local picture instead of aborted

The three cells whose box lists differ above by cards with the no-photo panel. Core 951b08c (the /stories code of the final core).

| screen | page code | boxes equal | body tree equal | pictures answered locally: control / new |
|---|---|---|---|---|
| 768x1024 | as served | yes | yes | 13 / 12 |
| 1440x900 | tll-lib-lead-v1 throws | yes | yes | 0 / 1 |
| 1440x1200 | as served | yes | yes | 3 / 1 |

