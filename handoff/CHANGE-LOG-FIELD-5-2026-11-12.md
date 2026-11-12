# Link-out titles and trip dates from /submit (12 November 2026)

For Nancy. **Live since 12 November 2026, 09:28 UTC** (Worker version `4ff59e28`, on your "deploy the field-5 fix"). Nothing changes in Webflow.

## In short

- On /submit, every "link to a piece published elsewhere" is refused by the Worker with "A title is needed.", even when the member typed a title. The member still sees "Saved. It is with the editor.", so nobody notices; no draft is made for you.
- Every full story sent from /submit loses its trip date ("When were you there?"). The story itself still arrives as a draft.
- The fix is small: the Worker now reads the title and the trip date under the name the page really sends. Nothing on the page changes.
- Deployed on your yes: the live code of `040dddfb` plus this fix only. The photo hold is still not deployed. After the deploy every Worker page answered normally; no test story or link-out was sent.

## What was wrong

Both forms on /submit have an input whose web name is `field-5` (a Webflow default; its label name in the Designer is "Field 5"). In the story form it is the trip date, in the link-out form it is the title.

The page code that sends the form to the Worker uses the web name, so it sends `field-5`. I checked this on the page served on www today and in the site code it loads (16.59.0 and later): it builds the message from each input's web name, not its label name. The Worker looked only for `Field 5` (and `title`, `trip-when`), never `field-5`. So the link-out had no title as far as the Worker could tell, and the story had no trip date.

The tests passed because they also used `Field 5`. Nothing was sent on www to check this; it was confirmed from the page, the site code and the Worker code. The new tests fail on the live Worker code and pass with the fix.

## What changes

- **Worker, src/intake.js:** the link-out title is read from `field-5`, then `Field 5`, then `title`. The story trip date is read from `trip-when`, then `field-5`, then `Field 5`. The old names still work, so nothing that works today can break. A link-out with no title at all is still refused.
- **Tests, test/intake.test.js:** four new tests send exactly what the page sends, for a link-out and for a story, through the whole intake path. Full suite: 424 pass. One other test fails, the same on the repo before this change: a home cover build check from the design audit work, not the Worker.
- **Not changed:** the Webflow inputs keep their names (renaming them needs the Designer and a publish). Do not rename them now either: this fix reads the current names.

## How it is deployed

The live Worker is version `040dddfb` (11 November 2026, 14:39 UTC, from commit `af5de76`). The deploy would be that same code plus only this fix, from a clean copy, with `npx wrangler deploy`. Before deploying, the version id and the time are noted here and in handoff/WEBFLOW-LOCK.md.

The photo hold (member photos saved as drafts, already reviewed) is also in the repo and waiting for a Worker deploy. It is a separate change. It goes out with this one only if you say so.

After the deploy: check /health and one plain page read on the Worker. No test story or link-out is sent to the live Worker unless you ask for it.

## Rollback

In the Cloudflare dashboard: Workers, `tll-travel-wire`, Deployments, roll back to `040dddfb`. Or in the repo folder:

```bash
npx wrangler rollback 040dddfb-2227-4431-ba4a-6be10cdf342f
```

Rolling back brings the old behavior back: link-outs refused, trip dates dropped. Nothing else changes.
