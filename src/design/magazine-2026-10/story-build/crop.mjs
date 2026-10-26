import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url'; const DIR = path.dirname(url.fileURLToPath(import.meta.url));
const b = await chromium.launch();
for (const [w, h, name] of [[1280, 1000, 'after-head-1280'], [390, 1400, 'after-head-390']]) {
  const img = await (await import('fs')).promises.readFile(path.join(DIR, 'shots', `spain-madrid-wedding-ibiza-after-${w}.png`));
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.setContent(`<body style="margin:0"><img src="data:image/png;base64,${img.toString('base64')}" style="width:${w}px;display:block"></body>`);
  await p.screenshot({ path: path.join(DIR, 'shots', name + '.png'), clip: { x: 0, y: 0, width: w, height: h } }); await p.close();
}
await b.close(); console.log('cropped');
