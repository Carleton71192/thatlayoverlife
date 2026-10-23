# Where Nancy's personal data shows up as site content (audit, 23 Oct 2026)

Nancy, 22 Oct: "my personal stats do not need to appear all over the site." A sample show profile is welcome.
Method: Webflow API reads (site code, page text). The live domains are blocked from the cloud sandbox, so nothing here was checked in a browser.

Legend: (a) fine, a byline or founder credit on her own work. (b) her stats or life used as generic site content.

| Page | Where | What shows | Kind | Suggested fix |
| --- | --- | --- | --- | --- |
| /spotlight | Site head script, spotlight() | Hard-coded "TRAVELER OF THE WEEK" card: Nancy Carleton, THE FOUNDER · EXPAT · LIFER · COPENHAGEN, Magnus line, links to /contributors/nancy-carleton | (b) | Drive it from Contributors "Is featured" instead of hard code; until someone else is featured, show the sample profile |
| / (Home) | Map section beb831d5-0273-2ff1-9c40-a7e05a6553f9 (hidden in Designer) | "Choose a layer to explore the editor's travels..." | (b), but the block is hidden | Leave hidden, or delete the line when the section is next touched |
| / (Home) | Pet card 77240a57-...5bf, ...5c3, 19f94072-... | "Magnus Waffles", "13 countries · 0 complaints", "Samoyed · 3 yrs · Copenhagen, DK" | (b) | Feature card for Paw Passport; swap to a sample pet or rotate featured pets |
| / (Home) | 87c10def-..., a162e640-..., 77240a57-...5fb/5fd | Paw Passport copy naming Magnus | (a/b) | Copy, not stats. Keep or soften, Nancy's call |
| / (Home) | 765b2cb2-... | "All frames currently by Nancy. Yours changes that." | (a) | Fine |
| / (Home) | 77240a57-...601, ch01 story rail embed | "Nancy Carleton" bylines on her own stories | (a) | Fine |
| / (Home) | ch06 First 100 embed | Founding 01 Nancy Carleton, "Founder · Copenhagen · abroad since 2018" | (a) | Fine (roster) |
| Site-wide | Site footer founderAvatar() | Swaps the pink placeholder avatar for Nancy's photo, alt "Nancy Carleton, founder" | (a) | Fine |

| /the-map | Element c84d785f-...793c (#tll-map-canvas), attribute data-visited | A typed list of 84 country codes: Nancy's countries as of the 7 Oct seed, New Caledonia (540) included. Every visitor sees this list painted Rose, with "Rose is where we have been" | (b), the main one | Signed-out visitors get an empty map and "Sign in to paint your own", or a clearly labeled SAMPLE map. Signed-in members already see their own saved map |
| /the-map | Text 01f53496-..., c84d785f-...794d | "Rose is where we have been", "The countries on the map painted Rose. The trips that actually happened." | (b) | Reword with the fix above |
| /the-map | bba1ef04-... | "Magnus was here" layer label | (a/b) | Keep if the pet layer stays a feature demo |
| /about | 94dc06dc-... | "Started this with one passport, 87 countries and a Samoyed..." | (a) founder bio, but a typed count (breaks the counts rule, and is out of date) | Drop the number: the count lives on her profile |
| /about | 80dc3fa6-... | "Samoyed. Chief supervisor. 13 countries, 0 complaints." | (a) Magnus bio, typed count | Drop the number, or point to his Paw Passport |
| /about | 714a8d43-... | "My country count is on my traveler profile." | (a) | Fine, the model to follow |
| / (Home) | 77240a57-...5c3 | "13 countries · 0 complaints" on the Magnus card | (b) typed count | Same as the About fix |
| /for-press | page text | No count, no Nancy, no Magnus | none | Nothing to do |

Not checked: /travelers, /expats, /the-paw-passport, /pets, the share card preview, /copenhagen-stopover (a story-style page about her own trip, likely fine).

## Recommendation

1. /the-map is the one that matters: replace the typed data-visited list. Option A (recommended): signed-out visitors see a blank map with "Sign in to paint your own" and the story pins. Option B: a SAMPLE map from a labeled demo profile. Option A keeps the charter's honesty rule with no invented traveler; B needs every sample number labeled SAMPLE.
2. /spotlight: read the Traveler of the Week from Contributors "Is featured" instead of hard code.
3. Remove the typed counts on /about and the Home Magnus card.
Nothing above has been changed yet. Each needs Nancy's go because it changes visible copy.
