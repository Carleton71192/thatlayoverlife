# Change log: the Layover Lounge as a postcard deck (11 November 2026)

Source: Nancy, 11 November 2026, pasting a postcard deck prototype for the Lounge on /gallery: "The media list scrolls vertically, requiring extensive page browsing to scan multiple entries." Replace the static grid with "an optimized, interactive layered stack element": each photo becomes a postcard, and on phones a swipe sends the top card away.

Nancy asked for this log split by what can be done now and what waits on something, in priority order. Nothing here is built. Nothing changes on the site until you say yes, and nothing goes to www until you say so after the preview.

## Today (read 11 November 2026)

- /gallery, H1 "A photo, not an essay." The Lounge is a vertical grid of 17 photo tiles, all your photos, each credited "NC · <PLACE>" (Montenegro, Vietnam, Bulgaria, Ghana, Qatar, Antarctica, Deception Island, Patagonia, Brazil, Curaçao, USA, Chile, Portugal, Singapore, France, Türkiye, Laos). By continent: Europe 5, Americas 5, Asia 3, Antarctica 2, Africa 1, Middle East 1. On a phone that is a long scroll.
- The page script "TLL Lounge v2" (29 September 2026) paints each photo and its credit label, shows "OPEN SLOT · <place>" on any tile without a photo (none today), runs the continent filter chips, and keeps the ADD YOURS tile (links to /share-photos) always visible.
- Site layer `tll-lounge-labels-v1` (29 October 2026) makes the credit labels small and puts them in the corner.
- Site layer `tll-lounge-members-v1` (31 October 2026) is already loaded on /gallery. It asks the Worker for member photos (`GET /lounge`) and would put the newest 12 at the front of the grid. Today `/lounge` answers 404 "not found", so it adds nothing. That route is W4 in the Worker catch-up log, not deployed.

## Why the prototype code is not used as is

The pasted prototype shows the idea well but cannot go on the site: the card markup was stripped out, its Tailwind, Google Fonts and Unsplash links were cut off, and its captions put invented quotes under real contributors' names (Jay Carleton, Barzy Adam). Every word on the site comes from the member, so those captions cannot be used. What we keep from it: the stack with small tilt and offset under the top card; drag or swipe past about 140 px throws the top card off, otherwise it springs back; a postcard back on double click; a side panel; Reset and an empty state. The first three are in group 1 below; the back and the panel are your decision in group 3.

## Group 1. Can be done now (no dependencies), in priority order

What it needs before it can go live: your yes on L1 to L9, your answers to L12 to L14 in group 3 (placement, order, wording), the tests below passing, and your check on your iPhone at the preview link. Then it goes to the subdomain, and to www on your word. It can be built and previewed before group 3 is answered; the preview shows both placements so you can choose by looking.

**L1. The deck.**
- Where: /gallery, the Lounge grid (the 17 tiles under "A photo, not an essay.").
- Before: 17 tiles in a grid, read by scrolling down.
- After: one postcard on top, the next two peeking out beneath it with a slight tilt (2 to 4 degrees) and offset (about 10 px), so it reads as a stack. Each card is the photo in a white postcard border with a soft shadow and the same corner credit label as today ("NC · MONTENEGRO"). Drag with a mouse or swipe with a finger: past about 140 px (or a quick flick) the card flies off and the next one rises; short of that it springs back. A card sent away is set aside, not lost; Previous (L2) brings it back. After the last card, an end card (wording in L14) offers Start again (the prototype's Reset) and Add yours.
- Why: your brief. One photo at a time, no long scroll.

**L2. A way through every photo without swiping.**
- Where: under the deck.
- Before: not needed (the grid shows everything).
- After: Previous and Next buttons with a counter ("3 of 17"); the left and right arrow keys work when the deck has focus; a "See all as a grid" link shows today's grid, with "Back to the deck" at its top. Buttons are at least 44 px for thumbs.
- Why: not everyone can or will swipe (mouse users, keyboard users, people who do not guess it is a deck). Every photo stays reachable.

**L3. Screen reader labels.**
- Where: the deck and its controls.
- Before: each tile is read as an image with its label.
- After: the deck is a labeled region ("Lounge photos"). Only the top card is read; the cards beneath are hidden from screen readers. Each card is read from its tile data only: the place and credit (for example "Montenegro, photo by NC"). Moving to a new card announces "Photo 3 of 17, Montenegro". Buttons have plain names (Previous photo, Next photo). Focus never lands on a card that has flown off.
- Why: the swipe is visual; this makes the same thing work by ear.

**L4. Reduced motion.**
- Where: the deck, for visitors whose phone or computer asks for less motion.
- Before: no motion on the grid.
- After: no throw, no spring, no tilt. Cards sit square and simply change. Swipe, buttons and keys still move through the deck.
- Why: flying cards can make some people unwell; their own setting decides.

**L5. Filter chips, ADD YOURS and OPEN SLOT kept.**
- Where: the continent chips above the Lounge, the ADD YOURS tile, the OPEN SLOT label.
- Before: chips filter the grid; ADD YOURS is always visible; OPEN SLOT shows on a tile without a photo.
- After: chips filter the deck (tap Europe and the deck holds 5 cards, "1 of 5"); tapping All restores all 17. ADD YOURS stays visible next to the deck controls and is also on the end card, still linking to /share-photos. A tile without a photo becomes a card reading "OPEN SLOT · <place>" with the same link (none today, kept for later).
- Why: nothing the Lounge does today is lost.

**L6. Captions and credits only from the tile.**
- Where: every card.
- Before: each tile carries its photo, its continent and its credit.
- After: a card shows only what its tile carries: the photo and the credit label. Your 17 tiles have no caption, so their cards have none. No words are written for a card, and nothing from the prototype's captions is used.
- Why: the site rule that every word comes from the member (here, from you).

**L7. Phone and desktop sizes.**
- Where: the deck at every width.
- After: on a phone (390 px wide), the card fills the width less a 24 px margin each side, in a 4:5 portrait shape, with the controls under it, and the whole deck fits on one screen. Up and down swipes still scroll the page; only a sideways swipe moves a card, so the page never feels stuck. On a computer (1440 px wide), the card is about 420 px wide and centered, with the controls under it. Photos are loaded one or two ahead, so the next card is ready.
- Why: most visitors are on phones; the deck must not trap the scroll.

**L8. Site look only.**
- After: no Tailwind, no new fonts, no outside images. Type uses the site's own faces from the brand kit (`handoff/TLL-BrandKit-v2.1.html`): JetBrains Mono for the labels and counter, DM Sans for buttons, Syne only if a heading is needed. Colors from the brand kit: cream #F7F1E8 behind, ink #0A0B14 for text, teal #067A79 for buttons, the site's teal focus ring.
- Why: it should look like That Layover Life, not a template.

**L9. Built as a new site layer, preview first.**
- Where: new file `src/site-layers/tll-lounge-deck-v1.js`, added to the site layers build, loaded on /gallery only.
- Before: not there.
- After: the layer reads the tiles already on the page and builds the deck from them. It does not change the Webflow page, its markup, the "TLL Lounge v2" script or the label layer; the grid stays in the page underneath. It loads only with `?preview=lounge` (and `?preview=lounge-above` to see the deck above the grid instead, for L12). Visitors without the flag see today's Lounge and do not download the new code.
- Webflow: one new site layers version registered, published to the subdomain first, then www on your word, each logged in `handoff/WEBFLOW-LOCK.md`.
- Why: you see it on your own phone before anyone else does, and taking it away is one step (see Rollback).

## Group 2. Waits on the Worker deploy (W4)

What it needs before it can go live: W4 (instant set-up of submissions, which includes `GET /lounge`) deployed by you. The Worker catch-up log (`handoff/CHANGE-LOG-WORKER-CATCHUP-2026-11-11.md`, update of 11 November 2026 about 13:35 UTC) asks that the next-morning review be fixed before W4 goes live, because its runs of 9, 10 and 11 November stopped waiting for a permission and wrote no reports. Then one real member photo sent through /share-photos, published, and seen in the deck. The code for L10 can be written and tested now against a pretend `/lounge`, and shows nothing until the real one answers.

**L10. Member photos in the deck.**
- Where: the deck, and the existing layer `tll-lounge-members-v1`.
- Before: the layer would add up to 12 member photos at the front of the grid once `/lounge` answers. The member's caption is only read aloud, never shown.
- After: member photos become cards at the front of the deck, newest first. Each card shows only what that member gave: their photo, their own caption under it, their place (city and country as they typed it), and their initials as credit ("JC · LISBON, PORTUGAL"). A member who chose to stay anonymous gets the place alone, no initials. The photo's description is used for screen readers. Nothing is added, shortened or reworded. A small update (`tll-lounge-members-v2`) puts these details on each member tile so the deck can read them.
- Why: your 31 October 2026 ask that photos sent through /share-photos appear at once, now in the deck.

**L11. Member photos under the right chip.**
- Before (an existing fault, not yet visible): `tll-lounge-members-v1` gives every member photo the continent of the first tile on the page (Europe, from Montenegro). Once W4 is live, a member's photo from Japan would show when someone taps Europe.
- After: member cards show under All only, not under a continent chip, until the Worker also sends the continent (L17).
- Why: a wrong filter is worse than none. This needs fixing whether or not you take the deck, so it goes in with W4 either way.

## Group 3. Waits on your decisions

What it needs: your answers. L12 to L14 are needed before group 1 goes to www. L15 and L16 are left out unless you say keep.

**L12. Deck in place of the grid, or above it.** Proposed: in place of the grid, with "See all as a grid" (L2) for anyone who wants the full view. Above the grid keeps today's long page under the deck, which is the problem your brief names. The preview shows both (`?preview=lounge` and `?preview=lounge-above`).

**L13. Order of the cards.** Proposed: member photos newest first (once W4 is live), then your 17 in today's page order (Montenegro first). Not shuffled, so "3 of 17" means the same photo on every visit. Other choices: shuffled on each visit, or your photos first.

**L14. The words on the deck.** Proposed, all new: "Previous photo", "Next photo", "3 of 17", "See all as a grid", "Back to the deck", and on the end card "That is all 17. Start again · Add yours". Change any of them.

**L15. The postcard back (flip).** In the prototype, a double click turns the card over to a back with a stamp holding the initials, PAR AVION, and a luggage tag line with the place. Every word on it can come from the tile, so it does not break the rule. Proposed: leave it out of the first build. Double click is hard to find and does not exist on a phone; if you want it, it would be a "Turn over" button instead. It can come later (L19).

**L16. The side panel.** In the prototype, a panel beside the deck repeats the top card's place, caption, credit and a "Read the story" link. Proposed: drop it. Your photos have no caption or story to link to, so the panel would only repeat the label; on a phone it would push the deck down the page.

## Group 4. Later or optional

- **L17. Continent for member photos.** The Worker adds the continent to each `/lounge` photo, so member cards filter under the right chip. Needs another Worker change and deploy.
- **L18. A link to one card.** `/gallery?card=laos` opens the deck on that photo, for sharing one postcard.
- **L19. The postcard back,** if you leave it out now (L15).
- **L20. The deck elsewhere,** for example on /spotlight (which also loads the member photo layer) or the home page.
- **L21. Retiring the hidden grid code** once the deck has been live for some weeks. Not before; it is the fallback.

## What it touches

- New: `src/site-layers/tll-lounge-deck-v1.js`; the next site layers build script (adds the layer to the /gallery chunk, preview only); tests in `src/pages/gallery/deck-2026-11-11/`.
- Group 2 only: `src/site-layers/tll-lounge-members-v2.js` in place of v1.
- Webflow: one site layers version registered, subdomain publish, then www on your word. Logged in `handoff/WEBFLOW-LOCK.md`.
- Not touched: the /gallery page in Webflow (markup, the "TLL Lounge v2" script, chips, ADD YOURS), `tll-lounge-labels-v1`, the Worker, Memberstack, any data-ms-* element, /spotlight.

## Test plan

Playwright, following the old harness `src/pages/gallery/test-2026-10-29/t.mjs`, on a saved copy of the live /gallery with all 17 tiles, at 390 px and 1440 px wide, screenshots before and after:

1. Without `?preview=lounge`: the page is byte for byte today's Lounge and the new layer is not downloaded.
2. With it: 17 cards; the top card is Montenegro (or the L13 order); "1 of 17".
3. A 160 px drag throws the card and shows "2 of 17"; a 100 px drag springs back to "1 of 17".
4. Next, Previous, and the arrow keys move one card each way; Start again returns to card 1; the end card appears after card 17.
5. Each chip: Europe gives 5 cards, Americas 5, Asia 3, Antarctica 2, Africa 1, Middle East 1, All 17.
6. ADD YOURS is visible and links to /share-photos; a test tile without a photo shows "OPEN SLOT · <place>".
7. Every card's visible text and spoken label match its tile's data exactly; no other words on any card.
8. Screen reader checks: the region label, only the top card readable, the announcement on each move, button names.
9. Reduced motion turned on: no transition, no tilt, cards still change by swipe, buttons and keys.
10. At 390 px, an up and down swipe on the card scrolls the page and does not move the card.
11. "See all as a grid" shows the 17 tiles; "Back to the deck" returns to the same card.
12. No requests to Tailwind, Google Fonts or Unsplash; no console errors; deck appears within half a second of the page.
13. Group 2, with a pretend `/lounge` holding two photos (one anonymous): they come first, show their own caption, place and initials (none for the anonymous one), appear under All and no continent chip; with `/lounge` answering 404, the deck still holds 17.

iPhone: after the tests pass, the layer goes to the subdomain behind the flag. A build session checks it first in Safari on the iOS Simulator, then you open `https://that-layover-life.webflow.io/gallery?preview=lounge` on your iPhone and swipe through: throw, spring back, scrolling the page past the deck, a chip, ADD YOURS.

## Rollback

- While in preview: nothing public changes. To remove, take the layer out of the build and register the previous site layers version.
- After www: register and publish the previous site layers version (its pin is recorded in `handoff/WEBFLOW-LOCK.md` before the change). The Webflow page and its grid are never edited, so today's Lounge comes back as it is, in one publish. A quicker middle step: put the layer back behind `?preview=lounge`.
- Group 2: going back to `tll-lounge-members-v1` restores today's behavior, including the wrong-continent fault in L11.

## Your call

1. Approve as written: group 1 built and put behind `?preview=lounge` for your iPhone check, group 2 when W4 is deployed, group 3 as proposed (deck in place of the grid, fixed order, no flip, no side panel).
2. Change it: tell me which items or words (L12 to L16 are the open choices).
3. Not now.

## Approved 11 November 2026

Nancy: "Approve as written, build group 1 behind the preview".

So: L1 to L9 are built behind `?preview=lounge`. Group 3 stands as proposed (deck in place of the grid, fixed order, the words in L14, no flip, no side panel). Group 2 waits for W4. Nothing goes to www without your word.

## Built 11 November 2026 (in the repo, not yet on the subdomain)

- L1 to L9 are built: `src/site-layers/tll-lounge-deck-v1.js`, commit 5d3f7bb. It rides in the preview-only chunk (`chunks/misc-preview.js`) and runs only with `?preview=lounge` or `?preview=lounge-above`. The public /gallery chunk is byte for byte unchanged.
- Tests (`src/pages/gallery/deck-2026-11-11/t.mjs`, on the saved live /gallery of 11 November 2026, at 390 px and 1440 px): Chromium 97 checks pass, WebKit (Safari's engine) 94 pass, covering test plan items 1 to 12 and the 404 half of 13. The repo's 353 unit tests pass. Screenshots are in the same folder (before, after, drag, end, grid, still, above).
- Measured: phone card 342 by 428 px with 24 px margins; desktop card 420 by 525 px, centered; the deck shows within half a second; no sideways scroll after a throw; an up and down swipe on the card scrolls the page.

Three places where the build differs from the wording above, for you to see in the preview:

1. **L8, buttons.** The log named DM Sans and teal from the brand kit file. Since 10 November 2026 the live site uses one button set (IBM Plex Sans Condensed, square corners, ink outline, rose fill, rose focus ring), so the deck uses that set. Labels and the counter are JetBrains Mono as written; the end card line is Playfair Display, the site's heading face. No font is loaded that the page did not already load.
2. **L2, button words on phones.** Under 480 px the buttons read "Previous" and "Next" so the row fits; wider screens read "Previous photo" and "Next photo", and screen readers hear the full names at every size.
3. **L4, reduced motion.** The two cards beneath sit straight, a small step down, so it still reads as a stack.

Also in: the deck already takes in member tiles from today's `tll-lounge-members-v1` (first in the deck, under All only, their own label), so L11 holds for the deck. L10 (the member's caption shown on the card, `tll-lounge-members-v2`) is not built.

**W4 is live.** The Worker was deployed at 13:28 UTC on 11 November 2026 (version 2244060e). `GET /lounge` now answers 200 with no photos yet. Group 2 no longer waits on the deploy; it waits on your word and on a first member photo to test with.

**Still to do before your iPhone check:**

1. Push the built layers to the slim release branch (`bash tools/release-layers.sh` from the repo folder). This session's permission check blocked that push, as it blocked the Worker deploy on 10 November. Nancy runs it, or allows it.
2. Register that build in Webflow as site layers 16.55.0 in place of the staged 16.54.0, logged in `handoff/WEBFLOW-LOCK.md`.
3. Publish to the subdomain only. That publish also carries whatever other sessions have staged.
4. Safari check in the iOS Simulator, then your iPhone at `https://that-layover-life.webflow.io/gallery?preview=lounge`.
