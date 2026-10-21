// Edit profile v2 smoke test (21 Oct 2026): assembles the page parts with a fake Memberstack and checks the 3.4 blocks in Chromium at 390 px.
// Build the page first: see handoff/packet-d/BUILD-EDIT-PROFILE-3.4-2026-10-21.md. Run: node tools/edit-profile-smoke.mjs <assembled.html>
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Playwright lives in the global modules here, not in the repo, so resolve it either way.
const { chromium } = (() => { try { return require('playwright'); } catch { return require('/opt/node-tools/node_modules/playwright'); } })();
const html = (await import('node:fs')).readFileSync(process.argv[2], 'utf8');
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.route('**/*', r => r.request().url().startsWith('data:') ? r.continue() : r.abort());
await page.setContent(html, { waitUntil: 'load' });
// fake Memberstack after load: member with some fields, JSON with a pet and a snapshot
await page.evaluate(() => {
  const member = { id: 'mem_x', profileImage: '', customFields: { name: 'Jay Carleton', 'home-base': 'Copenhagen, Denmark', 'from-and-lived-in': 'us,br,dk', languages: 'English, Danish', 'custom-slug': 'jay-carleton', 'instagram-url': 'https://instagram.com/x', 'list-expats': 'true' } };
  let json = { pets: [{ id: 'senhor-magnus-waffles-mvhkjqix', name: 'Senhor Magnus Waffles', breed: 'Samoyed', countries: ['Denmark', 'Brazil'] }], tllSnapshot: { countries: 57, places: 58, layovers: 6, antarctica: true }, other: 'keep' };
  window.__calls = [];
  window.$memberstackDom = {
    getCurrentMember: async () => ({ data: member }),
    getMemberJSON: async () => ({ data: json }),
    updateMember: async (x) => { window.__calls.push(['updateMember', x]); return {}; },
    updateMemberJSON: async (x) => { window.__calls.push(['updateMemberJSON', x.json]); json = x.json; return {}; },
    getMemberCookie: () => 'tok',
  };
});
await page.waitForTimeout(900);
const t = (sel) => page.locator(sel).first().innerText().catch(() => null);
const out = {};
out.stage = await t('[data-ep-dev-stage]'); out.count = await t('[data-ep-dev-count]'); out.next = await t('[data-ep-dev-next]');
out.nav = await page.locator('.ep-nav a').allInnerTexts();
out.desksHidden = await page.locator('[data-ep-desks]').evaluate(e => e.hidden); out.desksH = await t('[data-ep-desks-h]');
out.deskRows = await page.locator('.ep-desk').count();
out.crewRows = await page.locator('.ep-crew-row').count(); out.crewLine = await t('[data-ep-crewline]');
out.petCards = await page.locator('[data-ep-petcards] .ep-card').count(); out.petLine = await t('[data-ep-petcards] .ep-card small');
out.langs = await t('[data-ep-pv-langs]'); out.gray = await page.locator('[data-ep-pv]').evaluate(e => e.style.filter);
out.stories = await t('[data-ep-stories-line]');
// interactions: add a desk, toggle NOW, invite crew, then wait for the save
await page.fill('[data-ep-deskq]', 'Portugal'); await page.press('[data-ep-deskq]', 'Enter');
await page.click('[data-ep-desk-now="0"]');
await page.fill('[data-ep-crewq]', '@nancy'); await page.press('[data-ep-crewq]', 'Enter');
await page.waitForTimeout(1400);
out.deskRowsAfter = await page.locator('.ep-desk').count(); out.desksHAfter = await t('[data-ep-desks-h]');
out.now0 = await t('[data-ep-desk-now="0"]');
out.crewRowsAfter = await page.locator('.ep-crew-row').count(); out.wait = await page.locator('.ep-wait').count();
out.calls = await page.evaluate(() => window.__calls.map(c => c[0] === 'updateMemberJSON' ? ['updateMemberJSON', Object.keys(c[1]), (c[1].tllDesks || []).length, (c[1].tllCrew || []).length] : [c[0], Object.keys(c[1].customFields || {})]));
out.status = await t('[data-ep-status]');
out.scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
out.errors = errors.filter(e => !/net::ERR_FAILED|Failed to load resource|fetch/i.test(e));
console.log(JSON.stringify(out, null, 1));
await browser.close();
