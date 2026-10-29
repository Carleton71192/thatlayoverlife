# Contributor credentials as a mini portfolio: a STORM research report

Prepared for Nancy, That Layover Life (thatlayover.life), Copenhagen
Date: 29 October 2026
Question: "I would love to do more STORM research for how to do this. Some of the upworkers are so proud of their credentials, like a mini portfolio of travel badges / logos could be worthwhile."
Working question: how should a contributor's credentials show on the byline card and the profile page, as a small portfolio of travel badges and outlet names, so that it rewards the writer, earns reader trust, and does not read as spam, bragging or a needy growth hack?

Builds on: handoff/CONTRIBUTOR-GROWTH-STORM-2026-10-29.md, practice 8 ("pay contributors in credit: byline, bio, and an outbound link") and practice 10 ("make the founding badge a standard, not a vacancy sign"). That report covered why credit matters and how to ask. This one covers what goes on the card, how it is checked, and what must never appear. Its sources are cited here as "growth report S-number" and are not repeated.

---

## 0. Read this first: how the evidence was gathered

- Method: STORM (Stanford's "Synthesis of Topic Outlines through Retrieval and Multi-perspective question asking"). Eight perspectives were defined, each asked its own questions, each question was answered from web research, then the answers were outlined and written up.
- Network limits in this session. A direct page fetch of `www.ftc.gov` failed (the host did not resolve from the sandbox). Following the sandbox guidance and the lesson of the earlier report, no other hosts were tried. To open pages in full, `www.ftc.gov` and the other hosts in Section 9 must be allowed in the session's network settings.
- What that means for citations. Every claim comes from web search results, which return extracts of the named pages. No page was opened in full. Each source in Section 9 carries one mark:
  - **[E]** The claim appears in a search extract of that exact page (usually the primary page: the paper, the platform's help page, the official announcement). The full page was not opened.
  - **[E2]** The claim appears only in a secondary write-up (trade press, law-firm summary, blog).
  - **[U]** Unverified. A lead, not a fact.
- No number or quote in this report was invented. Where sources disagree, the report says so. Before any figure is quoted on the site or in a pitch, open the source from an unrestricted machine.
- Nothing here is legal advice. The legal perspective (P4) flags risks for a lawyer to confirm.

House-style note: every example line meant for the site follows the house rules. US English, no em dashes, no exclamation marks, none of the banned words, and no typed counts. Curly-brace items such as `{Publication}` are placeholders filled from live data.

### 0.1 What TLL already has (from the repo)

These facts, read from the handoff files, shape every recommendation below.

| Already in place | Where it is recorded | Why it matters here |
|---|---|---|
| `badge-label` on Contributors, editor-set (Nancy's is "FOUNDER · EDITOR"), shown as one label top-left on the profile hero and the /travelers card | handoff/CHANGE-LOG-PACKET-C-2026-10-20.md C2.1, C3.2, C6.2 | There is already a single editor-owned badge slot. The member save route must never write it (packet-c/CONTRACTS.md). |
| `press-verified`, editor only, renders a teal "Verified press" chip; press list shows "VERIFIED · {editor}" | STATUS.md C05; CHANGE-LOG-PACKET-C C4.7 | A manual, editor-checked verification pattern already exists. Reuse it for all claimed credentials. |
| Designations "Location Expert", "Press · The Pros", "Blog on the Wire", with "apply, a human reviews within 48h" | CHANGE-LOG-PACKET-C line 8; STATUS.md B12 | These are reviewed roles, not self-awarded badges. |
| Pursuits (Dog Travel, Trekking, Marathons, Foodie), opt-in per hub | CHANGE-LOG-PACKET-C C7.1 | Interests, not credentials. Keep them visually separate. |
| `map-snapshot` JSON (countries, antarctica, places, layovers, savedAt) written only after a map save; `share-ranges` shows "80-something" | packet-c/CONTRACTS.md, Map snapshot | Travel stamps can be computed live and shown as ranges. `savedAt` is a privacy hazard if ever displayed. |
| `credit-mode` Full, First or Pen, plus `pen-name` | packet-c/CONTRACTS.md | Some members write under a pen name. A verified outside byline could unmask them. |
| Typed counts retired (country-count, published-count and others) | packet-c/CONTRACTS.md | Every number on a badge must come from live data. |
| Layover Club `club-supporter` boolean planned, "the tip jar with a badge" | STATUS.md E03; CHANGES.md | This is a bought mark. It must never sit in the credential row. |
| Contributors collection is at 50 custom fields | CHANGE-LOG-PACKET-C C7.1 | Credentials should live in one structured field, not one field per badge. |
| Link stack renders `rel noopener nofollow ugc` | STATUS.md C15 | Credential links should follow the same rule. |

---

## 1. Perspectives used

| # | Perspective | Who it stands in for |
|---|---|---|
| P1 | Freelance travel writer building a portfolio | Upwork, Contently, Muck Rack, Substack, Medium, LinkedIn users |
| P2 | Reader, search quality rater and AdSense reviewer | Google's helpful-content guidance and rater guidelines (E-E-A-T), NYT enhanced bylines, Lonely Planet author pages, Condé Nast Traveler, Wirecutter, NN/g |
| P3 | Gamification and badge researcher | Open Badges and Credly, Stack Overflow studies, Wikipedia barnstar experiments, Hamari, Deci and Ryan, Duolingo, Foursquare, Google Local Guides, Tripadvisor, Strava |
| P4 | Trademark and advertising lawyer | Nominative fair use (New Kids on the Block), logo-bar risk, publisher brand policing, FTC Endorsement Guides and review rule, Danish Marketing Practices Act |
| P5 | Trust and safety lead (verification and fraud) | Muck Rack verification, LinkedIn verifications, ORCID trust markers, Credly links, NomadMania travel verification, trade bodies (SATW, The Travel Institute, ASTA) |
| P6 | Traveler privacy and safety advocate | Strava heatmap and Local Legends, insurer advice on delayed posting, passport MRZ exposure, Atlas Obscura visited lists |
| P7 | Product designer and accessibility reviewer | Badge-tier design, Discourse badge spec, Duolingo clutter critique, WCAG 2.2 |
| P8 | Social psychologist of self-presentation (added) | Sezer, Gino and Norton on humblebragging; Pfeffer and Fong on third-party praise |

P8 was added because Nancy's worry ("bragging") is a self-presentation question, and research on it changes who should "speak" a credential.

---

## 2. Simulated conversations (questions and grounded answers)

### P1. Freelance travel writer building a portfolio

**Q1. What do freelance platforms actually show as credentials?**
Upwork shows four talent badges: Rising Talent, Top Rated, Top Rated Plus and Expert-Vetted. Its help pages describe Top Rated as the top 10% of talent, Top Rated Plus as the top 3%, and Expert-Vetted as the top 1%, with Expert-Vetted shown only to certain client plans. Top Rated needs a Job Success Score of at least 90%, and Upwork re-checks eligibility every two weeks. [C32, E] So an Upwork badge is earned, ranked and perishable. A copy of it on TLL would go stale.

**Q2. What do editors check in a writer's portfolio?**
Contently calls its portfolio a "content marketing resume-meets-LinkedIn". Its guidance says to add at least three clips tagged with topics and skills, and its managing editors check that clips match the experience claimed in the bio. [C34, E] The clip, not the logo, is the credential.

**Q3. What does a journalist's "verified" mean elsewhere?**
On Muck Rack, profiles are generated automatically and can be claimed, but the green check is applied by its editorial team. A company representative said "Verification is manual, applied by folks on my team who follow a strict set of criteria." [C33, E] Claiming and verifying are separate steps.

**Q4. Which badges carry status because they cannot be bought?**
Substack's bestseller badges are "assigned solely according to how many paid subscribers a writer has" and cannot be bought, in three colors. Third-party guides give different thresholds for the top color (tens of thousands versus 10,000 or more). [C35, E; thresholds E2 and in disagreement] Medium's Top Writer badges appear to have been dropped in favor of its Boost program, but this rests on writer accounts only. [C36, U]

**Q5. What happens when a platform's badge loses meaning?**
LinkedIn retired its gold "Community Top Voice" badge for Collaborative Articles in October 2024. The stated reason was quality control, because the badge was awarded automatically. Commentators linked it to AI-written answers, which is interpretation, not LinkedIn's statement. The invitation-only blue Top Voice badge, chosen by LinkedIn's editors, was kept. [C27, E2]

**Key findings (P1):** Writers value credentials that are earned, checked and scarce. Platform badges are perishable, so link to the live source instead of copying the image. Clips are the proof. Automatic badges lose value; editor-chosen ones keep it.

### P2. Reader, search quality rater and AdSense reviewer

**Q1. What does Google ask about authors?**
Google's 2022 update added Experience to E-A-T and described it as content produced with some degree of experience, "such as with actual use of a product, having actually visited a place". [C3, E] Its helpful-content guidance frames self-assessment around "Who, How, and Why" [C2, E]. Secondary reproductions of the "Who" questions ask whether it is self-evident who wrote the content, whether bylines appear where expected, and whether they lead to information about the author's background and expertise. [C1, E2]

**Q2. What do raters do with that?**
The rater guidelines contain a section on finding who is responsible for a site and who created the content, and a section on the reputation of content creators, researched off the page (news, magazine articles, independent ratings). [C4, E2] Danny Sullivan has said E-E-A-T is not itself a ranking factor; raters check whether Google's systems work. [C3b, E2] Disagreement: a Google AdSense community guide says AdSense reviewers assess a site's E-E-A-T foundation [C6b, E2], while Google's own AdSense policy text found here says only that ads are not allowed on screens with low-value content [C6, E]. Either way, clear author pages help and cost nothing.

**Q3. Is there any new risk in credential display?**
Yes. Google's people-first content page now calls fabricated creator profiles, including invented names, AI-generated headshots and false credentials, a form of deception that makes a page untrustworthy. Coverage dates the change to early October 2026 and differs on the exact day. [C5, E2] An over-claimed or unchecked credential is now a trust risk, not just an awkward one. This also confirms the earlier report's rule against invented members.

**Q4. How do serious publications show author credentials?**
The New York Times rolled out expanded byline pages in January 2024 with sections "What I Cover", "My Background", "Journalistic Ethics" and "Contact Me". Its trust-team editor said readers responded especially well to the ethics section. [C7, E2; C8, E2] Lonely Planet author pages list a home city, the writer's destination specialties and how long they have written for Lonely Planet. [C9, E] Neither leads with logos. Both lead with places and practice.

**Q5. How do travel publications treat freebies?**
Lonely Planet guidebooks have stated that writers "do not accept payments, discounts or freebies in exchange for positive coverage of any sort", with rare approved exceptions disclosed to readers. [C10, E2, mostly 2008 coverage] Condé Nast Traveler's long-running "Truth in Travel" policy had contributors pay the same prices as readers; Skift reported that this was later loosened to allow media rates. [C11, E2, date not in the extract] Wirecutter's own trust page could not be retrieved. [C12, U]

**Q6. Do bylines always help?**
NN/g says there is "no single answer to the Web bylines question". Bylines help when the author is known to the audience, holds a credential or has relevant experience. [C13, E] Google, by contrast, recommends accurate author information wherever readers would expect it. [C1, E2] For a site whose promise is "Written by the people who went", the byline is the product, so the NN/g caution applies only to card clutter.

**Key findings (P2):** Lead with experience (places written from, stories published here). Make every byline click through to a profile with background and an ethics or disclosure line. Never let a credential claim outrun its proof. Profile pages should be readable by machines (Google's ProfilePage markup is built for creators sharing first-hand perspectives [C14, E]).

### P3. Gamification and badge researcher

**Q1. What makes a badge a credential rather than a sticker?**
The Open Badges 3.0 standard from 1EdTech builds each badge as a W3C Verifiable Credential carrying the issuer, the earner, the achievement, the criteria and evidence. [C15, E] Credly badges look like images but link to metadata on Credly, where a viewer can check them. [C16, E2] A badge earns trust when anyone can see who issued it, for what, and the evidence.

**Q2. Do badges change behavior?**
Evidence disagrees. Anderson, Huttenlocher, Kleinberg and Leskovec found Stack Overflow badges steer behavior consistent with their model. [C18, E] A later reanalysis, "The Phantom Steering Effect", found steering less widely applicable and most users apathetic to badges. [C19, E] Hamari's 2013 experiment found that simply adding badges did not raise activity, except among users who watched their own and others' badges [C20b, E]; his 2017 two-year field study found significant increases on all four measures [C20, E]. Conclusion: badges are a modest lever. Their bigger job at TLL is credit and trust, not driving output.

**Q3. Does peer recognition work better than automatic awards?**
In a randomized experiment, Wikipedia editors given a barnstar were about 60% more productive than controls and about six times more likely to get further barnstars. [C21, E] An analysis of about 14,000 barnstars found they recognized a wide range of work beyond editing, including social support. [C22, E] Wikipedia's barnstar page says anyone can award one and is an essay, not a policy. [C23, E] A German Wikipedia award experiment reported higher newcomer retention, but the source was not confirmed here. [C24, U]

**Q4. Can rewards backfire?**
Deci, Koestner and Ryan's 1999 meta-analysis of 128 studies found that expected, tangible rewards contingent on doing a task reduced free-choice intrinsic motivation, while positive feedback enhanced it. [C25, E] Cameron and Pierce disputed how general the harm is, and the debate continues. [C25, E] For TLL, a written note from the editor ("for the night on the gate floor") is the safer kind of reward than a points ladder.

**Q5. How many tiers and badges?**
Stack Overflow uses three tiers (bronze, silver, gold). [C17, E] Immorlica, Stoddard and Syrgkanis show that a badge's value depends on how many people hold it, and that the best design mixes coarse and fine tiers depending on how users value status; in one version a single badge dividing users into two classes gives a constant approximation. [C17, E] Discourse designers debated whether a forum needs three classes at all. [C58, E] Google Local Guides uses ten levels and puts a visible badge only from Level 4 up. [C30, E] Duolingo redesigned its achievements in 2023 because badges "tucked into the profile page" were hard to find and celebrate; an early Duolingo test found that congratulating sign-up underwhelmed, since signing up is not an achievement. [C29, E; the test is E2] A UX critique called the achievements clutter. [C29b, E2]

**Q6. What happens when badges are removed or made cheap?**
Foursquare dropped badges and its "mayor" titles in 2014 to focus on discovery, upset some users, and brought mayor titles back in Swarm in 2015. [C26, E] Twitter's paid blue check in November 2022 was abused within days; a fake Eli Lilly account posted that insulin was free, and paid verification was paused. [C28, E] When a mark of trust can be bought, it stops meaning trust. Tripadvisor has long given reviewers badges by review count, including a gold Top Contributor badge [C31, E, article date not in the extract]; no source here confirmed any later change.

**Key findings (P3):** Few badges, clear criteria, visible issuer and evidence. Prefer editor-given, specific recognition over automatic points. Never sell a mark that sits beside credentials. Plan badges you will not need to take away.

### P4. Trademark and advertising lawyer

**Q1. Can a writer show a magazine's logo because they wrote for it?**
In the US, the nominative fair use test from *New Kids on the Block* asks three things: the outlet is not readily identifiable without the mark, only so much of the mark is used as is reasonably necessary, and nothing suggests sponsorship or endorsement. [C42, E2] Plain text names are easier to defend than stylized logos. The logo point comes from a footnote that commentators call dicta, and McCarthy is cited as saying there is no per se rule against logos; it is decided case by case. Circuits also differ (the Third Circuit treats it as an affirmative defense). [C42, E2]

**Q2. What about "as featured in" logo bars?**
General guidance warns that a logo near your own brand, especially prominent or repeated in a header or footer, can imply endorsement or a partnership, and recommends written permission. [C43, E2] A freelancer's blog says outlet logos on writers' sites are common and rarely enforced, while still advising permission. [C44c, E2] Sources disagree on risk in practice; they agree that text names carry less risk.

**Q3. Do travel publishers police their marks?**
Condé Nast barred its magazine logos from native ads [C44, E2] and sued a dog magazine named "Dogue" in December 2025 over styling it said imitated Vogue. [C44b, E2] No Condé Nast policy for contributor portfolios was found. [U]

**Q4. If a writer's trip was hosted or paid, does a badge cover it?**
No. The FTC Endorsement Guides require disclosure of connections that could affect how much weight readers give an endorsement, and the 2023 revision requires disclosures to be "clear and conspicuous", meaning hard to miss and easy to understand. [C45, E2] The FTC's own influencer template says to disclose where readers will see it. [C45b, E] The 2024 FTC rule on reviews and testimonials (16 CFR Part 465) covers undisclosed insider reviews and buying or selling fake indicators of social media influence; sources disagree on its effective date (October 2024 dates differ). [C46, E2] Free travel is a thing of value, but no source here addressed travel specifically. [U]

**Q5. TLL is run from Copenhagen. Which rule applies at home?**
Denmark's Marketing Practices Act § 6(4) requires traders to state commercial intent clearly. The Consumer Ombudsman recommends labels such as "reklame" or "annonce", and treats influencers who operate with a CVR number as traders for all their content. [C47, E2] The /for-affiliates page already plans "Reklamelink" markers (STATUS.md B18), so the habit exists.

**Key findings (P4):** Use outlet names as plain text in TLL's own type. Do not build a logo wall. Disclose hosted or paid travel at the top of the story, in words, never as a badge. Nancy's own byline needs an insider line on stories she edits and publishes.

### P5. Trust and safety lead (verification and fraud)

**Q1. How do serious registries label who said what?**
ORCID records the provenance of each assertion: entries added by the person are self-asserted, entries added by member organizations through ORCID's API carry more weight, and both are labeled. [C38, E] LinkedIn shows a verification badge and, when clicked, lists which verifications are active (identity, workplace by work email and other methods, education); viewers see that a workplace was verified, not the email. [C37, E] One guide says new LinkedIn verifications were paused; LinkedIn's own pages describe them as current. [C37, E2, disagreement]

**Q2. Can travel itself be verified?**
NomadMania verifies countries visited by asking for proof of a random sample of claimed places (visas or stamps, boarding passes, bills, photos). Passing earns a profile badge. [C39, E] This works for a ranking community. For TLL it would mean handling passport and boarding-pass images, which P6 rules out.

**Q3. How are trade credentials checked?**
SATW sets a points chart for membership (paid, editorial work) and requires members to requalify every three years. [C40, E] The Travel Institute publishes agent profile pages that show a CTA and its continuing-education status; ASTA's Verified Travel Advisor (VTA) holders appear in ASTA's consumer search. [C41, E2] Both give a page a TLL editor can link to.

**Q4. What is the cheapest reliable check for a "published in" claim?**
A link to the clip on the outlet's own domain that names the writer. Contently editors already check that clips match the bio. [C34, E] Muck Rack's manual review uses recent work as a criterion. [C33, E] For pen-name members, see P6 Q5.

**Q5. Do credentials need re-checking?**
Yes. Upwork re-checks Top Rated every two weeks [C32, E], SATW every three years [C40, E], and The Travel Institute shows CE status with an end date [C41, E2]. LinkedIn's gold Top Voice badges expired 60 days after award. [C27, E2] A TLL "checked" label needs a date.

**Key findings (P5):** Label provenance on every claim (earned here, checked by the editor, self-reported). Verify by link to the issuer or the clip, never by uploaded documents. Date every check.

### P6. Traveler privacy and safety advocate

**Q1. Can aggregate travel data reveal people?**
Yes. Strava's public heatmap revealed military base locations and activity patterns in January 2018. [C48, E] Researchers at KU Leuven showed that Strava-style endpoint privacy zones can be bypassed to find a home location. [C49, E2]

**Q2. Can a badge itself reveal where someone is?**
Yes. Strava's Local Legend goes to whoever completes a segment most often over 90 days; a child-safety guide warns that a Local Legend near home lets strangers infer where the person lives. [C50, E] A "most visits" or "recent" badge is a location beacon.

**Q3. Why delay travel signals?**
Insurers and security commentators advise waiting until you are home to post trip photos, because thieves look for empty homes. One UK insurer counted 6,248 posts that gave details of when the person would be away. [C51, E2; mostly insurer surveys, no peer-reviewed study found] A badge that unlocks the moment a member logs a new country does the same thing.

**Q4. Are passport stamps safe to show as images?**
Not real ones. Passport photo pages carry a machine-readable zone with passport number, date of birth and expiry, and guidance says not to post passport images. [C52, E2] Boarding-pass barcodes were not covered by the sources found. [U] TLL "stamps" must be TLL artwork, never photos of documents.

**Q5. Can a public visited list be a problem?**
Atlas Obscura profiles show places a user has been, and its regional leaderboards rank "places visited". A user request on a third-party feedback board asked for a fully private profile. [C53, E for the profile features; E2 for the request] TLL members using a pen name or first-name credit mode could be identified if a verified outside byline sits next to their pen name. (Inference from TLL's credit-mode field; no external source.)

**Key findings (P6):** Stamps are historical, coarse and lagged. No dates, no "new", no "most recent", no ordering by time. No document images. Credentials obey the member's credit mode.

### P7. Product designer and accessibility reviewer

**Q1. How many marks fit on a byline card?**
No source gave a tested number for article bylines. Research favors few tiers (P3 Q5). An often-repeated claim that NN/g found five to seven logos credible and twelve or more clutter could not be traced to NN/g. [C57, U] The proposal below uses three on the card as a design choice, not a research finding.

**Q2. Logos or text?**
Text, for three reasons: legal (P4 Q1), visual (outlet logos come in clashing colors and weights, which reads as a logo wall), and access (WCAG 1.1.1 needs a text alternative for every logo image). [C56, E2]

**Q3. Can color carry meaning, such as "verified is teal"?**
Not alone. WCAG 1.4.1 says color cannot be the only way information is conveyed. [C56, E2] The verified mark needs the word ("Checked") as well as teal #067A79 on light.

**Q4. What about touch targets on mobile?**
WCAG 2.2 adds 2.5.8 Target Size (Minimum) at level AA. [C56, E2] The 24 by 24 CSS pixel figure could not be confirmed in the extracts. [U] Each credential chip that links somewhere should be a full-height row or chip on mobile, not a tiny icon.

**Q5. Should badges celebrate when earned?**
Duolingo made achievements shareable and tiered because hidden badges were hard to celebrate. [C29, E] For TLL, the celebration belongs in a private note from Nancy and in a shareable card the member chooses to post, not in a site-wide feed.

**Key findings (P7):** Three marks on the card, text first, a word next to every color, a link per claim, and a profile section for the rest.

### P8. Social psychologist of self-presentation

**Q1. Is it better to brag plainly or modestly?**
Sezer, Gino and Norton found humblebragging (bragging masked as complaint or humility) was judged less likable and less competent than plain bragging; sincerity was the key ingredient. [C54, E; study counts differ between preprint and paper]

**Q2. Does it help if someone else says it?**
Pfeffer and Fong found that having an agent sing one's praises produced more favorable perceptions and more willingness to help, even when the agent was visibly on the person's side. [C55, E] On TLL, the site and editor can state the credential, so the writer does not have to.

**Q3. What does that mean for wording?**
Facts in the site's voice ("Published in {Publication}"), not superlatives in the writer's voice ("award-winning", "top"). The writer's own bio stays personal and about travel.

**Q4. Does a credential row risk making first-timers look lesser?**
It can, and that cuts against "Written by the people who went". The earlier report found that displaying absence sets a bad norm (growth report S1, S25). So a card with no outside credentials must look complete, never like empty slots. (Inference from the earlier report's sources.)

**Key findings (P8):** Let the site speak the facts. Keep the writer's bio sincere. Never show empty credential slots.

---

## 3. Outline that the practices were built from

1. Three families, never mixed: earned here, claimed and checked, and bought (P1 Q4 to Q5, P3 Q6, P5 Q1).
2. Provenance and evidence on every claim (P3 Q1, P5 Q1 to Q4, P2 Q3).
3. Experience first: stories and places outrank outside logos (P2 Q1, Q4).
4. Text, not logos (P4 Q1 to Q3, P7 Q2).
5. Few marks on the card, the full portfolio on the profile (P3 Q5, P7 Q1).
6. Live and lagged: computed counts, coarse ranges, no live location (house rule, P6 Q1 to Q4).
7. Disclosure belongs in the story, not in a badge (P4 Q4 to Q5, P2 Q5).
8. Let the editor speak (P8 Q1 to Q3, P3 Q3 to Q4).
9. Respect pen names and first-timers (P6 Q5, P8 Q4).
10. Re-check and date (P5 Q5).

---

## 4. Ranked practices for That Layover Life

Ranked by evidence strength times effect on trust and on the "bragging or needy" problem, cheapest wins first where they tie.

**1. Keep three families of marks, visually distinct, and never mix them.**
- Site action: On the byline card and profile, earned-here marks (Founding writer, Location Expert, Editor's pick) use TLL's own stamp style; claimed credentials use plain text chips with a provenance word; the Layover Club supporter mark appears only on the profile, in a separate "Supports TLL" line, never in the credential row and never on the byline card.
- Example copy: "Earned on That Layover Life" (section label); "Checked by the editor" (chip suffix); "Supports TLL" (profile only).
- Sources: C28 (paid blue check abused), C35 (Substack badges cannot be bought), C27 (automatic badge retired, editor-chosen kept), C32.

**2. Put a provenance label on every claimed credential.**
- Site action: Each credential on the profile carries one of three labels: "Earned here" (computed by TLL), "Checked by the editor, {Month Year}" (Nancy opened the evidence), or "Self-reported" (added by the member, not yet checked). Only "Earned here" and "Checked" items may appear on the byline card. Reuse the existing `press-verified` pattern: the member can add, only the editor can mark checked.
- Example copy: "Checked by the editor, October 2026" / "Self-reported by {first name}".
- Sources: C38 (ORCID provenance), C37 (LinkedIn lists active verifications), C33 (Muck Rack manual check), C5 (false credentials as deception).

**3. Link every claim to its evidence.**
- Site action: A "Published in" item is valid only with a URL to the clip on the outlet's own domain that names the writer. A certification is valid only with a link to the issuer's page (Credly badge page, Travel Institute profile, ASTA advisor search, SATW directory). Store the URL with the claim; render it as "Read the clip" or "See the credential". Links use `rel="noopener nofollow ugc"`, matching the link stack.
- Example copy: "Published in {Publication} · Read the clip"
- Sources: C15 (criteria and evidence in Open Badges), C16 (Credly verification link), C34 (editors check clips against bios), C41.

**4. Lead with experience: places written from and stories published here.**
- Site action: The first line under the writer's name on the card is experience, computed from published TLL stories: the countries their published stories are set in, as small TLL flag stamps, plus their story count from the Stories collection. Outside credentials come second.
- Example copy: "Has written here from {Portugal} and {Vietnam}" / "{n} stories on That Layover Life" (n read live, never typed).
- Sources: C3 ("having actually visited a place"), C9 (Lonely Planet author pages lead with destinations), C7 (NYT "What I Cover", "My Background").

**5. Show outlet names as text in TLL's type, never a logo wall.**
- Site action: The "Published in" row is plain words in TLL's body font, one weight, separated by middots. No third-party logo files, no outlet colors, no "As seen in" header. If a member insists on a logo, it needs the outlet's written permission on file and still never appears on the byline card.
- Example copy: "Published in {Publication} · {Publication} · {Publication}"
- Sources: C42 (use only what is necessary; text is easier to defend), C43 (logos near your brand imply endorsement), C44 and C44b (Condé Nast polices its marks), C56 (logo images need text alternatives anyway).

**6. Cap the byline card at three marks; the full portfolio lives on the profile.**
- Site action: Card order: (1) one earned-here mark (the `badge-label` slot, e.g. Founding writer), (2) one checked credential chosen by the member, (3) one travel stamp (country range from `map-snapshot`, only if `share-ranges` is on). Then the existing outbound link. Everything else sits on the profile under "Credentials" with a link "See {first name}'s credentials". If a writer has no outside credentials, slot 2 simply does not render; the card never shows an empty chip.
- Example copy: "See {first name}'s credentials"
- Sources: C17 (few tiers), C58, C29b (clutter critique), growth report S1 and S25 (never display absence).

**7. Compute every site badge and count from live data, and keep criteria public.**
- Site action: Founding writer is set from story publish order, story counts come from the Stories collection, country ranges come from `map-snapshot`. Nothing is typed into a badge. Each earned badge links to a short "How badges work" section stating its criteria in one sentence.
- Example copy: "Founding writer: among the first writers published on That Layover Life. It stays on the byline for good."
- Sources: C15 (criteria are part of a badge), C30 (Local Guides levels follow points), C35 (Substack badge follows paid count), C27 (automatic awards without review lost value; so editor-reviewed roles stay editor-reviewed).

**8. Keep travel stamps historical, coarse and lagged. Never live.**
- Site action: Stamps show all-time ranges ("80-something countries", "+ Antarctica"), never exact counts when `share-ranges` is on, never dates, never order, never "new" or "latest". Never display `savedAt`. Country stamps earned from the map appear in a monthly batch, not at save time, so a stamp never announces a trip in progress. Stamps tied to published stories are safest, since publication already lags the trip.
- Example copy: "80-something countries, all time" / "Stamps update monthly."
- Sources: C48, C49 (aggregate location leaks), C50 (frequency badges reveal home), C51 (delay posting).

**9. Add one editor-given, story-specific recognition.**
- Site action: An "Editor's pick" mark that Nancy attaches to a specific story with a one-line reason, shown on that story's byline card and listed on the profile. It is given, not unlocked, and not tied to a threshold.
- Example copy: "Editor's pick, for the night on the gate floor in {city}"
- Sources: C21 (barnstars raised productivity), C22 (barnstars recognize varied work), C25 (positive feedback supports motivation; expected contingent rewards can undermine it).

**10. Disclose affiliations and hosted travel in the story, in words, not as a badge.**
- Site action: A disclosure line at the top of any story where travel, stays or meals were hosted, discounted or paid for, or where the writer has a commercial tie to a place named. Nancy's own stories carry an owner-and-editor line. Affiliate or sponsored links keep the planned "Reklamelink" marker. A credential such as "Travel advisor, VTA" on a profile is never a substitute for a per-story disclosure.
- Example copy: "Disclosure: {Hotel} hosted two nights. That Layover Life took no payment." / "Nancy owns and edits That Layover Life."
- Sources: C45, C45b (clear and conspicuous, where readers will see it), C46 (insider connections), C47 (Danish § 6(4), "reklame"), C10, C11.

**11. Let the site state the credential; keep the writer's bio sincere.**
- Site action: Credential lines are rendered by TLL in a neutral factual voice. The member's own bio stays first person and about travel. Edit-profile guidance discourages superlatives ("award-winning", "top", "leading") in the bio and moves verifiable facts into the credential list instead.
- Example copy (edit-profile hint): "Keep your bio about how you travel. Add bylines and certificates below, and we will show them for you."
- Sources: C54 (sincerity beats humblebragging), C55 (third-party praise is received better).

**12. Respect credit mode: credentials never unmask a pen name.**
- Site action: For members in Pen or First credit mode, every credential is hidden by default on public pages. When a member switches one on, edit-profile warns them if the clip or issuer page shows their legal name.
- Example copy (warning): "This clip shows your full name. Showing it here links your pen name to it."
- Sources: TLL `credit-mode` field (packet-c/CONTRACTS.md); C53 (visited lists and identity concern); C5 (credentials must be true, which includes the name they belong to).

**13. Date every check and re-check claims that can lapse.**
- Site action: Each "Checked" label stores and shows the month of the check. Perishable credentials (Upwork status, trade certifications with renewal, association member status) are re-checked yearly or linked to the live issuer page instead of being stated as fact. Upwork status is shown only as a link to the member's live Upwork profile, never as a copied badge.
- Example copy: "Checked by the editor, October 2026" / "See current status on {Platform}"
- Sources: C32 (re-checked every two weeks), C40 (requalify every three years), C41 (CE status with end date), C27 (badges expired after 60 days).

**14. Make the profile a real author page that machines can read.**
- Site action: Add ProfilePage structured data with a Person entity on /contributors/{slug}, `sameAs` pointing only to the member's own profiles they chose to show (and to checked issuer pages), and point each story's author to that page. Add a short "How I travel and write" line and a disclosure line, in the spirit of the NYT ethics section. Never generate a portrait or a persona.
- Example copy (profile section heading): "How {first name} travels and writes"
- Sources: C14 (ProfilePage for creators sharing first-hand perspectives), C1, C2, C5, C7, C8.

**15. Celebrate privately, share by choice.**
- Site action: When a member earns a mark, Nancy sends a short personal note, and the member gets an optional shareable card (TLL artwork, their name, the mark, no location or date). No public "just earned" feed.
- Example copy (note): "Your Lisbon story is an Editor's pick this week. Here is a card to share, if you like."
- Sources: C29 (Duolingo made badges shareable), C21, growth report S17 (attention keeps contributors going).

---

## 5. Badge system proposal for TLL

### 5.1 The three families

**A. Earned on That Layover Life** (computed or editor-given; members cannot write these fields)

| Mark | Source of truth | Who sets it | Label shown |
|---|---|---|---|
| Founding writer | Publish order in Stories (first published story among the founding group Nancy has announced) | Computed, then written to `badge-label` by the editor or a script | "Founding writer" |
| Stories here | Live count of the member's published stories | Computed at render | "{n} stories on That Layover Life" |
| Places written from | Countries of the member's published stories | Computed at render | Flag stamps, max three on card, rest on profile |
| Location Expert | Existing designation, applied for and reviewed by a human | Editor | "Location Expert · {city}" (home city only, opt-in, see 5.3) |
| Paw Passport | A public Pets item with `is-public` on and the member as owner | Computed | "Travels with {pet name}" linking to /paw-passport/{slug} |
| Press · The Pros / Blog on the Wire | Existing designations | Editor | As now, with the "Verified press" chip only when `press-verified` is set |
| Editor's pick | Attached to one story with a one-line reason | Editor | "Editor's pick, for {reason}" |

Suggested tiers for stories, if Nancy wants tiers at all: keep at most three, named for travel rather than rank (for example "First story", "Regular", "Long-haul"), with thresholds she sets. Research supports few tiers (C17), not specific thresholds, so none are proposed here as findings.

**B. Claimed and checked** (member adds, editor checks)

| Credential type | Evidence required | How it is checked | Label |
|---|---|---|---|
| Published in {Publication} | URL of the clip on the outlet's own domain naming the writer | Editor opens the link | "Checked by the editor, {Month Year}" |
| Certification (e.g. CTA, VTA, Open Badges or Credly items) | Issuer page or Credly badge URL | Editor opens the issuer page | Same |
| Association member status (e.g. SATW, a guild of travel writers) | Directory listing URL | Editor opens the directory | Same |
| Travel trade role (tour leader, cabin crew, travel advisor) | None reliable without employer data | Not checked | "Self-reported", profile only. Employer names off by default. |
| Platform status (Upwork, Muck Rack verified, Substack bestseller) | Link to the member's live profile there | Not restated; the platform shows its own badge | "See current status on {Platform}", profile only |

Storage note: Contributors is at 50 custom fields. Keep all claimed credentials in one JSON text field (type, name, URL, status, checked month), with the status writable only by the editor, the same rule `press-verified` follows today.

**C. Travel stamps** (TLL artwork, computed, coarse)

| Stamp | Source | Rule |
|---|---|---|
| Country range | `map-snapshot.countries` with `share-ranges` on | "80-something countries, all time"; exact number only if the member turns ranges off |
| Antarctica | `map-snapshot.antarctica` | "+ Antarctica" |
| Continents | Derived from the map, as a set, not a sequence | Shown as a set of continent stamps, no order, no dates |
| Pursuit stamps | Pursuits opt-in (Dog Travel, Trekking, Marathons, Foodie) | Profile only; these are interests, not credentials |

Stamp updates from the map are published in a monthly batch, never at save time.

### 5.2 What is verified, and how

- Verified: Location Expert, Press (existing human review); every "Published in", certification and association item marked "Checked" (editor opened the evidence link and the name matched).
- Computed (verified by data): Founding writer, story counts, places written from, Paw Passport, travel stamp ranges.
- Not verified, labeled as such: travel trade roles, anything "Self-reported".
- Never verified by upload: no passport scans, visas, boarding passes or ID documents are collected. Verification is by public link only.

### 5.3 What is never shown

- Where a member is now, or any current-location line, live check-in, "just landed", or "on the road".
- Dates or order of travel, `savedAt`, "new" or "latest" stamps, upcoming trips, or a route.
- Exact country counts when `share-ranges` is on; layover counts in real time.
- A Location Expert city finer than the city the member chose as home base, and never for a member who has not opted in.
- Images of passports, stamps from real passports, visas or boarding passes.
- Third-party logos without written permission, and never on the byline card.
- Rankings or leaderboards of members, follower counts, earnings, Upwork Job Success Score.
- Counts of founding places remaining, or any empty credential slot.
- The Layover Club supporter mark in the credential row or on the byline card.
- Credentials that would reveal the legal name of a Pen or First credit-mode member, unless the member turns them on after the warning.
- Any AI-generated portrait, invented credential or invented member.

### 5.4 Byline card versus full profile

| Place | What shows | Maximum |
|---|---|---|
| Byline card (end of story) | Portrait, name, one-line bio, then: one earned mark (`badge-label`), one checked credential the member picked, one travel stamp range, the member's chosen outbound link, "See {first name}'s credentials". Story-level "Editor's pick" shows here when the story has one. | Three marks plus the link (four if the story is an Editor's pick) |
| /travelers card | Unchanged from Packet C: one label, name, one-line, home base and flags, two live numbers | One label |
| Profile page | Everything: all earned marks with criteria, all checked credentials grouped by type with dates and evidence links, self-reported items labeled, all stamps, Pursuits, Paw Passport, disclosure line, "Supports TLL" if applicable | No hard cap; group by family, collapse long lists behind "Show all" |

Colors: checked chips use teal #067A79 on light with the word "Checked"; earned stamps may use rose #C8325B on light. Bright teal #00C9C8 only on dark surfaces. Color never carries meaning alone.

---

## 6. Looks earned versus looks needy or spammy

| Looks earned | Looks needy or spammy | Why |
|---|---|---|
| "Published in {Publication} · Read the clip" in TLL's type | A row of colorful outlet logos under "As seen in" | Text is the minimum needed; logo bars imply endorsement and clutter [C42, C43] |
| "Checked by the editor, October 2026" | A green tick with no explanation | Provenance must be visible [C37, C38] |
| "Founding writer" with a one-line criterion | "Founding writer, only a few spots left" | False or emphasized scarcity reads as a sales tactic (growth report S5, S28) |
| "Editor's pick, for the night on the gate floor" | "Top writer" or a leaderboard rank | Specific recognition beats rank; ranks need scale (C21, growth report S29c) |
| "Has written here from Portugal and Vietnam" | "Award-winning globetrotter and leading travel expert" | Sincere facts beat superlatives [C54, C3] |
| "80-something countries, all time" | "Just added: country 87" | Recency leaks location and reads as a scoreboard [C50, C51] |
| A card with portrait, bio and one earned mark | A card with three grey "Add a credential" placeholders | Displaying absence sets the wrong norm (growth report S1, S25) |
| "See current status on Upwork" (link) | A copied "Top Rated Plus" badge image | Platform badges lapse and are the platform's to show [C32] |
| Disclosure at the top of a hosted story | A "Partner" badge on the byline instead of a disclosure | Disclosures must be clear where readers look [C45, C47] |
| "Supports TLL" on the profile only | A supporter badge beside credentials | Bought marks next to earned ones cheapen both [C28, C35] |
| An optional share card the member posts | Auto-posts to the member's social accounts | Credly does not post without the earner's permission [C16] |
| Editor writes the credential line | Writer writes "I have been featured in..." | Third-party praise is received better [C55] |

---

## 7. Risks

1. **Legal exposure from logos.** Even with nominative fair use, logo use is decided case by case, and circuits differ [C42]. Mitigation: text only by default.
2. **Over-claiming as deception.** An unchecked "Published in" that turns out false is the kind of false credential Google now calls deception [C5], and in Denmark or the US could raise marketing-law questions. Mitigation: only checked items on cards; self-reported clearly labeled.
3. **Editor workload.** Every check is Nancy's time. Mitigation: link-only evidence, one check per item, yearly re-check, and only the card-eligible item needs checking first.
4. **Stale claims.** Platform statuses and certifications lapse [C32, C40, C41]. Mitigation: dated labels and links to live status.
5. **Location leakage.** A stamp or badge that updates in real time, or ranks frequency, can reveal a trip in progress or a home [C48 to C51]. Mitigation: ranges, monthly batches, no dates, no order.
6. **Unmasking pen names.** A verified outside byline can tie a pen name to a legal name. Mitigation: hidden by default for Pen and First credit modes, with a warning.
7. **Badge inflation.** Adding badges for small actions makes all of them worthless (Duolingo's sign-up lesson, LinkedIn's automatic Top Voice) [C29, C27]. Mitigation: few badges, editor-given where judgment is needed.
8. **Removal backlash.** Taking badges away upsets people (Foursquare) [C26]. Mitigation: start small; make earned marks permanent ("stays on the byline for good").
9. **Professional bias.** A credential row can make first-time writers look lesser, against the site's promise. Mitigation: experience first, no empty slots, Editor's pick open to anyone.
10. **Weak evidence that badges raise output.** Steering effects are disputed [C18, C19, C20b]. Mitigation: treat badges as credit and trust, not as a growth engine, and do not expect output gains.
11. **Paid marks creeping into credentials.** If the Layover Club badge or any sponsor mark ever sits beside credentials, it repeats the paid-check problem [C28]. Mitigation: hard separation in the template.
12. **Unverified source figures.** Several figures here are E2 or U. Mitigation: open the sources before quoting any number publicly.

---

## 8. Where sources disagree

- Badge steering: Anderson et al. found steering [C18]; Hoernle et al. found most users apathetic [C19]. Hamari 2013 found effects only for users who watched badges [C20b]; Hamari 2017 found broad effects [C20].
- Rewards and motivation: Deci, Koestner and Ryan found expected contingent rewards harmful and positive feedback helpful [C25]; Cameron and Pierce argued the harm is limited [C25].
- Tier design: coarse versus fine depends on how users value status [C17].
- Bylines: NN/g says there is no single answer [C13]; Google recommends author information where expected [C1].
- E-E-A-T and AdSense: Sullivan says E-E-A-T is not a ranking factor [C3b]; an AdSense community guide says reviewers assess it [C6b].
- Logos: legal guidance says get permission [C43]; a freelancer's blog says enforcement is rare [C44c]; the *New Kids* logo footnote is called dicta [C42].
- FTC review rule effective date: sources give different October 2024 dates [C46].
- Substack top badge threshold: "tens of thousands" versus "10,000 or more" [C35].
- LinkedIn verification availability: current per LinkedIn, paused per one guide [C37].
- Google's fake-author paragraph date: 1, 5 or 6 October 2026 depending on the source [C5].

---

## 9. Source list

Marks: **[E]** seen in a search extract of that page; **[E2]** seen only in a secondary write-up; **[U]** unverified. No page was opened in full (Section 0).

| ID | Source | URL | Mark |
|---|---|---|---|
| C1 | Google Search Central, "Creating helpful, reliable, people-first content" ("Who" questions on bylines and author background, as reproduced by secondary sites) | https://developers.google.com/search/docs/fundamentals/creating-helpful-content ; https://metricspot.com/docs/author-byline/ | E2 |
| C2 | Google Search Central blog, "Google Search's guidance about AI-generated content" (Who, How, Why) | https://developers.google.com/search/blog/2023/02/google-search-and-ai-content | E |
| C3 | Google Search Central blog, "Our latest update to the quality rater guidelines: E-A-T gets an extra E for Experience" (Dec 2022) | https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t | E |
| C3b | Danny Sullivan on E-E-A-T not being a ranking factor, as quoted by a secondary site | https://blusharkdigital.com/blog/google-adds-experience-to-search-quality-rating-guidelines/ | E2 |
| C4 | Search Quality Rater Guidelines (sections on who created the content and creator reputation), via commentary and a hosted copy | https://ipullrank.com/quality-rater-guideline-crib-notes-e-a-t ; https://ppc.land/content/files/2025/04/searchqualityevaluatorguidelines.pdf | E2 |
| C5 | Coverage of Google's October 2026 fake-author warning in its helpful-content guidance | https://seroundtable.com/google-warns-against-deceptive-authorship-information-42238.html ; https://www.searchenginejournal.com/google-adds-fake-author-warning-to-helpful-content-guidance/591806/ ; https://www.techwyse.com/news/search-seo/google-helpful-content-fake-authors-ai-quality-guidance | E2 |
| C6 | Google, 2024 publisher policies recap (AdSense): no ads on screens with low-value content | https://services.google.com/fh/files/misc/2024_publisher_policies_recap_adsense.pdf | E |
| C6b | AdSense community guide on low-value content (E-E-A-T assessment claim) | https://support.google.com/adsense/community-guide/241032356/how-can-you-solve-the-low-value-content-adsense-disapproval-challenge?hl=en | E2 (community guide, not policy) |
| C7 | Nieman Lab, "The New York Times rolls out new byline pages" (Jan 2024) | https://niemanlab.org/2024/01/the-new-york-times-rolls-out-new-byline-pages | E2 |
| C8 | UW-Madison Center for Journalism Ethics, Q&A with Edmund Lee on enhanced reporter bios | https://ethics.sjmc.wisc.edu/2023/09/26/building-reader-trust-with-enhanced-reporter-bios-a-qa-with-editor-edmund-lee | E2 |
| C9 | Lonely Planet author pages (examples) | https://www.lonelyplanet.com/authors/andrea-schulte-peevers ; https://www.lonelyplanet.com/authors/luke-waterson ; https://www.lonelyplanet.com/authors/kerry-walker | E |
| C10 | Lonely Planet no-freebies policy, 2008 coverage | https://www.nbcnews.com/news/amp/wbna24095819 ; https://travelmole.com/news/lonely-planet-hits-back-in-guidebook-row | E2 |
| C11 | Skift, "Conde Nast Traveler Rethinks 'Truth in Travel' Under New Leadership" | https://skift.com/?p=114129 | E2 |
| C12 | Wirecutter's own trust or testing page (not retrieved) | https://www.nytimes.com/wirecutter/ | U |
| C13 | NN/g, "Bylines for web articles" | https://www.nngroup.com/articles/bylines-for-web-articles/ | E |
| C14 | Google Search Central, ProfilePage structured data | https://developers.google.com/search/docs/appearance/structured-data/profile-page | E |
| C15 | 1EdTech, Open Badges 3.0 announcement | https://www.1edtech.org/1edtech-article/new-open-badges-30-standard-provides-enhanced-security-and-mobility/411060 | E (badge contents list via glossary: E2, https://www.forasoft.com/learn/elearning-video/glossary/terms-elearning/open-badge) |
| C16 | Credly verification and sharing, via issuer FAQs (ISC2, ACFE) | https://www.isc2.org/Certifications/Digital-Badges ; https://info.credly.com/badge-earner-support | E2 |
| C17 | Immorlica, Stoddard, Syrgkanis, "Social status and badge design" (and NBER version citing Stack Overflow tiers) | https://arxiv.org/abs/1312.2299 ; https://conference.nber.org/conf_papers/f69919.pdf | E |
| C18 | Anderson, Huttenlocher, Kleinberg, Leskovec (2013), "Steering user behavior with badges", WWW | https://archives.iw3c2.org/www2013/proceedings/p95.pdf | E |
| C19 | Hoernle, Kehne, Procaccia, Gal, "The Phantom Steering Effect in Q&A Websites" | https://ar5iv.labs.arxiv.org/html/2002.06160 | E |
| C20 | Hamari (2017), "Do badges increase user activity? A field experiment on the effects of gamification", *Computers in Human Behavior* 71 | https://research.utu.fi/converis/portal/detail/Publication/27336812?lang=en_GB | E |
| C20b | Hamari (2013) field experiment, as summarized by the author's group | https://gamification-research.org/2013/05/1-5-year-experiment-on-gamification-surprising-results/ | E |
| C21 | Restivo and van de Rijt (2012), "Experimental study of informal rewards in peer production", *PLOS ONE* | https://pmc.ncbi.nlm.nih.gov/articles/PMC3315525 | E |
| C22 | Kriplean, Beschastnikh, McDonald (2008), "Articulations of WikiWork", CSCW | https://www.cs.ubc.ca/~bestchai/papers/cscw2008.pdf | E |
| C23 | Wikipedia essay "Award barnstars" (mirror) | https://www.gwern.net/wiki/Wikipedia:AWARDBARN | E |
| C24 | German Wikipedia symbolic award experiment (newcomer retention) | Not located | U |
| C25 | Deci, Koestner, Ryan (1999), meta-analysis, *Psychological Bulletin* 125(6); and their 2001 reply on Cameron and Pierce | https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf ; https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf | E |
| C26 | Foursquare drops then restores mayor titles (VentureBeat 2014; 9to5Mac 2015; Wikipedia) | https://venturebeat.com/ai/foursquares-new-swarm-app-means-the-death-of-badges-mayors/ ; https://9to5mac.com/2015/06/22/swarm-ios-mayorships-badges/ ; https://en.wikipedia.org/wiki/Foursquare_City_Guide | E |
| C27 | LinkedIn retires gold Community Top Voice badge (2024) | https://www.socialmediatoday.com/news/linkedins-removing-top-voice-badges-collaborative-articles/728247/ ; https://buffer.com/resources/linkedin-top-voice/ | E2 |
| C28 | Twitter pauses paid verification after impersonation (Nov 2022) | https://www.nbcchicago.com/news/business/money-report/twitter-pauses-paid-verifications-after-users-abuse-service-to-impersonate-brands-and-people/ ; https://www.adn.com/nation-world/2023/04/02/twitters-blue-check-mark-was-loved-and-loathed-now-its-pay-for-play/ | E |
| C29 | Duolingo blog, achievement badges redesign | https://blog.duolingo.com/achievement-badges | E (sign-up A/B test via https://econsultancy.com/six-a-b-tests-used-by-duolingo-to-tap-into-habit-forming-behaviour/ : E2) |
| C29b | UX critique of Duolingo gamification (clutter) | https://uxdesign.cc/the-good-the-bad-and-the-ugly-of-duolingo-gamification-3a12f0e80dc7 | E2 |
| C30 | Google Maps Help, Local Guides points, levels and badging | https://support.google.com/maps/answer/6225851?hl=en | E |
| C31 | PhocusWire, "TripAdvisor begins handing out badges to reviewers" | https://www.phocuswire.com/TripAdvisor-begins-handing-out-badges-to-reviewers | E (date not in extract) |
| C32 | Upwork Help and resources on talent badges | https://support.upwork.com/hc/en-us/articles/211063568-Top-Rated-and-Rising-Talent ; https://www.upwork.com/resources/talent-badges-explained | E |
| C33 | Muck Rack profile criteria and verification | https://www.muckrack.com/criteria | E |
| C34 | Contently, portfolio guidance and how managing editors evaluate writers | https://contently.net/2019/06/05/resources/contently-portfolio-optimize-get-work-clients/ ; https://contently.net/2019/09/26/resources/tools/portfolio/contently-managing-editors-writers-paid-work | E |
| C35 | Substack, bestseller badges announcement | https://on.substack.com/p/badge | E (thresholds via third-party guides: E2) |
| C36 | Medium Top Writer badges replaced by Boost (writer accounts) | https://iamjoshuamason.substack.com/p/mediums-worst-problem-isnt-pay-its | U |
| C37 | LinkedIn Help, verifications and workplace verification | https://www.linkedin.com/help/linkedin/answer/a1423367 ; https://socialbee.com/blog/how-to-get-verified-on-linkedin/ | E (pause claim: E2) |
| C38 | ORCID, interpreting the trustworthiness of an ORCID record (trust markers) | https://info.orcid.org/interpreting-the-trustworthiness-of-an-orcid-record/ | E |
| C39 | NomadMania, verification of travel records | https://nomadmania.com/supreme-verification/ | E |
| C40 | SATW, point charts and join page | https://satw.org/point-charts ; https://satw.org/join-us | E |
| C41 | The Travel Institute agent profiles; ASTA VTA coverage | https://www.thetravelinstitute.com/agent/24163/ ; https://recommend.com/archive/asta-launches-verified-travel-advisor-certification-program/ | E2 |
| C42 | Nominative fair use and logos (*New Kids on the Block v. News America Publishing*, 971 F.2d 302), via law-firm and journal summaries | https://www.dglaw.com/nominative-fair-use-defense-may-enable-use-of-anothers-trademark/ ; https://www.duetsblog.com/2020/03/articles/advertising/nominative-fair-use-of-anothers-logo/ ; https://www.americanbar.org/groups/intellectual_property_law/resources/landslide/archive/nominative-trademark-use-affirmative-or-negative-defense-infringement/ | E2 |
| C43 | Guidance on third-party logos implying endorsement | https://koreconx.com/do-you-really-have-permission-to-use-those-logos ; https://learn.thryv.com/hc/en-us/articles/360016138071-Using-Third-Party-Logos-and-Trademarks-in-Your-Marketing-Materials ; https://sprintlaw.com.au/articles/using-another-companys-logo-navigating-the-australian-legal-landscape/ | E2 |
| C44 | MediaPost, Condé Nast native ad guidelines (no magazine logos in native ads) | https://www.mediapost.com/publications/article/226928/mag-bag-conde-nast-circulates-native-ad-guideline.html | E2 |
| C44b | Law360, Condé Nast suit over "Dogue" | https://www.law360.com/articles/2418957 | E2 |
| C44c | Freelancer blog on publication logos on writers' sites | https://www.sumydesigns.com/publication-logo-use-on-website/ | E2 |
| C45 | FTC Endorsement Guides (16 CFR Part 255, 2023 revision), via law-firm summaries; www.ftc.gov could not be fetched | https://www.proskauer.com/insights/get-pdf/24552 ; https://blog.promise.legal/ftc-endorsement-rules-startup-marketing/ | E2 |
| C45b | FTC staff influencer disclosure template | https://www.ftc.gov/system/files/attachments/press-releases/ftc-staff-reminds-influencers-brands-clearly-disclose-relationship/influencer_template.pdf | E |
| C46 | FTC final rule on consumer reviews and testimonials (16 CFR Part 465), via law-firm summaries | https://www.fenwick.com/insights/publications/the-ftc-cracks-down-on-fake-reviews-with-new-rule ; https://www.goodwinlaw.com/en/insights/blogs/2024/08/ftc-publishes-new-rule-banning-fake-reviews-and-testimonials | E2 |
| C47 | Danish Marketing Practices Act § 6(4) and Forbrugerombudsmanden guidance on hidden advertising | https://www.lovguiden.dk/dokument/forbrugerombudsmanden/fom-106120-forbrugerombudsmandens-vurdering-af-influenters-markedsføring-på-sociale-medier-skjult-reklame ; https://denmark.dlapiper.com/da/pdf/news/5656 | E2 |
| C48 | CNBC, Strava heatmap exposes military information (Jan 2018) | https://www.cnbc.com/2018/01/28/global-heat-map-for-joggers-exposing-sensitive-us-military-information.html | E |
| C49 | Dark Reading, fitness apps leak location despite privacy zones (KU Leuven) | https://www.darkreading.com/application-security/popular-fitness-apps-leak-location-data-even-when-users-set-privacy-zones | E2 |
| C50 | Strava Support, Local Legends; Internet Matters on home inference | https://support.strava.com/en-us/articles/15401751-local-legends ; https://www.internetmatters.org/parental-controls/social-media/strava-parental-controls/ | E |
| C51 | Delayed posting advice (CTV 2026; Swinton insurer analysis) | https://www.ctvnews.ca/sci-tech/article/heres-another-reason-why-you-should-wait-to-post-your-vacation-photos/ ; https://www.insurancebusinessmag.com/uk/news/home-property/swinton-issues-warning-over-social-media-posts-107108.aspx | E2 |
| C52 | Mindee, passport MRZ and identity exposure | https://www.mindee.com/blog/mrz-passport-protect-your-identity-online | E2 |
| C53 | Atlas Obscura user profiles (visited lists, leaderboards) and a private-profile feature request | https://www.atlasobscura.com/users/dylan?view=added ; https://www.commonsense.org/education/reviews/atlas-obscura ; https://atlas-obscura-digital-product.nolt.io/345 | E (request: E2) |
| C54 | Sezer, Gino, Norton (2018), "Humblebragging: a distinct, and ineffective, self-presentation strategy", *JPSP* | https://dash.harvard.edu/handle/1/14725901 | E |
| C55 | Pfeffer and Fong (2006), "Overcoming the self-promotion dilemma", *PSPB* 32(10) | https://www.gsb.stanford.edu/faculty-research/publications/overcoming-self-promotion-dilemma-interpersonal-attraction-extra-help | E |
| C56 | WCAG 2.2 success criteria 1.1.1, 1.4.1, 2.5.8, via checklists | https://beaccessible.com/wp-content/uploads/2023/11/WCAG-2.2-Checklst-Be-Accessible.pdf ; https://blog.adrianroselli.com/wp-content/uploads/2024/03/CSUNATC-2024_WCAGmire_Adrian-Roselli.pdf | E2 (2.5.8 pixel figure: U) |
| C57 | Claim that NN/g found five to seven logos credible, twelve or more clutter (blog attribution) | https://www.pravinkumar.co/blog/webflow-trust-bar-b2b-conversion-design-2026 | U |
| C58 | Discourse, "Initial Discourse badge design spec" | https://meta.discourse.org/t/initial-discourse-badge-design-spec/13088 | E |

Host that could not be reached from this sandbox and needs to be allowed for a verification pass: `www.ftc.gov` (and, by the same rule, likely most others listed above).
