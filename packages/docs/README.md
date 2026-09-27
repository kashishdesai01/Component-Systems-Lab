# Component Systems Lab documentation

Next.js App Router static export with MDX-rendered accessibility contracts imported directly from the UI package source. The reference checkout consumes the public `@csl/ui` entry point and generated CSS exports.

## Routes

- `/`: project introduction and eight-family inventory.
- `/components/{button,textfield,checkbox,radiogroup,tabs,accordion,menu,dialog}/`: usage, live example, and colocated accessibility contract.
- `/lab/`: stable interaction fixtures for browser verification.
- `/checkout/`: fictional Fieldwork Café reference application.

## Checkout state and failure model

Each mounted checkout owns one Redux store. Email, pickup name, pickup time, reusable-cup preference, and submission state live in the slice. Validation errors and the form announcement are local presentation state. Validation focuses the first invalid field. The form owns one polite announcement region; field descriptions are not separate live regions.

Submission runs a deterministic 700 ms simulation, disables editable controls while pending, and presents either a recoverable failure or confirmation. A synchronous guard rejects repeated submissions, and unmount cancels the completion timer. Narrow reducer actions enforce the editing → pending → success/failure lifecycle and keep pending/confirmed data immutable. Failure keeps form values and permits retry. Confirmation receives focus; restarting returns focus to the email field after the new form renders. The expandable scenario control allows reproducible failure without external services. The browser does not send or persist personal details. Theme preference alone is stored locally, with storage failure tolerated.

This demo does not model payment, actual inventory, server-side validation, or order idempotency across network requests. A deployed production checkout would need those contracts.

## Boundaries

The site is generated at build time; it does not claim request-time SSR or ISR. Theme switching happens after hydration. Automated tests do not establish screen-reader compatibility or WCAG conformance by themselves. Record manual screen-reader, zoom, text-resize, and forced-colors observations in the root audit record.
