### Standard (no throttle), 5 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /account 390 | 0.0119 (0.0000) | 0.0119 | 0 of 5 | 0.0119 (0.0000) | 0.0119 | 0 of 5 | 136 / 148 | 396 / 408 | yes |
| /account 1440 | 0.3007 (0.3007) | 0.3007 | 5 of 5 | 0.0037 (0.0037) | 0.0037 | 0 of 5 | 140 / 144 | 168 / 176 | yes |
| /submit 390 | 0.1437 (0.0000) | 0.1437 | 5 of 5 | 0.0002 (0.0000) | 0.0003 | 0 of 5 | 148 / 132 | 148 / 132 | yes |
| /submit 1440 | 0.0552 (0.0552) | 0.0552 | 0 of 5 | 0.0003 (0.0003) | 0.0003 | 0 of 5 | 136 / 152 | 136 / 152 | yes |
| /contributors/<profile> 390 | 0.0763 (0.0000) | 0.0763 | 0 of 5 | 0.0004 (0.0000) | 0.0004 | 0 of 5 | 148 / 152 | 220 / 212 | yes |
| /contributors/<profile> 1440 | 0.1178 (0.1178) | 0.1178 | 5 of 5 | 0.0008 (0.0008) | 0.0019 | 0 of 5 | 144 / 168 | 208 / 228 | yes |
| /stories 390 | 0.0284 (0.0002) | 0.0362 | 0 of 5 | 0.0073 (0.0002) | 0.0079 | 0 of 5 | 200 / 184 | 592 / 304 | yes |
| /stories 1440 | 0.1114 (0.1114) | 0.1114 | 4 of 5 | 0.0311 (0.0311) | 0.0311 | 0 of 5 | 192 / 200 | 192 / 200 | yes |
| / 390 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 0.0000 (0.0000) | 0.0000 | 0 of 5 | 200 / 164 | 200 / 164 | yes |
| / 1440 | 0.0005 (0.0005) | 0.0005 | 0 of 5 | 0.0005 (0.0005) | 0.0005 | 0 of 5 | 192 / 200 | 192 / 200 | yes |
| story: Balkans 360 | 0.0196 (0.0000) | 0.0196 | 0 of 5 | 0.0088 (0.0000) | 0.0155 | 0 of 5 | 156 / 156 | 156 / 156 | yes |
| story: Balkans 390 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 0.0000 (0.0000) | 0.0000 | 0 of 5 | 132 / 164 | 184 / 192 | yes |
| story: Balkans 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 184 / 172 | 184 / 172 | yes |
| story: Lisbon 360 | 0.0041 (0.0000) | 0.0041 | 0 of 5 | 0.0001 (0.0000) | 0.0001 | 0 of 5 | 144 / 148 | 192 / 184 | yes |
| story: Lisbon 390 | 0.0038 (0.0000) | 0.0040 | 0 of 5 | 0.0005 (0.0000) | 0.0005 | 0 of 5 | 144 / 164 | 176 / 180 | yes |
| story: Lisbon 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 156 / 168 | 156 / 168 | yes |
| story: Southern Africa 360 | 0.0041 (0.0000) | 0.0041 | 0 of 5 | 0.0001 (0.0000) | 0.0001 | 0 of 5 | 144 / 152 | 176 / 188 | yes |
| story: Southern Africa 390 | 0.0057 (0.0000) | 0.0057 | 0 of 5 | 0.0002 (0.0000) | 0.0002 | 0 of 5 | 160 / 172 | 192 / 196 | yes |
| story: Southern Africa 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 180 / 140 | 180 / 140 | yes |

### CPU 4x slower, 3 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /account 390 | 0.0119 (0.0119) | 0.0119 | 0 of 3 | 0.0119 (0.0119) | 0.0119 | 0 of 3 | 440 / 368 | 1168 / 1156 | yes |
| /account 1440 | 0.3008 (0.3008) | 0.3008 | 3 of 3 | 0.0037 (0.0037) | 0.0037 | 0 of 3 | 412 / 340 | 552 / 896 | yes |
| /submit 390 | 0.1439 (0.0000) | 0.1439 | 3 of 3 | 0.0002 (0.0000) | 0.0002 | 0 of 3 | 424 / 300 | 424 / 300 | yes |
| /submit 1440 | 0.0554 (0.0554) | 0.0554 | 0 of 3 | 0.0003 (0.0003) | 0.0003 | 0 of 3 | 476 / 340 | 476 / 340 | yes |
| /contributors/<profile> 390 | 0.0763 (0.0001) | 0.0763 | 0 of 3 | 0.0004 (0.0001) | 0.0004 | 0 of 3 | 408 / 456 | 536 / 612 | yes |
| /contributors/<profile> 1440 | 0.1178 (0.1178) | 0.1178 | 3 of 3 | 0.0019 (0.0019) | 0.0019 | 0 of 3 | 388 / 404 | 556 / 532 | yes |
| /stories 390 | 0.0284 (0.0257) | 0.0284 | 0 of 3 | 0.0073 (0.0052) | 0.0073 | 0 of 3 | 492 / 488 | 3000 / 2844 | yes |
| /stories 1440 | 0.0655 (0.0655) | 0.0657 | 0 of 3 | 0.0300 (0.0300) | 0.0311 | 0 of 3 | 496 / 560 | 496 / 560 | yes |

### Stress: jQuery answer held 600 ms (a paint lands before the end-of-body scripts and the page-parsed event), 3 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /account 390 | 0.3000 (0.2407) | 0.3101 | 3 of 3 | 0.0938 (0.0819) | 0.0938 | 0 of 3 | 140 / 112 | 408 / 376 | yes |
| /account 1440 | 0.0692 (0.0692) | 0.0761 | 0 of 3 | 0.0184 (0.0184) | 0.0184 | 0 of 3 | 128 / 132 | 384 / 396 | yes |
| /submit 390 | 0.1439 (0.1437) | 0.1439 | 3 of 3 | 0.0003 (0.0000) | 0.0003 | 0 of 3 | 112 / 124 | 112 / 160 | yes |
| /submit 1440 | 0.0554 (0.0554) | 0.0555 | 0 of 3 | 0.0004 (0.0004) | 0.0004 | 0 of 3 | 128 / 156 | 128 / 156 | yes |
| /contributors/<profile> 390 | 0.0763 (0.0763) | 0.0763 | 0 of 3 | 0.0004 (0.0001) | 0.0004 | 0 of 3 | 144 / 160 | 196 / 208 | yes |
| /contributors/<profile> 1440 | 0.1178 (0.1178) | 0.1178 | 3 of 3 | 0.0019 (0.0019) | 0.0019 | 0 of 3 | 132 / 156 | 192 / 216 | yes |
| /stories 390 | 0.0284 (0.0257) | 0.0284 | 0 of 3 | 0.0073 (0.0052) | 0.0073 | 0 of 3 | 240 / 204 | 976 / 276 | yes |
| /stories 1440 | 0.0498 (0.0498) | 0.0498 | 0 of 3 | 0.0311 (0.0311) | 0.0311 | 0 of 3 | 220 / 216 | 220 / 216 | yes |

### The part A pages and five more pages (of part B only the Menu button piece runs there), 3 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /travelers 390 | 0.1234 (0.0128) | 0.1238 | 3 of 3 | 0.0100 (0.0050) | 0.0100 | 0 of 3 | 140 / 112 | 140 / 112 | yes |
| /travelers 1440 | 0.1412 (0.1412) | 0.2407 | 3 of 3 | 0.0058 (0.0058) | 0.0058 | 0 of 3 | 144 / 116 | 144 / 116 | yes |
| /the-map 390 | 0.1396 (0.0000) | 0.1396 | 3 of 3 | 0.0000 (0.0000) | 0.0000 | 0 of 3 | 140 / 116 | 216 / 148 | yes |
| /the-map 1440 | 0.1236 (0.1236) | 0.3594 | 3 of 3 | 0.0110 (0.0110) | 0.0114 | 0 of 3 | 128 / 144 | 220 / 176 | yes |
| /for-expats 390 | 0.0772 (0.0000) | 0.0772 | 0 of 3 | 0.0049 (0.0000) | 0.0096 | 0 of 3 | 148 / 152 | 184 / 152 | yes |
| /for-expats 1440 | 0.0391 (0.0391) | 0.0391 | 0 of 3 | 0.0001 (0.0001) | 0.0001 | 0 of 3 | 144 / 140 | 148 / 140 | yes |
| /about 390 | 0.0439 (0.0000) | 0.0457 | 0 of 3 | 0.0002 (0.0000) | 0.0003 | 0 of 3 | 128 / 124 | 128 / 124 | yes |
| /about 1440 | 0.0365 (0.0365) | 0.0578 | 0 of 3 | 0.0006 (0.0006) | 0.0008 | 0 of 3 | 120 / 132 | 120 / 132 | yes |
| /layovers 390 | 0.0385 (0.0000) | 0.0390 | 0 of 3 | 0.0000 (0.0000) | 0.0146 | 0 of 3 | 120 / 112 | 120 / 112 | yes |
| /layovers 1440 | 0.0146 (0.0146) | 0.0146 | 0 of 3 | 0.0014 (0.0014) | 0.0146 | 0 of 3 | 136 / 144 | 136 / 144 | yes |
| /the-paw-passport 390 | 0.0222 (0.0000) | 0.0558 | 0 of 3 | 0.0188 (0.0000) | 0.0188 | 0 of 3 | 140 / 124 | 168 / 180 | yes |
| /the-paw-passport 1440 | 0.0080 (0.0080) | 0.0080 | 0 of 3 | 0.0080 (0.0080) | 0.0080 | 0 of 3 | 148 / 160 | 216 / 196 | yes |
| /cookies 390 | 0.0034 (0.0000) | 0.0038 | 0 of 3 | 0.0000 (0.0000) | 0.0000 | 0 of 3 | 128 / 108 | 128 / 108 | yes |
| /cookies 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 3 | 0.0001 (0.0001) | 0.0006 | 0 of 3 | 136 / 140 | 136 / 140 | yes |
| /login 390 | 0.0636 (0.0000) | 0.0636 | 0 of 3 | 0.0057 (0.0000) | 0.0057 | 0 of 3 | 128 / 112 | 128 / 112 | yes |
| /login 1440 | 0.0023 (0.0023) | 0.0036 | 0 of 3 | 0.0023 (0.0023) | 0.0024 | 0 of 3 | 124 / 132 | 124 / 132 | yes |
| /signup 390 | 0.0036 (0.0000) | 0.0412 | 0 of 3 | 0.0076 (0.0000) | 0.0113 | 0 of 3 | 116 / 140 | 116 / 140 | yes |
| /signup 1440 | 0.0016 (0.0016) | 0.0084 | 0 of 3 | 0.0003 (0.0003) | 0.0017 | 0 of 3 | 136 / 124 | 136 / 124 | yes |

### First paint, 8 more loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /submit 390 | 0.1437 (0.0000) | 0.1439 | 8 of 8 | 0.0002 (0.0000) | 0.0003 | 0 of 8 | 116 / 120 | 116 / 120 | yes |
| /contributors/<profile> 390 | 0.0763 (0.0000) | 0.0763 | 0 of 8 | 0.0004 (0.0000) | 0.0004 | 0 of 8 | 126 / 140 | 172 / 194 | yes |
| /contributors/<profile> 1440 | 0.1178 (0.1178) | 0.1178 | 5 of 8 | 0.0008 (0.0008) | 0.0019 | 0 of 8 | 140 / 146 | 214 / 212 | yes |
| /stories 390 | 0.0284 (0.0002) | 0.0362 | 0 of 8 | 0.0073 (0.0002) | 0.0073 | 0 of 8 | 202 / 210 | 598 / 306 | yes |
| /stories 1440 | 0.0804 (0.0804) | 0.1140 | 4 of 8 | 0.0311 (0.0311) | 0.0311 | 0 of 8 | 204 / 206 | 204 / 206 | yes |
| story: Balkans 390 | 0.0034 (0.0000) | 0.0034 | 0 of 8 | 0.0000 (0.0000) | 0.0000 | 0 of 8 | 156 / 150 | 190 / 178 | yes |

