# Independent check of the class B page code drafts (27 Nov 2026)

Checked: branch claude/classb-2026-11-25 at 01e8ab5, folder reports/evidence/classb-2026-11-25/ on that branch. This file sits on
claude/new-session-zxm063, which does not carry the drafts themselves. Nothing was written to Webflow, Memberstack, Cloudinary or the
Worker. No publish, no form sent. Webflow MCP use was read only (get_page_freeform_code, get_page_scripts, list_pages).

**Overall verdict: PASS WITH NOTES.** All five drafts and the combined /submit footer do what their READMEs say, change nothing else,
keep every data-ms-* attribute, form name and field name, stay far under the 50,000 limit and follow the writing rules. The notes are
for Nancy (copy and look of B08 and B15) and for the README of B17, whose test-site check cannot pass on the live page as it stands.

| Item | Block | Verdict |
|---|---|---|
| B02 /submit autosave | footer | PASS WITH NOTES |
| B15 /submit step bar | footer | PASS WITH NOTES (look needs Nancy's OK) |
| B02 + B15 combined | footer | PASS |
| B18 /submit picker roles | head | PASS |
| B17 /edit-profile script id | footer | PASS WITH NOTES (README check unachievable) |
| B08 part 1 /my-pets heading | footer | PASS WITH NOTES (copy needs Nancy's OK; char count off by 2) |
| Triage of the other 21 items | | Agree, with one challenge (B16, /stories part) |

## 1. Are the before blocks the live blocks today

- Three plain GETs today of www /submit, /my-pets and /edit-profile (595,944 bytes of HTML, no assets), split with
  tools/page-code-from-html.py. All five blocks (/submit head and footer, /my-pets footer, /edit-profile head and footer) are
  byte-identical to before.html (and head-unchanged.html). The 25 Nov saved HTML and the 21 Nov cache give the same bytes; the only
  difference is the trailing newline the split files carry.
- Webflow MCP get_page_freeform_code today (stored, unpublished state) for /submit head and footer, /edit-profile footer and /my-pets
  footer: same text as before.html on a line by line read, including every line the drafts replace and the /my-pets combining-mark
  regex. As with the builder, no hash was taken of the MCP text itself, so before any write the sha384 check against hashes.tsv stays
  required.
- hashes.tsv: all 12 sha384 values (hex and SRI) recomputed and correct. build.py, run on a copy, rebuilds every after.html and
  hashes.tsv byte for byte.
- Character counts: correct for every block except /my-pets. That block holds two characters outside the basic plane (paw and polar bear
  emoji), so its JavaScript length is 14,470 before and 14,776 after, not 14,468 and 14,774 (build.py counts code points). Far under the
  limit either way.

## 2. What each after block changes

Diffs read line by line. Every draft is one contiguous insertion or replacement at the point its README names. A scan of before and
after for data-ms-* attributes, name= and [name=...] selectors, data-tll-form values and element ids finds no change except the one id
B17 intends (tll-edit-dir-v1 on the script becomes tll-edit-dir-v1-js). The combined /submit footer equals B02 plus B15 and nothing else.

Writing rules on all added lines (code comments and strings): no em or en dashes, no exclamation marks in prose, no word containing
s-h-i-p, no "l-e-d-g-e-r" or "f-i-l-e-d", US spelling. The words that do appear in the diff come from the live /edit-profile code copied verbatim
into before.html and after.html (a script id and card name from September); they must stay for an exact rollback. Nits: the test file
test/classb-2026-11-25.test.js checks prose with a regex literal that spells the banned words, and its header says before.html was
"read with the Webflow MCP" while the bytes came from published HTML (the evidence README says it correctly).

Tests: vitest 871 of 871 and worker 83 of 83 pass in the check worktree.

## 3. Browser A/B on cached pages

Harness: one Chromium at a time, closed after each set. Top-frame HTML is today's GET copy with the before block swapped for an after
block (asserted found exactly once). Core 16.69.0 and photo-clean served from git at their pins (77b56b3f, f67f3f74). Webflow-host
assets from the 21 Nov sweep cache only; a miss is aborted (the only miss was a same-site fetch of /stories, in every load). Today's
webflow.schunk (a411e893) is not in the cache, so the cached 21 Nov schunk is served in its place for every variant. Every non-GET is
aborted (5 per /edit-profile load, in both variants; 0 elsewhere). Memberstack is a local stand-in with a made-up member and no name.
Pets used in the tests are made up. 126 browser page loads in all, 0 bytes from Webflow hosts.

Signature comparison: every visible element keyed by tag, classes and ancestors, with box, a few computed styles, own text, role and
aria-pressed. Two runs per cell; before against before shows no differences in any cell, so every difference below is the draft.

| Page, width, member | B02 | B15 and combined | B18 | B08 | B17 |
|---|---|---|---|---|---|
| /submit 390 in | none | 3 styles (the segments) | 2 attrs (role) | | |
| /submit 390 out | none | none | none | | |
| /submit 1440 in | none | 3 styles, 95 boxes move down 39 px | 2 attrs (role) | | |
| /submit 1440 out | none | none | none | | |
| /my-pets 390 and 1440 in, 0 pets | | | | 2 texts, 2 widths | |
| /edit-profile 390 and 1440 in | | | | | none |

Console errors and page errors: identical counts in before and after for every cell (0 page errors; the console errors are the aborted
fetches). CLS: no change beyond noise. Signed out, /submit CLS is 0 to 0.0004 in every variant. Signed in, every variant including
before shows a large late shift (about 0.77 at 1440, and 0.85 or 0.0004 at 390 depending on the run) from a footer move about 1 s in;
it comes from the stand-in setup (stub member, aborted fonts, the older schunk) and is the same with and without the drafts. The B15 step
bar sits below the first screen at both widths, so its larger height adds no measured shift.

### B02 /submit autosave: PASS WITH NOTES

Signed in, body field, at 390 and 1440, variants before, B02 and B02+B15+B18:

| Test | before | B02 and all |
|---|---|---|
| Type, wait 1.3 s: a copy in this browser | no | yes |
| Type, wait 1.3 s, reload: text back | no (empty) | yes |
| Type, leave at once (pagehide), load again: text back | no | yes |
| Type, tab hidden (visibilitychange) at once: copy saved | no | yes |
| Send (story ends a sentence): copy removed | n/a | yes |
| After Send, pagehide and tab hidden: copy written back | no | no |
| After Send, type again: copy saved | no | yes |
| Done box shown (sent), then type and leave: copy written | no | no |
| Account copy still sent by the 20 s autosave | yes | yes |

Notes:
- First run of the Send test used a story without a final period. The core's end check (submit chunk) then stops the submit event before
  the page code sees it, so neither the live removal nor the new hold runs and the copy stays. That is right: nothing was sent. The
  second run with a full sentence gives the results above.
- After a failed send the copy stays removed until the writer types again, as the README says; closing the tab without typing leaves
  only the account copy. Same as today.
- The core rewrites the save line ("Draft saved · 9:41 AM. Kept on this device and in your account ..."), and its "Draft restored
  from your last visit" note reads this browser's copy at load; with B02 that note will show more often, which is correct.
- Webflow's own form send did not fire on the synthetic submit in this harness (0 non-GETs), so the real send and fail box remain for
  the test-site run in the README.

### B15 /submit step bar: PASS WITH NOTES

| | 390 before | 390 after | 1440 before | 1440 after |
|---|---|---|---|---|
| Segment box height | 44 px block | 44 px | 5 px | 44 px |
| Visible bar | 44 px filled slab, 6 px radius | 6 px line | 5 px line | 6 px line |
| Hit 15 px above or below center | yes | yes | no | yes |
| Colors on, upcoming | #067A79, #EDE6DA | same | same | same |

Screenshots of the bar: results/shots/stepbar_<variant>_<width>.png in the check folder (see section 6). Notes for Nancy:
- Rounded ends go (radius 0, as class-b.md wrote it).
- The line sits in the middle of a 44 px row, so the gap under "STEP 1 OF 3" grows from 10 px to about 29 px, and at 1440 the whole form
  below moves down 39 px. At 390 nothing moves.
- The color change between steps no longer fades (a gradient does not transition); it switches at once.

### B02 + B15 combined: PASS

Same results as each item alone (signatures, probes and autosave tests ran on the combined footer as variant "all" together with B18).

### B18 /submit picker roles: PASS

| | before | after |
|---|---|---|
| role on both picks | none | button |
| Space on "Link to it" | page scrolls 738 px (390) or 787 px (1440), no pick | link form shows, write form hides, pressed false,true, no scroll |
| Enter on either pick | picks | picks |
| Click | picks | picks |

No box or style change at either width; the core focus ring already covers [role=button]. Screen reader output was not tested here.

### B17 /edit-profile script id: PASS WITH NOTES

After the swap the page has one element per id (style tll-edit-dir-v1, script tll-edit-dir-v1-js); before, two. getElementById returns
the style in both. Nothing in the repo, the core at 77b56b3f or the cached registered scripts reads the id. Note: the script starts with
`document.querySelector('[data-tll-edit="dir-app"]')` and returns when it is missing, and the live /edit-profile HTML of 21 Nov and of
today has no such element (the selector appears only inside the script). So the directory editor does not render on the live page with
or without the draft, and the README's test-site check ("the directory editor renders and Save directory settings still answers")
cannot pass as written. The rename is still harmless and valid. Side find for Nancy: the directory editor has no mount point on the live
/edit-profile.

### B08 part 1 /my-pets: PASS WITH NOTES

| Pets | before heading / add card | after |
|---|---|---|
| 0 | "Traveling with 0 besties." / "Register another pet" | "Traveling with your besties." / "Register your pet" |
| 1 | "1 bestie" / "Register another pet" | same |
| 2 | "2 besties" / "Register another pet" | same |

Same at 390 and 1440; no other text, box or style change; at 0 pets the heading now keeps the Designer text it had before the script
ran. "Register your pet" is new copy and waits for Nancy's OK, as the README says.

## 4. Triage challenge

Agreed outs, with checks made here:
- B01: get_page_scripts today shows tllmapaddv2 1.0.0 applied in the /the-map footer, so the fix is a registered script change plus a
  Designer link. Out.
- B12: tllstorycountv2 and tllstorycountv3 are applied scripts on /stories today. Out (page settings, not page code).
- B07 part 3: in the published home HTML the JSON-LD with that wording sits before the site head code, so it is the page's JSON-LD
  setting, not page head code. Out of a page code batch; it can be its own one-field settings write once Nancy picks the words.
- B23 is the footer component (hard rule). B03, B06, B08 part 2, B13, B14, B20 are Designer. B04, B05 are Map 2.0 pins. B09, B11, B19,
  B25 are core or site code. B24 proposes no change. B22 has no exact text. All out.
- B10: agree to hold; moving footer styles above the five site footer styles changes which equal rule wins.
- B21 and B26 ("as each page is touched"): the touched blocks hold none of the listed off-palette colors and no :focus-visible rule,
  so there is nothing to fold in.

Challenge:
- B16, /stories part: the rule `h1.tll-library-title{font-size:clamp(30px,3.4vw,46px) !important; ...}` is in the /stories page head
  code today (35,602 characters), and class-b.md gives the exact replacement (clamp(40px,...)). It is single-page code and could be
  drafted like the others. Holding it for one decision on the whole heading scale is a fair call, but the reason is a design choice,
  not a page code limit. The /account part has no exact text, and the home and /the-map parts are out as the builder says.

Nothing put in should have been left out. B17's value is small (its script is dormant), and B08 and B15 change what members see, so
both need Nancy's eye before the test-site run.

## 5. Before any write (unchanged from the builder, confirmed)

Re-read each block with get_page_freeform_code, compare its sha384 with before_sri in hashes.tsv, stop on any difference. Write the
combined /submit footer if both B02 and B15 are approved; if one goes live first, rebuild the other with build.py from the new block.

## 6. Bandwidth and files

- Webflow bytes: 3 plain HTML GETs, 595,944 bytes (0.6 MB, measured). Browser: 126 page loads from cache, 0 bytes from Webflow hosts.
  MCP reads are API calls. Logged in handoff/BANDWIDTH-LOG.md.
- Check folder (scratch, not in the repo): scratchpad/nov25/classb-check/ with bin/cb.cjs (harness), bin/t4.cjs (Send test), bin/an.py
  (signature comparison), results/*.jsonl, results/an.txt and results/shots/. Copies of the harness, the result lines and the
  step bar screenshots are in check-files/ next to this file.
