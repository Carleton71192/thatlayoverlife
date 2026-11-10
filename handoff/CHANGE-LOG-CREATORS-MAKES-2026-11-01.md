# Change log: MAKES on the /creators cards (1 November 2026)

Source: Nancy, 1 November: "Add MAKES to the /creators cards". Built on the subdomain under the usability session lock; www on your word.

## What was in the way
The /creators cards (page 6abd0c6f30f767558eb3782b) did not read your members' profiles. The page's hidden list pointed at the Directory collection, a hand-filled list from 30 September with one item (you, with Make things off) and no Makes field. The sync that was meant to fill it from member accounts was never built (STATUS C02, C18). So /creators showed nobody, and MAKES had nowhere to land.

## Changes (numbered for your reply)
| # | Change |
|---|---|
| K1 | **The /creators cards come from the profiles.** The page's hidden list now reads the Contributors collection, filtered to Make things on and Visibility Public, the same source and visibility rule as /travelers. Each card carries the member's own profile: credited name (full, first or pen, as they chose), photo, one line, links, contact mode, makes, partners. The Directory collection is untouched; /expats and /press still read it. |
| K2 | **MAKES on every card.** Under the one line: "MAKES PHOTOS · VIDEO · WORDS", the same words as the profile page. A member with Make things on and nothing picked yet shows no MAKES line. |
| K3 | **The chip row filters by what they make.** The row under the search box (it read "TAGS (PROVISIONAL)" with no chips) now reads WHAT THEY MAKE with one chip per kind present: Photos, Video, Words, Sound (Other stays on the card line and gets no chip). One tap narrows the grid; the search box also matches makes. |
| K4 | **OPEN TO PARTNERSHIPS on the card.** The amber chip that used to show a typed "monetization" word now shows when the member switched on "Open to sponsored stories and partnerships" (N9). |
| K5 | **Links and contact from the profile.** Up to four of the links the member switched on, in the profile's order (Instagram, YouTube, Website, TikTok, Substack, Strava, AllTrails, Komoot, Garmin, Beli). "Contact open" shows only for members whose contact mode is Instagram, and opens their Instagram. Every other mode has no button on the card: the relay form left the site on 31 October (Phase 0), and an email address is never put on a card. The Contact open filter narrows to the Instagram ones. |
| K6 | **The sample card in your words.** When fewer than three creators are listed, the sample card reads "You make travel things? Switch on Make things in your profile and say what you make." (it said "I'm a creator", a switch that no longer exists). It no longer appears under a search or a chip, and the count line reads "2 OF 8 CREATORS · SHUFFLED" while the grid is narrowed, so a number never reads as the size of the list. |
| K7 | **What the card does not carry.** Home base, flags and languages are not on the card and cannot be searched here: the profile page shows home base only when the member switches it on and never shows languages. "Report this profile" names the profile by its address (/contributors/{slug}), not by the credited name, so two members shown as "Sam" cannot be mixed up. |

## What stays the same
Shuffled on every load, never ranked, "N CREATORS ON THE MAP · SHUFFLED" with "No rankings. No counts that rank people.", "Report this profile" on every card, the Contact open filter, the hero and the page's other sections, the page CSS. Nothing in the Directory collection changed.

## Notes for you
- Four lines of Designer text on the page are out of date now. Say "Change them" and they go in with the www publish:
  - The hero: "Every card says how the creator earns, so nobody is surprised later." Cards say what they make, and OPEN TO PARTNERSHIPS when set. Proposed: "Bloggers, photographers, video makers and podcasters. Every card says what they make, and who is open to partnerships."
  - The dark section under the grid: "Switch on "I'm a creator"." with "Your channels, your disclosure, your card. Nothing shows until you switch it on, and it disappears everywhere the moment you switch it off." Proposed: "Switch on Make things." with "Your links, your card, your say on what you make. Nothing shows until you switch it on, and it disappears everywhere the moment you switch it off."
  - The search box placeholder: "Search a region, a format or a tag". Proposed: "Search a name, a line or what they make".
  - The list's empty state (shown only when nobody is listed): "Nobody has switched on "I'm a creator" yet. The first ones get seen the most." Proposed: "Nobody has switched on Make things yet. The first ones get seen the most."
- Known and accepted, as on the profile page: the page source carries each listed member's real name and every link they filled, hidden ones included; the card shows only the credited name and the links switched on. A member credited by a pen name may still have a profile address made from their real name, since Webflow makes the address from the name. Both are true of the profile page already; /creators lists them in one place.
- A member who ticked only Other reads "MAKES OTHER THINGS" here and "MAKES OTHER" on their profile; the profile wording is a one-word follow-up.
- The site code marks /creators noindex "until it has content" (site layers, tll-site-layers-v16). It has content now. A one-line change in the site layers would lift that; your call.
- /for-brands has no member cards, so nothing changed there.

## Built on the subdomain, 1 November 2026
K1 to K7 are on https://that-layover-life.webflow.io/creators (publish e47c1450, about 08:36 UTC). Not on www; that waits for your look and your word. The one member with Make things on shows "MAKES PHOTOS · VIDEO · WORDS" with an IG link and no contact button (contact mode Email). Files and element ids: src/pages/creators/live-2026-11-01/README.md. Before the write, a review with four lenses confirmed 22 findings, including one that would have sent visitors to the relay form removed on 31 October; all are fixed in what was written.

## Live on www, 3 November 2026
The Webflow build session published the whole site to www, the apex and the subdomain on your word ("Publish www", task 9574c01c, about 11:35 UTC). That publish carried K1 to K7 with its own Ahrefs changes, and it checked the /creators footer script on www. The four Designer-text lines above were not changed.

## Off the site since 9 November 2026
For the AdSense "Low value content" review, /creators was set to draft (docs/adsense-low-value-audit-2026-11-08.md: "Draft until three real creator cards exist") and taken off www with the publish of 9 November (task a1c61ad5, "Publish. Keep going."). /creators is now a 301 to /travelers, and site layers 16.51.0 hide the footer link, the /travelers Creators pill and the /edit-profile creators link.

What stays in Webflow: the draft page keeps the list bound to Contributors, the card bindings and the footer script tll-dir-js-v2, so K1 to K7 come back as they were. Bringing the page back takes four steps:
- Set /creators back to published in Webflow.
- Remove the /creators 301 in Site settings, Publishing.
- Drop /creators from tll-drafted-v1 and from the forwards in tll-phase0-v1 in the site layers.
- Lift the old noindex on /creators in the site layers, then publish.

The four Designer-text lines above are worth changing at the same time.
