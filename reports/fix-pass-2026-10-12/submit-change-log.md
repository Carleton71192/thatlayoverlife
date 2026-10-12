# /submit: write first, sign up at the end (change log for approval)

Page /submit (6a0d5e5eb7804d3a750dc266). Nothing below is applied yet. Already done today (unpublished): "shelf" and "ledger" copy out, "Link to it" renamed "Link a story you already published", "Pre-launch" off /signup.

Goal from the fix-pass prompt: a first story in 7 or fewer required inputs, at desktop and 375 px. Today a new visitor meets a sign-in wall, then 10 required inputs (15 with email sign-up).

## The new flow

| Step | What the writer sees | Required |
|---|---|---|
| Choice | Two equal cards: "Write it here" and "Link a story you already published" (the fork exists today, only behind the wall) | pick one |
| 1. Place and date | Country, When did you travel | Country |
| 2. Headline, story, photo | Headline, Your story, one hero photo | Headline, Story, Photo |
| 3. Byline and consent | How to credit you (Named by default), the sponsorship box (stays visible, disclosure must not hide), "These are my words and my photos" | Consent |
| Sign in to send | "Continue with Google" first, then email | Google: 1 click; email: name, email, password, 16+ |
| More options (collapsed) | City, excerpt, region, reading time, lenses, sensory anchors, pets and pet notes, other perspectives, shout-outs (rel="sponsored" stays), pull quote, reader question, sign-off, hashtags, website, Instagram, syndication, dates, Lounge photo, gallery | none |

Required inputs: Country, Headline, Story, Photo, Consent = 5. With Google sign-in that is 5 + 1 click; with email sign-up, 5 + 4.

## Changes, in order

| # | Change | Where | How | What could break |
|---|---|---|---|---|
| 1 | Show the form to logged-out visitors; the anonymous wall moves to the end of step 3 as "Sign in to send" | Memberstack blocks 410fe31c…7d40 (members), …7d51 (anonymous), hero pair 6e7c71bb… | **You in the Designer** (data-ms-* blocks are yours to move); I prepare everything else first | Bots see the form: Turnstile stays on. Draft text survives the sign-in trip through the existing autosave (tllStoryDraft). |
| 2 | Photo after sign-in, if the sign-in reloads the page | step 2 / sign-in | Check whether the Memberstack Google popup reloads; if it does, the photo field moves to after sign-in | A file input cannot survive a reload |
| 3 | Re-tag the fieldsets into the three steps above, everything else into one "More options" fieldset | data-tll-step attributes, move_element | API | tll-form-steps-js-v2 needs at least step 1 and step 3 present |
| 4 | Required off: excerpt, region, reader question, sign-off, hashtags | the five inputs | Designer (the API cannot write "required") | Region empty until computed (row 5) |
| 5 | Compute region from country and reading time from word count (230 wpm) | tll-form-steps-js-v2 (existing script) | API, page footer code | The /stories place chips read Region |
| 6 | Step names "Place and date", "Headline, story, photo", "Byline and consent" | LABELS/NEXT in tll-form-steps-js-v2 | API | none |
| 7 | "About 10 fields total…" → "Five things are required, the rest is optional. Reviewed by a human, usually within 48 hours. Phone photos welcome." | String aa7e912f… | API, only after row 4 | Wrong if changed before the required flags |
| 8 | Delete hidden junk fields "Field 4", "Field 3", "Checkbox 2" | bc7df393…, da364d82…, e951626e… | Designer | none |
| 9 | Keep the form name "Html Form" | form settings | no change | Renaming splits submission history |

## Questions for you
1. Approve the flow and rows 1 to 9?
2. Do the sign-up inputs count toward "7 or fewer"? With Google they fit (5 + 1 click). The email path is 5 + 4 (name, email, password, the 16+ box), and the 16+ box has to stay. If it must fit too, the only lever is asking for the first name later in /account (5 + 3 = 8 is still over), so my recommendation is to count the story inputs only and lead with Google.
