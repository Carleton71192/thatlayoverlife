// tools/page-code-from-html.py (sweep of 21 Nov 2026, item A21): splits a page's own head and footer code out of its published HTML,
// between the saved site head and footer and the registered scripts. Run here on a page built from the saved site code, so the test
// needs no network and no cache.
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const site = (f) => readFileSync(join(root, 'src', 'site', 'live-2026-11-13', 'fonts', f), 'utf8');
const REG = '<script src="https://cdn.prod.website-files.com/x%2Fy%2Fz%2Ftllreveal-1.2.1.js" type="text/javascript"></script>';
const page = (head, foot) => `<!DOCTYPE html><html><head><meta charset="utf-8">${site('site-head.after.html')}${head}${REG}</head><body><main>x</main>`
  + `<script src="jquery.js"></script>${site('site-footer.after.html')}${foot}${REG}${REG}</body></html>`;
function run(name, html, save) {
  const d = mkdtempSync(join(tmpdir(), 'pc-')); const f = join(d, name + '.html'); writeFileSync(f, html);
  let out; try { out = execFileSync('python3', [join(root, 'tools', 'page-code-from-html.py'), ...(save ? ['--save', join(d, 'out')] : []), f], { encoding: 'utf8' }); } catch (e) { out = e.stdout; }
  return { out, d };
}

describe('tools/page-code-from-html.py (A21)', () => {
  it('keeps the page head and footer code and lists the registered scripts apart', () => {
    const { out, d } = run('about', page('<style id="p">a{}</style>', '<script id="f">1</script>'), true);
    expect(readFileSync(join(d, 'out', 'about', 'page-head.html'), 'utf8')).toBe('<style id="p">a{}</style>\n');
    expect(readFileSync(join(d, 'out', 'about', 'page-footer.html'), 'utf8')).toBe('<script id="f">1</script>\n');
    expect(out).toContain('footer: tllreveal-1.2.1.js, tllreveal-1.2.1.js');
  });
  it('stops when the saved site code is not in the page byte for byte', () => {
    const { out } = run('about', page('', '').replace('<style', '<style data-x'));
    expect(out).toMatch(/not in this HTML exactly once/);
  });
  it('refuses template pages (their code can carry CMS fields with member data)', () => {
    expect(run('stories__some-trip', page('', '')).out).toMatch(/refused: template page/);
    expect(run('profile', page('', '')).out).toMatch(/refused: template page/);
  });
  it('the saved copies of Nov 21 are there', () => {
    for (const p of ['home', 'stories', 'the-map', 'account', 'gallery', 'destinations', 'for-press', 'the-paw-passport']) {
      expect(existsSync(join(root, 'src', 'pages', 'live-2026-11-21', p, 'page-head.html')), p).toBe(true);
    }
  });
});
