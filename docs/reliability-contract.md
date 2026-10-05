# Reliability and support contract

## Scope

Eight families: Button (including IconButton), TextField, Checkbox, RadioGroup, Tabs, Accordion, Menu, Dialog. Toast is excluded. Support is limited to the interaction and package boundaries documented below.

## State and interaction ownership

- Inputs preserve native semantics. Controlled value/checked belongs to the consumer. RadioGroup supports native FormData and synchronizes non-cancelled reset; cancelled reset leaves selection unchanged.
- Composite roots accept controlled or uncontrolled state and notify through callbacks. Consumers must keep controlled/uncontrolled mode stable. Tab and accordion values must be unique and stable; active tab must remain enabled.
- Tabs support horizontal LTR/RTL navigation and manual/automatic activation. No tab deletion or asynchronous panels. Automatic activation is intended for immediately available content.
- Menu is an action popup, not navigation. Disabled items remain inspectable but cannot activate. Escape restores the trigger; Tab and Shift+Tab exit from the trigger's document position. Outside interactions close without restoring focus over the user's chosen target.
- Dialog uses native showModal for top-layer/inert behavior plus scoped Tab-edge wrapping. One modal at a time, no nested or simultaneous dialogs. Initial focus stays inside content. A removed opener needs an explicit connected returnFocusRef. Close cleanup restores scroll and skips stale native close events after StrictMode replay.
- Modal tab stops use `tabbable` and normalize native radio groups to the active/selected or directional entry member. Contenteditable hosts are covered. Shadow roots and iframe contexts are excluded from v1.
- Consumer handlers may cancel relevant interaction defaults with preventDefault. Required semantic relationships remain owned by the component.

## Reference application

Checkout is local and simulated. Typed Redux actions define editing → pending → success/failed. Pending submissions lock edits and duplicate events cannot create a second timer. Unmount cancels completion work. Failures preserve entered details. Confirmation and restart focus happen after render. No backend, payment, persistence, or real order exists.

## Package consumption

Import token CSS and UI CSS explicitly. React is a peer dependency. A separate fixture installs packed tokens/UI without workspace aliases, checks declarations, verifies installed bytes against current dist, and tests runtime/focus/rendered colors. Repeated verification removes the consumer installation and refreshes only local archive lock entries. Generated artifacts are built before dependent checks.

## Evidence boundary

Unit tests cover state/DOM behavior; browser tests cover named rendered states in Chromium/Firefox/WebKit. axe reports automatically detectable issues only. Token checks cover the allowed opaque semantic matrix. Browser emulation of reduced motion/forced colors is not an OS or screen-reader audit. Screen-reader, actual browser zoom and user-testing observations remain NOT RUN until entered in the manual audit log.

## Delivery

CI workflow is defined locally, not remotely executed. Required checks must be configured on the eventual GitHub repository before claiming merge blocking. Azure deployment requires a configured resource and secret; the workflow builds/verifies the static export. No remote publication/deployment is implied by this implementation.
