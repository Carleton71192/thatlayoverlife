<!-- Saved read-only on 12 Oct 2026 from the Claude Docs doc "TLL Go-to-Market Plan Q4 2026 to Q1 2027.md" (rev export). Source text as written; not edited. -->

# TLL Go-to-Market Plan: Q4 2026 to Q1 2027

Oct 12, 2026 · @Nancy

## Summary

TLL launches creators first, Copenhagen second and organizers third, with the money rails switched on from day one. The goal Nancy set holds: a working site and 15 real contributors by 18 December 2026. Everything in this plan either serves that number or waits until it is hit.

The verdict: TLL has the product of a community and the traction of a personal blog. The site already does more than most travel magazines (map, passport, pets, Lounge, profiles), but a first-time visitor sees four competing buttons, a counter that reads "0/2490 of 249", and no sign that the expat or press sides exist. Outreach before the fixes would send the first creators to the emptiest pages on the site. So the order is trust, then contributors, then reach, then money at scale.

**The one-line GTM:** a free, signed, dated place for people who travel and people who live abroad to show what they know, paid for by the organizations that need to find them.

**The five moves**

1. **Two weeks of fix-first, before any outreach.** Dead flag links, mismatched counts, dead Ko-fi buttons, the login wall on /submit and the banned words on the home page. Nothing goes out until a stranger can land, understand the three pillars and submit a story without help.
2. **Recruit the 15 contributors by name.** Ten personal asks in week three, a monthly prompt with a hard close date (Layover Confessions, closes 30 November), and the freelance stories already paid for through TBC's Upwork. Open calls come after, not instead.
3. **Make Copenhagen the first complete hub in January.** Seed it from Nancy's own circle, and keep it unannounced until it has a real admin checklist and three opted-in member cards. Expat outreach waits for that, as the social plan already says.
4. **Open the organizer side small, in Q1.** Nordic tourism boards and PR agencies get a free tier once 20 verified creators exist. Creators never pay, and no money ever changes the order of a directory.
5. **Switch on the money that needs no traffic now.** The EUR 9 Paw Passport guide, Ko-fi supporters and a labeled Trip kit block (eSIM, insurance, tours). Ads, sponsorships and paid organizer seats wait for thresholds set out below.

One fix sits under all five: the numbers. TLL has two GA4 properties, no Search Console and an expired Supermetrics trial, so no target in this plan can be measured yet. Fixing that is in week one.

## Where TLL stands today

TLL scores 3.9 out of 10 on launch readiness: strong on product and voice, broken at the doors where creators, readers and money come in. Everything below was checked on the live site on 12 October 2026 \[1\], or is tagged TO CONFIRM when a tool could not measure it.

**Measured**

| Metric | Source | Value | Status |
| --- | --- | --- | --- |
| Pages in sitemap | sitemap.xml \[1\] | 67 URLs | Measured |
| Country flag links that point to the unbound template | /destinations HTML \[1\] | 197 links to /detail\_countries | Measured, blocker |
| Footer guide links | /copenhagen-stopover, /ees-etias-layover \[1\] | Both return 404 | Measured, blocker |
| Dead placeholder links | Home 3, /support 5 (href="#") \[1\] | 8 | Measured, blocker |
| Ko-fi links on /support and /the-paw-passport | Page HTML \[1\] | None | Measured, blocker |
| Story form | /submit \[1\] | Sign-in wall; "About 10 fields total" over about 30 fields | Measured, should-fix |
| Counts on the home page | Home \[1\] | Footer 6 stories; passport "0/2490 of 249" | Measured, blocker |
| Paid-tier line | /faq \[1\] | "A paid tier may add premium features later" | Measured, should-fix |
| GA4 tag on home | Page HTML \[1\] | G-T1K83PRL1R present; two GA4 properties exist \[2\] | TO CONFIRM firing |
| llms.txt | /llms.txt \[1\] | Present, and well written | Measured, a win |
| Mobile performance, LCP, CLS | PageSpeed Insights | API quota exhausted today | TO CONFIRM |
| Domain Rating | Ahrefs | Not available on the current plan | TO CONFIRM |
| Traffic, top pages, countries | GA4 / Search Console | Search Console not connected; Supermetrics trial expired \[2\] | TO REQUEST |
| Members, contributors | Memberstack | Not pulled; footer shows 1 traveler and 1 pet | TO CONFIRM |

**Scorecard** (1 to 10, with the reason)

| Area | Score | Why | Severity |
| --- | --- | --- | --- |
| Product | 7 | Map, passport, pets, Lounge and opt-in profiles already exist; most rivals charge for less | polish |
| Voice and brand | 7 | "Trips that can't wait for payday." and "Free to join. We're not a gym." land; "real names" and "The shelf" are back on the home page | should-fix |
| First-screen clarity | 4 | Four equal hero buttons; free appears once, in small type; expat and press sides live only in the footer | blocker |
| Contributor path | 3 | Sign-in wall before typing, then about 30 fields | blocker |
| Expat side | 2 | /for-expats has placeholder desks and a FIND button that goes nowhere \[3\] | blocker for promotion |
| Creator and press side | 3 | The PR form exists; no board, no verification, no organizers | should-fix |
| Revenue rails | 1 | Every rail is off: no Ko-fi link, no buy button, no affiliates \[2\] | blocker |
| Measurement | 2 | No Search Console, split GA4, no conversion events | blocker |
| Search readiness | 5 | Good llms.txt and dated firsthand stories; noindex pages sit in the sitemap and story cards link to a template path | should-fix |
| Social | 5 | A clear voice and plan on the vision boards \[4\]; cadence not yet running | should-fix |

**What is working, and worth saying out loud.** The voice is distinct: a stranger could pick a TLL line out of a lineup with the logo cropped off. The disclosure system in the submit form (sponsored, affiliate, comped, rel="sponsored") is better than most professional travel sites have. The llms.txt file already tells AI answer engines exactly what TLL is. And the founder has 87 countries, an Emmy, a PR career and a Samoyed with 13 border crossings: four stories no rival can copy.

## Positioning and messaging

TLL sits in a category nobody owns yet: the free, member-written travel magazine where the writers are also the directory. Every rival picks one side. Expat networks charge members and bury answers in forums \[5\]\[29\]. Travel writer associations verify carefully but charge USD 175 to 390 a year and mostly exclude social creators \[7\]\[8\]. Creator link pages show anyone and verify no one. TLL can be the one place that is free, signed, dated and judged on the work.

**The promise:** free forever, written by people who were there, dated so you know it is current, and never showing where anyone is right now.

**One line per audience**

| Audience | What they hear | The proof we show them | The one ask |
| --- | --- | --- | --- |
| Travel creators and bloggers (first priority) | "Your proudest itinerary deserves a better home than a caption." | A byline, a profile that doubles as a media kit, a link back to their own site, a Creator spotlight | Send us the trip you are proudest of |
| Readers who are dreaming, not planning | "Trips that can't wait for payday." | Stories with a place, a date and one true detail, in the writer's own photos | Read the stories, then build your free map |
| Expats (from January) | "The city, from people who actually live there." | A dated admin checklist, opted-in member cards, vetted groups | Switch on "I live abroad" |
| Organizers: tourism boards and PR agencies (from Q1) | "Creators you can trust, with disclosure already done right." | Verified profiles with audience markets, hosted-travel policy and a disclosure pledge | Post an opportunity, free up to three a month |

**Proof points we can use today:** 87 countries; a Regional Emmy and a career in broadcast and PR; Magnus Waffles, 13 countries and four documented border crossings; nine stories with named bylines; a disclosure system already built into the submit form.

**Words we own:** layover, filed, signed, dated, "Free to join. We're not a gym.", "Your inbox deserves better than deals.", "Trips that can't wait for payday.", Send It, Get In.

**Words we never use:** em dashes, any form of the verb that means "to dispatch a product", ledger, "No filler", "Truth over polish", "real names", "the shelf", "counted by hand", wanderlust, hidden gem, bucket list, and anything that explains the site's machinery. "São Paulo" always carries its tilde. Telgea is never recommended.

**The register:** the smartest, best-traveled friend in the group chat who is also a comedy writer. Full sentences in body copy; short punchy lines only in headlines, buttons and eyebrows. On social, a true fact, a dry aside, and something to add to \[4\].

## Who we are for

Four people, in this order of priority. The first one decides whether the other three ever arrive, because a magazine with one writer cannot recruit readers, expats or organizers. The personas below come from Nancy's own answers on 7 October \[4\] and the market research in the community strategy \[3\].

|  | The Proud Itinerary | The Dreamer | The Newcomer | The Media Buyer |
| --- | --- | --- | --- | --- |
| Who | Mid-30s travel creator or personal blogger with money to spend; writes because the trip deserves it | Mid-30s reader who saves trips years before booking them | Expat in their first year abroad, starting with Copenhagen | Creator lead at a Nordic tourism board or travel PR agency |
| Pain | Their best trip lives in a caption that disappears in two days | Travel content is lists written by nobody who went | Answers are buried in Facebook groups full of scams \[3\] | Finding and vetting creators is a top challenge for 56% of destination marketers \[15\] (weak) |
| Trigger | Coming home from a big trip; a monthly prompt with a deadline | A story that makes them want something | Arrival, the CPR and MitID scramble, a lonely winter | A campaign brief or a stopover push with an airline partner |
| What closes them | A personal ask from Nancy, a byline, a link back, a spotlight | One more good story, then a free map | A dated checklist and three real people who say "open to coffee" | Verified creators with audience markets and a disclosure pledge |
| Media diet | Instagram, Threads, Substack and blogs; creator Facebook groups; travel writer associations; TBEX and WITS | Instagram saves, Pinterest, Google, newsletters | Facebook groups, Reddit r/Denmark and r/expats, The Local, InterNations events, Google | LinkedIn, IMM and TravMedia, TBEX, WITS, association associate tiers, word of mouth |
| Where TLL is today | Quiet (Instagram, Nancy's LinkedIn) | Quiet (Instagram); absent on Pinterest | Absent | Absent |

**The presence map in one line:** TLL is quiet where creators gather, absent on Pinterest and in expat channels, and invisible to organizers. That is the order the channel plan fixes them in.

**Who we stop trying to win this quarter:** the casual reader who wants a "top 10 things to do" list. Google already sends that reader to bigger sites, and it lost ground in the 2023 to 2024 updates anyway \[26\].

## Competitive position

No rival is free for individuals, verified, and covering both expats and travel media at once. That gap is TLL's to claim, and it is wide because each rival's business model forces it to one side.

| Rival | Who pays | Who gets in | Where they beat TLL today | Where TLL wins |
| --- | --- | --- | --- | --- |
| [InterNations](https://www.trustpilot.com/review/internations.org?page=7) | Members (paid tier, event fees) | Expats | In-person events in hundreds of cities; volunteer hosts | Free; 2.4 Trustpilot built on billing and spam complaints \[5\] |
| [Expat.com](https://www.expat.com/en/faq.html) | Businesses and ads | Expats | Scale and moderation \[29\] | Dated, signed answers instead of inactive forums |
| [Expatica](https://newsroom.wise.com/en-UKI/267271-wise-acquires-expatica-as-it-deepens-support-for-people-living-internationally/) | Ads, affiliates, EUR 299 directory listings | Readers | Fact-checked guides in 18 countries; owned by Wise since June 2026 \[6\] | Firsthand, person-signed content and a community |
| [Travel Massive](https://www.travelmassive.com/pages/about) | Businesses (USD 89 listings) | Open | Global chapters and industry events \[9\] | A media kit profile, verification and a disclosure system |
| [Press Trip Pros](https://www.producthunt.com/products/press-trip-pros) | Organizers after a trial | "Vetted", criteria unclear | Purpose-built press-trip board, launched 2026 \[10\] | Published criteria; paid assignments for writers who cannot take hosted trips |
| [SATW](https://www.satw.org/associates/) and [BGTW](https://bgtw.org/apply/) | Members (USD 175 to 390 a year) | Established journalists; social media largely excluded \[7\]\[8\] | Prestige and decades of trust | Free, and open to creators the associations turn away |

**SWOT**

| Strengths to press | Weaknesses to close |
| --- | --- |
| A distinct voice; a founder with PR and broadcast credibility; product already built; good disclosure design; llms.txt in place | One writer; broken links and dead revenue rails; no measurement; one person with two days a week of slack |
| **Openings nobody has claimed** | **Threats on the horizon** |
| A free, verified creator directory across all four kinds of travel media; Copenhagen, where Denmark ranks last of 53 countries for making friends \[11\]; an outlet-policy tracker for hosted trips \[32\] | Press Trip Pros grows into the organizer side first; Wise turns Expatica into the default relocation brand; AI answers cut clicks to travel pages \[27\] |

**The position that is ours:** the free, signed and dated travel community, where the people who were there get found by the people who need them. In five words for the hero area: "Free. Signed. Dated. Never sold."

## Launch sequence

Four phases, each opened by a gate rather than a date. A date slipping is fine; skipping a gate is how a community launches to empty rooms.

&#91;embedded content: launch sequence · 4 phases, 3 gates\]

Phase 2 is the one that matters: if the first fifteen arrive, Copenhagen and the organizer side have something to show. If they do not, the fix is more personal asks, not an earlier launch of phase 3 or 4.

## Channel plan

Two channels carry this quarter: Nancy's direct asks and Instagram. Everything else is either cheap to run once it is set up (Pinterest, the newsletter, search) or waits for a gate. The social cadence stays inside the six posts a week Nancy can make across all four brands without resenting it, weekdays only \[4\].

| Channel | Job | Cadence | Starts | Measured by |
| --- | --- | --- | --- | --- |
| Personal asks (email, DM, coffee) | Recruit contributors, then organizers | 10 asks in week 3, then 3 a week | Week 3 | Asks sent, yeses, stories filed |
| Instagram carousels | Creator recruitment and the brand's look | 2 a week (part of the six) | Week 3 | Sends per reach, saves, submissions \[4\] |
| Threads one-liners | Voice and replies; not counted as posts | When they occur | Now | Replies |
| Nancy's LinkedIn | Business-travel angle; monthly "Calls for creators" post | Inside her own posts, 1 a month for TLL | Week 4 | Profile visits, creator replies |
| Monthly prompt | A deadline that turns asks into a habit \[13\] | Monthly, announced on home, newsletter, Instagram | 1 November | Stories received by the close date |
| The Layover Letter (newsletter) | Owned audience; the one channel no algorithm can take | 2 a month | November | Subscribers, opens, replies |
| Pinterest | Reach beyond Google; 640M monthly users, 157M in Europe \[24\] | One vertical pin per story, batch-made | November | Outbound clicks |
| Search and AI answers | Answer pages only TLL can write: layovers by airport, EU pet travel with Magnus \[26\] | 2 answer pages a month | November | Search Console impressions, AI citations |
| Reddit and forums | Answer real pet-travel and layover questions; link only when TLL is the best answer \[33\] | 2 answers a week | December | Referral sessions |
| Copenhagen in person | Seed the expat hub; monthly coffee write-along | Monthly | January | Member cards opted in |
| Organizer channels: IMM, TBEX, WITS, Nordic DMO contacts | Recruit the media-buyer side | Targeted, by name | Q1 2027 | Organizers verified, opportunities posted |
| Facebook | Photo albums cut from the same carousels | With each carousel | Week 4 | None needed |
| YouTube Shorts | Voice-over Shorts, no face needed | Waits | Q1 2027 at the earliest | Views, follows |

**What we deliberately do not do this quarter:** paid ads (the funnel cannot hold spend yet), a TLL Facebook group (Nancy would rather lean on others than moderate one \[4\]), comment-keyword DM automations (pending the Danish consent check), and any new channel before a fixed daily reply block is running.

**Newsletter platform:** Substack today. Its network is the stronger free growth engine for writers \[25\]; beehiiv's ad network matters only at a list size TLL will not reach before spring. Recommendation: stay on Substack until 1,000 subscribers, then revisit. See Decisions.

## Outreach playbook

The 15 contributors come from three pools, worked in order: people Nancy already knows, creators she can name, and the stories TLL already owns. In most communities about 90% of people only read \[12\], and named, specific asks outperform open calls \[13\], so every ask below goes to one person about one story.

**Pool 1: the first ten, by name (week 3).** Nancy writes the list herself: friends and contacts with one specific trip she has heard them tell. Each ask names that trip. Target: 6 yeses, 4 stories filed by 30 November.

**Pool 2: twenty creators (weeks 4 to 8).** Travel creators and bloggers with fewer than 50,000 followers, where a byline still matters. Weight it toward Copenhagen-based and Nordic-focused creators, running creators (the marathon diaries) and pet-travel creators (Magnus), because TLL already has seed stories in all three. Target: 8 yeses, 6 stories.

**Pool 3: what TLL already owns (week 2).** Upload the freelance stories paid for through TBC's Upwork \[2\]. They take the library past ten stories and show readers more than one byline before any stranger is asked to write.

**Organizers (Q1 2027, after 20 verified creators).** Start with the Nordic set: VisitDenmark, Wonderful Copenhagen, Visit Sweden, Visit Norway, Visit Finland and Visit Iceland. VisitDenmark already runs creator work but does not pay for individual press hotel stays \[14\], so lead with the free tier and verified creators, not budgets. Then the partner brands Nancy named: Polar Latitudes, Much Better Adventures, Mr and Mrs Smith, Marriott and Emirates \[4\].

**Scripts** (drafts in Nancy's voice; she edits before sending)

The personal ask, Pool 1:

> You told me the \[TRIP\] story at \[PLACE\] and I have not stopped thinking about it. I am building That Layover Life into a magazine of trips told by the people who took them, and I want yours in it. 400 to 800 words, your photos, your byline, a link to wherever you live online. The first prompt closes 30 November. Want in? (And if you are in Copenhagen, coffee is on me.)

The creator ask, Pool 2:

> Your \[PLACE\] post is the kind of trip people save for three years before booking. We would love it on That Layover Life as a full story: your words, your photos, your byline, and a link straight back to \[THEIR SITE\]. Already published it? Link it in five fields and we do the rest. Free, always, and you keep everything.

The organizer ask, Q1:

> We run That Layover Life, a free community of travel creators, bloggers and writers, every one verified, with audience markets, hosted-travel policy and a disclosure pledge on their profile. Organizers post opportunities free, up to three a month. Would \[ORG\] like to try it on your next creator brief? Happy to walk you through it over coffee in Copenhagen, or a call.

**What every contributor gets beyond a link:** a byline and profile page, a Creator spotlight post on TLL's Instagram and Nancy's LinkedIn (with their yes), a First Story badge, and a place in the creator directory organizers will browse from Q1. That answers the open question on the ICP board \[4\].

**The house rule for creators:** pitch the story, not the trip. TLL never helps anyone ask for a free stay.

## Revenue sequence

Individuals join free and organizations pay; that rule holds at every stage. Early money comes from rails that need no traffic, so they switch on in the first two weeks. Everything else waits for a number, and the number is written down so nobody turns on ads early out of impatience.

| Stage | Turns on | Gate | Terms | Notes |
| --- | --- | --- | --- | --- |
| Now | EUR 9 Paw Passport guide | Working buy link | Ko-fi: 5% on shop sales on the free plan, plus card fees; Ko-fi is not merchant of record \[21\]. Gumroad handles EU VAT for 10% + USD 0.50 \[22\] | Decide Ko-fi or Gumroad (Decisions) |
| Now | Ko-fi supporters ("Keep TLL free") | Ko-fi links live on /support and story ends | 0% on tips \[21\] | One quiet line, never a pop-up |
| Now | Trip kit block: eSIM, insurance, tours | Labeled component on guides and relevant stories | Travelpayouts, no traffic minimum \[18\]; Airalo 10% \[19\]; SafetyWing about 10% of premium \[20\] | Every link labeled at the point of use: "reklamelink" and a plain English line \[16\]\[17\]. Never Telgea |
| Now | Wise referral in each city checklist | Copenhagen hub live | From GBP 10 per personal customer \[31\] | The "Money" step of the admin checklist |
| Next | DMO-sponsored Copenhagen creator meetup | 20 verified creators | Travel Massive's chapter model \[9\] | Entry stays free |
| Next | Labeled "Partners in Copenhagen" block | About 1,000 monthly hub visits | Expatica sells EUR 299 per country per year \[6\] | Start well below that; never inside member cards |
| Later | Featured opportunity posts for organizers | 10 or more organizers posting monthly | ProBlogger and Travel Massive charge USD 80 to 160 \[3\] | Standard posts stay free, up to three a month |
| Later | Organizer annual seat | Free tier proves demand | Under USD 255 a year, below association associate tiers \[3\] | Unlimited posts, filtered search |
| Later | Display ads (Journey by Mediavine) | 1,000 sessions in 30 days from the US, UK, Canada or Australia \[23\] | TCF-certified consent tool first | EU-heavy traffic may not qualify |
| Later | Newsletter sponsorships | A few thousand subscribers | Substack's program needs 100+ paid subscribers \[2\] | City-specific issues sell best |
| Never | Paid ranking, paid member tier, pay-to-list |  |  | Contradicts the promise. Remove the /faq "paid tier may" line |

**What to expect, honestly:** at TLL's current traffic, the first quarter's revenue will be small: a handful of guide sales, a few supporters and the first affiliate cents. That is fine. The point of switching the rails on now is that every page published from November earns from day one, and the site stops promising things it cannot sell. Revenue targets are TO CONFIRM until traffic is measured.

## 90-day calendar

The plan fits around Nancy's real week: Damgaard on Tuesdays and Thursdays, about 16 floating hours for Marcus, weekday-only social, and her best writing in the mornings. We assume about six hours a week for TLL, mostly Monday, Wednesday and Friday mornings (TO CONFIRM with Nancy). Claude Code carries the build work, so her hours go to asks, stories and approvals.

&#91;embedded content: 90-day calendar · 13 Oct 2026 to 10 Jan 2027\]

| Nancy's TLL week | What happens |
| --- | --- |
| Monday morning | Write and schedule the 2 Instagram carousels |
| Wednesday morning | Personal asks and replies to contributors |
| Friday morning | Edit submissions; approve Claude Code's change log; every second Friday, the 20-minute metrics review |
| Every weekday | A 20-minute reply block on social, before anything new |

## Metrics

The north star is **contributors with a published story**: real people, not Nancy, with a byline live on the site. It is the one number that proves the community is real, and every other audience follows it. Target: 15 by 18 December 2026.

| Measure | Day 30 (11 Nov) | Day 60 (11 Dec) | Day 90 (10 Jan) | Source |
| --- | --- | --- | --- | --- |
| Contributors with a published story | 3 | 10 | 15 (hit by 18 Dec) | Webflow CMS |
| Stories submitted (including declined) | 6 | 18 | 30 | Submit form |
| Personal asks sent | 10 | 25 | 40 | Nancy's list |
| Blocker fixes from "Where TLL stands" closed | All | All | All | Change log |
| Members with an opted-in profile | TO CONFIRM baseline | Baseline + 25 | Baseline + 60 | Memberstack |
| Copenhagen member cards opted in | 0 (not open) | 3 (soft) | 10 | Memberstack |
| Layover Letter subscribers | TO CONFIRM baseline | Baseline + 100 | Baseline + 250 | Substack |
| Instagram sends per reach and saves | Baseline set | Beat baseline | Beat baseline | Instagram insights |
| First revenue on each live rail | Guide and Ko-fi live | First sale on each | First affiliate payout | Ko-fi, Travelpayouts |
| Search Console impressions | Connected | Baseline | Up month on month | Search Console |
| Verified creators in the directory | 0 | 10 | 20 (gate for organizers) | Memberstack |

**What we will not report as success:** raw sessions, page views or follower counts on their own. Traffic can be bots or people who will never write, and the plan is judged on whether the right people arrive and contribute. Traffic appears only beside a quality measure (submissions per visit, saves per reach).

**Review rhythm:** a 20-minute look every second Friday, against this table. If contributors are under target at day 60, the fix is more personal asks, not a new channel.

## Decisions Nancy needs to make

Seven decisions block the plan, and four of them block the first two weeks. Each has a recommendation; the call is Nancy's.

| Decision | Recommendation | Why | Needed by |
| --- | --- | --- | --- |
| Paw Passport checkout: Ko-fi or Gumroad | Gumroad for the guide, Ko-fi for supporters | Gumroad handles EU VAT as merchant of record \[22\]; Ko-fi leaves VAT with the seller \[21\] | Week 1 |
| The /faq paid-tier line | Remove it; say members are free for good and supporters are optional | A "may" contradicts "100% free" on every other page | Week 1 |
| The two footer guides (both 404) | Point Copenhagen stopover at /layovers/cph-copenhagen-6h now; pull EES and ETIAS until it is verified and dated | A 404 in every footer costs trust; an unverified entry-rules page costs more | Week 1 |
| Was the La Paz trip hosted | Nancy's answer only | If not, the hosted line is a template default and a false disclosure | Week 1 |
| Newsletter platform | Stay on Substack until 1,000 subscribers | Its network helps writers find readers \[25\]; beehiiv's ad network needs scale TLL does not have yet | November |
| Expat hub launch date | Soft-open in January with 3 real member cards; announce at 10 | An empty directory is worse than none \[2\] | December |
| Organizer side launch | February, once 20 creators are verified | Organizers who arrive to an empty directory do not come back | January |

**Also open, and smaller:** the passport total (195 or 249 places), whether the monthly prompt is called "Layover Confessions", and the first ten names for the personal asks, which only Nancy can write.

## Build sequence and the priority fix prompt

Three build prompts now exist for the same pages (fix-first on 9 October, growth on 12 October, expat and creator on 12 October). Run separately, they would collide on the home page, /for-expats, profiles and the money buttons. From here they run as one sequence, and each stage starts only when the one before it is approved.

| Stage | What it covers | Prompt | Starts |
| --- | --- | --- | --- |
| 0. Priority fixes | Every launch blocker: links, counts, money buttons, the /submit form, the home page's first screen, measurement | The priority fix prompt below | This week |
| 1. Contributor and reader growth | Badges, monthly prompt module, story template, answer-page template, newsletter block, Trip kit | Phases 1 to 3 and 5 of `claude/tll-growth-build-prompt-2026-10-12.md` | After stage 0 is approved |
| 2. Expat layer | Profile fields, filterable directory, Copenhagen City Hub, City Hosts | Phases 1 to 4 of `claude/tll-expat-build-prompt-2026-10-12.md` (its Phase 0 is folded into stage 0) | December build, January launch |
| 3. Creator and press layer | Media-kit profile, verification, opportunity board, organizer free tier | `claude/tll-creator-press-build-prompt-2026-10-12.md` | February |

**Settled overlaps:** the expat hub is one reusable City Hub collection, first item Copenhagen (not a Denmark country page). FAQ blocks stay for readers, but no stage builds FAQPage markup for rich results, which Google dropped in May 2026 \[2\]. Every stage uses the same rules block, so neither session rediscovers them.

**The priority fix prompt.** Below is the short version. The full prompt, with the background for each item, is the one to paste into Claude Code (Webflow and Memberstack connectors on); it is saved in the TLL project as `claude/tll-priority-fix-prompt-2026-10-12.md`.

```markdown
# That Layover Life: priority fix pass before launch outreach (12 October 2026)

## Your job
Fix the items below on thatlayover.life (Webflow + Memberstack) for Nancy Carleton, in priority order. No outreach starts until every BLOCKER is done. Each item was confirmed live on 12 October 2026. Read first, in the TLL project: the GTM plan ("Where TLL stands today", "Two-week plan"), the growth review (12 Oct), the community strategy "Fix first" table, and claude/tll-fix-first-prompt-2026-10-09.md (some items may already be done). Fix only what is listed.

## Working rules
1. Look before you touch; skip anything already fixed and say so.
2. Design, then Edit, then Implement: a change-log table (item, found, proposed before and after, what could break) approved by Nancy before any change.
3. Unpublished edits only; Nancy publishes. Space any publishes about 75s apart.
4. Nav, footer and the "Tell the editor" button: propose only, never change without Nancy present.
5. Every count binds to tllStates; never type a number the site calculates.
6. Remove before you add; no new scripts or add-ons without asking.
7. Never create accounts, enter payment details, submit forms, send messages, or change slugs, legal wording or submitted stories.
8. Emil Kowalski, Taste and Impeccable design skills on any layout work; match TLL Site Prototype 3.0. Type: Playfair Display 800, IBM Plex Sans Condensed, JetBrains Mono eyebrows, Syne only in the wordmark. WCAG 2.2 AA.
9. Judge every page as a first-time reader, a would-be contributor and an advertiser.

## Copy rules
Smartest, best-traveled friend in the group chat who is also a comedy writer; full sentences in body copy; American English. Never: em dashes, "ship" in any form, "ledger", "No filler", "Truth over polish", "real names", "the shelf", "counted by hand". "São Paulo" with the tilde. Never recommend Telgea. Keep exactly: "Free to join. We're not a gym.", "Your inbox deserves better than deals.", "Send It ->", "Get In ->", "Trips that can't wait for payday." Sign-up age 16+.

## Ask Nancy first, in one message
1. Paw Passport checkout: Ko-fi or Gumroad, and the product URL. 2. TLL Ko-fi URL. 3. Footer guides (both 404): build, repoint, or pull? 4. /faq paid-tier line: remove or reword? 5. Was the La Paz trip hosted? 6. Passport total: 195 or 249? 7. Newsletter name: "The Layover Letter"?

## BLOCKERS
1. /destinations: 197 flag links to /detail_countries and story cards to /detail_stories. Rebind to the current CMS item. Done: Denmark, Brazil, France open their own pages; no /detail_ links in published HTML.
2. /for-expats: "ALL COUNTRIES BY FLAG" to /destinations; FIND (href="#") to /travelers with a country filter or hidden; remove the four placeholder desks; remove "Example text"; connect labels. Done: no empty or dead element for a logged-out visitor.
3. href="#": 3 on home, 5 on /support (both Ko-fi buttons); disabled guide button. Wire to the URLs from Decisions 1 and 2, or remove. Done: no href="#" on those pages; both checkouts open.
4. Counts: footer, home passport ("0/2490 of 249"), /signup, profiles, country pages, /pets. Bind all to tllStates (footer: propose). Done: one source, all agree; Nancy 87, Magnus 13.
5. /submit: write first, sign up at the end (Google first); three steps (place and date; headline, story, one photo; byline and consent); the rest under "More options"; compute region and reading time; "Link a story you already published" as an equal first choice; keep disclosure labels and rel="sponsored"; on-voice success and error states; remove "Pre-launch". Done: a first story in 7 or fewer required inputs at desktop and 375px.
6. Home first screen: "Free, forever. No card, no paywall." under the headline; two hero buttons ("Read the stories", "Build your free map"); move the contribution buttons to Chapter 02; remove "real names"; rename "The shelf." (two options) and its interlude caption; separate search from newsletter states. Done: free line and both buttons visible without scrolling at 390x844 and 1440x900.
7. Measurement: confirm G-T1K83PRL1R fires once (head code; Webflow GA4 field empty); report the two GA4 properties; add consent-gated events (story submitted, sign-up, newsletter, Ko-fi click, guide checkout click, affiliate click); prepare the Search Console step for Nancy's click. Done: a one-page note plus events in DebugView.

## SHOULD-FIX
8. Hidden "This story was hosted" and "AD SLOT" text: render only when true via CMS conditional visibility; remove visible ad-slot text; apply Decision 5.
9. "Currently in" becomes "Home base"; never show current location.
10. Strip EXIF GPS on every /share-photos upload, or report options.
11. Footer guides per Decision 3 (Nancy present).
12. /faq per Decision 4.
13. Banned-word sweep site-wide ("ship" on /travelers, /terms, /spotlight); list every line changed.
14. "Sao Paulo" to "São Paulo" in the Pantanal story meta description.
15. Remove the duplicate Fitz Roy og:image on /countries pages; og:type "article" on stories.
16. Sitemap: drop /map-2-preview, /destinations/tanzania, all /collections, /profile.
17. /pillars/*: filter by pillar or noindex.
18. Story hero images Eager.

## Report back
1. Table: item, change, where, how Nancy checks it. 2. Already fixed or could not fix, and why. 3. Everything removed, by name. 4. Yes or no: every BLOCKER done, outreach can start? 5. Anything outside this list: report, do not fix.
```

## Two-week plan

Five deliverables between 13 and 24 October. Week one fixes the leaks; week two switches on the money and loads the first asks. Owners: Nancy, or Claude Code working from the priority fix prompt with Nancy approving.

| Deliverable | Owner | Week | Done looks like |
| --- | --- | --- | --- |
| 1. The Clean Doors pass | Claude Code, Nancy approves | 1 | All seven blockers in the priority fix prompt closed; the report says "outreach can start" |
| 2. The Seven Decisions | Nancy | 1 | Each decision in the table above has an answer, given to Claude Code in one message |
| 3. The Rails | Nancy (sign-ups), Claude Code (wiring) | 2 | Guide buyable, Ko-fi live, Travelpayouts, Airalo, SafetyWing and Viator applications in, each link labeled |
| 4. The Library Lift | Nancy | 2 | The Upwork freelance stories uploaded with their bylines; the library shows more than one writer |
| 5. The Ten | Nancy | 2 | Ten named people on a list, each with their trip, and the first five asks sent; the Layover Confessions prompt drafted to open 1 November |

**Not in these two weeks:** the expat hub, the creator directory, Pinterest and the newsletter relaunch. Each has its slot in the calendar, and starting them now would split the only resource TLL has, which is Nancy's mornings.

- [ ] Clean Doors pass approved and closed
- [ ] Seven Decisions answered
- [ ] Rails live and labeled
- [ ] Library Lift uploaded
- [ ] The Ten listed, first five asks sent

## Three questions

1. If no stranger has filed a story by 30 November, is TLL a community or a beautifully built personal blog, and would you be at peace with the second?
2. Which of the four brands gets your best morning hours this quarter, and are you prepared to let the other three run on minimum while TLL gets them?
3. The site already has a map, a passport, pets, a Lounge, Layover Wrapped, awards and a press desk. Which of those would you switch off tomorrow if it meant the first fifteen writers arrived a month sooner?

## References

Internal sources were read on 12 October 2026; external pages were opened during the research behind the community strategy and the growth review (9 to 12 October 2026). Weak or self-reported sources are marked.

1. That Layover Life, live site, crawled 12 October 2026: [home](https://www.thatlayover.life/), [/destinations](https://www.thatlayover.life/destinations), [/for-expats](https://www.thatlayover.life/for-expats), [/submit](https://www.thatlayover.life/submit), [/support](https://www.thatlayover.life/support), [/the-paw-passport](https://www.thatlayover.life/the-paw-passport), [/faq](https://www.thatlayover.life/faq), [sitemap](https://www.thatlayover.life/sitemap.xml), [llms.txt](https://www.thatlayover.life/llms.txt)
2. [TLL growth review: readers, writers and revenue](https://claude.ai/artifact/9Pz5VxkHoecfu4p9u6bEKk), 12 October 2026
3. [TLL Community Strategy: Expats, Creators and Press](https://claude.ai/artifact/78MdwoNdrbqCdqDoZjSgJM), 12 October 2026
4. [Social Vision Boards](https://claude.ai/artifact/7uY8Pmb3bD3g9ja5xJ4myQ): That Layover Life board, "Who each brand is for", "LinkedIn offers by brand", 7 to 8 October 2026
5. [Trustpilot, InterNations reviews](https://www.trustpilot.com/review/internations.org?page=7)
6. [Wise, Wise acquires Expatica](https://newsroom.wise.com/en-UKI/267271-wise-acquires-expatica-as-it-deepens-support-for-people-living-internationally/); [Expatica, directory listing](https://www.expatica.com/product/directory-listing/)
7. [SATW, Associates](https://www.satw.org/associates/)
8. [BGTW, Apply](https://bgtw.org/apply/)
9. [Travel Massive, About](https://www.travelmassive.com/pages/about); [Work with us](https://travelmassive.com/pages/work-with-us)
10. [Product Hunt, Press Trip Pros](https://www.producthunt.com/products/press-trip-pros)
11. [The Local, Denmark ranked hardest Nordic country for foreigners to settle in](https://www.thelocal.dk/20230711/denmark-ranked-hardest-nordic-country-for-foreigners-to-settle-in) (Expat Insider 2023)
12. [Nielsen Norman Group, Participation Inequality](https://www.nngroup.com/articles/participation-inequality/)
13. [Kraut, Resnick et al., "Encouraging Contribution", Building Successful Online Communities (MIT Press)](https://collablab.northwestern.edu/CollabolabDistro/nucmc/Kraut10-Contribution-current.pdf)
14. [VisitDenmark, Work with us](https://www.visitdenmark.com/press/work-us)
15. [Net Influencer, travel destination marketers survey](https://www.netinfluencer.com/travel-destination-marketers-boost-influencer-budgets-even-as-attribution-gaps-persist-survey-finds/) (vendor survey, weak)
16. [FTC, Disclosures 101 for Social Media Influencers](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers)
17. [Lovguiden, Skjult reklame og influencere](https://www.lovguiden.dk/praksisoversigt/skjult-reklame-influencer)
18. [Travelpayouts](https://www.travelpayouts.com/en/)
19. [Airalo, Affiliate program FAQ](https://www.airalo.com/blog/airalo-affiliate-program-faqs)
20. [SafetyWing, Ambassador program](https://safetywing.com/ambassador)
21. [Ko-fi Help, Does Ko-fi take a fee?](https://help.ko-fi.com/hc/en-us/articles/360002506494-Does-Ko-fi-take-a-fee); [How tax works on Ko-fi](https://help.ko-fi.com/hc/en-us/articles/10792069957661-How-Tax-Works-on-Ko-fi)
22. [Gumroad, Pricing](https://gumroad.com/pricing)
23. [Mediavine, Introducing Journey](https://www.mediavine.com/introducing-journey-new-ad-management/)
24. [Pinterest Q2 2026 results, SEC filing](https://www.sec.gov/Archives/edgar/data/0001506293/000150629326000102/q2-26xpressrelease.htm)
25. [Substack, 1 in 3 new subscriptions come from the network](https://on.substack.com/p/substack-generates-1-in-3-new-subscriptions) (self-reported, 2022); [beehiiv, Recommendations](https://www.beehiiv.com/support/article/14194737991319)
26. [Google Search Central, Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content); [Google, March 2024 core update](https://blog.google/products/search/google-search-update-march-2024/)
27. [Pew Research Center, Google users are less likely to click on links when an AI summary appears](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)
28. [Muck Rack, Journalist criteria](https://www.muckrack.com/criteria) (background for the competitive set)
29. [Expat.com, FAQ](https://www.expat.com/en/faq.html)
30. [Nomads.com](https://nomads.com/) (background for the competitive set)
31. [Wise, Affiliate onboarding guide](https://wise.com/gb/blog/affiliate-onboarding-guide)
32. [Travel Writing, Should we be paying our own way?](https://travelwriting.substack.com/p/should-we-be-paying-our-own-way-as)
33. [Reddit Help, Spam](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam)

Tools that could not measure on 12 October: PageSpeed Insights (daily API quota exhausted) and Ahrefs Domain Rating (not on the current plan). Both figures are TO CONFIRM.
