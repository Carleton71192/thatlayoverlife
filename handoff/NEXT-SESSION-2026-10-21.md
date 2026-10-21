# Brief for the next cloud session (21 October 2026)

Nancy, 21 Oct: "Can I give you permission to do these things?" then "Ok continue", and "That Layover life needs a mobile review." The cloud session of 20 to 21 October (session_01GTTttGvX2VTwovAB2g1cLf) could not reach Cloudflare or the live site, so it wrote everything into the repo and left the doing to a session started after Nancy changed the environment settings. This file is that session's list. Work top to bottom. Every value below comes from an environment variable; never print one, never paste one into chat or a file.

## 0. First minute

1. `git fetch origin claude/new-session-zxm063 && git checkout claude/new-session-zxm063 && git pull` (the branch with all of the 21 October work; last commit on the list below).
2. Check reach and variables, values hidden:
   ```
   for h in https://www.thatlayover.life/ https://api.cloudflare.com/client/v4/ https://tll-travel-wire.thatlayoverlife.workers.dev/health https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/package.json; do printf "%s " "$h"; curl -sS -o /dev/null -w "%{http_code}\n" --max-time 12 "$h"; done
   for v in CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID ANTHROPIC_API_KEY MEMBERSTACK_SECRET_KEY WEBFLOW_API_TOKEN; do [ -n "${!v}" ] && echo "$v set" || echo "$v missing"; done
   ```
   If a host still answers 000 or a variable is missing, stop and tell Nancy which one; the settings page is the cloud environment menu in the session title bar, then Edit.
3. Take the Webflow lock: write the holder line in handoff/WEBFLOW-LOCK.md, commit, and tell Nancy so the Mac session stops editing the site.

## 1. The Travel Wire Worker (repo root, already live)

wrangler reads CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID from the environment on its own.
```
npx wrangler secret list
```
If STORY_HOOK_TOKEN is not in the list, make one and set it without showing it:
```
STORY_HOOK_TOKEN="$(openssl rand -hex 32)"; printf '%s' "$STORY_HOOK_TOKEN" | npx wrangler secret put STORY_HOOK_TOKEN
npx wrangler deploy
curl -sS https://tll-travel-wire.thatlayoverlife.workers.dev/health
```
Keep STORY_HOOK_TOKEN in the shell for step 3. If PROFILE_HOOK_TOKEN is missing too, do the same for it (it is in the S117 list, so it should be there).

## 2. The /submit Worker (worker/, never deployed)

```
cd worker
npx wrangler kv namespace create TLL_KV
```
Paste the id it prints into worker/wrangler.toml in place of `<fill after wrangler kv namespace create TLL_KV>` (sed is fine). Then:
```
printf '%s' "$ANTHROPIC_API_KEY" | npx wrangler secret put ANTHROPIC_API_KEY
printf '%s' "$MEMBERSTACK_SECRET_KEY" | npx wrangler secret put MEMBERSTACK_SECRET_KEY
printf '%s' "$WEBFLOW_API_TOKEN" | npx wrangler secret put WEBFLOW_API_TOKEN
npx wrangler deploy
cd ..
```
Note the address wrangler prints (https://tll-worker.<subdomain>.workers.dev) as WORKER below. Check `curl -sS $WORKER/health` and `curl -sS $WORKER/places | head -c 200`. Before the first real call, confirm the Memberstack verify-token path in worker/src/index.js (comment above the fetch) against the Memberstack Admin API docs; if the path differs, fix it, run `cd worker && node --test test/*.test.js`, redeploy. Commit the wrangler.toml id change.

## 3. Webhooks

- Webflow, through the Webflow MCP (data_webhook_tool, site 69d6145cf421c777840c1e25): trigger collection_item_published, url `https://tll-travel-wire.thatlayoverlife.workers.dev/hooks/story-published?token=<STORY_HOOK_TOKEN>`. Check with a single-item republish of one story and `wrangler tail`.
- Memberstack: no tool creates webhooks, so tell Nancy the address to paste in the Memberstack dashboard under Dev Tools, Webhooks, for member.created and member.updated: `https://tll-travel-wire.thatlayoverlife.workers.dev/hooks/member-updated?token=<PROFILE_HOOK_TOKEN>`. She holds that token; the session never needs it.

## 4. Webflow, under the lock (all code is in the repo)

Call webflow_guide_tool once first. Then, in this order, each followed by a subdomain-only check before the full publish:
1. Story edit (handoff/packet-d/BUILD-STORY-EDIT-2026-10-21.md, steps 2 to 5): /submit v2 embed + styles with data-worker=WORKER and the hosted script pinned to the latest commit; /account hosted script tll-acct-stories-v2.js in place of tllacctstoriesv1 plus `<div data-tll-worker="WORKER" hidden></div>`; Stories Template embed src/pages/story/v3/embed-st3-owner-edit-v1.html and the three author-row attributes (Designer bindings; if the Data API cannot bind them, leave a note for Nancy's Designer click); the Updated receipts row.
2. Jay's beta notes (handoff/packet-d/ROW-beta-jay.md and ROW-languages-list.md): story embed 3074c26c without mins(); site footer script from src/site/site-footer-2026-10-21-after.html; /edit-profile embeds 05, 01-b, 16, 17; "+ AQ" copies (profile footer v3-thin, tll-acct-counts-v1.js at a new pin, Home 405baa84, About c024f6d7); /the-map footer updateCount from src/pages/the-map/footer-v6-aq.html; the map counter label text "PLACES VISITED".
3. Home dashboard for members (handoff/packet-d/ROW-home-map-mobile.md): embed 405baa84 from src/pages/home/after-2026-10-20b/.
4. Publish to thatlayover.life, www.thatlayover.life and the subdomain. Log the rows from handoff/packet-d/ROW-*.md in handoff/STATUS.md with real numbers.
5. Send Nancy the Jay script from handoff/packet-d/TEST-JAY-STORY-EDIT.md, section "For Jay".

## 5. Mobile review

```
node tools/mobile-review.mjs
```
It writes reports/mobile-review/<date>/README.md and the screenshots (26 pages at 390 and 1440, signed out). Read every phone screenshot, then write handoff/CHANGE-LOG-MOBILE-2026-10-21.md: one row per finding with page, what is wrong, cause in the code, fix, and a copy table; keep the writing rules (US English, no em dashes, no exclamation marks, never filed, ship, ledger, the shelf, counted by hand). Stop for Nancy's approval before fixing anything beyond the three already approved above.

## Still open for Nancy

- Strava field rule (B5): accept only a Strava address or username. No answer yet.
- The escalator photo from Jay (B2).

## Commits on the branch from 21 October (cloud session)

1fb1656 story edit build; e98f143 beta log; 693c6bd languages list; 965428b beta notes B1, B3, B4, B6; d108306 PLACES VISITED; cfaaaee Jay test plan; 64019b4 and 3d87023 home dashboard member map; this file and tools/mobile-review.mjs.
