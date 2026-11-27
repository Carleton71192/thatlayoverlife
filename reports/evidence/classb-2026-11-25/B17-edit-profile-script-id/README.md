# B17 /edit-profile: the same id on a style and a script

Page /edit-profile (6a0df371cd5b09ac504421ae), footer custom code. Draft only, not written to Webflow.

**Change.** `<script id="tll-edit-dir-v1">` becomes `<script id="tll-edit-dir-v1-js">`. The head block keeps
`<style id="tll-edit-dir-v1">` (head-unchanged.html is the live head block, for the test; it is not written).

**Why.** Two elements with one id is invalid HTML and makes `getElementById` return the head style. Nothing reads the script by id
(searched src, tools, test, worker and the core; none).

**Before.** Two elements with id tll-edit-dir-v1. **After.** Each style and script id in the page code is used once. The script body
is unchanged, byte for byte.

**Size.** 10,269 to 10,272 characters (+3) of 50,000. sha384 in ../hashes.tsv.

**Note.** before.html is the live block as is; it carries the live placeholder text of the directory editor unchanged (the same text
is already in the repo's earlier copies of this page code).

**Check on the test site.** Each id is used once on the page and nothing else in the block changes. (The live /edit-profile has had no `[data-tll-edit="dir-app"]` mount point since at least 12 Nov, so the directory editor does not render with or without this change. That is a separate item for Nancy.)

**Rollback.** Write before.html back to the /edit-profile footer block and publish.

**Tests.** test/classb-2026-11-25.test.js, "B17".
