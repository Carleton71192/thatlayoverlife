# Copy audit, 31 October 2026 (Phase A of the voice refresh)

This is a sheet for Nancy to approve row by row. Nothing has been applied to the site, Webflow or the repo code.

- `copy-sheet.csv`: 1512 rows, one per unique user-facing string. 523 rows propose a change; the other 989 are marked "Keep" so you can see them and approve them as they are. 1202 rows are marked fun, 310 serious. 5 rows propose removing internal text that shows to visitors.
- Fill in `approved` with `yes`, `no`, or your own wording. Leave it empty to skip.

## How the sheet was built

1. **Sources, as the brief listed them** (the sandbox can't reach the live site):
   - Tonight's saved site-wide and page code: `scratchpad/p0-1031/before/` (site head and footer, home, stories, story template, map, contact, support, my-passport).
   - Browser layers: `src/site-layers/*.js` and `*.html` (the `tll-site-layers-v*.js` bundles and the build scripts were skipped), plus `src/site-layers/v9-1` and `v9-b`.
   - Components: `src/components/**` (tests, "before" files and the built `tll-quick-log-v1.js` were skipped; its `.src.js` was used).
   - Magazine: `cover-build/tll-mag-cover-v1.html` and `story-build/tll-mag-story-v1.html`.
   - Saved page embeds: the newest "after" or "live" file per page under `src/pages/**` (for example `home/live-2026-10-28/embeds`, `edit-profile/live-2026-10-28/after`, `submit/v5`, `the-map/v3/passport-embed.src.html`) and `src/seo/live-2026-10-28/**`. "Before" files and fixtures were skipped.
2. **Extraction.** A script pulled visible HTML text, `placeholder`, `aria-label`, `title`, `alt` and button values, plus string literals from inline and layer JavaScript. That gave about 2,400 candidates.
3. **Hand review.** I removed what the brief excludes: story titles, story bodies, photo alt text that describes story photos, member names and bios, CSS, code comments, URLs, and key names. I also removed country, month and number-word lists, brand names (Instagram, Strava…), schema.org types, the owner-only investor metrics panel and the editor-only "Editor desk" and "Style guide" headers. Then I de-duplicated by exact text: if a string shows on several pages, the first page owns the row and the notes say "Also on …".
4. **Strings built in code.** When code assembles a sentence (`'No stories from '+place+' yet.'`), `current_text` shows the literal words exactly as written, with the variable as `{place}`. When a headline is split across two elements (the italic rose word sits in its own `<em>`), `current_text` joins the visible text. The notes flag all 27 rows whose text was pieced together this way.
5. **Rewrite.** Each row follows the seven voice rules. In `proposed_text`, the italic rose word is marked with `*asterisks*`. Word counts ignore arrows, dots and asterisks; `{variables}` count as one word.
6. **Repo moved during the audit.** New commits landed at 18:37 today (16.49.0: "What a story is", trip deck line, travel-style question). I extracted again and added or updated those rows. The "What a story is" copy was approved by Nancy today, so those rows are almost all "Keep".
7. **Self-check.** I searched `proposed_text` for em dashes, `!`, `ship`, `ledger`, `#`, "No filler", "Truth over polish", "real names", "Currently in", "Sao Paulo" without the tilde, and common UK spellings (tick, queue, colour, travelled, labelled). Nothing banned is left. Headlines with an italic word are all under eight words; empty states are within 15 words and cards within 20.

## Counts by page

| page | rows | rows with a change |
|---|---|---|
| Submit | 292 | 82 |
| Account | 236 | 71 |
| Home | 151 | 65 |
| Edit profile | 126 | 48 |
| Story | 93 | 21 |
| The Map | 82 | 26 |
| Share card | 65 | 23 |
| Paw Passport | 56 | 15 |
| For expats | 55 | 23 |
| Travelers | 52 | 30 |
| Site-wide | 49 | 29 |
| Profile | 42 | 15 |
| Share photos | 32 | 16 |
| Onboarding | 29 | 5 |
| Stories | 26 | 11 |
| Country | 26 | 10 |
| Work trips | 21 | 7 |
| Directories | 13 | 6 |
| About | 12 | 3 |
| Sign in | 12 | 3 |
| Destinations | 7 | 4 |
| 404 | 4 | 2 |
| Support | 3 | 1 |
| Lounge | 3 | 1 |
| My pets | 2 | 1 |
| Pets | 2 | 0 |
| For press | 2 | 0 |
| Contact | 2 | 0 |
| Password reset | 2 | 1 |
| Privacy and terms | 2 | 1 |
| Cookies | 2 | 0 |
| Awards | 2 | 1 |
| For brands | 2 | 0 |
| Spotlight | 1 | 1 |
| Creators | 1 | 1 |
| FAQ | 1 | 0 |
| Charter | 1 | 0 |
| House rules | 1 | 0 |
| Travel Wire | 1 | 0 |
| Guide | 1 | 0 |
| **Total** | **1512** | **523** |

"Page" means where a visitor sees the string first. Page headers (the one-liner and status under each page title) are filed under their own page.

## The 25 highest-impact rows

These are the most-seen strings: site-wide chrome, the consent banner, the home page and the save buttons on every story. Approve these first.

| # | id | where it shows | current | proposed |
|---|---|---|---|---|
| 1 | TLL-0001 | Header, every page | Share your story | Spill your trip |
| 2 | TLL-0314 | Join buttons across the site | Join free | Join free |
| 3 | TLL-0008 | Search box, every page | Search a country, a layover, a feeling… | Search a country, a layover, a mood… |
| 4 | TLL-0021 | Consent banner, first visit | We use cookies | Cookies. Sadly, not the *snack* kind. |
| 5 | TLL-0022 | Consent banner, first visit | We use necessary cookies to run the site, and optional analytics cookies to understand traffic and improve. You choose what to allow. | We use necessary cookies to run the site. Analytics cookies are optional and help us see what's working. You choose. |
| 6 | TLL-0014 | Masthead | Written by the people who went. Travel stories from members around the world, edited in Copenhagen. | Real trips. Real people. Questionable airport naps. Edited in Copenhagen. |
| 7 | TLL-0013 | Footer counter, every page | countries in our stories | countries in our stories so far |
| 8 | TLL-0016 | Footer | Every byline a real person. | Every byline is a real person. Yes, even the dog. |
| 9 | TLL-0257 | Home cover | Real places and real opinions, written by the people who went. Free to join, no card, no paywall. | Real trips. Real people. Questionable airport naps. Free. No card. No catch. |
| 10 | TLL-0158 | Home | Trips that can’t wait for payday. | Trips that can’t wait for *payday.* |
| 11 | TLL-0118 | Home join band | Free, forever. No card, no paywall. | Free. No card. No catch. We checked. |
| 12 | TLL-0116 | Home join band | Build your free map | Start your free map |
| 13 | TLL-0120 | Home dashboard band | Every place you have been, in one spot. | Everywhere you've been, *finally* in one spot. |
| 14 | TLL-0054 | /stories header | {N} stories, all first-hand. More landing weekly. | {N} stories, all first-hand. More landing weekly. |
| 15 | TLL-0077 | /the-map header | Rose means been there. Blank means working on it. | Rose means been there. Blank means working on it. |
| 16 | TLL-0313 | End of every story | Start your free map. | Start your map. Brag *responsibly.* |
| 17 | TLL-0298 | Every story (save) | Saved to your lists | Saved. Your lists just got longer. |
| 18 | TLL-0300 | Every story (save) | Could not save. Try again. | That didn't save. Not you, us. Try again? |
| 19 | TLL-0011 | Share toast, site-wide | Link copied | Link copied. Go paste it somewhere fun. |
| 20 | TLL-0097 | Sign in / join header | Free to join. Free forever. | Free. No card. No catch. We checked. |
| 21 | TLL-0390 | /the-map, new members | Your map starts empty. Click a country to log it, or search the list. | Your map looks a little homesick. Add one place. |
| 22 | TLL-0082 | /submit header | Reviewed within 48 hours by a human. | Tell us when it went *sideways.* |
| 23 | TLL-0051 | 404 | Nowhere | This page took a different *connection.* |
| 24 | TLL-0209 | Home Paw band | The EU pet travel guide. No surprises at the border. | Your dog needs paperwork. We did the paperwork on the paperwork. |
| 25 | TLL-0047 | Spotlight cards | OPEN SLOT | YOUR TURN |

## Things to decide before applying (they come up in several rows)

- **48 hours or instant?** The site promises "Reviewed by a human within 48 hours" in several places (site head swaps, /submit header, Country empty state, submit help). The new Submit v5 says "Goes live when you send. No waiting for approval." The proposals take the timing claim out until one promise is picked. Rows: TLL-0032, TLL-0033, TLL-0082, and the submit, country and intake rows marked CHECK.
- **Visited or Stayed?** The map says Lived / Visited / Layover; account, onboarding and the profile say Lived / Stayed / Layover. The sheet proposes "Stayed" everywhere (TLL-0384).
- **195, 193 or 249?** The old /my-passport counter says "of 195", the /destinations header says "193 TO STAMP", and the map counts 249.
- **Banned words in live text.** "OPEN TO PARTNERSHIPS" (profile badge and edit profile), "the day it ships" (share card), "currently in" (share card), and the `#layover #montenegro` placeholder are all live today. The rows replace them.
- **Directory toggle names.** The /creators sample cards say "I'm an expat", "I'm a creator" and "I'm press". Edit profile now calls them Live there, Make things and Press.
- **Translations.** The story translate bar has Spanish, Portuguese and Danish copies of the English lines (`tll-story-translate-v1.js`). Only the English is in the sheet; re-translate any English change you approve.

## Limits: what this sheet can't see

Strings typed straight into Webflow Designer elements aren't in the repo, so they couldn't be read from here. Page code only overrides a few of them (for example the "Six doors" italic word on /support). The pages most likely to have strings that aren't in this sheet:

1. **Home**: the hero headline and subhead, the nav labels, and the footer columns and links (the footer component in the repo only holds the report form).
2. **Contact**: the whole page, including the message form that opens from profiles. Its labels, limit message and success or fail text are all Designer elements; only the code is in `contact-head.html`.
3. **Support**: the Layover Club section, the "doors", the Ko-fi buttons and the price line.
4. **About**: the body copy (only the live counters are in code).
5. **FAQ, Charter, House rules, Privacy and terms, Cookies**: all long-form Designer text. The rule in the brief (serious stays serious) matters most here.
6. **Sign in, join and password reset**: Memberstack modals and their default messages (only the custom field errors are in `au3-auth.js`).
7. **For brands, For press, Creators, Awards, Travel Wire, Destinations**: hero and intro text.
8. **404**: the page body (only the header strip is in code).
9. **Webflow form success and fail messages**: the default "Thank you! Your submission has been received!" breaks the no-exclamation rule wherever it hasn't been replaced.
10. **CMS fields**: country facts, guide pages and pillar descriptions are content in the CMS, not page code.
11. **Emails**: Memberstack, newsletter and story-live emails aren't in the repo.

The next step is a pass through the Designer (or a crawl of the live pages) to fill in these gaps before Phase B.
