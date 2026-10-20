# Change log for approval: Packet B, home (20 October 2026, prototype 3.3)

Source: HOME-3.3-HANDOFF.md items 1 to 5, the 3.3 standalone prototype (home screen, copy saved in handoff/packet-a/prototype-home-copy.txt), STANDING-RULINGS.md and COUNT-RULES.md. Nothing in this log is built. Packet A (nav, footer, floors, widget, story template links) is published separately and is not repeated here. Counts bind to tllStates. Publish only on your word.

Today the home page is the 3.2 build: hero, then Chapter 01 Start reading (the library and search), 02 The community engine ("You went. Write it down."), 03 The passport ("Track how you see your world."), 04 The map, with receipts ("Every place you have been, in one spot."), 05 Paw Passport, 06 The Layover Lounge, 07 The newsletter. The 3.3 prototype keeps seven chapters but merges 03 and 04 into one dashboard chapter, adds an expat chapter, and moves the community chapter to position 06 as "The first 100".

## B1 Hero

Today: H1 "Find your next somewhere.", the coordinates caption, the vertical "A travel magazine..." line, "Scroll · the world is long", two CTAs.

| # | Change |
|---|---|
| B1.1 | H1 stays "Find your next somewhere." One line under it: "Stories from the people who went, and a map of everywhere you have been." |
| B1.2 | Two CTAs: "Read the stories →" (/stories) and "Build your free map" (/the-map). Under them the free line "FREE, FOREVER. NO CARD, NO PAYWALL." |
| B1.3 | The vertical "A travel magazine..." line and "Scroll · the world is long" are removed. The coordinates caption stays at 12px (floor from Packet A). |
| B1.4 | The hero photo and the "Hero photo taken at" caption keep their current binding. |

## B2 Chapter 01 · The stories

Today: eyebrow "Chapter 01 · Start reading", H2 "Trips that can't wait for payday.", intro paragraph, then "The library." with nine story cards and "Search it".

| # | Change |
|---|---|
| B2.1 | Eyebrow "01 · THE STORIES". H2 "Trips that can't wait for payday." stays. Intro: "Read about the places people went, then make a plan that begins with one open tab and ends with a national park, a layover, a dog, or a marathon entry you will defend to your accountant." |
| B2.2 | The library becomes the story rail from the prototype: each card is avatar (40px), contributor name, role eyebrow, then a 4:5 image with the place label, title, "{pillar} · {minutes}". Chips 44px. Cards scroll sideways with the cue "{n} stories · They move sideways →", n from tllStates. |
| B2.3 | Order: bylines that are not Nancy's first, then by date. Nine cards become the eight newest ("{n} PUBLISHED SO FAR · THE EIGHT NEWEST HERE", then "Read the stories →"). |
| B2.4 | "More landing weekly." under the rail, where "Already published" sits today. |
| B2.5 | Search stays: "Search it", "Find the country, layover, dog problem, or question your current itinerary has created.", the TRY chips, the empty state "Nothing for "{query}" yet. It grows weekly." |

## B3 Chapter 02 · Your travel dashboard (merges today's 03 The passport and 04 The map)

Today: two chapters, "Track how you see your world." with "Open the passport →" and "Every place you have been, in one spot." with "Build your map →" and "Read it →".

| # | Change |
|---|---|
| B3.1 | One chapter. Eyebrow "02 · YOUR TRAVEL DASHBOARD". H2 "Every place you have been, in one spot." Body: "Countries, lists, pets, a public page you can send to a friend, and at the end of the year, your Layover Wrapped. It builds itself from the places you add." |
| B3.2 | One CTA to /the-map. Logged out: "Build your free map" and under it the public map embed of Nancy's map (the live map embed, `?mode=public&embed=1`) with the count line from tllStates: "{countries} countries{ + Antarctica} · {layovers} layovers beside · {places} of 249 places". Logged in: the member's own map and "Open your dashboard". |
| B3.3 | Under the map the caption "COUNTED FROM THE MAP, NEVER TYPED", then the three-step strip: "01 · PROFILE Sign up and your page is live in a minute, story or no story." "02 · STORIES AND PHOTOS Add a trip or a frame. It lands on your page and in the library." "03 · THE MAP Every place you add fills in. Lists, pets and Wrapped follow from there." |
| B3.4 | Never "0 / 249" and never "be the first" for a visitor: when tllStates has no public map, the count line is hidden rather than shown empty. |
| B3.5 | Today's passport chapter (Chapter 03, "Track how you see your world.", "Open the passport →" to /my-passport) is removed from home. /my-passport itself is unchanged. |

## B4 Chapter 03 · Living there, not passing through (new)

Today: no expat chapter on home.

| # | Change |
|---|---|
| B4.1 | Eyebrow "03 · LIVING THERE, NOT PASSING THROUGH". H2 "Moving somewhere? Someone here already did." Body: "For the people who stay. Moving guides written by members who made the move, visa trackers that remember the dates so you do not have to, and lifestyle hubs for the city you are learning to call home." |
| B4.2 | Three cards, text only, no invented guides: MOVING GUIDES "The paperwork, in the order it happens. Registration, bank, phone, doctor, the one office that closes at two. Written by someone who stood in that line." VISA TRACKERS "The dates, remembered for you. Permit renewals, Schengen days, the appointment you booked eleven months ago. One list, with reminders." LIFESTYLE HUBS "The city, after the boxes are unpacked. Where members in your new city run, eat, swim and find a vet. Updated by the people who live there." |
| B4.3 | CTA "Go to For expats →" (/for-expats). Status line "OPENING WITH THE COUNTRIES OUR MEMBERS LIVE IN". |

## B5 Chapter 04 · Paw Passport

Today: "Chapter 05 · Paw Passport", H2 "Traveling with your bestie, whatever the species.", one paragraph, "Open the Paw Passport →".

| # | Change |
|---|---|
| B5.1 | Renumbered "04 · PAW PASSPORT". Eyebrow line above it "MAGNUS · SAMOYED · 35 KG · {n} PLACES", n from tllStates (the pet count), nothing typed. |
| B5.2 | H2 and paragraph stay: "They get a passport, a country count, and veto power over the hotel. Magnus was simply first." CTA "Open the Paw Passport →" (/the-paw-passport). |
| B5.3 | One added sentence: "The EU pet travel guide: every step the law requires, in order, with the forms and the prices." and the button "Get the guide · €9" with the small line "ON KO-FI". The Ko-fi URL is open (your call), so the button is built with the link empty and hidden until you give the URL. |

## B6 Chapter 05 · The Layover Lounge

Today: "Chapter 06 · The Layover Lounge", H2 "The Layover Lounge.", "The photos that made the next trip look affordable.", paragraph, "See the Lounge →", "Send a photo", five "Greetings from" cards.

| # | Change |
|---|---|
| B6.1 | Renumbered "05". Copy unchanged: "The photos that made the next trip look affordable." and "Send the view that made you open another tab, check flight prices, and start doing the maths for a trip you said was not happening this year. We credit every frame." CTAs "See the Lounge →" (/gallery) and "Send a photo" (/share-photos). |
| B6.2 | The postcard caption format from the prototype: "TLL PAR AVION GREETINGS FROM {place}". The five cards keep their current images and places. |

## B7 Chapter 06 · The first 100 (today's Chapter 02, moved)

Today: "Chapter 02 · The community engine", H2 "You went. Write it down.", paragraph, "Send your trip →", "Send a photo".

| # | Change |
|---|---|
| B7.1 | Moves to position 06. Eyebrow "06 · THE FIRST 100". H2 "You went. Write it down." Body: "Send us the trip you keep telling people about, the national park you drove six hours to reach, or the dog whose itinerary was better than yours. We edit lightly, keep your byline, and publish the moment it passes the submission rules. The first hundred members get a founding badge and a direct line to Nancy." |
| B7.2 | CTAs "Send your trip →" (/submit) and "Send a photo" (/share-photos), then the eyebrow "WHAT FOUNDERS GET". |
| B7.3 | The founders strip: "FOUNDING 01 Nancy Carleton · Founder · Copenhagen · abroad since 2018", "FOUNDING 02 Jay Carleton · Seven marathons, seven continents, never crosses the line first" (links to /contributors/jay-carleton), "FOUNDING 03 · PET Magnus Waffles · Samoyed · 35 kg · {n} places · advisory capacity" (n from tllStates), "OPEN SLOT 04 Your profile could be here.", "OPEN SLOT 05 Ninety-six more after this one." The two open slots link to /signup. |

## B8 Chapter 07 · The Layover Letter

Today: "Chapter 07 · The newsletter", H2 "Your inbox deserves better than deals.", a plain GET form with no handler (see the Phase A log, newsletter capture).

| # | Change |
|---|---|
| B8.1 | Eyebrow "07 · THE LAYOVER LETTER". H2 stays. Body: "One story a week, Sunday morning, Copenhagen time. No schedule we would break to send you a deal. Unsubscribe anywhere." Field "Your email", button "Send it →", done state "You're in. One story, every Sunday, 09:00 Copenhagen time." |
| B8.2 | The form posts to the newsletter route on the approved Worker (Mailchimp, double opt-in, consent checkbox) once the Phase A newsletter line is approved; until then it stays a Webflow form so nothing is lost. |

## B9 Closing line

| # | Change |
|---|---|
| B9.1 | Under the letter: H2 "Where did your last {word} take you?" with the rotating word from the prototype, then "Build your map →" (/the-map) and "Read the stories" (/stories). |

## B10 Shared rules on the page

| # | Change |
|---|---|
| B10.1 | Every number on the page reads from tllStates: the story count in the rail cue and the library line, the countries, layovers and places in the dashboard line, Magnus's places in 04 and 06. Nothing typed. The one-count-function fix (COUNT-RULES.md, section 7, timestamp after a successful save) is a separate item and is not part of this packet. |
| B10.2 | 12px floor and 44px targets from Packet A apply. Rails scroll sideways with the cue; no horizontal page scroll. |
| B10.3 | Copy rules: US English, no em dashes, no exclamation marks. The words filed, ship, ledger, the shelf, counted by hand, No filler and Truth over polish do not appear. "The library." stays as the section title you chose on 13 October. |
| B10.4 | Schema on home (WebSite and Organization) is unchanged. The Ahrefs audit of 20 October lists 66 pages with schema validation errors; that is the story Article block, handled in Packet A item A5, and will be rechecked after the Packet A publish. |

## Test report with this packet

Screenshots at 1440 and 390 of each chapter against the matching 3.3 prototype frames; the logged-out and logged-in dashboard states; the count line on a visitor's view; the Ko-fi button hidden state; the founders strip links; one newsletter submission landing in Webflow Forms.

## Open for you

1. Ko-fi URL and whether the guide button shows before the guide exists (B5.3).
2. The dashboard map embed for visitors: Nancy's public map, as the prototype shows, or a static picture of it (B3.2).
3. The founders strip: Jay's one-liner as written, or his own words (B7.3).
4. The closing rotating word list (B9.1): the prototype's words, or your own.

Reply with the line numbers to approve or change.
