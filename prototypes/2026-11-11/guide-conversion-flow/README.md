# Magnus to Checkout: the guide conversion flow

A UX research document for the €9 EU pet travel guide, as one page you can click (`index.html`) and the same content in Markdown (`flow.md`). It maps how a reader gets from Magnus Waffles to the Ko-fi checkout and back, gives the exact copy for every step, a working wireframe of the landing block at phone and desktop width, the micro-interactions with timings, a checklist of honest design triggers, and what to measure. `shot-390.png` and `shot-1440.png` show the page at rest (the "All prototypes" link appears part-way down the full-page shots, where the viewport was).

## How the brief is met

| Brief | In the prototype |
| --- | --- |
| Step-by-step conversion flow, Magnus to Ko-fi | Section 01: eight numbered steps. Three doors in (end of a Magnus border story, his pet page, home chapter 04), the landing block, the click, Ko-fi, and two ways back (the TLL tab noticing the reader returned, and Ko-fi's thank-you link to `?from=kofi`). Each step has place, exact copy, why, event and status. "Show in the wireframe" sets the block to that moment. |
| Exact UX wireframe copy | Section 02 is the #guide block as real HTML in brand style, with every line in place. Toggle Phone 390 or Desktop (1120px column, scaled down only on narrow screens), four states (at rest, after the click, tab regained, from Ko-fi), and the door the reader came through. The button opens a labeled SAMPLE stand-in for the Ko-fi tab; a SAMPLE event log shows what would be sent. Ko-fi product page copy and the thank-you message are in step 06. |
| Micro-interactions | Section 03: seven, with element, behavior, timing and the reduced-motion version. Four can be played in the wireframe. All are 250ms or less, from 0.6 opacity and 8px, transform and opacity only. |
| Checklist of persuasive design triggers | Section 04: fifteen triggers, each with its copy, why it works, status and a pin number shown on the wireframe ("Show pins"). Tickable, with a tally counted from the list. Plus a list of tactics left out and why. |
| Keep the high-end, independent vibe | The doors offer more of the free guide in the site's own words. The price appears only on the page that explains it, under one filled button, and the pressure tactics are left out on purpose. |
| What to measure | Section 05: `guide_purchase_click` and `kofi_click` with params, three proposed events, Ko-fi sales by hand, a funnel and the two ratios to read. |

## Where I departed from the brief's wording, and why

- **Regulation.** The brief says 576/2013 may be cited. The repo's pet notes (docs/notes-2026-10-31/linkedin-pet-posts.md, which cite EUR-Lex) and the prepared tll-pet-passport-v1.js say Commission Delegated Regulation (EU) 2026/131 replaced it from 22 April 2026, so the block cites 2026/131 and links its name to EUR-Lex and the dates stay as Nancy placeholders. Citing a replaced rule on a page selling compliance would undercut the page.
- **Headline.** The live block's headline is "Crossing borders with a dog, without the part where you cry at a checkpoint." The brief gives Nancy's 10 Nov line for this slot, so that is the headline, and the live line moves to the Ko-fi summary.
- **"Senior UX Researcher" framing.** No user research was run and none is claimed; this is a design proposal built from the live pages and the repo.
- **Delivery and refunds.** The brief lists "what happens after paying" and a refund line. Delivery is written as Ko-fi download plus email, marked for Nancy to confirm; the refund row is empty until she writes one.
- **The guide's contents.** Taken word for word from the live "In the guide" rows; nothing added. The page count is a placeholder.
- **Country count.** The block counts Magnus's countries from the list on his page instead of typing a number. On 12 Nov the rendered site says 15 everywhere (his page, the example card, the guide intro and home); the Webflow HTML underneath still says 12, 3 and 13, which section 06 flags.

## Real and SAMPLE

Real, quoted from www on 12 November 2026: every line of the free four and the five "In the guide" rows, "The Paw Passport · a field guide · PDF", the intro sentence, "Not legal or veterinary advice. Your vet has the final word.", Nancy's 10 Nov line, "Get the guide · €9" and "On Ko-fi · opens in a new tab" (from tll-kofi-v1.js), Magnus's 15 countries (the list on /pets/magnus-waffles as rendered on 12 Nov), the two story titles, /my-pets, and the photo (hero of "Even Brave Boys Get Scared", Photo: Jay Carleton, downscaled to 50 KB and embedded). Counts on the page are worked out from that data. The price comes from one constant.

SAMPLE, labeled on the page: the Ko-fi stand-in panel and the event log. New copy written here (all of it in the voice rules, no invented facts): the door lines that are not quotes, "The part after the four mistakes.", the after-you-pay rows, the tab-regained line, the return band and the Ko-fi description around the quoted rows. Placeholders: KOFI URL FROM NANCY and every [NANCY: …].

## How it moves onto the real site

Production is Webflow plus site-layer scripts, no Tailwind, 15-script cap. This prototype uses plain CSS with brand tokens for that reason. Nothing here needs a new script tag:

- **Landing block:** Webflow elements in the existing #guide section on /the-paw-passport, with the price, version and Ko-fi link bound from the planned Guides collection (build plan rows G0 to G10) once Nancy renames "Bookmarks". Until then, tll-kofi-v1 can add the price line and button; its button styles need two fixes to match the kit (#D63859 fill, square corners instead of #C8325B and 4px). tll-pet-passport-v1.js also holds a switched-off buy button and must stay off.
- **Doors A and B:** a small addition to the existing Paw Passport layer inside the bundled tll-site-layers build: door A on stories whose slugs are on a list Nancy approves, door B on /pets/magnus-waffles (or on every pet page, if she wants the line on all of them).
- **Note swap, tab-regained line and ?from=kofi band:** in the same layer, about forty lines.
- **Events:** `guide_purchase_click` and `link_url` on `kofi_click` go into the existing footer `tll-ga4-events-v1`, behind the same consent check; the three proposed events only if Nancy wants them.
- **Ko-fi:** the product copy and thank-you message are pasted into Ko-fi by Nancy.

## Checked

Chromium through Playwright at 390 and 1440: no sideways scroll, nothing under 12px, no console errors, the button, stand-in, Escape, focus trap, state toggles, doors, pins, view switch and checklist all exercised by script. Keyboard focus shows a 3px #00C9C8 ring on the dark card and 2px #C8325B elsewhere. Reduced motion turns every animation off.

Second check, 12 November 2026: rendered www with its scripts running and found Magnus's live list is 15 countries, not the 12 in the Webflow HTML, so the page now uses the rendered list. The regulation source is the repo's notes, not the live page, and the README and section 06 now say so. Also fixed: the dl that held pin buttons, the event log nested as a complementary landmark, the corner link outside any landmark, teal focus rings drawn on light backgrounds, round pins, a doubled gap in the buy button label, two small tap targets, the state buttons wrapping out of their box at 390, and a few lines that ran in threes or mirrored pairs. axe-core 4.10.2 reports nothing in any of the five states. Keyboard walk (138 stops), focus trap, Escape and reduced motion were checked at 390, 768 and 1440.
