# Story edit build, 21 October 2026 (cloud session)

Nancy approved handoff/CHANGE-LOG-STORY-EDIT-2026-10-21.md as written on 21 October 2026. Everything below is in the repo, unpublished. The Webflow and Worker steps belong to whichever session holds handoff/WEBFLOW-LOCK.md. Nothing was changed in Webflow or deployed by this session.

## What is in the repo

| File | What it does | Log rows |
|---|---|---|
| worker/src/story-edit.js | GET /story?slug=, GET /story/mine, POST /story/update, POST /story/unpublish. Owner check on every call (item Contributor's memberstack-id equals the verified member), the publish rules applied to edits, only the writer's fields written and only when changed, the member-edit entry appended to editor-notes-log, last-updated set, single-item publish, 20 saves per member per hour, held stories saved on the item without publish, take down as unpublish plus draft, never delete. | E3, E4, E5.2 |
| worker/src/index.js | Routes wired (two POST entries, two GET branches). No other change. | E3 |
| worker/test/story-edit.test.js | 23 tests: ownership, each rule, the untouched fields, the log entry, held, put back, 207 on a failed publish, 429, take down, nothing logged. `cd worker && node --test test/*.test.js` passes 63 of 63. | E3, E4 |
| worker/README.md | The four routes documented. | |
| src/pages/submit/v2/submit-v2.js | Edit mode: /submit?edit={slug} loads the live story through GET /story once the member is signed in, fills every field, keeps rights and charter ticked and disabled when charter-agreed-at is on file, step 3 button reads "Save changes", saves through POST /story/update, done panel shows the Worker's message. Draft key per slug (tll_submit_edit_{slug}); an unfinished edit comes back only when the live item has not changed since it was saved, and is cleared on save. The body HTML is sent back unchanged when the writer did not touch the text, so the editor's markup survives an edit of the headline alone. | E2 |
| src/pages/submit/v2/submit-v2.css | One rule for the "Edit "{headline}"" banner. | E6 |
| src/pages/account/tll-acct-stories-v2.js | Replaces tllacctstoriesv1. Reads GET /story/mine with the member token and renders each story with Edit · Take down, "With the editor · Edit" for a held story, and "Taken down · Put it back" for a draft. Take down asks once with the E6 copy. Without a Worker address, or when the Worker cannot be reached, it does what v1 did (cards read from /stories, no actions). | E1.1, E4, E6 |
| src/pages/story/v3/embed-st3-owner-edit-v1.html | One embed for the Stories Template: "Edit this story" under the author row for the owner only, and the JSON-LD dateModified set from Last updated when it is later than the published date. | E1.2, E3.6 |

## For the session that holds the lock

1. Worker: `cd worker && npx wrangler deploy` after the secrets are set (ANTHROPIC_API_KEY, MEMBERSTACK_SECRET_KEY, WEBFLOW_API_TOKEN; RESEND_KEY and MAIL_FROM optional). The Memberstack verify-token endpoint path still carries the pre-deploy check comment in worker/src/index.js.
2. /submit: the v2 hosted script is pinned to a commit on jsDelivr; move the pin to the commit that carries the edit mode, and keep data-worker set to the Worker address.
3. /account: register src/pages/account/tll-acct-stories-v2.js as the hosted script in place of tllacctstoriesv1, and give the page the Worker address once: `<div data-tll-worker="https://tll-worker.<subdomain>.workers.dev" hidden></div>` in the page body, or `window.TLL_WORKER` in the head. Without it the tab keeps the v1 behavior.
4. Stories Template: add the embed from src/pages/story/v3/embed-st3-owner-edit-v1.html at the end of the body, and in the Designer bind three attributes on the author row element [data-st3-author]: data-st3-owner-ms to Contributor > Memberstack ID, data-st3-story-slug to Slug, data-st3-updated to Last updated. Attribute bindings to a reference field's fields need the Designer click (the Data API cannot bind them, same as the author link).
5. Receipts "Updated" row (E3.6): a text element bound to Last updated with conditional visibility "Show edited date is on" and "Last updated is set". Designer, not API.
6. Publish to both custom domains and the subdomain, log the row, and send Nancy the three checks: edit a headline on a test story and watch it republish; take it down and put it back; try the edit link on someone else's story (403, link never shows).

## Choices made while building, inside the approved log

- GET /story/mine was added so the /account tab can show taken-down stories, which the /stories page no longer lists. It is read-only and returns only the member's own items.
- A held story is any item whose status option is not Published. If a separate In Review option id is wanted, the check is one line in stateOf() in worker/src/story-edit.js.
- A story published before photo-originals existed has no hero record to send back; the form asks for the hero photo again before saving. Today that is only the two editor-made stories, which cannot be edited until their profiles carry a Memberstack id (E7).
- The edit sends the body back as HTML unchanged when the writer did not touch the text. When the text was edited, it is rebuilt as paragraphs from the textarea, like a new story, so any links the editor added inside the body are flattened to text. Flagged for the morning review through the member-edit entry's fields list.
