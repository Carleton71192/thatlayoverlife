# Sweep Nov 21, 2026, lens UX: the main journeys at 390 and 1440

Read only. No Webflow, Memberstack, Cloudinary or Worker writes; no form sent; every non-GET aborted or answered inside the page.
Live state: core 16.68.0 (layers-release pin 0f04fabf), www as served on Nov 21, 2026 (the same plain-GET cache as the debug lens).
No member data in this file or the evidence: profile slugs are masked as /contributors/<profile>, card names left out.

## How

- Harness: the debug lens harness (debug/bin/d.cjs, copied as h.cjs with its output folder moved), so documents come from the
  GET cache and every Webflow CSS, JS, font and image from the shared asset cache. Webflow-host bytes fetched by this lens: 0
  (all cached). One browser at a time.
- ux/bin/ux.cjs: 17 pages at 390 and 1440 signed out, 5 member pages at both widths with the signed-in Memberstack stand-in
  (no name, a made-up address): tap targets under 44 px, the first 30 (390) or 40 (1440) Tab stops with focus visibility and
  on-screen checks, form fields and their accessible names, screenshots.
- ux/bin/sub.cjs: /submit signed in at both widths: text styles and contrast of everything in the form, the Write or Link fork,
  the three steps, Next with empty fields, typing then reload after 5 s and after 21.5 s, the send.
- ux/bin/jour.cjs: home (first screen, home search), /stories (search by place and theme, chips, no results), two stories
  (what follows the story, Save for later), /signup and /login, the 404 page, /for-expats, /the-map, /share-photos and /my-pets
  (signed out and in, empty send), /account signed in.
- ux/bin/cb.cjs: tap the sentence next to each consent checkbox and read whether it ticks, plus Chromium's accessible name.
- Lab limits: Webflow keeps every send button disabled until Cloudflare Turnstile answers, and the harness aborts Turnstile's
  POSTs, so no send reached a done or fail box in this pass (the stubbed sends in reports/evidence/submit-save-2026-11-17 and
  the 16.68.0 check cover that). Memberstack is a stand-in: login redirects, Save for later and the login modal were read from
  code, not run.
- Earlier reports checked so fixed items are not repeated: reports/ux-review/2026-10-08 (H5 home search now lands on
  /stories?q=, fixed; C2 Newsletter card is now debug D3), reports/mobile-2026-10, handoff/UX-FIXES-2026-10-28.md.

## The contributor's Nov 17 note on /submit ("the black text was not the best")

What the black text is, measured in the browser (390 and 1440 agree; ux/ux-evidence.json submit_390.styles):

| Text | Face as rendered | Size, weight | Color on background | Ratio |
|---|---|---|---|---|
| Field labels (COUNTRY, HEADLINE) `.tll-pen-label` | IBM Plex Sans Condensed (the page aliases "DM Sans" to it) | 12.5 px, 600, all caps, 1 px tracking | #0D0F1A on #FEFCFA | 18.65:1 |
| What you type, `.tll-pen-input` and the Body textarea | IBM Plex Sans Condensed | 16 px, 400, line height 1.45 | #0A0B14 on #FDF9F3 | about 18.6:1 |
| "What a story looks like here" list | IBM Plex Sans Condensed | 15 px, 400 and 700 | #0A0B14 on white | 19.61:1 |
| Help under fields `.tll-pen-helptext` | Plex Sans Condensed italic | 13.1 px, 300 | ink at 50% on #FEFCFA | 3.54:1 (fails AA) |
| Help under each card title `.tll-pen-help` | Plex Sans Condensed | 15.2 px, 300 | ink at 60% | 4.96:1 |
| Card titles (SET THE SCENE) `.tll-pen-legend` | Plex Sans Condensed | 13.6 px, 600, caps | #F0507A on #FEFCFA | 3.35:1 (fails AA) |
| Placeholders | Plex Sans Condensed | 16 px | #8B857C on #FDF9F3 | 3.49:1 |

Reading: the black text has plenty of contrast, so contrast is not the problem with it. What a writer reads most on this page is
their own words in the Body box and the field labels, and both are set in a condensed face (the Webflow classes ask for DM Sans,
and the page's @font-face aliases DM Sans to IBM Plex Sans Condensed), the labels at 12.5 px in spaced capitals. Next to them
the grey help lines are light weight, italic and below AA. Size and face are the likely issue, plus the weak grey beside the
black. We could not ask the contributor which text they meant; a one-line question to them would settle it (decision for Nancy).

## Findings

Severity: high = broken or blocks a user; medium = confusing or noticeably off; low = polish.

1. **U1 (new): tapping the sentence next to a consent checkbox does not tick it; the box alone is a 20 x 24 px target.**
   /for-expats (2 required: age-and-terms, runs-group-and-open), /share-photos (the long explanation under each of the 3 required
   promises, and the 3 optional placement boxes), /my-pets (EU pet passport), 390 and 1440. Browser: tapping the text left
   all 9 unticked (ux-evidence.json checkboxes_390). Markup: `<label for="" ...><label class="w-checkbox"><input ...></label>
   sentence</label>`; an empty `for` points at nothing and nested labels are invalid, so only the box works and the accessible
   name is empty ("- checkbox") on /for-expats, /my-pets and the /share-photos placement boxes. /signup has the same markup on
   its two required boxes (terms, 16 or older; static HTML, the browser check timed out there). Severity high on /signup and
   /for-expats (required to send, phones), medium elsewhere. Fix lives in the Designer (proposal: set each outer label's `for`
   to its checkbox's own id, or put the sentence inside the inner label; ids are unique per form). A core-layer stopgap is
   possible on the non-Memberstack forms (a click on the sentence ticks the box, aria-labelledby on the sentence); /signup is a
   Memberstack form, so decision for Nancy.
2. **U2 (new): form fields have no programmatic label; screen readers and voice control get the placeholder.** /submit (step 1
   country, city, when, headline, excerpt, body: label `for=""`), /signup and /login (the first-name field's only name is a
   sample first name; email "your@inbox.com"), /share-photos (country, caption, name, email, Instagram, 3 credit radios),
   /my-pets (all 12 fields). Placeholders on /submit also read like filled answers (country "Bulgaria · Deutschland · your way of
   saying it", headline a sample title cut at the edge) at 3.49:1. Severity medium. Fix lives in the Designer (Label settings
   "For" to each input's id; the debug lens D8 lists the duplicate ids that make this impossible today). Proposal only, field
   names untouched.
3. **U3 (new): /submit loses everything typed in the last 20 s.** 390 and 1440, signed in. Typed country, headline, excerpt and
   body, reloaded after 5 s: all four empty, `tllStoryDraft` not yet in localStorage; after 21.5 s the same reload restores them
   ("Draft restored from your last visit"). No save on input, on leaving the page or on tab hide, and no leave warning. On a
   phone, switching to Photos to pick the hero can discard the tab. Severity medium. Fix lives in /submit page code
   (tll-form-steps-js-v2 in the footer): call the existing autosave() 1 s after the last input event and on `pagehide` and
   `visibilitychange` to hidden, keeping the 20 s timer for the account copy. KNOWN neighbor, not the same: RELEASE-16.68.0 known
   notes ("A blank visit after a send can lead to Draft restored").
4. **U4 (new): /submit form type, the "black text" note.** See the table above. Severity medium (two text styles fail AA,
   the rest is hard to read rather than low contrast). Fix lives in /submit page head CSS (the same classes run on /my-pets and
   /share-photos, so a core-layer rule reaches all three): `.tll-pen-helptext` ink at 72% (7.7:1), weight 400, not italic;
   `.tll-pen-help` weight 400; `.tll-pen-legend` #C8325B (5.05:1); `.tll-pen-label` 13.5 px with .04em tracking; inputs and
   the Body textarea in a non-condensed face at 17 px with line height 1.6. Which face is a brand decision for Nancy.
5. **U5 (new): /stories has no way to browse by theme.** Both widths. The chips are places and Layover guides only (All
   places, Africa, Americas, Asia, Europe, Middle East, Oceania, Layover guides) while home offers theme chips (Travel
   Logistics, Cultural Intelligence, Stories From the Road) that never reach /stories. Typing a theme works only as text:
   ?q=Travel Logistics finds 2 cards, ?q=food 22, ?q=dog 7. A chosen chip does not change the URL, so back, reload or a shared
   link lose it. Severity medium. Fix lives in the core layer (stories chunk): a theme chip row read from the cards' theme data,
   and chips written to `?place=` and `?theme=`. Theme list is a decision for Nancy.
6. **U6 (new): the /stories no-results note uses the banned verb (f-i-l-e-d) and says "Yours could be the first" above 57
   stories.** /stories?q=zzqx, both widths. src/site-layers/tll-story-is-v1.js:25 (built into chunks/stories.js:128) rewrites the
   earlier note, and in doing so drops its "Share your story" link; the file's own comment says it was meant to replace that
   wording. Severity medium. Fix lives in the core layer: for example "No story matches “zzqx” yet, so here are all 57." with
   the count from the cards, plus the Share your story link. Copy is a decision for Nancy.
7. **U7 (new): /the-map at 390 sends keyboard focus into the closed Layers drawer.** Tab stops 15 to 22 (seven layer chips
   and DONE) sit off screen at y 1495 to 1694 while the drawer is closed (ux-evidence.json cells, the-map 390 out,
   tabOffOrHidden). Severity medium. Fix lives in the Map 2.0 page code (map-2.0/dist/tll-map-layers.js): `inert` (or
   visibility hidden) on the drawer while closed.
8. **U8 (new): /the-map Receipts card is squeezed into one column of a grid built for two (390) or four (1440).**
   `.tllm-card-grid` has 1 card: 390 columns "150px 150px" so the card is 150 of 310 px and "CONTINENTS 6 OF 7 · AFRICA, ..."
   stacks one word per line over 9 lines (ux/the-map-390-receipts.jpg); 1440 columns 4 x 288 px with three quarters empty.
   Severity medium. Fix lives in Map 2.0 CSS (page code): `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`.
9. **U9 (new): every story card byline is three Tab stops.** /stories (about 100 extra stops for 57 cards), home and story
   pages. The registered site script tllauthorlinkv1-1.0.0.js (Sep 28) makes `div.tll-lib-byline` a role=link with
   aria-label "Open the profile of <name and place text>", and core tll-byline-links-v1.js makes the name inside it a second
   role=link, all inside the card link. Its slug also skips the accent folding the core layer does. Severity medium.
   Fix lives in the core layer (tll-byline-links-v1: drop role, tabindex and aria-label from `.tll-lib-byline` once the name is
   wired) or the Webflow site scripts (remove tllauthorlinkv1 after a check of the story page author block it also wires);
   decision for Nancy on the second.
10. **U10 (new): footer column headings are dead buttons on desktop.** Every page at 1440: READ, CONTRIBUTE, TLL, LEGAL are
    role=button, tabindex 0, aria-expanded=false, and do nothing above 767 px (4 dead Tab stops announced as collapsed buttons).
    Severity low. Fix lives in the footer component embed (src/components/footer/tll-foot-v1.html): set the three attributes
    only while the phone media query matches. Proposal only (footer component).
11. **U11 (new): /account signed in shows two navigation systems and the profile checklist three times.** Both widths. The
    member bar (OVERVIEW, PROFILE, MAP, PETS, CONTRIBUTIONS, SETTINGS) sits above a side menu with other names (Overview, Map
    and lists, Stories, Pets, Share card, Privacy and data, Login and email). Profile progress shows as the hero bar "PROFILE 0
    OF 8 DONE", the card "YOUR PROFILE · BLACK AND WHITE · 0 OF 8 · Continue", and the "Finish your profile" list with eight
    ADD links (five go to the same /edit-profile#ep-who). "Download everything" sits above the overview for an empty account.
    Severity medium. Fix lives in /account page code; which menu stays is a decision for Nancy.
12. **U12 (new): after Log in from a sign-in gate, the member does not come back.** /submit, /my-pets and /share-photos gates
    link plain /login and /signup; site code sends a signed-in visit to /login on to /account once per session
    (`tllRedir`), and Memberstack's own redirect was not checked (stand-in). The three gates also use three layouts (centered
    with a large empty band on /submit, centered on /my-pets, left aligned with three steps on /share-photos), and only
    /share-photos says what comes next. Severity medium. Fix lives in page code: the gate buttons store the page in
    sessionStorage and /account shows one "Back to your story" link (no data-ms-* element touched); the Memberstack redirect
    setting is a decision for Nancy.
13. **U13 (new): the end of a story page is a long run of asks.** Lisbon and Vietnam, both widths: after the signature come
    share, reader notes, Write for TLL, the photos, Been here and Want to go, the Receipts, "Have a layover story like this?",
    the writer card, Keep reading, a Tell the editor card and the home screen card. Share your story is asked 3 times, Tell the
    editor twice plus the pill, and the photos come after the reader notes. Keep reading lists only the same writer (Lisbon: 1
    card). Severity medium (design). Fix lives in page code (story template); order and cuts are a decision for Nancy. Story
    text untouched.
14. **U14 (new): the Tell the editor pill covers content.** 390: the 44 px circle sits over the first words of lines at
    bottom left (profile bio, /submit card titles, the /signup "Show password" button). 1440: the 137 x 44 px pill covers a
    side menu item on /account. Severity low. Fix lives in the core layer: hide it while a form field has focus and on /account
    move it right.
15. **U15 (new): /submit step bar.** At 390 the three step segments are 44 px tall blank blocks (the touch-target floor
    inflates them); at 1440 they are 240 x 4 px click targets. Severity low. Fix lives in /submit page head CSS: a 6 px visible
    bar inside a 44 px transparent hit area.
16. **U16 (new): profile eyebrow prints the URL slug, also for pen-name members.** "TRAVELER · <slug>" from
    src/site-layers/tll-early-state-v1.js:218 (mirroring the pf5 page code), while the h1 already uses the pen name. Severity
    medium (privacy for pen names). KNOWN: handoff/NANCY-WHEN-HOME.md "Pen-name profiles: rule for title, h1 and URL"; add the
    eyebrow to that decision. Smallest fix: "TRAVELER" alone.
17. **U17 (new): tap targets under 44 px (not inline text links).** 390: nav "Share your story" 120 x 40, "Log in" 40 x 44,
    map zoom 28 x 44, /for-expats country finder 32 tall, /share-photos promise rows 20 tall, /account "Add photo" 36 x 44,
    /travelers Instagram chips 32 tall. 1440: story "Save for later" 86 x 26, map chips and LAYERS 32 tall. No page scrolls
    sideways at 390. Severity low. Core layer (tap floor rule) for the site items; Map 2.0 CSS for the map.
18. **U18 (new): small copy and empty states.** /my-pets with no pet says "Traveling with 0 besties." then "Register another
    pet"; its bio placeholder carries a word from the banned list; the 404 button "Back to the gate" does not say it means
    home and the page has no search; the signed-out /submit gate says "Sign in" above a "Log in" button. Severity low. Page
    code or Designer; copy is Nancy's.
19. **U19 (KNOWN): /for-expats experts list empty, "No expert in Denmark yet".** Seen again in the finder run. KNOWN: debug D1,
    NANCY-WHEN-HOME "Codebase refactor branch" (R1).
20. **U20 (KNOWN): /account Newsletter card leads to the home page.** KNOWN: debug D3.

## Checked and fine

- First visit: home's first screen at 390 offers Read the cover story and Join free plus the nav; home search lands on
  /stories?q= (Oct H5 fixed). Search by place works (?q=Lisbon 2, ?q=Portugal 3), chips filter (Asia 11, Antarctica 1).
- Skip to content is the first Tab stop on every page; every Tab stop checked had a visible focus style; no keyboard trap.
- /submit steps: Next with empty fields stops on the first empty field with the browser message (Country, then Region);
  required fields are 9, matching the "9 required fields" line; the fork shows Write it here selected.
- Story page Save for later is 44 px tall at 390.
- 0 page errors in all runs.

## Evidence

- ux/ux-evidence.json: per page and width tap targets, Tab stops off screen, /submit styles and journey, /stories searches,
  /the-map grid and drawer, checkbox taps, /account menus and links, auth and form fields (names masked).
- ux/submit-390-step1.jpg (the form type at 390), ux/the-map-390-receipts.jpg (U8).
- ux/bin/: ux.cjs, sub.cjs, jour.cjs, cb.cjs, an.py, runq.sh. They require ./h.cjs, which is debug/bin/d.cjs with OUT set to
  the ux results folder and BUDGET 40e6.
