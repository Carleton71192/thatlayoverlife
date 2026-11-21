# /submit footer c3 (leftover copy removed at load): independent check (21 Nov 2026)

Checked: `webflow-c3-after.html` at `a9f1762` on `claude/new-session-zxm063`, against `webflow-c2-after.html` (the c2 footer checked
in `check.md`) and the live footer (`webflow-c2-before.html`). Every number below was measured here. Nothing from the builder's
report was taken on trust.

Verdict: **PASS WITH NOTES.** `check.md` note 1 is fixed: in all 4 leftover runs from that note (and 6 more leftover runs added here,
including one where the leftover is made by a real blank visit on the live footer), c3 removes the helper-only copy at load and
never shows "Draft restored from your last visit." over an empty form, while c2 shows it on every visit. A real unsent local draft
(name and body, or body only) is still filled and still gets the "Draft restored" line, exactly as with c2 (5 of 5 runs). The main
21-scenario set at 390x844 and 1440x900 gives the same form, line, drafts and account writes as the stored c2 runs in 42 of 42.
Notes 1 to 4 below; none blocks the footer.

No Webflow call of any kind, no publish, no form post, no Memberstack, Cloudinary, Turnstile or Worker call. No request left the
machine: the saved /submit HTML from the c2 check (21 Nov 09:05:53 UTC) was served from disk, static files from the c2 check's cache,
and this run's harness aborts a cache miss instead of fetching it (0 misses in 70 runs). No member data: dummy text and a fake test
member only.

## 1. Code read

`diff webflow-c2-after.html webflow-c3-after.html`: one line out, two in, same place (after `own()` and the autosave, before the
account read):

```diff
-try{fill(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(e){}
+/* 21 Nov 2026 (c3): ...comment... */
+try{var lo=JSON.parse(localStorage.getItem(KEY)||'null');if(lo&&!own(lo))localStorage.removeItem(KEY);else fill(lo);}catch(e){}
```

| File | Bytes | Characters | SHA-384 |
|---|---|---|---|
| `webflow-c2-before.html` (live, unchanged) | 10093 | 10085 | `sha384-942cxWFLNZomZqVj1NCAwq/G4w8+b896sgq7368PrZTfSkk0V3cD/c5LOb1wSA4N` |
| `webflow-c2-after.html` (unchanged) | 10782 | 10774 | `sha384-12ICmEg6gz0q02hbdXeY36z3wDw0ztw8stfIVqoAk/MWQfvZl6ApO2QPddT8hMGe` |
| `webflow-c3-after.html` | 11137 | 11129 | `sha384-PjyB0x3Jw3oWBh37tLPDMuLSLB4EbdYIghrvSj4UHMdhc9C4zMFOvDUTVZ8tWgxc` |

All three match the builder's report. c3 is under the 50,000 character page code limit.

- `own(o)` is defined two lines above, so it exists when the new line runs. `lo` is a new name in `init`; no clash.
- `null` (no copy) goes to `fill(null)`, which returns at once, as before. `{}`, `[]`, a string or a number has none of the four
  fields and is removed. Broken JSON throws inside `try` and is left in place, as with c2 (note 3).
- No new page text: the only added string outside the comment is the existing `KEY`. The comment has no em dash and no exclamation
  mark.
- Timing: the "Draft restored" line comes from `autosaveLine(form)` in `src/site-layers/tll-submit-gallery-v1.js` (built into
  `chunks/submit.js` line 279): `restored=!!localStorage.getItem('tllStoryDraft')`. It returns early until `.tllst-save` exists, and
  `run()` calls it at DOMContentLoaded (or at once) and again at 1.2 s and 3 s. The steps script creates `.tllst-save` and then, later
  in the same synchronous `init()`, reads and now removes the copy. No other script can run in between, so the gallery layer always
  sees the copy after the removal. Confirmed in the browser (section 3).
- Other readers of the key: the story extras script (`src/pages/submit/embed-lounge.html`, `tll-story-extras-js-v1`) reuses
  `trip-code` from this browser's copy. In the saved page it comes before the steps script (byte 92,195 against 166,242), so on the
  first c3 visit it still reads the leftover's trip code before the copy is removed (note 2).

## 2. Tests, run here

| Suite | Result |
|---|---|
| `npx vitest run` | 63 files, 759 tests, all pass |
| `node --test worker/test/*.test.js` | 83 of 83 pass |
| mutation: removal taken out (`fill(lo)` only) | `test/submit-account-read.test.js`: 4 of 16 fail |
| mutation: only `name` counts as a real draft | 3 of 16 fail |
| mutation: removal deferred with `setTimeout(..., 0)` | 4 of 16 fail |

The three mutations are my own (not the builder's four). The file was restored afterward and `git status` was clean.

## 3. Browser runs

Chromium headless shell (Playwright), one browser at a time, 70 runs. Harness `leftover-check-run/h3d.cjs`: the c2 check's `h3b.cjs`
plus the builder's `c3` variant (`c3-run/h3c.cjs`), with three changes: a cache miss is aborted and counted instead of fetched;
scenario `upgrade` / `upgrade-out` (visit 1 served with the live footer, so the leftover is the one the live footer really writes on a
blank visit, then visits 2 and 3 served with the variant); scenarios with a real unsent local draft. Run list `run.sh`, readout
`read2.py`, results `readout-A.txt` and `readout-B.txt`. Same stand-ins as `check.md` (Memberstack fake loaded where the header
script asks for it, Turnstile fake, Cloudinary, Webflow form post and Worker stubs). "c2" below is `webflow-c2-after.html`.

### A. Leftover copies and real local drafts (28 runs, c2 and c3)

Each line holds for every visit of the run (load, after one 20 s autosave tick, visit 2, its tick, visit 3).

| Scenario | Memberstack | Viewport | c2 | c3 |
|---|---|---|---|---|
| Leftover (`invite-link`, `lounge-photo-pick`, `trip-code`), signed in, empty account (note 1 run) | 3000 | 390 | "Draft restored" over an empty form on all 5 views, copy kept | plain line on all 5 views, copy gone at load, 0 writes |
| same (note 1 run) | 3000 | 1440 | same as above | same as above |
| Leftover plus unsent account draft (note 1 run) | 3000 | 390 | account draft filled, "Draft restored", copy kept | account draft filled, plain line, copy gone, 0 writes |
| same (note 1 run) | 3000 | 1440 | same as above | same as above |
| Leftover | real | 390 | "Draft restored" over an empty form, 5 of 5 | plain line, 5 of 5, copy gone |
| Live footer blank visit, signed in (`upgrade`), then the variant | real | 390 | visits 2 and 3: "Draft restored" over an empty form | visits 2 and 3: plain line, copy gone at visit 2 load |
| same | 3000 | 1440 | same as above | same as above |
| Live footer blank visit, signed out (`upgrade-out`), then the variant | real | 390 | visits 2 and 3: "Draft restored" over an empty form | plain line, copy gone |
| Local draft (name and body), signed in, empty account | 3000 | 390 | filled, "Draft restored" on visits 1 to 3; tick saves to the account (1 write) | identical |
| same | real | 390 | same | identical |
| same | real | 1440 | same | identical |
| Local draft with body only | real | 390 | filled, "Draft restored" | identical |
| Local draft plus account draft | 3000 | 390 | local draft kept in the form, "Draft restored", account not mixed in | identical |
| Signed out, draft typed, saved by the tick, two revisits | real | 390 | visits 2 and 3 filled, "Draft restored" | identical |

New browsers after each of these (2 per run with revisits) were the same in c2 and c3. Page errors 0, cache misses 0, form posts 0 in
all 28 runs. Console messages per pair: equal in 13 of 14 pairs, one `ERR_FAILED` apart in 1 (`upgrade` 3000 1440, 66 against 65; an
aborted media request, as in `check.md`).

### B. Main 21-scenario set, c3, compared with the stored c2 runs of `check.md` (42 runs)

The same 21 scenarios as `check.md` section 4 (account draft at early, real, 500, 3000, never; typing; typed country; typed other
fields; sent; links; custom fields; typed website; signed out typed; signed out blank with revisits; blank; one full send with
revisits and new browsers, real and 3000; failed post with revisits), at 390x844 and 1440x900, each against the stored c2 (`new`)
run of the same scenario.

Compared for every snapshot of every visit: the field values (name, excerpt, body, country, city, region, website, Instagram), the
checked radios and boxes, the save line (clock time masked), "Draft restored", the already-sent line, the PREFILLED tags, this
browser's copy and the account draft, the number of account writes, and the visible page text without the save line. Also the
number of form posts, uploads, Worker calls, the send outcome, page errors and the console message kinds.

- **42 of 42 the same** in form, lines, drafts, account writes, posts, uploads, Worker calls, send outcome, page errors and console
  kinds.
- Visible page text: the same in every snapshot except the one taken after a send, in the 4 send runs. That text differs between
  every pair of runs, live against c2 included (8 of 8 in the stored runs), with the same length each time (2,037 characters at 390,
  2,295 at 1440). Some text after a send changes from run to run; only a hash of it was kept, so the exact part was not identified. It is not a c3
  change.
- Element structure hash: different in 14 of 42, in both directions; `check.md` already shows the position of one iframe moving
  between two live loads of the same scenario. Not a c3 change.
- Console counts: equal in 37 of 42, one `ERR_FAILED` apart in 5 (both directions), as in `check.md`.
- c3 totals: 6 form posts, all to the local stub (4 sends, 2 failed posts), 12 stubbed uploads, 4 stubbed Worker calls, 0 page
  errors, 0 cache misses. Aborted on purpose: GETs of www `/sitemap.xml` and `/stories` and the Worker `/whats-new`.

## Notes

1. **The account copy is not cleaned.** On a signed-in blank visit the live footer also wrote the helper-only draft to the account
   (1 write in `upgrade`). c3 removes only this browser's copy, so the account still holds it. No visible effect in any run: on later
   visits and new browsers the form stays empty, there is no "Draft restored" (the gallery layer reads only this browser's copy),
   and c3 writes nothing. The account read does fill empty helper fields from it, as c2 already did. It goes away the first time the
   writer's typed words are saved. Fine to leave.
2. **Trip code after a removal.** The first c3 visit still shows the leftover's trip code (the extras script reads it before the
   steps script removes the copy). Visits after that get a fresh trip code on each blank visit (c3 `leftover` visit 2 and 3: two new
   codes; c2 kept `TEST`). This is what any c2 browser without a draft already does. An invite link copied on an old blank visit
   still works for the co-travelers, but the writer's own later story gets another code unless they type on the first visit or come
   back through the `?trip=` link. Small; worth knowing if trip grouping is checked by hand.
3. **Broken JSON is left alone.** A copy that is not valid JSON is not removed and still says "Draft restored" (the builder's test
   covers this, same as c2). The footer only writes `JSON.stringify` output, so this should not happen in practice.
4. **Real browsers and real Memberstack were not used.** Same limits as `check.md` notes 5 and "Not done".

## File to deploy

`reports/evidence/submit-account-read-2026-11-21/webflow-c3-after.html`: 11137 bytes, 11129 characters,
`sha384-PjyB0x3Jw3oWBh37tLPDMuLSLB4EbdYIghrvSj4UHMdhc9C4zMFOvDUTVZ8tWgxc`. It replaces the steps-script footer block on /submit
(the block that equals `webflow-c2-before.html`). That needs a Webflow page code write and a publish, which need approval. Not done
here.
