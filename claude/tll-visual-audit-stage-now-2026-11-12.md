# Visual design audit: what is being fixed without asking, and what waits for Nancy

12 November 2026. Source: Nancy's audit (claude/tll-visual-design-audit-2026-11-11.md), the fix list built from it (claude/tll-visual-audit-fix-list-2026-11-11.md) and its independent check (claude/tll-visual-audit-fix-list-check-2026-11-11.md).

## Staged on 12 November (plain repairs, no words changed)

Site layers 16.60.0 (pin c775271d, built from e887f7d):
- Home hero text and the "Why That Layover Life" section sit on the same left edge as every other section.
- The cover stamp sits where the code always meant it to (72px from the right, 32px down on desktop).
- Two hero button hover colors and three near-duplicate grays use the kit values.
- Story pages: list items take the paragraph color; the stray dot after the eyebrow is gone; nine small labels rise to the 12px floor.
- The keyboard skip link takes the kit button shape.

Home embeds:
- Paw Passport headline: no underline under "whatever the species."
- Library cards: the "min read" line sits on one baseline across the six cards. The fix list's rule would have shown all 56 cards; the check caught it and the corrected selector `.h3-track .h3-card:not([hidden])` is what was staged.
- Filter chip weight 700 to 600 (the loaded weight; no visible change).

## Not applied

- S13 (smaller gap under the library on phones): it now sits right above the rebuilt Layover guides row, so it is a spacing choice. Folded into Nancy's questions.
- S15 to S17 (one warm gray on dark in three more embeds): invisible to the eye; done the next time those embeds are opened.

## Waiting for Nancy

Eleven choices with before and after pictures: https://claude.ai/artifact/DSHBV6EnyfzhhYqRxdEwHy
