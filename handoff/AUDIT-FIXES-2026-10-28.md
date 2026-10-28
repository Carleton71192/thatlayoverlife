# Audit fixes, 26 October findings, worked 28 October 2026

Scope: the ten items from the live audit of 26 October. Nothing is published. Every Webflow write below is staged only. The sandbox cannot reach the live site, so "live" facts come from the saved crawls in `src/seo/live-2026-10-26/` (26 Oct before the SEO build, 27 Oct after it, 306 URLs) and from the Webflow API on 28 October.

A lock note first. The usability session holds the Webflow lock since 13:15 UTC today (handoff/WEBFLOW-LOCK.md) with a scope that covers the Contributors template and collection, /creators and /for-brands. The writes below that touch those pages are prepared and held, marked HELD. The Awards page is outside that scope, so its schema is written. Say the word and the held ones go in after the lock releases, or override the lock as you did on 26 October.

## 1. Change table

| # | Change | Page | Before | After | Status |
|---|---|---|---|---|---|
| 1 | Profile link to /paw-passport | Contributors template | 26 Oct crawl: every profile linked /paw-passport (404) | 27 Oct crawl: profiles link /the-paw-passport only; no element or code in the template carries /paw-passport today | Already fixed by the 26 Oct SEO build (S1 to S9). Nothing to do. |
| 2 | /creators links to /expats and /press | /creators | 26 Oct crawl: both links present (404) | 27 Oct crawl: neither link on the page; no inlink to /expats or /press anywhere on www | Already fixed. Nothing to do. |
| 3 | Second H1 "Heading" | Contributors template | 26 Oct crawl: 2 H1s on each profile | 27 Oct crawl: 1 H1 per profile. The template today has one H1 bound to Name (`data-tll-prof="name"`) and one legacy H1 with static text inside the old layout, which the page script removes; the rendered page has one | Already fixed in the HTML. Optional cleanup: delete the legacy H1 element 70cb4393-...ce11fc so the template matches the output. HELD (template is under the lock). |
| 4a | Meta description binding | Contributors template | 26 Oct: empty on barzy-adam and chesney-lish | Template SEO and OG description now bound to `bio-short` (set 28 Oct 12:20 by the usability session); barzy-adam and chesney-lish read their one-line bios (61 chars) | Already bound. Webflow has no "fallback if empty" for bindings, so the fallback lives in the field: every live contributor needs a bio-short. |
| 4b | Short description on /contributors/anonymous | CMS item Anonymous | bio-short "Name withheld at the writer's request." (38) | Proposed: "This writer asked to keep their name off the page. The story is theirs, and a human editor checked it. Real places, by people who actually went." (146) | HELD, CMS write pending your word and the lock. |
| 4c | OG image on /contributors/anonymous | Template head code + CMS item | The template's head writes `og:image` from the Avatar field; Anonymous has no avatar, so the tag is empty | Set the Anonymous item's Avatar to the site share image (asset 6ac86b38946675a9e2da3c63, the one the template's page settings already use) so the head tag carries it | HELD, needs your yes (it puts the TLL mark on the Anonymous card) |
| 4d | Barzy and Chesney bios at 61 chars | CMS items | Short bios, under the 110 Ahrefs floor | Proposed bio-short: Barzy "Drove five hours from Phoenix for one look at Horseshoe Bend. Writes for That Layover Life. Real places, by people who actually went." (134); Chesney "A Madrid wedding, an Ibiza villa and the ferry to Formentera. Writes for That Layover Life. Real places, by people who actually went." (134) | HELD, your words to approve |
| 5 | Long titles and descriptions | 37 titles, 33 descriptions | see section 2 | see section 2 | Drafted, nothing written |
| 6a | Canonical on /creators | /creators head code | No canonical tag (confirmed in the page head code and the 27 Oct crawl) | Prepend `<link rel="canonical" href="https://www.thatlayover.life/creators">` and the matching `og:url`; the prepared block is `src/seo/live-2026-10-28/creators-code-head-after.html` | HELD (under the lock) |
| 6b | OG title on /creators and /cookies | page settings | Both pages already carry an OG title in settings ("Travel creators · That Layover Life", "Cookie policy · That Layover Life", titleCopied false) and the 27 Oct crawl sees them | No change needed | Already in place |
| 7 | Dead source reference.nlb.gov.sg | Story "The Most Indiana Jones Thing I Have Ever Done" (/stories/angkor-wat-most-indiana-jones-thing), field Links and mentions | `<li><a href="https://reference.nlb.gov.sg/guides/socscihum/history/angkor-wat/">Angkor Wat research guide</a>, National Library Board Singapore</li>` | Replace with two live entries: `<li><a href="https://www.britannica.com/topic/Angkor-Wat">Angkor Wat</a>, Encyclopaedia Britannica</li>` and `<li><a href="https://www.britannica.com/place/Tonle-Sap">Tonle Sap</a>, Encyclopaedia Britannica</li>`. The NLB guide backed two facts (Suryavarman II's west-facing funerary temple; the lake reversing with the Mekong); the two Britannica entries cover one each, so the swap is equal or better per STORM | Proposed, not written. UNESCO 668 stays as the park citation. |
| 8 | JSON-LD | /awards | None | WebPage + BreadcrumbList in the sibling pages' shape, read back identical | Written (staged) |
| 8 | JSON-LD | /for-brands, /creators | None | Same shape, descriptions from each page's SEO description, breadcrumb names "For Brands" and "Travel creators" | HELD (under the lock); ready to write in one call |
| 9 | Image weight | Home | see handoff/HOME-IMAGE-WEIGHTS-2026-10-28.md | recommendations only | Listed, no asset touched |
| 10 | Teal on light | site | see section 4 | decision needed | Nothing changed |

## 2. Titles and descriptions

Pattern first. The Stories template title is the story's own SEO title field with no site suffix, so there is no suffix to drop there; every long story title is the field value. The Paw Passport template title is `{Name} · Paw Passport`; dropping the 15-character suffix brings both long Paw Passport titles under 60 (74 to 59, 69 to 54) with no rewrite. The Countries template description is the item's Verdict field, and 184 country pages carry the same boilerplate sentence; 11 of them run over 160 because of a long country name. One shorter boilerplate fixes all 184.

Proposed Countries boilerplate (longest name lands at 132): "No TLL traveler has written from {Country} yet. The facts below are from public sources. The verdict waits for someone who went."

### Story titles over 60, proposed rewrites (all 60 or under)

| Story | Now | Chars | Proposed | Chars |
|---|---|---|---|---|
| /stories/chile-santiago-chilean-kazakh-wedding | A Chilean Kazakh wedding in Santiago: funicular, mote con huesillo, Cajón del Maipo | 83 | A Chilean Kazakh wedding in Santiago, and Cajón del Maipo | 57 |
| /stories/kuala-lumpur-fomo-is-real | Kuala Lumpur Weekend: Batu Caves, Royal Selangor Pewter and a City Named for Mud | 80 | Kuala Lumpur weekend: Batu Caves and a city named for mud | 57 |
| /stories/new-orleans-short-girl-wedding-krewe-of-boo | La Petite's Guide to New Orleans: A Wedding, a Halloween Parade and a Swamp | 75 | New Orleans: a wedding, a Halloween parade and a swamp | 54 |
| /stories/champagne-reims-patience-grasshopper | Champagne tour from Reims: the Grasshopper, a robe sprint, and real bubbles | 75 | Champagne from Reims: the Grasshopper and real bubbles | 54 |
| /stories/cabo-san-lucas-final-fiesta-bachelorette | Final Fiesta: a Cabo San Lucas bachelorette, and why Baja is leaving Mexico | 75 | Cabo bachelorette, and why Baja is leaving Mexico | 49 |
| /stories/vietnam-weekends-monkeys-in-sweaters | Weekends in Vietnam: Ha Long Bay, Da Nang's Doucs, Phú Quốc and Nha Trang | 73 | Weekends in Vietnam: Ha Long, Da Nang's doucs, Phú Quốc | 55 |
| /stories/kilimanjaro-someone-was-already-awake | Climbing Kilimanjaro on the Lemosho Route: Nine Hikers, Twenty-Eight Crew | 73 | Kilimanjaro by the Lemosho route: nine hikers, 28 crew | 54 |
| /stories/vietnam-thailand-noodle-week | Noodle Week: A Girls' Trip Through Hanoi, Ha Long, Ninh Bình and Bangkok | 72 | Noodle Week: Hanoi, Ha Long, Ninh Bình and Bangkok | 50 |
| /stories/sao-paulo-first-nfl-game-brazil | First NFL game in Brazil: Eagles, Packers and a stadium that hates green | 72 | First NFL game in Brazil: Eagles, Packers, São Paulo | 52 |
| /stories/el-salvador-ice-cream-over-a-lake-of-acid | Hiking Santa Ana volcano, El Salvador: why the crater lake changes color | 72 | Santa Ana volcano, El Salvador: why the lake changes color | 58 |
| /stories/costa-rica-the-layover-was-the-vacation | Costa Rica Layover: Waterfalls, Sloths and Why Sloths Climb Down to Poop | 72 | Costa Rica layover: waterfalls and why sloths climb down | 56 |
| /stories/angkor-wat-most-indiana-jones-thing | Angkor Wat Sunrise: Why It Faces West, and the Lake That Runs Backwards | 71 | Angkor Wat: why it faces west and the lake runs backwards | 57 |
| /stories/vietnam-ninja-duckies | Moving to Vietnam in Lockdown: Hanoi Quarantine and a Saigon Bird Café | 70 | Moving to Vietnam in lockdown: quarantine and a bird café | 57 |
| /stories/northern-brazil-sequins-to-sloths | Northern Brazil: Salvador Carnaval, Lençóis Maranhenses and the Amazon | 70 | Northern Brazil: Salvador Carnaval, Lençóis and the Amazon | 58 |
| /stories/amsterdam-stroopwafel-time | Amsterdam After Five Years: Dancing Houses, Free Ferries, Stroopwafels | 70 | Amsterdam after five years: dancing houses, free ferries | 56 |
| /stories/istanbul-me-and-my-champagne-vacay | Me and My Champagne Vacay in Istanbul: A 3-Hour Layover Turned 4 Days | 69 | Istanbul champagne vacay: a 3-hour layover turned 4 days | 56 |
| /stories/eswatini-lesotho-how-many-goats-small-car | Eswatini and Lesotho from Kruger: goats, glass and a leopard's pantry | 69 | Eswatini and Lesotho from Kruger: goats, glass, a leopard | 57 |
| /stories/egypt-history-101-by-us | Egypt History 101: Tut, Ramesses, Hatshepsut and Why Upriver Is South | 69 | Egypt History 101: Tut, Ramesses and why upriver is south | 57 |
| /stories/bali-extended-layover-edition | Bali Layover: Jatiluwih Rice Terraces, a Lake Temple and a Guineafowl | 69 | Bali layover: Jatiluwih rice terraces and a lake temple | 55 |
| /stories/agra-taj-mahal-keep-calm-and-curry-on | Taj Mahal at Sunrise: The Other Wives, Baby Taj and the Stone Flowers | 69 | Taj Mahal at sunrise: the other wives and the stone flowers | 59 |
| /stories/morocco-toubkal-peaks-mules-uno-vengeance | Climbing Toubkal, Timzguida and Ras: the Atlas's three highest peaks | 68 | Climbing Toubkal, Timzguida and Ras in the Atlas | 48 |
| /stories/texas-hill-country-boot-scootin-eclipse | Texas Hill Country eclipse 2024, and my grandfather's corona camera | 67 | Texas Hill Country eclipse 2024 and a corona camera | 51 |
| /stories/sao-paulo-world-cup-2022-ilhabela | Watching the 2022 World Cup in São Paulo, then escaping to Ilhabela | 67 | The 2022 World Cup in São Paulo, then Ilhabela | 46 |
| /stories/pantanal-glimmers-in-the-wild | Driving the Transpantaneira: jaguars at Porto Jofre without a guide | 67 | Driving the Transpantaneira: Porto Jofre jaguars, no guide | 58 |
| /stories/uruguay-tiradentes-wine-yards | Uruguay Long Weekend: Punta del Este and a Wine Lodge to Ourselves | 66 | Uruguay long weekend: Punta del Este and a wine lodge | 53 |
| /stories/luxembourg-schengen-road-trip | I Finally Went to Schengen: A Luxembourg Road Trip with a Samoyed | 65 | A Luxembourg road trip with a Samoyed, via Schengen | 51 |
| /stories/aruba-curacao-dushi-detour | Aruba and Curaçao: night diving the Pedernales and Flamingo Beach | 65 | Aruba and Curaçao: night diving and Flamingo Beach | 50 |
| /stories/southern-africa-safari | Big Five Marathon to Victoria Falls: four countries in two weeks | 64 | Big Five Marathon to Victoria Falls in two weeks | 48 |
| /stories/rio-carnaval-2023-o-brasil-e-lindo-maravilhoso | Rio Carnaval 2023: Blocos, Sparkly Shorts and Why the Date Moves | 64 | Rio Carnaval 2023: blocos and why the date moves | 48 |
| /stories/laos-slowest-race-in-vientiane | Vientiane, Laos: Racing a Moped and the Truth About Prayer Birds | 64 | Vientiane, Laos: a moped race and the prayer birds | 50 |
| /stories/doha-layover-dunes-camels-falcons | Leaving the Airport on a Doha Layover: Dunes, Camels and Falcons | 64 | Doha layover: dunes, camels and falcons | 39 |
| /stories/nepal-everest-base-camp-dal-bhat-power | Everest Base Camp Trek: 12 Days, a Jeep Detour and Kala Patthar | 63 | Everest Base Camp trek: 12 days and Kala Patthar | 48 |
| /stories/mexico-holy-mole-teotihuacan-cenotes-pink-lagoons | Teotihuacán, Chichén Itzá and a Pink Lagoon: Mexico, Corrected | 62 | Teotihuacán, Chichén Itzá and a pink lagoon | 43 |
| /stories/vietnam-year-of-the-dragon | Vietnam With Family: Tết, Ninh Binh Karst and Hoi An Lanterns | 61 | Vietnam with family: Tết, Ninh Binh and Hoi An lanterns | 55 |
| /stories/horseshoe-bend-arizona | Horseshoe Bend from Phoenix: is the five-hour drive worth it? | 61 | Horseshoe Bend from Phoenix: worth the five-hour drive? | 55 |

Paw Passport (pattern fix, template title suffix dropped): /paw-passport/magnus-boryana-sofia-bulgaria 74 to 59; /paw-passport/magnus-cph-to-malmo-border 69 to 54.

### Descriptions over 160, proposed rewrites (all 160 or under)

| Story | Now (chars) | Proposed | Chars |
|---|---|---|---|
| /stories/pantanal-glimmers-in-the-wild | 204 | A self-driven trip from São Paulo to the Pantanal: 147 km of the Transpantaneira, 120 wooden bridges, and why Porto Jofre's jaguars let you watch them. | 151 |
| /stories/kilimanjaro-someone-was-already-awake | 198 | Eight days to Uhuru Peak with Much Better Adventures and Ahsante Tours, what a nine-to-twenty-eight crew ratio means, and why the glaciers are going. | 149 |
| /stories/sort-sol-black-sun-denmark | 185 | What Sort Sol is, when and where to see the Black Sun starling murmuration in the Tønder marshlands, and what a last-minute weekend costs. | 138 |
| /stories/eswatini-lesotho-how-many-goats-small-car | 183 | Cape Town Marathon, a Kruger leopard with an impala in a tree, Swazi Candles and Ngwenya Glass, and Lesotho, whose lowest point is 1,400 meters up. | 147 |
| /stories/morocco-toubkal-peaks-mules-uno-vengeance | 181 | A Toubkal trek from Imlil with Much Better Adventures: the twin summits of Ouanoukrim, a 3 a.m. start, and why the Atlas is taller than it should be. | 149 |
| /stories/northern-brazil-sequins-to-sloths | 177 | Carnaval in Salvador with 2.5 million people, how the Lençóis Maranhenses lagoons form, and six days on the Rio Negro at Anavilhanas Jungle Lodge. | 146 |
| /stories/southern-africa-safari | 175 | A half marathon among the Big 5 at Entabeni, Soweto, Victoria Falls, a Chobe day trip, and why the falls' zigzag gorges mean the waterfall walks upstream. | 154 |
| /stories/champagne-reims-patience-grasshopper | 174 | A weekend in Reims and the Champagne vineyards with Kung Fu's Grasshopper as our guide, plus how champagne really gets its bubbles. | 131 |
| /stories/phuket-singapore-eat-drank-relax-be-happy | 169 | Weekends in Phuket and Singapore in monsoon season: why Phuket's west coast gets rough every May, and a Platinum Jubilee in Commonwealth company. | 145 |
| /stories/luxembourg-schengen-road-trip | 169 | Copenhagen to Luxembourg by car, ferry and paw, with pumpkins, cranes, and a half marathon along the Moselle to the village that named open borders. | 148 |
| /stories/vietnam-ninja-duckies | 168 | Arriving in Vietnam during its strictest Covid lockdown: a 28-day Hanoi quarantine, the rubber ducks that got me through, and Saigon's bird cafés. | 146 |
| /stories/uruguay-tiradentes-wine-yards | 167 | A long weekend from São Paulo to Uruguay: Montevideo, a wine lodge near José Ignacio, Punta del Este, and why the Atlantic makes Pinot possible. | 144 |
| /stories/antarctica-marathon | 167 | What the Antarctica Marathon costs, how to enter, and what the Drake Passage and the King George Island course are like, from four attempts and one finish. | 155 |
| /stories/chile-santiago-chilean-kazakh-wedding | 166 | A friend's Chilean Kazakh wedding in Santiago, mote con huesillo on Cerro San Cristóbal, and Cajón del Maipo's military railway tunnel. | 135 |
| /stories/colombia-definitely-not-columbia | 165 | Three days in Bogotá with a friend from a Nepal trek: Monserrate and coca tea, a seven-course lunch at Prudencia, and muddy páramo above 3,300 m. | 145 |
| /stories/cabo-san-lucas-final-fiesta-bachelorette | 165 | A bachelorette weekend in Cabo during Pride week, a cat at a sushi restaurant, and the geology behind El Arco: Baja is drifting away from Mexico. | 145 |
| /stories/vietnam-year-of-the-dragon | 164 | Two weeks showing family the Vietnam that got us through the pandemic: Tết dragon puns, why Ninh Binh is Ha Long Bay on land, and Hoi An's lanterns. | 148 |
| /stories/vietnam-thailand-noodle-week | 164 | A ladies' trip from Hanoi's markets to Ha Long Bay, Ninh Bình and two nights in Bangkok, plus why breaking the seal is a myth. | 126 |
| /stories/egypt-history-101-by-us | 163 | A week in Egypt with camel scritches, a potty punch card and an unfinished obelisk, plus why the Nile runs north and the wind blows south. | 138 |
| /stories/texas-hill-country-boot-scootin-eclipse | 162 | The April 2024 total solar eclipse through Texas clouds, a San Antonio family tour, and how Gordon Newkirk first photographed the whole corona. | 143 |
| /stories/east-coast-road-trip-portland-maine-to-ohio | 162 | Climbing Acadia's Precipice Trail into sea fog, why the Maine coast is so foggy, and a road trip through Plymouth, Hartford and Gettysburg to Cleveland. | 152 |
| /stories/vietnam-weekends-monkeys-in-sweaters | 161 | Weekend escapes in Vietnam: a Ha Long reunion, monkeys in sweaters on Son Tra, how doucs digest leaves like cows, and a birthday scuba dive. | 140 |

Countries over 160 (one boilerplate fix covers them): saint-vincent-and-the-grenadines 175, central-african-republic 167, bosnia-and-herzegovina 165, republic-of-the-congo 164, saint-kitts-and-nevis 164, sao-tome-and-principe 164, united-arab-emirates 163, antigua-and-barbuda 162, trinidad-and-tobago 162, solomon-islands 162, dominican-republic 161.

Fixed since the 26 Oct audit, per the 27 Oct crawl: /for-brands description 186 to 158, /awards 173 to 141, /gallery 169 to under 160, /awards title 64 to 55.

## 3. Dead source

See row 7. The story's other eight sources are live per the 27 Oct crawl's link list; only the NLB guide is gone.

## 4. Teal #00C9C8 as text on a light surface

The site already carries the rule in its head code: `[class*=eyebrow]{color:var(--tll-teal-l)}` (#067A79) everywhere, and #00C9C8 only inside dark sections (`.tll-section-dark`, the heroes, the footer, the story hero). The Webflow classes themselves paint no text in #00C9C8 (checked in the 13 Oct export CSS). What is left, by selector, with the surface it sits on:

| Where | Selector | Surface | Verdict |
|---|---|---|---|
| Home, chapter 02 and 04 (dark) | `.h3-dash-label`, `.h3-steps b`, `.h3-gets b`, `.h3-fd b`, `.h3-c2-sub em`, `.h3-map-msg a`, `.h3-dark .h3-ey` | Midnight | Passes (#00C9C8 on #0D0F1A is about 11:1) |
| Home hero coordinates | `.h3-hero-coords b` | Photo, dark gradient | Passes on the gradient; the cover layer hides it anyway |
| Story page trip facts and route strip | `.st3-trip-k`, `.st3-trip-n`, `[data-tll-route] .tll-route-arrow`, `[data-tll-route-note]`, `a.st3-trip-t:hover` | Ink box (`.st3-trip` background var(--st3-ink)) | Passes |
| Story page eyebrows (The short version, Reader notes, Quick answers) | `.tll-eyebrow-teal` | Paper | Already #067A79 via the st3 override (`--st3-teal-deep`), about 5.2:1, passes |
| Contributor profile, cream hero tag | `[data-tll-prof="stat-label"]` (head code line 17, #00C9C8) | Cream #F7F1E8 | FAILS at about 1.9:1 unless the pf3 layout rule (`.tll-traveler-profile [data-tll-prof="stat-label"]`, muted) applies; on the pf3 layout it reads muted #6B6660 and passes. Worth a browser check on one profile. |
| Contributor profile, directory tags label | `[data-tll-prof="dir-tags-label"]` | Cream | Overridden to #067A79 on line 73, passes |
| Cookie banner | `--cc-secondary-color:#00C9C8` | Dark banner (#cc-main text cream) | Passes |
| Account page and member bar | `.tms-*` tab text on cream | Cream | Fixed 26 Oct (tll-tap-colors-v1): ink text, rose underline |

Proposed rule, if you want one line to settle it: teal #00C9C8 is for dark surfaces only (text, icons, the map). On Paper and Cream, labels use #067A79 and links use Ink with a rose underline, as the story and account pages do now. The only code change that follows is the profile stat label line 17 (to #067A79 or muted), and I would make it only after the browser check.

## 5. Image weight

See handoff/HOME-IMAGE-WEIGHTS-2026-10-28.md.
