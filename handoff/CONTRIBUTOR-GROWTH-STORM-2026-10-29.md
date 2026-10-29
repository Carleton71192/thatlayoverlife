# Contributor growth without looking needy: a STORM research report

Prepared for Nancy, That Layover Life (thatlayover.life), Copenhagen
Date: 29 October 2026
Question: "Use STORM methods to determine best practices for building contributors without appearing needy."

---

## 0. Read this first: how the evidence was gathered

- Method: STORM (Stanford's "Synthesis of Topic Outlines through Retrieval and Multi-perspective question asking"). Seven expert perspectives were defined, each asked its own questions, each question was answered with web research, and the answers were outlined and then written up here.
- Network limits in this session. Direct page fetches were blocked by the sandbox (DNS refused) for every host tried: `www3.uwsp.edu`, `cse.umn.edu`, `opensource.guide`, `assets.atlasobscura.com`. Following the sandbox guidance, no further hosts were tried after that. The GitHub API route to the opensource.guide source text was also refused. To open them, those hosts must be allowed in the session's network settings.
- What that means for citations. Every claim below comes from web search results, which return extracts of the named pages. No page was opened in full. Each source in Section 6 has one of these marks:
  - **[E]** The claim appears in a search extract of that exact page (usually the primary page, such as the paper, the publication's own guidelines, or the NN/g article). The full page was not opened.
  - **[E2]** The claim appears only in a secondary write-up about the original.
  - **[U]** Unverified. Treat it as a lead, not a fact.
- No statistic in this report was invented. Where secondary accounts disagree on a number, the report says so.
- Recommended follow-up: before any of these numbers are quoted publicly, open the [E] and [E2] sources from an unrestricted machine and check them. The practices themselves do not depend on exact figures.

House-style note: every example line meant for the site follows the house rules. US English, no em dashes, no exclamation marks, none of the banned words, and no counts typed as numbers.

---

## 1. Perspectives used

| # | Perspective | Who it stands in for |
|---|---|---|
| P1 | Community editor of a reader-built travel publication | Atlas Obscura Places team, Lonely Planet reader credits, Lonely Planet Pathfinders |
| P2 | Editor who runs open submissions | The Sun ("Readers Write"), Hidden Compass, Roads & Kingdoms, NYT Modern Love |
| P3 | Behavioral scientist (norms, scarcity, social proof, asking) | Cialdini, Worchel, Flynn and Lake, Freedman and Fraser, Grant and Gino, fundraising field studies |
| P4 | Peer-production researcher | Wikipedia newcomer research (Halfaker, Morgan, Teahouse, Thanks, Growth team), Zhang and Zhu, Huberman, Kraut and Resnick |
| P5 | Open-source maintainer focused on first contributions | GitHub "good first issue", Steinmacher's newcomer-barrier studies, Mozilla mentoring guidance |
| P6 | UX writer and interruption designer | Nielsen Norman Group (calls to action, popups, empty states), Google Search Central, deceptive.design, FTC |
| P7 | Platform builder and creator-economy strategist | Andrew Chen (cold start), Reddit's early seeding, Substack guest posts, Unsplash contributor census, *Get Together* (People and Company) |

---

## 2. Simulated conversations (questions and grounded answers)

### P1. Community editor of a reader-built travel publication

**Q1. How does Atlas Obscura invite contributions without begging?**
It treats contribution as a normal feature of the site. "Add a Place" links appear throughout, a contributor first creates a profile with a photo and bio, and searches for duplicates first. If the place exists, the contributor can "Suggest an Edit" or add photos to it. [S29, E]

**Q2. Is anything published as submitted?**
No. "All contributions to Atlas Obscura are reviewed and edited by our editorial team before they are published," and review can take a few weeks. [S29, E] For a magazine this frames editing as a standard, not as gatekeeping.

**Q3. How do contributors feel about the work?**
In an interview, Atlas Obscura's associate places editor described the job as editing submissions and joining forum conversations. Contributors get feedback, are kept informed about places, and are sometimes asked to host events or trips. A summary of the interview says the aim is for contributors to feel they work *with* the site, not *for* it. [S29b, E2; the transcript is auto-generated, so wording may be off]

**Q4. Does Atlas Obscura show numbers?**
Yes, but only at scale: regional guide pages carry leaderboards (Places Added, Places Edited, Places Visited). On a small city page, the top contributor had added only a couple of places. [S29c, E] That is the needy-number risk in miniature: a leaderboard that works for Colorado reads thin for Omaha.

**Q5. How did Lonely Planet credit readers?**
A modern Lonely Planet guide has an "Our Readers" section that thanks travelers by name, and it says each person who sends information is thanked in the next edition. [S30, E] In 1992 the *Christian Science Monitor* reported that Lonely Planet received 75 to 100 reader letters a week. [S30b, E] I could not verify how the earliest 1970s editions credited readers. [U]

**Q6. What about a formal contributor tier?**
Lonely Planet's Pathfinders program grew out of a 2008 "Blogs We Like" experiment. Its top tier, Trailblazers, was chosen at Lonely Planet's discretion for quality and consistency. [S31, E2; mostly 2010 to 2012 blog posts, so the current structure is unverified]

**Key findings (P1):** Make contributing a normal, visible feature, not an appeal. Edit everything and say so. Credit people by name in the product itself. Show numbers only where they are big enough to impress.

### P2. Editor who runs open submissions

**Q1. What is the oldest working model for reader-written pieces?**
The Sun's "Readers Write" has run since 1978. Each issue announces a broad topic and a deadline (2024 examples: "Misunderstandings", "The Basement", "Timing", "Walking Out"). It publishes only true stories, values sincerity over style, and pays published contributors with a year's subscription. [S32, E] A prompt plus a date turns a vague "write for us" into a specific, time-bound invitation.

**Q2. What do selective travel outlets ask for?**
Hidden Compass says it is "not driven by destinations" but by stories. It rejects listicles, service pieces and promotional material. Accepted writers should expect several rounds of edits and supply sources for fact-checking. [S33, E] Saying no to things raises the status of saying yes.

**Q3. Do selective outlets work with beginners?**
Yes. Roads & Kingdoms' photo editor said the outlet works mostly with freelancers, many of them first-timers, and that the best pitch is "a pretty narrow pitch" with characters and a narrative. [S34, E]

**Q4. How fast do big outlets respond?**
Slowly. User-reported data on Chill Subs puts Modern Love's average response at about 120 days. [S35, E2, user-reported, not official] Hidden Compass may not reply to every submission. [S33b, E2] For a young magazine, a fast and personal reply is a real advantage.

**Q5. What does a contributor get?**
Outlets set out the terms plainly. Hidden Compass lists pay rates (figures vary by source and date) [S33b, E2]. The Sun gives a subscription [S32, E]. Clear terms read as professional, not needy.

**Key findings (P2):** Announce specific prompts with real deadlines. Publish standards, including what you do not want. Make editing part of the offer. Reply quickly. State what the writer gets.

### P3. Behavioral scientist (norms, scarcity, social proof, asking)

**Q1. If I say "we need writers," does it backfire?**
It can. At Petrified Forest National Park, a sign stressing that many past visitors had taken wood produced 7.92% theft of marked pieces, against 1.67% for a sign asking visitors not to take wood. [S1, E; the 2006 paper also reports 7.92% against 4.00% for the other three conditions combined] Cialdini's 2007 testimony to Congress makes the same point: a message that something undesirable is common makes it normal. [S2, E] For a magazine, "almost nobody has written yet" works like that sign. It tells readers that not contributing is the norm.

**Q2. Do small public counts hurt?**
The evidence is mixed and depends on context. A PLOS ONE study of fundraising found that showing few donors raised average gifts near a goal but hurt far from it. [S6, E] A petition A/B test found a counter helped slightly, but the treatment trailed during an early window with small counts. [S7, E] The safe conclusion for a site that is far from its goal is not to show the count.

**Q3. Does scarcity help, and when is it manipulative?**
Scarce cookies were rated more desirable. Cookies made scarce by other people's demand were rated higher than cookies made scarce by accident. [S5, E] The FTC's 2022 staff report "Bringing Dark Patterns to Light" lists false scarcity, false high demand and fake countdown timers as deceptive designs. [S28, E2] Scarcity works only when it is true, and it reads best as demand ("taken") rather than as a hole ("empty").

**Q4. Should I ask people directly?**
Yes. Across field and lab studies, people underestimated by as much as 50% how likely others were to agree to a direct request for help. [S8, E] The Stanford write-up adds that askers wrongly believed indirect requests worked better. [S8b, E]

**Q5. Does a small first ask lead to a bigger one?**
In Freedman and Fraser's 1966 experiments, people who agreed to a small request were more likely to agree later to a larger one. [S9, E] Secondary accounts give different percentages, so none are quoted here. [U]

**Q6. Does thanking contributors matter?**
In Grant and Gino (2010), being thanked made helpers more likely to help again, through a sense of being socially valued. [S10, E] Caveat: this paper is under data review by the Many Co-Authors project. Grant reported he could reproduce the key results from data files he was sent but never saw the raw data. [S10b, E] Use it as supporting evidence only.

**Key findings (P3):** Never advertise rarity or emptiness. Describe what contributors do and what the standard is. Use scarcity only when true and framed as demand. Ask people one at a time. Start with small asks. Thank people specifically.

### P4. Peer-production researcher

**Q1. What drives newcomers away?**
Halfaker and colleagues found that Wikipedia's strict quality control, and the automated tools used to reject contributions, were key causes of falling newcomer retention. [S12, E] A related study found reverts most damaging when an experienced editor reverts a new one. [S12b, E]

**Q2. What brings them back?**
In a controlled experiment, newcomers personally invited to the Wikipedia Teahouse (a friendly help space) stayed at higher rates in both the short and long term. [S13, E] On French Wikipedia, pre-written automated welcome messages sent to 57,084 new accounts had no significant effect on retention. [S14b, E2] The difference is a host and a real conversation.

**Q3. Do thank-you buttons work?**
Modestly. Randomized experiments on Wikipedia's Thanks feature found about a 2% retention gain and no change in time worked. Most editors, especially new ones, had never received a thank. [S14, E]

**Q4. Do easier first tasks help?**
Wikipedia's Growth team reported that suggested edits raised first article edits by 11.6% and early edits by 22%, with no drop in quality, across four language editions. [S15, E] A later study of the newcomer homepage on 27 language editions found more modest gains that depended on context. [S15b, E]

**Q5. Does audience size matter to contributors?**
Yes. When mainland China blocked Chinese Wikipedia, contributors outside the block cut their contributions by 42.8% on average. The authors put this down to lost social benefit from a smaller audience. [S16, E] On YouTube, uploads tracked the attention a channel received, and falling attention preceded falling uploads. [S17, E]

**Q6. Is there a playbook?**
Kraut and Resnick's *Building Successful Online Communities* (MIT Press) organizes evidence-based design claims under starting a community, attracting newcomers, encouraging commitment and encouraging contribution. [S18, E] Its specific claims were not retrievable here. [U] Nielsen's participation-inequality article puts the usual split at 90-9-1. His suggestions, as summarized by others, are to lower effort, make participation a by-product, allow editing rather than creating from scratch, reward without overdoing it, and promote quality contributors. [S11, E for the ratio; E2 for the tactics]

**Key findings (P4):** Rejection is the main retention risk, so edit with people rather than turning them away. Personal hosting works where automated welcomes do not. Easier first tasks increase first contributions. Contributors keep going when people read them, so deliver attention to each new writer.

### P5. Open-source maintainer focused on first contributions

**Q1. What stops newcomers?**
A review of studies found that social barriers, such as getting a reply and connecting with members, were among the best-evidenced obstacles, along with "finding a way to start". [S20, E] A later model listed 58 barriers, 13 of them social. [S20b, E]

**Q2. How fast must we reply?**
Mozilla's mentoring guidance says response time is the biggest influence on contributor retention. Contributors acknowledged within about two days, even with just a thank-you and a review date, generally return; those left two weeks generally do not. [S21, E] The precise percentages circulate second-hand without a published study. [U]

**Q3. How do maintainers signal "a beginner can do this"?**
They label beginner tasks ("good first issue") and tell newcomers where to find them. GitHub's docs say the label also helps surface the project to newcomers. [S19, E] Secondary guides stress labeling accurately and writing tasks with clear context. [S22, E2]

**Q4. What documentation helps?**
A contributor guide that says how to start. opensource.guide's own page could not be fetched [unreachable host]. Secondary guides recommend one. [S22, E2]

**Key findings (P5):** Acknowledge quickly. Offer clearly labeled, small first tasks. Publish a short contributor guide. Treat the first reply as the most important moment.

### P6. UX writer and interruption designer

**Q1. Is "Your face could be here" a good call to action?**
NN/g found that generic labels such as "Get Started" and "Learn More" stop users. Link text should say exactly what happens next. [S23, E] "Your face could be here" describes an empty space, not an action.

**Q2. What should an empty area do?**
NN/g's empty-state guidance says to show accurate status, use the space to teach, and give a direct path to the action, not just a blank. [S25, E] Applied to the founders strip, the space should show the action ("Pitch a story"), not the absence.

**Q3. Are pop-ups acceptable?**
In NN/g's 2017 survey of 452 US adults, modal ads were among the most disliked formats on desktop and mobile. [S24, E] NN/g's popup guidance warns against overlays shown before content loads or asking for things before the user has done anything, and recommends waiting until the request is relevant, such as after a key task. [S24b, E]

**Q4. Does it matter for Google and AdSense readiness?**
Google's Search Central guidance calls overlays that block content, usually for promotion, "intrusive interstitials" and recommends small banners instead. Avoiding them is part of Google's page experience self-assessment. [S26, E]

**Q5. What about guilt-trip copy?**
Confirmshaming means wording that uses guilt or shame to steer a decision, usually on the decline option. [S27, E] Lines like "No thanks, I don't travel" belong here.

**Q6. Can we use urgency?**
Only if it is true. The FTC report lists fake countdowns and "limited time only" claims among deceptive patterns. [S28, E2]

**Key findings (P6):** Say the action, not the absence. Fill empty states with a path. Ask inline and after reading, never in a modal. Never use guilt on the decline option. Use only true deadlines.

### P7. Platform builder and creator-economy strategist

**Q1. Which side do we build first?**
Andrew Chen's *The Cold Start Problem* says to recruit the "hard side" of a network first, the small group that creates most of the value. [S38, E2] For That Layover Life, writers are the hard side and readers follow.

**Q2. Is it legitimate for the founder to fill the early site?**
Reddit's founders used many fake accounts in the first months to post the kind of links they wanted and set the tone. Steve Huffman has described this himself. [S39, E2, reported by Vice and the Daily Dot from his Udacity talk] The lesson is to set the tone with the founders' own taste. The part not to copy is the fake accounts: for a magazine whose promise is "Written by the people who went", invented personas would break the brand promise.

**Q3. What makes guest writing worth a writer's time?**
Substack's guest posts give the visiting writer a prominent bio at the foot of the post, where readers can subscribe to them. [S36, E] The contributor's payoff is their own audience.

**Q4. Why do contributors give work for free?**
In Unsplash's 2019 contributor census, 59% said they contribute because of the community and 54% to pay it forward. Contributors also asked to see where their photos were used. [S37, E]

**Q5. How should the first members be gathered?**
*Get Together* (Stripe Press, 2019) builds on one principle: build the community with people, not for them. One of its topics is how to rally the first people. [S40, E for the publisher description; the book's detailed advice was not retrievable, U]

**Key findings (P7):** Recruit writers first, one at a time. Set the tone with the founder's own work, under real bylines only. Give each contributor a payoff that belongs to them (bio, link, readership report). Involve founding writers in shaping the magazine.

---

## 3. Outline that the practices were built from

1. Never put absence on display (P3 norms, P3 counts, P6 empty states, P1 leaderboards).
2. Ask small, specific, personal (P3 asking, P3 foot-in-the-door, P4 Teahouse, P5 first tasks, P7 hard side).
3. Make the standard the attraction (P2 standards, P1 editing, P3 scarcity as demand).
4. Pay contributors in attention and credit (P4 audience, P7 bios, P1 credits, P3 thanks).
5. Make the first reply the best moment (P5 response time, P4 rejection, P2 response gaps).
6. Ask in context and never interrupt (P6 popups, P6 interstitials, P6 confirmshaming).

---

## 4. Ranked practices for That Layover Life

Ranked by evidence strength times effect on the "needy" problem, with the cheapest wins first where they tie.

**1. Retire the open-slot roster. Show the writers you have, and the action.**
- On the site: Remove "Open slot", "Your face could be here", and any empty seats from the home "first 100" strip. Show the existing founding writers as portraits with a byline line each, then end the row with one action tile that links to /submit.
- Example copy (tile): "Pitch your layover." Subline: "Founding writers get a badge that stays on their byline."
- Why: Advertising that most people do not contribute makes not contributing the norm [S1, S2]. Small counts can hurt far from a goal [S6]. An empty state should give a path, not a blank [S25].

**2. Ask people one at a time, by name, from Nancy.**
- On the site and off it: Add a standing practice instead of a page change. Each week Nancy writes a short personal note to two or three readers who left a comment, shared a photo, stamped a Paw Passport or replied to the newsletter, inviting one specific story.
- Example copy (email): "Your photo from the Doha transit hall stopped me. Would you write the night behind it? Five hundred words is plenty, and I will edit it with you."
- Why: People underestimate yes rates for direct requests by as much as 50% [S8]. Personal invitations improved Wikipedia retention, while automated welcomes did not [S13, S14b]. Writers are the hard side to recruit first [S38].

**3. Build a contribution ladder that starts below a full story.**
- On the site: On /submit, offer three doors in order of effort: send one photo (/share-photos), give a pet a Paw Passport, write a story. On each story page, add a light "Add a photo from this place" link.
- Example copy: "Start with one photo. The story can come later."
- Why: Small first commitments raise later compliance [S9]. Easier first tasks raised first edits on Wikipedia [S15]. Nielsen recommends lowering effort and letting people add to existing content [S11]. Atlas Obscura lets people add photos to existing places [S29].

**4. Run a monthly prompt with a real deadline.**
- On the site: A small "This month's prompt" block on /submit and in the newsletter, with a topic and a closing date. Publish the best responses together as a themed issue.
- Example copy: "This month's prompt: The rebooked flight. Where did you end up instead? Closes on the last day of November."
- Why: The Sun has run topic prompts with deadlines since 1978 [S32]. A true deadline is honest urgency; a fake one is a deceptive pattern [S28].

**5. Promise a fast, human reply, and keep the promise.**
- On the site: State the response window on /submit and send a personal acknowledgment (not just an auto-reply) within two days of each submission.
- Example copy: "A human editor in Copenhagen reads every story. You will hear from us within a week, usually sooner."
- Why: Mozilla found response time to be the biggest influence on contributor retention [S21]. "Receiving response" is a top newcomer barrier [S20]. Big outlets are slow [S35], so speed is an advantage.

**6. Edit with writers instead of rejecting them.**
- On the site: Describe editing as part of the offer. Internally, default to "revise together" for any true story with a pulse. Keep flat rejections for content that breaks the standards (promotion, listicles, made-up stories).
- Example copy: "Every story gets an editor. Most need one pass. Nobody gets graded."
- Why: Rejection was a key cause of newcomer loss on Wikipedia, especially when experienced editors rejected new ones [S12, S12b]. Hidden Compass sells rounds of editing as part of the deal [S33].

**7. Publish standards, including what you will not run.**
- On the site: A short "What we publish" section on /submit: first-person, true, specific, from people who went. Not listicles, sponsored trips or "top ten" lists. A selective tone raises status without pleading.
- Example copy: "We publish true stories from people who went. We pass on listicles, press trips and anything with an affiliate link."
- Why: Hidden Compass and Atlas Obscura publish what they want and do not want [S33, S29]. Injunctive (standard-setting) messages beat descriptive ones [S1].

**8. Pay contributors in credit: byline, bio, and an outbound link.**
- On the site: Every story ends with a contributor card: portrait, a two-line bio, their own link (Instagram, newsletter, site) and their founding badge. Each writer gets a profile page listing their stories and photos.
- Example copy (card heading): "Written by the person who went."
- Why: Substack's guest bios with subscribe links are the guest writer's payoff [S36]. Lonely Planet thanks readers by name in the next edition [S30]. Unsplash contributors asked to see where their work was used [S37].

**9. Send each writer the attention their story got, privately.**
- Off the site: Two weeks after a story goes live, send the writer a short note with reader replies, notable shares, and where the story was featured (newsletter, home lede). Keep any numbers in the private note, never on the site.
- Example copy (email): "Your Lisbon layover was the most-read story in this week's issue, and three readers wrote back about the tram."
- Why: Contribution tracks attention [S17] and audience size [S16]. Sharing it privately avoids small public counts [S6].

**10. Make the founding badge a standard, not a vacancy sign.**
- On the site: Talk about the badge as what founding writers earn ("the ones who were here first"), not as seats left. Mark it on bylines and profiles. Do not display how many remain.
- Example copy: "Founding writer. One of the first to put a layover on the record here."
- Why: Scarcity from demand reads better than scarcity from accident [S5]. False scarcity is deceptive [S28]. Showing openings repeats the descriptive-norm trap [S1].

**11. Replace vague calls to action with exact ones.**
- On the site: Swap "Your face could be here", "Get started" and "Join" for labels that name the action and the effort.
- Example copy: "Pitch a layover story", "Send one photo", "Give your pet a Paw Passport", "Read how editing works".
- Why: Generic labels stop users; link text should say exactly what happens next [S23].

**12. Ask inline, after the story, never in a pop-up.**
- On the site: A short block at the end of each story and at the bottom of the newsletter. No modal, no scroll-triggered overlay, no exit-intent window. That also protects the AdSense application and page experience.
- Example copy (end of story): "Been somewhere like this? Write it the way you would tell it at the gate."
- Why: Modals are among the most disliked formats [S24], and asks should come after the key task [S24b]. Google treats promotional overlays as intrusive interstitials [S26].

**13. Never shame the reader who says no.**
- On the site: Any decline option is neutral ("Not now" or "Maybe later"). No jokes at the reader's expense.
- Why: Confirmshaming is a recognized deceptive pattern [S27].

**14. Set the tone with the founder's own work, under real bylines only.**
- On the site: Keep Nancy's byline as one among several. Commission early pieces from friends and fellow travelers under their own bylines, with their consent. Never create personas.
- Why: Early seeding sets the tone [S39], but invented contributors would break "Written by the people who went". Recruit the hard side first [S38].

**15. Offer a human help desk for would-be writers.**
- On the site: A small "Ask the editor" link on /submit (an email or a short form) for people unsure whether their story fits. Answer personally.
- Example copy: "Not sure it is a story? Tell us in two lines and we will say what we would do with it."
- Why: A personal invitation to the Teahouse improved retention [S13]; automated welcomes did not [S14b]. "Finding a way to start" is a top newcomer barrier [S20].

---

## 5. What reads as needy, and what to say instead

| Reads as needy | Why (finding) | Say or do instead |
|---|---|---|
| "Open slot 04. Your face could be here." | Spotlights absence, so non-contribution becomes the norm [S1, S25] | Show the writers you have, then one tile: "Pitch your layover." |
| "Ninety-six more seats" or any visible count of openings | Small counts can depress action far from a goal [S6]; counts are banned on the site anyway | "Founding writers get a badge that stays on their byline." |
| "We need writers" or "Help us grow" | Signals that almost nobody writes [S1, S2] | "We publish true stories from people who went." |
| A modal asking readers to write before they have read anything | Most-disliked format; wrong timing [S24, S24b]; intrusive interstitial [S26] | An inline block at the end of the story: "Been somewhere like this? Write it the way you would tell it at the gate." |
| "Get started" or "Join" as the main button | Generic labels stop users [S23] | "Pitch a layover story" or "Send one photo" |
| "No thanks, I don't have any good stories" | Confirmshaming [S27] | "Not now" |
| "Only a few days left" with no real deadline | False urgency is a deceptive pattern [S28] | A real prompt with a real closing date [S32] |
| Silence after a submission, or a form-letter rejection | Slow replies and rejection drive newcomers away [S21, S12] | A personal acknowledgment within two days and an edit-together offer |
| A public leaderboard while the roster is small | Works only at scale; small boards read thin [S29c] | Private notes to each writer about their readers [S17] |
| Broadcast appeals on social media | Indirect asks are less effective than people think [S8] | One personal note to one named reader |

---

## 6. Source list

Marks: **[E]** seen in a search extract of that page; **[E2]** seen only in a secondary write-up of the original; **[U]** unverified. No page could be opened in full from this sandbox (see Section 0).

| ID | Source | URL | Mark |
|---|---|---|---|
| S1 | Cialdini, R. et al. (2006). "Managing social norms for persuasive impact." *Social Influence*. (Petrified Forest: 7.92% vs 1.67%; 7.92% vs 4.00% aggregate) | https://www.fs.usda.gov/psw/publications/winter/psw_2006_winter001.cialdini.pdf | E |
| S2 | Cialdini, R. (2007). Testimony to the US House Committee on Science | https://science.house.gov/sites/republicans.science.house.gov/files/documents/hearings/092507_cialdini.pdf | E |
| S3 | Griskevicius, Cialdini, Goldstein. Social norms (host unreachable from sandbox) | https://www3.uwsp.edu/cnr-ap/UWEXLakes/Documents/ecology/shoreland/marketing/social_norms_griskevicius.pdf | Not opened |
| S4 | Psychology Today, "The petrified wood principle" (secondary; its figures differ from S1) | https://www.psychologytoday.com/ie/blog/the-shaping-us/201909/the-petrified-wood-principle | E2 |
| S5 | Worchel, Lee, Adewole (1975). "Effects of supply and demand on ratings of object value." *JPSP* | https://uni-muenster.de/imperia/md/content/psyifp/aeechterhoff/vorlesungkommunikation/worchelleeeta_suppdemanobjval_jpsp1975.pdf | E (jar sizes in popular accounts: U) |
| S6 | "Social information decreases giving in late-stage fundraising campaigns." *PLOS ONE* | https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0278391 | E |
| S7 | NextAfter, petition social-proof experiment | https://www.nextafter.com/experiments/how-social-proof-impacted-petition-signature-rate/ | E |
| S8 | Flynn and Lake (2008). "If you need help, just ask." *JPSP* 95(1) | https://www.gsb.stanford.edu/faculty-research/publications/if-you-need-help-just-ask-underestimating-compliance-direct-requests | E |
| S8b | Stanford GSB, "Francis Flynn: If you want something, ask for it" | https://www.gsb.stanford.edu/insights/francis-flynn-if-you-want-something-ask-it | E |
| S9 | Freedman and Fraser (1966). "Compliance without pressure: the foot-in-the-door technique" | https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Influence_Compliance/Freedman_Fraser_Foot-in-the-door.pdf | E (percentages: U) |
| S10 | Grant and Gino (2010). "A little thanks goes a long way." *JPSP* (Harvard Gazette coverage) | https://news.harvard.edu/gazette/?p=133210 | E2 |
| S10b | Many Co-Authors project, data-review note on Grant and Gino (2010) | https://development.manycoauthors.org/gino/123 | E |
| S11 | Nielsen, J. "Participation inequality" (NN/g) | https://www.nngroup.com/alertbox/participation_inequality.html | E (ratio); tactics E2 via https://www.marketingprofs.com/opinions/2006/15209/jakob-nielsen-on-getting-more-users-to-contribute |
| S12 | Halfaker, Geiger, Morgan, Riedl. "The rise and decline of an open collaboration system." *American Behavioral Scientist* | https://stuartgeiger.com/papers/abs-rise-and-decline-wikipedia.pdf | E |
| S12b | Halfaker et al. (2011). Reverts and newcomers, WikiSym/OpenSym | https://opensym.cs.fau.de/ws2011/_media/proceedings%253Ap163-halfaker.pdf | E |
| S12c | University of Minnesota news release on S12 (host unreachable from sandbox) | https://cse.umn.edu/college/news/wikipedia-inadvertently-causing-its-own-decline-participation | Not opened |
| S13 | Morgan and Halfaker (2018). "Evaluating the impact of the Wikipedia Teahouse on newcomer socialization and retention." OpenSym | https://opensym.org/blog/2020/01/22/evaluating-the-impact-of-the-wikipedia-teahouse-on-newcomer-socialization-and-retention/ | E |
| S13b | Retention windows summarized in a later paper | https://arxiv.org/pdf/2308.09642 | E |
| S14 | Thanks feature research: Goel, Anderson, Zia (2019), plus CAT Lab experiments reported in the Signpost | https://arxiv.org/pdf/1903.03308 ; https://signpost.news/2020-08-02/Recent_research | E |
| S14b | French Wikipedia automated welcome messages (no significant effect), reported in Wikimedia research coverage | https://signpost.news/2021-10-31/Recent_research | E2 (the search extract did not make clear which listed page carried this finding; this URL is the most likely one, so check it) |
| S15 | Wikimedia Growth team, feature summary (suggested edits results) | https://www.mediawiki.org/wiki/Growth/Feature_summary | E |
| S15b | Wikimedia Research Newsletter, March 2024 (newcomer homepage study) | https://meta.wikimedia.org/wiki/Research:Newsletter/2024/March | E |
| S16 | Zhang and Zhu (2011). "Group size and incentives to contribute." *American Economic Review* | https://archive.nyu.edu/handle/2451/28501 ; https://bm.hkust.edu.hk/bizinsight/2011/08/group-size-and-giving | E |
| S17 | Huberman, Romero, Wu. "Crowdsourcing, attention and productivity" | https://arxiv.org/abs/0809.3030 | E |
| S18 | Kraut and Resnick. *Building Successful Online Communities* (MIT Press) | https://penguinrandomhouse.com/books/655422/building-successful-online-communities-by-robert-e-kraut-and-paul-resnick-with-sara-kiesler-moira-burke-yan-chen-niki-kittur-joseph-konstan-yuqing-ren-and-john-riedl | E (structure only; specific claims U) |
| S19 | GitHub Docs, "Encouraging helpful contributions to your project with labels" | https://docs.github.com/en/github/building-a-strong-community/encouraging-helpful-contributions-to-your-project-with-labels | E |
| S20 | Steinmacher, Silva, Gerosa, Redmiles (2015). Systematic review of newcomer barriers | https://experts.nau.edu/en/publications/barriers-faced-by-newcomers-to-open-source-projects-a-systematic-/ | E |
| S20b | Steinmacher et al. (CSCW 2015). Social barriers for first contributions | https://www.ime.usp.br/~gerosa/papers/CSCW_2015.pdf | E |
| S21 | Mozilla wiki, Contribute/Coding/Mentoring (response time guidance) | https://wiki.mozilla.org/Special:MobileDiff/957128 | E (percentages via Ansible wiki: U, https://github-wiki-see.page/m/ansible/community/wiki/Contributor-Experience:-Plan) |
| S22 | freeCodeCamp, "How to attract new contributors to your open source project" (opensource.guide itself unreachable) | https://www.freecodecamp.org/news/how-to-attract-new-contributors-to-your-open-source-project-46f8b791d787/ | E2 |
| S23 | NN/g, "'Get Started' stops users" | https://www.nngroup.com/articles/get-started/ | E |
| S24 | NN/g, "The most hated online advertising techniques" (2017 survey) | https://www.nngroup.com/articles/most-hated-advertising-techniques/ | E |
| S24b | NN/g, "Popups: 10 problematic trends and alternatives"; "Overlay overload" | https://www.nngroup.com/articles/popups/ ; https://www.nngroup.com/articles/overlay-overload/ | E |
| S25 | NN/g, "Designing empty states in complex applications: 3 guidelines" | https://www.nngroup.com/articles/empty-state-interface-design/ | E |
| S26 | Google Search Central, "Interstitials and dialogs"; "Understanding page experience" | https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials ; https://developers.google.com/search/docs/appearance/page-experience | E |
| S27 | deceptive.design, "Confirmshaming" | https://www.deceptive.design/types/confirmshaming | E |
| S28 | FTC staff report "Bringing Dark Patterns to Light" (Sept 2022), via law-firm summaries | https://www.hunton.com/privacy-and-cybersecurity-law-blog/ftc-releases-report-on-dark-patterns ; https://www.venable.com/insights/blogs/2022/09/the-ftc-brings-more-light-to-dark-patterns-in-new | E2 |
| S29 | Atlas Obscura FAQ (adding places, editorial review); full fetch blocked | https://assets.atlasobscura.com/faq | E |
| S29b | Get Together, interview transcript with Jonathan Carey (Atlas Obscura) and summary article | https://gettogether.world/transcript/jonathan-carey ; https://gettogether.world/articles/atlas-obsucra | E2 |
| S29c | Atlas Obscura regional guide leaderboards (Colorado, Omaha) | https://www.atlasobscura.com/things-to-do/colorado ; https://www.atlasobscura.com/things-to-do/omaha-nebraska | E |
| S30 | Lonely Planet *South America* index PDF ("Our Readers" thanks) | https://media.lonelyplanet.com/shop/pdfs/south-america-12-index.pdf | E |
| S30b | *Christian Science Monitor* (1992), "Candid Aussie guidebooks to pack" | https://www.csmonitor.com/1992/0207/07121.html | E |
| S31 | Atlas and Boots, "Announcing our new role as Lonely Planet Trailblazers"; PocketCultures on Lonely Planet blogger programs | https://www.atlasandboots.com/?p=29080 ; https://pocketcultures.com/2010/05/11/world-travel-bloggers-and-lonely-planet/ | E2 |
| S32 | The Sun, "Upcoming Readers Write deadlines" notices | https://thesunmagazine.org/news/upcoming-readers-write-deadlines-2024-02 ; https://thesunmagazine.org/news/category/submissions | E (2024 notices; current topics U) |
| S33 | Hidden Compass, Contributor Guidelines | https://hiddencompass.net/contributor-guidelines/ | E |
| S33b | Duotrope listing for Hidden Compass (rates, response) | https://duotrope.com/magazine/hidden-compass-magazine-22659 | E2 |
| S34 | Format Magazine, interview with Roads & Kingdoms photo editor Pauline Eiferman | https://format.com/magazine/roads-kingdoms-pauline-eiferman-interview | E |
| S35 | Chill Subs, Modern Love listing (user-reported response time) | https://www.chillsubs.com/magazine/modern-love | E2 |
| S36 | Substack, "New ways to recommend and discover great writing" (guest posts) | https://on.substack.com/p/new-ways-recommend-discover | E |
| S37 | Unsplash Census Report 2019 | https://unsplash.com/blog/unsplash-census-report-2019 | E |
| S38 | Andrew Chen, *The Cold Start Problem*, via Lenny's Newsletter and a book summary | https://www.lennysnewsletter.com/p/atomic-network ; https://productandrew.substack.com/p/product-31 | E2 |
| S39 | Vice, "How Reddit got huge: tons of fake accounts"; Daily Dot on Huffman | https://www.vice.com/en/article/how-reddit-got-huge-tons-of-fake-accounts-2/ ; https://dailydot.com/business/steve-huffman-built-reddit-fake-accounts/ | E2 |
| S40 | Richardson, Huynh, Sotto. *Get Together* (Stripe Press, 2019), publisher description | https://readings.com.au/product/9781732265196 | E (book contents beyond the description: U) |

Hosts that could not be reached from this sandbox and need to be allowed in the session's network settings for a verification pass: `www3.uwsp.edu`, `cse.umn.edu`, `opensource.guide`, `assets.atlasobscura.com` (and, by the same rule, likely most others).
