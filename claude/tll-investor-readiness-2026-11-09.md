# Claude Code prompt: make TLL investor-ready (product readiness pass)

Paste into Claude Code with the Webflow MCP, Memberstack MCP, Cloudflare and GA4 access for thatlayover.life. Run after claude/tll-p0-fix-prompt-2026-11-09.md (launch blockers) and alongside or after the week-1 items in claude/tll-design-review-2026-11-09.md. The PWA prompt (claude/tll-pwa-build-prompt-2026-11-09.md) comes after this one, because the data layer here is what the app reads.

You are preparing thatlayover.life (Webflow, Memberstack, Cloudflare) for a seed raise of roughly $300k to $350k, mainly from US investors, with TLL and Paw Passport as two tracked divisions of one business (see claude/tll-paw-passport-adviser-brief-revised-2026-10-31.md). Read claude/tll-build-principles-2026-10-31.md and claude/tll-privacy-guardrails-2026-10-19.md first and follow them. Site contracts: nav and footer components untouched; counts bind to tllStates; type is Playfair Display 800 / IBM Plex Sans Condensed / JetBrains Mono; US spelling; never use "ship", "ledger", "no filler" or "truth over polish" in copy. Work in Webflow drafts and preview environments, keep a change log, and stop before publishing or spending: Nancy publishes and approves any paid service.

The brief from the investor lens, in one line: fewer pages, one funnel, one data layer, nothing live that is not finished, privacy as a build step. Eight workstreams follow. Do them in order; each has a definition of done.

## 1. One funnel, one dashboard

Investors fund slopes, not screenshots. Build the measurement before building features.

- Define the core loop as five events and fire them from the site: `signup_completed`, `first_country_logged`, `first_story_or_photo_submitted`, `story_read_complete` (75% scroll on a story page), `return_visit_30d` (derived). Add `guide_purchase_click`, `kofi_click`, `affiliate_click`, `install_prompt_shown`, `install_accepted`.
- Send them to GA4 (G-T1K83PRL1R) only after analytics consent, and in parallel to a first-party store: a Cloudflare Worker endpoint writing to D1 (or Supabase if Nancy prefers one vendor for the data layer in workstream 3). The first-party store is the one the dashboard reads, so the numbers survive ad blockers and consent declines are counted as "unknown," never dropped silently.
- Dashboard: one page, protected by Memberstack admin role, at /ops (noindex). Weekly active members, funnel conversion between each of the five steps, stories published by non-founder contributors, revenue events, and a 13-week trend line for each. Plain numbers, no vanity traffic as the headline (sessions can be bots; members and actions cannot).
- Done when: Nancy can open /ops on her phone and read last week's funnel in under a minute, and the numbers match a manual count in Memberstack and the CMS.

## 2. Finish or hide

Nothing live without its empty state, its error state and its call to action.

- Crawl every published page and CMS template. For each, record: purpose line, primary CTA, empty state, error state, and whether it is linked from nav, footer or at least one other page.
- Anything failing: either finish it this pass (if under half a day) or set to draft with a 301 to the nearest finished page. Known candidates: /for-expats expert directory (seed Nancy as Denmark expert or collapse the section), the three "Coming soon" expat cards (collapse to one line with a notify field), /pillars/* duplicates (merge into /stories and /the-paw-passport), /pets vs /the-paw-passport (merge), /travel-wire (TLL take per item, or noindex and no ads).
- Add a Webflow publish checklist to claude/tll-build-principles as a section: purpose, CTA, empty, error, linked, mobile-checked, privacy-checked.
- Done when: every 200 URL in the sitemap has a CTA and an empty state, and the sitemap has no duplicates.

## 3. Draw the data-layer line now

Do not rebuild. Decide where member data lives so the native app and the next platform read the same source.

- Inventory every place member data is stored today: Memberstack custom fields, Memberstack data tables, Webflow CMS collections (Visits, Bookmarks, Comments, Photo submissions, Press applications, Pet notes, Pets), localStorage in the map scripts, tllStates.
- Write claude/tll-data-map.md: each entity (member, country visit, layover, story, photo, pet, pet crossing, follow, bookmark), its system of record, its public/private flag, its retention, and who can read it. Flag every entity whose system of record is a Webflow CMS collection with a public template; those move.
- Stand up one small member API on Cloudflare Workers backed by D1 (or Supabase): endpoints for map state, passport, pets and crossings, bookmarks, follows. Memberstack JWT verified on every call. Webflow pages call this API; the CMS keeps only editorial content (stories, countries, guides, contributors' public profiles).
- Migrate the map and passport first (they already run client-side), then pets. Keep the CMS collections until the migration is verified, then set them to draft and remove their public templates.
- Done when: a member's map, passport and pets render from the API, the CMS has no member-data collections with public pages, and the data map is in the project.

## 4. Privacy as a build step

- After the P0 fixes, add an automated pre-publish check to the story pipeline (the submission form and the editor flow): scan title, body and captions for future dates and "next"/"planning" phrasing, companion whereabouts, street names plus floor or apartment details, children's names, and weight or health details about people. Flag, do not block; the flag lands in the editor queue with the matched text.
- Data subject requests: a documented path for export and deletion (Memberstack export plus API purge plus CMS unpublish) that Nancy can run in under 15 minutes. Write it into claude/tll-privacy-guardrails as a runbook section.
- Processor list in /privacy and /cookies matches reality (Webflow, Memberstack, Cloudflare, Google Analytics, AdSense, Ko-fi, Ahrefs, any email tool when it arrives).
- Done when: a test story with a planted future plan and a planted address is flagged before publish, and the deletion runbook has been run once on a test member.

## 5. Revenue wiring, visible and measured

- Ko-fi buy button for the €9 Paw Passport field guide on /the-paw-passport and the homepage (Nancy supplies the product URL; never invent it).
- One labeled Trip Kit affiliate slot on every story template and guide template, fed from a CMS field, with the disclosure line in brand voice. Empty slot renders nothing, never a placeholder.
- One sponsored-story template: sponsor name and link required fields, "Reklame for [sponsor]" label only when the sponsor field is set, link opens in a new tab (Nancy's 31 Oct rule).
- /for-brands gets audience proof pulled from the dashboard (members, countries covered, stories, read-complete rate), bound, not typed.
- Every revenue click fires an event into workstream 1.
- Done when: a test purchase path works end to end on Ko-fi's side, and the /ops dashboard shows revenue events on the same page as the funnel.

## 6. Make the moat visible: trust and AEO

- Surface the receipts (submitted by, edited by, sources, disclosure, last updated) as a compact strip on story cards and in library search results, not only at the end of stories. Add a small "Human edited" mark in JetBrains Mono.
- Schema.org on every story: Article with author (Person, linked to the contributor page), datePublished, dateModified, publisher (Organization), image, and a `isBasedOn` or citation list from the sources field. Country pages: Place plus ItemList of stories. Contributor pages: Person with sameAs links the contributor switched on.
- Author pages carry a short bio, countries, and the stories list, so answer engines can attribute. Only 6 country pages are indexable today; index every country with at least one story.
- llms.txt at the root (via the Worker) describing TLL, its editorial charter and the sitemap, so AI crawlers cite the site rather than scrape it.
- Done when: Google's Rich Results test passes on a story, a country page and a contributor page, and llms.txt and the receipts strip are live in preview.

## 7. Mobile first as a habit

- Every change in this prompt is checked at 390px before 1440px. Record a 390px screenshot of each touched page in the change log.
- Known mobile debts to clear while in there: library search input width on phones, first story title position on the mobile homepage (target under 1,200px), four sign-in walls to one gated-page template, touch targets under 40px.
- Done when: no touched page has horizontal scroll or a sub-40px tap target at 390px.

## 8. Speed and craft as a release gate

- Lighthouse mobile, incognito, Copenhagen connection: Performance 80+, Accessibility 95+, Best Practices 95+ on home, a story page and /the-map. Record before and after.
- Responsive images on in Webflow; alt text from a CMS field; the type cleanup from the design review (remove Inter Tight, Newsreader, DM Sans, DM Serif, Druk); scroll-reveal shortened to 200 to 300ms from 0.6 opacity with prefers-reduced-motion respected.
- Done when: the three Lighthouse pages meet the gate and the gate is written into the publish checklist from workstream 2.

## Hand back

Write claude/tll-investor-readiness-recheck-<date>.md with: the funnel numbers for the first full week after launch of workstream 1, the sitemap before and after workstream 2, a link to the data map, the privacy test results, the revenue paths tested, Rich Results screenshots, the 390px screenshots index, and the Lighthouse table. Plus the change log of every Webflow element, Memberstack setting, Worker route and secret name (never values) touched.

## Explicitly out of scope

Native app, app store wrapper, multilingual stories, pursuit hubs, business travel section, awards, Substack, ManyChat. These wait until the funnel in workstream 1 has four weeks of data and says where to build next.
