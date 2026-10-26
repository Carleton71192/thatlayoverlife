// Phone tap on the /share-photos drop zone: does the photo picker open? Offline: the 13 Oct export body with today's
// site head and footer, the live page footer (23 Oct) and the send script. A file chooser event means the picker opened.
import { createRequire } from 'module'; const { chromium, devices } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const R = path.resolve(DIR, '../../../../../..');
const swap = (h, a, b, x) => { const i = h.indexOf(a), j = h.indexOf(b); if (i < 0 || j < 0) throw new Error('marker ' + a); return h.slice(0, i + a.length) + '\n' + x + '\n' + h.slice(j); };
let h = fs.readFileSync(R + '/handoff/claude-design-source/webflow-export-2026-10-13/pages/share-photos.html', 'utf8');
h = swap(h, '<!-- SITE HEAD CODE (Webflow site settings) -->', '<!-- /SITE HEAD CODE -->', fs.readFileSync(R + '/src/pages/spotlight/live-2026-10-25/site-head-after.html', 'utf8'));
h = swap(h, '<!-- SITE FOOTER CODE (Webflow site settings) -->', '<!-- /SITE FOOTER CODE -->', fs.readFileSync(R + '/src/site/site-footer-2026-10-21-after.html', 'utf8'));
h = swap(h, '<!-- PAGE FOOTER CODE -->', '<!-- /PAGE FOOTER CODE -->', fs.readFileSync(R + '/src/pages/share-photos/live-2026-10-23/page-footer-after.html', 'utf8') + '<script>' + fs.readFileSync(R + '/src/pages/share-photos/v3/tll-photo-send-v1.js', 'utf8') + '</script>' + (process.env.EXTRA ? fs.readFileSync(process.env.EXTRA, 'utf8') : ''));
h = h.replace('</head>', '<style>[data-ms-content="anonymous"]{display:none!important}[data-ms-content="members"]{display:block!important}</style></head>');
const b = await chromium.launch(); const ctx = await b.newContext({ ...devices['iPhone 13'] }); const p = await ctx.newPage();
await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://tll.test/')) return r.fulfill({ body: h, contentType: 'text/html' }); return r.abort(); });
await p.goto('http://tll.test/share-photos', { waitUntil: 'load' }).catch(() => {}); await p.waitForTimeout(1500);
const info = await p.evaluate(() => {
  const z = document.querySelector('label.tll-photos-drop'), i = document.getElementById('photos-upload'); if (!z) return { zone: false };
  z.scrollIntoView({ block: 'center' }); const r = z.getBoundingClientRect(); const pts = [[.5, .3], [.5, .5], [.2, .8]];
  return { zone: true, inputInLabel: z.contains(i), labelFor: z.getAttribute('for'), inputDisabled: i && i.disabled, inputType: i && i.type, accept: i && i.accept,
    hits: pts.map(([x, y]) => { const e = document.elementFromPoint(r.left + r.width * x, r.top + r.height * y); return e ? e.tagName.toLowerCase() + '.' + (e.className || '').toString().split(' ')[0] + (z.contains(e) ? ' (inside box)' : ' (OUTSIDE box)') : 'none'; }) };
});
console.log(JSON.stringify(info));
const box = await (await p.$('label.tll-photos-drop')).boundingBox();
let opened = false; p.on('filechooser', () => { opened = true; });
await p.touchscreen.tap(box.x + box.width / 2, box.y + box.height * 0.3); await p.waitForTimeout(800);
console.log('tap on the box opens the picker:', opened);
const target = await p.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') : 'none'; }, [box.x + box.width / 2, box.y + box.height * 0.3]);
console.log('element under the tap:', target);
/* choose two photos through the picker and check the list */
const jpg = fs.readFileSync(R + '/handoff/claude-design-source/v3/images/coast2.jpg');
const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.touchscreen.tap(box.x + box.width / 2, box.y + box.height * 0.5)]);
await fc.setFiles([{ name: 'a.jpg', mimeType: 'image/jpeg', buffer: jpg }, { name: 'b.jpg', mimeType: 'image/jpeg', buffer: jpg }]);
await p.waitForTimeout(500);
const rows = await p.evaluate(() => document.querySelectorAll('#tll-photos-list li').length);
console.log('photos listed after choosing two:', rows);
await b.close(); process.exit(opened && rows === 2 && (!process.env.EXTRA || target === 'input#photos-upload') ? 0 : 1);
