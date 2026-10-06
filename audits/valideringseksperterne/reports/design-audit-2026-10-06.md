# Design audit: valideringseksperterne.dk, 6 Oct 2026

⚠️ DEGRADED: single-context (design review and detector ran in one context; no separate sub-agents were spawned for this pass)

Target: the corrected `index.html` queued for upload (the live page is blocked from this environment). Skills applied: Impeccable (audit and critique playbooks, mechanical detector), Taste Skill (design-taste-frontend, redesign-preserve mode), Emil Kowalski design engineering (motion, press and hover states). Brand kit: Damgaard Brand Kit + Strategy v14 (Google Drive, Damgaard Brand folder). Evidence: Chromium renders at 375, 768 and 1440 px, axe-core (0 violations), Impeccable detector (30 findings, 27 warnings, 3 advisories).

Design read (Taste Skill 0.B): B2B service landing page for hospital sterile-supply and technical managers, trust-first and regulated, Navy and Montserrat per the kit, redesign-preserve. Dials: variance 4, motion 3, density 5.

Brand kit precedence: Navy #12263A, Steel Blue #4885A5 (accent, eyebrows, icon strokes, never a full-section background), Sky #5096B3 (interaction states only), Off White #F7F8F9, Montserrat throughout, US English rule does not apply to Danish copy, no em dashes, no pure black. The detector's "overused font: Montserrat" finding is a false positive here because the kit mandates Montserrat.

Kit conflict to decide: the kit says "Named clients where approved. 'Novo Nordisk' beats 'a major pharma client'" and lists Novo Nordisk and Bavarian Nordic as reference clients. Nancy's standing rule for the .dk is that clients stay anonymized. The page follows the .dk rule. Flagging per brand-kit-at-hand; no change made.

## Audit health (Impeccable technical dimensions)

| Dimension | Score | Key finding |
| --- | --- | --- |
| Accessibility | 3/4 | axe 0 violations, focus ring present. Hover states fall under 4.5:1 (white on Steel 4.06:1, white on Sky 3.3:1). Placeholders used as labels. |
| Performance | 3/4 | Two base64 JPEGs inline (232 KB of HTML), fonts from Google servers, no width/height on images. No animation cost. |
| Responsive | 3/4 | Fits 375, 768 and 1440 with no overflow. Under 900 px the nav hides every link and the Book button, leaving no navigation and no CTA until the hero. |
| Theming | 3/4 | Full token set, kit colors. Light-world only, which the kit allows. |
| Implementation integrity | 2/4 | Detector: 7 section kickers, 3 accent-bordered rounded cards, 8 ten-pixel labels, 3 numbered USP labels. Three-equal-card grids twice. Reads as a template with good copy. |
| Total | 14/20 | Good: address the weak dimensions |

## Top 10 fixes, ranked by visual impact

| # | Element | What is wrong | Flagged by | Proposed change | Effort |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero and the trust band under it | Hero stacks five text elements (eyebrow, H1, lede, two CTAs, a four-item fact row). Then the trust band is one orphaned sentence on the left with empty space on the right, because the client names were removed. | Taste Skill (hero stack discipline, trust strip belongs under the hero), Impeccable (hierarchy) | Move the four facts (30+ år, standarder, fast pris, Skandinavien) out of the hero into the trust band as a single four-column strip, and shorten the eyebrow to "Revalidering af sterilisatorer". The hero becomes eyebrow, H1, lede, CTAs, and ends cleanly above the fold at 1440. | M |
| 2 | Nav below 900 px | `.nav-links` and `.nav-cta` are `display:none`, so phones get only "DA · EN". The primary action disappears until the user scrolls into the hero. | Impeccable adapt (Casey persona: action out of thumb reach), Taste Skill nav rule | Keep a compact "Book vurdering" pill in the mobile nav (13 px, 40 px tall) and move the four section links into a `<details>` menu or drop them on mobile, since all four are one scroll away. | S |
| 3 | Section eyebrows | Seven uppercase kickers above seven H2s (Udfordringen, Omfang, Aftalen, Hvem leverer det, Hvorfor Damgaard, Start her, Spørgsmål vi ofte hører). Same rhythm on every section. | Taste Skill (max 1 eyebrow per 3 sections), detector kicker-above-heading x7 | Keep two: the hero eyebrow and "Start her" on the CTA. Delete the other five; the H2s already name the topic. | S |
| 4 | Three-equal-card grids (Udfordringen, Hvorfor Damgaard) and the four step cards | Two three-equal-card rows plus a four-card row, all white cards with 1 px borders. The USP cards add a 4 px Steel top border on a 10 px radius, which the detector flags three times. | Taste Skill (three-equal-cards ban, section-layout repetition), detector border-accent-on-rounded x3 | Udfordringen: one lede plus a three-item list with hairline dividers, no cards. Hvorfor Damgaard: two columns, each USP as heading plus one sentence, divided by a single vertical rule, no top borders. Keep the four process steps as cards (sequence earns the grid) but drop their borders in favor of a 1 px rule and the "TRIN 0x" label. | M |
| 5 | Button and link hover states | `.btn-primary:hover` is white on Steel (4.06:1). `.btn-on-dark-primary:hover` is white on Sky (3.3:1). `.nav-links a:hover` is Steel on white (4.06:1). No press state anywhere. `transition` is on three properties at 0.18s with default easing. | Emil (buttons must feel responsive, custom ease-out, exact properties), WCAG 1.4.3, detector low-contrast x3 | Hover fills and text use the existing `--steel-text` #2C6382 (6.5:1 with white). Add `:active { transform: scale(0.97) }` with `transition: transform 160ms cubic-bezier(0.23,1,0.32,1), background-color 160ms, color 160ms`. Sky stays for focus rings and the on-dark secondary hover border, which the kit allows. | S |
| 6 | Contact form | Placeholders act as labels (Navn, E-mail, Virksomhed, Besked). Placeholder gray on Navy is flagged four times. No visible label survives once the user types. | Taste Skill (no placeholder-as-label, ever), Impeccable gray-on-color x4 | Visible 12 px labels above each field in white at 0.9 opacity, placeholders become examples or go away, error text reserved below each field. Keeps the aria-labels already added. | S |
| 7 | Motion hygiene | No `prefers-reduced-motion` block. `scroll-behavior: smooth` is unguarded, so anchor links animate for users who asked for no motion. Hover effects are not gated for touch. FAQ `<details>` snaps open with a "+" to "–" glyph swap. | Emil (reduced motion, hover gating, interruptible transitions), hard rule in CLAUDE.md | Wrap `scroll-behavior: smooth` and all transitions in `@media (prefers-reduced-motion: no-preference)`. Gate hover rules behind `@media (hover: hover) and (pointer: fine)`. Rotate the FAQ marker 45° over 200 ms ease-out instead of swapping glyphs, and fade the answer in with opacity only. | S |
| 8 | Ten-pixel micro-labels | Eight labels at 10 px with 2 px tracking: hero facts (Erfaring, Standarder, Pris, Dækning), CTA contact (E-mail, Telefon, Åbningstider), footer labels, and the "En del af Damgaard Solutions" line. | Impeccable detector undersized-ui-text x8, Taste Skill legibility | Set the label scale to 12 px with 1.5 px tracking. The brand endorsement line goes to 11 px. Nothing else moves. | S |
| 9 | Trust sentence and client naming | "Ingeniørleverancer betroet på Europas mest compliance-tunge GMP-sites." is a claim with no visible proof now that names are gone. | Brand kit v14 (named clients where approved) versus the .dk anonymization rule; Taste Skill copy self-audit | Decision for Nancy and Kasper: either name Bavarian Nordic (the kit marks it as approved for DS) or replace the sentence with a verifiable fact already on the page, such as the four standards. Fix 1 absorbs the band either way. | S |
| 10 | Numbered USP labels and image attributes | "01 / 02 / 03" labels above the three USPs add nothing. The two `<img>` tags have no `width` and `height`, so the browser relies on the CSS aspect-ratio for layout. | Taste Skill (section-number labels), detector numbered-section-labels x3, Impeccable performance | Remove the three numbers (keep "TRIN 01" to "TRIN 04", which carry sequence). Add `width="1100" height="1100"` and `width="900" height="900"` to the images, plus `loading="lazy"` on the specialist portrait. | S |

## What already works

- Navy, Steel, Sky and Montserrat are applied exactly as the kit specifies, with Steel kept to accents and never used as a section fill.
- One radius system: pills for buttons and chips, 10 px for cards and inputs. Consistent across the page.
- Contrast on static text is clean (axe 0 violations), the focus ring is visible, every image has alt text, the form has a honeypot and `autocomplete`.
- The hero headline is specific to the product and audience. It could not be lifted onto another site unchanged.

## Applied 6 Oct 2026 after Nancy approved all ten (fix 9: anonymized, folded into the facts strip)

All ten fixes are now in the corrected `index.html` (local draft, not uploaded). `changes-design.diff` shows exactly what moved against the previous corrected file.

| Check | Before | After |
| --- | --- | --- |
| Impeccable detector findings | 30 | 4 (the two approved eyebrows, the textarea placeholder which measures 7.3:1, and the Montserrat false positive) |
| axe-core violations | 0 | 0 |
| Hero bottom edge at 1440 x 900 | 1,070 px (facts row pushed the CTAs past the fold) | 840 px, CTAs inside the first viewport |
| Mobile nav at 375 | brand lockup and language switch only | brand lockup and "Book vurdering" pill, 355 px right edge, no overflow |
| Hover contrast | 4.06:1 and 3.3:1 | 6.5:1 and 14.5:1 |
| Press state | none | `scale(0.97)` at 160 ms ease-out, disabled under reduced motion |
| Section eyebrows | 7 | 2 |
| Card boxes | 10 (3 problem, 4 step, 3 USP) | 0; divided lists and rules instead |
| Form labels | placeholders only | visible labels with `for`/`id`, optional fields marked "(valgfri)" |
| 10 px labels | 8 | 0 (12 px, endorsement line 11 px) |
| Image dimensions | none | `width`/`height` plus `height:auto` so the CSS aspect ratio still governs; `decoding="async"`; no `loading="lazy"` (useless on inline data URIs and it left the portrait undecoded in full-page renders) |

Two regressions caught and fixed during verification: adding `width`/`height` to the photos overrode the CSS `aspect-ratio` and stretched both into tall crops (`height: auto` on `.photo-img` restored the 500 and 300 px squares at 1440), and `loading="lazy"` on the inline portrait kept it from decoding in a full-page capture (removed).

Copy wording is unchanged except one punctuation swap in the facts strip ("ISO 17665, EN 285, ISO 15883" instead of middle dots) and the two "(valgfri)" markers on optional form fields. The hero lede is still about 30 words, above the Taste Skill's 20-word guide; shortening it is a copy decision for Nancy, not applied.

## Roster added 6 Oct 2026 (Nancy's four headshots)

The single-specialist block (Morten Winsløw, portrait plus four bullets) is now a four-person roster: photo, name, role. Photos are 600 px JPEGs in `img/` (37 to 43 KB each) instead of inline data, and the scope photo now points at `og-image.jpg`, so `index.html` dropped from 346 KB to 37 KB. Names and surnames come from Nancy's mapping plus the Damgaard SharePoint member list (Morten Winsløv/Winsløw, Peter Mastrup, Raquel Petersen, Valeria Meloni).

Open before upload, marked in the file:
- Valeria Meloni's role shows "[Rolle bekræftes]"; no source gives it. Replace before upload.
- Peter Mastrup's role "Senior ingeniør, autoklaver og vaskemaskiner" is a Danish rendering of his Damgaard CV (Senior Engineer, specialist autoclaves and washers). Confirm the wording.
- Raquel Petersen's role "Projektleder" comes from the Kunderum customer guide ("jeres projektleder, Raquel"). Confirm.
- Morten's four bullets (30+ år, Belimed/Steelco/Miele, CSSD-automation, languages) left the page with the roster layout. The 30+ år fact survives in the facts strip. Say if any bullet should return as a one-liner under his role.
- The SharePoint list spells Morten's surname "Winsløv"; the page keeps the existing "Winsløw". Confirm which is right.

Still open from the craft floor, not in the approved scope: card radius 10 px (the floor prefers 12 to 16 px for cards, though no cards remain), Montserrat served from Google (legal audit fix D), and the hero lede length.

## Evidence

- Renders: `scratchpad/vk/design-audit/mode-A-{375,768,1440}.png` (session scratchpad, not committed)
- Detector: `impeccable detect --json index.html`, 30 findings (8 undersized-ui-text, 7 kicker-above-heading, 4 gray-on-color, 3 border-accent-on-rounded, 3 low-contrast, 3 numbered-section-labels, 1 all-caps-body, 1 overused-font false positive)
- axe-core wcag2a/wcag2aa/wcag21aa/best-practice at 390 px: 0 violations
