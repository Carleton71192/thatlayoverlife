/* Copies badge.js and share.js into index.html, so the page is one self-contained document.
   Run after editing either file: node build.cjs */
const fs = require('fs'), path = require('path');
const dir = __dirname, file = path.join(dir, 'index.html');
let html = fs.readFileSync(file, 'utf8');
for (const [id, src] of [['src-badge', 'badge.js'], ['src-share', 'share.js']]) {
  const code = fs.readFileSync(path.join(dir, src), 'utf8').trim();
  if (/<\/script/i.test(code)) throw new Error(src + ' contains a closing script tag');
  const re = new RegExp('(<script id="' + id + '">\\n)[\\s\\S]*?(\\n</script>)');
  if (!re.test(html)) throw new Error('marker for ' + id + ' not found');
  html = html.replace(re, (m, a, b) => a + code + b);
}
fs.writeFileSync(file, html);
console.log('index.html rebuilt,', html.length, 'bytes');
