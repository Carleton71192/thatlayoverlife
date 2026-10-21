# Change log for approval: members edit their own stories (21 October 2026)

Nancy, 21 Oct: "Users need to be able to edit stories they already posted." Nothing in this log is built. It rides on Packet D (/submit v4, the writer-led flow in worker/ and src/pages/submit/v2/) and the /submit Worker deploy; it adds no Stories field (the collection sits at the 60-field cap). Rules kept: stories post live without review, the editor corrects afterwards under the Charter, AI never writes the headline, excerpt, pull quote or body, Editor's notes one at a time with Accept or Skip, counts never typed, no data-ms-* element touched.

Today: a story is written once on /submit. There is no way for a member to change it afterwards; a correction means writing to Nancy. The /account Stories tab lists the member's stories (script tllacctstoriesv1 reads /stories) with no actions.

## E1 Where editing starts

| # | Change |
|---|---|
| E1.1 | /account, Stories tab: each of the member's own stories gets two links, "Edit" (to /submit?edit={slug}) and "Take down" (E4). Own means the story's Contributor item carries the member's Memberstack id, checked again by the Worker on every write. |
| E1.2 | Story page: the owner, and only the owner, sees "Edit this story" under the author row (script, Memberstack id against the contributor's memberstack-id already in the page as data-st3-slug plus one data attribute for the id). Visitors see nothing new. |

## E2 The edit form (/submit?edit={slug})

| # | Change |
|---|---|
| E2.1 | The same three-step /submit v4 form, loaded with the live story: headline, excerpt, body, pull quote, country, city, month, hero photo and gallery, pets and co-travelers, cost line, who it is for, sign-off, disclosure, tags and pursuit. The Worker returns these for the owner only (GET /story?slug=, Bearer Memberstack token). The text comes from the live item, so an edit always starts from the editor's corrected version, never from an old browser draft. |
| E2.2 | Editor's notes run on the edited text the same way as on a new story: suggestions one at a time, Accept or Skip, nothing changes without Accept, every decision logged. |
| E2.3 | Step 3 reads "Save changes" instead of "Publish". Rights, charter and disclosure stay ticked from the first time and are shown, not asked again, unless the disclosure changed. |
| E2.4 | The draft of an edit lives in localStorage under its own key per slug and is cleared on save, so an unfinished edit never leaks into a new story. |

## E3 Worker route POST /story/update (worker/, next to /publish)

| # | Change |
|---|---|
| E3.1 | Token verified with Memberstack; the item is found by slug and written only when its Contributor's memberstack-id equals the verified member. Otherwise 403. |
| E3.2 | The same rules as publish, applied to the edited text: headline, country, 300 words or more (or a working link for a link-out story), own hero photo, rights and charter already on file. A story that fails the rules is not written; the form shows which rule. |
| E3.3 | Fields a member may change: the E2.1 list. Never changed by an edit: slug (the URL stays), published date, contributor, commissioned, status, the editor's fields (edited-by, sources, notes-to-editor stays as the editor's), the hub references the editor set beyond the chosen country, badge and press fields on the profile. |
| E3.4 | editor-notes-log gains one entry per save: {"type":"member-edit","at":ISO,"fields":[changed field names],"words":{"before":n,"after":n},"notes":[every Accept or Skip from this session]}. last-updated is set to now. show-edited-date is the member's own switch and is left as it is. |
| E3.5 | The item is republished on its own (single item publish), so the change is live within a minute, with no site publish. 20 saves per member per hour, then 429. |
| E3.6 | The story template's Article JSON-LD dateModified reads last-updated when set (today it repeats the published date), and the receipts "Updated" row shows it when the member's show-edited-date switch is on. |

## E4 Take down

| # | Change |
|---|---|
| E4.1 | "Take down" on /account asks once ("Take this story off the site? You can put it back from this tab."), then POST /story/unpublish: the item is unpublished and set to Draft. Nothing is deleted, ever. The slug is kept, so links come back when the story returns. |
| E4.2 | A taken-down story shows "Taken down · Put it back" on /account; "Put it back" opens the edit form and the save republishes it. The sitemap and the counts follow the live item, nothing typed. |

## E5 The editor stays in charge

| # | Change |
|---|---|
| E5.1 | Morning review: every member-edit entry since the last run is listed with the changed fields and word counts, flag only, as the skill already says for new stories. |
| E5.2 | A story the editor has set to In Review (held) cannot be saved live by the member: the form saves the edit as a draft on the item and says "The editor is looking at this one. Your changes are saved and go live when it is released." Release stays the editor's click. |
| E5.3 | Editor corrections are never silently undone: the form loads the live text (E2.1), and the log shows what the member changed afterwards (E3.4). |

## E6 Copy

| Where | Copy |
|---|---|
| /account, story row | Edit · Take down |
| Story page, owner only | Edit this story |
| /submit edit mode, title | Edit "{headline}" |
| /submit edit mode, step 3 button | Save changes |
| After save | Saved. The story is live again with your changes. |
| Rule failed | Not saved yet: {rule}. Fix it and save again. |
| Held by the editor | The editor is looking at this one. Your changes are saved and go live when it is released. |
| Take down, confirm | Take this story off the site? You can put it back from this tab. |
| Taken down row | Taken down · Put it back |

## E7 What it depends on

- The /submit Worker deployed with its secrets (ANTHROPIC_API_KEY, MEMBERSTACK_SECRET_KEY, WEBFLOW_API_TOKEN) and /submit v4 on the page (Packet D). Until then nothing here can run.
- Barzy's and Chesney's stories: their Contributors items have no memberstack-id yet, so they can edit only after they sign up and the editor links the item (one field on the profile). Nothing automatic.

## Open for you

1. Edit window: no limit (recommended, the log keeps the history), or a fixed window such as 30 days after publish.
2. Take down as unpublish to draft (recommended, never delete), or no take-down at all.
3. After an edit that follows an editor correction: flag only in the morning review (recommended), or hold the story until the editor looks.
4. "Updated {date}" on the story: only when the member's show-edited-date switch is on (recommended, it is their switch today), or always after a member edit.
5. Where "Edit" lives: /account and the story page (recommended), or /account only.

Reply with the line numbers to approve or change. Build starts on approval, as unpublished edits in the repo, with the Webflow and Worker parts applied by whichever session holds the lock in handoff/WEBFLOW-LOCK.md.
