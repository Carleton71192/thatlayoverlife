# Sweep Nov 21, 2026, lens DEFRAG: what runs where, what is duplicated, what is dead weight

Read only. No Webflow write, no publish, nothing unregistered or deleted. No member data in this file.

## How

- Webflow reads (Nov 22, 2026, session ses_3Kwn..., agent opus-5.5|claude-code|dfrgq): get_site_scripts, get_registered_scripts
  (the tool returns the newest 100 of 265 and has no offset field), list_pages (96 pages), get_page_scripts on 30 pages,
  get_site_freeform_code, get_page_freeform_code on 24 pages, get_registered_script on 20 applied page scripts.
- The cached HTML and script files of this sweep (sweep-cache, one GET each, nothing new fetched from Webflow hosts by this lens).
- The repo at aa85a85: the v16 build (run once, deterministic: the core's SRI equals the live 16.68.0 registration,
  sha384-a9tc...2st), vitest 759 of 759, git history of the core.
- A trial cherry-pick of origin/claude/codebase-refactor-2026-11-12 in a scratch worktree (removed afterwards, nothing pushed).

Evidence files in `reports/evidence/sweep-2026-11-21/defrag/`: custom-code-sizes.txt, site-code-inventory.txt,
page-scripts-2026-11-22.txt, core-trend.txt, core-sections.txt, snapshot-match.txt.

## Result in one line

Nothing is broken by fragmentation today, but four custom code blocks sit at 90 to 97 percent of Webflow's 50,000 limit, the
site script list is full (15 of 15) with six slots holding one-page or no-target code, 55 percent of the core runs on one
page only, and about 97,700 characters of page and site style arrive at the end of the body.

## Findings

Risk and payoff are scored L, M, H. "Proposal" means nothing was changed.

1. **F1 (new): custom code blocks are close to the 50,000 character limit.** All widths. Site head 48,441 (96.9%), /share-photos
   page footer 48,127 (96.3%), /the-map page footer 46,100 (92.2%), /account page footer 44,941 (89.9%), site footer 44,807
   (89.6%), /stories page head 35,602 (71.2%). The next fix in the site head has 1,559 characters of room. The site head and
   footer also travel inline in every HTML view (93.2 KB, 28.6 KB gzip per page view, never cached), while the core is cached.
   Severity medium (blocks future work). Fix lives in the core layer (src/site-layers) plus page code. Smallest fix: move the
   PWA client out of the site footer (`tll-pwa-v1-js` 12,778 B and `tll-pwa-v1-css` 2,647 B; the Worker is not live and the core's
   tll-pwa-hold answers its HEAD /sw.js with a local 404) into a staged chunk, and move `tll-proto-parity-v1` (6,205 B) and
   `tll-proto-parity-js-v1` (10,027 B) from the site head into the core. Frees about 15,400 in the footer and 16,200 in the head.
   Risk M, payoff H.

2. **F2 (new; overlaps debug D6 and D12): the site script list is full, and six slots hold one-page or no-target code.**
   15 of 15 applied. `tll_world_map_v1` needs `#tll-map-canvas` (0 of 33 cached pages); `tllmapv3` drives the old map (debug D6);
   `tll_save_story`, `tll_reader_notes` and `tll_reader_notes_form` return at once unless the path is /stories/{slug};
   `tll_saved_shelf` returns unless the path is /account; the places sync runs on every page for members (debug D12). Severity
   medium (no slot for the next site script). Fix lives in Webflow site and page scripts (decision for Nancy, the story and account
   scripts talk to Memberstack). Smallest fix: apply the three story scripts to the Stories Template and the /account one to
   /account as page scripts with the same ids and versions (page scripts have no 15 cap), then remove them from the site list;
   remove the two map scripts after the debug D6 check. Frees 4 to 6 slots. Risk L to M, payoff M.

3. **F3 (new): the core has grown 70 percent in 17 days and over half of it runs on one page.** All pages, all widths. 16.50.0
   (Nov 1, the split) 158.9 KB / 46.1 KB gzip; 16.68.0 271.0 KB / 81.9 KB gzip (core-trend.txt). One-page code inside it:
   cover layer 61.5 KB, home-value 10.3, library-hold 4.6, home-bands 4.2 and rail-hold 1.1 (home only, 81.7 KB together), story
   layer 40.0 KB (/stories/{slug}), photos-form-v2 18.1 KB (/share-photos), album-settings 6.5 KB (/the-map), stories-noimg
   2.7 KB, lounge-labels 1.2 KB: 150.2 KB of 271.0 (core-sections.txt). It is synchronous in the head, so every first visit
   downloads and every page view parses it. Severity medium. Fix lives in the core build plus Webflow page scripts. Smallest fix:
   build photos-form-v2 and album-settings as page header scripts for /share-photos and /the-map from the same commit (they only
   need to run before the page's own body script); later the same for the home and story sections, after checking that Webflow
   places page header scripts after the site header scripts. Risk M (release step grows by one registration per page), payoff H
   (up to about 48 KB gzip less on a first visit to a page that is neither home nor a story; 9.4 KB for the smallest step).

4. **F4 (new, partly proposed before): about 97,700 characters of style sit at the end of the body.** All widths. Footer code
   blocks with style: /share-photos 29,606, Stories Template 21,623, /the-map 16,048, site footer 15,109 (five blocks, every page:
   tll-pass-a, tll-core-v2-css, tll-forms-v2, tll-note-v1-css, tll-pwa-v1-css), /travelers 3,656, /my-pets 3,563, /submit
   3,126, /account 2,743, Countries Template 1,141, /stories 1,060 (custom-code-sizes.txt). The core works around them with
   copies (tll-ms-blocks-early-v1 in the site head repeats tll-core-v2-css; the story layer's A2 early style repeats template rules;
   first-paint copies 12 rules; early-state follows page code). Severity medium (late paints, and each copy is one more thing to
   keep in step). Fix lives in page code. Smallest fix: move each page footer style block into the same page's head block; all fit
   (/share-photos 719 + 29,606, Stories Template 19,034 + 21,623 = 40,657, /the-map 13,217 + 16,048). Then retire the matching core
   copies in a later build. Already proposed for /travelers, /the-map and /about in reports/evidence/cls-sweep-2026-11-16/fix.md
   (lines 168 to 172); new for the others. The site footer styles do not fit in the site head (F1); they belong in core STYLES.
   Risk M (cascade order against the core's own styles has to be checked per page), payoff M.

5. **F5 (new): legal and promise copy is rewritten by a site script, so the page says one thing and readers see another.** /terms,
   /support, /contact, all widths. `tllfactsv1` 1.1.0 (site-wide) swaps "We act within 7 days." and "We respond within 3 business
   days." on /terms and /support, "editorial 48h · ..." on /contact and /support, and "A different editor reviews. Within 14
   days." on /support (cached HTML still carries all of them). Crawlers and readers without scripts get the Designer text.
   Severity medium (a legal page with two versions). Fix lives in content (Designer text), then the rules come off the script.
   KNOWN in part: NANCY-WHEN-HOME "Promise lines" (that item quotes the Designer text, which readers with scripts do not see) and
   "Trust pass leftovers: /terms". Decision for Nancy.

6. **F6 (new): the "one focus ring" is one of 19.** All pages, keyboard users. The core's tll-focus-v1 sets a 2px rose ring (#C8325B); the
   site head, site footer and 19 page code blocks set their own `:focus-visible` outlines: 19 distinct values in all, ten fixed
   (2px or 3px in seven colors; 3px #D63859 alone on 8 page blocks), seven page tokens, and `none` or `0` in three places. Page code wins
   on its pages, so the ring changes color and width from page to page. Severity low. Fix: decision for Nancy (one ring), then the
   page rules come off (page code) and the core rule stays. Risk L, payoff M (design consistency).

7. **F7 (new): two runtime contrast repairers run on every page.** All widths. Site head `tll-proto-parity-js-v1` walks up to 5,000
   elements with getComputedStyle after load; site footer `tll-a11y-motion-v1` (5,859 B) also repairs accent text after load; the core
   has tll-contrast-v1 as CSS. The home page script `tll_postcard_contrast` exists only to stop the runtime checker darkening white
   postcard text (its own comment). Severity low (CPU on phones, colors changed after paint). Fix lives in the core layer. Smallest
   fix: list what the two repairers change on the 33 cached pages in one browser run, put those colors into tll-contrast-v1, then
   switch the runtime repair off. Risk M (colors), payoff M.

8. **F8 (new, proposal only): four layers decide when member and visitor blocks show.** /account, /submit, /share-photos, /my-pets,
   /edit-profile, all widths. `tllgateflashv1` (page script on those five), site head tll-ms-blocks-early-v1, site footer
   tll-core-v2-css and the core's early-state nav piece all touch the visibility of `[data-ms-content]` blocks. Severity low. Fix:
   decision for Nancy (data-ms-* elements are not touched here). Smallest fix: none until a session can test signed-in states on
   the test site; then one owner for the rule (the core, since it is first in the head).

9. **F9 (new): dead or superseded page scripts are still applied.** /stories: `tllstorycountv2` and `tllstorycountv3` (the core's
   tll-stories-count-v1 says "both can come off the page code later"; v2 still fetches /sitemap.xml when the visit has no count
   cached). Home: `tll_home_story_counter` (its target `[data-tll-story-count]` is on 0 cached pages). Contributors Template:
   `tllpf3guardv1` (sets `window.__tllProfStats`; nothing in site code, page code, the core or the chunks reads it). Severity low. Fix
   lives in Webflow page scripts. Smallest fix: remove those four from their pages at the next release (proposal). Risk L, payoff L
   (four script requests; the sitemap download itself is KNOWN: NANCY-WHEN-HOME "D1 and D2" and debug D13).

10. **F10 (KNOWN, new detail): the refactor branch still applies, with one test fix.** origin/claude/codebase-refactor-2026-11-12 is
    3 commits ahead and 185 behind (base af568b5, Nov 12). Its layer edits (components, expat, expats-map, series, stories-noimg,
    stories-places, story-is) apply cleanly: none of those sources changed since. The build script has 3 conflict hunks, all
    additive (docstring, STYLES, CORE comments); the core and chunks are regenerated, not merged. Trial result: core 271.0 to 273.6
    KB (81.9 to 82.8 KB gzip); vitest 756 of 780: 24 fail in test/submit-account-read, submit-send-wait and submit-sent-draft
    (written Nov 18 to 21) with "Cannot read properties of undefined (reading 'el')", because story-is-v1 now needs
    `window.__tllUI` and those harnesses load the submit chunk without the core. Smallest fix: load tll-components-v1.js in those
    three harnesses (or a fallback in story-is), then the usual release. R1 (empty experts list on /for-expats) is still live (debug
    D1). KNOWN: NANCY-WHEN-HOME "Codebase refactor branch awaiting your OK". Risk M, payoff M.

11. **F11 (new): two exports on /account do different things.** /account, signed in. "Export my data" is taken over by the page
    script `tllexportv1` (a JSON file built in the browser from the account and this device's tll* storage); "Download everything"
    is the account chunk's tll-export-v1 (the Worker's zip and photos in parts). Severity low (confusing). Fix: decision for Nancy
    (keep one), then page script or Designer link. Risk L, payoff L.

12. **F12 (new): old builds and unused layer files sit next to the live ones.** Repo only. build-site-layers-v2 to v15 and
    tll-site-layers-v1 to v15: 29 files, 704,763 bytes, read only by October probe scripts under src/pages (no test, no build).
    Also not in the v16 build: tllflagsv4, v5, v51, v52; tll-card-lang-v1, tll-story-translate-v1, tll-submit-lang-v1 (staged
    multilingual, waiting), tll-kofi-v1 (waiting on the Ko-fi link), tll-v9-departures-v2 (.js and v1/v2 .html), tll-v9-chrome,
    tll-v9-tags-travelers, tll-v9-type, tll-live-counts v2, v2-1 and v3 (.html), tll-flow-v1 (.css.html, .js.html), the two older
    contrast and nav-phone .js wrappers, v9-1/ and v9-b/, story-hero-sizes-v1.json and a 103 KB PNG. Kept on purpose: tllflagsv53.js
    (read by the build), tllinlinephotosv2a/b.js (sources of live page scripts; same code as the registered files apart from
    escaping), tll-share-v1.js (source of dist/tll-share-v1.min.js, live on /account and /the-map). Severity low. Fix: git mv the
    old builds and the retired files into src/site-layers/archive/ (jsDelivr pins point at commits, so nothing live changes). Risk
    L, payoff L to M (fewer wrong files for the next session).

13. **F13 (new; media part KNOWN): page snapshots are many, and half the live page code has none.** Repo only. src/pages is 173 MB
    (160 MB images) in 171 snapshot units (account 21, home 17, the-map 15). Of 44 non-empty live code blocks read today, 27 match a
    saved file exactly and 17 match none (home footer, /stories head and footer, /the-map head and footer, /account head and footer,
    Contributors Template footer, /login and /signup heads, /gallery head and footer, Pets Template head and footer, /destinations,
    /for-press and /the-paw-passport heads; snapshot-match.txt). The build's
    copy checks read saved files only; all 32 copied pieces checked against today's live HTML are still present (no drift today).
    Severity low. Fix: a read-only script that saves every page's head and footer into one src/pages/<page>/live/ folder, and
    archive the dated folders that no build or test names. Moving screenshots to an archive branch is KNOWN (refactor updates.md
    6.2). Risk L, payoff M.

14. **F14 (new): stale "staged" and "draft" labels on live code.** tll-home-value-v1 says STAGED in its header while `PUBLIC=true`
    (live in the core); the site head blocks tll-v91-hero-scrim-v1 and tll-v91-motion-v1 say DRAFT (dated Oct 6, 2026, and live in the site head today).
    Severity low (misleads the next session). Fix: comments at the next build and the next site head edit. Risk L, payoff L.

15. **F15 (new): code for a page that is a draft.** tll-open-slots-v1 in the misc chunk runs only on /spotlight, and the site head
    rule `.tllsp-feat` styles only /spotlight; /spotlight answers 301 (draft). The site head `tll-shelf-fix` block (1,061 chars)
    styles classes found in no cached page's markup (check in the Designer before removing). Severity low. Fix: core build (move
    open-slots to the staged list) and site head (with F1). Risk L, payoff L.

16. **F16 (new): /login and /signup carry the same page code twice.** Head style 11,940 characters identical, footer 6,017
    characters byte-identical; only the canonical and robots lines differ. Severity low. Fix: one source file in src/pages/auth
    (exists for the footer as au3-footer-block.html) used for both, or a core layer guarded to /login and /signup. Risk L, payoff L.

17. **F17 (new): registered script versions pile up.** 265 registered (150 on Oct 13); the newest 100 hold 75 versions of
    tllsitelayersv16 (16.0.0 to 16.68.0, the rollback trail) and unapplied ids tllsitelayersv5 to v15 and tllconsentmodev2 (its
    code is now the first part of the core). Webflow's cap is 800, and deleting an id deletes all its versions. Severity low. Fix:
    none needed now; at 600, delete the unapplied old ids (decision for Nancy). Risk L, payoff L.

## Checked and fine

- The repo core is byte for byte the live 16.68.0 (SRI matches the registration); the build is deterministic.
- Every jsDelivr file the live pages load (ten pins: core, member-way, photo-clean, share, quick-log, acct-stories, photo-send, map
  2.0 css at two pins, owner-record) is unchanged at HEAD, so no repo source has drifted from what runs. If the repository goes
  private (KNOWN: NANCY-WHEN-HOME "Repository move"), all ten stop loading.
- The site head and footer read today are the same bytes as src/site/live-2026-11-13/fonts/site-head.after.html and
  site-footer.after.html, which the build's checks read.
- Registered inline sources of tllinlinephotosv2a/b and tllflagsv53 equal the repo copies apart from escaping.
- No chunk file is stale (the build removes them); every CHUNKS path has a page.

## Not done

- No browser run (one browser at a time on this machine; nothing here needed one). F7 needs one before any change.
- Registered scripts past the newest 100 were not listed (no offset in the tool).
