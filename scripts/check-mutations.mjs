import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const cases = [
  {
    file: 'packages/ui/src/components/Accordion/Accordion.tsx',
    from: 'aria-expanded={open}',
    to: '',
    test: 'exposes expanded state and hides collapsed content',
  },
  {
    file: 'packages/ui/src/components/Dialog/Dialog.tsx',
    from: 'target.focus();',
    to: 'void target;',
    test: 'names the dialog and restores focus and scroll',
  },
];
const results = [];
for (const mutation of cases) {
  const original = readFileSync(mutation.file, 'utf8');
  if (!original.includes(mutation.from))
    throw new Error(`Mutation anchor missing: ${mutation.file}`);
  try {
    writeFileSync(mutation.file, original.replace(mutation.from, mutation.to));
    const run = spawnSync(
      process.execPath,
      [
        'node_modules/vitest/vitest.mjs',
        'run',
        'packages/ui/src/contracts.test.tsx',
        '-t',
        mutation.test,
      ],
      { encoding: 'utf8' },
    );
    const output = run.stdout + run.stderr;
    if (run.status === 0 || !output.includes('Error: expect('))
      throw new Error(`Mutation did not produce its expected assertion failure: ${output}`);
    results.push({ mutation: mutation.from, test: mutation.test, caught: true });
  } finally {
    writeFileSync(mutation.file, original);
  }
}
console.log(JSON.stringify(results, null, 2));
