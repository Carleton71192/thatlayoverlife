# /submit account read waits for Memberstack: independent check (21 Nov 2026)

Checked: `webflow-c2-after.html` (branch `claude/submit-account-read-2026-11-21` at `c707020`, merged into
`claude/new-session-zxm063` as `63609fa`) against the live /submit footer. Every number below was measured here, in a separate
worktree at `63609fa`. Nothing from the builder's report was taken on trust.

Verdict: **PASS WITH NOTES.** On a load where Memberstack arrives after DOMContentLoaded (as the real header script adds it), the new
footer reads the account, restores an unsent account draft on a new browser, shows the already-sent line, prefills the credit
website and Instagram, never overwrites a typed text field, and stops a blank visit from writing a helper-only draft. With Memberstack
early, never, or signed out, it behaves like the live footer. No new console message, no page error, and no page change other than
the restored or prefilled values (plus the PREFILLED tag and the sent line, both 18 Nov code). Notes 1 to 6 below; note 1 is worth
settling before the footer goes in.

No Webflow call of any kind, no publish, no form post, no Memberstack, Cloudinary, Turnstile or Worker call. Requests that left the
machine: one plain GET of https://www.thatlayover.life/submit (curl, 21 Nov 09:05:53 UTC, 200, 175,677 bytes; saved and served from
disk for every load), and 22 GETs of static files on cache misses during the first browser load only (18 cdn.prod.website-files.com,
2 fonts.googleapis.com, 1 ajax.googleapis.com, 1 the Webflow jQuery on cloudfront). The other 107 loads had 0 misses. No member
data: dummy text, a fake test member and three generated test images.

## 1. Live footer

The saved page holds the footer block exactly once, and it equals `reports/evidence/submit-save-2026-11-17/webflow-c-after.html`
byte for byte (count 1; script id `tll-form-steps-js-v2` once). `webflow-c2-before.html` is byte-identical to that file (cmp). The
page is byte-identical to the builder's 08:56 UTC copy.

## 2. Code read

`diff webflow-c2-before.html webflow-c2-after.html`, line by line:

- Lines 1 to 36 (both style blocks and the script tag) identical. Inside the steps script: 3 lines out, 6 in, nothing else moved.
  Before 10,093 bytes / 10,085 characters, `sha384-942cxWFLNZomZqVj1NCAwq/G4w8+b896sgq7368PrZTfSkk0V3cD/c5LOb1wSA4N`; after 10,782
  bytes / 10,774 characters, `sha384-12ICmEg6gz0q02hbdXeY36z3wDw0ztw8stfIVqoAk/MWQfvZl6ApO2QPddT8hMGe` (under 50,000). Both match
  the report.
- `own(o)`: true when `name`, `excerpt`, `body` or `country` has a value. These are the four required step 1 fields on the live form
  (step 1 is country, city, Field 5, name, excerpt, body).
- Autosave: `Object.keys(o).length===0` becomes `!own(o)`. `OWN` is assigned before the first autosave tick and before `read` runs.
- Account read: the old one-shot block is now `read(ms)`, same body, plus `&&!own(snap())` before `fill`. It is started by
  `wait(0)`: a check at once (inside `init`, at DOMContentLoaded), then every 250 ms while `n<60`, so 61 checks over 15.0 s, then it
  stops with no timer left. `read` runs at most once.
- `sentNow`, `pend`, the submit handler, `fill`, `snap`, the prefill and the done-box observer are byte-identical.
- Merge `63609fa` adds only the 4 files in this folder and the test (`git diff 2e4570c 63609fa --name-only`).
- Copy: no new page text. The added lines hold only comments and the four field names. The sent line is the 18 Nov text.

Readiness on this site: the header script `tll_memberstack_init_v2` (not in the repo; read from the static copy the browser harness
loaded) appends `static.memberstack.com/scripts/v2/memberstack.js` as an async script, then polls for `window.$memberstackDom` every
200 ms, 50 times (10 s), and sets `ms-init` and then `ms-member` or `ms-anon` on `<html>`. No ready event is used. The other TLL
scripts poll too (`whenMemberstack`, 250 ms x 60, in the site footer snapshot; `member(cb)` in the core, 150 ms x 40). The new wait
follows the house pattern. Even served from disk with no delay, the fake Memberstack appeared 9 to 24 ms after DOMContentLoaded in
every "real" load, so the live footer's one read never happens.

## 3. Tests, run here

| Suite | Result |
|---|---|
| `npx vitest run` (worktree at `63609fa`, the repo's vitest 2.1.9 from the builder's `npm ci` of the same lockfile) | 63 files, 753 tests, all pass |
| `node --test worker/test/*.test.js` | 83 of 83 pass |
| mutation: `&&!own(snap())` removed | `test/submit-account-read.test.js`: 1 of 10 fails |
| mutation: wait never retries (`n<0`) | 6 of 10 fail |
| mutation: autosave guard back to `Object.keys(o).length===0` | 4 of 10 fail |

## 4. Browser runs

Chromium (Playwright 1.63), one browser at a time, 108 loads in all: 84 in the main matrix (21 scenarios x live and new x 390x844 and
1440x900), 8 extra (note 1), 15 to read page-structure differences, 1 trial. Harness `check-run/h3.cjs` (built on
`submit-save-2026-11-17/check-final-run/h2.cjs`, same stand-ins), `check-run/h3b.cjs` (adds a local leftover), run list
`check-run/run.sh`, readouts `check-run/table.py` and `check-run/an3.py`, every run summarized in `check-run/table.txt` and
`check-run/table-extra.txt`.

- **live**: the saved HTML as served. **new**: the footer block swapped for `webflow-c2-after.html` in the routed HTML only. Core
  `0f04fabf` and photo clean `f67f3f74` from git objects at the pins in the page, SRI on.
- Memberstack: a local fake served where the header script asks for `memberstack.js`, so it arrives as on the real page. Timings:
  **early** (before DOMContentLoaded, the other side of the race), **real** (the moment the header script loads it), **500** and
  **3000** ms after DOMContentLoaded, **never** (the script loads, `$memberstackDom` never appears). Signed out: `$memberstackDom`
  present, `getCurrentMember` gives no member, `getMemberJSON` and `updateMemberJSON` reject.
- Stand-ins: Turnstile fake, Cloudinary upload 4 s, Webflow form post 1.5 s (`{code:200}`, or 500 for the failed post), Worker
  `/intake` 3 s. Every other non-GET is aborted; requests to www from the page (sitemap, /stories) and workers.dev are aborted.
- Account seeds (test values): an unsent draft (name, excerpt, body, country, city, region, a theme, credit `pen-name`); the same
  marked sent; `tllLinks` website and Instagram; custom fields website and Instagram.

Results (each line holds at 390 and at 1440; "filled" means the account draft's name, excerpt, body, country, city and region):

| Scenario | Memberstack | live | new |
|---|---|---|---|
| Signed in, unsent account draft, new browser | early | filled | filled (same) |
| | real, 500, 3000 | empty (no read) | filled; first read 221 to 246 ms after Memberstack appears |
| | never | empty | empty, no read, no write |
| Writer types name and body before Memberstack | 500, 3000 | typed kept, nothing mixed in | same: typed kept, excerpt and country stay empty |
| Writer types country only | 3000 | typed kept | same |
| Account draft marked sent | real, 3000 | no line, empty form | "Already sent to the editor. A copy stays in your account.", empty form, 0 writes |
| `tllLinks` website and Instagram | real, 3000 | nothing | both prefilled, 2 PREFILLED tags |
| Custom fields only | 3000 | nothing | both prefilled, 2 tags |
| Website typed first, `tllLinks` set | 3000 | typed kept | typed kept, Instagram prefilled, 1 tag |
| Signed out, draft typed, one autosave tick | real | saved to this browser, 0 account writes | same |
| Signed out, blank visit, two more visits | real | helper-only local copy, "Draft restored" over an empty form on visits 2 and 3 | nothing saved, no "Draft restored" |
| Signed in, blank visit, one autosave tick | 3000 | helper-only draft written to this browser and the account (1 write) | nothing written |
| One full send, then a blank visit (one tick), a third visit, two new browsers | real, 3000 | 1 post, account marked sent; visit 2 tick moves the sent copy to `tllStorySent` and writes a helper-only draft; visit 3 says "Draft restored" over an empty form | 1 post, account marked sent (2 writes, the sent mark last, as on 18 Nov); visits 2, 3 and both new browsers show the already-sent line, empty form, 0 writes, account still marked sent |
| Failed post (Webflow 500), revisit, third visit, two new browsers | 3000 | same browser restores from its local copy; new browsers stay empty | same browser same as live; new browsers restore the unsent draft from the account |

Totals: 12 form posts, all to the local stub (8 sends, 4 failed posts), 24 stubbed uploads, 8 stubbed Worker calls. Page errors: 0
in 108 loads.

Console: every message in both variants is a resource load error caused by the harness aborting a request (1,948 `ERR_FAILED`), plus
4 `500` lines from the failed-post stub. The kinds are the same in every live and new pair. 4 of 42 pairs differ by one `ERR_FAILED`,
and a rerun gave a difference the other way (new one higher), so it is timing of aborted media, not the footer.

Page: visible text (without the save line) is identical in all 42 pairs. The element structure differs only in (a) the position of
one iframe, which also moves between two live loads of the same scenario, and (b) the PREFILLED tags. With the iframe left out, 5
reread pairs are identical except for the PREFILLED tag in the typed-website case.

## Notes

1. **Old leftovers keep the wrong "Draft restored".** A browser that already holds a helper-only local copy (written by the live
   footer on any blank visit of 20 s or more, signed in or out) still sees "Draft restored from your last visit." over an empty form
   on every visit with the new footer. The new autosave never rewrites or removes it (4 of 4 runs, all visits; `table-extra.txt`).
   The new code stops new leftovers but does not clean up existing ones. A possible fix, not built or tested here: at load, remove a
   local copy that has none of the four fields instead of filling it, for example
   `try{var lo=JSON.parse(localStorage.getItem(KEY)||'null');if(lo&&!own(lo))localStorage.removeItem(KEY);else fill(lo);}catch(e){}`.
   The gallery layer reads the local copy only after the steps script has built `.tllst-save`, so removing it at `init` comes first.
   This would need its own test.
2. **A late account draft can change a radio or checkbox pick** when none of the four fields has a value (city typed, credit
   `anonymous` picked, Memberstack 3 s late: the form fills and the pick becomes `pen-name`, 2 of 2). No typed text or chosen select
   value is overwritten. The form does not let a writer reach steps 2 or 3 without the four required step 1 fields, so normal use
   should not hit this.
3. **Account restore is silent.** On a new browser the form fills from the account but the line reads "Your words save as a draft
   every 20 seconds..." with no "Draft restored". The gallery layer checks only the local copy. The live footer does the same on an
   early load. This is a copy choice for later, not a fault.
4. **`fix.md` has two small errors.** `whenMemberstack` is not in the core but in the site footer snapshot
   (`src/site/live-2026-11-13/fonts/site-footer.after.html`, line 406). Also, signed-out visitors do get Memberstack (the header
   script sets `ms-anon`). The test suite's signed-out case has no Memberstack at all. The browser runs here cover signed out with
   Memberstack present: same as live.
5. **Real Memberstack was not used.** The fake answers `getMemberJSON` 150 ms after `$memberstackDom` appears. The header script and
   other house scripts call Memberstack at that same moment, so the new footer relies on the same thing they do. If Memberstack ever
   arrives after 15 s, there is no read on that visit (the draft is still saved by the autosave).
6. **Already like this, not changed:** after a failed post, the next visit's autosave rewrites the draft without the `hero-image` and
   `photo-gallery` links (both variants).

## Not done

- The footer was not put on /submit. That needs a Webflow page code write and a publish, which need approval.
- No real browser on a phone, and no real Memberstack, Turnstile, Cloudinary, Webflow form endpoint or Worker.
