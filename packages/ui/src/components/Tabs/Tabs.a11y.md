## Accessibility contract

tablist/tab/tabpanel roles; selected state, stable controls/labels, hidden inactive panels.

### Keyboard behavior

Horizontal arrows wrap and skip disabled tabs, RTL mirrors arrows. Home/End. Manual Enter/Space or automatic selection. Tab exits list into active panel.

### API boundary

Horizontal only. Stable unique values, defaultValue must identify an enabled tab. No dynamic tab deletion; panels always mounted.

### Verification and limits

DOM/behavior tests: `packages/ui/src/contracts.test.tsx`. Rendered browser fixtures: `packages/e2e/tests/contracts.spec.ts`. Theme contrast checks cover allowed opaque semantic pairs, not arbitrary consumer styling.

Manual VoiceOver/Safari, actual browser zoom, and operating-system forced-colors observations have **not been performed**. See `docs/a11y-audit.md`. Automated results are not WCAG conformance.

Pattern reference: [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).
