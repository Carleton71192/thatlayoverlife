# Fix-pass verification C (items 4, 5, 6). Read-only, 12 Oct 2026

Site 69d6145cf421c777840c1e25. Nothing was written to Webflow. Data came from the Designer and Data APIs: element trees, element settings and HtmlEmbed code, page and site freeform code, applied and registered scripts, and the CMS. Hosted script bodies on cdn.prod.website-files.com could not be fetched (the proxy refuses CONNECT), so their behavior comes from repo notes. Raw dumps used for this note are in scratchpad/c/ (home_embeds/*.html, *_code_*.html, home_tree_print.txt, submit_tree_print.txt, footer_tree.txt).

## What tllStates is (needed for item 4)

- tllStates is the map editor's record. Its shape is `{v:2, travelers:[{id,name,color,pet}], states:{"<ISO numeric>":{"<travelerId>":"lived"|"visited"|"layover"}}}`, plus the key "XK" for Kosovo. It lives in two places: the member's Memberstack member JSON (`getMemberJSON().data.tllStates`) and the browser (`localStorage.tllStates`, guarded by `tllStatesOwner`).
- Who writes it: only the /the-map member editor (page footer freeform, `save()` → `localStorage.setItem("tllStates")` + `window.__tllPush`, source src/pages/the-map/footer-v3-one-count-rule.html). Every other script reads it.
- The counting rule in the code since 8 and 9 Oct ("one count rule", `tllOwnN`): count a country if any non-pet traveler has `lived` or `visited` on it. Layovers are counted apart. Denominator 249.
- Public copy: logged-out visitors cannot read member JSON. The only public copy is `map-2.0/data/owner-record.json` (tllStates v2 shape, copied from Nancy's member JSON on 7 Oct, served by jsDelivr at `https://cdn.jsdelivr.net/gh/carleton71192/thatlayoverlife@<pinned commit>/map-2.0/data/owner-record.json`). Its contents:
  - Nancy (t1): 87 keys. 5 lived + 80 visited = **85** under the map rule; 2 layover-only (158 Taiwan, 214 Dominican Republic). **87 is only reached by counting layovers.**
  - Magnus (t2, pet): **14** keys (2 lived: 076 Brazil, 208 Denmark; 12 visited, including XK Kosovo). The Pets CMS `countries-list` for Magnus has **13** (Brazil, Germany, Czech Republic, Slovakia, Austria, Albania, Serbia, Kosovo, Bulgaria, Sweden, North Macedonia, Hungary, Poland). The one difference is **Denmark** (lived in tllStates, missing from the CMS).
- CMS today: Contributors › Nancy Carleton (6a0be79e01ee7eff10102ce9) `country-count` = 87, `fun-title` "87-and-counting", `bio-short` "87 countries, 7 continents marathoned…", `bio-long` "87 countries on the board… the Trip Ledger". Pets › Magnus Waffles (6a0be888a0693535d3487303) `countries-visited` = 13, `countries-list` 13 names.

---

### Item 4: Counts (footer, home passport, /signup, profiles, country pages, /pets)

- **Status: STILL BROKEN.** There is no single source. Four different counting rules and three sources are live, and the "0/2490 of 249" text bug is still in the home embed.

- **Evidence, location by location**

| # | Where | Element id | Number now | Who writes it now | Source and rule |
|---|---|---|---|---|---|
| 1 | Footer component "TLL Site Footer" (710ff458-c06e-d602-a663-e5e88ca1456b, 63 instances) | Strong `710ff458-c06e-d602-a663-e5e88ca1457c` (String …1457d) + label span …1457f "countries" | **"87" typed** | Nobody for logged-out visitors. **On Home** the page footer script `__tllLiveCounts` and **on the Contributors template** the "live stats binder" (first `<script>` in its page footer) both find the leaf "countries", take its previous sibling and write the **viewer's own** `Object.keys(tllStates.states).length` into it. A signed-in member sees their own number (all keys, layovers and pet-only countries included) in a line that is meant to be Nancy's. | Typed |
| 1b | Same footer | Strong `…14577` (String …14578) "6" + "stories" | 6 typed | Site head freeform `tll-live-stories-v1` rewrites `<strong>N</strong>`/leaf-before-"stories" from /sitemap.xml on every page | Sitemap count. OK |
| 1c | Same footer | Strong `…14586` (String …14587) "1" + "pet"; hidden span `…14580` "1 traveler" | 1 typed | Nobody | Typed |
| 2 | Home, Chapter 03 passport, HtmlEmbed **438ddfc8-370c-4158-a39c-c1c3fc3e992b** | `<p class="h3-c3-num" data-h3-pass>` | "0" + "/249" | Inline `<script id="h3-pass-js">` in the same embed | Member JSON or localStorage tllStates. Rule: **first** non-pet traveler only, counts every value except `'airside'`. `'airside'` is never stored, so **layovers are counted** (Nancy would read 87 here, 85 on the map). Numeric keys only (`/^\d{3}$/`), so Kosovo "XK" is dropped. Logged-out visitors get 0. |
| 2b | Home page footer freeform, script 1 (`__tllLiveCounts`) | writes `#tll-map-counter`, `#tll-map-pct`, text patterns "N countries, counted by hand", "N countries on ", "N of 195 · N to go", "View all N visits", leaf "countries" and "the lifer progress" | n/a | itself | Rule `Object.keys(states).length` (all keys, pets and layovers included), **denominator 195**. Home no longer has any of those patterns, so its only live effect is overwriting the footer "87" (row 1). |
| 2c | Home, Chapter 05 Paw Passport, HtmlEmbed a4c1009d-e6d8-85a7-3e6a-57f2177aa0b7 | `<span data-h3-mag>13</span>` | 13 | Inline `h3-mag-js` fetches /pets/magnus-waffles and counts `window.TLL_PET.countries` | Pets CMS `countries-list` (13), not tllStates (14) |
| 2d | Home, hidden Paw section 77240a57-…-2dd1197fb60a | String 77240a57-705d-72c0-ed6c-2dd1197fb5c3 "13 countries · 0 complaints" | 13 typed | none | Hidden, not rendered |
| 3 | /signup (6a0d5c1fa1d71485d8688f7b) | Block `d8aa44e7-c49a-d2c7-7ab8-f5d9fb2ef859` `tll-auth-stats`, **visibility: false**: "1 Travelers" (…f845), "9 Countries" (…f84a), "6 Stories" (…f84f), "1 Pets" (…f854) | typed | none, no page script (signup has only a canonical link in its head) | Typed and hidden. Nothing renders today. |
| 4a | /profile (69d61469f421c777840c204e) | no numeric count in the Designer (searched "countr", "87", "249", "195") | n/a | page footer only rewrites links and copy | n/a |
| 4b | Contributors Template (6a0b29c8a7b1840afe9390ab) | `[data-tll-prof="n-countries"]` Block **80cbda6d-af58-8196-dd95-4e61bae97c3f** | Nancy: 87 | Bound to Contributors › **Country count** (field e5980a87474ca6f1d8700f67d932474f). Page footer `tll-pf3-profile-js-v1` locks it with a MutationObserver, but when the **viewer is the owner** it swaps in `ownN(tllStates)` (lived+visited) = **85**. | So Nancy logged in sees 85 on her own profile while every visitor sees 87. |
| 4c | Contributors Template, page footer script 1 ("live stats binder") | any leaf "countries"/"continents" | viewer's count | itself | `Object.keys(viewer's tllStates)`. It writes the **viewer's** count onto **someone else's** profile labels and onto the footer. pf3's lock protects 80cbda6d, but not the footer. |
| 4d | Contributors Template, hidden sections | String a83eaf6e-d9df-dafa-4714-d931180b8d2d (bio, "87 countries on the board… Trip Ledger") in hidden section 70cb4393-…-254b01ce1288; String 70cb4393-2904-ec38-1919-254b01ce12bb "Samoyed · 4 yrs · 22 countries" in hidden section …12c2 | typed | none | Hidden, not rendered. Wrong values (Magnus is 3 yrs, 13). |
| 5 | Countries Template (6a8afbda8e907b41c4da10a1) | no count element (searched "countr", "249", "195", "traveler") | n/a | page footer `ct3` C3 shows "On your map: Lived/Stayed/Layover" for this country only, from the member's tllStates, read only | OK. Only the footer 87 appears. |
| 6 | /pets (6a47adad44ed9a20a78bfce4) | Span `61ab4296-1311-f20c-9a4c-eed0c07cd78c` [data-tll-px=countries], String …d78b | **"22 COUNTRIES SUPERVISED" typed** | Page footer `tll-px-counts-v1` rewrites it to the sum of each pet page's `TLL_PET.countries` (13) once fetches finish. No-JS readers and crawlers get 22. | Pets CMS, not tllStates |
| 6b | /pets | Span `61ab4296-…-eed0c07cd788` [data-tll-px=pets] "1 PET ON THE ROSTER" | 1 | same script counts cards | CMS cards. OK |

- **Root cause of "0/2490 of 249"**: HtmlEmbed **438ddfc8-370c-4158-a39c-c1c3fc3e992b** (home, Chapter 03), line 4:
  `<p class="h3-c3-num" data-h3-pass><b data-h3-pass-n>0</b><span>/249</span><span class="h3-sr" data-h3-pass-sr>0 of 249 places counted</span></p>`
  The three inline nodes have no whitespace between them. `.h3-sr` (visually hidden, defined in embed 84f7180f-55ed-58aa-e3a0-fb2372350238, line 35) hides the third span visually, but the text is still there. Anything that reads text (reader mode, no-CSS render, crawlers and answer engines, copy and paste, the review's text dump) gets **"0/2490 of 249 places counted"**, and a screen reader hears the count twice ("0 /249 0 of 249 places counted"). The script lines 16 and 19 (`sr=document.querySelector('[data-h3-pass-sr]')`, `sr.textContent=c+' of 249 places counted'`) keep the duplicate in step. The concatenation happens in the markup, not in the count.

- **Proposed fix (minimal, no new scripts)**
  1. **Nancy decision first** (two answers):
     - (a) Rule. 87 means "every country logged, layovers included". The map, profile (pf3) and country pages (ct3) count Lived + Stayed = 85. Pick one: **A** = all logged countries, so Nancy is 87 (change `tllOwnN` in the /the-map footer, `ownN` in pf3, and the passport embed to count `lived|visited|layover`); or **B** = Lived + Stayed, so Nancy is 85 and the typed 87s become 85. Magnus: tllStates has Denmark (lived), the CMS does not. Either add Denmark to the CMS (14) or remove it from the map (13).
     - (b) Public source for logged-out pages. tllStates is private. Pick **owner-record.json** (the map's own published copy of tllStates, already loaded by Map 2.0 for logged-out visitors; refreshed by re-export), or the CMS fields (Contributors `country-count`, Pets `countries-list`) kept in step with the map.
  2. **Home passport embed 438ddfc8** (API now, unpublished: data_element_settings_tool > set_settings key `code`, static). Line 4 becomes
     `<p class="h3-c3-num" data-h3-pass role="img" aria-label="0 of 249 places counted"><b data-h3-pass-n>0</b><span>/249</span></p>`
     and in `h3-pass-js`: `sr=document.querySelector('[data-h3-pass]')`; `show()` sets `sr.setAttribute('aria-label',c+' of 249 places counted')`; `count()` uses the same rule as `tllOwnN` (all non-pet travelers; `v==='lived'||v==='visited'`, plus `'layover'` if Nancy picks rule A), and includes "XK". The text then reads "0/249" everywhere.
  3. **Home page footer freeform, script 1 `__tllLiveCounts`** (API now: data_scripts_tool > set_page_freeform_code, footer, on 69d6145df421c777840c1e46). Delete this block (the other three scripts stay as they are). Today it writes nothing except the footer hijack, and it uses the wrong rule and 195.
  4. **Contributors Template page footer, script 1 ("live stats binder")** (API now: set_page_freeform_code footer on 6a0b29c8a7b1840afe9390ab). Delete it. pf3 (`tll-pf3-profile-js-v1`) already does the owner-only swap with the right rule. If continents must stay member-computed, scope the binder to `[data-tll-prof="stat"]` inside `main` instead of every leaf on the page.
  5. **Footer (propose only, Nancy present):** add `data-tll-count="owner-countries"` to Strong 710ff458-…-1457c and `data-tll-count="owner-pets"` to …14586. Extend the existing site head script `tll-live-stories-v1` (site freeform head; no new registered script) with one fetch of the chosen public source, cached in sessionStorage like `tllStoryN`. It fills `[data-tll-count="owner-countries"]` with the agreed rule and leaves the typed number for no-JS readers. The same attribute then goes on /about's three 87s.
  6. **/pets** (API now): set_text on 61ab4296-1311-f20c-9a4c-eed0c07cd78b to "COUNTRIES SUPERVISED" (no typed number; `tll-px-counts-v1` `finish()` always writes `N COUNTRIES SUPERVISED`). It stays CMS-sourced unless Nancy picks owner-record in 1(b).
  7. **Home Chapter 05 (a4c1009d) and /pets** read the Pets CMS list. Once 1(a) settles Denmark, the CMS list and tllStates agree, so no code change is needed.
  8. **/signup** (API now): leave d8aa44e7-…-f859 hidden, or remove it (typed "9 Countries" is wrong if ever shown). account-auth-3.0 U1 already plans it hidden.
  9. Hidden template leftovers (a83eaf6e…, 70cb4393…12bb, home 77240a57…5c3): no visible effect; remove in the Designer when convenient.
- **Who can do it:** Nancy decision needed: rule (85 or 87; Magnus 13 or 14) and public source. Then API now (unpublished edit) for 2, 3, 4, 6 and 8. Nancy present for the footer (5). Extending `tll-live-stories-v1` edits site-wide head code, so it is Nancy's approval too.
- **What could break:** deleting `__tllLiveCounts` also drops its `#tll-map-counter` writes, but home has no such element (checked). Deleting the Contributors binder drops member-computed "continents"; pf3 locks n-countries and n-continents from the CMS anyway. Changing the rule in `tllOwnN` moves the /the-map hero counter, the share cards and the passport together, which is the point; screenshots and share cards already made would differ. owner-record.json is a snapshot: it must be re-exported when Nancy logs a country, or the footer goes stale.

---

### Item 5: /submit (6a0d5e5eb7804d3a750dc266)

- **Status: STILL BROKEN** (not started). A new visitor meets a sign-in wall before any field, and the form has 10 required inputs.

- **Evidence: the wall.** It is Memberstack content gating, not a redirect (data-ms-* noted, no change proposed):
  - Hero: Block `6e7c71bb-531f-f315-2f06-51b710bc545c` `data-ms-content="members"` (nav + dark hero) and Block `6e7c71bb-…-51b710bc546d` `data-ms-content="anonymous"` (empty).
  - Form: Block `410fe31c-0208-fa02-297c-3b2122ab7d40` `data-ms-content="members"` wraps the whole form section. Block `410fe31c-…-7d51` `data-ms-content="anonymous"` shows "· Share your story ·" / "Sign in to *write your trip*." / "Free to join, free to publish. A human reviews every submission within 48 hours." with buttons "Log in" (/login) and "Join the Travelers" (/signup).
  - Page script `tllgateflashv1` 1.0.0 (header, hosted; body not fetchable). STATUS says it "does not hold" on /account.
  - The FormForm carries `data-ms-member-bound="true"`.
- **Evidence: the form.** FormWrapper `410fe31c-0208-fa02-297c-3b2122ab7d36`, form name **"Html Form"**, method get, enctype multipart, no action, so it posts to **Webflow form submissions** (not a Memberstack form, no webhook visible in Designer settings; site form webhooks not checked). It is under site-wide Turnstile. FormForm `…7d37` `data-tll-form="submit-story"`. Required (*) inputs as rendered:

| Step (tll-form-steps-js-v2) | Fieldset / label | name | Req |
|---|---|---|---|
| 1 "Set the scene" | Country | country | * |
| 1 | City or layover | city | |
| 1 | When did you travel? ("Optional.") | trip-when | |
| 1 (hidden, visibility false) | "This is some text inside of a div block." ×2 | Field 4, Field 3 | * (not rendered if visibility:false drops them; delete anyway) |
| 1 "The story" | Headline | name | * |
| 1 | Excerpt ("240 characters max.") | excerpt | * |
| 1 | Body | body | * |
| 2 "The details" | Region (select #story-region) | region | * |
| 2 | Reading time (min) | reading-time | |
| 2 | "Which lens does it file under? Pick up to 3." 5 checkboxes (values salty-air, wild-routes, alpine-escape, desert-glow, sunset-mode, which do not match the pillar labels) | theme[] | |
| 2 | Sensory anchors ("Three minimum") | sensory-anchors | |
| 2 | Pets along? | pets-along | |
| 2 embed f12d8018 | Pet-friendly notes (shown when a pet is tagged) | pet-notes | |
| 2 embed 841089e3 "Other perspectives" | Who was with you? / Is a story from this trip already on the site? / hidden trip-code / invite link | co-travelers, same-trip-as, trip-code | |
| 2 embed 76d2ca29 "Shout-outs" | checkbox + up to 5 rows (name, type, city, link, affiliate, comped) | shoutouts, shout-N-* | |
| 2 "The hook" | Pull quote | pull-quote | |
| 2 | Reader question | reader-question | * |
| 2 "Sign off" | Sign-off | sign-off | * |
| 2 | Hashtag set | hashtag-set | * |
| 2 sponsor box dd10868e-… | "This story involves sponsorship, hosted travel, or a gifted stay" / Sponsored by / What should the disclosure line say? | sponsored, affiliation, disclosure-line | |
| 3 "Your credit and links & affiliation" | How should we credit you? (Named default / Pen name / Anonymous Traveler) | credit-mode | (default set) |
| 3 | Website / Instagram | credit-website, credit-instagram | |
| 3 "Editorial preferences" | Syndication ×3 | syndication-newsletter/-social/-press | |
| 3 | Dates on your story ×3 (plus a hidden "Checkbox 2") | show-posted-date, show-traveled-date, show-edited-date | |
| 3 embed f8aefc70 "The Layover Lounge" | lounge-photo, lounge-photo-pick, lounge-photo-place, lounge-caption | | |
| 3 "Photos" | Hero image (file) | hero-image | * |
| 3 | Photo gallery (up to 12) | photo-gallery | |
| 3 | "These are my words and my photos…" | agree-charter | * |

  Required and rendered: **10** (country, name, excerpt, body, region, reader-question, sign-off, hashtag-set, hero-image, agree-charter), plus the wall. A brand-new email signup adds 5 more (first-name, email, password, charter checkbox, age-16), so **15** inputs before a first story; the Google path is 10 plus OAuth.
- **Evidence: text.**
  - "About 10 fields total" = String `aa7e912f-4751-bc1f-aee6-8556ba6b44b8`: "About 10 fields total. Reviewed by a human, usually within 48 hours. Phone photos welcome."
  - **"Pre-launch" is not on /submit.** It is on /signup: String `d8aa44e7-c49a-d2c7-7ab8-f5d9fb2ef85e` "Welcome aboard · Pre-launch" (luggage tag). Searched /submit, /signup, home.
  - Success `410fe31c-…-7d3a`: "It's with the editor. Nancy reads it. You'll hear back within 48 hours at the email on your account. Questions meanwhile: hello@thatlayover.life. Your draft stays on your shelf either way." ("shelf").
  - Error `…7d3d`: "That did not file. Your words are still here, so nothing is lost. Check the country, the title and the story itself, then send again. Still stuck? Email hello@thatlayover.life and we will take it by hand." (on voice).
  - Link-out form (Block `51b9abee-68eb-6095-9a21-24484793e25c`, form "Link-out story", inputs external-url*, field-5* (Title), country*, summary*, gated): success "Got it. Same light pass…" `…e258`, error "That did not send…" `…e25b`.
  - The fork already exists: "Two ways to file" `db792b8d-0563-5847-6bab-bf221a701e95`, "Write it here" (…e8a) / "Link to it" (…e8f, sub "Already published elsewhere? Point the card at it. TLL never copies the work."). It sits inside the members-only gate.
  - Banned words on the page: "ledger" in `db792b8d-…-bf221a701e8c` ("Photos, route, ledger, the works.") and `e3fa17a2-adfd-42ef-da55-6b45cc4a6b58` ("…in the story ledger. Untick and the ledger stays quiet about it."); "shelf" in the success message.
  - Disclosure: sponsor box labels and the shout-outs note ("Those links open with rel=\"sponsored\"… FTC Endorsement Guides (16 CFR Part 255)") are present. The rel itself is rendered on the story template, not checked here.
- **Evidence: scripts on the page.** Header page script `tllgateflashv1`. Page head `tll-share-fork-js-v1` (fork show/hide, `?mode=link`, adds https://). Page footer `tll-form-steps-js-v2`: three steps (LABELS 1 "The story", 2 "The details", 3 "Credit & photos"), per-step validation, sponsor toggle, **autosave every 20 s to localStorage `tllStoryDraft` and to member JSON**, restore on load, prefill website and Instagram. Embed f8aefc70: `tll-story-extras-js-v1` (trip code and invite, pet notes, shout-outs, Lounge). Site-wide: tllformcontrolsv3, tllformlabelsv1, Turnstile.

- **Proposed fix: minimal restructure plan.** This is a layout and flow change. **It needs Nancy's approval of a change log before building.**
  1. **Write first:** take the form out of the members-only gate and show the anonymous wall only at the last step. This is a Memberstack gating change (`data-ms-content` on 410fe31c…7d40, …7d51 and the hero pair), so it is Nancy in the Designer. The existing `tllStoryDraft` autosave already keeps text across a sign-up round trip.
  2. **Sign up at the end, Google first:** step 3 ends with "Continue with Google" (Memberstack provider button, as on /signup) and then email. The photo is a file input and does not survive a page reload, so ask for the photo after sign-in, or confirm that the Memberstack modal does not reload.
  3. **Three steps** by re-tagging the fieldsets' `data-tll-step` (plain attributes, API) and moving elements (API move_element):
     - Step 1, place and date: country*, trip-when.
     - Step 2, headline, story, one photo: name*, body*, hero-image*.
     - Step 3, byline and consent: credit-mode (default Named), agree-charter*, then sign-up.
     - Everything else goes into one collapsed "More options" fieldset: city, excerpt, region, reading time, lenses, sensory anchors, pets and pet notes, perspectives, shout-outs, hook, sign-off, hashtags, links, syndication, dates, Lounge, gallery. The sponsor box stays visible in step 3 with its labels (disclosure must not hide).
  4. **Compute region and reading time** in `tll-form-steps-js-v2` (an edit to an existing script, no new one): region from the country (the region map already exists in ct3 and destinations scripts), reading time = ceil(body words / 230).
  5. **"Link a story you already published"** as an equal first choice: rename `db792b8d-…-e8f` "Link to it" to "Link a story you already published", and make the fork visible to logged-out visitors (moved out of the gate).
  6. Required after the change: **country, headline, body, hero photo, agree-charter = 5**, plus sign-in at the end (Google = 1 click; email = name, email, password, age-16). That meets "7 or fewer" for the Google path; the email path is 5 plus 4 or 5 sign-up inputs, so the done criterion needs Nancy to say whether sign-up inputs count.
  7. Update step labels in `LABELS`/`NEXT` to "Place and date", "Headline, story, photo", "Byline and consent".
- **Small safe edits now (API, unpublished):**
  - /signup `d8aa44e7-…-f85e`: "Welcome aboard · Pre-launch" to "Welcome aboard".
  - Success `410fe31c-…-7d3a`: "…Your draft stays on your shelf either way." to "…Your draft stays in your account either way."
  - `db792b8d-…-e8c`: "The full story lives on TLL. Photos, route, the trip details, the works." `e3fa17a2-…-58`: "Your call. Tick what readers may see on your story. Untick and it stays off the page."
  - `db792b8d-…-e8f`: "Link a story you already published".
  - Mark optional (Designer "Required" off; the API exposes `input.isRequired` read-only in element data, so if set_settings cannot write it, Nancy in Designer): excerpt, region, reader-question, sign-off, hashtag-set. That leaves 5 required + the wall. Then `aa7e912f-…-b8` becomes "Five things are required, the rest is optional. Reviewed by a human, usually within 48 hours. Phone photos welcome." Do not change this text before the required flags change, or it is wrong. Today 10 is accurate.
  - Delete hidden junk fields Field 4 (`bc7df393-…-873b`), Field 3 (`da364d82-…-09ed`) and "Checkbox 2" (`e951626e-…-7af7`) (Designer).
- **Who can do it:** API now for the text edits above. Nancy decision needed: approve the restructure change log, and say whether sign-up inputs count toward 7. Nancy in Designer for the Memberstack gate move and Google button (data-ms-*), and for the Required flags if the API cannot write them.
- **What could break:** making region optional leaves the /stories place chips without a value until the editor sets it (or until the computed region lands). Moving the gate exposes the form to bots; Turnstile stays on. Renaming the form "Html Form" would split Webflow submission history and any filter keyed on the form name (do not rename without checking). Moving fieldsets changes `tll-form-steps-js-v2` grouping; the script needs at least one `[data-tll-step=1]` and `[=3]` or it exits. File input is lost on a full-page sign-up reload.

---

### Item 6: Home first screen (69d6145df421c777840c1e46)

- **Status: STILL BROKEN.** No free line under the headline, four hero buttons, "real names" visible, "The shelf." and its interlude caption unchanged, and search states still carry newsletter copy.

- **Evidence: hero** (wrapper Block `300047e7-de75-7f9c-7045-af42c0caff72`, `data-h3-hero="1"`):
  - Image `2a95bf83-46fd-a265-7610-7f13b2eb4e29` (Curaçao photo, eager).
  - Eyebrow String `300047e7-…-caff63` "Travel stories by people who were there".
  - H1 `300047e7-…-caff69`: "Find your next " + em "somewhere" + "." (Strings …ff65, …ff66, …ff68).
  - Paragraph `300047e7-…-caff6b`, String **`300047e7-de75-7f9c-7045-af42c0caff6a`: "Real places, real opinions, real names. Shared by people who went."** ("real names").
  - Hidden old CTA block `…caff70` ("Read the library →" /stories, "Share your story" /submit), visibility false.
  - **HtmlEmbed `13326a8e-ee2a-0bbe-668e-17503f7c5d9b`, the four buttons:** "Read the stories →" /stories (rose), "Send your trip" /submit, "Send a photo" /share-photos, "Build your map" /the-map.
  - HtmlEmbed `de5cdec9-8d8c-cd54-c07e-049b45632a9e`: side line "A travel magazine for people who get lost on purpose", coordinates "12.17° N 68.99° W Curaçao", "Scroll · the world is long", and CSS `h3-hero-coords-v2` (reserves 44px under `.h3-hero-cta` on phones).
- **Evidence: Chapter 02** = HtmlEmbed `a0d1cd97-fcc5-139e-f50f-1b1294a5e5ef` ("Chapter 02 · The community engine", "You went. *Write it down.*"). It **already has** "Send your trip →" (/submit) and "Send a photo" (/share-photos) plus the note "Free to join". So moving the contribution buttons means removing them from the hero only.
- **Evidence: the free lines** (conflict to report):
  - The requested line "Free, forever. No card, no paywall." is not on the site.
  - The protected line **"Free to join. We're not a gym." does not appear verbatim anywhere live** that was checked. Near-misses:
    - /signup lede String `4bfaf0ff-1f22-76be-cd80-49a08d1eba3a`: "…Free, forever. We're not a gym."
    - /signup eyebrow `d8aa44e7-…-f83d`: "· Free to join · Always ·"
    - Home Chapter 02 note (a0d1cd97): "Free to join"
    - Home Chapter 04 map message (embed 405baa84-b88f-64fd-3fcd-a1c81d3ac553, h3-map-js line 48): "This is your map once you join. Free to join. Start your map →"
    - /submit wall `8e210bd2-…`: "Free to join, free to publish."
  - The footer component has no "Free" text.
- **Evidence: "The shelf"** (all in HtmlEmbed **`94ce12c0-56fc-4b10-fa9f-14da000634c7`** unless noted):
  - line 5: `aria-label="Filter the shelf by pillar"`
  - line 10: eyebrow "Chapter 01 · Already on the shelf", h2 `#h3-shelf-t` **"The shelf."**
  - line 12: "<N> stories · Keep scrolling, the shelf moves sideways"
  - script `h3-shelf-js`: "Swipe, the shelf moves sideways" / "Keep scrolling, the shelf moves sideways" (lines 55 and 56, function `size()`)
  - The same embed's intro is the protected "Trips that can't wait for *payday.*" (typed with a curly ’ in "can’t").
  - Interlude caption, HtmlEmbed **`8d306efc-d927-7aa8-0a61-dda177a79aae`**: `<figcaption>From the shelf · Brazil</figcaption>`.
  - Hidden, not rendered: `e646451a-68a7-b183-3a52-6da4762de1e6` "Already on the shelf · Explore the stories"; `9c10ff57-…-0373` "One writer so far. Room on the shelf for".
  - Also "shelf" on /profile `3546d9b1-c283-bfa2-1314-a6fa0162bc82` ("Your shelf inside the library…") and the /signup success `d8aa44e7-…-f88d` ("…come find your shelf."), outside this item.
- **Evidence: search and newsletter states.**
  - Search section `#tll-shelf` (Section `e646451a-68a7-b183-3a52-6da4762de20c`, aria-labelledby `h3-search-t`). Head embed d3ac79f6 "Search it". Form `c618aa80-…-9ff2`, input `#Search-the-library`, routed to /stories by the home footer "search routing v2" script.
  - Its **success message `c618aa80-c5fc-05d8-1a40-9ccfa36c9ff5` is newsletter copy**: "Check your inbox. One click to confirm, and you will hear the day the doors open. Nothing else, ever." Error `…9ff8`: "That did not go through. Try once more, or email hello@thatlayover.life."
  - The newsletter section (`3ab123c7-422b-4e6a-d361-a79ad928fa79`, "Chapter 07 · The newsletter", the protected "Your inbox deserves *better than deals.*") has its own correct states: success `…fa74` "You're on the list. It lands when a story earns it. Unsubscribe anywhere.", error `…fa77`.

- **Proposed exact edits**

| # | Change | Where | API action | Safe now? |
|---|---|---|---|---|
| 1 | "Real places, real opinions, real names. Shared by people who went." → "Real places and real opinions, shared by the people who went." | String 300047e7-…-caff6a | data_element_tool set_text | **Yes, API now** |
| 2 | Free line under the headline. **Option A (as briefed):** "Free, forever. No card, no paywall." **Option B (uses the protected line verbatim):** "Free to join. We're not a gym. No card, no paywall." Insert as the first child of the hero CTA embed: `<p class="h3-hero-free">…</p>` above the buttons, so it sits under H1 + lede. | HtmlEmbed 13326a8e | set_settings key `code` (static) | API now once Nancy picks A or B |
| 3 | Two buttons only: `<a class="h3-btn h3-btn-rose" href="/stories">Read the stories →</a><a class="h3-btn h3-btn-line" href="/the-map">Build your free map</a>`. Remove "Send your trip" and "Send a photo". | HtmlEmbed 13326a8e | set_settings `code` | **Yes, API now** (Chapter 02 already carries both) |
| 4 | Rename "The shelf." **Option 1:** h2 "Just filed." / eyebrow "Chapter 01 · Fresh from the road" / caption "Just filed · Brazil". **Option 2:** h2 "The reading list." / eyebrow "Chapter 01 · Start reading" / caption "On the reading list · Brazil". In both: aria-label "Filter the stories by pillar"; hints "Keep scrolling, the stories move sideways" / "Swipe, the stories move sideways". | Embed 94ce12c0 (lines 5, 10, 12, 55, 56) + embed 8d306efc figcaption | set_settings `code` on both | API now once Nancy picks 1 or 2. Keep "Trips that can’t wait for payday." untouched (the straight-apostrophe question is Nancy's). |
| 5 | Search success `c618aa80-…-9ff5` → "Taking you to the stories." Error `…9ff8` → "That search did not run. Try again, or browse every story on the Stories page." | Strings c618aa80-…-9ff5 / …9ff8 | set_text | **Yes, API now** (the routed search never shows them in normal use) |
| 6 | Hidden leftovers with "shelf" (e646451a…de1e6, 9c10ff57…0373) | Designer | remove or set_text | optional |
| 7 | Phone check: after (2) and (3), `h3-hero-coords-v2` still reserves 44px under `.h3-hero-cta`; with two buttons the row fits one line at 390px. Confirm at 390x844 and 1440x900 after publish (cannot verify from data). | | | Nancy check |

- **Who can do it:** API now (unpublished) for 1, 3 and 5. Nancy decision needed: free line A or B (A is the brief; B keeps the protected line; the protected line is otherwise nowhere live, and account-auth U2 plans to put it on /signup), and the shelf rename option 1 or 2. Then API now for 2 and 4.
- **What could break:** `h3-shelf-js` reads `[data-h3-shelf]`, `[data-h3-n]`, `[data-h3-hint]` and `[data-h3-chips]`. Keep those attributes when editing the embed's text, and edit the two hint strings inside the script too, or the old wording comes back on resize. `tll-live-stories-v1` and `tll_home_story_counter` match "N stories" patterns; the shelf note keeps "<N> stories ·". The section id `tll-shelf` is an anchor used by search CSS (`#tll-shelf`); leave the id. Removing hero buttons removes the hero's only /submit and /share-photos links; Chapter 02 keeps both.
