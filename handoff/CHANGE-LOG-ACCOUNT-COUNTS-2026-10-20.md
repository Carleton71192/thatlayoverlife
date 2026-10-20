# Change log: one count function on /account (20 October 2026)

**Status:** Proposed, awaiting Nancy's approval. The Webflow edits below were staged as unpublished changes on 20 October 2026 at about 08:09 UTC; both code blocks were read back and match the after files exactly. Nothing is published. STATUS.md row S94.
**Rulebook:** handoff/claude-design-source/COUNT-RULES.md (one source, never typed; Places include Antarctica, Countries exclude it and show "+ Antarctica").
**Site:** 69d6145cf421c777840c1e25. **Pages:** /account 6a0d5c23c57426a9c563e8de, /the-map 6a0df81df4016d4f78cfb22a.
**Before and after code:** src/pages/account/live-2026-10-20/ and src/pages/the-map/live-2026-10-20/ (files named `-before` are the live code read today, `-after` is what was staged).

## 1. What Nancy saw, and which script wrote which number

Nancy reported (19 and 20 October) that on /account LOGGED shows 89 and then 90, and WRITTEN shows 50.

The /account page has two places that hold numbers:

- A hidden stat strip (`.tll-account-stats`, element 148fc877-086d-5622-a83d-de293c9a76d0, `display:none` since the dashboard restyle) with four `.tll-stat-num` cells bound to Memberstack with `data-ms-member` = countries (…76bd), continents (…76c2), stories-count (…76c7), pets-count (…76cc). Memberstack has no custom field with any of those keys (the only count field is `country-count`), so each cell keeps its typed "0".
- Four visible cards in the Overview tab. The number is a `.tll-mod-count` block created by script next to the label: Logged (label cfcc78d9-0be8-3944-d0bd-83646871d6ce, `data-tll-mod=countries`), Pawed (d20de8bb-fa19-10be-c8e4-23ee75b25143, `data-tll-mod=pets`), Written (2794f379-ec09-c6ff-c0a0-2b4fbd6fb0f1, `data-tll-mod=stories`), Snapped (no number).

Five writers were running at once, on timers, from three sources:

| Writer | Where | Source | What it wrote | Timing |
|---|---|---|---|---|
| Memberstack `data-ms-member` fill | the four hidden strip cells | member custom fields (typed) | nothing matches, cells stay "0" | on Memberstack load |
| Page script `tllacctmodcounts` | copies each hidden strip cell into the matching card `.tll-mod-count` | the hidden strip | Logged 0, then 89; Written 0, then 50; Pawed 0, then 1 | every 400 ms for 24 s |
| Page footer block 1 (`__tllAcctStats`) | hidden strip cells "countries", "continents", "pets" | tllStates, browser copy first, then member JSON | 89 (countries, Antarctica left out), continents, pets | every 350 ms for 17 s |
| Page footer block 2 (`tll-acct-lists-v1.3`, `cardCounts`) | card `.tll-mod-count` for Logged and Pawed, the pet card body line | tllStates, browser copy first | 90 (countries plus Antarctica, the "of 249" number) | once after Memberstack loads, and after every list edit |
| Page script `tll_account_stories_count` | hidden strip cell "stories" | the member's own story cards on /stories | 50 | once, then re-set every 500 ms for 6 s |

So LOGGED went 0, 89 (modcounts copying block 1's 89), 90 (cardCounts), then back to 89 whenever modcounts fired again. The card's "of 249" suffix is page CSS, so 89 of 249 was also the wrong rule (89 is the Countries number; the "of 249" number is Places).

WRITTEN 50 is Nancy's own count: the live /stories page has 53 story cards, 50 tagged nancy-carleton, 1 each for jay-carleton, barzy-adam and chesney-lish. The sitemap lists 53 stories. The number was right; the bounce was 0 then 50, written by two scripts.

The browser copy problem (COUNT-RULES section 7) comes from /the-map: its head script `__tllMsSync` stamps the browser copy (`localStorage.tllStatesAt`) as newest the moment `__tllPush` is called, 1.2 seconds before the save runs. If the save fails, the browser copy keeps the newest stamp and `pull()` pushes it back over the saved map on the next load. The map layers bundle (map-2.0/dist/tll-map-layers.js, `writeDepth`) stamps the same way.

## 2. The change, line by line

### 2.1 /account page footer custom code (page 6a0d5c23c57426a9c563e8de, footer block). Staged, unpublished.

Before: src/pages/account/live-2026-10-20/page-footer-2026-10-20-before.html (identical to src/pages/account/footer-v6-antarctica.html). After: src/pages/account/live-2026-10-20/page-footer-2026-10-20-after.html (also saved as src/pages/account/footer-v7-one-count.html).

1. Block 1 (`__tllAcctStats`, lines 1 to 42: `tllOwn`, `ataNote`, `setStat`, `apply`, `getStates`, the 350 ms poll) is replaced by `tll-acct-counts-v1` (source src/pages/account/tll-acct-counts-v1.js). It holds:
   - `tllCounts(record)`: the one count function. From the saved map it returns places, countries, ata (Antarctica ticked), layovers, lived, stayed, continents, and one entry per pet with its stamps and its own Antarctica flag. Human travelers only for the member's numbers; pets count on their own. Layover-only places never join the totals. Kosovo and the user-assigned codes pass through unchanged.
   - `paint(record, json)`: the only writer of the cards. Logged gets places (the page CSS adds " of 249"), Pawed gets the pet count and the one-pet body line ("Magnus · 15 countries plus Antarctica and zero complaints."), and a "Last saved 19 Oct 2026" line under the Logged number from `json.tllStatesAt`. With no saved map the cards show no number rather than a guess.
   - `stories(member)`: Written, counted once from the member's own cards on /stories (same author-slug rule as before, one card per story URL). No timer.
   - `window.tllOwn` stays as a thin wrapper for anything else that calls it (the lists block did).
   - Nothing polls. Nothing writes the hidden strip or any `data-ms-*` element.
2. Block 2 (`tll-acct-lists-v1.3`, now v1.4) keeps the sticker sheet, tabs, Layover Wrapped and the wrapped-hidden switch. Edits:
   - `getStates`: when a member is signed in, the saved map in member JSON is the source; the browser copy is used only when there is no saved map (or no member). Before, the browser copy always won.
   - `cardCounts` removed; `paint()` now calls `window.tllAcctCounts.paint(states, json)` and, when a member is loaded, `window.tllAcctCounts.stories(member)`.
   - `wrapped()` reads `window.tllAcctCounts.count(states)`: COUNTRIES LOGGED shows countries with " + Antarctica" when ticked, unchanged in look.
3. Block 3 (Log a place) and block 4 (`tll-a3-account-js-v1`, tabs and badges) are unchanged. The Map and lists badge keeps reading the Logged card number.

### 2.2 /account page scripts (applied scripts list). Staged, unpublished.

4. `tllacctmodcounts` removed from the page (it copied the hidden strip into the cards; the 0 and the 89).
5. `tll_account_stories_count` removed from the page (the second Written writer).
   Both stay registered on the site, unused. `tllacctstoriesv1` (lists the member's stories in the Stories tab) stays; it fetches /stories for the list, not for a card number.

### 2.3 /the-map page head custom code (page 6a0df81df4016d4f78cfb22a, head block). Staged, unpublished.

Before: src/pages/the-map/live-2026-10-20/page-head-2026-10-20-before.html. After: page-head-2026-10-20-after.html. Only the `__tllMsSync` script changes, three lines:

6. `window.__tllPush`: the line `try{localStorage.setItem(AT,String(Date.now()));}catch(e){}` before the save is removed.
7. In the save, `json.tllStatesAt=Date.now()` becomes `var t=Date.now(); json.tllStatesAt=t;` and the browser stamp is written only inside the success handler: `.then(function(){last=j;try{localStorage.setItem(AT,String(t));}catch(e){}})`. Saved map and browser copy now carry the same stamp, and only after the save succeeded.
8. `pull()`: the saved map is taken whenever the account has one (`if(rs)`), and the browser copy is pushed only when the account has no saved map yet (`else if(ls)`). Before, the two stamps decided, so a browser copy stamped by a failed save won and was pushed back over the saved map. With this, a copy left behind by a failed save, or one stamped under the old scheme, is replaced on the next load. An edit made while offline is lost on the next load and has to be logged again; the saved map is the one source.

### 2.4 Repo only (no Webflow edit yet)

9. map-2.0/dist/tll-map-layers.js: `writeDepth` no longer stamps `tllStatesAt` before the save; `pushMemberstack` stamps it after `updateMemberJSON` succeeds. This file is served from jsDelivr pinned to a commit, so it reaches the site only when the pin moves: the /account map embed (element ee672abf-2d76-2371-e49d-ea35ffd3960c) and the /the-map embed script `tllmapembedv1` both carry the pinned commit. Moving the pin needs the commit on GitHub first, so it is a follow-up after approval, not part of this staging.

### 2.5 Not touched

- Every `data-ms-*` element, including the four hidden strip cells and their attributes.
- The /account head code (CSS, gate, a3 styles) and the " of 249" rule on the Logged card.
- Card headlines and body copy, except the one-pet body line the page already wrote.
- Memberstack custom fields and member JSON. The page writes no data.

## 3. What Nancy will see after publish

- Logged: 90 of 249, once, with "Last saved" and the date of the last successful map save under it.
- Pawed: 1, body "Magnus · 15 countries plus Antarctica and zero complaints." if his map stamps say so.
- Written: 50 (her own stories on /stories).
- Layover Wrapped: COUNTRIES LOGGED 89 + Antarctica.
- The numbers appear once Memberstack has answered (about a second) and do not change again.

## 4. Open questions

1. The Logged card headline reads "Countries on your map." under a number that is Places out of 249 (90, Antarctica inside). Section 8 of the rulebook says "places" for anything out of 249. Two options: keep "90 of 249" and change the headline to "Places on your map.", or show the Countries number (89) and move " of 249" off the card. This change log keeps the number as the page computed it since 19 October (90 of 249) and changes no copy.
2. WRITTEN 50 is correct for Nancy by the author-slug rule (50 of 53 live stories). If a different number was expected, say which stories should not count.
3. Continents and layovers have no visible element on /account outside the map embed; `tllCounts` returns both for whoever needs them next.
4. A place logged from the inline map on /account shows in the cards on the next load, not live. Before, it showed live only during the first 17 seconds.
5. The /stories fetch sees the cards the page renders (collection list, 100 items at most). Fine at 53 stories; a count field written on publish would be the long-term source.

## 5. Verification plan after approval

Publish to the Webflow subdomain only, load /account signed in as Nancy, watch the three cards for 30 seconds (one write each), then publish to the custom domains and log the result in STATUS.md.
