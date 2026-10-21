# Submit v5: what changed (21 October 2026)

Built from the packet claude-code-send-2026-10-21 (packets 6, 7 and 8 are identical). Nothing is live yet. The new form waits for the tll-worker address.

## Where each v5 field goes

| v5 field | Where it lands |
| --- | --- |
| Sponsor rows (name + Paid for / Hosted / Gifted / Discounted) | Disclosure line readers see, for example "Hosted by X. Gifted by Y. Opinions are the writer's own." Names also join into Sponsored by. |
| Affiliate links tick | Adds "Contains affiliate links." to the disclosure line |
| Shout-outs, comped tick | Shout-outs list, marked comped |
| Reader question | reader-question |
| Sensory anchors | sensory-anchors |
| Hashtags | hashtag-set |
| Dates shown (posted / traveled / edited) | show-posted-date, show-traveled-date, show-edited-date |
| Themes | theme (list loads from the Themes collection) |
| Byline: credit, pen name | credit-mode, pen-name on the member profile, only when changed |
| Website, Instagram | personal-website-url, instagram-url on the member profile, only when changed |
| Lounge opt-in | Editor notes log (no CMS field for it yet) |
| Link mode | Posts the live Link-out story form. Form name and field names unchanged. |

Editing a live story keeps the same page and the same link.

## Gaps to decide

1. No `sponsors` CMS field yet. Rows live inside the disclosure line and are read back from it when a story is edited. Add the field if you want rows stored on their own.
2. Anonymous credit is not offered. The Worker supports Full name, First name and Pen name only.
3. Gallery holds 8 photos. The prototype says 12. The Worker limit is 8; raising it is a one-line change if you want 12.
4. Lounge opt-in has no CMS field.

## To go live

1. Deploy tll-worker (`cd worker`, then `npx wrangler deploy`) and send the workers.dev address.
2. That address goes into the v5 form and the story edit panel.
3. v5 goes on /submit. The old form stays on the page, hidden, so its name and history are kept.
