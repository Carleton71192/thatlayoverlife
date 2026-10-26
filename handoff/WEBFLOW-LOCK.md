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
