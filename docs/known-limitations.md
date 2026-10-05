# Known limitations

- Manual VoiceOver/Safari, NVDA/Firefox, actual browser zoom, text-only resize, OS forced-colors and inclusive user tests are unperformed.
- No claim of WCAG conformance, a fully accessible library, production adoption or accessibility coverage percentage.
- No nested/simultaneous dialogs, portal menus, submenus, menu check/radio items, vertical tabs, dynamic tab removal, indeterminate checkbox, Toast, Combobox, Tooltip or Table.
- Composite IDs use React useId: consumers must provide consistent server/client trees and unique value keys.
- Native controls follow browser conventions; Safari's keyboard-navigation preference changes whether plain Tab reaches non-text controls.
- Token pairs are opaque sRGB contracts. Consumer overrides, gradients and transparency need rendered checks.
- React19 is the supported peer range; React18 support has not been verified.
- Static export has no request-time SSR, ISR, Server Actions or backend. Checkout is a deterministic local simulation.
- CI, branch protection, Azure deployment and public npm publication are not verified remote results.
- Component CSS is imported as one explicit stylesheet; Button-only JavaScript tree-shaking measurements exclude React and do not claim per-component CSS splitting or total page weight.
- Modal content is light DOM; iframe browsing contexts and shadow-root focus navigation are outside v1. Prefer maintained audited primitives for production adoption.
