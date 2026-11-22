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
