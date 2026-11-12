# The Line Counter: Moving Guides, The Paperwork (Copenhagen)

A single-file prototype (`index.html`) of the first TLL moving guide. A reader says whether they are an EU/EEA or Swiss citizen, gets the Copenhagen paperwork in the right order for that passport, ticks each step off, keeps their own visa dates in a drawer that works out the next deadline, and finds the official emergency numbers next to marked spots for Location Experts to fill. Open `index.html` in a browser. `shot-390.png` and `shot-1440.png` show the page with two steps ticked and SAMPLE dates in the tracker. In the full-page shots the fixed "Visa trackers" tab and the "All prototypes" link appear part-way down, where the viewport was.

The whole guide carries "SAMPLE: facts to be verified by a Location Expert before launch" in a strip at the top.

## How the brief is met

| Brief | In the prototype |
| --- | --- |
| Timeline tracker "The Line Counter" | Section 01. A numbered vertical timeline. Each step names who, where, when and what to bring, with a dry one-line aside, its official source links and "Checked 12 November 2026". A checkbox per step ("Done. I am out of this line.") moves the "You are here" marker, the count (for example 2/6) and the bar. Counts and "lines to go" are computed from the steps on the page. |
| Step 1 CPR, Step 2 Tax card, Step 3 Residence Permit Card | All three are there, in the order the official pages give, which depends on the reader's passport (see departures). |
| Countdown/alert drawer for Visa Trackers | Section 02 on Midnight shows the next milestone as a countdown. "Open visa trackers" (and a fixed tab that always shows the next countdown) opens a drawer: a side panel at 1440, a bottom sheet at 390. The reader picks what happened (permit issued, moved in, permit expires, arrived as an EU citizen, and so on), enters the date from their letter, and gets the deadlines that follow from it, each with days left, the rule and its source. Overdue items turn rose. "Try it with SAMPLE dates" fills two labeled SAMPLE entries relative to today. |
| Renewal milestones | "My residence permit expires" gives the extension window (3 months before expiry for most permits, 4 for basic and youth study programs) and the expiry itself, with the warning that late applications are likely rejected. |
| Survival Links: spices, haircut, emergency pet care | Section 03. Filter chips (Mono, rounded, counts computed). Official cards with sources: 112, 1813 Medical Helpline, 114 police, the city's list of emergency rooms and 24-hour pharmacies. Dashed "Location Expert to add" slots: where to buy spices, where to get a haircut, emergency pet care at night, where to eat on the first night, where to run. One filled button, "Become a Location Expert", goes to /for-expats. |
| Candid, humorous, highly organized | Each step has the same fields in the same order, and the jokes stay in one italic line per step ("Fifty-five percent is a fast way to learn the word forskudsopgørelse."). |
| Sleek, premium minimalist look, custom CSS or Tailwind | Custom CSS with Brand Kit v2.4 tokens in one `:root` block. No Tailwind, since production has none and the brief allowed either. |

Checked in Chromium at 390 and 1440: no sideways scroll, no console errors, nothing under 12px. The drawer has Escape to close, a focus trap, focus returned to the button that opened it, and a sticky header so Close stays in reach. Motion is 250ms from 0.6 opacity and 8px, and is off under prefers-reduced-motion.

Second review (12 November): checked again at 390, 768 and 1440 with keyboard and pointer, and axe-core reports no violations. Fixes made in that pass: the layover guide card's title and label had picked up the gray body style; the story photo was lazy-loaded and came out blank in full-page captures; source links, the breadcrumb link and the photo credit now have 44px targets; the page notice sits in the header landmark and the "All prototypes" link in a nav; the progress bar animates with transform, not width; the Visa trackers tab uses the rose focus ring because it sits on Paper; the countdown card is on Midnight, not Midnight 2, so its teal sits on Midnight; Mono figures use positive tracking; the counter panel is sticky only at desktop width, since on a phone it covered a fifth of the screen; the hero stays one column below 1100px so the headline does not break into one word per line at tablet width; headlines are balanced so no word sits alone on the last line; two lists of three and "programmes" were rewritten; the survival links filter announces how many links it shows.

## Where I departed from the brief, and why

- **The fixed order became a switch.** The brief's order (CPR, tax card, residence permit card) is not the order anyone follows. For non-EU arrivals the residence permit comes first and the CPR number needs it; the residence card then arrives by post after both. For EU/EEA and Swiss citizens the first step is the EU residence document from SIRI, without which there is no CPR number, and there is no residence permit card at all. So the page asks "Which passport are you holding?" with "I am an EU/EEA or Swiss citizen" and "I am not", and shows six or seven steps accordingly. "Swiss" is added because the official pages group Switzerland with the EU/EEA here. Nordic citizens get one line saying the guide does not cover their route yet, since I could not confirm it.
- **Three steps became six or seven.** The yellow health card, MitID and NemKonto sit between the CPR number and the tax card on the official pages, and the tax card cannot be done online without MitID. Leaving them out would send people to Skat without a way to log in.
- **"Checked 12 November 2026", not 11 November.** The checks were done on 12 November. Writing the 11th would be a false date.
- **The visa tracker cannot alert anyone.** It is a countdown that shows when the page is open. Email reminders are shown as "Coming soon" and are not a control. The dates are kept only in the reader's browser (localStorage inside try/catch; the page works without it), and the UI says so twice.
- **The emergency pet care spot has no official link.** I found no official public page for out-of-hours vet care in Copenhagen on the official sources, so the slot says that and waits for a Location Expert. It links to the Paw Passport instead, with the live site's line "If they crossed a border with you, they get a page." No pet travel rules appear on the page.

## How the facts were checked, and the limit on that

Official sources only: lifeindenmark.borger.dk, nyidanmark.dk, skat.dk, international.kk.dk, plus politi.dk for the 114 police number. This build session could not open those sites directly (the network refused them), so every fact was taken from search results restricted to those domains, which quote the pages' own text. Each step links the page it came from. Before launch a Location Expert needs to open each link and confirm the wording, which is what the SAMPLE strip says. Points where the official pages disagreed or looked dated:

- EU residence document timing: SIRI says apply "before the three months have expired"; Lifeindenmark says "within 3 months after entering". The page uses SIRI's wording.
- Residence card delivery: an older SIRI page says 2 to 3 weeks; a newer SIRI FAQ says up to 8 weeks from registering your address. The page uses 8 weeks.
- Biometrics: normally within 14 days, but SIRI has extended this at busy times (pages say 4 weeks and 6 weeks). The page says the deadline has been extended at busy times and to check.
- Extension window: taken from several nyidanmark extension pages, which agree on 3 months for most permits. The page links one of them and tells the reader to check the page for their own permit type.

## What is real and what is SAMPLE

Real:
- Every Danish rule, deadline, address and phone number, each with its official source link (16 sources, listed at the bottom of the page).
- Lines from the live site, verbatim: "The paperwork, in the order it happens." (headline), "From someone who cried in that line.", "The dates, remembered for you.", "The city, after the boxes are unpacked.", "Where to eat, run and get a haircut.", "You translate spices in the grocery aisle.", "You have a residence card and opinions about it.", "If they crossed a border with you, they get a page.", "Become a Location Expert", "Every byline a real person." and "© 2026 That Layover Life · Copenhagen".
- The library block: Nancy Carleton's story "I Drove Across Denmark to Watch a Million Birds Go to Bed" (/stories/sort-sol-black-sun-denmark) with its own hero photo, cropped to 4:3, downscaled to 46 KB and embedded as a data URI, with the site's alt text and "Photo: Nancy Carleton" linking to the story. The layover guide "The 6-Hour Copenhagen Reset (from CPH)", with the first sentence of its live page description, "Six hours from CPH by someone who lives there.", labeled "From the guide page". (An earlier draft had a line written for the card; it was replaced with the guide's own words.) The "From the library · 1 story · 1 layover guide" count is computed from the data embedded in the page. It used to say "Denmark in the library", which read as a count of every Danish story; other stories pass through Copenhagen, so the label now describes only what this page shows.

Sample or placeholder:
- The whole guide is marked SAMPLE until a Location Expert verifies it.
- The "Try it with SAMPLE dates" entries, labeled SAMPLE in the list, the countdown and the floating tab.
- The hero photo is a labeled PHOTO slot: a member's own photo from the waiting area at International House Copenhagen.
- Every shop, salon, vet, restaurant and running route is an empty "Location Expert to add" slot. None is invented.

Written for this prototype (interface copy, not story text): the section headlines "Every line you will stand in." and "When the paperwork is done.", the step asides, the slot descriptions and the short dek lines, including the survival links line "Everything else comes from Location Experts who live in Copenhagen, and until one of them vouches for a place, its card stays empty." Nancy should read them as new copy.

## Moving it onto the real site

Production is Webflow plus site-layer scripts, with a 15-script cap and no Tailwind.

- **Page:** a Webflow page at something like /for-expats/moving-guides/copenhagen-paperwork, built from Webflow sections for the hero, the Midnight tracker band, survival links and the library row. The CSS here is plain and token-based and would move into the site CSS under a `tll-mg-` prefix, reusing the site's existing button and focus layers.
- **Steps and sources in the CMS:** a "Moving guide steps" collection (city, route EU or non-EU, order, title, who, when, bring, aside, source links, checked date, verified-by Location Expert). Webflow renders the cards; a Location Expert's edit and date show up without code. The "Checked" date becomes a CMS field, so it is true for each step.
- **One script:** `tll-moving-guide-v1.js`, about 8 KB, for the route switch, the ticks, the tracker drawer and the chips. To stay under the cap it can be folded into the existing expat layer (`tll-expat-v1.js`) and run only when it finds the guide's root element. The tracker rules (offsets and sources) would sit in that script or in a small CMS collection.
- **Survival links:** a "Survival links" collection per city with a type (official or expert), category, source and the Location Expert who signed it. Empty slots render from the same collection with a "to add" state.
- **Reminders:** real alerts need member accounts and an email sender, which means a Worker endpoint plus consent. Until then the browser-only countdown is the honest version.
- **Home tiles:** the home Expats block currently marks "Moving guides" and "Visa trackers" as Coming soon (tll-redesign-p0-v1.js). Those tiles would become links once this guide is verified.

## What Nancy needs to decide

1. Who verifies the facts. The page should not drop the SAMPLE strip until a Location Expert in Copenhagen has opened every source link and signed off.
2. Whether the guide covers Nordic citizens and Danish citizens moving home, or says plainly that it does not.
3. Whether the tracker stays browser-only or becomes a member feature with email reminders (needs accounts, a sender and consent).
4. The URL and where the guide lives in the nav: under /for-expats, or as the first page of a Moving guides hub.
5. Whether the hero gets a member's real photo from International House or keeps the labeled slot until one arrives.
6. Whether to allow direct access to the official sites from the build environment, so future checks read the pages themselves rather than search excerpts.
