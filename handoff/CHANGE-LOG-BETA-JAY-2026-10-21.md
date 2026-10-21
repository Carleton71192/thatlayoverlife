# Change log: Jay's beta notes (21 October 2026, 05:34 to 05:58). Approved by Nancy 21 Oct ("Approve of changes") with one change to B6: Antarctica shows as "countries + AQ". Built in the repo, see handoff/packet-d/ROW-beta-jay.md.

Six notes from Jay's WhatsApp screenshots, each checked against the live code copies in the repo, the CMS item and his Memberstack record. Nothing below is built. The lock holder applies B1 to B4 in Webflow; B5 and B6 wait for Nancy's word.

## B1 Story hero reads "1 MIN MIN" (bug)

Cause: the unit is added twice. The hero style (src/pages/story/v3/style-st3-story-v1.html line 17) appends " min" with CSS, and the story embed 3074c26c added on 20 October (S114, "read time without a unit") has a `mins()` function that rewrites the same element from "1" to "1 min". The CMS value is the number 1, which is right.

Fix: remove `mins()` and its call from the story embed 3074c26c (src/pages/story/after-2026-10-20/embed-3074c26c-after.html line 47 and the run() line). The CSS already prints "1 MIN" in the hero and "1 min read" in the meta row. No CMS change.

## B2 The escalator photo (not a bug in the page, the photo is not in the CMS)

Checked: the story item has no gallery (photo-gallery empty, photo-originals empty) and no Photo placements row. Rows S72 and S82 record why: the old /submit form on 19 October did not deliver files, so the item arrived with no photos at all, and the one hero (IMG_3319, Magnus in the Clark Kent glasses) is the photo Nancy sent by hand. The escalator photo never reached the site.

Fix: Jay sends the escalator photo again; it goes into the story's gallery (Photo gallery field) and the item is republished on its own. Once the story edit build is live he can add it himself from Edit this story.

## B3 Log a place on /edit-profile saves one continent at a time (bug, and the block should go)

Cause: the "Log a place to your Trip Ledger" block is injected by the site-wide footer script (src/site/site-footer-2026-10-20-before.html, `ledger()`, lines 194 to 206) on /edit-profile. It saves with `updateMember({metaData})`, and the Memberstack DOM package does not persist metaData from the browser: Jay's record has `metaData: {}` after his adds, so every add starts again from an empty list and the message says "1 place". The list under it shows only the last pick because that is the whole saved list.

This block also breaks the count rules (handoff/claude-design-source/COUNT-RULES.md): rule 1, the map is the only place a member logs places, and rule 8, "ledger" is a banned word. Packet C gave /edit-profile its redesign on 20 October; this block is a leftover from before it, added back by the site footer on every load.

Fix: remove `ledger()` from the site footer script (the function and its two calls). Places, continents and regions are logged on /the-map, which already counts continents from the map. No field or record is deleted.

## B4 "Middle East instead of North and South America" (dissolves with B3)

The list Jay saw (Africa, Americas, Antarctica, Asia, Europe, Middle East, Oceania) is the Stories collection's Region option, the editorial filter for the stories feed, not a continent list. The block in B3 labeled it CONTINENT. With B3 gone, members never pick a continent by hand: continents come from the map. The stories feed keeps its Region filter as it is, and the Middle East stays a region there because readers browse that way.

## B5 Made-up languages (Nancy, 21 Oct: "World languages please": option 1 approved, built in the repo)

Today the Languages field on /edit-profile takes any text, Enter adds a chip, up to ten (Jay's record now carries "Nonsense"). Nancy decides:

1. Pick from a list (recommended): a datalist of the world's languages (ISO 639-1 names, about 180), Enter accepts only a name on the list, the chips stay as they are. Keeps /travelers filters and future language pages clean. Existing entries not on the list are shown with a small "not on the list" note until changed.
2. Keep free text, as now.

Same question for the Strava link: Jay's record holds an email address in strava-url. Recommended: accept only a strava.com address or a bare username, same as the Instagram rule.

## B6 "58 vs 57 countries" (one label is wrong, the numbers are right)

Checked against Jay's saved map: 64 places with a state, 6 of them Layover only, so 58 places with Lived or Stayed, Antarctica among them. By the count rules that is Places 58 of 249 and Countries 57, which is exactly what the two numbers show. The card that reads "58 / 249 COUNTRIES VISITED" breaks rule 8 ("say places for anything out of 249"); the layers chip "Countries 57" follows the Countries rule.

Fix: the label under "58 / 249" reads "PLACES LOGGED" (recommended) or "PLACES", with "+ Antarctica" shown beside the Countries number where it is not already. Designer text change on the element that carries that label; the number itself keeps binding to the map.

## Copy

| Where | Copy |
|---|---|
| Map counter label | PLACES LOGGED |
| Languages, entry not on the list | Not on the list. Pick a language or remove this one. |
| Strava field hint | Your Strava address or username. |

Reply with the line numbers to approve or change. B1, B3 and B4 are removals of code already in the repo; B2 needs the photo from Jay; B5 and B6 are yours.
