'use strict';
/* Log parser: each line alone, for UTC day 27 Nov 2026 (and 1 Jan 2027 for the year-end range). */
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const day = new Date('2026-11-27T12:00:00Z'), ny = new Date('2027-01-01T12:00:00Z');
const lines = [
  ['- 27 Nov, x: 3 MB (M)', day], ['- 27 November 2026, x: 3 MB', day], ['- Nov 27, x: 3 MB', day], ['- November 27, 2026, x: 3 MB', day],
  ['- **27 Nov**, x: 3 MB', day], ['* 27 Nov, x: 3 MB', day], ['  + 27 Nov, x: 3 MB', day], ['- 27 Nov, x: 3 megabytes', day],
  ['- 27-11-2026, x: 3 MB', day], ['- 2026-11-27, x: 3 MB', day], ['- 28 Dec to 2 Jan, x: 3 MB', ny], ['- 26 to 28 Nov, x: 3 MB', day],
  ['- 27 Nov, x: 0.6 MB (M) plus 0 MB', day], ['- 27 Nov, x: 1.00 MB from Webflow (M); later 300 MB by hand', day],
  ['- 27 Nov, x: 5 to 57 MB (E)', day], ['- 27 Nov, x: 1,500 KB', day], ['- 27 Nov, x: 1.2 GB', day], ['- 27 Nov, x: 3MB', day],
  ['- 27 Nov 14:05 UTC, x: wf-guard cache-only run 3fa9c2, 0.00 MB from Webflow (M)', day],
  ['- Thu 27 Nov, x: 3 MB', day], ['- On 27 Nov, x: 3 MB', day], ['- 27/11, x: 3 MB', day], ['- 27.11.2026, x: 3 MB', day],
  ['1. 27 Nov, x: 3 MB', day], ['| 27 Nov | x | 3 MB |', day], ['27 Nov, x: 3 MB', day], ['- 27 Nov, x: 3 Mb', day], ['- 27 Nov, x: 3 MiB', day],
  ['- 27 Nov, x: 3 M', day], ['- 27 Nov, x: 3000000 bytes', day], ['- 27 Nov, x: about 3 MB a page for 40 pages', day],
  ['- 27th Nov, x: 3 MB', day], ['- Nov 27th, x: 3 MB', day], ['- 27 Nov. x: 3 MB', day], ['- 27Nov, x: 3 MB', day],
  ['### 27 Nov', day], ['- x: 3 MB', day],
];
for (const [l, d] of lines) {
  let r; try { r = W.lineMBForDay(l, d); } catch (e) { r = 'THROWS ' + e.name; }
  console.log(JSON.stringify(l).padEnd(92), '->', r);
}
