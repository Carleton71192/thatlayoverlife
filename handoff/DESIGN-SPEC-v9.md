> **HANDOFF VERSION: v9 · 5 October 2026 · 2.0 editorial look + accessibility + mobile.** Start with CLAUDE-CODE-PROMPT.md, then keep STATUS.md updated as you go.

# DESIGN-SPEC v9 addendum · read before DESIGN-SPEC.md

Where this file and DESIGN-SPEC.md disagree, this file wins. The visual source of truth is `TLL Site Prototype 2.0 (standalone).html` (SCREENS menu bottom left).

## 1 · One paper object per job
| Object | Job | Where | Never |
|---|---|---|---|
| Departures board | "Where this page takes you" header, any mode (air, rail, sea, road) | Non-story page tops | On story or home pages |
| Postcard / shelf card | A story | Home shelf, /stories, country pages | For people |
| Luggage tag | A person | /travelers, profile header, directory cards | For stories |
| Stamp | A country you've been | Passport, map, profile counts | As decoration |
| Sticker | Playful collectible | Sticker Passport page and home hero only | In navigation or forms |

## 2 · Tokens (unchanged colors, new usage rules)
- Ink `#0A0B14` · Cream `#F7F1E8` · Paper `#FDF9F3` · Line `#E0DACE` · Rose `#F0507A` · Rose text on light `#C8325B` · Rose button for white text `#D63859` · Teal on dark `#00C9C8` · Deep Maldives on light `#067A79` · Panel dark `#16182a` · Kraft line `#c9b89a`
- Muted text: on dark `#9496AC`, on light `#6B6660`. Retired for text: `#7d7f96`, `#9a958d`, `#4a4d63`.
- Radius: 2 to 4px on cards and buttons; 16 to 24px only on chips and pill tabs.

## 3 · Type scale
| Role | Spec |
|---|---|
| Hero | Playfair Display 800, clamp(46px, 9.6vw, 186px), lh .86, tracking -.04em, italic Rose accent word |
| Page title | Playfair 800, clamp(44px, 6.4vw, 112px), lh .9, tracking -.035em, `text-wrap:balance` |
| Section head | Playfair 800, 64px (clamp down on mobile) |
| Body | IBM Plex Sans Condensed 400/600, 15 to 17px, lh 1.55 |
| Meta / eyebrow | JetBrains Mono 600, 10 to 12px, tracking 2 to 3px, uppercase. 10px is the floor |

## 4 · Components
**Departures header (replaces the boarding pass).** Full width, Ink `#0A0B14`, 6px Cream bottom rule, no tilt, shadow, icons, notches, barcode or stamp. A layover can be a train, a ferry or a road trip, so the vocabulary is mode-neutral: never "flight", "gate", "seat" or ✈.
- Top row: mono 10.5px 700, tracking 3px, `#9496AC`: "DEPARTURES · THAT LAYOVER LIFE" left, "AIR · RAIL · SEA · ROAD" right; 1px `#23263c` rule under it. 14px vertical padding, 6vw sides.
- Board row: flex-wrap cells, each = mono 10.5px label (`#9496AC`, tracking 2px) over a mono 15px 700 value (Cream). Cells: ROUTE (`TLL {code}`, teal `#00C9C8`, nowrap) · FROM · TO (Playfair 800, clamp(22px, 2.4vw, 30px)) · VIA (AIR / RAIL / SEA / ROAD) · STOP · DEPARTS · STATUS (Rose `#F0507A`). Flex-basis 120px (TO 240px at 2.4 grow, STATUS 170px); cells wrap onto a second row on narrow screens, never squeeze.
- Note row: IBM Plex Sans Condensed 15px, `#9496AC`, 1px `#23263c` top rule.
- The page's own Playfair title follows on Cream. Per-page values (code, from, to, stop, departs, status, note, via) are listed in the prototype's `TX` table; via is fixed per page.

**Luggage tag (person).** Vertical tag: `clip-path: polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%, 0 24px)`; shadow via `filter: drop-shadow(0 14px 26px rgba(10,11,20,.18))` on a wrapper (clip-path eats box-shadow). Grommet: 20px Cream circle, `box-shadow: inset 0 0 0 4px #c9b89a`, top 18px, centred. Row at top 50px: dashed rule, mono 10px PROPERTY OF / TLL TRAVELER. Content padding-top 84px. Founder tag is Ink, rotated -0.6°. Open slot is a Paper tag with `outline: 2px dashed #c9b89a; outline-offset: -14px`, rotated 0.8°. Profile header is the horizontal version: corners cut on the left (26px), grommet left 24px vertically centred, dashed stitch line at left 58px.

**Search.** Label wraps a borderless input in Playfair at headline size, 3px Ink underline, Rose chip "SEARCH →" (mono 12px, Ink text).

**Focus ring.** `:focus-visible { outline: 3px solid #0A0B14; outline-offset: 2px; box-shadow: 0 0 0 6px #00C9C8; }`

**Mobile nav (< 900px).** MENU button: mono 12px 700, tracking 2px, Cream text, 1.5px Cream border, 12 × 16px padding, min-height 44px. Dropdown: absolute under the header, full width, Ink, padding 22 × 28 × 30px, 1px `#23263c` top rule, links stacked with 22px gap.

## 5 · Motion
| Effect | Trigger | Spec |
|---|---|---|
| Parallax | scroll | `translate3d(0, -(centre offset × factor))`, factor 0.1 to 0.16, rAF-throttled |
| Count-up | 30% visible, once | 1300ms, ease-out cubic |
| Stamp | passport toggle on | scale 1.9 → 1, opacity 0 → 1, slight rotation kept |
| Route line | map scrolls in | teal 1.6px path through story pins in story order, gentle arcs; `stroke-dashoffset` 1 → 0 between 90% and 20% of viewport |
| Stickers | drag | pointer-driven translate; grab / grabbing cursor |
| Custom cursor | fine pointer only | 18px Cream dot, grows to 52px over clickables, `mix-blend-mode: difference` |

All of the above off under `prefers-reduced-motion: reduce` (final state shown, route fully drawn).

## 6 · Copy rules added in v9
- Never "currently in". Profiles say where you know: "KNOWS COPENHAGEN".
- Nancy's line: "AMERICAN · ABROAD SINCE 2018 · LIVES IN DENMARK · SPEAKS ENGLISH, DANISH, PORTUGUESE".
- Open slots: keep to one per grid until the roster has three real people.
