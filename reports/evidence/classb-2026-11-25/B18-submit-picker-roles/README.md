# B18 /submit: picker links use aria-pressed without a role

Page /submit (6a0d5e5eb7804d3a750dc266), head custom code, script `tll-share-fork-js-v1`. Draft only, not written to Webflow.

**Change.** When the fork script starts, it sets `role="button"` on the two picks (`a[data-tll-fork-pick="write"]` and `="link"`) and
adds a keydown handler: Space on a pick does what a click does (and does not scroll the page). Enter is left alone (it already follows
the link click). class-b.md proposed a Designer custom attribute; this does the same at run time in the script that already sets
aria-pressed on these links, so no Designer change is needed. If the Designer attribute is added later, the script setting it again
does no harm.

**Why.** aria-pressed is a button state; on a plain link screen readers ignore it or announce a link that is "pressed". A role of
button also promises Space works, so the handler comes with it.

**Before.** Screen readers announce two links; Space scrolls the page. **After.** Two toggle buttons, pressed or not; Space picks.

**Size.** 4,349 to 4,961 characters (+612) of 50,000. sha384 in ../hashes.tsv.

**Check on the test site.** VoiceOver and keyboard at 390 and 1440: Tab to "Link to it", Space shows the link form, the write form
hides, the first pick reads "not pressed".

**Rollback.** Write before.html back to the /submit head block and publish.

**Tests.** test/classb-2026-11-25.test.js, "B18".
