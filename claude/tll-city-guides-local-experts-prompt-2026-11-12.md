# Claude Code prompt: TLL city guides, place pages and the Local Expert bench

Received from Nancy in the cloud session on 12 Nov 2026; updated by her the same day (decisions on URLs, the index threshold, the vote name, type and color, clips and events). This file holds the updated version.

Date: 12 Nov 2026
Design reference (source of truth for layout): canvas "TLL Airport Guide Template: CPH", https://claude.ai/artifact/VH43pbGoF37D4d9T6omSQ6 (boards: the page, and "Under the hood")
Also read, in this order:
- claude/tll-build-principles-2026-10-31.md (v1.1: stand-in photo rule in section 5, section 13)
- claude/tll-user-flows-v2-build-prompt-2026-11-11.md (posting, money question, live-then-flag, auto-checks, Notion "TLL Flags" queue)
- claude/tll-ground-rules-storm-2026-11-11.md
- claude/tll-layover-guides-top10-storm-2026-11-12.md (fact format: source, tag, last checked)
- claude/tll-expats-step-by-step-build-prompt-2026-11-11.md and claude/tll-expat-build-prompt-2026-10-12.md (expat profile fields, "Places I know well", city hubs)
- claude/tll-privacy-guardrails-2026-10-19.md

You are working on That Layover Life (thatlayover.life): Webflow CMS, Memberstack for members, one small server function (the same one Flows v2 uses; Step 0 confirms which). Work through the Webflow and Memberstack MCP tools.

## Goal

1. One **city guide template** (the airport is a section of it) that serves a layover, a visit, a longer trip and a move from one page, starting with "How long have you got?".
2. **Place pages** that collect every story, pick and itinerary mentioning a place.
3. A **Local Expert bench, as large as possible**: any member who knows a city can add picks, gets credited on every pick with a link to their own site, and earns Local Expert status automatically. Nancy is not a gate.
4. Pages are **created by contributions**: a story or an expat for a new city creates a draft city page from the template.
5. Facts stay fresh through a **scheduled check**; Nancy spends about 15 minutes a week approving changes in Notion.

Build Copenhagen first, end to end. Do not start a second city until Copenhagen passes "Done when".

## Decisions Nancy has already made (do not reopen)

- The page leads with the city, not the layover. H1 pattern: "[City], for six hours or six years." (final copy is Nancy's).
- The first question is "How long have you got?", with tabs from "Under 3 hours" to "A week or more" and "Moving here". "Moving here" hands off to the city's expat hub.
- More photos and video everywhere. Stand-in photos are allowed under build principles v1.1 section 5 (credited, real place, "Been here? Replace this photo", never in member strips, no stock video).
- Expert bench is open and large. No cap per city, no invitation needed, no paid placement, order rotates.
- Experts keep their content. TLL shows a teaser and links to their site.
- No star ratings and no blended review score. TLL's own signals only: "Crew Approved" votes and "Picked by N locals". Outside review sites are links, not imported data.
- Posting rules from Flows v2 apply to picks, places, events and media: live at once, the money question, auto-checks, held-from-feeds, Notion queue.
- Thin pages stay out of search until they pass a threshold (Phase 5).
- Sign-up 16+. Never show where anyone is now. City or country only.
- Answered 12 Nov: city pages live at the root, **/copenhagen** (check for slug clashes with existing pages and reserve a list of blocked slugs). The index threshold is approved: checked facts plus two stories or one Local Expert. The vote is called **"Crew Approved"** (the opposite stays "Closed or changed"). Type and color follow the current spec in build principles v1.1 section 6 (Playfair Display, IBM Plex Sans Condensed, JetBrains Mono, Syne in the wordmark only), not the older design system file.
- Clips (12 Nov, Claude's recommendation, Nancy to confirm): no video uploads in this build. A clip is a link to the member's own post, shown as a poster image with a play mark; the outside player loads only on tap and only after consent. $0 storage, no third-party script on page load, and the view goes to the creator.
- Events (12 Nov): automated. Nancy approves **sources** once per city (official city and tourism calendars, named community groups); events from approved sources are pulled weekly and publish without a per-event approval, each showing its source and a link. Check each source's terms and prefer official feeds or iCal. Events from unapproved sources or member submissions go through the normal live-then-flag checks.

## How to work (non-negotiable)

1. **Step 0 audit first.** Report before changing anything: the current /layovers template and its CMS collection and fields; duplicate layover slugs; existing Stories, Countries and any Places or Events collections; the expat profile fields already live in Memberstack ("I live abroad", home base, "Places I know well", interests, links); the server function from Flows v2 and its status; Webflow plan limits (CMS items, collections, reference fields, localization); what the Layover Lounge stores per photo. Build on what exists. List what is missing.
2. **Design, then Edit, then Implement.** Before each phase, give Nancy one change-log table: page or collection, element, before, after, what could break. Wait for approval. Apply only what she approved.
3. **Drafts and staging only.** Nancy publishes. Space publishes about 75 seconds apart.
4. **Nav, footer and the "Tell the editor" button:** propose, do not change.
5. **Counts come from live data**, never typed.
6. **Honest states only.** A section with no real content does not render. No placeholders in public.
7. **Money:** anything that costs (plan upgrade, API, storage, video hosting) is proposed with the price first. Target $0.
8. **Third-party scripts:** ask first; before and after Lighthouse run.
9. Apply the Emil Kowalski, Taste and Impeccable design skills; review against each before handover.
10. Voice and copy: US spelling; no em dashes; no word containing s-h-i-p (rephrase member, partner and owner words that end in it); never "l-e-d-g-e-r", "No filler", "Truth over polish", "real names"; no hashtags; "São Paulo" with the tilde; never recommend Telgea. Mark every line you write as DRAFT in the change log.
11. Accessibility: WCAG 2.2 AA; 44px targets; visible focus; labels on every input; reduced-motion versions; alt text on every image; zero serious or critical axe issues.
12. Log everything in the TLL project.

## Data model (propose exact Webflow field types in the Step 0 report)

| Collection | Key fields | Notes |
|---|---|---|
| **Cities** | name, country (ref), slug, airport codes, hero media (ref Media), intro, verdict tabs (7 rows: label, verdict, why, steps, link), linked expat hub, index state | One page per city. Airport is a section. |
| **Facts** | city (ref), topic (entry, transit, bags, lounges, power, pets, status), text, source URL, source type (Official, Press, Secondary, Weak), last checked, checked by, tier (weekly, monthly, quarterly), state (ok, being rechecked) | Rendered as cards with "Last checked". Overdue shows "Being rechecked". |
| **Places** | name, city (ref), type (eat, drink, bakery, sight, sauna, stay, shop, service), zone (airside, in town, day trip), minutes from gate, opened date, map link, official site, outside links (review sites, Instagram), Google place ID (ID only), photo (ref Media), index state | Deduplicate on name plus city. Nancy merges duplicates in Notion. |
| **Picks** | place (ref), member (Memberstack ID), dish or tip (one line), source URL (expert's own post), photo (ref Media), money answer and labels, crew-approved count, closed count, status (live, held, needs recheck, removed), created | One member, one pick per place. |
| **Experts** (or profile fields) | member ID, cities known (multi-ref), specialties (up to 3 from the fixed interest list), site URL, social URL, bio line, status (member, Local Expert), followed-link switch (Nancy only), business flag | Public card shows only opted-in fields. |
| **Events** | title, city (ref), start, end, area, minutes from airport, type badge (Official, Community, Paid), listed by, link | Past events drop off by date. |
| **Media** | file or embed URL, kind (photo, clip up to 30s), photo source (member, TLL, press library, stock), credit text, city (ref), places (multi-ref), AI flag, member ID | Drives captions and the replace link. |
| **Stories and Itineraries** | existing collection, add: cities (multi-ref), places (multi-ref), duration tag | Do not rename existing fields. |

If Webflow limits block this (item counts, nested references, per-member votes), say so in Step 0 and propose where the server function and a small store hold the overflow. Votes and per-member data must not live in public CMS fields.

## Phase 1: City template (Copenhagen)

- Build the template from the canvas, section by section: hero with media mosaic and "What brings you here?" cards; member media strip; 01 How long have you got (tabs); 02 Facts; 03 Eat this, not that (with type filters: bakeries, brunch, street food, vegan and so on); 04 New and talked about (places opened in the last 180 days); 05 On this week; 06 Photos and clips; 07 The local truth (picks with votes, link to the expat hub); 08 People who did it (stories and itineraries); 09 Longer trips; Trip kit (labeled); FAQ; page footer line with owner, checker count, next check.
- URLs: /[city] is the hub (/copenhagen); today's /layovers/cph-copenhagen-6h becomes an itinerary under it; 301 redirects listed in the change log, none applied without approval.
- Tabs are real links with their own anchors (and work without JavaScript as stacked sections).
- Schema: Article with author and dateModified; FAQPage; BreadcrumbList; ItemList for picks; Event for events; VideoObject for clips; Airport inside the transit section. No AggregateRating anywhere.
- Fix on the existing template while here: og:type "article", add JSON-LD, remove duplicate layover slugs from the sitemap.
- Content for Copenhagen: facts from the current CPH page plus the 12 Nov STORM doc, each with a source. Picks may be seeded only from Nancy's own Notion guides ("The Epic Guide to Copenhagen", "A Creative's Guide to Copenhagen", "Vikings & Vagabonds"), credited to Nancy, with private details removed (addresses, booking codes, phone numbers, friends' details, any minor's name). Do not use "The Danish Diaries" Notion page: those picks belong to someone else. Anything unverified is marked for recheck and stays in draft.

**Done when:** on 390x844 and 1440x900 the hero, the "What brings you here?" cards and the first tab are visible within one scroll; every fact shows a source and date; no empty section renders; Lighthouse and axe gates pass; Rich Results Test passes Article and FAQPage.

## Phase 2: Places and "it links"

- Place tagging in the story, photo and pick forms: a search box over Places for that city ("Aamanns, CPH"), with "Add a new place" (name, type, city; map link optional).
- Every tagged place shows the story or pick on the city page and on the place.
- Places start as tiles on the city page. A place gets its own page at two or more mentions (stories or picks). Place page: media, "Mentioned in N stories, picked by N locals", picks with credits, map, outside links (official site, map, review sites, Instagram) opening in a new tab, schema Restaurant or TouristAttraction with sameAs.
- Itineraries render as an ordered list of Places with times and one "Open in Google Maps" link built from the stops.
- Google data: store the place ID only. Do not cache or display Google ratings or reviews in this build.

**Done when:** tagging a place in a test story makes the story appear on the city page and the place tile within a minute, and a second mention creates the place page as a draft.

## Phase 3: The Local Expert bench

**Joining (open, no approval):**
- Entry points: the "I live here: suggest a pick" button on city pages, the expat sign-on screen, /edit-profile ("Cities I know well", reuse the existing field), and a new /experts page that explains the deal.
- A member picks cities and up to three specialties from the fixed interest list, and adds a site or social link.

**Adding a pick (under one minute):**
1. Paste a link to their own post (site, Instagram, TikTok, YouTube, Substack). Fetch title and image server-side for the preview; they confirm or swap the photo.
2. Or tick a place already on the city page: "I vouch for this".
3. One line in their words, tag the place, answer the money question, "Post it. It's true and it's mine."
- The card shows: their name and photo, "from [site name]", the one line, and "Read more on [site]". TLL never copies the full post.

**Status and credit:**
- "Local Expert: [City]" is granted automatically at 5 live picks with photos plus a linked site or social account. Shown on picks and the profile, with a "since" date. Dropped back to member if fewer than 5 picks remain live.
- Expert profile section: cities, specialties, all picks, bio, follow link, and an embeddable badge ("TLL Local Expert: Copenhagen") that links to their TLL profile.
- Links: rel="ugc nofollow" by default; rel="sponsored" on labeled picks; the followed-link switch is Nancy's alone, per expert.
- Business accounts (tour guides, relocation consultants, venue owners): allowed with a visible "Business" label on the profile and every pick; they cannot pick their own venue (that goes through /for-brands and carries "Reklame for"). OPEN: confirm with Nancy before building this branch.

**Fairness at scale:**
- Picks on a city page rotate per session (stable while paging) and filter by type and specialty. No paid placement, badges never change order.
- When several members pick the same place, show one card: "Picked by 5 locals", with their names and lines inside.
- The city page shows bench depth from live data: "12 locals on food, 4 on dogs".

**Self-cleaning:**
- "Crew Approved" and "Closed or changed" votes on every pick and place: signed-in members only, one vote per member per item, stored server-side. Three "closed" votes from different members set status "needs recheck", hide the pick from the page and create a Notion "TLL Flags" row.
- Picks from members with no activity for 12 months get "needs a recheck".
- All Flows v2 auto-checks run on picks (affiliate parameters, discount codes, commercial language, new-account link signal at 7 days, money answer mismatch).
- Members can edit or remove their picks anytime from "My picks" (same pattern as "My stories").

**Done when:** a new member goes from sign-up to a live, credited pick with a link to their own site in under three minutes on a phone; the fifth pick grants the badge without Nancy; three test "closed" votes hide a pick and create the Notion row; a logged-out page source holds no private field.

## Phase 4: Media and stand-ins

- City and place media come from the Media collection. Hero mosaic: one clip slot and two photos.
- Photo source field drives the caption: member credit, "Photo: [press library]" or "Stock photo", plus the "STAND-IN" tag and "Been here? Replace this photo" link into the photo form with the place prefilled.
- A member photo tagged to the place replaces the stand-in automatically; keep the stand-in as fallback.
- Clips: link-out cards per the 12 Nov decision above (poster image, play mark, loads the outside player on tap after consent). No stock video: the clip slot shows a still until a real clip exists.
- Member strips (Layover Lounge rows) are member-only and hide when empty.
- Per city, report the count of stand-ins left.

**Done when:** uploading a member photo for a place with a stand-in swaps it on the page, and the stand-in count drops by one.

## Phase 5: Pages that grow with contributions

- Trigger: a story is tagged to a city with no page, or a member lists a new city under "Cities I know well". Create a draft Cities item from the template and a Notion row "New city: [name]".
- Research routine (run by Claude on the row): entry and transit rules, airport to city transport, bags, lounges, pets, longer trips, press-library stand-ins. Every fact gets a source, a source type and a check date, following the 12 Nov STORM doc format. Weak sources are flagged, never stated as fact.
- Nancy approves in Notion. The page goes live unindexed.
- Index threshold (approved 12 Nov): checked facts complete, plus two stories or one Local Expert. Below it: noindex, out of the sitemap, still shareable. Above it: indexable.
- The first contributor gets "Started this page" on the page and a notification with a share card.

**Done when:** a test story for a new city produces a draft page, a Notion row and, after approval, a live noindexed page; adding a second story flips it to indexable.

## Phase 6: Freshness and Nancy's queue

- Scheduled check (weekly): re-verify every Fact that is due by tier against its source; on a change, write a Webflow draft and a Notion row with before, after and source. Nothing publishes without Nancy's status change.
- Overdue facts show "Being rechecked" in place of the date.
- Airport status box: for US airports only, read the FAA's public airport status feed through the server function (cache a few minutes; show source and time). For other airports, no live box; the weekly check watches the airport's own news page.
- Places leave "New and talked about" 180 days after the opened date. Events drop off after their end date.
- One Notion view for Nancy: fact changes, new city rows, flags from votes, reports and auto-checks. Changing a row's status applies it to the site within a minute (same mechanism as Flows v2 Phase 6).

**Done when:** a deliberately changed test fact produces a draft and a Notion row on the next run, and approving the row updates the live page.

## Measurement (after analytics consent only)

Events: city_tab_select (with tab), fact_source_click, pick_add_start, pick_add_complete, expert_badge_earned, vote_crew_approved, vote_closed, place_outlink_click (with type), replace_photo_click, standin_replaced, city_page_created, city_page_indexed. Monthly view for Nancy: experts per city, picks per expert, share of picks held, stand-ins left, time from sign-up to first pick. Report reader fit and contributor activity, not raw traffic.

## Done means

- Change log in the TLL project for every template, collection, field, script and server route touched.
- Before and after screenshots at 1440 and 390 for each phase.
- A test report: one test per rule above, its result and a screenshot.
- Costs for anything that is not free.
- A list of anything unfinished and why.

## Open for Nancy (ask after Step 0, in one message)

1. Business accounts as experts with a "Business" label: yes or no? (Proposal in Phase 3.)
2. Expert bar: Claude recommends 3 live picks with photos plus a linked account (the prompt says 5; use Nancy's answer).
3. Confirm the clip recommendation above.
4. The approved event sources for Copenhagen.
