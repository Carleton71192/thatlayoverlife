# Sweep Nov 21, 2026, lens DESIGN: visual consistency at 390 and 1440 against Brand Kit v2.6

Read only. No Webflow, Memberstack, Cloudinary or Worker writes; no form sent; every non-GET aborted.
Live state: core 16.68.0 (layers-release pin 0f04fabf), www as served on Nov 21, 2026 (the same plain-GET cache as the debug and UX lenses).
No member data in this file or the evidence: profile paths are masked as /contributors/<profile>, text excerpts and names are stripped
from design/design-evidence.json, and no screenshot is committed (they show member photos and names).

## How

- Yardstick: handoff/TLL-BrandKit-v2.6.html (section 04, the v2.2, v2.3, v2.4 and v2.6 rule blocks, Claude Design presets 02 and 05)
  and handoff/Cowork_ContentGen_Prompt_v1.4.md (TLL colors and fonts, unchanged from the kit). Kit values used: Playfair Display 800
  display, IBM Plex Sans Condensed body (buttons 600), JetBrains Mono 400/600 meta at 12 px or more; Ink, Midnight #0A0B14, Paper,
  Cream, Deep Teal #067A79 for text links on light, #C8325B small rose text and hover, filled buttons #D63859 with white labels,
  square corners on buttons and photos (--radius-photo 0, --radius-button 0), one card radius token (10 px), spacing steps 8, 16, 24, 40, 64.
- Harness: the debug lens harness (h.cjs = debug/bin/d.cjs with the output folder moved and deviceScaleFactor 1), so documents come
  from the GET cache and every Webflow CSS, JS, font and image from the shared asset cache. Webflow-host bytes fetched by this lens:
  88 KB (2 files; everything else was cached). One browser at a time.
- design/bin/ds.cjs: 22 pages at 390 and 1440 signed out, 11 more pages at both widths (faq, contact, for-brands, support,
  editorial-charter, privacy, gallery, destinations, community-guidelines, corrections, terms), 5 member pages signed in with the
  Memberstack stand-in (no name, a made-up address): every visible text node's face, size, weight, tracking and color; contrast
  against the composited background (translucent layers and ancestor opacity blended; text over a photo or gradient listed apart);
  the face Chromium actually painted (CDP CSS.getPlatformFontsForNode, one sample per font stack); everything styled as a button;
  cards; photo corners, crops and upscaling; H1 to H3; section padding and left edges; things past the right edge; a DSF 1
  screenshot for the reviewer (not committed).
- design/bin/vf.cjs: targeted reads of single elements to confirm findings (borders, boxes, overflow, the image radius variable).
- Lab limits: four scroll-reveal items on /terms and /community-guidelines were still at 0.6 opacity when read (3.95 to
  4.43:1); not confirmed as a live problem, so not listed. Linux Chromium; the system fallback faces seen here (Liberation Serif, Inter, DejaVu) become Times, Georgia, SF or
  Segoe on visitors' machines. Turnstile keeps form buttons in their disabled look in the lab, so disabled colors are not judged.
- Fixed items not repeated: design-award-review-2026-09-30 P3 (white on #F0507A buttons, fixed by tll-contrast-v1 and
  tll-buttons-v1), the nav and story button set (tll-buttons-v1, 16.52.0), the Google Fonts and alias work (kit v2.4 rule 4).

## Findings

Severity: high = broken or blocks a user; medium = confusing or noticeably off; low = polish. Fix locations: core layer
(src/site-layers), page code (Webflow page head or footer embeds), Designer, content, decision for Nancy.

1. **G1 (new): /about, the lower half is set in a system serif, and its two buttons sit outside the button set.** 390 and 1440.
   The "What you can do here" list, the Mark Twain citation and both closing buttons ("Read the stories →", "Get In →") ask for
   `font-family: IBM Plex Sans` (the non-condensed face, which the site never loads, with no fallback), so Chromium painted
   Liberation Serif (CDP: `.tll-about-final-cite` 38 glyphs, `.tll-about-final-button` 18 glyphs, all system serif); on a Mac or PC
   that is Times. The buttons are also `border-radius: 8px`, weight 700, filled #C8325B, outlined in 1 px, 56 px tall, and "Get In"
   is not sentence case. Evidence: Webflow shared CSS (that-layover-life.webflow.shared.f0153eca0.css) `.tll-about-final-cite`,
   `.tll-about-final-button`, `-secondary`, `-light`; design-evidence.json cells /about fontsRenderedOffKit, buttonVariants.
   Severity medium. Fix lives in the core layer: add `.tll-about-final-button, .tll-about-final-button-secondary,
   .tll-about-final-button-light` to the filled and outlined selector lists in src/site-layers/tll-buttons-v1.html, and one rule
   `.tll-about-final-cite,.tll-about-final-li,.tll-about-final-actions a{font-family:'IBM Plex Sans Condensed',system-ui,sans-serif}`.
   "Get in" casing is copy (decision for Nancy).
2. **G2 (new): buttons outside the v2.4 set on nine pages, including filled teal buttons.** Kit v2.4 rule 1: three kinds, filled
   #D63859, square, Plex 600, sentence case, 48/44/40 px. Measured (design-evidence.json buttonVariants):
   - /for-expats: "Become a Location Expert" and "Claim your desk →" DM Sans 700, 7 to 9 px corners, 54 px; the country finder
     "FIND" is a 24 px pill in mono caps; "Find an expat group" is an outlined button whose 1 px border is Cream #F7F1E8 on a Paper
     page, so it shows as plain text (vf.jsonl).
   - /for-press: "Register as a Press Traveler →" filled Maldives Teal #00C9C8 with #06302F label, 9 px corners, DM Sans.
   - /the-map: "Sign in to log your countries" 999 px pill; "Add a park you have been in" Deep Teal pill; "Sign in to start your
     logbook" 9 px; "OPEN FULL SCREEN →" teal 6 px mono caps; "✎ EDIT MY DESTINATIONS" teal 2 px mono caps.
   - 404: "Back to the gate" and "Read the stories" both filled Cream with 6 px corners (two fills in one group), "Open the map" 6 px.
   - /login and /signup: "Log in →", "Create my account →" and "Continue with Google" 4 px corners, weight 700, 15 px.
   - /submit (signed in): "NEXT: DETAILS →" a #D63859 999 px pill in mono capitals, 54 px.
   - /account (signed in): "Edit profile" and "Sign out" 4 px, 700; "Download everything" #C8325B 4 px; "Visible to your crew" teal 4 px.
   - /edit-profile: segmented "Full name" and "First name" 4 px; "Add" 999 px mono.
   Severity medium (the same action looks different page to page, and teal fills read as a second brand button). Fix lives in the
   core layer for the classed ones (extend the selector lists in tll-buttons-v1.html: `.tll404-btn`, `.tll-btn-google`,
   `form input.tll-btn-primary`, `.tllst-next`, `.a3-btn-edit`, `.tll-exp button`, `.tll-park-cta`, `.tlllb-cta`, the /the-map
   `.tql-open a`); page code or Designer for the /for-expats and /for-press buttons that only carry Webflow `inline-a-*` classes.
   Whether the map's teal "Edit my destinations" stays teal (Midnight surface) is a decision for Nancy.
3. **G3 (new): every photo is rounded 12 px by a site-wide Webflow rule, except where a page undoes it, so the same photo has
   four corner styles.** `img { border-radius: var(--_sizes---image--image-radius) }` in the Webflow shared CSS, and the variable
   reads `.75rem` on every page (vf.jsonl imgRadiusVar). Counted at 1440 and 390 (photos 100 px or wider): home library cards,
   postcards and full-width interludes 12 px (15 of 17); profile 60 of 61 at 12 px; story pages 12 px heroes and 4 px gallery
   tiles; /for-expats 2 px; /stories cards 0 px (57 of 57). A story's cover is square on /stories and rounded on home. Kit preset
   02 and 05: photographs square and unrounded, `--radius-photo: 0px`. Severity low. Fix lives in the Designer: set the image
   radius variable to 0 (avatars set 50% on their own classes, so they keep their circles). Proposal only.
4. **G4 (new): /support at 390, the email address in the last heading runs off the screen.** "For anything else:
   hello@thatlayover.life", the address is a 40 px Playfair em that cannot wrap: 396 px wide in a 342 px column, right edge at
   420 px (vf.jsonl, support 390). The page does not scroll sideways, so the end of the address is simply cut. Severity medium
   (the contact address is unreadable on phones; the footer address still works). Fix lives in /support page code:
   `@media (max-width:479px){.tll-support-direct-title em{font-size:28px;overflow-wrap:anywhere}}`.
5. **G5 (new): /stories at 390, the closing letter heading is body size and its rose word fails contrast.** "One story, when it's
   worth it." is an H3 at 16.3 px (32 px at 1440), and its em is #F0507A on #F8F2E6, 3.07:1 at 16 px (needs 4.5). Source:
   src/pages/stories/v3/s3-stories.css `html.tllp-stories .tll-library-newsletter h3 em{color:var(--s3-rose) !important}`.
   Severity medium. Fix lives in /stories page code: em `var(--s3-rose-t)` (#C8325B, 4.6:1) and
   `.tll-library-newsletter h3{font-size:clamp(26px,6vw,32px)}`. The same pattern on /contact at 390: "already answered"
   is #C8325B 16 px on #EFEAE1, 4.31:1, in a 16 px heading; the same size floor fixes it.
6. **G6 (new): /contact and /support, cream labels on teal buttons at 2.59:1.** "Need support instead? →" (/contact) and "Read the
   guidelines →" (/support) are `.tll-cta-ghost-dark`: #F7F1E8 13 px 600 on a #00A9A4 fill, 2.59:1 (needs 4.5), at 390 and 1440. It
   is the same pair tll-contrast-v1 fixed for `.tll-cta-rose` on /stories on Oct 26. Also a teal fill outside the button set (G2).
   Severity medium. Fix lives in the core layer: add `body a.tll-cta-ghost-dark` to src/site-layers/tll-contrast-v1.html as an
   outlined button (transparent fill, 1.5 px Cream line on its dark card, Cream label), or to the outlined list in tll-buttons-v1.html.
7. **G7 (new): heading scale is inverted on home at 1440, on /account, and weak on /stories at 390.** Home 1440: the H1 "Find your
   next somewhere." is 77.8 px while eight H2s are 74.9 px and "You went. Write it down." is 103.7 px. /account signed in: H2
   "Overview" 64 px under the H1 "Hi, Traveler." at 60 px. /stories 390: the H1 is 30 px (other pages use 34 to 44 px at 390) and
   the first card title right under it is 28.9 px. /the-map: "WORLD HERITAGE SITES" is an H2 set as a 12.5 px Playfair caps label
   in #0D0F1A. design-evidence.json headings. Severity low (medium for home, where the cover headline loses to a CTA band). Fix lives
   in page code (home h3 CSS, /stories s3 CSS `h1` min 40 px at 390, /account a3 CSS); the /the-map label can become a mono eyebrow.
8. **G8 (KNOWN in part, new pages): meta text in JetBrains Mono below the 12 px floor, and 40-plus eyebrow variants.** Kit v2.3
   rule 1 sets a 12 px floor; v2.4 notes the 11 px story-page eyebrows "to be brought into line" (KNOWN for story pages). New,
   per load: /stories card meta 10 px (38) and "Read the story →" 10.5 px (36), filter labels 10.5 px; /the-map card rules, as-of
   lines, cell labels and shelf names 10 px (about 30); /account stat labels 8.5 px ("Countries on your map", "Naps taken");
   profile album labels 10 px; 11 px eyebrows on /about, /for-press, /for-expats, /the-paw-passport, /stories ("The Library"),
   /account, 404. Across the site there are more than 40 size, weight and tracking combinations for the same eyebrow role, with
   tracking from 0.5 to 3 px (kit: 2 to 4 px) and weight 700 requested on a face loaded only at 400 and 600 (monoVariants).
   Severity low (the 8.5 to 10.5 px ones are hard to read on phones: medium). Fix lives in the core layer: one rule lifting
   JetBrains Mono text to 12 px on those classes, then three eyebrow tokens (12/600/.14em, 12/400/.12em, 14/600/.12em) as pages are touched.
9. **G9 (KNOWN, kit v2.4 rule 4, with a new detail): footer column headings change face with the screen.** READ, CONTRIBUTE, TLL,
   LEGAL are Playfair Display 12 px caps at 1440 and Teko (Webflow's own font list, the Light file painting weight 700) at 390, on
   every page (23 of 23 phone cells). Neither is the kit's label face. KNOWN: kit v2.4 rule 4 says Teko loads until Nancy removes it
   in Site settings. New: it is visible in the footer on every phone page. Severity low. Fix lives in the Designer (footer
   component headings, the heading-font variable) or the footer component embed; proposal only, since the footer is a component.
10. **G10 (new): /the-map sample banner is set in a system face.** The signed-out "SAMPLE MAP" banner line ("These countries belong
   to a made-up traveler...") and its two links "Start your own map →" and "Sign in" ask for `"IBM Plex Sans", system-ui`: Plex
   non-condensed is never loaded, so the system UI face paints all 104 glyphs (SF on Apple, Segoe on Windows). Severity low.
   Fix lives in /the-map page code (`#tllm-sample` font-family 'IBM Plex Sans Condensed').
11. **G11 (new): /for-expats forms show Webflow's default placeholder "Example text".** Seven fields in "Run a group? List it." and
    "Claim your desk" (group name, city or area, country, where it lives, email; name and email) read "Example text" at 1440 and
    390. Severity medium (reads unfinished on the page that recruits experts). Fix lives in the Designer (placeholder per field,
    for example "Copenhagen Running Club", "Østerbro"); proposal only, field names untouched. Copy is Nancy's.
12. **G12 (new): off-palette colors in visible text.** Pink #FF7093 for the italic word on /about ("lounge") and the 404 ("connection."),
    where the kit word is #F0507A; amber #D98A2B for the 404 "ERROR 404" eyebrow and the /account "Snapped" card label, #8A5A12 on
    /for-brands; the retired Midnight #0D0F1A as the H1 color on /for-expats, /for-press and /faq (14 cells); link reds #C8425E
    (/cookies, /the-paw-passport) and #A92549 (/about); slate greys #0B1220 and #4A5568 on the /layovers cards; a #FCC1D2 tint
    behind the /my-pets cards (offKitTextColors, cardVariants). Severity low. Fix lives in page code for each page; the core layer
    could map #0D0F1A to #0A0B14 on h1 in one rule.
13. **G13 (new): the same link or card styled two ways.** "Read the guide →" is Cream 15 px with a 2 px #C8325B underline on home and
    Deep Teal 13 px with no underline on /layovers; the layover guide card `.tllcf-card` is a square Midnight row on home and a
    white 4 px card with a #E0DACE border on /layovers. In-text links on light pages use about eight treatments (Deep Teal with and
    without underline, Ink with a rose underline, #6B6660 with a rose underline, #C8325B with and without underline, #C8425E,
    #A92549; inlineLinkStyles). Card radii in use: 0, 2, 4, 6, 12, 14, 16, 18 px (kit card token 10 px). On /my-pets the first form
    card labels are spaced capitals and the third card's are sentence-case bold. Severity low. Fix lives in the core layer (one
    in-text link rule: Deep Teal with underline, per kit v2.2 rule 11; "see all" links Midnight with the rose underline, per v2.4
    rule 1) and /layovers page code for the card.
14. **G14 (new): profile album labels overflow their tape.** /contributors/<profile>, 390 and 1440: the line "N photos · N
    countries" is `white-space: nowrap`, set to 9 px in src/site-layers/tll-album-v1.js:24 (built into chunks/profile.js:440) and
    painted at 12 px, so it needs 177 px in a 142 px box and runs 35 px past the tape and up to the tile edge (vf.jsonl).
    Severity low. Fix lives in the core layer: `.tll-alb-tape small{white-space:normal}` (two lines) and drop the 9 px.
15. **G15 (new): bylines on /stories cards wrap with a leading separator.** At 390 the place drops to its own line starting with
    "·" ("· NEW ORLEANS, LOUISIANA") on cards whose writer name is long. Severity low. Fix lives in the core layer (stories chunk,
    byline): keep "· place" in one `white-space:nowrap` span, or drop the dot when it starts a line.
16. **G16 (new): arrows and ↗ come from a system font.** In Plex Condensed buttons and links ("All layover guides →", "Read the
    guide →", "Instagram ↗", the /account and /edit-profile "←" back links, story page links) and in JetBrains Mono 700 links, the
    arrow is the one glyph the loaded files do not cover (CDP: 1 glyph Inter, Liberation Sans or DejaVu per element, 15 places).
    The arrow changes shape and weight by device. Severity low. Fix lives in the core layer font setup
    (tll-font-fallbacks-v1.html): load the subset that carries U+2190 to U+2197, or draw the arrow as inline SVG. Decision for Nancy
    on which.
17. **G17 (new, decision for Nancy): story dates use Copenhagen order while the house rule says US dates.** The receipts line under
    every story headline rewrites "May 7, 2023" as "Published 7 May 2023"
    (src/design/magazine-2026-10/story-build/tll-mag-story-v1.html:187, function d()), next to "May 2023" in the byline and
    "OCTOBER 2026" on cards. handoff/IMPLEMENTATION-BRIEF.md:41 asks for "19 September 2026"; the house writing rule for this sweep
    says US dates. Severity low. Fix: one line in the core layer once Nancy picks.
18. **G18 (new): section spacing and left edges drift.** Section padding uses more than 12 pairs (108/108, 81/81, 88/72, 80/96,
    48/64, 40/8, 44/44, 32/40, 78/60...) against the kit steps 8, 16, 24, 40, 64; content left edges at 1440 move by 2 to 25 px
    between neighboring sections on /the-map (103, 108, 124), /for-brands (180, 208, 229, 232) and /support (104, 227, 229).
    Severity low. Fix lives in page code as each page is touched (the design-award review's E1 component rebuild covers it).
19. **G19 (new): phone nav row heights differ.** At 390 "Share your story" is 40 px tall beside "Sign up" and "MENU" at 44 px.
    Severity low. Fix lives in the core layer (tap floor rule: give the nav outline button the same 44 px).
20. **G20 (new, copy): /for-expats "What a Location Expert does" card 02 is headed "F-i-l-e-s the local truth", a form of the banned
    verb.** Severity low. Copy is Nancy's (Designer text).
21. **G21 (KNOWN): /submit, /my-pets and /share-photos form text below AA.** Card titles #F0507A 3.35:1 and help lines ink at 50%
    3.57:1. KNOWN: ux.md U4. New detail on /my-pets: `.tll-pen-status` "Saves to your account right away" 14 px weight 300 ink at
    55%, 4.17:1; the U4 core-layer rule should include it.
22. **G22 (KNOWN): /for-expats experts list empty.** KNOWN: debug D1, NANCY-WHEN-HOME "Codebase refactor branch" (R1).
23. **G23 (KNOWN): "MORE LANDING WEEKLY." on home.** KNOWN: NANCY-WHEN-HOME "Promise lines".

## Checked and fine

- No page scrolls sideways at 390 or 1440 (scrollWidth equals the viewport in all 76 cells); no "lorem", "TODO", "undefined",
  "NaN" or "{{ }}" in visible text; "Coming soon" appears only on the three home expat cards (kit v2.3 rule 5).
- Text contrast: outside /submit, /my-pets (G21), the /stories and /contact letter headings (G5) and the teal buttons (G6), no visible text below AA on its composited
  background in any of the 76 cells. Text over photos was listed apart: home postcards, 404 and story stamps carry a shade or
  shadow and read in the screenshots.
- Display type: every H1 and H2 paints Playfair Display ExtraBold (CDP), Syne and Recoleta names resolve to the Playfair file.
  Story body is Plex Condensed 18 px (kit v2.3 rule 1).
- Nav and the v2.4 set: nav Sign up, Share your story, home and /stories CTAs, search buttons, story share buttons, profile
  link buttons and the account gate buttons are square Plex 600 in the kit colors.
- Rose italic accent: at most three per page (H1 plus two), per kit v2.3 rule 3.
- No photo is stretched (object-fit cover everywhere). Upscaled sources are content: one pet photo stored at 147 x 220 is shown at
  up to 474 x 709 (profile, /travelers), and the Balkans cover (1023 px wide) runs at 1200 px on desktop (photosUpscaled).
- The home library at 1440 is a tall sticky band (the cards move sideways as you scroll), not an empty gap.

## Evidence

- design/design-evidence.json: per page and width the faces requested and the faces painted off the kit, contrast failures,
  small text, eyebrow and button variants, cards, radii, photo corners and upscaled photos, headings, section padding and left
  edges, off-kit text colors, inline link styles, plus the targeted reads (vf). Selectors and numbers only; no text excerpts.
- design/bin/: ds.cjs (probe and screenshots), vf.cjs (targeted reads), an.py (summaries), ev.py (builds the evidence file),
  tile.py (screenshot contact sheets for the reviewer). They require ./h.cjs, which is debug/bin/d.cjs with OUT set to the design
  results folder, BUDGET 60e6 and deviceScaleFactor 1.
