# TLL Motion Lab (dashboard component, v1, 12 November 2026)

A dashboard tool for previewing the Fable hero animation: five states (Idle, Signup, Layover, Stamp, Magnus joins), layer toggles, speed, easing, a night or paper canvas, cursor coordinates on a 1920 x 1080 artboard, and a timeline with keyframes. Refactored from the one-page Motion Lab layout Nancy finalized on 11 November 2026. Not loaded by the live site.

## Files

| File | What it is |
|---|---|
| `tll-motion-lab-v1.js` | The component. `createMotionLab(root, options)` builds it inside any element and returns `{ go, play, pause, replay, setLayer, setSpeed, setEase, setTheme, destroy, current }`. Also exports the default states, layers and tracks, and the small helpers the tests cover. |
| `tll-motion-lab-v1.css` | All styles, scoped under `.tml`. The Tailwind CDN config (brand colors and fonts) is now the tokens at the top: `--tml-rose`, `--tml-rose-deep`, `--tml-teal-light`, `--tml-teal-dark`, `--tml-night`, `--tml-cream`, `--tml-paper`, `--tml-ink`, `--tml-violet` (placeholder Magnus), `--tml-rose-text` (small rose text on light panels, for contrast), `--tml-font-display`, `--tml-font-body`, `--tml-font-mono`, `--tml-font-mark`. |
| `index.html` | The standalone page. Open it through any local web server (ES modules do not load from a file:// address), for example `npx serve src/dashboard/motion-lab`. |
| `../../../test/motion-lab.test.js` | Unit tests (`npx vitest run test/motion-lab.test.js`). |

## Assets and fonts

- No Tailwind and no build step. The page links `tll-motion-lab-v1.css` itself; if a page embeds the component without that link, the script adds it from the folder the script was loaded from (`import.meta.url`), so the paths hold wherever the folder is served. A page that already links the stylesheet is detected; pass `stylesheet: false` to skip the automatic link.
- Fonts load the way the site loads them: one Google Fonts stylesheet with `display=swap` (Playfair Display 800 and italic 800, IBM Plex Sans Condensed 400 and 500, JetBrains Mono 400 and 600, Syne 800). Syne is used only in the wordmark. On a page that already loads these fonts, leave the link out.

## Fable vectors (slots)

Every SVG layer is a slot. Pass the Fable export's markup by layer id:

```js
createMotionLab(el, { slots: { map: '<g>…world-equal-earth paths…</g>', magnus: magnusSvgElement } });
```

Layer ids: `grid`, `map`, `route`, `stamps`, `magnus`, `grain`, `safe`. A slot accepts a string of SVG markup or an SVG element. `{{uid}}` in a string slot or an element's markup becomes this instance's id prefix (use it for pattern, gradient and filter ids). The canvas draws the layers in the source's order (`grid`, `map`, `route`, the focus ring, `stamps`, `magnus`, `safe`, `grain`); pass `zOrder` (layer ids, with `'@focus'` for the ring) to change it. The panel lists layers in array order.

To animate, a slot's elements carry `data-tml-part`: `r1`, `r2` (paths with class `route`, `pathLength="1"`), `CPH`, `DOH`, `GRU` (groups with class `pin`), `badge`, `stamp`, `magnus` (legs with class `leg` trot). A state's `show` map drives them: a pin dims when its key is false, any other part gets class `on` when true. A slot without a part does not animate. Slot markup is inserted as is, so pass only trusted Fable exports, never member text.

States, layers and tracks can all be replaced through `options.states`, `options.layers`, `options.tracks` and `options.duration`. In a headline, `*words*` get the italic rose accent.

Other options: `title` and `file` (the labels in the panel and the top bar), `artboard` (`{ width, height }` for the cursor readout, default 1920 x 1080), `autoplayMs` (default 2600, divided by speed), `hotkeys` (default true) and `stylesheet` (default true). A layer is `{ id, label, on, svg, file?, className?, opacity? }`: `file` is the name shown in the layer list (default `<id>.svg`).

The component renders no `main` landmark and no page heading; the host page supplies them (index.html does).

## Motion and accessibility

- Speed (0.5x, 1x, 2x) scales every duration through `--k`; easing sets `--ease`. Both are set on the component root, not the page.
- `prefers-reduced-motion`: transforms, blur and the route draw are turned off, only short fades remain, the pulse and the trot stop, and the counter jumps straight to its value.
- Keys 1 to 5 pick a state and space toggles autoplay, only while focus is inside the lab (click its background or any control first), never while typing and never on a button. Two labs on one page never react to the same key. Pass `hotkeys: false` to turn the keys off.
- A visually hidden live region announces a state's headline and subline when you pick it, and once when autoplay pauses; it stays quiet on load and during autoplay. Every control is a real button or checkbox with a focus ring, and pressed states stay in sync when the API changes speed, easing or theme.
- Small text meets WCAG AA contrast (muted text at 62% ink, small rose text in the darker `--tml-rose-text`).
- On phones (under 640 px) the copy sits under the artwork instead of over it, because it does not fit inside a 16:9 canvas.

## Changes from the source layout

- Tailwind CDN and inline config removed; utilities became the scoped classes in the CSS.
- No global ids: pattern and filter ids get a per-instance prefix, and parts are found by data attributes, so two labs can share a page.
- Text from states, chips and layer labels is escaped before it goes into the page.
- Speed and easing are set on the component, not on `<html>`.
- `destroy()` stops autoplay, timers and listeners.
- A quick second state change cancels the first one's pending text swap, so the headline never lags behind the selected state.
- Headline words are separated by real spaces, so copying the headline gives readable text.
