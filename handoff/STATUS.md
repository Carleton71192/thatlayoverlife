> **HANDOFF VERSION: v8 · 28 September 2026 · shareables + completion protocol.** Start with CLAUDE-CODE-PROMPT.md, then keep STATUS.md updated as you go.

# STATUS · fill this in as you work

**Rules:** one row per ID, no merging. Status is one of TODO, In progress, Done, Partial, Blocked, N/A, Deferred. **Done needs evidence**: the live URL with `?v=` and what you saw. Partial says exactly what is left. Blocked says who or what it waits on. Update this file after every item, commit it, and print the summary line at the end of every session.

Summary: TODO 111 · Done 1 · Partial 1 · Blocked 14 · N/A 0 · Deferred 0

| ID | Item | Status | Evidence / what is left |
|---|---|---|---|
| A01 | No em dashes in any live copy, meta or alt text | TODO |  |
| A02 | Vibe collections gone (Sunset Mist, Desert Glow, Alpine Escape, Wild Routes, Salty Air) | TODO |  |
| A03 | Anti-AI marketing gone ("not chatbots", "0 stories by a chatbot", "written by humans" as a | TODO |  |
| A04 | Dates read "28 September 2026". No "September 28, 2026", no numeric dates | TODO |  |
| A05 | Teal #00C9C8 only on dark surfaces. #067A79 for teal text on cream/paper. Body links on li | TODO |  |
| A06 | Type: Playfair Display 800 headlines, IBM Plex Sans Condensed body, JetBrains Mono meta. S | TODO |  |
| A07 | hello@thatlayover.life is the only contact address on the site | TODO |  |
| A08 | Sign-up age checkbox says "I am 16 or older" | Done |  https://www.thatlayover.life/signup?v=20260928 (live already: checkbox label "I am 16 or older.", input name age-16) |
| A09 | "microchip", "titer/titre", "FAVN" absent from UI, forms and marketing. Exempt: the Paw Pa | TODO |  |
| A10 | Every publish goes to both custom domains + the Webflow subdomain, checked with ?v= | TODO |  |
| A11 | TLL Nav v1 Memberstack blocks untouched. Logged out shows Log in; logged in shows avatar + | TODO |  |
| A12 | No invented people, pets, photo credits, quotes or stats. Empty slots say OPEN SLOT / COMI | TODO |  |
| A13 | "Every byline a real person" and "reviewed within 48 hours" (never "published within 48 ho | TODO |  |
| A14 | The photo feature is called "The Layover Lounge" everywhere | TODO |  |
| A15 | Preservation: no published story, binding, data-ms-* attribute, element ID or form input r | TODO |  |
| B00 | Global nav | TODO |  |
| B01 | Home | Partial | Staged unpublished 28 Sep: hero eyebrow, H1 "Find your next somewhere.", sub, shelf label (6 stories, static until the count binds), Doors opening block, newsletter line + success copy, map headline "Where the Travelers have been." + CTA, Paw eyebrow/H2/sub, Magnus meta (3 yrs, 13 countries), Lounge eyebrow + sub, hero strip hidden (fc03d2d5…c2c5, visibility off). Kept against the design on purpose: "The Layover Lounge" (A14 beats screen 01 "Travel Lounge"), the live Magnus line instead of the PLACEHOLDER quote (I03), and the body line about submissions, since Share Your Story is live. Left: shelf photo cards (design-spec note), the map headline logged-in variant, the writer count and shelf count bound to data (B38/A12), the 3-step block the design does not have. Evidence URL after publish. |
| B02 | Stories index | TODO |  |
| B03 | Story detail (ledger, route strip, Been/Want) | TODO |  |
| B04 | Travelers | TODO |  |
| B05 | Paw Passport hub (+ groups switcher) | TODO |  |
| B06 | About | TODO |  |
| B07 | Pen a Tale submission (members gate, Write/Link fork) | TODO |  |
| B08 | Travel Wire | TODO |  |
| B09 | Editor desk (role gate, NOINDEX) | TODO |  |
| B10 | Country page | TODO |  |
| B11 | Public profile (link stack) | TODO |  |
| B12 | Edit profile (three toggles, link stack editor) | TODO |  |
| B13 | Spotlight (honest slots only) | TODO |  |
| B14 | FAQ | TODO |  |
| B15 | Support (+ Layover Club) | TODO |  |
| B16 | For expats (finder, directory teaser, groups form) | TODO |  |
| B17 | For press | TODO |  |
| B18 | For affiliates / creators | TODO |  |
| B19 | My pets (+ Pack request) | TODO |  |
| B20 | Public Paw Passport (+ The Pack) | TODO |  |
| B21 | Pets index | TODO |  |
| B22 | The Map (chrome only, engine untouched) | TODO |  |
| B23 | Editorial charter (+ rule 08 DRAFT) | TODO |  |
| B24 | Community guidelines | TODO |  |
| B25 | Privacy + Terms | TODO |  |
| B26 | Forgot password | TODO |  |
| B27 | Contact | TODO |  |
| B28 | Cookies | TODO |  |
| B29 | Share photos (members gate, depicted-persons consent) | TODO |  |
| B30 | Story share card / OG preview | TODO |  |
| B31 | Style guide (reference, no route) | TODO |  |
| B32 | Directory boards (reference for group C) | TODO |  |
| B33 | Answer guides (DRAFT banner) | TODO |  |
| B34 | Layover Awards | TODO |  |
| B35 | For brands (no prices) | TODO |  |
| B36 | 404 | TODO |  |
| B37 | Login + Sign up (consent block) | TODO |  |
| B38 | Account (real counters, lists, Wrapped, export) | TODO |  |
| B39 | The Layover Lounge (truthful credits) | TODO |  |
| B40 | Destinations (every country by flag) | TODO |  |
| B41 | Global footer (GUIDES + WORK WITH US rows) on every page | TODO |  |
| C01 | Memberstack custom fields: is-expat, is-creator, is-press; lives-country, lives-city, live | TODO |  |
| C02 | Directory CMS collection synced from opted-in members only. Toggle off removes on next syn | TODO |  |
| C03 | /expats directory page | TODO |  |
| C04 | /creators directory page | TODO |  |
| C05 | /press directory page + manual Verified flag | TODO |  |
| C06 | /press-trips board + Press Trips collection. Trips hide after deadline, all labeled "Hoste | TODO |  |
| C07 | Expat block on every country page, correct with 1 card, honest empty state | TODO |  |
| C08 | Resources collection + the 4 Denmark seeds exactly as in DESIGN-SPEC §3b. No other country | TODO |  |
| C09 | Expat Groups collection + groups form, status starts "in review", email never shown | TODO |  |
| C10 | Link-out stories: external-url, platform, gated fields; /share fork; "Opens on {platform}  | TODO |  |
| C11 | Contact without exposure: only Instagram, wa.me/message/… (reject wa.me/{number}), or rela | TODO |  |
| C12 | Shuffled on every load, never ranked, no paid placement | TODO |  |
| C13 | "Report this profile" on every directory card; relay form rate-limited | TODO |  |
| C14 | Interest tags as a CMS option list (PROVISIONAL), not hardcoded | TODO |  |
| C15 | Opt-in link stack renders on public profile, Travelers card (max 4 chips), expats card, pe | TODO |  |
| C16 | "Find your people" switcher on /for-expats, /for-press, /the-paw-passport, /for-affiliates | TODO |  |
| C17 | Expat finder: autocomplete from Countries, aliases, quick picks with circle flags, result  | TODO |  |
| C18 | Seed: Nancy is the only real directory member. Never render her WhatsApp or email | TODO |  |
| D01 | Story ledger (8 rows, "Contributor to add" when empty) + new Stories fields + correction m | TODO |  |
| D02 | Route strip renders only when route-stops is filled | TODO |  |
| D03 | Been here / Want to go toggles, stored in member JSON tllPlaces (never tllStates) | TODO |  |
| D04 | Your lists on /account, member JSON tllLists | TODO |  |
| D05 | Layover Wrapped card on /account with quiet-year fallback + wrapped-hidden field | TODO |  |
| D06 | Export my data as an email request (JSON + Markdown within one month) | TODO |  |
| D07 | Two answer guides with H3 questions, sources, ledger, DRAFT banner kept until Nancy checks | TODO |  |
| D08 | /awards nomination form (members only) + Award Nominations collection. No public tallies | TODO |  |
| E01 | /for-brands page, no prices, mailto subject PARTNERSHIP | TODO |  |
| E02 | Charter rule 08 + #paid-work block, labeled DRAFT until Nancy approves | TODO |  |
| E03 | Layover Club on /support #layover-club, buttons disabled "COMING SOON"; club-supporter boo | TODO |  |
| E04 | Paw guide sales block: "V1.0 · INCL. 25% MOMS", cites Regulation (EU) 2026/131 | TODO |  |
| E05 | Footer WORK WITH US row: For brands · The Layover Club · How paid work works | TODO |  |
| E06 | Labeling mechanism: Reklame before sponsored headlines, Reklamelink beside affiliate links | TODO |  |
| F01 | Members/anonymous split on /share, /share-photos, /my-pets, /edit-profile, /account, /edit | TODO |  |
| F02 | Editor desk: role gate, log-in only (no join CTA), NOINDEX | TODO |  |
| F03 | Never gated: public profiles, /paw-passport/{slug}, /countries, /travel-wire, the Lounge,  | TODO |  |
| F04 | Profile click goes straight to /account (no interstitial, no "shelf is a door" flicker); c | TODO |  |
| G01 | Counting engine: headline base (UN 193 default, pending Nancy), bonus places chip, tier la | TODO |  |
| G02 | Data hygiene: ignore/remove non-ISO keys (the "undefined" entry) before any count or card | TODO |  |
| G03 | Percent card: master 1080×1920, feed 1080×1350, link 1200×630, light + dark | TODO |  |
| G04 | Map card: precomputed Equal Earth SVG from world-atlas 50m, clipped ~60°S, Antarctica badg | TODO |  |
| G05 | Passport: cover + stamp page (shape encodes type, border encodes tier), MRZ strip with no  | TODO |  |
| G06 | Pet passport + pet map: 5 sections, paw-ring cover (never stars), joke ID string | TODO |  |
| G07 | Duo card: human rose, pet striped purple + stroke, shared count | TODO |  |
| G08 | Pack card (approved pack friends only; open slots when fewer than 9) | TODO |  |
| G09 | Share flow: "Make my card" then "Share". modern-screenshot 4.7 in the browser. Fallbacks:  | TODO |  |
| G10 | Privacy panel "Who gets to see this?": Memberstack fields share-level (off/unlisted/public | TODO |  |
| G11 | Public page /p/{handle} (public) and /p/{slug} (unlisted, noindex). Off = private message. | TODO |  |
| G12 | Empty, new-member and quiet-year states for every card (15 states) | TODO |  |
| G13 | Alt text generated from data for every card; repeated as live text on /p/ | TODO |  |
| G14 | Accessibility: Ink text on rose chips; rose vs light teal never the only difference; pet p | TODO |  |
| G15 | Never shown: dates, current city, "currently in". Years only on stamps. EXIF stripped. Pet | TODO |  |
| G16 | Per-member OG images via a server route (Webflow Cloud /p). PHASE 2: only after G01–G15 ar | TODO |  |
| H01 | "The Pack" on /paw-passport/{slug}: approved friends only, grid, open slots when fewer, "H | TODO |  |
| H02 | /my-pets: add a friend by handle → request to the friend's human → shows only after approv | TODO |  |
| H03 | Pack Links collection: pet, friend-pet (ref) or friend-ig-handle, friend-photo (uploaded b | TODO |  |
| H04 | No scraped or embedded Instagram posts or photos | TODO |  |
| I01 | Sitemap + robots.txt (Site Settings → SEO) | Blocked | Waiting on Nancy |
| I02 | 301s /share→/submit, /gallery→/the-layover-lounge, then flip slugs | Blocked | Waiting on Nancy |
| I03 | A real Magnus quote to replace the placeholder | Blocked | Waiting on Nancy |
| I04 | AMSOC full name and URL (Brazil resource) | Blocked | Waiting on Nancy |
| I05 | Her headline count base (UN 193 / 195 / 250) | Blocked | Waiting on Nancy |
| I06 | Final tier names | Blocked | Waiting on Nancy |
| I07 | How existing "layover" map entries migrate (default Escaped recommended) | Blocked | Waiting on Nancy |
| I08 | Magnus: add Denmark? Kosovo as bonus under UN 193 | Blocked | Waiting on Nancy |
| I09 | Confirm companion purple #7C5CBF | Blocked | Waiting on Nancy |
| I10 | Layover Club price + Ko-fi link | Blocked | Waiting on Nancy |
| I11 | Approve charter rule 08 | Blocked | Waiting on Nancy |
| I12 | Guide PDF checked against Regulation (EU) 2026/131 and 2026/705 | Blocked | Waiting on Nancy |
| I13 | Magnus's real pack friends: handles + their humans' OK | Blocked | Waiting on Nancy |
| I14 | Short GDPR review before public travel profiles go live | Blocked | Waiting on Nancy |
