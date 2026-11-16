### Standard (no throttle), 5 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core. FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /travelers 390 | 0.1234 (0.0128) | 0.1281 | 5 of 5 | 0.0142 (0.0050) | 0.0142 | 0 of 5 | 144 / 132 | 144 / 132 | yes |
| /travelers 1440 | 0.1353 (0.1353) | 0.1619 | 3 of 5 | 0.0058 (0.0058) | 0.0058 | 0 of 5 | 168 / 132 | 176 / 132 | yes |
| /the-map 390 | 0.1396 (0.0000) | 0.1396 | 5 of 5 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 152 / 144 | 244 / 184 | yes |
| /the-map 1440 | 0.1003 (0.1003) | 0.3509 | 3 of 5 | 0.0037 (0.0037) | 0.0114 | 0 of 5 | 164 / 144 | 260 / 196 | yes |
| /for-expats 390 | 0.0772 (0.0000) | 0.0878 | 0 of 5 | 0.0131 (0.0000) | 0.0131 | 0 of 5 | 148 / 136 | 164 / 136 | yes |
| /for-expats 1440 | 0.0391 (0.0391) | 0.0416 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 156 / 140 | 156 / 140 | yes |
| /about 390 | 0.0439 (0.0000) | 0.0457 | 0 of 5 | 0.0036 (0.0000) | 0.0082 | 0 of 5 | 116 / 132 | 116 / 132 | yes |
| /about 1440 | 0.0365 (0.0365) | 0.0567 | 0 of 5 | 0.0001 (0.0001) | 0.0006 | 0 of 5 | 148 / 160 | 148 / 160 | yes |
| / 390 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 184 / 168 | 184 / 168 | yes |
| / 1440 | 0.0005 (0.0005) | 0.0005 | 0 of 5 | 0.0005 (0.0005) | 0.0006 | 0 of 5 | 196 / 192 | 196 / 192 | yes |
| story: Balkans 360 | 0.0128 (0.0000) | 0.0196 | 0 of 5 | 0.0196 (0.0000) | 0.0196 | 0 of 5 | 160 / 168 | 160 / 168 | yes |
| story: Balkans 390 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 148 / 148 | 180 / 180 | yes |
| story: Balkans 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 164 / 172 | 164 / 172 | yes |
| story: Lisbon 360 | 0.0041 (0.0000) | 0.0041 | 0 of 5 | 0.0041 (0.0000) | 0.0047 | 0 of 5 | 148 / 160 | 180 / 180 | yes |
| story: Lisbon 390 | 0.0040 (0.0000) | 0.0040 | 0 of 5 | 0.0038 (0.0000) | 0.0040 | 0 of 5 | 152 / 164 | 192 / 200 | yes |
| story: Lisbon 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 180 / 172 | 180 / 172 | yes |
| story: Southern Africa 360 | 0.0041 (0.0000) | 0.0041 | 0 of 5 | 0.0041 (0.0000) | 0.0041 | 0 of 5 | 152 / 152 | 184 / 188 | yes |
| story: Southern Africa 390 | 0.0057 (0.0000) | 0.0057 | 0 of 5 | 0.0057 (0.0000) | 0.0057 | 0 of 5 | 160 / 156 | 200 / 184 | yes |
| story: Southern Africa 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 156 / 180 | 156 / 180 | yes |

### CPU 4x slower, 3 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core. FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /travelers 390 | 0.1239 (0.1234) | 0.1239 | 3 of 3 | 0.0142 (0.0088) | 0.0142 | 0 of 3 | 500 / 372 | 500 / 372 | yes |
| /travelers 1440 | 0.2043 (0.2043) | 0.2044 | 2 of 3 | 0.0058 (0.0058) | 0.0058 | 0 of 3 | 384 / 328 | 896 / 328 | yes |
| /the-map 390 | 0.2002 (0.1860) | 0.2194 | 3 of 3 | 0.0034 (0.0034) | 0.0034 | 0 of 3 | 416 / 432 | 1080 / 432 | yes |
| /the-map 1440 | 0.1084 (0.1084) | 0.1152 | 3 of 3 | 0.0110 (0.0110) | 0.0110 | 0 of 3 | 380 / 400 | 892 / 400 | yes |
| /for-expats 390 | 0.0878 (0.0000) | 0.0878 | 0 of 3 | 0.0131 (0.0034) | 0.0131 | 0 of 3 | 412 / 428 | 800 / 428 | yes |
| /for-expats 1440 | 0.0415 (0.0415) | 0.0415 | 0 of 3 | 0.0004 (0.0004) | 0.0004 | 0 of 3 | 496 / 420 | 496 / 420 | yes |
| /about 390 | 0.0245 (0.0000) | 0.0245 | 0 of 3 | 0.0036 (0.0000) | 0.0036 | 0 of 3 | 392 / 400 | 392 / 400 | yes |
| /about 1440 | 0.0365 (0.0365) | 0.0365 | 0 of 3 | 0.0007 (0.0007) | 0.0007 | 0 of 3 | 412 / 376 | 412 / 376 | yes |

### Stress: jQuery answer held 600 ms (a paint lands before the end-of-body styles and the page-parsed scripts), 3 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core. FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /travelers 390 | 0.1593 (0.1588) | 0.1698 | 3 of 3 | 0.0488 (0.0483) | 0.0488 | 0 of 3 | 160 / 112 | 160 / 112 | no |
| /travelers 1440 | 0.3950 (0.3950) | 0.3950 | 3 of 3 | 0.0354 (0.0354) | 0.0354 | 0 of 3 | 168 / 132 | 680 / 132 | yes |
| /the-map 390 | 0.5625 (0.3872) | 0.6119 | 3 of 3 | 0.0034 (0.0034) | 0.0034 | 0 of 3 | 148 / 140 | 1544 / 164 | yes |
| /the-map 1440 | 0.2087 (0.2087) | 0.2087 | 3 of 3 | 0.0120 (0.0120) | 0.0120 | 0 of 3 | 168 / 148 | 1288 / 188 | yes |
| /for-expats 390 | 0.0878 (0.0772) | 0.0878 | 0 of 3 | 0.0131 (0.0034) | 0.0131 | 0 of 3 | 144 / 128 | 724 / 128 | yes |
| /for-expats 1440 | 0.0415 (0.0415) | 0.0415 | 0 of 3 | 0.0004 (0.0004) | 0.0004 | 0 of 3 | 148 / 144 | 148 / 144 | yes |
| /about 390 | 0.0245 (0.0243) | 0.0245 | 0 of 3 | 0.0036 (0.0034) | 0.0036 | 0 of 3 | 120 / 120 | 120 / 120 | yes |
| /about 1440 | 0.0365 (0.0365) | 0.0365 | 0 of 3 | 0.0007 (0.0007) | 0.0007 | 0 of 3 | 116 / 128 | 116 / 128 | yes |

