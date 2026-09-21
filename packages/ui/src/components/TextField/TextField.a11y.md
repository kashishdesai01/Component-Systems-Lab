## Accessibility contract

Visible label uses stable useId or consumer id; hint/error/consumer descriptions compose. Error sets aria-invalid; native required is exposed.

### Keyboard behavior

Native Tab and editing behavior. Surrounding form owns validation, first-error focus, and one announcement region.

### API boundary

Native input props/refs supported. No built-in validation or independent error announcer.

### Verification and limits

DOM/behavior tests: `packages/ui/src/contracts.test.tsx`. Rendered browser fixtures: `packages/e2e/tests/contracts.spec.ts`. Theme contrast checks cover allowed opaque semantic pairs, not arbitrary consumer styling.

Manual VoiceOver/Safari, actual browser zoom, and operating-system forced-colors observations have **not been performed**. See `docs/a11y-audit.md`. Automated results are not WCAG conformance.

Reference: [WAI form labeling](https://www.w3.org/WAI/tutorials/forms/labels/).
