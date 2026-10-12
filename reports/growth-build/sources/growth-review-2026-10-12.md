> Source: Claude Docs (Artifact) https://claude.ai/artifact/9Pz5VxkHoecfu4p9u6bEKk (Claude Docs id 43fea5c4-345c-4388-b404-2d0dce3cb8b3, tab e578da59-596f, rev 14). Title: "TLL growth review: readers, writers and revenue". Dated 12 Oct 2026. Exported read-only as markdown on 2026-10-12.

# TLL growth review: readers, writers and revenue

Oct 12, 2026 · @Nancy

## Summary

TLL has the product of a community and the traction of a personal blog: one writer, one pet, nine stories, and no live way to earn money. The site now promises a lot (passport, map, lists, Layover Wrapped, expat desks, press desk, awards), but the three things you want a first-time visitor to grasp are still not obvious, and the paths that would bring in writers, readers and revenue are either blocked or not built yet \[1\].

The good news is that the fixes are mostly subtractive or small, and the evidence points the same way on all five questions: show real stories first, ask fewer things of people, ask specific people for specific things, and turn on the money rails that need no traffic.

**The five moves that matter most**

1. **Make the three pillars impossible to miss.** "Free" appears once on the home page, in small type. Expat resources do not appear on the home page at all, and /for-expats has no moving guides, visa trackers or hubs; its main FIND button links to nothing \[1\]. Put all three pillars in the hero area and build a small, real expat hub before promoting it.
2. **Let people write before they sign up, and cut the story form by two-thirds.** /submit puts a login wall in front of the form, then asks for roughly 30 fields while saying "About 10 fields total" \[1\]. Usability research is consistent: ask for an account at the point of commitment, and every field removed raises completion \[5\]\[8\].
3. **Recruit the first ten writers by name, not by form.** Online communities follow a 90-9-1 pattern: most members only read \[12\]. Direct, specific asks to named people work better than open calls \[13\]. A monthly prompt with a deadline turns asks into a habit \[13\]\[14\].
4. **Publish answer pages that only TLL can write.** Google now rewards first-hand experience and small independent sites with original content \[22\]\[26\], while generic "things to do" travel content lost ground after the 2023 to 2024 updates \[25\]\[27\]. Layover guides by airport and EU pet travel with Magnus are the clearest wins.
5. **Switch on revenue that needs no traffic.** Contextual travel affiliates (eSIM, nomad insurance, tours) have no traffic minimum \[48\]\[49\]\[51\]\[52\], the Paw Passport guide is written but cannot be bought \[1\], and Ko-fi tips cost nothing to start \[55\]. Display ads come last: the useful networks need traffic TLL does not have yet \[61\]\[63\].

One fix sits under all five: the numbers. The footer says 6 stories while the home page shows nine; the sign-up page says 4 stories, 9 countries and 1 traveler; the passport counter reads "0/2490 of 249" \[1\]. Readers, writers and advertisers all use numbers to judge trust, so one source of truth comes first.

## Scope, method and gaps

This review builds on the page-by-page site review of 9 October 2026 \[2\] rather than repeating it. That review covers layout, placeholders, story templates and legal pages in detail; this one asks a different question: what stands between TLL and more writers, more readers and real revenue.

**What was checked on 12 October 2026 \[1\]:** the home page (rebuilt since 9 October into seven chapters), /submit, /signup, /for-expats, /travelers, /the-paw-passport, one story page (La Paz), robots.txt and the sitemap (69 URLs).

**Research method (STORM).** Three independent research passes covered contributors and readers, UX and technical best practice, and monetization. Each claim draws on primary sources where possible (Google Search Central, W3C, web.dev, EU law, Nielsen Norman Group, peer-reviewed community research, program terms pages). No Wikipedia. Figures from vendors, platforms describing themselves, or affiliate blogs are marked **\[weak\]** or **\[self-reported\]**.

**Gaps**

- **No traffic data.** The Supermetrics connection to Google Analytics is on an expired trial, so audience size, countries and top pages are unknown. Several money thresholds below depend on them. It also showed two GA4 properties named That Layover Life, one grouped under Lub Bub, which may mean visits are split or double-counted (this ties to the open item of confirming G-T1K83PRL1R).
- Nothing behind login was reviewed, and no form was submitted.
- Pages were read as text, not rendered, so a few states (search and newsletter messages on the home page) may be hidden states rather than visible copy. They are flagged as "check visually."
- Some program terms could not be read at the source: GetYourGuide's partner site, Kit's sponsor network and Ko-fi's Gold price. These are marked unverified.
- Legal points (DSA, EAA, VAT, disclosure) are research, not legal advice.

## 1. UX: does a first-time visitor get it?

Partly. The new home page explains the map and passport well, but a visitor still has to scroll to Chapter 02 to learn it is free and will never learn about expat resources at all. The test from Nielsen Norman Group is simple: a new or little-known site should say what it does in one line, show real content, and surface its one to four main tasks on the first screen \[3\]\[4\].

**How the three pillars land today \[1\]**

| Pillar | Where it shows on the home page | Verdict | Fix |
| --- | --- | --- | --- |
| 1. 100% free, no paywall, no card | One small "Free to join" note inside Chapter 02 | Weak | Put "Free, forever. No card, no paywall." (already on /signup) in the hero, under the headline |
| 2. Profile + stories + interactive map | Hero buttons, Chapters 02 to 05 with five clear feature cards | Strongest | Show a live demo map (yours) beside the copy, not a counter |
| 3. Localized expat resources | Not on the home page. A footer link only | Missing | Build a small real hub first (see below), then give it a hero button and a chapter |

**What works**

- The hero is clean: one photo, one headline, "Trips that can't wait for payday." now sits right under it.
- Chapter 04 is the best explanation of the product so far: map, lists, pets, a public page you control, and a yearly recap (Layover Wrapped).
- Google sign-in exists on /signup, and the sign-up form is three fields \[1\].
- The submission form already handles disclosure properly: sponsorship, affiliate and comped labels, with rel="sponsored" on links \[1\]. That is a real asset for monetization later.
- The "Link to it" path lets someone add a story they already published elsewhere in five fields \[1\]. It is the lowest-friction contribution on the site and is currently hidden behind the login wall.

**What is in the way (highest impact first)**

1. **Expat pillar is a promise with no product.** /for-expats has no moving guides, visa trackers or lifestyle hubs. The "FIND" button links to "#", "ALL COUNTRIES BY FLAG" goes to Stories, four "DESK OPEN" cards and an empty group list fill the page, and /travelers lists one person and a dog \[1\]. Promoting this pillar now would send new visitors to the emptiest pages on the site.
2. **Contributing has a login wall and about 30 fields.** /submit asks people to sign in before they can type. Then it asks for country, city, date, headline, excerpt, body, region, reading time, up to three themes, three sensory anchors, pet tags, pull quote, reader question, sign-off, 5 to 10 hashtags, sponsorship, companions, shout-outs, byline type, website, Instagram, syndication and date-display choices, hero image, gallery and consent, under a line that says "About 10 fields total" \[1\]. Region and reading time can be computed from country and word count. Login walls before value cost sign-ups \[5\], and in ecommerce 18% of shoppers abandoned a checkout because they were forced to create an account \[74\] (used here by analogy).
3. **The numbers disagree.** Footer: 6 stories, 87 countries, 1 pet. Home shelf: nine stories. /signup: 1 traveler, 9 countries, 4 stories. Passport counter: "0/2490 of 249" \[1\]. The 9 October review found the same problem across 20 pages \[2\].
4. **Age rule conflicts.** /signup asks "I am 13 or older"; /for-expats and your stated rule say 16+ \[1\]. Pick one and use it everywhere, including the terms and privacy pages.
5. **Hated phrases are back on the home page.** The hero subhead says "real names" and Chapter 01 is titled "The shelf." Both are on your do-not-use list.
6. **Placeholder and default text is visible.** On story pages: "No items found." four times (Webflow's default empty state), "Reserved; off until the reader threshold" in the ad slot, and blank Trip and Last updated rows. On /signup: Webflow's stock "Thank you! Your submission has been received!" and "Oops! Something went wrong" messages, plus a "Pre-launch" label \[1\].
7. **Four hero buttons compete.** "Read the stories", "Send your trip", "Send a photo" and "Build your map" have equal weight. Keep two in the hero (read, build your map) and move the two contribution actions to Chapter 02, where the case for them is made.
8. **Check visually:** the home search box appears next to newsletter confirmation and error text ("That did not go through"), which reads as signup copy. The 9 October review saw the same mix-up \[1\]\[2\].
9. **Disclosure accuracy.** The La Paz story opens with "This story was hosted. The travel was paid for by the host." If that trip was not hosted, it is a template default and should come off; if it was, the Sponsored by line is missing \[1\].

**Recommended home page order**

1. Hero: headline, tagline, the free line, two buttons (Read the stories, Build your free map).
2. A three-up "What you get, free" strip: Stories / Your map and passport / Expat guides. Each card links to a real page.
3. Latest stories (newest first, fixed order, not "the shelf").
4. Your map, shown with your real data as the example.
5. Write for TLL: the case, the monthly prompt, two buttons (Write it here / Link a story you already published).
6. Expat hub teaser (only once the hub exists).
7. Paw Passport and the guide, with a working buy button.
8. Newsletter.

Photos stay the lead visual throughout, which fits the Readymag direction: the 9 October review covers the visual system in depth \[2\].

## 2. Getting contributors

The fastest route to a second, third and tenth writer is personal asks plus a much lighter form, not more recruitment pages. TLL already has four recruitment pages (/for-expats, /for-press, /for-affiliates, /travelers) and zero recruited writers \[1\].

**Why open calls alone will not work.** In most online communities about 90% of people only read, 9% contribute now and then, and 1% create most of the content. Good design can soften that to something like 80-16-4, but not remove it \[12\]. At TLL's size that means one or two regular writers for every hundred members, so writers have to be recruited, not waited for.

**Tactics, ranked for TLL**

| Tactic | What the evidence says | Effort | What it looks like on TLL |
| --- | --- | --- | --- |
| Ask named people for one specific story | Requests to named individuals, matched to their experience, and simple asks get more compliance than broadcast calls; asks from a respected member work better \[13\] | Low | A personal note from you: "You did Georgia. Give us 400 words on the worst layover of your life." Start with 10 people you know have a story |
| Monthly themed prompt with a hard close date | Specific, challenging goals raise contribution, and deadlines create a burst near the cutoff \[13\]; a field experiment found goals and telling people their contribution is unique both raised participation \[14\] | Low | "Layover Confessions, closes 30 November." One theme a month, announced on the home page, newsletter and Instagram |
| Cut the form to three short steps, no blank page | Each field removed should raise completion; keep optional fields to one or two \[8\]; show essentials first, reveal the rest on request \[6\]; one question per page with a clear Continue works for longer flows \[9\]; in-context hints beat upfront tutorials \[73\] | Medium | Step 1 place and date. Step 2 headline, story, one photo. Step 3 byline and consent. Everything else under "More options" or filled by the editor |
| Let people write first, sign up at the end | Ask for an account at the point of commitment, not before \[5\] | Medium | Draft saves in the browser; "Send it to the editor" opens sign-up with Google |
| Promote "Link a story you already published" | Participation should be a side effect of normal use \[12\] | Low | Creators with Instagram reels, TikToks or blogs add a card in five fields. Already built, just hidden |
| Turn passport stamps into story seeds | Same principle; Polarsteps builds content from tracking (25M+ trips, self-reported) \[21\] | Medium | Stamping a country prompts "Add a 50-word memory." Memories surface on country pages and can grow into stories |
| Edit lightly and reply personally to every first submission | Harsh rejection of newcomers drove Wikipedia's retention decline \[15\]; Medium tells editors not to make major changes without the writer \[16\]; Atlas Obscura editors contact contributors when they need more details or photos \[19\] | Ongoing | A revision request instead of a rejection. Your 48-hour promise is already the right instinct |
| Recognition: bylines, author pages, badges, "Featured" | Status and privileges motivate without inviting gaming; badges steer effort as people near a threshold; leaderboards can put off non-competitive members \[13\]\[17\] | Low to medium | Badges such as First Story, 10 Countries, Featured. No public leaderboard |
| Publish a one-page "What we want" | Matador asks for a story with a fresh angle and first-hand experience, not a diary \[18\] | Low | "Not a diary. A confession with a lesson." Three examples from the library |
| One quarterly contest with one meaningful prize | Small per-story payments can reduce contributions to tasks people already enjoy; larger rewards raise them \[13\]. The Bradt and Wanderlust contest uses one theme, 600 to 800 words and one big prize \[20\] | Medium | A partner-donated lounge pass or a paid commission, judged on quality. Skip small per-story fees |
| Make writing social | Contact with other contributors and commitment to the group raise output \[13\] | Medium | A monthly coffee write-along in Copenhagen; an online version for everyone else |

**Three things to do with what you already have**

- **Upload the freelance stories you paid for through TBC's Upwork.** You decided these are TLL's to run. They take the library past ten stories and show readers more than one byline.
- **Recruit one real Location Expert per pillar city before showing any "desk."** Remove the four empty desks until a person sits at one \[1\]\[7\].
- **Fold /for-affiliates into the creator path.** Creators with affiliate links are welcome under the disclosure rules already in the submit form; a separate page with no terms reads as unfinished \[2\].

## 3. Best practices checklist

TLL is ahead on disclosure and consent design and behind on the duties that come with hosting other people's content. The table covers what matters most for a free community magazine in the EU; layout and typography practice is in the 9 October review \[2\].

| Area | Practice | Source | TLL now | Action |
| --- | --- | --- | --- | --- |
| Accessibility | WCAG 2.2 AA, including targets of at least 24x24px, focus not hidden by sticky elements, and no drag-only controls | \[10\] | Many targets under 32px; map relies on drag with a keyboard pin list as backup \[2\] | Raise small targets; keep the pin list |
| Accessibility | Login must not depend on memory tests; email links and Google sign-in qualify; codes must be pasteable | \[11\] | Password plus Google \[1\] | Add passwordless email link if Memberstack supports it on your plan |
| Accessibility | European Accessibility Act covers consumer e-commerce services since 28 June 2025; microenterprises (fewer than 10 people, turnover of EUR 2M or less) are exempt | \[47\] | Likely exempt and possibly out of scope | Aim for WCAG 2.2 AA anyway |
| Performance | LCP 2.5s or less, INP 200ms or less, CLS 0.1 or less, at the 75th percentile, mobile and desktop separately | \[37\] | No field data; heavy images and a story hero marked lazy \[2\] | Connect Search Console to get real Core Web Vitals |
| Performance | Never lazy-load the top image; Webflow now lazy-loads new images by default | \[38\] | Story heroes lazy \[2\] | Set hero images to Eager |
| Performance | Webflow builds responsive variants only for images in Assets or CMS image fields, not rich text or backgrounds | \[39\] | Story galleries and body images likely affected | Compress before upload; prefer CMS image fields |
| SEO | Article markup with author linked to a profile page; ProfilePage markup for member profiles | \[24\]\[23\] | Story pages report og:type "website" \[1\] | Set og:type article; confirm Article and ProfilePage JSON-LD on every story and profile |
| SEO | FAQ rich results are gone from Google (stopped May 2026) | \[40\]\[41\] | Two FAQ blocks per story \[2\] | Keep one short FAQ for readers; do not build for rich results |
| SEO | Keep account and member-only pages out of the index with noindex, not robots.txt | \[43\] | /profile is in the sitemap; robots.txt only lists the sitemap \[1\] | Remove /profile, empty /collections and /themes, and duplicate layover slugs from the sitemap |
| UGC | Mark member links rel="ugc"; hold or noindex new accounts' posts until trusted; offer reporting and an abuse policy | \[42\]\[43\] | Affiliate links use rel="sponsored" \[1\]; reporting exists on profiles \[2\] | Add rel="ugc" to member website links; keep human review before publishing |
| Trust and safety | DSA duties for any hosting platform: a contact point, moderation rules in the terms, a way to report illegal content, and a stated reason when content is removed. Micro and small platforms are exempt from the heavier duties | \[45\]\[46\] | Partly there | Add "Report this story" on stories, and a removal-reason email template |
| Privacy | Layered privacy notice at the point of collection; data requests answered within one month; breaches reported to Datatilsynet within 72 hours where feasible | \[44\]\[75\] | Privacy page has a summary; reply times conflict (14 vs 30 days) \[2\] | One reply standard; processor agreements with Webflow, Memberstack and analytics |
| Privacy | Never expose members' locations; strip GPS data from photos | \[44\] (weak secondary sources for EXIF) | Your rule already says never show whereabouts | Confirm Webflow or an upload step strips EXIF |
| Cookies | Rejecting as easy as accepting, per-purpose consent, no tracking before choice | \[69\] | Banner passed this test on 9 October \[2\] | Keep; switch to a TCF-certified tool before any Google ads (section 5) |

## 4. Getting readers

TLL's structural advantage is first-hand experience, which is exactly what search engines now say they reward. The plan is narrow answer pages that only you and your members can write, plus two channels that do not depend on Google: Pinterest and a newsletter with recommendation swaps.

**What changed in search, and why it helps TLL**

- Google's helpful content guidance names "visiting a place" as the kind of first-hand experience it values, and asks pages to show who wrote them, how (original photos) and why \[22\].
- Google said its March 2024 update cut low-quality, unoriginal results by 45% \[25\], and in August 2024 said it is working to surface small independent sites with original content \[26\].
- Generic travel blogs reported traffic falls of 33 to 50% or more after the 2023 and 2024 updates \[27\] **\[weak: affiliate vendor blog, no method\]**. The "top 10 things to do in X" format is the one losing.
- AI answers reduce clicks. In Pew's study of 900 US adults, people clicked a result on 8% of visits with an AI summary versus 15% without, and about 1% clicked a link inside the summary \[29\]. Google says no special files or schema are needed to appear in AI Overviews, only indexable pages with unique, non-commodity content \[28\]. Write pages that answer in the first paragraph, then give what a summary cannot: the story and the photos.

**Content bets, in order**

| Bet | Why it can win | Effort | Notes |
| --- | --- | --- | --- |
| Layover guides by airport ("CPH, 6 hours: what I actually did") | The brand's namesake, first-hand, narrow queries with clear intent | Low per page | The layover pillar has two guide cards and no stories \[2\]. Publish the two draft guides (Copenhagen stopover, EES and ETIAS) with a real "last checked" date first |
| EU pet travel, built on Magnus | Official rules are clear but dry (microchip, rabies vaccine at 12 weeks or older plus 21 days, EU pet passport, tapeworm rules for five countries) \[30\]; TLL adds the border stories | Medium | Feeds the paid Paw Passport guide directly |
| Expat moving guides and visa trackers | High value to your core audience, and pillar 3 | High, ongoing | Launch only with "last verified" dates and links to official sources; start with one country you know (Denmark) |
| Story pages | Brand and community, Discover traffic | Ongoing | Every story needs a byline linked to a profile, original photos and the trip date \[22\] |

**Channels beyond search**

- **Pinterest.** 640M monthly active users in Q2 2026, 157M of them in Europe \[31\]. Pinterest's own data says 72% of travel planners on the platform used it to choose a destination \[32\] **\[self-reported, 2021\]**. One vertical pin per story, made from members' photos.
- **Newsletter with recommendation swaps.** beehiiv's recommendations are free on all plans, and paid recommendations charge a cost per subscriber you set \[33\]. Substack says over 30% of new free subscriptions come from its network \[34\] **\[self-reported, 2022\]**. You currently run Substack; either works for swaps. Add a signup block at the end of every story, where peers place theirs \[2\], and use one name for the newsletter everywhere.
- **Google Discover.** No markup needed; use images at least 1200px wide, allow large image previews, and write accurate titles. Discover traffic swings, so treat it as a bonus \[36\].
- **Reddit and similar forums.** Participate where you have a real interest; if most of your posts link to your own site, Reddit asks you to post them less \[35\]. Answer pet-travel and layover questions properly and link only when TLL is the best answer.

**Housekeeping that unlocks the rest:** connect Google Search Console (it is still not connected for your brands), resolve the two GA4 properties into one, and fix og:type on stories so shares show as articles.

## 5. Making money

TLL earns nothing today because every revenue path is either switched off or unbuilt: the Paw Passport guide's button is disabled, no story carries an affiliate link, there is no tip or supporter prompt, and the ad slot says it is off until a reader threshold \[1\]. At TLL's traffic, nearly all early money will come from affiliates, the guide and supporters. Ads and sponsorships pay only at scale.

**Options ranked by fit now**

| Option | Terms (checked October 2026) | Fit now | Notes |
| --- | --- | --- | --- |
| Travel affiliates via Travelpayouts | One free network covering 90 to 100+ brands, no traffic minimum \[48\] | High | Booking.com through it pays about 4% of booking value \[48\] **\[vendor blog\]** |
| Viator tours | 8% per completed booking, 30-day window, free to join \[49\] | High | Fits story pages with tours |
| GetYourGuide tours | 8%, up to 10% on Originals, 31-day cookie \[50\] | High | **Unverified at source** (partner site would not load) |
| SafetyWing nomad insurance | About 10% of premium, 364-day attribution \[51\] | High | Strong match for nomads and expats |
| Airalo eSIM | 10% via Impact, no stated traffic minimum \[52\] | High | Every layover and expat guide |
| Paw Passport guide (EUR 9) | Ko-fi: 0% on tips, 5% on shop sales on the free plan, plus card fees of roughly 3% + $0.30 \[55\]. Ko-fi is not the merchant of record, so VAT is yours \[56\] | High | Page prices it with 25% Danish moms; confirm EU cross-border VAT handling (OSS) with your accountant, or sell via Gumroad, which handles VAT for 10% + $0.50 \[57\] |
| Ko-fi tips and supporter memberships | Same fee table \[55\] | Medium | A quiet "Buy Magnus a treat" at the end of stories fits the voice |
| Amazon.de packing list | Luggage 4%, Kindle eBooks 5%, most categories 3% \[53\]; 3 qualifying sales in 180 days or the account closes \[54\] | Low now | Join once the packing list has readers; exact disclosure sentence required \[54\] |
| Journey by Mediavine (ads) | 1,000 sessions in 30 days from the US, UK, Canada or Australia only \[61\]\[62\] | Later | EU-heavy traffic may not qualify |
| Google AdSense | No traffic minimum; publisher keeps 80% \[59\]\[60\] | Low | Thin or placeholder pages are a common rejection cause \[59\]; EU ads need a TCF-certified consent tool \[70\] |
| Raptive / Mediavine main program | 25,000 monthly pageviews (Raptive) \[63\]; $5,000+ a year in ad revenue (Mediavine) \[61\] | Later | Revisit at scale |
| Newsletter sponsorships | beehiiv Ad Network has no subscriber minimum on paid plans \[64\]; Substack's new sponsorship program needs 100+ paid subscribers \[65\] | Later | Depends on list size |
| Brand and tourism partnerships | VisitDenmark handles media visits case by case and does not pay travel costs \[66\] | Later | Expect in-kind help first; /for-brands needs audience proof framed on reader quality, not raw traffic |
| Paid memberships (Memberstack) | Basic $29/month plus a 4% transaction fee \[58\] | No | A paywall works against "free, forever"; keep supporters on Ko-fi |

Travel ad revenue figures such as "$8 to $18 per 1,000 pageviews" circulate widely, but they come from ad-tech vendors and assume US traffic **\[weak\]**. At a few thousand pageviews a month, plain AdSense would likely earn a few euros.

**Where the money goes on the site**

- **A reusable "Trip kit" block** at the end of layover guides, expat guides and relevant stories: eSIM, insurance, tours, pet gear. One component, labeled, editor-curated.
- **Contextual links inside stories,** labeled beside the link, using the shout-out system the submit form already has \[1\].
- **The guide,** sold from the Paw Passport page, the pet-travel answer pages and the end of every Magnus story.
- **A small supporter line** in the footer and at the end of stories.

**Compliance must-dos before the first link goes live**

1. Label affiliate links and sponsored content clearly before the reader engages. Danish marketing law requires disclosure of affiliate links and discount codes even without a formal deal, and sponsored content needs a visible label at the top; hashtags alone are not enough \[72\]. EU consumer law requires the same \[67\].
2. For US readers, put the disclosure next to the link; a footer or site-wide page alone is not enough, and "I get commissions for purchases made through links in this post" works where "affiliate link" alone may not \[68\].
3. Get consent before any non-essential tracker, including affiliate pixels; rejecting must be as easy as accepting \[69\].
4. Before any Google ads to EEA visitors, use a Google-certified, TCF-integrated consent tool and follow Google's EU user consent policy \[70\]\[71\].
5. Approve charter rule 08 (how money is kept away from verdicts), which still says "DRAFT" and is where /for-brands sends buyers \[2\].

## Roadmap: now, next, later

The order is trust first, then contribution, then reach, then money at scale. Items marked (site) are in the build prompt below; the rest are yours.

**Now: the next two weeks**

- [ ] (site) One source for every count: stories, countries, travelers, pets. Fix the footer, /signup counters and the garbled passport counter
- [ ] (site) Remove "real names" and "The shelf" from the home page; replace Webflow default form messages and "No items found." with on-voice or hidden states
- [ ] (site) Put the free line and the three pillars in the hero area; cut hero buttons to two
- [ ] (site) Set one age rule (16+) on /signup, terms and privacy
- [ ] (site) Story form: write first, sign up at the end, three steps, "More options" for the rest
- [ ] Decide on the La Paz "hosted" disclosure
- [ ] Make the Paw Passport guide buyable (Ko-fi with VAT checked, or Gumroad)
- [ ] Join Travelpayouts, Airalo, SafetyWing and Viator
- [ ] Write ten personal asks for a first story
- [ ] Merge the two GA4 properties and connect Search Console

**Next: November**

- [ ] (site) "Trip kit" affiliate block with labels, on guides and relevant stories
- [ ] (site) Newsletter signup at the end of every story; one newsletter name everywhere
- [ ] (site) Expat hub MVP: Denmark first, with a moving guide, official links and a "last verified" date
- [ ] (site) Badges and "Featured" on profiles; Article and ProfilePage markup confirmed
- [ ] (site) "Report this story" and a removal-reason template
- [ ] Launch the first monthly prompt (closes 30 November)
- [ ] Verify and publish the Copenhagen stopover and EES/ETIAS guides
- [ ] Upload the Upwork freelance stories
- [ ] Pinterest account with one pin per story

**Later: when the numbers say so**

- [ ] At about 1,000 sessions a month from the US, UK, Canada and Australia: apply to Journey by Mediavine (needs a TCF-certified consent tool first)
- [ ] At about 25,000 pageviews a month: look at Raptive
- [ ] With a list of a few thousand: newsletter sponsorships
- [ ] With audience proof: a media kit for /for-brands and tourism-board pitches
- [ ] Show expat desks and /travelers filters once real people fill them

## The build prompt for Claude Design and Claude Code

Paste the whole block into Claude Design for Phase 1 (the design pass), then paste it into Claude Code with "Run the Implement stage" once you approve the designs. It carries your standing rules so neither session has to rediscover them. A copy is saved in the TLL project as claude/tll-growth-build-prompt-2026-10-12.md.

```markdown
# That Layover Life: growth build (readers, writers, revenue)

You are improving thatlayover.life (Webflow, Memberstack) for its founder, Nancy Carleton.
Work in three stages and stop for approval between each: DESIGN -> EDIT (change log) -> IMPLEMENT.
Judge every screen as three people: a first-time reader, a would-be contributor, an advertiser.
Source review: "TLL growth review: readers, writers and revenue" (12 Oct 2026) and the
9 Oct 2026 editorial design and site review in the TLL project. Read both first.

## Goal
A first-time visitor understands within one screen that TLL is:
1. 100% free to join. No paywall, no credit card.
2. A place to build a profile, publish stories and photos, and get an interactive map of their travels.
3. A source of localized expat resources (moving guides, visa trackers, lifestyle hubs).
...and can start reading, build a map, or contribute in one click.

## Non-negotiables
- Match the Claude Design prototype. Type: Playfair Display 800 headlines, IBM Plex Sans Condensed body,
  JetBrains Mono eyebrows, Syne only in the wordmark. Italic rose accent words in H1s are approved.
- Nav and footer are shared components: propose changes, never apply them without Nancy present.
- Every count binds to tllStates. Never hardcode a number. One source for stories, countries,
  travelers and pets, everywhere (footer, /signup, passport, profiles, country pages).
- Apply the Emil Kowalski design skill, the Taste skill and the Impeccable design skill.
- Copy voice: smartest, best-traveled friend in the group chat who is also a comedy writer.
  Editorial (Vanity Fair), full sentences in body copy; short punchy lines only in headlines,
  buttons and eyebrows. "I" for personal stories, "we" for the platform. Roast only ourselves,
  our decisions and inanimate objects. American English. No travel cliches, no listicle voice.
- Never use: em dashes, "ships"/"ship", "ledger", "No filler", "Truth over polish", "real names",
  "counted by hand", "the shelf"/"on the shelf", or copy that explains the site's machinery.
- Keep these protected lines exactly: "Free to join. We're not a gym.", "Your inbox deserves better
  than deals.", "Send It ->", "Get In ->". Tagline: "Trips that can't wait for payday."
- No visible placeholders: hide any module with no content (no "Open slot", "Coming soon",
  "desk open", "No items found.", "Example text", Webflow default form messages).
- Never expose a member's current location or home city. Visited countries only.
- Sign-up age is 16+ everywhere.
- Any research you do: STORM method (multiple independent primary sources, inline links,
  weak sources flagged). Never Wikipedia.
- Webflow lessons: headless-built pages need the site's "Global Styles" component first and enough
  top padding to clear the fixed nav. Publishing is rate-limited; space publishes about 75s apart.
- Accessibility: WCAG 2.2 AA (24x24px minimum targets, 44px preferred on touch, focus never hidden,
  labels connected to every field, reduced-motion versions of every effect).

## Phase 1: Home page and the three pillars
- Hero: headline, tagline, the line "Free, forever. No card, no paywall.", two buttons only:
  "Read the stories" and "Build your free map".
- Directly under the hero: a three-card "What you get, free" strip (Stories / Your map and passport /
  Expat guides), each linking to a real, populated page. Hide the Expat card until Phase 4 is live.
- Order: hero, pillars strip, latest stories (newest first, fixed order), your map using Nancy's
  data as the live example, Write for TLL (monthly prompt + two buttons: "Write it here" and
  "Link a story you already published"), Paw Passport + guide, newsletter, footer.
- Rename "The shelf" chapter. Remove "real names" from the subhead. Separate search from
  newsletter states so no signup text appears near search.
Acceptance: on 390x844 and 1440x900, the free line, both hero buttons and the top of the first
story row are visible without scrolling or within one scroll.

## Phase 2: Contributor flow (/submit, /signup)
- Anyone can start writing without an account. Drafts save locally; "Send it to the editor"
  opens sign-up (Google first, then email) and then submits.
- Three steps: (1) Country, city or airport, trip month and year. (2) Headline, story, one photo.
  (3) Byline choice and consent. Everything else (pull quote, sign-off, themes, companions,
  shout-outs with affiliate/comped labels, syndication, gallery, hashtags) goes under
  "More options" and is optional. Compute region from country and reading time from word count.
- Make "Link a story you already published" an equal first choice (5 fields).
- Monthly prompt module (theme, one-line brief, close date bound to CMS) on /submit and home.
- Replace every default success/error message with on-voice copy. Remove "Pre-launch".
- Profiles: badges (First Story, 10 Countries, Featured), no public leaderboard.
Acceptance: a new visitor can submit a first story with 7 required inputs or fewer.

## Phase 3: Reader growth
- Story template: newsletter signup block at the end of every story; trip date filled or the row
  hidden; og:type "article"; Article JSON-LD with author linked to the profile (ProfilePage
  JSON-LD on profiles); images at least 1200px wide; hero image set to Eager, others lazy.
- Answer-page template for layover guides and pet travel: question as H1, answer in the first
  paragraph, the first-hand story after, "Last checked [date] by [name]", official source links.
- Add rel="ugc" to member website links. Add "Report this story" to story pages.
- Sitemap: remove /profile, empty /collections and /themes, and duplicate layover slugs.
Acceptance: Rich Results Test passes Article and ProfilePage on a sample story and profile.

## Phase 4: Expat hub MVP
- /expats hub with one complete country first (Denmark): moving guide, visa and residence links
  to official sources, a lifestyle section, and expat groups that actually exist.
- Every guide shows "Last verified [date]" and links each claim to its official source.
- Remove the four empty "desk" cards; show Location Experts only when a real person holds a city.
- Fix the FIND button (currently links to "#").
Acceptance: no empty states visible on /expats or /for-expats to a logged-out visitor.

## Phase 5: Revenue rails
- Reusable "Trip kit" component (CMS-driven): eSIM, insurance, tours, pet gear. Each link
  rel="sponsored", with a plain disclosure next to the links: "We earn a commission if you book
  through these links. It never changes what we recommend." Place it on layover guides, expat
  guides and relevant stories.
- Paw Passport guide: working buy button (Ko-fi or Gumroad URL from Nancy), shown on
  /the-paw-passport, pet answer pages and the end of Magnus stories. Remove "coming soon".
- Small supporter line in the footer and at story ends (Ko-fi tips).
- Remove the visible ad-slot text ("Reserved; off until the reader threshold"). No display ads yet.
- Sponsored or hosted stories: a label at the top of the story and on its card.
Acceptance: every paid link on the site is labeled at the point of use; no tracker loads before consent.

## Deliverables per stage
- DESIGN: artboards for home (desktop + phone), /submit (3 steps + More options), story end
  (newsletter + Trip kit), /expats country page, profile badges.
- EDIT: a change log table (page, element, before, after, reason) for Nancy's approval.
- IMPLEMENT: Webflow changes as drafts, then a publish list. Report anything you could not do.
```

## References

All pages opened during research between 9 and 12 October 2026. Weak or self-reported sources are marked in the text where used.

1. That Layover Life, live site, reviewed 12 October 2026: [home](https://www.thatlayover.life/), [/submit](https://www.thatlayover.life/submit), [/signup](https://www.thatlayover.life/signup), [/for-expats](https://www.thatlayover.life/for-expats), [/travelers](https://www.thatlayover.life/travelers), [/the-paw-passport](https://www.thatlayover.life/the-paw-passport), [La Paz story](https://www.thatlayover.life/stories/la-paz-mexico-whale-sharks), [robots.txt](https://www.thatlayover.life/robots.txt), [sitemap](https://www.thatlayover.life/sitemap.xml)
2. TLL project doc: "Lead with stories, clear the scaffolding", editorial design research and site review, 9 October 2026 (claude/tll-editorial-design-and-site-review-2026-10-09.md)
3. [NN/g, Top 10 Guidelines for Homepage Usability](https://www.nngroup.com/articles/top-ten-guidelines-for-homepage-usability/)
4. [NN/g, The Fold Manifesto](https://www.nngroup.com/articles/page-fold-manifesto/)
5. [NN/g, Login Walls](https://www.nngroup.com/articles/login-walls/)
6. [NN/g, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
7. [NN/g, Designing Empty States](https://www.nngroup.com/articles/empty-state-interface-design/)
8. [NN/g, Website Forms Usability](https://www.nngroup.com/articles/web-form-design/)
9. [GOV.UK Design System, Question pages](https://design-system.service.gov.uk/patterns/question-pages/)
10. [W3C, What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
11. [W3C, Understanding SC 3.3.8 Accessible Authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)
12. [NN/g, Participation Inequality](https://www.nngroup.com/articles/participation-inequality/)
13. [Kraut, Resnick et al., "Encouraging Contribution", from Building Successful Online Communities (MIT Press)](https://collablab.northwestern.edu/CollabolabDistro/nucmc/Kraut10-Contribution-current.pdf); [book page](https://mitpress.mit.edu/9780262528917/building-successful-online-communities/)
14. [Beenen et al., Using Social Psychology to Motivate Contributions to Online Communities, CSCW 2004](https://presnick.people.si.umich.edu/papers/cscw04)
15. [University of Minnesota on Halfaker et al. (2013), Wikipedia newcomer retention](https://cse.umn.edu/college/news/wikipedia-inadvertently-causing-its-own-decline-participation)
16. [Medium, Publications best practices](https://help.medium.com/hc/en-us/articles/41530252213655-Medium-Publications-Best-Practices-and-Guidelines)
17. [Anderson et al., Steering User Behavior with Badges, WWW 2013](https://archives.iw3c2.org/www2013/proceedings/p95.pdf)
18. [Matador Network, pitch guide](https://creators.matadornetwork.com/matador-network-pitch-guide/)
19. [Atlas Obscura, FAQ](https://www.atlasobscura.com/faq)
20. [Wanderlust, Bradt New Travel Writer of the Year](https://www.wanderlustmagazine.com/news/your-chance-to-enter-bradts-new-travel-writer-of-the-year-competition/)
21. [Polarsteps, 25 million tracked trips (August 2026)](https://www.polarsteps.com/news/polarsteps-reaches-25-million-tracked-trips-and-celebrates-the-adventures-behind-the-number) \[self-reported\]
22. [Google Search Central, Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
23. [Google Search Central, ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
24. [Google Search Central, Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
25. [Google, March 2024 core update and spam policies](https://blog.google/products/search/google-search-update-march-2024/)
26. [Google Search Central, August 2024 core update](https://developers.google.com/search/blog/2024/08/august-2024-core-update)
27. Travelpayouts, [Google updates and travel bloggers](https://www.travelpayouts.com/blog/google-updates-2024/) and [HCU: why was I hit](https://www.travelpayouts.com/blog/hcu-and-other-google-updates/) \[weak\]
28. [Google Search Central, AI features and your website](https://developers.google.com/search/docs/appearance/ai-features); [Succeeding in AI search (May 2025)](https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search)
29. [Pew Research Center, Google users are less likely to click on links when an AI summary appears (July 2025)](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)
30. [Your Europe, Travelling with pets](https://europa.eu/youreurope/citizens/travel/carry/animal-plant/index_en.htm)
31. [Pinterest Q2 2026 results, SEC filing](https://www.sec.gov/Archives/edgar/data/0001506293/000150629326000102/q2-26xpressrelease.htm)
32. [Pinterest Business, Help travelers decide their next trip](https://business.pinterest.com/hi/insights/help-travelers-decide-next-trip/) \[self-reported\]
33. [beehiiv, Recommendations FAQ](https://www.beehiiv.com/support/article/14194737991319)
34. [Substack, 1 in 3 new subscriptions (2022)](https://on.substack.com/p/substack-generates-1-in-3-new-subscriptions) \[self-reported\]
35. [Reddit Help, Spam](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam)
36. [Google Search Central, Discover](https://developers.google.com/search/docs/appearance/google-discover)
37. [web.dev, Web Vitals](https://web.dev/articles/vitals)
38. [web.dev, LCP and lazy loading](https://web.dev/articles/lcp-lazy-loading); [Webflow, new images lazy-load by default](https://webflow.com/updates/new-images-set-to-lazy-load-by-default)
39. [Webflow Help, Responsive images](https://help.webflow.com/hc/en-us/articles/33961378697107-Responsive-images)
40. [Google Search Central, FAQPage structured data](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
41. [Search Engine Journal, Google drops FAQ rich results](https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/)
42. [Google Search Central, Qualify outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links)
43. [Google Search Central, Prevent abuse on your site](https://developers.google.com/search/docs/monitor-debug/prevent-abuse); [robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
44. [EDPB, Data protection guide for small business: individuals' rights](https://www.edpb.europa.eu/sme-data-protection-guide/respect-individuals-rights_en); EXIF location risk from secondary sources only: [Flavio Copes](https://flaviocopes.com/exif-metadata-privacy/) \[weak\]
45. [Digital Services Act, Regulation (EU) 2022/2065](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32022R2065); Article 19 read via [Prighter](https://prighter.com/resources/laws/dsa/articles/article-19)
46. [European Commission, The DSA's impact on platforms](https://digital-strategy.ec.europa.eu/en/policies/dsa-impact-platforms)
47. [European Accessibility Act, Directive (EU) 2019/882](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L0882)
48. [Travelpayouts](https://www.travelpayouts.com/en/); [Booking.com rates via Travelpayouts blog](https://travelpayouts.com/blog/?p=22113) \[vendor\]
49. [Viator Partner Resources, affiliate program](https://partnerresources.viator.com/travel-commerce/affiliate/)
50. [Travelpayouts blog, Earn with GetYourGuide](https://www.travelpayouts.com/blog/earn-with-getyourguide/amp/) \[unverified at source\]
51. [SafetyWing, Ambassador program](https://hello.safetywing.com/ambassador-page)
52. [Airalo, Affiliate program FAQ](https://www.airalo.com/blog/airalo-affiliate-program-faqs)
53. [Amazon.de PartnerNet, commission rates](https://partnernet.amazon.de/help/node/topic/GRXPHT8U84RAYDXZ)
54. [Amazon.de PartnerNet, qualifying sales rule](https://partnernet.amazon.de/help/node/topic/G8TW5AE9XL2VX9VM); [operating agreement and disclosure wording](https://partnernet.amazon.de/help/operating/agreement)
55. [Ko-fi Help, Does Ko-fi take a fee?](https://help.ko-fi.com/hc/en-us/articles/360002506494-Does-Ko-fi-take-a-fee)
56. [Ko-fi Help, How tax works on Ko-fi](https://help.ko-fi.com/hc/en-us/articles/10792069957661-How-Tax-Works-on-Ko-fi)
57. [Gumroad, Pricing](https://gumroad.com/pricing)
58. [Memberstack, Pricing](https://www.memberstack.com/pricing)
59. [Google AdSense, Eligibility requirements](https://support.google.com/adsense/answer/9724); [Common approval issues](https://support.google.com/adsense/answer/10015918)
60. [Google AdSense, Revenue share](https://support.google.com/adsense/answer/180195)
61. [Mediavine Help, What does it take to get approved](https://help.mediavine.com/what-does-it-take-to-get-approved-by-mediavine)
62. [Mediavine, Introducing Journey](https://www.mediavine.com/introducing-journey-new-ad-management/)
63. [Raptive Help, How do I apply](https://help.raptive.com/hc/en-us/articles/360032840891-How-do-I-apply-to-Raptive); [Raptive, lower threshold announcement](https://raptive.com/blog/opening-the-door-to-more-creators-who-meet-raptive-quality-standards/)
64. [beehiiv, Ad Network](https://www.beehiiv.com/features/ad-network)
65. [Nieman Lab, Substack launches a sponsorship program (June 2026)](https://www.niemanlab.org/2026/06/substack-is-launching-a-sponsorship-program/)
66. [VisitDenmark, Work with us](https://www.visitdenmark.com/press/work-us)
67. [European Commission, Influencer Legal Hub](https://commission.europa.eu/live-work-travel-eu/consumer-rights-and-complaints/influencer-legal-hub_en)
68. [FTC, Endorsement Guides: What People Are Asking](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)
69. [Datatilsynet and Digitaliseringsstyrelsen, joint cookie guidance (May 2025)](https://cdn.datatilsynet.dk/datatilsynet/Media/638829899950476628/F%C3%A6llesvejledning%20med%20DIGST%20-%20Cookie%20og%20lignende%20teknologier.pdf)
70. [Google AdSense, certified CMP and TCF requirement for the EEA](https://support.google.com/adsense/answer/13554116)
71. [Google, EU user consent policy](https://www.google.com/about/company/user-consent-policy/)
72. [Lovguiden, Skjult reklame og influencere](https://www.lovguiden.dk/praksisoversigt/skjult-reklame-influencer)
73. NN/g, Onboarding tutorials vs contextual help: https://www.nngroup.com/articles/onboarding-tutorials/
74. [Baymard Institute, Cart abandonment rate statistics](https://baymard.com/lists/cart-abandonment-rate) (ecommerce data, used by analogy)
75. [Datatilsynet, Report a breach](https://www.datatilsynet.dk/english/report-a-breach)
