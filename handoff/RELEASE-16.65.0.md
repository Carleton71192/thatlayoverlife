# Core release 16.65.0 (14 November 2026)

Nancy's go-ahead in chat, 14 Nov 2026: "Release A2". Test site first; www and the apex only after the independent checks and her yes in chat.

## Built and on jsDelivr (done)
- Source: claude/new-session-zxm063 at 984dd05 (merge of claude/fix-story-first-frame-a2-2026-11-14, 73ab244). 579 tests pass; a rebuild changes no bytes.
- layers-release pin: 0daa78b4cdbd8cda2fccd488a6e35b78c0652e3e
- Core SRI: sha384-lCTj52h4CPjzkOy2Ls4A5XdnVYwEqHFIXJYewsQbjZB2jarPkrzxWG+vqRINw9l8
- jsDelivr: core, 24 chunks and the search index match the pin byte for byte (26 of 26). Only the core changed against 16.64.0.
- Contents: story page first frame (fix A2). The story magazine layout applies from the first paint, the template's byline, avatar and meta-row rules are copied into an early head style that loses every tie to the template and is removed once the template style is parsed, and two short holds keep the photo still while the Receipts line and the place-and-date line settle. Evidence: reports/evidence/story-first-frame-2026-11-14/ (diagnosis.md, judge.md, fix-a2.md, judge-a2.md).

## Webflow half
1. Lock check, scope line in WEBFLOW-LOCK.md.
2. Register tllsitelayersv16 16.65.0 at the pin above with the SRI above; apply it at site level in place of 16.64.0, every other script, location and order unchanged. Read back.
3. Publish the test site only. Independent checks under the bandwidth rule.
4. www and the apex only after Nancy's yes in chat.

## Rollback
16.64.0, pin 6ec769bb8fa05d21a459b6d106652854754c4c37,
sha384-m7ORNXLxTadunuYNZM0nrBKIxd+Elr5YS7LL+uIj29kh3sEjfUdQgEhayOdjrEvr (still registered). Set the applied list back to the before copy and republish.
