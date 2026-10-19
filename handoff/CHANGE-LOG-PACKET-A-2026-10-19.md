# Change log for approval: Packet A, global (19 October 2026, prototype 3.3)

Source: README-UPDATE.md, STANDING-RULINGS.md, COUNT-RULES.md and the 3.3 standalone prototype (footer arrays, nav, widget). Nothing in this log is built or published except A5, which was already made as an unpublished edit under the /submit approval this evening and is listed here so the record is complete. Nav and footer components are approved to edit (19 Oct). Counts bind to tllStates. Publish only on Nancy's word.

## A1 Nav (component "TLL Nav v1")

Today: Stories · Destinations · Travelers · Paw Passport · About, then Share your story, Log in, Sign up.

| # | Change |
|---|---|
| A1.1 | Items become Stories (/stories) · Travelers (/travelers) · The Map (/the-map) · Expats (/for-expats) · Paw Passport (/the-paw-passport) · About (/about). Destinations leaves the nav. |
| A1.2 | Share your story stays the rose button (/submit). Log in stays; Sign up stays beside it for logged-out visitors unless you say fold it into the drawer. Logged in: the avatar and account link as today. |
| A1.3 | Phone: wordmark, Share (44px) and Menu (44px) in the bar; Menu opens a full-height drawer with 56px rows, Share and Log in at the bottom, and the free line "FREE, FOREVER. NO CARD, NO PAYWALL." Reduced motion: no slide, plain show. |
| A1.4 | Every nav link keeps a visible focus ring (3px) and 44px height. |

## A2 Footer (component 710ff458, "TLL Site Footer")

Today: six groups with 31 links, three social links, the counts embed (v2.2) and the line "Run by humans, supervised by one Samoyed".

| # | Change |
|---|---|
| A2.1 | One short band: wordmark, then four slim columns in one row on desktop, five links each, 14px, tight leading. |
| A2.2 | READ: Stories (/stories), Destinations (/stories#by-place, see A9.1), The Map (/the-map), Travelers (/travelers), The Layover Lounge (/gallery until the 301 to /the-layover-lounge exists). |
| A2.3 | CONTRIBUTE: Share your story (/submit), Share photos (/share-photos), For expats (/for-expats), For creators (/creators, needs A9.2), For press (/for-press). |
| A2.4 | TLL: About (/about), Editorial charter (/editorial-charter), FAQ (/faq), Contact (/contact), For brands (/for-brands). |
| A2.5 | LEGAL: Privacy (/privacy), Terms (/terms), Cookies (opens the consent preferences, as today), Community guidelines (/community-guidelines), Colophon (/colophon if the page exists; if not, the column has four links). |
| A2.6 | Phones: accordions, 52px headers, 44px rows, links wrapping in a row. |
| A2.7 | One line below, every number from tllStates and labeled: "{n} countries in our stories · {n} stories · {n} travelers · {n} pet", then hello@thatlayover.life, then "© 2026 That Layover Life · Copenhagen". The counts embed goes to v3 to add travelers (profiles with visibility Public) and keep the existing countries and stories readers. Nothing typed. |
| A2.8 | Dropped from the footer, per the 3.3 design: Home, The Travel Wire, Pets we travel with, Spotlight, the two guide links that 404 (Copenhagen stopover, EES and ETIAS), The Layover Awards, The Layover Club, How paid work works, Instagram, Newsletter, LinkedIn, and the Samoyed line. Strike any you want kept. |

## A3 Type floor and tap targets (shared CSS, site head)

| # | Change |
|---|---|
| A3.1 | One namespaced block `tll-floor-v1` in the site head: at every width, the known 10 to 11.5px rules move to 12px (hero coordinates caption, story meta row and reading time, flow ticker, Reklamelink badge, author "from" line, trip list keys, receipts keys, contributor badge, AEO eyebrows, card meta). Letter spacing stays. Nothing else about the type changes. |
| A3.2 | Minimum 44px height on footer links, search and filter chips, "Share your story", story share pills and the Been here / Want to go pills. Padding, not font size. |
| A3.3 | Measured at 390px on the 13 October export before and after (this container cannot load the live site): counts of text under 12px and targets under 44px per page in the test report. |

## A4 "Tell the editor" widget

Today: a mailto button in normal flow at the end of the page, offset off the left edge, hidden under the cookie banner by `tll-fbk-place-v1.js`.

| # | Change |
|---|---|
| A4.1 | A Webflow form "Tell the editor" in the site footer component: note (textarea, required), email (optional), page URL (hidden, filled by script). Submissions land in Webflow Forms and in your notification email. No new service. |
| A4.2 | Fixed bottom left: `left: calc(16px + env(safe-area-inset-left))`, `bottom: calc(16px + env(safe-area-inset-bottom))`, z-index 60 (cookie banner stays at 70), pill 44px, card `max-width: calc(100vw - 32px)`, card height capped at the viewport minus insets with internal scroll. |
| A4.3 | Hidden while the consent banner or preferences are open (existing rule, kept). |
| A4.4 | Copy from the prototype: pill "Tell the editor"; eyebrow "TELL THE EDITOR · {page}"; title "Spot something? Send a note."; placeholder "A typo, a wrong flag, a story that needs a look."; email placeholder "Email, if you want a reply (optional)"; label "GOES TO NANCY'S DESK"; button "Send"; done state "Thanks. It lands on the editor's desk this morning." |
| A4.5 | Keyboard: the pill is a button with `aria-expanded`, Escape closes, focus returns to the pill. Press scale .97, 150ms, none under reduced motion. |
| A4.6 | The old mailto button and `tll-fbk-place-v1.js` are removed once the form is live (remove before add, same publish). |

## A5 Story Article JSON-LD (already made as an unpublished edit)

| # | Change |
|---|---|
| A5.1 | The Article block now lives in the Stories Template head code, where CMS tokens resolve (the canonical link there already uses one). Bound per story: headline (the writer's headline), description (excerpt), image (hero), datePublished and dateModified (published date), author as a Person with /contributors/{slug}, url and @id as the story's own URL, breadcrumb. The page schema setting, which rendered blanks, is cleared; the old value is saved in the repo. |
| A5.2 | Not carried over from the old block: abstract, keywords (hashtags) and the SEO title as headline. Say if you want keywords back. |

## A6 Byline link in served HTML

| # | Change |
|---|---|
| A6.1 | The author row link (`st3-author-link`) gets its href bound to the contributor's collection page instead of the static /contributors plus a script. The link is then in the HTML before any script runs. |

## A7 Country and pursuit links on the story template

| # | Change |
|---|---|
| A7.1 | New Stories field `countries` (multi-reference to the Countries hub collection, one of the two free slots). Backfill from each story's current Country reference by matching slugs (Spain to spain, and so on). The old reference stays for the map feature. |
| A7.2 | Under the author row, one line: "From {City}, {Country}" where the country is a link to /countries/{slug}, then "· {Pursuit}" linking to /pillars/{slug} when a pillar is set. Rendered by Webflow collection bindings, not script. |

## A8 Sitemap

| # | Change |
|---|---|
| A8.1 | Visits Template (6a0cbca9d776c205f45f5355) excluded from the sitemap and set to noindex, so /visits/nancy-carleton-luxembourg-city-2026 leaves the sitemap. |
| A8.2 | Marathon diaries with a future date (Tokyo 2027): your ruling, public or not. Nothing changes until you say. |

## A9 Redirects (your clicks, the API has no redirects endpoint)

| # | Change |
|---|---|
| A9.1 | /destinations → /stories. Webflow 301 targets cannot carry a #by-place fragment reliably, so the footer link points at /stories#by-place and the redirect at /stories. When the By place view ships in the library build, both point at it. |
| A9.2 | Publish /creators (draft 6abd0c6f30f767558eb3782b, "Creators · Travel creators on TLL"), then 301 /for-affiliates → /creators. |
| A9.3 | Pending from earlier rulings, same screen: /share → /submit, /gallery → /the-layover-lounge, /pets → /the-paw-passport. |
| A9.4 | The two guide pages (Copenhagen stopover, EES and ETIAS) are out of the footer in A2.8 and stay draft. Publish or drop is yours. |

## Test report with this packet

Screenshots at 1440 and 390 of home, one story, /travelers and the footer against the matching prototype frames; before and after counts for A3; the widget submission landing in Webflow Forms; one story's served HTML showing the byline, country and pursuit links; Rich Results Test on one story once published.

## Open for you

1. Nav: Log in and Sign up both in the bar, or Sign up only in the drawer.
2. Footer drops in A2.8, especially Instagram, Newsletter and LinkedIn.
3. Keywords in the Article schema (A5.2).
4. Marathon diaries (A8.2).
5. Redirect target for /destinations (A9.1).

Reply with the line numbers to approve or change. Packet B (home) gets its own log after this one.
