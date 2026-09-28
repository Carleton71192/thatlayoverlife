> **HANDOFF VERSION: v8 · 28 September 2026 · shareables + completion protocol.** Start with CLAUDE-CODE-PROMPT.md, then keep STATUS.md updated as you go.

# TLL Design Spec · for the live Webflow build

**Updated 28 September 2026.** Everything Claude Code needs to make thatlayover.life match the prototype. Read this with `IMPLEMENTATION-BRIEF.md`. The brief says what to fix and in what order. This file says what "matching" means.

---

## 1 · Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| Midnight | `#0A0B14` | Nav, dark sections, footer |
| Midnight card | `#16182a` | Cards on dark |
| Midnight panel | `#12141F` | Auth cards, editor panels |
| Dark border | `#23263c` | Borders on dark |
| Rose | `#F0507A` | Primary CTA, "LIFE.", accent word in headlines, identity labels |
| Rose deep | `#D63859` | Hover on rose |
| Maldives Teal | `#00C9C8` | **Dark surfaces only**: eyebrows, stat numbers, links on Midnight |
| Deep Maldives | `#067A79` | **Teal text on Cream/Paper** (AA 4.9:1). Replaces `#0a8f8e` everywhere |
| Amber | `#D98A2B` | Affiliate labels, OPEN SLOT badges. Text-safe amber on light is `#b8791f` |
| Cream | `#F7F1E8` | Page background, light text on dark |
| Paper | `#FDF9F3` | Light section background |
| Border | `#E0DACE` | Card borders on light |
| Dashed slot | `#c9b89a` | 2px dashed border on OPEN SLOT cards |
| Ink | `#1A1A1A` / `#0A0B14` | Headlines on light |
| Body | `#3a3a3a` | Body copy on light |
| Muted | `#6B6660` | Meta on light (4.5:1 on Paper) |
| Muted on dark | `#cfcbc4` body · `#7d7f96` meta | Text on Midnight |

**Retired, sweep if found:** `#0a8f8e`, `#00DCD3`, `#66FCF1`, `#C04A6B`, `#0D0F1A` (use `#0A0B14`).

**Links in body copy on light:** Ink text + `text-decoration-color:#00C9C8`, underline offset 3px.

### Type
| Role | Face | Size / weight | Notes |
|---|---|---|---|
| Wordmark | Syne 800 | 15px nav, 14px footer | ghosted italic "that" (opacity .7) + LAYOVER + **LIFE.** in Rose. Syne appears nowhere else |
| Display H1 | Playfair Display 800 | `clamp(34px, 4.2vw, 56px)`, line-height 1.02–1.08 | One italic accent word in Rose (`<em>`) |
| H2 section | Playfair Display 800 | 28–38px | |
| Card title | Playfair Display 800 | 16–22px, lh 1.2 | |
| Body | IBM Plex Sans Condensed (live) | 15–17px, lh 1.6 | Prototype uses DM Sans as a stand-in. The live font wins |
| Eyebrow / meta | JetBrains Mono 600 | 9–11px, uppercase, letter-spacing 2–3px | Teal on dark, Deep Maldives on light, Rose for member/submission eyebrows |
| Buttons | body face 600–700 | 13–15px | |

### Shape and space
- Radius: 6–8px buttons, 9–12px cards, 16–32px pills and chips, 50% avatars and flags.
- Container: 1180px (index pages), 900px (profile, support), 760px (forms), 680px (legal, charter).
- Section padding: 44–72px vertical, 24–28px horizontal. Card gap 16–28px.
- Shadow: cards on hover only, `0 12px 30px rgba(13,15,26,.12)` + `translateY(-3px)`.

---

## 2 · Components

- **Nav (dark, sticky):** wordmark · Stories · Destinations (The Map lives here) · Travelers · Paw Passport · About · [Share your story, Rose] · [Log in, outlined] or [avatar + Account]. See `screens/00-global-nav-and-chrome.html`. Memberstack bindings are live in "TLL Nav v1". Edit only with Nancy present.
- **Footer:** 3 columns (Navigate / Discover / Contribute) + wordmark + one tagline + stat strip. The stat strip numbers come from the binder, never hardcoded. The markup is at the end of `screens/36-destinations.html`.
- **Photo hero:** full-bleed image + gradient `rgba(10,11,20,.42) → .22 → .78 → .94` top to bottom. Eyebrow on a `rgba(10,11,20,.72)` pill when it sits over a photo. Min-height, not fixed height.
- **Story card:** photo top with a circle flag chip (22px, white ring) top-left and a read-time chip top-right. Below: mono meta `COUNTRY · PILLAR`, Playfair title, byline with avatar. The whole card is one link, and its accessible name is the title only.
- **OPEN SLOT card:** Paper background, 2px dashed `#c9b89a`, amber mono label, one honest line, one CTA. Never a fake name, pet, count or initials.
- **Member gate:** Rose eyebrow `MEMBERS ONLY · {PAGE}`, Playfair headline, one line of body, [Join the Travelers] + [Log in], and a "Free, and it stays free" note. The Editor's Desk gate has log in only. See the gate block inside `screens/06-about-share.html`.
- **Chips / filters:** pill buttons. Active = Midnight fill with Cream text. Inactive = white fill, `#E0DACE` border.
- **Flags:** `handoff/circle-flags/`. Code comes from the Countries `iso2` field. See that folder's README.
- **Forms:** labels in mono above the field, inputs on `#FBF7F0`, min-height 50px, `accent-color:#F0507A`. Error and success copy is specific and human. No Webflow defaults ("Oops!").

---

## 3 · Screen → route map

The markup for each screen is in `screens/` (inline-styled, so the values can be copied directly). The `{{ }}` holes are prototype data. Bind them to CMS fields or Memberstack.

| File | Live route | Gate | Status on live |
|---|---|---|---|
| 01-home | `/` | public | Mostly matches. Shelf cards still text-initials (needs photo cards) |
| 02-stories | `/stories` | public | Grid + search match. Missing: Most read / Press desk / Location experts rails, sort chips, place filter |
| 03-story-detail | `/stories/{slug}` | public | Bound to CMS. Fix hero headline clamp, byline avatar, no-JS "MIN" |
| 04-travelers | `/travelers` | public | Matches. Keep OPEN SLOT cards |
| 05-paw | `/the-paw-passport` | public | Species-inclusive copy live. Hero eyebrow pill needed |
| 06-about-share | `/about` | public | Canonical pillars live |
| 07-pen-a-tale | `/share` (→ `/submit` after 301) | members | Single long form. Needs 3 steps, keep `form[data-tll-form="submit-story"]` + input names |
| 08-travel-wire | `/travel-wire` | public | Live, reads the Worker `/wire` |
| 09-editor-desk | `/editor-desk` | editor role, NOINDEX | Not built |
| 10-country-page | `/countries/{slug}` | public | Collection template not built (collection `6a8afbd98e907b41c4da109b`, 52 fields) |
| 11-public-profile | `/contributors/{slug}` | public | Close. Bind avatar, labels, Filed From flags |
| 12-edit-profile | `/edit-profile` | members | Old design |
| 13-spotlight | `/spotlight` | public | Check body renders |
| 14-faq / 15-support | `/faq`, `/support` | public | Old design |
| 16-expats / 17-press | `/for-expats`, `/for-press` | public | Rebuild to prototype. Includes the apply flow + PR submission tool |
| 18-recruit | `/for-affiliates` | public | Rebuild |
| 19-my-pets | `/my-pets#add-pet` | members | Keep `form[data-tll-form="add-pet"]` + `section#add-pet` |
| 20-paw-passport | `/paw-passport/{slug}` | public | Old design |
| 21-pets | `/pets` | public | Live |
| 22-the-map | `/the-map` | public (personal mode for members) | Engine live. Do not replace it, restyle only |
| 23 / 24 | `/editorial-charter`, `/community-guidelines` | public | Live |
| 25-legal | `/privacy`, `/terms` | public | Add imprint block |
| 26-forgot / 33-login-signup | `/forgot-password`, `/login`, `/signup` | anonymous | Signup consent: 3-doc checkbox + "13 or older" |
| 27-contact | `/contact` | public | Old design |
| 28-cookies | `/cookies` | public | Not published. Cookie preferences link must call `CookieConsent.showPreferences()` |
| 29-share-photos | `/share-photos` | members | Depicted-persons checkbox |
| 30-share-card | OG image template | n/a | Reference for the OG service |
| 31-style-guide | internal | n/a | Reference only |
| 32-404 | 404 | public | "This page missed its connection." |
| 34-account | `/account` | members | Logged / Pawed / Written / Snapped modules, counters bound to `tllStates` |
| 35-lounge | `/gallery` (→ `/the-layover-lounge`) | public | Credit every tile honestly |
| 36-destinations | `/destinations` | public | Live. Also holds the footer markup |

`screens/prototype-logic.js` has the sample data shapes (stories, wire items, countries) and the gate copy for each page.

---

## 3b · New in this handoff (28 September 2026, second pass)

### Core traveling groups: one system
The four group landing pages share a **"FIND YOUR PEOPLE" switcher** directly under the nav: Expats · Location Experts (`/for-expats`) · Press · The Pros (`/for-press`) · Pet travelers (`/the-paw-passport`) · Creators & affiliates (`/for-affiliates`). It's a dark bar, and the active pill is Rose. Build it once as a static block and paste it into all four pages. It's in the top of `screens/05`, `16`, `17` and `18`.

### Expats landing page, rebuilt (`screens/16-expats-the-location-experts.html`)
Order: hero (two CTAs: claim a desk, find a group) → **Expat finder** → Directory → What an expert does / What you get → **Expat groups by area** form.

**Expat finder: "Find the expats in your country."**
- Search input with a country autocomplete. On the live site, bind this to the Countries collection (`name`, `iso2`). Aliases (UK, USA, UAE, Holland, Türkiye, and city names like Copenhagen) resolve to the right country.
- Quick picks with circle flags: Denmark, Portugal, Germany, Spain, Mexico, Singapore, Japan, UAE. Plus a link: "All countries by flag", which goes to `/destinations#atlas-all`.
- The result panel for the selected country has three parts:
  1. **Location Expert:** members with the Location Expert designation and `country = selected`. If there are none, show a dashed "No expert in {country} yet. Claim the {COUNTRY} desk" card.
  2. **Expat groups listed on TLL:** approved items from the Expat Groups collection for that country. If there are none, show "None listed yet. Run one? List it".
  3. **Other resources · checked by a human:** approved items from the Resources collection for that country. Each item has a type tag (OFFICIAL / FACEBOOK GROUP / GUIDE / EVENTS), a one-line note, the host domain, and a link with `target="_blank" rel="noopener nofollow"`. Include the footnote "External sites. We don't run them, we just think they're useful." and "Suggest a resource →", a mailto to `hello@thatlayover.life` with the subject `RESOURCE · {Country}`.
- If the query doesn't match a country, show an honest line: "We could not match…".
- Flags render as CSS backgrounds (not `<img>` tags bound to template holes), so no broken-image request fires before data loads.

**Seed resources, Denmark only (checked 28 September 2026):**
| Name | Type | URL | Note |
|---|---|---|---|
| International House Copenhagen | OFFICIAL | https://ihcph.kk.dk/ | The city's one-stop office for newcomers: CPR number, health card, MitID, tax card. Also runs social and info events. |
| Expats in Copenhagen | FACEBOOK GROUP | https://www.facebook.com/ExpatsInCopenhagen | Where the newbie questions go. |
| Copenhagen Expats | GUIDE | https://copenhagenexpats.com/ | Step by step: lease, CPR, the International House appointment. |
| InterNations | EVENTS | https://www.internations.org/ | Networking and social events, active Copenhagen calendar. |

Every other country starts empty on purpose. **Never add a resource nobody has opened and checked.** Resources come in through "Suggest a resource" and go live only after the editor reviews them.

**Expat groups by area (form):** Group name*, City or area*, Country, Where it lives (link), Your email* (never shown), and a checkbox: "I run or co-run this group, and it is open to new members." If a required field is missing, the error reads: "Add a group name, a city and your email, and it is on its way." Success message: "Got it. A human will look." Every submission starts as `status = in review`. The public listing shows name, area and link only.

### New CMS collections
- **Expat Groups:** name, city, country (ref Countries), link, contact-email (private), runs-group (bool), status (in review / live / declined), submitted-on.
- **Resources:** name, type (option: Official, Facebook group, Guide, Events, Other), url, host, note (≤ 140 chars, voice rules apply), country (ref Countries), checked-on (date), checked-by, status.

### Opt-in link stack ("travel linktree")
- **Types:** Blog or website, Newsletter, Instagram, TikTok, YouTube, Strava, Anything else. **Pets:** Instagram, TikTok, YouTube.
- **Every link defaults to HIDDEN.** A link shows only when its switch is set to SHOWN *and* it has a URL. Store it in Memberstack custom fields `link-{type}` + `link-{type}-on`. Pets store theirs as Pets CMS fields.
- **Where links are entered:**
  - **Sign up:** an optional collapsible section with website, Instagram and TikTok, each with its own switch.
  - **Edit profile:** all seven.
  - **My pets:** the pet's own accounts.
- **Where links are shown:**
  - Public profile ("Find {name} elsewhere"): stacked rows with badge, label and URL.
  - Travelers card: up to 4 chips.
  - Expats directory card.
  - Pet passport ("Follow {pet}"), plus the Paw hub chips, which only render when at least one pet link is shown.
- **Rendering:** outbound links use `rel="noopener nofollow ugc"` and open in a new tab. Affiliate links still need the inline Reklamelink marker.

### Travelers page, rebuilt (`screens/04`)
Filter chips: Everyone · Founder · Location Experts · Press · Travel companions. The page has four sections, each with honest open slots and a CTA to its group page. Never add a fake name, city expert or pet.

### Footer
Four columns, matching the live footer: Navigate · Discover · Contribute · TLL. The markup is at the end of `screens/36`.

### Atlas
`/destinations` keeps the "Every country · by flag" grid of all countries. Its counts are computed from the data, not typed in ("Countries with a published story: N. The other M are open until someone files.").

## 3c · Traveler directory: expats, creators, press (28 September 2026)
Boards are in `screens/32-directory-boards-expats-creators-press.html` (D0–D8), each shown at 1280 and 390. The full build instructions are in `CLAUDE-CODE-PROMPT.md` §3.

- **D0 · Interest tags (PROVISIONAL):** 26 tags in 6 groups: Daily life · Family · Work + money · Health · Hobbies · Identity + community.
- **D1 · Profile editor:**
  - Three toggle rows (Expat / Creator / Press). An on toggle turns dark.
  - Expat fields: lives in, city (optional), knows, languages, and tag chips (max 5).
  - A link-tree builder with every row HIDDEN by default.
  - A contact radio: not accepting contact, or reach me on a platform I already use.
- **D2 · Public profile:**
  - A dark header with labels, name, and "Lives in X · Knows Y, Z".
  - Tags, TLL stories, and the external portfolio as outbound links.
  - A "Find {name} elsewhere" block, one "Get in touch" button, and "Report this profile".
- **D3 · /expats:**
  - Search, filters (lives there / has lived there, language, contact open, format), and tag chips.
  - A shuffled grid headed "N EXPATS ON THE MAP · SHUFFLED".
  - A one-card state, and an invite card to fill out sparse grids.
- **D4 · /creators:** the same card pattern plus a monetization label (amber).
- **D5 · /press:** Verified press badge (teal) and a press-trip board teaser. `/press-trips` cards show HOSTED TRIP (rose), a deadline chip, and covered / wants / posted by / apply, plus the Danish disclosure note.
- **D6 · Country block:**
  - "Expats who know {Country}", split into lives there now / has lived there, next to the "Where expats already gather" resources.
  - Empty state: "Nobody here yet. Lived in {Country}? Put yourself on the map."
- **D7 · Link-out card:** the platform badge replaces the flag. "COUNTRY · OPENS ON {PLATFORM} ↗". A gate chip sits bottom-left on the thumbnail.
- **D8 · Share fork:** "Write it here" (dark card) vs "Link to it" (rose outline). The link path asks for link, title, country, one-line summary and the gated checkbox. The light-pass line is shown below it.

**Platform badges:** 24px circles with mono letters.
| Badge | Background | Text |
|---|---|---|
| IG | Rose | white |
| TT | Ink | teal |
| YT | `#C8425E` | white |
| SS | Amber | ink |
| BLOG | `#067A79` | white |
| MAG | `#3a3a3a` | white |

**Label colors:**
| Label | Color |
|---|---|
| CONTACT OPEN | teal on `#e2f3f2` |
| EARNS FROM AFFILIATES | amber on `#fbf0df` |
| ✓ VERIFIED PRESS | white on `#067A79` |
| HOSTED TRIP | white on `#C8425E` |
| SAMPLE · NOT A MEMBER | `#b8791f` mono (every non-real card) |

## 4 · Copy rules
- Voice: National Park Service sign, dry, quirky. Lonely Planet × Klarna. Never "campfire".
- No em dashes. Dates are "19 September 2026". "Reviewed within 48 hours", never "published". "Every byline a real person". No anti-AI headline claims.
- Five pillars only: Layover Guides · Paw Passport · Travel Logistics · Cultural Intelligence · Stories From the Road. No vibe collections.
- Contact address everywhere: `hello@thatlayover.life`.
- Never invent facts, quotes, stats, people, pets or photo credits. OPEN SLOT instead.

## 5 · Done means
Every screen in §3 matches its file at 1440px and 390px. Teal passes AA on every light surface. No hardcoded counts. Contracts from the brief intact. Published to www + apex + subdomain, and checked with `?v=` cache-busters.
