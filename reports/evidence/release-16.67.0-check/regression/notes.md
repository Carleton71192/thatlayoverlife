# Release 16.67.0, regression check: real test site against real www (17 November 2026)

Status: running. Interim results; the verdict and the full notes follow when every set is done.

- Harness: harness/r.cjs (sets story, slow, signedin, fail, stq, reload, tap, consent, rm, jsoff, back, resize, w320), harness/an.py.
- Set story done (11:29 to 11:34 UTC, 66 loads): Balkans 320 to 390 and Southern Africa 360 and 390, 3 loads per host. www reads the 16.66.0 check's numbers to the fourth decimal (Balkans 320 0.0024, 344 0.0039, 360 0.0195, 375 0.0213; Southern Africa 390 0.0057). Test is equal or lower in every cell (0.0000 to 0.0173) and every test load ends with the same box list as www.
