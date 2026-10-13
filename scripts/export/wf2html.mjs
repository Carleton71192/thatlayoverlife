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

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_SHARED = 'reports/evidence/webflow-export-2026-10-13/state';

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

// ---------- input normalisation ----------

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

// settings.json value per element can be:
//   {type, total_matches, matches:[{key,value}]}   (get_settings data)
//   {key: value, ...}                               (already flattened)
//   [{status, data:{matches}}]                      (whole result array)
function flattenSettings(entry) {
  if (!entry) return null;
  if (Array.isArray(entry)) {
    const first = entry.find((x) => x && (x.data || x.matches));
    return first ? flattenSettings(first.data || first) : null;
  }
  if (Array.isArray(entry.matches)) {
    const out = {};
    for (const m of entry.matches) {
      if (m && typeof m.key === 'string') out[m.key] = m.value;
    }
    return out;
  }
  if (entry.data && Array.isArray(entry.data.matches)) return flattenSettings(entry.data);
  if (typeof entry === 'object') return entry;
  return null;
}

function normaliseSettingsMap(raw, label) {
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

function loadStylesMap(sharedDir) {
  const file = path.join(sharedDir, 'styles', 'styles-base.json');
  const raw = readJson(file, { required: false });
  const map = new Map();
  if (!raw) return map;
  const list = Array.isArray(raw) ? raw : Array.isArray(raw.styles) ? raw.styles : Object.values(raw);
  for (const st of list) {
    if (!st || typeof st.name !== 'string' || typeof st.selector !== 'string') continue;
    const existing = map.get(st.name);
    // Prefer a plain (non-combo) class when the same name appears twice.
    if (!existing || (existing.isComboClass && !st.isComboClass)) {
      map.set(st.name, { selector: st.selector, isComboClass: !!st.isComboClass });
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

function loadComponent(sharedDir, id, cache) {
  if (cache.has(id)) return cache.get(id);
  const file = path.join(sharedDir, 'components', `${id}.json`);
  const raw = readJson(file, { required: false });
  let def = null;
  if (raw) {
    const tree = unwrapTree(raw.tree || raw, `component ${id}`);
    def = {
      tree,
      settings: normaliseSettingsMap(raw.settings, `component ${id} settings`),
      rawSettings: normaliseSettingsMap(raw.rawSettings || raw['raw-settings'], `component ${id} raw settings`),
    };
  }
  cache.set(id, def);
  return def;
}

function loadCollection(sharedDir, collectionId, cache) {
  if (!collectionId) return null;
  if (cache.has(collectionId)) return cache.get(collectionId);
  const raw = readJson(path.join(sharedDir, 'cms', `${collectionId}.json`), { required: false });
  let col = null;
  if (raw) {
    const items = Array.isArray(raw.items) ? raw.items : Array.isArray(raw) ? raw : [];
    const schema = raw.schema || raw.collection || {};
    const fields = Array.isArray(schema.fields) ? schema.fields : Array.isArray(raw.fields) ? raw.fields : [];
    col = { schema, fields, items, slug: schema.slug || raw.slug || null };
  }
  cache.set(collectionId, col);
  return col;
}

// ---------- html helpers ----------

const VOID = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'wbr']);

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

function classFromSelector(selector) {
  // ".checkbox_toggle.on-accent-tertiary" -> "on-accent-tertiary"; ".foo" -> "foo"
  const parts = selector.split('.').filter(Boolean);
  const last = parts.length ? parts[parts.length - 1] : selector.replace(/^\./, '');
  // Webflow stores its built-in classes on a combo as "_w-input"; the live CSS uses ".w-input".
  return last.replace(/^_(w-)/, '$1');
}

function openTag(tag, attrs) {
  const keys = Object.keys(attrs);
  let s = `<${tag}`;
  for (const k of keys) {
    const v = attrs[k];
    if (v === null || v === undefined || v === false) continue;
    if (v === true) s += ` ${k}`;
    else s += ` ${k}="${escAttr(v)}"`;
  }
  return s + '>';
}

function wrap(tag, attrs, inner) {
  if (VOID.has(tag)) return openTag(tag, attrs);
  return `${openTag(tag, attrs)}${inner}</${tag}>`;
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
    };
    this._classSet = new Set();
    this._unsupported = new Set();
  }

  noteClass(c) {
    if (!this._classSet.has(c)) {
      this._classSet.add(c);
      this.meta.classesUsed.push(c);
    }
  }

  // ctx: { settings, rawSettings, props, depth, stack, cmsItem }
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

    if (type === 'String') {
      const binding = this.textBinding(raw);
      let text = node.textContent == null ? '' : String(node.textContent);
      if (binding) {
        const sample = this.cmsValue(binding, ctx);
        if (typeof sample === 'string') text = sample;
      }
      if (text) this.meta.strings.push(text);
      return esc(text);
    }

    if (type === 'ComponentInstance') return this.renderComponentInstance(node, ctx);

    const attrs = this.baseAttrs(node, resolved);
    const children = () => this.renderChildren(node, ctx);

    switch (type) {
      case 'Body':
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
        const tag = settings.tag || (settings.dom && settings.dom.tag) || (settings.block && settings.block.tag) || 'div';
        if (type === 'Container') this.addClass(attrs, 'w-container');
        return wrap(tag, attrs, children());
      }
      case 'Heading': {
        const level = Number(settings.headingLevel) || Number(String(settings.tag || '').replace(/^h/, '')) || 2;
        return wrap(`h${Math.min(6, Math.max(1, level))}`, attrs, this.renderTextChildren(node, ctx, raw, 'text'));
      }
      case 'Paragraph':
        return wrap('p', attrs, this.renderTextChildren(node, ctx, raw, 'text'));
      case 'Span':
        return wrap('span', attrs, this.renderTextChildren(node, ctx, raw, 'text'));
      case 'Emphasized':
        return wrap('em', attrs, children());
      case 'Strong':
        return wrap('strong', attrs, children());
      case 'Blockquote':
        return wrap('blockquote', attrs, this.renderTextChildren(node, ctx, raw, 'text'));
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
        const href = this.resolveHref(node, resolved, raw, ctx);
        if (href !== null) attrs.href = href;
        if (settings.link && settings.link.openInNewTab) attrs.target = '_blank';
        if (!('href' in attrs) && !resolved && (type === 'LinkBlock' || type === 'Link')) attrs['data-wf-missing'] = 'link';
        return wrap('a', attrs, this.renderTextChildren(node, ctx, raw, 'text'));
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
        if (binding) {
          const slug = this.fieldSlug(binding, ctx);
          attrs['data-cms-field'] = slug;
          this.meta.cmsBound.push(`${type}:${slug}`);
          const sample = this.cmsValue(binding, ctx);
          if (typeof sample === 'string') return wrap('div', attrs, sample);
        }
        return wrap('div', attrs, children());
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
        return wrap('label', attrs, children());
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
        return wrap('label', attrs, children());
      case 'FormCheckboxInput': {
        this.addClass(attrs, 'w-checkbox-input');
        this.inputAttrs(attrs, node, resolved, 'checkbox');
        attrs.type = 'checkbox';
        if (!resolved) attrs['data-wf-missing'] = 'settings';
        return wrap('input', attrs, '');
      }
      case 'FormRadioWrapper':
        this.addClass(attrs, 'w-radio');
        return wrap('label', attrs, children());
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
      case 'DynamoWrapper':
        this.addClass(attrs, 'w-dyn-list');
        return wrap('div', attrs, children());
      case 'DynamoList': {
        this.addClass(attrs, 'w-dyn-items');
        attrs.role = 'list';
        const binding = this.listBinding(raw) || this.listBinding(ctx.rawSettings[this.parentId(node, ctx)]);
        const col = binding ? loadCollection(this.sharedDir, binding.collectionId, this.collectionCache) : null;
        if (binding) attrs['data-cms-collection'] = binding.collectionId;
        const items = col && col.items.length ? col.items : [null];
        let out = '';
        for (const item of items) {
          out += this.renderChildren(node, { ...ctx, cmsItem: item, cmsCollection: col });
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
        const kind = (settings.icon && (settings.icon.name || settings.icon)) || (resolved && resolved.icon) || 'icon';
        this.addClass(attrs, `w-icon-${slugify(String(kind))}`);
        return wrap('div', attrs, children());
      }
      default: {
        this._unsupported.add(type);
        attrs['data-wf-type'] = type;
        return wrap('div', attrs, children());
      }
    }
  }

  renderChildren(node, ctx) {
    const kids = node.children;
    if (kids == null) return '';
    if (!Array.isArray(kids)) fail(`node ${node.id && node.id.element}: children is not an array`);
    let out = '';
    for (const c of kids) out += this.render(c, ctx);
    return out;
  }

  // For Heading/Paragraph/Span/Link: a textContent binding on the element itself
  // replaces the String children with the sample value.
  renderTextChildren(node, ctx, raw, key) {
    const binding = raw && this.bindingOf(raw[key]);
    if (!binding) return this.renderChildren(node, ctx);
    const sample = this.cmsValue(binding, ctx);
    if (typeof sample === 'string') {
      this.meta.strings.push(sample);
      return esc(sample);
    }
    return this.renderChildren(node, ctx);
  }

  parentId() {
    return '';
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
      push(hit ? classFromSelector(hit.selector) : String(name).toLowerCase().replace(/\s+/g, '-'));
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

  baseAttrs(node, resolved) {
    const attrs = {};
    const classes = this.classList(node);
    if (classes.length) {
      attrs.class = classes.join(' ');
      for (const c of classes) this.noteClass(c);
    }
    const src = node.attributes || {};
    for (const [k, v] of Object.entries(src)) {
      if (k === 'class') continue;
      attrs[k] = v == null ? '' : String(v);
    }
    // Resolved "attributes" (array of {name,value}) completes the picture.
    if (resolved && Array.isArray(resolved.attributes)) {
      for (const a of resolved.attributes) {
        if (!a || typeof a.name !== 'string' || a.name === 'class') continue;
        if (!(a.name in attrs)) attrs[a.name] = a.value == null ? '' : String(a.value);
      }
    }
    const domId = (node.settings && node.settings.domId) || (resolved && resolved.domId);
    if (typeof domId === 'string' && domId.trim()) attrs.id = domId.trim();
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

  resolveHref(node, resolved, raw, ctx) {
    const link = node.settings && node.settings.link;
    const bound = raw && this.bindingOf(raw.link || raw.href || raw.url);
    if (bound) {
      const sample = this.cmsValue(bound, ctx);
      if (typeof sample === 'string' && sample) return sample;
    }
    if (link && typeof link === 'object') {
      const mode = link.linkType || link.mode;
      switch (mode) {
        case 'url':
        case 'email':
        case 'phone':
          return link.href ?? link.url ?? link.to ?? '';
        case 'page': {
          const pid = link.pageId || link.to || link.href;
          const row = this.pagesById.get(pid);
          if (!row) return pid ? `/${pid}` : '#';
          return row.slug === 'index' ? '/' : `/${row.slug}`;
        }
        case 'pageSection': {
          const target = link.domId || link.sectionId || (link.to && typeof link.to === 'string' ? link.to : '');
          return `#${target}`;
        }
        case 'file': {
          const asset = this.assets.get(link.assetId || link.to || link.href);
          return asset && asset.hostedUrl ? asset.hostedUrl : '#';
        }
        case 'collectionPage':
          return `/${link.collectionSlug || link.to || ''}/`;
        default:
          if (typeof link.href === 'string') return link.href;
      }
    }
    if (node.attributes && typeof node.attributes.href === 'string') return node.attributes.href;
    return null;
  }

  // ----- images -----

  renderImage(node, attrs, resolved, raw, ctx) {
    const s = node.settings || {};
    let assetId = (resolved && resolved.assetId) ?? s.assetId ?? null;
    let alt = (resolved && resolved.altText) ?? s.altText ?? '';
    const binding = raw && this.bindingOf(raw.assetId);
    if (binding) {
      const slug = this.fieldSlug(binding, ctx);
      attrs['data-cms-field'] = slug;
      this.meta.cmsBound.push(`Image:${slug}`);
      const sample = this.cmsValue(binding, ctx);
      if (sample && typeof sample === 'object') {
        if (sample.url) attrs.src = sample.url;
        if (sample.alt && (alt === 'inherit' || !alt)) alt = sample.alt;
      } else if (typeof sample === 'string' && sample) {
        attrs.src = sample;
      }
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
    return wrap('img', attrs, '');
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

  // ----- CMS bindings -----

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

  listBinding(raw) {
    if (!raw) return null;
    for (const v of Object.values(raw)) {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        if (v.sourceType === 'cms' && v.collectionId) return v;
        if (v.collectionId && !v.sourceType) return { sourceType: 'cms', collectionId: v.collectionId };
      }
    }
    return null;
  }

  fieldSlug(binding, ctx) {
    const col = loadCollection(this.sharedDir, binding.collectionId, this.collectionCache) || ctx.cmsCollection;
    if (col) {
      const f = col.fields.find((x) => x && (x.id === binding.fieldId || x.fieldId === binding.fieldId));
      if (f && (f.slug || f.key)) return f.slug || f.key;
    }
    return slugify(binding.fieldName || binding.fieldId);
  }

  // Returns a string (text, html, url), an object {url, alt} for images, or undefined.
  cmsValue(binding, ctx) {
    if (binding.sourceType === 'prop') {
      const pid = binding.propId || binding.prop_id;
      const p = (ctx.props || []).find((x) => x && (x.id === pid || x.propId === pid || x.name === pid));
      if (p && typeof p.value === 'string') return p.value;
      return undefined;
    }
    const col = loadCollection(this.sharedDir, binding.collectionId, this.collectionCache);
    const item = ctx.cmsItem && ctx.cmsCollection && ctx.cmsCollection === col ? ctx.cmsItem : col && col.items[0];
    if (!item) return undefined;
    const slug = this.fieldSlug(binding, ctx);
    const data = item.fieldData || item.fields || item;
    let v = data[slug];
    if (v === undefined && binding.fieldName) v = data[binding.fieldName];
    if (v === undefined) v = data[binding.fieldId];
    if (v === null || v === undefined) return undefined;
    if (typeof v === 'object') {
      if (v.url) return { url: v.url, alt: v.alt || '' };
      if (v.hostedUrl) return { url: v.hostedUrl, alt: v.alt || '' };
      return undefined;
    }
    return String(v);
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
    const sub = {
      settings: def.settings,
      rawSettings: def.rawSettings,
      props: Array.isArray(det.props) ? det.props : [],
      stack: [...stack, id],
      cmsItem: ctx.cmsItem,
      cmsCollection: ctx.cmsCollection,
    };
    const html = this.render(def.tree, sub);
    return `<!-- component: ${esc(name)} --> ${html} <!-- /component: ${esc(name)} -->`;
  }

  finish() {
    this.meta.unsupportedTypes = [...this._unsupported].sort();
    return this.meta;
  }
}

// ---------- document assembly ----------

function buildDocument({ page, headCode, footerCode, siteHead, siteFooter, bodyHtml }) {
  const seo = (page && page.seo) || {};
  const title = seo.title || (page && page.title) || (page && page.slug) || 'Untitled';
  const desc = seo.description || '';
  const lines = [];
  lines.push('<!doctype html>');
  lines.push('<html lang="en">');
  lines.push('<head>');
  lines.push('<meta charset="utf-8">');
  lines.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
  lines.push(`<title>${esc(title)}</title>`);
  if (desc) lines.push(`<meta name="description" content="${escAttr(desc)}">`);
  lines.push('<link rel="stylesheet" href="../css/fonts.css">');
  lines.push('<link rel="stylesheet" href="../css/webflow-base.css">');
  lines.push('<link rel="stylesheet" href="../css/tll-webflow.css">');
  lines.push('<!-- SITE HEAD CODE (Webflow site settings) -->');
  lines.push(siteHead == null ? '<!-- site-head.html not found in shared state -->' : siteHead.trimEnd());
  lines.push('<!-- /SITE HEAD CODE -->');
  lines.push('<!-- PAGE HEAD CODE -->');
  lines.push(headCode == null ? '' : String(headCode).trimEnd());
  lines.push('<!-- /PAGE HEAD CODE -->');
  lines.push('<link rel="stylesheet" href="../css/design-mode.css">');
  lines.push('</head>');
  lines.push('<body class="body">');
  lines.push(bodyHtml);
  lines.push('<!-- SITE FOOTER CODE (Webflow site settings) -->');
  lines.push(siteFooter == null ? '<!-- site-footer.html not found in shared state -->' : siteFooter.trimEnd());
  lines.push('<!-- /SITE FOOTER CODE -->');
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
  const settings = normaliseSettingsMap(readJson(path.join(pageDir, 'settings.json'), { required: false }), 'settings.json');
  const rawSettings = normaliseSettingsMap(readJson(path.join(pageDir, 'raw-settings.json'), { required: false }), 'raw-settings.json');
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

  const bodyHtml = conv.render(root, { settings, rawSettings, props: [], stack: [] });
  const outMeta = conv.finish();

  const html = buildDocument({
    page,
    headCode: meta.headCode,
    footerCode: meta.footerCode,
    siteHead: readText(path.join(sharedDir, 'site-head.html')),
    siteFooter: readText(path.join(sharedDir, 'site-footer.html')),
    bodyHtml,
  });

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
