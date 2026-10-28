# Profile template (Contributors Template), 28 October 2026 (N3, N7, N9)

Page 6a0b29c8a7b1840afe9390ab. Change log: handoff/CHANGE-LOG-EDIT-PROFILE-NOTES-2026-10-28.md.

- root-attributes-before.json and root-attributes-after.json: the bound attributes on the hidden data root 089aa914-611c-9a84-8a04-aa31f2585b92. Added: data-from-place (From place, 20c99a4b446cbb84ffbdbc3f92c26db1), data-makes (Makes, 5734a59d7bf62db91aae776c475c6364), data-partners (Partners, 25553a3f9dde20db38725faef87ab89e). Every earlier binding read back unchanged.
- tll-pf5-n-v1.html: a new HtmlEmbed 9094ca5e-e24d-b119-efcb-692e13f3be69 placed right after the data root. It runs after the page footer script tll-pf5-profile-js-v1 (untouched) and adds "FROM AUSTIN, TEXAS" to the flags label, "MAKES PHOTOS · WORDS" while Make things is on, "OPEN TO PARTNERSHIPS", and the store and partner links with a PARTNER tag (rel sponsored) under the member's links. Served on the subdomain on 28 October and identical to this file.

Tested on a local copy of Nancy's live profile with stand-in values, with the embed both before and after the footer script.

The three fields stay empty on every profile until the Worker is redeployed: the Worker copies them from Memberstack to the Contributors item.
