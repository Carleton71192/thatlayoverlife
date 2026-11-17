# Re-check 1 of the repair: summary table

Arms: ctl = live 16.66.0, old = afe01e7 build, new = repaired core (634b842). CLS counts every layout-shift entry. Full tables: table-regression.md, table-scenarios.md.

## Checks

| check | result | numbers |
|---|---|---|
| Diff afe01e7..634b842 | pass | 18 files: 2 layer sources, built core, build script, 2 test files, evidence. Nothing under src/pages or src/site. |
| Rebuild byte equal | pass | 277,485 bytes, sha384-2Bc75us2J2jpgsYU/Hger8bd7CrNh9cZyfStM3otS/aENprUVw1HFUruv8eGw3cU |
| Tests | pass | 720 in 59 files |
| Finished page equal, regression | pass | 28 of 28 cells at standard speed, 16 of 16 at CPU 4x |
| No cell worse than ctl by more than 0.01 | pass | /layovers 1440 +0.0133 in 5 loads; 15 more an arm: high state ctl 10, new 4 |
| Claimed cells: median under 0.05, no load over 0.1 | pass | new medians 0.0000 to 0.0300, max load 0.0311 |
| FCP within 30 ms (median), standard speed | pass | /stories 1440 +32 in 5 loads; 12 more an arm: 224 / 228 |
| FCP within 30 ms (median), CPU 4x | note | /stories 1440 +36, profile 390 +38 (6 loads an arm; old +84, +62) |
| Holds that never let go | pass | none; only style#tll-fp-title-v1 stays on /travelers, by design |
| New page errors | pass | 0 |
| New kinds of console error | pass | 0 |
| Failed loads | pass | 0 of 1,502 |

## The repaired notes

| note | case | ctl | old | new | result |
|---|---|---|---|---|---|
| N1 | /stories?q=lisbon 1440, 9 loads | 0.152 to 0.375 (8), 0.766 (1) | 0.119 (7), 0.713 (2) | 0.103 to 0.119 (9) | fixed |
| N1 | /stories?q=lisbon 390, 9 loads | 0.411 to 0.420 | 0.384 | 0.383 | fixed |
| N2 | /about reload at end 390, 12 loads | 0.129 to 0.177; 111 px above in 5 | 0.161 to 0.494; in place 12 | 0.129 to 0.131; 111 px above in 6 | fixed |
| N2 | /about reload at end 1440, 12 loads | 0.051 to 0.112; 81 px above in 2 | 0.051 to 0.103; in place 12 | 0.049 to 0.052; 81 px above in 5 | fixed, note |
| N2 | /about reload mid page 390 / 1440, 4 loads | median 0.319 / 0.315 | 0.014 / 0.0001 | 0.027 / 0.0001 | gain kept |
| N2 | /for-expats reload at end 390, 10 loads | 1.089 to 1.111; other content 3 | 1.017 to 1.022; other content 6 | 1.012 to 1.022; other content 6 | left (not the repair) |
| N2 | /for-expats reload at end 1440, 10 loads | 0.707 to 0.841; other content 4 | other content 6 | 0.707 to 0.801; other content 7 | left (not the repair) |
| N2 | /for-expats reload mid page 1440, 8 loads | 0.801 to 1.022; other content 2 | other content 7 | 0.638 to 0.801; other content 7 | note (not the repair) |
| N3 | map code never starts (empty, throws), 1440 | 0.039 to 0.284 | 0.038, hold 9.6 s | 0.045, hold 0.30 to 0.35 s | fixed |
| N3 | same, 390 | 0.140 | 0.000, hold 9.6 s | 0.000, hold 0.31 to 0.36 s | fixed |
| N3 | no settings file 1440 / 390 | 0.026 to 0.049 / 0.140 | 0.028 / 0.000, hold 9.6 s | 0.0008 / 0.000, hold 0.33 s | fixed |
| N3 | normal 1440 / 390 | 0.099 to 0.111 / 0.139 to 0.162 | 0.0037 / 0.000 | 0.0037 / 0.000, hold 0.31 to 0.34 s | not weakened |
| N3 | map code 404 1440 / 390 | 0.026 to 0.284 / 0.140 to 0.186 | 0.045 / 0.000 | 0.045 / 0.000 | same |
| N3 | never starts, pieces, CPU 4x, 1440 | 0.026 to 0.041 | 0.038, hold 13.3 s | 0.056, hold 3.8 s | note |
| N7 | early tap, 15 loads over 8 cases | focus on the real button | focus on body (15) | focus on the real button (15) | fixed |

## Attack rows repeated (3 loads an arm)

| case | ctl | old | new | reading |
|---|---|---|---|---|
| back to /stories?q=italy 1440 (6 reads) | 0.396 to 0.998 | 0.399 to 1.030 | 0.429 to 1.354 (1.354 in 4) | worse, note |
| reload at end /stories?q=italy 1440 (4) | 0.792 to 1.703 | 0.759 to 1.204 | 0.764 to 1.754 | race in all arms |
| reload mid /stories?q=italy 1440 | 0.777 to 1.688 | 1.126 | 0.780 to 1.681 | same |
| /stories?q=lisbon CPU 4x 390 | 0.412 to 0.800 | 0.644 to 0.686 | 0.642 to 0.685 | same |
| /stories?q=lisbon in pieces 1440 | 0.086 to 0.450 | 0.116 to 0.117 | 0.116 to 0.117 | same or better |
| /stories card hash 1440 | 0.741 to 0.799 | 0.723 to 0.779 | 0.723 to 0.778 | same |
| /travelers reload at end 390 | 0.054 to 0.986 | 0.763 | 0.763 | same |
| /stories reload at end 1440 | 0.250 | 0.584 | 0.584 | not counted: uncached card photo aborted in old and new only |
| /stories lead script missing 1440 | 0.030 to 0.078 | 0.067 | 0.065 to 0.067 | same as old |
| /the-map, reduced motion 1440 | 0.093 to 0.359 | 0.004 to 0.011 | 0.011 | better |
