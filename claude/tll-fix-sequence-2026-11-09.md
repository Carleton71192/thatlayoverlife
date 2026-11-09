# TLL fix sequence, by priority (9 Nov 2026)

The master runbook. Hand Claude Code one prompt at a time, in this order. Each prompt is self-contained; where a detailed prompt already exists in the project it is referenced rather than repeated. Shared rules for every prompt: read claude/tll-build-principles-2026-10-31.md and claude/tll-privacy-guardrails-2026-10-19.md first; nav and footer components untouched; counts bind to tllStates; type is Playfair Display 800 / IBM Plex Sans Condensed / JetBrains Mono / Syne wordmark only; US spelling; never "ship", "ledger", "no filler", "truth over polish"; Webflow drafts plus a change log; Nancy publishes; 390px checked before 1440px.

## PROMPT 1 · Launch blockers (privacy and legal)

Run exactly: claude/tll-p0-fix-prompt-2026-11-09.md (saved here as claude/tll-cc-blockers-2026-11-09.md). Six items: consent before ads, Cookie settings link, marathon diary flags, member-data templates off the public site, Ko-fi buy button, /contact relay form plus the Thailand stub, and the counts. Nothing else goes live before this is green.

## PROMPT 2 · Week-one quick wins (settings and copy, no decisions needed)

Paste this:

You are doing a one-pass cleanup of thatlayover.life in Webflow. Nothing here needs a design decision; it is settings, styles and bound data. Do all nine, verify each in a browser at 390px and 1440px, and stop before publishing.

1. Type and component system. In Webflow Styles, remap every class using Inter Tight, Newsreader, DM Sans, DM Serif Display or Druk Wide to the spec: headlines Playfair Display 800, body and UI IBM Plex Sans Condensed, eyebrows JetBrains Mono, Syne only in the wordmark. Remove the unused font families from Project settings. One button set: filled rose (#D63859 on ink text white), outlined ink, text link with arrow; all square corners; delete the 6px and pill variants. Report the classes changed.
2. Scroll-reveal. Every reveal interaction: duration 250ms, start opacity 0.6 and 8px translate, trigger at 10% in view, honor prefers-reduced-motion (no animation). Nothing may start at opacity 0.
3. Counts. Homepage "6 STORIES HERE · 58 PUBLISHED SO FAR" and /stories "Fifty-seven stories" bind to tllStates. Map header "Countries 89 / 90 of 249 places": report how "places" is counted (countries plus territories plus Antarctica?) so Nancy can decide; do not change the logic. Footer and homepage must agree.
4. Images. Responsive images on; alt text bound to the CMS caption or title field; no image served above 2x its display width.
5. Library. /stories featured slot becomes an editor-picked CMS switch (default: newest Nancy or editor story). Search input visible and usable at 390px. Cut the photo strip that repeats the grid.
6. Index what deserves it. Every /countries/* page with at least one story is indexable (Brazil and Argentina first). /countries 301 to /destinations. Footer "Destinations" link goes to /destinations.
7. Hubs for orphans. Create /layovers (hub for the two layover guides, grid of guide cards, one intro paragraph in brand voice, "Layover guides" chip on /stories) and /marathon-diaries (same pattern, two diaries) using the existing country-page template styling. Add a "Layover guides" row to the homepage library chapter.
8. Travel Wire. Set /travel-wire to noindex, remove it from the sitemap and nav, keep the page for members. No ad units on it.
9. Hygiene. Fix duplicate IDs on the homepage map graphic (tll-mg-ink, -top, -bottom). Add :focus-visible 2px rose outline, 2px offset, on links and buttons site-wide. Hide the "Tell the editor" pill when the footer is in view. Fix /travelers filters so results match the selected filter.

Done when: Lighthouse mobile (incognito, Copenhagen) on home, a story and /the-map reports Performance 80+, Accessibility 95+; no page loads more than four font families; every count on home, /stories and footer matches; /layovers and /marathon-diaries return 200 and are linked. Write claude/tll-week1-recheck-<date>.md with before/after Lighthouse, the font families before/after, and the change log.

## PROMPT 3 · Week two: the product pages (needs Nancy's picks)

Paste this, after Nancy has chosen the New Orleans photo order, the map hero copy and the first three Location Experts:

You are rebuilding the four pages that carry thatlayover.life: the story template, The Map, /submit and the receipts system. Follow claude/tll-design-review-2026-11-09.md for specifics. Stop before publishing.

A. Story template (the product).
- Opener: full-bleed cover with the washi place label and flag, title in Playfair 800 with one italic rose accent word, dek, byline linking to the contributor page, reading time. Breadcrumb moves above the cover in Mono.
- Body column 560px, 18px IBM Plex Sans Condensed, line-height 1.65 (62 to 66 characters). H2s in Playfair 800 at 32px.
- Captioned photos in the flow every 4 to 6 paragraphs from the CMS image fields (Nancy supplies order for New Orleans; default order for the rest is CMS order). Figcaption in Mono: place, then "Photo: Name". One pull quote per 1,500 words in Playfair italic, chosen from the CMS "pull quote" field; empty field renders nothing.
- Receipts block stays, then "Read next": three cards bound to same country, then same category, then newest; then the author card; then the submit nudge. No empty "Keep reading."
- "Been here / Want to go" buttons stay and log to the member's lists.
- Lightbox on every in-flow photo, full resolution, caption and credit.

B. The Map as the hero of the core loop.
- Logged out: the sample globe renders above the fold with "Start your free map" (filled rose) and "See how it works" (text link). No "Sign in" as the primary. Pins link to stories and country pages.
- Logged in: the member's globe above the fold, counter bound to their data, "Edit my destinations" only when logged in.
- "Open full screen" either opens a true full-viewport map view or is removed; an anchor scroll is not full screen.
- Homepage map chapter: the globe is the first thing in the chapter, the headline second.

C. /submit as the contributor deal.
- Implement workstream 1 and 2 of claude/tll-sponsor-contributor-deal-build-prompt-2026-11-09.md (saved here as claude/tll-sponsor-contributor-2026-11-09.md): the Site facts collection, the logged-out deal page, canonical field, contributor pages with Person schema, noindex on empty contributor pages.

D. Receipts as the brand.
- Implement workstream 5 of the same prompt: receipts strip on cards and search results, "Human edited" mark, Article schema with author, dates, publisher, image, citations and sponsor.

E. One gated-page template.
- /account, /profile, /submit (form), /share-photos, /signup, /login, /forgot-password share one layout: H1, one-line purpose, "Join free" filled, "Log in" outlined, a picture of what you get, "Free. No card. 16+.", real labels, inline errors.

Done when: New Orleans reads as a magazine feature at 390px and 1440px with photos in the flow and a Read next rail; /the-map logged out shows a working sample globe with a rose primary; /submit states the full deal before login; a story card shows the receipts strip; all seven gated pages use the one template. Write claude/tll-week2-recheck-<date>.md with screenshots and the change log.

## PROMPT 4 · Measure and harden

Run claude/tll-investor-readiness-build-prompt-2026-11-09.md (saved here as claude/tll-investor-readiness-2026-11-09.md), workstreams 1 (funnel and /ops dashboard), 3 (data map and member API), 4 (privacy as a build step) and 8 (release gate). Workstreams 2, 5, 6 and 7 are covered by Prompts 2 and 3 above; skip them unless the recheck finds gaps.

## PROMPT 5 · Revenue and sponsors

Run claude/tll-sponsor-contributor-deal-build-prompt-2026-11-09.md, workstreams 3 (sponsor kit: /for-brands, /for-press, media kit, example sponsored story) and 4 (photos as content: Lounge lightbox, credits, consent checkbox). Also: Trip Kit affiliate slot on story and guide templates, sponsored-story template, Paw Passport "Register your pet" primary and the three-step strip made clickable. Prices and photo choices are NANCY placeholders until she sets them.

## PROMPT 6 · Installable app

Run claude/tll-pwa-build-prompt-2026-11-09.md once Prompt 4's data layer exists.

## FROZEN until the /ops funnel has four weeks of data

Pursuit hubs, multilingual stories and translate toggle, business travel section, awards, Spotlight, Substack, ManyChat, Strava integration, national parks list, native app or store wrapper. Their prompts stay in the project; do not run them yet.

## Promotion gate

Promote after Prompt 3 is live and verified. Story-link posts on Instagram and LinkedIn and warm outreach to friends and would-be contributors are fine after Prompt 1. Press outreach, the guide push and any EU-wide traffic wait for Prompt 3.

## Decisions Nancy owes the sequence

- Ko-fi product URL for the €9 guide (Prompt 1).
- How "places" is counted on the map, once Prompt 2 reports it.
- New Orleans photo order and pull quotes (Prompt 3).
- Map hero copy, logged out (Prompt 3).
- First three Location Experts for Denmark and elsewhere (Prompt 3).
- Supabase or Cloudflare D1 for the data layer (Prompt 4).
- Three offer prices, two press photos, fictional sponsor name, 7-day republishing rule (Prompt 5).
- App icon direction (Prompt 6).
