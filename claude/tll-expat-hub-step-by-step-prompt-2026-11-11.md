# PROMPT FOR CLAUDE CODE: That Layover Life, "Your move, step by step" expat hub (11 Nov 2026)

Saved as Nancy pasted it into the cloud session on 11 November 2026.

You are working on That Layover Life (thatlayover.life), a free travel storytelling community on Webflow with Memberstack for members. The founder and editor is Nancy Carleton, an American living in Copenhagen. Your job is to rebuild /for-expats so it takes someone through a move abroad one step at a time: deciding where to go, the paperwork, the first 90 days, finding groups, meeting a local expert, getting out to events, and eventually giving back. Work through the Webflow and Memberstack MCP tools.

Background docs in the TLL project (read the first one fully, skim the rest):
- `claude/tll-expats-page-storm-plan-2026-11-11.md` and Nancy's doc "TLL Expats Page: STORM Research and Rebuild Plan" (the research, the diagnosis of the current page, and the reference sites)
- `claude/tll-expat-build-prompt-2026-10-12.md` (expat profile fields, directory, Copenhagen City Hub, City Hosts, meetups)
- `claude/tll-expat-value-build-prompt-2026-10-31.md` (Living Library, the three story series, privacy rules)
- `claude/tll-prototype-4-claude-design-prompt-2026-10-13.md` (design system, existing Memberstack field keys)

## Why this exists

Right now /for-expats is a recruitment page. In order, it shows: a hero whose main button is "Become a Location Expert", a search that sends people off to /travelers, an empty "The experts so far" section, a full-screen map with two pins, three travel stories that aren't about living abroad, recruitment cards, a 7-field application form, an empty "No groups listed yet" section with a second form, and a third call to apply. Both forms still show "Example text". Someone who has just moved gets no resources at all.

Nancy's reference sites all do the opposite and lead with what the visitor gets: AbroadWife's resources by need, AbroadWife's expat Instagram list by country, InterNations' city communities and events, AmCham Denmark's expat events, LINK Denmark's interest groups. The new page answers "I'm moving (or just moved). What do I do, who can help, and where are my people?" in order, as steps.

## How to work (non-negotiable)

1. **Look before you touch.** Step 0 comes first. Build only on what exists, and report anything that's missing.
2. **Design, then Edit, then Implement.** Before each phase, give Nancy one change-log table with these columns: page or collection, element, before, after, what could break. Wait for her approval, then apply only what she approved.
3. **Stage, don't publish.** Nancy publishes. If she asks you to publish, space publishes about 75 seconds apart.
4. **Shared components need Nancy.** The nav, the footer and the floating "Tell the editor" button: propose changes, don't make them.
5. **Counts come from tllStates.** Never type a number the site calculates.
6. **Honest states only.** A module with no real content doesn't render. Never use "Coming soon", "Desk open", "Example text", "No items found", placeholder people or default Webflow form messages.
7. **Keep what carries data.** Keep every slug, form name, CMS field and Memberstack key that carries data. Moving a form to a new page keeps its Webflow form name.
8. **Remove before you add.** Ask before adding any third-party script or library, including Finsweet attributes. Use native Webflow CMS filtering wherever it works.
9. **No accounts, no money, no outreach.** Don't create accounts, enter payment details, submit live forms, or contact any group, creator or organization. Draft the message and Nancy sends it.
10. **Design.** Apply the Emil Kowalski design skill, the Taste Skill and the Impeccable design skill. Type: Playfair Display 800 headlines (one italic Sunset Rose accent word per H1 is allowed), IBM Plex Sans Condensed body, JetBrains Mono eyebrows, Syne only in the wordmark. Palette: Midnight #0D0F1A, Maldives Teal #00C9C8, Sunset Rose #F0507A, Cream #F7F1E8, Paper #FDF9F3, Ink #1A1A1A. Teal text on light backgrounds uses #067A79.
11. **Accessibility.** Meet WCAG 2.2 AA. Targets are at least 24px and 44px on touch. Every input has a connected label. Focus is always visible. Provide a reduced-motion version of any animation.
12. **Judge every page as three people:** a newcomer, a settled expat and an advertiser. Each must understand the page's purpose on the first screen at 390px and at 1440px.

## Voice and copy rules

- **Voice:** the smartest, best-traveled friend in the group chat who is also a comedy writer. Write body copy as full editorial sentences. Keep short punchy lines to headlines, buttons and eyebrows. Use "I" for Nancy's personal stories and "we" for the platform.
- Roast only ourselves, our decisions and inanimate objects (the tax form, the moving boxes, the IKEA instructions). Never roast a person, a place or its people. No immigration politics.
- **Words to use:** say "the partner who moved too", never "trailing spouse". "Expats" and "people who moved abroad" both work.
- **Never use:** em dashes; the verb s-h-i-p in any form; l-e-d-g-e-r; "No filler"; "Truth over polish"; "real names"; "the shelf"; "counted by hand"; hashtags. Write American English, "São Paulo" with the tilde, and never recommend Telgea.
- **Never give legal, immigration or tax advice.** Every practical step links an official source and shows "Last checked [date] by [name]".
- **Mark invented copy.** Every line you write gets a DRAFT marker in the change log so Nancy can rewrite it.

## Privacy rules (from the 12 Oct and 31 Oct builds; they still apply)

- **Location:** show a member's location as city or country only, and only if they switched it on. Never show "currently in", a street or GPS.
- **Contact:** no contact details on any public card. "Get in touch" goes through the existing relay form, or the member's chosen channel after the visitor signs in. Strangers can't message each other directly.
- **Directory order:** member directories shuffle per session. Badges never change the order. No paid placement, ever.
- **Families:** no children's names or school names on public pages.

## The experience: "Your move, step by step"

Build two levels:

- **/for-expats** is the global overview of the steps. It leads with a country picker.
- **Move to [Country]** (new CMS template, for example /move/denmark) is the same steps filled with that country's resources, groups, experts and events.

### The steps

| # | Step (DRAFT names) | What the visitor gets | Data source |
|---|---|---|---|
| 1 | **Pick your place** | Country and city picker. Country snapshot: stories from people who moved there, how many members live there (tllStates), and a link to the country page | Countries, Stories, member data |
| 2 | **Before you go** | Visa and permit starting points (official links only), what it costs (member-submitted prices with dates, if the City Hub has them), moving with pets (Paw Passport guide), the international moving guide (paid, labeled) | Move Steps, Expat Resources |
| 3 | **Your first week** | The official checklist, for example in Denmark: register your address and get a CPR number, MitID, health card, bank account, tax card, Digital Post. One line each, an official link, a last-checked stamp | Move Steps |
| 4 | **Your first 90 days** | Resources by need: Housing · Money and tax · Health · Work and partner careers · Language · Kids and schools · Pets | Expat Resources |
| 5 | **Find your people** | A groups directory filtered to the country and city, grouped by type: Social, Professional, Women, Parents and families, Sport, Language, Faith, LGBTQ+. Each group: name, what it's good for, free or paid, how to join, last checked | Expat Groups |
| 6 | **Meet a local expert** | Location Experts and Living Library members for that country, open to coffee or questions. "Ask a local" sends a question through the relay; Nancy routes it | Memberstack (existing directory source) |
| 7 | **Get out there** | The next three events in that city (official welcome events, community meetups, TLL meetups). Each links to the organizer. Hidden when nothing is upcoming | Events |
| 8 | **Settle in and give back** | Expats worth following (creators who live there), the story series (The First Friend, The Partner Who Moved Too), and three small doors: become a Location Expert, list your group, recommend a resource | Expat Creators, Stories, forms |
| ↺ | **Moving back** (a separate track, reached from a chip) | Moving Back stories, Former expats in the creator list, and reverse culture shock resources | Stories, Expat Creators, Expat Resources |

### How the steps behave

- **Journey chips under the hero:** Planning a move (jumps to step 1) · Just landed (step 3) · Been here a while (step 6) · Moving back (the ↺ track). Make them real links or buttons. They must be keyboard reachable and announce where they go.
- **Step rail:** a sticky step rail on desktop and a horizontal scroll row on phones. It shows the current step as you scroll. Each step is an H2 with an id, so it can be linked (for example /move/denmark#find-your-people).
- **Collapsing:** each step opens with one sentence of why it matters, in TLL voice, then its content. Steps 3 and 4 can collapse after the first five items, with "Show all".
- **Members' checklist (Phase 3, optional):** signed-in members can tick step 3 and step 4 items into a private "My move" checklist saved in Memberstack member JSON. It's never public and never counted publicly. Logged-out visitors see no checkboxes. Don't use browser storage for this.
- **Empty steps:** a step with no content for that country doesn't render. Instead of an empty block, the rail shows that step greyed out with one line: "Live here? Help fill this in" (DRAFT), linking to the give-back doors.

### The /for-expats overview page (top to bottom)

1. **Hero:** H1 "Moved abroad? *Start here.*" (DRAFT; Nancy may keep "Eight years somewhere beats *eight days everywhere.*" instead; ask). One line: free, dated, written by people who live there. Then the country picker as the main control, and a text link "Add the places you've lived" (opens the map with Lived selected).
2. **Journey chips.**
3. **The eight steps as a global preview.** One card per step with a one-line description and the Global resources for that step. Every card links to the country version once a country is picked.
4. **Move guides:** a row of cards for the countries that have a Move Guide (Denmark first). Only countries with a published guide appear.
5. **Living Library strip:** a few shuffled opted-in members across countries, and "See everyone" linking to the /travelers Expats tab. This replaces "The experts so far" and the full-screen map. The map becomes a thin strip and returns full size at about 25 pins.
6. **Stories from people who moved:** the three series rows. Until a row has two stories, show one combined row.
7. **Give back:** one block with "Eight years somewhere beats eight days everywhere." if it moved out of the hero, and three doors.
8. **Partner slot and Layover Club:** the partner slot is hidden unless filled and labeled "Partner" and "Reklame for [Sponsor]". The Layover Club supporter line follows.

**Leaving the page:**
- The "Claim your desk" form and the "What a Location Expert does / What you get" cards move to /for-expats/apply.
- The group form moves to /for-expats/list-a-group.
- Both forms keep their Webflow form names. Fix the "Example text" placeholders, connect the labels, and add the three-line "What is public, what is not" box from the 12 Oct prompt above each one.

## Data model

Check first whether the Webflow plan's CMS item and collection limits fit; report this in Step 0.

### New CMS collections

**Move Guides** (template: /move/[slug])
- Fields: name (for example "Denmark"), country (reference to Countries), hero photo, intro (DRAFT for Nancy), official first stop (name and URL, for example International House Copenhagen), owner (reference to Contributors: who keeps it checked), last full check (date), published.
- Add one "Global" item for the overview page.

**Move Steps** (the checklist lines for steps 2 and 3)
- Fields: title, step (option: Before you go, First week), move guide (reference), order (number), one-line why (≤160 characters), official URL, source name, last checked (date), checked by (reference to Contributors).

**Expat Resources**
- Fields: name, URL, need (option: Paperwork and visas, Housing, Money and tax, Health, Work and partner careers, Language, Making friends, Kids and schools, Pets, Moving back), step (option, 2 to 8), move guide (reference; "Global" for everywhere), type (option: Official, Community, Guide, Paid, Partner), why it helps (≤160 characters), last checked, checked by, affiliate (switch: rel="sponsored noopener noreferrer" plus a "Paid" or "Partner" badge), active.
- Within a need, sort Official and Community first. Paid and Partner items are never listed first.

**Expat Groups**
- Fields: name, URL, move guide (reference), city, type (option, as in step 5), what it's good for, free or paid, how to join, language of the group, last checked, approved (switch).
- The /for-expats/list-a-group form feeds Nancy's queue. She creates the item.

**Events**
- Fields: name, organizer, URL, move guide (reference), city, start date, type (Official welcome, Community, TLL meetup), free or paid.
- The collection list filters to upcoming dates and limits to three.
- Never show a private address or a member's home.

**Expat Creators**
- Fields: display name, from country, lives in (reference to Move Guide or Countries), city (optional), platform, handle, site URL, one-line bio, also lived in, former expat (switch), consent date (private), member (optional Memberstack ID).
- Only creators who said yes. Nancy records the consent date.

### Why everything references Move Guides

Webflow template pages can filter a collection list to "Move Guide is Current Move Guide", so each country page stays native, with no filter script. In Step 0, confirm this works for every nested list on the template. If a list can't filter that way, propose the smallest alternative and ask before adding a script.

### Local experts (Memberstack, not CMS)

- **Where they come from:** reuse whatever source the /travelers Expats tab and the expat map already use. Don't build a second one. Filter by `is-expat`, `lives-country` and the "open to coffee / answering questions" fields.
- **Location Experts:** members whose application Nancy approved get a "Location Expert" badge. If the field doesn't exist, propose one editor-only field such as `location-expert` (true or false).
- **The card:** display name, home base city (if switched on), years there (`lives-years`), places they know, languages, interests, their stories. No contact details.
- **"Ask a local":** uses the existing relay form. Add a hidden field with the move guide and an optional chosen expert, so Nancy can route the question. If the existing relay can't carry those fields, say so and propose the smallest change.
- **No experts yet:** if a country has none, step 6 shows the greyed rail state, never placeholder people.

### Schema and SEO

- **Move Guide template:**
  - Title pattern: "Moving to [Country]: your first 90 days, step by step | That Layover Life" (trim to about 60 characters if needed).
  - Meta description: 150 to 160 characters.
  - Structured data: Article with author, plus an ItemList for each step's resources and groups, and Event for events.
  - No Person schema beyond country.
- **Indexing:** keep a Move Guide `noindex` until steps 3, 4 and 5 have real, checked content. /for-expats stays indexed.
- **Links:** the country page for each guide links to it, and the guide links back.

## Phases

### Step 0: Check what exists (report only, change nothing)

1. Screenshot /for-expats at 390px and 1440px.
2. List which pieces of the 12 Oct and 31 Oct expat builds are live, staged or missing: expat profile fields, the /travelers Expats tab, the expat map source, the Copenhagen City Hub, City Hosts, the Meetups collection, the Living Library, the three story series, and the relay form.
3. Confirm the Webflow plan's CMS limits and whether template filtering by "Current Move Guide" works.
4. Find the two forms' Webflow form names.
5. Report back, then ask Nancy the open questions below in one message.

### Phase 1: Restructure /for-expats and move the forms

**Build:**
- New page order (overview) with the hero, chips, eight global step cards (content can be thin until Phase 2), Living Library strip, map reduced to a strip, stories, give back, partner slot and Layover Club.
- Create /for-expats/apply and /for-expats/list-a-group, and move the forms there with fixes.
- Remove the empty sections and the third call to apply.

**Done means:**
- No empty modules, no "Example text".
- Both forms work on their new pages with the same form names.
- Chips and the step rail are keyboard reachable.
- No sideways scroll at 390px.

### Phase 2: The collections and the Denmark Move Guide

**Build:**
- Create the six collections, the Move Guide template and the Global item.
- Draft the Denmark seed as a table for Nancy to approve before you enter anything.
- Fill only approved items.

**Draft seed list for Nancy's approval:**
- About 6 Move Steps for "First week" and about 4 for "Before you go".
- About 20 Expat Resources across the needs.
- About 10 Copenhagen groups.
- The next official welcome event and International Citizen Days, if dated.
- Each item needs its official or organizer URL, and you have to open each URL to confirm it works.
- Candidates to verify (don't take them on trust): lifeindenmark.borger.dk, nyidanmark.dk (SIRI), International House Copenhagen (ihcph.kk.dk) for registration, guidance and welcome events, skat.dk, mitid.dk, borger.dk Digital Post. Groups: LINK Denmark, AmCham Denmark's Expat Events, InterNations Copenhagen, PWN Copenhagen, IDCN Copenhagen (partner careers), plus groups Nancy names.
- Mark anything you couldn't confirm as UNVERIFIED rather than leaving it out silently.

**Done means:**
- /move/denmark renders steps 1 to 5 and 7 with approved content and last-checked stamps.
- Steps without content show the greyed rail state.
- The page stays noindex until Nancy says otherwise.

### Phase 3: Local experts, creators and the member checklist

**Build:**
- Step 6 on the template, using the existing directory source, filtered to the guide's country, with the Location Expert badge and "Ask a local" through the relay.
- Expat Creators: the list and an opt-in nomination form ("Recommend a creator", which also lets members nominate themselves).
- Draft (don't send) a short consent message Nancy can send to each nominated creator: what the listing shows, that it's free and removable, and an offer of coffee if they're in Copenhagen.
- The "My move" member checklist, if Nancy approves it.

**Done means:**
- A test member with `is-expat` on, `lives-country` Denmark and "open to coffee" on appears on /move/denmark step 6, shuffled.
- A member with those fields off doesn't appear.
- Logged-out visitors see no contact details.

### Phase 4: Upkeep and the next country

- **Quarterly re-check:** a "Needs re-check" filtered view (or a private page) listing every Move Step, Resource and Group whose last checked date is older than 90 days. This is what Nancy, a City Host or a helper works through each quarter.
- **Next country:** a short checklist for opening one (an owner who lives there, at least 6 first-week steps, 10 resources, 3 groups). Don't open any country yourself.

## Questions to ask Nancy in one message (after Step 0, before Phase 1)

1. The hero line: "Moved abroad? Start here." with the eight-years line moved to Give back, or keep the eight-years line as the hero?
2. Slug for the country guides: /move/[country] or /moving-to/[country]?
3. Launch scope: Denmark only, or also a Global guide plus Brazil or the US from her own moves?
4. Expats worth following: members only, or members plus outside creators who say yes?
5. Which Copenhagen groups are alive enough for the seed list?
6. Living Library cards for logged-out visitors (no contact) or members only?
7. Does she want the private "My move" checklist for members?
8. Who owns the quarterly re-check: Nancy, City Hosts, or a paid helper?
9. The Ko-fi URL and price for the international moving guide, and the Paw Passport guide URL.

## Final report

When you finish, report:
- Every change by phase (approved and applied).
- Every DRAFT line.
- Every UNVERIFIED seed item.
- Open questions.
- Anything you couldn't do and why.
- Costs. These should be $0; flag anything that isn't.
