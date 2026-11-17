# Layout shift sweep, adversarial check (17 November 2026)

In progress. This file is replaced by the full notes when the sets are done.

- Checked: branch claude/cls-sweep-2026-11-16 at afe01e7 (core sha384-rm9a+UhE...), against the live 16.66.0 core, both routed from local files.
- Harness: harness/lib.cjs (routes, probes), harness/scen.cjs (every scenario), harness/adv.cjs (runner), harness/an.py (pairs the two arms).
- Raw records: results/<set>.jsonl.gz, one line per scenario and arm. Hashes, counts and element names only; no page text.
