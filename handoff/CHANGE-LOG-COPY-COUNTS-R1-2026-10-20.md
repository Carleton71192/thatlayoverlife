# Change log for approval: Copy, counts and story fixes (20 October 2026, evening)

Source: Claude Design's evening packet (handoff/claude-design-source/send-2026-10-20b/: README-COPY-AND-COUNTS.md, CC-RECS-2026-10-20.md, tll-site-lab-2026-10-20.md, STANDING-RULINGS.md with tonight's voice update, prototype 3.4). This log covers the copy and counts packet and recommendation group R1 (story template fixes, which go out with the beta). Groups R2 to R7 get their own logs later; the "Hold" list stays on hold. Nothing in this log is built. Publish only on your word, to both custom domains and the subdomain.

## What I found first (live site, 20 October 2026, about 14:00 UTC)

The site lab audit was a text fetch of older pages. Checked again today:

| Audit finding | Today |
|---|---|
| [1] "This story was hosted" on every story | Still a problem, in a different way. A "Sponsored · This story was hosted" block sits in the HTML of all 53 stories. A script hides it in the browser, but search engines, AI crawlers and text readers see it as a disclosure. In the CMS, no published story is hosted: no sponsor name, no sponsor link, and the four disclosure lines that are filled say the trip was self-paid. |
| [2] "From the trip" gallery shows every story's captions | Not reproduced on the Pantanal story today; the section shows the Been here / Want to go block. I recheck the gallery list during the build. |
| [3] Share links broken | LinkedIn, X and Email now carry the story URL. Copy link is a link with `href="#"` and a script; it becomes a real button. |
| [4] Sources as raw HTML | Still broken on stories with sources (48 stories): `<p>…</p>` shows as text. |
| [5] Empty receipt labels | Still showing: EDITED BY, WHAT IT COST, DISCLOSURE and Other stops show with nothing under them. |
| [6] Dead-end links | Fixed already: byline to /contributors/nancy-carleton, country to /countries/brazil, pursuit to /pillars/stories-from-the-road, See their work to the profile. Been here / Want to go are script buttons (log in to save). |
| [7] Typed counts | /stories now reads "Fifty-three stories" with 53 cards; the footer counts are live in the browser. Still typed: Nancy's author box shows "88-and-counting" (her Fun title field) on 50 stories. |
| [8] 48 hours on the story path | Fixed (S109). |
| [9] Old nav and footer on /stories | Fixed: /stories uses the same nav and footer components as every page. |
| [10] Date format | Still mixed: the story meta row shows "October 19, 2026"; the byline shows "OCTOBER 2026". |
| [11] Read time and breadcrumb | Still "7" with no unit, and the place twice ("PORTO JOFRE, BRAZIL → PORTO JOFRE, BRAZIL"). |
| [14] Home rail "the eight newest here" | Shows 8 today, matching its line. |
| [16] "It gets fixed within 24 hours" | Still on the story page. |

Home today still says "COUNTED FROM THE MAP, NEVER TYPED" under the dashboard and "Schengen days" in the visa tracker card; tonight's voice ruling retires both.

## Changes (numbered for your reply)

### E1 Copy (text from the 3.4 prototype)
| # | Change |
|---|---|
| E1.1 | Home hero sub: "For people who have slept on an airport floor and would do it again." |
| E1.2 | 01 Stories: "Read where the cool kids went. Then plan your own adventure." Search hint: "Type a country. Your carry-on is already packed." |
| E1.3 | 02 Dashboard: "Every stamp, every stopover, one map. Plus inspo for the next one." Label "COUNTED FROM YOUR MAP" (replaces "COUNTED FROM THE MAP, NEVER TYPED"). Logged-out map label: "THIS IS NANCY'S MAP. LOG IN TO SEE YOURS." Steps: "Sign up. You are live." / "Add a trip. Or the photo from the gate." / "Nobody likes a blank map." |
| E1.4 | 03 Expats: H2 "Meet the locals *who used to be you.*" Checklist "YOU ARE ONE OF US IF" (rose checks, top-aligned beside the H2): "Your checked bag is 23 kg of snacks from home." / "You translate spices in the grocery aisle." / "You have a residence card and opinions about it." / "The world feels smaller. In a good way." Then "They wrote the guides. Ask them anything." Cards: "From someone who cried in that line." / "Never miss a renewal again." / "Where to eat, run and get a haircut." Small label "OPENING CITY BY CITY, WHERE OUR MEMBERS LIVE". "Schengen days" goes. |
| E1.5 | 04 Paw: "Muddy on side quests. A heated blanket on your face at 6 a.m. Your bestie sees the world too. Grandma wants the photos." Guide line: "The EU pet travel guide. No surprises at the border." |
| E1.6 | 05 Lounge: "The view that made you check flights at midnight. Send it." |
| E1.7 | 06 First 100: "The rebooked flight. The night on the gate floor. The best meal of your life in someone's kitchen. Write it. First 100 get a founding badge." Open slots: "Your face could be here." / "Ninety-six more seats. Window or aisle?" |
| E1.8 | 07 Letter: "One story. Sunday morning. Lounge wine optional." The signup form keeps Copenhagen time and the unsubscribe line. |
| E1.9 | Travelers hero sub: "Everyone on TLL, in one place. Find a local expert, a travel writer or a pet with a passport, and see where they have been." |
| E1.10 | About, your letter shortened to the prototype text: Portland, abroad since 2018 (Brazil, Vietnam, Denmark, Copenhagen home), the Dubai layover, three languages, "The country count stands at {n}, which leaves me {left} excellent reasons to keep going.", a marathon on every continent with Jay including the apartment one, the EV to Kosovo, owning fewer things, The Brand Collective. The Everest, Carnaval and checked-bag lines leave the letter (they are in your stories). Side facts: COUNTRIES {n} · {layovers} layovers beside, ABROAD SINCE 2018, SPEAKS English · Danish · Portuguese, MARATHONS Seven, one per continent. |

### E2 Counts: one source for your number
| # | Change |
|---|---|
| E2.1 | Your country number on the Home dashboard, The Map strip, About (letter and side facts), your profile and later the share cards all read one value: your saved map, through the owner map route the Worker stores on every save (S111). Until the Worker is deployed the visitor view keeps the 7 October copy, and those spots hide the number rather than show an old one. |
| E2.2 | "Countries with a story" on About reads the same story-coverage number as the footer. |
| E2.3 | The author box on stories stops printing your Fun title ("88-and-counting"); the field stays in the CMS, untouched. Bios carry no counts. |

### E3 Layout
| # | Change |
|---|---|
| E3.1 | Home story rail: six cards at most, stories with a photo first; the pinned scroll height shortened to match; the line reads "{n} published so far · the six newest here". |
| E3.2 | Home story filter chips: JetBrains Mono 12px, letter-spacing 1.5px, weight 700, padding 0 20px, 44px minimum height, gap 10px 12px. |

### E4 Story template fixes (R1)
| # | Change |
|---|---|
| E4.1 | [1] The "Sponsored · This story was hosted" block renders only when the story's Sponsor name is set (bound visibility, so Webflow leaves it out of the HTML otherwise). No new field: Stories is full, and Sponsor name already says "Set when any part of the trip was paid for or hosted". Today that removes it from all 53 stories. Commissioned stories keep their own label (S109). |
| E4.2 | [2] "From the trip": the gallery list filtered to the current story's photos, hidden when empty (checked on stories with and without a gallery). |
| E4.3 | [3] Copy link becomes a button: copies the story's canonical URL, shows "Link copied" inline for 2 seconds, no pop-up. Email, LinkedIn and X stay on the canonical URL. |
| E4.4 | [4] Sources: the stored paragraphs render as paragraphs (text and links only), so no tag shows as text. |
| E4.5 | [5] Each receipt row (Edited by, What it cost, Disclosure, Traveled with, Links and mentions, Other stops) shows only when it has content. |
| E4.6 | [10] Dates read "19 October 2026" everywhere on the story page and in story cards; the byline month stays "October 2026". |
| E4.7 | [11] Read time reads "7 min"; the breadcrumb shows the place once. |
| E4.8 | [16] "It gets fixed within 24 hours" becomes "It lands on the editor's desk." |
| E4.9 | [6] Been here / Want to go checked with a test member: a member's tap saves to the map; a visitor is sent to sign up. |

## Not in this log
R2 to R7 (measurement, speed and accessibility, search and AI answers, the Paw Passport guide, How TLL works) get their own logs after the beta. R2 is mostly done already (above). The Hold list stays on hold.

## Test report with this log
Before and after at 1440 and 390 for Home, Travelers, About and two stories (one with sources and gallery, one without); the raw HTML of every story checked for the hidden disclosure and "88"; counts on Home, The Map, About and your profile shown side by side and equal.

## Open for you
1. Your number. Your saved map on 19 October gave 89 countries plus Antarctica (90 places), or 88 if New Caledonia comes off; the author box says 88. Whatever your map holds is what shows; tell me if New Caledonia stays.
2. "which leaves me {194 − n}": the prototype subtracts from 194, but your count is ISO countries out of 249 places. Recommended: "{249 − places} places to go", or keep 194 and say which list 194 is.
3. "Every stamp, every stopover": layovers sit beside the count, never inside it. Keep "stopover" in this line or not.
4. Newsletter name: "The Layover Letter" (Sunday 09:00) or "The Weekly Layover".
5. Still open from the beta log: which four Stories fields to delete (Audio version URL 0, Video URL 1, OG image 1, Country number 2, Weekend Read 2).

Reply with the line numbers to approve or change.
