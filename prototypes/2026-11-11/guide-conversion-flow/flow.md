# How a Samoyed walks a reader to checkout

UX research for That Layover Life, Paw Passport. Prepared 12 November 2026. The same content as `index.html`, without the clickable wireframe.

This is the path from a story with Magnus Waffles in it to the €9 EU pet travel guide on Ko-fi, and back to the Paw Passport afterwards. Wherever the site already has the words, the plan reuses them, because they are good and readers have already met them. Anything in `[NANCY: …]` is a fact only Nancy has.

Labels: **Live today** (words or parts on www now), **New** (proposed here), **Needs Nancy** (waits on her).

## The short version

Most of the parts already exist. The four free mistakes and the rows of the paid guide are live on /the-paw-passport, and the home page carries Nancy's line with a buy button that sits in the page, hidden. Nothing yet leads from the places Magnus actually appears to the guide, and nothing brings a buyer back once Ko-fi has done its job. The plan adds two quiet doors, puts the price and the button inside the guide block, and it leaves the usual pressure tactics out on purpose, since a magazine that tells you the truth about border paperwork cannot then lie to you about stock levels.

## 00 · Where it stands (read on www, 12 November 2026)

| Where | What is there | Status |
| --- | --- | --- |
| Home, chapter 04 | "The EU pet travel guide. Read it before the ferry, not in the queue." Under it, "Get the guide · €9" and "On Ko-fi", in the page but hidden, link set to "#". | Hidden, no link |
| /the-paw-passport #guide | "Crossing borders with a dog, without the part where you cry at a checkpoint." The four free mistakes in full, the five "In the guide" rows on a dark card, "Not legal or veterinary advice. Your vet has the final word." No price, no button. | Live, not buyable |
| /pets/magnus-waffles | His page lists 15 countries crossed and links one story. Nothing about the guide. | Live, no door |
| Stories with Magnus | Nancy's border trips with him (two found, listed in step 01) end without any route to the guide. | Live, no door |
| src/site-layers/tll-kofi-v1.js | Prepared, switched off. With a Ko-fi product link it unhides the home button and adds a price line and "Get the guide · €9" to the dark card. | Waits on the link |
| Footer events (tll-ga4-events-v1) | Sends `kofi_click` on any Ko-fi link and `guide_checkout_click` on links leaving #guide. The planned `guide_purchase_click` is not in the code yet. | Names differ |

(In `index.html` the counts in this table are worked out from the data in the page: Magnus's country list from his page, and the story list below.)

## 01 · The flow, step by step

The reader came for a dog in a back seat, not for a sales pitch. So the doors offer more of the same subject, free, and the price only appears on the one page that explains what it buys.

Three doors in: **A** the end of a Magnus story, **B** Magnus's own page, **C** home chapter 04. All three lead to /the-paw-passport#guide, then Ko-fi, then back.

### 01 · Door A: a story reader meets the free part first
*New placement, words live today.* Place: /stories/&lt;slug&gt;, after the last paragraph, before related stories.

Shows only on stories where Magnus crosses a border, not every story with a dog in it. Today that is:

- [Fourteen days, twelve countries, one EV, and a gal who cannot be historically trusted to charge her own phone](https://www.thatlayover.life/stories/balkans-ev-road-trip-twelve-countries) · Balkans · Nancy Carleton · 9 min
- [I’ve Been in Schengen for Years. This Weekend I Actually Went.](https://www.thatlayover.life/stories/luxembourg-schengen-road-trip) · Schengen, Luxembourg · Nancy Carleton · 10 min

Reader sees:

> FROM THE PAW PASSPORT (Mono)
> **Four ways to get turned back at a border with your dog.**
> Three of the four are about order, not paperwork. They are on the Paw Passport, in full.
> Read the four → (text link to /the-paw-passport#guide)

Why: every line is already on /the-paw-passport, so the click lands on exactly what it promised. It sells nothing inside the story; the price is one page away and explained there.

Event: `guide_teaser_click` {placement: "story_end", story: slug} (proposed).

### 02 · Door B: his page points at the paperwork behind his borders
*New.* Place: /pets/magnus-waffles, under "Countries crossed".

> THE PAPERWORK BEHIND THESE BORDERS (Mono)
> **The EU pet travel guide. Read it before the ferry, not in the queue.**
> See what is in it → (text link to /the-paw-passport#guide)

Why: someone reading a dog's passport page is already thinking about a dog crossing borders. The headline is Nancy's own line from home, so the two doors read the same.

Event: `guide_teaser_click` {placement: "pet_page"} (proposed).

### 03 · Door C: home keeps the short road for people who already know
*Words live today, needs the Ko-fi link.*

> "The EU pet travel guide. Read it before the ferry, not in the queue."
> Button "Get the guide · €9" · note "On Ko-fi"

Goes to Ko-fi, as tll-kofi-v1 already prepares it. "Open the Paw Passport →" sits beside it for anyone who wants to look first, so home needs no new link.

Events: `guide_purchase_click` {placement: "home_ch04"} then `kofi_click`.

### 04 · The landing block does the explaining
*Most words live; price, button and after-you-pay rows new; facts in brackets.* Place: /the-paw-passport#guide.

The four free mistakes first, then the named author with his actual dog, the five rows of the paid guide, the rule it follows, the price, one button and what happens after paying. Full copy in section 02 below. The reader reads the free part first. Anyone who doubts Magnus exists is one click from his passport.

Event: `guide_block_view`, once per page view, when half the block is on screen (proposed).

### 05 · One click, Ko-fi opens in a new tab
*New, needs KOFI URL FROM NANCY.*

The two events fire first, then the Ko-fi product opens in a new tab. The TLL tab stays put, and the line under the button changes from "On Ko-fi · opens in a new tab" to "Ko-fi is open in a new tab." The button stays enabled in case a browser blocked the tab.

Events: `guide_purchase_click` {placement: "paw_guide_block", entry, value: 9, currency: "EUR"} then `kofi_click`.

### 06 · On Ko-fi, the copy is still TLL's
*Copy for Ko-fi, confirm delivery.* Place: ko-fi.com.

- **Product name:** The EU pet travel guide
- **Summary:** Crossing borders with a dog, without the part where you cry at a checkpoint.
- **Description:**
  > Written by Nancy Carleton, editor of That Layover Life, who does these crossings with Magnus Waffles, a 35 kg Samoyed with opinions. The law is the free part, and it is on thatlayover.life/the-paw-passport. What happened at the border at 11pm with a Samoyed in the back is the part you pay for.
  >
  > In the guide:
  > · Leaving the EU: listed vs unlisted, and why no secondhand list can be trusted (four official sources, four answers).
  > · The one blood draw before you leave that makes the three-month wait to come home disappear.
  > · The tapeworm window for Finland, Ireland, Malta, Northern Ireland and Norway: 96 hours, and it shuts a day early.
  > · A 10-minute check before every single trip.
  > · Hotels that genuinely take a 35-kilo dog, long drives and EV charging stops, ferries, trains, and finding a vet abroad before you need one.
  >
  > PDF · v1.0 · [NANCY: page count] pages. Checked against Commission Delegated Regulation (EU) 2026/131 on [NANCY: date].
  >
  > Not legal or veterinary advice. Your vet has the final word.
- **Thank-you message:** Thank you. Read it before the ferry, not in the queue. When your dog has crossed a border, give them a Paw Passport page: https://www.thatlayover.life/the-paw-passport?from=kofi
- **Delivery:** a PDF download on the Ko-fi screen and a copy by email. [NANCY: confirm this is how the product is set up in Ko-fi]

### 07 · Back, route 1: the old tab notices the reader is back
*New.* Place: the TLL tab that never closed.

> Back already? If the PDF is yours, your dog can have a passport page too. Register your pet → (/my-pets)

When: the tab becomes visible again at least five seconds after the click. It says "if", because the page cannot know whether anyone paid.

### 08 · Back, route 2: the thank-you link brings them home
*New, Ko-fi field to check.* Place: /the-paw-passport?from=kofi.

> BACK FROM KO-FI (Mono)
> Thank you. The guide is yours, and a copy is in your email. Your dog can have a Paw Passport page too, with the countries they have crossed.
> Outlined button "Register your pet" · text button "Close"

Then /my-pets, the existing registration. The loop ends where Magnus's own page began: a dog with a passport.

Event: `guide_return` on load with ?from=kofi (proposed).

## 02 · The landing block (exact copy, in reading order)

Left column (Paper):

1. Eyebrow (Mono): **The Paw Passport · a field guide · PDF** *(live)*
2. Headline (Playfair 800, accent on the last word): **The EU pet travel guide. Read it before the ferry, not in the *queue*.** *(Nancy's 10 Nov line)*
3. Meta (Mono): **PDF · €9 · on Ko-fi · see what is in it ↓** (jump link to the dark "In the guide" card)
4. Author row: square photo of Magnus (hero of "Even Brave Boys Get Scared", credit **Photo: Jay Carleton**, linked to the story) · **By Nancy Carleton, with Magnus Waffles** · Mono: **Samoyed · 35 kg · 15 countries on his passport** (count worked out from his page's list) · text link **Open his passport →** (/pets/magnus-waffles)
5. Intro *(live)*: The law is the free part. What happened at the border at 11pm with a Samoyed in the back is the part you pay for.
6. Free section *(live)*: Mono **On the house · read it first** · **Four ways to get turned back at a border with your dog.** · The four mistakes, in full, because they are the most searched and the most useful. Three of the four are about order, not paperwork.
   - Free · Chip first, then the rabies shot. The other way round does not count.
   - Free · 21 days, counted from the end of the protocol, not from booking the ferry.
   - Free · The booster has to land inside the old one. Miss it by a day and the clock restarts.
   - Free · Puppies: 12 weeks at the shot, then 21 days. Roughly 15 weeks before a first border.

Right column (Midnight card):

7. Mono **In the guide** *(live)* · **The part after the four mistakes.** *(new)*
8. Five rows with teal ticks *(live, verbatim, see step 06)*
9. Dashed slot: **PHOTO · two pages from inside the guide** · From Nancy, once the PDF is final. · *Coming soon*
10. Price: **€9** (Playfair) · Mono: **PDF · v1.0 · [NANCY: page count] pages · [NANCY: incl. 25% moms, yes or no]**
11. Rule line (the regulation's name links to EUR-Lex): Checked against Commission Delegated Regulation (EU) 2026/131, the EU rules for traveling with a pet since 22 April 2026. Last checked [NANCY: date].
12. Filled button: **Get the guide · €9** → KOFI URL FROM NANCY · note: **On Ko-fi · opens in a new tab**
13. After you pay (Mono labels):
    - Where you pay · Ko-fi, in a new tab. This page stays open.
    - What you get · The PDF, as a download and by email. [NANCY: confirm]
    - When rules change · [NANCY: "free updates when the rules change", keep or cut]
    - Refunds · [NANCY: refund line, or delete this row]
14. Fine print *(live)*: Not legal or veterinary advice. Your vet has the final word.

Return band (only with ?from=kofi), above both columns: Mono **Back from Ko-fi** · Thank you. The guide is yours, and a copy is in your email. Your dog can have a Paw Passport page too, with the countries they have crossed. · outlined **Register your pet** · text button **Close**.

Phone (390): one column in the order above, card after the free section, 16px gutter. Desktop: two columns inside the 1120px content column.

## 03 · Micro-interactions

Every timing at or under 250 ms, transform and opacity only, nothing starts invisible, and under prefers-reduced-motion each becomes an instant change.

| # | Element | What happens | Timing |
| --- | --- | --- | --- |
| M1 | Text link arrow (doors A and B) | On hover or keyboard focus the arrow moves 4px right. The 2px #C8325B underline does not change. | translateX(4px), 250 ms ease-out. Reduced motion: none. |
| M2 | Arrival at #guide | Only when the address has #guide. The page scrolls to the block; the block header rises from 8px below at 0.6 opacity. A plain visit gets no animation. | opacity .6 → 1, translateY(8px) → 0, 250 ms ease-out, once. Reduced motion: jump, no fade. |
| M3 | Buy button | Hover swaps #D63859 to #C8325B with no transition. Press nudges it down 1px. Focus on the dark card: 3px #00C9C8 ring, 2px offset. | press translateY(1px) 100 ms; hover and focus instant. |
| M4 | The click | "On Ko-fi · opens in a new tab" becomes "Ko-fi is open in a new tab." Button stays enabled, label unchanged. aria-live polite. | opacity .6 → 1, 250 ms. Events sent with transport beacon. |
| M5 | Tab regained | Tab visible again at least 5 s after the click: note becomes the "Back already?" line with "Register your pet →". Once per page view. | opacity .6 → 1, translateY(8px) → 0, 250 ms. The 5 s is a wait, not an animation. |
| M6 | From Ko-fi | With ?from=kofi a cream band appears above the block. It does not take focus or scroll the page. Close removes it for the visit. | opacity .6 → 1, translateY(8px) → 0, 250 ms; close instant. |
| M7 | "see what is in it ↓" | Scrolls to the dark card with the contents, price and button. | Browser smooth scroll; reduced motion: auto. |
| None | Price and lists | The price does not count up and the button does not pulse. All text is there at rest. | none |

## 04 · Design triggers, the honest kind

Every one persuades by telling the reader something true and specific. Pin numbers match the wireframe.

| Pin | Trigger | On the block | Why it works | Status |
| --- | --- | --- | --- | --- |
| 1 | Free first | "Four ways to get turned back at a border with your dog." All four, in full, above the price. | Giving away the most useful part shows the quality of the rest. | Live |
| 2 | Specific contents | The rows of "In the guide": 96 hours, a window that shuts a day early. | A reader can tell whether their trip is in there. | Live |
| 3 | A named author who did the trips | "By Nancy Carleton, with Magnus Waffles", "Samoyed · 35 kg". | A person with a large dog and a car, not a content team. | New |
| 4 | The actual dog, in a real photo | Magnus, "Photo: Jay Carleton", linked to the story. | Readers have met him in the stories. | Live |
| 5 | Proof you can check | "Open his passport →" and the country count worked out from his page. | One click shows the trips happened. | Live |
| 6 | The rule it follows | Commission Delegated Regulation (EU) 2026/131, last checked [date]. | Names the law the advice is anchored to. | Needs Nancy |
| 7 | Price early, and again on the button | "PDF · €9 · on Ko-fi" under the headline; "Get the guide · €9". | Nobody scrolls to the end to find out it costs money. | Needs Nancy |
| 8 | What you get, exactly | "PDF · v1.0 · [page count] pages". | Answers "what is this" before it is asked. | Needs Nancy |
| 9 | What happens after paying | Where you pay, what arrives and where. | Uncertainty at the last step is where people stop. | Needs Nancy |
| 10 | Freshness | Version and last-checked date. | Pet rules changed this year; a date shows the guide noticed. | Needs Nancy |
| 11 | Limits said plainly | "Not legal or veterinary advice. Your vet has the final word." | Saying what it is not makes the rest believable. | Live |
| 12 | One filled button | "Get the guide · €9"; everything else is a text link. | One obvious next step. | New |
| 13 | The same words at every door | Doors A, B and C use the block's own lines. | The page they land on is the page they were promised. | New |
| 14 | Look inside | Slot for two real pages of the PDF. | The strongest honest proof, once the pages exist. | Coming soon |
| 15 | Refund line | Only if Nancy writes one. | Only true if she offers it. | Needs Nancy |

Left out on purpose:

- **Countdowns and "price goes up Friday".** There is no deadline, and inventing one would be the first lie on a page about following rules.
- **"Only a few left".** It is a PDF. There are always a few left.
- **Buyer counts, "most popular", star ratings.** There are no sales yet to count, and Ko-fi's numbers stay on Ko-fi until there is something true to say.
- **Testimonials and review quotes.** None exist. If buyers later write in, Nancy can ask to quote them by name.
- **A crossed-out higher price.** The guide has only ever been €9.
- **Exit pop-ups and a buy bar that follows the reader down the page.** The button already sits right under what it buys, and a friend who recommends a book does not follow you to the register.
- **Pre-ticked extras at checkout.** Ko-fi checkout gets one item.

## 05 · What to measure

Events only send after a reader accepts analytics, so every number is a floor. Ko-fi's own sales count is the real figure, read by hand.

| Event | Status | When and params |
| --- | --- | --- |
| `guide_purchase_click` | Planned, not built | Any "Get the guide · €9" click. `placement` (paw_guide_block, home_ch04), `entry` (story_end, pet_page, direct: the door used this visit), `value` 9, `currency` EUR. The footer sends `guide_checkout_click` for the same click today; keep one name. |
| `kofi_click` | Live | Any Ko-fi link, including the /support tip jar. Add `link_url` to tell guide clicks from tips. The same click also sends `revenue_click` from the division layer, so never add these together. |
| `guide_teaser_click` | Proposed | Door A or B click. `placement`, `story` (slug, door A only). |
| `guide_block_view` | Proposed | Half the #guide block on screen, once per page view. The denominator for the click rate. |
| `guide_return` | Proposed | /the-paw-passport loaded with ?from=kofi. A floor for completed purchases. |
| Ko-fi sales | By hand | Ko-fi dashboard, weekly. Not an event. |

Funnel: door click → block seen → buy click → Ko-fi sale → came back (then registrations on /my-pets).

The two numbers worth watching are buy clicks divided by block views, which says whether the block explains itself, and Ko-fi sales divided by buy clicks, which says whether the Ko-fi page keeps the promise. There is no baseline yet, so no target is set here; a month of real numbers will say more than a guess.

## 06 · Nancy decides

1. **The Ko-fi product link.** A ko-fi.com/s/ address, not the profile. Until then the button points at KOFI URL FROM NANCY.
2. **The price and the tax line.** €9 is the figure given; it sits in one place in the code. Whether to show "incl. 25% moms" is hers.
3. **The regulation.** The brief allows Regulation (EU) No 576/2013. The repo's pet notes (docs/notes-2026-10-31/linkedin-pet-posts.md, citing [EUR-Lex](https://eur-lex.europa.eu/eli/reg_del/2026/131/oj)) and the prepared tll-pet-passport-v1.js say Commission Delegated Regulation (EU) 2026/131 replaced it from 22 April 2026, so the block cites 2026/131 and links to it. The live page names neither regulation yet. Confirm, and give the date the guide was last checked against it.
4. **Facts about the PDF.** Page count, and whether "free updates when the rules change" (in the prepared code) is a promise she wants to make.
5. **Delivery and the way back.** Confirm Ko-fi emails the PDF as well as offering the download, and that the shop item's thank-you message can carry the ?from=kofi link.
6. **A refund line.** Only if she wants one.
7. **Magnus's country count.** Once the site's scripts run, every page agrees on 15: his page, the example card, the guide intro and home. The block counts the same list from his page. The Webflow HTML underneath still says 12 on his page (with a different list that includes Montenegro), 3 on the example card and 13 in the guide intro, and that older version is what search engines and readers without scripts see. Worth fixing at the source.
8. **One event name.** `guide_purchase_click` (planned) or `guide_checkout_click` (live).
9. **Which stories get door A.** The two listed are the border trips I could confirm Magnus was on.
10. **The photo.** The block uses the hero of "Even Brave Boys Get Scared" (Photo: Jay Carleton). A border photo of him would suit the guide better if one exists.
11. **Two pages for "look inside".** Optional, and the most useful thing missing.
