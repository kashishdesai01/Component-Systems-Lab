# Manual accessibility audit

No screen-reader audit has been performed in this implementation session. Entries below are a coverage ledger, not passing results. Never convert automated tests into a manual observation.

| Family              | VoiceOver/Safari | Browser zoom / text resize | OS forced colors |
| ------------------- | ---------------- | -------------------------- | ---------------- |
| Button / IconButton | NOT RUN          | NOT RUN                    | NOT RUN          |
| TextField           | NOT RUN          | NOT RUN                    | NOT RUN          |
| Checkbox            | NOT RUN          | NOT RUN                    | NOT RUN          |
| RadioGroup          | NOT RUN          | NOT RUN                    | NOT RUN          |
| Tabs                | NOT RUN          | NOT RUN                    | NOT RUN          |
| Accordion           | NOT RUN          | NOT RUN                    | NOT RUN          |
| Menu                | NOT RUN          | NOT RUN                    | NOT RUN          |
| Dialog              | NOT RUN          | NOT RUN                    | NOT RUN          |

## Recording a real run

Record date, source commit or source hash, OS/browser/screen-reader versions, keyboard-navigation settings, route/state, exact steps, expected behavior, actual observed announcement/focus, pass/fail, fix, and retest reference. Test navigation and reading modes. Include the checkout's submit errors, retry, pending update and confirmation.

For Safari, record the keyboard-navigation setting; default macOS settings can skip non-text controls during Tab navigation. Local WebKit automation uses Option+Tab on macOS for full-control navigation; this does not demonstrate VoiceOver behavior.

## Zoom procedure

Use actual browser zoom with a documented initial viewport (for example 1280 CSS pixels at 100% then 400%); verify non-excepted content at equivalent 320 CSS pixels without information loss or two-dimensional reading scroll. Separately resize text to 200%. A 320px automated viewport check is useful, but is not recorded here as a browser-zoom observation.
