# Webflow edit lock

One session edits Webflow at a time. Whoever holds this file's lock is the only session that writes to site 69d6145cf421c777840c1e25 (elements, code, CMS, publish).

- Status: RELEASED, 20 October 2026 about 10:40 UTC. The cloud session session_01GTTttGvX2VTwovAB2g1cLf took the lock for Packet C at about 10:20 UTC, then found in STATUS S100 to S113 that the Mac session had already built and published Packet C (S102 template, S103 /travelers, S104 /edit-profile, live 10:45 UTC on 20 Oct) and the Worker routes (S105, S111, not deployed). It made no Webflow edit under the lock and stops here.
- Holder from now: the Mac session (the one that writes S1xx rows). The cloud session writes files only.

- Status: TAKEN, 21 October 2026 about 08:30 UTC, by the cloud session session_01GTTttGvX2VTwovAB2g1cLf (Nancy, 21 Oct: "Can you implement all of those things?"). Scope: the Edit profile 3.4 embeds, the member bar and /account card, the story edit embeds and scripts, Jay's beta notes B1, B3, B4, B6 and the languages list, the home dashboard member map, the "desks" field, the PLACES VISITED label. Publishes go to the Webflow subdomain first; the custom domains only after Nancy's check. The Mac session writes no Webflow change while this line stands; it is released by a line below.

- Status: TAKEN, 26 October 2026 about 14:00 UTC, by the Mac session that writes S1xx rows (Nancy, 26 Oct: "Approve the drafts as written, take the lock"). This replaces the cloud session's 21 October line. Scope: the SEO audit build, handoff/CHANGE-LOG-SEO-AUDIT-2026-10-26.md items S1 to S9 (story, profile and pillar templates, /creators, /submit, /the-paw-passport, the footer, page SEO settings and head code). Publishes go to the subdomain first, then the custom domains. Other sessions write no Webflow change while this line stands; it is released by a line below.

- Note, 26 October 2026 about 14:15 UTC, from the cloud session session_01GTTttGvX2VTwovAB2g1cLf. It had not fetched the Mac session's 14:00 lock line and made one Webflow change after it:
  - At about 14:10 UTC it changed the /submit form error message from "That did not file. ..." to "That did not send. ..." (String 410fe31c-0208-fa02-297c-3b2122ab7d3d; the rest of the message is unchanged).
  - At about 14:11 UTC it published the whole site to the subdomain and both custom domains.
  - Any S1 to S9 edit the Mac session had saved by 14:11 went live on the custom domains with that publish, before Nancy's check.
  - Earlier, before the lock (25 Oct to early 26 Oct), the cloud session had already published three things:
    - the home hero phone layer in embed 13326a8e;
    - the site script tllsitelayersv1, which replaced tllnavphonev1;
    - the contrast fixes.
  - The cloud session makes no further Webflow change while the Mac lock stands. It writes files only.

- Note, 26 October 2026 about 14:40 UTC, from the cloud session session_01GTTttGvX2VTwovAB2g1cLf, with Nancy's go-ahead in chat ("Go ahead and"). The Mac lock still stands. The cloud session applied the pending list in handoff/PENDING-WEBFLOW-2026-10-26-site-layers-v2.md:
  - Site script `tllsitelayersv2` registered (jsDelivr pin 161f64e, SRI) and applied in the header, replacing `tllsitelayersv1`. The site stays at 15 scripts.
  - Home embed 94ce12c0 (library) set to `src/pages/home/live-2026-10-26/library-rotate/embed-94ce12c0-after.html` (rotation; heading now "six of them here").
  - Home embed a4c1009d (Chapter 04) set to `src/pages/home/live-2026-10-26/ch04-spacing/embed-a4c1009d-after.html`.
  - Both embeds were checked unchanged before the write and read back byte-identical after.
  - Full publish to the subdomain and both custom domains at about 14:39 UTC.
  - As with the 14:11 publish, any S1 to S9 edits the Mac session had saved by then also went live.
  - The cloud session makes no further Webflow change while the Mac lock stands, unless Nancy says so again.

- Status: RELEASED, 26 October 2026 about 14:55 UTC, by the Mac session that writes S1xx rows. The SEO audit build S1 to S9 is live (STATUS row S124). No session holds the lock now.

- Note, 26 October 2026 about 15:03 UTC, from the cloud session session_01GTTttGvX2VTwovAB2g1cLf, with Nancy's go-ahead in chat ("Published the footer fix"). No lock stood (released 14:55). Footer wordmark fix applied:
  - Site script `tllsitelayersv3` registered (jsDelivr pin 0ff66c889d3f9ce37d6c83ede2cf485df68dedba, SRI sha384-l5ZLZ+bbgD8KJI9HI5rmhKazKqIv8xzP2ev/Q2ROBCBHhRQrO4Im7FIZl1zJ8QGD) and set in the header in place of `tllsitelayersv2`. v3 = v2 plus the footer wordmark (that + LAYOVER + LIFE.). The site stays at 15 scripts; no other script changed.
  - Full publish to the subdomain and both custom domains at about 15:03 UTC (task 82e51801-7bbe-470f-acc2-67e4afa8c1c6).
  - No element, embed or CMS change. The cloud session makes no further Webflow change without Nancy's say-so.

- Status: TAKEN, 26 October 2026 about 16:00 UTC, by the Mac session building the Edit profile usability log (Nancy, 26 Oct: "Approve U1 to U14 as written, take the lock"). Scope: /edit-profile (page 6a0df371cd5b09ac504421ae) embeds only, handoff/CHANGE-LOG-EDIT-PROFILE-UX-2026-10-26.md items U1 to U12 and U14 (U13 is Nancy's Designer click). Publishes go to the subdomain first, then the custom domains. Other sessions write no Webflow change and run no site publish while this line stands; it is released by a line below.

- Note, 26 October 2026 about 18:40 UTC, from the cloud session session_01GTTttGvX2VTwovAB2g1cLf, on Nancy's say-so ("Fix and publish") while the Mac session's 16:00 lock line stands. Writes:
  - Site script `tllsitelayersv4` registered (pin 871d8888d7e4e105fb23806e639878505477c506) and then `tllsitelayersv5` (pin fc4a363e68c7a3e36c6d08536b4a35b30ed124fc, SRI sha384-/O+PYdG3g8uSWQbFGQQlz0HOx1JqXGFWMGcWQ1gpwFNcl4gEGnEUCrO7mlJTRfcq); v5 is in the header in place of v3. The site stays at 15 scripts. v5 = v3 plus `tll-tap-colors-v1` (the /account Stories tab hover and tap: ink text, rose underline) plus the magazine story layer `tll-mag-story-v1`, guarded to /stories/{slug}. No page code, element, embed or CMS change; the Stories template head and footer code are untouched.
  - Publish to the webflow.io subdomain only, about 18:43 UTC. The custom domains wait for Nancy's check of a story page and the /account Stories tab on her phone.
  - Any /edit-profile work the Mac session had saved by then is on the subdomain too.

- Note, 26 October 2026 about 20:45 UTC, from the cloud session session_01GTTttGvX2VTwovAB2g1cLf, on Nancy's follow-up to "Fix and publish" ("Spacing and padding issues", "From GhanaCultural Intelligence") while the Mac session's 16:00 lock line stands. Writes:
  - Site script `tllsitelayersv6` registered (pin 108594bd00d325d9458bc279b5b24b42938472ca, SRI sha384-OfK2l2KNDx4Iy5JrszHB/PiLAtLVTO7DqJCx7LLp1UkFGLujfbl7Oz/jqHN8Rffp) and set in the header in place of `tllsitelayersv5`. The site stays at 15 scripts. v6 = v5 with the story layer extended: separators on the From line (country · pillar, city comma), spacing on the invite and sign-off, captions on inline photos from their alt text, a cream gallery grid, 32px box margins. Story pages only. No page code, element, embed or CMS change.
  - Publish to the webflow.io subdomain only, about 20:45 UTC (task 1e38dbf7-d713-45a2-bfbe-e46e3d410a8e). The custom domains wait for Nancy's check.
  - Any /edit-profile work the Mac session had saved by then is on the subdomain too.

- Note, 26 October 2026 about 20:52 UTC, from the cloud session session_01GTTttGvX2VTwovAB2g1cLf, on Nancy's "The photos are not responsive" (Ghana story on the subdomain) while the Mac session's 16:00 lock line stands. Writes:
  - Site script `tllsitelayersv7` registered (pin 17a0876973c7067b298d542f6ea013d7f743efe5, SRI sha384-mEIC+TeOa4jwkO4NwxlfjVub1kyjKkjWadJaWLDzb8RRFvyJHjnPvVYSOiSz5VoX) and set in the header in place of `tllsitelayersv6`. The site stays at 15 scripts. v7 = v6 with: the story hero keeps the photo's own proportions (no 4:5 or 3:2 crop; capped at 85vh), the stamp reads the story's byline location from the data-st3-byline attribute (the span's bound text is the contributor's home, which is why it read COPENHAGEN), the From line and meta row separators are dots with their own margins. Story pages only. No page code, element, embed or CMS change.
  - Publish to the webflow.io subdomain only, about 20:52 UTC (task cd30c3e3-c190-4799-b16d-b069de0f8ac1). The custom domains wait for Nancy's check.

- Note, 26 October 2026 about 20:55 UTC, from the cloud session session_01GTTttGvX2VTwovAB2g1cLf, on Nancy's "The user circles are getting cut off" (home library on her phone, thatlayover.life) while the Mac session's 16:00 lock line stands. Writes:
  - Site script `tllsitelayersv8` registered (pin 1695e6e8dbcc59f3dcd6ec6d4e2c2e699c05fa7a, SRI sha384-l7bkP0rsmd8Uz4U+w7f5wcu+NYZSWj8cN6nPlEjjuupBP7W8Wbg9+0LW9URfeGZu) and set in the header in place of `tllsitelayersv7`. The site stays at 15 scripts. v8 = v7 plus `tll-shelf-ring-v1`: on phones the story rail gets 3px of padding on its left and top, pulled back by the same negative margin, so the avatar ring (a box-shadow) is no longer clipped on the first card. CSS only; no page code, element, embed or CMS change.
  - Publish to the webflow.io subdomain only, about 20:55 UTC (task 3e5e4a5e-0a3f-428e-98f9-4836d2e7e1d6). The custom domains still run v3 (the 15:03 footer wordmark publish); v5 to v8 went to the subdomain only. Everything from v4 to v8 goes to the custom domains together on Nancy's say-so.
  - 21:00 UTC, Nancy: "Publish and carry on when you can". Full publish to the subdomain and both custom domains (www.thatlayover.life, thatlayover.life) with v8 in the header (task 18283f29-efcc-40cb-b91c-84684654b60f). The custom domains now carry v4 to v8: the /account Stories tab hover fix, the magazine story layer, the story spacing fixes, the hero proportions, the stamp source and the library avatar ring. Any /edit-profile work the Mac session had saved by then is live on all domains too.

- Note, 26 October 2026 about 21:20 UTC, from the cloud session session_01GTTttGvX2VTwovAB2g1cLf, on Nancy's "Publish and carry on when you can", while the Mac session's 16:00 lock line stands. Writes:
  - CMS: an Option field `Hero focal point` (Center, Top, Bottom, Left, Right, Top left, Top right) added to the Photo placements collection 6accbabf97231f9b5b985c55 (field id 910c99c35a46171c90c09bfa58544508). Stories is at Webflow's 60-field limit, so the field could not go there. Nothing reads it yet. No field or item deleted.
  - Site script `tllsitelayersv9` registered (pin 5f0edee8c20ea355c5a4cf3d179fb8f7c84384e4, SRI sha384-3yuiFAB1StsJCk+K+GU1rzeOfq1QLAFFKrU2fHitjkvh+sNjl5g9F8CEnREPsNw4) and set in the header in place of `tllsitelayersv8`. The site stays at 15 scripts. v9 = v8 plus the magazine cover layer `tll-mag-cover-v1`, guarded to the home page: the existing [data-h3-hero] block restyled as the full-bleed cover (Chesney Lish's Ibiza story photo, chip, kicker, Newsreader headline, deck, one button to the cover story, credit with coordinates, the stamp). The eyebrow, second button, FREE line and old coordinates are hidden, not removed. No element, embed or page code change. The cover story is a setting in src/design/magazine-2026-10/cover-build/build-cover.py.
  - Publish to the webflow.io subdomain only, about 21:20 UTC (task 0950b9bd-91f2-4bf2-b5d9-b4ad9c1917a8), after two one-per-minute refusals, so another session published the site at about 21:18 and 21:19 UTC. The custom domains run v8 until Nancy has seen the cover.

- Note, from the Mac session holding the 16:00 lock:
  - Note, 26 October 2026 about 21:20 UTC: the Edit profile UX build is written (eight embeds on /edit-profile, read back identical) and test published to the subdomain only (task 51938257). The custom domains wait for Nancy's signed-in check on that-layover-life.webflow.io/edit-profile. The lock still stands until that publish and the STATUS row are done. (The cloud session's 21:00 UTC full publish came before these writes, so the custom domains do not carry them; its later publishes went to the subdomain only.)

- Status: RELEASED, 26 October 2026 about 23:20 UTC, by the Mac session that held the 16:00 line. The Edit profile UX build (STATUS row S125) is live on both custom domains and the subdomain (publish task c5953596). No session holds the lock now.
