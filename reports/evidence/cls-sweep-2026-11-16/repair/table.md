# Repair after the adversarial check: every scenario (17 November 2026)

Arms: control = the live 16.66.0 core, before = the afe01e7 build, after = the repaired build. CLS = the sum of every layout-shift entry. One line per scenario and arm, loads in order of CLS. Rows per load: loads.csv.

## set n1

| scenario | arm | loads | CLS | extra |
|---|---|---|---|---|
| st-q-1440 | control | 9 | 0.169 0.169 0.169 0.177 0.764 0.764 0.766 0.766 0.774 | finished page: d84538 |
| st-q-1440 | before | 9 | 0.119 0.119 0.119 0.119 0.119 0.120 0.713 0.713 0.713 | title hold gone at 209, 212, 172, 201, 243, 238, 205, 211, 221 ms; finished page: d84538 |
| st-q-1440 | after | 9 | 0.099 0.115 0.115 0.116 0.116 0.116 0.116 0.116 0.120 | title hold gone at 424, 322, 294, 304, 298, 354, 341, 277, 325 ms; finished page: d84538 |
| st-q-390 | control | 3 | 0.412 0.412 0.412 | finished page: da02d7 |
| st-q-390 | before | 3 | 0.384 0.384 0.384 | title hold gone at 227, 208, 206 ms; finished page: da02d7 |
| st-q-390 | after | 3 | 0.383 0.383 0.399 | title hold gone at 312, 307, 282 ms; finished page: da02d7 |
| st-q-none-1440 | control | 3 | 0.060 0.060 0.060 | finished page: d635a6 |
| st-q-none-1440 | before | 3 | 0.040 0.040 0.040 | title hold gone at 166, 208, 155 ms; finished page: d635a6 |
| st-q-none-1440 | after | 3 | 0.015 0.041 0.041 | title hold gone at 257, 276, 307 ms; finished page: d635a6 |
| stories-plain-1440 | control | 3 | 0.049 0.111 0.113 | finished page: 1bd1c3 |
| stories-plain-1440 | before | 3 | 0.030 0.031 0.031 | title hold gone at 209, 184, 234 ms; finished page: 1bd1c3 |
| stories-plain-1440 | after | 3 | 0.030 0.031 0.031 | title hold gone at 161, 237, 201 ms; finished page: 1bd1c3 |

## set n2

| scenario | arm | loads | CLS | extra |
|---|---|---|---|---|
| about-reload-bottom-390 | control | 4 | 0.155 0.175 0.177 0.177 | end position against the old one: +0, +0, -111, +0; finished page: 556d45, b0d131 |
| about-reload-bottom-390 | before | 4 | 0.409 0.494 0.494 0.521 | end position against the old one: +0, +0, +0, +0; finished page: 159369 |
| about-reload-bottom-390 | after | 4 | 0.129 0.129 0.129 0.129 | end position against the old one: -111, -111, -111, -111; note hold gone at 109, 89, 96, 90 ms; finished page: b0d131 |
| expats-reload-bottom-390 | control | 4 | 1.012 1.089 1.089 1.089 | end position against the old one: -11, -881, -10, -10; finished page: e37d04, e6623a, ed8b67 |
| expats-reload-bottom-390 | before | 4 | 1.017 1.017 1.022 1.022 | end position against the old one: -881, -882, -13, -882; finished page: 5375c2, 7e67a6, 9fba4f |
| expats-reload-bottom-390 | after | 4 | 1.017 1.017 1.021 1.022 | end position against the old one: -10, -882, -882, -882; finished page: 7e67a6, e6623a, f8dc2c |
| about-reload-mid-390 | control | 2 | 0.355 0.355 | end position against the old one: -3, -3; finished page: 34ed1e |
| about-reload-mid-390 | before | 2 | 0.037 0.037 | end position against the old one: -3, -3; finished page: 34ed1e |
| about-reload-mid-390 | after | 2 | 0.037 0.037 | end position against the old one: -3, -3; note hold gone at 97, 87 ms; finished page: 34ed1e |
| expats-reload-mid-390 | control | 2 | 1.261 1.261 | end position against the old one: +0, +0; finished page: f22041 |
| expats-reload-mid-390 | before | 2 | 0.481 0.520 | end position against the old one: +0, +0; finished page: 8993cb, facc9d |
| expats-reload-mid-390 | after | 2 | 0.520 0.520 | end position against the old one: +0, +0; finished page: 8993cb |

## set n2c

| scenario | arm | loads | CLS | extra |
|---|---|---|---|---|
| about-reload-bottom-390 | control | 8 | 0.129 0.131 0.153 0.153 0.153 0.153 0.155 0.155 | end position against the old one: -111, +0, -111, +0, -111, +0, -111, -111; finished page: 556d45, b0d131 |
| about-reload-bottom-390 | after | 8 | 0.129 0.129 0.131 0.131 0.131 0.131 0.131 0.131 | end position against the old one: +0, +0, +0, +0, +0, -111, -111, +0; note hold gone at 98, 79, 102, 93, 82, 82, 89, 106 ms; finished page: 556d45, b0d131 |
| expats-reload-bottom-390 | control | 4 | 1.012 1.089 1.089 1.111 | end position against the old one: -881, -881, -10, -10; finished page: 9fba4f, e37d04, e6623a |
| expats-reload-bottom-390 | after | 4 | 1.022 1.022 1.022 1.022 | end position against the old one: -880, -881, -881, -881; finished page: 82ec09, 9fba4f, e37d04, fccc3c |

## set n3

| scenario | arm | loads | CLS | extra |
|---|---|---|---|---|
| map-mapcode-empty-1440 | control | 1 | 0.041 | finished page: 3a2373 |
| map-mapcode-empty-1440 | before | 1 | 0.038 | map hold gone at 9576 ms; late part 0.037; finished page: 3a2373 |
| map-mapcode-empty-1440 | after | 1 | 0.045 | map hold gone at 304 ms; finished page: 3a2373 |
| map-mapcode-throw-1440 | control | 1 | 0.028 | finished page: 3a2373 |
| map-mapcode-throw-1440 | before | 1 | 0.038 | map hold gone at 9611 ms; late part 0.037; finished page: 3a2373 |
| map-mapcode-throw-1440 | after | 1 | 0.045 | map hold gone at 331 ms; finished page: 3a2373 |
| map-mapdata404-1440 | control | 1 | 0.293 | finished page: 9cb209 |
| map-mapdata404-1440 | before | 1 | 0.028 | map hold gone at 9634 ms; late part 0.027; finished page: 9cb209 |
| map-mapdata404-1440 | after | 1 | 0.001 | map hold gone at 325 ms; finished page: 9cb209 |
| map-mapcode404-1440 | control | 1 | 0.026 | finished page: 3a2373 |
| map-mapcode404-1440 | before | 1 | 0.045 | map hold gone at 351 ms; finished page: 3a2373 |
| map-mapcode404-1440 | after | 1 | 0.045 | map hold gone at 273 ms; finished page: 3a2373 |
| map-mapembed404-1440 | control | 1 | 0.095 | finished page: 400d6a |
| map-mapembed404-1440 | before | 1 | 0.004 | map hold gone at 356 ms; finished page: 400d6a |
| map-mapembed404-1440 | after | 1 | 0.011 | map hold gone at 325 ms; finished page: 400d6a |
| map-mapcode-empty-390 | control | 1 | 0.163 | finished page: 197d1c |
| map-mapcode-empty-390 | before | 1 | 0.000 | map hold gone at 9636 ms; finished page: 197d1c |
| map-mapcode-empty-390 | after | 1 | 0.000 | map hold gone at 287 ms; finished page: 197d1c |
| map-mapcode-throw-390 | control | 1 | 0.174 | finished page: 197d1c |
| map-mapcode-throw-390 | before | 1 | 0.000 | map hold gone at 9642 ms; finished page: 197d1c |
| map-mapcode-throw-390 | after | 1 | 0.000 | map hold gone at 322 ms; finished page: 197d1c |
| map-mapdata404-390 | control | 1 | 0.140 | finished page: cfb3d5 |
| map-mapdata404-390 | before | 1 | 0.000 | map hold gone at 9617 ms; finished page: cfb3d5 |
| map-mapdata404-390 | after | 1 | 0.000 | map hold gone at 366 ms; finished page: cfb3d5 |
| map-mapcode404-390 | control | 1 | 0.163 | finished page: 197d1c |
| map-mapcode404-390 | before | 1 | 0.000 | map hold gone at 282 ms; finished page: 197d1c |
| map-mapcode404-390 | after | 1 | 0.000 | map hold gone at 301 ms; finished page: 197d1c |
| map-mapembed404-390 | control | 1 | 0.140 | finished page: 6b5a21 |
| map-mapembed404-390 | before | 1 | 0.000 | map hold gone at 377 ms; finished page: 6b5a21 |
| map-mapembed404-390 | after | 1 | 0.000 | map hold gone at 360 ms; finished page: 6b5a21 |
| map-plain-1440 | control | 2 | 0.093 0.111 | finished page: 400d6a |
| map-plain-1440 | before | 2 | 0.011 0.011 | map hold gone at 311, 343 ms; finished page: 400d6a |
| map-plain-1440 | after | 2 | 0.004 0.004 | map hold gone at 348, 330 ms; finished page: 400d6a |
| map-plain-390 | control | 2 | 0.140 0.187 | finished page: 6b5a21 |
| map-plain-390 | before | 2 | 0.000 0.000 | map hold gone at 333, 353 ms; finished page: 6b5a21 |
| map-plain-390 | after | 2 | 0.000 0.000 | map hold gone at 328, 349 ms; finished page: 6b5a21 |

## set n7

| scenario | arm | loads | CLS | extra |
|---|---|---|---|---|
| stories-earlytap-390 | control | 2 | 0.028 0.035 | focus ends on button.tllmm-btn; finished page: dc5777 |
| stories-earlytap-390 | before | 2 | 0.033 0.034 | title hold gone at 353, 359 ms; focus ends on body; finished page: dc5777 |
| stories-earlytap-390 | after | 2 | 0.034 0.034 | title hold gone at 755, 371 ms; focus ends on button.tllmm-btn; finished page: dc5777 |
| account-earlytap-390 | control | 2 | 0.301 0.301 | focus ends on button.tllmm-btn; finished page: 464194 |
| account-earlytap-390 | before | 2 | 0.095 0.095 | focus ends on body; finished page: 464194 |
| account-earlytap-390 | after | 2 | 0.095 0.095 | focus ends on button.tllmm-btn; finished page: 464194 |
| stories-menu-390 | control | 1 | 0.030 | focus ends on button.tllmm-btn; finished page: c4b4c8 |
| stories-menu-390 | before | 1 | 0.009 | title hold gone at 210 ms; focus ends on button.tllmm-btn; finished page: c4b4c8 |
| stories-menu-390 | after | 1 | 0.009 | title hold gone at 219 ms; focus ends on button.tllmm-btn; finished page: c4b4c8 |
| account-menu-390 | control | 1 | 0.014 | focus ends on button.tllmm-btn; finished page: 3883ba |
| account-menu-390 | before | 1 | 0.014 | focus ends on button.tllmm-btn; finished page: 3883ba |
| account-menu-390 | after | 1 | 0.014 | focus ends on button.tllmm-btn; finished page: 3883ba |

## set xtra

| scenario | arm | loads | CLS | extra |
|---|---|---|---|---|
| about-nonotecss-390 | control | 1 | 0.025 | finished page: c5d7a6 |
| about-nonotecss-390 | after | 1 | 0.000 | note hold gone at 193 ms; finished page: c5d7a6 |
| about-nonotecss-1440 | control | 1 | 0.057 | finished page: b01140 |
| about-nonotecss-1440 | after | 1 | 0.001 | note hold gone at 155 ms; finished page: b01140 |
| about-cut1-390 | control | 1 | 0.025 | finished page: c5d7a6 |
| about-cut1-390 | after | 1 | 0.000 | note hold gone at 3781 ms; finished page: c5d7a6 |
| about-even-1440 | control | 1 | 0.036 | finished page: b01140 |
| about-even-1440 | after | 1 | 0.001 | note hold gone at 3844 ms; finished page: b01140 |
| stories-q-even-1440 | control | 1 | 0.152 | finished page: d84538 |
| stories-q-even-1440 | before | 1 | 0.116 | title hold gone at 4387 ms; finished page: d84538 |
| stories-q-even-1440 | after | 1 | 0.118 | title hold gone at 4645 ms; finished page: d84538 |
| stories-q-cut1-1440 | control | 1 | 0.152 | finished page: d84538 |
| stories-q-cut1-1440 | before | 1 | 0.117 | title hold gone at 4287 ms; finished page: d84538 |
| stories-q-cut1-1440 | after | 1 | 0.119 | title hold gone at 4874 ms; finished page: d84538 |
| map-even-1440 | control | 1 | 0.095 | finished page: a656b3 |
| map-even-1440 | after | 1 | 0.013 | map hold gone at 4867 ms; finished page: fb4d6e |
| map-cut1-390 | control | 1 | 0.139 | finished page: 3e0b3e |
| map-cut1-390 | after | 1 | 0.000 | map hold gone at 5072 ms; finished page: 3e0b3e |
| stories-q-rm-1440 | control | 1 | 0.169 | finished page: dadc4c |
| stories-q-rm-1440 | after | 1 | 0.116 | title hold gone at 269 ms; finished page: dadc4c |

## set xmap

| scenario | arm | loads | CLS | extra |
|---|---|---|---|---|
| map-even-1440 | before | 3 | 0.012 0.012 0.013 | map hold gone at 4936, 5002, 4916 ms; finished page: a656b3, fb4d6e |
| map-even-1440 | after | 3 | 0.013 0.013 0.013 | map hold gone at 4835, 4815, 4883 ms; finished page: fb4d6e |

## set xhome

| scenario | arm | loads | CLS | extra |
|---|---|---|---|---|
| home-1440 | control | 6 | 0.000 0.000 0.000 0.000 0.000 0.000 | finished page: ce9baa |
| home-1440 | before | 6 | 0.000 0.000 0.000 0.000 0.000 0.000 | finished page: ce9baa |
| home-1440 | after | 6 | 0.000 0.000 0.000 0.000 0.000 0.000 | finished page: ce9baa |

## set reg (the regression table)

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | boxes equal | tree equal |
|---|---|---|---|---|---|---|---|---|---|
| /travelers 390 | 0.1130 | 0.1234 | 3 of 3 | 0.0100 | 0.0100 | 0 of 3 | 132 / 132 | 3 of 3 | 3 of 3 |
| /travelers 1440 | 0.1357 | 0.1357 | 3 of 3 | 0.0058 | 0.0058 | 0 of 3 | 140 / 140 | 3 of 3 | 3 of 3 |
| /the-map 390 | 0.1396 | 0.1396 | 3 of 3 | 0.0000 | 0.0000 | 0 of 3 | 148 / 136 | 3 of 3 | 3 of 3 |
| /the-map 1440 | 0.3560 | 0.3628 | 3 of 3 | 0.0114 | 0.0114 | 0 of 3 | 156 / 152 | 3 of 3 | 3 of 3 |
| /for-expats 390 | 0.0877 | 0.0878 | 0 of 3 | 0.0096 | 0.0097 | 0 of 3 | 136 / 136 | 3 of 3 | 3 of 3 |
| /for-expats 1440 | 0.0391 | 0.0391 | 0 of 3 | 0.0001 | 0.0001 | 0 of 3 | 160 / 152 | 3 of 3 | 3 of 3 |
| /about 390 | 0.0245 | 0.0246 | 0 of 3 | 0.0003 | 0.0003 | 0 of 3 | 132 / 128 | 3 of 3 | 3 of 3 |
| /about 1440 | 0.0360 | 0.0566 | 0 of 3 | 0.0001 | 0.0005 | 0 of 3 | 136 / 140 | 3 of 3 | 3 of 3 |
| /account 390 | 0.0119 | 0.0119 | 0 of 3 | 0.0119 | 0.0119 | 0 of 3 | 116 / 136 | 3 of 3 | 3 of 3 |
| /account 1440 | 0.3007 | 0.3007 | 3 of 3 | 0.0037 | 0.0037 | 0 of 3 | 124 / 132 | 3 of 3 | 3 of 3 |
| /submit 390 | 0.1437 | 0.1439 | 3 of 3 | 0.0000 | 0.0002 | 0 of 3 | 124 / 124 | 3 of 3 | 3 of 3 |
| /submit 1440 | 0.0552 | 0.0552 | 0 of 3 | 0.0002 | 0.0003 | 0 of 3 | 124 / 140 | 3 of 3 | 3 of 3 |
| /contributors/<profile> 390 | 0.0763 | 0.0763 | 0 of 3 | 0.0004 | 0.0004 | 0 of 3 | 132 / 152 | 3 of 3 | 3 of 3 |
| /contributors/<profile> 1440 | 0.1178 | 0.1178 | 3 of 3 | 0.0011 | 0.0019 | 0 of 3 | 164 / 148 | 3 of 3 | 3 of 3 |
| /stories 390 | 0.0284 | 0.0361 | 0 of 3 | 0.0070 | 0.0070 | 0 of 3 | 168 / 188 | 3 of 3 | 3 of 3 |
| /stories 1440 | 0.0504 | 0.1129 | 1 of 3 | 0.0300 | 0.0300 | 0 of 3 | 200 / 196 | 3 of 3 | 3 of 3 |
| / 390 | 0.0034 | 0.0034 | 0 of 3 | 0.0000 | 0.0000 | 0 of 3 | 184 / 180 | 3 of 3 | 3 of 3 |
| / 1440 | 0.0005 | 0.0005 | 0 of 3 | 0.0005 | 0.0005 | 0 of 3 | 196 / 244 | 3 of 3 | 3 of 3 |
| story: Lisbon 390 | 0.0040 | 0.0040 | 0 of 3 | 0.0006 | 0.0007 | 0 of 3 | 152 / 160 | 3 of 3 | 3 of 3 |
| story: Lisbon 1440 | 0.0001 | 0.0001 | 0 of 3 | 0.0001 | 0.0001 | 0 of 3 | 168 / 148 | 3 of 3 | 3 of 3 |

loads: control 60, new 60; failed 0; non-GET requests aborted 300; left behind: {'new style#tll-fp-title-v1': 6}; page errors: {'new': 0, 'ctl': 0}
cells where the new median is more than 0.01 over the control: []
