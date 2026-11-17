# /submit save on 17 Nov 2026: code trace of the Send button

Read-only trace. No browser was run, nothing was posted, uploaded or written anywhere. One plain GET of
https://www.thatlayover.life/submit (signed out, 17 Nov 2026 15:21 UTC) and one plain GET of /share-photos (to name its form).
No personal data in this file; the writer is "the contributor".

Report from the contributor: on the last step they had to press a few times before the confirmation came; it did not seem to
save, then it did. One Story submission entry exists (12:09:44 UTC), with three Cloudinary uploads at 12:09:33, :37 and :42
(see `submissions.md` in this folder).

## 1. The code that ran is the code read here

| Piece | Live page (GET 15:21 UTC) | Repo | Match |
|---|---|---|---|
| Core | `tll-site-layers-v16.js` at pin `3df16988`, integrity `sha384-trfI5wIn...` | `git show 3df16988:src/site-layers/tll-site-layers-v16.js` | hash equal |
| Submit chunk | loaded by the core loader, integrity `sha384-Bz10Zxc9...` (core line 61) | `git show 3df16988:src/site-layers/chunks/submit.js`, identical to the working tree file | hash equal |
| Photo clean | `tll-photo-clean-v1.js` at `22019832`, last script in the body, integrity `sha384-AAifp68s...` | `src/components/photo-clean/tll-photo-clean-v1.js` (unchanged since `22019832`) | hash equal |
| Three-step form script (inline `tll-form-steps-js-v2`) | 5454 chars | `src/pages/submit/live-2026-11-11/followups/footer.before.html` lines 35 to 86 | text equal |
| Story form extras (inline `tll-story-extras-js-v1`) | 3572 chars | `src/pages/submit/live-2026-10-29/form-story-export-2026-10-13.html` lines 107 to 148 | text equal |

Script order and inline hashes: `live-2026-11-17T1521Z/scripts.txt`. Form lines cited below: `live-2026-11-17T1521Z/story-form-lines.txt`.
Not read: `webflow.75bd4d11...js` (Webflow's form handler and its Turnstile code) and the registered Memberstack scripts; fetching
them was outside this task's bandwidth rule. Anything said about them below is marked unverified.

Below, "chunk" means `src/site-layers/chunks/submit.js`, "clean" means `src/components/photo-clean/tll-photo-clean-v1.js`,
"steps" means `src/pages/submit/live-2026-11-11/followups/footer.before.html`, "extras" means
`src/pages/submit/live-2026-10-29/form-story-export-2026-10-13.html`, "intake" means `src/intake.js`.

## 2. The element

The button is `<input type="submit" value="Send it to the editor" data-wait="Sending to Copenhagen…">` inside
`.tll-pen-actions` (story-form-lines 620 to 621). The three-step script shows `.tll-pen-actions` only on step 3 (steps 54).
The form is `form[data-tll-form="submit-story"]`, `method="get"`, `data-ms-member-bound`, `data-turnstile-sitekey`, and has no
`novalidate` (story-form-lines 2). The body textarea is in a step 1 fieldset (story-form-lines 23, 38); the file fields and the
charter box are in step 3 (story-form-lines 502 to 517). Hidden steps get the class `tllst-hide`, which the page CSS sets to `display:none` with important.

Nothing binds a click handler to this button. Everything runs on the form's `submit` event.

## 3. What runs, in order, on one press

Listener order for `submit`: capture listeners on `document` run first, in the order they were added. Photo clean is a
parser-blocking script at the end of the body, so it registers before DOMContentLoaded (clean 43). The chunk is injected by
the core with `async=false` (core 74) and its intake layer registers its own `document` capture listener at DOMContentLoaded or
later (chunk 341, 379 to 381). So photo clean always runs before the chunk's check.

Press 1 (photos chosen, which was the case here):

1. Browser constraint check (no `novalidate`). If a required field in a hidden step is empty, `invalid` fires and the steps
   script switches to that step (steps 62); the browser shows its bubble. Visible, and nothing else runs.
2. `submit` event. Photo clean, capture on `document` (clean 43 to 81): finds file inputs with files (clean 47), cancels the
   event and stops every later listener (clean 49), sets `busy` (clean 51), disables the button (clean 52), writes
   "Removing location data and sending 3 photos. Keep this page open." in a status line placed right after the button
   (clean 33 to 40, 55).
3. One photo at a time: decode, redraw on a canvas, JPEG, POST to Cloudinary (clean 20 to 32, 61 to 80). The status line
   reads "Sent 1 of 3", "Sent 2 of 3" (clean 77). Each link is kept in an in-memory cache keyed by name, size and
   lastModified (clean 14, 17, 77).
4. After the last upload: the file inputs lose their `name` (kept in `data-tll-photo-name`), hidden inputs `hero-image` and
   `photo-gallery` get the links (clean 63 to 69), `busy` is cleared, `pass` is set, the button is enabled, the status line reads
   "Photos are up. Sending." (clean 70 to 71), and `form.requestSubmit(button)` is called (clean 72). This runs from a promise
   callback, after the first event has finished.
5. Second `submit` event (from requestSubmit). Constraint check again (passes). Photo clean sees `pass`, clears it and lets
   the event through (clean 46).
6. Chunk end check, capture on `document` (chunk 339 to 348): takes the last non-empty line of the body. If it does not end in
   `. ? … " ” ' ) ]` or an exclamation point, and this exact line has not been warned about yet, it cancels the event, stops every later
   listener (chunk 342), and writes "Your story seems to stop mid-sentence ... press Send again" right after the body
   textarea (chunk 343 to 344), then tries to focus the textarea (chunk 345). If the line ends in punctuation, it does nothing.
7. Long-body splitter, capture on the form: copies a body over 3500 characters into hidden `body-part-N` fields (chunk 307 to
   312, 317).
8. Target and bubble listeners on the form: the extras script adds `https://` to link fields and puts the trip link into the
   done box (extras 142 to 146); the steps script removes the local draft (steps 83); GA4 watches the done box.
9. Webflow's own form handler (delegated, bubble; unverified, file not read) serializes the form, swaps the button label to
   `data-wait` "Sending to Copenhagen…", posts to Webflow, then hides the form and shows `.w-form-done`
   ("It's with the editor. Nancy reads it. ...", story-form-lines 625 to 626).
10. The chunk's intake watcher sees the done box become visible (chunk 360 to 377), adds "Sending it to the editor…"
    (chunk 367) and POSTs the fields to the travel-wire Worker `/intake` with the member token (chunk 368). The Worker saves a
    draft and answers `{saved:true, held:true}` with no `ok` on purpose (intake 309 to 313), so the page replaces the line with
    "Saved. It is with the editor." (chunk 349, 370). On any Worker error the same line is shown (chunk 376). That line is the
    normal ending, not a sign of a retry.

There is no Memberstack draft save in this path. The Memberstack draft is the 20-second autosave (steps 69 to 82), which is
not tied to the button. Memberstack is used only for the intake token (chunk 337).

## 4. What the contributor sees during the press

| Time | Button | Text near the button |
|---|---|---|
| press to last upload (here about 13 to 16 s: first upload done at :33, last at :42, the press a few seconds before :33) | disabled, opacity 0.55 (page CSS `.w-button:disabled`), label unchanged "Send it to the editor", no spinner | small status line: "Removing location data...", then "Sent 1 of 3", "Sent 2 of 3" |
| upload done to Webflow answer (here about 2 s) | enabled for a moment, then "Sending to Copenhagen…" (unverified Webflow behavior) | "Photos are up. Sending." |
| after | form hidden | done box, trip link, "Sending it to the editor…", then "Saved. It is with the editor." |

A press on the disabled button does nothing at all: no event, no message. Before that, the page told the contributor that
photos "upload when you send" (chunk 222 to 223) and "Photos are added when you send" (chunk 282), but not how long it takes.

## 5. Every path where a press does nothing visible or stops

| # | Path | Where | What the contributor sees | Live on 17 Nov |
|---|---|---|---|---|
| A | Press while photos upload | clean 50 to 52 | nothing; the button is disabled and `busy` swallows any submit | yes, about 13 to 16 s with 3 photos |
| B | End check blocks the send after the uploads | chunk 341 to 345 | the warning is written under the body textarea, which sits in step 1 and is hidden on step 3 (`display:none`); focusing a hidden textarea does nothing; the steps script only reacts to `invalid`, not to this. The page keeps "Photos are up. Sending." with an enabled button | yes, whenever the body's last line ends without closing punctuation (an emoji, a name, a hashtag, a curly single quote, a colon) |
| C | The press after B: every photo is already in the cache | clean 76 to 78, 61 to 73 | the whole upload loop runs synchronously inside the submit event, so `requestSubmit` is called while the browser is still firing that event. The HTML form submission algorithm returns at once in that case ("if form's firing submission events is true, then return"); nothing throws, so the catch at clean 73 never runs. The event itself was cancelled (clean 49). Result: no send, `pass` stays set, the status line still reads "Photos are up. Sending." | yes, after B or after any failed Webflow post |
| D | The press after C | clean 46, chunk 344 | `pass` lets it through, the end check has already warned about this line, Webflow sends | yes |
| E | Turnstile token not ready or refreshing | Webflow (unverified) | per the repo's own note (`reports/fix-first/applied/stories-footer-before.txt` 52), Webflow keeps a Turnstile form's button disabled until the token is in; photo clean then forces `disabled=false` (clean 57, 70) whatever Turnstile wants | unknown |
| F | Required field empty in step 1 or 2 | steps 62 | jumps to that step with the browser bubble | visible, not silent |
| G | A photo cannot be read or an upload fails | clean 56 to 60 | red line "... Nothing was sent." and the button comes back | visible, not silent |
| H | Not signed in or no token | chunk 366 | the form still sends; only the Worker draft is skipped | not silent for the press |

Handlers bound twice: none. Photo clean is guarded by `window.__tllPhotoClean` (clean 12), the end check by `form.__tllEnd`
(chunk 340), the intake watcher by `form.__tllIntake` and `sent` (chunk 361, 363 to 364), the steps script by `__tllSteps2`,
the extras by `__tllExtras`, the splitter by `dataset.tllLong`. The chunk runs its `run()` twice (DOMContentLoaded and 1.5 s)
but each guard holds. The consent script's capture click listener only acts on cookie links (inline `tll-consent-v3`).

Put together, B, C and D give exactly three presses for one send, with the uploads only once:
press 1 uploads and is then stopped by B with no visible sign; press 2 is eaten by C ("Photos are up. Sending." stays and
nothing happens); press 3 sends. A alone gives "it did not seem to save" with presses that do nothing, then the confirmation
by itself about 15 s after the first press.

## 6. Can a press upload the same photos twice, or post twice

Uploads, within one page load: no. Presses during the uploads are swallowed (clean 50 to 52), and a later Send reuses each
link from the cache (clean 78), so a re-send after B, C or a Webflow failure uploads nothing new. The three Cloudinary
versions (one each at :33, :37, :42, 4 to 5 s apart, one per photo) fit one single pass.

Uploads that can still leave unused copies on Cloudinary:
- a page reload, or picking the same photo again, which gives a new File object (the gallery layer notes pickers can give
  a fresh time on each pick, chunk 188), then Send: a new upload;
- removing a photo after a pass that did not end in a send: its copy stays;
- a failed pass: the photos uploaded before the failure stay (they are reused on the retry in the same page load).

Form posts: one Story submission entry exists. Photo clean posts only through `requestSubmit` once per pass, and B and C both
cancel before Webflow's handler, so they cannot cause a second post. Whether Webflow's handler itself ignores a second
submit while its first post is in flight was not checked (file not read); here the form is hidden as soon as the post
answers. The Worker draft is created once per page load (`sent` flag, chunk 363 to 364).

A later duplicate is possible: after the send, the steps script keeps its 20-second autosave running (steps 82). The
snapshot now includes the new hidden `hero-image`, `photo-gallery` and `photo-plan` values, so it differs from the last one
and is written back to `localStorage` and to the member's JSON (steps 69 to 81), after the submit listener cleared it
(steps 83). On the next visit the form fills itself with the story already sent and says "Draft restored from your last
visit" (chunk 279, 281). A contributor who thinks the first send failed may send it again.

## 7. Core 16.67.0 (merge 50e84bf) and the save path

No effect. Between pin `3df16988` and `50e84bf` the chunks `submit.js`, `submit-preview.js` and `share-photos.js` are
unchanged (git diff is empty). On /submit, `tll-early-state-v1` adds only the nav style (`src/site-layers/tll-early-state-v1.js`
85 to 105: a `display:contents` style on the members wrapper until the page is parsed, dropped before navOut) and the stand-in
Menu button (66 to 83); neither touches the form, its fields or `submit`. `tll-first-paint-v1` returns at once on /submit
(`src/site-layers/tll-first-paint-v1.js` 38 to 39: only /travelers, /the-map, /about). Photo clean is a separate script and is
not part of the core.

## 8. Causes, ranked

1. **The held send during the photo uploads (A).** About 13 to 16 s with the button disabled, its label unchanged and no
   spinner; only a small status line changes. Presses in that time do nothing. Fits the timing exactly: the entry was saved 2 s
   after the last upload, and the uploads were one pass. Sure that it happened; likely the main reason the send "did not seem
   to save". It explains presses that did nothing; it does not by itself require more than one press.
2. **The end check hidden on step 3 (B), followed by the eaten press (C).** Three presses for one send, one upload pass, one
   entry: matches "had to click a few times" literally. Sure that the code behaves this way when the body's last line has no
   closing punctuation (C rests on the HTML standard's form submission algorithm; not run in a browser here). Not yet known
   whether this story's last line triggered it. The timing allows it only if presses 2 and 3 came within about 2 s after
   the uploads, which fits someone pressing repeatedly through the wait. Medium.
3. **Turnstile holding the button (E).** Unverified: Webflow's Turnstile code was not read. Low.

The check that settles 1 against 2, read-only: the Worker writes its checks into the draft's Notes to editor
(intake 116 to 121, 171). If that note on the 17 Nov draft lists "Ends mid-sentence", path B ran. The same can be read from
the form entry: does the body's last non-empty line end in one of `. ? … " ” ' ) ]` or an exclamation point. Report only yes or no.

## 9. Smallest fixes (proposals only; no code changed)

- For A: in photo clean, while holding, set the button label to "Sending photos 1 of 3…" (and back after), not only
  `disabled`; or put the status text inside the button. About three lines around clean 52, 70 and 77.
- For B: when the end check stops a send and the body is on a hidden step, show the warning next to the Send button as well
  (or switch to step 1, for example by firing the steps script's step change), so the press visibly does something. A few
  lines at chunk 343 to 345. Optionally run the end check before the uploads, so a stop costs no wait.
- For C: in photo clean, call `requestSubmit` outside the event, for example `setTimeout(function(){ form.requestSubmit(...) },0)`
  at clean 72, so a fully cached pass still sends. One line. With B fixed the contributor would have needed two presses
  (one warning, one send); with C fixed as well, still two, and the second one sends.
- For the later duplicate in section 6: stop the 20-second autosave once a send passes (clear the interval in the steps
  script's submit listener, steps 82 to 83), so the sent story is not written back as a draft.
- Tests: `src/components/photo-clean/test/submit.mjs` loads the form and the steps footer but not the submit chunk, so the end
  check never meets photo clean there. Adding the chunk and a body whose last line has no closing punctuation would cover B
  and C (to be run when a browser is free).
