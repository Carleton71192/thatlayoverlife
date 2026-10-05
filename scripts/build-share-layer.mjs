// Bundles src/site-layers/tll-share-v1.js (+ src/shareables) into dist/tll-share-v1.min.js.
// The /the-map and /account HTML embeds load that file from jsDelivr, pinned to a commit SHA.
import { build } from 'esbuild';
const r = await build({
  entryPoints: ['src/site-layers/tll-share-v1.js'], bundle: true, minify: true, format: 'iife',
  globalName: 'TLLShare', target: ['es2018'], outfile: 'dist/tll-share-v1.min.js', banner: { js: '/* TLL share layer v1 · built from src/site-layers/tll-share-v1.js */' }, logLevel: 'info',
});
