# Micro-interactions

A clickable prototype of the two micro-interactions in Nancy's 11 Nov brief. Open `index.html` in a browser. It is a mock-up: the live site loads nothing from it.

The page holds the demo and the code. The CSS that would go into a site layer is in its own `<style id="tll-micro-v1">` block. The JS is in its own `<script id="tll-micro-v1-js">` block. Both are commented and marked "lift from here" and "END". Section 05 of the page prints both blocks, read from the page itself. The page's own styling and wiring sit apart, in `#page-css` and `#demo-js`.

## How each part of the brief is met

**1. Cursor and hover on the coordinates.** The demo hero uses the live home hero's paragraph exactly as it is (`p.h3-hero-coords`, 12.17° N 68.99° W, Curaçao). The layer wraps it in a real link to https://www.thatlayover.life/the-map.
- On mouse and trackpad (`hover: hover` and `pointer: fine`), a small "View map →" badge in Paper and Ink appears just under the coordinates and follows the pointer sideways. It moves with `translate3d` inside requestAnimationFrame, and the loop stops once the badge catches up. It fades in over 250ms from 0.6 opacity and 8px. Sizes are measured once, when the pointer enters. The system pointer is never hidden.
- Option B, picked with the chip: a compass cursor (`cursor:url(data:image/svg+xml…) 16 16, pointer`) on the coordinates only, with the ordinary hand as the fallback. I recommend the badge, because it says where the link goes.
- On touch screens the link shows a visible "View map →" label under the coordinates. With a keyboard the label appears on focus, with a 3px teal focus ring because the hero is dark. The accessible name is "Hero photo taken at 12.17° N 68.99° W Curaçao View map".

**2. The passport stamp.** This is the magazine cover postmark from `tll-mag-cover-v1`: the same rings, arcs and place-fitting rule, and per-copy ids following the 10 Nov hygiene fix. It is inked in #C8325B and multiplied onto a cream paper disc, so it reads on any photo. An extra fractal-noise mask thins the ink in patches.
- It lands on the card's top-right corner when you press Save. It also lands on the end-of-story row when the end of the story body scrolls into view, once per story.
- The text comes from the story's real place line plus the action. Names over 10 letters break at the space nearest the middle and shrink only as far as the inner ring needs, so "CROATIA AND BOSNIA AND HERZEGOVINA" still fits. "POMPEI, ITALY" becomes POMPEI, today's date and SAVED on the lower arc, or READ TO THE END for a finished story. It never says APPROVED.
- Motion lasts 280ms. The ink drops 8px from 0.6 opacity while the paper disc takes the press: scale 1.16, a small overshoot to 0.96, then 1, all inside the 280ms. Only transform and opacity animate. `will-change` is on only while the stamp moves.
- Under `prefers-reduced-motion` the stamp just appears. The page also has a "Preview reduced motion" chip that does the same thing.
- The stamp is `aria-hidden`. The button toggles `aria-pressed` and changes to "Saved", and a polite live region announces "Saved", "Removed from saved" or "Read to the end".
- Saves and reads persist in localStorage inside try/catch, and the page works without it. A returning stamp sits still and does not land again.

**Performance (measured 12 Nov in headless Chromium at 390 and 1440, with traces, re-checked in review).** Saving costs 1 layout and 4 small paints, all in the frame where the stamp appears. During the 280ms landing the trace shows 0 layouts and 0 paints across 16 to 17 frames, even with a requestAnimationFrame loop forcing a main frame every frame. The usual frame gap is 16.7 to 16.8ms; headless runs on a shared machine drop the odd frame (one review run had a single 50ms gap). When the stamp settles, about 300ms after the press, taking will-change off costs one more layout and 2 small paints, with nothing left moving. The page has a "Land a stamp and count the frames" button that re-measures on any device.

One finding shaped the design. My first version scaled and rotated the whole stamp, and that caused a layout and two paints on every frame, because SVG text re-lays itself out when an ancestor's scale changes. Now the postmark only translates and fades, and the scale sits on the disc pseudo-element underneath it.

## Departures from the brief's wording
- "CPH Approved" / "BR STAMPED" became "<PLACE> · SAVED" and "READ TO THE END". TLL approves nothing. Airport codes would mean inventing a code for every story place, so the stamp uses the place line the story already has.
- The brief asks for a "realistic ink stamp" with no limit. The brand allows nothing over 300ms, so the landing is 280ms and the existing cover stamp's 420ms bounce was not reused.
- The badge sits under the coordinates rather than at the pointer tip. At the tip it covered the numbers it labels.
- I did not use Tailwind. The brief did not ask for it, and production has none.
- No "Free Forever" wording appears anywhere, so nothing needed changing to "Free to join."

## Real and SAMPLE
Real content:
- the 57 stories (titles, places, contributors, minutes), from the live /stories page on 12 Nov, the same data as the editorial-grid prototype
- the Sort Sol lede
- the hero coordinates markup
- the four photos, which are the stories' own hero images with the site's own alt text, each under 54 KB and credited "Photo: <contributor>" with a link to the story (Pompeii, Roberta Bianchi; Torrevieja, Luke Luby; Aruba and Curaçao and Sort Sol, Nancy Carleton)

Labeled placeholders:
- The home hero photo of Curaçao is a labeled PHOTO slot. It is a site asset, not a story hero, and I do not know who took it.
- Other card photos are labeled PHOTO slots.
- The story body in section 03 is gray bars labeled SAMPLE.

Saving stories does not exist on the site yet, and the page says so in a SAMPLE note. The "6 of 57" count is computed. "Deal six others" is a random pick from the library.

## Moving it onto the real site
- Production is one plain site-layer script, `tll-micro-v1.js`. It injects the CSS block as a `<style>`, the way `tll-hover-v1` does, and runs the JS block unchanged with `MAP_URL` left at `/the-map`. To stay under the 15-script cap it should be folded into the next `build-site-layers` bundle rather than added as a new script tag.
- **Coordinates.** It is better to make the paragraph a link in the Designer, with the layer adding only the badge and label. The layer works either way. Note two things on the live site. The phone layer sets `pointer-events:none` on the coordinates' wrapper, and `.tll-coords` turns it back on. The magazine cover build (`tll-mag-cover-v1`) hides `.h3-hero-coords` when the cover is on, so the coordinates need to be visible again, or the same link goes onto the cover's credit line.
- **Read to the end.** This already targets the live story page's classes, `.tll-story-body`, `.tll-story-share-row` and `.tll-story-byline-loc`, as read on 12 Nov.
- **Save.** There is no save feature to hook into. Card links on /stories are whole `<a class="tll-lib-card">` elements, so the Save button has to sit beside the link inside the `w-dyn-item`, not inside it, which is how the demo marks it up. Saves should live on the member's account through the Worker rather than localStorage. The layer fires `tll:story-saved` and `tll:story-read` events for that.
- **Stamp position.** On home library cards the decorative cover stamp already sits top-right. There the save stamp needs a different corner, or it should replace the decorative one once a story is saved.
