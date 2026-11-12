# Editorial Grid

A clickable prototype of the /stories card grid, rebuilt as an editorial layout. Open `index.html` in a browser. Two tabs share one set of controls: **Proposed** (the new grid) and **Today** (the same cards in the layout live on /stories now). Mock-up only: nothing here is loaded by the live site.

Screenshots: `shot-390.png` and `shot-1440.png` (Proposed tab, newest first, first 16 cards, full page).

## How the brief is met

- **Cards with the five attributes.** Each card shows the contributor (author), the title, the place as a destination tag, the reading time, and a photo credit. All five come from the live story data.
- **One column to an asymmetrical spread.** The grid CSS is its own commented `<style id="eg-grid-css">` block that can be lifted out unchanged. It uses container queries with closed ranges at **600**, **900** and **1280**:
  - under 600: one column;
  - 600: two columns, the first of every five cards spans both;
  - 900: six tracks, a band of big (4) plus tall (2), then rows of three, with the big/tall band flipped every other time;
  - 1280: twelve tracks, big (7) plus tall (5), then tall (3) + wide (6) + tall (3), then three equals, then the flip.
  The asymmetry is explicit `grid-column: span n` on `:nth-child()` patterns. I did not use `grid-template-areas` because the list is open-ended and areas only describe a fixed number of cards.
- **Variable title lengths, no ragged bottoms.** From 600 up each card is `grid-template-rows: subgrid` over four rows (five with excerpts on), so the tags, titles and footers in one band share rows and every footer starts on the same line. The parent's row gap is the in-card gap and the band spacing is a bottom margin, because a subgrid gap that differs from the parent's pads the rows. Without subgrid, cards fall back to flex columns with the footer pushed down, so the bottoms still meet. In each band the wide card sets the photo height with `aspect-ratio` and its partners stretch to match. Cards left alone at the end of the list take the rest of the row, so there are no holes (checked with all 57).
- **Serif and sans balance.** Titles are Playfair Display 800 (-0.01em, `text-wrap: balance`). Author, reading time and credit are IBM Plex Sans Condensed. The destination tag, labels and readouts are JetBrains Mono uppercase.
- **Today for comparison.** The second tab rebuilds the live card from `src/pages/stories/v3/s3-stories.css` and the fix-first rules published on /stories: `auto-fill` columns of at least 340 px, the lead card on top, the place badge on the photo, the title on a cream tab, the pillar and minutes kicker, the excerpt and the byline.
- **Things to click.** Order (newest first, as on /stories, longest titles first, random pick), preview width (Full, 1280, 900, 600, 390; it narrows the grid's container, so the container queries respond at any window size), excerpts on and off, grid lines (shows the tracks and each card's subgrid rows), show all 57. Width presets wider than the window are taken off the row, and on a phone, where only Full would be left, the whole group steps aside. A readout gives the measured grid width, track count and active step. The code panel shows the actual text of the lift-out block, read from the page, with a copy button.
- **Checked** in Chromium at 390, 768 and 1440: no sideways scroll, no console errors, axe-core clean on both tabs, all controls work by keyboard with a visible focus ring, motion off under reduced motion. At every step, with and without excerpts, with 16 and 57 cards, titles and footers line up in every band and no row leaves a hole.

## Departures from the brief's wording

- **"Photo Credits."** TLL cards have no photographer field, so every credit reads "Photo: <contributor>". On the four real photos the credit links to the story.
- **Excerpts** are not one of the five attributes in the brief, so Proposed hides them by default. The toggle is there because excerpts are the real stress test for uneven cards.
- **Today tab** is not pixel-identical to the live page. Mono labels are 12 px here (10 to 10.5 px live, under the kit's minimum), colors use the kit tokens (#555555 in place of the live #3a3a3a), contributor avatars are left out (the live CSS hides empty ones), and its breakpoint is a container query so the width chips work on both tabs.

## Real and SAMPLE

Everything shown is real. The 57 stories (titles, places, contributors, minutes, pillars, excerpts, the /stories order) were read from the live /stories page on 12 Nov and match the data in the smart-omnibar prototype. Dates are the cards' own date field. `story-search-index.json` only holds body words, so it was not used. Titles and excerpts are quoted as published, so a few break the house style and were left alone: the Pompeii excerpt has an em dash and two titles end in an exclamation mark ("Celebrating an Epic Trip in the Pac NW!", "Patience, Iago, Patience!"). The Southern Africa excerpt spells it "centre". On 12 Nov the reviewer re-read /stories and matched all 57 cards field by field (title, place, contributor, minutes, pillar, excerpt, date, order): no differences. The four photos are the stories' own hero images (Pompeii by Roberta Bianchi, Torrevieja by Luke Luby, Even Brave Boys Get Scared by Jay Carleton, Sort Sol by Nancy Carleton), each under 60 KB, with the site's own alt text. Every other photo spot is a labeled "PHOTO / Hero photo from this story" slot. All counts are computed from the data in the page, including the photo count in the Proposed intro. Nothing needed a SAMPLE label.

## Moving it onto the real site

/stories is Webflow with CMS cards (`.tll-lib-grid > .w-dyn-item > a.tll-lib-card`), so production would be one CSS layer, not new markup:

- Move the lift-out block into the existing `tll-s3-stories` stylesheet, remapped to the live classes (`.tll-lib-grid` for `.eg-grid`, `.w-dyn-item` for `.eg-card`). Nothing in it depends on Tailwind or on this page's script, and it takes no new script slot under the 15-script cap.
- The Webflow card is a single `<a>` holding a body div, so subgrid needs the card's children to sit on the grid: either `display: contents` on the `<a>` and the body (keeping the link focusable needs care), or a Designer change that flattens the card. This is the one real piece of work.
- The destination tag uses the existing `data-s3-place` binding, the credit needs a "Photo credit" CMS field (or defaults to the contributor), and the photo is the CMS image with `object-fit: cover`.
- The live breakpoints are media queries. Container queries are fine in every browser TLL supports, but keeping media queries at the same widths also works because the grid is full width on /stories.

## For Nancy to decide

1. Whether the big cards follow position (as here: every eighth card) or a "pick" flag in the CMS, so a chosen story gets the big spot. The live cards already carry a `data-tll-pick` binding, and on 12 Nov only the Pompeii card had it set.
2. Whether excerpts show on the grid or only on the lead card.
3. Whether to add a photo credit field to the Stories collection, or keep crediting the contributor.
4. Whether the Designer can flatten the card markup for subgrid, or the layer uses `display: contents`.
