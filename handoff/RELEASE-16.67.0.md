# Release 16.67.0: page jumps on eight more pages

Nancy in chat on 17 Nov: "test site". www and the apex only after the independent checks and her "publish www".

## Why
A survey of live www (16.66.0) found 11 of 28 page and width cells jumping enough to matter, most from our own code running after the first paint (reports/evidence/cls-sweep-2026-11-16/survey/). Worst: /account desktop 0.30, /submit phone 0.14, /the-map phone 0.14, contributor profile desktop 0.12, /travelers phone 0.11.

## Build
- Branch claude/cls-sweep-2026-11-16 (parts A and B plus a repair round), merged into claude/new-session-zxm063 as 50e84bf. 720 tests pass.
- Two new core layers (tll-first-paint-v1, tll-early-state-v1) and a changed tll-page-heroes-v1. Only the core script changes; no page code, site head, embed or chunk.
- layers-release pin a254306f6c62a79f314754d24b44041d61be716d (built from 8dbabdd's tree; only src/site-layers/tll-site-layers-v16.js differs from 3df16988). jsDelivr serves 26 of 26 files exactly.
- Core 277,485 bytes, SRI sha384-2Bc75us2J2jpgsYU/Hger8bd7CrNh9cZyfStM3otS/aENprUVw1HFUruv8eGw3cU.

## Lab results (CLS median, control 16.66.0 to new; every layout-shift entry counted)
| page | phone 390 | desktop 1440 |
|---|---|---|
| /travelers | 0.124 to 0.010 | 0.091 to 0.006 |
| /the-map | 0.140 to 0.000 | 0.108 to 0.011 |
| /for-expats | 0.077 to 0.005 | 0.039 to 0.0001 |
| /about | 0.025 to 0.0003 | 0.057 to 0.0005 |
| /account | 0.012 to 0.012 | 0.301 to 0.004 |
| /submit | 0.144 to 0.000 | 0.055 to 0.0002 |
| contributor profile | 0.076 to 0.0004 | 0.118 to 0.0008 |
| /stories | 0.029 to 0.007 | 0.050 to 0.030 |
Loads over 0.1: 42 of 200 before, 0 of 200 after. Finished page equal to 16.66.0 everywhere except the /travelers title, which keeps the height of its longest verb (by design).
Checks: measurement PASS WITH NOTES (judge-measure/), adversarial PASS WITH NOTES (judge-adversarial/), repair re-check PASS WITH NOTES (recheck1/).

## Known notes
- /account signed in not checked in a real session: Nancy to look at /account on the test site while signed in before www.
- Reload on /for-expats lands on other content more often than 16.66.0 (needs a for-expats chunk change; not in this release).
- Back to /stories?q=... at 1440 after scrolling: 1.35 against about 1.0 on 16.66.0.
- /travelers at 320 px still about 0.15 (16.66.0: 0.17). CPU 4x first paint up to +38 ms on two cells. Chromium only.

## Webflow
1. Lock scope line (2c96cba). Before copy src/site/live-2026-11-17/r1667/site-scripts.before.json.
2. Registered 16.67.0 at 10:28:50 UTC, applied 10:29:00, read back.
3. Published the test site only (publishTaskId 9f1fb15d-286d-4a5a-b816-1586b2f44826), stamp 10:29:16 UTC. Independent checks: carry PASS (98d69fe), behavior PASS WITH NOTES (0802677), regression PASS WITH NOTES (506480c). Regression notes: /stories on slow 4G two-state font race (both hosts); /stories with lib-lead and lib-chips both throwing jumps once (0.37 against 0.01); back to /account at 1440 lands 77 px high; /submit with the head parity script throwing 0.141 against 0.000.

## Rollback
set_site_scripts with src/site/live-2026-11-17/r1667/site-scripts.before.json (core 16.66.0, pin 3df16988ac1674485a2fe44d24f3763073d0c98d, SRI sha384-trfI5wInWYlCUfz0XKnR/BqQpouu3JHGMLplaS1AFlYR8UiNBqoOU/6oYwcAJYTl), then publish.

## Live

Nancy in chat on 17 Nov: "Yeah they look the same" (signed-in /account on the test site) and "Publish www", applied once the three checks passed. Published www, thatlayover.life and the test site at 17:13:08 UTC (publishTaskId aa29423e-d694-4035-9fe8-a261d0e61d89). www served pin a254306f from 17:13:17 UTC; www and test HTML identical on 14 of 14 pages apart from host and stamp (reports/evidence/release-16.67.0-live/). Rollback stays as above.
