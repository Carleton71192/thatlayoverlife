# /submit save on 17 Nov 2026: attempt to refute the trace and the submission count

Read-only. No browser was run. Requests made for this check: one plain GET of https://www.thatlayover.life/submit (to read the
script tag attributes), one Webflow forms list read (Story submission entries) and one Webflow CMS list read (the Stories draft
made by the Worker). Nothing was posted, uploaded, edited or deleted. No personal data is in this file; the writer is "the
contributor". Story text is not quoted here; only whether its last line ends in closing punctuation.

Inputs checked: `trace.md` (commit 0a4b59a) and `submissions.md` (commit 10db7cf) in this folder.

Verdict: PARTLY CONFIRMED. The code reading is accurate and the upload wait is the cause. The second ranked cause (end-of-story
warning hidden on step 3, then a swallowed press) did not happen on 17 Nov: the data rules it out. One wait both reports
missed (the Worker step after the done box) matches the words the contributor used.

## 1. Every line reference re-read

All references were opened at the code that was live (core and chunks at `3df16988`, photo clean at `22019832`, which is
identical to HEAD). Every cited line says what the trace says it does:

- photo clean: 12, 14, 17, 33 to 40, 43 to 52, 55 to 60, 61 to 80 (cache hit at 78 calls `got` synchronously; `requestSubmit` at 72).
- submit chunk: 188, 222 to 223, 282, 307 to 317, 337 to 348, 349, 360 to 377.
- three-step script: 54, 62, 69 to 83. Story extras: the submit listener at the end of the script, with its `.tll-invite-done` guard.
- `src/intake.js`: `storyChecks` (115 to 121), notes "Checks:" line (171), the answer with no `ok` (309 to 313).
- 16.67.0: `git diff 3df16988 50e84bf -- src/site-layers/chunks/` is empty; photo clean is unchanged from `22019832` to `50e84bf`.

Listener order, checked rather than assumed: in the live HTML, both the core (`tll-site-layers-v16.js`) and photo clean are
plain `<script src>` tags with no `async` or `defer`. Photo clean therefore registers its document capture listener while the
page is still parsing, and the chunk's end check registers at DOMContentLoaded or later (chunk 379 to 381). Photo clean
always runs first. The trace is right.

## 2. What the data says about the 17 Nov send

Times are UTC.

| Time | Source | Event |
|---|---|---|
| about 12:09:28 to :29 (estimate) | first upload landed at :33 and each photo took 4 to 5 s | the press that started the send |
| 12:09:33, :37, :42 | Cloudinary versions in the entry | hero, gallery 1, gallery 2 stored, one at a time |
| 12:09:44 (whole seconds) | Webflow `dateSubmitted` | the one Story submission entry |
| 12:09:45.387 | Stories draft `submitted-at` and `charter-agreed-at` (the Worker's clock) | the intake watcher's POST reached the Worker, so the done box was on screen by then |
| 12:09:50.896 | Stories draft `createdOn` | the Worker finished copying the photos and creating the draft; its answer, and the "Saved." line, came after this |

What this settles:

- **The end-of-story check did not block anything.** The entry's body ends, after trimming, with a period. The Worker ran the
  same rule (`storyChecks`) and the draft's notes list only a word-count note, with no "Ends mid-sentence". The check at chunk
  341 returns at once when the last line ends in a period, so path B never ran, and path C (the swallowed `requestSubmit`)
  only follows B or a failed Webflow post. Trace cause 2 is ruled out for this submission.
- **No room for extra presses after the uploads.** The entry landed 2 s after the last upload and the Worker call 1.4 s
  after that. That is one automatic `requestSubmit` from photo clean, then Webflow's own post. Under B and C, two more
  presses would have had to land inside that 2 s window.
- **The "Saved." line was real this time.** The Worker created one draft (one item matches, created at 12:09:50.896). Note
  that the same line is also printed when the Worker fails (chunk 370 and 376), so on its own it proves nothing.
- **The confirmation order fits one send.** The done box text is static; the trip link block is added by the story extras on
  the submit event that reached the form, and it has a guard so it can only appear once; the "Saved." line is added by the
  intake watcher when the done box becomes visible, once per page load (`sent` flag). The order cannot reveal extra presses,
  because presses that were held or swallowed never reach either script.

## 3. What the contributor saw, second by second

1. Press (about :28). The button greys to opacity 0.55 with its label unchanged ("Send it to the editor"). A 14 px status line
   appears under it: "Removing location data and sending 3 photos. Keep this page open.", later "Sent 1 of 3", "Sent 2 of 3".
   Every press in this stretch hits a disabled button and does nothing. About 13 to 14 s.
2. :42. "Photos are up. Sending." The button label turns to "Sending to Copenhagen…" while Webflow posts (Webflow behavior,
   not read here). About 2 s.
3. About :44 to :45. The form disappears and the done box shows, with the trip link, plus a line "Sending it to the editor…".
4. About 6 to 7 s later (after :50.9). That line becomes "Saved. It is with the editor."

From the press to the last line: about 23 s. The contributor's words, "the confirmation 'sent to the editor'", match the last
two lines of the done box, not the done box text itself.

## 4. Claims that do not hold, or need a correction

1. **Trace cause 2 (end check, then swallowed press): ruled out for 17 Nov** (section 2). The mechanism is still a real latent
   bug; see cause 4 below.
2. **"Presses during that time do nothing at all" is right, but "no feedback" overstates it.** The status line does change
   after the first press. The problem is that it is small, sits under a full-width button, and the button looks merely
   faded, not busy.
3. **Submissions report: "the last step took about 11 s before the save landed".** That counts from the first upload, not
   from the press. From the press to the Webflow entry is about 15 to 16 s, and to the "Saved." line about 23 s.
4. **Both reports end the story at the Webflow entry.** Neither looked at the Worker step, which keeps "Sending it to the
   editor…" on screen for 6 s or more after the form is gone (it copies three photos into Webflow assets and creates the
   draft before it answers).
5. **The whole-second `dateSubmitted` (.000).** Not explained here. The three October entries carry milliseconds. It does not
   change the timeline by more than 1 s.

## 5. Other causes the task asked about

- **Large phone photos on a slow link, no progress on the button.** Confirmed as the main cost: 4 to 5 s per photo. Photo
  clean redraws to a 3000 px long edge at JPEG quality 0.9 (clean 13, 25), which is about 1.5 to 3 MB per photo; a 2000 px
  edge would cut the upload roughly in half and is still more than the story pages show.
- **Button below the fold.** Not a cause of silent presses: the status line is inserted right after the button (clean 37), so
  whoever can see the button can see the line. It can be overlooked, which is cause 1.
- **Confirmation off screen.** Possible, not verified (needs a browser). When the long form is hidden, the page gets much
  shorter and the browser clamps the scroll position; nothing scrolls the done box into view. If it lands above the
  viewport, the contributor sees the footer until they scroll up. It would not cause extra entries.
- **A required field or checkbox far up the page.** All required fields are inside the step fieldsets (step 1: four fields
  including the body; step 2: region; step 3: name, email, cover photo, charter box). An empty one makes the step script
  jump to its step (steps 62) and the browser shows its bubble. Visible, not silent. An earlier press of this kind cannot be
  excluded, but it would have been seen, and the entry has every required field filled.
- **An earlier upload pass that failed.** Not excluded: a failure shows a red line and sends nothing. The three stored
  versions are 4 to 5 s apart, so they are one unbroken pass. A Cloudinary listing of `tll/hero-image` and
  `tll/photo-gallery` between 11:59 and 12:09:33 would settle it.
- **Turnstile.** Not read (webflow.js is outside the bandwidth rule). No sign of it here: the one post succeeded on the first
  try after the uploads.

## 6. Ranked causes, with confidence and the smallest fix

1. **Photo upload wait with a weak busy state. High (fits the timeline to the second).** About 13 to 14 s with a faded button,
   unchanged label, and a small status line; presses do nothing.
   Smallest fix (photo clean, about 3 lines): put the progress on the button itself, for example set
   `submit.value='Sending photos 1 of 3…'` at 52 and 77 and restore the original label at 57 and 70. Optional, one constant:
   `EDGE=2000` at line 13 to roughly halve each upload.
2. **The Worker wait after the done box. Medium (fits the contributor's own words).** "Sending it to the editor…" stays for
   6 s or more, then turns into "Saved. It is with the editor.", which reads as "it did not seem to save, then it finally
   did". The line adds nothing: it prints the same text on success and on failure.
   Smallest fix (chunk 367, one line): write `SAVED` at once instead of "Sending it to the editor…", and keep the fetch
   running in the background.
3. **Done box possibly off screen after the form collapses. Low, unverified.**
   Smallest fix (chunk 364, one line): `done.scrollIntoView({block:'center'})` when the done box first becomes visible.
4. **End-of-story warning hidden on step 3, then a swallowed press. Not live on 17 Nov; latent.** It will bite the first
   writer whose last line ends in an emoji, a name, a hashtag, a colon or a curly single quote, and path C also swallows
   the first retry after any failed Webflow post.
   Smallest fixes: defer the call at clean 72 with `setTimeout(...,0)` (one line), and place the end note next to the Send
   button as well as under the body (chunk 343).
5. **Autosave keeps running after the send. Not a cause of the clicks; a later risk.** The 20-second autosave (steps 72 to 82)
   writes the sent story back to this browser and the member's account, so the next visit says "Draft restored". Smallest
   fix: in the intake watcher, when the done box shows, remove `tllStoryDraft` from localStorage again and stop the
   interval (the steps script needs to expose it, or the watcher can set a flag the autosave checks).
6. **Turnstile holding the button. Low, unverified, no evidence.** No fix until webflow.js is read.
