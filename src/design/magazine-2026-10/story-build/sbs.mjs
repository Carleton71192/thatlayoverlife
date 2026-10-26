import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url'; const DIR = path.dirname(url.fileURLToPath(import.meta.url));
const b = await chromium.launch();
for (const [w, crop, s] of [[1280, 2200, .5], [390, 2600, .5]]) {
  const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(DIR, 'shots', f)).toString('base64');
  const html = `<body style="margin:0;background:#1a1c2c;padding:24px;display:flex;gap:24px;align-items:flex-start;font:500 14px system-ui;color:#F7F1E8">
  <div><p style="margin:0 0 8px">Live today (stand-in)</p><div style="width:${w*s}px;height:${crop*s}px;overflow:hidden;border-radius:8px"><img src="${img(`spain-madrid-wedding-ibiza-before-${w}.png`)}" style="width:${w*s}px"></div></div>
  <div><p style="margin:0 0 8px">With the magazine layer</p><div style="width:${w*s}px;height:${crop*s}px;overflow:hidden;border-radius:8px"><img src="${img(`spain-madrid-wedding-ibiza-after-${w}.png`)}" style="width:${w*s}px"></div></div></body>`;
  const p = await b.newPage({ viewport: { width: Math.round(w*s*2+72), height: Math.round(crop*s+80) }, deviceScaleFactor: 2 });
  await p.setContent(html); await p.waitForTimeout(400); await p.screenshot({ path: path.join(DIR, 'shots', `before-after-${w}.png`) }); await p.close();
}
await b.close(); console.log('done');
