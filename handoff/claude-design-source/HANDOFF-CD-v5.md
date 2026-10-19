# Handoff to Claude Design: That Layover Life v5

Paste the prompt in section 0. Upload these with it:
- this file
- COUNT-RULES.md
- OPEN-TASKS.md
- STANDING-RULINGS.md
- the TLL brand kit
- the v3 prototype folder
- screenshots of every page in the session, desktop and phone, including logged-in pages (/account, the map editor), which you cannot see

---

## 0. The prompt

> You are designing v5 of That Layover Life (thatlayover.life), a travel storytelling site where members log every country and territory they have been to and publish stories about the trips.
>
> **How it is built.** The site runs on Webflow with Memberstack. Claude Code builds whatever you design in Webflow as unpublished edits; Nancy (the owner) publishes. Read this handoff first: it says what changed this month, why, which rules are fixed, and what is still open.
>
> **Your job.** Design v5 in four sessions, in this order:
> 1. How stories link to people and places, and one library that replaces /stories and /destinations as separate lists.
> 2. The story page and the /submit form, including tagging co-travelers, pets and places.
> 3. /account (the map and the counts), profiles and /travelers.
> 4. The home page.
>
> **For every screen, give:**
> - desktop and phone layouts
> - empty, partial and error states
> - final copy
> - the CMS fields it reads
> - a short change list ("what changes, why, for whom")
>
> Flag anything that needs a new script, a new CMS field or a nav change, because those need Nancy's OK. No code until Nancy approves the screens.
>
> **Hard rules.**
> - The brand kit wins: colors, fonts and voice come from it. Your job is craft: layout, spacing, hierarchy, motion and interaction.
> - WCAG 2.1 AA, visible focus, reduced motion respected.
> - Copy: US spelling, no em dashes, no exclamation marks. Never use filed, ship, ships, shipped, ledger, "No filler", "Truth over polish", "real names", "the shelf", "on the shelf", "counted by hand", "Currently in".
> - Every count follows COUNT-RULES.md and is read from the member's map, never typed.

---

## 1. What changed this month, and why

### Counting
- **One counting rule everywhere.** Countries are places where a person on the account Lived or Stayed. Layovers are counted apart and pets have their own counts. Places out of 249 drive the percent.
  - *Why:* the same member saw different totals on one screen. For a counting site, trust is the product.
- **Antarctica has its own box** in the map editor ("Been to Antarctica", one checkbox per traveler). It counts toward Places and the percent. Next to Countries it shows as "+ Antarctica".
  - *Why:* Nancy: "people go there, but it is not a country".
- **Every country and territory can be logged** (Aruba, Faroe Islands, Curaçao and others had no map shape and could not be stamped).
  - *Why:* Nancy could not stamp places she has been.
- **Found: stale browser copies.** The browser keeps its own copy of the map, and a failed save can leave that copy marked as newest, so it keeps winning over the saved one.
  - This is why Nancy saw Faroe Islands unstamped and odd totals (87, 94, 85) in her /account audit. Her saved map says 90 places, 89 countries and 84 UN members.
  - Fix proposed in code. *Design ask:* a visible "Last saved" time and a "Refresh from my account" action.

### Home page
- **"Stories from" is now a row of circle flags**, one per country with a story, A to Z. Tapping a flag cycles through that country's stories, and countries are colored on the map by code, not by name.
  - *Why:* Nancy: "way too busy"; matching by name missed bylines in capitals.
- **The hero has two buttons** ("Read the stories", "Build your free map"). The contribution buttons moved to Chapter 02 on 12 Oct.
  - *Open:* Nancy now misses them. Decide in session 4.
- **Search bar (open bug):** it sits right of center and its hint text is cut off. *Fix:* left-aligned, full width, type sized so the whole hint fits at every width.

### Stories
- **Photos through the text** come from a short "Photo placements" record per story (section heading to photo).
  - The Schengen story had none, so all 22 photos sat at the end. Now 12 sit under their sections.
  - *Design ask:* make placing photos part of publishing a story, not a separate record.
- **Jay's first story is live** (Magnus at a dog-friendly Superman screening in São Paulo), linked to Jay's profile, Magnus and Brazil. The contributor's text was not edited.
- **The story import made four copies of one submission.** Three duplicates were deleted. *Design ask:* /submit should create exactly one draft.

### People
- **Jay has a public profile** (/contributors/jay-carleton) and appears on /travelers.
- **/travelers fills itself from the CMS.** Location Experts lists everyone whose directory record says expat (Nancy now appears), and a new row, "The travelers", lists every profile except the founder, who has her own card.
  - *Why:* the page was hand-built cards, so new members and expats never appeared.
- **"View public profile" links work for Nancy and Jay.** The site read a member field ("custom-slug") that had never been created. It now exists, and only an editor can set it.

### Support and sharing
- **Ko-fi:** the /support buttons go to ko-fi.com/thatlayoverlife.
- **/share-photos** was simplified, but uploads still do not arrive (the form has no file destination). This is the biggest functional gap.

### Words
- "Filed" and "ship/shipped" are being removed site-wide; Nancy called them AI terms. Replacements:
  - "Filed from {place}" becomes "From {place}"
  - "Filed from {Country}" becomes "Stories from {Country}"
  - "Filed by {name}" becomes "Stories by {name}"
  - "STORY FILED" becomes "HAS A STORY"

---

## 2. Fixed rules (do not redesign around these)
1. **Counts** come from the member's map only. See COUNT-RULES.md.
2. **Never touch** Memberstack blocks (elements with data-ms-*), account creation, form submissions, slugs, legal wording, or a contributor's submitted story text.
3. **Nancy's approval comes first** for the nav, the site footer and the "Tell the editor" button.
4. **No new third-party scripts or add-ons** without Nancy's OK.
5. **Sign-up age is 16 and over.**
6. **Privacy:** never show where a member is right now. Public profiles show only what the member switched on. Strip location data from uploaded photos.
7. **"São Paulo"** always takes the tilde. Protected lines stay word for word (STANDING-RULINGS.md).

---

## 3. The design asks, in order

### Session 1: stories linked to people and places, and one library
- **Story fields:**
  - Author (profile)
  - Co-travelers (profiles)
  - Pets (pet profiles)
  - Countries
  - Cities and Airports (new lists, or the map's lists)
- **What it unlocks:** tagging, profile story lists, pet pages, country pages and the home map. It also replaces matching by byline text.
- **One library:** /stories with a flags or map strip, then filters (country, theme, traveler, pet). Country pages stay as hubs, because they are the best search and answer-engine landing pages. /destinations redirects to the library with that country selected, or the reverse.

### Session 2: story page and /submit
- **The story page** shows its tags: people, pets, places.
- **Photo placement** happens while the story is edited.
- **/submit** lets a writer tag co-travelers and pets from their own account, and places from a search field. One submission makes one draft.

### Session 3: /account, profiles, /travelers
Use Nancy's research ("Fix the count, then let the map lead"). Its plan, in order:
1. **Fix now:**
   - one live count everywhere
   - list tabs that match their cards
   - one number for Magnus
   - footer labeled as story coverage
   - a legend with labeled categories in natural order (no "fewer/more" scale)
   - "Last saved" plus refresh
   - sensible defaults on "Log a place"
   - contrast on small mono text
   - hide empty embed frames
2. **Structure:**
   - a flat equal-area world map as the default (globe as an option)
   - a hatch pattern for layover-only places
   - dots for tiny countries
   - a summary band under the hero
   - empty lists grouped behind one "Lists to start" drawer
   - per-card rule notes behind an info toggle
   - one "Add a place" flow
   - a list view next to the map
   - share actions on each card
   - an "About this map" note on borders
   - per-card privacy
3. **Later:**
   - a year and timeline view
   - a free annual recap
   - airport and layover stats
   - importers
   - one-click export
   - an opt-in public page with no ranks
   - milestone notes instead of points
   - printed keepsakes
   - pet passport upgrades

**Keep these strengths** (no other tracker has them): the layover-only state, the published "What counts" rules, the side-by-side rulebooks, the pet passport, the extremes tiles and "a sticker sheet, not a leaderboard".

**Profiles and /travelers:**
- design thin and new profiles (missing bio, no stories)
- pick one visible label (badge or category, not both)
- decide where travelers, expats, press and pets sit, and what each chip filters

### Session 4: home
- search bar
- hero buttons
- the flags row and map
- one clear next step for a first-time visitor

---

## 4. Open decisions for Nancy (list them where your screens depend on them)
- New Caledonia on her map (88 or 89 countries).
- Counter denominator: 249 or 250 (the place list has 250 entries).
- Whether Denmark counts for Magnus (14 or 15).
- What visitors see as a profile's country number (written from the map, or hidden).
- Hero buttons: two or four.
- Upload destination for /share-photos (Worker to R2 recommended).
- Ko-fi Paw Passport product, the /faq line, and the membership button.
- The nav change that the one-library design needs.
