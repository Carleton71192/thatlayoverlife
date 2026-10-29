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
