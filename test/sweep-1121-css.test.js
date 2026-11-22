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

describe('A13 buttons outside the set join it (404, /submit steps, /the-map, /account export, /for-expats)', () => {
  const src = read('src', 'site-layers', 'tll-buttons-v1.html');
  const B = 'html body .tll404-btn,html body .tllst-nav button.tllst-next,html body .tllst-nav button.tllst-back,html body a.tll-park-cta,html body a.tlllb-cta,html body .tll-exp button,html body a[data-tll-btn],html body a[data-tll-x="finder-go"]';
  it('square, Plex 600, 48px, no capitals', () => {
    expect(src).toContain(B + '{box-sizing:border-box;min-height:48px !important;');
    expect(src).toContain('border-radius:0 !important;border:1.5px solid currentColor !important;');
  });
  it('display is set on links only, so the /submit step buttons keep their own hide rule', () => {
    expect(src).toContain('html body a.tll404-btn,html body a.tll-park-cta,html body a.tlllb-cta,html body a[data-tll-btn],html body a[data-tll-x="finder-go"]{display:inline-flex;');
    expect(src).not.toContain(B + '{display');
  });
  it('one rose fill a group; the 404 second and third buttons outlined in cream, Back and the expats ghost in ink', () => {
    expect(src).toContain('html body .tll404-ctas>.tll404-btn:first-child,html body .tllst-nav button.tllst-next,html body a.tll-park-cta,html body a.tlllb-cta,html body .tll-exp button,html body a[data-tll-btn="rose"],html body a[data-tll-x="finder-go"]{background:#D63859 !important;color:#FFFFFF !important;');
    expect(src).toContain('html body .tll404-ctas>.tll404-btn:not(:first-child){background:transparent !important;color:#F7F1E8 !important;border-color:#F7F1E8 !important}');
    expect(src).toContain('html body .tllst-nav button.tllst-back,html body a[data-tll-btn="ghost"]{background:transparent !important;color:#0A0B14 !important;');
    expect(ratio('#FFFFFF', '#F0507A')).toBeLessThan(3.5);
    expect(ratio('#FFFFFF', '#D63859')).toBeGreaterThan(4.5);
    expect(inCore('html body .tll404-ctas>.tll404-btn:not(:first-child){background:transparent !important;')).toBe(true);
  });
  it('leaves the Memberstack buttons on /login and /signup for class C (C02)', () => {
    expect(src).not.toContain('.tll-btn-google');
  });
});

describe('A10 tap targets reach 44px', () => {
  it('on touch screens the nav pair, the /travelers link chips and the /for-expats country field; Save for later everywhere', () => {
    rule('@media(pointer:coarse){html body .tll-nav-v1 .tll-btn,html body .tll-nav-v1 a.tll-nav-signup,html body .tll-nav-v1 a.tll-nav-pen-cta{min-height:44px !important}html body .tll-trav-linkchips span,html body [data-tll-x="finder-input"]{min-height:44px !important;box-sizing:border-box}}');
    rule('html body .tll-save-btn{min-height:44px !important;box-sizing:border-box}');
  });
  it('comes after the button set, whose compact nav rule (40px, !important) it overrides on touch screens', () => {
    expect(core.indexOf('["tll-sweep-1121-v1",')).toBeGreaterThan(core.indexOf('["tll-buttons-v1",'));
    expect(read('src', 'site-layers', 'tll-buttons-v1.html')).toContain('html body .tll-nav-v1 .tll-btn,html body .tll-nav-v1 a.tll-nav-signup,html body .tll-nav-v1 a.tll-nav-pen-cta{min-height:40px !important;');
  });
});

describe('A09 the Tell the editor pill moves right on /account at 960px and wider', () => {
  it('keyed to the /account page id; the phone round button (under 960px) stays bottom left', () => {
    rule('@media(min-width:960px){html[data-wf-page="6a0d5c23c57426a9c563e8de"] body #tll-note{left:auto;right:calc(16px + env(safe-area-inset-right))}}');
  });
  it('the gate return card (A08) sits above it there', () => {
    expect(read('src', 'site-layers', 'tll-gate-return-v1.js')).toContain('@media(min-width:960px){html[data-wf-page="6a0d5c23c57426a9c563e8de"] .tll-gate-back{bottom:76px}}');
  });
  it('the hide-while-typing rule is already live (tll-note-phone-v1), so nothing else is added', () => {
    expect(read('src', 'site-layers', 'tll-note-phone-v1.html')).toContain('html.tll-typing #tll-note:not([data-open="true"]){display:none !important}');
  });
});

describe('A14 mono text under 12px lifted to the floor', () => {
  const block = sweep.split('/* A14')[1].split('\n')[1];
  it('one rule, 12px, with an id in its weight so it outweighs the page rules that set 10 to 11px with !important', () => {
    expect(block).toMatch(/^html body :is\(.+\):not\(#tll-mono-12\)\{font-size:12px !important\}$/);
    expect(inCore(block)).toBe(true);
  });
  it('names the measured classes on /stories, /the-map, /account, profiles and the eyebrow pages', () => {
    for (const c of ['.tll-lib-meta', '.tll-lib-read', '.tllm-card-label', '.tllm-cell-l', '[data-tll-wr=stats] dt', '[data-tll-wr=sheet] li small', '.tll-alb-tape b', '.tll-lounge-credit', '.tll404-eyebrow', '.tllpr-eyebrow']) expect(block).toContain(c);
  });
  it('reaches no SVG text (map and stamp labels are drawn to size) and no prose class', () => {
    expect(/\b(text|tspan|textPath|svg)\b/.test(block)).toBe(false);
  });
});

describe('A15 profile album tape: the photos and countries line wraps inside its tape', () => {
  const src = read('src', 'site-layers', 'tll-album-v1.js');
  it('small wraps and no longer asks for 9px; the continent name stays on one line', () => {
    expect(src).toContain('.tll-alb-tape small{white-space:normal;font-weight:500;');
    expect(src).not.toContain('.tll-alb-tape small{font-size:9px');
    expect(src).toContain('.tll-alb-tape b,.tll-alb-tape small{display:block;white-space:nowrap}');
  });
  it('the profile and pets chunks carry it', () => {
    for (const c of ['profile', 'pets']) expect(read('src', 'site-layers', 'chunks', `${c}.js`)).toContain('.tll-alb-tape small{white-space:normal;');
  });
});

describe('A17 /the-map sample banner in the loaded face', () => {
  it('outweighs the inline font shorthand the map script sets, and the mono label keeps its own inline face', () => {
    expect(sweep).toContain("html body #tllm-sample{font-family:'IBM Plex Sans Condensed',system-ui,sans-serif !important}");
    expect(inCore("html body #tllm-sample{font-family:'IBM Plex Sans Condensed',TLLSansA,TLLSansR,system-ui,sans-serif !important}")).toBe(true);
    expect(read('map-2.0', 'dist', 'tll-map-layers.js')).toContain('font:400 15px/1.5 "IBM Plex Sans",system-ui,sans-serif');
  });
  it('the A14 floor reaches only the SAMPLE MAP label (the first span), not the 15px line beside it', () => {
    expect(sweep).toContain(',#tllm-sample>span:first-child,');
    expect(sweep).not.toContain('#tllm-sample span');
    expect(read('map-2.0', 'dist', 'tll-map-layers.js')).toContain('b.appendChild(k); b.appendChild(t);');
  });
});
