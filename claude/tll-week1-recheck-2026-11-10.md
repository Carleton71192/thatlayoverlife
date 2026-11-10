# Week-one quick wins (Prompt 2): recheck and change log, started 10 November 2026

Session: cloud Claude Code session_01GTTttGvX2VTwovAB2g1cLf. Prompt: claude/tll-fix-sequence-2026-11-09.md, PROMPT 2. Nothing published by the session; Nancy publishes.

## Status by item

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1 | Type and component system | in progress | Repo side (magazine layers, button set) being patched; the Webflow Styles remap and Project settings fonts list are Designer steps (list below once measured). |
| 2 | Scroll-reveal | staged | tllReveal 1.2.0 registered and applied: 250 ms, from 0.6 and 8 px, 10% in view, reduced motion honored. Measured: landing opacity 0.6 (was 0.01), settled 300 to 420 ms (was 830 to 1,145). |
| 3 | Counts | in progress | Home label already bound; /stories H1 count and the footer agreement being wired; "places" is reported in claude/tll-p0-recheck-2026-11-09.md. |
| 4 | Images | investigating | Audit running. |
| 5 | Library | partly done | Featured slot editor-picked (proven live 10 Nov); search input 248 px at 390 (7 Nov); the repeating photo strip being located. |
| 6 | Index countries with stories | investigating | /countries 301 is in the combined redirect file Nancy re-imports. Footer Destinations link: the packet names it, so it may be edited. |
| 7 | Hubs for orphans | investigating | Build spec in progress; note the diaries hub has only one live diary (two unpublished 9 Nov for privacy). |
| 8 | Travel Wire | staged | noindex (since 16.51.0), out of the sitemap (page setting, staged), not in the nav, no ad units (ads run on story, library and country pages only). |
| 9 | Hygiene | in progress | Duplicate map ids, focus-visible, Tell the editor pill, /travelers filters being patched. |

## Change log

| Where | Change | Rollback |
| --- | --- | --- |
| Site scripts | tllReveal 1.2.0 registered, applied to the site footer in place of 1.1.0 | add_site_script tllreveal 1.1.0 |
| /travel-wire page settings | includeInSitemap false | includeInSitemap true |
