# src/site-layers/archive

Moved here on Nov 22, 2026 (sweep of Nov 21, item A20; reports/evidence/sweep-2026-11-21/defrag.md F12) so the folder above holds
only what the v16 build reads and the sources of live code.

- build-site-layers-v2.py to v15.py and tll-site-layers-v1.js to v15.js: the builds and bundles before v16 (29 files).
- tllflagsv4.js, tllflagsv5.js, tllflagsv51.js, tllflagsv52.js: older flag scripts; tllflagsv53.js (read by the build, live as
  tllflagsv53-5.3.0.js) stays above.
- tll-contrast-v1.js and tll-nav-phone-v1.js: the older script wrappers of tll-contrast-v1.html and tll-nav-phone-v1.html, which the
  core now injects as styles.
- tll-shelf-ring-v1-before-after.png: a review picture of tll-shelf-ring-v1.

Nothing live points here: every jsDelivr reference on the site is pinned to a commit, and no build or test reads these files. A few
October probe scripts under src/pages name the old bundles by their old path; they are history and are not run.
Kept above on purpose, though not in the v16 build: the staged or waiting layers (tll-card-lang-v1, tll-story-translate-v1,
tll-submit-lang-v1, tll-kofi-v1) and the .html files that are the saved sources of live site head and footer code (tll-v9-*,
tll-live-counts-*, tll-flow-v1.*, v9-1/, v9-b/).
