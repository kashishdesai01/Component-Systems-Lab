## Accessibility contract

Native input type=checkbox and clickable label; optional associated hint.

### Keyboard behavior

Native Space toggle, Tab, and uncontrolled form reset. Controlled state belongs to the caller.

### API boundary

Binary selection only; indeterminate state is deferred. Group related checkboxes in a labeled fieldset.

### Verification and limits

DOM/behavior tests: `packages/ui/src/contracts.test.tsx`. Rendered browser fixtures: `packages/e2e/tests/contracts.spec.ts`. Theme contrast checks cover allowed opaque semantic pairs, not arbitrary consumer styling.

Manual VoiceOver/Safari, actual browser zoom, and operating-system forced-colors observations have **not been performed**. See `docs/a11y-audit.md`. Automated results are not WCAG conformance.

Pattern reference: [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/).
