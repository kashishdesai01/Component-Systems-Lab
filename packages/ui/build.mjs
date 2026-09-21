import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  format: 'esm',
  target: 'es2022',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  sourcemap: true,
  minify: false,
});
// Keep the stylesheet as an explicit import, avoiding CSS injection at runtime.
execFileSync('pnpm', ['exec', 'tsc', '--emitDeclarationOnly'], { stdio: 'inherit' });
execFileSync(process.execPath, [
  '-e',
  "require('fs').renameSync('dist/index.css','dist/styles.css')",
]);
