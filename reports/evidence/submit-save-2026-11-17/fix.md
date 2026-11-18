# /submit send wait: the fix (17 Nov 2026; Nancy's choices applied 18 Nov)

18 Nov 2026, Nancy chose ("Keep going with your recommendations"): (1) after the send only stop the autosave and keep the draft
in the account (part C rewritten below); (2) the Worker failure line is exactly "Saved. The editor will add it to the draft list
by hand." (part B); (3) photos stay at 3000 px (`EDGE` unchanged in part A).

Branch `claude/submit-send-wait-2026-11-17`, from the session branch at `c949801`. Built and tested without a browser (the only
browser was in use): vitest with a small stand-in DOM (`test/mini-dom.js`). Nothing was published, registered or sent; no
Webflow, Cloudinary, Memberstack or Worker call was made. No contributor data is in this file or in the tests.

Read with `trace.md`, `refute.md` and `submissions.md` in this folder. The causes this fixes:

1. Photo uploads run on Send (about 4 to 5 s a photo, about 15 s for three) while the button only fades and keeps its label.
2. After the done box shows, "Sending it to the editor…" stays for about 6 s while the Worker makes the draft, then turns into
   "Saved. It is with the editor.", which is printed whether the Worker call worked or not.
3. Latent: the done box can sit off screen once the long form collapses; the end-of-story note is written under the story box
   on hidden step 1; a press where every photo is already cached is swallowed (requestSubmit inside a firing submit event);
   the 20 s autosave keeps running after the send and writes the sent story back as a draft.

The three parts deploy in three different ways, so each is listed with its own path and its own rollback.

## A. Photo clean (its own hosted script)

File: `src/components/photo-clean/tll-photo-clean-v1.js` (20 lines added, 8 changed; same file name, same behavior otherwise).

What changes:

- While photos upload, the Send button label itself shows the progress: "Sending photos 1 of 3", "Sending photos 2 of 3",
  "Sending photos 3 of 3" ("Sending your photo" for one), then "Photos are up. Sending". The small status line under the
  button still changes as before.
- The button's own label ("Send it to the editor") is put back on failure, and on success just before the form is sent.
  Before, not after: Webflow's form handler stores the label it finds when the form is sent and puts it back if its own post
  fails, so it must find the real label.
- The send after the uploads (`requestSubmit`) runs in the next task (`setTimeout 0`). When every photo is already cached the
  upload loop finishes inside the submit event, and the HTML form submission algorithm returns without sending if the form is
  "firing submission events". The button stays disabled and the hold stays on until that next task, so a press in between
  cannot start a second send.

Why: cause 1 (the writer pressed a faded button that looked idle) and the latent swallowed press (path C in `trace.md`).

Where it deploys: photo clean is not part of the core. It is a registered hosted script in Webflow, served from jsDelivr at a
commit pin. Live on 17 Nov:
`https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@22019832ad62816bc7c9f20805d2549615cfc508/src/components/photo-clean/tll-photo-clean-v1.js`
with integrity `sha384-AAifp68s8YonZMUePqdmkqh1tCcdKPmYFwY640tgYRXuXGeynwK9F5ARXarResAO`. To release: once this branch is
merged, register a new version of the script pointing at the merge commit's jsDelivr URL with integrity
`sha384-b9+lDanshflZ9KVhLlM/GTjhrqKXDFpVs+iXXE5NYL7BLq1hiKvHH6v7kWFDo/rP` (the file at this branch head; check it again at the
merge commit), swap it in on the pages that carry photo clean (/submit, and per its header /my-pets), and publish. That is a
Webflow write and a publish: not done here. It does not wait for the core release; A and B can go out in either order.

Rollback: register or re-apply the 22019832 pin and integrity above on the same pages and publish. Nothing else depends on the
new version.

## B. The submit chunk (next core release)

Source: `src/site-layers/tll-intake-v1.js`. Built into `src/site-layers/chunks/submit.js`, `submit-preview.js` and
`share-photos.js` (the intake layer rides in all three), and the core `src/site-layers/tll-site-layers-v16.js` changes only in
the integrity hashes of those chunks (`python3 src/site-layers/build-site-layers-v16.py`, run on this branch).

What changes:

- When Webflow's done box shows, the line "Saved. It is with the editor." is there at once (it is true: Webflow has the story
  and the editor gets the form notification). The Worker call that makes the draft runs in the background. "Sending it to the
  editor…" is gone.
- If the Worker call fails (an error answer, no network, or an answer with neither `saved` nor `ok`), the line becomes:
  "Saved. The editor will add it to the draft list by hand." (Nancy's line, 18 Nov; the 17 Nov draft line was three lines long
  on a phone and pushed the done box below the screen, `check.md` note 2.) Before, success and failure printed the same line. Success is now `r.ok` and (`saved` or `ok`), which matches what the live
  Worker answers (`{saved:true, held:true}`, `src/intake.js` 313).
- An older Worker answer with `ok` and a `url` still turns the line into "It is live. Read it on the site". An answer with `ok`
  and `held` now keeps the saved line (before, the line was removed; with the line now shown at once, removing it 6 s later
  would look like a glitch).
- The done box is scrolled into view when it first shows, only if it is outside the window (`block:center`, or `start` if it is
  taller than the window). On /share-photos too, since the same watcher runs there.
- The end-of-story note ("Your story seems to stop mid-sentence: ... press Send again to send it as it is.") is shown next to
  the Send button as well as under the story box, because the story box is on step 1, which is hidden when Send is pressed on
  step 3. The note by the button carries `role=alert`. When the note shows, photo clean's "Photos are up. Sending." line is
  emptied, since nothing is sending then. Finishing the last line removes both notes.

Why: cause 2 (the 6 s wait read as "it did not seem to save"), the dishonest identical line, the off-screen done box, and the
hidden end note (path B in `trace.md`).

Where it deploys: with the core, from `layers-release`, in the NEXT core release after 16.67.0 (16.67.0 is mid-release and is
not touched; `layers-release` was not touched). When this branch is merged after 16.67.0 lands, the core file's chunk-integrity
lines will conflict or go stale: rebuild with `python3 src/site-layers/build-site-layers-v16.py` on the merged tree rather than
picking either side.

Rollback: revert the `src/site-layers/tll-intake-v1.js` change, rebuild, and release; or keep serving the previous core pin.
The Worker needs no change for either direction (the page reads both its answers correctly).

## C. Page code: stop the autosave after the send and keep the draft in the account, marked sent (proposal only, NOT applied)

Nancy's choice (18 Nov 2026, "Keep going with your recommendations"): after the send, only stop the autosave; do not delete the
draft. The done box sentence "Your draft stays in your account either way." stays true. This replaces the 17 Nov proposal,
which removed the account copy and so contradicted that sentence (`check.md`, note 1).

Where: the inline three-step script `tll-form-steps-js-v2` in the /submit page custom code (Before `</body>`). Repo copy:
`src/pages/submit/live-2026-11-11/followups/footer.before.html` lines 71 to 83. Changing it is a Webflow page custom code write
and a publish, to be done later. Nothing in the repo or on the site was changed for C.

What the page does with the draft today (read from the before block and the gallery layer, and run in
`test/submit-sent-draft.test.js`):

1. At the first submit event the steps script's submit handler removes this browser's copy (`localStorage.tllStoryDraft`). The
   account copy (`tllStoryDraft` in the member JSON) is not touched: it is whatever the last autosave wrote.
2. The 20 s autosave keeps running. Photo clean puts the photo links into the form, so the snapshot differs from the last one,
   and the next tick writes the sent story (now with the links) back to this browser and to the account, as an ordinary draft.
3. On the next visit the steps script fills the form with it, and the gallery layer (`tll-submit-gallery-v1.js`, in the core
   chunk) sees the browser copy and says "Draft restored from your last visit." The sent story looks unsent and invites a
   second send.

What the after block does:

- Once Webflow's done box shows (the story was accepted), the autosave stops for good (`sent` flag, interval cleared). An
  autosave whose account read was already on its way when the box showed does not write.
- This browser's copy is removed again, so the gallery layer has nothing to call "restored". (That is what the existing submit
  handler meant to do; the autosave used to undo it.)
- The account copy is KEPT: one last write saves the form as sent (`tllStoryDraft = {at, fields, sent}`), so the account holds
  the story exactly as it went out, photo links included. If the form were empty at that point, the fields already on the
  account are kept. This write waits for any autosave account write still on its way, so it cannot be overwritten by it.
- On a later visit, an account copy marked sent is not put back into the form. The autosave line says
  "Already sent to the editor. A copy stays in your account." instead, and no "Draft restored" line shows.
- When the writer starts a new story, the first autosave moves the sent copy to `tllStorySent` in the member JSON and writes
  the new draft as `tllStoryDraft`. So the last sent story stays in the account even after a new draft begins.

Why a sent mark rather than deleting: keeping the draft and avoiding a second send pull the same way only if the restore code
can tell a sent copy from an unsent one. The mark does that with one field the restore reads; nothing is lost, the done box
text stays true, and nothing outside this page reads `tllStoryDraft` (checked in the repo: only the page's own scripts, the
gallery layer and the form extras' trip code reader, which reads the browser copy only).

Before (lines 71 to 83 of `footer.before.html`, exact):

```js
var last='';
function autosave(){var o=snap(),s=JSON.stringify(o);if(s===last||Object.keys(o).length===0)return;last=s;
try{localStorage.setItem(KEY,s);}catch(e){}
var ms=window.$memberstackDom;if(ms&&ms.getMemberJSON){ms.getMemberJSON().then(function(r){var j=(r&&r.data)||{};j.tllStoryDraft={at:new Date().toISOString(),fields:o};return ms.updateMemberJSON({json:j});}).catch(function(){});}
var t=new Date();save.textContent='Draft saved '+t.getHours()+':'+('0'+t.getMinutes()).slice(-2)+' · waits on your account';}
try{fill(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(e){}
var ms=window.$memberstackDom;
if(ms&&ms.getMemberJSON){ms.getMemberJSON().then(function(r){var j=(r&&r.data)||{};if(j.tllStoryDraft&&j.tllStoryDraft.fields)fill(j.tllStoryDraft.fields);
var links=j.tllLinks||{};var w=f.querySelector('input[name="credit-website"]');var ig=f.querySelector('input[name="credit-instagram"]');
function pre(el,v){if(el&&v&&!el.value){el.value=v;var l=el.closest('.tll-pen-field');var lab=l&&l.querySelector('.tll-pen-label');if(lab&&!lab.querySelector('.tllst-prefilled')){var s=document.createElement('span');s.className='tllst-prefilled';s.textContent='PREFILLED';lab.appendChild(s);}}}
pre(w,links.website);pre(ig,links.instagram);if((!links.website||!links.instagram)&&ms.getCurrentMember){ms.getCurrentMember().then(function(m){var c=(m&&m.data&&m.data.customFields)||{};pre(w,c.website||c.Website);pre(ig,c.instagram||c.Instagram);}).catch(function(){});}}).catch(function(){});}
setInterval(autosave,20000);
f.addEventListener('submit',function(){try{localStorage.removeItem(KEY);}catch(e){}});
```

After (replaces exactly those lines; lines 73, 75 to 77, 79 to 81 and 83 are unchanged, and five lines are added at the end):

```js
var last='',sent=false,pend=null;
function autosave(){if(sent)return;var o=snap(),s=JSON.stringify(o);if(s===last||Object.keys(o).length===0)return;last=s;
try{localStorage.setItem(KEY,s);}catch(e){}
var ms=window.$memberstackDom;if(ms&&ms.getMemberJSON){pend=ms.getMemberJSON().then(function(r){if(sent)return;var j=(r&&r.data)||{};if(j.tllStoryDraft&&j.tllStoryDraft.sent)j.tllStorySent=j.tllStoryDraft;j.tllStoryDraft={at:new Date().toISOString(),fields:o};return ms.updateMemberJSON({json:j});}).catch(function(){});}
var t=new Date();save.textContent='Draft saved '+t.getHours()+':'+('0'+t.getMinutes()).slice(-2)+' · waits on your account';}
try{fill(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(e){}
var ms=window.$memberstackDom;
if(ms&&ms.getMemberJSON){ms.getMemberJSON().then(function(r){var j=(r&&r.data)||{};var d=j.tllStoryDraft;if(d&&d.sent)save.textContent='Already sent to the editor. A copy stays in your account.';else if(d&&d.fields)fill(d.fields);
var links=j.tllLinks||{};var w=f.querySelector('input[name="credit-website"]');var ig=f.querySelector('input[name="credit-instagram"]');
function pre(el,v){if(el&&v&&!el.value){el.value=v;var l=el.closest('.tll-pen-field');var lab=l&&l.querySelector('.tll-pen-label');if(lab&&!lab.querySelector('.tllst-prefilled')){var s=document.createElement('span');s.className='tllst-prefilled';s.textContent='PREFILLED';lab.appendChild(s);}}}
pre(w,links.website);pre(ig,links.instagram);if((!links.website||!links.instagram)&&ms.getCurrentMember){ms.getCurrentMember().then(function(m){var c=(m&&m.data&&m.data.customFields)||{};pre(w,c.website||c.Website);pre(ig,c.instagram||c.Instagram);}).catch(function(){});}}).catch(function(){});}
var timer=setInterval(autosave,20000);
f.addEventListener('submit',function(){try{localStorage.removeItem(KEY);}catch(e){}});
/* 18 Nov 2026 (Nancy: keep the draft, only stop the autosave). Once Webflow's done box shows: the autosave stops, this browser's copy is removed again (the submit handler above removes it, then the autosave used to write it back), and the account copy is kept, marked sent, after any account write still on its way. A later visit then says it was sent instead of filling the form again; a new draft moves the sent copy to tllStorySent. */
var wrap=f.closest('.w-form')||f.parentNode,done=wrap&&wrap.querySelector('.w-form-done');
function sentNow(){if(sent||!done||getComputedStyle(done).display==='none')return;sent=true;clearInterval(timer);try{localStorage.removeItem(KEY);}catch(e){}
var o=snap(),m=window.$memberstackDom;if(m&&m.getMemberJSON){Promise.resolve(pend).then(function(){return m.getMemberJSON();}).then(function(r){var j=(r&&r.data)||{},d=j.tllStoryDraft,at=new Date().toISOString();j.tllStoryDraft={at:at,fields:Object.keys(o).length?o:((d&&d.fields)||{}),sent:at};return m.updateMemberJSON({json:j});}).catch(function(){});}}
if(done&&window.MutationObserver)new MutationObserver(sentNow).observe(done,{attributes:true,attributeFilter:['style','class']});
```

Rollback: put the before block back in the page custom code and publish. An account copy already marked sent then fills the
form again on the next visit, as today.

Known limits:

- Memberstack's JSON calls are not atomic. The sent write waits for this page's own autosave write; a write from another tab or
  device at the same moment can still land after it.
- A second device that still holds an older browser copy of the story fills the form from that copy (the browser copy is read
  before the account), and the gallery layer says "Draft restored" there; the account copy is still marked sent. Rare: the
  writer would need to have drafted the same story on two devices.
- A writer who is not signed in cannot send (the form asks to sign in first), so the account copy always exists after a send.

## Tests

- `npx vitest run`: 62 files, 743 tests, all pass (18 Nov; 17 Nov: 61 files, 738 tests; before the branch: 59 files, 720
  tests; 3 new test files with 21 tests, 2 tests added and 2 changed in `test/intake-layer.test.js`).
- `node --test worker/test/*.test.js`: 83 pass (unchanged).
- New `src/components/photo-clean/test/photo-clean.test.js` (9): label progress and restore, presses during the uploads do
  nothing, Webflow sees the real label, failure restores, the cached second press sends, and the 22019832 version swallows that
  same press (shown against the live file from git).
- New `test/submit-send-wait.test.js` (7): photo clean and the BUILT submit chunk loaded together on the exported story form,
  in the live order, with stand-ins for Cloudinary (4 s an upload), Webflow (2 s) and the Worker (6 s). One press: three uploads,
  one post, the saved line at once, the done box scrolled into view. Worker failure and no network give the honest line. A story
  ending in an emoji: two presses, one upload pass, one post, the note visible next to Send. Fixing the line removes both notes.
  Signed out: one post, no Worker call. Against the 17 Nov code, 5 of the 7 fail.
- New `test/submit-sent-draft.test.js` (5, 18 Nov): reads the before and after blocks of part C from this file, puts each into
  the steps script from `footer.before.html`, and runs it with photo clean and the BUILT submit chunk on the exported story
  form, Memberstack as a stand-in that keeps the member JSON across visits. Before: the autosave writes the sent story back
  after the done box (browser and account), the interval still runs, and the next visit fills the form and says "Draft
  restored from your last visit." After: no autosave write after the done box (one write only, the sent mark), no interval
  left, no browser copy, the account keeps the story as sent with its photo links; the next visit, in the same browser or a
  new one, leaves the form empty and says "Already sent to the editor. A copy stays in your account."; a new story's first
  autosave keeps the sent copy as `tllStorySent`; an autosave account write already on its way when the done box shows (made
  slow on purpose) lands first and the sent mark after it (without the wait for it, that test fails).
- Changed `test/intake-layer.test.js`: the saved line before the Worker answers, `ok`+`held` keeps it, failures give the new line.
- `test/mini-dom.js`: the stand-in DOM (selectors, capture and bubble, requestSubmit with the "already firing" rule, a manual
  clock). A test helper, not a browser.
- Not run: the Playwright checks `src/components/photo-clean/test/test.mjs` and `submit.mjs` (they need the browser). Run them
  before registering A: `node src/components/photo-clean/test/test.mjs` and `node src/components/photo-clean/test/submit.mjs`.

## New page text (copy rules: US English, no em dashes, no exclamation marks)

- Button: "Sending your photo", "Sending photos 1 of 3" (and so on), "Photos are up. Sending".
- Done box, Worker failure: "Saved. The editor will add it to the draft list by hand."
- Steps autosave line, later visit after a send (part C, page code): "Already sent to the editor. A copy stays in your account."
- Removed: "Sending it to the editor…".

## Not done, on purpose

- No Webflow, publish, registration, Cloudinary, Memberstack or Worker call. No change to `layers-release` or to 16.67.0.
- C is a proposal in this file only.
- The upload size stays `EDGE=3000` in photo clean (Nancy, 18 Nov: photos stay at 3000 px; `refute.md` had suggested 2000).
- The end check is not moved before the uploads, and Send does not jump back to step 1: the note next to Send is the smallest
  visible fix.
- Turnstile (path E) is untouched: webflow.js was not read.
- No real-browser run of any of this yet.
