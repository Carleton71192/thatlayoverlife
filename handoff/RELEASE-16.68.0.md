# Release 16.68.0 + photo clean 1.2.0 + /submit page code: the send wait

Nancy in chat on 18 Nov: "Keep going with your recommendations" (keep the draft and only stop the autosave; failure line "Saved. The editor will add it to the draft list by hand."; photos stay 3000 px). Test site first; www and the apex only after the checks and her yes.

## Why
A contributor pressed Send several times on 17 Nov (one entry arrived, no duplicates). Photos upload when the form is sent (about 15 s for three) while the button only fades, then the done box shows "Sending it to the editor…" for about 6 s more. Evidence: reports/evidence/submit-save-2026-11-17/ (trace, submissions, refute, fix, check, check-final, webflow-plan).

## Parts
- A. Photo clean 1.2.0 (tllphotocleanv11, pin f67f3f74d9a5b4c20ec282ac4935ebe2831be667, SRI sha384-b9+lDanshflZ9KVhLlM/GTjhrqKXDFpVs+iXXE5NYL7BLq1hiKvHH6v7kWFDo/rP) on /submit and /my-pets: the button says "Sending photos 1 of 3" and so on; the follow-on send can no longer be swallowed.
- B. Core 16.68.0 (layers-release pin 0f04fabf403d5c61d1e1f4ff8d850c493a9de62f, SRI sha384-a9tcQUfkTLuUzZ1IXfw7dVcXSKJnilK7aqF6p5HiS5d80ghZvRrQ6Akt8Ewg/2st; only the submit, submit-preview and share-photos chunks and their integrity lines change): "Saved. It is with the editor." at once; an honest failure line; done box into view; the end-of-story note next to Send.
- C. /submit footer custom code (tll-form-steps-js-v2): the autosave stops once the done box shows; the account copy is kept and marked sent; a later visit does not refill the sent story.

## Lab results (check-final.md, 42 runs)
Button faded without a label: 12.5 to 16.8 s live, 0 s new. "Saved" line 6 s sooner. Swallowed presses 2 live, 0 new. One form post and no extra upload in every run.

## Known notes
- The "Already sent to the editor" line rarely shows, because Memberstack loads after the steps script; the sent story is still not refilled.
- A blank visit after a send can lead to "Draft restored" over an empty form on the visit after (live does the same on blank visits).
- /share-photos uses its own uploader (unchanged): its button still fades about 4 s per photo.
- Test-site sends are real: do not send test stories on the test site except a deliberate one by Nancy.

## Webflow (test site)
Scope c1d5fba. Writes and read-backs 09:32 to 09:34 UTC; published the test site only (publishTaskId 39d1066c-7f02-4d6e-a7ed-0aea17f6b2cf). Checks: running.

## Rollback (each alone, then publish)
- A: set_page_scripts on /submit and /my-pets with reports/evidence/submit-save-2026-11-17/webflow-page-scripts.before.json (photo clean 1.1.0). Never delete the registered script.
- B: set_site_scripts with src/site/live-2026-11-18/r1668/site-scripts.before.json (16.67.0, pin a254306f).
- C: set_page_freeform_code on the /submit footer with reports/evidence/submit-save-2026-11-17/webflow-c-before.html.
