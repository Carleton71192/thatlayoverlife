// Before and after, side by side, at desktop (top 1600px) and phone (top 1700px).
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url'; const DIR = path.dirname(url.fileURLToPath(import.meta.url));
const b = await chromium.launch();
for (const [w, crop, scale] of [[1280, 1700, .5], [390, 1900, .5]]) {
  const html = `<body style="margin:0;background:#1a1c2c;padding:24px;display:flex;gap:24px;align-items:flex-start;font:500 14px Inter,system-ui;color:#F7F1E8">
  <div><p style="margin:0 0 8px">Before (the framed cover)</p><div style="width:${w * scale}px;height:${crop * scale}px;overflow:hidden;border-radius:8px"><img src="shots/before2/cover-${w}-newsreader.png" style="width:${w * scale}px"></div></div>
  <div><p style="margin:0 0 8px">After (full bleed, cover story button, photo departments, the letter at cover size)</p><div style="width:${w * scale}px;height:${crop * scale}px;overflow:hidden;border-radius:8px"><img src="shots/cover-${w}-newsreader.png" style="width:${w * scale}px"></div></div></body>`;
  const p = await b.newPage({ viewport: { width: Math.round(w * scale * 2 + 72), height: Math.round(crop * scale + 80) }, deviceScaleFactor: 2 });
  fs.writeFileSync(path.join(DIR, 'shots', 'sbs.html'), html.replace(/src="shots\//g, 'src="')); await p.goto('file://' + path.join(DIR, 'shots', 'sbs.html')); await p.waitForTimeout(800);
  await p.screenshot({ path: path.join(DIR, 'shots', `before-after-${w}.png`) }); await p.close();
}
await b.close(); console.log('done');
