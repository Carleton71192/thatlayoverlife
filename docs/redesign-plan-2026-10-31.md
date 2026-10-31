# That Layover Life: redesign plan (draft for Nancy's approval)

31 October 2026. Built from Nancy's brief (live audit of 29 Oct), the repo and the Webflow CMS. The baseline crawl (screenshots at 360/390/768/1024/1440, Lighthouse, axe, link check, `<head>` diffs) is blocked until the build environment can reach the site (to-do for Monday). Numbers below marked "brief" come from Nancy's audit; they will be re-measured before any change.

**Setup.** (a) Webflow MCP / Data API on the live site + (c) the GitHub repo. Where each change lives is named per item: **Designer** (Webflow elements, via MCP), **CMS**, **Site layer** (repo `src/site-layers/`, served from jsDelivr as one registered site script), **Page code** (page custom code), **Worker** (`tll-travel-wire`).

**Staging.** Every change is published to `thatlayoverlife.webflow.io` only, with a preview link, and goes to the custom domains after Nancy approves. One concern per commit and per publish. Rollback for every site-layer change: re-apply the previous registered script version; for CMS: the before values are logged in `handoff/WEBFLOW-LOCK.md`.

**Already done (31 Oct).** Selector map in `docs/selectors.md` (from the repo; the live crawl will add anything only the live HTML holds). Every live story's cover and gallery photo now has alt text in the CMS (the last two were Luke's).

## P0. Correctness and accessibility (no visual change)

| # | Change | Lives in | Risk | Notes |
|---|---|---|---|---|
| 1 | **Real counters in the HTML.** Add a one-item "Site stats" CMS record (stories, travelers, countries in stories). The Worker's 30-minute job recounts and updates it; the footer binds to it, so the raw HTML always has the right numbers and the existing `data-tll-*` scripts only refresh them. | CMS + Worker + Designer (footer) | Low | The footer is a shared component: done with Nancy present. Webflow cannot count CMS items server-side, which is why the Worker writes the numbers. |
| 2 | **Label each country count.** "Nancy's map: 89 + Antarctica" (home map band, /the-map) vs "Countries in our stories: 54" (footer). | Designer copy | Low | Copy change: wording below for approval. |
| 3 | **Expats tiles** (Moving guides, Visa trackers, City hubs): "Coming soon" with a newsletter waitlist, or link to real pages. | Designer | Low | **Question 1.** |
| 4 | **Alt text in templates.** The CMS has alt on every story photo; the missing alt comes from template images not bound to it and decorative avatars. Bind CMS alt on card/hero images; `alt=""` + `aria-hidden` on decorative avatars. Remove the repeated `#tll-mg-ink / -top / -bottom` SVG defs (define once). | Designer + Site layer | Low | Needs the live DOM to find each element. |
| 5 | **Mobile nav and focus.** Focus trap, Esc to close, `aria-expanded` / `aria-controls` on MENU; 44x44 tap targets (share icons, breadcrumb); visible `:focus-visible`; AA contrast incl. a stronger scrim behind the hero subtext and the photo credit line. | Site layer + Designer (nav) | Low to medium | The nav is a shared component: done with Nancy present. |

## P1. Homepage structure (target at most 7,000 px desktop / 9,000 px mobile; brief: about 12,600)

| # | Change | Lives in | Risk |
|---|---|---|---|
| 6 | New order: Hero, Library shelf with search merged in, one "Ways in" row (Map, Paw Passport, Expats), one community band (Layover Lounge + The people who went), Write for TLL + First 100, Newsletter, footer. Closing CTA merged into the newsletter. Every hook in `docs/selectors.md` stays in the DOM; anything moved is listed with the script that reads it. | Designer | Medium (staging first, before/after screenshots) |
| 7 | Shelf: render 12 cards, link to /stories for the rest; edge fade, arrow buttons and "See all stories" affordance at 390; remove the empty space under the cards. | Designer + Site layer | Medium |
| 8 | Hierarchy: the big Playfair + rose italic only for the H1 and at most two section heads; a written type scale (1.25, clamp) and 4/8 spacing scale, applied site-wide. | Site layer (one stylesheet) | Medium |

## P2. Typography and performance

| # | Change | Lives in | Risk |
|---|---|---|---|
| 9 | Fonts: Playfair Display (800 + italic) + JetBrains Mono (400/600) + one body face. Remove Teko, Syne, DM Sans and webfont.js; preload the two above-the-fold fonts; `font-display: swap`. | Designer (site fonts) + Site layer | Medium. **Question 2.** |
| 10 | Merge the inline `tll-*-vN` style patches into one versioned stylesheet; keep any ID a script checks as an empty marker. | Site layer + Page code | Medium (many small moves, each diffed) |
| 11 | Load d3/topojson only on map pages: `tll_world_map_v1` and `tllmapv3` are applied site-wide today; move them to /the-map and the home page (map band). Load adsbygoogle once. `loading="lazy"`, `sizes` and `srcset` on below-the-fold images; `fetchpriority="high"` on the hero. | Site scripts + Designer | Low to medium |

## P3. Polish

| # | Change | Lives in |
|---|---|---|
| 12 | Story pages: 60 to 75ch measure, sticky share from 1024 px, reading time shown, more room around gallery and FAQ. | Site layer |
| 13 | /stories at 390: the same scroll affordance as the home shelf on the chip row. | Site layer |

## Questions for Nancy

1. **Expats tiles:** mark Moving guides, Visa trackers and City hubs "Coming soon" with a waitlist, or remove the links until those pages exist?
2. **Body font:** the brief asks for Inter Tight or Newsreader. Recommendation: **Inter Tight** for interface and body, since it is already the fallback in every layer and reads well at small sizes. Note: brand kit v2.2 and most site layers use IBM Plex Sans Condensed for body text; dropping Plex means updating those layers too. Keep Plex (and drop the other three), or move to Inter Tight?
3. **Horseshoe Bend** (`/stories/horseshoe-bend-arizona`, 1-minute read): expand it, or keep it live but off the home shelf?
4. **Count labels** (P0.2): approve the wording "Nancy's map: 89 + Antarctica" and "Countries in our stories: 54" (numbers read live, never typed)?

## Acceptance (from the brief)

Lighthouse mobile on `/`, `/stories`, `/stories/antarctica-marathon`, `/the-map`, `/the-paw-passport`: Performance at least 85 (home at least 80 with ads), Accessibility at least 95, Best Practices at least 95, SEO 100; LCP under 2.5 s, CLS under 0.1, INP under 200 ms. axe: 0 serious or critical on those pages plus `/login`, `/signup`, `/submit`, `/share-photos`, `/for-expats`, `/travelers`. Link check: 0 broken internal links, every route 200. Forms tested on staging only. Counters correct in raw HTML. No horizontal overflow at the five widths. No GA4, Ahrefs or AdSense requests before consent. No `<head>` diffs except approved ones.
