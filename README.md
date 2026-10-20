# The Travel Wire

The data service behind the Travel Wire page on [ThatLayover.Life](https://thatlayover.life).

Every 30 minutes it reads the travel desks' RSS feeds, tags each headline by region
and country, and serves the newest 100 as JSON. The Webflow page fetches that JSON
and renders it. Headlines, links and the feed's own snippet only. Every click goes
to the source.

Runs on Cloudflare Workers, free tier, about $0 a month.

```
GET /wire                         the newest 30 items
GET /wire?region=EUROPE           one region
GET /wire?country=BG&limit=3      one country, for the country page strip
GET /health                       is it alive, and how fresh is the wire
```

## Deploy it, step by step

You need a terminal and about 15 minutes.

**Paste one command, press Enter, wait for it to finish, then paste the next.**
Pasting several at once is the one way this goes wrong: the lines run together,
and anything still queued gets fed into the next question the terminal asks. If a
step asks you to confirm something, type `y` and press Enter.

### 1. Install Node.js

Go to [nodejs.org](https://nodejs.org) and click the big LTS button. Run the
installer. Then open Terminal (on a Mac: press Cmd+Space, type "Terminal", press
Enter) and check it worked:

```bash
node --version
```

You should see something like `v22.x.x`. If you see "command not found", the
installer did not finish. Try it again.

### 2. Get this project onto your computer

```bash
git clone https://github.com/Carleton71192/thatlayoverlife.git
```

```bash
cd thatlayoverlife
```

```bash
npm install
```

Let `npm install` finish before going on. It takes 30 to 60 seconds and ends with
a line like `added 200 packages`. Nothing after this point works without it.

### 3. Make a free Cloudflare account

Go to [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) and sign
up. You do not need to add a domain and you do not need a credit card. The free
tier covers this service comfortably.

### 4. Log the terminal into Cloudflare

```bash
npx wrangler login
```

A browser window opens. Click **Allow**. Come back to the terminal when it says
you are logged in.

### 5. Create the storage the wire lives in

```bash
npm run setup-kv
```

That creates the storage on your Cloudflare account and writes its id into
`wrangler.toml` for you. There is nothing to copy by hand. If it says you are not
logged in, go back to step 4.

Run it twice and it will not clobber anything: it stops and tells you the id it
already has.

### 6. Check the feeds and fix the roster

```bash
npm run verify-feeds -- --apply
```

This visits all seven feeds, reports which ones actually work, and switches the
roster in `src/feeds.js` to match. Drop the `-- --apply` if you would rather see
the report first and change nothing.

It also prints what each site's robots.txt says about the feed path, so anything
that does not want to be aggregated can be switched off deliberately. See
[Feed status](#feed-status-read-this-before-you-launch) below for where things
stood when this was built.

### 7. Deploy

```bash
npx wrangler deploy
```

At the end it prints your live URL. It looks like:

```
https://tll-travel-wire.YOUR-SUBDOMAIN.workers.dev
```

**That URL plus `/wire` is what to send back.** For example:
`https://tll-travel-wire.YOUR-SUBDOMAIN.workers.dev/wire`

### 8. Fill the wire immediately

The scheduled job runs on the hour and the half hour, so right after deploying the
wire is empty. To load it now, set a password:

```bash
npx wrangler secret put REFRESH_TOKEN
```

Type any password you like when it asks and press Enter. Nothing appears on screen
as you type it. The secret reaches the live worker straight away, with no redeploy
needed.

Then trigger a run, putting your own password and your own URL in:

```bash
curl -X POST -H "Authorization: Bearer YOUR-PASSWORD" https://tll-travel-wire.YOUR-SUBDOMAIN.workers.dev/refresh
```

It answers with a summary of what it pulled from each feed. Now open your `/wire`
URL in a browser and you should see headlines. From here it refreshes itself every
30 minutes and you never touch it again.

Without `REFRESH_TOKEN` set, `/refresh` returns 404 and cannot be triggered by
anyone else.

### Watching it run

```bash
npx wrangler tail
```

Leave that open and you see one line per run:

```
wire 2026-08-22T14:30:00.000Z total=98 new=12 feeds[skift=24 points-guy=18 simple-flying=25 bbc-world=9]
```

Press Ctrl+C to stop watching.

## When something goes wrong

**`npm error EACCES: permission denied` and a path in `~/.npm/_cacache`**

Your npm cache has files owned by root, usually left behind by an old
`sudo npm install -g`. It blocks every npm command until it is repaired:

```bash
sudo chown -R $(whoami) ~/.npm
```

It asks for your Mac login password. Nothing appears on screen while you type it,
which is normal. Then run `npm install` again.

To sidestep it without a password, `npm install --cache ~/.npm-tll-cache` uses a
different cache, though the broken one will keep causing trouble elsewhere.

**Two commands ran together on one line**

Something like `npm installnpx wrangler login`, followed by `Unknown command`.
The paste landed without a newline. Press Enter after each command and wait for
the prompt to come back before pasting the next one.

**`Cloudflare is not logged in yet`**

Run `npx wrangler login`, click Allow in the browser, then try again.

**`Wrangler is not installed in this project yet`**

`npm install` has not finished successfully. Run it on its own and watch for it
to end with a line like `added 200 packages`.

**The wire is empty at `/wire`**

The scheduled job has not run yet. Step 8 above fills it immediately. To confirm
the service itself is alive, open `/health`.

**Fewer sources than expected**

Run `npm run verify-feeds` and read the report. A feed that fails is skipped, and
the run carries on with the rest.

## Feed status, read this before you launch

The build environment could not reach the feed hosts, so nothing here was checked
against the live web. `npm run verify-feeds -- --apply` does that check on your
machine in about ten seconds and fixes the roster for you. What is set right now,
and why:

| Source | State | Why |
|---|---|---|
| Skift | on | Trade press. Confirmed live, 10 items. |
| The Points Guy | on | Loyalty and aviation. Confirmed live, 20 items. |
| Simple Flying | on | Aviation. Confirmed live, 10 items. |
| BBC | on | BBC World with a travel keyword filter, because the standalone BBC Travel feed was retired. Confirmed live, 3 of 29 items kept. |
| The Guardian | on | Travel desk of a national paper. Added for destination coverage. |
| Atlas Obscura | on | Place-led features. Added for destination coverage. |
| Conde Nast Traveler | on | Consumer magazine. Added for destination coverage. |
| AFAR | on | Consumer magazine. URL unconfirmed. |
| Nomadic Matt | on | Independent blog. |
| Adventurous Kate | on | Independent blog. |
| Never Ending Footsteps | on | Independent blog. |
| Lonely Planet | **off** | Serves HTML, not a feed. Confirmed dead. |
| Reuters | **off** | HTTP 404. Reuters shut down its public agency feeds. |
| AP | **off** | Serves HTML. That URL is the hub page, and AP publishes no public travel feed. |

The first four were confirmed live on 23 August 2026. The seven added after that
have not been checked from here, so run `npm run verify-feeds -- --apply` and it
will switch off any that do not work.

### Adding your own

Open `src/feeds.js`, copy an existing block, and change the three fields that
matter: `id` (anything unique), `source` (the name shown on the card, verbatim),
and `url`. Most blogs put their feed at `/feed/` or `/rss`. Then:

```bash
npm run verify-feeds -- --apply
npm run deploy
```

If a feed carries a lot of non-travel content, add `travelOnly: true` and it gets
the same keyword filter the BBC World feed uses.

Two things worth knowing. The wire keeps the newest 100 items across every feed,
so a very prolific source can crowd out quieter ones. And more card and loyalty
blogs will push the mix toward `GLOBAL`, because that writing rarely names a
place. Destination writing is what fills the region chips.

Nothing breaks if a feed is wrong. A feed that fails is logged and skipped, and the
rest of the run continues. `verify-feeds` is the tool that settles the roster.

If Reuters and AP stay unavailable, the honest options are to run with the four
working desks, or to license a wire service. Both are fine. Four desks fills the
page.

## What the site gets

```json
{
  "updatedAt": "2026-08-22T14:30:00.000Z",
  "items": [
    {
      "id": "f3a91c...",
      "title": "Doha extends free transit visas to 96 hours",
      "link": "https://skift.com/...",
      "source": "SKIFT",
      "publishedAt": "2026-08-22T09:12:00.000Z",
      "summary": "Qatar doubles the stopover window for 95 nationalities.",
      "region": "MIDDLE EAST",
      "country": "QA"
    }
  ]
}
```

**Query params**

| Param | Values | Default |
|---|---|---|
| `region` | `EUROPE` `ASIA` `AMERICAS` `AFRICA` `MIDDLE EAST` `OCEANIA`. Omit for everything, including `GLOBAL`. | none |
| `country` | ISO 3166-1 alpha-2, such as `BG`. Case insensitive. | none |
| `limit` | 1 to 100 | 30 |

`region=middle-east` and `region=MIDDLE_EAST` both work. An unrecognized region
returns everything rather than an empty page.

CORS is open (`Access-Control-Allow-Origin: *`) so the Webflow page can fetch it
directly. Responses cache at Cloudflare's edge for 5 minutes.

## How the tagging works

`src/tagger.js` matches the title and summary against a gazetteer of country
names, aliases, demonyms and around 250 travel cities and landmarks
(`src/gazetteer.js`), then maps the country to one of six travel regions
(`src/regions.js`). Anything it cannot place is `GLOBAL` with a null country.

A few rules keep it from embarrassing itself:

- The longest phrase wins, so "Latin America" is a region and not the United States.
- A title match outranks a summary match.
- Words that double as ordinary English ("turkey", "nice", "cork") only count when
  the headline capitalized them.
- Words that double as personal names ("Michael Jordan") are ignored when a
  capitalized word sits in front of them, unless the whole headline is title case.

To add a city, put it in `src/gazetteer.js` under its country code and add a test.

## Working on it

```bash
npm test                         # unit tests, no network needed
npm run dev                      # run it locally at http://localhost:8787
npm run setup-kv                 # create the KV namespace, write its id to wrangler.toml
npm run verify-feeds             # check the feeds, report only
npm run verify-feeds -- --apply  # check the feeds, then fix src/feeds.js
npm run deploy
npm run tail                     # watch the cron runs
```

| File | What it does |
|---|---|
| `src/index.js` | Routes, CORS, edge caching, the cron entry point |
| `src/ingest.js` | One run: fetch, normalize, tag, merge, store |
| `src/feeds.js` | The feed roster and the travel keyword filter |
| `src/xml.js` | RSS and Atom reader |
| `src/normalize.js` | One item into the shape above |
| `src/tagger.js` | Region and country tagging |
| `src/gazetteer.js` | Places |
| `src/regions.js` | Country to region table |
| `src/store.js` | KV read and write, dedupe, filters |
| `src/story-hook.js` | Webflow publish webhook: a story's countries onto the author's map |
| `src/profile-sync.js` | Memberstack webhook: profile fields onto the Contributors item, item creation on sign-up |
| `src/profile-save.js` | POST /profile/save, the /edit-profile autosave |
| `src/map-snapshot.js` | POST /map-snapshot, the count snapshot from /the-map |
| `src/member-auth.js` | Memberstack token check, hourly counters, CORS allow list |
| `scripts/setup-kv.mjs` | Creates the KV namespace and updates `wrangler.toml` |
| `scripts/verify-feeds.mjs` | Checks every feed, optionally rewrites the roster |

## The rules this service keeps

- Titles, links and the feed's own snippet only. Article bodies and images are
  never fetched and never stored.
- Every item carries its source name verbatim.
- No API keys, no paid services.
- A feed that disallows aggregation gets switched off in `src/feeds.js` and
  `verify-feeds` reports what robots.txt says about each one.

## Published stories go on the author's map

When a story is published on thatlayover.life (which means a human approved
it), Webflow tells this worker, and the story's countries are added to its
author's map. It only ever adds: a country already on the map keeps the trip
type the author gave it, and nothing is removed. Each story is applied once, so
republishing never puts back a country the author took off.

Countries come from the story's Countries reference when it is set, otherwise
from the byline line ("CHILE AND ARGENTINA" adds both; "BALKANS" adds none).

To switch it on, set three secrets, one command at a time:

```bash
npx wrangler secret put STORY_HOOK_TOKEN
```

(any long password you make up; it goes in the webhook address below)

```bash
npx wrangler secret put WEBFLOW_TOKEN
```

(a Webflow site API token with CMS read access)

```bash
npx wrangler secret put MEMBERSTACK_KEY
```

(your Memberstack secret key, from Memberstack under Dev Tools)

Then in Webflow, under Site settings, then Apps and integrations, then
Webhooks, add a webhook for **Collection item published** pointing at:

```
https://tll-travel-wire.YOUR-SUBDOMAIN.workers.dev/hooks/story-published?token=YOUR-PASSWORD
```

Until all three secrets are set, the address does nothing. `npx wrangler tail`
shows one `story-hook` line per published story, with what was added.

## Member profiles: the webhook and the two member routes

Three routes keep a Traveler's public profile (the Contributors item behind
/contributors/{slug}) in step with what the member does on the site. Nothing in
the browser ever holds a Webflow token; every write goes through this worker.

```
POST /hooks/member-updated?token=...   Memberstack webhook, member.created and member.updated
POST /profile/save                     /edit-profile autosave, Authorization: Bearer <Memberstack token>
POST /map-snapshot                     /the-map writes the count snapshot, same Bearer token
```

**/hooks/member-updated** (`src/profile-sync.js`). On member.updated the
member's custom fields (keys equal the Contributors slugs: one-line, home-base,
from-and-lived-in, languages, credit-mode, pen-name, contact-mode, visibility,
share-ranges, links-shown, bio-long, the ten platform links, list-expats,
list-creators, list-press) are copied onto the item and it is republished. On
member.created with no item yet, one is created with the name, a slug from the
name (-2, -3 on a collision), the photo if Memberstack has one, visibility
Public, contact-mode Relay, credit-mode Full, memberstack-id and member-since,
then published, so a profile is live within a minute of sign-up. The typed
counts are not copied any more. badge-label, press-verified, map-snapshot and
slug are never written from a member payload.

**/profile/save** (`src/profile-save.js`). Body `{"fields": {"one-line": "...",
"links-shown": "instagram,youtube"}}`. The token is verified with Memberstack
and only that member's own item is written, then published. Allowed slugs are
the member-writable ones above plus name, avatar, email and crew; anything else
is a 400. Option fields take the option name or id. Switches take true/false,
"true"/"false", "on"/"off". 60 writes per member per hour, then 429. Replies
`{"ok":true,"savedAt":"...","slug":"...","fields":[...],"published":true}`.

**/map-snapshot** (`src/map-snapshot.js`). Body
`{"countries":87,"antarctica":true,"places":88,"layovers":12,"savedAt":"2026-10-20T12:00:00Z"}`
(whole numbers 0 to 300, a boolean, an ISO date; nothing else). Written as a
JSON string to map-snapshot on the member's own item, then published. 30 per
member per hour.

Both member routes answer CORS preflights for https://thatlayover.life,
https://www.thatlayover.life and https://that-layover-life.webflow.io only,
with Authorization and Content-Type allowed. A bad or missing token is a 401; a
member with no Contributors item yet is a 404; until the secrets are set the
routes answer 503.

Secrets, one command at a time:

```bash
npx wrangler secret put PROFILE_HOOK_TOKEN
```

(any long password you make up; it goes in the webhook address below)

```bash
npx wrangler secret put WEBFLOW_TOKEN
```

(a Webflow site API token with CMS read and write access; the same one the
story webhook uses)

```bash
npx wrangler secret put MEMBERSTACK_KEY
```

(your Memberstack secret key, from Memberstack under Dev Tools; the same one the
story webhook uses)

Then in Memberstack, under Dev Tools, then Webhooks, add one webhook for the
events **member.created** and **member.updated** pointing at:

```
https://tll-travel-wire.YOUR-SUBDOMAIN.workers.dev/hooks/member-updated?token=YOUR-PASSWORD
```

The /edit-profile and /the-map blocks read the worker's base URL from a
`data-worker` attribute on their root element; with it empty the page stays
read-only. `npx wrangler tail` shows one `profile-sync`, `profile-save` or
`map-snapshot` line per call.

## Docs

`docs/` holds the original handoff package: the brief, the feed contract, and the
design spec for the page script.
