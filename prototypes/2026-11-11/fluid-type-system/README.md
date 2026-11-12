# Fluid Type System

A fluid type system for TLL as CSS custom properties (`type-system.css`, heavily commented) and a specimen page (`index.html`) that uses the same file inline. Open `index.html` and drag the window: the dark bar at the top reads the real computed sizes off the page as you resize. Mock-up only: nothing here is loaded by the live site.

Screenshots: `shot-390.png` and `shot-1440.png` (full page, 2x).

## Files

| File | What it is |
| --- | --- |
| `type-system.css` | The system. Faces, fluid steps with the slope and intercept math in comments, rhythm, measures, aliases, base rules, role classes. |
| `index.html` | The specimen, built from the files below. One document, everything inline. |
| `template.html`, `build.cjs` | `node build.cjs` writes `index.html`: it inlines the CSS twice (once as the live style, once escaped in the code panel), the story data and the photo, and computes every number shown at rest from the CSS or the data. |
| `stories.json` | The 57 live stories (title, slug, place, contributor, minutes, date), copied from the intent-tags prototype, which took them from smart-omnibar's November 12 check against the live pages. |
| `antarctica-hero.jpg` | The Antarctica story's own hero, downscaled to 900 px, 54 KB. |
| `check.cjs` | The Playwright check that made the screenshots. |

## How the brief is met

- **Custom properties.** Three faces (`--tll-face-display`, `--tll-face-text`, `--tll-face-mono`), ten size steps (`--tll-step-display-xl` down to `--tll-step-meta`, plus `story` and `data-l`), line heights, tracking, weights and measures, then semantic aliases: `--tll-cover-title`, `--tll-story-title`, `--tll-section-title`, `--tll-story-subhead`, `--tll-card-title`, `--tll-deck`, `--tll-story-body`, `--tll-ui`, `--tll-caption`, `--tll-eyebrow`, `--tll-data`, `--tll-data-l`. Each alias also has a role class (`.tll-type-story-title`, `.tll-type-eyebrow`...). Base element rules are scoped to `:where(.tll-type)` so they carry no specificity and cannot leak into pages that have not opted in.
- **clamp() from 360 to 1920.** Every fluid step is `clamp(min rem, intercept rem + slope vw, max rem)` with slope = (max - min) / 1560 and intercept = min - slope x 360, written out per step in the comments.
- **Accessible to zoom.** Every term is rem except the vw slope, so the reader's font setting and browser zoom both reach the size. Every step keeps max at or under 2.5 x min, so zooming to 500% always reaches at least 2x the normal size (WCAG 1.4.4). The page's width calculator recomputes that check at any width; all ten steps pass at every width checked.
- **Drama between serif and mono.** Playfair 800 runs from 46 to 112 px; JetBrains Mono data sits at 12 to 13 px (16 to 22 px for figures meant to be read from across a room), uppercase, tracked 0.12 to 0.14em, with tabular figures.
- **Without breaking paragraphs.** Headlines use `text-wrap: balance`, `overflow-wrap: break-word` and a ch cap; paragraphs use `text-wrap: pretty`. The "Longest title" button sets the 109-character Balkans title in every display step; no sideways scroll at 360, 390, 1440 or 1920.
- **Story body 18 px / 1.65, 60 to 75 characters.** Story body is fixed at 1.125rem. The measure is `52ch`, which I calibrated in Chromium: a Plex Condensed "0" at 18 px is about 9.7 px but the average story character is about 7.3 px, so 52ch (505 px) holds 66 characters on average (59 to 73) on the real Antarctica text. The page counts characters per rendered line live and says so under the text. On phones the screen, not the cap, sets the line (about 45 characters at 390), and the counter says that too.
- **Brand fit.** Three faces only, Playfair 800 and 800 italic only, -0.01em display tracking, nothing under 12 px (checked on every text element at four widths), one rose italic word per headline.
- **Real titles and data.** "Whiskey on 10,000-Year-Old Ice and Chasing the Impossible: The Antarctica Marathon" is real (Nancy Carleton, 12 min), so it is the cover and story-page specimen. Technical data is all from the site: 12 MIN and 4 MIN read times, 42.2 KM from the story, 35 KG (Magnus), 23 KG (the /for-expats line), 12.17° N 68.99° W (the home cover) and 38.98° N 1.43° E (Chesney Lish's Ibiza line on the home page), and the two layover guides as CPH · 6 H and SOF · 3 H.
- **Mapping table.** Every font variable in the repo (`--h3-*`, `--st3-f-*`, `--ct3-*`, `--s3-*`, `--ds3-*`, `--pf3-*`, `--pr3-*`, `--mg-*`, Webflow's `---font--heading-font`) maps to the three face tokens; I checked they all hold identical values, so that part is a rename. Size rows list today's hard-coded rules (tll-v9-type-v1, tll-mag-story-v1 in site layers v16, home3.css, the home guides embed) with what moves.
- **Live width readout.** Sticky bar: window width, 1 rem, story title, deck, story body and measured characters a line, updated on resize. Each scale row also shows its live size and, under "Show the math", the arithmetic at your current width.

Things to click: Try another real title (random pick from the library), Longest title, Shortest title, Back to the specimens; the width slider, number field and width chips; Show the math on each step; Outline the measure; Copy the CSS (falls back to selecting the code if the clipboard is unavailable, as it is on file://).

## Departures from the brief's wording

- **"Luggage tags."** The kit rules out luggage-tag styling, so airport codes get the same plain Mono data treatment as everything else (CPH · 6 H).
- **"Bag weights."** TLL has no bag-weight data; the one real figure is the /for-expats line "Your checked bag is 23 kg of snacks from home", quoted with its source.
- **"Scales effortlessly ... massive pro monitor."** Sizes stop growing at 1920. Past that, line length and headline size hold, which is what keeps paragraphs intact on a wide monitor.
- **Story title accent.** The cover specimen sets "Impossible" as the one rose italic word. The words of the title are unchanged.
- **Photo alt text.** The site's alt text for the Antarctica hero uses a word on the never-use list for the boat in the bay; here it reads "a vessel at anchor". The rest of the alt text is the site's own.
- No "Free Forever" text appears, so that rule did not come up.

## Second-pass review (November 12)

A reviewer went over the page at 390, 768 and 1440 and changed:

- The sizes table listed `--tll-measure-story` as 62ch; the stylesheet says 52ch. The table now matches.
- The Sort Sol sample was captioned "the opening line"; it is the story's deck, and now says so. The story-page lead no longer calls its paragraphs "the opening", because the published story starts with the Drake Passage lines, which the page skips.
- Dates read the US way (November 12, 2026), on the page and in the CSS comments.
- The readout bar and the corner link now sit in landmarks (axe flagged both), the minutes list links are 44px tall, the empty width field keeps its last value instead of jumping to 360, "Back to the specimens" carries its arrow, and the inside/outside verdict under the story keeps its color.
- Two copy fixes for the voice rules: the intro fact line had three items and the face line was a mirrored pair.
- Layout: a title specimen and its meta line no longer touch, and on tablets the cover photo stops at 480px instead of filling the screen.

axe-core 4.10 reports nothing at 390, 768 or 1440; computed contrast passes everywhere; nothing scrolls sideways.

## Real and SAMPLE

Everything shown is real: titles, places, contributors, minutes and dates from the live library; the deck, story paragraphs and site lines are quoted verbatim and link to where they live; library counts (57 stories, minutes, contributors) are computed from the data in the page. The one photo is the Antarctica story's own hero, credited "Photo: Nancy Carleton" and linked to the story. Nothing needed a SAMPLE label.

## Moving it onto the real site

Production is plain CSS, no Tailwind and no new script:

1. Add the `:root` block (sections 1 to 5 of `type-system.css`) to the site-wide head code or the next `tll-site-layers` style block. It is about 2 KB minified and takes no script slot under the 15-script cap.
2. Rename, template by template: `var(--h3-head)` and its siblings become `var(--tll-face-display)` and so on. Keep the old names as aliases (`--h3-head: var(--tll-face-display)`) for one release so nothing breaks mid-rename.
3. Replace the hard-coded sizes in the order of the mapping table, story title first. The tll-v9-type-v1 rules use `!important` and -0.035em tracking; they should be retired, not overridden.
4. Role classes (section 7) can become Webflow classes of the same name if the Designer should use them; the `:where(.tll-type)` base rules only matter if a page opts in with that class.

## For Nancy to decide

1. **The home cover headline.** Today it runs to 148 px. The system stops at 112 px, because 148 over a 46 px floor breaks the zoom rule. Keep a cover-only exception, or accept 112?
2. **Section titles.** Today's generic h2 runs 34 to 64 px. The system puts section titles at 28 to 48 so they sit a step under the story title. Smaller, or keep them big?
3. **Story subheads.** Today 28 px fixed; here 28 on phones growing to 42 at 1440. More drama, or keep them fixed?
4. **Tracking.** The live h1 and h2 rules use -0.035em and -0.025em; the kit says -0.01em, and this system follows the kit. Confirm the kit wins.
5. **The 680 px story column.** At 18 px it holds about 91 characters a line, over the kit's 75. The magazine layer's real column may differ; worth a look on a live story at desktop width.
