## Accessibility contract

Native button inside configurable h2–h6; aria-expanded/aria-controls; collapsed panel hidden.

### Keyboard behavior

Native Enter/Space; Tab visits headers. Arrow navigation is deliberately omitted (optional APG behavior).

### API boundary

Multiple independently open panels; string[] controlled/uncontrolled value. Unique item values required.

### Verification and limits

DOM/behavior tests: `packages/ui/src/contracts.test.tsx`. Rendered browser fixtures: `packages/e2e/tests/contracts.spec.ts`. Theme contrast checks cover allowed opaque semantic pairs, not arbitrary consumer styling.

Manual VoiceOver/Safari, actual browser zoom, and operating-system forced-colors observations have **not been performed**. See `docs/a11y-audit.md`. Automated results are not WCAG conformance.

Pattern reference: [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).
