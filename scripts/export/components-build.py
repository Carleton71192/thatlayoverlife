#!/usr/bin/env python3
# components-build.py
# Assembles reports/evidence/webflow-export-2026-10-13/state/components/<id>.json and index.json
# from the raw Webflow MCP captures (component trees, resolved and raw settings, get_component
# metadata). Read-only against Webflow: the captures were taken with get_all_elements,
# get_settings and get_component only. Run from the scratchpad folder that holds meta.json,
# settings.json and trees/. Kept here for provenance of the 13 October 2026 export.

import json, os, sys, copy

SCRATCH = os.path.dirname(os.path.abspath(__file__))
OUT = '/home/user/thatlayoverlife/reports/evidence/webflow-export-2026-10-13/state/components'
EXISTING_TREE_REUSE = {
    '8484ce87-193e-8ab5-fff8-590bb198f8a8',
    '710ff458-c06e-d602-a663-e5e88ca1456b',
}
SETTINGS_TYPES = {'HtmlEmbed','Image','FormButton','FormSelect','FormTextInput','FormTextarea',
                  'FormCheckboxInput','FormRadioInput','Video','RichText','LinkBlock'}

meta = json.load(open(os.path.join(SCRATCH, 'meta.json')))
settings_all = json.load(open(os.path.join(SCRATCH, 'settings.json')))

def walk(node, acc):
    acc.append(node)
    for c in node.get('children', []):
        walk(c, acc)

report = []
index = []
for m in meta:
    cid = m['id']
    errors = []
    out_path = os.path.join(OUT, f'{cid}.json')
    existing = None
    if os.path.exists(out_path):
        existing = json.load(open(out_path))
    if cid in EXISTING_TREE_REUSE:
        if not existing:
            errors.append('expected converter file to reuse tree from, not found')
            continue
        tree = existing['tree']
    else:
        tree = json.load(open(os.path.join(SCRATCH, 'trees', f'{cid}.json')))
    root = tree['data'] if isinstance(tree, dict) and 'data' in tree else tree
    nodes = []
    walk(root, nodes)
    types = {}
    for n in nodes:
        types[n['type']] = types.get(n['type'], 0) + 1
    embeds = types.get('HtmlEmbed', 0)
    images = types.get('Image', 0)

    cap = settings_all.get(cid, {})
    settings = dict(cap.get('resolved', {}))
    if cap.get('rawSameAsResolved'):
        raw = {}
        for k, v in settings.items():
            r = copy.deepcopy(v)
            r['type'] = 'all_raw_settings'
            raw[k] = r
    else:
        raw = dict(cap.get('raw', {}))

    # which nodes should have had a settings fetch
    wanted = []
    for n in nodes:
        t = n['type']
        if t in SETTINGS_TYPES:
            wanted.append(n['id']['element'])
        elif t == 'Link':
            link = (n.get('settings') or {}).get('link') or {}
            if not link.get('href'):
                wanted.append(n['id']['element'])
    missing = [e for e in wanted if e not in settings or e not in raw]
    if missing:
        errors.append('settings not captured for: ' + ', '.join(missing))

    # merge with existing converter file
    if existing:
        for k, v in (existing.get('settings') or {}).items():
            settings.setdefault(k, v)
        for k, v in (existing.get('rawSettings') or {}).items():
            raw.setdefault(k, v)

    doc = {
        'id': cid,
        'name': m['name'],
        'group': m.get('group'),
        'description': m.get('description'),
        'instanceCount': m.get('instanceCount'),
        'capturedAt': '2026-10-13',
        'source': 'Webflow MCP data_element_tool get_all_elements depth -1 scope_component_id; data_element_settings_tool get_settings all_resolved_settings and all_raw_settings; data_component_tool get_component includeProps includeInstanceCount',
        'nodeCount': len(nodes),
        'nodeTypes': dict(sorted(types.items())),
        'tree': tree,
        'settings': settings,
        'rawSettings': raw,
        'props': m.get('props', []),
    }
    if existing and len(doc) < len(existing):
        errors.append('existing file has more top-level keys; not overwritten')
        continue
    with open(out_path, 'w') as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
    index.append({
        'id': cid,
        'name': m['name'],
        'group': m.get('group'),
        'description': m.get('description'),
        'instanceCount': m.get('instanceCount'),
        'nodeCount': len(nodes),
        'embeds': embeds,
        'images': images,
    })
    report.append({'id': cid, 'name': m['name'], 'nodeCount': len(nodes), 'embeds': embeds, 'images': images, 'errors': errors})

with open(os.path.join(OUT, 'index.json'), 'w') as f:
    json.dump(index, f, ensure_ascii=False, indent=1)
json.dump({'ok': all(not r['errors'] for r in report), 'components': report}, open(os.path.join(SCRATCH, 'report.json'), 'w'), indent=1)
print(json.dumps({'ok': all(not r['errors'] for r in report), 'components': report}, indent=1))
