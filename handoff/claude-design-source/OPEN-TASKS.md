# That Layover Life: open work and recommendations (19 October 2026)

For Claude Design's update (functionality, UX, AX, UI, AEO, SEO). Built from handoff/STATUS.md (rows up to S76), the 13 Oct plan (OPEN-TASKS-2026-10-13.md) and Nancy's notes from 19 Oct.
House rules for any copy or build: STANDING-RULINGS.md.

**Live as of 19 Oct 14:05 UTC (nothing waiting in Webflow):** /share-photos simplification, home flags row, Ko-fi buttons on /support, Antarctica's own box on the map, Jay's public profile (/contributors/jay-carleton).

---

## A. Claude Code's list (built or traced by Claude Code; each waits on Nancy's go or answer)

### New on 19 Oct
1. **Home search bar is not responsive.** The field sits right of center and its hint text ("Search a country, a l...") is cut off. Proposed fix: line it up with the text on the left, run it full width, and size the type so the whole hint fits at every width. Needs Nancy's go.
2. **Home hero buttons.** "Send your trip" and "Send a photo" were removed on 12 Oct (Nancy's go-to-market plan item 6: two hero buttons; the contribution buttons moved to Chapter 02). Nancy now notices them missing. Decision: bring them back or keep two.
3. **/travelers: Nancy is not listed as an expat.** Her Directory item is correct (expat on, Copenhagen, published 6 Oct). The /travelers page is not reading it. To trace.
4. **"Schengen Road Trip Echoes" has no photos in the story body**, unlike other stories. Not checked yet: either the item has no inline images (Nancy sends photos) or the template is not placing them.
5. **Story tagging: other travelers, pets and places (countries, cities, airports and more).** Plan first (see C1). /submit already collects "co-travelers", "pets along", city and country as free text; the Stories collection has no structured fields for them.
6. **Merge /destinations and /stories.** Nancy likes /destinations but finds it repeats /stories. Plan first (see C2). Any nav change is a proposal for Nancy.
7. **Jay.**
   - His /account "View public profile" link still goes to /travelers. It needs custom-slug "jay-carleton" on his Memberstack record (proposed).
   - His story "Even Brave Boys Get Scared" exists as two drafts. The job: keep one, add the story photo (Nancy is getting it from Jay), link it to his profile, publish.
   - His profile bio was filled with a placeholder line (the field is required). Nancy may rewrite it.
8. **New Caledonia on Nancy's map:** keep it or remove it (no answer yet).

### Carried over from 13 Oct, still open
9. **Photo uploads on /share-photos go nowhere.** The form sends a plain GET, so files never arrive. Pick an upload target: Worker to R2 (recommended), Webflow File Upload (paid form plan) or Uploadcare. EXIF stripping (S58, option A) waits on this.
10. **Ko-fi:**
    - the Paw Passport product link (none exists yet)
    - the /faq line B wording
    - "Join on Ko-fi" needs a Ko-fi membership set up, or should be hidden
11. **One source for counts (S20):**
    - Public profiles show a typed CMS number to visitors. Nancy's says 88, while her map gives 89 plus Antarctica.
    - Her short and long bios also say "88 countries".
    - The site footer says 47 countries with stories; the home flags row shows 53. To reconcile.
12. **Change logs waiting on approval:**
    - fix-first pass (S15)
    - copy pass (S09)
    - /submit rows 1 to 9
    - /edit-profile proposal (S65)
    - EXIF plan (S58)
    - growth build design proposals (S56; reports/growth-build/design/)
13. **Decisions from 13 Oct with no answer on record:**
    - newsletter name (Gate Change, Window Seat or Long Way Round)
    - jaguar count for the Pantanal story
    - Marathon recap and the Montenegro entry for Magnus (S25)
    - Magnus's country count (sheet 11, CMS 13, map 14)
    - the "Reklame" label on the Seven Continents story
    - /for-brands link to charter rule 08
    - guides "last checked" date
    - Jay's map colors (S08)
    - several flags on multi-country stories (S11)
    - one shared Magnus across Nancy's and Jay's accounts
    - travel companions
    - the older STATUS I03 to I14 list

    Some may have been settled outside this log. Confirm before acting.

## B. Designer clicks (Nancy, or Claude Design guiding her)
- /share-photos:
  - clear the placeholder text on 6 inputs (photos, country, city, year, caption, pets)
  - set the accepted file types on the photo input
- Story template: hosted box (tll-sponsored) > Conditional visibility > "Disclosure is set".
- Pillars template: collection list tllpr-stories > filter "Pillar equals Current Pillar".
- Stories and Countries templates: hero image Load: Eager.
- Destinations and Collections templates: Sitemap indexing off.
- 301 redirects (Site settings > Publishing), then flip the slugs:
  - /countries to /destinations
  - /share to /submit
  - /gallery to /the-layover-lounge
- Google:
  - archive the duplicate GA4 property (it is grouped under Lub Bub)
  - add a Search Console Domain property, verify it by DNS and submit /sitemap.xml
  - mark the new events as key events

## C. Recommendations from Claude Code

### Functionality
1. **Link stories to people and places by reference, not by name text.**
   - Today the profile story list and the home map match bylines as text. That broke on upper-case bylines and cannot see co-travelers.
   - Add these Story fields:
     - Author (reference to Contributors)
     - Travelers (multi-reference to Contributors)
     - Pets (multi-reference to the pets collection)
     - Countries (multi-reference)
     - Cities and Airports (multi-reference; new collections or the existing map lists)
   - /submit maps its existing answers into these fields.
   - One change unlocks tagging (A5), profile story lists, pet pages, destination pages and the home map.
2. **One library, not two (A6).**
   - /stories becomes the single library: a flags or map strip at the top, then filters (country, theme, traveler, pet).
   - Country pages (/destinations/{country}) stay as country hubs, because they are the best search landing pages.
   - The /destinations index redirects (301) to /stories with that country filter, or the reverse.
   - The nav change needs Nancy's OK.
3. **Counts from one place.**
   - The map data is the source.
   - Profile count fields are written from it, never typed.
   - Bios avoid numbers so they cannot go stale.
   - Places out of 249 include Antarctica. Numbers labeled "countries" do not, and add "+ Antarctica".
4. **Finish the upload path before promoting /share-photos (A9).**
5. **Map editor:** adding or renaming a traveler uses browser pop-ups. An inline form would be clearer on phones and for screen readers.

### UX and UI
6. Home search bar and hero buttons (A1, A2).
7. **Thin profiles.** Jay's profile shows what a new member looks like: placeholder bio, no stories, few stats. Design the empty and partial states (what shows, what hides, one clear next step such as "Log your first place").
8. **Profile badges and categories.** Badge (Contributor, Frequent, Editor, Founder) and Traveler Category (Nomad, Expat, Press, Friend, Founder) overlap. Pick one visible label per profile.

### AX (agents) and SEO/AEO
9. **Facts drawn by JavaScript are invisible to crawlers and AI agents.** That covers the home flags row, the profile story list (fetched from /stories after load) and the counters. Use CMS-bound lists where possible (C1 makes this possible), so names, places and counts sit in the page HTML.
10. Finish the redirects and sitemap settings in section B. Connect Search Console; it is the biggest data gap.
11. **Country hubs as answer pages:**
    - a question-style intro with a short direct answer
    - FAQ structured data with sources
    - links in from stories that mention the country
12. Check that robots.txt allows the AI crawlers: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot and Google-Extended. Keep Organization structured data on the home page; profiles already add Person sameAs links.

### Accessibility
13. Keep 44px touch targets, visible focus outlines and reduced-motion rules on every new piece. Check that emoji in labels (the paw on pet names) read well on screen readers.

### Maintenance and cost
14. The map editor (45 KB) and the account page (41 KB) each live in one large inline code block. Every small edit re-sends the whole block, which is slow, uses a lot of tokens and risks typos. Moving them to versioned script files would make edits small. This adds new scripts, so it needs Nancy's OK first.

## D. Prompt for Claude Design
> Use OPEN-TASKS.md (this file), STANDING-RULINGS.md and the v3 folder. Design the update for functionality, UX, AX, UI, AEO and SEO. Start with C1 (stories linked to people and places) and C2 (one library), because tagging, the merge, profiles and the map all depend on them. Show each screen that changes, with its empty and partial states, and list the CMS fields it needs. Keep the TLL brand kit, WCAG 2.1 AA, visible focus and reduced motion. Copy rules: US spelling, no em dashes, no exclamation marks.
