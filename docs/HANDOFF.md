# Handoff: The Travel Wire (RSS news service for ThatLayover.Life)

## What this is
Everything needed to build the live version of the Travel Wire — the news page that pulls headlines from major travel desks (Reuters, AP, BBC Travel, Skift, The Points Guy, Lonely Planet, Simple Flying), tags them by region and country, and serves them to the TLL site. The prototype design already exists; this package is for building the **data service** behind it, using Claude Code.

**The HTML prototype in this conversation is a design reference, not production code.** The task is to build a small aggregation service plus a page script that renders its output in the TLL brand.

## Never used Claude Code? Start here (15 minutes)

1. **Install.** Open the Terminal app (Mac: Cmd+Space, type "Terminal") and paste:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
   If it says `npm: command not found`, first install Node.js from https://nodejs.org (the LTS button), then retry.
2. **Make a folder and start Claude Code:**
   ```
   mkdir tll-travel-wire && cd tll-travel-wire
   claude
   ```
3. **Log in** when it asks (it opens a browser — use your Claude account).
4. **Paste the brief.** Open `BRIEF.md` from this package, copy the whole thing, paste it into the Claude Code prompt, press Enter.
5. **Say yes** when it asks permission to create files or run commands. When it finishes, it will tell you how to deploy (one command) and give you a URL.
6. **Send me the URL** and I'll wire it into the site prototype and write the Webflow page script.

That's it. Claude Code does the coding; you're just approving.

## Architecture (what the brief asks for)
- **A scheduled worker** (Cloudflare Workers free tier — no server, ~$0/mo) that every 30 minutes:
  - fetches the RSS feeds listed in `feed-contract.md`
  - normalizes items to one JSON shape
  - tags each item with region + ISO country where detectable (keyword/place matching)
  - stores the latest ~100 items in Workers KV
- **A public JSON endpoint** `GET /wire?region=&country=` that the Webflow page fetches client-side.
- **Headlines + links only.** No scraped article bodies — titles, source, timestamp, link, and the feed's own summary snippet. Every click goes to the source.

## Legal guardrails (already decided, don't relitigate)
- Aggregate titles/links/snippets only; never full text or images from the feeds.
- Name the source on every item.
- Respect robots/ToS of each feed; drop any feed that disallows aggregation.

## Files in this package
- `BRIEF.md` — the paste-ready brief for Claude Code (step 4 above)
- `DESIGN-SPEC.md` — the TLL-brand rendering spec for the page script
- `feed-contract.md` — feed list + the JSON shape the site expects

## What Nancy does vs what Claude Code does
- **You:** install, paste, approve, deploy (all guided), then send me the endpoint URL.
- **Claude Code:** writes the worker, the tagging logic, the tests, the deploy config.
- **Me (Claude Design):** the page design (done in the prototype), the Webflow page script once the endpoint exists.
