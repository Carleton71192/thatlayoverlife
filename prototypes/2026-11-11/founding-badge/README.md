# Founding badge: prototype

A member presses "Make my badge" and gets a PNG of their founding badge, drawn in the browser on a canvas: a Story (1080 x 1920), a square post (1080 x 1080) or a landscape image for X and link previews (1200 x 675). There are two designs, the Traveler badge and the Paw Passport stamp, each on a dark or light background. The share step then offers whatever this browser can really do. Nothing is made until the member asks, and nothing is posted for them.

Mock-up only. Nothing here is loaded by the live site, nothing was committed, and Webflow was not touched.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The demo. One self-contained document; `badge.js` and `share.js` are copied into it by `build.cjs`. The only external load is the Google Fonts stylesheet. |
| `badge.js` | Draws the image from a data object and returns a PNG Blob. No dependencies, no network, no geolocation. `TLLBadge.render(data)` resolves `{ blob, width, height, fileName, alt, fonts }`. |
| `share.js` | The share step: caption, referral link, X link, share sheet, save, copy, all feature detected. |
| `build.cjs` | `node build.cjs` copies the two scripts into `index.html`. Run it after editing either. |
| `test.cjs` | `node test.cjs`: 42 tests of the pure parts and of the share step against stand-in browsers (below). |
| `check.cjs` | Playwright check in Chromium: renders the six images, checks their pixel sizes, drives the page at 390 and 1440, repeats the share step in a sandboxed frame, takes the screenshots. |
| `badge-*.png`, `paw-*.png` | The six images from the check (Traveler on dark, Paw Passport on light). |
| `shot-390.png`, `shot-1440.png` | The page at device scale 2, after Make my badge. |

Run the checks from this folder:

```
PATH=/opt/node22/bin:$PATH node test.cjs
NODE_PATH=/opt/node22/lib/node_modules PATH=/opt/node22/bin:$PATH node check.cjs
```

Set `CHECK_EXTRA=/some/dir` to also write long-name, no-location, cap and other-theme variants for review.

## What the founding program is today (read 12 November 2026)

From the repo and the live site (www.thatlayover.life):

- **Who has numbers.** Three, all typed by hand into the home page embed (a0d1cd97): "Founding 01" Nancy Carleton, "Founding 02" Jay Carleton, "Founding 03 · Pet" Magnus Waffles. On /travelers, Jay's card carries `data-tll-badge="FOUNDING 02"`; Nancy's card says "FOUNDER · EDITOR", not a number. Nobody else has one.
- **Where numbers live.** Nowhere but that page text. No Memberstack field, no Worker route and no site layer stores, assigns or checks a founding number (`grep -ri founding worker src/site-layers` finds nothing).
- **The cap.** The home page eyebrow still reads "06 · The first 100". The sentence "First 100 get a founding badge." was in the lede of that section until the P0 closeout on 11 November and is no longer on the live page (checked 12 Nov). The open slot tile ("Open slot · Founding 04") was retired earlier. So no live page states what the first 100 get, and no rule says what earns a place (signup, a submitted story, or a published one). The demo therefore does not draw "of 100" unless the checkbox is ticked.
- **Number style on the site.** Two digits ("Founding 01"). The brief asks for three ("No. 042"). The badge uses three, so the cap of 100 fits; the site and the badge should match before launch.
- **Pets share the sequence.** Magnus is 03 in the same count as the people.
- **Magnus's place count.** His pet page record (`window.TLL_PET.countries`) lists 15 countries, and the page renders "15 countries logged". The badge counts that list. Elsewhere the site disagrees: /the-paw-passport says 13 and /about once said 14 (already listed in `handoff/CHANGE-LOG-TRUST-CONVERSION-2026-11-11.md`). The page's server HTML, before scripts run, shows a different placeholder list of 12.
- **Analytics.** The site uses GA4 (`gtag`) under consent mode v2 (`tll-consent-mode-v2.js`), with event names like `slideshow_share` and `crew_invite`.

## Where this departs from the brief, and why

1. **No "Share to Instagram Stories / X" button.** A web page cannot post an image into Instagram Stories or attach one to an X post through a link; there is no such web API. The buttons say what they do: **Share** (only shown where the browser can hand the image file to the system share sheet), **Save image**, **Copy caption**, **Open X**. Under them, one line each says what happens next.
2. **"Unique coordinates" are a city's, not the member's.** The owner's privacy rules allow city or country only, never where someone is now, never anything that makes a home findable, no GPS. The page never calls the geolocation API (test.cjs checks the source). The member picks a home base from a short list; coordinates are the city's, rounded to one decimal place (about 10 km), e.g. 55.7° N 12.6° E. "No location" drops the place line, the coordinates and the code in the stamp. The list: Copenhagen, then cities from published TLL stories in `src/data/story-search-index.json` (Madrid, Torrevieja, Cairo, Bangkok, Phoenix, Lisbon, Istanbul, New Orleans, São Paulo, Auckland). Codes are each city's usual airport code; Torrevieja uses ALC.
3. **The number is never typed in production.** In the demo it is editable and labeled SAMPLE. On the site it comes from the member record (below). A number that is not a whole number from 1 up, or is above the cap, is not drawn at all rather than drawn wrong.
4. **"of 100" is off by default**, because no public page states the cap today.
5. **No invented people.** The default member is "Sample Traveler". The pet is Magnus Waffles, who is public, with his real number (03) and a place count computed from his record, read from his page on 12 November and embedded in the demo, because the page may not fetch other hosts.
6. **"Places" is "countries".** His record holds countries, so the stamp says "CPH → 15 countries", the count set in Mono like every number.
7. **Pen names win.** The badge uses the same rule as /edit-profile (`E.dispName`: credit mode full, first, or pen). One difference: on the site, a member in pen-name mode with no pen name saved is shown under their full name; the badge draws no name at all in that case, because the member said not to use it.
8. **The caption has no hashtags** and is one or two sentences in the magazine's voice, editable before sharing. Default: "Founding member No. 042 at That Layover Life. A travel magazine written by the people who took the trips." then the link.
9. **The postmark matches the site's stamp** (`tll-stamps-v1.js` and the cover stamp in `tll-mag-cover-v1.html`): three rings at r 94, 86 and 58 of 100, JetBrains Mono on two arcs, a small line, a large line and a date in the center, slightly rotated, with dry-ink gaps (seeded, so a badge always prints the same). Lettering is a little larger than on the site so nothing on the image is under 24 px. The pet version reads PAW PASSPORT on the top arc and the number in the center.
10. **The arrow is drawn, not typed,** because not every font subset carries U+2192.
11. **Story safe zones.** On the 1080 x 1920 image, nothing sits in the top 250 px or bottom 270 px, which Instagram's own controls cover.
12. **In-app browsers** (Instagram, Facebook, X, LinkedIn) get the "Press and hold" line too, since they often drop downloads silently. This was not in the brief.
13. **No Save image button in a frame or an in-app browser.** Both drop downloads without telling the page, so a Save button there would promise what it cannot do. The finished image stays on the page with the press-and-hold line, which works in both. At the top level of a normal browser, Save image is offered as before.
14. **The name outranks the number.** The number is sized from the fitted name (at most 0.8 of it), so a long name that has to shrink takes the number down with it.

## Share matrix: what the member gets

The page decides at run time with `navigator.canShare({ files })`, the frame's permissions policy and the user agent. It never assumes.

| Where | What shows | What the member does |
| --- | --- | --- |
| iPhone, Safari | Share, Save image, Copy caption, Open X | Share opens the iOS sheet with the PNG. Instagram (if installed) and X are listed there. Instagram does not take the caption from the sheet, so the note says copy it first. Save image saves to Files or Photos depending on the iOS version. |
| Android, Chrome | Share, Save image, Copy caption, Open X | Share opens the Android sheet; Instagram usually appears as separate Feed, Stories and Chats targets. X takes the image and the text. |
| Desktop Chrome | Save image, Copy caption, Open X; Share where the OS offers a share sheet (Windows, ChromeOS, recent macOS) | Most people save the image, then use Open X, which starts a post with the caption and link typed in, and attach the file. Instagram Stories cannot be posted from a desktop browser. |
| Desktop Safari (Mac) | Share (macOS sheet: AirDrop, Messages, Mail, Notes), Save image, Copy caption, Open X | AirDrop to the phone, then post from there; or save and use Open X. |
| Desktop Firefox | Save image, Copy caption, Open X | No Web Share on desktop Firefox, so no Share button. |
| In-app browsers (Instagram, Facebook, X, LinkedIn, TikTok) | The image on the page with "Press and hold, or right-click, to save the image", plus Copy caption and Open X; Share only if the webview supports it; no Save image | Press and hold the image to save it. Downloads are often refused there without any error, so no Save button is offered. |
| Sandboxed frame (the private artifact view) | The image on the page with the press-and-hold line, Copy caption, Open X | Share and Save image are hidden (the frame refuses both, silently in the case of downloads). Open X reports when the frame refuses a new tab and then hides itself. Copy caption tries the Clipboard API, then the older copy command, then selects the text and says to press Ctrl+C or Cmd+C. All copy writes happen inside the click handler. |
| Any browser, share sheet closed without picking an app | The status line says "Nothing was shared." | `AbortError` is treated as a choice, not an error: no warning, and the Share button stays. Any other refusal hides Share and points to the press-and-hold line. |

Checked in Chromium (check.cjs): top level, 390 and 1440, and a frame with `sandbox="allow-scripts"`. In that frame, the first build's "Make my badge" did nothing, because a sandboxed frame without `allow-forms` blocks form submission; it is now a plain button with a click handler. Real iOS, Android and in-app behavior has not been tested on devices.

## The referral loop

- The link is `https://www.thatlayover.life/?ref=badge`: a plain query GA4 can count, with nothing about the member in it. It is in the caption, in the X link, and `thatlayover.life` is on the image itself.
- "Copy caption" copies the caption with the link on its own line. "Open X" passes the caption as `text` and the link as `url`, both percent-encoded, so the link is not doubled.
- Events the page fires (shown on the demo page under "Events this page would count", sent nowhere): `badge_made` {design, format, theme} and `badge_shared` {method: share_sheet, download, copy_caption, x_intent}. No name or number goes in an event. "Shared" for a download or a copy means the member took the image or caption away, not that they posted it; nobody can know that.

## How it goes onto the real site

TLL is Webflow pages plus site-layer scripts, Memberstack for accounts, and the Worker.

1. **The number.** The Worker assigns it, once, at the moment the owner picks (signup, first story submitted, or first story published), in one transaction against a counter with a unique constraint, so two members can never get the same number and a number is never reused, even after an account is closed. The Worker then writes it to the member's Memberstack metadata with the admin key. Use metadata, not a custom field: members can change their own custom fields from the browser, and a number shown in public must not be editable by the person it belongs to. Seed 01, 02 and 03 to match the home page. Awarding is a server-side step only; the browser only reads.
2. **Where the button lives.** After signup: a "Your founding badge" card on the welcome or account page, once the number exists. After a first story: the same card on /edit-profile, and a line in the email that says the story is live. Both are opt-in: the card offers the button; nothing is made or posted until it is pressed.
3. **The script.** `badge.js` and `share.js` become one site layer (`tll-badge-v1.js`), loaded only on those pages. It reads name, credit mode, pen name, home base, joined date and the founding number from the Memberstack member object, maps home base to the built-in city list (city level only), and for pets reads the pet record.
4. **Open Graph image for the public profile.** So a shared profile link shows the badge: a Worker route such as `/og/badge/<profile-slug>.png` returns the landscape image for members who have a number and have turned it on. Canvas is not available in the Worker, so either the layer uploads the PNG it made (with consent) to R2 once, or the Worker renders the same layout as SVG to PNG with resvg-wasm. The profile template points `og:image` there. Facebook and LinkedIn prefer 1200 x 630; the layout system takes a fourth size with one new line in `FORMATS`.
5. **Counting.** Send `badge_made` and `badge_shared` with `gtag('event', ...)`, which respects the existing consent mode. On any page opened with `ref=badge`, fire a `badge_visit` event and remove the query with `history.replaceState` so the canonical URL stays clean. Report: badges made, shares by method, visits from `ref=badge`, and signups that started on such a visit.

## Risks

- **A wrong or duplicated public number.** This is the one that would hurt. Only the Worker assigns, in a transaction, never reuses, and the badge refuses to draw anything that is not a valid number below the cap. Decide what happens to a number when a member deletes their account (recommended: retired, never given again).
- **Opt-in only.** No badge is made automatically at signup and nothing is posted. The OG image is served only for members who turn it on.
- **Pen names.** A member who chose a pen name must never see their real name on the badge, the OG image, the alt text or the file name. The file name uses the number, not the name. If pen mode is on and no pen name is saved, the badge draws no name.
- **Location.** City list only, rounded to one decimal place; never the member's own location, never a street or neighborhood. Someone whose home city is small could still be identified by it; the "No location" option exists for that, and the default could be "No location" if the owner prefers.
- **Age.** The site is 16+. The badge adds no new sign-up path and asks for no age data.
- **Counts that disagree.** Magnus is 15 countries on his record, 13 on /the-paw-passport. A badge that disagrees with another page is worse than no count; fix the source before launch.

## What was tested

- `test.cjs` (42 passing). Added in review: the name is larger than the number in every format, accented names included; the postmark never repeats FOUNDING; the alt text names everything drawn (place line and postmark included, no middle dots read aloud); São Paulo keeps its accent; the share step against stand-in browsers: no Share without `navigator.share` and `canShare`, none when `canShare` refuses files or the frame policy forbids web-share, no Save in a frame or in-app browser, `AbortError` resolves as canceled, `NotAllowedError` as refused, a refused clipboard falls back and selects the caption, a refused popup is reported. The original 28: three-digit padding and refusals (0, negatives, decimals, above the cap); coordinates rounded half away from zero, S and W by letter, the equator, the prime meridian and the antimeridian (180.0° with no letter from either side, 179.97 rounding to 180.0°, 190 wrapping to 170.0° W); unusable pairs give no coordinates; every built-in city already rounded; dates as "11 November 2026" and "11 NOV 2026"; pen-name rule; place counting with duplicates; captions (sentence count, no hashtags, no banned words, cap only when set); the referral URL has only `ref`; copy caption adds the link once; the X link encodes ampersands, hashes, quotes, newlines and non-ASCII and passes the link once; layout for all six design and format pairs with names of 2, 15, 28 (with and without a space) and 30 characters, with and without a location: nothing under 24 px, the stamp at least 400 px and inside the margins, no row touching the stamp or the wordmark, 28-character names never cut.
- `check.cjs` (all passing): the six PNGs at exact pixel sizes with the brand fonts loaded; Make my badge shows the full-size image with alt text; caption and X link; no text under 12 px and no sideways scroll at 390 and 1440; a 16 px gutter at 390; the 2 px #C8325B focus ring; the sandboxed frame path; no page errors.
- Second review (12 Nov), by eye at 1080 and 1200 wide, dark and light, both designs: "Søren Ærø" No. 001, "São" No. 100 of 100 with São Paulo, a 28-letter name with and without a space, no location, no number. Fixed: the number (120 px) competed with the name (104 px) and now sits below it; with no location the postmark said FOUNDING a third time and now carries the number; the coordinates line had double spaces that the tracking widened into a gap; "Sao Paulo" lost its accent; the alt text left out the place line and the postmark; the save hint had a decorative teal side bar; page copy had a list of three in the eyebrow and the lede, and the lede stated a rule for earning a number that the site has never published.
- Reviewed by eye in the first build: the six images, plus long names, no location, light with the cap and Sao Paulo, and the pet on dark. Fixed after review: the pet count was in Playfair italic old-style figures and is now in Mono; 28-letter names without a space were being cut and now fit whole; coordinate rounding was asymmetric for south and west.

## Decisions for the owner

1. **What earns a number:** signup, a submitted story, or a published story. And whether pets keep sharing the sequence with people (Magnus is 03).
2. **The cap:** confirm "first 100" (then "of 100" can be drawn) or drop it. Today only the eyebrow "The first 100" remains in public.
3. **Two digits or three:** the site says "Founding 01"; the badge says "No. 042".
4. **Magnus's count:** 15 on his record, 13 on /the-paw-passport. Which is right.
5. **Where the number is stored:** Worker plus Memberstack metadata (recommended) or a Memberstack custom field.
6. **Default location:** the member's home base, or "No location" until they choose one.
7. **The OG image:** whether a member's public profile should show the badge in link previews, and which of the two ways to make it.
8. **The word after the arrow:** free text (14 characters) in the demo. A member could type a neighborhood there; a short list of words ("anywhere", "everywhere", "next") would close that gap.
9. **Stamp size on the Story:** about half the width. It reads as the TLL postmark, not as decoration, but a smaller stamp would leave more of the frame empty; it is a matter of taste.
