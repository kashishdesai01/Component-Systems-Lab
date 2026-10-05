# Narrow-import performance case study

## Problem and change

The library bundles an ESM entry with compound components attached through `Object.assign`. Without purity annotations, a bundler must retain those calls and their unrelated widget implementations when the consumer imports only Button. The factories only attach static properties to newly created functions; annotating those calls as pure allows removal when their exports are unused.

## Reproduce

```sh
pnpm build:ui
node scripts/measure-bundle.mjs --without-pure
node scripts/measure-bundle.mjs
```

The baseline removes only the compound-factory purity annotations from the current built entry, keeping the same implementation and toolchain. Both runs minify one Button-only ESM export with esbuild, externalize React/react-dom/JSX runtime, and measure gzip with Node. Generated JSON is stored under `artifacts/`.

Measured during implementation: unannotated fixture 17,038 raw / 5,944 gzip bytes; annotated fixture 1,928 raw / 767 gzip bytes. Re-run after changes rather than treating these as permanent constants. The automated budget is 2 KiB gzip for this particular fixture.

## Limits

This is not total application JavaScript, runtime speed, real-user telemetry or a Core Web Vitals result. React is excluded. UI CSS is an explicit shared stylesheet, not component-split CSS. Token and UI stylesheet sizes are reported separately. The baseline is a controlled transformation for comparison, not a separate production release.
