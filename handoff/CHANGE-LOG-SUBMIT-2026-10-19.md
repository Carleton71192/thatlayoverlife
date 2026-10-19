# Change log for approval: /submit as a writer-led story flow (19 October 2026)

Nothing here is built or published. Each numbered line is one change Nancy can approve, change or strike. Nav and footer are not touched. No publish until she says so.

## 0. What I know before building (read-only)

- /submit today: 75 inputs in 12 sections, two H1s, sign-in wall before the first field, 7 required fields. The Cloudinary unsigned upload (cloud idonvlow, preset tll_photos, script tll_photo_upload_v1) is live and stays.
- Submissions reach the Stories collection through the current import, which once made four copies of one story. The new flow replaces that import with one server call that creates exactly one item.
- **The Stories collection has 60 custom fields, which is Webflow's cap.** Every new field below needs a deletion first (section 2).
- Pillars live in collection 6a0b29c6d081332e921900ff (the story's `pillar-2` reference), themes in 6a0c7e883607a3b091e1ae20 (the story's `theme` multi-reference). Tags and pursuit suggestions pick from these lists only.
- One Cloudflare Worker is already approved for profiles and sign-up. This plan adds routes to the same Worker, so no second service.

## 1. Architecture

| # | Change | Needs |
|---|---|---|
| 1.1 | **Cloudflare Worker, three routes:** `POST /notes` (Editor's notes), `POST /publish` (create and publish one story), `POST /photo` (records the original and cleaned photo URLs). Same Worker as profiles. | Nancy creates the Cloudflare account (free plan is enough) and adds secrets: ANTHROPIC_API_KEY, MEMBERSTACK_SECRET_KEY, WEBFLOW_API_TOKEN |
| 1.2 | **Member check on every route:** the page sends the Memberstack member token; the Worker verifies it with Memberstack's server API before doing anything. No token, no call. | None |
| 1.3 | **Rate limit:** 20 `/notes` calls per member per hour, 10 `/publish` per member per day, counted in Workers KV by member id. Over the limit returns a plain message ("Editor's notes are resting. Try again in an hour."). | None |
| 1.4 | **Data sent to the model:** story body, headline, excerpt, pull quote, country, city, month and year. Nothing else. No name, email, member id or photo. | None |
| 1.5 | **Model:** Claude Sonnet 5.5 (`claude-sonnet-5-5`) for notes. One call per request, max 2,000 output tokens, temperature 0. | Approval |
| 1.6 | **Secrets never in page code.** The page holds only the Worker URL. | None |
| 1.7 | **Privacy page:** add Anthropic to the processor list. Draft wording in section 8. | Nancy approves wording |

## 2. CMS fields (Stories collection, at the 60 cap)

**Delete first (all empty on every story today, never rendered):** `ai-review`, `ai-editor-notes`, `ai-seo-score`, `ai-pull-quote-candidates`, `ai-banned-word-flags`, `ai-suggested-themes`, `view-count`, `reaction-count`, `bookmark-count`, `comment-count`. Ten slots. If the template still binds one, the API refuses the delete and I report it.

**Add (eight):**

| Field | Type | Purpose |
|---|---|---|
| `editor-notes-log` | PlainText | JSON log of every suggestion: type, original, suggested, accepted or skipped, timestamp. Hidden, never rendered. Proves human origin. |
| `city` | PlainText | Writer's "where", city part. Country stays in `country-2`. |
| `for-whom` | PlainText | "Who it's for", one line, for the trip-facts block. |
| `sponsor-name` | PlainText | Sponsored or hosted label at the top of the story. |
| `sponsor-url` | Link | Optional, rendered with `rel="sponsored"`. |
| `charter-agreed-at` | DateTime | When the writer ticked the charter. |
| `syndication` | PlainText | Comma list of what the writer allowed: newsletter, social, press. |
| `photo-originals` | PlainText | JSON: for each photo, the untouched Cloudinary URL, the cleaned URL, and which one the writer approved. |

Existing fields reused: `name` (headline), `excerpt`, `body`, `pull-quote`, `hero-image`, `photo-gallery`, `pet-co-travelers`, `human-co-travelers`, `sign-off`, `links-and-mentions` (shout-outs), `disclosure`, `trip-when`, `cost-summary`, `reading-time`, `theme`, `pillar-2`, `country-2`, `region`, `status`, `published-date`, `submitted-at`, `seo-title`, `seo-description`, `sources` (default "First-hand").

Contributors fields reused: `credit-mode`, `pen-name`, the link fields.

## 3. The form

One H1: "Write your trip." Three steps as a vertical stepper on phones, 390px first. Every input has a connected `<label>`, 44px targets, 12px minimum text. Visible to everyone, signed in or not.

| # | Step 1, The trip (required) | Field |
|---|---|---|
| 3.1 | Where: country (search over the Places Been list), city (text) | `country-2`, `city` |
| 3.2 | When: month and year (two selects) | `trip-when` as "September 2024" |
| 3.3 | Your story (textarea, autosaving, word count shown) | `body` |
| 3.4 | Headline (text, counter: "about 60 characters fits a search result") | `name`, `seo-title` |
| 3.5 | Excerpt (text, counter: "about 155 characters fits a search result") | `excerpt`, `seo-description` |
| 3.6 | Hero photo (existing Cloudinary upload, then the cleanup toggle in section 5) | `hero-image` |

| # | Step 2, Optional extras (one closed group, "Add more if you like") | Field |
|---|---|---|
| 3.7 | Pull quote | `pull-quote` |
| 3.8 | More photos (up to 8) | `photo-gallery` |
| 3.9 | Pets along (picker from the member's own pets) | `pet-co-travelers` |
| 3.10 | Sign-off ("Mood: ... , Name") | `sign-off` |
| 3.11 | Co-travelers (picker over profiles, free text fallback) | `human-co-travelers`, text into `links-and-mentions` |
| 3.12 | Shout-outs: one row shown (who, link, why), "Add another" to five | `links-and-mentions` |
| 3.13 | What it cost (one line) and who it's for (one line), both feed the trip-facts block | `cost-summary`, `for-whom` |
| 3.14 | Credit links (prefilled from the profile, editable there) | Contributors link fields |

| # | Step 3, Confirm | Field |
|---|---|---|
| 3.15 | Sign in or join (Memberstack modal, no page reload) if not signed in. The draft stays. | |
| 3.16 | Rights: "This is my trip, my words and my photos." (required tick) | `charter-agreed-at` |
| 3.17 | Credit mode: full name, first name, pen name (prefilled from the profile) | Contributors `credit-mode` |
| 3.18 | Disclosure: one yes/no "Was any part of this trip paid for or hosted?"; if yes, sponsor name and optional link. Label renders at the top of the story. | `disclosure`, `sponsor-name`, `sponsor-url` |
| 3.19 | Syndication, defaults on: newsletter, social. Press: off until ticked. | `syndication` |
| 3.20 | Charter agreement (required tick, links to /editorial-charter) | `charter-agreed-at` |
| 3.21 | Publish: the Worker creates one Draft, sets Published, publishes the item, sends the writer the copy email with the live link, and flags Nancy (today's behavior). | |

Machine fields, never typed by the writer:
- `reading-time` = words / 220, rounded up. Computed in the page, no AI.
- `region` from the country's region.
- `submitted-at`, `published-date` = now.
- `theme` and `pillar-2`: suggested by the notes call from the existing lists only, shown as editable chips labeled "suggested", writer can change or clear them.
- `sources` = "First-hand" unless the writer edits it.

Draft safety: every field saves to `localStorage` key `tll_submit_draft` on change, inside try/catch, and restores on return. Photos chosen in Step 1 upload when the member is signed in (immediately if already in, otherwise right after the Step 3 sign-in), so anonymous uploads to Cloudinary stay impossible.

Target: a signed-in writer with the six required fields finishes in under five minutes. Measured in the test report.

## 4. Editor's notes

| # | Change |
|---|---|
| 4.1 | A separate panel beside the draft on desktop, below it on phones, cream on the Ink section, never inline. Opens on the button "Ask for Editor's notes". Nothing runs unasked. |
| 4.2 | Suggestions appear one at a time: the original line, the suggested line, **Accept** and **Skip**. No "accept all". Accept changes only that span of the writer's text. |
| 4.3 | Tips are a plain list under the suggestions ("Readers will ask what it cost.", "Add the month you went.", "Your headline is 74 characters; about 60 fits a search result."). Tips have no Accept button. |
| 4.4 | Allowed edits: spelling, punctuation, capitalization, paragraph breaks, sentence order within a paragraph. Anything that would change a word, joke, name, number or detail is shown as a tip. |
| 4.5 | **Server validation (diff check):** the Worker normalizes both strings (lowercase, strip punctuation and whitespace) and accepts an edit only when the normalized text matches (spelling fix is allowed when the edit distance of one word is 2 or less), or when the sentence multiset is identical (reorder), or when the only change is inserted paragraph breaks. Any edit that fails becomes a tip. |
| 4.6 | **System prompt (verbatim):** "You are a copy editor. Point out, never replace. Return JSON suggestions limited to spelling, punctuation, capitalization, paragraph breaks and sentence order. Anything else becomes a tip. Preserve the writer's voice, jokes, slang and specific details exactly." Plus the JSON shape and the tag and pillar lists. |
| 4.7 | **Log:** every suggestion is appended to `editor-notes-log` as `{type, original, suggested, decision, at}` and sent with the publish call. Skipped ones are logged too. |
| 4.8 | Headline, excerpt, body and pull quote are never prefilled, drafted or rewritten by the model. The page has no code path that writes model text into those fields. |

## 5. Photo cleanup (Cloudinary)

| # | Change |
|---|---|
| 5.1 | The original upload stays untouched at its Cloudinary public id. |
| 5.2 | Cleaned version is a derived URL only: `e_improve,e_auto_brightness,e_auto_color,e_auto_contrast,q_auto,f_auto` plus the writer's crop (`c_crop`) and straighten (`a_` angle) from two sliders. |
| 5.3 | Before/after toggle under the photo. "Use the cleaned photo" or "Keep the original". Default: original. |
| 5.4 | Forbidden transformations are blocked twice: the page builds URLs from an allowlist only, and the Worker rejects any stored URL containing `e_gen_`, `e_background_removal`, `e_upscale` or `e_enhance`. |
| 5.5 | Metadata: derived URLs carry `fl_keep_iptc`. The upload preset must not strip metadata on upload. Nancy checks the preset setting "Strip metadata" is off. Location data is stripped by the existing rule (privacy rule 6), so `fl_keep_iptc` keeps copyright and captions, not GPS. |
| 5.6 | Webflow copies the approved URL into `hero-image` or `photo-gallery`; both URLs and the choice go into `photo-originals`. |

## 6. Story template: search and answer-engine protection

(Shared with Phase A lines A7.1 and A7.2.)

| # | Change |
|---|---|
| 6.1 | Article JSON-LD bound per item: headline, description, image, datePublished, dateModified (from `last-updated`, else published), author as Person with `url` /contributors/{slug}, `url` and `@id` as the story's own URL. |
| 6.2 | Byline link to the contributor profile as a real link in the template HTML. |
| 6.3 | Trip-facts block under the lede, real text: Where (city, country), When (trip-when), Cost (cost-summary), Who it's for (for-whom). Rows hide when empty. |
| 6.4 | Country page link and pursuit page link in the template HTML. |
| 6.5 | Sponsored label at the top when `sponsor-name` is set, link with `rel="sponsored"`. |

## 7. What is not in this log

The nav and footer; the map; /travelers; the morning review; link-out stories (packet 2.3 keeps its own line); the Rich Results Test can only be run once the template is live, so it is in the test report.

## 8. Copy for Nancy to approve

**/privacy, processor list, new line:** "Anthropic (Claude) processes the text of a story draft when a writer asks for Editor's notes. It receives the draft, the place and the trip date, nothing else, and does not keep them."

**/editorial-charter, new line:** "Stories are written by the people who took the trip. A tool may suggest spelling and structure fixes and tags; the writer decides every change. Photos are adjusted, never altered."

**Form microcopy (TLL voice, no banned words):**
- Step 1 intro: "Write it the way you would tell a friend at the gate."
- Notes button: "Ask for Editor's notes"
- Notes panel empty state: "Nothing yet. Ask when you have a draft you like."
- Rate limit: "Editor's notes are resting. Try again in an hour."
- Publish button: "Publish my story"
- Done: "It's live. Nancy reads every story and writes if something needs a word."

## 9. Nancy's clicks

1. Cloudflare account and the three secrets (I write the Worker code and the deploy steps into the repo under `worker/`).
2. Cloudinary preset tll_photos: confirm "Strip metadata" is off and no generative add-on is enabled.
3. Approve the field deletions in section 2.
4. Approve the two copy lines in section 8.

## 10. Test report (after approval, before publish)

1. A sample draft with three suggestions accepted, two skipped, and the resulting log JSON.
2. Byte comparison of the body before and after a notes round with nothing accepted: identical.
3. A forged "edit" that changes a number, sent to the Worker: returned as a tip, not an edit.
4. One photo: original URL, cleaned URL, before/after screenshots, original still stored.
5. Rich Results Test output for one live story page.
6. Timed run of the required fields only at 390px.

## How to answer

Reply with the line numbers to approve (for example "1 all, 2 delete all ten and add all eight, 3 all, 4 all, 5 all, 6 all, 8 both lines") or the ones to change. Build starts on approval, as unpublished edits plus the Worker code in the repo.
