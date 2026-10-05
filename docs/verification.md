# Local verification evidence

Recorded October 11, 2026 (America/Los_Angeles). Shell Node 22.23.2; pnpm 11.25.0. This is local evidence, not an executed GitHub Actions run.

| Check                       | Result                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `pnpm verify`               | PASS: types, lint, unit tests, production build, packed consumer and browser suites                              |
| Unit tests                  | 39 PASS across four files                                                                                        |
| Token matrix                | 45 allowed color pairs across three themes PASS; altered-color failure test PASS                                 |
| Docs browser suite          | 103 PASS, 0 failed, 0 flaky; Chromium, Firefox, WebKit                                                           |
| Intentional browser skips   | 2: forced-colors/reduced-motion emulation gate is Chromium-only                                                  |
| Route coverage              | All 13 authored routes scanned and tested at 320 CSS pixels                                                      |
| Packed consumer             | Standalone declarations, byte equality for every dist file, Vite build and 5 Chromium browser checks PASS        |
| StrictMode and modal edges  | Native replay, checked/unselected radio boundaries and editable hosts PASS                                       |
| Clean source copy           | Frozen offline install with no prebuilt artifacts, then `pnpm test`: 39 PASS                                     |
| Two sentinel mutations      | Removing Accordion expanded state / Dialog focus return produced expected assertion failures; originals restored |
| Narrow-import bundle budget | PASS: 767 gzip bytes for the documented Button-only fixture; React and CSS excluded                              |
| Unit V8 coverage            | 84.01% lines, 79.94% statements, 66.66% branches, 86.48% functions for configured UI/token scope                 |
| Visual inspection           | Desktop 1440px and mobile 390px checkout screenshots inspected; no clipping observed                             |
| Independent final review    | No remaining actionable correctness or engineering-practices blocker found within the support contract           |

## axe review

The final suite recorded 72 axe scans with zero detected violations. Inconclusive results are retained, not silently discarded: popup `aria-controls` review (9 rule occurrences) and color contrast (21 occurrences across overlapping popup/background, top-layer description and a decorative check symbol).

Explicit browser assertions verify that every rendered aria-controls reference resolves and that modal description computed sRGB foreground/background pairs meet 4.5:1. Background content covered by an open popup is an expected overlay state; the success symbol is decorative and redundant with the confirmation heading. These checks do not establish visual usability or screen-reader behavior in every environment. Manual inspection remains necessary before broader accessibility claims.

## Artifact locations

`coverage/`, `packages/e2e/playwright-report/`, `artifacts/bundle.json`, `artifacts/bundle-baseline.json`, and desktop/mobile PNGs under `artifacts/` are generated locally and ignored by version control. CI is configured to retain coverage and Playwright reports.

The packed consumer smoke suite is Chromium-only; core docs interaction checks run in all three engines. The UI focus utility is deliberately browser-tested rather than represented as jsdom layout coverage. The Vite SPA consumer warns that a server-component directive is not preserved in its final SPA bundle; Next consumes the original directive correctly during its static build.

## Not run

VoiceOver/Safari and other screen-reader audits; actual browser zoom and text-only resizing; OS forced-colors; inclusive user testing; remote CI/rulesets; Azure deployment; npm publication; production adoption or performance telemetry. See `a11y-audit.md` and `known-limitations.md`.
