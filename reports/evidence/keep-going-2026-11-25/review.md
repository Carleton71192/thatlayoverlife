# Keep going batch, 25 Nov: adversarial review of the three tracks (27 Nov 2026)

Reviewed: the build branches and the check reports of the three tracks.

| Track | Build | Check |
|---|---|---|
| asia | claude/asia-cls-2026-11-25 at 2c51cda | reports/evidence/asia-cls-2026-11-25/check.md (a3703ef) |
| classb | claude/classb-2026-11-25 at 01e8ab5 | reports/evidence/classb-2026-11-25/check.md (878e5e4) |
| guard | claude/bw-guard-2026-11-25 at d0f8934 | 83c3aa1, **not on GitHub** (see section 4) |

My job was to find what both the builder and the checker missed. I read every diff against origin/claude/new-session-zxm063 line by
line, reran every suite, scanned all added lines and commit messages against the writing, privacy and data-ms-* rules, and ran one
local probe of the guard. Nothing was written to Webflow, Memberstack, Cloudinary or the Worker. Nothing was published or submitted.
Webflow traffic: 0 page loads, 0 HTML GETs, 0 MB. The only browser run used a stub on 127.0.0.1, and Chromium is closed.

## Summary

| Track | Ready for the test site | What blocks it |
|---|---|---|
| asia | **yes** | Nothing. Going live needs a new layers-release build, a new pin and the new integrity. |
| classb | **yes for B02, B18 and B17**. B08 and B15 wait for Nancy. | B08 needs Nancy's OK on the copy and B15 on the look. B17's README check must be rewritten first. |
| guard | **no** | The checker's fixes 1 to 3, plus one new finding (G1): the guard turns off Chromium's HTTP cache, and its cache mode never serves CSS, JS or HTML. |

Rerun results (my own worktrees, 27 Nov):

| Branch | vitest | worker node --test | other |
|---|---|---|---|
| asia 2c51cda | 853 of 853 (72 files) | 83 of 83 | A clean rebuild is byte-equal. The core is 273,848 B, sha384-lQYm...fDf, against live 7BuG...YpYz |
| classb 01e8ab5 | 871 of 871 (73 files) | 83 of 83 | All 12 before and after files hash to hashes.tsv. No trailing newline, so a hash of the MCP text can be compared directly |
| guard d0f8934 | 849 of 849 (72 files) | 83 of 83 | tools/test: 17 of 17. The tests leave the repo log untouched (git status clean) |

Rule scans on every added line and every commit message of the three branches:

- No em dash, and no exclamation mark in prose.
- No word containing s-h-i-p. The only l-e-d-g-e-r hits are live /edit-profile code (a script id and the Trip card name from
  September), copied verbatim into before.html and after.html for rollback. The banned-word regex in the class B test file is the one the
  checker already noted.
- Both trailer lines are exact on all three commits.
- No data-ms-* attribute, form name or field name changes, and nothing touches the nav or footer component.

## 1. asia: ready for the test site

I agree with the build and the check, and found no regression. These points go beyond the check report:

- **The replay timing margin is unchanged where it matters.** The click still happens by 2.9 s after DOMContentLoaded, as before.
  Only the release of the mark moves, up to 3.3 s. If the core's 3.5 s fallback ever fired first on a slow main thread, the grid
  would already be filtered. The worst it could show is the small lead-card move (0.0292), not the full-grid drop (0.26).
- **settle() cannot hold the grid longer than 0.4 s after the click.** The cap timer is set unconditionally. A failed
  MutationObserver only means the quiet timer starts at the click. dots() writes data-tll-own-line, which is outside the attribute
  filter, so the dots pass cannot extend the wait.
- **Unsupported but harmless claim in the check.** The home footer shift was 3 of 3 in new loads, then 2 of 10 in both builds. The
  pooled counts are 2 of 13 old against 5 of 13 new. That is not significant (Fisher, two-sided, about 0.38), and the code home runs
  differs from 16.69.0 only in the stories chunk hash string. I accept the checker's conclusion, but "random" rests on the code
  argument, not on the counts.
- **Release hygiene the reports did not state.**
  - The core carries no version string. The release is identified only by the layers-release commit pin and the integrity, so
    the registered script version (16.69.0 to the next number) must be bumped by hand in the Webflow script registration.
  - src/ on the work branch has not moved since a997980, so a build from the merged work branch gives the same core,
    sha384-lQYmZoXkPCA3mw+DdnKr0yq4bL6dMnbqZ5NfY1Vcg7RZB3wJZFrur0X0OmlH1fDf. Check it again at build time.
- **Merge conflict.** handoff/BANDWIDTH-LOG.md conflicts with the work branch (`git merge-tree`). Every track and every check
  appended a line at the end of the file. Keep both sides.
- **Pre-existing problem, not a blocker.** The lead mark stays on a hidden card when the scripts come 3 s late (check note 2). It
  needs a follow-up in the page's chip or lead script.

**Release (test site first):**

- Merge 2c51cda into the work branch. The source files are src/site-layers/tll-stories-places-v1.js,
  src/site-layers/chunks/stories.js (sha384-92Ymwg...qG8qw), src/site-layers/chunks/stories-preview.js (sha384-GjVlAF...hG7) and
  src/site-layers/tll-site-layers-v16.js.
- Build a layers-release commit and confirm that the core on jsDelivr is byte-equal, with sha384-lQYm...fDf.
- Register tllsitelayersv16 at the next version with that pin and integrity.
- Rollback is 16.69.0: pin 77b56b3f, sha384-7BuGLQzS/89d4eCS1J14BHSv96uxPPr4tl62X1kJtq7Ngzljs24q8/rce1BHepYz.

## 2. classb: ready for B02, B18 and B17; B08 and B15 wait for Nancy

The checker's work holds up. I confirmed the following myself:

- The full hashes and the before and after diffs.
- At 0 pets the /my-pets heading reads "Traveling with your besties." The em sits in h2.tll-mypets-grid-title, not in the
  h1 "Your pets.", so it does not repeat a word.
- "Register another pet" is the Designer text of the add card today (25 Nov saved HTML), so 1 and more pets really are unchanged.
- No site script adds a Space handler for [role=button], so B18 does not pick twice. pick() is idempotent anyway, so key repeat
  is harmless.

New points:

- **B17 was already known to be dormant.** claude/tll-for-press-step0-and-change-log-2026-11-12.md (line 752) recorded on 12 Nov
  that `[data-tll-edit="dir-app"]` exists only inside the script, not as an element. The rename is valid and harmless. But the
  README check ("the directory editor renders and Save directory settings still answers") is unachievable, and has been since before
  the draft. Rewrite it as "one element per id; no other change on the page" before the test-site run. Whether to remove the dead
  editor is a separate decision for Nancy.
- **B02, minor and new:**
  - A writer who types and then clears every own field leaves the 1 s copy in this browser. local() returns when no own field has
    words, and nothing removes the older copy, so that text comes back on the next visit. Before B02, the same thing could happen
    only if the 20 s tick caught the text. This is not a blocker, but say it in the README or remove the copy in local() when
    own() is false.
  - The core's idle line still says "Your words save as a draft every 20 seconds." That stays true for the account copy and the
    save line, so no change is needed. Nancy may want the words changed later.
- **B02, a test-site case nobody ran:** the core's end check stops a send, then the writer leaves the page without typing.
  - The submit event never reached the page code, so held stays false and pagehide saves the copy. That is right.
  - But if the writer typed within the last second before pressing Send, then the submit handler (`held=true`, clearTimeout)
    never ran either, and the 1 s timer still fires. Also right.
  - Only a real Webflow send that ends in the fail box clears this browser's copy (the live removal), as it does today. Run the
    fail box case on the test site, as the README already asks.
- **B15 CLS claim:** the signed-in CLS of about 0.77 from the stand-in setup would hide a 39 px move. The checker's added line
  (the bar sits below the first screen at both widths) is what supports "no measured shift". I accept it, but do the test-site run
  at 1440 with the step bar in view.
- **Privacy, a rule exception that needs an explicit OK.**
  - B08/before.html, B08/after.html and B17's three files on the branch carry the founder's member slug and Instagram handle
    placeholder. They are copied verbatim from the live code, for an exact rollback.
  - Both the builder and the checker disclosed this, and the same strings are already in 299 files on the work branch, so the new
    exposure is nil.
  - The session rule still says never copy a member's handle into files. Either Nancy approves this exception for rollback
    copies, or the files keep a placeholder that a write-time script fills in from the MCP read.
- **Merge conflict:** handoff/BANDWIDTH-LOG.md, the same as for asia.
- **B16 (/stories h1 clamp):** I agree with the checker that it could be drafted as page code. Holding it is a design choice.

**Release (each write is preceded by get_page_freeform_code and a sha384 compare with hashes.tsv; stop on any difference):**

| Page (id), block | File on claude/classb-2026-11-25 under reports/evidence/classb-2026-11-25/ | before sha384 (hex, first 16) | after sha384 (hex, first 16) | Status |
|---|---|---|---|---|
| /submit (6a0d5e5eb7804d3a750dc266), footer | B02-submit-autosave/after.html, used when B15 is not approved | 3e3c81d31dc9c37a | 010f18241df82c0d | ready |
| /submit, footer | submit-footer-B02-B15/after.html, used instead when Nancy approves B15 | 3e3c81d31dc9c37a | 2abd6eb2ab8fde3a | waits for Nancy (B15 look) |
| /submit, head | B18-submit-picker-roles/after.html | 6f656a9eee1413b1 | 8f100834405f3252 | ready |
| /edit-profile (6a0df371cd5b09ac504421ae), footer | B17-edit-profile-script-id/after.html | 7e407359288bdee3 | 4be14189b5d9f24c | ready once the README check is rewritten |
| /my-pets (6a0df9ffc4a846ee4db92b63), footer | B08-my-pets-heading/after.html | 16119cc6a44750d4 | 3ca467d8842f42de | waits for Nancy (copy) |

Full hashes are in hashes.tsv. Rollback for each block is its before.html. All 21 other B items stay out.

## 3. guard: not ready

The checker's three must-fix items stand, and I reproduced none of them away:

1. A failed route.fetch leaves an unhandled rejection.
2. The guard calls route.continue(), so a route registered before guard() never runs.
3. Unload beacons and keepalive POSTs are not aborted.

New findings:

- **G1 (new, important): the guard turns off Chromium's HTTP cache, and its cache mode only covers media.**
  - Playwright turns off the HTTP cache in any context that has a route. guard() always registers one (`context.route('**/*')`).
  - Measured here with a local stub: one context, three navigations sharing one stylesheet sent with max-age 3600. The stylesheet
    reached the server once without the guard and three times with it (probe/cache-probe.cjs, probe/cache-probe-output.txt).
  - Cache mode serves only images, video and fonts. Webflow HTML, CSS and JS always go to the network, even when the sweep cache
    already holds them; the cache folder lists 45 Webflow CSS and JS files, 1.27 MB decoded.
  - So moving a harness like check-3's ab.cjs, which serves everything from cache and fetches 0 MB, onto the guard would change
    0 MB into a real download on every load. The main costs are the shared CSS (700 KB decoded) and webflow.js (230 KB). At
    roughly 0.25 to 0.3 MB on the wire per load (E), a 288-load check like the asia one would be about 70 to 90 MB (E).
  - Fix: let cache mode (or a new cache-only mode) cover every Webflow GET, not only media, and abort misses in cache-only mode.
- **G2 (new): cache mode downloads whole videos.** fromCache() drops the Range header and fetches the full file once. The standing
  13 Nov rule allows one download, but this session's rule allows no video download at all. Until G1's cache-only mode exists, the
  docs must say that cache mode is not allowed under the current session rules. Better, abort `media` in cache mode on a miss.
- **G3 (new): the lock line would make the faulty tool mandatory.**
  - The branch adds a sub-line under the 13 Nov STANDING RULE in handoff/WEBFLOW-LOCK.md: "every new harness ... calls guard()".
  - Merged as is, it would require harnesses to use a tool with fixes 1 to 3 and G1 open.
  - Hold that line until the fixes land, or reword it to "after the fixes in reports/evidence/bw-guard-2026-11-25/check.md".
- **G4 (new, small): wf-get writes to the working directory by default.** It saves pages to ./wf-get-out and logs to the
  checkout's handoff/BANDWIDTH-LOG.md. Run from the repo root, that leaves an untracked folder and a log line in whatever worktree
  it runs in. That is the same per-checkout log problem the checker found for parallel runs.
- **Merge conflict:** handoff/BANDWIDTH-LOG.md, the same as for the other two tracks.

**Release:** nothing goes to Webflow; this track is repo tooling. Once fixes 1 to 3, G1 and G2 are made and tested:

- merge tools/wf-guard.cjs, tools/wf-get.cjs, tools/WF-GUARD.md, tools/test/wf-guard.test.cjs and the vitest.config.js exclude;
- add the WEBFLOW-LOCK.md line last.

## 4. Claims in the check reports that the evidence does not support

- **The guard check report is not on GitHub.**
  - Commit 83c3aa1 exists only on local branch bwchk-tmp in
    /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov25/bw-guard-check/rep, a scratch folder
    a restart can clear. It is based on a3703ef, not on today's 878e5e4.
  - The guard track's PASS WITH NOTES has no evidence on the work branch until someone runs, in that folder:
    `git pull --rebase origin claude/new-session-zxm063 && git push origin HEAD:claude/new-session-zxm063`.
  - This review does not push it.
- **The guard builder's summary** says the guard satisfies requirement (a), "images, video and fonts ... cache once". With G1 it
  meets the letter of that rule, but it raises total Webflow bytes for multi-page contexts.
- **The asia report** says "the code home runs is byte-equal in both builds". That is true for the chunks home loads, but the core
  file differs by one hash string. That is a different file with no different behavior. The wording is loose, and the conclusion
  stands.
- **The classb report** says "B17 PASS WITH NOTES" and treats the missing mount point as a side find. It is a known condition from
  12 Nov (see section 2). Nothing else in the class B report goes beyond its evidence.

## 5. Bandwidth and files

- Webflow: 0 page loads, 0 plain HTML GETs, 0 MB (M). One Chromium run against a stub on 127.0.0.1, now closed. One line was added
  to handoff/BANDWIDTH-LOG.md.
- Probe: reports/evidence/keep-going-2026-11-25/probe/cache-probe.cjs (run it as
  `NODE_PATH=/opt/node22/lib/node_modules node cache-probe.cjs <bw-guard worktree>`) and cache-probe-output.txt.
- Worktrees and progress: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov25/keep-going
  (asia-cls, classb, bw-guard detached at the track heads; wt for this report). Progress file:
  /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov25/keep-going/PROGRESS.md.
