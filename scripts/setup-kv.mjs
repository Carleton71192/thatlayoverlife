#!/usr/bin/env node
// Creates the Workers KV namespace and writes its id into wrangler.toml, so
// there is no copying long ids by hand.
//
//   npm run setup-kv
//
// Safe to run twice: if wrangler.toml already holds a real id it stops and
// leaves it alone unless you pass --force.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const PLACEHOLDER = 'REPLACE_WITH_YOUR_KV_NAMESPACE_ID';
const CONFIG = new URL('../wrangler.toml', import.meta.url);
const FORCE = process.argv.includes('--force');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function fail(message, hint) {
  console.error(`\n${RED}${message}${RESET}`);
  if (hint) console.error(`${DIM}${hint}${RESET}`);
  console.error('');
  process.exit(1);
}

const config = readFileSync(CONFIG, 'utf8');
const current = config.match(/^\s*id\s*=\s*"([^"]+)"/m)?.[1];

if (current && current !== PLACEHOLDER && !FORCE) {
  console.log(`\n${GREEN}wrangler.toml already points at a KV namespace.${RESET}`);
  console.log(`${DIM}id = "${current}"`);
  console.log(`Pass --force to create a new one and overwrite this.${RESET}\n`);
  process.exit(0);
}

// Check the login first. If wrangler decided to prompt mid-command its question
// would be captured rather than shown, and this would look like a hang.
let whoami = '';
try {
  whoami = execFileSync('npx', ['wrangler', 'whoami'], { encoding: 'utf8', stdio: ['inherit', 'pipe', 'pipe'] });
} catch (error) {
  whoami = `${error.stdout || ''}${error.stderr || ''}`;
}
if (/not authenticated|not logged in|CLOUDFLARE_API_TOKEN/i.test(whoami)) {
  fail('Cloudflare is not logged in yet.', 'Run this first, then try again:\n\n  npx wrangler login\n');
}
const account = whoami.match(/associated with the email ([^\s.]+@[^\s.]+\.[^\s]+)/i)?.[1];
if (account) console.log(`${DIM}Logged in as ${account}${RESET}`);

console.log('\nCreating the KV namespace on your Cloudflare account...\n');

let output;
try {
  output = execFileSync('npx', ['wrangler', 'kv', 'namespace', 'create', 'WIRE_KV'], {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
  });
} catch (error) {
  const detail = `${error.stdout || ''}${error.stderr || ''}`;
  console.error(detail.trim());
  if (/not (logged in|authenticated)|login|OAuth|credentials|CLOUDFLARE_API_TOKEN/i.test(detail)) {
    fail('Cloudflare is not logged in yet.', 'Run this first:  npx wrangler login');
  }
  fail('Could not create the KV namespace.', 'The wrangler output above says why.');
}

console.log(output.trim());

// Wrangler prints the id inside the config block it suggests. Versions differ on
// the surrounding text, so match the id itself.
const id = output.match(/id\s*=\s*"([0-9a-f]{32})"/i)?.[1]
  || output.match(/"id":\s*"([0-9a-f]{32})"/i)?.[1];

if (!id) {
  fail(
    'The namespace was created but its id could not be read from the output above.',
    'Copy the id yourself into wrangler.toml, replacing REPLACE_WITH_YOUR_KV_NAMESPACE_ID.',
  );
}

const updated = current
  ? config.replace(/^(\s*id\s*=\s*)"[^"]*"/m, `$1"${id}"`)
  : config;

if (updated === config && current !== id) {
  fail('Could not find the id line in wrangler.toml to update.');
}

writeFileSync(CONFIG, updated);
console.log(`\n${GREEN}Done. wrangler.toml now points at your namespace.${RESET}`);
console.log(`${DIM}id = "${id}"${RESET}`);
console.log('\nNext:  npx wrangler deploy\n');
