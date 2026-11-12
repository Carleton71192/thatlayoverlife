# Codebase review and refactor, 12 Nov 2026

Branch `claude/new-session-zxm063`. Nothing was published, pushed, or changed in Webflow, and no file was deleted. The rebuilt
site layers are committed in the repo only; they reach www only through the usual release step (see "What you need to decide").

## In plain words

- **What was reviewed.** All the site's custom code in the repo, the live pages and the CSS they load. Three questions: which CSS
  variables are unused or broken, which media files nothing uses, and how the stories pages and the expat pages differ in structure.
- **Unused CSS variables.** The code the repo serves to the site is almost clean: one unused variable (`--mg-teal`, removed) and one
  broken reference (`--mg-ink2`, now pointing at `--mg-ink`). The rest of the unused variables (59 names) and the broken references
  (8 names) live in Webflow (the site head, page code, the Webflow Variables panel and Webflow's stylesheet), in the map or in the
  share card. Those are listed below for you to approve; I did not touch them.
- **Media.** No live page loads a picture from the repo. 717 screenshot and evidence files (474.9 MB) could move to an archive
  branch; 251 files (15.6 MB) must stay because scripts read them. In Webflow, 39 assets (8.25 MB) are safe to delete with your yes.
  Nothing was moved or deleted.
- **Stories pages vs expat pages.** They are built from different pieces: different wrappers, card styles, labels and colors. Most
  of the visible differences sit in Webflow page code. The biggest finding is a bug, not a style issue: the /for-expats expert
  directory is empty because it reads links that /travelers no longer has.
- **What I changed.** One new shared component layer (`tll-components-v1`) with named color and font tokens and four small pieces
  (washi tape, small label, empty state, hidden). The stories and expat layers now use it instead of their own copies and instead
  of styles written inline by script, and three of them share one set of helper functions instead of three copies.
- **Did anything move on the page?** No. Before and after screenshots of /stories, a story page, /for-expats, the home page,
  /account (signed out) and /submit at 390 and 1440 match pixel for pixel; the only differences seen also appear between two runs of
  the current build (section 5.2). One deliberate fix changes a state no page shows today: a story card whose photo fails to load now
  shows only its place-name panel, without the empty image box above it.
  Tests: 454 pass (433 before, 21 new).

## 1. What was reviewed

- `src/site-layers/` (every source in the v16 build, the build script, the built core and chunks), the two magazine builds the core
  includes (`tll-mag-story-v1.html`, `tll-mag-cover-v1.html`), `src/components/` items in the build, and the page copies in
  `src/pages/` for the stories, story, /for-expats, home and account pages.
- The live site: the 6 named pages, 31 more page types and all 136 sitemap URLs (323 pages in the media crawl), the Webflow shared
  stylesheet `that-layover-life.webflow.shared.f0153eca0.css`, and every script those pages load. The live core and chunks at
  `6ebffe0f` are byte-identical to the build at the start of this work.
- Three read-only audits (CSS variables, orphaned media, stories vs expat structure) were run first; their findings are summarized
  here, and their working files stay in the session scratchpad, outside the repo.

## 2. What was found

### 2.1 CSS custom properties

**In the code the repo serves to the site (the v16 build inputs):** 23 names defined, 21 read.

| Name | Where | Status | Action |
|---|---|---|---|
| `--mg-teal` | `src/design/magazine-2026-10/story-build/tll-mag-story-v1.html:10` | defined, read nowhere in the repo, on any of the 323 live pages or in the Webflow CSS | removed |
| `--mg-ink2` | same file, line 141, `.tll-gallery-link{background:var(--mg-ink2)}` | read, never defined (no fallback), so the gallery tile was transparent while its photo loaded | now `var(--mg-ink)` |
| `--tll-i` | `tll-photos-form-v2.js:150` (setProperty) | looked unused in the layers, but the /share-photos page code reads `var(--tll-i,0)` | kept |
| `--st3-col`, `--st3-f-head`, `--st3-f-body` | story layer | defined by the layer for the story template code in Webflow, which reads them | kept |
| `--h3-g`, `--h3-line` | cover layer, `tll-redesign-p0-v1.js:49` | read with fallbacks; defined by the home page code | kept |

**Outside the repo-controlled build (listed, not changed): 59 unused names.**

| Where | Names | Count | Who can change it |
|---|---|---:|---|
| Site head (Webflow site settings), `#cc-main` | `--cc-bg`, `--cc-primary-color`, `--cc-secondary-color`, `--cc-btn-primary-bg`, `--cc-btn-primary-color`, `--cc-btn-primary-hover-bg`, `--cc-btn-secondary-bg`, `--cc-btn-secondary-color`, `--cc-btn-secondary-hover-bg`, `--cc-toggle-on-bg`, `--cc-cookie-category-block-bg`, `--cc-overlay-bg` (the CookieConsent stylesheet is never loaded) | 12 | Webflow |
| Site head `:root` | `--tll-cream`, `--tll-border`, `--tll-muted`, `--tll-ease-in-out`, `--tll-t-exit` | 5 | Webflow |
| Home page embed (copy: `src/pages/home/live-2026-11-11/embeds/94ce12c0.after-audit-choices.html`) | `--h3-n` (set by script, read by nothing) | 1 | Webflow |
| /stories page footer (copy: `src/pages/stories/v3/s3-stories.css:7`) | `--s3-line`, `--s3-paper` | 2 | Webflow |
| Story template footer (copy: `src/pages/story/v3/style-st3-story-v1.html:10`) | `--st3-ease` | 1 | Webflow |
| Map (`map-2.0/dist/tll-map-layers.css:2`) | `--rose-deep` | 1 | map release (out of scope here) |
| Share card (`src/shareables/percent-card.js:28`, built into `dist/tll-share-v1.min.js`) | `--edge`, `--land`, `--lived`, `--paper`, `--pet` | 5 | next share card build |
| Webflow Variables panel (shared CSS lines 2419 to 2454) | 3 blockquote colors, 2 inverse borders, 2 button colors, 1 input border, 9 card hover and accent colors, 1 link hover, 1 interaction, 1 button size, 1 spacing, 1 tag padding, 3 `tll-space` sizes, 1 width, 1 base font, 4 blockquote sizes, 1 typography size | 32 | Webflow Designer |

**Broken references outside the build (listed, not changed).** In the Webflow shared CSS, classes read names that Webflow defines
under another prefix, so the fallback color renders: `--tll-midnight` (21 uses, renders #1C1C1C, the Webflow value is #0A0B14),
`--tll-mid` (14, #6B6760), `--tll-mid-dark` (8, #3D3A35), `--tll-bone` (27, #EFEAE1 and #F7F4EE), `--tll-marigold` (1, on no page).
Three more have no fallback but sit on classes no page uses: `--ix--ix-follow-cursor`, `--35rem`, `--size-gap--sm`.

**The same value under many names.** The palette is written about ten times over (`--tll-*`, Webflow `--_colors---tll-*`, `--h3-*`,
`--s3-*`, `--st3-*`, `--ct3-*`, `--ds3-*`, `--mg-*`, the map, the passport, the share card), with some disagreements (three grays for
"muted", four dark surfaces, `--mg-rose` meaning a different rose from every other "rose"). One site-wide token set is proposed in the
CSS variable audit; adopting it in Webflow is your call. This change adds `--tll-ui-*` tokens for the repo layers only, with today's
values, so they can alias to that set later without a visible change.

### 2.2 Media

**Repo.** The tracked tree is 564.9 MB in 3,109 files; 968 of them are media (490.5 MB, PNG 468.5 MB). No vitest test and no live
page loads any of them (the four repo files www loads through jsDelivr are code or data).

| Group | Files | MB | Proposal |
|---|---:|---:|---|
| Read by scripts (fonts, icon sets, design source images, upload fixtures) | 251 | 15.6 | keep |
| Screenshots and evidence, named nowhere (tier 1) | 226 | 208.3 | move to an archive branch |
| Named only by folder in a doc (tier 2) | 361 | 236.8 | move to an archive branch |
| Named in a doc or by the script that wrote it (tier 3) | 130 | 29.9 | move to an archive branch (same paths keep the links working) |

Largest areas: `src/design/magazine-2026-10` screenshots 258.6 MB, `src/pages/heroes-2026-10-29` 69.8 MB, `src/pages/home` screenshot
folders 54.2 MB, `src/pages/gallery` 20.9 MB, `reports/` 34.8 MB, `scratchpad/` 17.0 MB, the rest 19.7 MB. Moving them still leaves
main at about 90 MB (non-media files are 74.4 MB), and `.git` stays 794 MB unless history is rewritten (not proposed).

**Webflow.** 1,182 assets checked by asset id against 323 live pages, the Webflow CSS and JS, the layers and the CMS. 1,020 are used,
162 are not; two of those are still needed (`ads.txt`, `llms.txt`). Of the other 160 (55.3 MB):

| Confidence | Assets | MB | What |
|---|---:|---:|---|
| High | 39 | 8.25 | 25 AVIFs in the "Generated" folder (8 Apr); 10 sharing images for pages that now 404 or 301 (press, press-trips, expats, newsletter, for-affiliates, spotlight, creators, countries, awards, pets); `jay-carleton-avatar.jpg` and `sortsol-walking-the-tidal-flats.jpg` (the CMS has its own copies); `tll_recovery_v2.min.js` and `tll-hero-halong-bay-test.mp4` (both answer 403) |
| Medium | 53 | 13.23 | May photo uploads; 34 Antarctica photos from 23 Sep |
| Low, keep | 68 | 33.82 | 27 backgrounds for the sharing-image generator, 39 Layover Lounge and story photos (Lounge build still open), 2 sharing images for templates with only draft items |

Deleting a Webflow asset cannot be undone through the API, and old newsletters or posts may link to any CDN URL.

### 2.3 Stories pages vs expat pages

| # | What a reader sees | Where it lives |
|---|---|---|
| R1 | **Bug.** /for-expats "The experts so far." shows no experts and the finder says "No expert in Denmark yet" while the map lists a member there. The page footer script looks for `a.tll-trav-card-dark` links on /travelers, which no longer has them. | Webflow page code (copy: `src/pages/heroes-2026-10-29/code/for-expats-footer.html:34`) |
| R2, R3 | /for-expats buttons ask for DM Sans (never loaded, so a system font shows), have 7 and 9px corners and are 54px tall; the rest of the site is Plex, square, 48px. The "Find an expat group" outline is cream on cream. | Webflow page code and stylesheet |
| R4 | /for-expats section headings run 34 to 64px from one site-wide rule; /stories headings stay 40px. | `tll-v9-type-v1` in the site head |
| R5, R6 | /for-expats has 8 section wrappers and 7 widths (left edge at 208, 270, 307 or 332px at 1440); phone gutters run 16 to 52px. | page code, `tll-page-heroes-v1`, the staged expat layer |
| R7, R10, R11 | Story cards are borderless photos; expat cards are bordered boxes with five corner sizes; only story cards answer hover; chips are pills, 16px or 4px corners. | page code and layers |
| R8, R9 | Labels above sections: teal 11px on /stories, rose 12px on /for-expats, 10px on the expats map (under the 12px floor). | page code and layers |
| R12 | Round SVG flags on /stories and the map, emoji flags in the finder. | page code |
| R13, R14 | The empty-state panel exists in two sizes; the map section adds its own padding on top of the shared padding (132px gaps at 1440). | layers and page code |
| R15 | Signed-out /account and /edit-profile have a skip link to a missing target; on story pages the nav sits inside the main landmark. | Webflow markup and the story layer |

For a maintainer: the tape and the small label were written twice with identical CSS (series and expat layers, plus a third label
copy in story-is); the same `el()` helper sat in 26 layers with two different argument orders; several layers wrote layout as inline
styles; the expats map borrowed the `dir-h2` hook that the page script fills with the expert count; the editorial side had three token
families and the expat side none.

## 3. What changed, file by file

| File | Change | Why |
|---|---|---|
| `src/site-layers/tll-components-v1.html` (new) | Core style: `--tll-ui-*` tokens (ink, paper, cream, line, dash, text-2, muted-2, rose-text, teal-text, three font stacks, radius) and `.tll-ui-tape` (`--above`, `--sm`, `--corner`), `.tll-ui-kicker`, `.tll-ui-empty` (`--center`), `.tll-ui-hidden`. Each selector also lists the old class it replaces (`.tll-wt-tape`, `.tll-wt-card-tape`, `.tll-ex-tape`, `.tll-sr-k`, `.tll-ex-k`, `.tll-si-k`). | One copy of each duplicated rule, with today's values, so adopting a class moves no pixel and old names keep working in Webflow code. No class name contains card, eyebrow, title, h3, group or divider, which site-wide head rules match inside class names. Every token is read somewhere (a test checks it). |
| `src/site-layers/tll-components-v1.js` (new) | Core layer: `window.__tllUI = {el, style, json}`; its header documents the class scheme and the tokens. | The helpers the series, expat and story-is layers each copied. The core runs to the end before any chunk runs, so every chunk can rely on it. |
| `src/site-layers/build-site-layers-v16.py` | The style joins STYLES (last); the helper layer joins SCRIPTS and CORE right after img-variants; docstring and core notes updated. | Registration. |
| `src/site-layers/tll-series-v1.js` | Tape and label rules removed (now in the core); elements carry `tll-ui-tape`, `tll-ui-tape--sm --corner`, `tll-ui-tape--above` and `tll-ui-kicker` beside the old names; colors and fonts read the tokens; `el`, `style`, GET from `window.__tllUI`; the sponsor link color is a rule on a `data-tll-sponsor` attribute instead of `style.color` (a class would have dropped the site's `a:not([class])` link transition). | Duplicates, inline style, helpers. Still staged (routes off): nothing shows on the public site. |
| `src/site-layers/tll-expat-v1.js` | Same for the label and tape; My moves margin and the move-line label display are class rules (`#tll-ex-set label.tll-ex-desk` keeps the old strength) instead of inline styles; tokens; helpers. | Same. Staged behind `?preview=expat`. **Deliberate consistency fix** (preview only): the Living Library rail tape is now exactly the series card tape, so it gains `max-width:100%`, `z-index:3` and the `ui-monospace` fallback; it renders the same while JetBrains Mono loads, and the rails need the series routes, which are off, so nothing shows today. |
| `src/site-layers/tll-story-is-v1.js` | `.tll-si-k` comes from the core with `tll-ui-kicker` beside it; tokens; helpers. | Third copy of the label. Live on /submit, /stories and story pages. |
| `src/site-layers/tll-stories-places-v1.js` | The empty-region note uses `tll-ui-empty tll-ui-empty--center` instead of `style.cssText` (same values). | Inline layout to a shared piece; the /stories page code writes the same note and can switch to the class later. |
| `src/site-layers/tll-stories-noimg-v1.js` | The broken image is hidden with `tll-ui-hidden` (plus `[data-tll-noimg] img.tll-ui-hidden{display:none!important}` in the layer) instead of `style.display`; tokens. | Inline style, and a **deliberate fix**: the inline `display:none` never won, because the /stories page code sets `.tll-lib-img{display:block !important}`. A story without a photo showed an empty ink image box above the panel; now only the panel shows. No story is without a photo today, so no page changes (see 5.3). |
| `src/site-layers/tll-expats-map-v1.js` | The map heading hook is `data-tll-x="expats-map-h2"` (was `dir-h2`); tokens. | No style used the hook (checked in the live page, its CSS and the Webflow CSS), but the page script fills the first `dir-h2` with the expert count; if the directory moved below the map, the count would land in the map heading. |
| `src/design/magazine-2026-10/story-build/tll-mag-story-v1.html` | `--mg-teal` removed; `.tll-gallery-link` background `var(--mg-ink)` (was the undefined `--mg-ink2`). | Unused variable; broken reference. |
| `src/site-layers/tll-site-layers-v16.js`, `src/site-layers/chunks/*.js` | Rebuilt. Core 215,688 to 218,344 bytes (64,654 to 65,441 bytes gzip). 13 chunks changed (countries, edit-profile-preview, for-expats, for-expats-preview, pets, pets-preview, profile-preview, pursuits, stories, story, story-preview, submit, submit-preview), each a little smaller. | Build output. |
| `test/components-layer.test.js` (new, 21 tests) | Registration and order in the core; every token used and defined; the moved rules resolve to exactly the old values (tape, label, empty state); no copies left in the layers; new class names beside old ones; helpers from `window.__tllUI` after each path guard; no inline layout left; the map hook; the helpers' behavior; the story layer variables; house rules. | |
| `test/lighthouse-fixes-layer.test.js` | The series stand-in runs the helper layer first, as the site does. Assertions unchanged. | The series layer now reads `window.__tllUI`. |

## 4. What I deliberately did not change

- **Anything that moves pixels on a public page.** Merging the two grays (#6B6660 and #5F5A54), one label size and color, one card
  corner, phone gutters of 24px, one section wrapper, the map's 10px label and 132px gaps, and adding the /for-expats and staged
  buttons to the site button set (`tll-buttons-v1`). These are your choices (section 6).
- **`tll-page-heroes-v1`.** Live on both /stories and /for-expats with its own widths (1072/24) and font stacks; unifying its shell is
  a visible change (R5).
- **Webflow page code and its repo copies** (`src/pages/**`). The copies mirror what is live in Webflow; editing them here would only
  make them disagree with the site. The R1 bug, the button font, the heading sizes and the emoji flags all need Webflow edits.
- **Other `el()` copies.** Only the stories and expat layers were in scope. `tll-expats-map-v1` keeps its own `el()` (it takes an
  attributes object) and its `cname`, `norm` and `flag` helpers, which differ from the expat layer's.
- **Two inline styles that are right as inline styles:** the series card gets `position:relative` only when the computed position is
  static (a runtime check), and page-heroes sets each photo's `object-position` from its data.
- **Font stacks that differ from the tokens** (`"IBM Plex Sans Condensed",sans-serif` and `"JetBrains Mono",monospace` in a few
  rules) and one-off colors (#3A3833, #C8B9A6, #EFE8DC, #fff) stay literal: tokenizing them would change a fallback or invent a token
  for one use.
- **The old class names** (`.tll-wt-tape`, `.tll-ex-k` and the rest) stay on the elements and in the selectors, because Webflow code
  you cannot see from the repo may target them.
- **Old bundles (v1 to v15), dated snapshots, `map-2.0/`, `worker/`, the share card source and its dist build.** Not touched.
- **No file deleted, no media moved, no copy changed.**

## 5. How it was verified

### 5.1 Build and tests

- `python3 src/site-layers/build-site-layers-v16.py`: 12 styles, 18 core layers, 24 chunks. The build was byte-stable before the
  change (a rebuild at the start changed nothing, and its core was byte-identical to the live core at `6ebffe0f`).
- `npx vitest run`: 52 files, 454 tests, all pass (433 before; 21 new in `test/components-layer.test.js`).

### 5.2 Pixel diffs (CURRENT build vs NEW build)

How: Playwright (Chromium, Playwright 1.56) loaded each page from its live HTML, fetched once with curl and served for the page URL.
The pinned core tag (`tll-site-layers-v16.js@6ebffe0f...` with its integrity) was pointed at a local route that served a build from
disk, core and chunks, so the chunk loader fetched that build's chunks with that build's hashes. CURRENT is the build at the start
of this work (identical to live); NEW is this change. Every run: viewport 390x844 or 1440x900, seeded `Math.random`, animations and
transitions off, ads and analytics blocked (ad slots masked), the page scrolled to the end and back, network idle, a fixed wait, a
wait until every photo in the first screen has decoded, then a full-page screenshot, compared with pixelmatch (threshold 0,
antialiasing counted).

Held still in both builds, because they change between loads whichever build runs:
- the rotating word in the home closing heading ("Where did your last ... take you?", a timer in Webflow page code): pinned to
  "layover" by replacing the node the timer writes to;
- the home weekly cover photo: hidden (`visibility:hidden` on that one image; the headline, buttons and stamp stay in the
  comparison), because in 4 of 11 earlier runs, of both builds, it painted as a dark box;
- ads: blocked and their slots masked.

Final runs (two of each build, the same settings):

| Page | Width | Height (px) | NEW vs CURRENT, run 1 | NEW vs CURRENT, run 2 | CURRENT vs CURRENT | NEW vs NEW |
|---|---:|---:|---:|---:|---:|---:|
| /stories | 390 | 35,522 | 0 | 0 | 0 | 0 |
| /stories | 1440 | 15,222 | 0 | 0 | 2,147 | 2,147 |
| /stories/antarctica-marathon | 390 | 20,390 | 0 | 0 | 0 | 0 |
| /stories/antarctica-marathon | 1440 | 15,864 | 47,641 | 0 | 0 | 47,641 |
| /for-expats | 390 | 7,222 | 0 | 0 | 0 | 0 |
| /for-expats | 1440 | 6,168 | 0 | 0 | 0 | 0 |
| / (home) | 390 | 14,530 | 0 | 0 | 0 | 0 |
| / (home) | 1440 | 13,767 | 0 | 0 | 0 | 0 |
| /account (signed out) | 390 | 1,735 | 0 | 0 | 0 | 0 |
| /account (signed out) | 1440 | 1,585 | 0 | 0 | 0 | 0 |
| /submit (extra: the story-is box) | 390 | 1,466 | 0 | 0 | 0 | 0 |
| /submit (extra: the story-is box) | 1440 | 1,389 | 0 | 0 | 0 | 0 |

Run 1 is CURRENT run A against NEW run A, run 2 is CURRENT run B against NEW run B. In run 2 every page matched to the pixel. The two
non-zero counts are noise that both builds show, not a change:
- **/stories at 1440, 2,147 pixels:** only the antialiased edges of the tilted lead photo (rows 810 to 1281, largest channel
  difference 40 of 255). The photo's box, transform and chosen source are identical in both builds to the thousandth of a pixel
  (measured twice per build); the same 2,147 pixels differ between two CURRENT runs.
- **The story page at 1440, 47,641 pixels:** the end-of-story "Write for TLL" box and the "What the writer missed." notes block
  trade places from load to load (a race between `tll-story-ask-v1` and the notes block, which lands in either order). Seen between
  two CURRENT runs as well (at 390 in an earlier round, 44,000 pixels).

Earlier rounds, before the cover and the rotating word were held still, showed the same kinds of noise and nothing else: the dark
cover (1,108,445 pixels at 1440, in either build), the rotating word and the heading height it changes at 390, the story-ask race
and the photo-edge pixels.

### 5.3 States that do not show on a default load

The empty-region note on /stories, the staged series and expat pieces, and the broken-photo panel only appear after a click, with a
preview flag, or when a photo fails. For these, the same elements were added to /stories and /for-expats at 1440 with the CSS each
build injects, and every computed property was compared between CURRENT and NEW (24 element checks):

- 21 identical: the old inline empty note against the new `.tll-ui-empty` note, the series card tape and headline tape, the three
  small labels (`.tll-sr-k`, `.tll-ex-k`, `.tll-si-k`), the move-line label, the My moves margin, the sponsor link.
- Expat rail tape (staged, both pages): `max-width` none to 100%, `z-index` auto to 3, and the `ui-monospace` fallback added. This is
  the deliberate unification with the series card tape described in section 3; nothing shows it today.
- Broken-photo image on /stories: `display:block` to `none`. This is the deliberate fix in section 3. Shown with one card photo
  made to fail on /stories at 1440: before, an empty ink image box sits above the place-name panel and the card is 876px tall;
  after, only the panel shows and the card is 590px tall. Before and after crops, side by side:
  `claude/codebase-review-2026-11-12/noimg-before-after-1440.png` (left before, right after; the dark band at the top of the left
  crop is the site header passing over the card). No story on /stories is without a photo today, so no live page changes.

## 6. What you need to decide

1. **Release.** The new core and chunks are committed here only. To go live they need the usual release step (copy to
   `layers-release`, register the core at that commit with its new SRI). Until then www keeps running `6ebffe0f`.
2. **Deletions (nothing was deleted).**
   - Repo, duplicate page copies (audit 3): `src/pages/stories/v3/s3-stories.css` and `src/pages/stories/v3/s3-footer-block.html`
     (both repeat a block in `footer-v6-s3-full.html`); `src/pages/story/v3/style-st3-story-v1.html` (repeats
     `template-footer-after-st3.html`).
   - Repo media: none proposed for deletion. Proposed instead: move the 717 screenshot and evidence files (474.9 MB) to an archive
     branch with the same paths. If you prefer deleting, tier 1 (226 files, 208.3 MB, named nowhere) is the safe start.
   - Webflow assets: the high-confidence 39 (8.25 MB) listed in 2.2.
3. **Webflow-side clean-up.** Remove the 12 `--cc-*` and 5 unused `--tll-*` in the site head, `--h3-n` in the home embed,
   `--s3-line` and `--s3-paper` in the /stories footer, `--st3-ease` in the story template, and the 32 unused Webflow Variables.
   Retarget the broken Webflow class references (`--tll-midnight`, `--tll-mid`, `--tll-mid-dark`, `--tll-bone`, `--tll-marigold`):
   this changes colors on /stories, story pages and pet pages, so it is a visible choice.
4. **The /for-expats directory bug (R1).** The page code needs to read the Worker's `/expats-map` data (as the map layer does) or the
   new /travelers markup. This is the most important item for readers.
5. **Consistency choices that move pixels** (none made): one gray for small notes; label size, tracking and color role (teal on
   /stories, rose on /for-expats); card corner (4, 6, 10, 12, 14px today; the kit says 10); phone gutter 24px; one section width for
   the expat side; the /for-expats buttons on the site button set; the map label at 12px and its double padding; and whether the
   /stories page code and /for-expats `.tllx-empty` adopt `.tll-ui-empty`.
6. **Two deliberate fixes made here; say if you want either undone.** (a) A story card whose photo fails now shows only its
   place-name panel (before: an empty ink box above it), section 5.3. (b) The staged Living Library tape now matches the series
   card tape exactly (preview only). Both are invisible on www today.
7. **Smaller repo items for later:** drop `--rose-deep` at the next map release; drop the five unused share-card variables at the
   next share card build; copy `src/pages/heroes-2026-10-29/code/for-expats-*.html` to `src/pages/for-expats/` as the named source.
