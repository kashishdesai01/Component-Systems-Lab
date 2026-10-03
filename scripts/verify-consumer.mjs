import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
mkdirSync('artifacts', { recursive: true });
const consumerPath = 'packages/consumer/package.json';
const consumer = JSON.parse(readFileSync(consumerPath, 'utf8'));
for (const name of ['ui', 'tokens']) {
  const version = JSON.parse(readFileSync(`packages/${name}/package.json`, 'utf8')).version;
  const archive = resolve(`artifacts/csl-${name}-${version}.tgz`);
  rmSync(archive, { force: true });
  execFileSync(
    'npm',
    ['pack', `./packages/${name}`, '--pack-destination', './artifacts', '--ignore-scripts'],
    { stdio: 'inherit' },
  );
  consumer.dependencies[`@csl/${name}`] = `file:../../artifacts/csl-${name}-${version}.tgz`;
}
writeFileSync(consumerPath, JSON.stringify(consumer, null, 2) + '\n');
// Consumer is excluded from the workspace so this installation cannot resolve
// the library through a workspace symlink or source alias.
rmSync('packages/consumer/node_modules', { recursive: true, force: true });
// Remove only the local archive records: registry dependency resolution stays
// locked while freshly packed, same-version code receives fresh integrity.
const lockPath = 'packages/consumer/package-lock.json';
try {
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  for (const name of ['ui', 'tokens']) delete lock.packages[`node_modules/@csl/${name}`];
  lock.packages[''].dependencies = consumer.dependencies;
  writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], {
  cwd: 'packages/consumer',
  stdio: 'inherit',
});
function exportedFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = prefix + entry.name;
    return entry.isDirectory()
      ? exportedFiles(`${directory}/${entry.name}`, `${relative}/`)
      : [relative];
  });
}
for (const name of ['ui', 'tokens']) {
  for (const file of exportedFiles(`packages/${name}/dist`)) {
    if (
      !readFileSync(`packages/${name}/dist/${file}`).equals(
        readFileSync(`packages/consumer/node_modules/@csl/${name}/dist/${file}`),
      )
    )
      throw new Error(`Packed ${name}/${file} does not match the current build`);
  }
}
execFileSync('npm', ['run', 'typecheck'], { cwd: 'packages/consumer', stdio: 'inherit' });
execFileSync('npm', ['run', 'build'], { cwd: 'packages/consumer', stdio: 'inherit' });
