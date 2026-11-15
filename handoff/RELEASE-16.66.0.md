# Core release 16.66.0 (15 November 2026)

Replaces 16.65.0 (fix A2) on the test site. Nancy's go-ahead in chat: "Release A2" (14 Nov, test site first; www and the apex only after the independent checks and her yes), then "Keep going" once she was told the follow-up fix would go to the test site and come back for her yes before www.

## Why
The three checks of 16.65.0 (reports/evidence/release-16.65.0-check/) found one regression: the Balkans story at 320 to 375 px jumped about 0.15 (www 0.02), because the flag script widens the breadcrumb after the first paint. A3 fixed that but failed its measurement check (reports/evidence/story-a3-judge/). A4 and its repair round A4R passed both independent checks (reports/evidence/story-a4r-judge/measure/ PASS, adversarial/ PASS WITH NOTES, nothing blocking).

## Built and on jsDelivr (done)
- Source: claude/new-session-zxm063 at 0c3745c (merge of claude/fix-story-first-frame-a4-2026-11-14, 413139c). 601 tests pass; a rebuild changes no bytes; the built core equals the judged core byte for byte.
- layers-release pin: 3df16988ac1674485a2fe44d24f3763073d0c98d (parent 0daa78b4; only the core changed)
- Core SRI: sha384-trfI5wInWYlCUfz0XKnR/BqQpouu3JHGMLplaS1AFlYR8UiNBqoOU/6oYwcAJYTl
- jsDelivr: core, 24 chunks and the search index match the pin byte for byte (26 of 26).
- Contents (story layer only, only on /stories/<slug>): a flag stand-in in front of the country crumb sized like the real flags, the crumb given its link box until the template script runs, the template's place-and-date words written at once (no one-line clamp), a static country-name table instead of building one before the first paint, the route strip and story body held still until the Receipts line is in, a fallback when the flag or template script fails, and a scroll nudge so a reload ends where it started. Evidence: reports/evidence/story-first-frame-2026-11-14/fix-a3.md, fix-a4.md, fix-a4-cells.md.

## Lab results (A4R judge, one browser at a time; CLS median, A2 in brackets)
- Balkans 320 to 375: 0.002 to 0.021 (0.134 to 0.153)
- Croatia 390: 0.004 (0.068)
- Southern Africa 344 to 412: 0.004 to 0.007 (0.051 to 0.073)
- Median phone-width cell: 0.004 (A2 0.015, www 0.066)
- 0 of 405 loads over 0.1; every unthrottled finished page equals www box for box; slow 4G FCP +10 ms against A2.

## Known notes (not blocking)
- If the flag script fails, the crumb keeps an empty hidden box. Browsers whose country names differ from Chromium's (Hong Kong, Macao, Palestinian Territories, Falkland Islands) would keep one too; no saved story uses these places.
- A throw inside the template's place step, or the template script missing, still costs about 0.14 to 0.16 on Southern Africa 390.
- US state flags added at 1.4 s by tll-story-fixes-1029 are not reserved (same as A2).
- The story body shows a little later on slow connections while the Receipts line is held; FCP and LCP do not change.
- Tested in headless Chromium only.

## Webflow half
1. Lock check, scope line in WEBFLOW-LOCK.md (done, 37e94d8).
2. Registered tllsitelayersv16 16.66.0 at the pin above at 20:17:51 UTC; applied at site level in place of 16.65.0 at 20:18:00 UTC with every other script, location and order unchanged; read back (src/site/live-2026-11-15/r1666/site-scripts.after.json).
3. Published the test site only at 20:18:14 UTC (publishTaskId 10917ba1-189e-4a52-88ed-4e07418ee70b); www and apex untouched. Independent checks under the bandwidth rule, 15 Nov 20:23 to 22:28 UTC: carry PASS (3b1654d), behavior PASS WITH NOTES (4096c17), regression PASS WITH NOTES (df20d9a). Nothing blocking. Evidence: reports/evidence/release-16.66.0-check/. Phone-width story CLS median 0.0043 on test against 0.066 on www; 0 of 140 phone loads over 0.1 on test (www 51). Balkans 320 to 344: 0.002 to 0.004 (www 0.127). Notes: Balkans 375 is 0.021 against www 0.016; slow 4G first paint about 100 ms later; reload LCP about 50 ms later; if the flag script fails, Balkans at 360 keeps an empty 137 px crumb box (29 px lower page, no movement); Chromium only.
4. Waiting for Nancy's yes in chat before www and the apex.
4. www and the apex only after Nancy's yes in chat.

## Rollback
- To A2: 16.65.0, pin 0daa78b4cdbd8cda2fccd488a6e35b78c0652e3e, sha384-lCTj52h4CPjzkOy2Ls4A5XdnVYwEqHFIXJYewsQbjZB2jarPkrzxWG+vqRINw9l8 (still registered): set_site_scripts from src/site/live-2026-11-15/r1666/site-scripts.before.json.
- To what www runs: 16.64.0, pin 6ec769bb8fa05d21a459b6d106652854754c4c37, sha384-m7ORNXLxTadunuYNZM0nrBKIxd+Elr5YS7LL+uIj29kh3sEjfUdQgEhayOdjrEvr (still registered): src/site/live-2026-11-14/r1665/site-scripts.before.json.
