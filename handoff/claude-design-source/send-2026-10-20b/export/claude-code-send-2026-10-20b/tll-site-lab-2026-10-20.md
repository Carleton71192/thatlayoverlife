# TLL · Site lab · 20 October 2026

Live mode, from a text fetch of three pages: home, /stories, and one story (/stories/pantanal-glimmers-in-the-wild). Lighthouse, axe, JSON-LD, robots.txt and AI-crawler checks could not run from the design desk. They are listed for Claude Code under "Skipped". Findings are judged against the ICP: repeat travelers, layover hackers, expats, people traveling with dogs. The conversion that counts is member sign-up and readers who come back.

## Scorecard
- **AEO · Solid.** The story template is strong: a "short version" answer block, a Quick answers FAQ and dated sources. Schema could not be verified.
- **SEO · Headroom.** Titles and descriptions run long, date format is wrong, story links dead-end, and some site-wide counts are wrong.
- **UX · Priority.** On the story page the share buttons are broken, the gallery leaks every other story's captions, sources render as raw HTML, and receipt blocks are empty.
- **AX · Headroom.** Facts are in text and stories read well raw. Byline, country and share links point at index pages or the homepage, so agents can't follow them.

## 🔴 Critical
1. **Possible false disclosure on every story.** The Pantanal story says "This story was hosted. The travel was paid for by the host," but the text says the trip was self-organized. This looks like a default value bound to all stories. Charter risk. *Fix:* the disclosure renders only when CMS `disclosure-type` is set (hosted / commissioned / affiliate); empty means nothing renders. Nancy confirms which stories, if any, were hosted. *Tier 3 (fact) + Tier 2 (template).*
2. **"From the trip" gallery dumps every story's photo captions and slugs** (Salvador, Sort Sol, Kili, Camino, Tomatina…) under the Pantanal story, with a placeholder thumbnail. *Fix:* filter the gallery Collection List by the current story's reference; hide the section when empty. *Tier 2, Quick.*
3. **Share links broken.**
   - "Copy link" has `href="https://javascript:…"`.
   - LinkedIn and X share `https://thatlayover.life`, not the story.
   - The email body has no URL.

   *Fix:* a button with a JS clipboard handler (no `alert`); share URLs built from the canonical. *Tier 2, Quick.*

## 🟡 High
4. **Sources render as raw HTML text** (`<p>Bird species count…</p>`). A rich-text field is bound to a plain-text element. *Fix:* bind to a Rich Text element. *Quick.*
5. **Empty receipt blocks show their labels:** EDITED BY, WHAT IT COST, DISCLOSURE, "Traveled with", "Links & mentions", "Other stops on this layover". *Fix:* conditional visibility on each, set to the field being set. *Quick.*
6. **Dead-end links on the story page.**
   - Byline goes to `/contributors`, not `/contributors/nancy-carleton`.
   - Country goes to `/countries`, not the country page or `/stories?place=br`.
   - Pursuit goes to `/stories`.
   - "See their work" goes to `/contributors`.
   - "Been here" and "Want to go" are `href="#"`.

   *Fix:* bind each to its item slug. *Quick to Medium.*
7. **Site-wide counts are wrong** (COUNT-RULES).
   - Footer: "6 stories · 1 travelers", when there are about 22 stories, 2+ travelers, and "travelers" is the wrong plural for 1.
   - /stories H1: "Six stories".
   - Author box: "88 countries and counting", against "87" in the footer. Bios carry no counts.

   *Fix:* bind to collection counts / tllStates; remove the count from the author box. *Medium.*
8. **The story path still says "Reviewed by a human within 48 hours"** (story CTA, /stories). The 3.1 ruling says the story path never mentions 48 hours. *Fix:* "Publishes when it passes the rules. Your byline stays yours." *Quick.*
9. **Two footers and two navs are live.**
   - /stories still has the old nav (Destinations, no Map or Expats).
   - Its footer is the long one, linking retired pages: /destinations, /pets, /for-affiliates, /travel-wire, /spotlight.
   - It still says "Search the shelf" (banned).

   *Fix:* the one global nav and footer component on every page. *Medium.*

## 🟢 Medium
10. **Date format:** "October 9, 2026" should be "9 October 2026" (ruling 2026-09-28). Fix in the date field format settings, site-wide.
11. **Story meta:** read time shows "7" with no unit; the breadcrumb repeats the place twice.
12. **Story title tag** is 66 characters; the description is about 210 characters (target 50 to 60 and 120 to 160). The OG description can stay long.
13. **Home title and description break the kit.** "Real places, by people who actually went" and "an actual human" use "real" and "actually" outside the H1, and lean on the retired anti-AI framing. Suggested: title "That Layover Life · Travel stories by the people who went"; description "Stories from repeat travelers, expats and people who travel with their dogs, plus a free map of everywhere you have been." Nancy approves copy.
14. **Home rail** says "the eight newest here" and shows 11.
15. **Newsletter naming differs:** the home page says "The Layover Letter, Sunday 09:00"; /stories says "The Weekly Layover, when it's worth it". Pick one.
16. **"Tell the editor… fixed within 24 hours"** on the story page is a promise nobody has ruled on. Match the widget: "It lands on the editor's desk."
17. **Footer "Cookies" link** is `href="#"`. It should open the consent preferences.

## ⚪ Low
18. The emoji in OG and Twitter descriptions (🐻‍❄️) is fine on social, but make sure it isn't in the `<title>`.
19. Footer "The Layover Lounge" still goes to /gallery (slug flip pending the 301).

## Known issues re-checked
- Teal on Paper: none visible in the text fetch; needs a contrast check with axe.
- Story JSON-LD empty or shared `@id` (19 Oct): **could not verify**, re-run in Claude Code.
- /submit login wall: not fetched today.
- /the-map zeros for logged-out visitors: not fetched today.

## What's working (keep)
- The answer block at the top of the story, the Quick answers FAQ written as questions, and dated, named sources. This is exactly the AEO pattern for the ICP's queries ("can you drive the Transpantaneira in a normal car").
- Alt text on the hero is descriptive and specific.
- Facts (email, place, dates) appear as text in the raw HTML.

## Skipped (Claude Code to run, commands in brand-site-lab §2)
Lighthouse mobile (LCP, INP, CLS), axe, the JSON-LD extractor over the sitemap (50 pages), robots.txt + AI crawler status codes, raw vs rendered word count, the sitemap /visits check.
