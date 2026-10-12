# Account and sign-in 3.0: proposed changes for /account, /login, /signup and /forgot-password (for Nancy's approval)

Sources:
- handoff/claude-design-source/v3/:
  - TLL Account v3.dc.html, which Nancy named as the account design: a dark hero ("YOUR ACCOUNT", "Hi, {first name}.", profile address, profile and directory status, "Edit profile", "View public profile ↗", a profile progress bar) and a nine-tab rail (Overview, Edit profile, Map and lists, Stories, Pets, Saved, Share card, Privacy and data, Login and email).
  - TLL Site Prototype 3.0: screen `auth` (log in and sign up in one card, `authMode`), screen `forgot`, screen `account` (the four module cards LOGGED, PAWED, WRITTEN, SNAPPED, "Your lists" sticker sheet, "LAYOVER WRAPPED · LANDS 1 DECEMBER", "Your data stays yours."), plus the `LISTS`, Wrapped and `exportMyData` logic in the script.
  - PROMPT.md (the account file is "read only for now"; keep Memberstack attributes and login and account links exactly as live), audit-2026-10-09.md (logged-out previews, return path through auth, dashboard and share receipts, canonical on /login, form errors announced), updates-10c/UPDATES.md (homepage photo interludes only, nothing for these pages). There is no other UPDATES.md in v3.
- Live, read on 12 October 2026 through the Webflow MCP (read only):
  - Account (6a0d5c23c57426a9c563e8de, /account): element tree, head and footer code, the eight applied page scripts, SEO, OG and JSON-LD.
  - Login (6a0d5c1cdf2debc69dd1b7f9, /login), Signup (6a0d5c1fa1d71485d8688f7b, /signup), Forgot Password (6a0d5c21d56feff00d7f10f2, /forgot-password): element trees, head and footer code, page scripts (none), SEO, OG and JSON-LD.
  - The site has 77 pages and no separate reset-password page.
  - The hosted page scripts (tll_account_stories_count, tllacctmodcounts, tllgateflashv1, tllacctpetsv1, tllexportv1, tllacctstoriescssv1, tllacctstoriesv1) could not be downloaded from this container (proxy 403), as in the 9 October copy pass. tllacctkosovov1 was read from src/pages/account/kosovo-label-v1.js.
- Memberstack, read only (currentApp, getPlans, getCustomFields; nothing written):
  - App thatlayover.life: passwordless off, 2FA not required, member self-delete off, captcha off, disposable emails blocked, 14-day sessions.
  - App redirects: after signup /account?welcome=true, after login /account, after logout /.
  - One plan, Traveler (pln_traveler-l97086o), free, 2 members.
  - 63 custom fields, including first-name, name, bio-short, home-base, lives-country, languages, link-* and link-*-on, is-expat, is-creator, is-press, share-level, share-slug, share-items, share-ranges and wrapped-hidden.
- handoff/STATUS.md rows A08, A11, A12, B00, B26, B37, B38, C01, D03, D04, D05, D06, F01, F03, F04, G10, G11, S01, S02, S07, S13, S14, S16, S31, S32.
- reports/copy-pass/2026-10-09-tll-copy-pass.md, sections 5 (Account), 23 (Login), 24 (Signup) and 25 (Forgot password).
- reports/country-destinations-3.0/2026-10-11-proposed-changes.md for the format and the shared rules.

Read only. Nothing has been changed in Webflow or Memberstack, and nothing has been published.

## How it gets built

- **Same method as homepage 3.0, Stories 3.0, Map 3.0, Profile 3.0 and the country pages.** New HTML embeds go in, plus one namespaced style block per page. The account page uses `a3-`. Login, signup and forgot password share one `au3-` block, copied into each page head. They use the tll-system.css tokens, copied the same way home3.css copied them. tll-system.css is not loaded as a file.
- **Memberstack is upgraded, never compromised.**
  - These stay exactly as they are:
    - every `data-ms-form`: login, signup and forgot-password, including the duplicate copies on the two card divs;
    - every `data-ms-member`, `data-ms-plan:add="pln_traveler-l97086o"`, `data-ms-auth-provider="google"`, `data-ms-social-auth-allow-signup`, `data-ms-content`, `data-ms-action` (logout, profile-image) and `data-ms-modal="profile"`;
    - every input name (email, password, first-name, Checkbox, age-16), required flag and minlength;
    - the form names ("Html Form"), the plan, the app redirects and every custom field.
  - Restyling is CSS on wrappers and classes only.
  - The one proposed addition on Memberstack inputs (labels tied to inputs, autocomplete, a show-password button) is open point 1 and is not built without a yes.
- **Old parts are hidden, never deleted.** Every element ID, `id` attribute, data-* attribute, form, link setting and embed stays. Typed or dead parts are set to hidden.
- **Counting rule.**
  - The countries total is Lived plus Stayed for the member's own travelers (not pets), with layovers counted apart, out of 249.
  - It is read from tllStates by the live `__tllAcctStats` and `tll-acct-lists` v1.3 code (S01), and nothing new computes it a second way.
  - No number is typed anywhere. A number with no per-member source (stories, Lounge photos) shows no number, as B38 decided.
- **tllStates is written only by the map.**
  - The account reads it. The Map 2.0 section on /account is the map itself and keeps writing tllStates as it does today (B38, published 8 October).
  - Nothing in this proposal writes tllStates.
  - Log a place keeps writing member JSON `tllLists` (S13). Been here and Want to go keep writing `tllPlaces` (D03). The Wrapped switch keeps writing `wrapped-hidden` (D05).
- **Tabs without moving anything.**
  - The design's tab rail is built by the a3 script at run time. It adds a `role="tablist"` rail and shows one group of the existing sections per tab, by hash (#overview, #map, #stories, #pets, #card, #privacy, #settings).
  - Nothing is moved, regrouped or deleted in the Designer.
  - With JavaScript off, or before the script runs, every section shows stacked as it does today.
- **Motion (Emil rules):**
  - Hover and press only. Tabs, module cards, buttons and the Google button get a 150ms ease-out border or color change, and `scale(.97)` on press. Transitions name their properties (no `transition: all`).
  - The live `.tll-pickin-card:hover` outline jump is replaced by the same color change.
  - The sticker tilt stays (it does not move).
  - The design has no other motion: no count-up, no progress-bar fill animation, no tab slide.
  - Hover effects sit only under `@media (hover: hover) and (pointer: fine)`. With prefers-reduced-motion, all transitions are off.
- **Draft first.** Each page is built on a draft duplicate or staged unpublished. The live pages change only after Nancy says yes.
- **Not touched:**
  - TLL Nav v1 (including where its instance sits on /account; see open point 9), TLL Site Footer and the feedback button.
  - Memberstack settings, plans, redirects, emails and custom fields.
  - The site head and footer code and the site scripts.
  - The Map 2.0 account embed code and the share panel code (G10).
  - The protected lines. "Free to join. We're not a gym." appears only through row U2. "Get In →", "Send It →" and "Your inbox deserves better than deals." are not on these four pages and are not touched.

## Must survive (added 28 September to 12 October)

| What | Where it lives | How the proposal keeps it |
|---|---|---|
| Members and anonymous split (F01) | /account wrap 148f…7752: members block …7740 [data-ms-content=members], anonymous block …7751 [data-ms-content=anonymous] | Not edited. The a3 script runs inside the members view only |
| Gate flash fix (B38, 8 Oct) | Head `tll-acct-gate-v2` (style and script: the anonymous block stays hidden until Memberstack says there is no member, or 6 seconds pass) plus page script tllgateflashv1 (header) | Kept as is. The a3 tab rail is hidden under `html.tll-anon` the same way, so a signed-out visitor never sees an empty rail |
| Card counts and the countries rule (S01, F04) | Footer `__tllAcctStats` (stat strip, hidden by CSS) and `tll-acct-lists` v1.3 cardCounts(): LOGGED = Lived + Stayed, own travelers, layovers apart; PAWED = pet travelers; page script tllacctmodcounts | Kept. The Overview tiles (row A4) are the same four cards restyled, and they show the numbers these scripts write. "of 249" is added as text beside the computed number, never as a typed count |
| Sticker sheet lists (B38, S02, S13) | `tll-acct-lists` v1.3: tabs Countries (default), Pet stamps, Want to go, Layover airports survived, Marathons, National parks, plus the nine tabs added by `tll-acct-log-js` (Airports, Cities, Bridges, Labyrinths, Ports, Parks, UNESCO sites, Landmarks, Marathons); remove button per sticker; reads tllStates, tllPlaces, tllLists | Kept, restyled only (row A7) |
| Log a place (S13) | `tll-acct-log-js` and `tll-acct-log-css`: list, place, year; writes member JSON tllLists[list] as {name, year, at}; countries stay map-only | Kept. Its form already has labels, an aria-live message and error tone. Restyled to the design's single row (row A7) |
| Layover Wrapped (D05) | Section [data-tll-wr=sec]; quiet-year fallback "0 countries, 100% couch."; switch writes custom field wrapped-hidden (member JSON fallback) | Kept, restyled. Shown on the Overview tab (row A5) |
| Export (D06) | Data block 158e…853d: "Export my data" mailto (subject "Data export request"), "Delete account" mailto (subject "Account deletion request"); page script tllexportv1 | Kept as email requests (open points 5 and 6). Moved on screen into the Privacy and data tab (row A10) |
| Kosovo labels (S31, S32) | Page script tllacctkosovov1 1.1.0 (footer): renames 900, 901, 902 and old "undefined" stickers to Kosovo, Northern Cyprus, Somaliland; reads and writes no data | Left applied. The restyle keeps `[data-tll-ls=sheet] li b` and `i` as they are, so its selectors still match |
| Sign-out label fix (S14, S31) | Link 0426…ad38 [data-ms-action=logout][data-tll-acct-signout] with the text "Sign out" (was the Webflow placeholder); `tll-acct-signout-v1` style hides it under `html.tll-anon`; Settings card …773c [data-ms-action=logout] | Both kept. The hero link moves visually into the hero action row (row A2). The card label "Logout →" becomes "Sign out →" (copy pass) |
| My map section (B38, 8 Oct) | Section 629d…bae7 [data-tll-acct=map], HtmlEmbed ee67…960c (map-2.0/embed/account-section.embed.html, tap to log) | Not edited. Shown on the Map and lists tab (row A6) |
| Share card and privacy panel (G10) | HtmlEmbed c870…8267 (host #tll-share-host): share-level, share-slug, share-items, share-ranges | Not edited. Shown on the Share card tab (row A9) |
| My stories and My pets (B38) | Blocks …770b and …7719 with page scripts tllacctstoriesv1, tllacctstoriescssv1, tllacctpetsv1, tll_account_stories_count | Kept. Shown on their own tabs (row A8). These hosted scripts could not be read from here, so their output is checked on the draft before approval |
| Signup consent and age (A08, B37) | Signup checkbox …f87d (name "Checkbox", required) with the Terms, Charter and Privacy links; age checkbox …4dcc (name age-16, required) "I am 16 or older."; legacy Charter span …f885 and the raw "age-16" label hidden | Kept. Restyle only |
| Forgot placeholder (B26) | Forgot head `tll-forgot-ph-v1` (placeholder you@somewhere.com set by script) | Kept |
| Robots and canonical | Account and Login: noindex, follow. Forgot: noindex, follow. Signup: canonical /signup (indexable) | Kept; additions in "SEO, AEO and accessibility" |

## Account (/account): section by section

What the account design (TLL Account v3) shows, in order:
1. Its own header and footer (not used; TLL Nav v1 and TLL Site Footer stay).
2. An Ink hero: round photo, "YOUR ACCOUNT", "Hi, {first name}.", a mono line "thatlayover.life/p/{handle} · PROFILE · PUBLIC · DIRECTORY · /EXPATS", buttons "Edit profile" and "View public profile ↗", and "PROFILE 5 OF 7 DONE · Add: short bio →" over a progress bar.
3. A left rail of nine tabs, with counts on Map and lists, Stories, Pets and Edit profile.
4. Each tab's content:
   - **Overview:** four stat buttons (COUNTRIES, STORIES, PETS, LOUNGE PHOTOS), "Finish your profile" checklist, "Closest to done" list progress.
   - **Edit profile:** the full form, with a live Travelers card preview.
   - **Map and lists:** "Count countries by" select, Log a place, filter chips, and a table of every list with count, progress and what counts.
   - **Stories:** a list with "View" and "Suggest an edit".
   - **Pets:** a Paw Passport card.
   - **Saved:** empty state.
   - **Share card:** two formats and "Make my card".
   - **Privacy and data:** who sees your profile, what your page shows, Download your data, Delete your account with "Type delete my account".
   - **Login and email:** email change with a code, password change, sign-in methods (Google, Apple), "Email me when" switches, "Sign out of this device" and "Sign out everywhere".

The Prototype 3.0 `account` screen is the earlier version of the same page: "Welcome back, Nancy.", the four module cards, "Your lists", "LAYOVER WRAPPED", and "Your data stays yours." The live page already matches it (B38).

| # | Section | Change | Live parts kept |
|---|---|---|---|
| A1 | Hero | Matches the design's Ink hero: 1240px column, 40px top and 36px bottom padding, photo 96px round with a 2.5px Rose ring. Eyebrow becomes "YOUR ACCOUNT" in mono #00C9C8 (the live dots "· Welcome back ·" are dropped). The h1 stays "Hi, {first name}." with the first name in the Rose italic, bound by Memberstack exactly as today. The lede becomes the copy-pass line: "This is your shelf inside the library: the countries you have logged, the stories you have filed, the photos you have dropped in the Lounge, and the pets that came along." The live line lists "saved stories", which the page does not have. | Hero …76d2, avatar wrap …76b1, placeholder …76b0 [data-ms-member=first-letter], image 30e1…d8cb [data-ms-action=profile-image] and its alt, eyebrow …76b3, h1 …76b7 with em …76b6 [data-ms-member=first-name], sub …76b9 |
| A2 | Hero status and actions | New, read only, under the h1: a mono line "PROFILE · JUST YOU / LINK ONLY / PUBLIC" read from custom field share-level (off / unlisted / public), and "DIRECTORY · /EXPATS /CREATORS /PRESS" or "DIRECTORY · OFF" read from is-expat, is-creator and is-press. Nothing is written. The design's "thatlayover.life/p/{handle}" and "View public profile ↗" are left out because /p/ pages do not exist yet (G11, open point 8). Action row: "Edit profile" (Cream outline button, to /edit-profile) and the existing "Sign out" link restyled as the second button. The empty link 62ed…4a87 (no text, no target, so screen readers read it as an empty link) is hidden. | Sign out 0426…ad38 [data-ms-action=logout][data-tll-acct-signout] and its "Sign out" text, `tll-acct-signout-v1`; empty link 62ed…4a87 (hidden, not deleted) |
| A3 | Profile progress | New, read only: "PROFILE {n} OF 7 DONE" with a `role="progressbar"` bar and one button to the next missing item, as in the design. The seven checks, from existing Memberstack data only: photo (profile image set), display name (first-name or name), short bio (bio-short), home base (lives-country or home-base), languages, at least one link switched on (a link-* with its link-*-on true), a directory opt-in (is-expat, is-creator or is-press). The button goes to /edit-profile, which owns those fields (S16). The bar is static (no fill animation). | None (new embed inside the members block, after the hero row) |
| A4 | Overview: module cards | The four live cards keep their order and links and take the design's stat-button look. Ink tiles, 4px radius (was 11px), mono label, Playfair number, one line, one action. Numbers come only from the live scripts: LOGGED shows the computed total with "of 249" set beside it as plain text; PAWED shows the pet count and the live line "{pet} · N countries and zero complaints."; WRITTEN and SNAPPED keep no number (no per-member source, B38). The LOGGED card has no link today, so "Edit my destinations →" goes nowhere. It gets the link setting /the-map#edit and the label "Open my map →" (copy pass, B47). Three cards carry a custom `href` attribute that disagrees with their link setting: PAWED /paw-passport (setting /my-pets), WRITTEN /share (setting /submit, and /share does not exist), SNAPPED /gallery (setting /share-photos). Open point 7. | Actions section …76fd, grid …76fb, cards …76df, …76e8, …76f1, …76fa and their [data-tll-mod] labels, h3s, bodies and CTAs; the hidden eyebrow …76d4 and h2 …76d6 stay hidden; stat strip …76d0 stays hidden by CSS |
| A5 | Overview: Wrapped and Finish your profile | Wrapped matches the 3.0 prototype card: Ink, 4px radius, eyebrow "LAYOVER WRAPPED · LANDS 1 DECEMBER", h2 from the script, stats as a definition list. The switch becomes a real 44px button look with the live aria-pressed and status message. Crew line uses the copy-pass text: "Once your crew has more people in it than you and your pet, you will be able to compare years. A quiet year gets a card of its own, so nobody opens an empty one." Next to it is the design's "Finish your profile" list, built from the A3 checks, with "ADD →" buttons to /edit-profile and screen-reader text "(done)" or "(to do)". The design's "Closest to done" list progress is left out because the live lists have no totals to count against (open point 4). | Wrapped …3d92 and all its [data-tll-wr] parts; crew p …3d8b (text change in the Designer on approval) |
| A6 | Map and lists tab: map | The Map 2.0 section is shown first on this tab, under an h2 "Map and lists" and the design's line "Counted by hand, list by list. The full map lives on its own page.", with "Open your map →" to /the-map. The design's "Count countries by" select (UN members, UN plus two observers, ISO plus Kosovo) is left out, because the site has one rule: out of 249 (S01). | Section 629d…bae7 [data-tll-acct=map], embed ee67…960c (not edited) |
| A7 | Map and lists tab: Your lists and Log a place | Restyle only. Tabs become the design's filter chips (Ink when selected, 32px tall with a 44px hit area, aria-selected kept). Stickers keep the dashed tilt, with 4px radius instead of 12px. Log a place moves visually above the sheet, as in the design, in the design's one-row layout: List, Place, Year, Add. Labels, the aria-live message and the error tone are already live. The design's "WHAT COUNTS" table is not built in this pass; each tab gets its one-line rule from the design instead, under the chips ("Connected through or flew from." for Airports, and so on; open point 4). Copy-pass empty lines for marathons and parks. | Your lists …3d83 and every [data-tll-ls] part, tabs 2170…f979 and …3d75 to …3d7d, sheet …3d7f, empty …3d81, `tll-acct-lists` v1.3, `tll-acct-log-js`, tllacctkosovov1 |
| A8 | Stories and Pets tabs | Each block becomes its own tab panel under an h2 ("Your stories", "Pets") with the design's lines. Stories: "Share another story" to /submit; whatever tllacctstoriesv1 renders stays. Pets: "Each pet gets a Paw Passport. Your pet follows your profile's privacy setting." and "+ Add a pet" to /my-pets. The empty-state titles are divs and get role="heading" aria-level="3". The live line "Magnus 🐻‍❄️ already filed." is shown to every member with no pets, including new members who have never met Magnus, so it is dropped from the empty state (open point 12). | Mine section …771c, blocks …770b and …7719, their eyebrows, h2s …7701 and …770f, empty states …770a and …7718, CTAs …7709 and …7717; tllacctstoriesv1, tllacctstoriescssv1, tllacctpetsv1, tll_account_stories_count |
| A9 | Share card tab | The live share panel (G10) is the design's Share card and most of its Privacy section: Just me, Anyone with the link, Public; Country count, Percent, Map, the pet, ranges; "Two taps. Then everyone knows." It is shown as is on this tab under an h2 "Share card". Restyle stays outside its host: 4px radius, the same focus ring. The design's format chips "STORY 1080×1920 · GRID 1080×1350" match G03 and are already in the panel. | HtmlEmbed c870…8267 and #tll-share-host (not edited) |
| A10 | Privacy and data tab | Holds "Your data stays yours." as an h2, with the copy-pass line "Export everything as JSON and Markdown (a human sends it within one month), or delete the account entirely. No exit interview." and the two buttons, plus a line pointing to the Share card tab for who sees what. Export stays an email request (D06). The design's "Ready in a minute, right here" download is not built (open point 5). Delete stays an email request because member self-delete is off in Memberstack. The design's "Type delete my account" form is open point 6. | Data block 158e…853d, export …8539 and delete …853b mailtos, tllexportv1 |
| A11 | Login and email tab | The four live settings cards in the design's layout: Edit your profile, Email and password, Newsletter, Sign out. Email and password keeps opening Memberstack's own profile modal (`data-ms-modal="profile"`), which already handles email and password change. The design's inline email-with-code and password forms, Google and Apple connect, "Email me when" switches and "Sign out everywhere" each need Memberstack or new fields (open point 3). Copy-pass edits: "Bio, photo, location and social links: the public version of you." (the country count now comes from the map), "Change your email, reset your password, or manage how you sign in.", "Sign out →". The Edit profile card has `href="/u/me"` and the Newsletter card `href="#"` as custom attributes over their link settings (open point 7). | Settings …773f, cards …7727, …772e [data-ms-modal=profile], …7735, …773c [data-ms-action=logout] and their texts |
| A12 | Tab rail | New: the design's rail, as `<nav aria-label="Account sections">` with `role="tablist"`. It is vertical and sticky at 220px on wide screens, and a horizontal scrolling row under 830px. Seven tabs: Overview, Map and lists, Stories, Pets, Share card, Privacy and data, Login and email. "Edit profile" is a link to /edit-profile, not a tab (S16 owns the editor). "Saved" is left out (open point 10). Badges show only computed numbers: the Map and lists badge is the LOGGED total, the Pets badge the pet count. Arrow keys move between tabs. The hash keeps the tab on reload. The panel gets focus on change, as in the design. With JS off everything shows stacked. | None (new embed inside the members block; hidden under `html.tll-anon`) |
| A13 | Signed-out gate | Kept as the 3.0 paper card, restyled to 4px radius and the 3.0 type. The h2 "Your shelf is *behind the sign-in.*" stays an h2. The copy-pass lede: "Account pages are for signed-in Travelers, so sign in to find your map, your stories and your pets." The audit asks for a useful logged-out preview, so three plain lines name what is behind the sign-in (your map out of 249, your lists and Wrapped, your share card), with no sample numbers. TLL Nav v1 sits inside the members block, so a signed-out visitor on /account sees no site nav (open point 9). A "Back to the stories →" text link to /stories is added in the gate card so nobody is stranded. | Anonymous block …7751 and every child: eyebrow …7742, h2 …7746, sub …7748, Sign in …774a → /login, Join the Travelers …774c → /signup; `tll-acct-gate-v2` |
| A14 | Headings and landmarks | Today: h1 Hi, {name}; h3 on the four cards with no h2 above them (the "Pick a door" h2 is hidden); h2 Your lists, h2 Wrapped, h2 My stories, h2 My pets, h2 Account. 3.0 outline per tab: h1 Hi, {name}; h2 per tab panel (Overview, Map and lists, Your stories, Pets, Share card, Your data stays yours, Login and email), h3 inside (the four cards, Finish your profile, Your lists, Wrapped, Log a place). No element type changes: new tab h2s live in the new embed, existing tags stay. The panel is `role="tabpanel"` labelled by its tab. | All existing headings |
| A15 | Style and scripts | `<style id="tll-a3-account-v1">` at the end of the page head, after `tll-acct-signout-v1`. `<script id="tll-a3-account-js-v1">` at the end of the footer, after `tll-acct-log-js`, doing tabs, the status line, the progress checks and the gate link. It reads Memberstack with getCurrentMember only. It never calls updateMember, updateMemberJSON or anything that writes tllStates. tllgateflashv1 stays applied (open point 11). Nothing is a site script. | All existing head and footer blocks and the eight page scripts |

Proposed changes on /account: 15.

## Log in (/login): section by section

What the prototype `auth` screen (login mode) shows:
1. On Ink, a 420px column with "Welcome back." in Playfair 28px and "Your map missed you." in #9496AC.
2. A dark card (#12141F, 1px #232744, 4px radius) holding "Continue with Google", an "OR" rule, mono labels EMAIL and PASSWORD with inputs, and a Rose "Log in →" button.
3. Under the card: "Not on the roster yet? Join the Travelers".

The live page has the same parts in a two-column layout: the brand column (eyebrow, h1 "Pick up where you *stopped.*", lede, four callback lines, a luggage tag) and the form card.

| # | Section | Change | Live parts kept |
|---|---|---|---|
| L1 | Layout | Prototype layout: the section becomes Ink (#0A0B14), min-height 70vh, content centered. The brand column becomes a compact header above the card: eyebrow, h1 and lede centered, 420px max. The luggage tag is hidden. The callback lines are hidden; their message is already in the lede. Nothing is deleted; the split collapses by CSS to one column. | Section 3c16…ffcd, split …ffcc, brand col …ffa2 and inner …ffa1, form col …ffcb; callbacks …ff99 and luggage …ffa0 (hidden, not deleted) |
| L2 | Headline and lede | The h1 stays "Pick up where you *stopped.*" (approved copy, B37), set at the prototype's 28px to 40px Playfair 800 in Cream with the Rose italic. The lede takes the copy-pass sentence: "Your passport, your stories and your pets are all still where you left them, and the spreadsheet picks back up the moment you sign in." The prototype's "Welcome back." and "Your map missed you." are open point 13. The fourth callback line holds the banned word "curated", but it is hidden with the others. | Eyebrow …ff8a, h1 …ff8e, em …ff8d, lede …ff90 |
| L3 | Card | The prototype's dark card: #12141F, 1px #232744, 4px radius, 26px padding. The card eyebrow and h2 "Two ways back *in.*" stay (the h2 keeps the outline under the h1). Google button: 1px #2b2f52 border, Cream text, 44px tall, focus ring Teal. Divider "or with email" in mono #9496AC. | Card …ffca [data-ms-form=login][data-ms-social-auth-allow-signup][data-ms-plan:add], eyebrow …ffa4, h2 …ffa8, Google …ffad [data-ms-auth-provider=google], divider …ffb0 |
| L4 | Fields | Labels stay visible above the inputs (the prototype uses placeholder-looking boxes; that is not copied). Labels are mono 11px #CFCBC4 on the dark card, not the prototype's #4a4d63, which is about 2.2:1. Inputs: #0A0B14 fill, 1px #3a3d55 border, Cream text, 44px tall, 16px text so phones do not zoom, a 3px Teal focus ring. An invalid field gets a Rose #FF7093 border plus text, never color alone. Ties between labels and inputs: open point 1. | FormWrapper …ffbe, FormForm …ffbf [data-ms-form=login], labels …ffb2 and …ffb6, inputs …ffb3 and …ffb7 with id, name, type, required and data-ms-member untouched |
| L5 | Forgot link and submit | "Forgot your password?" moves under the password field, right-aligned, #00C9C8, 44px hit area. The submit takes the prototype's Rose button with Ink text (Rose #F0507A with white text is about 3.4:1, under AA for 14px), full width, 4px radius. It keeps its live label and loading text. | Row …ffbb, link …ffba → /forgot-password, submit …ffbd |
| L6 | Success and error | The two Webflow messages keep their copy. They get the dark-card look, and the error gets `role="alert"` on its block, so it is announced. Memberstack's own error toasts are not changed. | Success …ffc0 "Welcome back. Taking you to your shelf.", error …ffc3 "That email and password did not match. Try again, or reset your password with the link above." |
| L7 | Swap line | "Not on the roster yet? Join the Travelers →" sits under the card, centered, in #9496AC with the link in #00C9C8 (the prototype's #6B6660 on Ink is about 3.4:1). | Paragraph …ffc9, link …ffc8 → /signup |
| L8 | Metadata | SEO description takes the copy-pass fix, because the form is email and password, not a magic link (passwordless is off in Memberstack): "Welcome back. Your trips are still where you left them. Sign in with Google or with your email and password." A canonical `https://www.thatlayover.life/login` is added next to the existing noindex, as the audit asks. JSON-LD stays. | Head `noindex, follow`, OG, JSON-LD |

Proposed changes on /login: 8.

## Sign up (/signup): section by section

What the prototype `auth` screen (signup mode) shows:
1. "Join the Travelers." and "A map, a byline, a passport for your bestie. Free, obviously."
2. The same dark card with Google, email and password.
3. A consent box: "I have read and agree to the Terms of Service, the Editorial Charter and the Privacy Policy.", "I am 16 or older.", and "Every byline a real person. Sponsorships disclosed at the top, never in a footnote."
4. A dashed "Add your blog and socials · OPTIONAL · 30 SECONDS · OR LATER IN EDIT PROFILE" toggle that opens link rows with SHOWN and HIDDEN switches.
5. "Create my account →" and "Already on the roster? Log in".

| # | Section | Change | Live parts kept |
|---|---|---|---|
| U1 | Layout | Same as L1: Ink, a centered 420px column, the brand column collapsed above the card. The luggage tag ("Welcome aboard · Pre-launch") is hidden. The typed stats strip (1 Travelers, 9 Countries, 6 Stories, 1 Pets) is already hidden and stays hidden. | Section d8aa…f898, split …f897, brand col …f862, form col …f896; stats …f859 (already hidden), luggage …f860 (hidden) |
| U2 | Headline and lede | The h1 "Join the *Travelers.*" stays (it matches the prototype title). The lede takes the copy-pass line, which ends in the protected line exactly: "Keep your travel stats, register your pet, and share your stories and photos when a trip earns it. Free to join. We're not a gym." Today it reads "…Free, forever. We're not a gym.", which is not the protected wording (open point 14). The eyebrow "· Free to join · Always ·" becomes "FREE TO JOIN" without the dots. | Eyebrow …f83e, h1 …f842, lede …f844 |
| U3 | Card, Google, divider | Same dark card and Google button as L3. The card eyebrow "· Pick a door, traveler ·" and h2 "Sign up in *thirty seconds.*" stay. | Card …f895 [data-ms-form=signup][data-ms-plan:add], eyebrow …f864, h2 …f868, Google …f86d [data-ms-auth-provider=google][data-ms-plan:add], divider …f870 |
| U4 | Fields | Same field style as L4 for First name, Email and Password. The password gets the hint line "8 characters or more." under it, matching its live minlength of 8. The design's "12 characters or more" would need a different minlength (open point 2). Label ties: open point 1. | FormForm …f88a [data-ms-form=signup][data-ms-plan:add], inputs …f873 (first-name), …f877 (email), …f87b (password, minlength 8) |
| U5 | Consent box | The prototype's inset box: #0A0B14 fill, 4px radius, 13px padding, 12px Cream text. Checkboxes are drawn 20px with a 44px label hit area and a Teal check. Links are #00C9C8 and underlined, so they never rely on color alone. The legacy "I agree to the Editorial Charter · …" span stays hidden, so only the one agreement sentence shows. The note takes the copy-pass sentence: "Every byline is a real person, and sponsorships are disclosed at the top, never in a footnote." An unticked required box shows the browser message plus a Rose outline. | Charter label …f886, checkbox …f87d (name Checkbox, required), hidden inline label …f87f and span …f885, visible span 5a6d…548a with links to /terms, /editorial-charter, /privacy; age block 368b…4dd5, checkbox …4dcc (name age-16, required), hidden label "age-16", span "I am 16 or older."; note …4dd4 |
| U6 | Blog and socials | Not built in this pass. The prototype's optional link rows would add new inputs inside the Memberstack signup form. The custom fields exist (link-website, link-instagram, link-tiktok, link-youtube, link-strava, link-newsletter, link-other, each with its -on switch, C01), but adding inputs changes the form (open point 15). Edit profile already holds them. | Form untouched |
| U7 | Submit and messages | Rose button with Ink text, full width, keeping the live label "Create my account →". The success message keeps "Welcome aboard. Check your inbox to confirm, then come find your shelf." The error takes the copy-pass sentence "That did not go through. Check the email and password fields and try once more, and if it still will not budge, email hello@thatlayover.life." and gets `role="alert"`. | Submit …f888, success …f88b, error …f88e |
| U8 | Swap line | "Already on the roster? Log in →" under the card, styled as L7. | Paragraph …f894, link …f893 → /login |
| U9 | Metadata | Signup stays indexable, with its canonical, title and descriptions as they are (the copy pass kept them). It is the one auth page with search value. JSON-LD stays. No change beyond the restyle. | Head canonical, SEO, OG, JSON-LD |

Proposed changes on /signup: 8 (U9 is a keep).

## Forgot password (/forgot-password): section by section

What the prototype `forgot` screen shows: on Ink, a 400px dark card with "RESET PASSWORD" in mono Teal, "Lost the thread.", "Drop your email and we will send a magic link to get you back on the road.", an email box (you@somewhere.com), a Teal "Send the magic link →" button with Ink text, and "← Back to log in".

| # | Section | Change | Live parts kept |
|---|---|---|---|
| R1 | Layout | Prototype layout: the section becomes Ink, card 400px, #12141F with a 1px #23263c border, 4px radius, 30px padding, centered in 70vh. The CDG "Lost & Found" stamp stays as a small prop beside the card on wide screens and under it on phones (B26 kept it; the kit allows it). | Section 87c6…e30c, inner …e30b, card …e300, ephemera …e30a and stamp …e309 |
| R2 | Eyebrow, h1, lede | Eyebrow "RESET PASSWORD" in mono #00C9C8 (dots dropped). The h1 "Lost the *thread.*" stays. The lede and success line promise a "magic link", but passwordless sign-in is off in Memberstack and the email is a password-reset email. Proposed lede: "Drop your email and we will send a reset email to get you back on the road." Proposed success: "Sent. Check your inbox for the reset email, and if nothing lands in a few minutes, look in spam before you try again." (open point 16). | Eyebrow …e2e5, h1 …e2e9, lede …e2eb, success …e2f4 |
| R3 | Field and button | Field as L4, with the visible label "Your email". The button keeps its live label (B26: the Memberstack form and its button stay), styled as the prototype's Teal button with Ink text, which is about 8.9:1. | FormWrapper …e2f2, FormForm …e2f3 [data-ms-form=forgot-password], label …e2ed, input …e2ee, submit …e2f1, `tll-forgot-ph-v1` |
| R4 | Second step | The page has only the first Memberstack step (forgot-password). There is no `data-ms-form="reset-password"` form for the code or link and the new password, anywhere on the site. On the draft, the full reset is tested with a test member. If Memberstack's own reset window finishes the job, it gets no change. If the flow stops after the email, see open point 16. | Form untouched |
| R5 | Links and messages | "← Back to log in" and "Join the Travelers →" in #00C9C8 on Ink, 44px hit areas. The error keeps its copy and gets `role="alert"`. | Divider …e2fa, alt row …e2ff, links …e2fc → /login and …e2fe → /signup, error …e2f7 |
| R6 | Metadata | SEO description becomes "Lost the thread. Drop your email and we will send a reset email to get you back on the road." OG takes the copy-pass sentence with the same fix: "Lost the thread. Drop your email and we will send the email that gets you back in." A canonical `https://www.thatlayover.life/forgot-password` is added next to the noindex. The JSON-LD description changes the same way. | Head noindex and `tll-forgot-ph-v1`, BreadcrumbList Home > Sign in > Reset your password |

Proposed changes on /forgot-password: 6.

## Shared auth style (login, signup, forgot password)

- `<style id="tll-au3-auth-v1">` goes at the end of each of the three page heads. The forgot page's comes after `tll-forgot-ph-v1`.
- It scopes every rule to `.tll-auth-section` or `.tll-forgot-section`, so the same classes elsewhere are not affected. tll-auth-card, tll-auth-input and the rest are only used on these pages today, but scoping keeps it safe.
- A small `<script id="tll-au3-auth-js-v1">` at the end of each footer adds `role="alert"` to the Webflow error blocks. If open point 1 is a yes, it also adds the label ties, autocomplete and the show-password button.
- Nothing is a site script.

## SEO, AEO and accessibility

- **Indexing.**
  - /account, /login and /forgot-password stay `noindex, follow` (private and utility pages).
  - /signup stays indexable with its canonical, because it is the page that explains what a free account gives.
  - Canonicals are added on /login and /forgot-password (audit item).
- **Metadata copy.**
  - /login and /forgot-password stop promising a magic link, because passwordless is off in Memberstack (rows L8 and R6).
  - /account SEO and OG descriptions take the copy-pass lines: SEO "Your countries, your stories, your photos and your pets, on the one shelf in the library that is yours."; OG "Your countries, your stories, your photos and your pets. The library has a shelf for you." The live versions list saved stories, which the page does not have. The /account JSON-LD WebPage description follows.
- **Structured data.** WebPage and BreadcrumbList stay on all four. Nothing is added: these are not answer pages, and FAQPage or HowTo markup would describe content that is not on them.
- **AEO.** The audit asks for logged-out previews and a clear return path. Row A13 gives the gate a plain list of what is behind it. The return path through sign-in is open point 17.
- **Forms (WCAG 1.3.1, 3.3.1, 3.3.2, 4.1.2).**
  - Today every auth input has `id="field"`: two on login, three on signup, one on forgot. The labels have no `for`, so screen readers do not tie labels to inputs. There is no `autocomplete`, so password managers guess. The fix is open point 1.
  - Every page keeps visible labels; placeholders are never the only label.
  - Errors get `role="alert"` and a visible text message, not color alone.
  - Required checkboxes keep `required`.
- **Contrast.**
  - On the dark auth card: labels #CFCBC4, secondary text #9496AC, links #00C9C8, the Rose button with Ink text, the Teal button with Ink text.
  - These prototype values are corrected: #4a4d63 labels and divider text on #12141F (about 2.2:1) become #9496AC or #CFCBC4; Rose #F0507A with white text becomes Ink text; #6B6660 on Ink becomes #9496AC.
  - On light (the account page): Teal text #067A79, small Rose text #C8325B, muted #6B6660. The account design's #C9C3B8 switch-off track gets a 1.5px #6B6660 border so the control is visible (3:1 for UI).
- **Focus.** 3px rings: Ink on light, Teal on Ink. The account head currently uses a Rose #D63859 ring on the sign-out link and the Log a place controls; the a3 block matches them to the 3.0 rule (J03). Tabs, chips, switches and checkboxes are all `<a>`, `<button>` or native inputs. The prototype's clickable divs and spans ("Log in →", "Join the Travelers", the socials toggle) are not copied.
- **Targets.** 44px minimum for buttons, tabs, chips, checkboxes (through their labels) and links in the auth cards (J06).
- **Privacy.** The account shows a member only their own data. The status line (A2) reads share-level and the directory switches and writes nothing. No prototype sample data is shown (open point 18).
- **Motion.** Hover and press only; prefers-reduced-motion turns transitions off.

## Open points (Nancy)

1. **Tie labels to the Memberstack inputs.** All six auth inputs share `id="field"` and no label points at them. This fails WCAG 1.3.1 and 4.1.2, and password managers get no `autocomplete` hint. The fix adds attributes to Memberstack inputs (nothing existing is changed or removed). [Default: yes, at run time from the au3 script only: `aria-labelledby` to the visible label, `autocomplete` (email, current-password, new-password, given-name), and a "Show password" button beside the password that switches the field between hidden and shown. id, name, type in the Designer, required, minlength and every data-ms-* stay as they are. If you would rather nothing touches those inputs, the restyle goes live without it.]
2. **Password length.** The live signup requires 8 characters (minlength 8); the account design says 12. [Default: no change; the hint says 8.]
3. **Login and email inside the account.** The design's inline email change with a 6-digit code, inline password change, Google and Apple connect, "Email me when" switches and "Sign out everywhere" need Memberstack settings, new custom fields or features Memberstack's page attributes do not offer. Apple sign-in is not set up. [Default: no change; the Email and password card keeps opening Memberstack's own profile window, and the four cards stay.]
4. **List totals and "Closest to done".** The design's table (Cities 470, Airports 132, UNESCO 70 of 1,273, New 7 Wonders 4 of 7 and so on) is Nancy's sample data. The live lists in tllLists have no "of N" totals. [Default: one rule line per list tab, no progress bars and no "Closest to done" until each list has a fixed total you approve.]
5. **Export.** The design downloads a zip "right here, ready in a minute". The live export is an email request answered within one month (D06). [Default: no change; keep the email request and its one-month line.]
6. **Delete account.** The design deletes in the page after "Type delete my account". Member self-delete is off in Memberstack, and the choice of what happens to published stories is not stored anywhere. [Default: no change; keep the email request.]
7. **Card links that disagree.** Five links carry a custom `href` attribute over their link setting: PAWED (/paw-passport over /my-pets), WRITTEN (/share over /submit; /share does not exist), SNAPPED (/gallery over /share-photos), Edit your profile (/u/me over /edit-profile), Newsletter (# over /newsletter). The LOGGED card has no link at all. S07 lists the /share and newsletter fixes as staged. [Default: remove the five custom `href` attributes so the link settings win, and give LOGGED /the-map#edit. These are plain links, not Memberstack attributes.]
8. **Public profile address and "View public profile ↗".** /p/{handle} pages do not exist yet (G11 blocked). [Default: leave both out; show "PROFILE · JUST YOU / LINK ONLY / PUBLIC" from share-level only.]
9. **Nav on the signed-out /account.** The TLL Nav v1 instance sits inside the members block, so a signed-out visitor on /account sees no site nav. Moving the instance means moving the nav in the Designer. [Default: no change to the nav; add the "Back to the stories →" link in the gate card (row A13).]
10. **Saved tab.** The design has a Saved stories tab and the live hero once promised saved stories. No save feature exists on story pages. [Default: no Saved tab and no mention of saved stories.]
11. **tllgateflashv1.** The 28 September page script is still applied next to the 8 October gate fix, which does the job. [Default: leave it applied; review when the hosted script can be read.]
12. **"Magnus 🐻‍❄️ already filed." in the pets empty state.** Every new member with no pets sees it. [Default: drop the sentence from the empty state; the rest of the line stays.]
13. **Auth headlines.** The prototype uses "Welcome back." with "Your map missed you." for log in, and "Join the Travelers." with "A map, a byline, a passport for your bestie. Free, obviously." for sign up. The live pages use "Pick up where you *stopped.*" and "Join the *Travelers.*" with the approved ledes. [Default: keep the live h1s and the copy-pass ledes; take the prototype's layout only.]
14. **Signup lede and the protected line.** The live lede ends "Free, forever. We're not a gym.", not the protected "Free to join. We're not a gym." [Default: the copy-pass lede ending exactly "Free to join. We're not a gym."]
15. **Blog and socials at sign-up.** The fields exist, but the inputs would go inside the Memberstack signup form. [Default: no change; links stay in Edit profile.]
16. **Forgot password wording and second step.** Passwordless is off, so "magic link" is not what arrives. The page also has no reset-password form for the code or link and the new password. [Default: "reset email" wording (rows R2 and R6); test the full reset on the draft with a test member; if it stops after the email, a `data-ms-form="reset-password"` form is a separate proposal for you, and no Memberstack setting changes.]
17. **Return to the page you came from.** Country and story pages send signed-out visitors to /login?redirect=…. Memberstack's after-login redirect is fixed at /account (after signup /account?welcome=true), and the audit asks to keep the visitor's place. [Default: no change to Memberstack redirects; test on the draft whether ?redirect= is honored, and report.]
18. **Prototype and design sample data, not used.**
    - Account design:
      - Nancy's name, photo, handle nancy-carleton, bio line and "One strong opinion"; Denmark and Copenhagen, the Brazil and Vietnam line, three languages, "since 2018"; her Instagram and YouTube links.
      - "YOU QUALIFY · 9 PUBLISHED PIECES".
      - The list counts (Cities 470, Airports 132, UNESCO 70 of 1,273 and the rest) and the country rules 87 of 195, 87 of 193 and 94 of 249.
      - The nine typed stories and "0 drafts · 0 in review · 9 published".
      - "Magnus · Samoyed · 35 kg · 13 countries, zero complaints filed".
      - The "Closest to done" notes (Parícutin, Jeju and Komodo, Great Wall).
      - The masked email n•••••@gmail.com, "Code sent. It expires in 15 minutes.", Google CONNECTED and Apple NOT CONNECTED.
      - "Layover Club news … Price still to be confirmed" and "Rare. Maybe twice a year."
      - The export file tll-nancy-carleton-9-october-2026.zip and "Ready in a minute".
      - "Prototype only. In production this signs you out and confirms by email."
    - Prototype 3.0 account: "Welcome back, Nancy.", "COPENHAGEN · MEMBER SINCE MAY 2026", LOGGED 87 with "108 to go" (a 195 base), PAWED 1, WRITTEN 4 with "One draft waiting" and "Resume draft →", SNAPPED 0, "Pet stamps 13 · Magnus" and the export note "Emailed within one month of request".
    - Auth: the placeholder "you@somewhere.travel" (forgot uses you@somewhere.com), the "Send the magic link →" label and the signup link rows.

    [Default: none appear; every value comes from Memberstack, tllStates, tllPlaces, tllLists or the live scripts, and empty states stay honest.]
19. **Protected lines.** "Get In →", "Send It →" and "Your inbox deserves better than deals." are not on these four pages. [Default: not touched anywhere in this pass.]
