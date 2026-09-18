import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { auditContrast } from '../src/contrast.mjs';

const root = new URL('../', import.meta.url);
const themes = JSON.parse(await readFile(new URL('src/tokens.json', root), 'utf8'));
const foundation = JSON.parse(await readFile(new URL('src/foundation.json', root), 'utf8'));
const keys = Object.keys(themes.light);
for (const [name, tokens] of Object.entries(themes)) {
  if (Object.keys(tokens).sort().join() !== [...keys].sort().join())
    throw new Error(`Theme ${name} has inconsistent token keys`);
}
const failures = auditContrast(themes);
if (failures.length)
  throw new Error(`Contrast contract failed: ${JSON.stringify(failures, null, 2)}`);
if (!process.argv.includes('--check')) {
  await mkdir(new URL('dist/', root), { recursive: true });
  const kebab = (key) => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const foundationCss = `:root {\n${Object.entries(foundation)
    .map(([key, value]) => `  --csl-${kebab(key)}: ${value};`)
    .join('\n')}\n}\n\n`;
  const css =
    foundationCss +
    Object.entries(themes)
      .map(([name, tokens]) => {
        const selector =
          name === 'light' ? ':root, [data-theme="light"]' : `[data-theme="${name}"]`;
        return `${selector} {\n  color-scheme: ${name === 'dark' ? 'dark' : 'light'};\n${Object.entries(
          tokens,
        )
          .map(([key, value]) => `  --csl-${kebab(key)}: ${value};`)
          .join('\n')}\n}`;
      })
      .join('\n\n');
  await writeFile(new URL('dist/tokens.css', root), `${css}\n`);
  await writeFile(
    new URL('dist/tailwind.css', root),
    `@import "./tokens.css";\n\n/* Tailwind v4 resolves these semantic aliases at the consuming element. */\n@theme inline {\n${keys.map((key) => `  --color-${kebab(key)}: var(--csl-${kebab(key)});`).join('\n')}\n}\n`,
  );
  await writeFile(
    new URL('dist/index.js', root),
    `const themes = ${JSON.stringify(themes, null, 2)};\nfor (const tokens of Object.values(themes)) Object.freeze(tokens);\nexport const tokens = Object.freeze(themes);\nexport const foundation = Object.freeze(${JSON.stringify(foundation, null, 2)});\nexport const themeNames = Object.freeze(Object.keys(tokens));\nexport { auditContrast, contrastRatio, contrastContracts, luminance } from './contrast.mjs';\n`,
  );
  await writeFile(
    new URL('dist/index.d.ts', root),
    `export type ThemeName = ${Object.keys(themes)
      .map((name) => JSON.stringify(name))
      .join(
        ' | ',
      )};\nexport type TokenName = ${keys.map((key) => JSON.stringify(key)).join(' | ')};\nexport type FoundationTokenName = ${Object.keys(
      foundation,
    )
      .map((key) => JSON.stringify(key))
      .join(
        ' | ',
      )};\nexport declare const tokens: Readonly<Record<ThemeName, Readonly<Record<TokenName, string>>>>;\nexport declare const foundation: Readonly<Record<FoundationTokenName, string>>;\nexport declare const themeNames: readonly ThemeName[];\nexport { auditContrast, contrastRatio, contrastContracts, luminance } from './contrast.mjs';\n`,
  );
  await copyFile(new URL('src/contrast.mjs', root), new URL('dist/contrast.mjs', root));
  await copyFile(new URL('src/contrast.d.mts', root), new URL('dist/contrast.d.mts', root));
}
console.log(
  `Tokens: ${Object.keys(themes).length} themes, ${keys.length} semantic colors, ${fileURLToPath(root)}`,
);
