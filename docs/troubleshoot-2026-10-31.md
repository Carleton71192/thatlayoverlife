# Site troubleshoot, 31 October 2026

The live site cannot be reached from the build environment until the domains are allowed (Monday), so this round checks the CMS data directly and runs every page test against the code that is live (site layers 16.27.0). The live crawl (every route, Lighthouse, axe, links, forms) follows on Monday.

## Tests

| Test | Result |
|---|---|
| Worker (saves, intake, link previews, translation, site stats, expats map, More links) | 237 of 237 |
| Every layer on saved copies of /edit-profile, /for-expats, /travelers, home, /the-map, /stories at 390 and 1440 | 36 of 38 (the two are the /edit-profile tab row scrolling sideways in the saved copy, same without the new code; recheck live) |
| /submit gallery and autosave | 31 of 31 |
| /submit captions and placement | 14 of 14 |
| /submit ending check and instant set-up hand-off | 12 of 12 |
| Story captions on the saved Pantanal page | pass |
| Expats map on the saved /for-expats page | pass, both widths |

## CMS data (58 live stories)

Every live story is Published, has a cover photo, a writer, a region and a place line. Findings:

- Three excerpts run past 240 characters (cards cut them): Eat, Drank, Relax, Be Happy; Te Amo, Velho; A Boot Scootin' Eclipse.
- Two 1-minute reads: Even Brave Boys Get Scared (Jay's, short by design) and Horseshoe Bend (now off the home shelf).
- Aruba and Curaçao story has no country hub: the Countries collection has no Aruba or Curaçao (territories). Add them, or leave it.
- Roberta's story keeps her em dashes (her words; the house rule applies to house copy).
- False alarms checked: Ninja Duckies ends on its sign-off; the Thailand link-out body is its summary.

## Fixed earlier today

Nancy's /travelers links (Directory record), Spain and Italy country text, Luke's photo alt text, Roberta's theme and Italy page.

## Waiting

- Worker deploy (git pull, npx wrangler deploy): instant set-up, Lounge photos, expats map, More links, save retry, site stats.
- The daily report task needs its connectors (Webflow, Notion, Gmail, Memberstack) added in claude.ai.
- Domains allowed Monday: live crawl, Lighthouse, axe, link check, rotating cover photo review.
