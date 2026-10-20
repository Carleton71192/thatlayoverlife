# That Layover Life: how counting works (19 October 2026)

For Claude Design. These are the rules the live site uses today, plus the decisions still open. Every number on the site must follow them. A design may change how a number looks, never how it is counted.

## 1. One source, never typed
- Each member's map is the only source. It is saved on their account and only the map editor (/the-map) writes to it.
- No count is ever typed into a page, a CMS field or a design. Pages read the map and count.
- If a screen needs a number the map cannot give, the screen shows nothing rather than a guess.

## 2. What the map stores
- A list of travelers on the account: the member ("Me"), other people they add, and pets (marked as pets).
- For each place and each traveler, one state:
  - **Lived**
  - **Stayed** (stored as "visited")
  - **Layover only**
  - nothing (not yet)
- Places are keyed by their ISO 3166 numeric code. Kosovo uses 900 (it has no ISO code). Older records that saved Kosovo as "undefined" are read as 900. Northern Cyprus is 901 and Somaliland is 902 if they ever appear.

## 3. The place list
- The passport and the map editor list every country and territory: ISO 3166-1 plus Kosovo, 250 entries in all, Antarctica included.
- Counters show "n / 249" and the percent of 249. **Open:** the list has 250 entries while the counter divides by 249. Decide between "of 250" and leaving one entry out of the denominator.

## 4. The numbers and their rules

| Number | Rule | Where it shows |
|---|---|---|
| **Places** | Every place where any person on the account has Lived or Stayed. Antarctica counts. Layover-only places do not. Pets do not count toward the member's number. | Map counter "n / 249", percent, "n of 249 logged", passport, home Chapter 03, the "of 249" badge on /account |
| **Countries** | The same set without Antarctica. When Antarctica is ticked, the number is followed by "+ Antarctica". | /account LOGGED, Layover Wrapped "Countries logged", the owner's view of their public profile |
| **Layovers** | Places where the only state is Layover. Counted on their own, never added to the totals above. | Map legend, /account |
| **Continents** | Continents of the counted places. Antarctica counts as a continent. | /account, profile |
| **Pet stamps** | Places where the pet has any state. Each pet has its own count, separate from the member's. | Paw Passport, /account pet card ("N countries plus Antarctica" when ticked) |
| **Stories by country (site-wide)** | Every country named in a live story. This is story coverage, not anyone's travel count, and must be labeled that way. | Site footer, /destinations, home map flags |

**Antarctica:** it has its own "Been to Antarctica" box above the country list in the map editor, with one checkbox per traveler. It is not a country but it is a place, so it counts in Places and the percent, and shows as "+ Antarctica" next to Countries.

## 5. Other rulebooks (shown side by side, never replacing the rule above)
- **UN members only:** count of the 193 UN member states with Lived or Stayed.
- Any other rulebook the /account "rulebooks" section shows is computed from the same map, with its denominator printed next to it.

## 6. Nancy's numbers from her saved map (19 Oct)
- **Places:** 90 of 249, including Antarctica.
- **Countries:** 89 by the rule in section 4, or 88 if New Caledonia comes off (**open:** Nancy to confirm whether she was there). 88 matches her bio and "Country 88" in the Schengen story.
- **UN members:** 84 of 193.
- **Layovers:** 2 (Taiwan and the Dominican Republic).
- **Magnus:** 15 places on the map (Denmark included) against 14 in his pet profile list (Denmark left out as home). **Open:** one source for him too, and whether home counts.

## 7. Known problems to design around
- **Stale browser copies.** The browser keeps its own copy of the map, and a failed save can leave that copy marked as newest, so it keeps winning over the saved one. Nancy's audit showed 87, 94 and 85 for this reason. The fix is in code (move the timestamp only after a successful save). Designs should show "Last saved" and a "Refresh from my account" action.
- **Public profiles.** Visitors to a profile see a country number stored in the CMS. That is a snapshot, not a live count. **Open:** write it from the map on every save, or hide it for visitors.
- **Bios** should not contain counts ("88 countries" goes out of date). Use the live number next to the bio instead.

## 8. Copy rules for anything showing a count
- US spelling, no em dashes, no exclamation marks.
- Never use: filed, ship, ships, shipped, ledger, "counted by hand".
- Say "countries" only for the Countries rule. Say "places" for anything out of 249.
