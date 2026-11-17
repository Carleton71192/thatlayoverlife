# /submit send wait: independent check of the fix branch (17 Nov 2026)

Branch checked: `claude/submit-send-wait-2026-11-17`, head `0a2c53d`, from `c949801`. Read with `trace.md`, `refute.md`,
`submissions.md` and the branch's `fix.md` in this folder.

Verdict: **PASS WITH NOTES.** Parts A and B do what `fix.md` says, in a real browser, on the live /submit page, with no
regression found. Part C (not on the branch, a proposal) also works when patched in, but it contradicts the done box text.
Notes 1 to 6 below.

No Webflow tool call, no publish, no form post, no upload, no Memberstack call. Requests that left the machine: one plain GET
of www /submit (15:54 UTC, saved to disk and served from disk for every load), GETs of static files already cached from
earlier checks, and three plain GETs of the travel-wire Worker's public `/whats-new` that the harness let through by mistake
in its first three page loads (each failed at the network level, no answer was received or stored; from the fourth load on,
every `workers.dev` and `cloudinary.com` request was blocked or stubbed). No contributor or member data is used here: the form
was filled with dummy text and three generated test images.

## 1. Code read line by line

- Photo clean (`src/components/photo-clean/tll-photo-clean-v1.js`, 20 lines added, 8 changed): label helpers, progress label
  in `busy()`, label restored in `fail()` and in the deferred send, `requestSubmit` moved into `setTimeout(...,0)` with
  `busy` held and the button disabled until then. No other behavior changed. The file hashes to
  `sha384-b9+lDanshflZ9KVhLlM/GTjhrqKXDFpVs+iXXE5NYL7BLq1hiKvHH6v7kWFDo/rP` (matches `fix.md`); the live pin `22019832` hashes to
  `sha384-AAifp68s...` (matches the live HTML).
- Intake layer (`src/site-layers/tll-intake-v1.js`): end note now written twice (`.tll-end-body` under the story box,
  `.tll-end-send` after the pressed button with `role=alert`), photo clean's status line emptied when the note shows, both
  notes removed when the last line is fixed; saved line written at once with `role=status`; success is `r.ok && (ok||saved)`;
  failure line `SAVED_FORM`; `into(done)` scrolls only when the box is outside the window. Every Worker answer in
  `src/intake.js` (`handleIntake`) was checked against it: `{saved,held}` keeps the saved line; 400, 401, 404, 429, 502 and
  503 answers and a dropped connection give `SAVED_FORM`. All of those happen after Webflow accepted the form, so "It reached
  the editor by form" is true in each case.
- Build: `python3 src/site-layers/build-site-layers-v16.py` on the branch reproduces the committed `submit.js`,
  `submit-preview.js`, `share-photos.js` and core byte for byte (no diff). The three chunk diffs are the same intake diff; the
  core diff against `c949801` is only the three integrity strings. (Against the live pin `3df16988` the branch core also
  carries 16.67.0, see section 3.)
- `fix.md` part C: the "before" block equals lines 71 to 83 of `footer.before.html` byte for byte, and occurs exactly once in
  today's live HTML.
- New copy ("Sending your photo", "Sending photos N of M", "Photos are up. Sending", the `SAVED_FORM` line): US English, no em
  dash, no exclamation mark, none of the banned words.

## 2. Tests, run here

| Suite | Result |
|---|---|
| `npx vitest run` on the branch | 61 files, 738 tests, all pass |
| `node --test worker/test/*.test.js` | 83 pass |
| `test/submit-send-wait.test.js` with the `c949801` photo clean and chunk swapped in | 5 of 7 fail (as the builder said) |

The repo's Playwright checks (`src/components/photo-clean/test/test.mjs`, `submit.mjs`) were not run; the browser run below
covers the same ground on the real page.

## 3. Browser run

Waited for no other `headless_shell` before every load (none was running; the runner checks before each run). Chromium
(Playwright), 390x844 phone (touch) unless noted, 20 runs. Harness: `check-run/h.cjs`, summary of every run:
`check-run/runs.json`.

- **live**: the saved /submit HTML as served, core `3df16988` with its chunks, photo clean `22019832`, all from git objects at
  those pins, SRI on.
- **branch**: same HTML, core, `submit.js` and photo clean from the branch (integrity attribute removed in the routed HTML only
  for the core and photo clean; the chunk loads with SRI on, using the branch core's hash).
- **c1667**: core `50e84bf` (16.67.0) with its chunks and photo clean `22019832`, to separate the fix from 16.67.0, which the
  branch also contains. It behaved exactly like live in every measure below.
- Stubs: Cloudinary upload 4 s per photo; Webflow form post 1.5 s, answers `{code:200}`; Worker `/intake` 6 s, answers
  `{saved:true,held:true}` (or 502, or a dropped connection); Memberstack is a local fake (signed-in test member, token, member
  JSON kept in memory); Turnstile is a local fake that hands Webflow a test token. Every other non-GET is aborted.
- Webflow's own form code (webflow.js forms module) ran for real: label swap to "Sending to Copenhagen…", post, done or fail box,
  focus on that box.

Times are seconds from the first press. "Faded, own label" = the button disabled while still reading "Send it to the editor".

| Scenario | Code | Presses that fired | Swallowed sends | Uploads | Form posts | Worker calls | Faded, own label | Done box | "Saved." line |
|---|---|---|---|---|---|---|---|---|---|
| One press | live | 1 | 0 | 3 | 1 | 1 | 12.6 s | 14.2 | 20.2 (after 6 s of "Sending it to the editor…") |
| One press | branch | 1 | 0 | 3 | 1 | 1 | 0 | 14.2 | 14.2 |
| A press every second during the uploads (14 presses) | live | 1 | 0 | 3 | 1 | 1 | 12.6 s | 14.1 | 20.2 |
| same (15 presses) | branch | 1 | 0 | 3 | 1 | 1 | 0 | 14.2 | 14.2 |
| Forced cancel (first Webflow post fails), then a cached re-send | live | 3 | 1 | 3 | 2 (1 failed, 1 ok) | 1 | 12.6 s | 20.8 | 26.8 |
| same | branch | 2 | 0 | 3 | 2 (1 failed, 1 ok) | 1 | 0 | 18.7 | 18.7 |
| Body ends without punctuation (emoji) | live | 3 | 1 | 3 | 1 | 1 | 12.6 s | 19.3 | 25.3 |
| same | branch | 2 | 0 | 3 | 1 | 1 | 0 | 17.5 | 17.5 |
| Second upload fails, then one retry | live | 2 | 0 | 4 (1 failed; photo 1 not re-sent) | 1 | 1 | 16.9 s | 21.5 | 27.6 |
| same | branch | 2 | 0 | 4 (same) | 1 | 1 | 0 | 21.5 | 21.5 |
| Worker answers 502 | live | 1 | 0 | 3 | 1 | 1 | 12.6 s | 14.1 | 20.1, same line as success |
| same | branch | 1 | 0 | 3 | 1 | 1 | 0 | 14.1 | 14.1, then the "by form" line at 20.1 |
| Worker connection drops | live | 1 | 0 | 3 | 1 | 1 | 12.6 s | 14.2 | 20.2, same line as success |
| same | branch | 1 | 0 | 3 | 1 | 1 | 0 | 14.2 | 14.2, then the "by form" line at 20.2 |
| Keyboard (Enter on Send), 1440x900 | live / branch | 1 / 1 | 0 / 0 | 3 / 3 | 1 / 1 | 1 / 1 | 12.6 s / 0 | 14.1 / 14.1 | 20.1 / 14.1 |
| One press, 1440x900 | live / branch | 1 / 1 | 0 / 0 | 3 / 3 | 1 / 1 | 1 / 1 | 12.6 s / 0 | 14.2 / 14.1 | 20.2 / 14.1 |

What each check asked for:

1. **One successful form post per scenario: yes, in all 20 runs.** The two runs with two posts are the forced-cancel runs,
   where the first post is made to fail on purpose; exactly one post succeeded. Each successful post carried the hero link,
   two gallery links and the Turnstile field.
2. **No extra upload: yes.** Three uploads per run. Presses during the uploads started nothing (no submit event at all: the
   button is disabled). Re-sends after a cancel or an end note reused all three links. After a failed upload, only the failed
   photo and the ones after it were sent again (4 uploads, photo 1 not repeated), in live and branch alike.
3. **The swallowed press (trace path C) is real on live and gone on the branch.** Live: the `requestSubmit` inside the
   cached pass fired no submit event (forced-cancel run at 17.4 s, punctuation run at 15.9 s), so a third press was needed;
   between the two, the enabled button sat under the line "Photos are up. Sending." with nothing sending. Branch: the deferred
   `requestSubmit` fired its event every time; two presses in both runs.
4. **The button never sits faded without saying what it is doing: yes on the branch.** 0 s in every branch run, against 12.6
   to 16.9 s on live. Branch label sequence: "Sending photos 1 of 3", "2 of 3", "3 of 3", then Webflow's "Sending to
   Copenhagen…". ("Photos are up. Sending" lasts under 50 ms before Webflow takes over, so it was never sampled; that is fine.)
   After a failed upload the button comes back as "Send it to the editor", enabled, with the red line under it.
5. **End note visible: yes on the branch.** The note next to Send showed on step 3 with `role=alert`, the copy under the
   hidden story box stayed hidden, and photo clean's status line was emptied. On live the only note is the hidden one, and
   the screen shows "Photos are up. Sending." with an enabled button.
6. **Done box in view: yes, in every run, live and branch.** On this page Webflow itself focuses the done box when it shows
   it (it has `tabindex=-1`), and the browser scrolls it into view: 99 to 100 percent visible on the phone (top 558, bottom 847
   of 844) and 100 percent at 1440x900. The branch's `into()` fired once (punctuation run, where the note by Send changed the
   layout) and centered it (top 290). So the off-screen risk from `refute.md` did not appear in either version; `into()` is
   a harmless backstop. See note 2 for the failure line.
7. **Keyboard focus and aria.** Same in live and branch: focus falls to `body` as soon as the button is disabled, stays there
   during the uploads, and moves to the done box (or the fail box) when Webflow shows it. The branch's saved line carries
   `role=status` (live had none); the note by Send carries `role=alert`; photo clean's line keeps `role=status`, `alert` on
   failure. See note 3.
8. **No new console errors.** No page errors in any run. Console errors are the same set in live and branch for each scenario:
   `ERR_FAILED` from requests the harness aborts (sitemap, /stories prefetch, the Worker's `/whats-new`), and the 500, 502 or
   dropped connection the stubs were told to give.

## 4. Part C, tried in the browser (patched into the routed HTML only)

| After the send (one press, then 22 s for an autosave tick) | live | branch | branch + C |
|---|---|---|---|
| account writes (`updateMemberJSON`) after the done box | 1 (writes `tllStoryDraft` back) | 1 | 0 |
| `localStorage.tllStoryDraft` | present (15 fields) | present (15 fields) | absent |
| `tllStoryDraft` on the account | present | present | absent |

C does what `fix.md` says. The branch alone (A and B) still writes the sent story back as a draft, as expected, since C is
not on it.

## 5. Notes

1. **Part C contradicts the done box.** The live done box says "Your draft stays in your account either way." C removes the
   draft from the account once the box shows. Either the done box text changes in the same Webflow write, or C keeps the
   account copy and only stops the autosave. This needs the editor's decision before C goes out.
2. **On a Worker failure the longer line runs below the phone screen.** With `SAVED_FORM` (three lines at 390 px), the done
   box bottom moves from 847 to 892 on an 844 px window (86 percent visible); `into()` runs only when the box first shows, so it
   does not follow. Low impact (the first line, "Saved.", is on screen), and a shorter line would avoid it, for example
   "Saved. It reached the editor by form. The draft copy will be added by hand."
3. **Focus is lost while the photos upload (unchanged from live).** A keyboard or screen reader user is left on `body` for
   about 13 s, and after a failed upload or the end note focus is not returned to anything (the end check's
   `ta.focus()` targets the hidden story box and does nothing). Not a regression. A small follow-up: on failure and when the
   note by Send shows, focus the Send button (the alert is already announced).
4. **The saved line is inserted with its text already in it.** `role=status` on a node added with content is not reliably
   announced, but Webflow focuses the done box first, so the region is read anyway. Fine as is.
5. **The end check still waits for the uploads.** A story ending without punctuation still costs the full upload pass
   (12.6 s here) before the note appears; the second press then sends at once without uploading. The builder chose this on
   purpose; worth a later look.
6. **Release plan holds.** A (photo clean) is independent of the core and can go first; B needs the next core release after
   16.67.0. The c1667 run shows 16.67.0 changes nothing in this flow. `fix.md`'s advice to rebuild the core on the merged tree
   rather than hand-resolve the integrity lines is right (the build is reproducible).

Not covered: the real Turnstile, the real Memberstack and Webflow's real post endpoint (all stubbed), Safari and iOS, and
/my-pets and /share-photos in a browser (only read: /share-photos is skipped by photo clean and gets only `into()`).
