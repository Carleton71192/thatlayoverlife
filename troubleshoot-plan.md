# Troubleshoot plan (26 October 2026)

Symptoms in scope (Nancy, 26 Oct: "All of the above"):

- A. The mobile layout is a mess: home first, then the other pages.
- B. Members cannot edit their stories.
- C. Photo and form submits fail: Jay on /submit, /share-photos and /my-pets.

Nothing below has been changed yet. Each step waits for Nancy's go.

## Limits on this diagnosis

- The cloud sandbox cannot reach thatlayover.life, that-layover-life.webflow.io, cdn.jsdelivr.net, unpkg.com or cdn.prod.website-files.com (proxy refuses them). So nothing here was checked in a live browser. Evidence comes from the Webflow API (page code, page scripts, element tree), the repo, and offline tests.
- Eight site-wide scripts are Webflow-hosted inline scripts (tllformcontrolsv3, tllformlabelsv1, tllmapv3, tll_world_map_v1, tllavatarv1, tllreveal, tllfactsv1, tll_global_word_wrap). The API returns their metadata, not their code, and their host is blocked here. They are flagged as "to read" below, not diagnosed.

## A. Mobile layout

### Root cause

The site-wide look is not one stylesheet. It is a stack of patches written over five weeks, each overriding the last with `!important`, in the site head custom code (copy: `src/pages/spotlight/live-2026-10-25/site-head-before.html`):

| Fact | Where |
| --- | --- |
| 44,061 of the 50,000 characters Webflow allows | site head |
| 14 style blocks and 11 script blocks, 18 named layers: tll-embed-mode, tll-shelf-fix, tll-craft-polish, tll-proto-type-v1, tll-consistency-v1, tll-live-stories-v1, tll-mobile-nav-v1, tll-proto-parity-v1, tll-v9-chrome-v1, tll-v9-type-v1, tll-v91-hero-scrim-v1 (still marked DRAFT), tll-v91-motion-v1, tll-floor-v1, and more | site head |
| 148 `!important` in the head, 75 more in the site footer | head and footer |
| Seven phone breakpoints: 359, 600, 640, 767, 899, 991, 1199px | head |

Specific rules that produce the items in `handoff/MOBILE-HOME-CRITIQUE-2026-10-23.md`:

1. **Teal eyebrow on a photo (critique 2).** Head line 61: `[class*=eyebrow]{color:var(--tll-teal-l) !important}` paints every eyebrow on the site teal, whatever sits behind it. Line 62 handles a list of dark sections but not the home photo. The 6 Oct scrim fix (line 291, "DRAFT") was meant to cover this and never got finished.
2. **Headline breaks into three lines (critique 3).** Head line 283: v9 J11 sets the home hero to 148px with line-height .94. On a 390px screen that leaves about three words per line. There is no phone size and no `text-wrap: balance`.
3. **"Tell the editor" covers content (critique 7).** Site footer line 278: `#tll-note{position:fixed; bottom:16px; left:16px; z-index:60}`. Nothing reserves space for it, so it covers whatever sits at the bottom of the screen: the FREE FOREVER line on home, and the PROFILE / UP / DONE row on /account (Nancy's screenshot of 26 Oct).
4. **Two button shapes in the header (critique 1).** The MENU box comes from tll-v9-chrome-v1 (head lines 226 to 258, J07 "MENU under 900px"). The rounded name pill comes from the Memberstack nav styles. Nobody chose one shape for both.
5. **Dead space, half-width lede, left-aligned buttons (critique 4 to 6).** The home hero embed (13326a8e) and the global padding rule at head line 63 (`padding-top:88px !important` on every hero with an h1), with a phone override at line 65, stack their spacing.

### Files and lines

- Webflow site head custom code: lines 60 to 65, 226 to 258, 283 to 296 (the copy in the repo).
- Webflow site footer custom code: line 278 (`#tll-note`).
- Home hero embed 13326a8e (page 69d6145df421c777840c1e46).
- To read before touching: the eight Webflow-hosted site scripts listed above. `tll_world_map_v1` and `tllmapv3` load on every page, so they may also slow every phone page down.

## B. Members cannot edit stories

### Root cause

Story editing runs through the Worker in `worker/` (`tll-worker`: GET /story, POST /story/update, /story/mine, /story/unpublish; code in `worker/src/story-edit.js`, 83 tests). That Worker has never been deployed:

- `worker/wrangler.toml` has its KV id filled in, but the three secrets (ANTHROPIC_API_KEY, MEMBERSTACK_SECRET_KEY, WEBFLOW_API_TOKEN) have not been set, and `wrangler deploy` has not been run. Only Nancy can do those (the rule is that she sets secrets herself).
- The other Worker, `tll-travel-wire` at the repo root, is live (`https://tll-travel-wire.thatlayoverlife.workers.dev`). It serves /profile/save, /map-snapshot and /owner-map, so profile editing already works. It has no story routes.

Because of that, the front end waits on a Worker address that does not exist yet:

| Waiting piece | Where | State |
| --- | --- | --- |
| "Edit this story" link | Stories Template embed 5496c6ff | Hidden until a `data-tll-worker` address is on the page (25 Oct fix) |
| Edit / Take down / Put it back on /account Stories | script tllacctstoriesv21 (`src/pages/account/tll-acct-stories-v2.js`) | Hidden; falls back to a read-only list |
| /submit v5 with edit mode (`?story=`) | `src/pages/submit/v5/` | Built and tested, never applied; /submit still runs the old native form |

The `?edit=` address that sent Jay to the Webflow login is already fixed (`?story=` since 25 Oct).

### Choice for Nancy (affects step B2)

- B-1 (as built): deploy `worker/` as its own Worker. It needs the three secrets above.
- B-2: move the story routes into the live `tll-travel-wire`, which already holds a Webflow token and a Memberstack key. That means one Worker and fewer secrets, but code has to move between the two.

The recommendation is B-1, because the code and its 83 tests are ready and nothing else has to change.

## C. Photo and form submits

### Root cause (already fixed for the reported cases)

Each failure Jay hit traced back to one pattern: more than one script listened for the same form's submit, and the order they ran in decided whether the form sent. The old registered script `tll_photo_upload_v1` also uploaded original photos (location included) the moment they were chosen.

| Page | Form | Now | Fixed |
| --- | --- | --- | --- |
| /share-photos | share-photos | tllphotosendv1 | 23 Oct, test 14/14 |
| /my-pets | add-pet (avatar, pet-gallery) | tllphotocleanv1 | 24 Oct, test 10/10 |
| /submit | Story submission (hero-image required, photo-gallery) | tllphotocleanv1 | 24 Oct, **not tested against the live /submit page code** |

Site-wide scripts on every page (Webflow API, 26 Oct): tll_memberstack_init_v2, tll_memberstack_skin_v1, tll_world_map_v1, tllfactsv1, tllreveal, tll_ledger_sync, tll_save_story, tll_saved_shelf, tll_reader_notes, tll_reader_notes_form, tllformcontrolsv3, tllformlabelsv1, tllavatarv1, tllmapv3. No photo uploader runs site-wide.

### Remaining risks (to close)

1. `src/components/photo-clean/tll-photo-clean-v1.js` line 41 takes over the submit of any form with a chosen photo, except /share-photos. If it is ever applied to a page with a Memberstack form that holds a file field, it would hold that form. That breaks the rule never to touch data-ms-* elements. Fix: also skip `form[data-ms-form]` and any form inside `[data-ms-content]` that Memberstack owns.
2. /submit: the live page code (the three-step script and the hero-image `required` field) has never run together with photo-clean in a test. A required file field on a hidden step can block the browser's own check without showing a message.
3. `tllformcontrolsv3` (site-wide, header) restyles form controls on every page, file fields included. Its code cannot be read from here. Read it once the CDN host is allowed.
4. `tll_photo_upload_v1` is still registered, though it now runs on no page. Leave it registered (rule: nothing deleted), and record that it must never be applied again.

## Plan

Order: C first (code only, testable offline today), then B (needs Nancy's deploy), then A (needs the network hosts allowed for screenshots).

### Step 1 (C1): harden photo-clean and test it against the live /submit page

**Done 26 Oct, live.** Commit 2201983, registered tllphotocleanv11 (SRI sha384-AAifp68s8YonZMUePqdmkqh1tCcdKPmYFwY640tgYRXuXGeynwK9F5ARXarResAO). It replaces tllphotocleanv1 on /my-pets and /submit (v1 stays registered). Publish 134b55db-aea0-43d6-b3e8-f100e929dca0.
- The live /submit footer code is saved in `src/pages/submit/live-2026-10-26/page-footer.html`. The story form markup (13 Oct export) is in `form-story-export-2026-10-13.html`.
- Finding: the /submit story form itself carries `data-ms-member-bound`. A blanket "skip any data-ms- form" rule would have switched photo cleaning off on /submit. The guard therefore skips only `form[data-ms-form]` and file fields that carry a data-ms-* attribute.
- `submit.mjs` passes 15/15. Against the old version it fails 2 of 15: the old version took over a Memberstack form and stripped its field name.
- Extras done in this step: `vitest.config.js` excludes `worker/**`, so `npx vitest run` is clean (15 files, 176 checks). The sample-map and spotlight tests now write into their own folders instead of the folder they are run from.

1. Read the live /submit head and footer code and its embeds through the Webflow API (read only). Save copies to `src/pages/submit/live-2026-10-26/`.
2. In `tll-photo-clean-v1.js`, skip forms Memberstack owns (`form[data-ms-form]`, or a form whose file field carries a `data-ms-*` attribute).
3. Add `src/components/photo-clean/test/submit.mjs`: a page built from the saved /submit code plus photo-clean, with fake Cloudinary and a fake Webflow form handler. Covers: hero and gallery photos upload once with no location data; the form sends once with the links in `hero-image` and `photo-gallery`; the three-step script still moves between steps; a missing required field stops the send before any upload; and a Memberstack form with a file field is left alone.
4. Commit, register the new version (new script id, pinned commit and SRI), and swap it in on /my-pets and /submit. Publish on Nancy's go.

Tests:
- `node src/components/photo-clean/test/test.mjs` (existing, 10 checks, must stay green)
- `node src/components/photo-clean/test/submit.mjs` (new)
- `node --check src/components/photo-clean/tll-photo-clean-v1.js`

Regression checks:
- /my-pets: the pet editor and pet extras scripts each run exactly once (existing test).
- /share-photos: photo-clean still skips it (`node src/pages/share-photos/v3/test/round-4-send/test.mjs`, 14 checks).
- Memberstack sign-in, sign-up and profile forms: a form with `data-ms-form` is untouched (new test case).
- Forms with no photo chosen send exactly as before (new test case).
- Manual, after publish: Nancy or Jay adds a pet with a photo on /my-pets, and sends a test story with a hero photo on /submit. The Webflow form submission shows Cloudinary links. Download one link and check it has no location data (Photos > Info on a phone, or `exiftool`).

### Step 2 (B1, Nancy): deploy the story Worker

Nancy runs these from `worker/`: `npx wrangler secret put ANTHROPIC_API_KEY`, then the same for MEMBERSTACK_SECRET_KEY and WEBFLOW_API_TOKEN, then `npx wrangler deploy`. She sends back the workers.dev address. No token is pasted into chat.

Tests:
- `node --test worker/test/*.test.js` before the deploy (83 checks)
- `curl -sS https://tll-worker.<subdomain>.workers.dev/health` after the deploy (Nancy, or this session once the host is allowed)

Regression checks:
- `tll-travel-wire` is untouched: `npx vitest run --exclude 'worker/**'` at the repo root, and `/health` on the travel-wire address.

### Step 3 (B2): wire story editing to the Worker

1. Add `<div data-tll-worker="WORKER" hidden></div>` to the Stories Template and /account.
2. Apply /submit v5 (`src/pages/submit/v5/`) to /submit, keeping every existing form name and field name.
3. Publish on Nancy's go.

Tests:
- `node --test worker/test/*.test.js`
- The submit v5 offline tests in `src/pages/submit/v5/`
- `node map-2.0/test-sample/test.mjs`, which confirms the map embed did not change.

Regression checks:
- New story submissions still arrive (send a test story, then take it down).
- The "Edit this story" link shows only to the story's owner.
- A signed-out visitor sees no edit link.
- No address on the site uses `?edit=` (`grep -rn "?edit=" src worker/src` returns nothing).

### Step 4 (A1, needs hosts allowed): measure before changing

Nancy adds these hosts under Network access in the environment settings: thatlayover.life, www.thatlayover.life, that-layover-life.webflow.io, cdn.jsdelivr.net, cdn.prod.website-files.com. Then:

1. Screenshot home, Stories, Travelers, the map and /account at 390 and 1440. Do the same for prototype 3.4.
2. Read the eight Webflow-hosted site scripts.
3. List every difference.

Tests: a Playwright screenshot script saved under `reports/mobile-2026-10/`, rerun after each fix.

### Step 5 (A2): one site stylesheet in place of the patch stack

1. Move the site head style layers into one hosted stylesheet, `src/site-layers/tll-site-v10.css`, pinned on jsDelivr. Use one set of breakpoints (480, 768, 1024) and keep `!important` only where Webflow's own CSS forces it.
2. Replace head line 61 (every eyebrow teal) with colors by background: teal only on dark grounds, rose #C8325B or teal #067A79 on light.
3. Give the home hero a phone type size (about 52px, `text-wrap: balance`), full-width buttons, and the lede under the headline, per prototype 3.4.
4. Pin "Tell the editor" so it never covers content: add matching bottom padding on phones, and hide it while the hero is on screen.
5. Use one shape for the header buttons.

Tests:
- The Step 4 screenshot script at 390 and 1440, before and after
- Contrast checks for text on its background (axe-core in the Playwright script)
- The site head size goes down, with a target under 25,000 characters

Regression checks:
- Story pages, country pages, /travelers, /account, /edit-profile, /the-map, /submit and the Memberstack sign-in and sign-up screens, each screenshotted at 390 and 1440.
- No data-ms-* element is styled differently. The axe run shows no new contrast failures.
- The banned-word and counts rules still hold (no typed counts in the new CSS content strings).

**Done early, 26 Oct (live):** items 3 and 4 for the home hero on phones, as a phone-only layer (`src/pages/home/tll-home-hero-phone-v1.html`) appended to the hero CTA embed 13326a8e. Before and after code are in `src/pages/home/live-2026-10-26/`. It was checked offline, because the hosts are still blocked: `node reports/mobile-2026-10/harness/render.mjs <out.png> src/pages/home/tll-home-hero-phone-v1.html [width] [height]` renders the 13 Oct export with today's CTA markup and a stand-in photo. At 390 and 360: the headline is 52px on two lines, the eyebrow is hidden, the buttons are full width, the FREE line is #00C9C8, the coordinates are top-right, the pill does not cover the copy, and there is no sideways scroll. At 768 the page is pixel-identical to before. Still to check against the live page once the hosts are open. Item 5 is done too (26 Oct, live): the site script `tllnavphonev1` is pinned to a38abb0 with an SRI hash, and its source is `src/site-layers/tll-nav-phone-v1.html`.
- On phones, Sign up, the account button and MENU share one square shape at 44px.
- The header fits on one row from 360px up and drops from 114px to 81px tall.
- At 768 the page is pixel-identical to before. The MENU drawer still opens.
- Check with `node reports/mobile-2026-10/harness/nav-probe.mjs <out.png> src/site-layers/tll-nav-phone-v1.html <width>` (MEMBER=1 for signed in).

### Step 6 (A3): page by page

Stories, Travelers, the map and Account, one packet each: screenshot, list, fix, screenshot again, Nancy approves, publish.

## Baseline (26 Oct, before any change)

- Story Worker `node --test worker/test/*.test.js`: 83/83.
- Root `npx vitest run`: 176/176 checks pass, but it reports 3 "failed" files. The cause is that vitest also collects `worker/test/*.test.js`, which use node:test, so it finds no suites there. That is a false alarm, not a regression. Fix within step 1: add a `vitest.config.js` that excludes `worker/**`, so a plain `npx vitest run` is clean.
- photo-clean 10/10, share-photos 14/14, member-way 17/17, quick log 25/25, sample map 8/8.

## Test commands, all in one place

```
node --check <every changed .js file>
node src/components/photo-clean/test/test.mjs
node src/components/photo-clean/test/submit.mjs        # new in step 1
node src/pages/share-photos/v3/test/round-4-send/test.mjs
node src/components/member-way/test/test.mjs
node src/components/quick-log/test/test.mjs
node src/pages/spotlight/live-2026-10-25/test/t-footer.mjs
node map-2.0/test-sample/test.mjs
npx vitest run test/map-editing.test.js test/map-live-counts.test.js test/map-merge.test.js
npx vitest run --exclude 'worker/**'                    # travel-wire Worker (176 checks)
node --test worker/test/*.test.js                       # story Worker
```
