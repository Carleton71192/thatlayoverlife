# B02 /submit: text typed in the last 20 s is lost

Page /submit (6a0d5e5eb7804d3a750dc266), footer custom code, script `tll-form-steps-js-v2`. Draft only, not written to Webflow.

**Change.** After `var timer=setInterval(autosave,20000);` the draft adds `local()`: this browser's copy (localStorage `tllStoryDraft`)
is saved 1 s after typing stops, when the tab is hidden and when the page is left (pagehide). The account copy stays on the 20 s autosave.

**Why.** The only save is the 20 s timer, so a reload, a closed tab or a phone killing the tab loses up to 20 s of typing.

**Rules kept from the live script.** `local()` writes only when the writer typed in name, excerpt, body or country (the 21 Nov rule),
never after the done box shows (`sent`), and leaves `last` alone, so the next autosave still sends the change to the account. One rule
added: after Send, leaving the page does not write the copy back (the live submit handler removes it) until the writer types again,
which covers a failed send. This differs from the class-b.md text, which wrote on any non-empty snapshot and after Send.

**Before.** Type, reload within 20 s: the text is gone. **After.** Type, wait 1 s (or switch tabs, or leave), reload: the form fills
from this browser's copy (the live load code fills only empty fields).

**Size.** 11,129 to 12,120 characters (+991) of 50,000. sha384 in ../hashes.tsv.

**Same block as B15.** To apply both, write ../submit-footer-B02-B15/after.html (12,455 characters).

**Check on the test site.** Type, reload after 5 s, the fields come back; send, then leave, and nothing is written back; send with the
network off (fail box), type, and the copy comes back.

**Known gap (same as the live 20 s autosave).** If a writer types and then clears every own field, the last copy stays in this browser and fills the form on the next visit. The live autosave behaves the same way.

**Rollback.** Write before.html back to the /submit footer block and publish.

**Tests.** test/classb-2026-11-25.test.js, "B02".
