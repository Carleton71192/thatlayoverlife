/* Region names for the story layer's flag stand-in (A4, 14 Nov 2026). Run: node src/site-layers/build-region-names-v1.cjs
   Writes src/site-layers/region-names-v1.json: every two-letter region code AA to ZZ that Intl.DisplayNames('en', {type: 'region'})
   names in Chromium (the browser of the lab checks), with the Chromium version. The site flag script (tllflagsv53) builds its table of
   country names from the same call in the reader's own browser when the page is parsed; the story layer must know the same names before
   the first paint, and building them there cost about 9 ms (40 ms on a slow phone) before the first frame, so build-site-layers-v16.py
   turns this file into a static table in the core instead. Needs Playwright (Chromium); reads nothing from the network.
   A browser whose names differ (other engines, other ICU versions) only gets a stand-in of the wrong size for those few names, which
   costs a small shift when the flags arrive; the flag script still draws the flags it finds. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const OUT = path.join(__dirname, 'region-names-v1.json');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const names = await p.evaluate(() => { const d = new Intl.DisplayNames('en', { type: 'region' }), o = [];
    for (let a = 65; a < 91; a++) for (let c = 65; c < 91; c++) { const k = String.fromCharCode(a, c), n = d.of(k); if (n !== k) o.push([k, n]); } return o; });
  const v = 'Chromium ' + b.version(); await b.close();
  fs.writeFileSync(OUT, JSON.stringify({ about: 'Intl.DisplayNames en region names, AA to ZZ, as named in ' + v + ' (build-region-names-v1.cjs)', names }, null, 0).replace(/\],\[/g, '],\n[') + '\n');
  console.log('wrote', OUT, names.length, 'names from', v);
})();
