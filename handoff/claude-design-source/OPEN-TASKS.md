# That Layover Life: what is still open (13 October 2026)

Built from handoff/STATUS.md (224 rows) and reports/fix-pass-2026-10-12/nancy-afternoon-list.md.
Every full-site publish pushes all staged edits live, so rows still marked "Staged" in STATUS from before 13 Oct are live now and only need a check.

## 0. Do first: one thing waiting in Webflow, not published
- **/share-photos simplification is staged in the Designer, unpublished.** New page footer code (styling + form script) and the text changes from the proposal you approved with "go with defaults". Tested offline; not yet reviewed by you. **Do not publish the site until you have looked at /share-photos in the Designer preview**, or tell me to revert it (the old footer code is saved in src/pages/share-photos/v3/state/page-footer.html). Log: src/pages/share-photos/v3/applied/apply-log.md.
  - Left for you in the Designer: clear the placeholder text on 6 inputs (photos, country, city, year, caption, pets). The new script hides them meanwhile.

## 1. Your decisions (each one unblocks work)
1. **Photo uploads probably never arrive.** The /share-photos form sends a plain GET, so files go nowhere. Send one test photo and tell me if it lands. Then pick the upload target: Worker to R2 (recommended), Webflow File Upload (paid form plan), or Uploadcare. EXIF stripping (option A) waits on this too.
2. **Ko-fi links:** the TLL Ko-fi page and the Paw Passport product. Unhides the buttons and /faq line B.
3. **Newsletter name:** Gate Change, Window Seat or Long Way Round.
4. **Your country count:** fix it in the map editor. Add Aruba, Botswana, Curaçao, Faroe Islands, Liechtenstein (all can now be logged). Decide Luxembourg (booked, not visited), Antarctica and New Caledonia (count or not; if yes you are at 89). Magnus: sheet 11, CMS 13, map 14. Which is right?
5. **Jaguars:** how many did you see (Pantanal story)?
6. **/submit change log** (reports/fix-pass-2026-10-12/submit-change-log.md): approve rows 1 to 9; do email sign-up inputs count toward the 7?
7. **/edit-profile proposal** (reports/page-simplify-2026-10-12/edit-profile.md): answer section 6 or say "go with defaults".
8. **Words left for you:** /terms "doesn't ship" to "doesn't run"; your bio's "Trip Ledger" (Jay's name for it) keep or change; /edit-profile "Log a place to your Trip Ledger" to "Log a place"; draft stories that say "ledger".
9. **Marathon recap and the Montenegro entry for Magnus:** you don't recognize them. Set both to draft?
10. **Seven Continents story** may show a false "Reklame" label; **/for-brands** links to charter rule 08, which is not live. Approve rule 08 or remove the link.
11. **Guides:** check each answer against its source and send the "last checked" date.
12. **Older open decisions (STATUS I03 to I14):** a real Magnus quote; AMSOC full name and link; headline country base (UN 193, 195 or 250); tier names; how old "layover" map entries migrate; Magnus Denmark and Kosovo; companion purple #7C5CBF; Layover Club price; guide PDF checked against Regulations (EU) 2026/131 and 2026/705; Magnus's real pack friends; a short GDPR review before public travel profiles.
13. **Feature calls:** Jay's map colors (S08); several flags on multi-country stories (S11); one shared Magnus across your and Jay's accounts (B44, option A recommended); travel companions (B46); "Your reading list." on /account to "Your library."?

## 2. Your clicks (a few minutes each)
- **Story template:** hosted box (tll-sponsored) > Conditional visibility > "Disclosure is set".
- **Pillars template:** collection list tllpr-stories > add filter "Pillar equals Current Pillar".
- **Hero images:** Stories and Countries templates > Image settings > Load: Eager.
- **Sitemap:** Destinations and Collections templates > Sitemap indexing off.
- **301 redirects** (Site settings > Publishing): /countries to /destinations, /share to /submit, /gallery to /the-layover-lounge; then the slug flips.
- **Sitemap and robots.txt** check (Site settings > SEO).
- **Google:** archive the duplicate GA4 property (grouped under Lub Bub); add a Search Console Domain property, verify by DNS, submit /sitemap.xml; mark the new events as key events.

## 3. Live, needs your eyes once
- /account logged in: LOGGED number, Wrapped, every tab. A sign-in on your phone.
- Story photos under the right sections: La Tomatina, Morocco, Pantanal. La Tomatina hero faces in frame.
- /destinations: Denmark, Brazil, France open their own pages; STORY FILED tiles.
- /the-map#edit: search "Aruba", stamp it, count goes up.
- New hero photos: Monkeys in Sweaters, Portland to Mayfield Heights, Obrigada F, Ninja Duckies, Cerveja Bandeira.

## 4. Built or drafted, waiting on a go
- Fix-first change log, 13 items (S15); one source for counts (S20) follows your count decision.
- Copy pass change log (S09): reports/copy-pass/2026-10-09-tll-copy-pass.md.
- Edit profile v3 skin (S16), in the repo only; superseded if you take the /edit-profile proposal.
- EXIF option A plan (S58).
- Growth build, design stage proposals: reports/growth-build/design/.

## 5. Bigger builds, not started
- Share cards and public travel pages /p/ (G01 to G16): blocked on public storage and the GDPR review.
- The Pack on the Paw Passport (H01 to H04).
- Traveler directory /expats, /creators, /press, /press-trips (C01 to C18): partly built, pages still drafts.
- Readymag-style long scroll (R01): waiting on your new design.
- Sticker Passport and Colophon pages (J16).

## 6. Prototype match check (good job for Claude Design)
STATUS rows A01 to J16 compare the live site to the 2.0 prototype: about 145 are "Partial" or "TODO". Most need a look, not a build: brand rules (A), every screen (B), directory (C), story extras (D), money pages (E), gates (F), share cards (G), pack (H), accessibility and craft (J).

**Prompt for Claude Design** (upload this file, STANDING-RULINGS.md and the v3 folder):
> Compare the live site thatlayover.life with TLL Site Prototype 3.0, screen by screen. For each screen say matched, close, or not matched, and list what differs. Use OPEN-TASKS.md section 6 and handoff/STATUS.md rows B00 to B41 as the screen list. Then turn sections 1 to 5 into a one-week action plan with my decisions first.

## Housekeeping
- STATUS still labels about 22 rows "Staged" (S01 to S59) that went live in the 12 Oct publishes. Relabel when convenient.
- A partial site export started today is in handoff/claude-design-source/webflow-export-2026-10-13 (stylesheets, components, CMS samples, one page). Stopped to save your usage; not needed for this plan.
