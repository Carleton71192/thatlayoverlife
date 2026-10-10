# Shared pets and travel companions (B44, B46): design and consent rules

Draft for Nancy, 10 Oct 2026. Nothing below is built. Memberstack is read only in this note (upgrade, never compromise).

## The problem today

- Every member's map lives in their own member JSON (`tllStates`: travelers plus countries). Only the map writes it.
- You and Jay both travel with Magnus Waffles 🐻‍❄️. If Jay adds Magnus on his map, Magnus exists twice, with two country lists that drift apart.
- Magnus's public Paw Passport (/pets/magnus-waffles) reads a third list, the CMS field `countries-list` (13 countries today).

## What Memberstack offers (checked 10 Oct)

- **Data tables.** There are three today: Trip Ledger, Story Comments and Saved Stories. Each has create, read, update and delete rules: public, signed-in, own records only, or admin only.
- **"Own records only".** This covers one member per record, so a table cannot natively say "these two members may edit this row".

## Options

| | How it works | Good | Watch out |
|---|---|---|---|
| **A. Pet is the source of truth (recommended)** | A new data table, Shared Pets, has one row per pet: name, CMS slug, countries and two owner fields. Each owner's map shows the pet's countries from that row, not from their own JSON. Editing the pet on either map updates the row. | One Magnus, one list, on both maps and on the Paw Passport. | Signed-in read is needed so the second owner can see the row. Rows hold only pet data, never people's countries. Writes by a second owner may need admin rules plus a small Worker, the same Worker that instant publishing needs. |
| B. Copy on invite | Jay accepts an invite and gets a copy of Magnus on his map, with a "last synced" stamp. | No new table. | Two lists again after the first trip. Not recommended. |
| C. CMS only | The Pets collection gets a co-owners field. Maps read the pet's countries from the public pet page. | Already public and already the Paw Passport source. | Members cannot write to the CMS from the browser, so edits need the Worker or the editor. |

## Consent rules (apply to pets and people)

1. **Invite, then accept.** Nothing is shared until the other member accepts. Either side can leave at any time, and leaving keeps your own countries and removes only the shared record from your map.
2. **What a linked person sees.**
   - Pets: the pet's countries.
   - People: only what each person ticks, trip by trip or country by country. A partner link never shows a person's whole map by default.
3. **Who can edit.** Both owners can edit a shared pet. A linked person can never edit another person's countries.
4. **Public pages.** A shared pet's Paw Passport shows both owners only if both say yes.
5. **Counting rule unchanged.** Your total is Lived plus Stayed for your own travelers. A shared pet counts on its own Paw Passport, never toward a person's total. Layovers stay apart, and the denominator stays 249.
6. **Kids and minors.** No accounts for minors. A child can only appear as a named traveler on a parent's own map, never as a linked account.

## Decisions for Nancy

1. Option A, B or C for Magnus. A is recommended.
2. Signed-in read on the Shared Pets table. This exposes pet rows, never people's maps, to signed-in members.
3. Whether the Worker gets deployed. Options A and C, plus instant publishing, all want it. It needs your Cloudflare login and three keys.
4. For B46, which people links come first: partner only, or partner plus a small "people I travel with" list.

## Build order once decided

1. Shared Pets table: Magnus first, seeded from the CMS list.
2. Map reads the shared pet.
3. Invite and accept flow on /my-pets.
4. Paw Passport shows co-owners only with both yeses.
5. People links (B46) on the same pattern.
