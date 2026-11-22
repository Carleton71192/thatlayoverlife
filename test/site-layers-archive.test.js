// Sweep of 21 Nov 2026, item A20: the builds before v16 and the retired layer files live in src/site-layers/archive. Nothing the v16
// build or a test reads may point there, and the folder above keeps only the v16 build and bundle.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '..', 'src', 'site-layers');

describe('src/site-layers/archive (A20)', () => {
  it('holds the old builds and bundles; the folder above keeps only v16', () => {
    const top = readdirSync(dir);
    expect(top.filter((f) => /^build-site-layers-v\d+\.py$/.test(f))).toEqual(['build-site-layers-v16.py']);
    expect(top.filter((f) => /^tll-site-layers-v\d+\.js$/.test(f))).toEqual(['tll-site-layers-v16.js']);
    expect(readdirSync(join(dir, 'archive')).filter((f) => /^(build|tll)-site-layers-v\d+\.(py|js)$/.test(f)).length).toBe(29);
  });
  it('the v16 build reads nothing from the archive, and every file it names exists', () => {
    const b = readFileSync(join(dir, 'build-site-layers-v16.py'), 'utf8');
    expect(b).not.toContain('archive/');
    for (const m of b.matchAll(/'(src\/site-layers\/[^']+\.(?:js|html))'/g)) expect(existsSync(join(here, '..', m[1])), m[1]).toBe(true);
  });
  it('no test reads an archived file', () => {
    for (const f of readdirSync(here).filter((x) => x.endsWith('.js') && x !== 'site-layers-archive.test.js')) {
      const s = readFileSync(join(here, f), 'utf8');
      expect(/tll-site-layers-v(?:[1-9]|1[0-5])\.js|build-site-layers-v(?:[2-9]|1[0-5])\.py|tllflagsv(?:4|5|51|52)\.js/.test(s), f).toBe(false);
    }
  });
});
