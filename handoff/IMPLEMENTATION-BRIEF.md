> **HANDOFF VERSION: v9 · 5 October 2026 · 2.0 editorial look + accessibility + mobile.** Start with CLAUDE-CODE-PROMPT.md, then keep STATUS.md updated as you go.

# TLL Site Prototype → Live: Implementation Brief

**For:** Claude Code (Webflow MCP session) · **From:** Claude Design · **Updated:** 28 September 2026
**Standing directive (Nancy):** the live site must match the prototype. Page by page, without breaking the contracts in the master prompt §4.

## ⚠ PRESERVATION RULES (read before touching anything) · 28 September 2026, final export

Nancy's instruction for this export: **published stories and Memberstack functionality are never removed. Only optimize them.** If a change would delete, replace, unbind or re-slug either one, stop and ask.

### Stories: never remove
- **Every published item in the Stories collection (`6a0b29eddc14f1444e935760`) stays published at its current slug.** Do not unpublish, archive, delete or re-slug to "match the prototype". The prototype shows a sample of six. The live CMS is the source of truth, and any story added after this export is covered by the same rule.
- **Do not replace CMS bindings with static copy.** The story template shipped static mock content for weeks once. Every field (name, excerpt, body, hero-image, pull-quote, short-version, quick-answers, links-and-mentions, hero-caption, pillar-name, country-number, published-date, reading-time) must stay bound.
- **Rebuilding a card or list:** build the new Collection List *next to* the old one, check it renders every published item, then hide the old one (`visibility:false`). Don't delete the old one first.
- **Keep these story hooks:** `#tll-ad-slot-story[data-tll-ad-slot="story-mid"]`, `[data-tll-breadcrumb]`, `[data-tll-crumb]`, `[data-tll-hero-caption]`, `[data-tll-links-card]`, `[data-tll-story-cta]`, `[data-tll-count="nc"]`, `[data-tll-vouch]`, `[data-tll-card]` (the /stories grid and `?q=` search read these), `#tll-shelf`, `#tll-ad-slot-home`.
- **Keep `/stories` server-rendered.** Do not bring back a client-side card builder (it duplicated the crawlable cards).
- **Allowed optimizations:** OG/SEO binding, date format at source (`DD MMMM YYYY`), alt text, question-style H3s in Quick Answers, related-stories bound to published items only, image srcset, and removing hidden legacy blocks *after* confirming nothing references them.

### Memberstack: never remove
- **Do not touch the TLL Nav v1 component's Memberstack blocks** (the logged-out `data-ms-content="anonymous"` and logged-in `data-ms-content="members"` wrappers, the login/signup/Google sign-in wiring). You may add links next to them. Never move, rename or rebuild the auth blocks.
- **Keep every `data-ms-*` attribute:** `data-ms-content`, `data-ms-member-bound`, `data-ms-action`, `data-ms-field`, `data-ms-modal`, and every form input `name`. You may add new ones. Never remove or rename existing ones.
- **Member JSON keys:** only the map writes `tllStates` and `tllStatesAt`. Nothing else may write them, and nothing may change their shape (see master prompt §4).
- **Gated pages stay gated with the `data-ms-content` split, not JS redirects:** `/share`, `/share-photos`, `/my-pets`, `/edit-profile`, `/account`, `/editor-desk`. Keep public profiles, the pet passport, `/countries`, `/travel-wire`, the Lounge and the map's generic mode **public**.
- **Keep the forms:** `form[data-tll-form="submit-story"]`, `form[data-tll-form="add-pet"]` + `section#add-pet`. A 3-step `/share` redesign keeps one form element and every existing input name. Steps are show and hide inside it.
- **New member fields are additive:** `link-{type}` + `link-{type}-on` (link stack) and the designation flags. Add them as custom fields, and don't repurpose existing ones.
- **Allowed optimizations:** a flash-free auth state (CSS default `display:none` on the members block), `?redirect=` back to the gated page after login, clearer gate copy (in `screens/` "MEMBER GATE"), and signup consent (Terms + Charter + Privacy, "I am 16 or older").

### How to work
1. Before editing a page, read its element tree and its `get_settings` bindings. Note every hook listed above that's present.
2. Add first, verify, then hide the old block (`visibility:false`). Never delete first.
3. After publishing, fetch the page with `?v=` and confirm the story count and the login/account switch still work.
4. Any doubt about a story or Memberstack element: leave it and flag it in `CHANGES.md` for Nancy.

---

## Update · 28 September 2026

### New standing rulings
- **Vibe collections retired.** No Sunset Mist / Desert Glow / Alpine Escape / Wild Routes / Salty Air anywhere. Browse by pillar and place only.
- **Date format:** Copenhagen order, month spelled out: "19 September 2026". Never "September 19, 2026", never numeric.
- **Canonical pillars (only these five):** Layover Guides · Paw Passport · Travel Logistics · Cultural Intelligence · Stories From the Road.
- **Paw Passport is species-inclusive.** "Your bestie, any species. Magnus was simply first." Never dog-only headings.
- **Newsletter has no fixed schedule.** "It lands when a story earns it." Never "every Sunday".

### Already done on the live site today (do not redo)
- `/stories`: "Browse by vibe" row and its five links removed. Newsletter success line fixed. OG title now "The Library · That Layover Life".
- `/about`: pillar names + descriptions replaced with the canonical five.
- Homepage: Paw heading "Your bestie gets a page." / "Any species. Magnus was simply first."; card label "Latest trip with Magnus along" (was the wrong pillar); shelf label "Already on the shelf · counted by hand"; SEO title aligned to "…by people who actually went".
- Story template head: CSS hides `#tll-ad-slot-story`, the vouch button, an empty Links & Mentions card, and a gallery showing only the placeholder (hooks stay in the DOM); a script rewrites US dates to "19 September 2026".

### Still to do (needs Designer / Nancy)
1. **Collections pages:** unpublish the five `/collections/*` items (or 301 → `/stories`) and the Collections template. Nothing links to them now.
2. **Date format at source:** set the story template's date-field format to `DD MMMM YYYY` in the Designer so crawlers see it too; then the runtime date script can go.
3. **Nav drifted since the last session:** now Stories · Countries · Paw Passport · About. The Map is missing. Restore per prototype IA, and fix the logged-out state showing Log in + Sign up + Account together (`data-ms-content="anonymous"` / `"members"` wrappers). Nancy present; Memberstack bindings live in the nav.
4. **Story share row source hrefs:** the Copy link href is `https://javascript:…` and LinkedIn/X point at the homepage. A runtime patch fixes them; fix the link settings properly.
5. **Byline avatars:** story bylines show "NC" initials; use Nancy's avatar image everywhere (same image as profile + travelers list).
6. **No-JS story metadata:** reading time renders as a bare "9", breadcrumb country is uppercase, Keep Reading cards show bare "3"/"6". Bake "MIN" / title case into the fields or template text, not only CSS `::after`.
7. **Lounge credits:** 2 of 8 homepage Lounge tiles say NC, the rest nothing. Credit all consistently.

### Second pass (same day): group landing pages, expat finder, link stack
Full spec in DESIGN-SPEC.md §3b. Build order for this batch:
1. **Expat Groups** + **Resources** collections, then seed the 4 Denmark resources exactly as listed in §3b.
2. The "Find your people" switcher on /for-expats, /for-press, /the-paw-passport and /for-affiliates.
3. Rebuild /for-expats to screens/16: finder, directory, groups form (Webflow form into Expat Groups, status "in review").
4. Opt-in link stack: Memberstack fields `link-{type}` + `link-{type}-on`, the sign-up section, the Edit profile editor, and the Pets fields. Then render it on the public profile, Travelers card and pet passport.
5. Rebuild /travelers to screens/04 (filter chips + four sections).
6. Footer: 4 columns (already live, check it matches).

### Final pass (28 September 2026, late)
- **About page, founder block:** three photo options (A green/window · B rust/midnight · C black and white) with a switcher. Nancy picks one, and only that one ships. The photos are in `images/nancy-*.jpg` inside the standalone. Upload the chosen one to the Webflow asset library. Facts row: 87 countries, abroad since 2018, EN · DA · PT, marathons on every continent, flags US · DK · BR · VN.
- **Nancy's flags everywhere:** US first, then Denmark, Brazil, Vietnam. Label: "FROM · HAS LIVED IN". Profile line starts "AMERICAN · LIVES IN DENMARK SINCE 2018".
- **Paw Passport guide sales block** on the Paw hub: the four free mistakes, the paid contents, **€9**, and the Ko-fi button disabled until Nancy sends the link. The free story links to /stories until it's published.
- **Magnus:** 35 kg, 13 countries, everywhere.
- **Pet-travel content may name the required rules** (the microchip, titre test and rabies steps) in the guide and the free story only. UI, forms and marketing copy still never use those words. The pet form still has no medical fields.
- **Minimum age: 16.** This supersedes 13. The signup checkbox reads "I am 16 or older".

### Prototype changes in this export
- Six live stories now (Antarctica marathon added as newest, real CMS copy + hero). Place filter gains "Antarctica".
- Collections/vibe screen removed.
- Memberstack gating: Share, Share photos, My pets, Edit profile, Account, Editor's Desk render a members-only gate when logged out (mapping table below).
- Signup consent: 13+, helper line "Every byline a real person. Sponsorships disclosed at the top, never in a footnote."

---

## Files in this handoff
- `TLL Site Prototype (standalone).html` — every screen, fully inlined (fonts, images). Open in a browser; the bottom-left "SCREENS ▴" toggle jumps between pages. Decode the real markup from `<script type="__bundler/template">` (JSON string) if you need source; each screen is wrapped in `<sc-if value="{{ isXxx }}">`.
- `TLL Map.html` — the D3 choropleth the prototype embeds in an iframe (`?mode=generic|personal&embed=1`). Reference only; the live map engine on /the-map already exists and must not be replaced.
- This brief.

## Design tokens (final, supersede everything earlier)
- Midnight `#0A0B14` (cards `#16182a`, panel `#12141F`) · Rose `#F0507A` / `#D63859` · Amber `#D98A2B` · Cream `#F7F1E8` · Paper `#FDF9F3` · Border `#E0DACE` · Ink `#1A1A1A` / body `#3a3a3a` / muted `#6B6660`
- **Teal ruling:** `#00C9C8` only on dark surfaces. Teal text on Cream/Paper = **`#067A79`**. Links in body copy on light = Ink + teal underline.
- Type: **Playfair Display 800** headlines (one italic rose accent word) · IBM Plex Sans Condensed body (live) · JetBrains Mono 400/600 eyebrows/meta (uppercase, 2–3px tracking). Syne only in the wordmark.
- Voice: NPS-sign dry wit. No em dashes. "Reviewed within 48 hours" never "published." "Every byline a real person." No anti-AI headline claims.

## Review findings — fix in the live build (ranked)

### Blockers (visible, every visitor)
1. **Hero contrast on photo heroes.** Prototype puts mono eyebrows directly on photos (Paw hub, Story, 404). Live must use the treatment now in the prototype's Paw hero: eyebrow on a `rgba(10,11,20,.72)` pill, headline over a bottom gradient ≥ `.78` opacity. Test every photo hero at 4.5:1.
2. **Story hero headline overflow.** Two-line Playfair at 56px collides with the hero bottom edge on 1024–1280 widths. Clamp: `font-size: clamp(34px, 4.2vw, 56px)`, and give the hero `min-height` not fixed height.
3. **Map embed placeholder.** Homepage map module shows a blank dark box in the prototype export (iframe). Live: mount the existing `#tll-map-canvas` engine in that container, keep `#tll-map-counter` / `#tll-map-pct` hooks so the binder works.

### High (design consistency)
4. **Nav is the prototype's, not the live one.** Prototype nav: Stories · Destinations · Travelers · Paw Passport · About · [Share your story] · [Log in / Account avatar]. Live nav currently: Stories · Map · Travelers · Spotlight · About · Pen a Tale. **Do not edit the nav component without Nancy present** (Memberstack bindings). Log the diff for her Friday session; the Map lives under Destinations in the prototype's IA.
5. **Footer.** Prototype footer = 3 columns (Navigate / Discover / Contribute) + wordmark + one tagline + stat strip driven by the binder. Live footers are per-page static blocks. Build one footer markup, paste into every static footer slot, keep the site-level script that injects Countries / Travel Wire.
6. **Story cards.** Prototype cards are photo-led (flag chip top-left, read-time chip top-right, Playfair title, byline). Live shelf cards are text-initials. Needs per-story image class or bound Image element; the story `hero-image` field is already populated for 3 of 4.
7. **Stories index front-of-shelf.** Prototype adds "Most read this week" + "From the press desk" + "Location experts" rails above the grid, plus sort chips (Most recent / A→Z / Read time) and continent filter. Live has pillar chips + q-search only. Build the rails as Collection Lists with honest empty states (press desk copy is in the prototype).
8. **Account dashboard (§10).** Four modules Logged / Pawed / Written / Snapped with one CTA each; Snapped zero state points to /share-photos. Live /account is still the old design. Counters must bind to `tllStates` (binder pattern) — never hardcode.

### Medium
9. **Search bar copy.** Prototype: "Search a country, a layover, a feeling…"; live homepage bar says "Search the library: a country, a train line, a feeling". Align to prototype.
10. **Share form.** Three-step with progress bar and "STEP 1 OF 3 · THE STORY" eyebrows; ~10 fields; hero image min dropped to 1600×900. Live /share is a single long form. Keep `form[data-tll-form="submit-story"]` and all input names; wrap fieldsets in steps with JS show/hide, not new forms.
11. **Editor's Desk.** Nancy-only, NOINDEX, gated. Queue rows with 48h countdown, voice/SEO/em-dash scores, REVIEW → panel. Build as a gated static page reading a Submissions CMS collection; scores can be computed client-side from the story text until the AI check service exists.
12. **Country page template.** Prototype country page = photo hero + flag avatar, "EUROPE · 1 STORY FILED · LOGGED BY 1 TRAVELER" meta, story list, reader-submission open slot, "Been to Bulgaria? Log it" CTA to the map. Build as the Countries collection template (id `6a8afbd98e907b41c4da109b`); the 52 fields exist.
13. **404.** Photo hero, "This page missed its connection." Two CTAs. Live 404 is Webflow default.

### Low / polish
14. About page: headline now "Real places, by the people who actually went." (the retired "world is your layover" line was still in the prototype — fixed this pass).
15. Travelers page: dashed OPEN SLOT cards are correct; keep them. Never add fake names.
16. Profile: label chips (FOUNDER rose / EXPAT neutral / LIFER amber) match the label decision table; "Trust me with a flight delay because…" and "One strong opinion" blocks are CMS-bound on live already (Contributors collection) — just restyle.

## Memberstack mapping (the prototype simulates this with a `loggedIn` flag)

The prototype's `loggedIn` state stands in for Memberstack. Wire it as follows; every gated page is one `data-ms-content` split, not a JS redirect.

| Prototype behavior | Live implementation |
|---|---|
| Nav "Log in" (logged out) | wrapper `data-ms-content="anonymous"` |
| Nav avatar + "Account" (logged in) | wrapper `data-ms-content="members"`, avatar bound to the member's profile image field |
| Gate screen ("An account first, then the story.") | the `data-ms-content="anonymous"` half of each gated page |
| Gated page body | the `data-ms-content="members"` half |
| "Join the Travelers →" | link `/signup`; from a gate, `?redirect=` back to the gated page |
| "Sign out" on Account | `data-ms-action="logout"` |
| Draft autosave note | member-bound form, `data-ms-member-bound="true"` |
| Editor's Desk gate (no join CTA, log-in only) | role/plan gate, not plain members — restrict to the editor plan; page stays NOINDEX |

**Gated pages** (members half + gate half): `/share`, `/share-photos`, `/my-pets`, `/edit-profile`, `/account`, `/editor-desk`.
**Public pages** (never gated): everything else, including `/profile/{slug}` public profiles, `/paw-passport/{slug}`, `/countries`, `/travel-wire`, the Lounge, and the map in generic mode.

**Map modes.** Logged out the homepage/map embed loads `mode=generic` (all travelers' countries, read-only). Logged in it loads `mode=personal` and writes to Memberstack member JSON `tllStates` / `tllStatesAt` — those two keys only, nothing else writes them.

**Signup consent** (matches the prototype): one checkbox for Terms + Editorial Charter + Privacy (all three resolving links), one for "I am 16 or older" (Nancy 28 September 2026, supersedes 13), helper text below the labels reading "Every byline a real person. Sponsorships disclosed at the top, never in a footnote."

**Do not** put a gate on a public profile, and do not gate the map's generic mode — both are indexable and are the main organic entry points.

## What already matches (do not rebuild)
Homepage hero (Curaçao photo), proof shelf order, library-first search bar, community engine block, Paw Passport homepage block, /countries index, /travel-wire, teal class sweep, nav Spotlight link + "Pen a Tale · submit yours".

## Build order
1 → 2 → 3 (blockers, one session) · 6 → 7 → 5 (homepage/stories/footer parity) · 8 → 10 → 12 (member + template pages) · 11 → 13 · 4 only with Nancy in the Designer.

## Contracts (never break)
See master prompt §4: TLL Nav v1 / TLL Footer v1 untouched without Nancy; keep every element ID, `data-*`, input name, Memberstack attribute; 15 registered scripts stay; counts bind to `tllStates`; `/my-pets#add-pet`; publish to both custom domains + subdomain; verify with `?v=` cache-buster.
