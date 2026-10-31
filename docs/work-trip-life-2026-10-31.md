# That Work Trip Life: change log and note for Nancy (31 Oct 2026)

Cost so far: $0. Nothing was bought, no accounts made.

## What is live, what is staged

| Piece | State |
|---|---|
| Work-trip switch in Add a Stamp (/edit-profile) | Staged. See it with `?preview=worktrips` (remembered; `?preview=off` clears) |
| The hub on /pursuits/work-trips | Staged, and the Work trips Pursuit item is still a draft, so the page itself is not up yet |
| Series labels (black washi tape) on story cards, story pages, /stories chips | Live code, but nothing shows until a story is tagged The Free Evening or Plus One Day |
| Trip Kit on story pages | Live code, shows only when the Story extras Trip Kit field is filled |
| Worker routes /work-trips, /work-trips/story, stamp rules, road warrior fields | Written and tested, not deployed until you run `npx wrangler deploy` |

## The rules, and where they live in code

1. **No names without permission.** A work-trip stamp reads "A work trip" on profiles, the album, and the hub wall unless the member ticked "I have permission to name them". Photo alt text follows the same rule. A road warrior's employer shows only when "Permission to name employer" is on in Pros. (src/stamps.js, src/work-trips.js, src/pros.js)
2. **Post after, not during.** A stamp with a month later than this month is refused with "Back home? Good. Now tell us." The wall shows the year only. No live location status anywhere.
3. The word you asked us not to use appears nowhere. The series is "Plus One Day", the line is "the work trip, plus one day".
4. **No points, miles or cards.** A Trip Kit line whose label or link mentions cards, points, miles, rewards or a card bank is dropped. Three links at most; each is labeled reklamelink and carries rel="sponsored noopener noreferrer".
5. **Safety notes.** The story shows the Safety note field only if the writer filled it in. Nothing is written by AI or by us. The field's help text says safety content for women is written or reviewed by women who took the trip.

## CMS changes (all additive, nothing deleted)

- Themes: draft items The Free Evening (6ae6260ef105094f5b385371) and Plus One Day (6ae6260ef105094f5b385373).
- Pursuits: draft item Work trips (6ae626107af10f89e641f40c), display name That Work Trip Life.
- Pursuit stamps: Switch fields work-trip and permission-to-name.
- Story extras: free-evening-time, free-evening-starting-point, free-evening-stops, safety-note, plus-one-day-extra-days, plus-one-day-who-paid-for-what, plus-one-day-best-decision, plus-one-day-worst-decision, trip-kit.
- Pros: track (Pursuit expert, Road warrior), employer, permission-to-name-employer.

## How a story joins a series

1. Tag the story with the theme The Free Evening or Plus One Day (publish the theme item the first time).
2. Fill its Story extras item: for The Free Evening the time, starting point and three to five stops (`Stop | 10 min walk`); for Plus One Day the extra days, who paid for what, best and worst decision. All in the writer's words.
3. Optional: Trip Kit lines (`Travel eSIM | https://...`), eSIM, lounge or insurance only.

The card label then reads "The Free Evening · Copenhagen" (city, or country when no city). Stories keep Article schema only; nothing new was added.

## The map

When a member adds a work-trip stamp, the country goes on their map as BEEN for them, only if it is not there yet. Nothing is downgraded or removed. The stamp also counts on the Work trips badge, even when it sits under another pursuit (a marathon run on a work trip).

## LinkedIn (Phase E)

- Share button: a plain link, no SDK: `https://www.linkedin.com/sharing/share-offsite/?url=<page>`.
  - Hub: `https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.thatlayover.life%2Fpursuits%2Fwork-trips`
  - A series story: the same with the story URL. The button shows on every series story.
- Open Graph image (1200x627 with the washi label): LinkedIn does not run page scripts, so the image must sit in the story's OG image field. Cheapest path: one Canva template, 1200x627, the hero photo with the black tape label in the top left, exported per series story and dropped into OG image. I can set the field for you once you say yes, since it changes live stories.
- Work Trip Wrapped card (draft, not built): one square card per member, made from their shown work-trip stamps only. Lines: "Work Trip Wrapped [year]", then countries and cities counted from the stamps (never typed), then "The best free evening: [their story title, if any]". Employer never shown. Your call whether to build it.

## Ads (Phase F)

- Division "tll" on every hub and series click (gtag, the revenue_click event for Trip Kit).
- AdSense stays off the hub: /pursuits is not on the ad list. The Trip Kit is the only paid slot, labeled reklamelink.

## Not possible yet

- **Conference Cities (Phase C).** Webflow allows 40 collections and the site is at 40. To make room, one empty collection would have to go: Bookmarks, Comments or Trip Bundles, all empty. Say which and I will build the template with an empty Copenhagen draft and the sponsor slot ("Reklame for [Sponsor]", rel="sponsored noopener noreferrer").
- **/work-trips as a URL.** The hub lives at /pursuits/work-trips. A 301 from /work-trips needs one line in Webflow Site settings, Publishing, 301 redirects: `/work-trips` to `/pursuits/work-trips`.
- **Month on the stamps wall.** The site promises "Stamps show years only", so the wall shows the year. Keep the promise or change it; your call.

## Questions for Nancy

1. Is "That Work Trip Life" the hub name?
2. A LinkedIn newsletter name for The Free Evening?
3. The next three Conference Cities after Copenhagen?
4. Can a work-trip stamp be private while the rest of the pursuit shows? Today the switch is per pursuit.
5. Which empty collection can go to free a slot for Conference Cities?
6. Approve or rewrite the hub intro draft (shown in the preview, marked as a draft).
7. When should the Work trips Pursuit item be published? The hub stays noindex until it meets the index rule (6 stories, 3 writers, an intro).

## Nancy's answers (31 Oct, evening) and what changed

1. **Hub name:** That Work Trip Life, confirmed.
2. **LinkedIn newsletter name:** The Free Evening.
3. **Next Conference Cities, by business traffic:** Lisbon, Paris, Barcelona. These are the top three cities in ICCA's 2025 ranking of international association meetings: Lisbon 188, Paris 174, Barcelona 166. Copenhagen is 7th with 131. ICCA counts association congresses, not company events. Sources: [Skift Meetings, 21 May 2026](https://meetings.skift.com/2026/05/21/lisbon-tops-iccas-association-meeting-rankings/), [Hosteltur](https://www.hosteltur.com/176337_el-ranking-icca-da-un-vuelco-lisboa-desbanca-a-viena-y-barcelona-sube-al-podio.html). The Conference Cities template still waits on a free CMS slot.
4. **A single work-trip stamp can be private:**
   - **Built:** a new Private switch on Pursuit stamps, a "Keep this one private" box on each work-trip stamp in /edit-profile (staged with the work-trip preview), and `POST /stamps/private`.
   - **How it behaves:** a private stamp never shows on the profile, album or hub wall, even when its pursuit is shown. It still counts on the member's own map and export.
