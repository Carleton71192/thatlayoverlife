#!/usr/bin/env node
// wf2html.mjs
// Turns a saved Webflow page state (tree.json + settings.json + raw-settings.json + meta.json)
// into one standalone HTML document for the design-source bundle.
//
// Usage:
//   node scripts/export/wf2html.mjs <pageStateDir> --out <bundlePagesDir> [--shared <sharedStateDir>]
//
// Node 22 ESM, no npm dependencies. Deterministic: same inputs give the same bytes.
// Fails with a non-zero exit and a message on malformed input. A node whose settings are
// missing is still rendered and gets a data-wf-missing marker instead of stopping the run.
// Values that come from a CMS sample or a component prop are marked with data-cms-field or
// data-wf-prop. A binding that cannot be resolved keeps the Designer text and also gets
// data-cms-unresolved="<reason>".

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_SHARED = 'reports/evidence/webflow-export-2026-10-13/state';
const SITE_ID = '69d6145cf421c777840c1e25';
// The jQuery build every Webflow site loads before webflow.js (same file for all sites).
const WEBFLOW_JQUERY =
  `https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=${SITE_ID}`;

class ConverterError extends Error {}

function fail(msg) {
  throw new ConverterError(msg);
}

function parseArgs(argv) {
  const args = { pageDir: null, out: null, shared: DEFAULT_SHARED };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') args.out = argv[++i];
    else if (a === '--shared') args.shared = argv[++i];
    else if (a.startsWith('--')) fail(`unknown option ${a}`);
    else if (!args.pageDir) args.pageDir = a;
    else fail(`unexpected argument ${a}`);
  }
  if (!args.pageDir) fail('usage: wf2html.mjs <pageStateDir> --out <bundlePagesDir> [--shared <dir>]');
  if (!args.out) fail('missing --out <bundlePagesDir>');
  return args;
}

function readJson(file, { required = true } = {}) {
  if (!fs.existsSync(file)) {
    if (required) fail(`missing required file ${file}`);
    return null;
  }
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (e) {
    fail(`cannot read ${file}: ${e.message}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    fail(`malformed JSON in ${file}: ${e.message}`);
  }
}

function readText(file) {
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

// ---------- input normalization ----------

// Accepts: {status,message,data:node} | {result:[{data:node}]} | node
function unwrapTree(raw, label) {
  if (!raw || typeof raw !== 'object') fail(`${label}: tree is not an object`);
  let node = raw;
  if (raw.data && typeof raw.data === 'object' && raw.data.type) node = raw.data;
  else if (Array.isArray(raw.result) && raw.result[0] && raw.result[0].data) node = raw.result[0].data;
  else if (raw.tree) return unwrapTree(raw.tree, label);
  if (!node || typeof node !== 'object' || typeof node.type !== 'string') {
    fail(`${label}: cannot find a root node with a "type"`);
  }
  return node;
}

// An error envelope saved in place of a result ({status:"error",message}) is not settings.
function isErrorEnvelope(entry) {
  return (
    entry &&
    typeof entry === 'object' &&
    typeof entry.status === 'string' &&
    entry.status.toLowerCase() !== 'success' &&
    !Array.isArray(entry.matches) &&
    !(entry.data && Array.isArray(entry.data.matches))
  );
}

// settings.json value per element can be:
//   {type, total_matches, matches:[{key,value}]}   (get_settings data)
//   {status, message, data:{matches}}              (one result)
//   [{status, data:{matches}}]                     (whole result array)
//   {key: value, ...}                              (already flattened)
// Returns null for anything else, including error envelopes.
function flattenSettings(entry) {
  if (!entry) return null;
  if (Array.isArray(entry)) {
    const first = entry.find((x) => x && !isErrorEnvelope(x) && (x.data || x.matches));
    return first ? flattenSettings(first.data || first) : null;
  }
  if (typeof entry !== 'object') return null;
  if (isErrorEnvelope(entry)) return null;
  if (Array.isArray(entry.matches)) {
    const out = {};
    for (const m of entry.matches) {
      if (m && typeof m.key === 'string') out[m.key] = m.value;
    }
    return out;
  }
  if (entry.data && Array.isArray(entry.data.matches)) return flattenSettings(entry.data);
  // An envelope with no matches (for example {status:"success", data:null}) holds nothing.
  if ('status' in entry && 'message' in entry) return null;
  return entry;
}

function normalizeSettingsMap(raw, label) {
  if (raw == null) return {};
  if (typeof raw !== 'object' || Array.isArray(raw)) fail(`${label}: expected an object keyed by element id`);
  const out = {};
  for (const [id, entry] of Object.entries(raw)) {
    const flat = flattenSettings(entry);
    if (flat) out[id] = flat;
  }
  return out;
}

// ---------- shared inputs ----------

const STYLE_RANK = { global: 0, combo: 1, tag: 2 };

function styleKind(st) {
  if (st.type === 'tag') return 'tag';
  if (st.type === 'combo' || st.isComboClass) return 'combo';
  return 'global';
}

function loadStylesMap(sharedDir) {
  const file = path.join(sharedDir, 'styles', 'styles-base.json');
  const raw = readJson(file, { required: false });
  const map = new Map();
  if (!raw) return map;
  const list = Array.isArray(raw) ? raw : Array.isArray(raw.styles) ? raw.styles : Object.values(raw);
  for (const st of list) {
    if (!st || typeof st.name !== 'string' || typeof st.selector !== 'string') continue;
    const kind = styleKind(st);
    const existing = map.get(st.name);
    // Prefer a global class over a combo, and a combo over a tag style, for the same name.
    if (!existing || STYLE_RANK[kind] < STYLE_RANK[existing.kind]) {
      map.set(st.name, { selector: st.selector, kind });
    }
  }
  return map;
}

function loadPagesMap(sharedDir) {
  const raw = readJson(path.join(sharedDir, 'pages.json'), { required: false });
  const byId = new Map();
  if (!raw) return byId;
  const rows = Array.isArray(raw) ? raw : Object.values(raw);
  for (const row of rows) {
    if (row && row.id) byId.set(row.id, row);
  }
  return byId;
}

function loadAssets(sharedDir) {
  const raw = readJson(path.join(sharedDir, 'assets.json'), { required: false });
  const map = new Map();
  if (!raw) return map;
  if (Array.isArray(raw)) {
    for (const a of raw) if (a && a.id) map.set(a.id, a);
  } else {
    for (const [id, a] of Object.entries(raw)) map.set(id, a || {});
  }
  return map;
}

// Registered scripts: registered-scripts*.json files, each {registeredScripts:[...]} or an array.
function loadRegisteredScripts(sharedDir) {
  const map = new Map();
  if (!fs.existsSync(sharedDir)) return map;
  const files = fs
    .readdirSync(sharedDir)
    .filter((f) => /^registered-scripts.*\.json$/.test(f))
    .sort();
  for (const f of files) {
    const raw = readJson(path.join(sharedDir, f), { required: false });
    const list = Array.isArray(raw) ? raw : (raw && (raw.registeredScripts || raw.scripts)) || [];
    for (const s of list) {
      if (!s || !s.id) continue;
      const key = `${s.id}@${s.version || ''}`;
      if (!map.has(key)) map.set(key, s);
    }
  }
  return map;
}

function scriptList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.scripts)) return raw.scripts;
  return [];
}

function loadComponent(sharedDir, id, cache) {
  if (cache.has(id)) return cache.get(id);
  const file = path.join(sharedDir, 'components', `${id}.json`);
  const raw = readJson(file, { required: false });
  let def = null;
  if (raw) {
    const tree = unwrapTree(raw.tree || raw, `component ${id}`);
    def = {
      tree,
      settings: normalizeSettingsMap(raw.settings, `component ${id} settings`),
      rawSettings: normalizeSettingsMap(raw.rawSettings || raw['raw-settings'], `component ${id} raw settings`),
      props: Array.isArray(raw.props) ? raw.props : [],
    };
  }
  cache.set(id, def);
  return def;
}

// cms/<id>.json holds {id, displayName, slug, schema:{fields}, items}. The optional
// cms-schemas/<id>.json (get_collection_details) adds field validations: option labels
// and the collection a reference field points to.
function loadCollection(sharedDir, collectionId, cache) {
  if (!collectionId || typeof collectionId !== 'string') return null;
  if (cache.has(collectionId)) return cache.get(collectionId);
  const raw = readJson(path.join(sharedDir, 'cms', `${collectionId}.json`), { required: false });
  const details = readJson(path.join(sharedDir, 'cms-schemas', `${collectionId}.json`), { required: false });
  let col = null;
  if (raw || details) {
    const items = raw ? (Array.isArray(raw.items) ? raw.items : Array.isArray(raw) ? raw : []) : [];
    const schema = (raw && (raw.schema || raw.collection)) || {};
    const baseFields = Array.isArray(schema.fields) ? schema.fields : raw && Array.isArray(raw.fields) ? raw.fields : [];
    const detailFields = details && Array.isArray(details.fields) ? details.fields : [];
    const byId = new Map();
    for (const f of baseFields) if (f && f.id) byId.set(f.id, { ...f });
    for (const f of detailFields) if (f && f.id) byId.set(f.id, { ...(byId.get(f.id) || {}), ...f });
    col = {
      id: collectionId,
      schema,
      fields: [...byId.values()],
      items,
      slug: schema.slug || (raw && raw.slug) || (details && details.slug) || null,
    };
  }
  cache.set(collectionId, col);
  return col;
}

// ---------- html helpers ----------

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW_TEXT = new Set(['script', 'style']);
// HTML attribute names may not hold whitespace, quotes, ">", "/", "=" or control characters.
const ATTR_NAME_OK = /^[^\s"'>\/=\u0000-\u001f\u007f]+$/;
const CLASS_SELECTOR = /^(\.[A-Za-z0-9_-]+)+$/;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(s) {
  return esc(s);
}

function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Webflow builds a class from a style name by lowercasing it and turning every run of
// characters outside [a-z0-9_-] into one hyphen ("rotate_-4.5deg" -> "rotate_-4-5deg").
function classFromName(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
}

function classFromSelector(selector) {
  // ".checkbox_toggle.on-accent-tertiary" -> "on-accent-tertiary"; ".foo" -> "foo".
  // Tag selectors ("p", ".rich-text h1") are not classes: return null.
  if (!CLASS_SELECTOR.test(selector)) return null;
  const parts = selector.split('.').filter(Boolean);
  const last = parts[parts.length - 1];
  // Webflow stores its built-in classes on a combo as "_w-input"; the live CSS uses ".w-input".
  return last.replace(/^_(w-)/, '$1');
}

function openTag(tag, attrs) {
  let s = `<${tag}`;
  for (const k of Object.keys(attrs)) {
    const v = attrs[k];
    if (v === null || v === undefined || v === false) continue;
    if (!ATTR_NAME_OK.test(k)) continue; // names are validated in baseAttrs; this is a backstop
    if (v === true) s += ` ${k}`;
    else s += ` ${k}="${escAttr(v)}"`;
  }
  return s + '>';
}

function isHex24(s) {
  return typeof s === 'string' && /^[0-9a-f]{24}$/.test(s);
}

// ---------- the converter ----------

class Converter {
  constructor({ sharedDir, stylesMap, pagesById, assets }) {
    this.sharedDir = sharedDir;
    this.stylesMap = stylesMap;
    this.pagesById = pagesById;
    this.assets = assets;
    this.componentCache = new Map();
    this.collectionCache = new Map();
    this.itemIndex = null;
    this.idIndex = new Map(); // element id -> domId, for pageSection links
    this.bodyAttrs = null;
    this.meta = {
      classesUsed: [],
      strings: [],
      nodeCount: 0,
      embeds: 0,
      images: 0,
      unsupportedTypes: [],
      hiddenNodes: 0,
      componentInstances: [],
      cmsBound: [],
      cmsUnresolved: [],
      propBound: [],
      droppedAttributes: [],
      warnings: [],
      scripts: { emitted: [], unresolved: [] },
    };
    this._classSet = new Set();
    this._unsupported = new Set();
    this._idCounts = new Map();
  }

  noteClass(c) {
    if (!this._classSet.has(c)) {
      this._classSet.add(c);
      this.meta.classesUsed.push(c);
    }
  }

  warn(msg) {
    if (!this.meta.warnings.includes(msg)) this.meta.warnings.push(msg);
  }

  // Walks a tree once to map element ids to DOM ids (static settings or resolved settings).
  indexIds(node, settingsMap) {
    if (!node || typeof node !== 'object') return;
    const elId = node.id && node.id.element;
    if (elId) {
      const s = node.settings || {};
      const r = settingsMap[elId] || {};
      const dom = (typeof s.domId === 'string' && s.domId.trim()) || (typeof r.domId === 'string' && r.domId.trim()) || '';
      if (dom && !this.idIndex.has(elId)) this.idIndex.set(elId, dom);
    }
    if (Array.isArray(node.children)) for (const c of node.children) this.indexIds(c, settingsMap);
  }

  wrap(tag, attrs, inner) {
    if (VOID.has(tag)) {
      if (inner) {
        this.warn(`children of a void <${tag}> element were placed after it as siblings`);
        return `${openTag(tag, attrs)}<!-- children of void <${tag}> follow -->${inner}`;
      }
      return openTag(tag, attrs);
    }
    return `${openTag(tag, attrs)}${inner}</${tag}>`;
  }

  // ctx: { settings, rawSettings, props, propDefs, stack, cmsItem, cmsCollectionId, dyn,
  //        rawText, inLabel, inLink }
  render(node, ctx) {
    if (!node || typeof node !== 'object') fail('node is not an object');
    if (typeof node.type !== 'string') fail(`node ${JSON.stringify(node.id || '?')} has no type`);
    this.meta.nodeCount++;

    const type = node.type;
    const settings = node.settings || {};
    const elId = node.id && node.id.element;
    const resolved = (elId && ctx.settings[elId]) || null;
    const raw = (elId && ctx.rawSettings[elId]) || null;

    if (settings.visibility === false || (resolved && resolved.visibility === false)) {
      this.meta.hiddenNodes++;
      const classes = this.classList(node).join(' ');
      return `<!-- hidden in Designer: ${esc(type)}${classes ? ' ' + esc(classes) : ''} -->`;
    }

    if (type === 'String') return this.renderString(node, ctx, raw);

    if (type === 'ComponentInstance') return this.renderComponentInstance(node, ctx);

    const attrs = this.baseAttrs(node, resolved, raw, ctx);
    // Text bound to a CMS field or a component prop (or set only in settings) replaces the
    // children; otherwise the children render as they are.
    const children = (sub = ctx) => {
      const bound = this.boundText(node, raw, resolved, sub, attrs);
      return bound !== null ? bound : this.renderChildren(node, sub);
    };
    const wrap = (tag, a, inner) => this.wrap(tag, a, inner);

    switch (type) {
      case 'Body':
        this.bodyAttrs = attrs;
        return children();
      case 'Block':
      case 'Section':
      case 'Container':
      case 'Grid':
      case 'Row':
      case 'Column':
      case 'Article':
      case 'Aside':
      case 'Header':
      case 'Footer':
      case 'Nav':
      case 'Main':
      case 'DOM': {
        const tagRaw =
          settings.tag || (settings.dom && settings.dom.tag) || (settings.block && settings.block.tag) || (resolved && typeof resolved.tag === 'string' && resolved.tag) || 'div';
        const tag = /^[A-Za-z][A-Za-z0-9-]*$/.test(String(tagRaw)) ? String(tagRaw).toLowerCase() : 'div';
        if (type === 'Container') this.addClass(attrs, 'w-container');
        if (type === 'Grid') this.addClass(attrs, 'w-layout-grid');
        if (type === 'Row') this.addClass(attrs, 'w-row');
        if (type === 'Column') this.addClass(attrs, 'w-col');
        if (RAW_TEXT.has(tag)) return wrap(tag, attrs, children({ ...ctx, rawText: tag }));
        return wrap(tag, attrs, children());
      }
      case 'Heading': {
        const level = Number(settings.headingLevel) || Number(String(settings.tag || '').replace(/^h/, '')) || 2;
        return wrap(`h${Math.min(6, Math.max(1, level))}`, attrs, children());
      }
      case 'Paragraph':
        return wrap('p', attrs, children());
      case 'Span':
        return wrap('span', attrs, children());
      case 'Emphasized':
        return wrap('em', attrs, children());
      case 'Strong':
        return wrap('strong', attrs, children());
      case 'Blockquote':
        return wrap('blockquote', attrs, children());
      case 'List':
        return wrap(settings.tag === 'ol' ? 'ol' : 'ul', attrs, children());
      case 'ListItem':
        return wrap('li', attrs, children());
      case 'LineBreak':
        return '<br>';
      case 'Superscript':
        return wrap('sup', attrs, children());
      case 'Subscript':
        return wrap('sub', attrs, children());
      case 'Link':
      case 'LinkBlock':
      case 'Button':
      case 'NavbarLink':
      case 'NavbarBrand':
      case 'TabsLink':
      case 'DropdownLink': {
        if (type === 'Button') this.addClass(attrs, 'w-button');
        if (type === 'LinkBlock') this.addClass(attrs, 'w-inline-block');
        if (type === 'NavbarLink') this.addClass(attrs, 'w-nav-link');
        if (type === 'NavbarBrand') this.addClass(attrs, 'w-nav-brand');
        if (type === 'TabsLink') this.addClass(attrs, 'w-tab-link');
        if (type === 'DropdownLink') this.addClass(attrs, 'w-dropdown-link');
        const res = this.resolveHref(node, resolved, raw, ctx, attrs);
        if (res.href !== null) attrs.href = res.href;
        else delete attrs.href;
        if (res.missing) attrs['data-wf-missing'] = res.missing;
        if (res.newTab) {
          attrs.target = '_blank';
          const rel = new Set(String(attrs.rel || res.rel || '').split(/\s+/).filter(Boolean));
          rel.add('noopener');
          attrs.rel = [...rel].join(' ');
        } else if (res.rel && !attrs.rel) attrs.rel = res.rel;
        if (!('href' in attrs) && !res.missing && (type === 'LinkBlock' || type === 'Link')) attrs['data-wf-missing'] = 'link';
        if (ctx.inLink) this.warn('a link is nested inside another link (invalid HTML, kept as in the Designer)');
        return wrap('a', attrs, children({ ...ctx, inLink: true }));
      }
      case 'Image': {
        this.meta.images++;
        return this.renderImage(node, attrs, resolved, raw, ctx);
      }
      case 'HtmlEmbed': {
        this.meta.embeds++;
        this.addClass(attrs, 'w-embed');
        const code = resolved && typeof resolved.code === 'string' ? resolved.code : null;
        if (code === null) {
          attrs['data-wf-missing'] = 'code';
          return wrap('div', attrs, '');
        }
        return wrap('div', attrs, code);
      }
      case 'RichText': {
        this.addClass(attrs, 'w-richtext');
        const binding = raw && this.bindingOf(raw.richText);
        if (binding && binding.sourceType === 'cms') {
          const slug = this.tagCms(attrs, binding, ctx, type);
          const r = this.cmsResolve(binding, ctx, 'html');
          if (typeof r.value === 'string') return wrap('div', attrs, r.value);
          this.markUnresolved(attrs, slug, r.reason);
        }
        return wrap('div', attrs, this.renderChildren(node, ctx));
      }
      case 'Video':
      case 'YouTubeVideo':
      case 'BackgroundVideo': {
        this.addClass(attrs, 'w-video');
        const url = this.videoUrl(settings, resolved);
        if (url) return wrap('div', attrs, `<iframe src="${escAttr(url)}" allowfullscreen loading="lazy"></iframe>`);
        attrs['data-wf-missing'] = 'video';
        return wrap('div', attrs, `<div class="w-video-placeholder">${esc(type)} (no url known)</div>`);
      }
      // ----- forms -----
      case 'FormWrapper':
        this.addClass(attrs, 'w-form');
        return wrap('div', attrs, children());
      case 'FormForm': {
        const fs_ = (settings.form && settings.form.formSettings) || {};
        if (fs_.method) attrs.method = fs_.method;
        if (fs_.action !== undefined && fs_.action !== '') attrs.action = fs_.action;
        const name = fs_.name || (settings.form && settings.form.name);
        if (name) {
          attrs.name = name;
          attrs['data-name'] = name;
        }
        if (fs_.redirect) attrs['data-redirect'] = fs_.redirect;
        return wrap('form', attrs, children());
      }
      case 'FormBlockLabel':
        return this.renderLabel('label', attrs, node, ctx, children);
      case 'FormInlineLabel':
        this.addClass(attrs, 'w-form-label');
        return wrap('span', attrs, children());
      case 'FormTextInput': {
        this.addClass(attrs, 'w-input');
        this.inputAttrs(attrs, node, resolved, 'text');
        if (!resolved) attrs['data-wf-missing'] = 'settings';
        return wrap('input', attrs, '');
      }
      case 'FormTextarea': {
        this.addClass(attrs, 'w-input');
        this.inputAttrs(attrs, node, resolved, null);
        delete attrs.type;
        if (!resolved) attrs['data-wf-missing'] = 'settings';
        return wrap('textarea', attrs, '');
      }
      case 'FormSelect': {
        this.addClass(attrs, 'w-select');
        this.inputAttrs(attrs, node, resolved, null);
        delete attrs.type;
        if (!resolved) attrs['data-wf-missing'] = 'settings';
        return wrap('select', attrs, '<option value="">Select one...</option><!-- select options are not exposed by the API -->');
      }
      case 'FormCheckboxWrapper':
        this.addClass(attrs, 'w-checkbox');
        return this.renderLabel('label', attrs, node, ctx, children);
      case 'FormCheckboxInput': {
        this.addClass(attrs, 'w-checkbox-input');
        this.inputAttrs(attrs, node, resolved, 'checkbox');
        attrs.type = 'checkbox';
        if (!resolved) attrs['data-wf-missing'] = 'settings';
        return wrap('input', attrs, '');
      }
      case 'FormRadioWrapper':
        this.addClass(attrs, 'w-radio');
        return this.renderLabel('label', attrs, node, ctx, children);
      case 'FormRadioInput': {
        this.addClass(attrs, 'w-radio-input');
        this.inputAttrs(attrs, node, resolved, 'radio');
        attrs.type = 'radio';
        const group = (resolved && (resolved.groupName || resolved.name)) || (settings.input && settings.input.groupName);
        if (group) attrs.name = group;
        const val = (resolved && resolved.value) || (settings.input && settings.input.value);
        if (val !== undefined && val !== null) attrs.value = val;
        if (!resolved) attrs['data-wf-missing'] = 'settings';
        return wrap('input', attrs, '');
      }
      case 'FormButton': {
        this.addClass(attrs, 'w-button');
        attrs.type = 'submit';
        attrs.value = resolved && typeof resolved.buttonText === 'string' ? resolved.buttonText : 'Submit';
        if (resolved && typeof resolved.loadingText === 'string') attrs['data-wait'] = resolved.loadingText;
        if (!resolved) attrs['data-wf-missing'] = 'settings';
        return wrap('input', attrs, '');
      }
      case 'FormFileUploadWrapper':
        this.addClass(attrs, 'w-file-upload');
        return wrap('div', attrs, `<input type="file" class="w-file-upload-input">${children()}`);
      case 'FormSuccessMessage':
        this.addClass(attrs, 'w-form-done');
        return wrap('div', attrs, children());
      case 'FormErrorMessage':
        this.addClass(attrs, 'w-form-fail');
        return wrap('div', attrs, children());
      case 'FormReCaptcha':
        this.addClass(attrs, 'g-recaptcha');
        return wrap('div', attrs, children());
      // ----- collection lists -----
      case 'DynamoWrapper': {
        this.addClass(attrs, 'w-dyn-list');
        const dyn = this.listBinding(raw) || this.listBinding(resolved);
        if (dyn) attrs['data-cms-collection'] = dyn.collectionId;
        return wrap('div', attrs, this.renderChildren(node, { ...ctx, dyn: dyn || ctx.dyn || null }));
      }
      case 'DynamoList': {
        this.addClass(attrs, 'w-dyn-items');
        attrs.role = 'list';
        const binding = this.listBinding(raw) || this.listBinding(resolved) || ctx.dyn || null;
        const col = binding ? loadCollection(this.sharedDir, binding.collectionId, this.collectionCache) : null;
        if (binding && !attrs['data-cms-collection']) attrs['data-cms-collection'] = binding.collectionId;
        let items = [null];
        if (!binding) {
          attrs['data-cms-unresolved'] = 'no-collection-binding';
          this.warn(`collection list ${elId || '?'} has no known collection binding; one item rendered`);
        } else if (!col || !col.items.length) {
          attrs['data-cms-unresolved'] = 'no-sample-items';
        } else {
          const offset = Number.isFinite(binding.offset) ? binding.offset : 0;
          const limit = Number.isFinite(binding.limit) && binding.limit > 0 ? binding.limit : col.items.length;
          items = col.items.slice(offset, offset + limit);
          if (!items.length) items = [null];
          if (binding.filtered) attrs['data-cms-note'] = 'filters and sort are not applied to the sample';
        }
        let out = '';
        for (const item of items) {
          out += this.renderChildren(node, { ...ctx, dyn: null, cmsItem: item, cmsCollectionId: item ? binding.collectionId : ctx.cmsCollectionId });
        }
        return wrap('div', attrs, out);
      }
      case 'DynamoItem':
        this.addClass(attrs, 'w-dyn-item');
        attrs.role = 'listitem';
        return wrap('div', attrs, children());
      case 'DynamoEmpty':
        this.addClass(attrs, 'w-dyn-empty');
        return wrap('div', attrs, children());
      // ----- navbar, dropdown, tabs, slider, lightbox, icon -----
      case 'NavbarWrapper':
        this.addClass(attrs, 'w-nav');
        attrs['data-collapse'] = attrs['data-collapse'] || 'medium';
        return wrap('div', attrs, children());
      case 'NavbarContainer':
        this.addClass(attrs, 'w-container');
        return wrap('div', attrs, children());
      case 'NavbarMenu':
        this.addClass(attrs, 'w-nav-menu');
        return wrap('nav', attrs, children());
      case 'NavbarButton':
        this.addClass(attrs, 'w-nav-button');
        return wrap('div', attrs, children());
      case 'DropdownWrapper':
        this.addClass(attrs, 'w-dropdown');
        return wrap('div', attrs, children());
      case 'DropdownToggle':
        this.addClass(attrs, 'w-dropdown-toggle');
        return wrap('div', attrs, children());
      case 'DropdownList':
        this.addClass(attrs, 'w-dropdown-list');
        return wrap('nav', attrs, children());
      case 'TabsWrapper':
        this.addClass(attrs, 'w-tabs');
        return wrap('div', attrs, children());
      case 'TabsMenu':
        this.addClass(attrs, 'w-tab-menu');
        return wrap('div', attrs, children());
      case 'TabsContent':
        this.addClass(attrs, 'w-tab-content');
        return wrap('div', attrs, children());
      case 'TabsPane':
        this.addClass(attrs, 'w-tab-pane');
        return wrap('div', attrs, children());
      case 'SliderWrapper':
        this.addClass(attrs, 'w-slider');
        return wrap('div', attrs, children());
      case 'SliderMask':
        this.addClass(attrs, 'w-slider-mask');
        return wrap('div', attrs, children());
      case 'SliderSlide':
        this.addClass(attrs, 'w-slide');
        return wrap('div', attrs, children());
      case 'SliderArrow':
      case 'SliderLeftArrow':
        this.addClass(attrs, 'w-slider-arrow-left');
        return wrap('div', attrs, children());
      case 'SliderRightArrow':
        this.addClass(attrs, 'w-slider-arrow-right');
        return wrap('div', attrs, children());
      case 'SliderNav':
        this.addClass(attrs, 'w-slider-nav');
        return wrap('div', attrs, children());
      case 'LightboxWrapper':
      case 'Lightbox':
        this.addClass(attrs, 'w-lightbox');
        return wrap('a', attrs, children());
      case 'Icon': {
        const pick = (v) => (typeof v === 'string' && v ? v : v && typeof v === 'object' && typeof v.name === 'string' && v.name ? v.name : null);
        const kind = pick(settings.icon) || pick(resolved && resolved.icon) || 'icon';
        this.addClass(attrs, `w-icon-${slugify(kind) || 'icon'}`);
        return wrap('div', attrs, children());
      }
      default: {
        this._unsupported.add(type);
        attrs['data-wf-type'] = type;
        return wrap('div', attrs, children());
      }
    }
  }

  renderString(node, ctx, raw) {
    let text = node.textContent == null ? '' : String(node.textContent);
    const binding = this.textBinding(raw);
    let note = '';
    if (binding) {
      if (binding.sourceType === 'cms') {
        const slug = this.fieldSlug(binding);
        this.meta.cmsBound.push(`String:${slug}`);
        const r = this.cmsResolve(binding, ctx, 'text');
        if (typeof r.value === 'string') text = r.value;
        else this.meta.cmsUnresolved.push(`String:${slug}:${r.reason}`);
        // A text node cannot carry an attribute, so the field name goes in a comment.
        note = `<!-- cms-field: ${esc(slug)} -->`;
      } else {
        const v = this.propText(binding, ctx, null);
        if (typeof v === 'string') text = v;
      }
    }
    if (text) this.meta.strings.push(text);
    if (ctx.rawText) return note + text.replace(new RegExp(`</(${ctx.rawText})`, 'gi'), '<\\/$1');
    return note + esc(text);
  }

  renderLabel(tag, attrs, node, ctx, children) {
    if (ctx.inLabel) this.warn('a label is nested inside another label (invalid HTML, kept as in the Designer)');
    return this.wrap(tag, attrs, children({ ...ctx, inLabel: true }));
  }

  renderChildren(node, ctx) {
    const kids = node.children;
    if (kids == null) return '';
    if (!Array.isArray(kids)) fail(`node ${node.id && node.id.element}: children is not an array`);
    let out = '';
    for (const c of kids) out += this.render(c, ctx);
    return out;
  }

  // Text that replaces an element's children: a CMS or prop binding on its "text" setting,
  // or resolved text that exists only in settings (an element with no String child).
  // Returns escaped HTML, or null to render the children.
  boundText(node, raw, resolved, ctx, attrs) {
    const type = node.type;
    const binding = this.textBinding(raw);
    if (binding && binding.sourceType === 'cms') {
      const slug = this.tagCms(attrs, binding, ctx, type);
      const r = this.cmsResolve(binding, ctx, 'text');
      if (typeof r.value === 'string') {
        if (r.value) this.meta.strings.push(r.value);
        return ctx.rawText ? r.value : esc(r.value);
      }
      this.markUnresolved(attrs, slug, r.reason);
      return null;
    }
    if (binding && binding.sourceType === 'prop') {
      attrs['data-wf-prop'] = binding.propName || binding.propId || binding.prop_id;
      const v = this.propText(binding, ctx, resolved);
      this.meta.propBound.push(`${type}:${attrs['data-wf-prop']}`);
      if (typeof v === 'string') {
        if (v) this.meta.strings.push(v);
        return ctx.rawText ? v : esc(v);
      }
      attrs['data-wf-missing'] = 'prop-value';
      return null;
    }
    const hasKids = Array.isArray(node.children) && node.children.length > 0;
    if (!hasKids && resolved && resolved.text && typeof resolved.text === 'object' && typeof resolved.text.innerText === 'string' && resolved.text.innerText) {
      this.meta.strings.push(resolved.text.innerText);
      return ctx.rawText ? resolved.text.innerText : esc(resolved.text.innerText);
    }
    return null;
  }

  // ----- attributes and classes -----

  classList(node) {
    const out = [];
    const seen = new Set();
    const push = (c) => {
      if (!c || seen.has(c)) return;
      seen.add(c);
      out.push(c);
    };
    for (const name of node.styleNames || []) {
      const hit = this.stylesMap.get(name);
      const fromSel = hit && hit.kind !== 'tag' ? classFromSelector(hit.selector) : null;
      push(fromSel || classFromName(name));
    }
    const attrClass = node.attributes && node.attributes.class;
    if (typeof attrClass === 'string') for (const c of attrClass.split(/\s+/)) push(c);
    return out;
  }

  addClass(attrs, c) {
    const list = attrs.class ? attrs.class.split(' ') : [];
    if (!list.includes(c)) list.push(c);
    attrs.class = list.join(' ');
    this.noteClass(c);
  }

  setAttr(attrs, name, value) {
    if (!ATTR_NAME_OK.test(name)) {
      this.meta.droppedAttributes.push(name);
      return;
    }
    attrs[name] = value;
  }

  baseAttrs(node, resolved, raw, ctx) {
    const attrs = {};
    const classes = this.classList(node);
    if (classes.length) {
      attrs.class = classes.join(' ');
      for (const c of classes) this.noteClass(c);
    }
    const src = node.attributes || {};
    for (const [k, v] of Object.entries(src)) {
      if (k === 'class') continue;
      this.setAttr(attrs, k, v == null ? '' : String(v));
    }
    // Raw "attributes" can hold CMS or prop bindings; resolved ones fill static values.
    const lists = [raw && raw.attributes, resolved && resolved.attributes];
    const cmsFields = [];
    for (const list of lists) {
      if (!Array.isArray(list)) continue;
      for (const a of list) {
        if (!a || typeof a.name !== 'string' || a.name === 'class' || a.name in attrs) continue;
        const b = this.bindingOf(a.value);
        if (b && b.sourceType === 'cms') {
          const slug = this.fieldSlug(b);
          cmsFields.push(slug);
          this.meta.cmsBound.push(`attr ${a.name}:${slug}`);
          const r = this.cmsResolve(b, ctx, 'attr');
          if (typeof r.value === 'string') this.setAttr(attrs, a.name, r.value);
          else {
            this.setAttr(attrs, a.name, '');
            this.meta.cmsUnresolved.push(`attr ${a.name}:${slug}:${r.reason}`);
            attrs['data-cms-unresolved'] = [attrs['data-cms-unresolved'], `${a.name}:${r.reason}`].filter(Boolean).join(' ');
          }
        } else if (b && b.sourceType === 'prop') {
          const v = this.propText(b, ctx, null);
          this.setAttr(attrs, a.name, typeof v === 'string' ? v : '');
        } else if (a.value === null || a.value === undefined) {
          // A bound attribute whose resolved value is null: the raw list fills it, if present.
          continue;
        } else if (typeof a.value !== 'object') {
          this.setAttr(attrs, a.name, String(a.value));
        }
      }
    }
    if (cmsFields.length) attrs['data-cms-field'] = [...new Set(cmsFields)].join(' ');
    const domId = (node.settings && node.settings.domId) || (resolved && resolved.domId);
    if (typeof domId === 'string' && domId.trim()) attrs.id = domId.trim();
    if (typeof attrs.id === 'string' && attrs.id) this._idCounts.set(attrs.id, (this._idCounts.get(attrs.id) || 0) + 1);
    return attrs;
  }

  inputAttrs(attrs, node, resolved, defaultType) {
    const s = (node.settings && node.settings.input) || {};
    const type = (resolved && resolved.type) || s.inputType || defaultType;
    if (type) attrs.type = type;
    const name = (resolved && resolved.name) || s.inputName;
    if (name) {
      attrs.name = name;
      attrs['data-name'] = name;
    }
    if (resolved && resolved.required === true) attrs.required = true;
    if (resolved && typeof resolved.placeholder === 'string' && resolved.placeholder !== '') attrs.placeholder = resolved.placeholder;
    const maxlen = resolved && (resolved.maxLength ?? resolved.maxlength);
    if (maxlen !== undefined && maxlen !== null && maxlen !== '') attrs.maxlength = String(maxlen);
  }

  // ----- links -----

  // Returns {href|null, missing?, newTab?, rel?}.
  resolveHref(node, resolved, raw, ctx, attrs) {
    const out = { href: null };
    const staticLink = node.settings && node.settings.link && typeof node.settings.link === 'object' ? node.settings.link : null;
    const resolvedLink = resolved && resolved.link && typeof resolved.link === 'object' ? resolved.link : null;
    for (const l of [staticLink, resolvedLink]) {
      if (!l) continue;
      if (l.openInNewTab === true || l.target === '_blank' || l.openInNewTab === 'true') out.newTab = true;
      if (typeof l.rel === 'string' && l.rel) out.rel = out.rel || l.rel;
    }

    // 1. A CMS binding on the link wins when the sample has a value.
    const rawLink = raw && raw.link;
    const bound = raw && (this.bindingOf(rawLink) || this.bindingOf(rawLink && rawLink.to) || this.bindingOf(raw.href) || this.bindingOf(raw.url));
    if (bound && bound.sourceType === 'cms') {
      const slug = this.tagCms(attrs, bound, ctx, node.type + ' link');
      const r = this.cmsResolve(bound, ctx, 'link');
      if (typeof r.value === 'string' && r.value) {
        out.href = r.value;
        return out;
      }
      this.markUnresolved(attrs, slug, r.reason);
    } else if (bound && bound.sourceType === 'prop') {
      const v = this.propText(bound, ctx, null);
      if (typeof v === 'string' && v) {
        out.href = v;
        return out;
      }
    }

    // 2. Static link in the tree, then the resolved link from settings.json.
    let missing = null;
    for (const l of [staticLink, resolvedLink]) {
      if (!l) continue;
      const r = this.linkTarget(l);
      if (r.href !== null && r.href !== undefined) {
        out.href = r.href;
        if (r.missing) out.missing = r.missing;
        return out;
      }
      if (r.missing && !missing) missing = r.missing;
    }

    // 3. A plain href attribute.
    if (node.attributes && typeof node.attributes.href === 'string') {
      out.href = node.attributes.href;
      return out;
    }
    if (missing) out.missing = missing;
    return out;
  }

  linkTarget(link) {
    const mode = link.linkType || link.mode;
    const str = (v) => (typeof v === 'string' && v !== '' ? v : null);
    switch (mode) {
      case 'url': {
        const v = str(link.href) ?? str(link.url) ?? str(link.to);
        return v === null ? { href: null, missing: 'link-url' } : { href: v };
      }
      case 'email': {
        const v = str(link.href) ?? str(link.email) ?? str(link.to);
        if (v === null) return { href: null, missing: 'link-email' };
        return { href: /^mailto:/i.test(v) ? v : `mailto:${v}` };
      }
      case 'phone': {
        const v = str(link.href) ?? str(link.phone) ?? str(link.to);
        if (v === null) return { href: null, missing: 'link-phone' };
        return { href: /^tel:/i.test(v) ? v : `tel:${v.replace(/\s+/g, '')}` };
      }
      case 'page': {
        const pid = str(link.pageId) ?? str(link.to) ?? str(link.href);
        const row = pid ? this.pagesById.get(pid) : null;
        if (!row) return { href: '#', missing: 'page' };
        return { href: this.pagePath(row) };
      }
      case 'pageSection': {
        let target = link.domId || link.sectionId || link.to || link.toElementId || link.to_element_id || null;
        if (target && typeof target === 'object') target = target.element || null;
        if (typeof target !== 'string' || !target) return { href: '#', missing: 'section' };
        const t = target.replace(/^#/, '');
        if (this.idIndex.has(t)) return { href: `#${this.idIndex.get(t)}` };
        // An element id with no DOM id cannot be linked to; a plain DOM id is kept as is.
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-/.test(t) || isHex24(t)) return { href: '#', missing: 'section' };
        return { href: `#${t}` };
      }
      case 'file': {
        const asset = this.assets.get(link.assetId || link.to || link.href);
        return asset && asset.hostedUrl ? { href: asset.hostedUrl } : { href: '#', missing: 'file' };
      }
      case 'collectionPage': {
        if (str(link.collectionSlug)) return { href: `/${link.collectionSlug}/` };
        const to = str(link.collectionId) ?? str(link.to) ?? str(link.pageSlug);
        if (!to) return { href: '#', missing: 'collection-page' };
        const col = loadCollection(this.sharedDir, to, this.collectionCache);
        if (col && col.slug) return { href: `/${col.slug}/` };
        const row = this.pagesById.get(to) || [...this.pagesById.values()].find((p) => p.collectionId === to);
        if (row) return { href: `${this.pagePath(row).replace(/\/$/, '')}/` };
        if (!isHex24(to) && /^[a-z0-9][a-z0-9-]*$/.test(to)) return { href: `/${to}/` };
        return { href: '#', missing: 'collection-page' };
      }
      default:
        if (typeof link.href === 'string') return { href: link.href };
        return { href: null };
    }
  }

  pagePath(row) {
    if (typeof row.publishedPath === 'string' && row.publishedPath) return row.publishedPath;
    if (row.slug === 'index') return '/';
    return `/${row.slug}`;
  }

  // ----- images -----

  renderImage(node, attrs, resolved, raw, ctx) {
    const s = node.settings || {};
    let assetId = (resolved && resolved.assetId) ?? s.assetId ?? null;
    let alt = (resolved && resolved.altText) ?? s.altText ?? '';
    const binding = raw && this.bindingOf(raw.assetId);
    if (binding && binding.sourceType === 'cms') {
      const slug = this.tagCms(attrs, binding, ctx, 'Image');
      const r = this.cmsResolve(binding, ctx, 'image');
      const sample = r.value;
      if (sample && typeof sample === 'object') {
        if (sample.url) attrs.src = sample.url;
        if (sample.alt && (alt === 'inherit' || !alt)) alt = sample.alt;
      } else if (typeof sample === 'string' && sample) {
        attrs.src = sample;
      } else {
        this.markUnresolved(attrs, slug, r.reason);
      }
    }
    const altBinding = raw && this.bindingOf(raw.altText);
    if (altBinding && altBinding.sourceType === 'cms') {
      const r = this.cmsResolve(altBinding, ctx, 'text');
      if (typeof r.value === 'string') alt = r.value;
    }
    if (!attrs.src) {
      const asset = assetId ? this.assets.get(assetId) : null;
      if (asset && asset.hostedUrl) {
        attrs.src = asset.hostedUrl;
        if ((alt === 'inherit' || !alt) && asset.alt) alt = asset.alt;
      } else {
        attrs.src = '';
        if (assetId) attrs['data-wf-asset-id'] = String(assetId);
        else if (!binding) attrs['data-wf-missing'] = 'asset';
      }
    }
    attrs.alt = alt === 'inherit' ? '' : String(alt || '');
    if (!('loading' in attrs)) attrs.loading = 'lazy';
    return this.wrap('img', attrs, this.renderChildren(node, ctx));
  }

  videoUrl(settings, resolved) {
    const cands = [
      resolved && resolved.url,
      resolved && resolved.videoUrl,
      resolved && resolved.video && resolved.video.src,
      resolved && resolved.src,
      settings.video && settings.video.url,
      settings.video && settings.video.src,
      settings.url,
    ];
    for (const c of cands) if (typeof c === 'string' && c) return c;
    return null;
  }

  // ----- CMS and prop bindings -----

  bindingOf(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    if (value.sourceType === 'cms' && value.collectionId && value.fieldId) return value;
    if (value.sourceType === 'prop' && (value.propId || value.prop_id)) return value;
    return null;
  }

  textBinding(raw) {
    if (!raw) return null;
    return this.bindingOf(raw.text) || this.bindingOf(raw.textContent) || null;
  }

  // A collection list binding: {collectionId, limit, offset, filtered}. Seen on the
  // DynamoWrapper as raw "source": {collectionId}, next to "limit", "offset", "filters", "sort".
  listBinding(raw) {
    if (!raw) return null;
    let collectionId = null;
    const src = raw.source || raw.collection || raw.dataSource;
    if (src && typeof src === 'object' && typeof src.collectionId === 'string') collectionId = src.collectionId;
    if (!collectionId) {
      for (const v of Object.values(raw)) {
        if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.collectionId === 'string' && !v.fieldId) {
          collectionId = v.collectionId;
          break;
        }
      }
    }
    if (!collectionId) return null;
    const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
    const filtered = (Array.isArray(raw.filters) && raw.filters.length > 0) || (Array.isArray(raw.sort) && raw.sort.length > 0);
    return { collectionId, limit: num(raw.limit), offset: num(raw.offset), filtered };
  }

  tagCms(attrs, binding, ctx, label) {
    const slug = this.fieldSlug(binding);
    const prev = attrs['data-cms-field'];
    attrs['data-cms-field'] = prev && !prev.split(' ').includes(slug) ? `${prev} ${slug}` : prev || slug;
    this.meta.cmsBound.push(`${label}:${slug}`);
    return slug;
  }

  markUnresolved(attrs, slug, reason) {
    const r = reason || 'no-value';
    attrs['data-cms-unresolved'] = attrs['data-cms-unresolved'] ? `${attrs['data-cms-unresolved']} ${r}` : r;
    this.meta.cmsUnresolved.push(`${slug}:${r}`);
  }

  findField(binding) {
    const col = loadCollection(this.sharedDir, binding.collectionId, this.collectionCache);
    const match = (x) => x && (x.id === binding.fieldId || x.fieldId === binding.fieldId);
    if (col) {
      const f = col.fields.find(match);
      if (f) return { col, field: f };
      // Fall back to the field name the binding carries (display name or slug).
      if (binding.fieldName) {
        const n = String(binding.fieldName).toLowerCase();
        const byName = col.fields.find((x) => x && (String(x.displayName || '').toLowerCase() === n || x.slug === slugify(n)));
        if (byName) return { col, field: byName };
      }
    }
    return { col, field: null };
  }

  fieldSlug(binding) {
    const { field } = this.findField(binding);
    if (field && (field.slug || field.key)) return field.slug || field.key;
    return slugify(binding.fieldName || binding.fieldId) || 'field';
  }

  // Lazily indexes every sample item across cms/*.json, for reference lookups.
  itemById(id) {
    if (!this.itemIndex) {
      this.itemIndex = new Map();
      const dir = path.join(this.sharedDir, 'cms');
      if (fs.existsSync(dir)) {
        for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
          const col = loadCollection(this.sharedDir, f.replace(/\.json$/, ''), this.collectionCache);
          if (!col) continue;
          for (const it of col.items) if (it && it.id && !this.itemIndex.has(it.id)) this.itemIndex.set(it.id, it);
        }
      }
    }
    return this.itemIndex.get(id) || null;
  }

  itemName(id, refCollectionId) {
    let item = null;
    if (refCollectionId) {
      const col = loadCollection(this.sharedDir, refCollectionId, this.collectionCache);
      if (col) item = col.items.find((x) => x && x.id === id) || null;
    }
    if (!item) item = this.itemById(id);
    const data = item && (item.fieldData || item.fields || item);
    return data && typeof data.name === 'string' ? data.name : null;
  }

  // Resolves a CMS binding against the current list item (when the list is bound to the same
  // collection) or the first sample item. want: text | html | link | image | attr.
  // Returns {value} or {value: undefined, reason}.
  cmsResolve(binding, ctx, want) {
    const { col, field } = this.findField(binding);
    if (!col) return { reason: 'collection-not-captured' };
    const item = ctx.cmsItem && ctx.cmsCollectionId === binding.collectionId ? ctx.cmsItem : col.items[0];
    if (!item) return { reason: 'no-sample-item' };
    if (!field) return { reason: 'field-not-in-schema' };
    const data = item.fieldData || item.fields || item;
    let v = data[field.slug];
    if (v === undefined && binding.fieldName) v = data[binding.fieldName];
    if (v === undefined) v = data[binding.fieldId];
    if (v === null || v === undefined || v === '') return { reason: 'empty-in-sample' };
    const ftype = String(field.type || binding.fieldType || '').toLowerCase();
    const validations = field.validations || {};

    if (ftype === 'option') {
      const opt = Array.isArray(validations.options) ? validations.options.find((o) => o && o.id === v) : null;
      return opt && typeof opt.name === 'string' ? { value: opt.name } : { reason: 'option-label-unknown' };
    }
    if (ftype === 'reference') {
      const name = typeof v === 'string' ? this.itemName(v, validations.collectionId) : null;
      return name !== null ? { value: name } : { reason: 'reference-not-captured' };
    }
    if (ftype === 'multireference') {
      if (!Array.isArray(v) || !v.length) return { reason: 'empty-in-sample' };
      const names = v.map((id) => this.itemName(id, validations.collectionId));
      return names.every((n) => n !== null) ? { value: names.join(', ') } : { reason: 'reference-not-captured' };
    }
    if (ftype === 'switch' || typeof v === 'boolean') {
      // Webflow uses switches for conditional visibility, not as text.
      return want === 'attr' ? { value: String(v) } : { reason: 'switch-not-text' };
    }
    if (ftype === 'image' || ftype === 'multiimage' || typeof v === 'object') {
      const img = Array.isArray(v) ? v[0] : v;
      const url = img && (img.url || img.hostedUrl);
      if (!url) return { reason: 'unsupported-value' };
      if (want === 'image') return { value: { url, alt: img.alt || '' } };
      if (want === 'link' || want === 'attr') return { value: url };
      return { reason: 'image-not-text' };
    }
    if (ftype === 'email' && want === 'link') return { value: /^mailto:/i.test(v) ? v : `mailto:${v}` };
    if (ftype === 'phone' && want === 'link') return { value: /^tel:/i.test(v) ? v : `tel:${String(v).replace(/\s+/g, '')}` };
    if (ftype === 'richtext' && want !== 'html') return { reason: 'richtext-not-text' };
    return { value: String(v) };
  }

  // Text for a prop binding: the instance override, then the resolved text (the default the
  // definition shows), then the prop default from the component definition.
  propText(binding, ctx, resolved) {
    const pid = binding.propId || binding.prop_id;
    const o = (ctx.props || []).find((x) => x && (x.id === pid || x.propId === pid || x.prop_id === pid));
    if (o) {
      const v = o.value;
      if (typeof v === 'string') return v;
      if (typeof v === 'number') return String(v);
      if (v && typeof v === 'object' && typeof v.innerText === 'string') return v.innerText;
      if (v && typeof v === 'object' && typeof v.text === 'string') return v.text;
    }
    if (resolved && resolved.text && typeof resolved.text === 'object' && typeof resolved.text.innerText === 'string') {
      return resolved.text.innerText;
    }
    if (resolved && typeof resolved.text === 'string') return resolved.text;
    const def = (ctx.propDefs || []).find((p) => p && p.id === pid);
    if (def) {
      const d = def.defaultValue;
      if (typeof d === 'string') return d;
      if (d && typeof d === 'object' && typeof d.innerText === 'string') return d.innerText;
    }
    return undefined;
  }

  // ----- components -----

  renderComponentInstance(node, ctx) {
    const det = node.instanceDetails || {};
    const id = det.id || det.componentId;
    const name = det.name || id || 'component';
    this.meta.componentInstances.push(name);
    if (!id) return `<div data-wf-component="${escAttr(name)}" data-wf-missing="definition"></div>`;
    const stack = ctx.stack || [];
    if (stack.includes(id) || stack.length > 12) fail(`component ${name} (${id}) is nested inside itself`);
    const def = loadComponent(this.sharedDir, id, this.componentCache);
    if (!def) return `<div data-wf-component="${escAttr(name)}" data-wf-missing="definition"></div>`;
    // Overrides may themselves be bound to the outer component's props or to a CMS field.
    const props = (Array.isArray(det.props) ? det.props : []).map((p) => {
      if (!p || typeof p !== 'object') return p;
      const b = this.bindingOf(p.value);
      if (!b) return p;
      if (b.sourceType === 'prop') return { ...p, value: this.propText(b, ctx, null) };
      const r = this.cmsResolve(b, ctx, 'text');
      return { ...p, value: r.value };
    });
    const sub = {
      settings: def.settings,
      rawSettings: def.rawSettings,
      props,
      propDefs: def.props,
      stack: [...stack, id],
      cmsItem: ctx.cmsItem,
      cmsCollectionId: ctx.cmsCollectionId,
      inLabel: ctx.inLabel,
      inLink: ctx.inLink,
    };
    this.indexIds(def.tree, def.settings);
    let slotNote = '';
    if (Array.isArray(det.slots) && det.slots.length) {
      this.warn(`component ${name}: ${det.slots.length} slot(s) passed from the page are not rendered (no slot shape captured yet)`);
      slotNote = ` <!-- ${det.slots.length} slot(s) from the page not rendered -->`;
    }
    const html = this.render(def.tree, sub);
    return `<!-- component: ${esc(name)} --> ${html}${slotNote} <!-- /component: ${esc(name)} -->`;
  }

  finish() {
    this.meta.unsupportedTypes = [...this._unsupported].sort();
    const dups = [...this._idCounts.entries()].filter(([, n]) => n > 1);
    this.meta.duplicateIds = Object.fromEntries(dups);
    if (dups.length) this.warn(`duplicate id values from the Designer: ${dups.map(([k, n]) => `${k} x${n}`).join(', ')}`);
    return this.meta;
  }
}

// ---------- document assembly ----------

function scriptTags(list, registered, location, meta, label) {
  const out = [];
  for (const s of list) {
    if (!s || !s.id) continue;
    const loc = s.location === 'footer' ? 'footer' : 'header';
    if (loc !== location) continue;
    const reg = registered.get(`${s.id}@${s.version || ''}`);
    if (!reg || !reg.hostedLocation) {
      meta.scripts.unresolved.push(`${label}:${s.id}@${s.version || ''}`);
      out.push(`<!-- registered script ${esc(s.id)} ${esc(s.version || '')} (${label}, ${loc}): source not captured -->`);
      continue;
    }
    const attrs = { src: reg.hostedLocation, type: 'text/javascript' };
    if (reg.integrityHash) {
      attrs.integrity = reg.integrityHash;
      attrs.crossorigin = 'anonymous';
    }
    for (const [k, v] of Object.entries(s.attributes || {})) {
      if (!ATTR_NAME_OK.test(k) || k === 'src') continue;
      attrs[k] = v === true || v === 'true' ? true : String(v);
    }
    meta.scripts.emitted.push(`${label}:${s.id}@${s.version || ''}`);
    out.push(`${openTag('script', attrs)}</script>`);
  }
  return out;
}

function buildDocument({ page, headCode, footerCode, siteHead, siteFooter, bodyHtml, bodyAttrs, siteScripts, pageScripts, registered, meta, unpublished }) {
  const seo = (page && page.seo) || {};
  const title = seo.title || (page && page.title) || (page && page.slug) || 'Untitled';
  const desc = seo.description || '';
  const htmlAttrs = { lang: 'en' };
  if (page && page.id) htmlAttrs['data-wf-page'] = page.id;
  htmlAttrs['data-wf-site'] = SITE_ID;
  const body = { ...(bodyAttrs || {}) };
  const bodyClasses = ['body', ...String(body.class || '').split(/\s+/).filter(Boolean)];
  body.class = [...new Set(bodyClasses)].join(' ');
  const ordered = { class: body.class };
  for (const [k, v] of Object.entries(body)) if (k !== 'class') ordered[k] = v;

  const lines = [];
  lines.push('<!doctype html>');
  lines.push(openTag('html', htmlAttrs));
  lines.push('<head>');
  lines.push('<meta charset="utf-8">');
  lines.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
  lines.push(`<title>${esc(title)}</title>`);
  if (desc) lines.push(`<meta name="description" content="${escAttr(desc)}">`);
  if (unpublished) lines.push('<!-- this page is not published on the live site -->');
  lines.push('<link rel="stylesheet" href="../css/fonts.css">');
  lines.push('<link rel="stylesheet" href="../css/webflow-base.css">');
  lines.push('<link rel="stylesheet" href="../css/tll-webflow.css">');
  lines.push('<!-- SITE HEAD CODE (Webflow site settings) -->');
  lines.push(siteHead == null ? '<!-- site-head.html not found in shared state -->' : siteHead.trimEnd());
  lines.push('<!-- /SITE HEAD CODE -->');
  lines.push('<!-- SITE SCRIPTS (registered, header) -->');
  lines.push(...scriptTags(siteScripts, registered, 'header', meta, 'site'));
  lines.push('<!-- /SITE SCRIPTS -->');
  lines.push('<!-- PAGE HEAD CODE -->');
  lines.push(headCode == null ? '' : String(headCode).trimEnd());
  lines.push('<!-- /PAGE HEAD CODE -->');
  lines.push('<!-- PAGE SCRIPTS (registered, header) -->');
  lines.push(...scriptTags(pageScripts, registered, 'header', meta, 'page'));
  lines.push('<!-- /PAGE SCRIPTS -->');
  lines.push('<link rel="stylesheet" href="../css/design-mode.css">');
  lines.push('</head>');
  lines.push(openTag('body', ordered));
  lines.push(bodyHtml);
  lines.push('<!-- WEBFLOW RUNTIME -->');
  lines.push(`<script src="${escAttr(WEBFLOW_JQUERY)}" type="text/javascript"></script>`);
  lines.push('<!-- webflow.js (nav, dropdown, tabs, slider, form runtime) is a site-specific file whose URL was not captured; add it here to get that behavior offline from Webflow -->');
  lines.push('<!-- /WEBFLOW RUNTIME -->');
  lines.push('<!-- SITE SCRIPTS (registered, footer) -->');
  lines.push(...scriptTags(siteScripts, registered, 'footer', meta, 'site'));
  lines.push('<!-- /SITE SCRIPTS -->');
  lines.push('<!-- SITE FOOTER CODE (Webflow site settings) -->');
  lines.push(siteFooter == null ? '<!-- site-footer.html not found in shared state -->' : siteFooter.trimEnd());
  lines.push('<!-- /SITE FOOTER CODE -->');
  lines.push('<!-- PAGE SCRIPTS (registered, footer) -->');
  lines.push(...scriptTags(pageScripts, registered, 'footer', meta, 'page'));
  lines.push('<!-- /PAGE SCRIPTS -->');
  lines.push('<!-- PAGE FOOTER CODE -->');
  lines.push(footerCode == null ? '' : String(footerCode).trimEnd());
  lines.push('<!-- /PAGE FOOTER CODE -->');
  lines.push('</body>');
  lines.push('</html>');
  return lines.join('\n') + '\n';
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pageDir = path.resolve(args.pageDir);
  const sharedDir = path.resolve(args.shared);
  const outDir = path.resolve(args.out);
  if (!fs.existsSync(pageDir) || !fs.statSync(pageDir).isDirectory()) fail(`page state dir not found: ${pageDir}`);
  if (!fs.existsSync(sharedDir) || !fs.statSync(sharedDir).isDirectory()) fail(`shared state dir not found: ${sharedDir}`);

  const treeRaw = readJson(path.join(pageDir, 'tree.json'));
  const root = unwrapTree(treeRaw, 'tree.json');
  const settings = normalizeSettingsMap(readJson(path.join(pageDir, 'settings.json'), { required: false }), 'settings.json');
  const rawSettings = normalizeSettingsMap(readJson(path.join(pageDir, 'raw-settings.json'), { required: false }), 'raw-settings.json');
  const meta = readJson(path.join(pageDir, 'meta.json'), { required: false }) || {};
  const page = meta.page || { slug: path.basename(pageDir), title: path.basename(pageDir), seo: {} };
  const slug = page.slug || path.basename(pageDir);
  if (typeof slug !== 'string' || !slug) fail('page slug is empty');

  const conv = new Converter({
    sharedDir,
    stylesMap: loadStylesMap(sharedDir),
    pagesById: loadPagesMap(sharedDir),
    assets: loadAssets(sharedDir),
  });
  conv.indexIds(root, settings);

  // A component definition converted as a page passes its props in meta.componentProps.
  const propDefs = Array.isArray(meta.componentProps) ? meta.componentProps : [];
  const bodyHtml = conv.render(root, { settings, rawSettings, props: [], propDefs, stack: [] });

  const html = buildDocument({
    page,
    headCode: meta.headCode,
    footerCode: meta.footerCode,
    siteHead: readText(path.join(sharedDir, 'site-head.html')),
    siteFooter: readText(path.join(sharedDir, 'site-footer.html')),
    bodyHtml,
    bodyAttrs: conv.bodyAttrs,
    siteScripts: scriptList(readJson(path.join(sharedDir, 'site-scripts.json'), { required: false })),
    pageScripts: scriptList(meta.pageScripts),
    registered: loadRegisteredScripts(sharedDir),
    meta: conv.meta,
    unpublished: meta.unpublished === true,
  });
  const outMeta = conv.finish();

  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${slug}.html`);
  fs.writeFileSync(outFile, html);
  fs.writeFileSync(path.join(pageDir, 'out.meta.json'), JSON.stringify(outMeta, null, 1) + '\n');
  process.stdout.write(
    JSON.stringify({
      slug,
      out: outFile,
      nodeCount: outMeta.nodeCount,
      embeds: outMeta.embeds,
      images: outMeta.images,
      hiddenNodes: outMeta.hiddenNodes,
      unsupportedTypes: outMeta.unsupportedTypes,
      componentInstances: outMeta.componentInstances,
      cmsUnresolved: outMeta.cmsUnresolved.length,
      scriptsUnresolved: outMeta.scripts.unresolved,
      warnings: outMeta.warnings.length,
    }) + '\n'
  );
}

try {
  main();
} catch (e) {
  const msg = e instanceof ConverterError ? e.message : (e && e.stack) || String(e);
  process.stderr.write(`wf2html: ${msg}\n`);
  process.exit(1);
}
