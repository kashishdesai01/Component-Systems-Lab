import { createRequire } from 'node:module';
import { gzipSync } from 'node:zlib';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const require = createRequire(resolve('packages/ui/package.json'));
const { build } = require('esbuild');
mkdirSync('artifacts', { recursive: true });
const baseline = process.argv.includes('--without-pure');
const result = await build({
  stdin: {
    contents: "export { Button } from './packages/ui/dist/index.js'",
    resolveDir: process.cwd(),
  },
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2022',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  write: false,
  plugins: baseline
    ? [
        {
          name: 'without-pure',
          setup(builder) {
            builder.onLoad({ filter: /packages\/ui\/dist\/index\.js$/ }, (args) => ({
              contents: readFileSync(args.path, 'utf8').replace(
                /\/\* @__PURE__ \*\/ (?=Object\.assign\(Root\d*,)/g,
                '',
              ),
              loader: 'js',
            }));
          },
        },
      ]
    : [],
});
const bytes = result.outputFiles[0].contents;
const measurements = {
  fixture: 'Button-only ESM import; React external; esbuild minified; CSS measured separately',
  jsBytes: bytes.length,
  jsGzipBytes: gzipSync(bytes).length,
  uiCssBytes: readFileSync('packages/ui/dist/styles.css').length,
  tokenCssBytes: readFileSync('packages/tokens/dist/tokens.css').length,
};
writeFileSync(
  baseline ? 'artifacts/bundle-baseline.json' : 'artifacts/bundle.json',
  JSON.stringify(measurements, null, 2) + '\n',
);
console.log(JSON.stringify(measurements, null, 2));
if (!baseline && measurements.jsGzipBytes > 2048)
  throw new Error('Button-only fixture exceeds the 2 KiB gzip JavaScript budget (React excluded)');
