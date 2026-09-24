## Accessibility contract

Native dialog.showModal gives modal top layer and background inertness. Title names dialog; optional simple Description only. Explicit Tab-edge wrapping uses the maintained tabbable utility and a native radio-group boundary policy.

### Keyboard behavior

Initial focus explicit ref, otherwise title then control. Native modal Tab containment; Escape closes; restore opener or explicit returnFocusRef. Scroll lock restores previous inline value.

### API boundary

One modal at a time. No nested/simultaneous modals. Light-DOM controls and editable hosts are supported; iframe contexts and shadow-root focus navigation are outside v1. Removed opener requires supplied connected fallback ref. Complex descriptions should omit Description.

### Verification and limits

DOM/behavior tests: `packages/ui/src/contracts.test.tsx`. Rendered browser fixtures: `packages/e2e/tests/contracts.spec.ts`. Theme contrast checks cover allowed opaque semantic pairs, not arbitrary consumer styling.

Manual VoiceOver/Safari, actual browser zoom, and operating-system forced-colors observations have **not been performed**. See `docs/a11y-audit.md`. Automated results are not WCAG conformance.

Pattern reference: [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
