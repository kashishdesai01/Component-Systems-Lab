## Accessibility contract

Action menu only; trigger aria-haspopup/expanded; labeled menu and menuitems. Disabled items use aria-disabled, remain inspectable.

### Keyboard behavior

Enter/Space/ArrowDown open first item; ArrowUp last. Arrows wrap, Home/End, buffered typeahead. Escape restores trigger. Tab/ShiftTab exit from trigger position.

### API boundary

No submenus, navigation links, checkable items, or portals. Outside pointer/focus closes without stealing focus. Consumer may cancel events with preventDefault.

### Verification and limits

DOM/behavior tests: `packages/ui/src/contracts.test.tsx`. Rendered browser fixtures: `packages/e2e/tests/contracts.spec.ts`. Theme contrast checks cover allowed opaque semantic pairs, not arbitrary consumer styling.

Manual VoiceOver/Safari, actual browser zoom, and operating-system forced-colors observations have **not been performed**. See `docs/a11y-audit.md`. Automated results are not WCAG conformance.

Pattern reference: [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/).
