#!/usr/bin/env node
// styles2css.mjs: turn the Webflow style dump into one plain stylesheet for the export bundle.
//
// Inputs (read only):
//   reports/evidence/webflow-export-2026-10-13/state/styles/styles-full.json  (base, pseudo and breakpoint layers)
//   reports/evidence/webflow-export-2026-10-13/state/styles/styles-base.json  (fallback for any style missing above)
//   reports/evidence/webflow-export-2026-10-13/state/styles/variables.json    (collections, modes, css names)
// Output:
//   handoff/claude-design-source/webflow-export-2026-10-13/css/tll-webflow.css
//
// Node 22, no dependencies. Usage: node scripts/export/styles2css.mjs [--out <file>] [--quiet]
//
// Cascade: rules are grouped the way Webflow publishes them, so wider breakpoints override base
// and narrower ones override wider: base (with pseudo states), then @media (min-width:1280px) large,
// (min-width:1440px) xl, (min-width:1920px) xxl, then (max-width:991px) medium, (max-width:767px) small,
// (max-width:479px) tiny. Inside each group: tag styles, then global classes, then combos.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const STATE = resolve(ROOT, 'reports/evidence/webflow-export-2026-10-13/state/styles');
const args = process.argv.slice(2);
const outArg = args.indexOf('--out');
const OUT = outArg >= 0 ? resolve(args[outArg + 1])
  : resolve(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css/tll-webflow.css');
const QUIET = args.includes('--quiet');

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const full = readJson(resolve(STATE, 'styles-full.json'));
const base = readJson(resolve(STATE, 'styles-base.json'));
const vars = readJson(resolve(STATE, 'variables.json'));

// ---------- styles: full first, base as fallback ----------
const byId = new Map();
for (const s of full) byId.set(s.id, s);
let fallbackCount = 0;
for (const s of base) if (!byId.has(s.id)) { byId.set(s.id, s); fallbackCount++; }
const baseIds = new Set(base.map((s) => s.id));
const order = base.map((s) => s.id).concat(full.filter((s) => !baseIds.has(s.id)).map((s) => s.id));
const styles = [...new Set(order)].map((id) => byId.get(id)).filter(Boolean);

// ---------- variables ----------
const varById = new Map();
const collById = new Map();
for (const c of vars.collections || []) {
  collById.set(c.id, c);
  for (const v of c.variables || []) varById.set(v.id, { ...v, collectionId: c.id });
}
const missingVars = new Set();
const varRef = (id) => {
  const v = varById.get(id);
  if (!v) { missingVars.add(id); return `var(--missing-${id})`; }
  return `var(${v.cssName})`;
};
function varValue(v, raw) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'string') return raw.trim();
  if (typeof raw === 'number') return v.type === 'Percentage' ? `${raw}%` : String(raw);
  if (typeof raw === 'object') {
    if (raw.id) return varRef(raw.id);
    if (raw.type === 'custom') return String(raw.value).trim();
    if ('unit' in raw && 'value' in raw) return `${raw.value}${raw.unit}`;
  }
  return null;
}
const modeValue = (v, modeId) => {
  const m = (v.modeValues || []).find((x) => x.modeId === modeId);
  return m ? varValue(v, m.value) : null;
};
// Declarations for one collection in one mode (used for ---mode-- properties and [data-wf-mode] blocks).
function modeDecls(collectionId, modeId) {
  const c = collById.get(collectionId);
  if (!c) return [`/* unknown collection ${collectionId} */`];
  const out = [];
  for (const v of c.variables || []) {
    const val = modeValue(v, modeId);
    if (val !== null && val !== '') out.push(`${v.cssName}: ${val};`);
  }
  return out;
}

// ---------- values and declarations ----------
const skipped = [];
function isUnsafe(val) {
  const dq = (val.match(/"/g) || []).length;
  const sq = (val.match(/'/g) || []).length;
  return dq % 2 === 1 || sq % 2 === 1 || /[{};]/.test(val.replace(/\/\*[\s\S]*?\*\//g, ''));
}
function renderValue(raw) {
  if (typeof raw === 'string') return raw.trim();
  if (typeof raw === 'number') return String(raw);
  if (raw && typeof raw === 'object' && raw.id) return varRef(raw.id);
  if (raw && typeof raw === 'object' && raw.type === 'custom') return String(raw.value).trim();
  if (raw && typeof raw === 'object' && 'unit' in raw) return `${raw.value}${raw.unit}`;
  return null;
}
function decls(props, style, where) {
  const out = [];
  for (const [prop, raw] of Object.entries(props || {})) {
    if (prop.startsWith('---mode--')) {
      const collectionId = prop.slice('---mode--'.length);
      const c = collById.get(collectionId);
      const modeName = c?.modes?.find((m) => m.id === raw)?.name ?? raw;
      out.push(`/* variable mode: ${c?.name ?? collectionId} = ${modeName} */`);
      out.push(...modeDecls(collectionId, raw));
      continue;
    }
    const val = renderValue(raw);
    if (val === null || val === '') continue;
    if (isUnsafe(val)) {
      skipped.push({ id: style.id, selector: style.selector, where, prop, value: val });
      out.push(`/* skipped, unbalanced value in source data: ${prop}: ${val.replace(/\*\//g, '* /')} */`);
      continue;
    }
    out.push(`${prop}: ${val};`);
  }
  return out;
}

const PSEUDO_ELEMENTS = new Set(['before', 'after', 'placeholder']);
const pseudoSelector = (sel, p) =>
  sel.split(',').map((part) => `${part.trim()}${PSEUDO_ELEMENTS.has(p) ? '::' : ':'}${p}`).join(', ');

// Breakpoint groups in emission (cascade) order.
const GROUPS = [
  { key: 'base', media: null },
  { key: 'large', media: '@media screen and (min-width: 1280px)' },
  { key: 'xl', media: '@media screen and (min-width: 1440px)' },
  { key: 'xxl', media: '@media screen and (min-width: 1920px)' },
  { key: 'medium', media: '@media screen and (max-width: 991px)' },
  { key: 'small', media: '@media screen and (max-width: 767px)' },
  { key: 'tiny', media: '@media screen and (max-width: 479px)' },
];
const PSEUDO_ORDER = ['hover', 'active', 'focus', 'focus-visible', 'focus-within', 'visited', 'placeholder',
  'before', 'after', 'first-child', 'last-child', 'nth-child(odd)', 'nth-child(even)', 'empty'];
const sortPseudos = (obj) => Object.keys(obj || {}).sort((a, b) =>
  (PSEUDO_ORDER.indexOf(a) + 1 || 99) - (PSEUDO_ORDER.indexOf(b) + 1 || 99));

// Sort: tags (plain tag selectors before descendant ones), globals, combos (shorter chains first).
const typeRank = { tag: 0, global: 1, combo: 2 };
const comboDepth = (s) => (s.selector.match(/\./g) || []).length;
const indexed = styles.map((s, i) => ({ s, i }));
indexed.sort((a, b) => {
  const ta = typeRank[a.s.type] ?? 1, tb = typeRank[b.s.type] ?? 1;
  if (ta !== tb) return ta - tb;
  if (a.s.type === 'tag') {
    const da = a.s.selector.includes(' ') ? 1 : 0, db = b.s.selector.includes(' ') ? 1 : 0;
    if (da !== db) return da - db;
  }
  if (a.s.type === 'combo') { const d = comboDepth(a.s) - comboDepth(b.s); if (d) return d; }
  return a.i - b.i;
});
const sorted = indexed.map((x) => x.s);

const stats = { rules: 0, styles: { tag: 0, global: 0, combo: 0 }, emptySkipped: 0, pseudos: new Set(), breakpoints: new Set() };
const rule = (sel, lines, indent = '') => {
  if (!lines.length) { stats.emptySkipped++; return ''; }
  stats.rules++;
  return `${indent}${sel} {\n${lines.map((l) => `${indent}  ${l}`).join('\n')}\n${indent}}\n`;
};

const groupText = {};
for (const g of GROUPS) {
  let txt = '';
  const indent = g.media ? '  ' : '';
  for (const s of sorted) {
    const P = s.properties || {};
    const layer = g.key === 'base' ? P.base : P.breakpoints?.[g.key];
    if (!layer) continue;
    const r = rule(s.selector, decls(layer.properties, s, g.key), indent);
    if (r) { txt += r; if (g.key !== 'base') stats.breakpoints.add(g.key); }
    for (const p of sortPseudos(layer.pseudos)) {
      const pr = rule(pseudoSelector(s.selector, p), decls(layer.pseudos[p], s, `${g.key}:${p}`), indent);
      if (pr) { txt += pr; stats.pseudos.add(g.key === 'base' ? p : `${g.key}:${p}`); if (g.key !== 'base') stats.breakpoints.add(g.key); }
    }
  }
  groupText[g.key] = txt;
}
for (const s of styles) stats.styles[s.type] = (stats.styles[s.type] || 0) + 1;

// ---------- :root and extra modes ----------
let rootLines = [];
const modeBlocks = [];
let varCount = 0;
for (const c of vars.collections || []) {
  if (!(c.variables || []).length) continue;
  rootLines.push(`/* ${c.name} */`);
  const defaultMode = c.modes?.[0]?.id ?? 'base';
  for (const v of c.variables) {
    const val = modeValue(v, defaultMode) ?? varValue(v, v.value);
    if (val === null || val === '') continue;
    rootLines.push(`${v.cssName}: ${val};`);
    varCount++;
  }
  for (const m of (c.modes || []).slice(1)) {
    const lines = modeDecls(c.id, m.id);
    if (lines.length) modeBlocks.push(`/* ${c.name}: ${m.name} */\n` + rule(`[data-wf-mode~="${m.id}"]`, lines));
  }
}
const rootBlock = rule(':root', rootLines);

// ---------- write ----------
const total = styles.length;
const header = `/*
 * tll-webflow.css
 * That Layover Life, Webflow site 69d6145cf421c777840c1e25.
 * Generated 13 October 2026 by scripts/export/styles2css.mjs from the Webflow Data API style dump
 * (reports/evidence/webflow-export-2026-10-13/state/styles/styles-full.json, with styles-base.json as fallback)
 * and variables.json. Read-only export for design review; this is not the stylesheet Webflow publishes.
 *
 * Classes: ${total} styles (${stats.styles.tag} tag, ${stats.styles.global} global, ${stats.styles.combo} combo).
 * Variables: ${varCount} declared on :root with their default-mode values; extra modes as [data-wf-mode~="<mode id>"] blocks.
 * Variable modes that a style applies (for example body at tablet and mobile) are written as variable overrides inside that rule.
 * Values are copied verbatim; variable references become var(--name). Empty blocks are left out.
 * Order: base and pseudo states, then min-width 1280, 1440, 1920, then max-width 991, 767, 479.
 * Load after webflow-base.css and fonts.css.
 */
`;
let css = header + '\n' + rootBlock + '\n' + modeBlocks.join('\n') + '\n';
css += '/* ===== Base breakpoint (desktop) with pseudo states ===== */\n' + groupText.base;
for (const g of GROUPS.slice(1)) {
  if (!groupText[g.key]) continue;
  css += `\n/* ===== ${g.key} ===== */\n${g.media} {\n${groupText[g.key]}}\n`;
}
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, css);

const summary = {
  out: OUT, styles: total, byType: stats.styles, fallbackFromBase: fallbackCount, rules: stats.rules,
  variables: varCount, extraModeBlocks: modeBlocks.length, breakpoints: [...stats.breakpoints],
  pseudos: [...stats.pseudos], emptySkipped: stats.emptySkipped, missingVariables: [...missingVars], skippedValues: skipped,
  bytes: Buffer.byteLength(css),
};
if (!QUIET) console.log(JSON.stringify(summary, null, 2));
