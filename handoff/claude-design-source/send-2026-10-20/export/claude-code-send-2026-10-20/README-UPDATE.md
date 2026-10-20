# CLAUDE CODE · UPDATE PACKET · 20 October 2026 · Prototype 3.4

Supersedes the 19 October packet. Read in this order: this file, STANDING-RULINGS.md, COUNT-RULES.md, HOME-3.3-HANDOFF.md (still current for anything not changed below), then the standalone prototype. Write a change log for Nancy before editing Webflow. Publish nothing until she approves. Publish both custom domains and the subdomain every time (site 69d6145cf421c777840c1e25).

## Files
- `TLL Site Prototype 3.4 (standalone).html`: the whole site, one file, offline. Navigate with the nav or the SCREENS toggle (bottom right). Query strings: `?screen=travelers|expats|profile|editprofile|pawpassport|map|stories|about|submit4|country|404`, `?loggedin=1`, `?note=open`, `?menu=open`. On Profile, the PROTOTYPE · VIEW AS chips switch Nancy (full), Jay (thin), Barzy and Chesney (no photo).
- `HOME-3.3-HANDOFF.md`: home chapters, nav, footer, widget, Submit v4, AI service spec. Copy on Home is now shorter (see 3).
- `COUNT-RULES.md`: every number on the site. The share cards in 6 obey it.
- `STANDING-RULINGS.md`: add the UAE ruling from 1 before you use it.
- `SKILL-tll-morning-review.md`: post-publish review (hold is the default).

## 1 · Rulings since the last packet
1. **Nancy has lived in the UAE.** Profile flags: US · BR · VN · AE · DK. Jay's flags stay US · BR · VN · DK.
2. **Travelers = the live page's sections + the prototype's cards.** Full-bleed photos, brighter labels, the live page's section breakdown.
3. **Copy is shorter everywhere.** One line under each Home chapter heading; Stories, Expats and About trimmed to match. Use the prototype's text, not the 3.3 handoff's, wherever they differ.
4. **Expert flags.** Location experts show home base + lived-in countries as circle flags on every card and on their profile.
5. **Amber stays in the kit** (`#D98A2B`, decorative only). Amber *text* on Paper is `#7A4D10`; the old `#b8791f` fails AA.
6. **Buttons on Rose are Ink text** (25 legacy white-on-Rose buttons fixed in the prototype). White text only on `#D63859`.

## 2 · Screens new or changed in 3.4 (build these)
**Travelers v3** (`/travelers`). Sticky section bar: Everyone · Location experts · Press · Creators · Pets. Cards are photo-first (4:5, full bleed, label chip top left, flags bottom). Experts carry the expertise flags (1.4). Open slots are cards with one arrow, the whole card is the link. Order is shuffled per visit, never ranked or paid.

**Expats v2** (`/for-expats`). Search by country → jumps to that section or the open desk. One expert per city ("desk"); open desks invite a claim. "Formerly of" lists people who left: where they know, never where they are. Groups (meetups, clubs) are reviewed within 48 hours. Country page opens with a strip: the resident expert ("Ask Nancy" → profile) or "Desk open" + claim, plus "All expats →".

**Apply / claim flow.** "Apply · Location Expert", "Apply · Press", "List yourself" (creators) and "Claim this desk":
- logged out → sign-up, intent remembered ("Claim your desk." / "Apply as press." / "List yourself."), then Edit profile → 07 The directories with the switch on;
- logged in → straight to that block.
The switch shows "APPLIED · a human checks… within 48 hours" until approved, then "LISTED". Store as Memberstack custom fields `dir-expat`, `dir-press`, `dir-creator` = `off | applied | listed`.

**Edit profile.** "Change your photo" works: pick from existing portraits or upload. Opt-ins live in 07 The directories (above).

**404.** Unknown routes render the 404 ("This page missed its connection.") with three buttons: Back to the gate · Read the stories · Open the map. Copy still for Nancy to confirm.

## 3 · Share cards (new, Packet C)
A "Share my stats" button on the public profile (beside contact), "Share {pet}'s card" on the public Paw Passport (under the hero stats), and a stats strip with "Share my map" above /the-map. All open one modal.
- **Card:** photo, name, circle flags, three stats, wordmark + page URL. Formats: Story 9:16 and Post 1:1.
- **Actions:** Download image (1080 × 1920 or 1080 × 1080 PNG), Share to… (`navigator.share`, falls back to copy), Copy link.
- **Data:** profile and map cards read the same tllStates source as the profile hero. The **map card belongs to the map owner** (logged out: Nancy's example map; logged in: the member), never to another profile in view. Pet card reads the pet's own count. Stats are never typed.
- **Build:** server-render the PNG (Cloudflare Worker + Satori/resvg, or Cloudinary text overlays) at `/share/{type}/{slug}.png?fmt=story|post`, cached until the map's "Last saved" changes. Use the same URL as the page's `og:image` so links preview the card.
- **Map card background:** Antarctica photo is a stand-in. Preferred: a rendered image of the member's filled map. Nancy to confirm.

## 4 · Design system pass (apply in the shared CSS, Packet A)
- **Motion:** buttons, chips, links, inputs: `transition: background-color, border-color, color 160ms ease-out`. Card photos `transform: scale(1.03)` on hover, 600ms `cubic-bezier(.2,.7,.2,1)`. Sticky section pills ease 200ms. All off under `prefers-reduced-motion`. No lift, no shadows on hover.
- **Rhythm:** page pad top `clamp(56px, 9vh, 112px)`, bottom `clamp(72px, 12vh, 144px)`, sides `max(20px, 6vw)`; inner gaps 20 / 40 / 80. No raw `vh` paddings. Submit's column aligns to the nav wordmark (left-aligned 720 measure, not centered).
- **Corners square** everywhere (dots, avatars and flags stay round). Dashed borders `#6B6660`, never amber.
- **Tell the editor:** below 960px collapses to a 44px dot with `aria-label="Tell the editor"`.
- **Retire** the passport fireworks; replace with a 240ms stamp scale (1.2 → 1). The Travelers verb cycle stops after three loops and pauses when the tab is hidden.
- **Floors unchanged:** 12px text, 44px targets.

## 5 · Video loops (when Nancy sends clips)
One muted loop per page, 8 to 12 s, under 2.5 MB, H.264 + WebM, poster = the current still, paused off-screen and under reduced-motion or Save-Data. Never carries text. Slots in priority order: Home hero, Stories hero (wired: `LIB_VIDEO.hero`), Paw Passport hero, Expats hero, country page band, sign-in, 404. Nancy's own footage first; stock (Pexels, Coverr, Mixkit) only for the 404 and sign-in.

## 6 · Story images
The prototype pulls 12 hero images (8 CMS, 4 local). The live site already has them in the CMS; bind story cards to the CMS `hero-image` field so no card ever renders the "hero photo is in the CMS" placeholder. Any story without a hero: hide it from rails, show in /stories with the place-name tile.

## Build order (one change log per packet, Nancy approves each)
- **A · global (small):** nav, footer, Tell the editor (with the 960px dot), motion + rhythm + square corners in shared CSS, Ink-on-Rose buttons, `#7A4D10` amber text, 404 route, JSON-LD fix, byline/country/pursuit links, sitemap cleanup, 301s (/destinations, /for-affiliates, /pets).
- **B · home (medium):** seven chapters with 3.4 copy.
- **C · people (medium):** Travelers v3, Profile v2 (UAE flag), Edit profile (photo + directories), apply/claim flow, share cards + PNG worker.
- **D · expats (medium):** Expats v2, country page strip, groups form.
- **E · Submit v4 (large):** per HOME-3.3-HANDOFF.
- **F · review (small):** `tll-morning-review`, 07:30 Copenhagen, hold rights on by default.

## Test report per packet
- 1440 and 390 screenshots of every changed page beside the matching prototype screen.
- Keyboard: tab through the nav, Travelers bar, share modal (focus trapped, Esc closes, focus returns to the button).
- Counts: profile hero, share card, /account and footer trace to one tllStates source; the map card shows the map owner's numbers.
- Contrast check on every Rose button and amber text instance.
- Reduced-motion on: no transitions, no zoom, no loops.

## Open for Nancy (do not guess)
- Ko-fi URL; guide button before the guide or after.
- Future-dated marathon diaries public or not.
- 404 copy.
- Map share card background: map render or photo.
- Video clips for Home, Paw and Expats.
- Price of the Layover Club tier.
