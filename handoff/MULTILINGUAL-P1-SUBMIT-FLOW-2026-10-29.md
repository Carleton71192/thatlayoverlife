# Multilingual Phase 1, Step 0b: where /submit stories land today (29 Oct 2026, read only)

## 1. The live form
Page /submit (6a0d5e5eb7804d3a750dc266). Two Webflow-native forms, no custom action, so every send lands in **Webflow Forms** (site form submissions) and nowhere else:

- **"Story submission"**: element 410fe31c-0208-fa02-297c-3b2122ab7d37, id wf-form-Story-submission, data-tll-form="submit-story", data-ms-member-bound="true", method get, multipart. Split into 3 steps on the page by the footer script tll-form-steps-js-v2 (fieldsets tagged data-tll-step 1/2/3).
  - Text inputs: country (required), city, trip-when, Field 4 (required, label unknown in the API), Field 3 (required, label unknown), name (required, the headline), reading-time, sensory-anchors, pets-along, reader-question, sign-off, hashtag-set, affiliation, disclosure-line, credit-website, credit-instagram, hero-image (file, required), photo-gallery (file, multiple).
  - Textareas: excerpt (required), body (required, plain text: no headings), pull-quote.
  - Select: region (required).
  - Checkboxes: theme-salty-air, theme-wild-routes, theme-alpine-escape, theme-desert-glow, theme-sunset-mode, syndication-newsletter, syndication-social, syndication-press, show-posted-date, show-traveled-date, show-edited-date, "Checkbox 2" (unnamed), agree-charter (required).
  - Radios: credit-mode (3).
  - **No language field exists.** No translation consent exists.
- **"Link-out story"**: element 51b9abee-68eb-6095-9a21-24484793e255: external-url, field-5 (title), country, summary, gated (+ og-image, og-site, og-image-size hidden fields added by tll-linkout-preview-v1 on 29 Oct).

Photos: uploaded to Cloudinary (idonvlow, folders tll/hero-image, tll/photo-gallery) by a page script before the form posts; the form carries the links.

## 2. What turns a submission into a Stories item
- **Not a Webflow webhook**: list_webhooks for the site returns none.
- **Not the Worker**: neither tll-travel-wire (src/index.js) nor tll-worker (worker/, Packet D) receives the live form. tll-worker has POST /notes (the 19 Oct grammar rules: "Point out, never replace", spelling, punctuation, capitalization, paragraph breaks, sentence order only), POST /publish and /story/update, but STATUS S111 says "Built, not deployed", and the live form never calls it.
- **Not a cloud scheduled task**: none of the account's listed scheduled tasks (Morning brief, reader notes check, social agent, etc.) imports form submissions. (Scheduled tasks stored locally by the Cowork desktop app are not listed; a local one cannot be ruled out.)
- **Evidence it is a Claude session working by hand**: Luke's draft (Stories 6ae32279cd599f9d975a5282) was created at 10:39:53 UTC, 5 minutes after his send (10:35:04), with notes-to-editor in an editor's voice ("Imported from form submission 6ae32158ea65c6a8b7fa856c", kit gaps, typos list). No code in the repo writes that note. Today's link-out stories were created by hand in this session. **Conclusion: there is no automated importer today.** Stories reach the CMS when a person or a Claude session copies the submission into a Stories draft.

## 3. Auto-post-live and Nancy's review flag
- Policy (CHANGE-LOG-PHASE-A-2026-10-19, A5): "Stories post live and Nancy checks them." The code that would do it (tll-worker POST /publish: rules check, then publish, then email) is not deployed.
- In practice today: nothing posts automatically from /submit. Nancy is notified by **Webflow's form notification email** (no-reply-forms@webflow.com, "You received a new form submission"), which she forwards. There is no flag field and no scheduled check for story submissions (there is one for reader notes only).
- So the Phase 1 "add a line to Nancy's review flag" has no flag to add to yet. Options: add the line to the importer's notes-to-editor when one exists, or to the Worker /publish email when it deploys.

## 4. Story template hooks (Stories Template, tree 2026-10-26)
- Title: Heading.tll-display-xl.tll-text-bone.tll-story-title (#7f1dd53e), in Section.tll-story-hero.
- Excerpt: Paragraph.tll-lede.tll-text-bone.tll-story-excerpt (#7f1dd540). A second lede, Paragraph.st3-lede [data-st3-lede] (#3804a0fd), sits in the body.
- Body wrapper: Block.tll-reading-column.tll-story-body (#7f1dd579) inside Section.tll-story-body-section. The story text is RichText.tll-body (#e5ae70d4), a direct child. Other RichText.tll-body blocks in the wrapper: short version (#c690dd05, inside .tll-aeo-box-teal), quick answers (#bb3ee217), links and mentions (#950066cb). Pull quote: Blockquote.tll-story-pullquote (#7f1dd55a).
- Do not translate: author block .st3-author (name, "From {place}"), .st3-from (place links), byline-location eyebrows .tll-story-byline-loc, the sign-off .tll-signoff (rendered later in the page), the commissioned link.
- Card location label (black washi tape): .tll-lib-meta on /stories cards (bound to byline-location, e.g. "TORREVIEJA, SPAIN", flag added by script). Home rails and other card lists were not inspected here.
