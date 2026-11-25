# Release 16.69.0: the Nov 21 sweep fixes (class A)

Nancy in chat 21 Nov: "Keep going / Also add debug, defrag, UX, Design fixes". Test site first; www and the apex only after the checks and her yes.

## What changes
Core only (tllsitelayersv16 16.68.0 -> 16.69.0). The 21 class A fixes from the sweep (A01 to A21), the defrag, and the follow-ups for the check's notes. Full list with before and after: reports/evidence/sweep-2026-11-21/fix.md and ranked.md. No page code, no Designer, no CMS, no Memberstack change.

The sign-in return card (tll-gate-return-v1) stays staged (preview only) until Nancy answers C14.

## Checks
- check PASS WITH NOTES (dad5d98); notes fixed.
- check 2 PASS WITH NOTES (2876a45) and review 2 PASS WITH NOTES (812a5b3); finding 3.1 fixed (dabf400).
- check 3 PASS WITH NOTES (565fa41): 849 unit tests, 83 worker tests, 273 browser loads on cached pages, 0 page errors.

## Known notes
- /stories?place=Asia: one small layout shift after the grid shows (CLS 0.059 against 0.031 on www at 1440 px; www ignores ?place=). Still inside Google's good range (under 0.1). A small follow-up can remove it.
- The 10 s wait cap counts from when the core runs; no tested case came close.

## Webflow (test site)
Pin 77b56b3f8413045f2c49c3b40bd7e658689b6a90, SRI sha384-7BuGLQzS/89d4eCS1J14BHSv96uxPPr4tl62X1kJtq7Ngzljs24q8/rce1BHepYz. Registered and applied 16:13:50 UTC 22 Nov; published the test site only (publishTaskId 599d5c63-12ec-462c-80ca-1f2602978bd1). Carry check: test equals www on 12 of 12 pages apart from the core pin (reports/evidence/release-16.69.0-test/).

## Rollback
set_site_scripts with src/site/live-2026-11-22/r1669/site-scripts.before.json (16.68.0, pin 0f04fabf), then publish. Never delete the registered script.

## Live
Nancy in chat on 25 Nov: "Published www" (read as "Publish www"; Webflow showed www still on the 22 Nov publish). Published www, thatlayover.life and the test site on 25 Nov (publishTaskId c57a0e40-fafb-406e-93df-ff49edcfbff2); www served the new pin from 08:01:33 UTC. www and test HTML identical on 12 of 12 pages (reports/evidence/release-16.69.0-live/). Rollback stays as above.
