## Accessibility contract

Native button; default type=button. IconButton is a variant with a required nonempty aria-label.

### Keyboard behavior

Enter and Space activate. Native disabled removes activation/tab access; aria-disabled keeps focus and blocks click/keyboard activation.

### API boundary

Native button props and React19 refs; variants primary/secondary/ghost/danger. Consumer owns meaningful labels and busy state.

### Verification and limits

DOM/behavior tests: `packages/ui/src/contracts.test.tsx`. Rendered browser fixtures: `packages/e2e/tests/contracts.spec.ts`. Theme contrast checks cover allowed opaque semantic pairs, not arbitrary consumer styling.

Manual VoiceOver/Safari, actual browser zoom, and operating-system forced-colors observations have **not been performed**. See `docs/a11y-audit.md`. Automated results are not WCAG conformance.

Pattern reference: [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/button/).
