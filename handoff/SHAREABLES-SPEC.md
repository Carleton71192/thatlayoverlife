> **HANDOFF VERSION: v9 · 5 October 2026 · 2.0 editorial look + accessibility + mobile.** Start with CLAUDE-CODE-PROMPT.md, then keep STATUS.md updated as you go.

# SHAREABLES SPEC · percent, map, passport, pet, duo and pack cards

Design source: **TLL Shareables (standalone).html** (open it; it's a pan/zoom board, and 06/07/08 are live). Section files in **shareables/** carry the exact inline styles. **shareables/shareables-logic.js** has the counting math, MRZ builder, stamp system, map rendering, share flow and privacy behavior.

## 1 · Tokens (card shells set these as CSS variables)
| Var | Light | Dark |
|---|---|---|
| --bg | #FAF7F2 | #0B1220 |
| --paper | #FDF9F3 | #121A2C |
| --ink | #0A0B14 | #F7F1E8 |
| --mute | #6B6660 | #9AA3B8 |
| --line | #E0DACE | #26324D |
| --teal | #067A79 | #00C9C8 |
| --land (unvisited) | #E4DCCD | #1E2944 |
| --rose / --lived | #F0507A / #D63859 | same |
| --pet | #7C5CBF (always with hatch + stroke) | same |

Type: Playfair Display 800 hero numbers and headlines (italic rose accent word allowed), IBM Plex Sans Condensed body, JetBrains Mono eyebrows/micro-type/stamp codes/MRZ, Syne only in the wordmark. Light grain overlay (SVG noise, multiply on light, screen on dark).

## 2 · Sizes
Build every card as a **540×960** CSS layout rendered at scale 2 → **1080×1920** (Stories, TikTok, WhatsApp Status). Keep 125 px CSS (250 px output) clear top and bottom. **Feed 540×675 → 1080×1350** and **link preview 600×315 → 1200×630** are separate layouts, not crops. Link previews: PNG or JPEG, under 300 KB, never SVG.

## 3 · Counting rules (one shared module, used by every card and /p/)
- **Headline base: UN 193** (default; Nancy may choose 195 or 250, see STATUS I05). Every card prints the base in mono micro-type ("OF 193 UN STATES").
- **Bonus places** (Taiwan, Kosovo, Hong Kong, Macau, Greenland, New Caledonia, Western Sahara, Antarctica, etc.) show as a "+N BONUS PLACES" chip and never enter the UN numerator. Under 195/250 they count in.
- **Tier ladder** per country per traveler: airside (does NOT count; dotted outline + "+N countries seen through glass" chip) · escaped (minimum, rose) · fed · slept · lived (#D63859 + ink stroke). Pets: paws on the ground outside the vehicle/terminal; cargo hold = airside.
- **Data:** extend tllStates v2 values from lived|visited|layover to airside|escaped|fed|slept|lived. Migration: visited → escaped, lived → lived, layover → **pending Nancy (I07)**; recommended default escaped so no count drops overnight. Keep reading legacy values. **Drop non-ISO keys** (the "undefined" entry) in the reader.
- **Ranges** option: 62 → "60+", 32% → "30%+", everywhere including the MRZ.
- Tier names (samples, I06): 10 Carry-On · 25 Checked Bag · 50 Half the Stamps · 100 Centurion · 193 UN-Done.

## 4 · The cards (frames in the board)
| Card | Frames | Must have |
|---|---|---|
| Duo | 01A–01D | Two hero numbers, human rose / pet striped purple + stroke, "both" = rose + stripes, shared count, "countries he hasn't sniffed yet", both tiers |
| Percent | 02A–02D | Giant percent, luggage-tag bar of one tick per base state (visited rose), chips (count, bonus, continents, airside dashed), tier |
| Map | 03A–03D | Equal Earth, clipped ~60°S, Antarctica as teal triangle "ATA WILD CARD" badge, visited small states = rose dot r≈3 + ring, legend, "Drawn in Equal Earth" credit |
| Passport | 04A–04E | Cover (handle, member-since year, "Not a travel document"), stamp page: square = UN, rounded = territory, circle = continent milestone, triangle = Antarctica, dashed = airside; border weight = tier; pictogram top right; country, code, YEAR only; rose + teal at 70–85% multiply; ±12° rotation; MRZ 2×44 chars mono with "<" filler, count/percent/year/jokes only |
| Pet | 05A–05E | Teal cover with a ring of 13 paw prints (never stars), sections I Owner · II Description · III Identification (joke string) · IV Border crossings (paw stamps) · V "Approved by: the human" |
| Pack | 05F–05H | Approved pack friends only (see §8), 3×3 circles, open slots when fewer than 9 |

Every image carries the wordmark, "Make yours at thatlayover.life", the short URL and a QR (some apps drop captions).

## 5 · Share flow (06A live, 06B–06H states)
Two taps: **Make my card** renders the card node in the browser with **modern-screenshot 4.7** (domToBlob, scale 2; await document.fonts.ready; retry once if the blob is under ~15 KB). **Share** calls navigator.share({files}) inside the click. Fallbacks in order: canShare(files) → share file + text; share without files → share the link (06F); nothing → "Your browser won't share. Download it like it's 2009." with Download PNG + Copy link (06H, desktop Firefox). Render error: "Card didn't render. Even images need a layover. Try again." Toast: "Sent. Your mutuals have been notified. Emotionally." Default text: "You didn't ask to see my travel stats but here they are: {url}". Note in UI: a website cannot post straight to Instagram Stories.
Keep map geometry inline SVG and self-host the three fonts (CORS) so the render isn't blank on iOS.

## 6 · Privacy (07A live)
Memberstack custom fields: **share-level** (off | unlisted | public, **default off**), **share-slug** (random 6 chars), **share-items** (count, pct, map, dog, parks), **share-ranges** (bool). Off: no public URL; member can still download. Unlisted: /p/{slug}, noindex, New link regenerates, Revoke → off. Public: /p/{handle}, indexable. Never shown: dates, current city, "currently in". Stamps show years only. EXIF stripped on upload. The pet inherits the owner's level. Turning anything off purges the cached preview image.

## 7 · Public page /p/{handle} (08A/08B)
Stats as live text (dl), map, dog block, CTA "Make yours at thatlayover.life", image description line. Off state: "Nothing to see here. This passport is private." (404-ish, noindex). **Never gated by login.**

## 8 · The Pack (05F–05H cards, screens/19 and screens/20)
- New CMS collection **Pack Links**: pet (ref Pets), friend-pet (ref Pets, optional), friend-ig-handle (text, optional), friend-photo (image, uploaded or approved by the friend's human), status (pending | approved | removed), requested-on (date).
- /my-pets: "Ask them" by handle creates a pending link and notifies the friend's human (email relay for non-members). Only approved links render. Either human can remove. Pending never renders.
- /paw-passport/{slug}: "The Pack" grid. Friends on TLL link to their own Paw Passport. Instagram-only friends show handle + approved photo and link out with rel="noopener nofollow ugc".
- **Never scrape or embed Instagram posts or photos.** Counts on the Pack card are approved friends only.

## 9 · Empty, new and quiet states (09A–09O)
Every card has a Plan B: new (0), early (1–2, lead with the count, not "1%"), quiet year (0 new this year, lifetime on the back). Copy is in the board.

## 10 · Build order inside this job
1. Counting module + data hygiene + migration (after Nancy answers I05/I07).
2. Percent card end to end (all three sizes, light/dark, share flow, privacy panel, /p/). This is the proof.
3. Map, passport, pet, duo, pack cards on the same shell.
4. Empty/quiet states, alt text.
5. Phase 2 only after the above is live: per-member OG images on a Webflow Cloud route at /p (Satori + resvg-wasm, cached by a hash of the public stats). Until then /p/ uses a static OG image.
