# CMS schemas and sample items

Captured 2026-10-13 from the That Layover Life Webflow site (read-only API calls). One JSON file per collection, named by collection slug. Each file holds the collection id, display name, singular name, the field list (id, slug, display name, type, required) and up to three sample items with their field data.

Counts on the live site may differ. The "on site" column is the total the API reported at capture time; the bundle keeps at most three items per collection and only items that are published (not draft, not archived).

| Collection | Slug | Items in bundle | Items on site | Fields |
|---|---|---:|---:|---:|
| Pillars | `pillars.json` | 3 | 5 | 5 |
| Destinations | `destinations.json` | 3 | 198 | 16 |
| Contributors | `contributors.json` | 1 | 8 | 56 |
| Layovers | `layovers.json` | 2 | 7 | 20 |
| Marathons | `marathon-diaries.json` | 2 | 5 | 15 |
| Magnus Diary | `paw-passport.json` | 3 | 6 | 12 |
| Stories | `stories.json` | 3 | 65 | 62 |
| Press Mentions | `press-mentions.json` | 0 | 0 | 7 |
| Partners | `partners.json` | 0 | 0 | 6 |
| Collections | `collections.json` | 3 | 5 | 7 |
| Pets | `pets.json` | 1 | 1 | 33 |
| Themes | `themes.json` | 3 | 5 | 4 |
| Visits | `visits.json` | 0 | 0 | 12 |
| Bookmarks | `bookmarks.json` | 0 | 0 | 6 |
| Comments | `comments.json` | 0 | 0 | 9 |
| States | `states.json` | 0 | 56 | 7 |
| National Parks | `national-parks.json` | 0 | 63 | 8 |
| Subdivisions | `subdivisions.json` | 0 | 100 | 8 |
| Countries | `countries.json` | 3 | 197 | 54 |
| Submissions | `submissions.json` | 0 | 0 | 11 |
| Award Nominations | `award-nominations.json` | 0 | 0 | 9 |
| Resources | `resources.json` | 3 | 4 | 11 |
| Expat Groups | `expat-groups.json` | 0 | 0 | 10 |
| Interest Tags | `interest-tags.json` | 3 | 26 | 5 |
| Directory | `directory.json` | 1 | 1 | 29 |
| Press Trips | `press-trips.json` | 0 | 0 | 11 |
| Pet Notes | `pet-notes.json` | 0 | 0 | 7 |
| Trip Bundles | `trip-bundles.json` | 0 | 0 | 5 |
| Photo placements | `photo-placements.json` | 3 | 10 | 4 |

## How the samples were chosen

- Each collection was asked for its three most recently published items. Draft and archived items were dropped, so some collections show fewer than three.
- Stories: the ten most recently published stories were fetched, and the three most recent that carry a hero image were kept.
- Submissions, Comments, Bookmarks, Visits and Directory may hold personal data. Only the first item is kept, and any field whose slug or name contains email, phone, whatsapp, address, ip, password or token is written as `[withheld]`.
- The same withholding rule was applied to every collection, plus four private identifiers that the site never renders: `member-id`, `memberstack-id`, `microchip-number` and `eu-pet-passport-number`.
- Option fields hold the option id, not the label. Reference fields hold the referenced item id. Look up labels in the collection's schema fields in the Webflow Designer.

Fields blanked in this capture:

- contributors: blanked memberstack-id on item 6a0be79e01ee7eff10102ce9
- directory: blanked member-id on item 6abcd6c0e03ef5f1ffae94bb

## Tasks still to be completed

Open items on the site task list at export time, for whoever picks this bundle up:

- Own success and error messages on every form (in progress).
- Edit-profile, share-story and my-pets pages: prototype design.
- Live contributor and country counts.
- Story form feeds the author's map and trip history.
- Second-pass batch: expats finder, collections, link stack, travelers.
- Audit: safe fixes drafted, awaiting publish approval.
- Handoff job one: parity audit (home, stories, story, travelers, countries first) (in progress).
- Handoff job two: traveler directory (expats, creators, press).
- Growth build stage 1: design artboards (home, /submit, story end, /expats Denmark, badges).

CMS specific follow-ups:

- 11 collections had no items at capture time (Press Mentions, Partners, Visits, Bookmarks, Comments, Submissions, Award Nominations, Expat Groups, Press Trips, Pet Notes, Trip Bundles). Their JSON files carry the schema only. Sample content for the design will need to be written or pulled later.
- States, National Parks, Subdivisions: every item returned was still a draft, so no samples were kept. Publish or confirm these before the design relies on them.
- Collections that kept fewer than three items had draft items among the three most recent. Fetch more if the design needs three samples.
- Option and reference ids in the samples are not resolved to labels. Resolve them if the design needs the readable values.
