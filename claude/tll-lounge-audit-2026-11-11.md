# Layover Lounge everywhere + Get featured: audit report (11 Nov 2026)

For Nancy. This is the report your prompt asks for before any schema change (`claude/tll-lounge-everywhere-prompt-2026-11-11.md`, Phase 1 step 1).

This audit was read only. Nothing was changed in Webflow, the CMS or any form, and this build has published, posted and emailed nothing. The first two sections are all you need to read today. Everything after them is reference.

## 1. Short version

**What exists**

- The Lounge (/gallery) is 17 photos typed into the page by hand, all yours. None is in the CMS. None has a caption, alt text, a year or a link. They weigh 7.9 MB and all load at once.
- An empty photo collection already exists ("Photo submissions"). The site is at Webflow's cap of 40 collections, so the plan turns that one into Photos. No new collection.
- /share-photos works and removes location data in the member's browser before upload.
- Outside the footer, only home links to the Lounge. The map is not run from the CMS, so that item is a write-up (section 12).

**What is unsafe, and what is being done**

1. Since 13:28 UTC today a member's photo goes public at once, with no review, while the page says a person looks first. Nobody has sent one yet. A hold is built and in review now: site code first, then a Worker fix that you deploy. Not live yet. Your notes: `handoff/PHOTO-HOLD-2026-11-11.md`.
2. Children with clear faces are on public pages: your Ghana photo (19 pages) and one Vietnam story gallery (1 page). Your call, below.
3. Two consent boxes on /share-photos arrive already ticked. Only the Designer can turn that off. The Worker fix records no social permission until then.
4. Location data is removed only in the member's browser. The Worker fix accepts files from our own Cloudinary folder only. The rest needs ten minutes in your Cloudinary console.
5. A member who chose to stay anonymous would get their name in the photo's web address. Fixed in the same Worker fix.

**Already done today**

- "Par avion" is gone. www was published at 17:07 UTC with site code 16.58.0, and the home postcards read "Greetings from {place}".
- The Location Expert form rename is live.

**What you must decide first**

Seven things, next section: the Worker deploy, the Ghana photo, the Vietnam photos, the collection, the field list, the two ticked boxes, the Cloudinary check. No field is added until the hold is live and you have said yes to the collection and the field list.

## 2. Decide first

1. **Will you deploy the Worker fix for the photo hold once its review has passed?**
   Why: it is the fix for the unreviewed publishing. Member photos are saved as drafts for you, no member name goes into a web address, and the old Lounge feed answers empty. This session cannot deploy a Worker; you can, with one command on your Mac. The steps, the check afterward and the way back are in `handoff/PHOTO-HOLD-2026-11-11.md`. Its independent review is still running, so wait for the lock log line "photo hold review passed".
   Recommended: yes, the same day that line appears. All collection work waits for it. Until then, please do not add fields to the collection or rename it.

2. **The Ghana photo shows three children with clear faces. Replace it everywhere?**
   Why: your rule is no recognizable children's faces on public pages. The photo is served on 19 public pages: home, /gallery, /stories, the Ghana story (as its main photo), four other stories, /countries/ghana, /destinations and nine traveler profile pages. Its alt text is also wrong (it describes a market).
   Recommended: yes. I list frames from the Ghana story's own gallery with no child in them, you pick one, I replace it in every place, and I crawl the site again until the count is 0.

3. **The Vietnam "Noodle Week" story gallery has two photos of children. Take them out?**
   Why: photo 13 is a group of about ten schoolchildren facing the camera. Photo 17 is one child with the face partly visible. Both are on 1 public page, the story itself.
   Recommended: yes, remove both from the gallery. Nothing else on the page changes.

4. **OK to turn the empty "Photo submissions" collection into Photos, with you renaming it (name Photos, address /photos) in the Designer?**
   Why: at 40 of 40 collections a new one would mean deleting another. This one is empty, and many of the fields the build needs are already in it. My tools cannot rename a collection; you can.
   Recommended: yes, and rename before the first photo is published, because photo addresses follow the name.

5. **Do you approve the field list in section 6 as written?**
   Why: it differs from your prompt in three places, and choice lists cannot be edited by my tools once created. (a) The country link points to Countries, not Destinations, because /countries pages are the ones search engines may list and /destinations pages are hidden from search. (b) The status choices read Waiting, Approved, Hidden, because the CMS has its own "Draft" state and one word with two meanings invites a wrong click. (c) Continent is one choice per photo, and the three themed shelves (Pets on the road, Airports, Layover Awards) are on/off switches, because a Shelves collection is not possible at the cap.
   Recommended: yes to all three.

6. **Will you turn off "Start checked" on two boxes on /share-photos in the Designer?**
   Why: "On our Instagram and LinkedIn" and "On the homepage" arrive ticked, so a member who touches nothing has "agreed". The page text and the legal draft both say unticked. My tools cannot see or change that setting.
   Recommended: yes, with me in the session. It is one setting per box. If you prefer, I rebuild the two boxes instead. "Feature me on TLL's socials" cannot be built on a box that ticks itself.

7. **Can we do a ten minute Cloudinary console check together before the first member photo is approved?**
   Why: only you can read it. Three things: how the upload preset `tll_photos` is set (today anyone who knows its name can upload to it; whether it strips location data on arrival; formats; size cap); whether the originals uploaded between 19 and 23 Oct were deleted; and limiting "fetch" to the Webflow asset host.
   Recommended: yes, early. Building can start without it, but no member photo goes public before it.

## 3. The rest of the questions

None of these blocks the start. "Blocks" says what waits for each answer.

| # | Question | Recommended | Blocks |
|---|---|---|---|
| R1 | May I record your own permission on your Lounge photos, dated the day you say yes, and publish them as CMS items once you have filled the sheet in section 7? | Yes. Photos without alt text stay out until they have it. | Every photo surface |
| R2 | Delete six fields in the collection that nothing has ever written to? (Cannot be undone; the collection is empty.) | Yes | Nothing; it frees room |
| R3 | Nav label: "Photos", "The Lounge" or "Layover Lounge"? And should the footer link (today "The Layover Lounge") match? | "Photos" in the nav, the footer keeps the full name. I bring screenshots of all three at five widths. | Nav, done with you present |
| R4 | How long does photo review take? One number you can keep in your busiest week. | Yours to set. A starting point if you want one: within 7 days. | "How featuring works", the done message |
| R5 | How often do you feature a photo? | 2 a week to start, no fixed days printed on the site | Feature routine wording |
| R6 | Which accounts does "Feature me on TLL's socials" mean? The box today says Instagram and LinkedIn. | Instagram only to start. TikTok handles are accepted for a tag credit, with no promise of a TikTok post. | Box label, credit list, caption format |
| R7 | Pet feature day: yes or no? | Not yet. Start when Pets on the road holds eight approved photos. | Nothing |
| R8 | The feature queue: a Notion page or a view inside Webflow? | Notion, next to your TLL To Do List. The CMS stays the record. | Phase 4 steps 1 and 3 |
| R9 | One permission box with your text, or the three promises ticked one by one as today? | One box, once the wording is back from the check. The build accepts either. | The form going live |
| R10 | Does the required tick already allow social posts, or only the "Feature me" box? | The required tick covers the site and The Layover Letter. Socials only when "Feature me" is ticked. | The permission wording and its version |
| R11 | Which credit is the default when "Feature me" is not ticked? (Collab only exists on Instagram.) | Name only. Collab becomes the default when "Feature me" is ticked. | The form |
| R12 | May a photo with a recognizable child ever show when the parent or guardian sent it? Your privacy rule and your house rule disagree. | Held by default. It shows only when you pass that one photo yourself. | Children box wording |
| R13 | Two story photos show children from behind, no face (Noodle Week photo 14, Ninja Duckies photo 10). Keep them? | Keep. Your call. | Nothing |
| R14 | Takedown promise: "Email us and it's gone", or a time you can keep? | "Email hello@thatlayover.life and we take it off the site within 7 days." | "How featuring works" |
| R15 | A business photo of its own product: label it or decline it? Two label wordings exist in your documents. | Decline through this form and point to /for-brands. No ad label in the Lounge for now. | One house rule line |
| R16 | If a member picks "Initials only" or "No credit", may the photo still show on their public profile? | No. Profile grid only for Collab, tag and name credits. Your own stay on yours as "NC". | Profile grid, /travelers card |
| R17 | "Name" and "Initials" credits: use the byline name each member already set on their profile (full, first or pen name)? Then "Pen name only" can leave the form, because the pen name lives on the profile. | Yes to both | Credit choice on the form |
| R18 | A member whose profile is Unlisted or Off: no photo grid and no profile link from their photos? | Yes. Grid and link only for Public profiles and public pets. | Profile grid, photo page |
| R19 | When someone asks to be featured: one photo per send, or up to 30 as today? | One photo per send when "Feature me" is ticked. Up to 30 otherwise. | Form rules |
| R20 | The story page already calls its own gallery "From the trip". What should the new strip be called, and should it show when its only photo is the story's main photo? | "Also in the Lounge". Show the strip only from two photos up. | Story strip going live |
| R21 | On home, should the Lounge sit before or after the "Layover guides" row? | After. The preview shows both. | Final placement only |
| R22 | Two of the five home postcards are not Lounge photos today (the Rio Negro riverboats and King George Island). Add both to your sheet, or let the home row change? Your prompt says "featured first"; with fewer than five featured photos the row would be shorter. | Add both to the sheet, and mark at least five photos Featured. | Home row |
| R23 | The map: may a click on a pin open a small preview instead of jumping straight to the story? | Yes, after you read section 12. Built last. | Map |
| R24 | Alt text is required. May I draft it per photo for you to confirm, in place of asking members to write it? | Yes | Whether the form gets one more field |
| R25 | "Photo of the week" has a switch but no place on the site. Where should it show? | First tile on /gallery with a small stamp, and top of the feature queue | Nothing |
| R26 | Live locations: should the form say in words that the trip is over? | One house rule line plus a line on your review checklist (trip over, no plans in the caption). No extra box. | House rules |
| R27 | Seed list (section 8): yes or no on each of the ten picks, and one or two per story? | Your call per photo | Phase 5 |
| R28 | Two story photos sit in each other's story with each other's alt text (Ninja Duckies photo 1, Monkeys in Sweaters photo 23). Swap them back? | Yes | Nothing |
| R29 | Your prompt names the upload script `tll_photo_upload_v1`. That one was retired on 23 Oct because it uploaded originals with location data. Keep its replacement, `tllphotosendv1`? | Yes | Nothing |
| R30 | Are the public copies of the three design skills the ones you mean (section 10)? | Tell me, and which Taste version | Design pass |

## 4. The collection budget (one shared limit)

- The site holds 40 CMS collections. That is Webflow's cap. Nobody can create one.
- This build needs 0 new collections. Photos is the empty "Photo submissions" collection, extended.
- Two other prompts you pasted today ask for seven more: Guides; and Move Guides, Move Steps, Expat Resources, Expat Groups, Events, Expat Creators.
- Those plans are being reworked around collections that already exist. An empty "Expat Groups" collection and a "Resources" collection are already there. Sixteen collections hold 0 items, but several are wired to pages or the Worker, so freeing one is a decision for you, one at a time.
- The lock log now tells every session that no collection can be created.

## 5. The corrected plan by phase

An independent review found eight things to fix in the first plan. All are folded in here. The biggest: the hold must be live before any field is added; approving your photos must not change the live /gallery early; and two things only you can do in the Designer.

**How anything stays out of sight until you approve it.** Every new block is built hidden with a style that travels with the page itself, so any session's publish is safe. A preview flag (`?preview=photos`) only reveals. Each block is checked on the test site with scripts off. Nav changes and each go-live are done in one sitting with you.

**The order**

| Step | What | When |
|---|---|---|
| 0 | No Webflow write: speed, accessibility and screenshot baselines; nav screenshots with all three labels; the map write-up; caption format and "You're live" email draft; the seed list | Now |
| A | The photo hold: site code part with the next site code release, Worker part deployed by you. From then on the old Lounge feed answers empty for good | Built, in review; Decide first 1 |
| A2 | Form safety: four hidden required inputs made harmless (I stage it); the two ticked boxes (you, Decide first 6); children photos on your answers, then a crawl check; lighter image files on /gallery meanwhile (optional) | After A |
| B | The library: fields added, you rename, one test publish of one of your own photos, Worker v2, your 17 created as CMS drafts with the review sheet | After A is live and Decide first 4 and 5 |
| C | The photo page, built hidden. Your photos are published only after B is complete. The hide is lifted on your word | After B and your sheet |
| D | /gallery itself, together with the Lounge postcards session. One go-live | After C |
| E | "Get featured" on /share-photos, built hidden. A signed-in test. Go-live only with the checked permission wording and its version | After Worker v2 |
| F | The other surfaces, one at a time: story strip, profile and pet grids, paw strip, home, /travelers | After C |
| G | Nav, and the footer label, with you present | After D is live |
| H | The map, on your yes | After D |
| I | Feature routine | After E |
| J | Seed photos, each on your yes | Any time after B |
| K | Cleanup: retired fields deleted on your yes; final speed, accessibility and screenshot checks; the list for you | Last |

**Phase 0: safety first**

| Item | Build now? | Waits on |
|---|---|---|
| Baselines (Lighthouse mobile on home, /gallery, one story, one profile, /the-map; axe on every template touched; screenshots at 1440 and 390) | Yes, read only. Not run yet | Nothing |
| Photo hold | Built and tested, in review | The review passing, then your deploy |
| Four hidden required inputs on /share-photos (one visibility flip would bring back today's "Field 2" error) | Yes, staged and safe to publish | A scope line in the lock log |
| Two ticked boxes | No | You, in the Designer |
| Ghana photo and Noodle Week photos | No | Decide first 2 and 3 |
| "Par avion" | Done. Live on www since 17:07 UTC | Nothing |

**Phase 1: one Photos collection**

| Item | Build now? | Waits on |
|---|---|---|
| 1.1 Audit and report | This document | Nothing |
| 1.2 Add 21 fields (section 6), one at a time, each read back. Then you rename. Then one test publish of one of your own photos; after a structure change Webflow may ask for a full www publish first, which would be booked in the lock log | No | The hold being live; Decide first 4 and 5; R2 is optional |
| 1.3 Your 17 photos, plus the two home postcards if you agree, created as CMS drafts from what the tiles say. Captions, alt text, cities, years and permission stay empty for your sheet. The Ghana item is created Hidden with no image | Right after 1.2 | Your sheet and R1 for approval |
| 1.4 The public gate, and Worker v2 | Code and tests after 1.2 | Your deploy; R12, R16, R17, R18 change a few lines |

The gate, in plain words. All five parts are needed.

1. The CMS draft state is the lock. Every submission is created as a CMS draft. A draft has no page, is in no list and is not in the sitemap. Only your approval publishes a photo. Takedown is one click: Unpublish.
2. Every public list carries the same filter: status Approved, owner permission on, children check passed, no removal request, alt text present.
3. The photo page shows its image only when the same five rules pass. Otherwise it says "This photo is not available".
4. Every 30 minutes the Worker checks each live photo, including edits you have made that are not yet published, and unpublishes any that fail.
5. After each approval a check fetches the photo page and fails if it finds a member id, an email, or a handle when the credit choice is not Collab or Tag.

Also in Worker v2: "Name" and "Initials" use the member's byline name, never the name on the member record (the hold already credits by the byline rule). A photo gets a profile link only when that profile is Public (same for pets). A photo enters the sitemap only at approval, once photo pages are live, and leaves it on unpublish. Photos are added to the member's "Download everything" file and to account deletion.

**Phase 2: make the Lounge findable**

| Item | Build now? | Waits on |
|---|---|---|
| 2.1 Nav item between Stories and Travelers | Screenshots only. Nothing is staged in the Designer, because any publish would carry a staged nav link to 66 pages | You present; R3; /gallery live in its new state |
| 2.2 Home: Lounge section after the stories carousel, tiles from Photos, captions "Greetings from {place}" | Hidden build after five approved photos are marked Featured | R21, R22; another session's open scope on the home rows |
| 2.3 Story page strip, up to 6 photos, hidden when empty | Hidden build after 1.2 | R20 |
| 2.4 Photos grid on profile and pet pages, 3:4 tiles, pinned first; "Add your first photo" on the owner's own view. The pet owner view can be built too (the Worker already knows which pets a member owns) | Hidden build after 1.2 | R16, R18; the staged pet page layer must learn about the grid |
| 2.5 /travelers card image from each person's top photo, avatar as fallback | After 1.3 and 2.9 | R16 |
| 2.6 Map | Write-up only (section 12) | R23 |
| 2.7 /the-paw-passport strip | Hidden build after 1.2 | Pet photos existing; the staged pet layer |
| 2.8 /gallery: real captions (place, year, credit) at 12px or more, each photo a link, small story and profile links in the caption row, filters only for continents with photos, heading rewritten for viewers, "Add yours" made small, "Load more". The 17 typed tiles are hidden for some weeks, not deleted, so there is a way back | Hidden build after 1.3 | The postcards session (section 9); your heading wording; the missing 9 Oct review |
| 2.9 One page per photo: image, caption, place, year, credit, links to story, profile and country, "Want to go", search title and description, ImageObject data with the creator credit | Hidden build after 1.2 and the rename | One real approved photo to look at |

**Phase 3: "Get featured" on /share-photos**

| Item | Build now? | Waits on |
|---|---|---|
| 3.1 New fields on the existing form (platform, three more credit choices, people in the photo, children and guardian box, the permission box with its version). The upload script `tllphotosendv1` is not edited. `tll_photo_upload_v1` stays off every page | Hidden build after the hold and the ticked boxes | R6, R9, R10, R11, R17, R19; the checked wording and its version name |
| 3.2 "How featuring works": free, a free account is needed to send, reviewed first, how long, the credit options, takedown | Structure yes, text no | R4, R6, R14 |
| 3.3 House rules, including the trip being over | Yes, hidden | R12, R15, R19, R26 |
| 3.4 Submissions land in Photos as drafts with all consent fields filled | With Worker v2 | Worker v2 live before the new form is public |
| 3.5 Validation and the five states. Errors next to each field, name and email checked before the upload starts, one true done message | Yes, hidden | R4 |

**Phase 4: feature routine (no auto-posting)**

| Item | Build now? | Waits on |
|---|---|---|
| 4.1 The queue: approved, wants a feature, not yet featured, oldest first. Handles appear only for Collab or Tag credits | After 1.2 | R8 |
| 4.2 Caption draft format (moment, place and year, credit by choice, "Get featured: link in bio.") | Yes, as a written format | R6 |
| 4.3 Marking a photo featured: you fill the post URL and date; Collab status moves from there | After 1.2 | R8 |
| 4.4 "You're live" email template, draft only, nothing sent | Yes | The photo page address |
| 4.5 Monthly prompt block, edited by you in the CMS, hidden while empty | After 1.2 | Your first prompt |

**Phase 5: seed the wall.** A provisional list exists now (section 8). The 10 Nov drafts are still missing. Nothing is uploaded until you say yes.

**Not checked yet.** These are recalled Webflow behaviors, confirmed on the first item or list built: whether one photo can be published by itself right after a structure change; whether a new item enters the sitemap by default; the list filters "is off", "is set" and "equals this page's item"; conditions with several rules on one block; whether Cloudinary strips location data from resized copies. If "is off" or "is set" is not offered, the approval step and the 30 minute check enforce those two rules by unpublishing. Nothing was tested signed in.

## 6. The field list (schema)

Collection: "Photo submissions" today, "Photos" after your rename. 36 fields today, 21 new, 57 of 60 after. Minus six never-written fields if you agree (51), minus four old ones after Worker v2 (47). Nothing is marked required in the CMS itself, because drafts arrive before alt text exists; "required" is enforced at approval and in every public filter.

| Field | Slug | Type | New or existing |
|---|---|---|---|
| Photo (a sized copy: CMS thumbnail, share image, fallback) | photo | Image | Existing |
| Image source URL (Cloudinary) | image-source-url | Link | New |
| Alt text | alt-text | Plain text | New |
| Caption (one line, the member's own words) | caption | Plain text | Existing |
| Country page | country-page | Reference to Countries | New |
| Country (as text, shown when there is no country page) | country | Plain text | Existing |
| City | city | Plain text | Existing |
| Year | year | Number | Existing |
| Contributor profile | contributor-profile | Reference to Contributors | Existing |
| Pet | pet | Reference to Pets | New |
| Pet names (for pets with no page) | pet-names | Plain text | Existing |
| Contributor credit (the credit exactly as shown) | contributor-credit | Plain text | Existing |
| Credit choice | credit-choice | Option: Collab, Tag, Name, Initials, None | New |
| Social handle | social-handle | Plain text | New |
| Platform | platform | Option: Instagram, TikTok, Other | New |
| Story | story | Reference to Stories | New |
| Continent | continent | Option: Africa, Americas, Asia, Europe, Middle East, Oceania, Antarctica | New |
| Shelf pets on the road | shelf-pets-on-the-road | Switch | New |
| Shelf airports | shelf-airports | Switch | New |
| Shelf layover awards | shelf-layover-awards | Switch | New |
| Owner permission (today named "Rights confirmed") | rights-confirmed | Switch | Existing, display name changes |
| People consent confirmed | people-consent-confirmed | Switch | Existing |
| Contains children | contains-children | Switch | New |
| Guardian submitted | guardian-submitted | Switch | New |
| Children check passed (only you turn it on) | children-check-passed | Switch | New |
| Consent recorded at (permission date) | consent-recorded-at | Date and time | Existing |
| License version (wording version) | license-version | Plain text | Existing, empty today |
| Social opt-in (feature on socials requested) | social-opt-in | Switch | Existing |
| Social published at (featured date) | social-published-at | Date and time | Existing |
| Post URL | post-url | Link | New |
| Collab status | collab-status | Option: Not sent, Invited, Accepted, Declined | New |
| Featured | featured | Switch | New |
| Pinned on profile (0 to 3) | pinned-on-profile | Number | New |
| Photo of the week | photo-of-the-week | Switch | New |
| Status | status | Option: Waiting, Approved, Hidden (your prompt: Draft, Approved, Hidden) | New |
| Gallery published at (approved at; sorts "newest") | gallery-published-at | Date and time | Existing |
| Removal requested | removal-requested | Switch | Existing |
| Takedown completed at | takedown-completed-at | Date and time | Existing |
| Kept for internal use, never shown | submitted-at, batch-id, uploader-member-id, reviewer-notes, photo-reviewed-at, reviewer-id, press-interest-opt-in, press-license-approved, license-accepted | Various | Existing |
| Retired after Worker v2, on your yes | review-status, moderation-stage, credit-preference, gallery-opt-in | Various | Existing, to delete later |
| Never written, deleted first if you agree (R2) | submission-id, preferred-backlink, storage-object-key, file-mime-type, file-size-bytes, file-sha256 | Various | Existing, to delete |
| Photo prompt (in the Site settings collection, for the monthly prompt) | photo-prompt | Plain text | New |

Notes on the list:

- **Children.** "Contains children" and "Guardian submitted" record facts. "Children check passed" is the one switch the public lists read. It starts off, so a photo nobody has looked at can never show. This replaces the first plan's "Children hold" switch, which would have let an untouched photo through.
- **Names.** An item's name and web address are built from place, year and a running number, for example "Lisbon, Portugal · 2023 · no. 0042". Never a person's name.
- **Shelves.** Each extra themed shelf later costs one field.
- **Stories and Contributors are full** at 60 of 60 fields, so every link lives on the photo.
- **Images.** Webflow makes no smaller copies of CMS images on this site, so tiles ask Cloudinary for 480 and 800 pixel widths (a test tile was 71 KB at 800). A 1600 pixel copy measured 237 KB, over the 200 KB card budget, so cards never use it raw. Cloudinary can resize your existing Webflow files in place (the Laos tile came out at 47 KB at 480 wide), so your 16 files do not need to be copied anywhere.

## 7. Migration sheet for the 17 Lounge photos

What gets written from the tile alone: the continent (today's filter, including Türkiye under Europe and Qatar under Middle East), the credit "NC", credit choice Initials, your profile, the country where the label is a country, and the story link for the 16 photos matched to a story by comparing the images themselves (never by place name).

What stays empty until you fill it: caption, alt text, city, year, and every permission switch. "To confirm" below means found in a file name or the matched story. It is offered, never written in.

| # | Tile label | Missing | To confirm (not written in) | Notes |
|---|---|---|---|---|
| 1 | Montenegro | Caption, alt text, city, year | None | The story's alt ("Bay of Kotor Montenegro at sunrise") could not be confirmed. It is that story's main photo. 1,209 KB |
| 2 | Vietnam | Caption, city, year | Place Ha Long Bay; the story photo's alt fits | The story says "Late 2021 to August 2022". 720 px wide, under your 1080 rule |
| 3 | Bulgaria | Caption, alt text, city, year | None | The story's alt is vague. Story main photo. Small distant figures |
| 4 | Ghana | Held | None | Children with clear faces. Created Hidden, no image, never published. See Decide first 2 |
| 5 | Qatar | Caption, city | Year 2024; the Doha story main photo's alt fits | Do not use the alt "Doha skyline at dusk"; it is wrong for this frame |
| 6 | Antarctica | Caption, city, year | The story photo's alt fits | |
| 7 | Deception Island | Caption, year, country | The story photo's alt fits | Your answer: the Antarctica country page, or no country page |
| 8 | Patagonia | Caption, city, year, country | Alt "Mount Fitz Roy, Patagonia" fits | Your answer: Chile or Argentina (the story lists both). Story main photo |
| 9 | Brazil | Caption, alt text, year | City Ubatuba (from the file name) | No story. Adults at cafe tables are visible: people consent needs your word. 1038 px wide |
| 10 | Curaçao | Caption | City Willemstad; year 2024; the alt fits | No country page exists for Curaçao. Add one (as a draft first, since it creates a public page) or show the name as text |
| 11 | USA | Caption | City Miami Beach; year 2024 | The matched story is the Texas eclipse story. Confirm the year and that this link is right |
| 12 | Chile | Caption | City Santiago; year 2023; the alt fits | |
| 13 | Portugal | Caption | City Lisbon; year 2023; the alt fits | |
| 14 | Singapore | Caption, city, year | The alt fits | Its story is listed under Thailand. Confirm the country page is Singapore |
| 15 | France | Caption | City Verzenay; year 2022; the alt fits | |
| 16 | Türkiye | Caption | City Istanbul; year 2022; the alt fits | Stays under the Europe filter |
| 17 | Laos | Caption | City Vientiane; year 2022; the alt fits | Small distant figures |
| 18 | Home postcard: Rio Negro riverboats | Everything | None | Not a Lounge tile today. See R22 |
| 19 | Home postcard: King George Island | Everything | None | Not a Lounge tile today. See R22 |

- Every one of the 17 is missing a caption and a permission record. Eight have no year anywhere: 1, 3, 4, 6, 7, 8, 9, 14.
- Dates inside five of the files look like export dates and are not used. No file carries location data.
- 15 of the 17 files are over 200 KB today.
- Not migrated: two member photos sent on 5 Nov sit in the Webflow form inbox and in Cloudinary only. The form did not ask for a name then, so nothing says who sent them. They stay out unless you know the sender and that person confirms.
- Not imported: the 886 story gallery photos. Their permission was for the story. A story photo enters Photos only as a deliberate pick (next section).

## 8. Phase 5 seed candidates

The 10 Nov story drafts were not found anywhere I can reach, so there are no candidates for those stories. These ten come from the five live Oregon and Vietnam stories, read from the Stories CMS. Captions use only words from the story. Nothing is uploaded until you say yes to each.

Rules applied: not the story's main photo; no child; no stranger as the subject; nothing the Oregon note holds or flags; place first. All ten are assumed to be your own photos. Nothing on record says who took each one, so please confirm.

"Photo" numbers are the position in the story's gallery, the same order as the live page.

**Oregon, Pacific Northwest** (trip date on the page: June 2023)

| Photo | Shows | Suggested caption | Source sentence | Place | Year |
|---|---|---|---|---|---|
| 22 | A sea stack mirrored in a pool on the sand | "Beach walks among the sea stacks." | "Our downtime was extra special because of coffee tastings, wine meet-ups, beach walks among the sea stacks, dinners and hugs." | United States. The story text does not say where this coast is | 2023, from the trip date field only; the story text states no year |
| 14 | Hikers crossing a snowfield, a lake below | "Mt. Bailey, still holding snow on its upper slopes." | "[names] and I conquered Mt. Bailey, which was still holding snow on its upper slopes, and near the top found the natural rock window that frames the lake far below." | Oregon, United States | 2023, from the trip date field only |

A 1200 px Lounge crop of photo 22 was already uploaded to the site and never placed. Photo 14 has two small hikers seen from behind.

**Vietnam, Ninja Duckies**

| Photo | Shows | Suggested caption | Source sentence | Place | Year |
|---|---|---|---|---|---|
| 8 | A rubber duck in a knit hat beside a cardboard house | "Our supplies were limited; our imaginations were not." | "Our supplies were limited; our imaginations were not. She knit the ducks hats." | Hanoi, Vietnam | 2021 ("The round I am telling you about began in July 2021.") |
| 19 | An iced coffee at a bird cafe | "The iced coffee, which is sooooo good." | "The first was the iced coffee, which is sooooo good." | Ho Chi Minh City, Vietnam | 2021 is implied, not stated for this outing. Confirm |

Photo 8 has no person in it, but the scene was made together with a neighbor's child, who is not shown. Your call.

**Vietnam and Thailand, Noodle Week**

| Photo | Shows | Suggested caption | Source sentence | Place | Year |
|---|---|---|---|---|---|
| 12 | A lotus pond, limestone hills behind | "An expansive region that pictures do not do justice." | "Treks through an expansive region that pictures do not do justice." | Vietnam. The town is not stated for this photo | 2022, from the trip date field only |
| 5 | Sunset behind limestone islands and boats | "Ha Long Bay: a cave, trekking, swimming and kayaking." | "In Ha Long Bay, [name], possibly the best cruise director there is, hosted explorations of a cave, trekking, swimming and kayaking." | Ha Long Bay, Vietnam | 2022, from the trip date field only |

Photo 5 is 960 px wide and needs your original. 15 of this story's 17 gallery files are 960 px or less. The wall already has a Ha Long Bay tile.

**Vietnam, Monkeys in Sweaters**

| Photo | Shows | Suggested caption | Source sentence | Place | Year |
|---|---|---|---|---|---|
| 9 | A cable car line above a bay of fishing boats | "A pretty fabulous little slice of heaven." | "It is a pretty fabulous little slice of heaven, and we very much recommend it." | Phú Quốc, Vietnam | 2021 is worked out, not stated (a Christmas weekend inside "Late 2021 to August 2022"). Confirm |
| 16 | Granite boulders and a pool at the Ba Hồ waterfalls | "We cliff jumped, swam and bouldered in the jungle." | "The adventure started with a sunny trek to the Ba Hồ waterfalls, where we cliff jumped, swam and bouldered in the jungle." | Nha Trang, Vietnam | Not in the story text |

Lounge tile 2 is already this story's photo 1. Words from the story for it, if you want them: "This Goliath of limestone in the Gulf of Tonkin." (source: "But like so many things, pictures do not do this Goliath of limestone in the Gulf of Tonkin justice."). Its year is not in the story text.

**Vietnam, The Year of the Dragon**

| Photo | Shows | Suggested caption | Source sentence | Place | Year |
|---|---|---|---|---|---|
| 20 | Two tiny figures on a lookout platform over a sea of cloud | "Sapa, above the clouds." | The section heading "Sapa, above the clouds", and "And finally, Sapa stole our breath away with its Hmong villages and cloud-hopping adventures" | Sapa, Vietnam | 2024 ("in 2024 it fell on February 10") |
| 17 | Lantern boats on the river at night | "Hoi An lit up our souls with its lantern festival." | "Hoi An lit up our souls with its lantern festival, fulfilling a dream I had harbored for a hot minute." | Hoi An, Vietnam | 2024 |

Photo 17 has the same subject as the story's main photo and is mostly dark. A reserve: photo 13, moored rowboats in Ninh Binh.

**Held and excluded**

- The only held list on record is in the Oregon story's editor note: "CONSENT: children and likely teens held, never uploaded (13 photos). Also held: couple with umbrella (#12), harlequin-suit guest (#16), roadside fire (#42, #53). Hot-spring swimwear photos included; flagged." Those numbers belong to the original photo set, not the live gallery, so they cannot be mapped. To stay safe the wedding photos (1 to 3) and the hot spring photos (19 and 20) were left out.
- No held list exists for the four Vietnam stories. Please send one, or say that nothing is held beyond children.
- Excluded for children: Noodle Week 13 (schoolchildren, faces visible, live), 17 (a child, face partly visible), 14 (three small girls from behind); Ninja Duckies 10 (a small child from behind).
- Found on the way: two swapped photos (R28). And six alt texts in The Year of the Dragon name two of your family members by first name; one of those names is not in the story text. Low, your call.

**Still needed from you for this list:** where the Oregon sea stack beach is; the town for the lotus pond; the year for Nha Trang and for the Ha Long Bay tile; a yes to 2021 for the iced coffee and Phú Quốc and to 2022 for Noodle Week; originals for Noodle Week.

## 9. Overlap with the Lounge postcards session

That session built the postcard deck on /gallery (preview only, `?preview=lounge`).

- **Who builds what.** They keep the deck, its tests, its eight review fixes and your answers to their open questions. This build takes the data and the page: the Photos collection, the /gallery list and page script, retiring the member photo layer, and every other surface.
- **The agreement between the two.** The deck reads three things from each tile: a continent, an image and a credit. The new list keeps those three and adds optional ones (place, year, caption, alt, country, link, story, profile). The deck ignores what it does not know, so additions cannot break it.
- **What changes for them.** Their planned work for member captions and member continents is no longer needed, because member photos arrive as CMS items with both. Their rollback rests on "/gallery is never edited"; that ends at this build's go-live, so both sessions sign that step in the lock log and their saved test page is renewed. The deck then needs a small update: a caption line, a link row, the country filter.
- **A trap that is now closed.** A layer live on www puts the newest 12 photos from the old Lounge feed in front of the grid. Had your 17 been approved while it ran, 12 duplicates would have appeared on the live page. The hold makes that feed answer empty for good, and the layer is retired at the /gallery go-live.
- **Order.** Their fixes release first. The tile agreement is confirmed. This build stages the list hidden, under its own preview flag. They test the deck on it. You review grid and deck together. One go-live, with a written way back.
- **"Par avion".** Their unbuilt card back would have printed it. The lock log already asks them to leave it off.

Other sessions touching the same pages today: the Webflow build session (repaired the contributor fields on /share-photos), the cloud session (home rows, the staged pet page layer, today's publishes), the trust and conversion session (the Worker, the story template). Each gets a scope line in the lock log before any write.

## 10. What is missing

**Documents your prompt names**

| Document | Found? | Effect |
|---|---|---|
| `claude/tll-build-principles-2026-10-31.md` | Yes, as your Google Doc "01 TLL Build Principles v1" | Read and followed |
| `claude/tll-layover-lounge-instagram-storm-2026-11-11.md` | Yes, as your Claude Doc | Read |
| `claude/tll-photo-upload-fix-2026-10-19.md` | No | The plan rests on what the code shows: `tllphotosendv1` is the upload flow to keep (R29) |
| `claude/tll-editorial-design-and-site-review-2026-10-09.md`, section 17 | No | The /gallery work is built from your prompt's own list and second-hand notes until it arrives |
| `claude/tll-story-*-2026-11-10.md` (the 10 Nov story drafts) | No, none | No seed candidates for those stories |
| The Oregon and Vietnam story docs | No. The five stories are live, and the seed list was made from them | Held photos for the Vietnam stories are unknown |

They are most likely in the Claude project "That Layover Life", which this session cannot read. Please add them to the repo's `claude/` folder or paste them.

**The three design skills.** The Emil Kowalski, Taste and Impeccable skills are not installed in this session. Public copies of all three were found and saved for reference in this session's work folder:

- Emil Kowalski: `emil-design-eng`, from github.com/emilkowalski/skill
- Taste: `design-taste-frontend`, from github.com/Leonxlnx/taste-skill (version 2.5.1) and the original v1
- Impeccable: version 4.8.2, from github.com/pbakaus/impeccable

Please confirm these are the ones you mean, and which Taste version. Two things to know: the public Impeccable bans the small eyebrow line above a heading and the public Taste bans captions under images, while your brand kit requires eyebrows and your prompt asks for real captions. Where they clash, the brand kit and your prompt win, as your 6 Oct addendum already rules. Each UI change gets a named design pass against Build Principles section 6. The skills' own scripts are not run.

**Also needed**

- The lawyer-checked permission wording and the version name to store with each submission. The form can be built without it. It cannot go live without it.
- Your data for the 17 photos (section 7).
- A signed-in test of /share-photos. No session has tested it signed in since today's repair. You, or a test member on the test site.
- The handles of TLL's own social accounts, for the form label, the caption format and the email template.

## 11. Found on the way, not part of this build

- The done message on /share-photos can show two sentences that disagree: a person looks at every photo first, and then "Your photos are in the Lounge". The photo hold removes the second one for good.
- The "next morning" review task has not run since 9 Nov. Photo review rests on you. Nothing in this build promises an automatic first read.
- The file picker on /share-photos appears to let a member choose one photo per tap, though the page says up to 30 (read from the page code, not tested in a browser).
- The legal draft for the content license (lawyer check pending) differs from your prompt's permission text in ten places, among them one box against three, what the tick covers, takedown timing, children and people. The form is built so the wording and its version can change without new code.

## 12. The map write-up (Phase 2 step 6)

Your prompt says: if the map is not CMS-driven enough to do this cleanly, write up the approach and stop. It is not, so this is the write-up. Nothing has been built.

**What the map is today**

- The page has no CMS lists at all. Story pins are four countries typed into the page code on 21 Sep (Ghana, Mexico, Montenegro, Chile), each with one story link. The site now has 57 live stories.
- The pin preview is a small tooltip that appears only on mouse hover: flag, name, "Read the story". A click jumps straight to the story. There is no preview by tap or by keyboard.
- /the-map is the heaviest page audited (244 KB of HTML, 21 scripts, 6 page scripts). The member map editor uses the same drawing.

**Why it cannot be done cleanly as asked.** A thumbnail in the pin preview needs a preview that can hold one, and "Photos from here" needs the Lounge to filter by country. Neither exists.

**The approach I propose**

1. One small read from the Worker that lists, for each country with approved photos, one thumbnail, the count and the country page. The Worker already knows the map's country numbers.
2. The tooltip becomes a real preview that opens on click, tap and keyboard, with the thumbnail, "Read the story" and "Photos from here", which opens the Lounge filtered to that country.
3. In the same pass the four typed pins are replaced by data, so the map shows stories that exist.

**What changes for a visitor.** A click on a pin opens the preview first. The story is one more click away. That is the decision in R23.

**Cost and risk.** No new CMS list and no new registered script; thumbnails load only when a preview opens. It needs a Worker deploy (yours). It must be tested next to the member map editor. Places without a country page, such as Curaçao, cannot be linked. It waits for the /gallery country filter and for photos to carry a country page, so it is built last.

**What I need from you.** A yes or no on R23. If no, the map stays as it is and the Lounge link lives on the country pages instead.

## 13. Technical appendix (ids, for sessions)

**How this was checked.** Five read-only audits (documents, CMS, form, surfaces, seed), one plan, one independent critique. After the 17:07:23 UTC www publish (task 854f1234-1e4b-4536-880f-39cdfe8a9e7e, layers pin 3066315b) all 139 sitemap URLs were fetched again for this report: the Ghana asset is in 19 pages, the two Noodle Week files are in 1 page, "Par avion" has 1 hit (a CSS comment in home embed 66b42ff4, not visible), /share-photos still serves `checked=""` on syndication-social and syndication-rotation, and `GET /lounge` answers `{"photos":[]}` (the hold is not deployed; after the deploy it answers with `"held":true`). One side effect of the audits: a single GET to a Cloudinary fetch URL made Cloudinary cache one resized copy of the Laos tile in the account.

**Collections.** Photo submissions 6ad0840f0b87155745bb156d (template page 6ad084100b87155745bb1573, head code noindex plus redirect to /share-photos). Countries 6a8afbd98e907b41c4da109b. Destinations 6a0b29c702602326705dcfb1. Stories 6a0b29eddc14f1444e935760 (60 of 60 fields). Contributors 6a0b29c7a7b1840afe9390a5 (60 of 60; credit-mode and pen-name drive bylines; visibility Public, Unlisted, Off). Pets 6a0be8194ccc05a63fbdcfa3 (is-public, passport-visibility). Site settings 6ae62191c9c7b5d322a05343. Nancy's Contributors item 6a0be79e01ee7eff10102ce9. Planned create file (21 fields; children-hold to be replaced by children-check-passed and the Status choices updated before use): scratchpad `lounge/plan/photos-fields-to-create.json`.

**Worker.** Root Worker tll-travel-wire, `src/intake.js`: createPublished for photos (lines 173 to 178, 226), member name in item name and slug (215) and alt fallback (223), URL pattern accepts any Cloudinary cloud (35), /lounge filter (276). Deployed commit af5de76, version 040dddfb. Cron every 30 minutes. `POST /pets/mine` exists for the pet owner view. Hold (commits d43e90c, a0ad0b2; notes in `handoff/PHOTO-HOLD-2026-11-11.md`; review running, nothing deployed): site layer tll-intake-v1 gets `HOLD_PHOTOS=true` and stops posting photos; the Worker saves drafts (stage Received), builds name, slug and alt from place, batch and number, credits by the byline rule, writes social-opt-in false, accepts only cloud idonvlow folder tll/photos, and `GET /lounge` answers `{"photos":[],"held":true}`. Worker v2 adds: byline names from credit-mode and pen-name, contributor-profile only for visibility Public, pet only when public, sweep reads staged values, includeInSitemap false until approval, leak check, Photos in `src/export.js` and account deletion.

**/share-photos.** Page 6a0dfca3f9fa5b751d154257, form c09ceb51-0ee9-0a93-6196-eee626758710, form record 6a0dfd649a488acac67dd773. Pre-ticked: syndication-social (…86e7), syndication-rotation (…86ee); get_settings returns no checked or default key. Hidden required inputs "Field" to "Field 4" in fieldsets 92d9196e-d017-9f75-3976-f15cc4b88d2f and ad700d53-693e-17f0-5e6b-2d02129b0e7e. Upload script tllphotosendv1 (jsDelivr at 4d12668, SRI pinned; cloud idonvlow, unsigned preset tll_photos, folder tll/photos). Footer code is 1,873 characters under its 50,000 cap. New form layer tll-photos-form-v3; no preview chunks exist yet for share-photos, home or travelers, and each staged layer must test its own preview key.

**/gallery.** Page 6a3e5e3e9de41030cdc7524b. 17 typed tiles with data-tll-loc, data-tll-img, data-tll-credit; page script "TLL Lounge v2"; layers tll-lounge-labels-v1, tll-lounge-members-v1 (public, misc chunk), tll-lounge-deck-v1 (preview). Tile 4 element f2cbcc75-a8b1-1bd9-fa31-e6b52c4c03c4, asset 6a0e0224fb0e0ee3c092ec01. Staging uses holding attribute names (data-tllp-*) until go-live. Deck session log: `handoff/CHANGE-LOG-LOUNGE-POSTCARDS-2026-11-11.md`, commits 5d3f7bb and 5ce3911.

**Other surfaces.** Nav component TLL Nav v1 8484ce87-193e-8ab5-fff8-590bb198f8a8 (66 instances), links row …f8b2, insert after Stories …f8b3 and before Travelers …f8b5. Home 69d6145df421c777840c1e46: stories embed 94ce12c0-56fc-4b10-fa9f-14da000634c7, guides section 4777d470-007c-cece-14cc-84d601657f7d, Lounge embed 66b42ff4-1aaa-0c16-2286-32040813b975, band 7c5c6fc9; chapter numbers to renumber in 405baa84, 9992aa7f, a4c1009d. Stories template 6a0b29eedc14f1444e935766: strip goes after d462e341-4dd2-501c-7206-1705265f8be9 and before b3f20463-8f3d-49ca-a90a-21b9b02aed53; "Want to go" block 4fce04b3-72ef-92ee-42fd-3f3c87275c0c. Contributors template 6a0b29c8a7b1840afe9390ab: after 0494887a-33c5-6443-1457-ecab7c70cbc3; owner check on 089aa914-611c-9a84-8a04-aa31f2585b92. Pets template 6a0be81a4ccc05a63fbdcfd2. /travelers 6a0e0632ef1e4948167e827c: card 75833cff-c508-0418-500a-0e538e2e2ee2, image 6bf95a05-4c6c-dbbc-4797-9d645325ad39. /the-paw-passport 6a3e5e3ed36c8c6a1df1d12e: between a0617c54-c5e1-de56-7c0d-828bc6659d31 and …9d49. /the-map 6a0df81df4016d4f78cfb22a. Collection lists per page today: home 1, Stories template 6, Contributors template 3, /travelers 4, /gallery 0, Pets template 0, /the-paw-passport 0. Site-level registered scripts: 15 of 15, so no new registered script anywhere.

**Children photos.** Ghana story 6a96a65a420f652aaea2649d (ghana-easter-everyone-wears-white). Noodle Week story 6acce42f7f3e73e2282fce52: gallery 13 file 6acce42e7f3e73e2282fce27, gallery 17 file 6acce42e7f3e73e2282fce18, gallery 14 file 6acce42f7f3e73e2282fce2d. Ninja Duckies gallery 10 file 6acce3b3f71844c9c276776d.

**Lounge tiles matched to stories** (tile: story id). 1: 6a96a65a420f652aaea2649f. 2: 6acce3f69fbc479ed1325f6c. 3: 6a96a65a420f652aaea2649b. 4: 6a96a65a420f652aaea2649d. 5: 6accb04d158b115c416603c2. 6 and 7: 6a3503d2b838e59a94bfab88. 8: 6a96a65a420f652aaea264a1. 9: none. 10: 6acc9dd1901463fb94a531b9. 11: 6accaa3feb9526b52b0ccfae. 12: 6accb6e40ac2f0a15ab65a4c. 13: 6accd51ec1ee4abbfe7955a1. 14: 6acd1e33ef5c74068f978c85. 15: 6acd22b5f326c53d1e26e56d. 16: 6acd22bca172d6041e178f6b. 17: 6acd1c9fbe35f878324f784b.

**Seed picks** (story id: gallery number, file id). Oregon 6accbebc72e26ecd2eab5e8d: 22 6accbebb72e26ecd2eab5e64; 14 6accbebb72e26ecd2eab5e37. Ninja Duckies 6a3503d2b838e59a94bfab78: 8 6acce3b3f71844c9c276774d; 19 6acce3b2f71844c9c2767728. Noodle Week 6acce42f7f3e73e2282fce52: 12 6acce42f7f3e73e2282fce30; 5 6acce42e7f3e73e2282fce00. Monkeys in Sweaters 6acce3f69fbc479ed1325f6c: 9 6acce3f69fbc479ed1325f42; 16 6acce3f69fbc479ed1325f3b. Year of the Dragon 6accb17ef0f89e81f06bfeed: 20 6accb17df0f89e81f06bfe30; 17 6accb17df0f89e81f06bfe0a; reserve 13 6accb17df0f89e81f06bfe04. Swapped pair: Ninja Duckies gallery 1 file 6acce3b2f71844c9c2767741 and Monkeys in Sweaters gallery 23 file 6acce3f69fbc479ed1325f46. Existing unplaced crop: site asset 6accbe0897231f9b5b98e273 (188,607 bytes).

**Corrections applied from the critique.** M1 hold before schema, test publish after. M2 /lounge empty from the hold on. M3 ticked boxes need the Designer. M4 byline names. M5 profile and pet visibility in the gate. M6 style-level hide, no standing HOLD line. M7 Noodle Week photos added, Ghana page count corrected. M8 seed list and held list included. S1 to S14 applied where factual: the www done message, the fail-closed children switch, staged-value sweep, five template conditions, Unpublish as takedown, Cloudinary sizes and fetch, sitemap flag, the two extra home postcards, Countries noted as a departure, question numbers redone, pet owner view, story and profile links on tiles, speed interim, tiles hidden not deleted, live location checklist, leak check and export, the added questions.

**Session work folder** (temporary, not in the repo): `/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/lounge/` with the audit results, the contact sheets (cms/img, seed/sheets), the seed data (seed/lounge-pick-candidates.json), the public skill copies (docs/external-public-skills) and the two crawls (critic/crawl, report-recheck).
