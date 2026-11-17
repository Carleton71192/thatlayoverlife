# Layout shift sweep, independent measurement check (17 November 2026)

Status: in progress. This file is rewritten when the measurements are done.

## Done so far

- Diff of claude/cls-sweep-2026-11-16 (head afe01e7) against the session branch (586ce62): 141 files. 131 are evidence under reports/evidence/cls-sweep-2026-11-16/, 5 are under src/site-layers (the build script, two new layers, page-heroes, the built core), 2 are new tests, and 4 are new files under src/pages (read-only copies of page code in live-2026-11-16 folders, added, nothing modified). Nothing under src/site. No chunk changed.
- The 4 new src/pages files are exact copies of what www serves today (checked against my own GET of /stories, /the-map and the profile page).
- Rebuild at afe01e7: the core is byte equal to the committed core, 276,440 bytes, sha384-rm9a+UhEyhRi7OWymOTl2Ji8o28uPBQD2TMRg6nRg/j1KkvzpCR+UuahQy1PwQu/. The 24 chunks and the search index equal layers-release 3df16988 byte for byte.
- Tests: 707 pass (59 files).
- www HTML: 17 plain GETs at 01:00 UTC (14 survey pages and the three stories), 1.05 MB. All 17 equal the builders' copies; every page carries the 16.66.0 core tag (pin 3df16988, sha384-trfI5wIn...).
- Own harness: harness/jm.cjs (loads), harness/an.py (tables), harness/run-all.sh.
