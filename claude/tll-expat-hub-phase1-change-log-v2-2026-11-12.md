# Expat hub, Phase 1: the change log, version 2

For Nancy. Written 12 November 2026, about 08:30 UTC. It replaces section 7 of /home/user/thatlayoverlife/claude/tll-expat-hub-step0-2026-11-11.md.

This is a table for your approval. It is not a record of anything done. Nothing was staged, written or published for it: no Webflow call, no form sent, no file in the repo changed. Your gate stands: nothing is staged until you approve this table.

## Short version

1. **Your sixteen answers are in the table.** No row says "pending question" any more.
2. **I re-read /for-expats on www today.** The page was published again on 11 November 17:07 UTC and 12 November 06:44 UTC. Nothing a visitor sees on /for-expats changed between those two. The page code differs in two lines only: the publish date, and the site code version (now 16.59.0, the photo hold). So no "Before" had to be corrected because the site moved.
3. **Several cells are now fuller**, because I read things Step 0 had skipped: the link preview title and description (row 26), the search section's own sentence and its "ALL COUNTRIES BY FLAG" link (row 5), the search result's resource column (row 6), the full list of links to the two old anchors (row 16), the map's phone height and its out-of-date switch name (row 14), and the two form intros (rows 20 and 21).
4. **Three DRAFT lines were rewritten** because they broke your no-lists-of-three rule (rows 3, 10 and 26), and one more for the same reason in row 31. A second reader then checked the table against www and your answers and changed more; the list is in section 11.
5. **Two groups, as you answered in F.** "Forms" rows can go live as soon as you approve them. "Overview" rows are staged and go live together with the Denmark guide.
6. **Your note on answer 4 is new scope.** It is a separate proposal in section 5 and belongs in Phase 2. It adds no row to Phase 1.
7. **"ADD LINK" may be a group name, or a link to follow.** Your own prompt lists LINK Denmark as a Copenhagen group. Question for you in section 9.
8. **The Danish Diaries does not look like a group.** It looks like one person's account. Details in section 6.
9. **Seventeen calls are yours inside Phase 1.** They are in section 8, each with options and a recommendation. Calls 13 to 17 were added by the check.
10. **Cost:** $0 so far, $0 planned.

## 1. What was re-read today, and how

All reads were plain page loads. In the browser every request that was not a simple page read was stopped before it left, and no form was sent.

| What | How | Result |
|---|---|---|
| /for-expats page code | Fetched at 07:44 UTC and compared line by line with the copy saved 11 November 17:24 UTC | Two lines differ: the publish date and the site code address. Everything else is identical |
| /for-expats in a browser, 1440 and 390 wide | Loaded, scrolled, read every section, both forms, the search for Denmark and Portugal | Same ten sections in the same order. Same words. No sideways scroll at either width |
| The test copy of /for-expats | Fetched and compared with www | Identical apart from the domain name. Nothing for this build is staged there |
| /for-expats/apply, /for-expats/list-a-group, /move/denmark, /moving-to/denmark | Fetched on www and on the test copy | All 404, as before |
| /travelers?list=expats | Loaded in a browser | Opens with "Live there" already pressed, as before |
| /the-map?mark=lived | Loaded in a browser, and the released map code searched | The map opens as it is. Nothing acts on "mark" yet, as before |
| /support | Fetched | The anchor layover-club is there |
| /contact | Fetched | One form only, "Tell the editor". No relay form, no mention of one |
| /countries/denmark | Loaded in a browser | The four Denmark resources still show. The page links to /for-expats |
| The three public data routes the page reads | Read once each | Expats map: Denmark 1, Thailand 1. Living Library: 0 cards. Series: 0 stories in every series |
| Every address in the sitemap (139) plus 9 others | Fetched, 144 answered 200, each searched for links to the two old anchors | Only /for-expats itself links to them in page code. One more link is written by site code on /edit-profile (row 16) |
| The released site code (16.59.0) | Searched in the repo at the released commit | The 12 November release changed the photo pages only. The /for-expats code is the same as on 11 November |

**Could not be re-read today, and why**

- **Element ids.** The ids in the "Element" column were read in the Designer on 11 November. The published page carries only two of them: the two form ids, dddf0a0b-b9ec-ae3d-0bdf-bc6616448b53 and 88e25396-1a9b-55c1-4243-5a07684b0d08. Both are confirmed today. Every other id can only be confirmed in the Designer, and this pass made no Webflow call. They are re-read there before any write.
- **Hidden blocks** (rows 13, 23 and 27). Hidden elements are not in the published page, so www cannot show whether they still exist.
- **Row 35, the 40 collections.** The count can only be read through Webflow. One thing did change on paper: on 12 November you answered yes to renaming the empty Bookmarks collection to Guides (/home/user/thatlayoverlife/claude/tll-launch-answers-2026-11-12.md). The site stays at 40 of 40.
- **The signed-in view of /edit-profile.** The link named in row 16 is in the released code; I did not see it on the page.
- **Whether Webflow allows a page folder named for-expats beside the page of the same name** (rows 28 and 32). Not tested, because testing it is a write.

Screenshots from today, phone and laptop:

- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/out/for-expats-390-full.png
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/out/for-expats-390-fold.png
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/out/for-expats-1440-full.png
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/out/for-expats-1440-fold.png
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/out/finder-Denmark-1440.png
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/out/finder-Portugal-1440.png

The full-page pictures show the public map cards as the site serves them, with two members' public display names. They stay in this working folder and are not for the repo.

## 2. The two groups (your answer F)

- **Forms.** The two new form pages and their fixes: rows 28 to 34, the new-page half of rows 19 to 21, and row 36 if you choose it. These can go live as soon as you approve them.
- **Overview.** The rebuilt /for-expats: rows 1 to 18 and 22 to 27, and the removal half of rows 19 to 21. Staged, and published together with the Denmark guide (Phase 2).

Each row's "After" cell starts with its group.

## 3. The table

How to read it:

- DRAFT marks a line I wrote. DRAFT (prompt) is a line from your prompt. DRAFT (staged) is a line reused from the 31 October staged build. Existing copy that stays is quoted without a mark. No draft line contains a typed count.
- "Before" was re-read on www on 12 November unless the cell says otherwise.
- Rows 14, 15, 17, 18 and 25 change site code, not Webflow. Each needs a code release as well as a publish.
- Phase 1 still changes no CMS collection, no CMS field and no Memberstack key.

| # | Page or collection | Element | Before | After | What could break | Needs from Nancy |
|---|---|---|---|---|---|---|
| 1 | /for-expats | Hero eyebrow 9fb9e2b5…e9f0 | "FOR EXPATS · THE LOCATION EXPERTS" | **Overview.** "FOR PEOPLE WHO MOVED ABROAD" DRAFT | Nothing | Nothing |
| 2 | /for-expats | Hero H1 9fb9e2b5…e9f2 | "Eight years somewhere beats eight days everywhere." | **Overview.** "Moved abroad? *Start here.*" DRAFT (prompt). Decided by your answer 1. The italic accent is in Sunset Rose. Your prompt sets both words in italic; the Brand Kit allows one accent word per H1, so the italic sits on "here." unless you choose both | The H1 is what search engines read first. The old line moves to row 16 | Call 13 |
| 3 | /for-expats | Hero lede 9fb9e2b5…e9f4 | "You know which bus actually runs, what the coffee should cost, and which month the guidebooks lie about. Find the expats who live where you are going, or become the one people find." | **Overview.** "Checked and dated by people who live there, so you can stop trusting a forum thread from 2014. Free to join." DRAFT. Rewritten: the 11 November draft opened with three things in a row | Nothing | Nothing |
| 4 | /for-expats | Hero buttons 4bbc2acf-2c49-71f7-86fd-9ece2f0bd708 (673bd154… and 21bce692…) | "Become a Location Expert" to #tll-expert-apply. "Find an expat group" to #tll-groups | **Overview.** Removed. The country picker (row 5) becomes the main control. Text link under it: "Add the places you've lived" DRAFT (prompt), to /the-map?mark=lived | /the-map does not act on "mark" yet (re-checked today). Until it does, the link opens the map as it is, without Lived selected | Nothing |
| 5 | /for-expats | Search section 85a680e1-f94e-6fb7-908f-702fbc714718 (box 7770f451…, FIND 048e09f7…, country list fd10090e…) | Second section. The box starts 914 px down on a laptop, just below the bottom of a 900 px tall screen, and 1,243 px down on a phone, so a visitor has to scroll for it on both. Eyebrow "JUST MOVED? START HERE". H2 "Find the expats in your country." Sentence: "The Location Expert who lives there, the groups people actually show up to, and the handful of resources worth your first week." Placeholder: "Where did you move? Try Denmark, Portugal, Japan". No visible label. FIND is a link to /travelers dressed as a button. Under it: "ALL COUNTRIES BY FLAG →" to /destinations | **Overview.** Moves into the hero. Visible label: "Where are you moving, or where did you land?" DRAFT. Placeholder: "Try Denmark, Portugal, Japan" DRAFT (a cut of the existing line). FIND keeps its word and becomes a true button, set as "Find" in sentence case, as the Brand Kit asks of every button label. "ALL COUNTRIES BY FLAG →" stays under the box (existing words). The eyebrow, the H2 and the sentence are removed; the sentence promises a Location Expert that no country has | The page script finds these parts by their markers. Moving them without updating the script in the same change breaks the search | Nothing |
| 6 | /for-expats | Search result panel (page footer script tll-expats-js-v1, 9,663 characters) | For every country: a heading "Expats in [Country]", "DESK OPEN", "COUNTRY PAGE →", "No expert in [Country] yet. Live there? The desk is yours to claim. A human reviews within 48 hours.", "CLAIM THE [COUNTRY] DESK →" to #tll-expert-apply, "None listed yet. Run one? LIST IT →" to #tll-groups. Resource column "OTHER RESOURCES · CHECKED BY A HUMAN": four rows for Denmark, and for any other country "Nothing checked for [Country] yet. We only list what a human has actually looked at." Under the four Denmark rows: "External sites. We don't run them, we just think they're useful." That line does not show when a country has no resources. Last, for every country: "SUGGEST A RESOURCE →", an email link | **Overview.** Shows only what exists for that country: checked resources, listed groups, the country page link, and the guide at /move/[country] once one is published (your answer 2). An empty column does not render. When nothing exists, the existing sentence stays, "Nothing checked for [Country] yet. We only list what a human has actually looked at.", followed by "Live here? Help fill this in" DRAFT (prompt), linking to Give back. "DESK OPEN", the expert column and the 48 hour line are removed. The two form links point at the new pages. "SUGGEST A RESOURCE →" stays an email link in Phase 1 | Links of the form /for-expats?country=Denmark must keep working (they work today, re-checked). The same script builds the country suggestions (rows 29 and 33) | Nothing |
| 7 | /for-expats | Member count in the result | None on the page. The source answers Denmark 1 and Thailand 1 today | **Overview.** Approved by your answer D. From the site's opt-in count (Worker route /expats-map), shown only when it is 1 or more. Pattern: "[N] member lives here" / "[N] members live here" DRAFT, the number always filled by the source | The same route also returns display names and cities. This line uses the country number and nothing else | Nothing |
| 8 | /for-expats | Journey chips (new) | None | **Overview.** Four links: "Planning a move", "Just landed", "Been here a while", "Moving back" DRAFT (prompt). Each a true link with a spoken label such as "Just landed: jump to Your first week" DRAFT. 44 px tall, the kit's compact size | "Moving back" has nothing to point at yet: 0 stories and 0 resources (re-checked) | Call 4 |
| 9 | /for-expats | Step rail (new) | None | **Overview.** Sticky rail on desktop, swipe row on phones, current step marked, no animation under reduced motion. Spoken name of the rail: "Steps" DRAFT | Needs a small script of our own for the current-step mark. No library | Nothing |
| 10 | /for-expats | Eight step cards (new), each an H2 with an id: pick-your-place, before-you-go, your-first-week, your-first-90-days, find-your-people, meet-a-local-expert, get-out-there, settle-in-and-give-back | None | **Overview.** Step names DRAFT (prompt). One line each, all DRAFT: (1) "Choose a country and see who already lives there and what they wrote about it." (2) "The visa and permit starting points, with official links and the date we last checked them." (3) "The official checklist, one line at a time, so the paperwork stops being a rumor." (4) "Housing, money, health, work, language, schools and pets, sorted by what you need this week." (5) "Groups that are open to new members, with what each one is good for and how to join." (6) "Members who live there and said yes to coffee or a question." (7) "The next few events worth leaving the apartment for." (8) "Read the people who stayed, then add the thing you wish someone had told you." Line 8 is rewritten: the 11 November draft was a list of three | There are 0 Global resources today, so the cards describe content that arrives in Phase 2. That is why this group waits for the Denmark guide (your answer F). Two cards will still have nothing behind them on that day: card 6 describes members who said yes to coffee, and that switch goes public only in Phase 3 (your answer G); card 8 points at the series stories, of which there are 0 today (re-checked) | Call 14 |
| 11 | /for-expats | Empty-step line on the rail (new) | None | **Overview.** "Live here? Help fill this in" DRAFT (prompt) | Nothing | Nothing |
| 12 | /for-expats | Move guides row (new) | None | **Overview.** Built, renders nothing until a guide is published. At launch it holds one card, Denmark, linking to /move/denmark (your answers 2 and 3). Heading when it shows: "Move guides" DRAFT (prompt) | Nothing | Nothing |
| 13 | /for-expats | "The experts so far" section 9d07cbc0-7cc0-d112-38cc-7b0ce78972c8 (H2 6485e933…, grid d59def15…, tile 3fe9d130…, link e4fadf18…) and its four hidden cards (dc46d80e…, 13591898…, 75e34864…, 155da7be…) | Eyebrow "THE DIRECTORY · WHO LIVES WHERE". H2 "The experts so far." Sentence: "Each expert anchors their country page. Their links are the ones they switched on, nothing more." No expert cards. Link "See every traveler →". One tile: "Your city is not listed? Any city, any country. Claim it." The four hidden cards cannot be seen on www | **Overview.** Removed | The map code attaches after this section or, when it is gone, after the element with the id tll-expert-apply (re-read in the released code today). Row 16 keeps that id on Give back. Rows 13, 14 and 16 go live together with the code release | Nothing |
| 14 | /for-expats (site code tll-expats-map-v1, in the site-wide code) | Expats map | A section 1,152 px tall on a laptop and 870 px on a phone. 2 countries. Heading "Where our expats call home." Last line: "Living abroad? Switch on Expats on your profile and you join the map, at the city you choose." The profile switch is named "Live there", so that line names a switch nobody can find | **Overview.** A thin strip beside the Living Library strip. Returns full size at about 25 pins; the code needs an exact number and needs to know whether it counts countries or members (call 9). The heading stays. The last line names the real switch: "Living abroad? Switch on Live there on your profile and you join the map, at the city you choose." (existing line, one name corrected) | Site code release needed. Without it the map stays full size and lands below Give back (row 13) | Call 9 |
| 15 | /for-expats (staged site code tll-expat-v1) | Living Library strip | Not public. The data route answers with 0 cards | **Overview.** Visible to everyone, no contact details (your answer 6). Shuffled per visit. Renders nothing in Phase 1: nobody can appear until the coffee switch goes public in Phase 3 (your answer G). Heading and line from the staged build: "People you can borrow for coffee", "Members who said yes to coffee with newcomers." DRAFT (staged). The staged line's second sentence, "No contact details on cards, no paid places.", is cut: it is a mirrored "no this, no that" pair and reassurance nobody asked for. Link "See everyone" DRAFT (prompt) to /travelers?list=expats | The Worker's /living-library route lets a profile through when its visibility was never set (src/living-library.js). The map only shows a profile set to Public. Changing that is a Worker change, not site code | Call 10 |
| 16 | /for-expats | Give back block (new). It takes over the old anchors #tll-expert-apply and #tll-groups | None | **Overview.** H2: "Eight years somewhere beats eight days everywhere." (existing line, moved here by your answer 1). One sentence: "You already know which office wants the form in triplicate. Tell the next person before they find out at the counter." DRAFT. Rewritten at the check: the earlier draft ran two "which" clauses side by side, a mirrored pair. Three doors: "Become a Location Expert" to /for-expats/apply, "List your group" to /for-expats/list-a-group, "Recommend a resource" DRAFT (prompt), in Phase 1 the same email link the search panel uses today | Old links to the two anchors land on the doors, one click short of the forms. The full list, checked today across 148 addresses: 7 links in /for-expats's own page code (4 to the first anchor, 3 to the second), and one written by site code on /edit-profile ("Claim your desk →" to /for-expats#tll-expert-apply). No other page links to either anchor. The /edit-profile link is changed to /for-expats/apply in the same code release | Nothing |
| 17 | /for-expats (site code tll-page-heroes-v1 and staged tll-series-v1, site-wide code) | "From the stories" band | Label "FROM THE STORIES" and three travel story cards: Montenegro, La Paz, Ghana. Typed into code | **Overview.** Removed from this page. Replaced by the series rows. Your rule: until a series has two stories, the three series show as one combined row. With 0 stories in all three (re-checked) nothing renders. Row labels are the staged series names, DRAFT (staged) | Site code release. The same code runs the hero photos on other pages, so /stories, /travelers, /the-map and /about get a re-check. The combined-row rule would be added to the staged code | Nothing |
| 18 | /for-expats (same site code as row 17) | Hero photo | A Sort Sol photo from a travel story, with a credit link to that story. On a phone the hero is 929 px tall with it, taller than the first screen | **Overview.** Proposal: remove the photo and its credit on this page, so the picker sits on the first screen at 390 px | Same code release as row 17 | Call 3 |
| 19 | /for-expats to /for-expats/apply | "What a Location Expert does" 95467e3f-4d9f-adff-0736-a5a83cfd2b2b and "What you get" 9fb9e2b5-c453-7a9a-a512-33827431ea08 | On /for-expats, six cards. Card 03 reads "Reader questions about your patch come to you through TLL, never straight to your inbox. A sentence back is enough." The first check card reads "The Location Expert label on your profile and every byline. You get it by living there, which is the hard part." | **Forms** for the cards arriving on /for-expats/apply. **Overview** for taking them off /for-expats. Four cards move. Card 03 and the first check card are held back until Phase 3 (your answer C), when the "Ask a local" form and a Location Expert field make them true. Three of the four moving cards break your house rules as they read today, so the check proposes these, all DRAFT: card 02's heading "Files the local truth" (a form of a banned word) becomes "Writes down the local truth"; the second check card "Your links on every story: blog, newsletter, socials, the ones you switch on. Your byline stays yours, edited lightly." (a list of three) becomes "Your links on every story, the ones you switch on. Your byline stays yours, edited lightly."; the third check card "First call when a reader, an editor or a press trip needs someone who actually lives there." (a list of three) becomes "First call when a reader or an editor needs someone who actually lives there." Card 01 moves unchanged | Each heading shows two cards where it showed three | Call 15 |
| 20 | /for-expats to /for-expats/apply | "Claim your desk." section dddf0a0b-b9ec-ae3d-0bdf-bc6616448b5d | On /for-expats. Eyebrow "BECOME A LOCATION EXPERT". Intro: "Tell us where you live and what you know that a visitor never will. An editor reads every application and replies within 48 hours. Your first story runs in Stories under From the Location Experts." | **Forms** for the new page (rows 28 to 31). **Overview** for taking the section off /for-expats | The intro makes two promises: a reply within 48 hours, and a place in Stories named "From the Location Experts". I found those words on no other page today | Call 6 |
| 21 | /for-expats to /for-expats/list-a-group | Groups section 88e25396-1a9b-55c1-4243-5a07684b0d17, with the box 88e25396…0cee | On /for-expats. Eyebrow "EXPAT GROUPS BY AREA". H2 "Run a group? List it." Intro ends "A human checks every listing, usually within 48 hours." Box: "LISTED SO FAR / No groups listed yet. The first one goes here." | **Forms** for the new page (rows 32 to 34). **Overview** for taking the section off /for-expats. The empty box is removed and not rebuilt | Same 48 hour promise as row 20 | Call 6 |
| 22 | /for-expats | Closing section 9fb9e2b5-c453-7a9a-a512-33827431ea11 | "Bring the local truth." "We bring the readers and the backlinks, credited and disclosed." "Claim your desk →" to #tll-expert-apply. The third call to apply | **Overview.** Removed | Nothing | Nothing |
| 23 | /for-expats | Hidden pills block 2c80823d-aafd-65a3-2458-1c4cc6e090e0 | Hidden. Cannot be seen on www | **Overview.** Removed | Nothing a visitor sees | Nothing |
| 24 | /for-expats | Partner slot (new) | None | **Overview.** Built hidden. When filled: labels "Partner" and "Reklame for [Sponsor]" DRAFT (prompt), with sponsored link marking | Nothing | Nothing |
| 25 | /for-expats (staged site code tll-expat-v1) | Layover Club line | Not public | **Overview.** "That Layover Life stays free because readers chip in." with a link "The Layover Club" to /support#layover-club. DRAFT (staged) | Nothing. /support has that anchor (re-checked) | Nothing |
| 26 | /for-expats | Page title, meta description, link preview title and description, structured data | Title "For Expats · Local Truth From People Who Live There · TLL". Description "Living it, not passing through. Eight years somewhere beats eight days everywhere. Bring the local truth from your city, credited and disclosed." Link preview title (also used for the structured data name): "For Expats · That Layover Life". Link preview description: "Living it, not passing through. Local truth from people with a postcode, credited and disclosed." Structured data description: recruitment copy that uses the verb your prompt bans | **Overview.** Title "For Expats · Your Move Abroad, Step by Step · TLL" DRAFT. Description (138 characters) "Moving abroad, or just landed? Take it one step at a time, with official links checked and dated by someone who lives there. Free to join." DRAFT. Rewritten twice: the 11 November draft ended with three things in a row, and the next one ran "from the first form to the first coffee", a mirrored pair. The link preview title stays as it is. The link preview description and the structured data description take the new description | Search listings and link previews change. The page stays indexed. The share image is not touched | Nothing |
| 27 | /for-expats | Page code: three style blocks (tll-expats-v1, tll-expats-v1-1, tll-expert-form-v1) and the footer script. The staged block "Your homes count too." (site code tll-expat-v1) | All three style blocks and the script are in the page today. The staged block does not show on www | **Overview.** Trimmed to what the new page uses; form styles go to the new pages. The staged block is retired on this page, its Living Library and series parts kept | The two hidden source lists (4d7cd252-f2c7-180a-98a6-0e83e668c34f Resources, 4fb14406-9f97-27b3-6572-056db47fedf4 Expat Groups) stay. The search needs them. Today they hold 4 and 0 rows | Nothing |
| 28 | /for-expats/apply (new page) | The page and its folder | /for-expats/apply is 404 on www and on the test copy. The sitemap shows no static page inside a folder | **Forms.** New page. Title "Become a Location Expert · TLL" DRAFT. Meta description, none until now: "Live somewhere a visitor only passes through? Apply to write about it. An editor reads every application." DRAFT. Indexed, like /for-expats, unless you say otherwise. H1 "Claim your desk." (existing). The four cards from row 19 above the form | The address needs a page folder named for-expats beside the page of the same name. My tools can place a page in a folder but cannot create one (inferred). Whether Webflow allows a folder and a page to share that name is not verified | You create the folder by hand. Call 2. Search settings: call 16 |
| 29 | /for-expats/apply | Form "Location Expert application" | The published page calls the form "location-expert". 7 boxes and a checkbox. The page code still gives two boxes one name, "Field"; site code renames them in the browser to name-or-pen-name and published-links, on /for-expats only (seen working today). "Where you are from" is added by the same code | **Forms.** The form name stays "Location Expert application" (your answer E), and the published test page is read to confirm it says so. Fields: name-or-pen-name, email, city-country, years-there, from-country, local-truth, published-links, age-and-terms. "Where you are from" is built into the form as from-country. One data key is retired: "Field". The three older submissions keep their links answer under "Field" and have no name; nothing is moved or deleted | (1) The rename and "Where you are from" only run on the exact address /for-expats. On the new page the form must publish the right names itself. Why Webflow publishes "Field" when the Designer shows the right names is unknown, so the published test page is read first. (2) New Webflow form records; the 3 older submissions stay under the old ones. (3) The country suggestions (195 countries) are built by the /for-expats page script and vanish here unless the list is rebuilt on this page | One test application from you (call 11). The country list is call 8 |
| 30 | /for-expats/apply | Placeholders and labels | "Example text" in the name box and the email box. The other five boxes have real hints. Every box has a working label except the checkbox, whose text is not connected to it. "Editorial Charter" is not a link | **Forms.** Name: "The name you write under" DRAFT. Email: "you@example.com" DRAFT. The links box keeps its label; its hint "Substack, blog, Instagram" is a list of three and becomes "A link to your blog or newsletter" DRAFT. The checkbox text is connected to the checkbox, words unchanged, "Editorial Charter" linked to /editorial-charter (200 on www, re-checked) | Nothing | Call 15 for the links hint |
| 31 | /for-expats/apply | "What is public, what is not" box (new, above the form) | None | **Forms.** Three lines, all DRAFT: "Public: the name you write under and your city and country, next to your stories. Never your email." / "Sending this lists nothing. You appear on the expats map only if you switch on Live there on your profile, and you can undo that in one click." / "We never show where you are right now. City or country only." Line 2 is rewritten at the check: the earlier draft said "Nothing is listed until we approve it", and no approval step exists today | Line 2 is true today: the map lists a member as soon as "Live there" is on and the profile is Public, with no approval. An approval step arrives only with the Location Expert label in Phase 3 (your answer C). Nothing in the box says that messages go through TLL, because the relay form does not exist until Phase 3 (your answer B) | Call 17 |
| 32 | /for-expats/list-a-group (new page) | The page | /for-expats/list-a-group is 404 on www and on the test copy | **Forms.** New page. Title "List Your Expat Group · TLL" DRAFT. Meta description, none until now: "Run a group that newcomers should know about? Send it in, and a person here checks it before it goes on the list." DRAFT. Indexed unless you say otherwise. H1 "Run a group? List it." (existing) | Same folder point as row 28 | Same folder as row 28. Search settings: call 16 |
| 33 | /for-expats/list-a-group | Form "Expat group listing" | The published page calls the form "Expat group listing". All 5 boxes show "Example text". None of the 5 has a connected label, and the checkbox text is not connected either. Field names: group-name, city-or-area, country, group-link, email, runs-group-and-open | **Forms.** Same form name, same field names. Every box and the checkbox get a connected label; the label words stay. Placeholders, all DRAFT: group name "The name people search for"; city or area "City or area, for example Copenhagen"; country "Start typing a country"; link "https://"; email "you@example.com" | New form records (the old ones hold 0 submissions). The country box takes its suggestions from the list the /for-expats page script builds. If the list is not rebuilt on this page, the placeholder becomes "Country" DRAFT | Call 8 |
| 34 | /for-expats/list-a-group | "What is public, what is not" box (new) | None | **Forms.** Three lines, all DRAFT: "Public: the group's name, city, country and link. Never your email." / "Nothing is listed until a person here has checked it. Email us and we take it down." / "Please leave out home addresses and private meeting places." Line 3 is rewritten at the check: "No home addresses and no private meeting places, ever." was a mirrored "no this, no that" pair | The 12 October spec says "removable in one click". A group listing has no switch, so the draft promises removal by email | Call 5 |
| 35 | Collections | All 40 | Not re-read (needs Webflow). On paper: Bookmarks is to be renamed Guides by you, under your launch answers. Still 40 of 40 | **Both.** No collection or field is created, changed or deleted in Phase 1 | Nothing. The data model is Phase 2 and gets its own table | Nothing |
| 36 | /for-expats (today's page) | The two forms where they sit now. New row, only if you choose it in call 1 | The faults in rows 30 and 33 are on the live page today | **Forms.** The same placeholders and labels as rows 30 and 33, applied in place. Nothing is moved and nothing is removed | For a while each form exists on two pages under one form name. Submissions from both arrive in the same inbox, in separate Webflow records | Call 1 |

### Not touched in Phase 1

- Nav, footer and the floating "Tell the editor" button. One proposal for you only, unchanged from 11 November: on a phone the "Tell the editor" dot sits over page content at some scroll positions, including this page's first screen.
- Memberstack and the Worker. One exception would arise only if you choose call 10 b.
- The slug /for-expats and its page id.
- Both form names, every field name in rows 29 and 33, and the anchors #tll-expert-apply and #tll-groups (kept, though they land on doors). The one field name that goes is the broken shared key "Field" (row 29): it is the name that lost every applicant's name, and its two answers already arrive under their own names since 11 November.
- Your answer 7: the private "My move" checklist is decided after Denmark is live. No row.
- Your answer 8: you own the quarterly re-check for Denmark. That is Phase 4. No row.

### Type and color

Brand Kit v2.6 (/home/user/thatlayoverlife/handoff/TLL-BrandKit-v2.6.html) wins where it differs from the palette typed in the prompt. Three differences matter here. Midnight is #0A0B14. Filled buttons are #D63859 with white labels, and Sunset Rose #F0507A is for the italic accent word at headline size only. The keyboard focus ring is 2 px solid #C8325B with a 2 px gap. Standard buttons are 48 px tall and compact ones 44 px. Button and text link labels are sentence case, never all caps, so the labels this page keeps are set as "Find", "All countries by flag →", "Country page →" and "Suggest a resource →": the same words, not the same capitals. The rose italic word is one word per H1 (row 2).

### Site code release order, updated

Rows 14, 15, 17, 18 and 25, and the /edit-profile link in row 16, change the site-wide code. www runs 16.59.0 since the publish of 12 November 06:44 UTC. Version 16.60.0 is registered in the site header and staged, not published. Another session has asked in /home/user/thatlayoverlife/handoff/WEBFLOW-LOCK.md that nobody release site code until its design audit batch is logged as staged. So this build's release takes the next free version number after that batch, is written into the lock log before it is registered, and reaches www only through a publish you ask for. One thing to know: once a code version is registered in the site header, the next publish by anyone carries it. So the overview's code is either registered on the day the overview goes live, or written so it does nothing until the new sections are on the page (call 7).

## 4. What your answers changed, row by row

| Your answer | Rows it settles |
|---|---|
| 1, "Start here" | Row 2 (new H1), row 16 (the eight-years line becomes the Give back heading) |
| 2, /move | Rows 6 and 12 (links to /move/[country]) |
| 3, Denmark only | Rows 10 and 12 (one guide card at launch, no Global guide) |
| 4, members only | No Phase 1 row. The list is Phase 3. Your note is section 5 |
| 5, groups | No Phase 1 row. Seed content is Phase 2. Section 6 |
| 6, everyone | Row 15 |
| 7, later | No row |
| 8, you | No row (Phase 4) |
| 9, recommend | No Phase 1 row. Section 7 |
| A, two existing collections | Row 35 |
| B, one small relay form | Rows 16 and 31 say nothing about messages going through TLL until Phase 3 |
| C, hold | Row 19 |
| D, the "Live there" count | Row 7 |
| E, form name | Row 29 |
| F, together | The two groups, every row |
| G, two switches in Phase 3 | Row 15 |

## 5. Proposal: letting expats add to the recommendation lists (new scope)

Your note: "Allow all expats to contribute to recommendation lists on the country guide page".

How I read it: on /move/denmark, the lists of resources, groups and events should grow from what expats send in, not only from what you seed. A person reviews everything before it shows. Two things I cannot tell from the note, both question 3 in section 9: whether "all expats" means every expat who is a member (the reading in the answers file, since the note sits inside "Members only"), or any expat who visits; and whether "recommendation lists" also takes in "Expats worth following".

What exists to build on: the Resources and Expat Groups collections, both with a Status of In review, Live or Declined. Webflow forms that land in your inbox. Member accounts. The "Live there" switch. No room for a new collection.

### Three options

| | Option 1: one open form | Option 2: the same form, plus a mark for members who live there | Option 3: members add from their account |
|---|---|---|---|
| What it is | One new Webflow form, "Recommend something", linked from every list on the guide page with the country already filled in. Anyone can send it. It lands in your inbox. You create the row in Resources or Expat Groups, or tell me to | Option 1, and when the sender is signed in the form also carries their member id and whether "Live there" is on for that country. A row sent by such a member can show a small label: "Recommended by someone who lives here" DRAFT | A signed-in member fills a short form on the guide page. The Worker writes the row straight into the collection as "In review". You switch it to Live |
| Who can send | Any visitor. If you meant members only, the form is shown only to signed-in members; the form address itself stays reachable, so the review is what keeps it clean | Any visitor, or signed-in members only, as in option 1. Members who live there get the label | Members only |
| Review before it shows | You, from the inbox | You, from the inbox | You, in the CMS |
| New things needed | One form (name and field names approved by you). No collection, no field | One form. One switch field on Resources and one on Expat Groups, added with the Phase 2 fields | Worker code and a deploy from your Mac. Abuse limits. No collection |
| What it needs from you | A few minutes per recommendation: read it, open the link, say yes | The same, plus one tick when the sender lives there | A Worker deploy, then one click per recommendation |
| Phase | Phase 2, with the Denmark guide | Phase 2 for the form, with the label switched on in Phase 3 beside the other member features | Phase 3 at the earliest. Better in Phase 4, once you know how many arrive |
| Cost | $0 | $0 | $0 |

**Recommended: option 2**, built as option 1 first, open to the senders your answer to question 3 names. It is the smallest thing that does what the note asks, it keeps a person in front of every row, and it gives members who live there something a stranger's suggestion does not have. Option 3 is worth it only when retyping from the inbox becomes a chore, and with 8 members today that is some way off.

Rules that hold for all three:

- Nothing goes up until a person has checked it. Every row starts as In review; only you set it to Live.
- No sender's name on a public row. If you want named credit, it is opt-in and it is your call.
- Nothing about the sender is shown beyond, in option 2, that they live in that country. Never their city, never where they are right now. Their member id stays in the private form record.
- With one or two members living in a country, the option 2 label points at one person. In Denmark today that person is you. Proposal: the label stays off in a country until the site's opt-in count there reaches a number you set.
- Where it is stored: rows in the two collections that exist, Resources and Expat Groups (events as Resources rows, as in Step 0). The site is at 40 of 40 collections, so no option creates one.
- The form asks whether the sender runs the thing or is paid by it. Paid and Partner rows are never listed first.
- Email is asked for a reply and never shown.
- People to follow are not on this form at launch. Under your answer 4 that list is members only, and it gets its own nomination form in Phase 3.
- The existing group form stays for people who run a group. This form is for recommending a group you only attend.

Draft field names for the form, for your approval with the Phase 2 table: kind, name, link, country, city, why-it-helps, your-tie-to-it, lives-there, email. Draft form name: "Expat recommendation".

### What a visitor sees before any recommendation exists

- Each list shows your checked seed rows and nothing else. There is no empty "recommended by members" block, no counter and no "be the first".
- Under each list, one line with a link to the form: "Know a better one? Tell us, and a person here checks it before it goes up." DRAFT
- The "lives here" label does not render until a row carries it.
- A list with no rows at all does not render. The rail shows that step greyed out with "Live here? Help fill this in" DRAFT (prompt), linking to the same form.

### Does any of it belong in Phase 1

No. The guide page does not exist until Phase 2. Phase 1 has one touching point: the third Give back door, "Recommend a resource" (row 16). It stays an email link in Phase 1 and becomes this form in Phase 2 if you approve the proposal.

## 6. Note: the groups you named (Phase 2 content, not a Phase 1 row)

How this was checked: by web search only. This session's network does not reach amcham.dk, internations.org, facebook.com, tiktok.com or instagram.com, so none of the pages below was opened. Your prompt says every seed link must be opened before it is entered. So all of them are UNVERIFIED until someone opens them: you, or me once those hosts are allowed.

| Name | What it is | Public home page, from search | Latest sign of life I could see | Is it a group |
|---|---|---|---|---|
| AmCham Denmark | A business chamber for American, Danish and international companies. Mostly business events, many for members. It also runs family and social events and is a partner of International Citizen Days | amcham.dk. Events at amcham.dk/upcoming-events/ | Event pages dated 3, 9, 11 and 17 November 2026, a family Thanksgiving dinner on 22 November 2026 and a holiday mingle on 14 December 2026 | Yes, of the Professional kind. Active. Whether an individual can join, and what it costs, was not visible |
| The Danish Diaries | Not a group, as far as search shows. The name belongs to one person's video account about daily life in Copenhagen, on TikTok with a linked Instagram account. An older personal blog also carries the name in its title | tiktok.com/@thedanishdiaries. The blog: thedanishchronicles.blogspot.com | For the video account, search showed one item about 171 days old (roughly late May 2026) and one from January 2025. For the blog, no date was visible. No meetups or member community turned up for either | No. It reads as a creator. That makes it a candidate for "Expats worth following" (step 8, Phase 3), not for the groups list |
| InterNations Copenhagen | The Copenhagen community of a worldwide expat network with free and paid tiers. Official events and interest groups | internations.org/copenhagen-expats. The Resources row on the site links to the network's front page, internations.org | Search summaries describe tens of thousands of members and dozens of events a month, but those pages carry no date. The only dated event search showed was 27 August 2025 | Yes. Looks active; no 2026 date confirmed |
| Expats in Copenhagen (Facebook) | A Facebook group for questions from newcomers | The Resources row links to facebook.com/ExpatsInCopenhagen. Facebook groups normally live at an address that starts facebook.com/groups/, so that link may open a Page and not the group. A directory listing for a group of this name exists (nomad.watch/communities/expats-in-copenhagen) | Nothing dated. Third-party articles give member counts that disagree, and the group cannot be read without a Facebook sign-in | Yes, if the link is right. Activity not confirmed |
| LINK Denmark (only if "ADD LINK" means it) | A volunteer-run network for international women in Copenhagen, with interest groups. Your prompt names it twice | Its own site did not come up in search | A Copenhagen Post feature dated 1 April 2026 | Yes, of the Women kind. Looks active in 2026 |

Three things follow:

1. **The Danish Diaries and your answer 4 pull against each other.** You chose members only for "Expats worth following". An outside creator can be listed only if that person joins and says yes. Question 2 in section 9.
2. **Two of the four Denmark resources are groups.** In Phase 2, InterNations and the Facebook group move from Resources to Expat Groups, each with the right link.
3. **AmCham is not a social group for newcomers.** If it goes on the list, the "what it's good for" line should say so plainly. Draft for the Phase 2 table.

Sources:
- [AmCham Denmark, events](https://amcham.dk/upcoming-events/)
- [AmCham Denmark, 2026 family Thanksgiving dinner](https://amcham.dk/events/amchams-2026-family-thanksgiving-dinner/)
- [AmCham Denmark, 2026 holiday mingle](https://amcham.dk/events/amchams-2026-holiday-mingle/)
- [The Danish Diaries on TikTok](https://www.tiktok.com/@thedanishdiaries)
- [The blog that carries the same name](https://thedanishchronicles.blogspot.com/)
- [InterNations Copenhagen](https://in-cdn.net/copenhagen-expats)
- [Directory listing for the Facebook group](https://nomad.watch/communities/expats-in-copenhagen)
- [The Copenhagen Post on the women's network, 1 April 2026](https://cphpost.dk/2026-04-01/life-in-denmark/how-a-women-only-network-is-helping-internationals-find-community-in-copenhagen/)

## 7. Note: the two guides, price and wording (your answer 9, "Recommend")

**Only you have the links.** No Ko-fi product link exists anywhere in the repo or on the site. The only Ko-fi address in the repo is the profile, and a profile link must never stand in for a product link. So everything below is a proposal, and nothing can be bought until you paste two product links.

What the repo already says (/home/user/thatlayoverlife/claude/tll-run1-build-plan-2026-11-11.md, parts 2.5, 3 and 5, and your launch answers of 12 November):

| | Paw Passport guide | Moving guide |
|---|---|---|
| Name | "The EU pet travel guide" (the home page's own words) | No title yet. Working name "The moving guide". Your prompt calls it the international moving guide |
| Price | €9. Read from hidden text on /the-paw-passport and from the hidden home link "Get the guide · €9". Waiting for your confirmation | None anywhere |
| Version and date | 1.0, last verified 28 September 2026. Waiting for your confirmation | None |
| Tax line | A hidden "incl. 25% moms" exists. Whether it shows is your call | None |
| State | Planned as "coming soon" until your link and price are in | "Coming soon", not a link, on the home card |
| Button | You chose "Get the guide" on 12 November. Label pattern: "Get the guide · [price]", the price filled from the guide's CMS item | Not decided |
| Under the button | "Secure checkout, in a new tab." | Same |
| Label above the title | "Paid guide · EU · PDF" | "Paid guide · International · PDF" |
| Where it lives | A Guides collection, once you rename Bookmarks. Card on /the-paw-passport | The same collection. The plan places its card on /for-expats |

**Proposal for you, all DRAFT**

- **Paw Passport guide:** keep €9 and the button "Get the guide · [price]". Both are already your words on the site.
- **Moving guide price:** €9, the same as the pet guide. My only basis is that it is the one price the site already carries, and two guides at one price read as a set. If the moving guide is much longer, say so and I will propose a second price. This is a suggestion, not a finding.
- **Moving guide button:** the same "Get the guide · [price]". One wording for both.
- **Until its link exists, on the hub pages:** the card does not render. Your hub prompt bans "Coming soon" on these pages. The home card's "Coming soon" tag belongs to the launch build and is not changed here.
- **In the hub:** both guide cards sit in step 2, "Before you go", on /move/denmark, each under the "Paid guide" label and never listed before the official links. That is Phase 2. No Phase 1 row mentions a guide.
- **One loose end:** the launch plan (part G7) suggests the home "Moving guides" card later points at /for-expats#guides. No Phase 1 row builds a #guides spot on /for-expats, so that link would land at the top of the page. Question 4 in section 9.

What I need from you, when you get to it: the two Ko-fi product links, yes or a number for each price, and the moving guide's title.

## 8. Your calls inside Phase 1

Each is one question. "Recommended" is what I would do if you answer "yes" to everything.

**Call 1. The two forms are faulty on /for-expats today. The new form pages can go live early, but nothing links to them until the new overview does. What happens in between? (rows 19 to 21, 36)**
- a. Fix the two forms where they sit now as well (row 36), and publish the new pages unlinked so you can send your test application. Two copies of each form exist until the overview goes live.
- b. Publish the new pages and, in the same publish, take the two form sections off today's /for-expats and point its seven links at the new pages. One copy of each form, but today's page is cut into early.
- c. Leave today's page alone until the overview is ready. The faults stay public until then.
- Recommended: a. It fixes the fault where visitors are, and it moves nothing on a live page.

**Call 2. The page folder. /for-expats/apply needs a folder named for-expats, and only you can create it. (rows 28, 32)**
- a. You try to create the folder in the Pages panel. About a minute. If Webflow accepts it, both new pages go in.
- b. If Webflow refuses a folder with the same name as the page, the two pages get top-level addresses. Draft addresses: /apply-location-expert and /list-a-group.
- Recommended: a first, b only if refused. I will not guess which it is.

**Call 3. The hero photo. (row 18)**
- a. Remove the Sort Sol photo and its credit on this page.
- b. Keep it on laptops, where it sits beside the text, and drop it on phones.
- c. Keep it everywhere and accept that the picker is below the first screen on a phone.
- Recommended: a. The photo is from a travel story, and the page is no longer about travel.

**Call 4. The "Moving back" chip. (row 8)**
- a. Hide it until there is a Moving Back story or resource to send people to.
- b. Show it now and send it to Give back, with the line "Live here? Help fill this in".
- Recommended: a. A chip that leads nowhere is the kind of empty state your rules forbid.

**Call 5. Taking a group listing down. (row 34)**
- a. Promise removal by email: "Email us and we take it down."
- b. Say nothing about removal in the box.
- Recommended: a. It is true today. "One click" would not be, because a group listing has no switch.

**Call 6. The promises in the two form intros. (rows 20, 21)**
The application intro says an editor "replies within 48 hours" and that the first story "runs in Stories under From the Location Experts". The group intro says "usually within 48 hours". I found no part of the site named From the Location Experts.
- a. Keep all three as they are. You are the editor and you know your pace.
- b. Keep "An editor reads every application." and drop the 48 hours and the Stories sentence. Same for the group intro: "A human checks every listing."
- c. You rewrite them.
- Recommended: b, unless 48 hours is a promise you want to keep making.

**Call 7. How to stage the overview so nobody else's publish sends half of it live.**
Several sessions publish this site, and a publish sends every page that is not a draft. The overview has to sit staged until the Denmark guide is ready, which may be weeks. Inferred, not tested:
- a. Build the new sections on /for-expats itself as hidden elements. Hidden elements are not in the published page: Step 0 found five hidden blocks on this page in the Designer, and none of them is in the page www serves. On the day, the new ones are shown and the old ones removed in one sitting. The page id stays.
- b. Build the overview as a separate draft page and swap addresses on the day. The live page is never touched, but the page id changes and the page code has to be copied.
- Recommended: a. With either one you can see the result only in the Designer's preview until the day, because the test copy publishes the same way www does.
- The site code half (rows 14, 15, 17, 18, 25) has the same risk: a registered code version goes out with the next publish by anyone. Recommended: write that code so it acts only when it finds the new sections on the page, so it can be released early and still change nothing until the day.

**Call 8. The country suggestions on the two new form pages. (rows 29, 33)**
The 195-country list is built by a script that runs on /for-expats only.
- a. Rebuild the same list on each form page with a few lines of page code. No library.
- b. Do without suggestions there. The country placeholder becomes "Country".
- Recommended: a.

**Call 9. The map strip. (row 14)**
The map says "Switch on Expats on your profile". The switch is called "Live there".
- a. Correct the line to name "Live there".
- b. Leave it.
- Recommended: a.
And one number: your prompt says the map "returns full size at about 25 pins". A pin on this map is a country. Recommended: full size again at 25 countries. Say a different number, or "members", if you meant people.

**Call 10. Who can appear in the Living Library strip. (row 15)**
The map shows a member only when their profile is set to Public. The Living Library also lets through a profile whose visibility was never set. That rule sits in the Worker (its /living-library route), so changing it means a Worker change and a deploy from your Mac.
- a. Change it in Phase 3, before the coffee switch goes public, together with the other Worker work there.
- b. Change it now, as the one Worker change in Phase 1.
- c. Leave the two rules different.
- Recommended: a. The strip shows nobody until Phase 3, so nothing is exposed in between, and Phase 1 stays free of Worker deploys.

**Call 11. Your test application. (row 29)**
Not a choice, a job: after the new application page reads right on the test copy, you send one application through it. That is the only proof the name arrives. Say when you want to do it.

**Call 12. Any DRAFT line.**
Every line marked DRAFT is yours to rewrite. Silence is read as "use it".

**Call 13. The italic word in the new H1. (row 2)**
Your prompt writes "Moved abroad? *Start here.*" with both words in italic. The Brand Kit allows one rose italic word per H1.
- a. Italic on "here." only.
- b. Both words, as your prompt writes it.
- Recommended: a. It follows the kit, and "here" is the word that does the work.

**Call 14. Step cards 6 and 8 on the day the overview goes live. (row 10)**
Card 6 describes members who said yes to coffee; that switch goes public in Phase 3. Card 8 points at the series stories; there are none yet.
- a. Each card shows its line and, while nothing is behind it, the greyed rail state with "Live here? Help fill this in".
- b. Hide each card until something is behind it, so the overview shows six or seven steps for a while.
- c. Show both cards as written.
- Recommended: a. It follows your empty-steps rule and keeps the eight steps in their order.

**Call 15. Existing words that move to the application page. (rows 19, 30)**
Four lines that move unchanged today break your house rules: card 02's heading "Files the local truth" uses a banned word, and three more are lists of three (two check cards and the links box hint "Substack, blog, Instagram"). Row 19 and row 30 carry DRAFT replacements.
- a. Use the replacements in rows 19 and 30.
- b. Move the lines unchanged.
- c. You rewrite them.
- Recommended: a.

**Call 16. Search settings for the two new pages. (rows 28, 32)**
Neither page had a meta description before. Rows 28 and 32 now carry a DRAFT description each, and both pages are indexed.
- a. Index both, with the DRAFT descriptions.
- b. Keep both out of search (noindex) and reach them only from /for-expats.
- Recommended: a. People search for how to list a group.

**Call 17. The line about being listed, on the application page. (row 31)**
The earlier draft said "Nothing is listed until we approve it and you switch it on." There is no approval step today: switching on "Live there" puts a member on the map at once. Row 31 now says only what is true today.
- a. Use the corrected line.
- b. Add an approval step before anyone appears on the map. That is a Worker change and belongs in Phase 3, with the Location Expert label.
- Recommended: a now, and b decided in Phase 3.

## 9. Questions for you outside Phase 1

1. **"ADD LINK".** Your answer 5 reads "ADD LINK, AmCham Denmark, The Danish Diaries". Two readings: (a) add LINK Denmark, the women's network your prompt already names, so three groups; or (b) a link will follow from you, which is how the answers file reads it. Which one? The capitals do not settle it, because "ADD" is in capitals too.
2. **The Danish Diaries.** Which one do you mean, the video account or the blog? And since it looks like one person and not a group: list it in "Expats worth following" in Phase 3 if that person joins and says yes, or make an exception to "members only"?
3. **"All expats"** in your note on answer 4: every expat member, or any expat who visits? Option 2 in section 5 works for both. And do "recommendation lists" include "Expats worth following", or only resources, groups and events?
4. **Ko-fi.** Two product links, the two prices, and the moving guide's title (section 7). Also: should the home "Moving guides" card point at /move/denmark instead of /for-expats#guides?
5. **The Facebook link.** The Resources row may point at a Page and not the group. Can you open it and send me the group's address?

## 10. Where the evidence is

The check's own reads (section 11): /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/check. The table as it stood before the check: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/phase1-change-log-v2.before-check.md

All in this session's working folder, not in the repo.

- Today's page copies from www: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/www
- Today's browser reads and screenshots: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/out
- The sitemap scan for the two anchors: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/sitemap
- The test copy: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/io
- The two scripts used: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/expat/update/scripts
- Yesterday's copy used for the comparison: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/www-for-expats-now.html

## 11. What the second check changed (12 November, about 08:10 UTC)

A second reader re-read www, the released site code (16.59.0, pin caac45af), the Worker's three public routes and your answers, and compared them with this table. Reads were plain page loads; every request that was not a page read was stopped in the browser, and no form was sent.

What was confirmed word for word on www today: the "Before" cells of rows 1 to 6, 13, 14, 17 to 22, 26, 28 to 30 and 33, the two form ids, the 404s in rows 28 and 32, the /edit-profile link in row 16, the map's attach rule in row 13, the 9,663-character page script in row 6, and the counts behind rows 7, 15 and 17 (Denmark 1 and Thailand 1; 0 Living Library cards; 0 stories in each series).

What changed:

- Row 2: the italic accent is one word per H1 in the Brand Kit, two in your prompt. Now call 13.
- Row 5: the search box starts 914 px down, just below a 900 px laptop screen, not on its bottom edge. "Find" is set in sentence case, as the kit asks of buttons.
- Row 6: the panel also has the heading "Expats in [Country]", and "External sites…" shows only for a country with resources.
- Row 10: cards 6 and 8 have nothing behind them on the day the overview goes live. Now call 14.
- Row 13: the section's own sentence added to "Before".
- Row 14 and call 9: the "about 25 pins" needs an exact number.
- Row 15 and call 10: the visibility rule is in the Worker, not site code, so changing it is a Worker deploy. The staged line's second sentence is cut (a mirrored pair).
- Row 16: the DRAFT sentence rewritten (two "which" clauses side by side).
- Row 19 and row 30: four existing lines that move break house rules (a banned word, three lists of three). Replacements are DRAFT. Now call 15.
- Row 26: the description rewritten again ("from the first form to the first coffee" is a mirrored pair).
- Rows 28 and 32: no meta description had been planned for the new pages. DRAFT descriptions added. Now call 16.
- Row 31: line 2 promised an approval step that does not exist. Rewritten. Now call 17.
- Row 34: line 3 rewritten (a mirrored "no this, no that" pair).
- "Not touched": the retired key "Field" and the call 10 Worker exception are now named.
- Site code release order and call 7: a registered code version goes out with anyone's next publish.
- Section 5: the members-only reading, privacy (sender's location, a label that can point at one person), review and the collection cap are now stated.
- Section 7: "Coming soon" is banned on the hub pages by your prompt; a guide without a link does not render there.
- Section 9: question 1 no longer leans on the capitals; question 3 and question 4 each gained one part. Question 2 no longer guesses the creator's gender.

What this check could not read: the Designer element ids other than the two forms, the hidden blocks, the 40 collections, form submission counts, the signed-in view of /edit-profile, and the outside group sites in section 6 (this network refuses amcham.dk, internations.org and tiktok.com).

## Approval page

https://claude.ai/artifact/JT54VN2CoFpDBMWcsvoCTL (24 questions; nothing is staged until Nancy approves).
