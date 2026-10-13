#!/usr/bin/env node
// render-check.mjs
// Opens one exported page through file://, blocks every http(s) request, screenshots it
// at desktop and phone widths, and prints one JSON line with a few health numbers.
//
// Usage: node scripts/export/render-check.mjs <html file> <shotsDir> <slug>

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const [file, shotsDir, slug] = process.argv.slice(2);
if (!file || !shotsDir || !slug) {
  process.stderr.write('usage: render-check.mjs <html file> <shotsDir> <slug>\n');
  process.exit(1);
}
const htmlPath = path.resolve(file);
if (!fs.existsSync(htmlPath)) {
  process.stderr.write(`render-check: file not found ${htmlPath}\n`);
  process.exit(1);
}
fs.mkdirSync(shotsDir, { recursive: true });

const url = pathToFileURL(htmlPath).href;

async function shoot(browser, width, height, suffix, consoleErrors) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 0.5 });
  const page = await context.newPage();
  await page.route(/^https?:\/\//, (r) => r.abort());
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(String(e.message || e)));
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(shotsDir, `${slug}-${suffix}.png`), fullPage: true });
  const stats = await page.evaluate(() => {
    const text = document.body ? document.body.innerText || '' : '';
    const count = (re) => (text.match(re) || []).length;
    return {
      bodyTextLength: text.replace(/\s+/g, ' ').trim().length,
      elementCount: document.querySelectorAll('*').length,
      hasNav: !!document.querySelector('.tll-nav-v1'),
      hasFooter: !!document.querySelector('[data-tll-canonical-footer]'),
      badStrings: count(/\bundefined\b/g) + count(/\[object Object\]/g) + count(/\bNaN\b/g),
      images: document.images.length,
    };
  });
  await context.close();
  return stats;
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
try {
  const consoleErrors = [];
  const desktop = await shoot(browser, 1280, 900, '1280', consoleErrors);
  await shoot(browser, 390, 844, '390', consoleErrors);
  const out = {
    slug,
    consoleErrors: consoleErrors.slice(0, 5),
    bodyTextLength: desktop.bodyTextLength,
    elementCount: desktop.elementCount,
    hasNav: desktop.hasNav,
    hasFooter: desktop.hasFooter,
    badStrings: desktop.badStrings,
    images: desktop.images,
    emptyPage: desktop.bodyTextLength < 40,
  };
  process.stdout.write(JSON.stringify(out) + '\n');
} finally {
  await browser.close();
}
