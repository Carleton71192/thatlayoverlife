#!/usr/bin/env python3
"""Build the CMS part of the Webflow export bundle.

Reads saved Webflow MCP tool results (data_cms_tool) and writes, per collection:
  reports/evidence/webflow-export-2026-10-13/state/cms/<collectionId>.json
  handoff/claude-design-source/webflow-export-2026-10-13/cms/<slug>.json
plus handoff/claude-design-source/webflow-export-2026-10-13/cms/README.md
and a summary JSON (printed to stdout) for the orchestrator.

Usage:
  python3 -I scripts/export/cms-build.py --repo /path/to/repo \
      --summary /path/to/summary.json result-file [result-file ...]

Each result file is either a JSON array of {type, text} blocks whose text is a
JSON object, or plain text whose JSON object starts at the first "{" (one or
more objects back to back). Every object looks like
{"label": ..., "action": ..., "result": {...}} or carries an "error".
"""
import argparse
import json
import os
import re
import sys
from datetime import date

COLLECTIONS = [
    ("6a0b29c6d081332e921900ff", "Pillars", "pillars"),
    ("6a0b29c702602326705dcfb1", "Destinations", "destinations"),
    ("6a0b29c7a7b1840afe9390a5", "Contributors", "contributors"),
    ("6a0b29cdafd5d6fd115e3d24", "Layovers", "layovers"),
    ("6a0b29e90328ffc0e30375ac", "Marathons", "marathon-diaries"),
    ("6a0b29eb1d3d56780b257014", "Magnus Diary", "paw-passport"),
    ("6a0b29eddc14f1444e935760", "Stories", "stories"),
    ("6a0b29ee116b2fe274ef96c6", "Press Mentions", "press-mentions"),
    ("6a0b29ee116b2fe274ef9714", "Partners", "partners"),
    ("6a0be81801ee7eff1010907a", "Collections", "collections"),
    ("6a0be8194ccc05a63fbdcfa3", "Pets", "pets"),
    ("6a0c7e883607a3b091e1ae20", "Themes", "themes"),
    ("6a0cbca9d776c205f45f530d", "Visits", "visits"),
    ("6a0cbdad8dfcb5ee54bdf739", "Bookmarks", "bookmarks"),
    ("6a0cbdad98d2bd496b67c132", "Comments", "comments"),
    ("6a0e97318d3078942dca2fbe", "States", "states"),
    ("6a0e97318d3078942dca2fed", "National Parks", "national-parks"),
    ("6a0e99580823cd9907aea28d", "Subdivisions", "subdivisions"),
    ("6a8afbd98e907b41c4da109b", "Countries", "countries"),
    ("6ab3c56941a6e822128ef4c2", "Submissions", "submissions"),
    ("6aba75215f29fa631c175c45", "Award Nominations", "award-nominations"),
    ("6abcd637bff19cda8e2426c5", "Resources", "resources"),
    ("6abcd6371aa0f0654773a56e", "Expat Groups", "expat-groups"),
    ("6abcd6371aa0f0654773a59e", "Interest Tags", "interest-tags"),
    ("6abcd638b10dc7b4930f6410", "Directory", "directory"),
    ("6abcd638b10dc7b4930f6440", "Press Trips", "press-trips"),
    ("6aca11b63ee2c34cc7eb3306", "Pet Notes", "pet-notes"),
    ("6aca11b69e57978135e4c248", "Trip Bundles", "trip-bundles"),
    ("6accbabf97231f9b5b985c55", "Photo placements", "photo-placements"),
]

# Collections that may hold personal data: keep one item, blank sensitive fields.
PERSONAL = {"submissions", "comments", "bookmarks", "visits", "directory"}
# Field slug or display name tokens that get blanked. "ip" is matched as a
# whole token so that "description" or "zip" style names are not caught.
SENSITIVE_SUBSTRINGS = ("email", "phone", "whatsapp", "address", "password", "token")
SENSITIVE_TOKENS = {"ip"}
# Extra private identifiers blanked everywhere (never rendered on the site).
EXTRA_PRIVATE_SLUGS = {"member-id", "memberstack-id", "microchip-number", "eu-pet-passport-number"}
WITHHELD = "[withheld]"
MAX_ITEMS = 3

STORIES_ID = "6a0b29eddc14f1444e935760"


def load_objects(path):
    """Yield the JSON objects stored in one saved tool result file."""
    raw = open(path, encoding="utf-8").read()
    stripped = raw.lstrip()
    if stripped.startswith("["):
        try:
            blocks = json.loads(stripped)
        except json.JSONDecodeError:
            blocks = None
        if isinstance(blocks, list):
            for block in blocks:
                text = block.get("text", "") if isinstance(block, dict) else ""
                for obj in decode_stream(text):
                    yield obj
            return
    for obj in decode_stream(raw):
        yield obj


def decode_stream(text):
    """Decode one or more JSON objects back to back from text."""
    dec = json.JSONDecoder()
    i = text.find("{")
    while i != -1 and i < len(text):
        try:
            obj, end = dec.raw_decode(text, i)
        except json.JSONDecodeError:
            break
        yield obj
        i = text.find("{", end)


def is_sensitive(slug, display_name):
    for label in (slug or "", display_name or ""):
        low = label.lower()
        if any(s in low for s in SENSITIVE_SUBSTRINGS):
            return True
        tokens = set(re.split(r"[^a-z0-9]+", low))
        if tokens & SENSITIVE_TOKENS:
            return True
    if (slug or "") in EXTRA_PRIVATE_SLUGS:
        return True
    return False


def has_hero_image(field_data):
    for key, value in field_data.items():
        if "hero" in key.lower() and isinstance(value, dict) and value.get("url"):
            return True
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--summary", required=True)
    ap.add_argument("files", nargs="+")
    args = ap.parse_args()

    evidence_dir = os.path.join(args.repo, "reports", "evidence", "webflow-export-2026-10-13", "state", "cms")
    bundle_dir = os.path.join(args.repo, "handoff", "claude-design-source", "webflow-export-2026-10-13", "cms")
    os.makedirs(evidence_dir, exist_ok=True)
    os.makedirs(bundle_dir, exist_ok=True)

    schemas = {}   # collection id -> get_collection_details result
    items = {}     # collection id -> list_collection_items result
    tool_errors = {}  # collection id -> [messages]

    for path in args.files:
        for obj in load_objects(path):
            if not isinstance(obj, dict):
                continue
            action = obj.get("action")
            result = obj.get("result")
            label = obj.get("label", "")
            if obj.get("error") or (isinstance(result, dict) and result.get("error")):
                msg = obj.get("error") or result.get("error")
                tool_errors.setdefault(label, []).append(str(msg))
                continue
            if not isinstance(result, dict):
                continue
            if action == "get_collection_details" and result.get("id"):
                schemas[result["id"]] = result
            elif action == "list_collection_items" and "items" in result:
                # Item rows do not carry the collection id, so map by label prefix.
                prefix = label.rsplit("-items", 1)[0] if label.endswith("-items") else None
                if prefix:
                    items[prefix] = result

    label_to_id = {}
    for cid, _name, slug in COLLECTIONS:
        label_to_id[slug] = cid
    # Labels used in the tool calls differ from slugs for two collections.
    label_to_id["marathons"] = "6a0b29e90328ffc0e30375ac"
    label_to_id["paw-passport"] = "6a0b29eb1d3d56780b257014"

    summary = {"ok": True, "collections": []}
    rows = []
    notes = []

    for cid, display_name, slug in COLLECTIONS:
        errors = []
        schema = schemas.get(cid)
        label = slug if slug in items else {
            "marathon-diaries": "marathons",
        }.get(slug, slug)
        item_result = items.get(label)
        if schema is None:
            errors.append("get_collection_details result missing")
        if item_result is None:
            errors.append("list_collection_items result missing")
        for lab, msgs in tool_errors.items():
            if lab.startswith(label + "-") or lab.startswith(slug + "-"):
                errors.extend(msgs)

        fields = []
        if schema:
            for f in schema.get("fields", []):
                fields.append({
                    "id": f.get("id"),
                    "slug": f.get("slug"),
                    "displayName": f.get("displayName"),
                    "type": f.get("type"),
                    "isRequired": bool(f.get("isRequired", False)),
                })
        sensitive_slugs = {f["slug"] for f in fields if is_sensitive(f["slug"], f["displayName"])}

        kept = []
        total_live = None
        if item_result:
            total_live = (item_result.get("pagination") or {}).get("total")
            raw_items = [it for it in item_result.get("items", [])
                         if not it.get("isDraft") and not it.get("isArchived")]
            if cid == STORIES_ID:
                with_hero = [it for it in raw_items if has_hero_image(it.get("fieldData", {}))]
                without = [it for it in raw_items if it not in with_hero]
                raw_items = with_hero + without
            limit = 1 if slug in PERSONAL else MAX_ITEMS
            for it in raw_items[:limit]:
                fd = dict(it.get("fieldData", {}))
                blanked = []
                for key in list(fd.keys()):
                    if key in sensitive_slugs and fd[key] not in (None, "", [], {}):
                        fd[key] = WITHHELD
                        blanked.append(key)
                if blanked:
                    notes.append(f"{slug}: blanked {', '.join(blanked)} on item {it.get('id')}")
                kept.append({
                    "id": it.get("id"),
                    "slug": fd.get("slug"),
                    "lastPublished": it.get("lastPublished"),
                    "fieldData": fd,
                })

        doc = {
            "id": cid,
            "displayName": (schema or {}).get("displayName", display_name),
            "slug": (schema or {}).get("slug", slug),
            "singularName": (schema or {}).get("singularName"),
            "schema": {"fields": fields},
            "items": kept,
        }
        text = json.dumps(doc, ensure_ascii=False, indent=2) + "\n"
        with open(os.path.join(evidence_dir, cid + ".json"), "w", encoding="utf-8") as fh:
            fh.write(text)
        with open(os.path.join(bundle_dir, slug + ".json"), "w", encoding="utf-8") as fh:
            fh.write(text)

        if errors:
            summary["ok"] = False
        summary["collections"].append({
            "id": cid,
            "slug": slug,
            "fields": len(fields),
            "itemsFetched": len(kept),
            "errors": errors,
        })
        raw_count = len(item_result.get("items", [])) if item_result else 0
        rows.append((doc["displayName"], slug, len(kept), total_live, len(fields), raw_count))

    write_readme(bundle_dir, rows, notes)
    with open(args.summary, "w", encoding="utf-8") as fh:
        json.dump(summary, fh, indent=2)
    print(json.dumps(summary))


def write_readme(bundle_dir, rows, notes):
    today = date.today().isoformat()
    lines = []
    lines.append("# CMS schemas and sample items")
    lines.append("")
    lines.append(f"Captured {today} from the That Layover Life Webflow site (read-only API calls). "
                 "One JSON file per collection, named by collection slug. Each file holds the "
                 "collection id, display name, singular name, the field list (id, slug, display name, "
                 "type, required) and up to three sample items with their field data.")
    lines.append("")
    lines.append("Counts on the live site may differ. The \"on site\" column is the total the API "
                 "reported at capture time; the bundle keeps at most three items per collection "
                 "and only items that are published (not draft, not archived).")
    lines.append("")
    lines.append("| Collection | Slug | Items in bundle | Items on site | Fields |")
    lines.append("|---|---|---:|---:|---:|")
    empty = [name for name, _slug, _kept, total, _nf, _raw in rows if total == 0]
    all_draft = [name for name, _slug, kept, total, _nf, raw in rows if total and raw and kept == 0]
    for name, slug, kept, total, nfields, _raw in rows:
        total_text = "" if total is None else str(total)
        lines.append(f"| {name} | `{slug}.json` | {kept} | {total_text} | {nfields} |")
    lines.append("")
    lines.append("## How the samples were chosen")
    lines.append("")
    lines.append("- Each collection was asked for its three most recently published items. Draft and archived items were dropped, so some collections show fewer than three.")
    lines.append("- Stories: the ten most recently published stories were fetched, and the three most recent that carry a hero image were kept.")
    lines.append("- Submissions, Comments, Bookmarks, Visits and Directory may hold personal data. Only the first item is kept, and any field whose slug or name contains email, phone, whatsapp, address, ip, password or token is written as `[withheld]`.")
    lines.append("- The same withholding rule was applied to every collection, plus four private identifiers that the site never renders: `member-id`, `memberstack-id`, `microchip-number` and `eu-pet-passport-number`.")
    lines.append("- Option fields hold the option id, not the label. Reference fields hold the referenced item id. Look up labels in the collection's schema fields in the Webflow Designer.")
    if notes:
        lines.append("")
        lines.append("Fields blanked in this capture:")
        lines.append("")
        for n in notes:
            lines.append(f"- {n}")
    lines.append("")
    lines.append("## Tasks still to be completed")
    lines.append("")
    lines.append("Open items on the site task list at export time, for whoever picks this bundle up:")
    lines.append("")
    for t in OPEN_TASKS:
        lines.append(f"- {t}")
    lines.append("")
    lines.append("CMS specific follow-ups:")
    lines.append("")
    if empty:
        lines.append(f"- {len(empty)} collections had no items at capture time ({', '.join(empty)}). "
                     "Their JSON files carry the schema only. Sample content for the design will need to be written or pulled later.")
    if all_draft:
        lines.append(f"- {', '.join(all_draft)}: every item returned was still a draft, so no samples were kept. "
                     "Publish or confirm these before the design relies on them.")
    for t in CMS_FOLLOWUPS:
        lines.append(f"- {t}")
    lines.append("")
    with open(os.path.join(bundle_dir, "README.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))


OPEN_TASKS = [
    "Own success and error messages on every form (in progress).",
    "Edit-profile, share-story and my-pets pages: prototype design.",
    "Live contributor and country counts.",
    "Story form feeds the author's map and trip history.",
    "Second-pass batch: expats finder, collections, link stack, travelers.",
    "Audit: safe fixes drafted, awaiting publish approval.",
    "Handoff job one: parity audit (home, stories, story, travelers, countries first) (in progress).",
    "Handoff job two: traveler directory (expats, creators, press).",
    "Growth build stage 1: design artboards (home, /submit, story end, /expats Denmark, badges).",
]

CMS_FOLLOWUPS = [
    "Collections that kept fewer than three items had draft items among the three most recent. Fetch more if the design needs three samples.",
    "Option and reference ids in the samples are not resolved to labels. Resolve them if the design needs the readable values.",
]


if __name__ == "__main__":
    main()
