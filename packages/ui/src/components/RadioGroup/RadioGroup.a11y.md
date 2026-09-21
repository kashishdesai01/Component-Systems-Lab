## Accessibility contract

Native fieldset/legend; unique option values and shared native name; native required/disabled.

### Keyboard behavior

Native arrows and Space select radios. Disabled options unavailable. Uncontrolled form reset returns to defaultValue.

### API boundary

Controlled/uncontrolled value with onValueChange; native FormData. Names must be unique per logical group/form.

### Verification and limits

DOM/behavior tests: `packages/ui/src/contracts.test.tsx`. Rendered browser fixtures: `packages/e2e/tests/contracts.spec.ts`. Theme contrast checks cover allowed opaque semantic pairs, not arbitrary consumer styling.

Manual VoiceOver/Safari, actual browser zoom, and operating-system forced-colors observations have **not been performed**. See `docs/a11y-audit.md`. Automated results are not WCAG conformance.

Pattern reference: [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/radio/).
