# Circle flags · for the TLL live build

406 round SVG flags from **HatScripts/circle-flags** (MIT, see `LICENSE`, keep it with the files). Browse them at https://kapowaz.github.io/circle-flags/gallery.

## Files
- `flags/{code}.svg`: ISO 3166-1 alpha-2, lowercase (`dk.svg`, `me.svg`, `gh.svg`). Also subdivisions (`gb-sct`, `us-ca`, `es-ct`) and a few others (`european_union`, `xk` Kosovo, `aq` Antarctica).
- `flags/xx.svg`: the neutral fallback. Use it when a code has no file.
- `index.json`: every available code, sorted, so you can check before rendering.

## How TLL uses them
- **Where:** story card flag chip (top-left), country rows on `/countries`, country page avatar, Filed From chips on profiles, Paw Passport country list, map tooltip.
- **Source of the code:** the Countries collection field `iso2` (lowercase it). Never guess a code from the country name.
- **Multi-country stories** (Balkans EV, Chile and Argentina): show the first country's flag. Put the rest in the meta line, not a flag stack.
- **Size:** 22px on cards and chips, 40px on country rows, 72–84px on the country page avatar. They're vector, so one file covers every size.
- **Markup:** `<img src="/flags/dk.svg" width="22" height="22" alt="" loading="lazy">`. Use `alt=""` when the country name is already printed next to the flag (almost always). If the flag stands alone, the alt is the country name.
- **Ring:** on photo backgrounds, add `box-shadow:0 0 0 2px rgba(255,255,255,.9)` so the flag doesn't disappear into the photo. On Cream/Paper, use `0 0 0 1px #E0DACE`.

## Hosting on Webflow
Upload only the flags you're using (the 6 live countries now, then more as countries earn pages) to the Asset library, and store each asset URL in a `Flag Image` field on the Countries collection. Don't hotlink jsDelivr from the live site. The emoji `flag-emoji` field stays as the plain-text fallback.

Replaces the CSS-gradient flags in the prototype. Those were placeholders.
