# Where Nancy's personal data shows up as site content (audit, 23 Oct 2026, in progress)

Nancy, 22 Oct: "my personal stats do not need to appear all over the site." A sample show profile is welcome.
Method: Webflow API reads (site code, page text). The live domains are blocked from the cloud sandbox, so nothing here was checked in a browser.

Legend: (a) fine, a byline or founder credit on her own work. (b) her stats or life used as generic site content.

| Page | Where | What shows | Kind | Suggested fix |
| --- | --- | --- | --- | --- |
| /spotlight | Site head script, spotlight() | Hard-coded "TRAVELER OF THE WEEK" card: Nancy Carleton, THE FOUNDER · EXPAT · LIFER · COPENHAGEN, Magnus line, links to /contributors/nancy-carleton | (b) | Drive it from Contributors "Is featured" instead of hard code; until someone else is featured, show the sample profile |
| / (Home) | Map section text 4dd8dfd1-f3cd-d8e9-cd19-bed01b68a63b | "Choose a layer to explore the editor's travels, from countries and cities to marathon finish lines." The home map is Nancy's map | (b) | Swap to the sample profile's map, or an "everyone's map" layer |
| / (Home) | Pet card 77240a57-...5bf, ...5c3, 19f94072-... | "Magnus Waffles", "13 countries · 0 complaints", "Samoyed · 3 yrs · Copenhagen, DK" | (b) | Feature card for Paw Passport; swap to a sample pet or rotate featured pets |
| / (Home) | 87c10def-..., a162e640-..., 77240a57-...5fb/5fd | Paw Passport copy naming Magnus | (a/b) | Copy, not stats. Keep or soften, Nancy's call |
| / (Home) | 765b2cb2-... | "All frames currently by Nancy. Yours changes that." | (a) | Fine |
| / (Home) | 77240a57-...601, ch01 story rail embed | "Nancy Carleton" bylines on her own stories | (a) | Fine |
| / (Home) | ch06 First 100 embed | Founding 01 Nancy Carleton, "Founder · Copenhagen · abroad since 2018" | (a) | Fine (roster) |
| Site-wide | Site footer founderAvatar() | Swaps the pink placeholder avatar for Nancy's photo, alt "Nancy Carleton, founder" | (a) | Fine |

Not checked yet: /about, /the-map signed out, /travelers, /for-press, /expats, /the-paw-passport, /pets, share card preview, /copenhagen-stopover.
