# /submit send wait: final check of the merged session branch (18 Nov 2026)

Checked: session branch `claude/new-session-zxm063` at `9a2603c` (merge `f67f3f74d9a5b4c20ec282ac4935ebe2831be667`, parents
`37a115a` and `de5a4d6`), against live www (core 16.67.0, pin `a254306f`; photo clean pin `22019832`). Read with `fix.md`,
`check.md`, `trace.md`, `refute.md` and `submissions.md` in this folder. Independent of the builder: every number below was
measured here.

Verdict: **PASS WITH NOTES.** Parts A and B do what `fix.md` says on the real pages, with no regression, at 390 and 1440. Part C
(patched into the routed HTML only) meets Nancy's three choices: the draft stays in the account (marked sent, photo links kept),
the autosave stops after the done box, and no later visit offers the sent story as "Draft restored". Notes 1 to 7 below; note 1
and note 2 should be settled before C goes into the page code.

No Webflow call of any kind, no publish, no form post, no upload, no Memberstack, Cloudinary or Worker call. Requests that left
the machine: three plain GETs (www /submit, /share-photos, /my-pets, 18 Nov 08:11 UTC, saved to disk and served from disk for every
load). Every other request was served from git objects, the merged worktree, an earlier static cache, or a local stand-in;
static cache misses: 0. No member or contributor data is used: dummy text, a fake signed-in test member and three generated test
images.

## 1. Code read

- Diff `37a115a..9a2603c`, line by line: photo clean (label progress, label restored before the deferred `requestSubmit`,
  `setTimeout 0`, `EDGE=3000` unchanged), intake layer (saved line at once with `role=status`, `SAVED_FORM` exactly
  "Saved. The editor will add it to the draft list by hand.", success is `r.ok` and `ok` or `saved`, `into(done)`, end note by
  Send), core (4 lines: the submit, submit-preview and share-photos integrity strings), the three chunks (the same intake diff,
  each changed line exactly 3 times), `fix.md`, tests. Nothing else.
- Merge: clean auto-merge (no remerge diff). The merged tree against `de5a4d6` differs only by the 16.67.0 side. The live pin
  `a254306f` holds the same core and chunks as `37a115a` (same blob ids), so live = the merge's first parent for this flow.
- Rebuild: `python3 src/site-layers/build-site-layers-v16.py` on a clean worktree at `9a2603c` gives a byte-identical tree
  (git status clean). Core 277485 bytes, `sha384-a9tcQUfkTLuUzZ1IXfw7dVcXSKJnilK7aqF6p5HiS5d80ghZvRrQ6Akt8Ewg/2st`; submit.js
  `sha384-H8LL...+5+8n`, submit-preview.js `sha384-ED9l...P/xc`, share-photos.js `sha384-uoZr...8DY`; photo clean 7920 bytes,
  `sha384-b9+lDanshflZ9KVhLlM/GTjhrqKXDFpVs+iXXE5NYL7BLq1hiKvHH6v7kWFDo/rP`. All match the builder's report and `fix.md`.
- Part C: the before block equals lines 71 to 83 of `footer.before.html` byte for byte, occurs exactly once in today's live
  /submit HTML, and the live inline steps script equals the repo copy.
- Copy: the new page text ("Sending your photo", "Sending photos N of M", "Photos are up. Sending", the failure line, "Already
  sent to the editor. A copy stays in your account.") has no em dash, no exclamation mark and none of the banned words.

## 2. Tests, run here

| Suite | Result |
|---|---|
| `npx vitest run` (worktree at `9a2603c`) | 62 files, 743 tests, all pass |
| `node --test worker/test/*.test.js` | 83 pass |
| `test/submit-sent-draft.test.js` with the C sent write no longer waiting for the autosave write on its way | the race test fails (1 of 5), as the builder said |
| same, with `if(sent)return` removed from the autosave's account read | all 5 pass (see note 7) |
| `node src/components/photo-clean/test/test.mjs` (Playwright, merged photo clean) | 10 of 10 pass |
| `node src/components/photo-clean/test/submit.mjs` (Playwright) | 15 of 15 pass |

## 3. Browser run

Chromium (Playwright), one browser at a time (the runner waits for no other `headless_shell` before each run), 42 runs.
Harness: `check-final-run/h2.cjs` (built on `check-run/h.cjs`), analysis `an2.py`, run lists `run2.sh` and `run3.sh`, every run
summarized in `check-final-run/runs-final.json`.

- **live**: the saved HTML as served; core `a254306f` with its chunks, photo clean `22019832`, from git objects at those pins, SRI on.
- **merged**: same HTML; core, chunks and photo clean from the merged worktree (integrity removed in the routed HTML only for the
  core and photo clean; the chunks load with SRI on, using the merged core's hashes).
- **+C**: `fix.md` part C swapped into the inline steps script (routed HTML only, `check-final-run/c-patch.json`).
- **+early**: Memberstack ready before DOMContentLoaded (see note 1). Without it, Memberstack arrives later, as on the real page.
- Stand-ins: Cloudinary upload 4 s a photo; Webflow form post 1.5 s, `{code:200}` (or 500 where the scenario says); Worker
  `/intake` 6 s, `{saved:true,held:true}` (or 502, a dropped connection, or 25 s for "slow"); Memberstack a local fake that keeps
  the member JSON (150 ms reads, 250 ms writes) and can carry it to a later visit; Turnstile a local fake. Every other non-GET
  aborted. Webflow's own form code ran for real.
- Each /submit run waited for the first autosave before Send, so the account already held an unsent draft, as on a real visit.

Times are seconds from the first press. "Faded, own label" = the button disabled while still showing its own label.

| Page, scenario, viewport | Code | Presses (with a submit event) | Swallowed | Uploads | Form posts | Worker calls | Faded, own label | Done box (s, % in view) | Line under the done box | Account writes after the done box |
|---|---|---|---|---|---|---|---|---|---|---|
| submit one 390x844 | live | 1 (1) | 0 | 3 | 1 | 1 | 12.5 s | 14.1, 99% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit one 390x844 | merged+C | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 99% | Saved. It is with the editor. | sent mark |
| submit mash 390x844 | live | 14 (1) | 0 | 3 | 1 | 1 | 12.5 s | 14.1, 99% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit mash 390x844 | merged+C | 14 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 99% | Saved. It is with the editor. | sent mark |
| submit cached 390x844 | live | 3 (3) | 1 | 3 | 2 (1 failed on purpose) | 1 | 12.6 s | 20.6, 99% | "Sending it to the editor…" / Saved. It is with the editor. | none |
| submit cached 390x844 | merged+C | 2 (2) | 0 | 3 | 2 (1 failed on purpose) | 1 | 0.0 s | 18.8, 99% | Saved. It is with the editor. | sent mark |
| submit nopunct 390x844 | live | 3 (3) | 1 | 3 | 1 | 1 | 12.5 s | 19.1, 99% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit nopunct 390x844 | merged+C | 2 (2) | 0 | 3 | 1 | 1 | 0.0 s | 17.3, 100% | Saved. It is with the editor. | sent mark |
| submit upfail 390x844 | live | 2 (2) | 0 | 4 (1 failed) | 1 | 1 | 16.8 s | 21.4, 99% | "Sending it to the editor…" / Saved. It is with the editor. | none |
| submit upfail 390x844 | merged+C | 2 (2) | 0 | 4 (1 failed) | 1 | 1 | 0.0 s | 21.4, 99% | Saved. It is with the editor. | sent mark |
| submit workerfail 390x844 | live | 1 (1) | 0 | 3 | 1 | 1 | 12.5 s | 14.1, 99% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit workerfail 390x844 | merged+C | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.0, 99% (later 92%) | Saved. It is with the editor. / Saved. The editor will add it to the draft list by hand. | sent mark |
| submit workeroff 390x844 | live | 1 (1) | 0 | 3 | 1 | 1 | 12.5 s | 14.1, 99% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit workeroff 390x844 | merged+C | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 99% (later 92%) | Saved. It is with the editor. / Saved. The editor will add it to the draft list by hand. | sent mark |
| submit workerslow 390x844 | live | 1 (1) | 0 | 3 | 1 | 1 | 12.6 s | 14.1, 99% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit workerslow 390x844 | merged+C | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 99% | Saved. It is with the editor. | sent mark |
| submit revisit 390x844 | live | 1 (1) | 0 | 3 | 1 | 1 | 12.5 s | 14.0, 99% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit revisit 390x844 | merged+C | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 99% | Saved. It is with the editor. | sent mark |
| submit revisit 390x844 | live+early | 1 (1) | 0 | 3 | 1 | 1 | 12.5 s | 14.1, 99% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit revisit 390x844 | merged+C+early | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 99% | Saved. It is with the editor. | sent mark |
| submit postfail 390x844 | live | 1 (1) | 0 | 3 | 1 (1 failed on purpose) | 0 | 12.5 s | fail box | - | - |
| submit postfail 390x844 | merged+C | 1 (1) | 0 | 3 | 1 (1 failed on purpose) | 0 | 0.0 s | fail box | - | - |
| submit postfail 390x844 | live+early | 1 (1) | 0 | 3 | 1 (1 failed on purpose) | 0 | 12.5 s | fail box | - | - |
| submit postfail 390x844 | merged+C+early | 1 (1) | 0 | 3 | 1 (1 failed on purpose) | 0 | 0.0 s | fail box | - | - |
| submit race 390x844 | merged+C | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 99% | Saved. It is with the editor. | sent mark |
| submit one 1440x900 | live | 1 (1) | 0 | 3 | 1 | 1 | 12.5 s | 14.1, 100% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit one 1440x900 | merged+C | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 100% | Saved. It is with the editor. | sent mark |
| submit key 1440x900 | live | 1 (1) | 0 | 3 | 1 | 1 | 12.5 s | 14.1, 100% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit key 1440x900 | merged+C | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 100% | Saved. It is with the editor. | sent mark |
| submit workerfail 1440x900 | live | 1 (1) | 0 | 3 | 1 | 1 | 12.5 s | 14.0, 100% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit workerfail 1440x900 | merged+C | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 100% | Saved. It is with the editor. / Saved. The editor will add it to the draft list by hand. | sent mark |
| submit revisit 1440x900 | merged+C | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 100% | Saved. It is with the editor. | sent mark |
| share-photos one 390x844 | live | 1 (1) | 0 | 1 | 1 | 0 | 4.2 s | 5.7, 100% | - | none |
| share-photos one 390x844 | merged | 1 (1) | 0 | 1 | 1 | 0 | 4.2 s | 5.8, 100% | - | none |
| share-photos one 1440x900 | live | 1 (1) | 0 | 1 | 1 | 0 | 4.2 s | 5.8, 100% | - | none |
| share-photos one 1440x900 | merged | 1 (1) | 0 | 1 | 1 | 0 | 4.2 s | 5.7, 100% | - | none |
| my-pets one 390x844 | live | 1 (1) | 0 | 2 | 1 | 0 | 8.4 s | 9.9, 100% | - | none |
| my-pets one 390x844 | merged | 1 (1) | 0 | 2 | 1 | 0 | 0.0 s | 9.9, 100% | - | none |
| my-pets one 1440x900 | live | 1 (1) | 0 | 2 | 1 | 0 | 8.3 s | 9.9, 100% | - | none |
| my-pets one 1440x900 | merged | 1 (1) | 0 | 2 | 1 | 0 | 0.0 s | 10.0, 100% | - | none |
| submit revisit 1440x900 | live | 1 (1) | 0 | 3 | 1 | 1 | 12.6 s | 14.1, 100% | "Sending it to the editor…" / Saved. It is with the editor. | draft (unsent) |
| submit revisit 1440x900 | merged+C+early | 1 (1) | 0 | 3 | 1 | 1 | 0.0 s | 14.1, 100% | Saved. It is with the editor. | sent mark |

Scenarios: one press; mash = a press every second during the uploads (14 presses); cached = the first Webflow post fails on
purpose, then the writer presses again with every photo cached; nopunct = the story ends in an emoji; upfail = the second upload
fails once; workerfail = Worker 502; workeroff = Worker connection dropped; workerslow = Worker answers after 25 s; revisit and
postfail, see section 4; race = Send timed so the done box shows while an autosave account write is on its way (autosave read at
13.9 s, its write at 14.0 s, done box 14.1 s, sent mark read 14.3 s and written 14.4 s, after the autosave write: the account
ends marked sent); key = Enter on Send.

What each check asked for:

1. **One form post per scenario: yes, 42 of 42.** At most one successful post in every run. The extra posts are the forced
   failures (cached: first post 500; postfail: the only post 500).
2. **No extra upload: yes.** /submit 3 uploads a run; upfail 4 (the failed photo and the next one sent again, photo 1 not
   repeated, live and merged alike); /my-pets 2; /share-photos 1. Presses during the uploads started nothing.
3. **Swallowed press: on live 2 (cached at 17.3 s, nopunct at 15.8 s), on merged 0.** Merged needs 2 presses where live needs 3.
4. **The button never sits faded without saying what it is doing: yes on /submit and /my-pets with the merged code.** 0.0 s in
   all 18 merged /submit runs and both merged /my-pets runs, against 12.5 to 16.8 s (/submit) and 8.3 to 8.4 s (/my-pets) on
   live. Labels: "Sending photos 1 of 3", "2 of 3", "3 of 3", then Webflow's "Sending to Copenhagen…" (/my-pets: "Sending photos
   1 of 2", "2 of 2", "Issuing…"). After a failed upload the button comes back as "Send it to the editor". **/share-photos: no**,
   4.2 s on live and merged alike (note 4).
5. **The exact failure line: yes.** Worker 502 and dropped connection, 390 and 1440: "Saved. It is with the editor." at the done
   box (14.0 to 14.1 s), then exactly "Saved. The editor will add it to the draft list by hand." at 20.1 s, `role=status`. A slow
   Worker (25 s) keeps the saved line. Live shows "Sending it to the editor…" for 6 s (25 s when slow), then the same success
   line whether the Worker worked or not.
6. **The done box sentence "Your draft stays in your account either way." is true: yes,** in every merged+C run with a done box
   (16 runs): the account holds `tllStoryDraft` marked sent, 15 fields, story, hero link and both gallery links. The only account
   write after the done box is the sent mark (live: the autosave writes the sent story back as an unsent draft).
7. **Done box in view: yes.** 99 to 100 percent at first show, phone and desktop, live and merged. On the phone with the failure
   line the box grows to 92 percent in view (note 3). `into()` scrolled once (nopunct, merged), box centered, 100 percent.
8. **No new console errors: yes.** 0 page errors in 42 runs. Console errors are the same set in live and merged for every
   scenario: `ERR_FAILED` from requests the harness aborts (`/whats-new`, sitemap, /stories) and the 500, 502 or dropped
   connection the stand-ins were told to give.
9. **/share-photos and /my-pets with the merged chunk and photo clean: one press, one post, done box, no page error,** at 390
   and 1440. /share-photos is skipped by photo clean (its own uploader, see note 4); the merged share-photos chunk changes nothing
   visible there (the done box was already in view, `into()` did not scroll; no intake line, since the box already says a human
   looks at every photo; no Worker call, as `HOLD_PHOTOS` is on).

## 4. Part C on later visits

After the send each run waited 22 s (one autosave tick), then opened /submit again in the same browser with the account as the
first visit left it, waited 4.5 s, then 21 s more (one autosave tick on the later visit, nothing typed); then a third visit in the
same browser, and a visit in a new browser (no local copy).

| After a successful send | live | merged+C | live+early | merged+C+early |
|---|---|---|---|---|
| Second visit, same browser | "Draft restored from your last visit.", sent story in the form | form empty, plain autosave line, no "Draft restored" | "Draft restored", sent story in the form | form empty, "Already sent to the editor. A copy stays in your account." |
| Account after the second visit loads | unsent draft, 15 fields | marked sent, 15 fields, all photo links | unsent draft | marked sent, 15 fields |
| 20 s later, nothing typed | autosave writes the story again, photo links lost (13 fields) | autosave writes 4 generated fields as a new draft; the sent copy moves to `tllStorySent` (kept, 15 fields) | same as live | same as merged+C; the "Already sent" line becomes "Draft saved" |
| Third visit, same browser | "Draft restored", sent story in the form | "Draft restored from your last visit." over an empty form (note 2) | "Draft restored", sent story | "Draft restored" over an empty form (note 2) |
| New browser, account as after the send | form empty (account not read, note 1) | form empty | sent story in the form, no line (390 run, see note 6) | "Already sent to the editor. A copy stays in your account.", form empty (1440 run) |

| After a FAILED Webflow post (fail box, the writer leaves) | live | merged+C | live+early | merged+C+early |
|---|---|---|---|---|
| Account | unsent draft, 15 fields | unsent draft, 15 fields, no sent mark | same | same |
| Second visit, same browser | "Draft restored", story in the form | "Draft restored", story in the form | same | same |
| New browser | form empty | form empty | story in the form | story in the form |

So the unsent draft is restored after a failed post exactly as on live, and the sent story is never put back into the form by C.

## 5. Notes

1. **The "Already sent to the editor" line does not show on the real page as it loads today.** Memberstack is added by
   `tll_memberstack_init_v2` as a dynamic script, so it is not there when the steps script runs at DOMContentLoaded, and the steps
   script's load-time account read (in the before and after block alike) is skipped. In all non-early C revisits (390 and 1440)
   the later visit showed the plain autosave line and an empty form; the "Already sent" line showed only in the +early runs. Nancy's
   requirement still holds (no re-send offer, the copy stays in the account), but `fix.md` part C and the builder's report say the
   later visit "says it was sent", which on the real page is the exception, not the rule. The same race already decides whether
   live restores an account draft in a new browser. If the line matters, wait for `$memberstackDom` before the account read (the
   init script polls every 200 ms up to 10 s; the same loop would do). The unit test passes because the mini DOM sets Memberstack
   before the steps script.
2. **A blank later visit turns into "Draft restored" on the visit after it.** If the writer opens /submit after a send and leaves
   it open 20 s without typing, the autosave saves the fields other scripts fill in (`cf-turnstile-response`, `invite-link`,
   `lounge-photo-pick`, `trip-code`), moves the sent copy to `tllStorySent` (kept), and the next visit in that browser says "Draft
   restored from your last visit." over an empty form. It is not the sent story, so no second send is invited, but the line is
   wrong. Live does the same on any blank visit; C makes it likely right after a send. Smallest fix, in the same page code write as
   C: autosave only when a field the writer fills in (`name`, `excerpt`, `body`, `country`) has a value.
3. **The failure line still runs just below the phone screen.** At 390x844 it wraps to two lines and the done box bottom moves
   from 847 to 869 px (92 percent in view; the 17 Nov line gave 892 px and 86 percent). The word "hand." sits at the bottom edge,
   and the round floating button at the bottom left (also on live) covers the start of the line in the screenshot. Low impact.
4. **/share-photos keeps the faded button.** Its uploader (`tll-photo-send-v1.js`, pin `4d12668`, not photo clean, not changed
   here) disables "Send it to the Lounge →" for 4.2 s a photo without changing the label; the status line under it does say
   "Removing location data and sending your photo. Keep this page open." Same on live and merged, so not a regression, but cause 1
   from `trace.md` remains there. A follow-up could give that script the same label progress.
5. **The sent copy also stores the Turnstile token** (`cf-turnstile-response`) among its fields, as the live autosave already
   does. Harmless (short lived), but the snapshot could skip it with note 2's fix.
6. **Harness slip, corrected.** In the four 390 revisit runs the "new browser" step used the account as left after the second
   visit, not after the send. Fixed in `h2.cjs`; the new-browser case after a send is covered by the 1440 revisit runs (live,
   merged+C, merged+C+early) and the postfail runs.
7. **Test gap, harmless.** Removing `if(sent)return` from the autosave's account read fails no test. It is a second guard: the
   sent write waits for that same autosave write anyway, so the end state is still "sent" (one extra write).

## 6. Not covered, not done

- The real Memberstack, Turnstile, Cloudinary, Webflow form endpoint and Worker (all stand-ins); Safari and iOS.
- No release: A still needs registering and swapping in on /submit and /my-pets (Webflow write and publish), B rides 16.68.0, C
  is a page code write and publish. `layers-release` was not touched.

Screenshots and the raw run file are in the scratch folder of this check (`out/`), not committed.
