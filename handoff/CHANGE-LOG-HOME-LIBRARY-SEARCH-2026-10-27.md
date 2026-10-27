# Change log for approval: home library heading and search bar (27 October 2026)

Nancy, 27 October 2026, on www.thatlayover.life at laptop size: "Some type is cut off" (the library heading), and "On the search bar it is still smooshed". Nothing in this log changes any words on the site. Both fixes are code only, on the home page.

## What is wrong
**H1. The library heading is cut off on shorter windows.**
- On wide screens the library section "pins": it holds still while the cards slide sideways as you scroll.
- The pinned area is one window tall, with its content centered top to bottom. The content is about 650px tall: the line "54 published so far · six of them here", the "The library." heading, then the cards.
- When the window is shorter than that plus the 77px menu bar, the content spills past the top and bottom. The menu bar sits on top of the spill.
- On a 1000 by 570 window (a laptop with the bookmarks bar showing), the top line sits 40px above the window. That is the cut you saw. The card titles are cut at the bottom too.

**H2. The search bar is squeezed into a narrow centered column.**
- A Designer style on the box around the search form caps it at 640px wide and centers it.
- The 19 October fix (tll-home-search-left-v5) was meant to undo that cap. The box sits one level deeper than that fix expects, so it never applies.
- So the field starts about 130px to the right of "Search it" and the Try chips. It is 512px wide, while the hint needs about 620px at that size, so "Search a country, a layover, a feeling…" shows as "Search a country, a…".

## Changes (numbered for your reply)
| # | Where | Change | Result |
|---|---|---|---|
| H1 | Home, the library embed (94ce12c0), its pin script and two CSS lines | The section pins only when its content fits the window under the menu bar. The pinned area also starts under the menu bar instead of behind it. When it doesn't fit (shorter windows), the section works as it does on tablets: the cards scroll sideways with a swipe or trackpad, and the hint reads "Swipe, they move sideways →" (the existing tablet wording). | Nothing in the library section is cut off at any window height. On tall screens it pins and slides as today. |
| H2 | Home, the page head code tll-home-search-left-v5, one added rule (it becomes v6) | The box around the search form loses its 640px cap and its centering, so the field lines up with "Search it" and runs the full column width. | At 1000px wide the field is 772px, the whole hint shows, and it lines up with "Search it" and the Try chips. Phones keep their own rules (v4 and the 480px rule in v5). |

Tested in my browser on www at 1000 by 570 by adding the CSS in the browser only (nothing saved): H2 gives the full hint, lined up with the left column. For H1, the unpinned look at that size shows the heading and cards whole. Before the Webflow write I test both again on a local copy at 1440 by 900, 1000 by 570 and 375px. Then a subdomain test publish for your look.

## Who builds it
Both changes are Webflow writes on the home page, which needs the Webflow connector and the lock. The Edit profile look session holds the lock now for E1 to E11, which does not touch the home page. Once it releases the lock, or you connect Webflow here, I take the lock, write H1 and H2, publish to the subdomain, and come to you before going live.

Reply with the item numbers to approve or change.

## Approved 27 October 2026
Nancy: "Approve H1 and H2, publish www". The www part was the L1 to L7 link bindings, published from her Designer to www and the subdomain at about 01:04 UTC.

## Built in the repo (27 October 2026), waiting for the Webflow lock
Files are in src/pages/home/live-2026-10-27/:
- embed-94ce12c0-before.html is the live embed, matched word for word on the subdomain.
- embed-94ce12c0-after.html adds H1. The library pins only when it fits under the menu bar. While pinned, the pinned area starts under the menu bar, and the heading and cards size to the window height (title at most 15% of the height, card width from the height left). So a 1440 by 900 laptop still gets the sideways slide, and nothing is cut. Below the size that fits (for example 1000 by 570), it scrolls sideways as on tablets.
- page-head-search-left-v6.html is H2. It is appended to the home page head code after v5.
  - It lifts the 640px cap on the box around the form.
  - It also brings back the 19 October phone sizes from v5 (field 20px, hint 16px), which tll-home3-v1 had overridden. On a 375px phone the hint read "Search a country, a layover, a fe…". It now shows whole.

Tested on a copy of the current subdomain home page, which carries site layers v12 with the card stamps:
- 1440 by 900: pinned. The top line sits at 85px, under the 77px menu bar. The cards end at 892px of 900. Halfway through, the rail has moved 535px.
- 1000 by 570: not pinned. The heading and cards are whole, the search field is 792px wide, the hint needs 665px, and the field lines up with "Search it".
- 375 by 812: not pinned. The search field is 20px and the hint 16px (282px of 335). No sideways page scroll.
