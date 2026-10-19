# /submit current page map (Share Your Story), That Layover Life

Read-only map taken 19 Oct 2026 from the Webflow Designer API. Nothing in Webflow was changed, published or saved. Site `69d6145cf421c777840c1e25`, page `6a0d5e5eb7804d3a750dc266`, slug `submit`, page last updated 2026-10-19T10:31:45Z, not a draft.

Page element ids are given as `component/element` where the component is always `6a0d5e5eb7804d3a750dc266` (the page itself). Only the element part is shown below unless noted.

## Read this first: differences from the brief

- The page holds **79 input elements** in the main story form (76 once three leftover placeholder fields are set aside, 75 once the hidden `trip-code` is also set aside). `handoff/CHANGE-LOG-SUBMIT-2026-10-19.md` says 75 inputs and 7 required fields.
- Three placeholder elements with Webflow default text are live in the form (see section 3, "Placeholders"). Two of them are **required** text inputs, so as the page stands they would block the step 1 to step 2 "Next" button and the submit.
- The Cloudinary upload script `tll_photo_upload_v1` is **not** in any of the four HTML embeds. It is a registered script applied to this page in the footer. Its source was read from the script registry.
- Page head and footer custom code is **not** exposed by `data_pages_tool`. It was read with `data_scripts_tool > get_page_freeform_code` (read only). That tool was outside the four named in the brief.
- The import that creates a Stories item is **not visible in page code**. The form posts through Webflow Forms. Section 7 maps by input name and marks what is inference.

## 1. Page settings

| Item | Value |
|---|---|
| Page title | Share Your Story |
| Slug / path | `submit` / `/submit` |
| SEO title | Share Your Story · That Layover Life |
| SEO description | Share your story: what happened on the road, the trips, layovers, marathons and misroutings. Free, forever. Reviewed by a human within 48 hours. |
| Open Graph title | Share Your Story · Tell us what happened on the road (not copied from SEO title) |
| Open Graph description | Free, forever. Reviewed by a human within 48 hours. Bring receipts. (not copied from SEO description) |
| Open Graph image | asset id `6ac86b4157c0e4c728264b2a`, no image URL |
| Locale id | `6a0b29c6d081332e921900ef` |
| Canonical | `https://www.thatlayover.life/submit`, set in head custom code (section 5) |

### Memberstack gating (every `data-ms-*` attribute on the page)

| Element id | Type | Attribute | What it wraps |
|---|---|---|---|
| `6e7c71bb-531f-f315-2f06-51b710bc545c` | Block | `data-ms-content="members"` | TLL Nav v1 component instance and the dark hero section (H1 "Three steps...") |
| `6e7c71bb-531f-f315-2f06-51b710bc546d` | Block | `data-ms-content="anonymous"` | Empty block, no children |
| `410fe31c-0208-fa02-297c-3b2122ab7d40` | Block | `data-ms-content="members"` | The whole writing area: fork cards, story form, link-out form |
| `410fe31c-0208-fa02-297c-3b2122ab7d37` | FormForm | `data-ms-member-bound="true"` | The story form itself (no gating by itself, a Memberstack form binding flag) |
| `410fe31c-0208-fa02-297c-3b2122ab7d51` | Block | `data-ms-content="anonymous"` | The sign-in wall section (section 6) |

Gating is at the block level, not per section. No other `data-ms-*` attribute exists on the page tree. Note the nav sits inside the members block, so a logged-out visitor sees no nav from this component on this page. The footer component (`f733e70e-6af5-ac5d-61a8-a48cf393889e`, TLL Site Footer) is outside both blocks.

### Every H1

There are two H1 elements, shown one at a time depending on login state:

1. `171bb20c-248d-4e37-5574-a970d842393b`, text: "Three steps. Your voice stays yours." (the phrase "Your voice stays yours." is an Emphasized child, `171bb20c-248d-4e37-5574-a970d842393a`). Inside the members block.
2. `410fe31c-0208-fa02-297c-3b2122ab7d47`, text: "Sign in to write your trip." ("write your trip" is an Emphasized child, `410fe31c-0208-fa02-297c-3b2122ab7d45`). Inside the anonymous block.

Other headings: H3 `b117011c-c85e-580a-bbe9-9e3e2c04c758` "Sponsored or hosted? Say so. It goes at the top." (used as a fieldset legend) and H2 `51b9abee-68eb-6095-9a21-24484793e23c` "Link to a story you already published". The other eleven legends are `fieldset > legend` DOM elements or `h3` inside embeds, not Heading elements.

## 2. Top-level section order

The body holds one wrapper, one `main`, and the footer. Top to bottom:

| # | Element id | Element | Visible heading text |
|---|---|---|---|
| 1 | `6e7c71bb-531f-f315-2f06-51b710bc546e` | Block `.tll-share-wrap` | wrapper for rows 2 to 4 |
| 1a | `34fa1904-dc53-8431-fadc-f48acb46f526` | Component instance "TLL Nav v1" (inside members block `...545c`) | none |
| 2 | `6e7c71bb-531f-f315-2f06-51b710bc537f` | Section `.tll-section-dark .tll-share-hero` (inside members block `...545c`) | Eyebrow "· Share your story · Submit yours ·"; H1 "Three steps. Your voice stays yours."; sub "About 10 fields total. Reviewed by a human, usually within 48 hours. Phone photos welcome."; three promises: "We do not rewrite your voice.", "We credit you by default.", "You can remove anything, any time." |
| 3 | `6e7c71bb-531f-f315-2f06-51b710bc546d` | Block, `data-ms-content="anonymous"` | empty |
| 4 | `410fe31c-0208-fa02-297c-3b2122ab7d52` | `main` | wrapper for rows 5 and 6 |
| 5 | `410fe31c-0208-fa02-297c-3b2122ab7d3f` | Section `.tll-section .tll-bg-paper .tll-pen-section` (inside members block `...7d40`) | fork cards "Write it here" and "Link a story you already published"; then the story form (12 fieldsets, section 3); then the hidden link-out form H2 "Link to a story you already published" |
| 6 | `410fe31c-0208-fa02-297c-3b2122ab7d50` | Section `.tll-section .tll-bg-paper .tll-pen-locked` (inside anonymous block `...7d51`) | Eyebrow "· Share your story ·"; H1 "Sign in to write your trip."; "Free to join, free to publish. A human reviews every submission within 48 hours."; buttons "Log in" (`/login`) and "Join the Travelers" (`/signup`) |
| 7 | `f733e70e-6af5-ac5d-61a8-a48cf393889e` | Component instance "TLL Site Footer" | none |

Fork cards (inside `db792b8d-0563-5847-6bab-bf221a701e95`, attribute `data-tll-fork`): link `db792b8d-0563-5847-6bab-bf221a701e8e` (`data-tll-fork-pick="write"`, "Write it here. The full story lives on TLL. Photos, route, the trip details, the works.") and link `db792b8d-0563-5847-6bab-bf221a701e93` (`data-tll-fork-pick="link"`, "Link a story you already published. Already published elsewhere? Point the card at it. TLL never copies the work."). Head script `tll-share-fork-js-v1` shows one form and hides the other, remembers the choice in `sessionStorage` key `tllShareMode`, and honors `?mode=link`.

## 3. The story form

- Form wrapper `410fe31c-0208-fa02-297c-3b2122ab7d36` (class `.tll-pen-form`), Webflow form name **"Story submission"**, method `get`, empty action and redirect.
- Form element `410fe31c-0208-fa02-297c-3b2122ab7d37` (FormForm). Attributes: `id="wf-form-Story-submission"`, `data-tll-form="submit-story"`, `data-ms-member-bound="true"`, `enctype="multipart/form-data"`.
- Submit button `410fe31c-0208-fa02-297c-3b2122ab7d32`, text "Send it to the editor", loading text "Sending to Copenhagen…". Status line: "One editor reads every word in Copenhagen · Reply in 48 hours".
- Success message `...7d38` and error message `...7d3b` exist inside the wrapper (full text in section 6 notes below).
- A second form, the link-out form, is covered at the end of this section.

Section order, step attribute and element id. Steps come from `data-tll-step`; the footer script `tll-form-steps-js-v2` labels step 1 "The story", step 2 "The details", step 3 "Credit & photos".

| # | Section heading | `data-tll-step` | Container id | Inputs |
|---|---|---|---|---|
| 1 | Set the scene | 1 | `410fe31c-0208-fa02-297c-3b2122ab7c4f` (DOM) | 5 |
| 2 | The story | 1 | `410fe31c-0208-fa02-297c-3b2122ab7c66` (DOM) | 3 |
| 3 | The details | 2 | `410fe31c-0208-fa02-297c-3b2122ab7ce1` (DOM) | 10 |
| 4 | The hook | 2 | `410fe31c-0208-fa02-297c-3b2122ab7c79` (DOM) | 2 |
| 5 | Sign off | 2 | `410fe31c-0208-fa02-297c-3b2122ab7cf4` (DOM) | 2 |
| 6 | Sponsored or hosted | 2 | `dd10868e-42fb-a010-1b17-14b73d6e0d01` (DOM) | 3 |
| 7 | Other perspectives | 2 | `841089e3-67d1-5c1f-a145-7871280bc873` (HtmlEmbed) | 4 |
| 8 | Shout-outs | 2 | `76d2ca29-46f8-b442-4b40-3c363f7a8c73` (HtmlEmbed) | 31 |
| 9 | Credit and links | 3 | `4176af11-8847-3408-88ad-fb8370d77886` (DOM) | 5 |
| 10 | Editorial preferences | 3 | `410fe31c-0208-fa02-297c-3b2122ab7d30` (DOM) | 7 |
| 11 | Photos | 3 | `410fe31c-0208-fa02-297c-3b2122ab7c8c` (DOM) | 3 |
| 12 | The Layover Lounge | 3 | `f8aefc70-4c04-4bec-2df1-c78ccd11639b` (HtmlEmbed) | 4 |
| | **Total in story form** | | | **79** |

Count method: every `input`, `textarea` and `select` inside the form, including checkboxes, radios, file inputs, the hidden `trip-code` and the read-only `invite-link`. Buttons are not counted. Inputs inside HtmlEmbeds are counted from the embed code. Radio group `credit-mode` counts as 3 inputs. The photo upload script adds one hidden input per file input at runtime (same name); those are not counted.

Required flags below are the Designer `isRequired` setting. Real required fields (7): `country`, `name`, `excerpt`, `body`, `region`, `hero-image`, `agree-charter`. The upload script strips `required` from file inputs at runtime and enforces it with its own "Please add a photo before sending." message.

### Set the scene  (5 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| `410fe31c-0208-fa02-297c-3b2122ab7c3f` | Country | `country` | text | yes |  |
| `410fe31c-0208-fa02-297c-3b2122ab7c45` | City or layover | `city` | text | no |  |
| `4245d48c-bd4c-0b3a-3ac0-fe9f2e613734` | When did you travel? | `trip-when` | text | no |  |
| `94f59b8f-794f-1db9-d0ba-91d1f1e7f233` | This is some text inside of a div block. | `Field 4` | text | yes | PLACEHOLDER |
| `1e2ca314-7a2a-6b2b-455b-89a15018bd82` | This is some text inside of a div block. | `Field 3` | text | yes | PLACEHOLDER |

### The story  (3 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| `410fe31c-0208-fa02-297c-3b2122ab7c57` | Headline | `name` | text | yes |  |
| `410fe31c-0208-fa02-297c-3b2122ab7c5b` | Excerpt | `excerpt` | textarea | yes |  |
| `410fe31c-0208-fa02-297c-3b2122ab7c61` | Body | `body` | textarea | yes |  |

### The details  (10 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| `410fe31c-0208-fa02-297c-3b2122ab7cac` | Region | `region` | select | yes |  |
| `410fe31c-0208-fa02-297c-3b2122ab7cb0` | Reading time (min) | `reading-time` | number | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7cb5` | Layover Guides | `theme-salty-air` | checkbox | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7cbc` | Paw Passport | `theme-wild-routes` | checkbox | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7cc3` | Travel Logistics | `theme-alpine-escape` | checkbox | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7cca` | Cultural Intelligence | `theme-desert-glow` | checkbox | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7cd1` | Stories From the Road | `theme-sunset-mode` | checkbox | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7c4a` | Sensory anchors | `sensory-anchors` | text | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7cdc` | Pets along? | `pets-along` | text | no |  |
| in embed `f12d8018-d584-9384-97c8-199fbc51c327` | Pet-friendly notes | `pet-notes` | textarea | no | label hidden until pets-along has a value |

### The hook  (2 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| `410fe31c-0208-fa02-297c-3b2122ab7c6e` | Pull quote | `pull-quote` | textarea | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7c74` | Reader question | `reader-question` | text | no |  |

### Sign off  (2 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| `410fe31c-0208-fa02-297c-3b2122ab7ce9` | Sign-off | `sign-off` | text | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7cef` | Hashtag set | `hashtag-set` | text | no |  |

### Sponsored or hosted  (3 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| `9bf4caf9-84cb-2c70-71ca-050bb9bebb2c` | This story involves sponsorship, hosted travel, or a gifted stay | `sponsored` | checkbox | no |  |
| `4176af11-8847-3408-88ad-fb8370d7787b` | Sponsored by | `affiliation` | text | no |  |
| `4176af11-8847-3408-88ad-fb8370d77881` | What should the disclosure line say? | `disclosure-line` | text | no |  |

### Other perspectives  (4 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| in embed `841089e3-67d1-5c1f-a145-7871280bc873` | Who was with you? | `co-travelers` | text | no |  |
| in embed `841089e3-67d1-5c1f-a145-7871280bc873` | Is a story from this trip already on the site? | `same-trip-as` | text | no |  |
| in embed `841089e3-67d1-5c1f-a145-7871280bc873` | (none, hidden field) | `trip-code` | hidden | no | data-tll-trip-code, set by script |
| in embed `841089e3-67d1-5c1f-a145-7871280bc873` | Their invite link | `invite-link` | text | no | readonly, filled by script |

### Shout-outs  (31 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Add shout-outs to my story | `shoutouts` | checkbox | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Name (shout-out 1) | `shout-1-name` | text | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Type (shout-out 1) | `shout-1-type` | select | no | 7 options, Pick one first |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | City (shout-out 1) | `shout-1-city` | text | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Link (shout-out 1) | `shout-1-link` | text | no | inputmode url |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | This is an affiliate link. I earn if someone books through it. (shout-out 1) | `shout-1-affiliate` | checkbox | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | I got this free or discounted. (shout-out 1) | `shout-1-comped` | checkbox | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Name (shout-out 2) | `shout-2-name` | text | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Type (shout-out 2) | `shout-2-type` | select | no | 7 options, Pick one first |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | City (shout-out 2) | `shout-2-city` | text | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Link (shout-out 2) | `shout-2-link` | text | no | inputmode url |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | This is an affiliate link. I earn if someone books through it. (shout-out 2) | `shout-2-affiliate` | checkbox | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | I got this free or discounted. (shout-out 2) | `shout-2-comped` | checkbox | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Name (shout-out 3) | `shout-3-name` | text | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Type (shout-out 3) | `shout-3-type` | select | no | 7 options, Pick one first |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | City (shout-out 3) | `shout-3-city` | text | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Link (shout-out 3) | `shout-3-link` | text | no | inputmode url |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | This is an affiliate link. I earn if someone books through it. (shout-out 3) | `shout-3-affiliate` | checkbox | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | I got this free or discounted. (shout-out 3) | `shout-3-comped` | checkbox | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Name (shout-out 4) | `shout-4-name` | text | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Type (shout-out 4) | `shout-4-type` | select | no | 7 options, Pick one first |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | City (shout-out 4) | `shout-4-city` | text | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Link (shout-out 4) | `shout-4-link` | text | no | inputmode url |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | This is an affiliate link. I earn if someone books through it. (shout-out 4) | `shout-4-affiliate` | checkbox | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | I got this free or discounted. (shout-out 4) | `shout-4-comped` | checkbox | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Name (shout-out 5) | `shout-5-name` | text | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Type (shout-out 5) | `shout-5-type` | select | no | 7 options, Pick one first |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | City (shout-out 5) | `shout-5-city` | text | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | Link (shout-out 5) | `shout-5-link` | text | no | inputmode url |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | This is an affiliate link. I earn if someone books through it. (shout-out 5) | `shout-5-affiliate` | checkbox | no |  |
| in embed `76d2ca29-46f8-b442-4b40-3c363f7a8c73` | I got this free or discounted. (shout-out 5) | `shout-5-comped` | checkbox | no |  |

### Credit and links  (5 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| `410fe31c-0208-fa02-297c-3b2122ab7cfc` | Named (your full name and avatar) | `credit-mode` | radio | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7d00` | Pen name | `credit-mode` | radio | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7d04` | Anonymous Traveler | `credit-mode` | radio | no |  |
| `4176af11-8847-3408-88ad-fb8370d7786f` | Website | `credit-website` | text | no |  |
| `4176af11-8847-3408-88ad-fb8370d77875` | Instagram | `credit-instagram` | text | no |  |

### Editorial preferences  (7 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| `410fe31c-0208-fa02-297c-3b2122ab7d0c` | OK to include in the TLL newsletter | `syndication-newsletter` | checkbox | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7d13` | OK to post quotes on TLL social | `syndication-social` | checkbox | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7d1a` | OK for press to reach out about this story | `syndication-press` | checkbox | no |  |
| `ed7e8a88-f40b-02f9-252d-8268b745a52c` | Show the date it was posted | `show-posted-date` | checkbox | no |  |
| `cc83e805-95cf-2ad0-aae3-36da35a0efa5` | Show when I traveled | `show-traveled-date` | checkbox | no |  |
| `b9aa88a4-d3d3-dc7c-166a-cd0e7b175933` | Show when it was last edited | `show-edited-date` | checkbox | no |  |
| `4fb84d50-69ae-61b8-b2dd-0cf6c9fa065f` | Checkbox 2 | `Checkbox 2` | checkbox | no | PLACEHOLDER |

### Photos  (3 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| `410fe31c-0208-fa02-297c-3b2122ab7c81` | Hero image | `hero-image` | file | yes |  |
| `410fe31c-0208-fa02-297c-3b2122ab7c87` | Photo gallery (up to 12) | `photo-gallery` | file | no |  |
| `410fe31c-0208-fa02-297c-3b2122ab7d23` | These are my words and my photos (or I have the right to publish them), and they follow the Community Guidelines. If a person is the clear subject of a photo, they are fine with being published. If a child is the subject, I have a parent or guardian's permission. No AI-generated writing. | `agree-charter` | checkbox | yes |  |

### The Layover Lounge  (4 inputs)

| Input element id | Label text | name | type | required | Notes |
|---|---|---|---|---|---|
| in embed `f8aefc70-4c04-4bec-2df1-c78ccd11639b` | Also submit my favorite photo to the Lounge | `lounge-photo` | checkbox | no |  |
| in embed `f8aefc70-4c04-4bec-2df1-c78ccd11639b` | Which photo? | `lounge-photo-pick` | select | no | My hero photo / One of my gallery photos |
| in embed `f8aefc70-4c04-4bec-2df1-c78ccd11639b` | Where was it taken? | `lounge-photo-place` | text | no |  |
| in embed `f8aefc70-4c04-4bec-2df1-c78ccd11639b` | Caption | `lounge-caption` | text | no |  |

### Placeholders and leftovers found in the form

These look like default Webflow elements added during an edit and never filled in. Page last updated 2026-10-19T10:31Z.

- `94f59b8f-794f-1db9-d0ba-91d1f1e7f233`, Set the scene, name `Field 4`, **required**, label text "Form Label / This is some text inside of a div block." Its label also carries `data-tll-field="trip-when"`, the same as the real trip-when label.
- `1e2ca314-7a2a-6b2b-455b-89a15018bd82`, Set the scene, name `Field 3`, **required**, same default label text.
- `4fb84d50-69ae-61b8-b2dd-0cf6c9fa065f`, Editorial preferences, checkbox name `Checkbox 2`, label "Form Label / Checkbox 2", inside a second `data-tll-dates="opt-in"` group with default text.

Other leftovers to know about when rebuilding:

- The five lens checkboxes (`The details`) keep old theme names in their `name` and `value` (`theme-salty-air`, `theme-wild-routes`, `theme-alpine-escape`, `theme-desert-glow`, `theme-sunset-mode`) while the visible labels are now Layover Guides, Paw Passport, Travel Logistics, Cultural Intelligence, Stories From the Road. Each also has a hidden-looking inline label with the literal text "theme[]". The "pick up to 3" limit is not enforced by anything seen in page code.
- Duplicate DOM ids: `field` on 14 inputs, `field-2` on 4, `radio` on 3, `checkbox` on 4, and `field-5` on 4 (link-out form). Fine for Webflow, poor for label association and accessibility.
- `country` is a free-text input in both forms (the CMS field `country-2` is a reference, so the importer must resolve it).
- Hero copy says "About 10 fields total" and "Three steps"; the form has 79 inputs across 12 fieldsets in 3 steps.
- Syndication, date options and sponsorship are separate checkboxes, no single `syndication` field exists on the page.

### Link-out form (second form, hidden until the fork card "Link a story you already published" is chosen)

- Wrapper `51b9abee-68eb-6095-9a21-24484793e254`, form name "Link-out story", method `post`. Form element `51b9abee-68eb-6095-9a21-24484793e255`, `data-tll-form="link-out-story"`. Container block `51b9abee-68eb-6095-9a21-24484793e25c` has `hidden` and `data-tll-linkout`. Submit button `38cc5534-9706-128d-5c7a-b66b4def97be`, "Send the link →".
- Not counted in the 79. It has 5 inputs:

| Input element id | Label text | name | type | required |
|---|---|---|---|---|
| `51b9abee-68eb-6095-9a21-24484793e240` | The link | `external-url` | url | yes |
| `51b9abee-68eb-6095-9a21-24484793e243` | Title | `field-5` | text | yes |
| `51b9abee-68eb-6095-9a21-24484793e246` | Country | `country` | text | yes |
| `51b9abee-68eb-6095-9a21-24484793e249` | One-line summary | `summary` | text | yes |
| `51b9abee-68eb-6095-9a21-24484793e24b` | gated: It sits behind a paywall or a login. The card gets a gate chip so nobody is surprised. | `gated` | checkbox | no |

The Title input is named `field-5` (a Webflow default). `country` here repeats the story form's name. Success and error messages: "Got it. Same light pass as every story: a photo and a title, it's travel, the link works, the country is right. A human looks within 48 hours, then the card goes up saying where it opens." and "That did not send. Check the link starts with https:// and try again, or email hello@thatlayover.life with the link."

## 4. HTML embeds and code on the page

Four HtmlEmbed elements, all inside the story form. First 200 characters of each:

**`f12d8018-d584-9384-97c8-199fbc51c327`**, inside "The details", after `pets-along`

```html
<label class="tll-pen-field" data-tll-pet-notes hidden><span class="tll-pen-label">Pet-friendly notes</span><textarea class="tll-pen-input tll-pen-textarea" name="pet-notes" rows="3" maxlength="1200" 
```

**`841089e3-67d1-5c1f-a145-7871280bc873`**, between Sponsored or hosted and Shout-outs (this is the whole "Other perspectives" fieldset)

```html
<fieldset class="tll-pen-fieldset" data-tll-step="2" data-tll-persp>
<h3 class="tll-pen-legend">Other perspectives</h3>
<p class="tll-pen-help">Traveled with someone? Tag them, then send them the invi
```

**`76d2ca29-46f8-b442-4b40-3c363f7a8c73`**, between Other perspectives and Credit and links (the whole "Shout-outs" fieldset, 5 rows)

```html
<fieldset class="tll-pen-fieldset" data-tll-step="2" data-tll-shout>
<h3 class="tll-pen-legend">Shout-outs</h3>
<p class="tll-pen-help">Restaurants, stays, tours, the guide who saved the day. Optional
```

**`f8aefc70-4c04-4bec-2df1-c78ccd11639b`**, after Photos, before the submit block (the "The Layover Lounge" fieldset, plus the extras `<style id="tll-story-extras-v1">` and `<script id="tll-story-extras-js-v1">`)

```html
<fieldset class="tll-pen-fieldset" data-tll-step="3" data-tll-lounge>
<h3 class="tll-pen-legend">The Layover Lounge</h3>
<p class="tll-pen-help">Got one photo you love more than the rest? Send it to t
```

Embed 4 also carries the form extras script ("Story form extras v1, 10 Oct 2026"). It generates the trip code (`?trip=` query, else `localStorage` key `tllStoryDraft`, else random `T...`), builds the invite link `https://www.thatlayover.life/submit?trip=<code>`, prefills `same-trip-as` from `?with=`, shows pet notes once `pets-along` has text, reveals shout-out rows and the Lounge block, prefixes `https://` on any `[name$="-link"]` field, and appends the invite link to the success box. It does not touch Cloudinary.

### Cloudinary upload script `tll_photo_upload_v1`

It is **not an embed**. It is a registered script (display name "TLL Photo Upload v1", version 1.0.0, created 2026-10-19T12:41:46Z), applied to this page in the **footer**. Hosted copy: `https://cdn.prod.website-files.com/69d6145cf421c777840c1e25%2F689e5ba67671442434f3ca35%2F6ad6100afa2af71f2ad184d0%2Ftll_photo_upload_v1-1.0.0.js`.

| Item | Value |
|---|---|
| Cloud name | `idonvlow` |
| Endpoint | `https://api.cloudinary.com/v1_1/idonvlow/image/upload` (unsigned, POST) |
| Upload preset | `tll_photos` |
| Folder | `"tll/" + <file input name>`, for example `tll/hero-image`, `tll/photo-gallery` |
| Target inputs | every `.w-form input[type=file]` that has a `name` |
| Multi-file names | `photos`, `photo-gallery`, `pet-gallery` get `multiple` set |
| Where the URL goes | A new `<input type="hidden">` appended after the file input, given the **same name** as the file input; the file input loses its `name` and `data-name`. Value is the `secure_url` of each upload, joined with `", "` (comma plus space) |
| Limits | images only (`image/` MIME), 10 MB each (10485760 bytes) |
| Submit guards | blocks submit with "Please add a photo before sending." when a required file field has no URL, and with "Still uploading. One moment." while uploads run; status text in `.tll-up-msg` with `role="status"` |

So on this page `hero-image` and `photo-gallery` each submit as a text value of one or more `https://res.cloudinary.com/...` URLs, not as files.

Also applied to this page: header script `tllgateflashv1` (section 6). Site-level scripts include `tll_memberstack_init_v2` (header), `tllformcontrolsv3` (header), `tllformlabelsv1` (footer) and others; their sources were not read.

## 5. Page-level custom code

Not exposed by `data_pages_tool`. Read with `data_scripts_tool > get_page_freeform_code` (read only).

**Head**, first 300 characters:

```html
<link rel="canonical" href="https://www.thatlayover.life/submit">
<style id="tll-share-fork-v1">
/* Share fork (board D8, 30 Sep 2026): Write it here (dark card) or Link to it (rose outline). The story form is untouched; the fork only shows and hides. */
[data-tll-fork]{margin:0 0 26px}

```

Head holds: canonical link, `<style id="tll-share-fork-v1">`, `<script id="tll-share-fork-js-v1">` (the Write it here / Link it fork).

**Footer**, first 300 characters:

```html
<style id="tll-form-fix">
fieldset.tll-pen-fieldset{border:1px solid rgba(13,15,26,.08) !important;border-radius:14px;box-shadow:0 1px 3px rgba(13,15,26,.05);padding:24px !important;}
.tll-pen-legend{float:left;width:100%;padding:0;margin:0 0 6px;border:0;}
.tll-pen-legend + *{clear:both;}
h3.tll-pe
```

Footer holds: `<style id="tll-form-fix">` (fieldset cards, checkbox and radio layout, accent colors), `<style id="tll-form-steps-v2">`, and `<script id="tll-form-steps-js-v2">` (the three-step controller: progress bar, Back and Next, per-step validation, 20 second autosave to `localStorage` key `tllStoryDraft` and to Memberstack member JSON `tllStoryDraft`, prefill of `credit-website` and `credit-instagram` from Memberstack `tllLinks` or custom fields).

Registered scripts applied to the page: `tllgateflashv1` v1.0.0 (header), `tll_photo_upload_v1` v1.0.0 (footer).

## 6. Sign-in gate

- Element that shows "Sign in to write your trip.": H1 `410fe31c-0208-fa02-297c-3b2122ab7d47`, inside Block `410fe31c-0208-fa02-297c-3b2122ab7d4f` (`.tll-container .inline-div-1`), inside Section `410fe31c-0208-fa02-297c-3b2122ab7d50` (`.tll-pen-locked`), inside Block `410fe31c-0208-fa02-297c-3b2122ab7d51` with `data-ms-content="anonymous"`.
- How the form is hidden for logged-out visitors: the whole writing area (fork cards, story form, link-out form) sits inside Block `410fe31c-0208-fa02-297c-3b2122ab7d40` with `data-ms-content="members"`. Memberstack removes that block for visitors who are not signed in and removes the `anonymous` block for members. The hero and nav use the same pair (`...545c` members, `...546d` anonymous and empty). This is a Memberstack attribute gate, not a class or page script of our own.
- Flash guard: header script `tllgateflashv1` (2026-09-28). If `localStorage` holds `_ms-mid` or `_ms-mem`, it adds class `tll-ms-pending` to `<html>` and injects `<style id="tll-gate-flash">` with `html.tll-ms-pending [data-ms-content="anonymous"]{visibility:hidden!important;display:none!important}` until `$memberstackDom.getCurrentMember()` answers (plus 300 ms), failing open after 4 seconds. Read only; writes nothing to Memberstack.
- The gate's buttons: "Log in" to `/login` (`410fe31c-0208-fa02-297c-3b2122ab7d4b`) and "Join the Travelers" to `/signup` (`410fe31c-0208-fa02-297c-3b2122ab7d4d`).
- Because the gate is client-side, the story form markup is still delivered in the page source to logged-out visitors; it is only removed by Memberstack after load.
- Story form messages: success "It's with the editor. Nancy reads it. You'll hear back within 48 hours at the email on your account. Questions meanwhile: hello@thatlayover.life. Your draft stays in your account either way." Error "That did not file. Your words are still here, so nothing is lost. Check the country, the title and the story itself, then send again. Still stuck? Email hello@thatlayover.life and we will take it by hand."

## 7. Input to Stories CMS field slug

The page code does not show the import. Webflow's form (method `get`, empty action) is posted by Webflow Forms, and nothing on the page names a CMS slug. The table matches by input name only. "Exact" means the input name equals the CMS slug. "Inferred" means a likely match by meaning that nothing on the page confirms.

| CMS slug | Input name on page | Match | Notes |
|---|---|---|---|
| `name` | `name` (Headline) | Exact | required |
| `excerpt` | `excerpt` | Exact | required, 240 character help text |
| `body` | `body` | Exact | required, 14 row textarea |
| `country-2` | `country` (Country) | Inferred | Free text on the page; `country-2` is a reference field, so the importer has to resolve the name to a Countries item |
| `city` | `city` | Exact | optional |
| `trip-when` | `trip-when` | Exact | optional; a stray required `Field 4` carries a duplicate `data-tll-field="trip-when"` label |
| `hero-image` | `hero-image` | Exact | file input; submits as a Cloudinary URL via the hidden input (section 4) |
| `photo-gallery` | `photo-gallery` | Exact | file input, up to 12 per help text; submits as comma plus space joined Cloudinary URLs |
| `pull-quote` | `pull-quote` | Exact | optional |
| `sign-off` | `sign-off` | Exact | optional |
| `human-co-travelers` | `co-travelers` | Inferred | Other perspectives; text, comma separated names or handles |
| `pet-co-travelers` | `pets-along` | Inferred | text; `pet-notes` is a separate textarea with no matching slug in this list |
| `links-and-mentions` | `shout-1-name` through `shout-5-comped` (30 inputs, plus `shoutouts` toggle) | Inferred | Five rows of name, type, city, link, affiliate, comped |
| `disclosure` | `disclosure-line` (with `sponsored`, `affiliation`) | Inferred | The slug `disclosure` differs from the input name |
| `cost-summary` | none | No input | No cost field exists anywhere on the current page |
| `syndication` | `syndication-newsletter`, `syndication-social`, `syndication-press` | Inferred | Three checkboxes with no `value` set; one CMS field would need them combined |

Inputs on the page with no slug in your list: `region`, `reading-time`, the five `theme-*` checkboxes, `sensory-anchors`, `pet-notes`, `reader-question`, `hashtag-set`, `sponsored`, `affiliation`, `same-trip-as`, `trip-code`, `invite-link`, `credit-mode`, `credit-website`, `credit-instagram`, `show-posted-date`, `show-traveled-date`, `show-edited-date`, `agree-charter`, `lounge-*`.

Reference only, not the current import: an untracked, unmerged `worker/src/index.js` in this repo (the proposed Cloudflare Worker from `handoff/CHANGE-LOG-SUBMIT-2026-10-19.md`) writes `country-2`, `city`, `trip-when`, `hero-image`, `photo-gallery`, `pull-quote`, `sign-off`, `human-co-travelers`, `pet-co-travelers`, `links-and-mentions`, `cost-summary`, `syndication` and `disclosure` from its own request fields. It does not read this page's form. The live import that creates the item sits outside the page and was not inspected.

## Blockers and gaps

- `data_pages_tool` has no custom code action; `data_scripts_tool` was used for section 5 (read only).
- The live import code was not found on the page or in the page's scripts. Site-level scripts were listed but not read.
- Visual rendering was not checked (no snapshot taken). Hidden or conditional visibility (for example `[hidden]` rows, CSS that may hide the placeholder fields) comes from markup and code only.
