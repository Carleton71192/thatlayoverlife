# CLAUDE CODE · COPY + COUNTS UPDATE · 20 October 2026 (evening)

Follows the 20 October packet and BETA-READY (both already sent). This packet adds: the voice update, new Home copy, one source for Nancy's count, the Home rail cap, chip spacing, and the site-lab fixes. Change log for Nancy first. Publish nothing until she approves.

## Files
- `TLL Site Prototype 3.4 (standalone).html`: current prototype. Copy on Home, Travelers and About is final for this round.
- `STANDING-RULINGS.md`: CLAUDE.md as of tonight. New **Voice update** line (frequent traveler + expat register, short and punchy, no stacked adjectives, "Counted from your map", no "never typed" in UI copy). UAE added to Nancy's facts.
- `COUNT-RULES.md`: unchanged; governs the source of every number.
- `CC-RECS-2026-10-20.md` + `tll-site-lab-2026-10-20.md`: story-page bugs and the R1 to R7 groups. **R1 ships with the beta.**

## 1 · Copy (take the text from the prototype, not older handoffs)
Home, chapter by chapter:
- Hero sub: "For people who have slept on an airport floor and would do it again."
- 01 Stories: "Read where the cool kids went. Then plan your own adventure." Search hint: "Type a country. Your carry-on is already packed."
- 02 Dashboard: "Every stamp, every stopover, one map. Plus inspo for the next one." Label "COUNTED FROM YOUR MAP". Logged-out map label: "THIS IS NANCY'S MAP. LOG IN TO SEE YOURS." Steps: "Sign up. You are live." / "Add a trip. Or the photo from the gate." / "Nobody likes a blank map."
- 03 Expats: H2 "Meet the locals *who used to be you.*" New checklist "YOU ARE ONE OF US IF" (four lines, rose check, top-aligned beside the H2): "Your checked bag is 23 kg of snacks from home." / "You translate spices in the grocery aisle." / "You have a residence card and opinions about it." / "The world feels smaller. In a good way." Then "They wrote the guides. Ask them anything." Cards: "From someone who cried in that line." / "Never miss a renewal again." / "Where to eat, run and get a haircut." Small label: "OPENING CITY BY CITY, WHERE OUR MEMBERS LIVE". No Schengen in general expat copy.
- 04 Paw: "Muddy on side quests. A heated blanket on your face at 6 a.m. Your bestie sees the world too. Grandma wants the photos." Guide line: "The EU pet travel guide. No surprises at the border."
- 05 Lounge: "The view that made you check flights at midnight. Send it."
- 06 First 100: "The rebooked flight. The night on the gate floor. The best meal of your life in someone's kitchen. Write it. First 100 get a founding badge." Open slots: "Your face could be here." / "Ninety-six more seats. Window or aisle?"
- 07 Letter: "One story. Sunday morning. Lounge wine optional." (Signup form keeps Copenhagen time and unsubscribe.)

Travelers hero sub: "Everyone on TLL, in one place. Find a local expert, a travel writer or a pet with a passport, and see where they have been."

About: Nancy's letter is shortened (see prototype). Stats bind as in 2.

## 2 · Counts: one source for Nancy
Home dashboard line, The Map strip, About ("countries with a story" + "The country count stands at {n}, which leaves me {194 − n}"), Nancy's profile and every share card read **one value: tllStates from Nancy's saved map**. The prototype holds it in `LIVE_COUNTS` (nancyCountries 88, storyCountries 87, stories 22) only as a stand-in. **Nancy to confirm her number** (live author box says 88; the 6 October Places Been export gives 87 + Antarctica, or 84 UN + Kosovo). Remove the typed "88 countries and counting" from the author bio box.

## 3 · Layout
- Home story rail: **six cards max**, photo stories first; pinned scroll height shortened to match.
- Home story filter chips: JetBrains Mono 12px, letter-spacing 1.5px, 700, padding 0 20px, 44px min height, gap 10px 12px.

## Open for Nancy
- Her country count (2).
- Which stories, if any, were hosted (CC-RECS R1).
- "Stopover" in the dashboard line (layovers sit beside the count, never inside it).
