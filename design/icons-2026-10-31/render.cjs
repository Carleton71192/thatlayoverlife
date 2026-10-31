// Renders index.html to index.png at 1440 wide, full page. Run: node render.cjs
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const blocked = [];
  page.on('request', r => { if (!r.url().startsWith('file:')) blocked.push(r.url()); });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.screenshot({ path: path.join(__dirname, 'index.png'), fullPage: true });
  // Zoomed crop of the ink panel for close inspection at real 24px scale.
  if (process.argv.includes('--zoom')) {
    const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
    await p2.goto('file://' + path.join(__dirname, 'index.html'));
    const el = await p2.$('.panel.ink .grid');
    await el.screenshot({ path: path.join(__dirname, 'zoom-ink.png') });
  }
  await browser.close();
  console.log(blocked.length ? 'EXTERNAL REQUESTS: ' + blocked.join(', ') : 'no external requests');
})();
