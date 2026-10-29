# Change log for approval: the home page flashes the old hero before the cover (29 October 2026)

Nancy, 29 October 2026: "When I load TLL the old homepage front loads in blink before the new one, flashes".

## What happens
- The magazine cover on the home page is drawn by the site script tllsitelayersv14. Since v9 it has taken over the hero: cover photo, chip, kicker, deck, button and stamp.
- The page as Webflow sends it still holds the old hero: the old photo, the old heading text and the old button.
- The cover part of the script waits for "DOMContentLoaded" before it does anything, both its style and its swap. That moment comes only after every script further down the page has run: jQuery, Webflow, GSAP, Memberstack and the others.
- By then the browser has already painted the old hero. Then the cover replaces it, and that swap is the blink.

## Change (numbered for your reply)
| # | Where | Change | Result |
|---|---|---|---|
| F1 | The site script: a new version, tllsitelayersv15, built from v14 with the cover part changed and nothing else | The cover's style goes into the page head straight away, instead of waiting. The swap runs the moment the hero has arrived in the page, before the browser paints it, and DOMContentLoaded stays as the fallback. | The first thing you see is the cover. No words, photos or links change. |

Not in this log: the old hero photo is still downloaded and then not shown. Stopping that would mean changing the Designer hero image each time the cover changes. I'd leave it unless you want it.

## How I check it
- On a local copy of the home page: record the first painted frame, at 1440 by 900 and at 375px on a slowed connection. It should show the cover with no old hero in any frame.
- Run the same check on the subdomain after a subdomain-only publish, then come to you.
- The site stays at 15 scripts: v15 replaces v14 in the header with a new jsDelivr pin and SRI, the same way v9 to v14 went in.
- It needs the Webflow lock, which is free now.

Reply "Approve F1" to go ahead.

## Approved 29 October 2026
Nancy: "Approve F1".

## Built in the repo (29 October 2026), waiting for the Webflow lock
- **Built as tllsitelayersv16** (src/site-layers/build-site-layers-v16.py, tll-site-layers-v16.js). The cloud session's v15 is saved in Webflow but not published (story photos on five pages and Join free on the cover), and it asked for F1 to be built on top of it.
- **What changes from v15 (the cover part only):**
  - The cover style goes into the head at once, then moves to the end of the body when the page is parsed, exactly as before.
  - The cover fills the hero as soon as the hero's next element arrives, with the page-parsed event as the fallback.
- **Tested on local copies of the live home page,** served at the root (the cover only runs there), with v15 and with v16:
  - v15: when the hero has arrived it is still the old one: old photo, no cover style, cover not filled. The cover fills only after the page is parsed.
  - v16: when the hero has arrived it is already the cover. The cover photo, the cover style in the head and the chip, kicker, credit, stamp and Join free are all in place, at 15 ms against 44 ms for page parsed, and before the first paint. Each piece appears once.
  - Finished page: the hero in v16 matches v15 exactly, all 31 elements in position, size and style. At 375px the result is the same, with no sideways scroll.
- **Next:** once the cloud session's lock line is released, or it takes F1 into its publish, v16 replaces v15 (or v14) in the header. That means a new jsDelivr pin and SRI, still 15 scripts. Then a subdomain publish and a check of the first paint there, then Nancy's look before www.
