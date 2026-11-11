# Copy voice fix: report (11 November 2026)

Answers the prompt saved at claude/tll-copy-voice-fix-2026-11-10.md.

## Short version

- 24 of the 25 lines were replaced exactly as written and are live on www since the publish of 11 November, 14:06:54 UTC (your "Publish www" in the other session). An independent check compared each one with your file character by character.
- The 25th, P2 (Webflow placeholder text), is gone from the published /share-photos page. The other session repaired that form the same afternoon. The same placeholders on /submit step 3 are cleaned in the Designer and wait for the next publish.
- No string was missing. Every old line was found in at least one source.
- Release number: site code 16.54.0 carried the four lines that live in site code (H1, H3, F1, U1). The live site now runs 16.55.0, which contains the same four lines unchanged.
- Two of your lines were changed again after the publish by the trust and conversion session, on your approval there (R2 and X2, below). Those changes are staged, not live.

## Every string replaced

| # | Page | Where it lives | Status |
|---|---|---|---|
| H1 | Home | Site code, cover layer (25 weekly covers, one deck line) | Live |
| H2 | Home | Home embed 13326a8e (static fallback, hidden unless site code fails) | Live |
| H3 | Home | Site code, tll-home-value-v1 | Live |
| H4 | Home | Home embed 405baa84 | Live |
| H5 | Home | Home embed 9992aa7f | Live |
| H6 | Home | Home embed a4c1009d | Live |
| F1 | Every page | Site code, tll-masthead-v1 (writes the footer line) | Live |
| S1 | /signup | Paragraph d8aa44e7 | Live |
| S2 | /signup | Text block 368b8b38 | Live |
| P1 | /share-photos | Paragraph c09ceb51 (members only) | Live |
| P2 | /share-photos, /submit | Placeholder text in the contributor fields | /share-photos live and clean; /submit staged |
| G1 | /gallery | Paragraph f2cbcc75 | Live |
| T1 | /travelers | Embed e467ec5e | Live |
| E1 | /for-expats | Paragraph b4ed83d5 | Live |
| E2 | /for-expats | Paragraph 9fb9e2b5 | Live |
| U1 | /submit and story pages | Site code, tll-story-is-v1 (five files) | Live (members only) |
| Q1 | /faq | Visible answer 3c2a38a0 and the page's FAQ schema | Live |
| C1 | /contact | Eyebrow ...8726 | Live |
| C2 | /contact | Paragraph ...8770 ("Reads every story before it publishes." kept) | Live |
| R1 | /editorial-charter | Heading ...d80a | Live |
| R2 | /editorial-charter | Paragraph ...d814 | Live as you wrote it; three sentences about AI added after it in staging by the trust session |
| X1 | /for-press | Paragraph ...611e ("Press travelers welcome." kept) | Live |
| X2 | /for-press | Paragraph ...612f | Live as you wrote it; staged version now adds "within 48 hours" (trust session) |
| X3 | /for-press | Paragraph e3528c03 (first sentence kept) | Live |
| CG1 | /community-guidelines | Text block ...11bc | Live |

## Every file changed in the repo

- src/design/magazine-2026-10/cover-build/build-cover.py and cover.template.html, tll-mag-cover-v1.html (H1)
- src/site-layers/tll-home-value-v1.js (H3)
- src/site-layers/tll-masthead-v1.js (F1)
- src/site-layers/tll-story-is-v1.js (U1)
- src/site-layers/tll-site-layers-v16.js and the generated chunk files (rebuilt)
- src/pages/home/live-2026-11-11/embeds/ (after copies of the four home embeds)
- handoff/WEBFLOW-LOCK.md (every Webflow write)

No translated versions of these lines exist, so nothing was added to the translation queue.

## Layout check at 390 and 1440

Nothing overflows, nothing is clipped and no page scrolls sideways. Eight single-word last lines that the old copy had are gone. Two new ones appeared:

- CG1 at 390: "Name the place and the / date."
- U1 at 1440: "... press kits get sent / back." (members only)

Outside the two widths you asked for, H5 leaves "you." alone on some tablet widths, H6 ends on "the queue." at desktop, and T1 leaves "TONIGHT" alone at 768. Each has a one-line style fix that changes no words. None is applied; say the word and they go in.

## Do-not-change list

All six read on the live page exactly as you quoted them at the 14:06 publish. Two notes:

- Review timing: the trust and conversion session has since staged "within 48 hours" wording on /faq and the charter's rule III heading. That is its approved work, not this pass.
- Magnus: the home embeds that print his number were re-coded by the launch blockers session. The value did not change.

## Lines that still carry the old patterns (not in your 25, left alone)

- Home, beside "Build your free map": "Free, forever" (embed 405baa84).
- Home Open Graph and Twitter description: "Free to join, no card, no paywall."
- /submit descriptions: "Free, forever." and the help text "Every byline is a real person, whatever the credit mode."
- /editorial-charter description: "no chatbot drafts".
- Member invite lines in site code: "Free, no card: ".
- Footer fallback text (footer component, shown only if site code fails): "Every byline a real person."

## Wording flags, your call

- H6 uses "queue". US English would say "line".
- X1 now says "welcome" twice in two sentences because the first sentence was kept.
- X3's new second sentence repeats the meaning of the kept first sentence.
