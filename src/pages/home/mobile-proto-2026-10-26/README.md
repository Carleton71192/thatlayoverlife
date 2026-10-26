# Home on a phone, prototype 4.0 (26 October 2026)

Nancy, 26 Oct: "Build the improved prototype", after the Much Better Adventures notes (handoff/MBA-MOBILE-NOTES-2026-10-26.md).
Nothing here is live. It is a standalone page for Nancy to open on her phone and approve or edit before any Webflow work.

## Files

- `template.html` is the page. Edit this one.
- `build.py` writes two copies from it: `home-phone-proto.html` (photos from the Webflow CDN, fonts from Google Fonts; open this on a phone) and `home-phone-proto-local.html` (photos and fonts from `img/` and `fonts/`; for offline screenshots, since the sandbox cannot reach the CDN).
- `map.svg` is Nancy's map drawn once from `map-2.0/source/member-states.json` (read 7 Oct) with world-atlas 2.0.2, inlined by the build.
- `img/` holds the photos as the Webflow asset preview returned them. Older assets came back at 500px wide (the hero, Antarctica, La Paz, Patagonia, Ghana, Bulgaria, Montenegro, Doha), so those look soft in the offline screenshots. On a phone the page loads the full-size CDN files.
- `fonts/` holds the three site fonts (Playfair Display, IBM Plex Sans Condensed, JetBrains Mono) from the fontsource packages, OFL.
- `shots.mjs` takes the screenshots and runs the checks. `shots/` has the results at 360, 390 and 430 wide, one PNG per screen plus a contact sheet.

## The rules the page follows

One idea per screen: a heading of three to six words, one sentence, one thing to tap, then a change of background. Backgrounds alternate cream, ink, cream, ink. One gutter (16px), one card radius (12px), one section padding (56px). Buttons are square, full width and 52px tall. Rose is only on things you tap (buttons, the active tab, link underlines) and on LIFE. in the wordmark; teal is for labels. The italic word in a heading is no longer rose. Photos are portrait (4:5) and carry one label in a dark band; the words sit under the photo. Nothing is typed as a count.

## Screen by screen

1. Header: wordmark, search, account, MENU. No buttons in the bar.
2. Hero: full-bleed photo, three bylines with "Written by people who went" as the proof line, the headline at the bottom, one sentence, one rose button, the free line in teal.
3. 01 The library: tabs (Newest, Contributors, Nancy's), a swipe row of portrait cards with the next card peeking in by about 90px, dots, one link.
4. 02 The dashboard: Nancy's map in a card, one rose button.
5. 03 For expats: photo tile, heading, one sentence, outlined button.
6. 04 Paw Passport: Magnus, heading, one sentence, outlined button.
7. 05 The Lounge: four square photo tiles, outlined button, one link.
8. 06 The first 100: heading, one sentence, rose button, how it works with three hand-drawn icons, the founders as four rows.
9. 07 The Layover Letter: on paper, not rose, with an ink button.
10. Close: the rotating word, rose button, one link. Footer: wordmark, six links, one line.

## Checks (26 Oct, offline)

At 360, 390 and 430 wide: no horizontal overflow, every tap target at least 44px, axe clean for contrast, target size, alt text, link and button names, labels and heading order. The tabs show 6, 2 and 6 cards. No page errors.

## What changes against the approved 3.4 design, for Nancy to accept or reject

- The library is a swipe row with tabs, not a vertical stack of six.
- Chapters are one screen each: photo tile, heading, sentence, button. The checklist, the three text cards, the luggage tag, the postcards fan and the steps strip are gone from the phone layout.
- Rose is reserved for taps. The newsletter chapter is paper with an ink button, not rose. Italic words in headings are ink or cream.
- The hero has one button. The map button lives in the map chapter.
- The chapter order is unchanged. No copy was invented; the lines come from the live page, shortened.

## Next, if approved

A home packet like F1 to F6: each chapter becomes a phone-only layer (767px and under) over the live embeds, with before and after screenshots, read-back checks, and a publish on Nancy's say-so. Desktop stays as it is.
