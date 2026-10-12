<!-- Saved read-only on 12 Oct 2026 from the Claude Docs doc "TLL Community Strategy Expats, Creators and Press.md" (rev export). Source text as written; not edited. -->

# TLL Community Strategy: Expats, Creators and Press

Oct 12, 2026 · @Nancy

## Summary

TLL should become the free, independent, member-written place where people who live abroad, and people who travel for a living, show what they know and get found by the right people. Nobody in either market does this today. InterNations charges for access and carries a 2.4 Trustpilot score built on billing and spam complaints ([Trustpilot](https://www.trustpilot.com/review/internations.org?page=7)). Expatica now belongs to Wise ([Wise](https://newsroom.wise.com/en-UKI/267271-wise-acquires-expatica-as-it-deepens-support-for-people-living-internationally/)). The travel writer associations verify carefully but charge USD 175 to 390 a year and mostly exclude social creators ([SATW](https://www.satw.org/associates/), [BGTW](https://bgtw.org/apply/)).

The good news from the site review is that most of the plumbing already exists: opt-in profiles, social link fields, "Open to" toggles, a PR trip form, a relay instead of DMs. What is missing is content, filters, a few privacy fixes and one city that actually works end to end.

The same lesson runs through both audiences: individuals join free, organizations pay. Expats and creators never pay to be listed or ranked. Relocation partners, tourism boards and PR agencies pay for clearly labeled placements next to the free listings, never inside them.

**The five moves to make first**

1. Fix the broken country-flag links and the other live bugs below, so the hubs have somewhere to point.
2. Make Copenhagen the first complete expat hub. Denmark ranked last of 53 countries for making friends in the 2023 Expat Insider survey ([The Local](https://www.thelocal.dk/20230711/denmark-ranked-hardest-nordic-country-for-foreigners-to-settle-in)), you live there, and five existing stories already fit it.
3. Add the missing profile fields (years there, places I know, interests, open to coffee) and replace "Currently in" with "Home base" everywhere.
4. Turn the PR form on /for-press into a visible opportunity board for verified press, with support levels that include paid assignments for writers whose outlets ban hosted travel.
5. Wire the money already promised in copy: the Ko-fi buttons and the EUR 9 Paw Passport checkout are both dead links today.

## Fix first

Every flag on /destinations links to /detail\_countries, so all 200+ countries land on the same dead page. That path is Webflow's template placeholder: the link is set to a Collection page but is not bound to the current item. The story cards on the same page do the same thing with /detail\_stories. The country pages themselves load correctly (/countries/denmark, /countries/brazil and /countries/france were all checked on Oct 12). Only the links into them are broken.

| Issue | Where | Fix |
| --- | --- | --- |
| All country flags link to /detail\_countries | /destinations, "Every country · by flag" | Rebind each flag link to the current Countries item inside its Collection List |
| Story cards link to /detail\_stories | /destinations featured cards | Rebind to the current Stories item |
| "ALL COUNTRIES BY FLAG" goes to /stories; FIND button is `#` | /for-expats | Point to /destinations; wire FIND to the directory with a country filter |
| Footer "Guides" links return 404 | /ees-etias-layover, /copenhagen-stopover (sitewide footer) | Build both pages, or point the second at /layovers/cph-copenhagen-6h. Footer changes need you present |
| Profile says "Currently in Copenhagen" | /contributors/nancy-carleton | Rename to "Home base"; never show live location |
| Named photo uploads keep GPS data | /share-photos | Strip EXIF location on every upload, not only anonymous ones |
| Ko-fi buttons are `href="#"` | /support#layover-club | Link to the TLL Ko-fi page |
| EUR 9 Paw Passport guide has no buy link | /the-paw-passport | Add the Ko-fi product link |
| Hidden "This story was hosted" and "AD SLOT" text sits in every story's HTML | All /stories pages | Render only when true; AI crawlers read hidden text and may call every story sponsored |
| Counts disagree (footer 6 stories, /destinations "five", profile 0, 10 live; Magnus 22 vs 13 countries) | Footer, /destinations, profile, /pets | Bind every count to tllStates |
| Banned word appears | /travelers, /terms, /spotlight | Rewrite those lines |
| "Sao Paulo" without the tilde | Meta description, /stories/pantanal-glimmers-in-the-wild | São Paulo |
| Every country page carries a second og:image of Fitz Roy | All /countries pages | Remove the duplicate tag |
| Noindex pages listed in the sitemap | /map-2-preview, /destinations/tanzania, all /collections | Drop them from the sitemap |
| Pillar pages all list the same stories | /pillars/\* | Filter by pillar, or noindex until they do |

Source: a crawl of all 62 sitemap URLs plus 23 linked or guessed URLs on Oct 12, 2026.

## Part 1: Expats

TLL wins expats by being the free, searchable, person-signed version of what Facebook groups and InterNations try to be, starting with one city that works.

### What the market teaches

| Platform | Model | What people like | What people complain about |
| --- | --- | --- | --- |
| [InterNations](https://www.trustpilot.com/review/internations.org?page=7) | Freemium; paid Albatross tier, event fees; volunteer Consuls and Ambassadors get premium free ([Expat Living](https://expatliving.hk/networking-in-hong-kong-events-and-activities-for-expats-with-internations/)) | Local hosts, in-person events | 2.4/5 on Trustpilot, 65% one-star: auto-renewal, cancellation, spam, fake profiles |
| [Expat.com](https://www.expat.com/en/faq.html) | Free; paid business listings, ads | Strong moderation; new users must take part before posting links | Inactive forums, outdated guides ([Trustpilot](https://ca.trustpilot.com/review/expat.com)) |
| [Expatica](https://www.expatica.com/product/directory-listing/) | Ads, affiliates, directory at EUR 299 per country per year | Fact-checked guides in 18 countries | Owned by Wise since June 2026 |
| [Nomads.com](https://nomads.com/) | Paid lifetime access; USD 1 step "to avoid spammers" | City data, 183-day residency alerts | Support and cancellation complaints ([Trustpilot](https://ca.trustpilot.com/review/nomadlist.com), 7 reviews, weakly sourced) |
| [The Local](https://www.niemanlab.org/2018/05/can-a-news-organization-provide-the-service-of-feeling-connected-through-its-membership-program/) | News plus EUR 5/month membership, about 9,000 members | Practical tax and pension guides convert best | Paywall friction |
| Facebook groups | Free, volunteer admins | Fast, local, free | Scams and fake rentals; Copenhagen Municipality itself warns about them ([kk.dk](https://international.kk.dk/artikel/renting-tips)); answers get buried ([Universitas](https://universitas.no/student-facebook-groups-from-useful-to-useless/365142)) |
| [Timeleft](https://www.connexionfrance.com/news/how-to-meet-new-people-over-dinner-in-france-we-try-out-new-app/682998) | Pay per dinner, from EUR 12.99 | Real tables with real people, 278 cities | Starting over every week |

Three lessons carry straight into the strategy. Billing and spam cause most of the anger in this category, and TLL has neither paywalls nor DMs. Local volunteer hosts are what people praise, so TLL needs a host role. And the money follows the move: Wise bought Expatica because readers of relocation guides become banking customers.

### The strategy

**Promise.** Free forever, signed by people who live there, dated so you know it is current, and never showing where anyone is right now.

**Start with one atomic network.** Andrew Chen's cold-start framework says to make one small network self-sustaining before linking more ([review](https://fffej.substack.com/p/book-review-the-cold-start-problem)). Copenhagen is that network: you are the first Location Expert, Denmark ranks near the bottom for making friends ([The Local](https://www.thelocal.dk/20250313/danes-given-advice-on-how-to-make-friends-with-foreigners)), and your own circle can seed the directory before it opens. Open Lisbon, Berlin, Singapore and Mexico City only when a real person claims each desk; remove the four placeholder desk cards until then.

**Profile fields that make the directory useful.** The member chooses what shows, and nothing is public until switched on (the current rule on /edit-profile, which is right).

- Home base (city and country) and "there since" year
- Places I have lived, and places I know well (with years)
- Interests (running, dogs, food, photography, work field), from a fixed list so filters work
- Open to: coffee with newcomers, answering questions, meetups, press
- Preferred contact channel: Instagram, WhatsApp or email, shown only on request or through the relay
- Languages

**Directory rules.**

- Filter by country, city, interest and language; order shuffled per visit within the results. No paid ranking, ever.
- Verified badge after a linked social account or email check plus a real face photo. Nomads.com uses the same face-photo rule.
- New members are sandboxed: contact links stay hidden until a light review or a first contribution, the Discourse trust-level approach ([Discourse](https://blog.discourse.org/2018/06/understanding-discourse-trust-levels/)).
- One-tap "report profile" on every card.
- No housing, sales or job posts anywhere in member content. Link to vetted resources instead.

**Privacy, stated plainly on the page.** City or country only, no GPS stored, no distances, no "near you," no live check-ins. Check Point showed that distance displays alone could place dating-app users within 10 meters ([Check Point](https://blog.checkpoint.com/research/not-so-private-after-all-how-dating-apps-can-reveal-your-exact-location/)). Put a three-line "What is public, what is not" box above every expat form.

**City Hosts.** An unpaid volunteer per city who welcomes newcomers and runs one monthly coffee. They get a badge, a featured story and first access to partner perks. The badge never moves them up the directory.

**First-week path for a new member.** Pick your countries, add one place you know well, see three people who share an interest. Higher Logic's survey found members who found it very easy to get involved reported 95% engagement, against 18% for those who found it hard ([Higher Logic](https://www.higherlogic.com/blog/elevating-community-onboarding-insights-and-strategies-for-2026/), vendor research, weakly sourced).

### Expat content to build on TLL

Each city hub uses one template: Moving here in the first 90 days, the admin checklist, how people actually made friends, what it costs (prices dated), where expats already gather (vetted groups), the people who know this city (opt-in cards), and a labeled partner block. Every practical line carries "last verified by \[member\], \[date\]." That answers the biggest weakness of the incumbents, which is stale guides, and it matches what Google rewards: firsthand Experience became an explicit quality signal in 2022 ([Google](https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t)).

| Hub | Seed from what is already live | New pieces to write |
| --- | --- | --- |
| Copenhagen / Denmark | /layovers/cph-copenhagen-6h, /stories/sort-sol-black-sun-denmark, /marathon-diaries/copenhagen-marathon-2026-recap, two Magnus Paw Passport entries (CPH pickup, Malmö border), the "Pyt" block | Moving to Copenhagen with a dog; first 90 days (CPR, MitID, health card, from the [official portal](https://lifeindenmark.borger.dk/)); how I actually made Danish friends; Øresund life; the Copenhagen stopover page the footer already promises |
| Brazil | /stories/northern-brazil-sequins-to-sloths, /stories/pantanal-glimmers-in-the-wild | Create /countries/brazil properly; Brazil from someone who lived there; four Carnavals as a resident |
| Sofia / Bulgaria | /layovers/sof-sofia-3h, Magnus Sofia entry, Balkans EV road trip | Sofia with a dog |
| Moving countries with a pet (cross-border) | All four Paw Passport entries, /the-paw-passport, Montenegro border entry | Pet relocation checklist by EU country; pairs with the EUR 9 guide |
| Entry rules tracker | Nothing live (footer link is a 404) | EES and ETIAS on a layover, then a visa and residency tracker by country with dated sources |
| Vietnam, Dubai | Nothing yet | Expat-life pieces from your own years there |

Recurring questions on r/expats also point to evergreen pieces TLL can answer with lived detail: feeling isolated abroad, US taxes while living overseas, moving belongings overseas, phone plans and eSIMs ([GummySearch](https://gummysearch.com/r/expats/), aggregator, weakly sourced).

### Expat revenue

The money in this niche sits at the moment of the move. All affiliate links get "reklamelink" beside them and "reklame for \[company\]" at the top of the page, per Danish practice noted in the Sept 28 monetization research.

| Stream | Benchmark | Where it goes on TLL | When |
| --- | --- | --- | --- |
| Wise referral | From GBP 10 per personal and GBP 50 per business customer, 1-year cookie ([Wise](https://wise.com/gb/blog/affiliate-onboarding-guide)) | "Money" step of each city admin checklist | Now |
| International movers (Sirelo) | 50% of revenue per accepted moving lead; expat communities named as eligible ([Sirelo](https://sirelo.co.uk/for-affiliates/)) | "Moving here" section of each hub | Now |
| Nomad and expat health insurance | SafetyWing about 10% of premium ([SafetyWing](https://safetywing.com/ambassador)); Genki recurring, rate undisclosed | Healthcare step of each hub | Now |
| eSIMs (Airalo) | 10% ([Airalo](https://www.airalo.com/blog/airalo-affiliate-program-faqs)) | Phone step of each hub. Never Telgea | Now |
| Language tutoring (Preply) | GBP 15 per new paying customer ([Awin](https://ui.awin.com/merchant-profile/21098)) | "Learning the language" block | Now |
| Paid guides | EUR 9 Paw Passport guide already priced | Pet relocation hub; later a Copenhagen first-90-days guide | Now (fix checkout) |
| Layover Club supporters | The Local: about 9,000 members at EUR 5/month | Every hub footer: "Keep this free" | Now (fix the Ko-fi links) |
| Labeled partner block per city | Expatica sells EUR 299 per country per year | "Partners in Copenhagen" below the editorial content, separate from member cards | After about 1,000 monthly hub visits; start well below EUR 299 |
| Sponsored city meetups | Timeleft charges from EUR 12.99 per seat | A local business sponsors the monthly coffee; entry stays free | When a City Host exists |
| Newsletter sponsorship | The Local and Expat Arrivals sell it on request | City-specific issue | After about 5,000 subscribers |

One copy change matters for trust: /faq says a paid tier "may" come later, which contradicts "100% free." Either commit to free for members and say supporters are optional, or remove the line.

## Part 1 build prompt: Claude Code

Paste this into Claude Code with the Webflow and Memberstack connectors on. It goes to Claude Code rather than Claude Design because most of the work is wiring pages and fields that already exist; Phase 3 carries its own design-first step for the city hub. It is also attached in the chat as a file.

```markdown
PROMPT FOR CLAUDE CODE: That Layover Life, expat community build (Oct 2026)

You are working on That Layover Life (thatlayover.life), a free travel storytelling community built on Webflow with Memberstack for members. The owner is Nancy Carleton. Your job is to build the expat layer of the site: fix the broken links that block it, extend member profiles, make the expat directory filterable, and build the first complete city hub (Copenhagen). Work through the Webflow and Memberstack MCP tools.

HOW TO WORK (non-negotiable)
1. Design, then Edit, then Implement. Before changing anything, produce a change log: every page, element, CMS field and copy line you intend to change, with before and after. Nancy approves the change log before you publish. Stage changes in the Designer; do not publish the live site without her approval.
2. Do not touch the nav or footer components unless Nancy is present and says so in this session.
3. Every count on the site binds to tllStates. Never hardcode a number.
4. The live site must match the Claude Design prototype (handoff brief, Sep 20 2026). Type: Playfair Display 800 for headlines, IBM Plex Sans Condensed for body, JetBrains Mono for eyebrows, Syne only in the wordmark. Italic rose accent words are allowed in page H1s.
5. Apply the Emil Kowalski design skill, the Taste Skill and the Impeccable design skill to all UI work.
6. Do not create accounts, sign up for services, or enter payment details. Prepare everything and hand Nancy the steps that need her click.
7. Judge every page as a user, a reader and an advertiser. Every page must make its purpose and audience clear on the first screen.

VOICE RULES FOR ANY COPY YOU WRITE
- The smartest, best-traveled friend in the group chat who is also a comedy writer. Editorial, full sentences in body copy; short punchy lines only in headlines, buttons and eyebrows.
- "I" for Nancy's personal stories, "we" for the platform. American English. No travel cliches, no listicle voice.
- Roast only ourselves, our decisions and inanimate objects, never a person, place or its people.
- Never use: em dashes, the verb s-h-i-p in any form, l-e-d-g-e-r, "No filler", "Truth over polish", "real names". Write "São Paulo" with the tilde. Never recommend Telgea.
- Strip AI tells. If a line sounds like LinkedIn, rewrite it.

PHASE 0: FIX WHAT BLOCKS THE HUBS
a. /destinations, "Every country · by flag": every flag links to /detail_countries (Webflow's unbound template path). Rebind each flag's link to the current Countries CMS item inside its Collection List. Do the same for the featured story cards, which link to /detail_stories. Verify by clicking at least Denmark, Brazil and France after the change.
b. /for-expats: "ALL COUNTRIES BY FLAG" points to /stories; point it to /destinations. The FIND button is href="#"; wire it to /travelers with the chosen country applied as a filter.
c. Remove the four placeholder "desk open" cards (Lisbon, Berlin, Singapore, Mexico City) and the "experts so far" heading until a real person claims a desk. Keep one "Claim your city" card.
d. Profiles: replace every "Currently in" with "Home base". Never display current location anywhere.
e. /share-photos: strip EXIF GPS from every upload, named or anonymous.
f. Footer 404s (/copenhagen-stopover, /ees-etias-layover) are footer links: list them in the change log and ask Nancy before touching the footer. Phase 3 builds /copenhagen-stopover.

PHASE 1: MEMBER PROFILE FIELDS (Memberstack custom fields plus /edit-profile UI)
Add, all opt-in, nothing public until switched on:
- "I live abroad" toggle (visible on /edit-profile, not only via country pages)
- Home base city and country (city or country granularity only, member chooses)
- There since (year)
- Places I have lived (country, years) and Places I know well (city, years), repeatable
- Interests from a fixed list (running, dogs and pets, food, photography, hiking, nightlife, family, remote work, arts, faith communities, LGBTQ+, language exchange); fixed so filters work
- Languages
- Open to: coffee with newcomers, answering questions, meetups
- Preferred contact channel: Instagram, WhatsApp or email. Contact details are never printed on the public card; the card's "Get in touch" opens the chosen channel only after the visitor is signed in, or routes through the existing relay form.
Add the three missing link fields (Strava, Threads, press kit) to /edit-profile so they match the public profile icon row, plus up to three custom links (label plus URL).
Above every expat form, add a three-line "What is public, what is not" box: what a listing shows, that it is opt-in and removable in one click, and that current whereabouts are never shown.

PHASE 2: THE EXPAT DIRECTORY (/travelers, Expats tab)
- Filters: country, city, interest, language, open to. Chips, keyboard accessible, labels connected to inputs.
- Order: shuffle within results on each visit (seeded per session so paging is stable). Remove "Sorted by recent bylines" for this tab. No paid placement ever; badges never change order.
- Verified badge: appears after a linked social account or email check plus a real face photo, with a "verified on" date.
- New-member sandbox: contact button hidden until Nancy approves the profile or the member files a first story. Build an approval queue for Nancy.
- "Report profile" link on every card, posting to a Webflow form Nancy receives.
- Empty state: one honest line and a CTA to switch on "I live abroad". Never show invented members.
- Country pages (/countries/[country]): render the opted-in members whose home base or "places I know" include that country, using the same shuffled card.

PHASE 3: COPENHAGEN CITY HUB TEMPLATE (design first, then build)
Create a reusable City Hub CMS collection and template, first item Copenhagen. Sections in this order:
1. Hero: city name, one-line promise, "written by people who live here", last verified date.
2. First 90 days: an admin checklist (address registration and CPR number, MitID, health card, bank account, tax card, Digital Post) with each line linking to the official source (lifeindenmark.borger.dk, skat.dk, kk.dk) and a "last verified by [member], [date]" stamp.
3. How people actually made friends here: member stories tagged to the city.
4. What it costs: member-submitted prices, each with a date.
5. People who know this city: opted-in member cards (same component as the directory).
6. Where expats already gather: vetted outside groups (name, link, what it is good for), submitted through the existing group form and approved by Nancy. Note Copenhagen Municipality's warning about housing scams on the housing line.
7. Partners in Copenhagen: a clearly labeled block ("Partner" eyebrow, "reklame" label in Danish contexts), visually separate from member content. Leave empty with a placeholder Nancy can fill; do not add affiliate links yourself.
8. Keep TLL free: Layover Club supporter CTA.
Seed the Copenhagen hub by linking these live pages: /layovers/cph-copenhagen-6h, /stories/sort-sol-black-sun-denmark, /marathon-diaries/copenhagen-marathon-2026-recap, /paw-passport/magnus-airport-pickup-ritual-cph, /paw-passport/magnus-cph-to-malmo-border, and the "Pyt" block from /countries/denmark. Build /copenhagen-stopover as a short page linked from the hub.
Leave placeholders (not invented text) for the pieces Nancy will write: Moving to Copenhagen with a dog; How I actually made Danish friends; Øresund life.
Schema: Article plus FAQPage on the checklist, ItemList of Person (opted-in only) for the people block. Keep the hub noindex until at least the checklist and three member cards are real.

PHASE 4: CITY HOSTS AND MEETUPS
- Add a "City Host" designation (application via /edit-profile, approved by Nancy). Badge on the card and a host line on the city hub; it never affects order.
- Add a Meetups CMS collection (city, month, venue type such as "a cafe in Nørrebro", sign-up link). Show the next meetup on the city hub. Never publish an exact private address or a member's home.

PHASE 5: MONEY ALREADY PROMISED IN COPY
- /support#layover-club: replace both href="#" Ko-fi buttons with the TLL Ko-fi URL (ask Nancy for it; the account uses hello@thatlayover.life).
- /the-paw-passport: add the buy link for the EUR 9 guide (ask Nancy for the Ko-fi product URL).
- /faq: flag the line saying a paid tier "may" come later; propose wording that keeps members free and frames supporters as optional. Nancy decides.
- Remove hidden "This story was hosted" and "AD SLOT" text from story HTML when it does not apply (render server-side or via CMS conditional visibility, not a JS toggle over hidden text).

DONE MEANS
- Change log approved, then implemented.
- Every flag on /destinations opens its own country page.
- The expat filters work on desktop and at 375px wide.
- Copenhagen hub renders with real seed links and honest empty states.
- A final report listing every change, every open question for Nancy, and anything you could not do.
```

## Part 2: Creators, bloggers, writers and press travelers

TLL wins this audience by being the one free, verified directory that covers all four kinds of travel media and links out to their work, paid for by the tourism boards and PR agencies who need to find them.

### What carried over from the expat review

| Expat lesson | How it applies here |
| --- | --- |
| Individuals free, organizations pay | Creators and writers never pay. DMOs and PR agencies pay for featured opportunities, the model behind every working platform in this market |
| Billing and spam drive the anger | Qwoted's worst reviews are about unexplained bans and spam enforcement ([Trustpilot](https://www.trustpilot.com/review/qwoted.com)). Publish the rules, give a reason for every removal, offer an appeal |
| Sandbox new members | New profiles cannot respond to opportunities until verified |
| Shuffled order, no pay-to-top | Same for the media directory. Paid visibility lives only on the organizer side |
| Never show where anyone is now | Travel plans show month and region only, visible to verified organizers only |
| One atomic network first | Nordic tourism boards plus Copenhagen-based and Nordic-focused creators |
| Dated, firsthand content wins search | Press-trip and disclosure guides from someone who has run PR and traveled 87 countries |

### What the market teaches

| Platform | Model and price | Who gets in | Gap TLL can fill |
| --- | --- | --- | --- |
| [SATW](https://satw.org/point-charts) | Associate (PR/DMO) USD 390/yr plus USD 50 ([SATW](https://www.satw.org/associates/)) | Points system; bloggers need about 10,000 monthly visitors; social media not addressed | Excludes most creators |
| [NATJA](https://www.natja.org/join/media-membership/) | USD 175/yr plus USD 25 | Established journalists and creators, code of ethics | Paid |
| [BGTW](https://bgtw.org/apply/) | GBP 175/yr plus GBP 50 | About 12 paid features a year or 25,000 monthly page views; social media not accredited; no AI | UK and Ireland only |
| [Travel Massive](https://www.travelmassive.com/pages/about) | Free community; USD 89 marketplace listings | Open | Closest model: free people, paid B2B |
| [WITS / Wanderful](https://events.humanitix.com/witsannarbor/tickets) | Creator ticket USD 449; Industry plus Media Marketplace USD 2,250 to 2,500 | Ticket buyers | Organizers pay about five times what creators do |
| [Muck Rack](https://www.muckrack.com/criteria) | Free for journalists; PR side median about USD 13,000/yr ([Vendr](https://vendr.com/marketplace/muck-rack), weakly sourced) | Full-time news journalists only | Excludes bloggers and creators |
| [TravMedia / IMM](https://travmedia.com/journalists) | PR side pays; prices not public | Journalists, PRs | The established channel, opaque |
| [Press Trip Pros](https://www.producthunt.com/products/press-trip-pros) | Free for media, organizers pay after a trial | "Vetted", criteria unclear | Direct analog, launched 2026 |
| [Linktree](https://u2l.ai/blog/linktree-pricing) / [Beacons](https://help.beacons.ai/en/articles/4695681) | Free to USD 35/mo; Beacons includes a media kit | Anyone | Not travel-specific, no verification, no opportunities |

### How press trips actually work, and the rules TLL must build in

- **Vetting.** Tourism Kelowna asks for 10,000+ followers and 2%+ engagement ([Kelowna](https://www.tourismkelowna.com/contact/media/content-creators-influencers/guidelines/)). Visit Estonia asks for an editor's letter on letterhead ([Visit Estonia](https://visitestonia.com/en/media/press-trips-for-media)). VisitDenmark prioritizes nine source markets and does not pay for individual press hotel stays ([VisitDenmark](https://www.visitdenmark.com/press/work-us)).
- **What DMOs struggle with.** In a 2026 survey of 200 destination marketers, 56% named finding and vetting creators as a top challenge, second to attribution at 76%, and 84% ranked engagement above follower count ([Net Influencer](https://www.netinfluencer.com/travel-destination-marketers-boost-influencer-budgets-even-as-attribution-gaps-persist-survey-finds/), vendor survey, weakly sourced).
- **Many writers cannot accept hosted trips.** The New York Times, BBC Travel, Washington Post, CNN and Insider do not run comped-trip work ([Travel Writing](https://travelwriting.substack.com/p/should-we-be-paying-our-own-way-as)). The board must offer paid assignments and "access only" support, not just free trips.
- **Disclosure is law, not etiquette.** The FTC treats free trips as material connections and wants disclosure in the content itself ([FTC](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers)). The UK ASA lists trips and hotel stays as payment and wants "Ad" up front ([ASA](https://www.asa.org.uk/static/9cc1fb3f-1288-405d-af3468ff18277299/INFLUENCERGuidanceupdatev6HR.pdf)). Danish courts have fined influencers 30,000 to 40,000 kr, including for an undisclosed ski trip and hotel stays ([Lovguiden](https://www.lovguiden.dk/praksisoversigt/skjult-reklame-influencer)).
- **The reputational risk is comp-begging.** One Maldives resort reported six or more free-stay requests a day ([Travel Agent Central](https://www.travelagentcentral.com/hotels/why-luxury-resorts-are-fed-up-freeloading-social-media-influencers), 2018, anecdotal). TLL's house rule: pitch the story, not the trip ([Travel Writing](https://travelwriting.substack.com/p/pitching-tips-from-a-telegraph-travel)).

### The strategy

**Promise.** Free for anyone who makes travel media. Verified, dated, and judged on the work. Organizers get people they can trust and disclosure that is already done right.

**The profile becomes a media kit.** Built on what DMOs actually ask for, and it doubles as the "link tree for travelers":

- Role: creator, blogger, writer, press traveler (one or more)
- Platforms and outlets, with links and platform icons; stories that live off-site appear with their icon and a gate chip if paywalled
- Audience markets (top countries) and engagement rate, with a "verified on" date
- Niches (from a fixed list) and past coverage with dates
- Hosted-travel policy: "can accept hosted travel" or "cannot accept hosted travel, paid or access-only work only"
- Disclosure pledge (required to respond to any opportunity)
- Availability by month and region, wish list, no-go destinations
- Rates: hidden by default, opt-in only

**Verification in four levels, each with a date.** Linked social (a code placed in the bio), stats checked (screenshots and a manual check now, API later; Instagram insights need a Business or Creator account and only keep 90 days of data, per [Meta](https://developers.facebook.com/docs/instagram-platform/insights)), bylines confirmed, association member.

**The opportunity board.**

- Only verified organizers post. Each post states organizer, support level (fully hosted, partial or media rate, access only, paid assignment), whether an assignment letter is needed, deliverables, image rights, required disclosure wording, and a deadline. Posts expire automatically.
- Public teaser shows destination, month and support level; full details are visible to verified press only.
- Members cannot post "host me" requests. They respond to posts, or publish month-level travel plans that verified organizers can see.
- New members have a reply limit until verified.
- Every opportunity and every resulting story carries a disclosure badge with wording for the US, UK and Denmark.

**Atomic network.** Start with Nordic tourism boards and PR agencies plus 20 to 30 creators and writers you can personally vouch for. VisitDenmark and Wonderful Copenhagen already run creator programs, and the 2025 Visit Denmark and Icelandair stopover campaign (in the Sept 28 monetization research) shows the budget exists.

**Keep it two-sided.** Organizers get a free tier (post up to three opportunities a month and browse the directory, as IZEA once offered three free casting calls a month, [IZEA](https://izea.com/press-releases/izea-announces-new-creator-marketplace/)). Recruit them where they already pay for media access: IMM, TBEX, WITS and association associate tiers.

### Creator and press content to build on TLL

The pages that rank for these questions today are old or written for one segment (ThePlanetD's press-trip guide dates from 2011, [ThePlanetD](https://theplanetd.com/press-trip-guide-for-travel-bloggers/)). Keyword volumes could not be measured on the current Ahrefs plan, so this list is based on what ranks now.

| Page or series | Why it works | Seed from TLL |
| --- | --- | --- |
| How to get on press trips in 2027, by segment | Real DMO criteria in one table | /for-press rules |
| Tourism board media contacts and hosting criteria | A living, dated reference others link to | New |
| Can I take a hosted trip? Outlet policy tracker | No consolidated source exists | New |
| Travel disclosure rules by country, with copy-paste wording | Denmark in English is rare | Existing /editorial-charter disclosure rules |
| Travel media kit template | Built on DMO fields; free download, paid Canva or Notion version later | The new profile fields |
| Travel writer associations compared: dues and criteria | No current sourced comparison found | The table above |
| Hosted-trip case studies with full disclosure | Portfolio for /for-brands, which says "past partners: none yet" | /stories/kilimanjaro-someone-was-already-awake, /stories/antarctica-marathon |
| Race-travel creator hub | Recruits running creators to the Blog Desk | Antarctica marathon, both /marathon-diaries pages |
| Pet-travel creator hub | Pets with their own links | Four Paw Passport entries, /pets/magnus-waffles |
| Wildlife timing series | Built for photographers | La Paz whale sharks, Pantanal jaguars, Sort Sol |
| TLL's own press kit page | Missing today; the profile already shows a "Press kit" icon | /about, /contact press door |

The five empty vibe collections can be filled from stories already live: Wild Routes (Balkans EV, Montenegro), Salty Air (La Paz), Alpine Escape (Patagonia, Kilimanjaro), Desert Glow (Northern Brazil). That turns five noindexed placeholders into indexable hubs.

### Creator and press revenue

| Stream | Benchmark | On TLL | When |
| --- | --- | --- | --- |
| Featured opportunity post | ProBlogger USD 80 standard, USD 160 featured ([ProBlogger](https://problogger.com/jobs/about/)); Travel Massive USD 89 ([Travel Massive](https://www.travelmassive.com/pages/about)) | Organizers pay to pin a post for 15 days; standard posts stay free up to three a month | When 10+ organizers post monthly |
| Organizer membership | SATW Associate USD 390/yr; IFWTWA Associate USD 255/yr ([IFWTWA](https://www.ifwtwa.org/ifwtwa-membership-requirements/)) | Annual seat under USD 255: unlimited posts, filtered search, verified badge | After the free tier proves demand |
| DMO-sponsored meetups | Travel Massive runs sponsored chapter events ([Travel Massive](https://travelmassive.com/pages/work-with-us)) | A Copenhagen creator meetup sponsored by a Nordic DMO or airline | Next |
| Creator-tool affiliates | beehiiv 50% for 12 months ([beehiiv](https://www.beehiiv.com/support/article/23352219299095-getting-started-with-the-beehiiv-partner-program)); Kit 50% for 12 months ([Kit](https://kit.com/affiliate)); Travelpayouts 7% of referred income for 2 years ([Travelpayouts](https://support.travelpayouts.com/hc/en-us/articles/203638558)) | Resource pages for bloggers, each link labeled "reklamelink" | Now |
| Paid media kit template | No reliable benchmark; Beacons gives one free, which caps the price | Free basic template, paid designed version | Later |
| TBC services | Creator casting and stopover content, already on /for-brands | Hosted-trip case studies become the portfolio | Now |

Creators never pay, and no money ever changes the order of the media directory. /for-brands already promises a higher directory spot is never for sale; keep that promise.

## Part 2 build prompt: Claude Code

Run this after the expat prompt so it can reuse the directory card, filters, shuffle and sandbox. Payment for featured posts stays a manual invoice from you until there is demand, so nothing here touches payment. Also attached in the chat as a file.

```markdown
PROMPT FOR CLAUDE CODE: That Layover Life, creator, blogger, writer and press build (Oct 2026)

You are working on That Layover Life (thatlayover.life), a free travel storytelling community built on Webflow with Memberstack for members. The owner is Nancy Carleton. Your job is to turn the existing press and creator pieces into a working, verified media directory and opportunity board, paid for by organizers, never by creators. Work through the Webflow and Memberstack MCP tools. If the expat build (separate prompt) has run, reuse its directory card, filters, shuffle, sandbox, report link and "What is public, what is not" box rather than building new ones.

HOW TO WORK (non-negotiable)
1. Design, then Edit, then Implement. Before changing anything, produce a change log: every page, element, CMS field and copy line you intend to change, with before and after. Nancy approves the change log before you publish. Stage changes in the Designer; do not publish the live site without her approval.
2. Do not touch the nav or footer components unless Nancy is present and says so in this session.
3. Every count on the site binds to tllStates. Never hardcode a number.
4. The live site must match the Claude Design prototype (handoff brief, Sep 20 2026). Type: Playfair Display 800 for headlines, IBM Plex Sans Condensed for body, JetBrains Mono for eyebrows, Syne only in the wordmark. Italic rose accent words are allowed in page H1s.
5. Apply the Emil Kowalski design skill, the Taste Skill and the Impeccable design skill to all UI work.
6. Do not create accounts, sign up for services, connect APIs that need credentials, or enter payment details. Prepare everything and hand Nancy the steps that need her click.
7. Judge every page as a user, a reader and an advertiser. Every page must make its purpose and audience clear on the first screen.

VOICE RULES FOR ANY COPY YOU WRITE
- The smartest, best-traveled friend in the group chat who is also a comedy writer. Editorial, full sentences in body copy; short punchy lines only in headlines, buttons and eyebrows.
- "I" for Nancy's personal stories, "we" for the platform. American English. No travel cliches, no listicle voice.
- Roast only ourselves, our decisions and inanimate objects, never a person, place or its people.
- Never use: em dashes, the verb s-h-i-p in any form, l-e-d-g-e-r, "No filler", "Truth over polish", "real names". Write "São Paulo" with the tilde. Never recommend Telgea.
- Strip AI tells. If a line sounds like LinkedIn, rewrite it.
- Never make claims the site cannot back. /for-brands says there are no partners yet; do not write that tourism boards "trust" TLL until one does.

PHASE 0: FIXES THAT AFFECT THIS AUDIENCE
a. Every story's HTML contains hidden "This story was hosted. The travel was paid for by the host" text, plus "AD SLOT" text and the affiliate aside, toggled by JS. AI crawlers read hidden text and may describe every story as sponsored. Render these only when true, using CMS conditional visibility.
b. /contributors/nancy-carleton shows "0 Stories filed" and "No links shared yet" while 10 stories exist. Bind the count to tllStates and fix the story relationship.
c. Rewrite the lines using the banned verb on /travelers, /terms and /spotlight.
d. /for-press: a PR person cannot tell within one screen that the page is for them. Split the first screen into two clear doors: "I make travel media" and "I host travel media".
e. /for-press: remove the unsupported line about a disclosure standard tourism boards trust, and "One form, the whole press list" until the list has a real size.

PHASE 1: THE MEDIA KIT PROFILE (Memberstack custom fields plus /edit-profile UI)
All opt-in, nothing public until switched on. Add:
- Role: creator, blogger, writer, press traveler (multi-select)
- Outlets and platforms (repeatable: name, URL, platform), shown with platform icons
- Audience markets (top three countries) and engagement rate, each with a "verified on" date
- Niches from a fixed list (adventure, food, luxury, budget, family, pets, running and races, wildlife and photography, culture, LGBTQ+, accessible travel, sustainability, expat life)
- Past coverage (repeatable: title, outlet, date, URL)
- Hosted-travel policy: "Can accept hosted travel" or "Cannot accept hosted travel (paid or access-only work only)"
- Disclosure pledge checkbox (required before responding to any opportunity)
- Availability by month and region (never exact dates or cities), wish list, no-go destinations
- Rates: hidden by default; opt-in only
Off-site stories: on cards for stories that live on TikTok, Instagram, Substack or YouTube, show the platform icon (not only the text label "Opens on {platform}") and the gate chip when paywalled. Add one live example once Nancy supplies a link.

PHASE 2: VERIFICATION
Four badges, each with a "verified on" date and a re-check every 12 months:
1. Linked social: member places a TLL code in their bio; Nancy confirms in an admin queue.
2. Stats checked: member uploads insights screenshots; Nancy confirms. (Instagram API stats later; note that insights need a Business or Creator account and keep only 90 days.)
3. Bylines confirmed: at least two links to published work on an outlet's own site.
4. Association member: SATW, NATJA, BGTW, IFWTWA or similar, with a member page link.
Build the admin queue as a Webflow CMS collection or Memberstack data table Nancy can work through. Publish the rules on a /press-rules page: what each badge means, why a profile can be removed, and how to appeal.

PHASE 3: THE MEDIA DIRECTORY (/travelers, Press and Creators tabs)
- Filters: role, niche, audience market, platform, hosted-travel policy, verification level, available in (month, region).
- Order: shuffle within results per session. No paid placement ever; badges never change order. Keep the /for-brands promise that a higher spot is never for sale.
- New-member sandbox: cannot respond to opportunities or show contact until at least the Linked social badge.
- Contact through the member's chosen channel or the existing relay. No DMs.
- Empty states are honest. Never show invented members.

PHASE 4: THE OPPORTUNITY BOARD (/opportunities, new)
Turn the existing PR form on /for-press into a board.
- Organizer accounts: a separate Memberstack plan "Organizer" (free). Organizers verify with a work email at their organization's domain plus a link to their media or press page; Nancy approves.
- Post fields (all required): organization, destination, month(s), support level (Fully hosted / Partial or media rate / Access only / Paid assignment), assignment letter needed (yes/no), deliverables, image rights, required disclosure wording, who it suits (role, niche, markets), response deadline. Posts expire automatically at the deadline.
- Visibility: the public teaser shows destination, month and support level. Full details and the respond button are visible only to members with at least the Linked social badge.
- Filters: support level, destination, month, role, niche. Writers with "Cannot accept hosted travel" see Paid assignment and Access only by default.
- Respond: the member sends their profile plus a short pitch (500 characters) through the relay. Rule shown on the form: "Pitch the story, not the trip."
- No "host me" posts by members. Members may publish month-and-region travel plans visible only to verified organizers.
- Free tier: up to three posts a month per organizer. Build a "Featured" flag (pinned for 15 days, labeled "Featured") that Nancy toggles manually after an organizer pays her by invoice; do not build payment.
- Disclosure badge on every post and every story that results from one, with the right wording per market: US "Ad" or "Hosted by [org]" in the content; UK "Ad" before engagement; Denmark "reklame for [org]" first and "reklamelink" beside each affiliate link.
- Schema: Event for each opportunity (no exact address).

PHASE 5: CONTENT HUBS (design first, then build)
Create a "For travel media" hub page linking these, with placeholders where Nancy will write:
- How to get on press trips (by segment)
- Tourism board media contacts and hosting criteria (a CMS table: board, country, media page URL, what they ask for, last verified date). Seed rows Nancy can verify: Tourism Kelowna, Visit Estonia, VisitDenmark, Explore Asheville.
- Can I take a hosted trip? Outlet policy tracker (CMS table: outlet, policy, source URL, last verified)
- Disclosure rules by country with copy-paste wording
- Travel media kit template (free download placeholder)
- Travel writer associations compared (CMS table: dues, criteria, source, last verified)
Also:
- Build a TLL press kit page (/press-kit): founder bio from /about, 87 countries, topics Nancy speaks on (travel writing and AI, expat life, marathon continents, EU pet travel), photos placeholder, contact door. Link the profile's "Press kit" icon to it.
- Tag existing stories into the five empty vibe collections and lift their noindex once each has stories: Wild Routes (Balkans EV, Montenegro), Salty Air (La Paz), Alpine Escape (Patagonia, Kilimanjaro), Desert Glow (Northern Brazil). Propose a story for Sunset Mist; do not invent one.
- Add hosted-trip case study cards to /for-brands from /stories/kilimanjaro-someone-was-already-awake and /stories/antarctica-marathon, only if Nancy confirms they qualify.
- Blog Desk on /travel-wire: add an RSS submission path from the Creators tab so bloggers with the "Blog on the Wire" designation appear there.

DONE MEANS
- Change log approved, then implemented.
- A verified organizer can post an opportunity; a verified writer can filter, read and respond; an unverified member cannot.
- Filters and the board work on desktop and at 375px wide.
- Every disclosure badge renders the right wording per market.
- A final report listing every change, every open question for Nancy, and anything you could not do.
```

## Sources

Research followed the STORM pattern: independent sources per claim, official pages first, and weak or self-interested figures flagged inline. No Wikipedia. InterNations' site and Reddit blocked fetching, so those facts come from Trustpilot, app stores, press and GummySearch. Ahrefs keyword volumes were not available on the current plan. Site facts come from a crawl of thatlayover.life on Oct 12, 2026.

**Expat platforms and practice**

- [Trustpilot, InterNations](https://www.trustpilot.com/review/internations.org?page=7) · [Expat Living HK, InterNations hosts](https://expatliving.hk/networking-in-hong-kong-events-and-activities-for-expats-with-internations/)
- [Expat.com FAQ](https://www.expat.com/en/faq.html) · [Trustpilot, Expat.com](https://ca.trustpilot.com/review/expat.com)
- [Wise acquires Expatica](https://newsroom.wise.com/en-UKI/267271-wise-acquires-expatica-as-it-deepens-support-for-people-living-internationally/) · [Expatica directory listing](https://www.expatica.com/product/directory-listing/)
- [Nomads.com](https://nomads.com/) · [Trustpilot, Nomad List](https://ca.trustpilot.com/review/nomadlist.com)
- [Nieman Lab, The Local membership](https://www.niemanlab.org/2018/05/can-a-news-organization-provide-the-service-of-feeling-connected-through-its-membership-program/)
- [City of Copenhagen, renting tips](https://international.kk.dk/artikel/renting-tips) · [Universitas, Facebook groups](https://universitas.no/student-facebook-groups-from-useful-to-useless/365142)
- [The Connexion, Timeleft](https://www.connexionfrance.com/news/how-to-meet-new-people-over-dinner-in-france-we-try-out-new-app/682998)
- [The Local, Expat Insider 2023](https://www.thelocal.dk/20230711/denmark-ranked-hardest-nordic-country-for-foreigners-to-settle-in) · [The Local, Expat Insider 2024](https://www.thelocal.dk/20250313/danes-given-advice-on-how-to-make-friends-with-foreigners)
- [The Cold Start Problem, review](https://fffej.substack.com/p/book-review-the-cold-start-problem) · [Discourse trust levels](https://blog.discourse.org/2018/06/understanding-discourse-trust-levels/) · [Higher Logic onboarding](https://www.higherlogic.com/blog/elevating-community-onboarding-insights-and-strategies-for-2026/)
- [Check Point Research, location exposure](https://blog.checkpoint.com/research/not-so-private-after-all-how-dating-apps-can-reveal-your-exact-location/)
- [Google, E-E-A-T](https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t) · [Life in Denmark](https://lifeindenmark.borger.dk/) · [GummySearch, r/expats](https://gummysearch.com/r/expats/)
- Affiliates: [Wise](https://wise.com/gb/blog/affiliate-onboarding-guide) · [Sirelo](https://sirelo.co.uk/for-affiliates/) · [SafetyWing](https://safetywing.com/ambassador) · [Airalo](https://www.airalo.com/blog/airalo-affiliate-program-faqs) · [Preply on Awin](https://ui.awin.com/merchant-profile/21098)

**Creator, writer and press platforms and practice**

- [SATW point charts](https://satw.org/point-charts) · [SATW associates](https://www.satw.org/associates/) · [NATJA](https://www.natja.org/join/media-membership/) · [BGTW](https://bgtw.org/apply/) · [IFWTWA](https://www.ifwtwa.org/ifwtwa-membership-requirements/)
- [Travel Massive about](https://www.travelmassive.com/pages/about) · [Travel Massive work with us](https://travelmassive.com/pages/work-with-us) · [WITS tickets](https://events.humanitix.com/witsannarbor/tickets)
- [Muck Rack criteria](https://www.muckrack.com/criteria) · [Vendr, Muck Rack](https://vendr.com/marketplace/muck-rack) · [TravMedia](https://travmedia.com/journalists) · [Press Trip Pros](https://www.producthunt.com/products/press-trip-pros) · [Trustpilot, Qwoted](https://www.trustpilot.com/review/qwoted.com)
- [Linktree pricing](https://u2l.ai/blog/linktree-pricing) · [Beacons pricing](https://help.beacons.ai/en/articles/4695681) · [IZEA marketplace](https://izea.com/press-releases/izea-announces-new-creator-marketplace/)
- [Tourism Kelowna](https://www.tourismkelowna.com/contact/media/content-creators-influencers/guidelines/) · [Visit Estonia](https://visitestonia.com/en/media/press-trips-for-media) · [VisitDenmark](https://www.visitdenmark.com/press/work-us)
- [Net Influencer, DMO survey](https://www.netinfluencer.com/travel-destination-marketers-boost-influencer-budgets-even-as-attribution-gaps-persist-survey-finds/) · [Travel Agent Central](https://www.travelagentcentral.com/hotels/why-luxury-resorts-are-fed-up-freeloading-social-media-influencers)
- [Travel Writing, paying your own way](https://travelwriting.substack.com/p/should-we-be-paying-our-own-way-as) · [Travel Writing, Telegraph pitching tips](https://travelwriting.substack.com/p/pitching-tips-from-a-telegraph-travel) · [ThePlanetD](https://theplanetd.com/press-trip-guide-for-travel-bloggers/)
- [FTC Disclosures 101](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) · [ASA/CMA influencer guide](https://www.asa.org.uk/static/9cc1fb3f-1288-405d-af3468ff18277299/INFLUENCERGuidanceupdatev6HR.pdf) · [Lovguiden, Danish case law](https://www.lovguiden.dk/praksisoversigt/skjult-reklame-influencer)
- [Meta, Instagram insights](https://developers.facebook.com/docs/instagram-platform/insights)
- Revenue: [ProBlogger](https://problogger.com/jobs/about/) · [beehiiv](https://www.beehiiv.com/support/article/23352219299095-getting-started-with-the-beehiiv-partner-program) · [Kit](https://kit.com/affiliate) · [Travelpayouts](https://support.travelpayouts.com/hc/en-us/articles/203638558)

**Open questions to close before quoting externally:** InterNations Albatross price, SATW Active dues, TBEX ticket prices, Press Trip Pros organizer pricing, and Cigna and Allianz affiliate rates were not published on official pages.
