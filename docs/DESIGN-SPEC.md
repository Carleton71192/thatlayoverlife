# Design spec: rendering the Travel Wire on ThatLayover.Life

> **Check against the brand kit before building.** This spec, as received in the
> handoff package, calls for Playfair Display 800 headlines. TLL BrandKit v2
> (4 August 2026, Google Drive, "That Layover life" folder) specifies **Syne 800**
> for the wordmark, all H1 and H2, pull quotes and stat numbers, heavy weights
> only, never below 700. DM Sans for body and JetBrains Mono for meta labels both
> match. The kit's stated type rule is "Two fonts. Infinite range."
>
> Playfair is the Nancy Carleton and TBC headline face, not TLL's. Building the
> Travel Wire page in Playfair would put it in the wrong family's typeface.
> The palette in this spec does match the kit: midnight #0D0F1A, rose #F0507A,
> teal #00C9C8, bone #F7F1E8, paper #FDF9F3.
>
> Flagged rather than edited, since this file is the handoff as delivered.

For the Webflow page script (Claude Design writes this once the endpoint exists). Kept here so the whole feature lives in one package.

## Page
`/travel-wire` — "The Travel Wire", eyebrow: `THE TRAVEL WIRE · FROM THE MAJOR DESKS · UPDATED DAILY` (JetBrains Mono, 11px, letter-spacing 3px, teal #0a8f8e). Headline: "The news, *sorted by where.*" — Playfair Display 800, accent phrase in rose #F0507A italic. Sub-line: "Headlines from the wire services and the trade press, tagged by place. We link out — the reporting is theirs, the sorting is ours."

## Brand tokens
- Midnight #0D0F1A (cards #16182a) · Paper #FDF9F3 · Bone #F7F1E8 · Borders #E0DACE
- Rose #F0507A / #C8425E · Teal #00C9C8 / #0a8f8e · Amber #D98A2B
- Ink body #3a3a3a · muted #6B6660
- Type: Playfair Display 800 headlines · DM Sans body · JetBrains Mono meta/labels (uppercase, letter-spacing 1–2px)
- US English, no em dashes.

## Region filter
Chip row, pill-shaped (border-radius 22px): ALL REGIONS · EUROPE · ASIA · AMERICAS · AFRICA · MIDDLE EAST · OCEANIA. Selected chip: midnight bg, bone text. Unselected: white bg, #E0DACE border, ink text. Clicking refetches `/wire?region=…` (or filters client-side).

## News item card
White card, 1px #E0DACE border, radius 10px, padding 18–22px. Left column (120px): region tag (mono 9px, white on region color: Europe rose, Asia/Africa teal #0a8f8e, Americas amber, Middle East #C8425E, Oceania #6B6660) + country name (mono 9px muted). Main: title (Playfair 800, 18px), summary (DM Sans 13px, #3a3a3a), then `SOURCE · TIME AGO` (mono 9px) + `READ AT SOURCE ↗` (mono 10px teal, links to item.link, target=_blank rel=noopener).

Optional "THE LAYOVER ANGLE" side card (230px, paper bg, 3px rose left border): an editorial one-liner Nancy adds manually for select items — CMS-driven, not automated.

## Empty state
Dashed #c9b89a border card: "Quiet on this desk today." / "Nothing filed for this region in the last 48 hours."

## Footer line (mono 9px muted)
`SOURCES ON THE WIRE: [names]` + `AGGREGATED HEADLINES + LINKS ONLY. NO SCRAPED BODIES. EVERY CLICK GOES TO THE PEOPLE WHO DID THE REPORTING.`

## Country-page tie-in
Country pages show an "ON THE WIRE · {COUNTRY}" strip: fetch `/wire?country=BG&limit=3`, compact cards (title + source/time + read-at-source). Hide the strip when empty.

## Contracts (do not break)
- Standard TLL nav/footer untouched (Memberstack bindings live there).
- Page must be linked from nav or footer before ship (standing wayfinding rule).
- Dark surfaces need explicit light text (theme engine rule).
