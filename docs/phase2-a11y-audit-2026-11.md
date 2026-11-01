# Phase 2C accessibility audit, offline (1 November 2026)

The sandbox cannot reach thatlayover.life, so this audit ran against saved stand-ins of the site: the home, story and page fixtures in the repo, plus the 13 October Webflow export pages for the form and help pages, each dressed in the current site head CSS (31 Oct, `scratchpad/p0-1031/after/site-head.html`), the newest saved page code, and the raw site layers in the v16 bundle order. axe-core 4.14.0 ran in Playwright Chromium with every request answered from local files or aborted, at 390 and 1440 wide, with the tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa and best-practice, plus the label-content-name-mismatch rule switched on. Static checks read the saved page code, the layer CSS and the 13 October style dump.

Script: `scratchpad/a11y/run-axe.cjs` (`node scratchpad/a11y/run-axe.cjs axe` and `node scratchpad/a11y/run-axe.cjs static`). Raw results: `scratchpad/a11y/axe-<page>-<width>.json` (44 files), `scratchpad/a11y/summary.json`, `scratchpad/a11y/static-scan.json`, `scratchpad/a11y/run-axe.log`. axe-core was installed with `npm i --no-save axe-core`; `package.json` and `package-lock.json` are unchanged (checksums verified before and after).

## Headline counts

| Count | Number | Where it comes from |
|---|---|---|
| axe runs | 44 (22 pages at 390 and 1440) | `scratchpad/a11y/summary.json` |
| Critical | 4 instances, 2 distinct elements | the newsletter email field on home (13 Oct embed) and on /newsletter, no label |
| Serious | 55 instances, 6 distinct issues | footer wordmark name mismatch on every page (44), two contrast failures on contact and support, one on /stories at 390, one on /newsletter, an empty link on the 13 Oct home shelf, a scrolling chip row with no keyboard access on /stories at 390 |
| Text under 12px, saved code | 214 regex matches in 52 files; 4 are the v9 chrome repair rule for 8 to 9.5px inline sizes, so 210 real declarations: 157 in 27 page code files, 53 in 25 layer files | `static-scan.json` `smallText` |
| Text under 12px, Designer classes | 286 declarations in the 13 Oct style dump, 267 distinct selectors: 117 named classes (46 at 10px, 56 at 11px, 14 at 9px, 1 at 11.5px) and 157 unnamed `inline-*` classes | `static-scan.json` `designerUnder12`, from `handoff/claude-design-source/webflow-export-2026-10-13/css/tll-webflow.css` |
| Text under 12px at runtime, after the 12px floor | 27 distinct text runs across 11 of the 22 fixtures (plus the aria-hidden stamp SVG text) | `checks.smallAfterFloor` in the axe JSON |
| Contrast failures | 21 distinct: 17 of 43 computed color pairs under 4.5:1, plus 4 measured by axe on the fixtures | `static-scan.json` `contrast` and the `color-contrast` violations |
| Unlabeled fields | 2 fields with no label of any kind (axe critical); 84 fields on 7 form pages share an id, so a `label for` cannot bind | `checks.unlabeled` and `checks.shared` in the axe JSON for the 13 Oct export pages |
| aria-label values not containing the visible text | 1 (the footer wordmark link), out of 60 aria-label uses read in the layers and page code | axe plus `static-scan.json` `ariaLabels` |
| Roles not allowed on their element | 1 (`role="banner"` on the `<nav>`), out of 56 role uses read | axe `aria-allowed-role` plus `static-scan.json` `roles` |
| Pages with no `<main>` landmark | 8 of 22 (home, both home fixtures count as one, the Stories template, /account, /edit-profile, /login, /signup, /destinations) | `checks.mains` |
| Focus rings hidden under the floating Tell the editor button | 29 distinct focusable elements on 7 pages at 390 | `focus.coveredByNote` |

## 1. axe-core results per page

Fixture vintage in brackets. "Serious and critical" lists each failing rule with the selector axe reported. Moderate and minor rules are summarized once in section 1.2 because they repeat on every page.

| Page | Fixture | Critical | Serious | Serious and critical rules, with selector |
|---|---|---|---|---|
| / home | `src/design/magazine-2026-10/cover-build/fixture-home.html` (13 Oct export body, 26 Oct hero embeds, cover layer) | 1 | 2 | `label` on `#h3-news-email` (newsletter email, no label); `link-name` on `a.h3-open` (empty link to /submit in the shelf embed); `label-content-name-mismatch` on `a.tll-fwm` (footer wordmark) |
| / home, 28 Oct embeds | `src/pages/home/live-2026-10-28/ux/fixture-home-current.html` | 0 | 1 | `label-content-name-mismatch` on `a.tll-fwm`. The 28 Oct embeds have no empty `.h3-open` link, and `#h3-news-email` carries a placeholder, which axe accepts but WCAG does not treat as a label |
| /stories/spain-madrid-wedding-ibiza | `src/design/magazine-2026-10/story-build/fixture-spain-madrid-wedding-ibiza.html` (26 Oct template tree, story layer) | 0 | 1 | `label-content-name-mismatch` on `a.tll-fwm` |
| /stories/ghana-easter-everyone-wears-white | same build | 0 | 1 | same |
| /stories/pantanal-glimmers-in-the-wild | same build | 0 | 1 | same |
| /stories | `src/pages/heroes-2026-10-29/fixtures/stories.html` (29 Oct tree) | 0 | 3 at 390, 1 at 1440 | `color-contrast` on `.tll-library-newsletter h3 > .tll-text-rose` ("worth it", #F0507A on #F8F2E6, 3.07:1, 390 only); `scrollable-region-focusable` on `.tll-chip-row[data-tll-places]` (390); `label-content-name-mismatch` on `a.tll-fwm` |
| /the-map | `src/pages/heroes-2026-10-29/fixtures/the-map.html` | 0 | 1 | `label-content-name-mismatch` on `a.tll-fwm` (the map itself did not draw: d3 and the world atlas come from a CDN) |
| /travelers | `src/pages/heroes-2026-10-29/fixtures/travelers.html` | 0 | 1 | same |
| /about | `src/pages/heroes-2026-10-29/fixtures/about.html` | 0 | 1 | same |
| /for-expats | `src/pages/heroes-2026-10-29/fixtures/for-expats.html` | 0 | 1 | same |
| /contact | export `pages/contact.html` (13 Oct body, 31 Oct page code, Phase 0 layer hides the relay form) | 0 | 3 at 390, 2 at 1440 | `color-contrast` on `a.tll-cta-ghost-dark` (cream #F7F1E8 on #00A9A4, 2.59:1, 13px); `color-contrast` on `.tll-contact-faq-card > h3 > em.tll-text-rose` (#C8325B on the card's #EFEAE1, 4.31:1, 16px bold, 390); `label-content-name-mismatch` on `a.tll-fwm` |
| /support | export `pages/support.html` (13 Oct body, 31 Oct page code) | 0 | 2 | `color-contrast` on `a.tll-cta-ghost-dark` (2.59:1); `label-content-name-mismatch` on `a.tll-fwm` |
| /signup | export (13 Oct) | 0 | 1 | `label-content-name-mismatch` on `a.tll-fwm` |
| /login | export (13 Oct) | 0 | 1 | same |
| /edit-profile | export (13 Oct), signed out | 0 | 1 | same |
| /submit | export (13 Oct), 29 Oct page code, signed out | 0 | 1 | same |
| /share-photos | export (13 Oct), 23 Oct page footer, signed out | 0 | 1 | same |
| /my-pets | export (13 Oct), signed out | 0 | 1 | same |
| /newsletter | export (13 Oct) | 1 | 2 | `label` on `input#email` (no label); `color-contrast` on `input.tll-btn-primary.w-button` ("Send me the first one", #F8F2E6 on #F0507A, 3.07:1); `label-content-name-mismatch` on `a.tll-fwm` |
| /account | export (13 Oct), 27 Oct page footer, signed out | 0 | 1 | `label-content-name-mismatch` on `a.tll-fwm` |
| /the-paw-passport | export (13 Oct) | 0 | 1 | same |
| /destinations | export (13 Oct), ds3 head code | 0 | 1 | same |

### 1.2 Moderate and minor, repeated across pages

- `aria-allowed-role` (minor, every page): the v9 chrome script in the site head sets `role="banner"` on `<nav class="tll-nav-v1">`; banner is not allowed on a nav.
- `heading-order` (moderate, 19 pages): the footer component's `<h4>Navigate</h4>` follows an h2 or h3 column; on /contact and /support the page jumps from h1 to h3 (`.tll-contact-door-title`, `.tll-support-card-title`).
- `landmark-one-main` and `region` (moderate): no `<main>` on home (11 nodes outside landmarks, the whole cover), the Stories template (35 to 43 nodes), /account, /edit-profile, /login, /signup, /destinations (15 nodes). The skip link on those pages points at `#tll-main`, which exists but is a div.
- `page-has-heading-one` (moderate): /account, /edit-profile, /my-pets, /share-photos show no h1 to a signed-out visitor; the sign-in prompt is an h2.
- `empty-heading` (minor): `h2.tll-lib-title` is empty on /stories (the card without a photo).
- Needs review (axe `incomplete`): 1 to 107 `color-contrast` nodes per page where text sits over a photo or a gradient and axe cannot read the background: the cover kicker, chip and h1 on home, the stamp SVG text on story pages, the page-hero photo captions (`.tll-ph-cap`) on about and for-expats, the hero eyebrow and h1 on contact, support and stories. `aria-prohibited-attr` on `div.h3-cards[aria-label]` on home. `duplicate-id-aria` (2) on /share-photos. `form-field-multiple-labels` (2) on /signup.

### 1.3 Other DOM checks run with axe

- The 12px floor script (`tll-floor-js-v1` in the site head) lifted 1 to 20 text runs per page (`data-tll-floor`), yet 27 distinct runs still render under 12px because the floor writes a plain inline style and loses to `!important` rules in the page code and the site head. The full list is in section 2.3.
- Focus ring: after one Tab, programmatic focus on every focusable element showed an outline or box-shadow on every page except three inputs: the home search `#Search-the-library` and `#h3-news-email` (both home fixtures) and `#tll-lib-q` on /stories. On those, `box-shadow:none !important` in the home search pill rule and the library search slot removes the craft-polish ring and the v9 chrome outline does not reach the input.
- The floating Tell the editor button (`#tll-note`, position fixed, 44 by 44 at 390): when focus lands on 29 distinct elements at 390 across home, stories, the-map, travelers, about and for-expats, their box overlaps the pill: footer links ("For affiliates", "For brands", "Community guidelines", "Destinations", the hello@ link, the footer wordmark), the library newsletter Submit, the people-strip cards and page-hero photo tiles when they scroll under it. Their focus ring is drawn under the pill. No overlap at 1440.
- Targets under 24px (WCAG 2.5.8): the nav wordmark link `a.tll-nav-logo` is 121 by 22 on every page; inline text links inside prose (`a.st3-from-link`, "send one photo", "Tell the editor", "Pitch a layover story", the photo credit links `a.tll-ph-credit`, the signup consent links at 17px tall, the two 18px checkboxes on /signup) are under 24px tall. axe does not fail these because of the inline and spacing exceptions, but the checkboxes and the wordmark are not inline text.
- Page errors offline: `CookieConsent is not defined` on every page (the old footer handler; the live site loads it from jsDelivr), and `Cannot read properties of undefined (reading 'forEach')` on /stories, /for-expats and /the-paw-passport, from a layer that expects Worker data the stub did not provide.

## 2. Static checks

### 2.1 Text under 12px in saved page code and layers

210 real declarations (the regex caught 214; the 4 others are the v9 chrome rule that lifts 8, 9 and 9.5px inline sizes to 10px and its attribute selectors). By file, with what the text is:

| File | Count | What it is |
|---|---|---|
| `scratchpad/p0-1031/after/site-head.html` | 6 real (10 matched) | `[class*=eyebrow]` 11px `!important` (every eyebrow on the site), `.tll-shelf-eyebrow` 11px, `.tllmm-btn` 11px (later set to 12px by v9 chrome), and three 11px inline-styled mono labels the proto-parity script renders on /spotlight (COMING SOON, OPEN SLOT, THE …) |
| `scratchpad/p0-1031/after/storytpl-head.html` | 4 | `.tll-reklamelink` 10px, the "Annonce" ad slot label 11px, the hero caption 10.5px, the meta row eyebrow and reading time 11px (eyebrow and caption) |
| `scratchpad/p0-1031/before/storytpl-footer.html` | 21 | the st3 story footer, all mono labels and meta: the route label 10.5px, route stops 11px, sponsored badge 10.5px, author "filed from" line 10px, Quick answers eyebrow 10px, links card label 10px, share label 10px, affiliate key 10px, the travelers-who-went heading 10px and initials 11px, places label and note 10.5px, trip keys 10px, trip number 11px, the trip facts box title 10px and its key labels 10.5px, contributor badge 10px and count 10.5px. All `font:` shorthand, most with `!important`, which is why they beat the floor on the story fixtures |
| `scratchpad/p0-1031/before/home-head.html` | 6 | `.tll-flow-ticker span` 11px, `.tll-flow-man .c` 11px, `.tll-flow-rail a` 9px (links), `.tll-atlas .e` 11px, `.tll-atlas .k .s` 9px, `.tll-atlas .more` 11px. The flow rail and atlas CSS is in the page head; the script that would build them is not in the v16 bundle or the saved page code, so these may be dead rules |
| `scratchpad/p0-1031/before/stories-head.html` | 8 | filter chips 10px (controls), `.tll-atlas` rules as above, `.tllsb-label` 11px, `.tllsb-clear` 11px (link), `.tll-lib-meta` 10px, `.tll-lib-read` 10.5px (link) |
| `scratchpad/p0-1031/before/stories-footer.html` | 8 | library hero eyebrow 11px, search clear 11px (link), `.tll-filter-label` 10.5px, sponsored tag 10.5px, card kicker 10px, card place 10.5px, empty-state and newsletter eyebrows 11px |
| `scratchpad/p0-1031/before/map-head.html` | 1 | `[data-tll-map-invite]` 11px |
| `scratchpad/p0-1031/before/map-footer.html` | 19 | the mp3 map UI: eyebrow 11px, sub line 11px, chip buttons 11px (controls), find label 10.5px, shown count 10.5px, region name and tag 10.5px, table caption, header cells and second column 10.5px, departures 10.5px, source 11px, map hero eyebrow 11px, legend 11px, plus one 11px inline style in the paint() script |
| `scratchpad/p0-1031/before/contact-head.html` | 3 | relay eyebrow 11px, relay field labels 10px, relay note 10px (the relay form is hidden by the Phase 0 layer) |
| `scratchpad/p0-1031/before/support-head.html` | 1 | `[data-tll-club=eb/soon/price]` 11px `!important` (the h4 "The Layover Club · Optional, always" renders at 11px after the floor) |
| `src/pages/heroes-2026-10-29/code/for-expats-head.html` | 12 | expat finder: eyebrows and labels 10px, finder button 11px (control), "all" link 10px, `.tllx-head small` 9px, `.tllx-head a` 10px (links), `.tllx-col h4` 9px, card `small` 9px, field labels 9px, foot 11px and its links 10px |
| `src/pages/heroes-2026-10-29/code/travelers-head.html` | 2 | card open marker 10px, owner tag 10px |
| `src/pages/heroes-2026-10-29/code/travelers-footer.html` | 3 | category tag 9px inline style in the script, link chips 9.5px, search label 11px |
| `reports/evidence/2026-09-30/webflow/page-code/editorial-charter.head.html` | 2 | DRAFT badge 9px bold, mail line 11px |
| `reports/evidence/2026-09-30/webflow/page-code/privacy.head.html` and `terms.head.html` | 1 each | legal tabs links 10px |
| `src/pages/sweep-2026-10-19/travel-wire-footer-after.html` | 4 | region chips 10px (buttons, 36px tall), region tag 9px, country line 9px, source and time line 9px with the READ AT SOURCE link inside it. All rendered after a fetch, so after the floor has run |
| `src/pages/submit/live-2026-10-29/page-head-live.html` | 3 | fork eyebrow 11px, link-out field labels 10px, pass line 10px |
| `src/pages/submit/live-2026-10-29/page-footer-live.html` | 3 | steps eyebrow 11px, autosave line 10px, prefilled note 9px |
| `src/pages/share-photos/live-2026-10-23/page-footer-after.html` | 8 | hero eyebrow link 11px, eyebrow 11px, fieldset legend 11px, drop-zone headline 10.5px, blank thumb 11px, disclosure 11px, anonymous-state eyebrow 11px and preview word 10px |
| `src/pages/account/live-2026-10-27/page-footer-2026-10-27-after.html` | 2 | log row labels 10px, one 11px inline style in a script |
| `src/pages/creators/live-2026-11-01/after/page-footer.html` | 1 | `.tlldir-makes` 10.5px |
| `src/pages/spotlight/live-2026-10-25/page-footer-after.html` | 2 | 11px inline styles in a script (amber and grey labels) |
| `src/pages/contributors-template/live-2026-10-28/tll-pf5-n-v1.html` | 1 | `.pf5-tag` 10px |
| `src/pages/country/v3/live-head-after.html` | 21 | country page: hero meta 10px, places note 10px, body label 10px, word eyebrow 11px, source 10px, wire and subs labels 11px, wire items 10px and their meta 9.5px, source heading 10px, and the rest at 10 to 11px |
| `src/pages/country/v3/live-footer-after.html` | 1 | wire item meta 9px |
| `src/pages/destinations/v3/head-live-after-ds3.html` | 13 | atlas kicker 10px and 11px, eyebrows 11px, stat row 10.5px, grid `small` 10px, meta 10px, card meta 10px (#8A5A12), tile meta and mine 10px, CTA eyebrow 11px |
| 25 layer files (`src/site-layers/*.js`) | 53 | almost all the same pattern: a mono key label at `font:600 11px/1.4 "JetBrains Mono"` (`.tll-crew-k`, `.tll-val-ey`, `.tll-col-k`, `.tll-wn-k`, `.tll-st-k`, `.tll-alb-k`, `.tll-exp-k`, `.tll-pro-k`, `.tll-paw-k`, `.tll-met-k`, `.tll-sr-k`, `.tll-ex-k`, `.tll-pp-k`, `.tll-wt-k`, `.tll-ux-k`, `.tll-si-k`, `.tll-lp-site`, `.tll-ls-k`, `.tll-cp-h`, `.tll-ls h3`, `.tll-lsp-h`), flag and tape chips at 10px (`.tll-val-flag`, `.tll-st-wt`, `.tll-paw-flag`, `.tll-ex-flag`, `.tll-pp-flag`, `.tll-wt-flag`, `.tll-wt-card-tape`, `.tll-pp-tape`, `.tll-ex-tape`, `.tll-alb-tape`), badges at 11px (`.tll-pro-badge`, `.tll-pro-label`, `.tll-ex-badge`, `.tll-pp-paw`, `.tll-soon-tag`, `.tll-wt-tape`, `.tll-ux-stamp`), the lounge credit and open labels 10px and 9.5px, `.tll-alb-tape small` 9px, controls at 11px (`.tll-ux-chips button`, `.tll-alb-play`), and the "Annonce" ad label 10px. The 31 Oct layers (series, expat, pet passport, work trips, ux, stamps, album, collections, crew, export, metrics, paw, pros, home value) account for 43 of the 53 |

Classification across the 210: about 150 are eyebrows and mono key labels (JetBrains Mono, 600 weight, uppercase, 10 to 11px), about 35 are meta, captions and small print (10 to 10.5px, muted grey), and about 25 sit on controls: links and buttons at 9 to 11px (the Travel Wire chips and READ AT SOURCE link, the map view and chip buttons, the library Read the story and clear links, the legal tabs, the flow rail links, the expat finder links and button, the album Play button, the ux chips). Body text proper never goes under 12px in the saved code.

### 2.2 Designer classes under 12px (13 Oct style dump)

286 declarations on 267 distinct selectors in `tll-webflow.css`, the style dump of the Webflow Designer. 157 are unnamed `inline-*` classes (Webflow's generated names for one-off styled elements) and 117 are named classes. Named, by size:

- 9px (14): `.tll-trav-meta-light`, `.tll-spot-card-banner`, `.tll-trav-link`, `.tll-trav-pill`, `.tll-trav-badge-rose`, `.tll-stamp-text`, `.tll-trav-badge-amber`, `.tll-fyp-label`, `.tll-trav-badge`, `.tll-paw-ex-lbl`, `.tll-guide-tag`, `.tll-story-author-label`, `.tll-trav-meta`, `.tll-tag-meta`.
- 10px (46): `.tll-story-author-label-1`, `.tll-lib-meta`, `.tllpx-rate-label`, `.tlled-legend-item`, `.tll-fyp-pill-on`, `.tll-fos-label-press`, `.tll-places-label`, `.tll-paw-ex-eyebrow`, `.tlled-count`, `.tlllx-chip`, `.tllpx-ask-label`, `.tll-spot-mag-byline-by`, `.tll-fos-wire`, `.tll-places-note`, `.tll-inarticle-eyebrow`, `.tll-fos-cta`, `.tll-filter-label`, `.tll-lib-byline-name`, `.tlllx-quick-label`, `.tll-spot-eyebrow-meta`, `.tllpx-chip`, `.tllmx-chip`, `.tll-library-img-badge`, `.tll-lib-read`, `.tll-desk-date`, `.tll-paw-ex-meta`, `.tll-trav-label`, `.tll-fos-label-open`, the trip facts key label, `.tlled-how-title`, `.tllpr-lbl`, `.tllmx-stat-label`, `.tll-route-note`, `.tlled-ref`, `.tlllx-fact-label`, `.tll-shelf-chip`, `.tllpx-logi-label`, `.tll-fyp-pill`, `.tll-fos-label`, `.tll-sponsored-badge`, `.tll-mod-label`, `.tlled-stage`, `.tll-filter-chip-on`, `.tll-fos-cta-press`, `.tll-sl-title`, `.tll-fos-eyebrow`.
- 11px (56): `.tll-theme-pill`, `.tll-li-voucher-meta`, `.tll-dest-story-meta`, `.tllpr-kicker`, `.tll-ab-tagline`, `.tlllx-eyebrow`, `.tlllx-updated`, `.tll-spot-mag-tag`, `.tllcx-filed-eyebrow`, `.tll-li-pub-source`, `.tll-footer-col-eyebrow`, `.tll-pet-fact-label`, `.tll-spot-mag-byline-meta`, `.tllvb-label`, `.tll-spot-tag`, `.tll-chip-eyebrow`, `.tll-spot-filter`, `.tll-support-route`, `.tllpx-eyebrow-1`, `.tllmx-eyebrow`, `.tll-about-final-eyebrow`, `.tllsb-label`, `.tll-profile-tile-route`, `.tll-traveler-avail-badge`, `.tll-dest-intel-label`, `.tll-li-skill-vouch`, `.tll-region-count`, `.tll-spot-card-base`, `.tll-newsletter-fineprint`, `.tll-traveler-contact-card-num`, `.tll-li-platform-handle`, `.tll-pickin-card-num`, `.tll-share-step-num`, `.tll-ab-pledge-eyebrow`, `.tlled-eyebrow`, `.tll-featured-read-badge`, `.tll-contact-door-route`, `.tll-pet-num-label`, `.tll-statstrip-eyebrow`, `.tll-region-card-city`, `.tll-ab-eyebrow`, `.tll-spot-mag-flag`, `.tll-spot-mag-pillar`, `.tll-library-card-meta`, `.tll-library-news-fineprint`, `.tllsb-clear`, `.tll-micro`, `.tll-paw-pill`, `.tll-related-loc`, `.tll-pet-story-meta`, `.tll-nav-avatar`, `.tllcf-kicker`, `.tllpr-eyebrow`, `.tll-adsense-label`, `.tll-nav-signup`.
- 11.5px (1): `.tll-guide-fine`.

These are in the Designer, so they are Nancy's. The 19 Oct floor CSS (`tll-floor-v1`) lifts the ones it lists and the floor script catches the rest at load, but neither reaches text rendered later or text under an `!important` page rule.

### 2.3 Text still under 12px at runtime, after the floor

The 27 distinct runs the fixtures still rendered under 12px, and why the floor lost:

| Page | Text | Size | Why |
|---|---|---|---|
| story pages (all three) | "Quick answers" and "The short version" eyebrows (`.tll-aeo-eyebrow`) | 10px | st3 footer `font:600 10px … !important` |
| story pages | "Share this story" (`span.tll-micro.tll-text-mid`) | 10px | st3 footer share label `!important` |
| story pages | "Spain, and you?" and "Log in to save" (`.tll-places-label`, `.tll-places-note`) | 10.5px | st3 footer `!important` |
| story pages | "THE RECEIPTS" (`.tll-sl-title`) and the trip facts key labels (SUBMITTED BY, EDITED BY, TRIP, PUBLISHED, LAST UPDATED, WHAT IT COST, SOURCES, DISCLOSURE) | 10 and 10.5px | st3 footer `!important`; eight labels per story |
| /stories | "The Library" and "THE WEEKLY LAYOVER" (`.tll-eyebrow-rose`), "THE LIBRARY KEEPS GROWING" (`.tll-eyebrow-teal`) | 11px | stories footer `html.tllp-stories … !important` |
| /stories | "Place" (`.tll-filter-label`), "Read the story" (`.tll-lib-read`, a link) | 10.5px | stories footer and head `!important` |
| /signup, /login | "FREE TO JOIN", "· Welcome back, traveler ·", "· Sign in ·", "· Pick a door, traveler ·" | 11px | 13 Oct auth page code `.tll-auth-section .tll-auth-eyebrow … 11px !important` |
| /signup, /login | the field labels "First name", "Email", "Password" (`label.tll-micro`) | 11px | `.tll-micro` Designer class at 11px plus page code |
| /support | "The Layover Club · Optional, always" (an h4) | 11px | support head `[data-tll-club=eb]` 11px `!important` |
| /about | "ABOUT THAT LAYOVER LIFE" | 11px | `[class*=eyebrow]` 11px `!important` in the site head (the Designer class `.tll-about-final-eyebrow` is also 11px) |
| /for-expats | "FOR EXPATS · THE LOCATION EXPERTS", "Become a Location Expert" (`.tllpr-eyebrow`) | 11px | same site head rule |
| /account | "YOUR ACCOUNT" (`.tll-account-eyebrow`) | 11px | same |
| /the-paw-passport | "Paw Passport · For every travel companion" (`.tll-paw-pill`), "Example · so you know …" (`.tll-paw-ex-eyebrow`), "The Paw Passport · a field guide · PDF" (`.tll-fos-eyebrow`) | 11px | same, plus Designer classes at 10 and 11px |
| /destinations | "THE ATLAS", "THE MAP" (`.tlldx-eyebrow`), "EVERY COUNTRY · BY FLAG · 4", "STORY FILED" | 10 and 11px | ds3 head code `!important` and the site head rule |

Root cause in one line: `tll-floor-js-v1` writes `e.style.fontSize='12px'`, which any `!important` rule beats. `[class*=eyebrow]{font-size:11px !important}` in `tll-consistency-v1` (site head) is the single biggest source, followed by the st3 story footer and the page code of /stories, /signup, /login, /support and /destinations.

### 2.4 Contrast pairs

Computed from the saved CSS with the WCAG formula; where an element is drawn at an opacity, both colors are composited over the surface named. The four axe-measured failures are listed first.

| Ratio | Result | Text on background | Where |
|---|---|---|---|
| 2.59:1 | FAIL | cream #F7F1E8 on #00A9A4, 13px | `a.tll-cta-ghost-dark` on /contact and /support: the Designer class sits on the dark section with the retired teal, and the footer contrast script (`tll-core-v2`, writes `data-tc`) paints the text cream because it judges the surface dark |
| 3.07:1 | FAIL | #F0507A on #F8F2E6, 16px bold | /stories newsletter block, `.tll-library-newsletter h3 em` from the stories footer rule `html.tllp-stories .tll-library-newsletter h3 em{color:var(--s3-rose) !important}`, which beats the site contrast layer |
| 4.31:1 | FAIL | #C8325B on #EFEAE1, 16px bold | `.tll-contact-faq-card h3 em.tll-text-rose` on /contact: the rose-on-light rule is only safe on cream and white, not on the FAQ card's darker surface |
| 3.07:1 | FAIL | #F8F2E6 on #F0507A, 16px bold | `input.tll-btn-primary` on /newsletter: the Designer class pairs bone text with the bright rose; the contrast layer only recolors the nav buttons and `.tll-cta-rose` |
| 1.97:1 | FAIL (as it was) | #00C9C8 on paper #FDF9F3 | the known Keep reading label, bright teal on paper. Current code: the story layer `tll-mag-story-v1` sets the related header eyebrow to #6B6660 on cream, 5.06:1, and the st3 footer alone gives #067A79 on cream, 4.60:1; axe found no failure on the three story fixtures |
| 1.84:1 | FAIL | #00C9C8 on cream #F7F1E8 | any `[class*=eyebrow]` inside a container the site head treats as dark (`.tll-section-dark`, the hero classes, footer, `.tll-story-hero`) that is actually cream; also the 11px teal eyebrow over photos when the photo is light (axe marks those "needs review", 1 to 107 per page) |
| 1.44:1 | FAIL | #cfcbc4 on cream #F7F1E8 | legal tabs `[data-tll-legal=tabs] a` (privacy and terms page code, 10px): the grey was chosen for a dark surface; on cream it is 1.44:1, on ink 12.13:1. The active tab, ink on rose, is 5.73:1. Which surface the tabs sit on is a Designer setting (not in the saved code) |
| 2.67:1 | FAIL | white on rose at 45% over ink | support club Join button `[aria-disabled=true]{opacity:.45}` (the "dimmed buttons near 2:1") |
| 4.16:1 | FAIL | cream at 45% over ink | support club Tip button, same rule |
| 2.35:1 | FAIL | white on rose at 55% over cream | `.w-button:disabled{opacity:.55}` in the site footer (`tll-forms-v2`), every disabled submit button on the site |
| 2.32:1 | FAIL | white on rose at 55% over paper | `.tll-ux-btn[disabled]` in `tll-ux-v1.js` |
| 2.54:1 | FAIL | white on rose at 60% over cream | `.tll-exp button[disabled]` in `tll-export-v1.js` |
| 2.98:1 | FAIL | #9a958c on white | `::placeholder` in `tll-craft-polish` (site head), every placeholder on the site |
| 2.65:1 | FAIL | #9a958c on cream | same rule on cream fields |
| 3.42:1 | FAIL | white on #F0507A, 9px | Travel Wire region tag EUROPE |
| 2.76:1 | FAIL | white on #D98A2B, 9px | Travel Wire region tag AMERICAS |
| 3.22:1 | FAIL | #b8791f on #fbf0df, 9px bold | editorial charter DRAFT badge |
| 3.23:1 | FAIL | #b8791f on cream | editorial charter clients line `[data-tll-rule08=clients]` |
| 2.63:1 | FAIL | #D98A2B on paper | the amber mono label (`--st3-amber`, "Traveler of the week" 11px on /spotlight) |
| 3.05:1 | FAIL (overridden) | #F0507A on cream | `h1 em` and `.tll-text-rose` before `tll-contrast-v1`; the layer recolors `.tll-text-rose` to #C8325B (4.60:1) but not `h1 em`, which the site head sets to the bright rose with `h1 em{color:var(--tll-rose)}`. The h1 sizes on the site are large text (3:1 threshold), so this passes on h1 only |
| 3.42:1 | FAIL (overridden) | white on #F0507A | nav Sign up and Share your story before `tll-contrast-v1`, which moves them to #D63859 (4.60:1) |
| 4.78:1 | pass | #C8425E on white, 11px | `.tll-shelf-eyebrow` |
| 12.13:1 | pass | #cfcbc4 on ink, 10px | contact relay note |
| 7.27:1 | pass | #9a9cb3 on ink | support club note |
| 5.06:1 and 5.42:1 | pass | #6B6660 on cream and paper | muted meta and captions |
| 6.74:1 | pass | #9496AC on ink | v9 grey repair on dark |
| 9.41:1 | pass at worst | #B9B3A8 on ink | cover byline where the photo gradient is darkest; lighter photo areas are "needs review" |
| 4.60:1 | pass at worst | cream on 60% ink over a white photo | cover chip `.tll-mg-chip` |
| 7.23:1 | pass at worst | cream on 72% ink over a white photo | `[data-tll-loc] > span` location pill |
| 6.92:1 | pass | #06302f on #00C9C8 | home search button |
| 9.51:1 | pass | #00C9C8 on ink | eyebrows on true dark sections |
| 10.13:1 | pass | #3a3a3a on cream | story body text |
| 5.73:1 | pass | ink on #F0507A | skip link |
| 4.60:1 | pass | white on #D63859 | nav buttons, cover CTA, `.tll-cta-rose` |
| 8.29:1, 4.78:1, 5.68:1, 5.16:1, 11.37:1 | pass (size fails) | Travel Wire GLOBAL and MIDDLE EAST tags, source line, READ AT SOURCE link, chips | the colors pass; the 9 and 10px sizes do not |
| 7.12:1 | pass | #D98A2B on ink | support club "soon" label |

Totals: 17 computed pairs fail (3 of them already overridden in the current cascade for the elements the contrast layer covers), 4 measured by axe fail, 21 distinct.

### 2.5 aria-label values versus visible text

60 aria-label uses read across the layers, the cover layer and the page code (`static-scan.json` `ariaLabels`); axe ran the 2.5.3 rule on all 22 fixtures.

- Fails: the footer wordmark link. `tll-footer-wordmark-v1.js` sets `aria-label="That Layover Life, home"` on a link whose three spans read "that", "LAYOVER", "LIFE." with no spaces between them, so the visible string "thatLAYOVERLIFE." is not contained in the name. Every page, 44 runs.
- Passes with a note: `Remove <country>` on a × button, `Previous` and `Next` on ‹ and ›, `What is this?` on a ? mark (punctuation-only visible text is exempt); `<name>, writer page` and `<name>. Open the profile` contain the visible name; `Tell the editor` matches; `Remove …` on buttons reading Remove.
- aria-label on elements where it is prohibited (no role): `div.h3-cards[aria-label="Postcards from the Lounge"]` in the home shelf embed (axe needs review), `div.tll-ex-badges[aria-label="Milestones"]` in `tll-expat-v1.js`, and the language tag `span[aria-label=<language name>]` in `tll-card-lang-v1.js` (staged, not in the v16 bundle), where the visible text is the two-letter code and the name is the language, which is also a 2.5.3 mismatch if the tag is ever made interactive.

### 2.6 Roles

56 role uses read (`static-scan.json` `roles`) and the axe rule on every fixture. One is not allowed: `role="banner"` on `<nav class="tll-nav-v1">`, set by `tll-v9-chrome-js-v1` in the site head when the nav has no header around it. Every other use is valid for its element: `group`, `radiogroup`, `dialog` with `aria-modal`, `region` with a label, `status`, `alert`, `img` on spans and SVGs, `button` and `link` on spans with `tabindex="0"` (the chrome script adds Enter and Space handling), `combobox`, `listbox` and `option` on the expat country finder, `navigation` and `contentinfo` as fallbacks. One to watch: `tll-share-v1.js` (not in the v16 bundle) uses `role="radio"` on buttons inside a `radiogroup`, which is allowed.

### 2.7 Form fields: labels and shared ids

Measured on the 13 October export pages (the Designer's form markup, which is also what Memberstack binds to), signed out, with the 29 Oct layers running on top.

| Page | Fields | Share an id | Ids shared | No label at all |
|---|---|---|---|---|
| /submit | 82 | 34 | `field` (country, city, name, excerpt, body, reading time and more), `checkbox` | 1 hidden file input (`hero-image`) |
| /edit-profile | 57 | 23 | `field` (18 inputs and textareas), `checkbox` (5) | 7, all hidden inputs the layers add |
| /share-photos | 16 | 12 | `field` (country, caption, city, year, pets along and more), `radio` | 0 |
| /my-pets | 12 | 6 | `field` (name, breed, age, bio, avatar, gallery) | 0 |
| /contact | 4 | 4 | `field` (name, email, message, honeypot) | the hidden honeypot only |
| /signup | 5 | 3 | `field` (first name, email, password) | 0; axe also flags two fields with more than one label |
| /login | 2 | 2 | `field` (email, password) | 0 |
| /newsletter | 1 | 0 | | 1: `input#email` has no label (axe critical) |
| / home | 2 to 4 | 0 | | 1: `#h3-news-email` has no label in the 13 Oct embed (axe critical) and only a placeholder in the 28 Oct embed |

84 fields on 7 pages share an id; on those pages no `label for` can bind to more than the first field, and password managers and screen readers get "field, field, field". The 9 October review counted 16 on the pages it opened (signup, login and parts of edit-profile); this count covers every form page in the export. The 29 Oct layers (`tll-ep-ux-v1`, `tll-submit-ux-v1`) relabel some controls at runtime for signed-in members; the fixtures are signed out, so that could not be confirmed here.

### 2.8 Landmarks and heading outline: charter, guidelines, Travel Wire

Their page bodies live in the Designer and are not in the saved code. What is saved: `reports/evidence/2026-09-30/webflow/page-code/editorial-charter.head.html` (one small style block that turns h6 elements in the charter numbering into plain text, which suggests the charter uses h6 for decoration), `community-guidelines.head.html` and `faq.head.html` (a canonical link only), and `src/pages/sweep-2026-10-19/travel-wire-footer-after.html` (the wire renderer, which builds the headline list from divs with inline styles, no headings and no list markup, inside `#wire-list`). So: no `<main>` or h1 check is possible from the saved code for these pages, and the Travel Wire renderer adds no heading structure of its own. The 13 Oct export does show that six of its eighteen pages have no `<main>` (index, account, destinations, edit-profile, login, signup), so the charter and guidelines pages should be checked in the Designer too.

### 2.9 Focus styles under sticky and floating elements

- Tell the editor: the round 44px pill (`tll-note-phone-v1`, under 960px) is `position:fixed` bottom right. At 390 the focus ring of 29 distinct elements on 7 fixtures is drawn under it when they scroll into that corner (section 1.3). `tll-ux-1028-v1` already hides the pill until the home hero has scrolled past and brings it back on focus; nothing moves it out of the way of a focused link beneath it.
- Cookie banner: the live banner is Google's certified consent message (Funding Choices, since 31 Oct), loaded from google.com, so it could not be loaded or tested offline. The old CookieConsent styles in the site head (`#cc-main` variables) still exist but the banner never shows. Its focus order, Esc handling and contrast have to be checked live.
- Three search inputs show no visible ring on focus (section 1.3): `box-shadow:none !important` in the home search pill and the library search slot removes the ring the craft-polish rule paints, and the 3px outline from v9 chrome is not reaching them in the fixture.

## 3. The split

### 3.1 Code we own (site layers, cover and story layers, site head and footer, page custom code), with the fix

1. Footer wordmark name mismatch, serious, every page. `src/site-layers/tll-footer-wordmark-v1.js`: drop the `aria-label` and add a visually hidden span `, home` after the three words, or set `aria-label="that LAYOVER LIFE. Home"` and put a space between the spans (the spans are inline-flex with a gap, so the DOM text has no spaces).
2. Newsletter email field without a label, critical. Home shelf embed (`src/pages/home/live-2026-10-28/…` news form, `#h3-news-email`): add `<label for="h3-news-email" class="tll-sr">Email</label>` or `aria-label="Email"`. The 13 Oct embed in the cover-build fixture has neither; the 28 Oct embed has a placeholder only. /newsletter `input#email`: same, in the page code or the Designer form.
3. Empty link `a.h3-open` in the home shelf, serious. Already gone from the 28 Oct embed; confirm live and keep it out.
4. Stories newsletter em, 3.07:1, serious. `scratchpad/p0-1031/before/stories-footer.html`: change `html.tllp-stories .tll-library-newsletter h3 em{color:var(--s3-rose) !important}` to `var(--s3-rose-t)` (#C8325B, 4.60:1 on cream).
5. Ghost CTA on contact and support, 2.59:1, serious. Add to `src/site-layers/tll-contrast-v1.html`: `body a.tll-cta-ghost-dark{background:transparent !important;color:#F7F1E8 !important;border-color:rgba(247,241,232,.5) !important}` so the text sits on the ink section (12:1), or `color:#0A0B14 !important` if the teal fill stays (ink on #00A9A4 is 7.2:1). The class itself is the Designer's (see 3.2).
6. Newsletter submit button, 3.07:1, serious. Add `body input.tll-btn-primary,body .tll-btn-primary{background:#D63859 !important;color:#fff !important}` to `tll-contrast-v1`, until the Designer class changes.
7. Contact FAQ card em, 4.31:1, serious. `tll-contrast-v1`: `body .tll-contact-faq-card .tll-text-rose{color:#B82C4B}` (6.0:1 on #EFEAE1), or ask for the card surface to be cream.
8. Place chips row on /stories at 390, serious. `src/site-layers/tll-stories-places-v1.js` or the stories head: let `.tll-chip-row[data-tll-places]` wrap on phones instead of scrolling, or give the row `tabindex="0"` and an `aria-label`.
9. `role="banner"` on the nav, minor but on every page. `tll-v9-chrome-js-v1` in the site head: only set `banner` when the element is not a `nav`; when it is, set `role="banner"` on its parent wrapper or leave it.
10. No `<main>` on home, the Stories template, /account, /edit-profile, /login, /signup and /destinations. Interim in the same chrome script: if no `main` exists and `#tll-main` does, set `role="main"` on `#tll-main`. The real fix is the page wrapper tag in the Designer (3.2).
11. The 12px floor loses to `!important`. `tll-floor-js-v1`: use `e.style.setProperty('font-size','12px','important')`. And retire the 11px source rules: `[class*=eyebrow]{font-size:11px !important}` in `tll-consistency-v1` becomes 12px (the home hero already does this in `tll-v91-hero-scrim-v1`); the 21 st3 footer rules, the 8 stories footer and head rules, the support club eyebrow, the auth page eyebrows and labels (page code of /signup and /login, 13 Oct), the ds3 head rules: set every 9, 10, 10.5 and 11px to 12px. In the 25 layer files, change the shared pattern `font:600 11px/1.4 "JetBrains Mono"` to 12px and the 10px flags and tapes to 12px; 53 declarations, listed in 2.1. Travel Wire renderer (`travel-wire-footer-after.html`): 9px tag, country, source line and READ AT SOURCE link to 12px, chips to 12px and 44px tall. Legal tabs to 12px.
12. Dimmed buttons. `tll-forms-v2` in the site footer: replace `.w-button:disabled{opacity:.55}` with a solid disabled style that keeps 4.5:1 (for example background #E0DACE, color #0A0B14, or #D63859 at full opacity with `cursor:not-allowed`); same for `[data-tll-club][aria-disabled=true]{opacity:.45}` in the support head, `.tll-ux-btn[disabled]` in `tll-ux-v1.js`, `.tll-exp button[disabled]` in `tll-export-v1.js`.
13. Placeholders, 2.98:1. `tll-craft-polish` in the site head: `::placeholder{color:#6B6660}` (5.1:1 on white, 4.9:1 on cream).
14. Legal tabs, 1.44:1 on cream, 10px. `privacy.head.html` and `terms.head.html` (page code): `color:#0A0B14` or `#6B6660` with `border-color:#E0DACE` for the off state on cream, `font-size:12px`, `min-height:44px`. If the tabs sit on the dark hero, keep #cfcbc4 (12.1:1) and only fix the size.
15. Charter page code: the DRAFT badge (9px bold, 3.22:1) to 12px and `color:#8a5a14` (5.9:1 on the tint); the clients line `#b8791f` on cream (3.23:1) to `#8a5a14`.
16. Amber labels on light surfaces: `--st3-amber` #D98A2B on paper is 2.63:1 (used for the 11px "Traveler of the week" label on /spotlight and the destinations card meta #8A5A12 is fine at 6.4:1). Use #8a5a14 for amber text on cream or paper; keep #D98A2B for amber on ink.
17. Tell the editor pill over focused links. `tll-ux-1028-v1.js` already toggles `.tll-note-out`; extend it: on `focusin`, if the focused element's rect intersects the pill's rect, add `tll-note-out` until focus moves, and give `html{scroll-padding-bottom:72px}` so keyboard scrolling stops above the pill.
18. Three search inputs with no visible focus ring: in `tll-v9-chrome-v1`, add `form.tll-home-search input[type=text]:focus-visible,#tll-lib-q:focus-visible,#h3-news-email:focus-visible{outline:3px solid #0A0B14 !important;outline-offset:2px !important;box-shadow:0 0 0 6px #00C9C8 !important}` after the pill rules, or drop the `box-shadow:none !important` on those inputs.
19. aria-label on plain containers: home shelf embed `div.h3-cards`: move the label to the section heading with `aria-labelledby`, or make the div `role="region"`; `tll-expat-v1.js` `div.tll-ex-badges`: `role="group"`; `tll-card-lang-v1.js`: put the language name in a `title` and a visually hidden span, not an `aria-label` on a span.
20. Empty `h2.tll-lib-title` on /stories: `tll-stories-noimg-v1.js` or the s3 footer: do not output the heading when the card has no title, or fill it with the story name.
21. Stamp SVG text on the cover and story pages (8 to 9.5px in a 200-unit viewBox) is `aria-hidden` and decorative, so it is not a text-size failure; keep it `aria-hidden` and keep the real byline in text, which the layers already do.
22. Checkboxes on /signup render at 18 by 18 (Webflow default). Page code or the auth layer: `.w-checkbox-input{width:24px;height:24px}` and a 44px tall label row.

### 3.2 Designer (component styles, Webflow classes, nav and footer, page structure), for Nancy

1. Give every page a `<main>`: home, the Stories template, Account, Edit profile, Login, Signup, Destinations have none in the 13 Oct export; the skip link already points at `#tll-main`, so setting that wrapper's tag to `main` closes it. Check the Editorial charter, Community guidelines, FAQ, Travel Wire and the legal pages the same way; their bodies are not in the saved code.
2. Footer component: the column titles are `h4` and follow an h2 or h3, which breaks the outline on 19 pages; make them `div` with the eyebrow style, or h2 if the footer should be in the outline. If the wordmark fix is done in the Designer rather than the layer, give the link one text node "that LAYOVER LIFE." with spaces.
3. Nav component: the wordmark link is 121 by 22 (under the 24px target floor); give it 44px of height with padding. `.tll-nav-signup` is 11px in the Designer (the layers lift it to 13 to 14px).
4. `.tll-cta-ghost-dark` (contact, support): its text ends cream on the retired teal #00A9A4, 2.59:1. Set the class to a transparent fill with a cream border on the dark section, or ink text on the teal.
5. `.tll-btn-primary` (newsletter): bone text on `--_colors---tll-rose` #F0507A, 3.07:1. Use `--_colors---tll-rose-dark` #D63859 with white text, as the nav buttons already do.
6. `.tll-contact-faq-card`: the #EFEAE1 surface drops rose text to 4.31:1; make the card cream or paper.
7. The 117 named classes under 12px listed in 2.2, and the 157 unnamed `inline-*` ones: set every 9, 10, 10.5 and 11px to 12px in the Designer so the runtime floor has nothing left to catch. The ones that are controls matter most: `.tll-lib-read`, `.tll-shelf-chip`, `.tll-filter-chip-on`, `.tll-fyp-pill`, `.tll-fyp-pill-on`, `.tll-fos-cta`, `.tll-fos-cta-press`, `.tll-trav-link`, `.tll-trav-pill`, `.tllsb-clear`, `.tll-nav-signup`, `.tll-micro` (the auth field labels).
8. Form field ids: 84 fields on Submit, Edit profile, Share photos, My pets, Contact, Signup and Login share `id="field"`, `checkbox` or `radio`, so labels cannot bind. Each input needs its own id and a label with a matching `for` (the element settings panel; the Data API's element-settings tool may be able to set `domId` as a staged change, with every `data-ms-*` attribute left untouched). Newsletter: the email input needs a label.
9. Signed-out states on Account, Edit profile, My pets and Share photos show no h1 (the sign-in prompt is an h2).
10. Legal pages: confirm which surface the tab row sits on (cream or the dark hero), since the 10px grey tabs are 1.44:1 on cream and fine on ink.
11. Contact and Support jump from h1 to h3 cards (`.tll-contact-door-title`, `.tll-support-card-title`); make them h2, or add an h2 above the grid.
12. Google's consent message: once live access is back, check it with a keyboard (focus trap, Esc, visible focus) and its contrast; it is not ours to style, but it is the first thing a visitor meets.

## 4. Limits of this offline run

- No live site. Fixtures are stand-ins: 13 October export bodies with the 26, 28 and 29 October trees and embeds spliced in; the nav and footer are the 13 October export components; not pixel-true. Any Designer change after 13 October to the form pages, the nav or the footer is not reflected.
- Not loaded: Webflow's runtime (webflow.js, jQuery), Memberstack, d3 and the world atlas, CookieConsent, Google Funding Choices, GA4, Ahrefs, AdSense. So: the map does not draw, Webflow interactions and dropdowns do not run, every page is signed out, Memberstack-gated blocks and the 29 Oct relabeling of member forms could not be checked, the consent banner could not be tested, and the old CookieConsent footer handler throws on every page.
- The Worker API (`workers.dev`) was answered with an empty stub, so counts, stamps, photos and the Travel Wire feed are empty; one layer throws `forEach` on /stories, /for-expats and /the-paw-passport because of that.
- Charter, guidelines, FAQ, Travel Wire, privacy, terms and cookies have no saved body; only their page code was read. The legal tab surface and the charter and guidelines outlines are Designer facts.
- Text over photos and gradients: axe cannot compute the background, so 1 to 107 nodes per page are "needs review" rather than pass or fail (the cover chip, kicker and h1, the page-hero captions, the hero eyebrows on contact, support and stories, the stamp SVG).
- Fonts are local stand-ins (Playfair Display 800, JetBrains Mono 400 and 600, Newsreader, Inter Tight, IBM Plex Sans Condensed 400 and 600); Teko, Dancing Script and the aliased families fall back, so line wraps and target heights can differ by a pixel or two from live.
- Page code is 13 October for Signup, Login, Edit profile, My pets, Newsletter, Account (head) and The Paw Passport, because no newer copy is saved; the other pages carry their 23 to 31 October code by id.
- Focus-visible was detected by programmatic focus after one Tab keypress (Chromium's heuristic), an approximation of real keyboard tabbing; the "covered by the note" check compares boxes after `focus()` scrolls the element into view, which can differ from a user's scroll position.
- The 390 and 1440 runs were the only widths; 768 and 1024 were not run.
- Lighthouse was not run.
