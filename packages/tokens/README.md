# Semantic tokens

Import `@csl/tokens/css` once at the application boundary. Switch themes with `data-theme="light"`, `"dark"`, or `"high-contrast"` on the root element. Import `@csl/tokens/tailwind` from a Tailwind v4 stylesheet to expose semantic color utilities. JavaScript consumers can import `tokens`, `themeNames`, and typed names from `@csl/tokens`.

`src/tokens.json` is the color source of truth; `src/foundation.json` defines shared typography, spacing, radii, and motion durations. Its exported `foundation` map has typed names and matching `--csl-space1` (etc.) variables. `pnpm --filter @csl/tokens build` generates CSS, immutable JavaScript token maps, and TypeScript declarations; it fails if theme keys diverge or an allowed contrast pair fails. `pnpm --filter @csl/tokens test` tests independently known ratios and intentional regressions.

The exported `contrastContracts` matrix defines allowed foreground/background combinations: text, muted text, links, and errors on the two surfaces require 4.5:1; control boundaries and offset focus outlines on those surfaces require 3:1; action labels on their matching accent/danger backgrounds require 4.5:1. Arbitrary palette combinations are not supported. Focus outlines require an offset so their adjacent background is a surface. Disabled text uses the same colors and remains readable.

These checks assume opaque sRGB colors and do not certify rendered pages. Transparency, overlays, images, gradients, changed consumer styles, and actual focus visibility require browser/manual inspection. The high-contrast theme is an authored theme, distinct from operating-system forced colors; the UI package must respect forced-colors system colors separately.
