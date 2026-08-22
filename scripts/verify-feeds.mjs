#!/usr/bin/env node
// Check every feed in src/feeds.js: is it reachable, is it really a feed, does
// it parse, and does robots.txt say anything about it.
//
//   npm run verify-feeds           check and report
//   npm run verify-feeds -- --apply  check, then write the changes to src/feeds.js
//
// Run this before the first deploy and any time the wire looks thin.

import { readFileSync, writeFileSync } from 'node:fs';
import { FEEDS } from '../src/feeds.js';
import { parseFeed } from '../src/xml.js';
import { applyFlags } from './lib/feed-flags.mjs';

const APPLY = process.argv.includes('--apply');

const TIMEOUT_MS = 15000;
const UA = 'TLLTravelWire/1.0 (+https://thatlayover.life; headline aggregator)';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

async function get(url) {
  return fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml, */*' },
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

async function robotsNote(feedUrl) {
  try {
    const { origin, pathname } = new URL(feedUrl);
    const response = await get(`${origin}/robots.txt`);
    if (!response.ok) return 'no robots.txt';
    const text = await response.text();
    // Only the lines that could plausibly cover the feed path itself.
    const disallowed = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^disallow:/i.test(line))
      .map((line) => line.split(':')[1]?.trim())
      .filter((path) => path && path !== '/' && pathname.startsWith(path));
    return disallowed.length ? `robots.txt disallows ${disallowed.join(', ')}` : 'robots.txt OK for this path';
  } catch {
    return 'robots.txt unreachable';
  }
}

async function check(feed) {
  const result = { feed, ok: false, detail: '', items: 0, robots: '' };
  try {
    const response = await get(feed.url);
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (!response.ok) {
      result.detail = `HTTP ${response.status}`;
      return result;
    }
    const body = await response.text();
    const items = parseFeed(body);
    result.items = items.length;
    if (!items.length) {
      result.detail = contentType.includes('html')
        ? 'served HTML, not a feed'
        : `parsed 0 items (content-type ${contentType || 'unknown'})`;
      return result;
    }
    const withLinks = items.filter((item) => item.link).length;
    result.ok = true;
    result.detail = `${items.length} items, ${withLinks} with links`;
    result.robots = await robotsNote(feed.url);
    return result;
  } catch (error) {
    result.detail = error?.name === 'TimeoutError' ? 'timed out' : String(error?.message || error);
    return result;
  }
}

const results = await Promise.all(FEEDS.map(check));

console.log('\nThe Travel Wire, feed check\n');
for (const result of results) {
  const state = result.ok ? `${GREEN}WORKS${RESET}` : `${RED}FAILS${RESET}`;
  const flag = result.feed.enabled ? 'enabled' : 'disabled';
  console.log(`${state}  ${result.feed.source} ${DIM}(${flag})${RESET}`);
  console.log(`       ${result.feed.url}`);
  console.log(`       ${result.detail}`);
  if (result.robots) console.log(`       ${result.robots}`);
  console.log('');
}

const turnOn = results.filter((r) => r.ok && !r.feed.enabled);
const turnOff = results.filter((r) => !r.ok && r.feed.enabled);
const changes = [
  ...turnOn.map((r) => ({ id: r.feed.id, enabled: true, source: r.feed.source })),
  ...turnOff.map((r) => ({ id: r.feed.id, enabled: false, source: r.feed.source })),
];

if (!changes.length) {
  console.log(`${GREEN}No changes needed. src/feeds.js matches what is live.${RESET}\n`);
  process.exit(results.some((r) => r.ok) ? 0 : 1);
}

if (APPLY) {
  const path = new URL('../src/feeds.js', import.meta.url);
  const before = readFileSync(path, 'utf8');
  writeFileSync(path, applyFlags(before, changes));
  console.log(`${GREEN}Updated src/feeds.js:${RESET}`);
  for (const change of changes) {
    console.log(`       ${change.source} is now ${change.enabled ? 'ON' : 'OFF'}`);
  }
  console.log(`\n${DIM}Deploy the change with: npx wrangler deploy${RESET}\n`);
} else {
  if (turnOn.length) {
    console.log(`${YELLOW}These work but are switched off:${RESET} ${turnOn.map((r) => r.feed.id).join(', ')}`);
  }
  if (turnOff.length) {
    console.log(`${YELLOW}These are switched on but do not work:${RESET} ${turnOff.map((r) => r.feed.id).join(', ')}`);
  }
  console.log(`\n${DIM}Run "npm run verify-feeds -- --apply" to make these changes for you.${RESET}\n`);
}

// A run where nothing at all worked is a failure worth noticing in a script.
process.exit(results.some((r) => r.ok) ? 0 : 1);
