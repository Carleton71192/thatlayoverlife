# Dashboard canvas (prototype)

This is the integration layer for an animation exported from Fable. It plays inside the home page chapter "02 · Your travel dashboard". It has a player that takes a Lottie JSON file, an SVG with named groups, or a canvas/WebGL export. A state machine maps reader actions to the export's segments. A text version says the same things for screen readers. Open `index.html` to try it. It is a mock-up only: nothing here is loaded by the live site, nothing was committed, and Webflow was not touched.

**The Fable export was not attached.** The brief still contains the placeholder "[Paste or point Claude to your Fable export/Lottie JSON file]". I searched the repo for one before building:

- JSON files containing `"layers"` with the Lottie keys `v`, `fr`, `ip`, `op`
- `*.lottie` files
- any file named `fable` or `unfold`

None of those searches found anything. So the map on the page is a **STAND-IN ANIMATION**, labeled that way on the canvas. It is drawn in code on the brief's timeline (150 frames at 30 fps, three segments) and runs behind the same player interface, so you can click through every state and trigger today. Once the export is in the config, the same triggers play it.

## File structure

| File | What it is |
|---|---|
| `dashboard-canvas.js` | The controller (plain ES module with JSDoc comments). `FABLE_CONFIG` sits at the top: you paste the export keys there. |
| `dashboard-canvas.d.ts` | Types for the controller, the config, the player interface and the events. The `.d.ts` passes strict `tsc`. The JS files are not checked with `--checkJs`. |
| `dashboard-canvas.css` | The stage, loading preview, still map, hub tooltip and list, Paw Passport Stamp, and the reduced-motion rules. |
| `players/player-base.js` | The common player interface (JSDoc), a small event emitter, the frame clock (the only `requestAnimationFrame` loop in the layer) and the script loader. |
| `players/lottie-player.js` | Adapter for lottie-web 5.12.2 from cdnjs (pinned, with SRI). Loaded only when `type: 'lottie'`. |
| `players/svg-player.js` | Adapter for an inline SVG with named `<g id>` groups, animated with the Web Animations API. No library, and no network: it throws if `svg` holds no markup. |
| `players/canvas-player.js` | Adapter for a canvas or WebGL wrapper that exposes `seek(frame)`. |
| `players/standin-player.js` | The stand-in. It is a 2D canvas scene, run through the canvas adapter. |
| `players/standin-mask.js` | Generated land grid and map projection numbers (see `tools/`). |
| `tools/make-standin-mask.mjs` | Writes `standin-mask.js` from world-atlas 2.0.2. It uses the same data, projection and fit as the live chapter's `h3-dash-js`, so hub positions line up with the real map. |
| `demo.js` | Demo wiring only: SAMPLE trips, the mock Memberstack signup, the pet guide, and the state inspector. |
| `index.template.html` | The demo page source. It copies the live chapter's markup from `src/pages/home/live-2026-11-11/embeds/405baa84.after.html`. |
| `build.cjs` | Builds `index.html` from the template and the files above. It inlines the CSS and the modules and draws the still fallback map as inline SVG. |
| `index.html` | The built page. It is self-contained and makes no fetches. The only outside requests are the Google Fonts stylesheet and its font files. |
| `check.cjs` | The browser check (Playwright). |
| `shot-390.png`, `shot-1440.png` | Full-page shots at device scale 2. The fixed state inspector and the "All prototypes" link show part-way down, where the viewport was. |

Rebuild after any edit with `PATH=/opt/node22/bin:$PATH node build.cjs`.

## How to drop in the Fable export

1. **Export with markers.** If Fable can write markers into the Lottie file, name them exactly `The Blank Map`, `The Stamp Drop`, `The Connected Route` and, optionally, `Map Unfold`. The controller reads the markers from the file (`markers[].cm` is the name, `tm` the start frame, `dr` the length), and their frames take priority over the numbers in the config. If there are no markers, the frame numbers in the config are used (0 to 45, 46 to 90, 91 to 150).
2. **Pass the export inline.** Paste the Lottie JSON into `animationData`, or the SVG markup into `svg`. The page then makes no fetches. Loading the export from a remote URL on the real site (a Lottie `assetUrl`, or a canvas `moduleUrl`) is an owner decision; do not set either one until Nancy approves it.
3. **Edit the top of `FABLE_CONFIG` in `dashboard-canvas.js`:**
   - `type`: `'lottie'`, `'svg'` or `'canvas'`, depending on what Fable gave you.
   - `animationData`: the Lottie JSON, pasted inline. (`assetUrl` stays empty unless the owner approves a remote load.)
   - `renderer`: `'svg'` (the smallest build, `lottie_light`) or `'canvas'` (`lottie_light_canvas`, for very many layers).
   - `lottieBuild`: keep `'light'`. Use `'full'` only if the export uses After Effects expressions (the light builds skip them).
   - `fps` and `totalFrames`: 30 and 150 per the brief. For Lottie, the file's own `fr` and `op` override them.
   - `aspectRatio`: the export's width and height (the stage locks to it). `[960, 470]` matches the live map.
   - `markers`: only if the frames differ from the brief and the file has no named markers. `UNFOLD.sequence` is `['A','C']` by default. Give `UNFOLD` a `from` and `to`, or a marker named `Map Unfold`, to play one segment instead.
   - For `type: 'svg'`, paste the markup into `svg`, plus `timeline`: `[{ target:'#group-id', from, to, keyframes, easing }]` on the export's own frame numbers. The SVG adapter has no URL option.
   - For `type: 'canvas'`, use `create(mount)` or `moduleUrl`. Either one must return `{ seek(frame), resize?, setData?, destroy? }`. The wrapper drives `seek`; the export must not run its own loop.
4. **Choose the paw stamp mode** in `FABLE_CONFIG.paw`:
   - `'css'` is the stand-in: the separate `[data-dc-paw]` element.
   - `'layer'`: name the stamp layer `paw-passport-stamp` in Fable (Lottie writes the layer's `ln` as its id), and the controller toggles the class `is-paw-on` on it. The CSS rotates it and shifts its color. Animate a wrapper group in Fable rather than the layer itself, because a CSS transform overrides the layer's own transform while hovered.
   - `'asset'`: a second small export, with `paw.asset.enter` and `paw.asset.leave` frame ranges.
5. **Hubs.** If the Fable art is not drawn on the Equal Earth projection the live map uses, set `x` and `y` (0 to 1 across the canvas) on each hub by hand.
6. Run `node build.cjs` and `node check.cjs`. The STAND-IN label disappears on its own once `type` is no longer `'standin'`.

## States

| State | When | What shows |
|---|---|---|
| `idle` | Before the stage is within 600px of the screen. Nothing is loaded. | The loading preview, still |
| `loading` | The player script and the export are loading. Times out after `loadTimeoutMs` (8 s). | The loading preview. A slow shimmer runs only while loading and on screen, and never with reduced motion. |
| `ready` | Loaded and resting on a frame (`restFrame`) | The animation, still |
| `playing:A`, `playing:B`, `playing:C` | A segment is playing. Map Unfold shows as `playing:A` then `playing:C`; a single `Map Unfold` marker shows as `playing:unfold`. | Frames 0 to 45, 46 to 90, 91 to 150 |
| `paused:offscreen` | The stage is fully off screen, or the tab is hidden. The player is paused and no frame is scheduled. The state it came from is kept in `resumeTo`. | Nothing is drawn |
| `reduced-motion` | `prefers-reduced-motion: reduce`. Nothing plays; each trigger jumps to its segment's end frame. Switching the setting mid-play jumps to the end of the running segment. | End frames only |
| `error` | Load failed or timed out | The still map, a one-line note, the description and the counts. Triggers still update the counts and the spoken lines. `reload()` tries again. |

### Triggers and the queue rule

| Trigger | Segment | Rule while something plays |
|---|---|---|
| `view` (35% of the stage on screen) | A | Plays once per load |
| `stamp:add` (a tick, or a mock-added trip) | B | Queued. Each tick replays B; many quick ticks coalesce into one more replay. |
| `stamp:remove` | none | The stamp disappears from the resting frame at once |
| `cta:enter` (hover or keyboard focus on "Build your free map") | C | Queued, and takes the slot from B. Ignored while C itself is playing. |
| `cta:leave` | none | C always finishes |
| `signup:success` | Map Unfold (default A then C) | Replaces whatever is playing and clears the queue |
| `pet:enter` / `pet:leave` | Paw Passport Stamp | Independent of the map timeline |

The queue rule is written once, in `dashboard-canvas.js` above `PRIORITY`:

1. A playing segment always finishes, except when `signup:success` arrives. Map Unfold then replaces it at once and clears the queue: it replays the whole map, so nothing queued is lost.
2. Any other trigger during playback goes into a single queue slot. A newer trigger takes the slot if its priority is the same or higher (Map Unfold > C > B); a lower one is dropped. The count line and the spoken sentence still update for every tick; only the animation is coalesced.
3. If the trigger is for the segment already playing, B queues one replay and C is ignored (so hover jitter does nothing).
4. A plays first. A trigger that arrives before A has played queues itself, A plays, then the queued trigger plays. Map Unfold is the exception: it opens with A itself, so a signup that arrives first plays Map Unfold once, with no separate A before it.
5. While loading, off screen, or in a hidden tab, triggers wait in the same slot and play when the stage is back.
6. A ends on the blank map. If places are already stamped when A ends (a member's saved map, passed in with `setStamps`), B follows at once to drop them in, so the resting frame never shows fewer places than the reader has. With reduced motion, A's jump lands on B's end frame for the same reason.
7. A queued B is kept only while it has something to drop. The controller keeps the stamps added since the last B or Map Unfold began (`pendingDrops`). If every one of them is removed before B plays (a tick then an untick during C), the queued B is dropped, and the map keeps its resting frame.

**No race conditions.** Each run has its own id. When a segment's promise resolves late for a run that has since been replaced, it is ignored. Each load also has an id: a load that finishes after a timeout or a reload is destroyed, not shown. The adapters settle a pending segment as `interrupted` whenever a newer `playSegment`, `goToFrame` or `destroy` call arrives.

## Events API

```js
import { DashboardCanvas, FABLE_CONFIG, mountDashboardCanvas } from './dashboard-canvas.js';
const dash = mountDashboardCanvas('[data-dc]');           // or new DashboardCanvas(el, FABLE_CONFIG).start()

dash.trigger('view' | 'stamp:add' | 'stamp:remove' | 'cta:enter' | 'cta:leave' | 'signup:success' | 'pet:enter' | 'pet:leave', detail?);
dash.trigger('stamp:add', { code: 'CPH' });               // a hub code, or { id, label, x, y } or { id, label, lat, lon }
dash.setStamps(list);                                     // replace all stamps (the real site: the member's places)
dash.setSpeed(1); dash.reload(); dash.snapshot(); dash.destroy();

const off = dash.on('statechange', ({ from, to, reason }) => {});
// also: trigger, queue, segmentstart, segmentend, frame, loaded, error, announce, stamps, visibility, reduced, hub, paw, '*' (everything)
```

Every adapter implements the same player interface: `{ load(), playSegment(from, to, opts), goToFrame(n), pause(), resume(), setSpeed(s), currentFrame(), destroy(), on(event, fn) }`, plus optional `setData`, `layer` and `markers`.

**What the page says.** The canvas and the still map are `aria-hidden`. A visually hidden description lists the stamped places, the count and the hubs, and it is rewritten whenever the stamps change. A polite live region announces the results in plain words, for example "Stamp added. Three places on your map.", "Route drawn through your three places.", "Sample route drawn from Copenhagen to Sofia." (with fewer than two stamps), "Signed up. Your map is unfolding." then "Your map is ready. Three places on your map.", and "The animation did not load. The still map and this description stay in place." Numbers are counted from the stamps, never typed in.

**Hubs.** The hubs are CPH and SOF (the two live layover guides) plus FRA, IST, DOH, SIN, GRU and JFK, at their published airport coordinates. When the pointer comes within 22px of a hub (30px for touch), a tooltip shows the code, the city and the coordinates: JetBrains Mono, 12px, Ink on Paper, 4px by 6px padding. On a touch screen a tap shows it, and it stays after the finger lifts until the next tap elsewhere. Each hub is also a real button under the map, and focusing it shows the same tooltip; on a wide screen, where the button can be on screen while its hub is not, the page scrolls just enough to show both. Escape closes the tooltip.

## How it goes onto the real site

The chapter is a Webflow HTML embed with its own script, `h3-dash-js`. That script draws the real map: Nancy's map, labeled as hers, for visitors, and the member's own saved map (`tllStates`) when they are logged in. The animation **wraps** that map. It does not replace it.

- **The real map stays underneath, as the still layer.** In this prototype the still layer is the `[data-dc-static]` dot map. On the site it is the `.h3-map` box that `h3-dash-js` already paints. The animation stage sits on top. When the animation errors, times out, or meets reduced motion, the real map is what the reader sees.
- **The animation must never show stamps that contradict a member's real map.** Stamps only come from data. `h3-dash-js` would call `dash.setStamps(...)` with the same places it paints, worked out by the same count rule (human travelers only; Lived and Stayed make places; layovers sit beside the count). Visitors get the editor's places, under the label that already says the map is hers. If the Fable export bakes in stamp positions, that layer must be hidden or replaced by data-driven stamps; a baked-in stamp would show a place the member has not been. The stand-in shows how this works: it draws only the stamps it is given. The C route uses the SAMPLE CPH to SOF route only when there are fewer than two stamps, and draws it dashed.
- **After the last segment ends,** the stage can fade to the real map (250 ms) so the live map remains the source of truth. This needs Nancy's call, together with the motion decision below.
- **Signup.** On the site, `signup:success` comes from Memberstack. `h3-dash-js` already waits for `window.$memberstackDom`. The hook would be its auth-change callback after the signup form completes, calling `dash.trigger('signup:success')`. Check the exact callback name against the Memberstack version installed on the site before wiring it.
- **The pet guide.** The €9 guide sits in home chapter 04, and its Ko-fi link is still hidden there. The `pet:enter` and `pet:leave` listeners go on that element. If the paw stamp lives in the dashboard chapter, it only moves when that chapter is on screen at the same time.
- **The CTA note.** The live note under the CTA reads "Free, forever". House words say "Free to join.", and this page uses that.
- **Loading.** This prototype page makes no fetches: the controller, the adapters and the stand-in are inlined in `index.html`. How the controller and the export reach the real site is an owner decision. One option is a small loader in the embed that does `import()` of `dashboard-canvas.js` from a remote, commit-pinned URL when the chapter comes within 600px (the same IntersectionObserver margin `h3-dash-js` uses). Loading the controller or the export from a remote URL needs Nancy's approval first. The other option is to inline both in the embed, as this page does. Either way the site-layers 15-script cap stays as it is, because this is one embed script.

## Performance budget

The home page scored 39 for performance on mobile Lighthouse in the November 7, 2026 baseline (`docs/baseline-audit-2026-11-07.md`). So this layer must cost nothing until the chapter is near the screen.

- **Nothing runs before the chapter is near.** The player and the export load behind the 600px IntersectionObserver. In this page they are inline, so nothing is fetched. The stand-in needs no network at all. lottie-web from cdnjs is the one script load, and only when `type` is `'lottie'`.
- **The controller.** Bundled and minified with every adapter, it measured 31 KB raw and 11 KB gzipped (esbuild). Built to load only the adapter it needs, it would be smaller.
- **lottie-web is the big cost.** Gzipped sizes, measured from the npm tarball of 5.12.2:
  - `lottie_light.min.js` (svg renderer only): 46 KB
  - `lottie_light_canvas.min.js`: 54 KB
  - `lottie.min.js` (full, with expressions): 76 KB

  That comes on top of the export JSON itself, which for a 150-frame map can easily run 50 to 300 KB. Ask Fable for an optimized export (no hidden layers, rounded numbers, no embedded images) and gzip or brotli it.
- **Lighter options**, smallest first:
  - An SVG export animated by the Web Animations adapter here: no library, just the SVG.
  - A canvas export that exposes `seek(frame)`: it carries only the code it draws with.
  - lottie_light with the svg renderer: 46 KB plus the JSON.
  - dotLottie's WebAssembly player: heavier to start, worth it only for very complex art.
  - A short muted video with a poster frame, sought with `currentTime`: cheap to decode, but it cannot draw the member's own stamps.

  The stand-in itself is about 3 KB of drawing code plus a 2 KB land grid.
- **Off screen costs nothing.** The browser check scrolled the stage away in the middle of C and counted 0 `requestAnimationFrame` callbacks in 1.5 s. A hidden tab counted 0 callbacks in 1 s. Paused lottie-web counted 0 callbacks in 0.8 s.
- **Rendering.** The canvas backing store is capped at 2x device pixels, and the stage uses `contain: layout paint`. A resize redraws one frame and never starts a loop. The loading shimmer is CSS only, runs only while loading and on screen, and is off under reduced motion.

## Checked in a real browser

`check.cjs` runs Chromium (Playwright) against `file://index.html` at 1440 and 390, plus 390 with reduced motion. All checks passed. It covers:

- **The timeline:** A on scroll, B on tick, coalesced ticks, C on hover and on focus, C re-hover dropped, signup replacing B with A then C, every spoken line, the count line, zero rAF callbacks off screen and in a hidden tab with the frame frozen and resumed, the tooltip by pointer and by focus (font, colors, size, padding, Escape, inside the screen at 390), the paw stamp by pointer and by focus, error and timeout leaving the still map, reload, and reduced motion switched on mid-play (jumps to 150).
- **Reduced motion from the start:** the A, B and C trigger end frames, signup, no shimmer, the paw color change without rotation, and 0 rAF callbacks overall.
- **The other adapters.** The SVG/WAAPI adapter was tested on a test SVG: segment, pause, resume and seek. The canvas adapter was tested with a `seek` spy. lottie-web was tested with the real `lottie_light.min.js` 5.12.2 on a small test Lottie file that carries the brief's markers: segment, seek, markers read from the file, 0 rAF while paused, and the named layer found. The sandbox cannot reach cdnjs, so the check answers the cdnjs URL from the npm copy (`LOTTIE_FILE=...`).
- **Added in review (November 12, 2026):** a real touch tap on a hub at 390 (the tooltip stays, and a tap elsewhere closes it); a member's saved places stamped on the resting frame after A, with and without reduced motion; a signup before the map is seen playing Map Unfold once; and, at 1440, each hub button and its tooltip on screen together when reached with Tab. The state inspector starts closed, so it covers nothing a keyboard user lands on.
- **Added on November 12, 2026:** a tick then an untick during C drops the queued Stamp Drop, so no empty B plays and the map rests on the route's end frame.
- **The page itself:** no console errors, no sideways scroll, the stage on the 16px gutter at 390, and nothing visible under 12px. The only hosts requested were Google Fonts (cdnjs only during the Lottie adapter test).

Run it with `NODE_PATH=/opt/node22/lib/node_modules PATH=/opt/node22/bin:$PATH LOTTIE_FILE=/path/to/lottie_light.min.js node check.cjs`.

## Real vs SAMPLE

**Real:**
- The chapter's eyebrow, headline, subhead, CTA label and steps, copied from the live embed.
- The pet guide's name, price and line, from the guide conversion flow notes.
- The hub codes and airport coordinates.
- The map data and projection (the same as the live map).
- lottie-web 5.12.2 and its SRI hashes. The hashes were computed from the npm tarball, which is what cdnjs serves. Compare them with cdnjs's listed SRI before going live; the sandbox could not reach cdnjs.

**SAMPLE or stand-in:**
- The five trips in the checklist.
- The stamps they make.
- The CPH to SOF route shown with fewer than two stamps.
- The whole stand-in animation.
- The signup, which is a mock.
- The pet guide button, which goes nowhere here.

## Nancy needs to decide

1. **The new kind of motion (flagged).** The brand kit's motion rule (250 ms, never over 300 ms, from 0.6 opacity) was written for scroll reveals. The segments here run 1.5 s (A), 1.5 s (B) and 2 s (C), and Map Unfold runs about 3.5 s. That is a new kind of motion the kit does not cover, and it needs your approval. Things that already follow the kit: the stage fades in from 0.6 opacity over 250 ms, the paw stamp turns in 250 ms, and reduced motion removes all of it. Options:
   - approve the timeline as a named exception ("map timeline, up to 2 s, once per trigger");
   - ask Fable for shorter segments;
   - keep only the end frames for everyone.
2. **Where the paw stamp lives.** The €9 guide is in chapter 04, and the dashboard map is chapter 02. Choose one:
   - put the stamp on the guide card itself, so it can be seen while hovered;
   - put a link to the guide in chapter 02.
3. **Stamps on the real map.** The export's stamps must be drawn from data, not baked into the art. Confirm that with whoever makes the Fable file before it is exported.
4. **Stamp color.** The stand-in uses Sunset Rose for stamps, because the live map uses it for places been and teal for layovers. The kit reserves Sunset Rose for headline-size type. Confirm whether that reservation covers map graphics.
5. **The "Free, forever" note** under the CTA on www. This page uses "Free to join.", per house words.
