# Jay tests the story edit feature with the escalator photo (21 October 2026)

Nancy, 21 Oct: "Let's have Jay test the edit feature with photo resubmission." Jay's story is "Even Brave Boys Get Scared" (item 6ad5f38d4953abc4ee484636, slug even-brave-boys-get-scared). His Contributors item carries his Memberstack id, so the owner check passes. Two things from the old form shape the test: the item has no photo records (the hero was added by hand), so the edit form asks for the hero photo again before it saves; and charter-agreed-at is empty, so the rights and charter boxes are asked once more. Both are expected.

## Before Jay can start, in this order

### A. Nancy, in a terminal on the Mac, from the repo folder `worker/`

```
npx wrangler login
npx wrangler kv namespace create TLL_KV
```
Paste the id it prints into worker/wrangler.toml in place of `<fill after wrangler kv namespace create TLL_KV>`. Then the three secrets, each prompts for the value:
```
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put MEMBERSTACK_SECRET_KEY
npx wrangler secret put WEBFLOW_API_TOKEN
npx wrangler deploy
```
Copy the address wrangler prints (https://tll-worker.<subdomain>.workers.dev). Check: open that address with /health on the end; it answers `{"ok":true,"service":"tll-worker"}`.

### B. The session that holds the Webflow lock (handoff/packet-d/BUILD-STORY-EDIT-2026-10-21.md, steps 2 to 6)

1. /submit: the v2 markup embed (src/pages/submit/v2/submit-v2.html) with data-worker set to the address from A, the v2 styles, and the hosted script pinned to commit 965428b or later (the edit mode is in from 1fb1656).
2. /account: hosted script src/pages/account/tll-acct-stories-v2.js in place of tllacctstoriesv1, plus `<div data-tll-worker="https://tll-worker.<subdomain>.workers.dev" hidden></div>` in the page body.
3. Stories Template: the embed src/pages/story/v3/embed-st3-owner-edit-v1.html at the end of the body, and the three attributes on the author row: data-st3-owner-ms (Contributor > Memberstack ID), data-st3-story-slug (Slug), data-st3-updated (Last updated).
4. Publish to both custom domains and the subdomain. Tell Nancy "go".

### C. Nancy sends Jay the script below

## For Jay (ready to paste into WhatsApp)

Testing the edit feature. Sign in first. Please screenshot anything that does not match.

1. Open thatlayover.life/account and the Stories tab. Expected: your story with "Edit · Take down" under it.
2. Tap Edit. Expected: the submit form with "Edit "Even Brave Boys Get Scared"" at the top and every field filled from the live story. The hero photo box says "Add the hero photo again to save." That is expected: the old form never saved the photo files.
3. Step 1: upload the Clark Kent photo as the hero again, and add the escalator photo to the gallery. Set City to São Paulo (with the tilde). Leave the text as it is, or fix anything you like.
4. Step 2: tap "Ask for notes" once. Expected: suggestions one at a time with Accept or Skip, nothing changes unless you accept.
5. Step 3: tick the two boxes again (the old form did not record them), answer the affiliate question No, then "Save changes". Expected: "Saved. The story is live again with your changes."
6. Open the story. Expected: the hero, the escalator photo in the gallery, "1 MIN" in the hero (not "1 MIN MIN"), and "Edit this story" under the author row. Open the same page in a private window: no edit link.
7. Back on /account, tap "Take down" and confirm. Expected: the row reads "Taken down · Put it back", and the story address stops working within a minute.
8. Tap "Put it back", then "Save changes". Expected: the story is live again at the same address.
9. Tell us how long each save took, and anything that read wrong.

## What the logs will show afterwards

The item's editor-notes-log gains one member-edit entry per save (fields changed, word counts before and after, every Accept or Skip), one member-takedown entry, and a restored flag on the save that put it back. last-updated is set. The slug, published date and contributor do not change. The morning review lists the edit.
