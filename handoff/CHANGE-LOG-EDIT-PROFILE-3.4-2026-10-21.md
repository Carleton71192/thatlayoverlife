# Change log for approval: Edit profile from prototype 3.4 (21 October 2026)

Nancy, 21 Oct: the Claude Design project "TLL Site Prototype 3.4", screen editprofile, "Implement". The file is in the repo at handoff/claude-design-source/v3.4/. This log is the 3.4 screen read against what is live on /edit-profile today (Edit profile v2, Packet C C4, built from the 3.2 screen, live 20 October) and against the two builds already in the repo from this morning (languages list B5, story edit). Nothing below is built. Rules kept: counts come from the map and are never typed; nothing touches a data-ms-* element; the AI writes no profile copy for anyone.

Same in 3.4 and live, left alone: the two-column page (form left, sticky preview right, one column under 900 px), save as you type with the status line, Shown as (Full, First, Pen with the pen-name note), One line, Home base, From and has lived in (five flags), the links rows with ON and OFF, the four contact choices with their lines, the three directory switches with "What is this", Public, Unlisted and Off, the ranges checkbox, "Counts come from your map, never from this form. Edit your map".

## D1 Head of the page

| # | Change |
|---|---|
| D1.1 | Eyebrow "YOUR PROFILE · LIVE" and the title "Edit your profile." (profile. in rose italic) replace the current intro paragraph. The save line sits at the right of the title with a "View as visitor" button (opens the public page; "View my public profile" from M5 is the same link, renamed). |
| D1.2 | Account bar above the title on /edit-profile, /account, /the-map and /my-pets: OVERVIEW · PROFILE · MAP · PETS · CONTRIBUTIONS · SETTINGS, the current one underlined rose. Contributions and Settings jump to those blocks on /account. One component, four pages. |

## D2 The developing card (new)

| # | Change |
|---|---|
| D2.1 | Under the title: the member's photo (initials when none), a stage word, "n OF 8", an eight-segment bar, and one next step. Eight steps, each a yes or no read from the saved profile and the map: a photo, the one line, the home base, at least one flag, at least one language, a bio, at least one link switched on, a saved map. Stages by count: BLACK AND WHITE (0), DEVELOPING (1 to 3), COMING THROUGH (4 and 5), NEARLY THERE (6 and 7), FULL COLOR (8). |
| D2.2 | "Next: {step} →" scrolls to that section, or opens /the-map for the map step. At eight of eight the line reads "Full color. Looking good." The i note: "Only your name is required. Your page fills with color as you add to it. Visitors always see it in full color." |
| D2.3 | The photo in the card and the preview card on the right are shown in grayscale by the share of steps not done (0 of 8 is black and white, 8 of 8 full color). Visitors never see this; it is the owner's view only. |
| D2.4 | /account gets the same card above the overview when fewer than eight are done: "YOUR PROFILE · {STAGE} · n OF 8", "Next: {step}", "Continue →" to /edit-profile. Gone at eight of eight. |
| D2.5 | Not built: the prototype's "SEE IT AS A BRAND-NEW MEMBER" toggle, which is a prototype device. |

## D3 Section names and order

| # | Change |
|---|---|
| D3.1 | The sticky section row drops the numbers and reads WHO · ABOUT · LINKS · CREW · YOURS · CONTACT · DIRECTORIES · VISIBILITY, each with a dot that turns teal when the section has content. Section headings keep their numbers 01 to 08. |
| D3.2 | 05 is renamed from "Pets and photos" to "Your contributions" (D5). 07 "The directories" and 08 "Who sees your page" keep their headings. |

## D4 Who you are and About you

| # | Change |
|---|---|
| D4.1 | Photo: an 88 px round button (ADD or CHANGE) that opens the upload. Name shows "REQUIRED" in rose beside its label; everything else is optional. The one-line counter stays (it is not in 3.4 but the 90 limit is). |
| D4.2 | Languages: the 3.4 chips are the same list idea as B5 (built this morning: the world's languages, Enter accepts a listed name). Kept as built. |
| D4.3 | About: the heading loses "· optional"; the field is labeled "Bio" with the i note "Two or three short paragraphs. Leave the numbers out; your counts show live next to it and never go out of date." Placeholder: "Start with where you are and why you travel. Skip the country count, we show it for you." The country-count note stays as it is. |

## D5 Your contributions (replaces Pets and photos)

| # | Change |
|---|---|
| D5.1 | Line: "Stories, photos and pets. Edit any of them." Cards in a grid: Your stories (first story's image, "n STORIES LIVE", EDIT →, opens the /account Stories tab, which carries Edit and Take down from the story edit build), one card per pet (photo, "SAMOYED · n PLACES · SHARED WITH {name}", EDIT PASSPORT to /my-pets, VIEW → to the pet's page), "+ Add a pet", Your Lounge photos ("n PHOTOS", MANAGE →), "+ Send a photo". |
| D5.2 | Pet places come from the pet's own count on the member's map (count rules, Pet stamps), never typed. |

## D6 Crew

| # | Change |
|---|---|
| D6.1 | Rows: round photo with a rose ring for a member and a teal ring for a pet, name, meta line ("MEMBER · LINKED 28 SEPTEMBER 2026 · 4 SHARED TRIPS", "PET · SAMOYED · SHARED WITH JAY"), UNLINK, and "WAITING FOR THEM" in amber while an invite is open. |
| D6.2 | One invite box: "Name, @handle or email, Enter to invite". A name or handle invites a member (needs the profile Worker, as today). An email sends one invite through the Worker and shows the row as "j@… · INVITE EMAILED · {date}"; the address is never shown or stored on the profile. Line under it: "Not on TLL? Use their email. We send one invite; the address is never shown." Open question 1. |

## D7 Expat desks (new, inside The directories)

| # | Change |
|---|---|
| D7.1 | When "Live there" is on, a box "YOUR EXPAT DESKS · n PLACES" opens: one desk per place the member has lived (seeded from the flags, the home country left out), each with the flag, the place name, an optional years field ("2019–2021", or "2024–now"), a "What you know: visas, schools, dog parks" line, and a NOW or BEFORE toggle. "Add a place you lived, Enter" adds one. i note: "One desk per place you have lived. Years are optional. Shown as where you know, never where you are today." |
| D7.2 | Storage: the desks live in the member's own record (Memberstack JSON tllDesks) and the Worker's profile save copies them to the Contributors item as one JSON field "desks" so /expats can list them. That needs one new Contributors field. Open question 2. |

## D8 Visibility and the preview

| # | Change |
|---|---|
| D8.1 | The links under the visibility choices read "EMAIL, PASSWORD, NEWSLETTER, DATA →" (one link to the /account settings block, which also holds the data download) and "MY PETS →". |
| D8.2 | Preview card: label "HOW IT LOOKS · PUBLIC" (or UNLISTED, OFF), photo at 4:3 with initials when none, name as shown, one line, HOME BASE in caps with the flags, the three counts from the map, "SPEAKS ENGLISH · DANISH · PORTUGUESE" when languages are set, the links line, all in the D2.3 grayscale. "View my public profile" moves up to the title row as "View as visitor" (D1.1). |

## D9 Copy

| Where | Copy |
|---|---|
| Eyebrow | YOUR PROFILE · LIVE |
| Title | Edit your profile. |
| Title button | View as visitor |
| Card stages | BLACK AND WHITE · DEVELOPING · COMING THROUGH · NEARLY THERE · FULL COLOR |
| Card line | n OF 8 |
| Next step | Next: add a photo · write your one line · add your home base · add the flags you have lived under · add the languages you speak · write a short bio · switch on a link · save your map |
| All done | Full color. Looking good. |
| Card note | Only your name is required. Your page fills with color as you add to it. Visitors always see it in full color. |
| Section row | WHO · ABOUT · LINKS · CREW · YOURS · CONTACT · DIRECTORIES · VISIBILITY |
| 05 heading | Your contributions |
| 05 line | Stories, photos and pets. Edit any of them. |
| Bio placeholder | Start with where you are and why you travel. Skip the country count, we show it for you. |
| Crew invite | Name, @handle or email, Enter to invite |
| Crew note | Not on TLL? Use their email. We send one invite; the address is never shown. |
| Crew pending | WAITING FOR THEM |
| Desks label | YOUR EXPAT DESKS · n PLACES |
| Desk line | What you know: visas, schools, dog parks |
| Desk add | Add a place you lived, Enter |
| Visibility links | EMAIL, PASSWORD, NEWSLETTER, DATA → · MY PETS → |
| Preview label | HOW IT LOOKS · PUBLIC |
| Preview languages | SPEAKS {languages} |
| /account card | YOUR PROFILE · {STAGE} · n OF 8 · Next: {step} · Continue → |

## Open for you

1. Email invites to the crew (D6.2): build them (needs the Resend key on the Worker, same as the writer copy) or keep invites to members only for now (recommended until Resend is set, with the box accepting names and handles and the email line hidden).
2. Desks storage (D7.2): one new Contributors field "desks" (JSON) so /expats can list them (recommended), or member record only, with /expats reading through the Worker later.
3. The 3.4 links list shows website, newsletter, instagram, tiktok, youtube, strava and an "Other" row. Live has instagram, youtube, website, tiktok, substack, strava, alltrails, komoot, garmin, beli. Keep the live list (recommended, the fields exist), or add Newsletter and Other as two more fields.

## What it depends on

The profile Worker save route (live since S117) for every field, the story edit build for "EDIT →" on the stories card, and the Memberstack JSON for the desks until question 2 is answered. The /account card (D2.4) touches the /account page once, outside any data-ms-* element.

Reply with the line numbers to approve or change. Build starts on approval, in the repo first, then applied by whichever session holds handoff/WEBFLOW-LOCK.md.
