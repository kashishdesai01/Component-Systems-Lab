# Engineering notes

## Native modal lifecycle

Native `dialog.close()` queues a close event. React StrictMode effect cleanup can close a dialog and reopen it before that event arrives. Synchronizing React state from the stale event would close the new modal lifecycle. The implementation ignores close events while the native element is already open and suppresses synchronous cleanup events. A packed-consumer browser regression exercises default-open StrictMode replay.

Native modal inertness excludes background content, but browser Tab navigation may reach browser chrome at an edge. The component wraps those boundaries using `tabbable` for native focusability and a small radio-group policy. Checked groups contribute the selected member; an actively focused member represents its group, and unselected groups use directional entry. Browser regressions cover checked groups, reverse entry without a selection, and editable hosts. Shadow roots, iframe contexts and nested/simultaneous modals are outside the support contract.

## Native form reset

A form reset listener runs before an ancestor React handler can cancel the event. RadioGroup defers synchronization until event propagation completes, checks `defaultPrevented`, and reads the latest controlled value. This preserves canceled resets and owner-controlled reset behavior. Uncontrolled groups return to their default selection.

## Disabled menu activation

A focusable `aria-disabled` trigger must block component-owned arrow-key opening as well as native click activation. The trigger composes consumer handlers first, respects cancellation, and guards both disabled representations before opening the popup.

## Packed-package verification

Overwriting a same-version npm file tarball can leave an existing consumer installation unchanged. Verification therefore removes the consumer installation, refreshes local archive lock entries, derives archive versions from package metadata, and compares every installed dist artifact against the current build. Registry resolutions remain locked. Standalone TypeScript and browser checks run without workspace source aliases.

## Submission lifecycle

The reference checkout permits editing → pending → success/failed transitions. A synchronous guard prevents duplicate submission timers. Pending details are immutable; unmount cancels completion work; failure preserves values for retry. Focus moves after the confirmation or restarted form renders.
