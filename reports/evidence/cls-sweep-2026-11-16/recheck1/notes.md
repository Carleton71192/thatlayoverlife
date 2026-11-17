# Layout shift sweep, re-check 1 of the repair (17 November 2026)

Verdict: PASS WITH NOTES. Nothing found that should keep the repaired core off the live site.

Checked: branch claude/cls-sweep-2026-11-16 at 634b842 (head unchanged at the end of this check). Arms: ctl = live 16.66.0 core from a local file, old = the afe01e7 build (before the repair), new = the repaired core. CLS counts every layout-shift entry. www HTML from disk, the core tag routed to a local core with integrity taken out of the routed HTML only. 1,502 loads (486 regression, 1,016 scenario), none failed. Every non-GET request aborted (5,093 in the scenario sets), nothing fetched from a Webflow host, no Webflow tool call, no form sent. One browser at a time. The machine restarted once during the run (about 07:11 UTC); the sets skip finished loads and were started again.

Tables: table.md (summary), table-regression.md, table-scenarios.md. One row per load: loads-regression.csv, loads-scenarios.csv. Scripts: harness/ (copies of the two judges' harnesses with re-check sets in rscen.cjs and two analysis scripts). Box lists and raw records stay on the scratch disk.

## 1. Diff, rebuild, tests

- afe01e7..634b842: 18 files. Layer sources tll-early-state-v1.js and tll-first-paint-v1.js, the built core, the build script, two test files, fix.md and 11 new files under repair/. Nothing under src/pages or src/site, no chunk, no data-ms-* write. Every changed line read.
- Rebuild in a throwaway worktree (node_modules linked): byte equal to the committed core. 277,485 bytes, sha384-2Bc75us2J2jpgsYU/Hger8bd7CrNh9cZyfStM3otS/aENprUVw1HFUruv8eGw3cU. The rebuild leaves the tree clean.
- Tests: 720 pass in 59 files.
- The build checks for note 3 read the repo copies of the map code and embed. The live map pin (a81ffb96) differs from the saved copy in the repo (46a21a18); both set the class tllm before the settings file is read, both have the tllm-err line, and the live embed has the STARTING line once, so the signs hold on www today.

## 2. Regression (repaired core against control)

- Standard speed, 28 cells x 5 loads an arm: finished page equal in all 28 cells. No new load over 0.1. The 16 claimed cells: new median 0.0000 to 0.0300, max 0.0311 (/stories 1440). Control medians up to 0.3007.
- One cell read worse by more than 0.01: /layovers 1440, median 0.0146 against 0.0014. A two-state font race in both arms: 15 more loads an arm put the high state at ctl 10 of 15, new 4 of 15. Not worse.
- FCP: /stories 1440 read +32 ms (180 / 212). 12 more loads an arm: ctl 224, old 230, new 228 ms. All other cells within 30 ms.
- CPU 4x, 16 claimed cells x 3 loads: all CLS checks pass, finished page equal. FCP over 30 ms in two cells; 6 more loads an arm: /stories 1440 ctl 540 / old 624 / new 576 ms (+36), profile 390 ctl 406 / old 468 / new 444 ms (+38). Both smaller than with afe01e7, so not from the repair (seen by the first judge). LCP /account 1440 at CPU 4x +292 ms, known from the first judge.

## 3. The repaired notes

- N1, /stories?q=lisbon, fonts not cached, 9 loads an arm: CONFIRMED. 1440: new 0.103 to 0.119 in 9 of 9; old 0.119 in 7 and 0.713 in 2; ctl 0.152 to 0.375 in 8 and 0.766 in 1. 390: new 0.383 in 9 of 9, old 0.384, ctl 0.411 to 0.420. Title hold gone at 246 to 367 ms (old 174 to 259).
- N2 /about, reload at the very end: CLS CONFIRMED. 390: new 0.129 to 0.131 in 12 of 12, ctl 0.129 to 0.177, old 0.161 to 0.494. 1440: new 0.049 to 0.052, ctl 0.051 to 0.112, old 0.051 to 0.103. Final position: at 390 the reader ends 111 px above the old position in new 6 of 12, ctl 5 of 12 (a race in both). At 1440 new ends 81 px above in 5 of 12, ctl 2 of 12, old 0 of 12; the same element is on screen, 81 px lower. Reload from mid page keeps the gain: 390 new 0.000 to 0.037 against ctl median 0.319; 1440 new 0.0001 against ctl median 0.315.
- N2 /for-expats: left by the builder, and the check agrees it is not from the repair (old and new behave the same). Final position, reader ends on other content: end 390 new 6 of 10, old 6 of 10, ctl 3 of 10; end 1440 new 7 of 10, old 6 of 10, ctl 4 of 10; from mid page at 1440 (not in the builder's report) the reader ends 1,152 px below, new 7 of 8, old 7 of 8, ctl 2 of 8. CLS same or lower: end 390 new 1.012 to 1.022, ctl 1.089 to 1.111; mid 1440 new 0.638 to 0.801, ctl 0.801 to 1.022. Mid page at 390: all arms end in place.
- N3, /the-map: CONFIRMED. Map code empty or throwing, and no settings file: hold gone at 298 to 358 ms (old 9.56 to 9.65 s). 1440: new 0.045 with nothing late (old 0.038 with 0.037 of it at 9.6 s; ctl 0.039 to 0.284). 390: 0.000 (ctl 0.140). No settings file at 1440: new 0.0008. Normal case: hold gone at 308 to 344 ms, 0.0037 at 1440, 0.000 at 390, same as old. Map code 404: 259 to 312 ms. Map code held 2.5 s: the hold waits for it (2.63 s), so the normal case is not weakened. Finished page equal to the control.
- N7, early tap on the stand-in Menu button: CONFIRMED. 15 of 15 early taps (/stories, /account, /about, /the-map at 390, touch and click, 320, 768, with a search) end with focus on the real Menu button (old: body in 15 of 15; ctl: the real button). Menu open, aria-expanded true, Escape closes it, a second tap opens it. If the reader moved focus before the page was parsed, focus stays where they put it (2 of 2).

## 4. Attacks next to the repair (360 scenarios incl. repeats)

- Holds: none that never lets go. The only style left at the end of load is style#tll-fp-title-v1 on /travelers (15 stages, by design). Note hold with the note style missing, renamed, removed, first in the page, note script throwing or missing, document in pieces and in 3 KB pieces: gone every time, CLS 0.0001 to 0.0006, finished page equal.
- No page error in new that the control does not have. Console errors are of the same two kinds in all arms (files not in the local cache, and the offline Memberstack line).
- Reduced motion, JavaScript off (0.000 in all arms), 320 px on the eight claimed pages, signed in, document in pieces: new lower than ctl or within 0.002 in all 51 scenarios; finished page (boxes, aria, text) equal.
- Page scripts failing on /the-map, /about, /stories (79): new lower than ctl or within 0.01 in all but one; /stories lead script missing at 1440 reads 0.065 to 0.067 against 0.030 to 0.078 (old the same). Finished page differs only where the adversarial check already found it (invite link on /the-map, notes 8 and 9) or where a card photo not in the local cache was aborted (see below).
- Other query strings and hashes on /stories (53 scenarios, one load an arm): new lower or within 0.01 in all but seven reads. Those seven were repeated with all three arms, 3 loads each, and all but the back case below are noise or a race in every arm: q with CPU 4x at 390 new 0.642 to 0.685 against ctl 0.412 to 0.800; q in pieces at 1440 new 0.116 to 0.117 against 0.086 to 0.450; card hash at 1440 new 0.723 to 0.779 against 0.741 to 0.799 (old the same); reload from mid page at 1440 new 0.780 to 1.681 against ctl 0.777 to 1.688 (old 1.126).
- One case the repair made worse: back to /stories?q=italy at 1440 after scrolling (the harness has the back-forward cache off). 6 reads an arm: new 1.354 in 4, ctl about 1.0 in 3, old 1.030 in 3. The frame where the search filter hides the cards is 1.000 with new and 0.650 to 0.686 with ctl and old; the title hold is still on in that frame with new. Reload at the very end of the same page has a 1.0 frame in ctl 2 of 4, old 1 of 4, new 3 of 4, a race in all arms. The control already reads about 1.0 here, and a real browser usually serves back from the back-forward cache, so this is a note.
- Reload and back on the other changed pages: new lower or equal in all, for example /about back 0.000 against 0.355, /for-expats back at 390 0.121 against 1.197, /the-map reload from mid page ends within 26 px of the old position (ctl 2,488 to 3,366 px off). /travelers reload at the end, 390: one load read 0.763 against 0.054; 3 more an arm: new 0.763, ctl 0.597 to 0.986, not worse.
- Not counted: /stories reload at the very end, 1440, no query: new and old 0.584 in 4 of 4, ctl 0.250. In new and old a card photo that is not in the local cache is requested after the scroll is put back, the harness aborts it, and the no-photo stand-in makes the card 230 px taller. The control never asks for that photo (it ends 239 px higher). This is the afe01e7 core, not the repair, and the numbers depend on the harness; a check with that photo cached would settle it.

## Notes for a builder (none blocks the release)

1. /for-expats reload: the reader ends on other content more often than with the control (end 390: 6 of 10 against 3 of 10; end 1440: 7 of 10 against 4 of 10; mid page 1440: 7 of 8 against 2 of 8). Present since afe01e7. The builder's suggested place for a fix (room for the expats map block from the start, in the for-expats chunk) fits what was seen.
2. Back to /stories with a search, 1440: the late title hold adds about 0.3 to a frame that is already about 0.65 in the control (new 1.354 against about 1.0).
3. /about reload at the very end, 1440: ends 81 px above in 5 of 12 (ctl 2 of 12); same content on screen.
4. CPU 4x FCP +36 ms (/stories 1440) and +38 ms (profile 390) against the control, less than afe01e7.
5. /the-map, map code that never starts, document in pieces at CPU 4x, 1440: 0.056 against ctl 0.026 to 0.041, because the hold now goes at 3.8 s instead of 13.3 s.
