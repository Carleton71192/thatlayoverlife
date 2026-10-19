# Change log for approval: Phase A (19 October 2026)

Nothing in this file has been edited or published yet. Each line is one change Nancy can approve, change or strike. Nav, site footer and "Tell the editor" need her sign-off by name (they are in sections A2 and A6). Counts stay bound to tllStates. No publish until she says so.

## What I found first (no edits made)

**A1 newsletter forms.** The home form (`data-h3="news-form"`) and the /stories form are plain `<form method="get">` with one email input and no action. There is no custom submit handler and no fetch to any service: Webflow Forms records the submission and the page shows the inline "You're on the list" state. The /stories copy opens in a new tab with the placeholder `hello@yourdomain.com`. The site footer already watches any `.w-form` with an email input and fires the GA4 event `newsletter_signup` when the done state appears, consent gated, so no new event code is needed. Zero submissions on all three means nobody has signed up through them, not that submissions are lost. I have not sent a test submission (rule: never submit forms on live sites); I will send one from a test address only if Nancy approves line A1.5.

**A2 "Tell the editor".** The script `tll-fbk-place-v1.js` already hides the button while the cookie banner (`html.show--consent`, `html.show--preferences`) is open and collapses it to a 48px circle on phones. What is missing is the fixed position, the safe-area offsets and a z-index rule, so the button sits in normal flow at the end of the page and clips off the left edge.

**A4 assets.** Every asset URL on the site uses the path `6a0b29c6d081332e921900d8`, including Nancy's and Jay's avatars uploaded this week. That path is this site's own asset storage, not a second site, so there is nothing to move. Line A4.3 is struck.

**A6 /for-affiliates.** The link appears once per page, in the site footer component, so the change is one footer edit plus the redirect.

## A1 Newsletter capture

| # | Change | Where | Needs |
|---|---|---|---|
| A1.1 | Connect the home and /newsletter forms to a Mailchimp audience through a Cloudflare Worker (already approved for profiles): the form posts to the Worker, the Worker calls Mailchimp with status `pending`, Mailchimp sends the double opt-in email. No API key in the page. | Home form, /newsletter form, Worker | Nancy: confirm Mailchimp, create the audience, give the Worker the API key and audience id as secrets |
| A1.2 | Consent line under each form: a required checkbox "Yes, send me the letter. Unsubscribe any time." with a link to /privacy. Nothing is sent without the tick. | Both forms | Approval of the wording |
| A1.3 | Success copy "Check your inbox to confirm. The letter lands when a story earns it." Error copy "That did not go through. Try again, or write to hello@thatlayover.life." | Both forms | Approval of the wording |
| A1.4 | Remove the old /stories form (placeholder address, opens a new tab) and replace it with the same form as /newsletter. | /stories | Approval |
| A1.5 | One test submission from a test address after A1.1 is live, then report whether it lands in Webflow Forms, in Mailchimp and in GA4. | Live forms | Approval to send one test |
| A1.6 | Keep `newsletter_signup` firing from the existing footer watcher (no new code). | Footer | None |

## A2 "Tell the editor" widget

| # | Change | Where | Needs |
|---|---|---|---|
| A2.1 | Add to `tll-fbk-place-v1.js`: `position:fixed; left:max(16px,env(safe-area-inset-left)); bottom:max(16px,env(safe-area-inset-bottom)); z-index:900`. Cookie banner and modals stay above (they use 9999). | Site script | Nancy sign-off (Tell the editor rule) |
| A2.2 | Phone: keep the 48px circle, expand to the full pill on tap or focus, collapse on blur or Escape. | Site script | Same sign-off |
| A2.3 | Focus state: 3px Rose outline, 2px offset, matching the search button. `aria-expanded` on the pill. | Site script | Same sign-off |

## A3 Mobile floors

| # | Change | Where | Needs |
|---|---|---|---|
| A3.1 | Site-wide rule at 767px and below: mono eyebrows and card meta 12px minimum (today 10 to 11px, 47 instances on home). Letter spacing stays. | Site head CSS | Approval |
| A3.2 | Minimum 44px tap height on footer links, search chips and "Share your story". Padding, not font size. | Site head CSS, footer | Footer part needs Nancy sign-off |
| A3.3 | Re-measure at 390px after the change and report before and after counts with screenshots. | Report | None |

## A4 Images

| # | Change | Where | Needs |
|---|---|---|---|
| A4.1 | Write alt text for the 66 home images missing it, from what each photo shows. `alt=""` only where the same photo already has a described copy. I will list the 66 with proposed text before saving. | Home | Approval of the list |
| A4.2 | Hero (Curaçao, 1919px, eager): turn on Webflow responsive images for it and add `fetchpriority="high"` with a 1200px variant for phones. | Home | Approval |
| A4.3 | Struck: the `6a0b29c6d081332e921900d8` path is this site's own asset library. Nothing to move. | | |

## A5 Copy contradictions

Stories post live and Nancy checks them (her 19 October decision). Lines that still promise a review before publishing, with a replacement to pick:

| # | Today | Option 1 | Option 2 |
|---|---|---|---|
| A5.1 Home Chapter 02 | "We edit lightly... review it within 48 hours" | "Your story goes live the moment you send it. Nancy reads every one, and writes if something needs a word." | "No queue. It publishes when you press send, and the editor reads it that morning." |
| A5.2 Meta description | "Edited and published by an actual human" | "Travel stories by the people who actually went, read by an actual human." | "First-hand travel stories, published by the people who went." |
| A5.3 Title and og:title | "by people who actually went" vs "by the people who actually went" | Use "by the people who actually went" in both | Use "by people who actually went" in both |
| A5.4 /stories, /submit, /account WRITTEN card, FAQ | "A human reviews every submission within 48 hours" | Remove the line (packet 1.4, approved) | |
| A5.5 Hidden states | Search and newsletter success and error text sits in the HTML for crawlers | Add `aria-hidden="true"` and `hidden` to `.w-form-done` and `.w-form-fail` until Webflow shows them (one site-level script) | |

## A6 /for-affiliates to /creators

| # | Change | Where | Needs |
|---|---|---|---|
| A6.1 | Duplicate /for-affiliates as /creators with the same content, title "For creators". | Pages | Approval |
| A6.2 | 301 /for-affiliates to /creators. | Site settings, Redirects | Nancy's click (the API cannot write redirects) |
| A6.3 | Footer link "For affiliates" becomes "For creators" and points to /creators. | Site footer component | Nancy sign-off (footer rule) |

## Phase B (after Claude Design approval)

Not in this log. Hero simplification, the merged travel dashboard chapter with a logged-out demo, the expat chapter, the Paw Passport Ko-fi line with `kofi_click`, the mixed byline story rail, and any nav or footer change each get their own change log when the frames are approved.

## How to answer

Reply with the line numbers to approve (for example "A1 all, A2 all, A3 all, A4.1 and A4.2, A5.1 option 1, A5.2 option 2, A5.3 option 1, A5.4, A5.5, A6 all") and the Mailchimp confirmation. I will build everything approved as unpublished edits, send the 390px before and after screenshots, and publish only on your word.

## Addendum from the Four-Goal Audit (19 October, evening)

Already covered above: 12px and 44px floors (A3), /creators and the 301 (A6), meta descriptions (A5), newsletter forms (A1). New lines:

| # | Change | Where | Needs |
|---|---|---|---|
| A7.1 | Story Article schema: bind headline, description, image, datePublished, dateModified, author as a Person with the profile URL, and the story's own URL as @id. Today every story serves blanks and one shared @id. | Stories Template JSON-LD | Approval |
| A7.2 | Story links in served HTML: country hub, pursuit and byline profile as real links in the template, not added by script. | Stories Template | Approval |
| A7.3 | Footer links to /copenhagen-stopover and /ees-etias-layover 404 (both drafts). Either publish both after a fact check or unlink them. | Two draft pages, site footer | Nancy: publish or unlink (footer rule) |
| A7.4 | Privacy: remove /visits/nancy-carleton-luxembourg-city-2026 from the sitemap (set the Visits template to no-index), and decide whether the Tokyo 2027 marathon diary stays public before the race. | Visits template, marathon diary | Nancy: decision |
| A7.5 | Country template SEO title gets the brand: "{Country} · That Layover Life" (same for layovers, marathon diaries, Paw Passport, pets). | Five templates | Approval |
| A7.6 | Nine collection templates with no SEO title: add a template title, or exclude the collection from the sitemap where nothing is public (directory, expat groups, resources, press trips, interest tags, trip bundles, pet notes, photo placements, photo submissions). | Nine templates | Approval |
| A7.7 | /the-map for logged-out visitors: hide the "0/5" and "0/11" counters and the empty editor until sign-in. | /the-map | Approval |
| A7.8 | Country hub pages for every country with a story (the hubs exist as CMS items; the footer counts 53 countries and the sitemap lists 6). Publish the rest once each verdict line is written. | Countries collection | Approval; verdict lines to write |

Larger items from the audit, not in this log: the /submit rebuild (rank 4), map card and Layover Wrapped (9, 10), 404 copy, and the map phone layout. Those belong with Claude Design's Phase B frames.
