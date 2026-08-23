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

The scheduled job runs on the half hour, so right after deploying the wire is
empty. To load it now, set a password and trigger a run by hand:

```bash
npx wrangler secret put REFRESH_TOKEN
```

Type any password you like when it asks, and press Enter. Then redeploy so the
worker picks it up, and trigger the run (replace both the URL and the password
with yours):

```bash
npx wrangler deploy
curl -X POST -H "Authorization: Bearer YOUR-PASSWORD" https://tll-travel-wire.YOUR-SUBDOMAIN.workers.dev/refresh
```

Now open your `/wire` URL in a browser. You should see headlines. From here it
refreshes itself every 30 minutes and you never touch it again.

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
| Skift | on | Standard public WordPress feed at `/feed/`. |
| The Points Guy | on | Standard public WordPress feed at `/feed/`. |
| Simple Flying | on | Standard public WordPress feed at `/feed/`. |
| BBC | on | Uses the BBC World feed with a travel keyword filter, because the standalone BBC Travel feed was retired. |
| Lonely Planet | **off** | The URL in the brief is unconfirmed. |
| Reuters | **off** | Reuters shut down its public agency feeds. It needs a current URL or it gets dropped. |
| AP | **off** | The URL in the brief is an HTML page, not a feed. AP does not publish a public travel feed. |

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
npm test                         # 51 unit tests, no network needed
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
| `scripts/setup-kv.mjs` | Creates the KV namespace and updates `wrangler.toml` |
| `scripts/verify-feeds.mjs` | Checks every feed, optionally rewrites the roster |

## The rules this service keeps

- Titles, links and the feed's own snippet only. Article bodies and images are
  never fetched and never stored.
- Every item carries its source name verbatim.
- No API keys, no paid services.
- A feed that disallows aggregation gets switched off in `src/feeds.js` and
  `verify-feeds` reports what robots.txt says about each one.

## Docs

`docs/` holds the original handoff package: the brief, the feed contract, and the
design spec for the page script.
