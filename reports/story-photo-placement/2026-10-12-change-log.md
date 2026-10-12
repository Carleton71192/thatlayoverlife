# Story photo placement: change log for approval

That Layover Life, Webflow site `69d6145cf421c777840c1e25`. Prepared 12 October 2026. Read-only research and drafting: no CMS values were written, no fields created, no elements or scripts changed, nothing published. Everything below waits for Nancy's approval.

## Summary

- **Field cap.** The Stories collection has **62 fields in the API response: 60 custom fields plus Name and Slug.** It is already holding 60 custom fields, which only works if Name and Slug do not count toward Webflow's 60-field cap, so the collection is at the cap. A new "Photo placement" PlainText field cannot be added. Plan B below (a small "Photo placements" collection) is the recommended route; Plan A (the field) is kept in case Webflow confirms more room.
- **Alt text.** The gallery is a single Webflow Lightbox bound to `photo-gallery`. Its Image child has alt set to `inherit` (asset-level alt, not the CMS per-image alt), and the "TLL story gallery v1" footer script throws the lightbox payload away apart from `url`, then writes alt from the filename (`altFromUrl`). The CMS alt text is not available to the script today. **A hidden nested collection list bound to `photo-gallery` (Image with its alt) is needed** to put the real alt on the tiles.
- **Stories.** All 10 found, all live (none are drafts). 82 photos placed inline, 113 stay in the end gallery (counts per story in the table below).
- **Script.** The v2 draft is about 3,900 characters, over the 2,000-character inline limit for registered scripts, so it goes in the Stories Template footer custom code. Remove the v1 registered script from the template page in the same change.

| Story | Gallery photos | Inline | End gallery |
|---|---|---|---|
| Morocco | 24 | 9 | 15 |
| La Tomatina | 25 | 12 | 13 |
| São Paulo NFL | 11 | 8 | 3 |
| Paraguay | 10 | 6 | 4 |
| Eswatini and Lesotho | 17 | 7 | 10 |
| Portuguese Camino | 25 | 11 | 14 |
| Kilimanjaro | 25 | 7 | 18 |
| Pantanal | 25 | 9 | 16 |
| Sort Sol | 8 | 6 | 2 |
| Northern Brazil | 25 | 7 | 18 |
| **Total** | **195** | **82** | **113** |

## 1. Field count and the cap

Source: `get_collection_details` on Stories `6a0b29eddc14f1444e935760`, read 12 October 2026 (collection last updated 9 October 2026).

- Fields returned: **62**. That is **60 custom fields** plus the built-in **Name** and **Slug**.
- Webflow's per-collection limit is 60 fields on CMS and Business plans. Since the collection already holds 60 custom fields alongside Name and Slug, the cap here clearly excludes Name and Slug, and the custom count sits exactly on it.
- Conclusion: **at the cap. No room for "Photo placement".** Worth a 10-second check in the Designer (CMS panel, Stories, "+ New field" should be disabled) in case the plan allows more.
- No field is deleted or repurposed in any option below.

### Plan B (recommended): a "Photo placements" collection

New collection, tiny and editor-friendly:

| Field | Type | Notes |
|---|---|---|
| Name | PlainText (built in) | The story slug, exactly, e.g. `morocco-toubkal-peaks-mules-uno-vengeance`. This is the match key. |
| Slug | built in | Auto from Name. |
| Story | Reference to Stories | Optional, for editor convenience and a future Designer filter. Lives on the new collection, so it does not touch the Stories cap. |
| Photo placement | PlainText, multi-line | Help text: "One line per inline photo: Section heading \| photo filename slug. Example: The crown jewel \| tll-morocco-toubkal-summit-marker. Photos not listed stay in the end gallery." |

How the template reads it:

- The Data API cannot filter a collection list by the current item. So on the Stories Template, add one **hidden** collection list of Photo placements, **unfiltered**, limit 100 (there are 36 stories, so every row renders). Each item is a hidden div with `data-tll-placement-row`, attribute `data-story-slug` bound to Name, and its text bound to Photo placement.
- The v2 script reads the current page slug from the URL (`/stories/<slug>`) and picks the row whose `data-story-slug` matches. No match means nothing is placed and the gallery stays as it is.
- Optional upgrade: in the Designer, Nancy can filter that list by "Story equals current Story" by hand, which renders only one row. The script works either way.
- Cost: one extra collection (check the plan's collection count) and about 36 tiny hidden rows in each story's HTML.

### Plan C (fallback): placements held in the script

A `{ "story-slug": "Heading | slug\n..." }` map inside the v2 footer code. No CMS work at all, but every placement change becomes a code edit, and roughly 6,500 characters of placement text would join the template footer (now 30,088 characters). Fine as a stopgap, not as the editing model.

### Plan A (only if the cap turns out to allow it): the field on Stories

Field "Photo placement", slug `photo-placement`, PlainText, multi-line, not required, help text as above. Bind a hidden element on the template (`data-tll-photo-placement`, display none, text bound to the field). The v2 script checks this first, so Plan A and Plan B use the same script.

## 2. How the gallery renders, and where alt text comes from

From the Stories Template element tree (page `6a0b29eedc14f1444e935766`):

- `section.tll-story-gallery` > `.tll-gallery-inner` > `.tll-gallery-label` ("From the trip") + `.tll-gallery-grid` > **LightboxWrapper** `7a456e32-...4454` > **Image** `.tll-gallery-img` `7a456e32-...4455`.
- No collection list (DynamoWrapper) on the page is bound to `photo-gallery`. The five DynamoWrappers are pet notes, trip bundles, humans, pets and one unlabeled list.
- Image settings: `altText: "inherit"`, `assetId: null`. Webflow publishes a multi-image lightbox as one placeholder tile plus a `script.w-json` payload of all images.
- Template footer "TLL story gallery v1" (2026-09-23) parses that payload, keeps only `it.url` from each item, rebuilds the tiles, and sets `img.alt = altFromUrl(url)` (filename with prefixes stripped, dashes to spaces, first letter capitalized). Each rebuilt tile gets a fresh `w-json` holding only `{url, type}`, so even if the original payload carried alt or caption data, it is gone after the rebuild.
- Live check: this container cannot reach www.thatlayover.life (proxy denied), so I could not read a published `w-json` to see whether Webflow includes the CMS alt in it. Webflow's lightbox payload is not documented to carry multi-image alt, and the original author fell back to filenames, which points the same way. Treat it as **not available**.

**Fix:** add a hidden collection list on the template, source = current Story's **Photo gallery** (multi-image lists on a template page are scoped to the current item automatically), wrapper attribute `data-tll-photo-alts`, each item an Image with alt taken from the photo-gallery image's alt text (Designer: Image settings, Alt text, use the field's alt). Set the wrapper to display none and give the images `loading="lazy"` so they do not download. The v2 script builds a filename-slug-to-alt map from these images and applies it to every tile, inline or in the end gallery, plus a matching `aria-label` on the link ("Open photo: ..."). If an alt is missing it keeps the current filename alt. The `altFromUrl` code in "TLL story gallery v1" can stay as that fallback.

The CMS alt text is good across all 10 stories (every photo has a full, descriptive alt), so this fix is worth doing even apart from placement.

## 3. Placements per story

Placement rules used: about one inline photo per section, two at most; intro-only, "The numbers", "If you go" and stats or sources sections skipped; strongest, most specific frame; no photo of a place before the story gets there; everything unlisted stays in the end gallery. The v2 script inserts each photo at the **end** of its section, just before the next H2, in the order listed.

Filename slugs are the CDN filename with both asset-id prefixes and the extension removed (each URL carries two 24-character prefixes, e.g. `6acc99ae..._6acc9906..._tll-morocco-park-sign-group.jpeg`).

### Morocco: Moroccan Adventure: Peaks, Sugared Up Mules, & UNO Vengeance

Item `6acc99af84d1be665478a796`, slug `morocco-toubkal-peaks-mules-uno-vengeance`, Live (not a draft). Gallery: 24 photos. Proposed: **9 inline, 15 in the end gallery.**

**Sections in body order**

1. **Social skills: still in beta**: Nancy lands in Marrakech, meets Jake from the trek, and checks into a medina riad. She spends the afternoon in the souks, the palace and the riad gardens, then ends at Starbucks.
2. **The elder stateswoman**: Breakfast with seven UK lads reveals she is the oldest of the group. The van climbs into the Atlas foothills to Imlil, where they meet their Amazigh guides.
3. **Sugar cubes and a shriek in the dark**: The trail up the Toubkal valley passes villagers and pack mules (sugar cubes deployed) to the stone refuge at 3,207 meters. A night of snoring, one shriek and Cards Against Humanity.
4. **Two summits and a tuna sandwich**: A "non-technical" scramble up Timzguida and Ras, the second and third highest points in the Atlas. Tuna sandwiches on top and a losing Uno game back at the refuge.
5. **Why the Atlas is taller than it should be**: Geology explainer: the High Atlas is held up less by crustal squeezing than by hot, buoyant mantle welling up under thin lithosphere.
6. **The crown jewel**: A 3 a.m. start and a golden sunrise on Toubkal, 4,167 meters, the highest point in North Africa. Descent, then one last spin through Marrakech.
7. **The numbers**: Trip stats: elevation, distance, peaks, blisters, Uno results.
8. **If you go**: Practical notes: mandatory guides, refuges, summit timing, mule welfare, the 2023 earthquake, Kasbah Tamadot.
9. **What I'm taking home**: Reflection on being the oldest on the trip and standing on the three highest Atlas summits, plus thanks to the crew.

**Photos in the gallery (gallery order)**

| # | Filename slug | CMS alt text |
|---|---|---|
| 1 | `tll-morocco-park-sign-group` | The trekking group posing with their poles beside the Toubkal National Park sign, written in Arabic, Tifinagh, French and English, with the valley behind |
| 2 | `tll-morocco-souk-leather-alley` | A narrow souk alley in the Marrakech medina hung with leather bags, with shoppers walking between the stalls |
| 3 | `tll-morocco-souk-babouche-slippers` | Rows of leather babouche slippers hanging on a stall in a sunny Marrakech souk lane |
| 4 | `tll-morocco-covered-souk-passage` | A covered souk passage under a wooden lattice roof, with a scooter parked in the dappled light |
| 5 | `tll-morocco-medina-square-carpets` | A medina square with green awnings over the shopfronts and long patterned carpets laid out on the paving |
| 6 | `tll-morocco-palace-courtyard-arcade` | A palace courtyard arcade in Marrakech with a painted orange and blue ceiling and a green and white tiled floor |
| 7 | `tll-morocco-painted-ceiling` | Looking straight up at an octagonal painted wooden ceiling covered in intricate blue, red and gold patterns |
| 8 | `tll-morocco-traditional-salon` | A traditional Moroccan salon with gold upholstered banquettes, red carpets and a carved plaster frieze below the ceiling |
| 9 | `tll-morocco-blue-doorway` | A carved wooden doorway framed by sky-blue walls and a band of zellige tile, opening onto a tiled courtyard |
| 10 | `tll-morocco-garden-pavilion` | A carved wooden pavilion with a painted ceiling in a Marrakech garden, looking out over a long green-tiled pool |
| 11 | `tll-morocco-garden-from-above` | A walled garden in the Marrakech medina seen from above, olive and citrus trees around a pavilion and a turquoise tiled pool |
| 12 | `tll-morocco-palm-and-pavilion` | The textured trunk of a palm tree beside a white-curtained pavilion and a green-tiled pool in a Marrakech garden |
| 13 | `tll-morocco-man-blue-djellaba` | An older man in a blue embroidered djellaba and a knitted cap leaning on a water cooler outside a blue and white painted door |
| 14 | `tll-morocco-trail-lunch` | A trail lunch spread on a bright table: a large platter of lentils, salads, olives and a basket of bread |
| 15 | `tll-morocco-pack-mules` | Pack mules loaded with colorful bags walking down a rocky trail toward a cluster of trailside cafes |
| 16 | `tll-morocco-refuge-tents` | The stone Toubkal refuge in a high rocky valley, with blue dome tents pitched in front of it |
| 17 | `tll-morocco-refuge-group` | The whole group, hikers and guides, standing arm in arm at the refuge with the valley opening out behind them |
| 18 | `tll-morocco-rock-scramble` | Hikers scrambling up a steep slope of broken rock under a cloudy sky |
| 19 | `tll-morocco-ridge-scramble` | A line of hikers picking their way across a huge rocky face on the way up the ridge |
| 20 | `tll-morocco-guides-summit-rocks` | Two men in trekking gear resting on a pile of rocks at a summit, the sky pale with haze |
| 21 | `tll-morocco-summit-sheep` | A sheep sticking its tongue out at the camera among the summit rocks while a hiker reaches out to pet another |
| 22 | `tll-morocco-toubkal-summit-marker` | The metal pyramid trig marker on the summit of Jbel Toubkal, with hikers resting and taking photos around it |
| 23 | `tll-morocco-toubkal-summit-group` | The group crowded around the trig marker on the summit of Toubkal, arms around each other |
| 24 | `tll-morocco-view-from-summit` | A hazy view from the summit of Toubkal over layer after layer of High Atlas ridgelines |

**Proposed inline placements**

| Section heading | Photo (filename slug) | Alt text | Why it belongs |
|---|---|---|---|
| Social skills: still in beta | `tll-morocco-souk-leather-alley` | A narrow souk alley in the Marrakech medina hung with leather bags, with shoppers walking between the stalls | The section is the first afternoon in the souks; the narrow leather alley is the most specific souk frame. |
| Social skills: still in beta | `tll-morocco-palace-courtyard-arcade` | A palace courtyard arcade in Marrakech with a painted orange and blue ceiling and a green and white tiled floor | Same afternoon, "toured the palace"; the painted arcade is the strongest palace image. |
| The elder stateswoman | `tll-morocco-park-sign-group` | The trekking group posing with their poles beside the Toubkal National Park sign, written in Arabic, Tifinagh, French and English, with the valley behind | The section introduces the group and ends at Imlil with the guides; this is the group with poles at the park sign at the start of the trek. |
| Sugar cubes and a shriek in the dark | `tll-morocco-pack-mules` | Pack mules loaded with colorful bags walking down a rocky trail toward a cluster of trailside cafes | The mules and the trailside cafes are named in the text. |
| Sugar cubes and a shriek in the dark | `tll-morocco-refuge-tents` | The stone Toubkal refuge in a high rocky valley, with blue dome tents pitched in front of it | The section ends at the stone refuge at 3,207 meters. |
| Two summits and a tuna sandwich | `tll-morocco-ridge-scramble` | A line of hikers picking their way across a huge rocky face on the way up the ridge | "Scrambling over rocks and questioning our life choices" on the way to the twin summits. |
| The crown jewel | `tll-morocco-toubkal-summit-marker` | The metal pyramid trig marker on the summit of Jbel Toubkal, with hikers resting and taking photos around it | The Toubkal summit itself, the payoff of the story. |
| The crown jewel | `tll-morocco-view-from-summit` | A hazy view from the summit of Toubkal over layer after layer of High Atlas ridgelines | The Atlas ridgelines from the top, matching "standing on top of the world". |
| What I'm taking home | `tll-morocco-toubkal-summit-group` | The group crowded around the trig marker on the summit of Toubkal, arms around each other | The closing thanks the crew; the whole group around the summit marker is the right last frame. |

Sections with no inline photo: Why the Atlas is taller than it should be, The numbers, If you go.

**Stays in the end gallery (15)**: `tll-morocco-souk-babouche-slippers`, `tll-morocco-covered-souk-passage`, `tll-morocco-medina-square-carpets`, `tll-morocco-painted-ceiling`, `tll-morocco-traditional-salon`, `tll-morocco-blue-doorway`, `tll-morocco-garden-pavilion`, `tll-morocco-garden-from-above`, `tll-morocco-palm-and-pavilion`, `tll-morocco-man-blue-djellaba`, `tll-morocco-trail-lunch`, `tll-morocco-refuge-group`, `tll-morocco-rock-scramble`, `tll-morocco-guides-summit-rocks`, `tll-morocco-summit-sheep`

**Exact "Photo placement" value**

```
Social skills: still in beta | tll-morocco-souk-leather-alley
Social skills: still in beta | tll-morocco-palace-courtyard-arcade
The elder stateswoman | tll-morocco-park-sign-group
Sugar cubes and a shriek in the dark | tll-morocco-pack-mules
Sugar cubes and a shriek in the dark | tll-morocco-refuge-tents
Two summits and a tuna sandwich | tll-morocco-ridge-scramble
The crown jewel | tll-morocco-toubkal-summit-marker
The crown jewel | tll-morocco-view-from-summit
What I'm taking home | tll-morocco-toubkal-summit-group
```

### La Tomatina: I Wore White to the World's Biggest Food Fight

Item `6acc98e1c7559918515f22d0`, slug `la-tomatina-bunol-i-wore-white`, Live (not a draft). Gallery: 25 photos. Proposed: **12 inline, 13 in the end gallery.**

**Sections in body order**

1. **Cold brew first**: The trip opens in Barcelona with cold brew at Brenda's Raw Studio and a sunset dinner, before the move to the island.
2. **Ibiza, where the tan comes with a refill**: Reunion with Yvonne in Ibiza, champagne at the hotel, two flip-happy Germans by the pool, and all-inclusive refills.
3. **Calvin Harris and the Irish jig**: A night at Ushuaïa for Calvin Harris: planes overhead, smoke, fire and dancing, Irish jigs included.
4. **Erin, and a bed made of sky**: Erin lands and the three reunite for dinner on the Carrer de la Santa Creu hillside; Nancy sleeps under the stars.
5. **Shopping, darling**: Organic groceries guarded by a puppy, gold bangles and dresses, and decadent breakfasts at Nobu.
6. **Glamorous, then brave**: A Flytographer photoshoot in the Ibiza hills, then a private charter to swim and paddle-board into sea caves.
7. **Valencia, briefly civilized**: One short paragraph: plazas and a steakhouse in Valencia.
8. **I wore white**: Yvonne's birthday, a white dress, the bus to Buñol and the fight itself: trucks, gazpacho underfoot, fight versus flight.
9. **How a town gets cleaner than you do**: Explainer: the inedible tomatoes, the trucks and rules, the acid that cleans the streets, and the festival's history and Bollywood link.
10. **Our shower was a hose, or a pond**: Rinsing off under hoses, the wrong bus, and paella and sangria by the beach instead of after-parties.
11. **If you go**: Practical notes: date, tickets, staying in Valencia, what to wear, the shower situation, buses.
12. **To the women who made it**: Thanks to Yvonne, Erin and Spain, and the gravel-pit test of friends.

**Photos in the gallery (gallery order)**

| # | Filename slug | CMS alt text |
|---|---|---|
| 1 | `tll-tomatina-hotel-luggage-cart` | A woman in a white dress and turquoise necklace rides a hotel luggage cart at a hotel entrance in Ibiza, a small plunge pool beside her. |
| 2 | `tll-tomatina-ushuaia-plane` | A plane passes low over the lit Ushuaïa sign and stage at dusk, with stage smoke rising below. |
| 3 | `tll-tomatina-ushuaia-pool-selfie` | Two friends in sunglasses grin in a selfie beside the pool at Ushuaïa Ibiza, drinks in hand. |
| 4 | `tll-tomatina-ushuaia-dancing` | A woman in a white crop top and linen trousers dances near the stage at Ushuaïa, a drink in one hand. |
| 5 | `tll-tomatina-ushuaia-dancers` | Performers in red masks, corsets and trains pose on round platforms in the pool at Ushuaïa while the crowd watches. |
| 6 | `tll-tomatina-calvin-harris-hands` | Silhouetted hands raised toward a DJ booth framed by bright swirling video screens. |
| 7 | `tll-tomatina-ibiza-town-facades` | Orange and white Ibiza Town facades with green shutters and wrought-iron balconies under a blue sky. |
| 8 | `tll-tomatina-ibiza-bougainvillea` | Bougainvillea spills over a narrow Ibiza Town street lined with pink, yellow and white buildings and parked scooters. |
| 9 | `tll-tomatina-ibiza-dinner-street` | A steep, whitewashed old-town street in Ibiza packed with diners at colorful outdoor tables at dusk. |
| 10 | `tll-tomatina-dalt-vila` | Dalt Vila, Ibiza's walled old town and cathedral, seen from the water, with a small motorboat in the foreground. |
| 11 | `tll-tomatina-photoshoot-vines` | Three friends in white dresses stand beneath a curtain of hanging vines in front of old wooden doors in Ibiza. |
| 12 | `tll-tomatina-photoshoot-arches` | Three friends in long summer dresses lean against the stone arches of an old colonnade in Ibiza. |
| 13 | `tll-tomatina-blue-door-selfie` | Two friends take a selfie in front of a bright blue door and a whitewashed wall with a potted plant. |
| 14 | `tll-tomatina-hero-bow-of-the-boat` | A woman in a yellow dress throws both arms up on the bow of a white motor yacht, turquoise water and a long sandy shoreline behind her. |
| 15 | `tll-tomatina-charter-swim` | Three friends swim in clear turquoise water off the boat, with a rocky island and a ferry on the far horizon. |
| 16 | `tll-tomatina-charter-ladder` | A smiling woman climbs the swim ladder back onto the boat, white dunes and anchored boats behind her. |
| 17 | `tll-tomatina-charter-cliffs` | A golden sea cliff drops into deep blue water, with a two-masted wooden schooner anchored offshore. |
| 18 | `tll-tomatina-valencia-micalet` | Two friends photograph the Micalet bell tower of Valencia Cathedral from the street below. |
| 19 | `tll-tomatina-valencia-cathedral` | The Gothic octagonal tower of Valencia Cathedral beside the blue-tiled dome of the Basilica of the Virgin. |
| 20 | `tll-tomatina-bunol-before` | A street in Buñol packed with participants in white T-shirts and swim goggles waiting for La Tomatina to start, a church tower at the end. |
| 21 | `tll-tomatina-bunol-truck` | A tomato truck pushes through the crowd in Buñol, throwers standing in its bed, as hundreds of hands hold up phones in waterproof pouches. |
| 22 | `tll-tomatina-tomato-street` | Looking down at a street ankle-deep in crushed tomato, feet in flip-flops and sneakers wading through it. |
| 23 | `tll-tomatina-tomato-head` | Looking down at a participant's head covered in tomato pulp and seeds, scooping up another tomato from the street. |
| 24 | `tll-tomatina-hose-shower` | A crowd of tomato-covered participants rinsing off under a line of hoses spraying from a high stone wall in Buñol. |
| 25 | `tll-tomatina-four-shoes` | Four tomato-caked shoes meet toe to toe on the pavement, including one black Croc. |

**Proposed inline placements**

| Section heading | Photo (filename slug) | Alt text | Why it belongs |
|---|---|---|---|
| Ibiza, where the tan comes with a refill | `tll-tomatina-hotel-luggage-cart` | A woman in a white dress and turquoise necklace rides a hotel luggage cart at a hotel entrance in Ibiza, a small plunge pool beside her. | The hotel arrival and champagne welcome; the luggage-cart ride is the hotel in one frame. |
| Calvin Harris and the Irish jig | `tll-tomatina-ushuaia-plane` | A plane passes low over the lit Ushuaïa sign and stage at dusk, with stage smoke rising below. | "Planes overhead, smoke, fire, lights": this is that exact sentence. |
| Calvin Harris and the Irish jig | `tll-tomatina-calvin-harris-hands` | Silhouetted hands raised toward a DJ booth framed by bright swirling video screens. | The DJ booth and raised hands carry the Calvin Harris set. |
| Erin, and a bed made of sky | `tll-tomatina-ibiza-dinner-street` | A steep, whitewashed old-town street in Ibiza packed with diners at colorful outdoor tables at dusk. | The hillside old-town dinner street at dusk is the Carrer de la Santa Creu dinner. |
| Shopping, darling | `tll-tomatina-ibiza-bougainvillea` | Bougainvillea spills over a narrow Ibiza Town street lined with pink, yellow and white buildings and parked scooters. | A boutique-lined Ibiza Town lane for the shopping day. |
| Glamorous, then brave | `tll-tomatina-photoshoot-vines` | Three friends in white dresses stand beneath a curtain of hanging vines in front of old wooden doors in Ibiza. | The Flytographer shoot, the "glamorous" half of the heading. |
| Glamorous, then brave | `tll-tomatina-hero-bow-of-the-boat` | A woman in a yellow dress throws both arms up on the bow of a white motor yacht, turquoise water and a long sandy shoreline behind her. | The charter, the "brave" half; arms up on the bow is the strongest boat frame (per the coordinator note). |
| Valencia, briefly civilized | `tll-tomatina-valencia-cathedral` | The Gothic octagonal tower of Valencia Cathedral beside the blue-tiled dome of the Basilica of the Virgin. | The only Valencia section; the cathedral tower and dome are the clearest sense of place. |
| I wore white | `tll-tomatina-bunol-truck` | A tomato truck pushes through the crowd in Buñol, throwers standing in its bed, as hundreds of hands hold up phones in waterproof pouches. | "Then the trucks came": the truck pushing through the crowd. |
| I wore white | `tll-tomatina-tomato-street` | Looking down at a street ankle-deep in crushed tomato, feet in flip-flops and sneakers wading through it. | "Knee-deep in gazpacho", shown from street level. |
| How a town gets cleaner than you do | `tll-tomatina-tomato-head` | Looking down at a participant's head covered in tomato pulp and seeds, scooping up another tomato from the street. | The section turns on "the people do not get that treatment"; a head full of pulp is the punchline. |
| Our shower was a hose, or a pond | `tll-tomatina-hose-shower` | A crowd of tomato-covered participants rinsing off under a line of hoses spraying from a high stone wall in Buñol. | The literal hose shower the heading names. |

Sections with no inline photo: Cold brew first, If you go, To the women who made it.

**Stays in the end gallery (13)**: `tll-tomatina-ushuaia-pool-selfie`, `tll-tomatina-ushuaia-dancing`, `tll-tomatina-ushuaia-dancers`, `tll-tomatina-ibiza-town-facades`, `tll-tomatina-dalt-vila`, `tll-tomatina-photoshoot-arches`, `tll-tomatina-blue-door-selfie`, `tll-tomatina-charter-swim`, `tll-tomatina-charter-ladder`, `tll-tomatina-charter-cliffs`, `tll-tomatina-valencia-micalet`, `tll-tomatina-bunol-before`, `tll-tomatina-four-shoes`

**Exact "Photo placement" value**

```
Ibiza, where the tan comes with a refill | tll-tomatina-hotel-luggage-cart
Calvin Harris and the Irish jig | tll-tomatina-ushuaia-plane
Calvin Harris and the Irish jig | tll-tomatina-calvin-harris-hands
Erin, and a bed made of sky | tll-tomatina-ibiza-dinner-street
Shopping, darling | tll-tomatina-ibiza-bougainvillea
Glamorous, then brave | tll-tomatina-photoshoot-vines
Glamorous, then brave | tll-tomatina-hero-bow-of-the-boat
Valencia, briefly civilized | tll-tomatina-valencia-cathedral
I wore white | tll-tomatina-bunol-truck
I wore white | tll-tomatina-tomato-street
How a town gets cleaner than you do | tll-tomatina-tomato-head
Our shower was a hose, or a pond | tll-tomatina-hose-shower
```

### São Paulo NFL: Friday Night Lights, São Paulo Edition

Item `6acc94f52908c1fe79098f0f`, slug `sao-paulo-first-nfl-game-brazil`, Live (not a draft). Gallery: 11 photos. Proposed: **8 inline, 3 in the end gallery.**

**Sections in body order**

1. **Friday night lights, Itaquera edition**: Eagles versus Packers at Neo Química Arena on 6 September 2024, the first NFL regular season game in South America and a Friday night opener.
2. **Pregame, with Freed**: Pregaming with Freed, the friend from a shared love of the game; a parking lot of every jersey in the league and a helmeted cameo on Meu Timão.
3. **The cheese situation**: The foam cheeseheads turn out to be Packers fans, correcting Nancy's first draft.
4. **Why green is a dare in Itaquera**: Palmeiras history and the Corinthians grudge against green, why the Eagles wore black and white, the Green-Gos, the 34 to 29 result and Anitta at halftime.
5. **Safety, and the seat**: Pregame safety worries proved overblown; a broken seat became a roaming pass.
6. **Sunday: Magnus runs a 5K**: Magnus Waffles runs his first official 5K at the NFL Run in Parque Villa-Lobos to cries of "fofinho".
7. **If you go**: Practical notes: where the game goes next, the Metrô, beer rules, colors, the free fan fest, the run.
8. **The whole league, in one city**: Closing reflection on a crowd in every color in a stadium built around one color.

**Photos in the gallery (gallery order)**

| # | Filename slug | CMS alt text |
|---|---|---|
| 1 | `sao-paulo-nfl-pregame-fireworks-over-the-end-zone` | White fireworks over the stadium roof and blue and pink smoke on the field during the pregame show, fans in Love and Wentz jerseys in the foreground |
| 2 | `sao-paulo-nfl-friends-outside-neo-quimica-arena` | Jay, Nancy and four friends in a mix of NFL jerseys posing in front of the lit-up outer wall of Neo Química Arena |
| 3 | `sao-paulo-nfl-meu-timao-camera-in-the-crowd` | A phone on a camera rig filming fans outside the stadium at night, Nancy among them in a black football helmet |
| 4 | `sao-paulo-nfl-jay-and-nancy-at-the-end-zone` | Jay and Nancy grinning by the end zone at Neo Química Arena, Giants and Saints jerseys in the crowd around them and the field behind |
| 5 | `sao-paulo-nfl-cheeseheads-in-the-stands` | Two Packers fans in foam cheese wedge hats and LOVE 10 and ALEXANDER 23 jerseys, seen from behind in the stands; one hat reads Call me if you get lost |
| 6 | `sao-paulo-nfl-packers-touchdown-celebration` | Packers players celebrating a touchdown in the end zone below a cheering crowd holding up phones |
| 7 | `sao-paulo-nfl-anitta-halftime-fireworks` | Orange fireworks over the stadium roof and pink smoke on the field during Anitta's halftime show, her name on the scoreboard |
| 8 | `sao-paulo-nfl-run-start-line-villa-lobos` | Runners in NFL team shirts packed under palm trees at the NFL Run start arch in Parque Villa-Lobos |
| 9 | `sao-paulo-nfl-run-jay-nancy-magnus-at-the-start` | Jay, Nancy and Magnus Waffles the Samoyed in matching black Panthers NFL Run shirts at Parque Villa-Lobos |
| 10 | `sao-paulo-nfl-run-magnus-on-the-course` | Magnus trotting between Jay and Nancy on a tree-lined path, surrounded by NFL Run runners in team shirts |
| 11 | `sao-paulo-nfl-run-magnus-running-with-his-pack` | Magnus running out front on the NFL Run course, leashed to Nancy's waist belt, with Jay alongside |

**Proposed inline placements**

| Section heading | Photo (filename slug) | Alt text | Why it belongs |
|---|---|---|---|
| Friday night lights, Itaquera edition | `sao-paulo-nfl-pregame-fireworks-over-the-end-zone` | White fireworks over the stadium roof and blue and pink smoke on the field during the pregame show, fans in Love and Wentz jerseys in the foreground | Sets the scene in the stadium on the night itself. |
| Pregame, with Freed | `sao-paulo-nfl-friends-outside-neo-quimica-arena` | Jay, Nancy and four friends in a mix of NFL jerseys posing in front of the lit-up outer wall of Neo Química Arena | The pregame crew outside the arena in a mix of jerseys. |
| Pregame, with Freed | `sao-paulo-nfl-meu-timao-camera-in-the-crowd` | A phone on a camera rig filming fans outside the stadium at night, Nancy among them in a black football helmet | The Meu Timão camera and the helmet cameo the text describes. |
| The cheese situation | `sao-paulo-nfl-cheeseheads-in-the-stands` | Two Packers fans in foam cheese wedge hats and LOVE 10 and ALEXANDER 23 jerseys, seen from behind in the stands; one hat reads Call me if you get lost | The LOVE and ALEXANDER cheeseheads are the whole section. |
| Why green is a dare in Itaquera | `sao-paulo-nfl-anitta-halftime-fireworks` | Orange fireworks over the stadium roof and pink smoke on the field during Anitta's halftime show, her name on the scoreboard | The section closes on Anitta and fireworks over the roof. |
| Safety, and the seat | `sao-paulo-nfl-jay-and-nancy-at-the-end-zone` | Jay and Nancy grinning by the end zone at Neo Química Arena, Giants and Saints jerseys in the crowd around them and the field behind | "A broken seat is a stadium pass": the two of them down at the end zone. |
| Sunday: Magnus runs a 5K | `sao-paulo-nfl-run-jay-nancy-magnus-at-the-start` | Jay, Nancy and Magnus Waffles the Samoyed in matching black Panthers NFL Run shirts at Parque Villa-Lobos | The pack in matching Panthers shirts at Villa-Lobos. |
| Sunday: Magnus runs a 5K | `sao-paulo-nfl-run-magnus-running-with-his-pack` | Magnus running out front on the NFL Run course, leashed to Nancy's waist belt, with Jay alongside | "He sprinted by like a champ." |

Sections with no inline photo: If you go, The whole league, in one city.

**Stays in the end gallery (3)**: `sao-paulo-nfl-packers-touchdown-celebration`, `sao-paulo-nfl-run-start-line-villa-lobos`, `sao-paulo-nfl-run-magnus-on-the-course`

**Exact "Photo placement" value**

```
Friday night lights, Itaquera edition | sao-paulo-nfl-pregame-fireworks-over-the-end-zone
Pregame, with Freed | sao-paulo-nfl-friends-outside-neo-quimica-arena
Pregame, with Freed | sao-paulo-nfl-meu-timao-camera-in-the-crowd
The cheese situation | sao-paulo-nfl-cheeseheads-in-the-stands
Why green is a dare in Itaquera | sao-paulo-nfl-anitta-halftime-fireworks
Safety, and the seat | sao-paulo-nfl-jay-and-nancy-at-the-end-zone
Sunday: Magnus runs a 5K | sao-paulo-nfl-run-jay-nancy-magnus-at-the-start
Sunday: Magnus runs a 5K | sao-paulo-nfl-run-magnus-running-with-his-pack
```

### Paraguay: Poor Monday

Item `6acc917a22cca89e8dede053`, slug `paraguay-poor-monday`, Live (not a draft). Gallery: 10 photos. Proposed: **6 inline, 4 in the end gallery.**

**Sections in body order**

1. **The country across the bridge**: Paraguay sat across the bridge at the Triple Frontier for four years; Nancy and Magnus finally drive there on a whim.
2. **Three days, two sleep stops, countless puppy treats**: Three days from São Paulo to Foz do Iguaçu; a vegan bakery, and Magnus at doggy daycare to keep his papers clean before the move.
3. **Eight silly minutes**: The walk across the Friendship Bridge into Ciudad del Este, its markets and bird murals, then an Uber to Saltos del Monday, which she has to herself.
4. **Poor Monday**: A riff on the "Poor Niagara!" line: Monday is criminally overlooked.
5. **The staircase under both waterfalls**: Geology: Iguazú and Monday sit on the same Cretaceous basalt steps, and the falls have retreated upstream from the Paraná.
6. **The dinosaur park, with apologies to Magnus**: Back in Brazil, Magnus is scared by dinosaur sound effects and chased by peacocks at Vale dos Dinossauros.
7. **If you go**: Practical notes: the bridge, getting to Monday, the elevator, the other viewpoints, hours, the new bridge, the dog, the stamp.
8. **Paraguay, checked off**: The drive home and the moral: most postponed places are closer than they look.

**Photos in the gallery (gallery order)**

| # | Filename slug | CMS alt text |
|---|---|---|
| 1 | `paraguay-saltos-del-monday-falls` | Saltos del Monday in full flow, brown water thundering over the edge into mist, seen from near the base |
| 2 | `paraguay-monday-river-gorge` | The Monday River running brown and fast through a forested gorge below the falls |
| 3 | `paraguay-amizade-bird-mural-pas` | A mural by the artist PAS of two birds in Brazilian and Paraguayan flag colors, with the word amizade, friendship, painted between them |
| 4 | `paraguay-triple-frontier-neon-sign` | A neon cactus sign with arrows pointing to Paraguay, Brasil and Argentina |
| 5 | `paraguay-ciudad-del-este-skyline` | Ciudad del Este's skyline of shopping towers and billboards above the trees |
| 6 | `paraguay-ciudad-del-este-street-mural-shoppers` | Shoppers carrying bags past a long, brightly painted street mural, seen from behind |
| 7 | `paraguay-parana-river-boats` | Small fishing boats and a moored tour boat on a calm green river at the Triple Frontier |
| 8 | `paraguay-parana-river-island` | A wide river bend with a round forested island under an overcast sky, near the Triple Frontier |
| 9 | `paraguay-vale-dos-dinossauros-composite` | A souvenir photo composite from Vale dos Dinossauros: Nancy and Magnus on a waterfall walkway with digitally added dinosaurs |
| 10 | `paraguay-cat` | A fluffy blue-eyed cat with Siamese markings sitting at a cafe |

**Proposed inline placements**

| Section heading | Photo (filename slug) | Alt text | Why it belongs |
|---|---|---|---|
| The country across the bridge | `paraguay-triple-frontier-neon-sign` | A neon cactus sign with arrows pointing to Paraguay, Brasil and Argentina | The section is about the Triple Frontier; the sign points to all three countries. |
| Eight silly minutes | `paraguay-amizade-bird-mural-pas` | A mural by the artist PAS of two birds in Brazilian and Paraguayan flag colors, with the word amizade, friendship, painted between them | "Murals of tropical birds" in both countries' colors, word for word. |
| Eight silly minutes | `paraguay-ciudad-del-este-street-mural-shoppers` | Shoppers carrying bags past a long, brightly painted street mural, seen from behind | "Shoppers balanced towers of duty-free bags" in Ciudad del Este. |
| Poor Monday | `paraguay-saltos-del-monday-falls` | Saltos del Monday in full flow, brown water thundering over the edge into mist, seen from near the base | The heading is the falls; the strongest frame of the trip. Placed here rather than in Eight silly minutes so it lands right under the "poor Monday" line. |
| The staircase under both waterfalls | `paraguay-monday-river-gorge` | The Monday River running brown and fast through a forested gorge below the falls | The gorge shows the basalt and river the geology describes. |
| The dinosaur park, with apologies to Magnus | `paraguay-vale-dos-dinossauros-composite` | A souvenir photo composite from Vale dos Dinossauros: Nancy and Magnus on a waterfall walkway with digitally added dinosaurs | The Vale dos Dinossauros souvenir composite with Magnus. |

Sections with no inline photo: Three days, two sleep stops, countless puppy treats, If you go, Paraguay, checked off.

**Stays in the end gallery (4)**: `paraguay-ciudad-del-este-skyline`, `paraguay-parana-river-boats`, `paraguay-parana-river-island`, `paraguay-cat`

**Exact "Photo placement" value**

```
The country across the bridge | paraguay-triple-frontier-neon-sign
Eight silly minutes | paraguay-amizade-bird-mural-pas
Eight silly minutes | paraguay-ciudad-del-este-street-mural-shoppers
Poor Monday | paraguay-saltos-del-monday-falls
The staircase under both waterfalls | paraguay-monday-river-gorge
The dinosaur park, with apologies to Magnus | paraguay-vale-dos-dinossauros-composite
```

### Eswatini and Lesotho: How Many Goats Can Fit in a Small Car?

Item `6acc91792709d096fa1eb21f`, slug `eswatini-lesotho-how-many-goats-small-car`, Live (not a draft). Gallery: 17 photos. Proposed: **7 inline, 10 in the end gallery.**

**Sections in body order**

1. **Cape Town, I'm falling hard for you**: The Cape Town Marathon with Jay, rituals and a waterfront dinner, a bread bowl cover, and the geography of the two countries inside South Africa.
2. **Detour: Kruger, and the leopard's pantry**: A Kruger stop: lightning kills the hot water, then the Big 5 plus a mongoose, hyena pups, a sable and a leopard kill in a tree.
3. **Why the impala was in the tree**: Explainer: leopards hoist kills to keep them from lions and hyenas; the hyena pups are the reason.
4. **Eswatini: enter Crazy Dave**: Touring with Crazy Dave: a school, a cultural center and spear dance, Swazi Candles and Ngwenya Glass.
5. **Lesotho: born in the mountains**: The flag and Cascadia mix-up, the highest low point on earth, and a military festival in town over Maluti beers.
6. **If you go**: Practical notes: the Cape Town Marathon date change, Eswatini day tours, the makers, layers for Lesotho.
7. **What I'm taking home**: Closing reflection and the goat count: fourteen goats, one small car.

**Photos in the gallery (gallery order)**

| # | Filename slug | CMS alt text |
|---|---|---|
| 1 | `tll-sa-kruger-giraffe-roadside` | A giraffe standing at the edge of a Kruger road, looking straight at the camera |
| 2 | `tll-sa-kruger-young-elephant` | A young elephant with its ears spread wide and trunk curled, facing the camera in dry grass |
| 3 | `tll-sa-kruger-hyena-pups` | Two fluffy spotted hyena pups on bare sandy ground, both looking toward the camera |
| 4 | `tll-sa-kruger-spotted-hyena-yawn` | An adult spotted hyena mid-yawn beside a bush, with a second hyena half hidden in the leaves |
| 5 | `tll-sa-kruger-dwarf-mongoose` | A small brown mongoose peering out from behind a weathered fallen log |
| 6 | `tll-sa-kruger-bateleur-eagle` | A bateleur eagle with a red face and feet perched on a bare branch above hazy Kruger bushveld |
| 7 | `tll-sa-kruger-trumpeter-hornbills` | Two trumpeter hornbills perched beak to beak at the top of a dead branch against a pale sky |
| 8 | `tll-sa-kruger-leopard-tortoise-on-road` | A leopard tortoise crossing a wet road in front of a parked white car |
| 9 | `tll-sa-eswatini-kids-running-roadside` | Five schoolchildren with backpacks running along a road shoulder under a wide blue sky, seen from behind |
| 10 | `tll-sa-eswatini-beehive-huts` | Traditional Swazi beehive huts of woven grass behind reed fences, shaded by a large spreading tree |
| 11 | `tll-sa-eswatini-dancers-in-sheepskin` | Swazi dancers in white sheepskin arm and leg bands and beaded necklaces crouching together with wooden staffs |
| 12 | `tll-sa-eswatini-woman-in-emahiya` | A woman seen from behind wearing a red and black emahiya wrap over one shoulder, her braids in a high bun |
| 13 | `tll-sa-eswatini-twin-waterfall` | A twin waterfall pouring down a rocky cliff into a green pool, surrounded by forest |
| 14 | `tll-sa-eswatini-swazi-candles-elephants` | Rows of hand-patterned wax candles shaped like elephants and rhinos in swirls of blue, orange and purple |
| 15 | `tll-sa-eswatini-wood-carver` | A wood carver in a bucket hat and varsity jacket working on a painted carving while seated on a tree stump |
| 16 | `tll-sa-lesotho-maseru-hill` | A flat-topped sandstone hill rising above a town and a grassy park under a deep blue sky |
| 17 | `tll-sa-lesotho-bar-flatbread` | A thin-crust flatbread on a bar counter, with a menu card and drinks fridges behind it |

**Proposed inline placements**

| Section heading | Photo (filename slug) | Alt text | Why it belongs |
|---|---|---|---|
| Detour: Kruger, and the leopard's pantry | `tll-sa-kruger-young-elephant` | A young elephant with its ears spread wide and trunk curled, facing the camera in dry grass | The Big 5, in the clearest single animal frame. |
| Detour: Kruger, and the leopard's pantry | `tll-sa-kruger-dwarf-mongoose` | A small brown mongoose peering out from behind a weathered fallen log | The mongoose is named as a new lifetime sighting. |
| Why the impala was in the tree | `tll-sa-kruger-hyena-pups` | Two fluffy spotted hyena pups on bare sandy ground, both looking toward the camera | The section ends on the hyena pups as "the future reason that impala is up a tree". |
| Eswatini: enter Crazy Dave | `tll-sa-eswatini-dancers-in-sheepskin` | Swazi dancers in white sheepskin arm and leg bands and beaded necklaces crouching together with wooden staffs | The cultural center and the spear dance. |
| Eswatini: enter Crazy Dave | `tll-sa-eswatini-swazi-candles-elephants` | Rows of hand-patterned wax candles shaped like elephants and rhinos in swirls of blue, orange and purple | Swazi Candles and the millefiori technique the text explains. |
| Lesotho: born in the mountains | `tll-sa-lesotho-maseru-hill` | A flat-topped sandstone hill rising above a town and a grassy park under a deep blue sky | The town and the mountain country in one frame. |
| Lesotho: born in the mountains | `tll-sa-lesotho-bar-flatbread` | A thin-crust flatbread on a bar counter, with a menu card and drinks fridges behind it | "Swapped stories over Maluti beers": the bar. |

Sections with no inline photo: Cape Town, I'm falling hard for you, If you go, What I'm taking home.

**Stays in the end gallery (10)**: `tll-sa-kruger-giraffe-roadside`, `tll-sa-kruger-spotted-hyena-yawn`, `tll-sa-kruger-bateleur-eagle`, `tll-sa-kruger-trumpeter-hornbills`, `tll-sa-kruger-leopard-tortoise-on-road`, `tll-sa-eswatini-kids-running-roadside`, `tll-sa-eswatini-beehive-huts`, `tll-sa-eswatini-woman-in-emahiya`, `tll-sa-eswatini-twin-waterfall`, `tll-sa-eswatini-wood-carver`

**Exact "Photo placement" value**

```
Detour: Kruger, and the leopard's pantry | tll-sa-kruger-young-elephant
Detour: Kruger, and the leopard's pantry | tll-sa-kruger-dwarf-mongoose
Why the impala was in the tree | tll-sa-kruger-hyena-pups
Eswatini: enter Crazy Dave | tll-sa-eswatini-dancers-in-sheepskin
Eswatini: enter Crazy Dave | tll-sa-eswatini-swazi-candles-elephants
Lesotho: born in the mountains | tll-sa-lesotho-maseru-hill
Lesotho: born in the mountains | tll-sa-lesotho-bar-flatbread
```

### Portuguese Camino: Obrigada, F*: 260 km on the Portuguese Coastal Camino

Item `6acc853d27e1641479b01b28`, slug `portuguese-coastal-camino-260-km`, Live (not a draft). Gallery: 25 photos. Proposed: **11 inline, 14 in the end gallery.**

**Sections in body order**

1. **When they say walk, you walk**: A friend's invitation, a midnight drive from Lisbon to Porto, a shell ceremony on the beach and a wander through Porto.
2. **The stats, because you know I dig data**: Trip stats: days, kilometers, hours, blisters, the boat, espressos.
3. **What the Compostela actually certifies**: Explainer: only the last 100 km count, two stamps a day in the credencial, and the route must be continuous in place, not time.
4. **Albergues: bunk beds, shower sandals, and unexpected friendships**: Life in the pilgrim hostels, laundry on packs, and a Brazilian pilgrim relieved to hear Portuguese.
5. **Obrigada, F***: The accidental catchphrase from saying "obrigada" all through Spain, and what the Camino is about.
6. **Coastal or Central? We walked both, badly**: A detour to the Central Route for the Barcelos rooster, an Uber back to the coast, a spider bite, vineyards, dunes and a wine festival.
7. **The boat into Spain: there is no bridge at Caminha**: At Caminha the Coastal Way crosses the Minho by tide-timed boat into A Guarda and Galicia.
8. **Food was a love language**: Pastries, octopus in O Porriño, Basque steaks, and a Michelin-recognized meal in hiking clothes.
9. **Arriving in Santiago de Compostela**: Arrival on the cathedral plaza, champagne and gelato, then Peneda-Gerês and peacock chasing in Lisbon.
10. **Would we walk the Portuguese Camino again?**: Yes; what to do differently and why to go.

**Photos in the gallery (gallery order)**

| # | Filename slug | CMS alt text |
|---|---|---|
| 1 | `tll-camino-espresso-backpacks` | An espresso and a slice of toast on a cafe table at dawn, with three loaded backpacks piled on the ground beside the chairs. |
| 2 | `tll-camino-porto-rooftops` | The terracotta rooftops of Porto stacked up the hillside, with the Clerigos bell tower rising above them. |
| 3 | `tll-camino-albergue-labruge` | A pilgrim standing outside the white facade of the Albergue S. Tiago de Labruge, a municipal pilgrim hostel on the Portuguese Coastal Way. |
| 4 | `tll-camino-waymarker-tiles` | Three blue ceramic tiles set into a wall marking the route: a yellow arrow, a scallop shell, and one reading Camino de Santiago, Camino Portugues, with a pilgrim in an orange pack walking up the lane beyond. |
| 5 | `tll-camino-pilgrim-mural-shells` | A street mural of a pilgrim seen from behind in a red beanie and backpack, looking out over blue hills, beside two giant painted scallop shells with the red cross of Santiago. |
| 6 | `tll-camino-underpass-mural` | A pilgrim standing against a brightly painted underpass mural of a purple flower, a songbird and a butterfly. |
| 7 | `tll-camino-coastal-fort` | A granite coastal fort with a round sentry turret on the Atlantic shore, a long beach and apartment blocks stretching away behind it. |
| 8 | `tll-camino-atlantic-shoreline` | Looking straight down at the Atlantic shoreline, a band of boulders between green scrub and clear turquoise water. |
| 9 | `tll-camino-church-flowers` | A white Portuguese church with a clock tower, its doorway framed and the square in front of it banked with beds of pink and white flowers. |
| 10 | `tll-camino-caminha-clock-tower` | Two pilgrims standing under the medieval clock tower gate in Caminha, the Portuguese town where the Coastal Way reaches the Minho river. |
| 11 | `tll-camino-caminho-sign` | Two pilgrims in sunglasses and packs grinning beside a yellow road sign reading Caminho de Santiago. |
| 12 | `tll-camino-vineyard` | Rows of vines trained on granite posts in a green vinho verde vineyard, with wooded hills behind and red roses planted at the end of a row. |
| 13 | `tll-camino-bell-tower-vines` | A weathered stone bell tower rising above village rooftops, seen through the leaves of a vineyard in the foreground. |
| 14 | `tll-camino-barcelos-rooster` | A painted ceramic Barcelos rooster, black with a red comb and yellow beak, photographed close up against the sky. The galo is the emblem of Barcelos, on the Camino's Central Route. |
| 15 | `tll-camino-barcelos-fountain` | Four pilgrims with arms raised, posing on the steps of a stone fountain in the square at Barcelos, a white baroque church behind them. |
| 16 | `tll-camino-festival-food` | A paper plate of fried fritters and potato salad held up at a street food stall, with two women serving behind the table, one in traditional Portuguese dress. |
| 17 | `tll-camino-chocolate-tempering` | Four of the group in white lab coats holding chocolate samples under a sign reading Temperagem, Tempering, on a chocolate factory tour. |
| 18 | `tll-camino-long-table-toast` | Hands reaching across a long outdoor table to clink glasses of wine and sangria over bowls of bread, with a dozen people laughing along its length. |
| 19 | `tll-camino-four-pilgrims-selfie` | Four women in sunglasses and backpacks crowded into a selfie against a bright blue sky, a scallop shell hanging from one pack. |
| 20 | `tll-camino-santiago-cathedral-tower` | A baroque bell tower of the Cathedral of Santiago de Compostela seen from below against a heavy grey sky, above a mossy stone wall. |
| 21 | `tll-camino-santiago-arrival` | Four pilgrims standing arm in arm with their packs on the stone plaza in front of the Cathedral of Santiago de Compostela, at the end of the walk. |
| 22 | `tll-camino-lisbon-castle` | The crenellated walls and towers of the Castelo de Sao Jorge in Lisbon, with the Portuguese flag and the city flag flying above them. |
| 23 | `tll-camino-lisbon-peacock` | A peacock with its tail fully fanned standing on the cobbles inside the walls of the Castelo de Sao Jorge in Lisbon. |
| 24 | `tll-camino-lisbon-umbrellas` | Dozens of rainbow-colored umbrellas suspended on wires above a narrow Lisbon street, seen from below between tall old buildings. |
| 25 | `tll-camino-lisbon-riverside` | Two women taking a selfie high above the Tagus in Lisbon, with the Vasco da Gama bridge and tower behind them. |

**Proposed inline placements**

| Section heading | Photo (filename slug) | Alt text | Why it belongs |
|---|---|---|---|
| When they say walk, you walk | `tll-camino-porto-rooftops` | The terracotta rooftops of Porto stacked up the hillside, with the Clerigos bell tower rising above them. | The section ends wandering Porto, the start of the walk. |
| What the Compostela actually certifies | `tll-camino-waymarker-tiles` | Three blue ceramic tiles set into a wall marking the route: a yellow arrow, a scallop shell, and one reading Camino de Santiago, Camino Portugues, with a pilgrim in an orange pack walking up the lane beyond. | The tiled arrow, shell and "Camino Portugues" marker carry the idea of a continuous, marked route. |
| Albergues: bunk beds, shower sandals, and unexpected friendships | `tll-camino-albergue-labruge` | A pilgrim standing outside the white facade of the Albergue S. Tiago de Labruge, a municipal pilgrim hostel on the Portuguese Coastal Way. | An actual municipal albergue on the Coastal Way. |
| Obrigada, F* | `tll-camino-espresso-backpacks` | An espresso and a slice of toast on a cafe table at dawn, with three loaded backpacks piled on the ground beside the chairs. | "Accept a café" and the daily espresso ritual, with packs on the ground. |
| Coastal or Central? We walked both, badly | `tll-camino-barcelos-rooster` | A painted ceramic Barcelos rooster, black with a red comb and yellow beak, photographed close up against the sky. The galo is the emblem of Barcelos, on the Camino's Central Route. | The rooster the text describes, "staring down at us against the sky". |
| Coastal or Central? We walked both, badly | `tll-camino-vineyard` | Rows of vines trained on granite posts in a green vinho verde vineyard, with wooded hills behind and red roses planted at the end of a row. | "Vineyards glowing in golden light." |
| The boat into Spain: there is no bridge at Caminha | `tll-camino-caminha-clock-tower` | Two pilgrims standing under the medieval clock tower gate in Caminha, the Portuguese town where the Coastal Way reaches the Minho river. | Caminha, the town where the boat leaves. |
| Food was a love language | `tll-camino-long-table-toast` | Hands reaching across a long outdoor table to clink glasses of wine and sangria over bowls of bread, with a dozen people laughing along its length. | Glasses clinking across a long table: the dinners were sacred. |
| Arriving in Santiago de Compostela | `tll-camino-santiago-arrival` | Four pilgrims standing arm in arm with their packs on the stone plaza in front of the Cathedral of Santiago de Compostela, at the end of the walk. | The four pilgrims on the cathedral plaza: the arrival itself. |
| Arriving in Santiago de Compostela | `tll-camino-lisbon-peacock` | A peacock with its tail fully fanned standing on the cobbles inside the walls of the Castelo de Sao Jorge in Lisbon. | The section ends with "peacock chasing in Lisboa". |
| Would we walk the Portuguese Camino again? | `tll-camino-four-pilgrims-selfie` | Four women in sunglasses and backpacks crowded into a selfie against a bright blue sky, a scallop shell hanging from one pack. | A warm closing frame of the four pilgrims. |

Sections with no inline photo: The stats, because you know I dig data.

**Stays in the end gallery (14)**: `tll-camino-pilgrim-mural-shells`, `tll-camino-underpass-mural`, `tll-camino-coastal-fort`, `tll-camino-atlantic-shoreline`, `tll-camino-church-flowers`, `tll-camino-caminho-sign`, `tll-camino-bell-tower-vines`, `tll-camino-barcelos-fountain`, `tll-camino-festival-food`, `tll-camino-chocolate-tempering`, `tll-camino-santiago-cathedral-tower`, `tll-camino-lisbon-castle`, `tll-camino-lisbon-umbrellas`, `tll-camino-lisbon-riverside`

**Exact "Photo placement" value**

```
When they say walk, you walk | tll-camino-porto-rooftops
What the Compostela actually certifies | tll-camino-waymarker-tiles
Albergues: bunk beds, shower sandals, and unexpected friendships | tll-camino-albergue-labruge
Obrigada, F* | tll-camino-espresso-backpacks
Coastal or Central? We walked both, badly | tll-camino-barcelos-rooster
Coastal or Central? We walked both, badly | tll-camino-vineyard
The boat into Spain: there is no bridge at Caminha | tll-camino-caminha-clock-tower
Food was a love language | tll-camino-long-table-toast
Arriving in Santiago de Compostela | tll-camino-santiago-arrival
Arriving in Santiago de Compostela | tll-camino-lisbon-peacock
Would we walk the Portuguese Camino again? | tll-camino-four-pilgrims-selfie
```

### Kilimanjaro: Someone Was Already Awake

Item `6aca68363e10fde58370d9a5`, slug `kilimanjaro-someone-was-already-awake`, Live (not a draft). Gallery: 25 photos. Proposed: **7 inline, 18 in the end gallery.**

**Sections in body order**

1. **We did not conquer anything**: Eight days on the Lemosho Route, nine hikers and twenty-eight crew; porter welfare standards and what to ask an operator.
2. **Team Sexy Awesome**: Portraits of the nine teammates and their quirks, Melvin's first summit and first snow.
3. **The numbers**: Trip stats.
4. **How it actually went**: Day by day: Moshi, the forest and monkeys, the Shira Plateau and Lava Tower, the Barranco Wall, the rest day.
5. **Summit night**: Climbing in the dark to Uhuru Peak at sunrise; the vanishing glaciers are the real story, not the sign.
6. **Coming down**: The descent through jungle and rain, then acrobats, a contortionist and a swim.
7. **To the people who made it possible**: Thanks to the guides and the twenty-eight crew; learn the name of the person making your coffee.

**Photos in the gallery (gallery order)**

| # | Filename slug | CMS alt text |
|---|---|---|
| 1 | `tll-kili-morning-mugs` | Two trekkers standing and talking in the forest camp, each holding a metal mug of morning coffee, a canvas tent behind them. |
| 2 | `tll-kili-colobus-foliage` | A black-and-white colobus monkey sitting among bright green rainforest leaves, its white mantle vivid against black fur. |
| 3 | `tll-kili-colobus-tail` | A black-and-white colobus monkey on a mossy branch, its long white tail hanging straight down below it. |
| 4 | `tll-kili-blue-monkey` | A blue monkey in close profile, grizzled grey and chestnut with amber eyes, in the rainforest understory. |
| 5 | `tll-kili-moorland-meru` | Kilimanjaro's moorland zone: heather scrub and lichen-covered boulders in the foreground, a floor of cloud below, and Mount Meru rising through it under a deep blue sky. |
| 6 | `tll-kili-camp-above-clouds` | Green dome tents and a crew mess shelter pitched on a ridge at sunrise, above a solid floor of cloud with Mount Meru breaking through it. |
| 7 | `tll-kili-barranco-wall` | Trekkers and porters scrambling up the steep rock of the Barranco Wall, using hands as well as feet. |
| 8 | `tll-kili-sunset-meru` | Two people sitting close together on a rock at dusk, looking out over the ridgelines toward the cone of Mount Meru in the distance. |
| 9 | `tll-kili-kibo-daylight` | Two trekkers with arms flung wide on the scree slope below Kibo, the snow-streaked summit cone filling the sky behind them. |
| 10 | `tll-kili-kibo-at-night` | The snow-covered dome of Kibo lit by moonlight under a sky full of stars. |
| 11 | `tll-kili-summit-sunrise` | Sunrise seen from near the summit of Kilimanjaro, an orange band of light above a sea of cloud, with the jagged outline of Mawenzi to the right and patches of snow in the foreground. |
| 12 | `tll-kili-uhuru-peak-team` | The trekking team and guides gathered around the wooden summit sign at Uhuru Peak, Mount Kilimanjaro, in heavy layers under a clear blue sky. |
| 13 | `tll-kili-full-team-and-crew` | The full group of nine trekkers and twenty-eight crew gathered on the rocks for a team photograph, holding a Much Better Adventures banner, with Kilimanjaro behind them. |
| 14 | `tll-kili-mess-tent-cook` | A member of the Ahsante Tours crew sitting in the kitchen tent between two large pots on gas burners, holding a wooden spoon and smiling at the camera. |
| 15 | `tll-kili-roadside-walk` | A woman walking along a roadside in Tanzania carrying a large pink cloth-wrapped bundle balanced on her head, banana palms behind her. |
| 16 | `tll-kili-fruit-tray` | A woman seen from behind carrying a wide tray of bananas and papayas balanced on her head along a street. |
| 17 | `tll-kili-banana-market` | Three women sitting together among stacked bunches of green bananas at a market, sacks of produce piled behind them. |
| 18 | `tll-kili-tuktuk` | Two men leaning out of a tuk-tuk, both throwing peace signs and laughing. |
| 19 | `tll-kili-mungere-school` | Two men standing in front of a painted wall reading Welcome to Mungere School, Home of the Red Rhinos, with a cartoon rhino beside the lettering. |
| 20 | `tll-kili-safari-vehicle` | A woman in a cap leaning on the open roof hatch of a safari vehicle, smiling at the camera. |
| 21 | `tll-kili-zebra` | A plains zebra standing in long golden grass with acacia trees behind. |
| 22 | `tll-kili-baboons` | Five olive baboons sitting along a fallen tree trunk, the one nearest the camera mid-yawn with its mouth wide open. |
| 23 | `tll-kili-vervet-monkey` | A vervet monkey sitting on a tree stump holding a thin green stem, surrounded by foliage. |
| 24 | `tll-kili-kingfisher` | A grey-headed kingfisher with a red bill and bright blue wings, perched on a bare branch. |
| 25 | `tll-kili-barbet-termite-mound` | A red-and-yellow barbet, spotted white on yellow with a scarlet head, perched on top of a termite mound. |

**Proposed inline placements**

| Section heading | Photo (filename slug) | Alt text | Why it belongs |
|---|---|---|---|
| We did not conquer anything | `tll-kili-morning-mugs` | Two trekkers standing and talking in the forest camp, each holding a metal mug of morning coffee, a canvas tent behind them. | Picks up the opening coffee ritual the intro sets up. |
| We did not conquer anything | `tll-kili-mess-tent-cook` | A member of the Ahsante Tours crew sitting in the kitchen tent between two large pots on gas burners, holding a wooden spoon and smiling at the camera. | The crew at work, the real subject of the section. |
| How it actually went | `tll-kili-colobus-foliage` | A black-and-white colobus monkey sitting among bright green rainforest leaves, its white mantle vivid against black fur. | Day 2, "we chase skunky monkeys" in the forest. |
| How it actually went | `tll-kili-barranco-wall` | Trekkers and porters scrambling up the steep rock of the Barranco Wall, using hands as well as feet. | Day 6, the Barranco Wall. |
| Summit night | `tll-kili-kibo-at-night` | The snow-covered dome of Kibo lit by moonlight under a sky full of stars. | The summit cone under stars: summit night. |
| Summit night | `tll-kili-summit-sunrise` | Sunrise seen from near the summit of Kilimanjaro, an orange band of light above a sea of cloud, with the jagged outline of Mawenzi to the right and patches of snow in the foreground. | "Uhuru Peak at a bright orange sunrise." Chosen over the Uhuru sign photo because the text says the sign is not the story. |
| To the people who made it possible | `tll-kili-full-team-and-crew` | The full group of nine trekkers and twenty-eight crew gathered on the rocks for a team photograph, holding a Much Better Adventures banner, with Kilimanjaro behind them. | Nine hikers and twenty-eight crew in one frame, exactly who the section thanks. |

Sections with no inline photo: Team Sexy Awesome, The numbers, Coming down.

**Stays in the end gallery (18)**: `tll-kili-colobus-tail`, `tll-kili-blue-monkey`, `tll-kili-moorland-meru`, `tll-kili-camp-above-clouds`, `tll-kili-sunset-meru`, `tll-kili-kibo-daylight`, `tll-kili-uhuru-peak-team`, `tll-kili-roadside-walk`, `tll-kili-fruit-tray`, `tll-kili-banana-market`, `tll-kili-tuktuk`, `tll-kili-mungere-school`, `tll-kili-safari-vehicle`, `tll-kili-zebra`, `tll-kili-baboons`, `tll-kili-vervet-monkey`, `tll-kili-kingfisher`, `tll-kili-barbet-termite-mound`

**Exact "Photo placement" value**

```
We did not conquer anything | tll-kili-morning-mugs
We did not conquer anything | tll-kili-mess-tent-cook
How it actually went | tll-kili-colobus-foliage
How it actually went | tll-kili-barranco-wall
Summit night | tll-kili-kibo-at-night
Summit night | tll-kili-summit-sunrise
To the people who made it possible | tll-kili-full-team-and-crew
```

### Pantanal: Glimmers in the Wild: 120 Wooden Bridges, One Jaguar, and No Guide

Item `6ac869cbead7f028cee5bcba`, slug `pantanal-glimmers-in-the-wild`, Live (not a draft). Gallery: 25 photos. Proposed: **9 inline, 16 in the end gallery.**

**Sections in body order**

1. **Day one: red lightning and the long nothing**: Eighteen hours out of São Paulo past soy fields, red lightning, zebu cattle and rheas, to Rondonópolis.
2. **The road that ends on purpose**: The Transpantaneira: 147 km, about 120 wooden bridges, never paved, and the best wildlife corridor by accident.
3. **Kilometer 42**: Pousada Rio Claro: monkeys, jabirus, a capybara at the door, and a jabiru tailing a man with a bucket.
4. **The hat**: The "Xô Cesso" cap and what it actually says.
5. **Why the jaguars let you watch**: Why Porto Jofre jaguars are visible (recovery and habituation), the tourism pressure, and their own jaguars: one asleep, one swimming and doing zoomies.
6. **The stork, concluded**: A jabiru empties itself into the car on the drive back; no anteater, no otter.
7. **Chapada, and down**: Chapada dos Guimarães at sunset and the Morro do Vento overlook, then Campo Grande and Três Lagoas.
8. **What I would tell you**: Advice: what DIY really means here, fuel, season, boat etiquette, drive slowly, and the glimmers.

**Photos in the gallery (gallery order)**

| # | Filename slug | CMS alt text |
|---|---|---|
| 1 | `pantanal-driving-the-transpantaneira` | A white car on the dirt Transpantaneira with a truck throwing up dust behind it |
| 2 | `pantanal-rhea-in-morning-mist` | A rhea standing alone in tall grass in heavy morning mist |
| 3 | `pantanal-jabiru-stork-in-the-marsh` | A jabiru stork bending to feed in marsh grass, its black head and red collar vivid against the white body |
| 4 | `pantanal-jabiru-following-the-man-with-the-bucket` | A jabiru stork walking along a sandy track a few steps behind a man carrying a bucket and a water bottle |
| 5 | `pantanal-jabiru-nest-with-chicks` | An adult jabiru standing over two chicks in an enormous stick nest on a dead tree |
| 6 | `pantanal-parakeet-at-the-bee-feeder` | A green nanday parakeet on a wooden rail surrounded by flying bees at a feeding station |
| 7 | `pantanal-hyacinth-macaws-on-a-branch` | Four deep blue hyacinth macaws perched on a bare branch, one landing with wings spread |
| 8 | `pantanal-hyacinth-macaw-in-flight` | A hyacinth macaw dropping out of a tree with its wings fully open, cobalt blue against green leaves |
| 9 | `pantanal-yellow-billed-cardinal-on-a-rail` | A yellow-billed cardinal with a bright red head perched on a weathered wooden rail |
| 10 | `pantanal-capuchin-monkey` | A capuchin monkey in profile looking up and to the side, backlit in pale green foliage |
| 11 | `pantanal-capuchin-with-stolen-fruit` | A capuchin monkey in a tree holding a yellow fruit in both hands and watching the camera |
| 12 | `pantanal-tapir-walking-away` | A tapir walking away into tall grass and scrub, photographed squarely from behind |
| 13 | `pantanal-capybara-portrait` | A close portrait of a capybara against bright green grass, looking entirely unimpressed |
| 14 | `pantanal-capybara-swimming` | A capybara swimming with just its head and back above the water, framed by green leaves |
| 15 | `pantanal-capybaras-and-caimans-sharing-a-bank` | Three capybaras dozing on a green bank with three caimans lying in the water hyacinth just below them |
| 16 | `pantanal-caiman-with-its-mouth-open` | A caiman lying on a grassy bank with its mouth wide open, teeth showing |
| 17 | `pantanal-black-skimmer-on-the-sand` | A black skimmer standing on a river sandbar, its long orange and black bill in profile |
| 18 | `pantanal-heron-with-a-fish` | A cocoi heron standing in water hyacinth with a whole fish gripped crosswise in its beak |
| 19 | `pantanal-nancy-and-sami-in-the-safari-boat` | Nancy and Sami in life jackets on the bench seats of an open aluminum safari boat on the brown river |
| 20 | `pantanal-jaguar-asleep-on-the-bank` | A jaguar fast asleep on a mud bank with its head on its paws, so still it looks stuffed |
| 21 | `pantanal-jaguar-charging-through-the-shallows` | A jaguar driving low and fast through shallow water, throwing spray off its shoulders |
| 22 | `pantanal-jaguar-splashing-into-the-river` | A jaguar hitting the water at speed in an explosion of spray at the river's edge |
| 23 | `pantanal-jaguar-walking-the-sandbar` | A jaguar walking along a sandbar at the water's edge with its tail up, coming toward the camera |
| 24 | `pantanal-jaguar-sitting-in-the-river` | A jaguar sitting chest-deep in the river near a sandbar, tongue out, looking back over its shoulder |
| 25 | `pantanal-chapada-dos-guimaraes-cliffs` | The red sandstone cliffs of Chapada dos Guimaraes dropping away over green hills and a hazy plain |

**Proposed inline placements**

| Section heading | Photo (filename slug) | Alt text | Why it belongs |
|---|---|---|---|
| Day one: red lightning and the long nothing | `pantanal-rhea-in-morning-mist` | A rhea standing alone in tall grass in heavy morning mist | Rheas are named in this section. |
| The road that ends on purpose | `pantanal-driving-the-transpantaneira` | A white car on the dirt Transpantaneira with a truck throwing up dust behind it | The road itself. |
| Kilometer 42 | `pantanal-jabiru-following-the-man-with-the-bucket` | A jabiru stork walking along a sandy track a few steps behind a man carrying a bucket and a water bottle | The exact scene described: the jabiru following the man with the bucket. |
| Kilometer 42 | `pantanal-capybara-portrait` | A close portrait of a capybara against bright green grass, looking entirely unimpressed | The capybara that came to the door. |
| Why the jaguars let you watch | `pantanal-jaguar-asleep-on-the-bank` | A jaguar fast asleep on a mud bank with its head on its paws, so still it looks stuffed | "So motionless that we spent a long time debating whether he was taxidermied." |
| Why the jaguars let you watch | `pantanal-jaguar-charging-through-the-shallows` | A jaguar driving low and fast through shallow water, throwing spray off its shoulders | The second jaguar, moving through the water. |
| The stork, concluded | `pantanal-jabiru-stork-in-the-marsh` | A jabiru stork bending to feed in marsh grass, its black head and red collar vivid against the white body | The jabiru, for the payoff. (No photo of the incident itself, thankfully.) |
| Chapada, and down | `pantanal-chapada-dos-guimaraes-cliffs` | The red sandstone cliffs of Chapada dos Guimaraes dropping away over green hills and a hazy plain | Red cliffs at Chapada, matching "red cliffs in gold light". |
| What I would tell you | `pantanal-nancy-and-sami-in-the-safari-boat` | Nancy and Sami in life jackets on the bench seats of an open aluminum safari boat on the brown river | "Then we got in a boat with a man who knew exactly where the jaguars were." |

Sections with no inline photo: The hat.

**Stays in the end gallery (16)**: `pantanal-jabiru-nest-with-chicks`, `pantanal-parakeet-at-the-bee-feeder`, `pantanal-hyacinth-macaws-on-a-branch`, `pantanal-hyacinth-macaw-in-flight`, `pantanal-yellow-billed-cardinal-on-a-rail`, `pantanal-capuchin-monkey`, `pantanal-capuchin-with-stolen-fruit`, `pantanal-tapir-walking-away`, `pantanal-capybara-swimming`, `pantanal-capybaras-and-caimans-sharing-a-bank`, `pantanal-caiman-with-its-mouth-open`, `pantanal-black-skimmer-on-the-sand`, `pantanal-heron-with-a-fish`, `pantanal-jaguar-splashing-into-the-river`, `pantanal-jaguar-walking-the-sandbar`, `pantanal-jaguar-sitting-in-the-river`

**Exact "Photo placement" value**

```
Day one: red lightning and the long nothing | pantanal-rhea-in-morning-mist
The road that ends on purpose | pantanal-driving-the-transpantaneira
Kilometer 42 | pantanal-jabiru-following-the-man-with-the-bucket
Kilometer 42 | pantanal-capybara-portrait
Why the jaguars let you watch | pantanal-jaguar-asleep-on-the-bank
Why the jaguars let you watch | pantanal-jaguar-charging-through-the-shallows
The stork, concluded | pantanal-jabiru-stork-in-the-marsh
Chapada, and down | pantanal-chapada-dos-guimaraes-cliffs
What I would tell you | pantanal-nancy-and-sami-in-the-safari-boat
```

### Sort Sol: I Drove Across Denmark to Watch a Million Birds Go to Bed

Item `6aba3c84cd900e0a6152a28a`, slug `sort-sol-black-sun-denmark`, Live (not a draft). Gallery: 8 photos. Proposed: **6 inline, 2 in the end gallery.**

**Sections in body order**

1. **What Sort Sol actually is**: Explainer: starlings roost in the southern Jutland marshes; the famous shapes only form when a falcon attacks. They got arrivals, not shapes.
2. **Getting there, and the windows-down thing**: Windows down on the Fyn bridge, singing to cows at a charge stop, lunch at Café Stribo.
3. **Finding the birds**: Using a roost map, starlings on the wires, a false start at a marina near Aventoft, then following the tour buses to Grænsekro in Rudbøl.
4. **Every starling in Denmark clocks out at 6:45**: Thousands of people, hundreds of thousands of birds, a sequin glitter as the flocks drop into the reeds.
5. **Dinner in another country**: Schnitzel and salmon over the border in Germany.
6. **Car camping, with one complication**: A cheap, well-equipped pitch at Brændebro Camping, and Magnus taking the middle of the car.
7. **Sunday**: Coffee on the drive-on beach at Rømø, Men at Sea in Esbjerg, Nyborg, and Odense closed for its marathon.
8. **What I would tell you**: Short advice: guide, pitch, hold the location loosely, arrive by six, windows down.

**Photos in the gallery (gallery order)**

| # | Filename slug | CMS alt text |
|---|---|---|
| 1 | `sortsol-the-serenaded-cows` | A row of curious black and white cows standing in a bright green Danish field under a blue sky, facing the camera |
| 2 | `sortsol-starlings-on-the-wire` | Five starlings perched and squabbling on a power line against a clear blue sky |
| 3 | `sortsol-carved-sort-sol-sign` | A hand-carved wooden sign reading SORT SOL with two painted starlings and a sun, mounted on a white picket fence |
| 4 | `sortsol-fishermen-in-the-marsh` | Two fishermen standing in a small boat on the marsh water, reed beds in the foreground and wind turbines behind the treeline |
| 5 | `sortsol-sunset-through-the-willow` | A willow in silhouette against an amber sunset, with a wind turbine and a line of watchers blurred behind it |
| 6 | `sortsol-moonrise-over-the-reeds` | A full moon rising over autumn trees and reed beds, with green marsh grass and still water in the foreground |
| 7 | `sortsol-magnus-in-the-grass` | Magnus the Samoyed standing in long grass, eyes squeezed shut and tongue out, thoroughly pleased with himself |
| 8 | `sortsol-beach-and-lighthouse` | A wide Danish beach curving away under a blue sky with piled clouds, a white lighthouse tower at the far end |

**Proposed inline placements**

| Section heading | Photo (filename slug) | Alt text | Why it belongs |
|---|---|---|---|
| Getting there, and the windows-down thing | `sortsol-the-serenaded-cows` | A row of curious black and white cows standing in a bright green Danish field under a blue sky, facing the camera | The cows Magnus and Nancy sang to at the charge stop. |
| Finding the birds | `sortsol-starlings-on-the-wire` | Five starlings perched and squabbling on a power line against a clear blue sky | "Starlings on the power lines... that was the parking lot." |
| Finding the birds | `sortsol-carved-sort-sol-sign` | A hand-carved wooden sign reading SORT SOL with two painted starlings and a sun, mounted on a white picket fence | Arrival at the roost area. Placed here, not in "What Sort Sol actually is", because the story has not reached the marsh yet in that section. |
| Every starling in Denmark clocks out at 6:45 | `sortsol-sunset-through-the-willow` | A willow in silhouette against an amber sunset, with a wind turbine and a line of watchers blurred behind it | Sunset with the line of watchers: the moment before the birds come in. |
| Car camping, with one complication | `sortsol-magnus-in-the-grass` | Magnus the Samoyed standing in long grass, eyes squeezed shut and tongue out, thoroughly pleased with himself | Magnus, the complication. |
| Sunday | `sortsol-beach-and-lighthouse` | A wide Danish beach curving away under a blue sky with piled clouds, a white lighthouse tower at the far end | The Sunday beach morning (see uncertainty note on which beach). |

Sections with no inline photo: What Sort Sol actually is, Dinner in another country, What I would tell you.

**Stays in the end gallery (2)**: `sortsol-fishermen-in-the-marsh`, `sortsol-moonrise-over-the-reeds`

**Exact "Photo placement" value**

```
Getting there, and the windows-down thing | sortsol-the-serenaded-cows
Finding the birds | sortsol-starlings-on-the-wire
Finding the birds | sortsol-carved-sort-sol-sign
Every starling in Denmark clocks out at 6:45 | sortsol-sunset-through-the-willow
Car camping, with one complication | sortsol-magnus-in-the-grass
Sunday | sortsol-beach-and-lighthouse
```

### Northern Brazil: From Sequins to Sloths: Northern Brazil for the Chronically Curious

Item `6ab3fd224172c39c5a9bb87c`, slug `northern-brazil-sequins-to-sloths`, Live (not a draft). Gallery: 25 photos. Proposed: **7 inline, 18 in the end gallery.**

**Sections in body order**

1. **Salvador: the math does not work, and it happens anyway**: Carnaval in Salvador: 2.5 million people, camarotes above the crowd, Léo Santana, Ivete, Alok, and a pickpocket warning.
2. **Lençóis Maranhenses: the desert that fills up**: How rain pools between the dunes to make thousands of lagoons, swimming and walking the ridges, and when to go.
3. **Anavilhanas: six days of the jungle not caring about your inbox**: Six days on the Rio Negro: dolphins, hammocks, a swimming sloth, the food, and a wildlife roll call.
4. **What I would tell you**: Do it in this order, leave recovery time after Salvador, and awe is a state of mind.

**Photos in the gallery (gallery order)**

| # | Filename slug | CMS alt text |
|---|---|---|
| 1 | `brazil-salvador-coast-and-barra-lighthouse` | The Salvador coastline curving away under piled clouds, Barra lighthouse at one end and city high-rises at the other |
| 2 | `brazil-carnaval-surdo-drums-stacked` | A stack of red and white surdo drums waiting to go into the Carnaval parade |
| 3 | `brazil-carnaval-drummer-on-the-trio-eletrico` | A drummer in a white top and yellow skirt grinning down from the scaffolding of a trio eletrico |
| 4 | `brazil-carnaval-dancer-in-green` | A dancer in a green leaf headdress and costume smiling in the middle of the parade |
| 5 | `brazil-carnaval-baiana-in-white-and-yellow` | A baiana in a full white skirt and yellow wrap turning mid-step in the street |
| 6 | `brazil-carnaval-dancer-in-orange` | A man in an orange headwrap and printed costume dancing with one arm thrown in the air |
| 7 | `brazil-carnaval-two-men-dancing-in-the-street` | Two men in skirts and a jester hat dancing at each other in front of a painted Carnaval banner |
| 8 | `brazil-carnaval-two-women-laughing` | Two older women in matching Carnaval print, one leaning into the camera mid-laugh |
| 9 | `brazil-salvador-cotton-candy-seller` | A street seller in a red visor grinning under an enormous bundle of pink cotton candy |
| 10 | `brazil-lencois-maranhenses-dune-panorama` | A wide panorama of Lencois Maranhenses, green scrub giving way to white dunes running to the horizon |
| 11 | `brazil-lencois-maranhenses-lagoon-in-the-dunes` | A single swimmer standing arms-up in a lagoon held in a bowl of white dune sand under a heavy sky |
| 12 | `brazil-lencois-maranhenses-walking-the-dune-ridge` | A lone figure on a dune ridge with a line of footprints leading away across the sand |
| 13 | `brazil-maranhao-pousada-pool-and-palms` | A pousada pool ringed by palms and thatched roofs under a big cloudy sky in Maranhao |
| 14 | `brazil-anavilhanas-lodge-pool-over-the-rio-negro` | The lap pool at Anavilhanas Jungle Lodge running out toward the Rio Negro, loungers under the trees |
| 15 | `brazil-amazon-canopy-from-below` | Looking straight up a tall Amazon tree trunk into a tangle of canopy and palm fronds |
| 16 | `brazil-amazon-jungle-trail` | A man on a narrow jungle trail hemmed in on both sides by dense green undergrowth |
| 17 | `brazil-sloth-swimming-across-the-rio-negro` | A sloth swimming across the Rio Negro, head above the water, looking straight at the camera |
| 18 | `brazil-pink-river-dolphin-rio-negro` | A pink river dolphin breaking the surface of the Rio Negro in front of flooded forest |
| 19 | `brazil-gray-river-dolphin-rio-negro` | A gray river dolphin cutting a low wake across green-reflected river water |
| 20 | `brazil-amazon-green-parrots` | Two green parrots perched on the bare top branches of a seed-pod tree against a pale sky |
| 21 | `brazil-amazon-scarlet-macaw` | A scarlet macaw half hidden in green leaves, its red and blue wing showing through the branches |
| 22 | `brazil-amazon-tarantula-on-the-boardwalk` | A tarantula sitting out in the open on the wooden handrail of a jungle boardwalk |
| 23 | `brazil-amazon-caiman-at-dusk` | A caiman's head just above the surface of the river, the water lit orange and purple around it |
| 24 | `brazil-anavilhanas-grilled-fish` | A whole grilled river fish on a white platter ringed with lime and tomato slices |
| 25 | `brazil-rio-negro-fisherman-at-dusk` | A fisherman alone in a canoe on the wide Rio Negro at dusk, forest low on the far bank |

**Proposed inline placements**

| Section heading | Photo (filename slug) | Alt text | Why it belongs |
|---|---|---|---|
| Salvador: the math does not work, and it happens anyway | `brazil-carnaval-drummer-on-the-trio-eletrico` | A drummer in a white top and yellow skirt grinning down from the scaffolding of a trio eletrico | The trucks "the size of buildings": a drummer on the trio elétrico. |
| Salvador: the math does not work, and it happens anyway | `brazil-carnaval-baiana-in-white-and-yellow` | A baiana in a full white skirt and yellow wrap turning mid-step in the street | A baiana mid-turn, the most Salvador-specific street frame. |
| Lençóis Maranhenses: the desert that fills up | `brazil-lencois-maranhenses-lagoon-in-the-dunes` | A single swimmer standing arms-up in a lagoon held in a bowl of white dune sand under a heavy sky | A lagoon held in the dunes is the whole explainer in one image. |
| Lençóis Maranhenses: the desert that fills up | `brazil-lencois-maranhenses-walking-the-dune-ridge` | A lone figure on a dune ridge with a line of footprints leading away across the sand | "Walked barefoot over ridgelines." |
| Anavilhanas: six days of the jungle not caring about your inbox | `brazil-sloth-swimming-across-the-rio-negro` | A sloth swimming across the Rio Negro, head above the water, looking straight at the camera | The swimming sloth, the standout moment of the section. |
| Anavilhanas: six days of the jungle not caring about your inbox | `brazil-pink-river-dolphin-rio-negro` | A pink river dolphin breaking the surface of the Rio Negro in front of flooded forest | "We swam with pink and gray dolphins." |
| What I would tell you | `brazil-rio-negro-fisherman-at-dusk` | A fisherman alone in a canoe on the wide Rio Negro at dusk, forest low on the far bank | Closes on "a river that hums"; a quiet last frame after the parade. |

Sections with no inline photo: none.

**Stays in the end gallery (18)**: `brazil-salvador-coast-and-barra-lighthouse`, `brazil-carnaval-surdo-drums-stacked`, `brazil-carnaval-dancer-in-green`, `brazil-carnaval-dancer-in-orange`, `brazil-carnaval-two-men-dancing-in-the-street`, `brazil-carnaval-two-women-laughing`, `brazil-salvador-cotton-candy-seller`, `brazil-lencois-maranhenses-dune-panorama`, `brazil-maranhao-pousada-pool-and-palms`, `brazil-anavilhanas-lodge-pool-over-the-rio-negro`, `brazil-amazon-canopy-from-below`, `brazil-amazon-jungle-trail`, `brazil-gray-river-dolphin-rio-negro`, `brazil-amazon-green-parrots`, `brazil-amazon-scarlet-macaw`, `brazil-amazon-tarantula-on-the-boardwalk`, `brazil-amazon-caiman-at-dusk`, `brazil-anavilhanas-grilled-fish`

**Exact "Photo placement" value**

```
Salvador: the math does not work, and it happens anyway | brazil-carnaval-drummer-on-the-trio-eletrico
Salvador: the math does not work, and it happens anyway | brazil-carnaval-baiana-in-white-and-yellow
Lençóis Maranhenses: the desert that fills up | brazil-lencois-maranhenses-lagoon-in-the-dunes
Lençóis Maranhenses: the desert that fills up | brazil-lencois-maranhenses-walking-the-dune-ridge
Anavilhanas: six days of the jungle not caring about your inbox | brazil-sloth-swimming-across-the-rio-negro
Anavilhanas: six days of the jungle not caring about your inbox | brazil-pink-river-dolphin-rio-negro
What I would tell you | brazil-rio-negro-fisherman-at-dusk
```

## 4. Code-change list (draft, not applied)

Order matters: data and hidden elements first, then the code, then remove v1, then one combined publish after Nancy approves.

1. **Placement storage.**
   - Plan B (recommended): create collection "Photo placements" (singular "Photo placement", slug `photo-placements`) with fields Story (Reference to Stories), Photo placement (PlainText, multi-line, help text exactly: "One line per inline photo: Section heading | photo filename slug. Example: The crown jewel | tll-morocco-toubkal-summit-marker. Photos not listed stay in the end gallery."). Add 10 rows, Name = story slug, Photo placement = the values in section 3.
   - Plan A (only if the Stories cap allows): field "Photo placement", slug `photo-placement`, PlainText multi-line, same help text, then write the 10 values to the Stories items.
2. **Hidden placement element on the Stories Template** (`6a0b29eedc14f1444e935766`).
   - Plan B: hidden collection list of Photo placements (no filter, limit 100, display none, `aria-hidden="true"`); each item a div with `data-tll-placement-row`, attribute `data-story-slug` bound to Name, text bound to Photo placement.
   - Plan A: one div with `data-tll-photo-placement`, display none, text bound to Photo placement.
3. **Hidden alt list on the template.** Collection list bound to the current Story's Photo gallery, wrapper attribute `data-tll-photo-alts`, display none, `aria-hidden="true"`; each item an Image with alt from the field and `loading="lazy"`.
4. **v2 script behavior** (draft below):
   - Waits for "TLL story gallery v1" to finish (`data-tll-gallery-built="1"`), polling every 150 ms up to 40 times, as v1 does.
   - Reads the placement text (Plan A element first, then the Plan B row whose `data-story-slug` matches the page slug). One line per photo, `Section heading | filename-slug`; splits on the last `|`.
   - Finds the main story body the way v1 does (the `.tll-body` with the most direct `p` children, ignoring `#tll-quick-answers`) and matches the heading to a direct-child H2 of that body, trimmed, case-insensitive, whitespace collapsed, Unicode-normalized (so "Lençóis" matches), with curly quotes treated as straight.
   - Matches the filename slug to a gallery tile by its image URL (prefixes and extension stripped, case-insensitive).
   - Wraps the tile's existing link in `figure.tll-inline-photo` and inserts it at the end of that section, immediately before the next H2 (or at the end of the body for the last section). Several photos for one section keep their listed order.
   - Keeps v1's figure CSS and the link's lightbox `w-json`, then calls the Webflow lightbox `ready()` again so inline photos still open the lightbox and page through the whole set.
   - Never places by count. With no placement text, nothing moves and the gallery looks exactly like today.
   - Unmatched heading, unmatched slug, malformed line, or a slug listed twice: logs a console warning prefixed `[tll-photos]` and that photo stays in the end gallery.
   - Hides the end gallery only if no tiles are left in it.
   - Applies the real CMS alt from the hidden alt list to every tile (the alt fix), keeping the filename alt as a fallback.
   - No new motion, so nothing to gate for reduced motion. Focus states are unchanged (the links are the same elements v1 used).
5. **Where it lives.** The draft is about 3,900 characters, over the 2,000-character limit for an inline registered script, so it goes in the **Stories Template footer custom code**, directly after the "TLL story gallery v1" block. The footer is 30,088 characters today; adding about 3,900 should stay within the page custom code limit, but confirm the headroom in Page settings. Mirror it in the repo as `src/pages/story/inline-photos-v2.js`.
6. **Remove v1 from the page.** `remove_page_script` for `tllstoryinlinephotosv1` on the template. Keep it registered (it is also in the repo at `src/pages/story/inline-photos-v1.js`) so rollback is one `add_page_script`. Leave `tllauthorlinkv1`, `tllstoryperspv1` and `tllflagsv5` applied.
7. **Verify on staging before publish.** On each of the 10 stories: inline photos sit at the end of the right sections, the console shows no `[tll-photos]` warnings, the lightbox opens from inline and gallery tiles, the gallery hides only where empty, tile alts match the CMS, and the layout holds at 375 px.

### Draft v2 code (footer custom code, not applied, not yet browser-tested)

```html
<script>
/* TLL story inline photos v2 (DRAFT, not applied). Places gallery photos inline by an explicit
   "Section heading | filename-slug" list. Never places by count. Unlisted or unmatched photos stay in
   the end gallery; the gallery hides only when it ends up empty. Also fixes gallery alt text. */
(function(){
var CSS='.tll-inline-photo{margin:2.2em -4vw;padding:0}.tll-inline-photo a{display:block}.tll-inline-photo img{display:block;width:100%;height:auto;max-height:78vh;object-fit:cover;border-radius:0}@media(max-width:767px){.tll-inline-photo{margin:1.8em -16px}}';
function W(m){try{console.warn('[tll-photos] '+m);}catch(e){}}
function slugOf(u){var f=String(u||'').split('/').pop().split('?')[0];
  try{f=decodeURIComponent(f);}catch(e){}
  return f.replace(/\.(jpe?g|png|webp|avif|gif)$/i,'').replace(/^(?:[0-9a-f]{24}_)+/i,'').toLowerCase();}
function norm(t){t=String(t||'');if(t.normalize)t=t.normalize('NFC');
  return t.replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g,' ').trim().toLowerCase();}
function placementText(){
  var el=document.querySelector('[data-tll-photo-placement]');            /* Plan A: field bound on the template */
  if(el)return el.textContent||'';
  var page=location.pathname.replace(/\/+$/,'').split('/').pop();         /* Plan B: hidden list of all placement rows */
  var rows=document.querySelectorAll('[data-tll-placement-row]');
  for(var i=0;i<rows.length;i++){if((rows[i].getAttribute('data-story-slug')||'').trim()===page)return rows[i].textContent||'';}
  return '';}
function go(){
  var sec=document.querySelector('.tll-story-gallery');
  if(!sec||sec.getAttribute('data-tll-gallery-built')!=='1')return false;
  var links=[].slice.call(sec.querySelectorAll('a.tll-gallery-link'));
  /* alt fix: real CMS alt from the hidden list bound to photo-gallery */
  var alts={};[].forEach.call(document.querySelectorAll('[data-tll-photo-alts] img'),function(im){var a=im.getAttribute('alt');if(a)alts[slugOf(im.getAttribute('src'))]=a;});
  var bySlug={};links.forEach(function(a){var im=a.querySelector('img');if(!im)return;var s=slugOf(im.getAttribute('src'));bySlug[s]=a;
    if(alts[s]){im.alt=alts[s];a.setAttribute('aria-label','Open photo: '+alts[s]);}});
  var lines=placementText().split(/\r?\n/).map(function(l){return l.trim();}).filter(Boolean);
  if(!lines.length)return true;
  var bodies=[].slice.call(document.querySelectorAll('.tll-body')).filter(function(b){return b.id!=='tll-quick-answers';});
  var body=bodies.sort(function(a,b){return b.querySelectorAll(':scope > p').length-a.querySelectorAll(':scope > p').length;})[0];
  if(!body){W('no story body found');return true;}
  var h2s=[].slice.call(body.querySelectorAll(':scope > h2'));var byHead={};h2s.forEach(function(h,i){byHead[norm(h.textContent)]=i;});
  var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  lines.forEach(function(line){
    var k=line.lastIndexOf('|');if(k<0){W('skipped line without "|": '+line);return;}
    var head=norm(line.slice(0,k)),slug=line.slice(k+1).trim().toLowerCase();
    var i=byHead[head];if(i===undefined){W('no H2 matches "'+line.slice(0,k).trim()+'"; '+slug+' stays in the gallery');return;}
    var a=bySlug[slug];if(!a){W('no gallery photo "'+slug+'"');return;}
    if(!sec.contains(a)){W('"'+slug+'" listed twice; first use kept');return;}
    var fig=document.createElement('figure');fig.className='tll-inline-photo';fig.appendChild(a);
    var next=h2s[i+1];if(next)body.insertBefore(fig,next);else body.appendChild(fig);});
  if(!sec.querySelector('a.tll-gallery-link'))sec.style.display='none';
  try{var lb=window.Webflow&&window.Webflow.require&&window.Webflow.require('lightbox');if(lb&&lb.ready)lb.ready();}catch(e){}
  return true;}
var n=0;(function tick(){if(go())return;if(++n>40){W('gallery never finished building; nothing placed');return;}setTimeout(tick,150);})();
})();
</script>
```

## 5. Uncertain or worth a second look

- **Field cap** is inferred from the counts (60 custom plus Name and Slug). Confirm in the Designer before choosing Plan B over Plan A.
- **Lightbox payload** could not be inspected live (site blocked from this container). The alt plan does not depend on it.
- **Multi-image alt binding** on a nested collection list may need to be set by hand in the Designer rather than through the Data API.
- **Sort Sol, beach and lighthouse:** placed in "Sunday" because the text has them on the Rømø beach that morning; the photo could be a different stretch of the west coast. It stays in Sunday either way, since that is the only beach section.
- **Sort Sol, carved sign:** location not stated; placed in "Finding the birds" at the marsh arrival.
- **Paraguay, Triple Frontier neon sign:** likely on the Brazilian side; placed in the section that introduces the Triple Frontier, which the story is already looking at.
- **Morocco:** the Marrakech souk and palace photos could be from the first afternoon or the last spin through the markets; they are placed at the first afternoon, which the text describes in detail. The park-sign group photo is placed in "The elder stateswoman", which ends with meeting the guides at Imlil.
- **Kilimanjaro:** the Uhuru Peak sign photo stays in the gallery on purpose, because the text says the sign is not the story; swap it in for `tll-kili-kibo-at-night` if Nancy prefers the team on top.
- **La Tomatina** was re-read after the staged change: `tll-tomatina-three-after` is the hero and no longer in the gallery, and `tll-tomatina-hero-bow-of-the-boat` is placed in "Glamorous, then brave". Note the staged item shows lastUpdated after lastPublished, so it has unpublished changes.
- The v2 draft passed a syntax check but has not run in a browser.
