# The Map 2.0, Phase 5: the member record, the globe, the counting rule

Date: 8 October 2026. Built on Nancy's word after the first preview ("it worked and it looks cool") and her functional check.

## What changed

1. **The countries layer reads the logged record, not the pins.** The editor's `tllStates` v2 record (the one the map page mirrors between localStorage and the Memberstack member JSON) is now the source for the countries layer, the hero counter, the Countries card and the paw layer. Order: a logged-in member's Memberstack JSON, then the browser copy, then `data/owner-record.json` (the site owner's copy, states only, shown to logged-out visitors as the showcase). The map re-renders when the editor saves (`tll:states` event) or another tab changes the record (`storage` event).
2. **Counting rule (Nancy, 8 Oct 2026):** Lived and Stayed make the total. Layovers are counted on their own line, "counted apart", never in the total. For the owner's record that is 85 of 249 with 2 layovers alongside; the earlier 94 came from Places Been pins and is gone.
3. **Places Been pins only propose.** A pin country with nothing logged shows as "Not yet · pins in Places Been" and the card says how many are waiting. Proposals appear only on the owner's map (the showcase copy, or a live record that holds nearly all of it); another member never sees Nancy's pins proposed on their map.
4. **Territories count apart from the home country.** Natural Earth folds some territories into the parent shape; the map now splits them into their own features with their own ISO code: French Guiana, Guadeloupe, Martinique, Réunion, Mayotte (from France), the Caribbean Netherlands (from the Netherlands), Svalbard and Jan Mayen and Bouvet Island (from Norway), Christmas and Cocos Islands (from Australia). Greenland, Puerto Rico, the Faroe Islands, Aruba, Curaçao and the rest already had their own shapes. The duplicate id 036 in world-atlas (Australia twice) is folded into one feature, so Australia counts once.
5. **MapLibre 5.24.0 with globe projection.** Antarctica and both poles draw; the globe hands over to Mercator by itself as you zoom to street level, so OpenFreeMap street detail still works. world-atlas stores Antarctica as a ring along the pole with the coast as its hole; it is rebuilt as a planar polygon from the coast, closed through the pole and cut at the prime meridian, with its outline drawn from the coast only. Known limit: the tile scheme stops at 85.05° south, so the very pole stays sea-colored (a small disc, invisible from any normal angle).
6. **Depth colors differ by hue.** Lived Rose #F0507A with a Cream edge, Stayed deep Teal #067A79, Layover only the Rose hatch. Not yet unchanged. Legend swatches follow.
7. **Edit my destinations** button in the switcher bar, same label as the account and profile tiles, to `/the-map#edit` (the map page footer opens the editor on that hash). Override with `data-tll-editor` on the root element. Nancy, 8 Oct: logging and integrations belong in the account's edit profile / map section; that is the Phase 6 job below.
8. **The paw layer** follows the record's first pet. A member with no pet gets an empty chip. The chip still carries the collection's name (Magnus Waffles 🐻‍❄️) for every member; renaming it per member is Phase 6.

## Checked offline (Playwright, MapLibre 5.24.0 vendored, OpenFreeMap tiles stubbed)

- Owner record: 85 / 249, 34%, Lived 5, Stayed 80, Layover only 2, Not yet 162, 9 proposed from pins; Magnus 14 paws. Luxembourg (record only) is Stayed; Botswana (pin only) is proposed; French Guiana is not yet while France is Stayed; Greenland and Puerto Rico are their own shapes.
- A test record with 3 countries (one each depth) and a pet with 2: counter 2 / 249, legend 1 / 1 / 1, no proposals, paw chip 2. Same result when the record arrives late from a Memberstack stub.
- Antarctica: drawn, lit Stayed, no seam. Globe at 1440 and 390. Street zoom at 12.5 still renders. Every other list unchanged (full regression of the Phase 2 to 4 harness, no page errors).
- Evidence: `reports/evidence/map-2.0/v5/` (`*-globe-*.png`, `rec-*-bar.png`, `rec-*-card.png`).

## Phase 6, the member build (Nancy, 8 Oct 2026: "everyone should have the option of a map like this and more")

Not started. Scope to agree before build:
- Every list per member, stored one row per member per list in Memberstack Data Tables (the Trip Ledger table already exists with owner-only read and write rules) instead of the site's data files.
- Logging and integrations inside the account's edit profile / map section: log a country, a city, a park, a race; import a Places Been export; paste a Strava activity or Polarsteps trip; GPX upload for Ground covered with the home circle removed in the browser before anything is stored.
- Only me / Public per list, and a public map page per member.
- Shared pets and travel companions (B44, B46).
- Memberstack is upgraded, never compromised: new tables and fields only; nothing existing removed.
