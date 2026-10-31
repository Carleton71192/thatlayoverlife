# Expats, pets and user flows: Step 0, change log and decisions for Nancy (31 Oct 2026)

Cost: $0. Nothing bought, no accounts made, nothing sent or posted.

Everything new is **staged**. Each build has its own preview switch, remembered in your browser; `?preview=off` clears them:

| Build | Preview link |
|---|---|
| Expats | `https://www.thatlayover.life/for-expats?preview=expat` (also profiles and /edit-profile) |
| Pets | `https://www.thatlayover.life/the-paw-passport?preview=pets` (also /pets/magnus-waffles and /my-pets) |
| User flows | `https://www.thatlayover.life/account?welcome=1&preview=ux` (also any story) |

The Worker parts work only after you run `npx wrangler deploy`.

The project docs these prompts name (the build prompt, the privacy guardrails, the 12 Oct expat prompt, the paper trail prompt and the 29 Oct site review) are not in the repo or in this session. I worked from the prompts themselves, the Value Playbook artifact and what the repo shows.

The sandbox lost access to thatlayover.life during this session, so there are no live screenshots, axe runs or Lighthouse numbers. The screenshots in `scratchpad/shots-1031/` are from mocked data.

---

## Step 0: what exists

### Expats

| Piece | State | Note |
|---|---|---|
| "I live abroad" | Live | The List expats switch |
| Home base | Live, **always shown** | The 12 Oct rule says it shows only if switched on. See decision 1 |
| Places I have lived | Live | The profile's "desks", with years and places known well |
| Open to coffee with newcomers | Missing | **Built now** (see C) |
| Expat directory on /for-expats | Live | The "People who live there" list |
| Contact relay "Get in touch" | Missing | Living Library cards send people to the profile after sign-in |
| Report link on cards | Missing | **Built now** on Living Library cards |
| New-member sandbox | Missing | **Built now** for the Living Library (14 days) |
| Copenhagen City Hub, City Hosts, meetups | Missing | Design only. The landing leaves the city-hub row out until a hub exists |
| Paper trail / visa tracker | Missing | "Coming soon" tile only. Left off the landing until it exists |
| Lived / Stayed / Layover map marks | Live | |
| Pursuits and stamps | Live | |
| Continent album and Slide Show | Live | |
| Download everything | Live | |
| /expats | Draft page | /for-expats is the live one, so the rework targets /for-expats |

### Pets

| Piece | State | Note |
|---|---|---|
| Pets collection and /pets/<slug> template | Live | |
| /my-pets | Live | Its form code lives in Webflow, not the repo |
| "Travels with" | Live in code | Waits on the Worker deploy |
| Magnus Diary | Live | It owns /paw-passport/<slug>, so pet pages stay at /pets/<slug>. See decision 6 |
| Pet Notes collection | Live | Extended for the new story box. No new collection, since the CMS is at 40 |
| Magnus Cookie Index | Missing | The pet's own counter is built now ("Beaches sniffed" style) |
| Firsts | Missing | Built now |
| Forever traveler | Missing | Built now |
| /the-paw-passport | Live page | The waitlist layer is staged behind the trademark gate |

### UX

- The 29 Oct review with 12 P0s is not in the repo. `docs/redesign-plan-2026-10-31.md` turns it into 5 P0s:
  - P0.2 and P0.3 are done.
  - P0.1 is partly done: the footer binding waits for you.
  - P0.4 is partly done: alt text is in the CMS, but the templates don't bind it yet.
  - P0.5 is not done: nav focus trap, 44px targets and contrast. It needs you present for the nav.
- Already live:
  - Story share row and keep-reading grid
  - /submit autosave, every 20 seconds
  - GPS stripping on every upload
  - The sample map for visitors
- Missing before this work:
  - HEIC conversion
  - A step-by-step welcome
  - A "Next story" link
  - "In this story"
- Type in use:
  - Playfair Display 800 for headings
  - IBM Plex Sans Condensed for body
  - JetBrains Mono for labels
  - One stray Inter Tight. Teko, Syne, DM Sans, Newsreader and Inter Tight are already marked for removal.

---

## Shared: every story series in one system

Eight series now share one registry, one Worker route (`/series`, `/series/story`) and one layer (`tll-series-v1`):

- **Work trips:** The Free Evening, Plus One Day
- **Expats:** The First Friend, The Partner Who Moved Too, Moving Back
- **Pets:** First Trip Together, The Sitter Was the Hero, Cats Who Travel

**Where series live.** Stories is at Webflow's 60-field limit, so:
- A story joins a series through its **Theme**. That's the field I used, and the Theme items for all six new series are drafts.
- The template fields live on its **Story extras** item.

**What every series story gets:**
- A black washi-tape label on cards in /stories, country pages, /for-expats, /the-paw-passport and the work-trips hub, plus /stories filter chips.
- Its template fields under the story, in the writer's words.
- A dated line ("Written October 2026"; for pets, "Writer's experience, September 2026").
- A LinkedIn share link, with no SDK.
- Stories keep Article schema only.

**Rules enforced in code:**
- A sitter is named only when Permission to name is on.
- A future month is dropped.

**New Story extras fields:**
- `series-month-and-year`
- First Friend: years there, months it took, where it happened, what worked, what did not
- `moved-from-country`, `moved-to-country`, `years-abroad`
- Partner: what happened to my work, what I wish someone had told me
- `permission-to-name`
- Moving Back: strangest thing, what I kept
- `sitter-name`
- Cats: carrier or harness, where they hid

**New Theme items (drafts):**

| Series | Item ID |
|---|---|
| The First Friend | 6ae629ad8179b1a6ac4344f2 |
| The Partner Who Moved Too | 6ae629ad8179b1a6ac4344f4 |
| Moving Back | 6ae629ad8179b1a6ac4344f6 |
| First Trip Together | 6ae629ad8179b1a6ac4344f8 |
| The Sitter Was the Hero | 6ae629ad8179b1a6ac4344fa |
| Cats Who Travel | 6ae629ad8179b1a6ac4344fc |

**Linked sponsor label (staged with the expat and pet previews).** When a story has both Sponsor name and Sponsor URL:
- The existing "Reklame for" label gets the name as a link: new tab, rel="sponsored noopener noreferrer".
- With either field empty, nothing changes.

---

## Expat build

### A. "Lived in" and the mover's album
- **The count.**
  - Profiles get "[n] countries lived in" beside the map numbers, counted from countries marked Lived on the map.
  - The map sends seven numbers, one per continent, and never the country list.
  - The count is hidden when the member shows ranges.
  - Tapping it lists Places I have lived with years. Today's home is listed only if the member switched Show home base on.
- **Album captions** read "Europe · [n] countries · [n] homes" in preview. A continent with no homes drops the last part.
- **"My moves"** is a slide show with one slide per home, in order: the country, the years, one photo from their own stories there (a flag when there is none), and an optional line. It's opt-in, plays on the same projector, and the click sound is off by default.
- **Milestone badges:** First move abroad, Lived on 2 continents (counted the member's way: 7, 6 or 5 continents), and Moved back (switched on by the member). There's no ranking anywhere.
- **Download everything** now also has `places-lived.csv` and `.json`, plus `map/countries.csv` with every country as Lived, Stayed or Layover. Stamps gain a workTrip column.
- **The Person schema** on profiles keeps the country of the home base, never the city.
- **/edit-profile "05E · Your moves"** has four switches, all off until the member turns them on: Show home base, Open to coffee with newcomers, My moves, and Moved back. It also has one optional line per home.

### B. Three series
The series are built as described above. The Copenhagen hub's "How I actually made Danish friends" placeholder doesn't exist on the site; it's design only. When you write it, tag it The First Friend and it becomes the series' first slot.

### C. The Living Library
- It shows only members who:
  - switched on Open to coffee,
  - list themselves as living abroad,
  - have a Public profile,
  - and joined more than 14 days ago (the sandbox).
- **Cards** show their name in their credit mode, the home base city (only if switched on), years there, places they know well, languages, pursuits and their stories.
- **Contact:** no email, phone or handle on cards. "Get in touch" goes to their profile after sign-in; signed-out visitors see "Sign in to get in touch".
- **Order and reporting:** the order is shuffled per session, nothing is paid, and every card has a Report link (to /contact with the card named).
- The "Borrow a book" explainer is folded under the heading (draft copy).
- International House is not named on the site. Your coffee note is `docs/notes-2026-10-31/ih-copenhagen-living-library-note.md`.

### D. /for-expats landing, in one scroll
- The hero, "Your homes count too.", with "Free. No card. 16+." and the main button "Add the places you've lived".
- Three promises under "The expat group without the comment section".
- The series rows.
- The Living Library.
- Moving with a pet, linking to the Paw Passport (division paw-passport).
- The Layover Club line.

Anything with no content is left out, so a visitor never sees an empty state. No ads on the page, as before.

### E. Move pros
Pros have a new **Category** field: Pursuit expert, Road warrior, Move pros, Pet travel pros. A Move pro's story is labeled "From the Pros · Move pros". When Paid or hosted is on, "Reklame for [name]" comes first, linked with rel="sponsored noopener noreferrer". Untrusted links stay "ugc nofollow" and trusted ones are plain, as before.

### F. LinkedIn
- Every series story has the share link.
- Post ideas: `docs/notes-2026-10-31/linkedin-expat-posts.md`.
- 1200x627 share images need the story's OG image field filled. LinkedIn does not run page scripts. I can fill these once you say yes, since it changes live stories.
- The My moves share card is not built yet; its rules are in the Wrapped spec.

---

## Pet build

### A. The Paw Passport page (/pets/<slug>)
- **What it shows:**
  - Stamps by country (counted, never typed)
  - The firsts strip: train, ferry, flight, snow, beach, border, plus the owner's own
  - The pet's own counter with a flag map
  - A slide show from stories the pet is tagged in
  - "Travels with" the owner
  - A LinkedIn link
- **Who can see it:**
  - The owner picks Everyone, Members only or Only me.
  - Only me takes the page off the live site.
  - If the owner's profile is Off, the pet page is private too.
- **Forever traveler** is opt-in. It adds a small paw mark and hides the birthday month. There are no birthday nudges anywhere.
- **New Pets fields:** home-city, birthday-month, status, passport-visibility, firsts, pursuit-label, pursuit-count, pursuit-countries.
- **/my-pets** gets "Passport details" per pet, saved through the Worker. It's owner- or shared-with-only.
- **Download everything** already includes pets.

### B. "Pet-friendly or pet-tolerant?"
- The new Pet Notes fields are stayed at (name, city, URL), what we paid for the pet, size or weight rule, what made it welcoming, what we would tell the next owner, and date of stay.
- They render as a quiet card under the story with "Writer's experience, [month year]". There are no stars or scores.
- The link carries rel="nofollow ugc noopener" and opens in a new tab.
- The card says no business can pay to change or remove a note.
- **For you:** add that line to the editorial charter. I didn't edit the page, since any site publish would put it live.

### C. Three series
First Trip Together, The Sitter Was the Hero and Cats Who Travel have washi labels and template fields. The writing prompts belong on /submit; they're in the change log, and nothing is changed on the live form.

### D. /the-paw-passport landing
- The hero, "Every pet deserves a passport." Option B is in the copy doc.
- The value strip.
- Paw Passports (public pets, featured first).
- The three series.
- The five newest pet-friendly notes.
- Pet travel pros.
- "Rules last checked 31 October 2026", with links to EUR-Lex and DSB.
- The EU guide's Buy button stays hidden until you fill its link in the code and confirm the guide is checked against Regulation (EU) 2026/131.

### E. Nordic train cheat sheet
A draft is at `docs/notes-2026-10-31/dsb-pet-cheat-sheet.md`.

**Check before use:** it was written from search excerpts, because the sandbox could not open dsb.dk. One point differs from the brief: the guide-dog rule in DSB 1' and the quiet zone.

### F. Pet travel pros
- The category is built.
- Outreach draft (not sent) and the ManyChat PAW flow: `docs/notes-2026-10-31/pet-pros-outreach.md`.

### G. Sharing
- Five post ideas: `docs/notes-2026-10-31/linkedin-pet-posts.md`.
- **For you:** the OG title for pet pages is a Designer binding on the Pets template ("{Name}, {Countries visited} countries").

### H. Revenue
- The linked sponsor label is described above.
- No insurance or medical affiliate offers anywhere.
- Plush and QR pages stay behind the trademark gate.

---

## User flows

| Phase | What was done | State |
|---|---|---|
| 1 Reader flow | Story hero capped at 60vh (50vh on phones). "In this story" for stories over 2,500 words with two or more subheads. End block before the share row: Next story, then the join card for visitors. story_read_75 and next_story_click events. | Staged |
| 1 Library masthead | One-row masthead on /stories | **Not done.** Needs the live page structure; the sandbox can't reach the site. |
| 2 Gated-page template, passkeys | | **Not done.** The template needs you present for the shared components. Memberstack passkey support is to be checked in its dashboard. |
| 2 Sample map carries taps into sign-up | The sample map is live. Carrying taps through sign-up lives in the map page code in Webflow. | **Not done** |
| 3 First stamp | /account?welcome=1, three steps with a progress line (home country prefilled from the browser, countries with Lived / Stayed / Layover, one optional photo), then the passport reveal. Saved the way the map saves. first_stamp and signup_complete events. Empty map shows it once. | Staged |
| 4 Submit | | **Not done**, on purpose. Progressive steps would rewrite the live form. HEIC conversion needs a converter library (about 1 MB) and phone testing. Autosave and GPS stripping are already live. Review promise and response time: please confirm the one /submit uses. |
| 5 On this day | Stamps from this month in earlier years, on your own /account only | Staged |
| 5 Passport Wrapped | `docs/notes-2026-10-31/passport-wrapped-spec.md`, spec only | Spec |
| 6 Design system | See below | Proposed, not applied |
| 7 Speed and accessibility | | **Blocked:** the sandbox can't reach the site. Axe and Lighthouse need the host allowed in the environment's network settings. |
| 8 Events | Already in code: slideshow_play, share_click, download_everything. Added: story_read_75, next_story_click, signup_start, signup_complete, first_stamp, story_submit_start, download_complete. All through gtag, so they follow consent mode. | Staged. download_complete is live with the next release. |
| 8 Activation exploration | | **Not built.** story_submit_complete needs the /submit success hook in Webflow. The GA4 exploration "new members with first_stamp within 24 hours" is for you to build in GA4 once the events flow. |

### Design system proposal (not applied)
- **Type:** keep Playfair Display 800, IBM Plex Sans Condensed and JetBrains Mono. Remove Inter Tight (one stray use) and finish removing Teko, Syne, DM Sans and Newsreader. That's three families, inside the "four at most" rule.
- **Buttons:** the prompt asks for primary teal #00C9C8 with ink text.
  - **Conflict:** the brand kit allows bright teal only on dark backgrounds.
  - **Options:** (a) rose #C8325B filled with white text, as used today, or (b) teal #067A79 filled with white text.
  - **Your call.** The new layers use rose, 44px tall, with a 0.97 press scale.
- **Motion:** --ease-out cubic-bezier(0.23, 1, 0.32, 1), 150 to 250ms, transform and opacity only, and reduced motion respected. The new layers follow this.

### Nav and footer variant (prepared only, for a session with you)
- A one-row, 56px phone header that stays in view, with one primary action ("Join free" for visitors, "My map" for members).
- The floating "Tell the editor" button removed. Its link moves into the footer and the story end block.
- "Help and contact" in the same footer place on every page.

None of this is applied. The nav and footer are shared components, and the rule is to change them only with you there.

---

## Decisions for Nancy

1. **Home base:** it is shown on every profile today; the rule says it should show only if switched on. Should I hide it on profiles unless the member switches it on (the switch is built)? This changes every live profile that has a home base.
2. Final series names and the expat hero line: "Your homes count too." or "For the people who fill their passports."
3. Does Moved back count the original home country as Lived?
4. Which city hub comes after Copenhagen? (The Copenhagen hub itself is not built yet.)
5. Is the Living Library visible to signed-out visitors (cards only, no contact) or to members only? It's built for signed-out visitors, with contact after sign-in.
6. Pet pages stay at /pets/<slug>, because /paw-passport/<slug> is the Magnus Diary. OK?
7. The Ko-fi URL and price for the international moving guide (it stays off the landing until you send them).
8. The EU pet guide link, once it is checked against Regulation (EU) 2026/131.
9. Should /the-paw-passport be noindex until it meets the hub rule (6 stories, 3 writers, an intro)? It's live and indexed today, so this is an SEO change.
10. The button color (rose or teal #067A79).
11. The "Add the places you've lived" button links to /the-map?mark=lived. The map does not preselect Lived yet; that's in the map's own code in Webflow.
12. Members-only pet passports are hidden by the page script. The CMS page itself is still on the live site. For true members-only, the page would need Memberstack gating in Webflow.
