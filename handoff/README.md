> **HANDOFF VERSION: v9 · 5 October 2026 · 2.0 editorial look + accessibility + mobile.** Start with CLAUDE-CODE-PROMPT.md, then keep STATUS.md updated as you go.

# TLL handoff for Claude Code · v9 · 5 October 2026

**Paste `CLAUDE-CODE-PROMPT.md` into Claude Code first.** The completion protocol from v8 still applies: every item has an ID, every ID gets a STATUS row with evidence.

The HTML files here are **design references**, not production code. Rebuild them in Webflow (site `69d6145cf421c777840c1e25`) with existing classes where they exist. Fidelity is **high**: colors, type, spacing and copy are final.

| File | What it is |
|---|---|
| CLAUDE-CODE-PROMPT.md | Instructions, protocol, parity table, build order (v9 section on top) |
| **REQUIREMENTS.md** | **146 numbered items (A01 to J16). The contract.** New group J is v9 |
| **STATUS.md** | The ledger, one row per ID, with evidence |
| **DESIGN-SPEC-v9.md** | **New: one-object-per-job map, tokens, type scale, Departures header, luggage tag, focus ring, mobile nav, motion** |
| DESIGN-SPEC.md | v8 spec (group pages §3b, directory §3c). v9 addendum wins on conflict |
| IMPLEMENTATION-BRIEF.md | Preservation rules, Memberstack mapping |
| SHAREABLES-SPEC.md | Cards, counting, share flow, privacy, The Pack |
| **COUNCIL-REVIEW.md** | **New: five-advisor review. Freeze approved by Nancy** |
| CHANGES.md | v9, then v8 and earlier |
| **TLL Site Prototype 2.0 (standalone).html** | **New source of truth.** Every screen, SCREENS menu bottom left |
| TLL Shareables (standalone).html | Shareables board |
| **screens-v9/** | **New: 16 screenshots of the 2.0 build** |
| screens-v8-reference/ | v8 per-screen markup, for copy and structure only. 2.0 wins on looks |
| shareables/ | One file per board section |
| verify-live.mjs | Route + copy checker, audits STATUS.md |
| TLL Map.html, circle-flags/, TLL-BrandKit-v2.1.html | Map reference, 406 round flags (MIT), brand kit |

The standalone files need a connection for photos (Webflow CDN) and map data (jsDelivr).

**Nancy:** ask Claude Code for STATUS.md at the end of every session. If a row says Done without a link, it isn't done.
