import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'path'; import url from 'url'; const DIR = path.dirname(url.fileURLToPath(import.meta.url));
const b = await chromium.launch();
for (const [file, w, out] of [['type/specimens.html', 1200, 'type/specimens-1200.png'], ['type/specimens.html', 390, 'type/specimens-390.png'], ['stamp/test.html', 1200, 'stamp/test.png']]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(DIR, file)); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(DIR, out), fullPage: true }); await p.close(); console.log('wrote', out);
}
await b.close();
