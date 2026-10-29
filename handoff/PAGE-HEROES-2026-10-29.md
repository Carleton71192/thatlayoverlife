# Page photos and the home Join free button (29 October 2026)

Nancy, 29 October 2026: "This page needs images" (/for-expats); "hero love" for /stories, /travelers, /the-map and /about; "I think the homepage is missing a CTA, it says Free to join but I am not sure someone that lands here would know they just can".

Status: saved in Webflow, NOT published. Waiting for Nancy's go.

## What changed
| # | Page | Change |
|---|---|---|
| H1 | /stories | Four story covers under the title: Ibiza (Chesney Lish), Pantanal, Antarctica, Patagonia. Each links to its story. On phones they become a swipe row. |
| H2 | /travelers | The writers' faces beside the title: Chesney Lish, Barzy Adam, Magnus, Nancy Carleton. Each links to their page. No places are shown. On phones the faces form a row above the title. |
| H3 | /the-map | Nancy's Sort Sol photo (the starling murmuration) sits behind the hero under a dark wash, credited and linked to the story. On phones it is a photo band above the title. |
| H4 | /about | A strip of four photos along the bottom of the hero: Ibiza (Chesney), Magnus, Patagonia, Pantanal. Each is captioned and linked. On phones it swipes. |
| H5 | /for-expats | A Bulgaria photo beside the hero. Below the directory there is a "From the stories" row: Montenegro, La Paz, Ghana. On phones the hero photo sits under the buttons and the row swipes. |
| C1 | Home | The cover's second button, which was hidden until now, becomes **Join free** and goes to /signup. It is an outline button next to "Read the cover story", and full width under it on phones. |

## Rules kept
- Every photo is a member's own photo, from a published story, captioned with the place and the writer. Nothing says where anyone is now.
- No headline or body copy was written. The only new words are place names, bylines, "From the stories" and "Join free".
- Nothing is removed, and no data-ms-* element is touched. The code is namespaced (tll-ph-, tll-mg-join) and runs only on these six paths.
- The site still has 15 scripts: tllsitelayersv15 replaces tllsitelayersv14 in the header (pin 74c6900f8d8e8c759ddf63aa738e57c871c6c829, SRI sha384-aya/ONAIcvXR1tg0NiwLEfaz8+piMVoSZxHjpTlGjt6uIWXuCgoGH9iTXg5Rihlt).
- Checked on offline copies of the pages at 390 and 1440:
  - Nothing scrolls sideways.
  - Axe found no new issues. Its two flags on the /stories phone view were already there before this change.
  - Captions pass contrast.
  - The map text sits on a wash dark enough to read, which I checked by eye.

## Pictures
src/pages/heroes-2026-10-29/compare/: one image per page, with before and after at 1440 on top and 390 below. for-expats-full-after-1440.png shows the whole page.

## Flags for Nancy (not changed)
- /stories title "Six stories, all worth the detour." types the count by hand. It should come from the collection, or drop the number.
- /for-expats step 02 reads "Files the local truth". "Files" is close to a banned word.
- Ghana photo: the children's faces can be recognized. It is already on the home rail, but it can be swapped for Fitz Roy if you prefer.
- The story covers are a fixed list. When a new story should lead, the list in src/site-layers/tll-page-heroes-v1.js changes.
- Another session wrote a cover-flash fix (handoff/CHANGE-LOG-HOME-COVER-FLASH-2026-10-29.md, F1) and planned to call it v15. That name is now taken by this bundle, so F1 should be built as v16 on top of v15, or folded into v15 before publish if you approve it.
