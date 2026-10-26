# Why Much Better Adventures feels better on a phone (26 October 2026)

Nancy, 26 Oct, with ten iPhone screenshots of muchbetteradventures.com, top to bottom: "This is one of my favorite travel sites and I think their mobile is so much better but I don't know why." Her own read: "Better use of photos, design, content, colors, and icons."

This note is the answer, and a list of what That Layover Life can borrow without copying their brand. Nothing here is a change to the live site. It is the brief for a phone prototype of the home page, to be approved before any Webflow write.

## The short answer

It is not one element. It is a rhythm, kept the same on every screen:

one idea, one heading of three to six words, one sentence, one thing to tap, then a change of background.

Every section fills about one phone screen and then hands off to the next with a color change. You never see two headings, two paragraphs or two buttons on the same screen. That is what reads as "designed".

## What they do, screen by screen

1. **Header.** One row: menu, logo, three icons. No buttons in the header at all. The one call to action lives in the hero, not in the bar.
2. **Hero.** A dark scrim over the photo, a three-word headline, one serif line under it, one button. The Trustpilot line sits above the photo as proof before the pitch. The photo is a person's face, cropped portrait.
3. **Cards are photos.** Every card is a tall portrait photo with one label and nothing else. Text is never laid over a busy part of a photo; it sits in the dark band at the bottom. Portrait crop is the whole trick on phones: a landscape photo on a 390px screen is a strip, a portrait one is a window.
4. **Swipe rows with a peek.** Cards sit in a horizontal row, and the next card shows about 60px at the right edge, with dots below and a chevron. The peek is the invitation to swipe. Tabs above the row (Destinations, Activities, Collections; Last minute, Popular, Just added, Early bird) let one row serve four lists, so the page stays short.
5. **One accent color, used only on things you tap.** Lime green appears on the button, the active tab underline, the progress bar, the help bubble and the "NEW" chip. Nothing decorative is green. Everything else is near-black, white, off-white and a dark green. So the eye always knows where to go next.
6. **Backgrounds alternate.** White, near-black, dark green, cream, white, near-black, light gray. Each section change is a color change, full bleed, square edges. Rounded corners are kept for cards only. You feel progress as you scroll.
7. **Type.** One sans family, two weights. Headings are heavy caps at about 32px, body is sentence case at 17 to 18px with loose leading, no paragraph over three lines. A serif appears exactly twice (hero sub line, "Our purpose") and a handwritten script once. Each of those is a deliberate change of voice, which only works because the rest is so plain.
8. **Icons.** One set of hand-drawn line illustrations, black with a single green fill, at the same size and weight everywhere. They carry the "why us" and "book with confidence" sections: icon, bold title, two lines. Without them those sections would be four text blocks. The cartwheeling figure and the globe are the same drawing hand, so the brand has a personality even where there is no photo.
9. **Proof in numbers and badges.** Trustpilot at the top and the bottom, ABTA, ATOL and B Corp in the footer, "75% join as solo travellers". Travel buyers are nervous; the page keeps answering "is this safe" before it is asked.
10. **One floating thing.** The help bubble, bottom right, the same on every screen. It is the only element that overlaps content.
11. **Spacing is even.** A 16px gutter everywhere, one card radius, the same vertical padding above and below each section. Nothing is cramped and nothing is dead space.

## What does not transfer

- They sell trips. Prices, levels, review counts and "260+ adventures" are the content of a shop. We publish stories and we do not type counts.
- Lime and dark green are theirs. Ours are rose (#F0507A on dark, #C8325B on light), teal (#00C9C8 on dark, #067A79 on light), cream and ink. The lesson is to use one of them for taps only, not to change the palette.
- Trustpilot and ABTA have no equivalent. Our proof is a person's byline, a real photo, a date and a place.
- They have a product team and a budget. The rhythm above costs nothing, though; it is a set of rules.

## What our home page does today, by their rules

Sections, top to bottom: hero (Find your next somewhere), The library (six stories), You went (Chapter 01), Meet the locals, Traveling with your bestie, Trips that can't wait, Where did your last, Every place you have been (map), The Layover and Your inbox deserves (newsletter).

- The hero on phones already follows this (full-bleed photo, headline at the bottom, one block of buttons, the 26 Oct phone layer). Keep.
- The library stacks six cards vertically on a phone, so it is about three screens long before the first chapter. Their answer is one swipe row with a peek, and tabs (for us: Latest, Places, Nancy's picks or Photos) so the row can rotate without growing.
- The chapters are text first: eyebrow, heading, paragraph, caption. On a phone they read as four similar blocks. Their answer is to give each chapter one portrait photo, a heading of three to five words, one sentence and one button, and to alternate the background (ink, cream, ink, cream) so each chapter is a new screen rather than more of the same.
- We have no icon set. A single hand-drawn line set for "how it works" (write it, add photos, the editor reads it, it is published under your pen name) would turn the how-it-works copy into one screen.
- Rose and teal are both used for text and decoration in places. Pick one for taps (rose) and keep teal for the FREE line and labels, so a rose thing is always something you can press.
- The "Tell the editor" pill is our floating element and should stay the only one.
- Card radius, gutters and section padding vary between embeds (some are 0, some 12px, some 20px). One value each.

## Borrow list, in order

1. Alternate section backgrounds on phones (ink, cream, ink, cream), full bleed, square edges, one vertical padding.
2. Library as a swipe row with a 60px peek, dots, and two or three tabs.
3. Chapters as one-screen blocks: portrait photo, short heading, one sentence, one button.
4. Rose for taps only. Teal for labels. No decorative rose.
5. One card radius and one gutter across every home embed.
6. A small hand-drawn icon set for how it works and for the newsletter block.
7. Proof near the top: a byline, a place and a date under the hero, in place of a review score. (Correction, 26 Oct: the proof line is "Written by the people who went", never a claim that no story was written by AI.)

## Next step

A phone-width prototype of the home page in this rhythm, in our colors and with our real stories and photos, as a standalone HTML file and screenshots at 390px. Nancy approves or edits. Then it becomes a home packet like F1 to F6, with before and after screenshots, and a publish on her say-so.
