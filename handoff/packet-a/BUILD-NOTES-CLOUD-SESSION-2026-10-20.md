# Packet A build notes, 20 October 2026 (working file, Claude Code)

Webflow MCP session ses_3Kwnmbq2KBuy8jwu3YowGgTfeNg, agent fable-5.1|claude-code|tll92q. The container restarted several times; this file keeps the state.

## Verified in Webflow (20 Oct, before any new edit)
- Footer component 710ff458: four columns Read, Contribute, TLL, Legal with the approved links (Colophon left out, no page exists); wordmark + "Every byline a real person."; stats line with four typed placeholders rewritten by the counts embed 22cd9a12, now tll-live-counts-v3 (countries in our stories, stories, travelers, pet, singular and plural); hello@ mail link; copyright line. The Tell the editor form was NOT there.
- Site head code equals src/site/site-head-2026-10-19-after-2.html (floor block in). Site footer code equals src/site/site-footer-2026-10-19-after.html (tll-note-v1 css and js in, no fbk script).
- Stories collection: field `countries` (63b5604aa8c5e0293339085646fc3cb2, multi-ref to Countries hub) exists; backfilled wherever a single Country was set, except Istanbul (Türkiye).
- Stories Template: author link 09c29e7a link setting read back as {mode collectionPage, pageSlug contributors}, design-time href /contributors; the API lists no bindable link sources on it, so the Contributor binding cannot be confirmed. No From line, no /countries or /pillars links.
- The helper result files (src/components/footer/*, links-2026-10-19.md) were never written.

## Edits made 20 Oct
1. Footer: Tell the editor block inserted with data_whtml_builder, element ce0b94d4-fbb5-aa01-3e90-81a9e1e52bdc (id tll-note). To verify: Webflow form with inputs note, email, page; done and fail texts.
2. Stories Template: HtmlEmbed 2f38eca4-84ce-5ec4-cf7c-9966f8422604 (data-st3-from=v1) after the author row 4693d6d0, code with CMS tokens city, country-2:slug, country-2:name, pillar-2:slug, pillar-2:name. To verify: code stored.
3. CMS: countries filled for 10 published stories (antarctica, balkans 12 hubs, ghana-easter, istanbul, la-paz, montenegro-budva, northern-brazil, pantanal, patagonia, sort-sol); country-2 set on ghana-easter, la-paz, montenegro-budva, northern-brazil, pantanal. Aruba and Curaçao have no hub items; aruba-curacao left empty.

## Done 20 Oct 07:15 UTC: published (task 08983aa4). Remaining from the list below: screenshots (not possible from this container), S92 logged.

## Still to do (as of the publish)
- Revert author link 09c29e7a to url /contributors (known state) unless the binding can be confirmed; A6 then becomes one Designer click for Nancy.
- Snapshots (footer, author row), publish to 6a0de97be677e4daf81431cc and 6a0de979e677e4daf8143190 plus subdomain, STATUS row S92, commit, push.
- Packet B change log, then stop.

## Outcome (20 Oct, about 10:00 UTC)
This cloud session (session_01GTTttGvX2VTwovAB2g1cLf) and the handoff session on Nancy's Mac (session_01TRgXiW9sHm4kPh7GR4qgnb) worked on the same site at the same time. The Mac session is the record of truth: S92 (Packet A published 07:00 UTC), S94 (account counts), S97 (Packet B live 09:41 UTC), S99 (Packet C change log). The "cloud helper" named in S92 is this session. Its Tell the editor block and From line embed were removed by the Mac session because the embed's {{wf}} tokens did not resolve; the Mac session's own form, From line block and tll-foot-v1 embed are what is live. This session also published the site at about 07:15 UTC (task 08983aa4), between the Mac session's 07:00 and 09:10 publishes, and filled `countries` on 10 stories and `country-2` on 5 (listed above). The Packet B and C change logs this session drafted were not added to the repo; the Mac session's logs stand (CHANGE-LOG-PACKET-B-2026-10-20.md, CHANGE-LOG-PACKET-C-2026-10-20.md). Rule from this: one session edits Webflow at a time.
