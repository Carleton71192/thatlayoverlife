# Change log: a portfolio link under What you make (10 November 2026)

Nancy, 10 Nov: "if they select Makes, there should be a small portfolio box, yes?"

## Today

On /edit-profile, section 07 · The directories, switching Make things on opens one thing: the "What you make" chips (Photos, Video, Words, Sound, Other). There is no portfolio box. A member's only places for a work link are the Website box in their links and the More links list, neither of which sits with Make things.

On their public page, "MAKES PHOTOS · WORDS" shows while Make things is on (script tll-pf5-n-v1 on the Contributors template). Nothing points to the work itself.

## Proposed

**M1. A portfolio box under the chips.** Shown only while Make things is on, under the chips and their note:

- Label: **Portfolio link** · optional
- Box placeholder: yoursite.com/work
- Note under it: "One link to your best work. It shows on your page next to what you make."
- One link only. https is added if they leave it off. Spaces or a non-link are refused with the same message the other link boxes use.

**M2. Where it is saved.** Inside the existing partners value (one JSON field in Memberstack and Contributors), as `portfolio`. No new field: Contributors is at Webflow's 60-field limit. The Worker keeps it (a link of up to 200 characters, https only) and drops anything else, the same way it treats the shop link. The More links editor already merges into the same value, so neither overwrites the other.

**M3. On the public page.** After the MAKES line, a small mono link: **SEE THE WORK →**, opening the portfolio in a new tab. It shows only while Make things is on and a link is saved. Switching Make things off keeps the link saved but hides it, as the chips do now.

## What it touches

- /edit-profile embed 4080e4be (the box) and script part G (save and load). No data-ms-* element.
- Worker src/profile-sync.js: partners keeps `portfolio`. Needs a Worker deploy.
- Contributors template script tll-pf5-n-v1 (the SEE THE WORK link).
- Webflow: one embed, one page script; subdomain first, www on your word.

Not touched: /creators (drafted since 9 Nov), the Directory collection, Memberstack field setup.

## Your call

1. Approve M1 to M3 as written, or change the words (label, note, SEE THE WORK).
2. Should the box ask for the link before they can turn Make things on, or stay optional? Proposed: optional.

## Approved 10 November 2026

Nancy: "Approve M1 to M3 as written, keep it optional".

## Written and on the subdomain (publish f8e9f526, 10 November 2026 about 13:15 UTC)

- M1 and M2 on /edit-profile, M3 on the profile template, read back identical and served identical on https://that-layover-life.webflow.io. www unchanged.
- The refusal message for a bad link is "One link only, with no spaces." (the other link boxes have none to reuse).
- The Worker change is on branch worker/portfolio-on-b305b3b: the code live since 29 October plus this change only. A deploy from the working branch would also ship ten days of other Worker work (work trips, Download everything, stamps, new scheduled jobs), so it is not used. This session's permission check blocked the deploy; Nancy runs it. Until then the link saves to the member's account and shows in the box, but not on the public page.
- Files and tests: src/pages/edit-profile/live-2026-11-10/README.md.
