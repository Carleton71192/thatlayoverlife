# Work Session Summary
Date: 19 to 20 October 2026
Duration: one long session (about 90 messages, two days)
Projects covered: That Layover Life (Webflow site 69d6145cf421c777840c1e25)

---

## What We Built
Profiles v2 data layer: the Contributors collection carries the new fields (visibility, share ranges, map snapshot, crew, badge label, four link fields, links shown, credit mode, contact mode, pen name, one-line, flags, languages), with Nancy, Jay and Magnus backfilled and the two original-site contributors (Barzy Adam, Chesney Lish) published with their stories. A Cloudflare Worker (worker/) with tested routes for Editor's notes, publish, photo validation, places and me. The /submit v2 front end (markup, style, hosted script) ready to place on the page. The story Article JSON-LD moved to the template head where CMS tokens resolve. Packet A (prototype 3.3 global changes) half built as unpublished edits: nav, site code floor and widget, sitemap, /creators out of draft; footer and story template links in progress when the container restarted and were relaunched.

## Files Created or Updated
| File | Description | Location |
|---|---|---|
| handoff/STATUS.md | Running log, rows S75 to S90 | repo |
| handoff/CHANGE-LOG-PHASE-A-2026-10-19.md | Phase A log (newsletter, widget, floors, images, copy, /creators) plus audit addendum A7 | repo, awaiting approval |
| handoff/CHANGE-LOG-SUBMIT-2026-10-19.md | /submit writer-led flow log, approved | repo |
| handoff/CHANGE-LOG-PACKET-A-2026-10-19.md | Packet A log, approved 19 Oct ("Keep going, approved") | repo |
| handoff/claude-design-source/from-cd-2026-10-19-pm/ | README-UPDATE, STANDING-RULINGS, HOME-3.3-HANDOFF, SKILL-tll-morning-review from the 3.3 packet | repo |
| handoff/packet-a/floor-measure-390.json, prototype-home-copy.txt | 390px measurement; home chapter copy from the 3.3 prototype for Packet B | repo |
| handoff/submit-v2/current-page-map.md | Map of the current /submit page (79 inputs, embeds, gate) | repo |
| worker/ (wrangler.toml, src/index.js, src/validate.js, test/validate.test.js, README.md) | Cloudflare Worker, 19 tests passing | repo |
| src/pages/submit/v2/submit-v2.html, .css, .js | /submit v2 front end, not yet placed on the page | repo |
| src/pages/stories-template/head-2026-10-19-*.html, schema-setting-*.json, body-map-*.md | Story template head with Article JSON-LD (live draft), old schema setting saved | repo |
| src/site/tll-floor-v1.html, tll-note-v1.html, site-head/footer-2026-10-19-*.html | Floor stylesheet plus safety script, Tell the editor widget code, verified site code snapshots | repo |
| src/components/footer/*, src/pages/stories-template/links-2026-10-19.md | Written by the relaunched helpers when they finish | repo |

## Decisions Made
1. Publish as you go (19 Oct) applies to the profile build; the Phase A log and later packets wait for approval.
2. Barzy Adam and Chesney Lish are published as profiles and their stories are live as they are, without hero photos; the Stories hero image field is optional for legacy pieces only.
3. Contributors photo, bio, country count and location are optional so a sign-up profile can exist with a name only.
4. One links-shown list replaces ten show switches (60-field cap).
5. Stories: ten empty AI and counter fields deleted; eight fields added (editor-notes-log, city, who-it-s-for, sponsor-name-2, sponsor-url, charter-agreed-at, syndication, photo-originals).
6. Claude Sonnet 5.5 for Editor's notes, verbatim system prompt, server diff check, 20 calls per member per hour.
7. Packet A approved as logged: nav Stories, Travelers, The Map, Expats, Paw Passport, About; footer four columns from the prototype arrays; 12px and 44px floors; Tell the editor as a Webflow form; /destinations 301 to /stories; the footer drops the socials, newsletter and guide links.
8. Nav keeps Log in and Sign up in the bar (default, not struck).
9. Visits item out of the sitemap; marathon diaries unchanged.
10. Reminder set and delivered 20 Oct 08:00 Copenhagen: Nancy to share post dates.

## Context Established
- Webflow MCP session ses_3KuaadAxRkahnziGeQ74DQJWOC9, agent id opus-5.5|claude-code|q7m2rx (new chat: start a new session).
- Nav component 8484ce87-193e-8ab5-fff8-590bb198f8a8; footer component 710ff458-c06e-d602-a663-e5e88ca1456b; counts embed 22cd9a12-d8a7-92f8-1728-3266cfaff924.
- Pages: /submit 6a0d5e5eb7804d3a750dc266, /creators 6abd0c6f30f767558eb3782b (now not draft), Stories Template 6a0b29eedc14f1444e935766, Visits Template 6a0cbca9d776c205f45f5355.
- Contributors 6a0b29c7a7b1840afe9390a5 (50 custom fields), Stories 6a0b29eddc14f1444e935760 (58, plus Countries if the helper created it), Countries hub 6a8afbd98e907b41c4da109b, Places Been 6a0b29c702602326705dcfb1, Pets 6a0be8194ccc05a63fbdcfa3, Themes 6a0c7e883607a3b091e1ae20, Pillars 6a0b29c6d081332e921900ff.
- This cloud container cannot reach the live site, api.cloudflare.com, archive.org or the Cloudinary CDN. Allowed domains must be added in the environment settings, or the deploy runs from Nancy's computer.
- Secrets Nancy pasted in chat (Cloudflare token and account id, Cloudinary API key) were kept only in this container's scratchpad and are not in the repo. A new chat does not have them. The Worker still needs: Memberstack secret key (sk_), a Webflow API token with CMS read and write, an Anthropic API key. Best path: Nancy runs `wrangler secret put` herself per worker/README.md.
- Nancy's Instagram and YouTube URLs and public email are not set on her profile.
- Copy rules: US English, no em dashes, no exclamation marks, never filed, ship, ledger, the shelf, counted by hand, No filler, Truth over polish, real names, Currently in. Counts bind to tllStates. Never touch data-ms-* elements. Nav and footer edits approved 19 Oct.

## Tasks Completed
- Profile fields, backfill, two contributors and two stories published; Chesney's headshot set.
- Worker written and tested; /submit v2 front end written.
- Story Article JSON-LD in head code (unpublished), schema setting cleared.
- Packet A: nav links changed; site head floor block and site footer widget code written and verified; old fbk script removed from the site; Visits item out of sitemap; /creators out of draft.
- Change logs: Phase A (with addendum), /submit, Packet A.

## Open Items (Not Yet Resolved)
- Packet A: footer rebuild and Tell the editor form (helper relaunched); story template byline binding, Countries field, backfill and From line (helper relaunched); verification; publish to both domains and the subdomain; Nancy's clicks for the 301s (/destinations to /stories, /for-affiliates to /creators, /share, /gallery, /pets).
- /account numbers bounce on load (89 to 90, and WRITTEN shows 50): several scripts write the same cards from different sources (CMS count, tllStates, the site-wide story total). Fix is packet 2.8, one count function per COUNT-RULES.md, with the timestamp moved to after a successful save.
- /submit v2: place the embeds and hosted script on the page, remove the old form and the sign-in wall, set data-worker to the Worker URL, then the test report (sample draft, byte-identical proof, rejected edit, photo before and after, Rich Results Test).
- Worker deploy and secrets; privacy and charter copy lines awaiting Nancy's wording approval.
- Phase A log lines (newsletter capture with Mailchimp, images, copy contradictions, A7 schema and sitemap items) awaiting Nancy's line-by-line approval.
- Packets B (home, seven chapters), C (profiles, travelers, edit profile), D (/submit v4 test report), E (morning review), one change log each.
- Barzy's and Chesney's hero photos; Nancy's links; DTCarl05 duplicate draft to delete; Jay as co-traveler on four stories if he agrees.

## Next Session — Start Here
Read handoff/STATUS.md rows S86 to S90 and handoff/CHANGE-LOG-PACKET-A-2026-10-19.md. Check src/components/footer/after-2026-10-19.md and src/pages/stories-template/links-2026-10-19.md for what the relaunched helpers finished; verify in Webflow (footer columns, the #tll-note form, the author link binding, the st3-from line). Finish anything missing, take 1440 and 390 screenshots against the 3.3 prototype frames, then publish to both custom domains ["6a0de97be677e4daf81431cc","6a0de979e677e4daf8143190"] plus the Webflow subdomain, and log S91. Then write the Packet B change log from handoff/packet-a/prototype-home-copy.txt and HOME-3.3-HANDOFF.md and stop for approval.
