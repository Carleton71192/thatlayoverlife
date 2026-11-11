# Change log for approval: catching the live Worker up with the repo (11 November 2026)

For Nancy. This list deploys nothing. No secrets were set or read, and nothing changed in Webflow.

Update, 11 November 2026 about 13:20 UTC: on your "deploy the Worker", the Webflow build session deployed W1 (the portfolio link) alone from branch `worker/portfolio-on-b305b3b`, commit `cfa29cc`, as version `bed3342a`. That is now the live baseline for this list. Logged in handoff/WEBFLOW-LOCK.md (commit `93fa740`).

Update, 11 November 2026 about 13:35 UTC, Webflow build session: **the next-morning check is not working.** No "TLL daily submissions report" task exists on this Mac. The daily `tll-morning-review` task (reads every story published in the last 24 hours and can hold one) starts each morning and shows as succeeded, but its runs of 9, 10 and 11 November stopped at their first tool call, waiting for a permission no one was there to give, and `review-log/` holds no reports. Fix that before W4 (instant set-up) goes live, or new stories go live with nobody reading them the next morning.

Update, 11 November 2026, 13:28 UTC, Worker catch-up session: **W2 to W20 are live.** On your "deploy the rest of the Worker", deployed from a clean copy of commit `7dc27cb` (branch `claude/new-session-zxm063`; Worker code unchanged since this list was written), version `2244060e-c876-485b-879d-1b69fa55908c`. Before the deploy: `npm ci`, 46 test files and 353 tests pass, dry run 1,219.86 KiB (239.12 KiB zipped). The uncommitted AFAR edit in `src/feeds.js` was not included, so AFAR stays on, as before. ANTHROPIC_API_KEY is still not set, so W5 and W6 stay off. Checked right after: `/work-trips`, `/whats-new`, `/settings`, `/series`, `/album`, `/lounge`, `/expats-map`, `/pros`, `/living-library`, `/stamps/public`, `/collections/public` answer 200; `POST /export/prepare` now asks for a sign-in (401) instead of failing. W4 instant set-up is live while the next-morning check above is still not working. Rollback to the portfolio-only Worker: `npx wrangler rollback bed3342a-3991-4982-b5b7-ec92cbd1ecff`.

Update, 11 November 2026, 14:07 UTC, Worker catch-up session: **ANTHROPIC_API_KEY.** You set it at 13:44 UTC (version `67d688fd`). At the 14:00 run all 3 story summary calls (W6) were refused by the Claude API as an invalid token, and each of those stories was flagged as tried for 30 days. You replaced the key at 14:06 UTC (version `04cb13b2`); the flags on the 3 stories (`6accdac9ace43547a97df7a8`, `6accd59510785e9dc6929053`, `6accd51ec1ee4abbfe7955a1`) were cleared on your word, so they come back once the queue (23 stories, 3 per half hour) empties. Whether the new key works shows at the 14:30 run. The 14:00 run otherwise finished every job (Wire 100 items, site stats, pursuit and collection counts, the daily metrics check) with 114 ms of CPU; the Free plan's stated limit is 10 ms per run, and Cloudflare did not stop it. A link summary test (W5) did not reach the API: the articles tried (Atlas Obscura, the Guardian) did not return text to the Worker.

Update, 11 November 2026, 14:38 UTC, Worker catch-up session: **W5 and W6 are off again.** The 14:30 run used the replaced key (version `04cb13b2`) and the Claude API refused all 3 story summary calls the same way ("invalid bearer token"); 3 more stories were flagged as tried (`6accbeceb55fa97ba3b92e2d`, `6accbf37ef7f287503353915`, `6accd45ecdf8f22de71afd21`). You deleted ANTHROPIC_API_KEY at 14:37 UTC (version `321d3a46`), so no more stories get flagged; the 3 flags stay until summaries work. Not yet known: whether the key or the code is at fault. The AI package (`@anthropic-ai/sdk` 1.3.0) sends the key in the Authorization header, and this code path had never made a real API call before today. The check you run yourself in Terminal (a key test sent both ways) decides it: a new key, or a session that fixes how the Worker sends it, with a test, live on your word. The rest of the 14:30 run finished every job (107 ms of CPU).

## In short

- The live Worker (`tll-travel-wire`) runs commit `cfa29cc`: the code you deployed on 29 October 2026 (`b305b3b`) plus the portfolio rule (W1), deployed 11 November 2026.
- Since 29 October, sessions added 19 more Worker features to the repo (W2 to W20). A deploy from this folder puts all of them live at once.
- One thing on the live site still waits on this deploy and fails today: **Download everything** on /account.
- My recommendation: W1 is done; deploy W2 to W20 in one go once you have said yes to the list below.

## Where things stand today

| Check | Result |
|---|---|
| Live version | `bed3342a` (11 November 2026, 13:18 UTC, message "M2 portfolio in partners, on b305b3b (cfa29cc). Nancy: deploy the Worker"), checked with `npx wrangler deployments list`. Before it: `1200c254` (29 October 2026, 14:28 UTC), the `a7b023b0` code from `b305b3b` plus one secret change you made at 14:28. |
| Repo compared with live (`cfa29cc`) | Branch `claude/new-session-zxm063`. Worker code: 21 new modules in `src/`, `src/index.js` +108 lines, `wrangler.toml` +21 lines (collection ids only), `package.json` one new package (`@anthropic-ai/sdk`). `src/profile-sync.js` now differs from live by one line only: companions are no longer a field members write directly (part of W2). No Worker code changed in the repo between this check and the deploy of `bed3342a`. |
| Tests | `npx vitest run`: 46 test files, 353 tests, all pass. |
| Build (dry run, no deploy) | Builds cleanly. 1,219.86 KiB, 239.12 KiB zipped (the Free plan allows 3 MB zipped). The AI package is most of that size: the portfolio branch alone is 108.75 KiB. |
| Bindings | The same as live: one KV namespace (`WIRE_KV`), the same 30-minute cron. 20 new plain values (collection ids), no new KV, no new cron schedule, no new routes in `wrangler.toml`. |
| Secrets set now (names only) | MEMBERSTACK_KEY, PROFILE_HOOK_TOKEN, REFRESH_TOKEN, STORY_HOOK_TOKEN, WEBFLOW_TOKEN. |
| Secrets this catch-up needs | One new one, ANTHROPIC_API_KEY, for W5 and W6 only. Without it those two stay switched off and everything else works. |
| Live check (11 November 2026, before the W1 deploy; W1 adds no routes) | `/work-trips`, `/whats-new`, `/settings`, `/series`, `/album` answer 404. `POST /export/prepare` answers 405. |
| Uncommitted change in this folder | `src/feeds.js`: the AFAR feed set to off (another session's edit). A deploy from this folder takes that live too: the Wire stops reading AFAR, whose feed address was never confirmed. |

Already live and unchanged by this catch-up: translation (`POST /translate`) was in the 29 October code. It still needs `DEEPL_KEY`, which is not set.

## What switches on by itself the moment the Worker deploys

The site code for most of these was published on 31 October and 7 November and waits for the Worker. No Webflow publish is needed, so these go live with the deploy:

- **/submit instant set-up (W4):** a member's story, link-out or photos are published on the site straight away. This is what you asked for on 31 October. The next-day report task (`TLL daily submissions report`) was created on 31 October without its connectors; please check it runs before the deploy, or new stories go live with no report the next morning.
- **Download everything** on /account starts working (W13).
- **Companions** on /edit-profile, /account, profiles and pet pages (W2).
- **Expats map** on /for-expats (W3), **Lounge member photos** on /gallery (W4), **album photos** on profiles (W9).
- **Collections and stamps** on profiles, for members who switch them on (W8, W11).
- **Three counters** start writing to the CMS every 30 minutes: site stats, pursuit counts, collection category counts (W7, W8, W11).

These stay behind their preview switches after the deploy: work trips hub (`?preview=worktrips`), expats rework and Living Library (`?preview=expat`), pet passports (`?preview=pets`), Paw Passport waitlist (`?preview=paw`).

## The list

Status key:
- **Approved:** you said yes to this feature; it waits only for a deploy.
- **Go-ahead only:** built on your "Keep going" while working through the Value Playbook; no line-by-line yes yet. Its change log still lists open questions.
- **Preview only:** built and tested, shown only behind a preview link until you approve the preview.

| # | What it does for readers or members | Status, with your words | Worker routes and jobs | Needs |
|---|---|---|---|---|
| W1 | **Portfolio link.** A maker's portfolio link saved on /edit-profile reaches their public profile ("SEE THE WORK"). | **Live on the Worker** since 11 November 2026, 13:18 UTC (version `bed3342a`, from `cfa29cc`). Approved 10 November 2026: "Approve M1 to M3 as written, keep it optional". The site part's www publish is tracked in STATUS S135. | Member save route (no new route). | Nothing. Listed here for the record. |
| W2 | **Travel companions and shared pets.** Invite a companion, accept or decline, "Travels with" on profiles. Companions can only be linked through an accepted invite (members can no longer type them in directly). | Approved, 31 October 2026: "Yes your mock up looks good", and the invite-by-link request ("add a traveler should be able to link to outbound like email/ text/ WhatsApp/ insta"). | `/crew/inbox`, `/crew/invite`, `/crew/answer`, `/crew/cancel`, `/crew/leave` (members); `GET /crew/people`, `/crew/public`. | Nothing new. |
| W3 | **Expats map** on /for-expats: opted-in expats by country and home base, with flags. | Approved, 31 October 2026: "build the expats map ... maybe with flags". | `GET /expats-map`. | Nothing new. |
| W4 | **Instant set-up of submissions.** Stories, link-outs and photos sent from /submit are published at once, in the writer's own words; expat and press applications still wait for you. Member photos appear in the /gallery Lounge. | Approved, 31 October 2026: "When people submit things ... instantly link and set up photos and stories. The next day submit the full report to me to check it." | `POST /intake` (members, 20 an hour each); `GET /lounge`. | Nothing new. Check the next-day report task first (see above). |
| W5 | **AI summary box for link-out stories.** A short summary of the linked article, labeled as AI. | Approved, 31 October 2026: "the AI summary box for linked articles and pulling in OG images or having a backup option". | `GET /link-summary`. | ANTHROPIC_API_KEY. Each new summary is one paid API call (cached afterwards). Off until the key is set. |
| W6 | **AI summary and links on member stories**, with an AI label on both. Fills in stories that lack them, 3 stories every 30 minutes until all live stories have them. | Approved, 31 October 2026: "The AI summary and links are not on other people's stories, can you integrate that"; "it should probably have an AI disclosure label too". | Joins the 30-minute cron; writes and republishes Stories items. | ANTHROPIC_API_KEY. Paid API calls while it catches up, then only for new stories. Off until the key is set. |
| W7 | **Site stats recount.** Recounts stories, travelers, pets and countries into the Site stats item every 30 minutes. | Go-ahead only, 31 October 2026 ("Keep going", redesign P0.1). The footer binding to this item was never done, so nothing on the page reads it yet. | Joins the 30-minute cron; writes one CMS item when the numbers change. | Nothing new. |
| W8 | **Souvenir collections** (magnets, mugs, postcards, shot glasses and more): private by default, opt in per collection, up to six photos a piece; category usage counts for you. | Approved, 31 October 2026: "Add postcards and shot glasses, private by default, build it"; "Private by default with opt in"; "more photos for collections ... Approve for now". | `/collections/mine`, `/add`, `/delete`, `/show` (members); `GET /collections/public`; category counts join the 30-minute cron. | Nothing new. |
| W9 | **Continent album and Slide Show** on profiles, with each member's continent model (7, 6 or 5). | Approved, 31 October 2026: "Launch the home section and the album"; "Yes make the posted change". | `GET /album`; `POST /album/settings` (members). | Nothing new. |
| W10 | **What's new** card and dot on /account. | Approved, 31 October 2026: "Yes please". All three entries are set to Live off, so nothing shows until you switch one on. | `GET /whats-new`. | Nothing new. |
| W11 | **Pursuit stamps and badges**, work-trip stamps (no names without permission, year only, a stamp can be private), and the hub counts behind the index rule. | Go-ahead only for Phase 2, 31 October 2026 ("Keep going with the Value Playbook phases"); still open: hub names and intros, which stories belong to each hub, month on public stamps. The private work-trip stamp was your answer of 31 October. | `/stamps/mine`, `/add`, `/delete`, `/show`, `/private` (members); `GET /stamps/public`, `/pursuits/status`; pursuit counts join the 30-minute cron. | Nothing new. |
| W12 | **Travel style.** Stores the one-tap "How do you travel most?" answer from the welcome flow, for your private monthly count. | Approved, 31 October 2026, with the Phase 0 change log ("Approved"). The question has been live since then; the Worker part has not, so those answers are only in Memberstack today. | `POST /travel-style` (members). | Nothing new. |
| W13 | **Download everything.** A member's records as a zip from the Worker, then photos in parts of 25, one tap per part; built for the Free plan. | Approved: the card has been live since your go-ahead for the Phase 1 publish on 7 November 2026, and it fails until this deploy. The new card strings were listed for your approval in docs/tll-phase1-change-log-2026-11.md and are live with that publish. | `POST /export`, `POST /export/prepare` (members); `GET /export/zip`, `GET /export/photo` (token links that expire after 15 and 60 minutes). | Nothing new. |
| W14 | **From the Pros.** Label, author box and PRO badge for invited experts. | Go-ahead only, 31 October 2026 (Value Playbook Phase 6). The Pros collection is empty, so nothing shows. | `GET /pros`. | Nothing new. |
| W15 | **Site settings.** Legal name and division names from one CMS item, for pages marked to read it. | Go-ahead only, 31 October 2026 (Phase 7). The item is empty and no legal page reads it yet; that waits for your adviser. | `GET /settings`. | Nothing new. |
| W16 | **Investor metrics** for you only on /account, with a daily snapshot kept 400 days. | Go-ahead only, 31 October 2026 (Phase 9). | `POST /metrics` (owner only); a daily snapshot joins the cron. | Nothing new. |
| W17 | **Work trips hub** ("That Work Trip Life"): the hub wall, The Free Evening and Plus One Day. | Preview only. You answered the hub questions on 31 October 2026 (name, newsletter, next cities, private stamps); the hub intro and publishing the Work trips pursuit item are still open. | `GET /work-trips`, `/work-trips/story`. | Nothing new. Your yes to the preview, then a publish. |
| W18 | **Series and Living Library.** Series labels on story cards for the eight series; the expat Living Library. | Series labels: go-ahead only (your expat, pet and user-flow prompts of 31 October 2026), nothing shows until a story is tagged. Living Library: preview only (`?preview=expat`). | `GET /series`, `/series/story`, `/living-library`. | Nothing new. |
| W19 | **Pet passports** and passport details on /my-pets. | Preview only (`?preview=pets`). | `GET /pets/public`, `/pets/notes`, `/pets/featured`; `/pets/mine`, `/pets/update` (members). | Nothing new. |
| W20 | **Paw Passport waitlist** and QR landing, with your owner-only CSV. | Preview only, until the trademark search is clear; the privacy policy should mention the waitlist before it goes public. | `/paw/waitlist`, `/paw/waitlist/export` (owner). Stored in KV. | Nothing new. |

## Free plan limits

- **The 30-minute run is the one to watch.** Today it refreshes the Wire only (about 10 feed fetches). After the deploy the same run also does W6, W7, W8, W11 and, once a day, W16. On the Free plan all of that shares one limit of 50 outside calls and 10 ms of CPU per run. My estimate: about 20 to 25 calls per run, about 30 on the first run of each day, and about 40 to 45 once ANTHROPIC_API_KEY is set while W6 catches up. Four of the jobs read the full Stories list, and reading it is the main CPU cost. If a run goes over, Cloudflare stops the whole run, and the Wire refresh stops with it.
- **How to check:** after the deploy, run `npx wrangler tail` across the next :00 or :30 and look for the Wire's own summary line plus "site-stats", "pursuits", "collections". "Exceeded CPU" or "Too many subrequests" means roll back (below) and a session splits the jobs.
- **Download everything** was redesigned for the Free plan on 1 November 2026 (records zip only from the Worker, photos fetched in parts through a pass-through route).
- **KV writes** (1,000 a day on Free): the Wire uses about 48. New writes are small; W6 adds up to about 190 a day while it catches up, only after the key is set.
- **Size:** 239 KiB zipped, well under the 3 MB limit.
- **Cost outside Cloudflare:** W5 and W6 call the Claude API, which is billed per call. Nothing else in this list costs money.

## Recommendation

1. **Done: W1 alone from its branch** (version `bed3342a`, 11 November 2026). Before that deploy I checked `cfa29cc` in a scratch copy: 20 test files, 228 tests pass, and the dry run builds (108.75 KiB) with the same KV namespace and cron as live.

2. **Next: W2 to W20 in one deploy**, after your yes on this list. Splitting them further would mean new branches that remove code, which then have to be tested again in combinations nobody has run; the 353 tests cover them together. Before that deploy:
   - Say whether the AFAR feed should stay off (it goes live as off from this folder).
   - Decide whether W4 (instant publishing) goes live now. If not, a session can make a branch without it, test it and dry-run it.
   - Fix the morning review so it runs unattended and writes its report (see the update at the top).
   - Set ANTHROPIC_API_KEY yourself (`npx wrangler secret put ANTHROPIC_API_KEY`) only if you want W5 and W6 on now.
   - Deploy from a committed copy of the branch, not the working folder, so only reviewed code goes live; run `npm ci` first because of the new AI package.
   - Watch the first 30-minute run with `npx wrangler tail`.

## Rollback

To undo the W2 to W20 deploy and keep the portfolio link:

```
npx wrangler deployments list
npx wrangler rollback bed3342a-3991-4982-b5b7-ec92cbd1ecff
```

`bed3342a` is the version live now (`cfa29cc`: the 29 October code plus W1).

To also take out the portfolio link (the code from before 11 November):

```
npx wrangler rollback 1200c254-2364-4f26-9f09-7fe0395fb57f
```

`1200c254` is the `a7b023b0` code (commit `b305b3b`) with your secret change of 29 October 2026, 14:28 UTC. Rolling back to `a7b023b0` itself gives the same code, but with the secrets as they were before that change, so `1200c254` is the safer target of the two. Any of these undoes the code within a minute.

A rollback does not undo what the new routes already wrote: stories published by instant set-up stay published, and companion links, stamps, collection pieces and the CMS counts stay in the CMS and KV. The site pages go back to quietly hiding the parts whose routes answer 404.

## Sources

STATUS rows S129 and S135; handoff/WEBFLOW-LOCK.md entries of 31 October to 10 November 2026; handoff/CHANGE-LOG-MAKES-PORTFOLIO-2026-11-10.md; docs/value-playbook-changelog-2026-10-31.md; docs/work-trip-life-2026-10-31.md; docs/expat-pets-ux-2026-10-31.md; docs/tll-phase0-change-log-2026-11.md; docs/tll-phase1-change-log-2026-11.md; docs/monday-summary-2026-11-02.md; the header comment in src/intake.js.
