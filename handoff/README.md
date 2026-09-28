> **HANDOFF VERSION: v8 · 28 September 2026 · shareables + completion protocol.** Start with CLAUDE-CODE-PROMPT.md, then keep STATUS.md updated as you go.

# TLL handoff for Claude Code · v8 · 28 September 2026

**Paste `CLAUDE-CODE-PROMPT.md` into Claude Code first.** Its top section is the completion protocol: every item has an ID, every ID gets a STATUS row with evidence, and a checker script catches what slips.

| File | What it is |
|---|---|
| CLAUDE-CODE-PROMPT.md | Full instructions, protocol, parity table, build order |
| **REQUIREMENTS.md** | **127 numbered items (A01 to I14). The contract.** |
| **STATUS.md** | **The ledger Claude Code fills in, one row per ID, with evidence** |
| **verify-live.mjs** | `node verify-live.mjs`: checks every live route + audits STATUS.md. Writes verify-report.md |
| DESIGN-SPEC.md | Tokens, type, components, copy rules, group pages (§3b), directory (§3c) |
| IMPLEMENTATION-BRIEF.md | Preservation rules, Memberstack mapping, contracts |
| **SHAREABLES-SPEC.md** | New: cards, counting rules, share flow, privacy, The Pack |
| CHANGES.md | What's new in v8, v7 and v6 |
| TLL Site Prototype (standalone).html | Every site screen, clickable (SCREENS menu bottom left) |
| **TLL Shareables (standalone).html** | New: the shareables board (pan/zoom; 06, 07, 08 are live) |
| screens/ | 00 to 40, one file per site screen + prototype-logic.js. Footer at the end of 40 |
| **shareables/** | New: one file per board section + shareables-logic.js |
| TLL Map.html | Map reference. The live engine on /the-map stays |
| circle-flags/ | 406 round SVG flags (MIT) |

Both standalone files need a connection for photos (Webflow CDN) and the map data (jsDelivr).

Webflow site `69d6145cf421c777840c1e25`. Never edit the TLL Nav v1 Memberstack blocks.

**Nancy:** ask Claude Code for STATUS.md at the end of every session. If a row says Done without a link, it isn't done.
