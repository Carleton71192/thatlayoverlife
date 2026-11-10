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
