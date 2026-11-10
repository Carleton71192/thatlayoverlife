# Week-one quick wins (Prompt 2): recheck and change log, started 10 November 2026

Session: cloud Claude Code session_01GTTttGvX2VTwovAB2g1cLf. Prompt: claude/tll-fix-sequence-2026-11-09.md, PROMPT 2. Nothing published by the session; Nancy publishes.

## Status by item

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1 | Type and component system | staged (layers) | 16.52.0: magazine cover and story layers on Playfair 800, Plex and JetBrains Mono; the Newsreader and Inter Tight requests gone; one button set (tll-buttons-v1: filled rose #D63859, outlined ink, text link; square corners). Webflow Styles remap and the Project settings font list stay Designer steps for Nancy (list below). |
| 2 | Scroll-reveal | staged | tllReveal 1.2.0 registered and applied: 250 ms, from 0.6 and 8 px, 10% in view, reduced motion honored. Measured: landing opacity 0.6 (was 0.01), settled 300 to 420 ms (was 830 to 1,145). |
| 3 | Counts | staged | /stories H1 now reads the same sitemap tally as the home label ("57 stories, all worth the detour."); home reads "6 STORIES HERE · 57 PUBLISHED SO FAR" with the new build. How "places" is counted is in claude/tll-p0-recheck-2026-11-09.md for Nancy to decide; logic unchanged. |
| 4 | Images | investigating | Audit rerunning (the first agents ran out of credits). |
| 5 | Library | staged | Featured slot editor-picked (live since 10 Nov); search input 248 px at 390; the repeating photo strip (.tll-ph-row) hidden by 16.52.0. |
| 6 | Index countries with stories | staged | 43 country items with a live story switched into the sitemap (Brazil and Argentina included), which also lifts Webflow's static noindex; 49 indexable country pages after publish. /countries 301 live. Footer Destinations link now /destinations (staged). |
| 7 | Hubs for orphans | investigating | Build spec rerunning with a critic pass; only one diary is live after the 9 Nov privacy unpublishes. |
| 8 | Travel Wire | staged | noindex (since 16.51.0), out of the sitemap (page setting, staged), not in the nav, no ad units (ads run on story, library and country pages only). |
| 9 | Hygiene | staged | 16.52.0: unique stamp ids in the cover and story layers (no duplicate ids found on six pages at two widths), 2px rose focus-visible ring with 2px offset, Tell the editor steps aside when the footer is in view, /travelers count line and search note agree and the pets link lands on Travel companions. |

## Change log

| Where | Change | Rollback |
| --- | --- | --- |
| Site scripts | tllReveal 1.2.0 registered, applied to the site footer in place of 1.1.0 | add_site_script tllreveal 1.1.0 |
| /travel-wire page settings | includeInSitemap false | includeInSitemap true |
| Site scripts | tllsitelayersv16 16.52.0 (pin bea20eb) applied to the site header in place of 16.51.1 | add_site_script tllsitelayersv16 16.51.1 |
| Countries collection | includeInSitemap true on 43 items with a live story | same call with false |
| TLL Site Footer component | Destinations link /stories#by-place to /destinations | set_link /stories#by-place |

## Designer steps for Nancy (item 1, the part code cannot do)

The layers now speak Playfair Display 800, IBM Plex Sans Condensed and JetBrains Mono. The Webflow styles underneath still name older families, and the site head keeps aliases so nothing breaks while they remain. Do these in order.

1. **Site settings, Fonts.** Remove Teko and the duplicate IBM Plex Sans Condensed entry. Add Playfair Display 800 and 800 italic and JetBrains Mono 400 and 600 as project fonts. Teko is the one family the repo cannot remove; it still loads five faces on every page.
2. **Styles panel, Variables.** Heading font Teko to Playfair Display. Body font DM Sans to IBM Plex Sans Condensed. Display font Recoleta and DM Serif Display to Playfair Display. Wordmark font Druk Wide to Playfair Display, unless a wordmark element is set in Syne.
3. **Style Manager, classes.** The shared stylesheet still names DM Sans in 251 rules, Recoleta in 71, Inter in 42, DM Serif Display in 38, Druk Wide in 8 and Dancing Script in 6. Body and UI classes go to Plex, display classes to Playfair 800, eyebrow classes to JetBrains Mono.
4. **Button classes.** Set radius 0 and Plex 16px on .tll-btn, .tll-btn-ghost-rose, .tll-cta-rose, .tll-cta-ghost, .tll-library-news-submit, .tllsb-btn, .tll-place-btn and .tll-story-share-link. Remove uppercase from the two CTA classes. Delete the 6px and pill button variants once nothing uses them.
5. **Display tracking.** Set the display heading classes to -0.01em letter-spacing; the Paw Passport h1 is at -0.035em today.
6. **Nav component.** Its links are DM Sans by class and its buttons are 999px and 6px pills; the site code restyles them, but the component should match once Nancy edits it.
7. **Only after steps 2 to 4:** tell the session, and it removes the alias font block from the site head (lines 157 to 168) and the three legacy font names in the head and /stories code. Doing this first would drop 251 DM Sans rules to system fonts.

## Measured with 16.52.0 swapped into the live pages (10 Nov, before publish)

| Check | 390 | 1440 |
| --- | --- | --- |
| Duplicate ids on home, /stories, /travelers, /the-map, /travel-wire, a story | none | none |
| Horizontal scroll on the same six pages | none | none |
| h1 face | Playfair Display 800 | Playfair Display 800 |
| Home count label | 6 STORIES HERE · 57 PUBLISHED SO FAR | same |
| /stories H1 count | 57 stories, all worth the detour. | same |
| Keyboard focus ring | 2px solid rgb(200,50,91), 2px offset | same |
| Repeating photo strip on /stories | hidden | hidden |

Fonts actually fetched after the change: Playfair Display, IBM Plex Sans Condensed and JetBrains Mono from Google, plus Teko from Webflow's own font loader. The other names in the browser's font list (DM Sans, Syne, Recoleta, DM Serif Display, Inter) are aliases pointing at the Plex and Playfair files, so they add no download.
