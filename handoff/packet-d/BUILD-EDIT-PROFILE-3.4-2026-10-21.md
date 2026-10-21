# Edit profile 3.4 build (21 October 2026, cloud session)

Log: handoff/CHANGE-LOG-EDIT-PROFILE-3.4-2026-10-21.md, approved as recommended (no email invites yet, desks in one new Contributors field, the live links list kept). Everything is in the repo; nothing is in Webflow or deployed. Checked offline: the page parts assembled with a fake Memberstack in Chromium at 390 px (tools/edit-profile-smoke.mjs): developing card 5 of 8 for a half-filled profile, the next step, section row, desks seeded from the flags, a desk added and switched to NOW, a crew invite waiting, the member JSON written back with its other keys kept, no page errors, no sideways scroll.

## Files

| File | What changed | Rows |
|---|---|---|
| src/pages/edit-profile/after-2026-10-20/01-ep-css-b.html | Styles for the developing card, the 88 px photo button, contributions grid and cards, crew rows, expat desks, the preview grayscale, phone breakpoints. | D2, D4, D5, D6, D7, D8 |
| 02-ep-top.html | Root gains data-desks-field and data-story-worker. Top row: status plus "View as visitor". The developing card (avatar, stage, n OF 8, eight segments, Next, Full color). Section row WHO · ABOUT · LINKS · CREW · YOURS · CONTACT · DIRECTORIES · VISIBILITY. 01: the photo as an 88 px round button with ADD or CHANGE, the note that only the name is required. | D1.1, D2, D3, D4.1 |
| 06-ep-about.html | "02 · About you", label Bio with the i note, the placeholder line as a note (the textarea itself is the Memberstack field and is not touched). | D4.3 |
| 09-ep-crew.html | Crew rows render from the member record (invites) and the pets list; invite box enabled for a name or handle; note without the email line. | D6 |
| 10-ep-pets.html | "05 · Your contributions": stories card (count and first image, EDIT → /account#stories), one card per pet (places from the map, EDIT PASSPORT, VIEW →), + Add a pet, Lounge photos (Manage →), + Send a photo. | D5 |
| 12-ep-dirs.html | The expat desks box under the three switches, shown when Live there is on. | D7.1 |
| 13-ep-vis.html | Links "Email, password, newsletter, data →" and "My pets →". | D8.1 |
| 14-ep-preview.html | SPEAKS line, grayscale class, "View my public profile" moved to the title row. | D8.2 |
| 16-ep-js-b.html | E.progress (the eight steps), E.paintDev, E.paintCrew, E.paintPets, E.paintStories, E.paintDesks, E.fillJson (pets, tllCrew, tllDesks, tllSnapshot from the member JSON), avatars and SPEAKS in the preview, dots for crew and yours. | D2, D5, D6, D7, D8 |
| 17-ep-js-c.html | Next step click, desk inputs and add, NOW or BEFORE, remove, crew invite and unlink, stories count (from the /submit Worker when data-story-worker is set, else the /stories page), the save: JSON keys go to the member record through getMemberJSON then updateMemberJSON with every other key kept; desks also go to the Worker when data-desks-field is 1. | D2.2, D5, D6, D7.2 |
| src/components/member-bar/tll-member-bar-v1.html | The account bar for /account, /edit-profile, /the-map, /my-pets: shown to a signed-in member, current page underlined. | D1.2 |
| src/pages/account/tll-acct-profile-card-v1.html | The /account card: stage, n OF 8, next step, Continue → to /edit-profile; gone at eight of eight. | D2.4 |
| src/profile-sync.js, test/profile-sync.test.js | Worker: "desks" joins the member-writable fields (JSON list of {c, years, knows, now}, twenty at most, cleaned). 30 of 30 tests pass in the two profile suites. | D7.2 |
| tools/edit-profile-smoke.mjs | The offline check described above. | |

## For the session that holds the lock

1. Webflow CMS: add one PlainText field "desks" (slug desks) to Contributors 6a0b29c7a7b1840afe9390a5. Then set data-desks-field="1" on #tll-ep. Until then desks live in the member record only.
2. Root Worker: `npx wrangler deploy` from the repo root so /profile/save accepts desks (after step 1, or the save answers 400 for that key; the page sends it only when data-desks-field is 1).
3. /edit-profile 6a0df371cd5b09ac504421ae: paste the ten updated parts over their embeds (01-b, 02, 06, 09, 10, 12, 13, 14, 16, 17). Designer text on the page header: eyebrow "YOUR PROFILE · LIVE", title "Edit your profile." with "profile." in the em, the sub line removed; the Memberstack bio textarea placeholder "Start with where you are and why you travel. Skip the country count, we show it for you." (a setting on the element, not a script).
4. The member bar embed at the top of the members-only content on /account, /edit-profile, /the-map and /my-pets.
5. The /account card embed near the top of the /account members-only content. /account needs a #stories anchor on the Stories tab (the story edit build's tab) and #settings on the settings block.
6. Once the /submit Worker is deployed, set data-story-worker on #tll-ep to its address so the stories card counts taken-down stories too.
7. Publish to both custom domains and the subdomain. Check signed in at 390 and 1440: the card counts right for Nancy (expect 8 of 8 once her map is saved), the desks box opens with Live there, a desk saves and survives a reload, the crew invite shows WAITING FOR THEM, the preview greys and colors.

## Honest limits

- Crew invites are recorded on the inviting member's record only (tllCrew). The other side cannot say yes yet; that needs a crew route on the Worker and the mutual check, as the C4.7 note already says. The row shows WAITING FOR THEM until then.
- Pet places come from the browser copy of the map (pet travelers) when the pet is on it, else from the pet's own countries list on /my-pets. Shared-with needs a sharedWith value on the pet record; none exists today, so the line shows breed and places only.
- Lounge photo counts have no source yet; the card shows "Credit or anonymous, your call each time." with Manage →.
