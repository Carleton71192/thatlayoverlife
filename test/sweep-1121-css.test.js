// Sweep of 21 Nov 2026 (reports/evidence/sweep-2026-11-21/fix.md): the CSS fixes that live in the core styles. Each rule is read from
// its source and from the built core, so a rebuild that drops one fails here; where a fix is about contrast, the ratio of the colors
// it sets is checked against WCAG AA.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (...p) => readFileSync(join(here, '..', ...p), 'utf8');
const core = read('src', 'site-layers', 'tll-site-layers-v16.js');
// The core carries each style as a JSON string, so a rule is looked for as it is written inside that string.
const inCore = (rule) => core.includes(JSON.stringify(rule).slice(1, -1));
function lum(hex) {
  const c = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

describe('A03 .tll-cta-ghost-dark joins the outlined buttons in ink', () => {
  const src = read('src', 'site-layers', 'tll-buttons-v1.html');
  const RULE = 'html body a.tll-cta-ghost-dark{color:#0A0B14 !important;border-color:#0A0B14 !important}';
  it('the button set lists it in the base, outlined and hover rules, and inks it', () => {
    expect(src).toContain(RULE);
    expect(src).toContain('html body .tll-cta-ghost,html body a.tll-cta-ghost-dark,html body .tllsb-btn');
    expect(src).toContain('html body .tll-cta-ghost,html body a.tll-cta-ghost-dark,html body .tll-place-btn,');
    expect(src).toContain('html body a.tll-cta-ghost-dark:hover,');
    expect(inCore(RULE)).toBe(true);
  });
  it('ink on both light cards passes AA (it was cream on teal, 2.59:1)', () => {
    expect(ratio('#F7F1E8', '#00A9A4')).toBeLessThan(3);
    expect(ratio('#0A0B14', '#EFEAE1')).toBeGreaterThan(4.5);
    expect(ratio('#0A0B14', '#F7F4EE')).toBeGreaterThan(4.5);
  });
});

const sweep = read('src', 'site-layers', 'tll-sweep-1121-v1.html');
const rule = (r) => { expect(sweep).toContain(r); expect(inCore(r)).toBe(true); };

describe('tll-sweep-1121-v1 is a core style', () => {
  it('the build lists it after the focus ring and the core injects it', () => {
    const b = read('src', 'site-layers', 'build-site-layers-v16.py');
    expect(b.indexOf("'tll-sweep-1121-v1'")).toBeGreaterThan(b.indexOf("'tll-focus-v1'"));
    expect(core).toContain('["tll-sweep-1121-v1",');
  });
  it('touches no data-ms-* element', () => { expect(/data-ms-[\w-]+\s*[\]=]/.test(sweep.replace(/\/\*[\s\S]*?\*\//g, ''))).toBe(false); });
});

describe('A02 /support email heading fits at 390', () => {
  it('under 480px the em is 28px and may break anywhere', () => {
    rule('@media (max-width:479px){html body .tll-support-direct-title em{font-size:28px;overflow-wrap:anywhere}}');
  });
});

describe('A04 closing headings on /stories and /contact', () => {
  it('a size floor of 26px (32px, the desktop size, at most) on both', () => {
    rule('html body .tll-library-newsletter h3,html body .tll-contact-faq-card h3{font-size:clamp(26px,6vw,32px)}');
  });
  it('the /stories rose word takes the AA rose, outweighing the page rule html.tllp-stories .tll-library-newsletter h3 em (also !important)', () => {
    rule('html.tllp-stories body .tll-library-newsletter h3 em{color:var(--s3-rose-t,#C8325B) !important}');
    expect(ratio('#F0507A', '#F8F2E6')).toBeLessThan(3.1);
    expect(ratio('#C8325B', '#F8F2E6')).toBeGreaterThan(4.5);
  });
});

describe('A05 /about lower half: the buttons join the set, the cite and the list in Plex Condensed', () => {
  const src = read('src', 'site-layers', 'tll-buttons-v1.html');
  it('the filled one is rose, the other two outlined, all in the base rule', () => {
    expect(src).toContain('html body .tll-place-btn,html body a.tll-about-final-button,html body a.tll-about-final-button-secondary,html body a.tll-about-final-button-light{display:inline-flex');
    expect(src).toContain('html body a.tll-about-final-button{background:#D63859');
    expect(src).toContain('html body a.tll-about-final-button-secondary,html body a.tll-about-final-button-light{background:transparent');
  });
  it('the cite and the list items get the loaded face (they asked for IBM Plex Sans, never loaded)', () => {
    expect(src).toContain("html body .tll-about-final-cite,html body .tll-about-final-li{font-family:'IBM Plex Sans Condensed',system-ui,sans-serif}");
    expect(inCore("html body .tll-about-final-cite,html body .tll-about-final-li{font-family:'IBM Plex Sans Condensed',TLLSansA,TLLSansR,system-ui,sans-serif}")).toBe(true);
  });
});

describe('A06 /submit and /my-pets form text reaches AA (scoped: /share-photos page code already passes)', () => {
  const P = 'html:is([data-wf-page="6a0d5e5eb7804d3a750dc266"],[data-wf-page="6a0df9ffc4a846ee4db92b63"]) body';
  const mix = (fg, bg, a) => '#' + fg.slice(1).match(/../g).map((x, i) => Math.round(parseInt(x, 16) * a + parseInt(bg.slice(1 + i * 2, 3 + i * 2), 16) * (1 - a)).toString(16).padStart(2, '0')).join('');
  it('help text, help and status: ink at 72%, weight 400, upright', () => {
    rule(`${P} .tll-pen-helptext,${P} .tll-pen-help,${P} .tll-pen-status{color:rgba(13,15,26,.72);font-weight:400;font-style:normal}`);
    for (const bg of ['#FDF9F3', '#FFFFFF', '#F7F1E8']) {
      expect(ratio(mix('#0D0F1A', bg, 0.5), bg)).toBeLessThan(4.5);
      expect(ratio(mix('#0D0F1A', bg, 0.72), bg)).toBeGreaterThan(7);
    }
  });
  it('legend in the AA rose, labels 13.5px, placeholders #6B6660 (over the page rule, also !important)', () => {
    rule(`${P} .tll-pen-legend{color:#C8325B}`);
    rule(`${P} .tll-pen-label{font-size:13.5px;letter-spacing:.04em}`);
    rule(`${P} ::placeholder{color:#6B6660 !important}`);
    expect(ratio('#C8325B', '#F7F1E8')).toBeGreaterThan(4.5);
    expect(ratio('#6B6660', '#F7F1E8')).toBeGreaterThan(4.5);
    expect(ratio('#8B857C', '#FDF9F3')).toBeLessThan(4.5);
  });
  it('keys on the two page ids only, so /share-photos keeps its own teal legends', () => {
    const block = sweep.split('/* A06')[1].split('/* ')[0];
    expect(block).not.toContain('6a0dfca3f9fa5b751d154257');
    expect(block.match(/data-wf-page/g).length).toBe(12);
  });
});
