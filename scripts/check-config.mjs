#!/usr/bin/env node
// Runs automatically before `npm run deploy`. Catches the setup step that is
// easiest to skip, so the failure reads as a missing step rather than as a
// Cloudflare API error.

import { readFileSync } from 'node:fs';

const PLACEHOLDER = 'REPLACE_WITH_YOUR_KV_NAMESPACE_ID';
const config = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');

if (config.includes(PLACEHOLDER)) {
  console.error(`
\x1b[31mThe KV namespace has not been set up yet.\x1b[0m

wrangler.toml still says ${PLACEHOLDER}, so there is nowhere
to store the wire and the deploy would be rejected by Cloudflare.

Run this first, then deploy again:

  npm run setup-kv
`);
  process.exit(1);
}
