# Claude Code prompt: Layover Lounge everywhere + "Get featured" (11 Nov 2026)

Saved as Nancy pasted it into the cloud session on 11 November 2026.

You are working on That Layover Life (thatlayover.life), a Webflow site, through the Webflow MCP. Before you start, read these docs in the TLL project and follow them:

* `claude/tll-build-principles-2026-10-31.md` (standing rules: speed budget, design system, voice, accessibility, privacy, how changes go live)
* `claude/tll-layover-lounge-instagram-storm-2026-11-11.md` (why this build exists)
* `claude/tll-photo-upload-fix-2026-10-19.md` (how Cloudinary uploads work today)
* `claude/tll-editorial-design-and-site-review-2026-10-09.md`, section 17 (/gallery issues)

Apply the Emil Kowalski design skill, the Taste Skill and the Impeccable design skill to every UI change.

## The goal

The Layover Lounge (/gallery) looks good, but nobody finds it. It is not in the top nav, it sits at section 05 on the home page, and no profile, story or map pin links to it. Fix that by making photos one library shown across the site, the way Instagram puts photos on profiles, in posts and on a map.

Second goal: let travelers submit a photo for free to be featured on TLL's social accounts, credited with their handle, in exchange for exposure. Every featured photo also lands in the Lounge and on the traveler's profile.

## Rules for this build

* Work in Webflow drafts and staging. Do not publish. Nancy approves before anything goes live.
* Nav and footer changes only with Nancy present. Prepare the nav change, screenshot it, and stop for her.
* Keep the change log in the TLL project: page, element, before, after, why.
* Fix, then fast, then look, then features. If you find a P0 (broken or unsafe) on a page you touch, log it and fix it first.
* Counts come from live CMS data, never typed.
* Voice: no em dashes, no word containing s-h-i-p, US spelling, "São Paulo" with the tilde, headlines under eight words, one joke and one fact.
* Privacy: no live locations (city or country, after the trip), GPS stripped from uploads, no recognizable children's faces on public pages, no future travel plans.
* Do not make up names, captions, places or years. If a photo is missing data, list it for Nancy.

## Phase 1: One Photos collection

1. Audit what exists: the current /gallery items, the Photo submissions collection and the /share-photos form fields. Report what you found before you change the schema.
2. Create (or extend) a Photos CMS collection with these fields:
   * Image (Cloudinary URL), alt text (required), caption (one line), country (reference to Destinations if that collection exists), city (text), trip year (number)
   * Credit: reference to Contributors and/or Pets; credit choice (option: Collab, Tag, Name, Initials, None); social handle (text); platform (option: Instagram, TikTok, Other)
   * Story (reference to Stories), shelf (multi-reference or option: by continent, Pets on the road, Airports, Layover Awards)
   * Consent: owner permission (switch), people in photo agree (switch), contains children (switch), permission date and wording version
   * Social: feature on socials requested (switch), featured date, post URL, Collab status (option: Not sent, Invited, Accepted, Declined)
   * Editorial: featured (switch), pinned on profile (number 0 to 3), Photo of the week (switch), status (Draft, Approved, Hidden)
3. Migrate the existing Lounge photos into it. Keep their current credits. Do not invent captions; flag missing data.
4. Only items with status Approved, owner permission on, and children off (or a guardian submission noted) ever show publicly.

## Phase 2: Make the Lounge findable

Build each as a Webflow draft and screenshot it at 1440 and 390.

1. Top nav (stop for Nancy): prepare a "Photos" item between Stories and Travelers that links to /gallery. Nancy is choosing the label ("Photos," "The Lounge" or "Layover Lounge"), so use a placeholder and ask.
2. Home: move The Layover Lounge section up to sit right after the stories carousel. Pull its tiles from the Photos collection (featured first).
3. Story template: add a "From the trip" strip (up to 6 photos where Story = this story) ending in "See all in the Lounge →". Hide the strip when there are no photos.
4. Contributor and pet profile templates: add a Photos grid (photos credited to this profile, pinned first, then newest). 3:4 tiles. Hide when empty, and on the owner's own view show an empty state: "Add your first photo" linking to /share-photos.
5. /travelers directory: use each person's top pinned or newest approved photo as the card image, falling back to the current avatar.
6. The Map: on pins that have photos, show a thumbnail in the pin preview and a "Photos from here" link to the Lounge filtered by that country. If the map is not CMS-driven enough to do this cleanly, write up the approach and stop for Nancy.
7. /the-paw-passport: add a "Pets on the road" strip from the Pets on the road shelf.
8. /gallery itself (per the 9 Oct review): remove the "Open slot · Asia" placeholder tile; hide filters with no photos; rewrite the heading for viewers and move the contributor pitch under the grid; shrink "Add yours"; real captions (place, year, credit) instead of 9px initials; link each photo to its story and profile; filters and photos reachable by keyboard with a selected state for screen readers; lazy-load past the first two screens with "Load more".
9. One page per photo: a Photos template page with the image, caption, place, year, credit, links to the story, profile and country, and a "Want to go" save if it already exists on stories. Unique title and description for search; ImageObject structured data with creator credit.

## Phase 3: "Get featured" on /share-photos

1. Add fields to the existing form (keep the Cloudinary upload script `tll_photo_upload_v1` working):
   * Place (city, country) and trip year, one line about the moment
   * Social handle and platform
   * Checkbox: "Feature me on TLL's socials"
   * Credit choice: Collab post on Instagram (default), @tag only, Name only, Initials only, No credit
   * People in the photo: "Nobody recognizable" / "Yes, and they're OK with it being shared"
   * Checkbox: "There are children in this photo and I'm their parent or guardian"
   * Pet name (optional)
   * Required permission checkbox with this text (Nancy is having it checked; store the version number with each submission):

   I took this photo, or I have the photographer's permission to share it. I give That Layover Life free, non-exclusive permission to show it on thatlayover.life, in The Layover Letter and on TLL's social accounts, credited as I chose above. TLL may crop and resize it but won't change what it shows. Everyone recognizable in it is OK with it being shared. I can ask TLL to take it down at any time.

2. Add a short "How featuring works" block under the form: free, reviewed first, how long review takes (ask Nancy for the number, do not invent one), credit options spelled out, and "Want it taken down? Email us and it's gone."
3. House rules, short list, on the same page: one real trip photo, no logos or watermarks across the image, at least 1080px wide, no live locations, no recognizable children unless a parent or guardian submits, and a business featuring its own product is an ad (labeled "Reklame for [name]" per the build principles, or declined).
4. Submissions land in Photos as Draft with all consent fields filled.
5. Validation: required fields marked visibly, errors next to the field, all five states (empty, loading, partial, error, done). The done state says what happens next and links to the Lounge.

## Phase 4: Feature routine (no auto-posting)

Do not connect any tool that posts to social accounts. Instead:

1. Build a simple Webflow CMS view or a Notion page (ask Nancy which) listing Approved photos with "feature on socials" on and no featured date, oldest first, with handle, credit choice, caption and a ready-to-paste Instagram caption draft.
2. Caption draft format: one line about the moment in TLL voice, place and year, credit line per their choice, "Get featured: link in bio." No hashtag walls.
3. When Nancy marks a photo featured, she fills the post URL and featured date; the photo's Collab status updates from there.
4. Draft (do not send) a "You're live" email template: link to the post, link to their photo page and profile, a share line.
5. Draft a monthly prompt block for /gallery and /share-photos ("This month: [prompt]") that Nancy edits in the CMS, so the same prompt can run as an Instagram Add Yours sticker.

## Phase 5: Seed the wall

From the 10 Nov story drafts in the TLL project (`claude/tll-story-*-2026-11-10.md`) and the Oregon and Vietnam story docs, list one or two "Layover Lounge pick" candidates per story with suggested caption, place and year taken from the story text only. Exclude anything the story docs list as held (children, consent pending). Give Nancy the list to approve. Do not upload until she says yes.

## Done means

* Change log updated for every page touched.
* Before and after Lighthouse mobile on home, /gallery, one story, one profile and /the-map; nothing worse than before and within the speed budget (card images under 200KB, lazy below the fold).
* axe on every template touched: zero serious or critical issues.
* Screenshots at 1440 and 390 of each change.
* A list for Nancy: the nav label question, review time, feature cadence (suggest 2 a week to start), which socials, pet feature day yes or no, photos missing data, anything you could not build cleanly.
* Nothing published, nothing posted, nothing emailed.
