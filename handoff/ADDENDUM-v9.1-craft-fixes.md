# TLL v9.1 addendum: craft fixes (DRAFT, not approved to ship)

Date: 6 October 2026
Status: DRAFT. Nancy approved drafting all 10. Nothing goes live until she approves each item in a deploy preview. Never publish from this doc alone.
Scope: home page and shared components only. Within the feature freeze (fixes only, no new screens). Fix #10 adds clustering behaviour to the existing map.
Precedence: Brand Kit v2.1 and CLAUDE.md rulings beat everything here. The skills govern craft only (layout, spacing, hierarchy, motion, interaction).
Skills: Taste (`design-taste-frontend`) for #1 and #8, Impeccable for #2 to #6 and #10, Emil (`emil-design-eng`) for #5, #7 and #9. Load all three before starting.

Global guardrails for every item:
- WCAG 2.1 AA: body text 4.5:1, headline-size text 3:1, visible focus ring on everything you can click or tab to.
- `prefers-reduced-motion: reduce`: no movement, only opacity changes of 150ms or less.
- Teal `#00C9C8` on dark surfaces only. Teal text on Cream/Paper = `#067A79`.
- Small rose text on light surfaces = `#C8325B`.
- Minimum text 10px. Tap targets 44px.

---

## 01 · Hero: cut the props (Taste)
**Problem:** The hero stacks four props on the photo (coordinates, CPH customs stamp, FRAGILE label, PRIORITY · SEAT 1A tag) plus vertical rotated text on the left edge. That reads as clip-art and goes against the 3c "editorial, not prop-heavy" decision.
**Fix:**
- Keep ONE sticker: the CPH customs stamp (it carries the "left the airport" joke). Remove the FRAGILE label and the priority tag from the hero (they can live on the Share Your Story page if wanted later).
- Remove the vertical rotated text.
- Keep the coordinates block, but as a single small mono line at the bottom right, under the photo credit position.
- The hero is then: photo, eyebrow, H1, one stamp.
**Accept when:** At 1440, 1024 and 390 widths, nothing overlaps the H1 and there is at most one rotated element.

## 02 · Hero eyebrow legibility (Impeccable)
**Problem:** "Travel stories by people who were there" is small teal mono text over a busy sea photo, and it fails contrast in places.
**Fix:**
- Add a bottom scrim to the hero photo: a gradient from `rgba(10,11,20,0)` at 40% height to `rgba(10,11,20,0.72)` at 100% (Ink `#0A0B14`). Remove it once real photo-safe zones exist.
- Eyebrow stays `#00C9C8` (teal on dark is allowed) and now sits on the scrimmed area.
- Eyebrow size 12px minimum, letter-spacing 0.18em max (it is currently wider than that).
**Accept when:** Eyebrow measures at least 4.5:1 against the darkest and lightest pixels behind it (check with axe or by hand at 3 crops).

## 03 · Prototype screen bar covers the H1 (Impeccable)
**Problem:** The "PROTOTYPE · ALL SCREENS · HOME · SCREENS" bar sits over "somewhere" on first load.
**Fix:**
- Live site: the bar does not exist. Confirm it is not ported.
- Prototype only: dock it at the bottom right, collapsed to a 44px pill reading "Screens"; it expands when clicked or focused. `z-index` stays below the stickers you can drag.
**Accept when:** The first screen at 1440x900 and 390x844 shows the full H1 with nothing covering it.

## 04 · Shelf caption collision (Impeccable)
**Problem:** "06 stories · keep scrolling, the shelf moves" collides with the Antarctica card title.
**Fix:**
- Move the caption to its own row directly under the "The shelf." H1, left-aligned to the H1, 24px gap above the card track.
- Card titles get a 16px top gap from the image and are never overlapped.
**Accept when:** No text overlaps text at any width from 360 to 1920 (check with the break-ui worst case: a 120-character title).

## 05 · Dead scroll space (Impeccable + Emil)
**Problem:** After the shelf there is about one full screen of blank Cream while the horizontal pin finishes, and the footer has a mostly empty dark block above the Magnus line.
**Fix:**
- Shelf pin length = how far the track moves sideways + 10vh, never more. Release the pin the moment the last card is fully in view.
- The next section (Library search) starts fading in during the last 15% of the pin: opacity 0 to 1, 8px upward move, 300ms, `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out).
- Footer: drop the empty block. Magnus line sits 48px under the last footer row.
- Reduced motion: no pin at all; the shelf becomes a normal horizontal scroll row with scroll-snap.
**Accept when:** No scroll position at 1440x900 shows a blank screen-sized area.

## 06 · Search field reads as filled (Impeccable)
**Problem:** The giant grey Playfair placeholder "A country, a train line, a feeling" looks like text someone already typed, and its contrast is low.
**Fix:**
- Placeholder: same Playfair 800 but at 60% of the typed size, color `#6B6A72` (check 4.5:1 on Cream; darken if it fails), and add a blinking caret cue only when the field is focused.
- Typed text: full size, Ink.
- Focus: 2px Ink underline grows to 4px, plus the standard focus ring on the field container. Underline change 150ms ease-out.
- Visible `<label>` stays "THE LIBRARY · SEARCH IT" and is tied to the field with `for`.
**Accept when:** An empty field and a filled field look clearly different in a side-by-side screenshot.

## 07 · Custom cursor (Emil)
**Problem:** The blend-mode cursor dot replaces the system cursor across the whole page. It makes things feel slow and hides what you can click.
**Fix:**
- Remove the custom cursor everywhere.
- Over stickers you can drag, use `cursor: grab` / `cursor: grabbing` from the system.
- If Nancy wants to keep a flourish: show the dot only while hovering a sticker you can drag, with `pointer: fine` only, never with reduced motion.
**Accept when:** The system cursor is visible at all times outside sticker hover.

## 08 · Passport "0/193" composition (Taste)
**Problem:** The giant 0, the small superscript /193 and the scattered stamps don't read as one unit. It looks like a layout bug, not a starting count.
**Fix:**
- Lock up "0" and "/193" on one baseline: "0" at display size, "/193" at 40% size, rose `#F0507A` (headline size on dark is allowed), 8px gap.
- Put the "Sample data" label directly under that lockup, not at the chapter eyebrow.
- Stamps: max 3, placed in a loose grid to the right of the lockup and rotated -6° to 6°, never overlapping the number.
**Accept when:** At 1440 and 390 widths the number and its label read as one group (no stamp sits between them).

## 09 · Motion system pass (Emil)
**Problem:** Only one place on the page reads `prefers-reduced-motion`. The stickers, shelf, stamps, map pins and buttons each move their own way.
**Fix (one motion spec for the whole site):**
- Enter animations: ease-out `cubic-bezier(0.23, 1, 0.32, 1)`, 200 to 300ms, opacity plus a 6 to 12px move. Never ease-in on enter. Never scale from 0 (start at 0.96 minimum).
- Exit: 150ms, ease-in allowed.
- Hover (`@media (hover: hover)` only): color/shadow changes 150ms. No movement on hover for text links.
- Press: buttons `transform: scale(0.97)` on `:active`, 100ms.
- Sticker drag: follows the pointer 1:1, then a short ease-out settle when dropped. No bouncy spring.
- Never `transition: all`; list the exact properties.
- Only animate `transform` and `opacity`.
- Reduced motion: one global hook (CSS `@media (prefers-reduced-motion: reduce)` plus a JS flag) that removes all movement and keeps opacity fades of 150ms or less. Stickers stay draggable but do not settle-animate.
**Accept when:** Running Emil's `review-animations` on the home page shows no failures, and toggling reduced motion in the OS removes all movement.

## 10 · Map pin clustering (Impeccable)
**Problem:** The Balkans pins stack into one unreadable blob, and single pins are smaller than 44px to tap.
**Fix:**
- Group pins closer than 32px on screen into one pin with a count badge (mono, 10px minimum, Ink on `#00C9C8`).
- Clicking or pressing Enter on a group zooms in to split it, or opens a list of its stories if already zoomed in.
- Every pin and group gets a 44x44px hit area (the visible dot can stay smaller) with `aria-label`, e.g. "3 stories in the Balkans".
- Pin enter animation follows #09 and is off under reduced motion.
**Accept when:** Every pin at default zoom can be tapped on its own at 390 width.

---

## Rollout
1. Claude Code builds all 10 on a branch and puts them on a deploy preview. No publish.
2. Run `verify-live.mjs` + axe + Lighthouse on the preview; attach before/after screenshots per item to STATUS.md.
3. Nancy approves item by item. Only approved items merge. Publishing (both custom domains + subdomain) is Nancy's call.
