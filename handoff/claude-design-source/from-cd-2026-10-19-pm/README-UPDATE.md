# CLAUDE CODE · UPDATE PACKET · 19 October 2026 · Prototype 3.3

Read in this order: this file, STANDING-RULINGS (CLAUDE.md in the design project), COUNT-RULES.md, then the standalone prototype. Write the change log for Nancy before editing Webflow. Publish nothing until she approves. Nav and footer components are approved to edit (19 Oct).

## Files in this packet
- `TLL Site Prototype 3.3 (standalone).html`: the whole site, one file, opens offline. Screens: use the nav, or the SCREENS toggle at the bottom-right of the prototype, or these query strings: `?at=top|ch01…ch07|footer`, `?menu=open`, `?note=open`, `?cookies=open`, `?loggedin=1`, `?screen=submit4&stage=empty|writing|notes|preview|confirm|published`, `?screen=profile`, `?screen=travelers`, `?screen=editprofile`, `?screen=about`.
- `HOME-3.3-HANDOFF.md`: home chapters, nav, footer, widget, Submit v4, with CMS fields and the AI service spec.
- `PROFILES-HANDOFF.md` (earlier packet, still current): Profile v2, Travelers v2, Edit profile v2, COUNT-RULES binding.
- `COUNT-RULES.md`: every number on the site.
- `SKILL-tll-morning-review.md`: the post-publish review skill spec.

## Rulings that changed since the last packet (apply everywhere)
1. **Nav (approved):** Stories · Travelers · The Map · Expats · Paw Passport · About + Share your story + account. Destinations is out of the nav. "By place" is a view inside /stories. Footer keeps a Destinations link. `/destinations` 301 → `/stories#by-place`.
2. **Footer (approved):** one short band. Wordmark + four slim columns (Read / Contribute / TLL / Legal, five links each, 14px, tight leading) in one row on desktop; 44px accordions on phones with links wrapping in a row. One line below: labeled stats from tllStates (`{n} countries in our stories · {n} stories · {n} travelers · {n} pet`), email, © 2026 TLL · Copenhagen. "For affiliates" → "For creators" (/creators, 301 from /for-affiliates).
3. **Submission (approved):** no approval step, no email to Nancy. Publishes on passing the rules; `tll-morning-review` flags after. Writer-led: AI never writes headline, excerpt, pull quote or body. Editor's notes in a separate box, one at a time, Accept / Skip, logged in hidden `notes-log`. Photos adjust-only (crop, straighten, exposure, color, resize; no generative transforms), before/after with writer approval, original kept.
4. **Profiles live at sign-up**, with or without a story. Thin profiles are normal; no "nothing here yet" boxes.
5. **Type floor 12px, tap targets 44px**, everywhere. Prototype now has zero text under 12px.
6. **"Walked" ruling:** never as a counting rule. Cities = "one night, or the center at ground level"; parks = "past the gate and inside".
7. **Banned additions:** "filed", "counted by hand" (plus the existing list: em dashes, ships, ledger, the shelf, real names, No filler, Truth over polish, exclamation marks in UI copy).

## Sweep results (19 Oct, prototype 3.3) and what they mean for live
Checked: every template handler resolves; every screen flag is defined; no em dashes; no exclamation marks in copy; no banned words; every `<img>` has alt; every `role=button|link` has tabIndex; external links open a new tab; zero text under 12px. Fixed in the sweep: a dead tap on the public Paw Passport (story card now opens the Montenegro story), two unreachable screens (share card, style guide).

Live-site issues from the 19 Oct audit that the prototype answers (build these):
- Story Article JSON-LD empty and shared `@id`: bind to the item (HOME-3.3-HANDOFF, search section).
- Footer links to two 404 guides: removed from the footer design; publish or drop the pages.
- Stories link to nothing: country, pursuit and byline links are in the story template design and Profile v2.
- /submit login wall and 75 fields: Submit v4.
- /the-map "0/5", "0/11" for logged-out visitors: dashboard chapter shows Nancy's map instead; never a zero to a visitor.
- 10 to 11px text sitewide: 12px floor.
- /visits/… in the sitemap and future-dated marathon diaries: remove from sitemap; Nancy to rule on diaries.

## Build order (one Webflow change log per packet, Nancy approves each)
**Packet A · global (small):** nav, footer, 12px floor and 44px targets in the shared CSS, Tell the editor widget (Webflow form posting page URL + note + optional email to the editor inbox; hidden while the consent banner is open), Article JSON-LD fix, byline link in served HTML, country + pursuit links on the story template, remove /visits from the sitemap, /destinations and /for-affiliates 301s.

**Packet B · home (medium):** seven chapters per HOME-3.3-HANDOFF. Dashboard chapter embeds the public map with the tllStates count line; Expats chapter; Paw chapter + Ko-fi line (URL TBC, button can wait for the guide); story rail card with avatar and name, member stories interleaved; Letter + closing chapter.

**Packet C · profiles (medium):** Profile v2, Travelers v2, Edit profile v2 per PROFILES-HANDOFF. Profile publishes at Memberstack sign-up. Map embed = map only, 1140:560.

**Packet D · Submit v4 (large, change log first):** form, Cloudflare Worker for notes (key server-side, Memberstack token verified, 20/member/hour, text + country + month only, server diff check converts over-reaching edits to tips), `notes-log` hidden field, Cloudinary adjust-only transforms with original kept, draft in localStorage, join at step 3, one H1, labels on every field. Add Anthropic to /privacy processors (wording for Nancy). Add the policy line to /editorial-charter after approval.

**Packet E · review (small):** `tll-morning-review` scheduled 07:30 Copenhagen, flag-only, one message a day, severity 1 to 3 pings immediately. Nancy to rule whether it may hold a story (unpublish + writer note) or stays flag-only.

## Test report to return with each packet
- Screenshots at 1440 and 390 of every changed page, against the matching prototype frame.
- Submit v4: a sample draft with suggestions accepted and skipped; proof the text is byte-identical when nothing is accepted; proof the server rejected an over-reaching edit; before/after photo with the original still stored; Rich Results Test on one story.
- Counts: the headline number on /account, a profile and the footer all trace to the same tllStates source.

## Live /travelers contrast (fix in Packet C)
Live cards set grey meta on the dark card (about 3:1) and the filter chips at 11px. Prototype Travelers v2 is the reference: cream surface, #6B6660 meta (5.8:1), #3a3a3a body (10:1), 12px floor, 44px chips. Nancy and Jay story counts come from the Stories collection, never typed.

## Open for Nancy (do not guess)
- Ko-fi URL; whether the guide button goes live before the guide.
- Future-dated marathon diaries public or not.
- Morning review: hold rights or flag-only.
- 404 joke page ("This page missed its connection" + a random story): approved to build, copy to confirm.
