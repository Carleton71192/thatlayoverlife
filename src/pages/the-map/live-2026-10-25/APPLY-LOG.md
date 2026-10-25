# /the-map signed-out: sample map (25 Oct 2026)

Nancy, 25 Oct: "Signed-out /the-map: blank (A) or a sample map (B) I choose B".

- Finding: the old `data-visited` list (Nancy's 84 codes) sits on the hidden canvas c84d785f-...793c (visibility false), so it never reaches the page. Visitors saw Nancy's map through Map 2.0: for anyone signed out it loaded the owner's record (Worker /owner-map, falling back to data/owner-record.json).
- map-2.0/dist/tll-map-layers.js (commit 46a21a1): new mount attribute data-tll-visitor="sample". Signed-out visitors (and visitors whose browser copy is empty) get data/sample-record.json, a made-up traveler with 30 places and 3 layovers, labeled by a SAMPLE MAP note with Start your own map (/signup) and Sign in (/login). Card badges read · SAMPLE; the owner record is never requested; Places Been proposals never show on the sample. Members and visitors with their own browser map see their own. Offline test map-2.0/test-sample/test.mjs 8 of 8; existing map tests 35 of 35.
- Embed 682054d4 on /the-map: pin a81ffb9 to 46a21a1 (the only map-2.0 changes between them are this one) and data-tll-visitor="sample". Before/after: embed-682054d4-before.html, embed-682054d4-after.html.
- /account map embed keeps its own pin (members only), unchanged.
