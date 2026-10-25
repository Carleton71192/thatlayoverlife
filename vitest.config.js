// The story Worker in worker/ has its own tests written for node:test (run: node --test worker/test/*.test.js).
// Without this exclude, vitest collects them too and reports three "failed" files with no suites in them.
// A plain object (no import from 'vitest/config') so it also works when vitest runs through npx without a local install.
export default {
  test: { exclude: ['**/node_modules/**', '**/.git/**', 'worker/**'] },
};
