# Layout shift sweep, part A: the smaller sets (16 November 2026)

Same harness and rules as the tables in fix.md. Control = live 16.66.0 core routed from a local copy, new = the 16.67.0 core. CLS counts every entry.

## Parser held for 350 ms at one point of the page (a paint lands there), one load each

| point | width | control | new | boxes equal |
|---|---|---|---|---|
| /travelers, inside the hero before the eyebrow | 390 | 0.1693 | 0.0635 | no |
| /travelers, inside the hero before the eyebrow | 1440 | 0.2824 | 0.0348 | yes |
| /travelers, inside the hero before the lede | 390 | 0.1704 | 0.0487 | no |
| /travelers, inside the hero before the lede | 1440 | 0.2869 | 0.0353 | yes |
| /travelers, before the chip row | 390 | 0.1698 | 0.0488 | no |
| /travelers, before the chip row | 1440 | 0.2868 | 0.0353 | yes |
| /the-map, inside the hero before the eyebrow | 390 | 0.1860 | 0.0034 | yes |
| /the-map, inside the hero before the eyebrow | 1440 | 0.0980 | 0.0032 | yes |
| /the-map, inside the hero before the counter | 390 | 0.1394 | 0.0034 | yes |
| /the-map, inside the hero before the counter | 1440 | 0.0987 | 0.0037 | yes |
| /the-map, after the map mount, before the legend | 390 | 0.4644 | 0.0034 | no |
| /the-map, after the map mount, before the legend | 1440 | 0.0490 | 0.0118 | yes |
| /for-expats, inside the hero before the buttons | 390 | 0.0773 | 0.0034 | yes |
| /for-expats, inside the hero before the buttons | 1440 | 0.0401 | 0.0280 | yes |
| /for-expats, after the hero | 390 | 0.0821 | 0.0131 | yes |
| /for-expats, after the hero | 1440 | 0.0415 | 0.0003 | yes |
| /about, inside the hero before the intro | 390 | 0.0510 | 0.0036 | yes |
| /about, inside the hero before the intro | 1440 | 0.0365 | 0.0007 | yes |
| /about, after the hero | 390 | 0.0754 | 0.0036 | yes |
| /about, after the hero | 1440 | 0.0007 | 0.0007 | yes |

Boxes not equal: the three /travelers rows at 390 are the title hold (title 121 px against 81 px while a short verb shows, everything under it 40 px lower). In the /the-map row at 390 the control's map ended 167 px taller in that one load (the map's own state; the new core ended as in every other load).

## Failure cases, control against new

| case | width | loads | control CLS | new CLS | boxes equal | body tree equal |
|---|---|---|---|---|---|---|
| /travelers page script throws when it starts | 390 | 1 + 1 | 0.1001 | 0.0187 | yes | yes |
| /travelers page script throws when it starts | 1440 | 1 + 1 | 0.2998 | 0.0012 | yes | yes |
| /travelers page script throws before it writes a verb | 390 | 1 + 1 | 0.1006 | 0.0187 | yes | yes |
| /travelers page script throws before it writes a verb | 1440 | 1 + 1 | 0.1381 | 0.0016 | yes | yes |
| /travelers chunk does not load | 390 | 1 + 1 | 0.1234 | 0.0142 | yes | yes |
| /travelers chunk does not load | 1440 | 1 + 1 | 0.0896 | 0.0058 | yes | yes |
| /travelers with reduced motion | 390 | 1 + 1 | 0.1435 | 0.0087 | yes | yes |
| /travelers with reduced motion | 1440 | 1 + 1 | 0.1371 | 0.0021 | yes | yes |
| /the-map map code does not load | 390 | 1 + 1 | 0.1396 | 0.0034 | yes | yes |
| /the-map map code does not load | 1440 | 1 + 1 | 0.0256 | 0.0452 | yes | yes |
| /the-map without the invite script | 390 | 1 + 1 | 0.0992 | 0.0050 | yes | yes |
| /the-map without the invite script | 1440 | 1 + 1 | 0.1789 | 0.0183 | no | no |

The one "no": without the invite script the control's hero is 91 px shorter, its passport block was inside the screen when the page was parsed and got no reveal class; with the map held one screen tall it starts below the screen and carries the class until scrolled to (8 px offset and fade). The four page errors per core are the two thrown on purpose.

## Other screen sizes, one load each

| page | screen | control | new |
|---|---|---|---|
| /the-map | 412x915 | 0.1533 | 0.0046 |
| /the-map | 768x1024 | 0.4418 | 0.1224 |
| /the-map | 1440x1200 | 0.4206 | 0.0067 |
| /travelers | 390x1100 | 0.1606 | 0.0114 |
| /travelers | 412x915 | 0.1240 | 0.0133 |
| /travelers | 768x1024 | 0.3483 | 0.0761 |
| /travelers | 1440x1200 | 0.1027 | 0.0038 |

At 768 px the Menu button makes the header 8 px taller when the page is parsed (0.074, cause C9, part B). The rest on /the-map at 768x1024 is the map's own bar moving 111 px inside the mount when its note comes in (0.037) and the status line going (0.010).

## /the-map 1440, the title and its two font files

| set | control | new |
|---|---|---|
| standard, 6 more loads each | 0.0928, 0.0935, 0.0951, 0.0980, 0.0980, 0.1003 | 0.0032, 0.0032, 0.0037, 0.0037, 0.0037, 0.0110 |
| with a per-frame trace of the title, 6 loads each | 0.0928, 0.0928, 0.0980, 0.0980, 0.3509, 0.3628 | 0.0032, 0.0032, 0.0032, 0.0032, 0.0110, 0.0110 |
| web fonts blocked, 5 loads each | 0.0927, 0.0979, 0.0979, 0.0979, 0.0979 | 0.0028, 0.0106, 0.0106, 0.0106, 0.0106 |

A value near 0.35 is a load with the one-file state of the title (page under the title up or down 83 px). The other control values are the hero growing when the page is parsed (0.023), the map pushing the passport block away (0.064) and the map's own bar (0.008).

## CPU 4x, 5 more loads a cell (first paint)

| cell | FCP control (ms, sorted) | FCP new | median control / new | CLS median control / new |
|---|---|---|---|---|
| /about 1440 | 328, 400, 420, 448, 460 | 356, 412, 440, 444, 464 | 420 / 440 | 0.0365 / 0.0007 |
| /for-expats 390 | 416, 416, 416, 428, 492 | 368, 380, 396, 400, 444 | 416 / 396 | 0.0878 / 0.0131 |
| /travelers 390 | 356, 360, 364, 368, 404 | 312, 368, 380, 384, 440 | 364 / 380 | 0.1239 / 0.0142 |
| /travelers 1440 | 336, 364, 388, 392, 412 | 328, 336, 360, 364, 420 | 388 / 360 | 0.1984 / 0.0058 |

## /the-map 390, scrolled to the map 2.5 s after load (one load each, an earlier build of this branch)

| core | CLS | the entry after the scroll |
|---|---|---|
| control | 0.2249 | 0.0853 at 3707 ms, the map sheet [0, 0, 0, 0] to [0, 772, 390, 72] |
| new | 0.0887 | 0.0853 at 3663 ms, the map sheet [0, 0, 0, 0] to [0, 772, 390, 72] |

