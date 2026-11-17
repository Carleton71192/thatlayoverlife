# /submit send wait: the fix (17 Nov 2026)

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
  "Saved. It reached the editor by form. The copy to the draft list did not go through, so the editor will add it by hand."
  Before, success and failure printed the same line. Success is now `r.ok` and (`saved` or `ok`), which matches what the live
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

## C. Page code: stop the autosave and clear the draft once the done box shows (proposal only, NOT applied)

Where: the inline three-step script `tll-form-steps-js-v2` in the /submit page custom code (Before `</body>`). Repo copy:
`src/pages/submit/live-2026-11-11/followups/footer.before.html` lines 71 to 83. Changing it is a Webflow page custom code write
and a publish, to be done later. Nothing in the repo or on the site was changed for C.

What it does: once Webflow's done box shows (the story was accepted), the 20 s autosave stops, the local draft
(`localStorage.tllStoryDraft`) is removed, and the account copy (`tllStoryDraft` in the member JSON) is removed. An autosave
whose account write was already on its way when the box showed does not write (it checks the same flag). Why: today the
autosave keeps running after the send and writes the sent story (now with the photo links) back to this browser and the
account, so the next visit fills the form again and says "Draft restored from your last visit"; a writer who thinks the first
send failed may send it again.

Checked in a scratch run (not committed) on the exported story form in the stand-in DOM: with the current block, 60 s after the
done box the draft is back in this browser and still on the account, and the interval still runs; with the proposed block both
are gone and no interval is left. The before text below matches the repo file byte for byte.

Before (lines 71 to 83, exact):

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

After (replaces exactly those lines; lines 76 to 81 are unchanged):

```js
var last='',sent=false;
function autosave(){if(sent)return;var o=snap(),s=JSON.stringify(o);if(s===last||Object.keys(o).length===0)return;last=s;
try{localStorage.setItem(KEY,s);}catch(e){}
var ms=window.$memberstackDom;if(ms&&ms.getMemberJSON){ms.getMemberJSON().then(function(r){if(sent)return;var j=(r&&r.data)||{};j.tllStoryDraft={at:new Date().toISOString(),fields:o};return ms.updateMemberJSON({json:j});}).catch(function(){});}
var t=new Date();save.textContent='Draft saved '+t.getHours()+':'+('0'+t.getMinutes()).slice(-2)+' · waits on your account';}
try{fill(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(e){}
var ms=window.$memberstackDom;
if(ms&&ms.getMemberJSON){ms.getMemberJSON().then(function(r){var j=(r&&r.data)||{};if(j.tllStoryDraft&&j.tllStoryDraft.fields)fill(j.tllStoryDraft.fields);
var links=j.tllLinks||{};var w=f.querySelector('input[name="credit-website"]');var ig=f.querySelector('input[name="credit-instagram"]');
function pre(el,v){if(el&&v&&!el.value){el.value=v;var l=el.closest('.tll-pen-field');var lab=l&&l.querySelector('.tll-pen-label');if(lab&&!lab.querySelector('.tllst-prefilled')){var s=document.createElement('span');s.className='tllst-prefilled';s.textContent='PREFILLED';lab.appendChild(s);}}}
pre(w,links.website);pre(ig,links.instagram);if((!links.website||!links.instagram)&&ms.getCurrentMember){ms.getCurrentMember().then(function(m){var c=(m&&m.data&&m.data.customFields)||{};pre(w,c.website||c.Website);pre(ig,c.instagram||c.Instagram);}).catch(function(){});}}).catch(function(){});}
var timer=setInterval(autosave,20000);
f.addEventListener('submit',function(){try{localStorage.removeItem(KEY);}catch(e){}});
/* 17 Nov 2026: once Webflow has accepted the story (its done box shows), stop the autosave and clear the saved draft in this browser and on the account, so the next visit does not bring the sent story back as a draft. */
var wrap=f.closest('.w-form')||f.parentNode,done=wrap&&wrap.querySelector('.w-form-done');
function sentNow(){if(sent||!done||getComputedStyle(done).display==='none')return;sent=true;clearInterval(timer);try{localStorage.removeItem(KEY);}catch(e){}
if(ms&&ms.getMemberJSON){ms.getMemberJSON().then(function(r){var j=(r&&r.data)||{};if(!j.tllStoryDraft)return;delete j.tllStoryDraft;return ms.updateMemberJSON({json:j});}).catch(function(){});}}
if(done&&window.MutationObserver)new MutationObserver(sentNow).observe(done,{attributes:true,attributeFilter:['style','class']});
```

Rollback: put the before block back in the page custom code and publish.

Known limit: Memberstack's two JSON calls are not atomic. If an autosave's account write is already sent when the box shows, it
can land after the clear; the window is one autosave call in a 20 s cycle. The local copy is always cleared.

## Tests

- `npx vitest run`: 61 files, 738 tests, all pass (before: 59 files, 720 tests; 2 new test files with 16 tests, 2 tests added
  and 2 changed in `test/intake-layer.test.js`).
- `node --test worker/test/*.test.js`: 83 pass (unchanged).
- New `src/components/photo-clean/test/photo-clean.test.js` (9): label progress and restore, presses during the uploads do
  nothing, Webflow sees the real label, failure restores, the cached second press sends, and the 22019832 version swallows that
  same press (shown against the live file from git).
- New `test/submit-send-wait.test.js` (7): photo clean and the BUILT submit chunk loaded together on the exported story form,
  in the live order, with stand-ins for Cloudinary (4 s an upload), Webflow (2 s) and the Worker (6 s). One press: three uploads,
  one post, the saved line at once, the done box scrolled into view. Worker failure and no network give the honest line. A story
  ending in an emoji: two presses, one upload pass, one post, the note visible next to Send. Fixing the line removes both notes.
  Signed out: one post, no Worker call. Against the 17 Nov code, 5 of the 7 fail.
- Changed `test/intake-layer.test.js`: the saved line before the Worker answers, `ok`+`held` keeps it, failures give the new line.
- `test/mini-dom.js`: the stand-in DOM (selectors, capture and bubble, requestSubmit with the "already firing" rule, a manual
  clock). A test helper, not a browser.
- Not run: the Playwright checks `src/components/photo-clean/test/test.mjs` and `submit.mjs` (they need the browser). Run them
  before registering A: `node src/components/photo-clean/test/test.mjs` and `node src/components/photo-clean/test/submit.mjs`.

## New page text (copy rules: US English, no em dashes, no exclamation marks)

- Button: "Sending your photo", "Sending photos 1 of 3" (and so on), "Photos are up. Sending".
- Done box, Worker failure: "Saved. It reached the editor by form. The copy to the draft list did not go through, so the editor
  will add it by hand."
- Removed: "Sending it to the editor…".

## Not done, on purpose

- No Webflow, publish, registration, Cloudinary, Memberstack or Worker call. No change to `layers-release` or to 16.67.0.
- C is a proposal in this file only.
- The upload size (`EDGE=3000` in photo clean; `refute.md` suggests 2000 to roughly halve each upload) is unchanged: it changes
  what the editor receives, so it is a decision for the editor.
- The end check is not moved before the uploads, and Send does not jump back to step 1: the note next to Send is the smallest
  visible fix.
- Turnstile (path E) is untouched: webflow.js was not read.
- No real-browser run of any of this yet.
